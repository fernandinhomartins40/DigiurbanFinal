import { Router, Response } from 'express';
import { prisma } from '../lib/prisma';
import { z } from 'zod';
import { AuthenticatedRequest, SuccessResponse, ErrorResponse, TenantCitizenAuthenticatedRequest, createSuccessResponse, createErrorResponse, createNotFoundResponse } from '../types';
import * as bcrypt from 'bcryptjs';
import { tenantMiddleware } from '../middleware/tenant';
import { citizenAuthMiddleware } from '../middleware/citizen-auth';
import { validateCPF } from '../utils/validators';

// FASE 2 - Interface para família
// WhereClause interface removida - usando WhereCondition do sistema centralizado

const router = Router();

// Schemas de validação
const addMemberSchema = z.object({
  cpf: z.string().min(11, 'CPF deve ter 11 dígitos'),
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido').optional(),
  phone: z.string().optional(),
  relationship: z.enum([
    'cônjuge',
    'filho',
    'filha',
    'pai',
    'mãe',
    'irmão',
    'irmã',
    'avô',
    'avó',
    'neto',
    'neta',
    'outros',
  ]),
  isDependent: z.boolean().default(false),
  birthDate: z.string().optional(),
  address: z
    .object({
      street: z.string(),
      number: z.string(),
      neighborhood: z.string(),
      city: z.string(),
      state: z.string(),
      zipCode: z.string(),
    })
    .optional(),
});

const updateRelationshipSchema = z.object({
  relationship: z.enum([
    'cônjuge',
    'filho',
    'filha',
    'pai',
    'mãe',
    'irmão',
    'irmã',
    'avô',
    'avó',
    'neto',
    'neta',
    'outros',
  ]),
  isDependent: z.boolean(),
});

// Middleware para verificar tenant em todas as rotas
router.use(tenantMiddleware);
// CRIADO: type assertion para compatibilidade Express
router.use(citizenAuthMiddleware as any);

// GET /api/family - Minha composição familiar
router.get('/', async (req, res) => {
  try {
    const { tenant, citizen } = req as TenantCitizenAuthenticatedRequest;

    // Buscar membros da família onde o cidadão é responsável
    const familyMembers = await prisma.familyComposition.findMany({
      where: {
        tenantId: tenant.id,
        headId: citizen.id,
      },
      include: {
        member: {
          select: {
            id: true,
            cpf: true,
            name: true,
            email: true,
            phone: true,
            address: true,
            isActive: true,
            createdAt: true,
          },
        },
      },
      orderBy: [{ relationship: 'asc' }, { member: { name: 'asc' } }],
    });

    // Buscar famílias onde o cidadão é membro
    const memberOf = await prisma.familyComposition.findMany({
      where: {
        tenantId: tenant.id,
        memberId: citizen.id,
      },
      include: {
        head: {
          select: {
            id: true,
            cpf: true,
            name: true,
            email: true,
            phone: true,
          },
        },
      },
    });

    return res.json({
      family: {
        head: {
          id: citizen.id,
          cpf: citizen.cpf,
          name: citizen.name,
          email: citizen.email,
          phone: citizen.phone,
          birthDate: citizen.birthDate,
        },
        members: familyMembers,
        memberOf: memberOf,
      },
    });
  } catch (error) {
    console.error('Erro ao buscar composição familiar:', error);
    return res.status(500).json(createErrorResponse('INTERNAL_ERROR', 'Erro interno do servidor'));
  }
});

// POST /api/family/members - Adicionar membro à família
router.post('/members', async (req, res) => {
  try {
    const data = addMemberSchema.parse(req.body);
    const { tenant, citizen } = req as TenantCitizenAuthenticatedRequest;

    // Validar CPF
    if (!validateCPF(data.cpf)) {
      return res.status(400).json(createErrorResponse('VALIDATION_ERROR', 'CPF inválido'));
    }

    // Verificar se já existe um cidadão com esse CPF
    let memberCitizen = await prisma.citizen.findFirst({
      where: {
        tenantId: tenant.id,
        cpf: data.cpf,
      },
    });

    // Se não existe, criar novo cidadão
    if (!memberCitizen) {
      // Gerar senha temporária
      const tempPassword = Math.random().toString(36).slice(-8);
      const hashedPassword = await bcrypt.hash(tempPassword, 10);

      memberCitizen = await prisma.citizen.create({
        data: {
          tenantId: tenant.id,
          cpf: data.cpf,
          name: data.name,
          email: data.email || `${data.cpf}@temp.digiurban.com`,
          phone: data.phone,
          address: data.address,
          password: hashedPassword,
          isActive: true,
        },
      });

      // Criar notificação sobre a senha temporária
      if (data.email) {
        await prisma.notification.create({
          data: {
            tenantId: tenant.id,
            citizenId: memberCitizen.id,
            title: 'Conta Criada',
            message: `Sua conta foi criada por ${citizen.name}. Senha temporária: ${tempPassword}`,
            type: 'INFO',
            channel: 'EMAIL',
          },
        });
      }
    }

    // Verificar se já existe relacionamento familiar
    const existingRelation = await prisma.familyComposition.findFirst({
      where: {
        tenantId: tenant.id,
        headId: citizen.id,
        memberId: memberCitizen.id,
      },
    });

    if (existingRelation) {
      return res.status(400).json(
        createErrorResponse('DUPLICATE_MEMBER', 'Este membro já faz parte da sua família')
      );
    }

    // Verificar se o cidadão não está tentando adicionar a si mesmo
    if (memberCitizen.id === citizen.id) {
      return res.status(400).json(
        createErrorResponse('INVALID_SELF_ADD', 'Você não pode adicionar a si mesmo como membro da família')
      );
    }

    // Criar relacionamento familiar
    const familyComposition = await prisma.familyComposition.create({
      data: {
        tenantId: tenant.id,
        headId: citizen.id,
        memberId: memberCitizen.id,
        relationship: data.relationship,
        isDependent: data.isDependent,
      },
      include: {
        member: {
          select: {
            id: true,
            cpf: true,
            name: true,
            email: true,
            phone: true,
            address: true,
            isActive: true,
            createdAt: true,
          },
        },
      },
    });

    // Criar notificação para o membro adicionado
    await prisma.notification.create({
      data: {
        tenantId: tenant.id,
        citizenId: memberCitizen.id,
        title: 'Adicionado à Família',
        message: `Você foi adicionado à composição familiar de ${citizen.name}`,
        type: 'INFO',
      },
    });

    return res.status(201).json({
      message: 'Membro adicionado à família com sucesso',
      familyComposition,
    });
  } catch (error: unknown) {
    console.error('Erro ao adicionar membro da família:', error);

    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Dados inválidos',
        details: error.issues,
      });
    }

    return res.status(500).json(createErrorResponse('INTERNAL_ERROR', 'Erro interno do servidor'));
  }
});

// PUT /api/family/members/:memberId - Atualizar relacionamento familiar
router.put('/members/:memberId', async (req, res) => {
  try {
    const data = updateRelationshipSchema.parse(req.body);
    const { tenant, citizen } = req as unknown as TenantCitizenAuthenticatedRequest;
    const { memberId } = req.params;

    // Buscar relacionamento familiar
    const familyComposition = await prisma.familyComposition.findFirst({
      where: {
        tenantId: tenant.id,
        headId: citizen.id,
        memberId,
      },
    });

    if (!familyComposition) {
      return res.status(404).json(
        createNotFoundResponse('Membro da família')
      );
    }

    // Atualizar relacionamento
    const updatedComposition = await prisma.familyComposition.update({
      where: { id: familyComposition.id },
      data: {
        relationship: data.relationship,
        isDependent: data.isDependent,
      },
      include: {
        member: {
          select: {
            id: true,
            cpf: true,
            name: true,
            email: true,
            phone: true,
            address: true,
            isActive: true,
          },
        },
      },
    });

    return res.json({
      message: 'Relacionamento familiar atualizado com sucesso',
      familyComposition: updatedComposition,
    });
  } catch (error: unknown) {
    console.error('Erro ao atualizar relacionamento familiar:', error);

    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Dados inválidos',
        details: error.issues,
      });
    }

    return res.status(500).json(createErrorResponse('INTERNAL_ERROR', 'Erro interno do servidor'));
  }
});

// DELETE /api/family/members/:memberId - Remover membro da família
router.delete('/members/:memberId', async (req, res) => {
  try {
    const { tenant, citizen } = req as unknown as TenantCitizenAuthenticatedRequest;
    const { memberId } = req.params;

    // Buscar relacionamento familiar
    const familyComposition = await prisma.familyComposition.findFirst({
      where: {
        tenantId: tenant.id,
        headId: citizen.id,
        memberId,
      },
      include: {
        member: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!familyComposition) {
      return res.status(404).json(
        createNotFoundResponse('Membro da família')
      );
    }

    // Remover relacionamento familiar
    await prisma.familyComposition.delete({
      where: { id: familyComposition.id },
    });

    // Criar notificação para o membro removido
    await prisma.notification.create({
      data: {
        tenantId: tenant.id,
        citizenId: memberId,
        title: 'Removido da Família',
        message: `Você foi removido da composição familiar de ${citizen.name}`,
        type: 'WARNING',
      },
    });

    return res.json({
      message: 'Membro removido da família com sucesso',
    });
  } catch (error) {
    console.error('Erro ao remover membro da família:', error);
    return res.status(500).json(createErrorResponse('INTERNAL_ERROR', 'Erro interno do servidor'));
  }
});

// GET /api/family/protocols - Protocolos de todos os membros da família
router.get('/protocols', async (req, res) => {
  try {
    const { tenant, citizen } = req as TenantCitizenAuthenticatedRequest;
    const { status, page = 1, limit = 20 } = req.query;

    const skip = (Number(page) - 1) * Number(limit);

    // Buscar IDs dos membros da família
    const familyMembers = await prisma.familyComposition.findMany({
      where: {
        tenantId: tenant.id,
        headId: citizen.id,
      },
      select: { memberId: true },
    });

    const allFamilyIds = [citizen.id, ...familyMembers.map(m => m.memberId)];

    // Construir filtros
    const where: Record<string, unknown> = {
      tenantId: tenant.id,
      citizenId: { in: allFamilyIds },
    };

    if (status) {
      where.status = status;
    }

    // Buscar protocolos familiares
    const [protocols, total] = await Promise.all([
      prisma.protocolSimplified.findMany({
        where,
        include: {
          service: {
            select: {
              id: true,
              name: true,
              category: true,
            },
          },
          department: {
            select: {
              id: true,
              name: true,
            },
          },
          citizen: {
            select: {
              id: true,
              name: true,
              cpf: true,
            },
          },
          history: {
            orderBy: { timestamp: 'desc' },
            take: 1,
          },
        },
        orderBy: { createdAt: 'desc' },
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
    console.error('Erro ao buscar protocolos familiares:', error);
    return res.status(500).json(createErrorResponse('INTERNAL_ERROR', 'Erro interno do servidor'));
  }
});

// GET /api/family/stats - Estatísticas da família
router.get('/stats', async (req, res) => {
  try {
    const { tenant, citizen } = req as TenantCitizenAuthenticatedRequest;

    // Buscar membros da família
    const familyMembers = await prisma.familyComposition.findMany({
      where: {
        tenantId: tenant.id,
        headId: citizen.id,
      },
      select: { memberId: true, relationship: true, isDependent: true },
    });

    const allFamilyIds = [citizen.id, ...familyMembers.map(m => m.memberId)];

    // Estatísticas dos protocolos familiares
    const protocolStats = await prisma.protocolSimplified.groupBy({
      by: ['status'],
      where: {
        tenantId: tenant.id,
        citizenId: { in: allFamilyIds },
      },
      _count: {
        status: true,
      },
    });

    // Total de protocolos
    const totalProtocols = await prisma.protocolSimplified.count({
      where: {
        tenantId: tenant.id,
        citizenId: { in: allFamilyIds },
      },
    });

    // Estatísticas por membro
    const memberStats = await Promise.all(
      allFamilyIds.map(async memberId => {
        const member =
          memberId === citizen.id
            ? citizen
            : await prisma.citizen.findUnique({
                where: { id: memberId },
                select: { id: true, name: true, cpf: true },
              });

        const protocolCount = await prisma.protocolSimplified.count({
          where: {
            tenantId: tenant.id,
            citizenId: memberId,
          },
        });

        const relationship =
          memberId === citizen.id
            ? 'responsável'
            : familyMembers.find(fm => fm.memberId === memberId)?.relationship;

        return {
          member,
          relationship,
          protocolCount,
        };
      })
    );

    return res.json({
      familySize: allFamilyIds.length,
      dependents: familyMembers.filter(m => m.isDependent).length,
      totalProtocols,
      protocolsByStatus: protocolStats,
      memberStats,
    });
  } catch (error) {
    console.error('Erro ao buscar estatísticas familiares:', error);
    return res.status(500).json(createErrorResponse('INTERNAL_ERROR', 'Erro interno do servidor'));
  }
});

// GET /api/family/members/:memberId - Detalhes de um membro específico
router.get('/members/:memberId', async (req, res) => {
  try {
    const { tenant, citizen } = req as unknown as TenantCitizenAuthenticatedRequest;
    const { memberId } = req.params;

    // Buscar relacionamento familiar
    const familyComposition = await prisma.familyComposition.findFirst({
      where: {
        tenantId: tenant.id,
        headId: citizen.id,
        memberId,
      },
      include: {
        member: {
          select: {
            id: true,
            cpf: true,
            name: true,
            email: true,
            phone: true,
            address: true,
            isActive: true,
            createdAt: true,
            lastLogin: true,
          },
        },
      },
    });

    if (!familyComposition) {
      return res.status(404).json(
        createNotFoundResponse('Membro da família')
      );
    }

    // Buscar protocolos do membro
    const memberProtocols = await prisma.protocolSimplified.findMany({
      where: {
        tenantId: tenant.id,
        citizenId: memberId,
      },
      include: {
        service: {
          select: {
            id: true,
            name: true,
            category: true,
          },
        },
        department: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    return res.json({
      familyComposition,
      protocols: memberProtocols,
    });
  } catch (error) {
    console.error('Erro ao buscar detalhes do membro:', error);
    return res.status(500).json(createErrorResponse('INTERNAL_ERROR', 'Erro interno do servidor'));
  }
});

export default router;
