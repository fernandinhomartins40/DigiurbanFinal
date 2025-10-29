/**
 * ============================================================================
 * PROTOCOLS SIMPLIFIED ROUTES - Sistema Integrado com Módulos
 * ============================================================================
 * Rotas de protocolos simplificados com integração automática aos módulos
 */

import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { adminAuthMiddleware, requireMinRole } from '../middleware/admin-auth';
import { tenantMiddleware } from '../middleware/tenant';
import { UserRole, ProtocolStatus } from '@prisma/client';
import { AuthenticatedRequest } from '../types';
import { protocolModuleService } from '../services/protocol-module.service';
import { protocolServiceSimplified } from '../services/protocol-simplified.service';

const router = Router();

// Aplicar middlewares
router.use(tenantMiddleware);
router.use(adminAuthMiddleware);

// ========================================
// CRIAR PROTOCOLO (INTEGRADO COM MÓDULOS)
// ========================================

/**
 * POST /api/protocols-simplified
 * Criar novo protocolo (integrado com módulos)
 */
router.post('/', requireMinRole(UserRole.USER), async (req, res) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const tenantId = authReq.tenantId;
    const userId = authReq.userId;

    const {
      serviceId,
      citizenData,
      formData,
      latitude,
      longitude,
      address,
      attachments,
    } = req.body;

    // Validações
    if (!serviceId) {
      return res.status(400).json({
        success: false,
        error: 'serviceId é obrigatório',
      });
    }

    if (!citizenData || !citizenData.cpf) {
      return res.status(400).json({
        success: false,
        error: 'Dados do cidadão são obrigatórios (cpf mínimo)',
      });
    }

    // Buscar ou criar cidadão
    let citizen = await prisma.citizen.findFirst({
      where: {
        tenantId,
        cpf: citizenData.cpf,
      },
    });

    if (!citizen) {
      citizen = await prisma.citizen.create({
        data: {
          tenantId,
          cpf: citizenData.cpf,
          name: citizenData.name || 'Cidadão',
          email: citizenData.email || `temp_${citizenData.cpf}@temp.com`,
          phone: citizenData.phone,
          password: 'TEMP_PASSWORD',
          registrationSource: 'ADMIN',
        },
      });
    }

    // Criar protocolo com integração de módulo
    const result = await protocolModuleService.createProtocolWithModule({
      tenantId,
      citizenId: citizen.id,
      serviceId,
      formData: formData || {},
      createdById: userId,
      latitude,
      longitude,
      address,
      attachments,
    });

    return res.status(201).json({
      success: true,
      data: {
        protocol: result.protocol,
        hasModule: result.hasModule,
        moduleEntity: result.moduleEntity ? {
          id: result.moduleEntity.id,
          type: result.protocol.moduleType,
        } : null,
      },
      message: result.hasModule
        ? `Protocolo ${result.protocol.number} criado e vinculado ao módulo`
        : `Protocolo ${result.protocol.number} criado (informativo)`,
    });
  } catch (error: any) {
    console.error('Create protocol error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Erro ao criar protocolo',
    });
  }
});

// ========================================
// BUSCAR PROTOCOLO
// ========================================

/**
 * GET /api/protocols-simplified/:number
 * Busca protocolo por número
 */
router.get('/:number', async (req: Request, res: Response) => {
  try {
    const { number } = req.params;

    const protocol = await protocolServiceSimplified.findByNumber(number);

    if (!protocol) {
      return res.status(404).json({
        success: false,
        error: 'Protocolo não encontrado',
      });
    }

    return res.json({
      success: true,
      data: protocol,
    });
  } catch (error: any) {
    console.error('Erro ao buscar protocolo:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Erro ao buscar protocolo',
    });
  }
});

// ========================================
// APROVAR/REJEITAR PROTOCOLO (NOVO)
// ========================================

/**
 * PUT /api/protocols-simplified/:id/approve
 * Aprovar protocolo (ativa registro no módulo)
 */
router.put('/:id/approve', requireMinRole(UserRole.MANAGER), async (req, res) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const userId = authReq.userId;
    const { id } = req.params;
    const { comment, additionalData } = req.body;

    const protocol = await protocolModuleService.approveProtocol({
      protocolId: id,
      userId,
      comment,
      additionalData,
    });

    return res.json({
      success: true,
      data: protocol,
      message: 'Protocolo aprovado com sucesso',
    });
  } catch (error: any) {
    console.error('Approve protocol error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Erro ao aprovar protocolo',
    });
  }
});

/**
 * PUT /api/protocols-simplified/:id/reject
 * Rejeitar protocolo
 */
router.put('/:id/reject', requireMinRole(UserRole.MANAGER), async (req, res) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const userId = authReq.userId;
    const { id } = req.params;
    const { reason } = req.body;

    if (!reason) {
      return res.status(400).json({
        success: false,
        error: 'Motivo da rejeição é obrigatório',
      });
    }

    const protocol = await protocolModuleService.rejectProtocol({
      protocolId: id,
      userId,
      reason,
    });

    return res.json({
      success: true,
      data: protocol,
      message: 'Protocolo rejeitado',
    });
  } catch (error: any) {
    console.error('Reject protocol error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Erro ao rejeitar protocolo',
    });
  }
});

// ========================================
// ATUALIZAR STATUS
// ========================================

/**
 * PATCH /api/protocols-simplified/:id/status
 * Atualiza status do protocolo
 */
router.patch('/:id/status', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, comment, userId } = req.body;

    if (!status || !Object.values(ProtocolStatus).includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Status inválido',
      });
    }

    const protocol = await protocolServiceSimplified.updateStatus({
      protocolId: id,
      newStatus: status,
      comment,
      userId,
    });

    return res.json({
      success: true,
      data: protocol,
      message: 'Status atualizado com sucesso',
    });
  } catch (error: any) {
    console.error('Erro ao atualizar status:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Erro ao atualizar status',
    });
  }
});

// ========================================
// ADICIONAR COMENTÁRIO
// ========================================

/**
 * POST /api/protocols-simplified/:id/comments
 * Adiciona comentário ao protocolo
 */
router.post('/:id/comments', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { comment, userId } = req.body;

    if (!comment) {
      return res.status(400).json({
        success: false,
        error: 'Comentário é obrigatório',
      });
    }

    await protocolServiceSimplified.addComment(id, comment, userId);

    return res.json({
      success: true,
      message: 'Comentário adicionado com sucesso',
    });
  } catch (error: any) {
    console.error('Erro ao adicionar comentário:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Erro ao adicionar comentário',
    });
  }
});

// ========================================
// ATRIBUIR PROTOCOLO
// ========================================

/**
 * PATCH /api/protocols-simplified/:id/assign
 * Atribui protocolo a um usuário
 */
router.patch('/:id/assign', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { assignedUserId, userId } = req.body;

    if (!assignedUserId) {
      return res.status(400).json({
        success: false,
        error: 'assignedUserId é obrigatório',
      });
    }

    const protocol = await protocolServiceSimplified.assignProtocol(
      id,
      assignedUserId,
      userId
    );

    return res.json({
      success: true,
      data: protocol,
      message: 'Protocolo atribuído com sucesso',
    });
  } catch (error: any) {
    console.error('Erro ao atribuir protocolo:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Erro ao atribuir protocolo',
    });
  }
});

// ========================================
// LISTAR PROTOCOLOS
// ========================================

/**
 * GET /api/protocols-simplified/department/:departmentId
 * Lista protocolos por departamento
 */
router.get('/department/:departmentId', async (req: Request, res: Response) => {
  try {
    const { departmentId } = req.params;
    const filters = req.query as any;

    const protocols = await protocolServiceSimplified.listByDepartment(
      departmentId,
      filters
    );

    return res.json({
      success: true,
      data: protocols,
      count: protocols.length,
    });
  } catch (error: any) {
    console.error('Erro ao listar protocolos:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Erro ao listar protocolos',
    });
  }
});

/**
 * GET /api/protocols-simplified/module/:departmentId/:moduleType
 * Lista protocolos por módulo
 */
router.get('/module/:departmentId/:moduleType', async (req: Request, res: Response) => {
  try {
    const { departmentId, moduleType } = req.params;

    const protocols = await protocolServiceSimplified.listByModule(
      departmentId,
      moduleType
    );

    return res.json({
      success: true,
      data: protocols,
      count: protocols.length,
    });
  } catch (error: any) {
    console.error('Erro ao listar protocolos:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Erro ao listar protocolos',
    });
  }
});

/**
 * GET /api/protocols-simplified/module/:moduleType/pending (NOVO)
 * Listar protocolos pendentes de um módulo específico
 */
router.get(
  '/module/:moduleType/pending',
  requireMinRole(UserRole.USER),
  async (req, res) => {
    try {
      const authReq = req as AuthenticatedRequest;
      const tenantId = authReq.tenantId;
      const { moduleType } = req.params;
      const { page = 1, limit = 20 } = req.query;

      const result = await protocolModuleService.getPendingProtocolsByModule(
        tenantId,
        moduleType,
        Number(page),
        Number(limit)
      );

      return res.json({
        success: true,
        ...result,
      });
    } catch (error) {
      console.error('Get pending protocols error:', error);
      return res.status(500).json({
        success: false,
        error: 'Erro ao buscar protocolos pendentes',
      });
    }
  }
);

/**
 * GET /api/protocols-simplified/citizen/:citizenId
 * Lista protocolos do cidadão
 */
router.get('/citizen/:citizenId', async (req: Request, res: Response) => {
  try {
    const { citizenId } = req.params;

    const protocols = await protocolServiceSimplified.listByCitizen(citizenId);

    return res.json({
      success: true,
      data: protocols,
      count: protocols.length,
    });
  } catch (error: any) {
    console.error('Erro ao listar protocolos:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Erro ao listar protocolos',
    });
  }
});

// ========================================
// HISTÓRICO
// ========================================

/**
 * GET /api/protocols-simplified/:id/history
 * Obtém histórico completo do protocolo
 */
router.get('/:id/history', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const history = await protocolServiceSimplified.getHistory(id);

    return res.json({
      success: true,
      data: history,
    });
  } catch (error: any) {
    console.error('Erro ao buscar histórico:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Erro ao buscar histórico',
    });
  }
});

// ========================================
// AVALIAÇÃO
// ========================================

/**
 * POST /api/protocols-simplified/:id/evaluate
 * Avalia protocolo
 */
router.post('/:id/evaluate', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { rating, comment, wouldRecommend } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        error: 'Rating deve ser entre 1 e 5',
      });
    }

    const evaluation = await protocolServiceSimplified.evaluateProtocol(
      id,
      rating,
      comment,
      wouldRecommend
    );

    return res.status(201).json({
      success: true,
      data: evaluation,
      message: 'Avaliação registrada com sucesso',
    });
  } catch (error: any) {
    console.error('Erro ao avaliar protocolo:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Erro ao avaliar protocolo',
    });
  }
});

// ========================================
// ESTATÍSTICAS
// ========================================

/**
 * GET /api/protocols-simplified/stats/:departmentId
 * Obtém estatísticas de protocolos por departamento
 */
router.get('/stats/:departmentId', async (req: Request, res: Response) => {
  try {
    const { departmentId } = req.params;
    const { startDate, endDate } = req.query;

    const stats = await protocolServiceSimplified.getDepartmentStats(
      departmentId,
      startDate ? new Date(startDate as string) : undefined,
      endDate ? new Date(endDate as string) : undefined
    );

    return res.json({
      success: true,
      data: stats,
    });
  } catch (error: any) {
    console.error('Erro ao buscar estatísticas:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Erro ao buscar estatísticas',
    });
  }
});

export default router;
