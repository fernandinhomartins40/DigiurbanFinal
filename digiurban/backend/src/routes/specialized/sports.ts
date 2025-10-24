import { Router, Request, Response, NextFunction, RequestHandler } from 'express';
import { Prisma } from '@prisma/client';
import { prisma } from '../../lib/prisma';
import { z } from 'zod';
import { AuthenticatedRequest, SuccessResponse, ErrorResponse, PaginatedResponse } from '../../types';
import { asyncHandler } from '../../utils/express-helpers';
import { requirePermission } from '../../middleware/admin-auth';

// ====================== TIPOS LOCAIS ======================

// ====================== HELPER FUNCTIONS ======================

function getStringParam(param: unknown): string {
  if (Array.isArray(param)) return param[0] || '';
  if (typeof param === 'string') return param;
  if (param && typeof param === 'object' && param.toString) return param.toString();
  return '';
}

function createSuccessResponse<T>(data: T, message?: string): SuccessResponse<T> {
  return { success: true, data, message };
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
    success: true,
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasNext: page < Math.ceil(total / limit),
      hasPrev: page > 1
    }
  };
}

function validateSchemaAndRespond<T>(schema: z.ZodSchema<T>, data: unknown, res: Response): T | null {
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

import { tenantMiddleware } from '../../middleware/tenant';
import { adminAuthMiddleware } from '../../middleware/admin-auth';

// Interfaces para where clauses específicas de esportes
interface SportsWhereInput {
  tenantId: string;
  isActive?: boolean;
  status?: string;
  sport?: string;
  category?: string;
  ageGroup?: string;
  season?: string;
  eventDate?: {
    gte?: Date;
    lte?: Date;
  };
}

// Interfaces para resultados de groupBy
interface GroupByResult {
  _count: Record<string, number>;
  [key: string]: unknown;
}

const router = Router();

// Middleware global
router.use(tenantMiddleware);
router.use(adminAuthMiddleware);

// ====================== SCHEMAS DE VALIDAÇÃO ======================

const sportsTeamSchema = z.object({
  name: z.string().min(2, 'Nome da equipe é obrigatório'),
  sport: z.string().min(1, 'Modalidade é obrigatória'),
  modalityId: z.string().optional(),
  category: z.enum(['infantil', 'juvenil', 'adulto', 'veterano']),
  gender: z.enum(['masculino', 'feminino', 'misto']),
  coach: z.string().min(2, 'Nome do técnico é obrigatório'),
  coachPhone: z.string().optional(),
  trainingSchedule: z.array(
    z.object({
      day: z.enum(['segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado', 'domingo']),
      startTime: z.string(),
      endTime: z.string(),
      location: z.string(),
    })
  ),
  maxPlayers: z.number().int().min(1),
  currentPlayers: z.number().int().min(0).default(0),
  isActive: z.boolean().default(true),
});

const athleteSchema = z.object({
  name: z.string().min(2, 'Nome é obrigatório'),
  birthDate: z.string().transform(str => new Date(str)),
  cpf: z.string().min(11, 'CPF é obrigatório'),
  rg: z.string().optional(),
  address: z.string().min(5, 'Endereço é obrigatório'),
  phone: z.string().min(10, 'Telefone é obrigatório'),
  email: z.string().email().optional(),
  sport: z.string().min(1, 'Modalidade é obrigatória'),
  modalityId: z.string().optional(),
  teamId: z.string().optional(),
  federationNumber: z.string().optional(),
  federationExpiry: z
    .string()
    .transform(str => new Date(str))
    .optional(),
  emergencyContact: z.object({
    name: z.string().min(2, 'Nome do contato de emergência é obrigatório'),
    phone: z.string().min(10, 'Telefone do contato de emergência é obrigatório'),
    relationship: z.string().min(2, 'Parentesco é obrigatório'),
  }),
  medicalCertificate: z.object({
    hasValid: z.boolean(),
    expiryDate: z
      .string()
      .transform(str => new Date(str))
      .optional(),
    observations: z.string().optional(),
  }),
  isActive: z.boolean().default(true),
});

const competitionSchema = z.object({
  name: z.string().min(2, 'Nome da competição é obrigatório'),
  sport: z.string().min(1, 'Modalidade é obrigatória'),
  modalityId: z.string().optional(),
  type: z.enum(['campeonato', 'torneio', 'festival', 'amistoso']),
  startDate: z.string().transform(str => new Date(str)),
  endDate: z.string().transform(str => new Date(str)),
  location: z.string().min(5, 'Local é obrigatório'),
  maxTeams: z.number().int().min(2),
  registeredTeams: z.number().int().min(0).default(0),
  entryFee: z.number().min(0).optional(),
  prizes: z
    .array(
      z.object({
        position: z.number().int(),
        description: z.string(),
        value: z.number().optional(),
      })
    )
    .optional(),
  rules: z.string().optional(),
  organizer: z.string().min(2, 'Organizador é obrigatório'),
  contact: z.object({
    phone: z.string(),
    email: z.string().email().optional(),
  }),
  status: z
    .enum(['planejada', 'inscricoes_abertas', 'em_andamento', 'finalizada', 'cancelada'])
    .default('planejada'),
});

const sportsEventSchema = z.object({
  title: z.string().min(2, 'Título é obrigatório'),
  description: z.string().min(10, 'Descrição é obrigatória'),
  eventType: z.enum(['competicao', 'treino', 'apresentacao', 'reuniao', 'clinica']),
  sport: z.string().optional(),
  date: z.string().transform(str => new Date(str)),
  startTime: z.string(),
  endTime: z.string(),
  location: z.string().min(2, 'Local é obrigatório'),
  capacity: z.number().int().min(1).optional(),
  targetAudience: z.string().optional(),
  entryFee: z.number().min(0).optional(),
  registrationRequired: z.boolean().default(false),
  organizer: z.string().min(2, 'Organizador é obrigatório'),
  contact: z.object({
    phone: z.string(),
    email: z.string().email().optional(),
  }),
  isPublic: z.boolean().default(true),
});

const sportsInfrastructureSchema = z.object({
  name: z.string().min(2, 'Nome é obrigatório'),
  type: z.enum(['quadra', 'campo', 'piscina', 'pista', 'ginasio', 'academia']),
  address: z.string().min(5, 'Endereço é obrigatório'),
  coordinates: z
    .object({
      lat: z.number(),
      lng: z.number(),
    })
    .optional(),
  capacity: z.number().int().min(1),
  modalities: z.array(z.string()),
  facilities: z.array(z.string()).optional(),
  operatingHours: z.object({
    monday: z.string().optional(),
    tuesday: z.string().optional(),
    wednesday: z.string().optional(),
    thursday: z.string().optional(),
    friday: z.string().optional(),
    saturday: z.string().optional(),
    sunday: z.string().optional(),
  }),
  manager: z.string().min(2, 'Responsável é obrigatório'),
  contact: z.object({
    phone: z.string(),
    email: z.string().email().optional(),
  }),
  lastMaintenance: z
    .string()
    .transform(str => new Date(str))
    .optional(),
  maintenanceSchedule: z.string().optional(),
  status: z.enum(['ativo', 'manutencao', 'reforma', 'inativo']).default('ativo'),
  isPublic: z.boolean().default(true),
});

const sportsSchoolSchema = z.object({
  name: z.string().min(2, 'Nome da escolinha é obrigatório'),
  sport: z.string().min(1, 'Modalidade é obrigatória'),
  ageGroup: z.object({
    minAge: z.number().int().min(4),
    maxAge: z.number().int().max(18),
  }),
  instructor: z.string().min(2, 'Nome do instrutor é obrigatório'),
  instructorCredentials: z.string().optional(),
  schedule: z.array(
    z.object({
      day: z.enum(['segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado']),
      startTime: z.string(),
      endTime: z.string(),
    })
  ),
  location: z.string().min(2, 'Local é obrigatório'),
  maxStudents: z.number().int().min(5),
  currentStudents: z.number().int().min(0).default(0),
  monthlyFee: z.number().min(0).optional(),
  objectives: z.string().min(10, 'Objetivos são obrigatórios'),
  requirements: z.array(z.string()).optional(),
  startDate: z.string().transform(str => new Date(str)),
  endDate: z
    .string()
    .transform(str => new Date(str))
    .optional(),
  isActive: z.boolean().default(true),
});

const sportsAttendanceSchema = z.object({
  citizenId: z.string().min(1, 'Cidadão é obrigatório'),
  serviceType: z.enum([
    'inscricao_escolinha',
    'inscricao_competicao',
    'reserva_espaco',
    'informacoes',
    'reclamacao',
  ]),
  description: z.string().min(10, 'Descrição é obrigatória'),
  sport: z.string().optional(),
  referredTo: z.string().optional(),
  resolution: z.string().optional(),
  followUpNeeded: z.boolean().default(false),
  followUpDate: z
    .string()
    .transform(str => new Date(str))
    .optional(),
});

// ====================== EQUIPES ESPORTIVAS ======================

// GET /api/specialized/sports/teams
router.get('/teams', requirePermission('sports:read'), asyncHandler(async (req, res) => {
  const sport = getStringParam(req.query.sport);
  const category = getStringParam(req.query.category);
  const gender = getStringParam(req.query.gender);
  const isActive = getStringParam(req.query.isActive);

  const where: Record<string, unknown> = { tenantId: req.tenant?.id || req.tenantId };
  if (sport) where.sport = sport;
  if (category) where.category = category;
  if (gender) where.gender = gender;
  if (isActive !== '') where.isActive = isActive === 'true';

  const teams = await prisma.sportsTeam.findMany({
    where,
    include: {
      modality: true,
    },
    orderBy: { name: 'asc' },
  });

  res.json(createSuccessResponse(teams, 'Equipes encontradas com sucesso'));
}));

// POST /api/specialized/sports/teams
router.post('/teams', requirePermission('sports:write'), asyncHandler(async (req, res) => {
  const validatedData = validateSchemaAndRespond(sportsTeamSchema, req.body, res);
  if (!validatedData) return;

  const team = await prisma.sportsTeam.create({
    data: {
      name: validatedData.name,
      sport: validatedData.sport,
      category: validatedData.category,
      gender: validatedData.gender,
      coach: validatedData.coach,
      coachPhone: validatedData.coachPhone,
      trainingSchedule: JSON.stringify(validatedData.trainingSchedule),
      maxPlayers: validatedData.maxPlayers,
      currentPlayers: validatedData.currentPlayers || 0,
      isActive: validatedData.isActive !== false,
      tenantId: req.tenant?.id || req.tenantId!,
    } as any,
  });

  res.status(201).json(createSuccessResponse(team, 'Equipe criada com sucesso'));
}));

// ====================== ATLETAS ======================

// GET /api/specialized/sports/athletes
router.get('/athletes', requirePermission('sports:read'), asyncHandler(async (req, res) => {
  const sport = getStringParam(req.query.sport);
  const teamId = getStringParam(req.query.teamId);
  const isActive = getStringParam(req.query.isActive);
  const search = getStringParam(req.query.search);
  const page = getStringParam(req.query.page) || '1';
  const limit = getStringParam(req.query.limit) || '20';

  const pageNum = parseInt(page, 10);
  const limitNum = parseInt(limit, 10);
  const skip = (pageNum - 1) * limitNum;

  const where: Record<string, unknown> = { tenantId: req.tenant?.id || req.tenantId };
  if (sport) where.sport = sport;
  if (teamId) where.teamId = teamId;
  if (isActive !== '') where.isActive = isActive === 'true';
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { cpf: { contains: search } },
      { federationNumber: { contains: search } },
    ];
  }

  const [athletes, total] = await Promise.all([
    prisma.athlete.findMany({
      where,
      orderBy: { name: 'asc' },
      skip,
      take: limitNum,
    }),
    prisma.athlete.count({ where }),
  ]);

  res.json(createPaginatedResponse(athletes, pageNum, limitNum, total));
}));

// POST /api/specialized/sports/athletes
router.post('/athletes', requirePermission('sports:write'), asyncHandler(async (req, res) => {
  const validatedData = validateSchemaAndRespond(athleteSchema, req.body, res);
  if (!validatedData) return;

  const athlete = await prisma.athlete.create({
    data: {
      name: validatedData.name,
      birthDate: validatedData.birthDate,
      cpf: validatedData.cpf,
      rg: validatedData.rg,
      address: validatedData.address,
      phone: validatedData.phone,
      email: validatedData.email,
      sport: validatedData.sport,
      teamId: validatedData.teamId,
      federationNumber: validatedData.federationNumber,
      federationExpiry: validatedData.federationExpiry,
      medicalCertificate: JSON.stringify(validatedData.medicalCertificate),
      isActive: validatedData.isActive !== false,
      tenantId: req.tenant?.id || req.tenantId!,
    } as any,
  });

  res.status(201).json(createSuccessResponse(athlete, 'Atleta cadastrado com sucesso'));
}));

// ====================== COMPETIÇÕES ======================

// GET /api/specialized/sports/competitions
router.get('/competitions', requirePermission('sports:read'), asyncHandler(async (req, res) => {
  const sport = getStringParam(req.query.sport);
  const type = getStringParam(req.query.type);
  const status = getStringParam(req.query.status);
  const startDate = getStringParam(req.query.startDate);
  const endDate = getStringParam(req.query.endDate);

  const where: Record<string, unknown> = { tenantId: req.tenant?.id || req.tenantId };
  if (sport) where.sport = sport;
  if (type) where.type = type;
  if (status) where.status = status;

  if (startDate && endDate) {
    where.startDate = {
      gte: new Date(startDate),
      lte: new Date(endDate),
    };
  }

  const competitions = await prisma.competition.findMany({
    where,
    include: {
      modality: true,
    },
    orderBy: { startDate: 'desc' },
  });

  res.json(createSuccessResponse(competitions, 'Competições encontradas'));
}));

// POST /api/specialized/sports/competitions
router.post('/competitions', requirePermission('sports:write'), asyncHandler(async (req, res) => {
  const validatedData = validateSchemaAndRespond(competitionSchema, req.body, res);
  if (!validatedData) return;

  const competition = await prisma.competition.create({
    data: {
      name: validatedData.name,
      sport: validatedData.sport,
      type: validatedData.type,
      startDate: validatedData.startDate,
      endDate: validatedData.endDate,
      location: validatedData.location,
      maxTeams: validatedData.maxTeams,
      registeredTeams: validatedData.registeredTeams || 0,
      entryFee: validatedData.entryFee,
      prizes: validatedData.prizes ? JSON.stringify(validatedData.prizes) : null,
      rules: validatedData.rules,
      organizer: validatedData.organizer,
      contact: JSON.stringify(validatedData.contact),
      status: validatedData.status || 'planejada',
      tenantId: req.tenant?.id || req.tenantId!,
    } as unknown as Prisma.CompetitionUncheckedCreateInput,
  });

  res.status(201).json(createSuccessResponse(competition, 'Competição criada com sucesso'));
}));

// ====================== EVENTOS ESPORTIVOS ======================

// GET /api/specialized/sports/events
router.get('/events', requirePermission('sports:read'), asyncHandler(async (req, res) => {
  const eventType = getStringParam(req.query.eventType);
  const sport = getStringParam(req.query.sport);
  const month = getStringParam(req.query.month);
  const year = getStringParam(req.query.year);
  const isPublic = getStringParam(req.query.isPublic);

  const where: Record<string, unknown> = { tenantId: req.tenant?.id || req.tenantId };
  if (eventType) where.eventType = eventType;
  if (sport) where.sport = sport;
  if (isPublic !== '') where.isPublic = isPublic === 'true';

  if (month && year) {
    const startDate = new Date(Number(year), Number(month) - 1, 1);
    const endDate = new Date(Number(year), Number(month), 0, 23, 59, 59);
    where.date = { gte: startDate, lte: endDate };
  }

  const events = await prisma.sportsEvent.findMany({
    where,
    orderBy: { date: 'asc' },
  });

  res.json(createSuccessResponse(events, 'Eventos encontrados'));
}));

// POST /api/specialized/sports/events
router.post('/events', requirePermission('sports:write'), asyncHandler(async (req, res) => {
  const validatedData = validateSchemaAndRespond(sportsEventSchema, req.body, res);
  if (!validatedData) return;

  const event = await prisma.sportsEvent.create({
    data: {
      title: validatedData.title,
      description: validatedData.description,
      eventType: validatedData.eventType,
      sport: validatedData.sport,
      date: validatedData.date,
      startTime: validatedData.startTime,
      endTime: validatedData.endTime,
      location: validatedData.location,
      capacity: validatedData.capacity,
      targetAudience: validatedData.targetAudience,
      entryFee: validatedData.entryFee,
      registrationRequired: validatedData.registrationRequired || false,
      organizer: validatedData.organizer,
      contact: JSON.stringify(validatedData.contact),
      isPublic: validatedData.isPublic !== false,
      tenantId: req.tenant?.id || req.tenantId!,
    } as unknown as Prisma.SportsEventUncheckedCreateInput,
  });

  res.status(201).json(createSuccessResponse(event, 'Evento criado com sucesso'));
}));

// ====================== INFRAESTRUTURA ESPORTIVA ======================

// GET /api/specialized/sports/infrastructure
router.get('/infrastructure', requirePermission('sports:read'), asyncHandler(async (req, res) => {
  const type = getStringParam(req.query.type);
  const status = getStringParam(req.query.status);
  const modality = getStringParam(req.query.modality);
  const isPublic = getStringParam(req.query.isPublic);

  const where: Record<string, unknown> = { tenantId: req.tenant?.id || req.tenantId };
  if (type) where.type = type;
  if (status) where.status = status;
  if (isPublic !== '') where.isPublic = isPublic === 'true';
  if (modality) {
    where.modalities = {
      hasSome: [modality],
    };
  }

  const infrastructure = await prisma.sportsInfrastructure.findMany({
    where,
    orderBy: { name: 'asc' },
  });

  res.json(createSuccessResponse(infrastructure, 'Infraestrutura encontrada'));
}));

// POST /api/specialized/sports/infrastructure
router.post('/infrastructure', requirePermission('sports:write'), asyncHandler(async (req, res) => {
  const validatedData = validateSchemaAndRespond(sportsInfrastructureSchema, req.body, res);
  if (!validatedData) return;

  const infrastructure = await prisma.sportsInfrastructure.create({
    data: {
      name: validatedData.name,
      type: validatedData.type,
      address: validatedData.address,
      coordinates: validatedData.coordinates ? JSON.stringify(validatedData.coordinates) : null,
      capacity: validatedData.capacity,
      modalities: validatedData.modalities,
      facilities: validatedData.facilities,
      operatingHours: JSON.stringify(validatedData.operatingHours),
      manager: validatedData.manager,
      contact: JSON.stringify(validatedData.contact),
      lastMaintenance: validatedData.lastMaintenance,
      maintenanceSchedule: validatedData.maintenanceSchedule,
      status: validatedData.status || 'ativo',
      isPublic: validatedData.isPublic !== false,
      tenantId: req.tenant?.id || req.tenantId!,
    } as unknown as Prisma.SportsInfrastructureUncheckedCreateInput,
  });

  res.status(201).json(createSuccessResponse(infrastructure, 'Infraestrutura cadastrada com sucesso'));
}));

// ====================== ESCOLINHAS ESPORTIVAS ======================

// GET /api/specialized/sports/sports-schools
router.get('/sports-schools', requirePermission('sports:read'), asyncHandler(async (req, res) => {
  const sport = getStringParam(req.query.sport);
  const isActive = getStringParam(req.query.isActive);
  const ageGroup = getStringParam(req.query.ageGroup);

  const where: Record<string, unknown> = { tenantId: req.tenant?.id || req.tenantId };
  if (sport) where.sport = sport;
  if (isActive !== '') where.isActive = isActive === 'true';

  const schools = await prisma.sportsSchool.findMany({
    where,
    orderBy: { name: 'asc' },
  });

  res.json(createSuccessResponse(schools, 'Escolinhas esportivas encontradas'));
}));

// POST /api/specialized/sports/sports-schools
router.post('/sports-schools', requirePermission('sports:write'), asyncHandler(async (req, res) => {
  const validatedData = validateSchemaAndRespond(sportsSchoolSchema, req.body, res);
  if (!validatedData) return;

  const school = await prisma.sportsSchool.create({
    data: {
      name: validatedData.name,
      sport: validatedData.sport,
      description: validatedData.objectives || '',
      targetAge: JSON.stringify(validatedData.ageGroup),
      instructor: validatedData.instructor,
      instructorCpf: validatedData.instructorCredentials,
      schedule: validatedData.schedule,
      location: validatedData.location,
      maxStudents: validatedData.maxStudents,
      currentStudents: validatedData.currentStudents || 0,
      monthlyFee: validatedData.monthlyFee,
      requirements: validatedData.requirements,
      startDate: validatedData.startDate,
      endDate: validatedData.endDate,
      isActive: validatedData.isActive !== false,
      tenantId: req.tenant?.id || req.tenantId!,
    } as any,
  });

  res.status(201).json(createSuccessResponse(school, 'Escolinha esportiva criada com sucesso'));
}));

// ====================== ATENDIMENTOS DA SECRETARIA ======================

// GET /api/specialized/sports/attendances
router.get('/attendances', requirePermission('sports:read'), asyncHandler(async (req, res) => {
  const citizenId = getStringParam(req.query.citizenId);
  const serviceType = getStringParam(req.query.serviceType);
  const sport = getStringParam(req.query.sport);
  const page = getStringParam(req.query.page) || '1';
  const limit = getStringParam(req.query.limit) || '20';

  const pageNum = parseInt(page, 10);
  const limitNum = parseInt(limit, 10);
  const skip = (pageNum - 1) * limitNum;

  const where: Record<string, unknown> = { tenantId: req.tenant?.id || req.tenantId };
  if (citizenId) where.citizenId = citizenId;
  if (serviceType) where.serviceType = serviceType;
  if (sport) where.sport = sport;

  const [attendances, total] = await Promise.all([
    prisma.sportsAttendance.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limitNum,
    }),
    prisma.sportsAttendance.count({ where }),
  ]);

  res.json(createPaginatedResponse(attendances, pageNum, limitNum, total));
}));

// POST /api/specialized/sports/attendances
router.post('/attendances', requirePermission('sports:write'), asyncHandler(async (req, res) => {
  const validatedData = validateSchemaAndRespond(sportsAttendanceSchema, req.body, res);
  if (!validatedData) return;

  const attendance = await prisma.sportsAttendance.create({
    data: {
      citizenId: validatedData.citizenId,
      serviceType: validatedData.serviceType,
      description: validatedData.description,
      sport: validatedData.sport,
      referredTo: validatedData.referredTo,
      resolution: validatedData.resolution,
      followUpNeeded: validatedData.followUpNeeded || false,
      followUpDate: validatedData.followUpDate,
      tenantId: req.tenant?.id || req.tenantId!,
    } as unknown as Prisma.SportsAttendanceUncheckedCreateInput,
  });

  res.status(201).json(createSuccessResponse(attendance, 'Atendimento registrado com sucesso'));
}));

// ====================== DASHBOARD E MÉTRICAS ======================

// GET /api/specialized/sports/dashboard
router.get('/dashboard', requirePermission('sports:read'), asyncHandler(async (req, res) => {
  const today = new Date();
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  const [
    totalTeams,
    totalAthletes,
    activeCompetitions,
    upcomingEvents,
    availableInfrastructure,
    activeSportsSchools,
    attendancesThisMonth,
    athletesByModality,
  ] = await Promise.all([
    // Total de equipes ativas
    prisma.sportsTeam.count({
      where: { tenantId: req.tenant?.id || req.tenantId, isActive: true },
    }),

    // Total de atletas ativos
    prisma.athlete.count({
      where: { tenantId: req.tenant?.id || req.tenantId, isActive: true },
    }),

    // Competições em andamento
    prisma.competition.count({
      where: {
        tenantId: req.tenant?.id || req.tenantId,
        status: { in: ['inscricoes_abertas', 'em_andamento'] },
      },
    }),

    // Eventos próximos (próximos 30 dias)
    prisma.sportsEvent.count({
      where: {
        tenantId: req.tenant?.id || req.tenantId,
        date: {
          gte: today,
          lte: new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000),
        },
      },
    }),

    // Infraestrutura disponível
    prisma.sportsInfrastructure.count({
      where: {
        tenantId: req.tenant?.id || req.tenantId,
        status: 'ativo',
      },
    }),

    // Escolinhas ativas
    prisma.sportsSchool.count({
      where: { tenantId: req.tenant?.id || req.tenantId, isActive: true },
    }),

    // Atendimentos este mês
    prisma.sportsAttendance.count({
      where: {
        tenantId: req.tenant?.id || req.tenantId,
        createdAt: { gte: startOfMonth },
      },
    }),

    // Atletas por modalidade
    prisma.athlete.groupBy({
      by: ['sport'],
      where: { tenantId: req.tenant?.id || req.tenantId, isActive: true },
      _count: true,
    }),
  ]);

  const dashboardData = {
    totalTeams,
    totalAthletes,
    activeCompetitions,
    upcomingEvents,
    availableInfrastructure,
    activeSportsSchools,
    attendancesThisMonth,
    athletesByModality: athletesByModality.length,
  };

  res.json(createSuccessResponse(dashboardData, 'Dashboard de esportes carregado'));
}));

export default router;
