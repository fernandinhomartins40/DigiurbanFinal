import { Router, Response, NextFunction } from 'express';
import { z } from 'zod';
import { Prisma } from '@prisma/client';
import { prisma } from '../lib/prisma';
import {
  adminAuthMiddleware,
  requirePermission,
  addDataFilter,
} from '../middleware/admin-auth';
import { tenantMiddleware } from '../middleware/tenant';

// ====================== TIPOS E INTERFACES ISOLADAS ======================

interface User {
  id: string;
  email: string;
  name?: string;
  role: string;
  isActive: boolean;
  tenantId: string;
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

interface DataFilters {
  tenantId?: string | undefined;
  assignedUserId?: string | undefined;
  departmentId?: string | undefined;
  createdById?: string | undefined; // ✅ Correto: createdById
  id?: string | undefined;
}

interface AuthenticatedRequest {
  user?: User;
  tenant?: Tenant;
  tenantId?: string;
  dataFilters?: DataFilters;
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
  assignedUserId?: string | undefined;
  departmentId?: string | undefined;
  createdById?: string | undefined; // ✅ Correto: createdById
  status?: string | { in: string[] } | undefined;
  priority?: string | undefined;
  id?: string | undefined;
  createdAt?: {
    gte?: Date;
    lte?: Date;
  } | undefined;
  number?: {
    contains: string;
    mode?: Prisma.QueryMode;
  } | undefined;
  dueDate?: {
    lt?: Date;
  } | undefined;
  OR?: Array<{
    number?: { contains: string; mode?: Prisma.QueryMode } | undefined;
    title?: { contains: string; mode?: Prisma.QueryMode } | undefined;
    description?: { contains: string; mode?: Prisma.QueryMode } | undefined;
    citizen?: { name: { contains: string; mode?: Prisma.QueryMode } } | undefined;
    service?: { name: { contains: string; mode?: Prisma.QueryMode } } | undefined;
  }> | undefined;
}

interface CitizenWhere {
  id: string;
  tenantId: string;
  isActive: boolean;
}

interface ServiceWhere {
  id: string;
  tenantId: string;
  isActive: boolean;
}

interface UserWhere {
  id: string;
  tenantId: string;
  isActive: boolean;
  departmentId?: string | undefined;
}

const router = Router();

// ====================== HELPER FUNCTIONS ======================

// Mapeamento de priority string para int (banco usa Int 1-5)
function priorityToInt(priority?: string): number {
  const map: Record<string, number> = {
    'URGENT': 5,
    'HIGH': 4,
    'NORMAL': 3,
    'LOW': 2,
    'LOWEST': 1
  };
  return priority ? (map[priority] || 3) : 3;
}

// Mapeamento inverso de int para string (para resposta da API)
function intToPriority(priority: number): string {
  const map: Record<number, string> = {
    5: 'URGENT',
    4: 'HIGH',
    3: 'NORMAL',
    2: 'LOW',
    1: 'LOWEST'
  };
  return map[priority] || 'NORMAL';
}

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

function createNotFoundResponse(resource: string): ErrorResponse {
  return {
    success: false,
    error: 'NOT_FOUND',
    message: `${resource} não encontrado`
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
  user: User;
  tenant: Tenant;
} {
  return !!(req.user && req.tenant);
}

function handleAsyncRoute(fn: (req: any, res: Response) => Promise<void>) {
  return (req: any, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res)).catch(next);
  };
}

function isZodError(error: unknown): error is z.ZodError {
  return error instanceof z.ZodError;
}

function getStatusLabel(status: string): string {
  const statusLabels = {
    VINCULADO: 'Vinculado',
    PROGRESSO: 'Em Progresso',
    ATUALIZACAO: 'Atualização',
    CONCLUIDO: 'Concluído',
    PENDENCIA: 'Pendência',
  };

  return statusLabels[status as keyof typeof statusLabels] || status;
}

// ====================== MIDDLEWARE FUNCTIONS ======================

function auditLog(_action: string) {
  return (_req: any, _res: Response, next: NextFunction) => {
    next();
  };
}

// Schemas de validação
const updateStatusSchema = z.object({
  status: z.enum(['VINCULADO', 'PROGRESSO', 'ATUALIZACAO', 'CONCLUIDO', 'PENDENCIA']),
  comment: z.string().optional(),
  citizenNotification: z.boolean().default(true),
});

const assignProtocolSchema = z.object({
  assignedUserId: z.string().min(1, 'Usuário é obrigatório'),
  comment: z.string().optional(),
  priority: z.number().int().min(1).max(5).optional().or(z.enum(['LOWEST', 'LOW', 'NORMAL', 'HIGH', 'URGENT']).transform(priorityToInt).optional()),
});

const addCommentSchema = z.object({
  comment: z.string().min(1, 'Comentário é obrigatório'),
  isInternal: z.boolean().default(false), // true = interno, false = visível ao cidadão
  notifyCitizen: z.boolean().default(true),
});

const createProtocolSchema = z.object({
  citizenId: z.string().min(1, 'Cidadão é obrigatório').optional(),
  citizenCpf: z.string().optional(), // ✅ Aceitar CPF também
  serviceId: z.string().min(1, 'Serviço é obrigatório'),
  departmentId: z.string().optional(), // ✅ Aceitar departmentId (será sobrescrito pelo do serviço se fornecido)
  title: z.string().min(3, 'Título deve ter pelo menos 3 caracteres').optional(),
  description: z.string().optional(),
  priority: z.number().int().min(1).max(5).default(3).or(z.enum(['LOWEST', 'LOW', 'NORMAL', 'HIGH', 'URGENT']).transform(priorityToInt)),
  assignedUserId: z.string().optional(),
  dueDate: z.string().optional(),
}).refine(data => data.citizenId || data.citizenCpf, {
  message: 'Cidadão (ID ou CPF) é obrigatório'
});

// Apply middleware
router.use(tenantMiddleware);
router.use(adminAuthMiddleware);

// GET /api/admin/protocols/search-citizens - Buscar cidadãos para autocomplete
router.get(
  '/search-citizens',
  requirePermission('protocols:create'),
  handleAsyncRoute(async (req, res) => {
    console.log('[SEARCH-CITIZENS] Endpoint chamado', { query: req.query });

    const authReq = req as AuthenticatedRequest;

    if (!authReq.user) {
      console.log('[SEARCH-CITIZENS] Unauthorized - no user');
      res.status(401).json(createErrorResponse('UNAUTHORIZED', 'Acesso não autorizado'));
      return;
    }

    try {
      const { user } = authReq;
      const search = getStringParam(req.query.q) || '';
      const limit = getNumberParam(req.query.limit) || 10;

      console.log('[SEARCH-CITIZENS] Busca:', { search, limit, tenantId: user.tenantId });

      if (search.length < 2) {
        console.log('[SEARCH-CITIZENS] Busca muito curta');
        res.json(createSuccessResponse({ citizens: [] }, 'Digite pelo menos 2 caracteres'));
        return;
      }

      // Buscar cidadãos apenas por nome (simplificado)
      const citizens = await prisma.citizen.findMany({
        where: {
          tenantId: user.tenantId,
          isActive: true,
          name: {
            contains: search,
          },
        },
        select: {
          id: true,
          name: true,
          cpf: true,
          email: true,
          phone: true,
        },
        take: limit,
        orderBy: {
          name: 'asc',
        },
      });

      console.log('[SEARCH-CITIZENS] Resultados:', { count: citizens.length, citizens: citizens.map(c => c.name) });

      res.json(createSuccessResponse({ citizens }, 'Cidadãos encontrados'));
    } catch (error: unknown) {
      console.error('[SEARCH-CITIZENS] Erro ao buscar cidadãos:', error);
      res.status(500).json(createErrorResponse('INTERNAL_ERROR', 'Erro ao buscar cidadãos'));
    }
  })
);

// GET /api/admin/protocols - Listar protocolos com filtro por nível de acesso
router.get(
  '/',
  requirePermission('protocols:read'),
  addDataFilter,
  handleAsyncRoute(async (req, res) => {
    if (!isAuthenticatedRequest(req)) {
      res.status(401).json(createErrorResponse('UNAUTHORIZED', 'Acesso não autorizado'));
      return;
    }

    try {
      const { user, dataFilters } = req;
      const statusParam = getStringParam(req.query.status);
      const priorityParam = getStringParam(req.query.priority);
      const assignedUserIdParam = getStringParam(req.query.assignedUserId);
      const departmentIdParam = getStringParam(req.query.departmentId);
      const page = getNumberParam(req.query.page) || 1;
      const limit = getNumberParam(req.query.limit) || 20;
      const search = getStringParam(req.query.search);
      const dateFrom = getStringParam(req.query.dateFrom);
      const dateTo = getStringParam(req.query.dateTo);

      const skip = (page - 1) * limit;

      // Construir filtros baseados no nível de acesso
      const where: ProtocolWhere = {
        tenantId: user.tenantId,
        ...(dataFilters?.assignedUserId && { assignedUserId: dataFilters.assignedUserId }),
        ...(dataFilters?.departmentId && { departmentId: dataFilters.departmentId }),
        ...(dataFilters?.createdById && { createdById: dataFilters.createdById }),
      };

      // Suportar múltiplos status separados por vírgula (ex: status=VINCULADO,PROGRESSO)
      if (statusParam) {
        const statusList = statusParam.split(',').map(s => s.trim()).filter(s => s.length > 0);
        if (statusList.length === 1) {
          where.status = statusList[0];
        } else if (statusList.length > 1) {
          // Para múltiplos status, usar OR com IN
          where.status = { in: statusList } as any;
        }
      }

      if (priorityParam) {
        where.priority = priorityParam;
      }

      if (assignedUserIdParam) {
        where.assignedUserId = assignedUserIdParam;
      }

      if (departmentIdParam && user.role === 'ADMIN') {
        where.departmentId = departmentIdParam;
      }

      if (search) {
        where.OR = [
          { number: { contains: search, mode: Prisma.QueryMode.insensitive } },
          { title: { contains: search, mode: Prisma.QueryMode.insensitive } },
          { citizen: { name: { contains: search, mode: Prisma.QueryMode.insensitive } } },
          { service: { name: { contains: search, mode: Prisma.QueryMode.insensitive } } },
        ];
      }

      if (dateFrom || dateTo) {
        where.createdAt = {};
        if (dateFrom) where.createdAt.gte = new Date(dateFrom);
        if (dateTo) where.createdAt.lte = new Date(dateTo);
      }

      // Buscar protocolos com paginação
      const [protocols, total] = await Promise.all([
        prisma.protocol.findMany({
          where: where as Prisma.ProtocolWhereInput,
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
                code: true,
              },
            },
            assignedUser: {
              select: {
                id: true,
                name: true,
                email: true,
                role: true,
              },
            },
            history: {
              where: {
                action: 'ADMIN_REQUEST_UPDATE',
              },
              orderBy: { timestamp: 'desc' },
              take: 1,
              select: {
                id: true,
                action: true,
                comment: true,
                timestamp: true,
              },
            },
            _count: {
              select: {
                history: true,
                evaluations: true,
              },
            },
          },
          orderBy: [{ priority: 'desc' }, { createdAt: 'desc' }],
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
        filters: {
          userRole: user.role,
          departmentId: user.departmentId,
        },
      }));
    } catch (error) {
      console.error('Erro ao buscar protocolos admin:', error);
      res.status(500).json(createErrorResponse('INTERNAL_ERROR', 'Erro interno do servidor'));
    }
  })
);

// GET /api/admin/protocols/:id - Detalhes de um protocolo específico
router.get('/:id', requirePermission('protocols:read'), handleAsyncRoute(async (req, res) => {
  if (!isAuthenticatedRequest(req)) {
    res.status(401).json(createErrorResponse('UNAUTHORIZED', 'Acesso não autorizado'));
    return;
  }

  try {
    const { user } = req;
    const id = getStringParam(req.params.id);

    if (!isValidId(id)) {
      res.status(400).json(createErrorResponse('INVALID_ID', 'ID inválido'));
      return;
    }

    // Buscar protocolo com verificação de acesso
    const protocolWhere: ProtocolWhere = {
      id,
      tenantId: user.tenantId,
      ...(user.role === 'USER' && { assignedUserId: user.id }),
      ...(user.role !== 'ADMIN' && user.departmentId && { departmentId: user.departmentId }),
    };

    const protocol = await prisma.protocol.findFirst({
      where: protocolWhere as Prisma.ProtocolWhereInput,
      include: {
        citizen: {
          select: {
            id: true,
            name: true,
            cpf: true,
            email: true,
            phone: true,
            address: true,
          },
        },
        service: {
          select: {
            id: true,
            name: true,
            description: true,
            category: true,
            estimatedDays: true,
            requirements: true,
            requiredDocuments: true,
          },
        },
        department: {
          select: {
            id: true,
            name: true,
            code: true,
            description: true,
          },
        },
        assignedUser: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
        history: {
          orderBy: { timestamp: 'desc' },
          include: {
            protocol: {
              select: { id: true, number: true },
            },
          },
        },
        evaluations: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!protocol) {
      res.status(404).json(createNotFoundResponse('Protocolo'));
      return;
    }

    res.json(createSuccessResponse({ protocol }));
  } catch (error) {
    console.error('Erro ao buscar protocolo:', error);
    res.status(500).json(createErrorResponse('INTERNAL_ERROR', 'Erro interno do servidor'));
  }
}));

// PUT /api/admin/protocols/:id/status - Atualizar status do protocolo
router.put(
  '/:id/status',
  requirePermission('protocols:update'),
  auditLog('UPDATE_PROTOCOL_STATUS'),
  handleAsyncRoute(async (req, res) => {
    if (!isAuthenticatedRequest(req)) {
      res.status(401).json(createErrorResponse('UNAUTHORIZED', 'Acesso não autorizado'));
      return;
    }

    try {
      const data = updateStatusSchema.parse(req.body);
      const { user } = req;
      const id = getStringParam(req.params.id);

      if (!isValidId(id)) {
        res.status(400).json(createErrorResponse('INVALID_ID', 'ID inválido'));
        return;
      }

      // Verificar se o protocolo existe e o usuário tem acesso
      const protocolWhere: ProtocolWhere = {
        id,
        tenantId: user.tenantId,
        ...(user.role === 'USER' && { assignedUserId: user.id }),
        ...(user.role !== 'ADMIN' && user.departmentId && { departmentId: user.departmentId }),
      };

      const protocol = await prisma.protocol.findFirst({
        where: protocolWhere as Prisma.ProtocolWhereInput,
        include: {
          citizen: true,
          service: true,
        },
      });

      if (!protocol) {
        res.status(404).json(createErrorResponse('ACCESS_DENIED', 'Protocolo não encontrado ou sem acesso'));
        return;
      }

      // Atualizar protocolo
      const updateData = {
        status: data.status,
        ...(data.status === 'CONCLUIDO' && { concludedAt: new Date() }),
        updatedAt: new Date(),
      } as Prisma.ProtocolUncheckedUpdateInput;

      const updatedProtocol = await prisma.protocol.update({
        where: { id } as Prisma.ProtocolWhereUniqueInput,
        data: updateData,
      });

      // Criar histórico
      await prisma.protocolHistory.create({
        data: {
          protocolId: id,
          action: `STATUS_CHANGED_TO_${data.status}`,
          comment: data.comment || `Status alterado para ${data.status} por ${user.name}`,
          userId: user.id,
        } as Prisma.ProtocolHistoryUncheckedCreateInput,
      });

      // Criar notificação para o cidadão se solicitado
      if (data.citizenNotification) {
        await prisma.notification.create({
          data: {
            tenantId: user.tenantId,
            citizenId: protocol.citizenId,
            title: `Protocolo ${protocol.number} Atualizado`,
            message: `O status do seu protocolo foi alterado para: ${getStatusLabel(data.status)}`,
            type: data.status === 'CONCLUIDO' ? 'SUCCESS' : 'INFO',
            protocolId: id,
          } as Prisma.NotificationUncheckedCreateInput,
        });
      }

      res.json(createSuccessResponse(
        { protocol: updatedProtocol },
        'Status do protocolo atualizado com sucesso'
      ));
    } catch (error: unknown) {
      console.error('Erro ao atualizar status:', error);

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
  })
);

// PUT /api/admin/protocols/:id/assign - Atribuir protocolo a funcionário
router.put(
  '/:id/assign',
  requirePermission('protocols:assign'),
  auditLog('ASSIGN_PROTOCOL'),
  handleAsyncRoute(async (req, res) => {
    if (!isAuthenticatedRequest(req)) {
      res.status(401).json(createErrorResponse('UNAUTHORIZED', 'Acesso não autorizado'));
      return;
    }

    try {
      const data = assignProtocolSchema.parse(req.body);
      const { user } = req;
      const id = getStringParam(req.params.id);

      if (!isValidId(id)) {
        res.status(400).json(createErrorResponse('INVALID_ID', 'ID inválido'));
        return;
      }

      // Verificar se o protocolo existe
      const protocolWhere: ProtocolWhere = {
        id,
        tenantId: user.tenantId,
        ...(user.role !== 'ADMIN' && user.departmentId && { departmentId: user.departmentId }),
      };

      const protocol = await prisma.protocol.findFirst({
        where: protocolWhere as Prisma.ProtocolWhereInput,
      });

      if (!protocol) {
        res.status(404).json(createNotFoundResponse('Protocolo'));
        return;
      }

      // Verificar se o usuário para atribuição existe e pertence ao departamento correto
      const userWhere: UserWhere = {
        id: data.assignedUserId,
        tenantId: user.tenantId,
        isActive: true,
        ...(user.role !== 'ADMIN' && { departmentId: user.departmentId }),
      };

      const assignedUser = await prisma.user.findFirst({
        where: userWhere as Prisma.UserWhereInput,
      });

      if (!assignedUser) {
        res.status(404).json(createErrorResponse('ACCESS_DENIED', 'Funcionário não encontrado ou sem acesso'));
        return;
      }

      // Atualizar protocolo
      const updateData = {
        assignedUserId: data.assignedUserId,
        ...(data.priority && {
          priority: typeof data.priority === 'string'
            ? priorityToInt(data.priority)
            : data.priority
        }),
        updatedAt: new Date(),
      } as Prisma.ProtocolUncheckedUpdateInput;

      const updatedProtocol = await prisma.protocol.update({
        where: { id } as Prisma.ProtocolWhereUniqueInput,
        data: updateData,
        include: {
          assignedUser: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            },
          },
        },
      });

      // Criar histórico
      await prisma.protocolHistory.create({
        data: {
          protocolId: id,
          action: 'PROTOCOL_ASSIGNED',
          comment: data.comment || `Protocolo atribuído a ${assignedUser.name} por ${user.name}`,
          userId: user.id,
        } as Prisma.ProtocolHistoryUncheckedCreateInput,
      });

      res.json(createSuccessResponse(
        { protocol: updatedProtocol },
        'Protocolo atribuído com sucesso'
      ));
    } catch (error: unknown) {
      console.error('Erro ao atribuir protocolo:', error);

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
  })
);

// POST /api/admin/protocols/:id/comments - Adicionar comentário
router.post(
  '/:id/comments',
  requirePermission('protocols:comment'),
  auditLog('ADD_PROTOCOL_COMMENT'),
  handleAsyncRoute(async (req, res) => {
    if (!isAuthenticatedRequest(req)) {
      res.status(401).json(createErrorResponse('UNAUTHORIZED', 'Acesso não autorizado'));
      return;
    }

    try {
      const data = addCommentSchema.parse(req.body);
      const { user } = req;
      const id = getStringParam(req.params.id);

      if (!isValidId(id)) {
        res.status(400).json(createErrorResponse('INVALID_ID', 'ID inválido'));
        return;
      }

      // Verificar se o protocolo existe e usuário tem acesso
      const protocolWhere: ProtocolWhere = {
        id,
        tenantId: user.tenantId,
        ...(user.role === 'USER' && { assignedUserId: user.id }),
        ...(user.role !== 'ADMIN' && user.departmentId && { departmentId: user.departmentId }),
      };

      const protocol = await prisma.protocol.findFirst({
        where: protocolWhere as Prisma.ProtocolWhereInput,
        include: {
          citizen: true,
        },
      });

      if (!protocol) {
        res.status(404).json(createErrorResponse('ACCESS_DENIED', 'Protocolo não encontrado ou sem acesso'));
        return;
      }

      // Criar histórico/comentário
      const historyEntry = await prisma.protocolHistory.create({
        data: {
          protocolId: id,
          action: data.isInternal ? 'INTERNAL_COMMENT' : 'ADMIN_COMMENT',
          comment: data.comment,
          userId: user.id,
        } as Prisma.ProtocolHistoryUncheckedCreateInput,
      });

      // Criar notificação para o cidadão se não for comentário interno
      if (!data.isInternal && data.notifyCitizen) {
        await prisma.notification.create({
          data: {
            tenantId: user.tenantId,
            citizenId: protocol.citizenId,
            title: `Nova Mensagem - Protocolo ${protocol.number}`,
            message: `${user.name} adicionou uma mensagem ao seu protocolo`,
            type: 'INFO',
            protocolId: id,
          } as Prisma.NotificationUncheckedCreateInput,
        });
      }

      res.status(201).json(createSuccessResponse(
        { history: historyEntry },
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
  })
);

// POST /api/admin/protocols/:id/request-update - Cobrar agilidade (ADMIN apenas)
router.post(
  '/:id/request-update',
  requirePermission('protocols:update'),
  auditLog('REQUEST_PROTOCOL_UPDATE'),
  handleAsyncRoute(async (req, res) => {
    if (!isAuthenticatedRequest(req)) {
      res.status(401).json(createErrorResponse('UNAUTHORIZED', 'Acesso não autorizado'));
      return;
    }

    try {
      const { user } = req;
      const id = getStringParam(req.params.id);
      const { message } = req.body;

      if (!isValidId(id)) {
        res.status(400).json(createErrorResponse('INVALID_ID', 'ID inválido'));
        return;
      }

      // ADMIN apenas pode cobrar agilidade
      if (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN') {
        res.status(403).json(createErrorResponse('FORBIDDEN', 'Apenas o Prefeito pode solicitar atualizações'));
        return;
      }

      // Buscar protocolo com segurança multi-tenant
      const protocolWhere: ProtocolWhere = {
        id,
        tenantId: user.tenantId,
      };

      const protocol = await prisma.protocol.findFirst({
        where: protocolWhere as Prisma.ProtocolWhereInput,
        include: {
          assignedUser: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          department: {
            include: {
              users: {
                where: {
                  role: { in: ['MANAGER', 'COORDINATOR'] },
                  isActive: true,
                },
                select: {
                  id: true,
                  name: true,
                  email: true,
                  role: true,
                },
              },
            },
          },
        },
      });

      if (!protocol) {
        res.status(404).json(createNotFoundResponse('Protocolo'));
        return;
      }

      // Criar histórico da cobrança
      const defaultMessage = `O Prefeito ${user.name} solicitou agilidade na resolução deste protocolo.`;
      const historyComment = message || defaultMessage;

      await prisma.protocolHistory.create({
        data: {
          protocolId: id,
          action: 'ADMIN_REQUEST_UPDATE',
          comment: historyComment,
          userId: user.id,
        } as Prisma.ProtocolHistoryUncheckedCreateInput,
      });

      // Criar entradas de histórico para notificação dos responsáveis
      // (Como o modelo Notification é apenas para cidadãos, usamos o histórico para alertar funcionários)

      // Notificar funcionário atribuído via histórico
      if (protocol.assignedUserId) {
        await prisma.protocolHistory.create({
          data: {
            protocolId: id,
            action: 'NOTIFICATION_ASSIGNED_USER',
            comment: `⚠️ COBRANÇA DE AGILIDADE DO PREFEITO: ${historyComment}`,
            userId: protocol.assignedUserId,
          } as Prisma.ProtocolHistoryUncheckedCreateInput,
        });
      }

      // Notificar gestores do departamento via histórico
      if (protocol.department?.users) {
        for (const manager of protocol.department.users) {
          await prisma.protocolHistory.create({
            data: {
              protocolId: id,
              action: 'NOTIFICATION_DEPARTMENT_MANAGER',
              comment: `⚠️ COBRANÇA DE AGILIDADE DO PREFEITO para ${protocol.department.name}: ${historyComment}`,
              userId: manager.id,
            } as Prisma.ProtocolHistoryUncheckedCreateInput,
          });
        }
      }

      res.status(200).json(createSuccessResponse(
        {
          protocol: {
            id: protocol.id,
            number: protocol.number,
          },
          notifiedUsers: [
            ...(protocol.assignedUser ? [protocol.assignedUser.name] : []),
            ...(protocol.department?.users?.map(u => u.name) || []),
          ],
        },
        'Solicitação de agilidade enviada com sucesso'
      ));
    } catch (error: unknown) {
      console.error('Erro ao solicitar atualização:', error);
      res.status(500).json(createErrorResponse('INTERNAL_ERROR', 'Erro interno do servidor'));
    }
  })
);

// POST /api/admin/protocols - Criar novo protocolo (ADMIN apenas)
router.post(
  '/',
  requirePermission('protocols:create'),
  auditLog('CREATE_PROTOCOL'),
  handleAsyncRoute(async (req, res) => {
    if (!isAuthenticatedRequest(req)) {
      res.status(401).json(createErrorResponse('UNAUTHORIZED', 'Acesso não autorizado'));
      return;
    }

    try {
      const data = createProtocolSchema.parse(req.body);
      const { user } = req;

      // Buscar cidadão por ID ou CPF
      let citizen;
      if (data.citizenId) {
        const citizenWhere: CitizenWhere = {
          id: data.citizenId,
          tenantId: user.tenantId,
          isActive: true,
        };
        citizen = await prisma.citizen.findFirst({
          where: citizenWhere as Prisma.CitizenWhereInput,
        });
      } else if (data.citizenCpf) {
        // Buscar por CPF (remover formatação)
        const cpfClean = data.citizenCpf.replace(/\D/g, '');
        citizen = await prisma.citizen.findFirst({
          where: {
            cpf: cpfClean,
            tenantId: user.tenantId,
            isActive: true,
          } as Prisma.CitizenWhereInput,
        });
      }

      if (!citizen) {
        res.status(404).json(createNotFoundResponse('Cidadão'));
        return;
      }

      // Verificar se o serviço existe
      const serviceWhere: ServiceWhere = {
        id: data.serviceId,
        tenantId: user.tenantId,
        isActive: true,
      };

      const service = await prisma.service.findFirst({
        where: serviceWhere as Prisma.ServiceWhereInput,
        include: {
          department: true,
        },
      });

      if (!service) {
        res.status(404).json(createNotFoundResponse('Serviço'));
        return;
      }

      // Gerar número do protocolo
      const protocolNumber = `ADM${Date.now().toString().slice(-8)}${Math.floor(Math.random() * 100)
        .toString()
        .padStart(2, '0')}`;

      // Gerar título se não fornecido
      const title = data.title || `Solicitação de ${service.name} - ${citizen.name}`;

      // Converter priority se for string, ou usar valor numérico direto
      const priority = typeof data.priority === 'string'
        ? priorityToInt(data.priority)
        : (data.priority || 3);

      // Criar protocolo
      const createData = {
        tenantId: user.tenantId,
        citizenId: citizen.id, // ✅ Usar citizen.id encontrado
        serviceId: data.serviceId,
        departmentId: data.departmentId || service.departmentId, // ✅ Usar departmentId fornecido ou do serviço
        number: protocolNumber,
        title,
        description: data.description,
        priority, // ✅ Já convertido para int
        assignedUserId: data.assignedUserId,
        createdById: user.id, // ✅ Já está correto
        status: 'VINCULADO' as const,
        ...(data.dueDate && { dueDate: new Date(data.dueDate) }),
      } as Prisma.ProtocolUncheckedCreateInput;

      const protocol = await prisma.protocol.create({
        data: createData,
        include: {
          citizen: {
            select: {
              id: true,
              name: true,
              cpf: true,
            },
          },
          service: {
            select: {
              id: true,
              name: true,
              category: true,
            },
          },
          department: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      // Criar histórico inicial
      await prisma.protocolHistory.create({
        data: {
          protocolId: protocol.id,
          action: 'CREATED_BY_ADMIN',
          comment: `Protocolo criado pelo administrador ${user.name}`,
          userId: user.id,
        } as Prisma.ProtocolHistoryUncheckedCreateInput,
      });

      // Criar notificação para o cidadão
      await prisma.notification.create({
        data: {
          tenantId: user.tenantId,
          citizenId: data.citizenId,
          title: 'Protocolo Criado pela Administração',
          message: `Um novo protocolo ${protocolNumber} foi criado para você`,
          type: 'INFO',
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
  })
);

// GET /api/admin/protocols/stats - Estatísticas de protocolos
router.get(
  '/stats/summary',
  requirePermission('protocols:read'),
  addDataFilter,
  handleAsyncRoute(async (req, res) => {
    if (!isAuthenticatedRequest(req)) {
      res.status(401).json(createErrorResponse('UNAUTHORIZED', 'Acesso não autorizado'));
      return;
    }

    try {
      const { dataFilters } = req;

      // Garantir que dataFilters seja sempre um objeto válido ou undefined explicitamente
      const whereFilters = dataFilters ? (dataFilters as Prisma.ProtocolWhereInput) : undefined;

      // Estatísticas por status
      const byStatus = await prisma.protocol.groupBy({
        by: ['status'],
        ...(whereFilters && { where: whereFilters }),
        _count: { status: true },
      });

      // Estatísticas por prioridade
      const byPriority = await prisma.protocol.groupBy({
        by: ['priority'],
        ...(whereFilters && { where: whereFilters }),
        _count: { priority: true },
      });

      // Total de protocolos
      const total = whereFilters
        ? await prisma.protocol.count({ where: whereFilters })
        : await prisma.protocol.count();

      // Protocolos vencidos (passaram do prazo estimado)
      const overdueWhere = {
        ...(dataFilters || {}),
        status: { notIn: ['CONCLUIDO'] },
        dueDate: { lt: new Date() },
      } as Prisma.ProtocolWhereInput;

      const overdue = await prisma.protocol.count({
        where: overdueWhere,
      });

      res.json(createSuccessResponse({
        total,
        overdue,
        byStatus,
        byPriority,
      }));
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
      res.status(500).json(createErrorResponse('INTERNAL_ERROR', 'Erro interno do servidor'));
    }
  })
);


export default router;

