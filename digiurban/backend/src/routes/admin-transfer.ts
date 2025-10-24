import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { z } from 'zod';
import { asyncHandler } from '../utils/express-helpers';
import { logAuditEvent, AUDIT_EVENTS } from '../utils/audit-logger';
import { adminAuthMiddleware } from '../middleware/admin-auth';
import { tenantMiddleware } from '../middleware/tenant';

const router = Router();

// Tipo local para requisições autenticadas
type AdminRequest = Request & {
  tenant?: {
    id: string;
    name: string;
    [key: string]: any;
  };
  user?: {
    id: string;
    email: string;
    name: string;
    role: string;
    [key: string]: any;
  };
};

// Schemas de validação
const reviewTransferRequestSchema = z.object({
  status: z.enum(['APPROVED', 'REJECTED']),
  reviewNotes: z.string().optional(),
});

// Aplicar autenticação admin e tenant em todas as rotas
router.use(tenantMiddleware);
router.use(adminAuthMiddleware);

// ====================== ENDPOINTS DO ADMIN ======================

// GET /api/admin/transfer-requests - Listar solicitações de transferência (entrantes no município)
router.get('/transfer-requests', asyncHandler(async (req: AdminRequest, res: Response) => {
  try {
    const { status } = req.query;
    const { tenant } = req;

    if (!tenant) {
      return res.status(400).json({ error: 'Tenant não identificado' });
    }

    // Buscar solicitações onde o município atual é o destino (toTenantId)
    const whereClause: any = {
      toTenantId: tenant.id,
    };

    // Filtrar por status se fornecido
    if (status && typeof status === 'string') {
      whereClause.status = status.toUpperCase();
    }

    const requests = await prisma.citizenTransferRequest.findMany({
      where: whereClause,
      include: {
        citizen: {
          select: {
            id: true,
            cpf: true,
            name: true,
            email: true,
            phone: true,
            verificationStatus: true,
          },
        },
        fromTenant: {
          select: {
            id: true,
            name: true,
            nomeMunicipio: true,
            ufMunicipio: true,
          },
        },
        toTenant: {
          select: {
            id: true,
            name: true,
            nomeMunicipio: true,
            ufMunicipio: true,
          },
        },
        reviewedBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: [
        { status: 'asc' }, // PENDING primeiro
        { createdAt: 'desc' },
      ],
    });

    // Estatísticas
    const stats = {
      pending: requests.filter((r) => r.status === 'PENDING').length,
      approved: requests.filter((r) => r.status === 'APPROVED').length,
      rejected: requests.filter((r) => r.status === 'REJECTED').length,
      total: requests.length,
    };

    return res.json({
      success: true,
      requests,
      stats,
    });
  } catch (error: unknown) {
    console.error('Erro ao buscar solicitações:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
}));

// GET /api/admin/transfer-requests/:id - Obter detalhes de uma solicitação
router.get('/transfer-requests/:id', asyncHandler(async (req: AdminRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { tenant } = req;

    if (!tenant) {
      return res.status(400).json({ error: 'Tenant não identificado' });
    }

    const request = await prisma.citizenTransferRequest.findFirst({
      where: {
        id,
        toTenantId: tenant.id, // Só pode ver solicitações para o seu município
      },
      include: {
        citizen: {
          select: {
            id: true,
            cpf: true,
            name: true,
            email: true,
            phone: true,
            address: true,
            verificationStatus: true,
            createdAt: true,
          },
        },
        fromTenant: {
          select: {
            id: true,
            name: true,
            nomeMunicipio: true,
            ufMunicipio: true,
          },
        },
        toTenant: {
          select: {
            id: true,
            name: true,
            nomeMunicipio: true,
            ufMunicipio: true,
          },
        },
        reviewedBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!request) {
      return res.status(404).json({ error: 'Solicitação não encontrada' });
    }

    return res.json({
      success: true,
      request,
    });
  } catch (error: unknown) {
    console.error('Erro ao buscar solicitação:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
}));

// PATCH /api/admin/transfer-requests/:id - Aprovar ou rejeitar transferência
router.patch('/transfer-requests/:id', asyncHandler(async (req: AdminRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { tenant, user } = req;

    if (!tenant) {
      return res.status(400).json({ error: 'Tenant não identificado' });
    }

    if (!user) {
      return res.status(401).json({ error: 'Usuário não autenticado' });
    }

    // Validar dados
    const data = reviewTransferRequestSchema.parse(req.body);

    // Buscar solicitação
    const transferRequest = await prisma.citizenTransferRequest.findFirst({
      where: {
        id,
        toTenantId: tenant.id, // Só pode revisar solicitações para o seu município
      },
      include: {
        citizen: true,
        fromTenant: true,
        toTenant: true,
      },
    });

    if (!transferRequest) {
      return res.status(404).json({ error: 'Solicitação não encontrada' });
    }

    // Verificar se ainda está pendente
    if (transferRequest.status !== 'PENDING') {
      return res.status(400).json({
        error: 'Esta solicitação já foi processada',
      });
    }

    // Atualizar status da solicitação
    const updatedRequest = await prisma.citizenTransferRequest.update({
      where: { id },
      data: {
        status: data.status,
        reviewedById: user.id,
        reviewedAt: new Date(),
        reviewNotes: data.reviewNotes || null,
      },
      include: {
        citizen: true,
        fromTenant: true,
        toTenant: true,
      },
    });

    // Se aprovado, transferir o cidadão
    if (data.status === 'APPROVED') {
      await prisma.citizen.update({
        where: { id: transferRequest.citizenId },
        data: {
          tenantId: tenant.id, // Transferir para o novo município
          verificationStatus: 'VERIFIED', // Auto-aprovar após transferência
        },
      });

      // Criar notificação de aprovação
      await prisma.notification.create({
        data: {
          tenantId: tenant.id,
          citizenId: transferRequest.citizenId,
          title: 'Transferência Aprovada!',
          message: `Sua solicitação de transferência para ${tenant.nomeMunicipio || tenant.name} - ${tenant.ufMunicipio} foi aprovada! Faça login novamente para acessar os serviços do novo município.`,
          type: 'SUCCESS',
          channel: 'WEB',
        },
      });
    } else {
      // Criar notificação de rejeição
      await prisma.notification.create({
        data: {
          tenantId: transferRequest.fromTenantId,
          citizenId: transferRequest.citizenId,
          title: 'Transferência Rejeitada',
          message: `Sua solicitação de transferência para ${tenant.nomeMunicipio || tenant.name} - ${tenant.ufMunicipio} foi rejeitada. ${data.reviewNotes ? `Motivo: ${data.reviewNotes}` : ''}`,
          type: 'ERROR',
          channel: 'WEB',
        },
      });
    }

    // Log de auditoria
    await logAuditEvent({
      userId: user.id,
      tenantId: tenant.id,
      action: AUDIT_EVENTS.TENANT_CONFIG_CHANGE, // Usar evento existente
      resource: `/api/admin/transfer-requests/${id}`,
      method: 'PATCH',
      details: {
        transferRequestId: id,
        action: data.status.toLowerCase(),
        citizenId: transferRequest.citizenId,
        fromTenant: transferRequest.fromTenant.name,
        toTenant: transferRequest.toTenant.name,
        reviewNotes: data.reviewNotes,
      },
      ip: req.ip || req.socket.remoteAddress,
      userAgent: req.headers['user-agent'],
      success: true,
    });

    return res.json({
      success: true,
      message: data.status === 'APPROVED'
        ? 'Transferência aprovada com sucesso'
        : 'Transferência rejeitada',
      request: updatedRequest,
    });
  } catch (error: unknown) {
    console.error('Erro ao processar solicitação:', error);

    if (error && typeof error === 'object' && 'name' in error && error.name === 'ZodError') {
      return res.status(400).json({
        error: 'Dados inválidos',
        details: 'issues' in error ? error.issues : [],
      });
    }

    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
}));

// GET /api/admin/transfer-requests/stats/overview - Estatísticas gerais
router.get('/transfer-requests/stats/overview', asyncHandler(async (req: AdminRequest, res: Response) => {
  try {
    const { tenant } = req;

    if (!tenant) {
      return res.status(400).json({ error: 'Tenant não identificado' });
    }

    const [pending, approved, rejected, total] = await Promise.all([
      prisma.citizenTransferRequest.count({
        where: { toTenantId: tenant.id, status: 'PENDING' },
      }),
      prisma.citizenTransferRequest.count({
        where: { toTenantId: tenant.id, status: 'APPROVED' },
      }),
      prisma.citizenTransferRequest.count({
        where: { toTenantId: tenant.id, status: 'REJECTED' },
      }),
      prisma.citizenTransferRequest.count({
        where: { toTenantId: tenant.id },
      }),
    ]);

    return res.json({
      success: true,
      stats: {
        pending,
        approved,
        rejected,
        total,
      },
    });
  } catch (error: unknown) {
    console.error('Erro ao buscar estatísticas:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
}));

export default router;
