import { Router, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../../lib/prisma';
import { tenantMiddleware } from '../../middleware/tenant';
import { adminAuthMiddleware, requirePermission } from '../../middleware/admin-auth';
import { AuthenticatedRequest, SuccessResponse, ErrorResponse } from '../../types';

// Interfaces para where clauses específicas de agricultura alinhadas com o schema Prisma
interface RuralProducerWhereInput {
  tenantId: string;
  isActive?: boolean;
  status?: string;
  productionType?: string;
  mainCrop?: string;
  name?: { contains: string; mode?: 'insensitive' };
  document?: { contains: string };
  OR?: Array<{
    name?: { contains: string; mode?: 'insensitive' };
    document?: { contains: string };
  }>;
}

interface TechnicalAssistanceWhereInput {
  tenantId: string;
  producerName?: { contains: string; mode?: 'insensitive' };
  producerCpf?: { contains: string };
  assistanceType?: string;
  status?: string;
  visitDate?: Date | { gte?: Date; lte?: Date };
  technician?: { contains: string; mode?: 'insensitive' };
}

interface RuralPropertyWhereInput {
  tenantId: string;
  producerId?: string;
  status?: string;
  name?: { contains: string; mode?: 'insensitive' };
  location?: { contains: string; mode?: 'insensitive' };
  OR?: Array<{
    name?: { contains: string; mode?: 'insensitive' };
    location?: { contains: string; mode?: 'insensitive' };
  }>;
}

interface AgricultureAttendanceWhereInput {
  tenantId: string;
  producerName?: { contains: string; mode?: 'insensitive' };
  producerCpf?: { contains: string };
  serviceType?: string;
  category?: string;
  urgency?: string;
  status?: string;
  technician?: { contains: string; mode?: 'insensitive' };
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

const ruralProducerSchema = z.object({
  name: z.string().min(2, 'Nome é obrigatório'),
  document: z.string().min(11, 'CPF/CNPJ é obrigatório'),
  email: z.string().email().optional(),
  phone: z.string().min(10, 'Telefone é obrigatório').optional(),
  address: z.string().min(10, 'Endereço é obrigatório').optional(),
  productionType: z.string().optional(),
  mainCrop: z.string().optional(),
  isActive: z.boolean().default(true),
});

const ruralPropertySchema = z.object({
  name: z.string().min(2, 'Nome da propriedade é obrigatório'),
  size: z.number().min(0.1, 'Tamanho deve ser maior que 0'),
  location: z.string().min(5, 'Localização é obrigatória'),
  plantedArea: z.number().min(0).optional(),
  mainCrops: z.array(z.string()).optional(),
  coordinates: z.object({
    lat: z.number(),
    lng: z.number(),
  }).optional(),
  waterSources: z.array(z.string()).optional(),
  soilType: z.string().optional(),
  infrastructure: z.array(z.string()).optional(),
  isActive: z.boolean().default(true),
});

const technicalAssistanceSchema = z.object({
  producerName: z.string().min(2, 'Nome do produtor é obrigatório'),
  producerCpf: z.string().min(11, 'CPF do produtor é obrigatório'),
  propertyName: z.string().min(2, 'Nome da propriedade é obrigatório'),
  propertySize: z.number().min(0.1, 'Tamanho da propriedade deve ser maior que 0'),
  location: z.string().min(5, 'Localização é obrigatória'),
  coordinates: z.object({
    lat: z.number(),
    lng: z.number(),
  }).optional(),
  assistanceType: z.enum(['orientacao', 'capacitacao', 'diagnostico', 'acompanhamento']),
  subject: z.string().min(5, 'Assunto é obrigatório'),
  description: z.string().min(10, 'Descrição é obrigatória'),
  crop: z.string().optional(),
  livestock: z.string().optional(),
  technician: z.string().min(2, 'Nome do técnico é obrigatório'),
  visitDate: z.string().transform(str => new Date(str)),
  findings: z.string().optional(),
  recommendations: z.array(z.string()).min(1, 'Pelo menos uma recomendação é obrigatória'),
  followUpPlan: z.array(z.string()).optional(),
  materials: z.array(z.string()).optional(),
  costs: z.number().min(0).optional(),
  nextVisitDate: z.string().transform(str => new Date(str)).optional(),
  observations: z.string().optional(),
});

const agricultureAttendanceSchema = z.object({
  producerName: z.string().min(2, 'Nome do produtor é obrigatório'),
  producerCpf: z.string().min(11, 'CPF do produtor é obrigatório'),
  contact: z.string().min(10, 'Contato é obrigatório'),
  propertyName: z.string().optional(),
  serviceType: z.enum([
    'assistencia_tecnica',
    'orientacao',
    'denuncia',
    'solicitacao'
  ]),
  subject: z.string().min(5, 'Assunto é obrigatório'),
  description: z.string().min(10, 'Descrição é obrigatória'),
  category: z.enum(['cultivo', 'criacao', 'irrigacao', 'solo', 'pragas']).optional(),
  urgency: z.enum(['LOW', 'NORMAL', 'HIGH', 'URGENT']).default('NORMAL'),
  location: z.string().optional(),
  propertySize: z.number().min(0).optional(),
  crops: z.array(z.string()).optional(),
  livestock: z.array(z.string()).optional(),
  preferredVisitDate: z.string().transform(str => new Date(str)).optional(),
  technician: z.string().optional(),
  findings: z.string().optional(),
  recommendations: z.string().optional(),
  followUpDate: z.string().transform(str => new Date(str)).optional(),
  resolution: z.string().optional(),
  satisfaction: z.number().min(1).max(5).optional(),
});

// Helper functions
function getStringParam(param: string | string[] | unknown): string {
  if (Array.isArray(param)) return param[0] || '';
  if (typeof param === 'string') return param;
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

// ====================== PRODUTORES RURAIS ======================

// GET /api/specialized/agriculture/producers
router.get('/producers', requirePermission('agriculture:read'), async (req, res) => {
  try {
    const productionType = getStringParam(req.query.productionType);
    const mainCrop = getStringParam(req.query.mainCrop);
    const search = getStringParam(req.query.search);
    const page = getNumberParam(req.query.page) || 1;
    const limit = getNumberParam(req.query.limit) || 20;

    const skip = (page - 1) * limit;
    const where: RuralProducerWhereInput = { tenantId: req.tenant!.id };

    if (productionType) {
      where.productionType = productionType;
    }
    if (mainCrop) {
      where.mainCrop = mainCrop;
    }
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { document: { contains: search } },
      ];
    }

    const [producers, total] = await Promise.all([
      prisma.ruralProducer.findMany({
        where,
        include: {
          properties: {
            select: {
              id: true,
              name: true,
              size: true,
              location: true,
              status: true,
            },
          },
        },
        orderBy: { name: 'asc' },
        skip,
        take: limit,
      }),
      prisma.ruralProducer.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    res.json(createSuccessResponse({
      producers,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      }
    }));
  } catch (error) {
    console.error('Erro ao buscar produtores rurais:', error);
    res.status(500).json(createErrorResponse('INTERNAL_ERROR', 'Erro interno do servidor'));
  }
});

// POST /api/specialized/agriculture/producers
router.post('/producers', requirePermission('agriculture:write'), async (req, res) => {
  try {
    const result = ruralProducerSchema.safeParse(req.body);
    if (!result.success) {
      const errors = result.error.issues.map(err => ({
        field: err.path.join('.'),
        message: err.message,
        value: err.input,
      }));
      res.status(400).json(createErrorResponse('VALIDATION_ERROR', 'Dados inválidos', errors));
      return;
    }

    const validatedData = result.data;

    // Verificar se o documento já existe
    const existingProducer = await prisma.ruralProducer.findFirst({
      where: {
        tenantId: req.tenant!.id,
        document: validatedData.document,
      },
    });

    if (existingProducer) {
      res.status(409).json(createErrorResponse('CONFLICT', 'Documento já cadastrado'));
      return;
    }

    const producer = await prisma.ruralProducer.create({
      data: {
        ...validatedData,
        tenantId: req.tenant!.id,
      },
      include: {
        properties: true,
      },
    });

    res.status(201).json(createSuccessResponse(producer, 'Produtor rural cadastrado com sucesso'));
  } catch (error) {
    console.error('Erro ao criar produtor rural:', error);
    res.status(500).json(createErrorResponse('INTERNAL_ERROR', 'Erro interno do servidor'));
  }
});

// ====================== PROPRIEDADES RURAIS ======================

// GET /api/specialized/agriculture/properties
router.get('/properties', requirePermission('agriculture:read'), async (req, res) => {
  try {
    const producerId = getStringParam(req.query.producerId);
    const search = getStringParam(req.query.search);
    const page = getNumberParam(req.query.page) || 1;
    const limit = getNumberParam(req.query.limit) || 20;

    const skip = (page - 1) * limit;
    const where: RuralPropertyWhereInput = { tenantId: req.tenant!.id };

    if (producerId) {
      where.producerId = producerId;
    }
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { location: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [properties, total] = await Promise.all([
      prisma.ruralProperty.findMany({
        where,
        include: {
          producer: {
            select: {
              id: true,
              name: true,
              document: true,
            },
          },
        },
        orderBy: { name: 'asc' },
        skip,
        take: limit,
      }),
      prisma.ruralProperty.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    res.json(createSuccessResponse({
      properties,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      }
    }));
  } catch (error) {
    console.error('Erro ao buscar propriedades rurais:', error);
    res.status(500).json(createErrorResponse('INTERNAL_ERROR', 'Erro interno do servidor'));
  }
});

// POST /api/specialized/agriculture/properties
router.post('/properties', requirePermission('agriculture:write'), async (req, res) => {
  try {
    const result = ruralPropertySchema.safeParse(req.body);
    if (!result.success) {
      const errors = result.error.issues.map(err => ({
        field: err.path.join('.'),
        message: err.message,
        value: err.input,
      }));
      res.status(400).json(createErrorResponse('VALIDATION_ERROR', 'Dados inválidos', errors));
      return;
    }

    const validatedData = result.data;
    const { producerId } = req.body;

    if (!producerId) {
      res.status(400).json(createErrorResponse('VALIDATION_ERROR', 'ID do produtor é obrigatório'));
      return;
    }

    // Verificar se o produtor existe
    const producer = await prisma.ruralProducer.findFirst({
      where: {
        id: producerId,
        tenantId: req.tenant!.id,
      },
    });

    if (!producer) {
      res.status(404).json(createErrorResponse('NOT_FOUND', 'Produtor não encontrado'));
      return;
    }

    const property = await prisma.ruralProperty.create({
      data: {
        ...validatedData,
        producerId,
        tenantId: req.tenant!.id,
      },
      include: {
        producer: {
          select: {
            id: true,
            name: true,
            document: true,
          },
        },
      },
    });

    res.status(201).json(createSuccessResponse(property, 'Propriedade rural cadastrada com sucesso'));
  } catch (error) {
    console.error('Erro ao criar propriedade rural:', error);
    res.status(500).json(createErrorResponse('INTERNAL_ERROR', 'Erro interno do servidor'));
  }
});

// ====================== ASSISTÊNCIA TÉCNICA ======================

// GET /api/specialized/agriculture/technical-assistance
router.get('/technical-assistance', requirePermission('agriculture:read'), async (req, res) => {
  try {
    const producerName = getStringParam(req.query.producerName);
    const assistanceType = getStringParam(req.query.assistanceType);
    const status = getStringParam(req.query.status);
    const technician = getStringParam(req.query.technician);
    const visitDate = getStringParam(req.query.visitDate);
    const page = getNumberParam(req.query.page) || 1;
    const limit = getNumberParam(req.query.limit) || 20;

    const skip = (page - 1) * limit;
    const where: TechnicalAssistanceWhereInput = { tenantId: req.tenant!.id };

    if (producerName) {
      where.producerName = { contains: producerName, mode: 'insensitive' };
    }
    if (assistanceType) {
      where.assistanceType = assistanceType;
    }
    if (status) {
      where.status = status;
    }
    if (technician) {
      where.technician = { contains: technician, mode: 'insensitive' };
    }
    if (visitDate) {
      where.visitDate = new Date(visitDate);
    }

    const [assistances, total] = await Promise.all([
      prisma.technicalAssistance.findMany({
        where,
        orderBy: { visitDate: 'desc' },
        skip,
        take: limit,
      }),
      prisma.technicalAssistance.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    res.json(createSuccessResponse({
      assistances,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      }
    }));
  } catch (error) {
    console.error('Erro ao buscar assistências técnicas:', error);
    res.status(500).json(createErrorResponse('INTERNAL_ERROR', 'Erro interno do servidor'));
  }
});

// POST /api/specialized/agriculture/technical-assistance
router.post('/technical-assistance', requirePermission('agriculture:write'), async (req, res) => {
  try {
    const result = technicalAssistanceSchema.safeParse(req.body);
    if (!result.success) {
      const errors = result.error.issues.map(err => ({
        field: err.path.join('.'),
        message: err.message,
        value: err.input,
      }));
      res.status(400).json(createErrorResponse('VALIDATION_ERROR', 'Dados inválidos', errors));
      return;
    }

    const validatedData = result.data;

    // Gerar protocolo único
    const protocol = `AT${Date.now()}${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    const assistance = await prisma.technicalAssistance.create({
      data: {
        tenantId: req.tenant!.id,
        protocol,
        producerName: validatedData.producerName,
        producerCpf: validatedData.producerCpf,
        propertyName: validatedData.propertyName,
        propertySize: validatedData.propertySize,
        location: validatedData.location,
        coordinates: validatedData.coordinates,
        assistanceType: validatedData.assistanceType,
        subject: validatedData.subject,
        description: validatedData.description,
        crop: validatedData.crop,
        livestock: validatedData.livestock,
        technician: validatedData.technician,
        visitDate: validatedData.visitDate,
        findings: validatedData.findings,
        recommendations: validatedData.recommendations,
        followUpPlan: validatedData.followUpPlan,
        materials: validatedData.materials,
        costs: validatedData.costs,
        nextVisitDate: validatedData.nextVisitDate,
        observations: validatedData.observations,
        status: 'SCHEDULED',
      },
    });

    res.status(201).json(createSuccessResponse(assistance, 'Assistência técnica agendada com sucesso'));
  } catch (error) {
    console.error('Erro ao criar assistência técnica:', error);
    res.status(500).json(createErrorResponse('INTERNAL_ERROR', 'Erro interno do servidor'));
  }
});

// ====================== ATENDIMENTOS ======================

// GET /api/specialized/agriculture/attendances
router.get('/attendances', requirePermission('agriculture:read'), async (req, res) => {
  try {
    const producerName = getStringParam(req.query.producerName);
    const serviceType = getStringParam(req.query.serviceType);
    const category = getStringParam(req.query.category);
    const urgency = getStringParam(req.query.urgency);
    const technician = getStringParam(req.query.technician);
    const page = getNumberParam(req.query.page) || 1;
    const limit = getNumberParam(req.query.limit) || 20;

    const skip = (page - 1) * limit;
    const where: AgricultureAttendanceWhereInput = { tenantId: req.tenant!.id };

    if (producerName) {
      where.producerName = { contains: producerName, mode: 'insensitive' };
    }
    if (serviceType) where.serviceType = serviceType;
    if (category) where.category = category;
    if (urgency) where.urgency = urgency;
    if (technician) {
      where.technician = { contains: technician, mode: 'insensitive' };
    }

    const [attendances, total] = await Promise.all([
      prisma.agricultureAttendance.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.agricultureAttendance.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    res.json(createSuccessResponse({
      attendances,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      }
    }));
  } catch (error) {
    console.error('Erro ao buscar atendimentos:', error);
    res.status(500).json(createErrorResponse('INTERNAL_ERROR', 'Erro interno do servidor'));
  }
});

// POST /api/specialized/agriculture/attendances
router.post('/attendances', requirePermission('agriculture:write'), async (req, res) => {
  try {
    const result = agricultureAttendanceSchema.safeParse(req.body);
    if (!result.success) {
      const errors = result.error.issues.map(err => ({
        field: err.path.join('.'),
        message: err.message,
        value: err.input,
      }));
      res.status(400).json(createErrorResponse('VALIDATION_ERROR', 'Dados inválidos', errors));
      return;
    }

    const validatedData = result.data;

    // Gerar protocolo único
    const protocol = `AGR${Date.now()}${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    const attendance = await prisma.agricultureAttendance.create({
      data: {
        ...validatedData,
        tenantId: req.tenant!.id,
        protocol,
        status: 'PENDING',
      },
    });

    res.status(201).json(createSuccessResponse(attendance, 'Atendimento registrado com sucesso'));
  } catch (error) {
    console.error('Erro ao criar atendimento:', error);
    res.status(500).json(createErrorResponse('INTERNAL_ERROR', 'Erro interno do servidor'));
  }
});

// ====================== RELATÓRIOS E ESTATÍSTICAS ======================

// GET /api/specialized/agriculture/stats
router.get('/stats', async (req, res) => {
  try {
    const tenantId = req.tenant!.id;

    // Data de hoje para filtrar atendimentos
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [
      totalProducers,
      totalProperties,
      activeAssistance,
      todayAttendances,
    ] = await Promise.all([
      prisma.ruralProducer.count({ where: { tenantId, isActive: true } }),
      prisma.ruralProperty.count({ where: { tenantId, status: 'ACTIVE' } }),
      prisma.technicalAssistance.count({
        where: {
          tenantId,
          status: { in: ['SCHEDULED', 'IN_PROGRESS'] }
        }
      }),
      prisma.agricultureAttendance.count({
        where: {
          tenantId,
          createdAt: {
            gte: today,
            lt: tomorrow
          }
        }
      }),
    ]);

    const stats = {
      totalProducers,
      totalProperties,
      activeAssistance,
      todayAttendances,
    };

    res.json(createSuccessResponse(stats));
  } catch (error) {
    console.error('Erro ao buscar estatísticas de agricultura:', error);
    res.status(500).json(createErrorResponse('INTERNAL_ERROR', 'Erro interno do servidor'));
  }
});

export default router;