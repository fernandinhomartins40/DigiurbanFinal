/**
 * ============================================================================
 * CITIZEN PROTOCOLS ROUTES
 * ============================================================================
 * Rotas para cidadãos acessarem seus protocolos
 */

import { Router } from 'express';
import { prisma } from '../lib/prisma';
import { tenantMiddleware } from '../middleware/tenant';
import { citizenAuthMiddleware } from '../middleware/citizen-auth';
import { GuaranteedTenantRequest } from '../types';

const router = Router();

// Middleware para verificar tenant e autenticação do cidadão
router.use(tenantMiddleware);
router.use(citizenAuthMiddleware);

// GET /api/citizen/protocols - Listar protocolos do cidadão logado
router.get('/', async (req, res) => {
  try {
    const { tenant } = req as GuaranteedTenantRequest;
    const citizenId = (req as any).citizen?.id;

    if (!citizenId) {
      return res.status(401).json({ error: 'Cidadão não autenticado' });
    }

    const { page = 1, limit = 100, status } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    // Construir filtros
    const where: any = {
      tenantId: tenant.id,
      citizenId,
    };

    if (status) {
      where.status = status;
    }

    // Buscar protocolos do cidadão
    const [protocols, total] = await Promise.all([
      prisma.protocolSimplified.findMany({
        where,
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
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: Number(limit),
      }),
      prisma.protocolSimplified.count({ where }),
    ]);

    return res.json({
      protocols,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    console.error('Erro ao buscar protocolos do cidadão:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// GET /api/citizen/protocols/:id - Detalhes de um protocolo específico
router.get('/:id', async (req, res) => {
  try {
    const { tenant } = req as GuaranteedTenantRequest;
    const citizenId = (req as any).citizen?.id;
    const { id } = req.params;

    if (!citizenId) {
      return res.status(401).json({ error: 'Cidadão não autenticado' });
    }

    // Buscar protocolo
    const protocol = await prisma.protocolSimplified.findFirst({
      where: {
        id,
        tenantId: tenant.id,
        citizenId, // Garantir que o protocolo pertence ao cidadão
      },
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
        assignedUser: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!protocol) {
      return res.status(404).json({ error: 'Protocolo não encontrado' });
    }

    // Buscar histórico do protocolo
    const history = await prisma.protocolHistorySimplified.findMany({
      where: {
        protocolId: id,
      },
      orderBy: {
        timestamp: 'desc',
      },
    });

    return res.json({
      protocol,
      history,
    });
  } catch (error) {
    console.error('Erro ao buscar detalhes do protocolo:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

export default router;
