'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSuperAdminAuth } from '@/contexts/SuperAdminAuthContext';

interface AuditLogEntry {
  id: string;
  adminUserId: string;
  adminUser: {
    name: string;
    email: string;
  };
  action: string;
  resourceType?: string;
  resourceId?: string;
  oldValues?: any;
  newValues?: any;
  ipAddress?: string;
  userAgent?: string;
  success: boolean;
  errorMessage?: string;
  createdAt: string;
}

interface UseAuditLogOptions {
  tenantId?: string;
  adminUserId?: string;
  action?: string;
  resourceType?: string;
  success?: boolean;
  limit?: number;
  autoFetch?: boolean;
}

interface UseAuditLogReturn {
  logs: AuditLogEntry[];
  loading: boolean;
  error: string | null;
  total: number;
  refetch: () => Promise<void>;
  exportLogs: (format: 'json' | 'csv') => Promise<void>;
}

export function useAuditLog(options: UseAuditLogOptions = {}): UseAuditLogReturn {
  const {
    tenantId,
    adminUserId,
    action,
    resourceType,
    success,
    limit = 50,
    autoFetch = true
  } = options;

  const { apiRequest } = useSuperAdminAuth();
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  const fetchAuditLog = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();

      if (tenantId) params.append('tenantId', tenantId);
      if (adminUserId) params.append('adminUserId', adminUserId);
      if (action) params.append('action', action);
      if (resourceType) params.append('resourceType', resourceType);
      if (success !== undefined) params.append('success', success.toString());
      params.append('limit', limit.toString());

      const data = await apiRequest(`/super-admin/audit-log?${params}`, {
        method: 'GET'
      });

      setLogs(data.logs || []);
      setTotal(data.total || data.logs?.length || 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      console.error('Error fetching audit log:', err);
    } finally {
      setLoading(false);
    }
  }, [tenantId, adminUserId, action, resourceType, success, limit, apiRequest]);

  const exportLogs = async (format: 'json' | 'csv'): Promise<void> => {
    try {
      const params = new URLSearchParams();

      if (tenantId) params.append('tenantId', tenantId);
      if (adminUserId) params.append('adminUserId', adminUserId);
      if (action) params.append('action', action);
      if (resourceType) params.append('resourceType', resourceType);
      if (success !== undefined) params.append('success', success.toString());
      params.append('format', format);

      // Note: For blob downloads, we need to use fetch with proper handling
      const { getFullApiUrl } = await import('@/lib/api-config');
      const url = getFullApiUrl(`/super-admin/audit-log/export?${params}`);
      const response = await fetch(url, {
        credentials: 'include', // Send cookies
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Erro ao exportar logs');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `audit-log-${new Date().toISOString()}.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao exportar logs');
    }
  };

  useEffect(() => {
    if (autoFetch) {
      fetchAuditLog();
    }
  }, [autoFetch, fetchAuditLog]);

  return {
    logs,
    loading,
    error,
    total,
    refetch: fetchAuditLog,
    exportLogs
  };
}

// Hook para estatísticas de auditoria
export function useAuditStats() {
  const { apiRequest } = useSuperAdminAuth();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await apiRequest('/super-admin/audit-log/stats', {
        method: 'GET'
      });

      setStats(data.stats);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      console.error('Error fetching audit stats:', err);
    } finally {
      setLoading(false);
    }
  }, [apiRequest]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    stats,
    loading,
    error,
    refetch: fetchStats
  };
}
