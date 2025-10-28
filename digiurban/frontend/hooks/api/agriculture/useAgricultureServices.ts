import { useQuery } from '@tanstack/react-query';
import { useAdminAuth } from '@/contexts/AdminAuthContext';

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
  const { apiRequest } = useAdminAuth();

  return useQuery<AgricultureServicesResponse>({
    queryKey: ['agriculture-services'],
    queryFn: async () => {
      const response = await apiRequest('/services?departmentCode=AGRICULTURA');
      return response;
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
}
