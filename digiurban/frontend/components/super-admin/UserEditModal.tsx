'use client';

import { useState, useEffect } from 'react';
import { X, User, Mail, Shield, Building2, Users, Save } from 'lucide-react';
import { useSuperAdminAuth } from '@/contexts/SuperAdminAuthContext';
import { useToast } from '@/hooks/use-toast';

interface Tenant {
  id: string;
  name: string;
  status: string;
}

interface Department {
  id: string;
  name: string;
}

interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  tenantId: string;
  departmentId?: string;
  tenant: {
    name: string;
  };
  department?: {
    name: string;
  };
}

interface UserEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  user: UserData | null;
}

const USER_ROLES = [
  { value: 'GUEST', label: 'Cidadão', description: 'Acesso básico para consultas' },
  { value: 'USER', label: 'Funcionário', description: 'Servidor público com acesso limitado' },
  { value: 'COORDINATOR', label: 'Coordenador', description: 'Coordenador de departamento' },
  { value: 'MANAGER', label: 'Secretário', description: 'Secretário municipal' },
  { value: 'ADMIN', label: 'Prefeito', description: 'Administrador do tenant' },
];

export function UserEditModal({ isOpen, onClose, onSuccess, user }: UserEditModalProps) {
  const { apiRequest } = useSuperAdminAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loadingDepartments, setLoadingDepartments] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'USER',
    tenantId: '',
    departmentId: '',
    isActive: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen && user) {
      setFormData({
        name: user.name,
        email: user.email,
        role: user.role,
        tenantId: user.tenantId,
        departmentId: user.departmentId || '',
        isActive: user.isActive,
      });
      fetchTenants();
    }
  }, [isOpen, user]);

  useEffect(() => {
    if (formData.tenantId) {
      fetchDepartments(formData.tenantId);
    } else {
      setDepartments([]);
      setFormData(prev => ({ ...prev, departmentId: '' }));
    }
  }, [formData.tenantId]);

  const fetchTenants = async () => {
    try {
      const data = await apiRequest('/super-admin/tenants?limit=1000', {
        method: 'GET',
      });
      setTenants(data.tenants || []);
    } catch (error) {
      console.error('Error fetching tenants:', error);
    }
  };

  const fetchDepartments = async (tenantId: string) => {
    setLoadingDepartments(true);
    try {
      const data = await apiRequest(`/super-admin/tenants/${tenantId}/departments`, {
        method: 'GET',
      });
      setDepartments(data.departments || []);
    } catch (error) {
      console.error('Error fetching departments:', error);
      setDepartments([]);
    } finally {
      setLoadingDepartments(false);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.tenantId) {
      newErrors.tenantId = 'Tenant é obrigatório';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user || !validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        role: formData.role,
        tenantId: formData.tenantId,
        departmentId: formData.departmentId || null,
        isActive: formData.isActive,
      };

      await apiRequest(`/super-admin/users/${user.id}`, {
        method: 'PUT',
        body: JSON.stringify(payload),
      });

      toast({
        title: 'Usuário atualizado',
        description: 'As informações do usuário foram atualizadas com sucesso.',
      });

      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('Error updating user:', error);
      const errorMessage = error?.message || 'Erro ao atualizar usuário';
      toast({
        title: 'Erro ao atualizar',
        description: errorMessage,
        variant: 'destructive',
      });
      setErrors({ submit: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setErrors({});
      onClose();
    }
  };

  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <User size={24} className="text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Editar Usuário</h2>
              <p className="text-sm text-gray-500">Atualizar informações do usuário</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            disabled={loading}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Error Alert */}
          {errors.submit && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800">{errors.submit}</p>
            </div>
          )}

          {/* Nome */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nome Completo *
            </label>
            <div className="relative">
              <User size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.name ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Digite o nome completo"
                disabled={loading}
              />
            </div>
            {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email *
            </label>
            <div className="relative">
              <Mail size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.email ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="usuario@email.com"
                disabled={loading}
              />
            </div>
            {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email}</p>}
          </div>

          {/* Tenant */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tenant (Prefeitura) *
            </label>
            <div className="relative">
              <Building2 size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                value={formData.tenantId}
                onChange={(e) => setFormData({ ...formData, tenantId: e.target.value })}
                className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.tenantId ? 'border-red-300' : 'border-gray-300'
                }`}
                disabled={loading}
              >
                <option value="">Selecione um tenant</option>
                {tenants.map((tenant) => (
                  <option key={tenant.id} value={tenant.id}>
                    {tenant.name} ({tenant.status})
                  </option>
                ))}
              </select>
            </div>
            {errors.tenantId && <p className="text-sm text-red-600 mt-1">{errors.tenantId}</p>}
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nível de Acesso *
            </label>
            <div className="relative">
              <Shield size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              >
                {USER_ROLES.map((role) => (
                  <option key={role.value} value={role.value}>
                    {role.label} - {role.description}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Departamento (opcional) */}
          {formData.tenantId && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Departamento (opcional)
              </label>
              <div className="relative">
                <Users size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <select
                  value={formData.departmentId}
                  onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={loading || loadingDepartments}
                >
                  <option value="">Nenhum departamento</option>
                  {departments.map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.name}
                    </option>
                  ))}
                </select>
              </div>
              {loadingDepartments && (
                <p className="text-sm text-gray-500 mt-1">Carregando departamentos...</p>
              )}
            </div>
          )}

          {/* Status */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              disabled={loading}
            />
            <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
              Usuário ativo (pode fazer login)
            </label>
          </div>

          {/* Info sobre senha */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Nota:</strong> Para alterar a senha do usuário, utilize o botão "Resetar senha" na lista de usuários.
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Save size={18} />
              {loading ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
