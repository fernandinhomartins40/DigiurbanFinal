import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/services/api';

export interface AgricultureStats {
  producers: {
    total: number;
    active: number;
    inactive: number;
    newThisMonth: number;
  };
  properties: {
    total: number;
    active: number;
    totalArea: number;
    withIrrigation: number;
  };
  technicalAssistance: {
    pending: number;
    scheduled: number;
    inProgress: number;
    completedThisMonth: number;
    totalActive: number;
  };
  protocols: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
    thisMonth: number;
  };
  seedDistribution: {
    activeRequests: number;
    completedThisMonth: number;
    totalKgDistributed: number;
  };
  soilAnalysis: {
    pending: number;
    inProgress: number;
    completedThisMonth: number;
  };
  farmerMarket: {
    activeStands: number;
    totalFarmers: number;
  };
}

export interface AgricultureStatsResponse {
  data: AgricultureStats;
  success: boolean;
}

export function useAgricultureStats() {
  return useQuery<AgricultureStatsResponse>({
    queryKey: ['agriculture-stats'],
    queryFn: async () => {
      const response = await api.get('/admin/secretarias/agricultura/stats');
      return response.data;
    },
    staleTime: 2 * 60 * 1000, // 2 minutos
    refetchInterval: 5 * 60 * 1000, // Atualiza a cada 5 minutos
  });
}
