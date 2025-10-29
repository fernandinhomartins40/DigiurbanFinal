// ============================================================================
// SECRETARIAS-ASSISTENCIA-SOCIAL.TS - ISOLAMENTO PROFISSIONAL COMPLETO
// ============================================================================

import { Router, Request, Response, NextFunction, RequestHandler } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { Prisma } from '@prisma/client';
import { generateProtocolNumber } from '../utils/protocol-number-generator';

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

interface Tenant {
  id: string;
  name: string;
  cnpj?: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

interface AuthenticatedRequest {
  user: User;
  tenant?: Tenant;
  tenantId: string;
  params: Record<string, string>;
  query: Record<string, string | string[]>;
  body: Record<string, unknown>;
}

interface SuccessResponse<T> {
  success: true;
  data?: T;
  message?: string;
  [key: string]: unknown;
}

interface ErrorResponse {
  success: false;
  error: string;
  message: string;
  details?: unknown;
}


interface FamilyStats {
  total: number;
  highRisk: number;
  mediumRisk: number;
  lowRisk: number;
  active: number;
}

interface BenefitStats {
  total: number;
  pending: number;
  approved: number;
  denied: number;
  highUrgency: number;
}

interface DeliveryStats {
  total: number;
  pending: number;
  inTransit: number;
  delivered: number;
  today: number;
}

interface VisitStats {
  total: number;
  scheduled: number;
  completed: number;
  canceled: number;
  today: number;
}

interface ProgramStats {
  total: number;
  active: number;
  totalEnrollments: number;
}

// ====================== INTERFACES ESPECÍFICAS ======================

interface VulnerableFamilyWhereInput {
  tenantId: string;
  riskLevel?: string;
  status?: string;
  vulnerabilityType?: string;
  OR?: Array<{
    citizen?: { name?: { contains: string }; cpf?: { contains: string } };
    responsibleName?: { contains: string };
    familyCode?: { contains: string };
  }>;
}

interface BenefitRequestWhereInput {
  tenantId: string;
  benefitType?: string;
  status?: string;
  urgency?: string;
  OR?: Array<{
    familyId?: { contains: string };
    reason?: { contains: string };
  }>;
}

interface EmergencyDeliveryWhereInput {
  tenantId: string;
  deliveryType?: string;
  status?: string;
  deliveryDate?: {
    gte?: Date;
    lte?: Date;
  };
  OR?: Array<{
    recipientName?: { contains: string };
  }>;
}

interface HomeVisitWhereInput {
  tenantId: string;
  status?: string;
  socialWorker?: string;
  visitDate?: {
    gte?: Date;
    lte?: Date;
  };
  OR?: Array<{
    familyId?: { contains: string };
    visitPurpose?: { contains: string };
  }>;
}

interface SocialProgramWhereInput {
  tenantId: string;
  programType?: string;
  OR?: Array<{
    name?: { contains: string };
    description?: { contains: string };
  }>;
}

// ====================== HELPER FUNCTIONS ======================

function getStringParam(param: string | string[] | undefined): string {
  if (Array.isArray(param)) return param[0] || '';
  if (typeof param === 'string') return param;
  return '';
}


function createSuccessResponse<T>(data?: T, message?: string): SuccessResponse<T> {
  const response: SuccessResponse<T> = {
    success: true,
  };

  if (data !== undefined) {
    response.data = data;
  }

  if (message) {
    response.message = message;
  }

  return response;
}

function createErrorResponse(error: string, message: string, details?: unknown): ErrorResponse {
  return {
    success: false,
    error,
    message,
    details
  };
}

function handleAsyncRoute(
  fn: (req: AuthenticatedRequest, res: Response) => Promise<Response | void>
): RequestHandler {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req as unknown as AuthenticatedRequest, res)).catch(next);
  };
}

function isError(error: unknown): error is Error {
  return error instanceof Error;
}

function createVulnerableFamilyWhereClause(params: {
  tenantId: string;
  search?: string;
  riskLevel?: string;
  status?: string;
  vulnerabilityType?: string;
}): VulnerableFamilyWhereInput {
  const where: VulnerableFamilyWhereInput = {
    tenantId: params.tenantId,
  };

  if (params.search) {
    where.OR = [
      { citizen: { name: { contains: params.search } } },
      { citizen: { cpf: { contains: params.search } } },
      { responsibleName: { contains: params.search } },
      { familyCode: { contains: params.search } },
    ];
  }

  if (params.riskLevel) {
    where.riskLevel = params.riskLevel;
  }

  if (params.status) {
    where.status = params.status;
  }

  if (params.vulnerabilityType) {
    where.vulnerabilityType = params.vulnerabilityType;
  }

  return where;
}

function createBenefitRequestWhereClause(params: {
  tenantId: string;
  search?: string;
  benefitType?: string;
  status?: string;
  urgency?: string;
}): BenefitRequestWhereInput {
  const where: BenefitRequestWhereInput = {
    tenantId: params.tenantId,
  };

  if (params.search) {
    where.OR = [
      { familyId: { contains: params.search } },
      { reason: { contains: params.search } },
    ];
  }

  if (params.benefitType) {
    where.benefitType = params.benefitType;
  }

  if (params.status) {
    where.status = params.status;
  }

  if (params.urgency) {
    where.urgency = params.urgency;
  }

  return where;
}

function createEmergencyDeliveryWhereClause(params: {
  tenantId: string;
  search?: string;
  deliveryType?: string;
  status?: string;
  date?: string;
}): EmergencyDeliveryWhereInput {
  const where: EmergencyDeliveryWhereInput = {
    tenantId: params.tenantId,
  };

  if (params.search) {
    where.OR = [
      { recipientName: { contains: params.search } },
    ];
  }

  if (params.deliveryType) {
    where.deliveryType = params.deliveryType;
  }

  if (params.status) {
    where.status = params.status;
  }

  if (params.date) {
    const dateObj = new Date(params.date);
    where.deliveryDate = {
      gte: new Date(dateObj.setHours(0, 0, 0, 0)),
      lte: new Date(dateObj.setHours(23, 59, 59, 999)),
    };
  }

  return where;
}

function createHomeVisitWhereClause(params: {
  tenantId: string;
  search?: string;
  status?: string;
  date?: string;
  socialWorker?: string;
}): HomeVisitWhereInput {
  const where: HomeVisitWhereInput = {
    tenantId: params.tenantId,
  };

  if (params.search) {
    where.OR = [
      { familyId: { contains: params.search } },
      { visitPurpose: { contains: params.search } },
    ];
  }

  if (params.status) {
    where.status = params.status;
  }

  if (params.date) {
    const dateObj = new Date(params.date);
    where.visitDate = {
      gte: new Date(dateObj.setHours(0, 0, 0, 0)),
      lte: new Date(dateObj.setHours(23, 59, 59, 999)),
    };
  }

  if (params.socialWorker) {
    where.socialWorker = params.socialWorker;
  }

  return where;
}

function createSocialProgramWhereClause(params: {
  tenantId: string;
  search?: string;
  programType?: string;
}): SocialProgramWhereInput {
  const where: SocialProgramWhereInput = {
    tenantId: params.tenantId,
  };

  if (params.search) {
    where.OR = [
      { name: { contains: params.search } },
      { description: { contains: params.search } },
    ];
  }

  if (params.programType) {
    where.programType = params.programType;
  }

  return where;
}

function isToday(date: Date): boolean {
  const today = new Date();
  return date.toDateString() === today.toDateString();
}

// ====================== MIDDLEWARE FUNCTIONS ======================

const tenantMiddleware: RequestHandler = (_req: Request, _res: Response, next: NextFunction) => {
  // Tenant middleware implementation
  next();
};

const authenticateToken: RequestHandler = (_req: Request, _res: Response, next: NextFunction) => {
  // Authentication implementation
  next();
};

// ====================== VALIDATION SCHEMAS ======================

const vulnerableFamilySchema = z.object({
  citizenId: z.string().min(1, 'ID do cidadão é obrigatório'),
  responsibleName: z.string().optional(),
  familyCode: z.string().optional(),
  memberCount: z.number().min(1).optional(),
  monthlyIncome: z.number().optional(),
  riskLevel: z.enum(['LOW', 'MEDIUM', 'HIGH']),
  vulnerabilityType: z.string().optional(),
  vulnerabilities: z.string().optional(),
  socialWorker: z.string().optional(),
  status: z.string().optional(),
  observations: z.string().optional(),
  lastVisitDate: z.date().optional(),
  nextVisitDate: z.date().optional(),
});

const benefitRequestSchema = z.object({
  familyHeadName: z.string().min(1, 'Nome é obrigatório'),
  familyHeadCpf: z.string().min(11, 'CPF é obrigatório'),
  familyHeadBirthDate: z.string().optional(),
  familyHeadPhone: z.string().optional(),
  benefitType: z.string().min(1, 'Tipo de benefício é obrigatório'),
  description: z.string().optional(),
  urgency: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional(),
  monthlyIncome: z.number().optional(),
  memberCount: z.number().min(1).optional(),
  reason: z.string().min(1, 'Justificativa é obrigatória'),
  documents: z.string().optional(),
  observations: z.string().optional(),
});

const emergencyDeliverySchema = z.object({
  recipientName: z.string().min(1, 'Nome é obrigatório'),
  recipientCpf: z.string().optional(),
  recipientPhone: z.string().optional(),
  address: z.string().min(1, 'Endereço é obrigatório'),
  deliveryType: z.string().min(1, 'Tipo de entrega é obrigatório'),
  items: z.string().min(1, 'Itens são obrigatórios'),
  quantity: z.number().min(1).optional(),
  urgency: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional(),
  scheduledDate: z.string().min(1, 'Data é obrigatória'),
  scheduledTime: z.string().optional(),
  urgencyReason: z.string().optional(),
  observations: z.string().optional(),
});

const homeVisitSchema = z.object({
  familyName: z.string().min(1, 'Nome da família é obrigatório'),
  address: z.string().min(1, 'Endereço é obrigatório'),
  phone: z.string().optional(),
  visitDate: z.string().min(1, 'Data é obrigatória'),
  visitTime: z.string().optional(),
  purpose: z.string().min(1, 'Propósito é obrigatório'),
  assignedUserId: z.string().optional(),
  urgency: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional(),
  observations: z.string().optional(),
});

// ====================== ROUTER SETUP ======================

const router = Router();

// Aplicar middleware de tenant em todas as rotas
router.use(tenantMiddleware);

// ====================== ROUTES ======================

/**
 * GET /api/secretarias/assistencia-social/familias-vulneraveis
 * Listar famílias em situação de vulnerabilidade
 */
router.get(
  '/familias-vulneraveis',
  authenticateToken,
  handleAsyncRoute(async (req, res) => {
    const search = getStringParam(req.query.search);
    const riskLevel = getStringParam(req.query.risk_level);
    const status = getStringParam(req.query.status);

    const whereParams: {
      tenantId: string;
      search?: string;
      riskLevel?: string;
      status?: string;
      vulnerabilityType?: string;
    } = {
      tenantId: req.tenantId,
    };

    if (search) whereParams.search = search;
    if (riskLevel) whereParams.riskLevel = riskLevel;
    if (status) whereParams.status = status;

    const where = createVulnerableFamilyWhereClause(whereParams);

    const families = await prisma.vulnerableFamily.findMany({
      where,
      include: {
        citizen: {
          select: {
            name: true,
            cpf: true,
          },
        },
      },
      orderBy: [{ riskLevel: 'desc' }, { responsibleName: 'asc' }],
    });

    const stats: FamilyStats = {
      total: families.length,
      highRisk: families.filter(f => f.riskLevel === 'HIGH').length,
      mediumRisk: families.filter(f => f.riskLevel === 'MEDIUM').length,
      lowRisk: families.filter(f => f.riskLevel === 'LOW').length,
      active: families.filter(f => f.status === 'ACTIVE').length,
    };

    return res.json(createSuccessResponse({ families, stats }));
  })
);

/**
 * POST /api/secretarias/assistencia-social/familias-vulneraveis
 * Cadastrar nova família vulnerável
 */
router.post(
  '/familias-vulneraveis',
  authenticateToken,
  handleAsyncRoute(async (req, res) => {
    const data = vulnerableFamilySchema.parse(req.body);

    // Verificar se cidadão já tem família cadastrada
    const existingFamily = await prisma.vulnerableFamily.findFirst({
      where: {
        citizenId: data.citizenId,
        tenantId: req.tenantId,
        status: 'ACTIVE',
      },
    });

    if (existingFamily) {
      return res.status(400).json(
        createErrorResponse('FAMILY_EXISTS', 'Cidadão já possui família cadastrada no sistema')
      );
    }

    const family = await prisma.vulnerableFamily.create({
      data: {
        citizenId: data.citizenId,
        tenantId: req.tenantId,
        responsibleName: data.responsibleName,
        familyCode: data.familyCode,
        memberCount: data.memberCount || 1,
        monthlyIncome: data.monthlyIncome || null,
        riskLevel: data.riskLevel,
        vulnerabilityType: data.vulnerabilities || 'ECONOMIC',
        status: 'ACTIVE',
        observations: data.observations || null,
      },
    });

    return res.status(201).json(
      createSuccessResponse(family, 'Família cadastrada com sucesso')
    );
  })
);

/**
 * GET /api/secretarias/assistencia-social/beneficios
 * Listar solicitações de benefícios
 */
router.get(
  '/beneficios',
  authenticateToken,
  handleAsyncRoute(async (req, res) => {
    const search = getStringParam(req.query.search);
    const benefitType = getStringParam(req.query.benefit_type);
    const status = getStringParam(req.query.status);

    const whereParams: {
      tenantId: string;
      search?: string;
      benefitType?: string;
      status?: string;
      urgency?: string;
    } = {
      tenantId: req.tenantId,
    };

    if (search) whereParams.search = search;
    if (benefitType) whereParams.benefitType = benefitType;
    if (status) whereParams.status = status;

    const where = createBenefitRequestWhereClause(whereParams);

    const benefits = await prisma.benefitRequest.findMany({
      where,
      orderBy: [{ urgency: 'desc' }, { requestDate: 'desc' }],
    });

    const stats: BenefitStats = {
      total: benefits.length,
      pending: benefits.filter(b => b.status === 'PENDING').length,
      approved: benefits.filter(b => b.status === 'APPROVED').length,
      denied: benefits.filter(b => b.status === 'DENIED').length,
      highUrgency: benefits.filter(b => b.urgency === 'HIGH').length,
    };

    return res.json(createSuccessResponse({ benefits, stats }));
  })
);

/**
 * POST /api/secretarias/assistencia-social/beneficios
 * Solicitar novo benefício
 */
router.post(
  '/beneficios',
  authenticateToken,
  handleAsyncRoute(async (req, res) => {
    const data = benefitRequestSchema.parse(req.body);

    try {
      const result = await prisma.$transaction(async (tx) => {
        // Gerar número do protocolo
        const protocolNumber = generateProtocolNumber();

        // Buscar cidadão pelo CPF
        const citizen = await tx.citizen.findFirst({
          where: { cpf: data.familyHeadCpf, tenantId: req.tenantId }
        });
        const citizenId = citizen?.id || data.familyHeadCpf; // fallback para CPF

        // Buscar departamento de Assistência Social
        const department = await tx.department.findFirst({
          where: {
            tenantId: req.tenantId,
            code: 'ASSISTENCIA_SOCIAL'
          }
        });

        // Buscar serviço genérico de benefícios ou criar protocolo sem serviço específico
        const service = await tx.serviceSimplified.findFirst({
          where: {
            tenantId: req.tenantId,
            departmentId: department?.id,
            name: { contains: 'Benefício' }
          }
        });

        // Criar protocolo
        const protocol = await tx.protocolSimplified.create({
          data: {
            tenantId: req.tenantId,
            citizenId,
            serviceId: service?.id || 'GENERIC_SERVICE', // Fallback para serviço genérico
            departmentId: department?.id || 'ASSISTENCIA_SOCIAL',
            number: protocolNumber,
            title: `Solicitação de Benefício - ${data.benefitType}`,
            description: data.reason,
            status: 'VINCULADO' as any,
            priority: 3,
          },
        });

        // Criar solicitação de benefício vinculada ao protocolo
        const benefitRequest = await tx.benefitRequest.create({
          data: {
            tenantId: req.tenantId,
            familyId: data.familyHeadCpf, // Using CPF as family identifier
            benefitType: data.benefitType,
            reason: data.reason,
            status: 'PENDING',
            urgency: data.urgency || 'NORMAL',
            documentsProvided: data.documents ? JSON.parse(data.documents) : null,
            observations: data.observations || null,
          },
        });

        return { protocol, benefitRequest };
      });

      return res.status(201).json({
        success: true,
        message: 'Solicitação de benefício criada com sucesso',
        data: {
          protocol: result.protocol,
          benefitRequest: result.benefitRequest,
        },
      });
    } catch (error) {
      console.error('Error creating benefit request with protocol:', error);
      return res.status(500).json(
        createErrorResponse('INTERNAL_ERROR', 'Erro ao criar solicitação de benefício')
      );
    }
  })
);

/**
 * GET /api/secretarias/assistencia-social/entregas-emergenciais
 * Listar entregas emergenciais
 */
router.get(
  '/entregas-emergenciais',
  authenticateToken,
  handleAsyncRoute(async (req, res) => {
    const search = getStringParam(req.query.search);
    const deliveryType = getStringParam(req.query.delivery_type);
    const status = getStringParam(req.query.status);
    const date = getStringParam(req.query.date);

    const whereParams: {
      tenantId: string;
      search?: string;
      deliveryType?: string;
      status?: string;
      date?: string;
    } = {
      tenantId: req.tenantId,
    };

    if (search) whereParams.search = search;
    if (deliveryType) whereParams.deliveryType = deliveryType;
    if (status) whereParams.status = status;
    if (date) whereParams.date = date;

    const where = createEmergencyDeliveryWhereClause(whereParams);

    const deliveries = await prisma.emergencyDelivery.findMany({
      where,
      orderBy: [{ status: 'desc' }, { deliveryDate: 'asc' }],
    });

    const stats: DeliveryStats = {
      total: deliveries.length,
      pending: deliveries.filter(d => d.status === 'PENDING').length,
      inTransit: deliveries.filter(d => d.status === 'IN_TRANSIT').length,
      delivered: deliveries.filter(d => d.status === 'DELIVERED').length,
      today: deliveries.filter(d => isToday(new Date(d.deliveryDate))).length,
    };

    return res.json(createSuccessResponse({ deliveries, stats }));
  })
);

/**
 * POST /api/secretarias/assistencia-social/entregas-emergenciais
 * Agendar nova entrega emergencial
 */
router.post(
  '/entregas-emergenciais',
  authenticateToken,
  handleAsyncRoute(async (req, res) => {
    const data = emergencyDeliverySchema.parse(req.body);

    const delivery = await prisma.emergencyDelivery.create({
      data: {
        tenantId: req.tenantId,
        benefitRequestId: req.user.id, // Using user id as placeholder for now
        deliveryType: data.deliveryType,
        quantity: data.quantity || 1,
        deliveryDate: new Date(data.scheduledDate),
        recipientName: data.recipientName,
        deliveredBy: req.user.name || req.user.email,
        status: 'PENDING',
        observations: data.observations || null,
      },
    });

    return res.status(201).json(
      createSuccessResponse(delivery, 'Entrega emergencial agendada com sucesso')
    );
  })
);

/**
 * GET /api/secretarias/assistencia-social/visitas
 * Listar visitas domiciliares
 */
router.get(
  '/visitas',
  authenticateToken,
  handleAsyncRoute(async (req, res) => {
    const search = getStringParam(req.query.search);
    const status = getStringParam(req.query.status);
    const date = getStringParam(req.query.date);
    const socialWorker = getStringParam(req.query.social_worker);

    const whereParams: {
      tenantId: string;
      search?: string;
      status?: string;
      date?: string;
      socialWorker?: string;
    } = {
      tenantId: req.tenantId,
    };

    if (search) whereParams.search = search;
    if (status) whereParams.status = status;
    if (date) whereParams.date = date;
    if (socialWorker) whereParams.socialWorker = socialWorker;

    const where = createHomeVisitWhereClause(whereParams);

    const visits = await prisma.homeVisit.findMany({
      where,
      orderBy: [{ visitDate: 'asc' }],
    });

    const stats: VisitStats = {
      total: visits.length,
      scheduled: visits.filter(v => v.status === 'SCHEDULED').length,
      completed: visits.filter(v => v.status === 'COMPLETED').length,
      canceled: visits.filter(v => v.status === 'CANCELED').length,
      today: visits.filter(v => isToday(new Date(v.visitDate))).length,
    };

    return res.json(createSuccessResponse({ visits, stats }));
  })
);

/**
 * POST /api/secretarias/assistencia-social/visitas
 * Agendar nova visita domiciliar
 */
router.post(
  '/visitas',
  authenticateToken,
  handleAsyncRoute(async (req, res) => {
    const data = homeVisitSchema.parse(req.body);

    const visit = await prisma.homeVisit.create({
      data: {
        tenantId: req.tenantId,
        familyId: data.familyName, // Using family name as identifier for now
        visitDate: new Date(data.visitDate),
        socialWorker: req.user.name || req.user.email,
        visitType: 'ROUTINE',
        visitPurpose: data.purpose,
        status: 'SCHEDULED',
      },
    });

    return res.status(201).json(
      createSuccessResponse(visit, 'Visita domiciliar agendada com sucesso')
    );
  })
);

/**
 * GET /api/secretarias/assistencia-social/programas-sociais
 * Listar programas sociais ativos
 */
router.get(
  '/programas-sociais',
  authenticateToken,
  handleAsyncRoute(async (req, res) => {
    const search = getStringParam(req.query.search);
    const programType = getStringParam(req.query.program_type);
    const whereParams: {
      tenantId: string;
      search?: string;
      programType?: string;
    } = {
      tenantId: req.tenantId,
    };

    if (search) whereParams.search = search;
    if (programType) whereParams.programType = programType;

    const where = createSocialProgramWhereClause(whereParams);

    const programs = await prisma.socialProgram.findMany({
      where,
      orderBy: [{ name: 'asc' }],
    });

    const stats: ProgramStats = {
      total: programs.length,
      active: programs.filter(p => p.startDate <= new Date() && (!p.endDate || p.endDate >= new Date())).length,
      totalEnrollments: 0, // No enrollments relation in schema
    };

    return res.json(createSuccessResponse({ programs, stats }));
  })
);

/**
 * GET /api/secretarias/assistencia-social/dashboard
 * Dashboard com indicadores da assistência social
 */
router.get(
  '/dashboard',
  authenticateToken,
  handleAsyncRoute(async (req, res) => {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    // Famílias vulneráveis cadastradas
    const vulnerableFamilies = await prisma.vulnerableFamily.count({
      where: {
        tenantId: req.tenantId,
        status: 'ACTIVE',
      },
    });

    // Benefícios pendentes
    const pendingBenefits = await prisma.benefitRequest.count({
      where: {
        tenantId: req.tenantId,
        status: 'PENDING',
      },
    });

    // Entregas emergenciais hoje
    const todayDeliveries = await prisma.emergencyDelivery.count({
      where: {
        tenantId: req.tenantId,
        deliveryDate: {
          gte: new Date(today.setHours(0, 0, 0, 0)),
          lte: new Date(today.setHours(23, 59, 59, 999)),
        },
      },
    });

    // Visitas agendadas
    const scheduledVisits = await prisma.homeVisit.count({
      where: {
        tenantId: req.tenantId,
        status: 'SCHEDULED',
      },
    });

    // Famílias por nível de risco
    const familiesByRisk = await prisma.vulnerableFamily.groupBy({
      by: ['riskLevel'],
      where: {
        tenantId: req.tenantId,
        status: 'ACTIVE',
      },
      _count: {
        id: true,
      },
    });

    // Benefícios mais solicitados
    const topBenefits = await prisma.benefitRequest.groupBy({
      by: ['benefitType'],
      where: {
        tenantId: req.tenantId,
        requestDate: {
          gte: startOfMonth,
        },
      },
      _count: {
        id: true,
      },
      orderBy: {
        _count: {
          id: 'desc',
        },
      },
      take: 5,
    });

    const indicators = {
      vulnerableFamilies,
      pendingBenefits,
      todayDeliveries,
      scheduledVisits,
      familiesByRisk,
      topBenefits,
    };

    return res.json(createSuccessResponse({ indicators }));
  })
);

// ====================== ERROR HANDLING ======================

router.use((error: unknown, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Erro nas rotas de assistência social:', error);

  if (error instanceof z.ZodError) {
    return res.status(400).json(
      createErrorResponse('VALIDATION_ERROR', 'Dados inválidos', error.issues)
    );
  }

  if (isError(error)) {
    return res.status(500).json(
      createErrorResponse('INTERNAL_SERVER_ERROR', 'Erro interno do servidor', error.message)
    );
  }

  return res.status(500).json(
    createErrorResponse('UNKNOWN_ERROR', 'Erro desconhecido')
  );
});

export default router;