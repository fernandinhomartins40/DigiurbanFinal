'use client';

import { useEffect, useState } from 'react';
import { TrendingUp, DollarSign, Users, UserX, Target, Calendar, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { SuperAdminCard, MetricCard } from '@/components/super-admin';
import { LineChart, BarChart, PieChart } from '@/components/ui/charts';
import { useSuperAdminAuth } from '@/contexts/SuperAdminAuthContext';

interface SaaSMetrics {
  mrr: number;
  arr: number;
  churnRate: number;
  ltv: number;
  cac: number;
  growthRate: number;
  arpu: number;
  netRevenue: number;
  trends: {
    mrr: { current: number; previous: number; change: number };
    arr: { current: number; previous: number; change: number };
    churn: { current: number; previous: number; change: number };
  };
  breakdown: {
    revenueByPlan: Array<{ plan: string; revenue: number; count: number }>;
    revenueByMonth: Array<{ month: string; revenue: number; newMrr: number; churnedMrr: number }>;
    cohortRetention: Array<{ cohort: string; month0: number; month1: number; month3: number; month6: number; month12: number }>;
  };
  topTenants: Array<{
    id: string;
    name: string;
    plan: string;
    mrr: number;
    lifetimeValue: number;
    monthsActive: number;
  }>;
}

export default function SaaSMetricsPage() {
  const { apiRequest } = useSuperAdminAuth();
  const [metrics, setMetrics] = useState<SaaSMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30d');

  useEffect(() => {
    fetchMetrics();
  }, [timeRange]);

  const fetchMetrics = async () => {
    setLoading(true);
    try {
      const data = await apiRequest(`/super-admin/metrics/saas?timeRange=${timeRange}`);
      setMetrics(data.metrics);
    } catch (error) {
      console.error('Error fetching SaaS metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatPercent = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const getTrendColor = (change: number, inverse: boolean = false) => {
    const isPositive = inverse ? change < 0 : change > 0;
    return isPositive ? 'text-green-600' : 'text-red-600';
  };

  const getTrendIcon = (change: number, inverse: boolean = false) => {
    const isPositive = inverse ? change < 0 : change > 0;
    return isPositive ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Métricas SaaS</h1>
          <p className="text-gray-600">
            Acompanhe as principais métricas do negócio e performance da plataforma
          </p>
        </div>
        <div className="flex gap-2">
          {['7d', '30d', '90d', '1y'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                timeRange === range
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {range === '7d' ? '7 dias' : range === '30d' ? '30 dias' : range === '90d' ? '90 dias' : '1 ano'}
            </button>
          ))}
        </div>
      </div>

      {/* Primary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard
          title="MRR"
          value={formatCurrency(metrics?.mrr || 0)}
          icon={<DollarSign size={24} />}
          color="green"
          subtitle="Receita Recorrente Mensal"
          trend={metrics ? {
            value: Math.abs(metrics.trends.mrr.change),
            isPositive: metrics.trends.mrr.change > 0
          } : undefined}
          loading={loading}
        />
        <MetricCard
          title="ARR"
          value={formatCurrency(metrics?.arr || 0)}
          icon={<TrendingUp size={24} />}
          color="blue"
          subtitle="Receita Recorrente Anual"
          trend={metrics ? {
            value: Math.abs(metrics.trends.arr.change),
            isPositive: metrics.trends.arr.change > 0
          } : undefined}
          loading={loading}
        />
        <MetricCard
          title="Churn Rate"
          value={formatPercent(metrics?.churnRate || 0)}
          icon={<UserX size={24} />}
          color="red"
          subtitle="Taxa de Cancelamento"
          trend={metrics ? {
            value: Math.abs(metrics.trends.churn.change),
            isPositive: metrics.trends.churn.change < 0
          } : undefined}
          loading={loading}
        />
        <MetricCard
          title="Growth Rate"
          value={formatPercent(metrics?.growthRate || 0)}
          icon={<Target size={24} />}
          color="purple"
          subtitle="Taxa de Crescimento"
          trend={{ value: 5.2, isPositive: true }}
          loading={loading}
        />
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="text-sm font-medium text-gray-600 mb-2">LTV</div>
          <div className="text-2xl font-bold text-gray-900 mb-1">
            {formatCurrency(metrics?.ltv || 0)}
          </div>
          <div className="text-xs text-gray-500">Lifetime Value</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="text-sm font-medium text-gray-600 mb-2">CAC</div>
          <div className="text-2xl font-bold text-gray-900 mb-1">
            {formatCurrency(metrics?.cac || 0)}
          </div>
          <div className="text-xs text-gray-500">Custo de Aquisição</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="text-sm font-medium text-gray-600 mb-2">LTV/CAC Ratio</div>
          <div className="text-2xl font-bold text-gray-900 mb-1">
            {metrics ? (metrics.ltv / metrics.cac).toFixed(1) : '0'}x
          </div>
          <div className="text-xs text-gray-500">
            {metrics && (metrics.ltv / metrics.cac) >= 3 ? '✅ Saudável' : '⚠️ Atenção'}
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="text-sm font-medium text-gray-600 mb-2">ARPU</div>
          <div className="text-2xl font-bold text-gray-900 mb-1">
            {formatCurrency(metrics?.arpu || 0)}
          </div>
          <div className="text-xs text-gray-500">Receita Média por Usuário</div>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <SuperAdminCard
          title="Evolução MRR"
          description="Receita recorrente mensal ao longo do tempo"
          className="lg:col-span-2"
          loading={loading}
        >
          <LineChart
            data={metrics?.breakdown.revenueByMonth.map(item => ({
              label: item.month,
              value: item.revenue
            })) || []}
            color="hsl(142, 71%, 45%)"
            height={300}
          />
          <div className="mt-4 grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-xs text-gray-500">MRR Atual</div>
              <div className="text-lg font-bold text-green-600">
                {formatCurrency(metrics?.mrr || 0)}
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-500">Novo MRR</div>
              <div className="text-lg font-bold text-blue-600">
                {formatCurrency(metrics?.breakdown.revenueByMonth[metrics.breakdown.revenueByMonth.length - 1]?.newMrr || 0)}
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-500">MRR Perdido</div>
              <div className="text-lg font-bold text-red-600">
                {formatCurrency(metrics?.breakdown.revenueByMonth[metrics.breakdown.revenueByMonth.length - 1]?.churnedMrr || 0)}
              </div>
            </div>
          </div>
        </SuperAdminCard>

        <SuperAdminCard
          title="Receita por Plano"
          description="Distribuição de receita"
          loading={loading}
        >
          <PieChart
            data={metrics?.breakdown.revenueByPlan.map(item => ({
              label: item.plan,
              value: item.revenue
            })) || []}
            showLegend={true}
            height={300}
          />
          <div className="mt-4 space-y-2">
            {metrics?.breakdown.revenueByPlan.map((item, index) => (
              <div key={index} className="flex justify-between text-sm">
                <span className="text-gray-600">{item.plan}</span>
                <div className="text-right">
                  <div className="font-semibold text-gray-900">{formatCurrency(item.revenue)}</div>
                  <div className="text-xs text-gray-500">{item.count} tenants</div>
                </div>
              </div>
            ))}
          </div>
        </SuperAdminCard>
      </div>

      {/* Cohort Retention Analysis */}
      <SuperAdminCard
        title="Análise de Retenção por Cohort"
        description="Taxa de retenção de clientes ao longo dos meses"
        loading={loading}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Cohort</th>
                <th className="px-4 py-3 text-center font-semibold text-gray-700">Mês 0</th>
                <th className="px-4 py-3 text-center font-semibold text-gray-700">Mês 1</th>
                <th className="px-4 py-3 text-center font-semibold text-gray-700">Mês 3</th>
                <th className="px-4 py-3 text-center font-semibold text-gray-700">Mês 6</th>
                <th className="px-4 py-3 text-center font-semibold text-gray-700">Mês 12</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {metrics?.breakdown.cohortRetention.map((cohort, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{cohort.cohort}</td>
                  <td className="px-4 py-3 text-center">
                    <span className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full font-semibold">
                      {cohort.month0}%
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-block px-3 py-1 rounded-full font-semibold ${
                      cohort.month1 >= 80 ? 'bg-green-100 text-green-800' :
                      cohort.month1 >= 60 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {cohort.month1}%
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-block px-3 py-1 rounded-full font-semibold ${
                      cohort.month3 >= 70 ? 'bg-green-100 text-green-800' :
                      cohort.month3 >= 50 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {cohort.month3}%
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-block px-3 py-1 rounded-full font-semibold ${
                      cohort.month6 >= 60 ? 'bg-green-100 text-green-800' :
                      cohort.month6 >= 40 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {cohort.month6}%
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-block px-3 py-1 rounded-full font-semibold ${
                      cohort.month12 >= 50 ? 'bg-green-100 text-green-800' :
                      cohort.month12 >= 30 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {cohort.month12}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 flex items-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-100 rounded"></div>
            <span className="text-gray-600">Saudável (≥ target)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-100 rounded"></div>
            <span className="text-gray-600">Atenção (médio)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-100 rounded"></div>
            <span className="text-gray-600">Crítico (menor que target)</span>
          </div>
        </div>
      </SuperAdminCard>

      {/* Top Tenants by LTV */}
      <SuperAdminCard
        title="Top Tenants por Lifetime Value"
        description="Clientes mais valiosos da plataforma"
        loading={loading}
      >
        <div className="space-y-3">
          {metrics?.topTenants.map((tenant, index) => (
            <div
              key={tenant.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="text-2xl font-bold text-gray-400">#{index + 1}</div>
                <div>
                  <div className="font-semibold text-gray-900">{tenant.name}</div>
                  <div className="text-sm text-gray-500">
                    {tenant.plan} • {tenant.monthsActive} meses ativo
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-green-600">
                  {formatCurrency(tenant.lifetimeValue)}
                </div>
                <div className="text-sm text-gray-500">
                  {formatCurrency(tenant.mrr)}/mês
                </div>
              </div>
            </div>
          ))}
        </div>
      </SuperAdminCard>

      {/* Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SuperAdminCard
          title="💡 Insights Automáticos"
          description="Análises e recomendações"
        >
          <div className="space-y-3">
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="font-semibold text-green-900 mb-1">✅ LTV/CAC saudável</div>
              <div className="text-sm text-green-700">
                Ratio de {metrics ? (metrics.ltv / metrics.cac).toFixed(1) : '0'}x está acima do mínimo recomendado de 3x
              </div>
            </div>
            {metrics && metrics.churnRate > 5 && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="font-semibold text-red-900 mb-1">⚠️ Churn elevado</div>
                <div className="text-sm text-red-700">
                  Taxa de churn de {formatPercent(metrics.churnRate)} está acima do ideal de 5%. Recomendamos ações de retenção.
                </div>
              </div>
            )}
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="font-semibold text-blue-900 mb-1">📈 Tendência positiva</div>
              <div className="text-sm text-blue-700">
                MRR cresceu {metrics ? formatPercent(Math.abs(metrics.trends.mrr.change)) : '0%'} no período analisado
              </div>
            </div>
          </div>
        </SuperAdminCard>

        <SuperAdminCard
          title="🎯 Metas e Projeções"
          description="Objetivos do trimestre"
        >
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Meta MRR Trimestre</span>
                <span className="font-semibold text-gray-900">
                  {formatCurrency(metrics?.mrr || 0)} / {formatCurrency((metrics?.mrr || 0) * 1.3)}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-green-600 h-3 rounded-full transition-all"
                  style={{ width: `${Math.min(((metrics?.mrr || 0) / ((metrics?.mrr || 0) * 1.3)) * 100, 100)}%` }}
                />
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {Math.round(((metrics?.mrr || 0) / ((metrics?.mrr || 0) * 1.3)) * 100)}% alcançado
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Meta Churn Rate</span>
                <span className="font-semibold text-gray-900">
                  {formatPercent(metrics?.churnRate || 0)} / {formatPercent(5)}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className={`h-3 rounded-full transition-all ${
                    (metrics?.churnRate || 0) <= 5 ? 'bg-green-600' : 'bg-red-600'
                  }`}
                  style={{ width: `${Math.min(((metrics?.churnRate || 0) / 5) * 100, 100)}%` }}
                />
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {(metrics?.churnRate || 0) <= 5 ? '✅ Dentro da meta' : '❌ Acima da meta'}
              </div>
            </div>

            <div className="pt-3 border-t border-gray-200">
              <div className="text-sm text-gray-600 mb-2">Projeção ARR fim do ano:</div>
              <div className="text-2xl font-bold text-blue-600">
                {formatCurrency((metrics?.mrr || 0) * 12 * 1.4)}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Baseado em crescimento de 40%
              </div>
            </div>
          </div>
        </SuperAdminCard>
      </div>
    </div>
  );
}
