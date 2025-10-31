// ============================================================================
// SECRETARIAS-EDUCACAO.TS - Rotas da Secretaria de Educação
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
 * GET /api/admin/secretarias/educacao/stats
 * Obter estatísticas consolidadas da Secretaria de Educação
 * VERSÃO SIMPLIFICADA - Usa apenas ProtocolSimplified + moduleType
 */
router.get(
  '/stats',
  requireMinRole(UserRole.USER),
  async (req, res) => {
    try {
      const authReq = req as AuthenticatedRequest;
      const tenantId = authReq.tenantId;

      // Buscar departamento de educação
      const educationDept = await prisma.department.findFirst({
        where: {
          tenantId,
          code: 'EDUCACAO',
        },
      });

      if (!educationDept) {
        return res.status(404).json({
          success: false,
          error: 'Department not found',
          message: 'Departamento de Educação não encontrado',
        });
      }

      // Módulos de educação do MODULE_MAPPING
      const educationModules = MODULE_BY_DEPARTMENT.EDUCACAO || [];

      // Executar queries em paralelo
      const [
        protocolStats,
        protocolsByModule,
        schoolsCount,
        studentsCount,
        schoolTransportsCount,
        educationAttendancesCount,
        disciplinaryRecordsCount,
        schoolDocumentsCount,
        studentTransfersCount,
        attendanceRecordsCount,
        gradeRecordsCount,
        schoolManagementsCount,
        schoolMealsCount,
      ] = await Promise.all([
        // 1. Estatísticas gerais de Protocolos
        prisma.protocolSimplified.groupBy({
          by: ['status'],
          where: {
            tenantId,
            departmentId: educationDept.id,
          },
          _count: { id: true },
        }),

        // 2. Protocolos por módulo (usando moduleType)
        prisma.protocolSimplified.groupBy({
          by: ['moduleType', 'status'],
          where: {
            tenantId,
            departmentId: educationDept.id,
            moduleType: { in: educationModules },
          },
          _count: { id: true },
        }),

        // 3. Escolas
        prisma.school.count({ where: { tenantId } }),

        // 4. Alunos
        prisma.student.count({ where: { tenantId } }),

        // 5. Transporte Escolar
        prisma.schoolTransport.count({ where: { tenantId } }),

        // 6. Atendimentos Educacionais
        prisma.educationAttendance.count({ where: { tenantId } }),

        // 7. Ocorrências Disciplinares
        prisma.disciplinaryRecord.count({ where: { tenantId } }),

        // 8. Documentos Escolares
        prisma.schoolDocument.count({ where: { tenantId } }),

        // 9. Transferências
        prisma.studentTransfer.count({ where: { tenantId } }),

        // 10. Frequência
        prisma.attendanceRecord.count({ where: { tenantId } }),

        // 11. Notas
        prisma.gradeRecord.count({ where: { tenantId } }),

        // 12. Gestão Escolar
        prisma.schoolManagement.count({ where: { tenantId } }),

        // 13. Merenda Escolar
        prisma.schoolMeal.count({ where: { tenantId } }),
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

      // Montar resposta consolidada
      const stats = {
        schools: schoolsCount,
        modules: {
          educationAttendances: educationAttendancesCount,
          students: studentsCount,
          schoolTransports: schoolTransportsCount,
          disciplinaryRecords: disciplinaryRecordsCount,
          schoolDocuments: schoolDocumentsCount,
          studentTransfers: studentTransfersCount,
          attendanceRecords: attendanceRecordsCount,
          gradeRecords: gradeRecordsCount,
          schoolManagements: schoolManagementsCount,
          schoolMeals: schoolMealsCount,
        },
        protocols: protocolData,
        moduleStats, // Estatísticas detalhadas por módulo
      };

      return res.json({
        success: true,
        data: stats,
      });
    } catch (error) {
      console.error('Education stats error:', error);
      return res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: 'Erro ao buscar estatísticas da educação',
      });
    }
  }
);

/**
 * GET /api/admin/secretarias/educacao/services
 * Listar serviços da Secretaria de Educação
 */
router.get(
  '/services',
  requireMinRole(UserRole.USER),
  async (req, res) => {
    try {
      const authReq = req as AuthenticatedRequest;
      const tenantId = authReq.tenantId;

      // Buscar departamento de educação
      const educationDept = await prisma.department.findFirst({
        where: {
          tenantId,
          code: 'EDUCACAO',
        },
      });

      if (!educationDept) {
        return res.status(404).json({
          success: false,
          error: 'Department not found',
          message: 'Departamento de Educação não encontrado',
        });
      }

      // Buscar serviços simplificados
      const services = await prisma.serviceSimplified.findMany({
        where: {
          tenantId,
          departmentId: educationDept.id,
          isActive: true,
        },
        orderBy: {
          name: 'asc',
        },
      });

      return res.json({
        success: true,
        data: services,
      });
    } catch (error) {
      console.error('Get education services error:', error);
      return res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: 'Erro ao buscar serviços',
      });
    }
  }
);

export default router;
