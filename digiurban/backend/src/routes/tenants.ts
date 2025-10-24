import * as express from 'express';
import { prisma } from '../lib/prisma';
import { authenticateToken, requireSuperAdmin } from '../middleware/auth';
import { TenantStatus } from '@prisma/client';
import {
  SuperAdminRequest,
} from '../types';
import {
  buscarMunicipioValidado,
  gerarCnpjFicticio,
  gerarSlugMunicipio,
  obterMetadadosMunicipio,
} from '../services/municipio-validator';

// ====================== TIPOS LOCAIS ISOLADOS ======================

interface WhereCondition {
  [key: string]: unknown;
}

// Interface para where clauses específicas de tenants
// WhereClause interface removida - usando WhereCondition do sistema centralizado

const router = express.Router();

/**
 * GET /api/tenants
 * Listar todos os tenants (apenas SUPER_ADMIN)
 */
router.get('/', authenticateToken, requireSuperAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 10, status, search } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    let whereClause: WhereCondition = {};

    if (status) {
      whereClause.status = status;
    }

    if (search) {
      whereClause.OR = [
        { name: { contains: search as string } },
        { cnpj: { contains: search as string } },
        { domain: { contains: search as string } },
      ];
    }

    const [tenants, total] = await Promise.all([
      prisma.tenant.findMany({
        where: whereClause,
        include: {
          _count: {
            select: {
              users: true,
              departments: true,
              services: true,
              protocols: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: Number(limit),
      }),
      prisma.tenant.count({ where: whereClause }),
    ]);

    return res.json({
      tenants,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    console.error('List tenants error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: 'Erro interno do servidor',
    });
  }
});

/**
 * GET /api/tenants/:id
 * Obter tenant específico (apenas SUPER_ADMIN)
 */
router.get(
  '/:id',
  authenticateToken,
  requireSuperAdmin,
  async (req, res) => {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(400).json({
          error: 'Bad request',
          message: 'ID do tenant é obrigatório',
        });
        return;
      }

      const tenant = await prisma.tenant.findUnique({
        where: { id },
        include: {
          departments: {
            include: {
              _count: {
                select: {
                  users: true,
                  services: true,
                },
              },
            },
          },
          _count: {
            select: {
              users: true,
              protocols: true,
              services: true,
              citizens: true,
            },
          },
        },
      });

      if (!tenant) {
        res.status(404).json({
          error: 'Not found',
          message: 'Tenant não encontrado',
        });
        return;
      }

      return res.json({ tenant });
    } catch (error) {
      console.error('Get tenant error:', error);
      return res.status(500).json({
        error: 'Internal server error',
        message: 'Erro interno do servidor',
      });
    }
  }
);

/**
 * POST /api/tenants
 * Criar novo tenant (apenas SUPER_ADMIN)
 */
router.post('/', authenticateToken, requireSuperAdmin, async (req, res) => {
  try {
    const { name, cnpj, domain, plan, codigoIbge, nomeMunicipio, ufMunicipio } = req.body;

    if (!name || !cnpj) {
      res.status(400).json({
        error: 'Bad request',
        message: 'Nome e CNPJ são obrigatórios',
      });
      return;
    }

    // 🔍 VALIDAR MUNICÍPIO se código IBGE foi fornecido
    let municipioValidado = null;
    if (codigoIbge || (nomeMunicipio && ufMunicipio)) {
      municipioValidado = buscarMunicipioValidado({
        codigoIbge,
        nome: nomeMunicipio,
        uf: ufMunicipio,
      });

      if (!municipioValidado) {
        res.status(400).json({
          error: 'Bad request',
          message: 'Município não encontrado no IBGE. Verifique o código IBGE ou nome+UF.',
        });
        return;
      }

      // Verificar se já existe tenant para este município
      const tenantExistente = await prisma.tenant.findFirst({
        where: {
          OR: [
            { codigoIbge: municipioValidado.codigo_ibge },
            {
              AND: [
                { nomeMunicipio: municipioValidado.nome },
                { ufMunicipio: municipioValidado.uf }
              ]
            }
          ]
        }
      });

      if (tenantExistente) {
        res.status(409).json({
          error: 'Conflict',
          message: `Já existe um tenant para o município ${municipioValidado.nome} - ${municipioValidado.uf}`,
        });
        return;
      }
    }

    // Verificar se CNPJ já existe
    const existingTenant = await prisma.tenant.findUnique({
      where: { cnpj },
    });

    if (existingTenant) {
      res.status(409).json({
        error: 'Conflict',
        message: 'CNPJ já está em uso',
      });
      return;
    }

    // Verificar se domínio já existe (se fornecido)
    if (domain) {
      const existingDomain = await prisma.tenant.findUnique({
        where: { domain },
      });

      if (existingDomain) {
        res.status(409).json({
          error: 'Conflict',
          message: 'Domínio já está em uso',
        });
        return;
      }
    }

    // Criar tenant com dados validados do IBGE (se disponível)
    const tenant = await prisma.tenant.create({
      data: {
        name,
        cnpj,
        domain: domain || (municipioValidado ? gerarSlugMunicipio(municipioValidado.nome, municipioValidado.uf) : null),
        plan: plan || 'STARTER',
        status: TenantStatus.ACTIVE,
        // ✅ Dados do município (se validado)
        codigoIbge: municipioValidado?.codigo_ibge || null,
        nomeMunicipio: municipioValidado?.nome || null,
        ufMunicipio: municipioValidado?.uf || null,
        population: municipioValidado?.populacao || null,
        metadata: municipioValidado ? obterMetadadosMunicipio(municipioValidado) : undefined,
      },
    });

    // Criar departamentos básicos para o novo tenant
    const defaultDepartments = [
      'Saúde',
      'Educação',
      'Assistência Social',
      'Cultura',
      'Segurança Pública',
      'Planejamento Urbano',
      'Agricultura',
      'Esportes',
      'Turismo',
      'Habitação',
      'Meio Ambiente',
      'Obras Públicas',
      'Serviços Públicos',
    ];

    await Promise.all(
      defaultDepartments.map(deptName =>
        prisma.department.create({
          data: {
            name: deptName,
            tenantId: tenant.id,
          },
        })
      )
    );

    // 🔗 HOOK: Vincular cidadãos pendentes ao novo tenant (se houver código IBGE)
    let citizensLinked = 0;
    if (municipioValidado) {
      console.log(`🔍 Procurando cidadãos para vincular ao município IBGE ${municipioValidado.codigo_ibge}...`);

      // Neste momento, como cidadãos sempre são criados com tenant,
      // não haverá cidadãos órfãos. Mas se implementarmos um sistema de "fila de espera"
      // no futuro, esse hook vinculará automaticamente.

      // TODO FUTURO: Implementar sistema de cidadãos pendentes
      // const pendingCitizens = await prisma.citizen.findMany({
      //   where: {
      //     tenantId: null, // Cidadãos sem tenant
      //     metadata: { path: ['codigoIbge'], equals: municipioValidado.codigo_ibge }
      //   }
      // });
      //
      // if (pendingCitizens.length > 0) {
      //   await prisma.citizen.updateMany({
      //     where: { id: { in: pendingCitizens.map(c => c.id) } },
      //     data: { tenantId: tenant.id }
      //   });
      //   citizensLinked = pendingCitizens.length;
      //   console.log(`✅ ${citizensLinked} cidadãos vinculados automaticamente ao tenant ${tenant.name}`);
      // }
    }

    return res.status(201).json({
      message: 'Tenant criado com sucesso',
      tenant,
      municipioValidado: municipioValidado ? {
        nome: municipioValidado.nome,
        uf: municipioValidado.uf,
        codigoIbge: municipioValidado.codigo_ibge,
      } : null,
      citizensLinked, // Quantos cidadãos foram vinculados (0 atualmente)
    });
  } catch (error) {
    console.error('Create tenant error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: 'Erro interno do servidor',
    });
  }
});

/**
 * PUT /api/tenants/:id
 * Atualizar tenant (apenas SUPER_ADMIN)
 */
router.put(
  '/:id',
  authenticateToken,
  requireSuperAdmin,
  async (req, res) => {
    try {
      const { id } = req.params;
      const { name, domain, plan, status } = req.body;

      const tenant = await prisma.tenant.findUnique({
        where: { id },
      });

      if (!tenant) {
        res.status(404).json({
          error: 'Not found',
          message: 'Tenant não encontrado',
        });
        return;
      }

      // Verificar se domínio já existe (se fornecido e diferente do atual)
      if (domain && domain !== tenant.domain) {
        const existingDomain = await prisma.tenant.findUnique({
          where: { domain },
        });

        if (existingDomain) {
          res.status(409).json({
            error: 'Conflict',
            message: 'Domínio já está em uso',
          });
          return;
        }
      }

      const updatedTenant = await prisma.tenant.update({
        where: { id },
        data: {
          name: name || tenant.name,
          domain: domain !== undefined ? domain : tenant.domain,
          plan: plan || tenant.plan,
          status: status || tenant.status,
        },
      });

      return res.json({
        message: 'Tenant atualizado com sucesso',
        tenant: updatedTenant,
      });
    } catch (error) {
      console.error('Update tenant error:', error);
      return res.status(500).json({
        error: 'Internal server error',
        message: 'Erro interno do servidor',
      });
    }
  }
);

/**
 * GET /api/tenants/:id/stats
 * Obter estatísticas do tenant (apenas SUPER_ADMIN)
 */
router.get(
  '/:id/stats',
  authenticateToken,
  requireSuperAdmin,
  async (req, res) => {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(400).json({
          error: 'Bad request',
          message: 'ID do tenant é obrigatório',
        });
        return;
      }

      const tenant = await prisma.tenant.findUnique({
        where: { id },
      });

      if (!tenant) {
        res.status(404).json({
          error: 'Not found',
          message: 'Tenant não encontrado',
        });
        return;
      }

      // Buscar estatísticas
      const [
        totalUsers,
        totalDepartments,
        totalServices,
        totalProtocols,
        totalCitizens,
        activeProtocols,
        protocolsByStatus,
      ] = await Promise.all([
        prisma.user.count({ where: { tenantId: id } }),
        prisma.department.count({ where: { tenantId: id } }),
        prisma.service.count({ where: { tenantId: id } }),
        prisma.protocol.count({ where: { tenantId: id } }),
        prisma.citizen.count({ where: { tenantId: id } }),
        prisma.protocol.count({
          where: {
            tenantId: id,
            status: { in: ['VINCULADO', 'PROGRESSO', 'ATUALIZACAO'] },
          },
        }),
        prisma.protocol.groupBy({
          by: ['status'],
          where: { tenantId: id },
          _count: true,
        }),
      ]);

      const stats = {
        users: totalUsers,
        departments: totalDepartments,
        services: totalServices,
        protocols: {
          total: totalProtocols,
          active: activeProtocols,
          byStatus: protocolsByStatus.reduce(
            (acc, item) => {
              acc[item.status] = item._count;
              return acc;
            },
            {} as Record<string, number>
          ),
        },
        citizens: totalCitizens,
      };

      return res.json({
        tenant,
        stats,
      });
    } catch (error) {
      console.error('Get tenant stats error:', error);
      return res.status(500).json({
        error: 'Internal server error',
        message: 'Erro interno do servidor',
      });
    }
  }
);

export default router;
