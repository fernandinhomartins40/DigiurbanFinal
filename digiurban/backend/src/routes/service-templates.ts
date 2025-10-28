/**
 * ============================================================================
 * SERVICE TEMPLATES API - Gerenciamento de Templates de Serviços
 * ============================================================================
 *
 * Endpoints para admins gerenciarem templates e ativarem serviços padrões.
 *
 * @author DigiUrban Team
 * @version 1.0
 */

import { Router } from 'express';
import { prisma } from '../lib/prisma';
import { tenantMiddleware } from '../middleware/tenant';
import { adminAuthMiddleware } from '../middleware/admin-auth';
import { GuaranteedTenantRequest } from '../types';

const router = Router();

// Aplicar middlewares
router.use(tenantMiddleware);
router.use(adminAuthMiddleware);

// =============================================================================
// GET /api/admin/templates - Listar todos os templates disponíveis
// =============================================================================
router.get('/', async (req, res) => {
  try {
    const { tenant } = req as GuaranteedTenantRequest;
    const { category, search, page = 1, limit = 50 } = req.query;

    const skip = (Number(page) - 1) * Number(limit);

    // Filtros
    const where: any = {
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

    // Buscar templates
    const [templates, total] = await Promise.all([
      prisma.serviceTemplate.findMany({
        where,
        orderBy: [
          { category: 'asc' },
          { name: 'asc' },
        ],
        skip,
        take: Number(limit),
      }),
      prisma.serviceTemplate.count({ where }),
    ]);

    // Para cada template, verificar se já foi ativado no tenant
    const templatesWithStatus = await Promise.all(
      templates.map(async (template) => {
        const activeInstance = await prisma.service.findFirst({
          where: {
            tenantId: tenant.id,
            templateId: template.id,
          },
          select: {
            id: true,
            isActive: true,
          },
        });

        return {
          ...template,
          isActivated: !!activeInstance,
          activeServiceId: activeInstance?.id,
          activeServiceIsActive: activeInstance?.isActive,
        };
      })
    );

    return res.json({
      templates: templatesWithStatus,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    console.error('Erro ao listar templates:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// =============================================================================
// GET /api/admin/templates/categories - Listar categorias de templates
// =============================================================================
router.get('/categories', async (req, res) => {
  try {
    const categories = await prisma.serviceTemplate.groupBy({
      by: ['category'],
      where: {
        isActive: true,
      },
      _count: {
        category: true,
      },
      orderBy: {
        category: 'asc',
      },
    });

    const result = categories.map((cat) => ({
      name: cat.category,
      count: cat._count.category,
    }));

    return res.json({ categories: result });
  } catch (error) {
    console.error('Erro ao listar categorias:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// =============================================================================
// GET /api/admin/templates/:id - Detalhes de um template específico
// =============================================================================
router.get('/:id', async (req, res) => {
  try {
    const { tenant } = req as GuaranteedTenantRequest;
    const { id } = req.params;

    const template = await prisma.serviceTemplate.findUnique({
      where: { id },
    });

    if (!template) {
      return res.status(404).json({ error: 'Template não encontrado' });
    }

    return res.json({ template });
  } catch (error) {
    console.error('Erro ao buscar template:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// =============================================================================
// POST /api/admin/templates/:id/activate - Ativar template (criar serviço)
// =============================================================================
router.post('/:id/activate', async (req, res) => {
  try {
    const { tenant, user } = req as GuaranteedTenantRequest & { user: any };
    const { id: templateId } = req.params;
    const {
      departmentId,
      customizations = {},
      priority = 1,
    } = req.body;

    // Validações
    if (!departmentId) {
      return res.status(400).json({ error: 'departmentId é obrigatório' });
    }

    // Buscar template
    const template = await prisma.serviceTemplate.findUnique({
      where: { id: templateId },
    });

    if (!template) {
      return res.status(404).json({ error: 'Template não encontrado' });
    }

    // Verificar se já foi ativado
    const existingService = await prisma.service.findFirst({
      where: {
        tenantId: tenant.id,
        templateId: template.id,
      },
    });

    if (existingService) {
      return res.status(400).json({
        error: 'Este template já foi ativado neste tenant',
        serviceId: existingService.id,
      });
    }

    // Verificar se departamento existe
    const department = await prisma.department.findFirst({
      where: {
        id: departmentId,
        tenantId: tenant.id,
      },
    });

    if (!department) {
      return res.status(404).json({ error: 'Departamento não encontrado' });
    }

    // Criar serviço baseado no template
    const service = await prisma.service.create({
      data: {
        tenantId: tenant.id,
        templateId: template.id,
        departmentId,
        name: customizations.name || template.name,
        description: customizations.description || template.description,
        category: template.category,
        icon: template.icon,
        priority: Number(priority),
        isActive: true,
        estimatedDays: template.estimatedTime ? parseInt(String(template.estimatedTime)) : null,
        moduleType: template.moduleType,
        moduleEntity: template.moduleEntity,
        serviceType: 'REQUEST',
        hasCustomForm: true,
      },
    });

    // Criar formulário customizado baseado nos campos padrão
    if (template.defaultFields) {
      await prisma.serviceForm.create({
        data: {
          serviceId: service.id,
          title: service.name,
          description: service.description,
          fields: template.defaultFields as any,
        },
      });
    }

    return res.status(201).json({
      success: true,
      message: `Serviço "${service.name}" ativado com sucesso!`,
      service,
    });
  } catch (error) {
    console.error('Erro ao ativar template:', error);
    return res.status(500).json({
      error: 'Erro interno do servidor',
      details: error instanceof Error ? error.message : 'Erro desconhecido',
    });
  }
});

// =============================================================================
// DELETE /api/admin/templates/:id/deactivate - Desativar serviço baseado em template
// =============================================================================
router.delete('/:id/deactivate', async (req, res) => {
  try {
    const { tenant } = req as GuaranteedTenantRequest;
    const { id: templateId } = req.params;

    // Buscar serviço ativo
    const service = await prisma.service.findFirst({
      where: {
        tenantId: tenant.id,
        templateId,
      },
    });

    if (!service) {
      return res.status(404).json({ error: 'Serviço não encontrado para este template' });
    }

    // Verificar se há protocolos vinculados
    const protocolsCount = await prisma.protocol.count({
      where: {
        serviceId: service.id,
      },
    });

    if (protocolsCount > 0) {
      // Apenas desativar, não deletar
      await prisma.service.update({
        where: { id: service.id },
        data: { isActive: false },
      });

      return res.json({
        success: true,
        message: `Serviço desativado (${protocolsCount} protocolos existentes)`,
        protocolsCount,
      });
    } else {
      // Pode deletar com segurança
      await prisma.service.delete({
        where: { id: service.id },
      });

      return res.json({
        success: true,
        message: 'Serviço removido com sucesso',
      });
    }
  } catch (error) {
    console.error('Erro ao desativar template:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// =============================================================================
// GET /api/admin/templates/stats/summary - Estatísticas de uso dos templates
// =============================================================================
router.get('/stats/summary', async (req, res) => {
  try {
    const { tenant } = req as GuaranteedTenantRequest;

    // Total de templates disponíveis
    const totalTemplates = await prisma.serviceTemplate.count({
      where: { isActive: true },
    });

    // Templates ativados neste tenant
    const activatedTemplates = await prisma.service.count({
      where: {
        tenantId: tenant.id,
        templateId: { not: null },
      },
    });

    // Templates por categoria
    const byCategory = await prisma.serviceTemplate.groupBy({
      by: ['category'],
      where: { isActive: true },
      _count: { category: true },
    });

    // Templates mais ativados (globalmente)
    const mostActivated = await prisma.service.groupBy({
      by: ['templateId'],
      where: {
        templateId: { not: null },
      },
      _count: { templateId: true },
      orderBy: {
        _count: {
          templateId: 'desc',
        },
      },
      take: 10,
    });

    const mostActivatedWithNames = await Promise.all(
      mostActivated
        .filter((item) => item.templateId !== null)
        .map(async (item) => {
          const template = await prisma.serviceTemplate.findUnique({
            where: { id: item.templateId! },
            select: { name: true, category: true },
          });
          return {
            templateId: item.templateId,
            name: template?.name,
            category: template?.category,
            activations: item._count.templateId,
          };
        })
    );

    return res.json({
      summary: {
        totalTemplates,
        activatedTemplates,
        activationRate: ((activatedTemplates / totalTemplates) * 100).toFixed(1) + '%',
      },
      byCategory: byCategory.map((cat) => ({
        category: cat.category,
        count: cat._count.category,
      })),
      mostActivated: mostActivatedWithNames,
    });
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

export default router;
