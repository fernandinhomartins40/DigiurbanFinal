import { Router, Response } from 'express';
import { prisma } from '../lib/prisma';
import { tenantMiddleware } from '../middleware/tenant';
import { citizenAuthMiddleware } from '../middleware/citizen-auth';
import { AuthenticatedRequest, SuccessResponse, ErrorResponse, GuaranteedTenantRequest, WhereCondition } from '../types';

// FASE 2 - Interface para serviços de cidadãos
// WhereClause interface removida - usando WhereCondition do sistema centralizado

const router = Router();

// Middleware para verificar tenant em todas as rotas
router.use(tenantMiddleware);

// GET /api/services - Listar serviços ativos do tenant
router.get('/', async (req, res) => {
  try {
    const { tenant } = req as GuaranteedTenantRequest;
    const { category, search, page = 1, limit = 20 } = req.query;

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
      prisma.service.findMany({
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
      prisma.service.count({ where }),
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

    const categories = await prisma.service.findMany({
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
        const count = await prisma.service.count({
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
    const popularServices = await prisma.service.findMany({
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
            protocols: true,
          },
        },
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

    const service = await prisma.service.findFirst({
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
            protocols: true,
          },
        },
      },
    });

    if (!service) {
      return res.status(404).json({ error: 'Serviço não encontrado' });
    }

    // Buscar estatísticas do serviço
    const stats = await prisma.protocol.groupBy({
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
    const completedProtocols = await prisma.protocol.findMany({
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
          protocolsCount: service._count.protocols,
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

    const service = await prisma.service.findFirst({
      where: {
        id,
        tenantId: tenant.id,
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        requirements: true,
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
        requirements: service.requirements || [],
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
    const currentService = await prisma.service.findFirst({
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
    const similarServices = await prisma.service.findMany({
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
            protocols: true,
          },
        },
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

export default router;
