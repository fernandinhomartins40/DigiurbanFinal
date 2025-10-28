import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/services/api';

export interface AgricultureService {
  id: string;
  name: string;
  description: string | null;
  category: string | null;
  departmentId: string;
  requiresDocuments: boolean;
  estimatedDays: number | null;
  priority: number;
  isActive: boolean;
  moduleType: string | null;
  moduleEntity: string | null;
  icon?: string;
  color?: string;
}

export interface AgricultureServicesResponse {
  data: AgricultureService[];
  success: boolean;
}

export function useAgricultureServices() {
  return useQuery<AgricultureServicesResponse>({
    queryKey: ['agriculture-services'],
    queryFn: async () => {
      const response = await api.get('/services?departmentCode=AGRICULTURA');
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
}
