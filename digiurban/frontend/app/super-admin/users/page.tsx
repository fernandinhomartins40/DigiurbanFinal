'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Users, Search, Filter, Download, UserPlus, Shield, UserX,
  Mail, Calendar, Building2, Key, Trash2, CheckCircle, XCircle
} from 'lucide-react';
import { SuperAdminCard, MetricCard, TenantSelector, UserCreateModal } from '@/components/super-admin';
import { useSuperAdminAuth } from '@/contexts/SuperAdminAuthContext';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  tenantId: string;
  tenant: {
    name: string;
  };
  departmentId?: string;
  department?: {
    name: string;
  };
  createdAt: string;
  lastLoginAt?: string;
}

const USER_ROLES = [
  { value: 'GUEST', label: 'Cidadão', level: 0 },
  { value: 'USER', label: 'Funcionário', level: 1 },
  { value: 'COORDINATOR', label: 'Coordenador', level: 2 },
  { value: 'MANAGER', label: 'Secretário', level: 3 },
  { value: 'ADMIN', label: 'Prefeito', level: 4 },
  { value: 'SUPER_ADMIN', label: 'Super Admin', level: 5 }
];

export default function UsersManagementPage() {
  const { apiRequest } = useSuperAdminAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTenant, setSelectedTenant] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, [selectedTenant, roleFilter, statusFilter, searchTerm]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();

      if (selectedTenant) params.append('tenantId', selectedTenant);
      if (roleFilter) params.append('role', roleFilter);
      if (statusFilter) params.append('status', statusFilter);
      if (searchTerm) params.append('search', searchTerm);
      params.append('limit', '100');

      const data = await apiRequest(`/super-admin/users?${params}`);
      setUsers(data.users || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (userId: string, userEmail: string) => {
    if (!confirm(`Tem certeza que deseja resetar a senha de ${userEmail}?`)) return;

    try {
      await apiRequest(`/super-admin/users/${userId}/reset-password`, {
        method: 'POST'
      });
      alert('✅ Senha resetada! Um email foi enviado ao usuário.');
    } catch (error) {
      console.error('Error resetting password:', error);
      alert('❌ Erro ao resetar senha');
    }
  };

  const handleToggleStatus = async (userId: string, currentStatus: boolean) => {
    const action = currentStatus ? 'desativar' : 'ativar';
    if (!confirm(`Tem certeza que deseja ${action} este usuário?`)) return;

    try {
      await apiRequest(`/super-admin/users/${userId}/status`, {
        method: 'PUT',
        body: JSON.stringify({ isActive: !currentStatus })
      });
      alert(`✅ Usuário ${action === 'ativar' ? 'ativado' : 'desativado'} com sucesso!`);
      fetchUsers();
    } catch (error) {
      console.error('Error toggling status:', error);
      alert('❌ Erro ao alterar status');
    }
  };

  const handleBulkAction = async (action: 'activate' | 'deactivate' | 'delete') => {
    if (selectedUsers.length === 0) {
      alert('Selecione pelo menos um usuário');
      return;
    }

    const actionText = {
      activate: 'ativar',
      deactivate: 'desativar',
      delete: 'deletar'
    }[action];

    if (!confirm(`Tem certeza que deseja ${actionText} ${selectedUsers.length} usuários?`)) return;

    try {
      await apiRequest(`/super-admin/users/bulk-action`, {
        method: 'POST',
        body: JSON.stringify({ action, userIds: selectedUsers })
      });
      alert(`✅ ${selectedUsers.length} usuários ${actionText}dos com sucesso!`);
      setSelectedUsers([]);
      fetchUsers();
    } catch (error) {
      console.error('Error performing bulk action:', error);
      alert('❌ Erro ao executar ação em massa');
    }
  };

  const toggleUserSelection = (userId: string) => {
    setSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedUsers.length === users.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(users.map(u => u.id));
    }
  };

  const getRoleBadgeColor = (role: string) => {
    const colors = {
      SUPER_ADMIN: 'bg-purple-100 text-purple-800',
      ADMIN: 'bg-red-100 text-red-800',
      MANAGER: 'bg-orange-100 text-orange-800',
      COORDINATOR: 'bg-blue-100 text-blue-800',
      USER: 'bg-green-100 text-green-800',
      GUEST: 'bg-gray-100 text-gray-800'
    };
    return colors[role as keyof typeof colors] || colors.GUEST;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Nunca';
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const stats = {
    total: users.length,
    active: users.filter(u => u.isActive).length,
    inactive: users.filter(u => !u.isActive).length,
    admins: users.filter(u => ['ADMIN', 'MANAGER'].includes(u.role)).length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestão de Usuários</h1>
          <p className="text-gray-600">
            Gerencie usuários de todos os tenants da plataforma
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          <UserPlus size={20} />
          Novo Usuário
        </button>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard
          title="Total de Usuários"
          value={stats.total}
          icon={<Users size={24} />}
          color="blue"
          subtitle="Em toda a plataforma"
          loading={loading}
        />
        <MetricCard
          title="Usuários Ativos"
          value={stats.active}
          icon={<CheckCircle size={24} />}
          color="green"
          subtitle="Podem fazer login"
          loading={loading}
        />
        <MetricCard
          title="Inativos"
          value={stats.inactive}
          icon={<UserX size={24} />}
          color="red"
          subtitle="Bloqueados"
          loading={loading}
        />
        <MetricCard
          title="Administradores"
          value={stats.admins}
          icon={<Shield size={24} />}
          color="purple"
          subtitle="Admins e Secretários"
          loading={loading}
        />
      </div>

      {/* Filters */}
      <SuperAdminCard title="Filtros e Busca" description="Encontre usuários específicos">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Buscar
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Nome ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tenant
            </label>
            <TenantSelector
              selectedTenantId={selectedTenant}
              onSelect={setSelectedTenant}
              showAllOption={true}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Role
            </label>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todas</option>
              {USER_ROLES.map(role => (
                <option key={role.value} value={role.value}>{role.label}</option>
              ))}
            </select>
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
              <option value="active">Ativos</option>
              <option value="inactive">Inativos</option>
            </select>
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedTenant('');
              setRoleFilter('');
              setStatusFilter('');
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
          >
            Limpar Filtros
          </button>
          <button
            onClick={fetchUsers}
            className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
          >
            Atualizar
          </button>
        </div>
      </SuperAdminCard>

      {/* Bulk Actions */}
      {selectedUsers.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center justify-between">
          <div className="text-sm font-medium text-blue-900">
            {selectedUsers.length} usuários selecionados
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => handleBulkAction('activate')}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
            >
              Ativar Selecionados
            </button>
            <button
              onClick={() => handleBulkAction('deactivate')}
              className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm font-medium"
            >
              Desativar Selecionados
            </button>
            <button
              onClick={() => handleBulkAction('delete')}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
            >
              Deletar Selecionados
            </button>
          </div>
        </div>
      )}

      {/* Users Table */}
      <SuperAdminCard
        title={`Usuários (${users.length})`}
        description="Lista de todos os usuários cross-tenant"
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
                <th className="px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedUsers.length === users.length && users.length > 0}
                    onChange={toggleSelectAll}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Usuário</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Tenant</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Role</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Departamento</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Último Login</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center">
                    <Users size={48} className="mx-auto text-gray-300 mb-3" />
                    <p className="text-gray-500 font-medium">Nenhum usuário encontrado</p>
                    <p className="text-sm text-gray-400 mt-1">Ajuste os filtros ou crie um novo usuário</p>
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user.id)}
                        onChange={() => toggleUserSelection(user.id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <div className="font-semibold text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500 flex items-center gap-1">
                          <Mail size={12} />
                          {user.email}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/super-admin/dashboard/tenant/${user.tenantId}`}
                        className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
                      >
                        <Building2 size={14} />
                        {user.tenant.name}
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getRoleBadgeColor(user.role)}`}>
                        {USER_ROLES.find(r => r.value === user.role)?.label || user.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {user.department?.name || '-'}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        user.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {user.isActive ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Calendar size={12} />
                        {formatDate(user.lastLoginAt)}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleResetPassword(user.id, user.email)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Resetar senha"
                        >
                          <Key size={18} />
                        </button>
                        <button
                          onClick={() => handleToggleStatus(user.id, user.isActive)}
                          className={`p-2 rounded-lg transition-colors ${
                            user.isActive
                              ? 'text-orange-600 hover:bg-orange-50'
                              : 'text-green-600 hover:bg-green-50'
                          }`}
                          title={user.isActive ? 'Desativar usuário' : 'Ativar usuário'}
                        >
                          {user.isActive ? <XCircle size={18} /> : <CheckCircle size={18} />}
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Deletar usuário ${user.name}?`)) {
                              // handleDelete(user.id);
                            }
                          }}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Deletar usuário"
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

      {/* User Create Modal */}
      <UserCreateModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={() => {
          fetchUsers();
        }}
      />
    </div>
  );
}
