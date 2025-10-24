// ============================================================================
// FASE 2 - MIGRAÇÃO COMPLETA SOCIAL-ASSISTANCE.TS - PADRÃO MODERNO 2024
// ============================================================================

import { Router, Response, NextFunction, RequestHandler } from 'express';
import { z } from 'zod';
import { prisma } from '../../lib/prisma';
import { tenantMiddleware } from '../../middleware/tenant';
import { adminAuthMiddleware, requirePermission } from '../../middleware/admin-auth';
import {
  createSuccessResponse,
  createErrorResponse,
  createPaginatedResponse,
  createValidationErrorResponse,
  type AuthenticatedHandler,
  type AuthenticatedRequest,
} from '../../types';
import { isFullyAuthenticatedRequest, isValidId } from '../../utils/guards';

// ===== TIPOS LOCAIS ISOLADOS - COMPATÍVEIS COM PRISMA REAL =====

// Helper para query params seguros - SEM ANY!
function getStringParam(param: unknown): string {
  if (Array.isArray(param)) return String(param[0] || '');
  if (typeof param === 'string') return param;
  if (param && typeof param === 'object' && param !== null) {
    return String(param);
  }
  return '';
}

function getNumberParam(value: unknown, defaultValue: number = 1): number {
  if (typeof value === 'string') {
    const parsed = parseInt(value, 10);
    return isNaN(parsed) ? defaultValue : parsed;
  }
  return defaultValue;
}

// Interfaces compatíveis com PRISMA REAL - TIPOS EXPLÍCITOS
interface VulnerableFamilyWhereInput {
  tenantId: string;
  riskLevel?: string;
  vulnerabilityType?: { contains: string; mode: 'insensitive' };
  isActive?: boolean;
  OR?: Array<{
    familyCode?: { contains: string; mode: 'insensitive' };
    responsibleName?: { contains: string; mode: 'insensitive' };
  }>;
}

interface BenefitRequestWhereInput {
  tenantId: string;
  familyId?: string;
  benefitType?: string;
  status?: string;
  urgency?: string;
}

interface EmergencyDeliveryWhereInput {
  tenantId: string;
  citizenId?: string;
  deliveryType?: string;
  status?: string;
  urgency?: string;
}

interface HomeVisitWhereInput {
  tenantId: string;
  familyId?: string;
  socialWorkerId?: string;
  visitType?: string;
  purpose?: string;
}

interface SocialProgramWhereInput {
  tenantId: string;
  programType?: string;
  targetGroup?: { contains: string; mode: 'insensitive' };
  isActive?: boolean;
}

interface SocialAssistanceAttendanceWhereInput {
  tenantId: string;
  serviceType?: string;
  urgency?: string;
  citizenId?: string;
  attendanceType?: string;
  priority?: string;
}

// Interface para resultados de groupBy - TIPADO EXPLICITAMENTE
interface VulnerabilityGroupResult {
  vulnerabilityLevel: string;
  _count: { vulnerabilityLevel: number };
}

interface BenefitTypeGroupResult {
  benefitType: string;
  _count: { benefitType: number };
}

interface DeliveryTypeGroupResult {
  deliveryType: string;
  _count: { deliveryType: number };
}

const router = Router();

// Middleware global
router.use(tenantMiddleware);
router.use(adminAuthMiddleware);

// ===== TIPOS ESPECÍFICOS PARA ASSISTÊNCIA SOCIAL - ISOLADOS E LIMPOS =====

// Apenas tipos realmente utilizados - SEM INTERFACES ÓRFÃS

// ====================== SCHEMAS DE VALIDAÇÃO ======================

// SCHEMAS ALINHADOS COM PRISMA REAL
const vulnerableFamilySchema = z.object({
  // REGRA DE OURO: CRIAR campos que existem no schema Prisma
  citizenId: z.string().min(1, 'ID do cidadão é obrigatório'),
  familyCode: z.string().optional(),
  responsibleName: z.string().optional(),
  memberCount: z.number().int().min(1, 'Quantidade de membros é obrigatória'),
  monthlyIncome: z.number().min(0).optional(),
  riskLevel: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).default('LOW'),
  vulnerabilityType: z.string().min(2, 'Tipo de vulnerabilidade é obrigatório'),
  socialWorker: z.string().optional(),
  status: z.enum(['ACTIVE', 'ASSISTED', 'RESOLVED', 'INACTIVE']).default('ACTIVE'),
  observations: z.string().optional(),
  lastVisitDate: z.string().transform(str => new Date(str)).optional(),
  nextVisitDate: z.string().transform(str => new Date(str)).optional(),
});

const benefitRequestSchema = z.object({
  familyId: z.string().min(1, 'Família é obrigatória'),
  benefitType: z.string().min(2, 'Tipo de benefício é obrigatório'),
  urgency: z.enum(['NORMAL', 'HIGH', 'CRITICAL']).default('NORMAL'),
  reason: z.string().min(10, 'Motivo da solicitação é obrigatório'),
  documentsProvided: z.record(z.string(), z.unknown()).optional(),
  observations: z.string().optional(),
});

const emergencyDeliverySchema = z.object({
  citizenId: z.string().min(1, 'Cidadão é obrigatório'),
  deliveryType: z.string().min(2, 'Tipo de entrega é obrigatório'),
  quantity: z.number().int().min(1).default(1),
  deliveryDate: z.string().transform(str => new Date(str)),
  recipientName: z.string().min(2, 'Nome do recebedor é obrigatório'),
  deliveredBy: z.string().min(2, 'Responsável pela entrega é obrigatório'),
  urgency: z.enum(['normal', 'alta', 'critica']).default('normal'),
  status: z.enum(['pendente', 'entregue', 'cancelado']).default('pendente'),
  observations: z.string().optional(),
});

const homeVisitSchema = z.object({
  familyId: z.string().min(1, 'Família é obrigatória'),
  visitDate: z.string().transform(str => new Date(str)),
  socialWorkerId: z.string().min(1, 'Assistente social é obrigatório'),
  visitType: z.enum(['rotina', 'emergencia', 'acompanhamento']).default('rotina'),
  purpose: z.string().min(2, 'Propósito da visita é obrigatório'),
  findings: z.string().optional(),
  recommendations: z.string().optional(),
  nextVisitDate: z.string().transform(str => new Date(str)).optional(),
  status: z.enum(['agendada', 'realizada', 'cancelada']).default('agendada'),
});

const socialProgramSchema = z.object({
  name: z.string().min(2, 'Nome do programa é obrigatório'),
  programType: z.string().min(2, 'Tipo do programa é obrigatório'),
  description: z.string().min(10, 'Descrição é obrigatória'),
  objectives: z.record(z.string(), z.unknown()),
  targetGroup: z.string().min(2, 'Público alvo é obrigatório'),
  requirements: z.record(z.string(), z.unknown()),
  benefits: z.record(z.string(), z.unknown()),
  benefitValue: z.number().min(0).optional(),
  frequency: z.string().optional(),
  startDate: z.string().transform(str => new Date(str)),
  endDate: z.string().transform(str => new Date(str)).optional(),
  budget: z.number().min(0).optional(),
  maxParticipants: z.number().int().min(1).optional(),
  coordinator: z.string().min(2, 'Coordenador é obrigatório'),
  isActive: z.boolean().default(true),
});

const socialAssistanceAttendanceSchema = z.object({
  citizenId: z.string().min(1, 'Cidadão é obrigatório'),
  attendanceType: z.string().min(2, 'Tipo de atendimento é obrigatório'),
  subject: z.string().min(2, 'Assunto é obrigatório'),
  description: z.string().min(10, 'Descrição é obrigatória'),
  urgency: z.enum(['normal', 'alta', 'critica']).default('normal'),
  vulnerability: z.string().optional(),
  socialWorkerId: z.string().optional(),
  referredBy: z.string().optional(),
  familyIncome: z.number().min(0).optional(),
  familySize: z.number().int().min(1).optional(),
  followUpNeeded: z.boolean().default(false),
  followUpDate: z.string().transform(str => new Date(str)).optional(),
  priority: z.enum(['baixa', 'normal', 'alta', 'urgente']).default('normal'),
  resolution: z.string().optional(),
});

// ====================== HELPER FUNCTIONS ======================

const validateSchemaAndRespond = <T>(
  schema: z.ZodSchema<T>,
  data: unknown,
  res: Response
): T | null => {
  const result = schema.safeParse(data);
  if (!result.success) {
    const errors = result.error.issues.map(err => ({
      field: err.path.join('.'),
      message: err.message,
      value: err.input,
    }));
    res.status(400).json(createValidationErrorResponse(errors));
    return null;
  }
  return result.data;
};

const handleAsyncRoute = (handler: AuthenticatedHandler): RequestHandler => {
  return async (req, res, next) => {
    try {
      if (!isFullyAuthenticatedRequest(req)) {
        res.status(401).json(createErrorResponse('AUTH_ERROR', 'Acesso não autorizado'));
        return;
      }
      await handler(req, res, next);
    } catch (error) {
      console.error('Route error:', error);
      res.status(500).json(createErrorResponse('SERVER_ERROR', 'Erro interno do servidor'));
    }
  };
};

// ====================== FAMÍLIAS VULNERÁVEIS ======================

// GET /api/specialized/social-assistance/families
router.get(
  '/families',
  requirePermission('social-assistance:read'),
  handleAsyncRoute(async (req, res) => {
    const {
      riskLevel,
      vulnerabilityType,
      status,
      search,
      page = '1',
      limit = '20',
    } = req.query;

    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const offset = (pageNum - 1) * limitNum;

    // Construção segura da where clause com tipos PRISMA REAIS
    const where: VulnerableFamilyWhereInput = { tenantId: req.tenantId };

    if (riskLevel) {
      where.riskLevel = getStringParam(riskLevel);
    }
    if (vulnerabilityType) {
      where.vulnerabilityType = {
        contains: getStringParam(vulnerabilityType),
        mode: 'insensitive'
      };
    }
    if (status) {
      where.isActive = getStringParam(status) === 'ativo';
    }
    if (search) {
      const searchStr = getStringParam(search);
      // Buscar por campos diretos (Prisma não suporta nested relations em OR)
      where.OR = [
        { familyCode: { contains: searchStr, mode: 'insensitive' } },
        { responsibleName: { contains: searchStr, mode: 'insensitive' } },
      ];
    }

    const [families, total] = await Promise.all([
      prisma.vulnerableFamily.findMany({
        where,
        include: {
          citizen: {
            select: {
              id: true,
              name: true,
              cpf: true,
              email: true,
              phone: true,
            },
          },
          _count: {
            select: {
              homeVisits: true,
              benefitRequests: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: offset,
        take: limitNum,
      }),
      prisma.vulnerableFamily.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limitNum);

    res.json(
      createPaginatedResponse(families, {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages,
        hasNext: pageNum < totalPages,
        hasPrev: pageNum > 1,
      })
    );
  })
);

// POST /api/specialized/social-assistance/families
router.post(
  '/families',
  requirePermission('social-assistance:write'),
  handleAsyncRoute(async (req, res) => {
    const validatedData = validateSchemaAndRespond(vulnerableFamilySchema, req.body, res);
    if (!validatedData) return;

    // Verificar se o cidadão já tem uma família cadastrada
    const existingFamily = await prisma.vulnerableFamily.findFirst({
      where: {
        tenantId: req.tenantId,
        citizenId: validatedData.citizenId,
      },
    });

    if (existingFamily) {
      res.status(409).json(createErrorResponse('CONFLICT', 'Cidadão já possui uma família cadastrada'));
      return;
    }

    const family = await prisma.vulnerableFamily.create({
      data: {
        citizenId: validatedData.citizenId,
        tenantId: req.tenantId,
        memberCount: validatedData.memberCount || 1,
        monthlyIncome: validatedData.monthlyIncome,
        riskLevel: validatedData.riskLevel || 'LOW',
        vulnerabilityType: validatedData.vulnerabilityType,
        responsibleName: validatedData.responsibleName,
        familyCode: validatedData.familyCode,
        socialWorker: validatedData.socialWorker,
        status: validatedData.status || 'ACTIVE',
        observations: validatedData.observations,
        lastVisitDate: validatedData.lastVisitDate,
        nextVisitDate: validatedData.nextVisitDate,
      },
    });

    res.status(201).json(createSuccessResponse(family, 'Família cadastrada com sucesso'));
  })
);

// ====================== SOLICITAÇÕES DE BENEFÍCIOS ======================

// GET /api/specialized/social-assistance/benefit-requests
router.get(
  '/benefit-requests',
  requirePermission('social-assistance:read'),
  handleAsyncRoute(async (req, res) => {
    const { familyId, benefitType, status, urgency, page = '1', limit = '20' } = req.query;

    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const offset = (pageNum - 1) * limitNum;

    const where: BenefitRequestWhereInput = { tenantId: req.tenantId };
    if (familyId && isValidId(familyId as string)) where.familyId = familyId as string;
    if (benefitType) where.benefitType = getStringParam(benefitType);
    if (status) where.status = getStringParam(status);
    if (urgency) where.urgency = getStringParam(urgency);

    const [requests, total] = await Promise.all([
      prisma.benefitRequest.findMany({
        where,
        include: {
          family: {
            select: {
              id: true,
              familyCode: true,
              responsibleName: true,
              memberCount: true,
              citizen: {
                select: {
                  name: true,
                  cpf: true,
                },
              },
              vulnerabilityType: true,
            },
          },
        },
        orderBy: [{ createdAt: 'desc' }],
        skip: offset,
        take: limitNum,
      }),
      prisma.benefitRequest.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limitNum);

    res.json(
      createPaginatedResponse(requests, {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages,
        hasNext: pageNum < totalPages,
        hasPrev: pageNum > 1,
      })
    );
  })
);

// POST /api/specialized/social-assistance/benefit-requests
router.post(
  '/benefit-requests',
  requirePermission('social-assistance:write'),
  handleAsyncRoute(async (req, res) => {
    const validatedData = validateSchemaAndRespond(benefitRequestSchema, req.body, res);
    if (!validatedData) return;

    // Verificar se a família existe
    const family = await prisma.vulnerableFamily.findFirst({
      where: {
        id: validatedData.familyId,
        tenantId: req.tenantId,
      },
    });

    if (!family) {
      res.status(404).json(createErrorResponse('NOT_FOUND', 'Família não encontrada'));
      return;
    }

    const request = await prisma.benefitRequest.create({
      data: {
        tenantId: req.tenantId,
        familyId: validatedData.familyId,
        benefitType: validatedData.benefitType,
        urgency: validatedData.urgency,
        reason: validatedData.reason,
        documentsProvided: validatedData.documentsProvided as any,
        observations: validatedData.observations,
      },
      include: {
        family: {
          select: {
            id: true,
            familyCode: true,
            responsibleName: true,
            vulnerabilityType: true,
            citizen: {
              select: {
                name: true,
                cpf: true,
              },
            },
          },
        },
      },
    });

    res
      .status(201)
      .json(createSuccessResponse(request, 'Solicitação de benefício registrada com sucesso'));
  })
);

// PUT /api/specialized/social-assistance/benefit-requests/:id/status
router.put(
  '/benefit-requests/:id/status',
  requirePermission('social-assistance:write'),
  handleAsyncRoute(async (req, res) => {
    const { id } = req.params;
    const { status, observations } = req.body;

    if (!isValidId(id)) {
      res.status(400).json(createErrorResponse('INVALID_ID', 'ID inválido'));
      return;
    }

    const validStatuses = ['PENDING', 'APPROVED', 'REJECTED', 'DELIVERED'];
    if (!validStatuses.includes(status)) {
      res.status(400).json(createErrorResponse('INVALID_STATUS', 'Status inválido'));
      return;
    }

    const request = await prisma.benefitRequest.findFirst({
      where: { id, tenantId: req.tenantId },
    });

    if (!request) {
      res.status(404).json(createErrorResponse('NOT_FOUND', 'Solicitação não encontrada'));
      return;
    }

    const updatedRequest = await prisma.benefitRequest.update({
      where: { id },
      data: {
        status,
        observations: observations || request.observations,
        updatedAt: new Date(),
      },
      include: {
        family: {
          select: {
            id: true,
            familyCode: true,
            responsibleName: true,
            citizen: {
              select: {
                name: true,
                cpf: true,
              },
            },
          },
        },
      },
    });

    res.json(createSuccessResponse(updatedRequest, 'Status da solicitação atualizado com sucesso'));
  })
);

// ====================== ENTREGAS EMERGENCIAIS ======================

// GET /api/specialized/social-assistance/emergency-deliveries
router.get(
  '/emergency-deliveries',
  requirePermission('social-assistance:read'),
  handleAsyncRoute(async (req, res) => {
    const { benefitRequestId, deliveryType, status, page = '1', limit = '20' } = req.query;

    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const offset = (pageNum - 1) * limitNum;

    const where: EmergencyDeliveryWhereInput = { tenantId: req.tenantId };
    if (deliveryType) where.deliveryType = getStringParam(deliveryType);
    if (status) where.status = getStringParam(status);

    const [deliveries, total] = await Promise.all([
      prisma.emergencyDelivery.findMany({
        where,
        orderBy: [{ createdAt: 'desc' }],
        skip: offset,
        take: limitNum,
      }),
      prisma.emergencyDelivery.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limitNum);

    res.json(
      createPaginatedResponse(deliveries, {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages,
        hasNext: pageNum < totalPages,
        hasPrev: pageNum > 1,
      })
    );
  })
);

// POST /api/specialized/social-assistance/emergency-deliveries
router.post(
  '/emergency-deliveries',
  requirePermission('social-assistance:write'),
  handleAsyncRoute(async (req, res) => {
    const validatedData = validateSchemaAndRespond(emergencyDeliverySchema, req.body, res);
    if (!validatedData) return;

    // Verificar se o cidadão existe (se fornecido)
    if (validatedData.citizenId) {
      const citizen = await prisma.citizen.findFirst({
        where: {
          id: validatedData.citizenId,
          tenantId: req.tenantId,
        },
      });

      if (!citizen) {
        res.status(404).json(createErrorResponse('NOT_FOUND', 'Cidadão não encontrado'));
        return;
      }
    }

    const delivery = await prisma.emergencyDelivery.create({
      data: {
        tenantId: req.tenantId,
        citizenId: validatedData.citizenId,
        deliveryType: validatedData.deliveryType,
        quantity: validatedData.quantity,
        deliveryDate: validatedData.deliveryDate,
        recipientName: validatedData.recipientName,
        deliveredBy: validatedData.deliveredBy,
        urgency: validatedData.urgency,
        status: validatedData.status,
        observations: validatedData.observations,
      },
    });

    res
      .status(201)
      .json(createSuccessResponse(delivery, 'Entrega emergencial registrada com sucesso'));
  })
);

// ====================== VISITAS DOMICILIARES ======================

// GET /api/specialized/social-assistance/home-visits
router.get(
  '/home-visits',
  requirePermission('social-assistance:read'),
  handleAsyncRoute(async (req, res) => {
    const { familyId, socialWorkerId, purpose, page = '1', limit = '20' } = req.query;

    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const offset = (pageNum - 1) * limitNum;

    const where: HomeVisitWhereInput = { tenantId: req.tenantId };
    if (familyId && isValidId(familyId as string)) where.familyId = familyId as string;
    if (socialWorkerId && isValidId(socialWorkerId as string))
      where.socialWorkerId = socialWorkerId as string;
    if (purpose) where.purpose = getStringParam(purpose);

    const [visits, total] = await Promise.all([
      prisma.homeVisit.findMany({
        where,
        include: {
          family: {
            select: {
              id: true,
              familyCode: true,
              responsibleName: true,
              citizen: {
                select: {
                  name: true,
                  cpf: true,
                },
              },
            },
          },
          socialWorkerUser: {
            select: { name: true },
          },
        },
        orderBy: { visitDate: 'desc' },
        skip: offset,
        take: limitNum,
      }),
      prisma.homeVisit.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limitNum);

    res.json(
      createPaginatedResponse(visits, {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages,
        hasNext: pageNum < totalPages,
        hasPrev: pageNum > 1,
      })
    );
  })
);

// POST /api/specialized/social-assistance/home-visits
router.post(
  '/home-visits',
  requirePermission('social-assistance:write'),
  handleAsyncRoute(async (req, res) => {
    const validatedData = validateSchemaAndRespond(homeVisitSchema, req.body, res);
    if (!validatedData) return;

    // Verificar se a família existe
    const family = await prisma.vulnerableFamily.findFirst({
      where: {
        id: validatedData.familyId,
        tenantId: req.tenantId,
      },
    });

    if (!family) {
      res.status(404).json(createErrorResponse('NOT_FOUND', 'Família não encontrada'));
      return;
    }

    // Verificar se o assistente social existe (se fornecido)
    if (validatedData.socialWorkerId) {
      const socialWorker = await prisma.user.findFirst({
        where: {
          id: validatedData.socialWorkerId,
          tenantId: req.tenantId,
        },
      });

      if (!socialWorker) {
        res.status(404).json(createErrorResponse('NOT_FOUND', 'Assistente social não encontrado'));
        return;
      }
    }

    const visit = await prisma.homeVisit.create({
      data: {
        tenantId: req.tenantId,
        familyId: validatedData.familyId,
        visitDate: validatedData.visitDate,
        socialWorkerId: validatedData.socialWorkerId,
        socialWorker: 'Assistente Social', // Campo obrigatório - nome genérico
        visitType: validatedData.visitType,
        visitPurpose: validatedData.purpose, // Campo obrigatório visitPurpose
        purpose: validatedData.purpose,
        findings: validatedData.findings,
        recommendations: validatedData.recommendations,
        nextVisitDate: validatedData.nextVisitDate,
        status: validatedData.status,
      },
      include: {
        family: {
          select: {
            id: true,
            familyCode: true,
            responsibleName: true,
            citizen: {
              select: {
                name: true,
                cpf: true,
              },
            },
          },
        },
        socialWorkerUser: {
          select: { name: true },
        },
      },
    });

    res.status(201).json(createSuccessResponse(visit, 'Visita domiciliar registrada com sucesso'));
  })
);

// ====================== PROGRAMAS SOCIAIS ======================

// GET /api/specialized/social-assistance/social-programs
router.get(
  '/social-programs',
  requirePermission('social-assistance:read'),
  handleAsyncRoute(async (req, res) => {
    const { isActive, targetGroup } = req.query;

    const where: SocialProgramWhereInput = { tenantId: req.tenantId };
    if (isActive !== undefined) where.isActive = isActive === 'true';
    if (targetGroup) where.targetGroup = { contains: getStringParam(targetGroup), mode: 'insensitive' };

    const programs = await prisma.socialProgram.findMany({
      where,
      orderBy: [{ isActive: 'desc' }, { startDate: 'desc' }],
    });

    res.json(createSuccessResponse(programs));
  })
);

// POST /api/specialized/social-assistance/social-programs
router.post(
  '/social-programs',
  requirePermission('social-assistance:write'),
  handleAsyncRoute(async (req, res) => {
    const validatedData = validateSchemaAndRespond(socialProgramSchema, req.body, res);
    if (!validatedData) return;

    // Verificar se as datas são válidas
    if (validatedData.endDate && validatedData.endDate <= validatedData.startDate) {
      res
        .status(400)
        .json(
          createErrorResponse('INVALID_DATE', 'Data de término deve ser posterior à data de início')
        );
      return;
    }

    const program = await prisma.socialProgram.create({
      data: {
        tenantId: req.tenantId,
        name: validatedData.name,
        programType: validatedData.programType,
        description: validatedData.description,
        objectives: validatedData.objectives as any,
        targetAudience: validatedData.targetGroup || 'Geral', // Campo obrigatório
        targetGroup: validatedData.targetGroup,
        requirements: validatedData.requirements as any,
        benefits: validatedData.benefits as any,
        benefitValue: validatedData.benefitValue,
        frequency: validatedData.frequency,
        startDate: validatedData.startDate,
        endDate: validatedData.endDate,
        budget: validatedData.budget,
        maxParticipants: validatedData.maxParticipants,
        coordinator: validatedData.coordinator,
        isActive: validatedData.isActive,
      },
    });

    res.status(201).json(createSuccessResponse(program, 'Programa social criado com sucesso'));
  })
);

// ====================== ATENDIMENTOS ASSISTÊNCIA SOCIAL ======================

// GET /api/specialized/social-assistance/attendances
router.get(
  '/attendances',
  requirePermission('social-assistance:read'),
  handleAsyncRoute(async (req, res) => {
    const { attendanceType, priority, citizenId, page = '1', limit = '20' } = req.query;

    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const offset = (pageNum - 1) * limitNum;

    const where: SocialAssistanceAttendanceWhereInput = { tenantId: req.tenantId };
    if (attendanceType) where.attendanceType = getStringParam(attendanceType);
    if (priority) where.priority = getStringParam(priority);
    if (citizenId && isValidId(citizenId as string)) where.citizenId = citizenId as string;

    const [attendances, total] = await Promise.all([
      prisma.socialAssistanceAttendance.findMany({
        where,
        include: {
          socialWorkerUser: {
            select: { name: true },
          },
        },
        orderBy: [{ createdAt: 'desc' }],
        skip: offset,
        take: limitNum,
      }),
      prisma.socialAssistanceAttendance.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limitNum);

    res.json(
      createPaginatedResponse(attendances, {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages,
        hasNext: pageNum < totalPages,
        hasPrev: pageNum > 1,
      })
    );
  })
);

// POST /api/specialized/social-assistance/attendances
router.post(
  '/attendances',
  requirePermission('social-assistance:write'),
  handleAsyncRoute(async (req, res) => {
    const validatedData = validateSchemaAndRespond(socialAssistanceAttendanceSchema, req.body, res);
    if (!validatedData) return;

    // Verificar se o cidadão existe
    const citizen = await prisma.citizen.findFirst({
      where: {
        id: validatedData.citizenId,
        tenantId: req.tenantId,
      },
    });

    if (!citizen) {
      res.status(404).json(createErrorResponse('NOT_FOUND', 'Cidadão não encontrado'));
      return;
    }

    const attendance = await prisma.socialAssistanceAttendance.create({
      data: {
        tenantId: req.tenantId,
        protocol: `SA-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, // Gerar protocolo único
        citizenId: validatedData.citizenId,
        citizenName: citizen.name,
        citizenCpf: citizen.cpf,
        contact: { phone: citizen.phone || '', email: citizen.email }, // Campos obrigatórios
        serviceType: validatedData.attendanceType || 'orientacao', // Campo obrigatório
        attendanceType: validatedData.attendanceType,
        subject: validatedData.subject,
        description: validatedData.description,
        urgency: validatedData.urgency,
        vulnerability: validatedData.vulnerability,
        socialWorkerId: validatedData.socialWorkerId,
        referredBy: validatedData.referredBy,
        familyIncome: validatedData.familyIncome,
        familySize: validatedData.familySize,
        followUpNeeded: validatedData.followUpNeeded,
        followUpDate: validatedData.followUpDate,
        priority: validatedData.priority,
        resolution: validatedData.resolution,
      },
      include: {
      },
    });

    res.status(201).json(createSuccessResponse(attendance, 'Atendimento registrado com sucesso'));
  })
);

// ====================== ESTATÍSTICAS E RELATÓRIOS ======================

// GET /api/specialized/social-assistance/stats
router.get(
  '/stats',
  requirePermission('social-assistance:read'),
  handleAsyncRoute(async (req, res) => {
    const tenantId = req.tenantId;
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
      totalFamilies,
      activeFamilies,
      familiesByVulnerability,
      totalBenefitRequests,
      monthlyBenefitRequests,
      pendingBenefitRequests,
      approvedBenefitRequests,
      emergencyDeliveries,
      homeVisitsThisMonth,
      socialPrograms,
      activePrograms,
      highPriorityAttendances,
      requestsByType,
      deliveriesByType,
    ] = await Promise.all([
      // Total de famílias cadastradas
      prisma.vulnerableFamily.count({
        where: { tenantId },
      }),
      // Famílias ativas
      prisma.vulnerableFamily.count({
        where: { tenantId },
      }),
      // Distribuição por nível de vulnerabilidade
      (prisma.vulnerableFamily.groupBy as any)({
        by: ['vulnerabilityLevel'],
        where: { tenantId },
        _count: { vulnerabilityLevel: true },
      }),
      // Total de solicitações de benefícios
      prisma.benefitRequest.count({
        where: { tenantId },
      }),
      // Solicitações este mês
      prisma.benefitRequest.count({
        where: {
          tenantId,
          createdAt: { gte: startOfMonth },
        },
      }),
      // Solicitações pendentes
      prisma.benefitRequest.count({
        where: {
          tenantId,
          status: { in: ['pendente', 'em_analise'] },
        },
      }),
      // Solicitações aprovadas este mês
      prisma.benefitRequest.count({
        where: {
          tenantId,
          status: 'aprovado',
          updatedAt: { gte: startOfMonth },
        },
      }),
      // Entregas emergenciais este mês
      prisma.emergencyDelivery.count({
        where: {
          tenantId,
          createdAt: { gte: startOfMonth },
        },
      }),
      // Visitas domiciliares este mês
      prisma.homeVisit.count({
        where: {
          tenantId,
          visitDate: { gte: startOfMonth },
        },
      }),
      // Total de programas sociais
      prisma.socialProgram.count({
        where: { tenantId },
      }),
      // Programas ativos
      prisma.socialProgram.count({
        where: {
          tenantId,
        },
      }),
      // Atendimentos de alta prioridade não resolvidos
      prisma.socialAssistanceAttendance.count({
        where: {
          tenantId,
          followUpNeeded: true,
        },
      }),
      // Distribuição por tipo de benefício
      prisma.benefitRequest.groupBy({
        by: ['benefitType'],
        where: {
          tenantId,
          createdAt: { gte: startOfMonth },
        },
        _count: { benefitType: true },
      }),
      // Distribuição por tipo de entrega emergencial
      prisma.emergencyDelivery.groupBy({
        by: ['deliveryType'],
        where: {
          tenantId,
          createdAt: { gte: startOfMonth },
        },
        _count: { deliveryType: true },
      }),
    ]);

    const stats = {
      overview: {
        totalFamilies,
        activeFamilies,
        totalBenefitRequests,
        monthlyBenefitRequests,
        socialPrograms,
        activePrograms,
      },
      pending: {
        pendingBenefitRequests,
        highPriorityAttendances,
      },
      monthly: {
        approvedBenefitRequests,
        emergencyDeliveries,
        homeVisitsThisMonth,
      },
      vulnerability: familiesByVulnerability.reduce(
        (acc: Record<string, number>, item: VulnerabilityGroupResult) => {
          acc[item.vulnerabilityLevel] = item._count.vulnerabilityLevel;
          return acc;
        },
        {} as Record<string, number>
      ),
      distribution: {
        requestsByType: requestsByType.reduce(
          (acc: Record<string, number>, item: BenefitTypeGroupResult) => {
            acc[item.benefitType] = item._count.benefitType;
            return acc;
          },
          {} as Record<string, number>
        ),
        deliveriesByType: deliveriesByType.reduce(
          (acc: Record<string, number>, item: DeliveryTypeGroupResult) => {
            acc[item.deliveryType] = item._count.deliveryType;
            return acc;
          },
          {} as Record<string, number>
        ),
      },
    };

    res.json(createSuccessResponse(stats));
  })
);

export default router;
