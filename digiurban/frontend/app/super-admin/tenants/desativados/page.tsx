'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Building2, ArrowLeft, RefreshCw, Trash2, AlertTriangle, RotateCcw } from 'lucide-react';
import { useTenants } from '@/hooks/super-admin';
import { SuperAdminCard } from '@/components/super-admin';
import { TenantStatusBadge, PlanBadge } from '@/components/ui/status-badge';
import { useToast } from '@/hooks/use-toast';
import { useConfirmDialog } from '@/hooks/use-confirm-dialog';

export default function DeactivatedTenantsPage() {
  const { toast } = useToast();
  const { confirm, ConfirmDialog } = useConfirmDialog();
  const [hardDeleteModalOpen, setHardDeleteModalOpen] = useState(false);
  const [reactivateModalOpen, setReactivateModalOpen] = useState(false);
  const [tenantToAction, setTenantToAction] = useState<any>(null);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [processing, setProcessing] = useState(false);

  const { tenants, loading, total, refetch, hardDeleteTenant, reactivateTenant } = useTenants({
    status: 'CANCELLED'
  });

  const handleHardDeleteClick = (tenant: any) => {
    setTenantToAction(tenant);
    setConfirmPassword('');
    setHardDeleteModalOpen(true);
  };

  const handleReactivateClick = (tenant: any) => {
    setTenantToAction(tenant);
    setReactivateModalOpen(true);
  };

  const handleHardDeleteConfirm = async () => {
    if (!tenantToAction) return;

    if (confirmPassword !== 'DELETE_PERMANENTLY') {
      toast({
        title: 'Senha de confirmação incorreta',
        description: 'Digite exatamente: DELETE_PERMANENTLY',
        variant: 'destructive',
      });
      return;
    }

    setProcessing(true);
    try {
      const success = await hardDeleteTenant(tenantToAction.id, confirmPassword);
      if (success) {
        toast({
          title: 'Tenant excluído permanentemente',
          description: `O tenant "${tenantToAction.name}" e TODOS os dados foram PERMANENTEMENTE excluídos. Esta operação é IRREVERSÍVEL!`,
          variant: 'destructive',
        });
        setHardDeleteModalOpen(false);
        setTenantToAction(null);
        setConfirmPassword('');
      } else {
        toast({
          title: 'Erro ao excluir tenant',
          description: 'Ocorreu um erro ao excluir permanentemente o tenant.',
          variant: 'destructive',
        });
      }
    } catch (error: any) {
      toast({
        title: 'Erro ao excluir tenant',
        description: error.message || 'Erro desconhecido',
        variant: 'destructive',
      });
    } finally {
      setProcessing(false);
    }
  };

  const handleReactivateConfirm = async () => {
    if (!tenantToAction) return;

    setProcessing(true);
    try {
      const success = await reactivateTenant(tenantToAction.id);
      if (success) {
        toast({
          title: 'Tenant reativado com sucesso',
          description: `O tenant "${tenantToAction.name}" foi reativado.`,
        });
        setReactivateModalOpen(false);
        setTenantToAction(null);
      } else {
        toast({
          title: 'Erro ao reativar tenant',
          description: 'Ocorreu um erro ao reativar o tenant.',
          variant: 'destructive',
        });
      }
    } catch (error: any) {
      toast({
        title: 'Erro ao reativar tenant',
        description: error.message || 'Erro desconhecido',
        variant: 'destructive',
      });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-4">
          <Link
            href="/super-admin/tenants"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={24} className="text-gray-600" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Tenants Desativados</h1>
            <p className="text-gray-600">
              Gerencie tenants cancelados - Reative ou exclua permanentemente
            </p>
          </div>
        </div>
        <button
          onClick={refetch}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          <RefreshCw size={20} />
          Atualizar
        </button>
      </div>

      {/* Alert Banner */}
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
        <div className="flex items-center gap-3">
          <AlertTriangle size={24} className="text-yellow-600" />
          <div>
            <h3 className="font-bold text-yellow-900">Área de Gerenciamento de Tenants Desativados</h3>
            <p className="text-sm text-yellow-700 mt-1">
              Aqui você pode <strong>reativar</strong> tenants cancelados ou fazer a <strong className="text-red-600">exclusão permanente</strong> de tenants de teste.
              A exclusão permanente remove TODOS os dados e é IRREVERSÍVEL.
            </p>
          </div>
        </div>
      </div>

      {/* Tenants Table */}
      <SuperAdminCard
        title={`Tenants Desativados (${total})`}
        description="Lista de municípios cancelados"
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
                  Dados Preservados
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Desativado em
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {tenants.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <Building2 size={48} className="mx-auto text-gray-300 mb-3" />
                    <p className="text-gray-500 font-medium">Nenhum tenant desativado</p>
                    <p className="text-sm text-gray-400 mt-1">
                      Todos os tenants estão ativos
                    </p>
                  </td>
                </tr>
              ) : (
                tenants.map((tenant) => (
                  <tr key={tenant.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                          <Building2 size={20} className="text-gray-500" />
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
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-xs text-gray-600 space-y-1">
                        <div>👥 {tenant._count?.users || 0} usuários</div>
                        <div>📋 {tenant._count?.protocols || 0} protocolos</div>
                        <div>👨‍👩‍👧‍👦 {tenant._count?.citizens || 0} cidadãos</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {(tenant as any).updatedAt ? new Date((tenant as any).updatedAt).toLocaleDateString('pt-BR') : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleReactivateClick(tenant)}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Reativar tenant"
                        >
                          <RotateCcw size={18} />
                        </button>
                        <button
                          onClick={() => handleHardDeleteClick(tenant)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Excluir permanentemente"
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

      {/* Modal de Reativação */}
      {reactivateModalOpen && tenantToAction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <RotateCcw size={24} className="text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Reativar Tenant</h3>
                <p className="text-sm text-gray-600">Restaurar acesso ao sistema</p>
              </div>
            </div>

            <div className="mb-6">
              <p className="text-gray-700 mb-3">
                Deseja reativar o tenant <strong>{tenantToAction.name}</strong>?
              </p>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-sm font-medium text-green-900 mb-2">✅ O que acontecerá:</p>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• O tenant voltará ao status anterior (geralmente ACTIVE)</li>
                  <li>• Todos os dados permanecerão intactos</li>
                  <li>• Usuários poderão fazer login novamente</li>
                  <li>• Sistema voltará a funcionar normalmente</li>
                </ul>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setReactivateModalOpen(false);
                  setTenantToAction(null);
                }}
                disabled={processing}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleReactivateConfirm}
                disabled={processing}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {processing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Reativando...
                  </>
                ) : (
                  <>
                    <RotateCcw size={18} />
                    Reativar Tenant
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Exclusão Permanente */}
      {hardDeleteModalOpen && tenantToAction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle size={24} className="text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-red-900">⚠️ EXCLUSÃO PERMANENTE</h3>
                <p className="text-sm text-red-600">Esta ação é IRREVERSÍVEL</p>
              </div>
            </div>

            <div className="mb-6">
              <div className="bg-red-50 border-2 border-red-400 rounded-lg p-4 mb-4">
                <p className="text-sm font-bold text-red-900 mb-2">🚨 ATENÇÃO: OPERAÇÃO DESTRUTIVA</p>
                <p className="text-sm text-red-700 mb-3">
                  Ao confirmar, o tenant <strong>{tenantToAction.name}</strong> e <strong className="text-red-900 underline">TODOS os dados relacionados</strong> serão PERMANENTEMENTE excluídos:
                </p>
                <ul className="text-sm text-red-700 space-y-1">
                  <li>❌ {tenantToAction._count?.users || 0} usuários</li>
                  <li>❌ {tenantToAction._count?.protocols || 0} protocolos</li>
                  <li>❌ {tenantToAction._count?.citizens || 0} cidadãos</li>
                  <li>❌ {tenantToAction._count?.services || 0} serviços</li>
                  <li>❌ Todos os departamentos e configurações</li>
                </ul>
                <p className="text-sm text-red-900 font-bold mt-3">
                  ⚠️ NÃO HÁ COMO RECUPERAR ESSES DADOS!
                </p>
              </div>

              <div className="bg-yellow-50 border border-yellow-400 rounded-lg p-3 mb-4">
                <p className="text-xs font-medium text-yellow-900">
                  💡 Use esta opção APENAS para limpar tenants de teste. Para tenants de produção, mantenha desativados.
                </p>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  Digite <code className="bg-red-100 px-2 py-1 rounded text-red-700">DELETE_PERMANENTLY</code> para confirmar:
                </label>
                <input
                  type="text"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="DELETE_PERMANENTLY"
                  className="w-full px-4 py-2 border-2 border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 font-mono"
                  autoComplete="off"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setHardDeleteModalOpen(false);
                  setTenantToAction(null);
                  setConfirmPassword('');
                }}
                disabled={processing}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleHardDeleteConfirm}
                disabled={processing || confirmPassword !== 'DELETE_PERMANENTLY'}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {processing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Excluindo...
                  </>
                ) : (
                  <>
                    <Trash2 size={18} />
                    Excluir PERMANENTEMENTE
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
