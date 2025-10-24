// ============================================================================
// ARQUIVO MIGRADO - FASE 2 - TIPOS MODERNOS APLICADOS
// ============================================================================

import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { prisma } from '../../lib/prisma';
import { Prisma } from '@prisma/client';
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

// Tipos locais dos modelos Prisma
interface CulturalSpace {
  id: string;
  code: string;
  name: string;
  description: string;
  type: string;
  address: string;
  neighborhood: string;
  zipCode: string;
  coordinates?: string;
  capacity: number;
  infrastructure?: string;
  equipment?: string;
  accessibility: boolean;
  manager: string;
  contact: string;
  operatingHours?: string;
  available: boolean;
  tenantId: string;
  createdAt: Date;
  updatedAt: Date;
}

interface AuthenticatedRequest {
  user?: User & { tenantId: string };
  tenantId?: string;
  query: Request['query'];
  params: Request['params'];
  body: Request['body'];
}

interface PaginatedResponse<T> {
  data: T[];
  pagination: { page: number; limit: number; total: number; totalPages: number; };
  total: number;
  page: number;
  limit: number;
  totalPages: number;
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

// FASE 2 - Interface para stats item
interface CultureStatsItem {
  category?: string;
  status?: string;
  _count: number;
}

// ====================== HELPER FUNCTIONS ======================

function getStringParam(param: any): string {
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
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req as unknown as AuthenticatedRequest, res, next)).catch(next);
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

function isValidId(id: string): boolean {
  return typeof id === 'string' && id.length > 0;
}

// Tipos específicos para cultura
type CultureRequest = AuthenticatedRequest;
type CultureQuery = Partial<{
  type: string;
  category: string;
  status: string;
  isActive: string;
  capacity: string;
  city: string;
  organizer: string;
  spaceId: string;
  month: string;
  year: string;
  style: string;
  search: string;
  level: string;
  instructor: string;
  citizenId: string;
  serviceType: string;
  culturalArea: string;
  region: string;
  traditional: string;
  page: string;
  limit: string;
}>;

// Interfaces para dados validados
interface ValidatedCulturalSpaceData {
  name: string;
  description: string;
  type: string;
  address: string;
  coordinates?: { lat: number; lng: number };
  capacity: number;
  facilities?: string[];
  equipment?: string[];
  accessibility: {
    wheelchairAccess: boolean;
    audioDescription: boolean;
    signLanguage: boolean;
    braille: boolean;
  };
  operatingHours: Record<string, string | undefined>;
  manager: string;
  contact: {
    phone: string;
    email?: string;
    website?: string;
  };
  pricing: {
    isFree: boolean;
    ticketPrice?: number;
    discounts?: Array<{ category: string; percentage: number }>;
  };
  photos?: string[];
  isActive: boolean;
}

interface ValidatedCulturalProjectData {
  title: string;
  description: string;
  category: string;
  type: string;
  organizer: {
    name: string;
    type: string;
    cpfCnpj: string;
    phone: string;
    email: string;
  };
  targetAudience: string[];
  location: {
    spaceId?: string;
    customLocation?: string;
    isVirtual: boolean;
  };
  schedule: {
    startDate: Date;
    endDate: Date;
    timeSlots: Array<{
      date: Date;
      startTime: string;
      endTime: string;
    }>;
  };
  budget: {
    totalCost: number;
    funding: Array<{
      source: string;
      amount: number;
      type: string;
    }>;
    expenses?: Array<{
      category: string;
      amount: number;
      description: string;
    }>;
  };
  participants: {
    expectedCount: number;
    registrationRequired: boolean;
    maxParticipants?: number;
  };
  status: string;
  documentation?: string[];
}

interface ValidatedCulturalEventData {
  title: string;
  description: string;
  type: string;
  category: string;
  spaceId?: string;
  customLocation?: string;
  organizer: string;
  performers?: Array<{
    name: string;
    role: string;
    bio?: string;
  }>;
  schedule: {
    date: Date;
    startTime: string;
    endTime: string;
    duration: number;
  };
  audience: {
    targetAge: string[];
    expectedCount: number;
    capacity: number;
  };
  ticketing: {
    isFree: boolean;
    price?: number;
    salesStart?: Date;
    salesEnd?: Date;
    ticketsAvailable?: number;
  };
  requirements: {
    equipment?: string[];
    technicalRider?: string;
    accessibility?: string[];
  };
  promotion?: {
    poster?: string;
    socialMedia?: string[];
    pressRelease?: string;
  };
  status: string;
}

interface ValidatedArtistGroupData {
  name: string;
  description: string;
  category: string;
  style: string;
  coordinator: {
    name: string;
    cpf: string;
    phone: string;
    email: string;
  };
  members: Array<{
    name: string;
    role: string;
    age?: number;
    experience?: string;
    cpf?: string;
  }>;
  formation: {
    foundingDate: Date;
    origin: string;
    influences?: string[];
  };
  portfolio: {
    biography?: string;
    discography?: string[];
    awards?: string[];
    presentations?: Array<{
      event: string;
      date: Date;
      location: string;
    }>;
  };
  contact: {
    address?: string;
    socialMedia?: {
      instagram?: string;
      facebook?: string;
      youtube?: string;
      website?: string;
    };
  };
  resources?: {
    equipment?: string[];
    specialNeeds?: string[];
    transportNeeds: boolean;
  };
  isActive: boolean;
}

interface ValidatedCulturalWorkshopData {
  title: string;
  description: string;
  category: string;
  level: string;
  instructor: {
    name: string;
    bio: string;
    experience: string;
    contact: {
      phone: string;
      email: string;
    };
  };
  schedule: {
    startDate: Date;
    endDate: Date;
    weekdays: string[];
    time: {
      start: string;
      end: string;
    };
    totalHours: number;
  };
  location: {
    spaceId?: string;
    customLocation?: string;
    requirements?: string[];
  };
  enrollment: {
    maxParticipants: number;
    currentParticipants: number;
    minAge?: number;
    maxAge?: number;
    requirements?: string[];
    registrationStart: Date;
    registrationEnd: Date;
  };
  fees: {
    isFree: boolean;
    amount?: number;
    materials: {
      included: boolean;
      cost?: number;
      list?: string[];
    };
  };
  content: {
    objectives: string[];
    syllabus: string[];
    methodology: string;
    evaluation?: string;
  };
  certification?: {
    provided: boolean;
    requirements?: string[];
  };
  status: string;
}

interface ValidatedCulturalAttendanceData {
  citizenId: string;
  citizenName: string;
  contact: string;
  phone: string;
  email?: string;
  serviceType: string;
  subject: string;
  description: string;
  category?: string;
  culturalArea?: string;
  eventDate?: Date;
  relatedId?: string;
  documents?: string[];
  resolution?: string;
  followUpNeeded: boolean;
  followUpDate?: Date;
}

// Dashboard interfaces
interface CultureDashboardData {
  activeSpaces: number;
  approvedProjects: number;
  upcomingEvents: number;
  activeWorkshops: number;
  registeredGroups: number;
  attendancesMonth: number;
  eventCategoryStats: Record<string, number>;
  projectStatusStats: Record<string, number>;
}

// Prisma where interfaces
interface CulturalSpaceWhere {
  tenantId: string;
  type?: string;
  isActive?: boolean;
  capacity?: { gte: number };
}

interface CulturalProjectWhere {
  tenantId: string;
  category?: string;
  type?: string;
  status?: string;
  organizer?: {
    path: string[];
    string_contains: string;
  };
}

interface CulturalEventWhere {
  tenantId: string;
  type?: string;
  category?: string;
  status?: string;
  spaceId?: string;
  schedule?: {
    path: string[];
    gte?: Date;
    lte?: Date;
    lt?: Date;
  };
}

interface ArtistGroupWhere {
  tenantId: string;
  category?: string;
  style?: { contains: string; mode: 'insensitive' };
  isActive?: boolean;
  OR?: Array<{
    name?: { contains: string; mode: 'insensitive' };
    coordinator?: { path: string[]; string_contains: string };
  }>;
}

interface CulturalWorkshopWhere {
  tenantId: string;
  category?: string;
  level?: string;
  status?: string;
  instructor?: {
    path: string[];
    string_contains: string;
  };
}

interface CulturalAttendanceWhere {
  tenantId: string;
  citizenId?: string;
  serviceType?: string;
  culturalArea?: string;
  createdAt?: { gte: Date };
}

// ====================== MIDDLEWARE LOCAIS ======================

const router = Router();

// Middleware global
router.use(tenantMiddleware);
router.use(adminAuthMiddleware);

// ====================== SCHEMAS DE VALIDAÇÃO ======================

const culturalSpaceSchema = z.object({
  name: z.string().min(2, 'Nome é obrigatório'),
  description: z.string().min(10, 'Descrição é obrigatória'),
  type: z.enum([
    'teatro',
    'cinema',
    'biblioteca',
    'museu',
    'centro_cultural',
    'galeria',
    'auditorio',
    'praca',
  ]),
  address: z.string().min(5, 'Endereço é obrigatório'),
  coordinates: z
    .object({
      lat: z.number(),
      lng: z.number(),
    })
    .optional(),
  capacity: z.number().int().min(1, 'Capacidade deve ser maior que 0'),
  facilities: z.array(z.string()).optional(),
  equipment: z.array(z.string()).optional(),
  accessibility: z.object({
    wheelchairAccess: z.boolean(),
    audioDescription: z.boolean(),
    signLanguage: z.boolean(),
    braille: z.boolean(),
  }),
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
    website: z.string().optional(),
  }),
  pricing: z.object({
    isFree: z.boolean(),
    ticketPrice: z.number().min(0).optional(),
    discounts: z
      .array(
        z.object({
          category: z.string(),
          percentage: z.number().min(0).max(100),
        })
      )
      .optional(),
  }),
  photos: z.array(z.string()).optional(),
  isActive: z.boolean().default(true),
});

const culturalProjectSchema = z.object({
  title: z.string().min(2, 'Título é obrigatório'),
  description: z.string().min(20, 'Descrição é obrigatória'),
  category: z.enum([
    'musica',
    'teatro',
    'danca',
    'literatura',
    'artes_visuais',
    'cinema',
    'artesanato',
    'patrimonio',
  ]),
  type: z.enum(['apresentacao', 'oficina', 'exposicao', 'festival', 'concurso', 'residencia']),
  organizer: z.object({
    name: z.string().min(2, 'Nome do organizador é obrigatório'),
    type: z.enum(['pessoa_fisica', 'pessoa_juridica', 'coletivo', 'orgao_publico']),
    cpfCnpj: z.string().min(11, 'CPF/CNPJ é obrigatório'),
    phone: z.string(),
    email: z.string().email(),
  }),
  targetAudience: z.array(z.enum(['criancas', 'jovens', 'adultos', 'idosos', 'pcd', 'geral'])),
  location: z.object({
    spaceId: z.string().optional(),
    customLocation: z.string().optional(),
    isVirtual: z.boolean().default(false),
  }),
  schedule: z.object({
    startDate: z.string().transform(str => new Date(str)),
    endDate: z.string().transform(str => new Date(str)),
    timeSlots: z.array(
      z.object({
        date: z.string().transform(str => new Date(str)),
        startTime: z.string(),
        endTime: z.string(),
      })
    ),
  }),
  budget: z.object({
    totalCost: z.number().min(0),
    funding: z.array(
      z.object({
        source: z.string(),
        amount: z.number().min(0),
        type: z.enum(['publico', 'privado', 'proprio', 'patrocinio']),
      })
    ),
    expenses: z
      .array(
        z.object({
          category: z.string(),
          amount: z.number().min(0),
          description: z.string(),
        })
      )
      .optional(),
  }),
  participants: z.object({
    expectedCount: z.number().int().min(1),
    registrationRequired: z.boolean(),
    maxParticipants: z.number().int().min(1).optional(),
  }),
  status: z
    .enum([
      'submetido',
      'em_analise',
      'aprovado',
      'rejeitado',
      'em_execucao',
      'concluido',
      'cancelado',
    ])
    .default('submetido'),
  documentation: z.array(z.string()).optional(),
});

const culturalEventSchema = z.object({
  title: z.string().min(2, 'Título é obrigatório'),
  description: z.string().min(10, 'Descrição é obrigatória'),
  type: z.enum([
    'show',
    'peca_teatro',
    'exposicao',
    'festival',
    'workshop',
    'palestra',
    'sarau',
    'feira',
  ]),
  category: z.enum([
    'musica',
    'teatro',
    'danca',
    'literatura',
    'artes_visuais',
    'cinema',
    'artesanato',
    'patrimonio',
  ]),
  spaceId: z.string().optional(),
  customLocation: z.string().optional(),
  organizer: z.string().min(2, 'Organizador é obrigatório'),
  performers: z
    .array(
      z.object({
        name: z.string(),
        role: z.string(),
        bio: z.string().optional(),
      })
    )
    .optional(),
  schedule: z.object({
    date: z.string().transform(str => new Date(str)),
    startTime: z.string(),
    endTime: z.string(),
    duration: z.number().int().min(30), // minutos
  }),
  audience: z.object({
    targetAge: z.array(z.enum(['criancas', 'jovens', 'adultos', 'idosos', 'livre'])),
    expectedCount: z.number().int().min(1),
    capacity: z.number().int().min(1),
  }),
  ticketing: z.object({
    isFree: z.boolean(),
    price: z.number().min(0).optional(),
    salesStart: z
      .string()
      .transform(str => new Date(str))
      .optional(),
    salesEnd: z
      .string()
      .transform(str => new Date(str))
      .optional(),
    ticketsAvailable: z.number().int().min(0).optional(),
  }),
  requirements: z.object({
    equipment: z.array(z.string()).optional(),
    technicalRider: z.string().optional(),
    accessibility: z.array(z.string()).optional(),
  }),
  promotion: z
    .object({
      poster: z.string().optional(),
      socialMedia: z.array(z.string()).optional(),
      pressRelease: z.string().optional(),
    })
    .optional(),
  status: z
    .enum(['planejado', 'confirmado', 'vendendo', 'esgotado', 'realizado', 'cancelado'])
    .default('planejado'),
});

const artistGroupSchema = z.object({
  name: z.string().min(2, 'Nome do grupo é obrigatório'),
  description: z.string().min(20, 'Descrição é obrigatória'),
  category: z.enum([
    'musica',
    'teatro',
    'danca',
    'literatura',
    'artes_visuais',
    'cinema',
    'multidisciplinar',
  ]),
  style: z.string().min(2, 'Estilo/Gênero é obrigatório'),
  coordinator: z.object({
    name: z.string().min(2, 'Nome do coordenador é obrigatório'),
    cpf: z.string().min(11, 'CPF é obrigatório'),
    phone: z.string(),
    email: z.string().email(),
  }),
  members: z.array(
    z.object({
      name: z.string(),
      role: z.string(),
      age: z.number().int().min(0).optional(),
      experience: z.string().optional(),
      cpf: z.string().optional(),
    })
  ),
  formation: z.object({
    foundingDate: z.string().transform(str => new Date(str)),
    origin: z.string(),
    influences: z.array(z.string()).optional(),
  }),
  portfolio: z.object({
    biography: z.string().optional(),
    discography: z.array(z.string()).optional(),
    awards: z.array(z.string()).optional(),
    presentations: z
      .array(
        z.object({
          event: z.string(),
          date: z.string().transform(str => new Date(str)),
          location: z.string(),
        })
      )
      .optional(),
  }),
  contact: z.object({
    address: z.string().optional(),
    socialMedia: z
      .object({
        instagram: z.string().optional(),
        facebook: z.string().optional(),
        youtube: z.string().optional(),
        website: z.string().optional(),
      })
      .optional(),
  }),
  resources: z
    .object({
      equipment: z.array(z.string()).optional(),
      specialNeeds: z.array(z.string()).optional(),
      transportNeeds: z.boolean().default(false),
    })
    .optional(),
  isActive: z.boolean().default(true),
});

const culturalWorkshopSchema = z.object({
  title: z.string().min(2, 'Título é obrigatório'),
  description: z.string().min(20, 'Descrição é obrigatória'),
  category: z.enum([
    'musica',
    'teatro',
    'danca',
    'literatura',
    'artes_visuais',
    'artesanato',
    'cinema',
  ]),
  level: z.enum(['iniciante', 'intermediario', 'avancado', 'livre']),
  instructor: z.object({
    name: z.string().min(2, 'Nome é obrigatório'),
    bio: z.string().min(10, 'Biografia é obrigatória'),
    experience: z.string(),
    contact: z.object({
      phone: z.string(),
      email: z.string().email(),
    }),
  }),
  schedule: z.object({
    startDate: z.string().transform(str => new Date(str)),
    endDate: z.string().transform(str => new Date(str)),
    weekdays: z.array(
      z.enum(['segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado', 'domingo'])
    ),
    time: z.object({
      start: z.string(),
      end: z.string(),
    }),
    totalHours: z.number().min(1),
  }),
  location: z.object({
    spaceId: z.string().optional(),
    customLocation: z.string().optional(),
    requirements: z.array(z.string()).optional(),
  }),
  enrollment: z.object({
    maxParticipants: z.number().int().min(1),
    currentParticipants: z.number().int().min(0).default(0),
    minAge: z.number().int().min(0).optional(),
    maxAge: z.number().int().optional(),
    requirements: z.array(z.string()).optional(),
    registrationStart: z.string().transform(str => new Date(str)),
    registrationEnd: z.string().transform(str => new Date(str)),
  }),
  fees: z.object({
    isFree: z.boolean(),
    amount: z.number().min(0).optional(),
    materials: z.object({
      included: z.boolean(),
      cost: z.number().min(0).optional(),
      list: z.array(z.string()).optional(),
    }),
  }),
  content: z.object({
    objectives: z.array(z.string()),
    syllabus: z.array(z.string()),
    methodology: z.string(),
    evaluation: z.string().optional(),
  }),
  certification: z
    .object({
      provided: z.boolean(),
      requirements: z.array(z.string()).optional(),
    })
    .optional(),
  status: z
    .enum(['planejado', 'inscricoes_abertas', 'em_andamento', 'concluido', 'cancelado'])
    .default('planejado'),
});

const culturalAttendanceSchema = z.object({
  citizenId: z.string().min(1, 'Cidadão é obrigatório'),
  citizenName: z.string().min(2, 'Nome do cidadão é obrigatório'),
  contact: z.string().min(5, 'Contato é obrigatório'),
  phone: z.string().min(10, 'Telefone é obrigatório'),
  email: z.string().email('Email inválido').optional(),
  serviceType: z.enum([
    'inscricao_projeto',
    'reserva_espaco',
    'informacoes',
    'cadastro_grupo',
    'apoio_cultural',
    'denuncia',
  ]),
  subject: z.string().min(5, 'Assunto é obrigatório'),
  description: z.string().min(10, 'Descrição é obrigatória'),
  category: z.enum([
    'musica',
    'teatro',
    'danca',
    'literatura',
    'artes_visuais',
    'cinema',
    'artesanato',
    'patrimonio',
    'geral',
  ]).optional(),
  culturalArea: z
    .enum([
      'musica',
      'teatro',
      'danca',
      'literatura',
      'artes_visuais',
      'cinema',
      'artesanato',
      'patrimonio',
      'geral',
    ])
    .optional(),
  eventDate: z
    .string()
    .transform(str => new Date(str))
    .optional(),
  relatedId: z.string().optional(), // ID do projeto, espaço, evento, etc.
  documents: z.array(z.string()).optional(),
  resolution: z.string().optional(),
  followUpNeeded: z.boolean().default(false),
  followUpDate: z
    .string()
    .transform(str => new Date(str))
    .optional(),
});

// ====================== ESPAÇOS CULTURAIS ======================

// GET /api/specialized/culture/spaces
router.get(
  '/spaces',
  requirePermission('culture:read') ,
  async (
    req: AuthenticatedRequest,
    res: Response
  ) => {
    try {
      const type = getStringParam(req.query.type);
      const isActive = getStringParam(req.query.isActive);
      const capacity = getStringParam(req.query.capacity);
      const city = getStringParam(req.query.city);

      const where: any = { tenantId: req.tenantId };
      if (type) where.type = type;
      if (isActive !== undefined) where.available = isActive === 'true';
      if (capacity) where.capacity = { gte: Number(capacity) };
      if (city) where.neighborhood = { contains: city, mode: 'insensitive' };

      const spaces = await prisma.culturalSpace.findMany({
        where,
        orderBy: { name: 'asc' },
      });

      return res.json(createSuccessResponse(spaces));
    } catch (error) {
      console.error('Erro ao buscar espaços culturais:', error);
      return res.status(500).json(createErrorResponse('INTERNAL_ERROR', 'Erro interno do servidor'));
    }
  }
);

// POST /api/specialized/culture/spaces
router.post(
  '/spaces',
  requirePermission('culture:write') ,
  handleAsyncRoute(async (req, res) => {
    const validatedData = validateSchemaAndRespond(culturalSpaceSchema, req.body, res);
    if (!validatedData) return;

    const space = await prisma.culturalSpace.create({
      data: {
        code: `SPACE-${Date.now()}`,
        name: validatedData.name,
        description: validatedData.description,
        type: validatedData.type,
        address: JSON.stringify(validatedData.address),
        coordinates: validatedData.coordinates ? (JSON.stringify(validatedData.coordinates) as Prisma.InputJsonValue) : undefined,
        neighborhood: validatedData.address || 'Centro', // Default ou extrair do endereço
        zipCode: '00000-000', // Default ou extrair do endereço
        capacity: validatedData.capacity,
        infrastructure: validatedData.facilities ? (JSON.stringify(validatedData.facilities) as Prisma.InputJsonValue) : undefined,
        equipment: validatedData.equipment ? (JSON.stringify(validatedData.equipment) as Prisma.InputJsonValue) : undefined,
        accessibility: validatedData.accessibility?.wheelchairAccess || false,
        manager: validatedData.manager,
        contact: JSON.stringify(validatedData.contact),
        operatingHours: JSON.stringify(validatedData.operatingHours),
        tenantId: req.tenantId!,
      },
    });

    res.status(201).json(createSuccessResponse(space, 'Espaço cultural criado com sucesso'));
  })
);

// ====================== PROJETOS CULTURAIS ======================

// GET /api/specialized/culture/projects
router.get(
  '/projects',
  requirePermission('culture:read') ,
  handleAsyncRoute(async (req, res) => {
    const category = getStringParam(req.query.category);
    const type = getStringParam(req.query.type);
    const status = getStringParam(req.query.status);
    const organizer = getStringParam(req.query.organizer);
    const page = getStringParam(req.query.page) || '1';
    const limit = getStringParam(req.query.limit) || '20';

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;
    const where: any = { tenantId: req.tenantId };

    if (category) where.type = category;
    if (type) where.type = type;
    if (status) where.currentStatus = status;
    if (organizer) where.responsible = { contains: organizer, mode: 'insensitive' };

    const [projects, total] = await Promise.all([
      prisma.culturalProject.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limitNum,
      }),
      prisma.culturalProject.count({ where }),
    ]);

    res.json(createPaginatedResponse(projects, pageNum, limitNum, total));
  })
);

// POST /api/specialized/culture/projects
router.post(
  '/projects',
  requirePermission('culture:write') ,
  handleAsyncRoute(async (req, res) => {
    const validatedData = validateSchemaAndRespond(culturalProjectSchema, req.body, res);
    if (!validatedData) return;

    const project = await prisma.culturalProject.create({
      data: {
        name: validatedData.title,
        description: validatedData.description,
        type: validatedData.category,
        responsible: validatedData.organizer?.name || 'N/A',
        startDate: validatedData.schedule?.startDate,
        endDate: validatedData.schedule?.endDate,
        budget: validatedData.budget?.totalCost || 0,
        currentStatus: 'PLANNING',
        tenantId: req.tenantId!,
      },
    });

    res.status(201).json(createSuccessResponse(project, 'Projeto cultural criado com sucesso'));
  })
);

// ====================== EVENTOS CULTURAIS ======================

// GET /api/specialized/culture/events
router.get(
  '/events',
  requirePermission('culture:read') ,
  handleAsyncRoute(async (req, res) => {
    const type = getStringParam(req.query.type);
    const category = getStringParam(req.query.category);
    const status = getStringParam(req.query.status);
    const spaceId = getStringParam(req.query.spaceId);
    const month = getStringParam(req.query.month);
    const year = getStringParam(req.query.year);

    const where: any = { tenantId: req.tenantId };
    if (type) where.type = type;
    if (category) where.category = category;
    if (status) where.status = status;
    if (spaceId) where.spaceId = spaceId;

    if (month && year) {
      const startDate = new Date(Number(year), Number(month) - 1, 1);
      const endDate = new Date(Number(year), Number(month), 0, 23, 59, 59);
      where.startDate = {
        gte: startDate,
        lte: endDate,
      };
    }

    const events = await prisma.culturalEvent.findMany({
      where,
      include: {
        space: { select: { id: true, name: true, type: true } },
      },
      orderBy: { startDate: 'asc' },
    });

    res.json(createSuccessResponse(events));
  })
);

// POST /api/specialized/culture/events
router.post(
  '/events',
  requirePermission('culture:write') ,
  handleAsyncRoute(async (req, res) => {
    const validatedData = validateSchemaAndRespond(culturalEventSchema, req.body, res);
    if (!validatedData) return;

    const event = await prisma.culturalEvent.create({
      data: {
        title: validatedData.title,
        description: validatedData.description,
        category: validatedData.category,
        type: validatedData.type,
        startDate: validatedData.schedule.date,
        endDate: validatedData.schedule.date,
        schedule: JSON.stringify(validatedData.schedule),
        venue: validatedData.customLocation || 'Local a definir',
        capacity: validatedData.audience.capacity,
        targetAudience: validatedData.audience.targetAge.join(', '),
        ticketPrice: validatedData.ticketing.price || 0,
        freeEvent: validatedData.ticketing.isFree,
        organizer: JSON.stringify({ name: validatedData.organizer }),
        performers: validatedData.performers ? (JSON.stringify(validatedData.performers) as Prisma.InputJsonValue) : undefined,
        contact: JSON.stringify({ organizer: validatedData.organizer }),
        spaceId: validatedData.spaceId,
        tenantId: req.tenantId!,
      },
      include: {
        space: { select: { id: true, name: true, type: true } },
      },
    });

    res.status(201).json(createSuccessResponse(event, 'Evento cultural criado com sucesso'));
  })
);

// ====================== GRUPOS ARTÍSTICOS ======================

// GET /api/specialized/culture/groups
router.get(
  '/groups',
  requirePermission('culture:read') ,
  async (
    req: AuthenticatedRequest,
    res: Response
  ) => {
    try {
      const category = getStringParam(req.query.category);
      const style = getStringParam(req.query.style);
      const isActive = getStringParam(req.query.isActive);
      const search = getStringParam(req.query.search);
      const page = getStringParam(req.query.page) || '1';
      const limit = getStringParam(req.query.limit) || '20';

      const skip = (Number(page) - 1) * Number(limit);
      const where: any = { tenantId: req.tenantId };

      if (category) where.category = category;
      if (style) where.style = { contains: style, mode: 'insensitive' };
      if (isActive !== undefined) where.isActive = isActive === 'true';
      if (search) {
        where.OR = [
          { name: { contains: search, mode: 'insensitive' } },
          { coordinator: { path: ['name'], string_contains: search } },
        ];
      }

      const [groups, total] = await Promise.all([
        prisma.artisticGroup.findMany({
          where,
          orderBy: { name: 'asc' },
          skip,
          take: Number(limit),
        }),
        prisma.artisticGroup.count({ where }),
      ]);

      const response = createPaginatedResponse(
        groups,
        Number(page),
        Number(limit),
        total
      );
      res.json(createSuccessResponse(response, 'Grupos artísticos encontrados'));
    } catch (error) {
      console.error('Erro ao buscar grupos artísticos:', error);
      res.status(500).json(createErrorResponse('INTERNAL_ERROR', 'Erro interno do servidor'));
    }
  }
);

// POST /api/specialized/culture/groups
router.post(
  '/groups',
  requirePermission('culture:write') ,
  async (
    req: AuthenticatedRequest,
    res: Response
  ) => {
    try {
      const validatedData = artistGroupSchema.parse(req.body);

      const group = await prisma.artisticGroup.create({
        data: {
          name: validatedData.name,
          category: validatedData.category,
          foundationDate: null,
          responsible: validatedData.coordinator?.name || 'Não informado',
          contact: typeof validatedData.contact === 'string' ? validatedData.contact : JSON.stringify(validatedData.contact),
          members: validatedData.members,
          status: 'ACTIVE',
          tenantId: req.tenantId!,
        },
      });

      return res.status(201).json(createSuccessResponse(group, 'Grupo artístico criado'));
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json(createErrorResponse('VALIDATION_ERROR', 'Dados inválidos'));
      }
      console.error('Erro ao registrar grupo artístico:', error);
      return res.status(500).json(createErrorResponse('INTERNAL_ERROR', 'Erro interno do servidor'));
    }
  }
);

// ====================== OFICINAS E CURSOS ======================

// GET /api/specialized/culture/workshops
router.get(
  '/workshops',
  requirePermission('culture:read') ,
  async (
    req: AuthenticatedRequest,
    res: Response
  ) => {
    try {
      const category = getStringParam(req.query.category);
      const level = getStringParam(req.query.level);
      const status = getStringParam(req.query.status);
      const instructor = getStringParam(req.query.instructor);
      const page = getStringParam(req.query.page) || '1';
      const limit = getStringParam(req.query.limit) || '20';

      const skip = (Number(page) - 1) * Number(limit);
      const where: any = { tenantId: req.tenantId };

      if (category) where.category = category;
      if (level) where.level = level;
      if (status) where.status = status;
      if (instructor) {
        where.instructor = {
          path: ['name'],
          string_contains: instructor,
        };
      }

      const [workshops, total] = await Promise.all([
        prisma.culturalWorkshop.findMany({
          where,
          // Removing include as space relationship may not exist
          orderBy: { createdAt: 'desc' },
          skip,
          take: Number(limit),
        }),
        prisma.culturalWorkshop.count({ where }),
      ]);

      const response = createPaginatedResponse(
        workshops,
        Number(page),
        Number(limit),
        total
      );
      return res.json(createSuccessResponse(response, 'Oficinas culturais encontradas'));
    } catch (error) {
      console.error('Erro ao buscar oficinas culturais:', error);
      return res.status(500).json(createErrorResponse('INTERNAL_ERROR', 'Erro interno do servidor'));
    }
  }
);

// POST /api/specialized/culture/workshops
router.post(
  '/workshops',
  requirePermission('culture:write') ,
  async (
    req: AuthenticatedRequest,
    res: Response
  ) => {
    try {
      const validatedData = culturalWorkshopSchema.parse(req.body);

      const workshop = await prisma.culturalWorkshop.create({
        data: {
          name: validatedData.title,
          description: validatedData.description,
          category: validatedData.category,
          instructor: typeof validatedData.instructor === 'string' ? validatedData.instructor : (validatedData.instructor?.name || 'A definir'),
          startDate: new Date(validatedData.schedule?.startDate || Date.now()),
          endDate: new Date(validatedData.schedule?.endDate || Date.now()),
          schedule: typeof validatedData.schedule === 'string' ? validatedData.schedule : JSON.stringify(validatedData.schedule || {}),
          maxParticipants: 20,
          currentParticipants: 0,
          isFree: true,
          status: 'PLANNED',
          tenantId: req.tenantId!,
        },
      });

      return res.status(201).json(createSuccessResponse(workshop, 'Oficina cultural criada'));
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json(createErrorResponse('VALIDATION_ERROR', 'Dados inválidos'));
      }
      console.error('Erro ao criar oficina cultural:', error);
      return res.status(500).json(createErrorResponse('INTERNAL_ERROR', 'Erro interno do servidor'));
    }
  }
);

// ====================== MANIFESTAÇÕES CULTURAIS ======================

// GET /api/specialized/culture/manifestations
router.get(
  '/manifestations',
  requirePermission('culture:read') ,
  async (
    req: AuthenticatedRequest,
    res: Response
  ) => {
    try {
      // Para manifestações culturais, vamos usar os grupos artísticos como base
      const category = getStringParam(req.query.category);
      const region = getStringParam(req.query.region);
      const traditional = getStringParam(req.query.traditional);

      const where: any = { tenantId: req.tenantId };
      if (category) where.category = category;

      const manifestations = await prisma.artisticGroup.findMany({
        where,
        orderBy: { name: 'asc' },
      });

      return res.json(createSuccessResponse(manifestations, 'Manifestações culturais encontradas'));
    } catch (error) {
      console.error('Erro ao buscar manifestações culturais:', error);
      return res.status(500).json(createErrorResponse('INTERNAL_ERROR', 'Erro interno do servidor'));
    }
  }
);

// POST /api/specialized/culture/manifestations
router.post(
  '/manifestations',
  requirePermission('culture:write') ,
  async (
    req: AuthenticatedRequest,
    res: Response
  ) => {
    try {
      const validatedData = artistGroupSchema.parse(req.body);

      const manifestation = await prisma.artisticGroup.create({
        data: {
          name: validatedData.name,
          category: validatedData.category,
          foundationDate: null,
          responsible: validatedData.coordinator?.name || 'Não informado',
          contact: typeof validatedData.contact === 'string' ? validatedData.contact : JSON.stringify(validatedData.contact),
          members: validatedData.members,
          status: 'ACTIVE',
          tenantId: req.tenantId!,
        },
      });

      return res.status(201).json(createSuccessResponse(manifestation, 'Manifestação cultural criada'));
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json(createErrorResponse('VALIDATION_ERROR', 'Dados inválidos'));
      }
      console.error('Erro ao registrar manifestação cultural:', error);
      return res.status(500).json(createErrorResponse('INTERNAL_ERROR', 'Erro interno do servidor'));
    }
  }
);

// ====================== ATENDIMENTOS DA SECRETARIA ======================

// GET /api/specialized/culture/attendances
router.get(
  '/attendances',
  requirePermission('culture:read') ,
  async (
    req: AuthenticatedRequest,
    res: Response
  ) => {
    try {
      const citizenId = getStringParam(req.query.citizenId);
      const serviceType = getStringParam(req.query.serviceType);
      const culturalArea = getStringParam(req.query.culturalArea);
      const page = getStringParam(req.query.page) || '1';
      const limit = getStringParam(req.query.limit) || '20';

      const skip = (Number(page) - 1) * Number(limit);
      const where: any = { tenantId: req.tenantId };

      if (citizenId) where.citizenId = citizenId;
      if (serviceType) where.serviceType = serviceType;
      if (culturalArea) where.culturalArea = culturalArea;

      const [attendances, total] = await Promise.all([
        prisma.culturalAttendance.findMany({
          where,
          // Removed include as citizen relationship may not exist
          orderBy: { createdAt: 'desc' },
          skip,
          take: Number(limit),
        }),
        prisma.culturalAttendance.count({ where }),
      ]);

      const response = createPaginatedResponse(
        attendances,
        Number(page),
        Number(limit),
        total
      );
      return res.json(createSuccessResponse(response, 'Atendimentos encontrados'));
    } catch (error) {
      console.error('Erro ao buscar atendimentos:', error);
      return res.status(500).json(createErrorResponse('INTERNAL_ERROR', 'Erro interno do servidor'));
    }
  }
);

// POST /api/specialized/culture/attendances
router.post(
  '/attendances',
  requirePermission('culture:write') ,
  async (
    req: AuthenticatedRequest,
    res: Response
  ) => {
    try {
      const validatedData = culturalAttendanceSchema.parse(req.body);

      const attendance = await prisma.culturalAttendance.create({
        data: {
          protocol: `CULT-${Date.now()}`,
          citizenId: validatedData.citizenId,
          citizenName: validatedData.citizenName || 'Nome não informado',
          contact: validatedData.contact || 'Contato não informado',
          phone: validatedData.phone,
          email: validatedData.email,
          type: validatedData.serviceType || 'informacoes',
          status: 'PENDING',
          description: validatedData.description,
          subject: validatedData.subject,
          category: validatedData.category,
          eventDate: validatedData.eventDate ? new Date(validatedData.eventDate) : null,
          followUpDate: validatedData.followUpDate ? new Date(validatedData.followUpDate) : null,
          tenantId: req.tenantId!,
        },
      });

      return res.status(201).json(createSuccessResponse(attendance, 'Atendimento criado'));
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json(createErrorResponse('VALIDATION_ERROR', 'Dados inválidos'));
      }
      console.error('Erro ao registrar atendimento:', error);
      return res.status(500).json(createErrorResponse('INTERNAL_ERROR', 'Erro interno do servidor'));
    }
  }
);

// ====================== DASHBOARD E MÉTRICAS ======================

// GET /api/specialized/culture/dashboard
router.get(
  '/dashboard',
  requirePermission('culture:read') ,
  async (
    req: CultureRequest,
    res: Response<SuccessResponse<CultureDashboardData> | ErrorResponse>
  ) => {
    try {
      const today = new Date();
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);

      const [
        activeSpaces,
        approvedProjects,
        upcomingEvents,
        activeWorkshops,
        registeredGroups,
        attendancesMonth,
        eventsByCategory,
        projectsByStatus,
      ] = await Promise.all([
        // Espaços culturais ativos
        prisma.culturalSpace.count({
          where: { tenantId: req.tenantId, isActive: true },
        }),

        // Projetos aprovados
        prisma.culturalProject.count({
          where: {
            tenantId: req.tenantId,
            status: { in: ['aprovado', 'em_execucao'] },
          },
        }),

        // Eventos próximos (próximo mês)
        prisma.culturalEvent.count({
          where: {
            tenantId: req.tenantId,
            startDate: {
              gte: today,
              lt: nextMonth,
            },
            status: { in: ['planejado', 'confirmado', 'vendendo'] },
          },
        }),

        // Oficinas ativas
        prisma.culturalWorkshop.count({
          where: {
            tenantId: req.tenantId,
            status: { in: ['inscricoes_abertas', 'em_andamento'] },
          },
        }),

        // Grupos artísticos registrados
        prisma.artisticGroup.count({
          where: { tenantId: req.tenantId, status: 'ACTIVE' },
        }),

        // Atendimentos este mês
        prisma.culturalAttendance.count({
          where: {
            tenantId: req.tenantId,
            createdAt: { gte: startOfMonth },
          },
        }),

        // Eventos por categoria
        prisma.culturalEvent.groupBy({
          by: ['category'],
          where: { tenantId: req.tenantId },
          _count: true,
        }),

        // Projetos por status
        prisma.culturalProject.groupBy({
          by: ['status'],
          where: { tenantId: req.tenantId },
          _count: true,
        }),
      ]);

      const eventCategoryStats = eventsByCategory.reduce(
        (acc: Record<string, number>, item: CultureStatsItem) => {
          acc[item.category || 'unknown'] = item._count;
          return acc;
        },
        {} as Record<string, number>
      );

      const projectStatusStats = projectsByStatus.reduce(
        (acc: Record<string, number>, item: CultureStatsItem) => {
          acc[item.status || 'unknown'] = item._count;
          return acc;
        },
        {} as Record<string, number>
      );

      const dashboardData: CultureDashboardData = {
        activeSpaces,
        approvedProjects,
        upcomingEvents,
        activeWorkshops,
        registeredGroups,
        attendancesMonth,
        eventCategoryStats,
        projectStatusStats,
      };

      res.json(createSuccessResponse(dashboardData, 'Dashboard de cultura carregado'));
    } catch (error) {
      console.error('Erro ao buscar dados do dashboard:', error);
      res.status(500).json(createErrorResponse('INTERNAL_ERROR', 'Erro interno do servidor'));
    }
  }
);

export default router;
