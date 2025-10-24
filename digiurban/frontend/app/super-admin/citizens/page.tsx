'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Users, Search, Filter, Download, UserPlus, Building2, UserCheck,
  Mail, Calendar, MapPin, Trash2, Eye, Edit2, Link2, Zap, AlertCircle,
  CheckCircle, XCircle, Clock
} from 'lucide-react';
import { SuperAdminCard, MetricCard, TenantSelector, TenantAutocomplete } from '@/components/super-admin';
import { useSuperAdminAuth } from '@/contexts/SuperAdminAuthContext';

interface Citizen {
  id: string;
  name: string;
  email: string;
  cpf: string;
  phone?: string;
  address?: {
    street?: string;
    number?: string;
    neighborhood?: string;
    city?: string;
    state?: string;
    zipCode?: string;
  };
  tenantId?: string;
  tenant?: {
    id: string;
    name: string;
    nomeMunicipio?: string;
    ufMunicipio?: string;
  };
  verificationStatus: string;
  isActive: boolean;
  createdAt: string;
}

const VERIFICATION_STATUS = [
  { value: 'PENDING', label: 'Pendente', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'VERIFIED', label: 'Verificado', color: 'bg-green-100 text-green-800' },
  { value: 'REJECTED', label: 'Rejeitado', color: 'bg-red-100 text-red-800' }
];

export default function CitizensManagementPage() {
  const { apiRequest } = useSuperAdminAuth();
  const [citizens, setCitizens] = useState<Citizen[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTenant, setSelectedTenant] = useState('');
  const [verificationFilter, setVerificationFilter] = useState('');
  const [showUnlinkedOnly, setShowUnlinkedOnly] = useState(false);
  const [selectedCitizens, setSelectedCitizens] = useState<string[]>([]);
  const [autoLinkLoading, setAutoLinkLoading] = useState(false);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [citizenToLink, setCitizenToLink] = useState<Citizen | null>(null);
  const [selectedTenantForLink, setSelectedTenantForLink] = useState('');
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCitizen, setSelectedCitizen] = useState<Citizen | null>(null);
  const [editFormData, setEditFormData] = useState<any>({});

  useEffect(() => {
    fetchCitizens();
  }, [selectedTenant, verificationFilter, searchTerm, showUnlinkedOnly]);

  const fetchCitizens = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();

      if (showUnlinkedOnly) {
        // Buscar apenas desvinculados
        const data = await apiRequest('/super-admin/citizens/unlinked');
        setCitizens(data.citizens || []);
      } else {
        if (selectedTenant) params.append('tenantId', selectedTenant);
        if (verificationFilter) params.append('verificationStatus', verificationFilter);
        if (searchTerm) params.append('search', searchTerm);
        params.append('limit', '100');

        const data = await apiRequest(`/super-admin/citizens?${params}`);
        setCitizens(data.citizens || []);
      }
    } catch (error) {
      console.error('Error fetching citizens:', error);
      setCitizens([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAutoLink = async () => {
    if (!confirm('Deseja vincular automaticamente todos os cidadãos não vinculados baseado na cidade de cadastro?')) {
      return;
    }

    setAutoLinkLoading(true);
    try {
      const data = await apiRequest('/super-admin/citizens/auto-link', {
        method: 'POST'
      });

      alert(`✅ ${data.message}\n\n` +
        `✓ Vinculados: ${data.summary.linked}\n` +
        `✗ Não vinculados: ${data.summary.notLinked}`);

      fetchCitizens();
    } catch (error) {
      console.error('Error auto-linking citizens:', error);
      alert('❌ Erro ao vincular cidadãos automaticamente');
    } finally {
      setAutoLinkLoading(false);
    }
  };

  const handleDelete = async (citizenId: string, citizenName: string) => {
    if (!confirm(`Tem certeza que deseja excluir o cidadão ${citizenName}?`)) return;

    try {
      await apiRequest(`/super-admin/citizens/${citizenId}`, {
        method: 'DELETE'
      });
      alert('✅ Cidadão excluído com sucesso!');
      fetchCitizens();
    } catch (error) {
      console.error('Error deleting citizen:', error);
      alert('❌ Erro ao excluir cidadão');
    }
  };

  const openLinkModal = (citizen: Citizen) => {
    setCitizenToLink(citizen);
    setSelectedTenantForLink('');
    setShowLinkModal(true);
  };

  const handleLinkTenant = async () => {
    if (!citizenToLink || !selectedTenantForLink) {
      alert('Selecione um tenant');
      return;
    }

    try {
      await apiRequest(`/super-admin/citizens/${citizenToLink.id}/link-tenant`, {
        method: 'PUT',
        body: JSON.stringify({ tenantId: selectedTenantForLink })
      });
      alert('✅ Cidadão vinculado com sucesso!');
      setShowLinkModal(false);
      fetchCitizens();
    } catch (error) {
      console.error('Error linking citizen:', error);
      alert('❌ Erro ao vincular cidadão');
    }
  };

  const toggleCitizenSelection = (citizenId: string) => {
    setSelectedCitizens(prev =>
      prev.includes(citizenId)
        ? prev.filter(id => id !== citizenId)
        : [...prev, citizenId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedCitizens.length === citizens.length) {
      setSelectedCitizens([]);
    } else {
      setSelectedCitizens(citizens.map(c => c.id));
    }
  };

  const openViewModal = (citizen: Citizen) => {
    console.log('[DEBUG] openViewModal chamado com:', citizen);
    setSelectedCitizen(citizen);
    setShowViewModal(true);
    console.log('[DEBUG] showViewModal setado para true');
  };

  const openEditModal = (citizen: Citizen) => {
    console.log('[DEBUG] openEditModal chamado com:', citizen);
    setSelectedCitizen(citizen);
    setEditFormData({
      name: citizen.name,
      email: citizen.email,
      phone: citizen.phone || '',
      cpf: citizen.cpf,
      verificationStatus: citizen.verificationStatus,
      address: citizen.address || {},
      tenantId: citizen.tenantId || ''
    });
    setShowEditModal(true);
    console.log('[DEBUG] showEditModal setado para true');
  };

  const handleEditSubmit = async () => {
    if (!selectedCitizen) return;

    try {
      await apiRequest(`/super-admin/citizens/${selectedCitizen.id}`, {
        method: 'PUT',
        body: JSON.stringify(editFormData)
      });
      alert('✅ Cidadão atualizado com sucesso!');
      setShowEditModal(false);
      fetchCitizens();
    } catch (error) {
      console.error('Error updating citizen:', error);
      alert('❌ Erro ao atualizar cidadão');
    }
  };

  const getVerificationBadge = (status: string) => {
    const statusObj = VERIFICATION_STATUS.find(s => s.value === status);
    return statusObj || VERIFICATION_STATUS[0];
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const formatAddress = (address: any) => {
    if (!address) return 'Não informado';
    const parts = [
      address.city,
      address.state
    ].filter(Boolean);
    return parts.join(' - ') || 'Não informado';
  };

  const stats = {
    total: citizens.length,
    verified: citizens.filter(c => c.verificationStatus === 'VERIFIED').length,
    pending: citizens.filter(c => c.verificationStatus === 'PENDING').length,
    unlinked: citizens.filter(c => !c.tenantId).length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestão de Cidadãos</h1>
          <p className="text-gray-600">
            Gerencie cidadãos de todos os tenants da plataforma
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleAutoLink}
            disabled={autoLinkLoading}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {autoLinkLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Vinculando...
              </>
            ) : (
              <>
                <Zap size={20} />
                Vinculação Automática
              </>
            )}
          </button>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard
          title="Total de Cidadãos"
          value={stats.total}
          icon={<Users size={24} />}
          color="blue"
          subtitle="Em toda a plataforma"
          loading={loading}
        />
        <MetricCard
          title="Verificados"
          value={stats.verified}
          icon={<CheckCircle size={24} />}
          color="green"
          subtitle="Cadastros aprovados"
          loading={loading}
        />
        <MetricCard
          title="Pendentes"
          value={stats.pending}
          icon={<Clock size={24} />}
          color="yellow"
          subtitle="Aguardando verificação"
          loading={loading}
        />
        <MetricCard
          title="Não Atribuídos"
          value={stats.unlinked}
          icon={<AlertCircle size={24} />}
          color="red"
          subtitle="Aguardando tenant"
          loading={loading}
        />
      </div>

      {/* Filters */}
      <SuperAdminCard title="Filtros e Busca" description="Encontre cidadãos específicos">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Buscar
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Nome, email ou CPF..."
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
              Status de Verificação
            </label>
            <select
              value={verificationFilter}
              onChange={(e) => setVerificationFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todos</option>
              {VERIFICATION_STATUS.map(status => (
                <option key={status.value} value={status.value}>{status.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Vinculação
            </label>
            <label className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50" title="Cidadãos de municípios sem tenant ativo (aguardando)">
              <input
                type="checkbox"
                checked={showUnlinkedOnly}
                onChange={(e) => setShowUnlinkedOnly(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm">Apenas não atribuídos</span>
            </label>
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedTenant('');
              setVerificationFilter('');
              setShowUnlinkedOnly(false);
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
          >
            Limpar Filtros
          </button>
          <button
            onClick={fetchCitizens}
            className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
          >
            Atualizar
          </button>
        </div>
      </SuperAdminCard>

      {/* Citizens Table */}
      <SuperAdminCard
        title={`Cidadãos (${citizens.length})`}
        description="Lista de todos os cidadãos cross-tenant"
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
                    checked={selectedCitizens.length === citizens.length && citizens.length > 0}
                    onChange={toggleSelectAll}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Cidadão</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">CPF</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Tenant</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Cidade</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Cadastro</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {citizens.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center">
                    <Users size={48} className="mx-auto text-gray-300 mb-3" />
                    <p className="text-gray-500 font-medium">Nenhum cidadão encontrado</p>
                    <p className="text-sm text-gray-400 mt-1">Ajuste os filtros para encontrar cidadãos</p>
                  </td>
                </tr>
              ) : (
                citizens.map((citizen) => {
                  const verificationBadge = getVerificationBadge(citizen.verificationStatus);

                  return (
                    <tr key={citizen.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selectedCitizens.includes(citizen.id)}
                          onChange={() => toggleCitizenSelection(citizen.id)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <div>
                          <div className="font-semibold text-gray-900">{citizen.name}</div>
                          <div className="text-sm text-gray-500 flex items-center gap-1">
                            <Mail size={12} />
                            {citizen.email}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {citizen.cpf}
                      </td>
                      <td className="px-4 py-3">
                        {citizen.tenant ? (
                          <Link
                            href={`/super-admin/dashboard/tenant/${citizen.tenantId}`}
                            className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
                          >
                            <Building2 size={14} />
                            {citizen.tenant.name}
                          </Link>
                        ) : (
                          <span className="text-sm text-red-600 font-medium flex items-center gap-1">
                            <AlertCircle size={14} />
                            Não vinculado
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <MapPin size={12} />
                          {formatAddress(citizen.address)}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${verificationBadge.color}`}>
                          {verificationBadge.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Calendar size={12} />
                          {formatDate(citizen.createdAt)}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => openViewModal(citizen)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Visualizar"
                          >
                            <Eye size={18} />
                          </button>
                          <button
                            onClick={() => openEditModal(citizen)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Editar"
                          >
                            <Edit2 size={18} />
                          </button>
                          {!citizen.tenant && (
                            <button
                              onClick={() => openLinkModal(citizen)}
                              className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                              title="Vincular a tenant"
                            >
                              <Link2 size={18} />
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(citizen.id, citizen.name)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Excluir"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </SuperAdminCard>

      {/* Link Tenant Modal */}
      {showLinkModal && citizenToLink && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Vincular Cidadão a Tenant
            </h3>
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">
                <strong>Cidadão:</strong> {citizenToLink.name}
              </p>
              <p className="text-sm text-gray-600 mb-4">
                <strong>Email:</strong> {citizenToLink.email}
              </p>

              <label className="block text-sm font-medium text-gray-700 mb-2">
                Selecione o Tenant
              </label>
              <TenantSelector
                selectedTenantId={selectedTenantForLink}
                onSelect={setSelectedTenantForLink}
                showAllOption={false}
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLinkModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancelar
              </button>
              <button
                onClick={handleLinkTenant}
                disabled={!selectedTenantForLink}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Vincular
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Citizen Modal */}
      {showViewModal && selectedCitizen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-xl font-bold text-gray-900">
                Detalhes do Cidadão
              </h3>
              <button
                onClick={() => setShowViewModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle size={24} />
              </button>
            </div>

            <div className="space-y-4">
              {/* Informações Pessoais */}
              <div className="border-b pb-4">
                <h4 className="font-semibold text-gray-700 mb-3">Informações Pessoais</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-500">Nome</label>
                    <p className="font-medium">{selectedCitizen.name}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">CPF</label>
                    <p className="font-medium">{selectedCitizen.cpf}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Email</label>
                    <p className="font-medium">{selectedCitizen.email}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Telefone</label>
                    <p className="font-medium">{selectedCitizen.phone || 'Não informado'}</p>
                  </div>
                </div>
              </div>

              {/* Endereço */}
              {selectedCitizen.address && (
                <div className="border-b pb-4">
                  <h4 className="font-semibold text-gray-700 mb-3">Endereço</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-gray-500">Rua</label>
                      <p className="font-medium">{selectedCitizen.address.street || '-'}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">Número</label>
                      <p className="font-medium">{selectedCitizen.address.number || '-'}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">Bairro</label>
                      <p className="font-medium">{selectedCitizen.address.neighborhood || '-'}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">Cidade</label>
                      <p className="font-medium">{selectedCitizen.address.city || '-'}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">Estado</label>
                      <p className="font-medium">{selectedCitizen.address.state || '-'}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">CEP</label>
                      <p className="font-medium">{selectedCitizen.address.zipCode || '-'}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Status e Tenant */}
              <div>
                <h4 className="font-semibold text-gray-700 mb-3">Status e Vinculação</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-500">Tenant</label>
                    <p className="font-medium">{selectedCitizen.tenant?.name || 'Não vinculado'}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Status de Verificação</label>
                    <p>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getVerificationBadge(selectedCitizen.verificationStatus).color}`}>
                        {getVerificationBadge(selectedCitizen.verificationStatus).label}
                      </span>
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Data de Cadastro</label>
                    <p className="font-medium">{formatDate(selectedCitizen.createdAt)}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Status</label>
                    <p>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        selectedCitizen.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {selectedCitizen.isActive ? 'Ativo' : 'Inativo'}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowViewModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Fechar
              </button>
              <button
                onClick={() => {
                  setShowViewModal(false);
                  openEditModal(selectedCitizen);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Editar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Citizen Modal */}
      {showEditModal && selectedCitizen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-xl font-bold text-gray-900">
                Editar Cidadão
              </h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle size={24} />
              </button>
            </div>

            <div className="space-y-4">
              {/* Informações Pessoais */}
              <div>
                <h4 className="font-semibold text-gray-700 mb-3">Informações Pessoais</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                    <input
                      type="text"
                      value={editFormData.name || ''}
                      onChange={(e) => setEditFormData({...editFormData, name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">CPF</label>
                    <input
                      type="text"
                      value={editFormData.cpf || ''}
                      disabled
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={editFormData.email || ''}
                      onChange={(e) => setEditFormData({...editFormData, email: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
                    <input
                      type="text"
                      value={editFormData.phone || ''}
                      onChange={(e) => setEditFormData({...editFormData, phone: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Vinculação de Tenant */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vincular a Tenant
                </label>
                <TenantAutocomplete
                  selectedTenantId={editFormData.tenantId}
                  onSelect={(tenantId) => setEditFormData({...editFormData, tenantId})}
                  onClear={() => setEditFormData({...editFormData, tenantId: ''})}
                  placeholder="Digite para buscar tenant..."
                  showClearButton={true}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {selectedCitizen?.tenant?.name === 'Pool Global - Municípios Não Cadastrados'
                    ? '⚠️ Este cidadão está no Pool Global. Selecione um tenant para vinculá-lo.'
                    : 'Selecione um tenant para vincular o cidadão ou deixe em branco para manter atual.'}
                </p>
              </div>

              {/* Status de Verificação */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status de Verificação</label>
                <select
                  value={editFormData.verificationStatus || ''}
                  onChange={(e) => setEditFormData({...editFormData, verificationStatus: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {VERIFICATION_STATUS.map(status => (
                    <option key={status.value} value={status.value}>{status.label}</option>
                  ))}
                </select>
              </div>

              {/* Endereço */}
              <div>
                <h4 className="font-semibold text-gray-700 mb-3">Endereço</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Rua</label>
                    <input
                      type="text"
                      value={editFormData.address?.street || ''}
                      onChange={(e) => setEditFormData({...editFormData, address: {...editFormData.address, street: e.target.value}})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Número</label>
                    <input
                      type="text"
                      value={editFormData.address?.number || ''}
                      onChange={(e) => setEditFormData({...editFormData, address: {...editFormData.address, number: e.target.value}})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Bairro</label>
                    <input
                      type="text"
                      value={editFormData.address?.neighborhood || ''}
                      onChange={(e) => setEditFormData({...editFormData, address: {...editFormData.address, neighborhood: e.target.value}})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Cidade</label>
                    <input
                      type="text"
                      value={editFormData.address?.city || ''}
                      onChange={(e) => setEditFormData({...editFormData, address: {...editFormData.address, city: e.target.value}})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                    <input
                      type="text"
                      value={editFormData.address?.state || ''}
                      onChange={(e) => setEditFormData({...editFormData, address: {...editFormData.address, state: e.target.value}})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      maxLength={2}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">CEP</label>
                    <input
                      type="text"
                      value={editFormData.address?.zipCode || ''}
                      onChange={(e) => setEditFormData({...editFormData, address: {...editFormData.address, zipCode: e.target.value}})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancelar
              </button>
              <button
                onClick={handleEditSubmit}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Salvar Alterações
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
