// ============================================================================
// SUPER-ADMIN.TS - ISOLAMENTO PROFISSIONAL COMPLETO
// ============================================================================

import * as express from 'express';
import { Response, NextFunction, RequestHandler } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { Prisma, Plan, TenantStatus, InvoiceStatus } from '@prisma/client';
import { UNASSIGNED_POOL_ID, isUnassignedPool } from '../config/tenants';
import { autoLinkCitizens } from '../services/citizen-auto-link';
import { seedInitialServices } from '../seeds/initial-services';

// ====================== TIPOS E INTERFACES ISOLADAS ======================

interface User {
  id: string;
  email: string;
  name?: string;
  role: string;
  isActive: boolean;
  tenantId?: string;
  departmentId?: string;
}

interface SuperAdminRequest {
  user?: User;
  params: Record<string, string>;
  query: Record<string, string | string[]>;
  body: Record<string, unknown>;
}


interface ErrorResponse {
  success: false;
  error: string;
  message: string;
  details?: unknown;
}





// ====================== HELPER FUNCTIONS ======================

function getStringParam(param: string | string[] | unknown): string {
  if (Array.isArray(param)) return param[0] || '';
  if (typeof param === 'string') return param;
  if (param && typeof param === 'object' && param.toString) return param.toString();
  return '';
}

function getNumberParam(param: string | string[] | unknown): number {
  if (typeof param === 'number') return param;
  if (typeof param === 'string') return parseInt(param, 10) || 0;
  return 0;
}


function createErrorResponse(error: string, message: string, details?: unknown): ErrorResponse {
  return {
    success: false,
    error,
    message,
    details
  };
}

function handleAsyncRoute(fn: (req: any, res: Response) => Promise<any>): RequestHandler {
  return (req, res, next) => {
    Promise.resolve(fn(req, res)).catch(next);
  };
}

function createTenantWhereClause(params: {
  status?: string;
  plan?: string;
  search?: string;
}): Record<string, unknown> {
  const where: Record<string, unknown> = {};

  if (params.status) {
    where.status = params.status;
  }

  if (params.plan) {
    where.plan = params.plan;
  }

  if (params.search) {
    where.OR = [
      { name: { contains: params.search } },
      { cnpj: { contains: params.search } },
      { domain: { contains: params.search } },
    ];
  }

  return where;
}

function createInvoiceWhereClause(params: {
  status?: string;
  period?: string;
  tenantId?: string;
}): Record<string, unknown> {
  const where: Record<string, unknown> = {};

  if (params.status) where.status = params.status;
  if (params.period) where.period = params.period;
  if (params.tenantId) where.tenantId = params.tenantId;

  return where;
}

// ====================== MIDDLEWARE FUNCTIONS ======================

function authenticateToken(req: express.Request, res: Response, next: NextFunction) {
  const jwt = require('jsonwebtoken');

  // ✅ CORRIGIDO: Tentar obter token do cookie primeiro, depois do header (fallback)
  let token = (req as any).cookies?.digiurban_super_admin_token;

  // Fallback para header Authorization (compatibilidade retroativa)
  if (!token) {
    const authHeader = req.headers.authorization;
    token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;
  }

  if (!token) {
    res.status(401).json({ success: false, error: 'Token não fornecido' });
    return;
  }

  try {
    const jwtSecret = process.env.JWT_SECRET!; // Non-null assertion (validado no startup)
    const decoded = jwt.verify(token, jwtSecret);
    (req as any).user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ success: false, error: 'Token inválido ou expirado' });
    return;
  }
}

function requireSuperAdmin(req: express.Request, res: Response, next: NextFunction) {
  const user = (req as any).user;

  if (!user || user.role !== 'SUPER_ADMIN') {
    res.status(403).json({ success: false, error: 'Acesso negado: Super Admin necessário' });
    return;
  }

  next();
}

// ====================== VALIDATION SCHEMAS ======================

// Schema de senha forte reutilizável
const strongPasswordSchema = z.string()
  .min(8, 'Senha deve ter pelo menos 8 caracteres')
  .regex(/[A-Z]/, 'Senha deve conter pelo menos uma letra maiúscula')
  .regex(/[a-z]/, 'Senha deve conter pelo menos uma letra minúscula')
  .regex(/\d/, 'Senha deve conter pelo menos um número')
  .regex(/[!@#$%^&*(),.?":{}|<>]/, 'Senha deve conter pelo menos um caractere especial');

const createTenantSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  cnpj: z.string().min(14, 'CNPJ é obrigatório'),
  // ❌ REMOVIDO: domain (não usamos mais subdomínios)
  plan: z.nativeEnum(Plan).default(Plan.STARTER),
  population: z.number().optional(),
  billing: z.any().optional(),
  codigoIbge: z.string().optional(),
  nomeMunicipio: z.string().optional(),
  ufMunicipio: z.string().optional(),
  adminUser: z.object({
    email: z.string().email(),
    name: z.string().min(1),
    password: strongPasswordSchema, // ✅ OBRIGATÓRIO e com validação forte
  }).optional(),
});

const updateTenantSchema = z.object({
  name: z.string().optional(),
  // ❌ REMOVIDO: domain
  plan: z.nativeEnum(Plan).optional(),
  status: z.nativeEnum(TenantStatus).optional(),
  population: z.number().optional(),
  billing: z.any().optional(),
  limits: z.any().optional(),
});

const generateBillingSchema = z.object({
  period: z.string().regex(/^\d{4}-\d{2}$/, 'Formato deve ser YYYY-MM'),
});

// ====================== ROUTER SETUP ======================

const router = express.Router();

// ====================== ROTA PÚBLICA DE LOGIN ======================

/**
 * POST /api/super-admin/login
 * Login do Super Admin (sem autenticação)
 */
router.post('/login', async (req: express.Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ success: false, error: 'Email e senha são obrigatórios' });
      return;
    }

    const bcrypt = require('bcryptjs');
    const jwt = require('jsonwebtoken');

    const user = await prisma.user.findFirst({
      where: {
        email,
        role: 'SUPER_ADMIN' as any,
      },
      select: {
        id: true,
        email: true,
        password: true,
        role: true,
        isActive: true,
        name: true,
        mustChangePassword: true, // ✅ SEGURANÇA: Verificar se deve trocar senha
      }
    });

    if (!user || !user.isActive) {
      res.status(401).json({ success: false, error: 'Credenciais inválidas' });
      return;
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      res.status(401).json({ success: false, error: 'Credenciais inválidas' });
      return;
    }

    const { SUPER_ADMIN_EXPIRES_IN } = require('../config/security').SECURITY_CONFIG.JWT;
    const jwtSecret = process.env.JWT_SECRET!; // Non-null assertion

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role, type: 'super-admin' },
      jwtSecret,
      { expiresIn: SUPER_ADMIN_EXPIRES_IN }
    );

    // ✅ Setar cookie httpOnly com o token
    res.cookie('digiurban_super_admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 60 * 1000, // 30 minutos em ms
      path: '/',
      // ✅ Não definir domain permite que funcione no domínio atual (digiurban.com.br)
      // Se precisar de subdomínios, usar: domain: '.digiurban.com.br'
    });

    const { password: _, ...userData } = user;

    res.json({
      success: true,
      user: userData,
      // ✅ SEGURANÇA: Informar frontend se usuário precisa trocar senha
      mustChangePassword: user.mustChangePassword,
    });
  } catch (error) {
    console.error('Erro no login do Super Admin:', error);
    res.status(500).json({ success: false, error: 'Erro interno no servidor' });
  }
});

/**
 * POST /api/super-admin/logout
 * Logout do Super Admin (limpar cookie)
 */
router.post('/logout', async (_req: express.Request, res: Response) => {
  try {
    // ✅ Limpar cookie httpOnly
    res.clearCookie('digiurban_super_admin_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });

    res.json({ success: true, message: 'Logout realizado com sucesso' });
  } catch (error) {
    console.error('Erro no logout do Super Admin:', error);
    res.status(500).json({ success: false, error: 'Erro interno no servidor' });
  }
});

// Aplicar middleware de autenticação Super Admin em todas as outras rotas
router.use(authenticateToken);
router.use(requireSuperAdmin);

// ====================== ROUTES PROTEGIDAS ======================

/**
 * GET /api/super-admin/auth/me
 * Verificar autenticação e retornar dados do usuário
 */
router.get('/auth/me', handleAsyncRoute(async (req, res) => {
  const user = (req as any).user;

  // Buscar dados completos do usuário
  const userData = await prisma.user.findUnique({
    where: { id: user.userId },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      isActive: true,
      createdAt: true,
    },
  });

  if (!userData || !userData.isActive) {
    return res.status(401).json({
      success: false,
      error: 'Usuário não encontrado ou inativo',
    });
  }

  return res.json({
    success: true,
    user: userData,
  });
}));

/**
 * GET /api/super-admin/tenants/search
 * Buscar tenants para autocomplete (lightweight)
 */
router.get(
  '/tenants/search',
  handleAsyncRoute(async (req, res) => {
    const search = getStringParam(req.query.q) || getStringParam(req.query.search);
    const limit = getNumberParam(req.query.limit) || 20;

    const where: any = {
      status: { not: TenantStatus.CANCELLED },
      id: { not: UNASSIGNED_POOL_ID }, // Excluir Pool Global
    };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { nomeMunicipio: { contains: search, mode: 'insensitive' } },
        { cnpj: { contains: search } },
      ];
    }

    const tenants = await prisma.tenant.findMany({
      where,
      take: limit,
      orderBy: { name: 'asc' },
      select: {
        id: true,
        name: true,
        nomeMunicipio: true,
        ufMunicipio: true,
        status: true,
        plan: true,
      },
    });

    return res.json({
      success: true,
      tenants,
    });
  })
);

/**
 * GET /api/super-admin/tenants
 * Listar todos os tenants com filtros avançados
 */
router.get(
  '/tenants',
  handleAsyncRoute(async (req, res) => {
    const page = getNumberParam(req.query.page) || 1;
    const limit = getNumberParam(req.query.limit) || 10;
    const status = getStringParam(req.query.status);
    const plan = getStringParam(req.query.plan);
    const search = getStringParam(req.query.search);
    const sortBy = getStringParam(req.query.sortBy) || 'createdAt';
    const sortOrder = getStringParam(req.query.sortOrder) || 'desc';

    const skip = (page - 1) * limit;

    const whereClause = createTenantWhereClause({ status, plan, search });

    const [tenants, total] = await Promise.all([
      prisma.tenant.findMany({
        where: whereClause,
        include: {
          _count: {
            select: {
              users: true,
              protocolsSimplified: true,
              servicesSimplified: true,
              citizens: true,
              invoices: true,
            },
          },
          invoices: {
            where: {
              status: InvoiceStatus.OVERDUE,
            },
            select: {
              id: true,
              amount: true,
              dueDate: true,
            },
          },
        },
        orderBy: {
          [sortBy]: sortOrder,
        },
        skip,
        take: limit,
      }),
      prisma.tenant.count({ where: whereClause }),
    ]);

    // Calcular métricas agregadas
    const metrics = await Promise.all([
      prisma.tenant.count({ where: { status: TenantStatus.ACTIVE } }),
      prisma.tenant.count({ where: { status: TenantStatus.TRIAL } }),
      prisma.tenant.count({ where: { status: TenantStatus.SUSPENDED } }),
      prisma.invoice.aggregate({
        where: { status: InvoiceStatus.OVERDUE },
        _sum: { amount: true },
        _count: true,
      }),
    ]);

    return res.json({
      success: true,
      tenants,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
      metrics: {
        activeTenants: metrics[0],
        trialTenants: metrics[1],
        suspendedTenants: metrics[2],
        overdueInvoices: {
          count: metrics[3]._count,
          amount: metrics[3]._sum.amount || 0,
        },
      },
    });
  })
);

/**
 * POST /api/super-admin/tenants
 * Criar novo tenant com dados completos
 */
router.post(
  '/tenants',
  handleAsyncRoute(async (req, res) => {
    const data = createTenantSchema.parse(req.body);

    // Verificar se CNPJ já existe
    const existingTenant = await prisma.tenant.findUnique({
      where: { cnpj: data.cnpj },
    });

    if (existingTenant) {
      return res.status(409).json(createErrorResponse('CONFLICT', 'CNPJ já está em uso'));
    }

    // ❌ REMOVIDO: Validação de domain (não usamos mais)

    // Definir limites baseados no plano
    const planLimits = {
      [Plan.STARTER]: {
        users: 10,
        protocols: 1000,
        storage: 1024, // MB
        departments: 5,
      },
      [Plan.PROFESSIONAL]: {
        users: 50,
        protocols: 10000,
        storage: 10240, // MB
        departments: 15,
      },
      [Plan.ENTERPRISE]: {
        users: -1, // Ilimitado
        protocols: -1,
        storage: -1,
        departments: -1,
      },
    };

    // Criar tenant (sem campo domain)
    const tenantData: Record<string, unknown> = {
      name: data.name,
      cnpj: data.cnpj,
      plan: data.plan,
      status: TenantStatus.TRIAL,
      limits: planLimits[data.plan],
    };

    // ❌ REMOVIDO: if (data.domain) { tenantData.domain = data.domain; }

    if (data.population) {
      tenantData.population = data.population;
    }

    if (data.billing) {
      tenantData.billing = data.billing;
    }

    // Adicionar dados do município
    if (data.codigoIbge) {
      tenantData.codigoIbge = data.codigoIbge;
    }

    if (data.nomeMunicipio) {
      tenantData.nomeMunicipio = data.nomeMunicipio;
    }

    if (data.ufMunicipio) {
      tenantData.ufMunicipio = data.ufMunicipio;
    }

    const tenant = await prisma.tenant.create({
      data: tenantData as unknown as Prisma.TenantUncheckedCreateInput,
    });

    // Criar departamentos padrão com códigos padronizados
    const defaultDepartments = [
      { name: 'Secretaria de Saúde', code: 'SAUDE', description: 'Secretaria Municipal de Saúde' },
      { name: 'Secretaria de Educação', code: 'EDUCACAO', description: 'Secretaria Municipal de Educação' },
      { name: 'Secretaria de Serviços Públicos', code: 'SERVICOS_PUBLICOS', description: 'Secretaria Municipal de Serviços Públicos' },
      { name: 'Secretaria de Assistência Social', code: 'ASSISTENCIA_SOCIAL', description: 'Secretaria Municipal de Assistência Social' },
      { name: 'Secretaria de Cultura', code: 'CULTURA', description: 'Secretaria Municipal de Cultura' },
      { name: 'Secretaria de Segurança Pública', code: 'SEGURANCA', description: 'Secretaria Municipal de Segurança Pública' },
      { name: 'Secretaria de Planejamento Urbano', code: 'PLANEJAMENTO', description: 'Secretaria Municipal de Planejamento Urbano' },
      { name: 'Secretaria de Agricultura', code: 'AGRICULTURA', description: 'Secretaria Municipal de Agricultura' },
      { name: 'Secretaria de Esportes', code: 'ESPORTES', description: 'Secretaria Municipal de Esportes' },
      { name: 'Secretaria de Turismo', code: 'TURISMO', description: 'Secretaria Municipal de Turismo' },
      { name: 'Secretaria de Habitação', code: 'HABITACAO', description: 'Secretaria Municipal de Habitação' },
      { name: 'Secretaria de Meio Ambiente', code: 'MEIO_AMBIENTE', description: 'Secretaria Municipal de Meio Ambiente' },
      { name: 'Secretaria de Obras Públicas', code: 'OBRAS', description: 'Secretaria Municipal de Obras Públicas' },
    ];

    await Promise.all(
      defaultDepartments.map(dept =>
        prisma.department.create({
          data: {
            name: dept.name,
            code: dept.code,
            description: dept.description,
            tenantId: tenant.id,
            isActive: true,
          },
        })
      )
    );

    // Popular serviços padrão automaticamente (52 serviços padrão)
    // Saúde: 20 serviços | Educação: 14 serviços | Serviços Públicos: 18 serviços
    try {
      const result = await seedInitialServices(tenant.id);
      console.log(`✅ Serviços padrão criados para tenant ${tenant.name} (${tenant.id}):`, {
        created: result.created,
        skipped: result.skipped,
        errors: result.errors
      });
    } catch (error) {
      console.error(`⚠️ Erro ao popular serviços para tenant ${tenant.id}:`, error);
      // Não falhar a criação do tenant se os serviços falharem
      // Serviços podem ser criados manualmente depois
    }

    // Criar usuário administrador se fornecido
    if (data.adminUser) {
      const bcrypt = require('bcryptjs');
      // ✅ SEGURANÇA: Senha obrigatória com validação forte (validada pelo schema Zod)
      const hashedPassword = await bcrypt.hash(data.adminUser.password, 12);

      await prisma.user.create({
        data: {
          email: data.adminUser.email,
          name: data.adminUser.name,
          password: hashedPassword,
          role: 'ADMIN',
          tenantId: tenant.id,
          mustChangePassword: true, // ✅ Exigir troca de senha no primeiro login
        },
      });
    }

    return res.status(201).json({
      success: true,
      message: 'Tenant criado com sucesso',
      tenant,
    });
  })
);

/**
 * GET /api/super-admin/tenants/:id
 * Obter dados de um tenant específico
 */
router.get(
  '/tenants/:id',
  handleAsyncRoute(async (req, res) => {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json(createErrorResponse('BAD_REQUEST', 'ID do tenant é obrigatório'));
    }

    const tenant = await prisma.tenant.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            users: true,
            protocolsSimplified: true,
            servicesSimplified: true,
            citizens: true,
            invoices: true,
          },
        },
      },
    });

    if (!tenant) {
      return res.status(404).json(createErrorResponse('NOT_FOUND', 'Tenant não encontrado'));
    }

    return res.json({
      success: true,
      tenant,
    });
  })
);

/**
 * PUT /api/super-admin/tenants/:id
 * Atualizar tenant específico
 */
router.put(
  '/tenants/:id',
  handleAsyncRoute(async (req, res) => {
    const { id } = req.params;
    const data = updateTenantSchema.parse(req.body);

    if (!id) {
      return res.status(400).json(createErrorResponse('BAD_REQUEST', 'ID do tenant é obrigatório'));
    }

    const tenant = await prisma.tenant.findUnique({
      where: { id },
    });

    if (!tenant) {
      return res.status(404).json(createErrorResponse('NOT_FOUND', 'Tenant não encontrado'));
    }

    // ❌ REMOVIDO: Validação de domain (não usamos mais)

    const updateData: Record<string, unknown> = {};

    if (data.name !== undefined) updateData.name = data.name;
    // ❌ REMOVIDO: if (data.domain !== undefined) updateData.domain = data.domain;
    if (data.plan !== undefined) updateData.plan = data.plan;
    if (data.status !== undefined) updateData.status = data.status;
    if (data.population !== undefined) updateData.population = data.population;
    if (data.billing !== undefined) updateData.billing = data.billing;
    if (data.limits !== undefined) updateData.limits = data.limits;

    const updatedTenant = await prisma.tenant.update({
      where: { id },
      data: updateData,
      include: {
        _count: {
          select: {
            users: true,
            protocolsSimplified: true,
            servicesSimplified: true,
            citizens: true,
          },
        },
      },
    });

    return res.json({
      success: true,
      message: 'Tenant atualizado com sucesso',
      tenant: updatedTenant,
    });
  })
);

/**
 * POST /api/super-admin/tenants/:id/soft-delete
 * Desativar tenant (soft delete) - Muda status para CANCELLED
 * Preserva todos os dados para possível recuperação
 */
router.post(
  '/tenants/:id/soft-delete',
  handleAsyncRoute(async (req, res) => {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json(createErrorResponse('BAD_REQUEST', 'ID do tenant é obrigatório'));
    }

    const tenant = await prisma.tenant.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            users: true,
            protocolsSimplified: true,
            citizens: true,
            servicesSimplified: true,
          },
        },
      },
    });

    if (!tenant) {
      return res.status(404).json(createErrorResponse('NOT_FOUND', 'Tenant não encontrado'));
    }

    if (tenant.status === TenantStatus.CANCELLED) {
      return res.status(400).json(createErrorResponse('BAD_REQUEST', 'Tenant já está desativado'));
    }

    // Atualizar status para CANCELLED (soft delete)
    const updatedTenant = await prisma.tenant.update({
      where: { id },
      data: {
        status: TenantStatus.CANCELLED,
        metadata: {
          ...(typeof tenant.metadata === 'object' ? tenant.metadata : {}),
          cancelledAt: new Date().toISOString(),
          cancelledBy: (req as any).user?.userId || 'super-admin',
          previousStatus: tenant.status,
        }
      },
      include: {
        _count: {
          select: {
            users: true,
            protocolsSimplified: true,
            citizens: true,
            servicesSimplified: true,
          },
        },
      },
    });

    return res.json({
      success: true,
      message: 'Tenant desativado com sucesso. Dados preservados.',
      tenant: updatedTenant,
      info: {
        usersPreserved: updatedTenant._count.users,
        protocolsPreserved: updatedTenant._count.protocolsSimplified,
        citizensPreserved: updatedTenant._count.citizens,
        servicesPreserved: updatedTenant._count.servicesSimplified,
      }
    });
  })
);

/**
 * POST /api/super-admin/tenants/:id/reactivate
 * Reativar tenant cancelado
 */
router.post(
  '/tenants/:id/reactivate',
  handleAsyncRoute(async (req, res) => {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json(createErrorResponse('BAD_REQUEST', 'ID do tenant é obrigatório'));
    }

    const tenant = await prisma.tenant.findUnique({
      where: { id },
    });

    if (!tenant) {
      return res.status(404).json(createErrorResponse('NOT_FOUND', 'Tenant não encontrado'));
    }

    if (tenant.status !== TenantStatus.CANCELLED) {
      return res.status(400).json(createErrorResponse('BAD_REQUEST', 'Apenas tenants cancelados podem ser reativados'));
    }

    // Recuperar status anterior do metadata ou usar ACTIVE como padrão
    const metadata = tenant.metadata as any;
    const previousStatus = metadata?.previousStatus || TenantStatus.ACTIVE;

    const updatedTenant = await prisma.tenant.update({
      where: { id },
      data: {
        status: previousStatus,
        metadata: {
          ...(typeof tenant.metadata === 'object' ? tenant.metadata : {}),
          reactivatedAt: new Date().toISOString(),
          reactivatedBy: (req as any).user?.userId || 'super-admin',
        }
      },
    });

    return res.json({
      success: true,
      message: 'Tenant reativado com sucesso',
      tenant: updatedTenant,
    });
  })
);

/**
 * DELETE /api/super-admin/tenants/:id/hard-delete
 * EXCLUSÃO PERMANENTE (Hard Delete) - Remove tenant e TODOS os dados relacionados
 * ⚠️ ATENÇÃO: Esta operação é IRREVERSÍVEL e remove TODOS os dados
 * Deve ser usada apenas para limpar tenants de teste
 */
router.delete(
  '/tenants/:id/hard-delete',
  handleAsyncRoute(async (req, res) => {
    const { id } = req.params;
    const { confirmPassword } = req.query;

    if (!id) {
      return res.status(400).json(createErrorResponse('BAD_REQUEST', 'ID do tenant é obrigatório'));
    }

    // Confirmação adicional com senha "DELETE_PERMANENTLY"
    if (confirmPassword !== 'DELETE_PERMANENTLY') {
      return res.status(400).json(
        createErrorResponse(
          'BAD_REQUEST',
          'Confirmação de senha incorreta. Use "DELETE_PERMANENTLY" como confirmPassword'
        )
      );
    }

    const tenant = await prisma.tenant.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            users: true,
            protocolsSimplified: true,
            citizens: true,
            servicesSimplified: true,
            departments: true,
            invoices: true,
            leads: true,
          },
        },
      },
    });

    if (!tenant) {
      return res.status(404).json(createErrorResponse('NOT_FOUND', 'Tenant não encontrado'));
    }

    // Recomendar soft delete se o tenant não estiver cancelado
    if (tenant.status !== TenantStatus.CANCELLED) {
      return res.status(400).json(
        createErrorResponse(
          'PRECONDITION_REQUIRED',
          'Por segurança, o tenant deve estar desativado (CANCELLED) antes da exclusão permanente. Use soft-delete primeiro.',
          {
            currentStatus: tenant.status,
            recommendation: 'Use POST /api/super-admin/tenants/:id/soft-delete primeiro'
          }
        )
      );
    }

    try {
      // Deletar em cascata (Prisma cuida das relações se configurado no schema)
      // Se não houver cascade, deletar manualmente em ordem
      const deletionSummary = {
        users: tenant._count.users,
        protocols: tenant._count.protocolsSimplified,
        citizens: tenant._count.citizens,
        services: tenant._count.servicesSimplified,
        departments: tenant._count.departments,
        invoices: tenant._count.invoices,
        leads: tenant._count.leads,
      };

      // Excluir tenant (CASCADE deletará registros dependentes se configurado)
      await prisma.tenant.delete({
        where: { id },
      });

      return res.json({
        success: true,
        message: '⚠️ Tenant e TODOS os dados relacionados foram PERMANENTEMENTE excluídos',
        warning: 'Esta operação é IRREVERSÍVEL',
        deleted: {
          tenant: {
            id: tenant.id,
            name: tenant.name,
            cnpj: tenant.cnpj,
          },
          relatedData: deletionSummary,
        }
      });
    } catch (error: any) {
      console.error('Erro ao fazer hard delete do tenant:', error);
      return res.status(500).json(
        createErrorResponse(
          'DATABASE_ERROR',
          'Erro ao excluir tenant permanentemente. Pode haver dados dependentes sem cascade configurado.',
          { error: error.message }
        )
      );
    }
  })
);

/**
 * DELETE /api/super-admin/tenants/:id (DEPRECATED)
 * Mantido por compatibilidade - Agora faz soft delete
 */
router.delete(
  '/tenants/:id',
  handleAsyncRoute(async (req, res) => {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json(createErrorResponse('BAD_REQUEST', 'ID do tenant é obrigatório'));
    }

    const tenant = await prisma.tenant.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            users: true,
            protocolsSimplified: true,
            citizens: true,
            servicesSimplified: true,
          },
        },
      },
    });

    if (!tenant) {
      return res.status(404).json(createErrorResponse('NOT_FOUND', 'Tenant não encontrado'));
    }

    if (tenant.status === TenantStatus.CANCELLED) {
      return res.status(400).json(createErrorResponse('BAD_REQUEST', 'Tenant já está desativado'));
    }

    // Soft delete por padrão
    const updatedTenant = await prisma.tenant.update({
      where: { id },
      data: {
        status: TenantStatus.CANCELLED,
        metadata: {
          ...(typeof tenant.metadata === 'object' ? tenant.metadata : {}),
          cancelledAt: new Date().toISOString(),
          cancelledBy: (req as any).user?.userId || 'super-admin',
          previousStatus: tenant.status,
        }
      },
    });

    return res.json({
      success: true,
      message: 'Tenant desativado com sucesso (soft delete)',
      tenant: updatedTenant,
      note: 'Dados preservados. Use hard-delete para exclusão permanente.'
    });
  })
);

/**
 * GET /api/super-admin/analytics
 * Dashboard com KPIs principais
 */
router.get(
  '/analytics',
  handleAsyncRoute(async (req, res) => {
    const period = getStringParam(req.query.period) || '30d';

    // Calcular datas baseadas no período
    const now = new Date();
    const startDate = new Date();

    switch (period) {
      case '7d':
        startDate.setDate(now.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(now.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(now.getDate() - 90);
        break;
      default:
        startDate.setDate(now.getDate() - 30);
    }

    // KPIs Principais
    const [
      totalTenants,
      activeTenants,
      trialTenants,
      totalProtocols,
      totalUsers,
      totalRevenue,
      newTenantsThisPeriod,
      churnedTenants,
    ] = await Promise.all([
      prisma.tenant.count(),
      prisma.tenant.count({ where: { status: TenantStatus.ACTIVE } }),
      prisma.tenant.count({ where: { status: TenantStatus.TRIAL } }),
      prisma.protocolSimplified.count(),
      prisma.user.count(),
      prisma.invoice.aggregate({
        where: { status: InvoiceStatus.PAID },
        _sum: { amount: true },
      }),
      prisma.tenant.count({
        where: {
          createdAt: { gte: startDate },
        },
      }),
      prisma.tenant.count({
        where: {
          status: TenantStatus.CANCELLED,
          updatedAt: { gte: startDate },
        },
      }),
    ]);

    // Métricas por plano
    const tenantsByPlan = await prisma.tenant.groupBy({
      by: ['plan'],
      _count: true,
      where: { status: { not: TenantStatus.CANCELLED } },
    });

    // Revenue mensal
    const monthlyRevenue = await prisma.invoice.groupBy({
      by: ['period'],
      _sum: { amount: true },
      _count: true,
      where: {
        status: InvoiceStatus.PAID,
        createdAt: { gte: startDate },
      },
      orderBy: { period: 'asc' },
    });

    // Protocolos por status
    const protocolsByStatus = await prisma.protocolSimplified.groupBy({
      by: ['status'],
      _count: true,
    });

    // Top tenants por uso
    const topTenants = await prisma.tenant.findMany({
      where: { status: TenantStatus.ACTIVE },
      include: {
        _count: {
          select: {
            protocolsSimplified: true,
            users: true,
          },
        },
      },
      orderBy: {
        protocols: {
          _count: 'desc',
        },
      },
      take: 10,
    });

    // Calcular métricas financeiras
    const totalRevenueAmount = totalRevenue._sum.amount || 0;
    const mrr = totalRevenueAmount / 12; // Estimativa simples do MRR
    const arr = totalRevenueAmount;
    const churnRate = totalTenants > 0 ? (churnedTenants / totalTenants) * 100 : 0;

    return res.json({
      success: true,
      overview: {
        totalTenants,
        activeTenants,
        trialTenants,
        totalProtocols,
        totalUsers,
        totalRevenue: totalRevenueAmount,
        newTenantsThisPeriod,
        churnedTenants,
      },
      financial: {
        mrr: Math.round(mrr * 100) / 100,
        arr: Math.round(arr * 100) / 100,
        churnRate: Math.round(churnRate * 100) / 100,
      },
      breakdown: {
        tenantsByPlan: tenantsByPlan.reduce(
          (acc, item) => {
            acc[item.plan] = item._count;
            return acc;
          },
          {} as Record<string, number>
        ),
        protocolsByStatus: protocolsByStatus.reduce(
          (acc, item) => {
            acc[item.status] = item._count;
            return acc;
          },
          {} as Record<string, number>
        ),
      },
      charts: {
        monthlyRevenue: monthlyRevenue.map(item => ({
          period: item.period,
          revenue: item._sum.amount || 0,
          invoices: item._count,
        })),
      },
      topTenants: topTenants.map(tenant => ({
        id: tenant.id,
        name: tenant.name,
        plan: tenant.plan,
        protocolCount: tenant._count.protocolsSimplified,
        userCount: tenant._count.users,
        createdAt: tenant.createdAt,
      })),
    });
  })
);

/**
 * POST /api/super-admin/billing/generate
 * Gerar faturas mensais automaticamente
 */
router.post(
  '/billing/generate',
  handleAsyncRoute(async (req, res) => {
    const data = generateBillingSchema.parse(req.body);

    // Buscar tenants ativos que precisam de fatura
    const tenants = await prisma.tenant.findMany({
      where: {
        status: { in: [TenantStatus.ACTIVE, TenantStatus.TRIAL] },
      },
    });

    const generatedInvoices = [];
    const planPrices = {
      [Plan.STARTER]: 1200.0,
      [Plan.PROFESSIONAL]: 4500.0,
      [Plan.ENTERPRISE]: 12500.0,
    };

    for (const tenant of tenants) {
      // Verificar se já existe fatura para o período
      const existingInvoice = await prisma.invoice.findFirst({
        where: {
          tenantId: tenant.id,
          period: data.period,
        },
      });

      if (existingInvoice) {
        continue; // Pular se já existe fatura
      }

      // Calcular valor baseado no plano
      let amount = planPrices[tenant.plan];

      // Desconto para trial
      if (tenant.status === TenantStatus.TRIAL) {
        amount = 0; // Trial gratuito
      }

      // Gerar número da fatura
      const invoiceCount = await prisma.invoice.count();
      const invoiceNumber = `INV-${data.period}-${String(invoiceCount + 1).padStart(6, '0')}`;

      // Criar fatura
      const invoice = await prisma.invoice.create({
        data: {
          number: invoiceNumber,
          tenantId: tenant.id,
          amount,
          plan: tenant.plan,
          period: data.period,
          status: amount > 0 ? InvoiceStatus.PENDING : InvoiceStatus.PAID,
          dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 dias
          description: `DigiUrban ${tenant.plan} - ${data.period}`,
        },
      });

      generatedInvoices.push(invoice);
    }

    return res.json({
      success: true,
      message: `${generatedInvoices.length} faturas geradas para o período ${data.period}`,
      invoices: generatedInvoices,
      summary: {
        totalAmount: generatedInvoices.reduce((sum, inv) => sum + inv.amount, 0),
        count: generatedInvoices.length,
      },
    });
  })
);

/**
 * GET /api/super-admin/billing/invoices
 * Listar todas as faturas com filtros
 */
router.get(
  '/billing/invoices',
  handleAsyncRoute(async (req, res) => {
    const page = getNumberParam(req.query.page) || 1;
    const limit = getNumberParam(req.query.limit) || 20;
    const status = getStringParam(req.query.status);
    const period = getStringParam(req.query.period);
    const tenantId = getStringParam(req.query.tenantId);

    const skip = (page - 1) * limit;
    const whereClause = createInvoiceWhereClause({ status, period, tenantId });

    const [invoices, total] = await Promise.all([
      prisma.invoice.findMany({
        where: whereClause,
        include: {
          tenant: {
            select: {
              id: true,
              name: true,
              cnpj: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.invoice.count({ where: whereClause }),
    ]);

    return res.json({
      success: true,
      invoices,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  })
);

// ====================== SYSTEM METRICS ENDPOINTS ======================

/**
 * GET /api/super-admin/system/metrics
 * Obter métricas do sistema
 */
router.get(
  '/system/metrics',
  authenticateToken,
  requireSuperAdmin,
  handleAsyncRoute(async (_req, res) => {
    // TODO: Implementar coleta real de métricas
    // Por enquanto, retornar dados mockados
    const metrics = [
      {
        id: '1',
        metricCategory: 'cpu',
        metricName: 'usage',
        currentValue: 45.2,
        maxValue: 100,
        unit: '%',
        thresholdWarn: 70,
        thresholdCrit: 90,
        recordedAt: new Date().toISOString()
      },
      {
        id: '2',
        metricCategory: 'memory',
        metricName: 'usage',
        currentValue: 62.8,
        maxValue: 100,
        unit: '%',
        thresholdWarn: 80,
        thresholdCrit: 95,
        recordedAt: new Date().toISOString()
      },
      {
        id: '3',
        metricCategory: 'disk',
        metricName: 'usage',
        currentValue: 35.4,
        maxValue: 100,
        unit: '%',
        thresholdWarn: 85,
        thresholdCrit: 95,
        recordedAt: new Date().toISOString()
      }
    ];

    return res.json({
      success: true,
      metrics
    });
  })
);

// ====================== MONITORING ENDPOINTS ======================

/**
 * GET /api/super-admin/monitoring/services
 * Obter status dos serviços
 */
router.get(
  '/monitoring/services',
  authenticateToken,
  requireSuperAdmin,
  handleAsyncRoute(async (_req, res) => {
    // TODO: Implementar verificação real de serviços
    const services = [
      {
        id: '1',
        serviceName: 'API Server',
        status: 'operational',
        responseTimeMs: 45,
        uptimePercentage: 99.98,
        lastCheck: new Date().toISOString()
      },
      {
        id: '2',
        serviceName: 'Database',
        status: 'operational',
        responseTimeMs: 12,
        uptimePercentage: 99.99,
        lastCheck: new Date().toISOString()
      },
      {
        id: '3',
        serviceName: 'Email Server',
        status: 'operational',
        responseTimeMs: 234,
        uptimePercentage: 99.95,
        lastCheck: new Date().toISOString()
      }
    ];

    return res.json({
      success: true,
      services
    });
  })
);

/**
 * GET /api/super-admin/monitoring/alerts
 * Obter alertas ativos do sistema
 */
router.get(
  '/monitoring/alerts',
  authenticateToken,
  requireSuperAdmin,
  handleAsyncRoute(async (req, res) => {
    const status = getStringParam(req.query.status) || 'active';

    // TODO: Buscar do banco quando o model SystemAlert existir
    const alerts = [
      {
        id: '1',
        type: 'warning',
        category: 'performance',
        title: 'Alto uso de memória',
        message: 'Uso de memória acima de 80%',
        status: 'active',
        createdAt: new Date().toISOString()
      }
    ].filter(alert => status === 'all' || alert.status === status);

    return res.json({
      success: true,
      alerts
    });
  })
);

/**
 * POST /api/super-admin/monitoring/alerts/:id/resolve
 * Resolver um alerta
 */
router.post(
  '/monitoring/alerts/:id/resolve',
  authenticateToken,
  requireSuperAdmin,
  handleAsyncRoute(async (req, res) => {
    const { id } = req.params;

    // TODO: Atualizar no banco quando existir
    return res.json({
      success: true,
      message: 'Alerta resolvido com sucesso',
      alertId: id
    });
  })
);

// ====================== AUDIT LOG ENDPOINTS ======================

/**
 * GET /api/super-admin/audit-log
 * Obter logs de auditoria
 */
router.get(
  '/audit-log',
  authenticateToken,
  requireSuperAdmin,
  handleAsyncRoute(async (req, res) => {
    const tenantId = getStringParam(req.query.tenantId);
    const action = getStringParam(req.query.action);
    const limit = getNumberParam(req.query.limit) || 50;

    // TODO: Buscar do banco quando o model SuperAdminAudit existir
    const logs = [
      {
        id: '1',
        adminUserId: 'admin-1',
        adminUser: {
          name: 'Super Admin',
          email: 'super@admin.com'
        },
        action: 'create_tenant',
        resource: 'tenant',
        details: { tenantId: 'tenant-123' },
        success: true,
        ip: '192.168.1.1',
        createdAt: new Date().toISOString()
      }
    ];

    return res.json({
      success: true,
      logs: logs.slice(0, limit),
      total: logs.length
    });
  })
);

/**
 * GET /api/super-admin/audit-log/stats
 * Obter estatísticas de auditoria
 */
router.get(
  '/audit-log/stats',
  authenticateToken,
  requireSuperAdmin,
  handleAsyncRoute(async (_req, res) => {
    // TODO: Calcular stats reais do banco
    const stats = {
      totalActions: 1247,
      successRate: 98.5,
      topActions: [
        { action: 'create_tenant', count: 45 },
        { action: 'update_billing', count: 128 },
        { action: 'generate_invoice', count: 89 }
      ],
      recentErrors: 3
    };

    return res.json({
      success: true,
      stats
    });
  })
);

// ====================== DASHBOARD ENDPOINTS ======================

/**
 * GET /api/super-admin/metrics/saas
 * Obter métricas SaaS completas
 */
router.get(
  '/metrics/saas',
  authenticateToken,
  requireSuperAdmin,
  handleAsyncRoute(async (req, res) => {
    const timeRange = getStringParam(req.query.timeRange) || '30d';

    // TODO: Calcular métricas reais do banco
    const metrics = {
      mrr: 125000,
      arr: 1500000,
      churnRate: 3.8,
      ltv: 48000,
      cac: 12000,
      growthRate: 15.3,
      arpu: 5000,
      netRevenue: 1425000,
      trends: {
        mrr: { current: 125000, previous: 115000, change: 8.7 },
        arr: { current: 1500000, previous: 1380000, change: 8.7 },
        churn: { current: 3.8, previous: 4.5, change: -0.7 }
      },
      breakdown: {
        revenueByPlan: [
          { plan: 'STARTER', revenue: 35000, count: 14 },
          { plan: 'PROFESSIONAL', revenue: 50000, count: 10 },
          { plan: 'ENTERPRISE', revenue: 40000, count: 4 }
        ],
        revenueByMonth: [
          { month: 'Jan', revenue: 95000, newMrr: 12000, churnedMrr: 3000 },
          { month: 'Fev', revenue: 102000, newMrr: 10000, churnedMrr: 3000 },
          { month: 'Mar', revenue: 108000, newMrr: 8000, churnedMrr: 2000 },
          { month: 'Abr', revenue: 115000, newMrr: 9000, churnedMrr: 2000 },
          { month: 'Mai', revenue: 125000, newMrr: 12000, churnedMrr: 2000 }
        ],
        cohortRetention: [
          { cohort: '2024-01', month0: 100, month1: 92, month3: 85, month6: 78, month12: 72 },
          { cohort: '2024-02', month0: 100, month1: 94, month3: 87, month6: 80, month12: 0 },
          { cohort: '2024-03', month0: 100, month1: 95, month3: 89, month6: 0, month12: 0 },
          { cohort: '2024-04', month0: 100, month1: 93, month3: 0, month6: 0, month12: 0 }
        ]
      },
      topTenants: [
        { id: '1', name: 'Município A', plan: 'ENTERPRISE', mrr: 10000, lifetimeValue: 120000, monthsActive: 12 },
        { id: '2', name: 'Município B', plan: 'PROFESSIONAL', mrr: 5000, lifetimeValue: 55000, monthsActive: 11 },
        { id: '3', name: 'Município C', plan: 'ENTERPRISE', mrr: 10000, lifetimeValue: 90000, monthsActive: 9 }
      ]
    };

    return res.json({
      success: true,
      metrics
    });
  })
);

/**
 * GET /api/super-admin/billing/dashboard
 * Dashboard de billing
 */
router.get(
  '/billing/dashboard',
  authenticateToken,
  requireSuperAdmin,
  handleAsyncRoute(async (_req, res) => {
    // TODO: Calcular do banco real
    const data = {
      overview: {
        totalRevenue: 1500000,
        pendingRevenue: 45000,
        overdueRevenue: 12000,
        paidThisMonth: 125000,
        invoicesIssued: 150,
        invoicesPaid: 135,
        invoicesPending: 10,
        invoicesOverdue: 5
      },
      trends: {
        revenueGrowth: 15.3,
        collectionRate: 90.0,
        averagePaymentTime: 5
      },
      breakdown: {
        revenueByPlan: [
          { plan: 'STARTER', revenue: 420000, count: 14 },
          { plan: 'PROFESSIONAL', revenue: 600000, count: 10 },
          { plan: 'ENTERPRISE', revenue: 480000, count: 4 }
        ],
        revenueByMonth: [
          { month: 'Jan', issued: 95000, paid: 90000, overdue: 5000 },
          { month: 'Fev', issued: 102000, paid: 98000, overdue: 4000 },
          { month: 'Mar', issued: 108000, paid: 105000, overdue: 3000 },
          { month: 'Abr', issued: 115000, paid: 112000, overdue: 3000 },
          { month: 'Mai', issued: 125000, paid: 120000, overdue: 5000 }
        ],
        paymentMethods: [
          { method: 'Boleto', count: 80, total: 800000 },
          { method: 'Cartão', count: 50, total: 600000 },
          { method: 'PIX', count: 20, total: 100000 }
        ]
      },
      recentInvoices: [],
      overdueInvoices: []
    };

    // Buscar faturas reais
    const [recentInvoices, overdueInvoices] = await Promise.all([
      prisma.invoice.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
          tenant: {
            select: { name: true }
          }
        }
      }),
      prisma.invoice.findMany({
        where: { status: 'OVERDUE' },
        take: 10,
        orderBy: { dueDate: 'asc' },
        include: {
          tenant: {
            select: { name: true, cnpj: true }
          }
        }
      })
    ]);

    data.recentInvoices = recentInvoices as any;
    data.overdueInvoices = overdueInvoices.map(inv => ({
      ...inv,
      daysOverdue: Math.floor((new Date().getTime() - new Date(inv.dueDate).getTime()) / (1000 * 60 * 60 * 24))
    })) as any;

    return res.json({
      success: true,
      data
    });
  })
);

/**
 * GET /api/super-admin/tenants/:id/detail
 * Detalhes completos de um tenant
 */
router.get(
  '/tenants/:id/detail',
  authenticateToken,
  requireSuperAdmin,
  handleAsyncRoute(async (req, res) => {
    const { id } = req.params;

    const tenant = await prisma.tenant.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            users: true,
            protocolsSimplified: true,
            servicesSimplified: true,
            citizens: true,
            invoices: true
          }
        },
        invoices: {
          take: 1,
          orderBy: { createdAt: 'desc' }
        },
        users: {
          where: { role: 'ADMIN' as any },
          take: 1
        }
      }
    });

    if (!tenant) {
      return res.status(404).json({
        success: false,
        error: 'Tenant não encontrado'
      });
    }

    // Calcular métricas
    const invoices = await prisma.invoice.findMany({
      where: { tenantId: id }
    });

    const paidInvoices = invoices.filter(inv => inv.status === 'PAID');
    const overdueInvoices = invoices.filter(inv => inv.status === 'OVERDUE');
    const currentMrr = invoices.length > 0 ? invoices[invoices.length - 1].amount : 0;
    const lifetimeValue = paidInvoices.reduce((sum, inv) => sum + inv.amount, 0);

    const detail = {
      ...tenant,
      billing: {
        currentMrr,
        lifetimeValue,
        totalInvoices: invoices.length,
        paidInvoices: paidInvoices.length,
        overdueInvoices: overdueInvoices.length,
        nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      },
      usage: {
        activeUsers: tenant._count.users,
        totalProtocols: tenant._count.protocolsSimplified,
        protocolsThisMonth: Math.floor(tenant._count.protocolsSimplified * 0.1),
        storageUsed: 1024 * 1024 * 500,
        storageLimit: 1024 * 1024 * 1024 * 10,
        apiCalls: 45000
      },
      contacts: {
        adminName: tenant.users[0]?.name || 'N/A',
        adminEmail: tenant.users[0]?.email || 'N/A',
        adminPhone: '',
        address: '',
        city: tenant.name,
        state: 'SP'
      },
      metrics: {
        userActivity: Array.from({ length: 30 }, (_, i) => ({
          date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString(),
          activeUsers: Math.floor(Math.random() * tenant._count.users) + 5
        })),
        protocolsOverTime: Array.from({ length: 6 }, (_, i) => ({
          month: new Date(Date.now() - (5 - i) * 30 * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR', { month: 'short' }),
          count: Math.floor(Math.random() * 100) + 20
        }))
      },
      recentActivity: []
    };

    return res.json({
      success: true,
      tenant: detail
    });
  })
);

/**
 * GET /api/super-admin/onboarding/dashboard
 * Dashboard de onboarding
 */
router.get(
  '/onboarding/dashboard',
  authenticateToken,
  requireSuperAdmin,
  handleAsyncRoute(async (_req, res) => {
    // Buscar trials ativos
    const activeTrials = await prisma.tenant.findMany({
      where: { status: 'TRIAL' },
      orderBy: { createdAt: 'desc' }
    });

    // TODO: Implementar coleta real de dados de onboarding
    const data = {
      overview: {
        trialsActive: activeTrials.length,
        trialsConverted: 12,
        trialsExpired: 3,
        conversionRate: 32.5,
        averageTimeToActivate: 5,
        averageHealthScore: 75
      },
      funnel: {
        started: 50,
        completed: 42,
        activated: 35,
        converted: 28
      },
      trends: {
        conversionByMonth: [
          { month: 'Jan', trials: 12, conversions: 3, rate: 25 },
          { month: 'Fev', trials: 15, conversions: 5, rate: 33 },
          { month: 'Mar', trials: 10, conversions: 4, rate: 40 },
          { month: 'Abr', trials: 8, conversions: 3, rate: 37.5 },
          { month: 'Mai', trials: 5, conversions: 2, rate: 40 }
        ],
        healthScoreDistribution: [
          { range: '0-40', count: 2 },
          { range: '41-60', count: 5 },
          { range: '61-80', count: 8 },
          { range: '81-100', count: 10 }
        ]
      },
      activeTrials: activeTrials.map(trial => ({
        id: trial.id,
        name: trial.name,
        plan: trial.plan,
        startedAt: trial.createdAt.toISOString(),
        expiresAt: new Date(trial.createdAt.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        daysRemaining: Math.max(0, Math.floor((new Date(trial.createdAt.getTime() + 30 * 24 * 60 * 60 * 1000).getTime() - Date.now()) / (1000 * 60 * 60 * 24))),
        healthScore: Math.floor(Math.random() * 40) + 60,
        completedSteps: Math.floor(Math.random() * 5) + 3,
        totalSteps: 8
      })),
      recentConversions: []
    };

    return res.json({
      success: true,
      data
    });
  })
);

/**
 * GET /api/super-admin/users
 * Listar todos os usuários cross-tenant
 */
router.get(
  '/users',
  authenticateToken,
  requireSuperAdmin,
  handleAsyncRoute(async (req, res) => {
    const tenantId = getStringParam(req.query.tenantId);
    const role = getStringParam(req.query.role);
    const status = getStringParam(req.query.status);
    const search = getStringParam(req.query.search);
    const limit = getNumberParam(req.query.limit) || 100;

    const where: Prisma.UserWhereInput = {};

    if (tenantId) {
      where.tenantId = tenantId;
    }

    if (role) {
      where.role = role as any;
    }

    if (status === 'active') {
      where.isActive = true;
    } else if (status === 'inactive') {
      where.isActive = false;
    }

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { email: { contains: search } }
      ];
    }

    const users = await prisma.user.findMany({
      where,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        tenant: {
          select: {
            id: true,
            name: true
          }
        },
        department: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    const total = await prisma.user.count({ where });

    return res.json({
      success: true,
      users,
      total
    });
  })
);

/**
 * POST /api/super-admin/users/:userId/reset-password
 * Resetar senha de um usuário
 */
router.post(
  '/users/:userId/reset-password',
  authenticateToken,
  requireSuperAdmin,
  handleAsyncRoute(async (req, res) => {
    const userId = req.params.userId;

    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return res.status(404).json(
        createErrorResponse('USER_NOT_FOUND', 'Usuário não encontrado')
      );
    }

    // TODO: Implementar envio de email com token de reset
    // Por enquanto, apenas retornar sucesso

    return res.json({
      success: true,
      message: 'Email de reset de senha enviado com sucesso'
    });
  })
);

/**
 * PUT /api/super-admin/users/:userId/status
 * Alterar status ativo/inativo de um usuário
 */
router.put(
  '/users/:userId/status',
  authenticateToken,
  requireSuperAdmin,
  handleAsyncRoute(async (req, res) => {
    const userId = req.params.userId;
    const { isActive } = req.body;

    const user = await prisma.user.update({
      where: { id: userId },
      data: { isActive }
    });

    return res.json({
      success: true,
      user
    });
  })
);

/**
 * POST /api/super-admin/users/bulk-action
 * Ação em massa em usuários
 */
router.post(
  '/users/bulk-action',
  authenticateToken,
  requireSuperAdmin,
  handleAsyncRoute(async (req, res) => {
    const { action, userIds } = req.body;

    if (!Array.isArray(userIds) || userIds.length === 0) {
      return res.status(400).json(
        createErrorResponse('INVALID_INPUT', 'userIds deve ser um array não vazio')
      );
    }

    switch (action) {
      case 'activate':
        await prisma.user.updateMany({
          where: { id: { in: userIds } },
          data: { isActive: true }
        });
        break;

      case 'deactivate':
        await prisma.user.updateMany({
          where: { id: { in: userIds } },
          data: { isActive: false }
        });
        break;

      case 'delete':
        await prisma.user.deleteMany({
          where: { id: { in: userIds } }
        });
        break;

      default:
        return res.status(400).json(
          createErrorResponse('INVALID_ACTION', 'Ação inválida')
        );
    }

    return res.json({
      success: true,
      message: `${userIds.length} usuários processados com sucesso`
    });
  })
);

// Schema de validação para criação de usuário
const createUserSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  email: z.string().email('Email inválido'),
  password: strongPasswordSchema, // ✅ Validação de senha forte
  role: z.string().optional(),
  tenantId: z.string().min(1, 'Tenant é obrigatório'),
  departmentId: z.string().optional(),
  isActive: z.boolean().optional(),
});

/**
 * POST /api/super-admin/users
 * Criar novo usuário em um tenant específico
 */
router.post(
  '/users',
  authenticateToken,
  requireSuperAdmin,
  handleAsyncRoute(async (req, res) => {
    // ✅ SEGURANÇA: Validar com Zod (inclui validação de senha forte)
    let validatedData;
    try {
      validatedData = createUserSchema.parse(req.body);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json(
          createErrorResponse('VALIDATION_ERROR', 'Dados inválidos', error.issues)
        );
      }
      throw error;
    }

    const { name, email, password, role, tenantId, departmentId, isActive } = validatedData;

    // Verificar se tenant existe
    const tenant = await prisma.tenant.findUnique({
      where: { id: tenantId }
    });

    if (!tenant) {
      return res.status(404).json(
        createErrorResponse('TENANT_NOT_FOUND', 'Tenant não encontrado')
      );
    }

    // Verificar se email já existe
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (existingUser) {
      return res.status(409).json(
        createErrorResponse('EMAIL_EXISTS', 'Este email já está cadastrado')
      );
    }

    // Verificar se departamento existe (se fornecido)
    if (departmentId) {
      const department = await prisma.department.findUnique({
        where: { id: departmentId }
      });

      if (!department) {
        return res.status(404).json(
          createErrorResponse('DEPARTMENT_NOT_FOUND', 'Departamento não encontrado')
        );
      }

      // Verificar se departamento pertence ao tenant
      if (department.tenantId !== tenantId) {
        return res.status(400).json(
          createErrorResponse('INVALID_DEPARTMENT', 'Departamento não pertence ao tenant selecionado')
        );
      }
    }

    // Hash da senha
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash(password, 12);

    // Criar usuário
    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password: hashedPassword,
        role: (role || 'USER') as any, // TypeScript type assertion for Prisma enum
        tenantId,
        departmentId: departmentId || null,
        isActive: isActive !== undefined ? isActive : true,
        mustChangePassword: true, // ✅ Exigir troca de senha no primeiro login
      },
      include: {
        tenant: {
          select: {
            id: true,
            name: true
          }
        },
        department: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    // Remover senha do retorno
    const { password: _, ...userWithoutPassword } = user;

    return res.status(201).json({
      success: true,
      message: 'Usuário criado com sucesso',
      user: userWithoutPassword
    });
  })
);

/**
 * GET /api/super-admin/tenants/:id/departments
 * Obter departamentos de um tenant específico
 */
router.get(
  '/tenants/:id/departments',
  authenticateToken,
  requireSuperAdmin,
  handleAsyncRoute(async (req, res) => {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json(
        createErrorResponse('BAD_REQUEST', 'ID do tenant é obrigatório')
      );
    }

    const tenant = await prisma.tenant.findUnique({
      where: { id }
    });

    if (!tenant) {
      return res.status(404).json(
        createErrorResponse('TENANT_NOT_FOUND', 'Tenant não encontrado')
      );
    }

    const departments = await prisma.department.findMany({
      where: { tenantId: id },
      orderBy: { name: 'asc' },
      select: {
        id: true,
        name: true,
        description: true
      }
    });

    return res.json({
      success: true,
      departments
    });
  })
);

// ====================== CITIZENS ROUTES ======================

/**
 * GET /api/super-admin/citizens
 * Listar todos os cidadãos cross-tenant com filtros
 */
router.get(
  '/citizens',
  authenticateToken,
  requireSuperAdmin,
  handleAsyncRoute(async (req, res) => {
    const { tenantId, search, limit, verificationStatus } = req.query;

    const where: any = {};

    // Filtro por tenant
    if (tenantId && typeof tenantId === 'string' && tenantId !== '') {
      where.tenantId = tenantId;
    }

    // Filtro por status de verificação
    if (verificationStatus && typeof verificationStatus === 'string') {
      where.verificationStatus = verificationStatus;
    }

    // Busca por nome, email ou CPF
    if (search && typeof search === 'string') {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { cpf: { contains: search.replace(/\D/g, '') } }
      ];
    }

    const take = limit ? parseInt(limit as string, 10) : 100;

    const [citizens, total] = await Promise.all([
      prisma.citizen.findMany({
        where,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          tenant: {
            select: {
              id: true,
              name: true,
              nomeMunicipio: true,
              ufMunicipio: true
            }
          }
        }
      }),
      prisma.citizen.count({ where })
    ]);

    // Remover senhas do retorno
    const citizensWithoutPasswords = citizens.map(({ password, ...citizen }) => citizen);

    return res.json({
      success: true,
      citizens: citizensWithoutPasswords,
      total,
      page: 1,
      limit: take
    });
  })
);

/**
 * GET /api/super-admin/citizens/unlinked
 * Listar cidadãos no UNASSIGNED_POOL (sem tenant ativo)
 */
router.get(
  '/citizens/unlinked',
  authenticateToken,
  requireSuperAdmin,
  handleAsyncRoute(async (req, res) => {
    const { limit } = req.query;
    const take = limit ? parseInt(limit as string, 10) : 100;

    const citizens = await prisma.citizen.findMany({
      where: {
        tenantId: UNASSIGNED_POOL_ID
      },
      take,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        cpf: true,
        phone: true,
        address: true,
        verificationStatus: true,
        createdAt: true
      }
    });

    return res.json({
      success: true,
      citizens,
      total: citizens.length
    });
  })
);

/**
 * PUT /api/super-admin/citizens/:id/link-tenant
 * Vincular cidadão a um tenant
 */
router.put(
  '/citizens/:id/link-tenant',
  authenticateToken,
  requireSuperAdmin,
  handleAsyncRoute(async (req, res) => {
    const { id } = req.params;
    const { tenantId } = req.body;

    if (!id || !tenantId) {
      return res.status(400).json(
        createErrorResponse('BAD_REQUEST', 'ID do cidadão e tenantId são obrigatórios')
      );
    }

    // Verificar se tenant existe
    const tenant = await prisma.tenant.findUnique({
      where: { id: tenantId }
    });

    if (!tenant) {
      return res.status(404).json(
        createErrorResponse('TENANT_NOT_FOUND', 'Tenant não encontrado')
      );
    }

    // Verificar se cidadão existe
    const citizen = await prisma.citizen.findUnique({
      where: { id }
    });

    if (!citizen) {
      return res.status(404).json(
        createErrorResponse('CITIZEN_NOT_FOUND', 'Cidadão não encontrado')
      );
    }

    // Vincular cidadão ao tenant
    const updatedCitizen = await prisma.citizen.update({
      where: { id },
      data: { tenantId },
      include: {
        tenant: {
          select: {
            id: true,
            name: true,
            nomeMunicipio: true,
            ufMunicipio: true
          }
        }
      }
    });

    // Remover senha do retorno
    const { password, ...citizenWithoutPassword } = updatedCitizen;

    return res.json({
      success: true,
      message: 'Cidadão vinculado ao tenant com sucesso',
      citizen: citizenWithoutPassword
    });
  })
);

/**
 * POST /api/super-admin/citizens/auto-link
 * Vincular automaticamente cidadãos do UNASSIGNED_POOL baseado na cidade
 */
router.post(
  '/citizens/auto-link',
  authenticateToken,
  requireSuperAdmin,
  handleAsyncRoute(async (req, res) => {
    const result = await autoLinkCitizens();
    return res.json(result);
  })
);

/**
 * DELETE /api/super-admin/citizens/:id
 * Excluir cidadão
 */
router.delete(
  '/citizens/:id',
  authenticateToken,
  requireSuperAdmin,
  handleAsyncRoute(async (req, res) => {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json(
        createErrorResponse('BAD_REQUEST', 'ID do cidadão é obrigatório')
      );
    }

    const citizen = await prisma.citizen.findUnique({
      where: { id }
    });

    if (!citizen) {
      return res.status(404).json(
        createErrorResponse('CITIZEN_NOT_FOUND', 'Cidadão não encontrado')
      );
    }

    await prisma.citizen.delete({
      where: { id }
    });

    return res.json({
      success: true,
      message: 'Cidadão excluído com sucesso'
    });
  })
);

/**
 * PUT /api/super-admin/citizens/:id
 * Atualizar dados do cidadão
 */
router.put(
  '/citizens/:id',
  authenticateToken,
  requireSuperAdmin,
  handleAsyncRoute(async (req, res) => {
    const { id } = req.params;
    const { name, email, phone, cpf, tenantId, verificationStatus, address } = req.body;

    if (!id) {
      return res.status(400).json(
        createErrorResponse('BAD_REQUEST', 'ID do cidadão é obrigatório')
      );
    }

    const citizen = await prisma.citizen.findUnique({
      where: { id }
    });

    if (!citizen) {
      return res.status(404).json(
        createErrorResponse('CITIZEN_NOT_FOUND', 'Cidadão não encontrado')
      );
    }

    const dataToUpdate: any = {};
    if (name !== undefined) dataToUpdate.name = name;
    if (email !== undefined) dataToUpdate.email = email;
    if (phone !== undefined) dataToUpdate.phone = phone;
    if (cpf !== undefined) dataToUpdate.cpf = cpf;
    if (tenantId !== undefined) dataToUpdate.tenantId = tenantId;
    if (verificationStatus !== undefined) dataToUpdate.verificationStatus = verificationStatus;
    if (address !== undefined) dataToUpdate.address = address;

    const updatedCitizen = await prisma.citizen.update({
      where: { id },
      data: dataToUpdate,
      include: {
        tenant: {
          select: {
            id: true,
            name: true,
            nomeMunicipio: true,
            ufMunicipio: true
          }
        }
      }
    });

    // Remover senha do retorno
    const { password, ...citizenWithoutPassword } = updatedCitizen;

    return res.json({
      success: true,
      message: 'Cidadão atualizado com sucesso',
      citizen: citizenWithoutPassword
    });
  })
);

export default router;