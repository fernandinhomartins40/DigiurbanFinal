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
      const agricultureDept = await prisma.department.findFirst({
        where: {
          tenantId,
          code: 'AGRICULTURA',
        },
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
      const agricultureDept = await prisma.department.findFirst({
        where: {
          tenantId,
          code: 'AGRICULTURA',
        },
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

export default router;
