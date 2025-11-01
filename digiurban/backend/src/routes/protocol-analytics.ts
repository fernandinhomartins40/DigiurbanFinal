import { Router, Request, Response } from 'express';
import { protocolAnalyticsService } from '../services/protocol-analytics.service';
import { authenticateToken } from '../middleware/auth';

const router = Router();

/**
 * GET /api/protocol-analytics/dashboard
 * Obtém dashboard consolidado de métricas
 */
router.get('/dashboard', authenticateToken, async (req: Request, res: Response) => {
  try {
    const tenantId = req.user?.tenantId;
    if (!tenantId) {
      return res.status(400).json({ error: 'Tenant ID não encontrado' });
    }

    const {
      periodType = 'MONTHLY',
      departmentId,
      serviceId,
      userId
    } = req.query;

    const dashboard = await protocolAnalyticsService.getDashboard(
      {
        tenantId,
        departmentId: departmentId as string,
        serviceId: serviceId as string,
        userId: userId as string
      },
      periodType as 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY'
    );

    res.json(dashboard);
  } catch (error: any) {
    console.error('Erro ao buscar dashboard:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/protocol-analytics/metrics
 * Obtém métricas gerais de protocolos
 */
router.get('/metrics', authenticateToken, async (req: Request, res: Response) => {
  try {
    const tenantId = req.user?.tenantId;
    if (!tenantId) {
      return res.status(400).json({ error: 'Tenant ID não encontrado' });
    }

    const {
      periodType = 'MONTHLY',
      periodDate,
      departmentId,
      serviceId
    } = req.query;

    const period = {
      type: periodType as 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY',
      date: periodDate ? new Date(periodDate as string) : new Date()
    };

    const metrics = await protocolAnalyticsService.calculateProtocolMetrics(
      {
        tenantId,
        departmentId: departmentId as string,
        serviceId: serviceId as string
      },
      period
    );

    res.json(metrics);
  } catch (error: any) {
    console.error('Erro ao calcular métricas:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/protocol-analytics/department/:departmentId
 * Obtém métricas de um departamento específico
 */
router.get('/department/:departmentId', authenticateToken, async (req: Request, res: Response) => {
  try {
    const tenantId = req.user?.tenantId;
    if (!tenantId) {
      return res.status(400).json({ error: 'Tenant ID não encontrado' });
    }

    const { departmentId } = req.params;
    const { periodType = 'MONTHLY', periodDate } = req.query;

    const period = {
      type: periodType as 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY',
      date: periodDate ? new Date(periodDate as string) : new Date()
    };

    const metrics = await protocolAnalyticsService.calculateDepartmentMetrics(
      { tenantId, departmentId },
      period
    );

    res.json(metrics);
  } catch (error: any) {
    console.error('Erro ao calcular métricas do departamento:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/protocol-analytics/service/:serviceId
 * Obtém métricas de um serviço específico
 */
router.get('/service/:serviceId', authenticateToken, async (req: Request, res: Response) => {
  try {
    const tenantId = req.user?.tenantId;
    if (!tenantId) {
      return res.status(400).json({ error: 'Tenant ID não encontrado' });
    }

    const { serviceId } = req.params;
    const { periodType = 'MONTHLY', periodDate } = req.query;

    const period = {
      type: periodType as 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY',
      date: periodDate ? new Date(periodDate as string) : new Date()
    };

    const metrics = await protocolAnalyticsService.calculateServiceMetrics(
      { tenantId, serviceId },
      period
    );

    res.json(metrics);
  } catch (error: any) {
    console.error('Erro ao calcular métricas do serviço:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/protocol-analytics/server/:userId
 * Obtém performance de um servidor específico
 */
router.get('/server/:userId', authenticateToken, async (req: Request, res: Response) => {
  try {
    const tenantId = req.user?.tenantId;
    if (!tenantId) {
      return res.status(400).json({ error: 'Tenant ID não encontrado' });
    }

    const { userId } = req.params;
    const { periodType = 'MONTHLY', periodDate } = req.query;

    const period = {
      type: periodType as 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY',
      date: periodDate ? new Date(periodDate as string) : new Date()
    };

    const performance = await protocolAnalyticsService.calculateServerPerformance(
      { tenantId, userId },
      period
    );

    res.json(performance);
  } catch (error: any) {
    console.error('Erro ao calcular performance do servidor:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/protocol-analytics/bottlenecks
 * Identifica gargalos no processo
 */
router.get('/bottlenecks', authenticateToken, async (req: Request, res: Response) => {
  try {
    const tenantId = req.user?.tenantId;
    if (!tenantId) {
      return res.status(400).json({ error: 'Tenant ID não encontrado' });
    }

    const {
      periodType = 'MONTHLY',
      periodDate,
      limit = '10'
    } = req.query;

    const period = {
      type: periodType as 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY',
      date: periodDate ? new Date(periodDate as string) : new Date()
    };

    const bottlenecks = await protocolAnalyticsService.identifyBottlenecks(
      { tenantId },
      period
    );

    // Limitar e ordenar por impacto
    const limitedBottlenecks = bottlenecks
      .sort((a, b) => b.impactScore - a.impactScore)
      .slice(0, parseInt(limit as string));

    res.json(limitedBottlenecks);
  } catch (error: any) {
    console.error('Erro ao identificar gargalos:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/protocol-analytics/export/csv
 * Exporta relatório em formato CSV
 */
router.get('/export/csv', authenticateToken, async (req: Request, res: Response) => {
  try {
    const tenantId = req.user?.tenantId;
    if (!tenantId) {
      return res.status(400).json({ error: 'Tenant ID não encontrado' });
    }

    const {
      periodType = 'MONTHLY',
      departmentId,
      serviceId
    } = req.query;

    const csv = await protocolAnalyticsService.exportToCSV(
      {
        tenantId,
        departmentId: departmentId as string,
        serviceId: serviceId as string
      },
      periodType as 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY'
    );

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=relatorio-protocolos-${periodType}-${new Date().toISOString()}.csv`);
    res.send(csv);
  } catch (error: any) {
    console.error('Erro ao exportar relatório:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/protocol-analytics/trends
 * Obtém tendências ao longo do tempo
 */
router.get('/trends', authenticateToken, async (req: Request, res: Response) => {
  try {
    const tenantId = req.user?.tenantId;
    if (!tenantId) {
      return res.status(400).json({ error: 'Tenant ID não encontrado' });
    }

    const {
      periodType = 'MONTHLY',
      months = '6'
    } = req.query;

    const monthsCount = parseInt(months as string);
    const trends = [];

    // Buscar métricas dos últimos N meses
    for (let i = monthsCount - 1; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);

      const period = {
        type: periodType as 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY',
        date
      };

      try {
        const metrics = await protocolAnalyticsService.calculateProtocolMetrics(
          { tenantId },
          period
        );
        trends.push({
          period: date.toISOString().slice(0, 7), // YYYY-MM
          metrics
        });
      } catch (error) {
        // Se não houver dados para o período, adicionar vazio
        trends.push({
          period: date.toISOString().slice(0, 7),
          metrics: null
        });
      }
    }

    res.json(trends);
  } catch (error: any) {
    console.error('Erro ao buscar tendências:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/protocol-analytics/comparison
 * Compara métricas entre períodos
 */
router.get('/comparison', authenticateToken, async (req: Request, res: Response) => {
  try {
    const tenantId = req.user?.tenantId;
    if (!tenantId) {
      return res.status(400).json({ error: 'Tenant ID não encontrado' });
    }

    const {
      periodType = 'MONTHLY',
      currentDate,
      previousDate
    } = req.query;

    if (!currentDate || !previousDate) {
      return res.status(400).json({ error: 'Datas de comparação são obrigatórias' });
    }

    const currentPeriod = {
      type: periodType as 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY',
      date: new Date(currentDate as string)
    };

    const previousPeriod = {
      type: periodType as 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY',
      date: new Date(previousDate as string)
    };

    const [currentMetrics, previousMetrics] = await Promise.all([
      protocolAnalyticsService.calculateProtocolMetrics({ tenantId }, currentPeriod),
      protocolAnalyticsService.calculateProtocolMetrics({ tenantId }, previousPeriod)
    ]);

    // Calcular variações percentuais
    const calculateChange = (current: number | null, previous: number | null) => {
      if (current === null || previous === null || previous === 0) return null;
      return ((current - previous) / previous) * 100;
    };

    const comparison = {
      current: currentMetrics,
      previous: previousMetrics,
      changes: {
        totalProtocols: calculateChange(currentMetrics.totalProtocols, previousMetrics.totalProtocols),
        closedProtocols: calculateChange(currentMetrics.closedProtocols, previousMetrics.closedProtocols),
        avgCompletionTime: calculateChange(currentMetrics.avgCompletionTime, previousMetrics.avgCompletionTime),
        satisfactionScore: calculateChange(currentMetrics.satisfactionScore, previousMetrics.satisfactionScore),
        slaComplianceRate: calculateChange(currentMetrics.slaComplianceRate, previousMetrics.slaComplianceRate)
      }
    };

    res.json(comparison);
  } catch (error: any) {
    console.error('Erro ao comparar períodos:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/protocol-analytics/recalculate
 * Recalcula todas as métricas para um período
 */
router.post('/recalculate', authenticateToken, async (req: Request, res: Response) => {
  try {
    const tenantId = req.user?.tenantId;
    if (!tenantId) {
      return res.status(400).json({ error: 'Tenant ID não encontrado' });
    }

    // Verificar se é admin
    if (req.user?.role !== 'ADMIN' && req.user?.role !== 'SUPER_ADMIN') {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    const {
      periodType = 'MONTHLY',
      periodDate
    } = req.body;

    const period = {
      type: periodType as 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY',
      date: periodDate ? new Date(periodDate) : new Date()
    };

    // Recalcular todas as métricas
    const [protocolMetrics, bottlenecks] = await Promise.all([
      protocolAnalyticsService.calculateProtocolMetrics({ tenantId }, period),
      protocolAnalyticsService.identifyBottlenecks({ tenantId }, period)
    ]);

    res.json({
      success: true,
      message: 'Métricas recalculadas com sucesso',
      data: {
        protocolMetrics,
        bottlenecksFound: bottlenecks.length
      }
    });
  } catch (error: any) {
    console.error('Erro ao recalcular métricas:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
