// ============================================================================
// SECRETARIAS-AGRICULTURA.TS - Rotas da Secretaria de Agricultura
// ============================================================================

import { Router } from 'express';
import { prisma } from '../lib/prisma';
import {
  adminAuthMiddleware,
  requireMinRole,
} from '../middleware/admin-auth';
import { tenantMiddleware } from '../middleware/tenant';
import { UserRole, ProtocolStatus } from '@prisma/client';
import { AuthenticatedRequest } from '../types';

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
        const count = item._count?.id || 0;
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
        const count = item._count?.id || 0;
        protocolData.total += count;

        // Usar os valores corretos do enum ProtocolStatus
        if (item.status === ProtocolStatus.VINCULADO || item.status === ProtocolStatus.PENDENCIA) {
          protocolData.pending += count;
        } else if (item.status === ProtocolStatus.CONCLUIDO) {
          protocolData.approved += count;
        }
      });

      // Processar estatísticas de Distribuição de Sementes
      const seedData = {
        activeRequests: 0,
        completedThisMonth: 0,
        totalKgDistributed: 0,
      };

      seedDistributionStats.forEach((item) => {
        const count = item._count?.id || 0;

        if (item.status === 'pending' || item.status === 'approved') {
          seedData.activeRequests += count;
        } else if (item.status === 'delivered') {
          seedData.completedThisMonth = count;
        }
      });

      // Processar estatísticas de Análise de Solo
      const soilData = {
        pending: 0,
        inProgress: 0,
        completedThisMonth: 0,
      };

      soilAnalysisStats.forEach((item) => {
        const count = item._count?.id || 0;
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
          activeStands: farmerMarketStats._count?.id || 0,
          totalFarmers: farmerMarketStats._count?.id || 0,
        },
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
 * POST /api/admin/secretarias/agricultura/protocols
 * Criar novo protocolo com integração ao Module Handler
 */
router.post('/protocols', requireMinRole(UserRole.USER), async (req, res) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const tenantId = authReq.tenantId;
    const userId = authReq.userId;

    const { serviceId, citizenData, formData } = req.body;

    // Validações
    if (!serviceId || !citizenData || !formData) {
      return res.status(400).json({
        success: false,
        error: 'Bad request',
        message: 'serviceId, citizenData e formData são obrigatórios',
      });
    }

    // Buscar serviço
    const service = await prisma.service.findFirst({
      where: {
        id: serviceId,
        tenantId,
        isActive: true,
      },
    });

    if (!service) {
      return res.status(404).json({
        success: false,
        error: 'Not found',
        message: 'Serviço não encontrado',
      });
    }

    // Buscar ou criar cidadão
    let citizen = await prisma.citizen.findFirst({
      where: {
        tenantId,
        cpf: citizenData.cpf,
      },
    });

    if (!citizen) {
      // Criar cidadão temporário
      citizen = await prisma.citizen.create({
        data: {
          tenantId,
          cpf: citizenData.cpf,
          name: citizenData.name,
          email: citizenData.email || `temp_${citizenData.cpf}@temp.com`,
          phone: citizenData.phone,
          password: 'TEMP_PASSWORD', // Será forçado a trocar no primeiro login
          registrationSource: 'ADMIN',
        },
      });
    }

    // Iniciar transação para criar protocolo + entidade especializada
    const result = await prisma.$transaction(async (tx) => {
      // 1. Gerar número de protocolo
      const protocolCount = await tx.protocol.count({
        where: { tenantId },
      });
      const protocolNumber = `${new Date().getFullYear()}${String(
        protocolCount + 1
      ).padStart(6, '0')}`;

      // 2. Criar protocolo
      const protocol = await tx.protocol.create({
        data: {
          number: protocolNumber,
          title: service.name,
          description: formData.description || service.description || '',
          serviceId: service.id,
          citizenId: citizen.id,
          tenantId,
          departmentId: service.departmentId,
          status: 'VINCULADO',
          customData: formData,
          createdById: userId,
        },
      });

      // 3. Se service tem moduleType, executar handler
      let entityId = null;
      let entityType = null;

      if (service.moduleType && service.moduleEntity) {
        // Executar handler apropriado
        if (service.moduleEntity === 'TechnicalAssistance') {
          const assistance = await tx.technicalAssistance.create({
            data: {
              tenantId,
              protocol: protocol.number,
              serviceId: service.id,
              source: 'service',
              producerName: formData.producerName,
              producerCpf: formData.producerCpf,
              producerPhone: formData.producerPhone,
              propertyName: formData.propertyName || formData.producerName,
              propertyLocation: formData.propertyLocation,
              propertyArea: formData.propertyArea
                ? parseFloat(formData.propertyArea)
                : null,
              propertySize: formData.propertyArea
                ? parseFloat(formData.propertyArea)
                : 0,
              location: formData.propertyLocation,
              assistanceType: formData.assistanceType,
              subject: formData.assistanceType,
              description: formData.description,
              cropTypes: formData.cropTypes || null,
              status: 'pending',
              priority: 'normal',
              technician: 'Não designado',
              visitDate: new Date(),
              recommendations: '',
              requestDate: new Date(),
            },
          });
          entityId = assistance.id;
          entityType = 'TechnicalAssistance';
        } else if (service.moduleEntity === 'SeedDistribution') {
          const distribution = await tx.seedDistribution.create({
            data: {
              tenantId,
              protocol: protocol.number,
              serviceId: service.id,
              source: 'service',
              producerName: formData.producerName,
              producerCpf: formData.producerCpf,
              producerPhone: formData.producerPhone,
              propertyLocation: formData.propertyLocation || 'Não informado',
              propertyArea: formData.propertyArea ? parseFloat(formData.propertyArea) : null,
              requestType: formData.requestType || 'seeds',
              items: formData.items || [],
              purpose: formData.purpose || 'subsistence',
              status: 'pending',
            },
          });
          entityId = distribution.id;
          entityType = 'SeedDistribution';
        } else if (service.moduleEntity === 'SoilAnalysis') {
          const analysis = await tx.soilAnalysis.create({
            data: {
              tenantId,
              protocol: protocol.number,
              serviceId: service.id,
              source: 'service',
              producerName: formData.producerName,
              producerCpf: formData.producerCpf,
              producerPhone: formData.producerPhone || 'Não informado',
              propertyLocation: formData.propertyLocation || 'Não informado',
              propertyArea: formData.propertyArea ? parseFloat(formData.propertyArea) : null,
              analysisType: formData.analysisType || 'basic',
              purpose: formData.purpose || 'Análise de solo',
              cropIntended: formData.cropIntended || null,
              status: 'pending',
            },
          });
          entityId = analysis.id;
          entityType = 'SoilAnalysis';
        } else if (service.moduleEntity === 'FarmerMarketRegistration') {
          const registration = await tx.farmerMarketRegistration.create({
            data: {
              tenantId,
              protocol: protocol.number,
              serviceId: service.id,
              source: 'service',
              producerName: formData.producerName,
              producerCpf: formData.producerCpf,
              producerPhone: formData.producerPhone,
              producerEmail: formData.producerEmail || null,
              propertyLocation: formData.propertyLocation || 'Não informado',
              propertyArea: formData.propertyArea ? parseFloat(formData.propertyArea) : null,
              products: formData.products || [],
              productionType: formData.productionType || 'conventional',
              hasOrganicCert: formData.hasOrganicCert || false,
              needsStall: formData.needsStall || false,
              stallPreference: formData.stallPreference || null,
              status: 'pending',
            },
          });
          entityId = registration.id;
          entityType = 'FarmerMarketRegistration';
        }
      }

      return {
        protocol,
        entityId,
        entityType,
        citizen,
      };
    });

    return res.json({
      success: true,
      data: {
        protocol: result.protocol,
        entityId: result.entityId,
        entityType: result.entityType,
        message: service.moduleType
          ? `Protocolo ${result.protocol.number} criado e vinculado ao módulo ${result.entityType}`
          : `Protocolo ${result.protocol.number} criado`,
      },
    });
  } catch (error) {
    console.error('Create protocol error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Erro ao criar protocolo',
    });
  }
});

export default router;
