import { Router, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { tenantMiddleware } from '../middleware/tenant';
import { authenticateToken, requireManager } from '../middleware/auth';
import { AuthenticatedRequest } from '../types';
import { asyncHandler } from '../utils/express-helpers';
import { generateProtocolNumber } from '../utils/protocol-number-generator';

// ===== TIPOS LOCAIS ISOLADOS =====

interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Helper para query params seguros
function getStringParam(param: unknown): string {
  if (Array.isArray(param)) return String(param[0] || '');
  if (typeof param === 'string') return param;
  if (param && typeof param === 'object' && param !== null) {
    return String(param);
  }
  return '';
}

// Tipo genérico para Where Clause
interface PrismaWhereClause {
  tenantId: string;
  OR?: Array<Record<string, { contains: string; mode: 'insensitive' }>>;
  status?: string;
  type?: string;
  category?: string;
  sport?: string;
  [key: string]: unknown;
}

// Helper para criar where clauses seguras
function createSafeWhereClause(params: {
  tenantId: string;
  search?: string;
  status?: string;
  type?: string;
  category?: string;
  sport?: string;
  searchFields?: string[];
}): PrismaWhereClause {
  const where: PrismaWhereClause = {
    tenantId: params.tenantId
  };

  if (params.search && params.searchFields) {
    const searchConditions: Array<Record<string, { contains: string; mode: 'insensitive' }>> = [];

    params.searchFields.forEach(field => {
      searchConditions.push({
        [field]: { contains: params.search!, mode: 'insensitive' }
      });
    });

    if (searchConditions.length > 0) {
      where.OR = searchConditions;
    }
  }

  if (params.status) {
    where.status = params.status;
  }

  if (params.type) {
    where.type = params.type;
  }

  if (params.category) {
    where.category = params.category;
  }

  if (params.sport) {
    where.sport = params.sport;
  }

  return where;
}

const router = Router();

// Apply middleware
router.use(tenantMiddleware);

// Validation schemas
const sportsAttendanceSchema = z.object({
  protocol: z.string().min(1).optional(),
  citizenName: z.string().min(1),
  contact: z.string().min(1),
  type: z.enum(['GENERAL', 'EVENT_REGISTRATION', 'FACILITIES_REQUEST', 'INFORMATION', 'COMPLAINT', 'OTHERS']),
  status: z.enum(['PENDING', 'UNDER_ANALYSIS', 'APPROVED', 'REJECTED', 'COMPLETED', 'CANCELLED']).optional(),
  description: z.string().min(1),
  observations: z.string().optional(),
  sportType: z.string().optional(),
  sport: z.string().optional(),
  eventDate: z.string().datetime().optional(),
  location: z.string().optional(),
  expectedParticipants: z.number().int().positive().optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional(),
});

const athleteSchema = z.object({
  name: z.string().min(1),
  birthDate: z.string().datetime(),
  cpf: z.string().optional(),
  rg: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  sport: z.string().min(1),
  category: z.string().min(1),
  team: z.string().optional(),
  teamId: z.string().optional(),
  position: z.string().optional(),
  medicalInfo: z.object({
    bloodType: z.string().optional(),
    allergies: z.string().optional(),
    chronicConditions: z.string().optional(),
    medications: z.string().optional()
  }).optional(),
  emergencyContact: z.object({
    name: z.string(),
    relationship: z.string(),
    phone: z.string()
  }).optional(),
  federationNumber: z.string().optional(),
  federationExpiry: z.string().datetime().optional(),
  modalityId: z.string().optional(),
});

const sportsTeamSchema = z.object({
  name: z.string().min(1),
  sport: z.string().min(1),
  category: z.string().min(1),
  gender: z.string().optional(),
  ageGroup: z.string().min(1),
  coach: z.string().min(1),
  coachCpf: z.string().optional(),
  coachPhone: z.string().optional(),
  foundationDate: z.string().datetime().optional(),
  trainingSchedule: z.array(z.object({
    day: z.string(),
    startTime: z.string(),
    endTime: z.string(),
    location: z.string()
  })).optional(),
  maxPlayers: z.number().int().positive().optional(),
  homeVenue: z.string().optional(),
  description: z.string().optional(),
  modalityId: z.string().optional(),
});

const sportsModalitySchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  category: z.enum(['individual', 'coletivo']),
});

const sportsSchoolSchema = z.object({
  name: z.string().min(1),
  sport: z.string().min(1),
  description: z.string().min(1),
  targetAge: z.string().min(1),
  instructor: z.string().min(1),
  instructorCpf: z.string().optional(),
  maxStudents: z.number().int().positive(),
  schedule: z.array(z.object({
    day: z.string(),
    startTime: z.string(),
    endTime: z.string()
  })),
  location: z.string().min(1),
  monthlyFee: z.number().nonnegative().optional(),
  equipment: z.array(z.string()).optional(),
  requirements: z.string().optional(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime().optional(),
});

const sportsInfrastructureSchema = z.object({
  name: z.string().min(1),
  type: z.string().min(1),
  sports: z.array(z.string()),
  modalities: z.array(z.string()).optional(),
  address: z.string().min(1),
  coordinates: z.object({
    latitude: z.number(),
    longitude: z.number()
  }).optional(),
  capacity: z.number().int().positive().optional(),
  dimensions: z.string().optional(),
  surface: z.string().optional(),
  lighting: z.boolean().optional(),
  covered: z.boolean().optional(),
  accessibility: z.boolean().optional(),
  equipment: z.array(z.string()).optional(),
  facilities: z.array(z.string()).optional(),
  operatingHours: z.string().optional(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'MAINTENANCE']).optional(),
  contact: z.string().optional(),
  manager: z.string().optional(),
  isPublic: z.boolean().optional(),
});

const competitionSchema = z.object({
  name: z.string().min(1),
  sport: z.string().min(1),
  competitionType: z.string().min(1),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  category: z.string().min(1),
  ageGroup: z.string().min(1),
  maxTeams: z.number().int().positive().optional(),
  registrationFee: z.number().nonnegative().optional(),
  entryFee: z.number().nonnegative().optional(),
  prizes: z.array(z.object({
    position: z.string(),
    prize: z.string(),
    value: z.number().optional()
  })).optional(),
  rules: z.string().optional(),
  organizer: z.string().min(1),
  venue: z.string().optional(),
  location: z.string().optional(),
  contact: z.object({
    name: z.string(),
    phone: z.string(),
    email: z.string().email().optional()
  }).optional(),
  modalityId: z.string().optional(),
});

// ============= STATS ENDPOINT =============
router.get('/stats', authenticateToken, requireManager, asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.tenantId) {
      res.status(400).json({ error: 'TenantId é obrigatório' });
      return;
    }

    const [
      totalAthletes,
      activeAthletes,
      totalTeams,
      activeTeams,
      totalCompetitions,
      upcomingCompetitions,
      totalSchools,
      activeSchools,
      totalInfrastructures,
      activeInfrastructures,
      totalModalities,
      pendingAttendances,
    ] = await Promise.all([
      prisma.athlete.count({ where: { tenantId: req.tenantId } }),
      prisma.athlete.count({ where: { tenantId: req.tenantId, isActive: true } }),
      prisma.sportsTeam.count({ where: { tenantId: req.tenantId } }),
      prisma.sportsTeam.count({ where: { tenantId: req.tenantId, isActive: true } }),
      prisma.competition.count({ where: { tenantId: req.tenantId } }),
      prisma.competition.count({
        where: {
          tenantId: req.tenantId,
          startDate: { gte: new Date() },
          status: { not: 'CANCELLED' }
        }
      }),
      prisma.sportsSchool.count({ where: { tenantId: req.tenantId } }),
      prisma.sportsSchool.count({ where: { tenantId: req.tenantId, isActive: true } }),
      prisma.sportsInfrastructure.count({ where: { tenantId: req.tenantId } }),
      prisma.sportsInfrastructure.count({ where: { tenantId: req.tenantId, status: 'ACTIVE' } }),
      prisma.sportsModality.count({ where: { tenantId: req.tenantId } }),
      prisma.sportsAttendance.count({ where: { tenantId: req.tenantId, status: 'PENDING' } }),
    ]);

    const stats = {
      athletes: {
        total: totalAthletes,
        active: activeAthletes,
        inactive: totalAthletes - activeAthletes,
      },
      teams: {
        total: totalTeams,
        active: activeTeams,
        inactive: totalTeams - activeTeams,
      },
      competitions: {
        total: totalCompetitions,
        upcoming: upcomingCompetitions,
      },
      schools: {
        total: totalSchools,
        active: activeSchools,
        inactive: totalSchools - activeSchools,
      },
      infrastructures: {
        total: totalInfrastructures,
        active: activeInfrastructures,
        maintenance: totalInfrastructures - activeInfrastructures,
      },
      modalities: {
        total: totalModalities,
      },
      attendances: {
        pending: pendingAttendances,
      },
    };

    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error('Error fetching sports stats:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar estatísticas de esportes',
    });
  }
}));

// ============= SPORTS ATTENDANCES =============
router.get('/sports-attendances', authenticateToken, requireManager, asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  try {
    const page = getStringParam(req.query.page) || '1';
    const limit = getStringParam(req.query.limit) || '10';
    const search = getStringParam(req.query.search);
    const status = getStringParam(req.query.status);
    const type = getStringParam(req.query.type);
    const skip = (parseInt(page) - 1) * parseInt(limit);

    if (!req.tenantId) {
      res.status(400).json({ error: 'TenantId é obrigatório' });
      return;
    }

    const where = createSafeWhereClause({
      tenantId: req.tenantId,
      search,
      status,
      type,
      searchFields: ['citizenName', 'protocol', 'description']
    });

    const prismaWhere = {
      tenantId: where.tenantId,
      ...(where.status && { status: where.status }),
      ...(where.type && { type: where.type }),
      ...(where.OR && { OR: where.OR }),
    };

    const [attendances, total] = await Promise.all([
      prisma.sportsAttendance.findMany({
        where: prismaWhere as any,
        skip,
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' },
      }),
      prisma.sportsAttendance.count({ where: prismaWhere as any }),
    ]);

    const response = {
      data: attendances,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / parseInt(limit)),
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit)),
      }
    };

    res.json(response);
  } catch (error) {
    console.error('Error fetching sports attendances:', error);
    res.status(500).json({ error: 'Erro ao buscar atendimentos esportivos' });
  }
}));

router.post('/sports-attendances', authenticateToken, requireManager, asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  try {
    const validated = sportsAttendanceSchema.parse(req.body);

    if (!req.tenantId) {
      res.status(400).json({ error: 'TenantId é obrigatório' });
      return;
    }

    const protocol = validated.protocol || await generateProtocolNumber(req.tenantId);

    const attendance = await prisma.sportsAttendance.create({
      data: {
        ...validated,
        protocol,
        tenantId: req.tenantId,
        status: validated.status || 'PENDING',
      },
    });

    res.status(201).json({
      success: true,
      data: attendance,
    });
  } catch (error) {
    console.error('Error creating sports attendance:', error);
    res.status(400).json({
      success: false,
      error: 'Erro ao criar atendimento esportivo',
    });
  }
}));

router.put('/sports-attendances/:id', authenticateToken, requireManager, asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const validated = sportsAttendanceSchema.partial().parse(req.body);

    if (!req.tenantId) {
      res.status(400).json({ error: 'TenantId é obrigatório' });
      return;
    }

    const attendance = await prisma.sportsAttendance.update({
      where: { id, tenantId: req.tenantId },
      data: validated,
    });

    res.json({
      success: true,
      data: attendance,
    });
  } catch (error) {
    console.error('Error updating sports attendance:', error);
    res.status(400).json({
      success: false,
      error: 'Erro ao atualizar atendimento esportivo',
    });
  }
}));

router.delete('/sports-attendances/:id', authenticateToken, requireManager, asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;

    if (!req.tenantId) {
      res.status(400).json({ error: 'TenantId é obrigatório' });
      return;
    }

    await prisma.sportsAttendance.delete({
      where: { id, tenantId: req.tenantId },
    });

    res.json({
      success: true,
      message: 'Atendimento esportivo removido com sucesso',
    });
  } catch (error) {
    console.error('Error deleting sports attendance:', error);
    res.status(400).json({
      success: false,
      error: 'Erro ao remover atendimento esportivo',
    });
  }
}));

// ============= ATHLETES =============
router.get('/athletes', authenticateToken, requireManager, asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  try {
    const page = getStringParam(req.query.page) || '1';
    const limit = getStringParam(req.query.limit) || '10';
    const search = getStringParam(req.query.search);
    const sport = getStringParam(req.query.sport);
    const category = getStringParam(req.query.category);
    const skip = (parseInt(page) - 1) * parseInt(limit);

    if (!req.tenantId) {
      res.status(400).json({ error: 'TenantId é obrigatório' });
      return;
    }

    const where = createSafeWhereClause({
      tenantId: req.tenantId,
      search,
      sport,
      category,
      searchFields: ['name', 'cpf', 'team']
    });

    const prismaWhere = {
      tenantId: where.tenantId,
      ...(where.sport && { sport: where.sport }),
      ...(where.category && { category: where.category }),
      ...(where.OR && { OR: where.OR }),
    };

    const [athletes, total] = await Promise.all([
      prisma.athlete.findMany({
        where: prismaWhere as any,
        skip,
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' },
      }),
      prisma.athlete.count({ where: prismaWhere as any }),
    ]);

    res.json({
      data: athletes,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / parseInt(limit)),
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit)),
      }
    });
  } catch (error) {
    console.error('Error fetching athletes:', error);
    res.status(500).json({ error: 'Erro ao buscar atletas' });
  }
}));

router.post('/athletes', authenticateToken, requireManager, asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  try {
    const validated = athleteSchema.parse(req.body);

    if (!req.tenantId) {
      res.status(400).json({ error: 'TenantId é obrigatório' });
      return;
    }

    const athlete = await prisma.athlete.create({
      data: {
        ...validated,
        birthDate: new Date(validated.birthDate),
        federationExpiry: validated.federationExpiry ? new Date(validated.federationExpiry) : null,
        tenantId: req.tenantId,
        isActive: true,
      },
    });

    res.status(201).json({
      success: true,
      data: athlete,
    });
  } catch (error) {
    console.error('Error creating athlete:', error);
    res.status(400).json({
      success: false,
      error: 'Erro ao criar atleta',
    });
  }
}));

router.put('/athletes/:id', authenticateToken, requireManager, asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const validated = athleteSchema.partial().parse(req.body);

    if (!req.tenantId) {
      res.status(400).json({ error: 'TenantId é obrigatório' });
      return;
    }

    const updateData: any = { ...validated };
    if (validated.birthDate) {
      updateData.birthDate = new Date(validated.birthDate);
    }
    if (validated.federationExpiry) {
      updateData.federationExpiry = new Date(validated.federationExpiry);
    }

    const athlete = await prisma.athlete.update({
      where: { id, tenantId: req.tenantId },
      data: updateData,
    });

    res.json({
      success: true,
      data: athlete,
    });
  } catch (error) {
    console.error('Error updating athlete:', error);
    res.status(400).json({
      success: false,
      error: 'Erro ao atualizar atleta',
    });
  }
}));

router.delete('/athletes/:id', authenticateToken, requireManager, asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;

    if (!req.tenantId) {
      res.status(400).json({ error: 'TenantId é obrigatório' });
      return;
    }

    await prisma.athlete.delete({
      where: { id, tenantId: req.tenantId },
    });

    res.json({
      success: true,
      message: 'Atleta removido com sucesso',
    });
  } catch (error) {
    console.error('Error deleting athlete:', error);
    res.status(400).json({
      success: false,
      error: 'Erro ao remover atleta',
    });
  }
}));

// ============= SPORTS TEAMS =============
router.get('/sports-teams', authenticateToken, requireManager, asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  try {
    const page = getStringParam(req.query.page) || '1';
    const limit = getStringParam(req.query.limit) || '10';
    const search = getStringParam(req.query.search);
    const sport = getStringParam(req.query.sport);
    const category = getStringParam(req.query.category);
    const skip = (parseInt(page) - 1) * parseInt(limit);

    if (!req.tenantId) {
      res.status(400).json({ error: 'TenantId é obrigatório' });
      return;
    }

    const where = createSafeWhereClause({
      tenantId: req.tenantId,
      search,
      sport,
      category,
      searchFields: ['name', 'coach']
    });

    const prismaWhere = {
      tenantId: where.tenantId,
      ...(where.sport && { sport: where.sport }),
      ...(where.category && { category: where.category }),
      ...(where.OR && { OR: where.OR }),
    };

    const [teams, total] = await Promise.all([
      prisma.sportsTeam.findMany({
        where: prismaWhere as any,
        skip,
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' },
      }),
      prisma.sportsTeam.count({ where: prismaWhere as any }),
    ]);

    res.json({
      data: teams,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / parseInt(limit)),
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit)),
      }
    });
  } catch (error) {
    console.error('Error fetching sports teams:', error);
    res.status(500).json({ error: 'Erro ao buscar equipes esportivas' });
  }
}));

router.post('/sports-teams', authenticateToken, requireManager, asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  try {
    const validated = sportsTeamSchema.parse(req.body);

    if (!req.tenantId) {
      res.status(400).json({ error: 'TenantId é obrigatório' });
      return;
    }

    const team = await prisma.sportsTeam.create({
      data: {
        ...validated,
        foundationDate: validated.foundationDate ? new Date(validated.foundationDate) : null,
        tenantId: req.tenantId,
        isActive: true,
        status: 'ACTIVE',
        currentPlayers: 0,
      },
    });

    res.status(201).json({
      success: true,
      data: team,
    });
  } catch (error) {
    console.error('Error creating sports team:', error);
    res.status(400).json({
      success: false,
      error: 'Erro ao criar equipe esportiva',
    });
  }
}));

router.put('/sports-teams/:id', authenticateToken, requireManager, asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const validated = sportsTeamSchema.partial().parse(req.body);

    if (!req.tenantId) {
      res.status(400).json({ error: 'TenantId é obrigatório' });
      return;
    }

    const updateData: any = { ...validated };
    if (validated.foundationDate) {
      updateData.foundationDate = new Date(validated.foundationDate);
    }

    const team = await prisma.sportsTeam.update({
      where: { id, tenantId: req.tenantId },
      data: updateData,
    });

    res.json({
      success: true,
      data: team,
    });
  } catch (error) {
    console.error('Error updating sports team:', error);
    res.status(400).json({
      success: false,
      error: 'Erro ao atualizar equipe esportiva',
    });
  }
}));

router.delete('/sports-teams/:id', authenticateToken, requireManager, asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;

    if (!req.tenantId) {
      res.status(400).json({ error: 'TenantId é obrigatório' });
      return;
    }

    await prisma.sportsTeam.delete({
      where: { id, tenantId: req.tenantId },
    });

    res.json({
      success: true,
      message: 'Equipe esportiva removida com sucesso',
    });
  } catch (error) {
    console.error('Error deleting sports team:', error);
    res.status(400).json({
      success: false,
      error: 'Erro ao remover equipe esportiva',
    });
  }
}));

// ============= SPORTS MODALITIES =============
router.get('/sports-modalities', authenticateToken, requireManager, asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  try {
    const page = getStringParam(req.query.page) || '1';
    const limit = getStringParam(req.query.limit) || '10';
    const search = getStringParam(req.query.search);
    const category = getStringParam(req.query.category);
    const skip = (parseInt(page) - 1) * parseInt(limit);

    if (!req.tenantId) {
      res.status(400).json({ error: 'TenantId é obrigatório' });
      return;
    }

    const where = createSafeWhereClause({
      tenantId: req.tenantId,
      search,
      category,
      searchFields: ['name', 'description']
    });

    const prismaWhere = {
      tenantId: where.tenantId,
      ...(where.category && { category: where.category }),
      ...(where.OR && { OR: where.OR }),
    };

    const [modalities, total] = await Promise.all([
      prisma.sportsModality.findMany({
        where: prismaWhere as any,
        skip,
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' },
      }),
      prisma.sportsModality.count({ where: prismaWhere as any }),
    ]);

    res.json({
      data: modalities,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / parseInt(limit)),
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit)),
      }
    });
  } catch (error) {
    console.error('Error fetching sports modalities:', error);
    res.status(500).json({ error: 'Erro ao buscar modalidades esportivas' });
  }
}));

router.post('/sports-modalities', authenticateToken, requireManager, asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  try {
    const validated = sportsModalitySchema.parse(req.body);

    if (!req.tenantId) {
      res.status(400).json({ error: 'TenantId é obrigatório' });
      return;
    }

    const modality = await prisma.sportsModality.create({
      data: {
        ...validated,
        tenantId: req.tenantId,
        isActive: true,
      },
    });

    res.status(201).json({
      success: true,
      data: modality,
    });
  } catch (error) {
    console.error('Error creating sports modality:', error);
    res.status(400).json({
      success: false,
      error: 'Erro ao criar modalidade esportiva',
    });
  }
}));

router.put('/sports-modalities/:id', authenticateToken, requireManager, asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const validated = sportsModalitySchema.partial().parse(req.body);

    if (!req.tenantId) {
      res.status(400).json({ error: 'TenantId é obrigatório' });
      return;
    }

    const modality = await prisma.sportsModality.update({
      where: { id, tenantId: req.tenantId },
      data: validated,
    });

    res.json({
      success: true,
      data: modality,
    });
  } catch (error) {
    console.error('Error updating sports modality:', error);
    res.status(400).json({
      success: false,
      error: 'Erro ao atualizar modalidade esportiva',
    });
  }
}));

router.delete('/sports-modalities/:id', authenticateToken, requireManager, asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;

    if (!req.tenantId) {
      res.status(400).json({ error: 'TenantId é obrigatório' });
      return;
    }

    await prisma.sportsModality.delete({
      where: { id, tenantId: req.tenantId },
    });

    res.json({
      success: true,
      message: 'Modalidade esportiva removida com sucesso',
    });
  } catch (error) {
    console.error('Error deleting sports modality:', error);
    res.status(400).json({
      success: false,
      error: 'Erro ao remover modalidade esportiva',
    });
  }
}));

// ============= SPORTS SCHOOLS =============
router.get('/sports-schools', authenticateToken, requireManager, asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  try {
    const page = getStringParam(req.query.page) || '1';
    const limit = getStringParam(req.query.limit) || '10';
    const search = getStringParam(req.query.search);
    const sport = getStringParam(req.query.sport);
    const status = getStringParam(req.query.status);
    const skip = (parseInt(page) - 1) * parseInt(limit);

    if (!req.tenantId) {
      res.status(400).json({ error: 'TenantId é obrigatório' });
      return;
    }

    const where = createSafeWhereClause({
      tenantId: req.tenantId,
      search,
      sport,
      status,
      searchFields: ['name', 'instructor', 'location']
    });

    const prismaWhere = {
      tenantId: where.tenantId,
      ...(where.sport && { sport: where.sport }),
      ...(where.status && { status: where.status }),
      ...(where.OR && { OR: where.OR }),
    };

    const [schools, total] = await Promise.all([
      prisma.sportsSchool.findMany({
        where: prismaWhere as any,
        skip,
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' },
      }),
      prisma.sportsSchool.count({ where: prismaWhere as any }),
    ]);

    res.json({
      data: schools,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / parseInt(limit)),
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit)),
      }
    });
  } catch (error) {
    console.error('Error fetching sports schools:', error);
    res.status(500).json({ error: 'Erro ao buscar escolinhas esportivas' });
  }
}));

router.post('/sports-schools', authenticateToken, requireManager, asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  try {
    const validated = sportsSchoolSchema.parse(req.body);

    if (!req.tenantId) {
      res.status(400).json({ error: 'TenantId é obrigatório' });
      return;
    }

    const school = await prisma.sportsSchool.create({
      data: {
        ...validated,
        startDate: new Date(validated.startDate),
        endDate: validated.endDate ? new Date(validated.endDate) : null,
        tenantId: req.tenantId,
        isActive: true,
        status: 'ACTIVE',
        currentStudents: 0,
      },
    });

    res.status(201).json({
      success: true,
      data: school,
    });
  } catch (error) {
    console.error('Error creating sports school:', error);
    res.status(400).json({
      success: false,
      error: 'Erro ao criar escolinha esportiva',
    });
  }
}));

router.put('/sports-schools/:id', authenticateToken, requireManager, asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const validated = sportsSchoolSchema.partial().parse(req.body);

    if (!req.tenantId) {
      res.status(400).json({ error: 'TenantId é obrigatório' });
      return;
    }

    const updateData: any = { ...validated };
    if (validated.startDate) {
      updateData.startDate = new Date(validated.startDate);
    }
    if (validated.endDate) {
      updateData.endDate = new Date(validated.endDate);
    }

    const school = await prisma.sportsSchool.update({
      where: { id, tenantId: req.tenantId },
      data: updateData,
    });

    res.json({
      success: true,
      data: school,
    });
  } catch (error) {
    console.error('Error updating sports school:', error);
    res.status(400).json({
      success: false,
      error: 'Erro ao atualizar escolinha esportiva',
    });
  }
}));

router.delete('/sports-schools/:id', authenticateToken, requireManager, asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;

    if (!req.tenantId) {
      res.status(400).json({ error: 'TenantId é obrigatório' });
      return;
    }

    await prisma.sportsSchool.delete({
      where: { id, tenantId: req.tenantId },
    });

    res.json({
      success: true,
      message: 'Escolinha esportiva removida com sucesso',
    });
  } catch (error) {
    console.error('Error deleting sports school:', error);
    res.status(400).json({
      success: false,
      error: 'Erro ao remover escolinha esportiva',
    });
  }
}));

// ============= SPORTS INFRASTRUCTURES =============
router.get('/sports-infrastructures', authenticateToken, requireManager, asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  try {
    const page = getStringParam(req.query.page) || '1';
    const limit = getStringParam(req.query.limit) || '10';
    const search = getStringParam(req.query.search);
    const type = getStringParam(req.query.type);
    const status = getStringParam(req.query.status);
    const skip = (parseInt(page) - 1) * parseInt(limit);

    if (!req.tenantId) {
      res.status(400).json({ error: 'TenantId é obrigatório' });
      return;
    }

    const where = createSafeWhereClause({
      tenantId: req.tenantId,
      search,
      type,
      status,
      searchFields: ['name', 'address', 'manager']
    });

    const prismaWhere = {
      tenantId: where.tenantId,
      ...(where.type && { type: where.type }),
      ...(where.status && { status: where.status }),
      ...(where.OR && { OR: where.OR }),
    };

    const [infrastructures, total] = await Promise.all([
      prisma.sportsInfrastructure.findMany({
        where: prismaWhere as any,
        skip,
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' },
      }),
      prisma.sportsInfrastructure.count({ where: prismaWhere as any }),
    ]);

    res.json({
      data: infrastructures,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / parseInt(limit)),
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit)),
      }
    });
  } catch (error) {
    console.error('Error fetching sports infrastructures:', error);
    res.status(500).json({ error: 'Erro ao buscar infraestruturas esportivas' });
  }
}));

router.post('/sports-infrastructures', authenticateToken, requireManager, asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  try {
    const validated = sportsInfrastructureSchema.parse(req.body);

    if (!req.tenantId) {
      res.status(400).json({ error: 'TenantId é obrigatório' });
      return;
    }

    const infrastructure = await prisma.sportsInfrastructure.create({
      data: {
        ...validated,
        tenantId: req.tenantId,
        status: validated.status || 'ACTIVE',
        isPublic: validated.isPublic !== false,
      },
    });

    res.status(201).json({
      success: true,
      data: infrastructure,
    });
  } catch (error) {
    console.error('Error creating sports infrastructure:', error);
    res.status(400).json({
      success: false,
      error: 'Erro ao criar infraestrutura esportiva',
    });
  }
}));

router.put('/sports-infrastructures/:id', authenticateToken, requireManager, asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const validated = sportsInfrastructureSchema.partial().parse(req.body);

    if (!req.tenantId) {
      res.status(400).json({ error: 'TenantId é obrigatório' });
      return;
    }

    const infrastructure = await prisma.sportsInfrastructure.update({
      where: { id, tenantId: req.tenantId },
      data: validated,
    });

    res.json({
      success: true,
      data: infrastructure,
    });
  } catch (error) {
    console.error('Error updating sports infrastructure:', error);
    res.status(400).json({
      success: false,
      error: 'Erro ao atualizar infraestrutura esportiva',
    });
  }
}));

router.delete('/sports-infrastructures/:id', authenticateToken, requireManager, asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;

    if (!req.tenantId) {
      res.status(400).json({ error: 'TenantId é obrigatório' });
      return;
    }

    await prisma.sportsInfrastructure.delete({
      where: { id, tenantId: req.tenantId },
    });

    res.json({
      success: true,
      message: 'Infraestrutura esportiva removida com sucesso',
    });
  } catch (error) {
    console.error('Error deleting sports infrastructure:', error);
    res.status(400).json({
      success: false,
      error: 'Erro ao remover infraestrutura esportiva',
    });
  }
}));

// ============= COMPETITIONS =============
router.get('/competitions', authenticateToken, requireManager, asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  try {
    const page = getStringParam(req.query.page) || '1';
    const limit = getStringParam(req.query.limit) || '10';
    const search = getStringParam(req.query.search);
    const sport = getStringParam(req.query.sport);
    const status = getStringParam(req.query.status);
    const skip = (parseInt(page) - 1) * parseInt(limit);

    if (!req.tenantId) {
      res.status(400).json({ error: 'TenantId é obrigatório' });
      return;
    }

    const where = createSafeWhereClause({
      tenantId: req.tenantId,
      search,
      sport,
      status,
      searchFields: ['name', 'organizer', 'location']
    });

    const prismaWhere = {
      tenantId: where.tenantId,
      ...(where.sport && { sport: where.sport }),
      ...(where.status && { status: where.status }),
      ...(where.OR && { OR: where.OR }),
    };

    const [competitions, total] = await Promise.all([
      prisma.competition.findMany({
        where: prismaWhere as any,
        skip,
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' },
      }),
      prisma.competition.count({ where: prismaWhere as any }),
    ]);

    res.json({
      data: competitions,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / parseInt(limit)),
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit)),
      }
    });
  } catch (error) {
    console.error('Error fetching competitions:', error);
    res.status(500).json({ error: 'Erro ao buscar competições' });
  }
}));

router.post('/competitions', authenticateToken, requireManager, asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  try {
    const validated = competitionSchema.parse(req.body);

    if (!req.tenantId) {
      res.status(400).json({ error: 'TenantId é obrigatório' });
      return;
    }

    const competition = await prisma.competition.create({
      data: {
        ...validated,
        startDate: new Date(validated.startDate),
        endDate: new Date(validated.endDate),
        tenantId: req.tenantId,
        status: 'PLANNED',
        registeredTeams: 0,
      },
    });

    res.status(201).json({
      success: true,
      data: competition,
    });
  } catch (error) {
    console.error('Error creating competition:', error);
    res.status(400).json({
      success: false,
      error: 'Erro ao criar competição',
    });
  }
}));

router.put('/competitions/:id', authenticateToken, requireManager, asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const validated = competitionSchema.partial().parse(req.body);

    if (!req.tenantId) {
      res.status(400).json({ error: 'TenantId é obrigatório' });
      return;
    }

    const updateData: any = { ...validated };
    if (validated.startDate) {
      updateData.startDate = new Date(validated.startDate);
    }
    if (validated.endDate) {
      updateData.endDate = new Date(validated.endDate);
    }

    const competition = await prisma.competition.update({
      where: { id, tenantId: req.tenantId },
      data: updateData,
    });

    res.json({
      success: true,
      data: competition,
    });
  } catch (error) {
    console.error('Error updating competition:', error);
    res.status(400).json({
      success: false,
      error: 'Erro ao atualizar competição',
    });
  }
}));

router.delete('/competitions/:id', authenticateToken, requireManager, asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;

    if (!req.tenantId) {
      res.status(400).json({ error: 'TenantId é obrigatório' });
      return;
    }

    await prisma.competition.delete({
      where: { id, tenantId: req.tenantId },
    });

    res.json({
      success: true,
      message: 'Competição removida com sucesso',
    });
  } catch (error) {
    console.error('Error deleting competition:', error);
    res.status(400).json({
      success: false,
      error: 'Erro ao remover competição',
    });
  }
}));

export default router;
