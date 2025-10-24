import { Router, Request, Response, NextFunction, RequestHandler } from 'express';
import { prisma } from '../../lib/prisma';
import { Prisma } from '@prisma/client';
import { z } from 'zod';

import {
  adminAuthMiddleware,
  requirePermission,
  addDataFilter,
} from '../../middleware/admin-auth';
import { tenantMiddleware } from '../../middleware/tenant';

// ====================== TIPOS E INTERFACES ISOLADAS ======================

interface User {
  id: string;
  email: string;
  name?: string;
  role: string;
  isActive: boolean;
  tenantId: string;
}

interface Tenant {
  id: string;
  name: string;
  subdomain: string;
  status: string;
}

interface AuthenticatedRequest {
  user?: User & { tenantId: string };
  tenant?: Tenant;
  tenantId?: string;
  params: any;
  query: any;
  body: any;
  method?: string;
  url?: string;
  headers?: any;
}

interface SuccessResponse<T = any> {
  success: true;
  data: T;
  message?: string;
}

interface ErrorResponse {
  success: false;
  error: string;
  message: string;
}

interface PaginatedResponse<T> {
  data: T[];
  pagination: { page: number; limit: number; total: number; totalPages: number; };
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

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

function handleAsyncRoute(fn: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<any>) {
  return (req: any, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
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

// Interface para where clauses de serviços públicos - removida da utilização direta

const router = Router();

// Middleware global
router.use(tenantMiddleware);
router.use(adminAuthMiddleware);

// ====================== SCHEMAS DE VALIDAÇÃO ======================

const publicServiceRequestSchema = z.object({
  citizenId: z.string().min(1, 'Cidadão é obrigatório'),
  serviceType: z.enum(['limpeza', 'iluminacao', 'pavimentacao', 'coleta', 'manutencao', 'outro']),
  description: z.string().min(10, 'Descrição deve ter pelo menos 10 caracteres'),
  location: z.string().min(5, 'Local é obrigatório'),
  coordinates: z
    .object({
      lat: z.number(),
      lng: z.number(),
    })
    .optional(),
  priority: z.enum(['baixa', 'normal', 'alta', 'urgente']).default('normal'),
  photos: z.array(z.string()).optional(),
  expectedDate: z
    .string()
    .transform(str => new Date(str))
    .optional(),
  estimatedCost: z.number().min(0).optional(),
  assignedTeam: z.string().optional(),
  status: z
    .enum(['aberto', 'analise', 'aprovado', 'execucao', 'concluido', 'cancelado'])
    .default('aberto'),
});

const cleaningScheduleSchema = z.object({
  area: z.string().min(2, 'Área é obrigatória'),
  address: z.string().min(5, 'Endereço é obrigatório'),
  type: z.enum(['varricao', 'coleta_lixo', 'capina', 'limpeza_bueiros', 'coleta_especial']),
  frequency: z.enum(['diaria', 'semanal', 'quinzenal', 'mensal', 'esporadica']),
  scheduledDate: z.string().transform(str => new Date(str)),
  team: z.string().min(2, 'Equipe é obrigatória'),
  vehicle: z.string().optional(),
  equipment: z.array(z.string()).optional(),
  estimatedDuration: z.number().min(0.5).max(24), // horas
  observations: z.string().optional(),
  status: z
    .enum(['programado', 'iniciado', 'concluido', 'cancelado', 'reagendado'])
    .default('programado'),
});

// Schema removido pois não é utilizado

const streetLightingSchema = z.object({
  location: z.string().min(5, 'Local é obrigatório'),
  address: z.string().min(5, 'Endereço é obrigatório'),
  coordinates: z.object({
    lat: z.number(),
    lng: z.number(),
  }),
  lightType: z.enum(['led', 'vapor_sodio', 'vapor_mercurio', 'fluorescente']),
  power: z.number().min(10).max(1000), // watts
  height: z.number().min(2).max(20), // metros
  status: z.enum(['funcionando', 'defeito', 'manutencao', 'desligado']),
  installationDate: z
    .string()
    .transform(str => new Date(str))
    .optional(),
  lastMaintenance: z
    .string()
    .transform(str => new Date(str))
    .optional(),
  maintenanceHistory: z
    .array(
      z.object({
        date: z.string().transform(str => new Date(str)),
        type: z.string(),
        description: z.string(),
        cost: z.number().optional(),
      })
    )
    .optional(),
  energyConsumption: z.number().min(0).optional(),
  reportedIssues: z
    .array(
      z.object({
        date: z.string().transform(str => new Date(str)),
        reporter: z.string(),
        issue: z.string(),
        resolved: z.boolean(),
      })
    )
    .optional(),
});

const specialCollectionSchema = z.object({
  citizenId: z.string().min(1, 'Cidadão é obrigatório'),
  collectionType: z.enum([
    'eletronicos',
    'moveis',
    'entulho',
    'podas',
    'oleo_cozinha',
    'pilhas_baterias',
  ]),
  description: z.string().min(5, 'Descrição é obrigatória'),
  quantity: z.number().min(1, 'Quantidade deve ser maior que 0'),
  unit: z.string().min(1, 'Unidade é obrigatória'),
  address: z.string().min(5, 'Endereço é obrigatório'),
  coordinates: z
    .object({
      lat: z.number(),
      lng: z.number(),
    })
    .optional(),
  scheduledDate: z.string().transform(str => new Date(str)),
  timeSlot: z.enum(['manha', 'tarde', 'integral']).default('manha'),
  specialInstructions: z.string().optional(),
  requiresEquipment: z.array(z.string()).optional(),
  estimatedVolume: z.number().min(0).optional(),
  status: z.enum(['agendado', 'confirmado', 'coletado', 'cancelado']).default('agendado'),
});

const teamScheduleSchema = z.object({
  teamName: z.string().min(2, 'Nome da equipe é obrigatório'),
  teamLeader: z.string().min(2, 'Líder da equipe é obrigatório'),
  members: z.array(
    z.object({
      name: z.string(),
      role: z.string(),
      phone: z.string().optional(),
    })
  ),
  serviceArea: z.string().min(2, 'Área de serviço é obrigatória'),
  shiftStart: z.string().transform(str => new Date(str)),
  shiftEnd: z.string().transform(str => new Date(str)),
  vehicle: z.string().optional(),
  equipment: z.array(z.string()).optional(),
  tasks: z.array(
    z.object({
      description: z.string(),
      location: z.string(),
      priority: z.enum(['baixa', 'normal', 'alta']),
      estimatedTime: z.number(), // minutos
      status: z.enum(['pendente', 'iniciado', 'concluido']).default('pendente'),
    })
  ),
  status: z.enum(['ativa', 'folga', 'manutencao', 'inativa']).default('ativa'),
});

const publicProblemReportSchema = z.object({
  citizenId: z.string().min(1, 'Cidadão é obrigatório'),
  problemType: z.enum([
    'buraco_via',
    'semaforo_defeito',
    'lixo_acumulado',
    'esgoto_entupido',
    'calada_quebrada',
    'outro',
  ]),
  title: z.string().min(5, 'Título é obrigatório'),
  description: z.string().min(10, 'Descrição é obrigatória'),
  location: z.string().min(5, 'Local é obrigatório'),
  coordinates: z.object({
    lat: z.number(),
    lng: z.number(),
  }),
  photos: z.array(z.string()).min(1, 'Pelo menos uma foto é obrigatória'),
  severity: z.enum(['baixa', 'media', 'alta', 'critica']).default('media'),
  affectedPeople: z.number().int().min(0).optional(),
  riskLevel: z.enum(['sem_risco', 'baixo', 'medio', 'alto']).default('sem_risco'),
  urgency: z.enum(['baixa', 'normal', 'alta', 'emergencia']).default('normal'),
  additionalInfo: z
    .object({
      accessTime: z.string().optional(),
      contactPreference: z.enum(['phone', 'email', 'sms']).optional(),
      allowFollowUp: z.boolean().default(true),
    })
    .optional(),
  status: z.enum(['novo', 'validado', 'em_andamento', 'resolvido', 'rejeitado']).default('novo'),
});

// ====================== SOLICITAÇÕES DE SERVIÇOS PÚBLICOS ======================

// GET /api/specialized/public-services/service-requests
router.get('/service-requests', requirePermission('public_services:read'), handleAsyncRoute(async (req, res) => {
  const serviceType = getStringParam(req.query.serviceType);
  const status = getStringParam(req.query.status);
  const priority = getStringParam(req.query.priority);
  const assignedTeam = getStringParam(req.query.assignedTeam);
  const page = getStringParam(req.query.page) || '1';
  const limit = getStringParam(req.query.limit) || '20';

  const pageNum = parseInt(page, 10);
  const limitNum = parseInt(limit, 10);
  const skip = (pageNum - 1) * limitNum;

  const where: any = { tenantId: req.tenant?.id || req.tenantId };

  if (serviceType) where.serviceType = serviceType;
  if (status) where.status = status;
  if (priority) where.priority = priority;
  if (assignedTeam) where.assignedTeam = { contains: assignedTeam, mode: 'insensitive' };

  const [requests, total] = await Promise.all([
    prisma.publicServiceRequest.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limitNum,
    }),
    prisma.publicServiceRequest.count({ where }),
  ]);

  res.json(createPaginatedResponse(requests, pageNum, limitNum, total));
}));

// POST /api/specialized/public-services/service-requests
router.post('/service-requests', requirePermission('public_services:write'), handleAsyncRoute(async (req, res) => {
  const validatedData = validateSchemaAndRespond(publicServiceRequestSchema, req.body, res);
  if (!validatedData) return;

  const request = await prisma.publicServiceRequest.create({
    data: {
      serviceType: validatedData.serviceType,
      description: validatedData.description,
      coordinates: validatedData.coordinates ? (JSON.stringify(validatedData.coordinates) as any) : undefined,
      priority: validatedData.priority || 'normal',
      photos: validatedData.photos,
      expectedDate: validatedData.expectedDate,
      estimatedCost: validatedData.estimatedCost,
      assignedTeam: validatedData.assignedTeam,
      status: validatedData.status || 'PENDING',
      tenantId: req.tenant?.id || req.tenantId!,
    } as unknown as Prisma.PublicServiceRequestUncheckedCreateInput,
    include: {
      tenant: true,
    },
  });

  res.status(201).json(createSuccessResponse(request, 'Solicitação criada com sucesso'));
}));

// ====================== PROGRAMAÇÃO DE LIMPEZA PÚBLICA ======================

// GET /api/specialized/public-services/cleaning-schedule
router.get('/cleaning-schedule', requirePermission('public_services:read'), handleAsyncRoute(async (req, res) => {
  const area = getStringParam(req.query.area);
  const type = getStringParam(req.query.type);
  const frequency = getStringParam(req.query.frequency);
  const status = getStringParam(req.query.status);
  const team = getStringParam(req.query.team);
  const date = getStringParam(req.query.date);

  const where: any = { tenantId: req.tenant?.id || req.tenantId };
  if (area) where.area = { contains: area, mode: 'insensitive' };
  if (type) where.type = type;
  if (frequency) where.frequency = frequency;
  if (status) where.status = status;
  if (team) where.team = { contains: team, mode: 'insensitive' };

  if (date) {
    const targetDate = new Date(date);
    where.scheduledDate = {
      gte: new Date(targetDate.setHours(0, 0, 0, 0)),
      lte: new Date(targetDate.setHours(23, 59, 59, 999)),
    };
  }

  const schedules = await prisma.cleaningSchedule.findMany({
    where,
    orderBy: { createdAt: 'desc' },
  });

  res.json(createSuccessResponse(schedules, 'Programação de limpeza encontrada'));
}));

// POST /api/specialized/public-services/cleaning-schedule
router.post('/cleaning-schedule', requirePermission('public_services:write'), handleAsyncRoute(async (req, res) => {
  const validatedData = validateSchemaAndRespond(cleaningScheduleSchema, req.body, res);
  if (!validatedData) return;

  const schedule = await prisma.cleaningSchedule.create({
    data: {
      area: validatedData.area,
      frequency: validatedData.frequency,
      team: validatedData.team,
      vehicle: validatedData.vehicle,
      equipment: validatedData.equipment,
      estimatedDuration: validatedData.estimatedDuration,
      observations: validatedData.observations,
      tenantId: req.tenant?.id || req.tenantId!,
    } as unknown as Prisma.CleaningScheduleUncheckedCreateInput,
  });

  res.status(201).json(createSuccessResponse(schedule, 'Limpeza programada com sucesso'));
}));

// ====================== ILUMINAÇÃO PÚBLICA ======================

// GET /api/specialized/public-services/street-lighting
router.get('/street-lighting', requirePermission('public_services:read'), handleAsyncRoute(async (req, res) => {
  const status = getStringParam(req.query.status);
  const lightType = getStringParam(req.query.lightType);
  const location = getStringParam(req.query.location);
  const needsMaintenance = getStringParam(req.query.needsMaintenance);

  const where: any = { tenantId: req.tenant?.id || req.tenantId };
  if (status) where.status = status;
  if (lightType) where.lightType = lightType;
  if (location) where.location = { contains: location, mode: 'insensitive' };

  const lights = await prisma.streetLighting.findMany({
    where,
    orderBy: { createdAt: 'desc' },
  });

  // Filtrar luminárias que precisam de manutenção
  if (needsMaintenance === 'true') {
    const now = new Date();
    const sixMonthsAgo = new Date(now.getTime() - 6 * 30 * 24 * 60 * 60 * 1000);

    const filtered = lights.filter(
      (light: any) =>
        light.status === 'defeito' ||
        !light.lastMaintenance ||
        new Date(light.lastMaintenance) < sixMonthsAgo
    );

    return res.json(createSuccessResponse(filtered, 'Luminárias que precisam de manutenção'));
  }

  return res.json(createSuccessResponse(lights, 'Iluminação pública encontrada'));
}));

// POST /api/specialized/public-services/street-lighting
router.post('/street-lighting', requirePermission('public_services:write'), handleAsyncRoute(async (req, res) => {
  const validatedData = validateSchemaAndRespond(streetLightingSchema, req.body, res);
  if (!validatedData) return;

  const lighting = await prisma.streetLighting.create({
    data: {
      power: validatedData.power,
      height: validatedData.height,
      status: validatedData.status,
      // Campos de data removidos pois não existem no modelo
      coordinates: JSON.stringify(validatedData.coordinates) as Prisma.InputJsonValue,
      tenantId: req.tenant?.id || req.tenantId!,
    } as unknown as Prisma.StreetLightingUncheckedCreateInput,
  });

  res.status(201).json(createSuccessResponse(lighting, 'Iluminação cadastrada com sucesso'));
}));

// ====================== COLETA ESPECIAL ======================

// GET /api/specialized/public-services/special-collection
router.get('/special-collection', requirePermission('public_services:read'), handleAsyncRoute(async (req, res) => {
  const collectionType = getStringParam(req.query.collectionType);
  const status = getStringParam(req.query.status);
  const scheduledDate = getStringParam(req.query.scheduledDate);
  const page = getStringParam(req.query.page) || '1';
  const limit = getStringParam(req.query.limit) || '20';

  const pageNum = parseInt(page, 10);
  const limitNum = parseInt(limit, 10);
  const skip = (pageNum - 1) * limitNum;

  const where: any = { tenantId: req.tenant?.id || req.tenantId };

  if (collectionType) where.collectionType = collectionType;
  if (status) where.status = status;

  if (scheduledDate) {
    const targetDate = new Date(scheduledDate);
    where.scheduledDate = {
      gte: new Date(targetDate.setHours(0, 0, 0, 0)),
      lte: new Date(targetDate.setHours(23, 59, 59, 999)),
    };
  }

  const [collections, total] = await Promise.all([
    prisma.specialCollection.findMany({
      where,
      include: {
        tenant: true,
      },
      orderBy: { scheduledDate: 'asc' },
      skip,
      take: limitNum,
    }),
    prisma.specialCollection.count({ where }),
  ]);

  res.json(createPaginatedResponse(collections, pageNum, limitNum, total));
}));

// POST /api/specialized/public-services/special-collection
router.post('/special-collection', requirePermission('public_services:write'), handleAsyncRoute(async (req, res) => {
  const validatedData = validateSchemaAndRespond(specialCollectionSchema, req.body, res);
  if (!validatedData) return;

  const collection = await prisma.specialCollection.create({
    data: {
      collectionType: validatedData.collectionType,
      description: validatedData.description,
      quantity: validatedData.quantity,
      unit: validatedData.unit,
      coordinates: validatedData.coordinates ? (JSON.stringify(validatedData.coordinates) as any) : undefined,
      scheduledDate: validatedData.scheduledDate,
      timeSlot: validatedData.timeSlot,
      estimatedVolume: validatedData.estimatedVolume,
      status: validatedData.status || 'REQUESTED',
      tenantId: req.tenant?.id || req.tenantId!,
    } as unknown as Prisma.SpecialCollectionUncheckedCreateInput,
    include: {
      citizen: { select: { id: true, name: true, phone: true } },
    },
  });

  res.status(201).json(createSuccessResponse(collection, 'Coleta especial agendada com sucesso'));
}));

// ====================== RELATÓRIOS DE PROBLEMAS COM FOTO ======================

// GET /api/specialized/public-services/problem-reports
router.get('/problem-reports', requirePermission('public_services:read'), handleAsyncRoute(async (req, res) => {
  const problemType = getStringParam(req.query.problemType);
  const status = getStringParam(req.query.status);
  const severity = getStringParam(req.query.severity);
  const urgency = getStringParam(req.query.urgency);
  const page = getStringParam(req.query.page) || '1';
  const limit = getStringParam(req.query.limit) || '20';

  const pageNum = parseInt(page, 10);
  const limitNum = parseInt(limit, 10);
  const skip = (pageNum - 1) * limitNum;

  const where: any = { tenantId: req.tenant?.id || req.tenantId };

  if (problemType) where.problemType = problemType;
  if (status) where.status = status;
  if (severity) where.severity = severity;
  if (urgency) where.urgency = urgency;

  const [reports, total] = await Promise.all([
    prisma.publicProblemReport.findMany({
      where,
      include: {
        tenant: true,
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limitNum,
    }),
    prisma.publicProblemReport.count({ where }),
  ]);

  res.json(createPaginatedResponse(reports, pageNum, limitNum, total));
}));

// POST /api/specialized/public-services/problem-reports
router.post('/problem-reports', requirePermission('public_services:write'), handleAsyncRoute(async (req, res) => {
  const validatedData = validateSchemaAndRespond(publicProblemReportSchema, req.body, res);
  if (!validatedData) return;

  const report = await prisma.publicProblemReport.create({
    data: {
      problemType: validatedData.problemType,
      title: validatedData.title,
      description: validatedData.description,
      coordinates: JSON.stringify(validatedData.coordinates) as any,
      photos: validatedData.photos,
      severity: validatedData.severity,
      affectedPeople: validatedData.affectedPeople,
      riskLevel: validatedData.riskLevel,
      status: validatedData.status || 'REPORTED',
      tenantId: req.tenant?.id || req.tenantId!,
    } as unknown as Prisma.PublicProblemReportUncheckedCreateInput,
    include: {
      citizen: { select: { id: true, name: true, phone: true } },
    },
  });

  res.status(201).json(createSuccessResponse(report, 'Problema registrado com sucesso'));
}));

// ====================== PROGRAMAÇÃO DE EQUIPES ======================

// GET /api/specialized/public-services/team-schedule
router.get('/team-schedule', requirePermission('public_services:read'), handleAsyncRoute(async (req, res) => {
  const teamName = getStringParam(req.query.teamName);
  const serviceArea = getStringParam(req.query.serviceArea);
  const status = getStringParam(req.query.status);
  const date = getStringParam(req.query.date);

  const where: any = { tenantId: req.tenant?.id || req.tenantId };
  if (teamName) where.teamName = { contains: teamName, mode: 'insensitive' };
  if (serviceArea) where.serviceArea = { contains: serviceArea, mode: 'insensitive' };
  if (status) where.status = status;

  if (date) {
    const targetDate = new Date(date);
    where.shiftStart = {
      gte: new Date(targetDate.setHours(0, 0, 0, 0)),
      lte: new Date(targetDate.setHours(23, 59, 59, 999)),
    };
  }

  const schedules = await prisma.teamSchedule.findMany({
    where,
    orderBy: { createdAt: 'desc' },
  });

  res.json(createSuccessResponse(schedules, 'Programação de equipes encontrada'));
}));

// POST /api/specialized/public-services/team-schedule
router.post('/team-schedule', requirePermission('public_services:write'), handleAsyncRoute(async (req, res) => {
  const validatedData = validateSchemaAndRespond(teamScheduleSchema, req.body, res);
  if (!validatedData) return;

  const schedule = await prisma.teamSchedule.create({
    data: {
      teamName: validatedData.teamName,
      teamLead: validatedData.teamLeader,
      members: JSON.stringify(validatedData.members) as any,
      shiftStart: String(validatedData.shiftStart),
      shiftEnd: String(validatedData.shiftEnd),
      vehicles: validatedData.vehicle ? JSON.stringify([validatedData.vehicle]) : undefined,
      equipment: validatedData.equipment,
      tenantId: req.tenant?.id || req.tenantId!,
    } as unknown as Prisma.TeamScheduleUncheckedCreateInput,
  });

  res.status(201).json(createSuccessResponse(schedule, 'Equipe programada com sucesso'));
}));

// ====================== DASHBOARD E MÉTRICAS ======================

// GET /api/specialized/public-services/dashboard
router.get('/dashboard', requirePermission('public_services:read'), handleAsyncRoute(async (req, res) => {
  const today = new Date();
  const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0, 0);
  const endOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999);
  const tenantId = req.tenant?.id || req.tenantId!;

  const [
    openRequests,
    scheduledToday,
    completedToday,
    lightsNeedingMaintenance,
    specialCollectionsToday,
    activeTeams,
    problemReportsToday,
    requestsByType,
  ] = await Promise.all([
    // Solicitações em aberto
    prisma.publicServiceRequest.count({
      where: {
        tenantId,
        status: { in: ['aberto', 'analise', 'aprovado', 'execucao'] },
      },
    }),

    // Limpezas programadas para hoje
    prisma.cleaningSchedule.count({
      where: {
        tenantId,
        createdAt: { gte: startOfToday, lte: endOfToday },
      },
    }),

    // Serviços concluídos hoje
    prisma.publicServiceRequest.count({
      where: {
        tenantId,
        updatedAt: { gte: startOfToday, lte: endOfToday },
      },
    }),

    // Luminárias precisando manutenção
    prisma.streetLighting.count({
      where: {
        tenantId,
      },
    }),

    // Coletas especiais hoje
    prisma.specialCollection.count({
      where: {
        tenantId,
        createdAt: { gte: startOfToday, lte: endOfToday },
      },
    }),

    // Equipes ativas
    prisma.teamSchedule.count({
      where: {
        tenantId,
      },
    }),

    // Relatórios de problemas hoje
    prisma.publicProblemReport.count({
      where: {
        tenantId,
        createdAt: { gte: startOfToday, lte: endOfToday },
      },
    }),

    // Solicitações por tipo
    prisma.publicServiceRequest.groupBy({
      by: ['serviceType'],
      where: { tenantId },
      _count: true,
    }),
  ]);

  const serviceTypeStats = requestsByType.reduce(
    (acc: Record<string, number>, item: any) => {
      acc[item.serviceType as string] = item._count as number;
      return acc;
    },
    {} as Record<string, number>
  );

  const dashboardData = {
    openRequests,
    scheduledToday,
    completedToday,
    lightsNeedingMaintenance,
    specialCollectionsToday,
    activeTeams,
    problemReportsToday,
    serviceTypeStats,
  };

  res.json(createSuccessResponse(dashboardData, 'Dados do dashboard de serviços públicos'));
}));

export default router;
