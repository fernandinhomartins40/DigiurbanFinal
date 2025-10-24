'use client';

import { useState, useEffect } from 'react';
import { Building2, Check, ChevronDown } from 'lucide-react';
import { useSuperAdminAuth } from '@/contexts/SuperAdminAuthContext';

interface Tenant {
  id: string;
  name: string;
  status: string;
  plan: string;
}

interface TenantSelectorProps {
  selectedTenantId?: string;
  onSelect: (tenantId: string) => void;
  showAllOption?: boolean;
  className?: string;
}

export function TenantSelector({
  selectedTenantId,
  onSelect,
  showAllOption = true,
  className = ''
}: TenantSelectorProps) {
  const { apiRequest } = useSuperAdminAuth();
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchTenants();
  }, []);

  const fetchTenants = async () => {
    try {
      const data = await apiRequest('/super-admin/tenants?limit=1000', {
        method: 'GET'
      });

      setTenants(data.tenants || []);
    } catch (error) {
      console.error('Error fetching tenants:', error);
    } finally {
      setLoading(false);
    }
  };

  const selectedTenant = tenants.find(t => t.id === selectedTenantId);
  const filteredTenants = tenants.filter(t =>
    t.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-3 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:border-gray-400 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Building2 size={18} className="text-gray-500" />
          <span className="text-sm font-medium text-gray-700">
            {loading ? 'Carregando...' : selectedTenant ? selectedTenant.name : 'Todos os Tenants'}
          </span>
        </div>
        <ChevronDown size={18} className={`text-gray-500 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setOpen(false)}
          />
          <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-20 max-h-96 overflow-hidden">
            <div className="p-3 border-b border-gray-200">
              <input
                type="text"
                placeholder="Buscar tenant..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                onClick={(e) => e.stopPropagation()}
              />
            </div>

            <div className="overflow-y-auto max-h-80">
              {showAllOption && (
                <button
                  onClick={() => {
                    onSelect('');
                    setOpen(false);
                  }}
                  className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors"
                >
                  <span className="text-sm font-medium text-gray-700">Todos os Tenants</span>
                  {!selectedTenantId && <Check size={16} className="text-blue-600" />}
                </button>
              )}

              {filteredTenants.map((tenant) => (
                <button
                  key={tenant.id}
                  onClick={() => {
                    onSelect(tenant.id);
                    setOpen(false);
                  }}
                  className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors border-t border-gray-100"
                >
                  <div className="flex items-center gap-3">
                    <div>
                      <div className="text-sm font-medium text-gray-900 text-left">{tenant.name}</div>
                      <div className="text-xs text-gray-500 flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                          tenant.status === 'ACTIVE' ? 'bg-green-100 text-green-700' :
                          tenant.status === 'TRIAL' ? 'bg-blue-100 text-blue-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {tenant.status}
                        </span>
                        <span>{tenant.plan}</span>
                      </div>
                    </div>
                  </div>
                  {selectedTenantId === tenant.id && (
                    <Check size={16} className="text-blue-600" />
                  )}
                </button>
              ))}

              {filteredTenants.length === 0 && (
                <div className="px-4 py-8 text-center text-sm text-gray-500">
                  Nenhum tenant encontrado
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
