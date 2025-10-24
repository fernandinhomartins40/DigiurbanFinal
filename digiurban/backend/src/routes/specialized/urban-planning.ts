import { Router, Response } from 'express';
import { prisma } from '../../lib/prisma';
import { z } from 'zod';
import { AuthenticatedRequest, SuccessResponse, ErrorResponse } from '../../types';
import { tenantMiddleware } from '../../middleware/tenant';
import { adminAuthMiddleware, requirePermission } from '../../middleware/admin-auth';
import { asyncHandler } from '../../utils/express-helpers';

// Interfaces para where clauses específicas de planejamento urbano - expandida para todos os casos de uso
interface UrbanPlanningWhereInput {
  tenantId: string;
  status?: string;
  type?: string;           // Corresponde ao campo 'type' do modelo
  projectType?: string;    // Corresponde ao campo 'projectType' do modelo
  location?: string;       // Corresponde ao campo 'location' do modelo

  // Para filtering de denúncias/reclamações
  complaintType?: string;
  priority?: string;

  // Para queries genéricas
  isActive?: boolean;
  OR?: Array<Record<string, unknown>>;

  // Para projetos específicos
  projectId?: string;
  decision?: string;
  analysisType?: string;
  reviewerName?: string;
  citizenId?: string;
  serviceType?: string;

  // CRIADO: campos adicionais para BuildingPermit
  construction?: any;
  applicantName?: any;

  // Para datas
  startDate?: {
    gte?: Date;
    lte?: Date;
  };
  endDate?: {
    gte?: Date;
    lte?: Date;
  };

  // Para busca genérica por nome
  name?: {
    contains?: string;
    mode?: string;
  };
}

// Interfaces para resultados de groupBy
interface GroupByResult {
  _count: Record<string, number>;
  [key: string]: unknown;
}

// Utilitários tipados para parâmetros de query seguros
function getStringParam(value: unknown): string | undefined {
  if (typeof value === 'string') return value;
  return undefined;
}

function getNumberParam(value: unknown, defaultValue: number = 1): number {
  if (typeof value === 'string') {
    const parsed = parseInt(value, 10);
    return isNaN(parsed) ? defaultValue : parsed;
  }
  return defaultValue;
}

const router = Router();

// Middleware global
router.use(tenantMiddleware);
router.use(adminAuthMiddleware);

// ====================== SCHEMAS DE VALIDAÇÃO ======================

// Schema Zod alinhado com modelo Prisma UrbanProject
const urbanProjectSchema = z.object({
  name: z.string().min(2, 'Nome do projeto é obrigatório'),
  description: z.string().min(10, 'Descrição é obrigatória'),
  projectType: z.string().min(2, 'Tipo do projeto é obrigatório'),
  type: z.string().min(2, 'Categoria do projeto é obrigatória'),
  status: z
    .enum(['PLANNING', 'APPROVED', 'REJECTED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'])
    .default('PLANNING'),
  startDate: z.string().transform(str => new Date(str)).optional(),
  endDate: z.string().transform(str => new Date(str)).optional(),
  budget: z.number().min(0).optional(),
  location: z.string().min(2, 'Localização é obrigatória').optional(),
});

const buildingPermitSchema = z.object({
  applicantName: z.string().min(2, 'Nome do requerente é obrigatório'),
  applicantCpfCnpj: z.string().min(11, 'CPF/CNPJ é obrigatório'),
  property: z.object({
    address: z.string().min(5, 'Endereço é obrigatório'),
    registrationNumber: z.string().min(1, 'Número de matrícula é obrigatório'),
    area: z.number().min(0.1, 'Área deve ser maior que 0'),
    zoning: z.string().min(1, 'Zoneamento é obrigatório'),
  }),
  construction: z.object({
    type: z.enum(['residencial', 'comercial', 'industrial', 'institucional', 'misto']),
    category: z.enum(['nova_construcao', 'reforma', 'ampliacao', 'regularizacao', 'demolicao']),
    builtArea: z.number().min(0.1, 'Área construída deve ser maior que 0'),
    floors: z.number().int().min(1),
    units: z.number().int().min(1),
    estimatedCost: z.number().min(0),
  }),
  responsibleTechnician: z.object({
    name: z.string().min(2, 'Nome é obrigatório'),
    crea: z.string().min(5, 'CREA é obrigatório'),
    phone: z.string().min(10, 'Telefone é obrigatório'),
    email: z.string().email().optional(),
  }),
  documents: z.array(z.string()).optional(),
  observations: z.string().optional(),
  status: z
    .enum(['protocolado', 'em_analise', 'pendente_documentos', 'aprovado', 'rejeitado'])
    .default('protocolado'),
  fees: z.object({
    analysisAmount: z.number().min(0),
    licenseAmount: z.number().min(0),
    totalAmount: z.number().min(0),
    paymentStatus: z.enum(['pendente', 'pago', 'isento']).default('pendente'),
  }),
});

const publicComplaintSchema = z.object({
  complainantName: z.string().min(2, 'Nome é obrigatório'),
  complainantCpf: z.string().optional(),
  complainantPhone: z.string().min(10, 'Telefone é obrigatório'),
  complainantEmail: z.string().email().optional(),
  complaintType: z.enum([
    'construcao_irregular',
    'uso_irregular',
    'ruido',
    'poluicao',
    'ocupacao_irregular',
    'outro',
  ]),
  subject: z.string().min(5, 'Assunto é obrigatório'),
  description: z.string().min(10, 'Descrição é obrigatória'),
  location: z.string().min(5, 'Local é obrigatório'),
  coordinates: z
    .object({
      lat: z.number(),
      lng: z.number(),
    })
    .optional(),
  evidence: z.array(z.string()).optional(),
  priority: z.enum(['baixa', 'normal', 'alta', 'urgente']).default('normal'),
  isAnonymous: z.boolean().default(false),
  status: z
    .enum(['nova', 'em_analise', 'em_fiscalizacao', 'resolvida', 'arquivada'])
    .default('nova'),
});

const publicConsultationSchema = z.object({
  title: z.string().min(5, 'Título é obrigatório'),
  description: z.string().min(20, 'Descrição é obrigatória'),
  type: z.enum(['plano_diretor', 'zoneamento', 'projeto_urbano', 'lei_municipal', 'outro']),
  subject: z.string().min(10, 'Objeto da consulta é obrigatório'),
  startDate: z.string().transform(str => new Date(str)),
  endDate: z.string().transform(str => new Date(str)),
  publicHearingDate: z
    .string()
    .transform(str => new Date(str))
    .optional(),
  publicHearingLocation: z.string().optional(),
  documents: z
    .array(
      z.object({
        name: z.string(),
        url: z.string(),
        type: z.string(),
      })
    )
    .optional(),
  participationMethod: z.array(z.enum(['presencial', 'online', 'escrita', 'audiencia'])),
  contact: z.object({
    responsible: z.string(),
    phone: z.string(),
    email: z.string().email(),
  }),
  status: z.enum(['programada', 'ativa', 'finalizada', 'cancelada']).default('programada'),
});

const urbanZoningSchema = z.object({
  name: z.string().min(2, 'Nome da zona é obrigatório'),
  code: z.string().min(1, 'Código é obrigatório'),
  type: z.enum([
    'residencial',
    'comercial',
    'industrial',
    'mista',
    'institucional',
    'verde',
    'especial',
  ]),
  description: z.string().min(10, 'Descrição é obrigatória'),
  regulations: z.object({
    maxOccupationRate: z.number().min(0).max(1),
    maxBuildingRate: z.number().min(0).max(10),
    minSetback: z.object({
      front: z.number().min(0),
      sides: z.number().min(0),
      back: z.number().min(0),
    }),
    maxHeight: z.number().min(0),
    maxFloors: z.number().int().min(1),
    minimumLotSize: z.number().min(0),
  }),
  permitedUses: z.array(z.string()),
  restrictions: z.array(z.string()).optional(),
  coordinates: z
    .array(
      z.object({
        lat: z.number(),
        lng: z.number(),
      })
    )
    .optional(),
  isActive: z.boolean().default(true),
});

const projectApprovalSchema = z.object({
  projectId: z.string().min(1, 'Projeto é obrigatório'),
  reviewerName: z.string().min(2, 'Nome do revisor é obrigatório'),
  reviewDate: z.string().transform(str => new Date(str)),
  analysisType: z.enum(['tecnica', 'juridica', 'ambiental', 'urbana', 'final']),
  checklist: z.array(
    z.object({
      item: z.string(),
      compliant: z.boolean(),
      observations: z.string().optional(),
    })
  ),
  observations: z.string().optional(),
  requirements: z.array(z.string()).optional(),
  decision: z.enum(['aprovado', 'aprovado_com_condicoes', 'rejeitado', 'pendente_documentos']),
  conditions: z.array(z.string()).optional(),
  validUntil: z
    .string()
    .transform(str => new Date(str))
    .optional(),
});

const urbanPlanningAttendanceSchema = z.object({
  citizenId: z.string().min(1, 'Cidadão é obrigatório'),
  serviceType: z.enum([
    'consulta_zoneamento',
    'alvara_construcao',
    'certidao',
    'projeto_aprovacao',
    'denuncia',
    'informacao',
  ]),
  description: z.string().min(10, 'Descrição é obrigatória'),
  address: z.string().optional(),
  documents: z.array(z.string()).optional(),
  resolution: z.string().optional(),
  followUpNeeded: z.boolean().default(false),
  followUpDate: z
    .string()
    .transform(str => new Date(str))
    .optional(),
  fees: z
    .object({
      amount: z.number().min(0).optional(),
      paymentStatus: z.enum(['pendente', 'pago', 'isento']).default('pendente'),
    })
    .optional(),
});

// ====================== PROJETOS URBANOS ======================

// GET /api/specialized/urban-planning/projects
router.get('/projects', requirePermission('urban_planning:read'), asyncHandler(async (req, res) => {
  try {
    const { type, status, projectType, page, limit } = req.query;

    // Usar utilitários tipados para parâmetros seguros
    const pageNum = getNumberParam(page, 1);
    const limitNum = getNumberParam(limit, 20);
    const skip = (pageNum - 1) * limitNum;

    // Verificação segura do tenant
    if (!req.tenant) {
      res.status(400).json({ error: 'Tenant não encontrado' });
      return;
    }

    const where: UrbanPlanningWhereInput = { tenantId: req.tenant!.id };

    // Usar utilitários tipados para parâmetros de query
    const typeParam = getStringParam(type);
    const statusParam = getStringParam(status);
    const projectTypeParam = getStringParam(projectType);

    if (typeParam) where.type = typeParam;
    if (statusParam) where.status = statusParam;
    if (projectTypeParam) where.projectType = projectTypeParam;

    const [projects, total] = await Promise.all([
      prisma.urbanProject.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limitNum,
      }),
      prisma.urbanProject.count({ where }),
    ]);

    res.json({
      data: projects,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error('Erro ao buscar projetos urbanos:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}));

// POST /api/specialized/urban-planning/projects
router.post('/projects', requirePermission('urban_planning:write'), asyncHandler(async (req, res) => {
  try {
    const validatedData = urbanProjectSchema.parse(req.body);

    // Verificação segura do tenant
    if (!req.tenant) {
      res.status(400).json({ error: 'Tenant não encontrado' });
      return;
    }

    // Operação Prisma com campos explicitamente definidos
    const project = await prisma.urbanProject.create({
      data: {
        name: validatedData.name,
        description: validatedData.description,
        projectType: validatedData.projectType,
        type: validatedData.type,
        status: validatedData.status,
        startDate: validatedData.startDate,
        endDate: validatedData.endDate,
        budget: validatedData.budget,
        location: validatedData.location,
        tenantId: req.tenant!.id,
      } as any,
    });

    res.status(201).json(project);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Dados inválidos', details: error.issues });
    } else {
      console.error('Erro ao criar projeto urbano:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
}));

// ====================== ALVARÁS DE CONSTRUÇÃO ======================

// GET /api/specialized/urban-planning/permits
router.get('/permits', requirePermission('urban_planning:read'), asyncHandler(async (req, res) => {
  try {
    const { status, constructionType, applicantName, page = 1, limit = 20 } = req.query;

    const skip = (Number(page) - 1) * Number(limit);
    const where: UrbanPlanningWhereInput = { tenantId: req.tenant!.id };

    if (status) where.status = String(status);
    if (constructionType) where.construction = { type: String(constructionType) };
    if (applicantName) {
      where.applicantName = { contains: String(applicantName), mode: 'insensitive' };
    }

    const [permits, total] = await Promise.all([
      prisma.buildingPermit.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: Number(limit),
      }),
      prisma.buildingPermit.count({ where }),
    ]);

    res.json({
      data: permits,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    console.error('Erro ao buscar alvarás:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}));

// POST /api/specialized/urban-planning/permits
router.post('/permits', requirePermission('urban_planning:write'), asyncHandler(async (req, res) => {
  try {
    const validatedData = buildingPermitSchema.parse(req.body);

    const permit = await prisma.buildingPermit.create({
      data: {
        ...validatedData,
        tenantId: req.tenant!.id,
      } as any,
    });

    res.status(201).json(permit);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Dados inválidos', details: error.issues });
    } else {
      console.error('Erro ao emitir alvará:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
}));

// ====================== DENÚNCIAS E RECLAMAÇÕES ======================

// GET /api/specialized/urban-planning/complaints
router.get('/complaints', requirePermission('urban_planning:read'), asyncHandler(async (req, res) => {
  try {
    const { complaintType, status, priority, page, limit } = req.query;

    // Usar utilitários tipados para parâmetros seguros
    const pageNum = getNumberParam(page, 1);
    const limitNum = getNumberParam(limit, 20);
    const skip = (pageNum - 1) * limitNum;

    const where: UrbanPlanningWhereInput = { tenantId: req.tenant!.id };

    // Aplicar parâmetros tipados seguros
    const complaintTypeParam = getStringParam(complaintType);
    const statusParam = getStringParam(status);
    const priorityParam = getStringParam(priority);

    if (complaintTypeParam) where.complaintType = complaintTypeParam;
    if (statusParam) where.status = statusParam;
    if (priorityParam) where.priority = priorityParam;

    const [complaints, total] = await Promise.all([
      prisma.publicComplaint.findMany({
        where,
        orderBy: [{ priority: 'desc' }, { createdAt: 'desc' }],
        skip,
        take: limitNum,
      }),
      prisma.publicComplaint.count({ where }),
    ]);

    res.json({
      data: complaints,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error('Erro ao buscar denúncias:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}));

// POST /api/specialized/urban-planning/complaints
router.post('/complaints', requirePermission('urban_planning:write'), asyncHandler(async (req, res) => {
  try {
    const validatedData = publicComplaintSchema.parse(req.body);

    const complaint = await prisma.publicComplaint.create({
      data: {
        ...validatedData,
        tenantId: req.tenant!.id,
      } as any,
    });

    res.status(201).json(complaint);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Dados inválidos', details: error.issues });
    } else {
      console.error('Erro ao registrar denúncia:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
}));

// ====================== CONSULTAS PÚBLICAS ======================

// GET /api/specialized/urban-planning/consultations
router.get('/consultations', requirePermission('urban_planning:read'), asyncHandler(async (req, res) => {
  try {
    const { type, status, isActive } = req.query;

    const where: UrbanPlanningWhereInput = { tenantId: req.tenant!.id };

    // Aplicar parâmetros tipados seguros
    const typeParam = getStringParam(type);
    const statusParam = getStringParam(status);

    if (typeParam) where.type = typeParam;
    if (statusParam) where.status = statusParam;

    const consultations = await prisma.publicConsultation.findMany({
      where,
      orderBy: { startDate: 'desc' },
    });

    res.json(consultations);
  } catch (error) {
    console.error('Erro ao buscar consultas públicas:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}));

// POST /api/specialized/urban-planning/consultations
router.post('/consultations', requirePermission('urban_planning:write'), asyncHandler(async (req, res) => {
  try {
    const validatedData = publicConsultationSchema.parse(req.body);

    const consultation = await prisma.publicConsultation.create({
      data: {
        ...validatedData,
        tenantId: req.tenant!.id,
      } as any,
    });

    res.status(201).json(consultation);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Dados inválidos', details: error.issues });
    } else {
      console.error('Erro ao criar consulta pública:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
}));

// ====================== ZONEAMENTO URBANO ======================

// GET /api/specialized/urban-planning/zoning
router.get('/zoning', requirePermission('urban_planning:read'), asyncHandler(async (req, res) => {
  try {
    const { type, isActive, search } = req.query;

    const where: UrbanPlanningWhereInput = { tenantId: req.tenant!.id };

    // Aplicar parâmetros tipados seguros
    const typeParam = getStringParam(type);
    const isActiveParam = getStringParam(isActive);
    const searchParam = getStringParam(search);

    if (typeParam) where.type = typeParam;
    if (isActiveParam !== undefined) where.isActive = isActiveParam === 'true';
    if (searchParam) {
      where.OR = [
        { name: { contains: searchParam, mode: 'insensitive' } },
        { code: { contains: searchParam, mode: 'insensitive' } },
      ];
    }

    const zoning = await prisma.urbanZoning.findMany({
      where,
      orderBy: { name: 'asc' },
    });

    res.json(zoning);
  } catch (error) {
    console.error('Erro ao buscar zoneamento:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}));

// POST /api/specialized/urban-planning/zoning
router.post('/zoning', requirePermission('urban_planning:write'), asyncHandler(async (req, res) => {
  try {
    const validatedData = urbanZoningSchema.parse(req.body);

    const zoning = await prisma.urbanZoning.create({
      data: {
        ...validatedData,
        tenantId: req.tenant!.id,
      } as any,
    });

    res.status(201).json(zoning);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Dados inválidos', details: error.issues });
    } else {
      console.error('Erro ao criar zona urbana:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
}));

// ====================== APROVAÇÃO DE PROJETOS ======================

// GET /api/specialized/urban-planning/project-approval
router.get('/project-approval', requirePermission('urban_planning:read'), asyncHandler(async (req, res) => {
  try {
    const { projectId, decision, analysisType, reviewerName } = req.query;

    const where: UrbanPlanningWhereInput = { tenantId: req.tenant!.id };
    if (projectId) where.projectId = String(projectId);
    if (decision) where.decision = String(decision);
    if (analysisType) where.analysisType = String(analysisType);
    if (reviewerName) {
      where.reviewerName = String(reviewerName);
    }

    const approvals = await prisma.projectApproval.findMany({
      where: where as any,
      orderBy: { createdAt: 'desc' } as any,
    });

    res.json(approvals);
  } catch (error) {
    console.error('Erro ao buscar aprovações:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}));

// POST /api/specialized/urban-planning/project-approval
router.post('/project-approval', requirePermission('urban_planning:write'), asyncHandler(async (req, res) => {
  try {
    const validatedData = projectApprovalSchema.parse(req.body);

    const approval = await prisma.projectApproval.create({
      data: {
        ...validatedData,
        tenantId: req.tenant!.id,
      } as any,
    });

    res.status(201).json(approval);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Dados inválidos', details: error.issues });
    } else {
      console.error('Erro ao aprovar projeto:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
}));

// ====================== ATENDIMENTOS DA SECRETARIA ======================

// GET /api/specialized/urban-planning/attendances
router.get('/attendances', requirePermission('urban_planning:read'), asyncHandler(async (req, res) => {
  try {
    const { citizenId, serviceType, page = 1, limit = 20 } = req.query;

    const skip = (Number(page) - 1) * Number(limit);
    const where: UrbanPlanningWhereInput = { tenantId: req.tenant!.id };

    if (citizenId) where.citizenId = String(citizenId);
    if (serviceType) where.serviceType = String(serviceType);

    const [attendances, total] = await Promise.all([
      prisma.urbanPlanningAttendance.findMany({
        where,
        include: {
          citizen: { select: { id: true, name: true, phone: true, email: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: Number(limit),
      }),
      prisma.urbanPlanningAttendance.count({ where }),
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

// POST /api/specialized/urban-planning/attendances
router.post('/attendances', requirePermission('urban_planning:write'), asyncHandler(async (req, res) => {
  try {
    const validatedData = urbanPlanningAttendanceSchema.parse(req.body);

    const attendance = await prisma.urbanPlanningAttendance.create({
      data: {
        ...validatedData,
        tenantId: req.tenant!.id,
      } as any,
      include: {
        citizen: { select: { id: true, name: true, phone: true, email: true } },
      },
    });

    res.status(201).json(attendance);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Dados inválidos', details: error.issues });
    } else {
      console.error('Erro ao registrar atendimento:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
}));

// ====================== DASHBOARD E MÉTRICAS ======================

// GET /api/specialized/urban-planning/dashboard
router.get('/dashboard', requirePermission('urban_planning:read'), asyncHandler(async (req, res) => {
  try {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const [
      activeProjects,
      pendingPermits,
      openComplaints,
      activeConsultations,
      zoningAreas,
      approvedProjectsMonth,
      attendancesMonth,
      projectsByType,
    ] = await Promise.all([
      // Projetos ativos
      prisma.urbanProject.count({
        where: {
          tenantId: req.tenant!.id,
          status: { in: ['em_analise', 'aprovado', 'em_execucao'] },
        },
      }),

      // Alvarás pendentes
      prisma.buildingPermit.count({
        where: {
          tenantId: req.tenant!.id,
          status: { in: ['protocolado', 'em_analise', 'pendente_documentos'] },
        },
      }),

      // Denúncias em aberto
      prisma.publicComplaint.count({
        where: {
          tenantId: req.tenant!.id,
          status: { in: ['nova', 'em_analise', 'em_fiscalizacao'] },
        },
      }),

      // Consultas públicas ativas
      prisma.publicConsultation.count({
        where: {
          tenantId: req.tenant!.id,
          status: 'ativa',
        },
      }),

      // Áreas de zoneamento
      prisma.urbanZoning.count({
        where: { tenantId: req.tenant!.id, isActive: true },
      }),

      // Projetos aprovados este mês
      prisma.urbanProject.count({
        where: {
          tenantId: req.tenant!.id,
          status: 'aprovado',
          updatedAt: { gte: startOfMonth },
        },
      }),

      // Atendimentos este mês
      prisma.urbanPlanningAttendance.count({
        where: {
          tenantId: req.tenant!.id,
          createdAt: { gte: startOfMonth },
        },
      }),

      // Projetos por tipo
      prisma.urbanProject.groupBy({
        by: ['type'],
        where: { tenantId: req.tenant!.id },
        _count: true,
      }),
    ]);

    const projectTypeStats = projectsByType.reduce(
      (acc, item) => {
        acc[item.type] = item._count;
        return acc;
      },
      {} as Record<string, number>
    );

    res.json({
      activeProjects,
      pendingPermits,
      openComplaints,
      activeConsultations,
      zoningAreas,
      approvedProjectsMonth,
      attendancesMonth,
      projectTypeStats,
    });
  } catch (error) {
    console.error('Erro ao buscar dados do dashboard:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}));

export default router;
