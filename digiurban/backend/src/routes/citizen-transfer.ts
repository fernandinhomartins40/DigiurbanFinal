import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import * as jwt from 'jsonwebtoken';
import { z } from 'zod';
import { tenantMiddleware } from '../middleware/tenant';
import { asyncHandler } from '../utils/express-helpers';
import { logAuditEvent, AUDIT_EVENTS } from '../utils/audit-logger';

// ====================== TIPOS LOCAIS ======================
type LocalTenantRequest = Request & {
  tenant?: {
    id: string;
    name: string;
    [key: string]: any;
  };
  tenantId?: string;
}

const router = Router();

// Schemas de validação
const createTransferRequestSchema = z.object({
  toTenantId: z.string().min(1, 'Município de destino é obrigatório'),
  reason: z.string().min(20, 'Justificativa deve ter pelo menos 20 caracteres'),
  documents: z.any().optional(),
});

// Middleware para verificar tenant
router.use(tenantMiddleware);

// ====================== ENDPOINTS DO CIDADÃO ======================

// GET /api/citizen/municipalities/active - Listar municípios disponíveis para transferência
router.get('/municipalities/active', asyncHandler(async (req: LocalTenantRequest, res: Response) => {
  try {
    const municipalities = await prisma.tenant.findMany({
      where: {
        status: { in: ['ACTIVE', 'TRIAL'] },
      },
      select: {
        id: true,
        name: true,
        nomeMunicipio: true,
        ufMunicipio: true,
        codigoIbge: true,
        status: true,
      },
      orderBy: [
        { nomeMunicipio: 'asc' },
        { name: 'asc' },
      ],
    });

    return res.json({
      success: true,
      municipalities,
    });
  } catch (error: unknown) {
    console.error('Erro ao buscar municípios:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
}));

// POST /api/citizen/transfer-request - Criar solicitação de transferência
router.post('/transfer-request', asyncHandler(async (req: LocalTenantRequest, res: Response) => {
  try {
    // Obter token do cookie
    let token = req.cookies?.digiurban_citizen_token;

    if (!token) {
      const authHeader = req.headers.authorization;
      if (authHeader?.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      }
    }

    if (!token) {
      return res.status(401).json({ error: 'Token não fornecido' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as jwt.JwtPayload & {
      type: string;
      tenantId: string;
      citizenId: string;
    };

    if (decoded.type !== 'citizen') {
      return res.status(401).json({ error: 'Token inválido para cidadão' });
    }

    const { tenant } = req;

    if (!tenant) {
      return res.status(400).json({ error: 'Tenant não identificado' });
    }

    // Validar dados
    const data = createTransferRequestSchema.parse(req.body);

    // Validar que o município de destino é diferente do atual
    if (data.toTenantId === tenant.id) {
      return res.status(400).json({
        error: 'O município de destino deve ser diferente do município atual',
      });
    }

    // Buscar cidadão
    const citizen = await prisma.citizen.findFirst({
      where: {
        id: decoded.citizenId,
        tenantId: tenant.id,
        isActive: true,
      },
    });

    if (!citizen) {
      return res.status(404).json({ error: 'Cidadão não encontrado' });
    }

    // Verificar se já existe solicitação pendente
    const existingRequest = await prisma.citizenTransferRequest.findFirst({
      where: {
        citizenId: citizen.id,
        status: 'PENDING',
      },
    });

    if (existingRequest) {
      return res.status(400).json({
        error: 'Você já possui uma solicitação de transferência pendente',
      });
    }

    // Verificar se o município de destino existe e está ativo
    const toTenant = await prisma.tenant.findFirst({
      where: {
        id: data.toTenantId,
        status: { in: ['ACTIVE', 'TRIAL'] },
      },
    });

    if (!toTenant) {
      return res.status(400).json({
        error: 'Município de destino não está disponível',
      });
    }

    // Verificar se já existe cidadão com esse CPF no município de destino
    const existingCitizenInDestination = await prisma.citizen.findFirst({
      where: {
        cpf: citizen.cpf,
        tenantId: data.toTenantId,
      },
    });

    if (existingCitizenInDestination) {
      return res.status(400).json({
        error: 'Já existe um cadastro com seu CPF no município de destino',
      });
    }

    // Criar solicitação de transferência
    const transferRequest = await prisma.citizenTransferRequest.create({
      data: {
        citizenId: citizen.id,
        fromTenantId: tenant.id,
        toTenantId: data.toTenantId,
        reason: data.reason,
        documents: data.documents || null,
        status: 'PENDING',
      },
      include: {
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
      },
    });

    // Criar notificação para o cidadão
    await prisma.notification.create({
      data: {
        tenantId: tenant.id,
        citizenId: citizen.id,
        title: 'Solicitação de Transferência Enviada',
        message: `Sua solicitação de transferência para ${toTenant.nomeMunicipio || toTenant.name} - ${toTenant.ufMunicipio} foi enviada e está aguardando análise.`,
        type: 'INFO',
        channel: 'WEB',
      },
    });

    // Log de auditoria
    await logAuditEvent({
      citizenId: citizen.id,
      tenantId: tenant.id,
      action: AUDIT_EVENTS.CITIZEN_REGISTERED, // Usar evento genérico ou criar novo
      resource: '/api/citizen/transfer-request',
      method: 'POST',
      details: {
        fromTenant: tenant.name,
        toTenant: toTenant.name,
        transferRequestId: transferRequest.id,
      },
      ip: req.ip || req.socket.remoteAddress,
      userAgent: req.headers['user-agent'],
      success: true,
    });

    return res.status(201).json({
      success: true,
      message: 'Solicitação de transferência criada com sucesso',
      data: transferRequest,
    });
  } catch (error: unknown) {
    console.error('Erro ao criar solicitação:', error);

    if (error && typeof error === 'object' && 'name' in error && error.name === 'ZodError') {
      return res.status(400).json({
        error: 'Dados inválidos',
        details: 'issues' in error ? error.issues : [],
      });
    }

    if (error && typeof error === 'object' && 'name' in error && error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Token inválido' });
    }

    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
}));

// GET /api/citizen/transfer-requests - Listar minhas solicitações de transferência
router.get('/transfer-requests', asyncHandler(async (req: LocalTenantRequest, res: Response) => {
  try {
    // Obter token do cookie
    let token = req.cookies?.digiurban_citizen_token;

    if (!token) {
      const authHeader = req.headers.authorization;
      if (authHeader?.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      }
    }

    if (!token) {
      return res.status(401).json({ error: 'Token não fornecido' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as jwt.JwtPayload & {
      type: string;
      tenantId: string;
      citizenId: string;
    };

    if (decoded.type !== 'citizen') {
      return res.status(401).json({ error: 'Token inválido para cidadão' });
    }

    const requests = await prisma.citizenTransferRequest.findMany({
      where: {
        citizenId: decoded.citizenId,
      },
      include: {
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
      orderBy: { createdAt: 'desc' },
    });

    return res.json({
      success: true,
      requests,
    });
  } catch (error: unknown) {
    console.error('Erro ao buscar solicitações:', error);

    if (error && typeof error === 'object' && 'name' in error && error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Token inválido' });
    }

    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
}));

// DELETE /api/citizen/transfer-requests/:id - Cancelar solicitação pendente
router.delete('/transfer-requests/:id', asyncHandler(async (req: LocalTenantRequest, res: Response) => {
  try {
    // Obter token do cookie
    let token = req.cookies?.digiurban_citizen_token;

    if (!token) {
      const authHeader = req.headers.authorization;
      if (authHeader?.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      }
    }

    if (!token) {
      return res.status(401).json({ error: 'Token não fornecido' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as jwt.JwtPayload & {
      type: string;
      tenantId: string;
      citizenId: string;
    };

    if (decoded.type !== 'citizen') {
      return res.status(401).json({ error: 'Token inválido para cidadão' });
    }

    const { id } = req.params;

    // Buscar solicitação
    const transferRequest = await prisma.citizenTransferRequest.findUnique({
      where: { id },
    });

    if (!transferRequest) {
      return res.status(404).json({ error: 'Solicitação não encontrada' });
    }

    // Verificar se é do cidadão autenticado
    if (transferRequest.citizenId !== decoded.citizenId) {
      return res.status(403).json({ error: 'Você não tem permissão para cancelar esta solicitação' });
    }

    // Verificar se ainda está pendente
    if (transferRequest.status !== 'PENDING') {
      return res.status(400).json({
        error: 'Apenas solicitações pendentes podem ser canceladas',
      });
    }

    // Atualizar status para CANCELLED
    await prisma.citizenTransferRequest.update({
      where: { id },
      data: { status: 'CANCELLED' },
    });

    // Log de auditoria
    await logAuditEvent({
      citizenId: decoded.citizenId,
      tenantId: decoded.tenantId,
      action: AUDIT_EVENTS.CITIZEN_REGISTERED, // Usar evento genérico
      resource: `/api/citizen/transfer-requests/${id}`,
      method: 'DELETE',
      details: {
        transferRequestId: id,
        action: 'cancelled',
      },
      ip: req.ip || req.socket.remoteAddress,
      userAgent: req.headers['user-agent'],
      success: true,
    });

    return res.json({
      success: true,
      message: 'Solicitação cancelada com sucesso',
    });
  } catch (error: unknown) {
    console.error('Erro ao cancelar solicitação:', error);

    if (error && typeof error === 'object' && 'name' in error && error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Token inválido' });
    }

    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
}));

export default router;
