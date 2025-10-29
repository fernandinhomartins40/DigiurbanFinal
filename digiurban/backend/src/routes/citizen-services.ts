import { Router, Response } from 'express';
import { prisma } from '../lib/prisma';
import { tenantMiddleware } from '../middleware/tenant';
import { citizenAuthMiddleware } from '../middleware/citizen-auth';
import { AuthenticatedRequest, SuccessResponse, ErrorResponse, GuaranteedTenantRequest, WhereCondition } from '../types';
import { generateProtocolNumber } from '../utils/protocol-number-generator';
import { ModuleHandler } from '../modules/module-handler';

// FASE 2 - Interface para serviços de cidadãos
// WhereClause interface removida - usando WhereCondition do sistema centralizado

const router = Router();

// Middleware para verificar tenant em todas as rotas
router.use(tenantMiddleware);

// GET /api/services - Listar serviços ativos do tenant
router.get('/', async (req, res) => {
  try {
    const { tenant } = req as GuaranteedTenantRequest;
    const { category, search, page = 1, limit = 1000 } = req.query;

    const skip = (Number(page) - 1) * Number(limit);

    // Construir filtros
    const where: WhereCondition = {
      tenantId: tenant.id,
      isActive: true,
    };

    if (category) {
      where.category = category;
    }

    if (search) {
      where.OR = [
        { name: { contains: search as string } },
        { description: { contains: search as string } },
      ];
    }

    // Buscar serviços com paginação
    const [services, total] = await Promise.all([
      prisma.serviceSimplified.findMany({
        where,
        include: {
          department: {
            select: {
              id: true,
              name: true,
              description: true,
            },
          },
        },
        orderBy: [{ priority: 'desc' }, { name: 'asc' }],
        skip,
        take: Number(limit),
      }),
      prisma.serviceSimplified.count({ where }),
    ]);

    return res.json({
      services,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    console.error('Erro ao buscar serviços:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// GET /api/services/categories - Listar categorias de serviços
router.get('/categories', async (req, res) => {
  try {
    const { tenant } = req as GuaranteedTenantRequest;

    const categories = await prisma.serviceSimplified.findMany({
      where: {
        tenantId: tenant.id,
        isActive: true,
        category: { not: null },
      },
      select: {
        category: true,
      },
      distinct: ['category'],
      orderBy: {
        category: 'asc',
      },
    });

    const categoriesWithCount = await Promise.all(
      categories.map(async cat => {
        const count = await prisma.serviceSimplified.count({
          where: {
            tenantId: tenant.id,
            isActive: true,
            category: cat.category,
          },
        });

        return {
          name: cat.category,
          count,
        };
      })
    );

    return res.json({
      categories: categoriesWithCount,
    });
  } catch (error) {
    console.error('Erro ao buscar categorias:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// GET /api/services/popular - Serviços mais utilizados
router.get('/popular', async (req, res) => {
  try {
    const { tenant } = req as GuaranteedTenantRequest;
    const { limit = 10 } = req.query;

    // Buscar serviços com mais protocolos
    const popularServices = await prisma.serviceSimplified.findMany({
      where: {
        tenantId: tenant.id,
        isActive: true,
      },
      include: {
        department: {
          select: {
            id: true,
            name: true,
          },
        },
        _count: {
          select: {
            protocolsSimplified: true,
          },
        } as any, // TODO: Prisma _count não suporta select em relações
      },
      orderBy: {
        protocols: {
          _count: 'desc',
        },
      },
      take: Number(limit),
    });

    return res.json({
      services: popularServices,
    });
  } catch (error) {
    console.error('Erro ao buscar serviços populares:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// GET /api/services/:id - Detalhes de um serviço específico
router.get('/:id', async (req, res) => {
  try {
    const { tenant } = req as GuaranteedTenantRequest;
    const { id } = req.params;

    const service = await prisma.serviceSimplified.findFirst({
      where: {
        id,
        tenantId: tenant.id,
        isActive: true,
      },
      include: {
        department: {
          select: {
            id: true,
            name: true,
            description: true,
          },
        },
        _count: {
          select: {
            protocolsSimplified: true,
          },
        } as any, // TODO: Prisma _count não suporta select em relações
      },
    });

    if (!service) {
      return res.status(404).json({ error: 'Serviço não encontrado' });
    }

    // Buscar estatísticas do serviço
    const stats = await prisma.protocolSimplified.groupBy({
      by: ['status'],
      where: {
        tenantId: tenant.id,
        serviceId: id,
      },
      _count: {
        status: true,
      },
    });

    // Calcular tempo médio de conclusão
    const completedProtocols = await prisma.protocolSimplified.findMany({
      where: {
        tenantId: tenant.id,
        serviceId: id,
        status: 'CONCLUIDO',
        concludedAt: { not: null },
      },
      select: {
        createdAt: true,
        concludedAt: true,
      },
    });

    let averageCompletionDays = null;
    if (completedProtocols.length > 0) {
      const totalDays = completedProtocols.reduce((acc, protocol) => {
        const diffTime = protocol.concludedAt!.getTime() - protocol.createdAt.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return acc + diffDays;
      }, 0);
      averageCompletionDays = Math.round(totalDays / completedProtocols.length);
    }

    return res.json({
      service: {
        ...service,
        stats: {
          protocolsCount: (service._count as any)?.protocolsSimplified || 0,
          statusDistribution: stats,
          averageCompletionDays,
        },
      },
    });
  } catch (error) {
    console.error('Erro ao buscar detalhes do serviço:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// GET /api/services/:id/requirements - Requisitos do serviço
router.get('/:id/requirements', async (req, res) => {
  try {
    const { tenant } = req as GuaranteedTenantRequest;
    const { id } = req.params;

    const service = await prisma.serviceSimplified.findFirst({
      where: {
        id,
        tenantId: tenant.id,
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        // requirements: true, // REMOVED: Campo removido do ServiceSimplified
        requiredDocuments: true,
        estimatedDays: true,
      },
    });

    if (!service) {
      return res.status(404).json({ error: 'Serviço não encontrado' });
    }

    return res.json({
      service: {
        id: service.id,
        name: service.name,
        requirements: [], // DEPRECATED: Feature removida do MVP simplificado
        requiredDocuments: service.requiredDocuments || [],
        estimatedDays: service.estimatedDays,
      },
    });
  } catch (error) {
    console.error('Erro ao buscar requisitos do serviço:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// GET /api/services/:id/similar - Serviços similares
router.get('/:id/similar', async (req, res) => {
  try {
    const { tenant } = req as GuaranteedTenantRequest;
    const { id } = req.params;
    const { limit = 5 } = req.query;

    // Buscar o serviço atual
    const currentService = await prisma.serviceSimplified.findFirst({
      where: {
        id,
        tenantId: tenant.id,
        isActive: true,
      },
      select: {
        category: true,
        departmentId: true,
      },
    });

    if (!currentService) {
      return res.status(404).json({ error: 'Serviço não encontrado' });
    }

    // Buscar serviços similares (mesma categoria ou departamento)
    const similarServices = await prisma.serviceSimplified.findMany({
      where: {
        tenantId: tenant.id,
        isActive: true,
        id: { not: id },
        OR: [{ category: currentService.category }, { departmentId: currentService.departmentId }],
      },
      include: {
        department: {
          select: {
            id: true,
            name: true,
          },
        },
        _count: {
          select: {
            protocolsSimplified: true,
          },
        } as any, // TODO: Prisma _count não suporta select em relações
      },
      orderBy: {
        protocols: {
          _count: 'desc',
        },
      },
      take: Number(limit),
    });

    return res.json({
      services: similarServices,
    });
  } catch (error) {
    console.error('Erro ao buscar serviços similares:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Middleware de autenticação para rotas protegidas
router.use(citizenAuthMiddleware);

// POST /api/services/:id/request - Solicitar um serviço
router.post('/:id/request', async (req, res) => {
  try {
    const { tenant } = req as GuaranteedTenantRequest;
    const { id: serviceId } = req.params;
    const citizenId = (req as any).citizen?.id;

    if (!citizenId) {
      return res.status(401).json({ error: 'Cidadão não autenticado' });
    }

    // Buscar o serviço
    const service = await prisma.serviceSimplified.findFirst({
      where: {
        id: serviceId,
        tenantId: tenant.id,
        isActive: true,
      },
      // REMOVED: Features deprecated removidas do ServiceSimplified
      // include: {
      //   customForm: true,
      //   locationConfig: true,
      //   scheduling: true,
      // },
    });

    if (!service) {
      return res.status(404).json({ error: 'Serviço não encontrado ou inativo' });
    }

    const {
      description,
      customFormData,
      locationData,
      schedulingData,
      attachments,
      priority = 3,
    } = req.body;

    // Validações
    if (!description || description.trim().length === 0) {
      return res.status(400).json({ error: 'Descrição é obrigatória' });
    }

    // DEPRECATED: Validações de features removidas do MVP simplificado
    // TODO: Reimplementar location/scheduling/customForm em iteração futura se necessário

    // Validar localização se obrigatório (DEPRECATED)
    // if (service.hasLocation && service.locationConfig) { ... }

    // Validar agendamento se obrigatório (DEPRECATED)
    // if (service.hasScheduling && !schedulingData) { ... }

    // Validar formulário customizado (DEPRECATED)
    // if (service.hasCustomForm && service.customForm) { ... }

    // Gerar número do protocolo
    const protocolNumber = generateProtocolNumber();

    // Criar protocolo em transação
    const result = await prisma.$transaction(async (tx) => {
      // Criar protocolo
      const protocol = await tx.protocolSimplified.create({
        data: {
          tenantId: tenant.id,
          number: protocolNumber,
          title: description.substring(0, 100),
          description,
          citizenId,
          serviceId,
          departmentId: service.departmentId,
          priority: Number(priority),
          status: 'VINCULADO' as any,
          latitude: locationData?.latitude,
          longitude: locationData?.longitude,
          endereco: locationData?.address,
          customData: customFormData as any,
          documents: attachments as any,
        },
      });

      // DEPRECATED: Appointment e ProtocolLocation removidos do MVP simplificado
      // TODO: Armazenar scheduling/location em protocol.data JSON se necessário

      // Se tem agendamento, armazenar no campo data (DEPRECATED - antes criava appointment)
      // if (schedulingData && schedulingData.scheduledDate) { ... }

      // Se tem localização, armazenar no campo data (DEPRECATED - antes criava protocolLocation)
      // if (locationData && locationData.latitude) { ... }

      return protocol;
    });

    // ========== EXECUTAR MODULE HANDLER ==========
    // Rotear automaticamente para o módulo especializado
    if (service.moduleType) {
      try {
        const moduleResult = await ModuleHandler.execute({
          tenantId: tenant.id,
          protocol: result,
          service,
          requestData: {
            ...customFormData,
            ...locationData,
            ...schedulingData,
            description,
          },
          citizenId,
        });

        if (!moduleResult.success) {
          console.error('Erro ao executar módulo:', moduleResult.error);
          // Não falha a requisição, mas loga o erro
        } else {
          console.log(`Módulo ${service.moduleType} executado com sucesso:`, moduleResult);
        }
      } catch (moduleError) {
        console.error('Erro crítico no ModuleHandler:', moduleError);
        // Não falha a requisição para garantir que o protocolo seja criado
      }
    }

    // Buscar protocolo completo
    const fullProtocol = await prisma.protocolSimplified.findUnique({
      where: { id: result.id },
      include: {
        service: {
          select: {
            id: true,
            name: true,
            description: true,
            estimatedDays: true,
          },
        },
        department: {
          select: {
            id: true,
            name: true,
          },
        },
        // appointment: true, // REMOVED: Feature deprecated do MVP simplificado
      },
    });

    return res.status(201).json({
      success: true,
      message: `Protocolo ${protocolNumber} gerado com sucesso!`,
      protocol: fullProtocol,
    });
  } catch (error) {
    console.error('Erro ao solicitar serviço:', error);
    return res.status(500).json({
      error: 'Erro interno do servidor',
      details: error instanceof Error ? error.message : 'Erro desconhecido',
    });
  }
});

// POST /api/services/:id/favorite - Favoritar serviço (futuro)
router.post('/:id/favorite', async (req, res) => {
  try {
    // Implementação futura para favoritos
    res.json({ message: 'Funcionalidade de favoritos em desenvolvimento' });
  } catch (error) {
    console.error('Erro ao favoritar serviço:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Calcula distância entre dois pontos (fórmula de Haversine)
 * Retorna distância em km
 */
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Raio da Terra em km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(deg: number): number {
  return deg * (Math.PI / 180);
}

export default router;
