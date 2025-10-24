'use client';

import { useEffect, useState } from 'react';
import { SuperAdminCard, MetricCard } from '@/components/super-admin/SuperAdminCard';
import {
  DollarSign,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  FileText,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Settings
} from 'lucide-react';
import Link from 'next/link';

interface BillingMetrics {
  mrr: number;
  arr: number;
  currentMonthRevenue: number;
  pendingInvoices: {
    count: number;
    amount: number;
  };
  paidInvoices: {
    count: number;
    amount: number;
  };
  overdueInvoices: {
    count: number;
    amount: number;
  };
  defaultRate: number;
  averageTicket: number;
  trends: {
    mrrGrowth: number;
    revenueGrowth: number;
    invoiceGrowth: number;
  };
}

interface RevenueByPlan {
  plan: string;
  revenue: number;
  tenants: number;
  percentage: number;
}

interface RevenueHistory {
  month: string;
  revenue: number;
  invoices: number;
  mrr: number;
}

interface PlanConfig {
  name: string;
  price: number;
  features: number;
  tenants: number;
  revenue: number;
}

export default function BillingManagementPage() {
  const { apiRequest } = useSuperAdminAuth();
  const [metrics, setMetrics] = useState<BillingMetrics | null>(null);
  const [revenueByPlan, setRevenueByPlan] = useState<RevenueByPlan[]>([]);
  const [revenueHistory, setRevenueHistory] = useState<RevenueHistory[]>([]);
  const [planConfigs, setPlanConfigs] = useState<PlanConfig[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBillingData();
  }, []);

  const fetchBillingData = async () => {
    setLoading(true);
    try {
      // Token via useSuperAdminAuth;

      const [metricsRes, revenueRes, historyRes, plansRes] = await Promise.all([
        fetch('http://localhost:3001/api/super-admin/billing/metrics', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch('http://localhost:3001/api/super-admin/billing/revenue-breakdown', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch('http://localhost:3001/api/super-admin/billing/revenue-history', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch('http://localhost:3001/api/super-admin/billing/plans', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      if (metricsRes.ok && revenueRes.ok && historyRes.ok && plansRes.ok) {
        const metricsData = await metricsRes.json();
        const revenueData = await revenueRes.json();
        const historyData = await historyRes.json();
        const plansData = await plansRes.json();

        setMetrics(metricsData.metrics || mockMetrics);
        setRevenueByPlan(revenueData.breakdown || mockRevenueByPlan);
        setRevenueHistory(historyData.history || mockRevenueHistory);
        setPlanConfigs(plansData.plans || mockPlanConfigs);
      } else {
        // Use mock data
        setMetrics(mockMetrics);
        setRevenueByPlan(mockRevenueByPlan);
        setRevenueHistory(mockRevenueHistory);
        setPlanConfigs(mockPlanConfigs);
      }
    } catch (error) {
      console.error('Error fetching billing data:', error);
      // Fallback to mock data
      setMetrics(mockMetrics);
      setRevenueByPlan(mockRevenueByPlan);
      setRevenueHistory(mockRevenueHistory);
      setPlanConfigs(mockPlanConfigs);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };

  const formatPercentage = (value: number) => {
    const sign = value >= 0 ? '+' : '';
    return `${sign}${value.toFixed(1)}%`;
  };

  const getTrendIcon = (value: number) => {
    return value >= 0 ? (
      <ArrowUpRight className="w-4 h-4 text-green-600" />
    ) : (
      <ArrowDownRight className="w-4 h-4 text-red-600" />
    );
  };

  const getTrendColor = (value: number) => {
    return value >= 0 ? 'text-green-600' : 'text-red-600';
  };

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-primary mb-2">
              Gestão Financeira
            </h1>
            <p className="text-muted-foreground">
              Visão executiva de receitas, faturas e planejamento financeiro
            </p>
          </div>
          <div className="space-x-2">
            <Link
              href="/super-admin/billing/invoices"
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-sm inline-block"
            >
              <FileText className="inline w-4 h-4 mr-2" />
              Gerenciar Faturas
            </Link>
            <button
              onClick={() => alert('Configuração de planos em desenvolvimento')}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 text-sm"
            >
              <Settings className="inline w-4 h-4 mr-2" />
              Configurar Planos
            </button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <MetricCard
            title="MRR (Mensal)"
            value={formatCurrency(metrics?.mrr || 0)}
            subtitle={
              <div className="flex items-center gap-1">
                {metrics && getTrendIcon(metrics.trends.mrrGrowth)}
                <span className={metrics ? getTrendColor(metrics.trends.mrrGrowth) : ''}>
                  {metrics ? formatPercentage(metrics.trends.mrrGrowth) : '0%'}
                </span>
                <span className="text-gray-500">vs mês anterior</span>
              </div>
            }
            icon={<TrendingUp className="w-5 h-5 text-blue-600" />}
            loading={loading}
          />
          <MetricCard
            title="ARR (Anual)"
            value={formatCurrency(metrics?.arr || 0)}
            subtitle="Receita recorrente anual"
            icon={<DollarSign className="w-5 h-5 text-green-600" />}
            loading={loading}
          />
          <MetricCard
            title="Receita do Mês"
            value={formatCurrency(metrics?.currentMonthRevenue || 0)}
            subtitle={
              <div className="flex items-center gap-1">
                {metrics && getTrendIcon(metrics.trends.revenueGrowth)}
                <span className={metrics ? getTrendColor(metrics.trends.revenueGrowth) : ''}>
                  {metrics ? formatPercentage(metrics.trends.revenueGrowth) : '0%'}
                </span>
              </div>
            }
            icon={<Calendar className="w-5 h-5 text-purple-600" />}
            loading={loading}
          />
          <MetricCard
            title="Ticket Médio"
            value={formatCurrency(metrics?.averageTicket || 0)}
            subtitle="Por tenant ativo"
            icon={<DollarSign className="w-5 h-5 text-orange-600" />}
            loading={loading}
          />
        </div>

        {/* Invoice Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <SuperAdminCard
            title="Faturas Pagas"
            className="border-l-4 border-green-500"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-gray-900">
                  {metrics?.paidInvoices.count || 0}
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  {formatCurrency(metrics?.paidInvoices.amount || 0)}
                </div>
              </div>
              <CheckCircle className="w-12 h-12 text-green-500" />
            </div>
          </SuperAdminCard>

          <SuperAdminCard
            title="Faturas Pendentes"
            className="border-l-4 border-yellow-500"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-gray-900">
                  {metrics?.pendingInvoices.count || 0}
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  {formatCurrency(metrics?.pendingInvoices.amount || 0)}
                </div>
              </div>
              <Clock className="w-12 h-12 text-yellow-500" />
            </div>
          </SuperAdminCard>

          <SuperAdminCard
            title="Faturas Vencidas"
            className="border-l-4 border-red-500"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-gray-900">
                  {metrics?.overdueInvoices.count || 0}
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  {formatCurrency(metrics?.overdueInvoices.amount || 0)}
                </div>
                <div className="text-xs text-red-600 mt-2 font-semibold">
                  Taxa inadimplência: {metrics?.defaultRate.toFixed(1)}%
                </div>
              </div>
              <AlertCircle className="w-12 h-12 text-red-500" />
            </div>
          </SuperAdminCard>
        </div>

        {/* Revenue by Plan */}
        <SuperAdminCard title="Receita por Plano" className="mb-8">
          <div className="space-y-4">
            {revenueByPlan.map((plan) => (
              <div key={plan.plan}>
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <span className="font-semibold text-gray-900">{plan.plan}</span>
                    <span className="text-sm text-gray-500 ml-2">
                      ({plan.tenants} tenants)
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-gray-900">
                      {formatCurrency(plan.revenue)}
                    </div>
                    <div className="text-xs text-gray-500">
                      {plan.percentage.toFixed(1)}% do total
                    </div>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      plan.plan === 'ENTERPRISE'
                        ? 'bg-orange-500'
                        : plan.plan === 'PROFESSIONAL'
                        ? 'bg-purple-500'
                        : 'bg-blue-500'
                    }`}
                    style={{ width: `${plan.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </SuperAdminCard>

        {/* Revenue History Chart */}
        <SuperAdminCard title="Evolução da Receita (6 meses)" className="mb-8">
          <div className="space-y-3">
            {revenueHistory.map((month) => (
              <div key={month.month} className="flex items-center gap-4">
                <div className="w-16 text-sm font-medium text-gray-600">
                  {month.month}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-gray-600">
                      {month.invoices} faturas
                    </span>
                    <span className="font-semibold text-gray-900">
                      {formatCurrency(month.revenue)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full"
                      style={{
                        width: `${Math.min(
                          (month.revenue / Math.max(...revenueHistory.map((m) => m.revenue))) * 100,
                          100
                        )}%`
                      }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    MRR: {formatCurrency(month.mrr)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </SuperAdminCard>

        {/* Plan Configurations */}
        <SuperAdminCard title="Configuração de Planos" className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {planConfigs.map((plan) => (
              <div
                key={plan.name}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-bold text-gray-900">{plan.name}</h3>
                  <button
                    onClick={() => alert(`Editar plano ${plan.name}`)}
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    Editar
                  </button>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Preço:</span>
                    <span className="font-semibold">{formatCurrency(plan.price)}/mês</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Features:</span>
                    <span className="font-semibold">{plan.features} recursos</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tenants:</span>
                    <span className="font-semibold">{plan.tenants}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-gray-200">
                    <span className="text-gray-600">Receita Total:</span>
                    <span className="font-bold text-blue-600">
                      {formatCurrency(plan.revenue)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </SuperAdminCard>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            href="/super-admin/billing/invoices"
            className="block p-6 bg-white border border-gray-200 rounded-lg hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">
                  Gerenciar Faturas
                </h3>
                <p className="text-sm text-gray-600">
                  Ver, editar e exportar todas as faturas do sistema
                </p>
              </div>
              <ArrowUpRight className="w-5 h-5 text-gray-400" />
            </div>
          </Link>

          <button
            onClick={() => alert('Relatório financeiro em desenvolvimento')}
            className="block w-full text-left p-6 bg-white border border-gray-200 rounded-lg hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">
                  Relatório Financeiro
                </h3>
                <p className="text-sm text-gray-600">
                  Exportar relatório completo para contabilidade
                </p>
              </div>
              <ArrowUpRight className="w-5 h-5 text-gray-400" />
            </div>
          </button>
        </div>
      </div>
    </main>
  );
}

// Mock Data
const mockMetrics: BillingMetrics = {
  mrr: 125000,
  arr: 1500000,
  currentMonthRevenue: 132000,
  pendingInvoices: {
    count: 8,
    amount: 42000
  },
  paidInvoices: {
    count: 35,
    amount: 175000
  },
  overdueInvoices: {
    count: 3,
    amount: 15000
  },
  defaultRate: 6.5,
  averageTicket: 5000,
  trends: {
    mrrGrowth: 12.5,
    revenueGrowth: 8.3,
    invoiceGrowth: 15.2
  }
};

const mockRevenueByPlan: RevenueByPlan[] = [
  { plan: 'ENTERPRISE', revenue: 80000, tenants: 8, percentage: 64 },
  { plan: 'PROFESSIONAL', revenue: 35000, tenants: 7, percentage: 28 },
  { plan: 'STARTER', revenue: 10000, tenants: 4, percentage: 8 }
];

const mockRevenueHistory: RevenueHistory[] = [
  { month: 'Set/24', revenue: 98000, invoices: 28, mrr: 98000 },
  { month: 'Out/24', revenue: 105000, invoices: 32, mrr: 105000 },
  { month: 'Nov/24', revenue: 112000, invoices: 35, mrr: 112000 },
  { month: 'Dez/24', revenue: 118000, invoices: 37, mrr: 118000 },
  { month: 'Jan/25', revenue: 125000, invoices: 40, mrr: 125000 },
  { month: 'Fev/25', revenue: 132000, invoices: 43, mrr: 132000 }
];

const mockPlanConfigs: PlanConfig[] = [
  { name: 'STARTER', price: 2500, features: 8, tenants: 4, revenue: 10000 },
  { name: 'PROFESSIONAL', price: 5000, features: 15, tenants: 7, revenue: 35000 },
  { name: 'ENTERPRISE', price: 10000, features: 25, tenants: 8, revenue: 80000 }
];
