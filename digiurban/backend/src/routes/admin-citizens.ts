import { Router, Response } from 'express';
import { prisma } from '../lib/prisma';
import { adminAuthMiddleware, requirePermission } from '../middleware/admin-auth';
import { tenantMiddleware } from '../middleware/tenant';
import { asyncHandler } from '../utils/express-helpers';
import type { AuthenticatedRequest } from '../types';

const router = Router();

// Apply middleware
router.use(tenantMiddleware);
router.use(adminAuthMiddleware);

// GET /api/admin/citizens/search - Buscar cidadãos por nome ou CPF
router.get(
  '/search',
  requirePermission('citizens:read'),
  asyncHandler(async (req, res: Response): Promise<void> => {
    const authReq = req as AuthenticatedRequest;
    const { q } = authReq.query;

    if (!q || typeof q !== 'string' || q.length < 3) {
      res.status(400).json({
        success: false,
        error: 'Parâmetro de busca deve ter no mínimo 3 caracteres',
      });
      return;
    }

    const citizens = await prisma.citizen.findMany({
      where: {
        tenantId: authReq.user.tenantId,
        isActive: true,
        OR: [
          { name: { contains: q } },
          { cpf: { contains: q } },
        ],
      },
      select: {
        id: true,
        name: true,
        cpf: true,
        email: true,
      },
      take: 10,
      orderBy: { name: 'asc' },
    });

    res.json({
      success: true,
      data: { citizens },
    });
  })
);

// GET /api/admin/citizens - Listar TODOS os cidadãos (para página principal)
router.get(
  '/',
  requirePermission('citizens:read'),
  asyncHandler(async (req, res: Response): Promise<void> => {
    const authReq = req as AuthenticatedRequest;
    const { page = '1', limit = '50', status, search } = authReq.query;

    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const skip = (pageNum - 1) * limitNum;

    // Construir filtros
    const where: any = {
      tenantId: authReq.user.tenantId,
    };

    if (status) {
      where.verificationStatus = status;
    }

    if (search && typeof search === 'string') {
      where.OR = [
        { name: { contains: search } },
        { cpf: { contains: search } },
        { email: { contains: search } },
      ];
    }

    const [citizens, total] = await Promise.all([
      prisma.citizen.findMany({
        where,
        select: {
          id: true,
          name: true,
          cpf: true,
          email: true,
          phone: true,
          address: true,
          isActive: true,
          verificationStatus: true,
          registrationSource: true,
          verifiedAt: true,
          verifiedBy: true,
          createdAt: true,
        },
        skip,
        take: limitNum,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.citizen.count({ where }),
    ]);

    res.json({
      success: true,
      citizens,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  })
);

// GET /api/admin/citizens/pending - Listar cidadãos aguardando verificação
router.get(
  '/pending',
  requirePermission('citizens:verify'),
  asyncHandler(async (req, res: Response): Promise<void> => {
    const authReq = req as AuthenticatedRequest;

    const pendingCitizens = await prisma.citizen.findMany({
      where: {
        tenantId: authReq.user.tenantId,
        verificationStatus: 'PENDING',
        isActive: true,
      },
      select: {
        id: true,
        cpf: true,
        name: true,
        email: true,
        phone: true,
        address: true,
        birthDate: true,
        registrationSource: true,
        createdAt: true,
        _count: {
          select: {
            protocolsSimplified: true,
            familyAsHead: true,
          },
        },
      },
      orderBy: { createdAt: 'asc' },
    });

    res.json({
      success: true,
      data: {
        citizens: pendingCitizens,
        total: pendingCitizens.length,
      },
    });
  })
);

// PUT /api/admin/citizens/:id/verify - Aprovar cidadão (Bronze → Prata)
router.put(
  '/:id/verify',
  requirePermission('citizens:verify'),
  asyncHandler(async (req, res: Response): Promise<void> => {
    const authReq = req as AuthenticatedRequest;
    const { id } = authReq.params;
    const { notes } = authReq.body;

    // Validação de segurança: cidadão existe e pertence ao tenant
    const citizen = await prisma.citizen.findFirst({
      where: {
        id,
        tenantId: authReq.user.tenantId,
        verificationStatus: 'PENDING',
      },
    });

    if (!citizen) {
      res.status(404).json({
        success: false,
        error: 'Cidadão não encontrado ou já verificado',
      });
      return;
    }

    // Transação para garantir integridade
    const updatedCitizen = await prisma.$transaction(async (tx) => {
      // 1. Atualizar status do cidadão
      const updated = await tx.citizen.update({
        where: { id },
        data: {
          verificationStatus: 'VERIFIED',
          verifiedAt: new Date(),
          verifiedBy: authReq.user.id,
          verificationNotes: notes,
        },
        select: {
          id: true,
          name: true,
          cpf: true,
          email: true,
          verificationStatus: true,
          verifiedAt: true,
        },
      });

      // 2. Criar notificação para o cidadão
      await tx.notification.create({
        data: {
          tenantId: authReq.user.tenantId,
          citizenId: id,
          title: 'Cadastro Aprovado! 🎉',
          message:
            'Seu cadastro foi verificado e aprovado pela administração. Agora você tem acesso completo a todos os serviços municipais.',
          type: 'VERIFICATION_APPROVED',
          isRead: false,
        },
      });

      return updated;
    });

    res.json({
      success: true,
      message: 'Cidadão verificado com sucesso',
      data: { citizen: updatedCitizen },
    });
  })
);

// PUT /api/admin/citizens/:id/reject - Rejeitar cadastro
router.put(
  '/:id/reject',
  requirePermission('citizens:verify'),
  asyncHandler(async (req, res: Response): Promise<void> => {
    const authReq = req as AuthenticatedRequest;
    const { id } = authReq.params;
    const { reason } = authReq.body;

    if (!reason) {
      res.status(400).json({
        success: false,
        error: 'Motivo da rejeição é obrigatório',
      });
      return;
    }

    const citizen = await prisma.citizen.findFirst({
      where: {
        id,
        tenantId: authReq.user.tenantId,
        verificationStatus: 'PENDING',
      },
    });

    if (!citizen) {
      res.status(404).json({
        success: false,
        error: 'Cidadão não encontrado',
      });
      return;
    }

    await prisma.$transaction(async (tx) => {
      // 1. Atualizar status
      await tx.citizen.update({
        where: { id },
        data: {
          verificationStatus: 'REJECTED',
          verifiedAt: new Date(),
          verifiedBy: authReq.user.id,
          verificationNotes: reason,
          isActive: false, // Desativa o cadastro
        },
      });

      // 2. Notificar cidadão
      await tx.notification.create({
        data: {
          tenantId: authReq.user.tenantId,
          citizenId: id,
          title: 'Cadastro Não Aprovado',
          message: `Seu cadastro não foi aprovado. Motivo: ${reason}. Por favor, entre em contato com a prefeitura para mais informações.`,
          type: 'VERIFICATION_REJECTED',
          isRead: false,
        },
      });
    });

    res.json({
      success: true,
      message: 'Cadastro rejeitado',
    });
  })
);

// GET /api/admin/citizens/:id/details - Detalhes completos do cidadão
router.get(
  '/:id/details',
  requirePermission('citizens:read'),
  asyncHandler(async (req, res: Response): Promise<void> => {
    const authReq = req as AuthenticatedRequest;
    const { id } = authReq.params;

    const citizen = await prisma.citizen.findFirst({
      where: {
        id,
        tenantId: authReq.user.tenantId,
      },
      include: {
        familyAsHead: {
          include: {
            member: {
              select: {
                id: true,
                name: true,
                cpf: true,
              },
            },
          },
        },
        vulnerableFamilyData: {
          include: {
            benefitRequests: {
              orderBy: { requestDate: 'desc' },
              take: 5,
            },
            homeVisits: {
              orderBy: { visitDate: 'desc' },
              take: 5,
            },
          },
        },
        protocols: {
          orderBy: { createdAt: 'desc' },
          take: 10,
          include: {
            service: { select: { name: true } },
            department: { select: { name: true } },
          },
        },
        _count: {
          select: {
            protocolsSimplified: true,
            familyAsHead: true,
            notifications: true,
          },
        },
      },
    });

    if (!citizen) {
      res.status(404).json({
        success: false,
        error: 'Cidadão não encontrado',
      });
      return;
    }

    res.json({
      success: true,
      data: { citizen },
    });
  })
);

// GET /api/admin/citizens/:id/family - Composição familiar
router.get(
  '/:id/family',
  requirePermission('citizens:read'),
  asyncHandler(async (req, res: Response): Promise<void> => {
    const authReq = req as AuthenticatedRequest;
    const { id } = authReq.params;

    const family = await prisma.familyComposition.findMany({
      where: {
        tenantId: authReq.user.tenantId,
        headId: id,
      },
      include: {
        member: {
          select: {
            id: true,
            name: true,
            cpf: true,
            email: true,
            phone: true,
            birthDate: true,
          },
        },
      },
      orderBy: { createdAt: 'asc' },
    });

    res.json({
      success: true,
      data: { family },
    });
  })
);

// POST /api/admin/citizens/:id/family - Adicionar membro
router.post(
  '/:id/family',
  requirePermission('citizens:update'),
  asyncHandler(async (req, res: Response): Promise<void> => {
    const authReq = req as AuthenticatedRequest;
    const { id } = authReq.params;
    const { memberId, relationship, isDependent } = authReq.body;

    if (!memberId || !relationship) {
      res.status(400).json({
        success: false,
        error: 'memberId e relationship são obrigatórios',
      });
      return;
    }

    // Validar que o cidadão responsável existe
    const citizen = await prisma.citizen.findFirst({
      where: {
        id,
        tenantId: authReq.user.tenantId,
      },
    });

    if (!citizen) {
      res.status(404).json({
        success: false,
        error: 'Cidadão responsável não encontrado',
      });
      return;
    }

    // Validar que o membro existe
    const memberCitizen = await prisma.citizen.findFirst({
      where: {
        id: memberId,
        tenantId: authReq.user.tenantId,
      },
    });

    if (!memberCitizen) {
      res.status(404).json({
        success: false,
        error: 'Cidadão membro não encontrado',
      });
      return;
    }

    // Verificar se já não existe
    const existing = await prisma.familyComposition.findFirst({
      where: {
        tenantId: authReq.user.tenantId,
        headId: id,
        memberId,
      },
    });

    if (existing) {
      res.status(400).json({
        success: false,
        error: 'Este membro já está na composição familiar',
      });
      return;
    }

    const member = await prisma.familyComposition.create({
      data: {
        tenantId: authReq.user.tenantId,
        headId: id,
        memberId,
        relationship,
        isDependent: isDependent || false,
      },
      include: {
        member: {
          select: {
            id: true,
            name: true,
            cpf: true,
            email: true,
            phone: true,
            birthDate: true,
          },
        },
      },
    });

    res.status(201).json({
      success: true,
      message: 'Membro adicionado com sucesso',
      data: { member },
    });
  })
);

// DELETE /api/admin/citizens/:id/family/:memberId - Remover membro
router.delete(
  '/:id/family/:memberId',
  requirePermission('citizens:update'),
  asyncHandler(async (req, res: Response): Promise<void> => {
    const authReq = req as AuthenticatedRequest;
    const { id, memberId } = authReq.params;

    const member = await prisma.familyComposition.findFirst({
      where: {
        id: memberId,
        headId: id,
        tenantId: authReq.user.tenantId,
      },
    });

    if (!member) {
      res.status(404).json({
        success: false,
        error: 'Membro não encontrado',
      });
      return;
    }

    await prisma.familyComposition.delete({
      where: { id: memberId },
    });

    res.json({
      success: true,
      message: 'Membro removido com sucesso',
    });
  })
);

// POST /api/admin/citizens/:id/vulnerability - Adicionar vulnerabilidade
router.post(
  '/:id/vulnerability',
  requirePermission('social-assistance:create'),
  asyncHandler(async (req, res: Response): Promise<void> => {
    const authReq = req as AuthenticatedRequest;
    const { id } = authReq.params;
    const {
      familyCode,
      memberCount,
      monthlyIncome,
      riskLevel,
      vulnerabilityType,
      socialWorker,
      observations,
    } = authReq.body;

    // Validar que o cidadão existe e não tem vulnerabilidade
    const citizen = await prisma.citizen.findFirst({
      where: {
        id,
        tenantId: authReq.user.tenantId,
      },
      include: { vulnerableFamilyData: true },
    });

    if (!citizen) {
      res.status(404).json({
        success: false,
        error: 'Cidadão não encontrado',
      });
      return;
    }

    if (citizen.vulnerableFamilyData) {
      res.status(400).json({
        success: false,
        error: 'Cidadão já possui registro de vulnerabilidade',
      });
      return;
    }

    const vulnerability = await prisma.vulnerableFamily.create({
      data: {
        tenantId: authReq.user.tenantId,
        citizenId: id,
        familyCode,
        memberCount,
        monthlyIncome,
        riskLevel: riskLevel || 'LOW',
        vulnerabilityType,
        socialWorker,
        observations,
        status: 'ACTIVE',
      },
      include: {
        citizen: {
          select: {
            id: true,
            name: true,
            cpf: true,
            address: true,
          },
        },
      },
    });

    res.status(201).json({
      success: true,
      message: 'Dados de vulnerabilidade adicionados',
      data: { vulnerability },
    });
  })
);

// PUT /api/admin/citizens/:id/vulnerability - Atualizar vulnerabilidade
router.put(
  '/:id/vulnerability',
  requirePermission('social-assistance:update'),
  asyncHandler(async (req, res: Response): Promise<void> => {
    const authReq = req as AuthenticatedRequest;
    const { id } = authReq.params;
    const updateData = authReq.body;

    const vulnerability = await prisma.vulnerableFamily.findFirst({
      where: {
        citizenId: id,
        tenantId: authReq.user.tenantId,
      },
    });

    if (!vulnerability) {
      res.status(404).json({
        success: false,
        error: 'Dados de vulnerabilidade não encontrados',
      });
      return;
    }

    const updated = await prisma.vulnerableFamily.update({
      where: { id: vulnerability.id },
      data: {
        ...updateData,
        updatedAt: new Date(),
      },
    });

    res.json({
      success: true,
      message: 'Dados atualizados',
      data: { vulnerability: updated },
    });
  })
);

// GET /api/admin/citizens/vulnerable - Listar famílias vulneráveis
router.get(
  '/vulnerable',
  requirePermission('social-assistance:read'),
  asyncHandler(async (req, res: Response): Promise<void> => {
    const authReq = req as AuthenticatedRequest;
    const { riskLevel, status } = authReq.query;

    const where: any = { tenantId: authReq.user.tenantId };
    if (riskLevel) where.riskLevel = riskLevel;
    if (status) where.status = status;

    const vulnerableFamilies = await prisma.vulnerableFamily.findMany({
      where,
      include: {
        citizen: {
          select: {
            id: true,
            name: true,
            cpf: true,
            email: true,
            phone: true,
            address: true,
            familyAsHead: {
              select: {
                relationship: true,
                isDependent: true,
                member: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
        benefitRequests: {
          where: { status: { in: ['PENDING', 'APPROVED'] } },
        },
        homeVisits: {
          orderBy: { visitDate: 'desc' },
          take: 1,
        },
      },
      orderBy: [{ riskLevel: 'desc' }, { updatedAt: 'desc' }],
    });

    res.json({
      success: true,
      data: {
        families: vulnerableFamilies,
        total: vulnerableFamilies.length,
      },
    });
  })
);

export default router;
