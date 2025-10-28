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
        <div className="flex gap-2">
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

      {/* Metrics */}
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
              Buscar
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Nome, CNPJ ou domínio..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 md:pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 md:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option value="">Todos</option>
              <option value="ACTIVE">Ativo</option>
              <option value="TRIAL">Trial</option>
              <option value="SUSPENDED">Suspenso</option>
              <option value="INACTIVE">Inativo</option>
            </select>
          </div>

          <div>
            <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
              Plano
            </label>
            <select
              value={planFilter}
              onChange={(e) => setPlanFilter(e.target.value)}
              className="w-full px-3 md:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option value="">Todos</option>
              <option value="STARTER">Starter</option>
              <option value="PROFESSIONAL">Professional</option>
              <option value="ENTERPRISE">Enterprise</option>
            </select>
          </div>
        </div>

        <div className="mt-3 md:mt-4 flex gap-2">
          <button
            onClick={() => {
              setSearchTerm('');
              setStatusFilter('');
              setPlanFilter('');
            }}
            className="flex-1 sm:flex-none px-3 md:px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-xs md:text-sm font-medium"
          >
            Limpar Filtros
          </button>
          <button
            onClick={refetch}
            className="flex-1 sm:flex-none px-3 md:px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-xs md:text-sm font-medium"
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
          <button className="flex items-center gap-1 md:gap-2 px-2 md:px-3 py-1 text-xs md:text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Download size={14} className="md:w-4 md:h-4" />
            <span className="hidden sm:inline">Exportar</span>
          </button>
        }
        loading={loading}
      >
        {/* Mobile Card View */}
        <div className="md:hidden space-y-3">
          {tenants.length === 0 ? (
            <div className="text-center py-8">
              <Building2 size={40} className="mx-auto text-gray-300 mb-3" />
              <p className="text-sm text-gray-500 font-medium">Nenhum tenant encontrado</p>
              <p className="text-xs text-gray-400 mt-1">
                Ajuste os filtros ou crie um novo tenant
              </p>
            </div>
          ) : (
            tenants.map((tenant) => (
              <div key={tenant.id} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Building2 size={18} className="text-blue-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="text-sm font-semibold text-gray-900 truncate">{tenant.name}</h4>
                      {tenant.domain && (
                        <p className="text-xs text-gray-500 truncate">{tenant.domain}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0 ml-2">
                    <Link
                      href={`/super-admin/dashboard/tenant/${tenant.id}`}
                      className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Eye size={16} />
                    </Link>
                    <Link
                      href={`/super-admin/tenants/${tenant.id}/edit`}
                      className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                    >
                      <Edit2 size={16} />
                    </Link>
                    <button
                      onClick={() => handleDeleteClick(tenant)}
                      className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mb-2">
                  <div>
                    <p className="text-xs text-gray-500">Plano</p>
                    <PlanBadge plan={tenant.plan} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Status</p>
                    <TenantStatusBadge status={tenant.status} />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-gray-200">
                  <div>
                    <p className="text-xs text-gray-500">Usuários</p>
                    <p className="text-sm font-semibold text-gray-900">{tenant._count?.users || 0}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Protocolos</p>
                    <p className="text-sm font-semibold text-gray-900">{tenant._count?.protocols || 0}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Criado</p>
                    <p className="text-xs font-medium text-gray-700">
                      {new Date(tenant.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block w-full overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 lg:px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Município
                </th>
                <th className="px-4 lg:px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider hidden lg:table-cell">
                  CNPJ
                </th>
                <th className="px-4 lg:px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Plano
                </th>
                <th className="px-4 lg:px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 lg:px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider hidden lg:table-cell">
                  Usuários
                </th>
                <th className="px-4 lg:px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider hidden lg:table-cell">
                  Protocolos
                </th>
                <th className="px-4 lg:px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider hidden xl:table-cell">
                  Criado em
                </th>
                <th className="px-4 lg:px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {tenants.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center">
                    <Building2 size={48} className="mx-auto text-gray-300 mb-3" />
                    <p className="text-base text-gray-500 font-medium">Nenhum tenant encontrado</p>
                    <p className="text-sm text-gray-400 mt-1">
                      Ajuste os filtros ou crie um novo tenant
                    </p>
                  </td>
                </tr>
              ) : (
                tenants.map((tenant) => (
                  <tr key={tenant.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 lg:px-6 py-3 lg:py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Building2 size={20} className="text-blue-600" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-sm font-semibold text-gray-900">{tenant.name}</div>
                          {tenant.domain && (
                            <div className="text-xs text-gray-500 truncate">{tenant.domain}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 lg:px-6 py-3 lg:py-4 whitespace-nowrap text-sm text-gray-600 hidden lg:table-cell">
                      {tenant.cnpj}
                    </td>
                    <td className="px-4 lg:px-6 py-3 lg:py-4 whitespace-nowrap">
                      <PlanBadge plan={tenant.plan} />
                    </td>
                    <td className="px-4 lg:px-6 py-3 lg:py-4 whitespace-nowrap">
                      <TenantStatusBadge status={tenant.status} />
                    </td>
                    <td className="px-4 lg:px-6 py-3 lg:py-4 whitespace-nowrap text-sm text-gray-900 font-medium hidden lg:table-cell">
                      {tenant._count?.users || 0}
                    </td>
                    <td className="px-4 lg:px-6 py-3 lg:py-4 whitespace-nowrap text-sm text-gray-900 font-medium hidden lg:table-cell">
                      {tenant._count?.protocols || 0}
                    </td>
                    <td className="px-4 lg:px-6 py-3 lg:py-4 whitespace-nowrap text-sm text-gray-600 hidden xl:table-cell">
                      {new Date(tenant.createdAt).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-4 lg:px-6 py-3 lg:py-4 whitespace-nowrap">
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-4 md:p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Trash2 size={20} className="text-red-600 md:w-6 md:h-6" />
              </div>
              <div className="min-w-0">
                <h3 className="text-base md:text-lg font-bold text-gray-900">Desativar Tenant</h3>
                <p className="text-xs md:text-sm text-gray-600">Os dados serão preservados</p>
              </div>
            </div>

            <div className="mb-4 md:mb-6">
              <p className="text-sm md:text-base text-gray-700 mb-3">
                Você tem certeza que deseja <strong className="text-orange-600">DESATIVAR</strong> o tenant <strong className="break-words">{tenantToDelete.name}</strong>?
              </p>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 md:p-4 mb-3 md:mb-4">
                <p className="text-xs md:text-sm font-medium text-blue-900 mb-2">ℹ️ Desativação (Soft Delete)</p>
                <ul className="text-xs md:text-sm text-blue-700 space-y-1">
                  <li>✅ Todos os dados serão <strong>preservados</strong></li>
                  <li>✅ O tenant ficará com status CANCELADO</li>
                  <li>✅ Pode ser reativado a qualquer momento</li>
                  <li>✅ Nenhum dado será perdido</li>
                </ul>
              </div>

              {(tenantToDelete._count?.users > 0 ||
                tenantToDelete._count?.protocols > 0 ||
                tenantToDelete._count?.citizens > 0) && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 md:p-4">
                  <p className="text-xs md:text-sm font-medium text-green-900 mb-2">📊 Dados que serão preservados:</p>
                  <ul className="text-xs md:text-sm text-green-700 space-y-1">
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
                  <p className="text-xs md:text-sm text-green-800 mt-2 md:mt-3 font-medium">
                    💡 Para exclusão permanente, acesse "Tenants Desativados" após desativar.
                  </p>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-2 md:gap-3">
              <button
                onClick={() => {
                  setDeleteModalOpen(false);
                  setTenantToDelete(null);
                }}
                disabled={deleting}
                className="flex-1 px-3 md:px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 text-sm md:text-base"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={deleting}
                className="flex-1 px-3 md:px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 text-sm md:text-base"
              >
                {deleting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Desativando...</span>
                  </>
                ) : (
                  <>
                    <Trash2 size={16} className="md:w-[18px] md:h-[18px]" />
                    <span>Desativar Tenant</span>
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
