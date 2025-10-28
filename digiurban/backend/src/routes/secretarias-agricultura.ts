// ============================================================================
// SECRETARIAS-AGRICULTURA.TS - Rotas da Secretaria de Agricultura
// ============================================================================

import { Router, Response } from 'express';
import { prisma } from '../lib/prisma';
import {
  adminAuthMiddleware,
  requireMinRole,
} from '../middleware/admin-auth';
import { tenantMiddleware } from '../middleware/tenant';
import { UserRole } from '@prisma/client';
import { AuthenticatedRequest, SuccessResponse, ErrorResponse } from '../types';

const router = Router();

// Aplicar middlewares
router.use(tenantMiddleware);
router.use(adminAuthMiddleware);

/**
 * GET /api/admin/secretarias/agricultura/stats
 * Obter estatísticas consolidadas da Secretaria de Agricultura
 */
router.get(
  '/stats',
  requireMinRole(UserRole.OPERATOR),
  async (req: AuthenticatedRequest, res: Response<SuccessResponse | ErrorResponse>) => {
    try {
      const tenantId = req.tenantId!;

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

      // Executar queries em paralelo para melhor performance
      const [
        technicalAssistanceStats,
        protocolStats,
        seedDistributionStats,
        soilAnalysisStats,
        farmerMarketStats,
      ] = await Promise.all([
        // 1. Estatísticas de Assistência Técnica
        prisma.technicalAssistance.groupBy({
          by: ['status'],
          where: { tenantId },
          _count: { id: true },
        }),

        // 2. Estatísticas de Protocolos
        prisma.protocol.groupBy({
          by: ['status'],
          where: {
            tenantId,
            departmentId: agricultureDept.id,
          },
          _count: { id: true },
        }),

        // 3. Estatísticas de Distribuição de Sementes
        prisma.seedDistribution.groupBy({
          by: ['status'],
          where: { tenantId },
          _count: { id: true },
          _sum: { quantity: true },
        }),

        // 4. Estatísticas de Análise de Solo
        prisma.soilAnalysis.groupBy({
          by: ['status'],
          where: { tenantId },
          _count: { id: true },
        }),

        // 5. Estatísticas de Feira do Produtor
        prisma.farmerMarketRegistration.aggregate({
          where: {
            tenantId,
            status: 'active',
          },
          _count: { id: true },
        }),
      ]);

      // Processar estatísticas de Assistência Técnica
      const assistanceData = {
        pending: 0,
        scheduled: 0,
        inProgress: 0,
        completedThisMonth: 0,
        totalActive: 0,
      };

      technicalAssistanceStats.forEach((item) => {
        const count = item._count.id;
        switch (item.status) {
          case 'pending':
            assistanceData.pending = count;
            assistanceData.totalActive += count;
            break;
          case 'scheduled':
            assistanceData.scheduled = count;
            assistanceData.totalActive += count;
            break;
          case 'in_progress':
            assistanceData.inProgress = count;
            assistanceData.totalActive += count;
            break;
          case 'completed':
            assistanceData.completedThisMonth = count;
            break;
        }
      });

      // Processar estatísticas de Protocolos
      const protocolData = {
        total: 0,
        pending: 0,
        approved: 0,
        rejected: 0,
        thisMonth: 0,
      };

      protocolStats.forEach((item) => {
        const count = item._count.id;
        protocolData.total += count;
        switch (item.status) {
          case 'pending':
            protocolData.pending = count;
            break;
          case 'approved':
            protocolData.approved = count;
            break;
          case 'rejected':
            protocolData.rejected = count;
            break;
        }
      });

      // Processar estatísticas de Distribuição de Sementes
      const seedData = {
        activeRequests: 0,
        completedThisMonth: 0,
        totalKgDistributed: 0,
      };

      seedDistributionStats.forEach((item) => {
        const count = item._count.id;
        const quantity = item._sum.quantity || 0;

        if (item.status === 'pending' || item.status === 'approved') {
          seedData.activeRequests += count;
        } else if (item.status === 'delivered') {
          seedData.completedThisMonth = count;
          seedData.totalKgDistributed += quantity;
        }
      });

      // Processar estatísticas de Análise de Solo
      const soilData = {
        pending: 0,
        inProgress: 0,
        completedThisMonth: 0,
      };

      soilAnalysisStats.forEach((item) => {
        const count = item._count.id;
        switch (item.status) {
          case 'pending':
            soilData.pending = count;
            break;
          case 'in_progress':
            soilData.inProgress = count;
            break;
          case 'completed':
            soilData.completedThisMonth = count;
            break;
        }
      });

      // Produtores e Propriedades (dados estimados a partir de assistências)
      const uniqueProducers = await prisma.technicalAssistance.findMany({
        where: { tenantId },
        select: { producerCpf: true },
        distinct: ['producerCpf'],
      });

      const uniqueProperties = await prisma.technicalAssistance.findMany({
        where: { tenantId },
        select: { propertyName: true },
        distinct: ['propertyName'],
      });

      // Montar resposta consolidada
      const stats = {
        producers: {
          total: uniqueProducers.length,
          active: uniqueProducers.length,
          inactive: 0,
          newThisMonth: 0, // TODO: Implementar quando tiver tabela de produtores
        },
        properties: {
          total: uniqueProperties.length,
          active: uniqueProperties.length,
          totalArea: 0, // TODO: Implementar cálculo de área total
          withIrrigation: 0, // TODO: Implementar quando tiver dados
        },
        technicalAssistance: assistanceData,
        protocols: protocolData,
        seedDistribution: seedData,
        soilAnalysis: soilData,
        farmerMarket: {
          activeStands: farmerMarketStats._count.id,
          totalFarmers: farmerMarketStats._count.id,
        },
      };

      res.json({
        success: true,
        data: stats,
      });
    } catch (error) {
      console.error('Agriculture stats error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: 'Erro ao buscar estatísticas da agricultura',
      });
    }
  }
);

export default router;
