'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Building2, Globe, Loader2 } from 'lucide-react';
import { useSuperAdminAuth } from '@/contexts/SuperAdminAuthContext';
import { useToast } from '@/hooks/use-toast';
import { useConfirmDialog } from '@/hooks/use-confirm-dialog';

interface TenantData {
  id: string;
  name: string;
  cnpj: string;
  domain?: string;
  plan: 'STARTER' | 'PROFESSIONAL' | 'ENTERPRISE';
  status: 'ACTIVE' | 'TRIAL' | 'SUSPENDED' | 'INACTIVE' | 'CANCELLED';
  population?: number;
  billing?: any;
  limits?: any;
  _count?: {
    users: number;
    protocols: number;
    citizens: number;
    services: number;
  };
}

const PLANS = [
  { id: 'STARTER', name: 'Starter', price: 2500 },
  { id: 'PROFESSIONAL', name: 'Professional', price: 5000 },
  { id: 'ENTERPRISE', name: 'Enterprise', price: 10000 }
];

const STATUS_OPTIONS = [
  { value: 'ACTIVE', label: 'Ativo', color: 'green' },
  { value: 'TRIAL', label: 'Trial', color: 'yellow' },
  { value: 'SUSPENDED', label: 'Suspenso', color: 'red' },
  { value: 'INACTIVE', label: 'Inativo', color: 'gray' },
  { value: 'CANCELLED', label: 'Cancelado', color: 'red' }
];

export default function EditTenantPage() {
  const router = useRouter();
  const params = useParams();
  const tenantId = params.id as string;
  const { toast } = useToast();
  const { confirm, ConfirmDialog } = useConfirmDialog();
  const { apiRequest } = useSuperAdminAuth();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [tenant, setTenant] = useState<TenantData | null>(null);
  const [formData, setFormData] = useState<Partial<TenantData>>({});

  useEffect(() => {
    loadTenant();
  }, [tenantId]);

  const loadTenant = async () => {
    setLoading(true);
    try {
      const data = await apiRequest(`/super-admin/tenants/${tenantId}`, {
        method: 'GET'
      });

      if (data.success && data.tenant) {
        setTenant(data.tenant);
        setFormData({
          name: data.tenant.name,
          domain: data.tenant.domain || '',
          plan: data.tenant.plan,
          status: data.tenant.status,
          population: data.tenant.population || 0,
        });
      }
    } catch (error) {
      console.error('Erro ao carregar tenant:', error);
      toast({
        title: 'Erro ao carregar tenant',
        description: 'Não foi possível carregar os dados do tenant.',
        variant: 'destructive',
      });
      router.push('/super-admin/tenants');
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field: keyof TenantData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name) {
      toast({
        title: 'Campo obrigatório',
        description: 'O nome do tenant é obrigatório.',
        variant: 'destructive',
      });
      return;
    }

    const confirmed = await confirm({
      title: 'Salvar alterações',
      description: `Deseja salvar as alterações do tenant "${formData.name}"?`,
      confirmText: 'Salvar',
    });

    if (!confirmed) return;

    setSaving(true);

    try {
      const result = await apiRequest(`/super-admin/tenants/${tenantId}`, {
        method: 'PUT',
        body: JSON.stringify({
          name: formData.name,
          domain: formData.domain,
          plan: formData.plan,
          status: formData.status,
          population: formData.population,
        })
      });

      if (result.success) {
        toast({
          title: 'Tenant atualizado',
          description: 'As alterações foram salvas com sucesso.',
        });
        router.push('/super-admin/tenants');
      }
    } catch (error: any) {
      console.error('Erro ao atualizar tenant:', error);
      toast({
        title: 'Erro ao atualizar tenant',
        description: error.message || 'Erro desconhecido',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const formatCNPJ = (cnpj: string) => {
    return cnpj
      .replace(/\D/g, '')
      .replace(/^(\d{2})(\d)/, '$1.$2')
      .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
      .replace(/\.(\d{3})(\d)/, '.$1/$2')
      .replace(/(\d{4})(\d)/, '$1-$2')
      .slice(0, 18);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 size={48} className="mx-auto text-blue-600 animate-spin mb-4" />
          <p className="text-gray-600">Carregando dados do tenant...</p>
        </div>
      </div>
    );
  }

  if (!tenant) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Building2 size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-600">Tenant não encontrado</p>
          <Link
            href="/super-admin/tenants"
            className="text-blue-600 hover:text-blue-800 mt-4 inline-block"
          >
            Voltar para lista
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/super-admin/tenants"
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft size={24} className="text-gray-600" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Editar Tenant</h1>
          <p className="text-gray-600">Atualize os dados do município</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="space-y-6">
          {/* Dados Básicos */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
              <Building2 className="text-blue-600" size={24} />
              <div>
                <h2 className="text-xl font-bold text-gray-900">Dados Básicos</h2>
                <p className="text-sm text-gray-600">Informações principais do tenant</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome do Tenant *
                </label>
                <input
                  type="text"
                  value={formData.name || ''}
                  onChange={(e) => updateField('name', e.target.value)}
                  placeholder="Ex: Prefeitura de São Paulo"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CNPJ
                </label>
                <input
                  type="text"
                  value={formatCNPJ(tenant.cnpj)}
                  disabled
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                />
                <p className="text-xs text-gray-500 mt-1">CNPJ não pode ser alterado</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  População
                </label>
                <input
                  type="number"
                  value={formData.population || 0}
                  onChange={(e) => updateField('population', parseInt(e.target.value) || 0)}
                  placeholder="Ex: 12000000"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Domínio Personalizado
                </label>
                <div className="flex items-center gap-2">
                  <Globe size={20} className="text-gray-400" />
                  <input
                    type="text"
                    value={formData.domain || ''}
                    onChange={(e) => updateField('domain', e.target.value)}
                    placeholder="saopaulo.digiurban.com.br"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Configuração */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Configuração</h2>
                <p className="text-sm text-gray-600">Plano e status do tenant</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Plano *
                </label>
                <select
                  value={formData.plan}
                  onChange={(e) => updateField('plan', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  {PLANS.map((plan) => (
                    <option key={plan.id} value={plan.id}>
                      {plan.name} - R$ {plan.price.toLocaleString('pt-BR')}/mês
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status *
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => updateField('status', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  {STATUS_OPTIONS.map((status) => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Informações de Contagem */}
          {tenant._count && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-3">📊 Estatísticas</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-blue-600">Usuários</p>
                  <p className="text-2xl font-bold text-blue-900">{tenant._count.users}</p>
                </div>
                <div>
                  <p className="text-blue-600">Protocolos</p>
                  <p className="text-2xl font-bold text-blue-900">{tenant._count.protocols}</p>
                </div>
                <div>
                  <p className="text-blue-600">Cidadãos</p>
                  <p className="text-2xl font-bold text-blue-900">{tenant._count.citizens}</p>
                </div>
                <div>
                  <p className="text-blue-600">Serviços</p>
                  <p className="text-2xl font-bold text-blue-900">{tenant._count.services}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="flex justify-between items-center pt-6 border-t border-gray-200 mt-8">
          <Link
            href="/super-admin/tenants"
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
          >
            Cancelar
          </Link>

          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-8 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Salvando...
              </>
            ) : (
              <>
                <Save size={20} />
                Salvar Alterações
              </>
            )}
          </button>
        </div>
      </form>
      <ConfirmDialog />
    </div>
  );
}
