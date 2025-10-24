'use client';

import { useEffect, useState } from 'react';
import { SuperAdminCard } from '@/components/super-admin/SuperAdminCard';
import {
  DollarSign,
  Edit,
  Save,
  X,
  Plus,
  Trash2,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useSuperAdminAuth } from '@/contexts/SuperAdminAuthContext';

interface PlanFeature {
  id: string;
  name: string;
  enabled: boolean;
}

interface Plan {
  id: string;
  name: string;
  slug: string;
  price: number;
  billingCycle: 'MONTHLY' | 'YEARLY';
  maxUsers: number;
  maxStorage: number; // GB
  maxProtocols: number;
  features: PlanFeature[];
  isActive: boolean;
  tenantCount: number;
  totalRevenue: number;
}

interface Discount {
  id: string;
  code: string;
  percentage: number;
  validUntil: string;
  usageCount: number;
  maxUsage: number;
  isActive: boolean;
}

export default function PlansConfigurationPage() {
  const { apiRequest } = useSuperAdminAuth();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [editingPlan, setEditingPlan] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAddDiscount, setShowAddDiscount] = useState(false);
  const [newDiscount, setNewDiscount] = useState({
    code: '',
    percentage: 0,
    validUntil: '',
    maxUsage: 100
  });

  useEffect(() => {
    fetchPlansData();
  }, []);

  const fetchPlansData = async () => {
    setLoading(true);
    try {
      const [plansData, discountsData] = await Promise.all([
        apiRequest('/super-admin/billing/plans'),
        apiRequest('/super-admin/billing/discounts')
      ]);

      setPlans(plansData.plans || mockPlans);
      setDiscounts(discountsData.discounts || mockDiscounts);
    } catch (error) {
      setPlans(mockPlans);
      setDiscounts(mockDiscounts);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePlan = async (planId: string, updates: Partial<Plan>) => {
    try {
      await apiRequest(`/super-admin/billing/plans/${planId}`, {
        method: 'PUT',
        body: JSON.stringify(updates)
      });

      alert('Plano atualizado com sucesso');
      setEditingPlan(null);
      fetchPlansData();
    } catch (error) {
      alert('Erro ao atualizar plano');
    }
  };

  const handleAddDiscount = async () => {
    if (!newDiscount.code || newDiscount.percentage <= 0) {
      alert('Preencha todos os campos obrigatórios');
      return;
    }

    try {
      await apiRequest('/super-admin/billing/discounts', {
        method: 'POST',
        body: JSON.stringify(newDiscount)
      });

      alert('Desconto criado com sucesso');
      setShowAddDiscount(false);
      setNewDiscount({ code: '', percentage: 0, validUntil: '', maxUsage: 100 });
      fetchPlansData();
    } catch (error) {
      alert('Erro ao criar desconto');
    }
  };

  const handleToggleDiscount = async (discountId: string, isActive: boolean) => {
    try {
      await apiRequest(`/super-admin/billing/discounts/${discountId}/toggle`, {
        method: 'POST',
        body: JSON.stringify({ isActive: !isActive })
      });

      fetchPlansData();
    } catch (error) {
      // Error already handled by apiRequest
    }
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };

  const getPlanColor = (slug: string) => {
    const colors = {
      'starter': 'border-blue-500 bg-blue-50',
      'professional': 'border-purple-500 bg-purple-50',
      'enterprise': 'border-orange-500 bg-orange-50'
    };
    return colors[slug as keyof typeof colors] || 'border-gray-500 bg-gray-50';
  };

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-primary mb-2">
              Configuração de Planos e Preços
            </h1>
            <p className="text-muted-foreground">
              Gerencie planos, preços, features e descontos promocionais
            </p>
          </div>
        </div>

        {/* Plans Configuration */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`border-l-4 rounded-lg shadow-sm ${getPlanColor(plan.slug)}`}
            >
              <div className="bg-white p-6 rounded-r-lg">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{plan.name}</h2>
                    <p className="text-sm text-gray-500">{plan.tenantCount} tenants ativos</p>
                  </div>
                  {editingPlan === plan.id ? (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleUpdatePlan(plan.id, plan)}
                        className="p-2 text-green-600 hover:bg-green-50 rounded"
                      >
                        <Save className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setEditingPlan(null)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setEditingPlan(plan.id)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Price */}
                <div className="mb-6">
                  <div className="flex items-baseline gap-2">
                    <DollarSign className="w-5 h-5 text-gray-600" />
                    {editingPlan === plan.id ? (
                      <input
                        type="number"
                        value={plan.price}
                        onChange={(e) => {
                          const updated = plans.map((p) =>
                            p.id === plan.id ? { ...p, price: parseFloat(e.target.value) } : p
                          );
                          setPlans(updated);
                        }}
                        className="text-3xl font-bold border-b-2 border-blue-500 focus:outline-none w-32"
                      />
                    ) : (
                      <span className="text-3xl font-bold text-gray-900">
                        {formatCurrency(plan.price)}
                      </span>
                    )}
                    <span className="text-gray-500">/mês</span>
                  </div>
                  <div className="text-sm text-gray-600 mt-2">
                    Receita total: <span className="font-semibold">{formatCurrency(plan.totalRevenue)}</span>
                  </div>
                </div>

                {/* Limits */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Usuários:</span>
                    {editingPlan === plan.id ? (
                      <input
                        type="number"
                        value={plan.maxUsers}
                        onChange={(e) => {
                          const updated = plans.map((p) =>
                            p.id === plan.id ? { ...p, maxUsers: parseInt(e.target.value) } : p
                          );
                          setPlans(updated);
                        }}
                        className="w-20 px-2 py-1 border border-gray-300 rounded text-right"
                      />
                    ) : (
                      <span className="font-semibold">
                        {plan.maxUsers === -1 ? 'Ilimitado' : plan.maxUsers}
                      </span>
                    )}
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Storage:</span>
                    {editingPlan === plan.id ? (
                      <input
                        type="number"
                        value={plan.maxStorage}
                        onChange={(e) => {
                          const updated = plans.map((p) =>
                            p.id === plan.id ? { ...p, maxStorage: parseInt(e.target.value) } : p
                          );
                          setPlans(updated);
                        }}
                        className="w-20 px-2 py-1 border border-gray-300 rounded text-right"
                      />
                    ) : (
                      <span className="font-semibold">
                        {plan.maxStorage === -1 ? 'Ilimitado' : `${plan.maxStorage} GB`}
                      </span>
                    )}
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Protocolos/mês:</span>
                    {editingPlan === plan.id ? (
                      <input
                        type="number"
                        value={plan.maxProtocols}
                        onChange={(e) => {
                          const updated = plans.map((p) =>
                            p.id === plan.id ? { ...p, maxProtocols: parseInt(e.target.value) } : p
                          );
                          setPlans(updated);
                        }}
                        className="w-20 px-2 py-1 border border-gray-300 rounded text-right"
                      />
                    ) : (
                      <span className="font-semibold">
                        {plan.maxProtocols === -1 ? 'Ilimitado' : plan.maxProtocols}
                      </span>
                    )}
                  </div>
                </div>

                {/* Features */}
                <div className="border-t border-gray-200 pt-4">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">Recursos Inclusos:</h3>
                  <div className="space-y-2">
                    {plan.features.map((feature) => (
                      <div key={feature.id} className="flex items-center gap-2">
                        {feature.enabled ? (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        ) : (
                          <X className="w-4 h-4 text-gray-400" />
                        )}
                        <span className={`text-sm ${feature.enabled ? 'text-gray-900' : 'text-gray-400'}`}>
                          {feature.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Status */}
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Status:</span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        plan.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {plan.isActive ? 'Ativo' : 'Inativo'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Discounts Management */}
        <SuperAdminCard title="Cupons de Desconto" className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm text-gray-600">
              Gerencie cupons promocionais e descontos especiais
            </p>
            <button
              onClick={() => setShowAddDiscount(true)}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 text-sm"
            >
              <Plus className="inline w-4 h-4 mr-2" />
              Novo Cupom
            </button>
          </div>

          {/* Add Discount Form */}
          {showAddDiscount && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-4">Criar Novo Cupom</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Código
                  </label>
                  <input
                    type="text"
                    value={newDiscount.code}
                    onChange={(e) => setNewDiscount({ ...newDiscount, code: e.target.value.toUpperCase() })}
                    placeholder="PROMO2025"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Desconto (%)
                  </label>
                  <input
                    type="number"
                    value={newDiscount.percentage}
                    onChange={(e) => setNewDiscount({ ...newDiscount, percentage: parseFloat(e.target.value) })}
                    placeholder="10"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Válido até
                  </label>
                  <input
                    type="date"
                    value={newDiscount.validUntil}
                    onChange={(e) => setNewDiscount({ ...newDiscount, validUntil: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Usos máximos
                  </label>
                  <input
                    type="number"
                    value={newDiscount.maxUsage}
                    onChange={(e) => setNewDiscount({ ...newDiscount, maxUsage: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <button
                  onClick={handleAddDiscount}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Criar Cupom
                </button>
                <button
                  onClick={() => {
                    setShowAddDiscount(false);
                    setNewDiscount({ code: '', percentage: 0, validUntil: '', maxUsage: 100 });
                  }}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}

          {/* Discounts List */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Código
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Desconto
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Validade
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Uso
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {discounts.map((discount) => (
                  <tr key={discount.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4">
                      <span className="font-mono font-semibold text-gray-900">
                        {discount.code}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="font-semibold text-green-600">
                        {discount.percentage}%
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-600">
                      {new Date(discount.validUntil).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-600">
                      {discount.usageCount} / {discount.maxUsage}
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          discount.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {discount.isActive ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <button
                        onClick={() => handleToggleDiscount(discount.id, discount.isActive)}
                        className="text-blue-600 hover:text-blue-800 text-sm mr-3"
                      >
                        {discount.isActive ? 'Desativar' : 'Ativar'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SuperAdminCard>
      </div>
    </main>
  );
}

// Mock Data
const mockPlans: Plan[] = [
  {
    id: '1',
    name: 'Starter',
    slug: 'starter',
    price: 2500,
    billingCycle: 'MONTHLY',
    maxUsers: 25,
    maxStorage: 50,
    maxProtocols: 500,
    features: [
      { id: 'f1', name: 'Portal do Cidadão', enabled: true },
      { id: 'f2', name: 'Gestão de Protocolos', enabled: true },
      { id: 'f3', name: 'Notificações Email', enabled: true },
      { id: 'f4', name: 'Relatórios Básicos', enabled: true },
      { id: 'f5', name: 'Suporte 8x5', enabled: true },
      { id: 'f6', name: 'API Avançada', enabled: false },
      { id: 'f7', name: 'Integrações Premium', enabled: false },
      { id: 'f8', name: 'Consultoria Dedicada', enabled: false }
    ],
    isActive: true,
    tenantCount: 4,
    totalRevenue: 10000
  },
  {
    id: '2',
    name: 'Professional',
    slug: 'professional',
    price: 5000,
    billingCycle: 'MONTHLY',
    maxUsers: 100,
    maxStorage: 200,
    maxProtocols: 2000,
    features: [
      { id: 'f1', name: 'Portal do Cidadão', enabled: true },
      { id: 'f2', name: 'Gestão de Protocolos', enabled: true },
      { id: 'f3', name: 'Notificações Email', enabled: true },
      { id: 'f4', name: 'Relatórios Avançados', enabled: true },
      { id: 'f5', name: 'Suporte 24x7', enabled: true },
      { id: 'f6', name: 'API Avançada', enabled: true },
      { id: 'f7', name: 'Integrações Premium', enabled: true },
      { id: 'f8', name: 'Consultoria Dedicada', enabled: false }
    ],
    isActive: true,
    tenantCount: 7,
    totalRevenue: 35000
  },
  {
    id: '3',
    name: 'Enterprise',
    slug: 'enterprise',
    price: 10000,
    billingCycle: 'MONTHLY',
    maxUsers: -1,
    maxStorage: -1,
    maxProtocols: -1,
    features: [
      { id: 'f1', name: 'Portal do Cidadão', enabled: true },
      { id: 'f2', name: 'Gestão de Protocolos', enabled: true },
      { id: 'f3', name: 'Notificações Email/SMS/Push', enabled: true },
      { id: 'f4', name: 'Relatórios Customizados', enabled: true },
      { id: 'f5', name: 'Suporte Premium 24x7', enabled: true },
      { id: 'f6', name: 'API Completa', enabled: true },
      { id: 'f7', name: 'Todas Integrações', enabled: true },
      { id: 'f8', name: 'Consultoria Dedicada', enabled: true }
    ],
    isActive: true,
    tenantCount: 8,
    totalRevenue: 80000
  }
];

const mockDiscounts: Discount[] = [
  {
    id: '1',
    code: 'LAUNCH2025',
    percentage: 20,
    validUntil: '2025-12-31',
    usageCount: 5,
    maxUsage: 50,
    isActive: true
  },
  {
    id: '2',
    code: 'PROMO30',
    percentage: 30,
    validUntil: '2025-03-31',
    usageCount: 12,
    maxUsage: 20,
    isActive: true
  },
  {
    id: '3',
    code: 'SPECIAL50',
    percentage: 50,
    validUntil: '2025-02-28',
    usageCount: 20,
    maxUsage: 20,
    isActive: false
  }
];
