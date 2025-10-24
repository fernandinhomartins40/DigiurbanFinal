// ============================================================================
// SECURITY.TS - ISOLAMENTO PROFISSIONAL COMPLETO
// ============================================================================

import { Router, Response, NextFunction } from 'express';
import { z } from 'zod';
import { prisma } from '../../lib/prisma';
import { AuthenticatedRequest, SuccessResponse, ErrorResponse } from '../../types';
import { asyncHandler } from '../../utils/express-helpers';
import { tenantMiddleware } from '../../middleware/tenant';
import { adminAuthMiddleware, requirePermission as requirePermissionMiddleware } from '../../middleware/admin-auth';

// ====================== TIPOS E INTERFACES ISOLADAS ======================

interface PaginatedResponse<T> {
  data: T[];
  pagination: { page: number; limit: number; total: number; totalPages: number; };
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

const router = Router();

// Middleware global
router.use(tenantMiddleware);
router.use(adminAuthMiddleware);

// ====================== HELPER FUNCTIONS ======================

function getStringParam(param: any): string {
  if (Array.isArray(param)) return param[0] || '';
  if (typeof param === 'string') return param;
  if (param && typeof param === 'object' && param.toString) return param.toString();
  return '';
}

function createSuccessResponse<T>(data: T, message?: string): SuccessResponse<T> {
  const response: SuccessResponse<T> = { success: true, data };
  if (message) response.message = message;
  return response;
}

function createErrorResponse(error: string, message: string): ErrorResponse {
  return { success: false, error, message };
}

function createPaginatedResponse<T>(
  data: T[],
  page: number,
  limit: number,
  total: number
): PaginatedResponse<T> {
  return {
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    },
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit)
  };
}

function validateSchemaAndRespond<T>(schema: z.ZodSchema<T>, data: any, res: Response): T | null {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json(createErrorResponse('VALIDATION_ERROR', 'Dados inválidos'));
      return null;
    }
    throw error;
  }
}

// ====================== MIDDLEWARE LOCAIS ======================

const requirePermission = requirePermissionMiddleware;

function isValidId(id: any): boolean {
  return typeof id === 'string' && id.length > 0;
}

// ====================== SCHEMAS DE VALIDAÇÃO ======================

const securityOccurrenceSchema = z.object({
  type: z.enum([
    'furto',
    'roubo',
    'agressao',
    'vandalismo',
    'perturbacao',
    'drogas',
    'transito',
    'outro',
  ]),
  description: z.string().min(10, 'Descrição deve ter pelo menos 10 caracteres'),
  location: z.string().min(5, 'Local é obrigatório'),
  coordinates: z
    .object({
      lat: z.number(),
      lng: z.number(),
    })
    .optional(),
  reportedBy: z.string().min(2, 'Nome do relator é obrigatório'),
  reporterPhone: z.string().min(10, 'Telefone do relator é obrigatório'),
  reporterCpf: z.string().optional(),
  victimInfo: z
    .object({
      name: z.string().optional(),
      age: z.number().optional(),
      gender: z.string().optional(),
    })
    .optional(),
  dateTime: z.string().transform(str => new Date(str)),
  severity: z.enum(['baixa', 'media', 'alta', 'critica']).default('media'),
  evidence: z.array(z.string()).optional(),
  witnesses: z
    .array(
      z.object({
        name: z.string(),
        phone: z.string(),
        statement: z.string().optional(),
      })
    )
    .optional(),
  status: z.enum(['aberta', 'investigando', 'resolvida', 'arquivada']).default('aberta'),
});

const securityAlertSchema = z.object({
  title: z.string().min(5, 'Título é obrigatório'),
  message: z.string().min(10, 'Mensagem é obrigatória'),
  type: z.enum(['emergencia', 'preventivo', 'informativo', 'busca_apreensao']),
  priority: z.enum(['baixa', 'normal', 'alta', 'urgente']).default('normal'),
  targetArea: z.string().min(2, 'Área alvo é obrigatória'),
  coordinates: z
    .object({
      lat: z.number(),
      lng: z.number(),
      radius: z.number().optional(),
    })
    .optional(),
  validUntil: z
    .string()
    .transform(str => new Date(str))
    .optional(),
  isActive: z.boolean().default(true),
  createdBy: z.string().min(1, 'Criador é obrigatório'),
});

const securityPatrolSchema = z.object({
  guardName: z.string().min(2, 'Nome do guarda é obrigatório'),
  guardId: z.string().min(1, 'ID do guarda é obrigatório'),
  vehicle: z.string().optional(),
  route: z.string().min(2, 'Rota é obrigatória'),
  startTime: z.string().transform(str => new Date(str)),
  endTime: z
    .string()
    .transform(str => new Date(str))
    .optional(),
  status: z.enum(['ativo', 'finalizado', 'cancelado']).default('ativo'),
  checkpoints: z
    .array(
      z.object({
        location: z.string(),
        coordinates: z
          .object({
            lat: z.number(),
            lng: z.number(),
          })
          .optional(),
        checkTime: z
          .string()
          .transform(str => new Date(str))
          .optional(),
        observations: z.string().optional(),
      })
    )
    .optional(),
  observations: z.string().optional(),
});

const criticalPointSchema = z.object({
  name: z.string().min(2, 'Nome do ponto é obrigatório'),
  address: z.string().min(5, 'Endereço é obrigatório'),
  coordinates: z.object({
    lat: z.number(),
    lng: z.number(),
  }),
  riskLevel: z.enum(['baixo', 'medio', 'alto', 'critico']),
  riskType: z.array(z.enum(['criminalidade', 'drogas', 'violencia', 'transito', 'vandalismo'])),
  description: z.string().min(10, 'Descrição é obrigatória'),
  recommendedActions: z.array(z.string()),
  lastIncidentDate: z
    .string()
    .transform(str => new Date(str))
    .optional(),
  patrolFrequency: z.enum(['diaria', 'semanal', 'quinzenal', 'mensal']).default('semanal'),
  isActive: z.boolean().default(true),
});

const securityAttendanceSchema = z.object({
  citizenId: z.string().min(1, 'Cidadão é obrigatório'),
  attendanceType: z.enum(['bo', 'orientacao', 'denuncia', 'solicitacao_patrulha', 'outro']),
  description: z.string().min(10, 'Descrição é obrigatória'),
  location: z.string().optional(),
  urgency: z.enum(['baixa', 'normal', 'alta', 'emergencia']).default('normal'),
  referredTo: z.string().optional(),
  resolution: z.string().optional(),
  followUpNeeded: z.boolean().default(false),
  followUpDate: z
    .string()
    .transform(str => new Date(str))
    .optional(),
});

// ====================== OCORRÊNCIAS DE SEGURANÇA ======================

// GET /api/specialized/security/occurrences
router.get('/occurrences', requirePermission('security:read'), asyncHandler(async (req, res) => {
  const type = getStringParam(req.query.type);
  const status = getStringParam(req.query.status);
  const severity = getStringParam(req.query.severity);
  const location = getStringParam(req.query.location);
  const startDate = getStringParam(req.query.startDate);
  const endDate = getStringParam(req.query.endDate);
  const page = getStringParam(req.query.page) || '1';
  const limit = getStringParam(req.query.limit) || '20';

  const pageNum = parseInt(page, 10);
  const limitNum = parseInt(limit, 10);
  const offset = (pageNum - 1) * limitNum;

  const where: any = { tenantId: req.tenantId || req.tenant?.id };

  if (type) where.type = type;
  if (status) where.status = status;
  if (severity) where.severity = severity;
  if (location) where.description = { contains: location, mode: 'insensitive' };

  if (startDate && endDate) {
    where.dateTime = {
      gte: new Date(startDate),
      lte: new Date(endDate),
    };
  }

  const [occurrences, total] = await Promise.all([
    prisma.securityOccurrence.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: offset,
      take: limitNum,
    }),
    prisma.securityOccurrence.count({ where }),
  ]);

  res.json(createPaginatedResponse(occurrences, pageNum, limitNum, total));
}));

// POST /api/specialized/security/occurrences
router.post('/occurrences', requirePermission('security:write'), asyncHandler(async (req, res) => {
  const validatedData = validateSchemaAndRespond(securityOccurrenceSchema, req.body, res);
  if (!validatedData) return;

  const occurrence = await prisma.securityOccurrence.create({
    data: {
      type: validatedData.type,
      description: validatedData.description,
      reportedBy: validatedData.reportedBy,
      reporterPhone: validatedData.reporterPhone,
      reporterCpf: validatedData.reporterCpf,
      victimInfo: validatedData.victimInfo ? (JSON.stringify(validatedData.victimInfo) as any) : undefined,
      dateTime: validatedData.dateTime,
      severity: validatedData.severity,
      evidence: validatedData.evidence,
      witnesses: validatedData.witnesses ? (JSON.stringify(validatedData.witnesses) as any) : undefined,
      status: validatedData.status || 'aberta',
      coordinates: validatedData.coordinates ? (JSON.stringify(validatedData.coordinates) as any) : undefined,
      tenantId: req.tenantId || req.tenant?.id!,
    } as any,
  });

  res.status(201).json(createSuccessResponse(occurrence, 'Ocorrência registrada com sucesso'));
}));

// PUT /api/specialized/security/occurrences/:id/status
router.put('/occurrences/:id/status', requirePermission('security:write'), asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status, resolution } = req.body;

  if (!isValidId(id)) {
    res.status(400).json(createErrorResponse('INVALID_ID', 'ID inválido'));
    return;
  }

  const validStatuses = ['aberta', 'investigando', 'resolvida', 'arquivada'];
  if (!validStatuses.includes(status)) {
    res.status(400).json(createErrorResponse('INVALID_STATUS', 'Status inválido'));
    return;
  }

  const occurrence = await prisma.securityOccurrence.findFirst({
    where: { id, tenantId: req.tenantId || req.tenant?.id },
  });

  if (!occurrence) {
    res.status(404).json(createErrorResponse('NOT_FOUND', 'Ocorrência não encontrada'));
    return;
  }

  const updatedOccurrence = await prisma.securityOccurrence.update({
    where: { id },
    data: {
      status,
      updatedAt: new Date(),
    },
  });

  res.json(createSuccessResponse(updatedOccurrence, 'Status da ocorrência atualizado com sucesso'));
}));

// ====================== ALERTAS DE SEGURANÇA ======================

// GET /api/specialized/security/alerts
router.get('/alerts', requirePermission('security:read'), asyncHandler(async (req, res) => {
  const type = getStringParam(req.query.type);
  const priority = getStringParam(req.query.priority);
  const isActive = getStringParam(req.query.isActive);
  const page = getStringParam(req.query.page) || '1';
  const limit = getStringParam(req.query.limit) || '20';

  const pageNum = parseInt(page, 10);
  const limitNum = parseInt(limit, 10);
  const offset = (pageNum - 1) * limitNum;

  const where: any = { tenantId: req.tenantId || req.tenant?.id };
  if (type) where.type = type;
  if (priority) where.priority = priority;
  if (isActive) where.isActive = isActive === 'true';

  // Filtrar alertas válidos (não expirados)
  if (isActive === 'true') {
    where.OR = [{ validUntil: null }, { validUntil: { gte: new Date() } }];
  }

  const [alerts, total] = await Promise.all([
    prisma.securityAlert.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: offset,
      take: limitNum,
    }),
    prisma.securityAlert.count({ where }),
  ]);

  res.json(createPaginatedResponse(alerts, pageNum, limitNum, total));
}));

// POST /api/specialized/security/alerts
router.post('/alerts', requirePermission('security:write'), asyncHandler(async (req, res) => {
  const validatedData = validateSchemaAndRespond(securityAlertSchema, req.body, res);
  if (!validatedData) return;

  const alert = await prisma.securityAlert.create({
    data: {
      title: validatedData.title,
      message: validatedData.message,
      type: validatedData.type,
      priority: validatedData.priority,
      targetArea: validatedData.targetArea,
      coordinates: validatedData.coordinates ? (JSON.stringify(validatedData.coordinates) as any) : undefined,
      validUntil: validatedData.validUntil,
      isActive: validatedData.isActive,
      createdBy: validatedData.createdBy,
      tenantId: req.tenantId || req.tenant?.id!,
    } as any,
  });

  res.status(201).json(createSuccessResponse(alert, 'Alerta de segurança criado com sucesso'));
}));

// PUT /api/specialized/security/alerts/:id/deactivate
router.put('/alerts/:id/deactivate', requirePermission('security:write'), asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!isValidId(id)) {
    res.status(400).json(createErrorResponse('INVALID_ID', 'ID inválido'));
    return;
  }

  const alert = await prisma.securityAlert.findFirst({
    where: { id, tenantId: req.tenantId || req.tenant?.id },
  });

  if (!alert) {
    res.status(404).json(createErrorResponse('NOT_FOUND', 'Alerta não encontrado'));
    return;
  }

  const updatedAlert = await prisma.securityAlert.update({
    where: { id },
    data: { isActive: false },
  });

  res.json(createSuccessResponse(updatedAlert, 'Alerta desativado com sucesso'));
}));

// ====================== PATRULHAMENTO ======================

// GET /api/specialized/security/patrols
router.get('/patrols', requirePermission('security:read'), asyncHandler(async (req, res) => {
  const guardId = getStringParam(req.query.guardId);
  const status = getStringParam(req.query.status);
  const startDate = getStringParam(req.query.startDate);
  const endDate = getStringParam(req.query.endDate);
  const page = getStringParam(req.query.page) || '1';
  const limit = getStringParam(req.query.limit) || '20';

  const pageNum = parseInt(page, 10);
  const limitNum = parseInt(limit, 10);
  const offset = (pageNum - 1) * limitNum;

  const where: any = { tenantId: req.tenantId || req.tenant?.id };
  if (guardId) where.guardId = guardId;
  if (status) where.status = status;

  if (startDate && endDate) {
    where.startTime = {
      gte: new Date(startDate),
      lte: new Date(endDate),
    };
  }

  const [patrols, total] = await Promise.all([
    prisma.securityPatrol.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: offset,
      take: limitNum,
    }),
    prisma.securityPatrol.count({ where }),
  ]);

  res.json(createPaginatedResponse(patrols, pageNum, limitNum, total));
}));

// POST /api/specialized/security/patrols
router.post('/patrols', requirePermission('security:write'), asyncHandler(async (req, res) => {
  const validatedData = validateSchemaAndRespond(securityPatrolSchema, req.body, res);
  if (!validatedData) return;

  // Verificar se não há patrulha ativa para o mesmo guarda
  const activePatrol = await prisma.securityPatrol.findFirst({
    where: {
      tenantId: req.tenantId || req.tenant?.id,
      guardId: validatedData.guardId,
      status: 'ativo',
    },
  });

  if (activePatrol) {
    res.status(409).json(createErrorResponse('CONFLICT', 'Guarda já possui patrulha ativa'));
    return;
  }

  const patrol = await prisma.securityPatrol.create({
    data: {
      guardName: validatedData.guardName,
      guardId: validatedData.guardId,
      vehicle: validatedData.vehicle,
      route: validatedData.route,
      startTime: validatedData.startTime,
      endTime: validatedData.endTime,
      status: validatedData.status || 'ativo',
      checkpoints: validatedData.checkpoints ? (JSON.stringify(validatedData.checkpoints) as any) : undefined,
      observations: validatedData.observations,
      tenantId: req.tenantId || req.tenant?.id!,
    } as any,
  });

  res.status(201).json(createSuccessResponse(patrol, 'Patrulha iniciada com sucesso'));
}));

// PUT /api/specialized/security/patrols/:id/finish
router.put('/patrols/:id/finish', requirePermission('security:write'), asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { observations, endTime } = req.body;

  if (!isValidId(id)) {
    res.status(400).json(createErrorResponse('INVALID_ID', 'ID inválido'));
    return;
  }

  const patrol = await prisma.securityPatrol.findFirst({
    where: { id, tenantId: req.tenantId || req.tenant?.id },
  });

  if (!patrol) {
    res.status(404).json(createErrorResponse('NOT_FOUND', 'Patrulha não encontrada'));
    return;
  }

  if (patrol.status !== 'ativo') {
    res.status(400).json(createErrorResponse('INVALID_STATUS', 'Patrulha não está ativa'));
    return;
  }

  const updatedPatrol = await prisma.securityPatrol.update({
    where: { id },
    data: {
      status: 'finalizado',
      endTime: endTime ? new Date(endTime) : new Date(),
      observations: observations || patrol.observations,
    },
  });

  res.json(createSuccessResponse(updatedPatrol, 'Patrulha finalizada com sucesso'));
}));

// ====================== PONTOS CRÍTICOS ======================

// GET /api/specialized/security/critical-points
router.get('/critical-points', requirePermission('security:read'), asyncHandler(async (req, res) => {
  const riskLevel = getStringParam(req.query.riskLevel);
  const isActive = getStringParam(req.query.isActive);

  const where: any = { tenantId: req.tenantId || req.tenant?.id };
  if (riskLevel) where.riskLevel = riskLevel;
  if (isActive) where.isActive = isActive === 'true';

  const points = await prisma.criticalPoint.findMany({
    where,
    orderBy: { createdAt: 'desc' },
  });

  res.json(createSuccessResponse(points, 'Pontos críticos encontrados'));
}));

// POST /api/specialized/security/critical-points
router.post('/critical-points', requirePermission('security:write'), asyncHandler(async (req, res) => {
  const validatedData = validateSchemaAndRespond(criticalPointSchema, req.body, res);
  if (!validatedData) return;

  const point = await prisma.criticalPoint.create({
    data: {
      name: validatedData.name,
      address: validatedData.address,
      coordinates: JSON.stringify(validatedData.coordinates) as any,
      riskLevel: validatedData.riskLevel,
      riskType: validatedData.riskType,
      description: validatedData.description,
      recommendedActions: validatedData.recommendedActions,
      lastIncidentDate: validatedData.lastIncidentDate,
      patrolFrequency: validatedData.patrolFrequency,
      isActive: validatedData.isActive,
      tenantId: req.tenantId || req.tenant?.id!,
    } as any,
  });

  res.status(201).json(createSuccessResponse(point, 'Ponto crítico cadastrado com sucesso'));
}));

// PUT /api/specialized/security/critical-points/:id
router.put('/critical-points/:id', requirePermission('security:write'), asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!isValidId(id)) {
    res.status(400).json(createErrorResponse('INVALID_ID', 'ID inválido'));
    return;
  }

  const validatedData = validateSchemaAndRespond(criticalPointSchema, req.body, res);
  if (!validatedData) return;

  const existingPoint = await prisma.criticalPoint.findFirst({
    where: { id, tenantId: req.tenantId || req.tenant?.id },
  });

  if (!existingPoint) {
    res.status(404).json(createErrorResponse('NOT_FOUND', 'Ponto crítico não encontrado'));
    return;
  }

  const updatedPoint = await prisma.criticalPoint.update({
    where: { id },
    data: {
      name: validatedData.name,
      address: validatedData.address,
      coordinates: JSON.stringify(validatedData.coordinates) as any,
      riskLevel: validatedData.riskLevel,
      riskType: validatedData.riskType,
      description: validatedData.description,
      recommendedActions: validatedData.recommendedActions,
      lastIncidentDate: validatedData.lastIncidentDate,
      patrolFrequency: validatedData.patrolFrequency,
      isActive: validatedData.isActive,
    } as any,
  });

  res.json(createSuccessResponse(updatedPoint, 'Ponto crítico atualizado com sucesso'));
}));

// ====================== ATENDIMENTOS DE SEGURANÇA ======================

// GET /api/specialized/security/attendances
router.get('/attendances', requirePermission('security:read'), asyncHandler(async (req, res) => {
  const attendanceType = getStringParam(req.query.attendanceType);
  const urgency = getStringParam(req.query.urgency);
  const citizenId = getStringParam(req.query.citizenId);
  const page = getStringParam(req.query.page) || '1';
  const limit = getStringParam(req.query.limit) || '20';

  const pageNum = parseInt(page, 10);
  const limitNum = parseInt(limit, 10);
  const offset = (pageNum - 1) * limitNum;

  const where: any = { tenantId: req.tenantId || req.tenant?.id };
  if (attendanceType) where.attendanceType = attendanceType;
  if (urgency) where.urgency = urgency;
  if (citizenId && isValidId(citizenId)) where.citizenId = citizenId;

  const [attendances, total] = await Promise.all([
    prisma.securityAttendance.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: offset,
      take: limitNum,
    }),
    prisma.securityAttendance.count({ where }),
  ]);

  res.json(createPaginatedResponse(attendances, pageNum, limitNum, total));
}));

// POST /api/specialized/security/attendances
router.post('/attendances', requirePermission('security:write'), asyncHandler(async (req, res) => {
  const validatedData = validateSchemaAndRespond(securityAttendanceSchema, req.body, res);
  if (!validatedData) return;

  const attendance = await prisma.securityAttendance.create({
    data: {
      citizenId: validatedData.citizenId,
      attendanceType: validatedData.attendanceType,
      description: validatedData.description,
      location: validatedData.location,
      urgency: validatedData.urgency,
      referredTo: validatedData.referredTo,
      resolution: validatedData.resolution,
      followUpNeeded: validatedData.followUpNeeded,
      followUpDate: validatedData.followUpDate,
      tenantId: req.tenantId || req.tenant?.id!,
    } as any,
  });

  res.status(201).json(createSuccessResponse(attendance, 'Atendimento registrado com sucesso'));
}));

// ====================== ESTATÍSTICAS E RELATÓRIOS ======================

// GET /api/specialized/security/stats
router.get('/stats', requirePermission('security:read'), asyncHandler(async (req, res) => {
  const tenantId = req.tenantId || req.tenant?.id!;
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay());

  const [
    totalOccurrences,
    monthlyOccurrences,
    weeklyOccurrences,
    openOccurrences,
    resolvedOccurrences,
    activeAlerts,
    activePatrols,
    criticalPoints,
    highUrgencyAttendances,
    occurrencesByType,
    occurrencesBySeverity,
  ] = await Promise.all([
    // Total de ocorrências
    prisma.securityOccurrence.count({
      where: { tenantId },
    }),
    // Ocorrências do mês
    prisma.securityOccurrence.count({
      where: {
        tenantId,
        createdAt: { gte: startOfMonth },
      },
    }),
    // Ocorrências da semana
    prisma.securityOccurrence.count({
      where: {
        tenantId,
        createdAt: { gte: startOfWeek },
      },
    }),
    // Ocorrências abertas
    prisma.securityOccurrence.count({
      where: {
        tenantId,
        status: { in: ['aberta', 'investigando'] },
      },
    }),
    // Ocorrências resolvidas este mês
    prisma.securityOccurrence.count({
      where: {
        tenantId,
        status: 'resolvida',
        updatedAt: { gte: startOfMonth },
      },
    }),
    // Alertas ativos
    prisma.securityAlert.count({
      where: {
        tenantId,
        isActive: true,
      },
    }),
    // Patrulhas ativas
    prisma.securityPatrol.count({
      where: {
        tenantId,
        status: 'ativo',
      },
    }),
    // Pontos críticos ativos
    prisma.criticalPoint.count({
      where: {
        tenantId,
        isActive: true,
      },
    }),
    // Atendimentos de alta urgência
    prisma.securityAttendance.count({
      where: {
        tenantId,
        urgency: { in: ['alta', 'emergencia'] },
      },
    }),
    // Distribuição por tipo de ocorrência
    prisma.securityOccurrence.groupBy({
      by: ['type'],
      where: {
        tenantId,
        createdAt: { gte: startOfMonth },
      },
      _count: { type: true },
    }),
    // Distribuição por severidade
    prisma.securityOccurrence.groupBy({
      by: ['severity'],
      where: {
        tenantId,
        createdAt: { gte: startOfMonth },
      },
      _count: { severity: true },
    }),
  ]);

  const stats = {
    overview: {
      totalOccurrences,
      monthlyOccurrences,
      weeklyOccurrences,
      openOccurrences,
      resolvedOccurrences,
      resolutionRate:
        totalOccurrences > 0 ? Math.round((resolvedOccurrences / totalOccurrences) * 100) : 0,
    },
    realtime: {
      activeAlerts,
      activePatrols,
      criticalPoints,
      highUrgencyAttendances,
    },
    distribution: {
      byType: occurrencesByType.reduce(
        (acc: Record<string, number>, item: any) => {
          acc[item.type as string] = item._count.type as number;
          return acc;
        },
        {} as Record<string, number>
      ),
      bySeverity: occurrencesBySeverity.reduce(
        (acc: Record<string, number>, item: any) => {
          acc[item.severity as string] = item._count.severity as number;
          return acc;
        },
        {} as Record<string, number>
      ),
    },
  };

  res.json(createSuccessResponse(stats, 'Estatísticas de segurança'));
}));

export default router;
