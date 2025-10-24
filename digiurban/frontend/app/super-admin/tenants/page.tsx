'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Building2, Plus, Search, Filter, Download, Users, FileText, DollarSign, Eye, Edit2, Trash2, MoreVertical } from 'lucide-react';
import { useTenants } from '@/hooks/super-admin';
import { SuperAdminCard, MetricCard } from '@/components/super-admin';
import { TenantStatusBadge, PlanBadge } from '@/components/ui/status-badge';
import { useToast } from '@/hooks/use-toast';
import { useConfirmDialog } from '@/hooks/use-confirm-dialog';

export default function TenantsPage() {
  const { toast } = useToast();
  const { confirm, ConfirmDialog } = useConfirmDialog();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [planFilter, setPlanFilter] = useState('');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [tenantToDelete, setTenantToDelete] = useState<any>(null);
  const [deleting, setDeleting] = useState(false);

  const { tenants, loading, total, refetch, deleteTenant } = useTenants({
    search: searchTerm,
    status: statusFilter,
    plan: planFilter
  });

  const handleDeleteClick = (tenant: any) => {
    setTenantToDelete(tenant);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!tenantToDelete) return;

    setDeleting(true);
    try {
      const success = await deleteTenant(tenantToDelete.id);
      if (success) {
        toast({
          title: 'Tenant desativado com sucesso',
          description: `O tenant "${tenantToDelete.name}" foi desativado. Os dados foram preservados e podem ser recuperados. Para exclusão permanente, acesse "Tenants Desativados".`,
        });
        setDeleteModalOpen(false);
        setTenantToDelete(null);
      } else {
        toast({
          title: 'Erro ao desativar tenant',
          description: 'Ocorreu um erro ao desativar o tenant. Tente novamente.',
          variant: 'destructive',
        });
      }
    } catch (error: any) {
      toast({
        title: 'Erro ao desativar tenant',
        description: error.message || 'Erro desconhecido',
        variant: 'destructive',
      });
    } finally {
      setDeleting(false);
    }
  };

  const stats = {
    total: tenants.length,
    active: tenants.filter(t => t.status === 'ACTIVE').length,
    trial: tenants.filter(t => t.status === 'TRIAL').length,
    suspended: tenants.filter(t => t.status === 'SUSPENDED').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestão de Tenants</h1>
          <p className="text-gray-600">
            Gerencie todos os municípios da plataforma DigiUrban
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/super-admin/tenants/desativados"
            className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium"
          >
            <Building2 size={20} />
            Tenants Desativados
          </Link>
          <Link
            href="/super-admin/tenants/create"
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <Plus size={20} />
            Novo Tenant
          </Link>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard
          title="Total de Tenants"
          value={stats.total}
          icon={<Building2 size={24} />}
          color="blue"
          subtitle="Municípios cadastrados"
          loading={loading}
        />
        <MetricCard
          title="Tenants Ativos"
          value={stats.active}
          icon={<Users size={24} />}
          color="green"
          subtitle="Pagantes ativos"
          trend={{ value: 12, isPositive: true }}
          loading={loading}
        />
        <MetricCard
          title="Em Trial"
          value={stats.trial}
          icon={<FileText size={24} />}
          color="yellow"
          subtitle="Período de teste"
          loading={loading}
        />
        <MetricCard
          title="Suspensos"
          value={stats.suspended}
          icon={<DollarSign size={24} />}
          color="red"
          subtitle="Inativos ou inadimplentes"
          loading={loading}
        />
      </div>

      {/* Filters and Search */}
      <SuperAdminCard
        title="Filtros e Busca"
        description="Encontre tenants específicos"
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Buscar
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Nome, CNPJ ou domínio..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todos</option>
              <option value="ACTIVE">Ativo</option>
              <option value="TRIAL">Trial</option>
              <option value="SUSPENDED">Suspenso</option>
              <option value="INACTIVE">Inativo</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Plano
            </label>
            <select
              value={planFilter}
              onChange={(e) => setPlanFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todos</option>
              <option value="STARTER">Starter</option>
              <option value="PROFESSIONAL">Professional</option>
              <option value="ENTERPRISE">Enterprise</option>
            </select>
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          <button
            onClick={() => {
              setSearchTerm('');
              setStatusFilter('');
              setPlanFilter('');
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
          >
            Limpar Filtros
          </button>
          <button
            onClick={refetch}
            className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
          >
            Atualizar
          </button>
        </div>
      </SuperAdminCard>

      {/* Tenants Table */}
      <SuperAdminCard
        title={`Tenants (${total})`}
        description="Lista completa de municípios"
        headerAction={
          <button className="flex items-center gap-2 px-3 py-1 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Download size={16} />
            Exportar
          </button>
        }
        loading={loading}
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Município
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  CNPJ
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Plano
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Usuários
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Protocolos
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Criado em
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {tenants.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center">
                    <Building2 size={48} className="mx-auto text-gray-300 mb-3" />
                    <p className="text-gray-500 font-medium">Nenhum tenant encontrado</p>
                    <p className="text-sm text-gray-400 mt-1">
                      Ajuste os filtros ou crie um novo tenant
                    </p>
                  </td>
                </tr>
              ) : (
                tenants.map((tenant) => (
                  <tr key={tenant.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                          <Building2 size={20} className="text-blue-600" />
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-gray-900">{tenant.name}</div>
                          {tenant.domain && (
                            <div className="text-xs text-gray-500">{tenant.domain}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {tenant.cnpj}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <PlanBadge plan={tenant.plan} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <TenantStatusBadge status={tenant.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                      {tenant._count?.users || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                      {tenant._count?.protocols || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {new Date(tenant.createdAt).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/super-admin/dashboard/tenant/${tenant.id}`}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Visualizar detalhes"
                        >
                          <Eye size={18} />
                        </Link>
                        <Link
                          href={`/super-admin/tenants/${tenant.id}/edit`}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Editar tenant"
                        >
                          <Edit2 size={18} />
                        </Link>
                        <button
                          onClick={() => handleDeleteClick(tenant)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Excluir tenant"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </SuperAdminCard>

      {/* Modal de Confirmação de Exclusão */}
      {deleteModalOpen && tenantToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <Trash2 size={24} className="text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Desativar Tenant</h3>
                <p className="text-sm text-gray-600">Os dados serão preservados</p>
              </div>
            </div>

            <div className="mb-6">
              <p className="text-gray-700 mb-3">
                Você tem certeza que deseja <strong className="text-orange-600">DESATIVAR</strong> o tenant <strong>{tenantToDelete.name}</strong>?
              </p>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <p className="text-sm font-medium text-blue-900 mb-2">ℹ️ Desativação (Soft Delete)</p>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>✅ Todos os dados serão <strong>preservados</strong></li>
                  <li>✅ O tenant ficará com status CANCELADO</li>
                  <li>✅ Pode ser reativado a qualquer momento</li>
                  <li>✅ Nenhum dado será perdido</li>
                </ul>
              </div>

              {(tenantToDelete._count?.users > 0 ||
                tenantToDelete._count?.protocols > 0 ||
                tenantToDelete._count?.citizens > 0) && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-sm font-medium text-green-900 mb-2">📊 Dados que serão preservados:</p>
                  <ul className="text-sm text-green-700 space-y-1">
                    {tenantToDelete._count?.users > 0 && (
                      <li>✓ {tenantToDelete._count.users} usuário(s)</li>
                    )}
                    {tenantToDelete._count?.protocols > 0 && (
                      <li>✓ {tenantToDelete._count.protocols} protocolo(s)</li>
                    )}
                    {tenantToDelete._count?.citizens > 0 && (
                      <li>✓ {tenantToDelete._count.citizens} cidadão(s)</li>
                    )}
                  </ul>
                  <p className="text-sm text-green-800 mt-3 font-medium">
                    💡 Para exclusão permanente, acesse "Tenants Desativados" após desativar.
                  </p>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setDeleteModalOpen(false);
                  setTenantToDelete(null);
                }}
                disabled={deleting}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={deleting}
                className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {deleting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Desativando...
                  </>
                ) : (
                  <>
                    <Trash2 size={18} />
                    Desativar Tenant
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
      <ConfirmDialog />
    </div>
  );
}
