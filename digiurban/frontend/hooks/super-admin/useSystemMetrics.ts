'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSuperAdminAuth } from '@/contexts/SuperAdminAuthContext';

interface SystemMetric {
  id: string;
  metricCategory: string;
  metricName: string;
  currentValue: number;
  maxValue?: number;
  unit?: string;
  thresholdWarn?: number;
  thresholdCrit?: number;
  recordedAt: string;
}

interface ServiceStatus {
  id: string;
  serviceName: string;
  status: 'operational' | 'degraded' | 'outage';
  responseTimeMs?: number;
  uptimePercentage?: number;
  lastCheck: string;
  errorMessage?: string;
}

interface SystemAlert {
  id: string;
  type: 'critical' | 'warning' | 'info';
  category: string;
  title: string;
  message: string;
  status: 'active' | 'resolved' | 'acknowledged';
  createdAt: string;
}

interface UseSystemMetricsReturn {
  metrics: SystemMetric[];
  services: ServiceStatus[];
  alerts: SystemAlert[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  acknowledgeAlert: (id: string) => Promise<boolean>;
  resolveAlert: (id: string) => Promise<boolean>;
}

export function useSystemMetrics(autoRefresh: boolean = false, interval: number = 30000): UseSystemMetricsReturn {
  const { apiRequest } = useSuperAdminAuth();
  const [metrics, setMetrics] = useState<SystemMetric[]>([]);
  const [services, setServices] = useState<ServiceStatus[]>([]);
  const [alerts, setAlerts] = useState<SystemAlert[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSystemMetrics = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch all data in parallel
      const [metricsData, servicesData, alertsData] = await Promise.all([
        apiRequest('/super-admin/system/metrics', { method: 'GET' }).catch(() => ({ metrics: [] })),
        apiRequest('/super-admin/monitoring/services', { method: 'GET' }).catch(() => ({ services: [] })),
        apiRequest('/super-admin/monitoring/alerts', { method: 'GET' }).catch(() => ({ alerts: [] }))
      ]);

      setMetrics(metricsData.metrics || []);
      setServices(servicesData.services || []);
      setAlerts(alertsData.alerts || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao buscar métricas');
      console.error('Error fetching system metrics:', err);
    } finally {
      setLoading(false);
    }
  }, [apiRequest]);

  const acknowledgeAlert = async (id: string): Promise<boolean> => {
    try {
      await apiRequest(`/super-admin/monitoring/alerts/${id}/acknowledge`, {
        method: 'POST'
      });

      await fetchSystemMetrics(); // Refresh
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao reconhecer alerta');
      return false;
    }
  };

  const resolveAlert = async (id: string): Promise<boolean> => {
    try {
      await apiRequest(`/super-admin/monitoring/alerts/${id}/resolve`, {
        method: 'POST'
      });

      await fetchSystemMetrics(); // Refresh
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao resolver alerta');
      return false;
    }
  };

  useEffect(() => {
    fetchSystemMetrics();

    if (autoRefresh) {
      const intervalId = setInterval(fetchSystemMetrics, interval);
      return () => clearInterval(intervalId);
    }
  }, [autoRefresh, interval, fetchSystemMetrics]);

  return {
    metrics,
    services,
    alerts,
    loading,
    error,
    refetch: fetchSystemMetrics,
    acknowledgeAlert,
    resolveAlert
  };
}
