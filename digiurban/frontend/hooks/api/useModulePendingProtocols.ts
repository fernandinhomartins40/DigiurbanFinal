/**
 * Hook para buscar protocolos pendentes de um módulo específico
 * Usado nas páginas de módulos das secretarias
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAdminAuth } from '@/contexts/AdminAuthContext';

interface Protocol {
  id: string;
  number: string;
  title: string;
  description?: string;
  status: string;
  moduleType: string;
  customData: any;
  createdAt: string;
  citizen: {
    id: string;
    name: string;
    email?: string;
    phone?: string;
    cpf: string;
  };
  service: {
    id: string;
    name: string;
    serviceType: string;
    moduleType: string;
  };
}

interface PendingProtocolsResponse {
  success: boolean;
  data: Protocol[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

/**
 * Hook para buscar protocolos pendentes de um módulo
 */
export function useModulePendingProtocols(moduleType: string, page = 1, limit = 20) {
  const { token } = useAdminAuth();

  return useQuery<PendingProtocolsResponse>({
    queryKey: ['module-pending-protocols', moduleType, page, limit],
    queryFn: async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/protocols-simplified/module/${moduleType}/pending?page=${page}&limit=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Erro ao buscar protocolos pendentes');
      }

      return response.json();
    },
    enabled: !!token && !!moduleType,
  });
}

/**
 * Hook para aprovar protocolo
 */
export function useApproveProtocol() {
  const { token } = useAdminAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      protocolId,
      comment,
      additionalData,
    }: {
      protocolId: string;
      comment?: string;
      additionalData?: any;
    }) => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/protocols-simplified/${protocolId}/approve`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ comment, additionalData }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erro ao aprovar protocolo');
      }

      return response.json();
    },
    onSuccess: () => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['module-pending-protocols'] });
      queryClient.invalidateQueries({ queryKey: ['agriculture-stats'] });
    },
  });
}

/**
 * Hook para rejeitar protocolo
 */
export function useRejectProtocol() {
  const { token } = useAdminAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      protocolId,
      reason,
    }: {
      protocolId: string;
      reason: string;
    }) => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/protocols-simplified/${protocolId}/reject`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ reason }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erro ao rejeitar protocolo');
      }

      return response.json();
    },
    onSuccess: () => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['module-pending-protocols'] });
      queryClient.invalidateQueries({ queryKey: ['agriculture-stats'] });
    },
  });
}
