// ============================================================================
// ENVIRONMENT.TS - ISOLAMENTO PROFISSIONAL COMPLETO
// ============================================================================

import { Router, Response, NextFunction, Request, RequestHandler } from 'express';
import { z } from 'zod';
import { Prisma } from '@prisma/client';
import { prisma } from '../../lib/prisma';
import { tenantMiddleware } from '../../middleware/tenant';
import { adminAuthMiddleware, requirePermission } from '../../middleware/admin-auth';

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

interface AuthenticatedRequest {
  user?: User;
  tenant?: Tenant;
  tenantId?: string;
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

// ====================== INTERFACES ESPECÍFICAS ======================

interface EnvironmentalLicenseWhereInput {
  tenantId: string;
  status?: string | { in: string[] } | undefined;
  type?: string | undefined;
  applicantName?: { contains: string; mode?: 'insensitive' } | undefined;
  isActive?: boolean;
}

interface EnvironmentalComplaintWhereInput {
  tenantId: string;
  status?: string | { in: string[] } | undefined;
  type?: string | undefined;
  severity?: string | undefined;
  isActive?: boolean;
}

interface EnvironmentalInspectionWhereInput {
  tenantId: string;
  status?: string | { in: string[] } | undefined;
  category?: string | undefined;
  isActive?: boolean;
}

interface EnvironmentalProtectedAreaWhereInput {
  tenantId: string;
  type?: string | undefined;
  category?: string | undefined;
  status?: string | undefined;
  isActive?: boolean;
}

interface EnvironmentalProgramWhereInput {
  tenantId: string;
  type?: string | undefined;
  isActive?: boolean;
}

interface EnvironmentalAttendanceWhereInput {
  tenantId: string;
  citizenId?: string | undefined;
  serviceType?: string | undefined;
  isActive?: boolean;
}

interface GroupByResult {
  _count: Record<string, number>;
  [key: string]: unknown;
}

// ====================== HELPER FUNCTIONS ======================

function getStringParam(param: string | string[] | unknown): string {
  if (Array.isArray(param)) return param[0] || '';
  if (typeof param === 'string') return param;
  return '';
}

function getNumberParam(param: string | string[] | undefined): number {
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

function isAuthenticatedRequest(req: AuthenticatedRequest): req is AuthenticatedRequest & {
  user: User;
  tenant: Tenant;
} {
  return !!(req.user && req.tenant);
}

function handleAsyncRoute(fn: (req: any, res: Response) => Promise<void>): RequestHandler {
  return (req, res, next) => {
    Promise.resolve(fn(req, res)).catch(next);
  };
}

const router = Router();

// ====================== ROUTER SETUP ======================\n\n// Middleware para verificar tenant em todas as rotas
router.use(tenantMiddleware);
router.use(adminAuthMiddleware);

// ====================== SCHEMAS DE VALIDAÇÃO ======================

const environmentalLicenseSchema = z.object({
  applicantName: z.string().min(2, 'Nome do requerente é obrigatório'),
  applicantType: z.enum(['pessoa_fisica', 'pessoa_juridica']),
  applicantDocument: z.string().min(11, 'CPF/CNPJ é obrigatório'),
  contact: z.object({
    phone: z.string(),
    email: z.string().email(),
    address: z.string(),
  }),
  activity: z.object({
    type: z.enum([
      'industrial',
      'comercial',
      'agricola',
      'mineracao',
      'construcao',
      'turismo',
      'outro',
    ]),
    description: z.string().min(10, 'Descrição da atividade é obrigatória'),
    potentialImpact: z.enum(['baixo', 'medio', 'alto']),
    location: z.string().min(5, 'Localização é obrigatória'),
    coordinates: z
      .object({
        lat: z.number(),
        lng: z.number(),
      })
      .optional(),
    area: z.number().min(0.1, 'Área deve ser maior que 0'),
  }),
  licenseType: z.enum(['previa', 'instalacao', 'operacao', 'corretiva', 'simplificada']),
  environmental: z.object({
    requiresEIA: z.boolean(), // Estudo de Impacto Ambiental
    requiresRIMA: z.boolean(), // Relatório de Impacto Ambiental
    waterUsage: z.object({
      required: z.boolean(),
      source: z.string().optional(),
      dailyVolume: z.number().min(0).optional(),
    }),
    wasteGeneration: z.object({
      generates: z.boolean(),
      types: z.array(z.string()).optional(),
      treatment: z.string().optional(),
      disposal: z.string().optional(),
    }),
    emissions: z.object({
      hasEmissions: z.boolean(),
      types: z.array(z.string()).optional(),
      controlMeasures: z.array(z.string()).optional(),
    }),
    noiseLevel: z.object({
      generates: z.boolean(),
      level: z.number().min(0).optional(),
      controlMeasures: z.string().optional(),
    }),
  }),
  documentation: z.array(z.string()).optional(),
  technicalOpinion: z.string().optional(),
  conditions: z.array(z.string()).optional(),
  validityPeriod: z.number().int().min(1).max(10), // anos
  fees: z.object({
    analysisAmount: z.number().min(0),
    licenseAmount: z.number().min(0),
    totalAmount: z.number().min(0),
    paymentStatus: z.enum(['pendente', 'pago', 'isento']).default('pendente'),
  }),
  status: z
    .enum(['protocolada', 'em_analise', 'pendente_documentos', 'aprovada', 'rejeitada', 'suspensa'])
    .default('protocolada'),
});

const environmentalComplaintSchema = z.object({
  complainantName: z.string().min(2, 'Nome é obrigatório'),
  complainantDocument: z.string().optional(),
  complainantPhone: z.string().min(10, 'Telefone é obrigatório'),
  complainantEmail: z.string().email().optional(),
  complaintType: z.enum([
    'poluicao_ar',
    'poluicao_agua',
    'poluicao_sonora',
    'desmatamento',
    'queimada',
    'descarte_irregular',
    'outro',
  ]),
  location: z.object({
    address: z.string().min(5, 'Endereço é obrigatório'),
    neighborhood: z.string().optional(),
    coordinates: z
      .object({
        lat: z.number(),
        lng: z.number(),
      })
      .optional(),
    description: z.string().optional(),
  }),
  incident: z.object({
    description: z.string().min(10, 'Descrição é obrigatória'),
    dateTime: z.string().transform(str => new Date(str)),
    frequency: z.enum(['unico', 'esporadico', 'frequente', 'continuo']),
    severity: z.enum(['baixa', 'media', 'alta', 'critica']),
    environmentalDamage: z.object({
      hasVisibleDamage: z.boolean(),
      damageDescription: z.string().optional(),
      affectedArea: z.number().min(0).optional(),
    }),
  }),
  evidence: z.object({
    photos: z.array(z.string()).optional(),
    videos: z.array(z.string()).optional(),
    documents: z.array(z.string()).optional(),
    witnesses: z
      .array(
        z.object({
          name: z.string(),
          phone: z.string(),
          statement: z.string().optional(),
        })
      )
      .optional(),
  }),
  suspect: z
    .object({
      hasIdentification: z.boolean(),
      name: z.string().optional(),
      address: z.string().optional(),
      activityType: z.string().optional(),
    })
    .optional(),
  urgency: z.enum(['baixa', 'normal', 'alta', 'emergencia']).default('normal'),
  isAnonymous: z.boolean().default(false),
  status: z
    .enum(['nova', 'em_investigacao', 'em_fiscalizacao', 'resolvida', 'improcedente', 'arquivada'])
    .default('nova'),
});

const protectedAreaSchema = z.object({
  name: z.string().min(2, 'Nome é obrigatório'),
  type: z.enum(['parque', 'reserva', 'apa', 'rppn', 'estacao_ecologica', 'refugio_vida_silvestre']),
  category: z.enum(['protecao_integral', 'uso_sustentavel', 'particular']),
  location: z.object({
    municipality: z.string(),
    state: z.string(),
    coordinates: z.array(
      z.object({
        lat: z.number(),
        lng: z.number(),
      })
    ), // polígono da área
    centerCoordinates: z.object({
      lat: z.number(),
      lng: z.number(),
    }),
  }),
  area: z.object({
    totalHectares: z.number().min(0.1),
    legalDescription: z.string(),
    boundaries: z.string(),
  }),
  biodiversity: z.object({
    ecosystem: z.array(z.string()),
    flora: z.array(z.string()).optional(),
    fauna: z.array(z.string()).optional(),
    endangeredSpecies: z.array(z.string()).optional(),
  }),
  management: z.object({
    manager: z.string().min(2, 'Gestor é obrigatório'),
    managementPlan: z.object({
      exists: z.boolean(),
      lastUpdate: z
        .string()
        .transform(str => new Date(str))
        .optional(),
      nextReview: z
        .string()
        .transform(str => new Date(str))
        .optional(),
    }),
    zonification: z
      .array(
        z.object({
          zone: z.string(),
          purpose: z.string(),
          restrictions: z.array(z.string()),
        })
      )
      .optional(),
  }),
  visitationControl: z.object({
    isOpenToPublic: z.boolean(),
    capacity: z.number().int().min(0).optional(),
    visitationRules: z.array(z.string()).optional(),
    facilities: z.array(z.string()).optional(),
  }),
  legalFramework: z.object({
    creationLaw: z.string(),
    creationDate: z.string().transform(str => new Date(str)),
    managementBody: z.string(),
    protectionLevel: z.enum(['estrita', 'moderada', 'flexivel']),
  }),
  threats: z
    .array(
      z.object({
        type: z.string(),
        severity: z.enum(['baixa', 'media', 'alta', 'critica']),
        description: z.string(),
        mitigation: z.string().optional(),
      })
    )
    .optional(),
  status: z.enum(['ativa', 'em_criacao', 'pendente_regulamentacao', 'suspensa']).default('ativa'),
});

const environmentalProgramSchema = z.object({
  name: z.string().min(2, 'Nome do programa é obrigatório'),
  description: z.string().min(20, 'Descrição é obrigatória'),
  type: z.enum([
    'educacao_ambiental',
    'conservacao',
    'recuperacao',
    'reciclagem',
    'energia_renovavel',
    'agua',
  ]),
  objective: z.array(z.string()),
  targetAudience: z.array(z.enum(['escolas', 'empresas', 'comunidades', 'agricultores', 'geral'])),
  coordinator: z.object({
    name: z.string().min(2, 'Coordenador é obrigatório'),
    qualification: z.string(),
    contact: z.object({
      phone: z.string(),
      email: z.string().email(),
    }),
  }),
  schedule: z.object({
    startDate: z.string().transform(str => new Date(str)),
    endDate: z
      .string()
      .transform(str => new Date(str))
      .optional(),
    duration: z.number().int().min(1), // dias
    activities: z.array(
      z.object({
        name: z.string(),
        description: z.string(),
        date: z
          .string()
          .transform(str => new Date(str))
          .optional(),
        location: z.string().optional(),
      })
    ),
  }),
  resources: z.object({
    budget: z.number().min(0),
    funding: z.array(
      z.object({
        source: z.string(),
        amount: z.number().min(0),
        type: z.enum(['publico', 'privado', 'internacional', 'doacao']),
      })
    ),
    humanResources: z.number().int().min(1),
    materials: z.array(z.string()).optional(),
  }),
  indicators: z.object({
    participantsGoal: z.number().int().min(1),
    currentParticipants: z.number().int().min(0).default(0),
    successMetrics: z.array(z.string()),
    monitoringFrequency: z.enum(['semanal', 'mensal', 'bimestral', 'trimestral']),
  }),
  partnerships: z
    .array(
      z.object({
        organization: z.string(),
        type: z.enum(['governo', 'ong', 'empresa', 'universidade', 'internacional']),
        contribution: z.string(),
      })
    )
    .optional(),
  expectedResults: z.array(z.string()),
  isActive: z.boolean().default(true),
});

const environmentalAttendanceSchema = z.object({
  citizenId: z.string().min(1, 'Cidadão é obrigatório'),
  serviceType: z.enum([
    'licenca_ambiental',
    'denuncia_ambiental',
    'programa_inscricao',
    'consultoria',
    'informacoes',
    'fiscalizacao',
  ]),
  subject: z.string().min(5, 'Assunto é obrigatório'),
  description: z.string().min(10, 'Descrição é obrigatória'),
  environmentalArea: z
    .enum(['agua', 'ar', 'solo', 'fauna', 'flora', 'residuos', 'ruido', 'geral'])
    .optional(),
  location: z.string().optional(),
  urgency: z.enum(['baixa', 'normal', 'alta', 'emergencia']).default('normal'),
  documents: z.array(z.string()).optional(),
  referredTo: z.string().optional(),
  resolution: z.string().optional(),
  followUpNeeded: z.boolean().default(false),
  followUpDate: z
    .string()
    .transform(str => new Date(str))
    .optional(),
  fees: z
    .object({
      applicable: z.boolean(),
      amount: z.number().min(0).optional(),
      paymentStatus: z.enum(['pendente', 'pago', 'isento']).default('pendente'),
    })
    .optional(),
});

// ====================== LICENÇAS AMBIENTAIS ======================

// GET /api/specialized/environment/licenses
router.get('/licenses', requirePermission('environment:read'), handleAsyncRoute(async (req, res) => {
  if (!isAuthenticatedRequest(req)) {
    res.status(401).json(createErrorResponse('UNAUTHORIZED', 'Acesso não autorizado'));
    return;
  }

  try {
    const { licenseType, status, activityType, applicantName, page = 1, limit = 20 } = req.query;

    const skip = (Number(page) - 1) * Number(limit);
    const where: EnvironmentalLicenseWhereInput = { tenantId: req.tenant.id };

    if (licenseType) where.type = getStringParam(licenseType);
    if (status) where.status = getStringParam(status);
    if (req.query.activityType) {
      (where as any).activity = getStringParam(req.query.activityType);
    }
    if (applicantName) {
      where.applicantName = {
        contains: getStringParam(applicantName),
        mode: 'insensitive' as const
      };
    }

    const [licenses, total] = await Promise.all([
      prisma.environmentalLicense.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: Number(limit),
      }),
      prisma.environmentalLicense.count({ where }),
    ]);

    res.json({
      data: licenses,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    console.error('Erro ao buscar licenças ambientais:', error);
    res.status(500).json(createErrorResponse('INTERNAL_ERROR', 'Erro interno do servidor', error));
  }
}));

// POST /api/specialized/environment/licenses
router.post('/licenses', requirePermission('environment:write'), handleAsyncRoute(async (req, res) => {
  try {
    const validatedData = environmentalLicenseSchema.parse(req.body);

    // Verificar se já existe licença similar para o mesmo local
    const existingLicense = await prisma.environmentalLicense.findFirst({
      where: {
        applicantDocument: validatedData.applicantDocument,
        status: { in: ['protocolada', 'em_analise', 'aprovada'] },
        tenantId: req.tenant.id,
      },
    });

    if (existingLicense) {
      res.status(409).json(createErrorResponse('CONFLICT', 'Licença já existe', 'Já existe uma licença para este local e requerente'));
      return;
    }

    const license = await prisma.environmentalLicense.create({
      data: {
        ...validatedData,
        tenantId: req.tenant.id,
      } as unknown as Prisma.EnvironmentalLicenseUncheckedCreateInput,
    });

    res.status(201).json(license);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json(createErrorResponse('VALIDATION_ERROR', 'Dados inválidos', error.issues));
      return;
    }
    console.error('Erro ao emitir licença ambiental:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}));

// ====================== DENÚNCIAS AMBIENTAIS ======================

// GET /api/specialized/environment/complaints
router.get('/complaints', requirePermission('environment:read'), handleAsyncRoute(async (req, res) => {
  try {
    const { complaintType, status, urgency, location, page = 1, limit = 20 } = req.query;

    const skip = (Number(page) - 1) * Number(limit);
    const where: EnvironmentalComplaintWhereInput = { tenantId: req.tenant.id };

    if (complaintType) where.type = getStringParam(complaintType);
    if (status) where.status = getStringParam(status);
    if (urgency) where.severity = getStringParam(urgency);
    // location removido pois não está na interface atual

    const [complaints, total] = await Promise.all([
      prisma.environmentalComplaint.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: Number(limit),
      }),
      prisma.environmentalComplaint.count({ where }),
    ]);

    res.json({
      data: complaints,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    console.error('Erro ao buscar denúncias ambientais:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}));

// POST /api/specialized/environment/complaints
router.post('/complaints', requirePermission('environment:write'), handleAsyncRoute(async (req, res) => {
  try {
    const validatedData = environmentalComplaintSchema.parse(req.body);

    const complaint = await prisma.environmentalComplaint.create({
      data: {
        ...validatedData,
        tenantId: req.tenant.id,
      } as unknown as Prisma.EnvironmentalComplaintUncheckedCreateInput,
    });

    res.status(201).json(complaint);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json(createErrorResponse('VALIDATION_ERROR', 'Dados inválidos', error.issues));
      return;
    }
    console.error('Erro ao registrar denúncia ambiental:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}));

// ====================== ÁREAS PROTEGIDAS ======================

// GET /api/specialized/environment/protected-areas
router.get('/protected-areas', requirePermission('environment:read'), handleAsyncRoute(async (req, res) => {
  try {
    const { type, category, status, municipality } = req.query;

    const where: EnvironmentalProtectedAreaWhereInput = { tenantId: req.tenant.id };
    if (type) where.type = getStringParam(type);
    if (category) where.category = getStringParam(category);
    if (status) where.status = getStringParam(status);
    // municipality removido pois não está na interface atual

    const areas = await prisma.protectedArea.findMany({
      where,
      orderBy: { name: 'asc' },
    });

    res.json(areas);
  } catch (error) {
    console.error('Erro ao buscar áreas protegidas:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}));

// POST /api/specialized/environment/protected-areas
router.post('/protected-areas', requirePermission('environment:write'), handleAsyncRoute(async (req, res) => {
  try {
    const validatedData = protectedAreaSchema.parse(req.body);

    const area = await prisma.protectedArea.create({
      data: {
        ...validatedData,
        tenantId: req.tenant.id,
      } as unknown as Prisma.ProtectedAreaUncheckedCreateInput,
    });

    res.status(201).json(area);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json(createErrorResponse('VALIDATION_ERROR', 'Dados inválidos', error.issues));
      return;
    }
    console.error('Erro ao criar área protegida:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}));

// ====================== PROGRAMAS AMBIENTAIS ======================

// GET /api/specialized/environment/programs
router.get('/programs', requirePermission('environment:read'), handleAsyncRoute(async (req, res) => {
  try {
    const { type, isActive, coordinator, targetAudience } = req.query;

    const where: EnvironmentalProgramWhereInput = { tenantId: req.tenant.id };
    if (type) where.type = getStringParam(type);
    if (isActive !== undefined) where.isActive = isActive === 'true';
    // coordinator e targetAudience removidos pois não estão na interface atual

    const programs = await prisma.environmentalProgram.findMany({
      where,
      orderBy: { name: 'asc' },
    });

    res.json(programs);
  } catch (error) {
    console.error('Erro ao buscar programas ambientais:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}));

// POST /api/specialized/environment/programs
router.post('/programs', requirePermission('environment:write'), handleAsyncRoute(async (req, res) => {
  try {
    const validatedData = environmentalProgramSchema.parse(req.body);

    const program = await prisma.environmentalProgram.create({
      data: {
        ...validatedData,
        tenantId: req.tenant.id,
      } as unknown as Prisma.EnvironmentalProgramUncheckedCreateInput,
    });

    res.status(201).json(program);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json(createErrorResponse('VALIDATION_ERROR', 'Dados inválidos', error.issues));
      return;
    }
    console.error('Erro ao criar programa ambiental:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}));

// ====================== ATENDIMENTOS DA SECRETARIA ======================

// GET /api/specialized/environment/attendances
router.get('/attendances', requirePermission('environment:read'), handleAsyncRoute(async (req, res) => {
  try {
    const { citizenId, serviceType, environmentalArea, urgency, page = 1, limit = 20 } = req.query;

    const skip = (Number(page) - 1) * Number(limit);
    const where: EnvironmentalAttendanceWhereInput = { tenantId: req.tenant.id };

    if (citizenId) where.citizenId = getStringParam(citizenId);
    if (serviceType) where.serviceType = getStringParam(serviceType);
    // environmentalArea e urgency removidos pois não estão na interface atual

    const [attendances, total] = await Promise.all([
      prisma.environmentalAttendance.findMany({
        where,
        include: {
          citizen: { select: { id: true, name: true, phone: true, email: true } },
        },
        orderBy: [{ urgency: 'desc' }, { createdAt: 'desc' }],
        skip,
        take: Number(limit),
      }),
      prisma.environmentalAttendance.count({ where }),
    ]);

    res.json({
      data: attendances,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    console.error('Erro ao buscar atendimentos:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}));

// POST /api/specialized/environment/attendances
router.post('/attendances', requirePermission('environment:write'), handleAsyncRoute(async (req, res) => {
  try {
    const validatedData = environmentalAttendanceSchema.parse(req.body);

    const attendance = await prisma.environmentalAttendance.create({
      data: {
        ...validatedData,
        tenantId: req.tenant.id,
      } as unknown as Prisma.EnvironmentalAttendanceUncheckedCreateInput,
      include: {
        citizen: { select: { id: true, name: true, phone: true, email: true } },
      },
    });

    res.status(201).json(attendance);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json(createErrorResponse('VALIDATION_ERROR', 'Dados inválidos', error.issues));
      return;
    }
    console.error('Erro ao registrar atendimento:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}));

// ====================== DASHBOARD E MÉTRICAS ======================

// GET /api/specialized/environment/dashboard
router.get('/dashboard', requirePermission('environment:read'), handleAsyncRoute(async (req, res) => {
  try {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const startOfYear = new Date(today.getFullYear(), 0, 1);

    const [
      activeLicenses,
      pendingLicenses,
      openComplaints,
      protectedAreasCount,
      activePrograms,
      attendancesMonth,
      complaintsByType,
      licensesByStatus,
    ] = await Promise.all([
      // Licenças ativas
      prisma.environmentalLicense.count({
        where: {
          tenantId: req.tenant.id,
          status: 'aprovada',
        },
      }),

      // Licenças pendentes
      prisma.environmentalLicense.count({
        where: {
          tenantId: req.tenant.id,
          status: { in: ['protocolada', 'em_analise', 'pendente_documentos'] },
        },
      }),

      // Denúncias em aberto
      prisma.environmentalComplaint.count({
        where: {
          tenantId: req.tenant.id,
          status: { in: ['nova', 'em_investigacao', 'em_fiscalizacao'] },
        },
      }),

      // Áreas protegidas
      prisma.protectedArea.count({
        where: {
          tenantId: req.tenant.id,
          status: 'ativa',
        },
      }),

      // Programas ambientais ativos
      prisma.environmentalProgram.count({
        where: { tenantId: req.tenant.id, isActive: true },
      }),

      // Atendimentos este mês
      prisma.environmentalAttendance.count({
        where: {
          tenantId: req.tenant.id,
          createdAt: { gte: startOfMonth },
        },
      }),

      // Denúncias por tipo
      prisma.environmentalComplaint.groupBy({
        by: ['complaintType'],
        where: { tenantId: req.tenant.id },
        _count: true,
      }),

      // Licenças por status
      prisma.environmentalLicense.groupBy({
        by: ['status'],
        where: { tenantId: req.tenant.id },
        _count: true,
      }),
    ]);

    const complaintTypeStats = complaintsByType.reduce(
      (acc: Record<string, number>, item: any) => {
        const key = item.complaintType || 'unknown';
        acc[key] = item._count || 0;
        return acc;
      },
      {} as Record<string, number>
    );

    const licenseStatusStats = licensesByStatus.reduce(
      (acc: Record<string, number>, item: any) => {
        const key = item.status || 'unknown';
        acc[key] = item._count || 0;
        return acc;
      },
      {} as Record<string, number>
    );

    res.json({
      activeLicenses,
      pendingLicenses,
      openComplaints,
      protectedAreasCount,
      activePrograms,
      attendancesMonth,
      complaintTypeStats,
      licenseStatusStats,
    });
  } catch (error) {
    console.error('Erro ao buscar dados do dashboard:', error);
    res.status(500).json(createErrorResponse('INTERNAL_ERROR', 'Erro interno do servidor', error));
  }
}));

export default router;
