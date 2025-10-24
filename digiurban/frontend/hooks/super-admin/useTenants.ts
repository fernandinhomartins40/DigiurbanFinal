'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSuperAdminAuth } from '@/contexts/SuperAdminAuthContext';

interface Tenant {
  id: string;
  name: string;
  cnpj: string;
  plan: string;
  status: string;
  domain?: string;
  population?: number;
  createdAt: string;
  _count?: {
    users: number;
    protocols: number;
    services: number;
    citizens: number;
    invoices: number;
  };
}

interface UseTenantsOptions {
  status?: string;
  plan?: string;
  search?: string;
  limit?: number;
  autoFetch?: boolean;
}

interface UseTenantsReturn {
  tenants: Tenant[];
  loading: boolean;
  error: string | null;
  total: number;
  refetch: () => Promise<void>;
  createTenant: (data: any) => Promise<Tenant | null>;
  updateTenant: (id: string, data: any) => Promise<Tenant | null>;
  deleteTenant: (id: string) => Promise<boolean>;
  softDeleteTenant: (id: string) => Promise<boolean>;
  hardDeleteTenant: (id: string, confirmPassword: string) => Promise<boolean>;
  reactivateTenant: (id: string) => Promise<boolean>;
  suspendTenant: (id: string) => Promise<boolean>;
  activateTenant: (id: string) => Promise<boolean>;
}

export function useTenants(options: UseTenantsOptions = {}): UseTenantsReturn {
  const {
    status,
    plan,
    search,
    limit = 50,
    autoFetch = true
  } = options;

  const { apiRequest } = useSuperAdminAuth();
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  const fetchTenants = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();

      if (status) params.append('status', status);
      if (plan) params.append('plan', plan);
      if (search) params.append('search', search);
      params.append('limit', limit.toString());

      const data = await apiRequest(`/super-admin/tenants?${params}`, {
        method: 'GET'
      });

      setTenants(data.tenants || []);
      setTotal(data.total || data.tenants?.length || 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      console.error('Error fetching tenants:', err);
    } finally {
      setLoading(false);
    }
  }, [status, plan, search, limit, apiRequest]);

  const createTenant = async (data: any): Promise<Tenant | null> => {
    try {
      // Token gerenciado pelo Context
      const result = await apiRequest('/super-admin/tenants', {
        method: 'POST',
        body: JSON.stringify(data)
      });
      await fetchTenants(); // Refresh list
      return result.tenant;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar tenant');
      return null;
    }
  };

  const updateTenant = async (id: string, data: any): Promise<Tenant | null> => {
    try {
      // Token gerenciado pelo Context
      const result = await apiRequest(`/super-admin/tenants/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      });
      await fetchTenants(); // Refresh list
      return result.tenant;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar tenant');
      return null;
    }
  };

  const deleteTenant = async (id: string): Promise<boolean> => {
    try {
      // Soft delete por padrão (desativa mas preserva dados)
      await apiRequest(`/super-admin/tenants/${id}`, {
        method: 'DELETE'
      });

      await fetchTenants(); // Refresh list
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao desativar tenant');
      return false;
    }
  };

  const softDeleteTenant = async (id: string): Promise<boolean> => {
    try {
      await apiRequest(`/super-admin/tenants/${id}/soft-delete`, {
        method: 'POST'
      });

      await fetchTenants(); // Refresh list
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao desativar tenant');
      return false;
    }
  };

  const hardDeleteTenant = async (id: string, confirmPassword: string): Promise<boolean> => {
    try {
      await apiRequest(`/super-admin/tenants/${id}/hard-delete?confirmPassword=${confirmPassword}`, {
        method: 'DELETE'
      });

      await fetchTenants(); // Refresh list
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao excluir permanentemente tenant');
      return false;
    }
  };

  const reactivateTenant = async (id: string): Promise<boolean> => {
    try {
      await apiRequest(`/super-admin/tenants/${id}/reactivate`, {
        method: 'POST'
      });

      await fetchTenants(); // Refresh list
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao reativar tenant');
      return false;
    }
  };

  const suspendTenant = async (id: string): Promise<boolean> => {
    return await updateTenant(id, { status: 'SUSPENDED' }) !== null;
  };

  const activateTenant = async (id: string): Promise<boolean> => {
    return await updateTenant(id, { status: 'ACTIVE' }) !== null;
  };

  useEffect(() => {
    if (autoFetch) {
      fetchTenants();
    }
  }, [autoFetch, fetchTenants]);

  return {
    tenants,
    loading,
    error,
    total,
    refetch: fetchTenants,
    createTenant,
    updateTenant,
    deleteTenant,
    softDeleteTenant,
    hardDeleteTenant,
    reactivateTenant,
    suspendTenant,
    activateTenant
  };
}
