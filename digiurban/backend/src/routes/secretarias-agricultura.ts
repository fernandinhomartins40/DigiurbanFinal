// ============================================================================
// SECRETARIAS-AGRICULTURA.TS - Rotas da Secretaria de Agricultura
// ============================================================================
// VERSÃO SIMPLIFICADA - Usa 100% do sistema novo (ProtocolSimplified + MODULE_MAPPING)

import { Router } from 'express';
import { prisma } from '../lib/prisma';
import {
  adminAuthMiddleware,
  requireMinRole,
} from '../middleware/admin-auth';
import { tenantMiddleware } from '../middleware/tenant';
import { UserRole, ProtocolStatus } from '@prisma/client';
import { AuthenticatedRequest } from '../types';
import { MODULE_BY_DEPARTMENT } from '../config/module-mapping';

const router = Router();

// Aplicar middlewares
router.use(tenantMiddleware);
router.use(adminAuthMiddleware);

/**
 * GET /api/admin/secretarias/agricultura/stats
 * Obter estatísticas consolidadas da Secretaria de Agricultura
 * VERSÃO SIMPLIFICADA - Usa apenas ProtocolSimplified + moduleType
 */
router.get(
  '/stats',
  requireMinRole(UserRole.USER),
  async (req, res) => {
    try {
      const authReq = req as AuthenticatedRequest;
      const tenantId = authReq.tenantId;

      // Buscar departamento de agricultura
      // ✅ Buscar departamento global
      const agricultureDept = await prisma.department.findFirst({
        where: { code: 'AGRICULTURA' }
      });

      if (!agricultureDept) {
        return res.status(404).json({
          success: false,
          error: 'Department not found',
          message: 'Departamento de Agricultura não encontrado',
        });
      }

      // Módulos de agricultura do MODULE_MAPPING
      const agricultureModules = MODULE_BY_DEPARTMENT.AGRICULTURA || [];

      // Executar queries em paralelo
      const [
        protocolStats,
        protocolsByModule,
        producersCount,
        propertiesCount,
        programsCount,
        trainingsCount,
      ] = await Promise.all([
        // 1. Estatísticas gerais de Protocolos
        prisma.protocolSimplified.groupBy({
          by: ['status'],
          where: {
            tenantId,
            departmentId: agricultureDept.id,
          },
          _count: { id: true },
        }),

        // 2. Protocolos por módulo (usando moduleType)
        prisma.protocolSimplified.groupBy({
          by: ['moduleType', 'status'],
          where: {
            tenantId,
            departmentId: agricultureDept.id,
            moduleType: { in: agricultureModules },
          },
          _count: { id: true },
        }),

        // 3. Produtores Rurais
        prisma.ruralProducer.aggregate({
          where: { tenantId },
          _count: { id: true },
        }),

        // 4. Propriedades Rurais
        prisma.ruralProperty.aggregate({
          where: { tenantId },
          _count: { id: true },
          _sum: { size: true },
        }),

        // 5. Programas Rurais
        prisma.ruralProgram.aggregate({
          where: { tenantId },
          _count: { id: true },
        }),

        // 6. Capacitações
        prisma.ruralTraining.aggregate({
          where: { tenantId },
          _count: { id: true },
        }),
      ]);

      // Processar estatísticas de Protocolos
      const protocolData = {
        total: 0,
        pending: 0,
        inProgress: 0,
        completed: 0,
      };

      protocolStats.forEach((item) => {
        const count = item._count?.id || 0;
        protocolData.total += count;

        if (item.status === ProtocolStatus.VINCULADO || item.status === ProtocolStatus.PENDENCIA) {
          protocolData.pending += count;
        } else if (item.status === ProtocolStatus.PROGRESSO) {
          protocolData.inProgress += count;
        } else if (item.status === ProtocolStatus.CONCLUIDO) {
          protocolData.completed += count;
        }
      });

      // Processar estatísticas por módulo
      const moduleStats: Record<string, any> = {};

      protocolsByModule.forEach((item) => {
        if (!item.moduleType) return;

        if (!moduleStats[item.moduleType]) {
          moduleStats[item.moduleType] = {
            total: 0,
            pending: 0,
            inProgress: 0,
            completed: 0,
          };
        }

        const count = item._count?.id || 0;
        moduleStats[item.moduleType].total += count;

        if (item.status === ProtocolStatus.VINCULADO || item.status === ProtocolStatus.PENDENCIA) {
          moduleStats[item.moduleType].pending += count;
        } else if (item.status === ProtocolStatus.PROGRESSO) {
          moduleStats[item.moduleType].inProgress += count;
        } else if (item.status === ProtocolStatus.CONCLUIDO) {
          moduleStats[item.moduleType].completed += count;
        }
      });

      // Estatísticas de Assistência Técnica
      const technicalAssistanceStats = moduleStats['ASSISTENCIA_TECNICA'] || {
        total: 0,
        pending: 0,
        inProgress: 0,
        completed: 0,
      };

      // Montar resposta consolidada
      const stats = {
        producers: {
          total: producersCount._count?.id || 0,
          active: producersCount._count?.id || 0,
          inactive: 0,
        },
        properties: {
          total: propertiesCount._count?.id || 0,
          totalArea: propertiesCount._sum?.size || 0,
        },
        programs: {
          total: programsCount._count?.id || 0,
        },
        trainings: {
          total: trainingsCount._count?.id || 0,
        },
        technicalAssistance: {
          totalActive: technicalAssistanceStats.pending + technicalAssistanceStats.inProgress,
          pending: technicalAssistanceStats.pending,
          inProgress: technicalAssistanceStats.inProgress,
          completedThisMonth: technicalAssistanceStats.completed,
        },
        protocols: protocolData,
        moduleStats, // Estatísticas detalhadas por módulo
      };

      return res.json({
        success: true,
        data: stats,
      });
    } catch (error) {
      console.error('Agriculture stats error:', error);
      return res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: 'Erro ao buscar estatísticas da agricultura',
      });
    }
  }
);

/**
 * GET /api/admin/secretarias/agricultura/services
 * Listar serviços da Secretaria de Agricultura
 */
router.get(
  '/services',
  requireMinRole(UserRole.USER),
  async (req, res) => {
    try {
      const authReq = req as AuthenticatedRequest;
      const tenantId = authReq.tenantId;

      console.log('\n========== GET /api/admin/secretarias/agricultura/services ==========');
      console.log('[GET /services] TenantId:', tenantId);
      console.log('[GET /services] User:', authReq.user?.email);

      // Buscar departamento de agricultura
      // ✅ Buscar departamento global
      const agricultureDept = await prisma.department.findFirst({
        where: { code: 'AGRICULTURA' }
      });

      console.log('[GET /services] Agriculture Dept:', agricultureDept ? `${agricultureDept.name} (${agricultureDept.id})` : 'NÃO ENCONTRADO');

      if (!agricultureDept) {
        console.log('[GET /services] ❌ Retornando 404 - Departamento não encontrado');
        return res.status(404).json({
          success: false,
          error: 'Department not found',
          message: 'Departamento de Agricultura não encontrado',
        });
      }

      // Buscar serviços simplificados
      const services = await prisma.serviceSimplified.findMany({
        where: {
          tenantId,
          departmentId: agricultureDept.id,
          isActive: true,
        },
        orderBy: {
          name: 'asc',
        },
      });

      console.log('[GET /services] ✅ Services found:', services.length);
      console.log('[GET /services] Services details:');
      services.forEach((s, i) => {
        console.log(`  ${i + 1}. ${s.name}`);
        console.log(`     - moduleType: ${s.moduleType || 'null'}`);
        console.log(`     - serviceType: ${s.serviceType}`);
        console.log(`     - isActive: ${s.isActive}`);
      });

      const response = {
        success: true,
        data: services,
      };

      console.log('[GET /services] Retornando resposta com', services.length, 'serviços');
      console.log('========== FIM GET /services ==========\n');

      return res.json(response);
    } catch (error) {
      console.error('[GET /services] ❌ ERROR:', error);
      return res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: 'Erro ao buscar serviços',
      });
    }
  }
);

// ❌ ROTA REMOVIDA: GET /produtores
// Motivo: Duplicada com secretarias-agricultura-produtores.ts
// A rota dedicada em secretarias-agricultura-produtores.ts
// implementa CRUD completo (GET, POST, PUT, DELETE)
// Mantida apenas a rota dedicada para evitar conflitos

// ============================================================================
// PROPRIEDADES RURAIS - CRUD COMPLETO
// ============================================================================
// IMPORTANTE: Rotas com parâmetros (:id) devem vir ANTES das rotas genéricas

/**
 * GET /api/admin/secretarias/agricultura/propriedades/:id
 * Visualizar propriedade rural individual
 */
router.get(
  '/propriedades/:id',
  requireMinRole(UserRole.USER),
  async (req, res) => {
    try {
      const authReq = req as AuthenticatedRequest;
      const tenantId = authReq.tenantId;
      const { id } = req.params;

      const property = await prisma.ruralProperty.findFirst({
        where: {
          id,
          tenantId,
        },
        include: {
          producer: {
            select: {
              id: true,
              name: true,
              document: true,
              email: true,
              phone: true,
            },
          },
          protocol: {
            select: {
              id: true,
              number: true,
              status: true,
              createdAt: true,
            },
          },
        },
      });

      if (!property) {
        return res.status(404).json({
          success: false,
          error: 'Property not found',
          message: 'Propriedade não encontrada',
        });
      }

      return res.json({
        success: true,
        data: property,
      });
    } catch (error) {
      console.error('Get rural property error:', error);
      return res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: 'Erro ao buscar propriedade',
      });
    }
  }
);

/**
 * PUT /api/admin/secretarias/agricultura/propriedades/:id
 * Atualizar propriedade rural
 */
router.put(
  '/propriedades/:id',
  requireMinRole(UserRole.USER),
  async (req, res) => {
    try {
      const authReq = req as AuthenticatedRequest;
      const tenantId = authReq.tenantId;
      const { id } = req.params;
      const { name, producerId, size, location, plantedArea, mainCrops, status } = req.body;

      // Verificar se a propriedade existe e pertence ao tenant
      const existingProperty = await prisma.ruralProperty.findFirst({
        where: {
          id,
          tenantId,
        },
      });

      if (!existingProperty) {
        return res.status(404).json({
          success: false,
          error: 'Property not found',
          message: 'Propriedade não encontrada',
        });
      }

      // Se está mudando o produtor, verificar se o novo produtor existe
      if (producerId && producerId !== existingProperty.producerId) {
        const producer = await prisma.ruralProducer.findFirst({
          where: {
            id: producerId,
            tenantId,
          },
        });

        if (!producer) {
          return res.status(404).json({
            success: false,
            error: 'Producer not found',
            message: 'Produtor não encontrado',
          });
        }
      }

      // Atualizar propriedade
      const property = await prisma.ruralProperty.update({
        where: { id },
        data: {
          name: name || existingProperty.name,
          producerId: producerId || existingProperty.producerId,
          size: size ? parseFloat(size) : existingProperty.size,
          location: location || existingProperty.location,
          plantedArea: plantedArea !== undefined ? (plantedArea ? parseFloat(plantedArea) : null) : existingProperty.plantedArea,
          mainCrops: mainCrops !== undefined ? mainCrops : existingProperty.mainCrops,
          status: status || existingProperty.status,
        },
        include: {
          producer: {
            select: {
              id: true,
              name: true,
            },
          },
          protocol: {
            select: {
              id: true,
              number: true,
              status: true,
            },
          },
        },
      });

      return res.json({
        success: true,
        data: property,
        message: 'Propriedade atualizada com sucesso',
      });
    } catch (error) {
      console.error('Update rural property error:', error);
      return res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: 'Erro ao atualizar propriedade',
      });
    }
  }
);

/**
 * DELETE /api/admin/secretarias/agricultura/propriedades/:id
 * Excluir propriedade rural
 */
router.delete(
  '/propriedades/:id',
  requireMinRole(UserRole.USER),
  async (req, res) => {
    try {
      const authReq = req as AuthenticatedRequest;
      const tenantId = authReq.tenantId;
      const { id } = req.params;

      // Verificar se a propriedade existe e pertence ao tenant
      const property = await prisma.ruralProperty.findFirst({
        where: {
          id,
          tenantId,
        },
      });

      if (!property) {
        return res.status(404).json({
          success: false,
          error: 'Property not found',
          message: 'Propriedade não encontrada',
        });
      }

      // Excluir propriedade
      await prisma.ruralProperty.delete({
        where: { id },
      });

      return res.json({
        success: true,
        message: 'Propriedade excluída com sucesso',
      });
    } catch (error) {
      console.error('Delete rural property error:', error);
      return res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: 'Erro ao excluir propriedade',
      });
    }
  }
);

/**
 * GET /api/admin/secretarias/agricultura/propriedades
 * Listar propriedades rurais
 */
router.get(
  '/propriedades',
  requireMinRole(UserRole.USER),
  async (req, res) => {
    try {
      const authReq = req as AuthenticatedRequest;
      const tenantId = authReq.tenantId;
      const { page = 1, limit = 20, status, search } = req.query;

      const skip = (Number(page) - 1) * Number(limit);

      const where: any = { tenantId };

      if (status && status !== 'all') {
        where.status = status;
      }

      if (search) {
        where.OR = [
          { name: { contains: search as string } },
          { location: { contains: search as string } },
        ];
      }

      const [data, total, areaSum] = await Promise.all([
        prisma.ruralProperty.findMany({
          where,
          skip,
          take: Number(limit),
          orderBy: { createdAt: 'desc' },
          include: {
            producer: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        }),
        prisma.ruralProperty.count({ where }),
        prisma.ruralProperty.aggregate({
          where,
          _sum: { size: true, plantedArea: true },
        }),
      ]);

      return res.json({
        success: true,
        data,
        stats: {
          total,
          totalArea: areaSum._sum?.size || 0,
          totalPlantedArea: areaSum._sum?.plantedArea || 0,
        },
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit)),
        },
      });
    } catch (error) {
      console.error('Get rural properties error:', error);
      return res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  }
);

/**
 * POST /api/admin/secretarias/agricultura/propriedades
 * Criar nova propriedade rural
 * ✅ GERA PROTOCOLO CONCLUÍDO para o cidadão vinculado ao produtor
 */
router.post(
  '/propriedades',
  requireMinRole(UserRole.USER),
  async (req, res) => {
    try {
      const authReq = req as AuthenticatedRequest;
      const tenantId = authReq.tenantId;
      const { name, producerId, size, location, plantedArea, mainCrops, status } = req.body;

      // Validar campos obrigatórios
      if (!name || !producerId || !size || !location) {
        return res.status(400).json({
          success: false,
          error: 'Missing required fields',
          message: 'Nome, produtor, tamanho e localização são obrigatórios',
        });
      }

      // Verificar se o produtor existe e pertence ao tenant
      const producer = await prisma.ruralProducer.findFirst({
        where: {
          id: producerId,
          tenantId,
        },
        include: {
          citizen: true,
        },
      });

      if (!producer) {
        return res.status(404).json({
          success: false,
          error: 'Producer not found',
          message: 'Produtor não encontrado',
        });
      }

      // Buscar departamento de agricultura
      const agricultureDept = await prisma.department.findFirst({
        where: { code: 'AGRICULTURA' }
      });

      if (!agricultureDept) {
        return res.status(404).json({
          success: false,
          error: 'Department not found',
          message: 'Departamento de Agricultura não encontrado',
        });
      }

      // Buscar ou criar serviço de cadastro de propriedade rural
      let service = await prisma.serviceSimplified.findFirst({
        where: {
          tenantId,
          departmentId: agricultureDept.id,
          moduleType: 'CADASTRO_PROPRIEDADE_RURAL',
        },
      });

      if (!service) {
        // Criar serviço se não existir
        service = await prisma.serviceSimplified.create({
          data: {
            tenantId,
            departmentId: agricultureDept.id,
            name: 'Cadastro de Propriedade Rural',
            description: 'Cadastro manual de propriedade rural pelo sistema administrativo',
            serviceType: 'COM_DADOS',
            moduleType: 'CADASTRO_PROPRIEDADE_RURAL',
            isActive: true,
          },
        });
      }

      // Gerar número de protocolo
      const protocolCount = await prisma.protocolSimplified.count({
        where: { tenantId },
      });
      const protocolNumber = `PROP-${String(protocolCount + 1).padStart(6, '0')}`;

      // Usar transação para criar propriedade + protocolo
      const result = await prisma.$transaction(async (tx) => {
        // 1. Criar protocolo concluído
        const protocol = await tx.protocolSimplified.create({
          data: {
            tenantId,
            citizenId: producer.citizenId,
            serviceId: service.id,
            departmentId: agricultureDept.id,
            number: protocolNumber,
            title: `Cadastro de Propriedade Rural - ${name}`,
            description: 'Cadastro manual realizado pela secretaria de agricultura',
            moduleType: 'CADASTRO_PROPRIEDADE_RURAL',
            status: ProtocolStatus.CONCLUIDO,
            customData: {
              name,
              producerId,
              producerName: producer.name,
              size,
              location,
              plantedArea,
              mainCrops,
              registeredBy: 'admin',
              registeredAt: new Date().toISOString(),
            },
          },
        });

        // 2. Criar propriedade vinculada ao protocolo
        const property = await tx.ruralProperty.create({
          data: {
            tenantId,
            name,
            producerId,
            protocolId: protocol.id,
            size: parseFloat(size),
            location,
            plantedArea: plantedArea ? parseFloat(plantedArea) : null,
            mainCrops: mainCrops || null,
            status: status || 'ACTIVE',
          },
          include: {
            producer: {
              select: {
                id: true,
                name: true,
              },
            },
            protocol: {
              select: {
                id: true,
                number: true,
                status: true,
              },
            },
          },
        });

        return { property, protocol };
      });

      return res.status(201).json({
        success: true,
        data: result.property,
        protocol: {
          id: result.protocol.id,
          number: result.protocol.number,
          status: result.protocol.status,
        },
        message: 'Propriedade criada com sucesso e protocolo gerado',
      });
    } catch (error) {
      console.error('Create rural property error:', error);
      return res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: 'Erro ao criar propriedade',
      });
    }
  }
);

// ============================================================================
// PROGRAMAS RURAIS - CRUD COMPLETO
// ============================================================================
// IMPORTANTE: Rotas com parâmetros (:id) devem vir ANTES das rotas genéricas

/**
 * GET /api/admin/secretarias/agricultura/programas/:id
 * Visualizar programa rural individual
 */
router.get(
  '/programas/:id',
  requireMinRole(UserRole.USER),
  async (req, res) => {
    try {
      const authReq = req as AuthenticatedRequest;
      const tenantId = authReq.tenantId;
      const { id } = req.params;

      const program = await prisma.ruralProgram.findFirst({
        where: {
          id,
          tenantId,
        },
      });

      if (!program) {
        return res.status(404).json({
          success: false,
          error: 'Program not found',
          message: 'Programa não encontrado',
        });
      }

      return res.json({
        success: true,
        data: program,
      });
    } catch (error) {
      console.error('Get rural program error:', error);
      return res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: 'Erro ao buscar programa',
      });
    }
  }
);

/**
 * PUT /api/admin/secretarias/agricultura/programas/:id
 * Atualizar programa rural
 */
router.put(
  '/programas/:id',
  requireMinRole(UserRole.USER),
  async (req, res) => {
    try {
      const authReq = req as AuthenticatedRequest;
      const tenantId = authReq.tenantId;
      const { id } = req.params;
      const {
        name,
        programType,
        description,
        objectives,
        targetAudience,
        requirements,
        benefits,
        startDate,
        endDate,
        budget,
        coordinator,
        maxParticipants,
        applicationPeriod,
        selectionCriteria,
        partners,
        status,
      } = req.body;

      // Verificar se o programa existe e pertence ao tenant
      const existingProgram = await prisma.ruralProgram.findFirst({
        where: {
          id,
          tenantId,
        },
      });

      if (!existingProgram) {
        return res.status(404).json({
          success: false,
          error: 'Program not found',
          message: 'Programa não encontrado',
        });
      }

      // Atualizar programa
      const program = await prisma.ruralProgram.update({
        where: { id },
        data: {
          name: name || existingProgram.name,
          programType: programType || existingProgram.programType,
          description: description || existingProgram.description,
          objectives: objectives !== undefined ? objectives : existingProgram.objectives,
          targetAudience: targetAudience !== undefined ? targetAudience : existingProgram.targetAudience,
          requirements: requirements !== undefined ? requirements : existingProgram.requirements,
          benefits: benefits !== undefined ? benefits : existingProgram.benefits,
          startDate: startDate ? new Date(startDate) : existingProgram.startDate,
          endDate: endDate !== undefined ? (endDate ? new Date(endDate) : null) : existingProgram.endDate,
          budget: budget !== undefined ? (budget ? parseFloat(budget) : null) : existingProgram.budget,
          coordinator: coordinator || existingProgram.coordinator,
          maxParticipants: maxParticipants !== undefined ? (maxParticipants ? parseInt(maxParticipants) : null) : existingProgram.maxParticipants,
          applicationPeriod: applicationPeriod !== undefined ? applicationPeriod : existingProgram.applicationPeriod,
          selectionCriteria: selectionCriteria !== undefined ? selectionCriteria : existingProgram.selectionCriteria,
          partners: partners !== undefined ? partners : existingProgram.partners,
          status: status || existingProgram.status,
        },
      });

      return res.json({
        success: true,
        data: program,
        message: 'Programa atualizado com sucesso',
      });
    } catch (error) {
      console.error('Update rural program error:', error);
      return res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: 'Erro ao atualizar programa',
      });
    }
  }
);

/**
 * DELETE /api/admin/secretarias/agricultura/programas/:id
 * Excluir programa rural
 */
router.delete(
  '/programas/:id',
  requireMinRole(UserRole.USER),
  async (req, res) => {
    try {
      const authReq = req as AuthenticatedRequest;
      const tenantId = authReq.tenantId;
      const { id } = req.params;

      // Verificar se o programa existe e pertence ao tenant
      const program = await prisma.ruralProgram.findFirst({
        where: {
          id,
          tenantId,
        },
      });

      if (!program) {
        return res.status(404).json({
          success: false,
          error: 'Program not found',
          message: 'Programa não encontrado',
        });
      }

      // Excluir programa
      await prisma.ruralProgram.delete({
        where: { id },
      });

      return res.json({
        success: true,
        message: 'Programa excluído com sucesso',
      });
    } catch (error) {
      console.error('Delete rural program error:', error);
      return res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: 'Erro ao excluir programa',
      });
    }
  }
);

/**
 * GET /api/admin/secretarias/agricultura/programas
 * Listar programas rurais
 */
router.get(
  '/programas',
  requireMinRole(UserRole.USER),
  async (req, res) => {
    try {
      const authReq = req as AuthenticatedRequest;
      const tenantId = authReq.tenantId;
      const { page = 1, limit = 20, status, programType } = req.query;

      const skip = (Number(page) - 1) * Number(limit);

      const where: any = { tenantId };

      if (status && status !== 'all') {
        where.status = status;
      }

      if (programType && programType !== 'all') {
        where.programType = programType;
      }

      const [data, total, activeCount] = await Promise.all([
        prisma.ruralProgram.findMany({
          where,
          skip,
          take: Number(limit),
          orderBy: { createdAt: 'desc' },
        }),
        prisma.ruralProgram.count({ where }),
        prisma.ruralProgram.count({ where: { tenantId, status: 'ACTIVE' } }),
      ]);

      return res.json({
        success: true,
        data,
        stats: {
          total,
          active: activeCount,
        },
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit)),
        },
      });
    } catch (error) {
      console.error('Get rural programs error:', error);
      return res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  }
);

/**
 * POST /api/admin/secretarias/agricultura/programas
 * Criar novo programa rural
 */
router.post(
  '/programas',
  requireMinRole(UserRole.USER),
  async (req, res) => {
    try {
      const authReq = req as AuthenticatedRequest;
      const tenantId = authReq.tenantId;

      console.log('\n========== POST /api/admin/secretarias/agricultura/programas ==========');
      console.log('[POST /programas] TenantId:', tenantId);
      console.log('[POST /programas] Body:', JSON.stringify(req.body, null, 2));

      const {
        name,
        programType,
        description,
        objectives,
        targetAudience,
        requirements,
        benefits,
        startDate,
        endDate,
        budget,
        coordinator,
        maxParticipants,
        applicationPeriod,
        selectionCriteria,
        partners,
        status,
      } = req.body;

      console.log('[POST /programas] Campos extraídos:', {
        name,
        programType,
        description,
        startDate,
        coordinator,
      });

      // Validar campos obrigatórios
      if (!name || !programType || !description || !startDate || !coordinator) {
        console.log('[POST /programas] ❌ Validação falhou - campos faltando');
        return res.status(400).json({
          success: false,
          error: 'Missing required fields',
          message: 'Nome, tipo, descrição, data de início e coordenador são obrigatórios',
        });
      }

      console.log('[POST /programas] ✅ Validação passou - criando programa...');

      // Criar programa rural
      const program = await prisma.ruralProgram.create({
        data: {
          tenantId,
          name,
          programType,
          description,
          objectives: objectives || {},
          targetAudience: targetAudience || '',
          requirements: requirements || {},
          benefits: benefits || {},
          startDate: new Date(startDate),
          endDate: endDate ? new Date(endDate) : null,
          budget: budget ? parseFloat(budget) : null,
          coordinator,
          maxParticipants: maxParticipants ? parseInt(maxParticipants) : null,
          applicationPeriod: applicationPeriod || null,
          selectionCriteria: selectionCriteria || null,
          partners: partners || null,
          status: status || 'PLANNED',
        },
      });

      console.log('[POST /programas] ✅ Programa criado com sucesso:', program.id);
      console.log('========== FIM POST /programas ==========\n');

      return res.status(201).json({
        success: true,
        data: program,
        message: 'Programa rural criado com sucesso',
      });
    } catch (error) {
      console.error('[POST /programas] ❌ ERROR:', error);
      return res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: 'Erro ao criar programa rural',
      });
    }
  }
);

/**
 * GET /api/admin/secretarias/agricultura/capacitacoes
 * Listar capacitações rurais
 */
router.get(
  '/capacitacoes',
  requireMinRole(UserRole.USER),
  async (req, res) => {
    try {
      const authReq = req as AuthenticatedRequest;
      const tenantId = authReq.tenantId;
      const { page = 1, limit = 20, trainingType } = req.query;

      const skip = (Number(page) - 1) * Number(limit);

      const where: any = { tenantId };

      if (trainingType && trainingType !== 'all') {
        where.trainingType = trainingType;
      }

      const [data, total] = await Promise.all([
        prisma.ruralTraining.findMany({
          where,
          skip,
          take: Number(limit),
          orderBy: { startDate: 'desc' },
        }),
        prisma.ruralTraining.count({ where }),
      ]);

      return res.json({
        success: true,
        data,
        stats: {
          total,
        },
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit)),
        },
      });
    } catch (error) {
      console.error('Get rural trainings error:', error);
      return res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  }
);

/**
 * GET /api/admin/secretarias/agricultura/CADASTRO_PRODUTOR/pending
 * Listar protocolos de cadastro de produtor pendentes de aprovação
 */
router.get(
  '/CADASTRO_PRODUTOR/pending',
  requireMinRole(UserRole.USER),
  async (req, res) => {
    try {
      const authReq = req as AuthenticatedRequest;
      const tenantId = authReq.tenantId;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const skip = (page - 1) * limit;

      console.log('\n========== GET /api/admin/secretarias/agricultura/CADASTRO_PRODUTOR/pending ==========');
      console.log('[GET /pending] TenantId:', tenantId);
      console.log('[GET /pending] Page:', page, 'Limit:', limit);

      // Buscar protocolos VINCULADOS (protocolo criado + entidade criada)
      // que têm produtor rural com status PENDING_APPROVAL
      const protocolsData = await prisma.protocolSimplified.findMany({
        where: {
          tenantId,
          moduleType: 'CADASTRO_PRODUTOR',
          status: {
            in: [ProtocolStatus.VINCULADO, ProtocolStatus.ATUALIZACAO], // Protocolos aguardando aprovação
          },
        },
        include: {
          citizen: {
            select: {
              id: true,
              name: true,
              cpf: true,
              email: true,
            },
          },
          service: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      console.log(`[GET /pending] Found ${protocolsData.length} protocols with VINCULADO/ATUALIZACAO status`);

      // Filtrar apenas protocolos cujo produtor rural está PENDING
      const protocolIds = protocolsData.map(p => p.id);
      console.log('[GET /pending] Protocol IDs:', protocolIds);

      const pendingProducers = await prisma.ruralProducer.findMany({
        where: {
          protocolId: { in: protocolIds },
          status: 'PENDING',
          isActive: false, // Ainda não ativado
        },
        select: {
          protocolId: true,
          name: true,
          status: true,
          isActive: true,
        },
      });

      console.log('[GET /pending] Pending producers found:', pendingProducers);

      const pendingProtocolIds = new Set(pendingProducers.map(p => p.protocolId));
      const protocols = protocolsData.filter(p => pendingProtocolIds.has(p.id));

      // Paginar os resultados
      const total = protocols.length;
      const paginatedProtocols = protocols.slice(skip, skip + limit);

      const [_, totalCount] = await Promise.all([
        Promise.resolve(paginatedProtocols),
        Promise.resolve(total),
      ]);

      console.log(`[GET /pending] Final result: ${paginatedProtocols.length} pending protocols (total: ${total})`);

      return res.json({
        data: paginatedProtocols,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      console.error('Get pending rural producers error:', error);
      return res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  }
);

export default router;
