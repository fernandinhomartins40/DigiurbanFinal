'use client';

import { useState, useEffect, useRef } from 'react';
import { Building2, Search, Check, X } from 'lucide-react';
import { useSuperAdminAuth } from '@/contexts/SuperAdminAuthContext';

interface Tenant {
  id: string;
  name: string;
  nomeMunicipio?: string;
  ufMunicipio?: string;
  status: string;
  plan: string;
}

interface TenantAutocompleteProps {
  selectedTenantId?: string;
  onSelect: (tenantId: string) => void;
  onClear?: () => void;
  placeholder?: string;
  disabled?: boolean;
  showClearButton?: boolean;
}

export function TenantAutocomplete({
  selectedTenantId,
  onSelect,
  onClear,
  placeholder = 'Digite para buscar tenant...',
  disabled = false,
  showClearButton = true,
}: TenantAutocompleteProps) {
  const { apiRequest } = useSuperAdminAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Buscar tenant selecionado inicialmente
  useEffect(() => {
    if (selectedTenantId && !selectedTenant) {
      fetchTenantById(selectedTenantId);
    }
  }, [selectedTenantId]);

  // Buscar tenants quando o usuário digita
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (searchTerm.length >= 2) {
        searchTenants(searchTerm);
      } else if (searchTerm.length === 0) {
        searchTenants(''); // Buscar todos se vazio
      }
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  const fetchTenantById = async (tenantId: string) => {
    try {
      const data = await apiRequest(`/super-admin/tenants/${tenantId}`);
      if (data.tenant) {
        setSelectedTenant(data.tenant);
      }
    } catch (error) {
      console.error('Error fetching tenant:', error);
    }
  };

  const searchTenants = async (query: string) => {
    setLoading(true);
    try {
      const data = await apiRequest(`/super-admin/tenants/search?q=${encodeURIComponent(query)}&limit=20`);
      setTenants(data.tenants || []);
      setShowDropdown(true);
    } catch (error) {
      console.error('Error searching tenants:', error);
      setTenants([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectTenant = (tenant: Tenant) => {
    setSelectedTenant(tenant);
    onSelect(tenant.id);
    setShowDropdown(false);
    setSearchTerm('');
  };

  const handleClear = () => {
    setSelectedTenant(null);
    setSearchTerm('');
    setTenants([]);
    if (onClear) {
      onClear();
    }
  };

  const getTenantDisplayName = (tenant: Tenant) => {
    if (tenant.nomeMunicipio && tenant.ufMunicipio) {
      return `${tenant.nomeMunicipio} - ${tenant.ufMunicipio}`;
    }
    return tenant.name;
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; color: string }> = {
      ACTIVE: { label: 'Ativo', color: 'bg-green-100 text-green-800' },
      TRIAL: { label: 'Trial', color: 'bg-yellow-100 text-yellow-800' },
      SUSPENDED: { label: 'Suspenso', color: 'bg-red-100 text-red-800' },
      CANCELLED: { label: 'Cancelado', color: 'bg-gray-100 text-gray-800' },
    };
    return statusMap[status] || { label: status, color: 'bg-gray-100 text-gray-800' };
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Campo selecionado ou input de busca */}
      {selectedTenant ? (
        <div className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white flex items-center justify-between">
          <div className="flex items-center gap-2 flex-1">
            <Building2 size={18} className="text-blue-600" />
            <div>
              <div className="font-medium text-gray-900">{getTenantDisplayName(selectedTenant)}</div>
              <div className="text-xs text-gray-500">{selectedTenant.name}</div>
            </div>
          </div>
          {showClearButton && !disabled && (
            <button
              onClick={handleClear}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
              title="Limpar seleção"
            >
              <X size={16} className="text-gray-500" />
            </button>
          )}
        </div>
      ) : (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            ref={inputRef}
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => {
              if (tenants.length > 0 || searchTerm.length === 0) {
                searchTenants(searchTerm);
              }
            }}
            placeholder={placeholder}
            disabled={disabled}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
          {loading && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
            </div>
          )}
        </div>
      )}

      {/* Dropdown de resultados */}
      {showDropdown && !selectedTenant && tenants.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-80 overflow-y-auto">
          {tenants.map((tenant) => {
            const statusBadge = getStatusBadge(tenant.status);
            return (
              <button
                key={tenant.id}
                onClick={() => handleSelectTenant(tenant)}
                className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2 flex-1">
                    <Building2 size={18} className="text-blue-600 mt-1 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">
                        {getTenantDisplayName(tenant)}
                      </div>
                      {tenant.name !== getTenantDisplayName(tenant) && (
                        <div className="text-sm text-gray-600">{tenant.name}</div>
                      )}
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${statusBadge.color}`}>
                          {statusBadge.label}
                        </span>
                        <span className="text-xs text-gray-500">{tenant.plan}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Nenhum resultado encontrado */}
      {showDropdown && !selectedTenant && searchTerm.length >= 2 && tenants.length === 0 && !loading && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg p-4 text-center text-gray-500">
          Nenhum tenant encontrado
        </div>
      )}
    </div>
  );
}
