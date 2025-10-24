// ============================================================================
// SECRETARIAS-ESPORTE.TS - ISOLAMENTO PROFISSIONAL COMPLETO
// ============================================================================

import { Router, Response, RequestHandler, Request, NextFunction } from 'express';
import { z, ZodError } from 'zod';
import { prisma } from '../lib/prisma';
import { Prisma } from '@prisma/client';
import { tenantMiddleware } from '../middleware/tenant';
import { authenticateToken, requireManager } from '../middleware/auth';

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

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

interface PaginatedResponse<T> {
  success: true;
  data: T[];
  pagination: PaginationInfo;
}

interface SportsAttendanceStats {
  statusStats: Array<{ status: string; _count: { _all: number } }>;
  typeStats: Array<{ type: string; _count: { _all: number } }>;
}

interface SportsClubStats {
  sportStats: Array<{ sport: string; _count: { _all: number } }>;
  totalClubs: number;
  activeClubs: number;
}

interface SportsAttendanceWhereInput {
  tenantId: string;
  status?: string;
  type?: string;
  sportType?: string;
  OR?: Array<{
    citizenName?: { contains: string; mode: 'insensitive' };
    protocol?: { contains: string; mode: 'insensitive' };
    description?: { contains: string; mode: 'insensitive' };
  }>;
}

interface SportsEventWhereInput {
  tenantId: string;
  type?: string;
  status?: string;
  OR?: Array<{
    name?: { contains: string; mode: 'insensitive' };
    responsible?: { contains: string; mode: 'insensitive' };
    location?: { contains: string; mode: 'insensitive' };
  }>;
}

interface SportsClubWhereInput {
  tenantId: string;
  sport?: string;
  status?: string;
  OR?: Array<{
    name?: { contains: string; mode: 'insensitive' };
    president?: { contains: string; mode: 'insensitive' };
  }>;
}


// ====================== HELPER FUNCTIONS ======================

function getStringParam(param: string | string[] | undefined): string {
  if (Array.isArray(param)) return param[0] || '';
  if (typeof param === 'string') return param;
  return '';
}

function getNumberParam(param: string | string[] | undefined): number {
  const stringValue = getStringParam(param);
  const parsed = parseInt(stringValue, 10);
  return isNaN(parsed) ? 0 : parsed;
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

function createPaginatedResponse<T>(data: T[], pagination: PaginationInfo): PaginatedResponse<T> {
  return {
    success: true,
    data,
    pagination,
  };
}

function handleAsyncRoute(
  fn: (req: AuthenticatedRequest, res: Response) => Promise<Response | void>
): RequestHandler {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req as unknown as AuthenticatedRequest, res)).catch(next);
  };
}

function isZodError(error: unknown): error is ZodError {
  return error instanceof ZodError;
}

function isError(error: unknown): error is Error {
  return error instanceof Error;
}

function createSportsAttendanceWhereClause(params: {
  tenantId: string;
  search?: string;
  status?: string;
  type?: string;
  sportType?: string;
}): any {
  const where: any = {
    tenantId: params.tenantId,
  };

  if (params.search) {
    where.OR = [
      { citizenName: { contains: params.search, mode: 'insensitive' } },
      { protocol: { contains: params.search, mode: 'insensitive' } },
      { description: { contains: params.search, mode: 'insensitive' } },
    ];
  }

  if (params.status) {
    where.status = params.status;
  }

  if (params.type) {
    where.type = params.type;
  }

  if (params.sportType) {
    where.sportType = params.sportType;
  }

  return where;
}

function createSportsEventWhereClause(params: {
  tenantId: string;
  search?: string;
  type?: string;
  status?: string;
}): SportsEventWhereInput {
  const where: SportsEventWhereInput = {
    tenantId: params.tenantId,
  };

  if (params.search) {
    where.OR = [
      { name: { contains: params.search, mode: 'insensitive' } },
      { responsible: { contains: params.search, mode: 'insensitive' } },
      { location: { contains: params.search, mode: 'insensitive' } },
    ];
  }

  if (params.type) {
    where.type = params.type;
  }

  if (params.status) {
    where.status = params.status;
  }

  return where;
}

function createSportsClubWhereClause(params: {
  tenantId: string;
  search?: string;
  sport?: string;
  status?: string;
}): SportsClubWhereInput {
  const where: SportsClubWhereInput = {
    tenantId: params.tenantId,
  };

  if (params.search) {
    where.OR = [
      { name: { contains: params.search, mode: 'insensitive' } },
      { president: { contains: params.search, mode: 'insensitive' } },
    ];
  }

  if (params.sport) {
    where.sport = params.sport;
  }

  if (params.status) {
    where.status = params.status;
  }

  return where;
}

function createPaginationInfo(page: number, limit: number, total: number): PaginationInfo {
  return {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
    hasNext: page < Math.ceil(total / limit),
    hasPrev: page > 1,
  };
}

// Middlewares reais importados do sistema

// ====================== VALIDATION SCHEMAS ======================

const sportsAttendanceSchema = z.object({
  protocol: z.string().min(1, 'Protocolo é obrigatório'),
  citizenName: z.string().min(1, 'Nome do cidadão é obrigatório'),
  contact: z.string().min(1, 'Contato é obrigatório'),
  type: z.enum([
    'EVENT_AUTHORIZATION',
    'CLUB_REGISTRATION',
    'ATHLETE_REGISTRATION',
    'FACILITY_USE',
    'PROJECT_SUPPORT',
    'EQUIPMENT_REQUEST',
    'TOURNAMENT_REQUEST',
    'GENERAL_INFORMATION',
    'OTHERS',
  ]),
  status: z.enum(['PENDING', 'UNDER_ANALYSIS', 'APPROVED', 'REJECTED', 'COMPLETED', 'CANCELLED']).optional(),
  description: z.string().min(1, 'Descrição é obrigatória'),
  observations: z.string().optional(),
  responsible: z.string().optional(),
  attachments: z.array(z.object({
    id: z.string(),
    fileName: z.string(),
    fileType: z.string(),
    fileSize: z.number(),
    url: z.string(),
    description: z.string().optional()
  })).optional(),
  sportType: z.string().optional(),
  eventDate: z.string().datetime().optional(),
  location: z.string().optional(),
  expectedParticipants: z.number().int().positive().optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional(),
});

const sportsEventSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  type: z.string().min(1, 'Tipo é obrigatório'),
  description: z.string().min(1, 'Descrição é obrigatória'),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  location: z.string().min(1, 'Local é obrigatório'),
  responsible: z.string().min(1, 'Responsável é obrigatório'),
  maxParticipants: z.number().int().positive(),
  currentParticipants: z.number().int().min(0).optional(),
  registrationFee: z.number().min(0).optional(),
  status: z.enum(['PLANNED', 'ACTIVE', 'COMPLETED', 'CANCELLED']).optional(),
});

const sportsClubSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  sport: z.string().min(1, 'Esporte é obrigatório'),
  foundationDate: z.string().datetime().optional(),
  president: z.string().min(1, 'Presidente é obrigatório'),
  contact: z.string().min(1, 'Contato é obrigatório'),
  address: z.string().min(1, 'Endereço é obrigatório'),
  members: z.array(z.object({
    id: z.string(),
    name: z.string(),
    position: z.string(),
    joinDate: z.string().datetime(),
    phone: z.string().optional(),
    email: z.string().email().optional(),
    isActive: z.boolean()
  })).optional(),
  status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
});

// ====================== ROUTER SETUP ======================

const router = Router();

// Middleware para verificar tenant em todas as rotas
router.use(tenantMiddleware);

// ====================== ROUTES ======================

/**
 * GET /api/secretarias/esporte/sports-attendances - Listar atendimentos esportivos
 */
router.get(
  '/sports-attendances',
  handleAsyncRoute(async (req, res) => {
    const search = getStringParam(req.query.search);
    const status = getStringParam(req.query.status);
    const type = getStringParam(req.query.type);
    const sportType = getStringParam(req.query.sportType);
    const page = getNumberParam(req.query.page) || 1;
    const limit = getNumberParam(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    const whereParams: {
      tenantId: string;
      search?: string;
      status?: string;
      type?: string;
      sportType?: string;
    } = {
      tenantId: req.tenantId,
    };

    if (search) whereParams.search = search;
    if (status) whereParams.status = status;
    if (type) whereParams.type = type;
    if (sportType) whereParams.sportType = sportType;

    const where = createSportsAttendanceWhereClause(whereParams);

    const [attendances, total] = await Promise.all([
      prisma.sportsAttendance.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.sportsAttendance.count({ where }),
    ]);

    const pagination = createPaginationInfo(page, limit, total);

    return res.json(createPaginatedResponse(attendances, pagination));
  })
);

/**
 * POST /api/secretarias/esporte/sports-attendances - Criar atendimento esportivo
 */
router.post(
  '/sports-attendances',
  handleAsyncRoute(async (req, res) => {
    const data = sportsAttendanceSchema.parse(req.body);

    const attendanceData: Record<string, unknown> = {
      tenantId: req.tenantId,
      protocol: data.protocol,
      citizenName: data.citizenName,
      contact: data.contact,
      type: data.type,
      status: data.status || 'PENDING',
      description: data.description,
    };

    if (data.observations) attendanceData.observations = data.observations;
    if (data.responsible) attendanceData.responsible = data.responsible;
    if (data.attachments) attendanceData.attachments = data.attachments as Prisma.InputJsonValue;
    if (data.sportType) attendanceData.sportType = data.sportType;
    if (data.eventDate) attendanceData.eventDate = new Date(data.eventDate);
    if (data.location) attendanceData.location = data.location;
    if (data.expectedParticipants) attendanceData.expectedParticipants = data.expectedParticipants;
    if (data.priority) attendanceData.priority = data.priority;

    const attendance = await prisma.sportsAttendance.create({
      data: attendanceData as Prisma.SportsAttendanceCreateInput,
    });

    return res.status(201).json(createSuccessResponse(attendance, 'Atendimento esportivo criado com sucesso'));
  })
);

/**
 * GET /api/secretarias/esporte/sports-attendances/:id - Buscar atendimento específico
 */
router.get(
  '/sports-attendances/:id',
  handleAsyncRoute(async (req, res) => {
    const attendanceId = getStringParam(req.params.id);

    if (!attendanceId) {
      return res.status(400).json(
        createErrorResponse('VALIDATION_ERROR', 'ID do atendimento é obrigatório')
      );
    }

    const attendance = await prisma.sportsAttendance.findFirst({
      where: {
        id: attendanceId,
        tenantId: req.tenantId,
      },
    });

    if (!attendance) {
      return res.status(404).json(
        createErrorResponse('NOT_FOUND', 'Atendimento esportivo não encontrado')
      );
    }

    return res.json(createSuccessResponse(attendance));
  })
);

/**
 * PUT /api/secretarias/esporte/sports-attendances/:id - Atualizar atendimento esportivo
 */
router.put(
  '/sports-attendances/:id',
  handleAsyncRoute(async (req, res) => {
    const attendanceId = getStringParam(req.params.id);
    const data = sportsAttendanceSchema.partial().parse(req.body);

    if (!attendanceId) {
      return res.status(400).json(
        createErrorResponse('VALIDATION_ERROR', 'ID do atendimento é obrigatório')
      );
    }

    const updateData: Record<string, unknown> = {};

    if (data.protocol) updateData.protocol = data.protocol;
    if (data.citizenName) updateData.citizenName = data.citizenName;
    if (data.contact) updateData.contact = data.contact;
    if (data.type) updateData.type = data.type;
    if (data.status) updateData.status = data.status;
    if (data.description) updateData.description = data.description;
    if (data.observations !== undefined) updateData.observations = data.observations || undefined;
    if (data.responsible !== undefined) updateData.responsible = data.responsible || undefined;
    if (data.attachments !== undefined) updateData.attachments = data.attachments ? data.attachments as Prisma.InputJsonValue : undefined;
    if (data.sportType !== undefined) updateData.sportType = data.sportType || undefined;
    if (data.eventDate !== undefined) updateData.eventDate = data.eventDate ? new Date(data.eventDate) : undefined;
    if (data.location !== undefined) updateData.location = data.location || undefined;
    if (data.expectedParticipants !== undefined) updateData.expectedParticipants = data.expectedParticipants || undefined;
    if (data.priority !== undefined) updateData.priority = data.priority || undefined;

    const attendance = await prisma.sportsAttendance.update({
      where: { id: attendanceId },
      data: updateData,
    });

    return res.json(createSuccessResponse(attendance, 'Atendimento esportivo atualizado com sucesso'));
  })
);

/**
 * DELETE /api/secretarias/esporte/sports-attendances/:id - Remover atendimento esportivo
 */
router.delete(
  '/sports-attendances/:id',
  handleAsyncRoute(async (req, res) => {
    const attendanceId = getStringParam(req.params.id);

    if (!attendanceId) {
      return res.status(400).json(
        createErrorResponse('VALIDATION_ERROR', 'ID do atendimento é obrigatório')
      );
    }

    await prisma.sportsAttendance.delete({
      where: { id: attendanceId },
    });

    return res.status(204).send();
  })
);

/**
 * GET /api/secretarias/esporte/sports-attendances/stats - Estatísticas dos atendimentos esportivos
 */
router.get(
  '/sports-attendances/stats',
  handleAsyncRoute(async (req, res) => {
    const [statusStats, typeStats] = await Promise.all([
      prisma.sportsAttendance.groupBy({
        by: ['status'],
        where: { tenantId: req.tenantId },
        _count: { _all: true },
      }),
      prisma.sportsAttendance.groupBy({
        by: ['type'],
        where: { tenantId: req.tenantId },
        _count: { _all: true },
      }),
    ]);

    const stats: SportsAttendanceStats = { statusStats, typeStats };

    return res.json(createSuccessResponse(stats));
  })
);

/**
 * GET /api/secretarias/esporte/sports-events - Listar eventos esportivos
 */
router.get(
  '/sports-events',
  handleAsyncRoute(async (req, res) => {
    const search = getStringParam(req.query.search);
    const type = getStringParam(req.query.type);
    const status = getStringParam(req.query.status);
    const page = getNumberParam(req.query.page) || 1;
    const limit = getNumberParam(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    const whereParams: {
      tenantId: string;
      search?: string;
      type?: string;
      status?: string;
    } = {
      tenantId: req.tenantId,
    };

    if (search) whereParams.search = search;
    if (type) whereParams.type = type;
    if (status) whereParams.status = status;

    const where = createSportsEventWhereClause(whereParams);

    const [events, total] = await Promise.all([
      prisma.sportsEvent.findMany({
        where,
        skip,
        take: limit,
        orderBy: { startDate: 'desc' },
      }),
      prisma.sportsEvent.count({ where }),
    ]);

    const pagination = createPaginationInfo(page, limit, total);

    return res.json(createPaginatedResponse(events, pagination));
  })
);

/**
 * POST /api/secretarias/esporte/sports-events - Criar evento esportivo
 */
router.post(
  '/sports-events',
  handleAsyncRoute(async (req, res) => {
    const data = sportsEventSchema.parse(req.body);

    // Validar datas
    const startDate = new Date(data.startDate);
    const endDate = new Date(data.endDate);

    if (endDate < startDate) {
      return res.status(400).json(
        createErrorResponse('VALIDATION_ERROR', 'Data de fim deve ser posterior à data de início')
      );
    }

    const eventData: Record<string, unknown> = {
      tenantId: req.tenantId,
      name: data.name,
      type: data.type,
      description: data.description,
      startDate,
      endDate,
      location: data.location,
      responsible: data.responsible,
      maxParticipants: data.maxParticipants,
      currentParticipants: data.currentParticipants || 0,
      status: data.status || 'PLANNED',
    };

    if (data.registrationFee !== undefined) {
      eventData.registrationFee = data.registrationFee;
    }

    const event = await prisma.sportsEvent.create({
      data: eventData as Prisma.SportsEventCreateInput,
    });

    return res.status(201).json(createSuccessResponse(event, 'Evento esportivo criado com sucesso'));
  })
);

/**
 * GET /api/secretarias/esporte/sports-events/:id - Buscar evento específico
 */
router.get(
  '/sports-events/:id',
  handleAsyncRoute(async (req, res) => {
    const eventId = getStringParam(req.params.id);

    if (!eventId) {
      return res.status(400).json(
        createErrorResponse('VALIDATION_ERROR', 'ID do evento é obrigatório')
      );
    }

    const event = await prisma.sportsEvent.findFirst({
      where: {
        id: eventId,
        tenantId: req.tenantId,
      },
    });

    if (!event) {
      return res.status(404).json(
        createErrorResponse('NOT_FOUND', 'Evento esportivo não encontrado')
      );
    }

    return res.json(createSuccessResponse(event));
  })
);

/**
 * PUT /api/secretarias/esporte/sports-events/:id - Atualizar evento esportivo
 */
router.put(
  '/sports-events/:id',
  handleAsyncRoute(async (req, res) => {
    const eventId = getStringParam(req.params.id);
    const data = sportsEventSchema.partial().parse(req.body);

    if (!eventId) {
      return res.status(400).json(
        createErrorResponse('VALIDATION_ERROR', 'ID do evento é obrigatório')
      );
    }

    // Validar datas se fornecidas
    if (data.startDate && data.endDate) {
      const startDate = new Date(data.startDate);
      const endDate = new Date(data.endDate);

      if (endDate < startDate) {
        return res.status(400).json(
          createErrorResponse('VALIDATION_ERROR', 'Data de fim deve ser posterior à data de início')
        );
      }
    }

    const updateData: Record<string, unknown> = {};

    if (data.name) updateData.name = data.name;
    if (data.type) updateData.type = data.type;
    if (data.description) updateData.description = data.description;
    if (data.startDate) updateData.startDate = new Date(data.startDate);
    if (data.endDate) updateData.endDate = new Date(data.endDate);
    if (data.location) updateData.location = data.location;
    if (data.responsible) updateData.responsible = data.responsible;
    if (data.maxParticipants !== undefined) updateData.maxParticipants = data.maxParticipants;
    if (data.currentParticipants !== undefined) updateData.currentParticipants = data.currentParticipants;
    if (data.registrationFee !== undefined) updateData.registrationFee = data.registrationFee || undefined;
    if (data.status) updateData.status = data.status;

    const event = await prisma.sportsEvent.update({
      where: { id: eventId },
      data: updateData,
    });

    return res.json(createSuccessResponse(event, 'Evento esportivo atualizado com sucesso'));
  })
);

/**
 * DELETE /api/secretarias/esporte/sports-events/:id - Remover evento esportivo
 */
router.delete(
  '/sports-events/:id',
  handleAsyncRoute(async (req, res) => {
    const eventId = getStringParam(req.params.id);

    if (!eventId) {
      return res.status(400).json(
        createErrorResponse('VALIDATION_ERROR', 'ID do evento é obrigatório')
      );
    }

    await prisma.sportsEvent.delete({
      where: { id: eventId },
    });

    return res.status(204).send();
  })
);

/**
 * GET /api/secretarias/esporte/sports-clubs - Listar clubes esportivos
 */
router.get(
  '/sports-clubs',
  handleAsyncRoute(async (req, res) => {
    const search = getStringParam(req.query.search);
    const sport = getStringParam(req.query.sport);
    const status = getStringParam(req.query.status);
    const page = getNumberParam(req.query.page) || 1;
    const limit = getNumberParam(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    const whereParams: {
      tenantId: string;
      search?: string;
      sport?: string;
      status?: string;
    } = {
      tenantId: req.tenantId,
    };

    if (search) whereParams.search = search;
    if (sport) whereParams.sport = sport;
    if (status) whereParams.status = status;

    const where = createSportsClubWhereClause(whereParams);

    const [clubs, total] = await Promise.all([
      prisma.sportsClub.findMany({
        where,
        skip,
        take: limit,
        orderBy: { name: 'asc' },
      }),
      prisma.sportsClub.count({ where }),
    ]);

    const pagination = createPaginationInfo(page, limit, total);

    return res.json(createPaginatedResponse(clubs, pagination));
  })
);

/**
 * POST /api/secretarias/esporte/sports-clubs - Criar clube esportivo
 */
router.post(
  '/sports-clubs',
  handleAsyncRoute(async (req, res) => {
    const data = sportsClubSchema.parse(req.body);

    const clubData: Record<string, unknown> = {
      tenantId: req.tenantId,
      name: data.name,
      sport: data.sport,
      president: data.president,
      contact: data.contact,
      address: data.address,
      status: data.status || 'ACTIVE',
    };

    if (data.foundationDate) {
      clubData.foundationDate = new Date(data.foundationDate);
    }

    if (data.members) {
      clubData.members = data.members as Prisma.InputJsonValue;
    }

    const club = await prisma.sportsClub.create({
      data: clubData as Prisma.SportsClubCreateInput,
    });

    return res.status(201).json(createSuccessResponse(club, 'Clube esportivo criado com sucesso'));
  })
);

/**
 * GET /api/secretarias/esporte/sports-clubs/:id - Buscar clube específico
 */
router.get(
  '/sports-clubs/:id',
  handleAsyncRoute(async (req, res) => {
    const clubId = getStringParam(req.params.id);

    if (!clubId) {
      return res.status(400).json(
        createErrorResponse('VALIDATION_ERROR', 'ID do clube é obrigatório')
      );
    }

    const club = await prisma.sportsClub.findFirst({
      where: {
        id: clubId,
        tenantId: req.tenantId,
      },
    });

    if (!club) {
      return res.status(404).json(
        createErrorResponse('NOT_FOUND', 'Clube esportivo não encontrado')
      );
    }

    return res.json(createSuccessResponse(club));
  })
);

/**
 * PUT /api/secretarias/esporte/sports-clubs/:id - Atualizar clube esportivo
 */
router.put(
  '/sports-clubs/:id',
  handleAsyncRoute(async (req, res) => {
    const clubId = getStringParam(req.params.id);
    const data = sportsClubSchema.partial().parse(req.body);

    if (!clubId) {
      return res.status(400).json(
        createErrorResponse('VALIDATION_ERROR', 'ID do clube é obrigatório')
      );
    }

    const updateData: Record<string, unknown> = {};

    if (data.name) updateData.name = data.name;
    if (data.sport) updateData.sport = data.sport;
    if (data.foundationDate !== undefined) updateData.foundationDate = data.foundationDate ? new Date(data.foundationDate) : undefined;
    if (data.president) updateData.president = data.president;
    if (data.contact) updateData.contact = data.contact;
    if (data.address) updateData.address = data.address;
    if (data.members !== undefined) updateData.members = data.members ? data.members as Prisma.InputJsonValue : undefined;
    if (data.status) updateData.status = data.status;

    const club = await prisma.sportsClub.update({
      where: { id: clubId },
      data: updateData,
    });

    return res.json(createSuccessResponse(club, 'Clube esportivo atualizado com sucesso'));
  })
);

/**
 * DELETE /api/secretarias/esporte/sports-clubs/:id - Remover clube esportivo
 */
router.delete(
  '/sports-clubs/:id',
  handleAsyncRoute(async (req, res) => {
    const clubId = getStringParam(req.params.id);

    if (!clubId) {
      return res.status(400).json(
        createErrorResponse('VALIDATION_ERROR', 'ID do clube é obrigatório')
      );
    }

    await prisma.sportsClub.delete({
      where: { id: clubId },
    });

    return res.status(204).send();
  })
);

/**
 * GET /api/secretarias/esporte/sports-clubs/stats - Estatísticas dos clubes esportivos
 */
router.get(
  '/sports-clubs/stats',
  handleAsyncRoute(async (req, res) => {
    const [sportStats, totalClubs, activeClubs] = await Promise.all([
      prisma.sportsClub.groupBy({
        by: ['sport'],
        where: { tenantId: req.tenantId, status: 'ACTIVE' },
        _count: { _all: true },
      }),
      prisma.sportsClub.count({
        where: { tenantId: req.tenantId },
      }),
      prisma.sportsClub.count({
        where: { tenantId: req.tenantId, status: 'ACTIVE' },
      }),
    ]);

    const stats: SportsClubStats = {
      sportStats,
      totalClubs,
      activeClubs,
    };

    return res.json(createSuccessResponse(stats));
  })
);

// ====================== ERROR HANDLING ======================

router.use((error: unknown, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Erro nas rotas da Secretaria de Esporte:', error);

  if (isZodError(error)) {
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