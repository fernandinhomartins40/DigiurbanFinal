'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Building2, Users, FileText, DollarSign, Activity, Calendar,
  Mail, Phone, MapPin, Globe, ArrowLeft, Edit, Trash2, Power, PauseCircle, TrendingUp
} from 'lucide-react';
import { SuperAdminCard, MetricCard, ActivityLog } from '@/components/super-admin';
import { TenantStatusBadge, PlanBadge } from '@/components/ui/status-badge';
import { LineChart } from '@/components/ui/charts';

interface TenantDetail {
  id: string;
  name: string;
  cnpj: string;
  domain?: string;
  plan: string;
  status: string;
  population?: number;
  createdAt: string;
  billing: {
    currentMrr: number;
    lifetimeValue: number;
    totalInvoices: number;
    paidInvoices: number;
    overdueInvoices: number;
    nextBillingDate: string;
  };
  usage: {
    activeUsers: number;
    totalProtocols: number;
    protocolsThisMonth: number;
    storageUsed: number;
    storageLimit: number;
    apiCalls: number;
  };
  contacts: {
    adminName: string;
    adminEmail: string;
    adminPhone?: string;
    address?: string;
    city?: string;
    state?: string;
  };
  metrics: {
    userActivity: Array<{ date: string; activeUsers: number }>;
    protocolsOverTime: Array<{ month: string; count: number }>;
  };
  recentActivity: Array<{
    id: string;
    action: string;
    user: string;
    timestamp: string;
  }>;
}

export default function TenantDetailPage() {
  const params = useParams();
  const router = useRouter();
  const tenantId = params.id as string;

  const [tenant, setTenant] = useState<TenantDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (tenantId) {
      fetchTenantDetail();
    }
  }, [tenantId]);

  const fetchTenantDetail = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('digiurban_super_admin_token');
      const response = await fetch(`http://localhost:3001/api/super-admin/tenants/${tenantId}/detail`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setTenant(data.tenant);
      }
    } catch (error) {
      console.error('Error fetching tenant detail:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSuspend = async () => {
    if (!confirm(`Tem certeza que deseja suspender o tenant ${tenant?.name}?`)) return;

    try {
      const token = localStorage.getItem('digiurban_super_admin_token');
      const response = await fetch(`http://localhost:3001/api/super-admin/tenants/${tenantId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: 'SUSPENDED' })
      });

      if (response.ok) {
        alert('✅ Tenant suspenso com sucesso');
        fetchTenantDetail();
      }
    } catch (error) {
      console.error('Error suspending tenant:', error);
      alert('❌ Erro ao suspender tenant');
    }
  };

  const handleActivate = async () => {
    try {
      const token = localStorage.getItem('digiurban_super_admin_token');
      const response = await fetch(`http://localhost:3001/api/super-admin/tenants/${tenantId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: 'ACTIVE' })
      });

      if (response.ok) {
        alert('✅ Tenant ativado com sucesso');
        fetchTenantDetail();
      }
    } catch (error) {
      console.error('Error activating tenant:', error);
      alert('❌ Erro ao ativar tenant');
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando detalhes do tenant...</p>
        </div>
      </div>
    );
  }

  if (!tenant) {
    return (
      <div className="text-center py-12">
        <Building2 size={48} className="mx-auto text-gray-300 mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Tenant não encontrado</h2>
        <p className="text-gray-600 mb-6">O tenant que você está procurando não existe ou foi removido</p>
        <Link
          href="/super-admin/tenants"
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <ArrowLeft size={20} />
          Voltar para Tenants
        </Link>
      </div>
    );
  }

  const storagePercentage = (tenant.usage.storageUsed / tenant.usage.storageLimit) * 100;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <Link
            href="/super-admin/tenants"
            className="mt-1 p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={24} className="text-gray-600" />
          </Link>
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
              <Building2 size={32} className="text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{tenant.name}</h1>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <span>CNPJ: {tenant.cnpj}</span>
                <span>•</span>
                <TenantStatusBadge status={tenant.status} />
                <span>•</span>
                <PlanBadge plan={tenant.plan} />
                {tenant.domain && (
                  <>
                    <span>•</span>
                    <a
                      href={`https://${tenant.domain}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
                    >
                      <Globe size={14} />
                      {tenant.domain}
                    </a>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Edit size={18} />
            Editar
          </button>
          {tenant.status === 'ACTIVE' ? (
            <button
              onClick={handleSuspend}
              className="flex items-center gap-2 px-4 py-2 border border-orange-300 text-orange-600 rounded-lg hover:bg-orange-50 transition-colors"
            >
              <PauseCircle size={18} />
              Suspender
            </button>
          ) : (
            <button
              onClick={handleActivate}
              className="flex items-center gap-2 px-4 py-2 border border-green-300 text-green-600 rounded-lg hover:bg-green-50 transition-colors"
            >
              <Power size={18} />
              Ativar
            </button>
          )}
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard
          title="MRR Atual"
          value={formatCurrency(tenant.billing.currentMrr)}
          icon={<DollarSign size={24} />}
          color="green"
          subtitle="Receita mensal"
        />
        <MetricCard
          title="Lifetime Value"
          value={formatCurrency(tenant.billing.lifetimeValue)}
          icon={<TrendingUp size={24} />}
          color="blue"
          subtitle="Valor total gerado"
        />
        <MetricCard
          title="Usuários Ativos"
          value={tenant.usage.activeUsers}
          icon={<Users size={24} />}
          color="purple"
          subtitle={`de ${tenant.usage.activeUsers} cadastrados`}
        />
        <MetricCard
          title="Protocolos"
          value={tenant.usage.totalProtocols}
          icon={<FileText size={24} />}
          color="yellow"
          subtitle={`${tenant.usage.protocolsThisMonth} este mês`}
        />
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Billing Info */}
          <SuperAdminCard title="Informações de Cobrança">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <div className="text-sm text-gray-600 mb-1">Total de Faturas</div>
                <div className="text-2xl font-bold text-gray-900">{tenant.billing.totalInvoices}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1">Faturas Pagas</div>
                <div className="text-2xl font-bold text-green-600">{tenant.billing.paidInvoices}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1">Faturas Vencidas</div>
                <div className="text-2xl font-bold text-red-600">{tenant.billing.overdueInvoices}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1">Próximo Billing</div>
                <div className="text-lg font-semibold text-gray-900">
                  {formatDate(tenant.billing.nextBillingDate)}
                </div>
              </div>
            </div>
            <div className="mt-6 pt-6 border-t border-gray-200">
              <Link
                href={`/super-admin/billing/invoices?tenant=${tenantId}`}
                className="text-blue-600 hover:text-blue-800 font-medium text-sm"
              >
                Ver todas as faturas →
              </Link>
            </div>
          </SuperAdminCard>

          {/* Usage Metrics */}
          <SuperAdminCard title="Métricas de Uso">
            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Armazenamento</span>
                  <span className="text-sm text-gray-600">
                    {formatBytes(tenant.usage.storageUsed)} / {formatBytes(tenant.usage.storageLimit)}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full ${
                      storagePercentage >= 90 ? 'bg-red-500' :
                      storagePercentage >= 70 ? 'bg-yellow-500' :
                      'bg-green-500'
                    }`}
                    style={{ width: `${Math.min(storagePercentage, 100)}%` }}
                  />
                </div>
                <div className="text-xs text-gray-500 mt-1">{storagePercentage.toFixed(1)}% utilizado</div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                <div>
                  <div className="text-sm text-gray-600 mb-1">API Calls (este mês)</div>
                  <div className="text-2xl font-bold text-gray-900">
                    {tenant.usage.apiCalls.toLocaleString('pt-BR')}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-1">Protocolos Processados</div>
                  <div className="text-2xl font-bold text-gray-900">
                    {tenant.usage.protocolsThisMonth}
                  </div>
                </div>
              </div>
            </div>
          </SuperAdminCard>

          {/* Activity Chart */}
          <SuperAdminCard title="Atividade de Usuários (últimos 30 dias)">
            <LineChart
              data={tenant.metrics.userActivity.map(item => ({
                label: new Date(item.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
                value: item.activeUsers
              }))}
              color="hsl(217, 91%, 60%)"
              height={250}
            />
          </SuperAdminCard>

          {/* Protocols Over Time */}
          <SuperAdminCard title="Protocolos ao Longo do Tempo">
            <LineChart
              data={tenant.metrics.protocolsOverTime.map(item => ({
                label: item.month,
                value: item.count
              }))}
              color="hsl(142, 71%, 45%)"
              height={250}
            />
          </SuperAdminCard>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Contact Info */}
          <SuperAdminCard title="Informações de Contato">
            <div className="space-y-4">
              <div>
                <div className="text-xs text-gray-500 mb-1">Administrador</div>
                <div className="font-semibold text-gray-900">{tenant.contacts.adminName}</div>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Mail size={16} className="text-gray-400" />
                <a href={`mailto:${tenant.contacts.adminEmail}`} className="text-blue-600 hover:text-blue-800">
                  {tenant.contacts.adminEmail}
                </a>
              </div>
              {tenant.contacts.adminPhone && (
                <div className="flex items-center gap-2 text-sm">
                  <Phone size={16} className="text-gray-400" />
                  <span className="text-gray-700">{tenant.contacts.adminPhone}</span>
                </div>
              )}
              {tenant.contacts.address && (
                <div className="flex items-start gap-2 text-sm pt-3 border-t border-gray-200">
                  <MapPin size={16} className="text-gray-400 mt-1" />
                  <div className="text-gray-700">
                    <div>{tenant.contacts.address}</div>
                    <div>{tenant.contacts.city}, {tenant.contacts.state}</div>
                  </div>
                </div>
              )}
            </div>
          </SuperAdminCard>

          {/* Quick Stats */}
          <SuperAdminCard title="Estatísticas Rápidas">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">População</span>
                <span className="font-semibold text-gray-900">
                  {tenant.population?.toLocaleString('pt-BR') || 'N/A'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Cliente desde</span>
                <span className="font-semibold text-gray-900">{formatDate(tenant.createdAt)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Tempo ativo</span>
                <span className="font-semibold text-gray-900">
                  {Math.floor((new Date().getTime() - new Date(tenant.createdAt).getTime()) / (1000 * 60 * 60 * 24 * 30))} meses
                </span>
              </div>
            </div>
          </SuperAdminCard>

          {/* Recent Activity */}
          <ActivityLog
            tenantId={tenantId}
            limit={10}
            className="h-[400px]"
          />

          {/* Quick Actions */}
          <SuperAdminCard title="Ações Rápidas">
            <div className="space-y-2">
              <button className="w-full px-4 py-2 text-left text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                📧 Enviar Email
              </button>
              <button className="w-full px-4 py-2 text-left text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                📊 Gerar Relatório
              </button>
              <button className="w-full px-4 py-2 text-left text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                💳 Criar Fatura Manual
              </button>
              <button className="w-full px-4 py-2 text-left text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                👥 Gerenciar Usuários
              </button>
              <button className="w-full px-4 py-2 text-left text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                🗑️ Deletar Tenant
              </button>
            </div>
          </SuperAdminCard>
        </div>
      </div>
    </div>
  );
}
