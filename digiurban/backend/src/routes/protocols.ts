import * as express from 'express';
import { prisma } from '../lib/prisma';
import { tenantMiddleware } from '../middleware/tenant';
import { authenticateToken, optionalAuth } from '../middleware/auth';
import { ProtocolStatus, UserRole } from '@prisma/client';
import { getNextProtocolNumber } from '../utils/protocol-helpers';
import {
  AuthenticatedRequest,
  AdminAuthenticatedRequest,
  SuccessResponse,
  ErrorResponse,
} from '../types';
// Importar declarações globais para estender Express.Request
import '../types/globals';

// FASE 2 - Interface para protocolos
// WhereClause interface removida - usando WhereCondition do sistema centralizado

const router = express.Router();

// Aplicar middleware de tenant em todas as rotas
router.use(tenantMiddleware);

/**
 * Função para garantir que o usuário esteja autenticado
 * Lança erro se req.user não estiver definido
 */
function ensureAuthenticated(req: AuthenticatedRequest): asserts req is AdminAuthenticatedRequest {
  if (!req.user) {
    throw new Error('Usuário não autenticado');
  }
}

/**
 * POST /api/protocols
 * Criar novo protocolo
 */
router.post('/', optionalAuth, async (req, res) => {
  try {
    const { title, description, citizenId, serviceId, attachments } = req.body;

    if (!title || !citizenId || !serviceId) {
      return res.status(400).json({
        error: 'Bad request',
        message: 'Título, cidadão e serviço são obrigatórios',
      });
    }

    // Buscar serviço para obter o departamento
    const service = await prisma.service.findFirst({
      where: {
        id: serviceId,
        tenantId: req.tenantId,
        isActive: true,
      },
    });

    if (!service) {
      return res.status(404).json({
        error: 'Not found',
        message: 'Serviço não encontrado',
      });
    }

    // Verificar se cidadão existe
    const citizen = await prisma.citizen.findFirst({
      where: {
        id: citizenId,
        tenantId: req.tenantId,
      },
    });

    if (!citizen) {
      return res.status(404).json({
        error: 'Not found',
        message: 'Cidadão não encontrado',
      });
    }

    // Gerar número único do protocolo
    const protocolNumber = await getNextProtocolNumber(req.tenantId!);

    // Criar protocolo
    const protocol = await prisma.protocol.create({
      data: {
        number: protocolNumber,
        title,
        description: description || null,
        status: ProtocolStatus.VINCULADO,
        attachments: attachments ? JSON.stringify(attachments) : null,
        tenantId: req.tenantId!,
        citizenId,
        serviceId,
        departmentId: service.departmentId,
        createdById: req.userId || null,
      },
      include: {
        citizen: true,
        service: true,
        department: true,
        assignedUser: true,
        createdBy: true,
      },
    });

    // Criar entrada no histórico
    await prisma.protocolHistory.create({
      data: {
        action: 'CREATED',
        comment: 'Protocolo criado',
        protocolId: protocol.id,
        userId: req.userId || null,
      },
    });

    return res.status(201).json({
      message: 'Protocolo criado com sucesso',
      protocol,
    });
  } catch (error) {
    console.error('Create protocol error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: 'Erro interno do servidor',
    });
  }
});

/**
 * GET /api/protocols
 * Listar protocolos (com filtros baseados no usuário)
 */
router.get('/', authenticateToken, async (req, res) => {
  try {
    // Garantir que o usuário está autenticado
    ensureAuthenticated(req as unknown as AuthenticatedRequest);

    const { page = 1, limit = 10, status, citizenId, departmentId } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    let whereClause: Record<string, unknown> = {
      tenantId: req.tenantId,
    };

    // Filtros baseados no nível do usuário
    if (req.userRole === UserRole.USER || req.userRole === UserRole.COORDINATOR) {
      // Funcionários veem apenas protocolos do seu departamento
      if (req.user?.departmentId) {
        whereClause.departmentId = req.user.departmentId;
      }
    } else if (req.userRole === UserRole.MANAGER) {
      // Secretários veem todos os protocolos da sua secretaria
      if (req.user?.departmentId) {
        whereClause.departmentId = req.user.departmentId;
      }
    }
    // ADMIN e SUPER_ADMIN veem todos

    // Aplicar filtros adicionais
    if (status) {
      whereClause.status = status;
    }
    if (citizenId) {
      whereClause.citizenId = citizenId;
    }
    if (
      departmentId &&
      (req.userRole === UserRole.ADMIN || req.userRole === UserRole.SUPER_ADMIN)
    ) {
      whereClause.departmentId = departmentId;
    }

    const [protocols, total] = await Promise.all([
      prisma.protocol.findMany({
        where: whereClause,
        include: {
          citizen: true,
          service: true,
          department: true,
          assignedUser: {
            select: { id: true, name: true, email: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: Number(limit),
      }),
      prisma.protocol.count({ where: whereClause }),
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
    console.error('List protocols error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: 'Erro interno do servidor',
    });
  }
});

/**
 * GET /api/protocols/:id
 * Obter protocolo específico
 */
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    // Garantir que o usuário está autenticado
    ensureAuthenticated(req as unknown as AuthenticatedRequest);

    const { id } = req.params;

    const protocol = await prisma.protocol.findFirst({
      where: {
        id,
        tenantId: req.tenantId,
      },
      include: {
        citizen: true,
        service: true,
        department: true,
        assignedUser: {
          select: { id: true, name: true, email: true },
        },
        createdBy: {
          select: { id: true, name: true, email: true },
        },
        history: {
          orderBy: { timestamp: 'desc' },
        },
      },
    });

    if (!protocol) {
      return res.status(404).json({
        error: 'Not found',
        message: 'Protocolo não encontrado',
      });
    }

    // Verificar permissões de acesso
    const canAccess =
      req.userRole === UserRole.ADMIN ||
      req.userRole === UserRole.SUPER_ADMIN ||
      (req.user && protocol.departmentId === req.user.departmentId);

    if (!canAccess) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'Acesso negado a este protocolo',
      });
    }

    return res.json({ protocol });
  } catch (error) {
    console.error('Get protocol error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: 'Erro interno do servidor',
    });
  }
});

/**
 * PUT /api/protocols/:id/status
 * Atualizar status do protocolo
 */
router.put('/:id/status', authenticateToken, async (req, res) => {
  try {
    // Garantir que o usuário está autenticado
    ensureAuthenticated(req as unknown as AuthenticatedRequest);

    const { id } = req.params;
    const { status, comment } = req.body;

    if (!status) {
      return res.status(400).json({
        error: 'Bad request',
        message: 'Status é obrigatório',
      });
    }

    // Verificar se protocolo existe e usuário tem permissão
    const protocol = await prisma.protocol.findFirst({
      where: {
        id,
        tenantId: req.tenantId,
      },
    });

    if (!protocol) {
      return res.status(404).json({
        error: 'Not found',
        message: 'Protocolo não encontrado',
      });
    }

    const canUpdate =
      req.userRole === UserRole.ADMIN ||
      req.userRole === UserRole.SUPER_ADMIN ||
      (req.user && protocol.departmentId === req.user.departmentId);

    if (!canUpdate) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'Não autorizado a atualizar este protocolo',
      });
    }

    // Preparar dados para atualização
    const updateData: any = {
      status,
      updatedAt: new Date(),
    };

    // Se o status for CONCLUIDO, setar concludedAt
    if (status === 'CONCLUIDO') {
      updateData.concludedAt = new Date();
    }
    // Se estava concluído e voltou para outro status, limpar concludedAt
    else if (protocol.status === 'CONCLUIDO') {
      updateData.concludedAt = null;
    }

    // Atualizar protocolo
    const updatedProtocol = await prisma.protocol.update({
      where: { id },
      data: updateData,
      include: {
        citizen: true,
        service: true,
        department: true,
      },
    });

    // Adicionar ao histórico
    await prisma.protocolHistory.create({
      data: {
        action: `STATUS_CHANGED_TO_${status}`,
        comment: comment || `Status alterado para ${status}`,
        protocolId: id,
        userId: req.userId,
      },
    });

    return res.json({
      message: 'Status do protocolo atualizado com sucesso',
      protocol: updatedProtocol,
    });
  } catch (error) {
    console.error('Update protocol status error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: 'Erro interno do servidor',
    });
  }
});

/**
 * GET /api/protocols/citizen/:citizenId
 * Listar protocolos de um cidadão específico
 */
router.get('/citizen/:citizenId', optionalAuth, async (req, res) => {
  try {
    const { citizenId } = req.params;

    const protocols = await prisma.protocol.findMany({
      where: {
        citizenId,
        tenantId: req.tenantId,
      },
      include: {
        service: true,
        department: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return res.json({ protocols });
  } catch (error) {
    console.error('Get citizen protocols error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: 'Erro interno do servidor',
    });
  }
});

export default router;
