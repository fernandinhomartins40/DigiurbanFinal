/**
 * ============================================================================
 * API: PRODUTORES RURAIS (Módulo Padrão - CRUD Completo)
 * ============================================================================
 */

import { Router } from 'express';
import { prisma } from '../lib/prisma';
import { tenantMiddleware } from '../middleware/tenant';
import { adminAuthMiddleware } from '../middleware/admin-auth';
import { GuaranteedTenantRequest } from '../types';

const router = Router();

router.use(tenantMiddleware);
router.use(adminAuthMiddleware);

// =============================================================================
// GET / - Listar produtores com filtros e paginação
// =============================================================================
router.get('/', async (req, res) => {
  try {
    const { tenant } = req as GuaranteedTenantRequest;
    const {
      page = '1',
      limit = '20',
      status,
      productionType,
      search,
    } = req.query;

    const where: any = {
      tenantId: tenant.id,
    };

    if (status && status !== 'all') {
      where.status = status;
    }

    if (productionType && productionType !== 'all') {
      where.productionType = productionType;
    }

    if (search) {
      where.OR = [
        { name: { contains: search as string } },
        { document: { contains: search as string } },
        { email: { contains: search as string } },
      ];
    }

    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
    const take = parseInt(limit as string);

    const [data, total] = await Promise.all([
      prisma.ruralProducer.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.ruralProducer.count({ where }),
    ]);

    // Estatísticas
    const stats = await prisma.ruralProducer.aggregate({
      where: { tenantId: tenant.id },
      _count: { id: true },
    });

    const activeCount = await prisma.ruralProducer.count({
      where: { tenantId: tenant.id, status: 'ACTIVE' },
    });

    const inactiveCount = await prisma.ruralProducer.count({
      where: { tenantId: tenant.id, status: 'INACTIVE' },
    });

    const thisMonth = await prisma.ruralProducer.count({
      where: {
        tenantId: tenant.id,
        createdAt: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        },
      },
    });

    return res.json({
      data,
      pagination: {
        page: parseInt(page as string),
        limit: take,
        total,
        pages: Math.ceil(total / take),
      },
      stats: {
        total: stats._count.id,
        active: activeCount,
        inactive: inactiveCount,
        thisMonth,
      },
    });
  } catch (error) {
    console.error('Error fetching rural producers:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// =============================================================================
// GET /:id - Buscar produtor por ID
// =============================================================================
router.get('/:id', async (req, res) => {
  try {
    const { tenant } = req as GuaranteedTenantRequest;
    const { id } = req.params;

    const producer = await prisma.ruralProducer.findFirst({
      where: {
        id,
        tenantId: tenant.id,
      },
      include: {
        properties: true,
      },
    });

    if (!producer) {
      return res.status(404).json({ error: 'Produtor não encontrado' });
    }

    return res.json({ data: producer });
  } catch (error) {
    console.error('Error fetching producer:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// =============================================================================
// POST / - Criar novo produtor
// =============================================================================
router.post('/', async (req, res) => {
  try {
    const { tenant } = req as GuaranteedTenantRequest;
    const { name, document, email, phone, address, productionType, mainCrop, status } = req.body;

    // Validações
    if (!name || !document) {
      return res.status(400).json({
        error: 'Campos obrigatórios: name, document',
      });
    }

    // Verificar se já existe
    const existing = await prisma.ruralProducer.findFirst({
      where: {
        tenantId: tenant.id,
        document,
      },
    });

    if (existing) {
      return res.status(400).json({
        error: 'Já existe um produtor cadastrado com este documento',
      });
    }

    const producer = await prisma.ruralProducer.create({
      data: {
        tenantId: tenant.id,
        name,
        document,
        email,
        phone,
        address,
        productionType,
        mainCrop,
        status: status || 'ACTIVE',
        isActive: true,
      },
    });

    return res.status(201).json({
      success: true,
      message: 'Produtor cadastrado com sucesso!',
      data: producer,
    });
  } catch (error) {
    console.error('Error creating producer:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// =============================================================================
// PUT /:id - Atualizar produtor
// =============================================================================
router.put('/:id', async (req, res) => {
  try {
    const { tenant } = req as GuaranteedTenantRequest;
    const { id } = req.params;
    const { name, document, email, phone, address, productionType, mainCrop, status } = req.body;

    const producer = await prisma.ruralProducer.findFirst({
      where: {
        id,
        tenantId: tenant.id,
      },
    });

    if (!producer) {
      return res.status(404).json({ error: 'Produtor não encontrado' });
    }

    // Se alterou o documento, verificar duplicidade
    if (document && document !== producer.document) {
      const existing = await prisma.ruralProducer.findFirst({
        where: {
          tenantId: tenant.id,
          document,
          id: { not: id },
        },
      });

      if (existing) {
        return res.status(400).json({
          error: 'Já existe outro produtor com este documento',
        });
      }
    }

    const updated = await prisma.ruralProducer.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(document && { document }),
        ...(email !== undefined && { email }),
        ...(phone !== undefined && { phone }),
        ...(address !== undefined && { address }),
        ...(productionType !== undefined && { productionType }),
        ...(mainCrop !== undefined && { mainCrop }),
        ...(status !== undefined && { status }),
      },
    });

    return res.json({
      success: true,
      message: 'Produtor atualizado com sucesso!',
      data: updated,
    });
  } catch (error) {
    console.error('Error updating producer:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// =============================================================================
// DELETE /:id - Deletar produtor
// =============================================================================
router.delete('/:id', async (req, res) => {
  try {
    const { tenant } = req as GuaranteedTenantRequest;
    const { id } = req.params;

    const producer = await prisma.ruralProducer.findFirst({
      where: {
        id,
        tenantId: tenant.id,
      },
      include: {
        _count: {
          select: { properties: true },
        },
      },
    });

    if (!producer) {
      return res.status(404).json({ error: 'Produtor não encontrado' });
    }

    // Verificar se tem propriedades vinculadas
    if (producer._count.properties > 0) {
      return res.status(400).json({
        error: `Não é possível deletar produtor com ${producer._count.properties} propriedade(s) vinculada(s)`,
      });
    }

    await prisma.ruralProducer.delete({
      where: { id },
    });

    return res.json({
      success: true,
      message: 'Produtor deletado com sucesso!',
    });
  } catch (error) {
    console.error('Error deleting producer:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

export default router;
