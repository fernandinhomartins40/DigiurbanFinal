import { Router, Response } from 'express';
import { prisma } from '../lib/prisma';
import { Prisma, UserRole } from '@prisma/client';
import { tenantMiddleware } from '../middleware/tenant';
import { authenticateToken, requireManager, optionalAuth } from '../middleware/auth';
import {
  AuthenticatedRequest,
  OptionalAuthRequest,
  SuccessResponse,
  ErrorResponse,
} from '../types';

// ====================== TIPOS LOCAIS ISOLADOS ======================

interface WhereCondition {
  [key: string]: unknown;
}

// FASE 2 - Interface para serviços
// WhereClause interface removida - usando WhereCondition do sistema centralizado

const router = Router();

// Aplicar middleware de tenant em todas as rotas
router.use(tenantMiddleware);

/**
 * GET /api/services
 * Listar serviços (catálogo público)
 */
router.get(
  '/',
  optionalAuth,
  async (req: OptionalAuthRequest, res: Response<SuccessResponse | ErrorResponse>) => {
    try {
      const { departmentId, search } = req.query;

      let whereClause: WhereCondition = {
        tenantId: req.tenantId,
        isActive: true,
      };

      if (departmentId) {
        whereClause.departmentId = departmentId;
      }

      if (search) {
        whereClause.OR = [
          { name: { contains: search as string } },
          { description: { contains: search as string } },
        ];
      }

      const services = await prisma.service.findMany({
        where: whereClause,
        include: {
          department: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: [{ priority: 'desc' }, { name: 'asc' }],
      });

      res.json({ data: services, success: true });
    } catch (error) {
      console.error('List services error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: 'Erro interno do servidor',
      });
    }
  }
);

/**
 * GET /api/services/:id
 * Obter serviço específico
 */
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const { id } = req.params;

    const service = await prisma.service.findFirst({
      where: {
        id,
        tenantId: req.tenantId,
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
      },
    });

    if (!service) {
      res.status(404).json({
        error: 'Not found',
        message: 'Serviço não encontrado',
      });
    }

    res.json({ service });
  } catch (error) {
    console.error('Get service error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Erro interno do servidor',
    });
  }
});

/**
 * POST /api/services
 * Criar novo serviço (apenas MANAGER ou superior)
 */
router.post('/', authenticateToken, requireManager, async (req, res) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const { name, description, departmentId, requiresDocuments, estimatedDays, priority } =
      authReq.body;

    if (!name || !departmentId) {
      return res.status(400).json({
        error: 'Bad request',
        message: 'Nome e departamento são obrigatórios',
      });
    }

    // Verificar se departamento existe
    const department = await prisma.department.findFirst({
      where: {
        id: departmentId,
        tenantId: authReq.tenantId,
        isActive: true,
      },
    });

    if (!department) {
      return res.status(404).json({
        error: 'Not found',
        message: 'Departamento não encontrado',
      });
    }

    // Verificar permissões
    if (authReq.userRole === UserRole.MANAGER && authReq.user?.departmentId !== departmentId) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'Você só pode criar serviços do seu departamento',
      });
    }

    const service = await prisma.service.create({
      data: {
        name,
        description: description || null,
        departmentId,
        tenantId: authReq.tenantId,
        requiresDocuments: requiresDocuments || false,
        estimatedDays: estimatedDays || null,
        priority: priority || 1,
      } as unknown as Prisma.ServiceUncheckedCreateInput,
      include: {
        department: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return res.status(201).json({
      message: 'Serviço criado com sucesso',
      service,
    });
  } catch (error) {
    console.error('Create service error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: 'Erro interno do servidor',
    });
  }
});

/**
 * PUT /api/services/:id
 * Atualizar serviço (apenas MANAGER ou superior)
 */
router.put('/:id', authenticateToken, requireManager, async (req, res) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const { id } = authReq.params;
    const { name, description, requiresDocuments, estimatedDays, priority, isActive } = authReq.body;

    // Verificar se serviço existe
    const service = await prisma.service.findFirst({
      where: {
        id,
        tenantId: authReq.tenantId,
      },
    });

    if (!service) {
      return res.status(404).json({
        error: 'Not found',
        message: 'Serviço não encontrado',
      });
    }

    // Verificar permissões
    if (authReq.userRole === UserRole.MANAGER && authReq.user?.departmentId !== service.departmentId) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'Você só pode editar serviços do seu departamento',
      });
    }

    const updatedService = await prisma.service.update({
      where: { id },
      data: {
        name: name || service.name,
        description: description !== undefined ? description : service.description,
        requiresDocuments:
          requiresDocuments !== undefined ? requiresDocuments : service.requiresDocuments,
        estimatedDays: estimatedDays !== undefined ? estimatedDays : service.estimatedDays,
        priority: priority !== undefined ? priority : service.priority,
        isActive: isActive !== undefined ? isActive : service.isActive,
      },
      include: {
        department: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return res.json({
      message: 'Serviço atualizado com sucesso',
      service: updatedService,
    });
  } catch (error) {
    console.error('Update service error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: 'Erro interno do servidor',
    });
  }
});

/**
 * DELETE /api/services/:id
 * Desativar serviço (soft delete)
 */
router.delete('/:id', authenticateToken, requireManager, async (req, res) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const { id } = authReq.params;

    // Verificar se serviço existe
    const service = await prisma.service.findFirst({
      where: {
        id,
        tenantId: authReq.tenantId,
      },
    });

    if (!service) {
      return res.status(404).json({
        error: 'Not found',
        message: 'Serviço não encontrado',
      });
    }

    // Verificar permissões
    if (authReq.userRole === UserRole.MANAGER && authReq.user?.departmentId !== service.departmentId) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'Você só pode desativar serviços do seu departamento',
      });
    }

    // Verificar se há protocolos ativos
    const activeProtocols = await prisma.protocol.count({
      where: {
        serviceId: id,
        status: {
          in: ['VINCULADO', 'PROGRESSO', 'ATUALIZACAO'],
        },
      },
    });

    if (activeProtocols > 0) {
      return res.status(400).json({
        error: 'Bad request',
        message: `Não é possível desativar o serviço. Existem ${activeProtocols} protocolos ativos.`,
      });
    }

    await prisma.service.update({
      where: { id },
      data: { isActive: false },
    });

    return res.json({
      message: 'Serviço desativado com sucesso',
    });
  } catch (error) {
    console.error('Delete service error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: 'Erro interno do servidor',
    });
  }
});

/**
 * GET /api/services/department/:departmentId
 * Listar serviços de um departamento específico
 */
router.get('/department/:departmentId', optionalAuth, async (req, res) => {
  try {
    const { departmentId } = req.params;

    const services = await prisma.service.findMany({
      where: {
        departmentId,
        tenantId: req.tenantId,
        isActive: true,
      },
      include: {
        department: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: [{ priority: 'desc' }, { name: 'asc' }],
    });

    res.json({ data: services, success: true });
  } catch (error) {
    console.error('Get department services error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Erro interno do servidor',
    });
  }
});

export default router;
