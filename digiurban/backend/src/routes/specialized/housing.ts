import { Router, Response, NextFunction, Request, RequestHandler } from 'express';
import { Prisma } from '@prisma/client';
import { prisma } from '../../lib/prisma';
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

interface AdminAuthenticatedRequest {
  user: User;
  tenant: Tenant;
  query: Request['query'];
  params: Request['params'];
  body: Request['body'];
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

interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

interface StatsItem {
  status?: string;
  priority?: string;
  type?: string;
  _count: number;
}

// Interfaces específicas para Prisma Where Input
interface HousingProgramWhereInput {
  tenantId: string;
  type?: string;
  isActive?: boolean;
}

interface HousingApplicationWhereInput {
  tenantId: string;
  programId?: string;
  status?: string;
  applicantName?: {
    contains: string;
    mode: 'insensitive';
  };
}

interface HousingUnitWhereInput {
  tenantId: string;
  unitType?: string;
  neighborhood?: {
    contains: string;
    mode: 'insensitive';
  };
  isOccupied?: boolean;
}

interface LandRegularizationWhereInput {
  tenantId: string;
  status?: string;
  propertyAddress?: {
    contains: string;
    mode: 'insensitive';
  };
  applicantName?: {
    contains: string;
    mode: 'insensitive';
  };
}

interface HousingAttendanceWhereInput {
  tenantId: string;
  citizenId?: string;
  serviceType?: string;
  programId?: string;
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

function createPaginatedResponse<T>(data: T[], page: number, limit: number, total: number): PaginatedResponse<T> {
  return {
    data,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  };
}

function handleAsyncRoute(fn: (req: AdminAuthenticatedRequest, res: Response) => Promise<void | Response>): RequestHandler {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req as AdminAuthenticatedRequest, res)).catch(next);
  };
}

// ====================== MIDDLEWARE FUNCTIONS ======================

const router = Router();

// Middleware global
router.use(tenantMiddleware);
router.use(adminAuthMiddleware);

// ====================== SCHEMAS DE VALIDAÇÃO ======================

const housingProgramSchema = z.object({
  name: z.string().min(2, 'Nome do programa é obrigatório'),
  description: z.string().min(10, 'Descrição é obrigatória'),
  type: z.enum(['casa_propria', 'aluguel_social', 'regularizacao', 'melhorias', 'loteamento']),
  targetIncome: z.object({
    minSalaryMultiplier: z.number().min(0),
    maxSalaryMultiplier: z.number().min(0.1),
  }),
  eligibilityCriteria: z.array(z.string()),
  benefits: z.array(z.string()),
  requirements: z.array(z.string()),
  availableUnits: z.number().int().min(0),
  totalUnits: z.number().int().min(1),
  startDate: z.string().transform(str => new Date(str)),
  endDate: z
    .string()
    .transform(str => new Date(str))
    .optional(),
  responsible: z.string().min(2, 'Responsável é obrigatório'),
  contact: z.object({
    phone: z.string(),
    email: z.string().email(),
  }),
  financingOptions: z
    .array(
      z.object({
        type: z.string(),
        description: z.string(),
        interestRate: z.number().min(0).optional(),
        maxFinancingPercentage: z.number().min(0).max(100).optional(),
      })
    )
    .optional(),
  isActive: z.boolean().default(true),
});

const housingApplicationSchema = z.object({
  protocol: z.string().min(1, 'Protocolo é obrigatório'),
  applicantName: z.string().min(2, 'Nome é obrigatório'),
  applicantCpf: z.string().min(11, 'CPF é obrigatório'),
  contact: z.object({
    phone: z.string().min(10, 'Telefone é obrigatório'),
    email: z.string().email().optional(),
  }),
  address: z.string().min(5, 'Endereço é obrigatório'),
  familyIncome: z.number().min(0, 'Renda familiar é obrigatória'),
  familySize: z.number().int().min(1, 'Tamanho da família é obrigatório'),
  housingType: z.enum(['casa', 'apartamento', 'lote']),
  programType: z.enum(['casa_propria', 'regularizacao', 'melhorias', 'aluguel_social']),
  propertyValue: z.number().min(0).optional(),
  hasProperty: z.boolean().default(false),
  isFirstHome: z.boolean().default(true),
  priorityScore: z.number().int().min(0).max(100).default(0),
  documents: z.array(z.string()).optional(),
  observations: z.string().optional(),
  status: z
    .enum(['UNDER_ANALYSIS', 'APPROVED', 'REJECTED', 'WAITING_DOCS', 'CANCELLED'])
    .default('UNDER_ANALYSIS'),
});

const housingUnitSchema = z.object({
  unitCode: z.string().min(1, 'Código da unidade é obrigatório'),
  unitType: z.enum(['casa', 'apartamento', 'lote']),
  address: z.string().min(5, 'Endereço é obrigatório'),
  coordinates: z
    .object({
      lat: z.number(),
      lng: z.number(),
    })
    .optional(),
  neighborhood: z.string().min(2, 'Bairro é obrigatório'),
  area: z.number().min(20, 'Área é obrigatória'),
  bedrooms: z.number().int().min(0),
  bathrooms: z.number().int().min(1),
  constructionYear: z.number().int().min(1900).optional(),
  propertyValue: z.number().min(0).optional(),
  monthlyRent: z.number().min(0).optional(),
  isOccupied: z.boolean().default(false),
  occupantName: z.string().optional(),
  occupantCpf: z.string().optional(),
  occupancyDate: z.string().transform(str => new Date(str)).optional(),
  contractType: z.enum(['compra', 'aluguel', 'cessao']).optional(),
  contractEnd: z.string().transform(str => new Date(str)).optional(),
  conditions: z.array(z.string()).optional(),
});

const landRegularizationSchema = z.object({
  protocol: z.string().min(1, 'Protocolo é obrigatório'),
  applicantName: z.string().min(2, 'Nome é obrigatório'),
  applicantCpf: z.string().min(11, 'CPF é obrigatório'),
  contact: z.object({
    phone: z.string().min(10, 'Telefone é obrigatório'),
    email: z.string().email().optional(),
  }),
  propertyAddress: z.string().min(5, 'Endereço da propriedade é obrigatório'),
  coordinates: z
    .object({
      lat: z.number(),
      lng: z.number(),
    })
    .optional(),
  propertyArea: z.number().min(0.1, 'Área da propriedade é obrigatória'),
  occupationDate: z.string().transform(str => new Date(str)).optional(),
  occupationType: z.enum(['posse', 'propriedade', 'invasao', 'heranca']),
  hasBuilding: z.boolean().default(false),
  buildingArea: z.number().min(0).optional(),
  landValue: z.number().min(0).optional(),
  neighbors: z.array(z.string()).optional(),
  accessRoads: z.array(z.string()).optional(),
  utilities: z.array(z.string()).optional(),
  legalDocuments: z.array(z.string()).optional(),
  technicalSurvey: z.object({ }).optional(),
  environmentalAnalysis: z.object({ }).optional(),
  status: z
    .enum(['PENDING', 'UNDER_ANALYSIS', 'APPROVED', 'REJECTED', 'SUSPENDED'])
    .default('PENDING'),
});

const housingAttendanceSchema = z.object({
  citizenId: z.string().min(1, 'Cidadão é obrigatório'),
  serviceType: z.enum([
    'inscricao_programa',
    'consulta_andamento',
    'regularizacao_fundiaria',
    'informacoes',
    'reclamacao',
  ]),
  description: z.string().min(10, 'Descrição é obrigatória'),
  programId: z.string().optional(),
  documents: z.array(z.string()).optional(),
  resolution: z.string().optional(),
  followUpNeeded: z.boolean().default(false),
  followUpDate: z
    .string()
    .transform(str => new Date(str))
    .optional(),
});

// ====================== PROGRAMAS HABITACIONAIS ======================

// GET /api/specialized/housing/programs
router.get('/programs', requirePermission('housing:read'), handleAsyncRoute(async (req, res) => {
  const typeParam = getStringParam(req.query.type);
  const isActiveParam = getStringParam(req.query.isActive);

  const where: HousingProgramWhereInput = { tenantId: req.tenant.id };
  if (typeParam) where.type = typeParam;
  if (isActiveParam !== '') where.isActive = isActiveParam === 'true';

  const programs = await prisma.housingProgram.findMany({
    where,
    include: {
      _count: {
        select: {
          registrations: true,
        },
      },
    },
    orderBy: { name: 'asc' },
  });

  return res.json(createSuccessResponse(programs, 'Programas habitacionais listados com sucesso'));
}));

// POST /api/specialized/housing/programs
router.post('/programs', requirePermission('housing:write'), handleAsyncRoute(async (req, res) => {
  try {
    const validatedData = housingProgramSchema.parse(req.body);

    const program = await prisma.housingProgram.create({
      data: {
        ...validatedData,
        tenantId: req.tenant.id,
        targetIncome: typeof validatedData.targetIncome === 'string' ? validatedData.targetIncome : JSON.stringify(validatedData.targetIncome),
        eligibilityCriteria: validatedData.eligibilityCriteria as Prisma.InputJsonValue,
        benefits: validatedData.benefits as Prisma.InputJsonValue,
        requirements: validatedData.requirements as Prisma.InputJsonValue,
        contact: validatedData.contact as Prisma.InputJsonValue,
        financingOptions: validatedData.financingOptions as Prisma.InputJsonValue,
      },
    });

    return res.status(201).json(createSuccessResponse(program, 'Programa habitacional criado com sucesso'));
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json(createErrorResponse('VALIDATION_ERROR', 'Dados inválidos', error.issues));
    }
    console.error('Erro ao criar programa habitacional:', error);
    return res.status(500).json(createErrorResponse('INTERNAL_ERROR', 'Erro interno do servidor'));
  }
}));

// ====================== INSCRIÇÕES HABITACIONAIS ======================

// GET /api/specialized/housing/applications
router.get('/applications', requirePermission('housing:read'), handleAsyncRoute(async (req, res) => {
  const programId = getStringParam(req.query.programId);
  const status = getStringParam(req.query.status);
  const applicantName = getStringParam(req.query.applicantName);
  const page = getNumberParam(req.query.page) || 1;
  const limit = getNumberParam(req.query.limit) || 20;

  const skip = (page - 1) * limit;
  const where: HousingApplicationWhereInput = { tenantId: req.tenant.id };

  if (programId) where.programId = programId;
  if (status) where.status = status;
  if (applicantName) {
    where.applicantName = { contains: applicantName, mode: 'insensitive' };
  }

  const [applications, total] = await Promise.all([
    prisma.housingApplication.findMany({
      where,
      orderBy: { submissionDate: 'desc' },
      skip,
      take: limit,
    }),
    prisma.housingApplication.count({ where }),
  ]);

  return res.json(createSuccessResponse(createPaginatedResponse(applications, page, limit, total), 'Inscrições listadas com sucesso'));
}));

// POST /api/specialized/housing/applications
router.post('/applications', requirePermission('housing:write'), handleAsyncRoute(async (req, res) => {
  try {
    const validatedData = housingApplicationSchema.parse(req.body);

    // Verificar se já existe inscrição para o mesmo programa
    const existingApplication = await prisma.housingApplication.findFirst({
      where: {
        protocol: validatedData.protocol,
        tenantId: req.tenant.id,
      },
    });

    if (existingApplication) {
      return res.status(409).json(createErrorResponse('DUPLICATE_PROTOCOL', 'Já existe uma inscrição com este protocolo'));
    }

    const application = await prisma.housingApplication.create({
      data: {
        ...validatedData,
        tenantId: req.tenant.id,
        contact: validatedData.contact as Prisma.InputJsonValue,
        documents: validatedData.documents ? (JSON.stringify(validatedData.documents) as Prisma.InputJsonValue) : Prisma.JsonNull,
      },
      select: {
        id: true,
        protocol: true,
        applicantName: true,
        applicantCpf: true,
        contact: true,
        address: true,
        familyIncome: true,
        familySize: true,
        housingType: true,
        programType: true,
        status: true,
        applicationDate: true,
        observations: true,
      },
    });

    return res.status(201).json(createSuccessResponse(application, 'Inscrição submetida com sucesso'));
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json(createErrorResponse('VALIDATION_ERROR', 'Dados inválidos', error.issues));
    }
    console.error('Erro ao submeter inscrição:', error);
    return res.status(500).json(createErrorResponse('INTERNAL_ERROR', 'Erro interno do servidor'));
  }
}));

// ====================== UNIDADES HABITACIONAIS ======================

// GET /api/specialized/housing/units
router.get('/units', requirePermission('housing:read'), handleAsyncRoute(async (req, res) => {
  const unitType = getStringParam(req.query.unitType);
  const isOccupied = getStringParam(req.query.isOccupied);
  const neighborhood = getStringParam(req.query.neighborhood);
  const page = getNumberParam(req.query.page) || 1;
  const limit = getNumberParam(req.query.limit) || 20;

  const skip = (page - 1) * limit;
  const where: HousingUnitWhereInput = { tenantId: req.tenant.id };

  if (unitType) where.unitType = unitType;
  if (isOccupied !== '') where.isOccupied = isOccupied === 'true';
  if (neighborhood) {
    where.neighborhood = {
      contains: neighborhood,
      mode: 'insensitive',
    };
  }

  const [units, total] = await Promise.all([
    prisma.housingUnit.findMany({
      where,
      orderBy: { unitCode: 'asc' },
      skip,
      take: limit,
    }),
    prisma.housingUnit.count({ where }),
  ]);

  return res.json(createSuccessResponse(createPaginatedResponse(units, page, limit, total), 'Unidades habitacionais listadas com sucesso'));
}));

// POST /api/specialized/housing/units
router.post('/units', requirePermission('housing:write'), handleAsyncRoute(async (req, res) => {
  try {
    const validatedData = housingUnitSchema.parse(req.body);

    // Verificar se já existe unidade com mesmo código
    const existingUnit = await prisma.housingUnit.findFirst({
      where: {
        unitCode: validatedData.unitCode,
        tenantId: req.tenant.id,
      },
    });

    if (existingUnit) {
      return res.status(409).json(createErrorResponse('DUPLICATE_UNIT', 'Já existe uma unidade com este código no programa'));
    }

    const unit = await prisma.housingUnit.create({
      data: {
        ...validatedData,
        tenantId: req.tenant.id,
        coordinates: validatedData.coordinates as Prisma.InputJsonValue,
        conditions: validatedData.conditions ? (JSON.stringify(validatedData.conditions) as Prisma.InputJsonValue) : undefined,
      },
      select: {
        id: true,
        unitCode: true,
        unitType: true,
        address: true,
        neighborhood: true,
        area: true,
        bedrooms: true,
        bathrooms: true,
        propertyValue: true,
        monthlyRent: true,
        isOccupied: true,
        occupantName: true,
        contractType: true,
      },
    });

    return res.status(201).json(createSuccessResponse(unit, 'Unidade habitacional criada com sucesso'));
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json(createErrorResponse('VALIDATION_ERROR', 'Dados inválidos', error.issues));
    }
    console.error('Erro ao criar unidade habitacional:', error);
    return res.status(500).json(createErrorResponse('INTERNAL_ERROR', 'Erro interno do servidor'));
  }
}));

// ====================== REGULARIZAÇÃO FUNDIÁRIA ======================

// GET /api/specialized/housing/land-regularization
router.get('/land-regularization', requirePermission('housing:read'), handleAsyncRoute(async (req, res) => {
  const status = getStringParam(req.query.status);
  const propertyAddress = getStringParam(req.query.propertyAddress);
  const applicantName = getStringParam(req.query.applicantName);
  const page = getNumberParam(req.query.page) || 1;
  const limit = getNumberParam(req.query.limit) || 20;

  const skip = (page - 1) * limit;
  const where: LandRegularizationWhereInput = { tenantId: req.tenant.id };

  if (status) where.status = status;
  if (propertyAddress) {
    where.propertyAddress = {
      contains: propertyAddress,
      mode: 'insensitive',
    };
  }
  if (applicantName) {
    where.applicantName = { contains: applicantName, mode: 'insensitive' };
  }

  const [regularizations, total] = await Promise.all([
    prisma.landRegularization.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.landRegularization.count({ where }),
  ]);

  return res.json(createSuccessResponse(createPaginatedResponse(regularizations, page, limit, total), 'Regularizações fundiárias listadas com sucesso'));
}));

// POST /api/specialized/housing/land-regularization
router.post('/land-regularization', requirePermission('housing:write'), handleAsyncRoute(async (req, res) => {
  try {
    const validatedData = landRegularizationSchema.parse(req.body);

    const regularization = await prisma.landRegularization.create({
      data: {
        ...validatedData,
        tenantId: req.tenant.id,
        contact: validatedData.contact as Prisma.InputJsonValue,
        coordinates: validatedData.coordinates as Prisma.InputJsonValue,
        neighbors: validatedData.neighbors as Prisma.InputJsonValue,
        accessRoads: validatedData.accessRoads as Prisma.InputJsonValue,
        utilities: validatedData.utilities as Prisma.InputJsonValue,
        legalDocuments: validatedData.legalDocuments as Prisma.InputJsonValue,
        technicalSurvey: validatedData.technicalSurvey as Prisma.InputJsonValue,
        environmentalAnalysis: validatedData.environmentalAnalysis as Prisma.InputJsonValue,
      },
    });

    return res.status(201).json(createSuccessResponse(regularization, 'Regularização fundiária protocolada com sucesso'));
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json(createErrorResponse('VALIDATION_ERROR', 'Dados inválidos', error.issues));
    }
    console.error('Erro ao protocolar regularização fundiária:', error);
    return res.status(500).json(createErrorResponse('INTERNAL_ERROR', 'Erro interno do servidor'));
  }
}));

// ====================== ATENDIMENTOS DA SECRETARIA ======================

// GET /api/specialized/housing/attendances
router.get('/attendances', requirePermission('housing:read'), handleAsyncRoute(async (req, res) => {
  const citizenId = getStringParam(req.query.citizenId);
  const serviceType = getStringParam(req.query.serviceType);
  const programId = getStringParam(req.query.programId);
  const page = getNumberParam(req.query.page) || 1;
  const limit = getNumberParam(req.query.limit) || 20;

  const skip = (page - 1) * limit;
  const where: HousingAttendanceWhereInput = { tenantId: req.tenant.id };

  if (citizenId) where.citizenId = citizenId;
  if (serviceType) where.serviceType = serviceType;
  if (programId) where.programId = programId;

  const [attendances, total] = await Promise.all([
    prisma.housingAttendance.findMany({
      where,
      include: {
        citizen: { select: { id: true, name: true, phone: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.housingAttendance.count({ where }),
  ]);

  return res.json(createSuccessResponse(createPaginatedResponse(attendances, page, limit, total), 'Atendimentos listados com sucesso'));
}));

// POST /api/specialized/housing/attendances
router.post('/attendances', requirePermission('housing:write'), handleAsyncRoute(async (req, res) => {
  try {
    const validatedData = housingAttendanceSchema.parse(req.body);

    const attendance = await prisma.housingAttendance.create({
      data: {
        ...validatedData,
        tenantId: req.tenant.id,
        documents: validatedData.documents ? JSON.stringify(validatedData.documents) : null,
      } as unknown as Prisma.HousingAttendanceUncheckedCreateInput,
      include: {
        citizen: { select: { id: true, name: true, phone: true, email: true } },
      },
    });

    return res.status(201).json(createSuccessResponse(attendance, 'Atendimento registrado com sucesso'));
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json(createErrorResponse('VALIDATION_ERROR', 'Dados inválidos', error.issues));
    }
    console.error('Erro ao registrar atendimento:', error);
    return res.status(500).json(createErrorResponse('INTERNAL_ERROR', 'Erro interno do servidor'));
  }
}));

// ====================== DASHBOARD E MÉTRICAS ======================

// GET /api/specialized/housing/dashboard
router.get('/dashboard', requirePermission('housing:read'), handleAsyncRoute(async (req, res) => {
  const today = new Date();
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  const [
    activePrograms,
    totalApplications,
    availableUnits,
    approvedApplications,
    pendingRegularizations,
    attendancesMonth,
    applicationsByProgram,
    unitsByStatus,
  ] = await Promise.all([
    // Programas ativos
    prisma.housingProgram.count({
      where: { tenantId: req.tenant.id, isActive: true },
    }),

    // Total de inscrições
    prisma.housingApplication.count({
      where: { tenantId: req.tenant.id },
    }),

    // Unidades disponíveis
    prisma.housingUnit.count({
      where: {
        tenantId: req.tenant.id,
        status: 'disponivel',
      },
    }),

    // Inscrições aprovadas
    prisma.housingApplication.count({
      where: {
        tenantId: req.tenant.id,
        status: 'aprovada',
      },
    }),

    // Regularizações pendentes
    prisma.landRegularization.count({
      where: {
        tenantId: req.tenant.id,
        status: { in: ['protocolada', 'em_analise', 'vistoria_agendada'] },
      },
    }),

    // Atendimentos este mês
    prisma.housingAttendance.count({
      where: {
        tenantId: req.tenant.id,
        createdAt: { gte: startOfMonth },
      },
    }),

    // Inscrições por programa
    prisma.housingApplication.groupBy({
      by: ['program'],
      where: { tenantId: req.tenant.id },
      _count: true,
    }),

    // Unidades por status
    prisma.housingUnit.groupBy({
      by: ['status'],
      where: { tenantId: req.tenant.id },
      _count: true,
    }),
  ]);

  const unitStatusStats = unitsByStatus.reduce(
    (acc: Record<string, number>, item: StatsItem) => {
      acc[item.status || 'unknown'] = item._count;
      return acc;
    },
    {} as Record<string, number>
  );

  const dashboardData = {
    activePrograms,
    totalApplications,
    availableUnits,
    approvedApplications,
    pendingRegularizations,
    attendancesMonth,
    applicationsByProgram: applicationsByProgram.length,
    unitStatusStats,
  };

  return res.json(createSuccessResponse(dashboardData, 'Dashboard carregado com sucesso'));
}));

export default router;
