import { Router, Response, NextFunction } from 'express';
import { z } from 'zod';
import { Prisma } from '@prisma/client';
import { prisma } from '../lib/prisma';
import { citizenAuthMiddleware, familyAuthMiddleware } from '../middleware/citizen-auth';
import { tenantMiddleware } from '../middleware/tenant';

// ====================== TIPOS E INTERFACES ISOLADAS ======================

interface Citizen {
  id: string;
  name: string;
  cpf: string;
  email?: string;
  phone?: string;
  isActive: boolean;
  tenantId: string;
}

interface Tenant {
  id: string;
  name: string;
  cnpj?: string;
  status: string;
  limits?: TenantLimits;
  createdAt: Date;
  updatedAt: Date;
}

interface TenantLimits {
  protocols?: number;
  citizens?: number;
  departments?: number;
  users?: number;
}

interface AuthenticatedRequest {
  citizen?: Citizen;
  tenant?: Tenant;
  params: Record<string, string>;
  query: Record<string, string | string[]>;
  body: Record<string, unknown>;
}

interface SuccessResponse<T> {
  success: true;
  data: T;
  message?: string;
}

interface ErrorResponse {
  success: false;
  error: string;
  message: string;
  details?: unknown;
}

interface ValidationError {
  field: string;
  message: string;
  value?: unknown;
}

// Interfaces específicas para where clauses de protocolos compatíveis com Prisma
interface ProtocolWhere {
  tenantId: string;
  citizenId?: string | { in: string[] } | undefined;
  status?: string | undefined;
  id?: string | undefined;
}

interface FamilyCompositionWhere {
  tenantId: string;
  headId?: string | undefined;
  memberId?: string | undefined;
}

interface ServiceWhere {
  id: string;
  tenantId: string;
  isActive: boolean;
}

interface ProtocolEvaluationWhere {
  protocolId: string;
}


const router = Router();

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

function createSuccessResponse<T>(data: T, message?: string): SuccessResponse<T> {
  return {
    success: true,
    data,
    ...(message && { message })
  };
}

function createErrorResponse(error: string, message: string, details?: unknown): ErrorResponse {
  return {
    success: false,
    error,
    message,
    details
  };
}

function createValidationErrorResponse(errors: ValidationError[]): ErrorResponse {
  return {
    success: false,
    error: 'VALIDATION_ERROR',
    message: 'Dados inválidos',
    details: errors
  };
}

function isValidId(id: string): boolean {
  return !!(id && id.length > 0 && id.trim() !== '');
}

function isAuthenticatedRequest(req: AuthenticatedRequest): req is AuthenticatedRequest & {
  citizen: Citizen;
  tenant: Tenant;
} {
  return !!(req.citizen && req.tenant);
}

function isTenantLimits(limits: unknown): limits is TenantLimits {
  return !!(limits && typeof limits === 'object');
}

function getDefaultLimits(): TenantLimits {
  return {
    protocols: 1000,
    citizens: 10000,
    departments: 50,
    users: 100
  };
}

function generateProtocolNumber(tenantId: string): string {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  const prefix = tenantId.substring(0, 3).toUpperCase();
  return `${prefix}${timestamp}-${random}`;
}

function handleAsyncRoute(fn: (req: any, res: Response) => Promise<void>) {
  return (req: any, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res)).catch(next);
  };
}

function isZodError(error: unknown): error is z.ZodError {
  return error instanceof z.ZodError;
}

// ====================== MIDDLEWARE FUNCTIONS ======================

// Schemas de validação
const createProtocolSchema = z.object({
  serviceId: z.string().min(1, 'Serviço é obrigatório'),
  title: z.string().min(5, 'Título deve ter pelo menos 5 caracteres'),
  description: z.string().optional(),
  documents: z
    .array(
      z.object({
        name: z.string(),
        type: z.string(),
        size: z.number(),
        url: z.string(),
      })
    )
    .optional(),
  citizenId: z.string().optional(), // Para protocolos familiares
});

const addCommentSchema = z.object({
  comment: z.string().min(1, 'Comentário é obrigatório'),
});

const evaluateProtocolSchema = z.object({
  rating: z.number().min(1).max(5),
  comment: z.string().optional(),
  wouldRecommend: z.boolean().default(true),
});

// Apply middleware
router.use(tenantMiddleware);
router.use(citizenAuthMiddleware);

// GET /api/protocols - Meus protocolos
router.get('/', handleAsyncRoute(async (req, res) => {
  if (!isAuthenticatedRequest(req)) {
    res.status(401).json(createErrorResponse('UNAUTHORIZED', 'Acesso não autorizado'));
    return;
  }

  try {
    const { tenant, citizen } = req;
    const statusParam = getStringParam(req.query.status);
    const page = getNumberParam(req.query.page) || 1;
    const limit = getNumberParam(req.query.limit) || 20;
    const includeFamily = getStringParam(req.query.include_family) === 'true';

    const skip = (page - 1) * limit;

    // Construir filtros
    const where: ProtocolWhere = {
      tenantId: tenant.id,
    };

    // Se incluir família, buscar protocolos dos familiares também
    if (includeFamily) {
      const familyWhere: FamilyCompositionWhere = {
        tenantId: tenant.id,
        headId: citizen.id,
      };

      const familyMembers = await prisma.familyComposition.findMany({
        where: familyWhere as Prisma.FamilyCompositionWhereInput,
        select: { memberId: true },
      });

      const familyIds = [citizen.id, ...familyMembers.map(m => m.memberId)];
      where.citizenId = { in: familyIds };
    } else {
      where.citizenId = citizen.id;
    }

    if (statusParam) {
      where.status = statusParam;
    }

    // Buscar protocolos com paginação
    const [protocols, total] = await Promise.all([
      prisma.protocol.findMany({
        where: where as Prisma.ProtocolWhereInput,
        include: {
          service: {
            select: {
              id: true,
              name: true,
              category: true,
              estimatedDays: true,
            },
          },
          department: {
            select: {
              id: true,
              name: true,
            },
          },
          citizen: {
            select: {
              id: true,
              name: true,
              cpf: true,
            },
          },
          history: {
            orderBy: { timestamp: 'desc' },
            take: 1,
          },
          _count: {
            select: {
              history: true,
              evaluations: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.protocol.count({ where: where as Prisma.ProtocolWhereInput }),
    ]);

    res.json(createSuccessResponse({
      protocols,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    }));
  } catch (error) {
    console.error('Erro ao buscar protocolos:', error);
    res.status(500).json(createErrorResponse('INTERNAL_ERROR', 'Erro interno do servidor'));
  }
}));

// POST /api/protocols - Criar novo protocolo
router.post('/', familyAuthMiddleware, handleAsyncRoute(async (req, res) => {
  if (!isAuthenticatedRequest(req)) {
    res.status(401).json(createErrorResponse('UNAUTHORIZED', 'Acesso não autorizado'));
    return;
  }

  try {
    const data = createProtocolSchema.parse(req.body);
    const { tenant, citizen } = req;

    // Definir o cidadão responsável pelo protocolo
    const protocolCitizenId = data.citizenId || citizen.id;

    // Verificar se o serviço existe e está ativo
    const serviceWhere: ServiceWhere = {
      id: data.serviceId,
      tenantId: tenant.id,
      isActive: true,
    };

    const service = await prisma.service.findFirst({
      where: serviceWhere as Prisma.ServiceWhereInput,
      include: {
        department: true,
      },
    });

    if (!service) {
      res.status(404).json(createErrorResponse('NOT_FOUND', 'Serviço não encontrado ou inativo'));
      return;
    }

    // Verificar limites do plano do tenant
    const protocolCount = await prisma.protocol.count({
      where: { tenantId: tenant.id } as Prisma.ProtocolWhereInput,
    });

    const limits = isTenantLimits(tenant.limits) ? tenant.limits : getDefaultLimits();
    if (limits.protocols && protocolCount >= limits.protocols) {
      res.status(403).json(createErrorResponse(
        'PLAN_LIMIT_EXCEEDED',
        'Limite de protocolos do plano atingido'
      ));
      return;
    }

    // Gerar número do protocolo
    const protocolNumber = generateProtocolNumber(tenant.id);

    // Criar protocolo
    const createData = {
      tenantId: tenant.id,
      citizenId: protocolCitizenId,
      serviceId: service.id,
      departmentId: service.departmentId,
      number: protocolNumber,
      title: data.title,
      description: data.description,
      documents: (data.documents || []) as Prisma.InputJsonValue,
      status: 'VINCULADO' as const,
    } as Prisma.ProtocolUncheckedCreateInput;

    const protocol = await prisma.protocol.create({
      data: createData,
      include: {
        service: {
          select: {
            id: true,
            name: true,
            category: true,
            estimatedDays: true,
          },
        },
        department: {
          select: {
            id: true,
            name: true,
          },
        },
        citizen: {
          select: {
            id: true,
            name: true,
            cpf: true,
          },
        },
      },
    });

    // Criar histórico inicial
    await prisma.protocolHistory.create({
      data: {
        protocolId: protocol.id,
        action: 'CRIADO',
        comment: `Protocolo criado pelo cidadão ${citizen.name}`,
        userId: null,
      } as Prisma.ProtocolHistoryUncheckedCreateInput,
    });

    // Criar notificação para o cidadão
    await prisma.notification.create({
      data: {
        tenantId: tenant.id,
        citizenId: protocolCitizenId,
        title: 'Protocolo Criado',
        message: `Seu protocolo ${protocolNumber} foi criado com sucesso`,
        type: 'SUCCESS',
        protocolId: protocol.id,
      } as Prisma.NotificationUncheckedCreateInput,
    });

    res.status(201).json(createSuccessResponse(
      { protocol },
      'Protocolo criado com sucesso'
    ));
  } catch (error: unknown) {
    console.error('Erro ao criar protocolo:', error);

    if (isZodError(error)) {
      const errors = error.issues.map(err => ({
        field: err.path.join('.'),
        message: err.message,
        value: err.input,
      }));
      res.status(400).json(createValidationErrorResponse(errors));
      return;
    }

    res.status(500).json(createErrorResponse('INTERNAL_ERROR', 'Erro interno do servidor'));
  }
}));

// GET /api/protocols/:id - Detalhes de um protocolo
router.get('/:id', familyAuthMiddleware, handleAsyncRoute(async (req, res) => {
  if (!isAuthenticatedRequest(req)) {
    res.status(401).json(createErrorResponse('UNAUTHORIZED', 'Acesso não autorizado'));
    return;
  }

  try {
    const { tenant, citizen } = req;
    const id = getStringParam(req.params.id);

    if (!isValidId(id)) {
      res.status(400).json(createErrorResponse('INVALID_ID', 'ID inválido'));
      return;
    }

    const protocolWhere: ProtocolWhere = {
      id,
      tenantId: tenant.id,
    };

    const protocol = await prisma.protocol.findFirst({
      where: protocolWhere as Prisma.ProtocolWhereInput,
      include: {
        service: {
          select: {
            id: true,
            name: true,
            description: true,
            category: true,
            estimatedDays: true,
            requiredDocuments: true,
          },
        },
        department: {
          select: {
            id: true,
            name: true,
            description: true,
          },
        },
        citizen: {
          select: {
            id: true,
            name: true,
            cpf: true,
            email: true,
            phone: true,
          },
        },
        assignedUser: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        history: {
          orderBy: { timestamp: 'desc' },
          include: {
            protocol: {
              select: {
                id: true,
                number: true,
              },
            },
          },
        },
        evaluations: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    });

    if (!protocol) {
      res.status(404).json(createErrorResponse('NOT_FOUND', 'Protocolo não encontrado'));
      return;
    }

    // Verificar se o cidadão tem acesso ao protocolo
    const hasDirectAccess = protocol.citizenId === citizen.id;

    let hasFamilyAccess = false;
    if (!hasDirectAccess) {
      const familyWhere: FamilyCompositionWhere = {
        tenantId: tenant.id,
        headId: citizen.id,
        memberId: protocol.citizenId,
      };

      const familyMember = await prisma.familyComposition.findFirst({
        where: familyWhere as Prisma.FamilyCompositionWhereInput,
      });

      hasFamilyAccess = !!familyMember;
    }

    if (!hasDirectAccess && !hasFamilyAccess) {
      res.status(403).json(createErrorResponse('ACCESS_DENIED', 'Acesso negado'));
      return;
    }

    res.json(createSuccessResponse({ protocol }));
  } catch (error) {
    console.error('Erro ao buscar protocolo:', error);
    res.status(500).json(createErrorResponse('INTERNAL_ERROR', 'Erro interno do servidor'));
  }
}));

// POST /api/protocols/:id/documents - Upload de documentos
router.post('/:id/documents', familyAuthMiddleware, handleAsyncRoute(async (req, res) => {
  if (!isAuthenticatedRequest(req)) {
    res.status(401).json(createErrorResponse('UNAUTHORIZED', 'Acesso não autorizado'));
    return;
  }

  try {
    const { tenant } = req;
    const id = getStringParam(req.params.id);

    if (!isValidId(id)) {
      res.status(400).json(createErrorResponse('INVALID_ID', 'ID inválido'));
      return;
    }

    // Buscar protocolo
    const protocolWhere: ProtocolWhere = {
      id,
      tenantId: tenant.id,
    };

    const protocol = await prisma.protocol.findFirst({
      where: protocolWhere as Prisma.ProtocolWhereInput,
    });

    if (!protocol) {
      res.status(404).json(createErrorResponse('NOT_FOUND', 'Protocolo não encontrado'));
      return;
    }

    // Esta funcionalidade será implementada com o sistema de upload
    res.json(createSuccessResponse({
      protocolId: id,
    }, 'Sistema de upload de documentos em desenvolvimento'));
  } catch (error) {
    console.error('Erro ao fazer upload de documentos:', error);
    res.status(500).json(createErrorResponse('INTERNAL_ERROR', 'Erro interno do servidor'));
  }
}));

// POST /api/protocols/:id/comments - Adicionar comentário/mensagem
router.post('/:id/comments', familyAuthMiddleware, handleAsyncRoute(async (req, res) => {
  if (!isAuthenticatedRequest(req)) {
    res.status(401).json(createErrorResponse('UNAUTHORIZED', 'Acesso não autorizado'));
    return;
  }

  try {
    const data = addCommentSchema.parse(req.body);
    const { tenant } = req;
    const id = getStringParam(req.params.id);

    if (!isValidId(id)) {
      res.status(400).json(createErrorResponse('INVALID_ID', 'ID inválido'));
      return;
    }

    // Buscar protocolo
    const protocolWhere: ProtocolWhere = {
      id,
      tenantId: tenant.id,
    };

    const protocol = await prisma.protocol.findFirst({
      where: protocolWhere as Prisma.ProtocolWhereInput,
    });

    if (!protocol) {
      res.status(404).json(createErrorResponse('NOT_FOUND', 'Protocolo não encontrado'));
      return;
    }

    // Criar histórico com comentário
    const history = await prisma.protocolHistory.create({
      data: {
        protocolId: protocol.id,
        action: 'COMENTARIO_CIDADAO',
        comment: data.comment,
        userId: null,
      } as Prisma.ProtocolHistoryUncheckedCreateInput,
    });

    // Buscar usuários do departamento para notificação futura
    await prisma.user.findMany({
      where: {
        tenantId: tenant.id,
        departmentId: protocol.departmentId,
        isActive: true,
      } as Prisma.UserWhereInput,
    });

    res.status(201).json(createSuccessResponse(
      { history },
      'Comentário adicionado com sucesso'
    ));
  } catch (error: unknown) {
    console.error('Erro ao adicionar comentário:', error);

    if (isZodError(error)) {
      const errors = error.issues.map(err => ({
        field: err.path.join('.'),
        message: err.message,
        value: err.input,
      }));
      res.status(400).json(createValidationErrorResponse(errors));
      return;
    }

    res.status(500).json(createErrorResponse('INTERNAL_ERROR', 'Erro interno do servidor'));
  }
}));

// POST /api/protocols/:id/evaluate - Avaliar protocolo concluído
router.post('/:id/evaluate', familyAuthMiddleware, handleAsyncRoute(async (req, res) => {
  if (!isAuthenticatedRequest(req)) {
    res.status(401).json(createErrorResponse('UNAUTHORIZED', 'Acesso não autorizado'));
    return;
  }

  try {
    const data = evaluateProtocolSchema.parse(req.body);
    const { tenant } = req;
    const id = getStringParam(req.params.id);

    if (!isValidId(id)) {
      res.status(400).json(createErrorResponse('INVALID_ID', 'ID inválido'));
      return;
    }

    // Buscar protocolo
    const protocolWhere: ProtocolWhere = {
      id,
      tenantId: tenant.id,
      status: 'CONCLUIDO',
    };

    const protocol = await prisma.protocol.findFirst({
      where: protocolWhere as Prisma.ProtocolWhereInput,
    });

    if (!protocol) {
      res.status(404).json(createErrorResponse(
        'NOT_FOUND',
        'Protocolo não encontrado ou não concluído'
      ));
      return;
    }

    // Verificar se já foi avaliado
    const evaluationWhere: ProtocolEvaluationWhere = {
      protocolId: protocol.id,
    };

    const existingEvaluation = await prisma.protocolEvaluation.findFirst({
      where: evaluationWhere as Prisma.ProtocolEvaluationWhereInput,
    });

    if (existingEvaluation) {
      res.status(400).json(createErrorResponse(
        'ALREADY_EVALUATED',
        'Protocolo já foi avaliado'
      ));
      return;
    }

    // Criar avaliação
    const evaluation = await prisma.protocolEvaluation.create({
      data: {
        protocolId: protocol.id,
        rating: data.rating,
        comment: data.comment,
        wouldRecommend: data.wouldRecommend,
      } as Prisma.ProtocolEvaluationUncheckedCreateInput,
    });

    res.status(201).json(createSuccessResponse(
      { evaluation },
      'Avaliação registrada com sucesso'
    ));
  } catch (error: unknown) {
    console.error('Erro ao avaliar protocolo:', error);

    if (isZodError(error)) {
      const errors = error.issues.map(err => ({
        field: err.path.join('.'),
        message: err.message,
        value: err.input,
      }));
      res.status(400).json(createValidationErrorResponse(errors));
      return;
    }

    res.status(500).json(createErrorResponse('INTERNAL_ERROR', 'Erro interno do servidor'));
  }
}));

// GET /api/protocols/stats - Estatísticas dos protocolos do cidadão
router.get('/stats', handleAsyncRoute(async (req, res) => {
  if (!isAuthenticatedRequest(req)) {
    res.status(401).json(createErrorResponse('UNAUTHORIZED', 'Acesso não autorizado'));
    return;
  }

  try {
    const { tenant, citizen } = req;

    const protocolWhere = {
      tenantId: tenant.id,
      citizenId: citizen.id,
    } as Prisma.ProtocolWhereInput;

    // Estatísticas básicas
    const stats = await prisma.protocol.groupBy({
      by: ['status'],
      where: protocolWhere,
      _count: {
        status: true,
      },
    });

    // Total de protocolos
    const total = await prisma.protocol.count({
      where: protocolWhere,
    });

    // Protocolos por serviço
    const byService = await prisma.protocol.groupBy({
      by: ['serviceId'],
      where: protocolWhere,
      _count: {
        serviceId: true,
      },
      orderBy: {
        _count: {
          serviceId: 'desc',
        },
      },
      take: 10,
    });

    // Buscar nomes dos serviços
    const serviceIds = byService
      .map(s => s.serviceId)
      .filter((id): id is string => id !== null);

    const services = await prisma.service.findMany({
      where: { id: { in: serviceIds } } as Prisma.ServiceWhereInput,
      select: { id: true, name: true },
    });

    const byServiceWithNames = byService.map(item => ({
      serviceId: item.serviceId,
      serviceName: services.find(s => s.id === item.serviceId)?.name || 'Desconhecido',
      count: item._count.serviceId,
    }));

    res.json(createSuccessResponse({
      total,
      byStatus: stats,
      byService: byServiceWithNames,
    }));
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    res.status(500).json(createErrorResponse('INTERNAL_ERROR', 'Erro interno do servidor'));
  }
}));

export default router;
