import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface Department {
  id: string;
  name: string;
  description?: string;
}

export interface CitizenService {
  id: string;
  name: string;
  description: string | null;
  category: string | null;
  departmentId: string;
  department?: Department;
  requiresDocuments: boolean;
  requiredDocuments: string[] | null;
  estimatedDays: number | null;
  priority: number;
  icon: string | null;
  color: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface UseCitizenServicesResult {
  services: CitizenService[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useCitizenServices(): UseCitizenServicesResult {
  const [services, setServices] = useState<CitizenService[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchServices = async () => {
    try {
      setLoading(true);
      setError(null);

      // Determinar o tenant ID a partir do hostname
      let tenantId = 'demo';
      if (typeof window !== 'undefined') {
        const hostname = window.location.hostname;
        if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
          // Extrair subdomain como tenant ID
          const parts = hostname.split('.');
          if (parts.length > 2) {
            tenantId = parts[0];
          }
        }
      }

      // Buscar serviços ativos da tenant (rota pública)
      const response = await axios.get(`${API_URL}/citizen/services`, {
        headers: {
          'X-Tenant-ID': tenantId,
        },
      });

      setServices(response.data.services || []);
    } catch (err: any) {
      console.error('Erro ao buscar serviços:', err);
      setError(err.response?.data?.error || 'Erro ao carregar serviços');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  return {
    services,
    loading,
    error,
    refetch: fetchServices,
  };
}
