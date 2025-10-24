import { Router, Response } from 'express';
import { prisma } from '../lib/prisma';
import { LeadSource } from '@prisma/client';
import { AuthenticatedRequest, SuccessResponse, ErrorResponse } from '../types';
import { tenantMiddleware } from '../middleware/tenant';
import { LeadNotificationService } from '../lib/email/LeadNotificationService';
import {
  convertLeadToService,
  convertTrialToService,
  safeString,
  safeStringWithDefault,
  DEFAULT_VALUES,
  LeadData,
} from '../types';

const router = Router();
const leadNotificationService = new LeadNotificationService();

/**
 * POST /api/leads/demo
 * Solicitar demonstração
 */
router.post('/demo', async (req, res) => {
  try {
    const { name, email, phone, company, position, message } = req.body;

    if (!name || !email || !company) {
      return res.status(400).json({
        error: 'Bad request',
        message: 'Nome, email e empresa são obrigatórios',
      });
    }

    const lead = await prisma.lead.create({
      data: {
        name,
        email,
        phone: phone || undefined,
        company,
        position: position || undefined,
        source: LeadSource.DEMO_REQUEST,
        message: message || undefined,
        metadata: {
          userAgent: req.headers['user-agent'],
          ip: req.ip,
          timestamp: new Date().toISOString(),
        },
      },
    });

    // Enviar notificação para equipe de vendas
    try {
      await leadNotificationService.notifyDemoRequest(convertLeadToService(lead as any));
    } catch (emailError) {
      console.error('Erro ao enviar notificação de demo:', emailError);
      // Não falha o request se o email falhar
    }

    // Adicionar à automação de marketing
    try {
      await leadNotificationService.addToMarketingAutomation(convertLeadToService(lead as any));
    } catch (marketingError) {
      console.error('Erro ao adicionar lead à automação de marketing:', marketingError);
      // Não falha o request se a automação falhar
    }

    return res.status(201).json({
      message: 'Solicitação de demo recebida com sucesso',
      leadId: lead.id,
    });
  } catch (error) {
    console.error('Demo request error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: 'Erro interno do servidor',
    });
  }
});

/**
 * POST /api/leads/trial
 * Iniciar trial gratuito
 */
router.post('/trial', async (req, res) => {
  try {
    const {
      // Dados do lead
      name,
      email,
      phone,
      position,

      // Dados da prefeitura
      companyName,
      cnpj,
      population,
      domain,

      // Dados do usuário admin
      adminPassword,
    } = req.body;

    if (!name || !email || !companyName || !cnpj) {
      return res.status(400).json({
        error: 'Bad request',
        message: 'Nome, email, nome da prefeitura e CNPJ são obrigatórios',
      });
    }

    // Verificar se CNPJ já existe
    const existingTenant = await prisma.tenant.findUnique({
      where: { cnpj },
    });

    if (existingTenant) {
      return res.status(409).json({
        error: 'Conflict',
        message: 'Este CNPJ já possui uma conta no sistema',
      });
    }

    // Verificar se domínio já existe (se fornecido)
    if (domain) {
      const existingDomain = await prisma.tenant.findUnique({
        where: { domain },
      });

      if (existingDomain) {
        return res.status(409).json({
          error: 'Conflict',
          message: 'Este domínio já está em uso',
        });
      }
    }

    // Criar lead
    const lead = await prisma.lead.create({
      data: {
        name,
        email,
        phone: phone || undefined,
        company: companyName,
        position: position || undefined,
        source: LeadSource.TRIAL_SIGNUP,
        status: 'CONVERTED',
        metadata: {
          cnpj,
          population,
          domain,
          userAgent: req.headers['user-agent'],
          ip: req.ip,
          timestamp: new Date().toISOString(),
        },
      },
    });

    // Criar tenant trial
    const tenant = await prisma.tenant.create({
      data: {
        name: companyName,
        cnpj,
        domain: domain || null,
        plan: 'STARTER',
        status: 'TRIAL',
        population: population || null,
        limits: {
          users: 10,
          protocols: 1000,
          storage: 1024,
          departments: 5,
        },
      },
    });

    // Associar lead ao tenant
    await prisma.lead.update({
      where: { id: lead.id },
      data: { tenantId: tenant.id },
    });

    // Criar departamentos padrão
    const defaultDepartments = [
      'Saúde',
      'Educação',
      'Assistência Social',
      'Cultura',
      'Segurança Pública',
      'Planejamento Urbano',
      'Agricultura',
      'Esportes',
      'Turismo',
      'Habitação',
      'Meio Ambiente',
      'Obras Públicos',
      'Serviços Públicos',
    ];

    await Promise.all(
      defaultDepartments.map(deptName =>
        prisma.department.create({
          data: {
            name: deptName,
            description: `Secretaria Municipal de ${deptName}`,
            tenantId: tenant.id,
          },
        })
      )
    );

    // Criar usuário administrador
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash(adminPassword || '123456', 12);

    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        role: 'ADMIN',
        tenantId: tenant.id,
      },
    });

    // Configurar expiração do trial (30 dias)
    try {
      await leadNotificationService.setupTrialExpiration(tenant.id, 30);
    } catch (trialError) {
      console.error('Erro ao configurar expiração do trial:', trialError);
      // Não falha o request se a configuração falhar
    }

    // Enviar email de boas-vindas com instruções de acesso
    try {
      const loginUrl = tenant.domain
        ? `https://${tenant.domain}.digiurban.com/admin/login`
        : 'https://app.digiurban.com/admin/login';

      await leadNotificationService.sendTrialWelcomeEmail(
        convertTrialToService({
          id: lead.id,
          name: lead.name,
          email: lead.email,
          company: lead.company || '',
          phone: lead.phone || null,
          position: lead.position || null,
          message: null,
          source: String(lead.source),
          createdAt: lead.createdAt,
          tenantId: tenant.id,
          tenantName: tenant.name,
          cnpj: tenant.cnpj,
          domain: tenant.domain || null,
          population: tenant.population || null,
          loginUrl,
          temporaryPassword: adminPassword || '123456',
        })
      );
    } catch (emailError) {
      console.error('Erro ao enviar email de boas-vindas:', emailError);
      // Não falha o request se o email falhar
    }

    return res.status(201).json({
      message: 'Trial criado com sucesso',
      tenant: {
        id: tenant.id,
        name: tenant.name,
        domain: tenant.domain,
        status: tenant.status,
      },
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      accessInfo: {
        loginUrl: tenant.domain
          ? `https://${tenant.domain}.digiurban.com/login`
          : 'https://digiurban.com/login',
        email: user.email,
        temporaryPassword: adminPassword || '123456',
      },
    });
  } catch (error) {
    console.error('Trial signup error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: 'Erro interno do servidor',
    });
  }
});

/**
 * POST /api/leads/newsletter
 * Inscrição na newsletter
 */
router.post('/newsletter', async (req, res) => {
  try {
    const { email, name } = req.body;

    if (!email) {
      return res.status(400).json({
        error: 'Bad request',
        message: 'Email é obrigatório',
      });
    }

    // Verificar se já está inscrito
    const existingLead = await prisma.lead.findFirst({
      where: {
        email,
        source: LeadSource.NEWSLETTER,
      },
    });

    if (existingLead) {
      return res.status(409).json({
        error: 'Conflict',
        message: 'Este email já está inscrito na newsletter',
      });
    }

    const lead = await prisma.lead.create({
      data: {
        name: safeString(name),
        email,
        company: '', // Valor padrão para newsletter
        source: LeadSource.NEWSLETTER,
        metadata: {
          userAgent: req.headers['user-agent'],
          ip: req.ip,
          timestamp: new Date().toISOString(),
        },
      },
    });

    // Adicionar à lista de email marketing (newsletter)
    try {
      await leadNotificationService.addToMarketingAutomation(
        convertLeadToService({
          id: lead.id,
          name: lead.name,
          email: lead.email,
          phone: null,
          company: lead.company,
          position: null,
          source: lead.source,
          message: null,
          createdAt: lead.createdAt,
        } as LeadData)
      );
    } catch (marketingError) {
      console.error('Erro ao adicionar lead de newsletter à automação:', marketingError);
      // Não falha o request se a automação falhar
    }

    return res.status(201).json({
      message: 'Inscrição realizada com sucesso',
      leadId: lead.id,
    });
  } catch (error) {
    console.error('Newsletter signup error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: 'Erro interno do servidor',
    });
  }
});

/**
 * POST /api/leads/contact
 * Formulário de contato geral
 */
router.post('/contact', async (req, res) => {
  try {
    const { name, email, phone, company, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        error: 'Bad request',
        message: 'Nome, email e mensagem são obrigatórios',
      });
    }

    const lead = await prisma.lead.create({
      data: {
        name,
        email,
        phone: phone || undefined,
        company: company || null,
        source: LeadSource.CONTACT_FORM,
        message,
        metadata: {
          userAgent: req.headers['user-agent'],
          ip: req.ip,
          timestamp: new Date().toISOString(),
        },
      },
    });

    // Enviar notificação para a equipe de suporte
    try {
      await leadNotificationService.notifyContactForm(
        convertLeadToService({
          id: lead.id,
          name: lead.name,
          email: lead.email,
          company: lead.company || '',
          phone: lead.phone || null,
          position: lead.position || null,
          message: lead.message || null,
          source: String(lead.source),
          createdAt: lead.createdAt,
        })
      );
    } catch (emailError) {
      console.error('Erro ao enviar notificação de contato:', emailError);
      // Não falha o request se o email falhar
    }

    return res.status(201).json({
      message: 'Mensagem enviada com sucesso',
      leadId: lead.id,
    });
  } catch (error) {
    console.error('Contact form error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: 'Erro interno do servidor',
    });
  }
});

export default router;
