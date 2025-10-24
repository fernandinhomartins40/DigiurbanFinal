// ============================================================================
// TOURISM.TS - ISOLAMENTO PROFISSIONAL COMPLETO
// ============================================================================

import { Router, Response, NextFunction } from 'express';
import { z } from 'zod';
import { Prisma } from '@prisma/client';
import { prisma } from '../../lib/prisma';
import { AuthenticatedRequest, SuccessResponse, ErrorResponse } from '../../types';
import { asyncHandler } from '../../utils/express-helpers';
import { tenantMiddleware } from '../../middleware/tenant';
import { adminAuthMiddleware, requirePermission as requirePermissionMiddleware } from '../../middleware/admin-auth';

// ====================== TIPOS E INTERFACES ISOLADAS ======================

const requirePermission = requirePermissionMiddleware;

// Tipo helper para GroupBy results
interface GroupByResult {
  _count: Record<string, number> | number;
  type?: string;
  businessInfo?: unknown;
}

// ====================== HELPER FUNCTIONS ======================

function createSuccessResponse<T>(data: T, message?: string): SuccessResponse<T> {
  return {
    success: true,
    data,
    ...(message && { message }),
  };
}

function createErrorResponse(error: string, message: string, details?: unknown): ErrorResponse {
  return {
    success: false,
    error,
    message,
    details,
  };
}


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



function isAuthenticatedRequest(req: AuthenticatedRequest): boolean {
  return !!(req.user && req.tenant);
}


// ====================== MIDDLEWARE FUNCTIONS ======================

// ====================== INTERFACES ESPECÍFICAS ======================

interface TourismAttractionWhereInput {
  tenantId: string;
  isActive?: boolean;
  type?: string;
  category?: string;
  featured?: boolean;
  name?: { contains: string; mode: 'insensitive' };
  address?: { contains: string; mode: 'insensitive' };
}

interface TourismBusinessWhereInput {
  tenantId: string;
  isActive?: boolean;
  businessType?: string;
  category?: string;
  type?: string;
  status?: string;
  isTourismPartner?: boolean;
  isPartner?: boolean;
  businessInfo?: { path: string[]; string_contains: string };
  location?: { path: string[]; string_contains?: string; not?: null };
  name?: { contains: string; mode: 'insensitive' };
  owner?: { contains: string; mode: 'insensitive' };
  AND?: unknown[];
}

interface TourismEventWhereInput {
  tenantId: string;
  isActive?: boolean;
  type?: string;
  status?: string;
  category?: string;
  publication?: { path: string[]; string_contains: string };
  target?: { path: string[]; string_contains: string };
}

interface TourismAttendanceWhereInput {
  tenantId: string;
  isActive?: boolean;
  citizenId?: string;
  serviceType?: string;
  touristProfile?: { path: string[]; string_contains?: string; equals?: boolean };
}

interface TourismDashboardWhereInput {
  tenantId: string;
  AND?: unknown[];
  businessType?: string;
}

// ====================== ROUTER SETUP ======================

const router = Router();

// Middleware para verificar tenant em todas as rotas
router.use(tenantMiddleware);
router.use(adminAuthMiddleware);

// ====================== SCHEMAS DE VALIDAÇÃO ======================

const touristAttractionSchema = z.object({
  name: z.string().min(2, 'Nome é obrigatório'),
  description: z.string().min(20, 'Descrição é obrigatória'),
  type: z.enum([
    'natural',
    'historico',
    'cultural',
    'religioso',
    'aventura',
    'gastronomico',
    'compras',
    'negocio',
  ]),
  category: z.enum([
    'ponto_turistico',
    'parque',
    'museu',
    'igreja',
    'praca',
    'monumento',
    'trilha',
    'cachoeira',
    'outro',
  ]),
  location: z.object({
    address: z.string().min(5, 'Endereço é obrigatório'),
    neighborhood: z.string().optional(),
    city: z.string(),
    state: z.string(),
    coordinates: z.object({
      lat: z.number(),
      lng: z.number(),
    }),
    accessType: z.enum(['livre', 'publico', 'privado', 'restrito']),
    accessInstructions: z.string().optional(),
  }),
  facilities: z.object({
    parking: z.boolean().default(false),
    restrooms: z.boolean().default(false),
    accessibility: z.boolean().default(false),
    restaurant: z.boolean().default(false),
    giftShop: z.boolean().default(false),
    guide: z.boolean().default(false),
    security: z.boolean().default(false),
    wifi: z.boolean().default(false),
    other: z.array(z.string()).optional(),
  }),
  visitInfo: z.object({
    operatingHours: z.object({
      monday: z.string().optional(),
      tuesday: z.string().optional(),
      wednesday: z.string().optional(),
      thursday: z.string().optional(),
      friday: z.string().optional(),
      saturday: z.string().optional(),
      sunday: z.string().optional(),
    }),
    entranceFee: z.object({
      isFree: z.boolean(),
      adultPrice: z.number().min(0).optional(),
      childPrice: z.number().min(0).optional(),
      seniorPrice: z.number().min(0).optional(),
      groupDiscount: z.number().min(0).max(100).optional(),
    }),
    bestTimeToVisit: z.array(z.enum(['manha', 'tarde', 'noite'])).optional(),
    estimatedDuration: z.number().min(0.5).optional(), // horas
    capacity: z.number().int().min(1).optional(),
    seasonality: z.enum(['ano_todo', 'verao', 'inverno', 'seca', 'chuva']).optional(),
  }),
  contact: z.object({
    phone: z.string().optional(),
    email: z.string().email().optional(),
    website: z.string().optional(),
    socialMedia: z
      .object({
        instagram: z.string().optional(),
        facebook: z.string().optional(),
        youtube: z.string().optional(),
      })
      .optional(),
  }),
  media: z.object({
    photos: z.array(z.string()).optional(),
    videos: z.array(z.string()).optional(),
    virtualTour: z.string().optional(),
  }),
  ratings: z.object({
    averageRating: z.number().min(0).max(5).default(0),
    totalReviews: z.number().int().min(0).default(0),
  }),
  isActive: z.boolean().default(true),
});

const localBusinessSchema = z.object({
  businessInfo: z.object({
    name: z.string().min(2, 'Nome é obrigatório'),
    tradeName: z.string().optional(),
    cnpj: z.string().min(14, 'CNPJ é obrigatório'),
    type: z.enum([
      'hotel',
      'pousada',
      'restaurante',
      'bar',
      'agencia_turismo',
      'transporte',
      'artesanato',
      'comercio',
      'servico',
    ]),
    category: z.string().min(2, 'Categoria é obrigatória'),
    description: z.string().min(20, 'Descrição é obrigatória'),
  }),
  owner: z.object({
    name: z.string().min(2, 'Nome do proprietário é obrigatório'),
    cpf: z.string().min(11, 'CPF é obrigatório'),
    phone: z.string(),
    email: z.string().email(),
  }),
  location: z.object({
    address: z.string().min(5, 'Endereço é obrigatório'),
    neighborhood: z.string().optional(),
    city: z.string(),
    state: z.string(),
    zipCode: z.string(),
    coordinates: z
      .object({
        lat: z.number(),
        lng: z.number(),
      })
      .optional(),
  }),
  services: z.object({
    offerings: z.array(z.string()),
    capacity: z.number().int().min(1).optional(),
    specialties: z.array(z.string()).optional(),
    languages: z.array(z.string()).optional(),
    paymentMethods: z
      .array(z.enum(['dinheiro', 'cartao_debito', 'cartao_credito', 'pix', 'cheque']))
      .optional(),
  }),
  operatingInfo: z.object({
    hours: z.object({
      monday: z.string().optional(),
      tuesday: z.string().optional(),
      wednesday: z.string().optional(),
      thursday: z.string().optional(),
      friday: z.string().optional(),
      saturday: z.string().optional(),
      sunday: z.string().optional(),
    }),
    seasonality: z.enum(['ano_todo', 'alta_temporada', 'baixa_temporada']).optional(),
    reservations: z
      .object({
        required: z.boolean(),
        contact: z.string().optional(),
        onlineBooking: z.string().optional(),
      })
      .optional(),
  }),
  pricing: z.object({
    priceRange: z.enum(['$', '$$', '$$$', '$$$$']).optional(),
    averageTicket: z.number().min(0).optional(),
    promotions: z.array(z.string()).optional(),
  }),
  certifications: z.object({
    touristRegistry: z.boolean().default(false),
    registryNumber: z.string().optional(),
    qualityCertifications: z.array(z.string()).optional(),
    licenses: z.array(z.string()).optional(),
  }),
  contact: z.object({
    phone: z.string(),
    alternativePhone: z.string().optional(),
    email: z.string().email(),
    website: z.string().optional(),
    socialMedia: z
      .object({
        instagram: z.string().optional(),
        facebook: z.string().optional(),
        whatsapp: z.string().optional(),
      })
      .optional(),
  }),
  media: z.object({
    logo: z.string().optional(),
    photos: z.array(z.string()).optional(),
    videos: z.array(z.string()).optional(),
    brochure: z.string().optional(),
  }),
  ratings: z.object({
    averageRating: z.number().min(0).max(5).default(0),
    totalReviews: z.number().int().min(0).default(0),
  }),
  isActive: z.boolean().default(true),
  isPartner: z.boolean().default(false),
});

const tourismProgramSchema = z.object({
  name: z.string().min(2, 'Nome do programa é obrigatório'),
  description: z.string().min(20, 'Descrição é obrigatória'),
  type: z.enum([
    'roteiro',
    'evento',
    'festival',
    'campanha',
    'capacitacao',
    'desenvolvimento',
    'promocional',
  ]),
  category: z.enum([
    'ecoturismo',
    'turismo_rural',
    'turismo_cultural',
    'turismo_religioso',
    'turismo_aventura',
    'turismo_gastronomico',
    'turismo_negocio',
  ]),
  organizer: z.object({
    name: z.string().min(2, 'Organizador é obrigatório'),
    type: z.enum(['secretaria', 'parceiro', 'empresa_privada', 'ong', 'associacao']),
    contact: z.object({
      phone: z.string(),
      email: z.string().email(),
      responsible: z.string(),
    }),
  }),
  itinerary: z.object({
    duration: z.object({
      days: z.number().int().min(1),
      hours: z.number().min(0).optional(),
    }),
    activities: z.array(
      z.object({
        name: z.string(),
        description: z.string(),
        location: z.string(),
        duration: z.number().min(0.5), // horas
        cost: z.number().min(0).optional(),
        included: z.boolean().default(true),
      })
    ),
    route: z.array(
      z.object({
        order: z.number().int().min(1),
        attraction: z.string(),
        arrivalTime: z.string().optional(),
        departureTime: z.string().optional(),
        transportMode: z.enum(['a_pe', 'onibus', 'van', 'carro', 'bicicleta', 'barco']).optional(),
      })
    ),
  }),
  logistics: z.object({
    startLocation: z.string(),
    endLocation: z.string(),
    transportation: z.object({
      included: z.boolean(),
      type: z.array(z.string()).optional(),
      provider: z.string().optional(),
    }),
    accommodation: z.object({
      included: z.boolean(),
      options: z.array(z.string()).optional(),
      recommendations: z.array(z.string()).optional(),
    }),
    meals: z.object({
      included: z.boolean(),
      options: z.array(z.string()).optional(),
      dietary: z.array(z.string()).optional(),
    }),
    guide: z.object({
      included: z.boolean(),
      languages: z.array(z.string()).optional(),
      specialization: z.array(z.string()).optional(),
    }),
  }),
  participation: z.object({
    targetAudience: z.array(z.string()),
    minParticipants: z.number().int().min(1),
    maxParticipants: z.number().int().min(1),
    currentParticipants: z.number().int().min(0).default(0),
    ageRestrictions: z
      .object({
        minAge: z.number().int().min(0).optional(),
        maxAge: z.number().int().optional(),
      })
      .optional(),
    requirements: z.array(z.string()).optional(),
  }),
  pricing: z.object({
    basePrice: z.number().min(0),
    discounts: z
      .array(
        z.object({
          category: z.string(),
          percentage: z.number().min(0).max(100),
          conditions: z.string().optional(),
        })
      )
      .optional(),
    included: z.array(z.string()),
    excluded: z.array(z.string()).optional(),
    paymentOptions: z.array(z.string()).optional(),
  }),
  schedule: z.object({
    startDate: z.string().transform(str => new Date(str)),
    endDate: z
      .string()
      .transform(str => new Date(str))
      .optional(),
    frequency: z.enum(['unico', 'diario', 'semanal', 'mensal', 'temporada']),
    availableDates: z.array(z.string().transform(str => new Date(str))).optional(),
  }),
  status: z
    .enum(['planejado', 'ativo', 'suspenso', 'finalizado', 'cancelado'])
    .default('planejado'),
  isActive: z.boolean().default(true),
});

const tourismInfoSchema = z.object({
  title: z.string().min(2, 'Título é obrigatório'),
  content: z.string().min(20, 'Conteúdo é obrigatório'),
  type: z.enum(['guia', 'dica', 'evento', 'noticia', 'promocao', 'alerta', 'historia']),
  category: z.enum([
    'geral',
    'transporte',
    'hospedagem',
    'gastronomia',
    'cultura',
    'natureza',
    'seguranca',
    'saude',
  ]),
  target: z.object({
    audience: z.array(z.enum(['turistas', 'empresarios', 'guias', 'moradores', 'geral'])),
    languages: z.array(z.string()).default(['portugues']),
  }),
  location: z.object({
    isLocationSpecific: z.boolean(),
    city: z.string().optional(),
    attraction: z.string().optional(),
    coordinates: z
      .object({
        lat: z.number(),
        lng: z.number(),
      })
      .optional(),
  }),
  content_details: z.object({
    summary: z.string().optional(),
    highlights: z.array(z.string()).optional(),
    recommendations: z.array(z.string()).optional(),
    warnings: z.array(z.string()).optional(),
    contacts: z
      .array(
        z.object({
          name: z.string(),
          phone: z.string().optional(),
          email: z.string().email().optional(),
          service: z.string(),
        })
      )
      .optional(),
  }),
  media: z.object({
    featuredImage: z.string().optional(),
    gallery: z.array(z.string()).optional(),
    videos: z.array(z.string()).optional(),
    documents: z.array(z.string()).optional(),
  }),
  publication: z.object({
    publishDate: z
      .string()
      .transform(str => new Date(str))
      .optional(),
    expiryDate: z
      .string()
      .transform(str => new Date(str))
      .optional(),
    priority: z.enum(['baixa', 'normal', 'alta']).default('normal'),
    featured: z.boolean().default(false),
  }),
  seo: z
    .object({
      keywords: z.array(z.string()).optional(),
      metaDescription: z.string().optional(),
      slug: z.string().optional(),
    })
    .optional(),
  isActive: z.boolean().default(true),
});

const tourismAttendanceSchema = z.object({
  citizenId: z.string().min(1, 'Cidadão é obrigatório'),
  serviceType: z.enum([
    'informacoes_turisticas',
    'cadastro_estabelecimento',
    'inscricao_programa',
    'reclamacao',
    'sugestao',
    'parceria',
  ]),
  subject: z.string().min(5, 'Assunto é obrigatório'),
  description: z.string().min(10, 'Descrição é obrigatória'),
  touristProfile: z
    .object({
      isLocalResident: z.boolean(),
      origin: z.string().optional(),
      groupSize: z.number().int().min(1).optional(),
      stayDuration: z.number().int().min(1).optional(), // dias
      interests: z.array(z.string()).optional(),
    })
    .optional(),
  businessInfo: z
    .object({
      businessName: z.string().optional(),
      businessType: z.string().optional(),
      cnpj: z.string().optional(),
    })
    .optional(),
  requestedInfo: z
    .object({
      attractions: z.boolean().default(false),
      accommodation: z.boolean().default(false),
      restaurants: z.boolean().default(false),
      transportation: z.boolean().default(false),
      events: z.boolean().default(false),
      tours: z.boolean().default(false),
      maps: z.boolean().default(false),
      other: z.string().optional(),
    })
    .optional(),
  materials: z
    .object({
      provided: z.array(z.string()).optional(),
      requested: z.array(z.string()).optional(),
    })
    .optional(),
  followUp: z
    .object({
      required: z.boolean().default(false),
      contactMethod: z.enum(['phone', 'email', 'whatsapp', 'presencial']).optional(),
      preferredTime: z.string().optional(),
    })
    .optional(),
  satisfaction: z
    .object({
      rating: z.number().min(1).max(5).optional(),
      feedback: z.string().optional(),
    })
    .optional(),
  resolution: z.string().optional(),
  followUpNeeded: z.boolean().default(false),
  followUpDate: z
    .string()
    .transform(str => new Date(str))
    .optional(),
});

// ====================== PONTOS TURÍSTICOS ======================

// GET /api/specialized/tourism/attractions
router.get('/attractions', requirePermission('tourism:read'), asyncHandler(async (req, res) => {
  try {
    const { type, category, city, featured, isActive } = req.query;

    const where: TourismAttractionWhereInput = { tenantId: req.tenant!.id };
    if (type) where.type = getStringParam(type);
    if (category) where.category = getStringParam(category);
    if (featured !== undefined) where.featured = featured === 'true';
    if (isActive !== undefined) where.isActive = isActive === 'true';
    // city removido pois não está na interface atual

    const attractions = await prisma.touristAttraction.findMany({
      where,
      orderBy: [{ featured: 'desc' }, { name: 'asc' }],
    });

    return res.json(attractions);
  } catch (error) {
    console.error('Erro ao buscar pontos turísticos:', error);
    return res.status(500).json(createErrorResponse('INTERNAL_ERROR', 'Erro interno do servidor', error));
  }
}));

// POST /api/specialized/tourism/attractions
router.post('/attractions', requirePermission('tourism:write'), asyncHandler(async (req, res) => {
  try {
    const validatedData = touristAttractionSchema.parse(req.body);

    const attraction = await prisma.touristAttraction.create({
      data: {
        ...validatedData,
        tenantId: req.tenant!.id,
      } as unknown as Prisma.TouristAttractionUncheckedCreateInput,
    });

    return res.status(201).json(attraction);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json(createErrorResponse('VALIDATION_ERROR', 'Dados inválidos', error.issues));
    }
    console.error('Erro ao criar ponto turístico:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
}));

// ====================== ESTABELECIMENTOS LOCAIS ======================

// GET /api/specialized/tourism/businesses
router.get('/businesses', requirePermission('tourism:read'), asyncHandler(async (req, res) => {
  try {
    const { type, category, city, isPartner, isActive, page = 1, limit = 20 } = req.query;

    const skip = (Number(page) - 1) * Number(limit);
    const where: Prisma.LocalBusinessWhereInput = { tenantId: req.tenant!.id };

    if (type) {
      where.businessInfo = {
        path: 'type',
        string_contains: getStringParam(type),
      };
    }
    if (category) {
      where.businessInfo = {
        path: 'category',
        string_contains: category as string,
      };
    }
    if (isPartner !== undefined) where.isPartner = isPartner === 'true';
    if (isActive !== undefined) where.isActive = isActive === 'true';
    // city removido pois não está na interface atual

    const [businesses, total] = await Promise.all([
      prisma.localBusiness.findMany({
        where,
        orderBy: {
          name: 'asc',
        },
        skip,
        take: Number(limit),
      }),
      prisma.localBusiness.count({ where }),
    ]);

    return res.json({
      data: businesses,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    console.error('Erro ao buscar estabelecimentos:', error);
    return res.status(500).json(createErrorResponse('INTERNAL_ERROR', 'Erro interno do servidor', error));
  }
}));

// POST /api/specialized/tourism/businesses
router.post('/businesses', requirePermission('tourism:write'), asyncHandler(async (req, res) => {
  try {
    const validatedData = localBusinessSchema.parse(req.body);

    // Verificar se já existe estabelecimento com mesmo CNPJ
    const allBusinesses = await prisma.localBusiness.findMany({
      where: { tenantId: req.tenant!.id },
      select: { id: true, businessInfo: true },
    });

    const existingBusiness = allBusinesses.find(b => {
      const info = b.businessInfo as { cnpj?: string } | null;
      return info?.cnpj === validatedData.businessInfo.cnpj;
    });

    if (existingBusiness) {
      return res.status(409).json({ error: 'Já existe um estabelecimento cadastrado com este CNPJ' });
    }

    const business = await prisma.localBusiness.create({
      data: {
        ...validatedData,
        tenantId: req.tenant!.id,
      } as unknown as Prisma.LocalBusinessUncheckedCreateInput,
    });

    return res.status(201).json(business);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json(createErrorResponse('VALIDATION_ERROR', 'Dados inválidos', error.issues));
    }
    console.error('Erro ao registrar estabelecimento:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
}));

// ====================== INFORMAÇÕES TURÍSTICAS ======================

// GET /api/specialized/tourism/info
router.get('/info', requirePermission('tourism:read'), asyncHandler(async (req, res) => {
  try {
    const { type, category, audience, featured, isActive } = req.query;

    const where: TourismEventWhereInput = { tenantId: req.tenant!.id };
    if (type) where.type = getStringParam(type);
    if (category) where.category = getStringParam(category);
    // featured e audience removidos pois não estão na interface atual
    if (isActive !== undefined) where.isActive = isActive === 'true';

    const infos = await prisma.tourismInfo.findMany({
      where,
      orderBy: [
        { priority: 'desc' },
        { createdAt: 'desc' },
      ],
    });

    return res.json(infos);
  } catch (error) {
    console.error('Erro ao buscar informações turísticas:', error);
    return res.status(500).json(createErrorResponse('INTERNAL_ERROR', 'Erro interno do servidor', error));
  }
}));

// POST /api/specialized/tourism/info
router.post('/info', requirePermission('tourism:write'), asyncHandler(async (req, res) => {
  try {
    const validatedData = tourismInfoSchema.parse(req.body);

    const info = await prisma.tourismInfo.create({
      data: {
        ...validatedData,
        tenantId: req.tenant!.id,
      } as unknown as Prisma.TourismInfoUncheckedCreateInput,
    });

    return res.status(201).json(info);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json(createErrorResponse('VALIDATION_ERROR', 'Dados inválidos', error.issues));
    }
    console.error('Erro ao criar informação turística:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
}));

// ====================== MAPA TURÍSTICO ======================

// GET /api/specialized/tourism/tourism-map
router.get('/tourism-map', requirePermission('tourism:read'), asyncHandler(async (req, res) => {
  try {
    const { bounds, types } = req.query;

    const attractionsWhere: Prisma.TouristAttractionWhereInput = {
      tenantId: req.tenant!.id,
      isActive: true,
      coordinates: { not: Prisma.JsonNull },
    };

    const businessesWhere: Prisma.LocalBusinessWhereInput = {
      tenantId: req.tenant!.id,
      isActive: true,
    };

    if (types) {
      const typeList = (types as string).split(',');
      if (typeList.includes('attractions')) {
        // Incluir atrações
      }
      if (typeList.includes('hotels')) {
        businessesWhere.businessInfo = {
          path: 'type',
          string_contains: 'hotel',
        };
      }
      if (typeList.includes('restaurants')) {
        businessesWhere.businessInfo = {
          path: 'type',
          string_contains: 'restaurante',
        };
      }
    }

    // Filtrar por área geográfica se informada
    if (bounds) {
      try {
        const { north, south, east, west } = JSON.parse(bounds as string);
        // Filtro geográfico simplificado
        // Note: Para filtros complexos de coordenadas, seria necessário usar uma abordagem diferente
        // Por enquanto, vamos pular o filtro geográfico complexo
      } catch (e) {
        // Ignorar bounds inválidos
      }
    }

    const [attractions, businesses] = await Promise.all([
      prisma.touristAttraction.findMany({
        where: attractionsWhere,
        select: {
          id: true,
          name: true,
          type: true,
          category: true,
          address: true,
          coordinates: true,
          openingHours: true,
          ticketPrice: true,
          featured: true,
        },
      }),
      prisma.localBusiness.findMany({
        where: businessesWhere,
        select: {
          id: true,
          businessInfo: true,
          address: true,
          coordinates: true,
          services: true,
          priceRange: true,
          isPartner: true,
        },
      }),
    ]);

    return res.json({
      attractions,
      businesses,
    });
  } catch (error) {
    console.error('Erro ao buscar mapa turístico:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
}));

// ====================== PROGRAMAS TURÍSTICOS ======================

// GET /api/specialized/tourism/programs
router.get('/programs', requirePermission('tourism:read'), asyncHandler(async (req, res) => {
  try {
    const { type, category, status, isActive } = req.query;

    const where: Prisma.TourismProgramWhereInput = { tenantId: req.tenant!.id };
    if (type) where.type = getStringParam(type);
    if (category) where.category = getStringParam(category);
    if (status) where.status = getStringParam(status);
    if (isActive !== undefined) where.isActive = isActive === 'true';

    const programs = await prisma.tourismProgram.findMany({
      where,
      orderBy: { name: 'asc' },
    });

    return res.json(programs);
  } catch (error) {
    console.error('Erro ao buscar programas turísticos:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
}));

// POST /api/specialized/tourism/programs
router.post('/programs', requirePermission('tourism:write'), asyncHandler(async (req, res) => {
  try {
    const validatedData = tourismProgramSchema.parse(req.body);

    const program = await prisma.tourismProgram.create({
      data: {
        ...validatedData,
        tenantId: req.tenant!.id,
      } as unknown as Prisma.TourismProgramUncheckedCreateInput,
    });

    return res.status(201).json(program);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json(createErrorResponse('VALIDATION_ERROR', 'Dados inválidos', error.issues));
    }
    console.error('Erro ao criar programa turístico:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
}));

// ====================== ATENDIMENTOS DA SECRETARIA ======================

// GET /api/specialized/tourism/attendances
router.get('/attendances', requirePermission('tourism:read'), asyncHandler(async (req, res) => {
  try {
    const { citizenId, serviceType, isLocalResident, page = 1, limit = 20 } = req.query;

    const skip = (Number(page) - 1) * Number(limit);
    const where: TourismAttendanceWhereInput = { tenantId: req.tenant!.id };

    if (citizenId) where.citizenId = getStringParam(citizenId);
    if (serviceType) where.serviceType = getStringParam(serviceType);
    if (isLocalResident !== undefined) {
      where.touristProfile = {
        path: ['isLocalResident'],
        equals: isLocalResident === 'true',
      };
    }

    const [attendances, total] = await Promise.all([
      prisma.tourismAttendance.findMany({
        where,
        include: {
          citizen: { select: { id: true, name: true, phone: true, email: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: Number(limit),
      }),
      prisma.tourismAttendance.count({ where }),
    ]);

    return res.json({
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
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
}));

// POST /api/specialized/tourism/attendances
router.post('/attendances', requirePermission('tourism:write'), asyncHandler(async (req, res) => {
  try {
    const validatedData = tourismAttendanceSchema.parse(req.body);

    const attendance = await prisma.tourismAttendance.create({
      data: {
        ...validatedData,
        tenantId: req.tenant!.id,
      } as unknown as Prisma.TourismAttendanceUncheckedCreateInput,
      include: {
        citizen: { select: { id: true, name: true, phone: true, email: true } },
      },
    });

    return res.status(201).json(attendance);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json(createErrorResponse('VALIDATION_ERROR', 'Dados inválidos', error.issues));
    }
    console.error('Erro ao registrar atendimento:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
}));

// ====================== DASHBOARD E MÉTRICAS ======================

// GET /api/specialized/tourism/dashboard
router.get('/dashboard', requirePermission('tourism:read'), asyncHandler(async (req, res) => {
  try {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const [
      totalAttractions,
      activeBusinesses,
      activePrograms,
      featuredAttractions,
      partnerBusinesses,
      attendancesMonth,
      attractionsByType,
      businessesByType,
    ] = await Promise.all([
      // Total de pontos turísticos
      prisma.touristAttraction.count({
        where: { tenantId: req.tenant!.id, isActive: true },
      }),

      // Estabelecimentos ativos
      prisma.localBusiness.count({
        where: { tenantId: req.tenant!.id, isActive: true },
      }),

      // Programas turísticos ativos
      prisma.tourismProgram.count({
        where: {
          tenantId: req.tenant!.id,
          status: { in: ['ativo', 'planejado'] },
        },
      }),

      // Atrações em destaque
      prisma.touristAttraction.count({
        where: {
          tenantId: req.tenant!.id,
          featured: true,
          isActive: true,
        },
      }),

      // Estabelecimentos parceiros
      prisma.localBusiness.count({
        where: {
          tenantId: req.tenant!.id,
          isPartner: true,
          isActive: true,
        },
      }),

      // Atendimentos este mês
      prisma.tourismAttendance.count({
        where: {
          tenantId: req.tenant!.id,
          createdAt: { gte: startOfMonth },
        },
      }),

      // Atrações por tipo
      prisma.touristAttraction.groupBy({
        by: ['type'],
        where: { tenantId: req.tenant!.id, isActive: true },
        _count: true,
      }),

      // Estabelecimentos por tipo
      prisma.localBusiness.groupBy({
        by: ['businessInfo'],
        where: { tenantId: req.tenant!.id, isActive: true },
        _count: true,
      }),
    ]);

    const attractionTypeStats = attractionsByType.reduce(
      (acc: Record<string, number>, item: GroupByResult) => {
        const type = (item.type as string) || 'unknown';
        acc[type] = typeof item._count === 'object' ? Object.values(item._count)[0] || 0 : 0;
        return acc;
      },
      {} as Record<string, number>
    );

    // Extrair tipos de negócio
    const businessTypeStats = businessesByType.reduce(
      (acc: Record<string, number>, item: GroupByResult) => {
        const businessInfo = item.businessInfo as { type?: string } | undefined;
        const businessType = businessInfo?.type || 'outros';
        const count = typeof item._count === 'object' ? Object.values(item._count)[0] || 0 : 0;
        acc[businessType] = (acc[businessType] || 0) + count;
        return acc;
      },
      {} as Record<string, number>
    );

    return res.json({
      totalAttractions,
      activeBusinesses,
      activePrograms,
      featuredAttractions,
      partnerBusinesses,
      attendancesMonth,
      attractionTypeStats,
      businessTypeStats,
    });
  } catch (error) {
    console.error('Erro ao buscar dados do dashboard:', error);
    return res.status(500).json(createErrorResponse('INTERNAL_ERROR', 'Erro interno do servidor', error));
  }
}));

export default router;
