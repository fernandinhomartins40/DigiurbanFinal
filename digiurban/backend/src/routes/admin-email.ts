import { Router, Request, Response, NextFunction } from 'express';
import * as bcrypt from 'bcrypt';
import { authenticateToken, requireRole } from '../middleware/auth';
import { TransactionalEmailService } from '../lib/email/TransactionalEmailService';
import { AuthenticatedRequest, SuccessResponse, ErrorResponse } from '../types';
import { asyncHandler } from '../utils/express-helpers';
import { prisma } from '../lib/prisma';
import { EmailPlan, UserRole } from '@prisma/client';
import * as crypto from 'crypto';

const router = Router();
const transactionalEmail = new TransactionalEmailService();

// Middleware para autenticação
router.use(authenticateToken);

/**
 * GET /api/admin/email-service
 * Obter configurações do serviço de email
 */
router.get('/', requireRole('ADMIN'), asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  try {
    const tenantId = req.user.tenantId;

    const tenant = await prisma.tenant.findUnique({
      where: { id: tenantId },
      include: {
        emailServer: {
          include: {
            domains: true,
            statistics: {
              where: {
                date: {
                  gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
                },
              },
              orderBy: { date: 'desc' },
            },
          },
        },
      },
    });

    if (!tenant) {
      res.status(404).json({
        success: false,
        error: 'Tenant not found',
        message: 'Tenant não encontrado',
      });
      return;
    }

    const emailConfig = {
      hasEmailService: tenant.hasEmailService,
      plan: {
        id: tenant.emailPlanType,
        name: getEmailPlanName(tenant.emailPlanType),
        price: getEmailPlanPrice(tenant.emailPlanType),
        emailsPerMonth: getEmailPlanLimit(tenant.emailPlanType),
      },
      server: tenant.emailServer
        ? {
            hostname: tenant.emailServer.hostname,
            isActive: tenant.emailServer.isActive,
            maxEmailsPerMonth: tenant.emailServer.maxEmailsPerMonth,
          }
        : null,
      domains: tenant.emailServer?.domains || [],
      statistics: tenant.emailServer?.statistics || [],
      usage: await getEmailUsage(tenantId),
    };

    res.json({
      success: true,
      data: emailConfig,
    });
  } catch (error) {
    console.error('Error getting email config:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Erro interno do servidor',
    });
  }
}));

/**
 * POST /api/admin/email-service/subscribe
 * Contratar plano de email
 */
router.post('/subscribe', requireRole('ADMIN'), asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { planId } = req.body;
    const tenantId = req.user.tenantId;
    const userId = req.user.id;

    // Validar plano
    const validPlans = ['basic', 'standard', 'premium', 'enterprise'];
    if (!validPlans.includes(planId)) {
      res
        .status(400)
        .json({ success: false, error: 'Plano inválido', message: 'Plano inválido' });
      return;
    }

    // Mapear plano para enum
    const planMapping = {
      basic: EmailPlan.BASIC,
      standard: EmailPlan.STANDARD,
      premium: EmailPlan.PREMIUM,
      enterprise: EmailPlan.ENTERPRISE,
    };

    // Buscar tenant
    const tenant = await prisma.tenant.findUnique({
      where: { id: tenantId },
    });

    if (!tenant) {
      res
        .status(404)
        .json({ success: false, error: 'Tenant não encontrado', message: 'Tenant não encontrado' });
      return;
    }

    // Atualizar tenant
    const updatedTenant = await prisma.tenant.update({
      where: { id: tenantId },
      data: {
        hasEmailService: true,
        emailPlanType: planMapping[planId as keyof typeof planMapping],
      },
    });

    // Criar/atualizar servidor de email
    const emailServer = await prisma.emailServer.upsert({
      where: { tenantId },
      update: {
        monthlyPrice: getEmailPlanPrice(planId),
        maxEmailsPerMonth: getEmailPlanLimit(planId),
        isActive: true,
      },
      create: {
        tenantId,
        hostname: `mail.${tenant.name.toLowerCase().replace(/\s+/g, '-')}.digiurban.com.br`,
        monthlyPrice: getEmailPlanPrice(planId),
        maxEmailsPerMonth: getEmailPlanLimit(planId),
        isActive: true,
      },
    });

    // Criar usuário SMTP padrão
    const defaultPassword = generateSecurePassword();
    const passwordHash = await bcrypt.hash(defaultPassword, 12);

    await prisma.emailUser.upsert({
      where: {
        emailServerId_email: {
          emailServerId: emailServer.id,
          email: `admin@${tenant.name.toLowerCase().replace(/\s+/g, '-')}.digiurban.com.br`,
        },
      },
      update: {
        isActive: true,
      },
      create: {
        emailServerId: emailServer.id,
        email: `admin@${tenant.name.toLowerCase().replace(/\s+/g, '-')}.digiurban.com.br`,
        passwordHash,
        name: 'Administrador',
        isActive: true,
        isAdmin: true,
        dailyLimit: Math.floor(getEmailPlanLimit(planId) / 30),
        monthlyLimit: getEmailPlanLimit(planId),
      },
    });

    // Adicionar domínio padrão
    await prisma.emailDomain.upsert({
      where: {
        emailServerId_domainName: {
          emailServerId: emailServer.id,
          domainName: `${tenant.name.toLowerCase().replace(/\s+/g, '-')}.digiurban.com.br`,
        },
      },
      update: {
        isVerified: true,
      },
      create: {
        emailServerId: emailServer.id,
        domainName: `${tenant.name.toLowerCase().replace(/\s+/g, '-')}.digiurban.com.br`,
        isVerified: true, // Domínio próprio já verificado
        dkimEnabled: true,
        spfEnabled: true,
      },
    });

    // Criar templates padrão
    await transactionalEmail.createDefaultTemplates(tenantId);

    // Log da contratação
    await prisma.auditLog.create({
      data: {
        tenantId,
        userId,
        action: 'EMAIL_SERVICE_SUBSCRIBED',
        resource: 'email_service',
        details: { planId, message: `Contratou plano de email: ${planId}` },
        ip: req.ip || 'unknown',
        success: true,
      },
    });

    res.json({
      success: true,
      message: 'Serviço de email contratado com sucesso!',
      credentials: {
        email: `admin@${tenant.name.toLowerCase().replace(/\s+/g, '-')}.digiurban.com.br`,
        password: defaultPassword,
        server: emailServer.hostname,
        port: 587,
      },
    });
  } catch (error) {
    console.error('Error subscribing to email service:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Erro interno do servidor',
    });
  }
}));

/**
 * POST /api/admin/email-service/domain
 * Adicionar domínio personalizado
 */
router.post('/domain', requireRole('ADMIN'), asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { domain } = req.body;
    const tenantId = req.user.tenantId;

    if (!domain || !isValidDomain(domain)) {
      res
        .status(400)
        .json({ success: false, error: 'Domínio inválido', message: 'Domínio inválido' });
      return;
    }

    const emailServer = await prisma.emailServer.findUnique({
      where: { tenantId },
    });

    if (!emailServer) {
      res
        .status(404)
        .json({
          success: false,
          error: 'Serviço de email não encontrado',
          message: 'Serviço de email não encontrado',
        });
      return;
    }

    // Verificar se domínio já existe
    const existingDomain = await prisma.emailDomain.findFirst({
      where: {
        emailServerId: emailServer.id,
        domainName: domain,
      },
    });

    if (existingDomain) {
      res
        .status(409)
        .json({ success: false, error: 'Domínio já cadastrado', message: 'Domínio já cadastrado' });
      return;
    }

    // Gerar token de verificação
    const verificationToken = crypto.randomBytes(32).toString('hex');

    // Criar domínio
    const emailDomain = await prisma.emailDomain.create({
      data: {
        emailServerId: emailServer.id,
        domainName: domain,
        isVerified: false,
        verificationToken,
        dkimEnabled: true,
        spfEnabled: true,
      },
    });

    // Gerar registros DNS necessários
    const dnsRecords = generateDNSRecords(domain, emailServer.hostname, verificationToken);

    res.json({
      success: true,
      domain: emailDomain,
      dnsRecords,
      message: 'Domínio adicionado. Configure os registros DNS para verificação.',
    });
  } catch (error) {
    console.error('Error adding domain:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Erro interno do servidor',
    });
  }
}));

/**
 * POST /api/admin/email-service/domain/:id/verify
 * Verificar configuração DNS do domínio
 */
router.post('/domain/:id/verify', requireRole('ADMIN'), asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const tenantId = req.user.tenantId;

    const domain = await prisma.emailDomain.findFirst({
      where: {
        id,
        emailServer: {
          tenantId,
        },
      },
      include: {
        emailServer: true,
      },
    });

    if (!domain) {
      res
        .status(404)
        .json({
          success: false,
          error: 'Domínio não encontrado',
          message: 'Domínio não encontrado',
        });
      return;
    }

    // Verificar DNS (simulado)
    const isVerified = await verifyDNSRecords(domain.domainName, domain.verificationToken!);

    if (isVerified) {
      await prisma.emailDomain.update({
        where: { id },
        data: {
          isVerified: true,
          verificationToken: null,
        },
      });

      res.json({
        success: true,
        message: 'Domínio verificado com sucesso!',
      });
    } else {
      res.json({
        success: false,
        message:
          'Verificação DNS falhou. Verifique se os registros foram configurados corretamente.',
      });
    }
  } catch (error) {
    console.error('Error verifying domain:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Erro interno do servidor',
    });
  }
}));

/**
 * GET /api/admin/email-service/stats
 * Obter estatísticas de email
 */
router.get('/stats', requireRole(UserRole.ADMIN), async (req, res, next) => {
  try {
    const tenantId = (req as AuthenticatedRequest).user.tenantId;

    const emailServer = await prisma.emailServer.findUnique({
      where: { tenantId },
    });

    if (!emailServer) {
      res
        .status(404)
        .json({
          success: false,
          error: 'Serviço de email não encontrado',
          message: 'Serviço de email não encontrado',
        });
      return;
    }

    // Estatísticas do mês atual
    const currentMonth = new Date();
    currentMonth.setDate(1);
    currentMonth.setHours(0, 0, 0, 0);

    const [totalSent, totalDelivered, totalFailed, totalBounced, monthlyStats] = await Promise.all([
      prisma.email.count({
        where: {
          emailServerId: emailServer.id,
          sentAt: { gte: currentMonth },
        },
      }),
      prisma.email.count({
        where: {
          emailServerId: emailServer.id,
          status: 'DELIVERED',
          deliveredAt: { gte: currentMonth },
        },
      }),
      prisma.email.count({
        where: {
          emailServerId: emailServer.id,
          status: 'FAILED',
          failedAt: { gte: currentMonth },
        },
      }),
      prisma.email.count({
        where: {
          emailServerId: emailServer.id,
          status: 'BOUNCED',
          createdAt: { gte: currentMonth },
        },
      }),
      prisma.emailStats.findMany({
        where: {
          emailServerId: emailServer.id,
          date: { gte: currentMonth },
        },
        orderBy: { date: 'asc' },
      }),
    ]);

    const deliveryRate = totalSent > 0 ? ((totalDelivered / totalSent) * 100).toFixed(1) : '0';
    const bounceRate = totalSent > 0 ? ((totalBounced / totalSent) * 100).toFixed(1) : '0';

    res.json({
      currentMonth: {
        totalSent,
        totalDelivered,
        totalFailed,
        totalBounced,
        deliveryRate: `${deliveryRate}%`,
        bounceRate: `${bounceRate}%`,
      },
      dailyStats: monthlyStats,
      usage: {
        current: totalSent,
        limit: emailServer.maxEmailsPerMonth,
        percentage:
          emailServer.maxEmailsPerMonth > 0
            ? ((totalSent / emailServer.maxEmailsPerMonth) * 100).toFixed(1)
            : '0',
      },
    });
  } catch (error) {
    console.error('Error getting email stats:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Erro interno do servidor',
    });
  }
});

/**
 * GET /api/admin/email-service/templates
 * Listar templates de email
 */
router.get('/templates', requireRole(UserRole.ADMIN), async (req, res, next) => {
  try {
    const tenantId = (req as AuthenticatedRequest).user.tenantId;

    const templates = await transactionalEmail.getTemplates(tenantId);

    res.json(templates);
  } catch (error) {
    console.error('Error getting templates:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Erro interno do servidor',
    });
  }
});

/**
 * PUT /api/admin/email-service/templates/:name
 * Atualizar template de email
 */
router.put('/templates/:name', requireRole(UserRole.ADMIN), async (req, res, next) => {
  try {
    const { name } = req.params;
    const tenantId = (req as AuthenticatedRequest).user.tenantId;
    const updates = req.body;

    const template = await transactionalEmail.updateTemplate(tenantId, name, updates);

    res.json({
      success: true,
      template,
    });
  } catch (error) {
    console.error('Error updating template:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Erro interno do servidor',
    });
  }
});

// Funções auxiliares

function getEmailPlanName(planType: string): string {
  const plans: Record<string, string> = {
    NONE: 'Nenhum',
    BASIC: 'Básico',
    STANDARD: 'Padrão',
    PREMIUM: 'Premium',
    ENTERPRISE: 'Enterprise',
  };
  return plans[planType] || 'Nenhum';
}

function getEmailPlanPrice(planId: string): number {
  const prices: Record<string, number> = {
    basic: 49,
    standard: 99,
    premium: 199,
    enterprise: 399,
  };
  return prices[planId] || 0;
}

function getEmailPlanLimit(planId: string): number {
  const limits: Record<string, number> = {
    basic: 5000,
    standard: 15000,
    premium: 50000,
    enterprise: 999999999,
  };
  return limits[planId] || 0;
}

function generateSecurePassword(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
  let password = '';
  for (let i = 0; i < 16; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

function isValidDomain(domain: string): boolean {
  const domainRegex =
    /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9](?:\.[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9])*$/;
  return domainRegex.test(domain);
}

function generateDNSRecords(domain: string, hostname: string, verificationToken: string) {
  return [
    {
      type: 'MX',
      name: domain,
      value: `10 ${hostname}`,
      priority: 10,
      ttl: 3600,
    },
    {
      type: 'TXT',
      name: domain,
      value: `v=spf1 mx include:${hostname} ~all`,
      ttl: 3600,
    },
    {
      type: 'TXT',
      name: `_dmarc.${domain}`,
      value: `v=DMARC1; p=quarantine; rua=mailto:dmarc@${hostname}`,
      ttl: 3600,
    },
    {
      type: 'TXT',
      name: `digiurban-verification.${domain}`,
      value: verificationToken,
      ttl: 300,
    },
    {
      type: 'CNAME',
      name: `mail.${domain}`,
      value: hostname,
      ttl: 3600,
    },
  ];
}

async function verifyDNSRecords(domain: string, verificationToken: string): Promise<boolean> {
  // Em produção, fazer verificação real de DNS
  // Por agora, simular verificação
  return Math.random() > 0.3; // 70% de chance de sucesso
}

async function getEmailUsage(tenantId: string) {
  const currentMonth = new Date();
  currentMonth.setDate(1);
  currentMonth.setHours(0, 0, 0, 0);

  const sent = await prisma.email.count({
    where: {
      emailServer: { tenantId },
      sentAt: { gte: currentMonth },
    },
  });

  return { currentMonth: sent };
}

export default router;
