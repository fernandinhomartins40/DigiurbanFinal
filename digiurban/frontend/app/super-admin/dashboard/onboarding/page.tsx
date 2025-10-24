'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Rocket, Users, Target, TrendingUp, Clock, CheckCircle, AlertCircle, XCircle } from 'lucide-react';
import { SuperAdminCard, MetricCard } from '@/components/super-admin';
import { TenantStatusBadge, PlanBadge } from '@/components/ui/status-badge';
import { BarChart, LineChart } from '@/components/ui/charts';

interface OnboardingData {
  overview: {
    trialsActive: number;
    trialsConverted: number;
    trialsExpired: number;
    conversionRate: number;
    averageTimeToActivate: number;
    averageHealthScore: number;
  };
  funnel: {
    started: number;
    completed: number;
    activated: number;
    converted: number;
  };
  trends: {
    conversionByMonth: Array<{ month: string; trials: number; conversions: number; rate: number }>;
    healthScoreDistribution: Array<{ range: string; count: number }>;
  };
  activeTrials: Array<{
    id: string;
    name: string;
    plan: string;
    startedAt: string;
    expiresAt: string;
    daysRemaining: number;
    healthScore: number;
    completedSteps: number;
    totalSteps: number;
  }>;
  recentConversions: Array<{
    id: string;
    name: string;
    plan: string;
    convertedAt: string;
    daysInTrial: number;
    finalHealthScore: number;
  }>;
}

export default function OnboardingDashboardPage() {
  const [data, setData] = useState<OnboardingData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOnboardingData();
  }, []);

  const fetchOnboardingData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('digiurban_super_admin_token');
      const response = await fetch('http://localhost:3001/api/super-admin/onboarding/dashboard', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const result = await response.json();
        setData(result.data);
      }
    } catch (error) {
      console.error('Error fetching onboarding dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const getHealthScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getHealthScoreIcon = (score: number) => {
    if (score >= 80) return <CheckCircle size={16} />;
    if (score >= 60) return <AlertCircle size={16} />;
    return <XCircle size={16} />;
  };

  const funnelSteps = data ? [
    { label: 'Iniciaram Trial', value: data.funnel.started, percentage: 100 },
    { label: 'Completaram Setup', value: data.funnel.completed, percentage: (data.funnel.completed / data.funnel.started) * 100 },
    { label: 'Ativaram Sistema', value: data.funnel.activated, percentage: (data.funnel.activated / data.funnel.started) * 100 },
    { label: 'Converteram', value: data.funnel.converted, percentage: (data.funnel.converted / data.funnel.started) * 100 },
  ] : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard de Onboarding</h1>
          <p className="text-gray-600">
            Acompanhe trials ativos, conversões e health scores dos novos clientes
          </p>
        </div>
        <Link
          href="/super-admin/tenants/create"
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          <Rocket size={20} />
          Novo Trial
        </Link>
      </div>

      {/* Primary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard
          title="Trials Ativos"
          value={data?.overview.trialsActive || 0}
          icon={<Users size={24} />}
          color="blue"
          subtitle="Em período de teste"
          loading={loading}
        />
        <MetricCard
          title="Taxa de Conversão"
          value={`${data?.overview.conversionRate.toFixed(1) || 0}%`}
          icon={<Target size={24} />}
          color="green"
          subtitle="Trial → Pagante"
          trend={{ value: 5, isPositive: true }}
          loading={loading}
        />
        <MetricCard
          title="Convertidos"
          value={data?.overview.trialsConverted || 0}
          icon={<CheckCircle size={24} />}
          color="purple"
          subtitle="Últimos 30 dias"
          loading={loading}
        />
        <MetricCard
          title="Health Score Médio"
          value={data?.overview.averageHealthScore.toFixed(0) || 0}
          icon={<TrendingUp size={24} />}
          color={
            (data?.overview.averageHealthScore || 0) >= 80 ? 'green' :
            (data?.overview.averageHealthScore || 0) >= 60 ? 'yellow' :
            'red'
          }
          subtitle="De 0 a 100"
          loading={loading}
        />
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="text-sm font-medium text-gray-600 mb-2">Tempo Médio de Ativação</div>
          <div className="text-3xl font-bold text-gray-900 mb-1">
            {data?.overview.averageTimeToActivate || 0} dias
          </div>
          <div className="text-xs text-gray-500">
            {(data?.overview.averageTimeToActivate || 0) <= 7 ? '✅ Dentro da meta' : '⚠️ Acima da meta de 7 dias'}
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="text-sm font-medium text-gray-600 mb-2">Trials Expirados</div>
          <div className="text-3xl font-bold text-red-600 mb-1">
            {data?.overview.trialsExpired || 0}
          </div>
          <div className="text-xs text-gray-500">Últimos 30 dias</div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="text-sm font-medium text-gray-600 mb-2">Em Risco</div>
          <div className="text-3xl font-bold text-orange-600 mb-1">
            {data?.activeTrials.filter(t => t.healthScore < 60).length || 0}
          </div>
          <div className="text-xs text-gray-500">Trials com health score baixo</div>
        </div>
      </div>

      {/* Funnel Visualization */}
      <SuperAdminCard
        title="Funil de Onboarding"
        description="Etapas do processo de trial"
        loading={loading}
      >
        <div className="space-y-4">
          {funnelSteps.map((step, index) => (
            <div key={index}>
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-gray-900">{step.label}</span>
                <span className="text-sm text-gray-600">
                  {step.value} ({step.percentage.toFixed(1)}%)
                </span>
              </div>
              <div className="relative">
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div
                    className={`h-4 rounded-full transition-all ${
                      index === 0 ? 'bg-blue-500' :
                      index === 1 ? 'bg-green-500' :
                      index === 2 ? 'bg-purple-500' :
                      'bg-yellow-500'
                    }`}
                    style={{ width: `${step.percentage}%` }}
                  />
                </div>
                {index > 0 && step.percentage < 100 && (
                  <div className="absolute -top-6 right-0 text-xs text-red-600 font-medium">
                    ↓ {(100 - step.percentage).toFixed(1)}% drop-off
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </SuperAdminCard>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SuperAdminCard
          title="Conversões Mensais"
          description="Trials vs Conversões"
          loading={loading}
        >
          <BarChart
            data={data?.trends.conversionByMonth.flatMap(item => [
              { label: `${item.month} (T)`, value: item.trials, color: '#3b82f6' },
              { label: `${item.month} (C)`, value: item.conversions, color: '#22c55e' }
            ]) || []}
            height={300}
          />
          <div className="mt-4 flex justify-around text-sm">
            <div className="text-center">
              <div className="text-gray-500">Média Trials/Mês</div>
              <div className="text-xl font-bold text-blue-600">
                {data ? Math.round(data.trends.conversionByMonth.reduce((sum, m) => sum + m.trials, 0) / data.trends.conversionByMonth.length) : 0}
              </div>
            </div>
            <div className="text-center">
              <div className="text-gray-500">Média Conversões/Mês</div>
              <div className="text-xl font-bold text-green-600">
                {data ? Math.round(data.trends.conversionByMonth.reduce((sum, m) => sum + m.conversions, 0) / data.trends.conversionByMonth.length) : 0}
              </div>
            </div>
          </div>
        </SuperAdminCard>

        <SuperAdminCard
          title="Taxa de Conversão ao Longo do Tempo"
          description="Tendência de conversão"
          loading={loading}
        >
          <LineChart
            data={data?.trends.conversionByMonth.map(item => ({
              label: item.month,
              value: item.rate
            })) || []}
            color="hsl(142, 71%, 45%)"
            height={300}
          />
          <div className="mt-4 text-center">
            <div className="text-sm text-gray-500">Taxa Média</div>
            <div className="text-2xl font-bold text-green-600">
              {data ? (data.trends.conversionByMonth.reduce((sum, m) => sum + m.rate, 0) / data.trends.conversionByMonth.length).toFixed(1) : 0}%
            </div>
          </div>
        </SuperAdminCard>
      </div>

      {/* Active Trials */}
      <SuperAdminCard
        title={`Trials Ativos (${data?.activeTrials.length || 0})`}
        description="Clientes em período de teste"
        loading={loading}
      >
        <div className="space-y-3">
          {data?.activeTrials.map((trial) => {
            const progressPercentage = (trial.completedSteps / trial.totalSteps) * 100;
            const isAtRisk = trial.healthScore < 60 || trial.daysRemaining <= 3;

            return (
              <div
                key={trial.id}
                className={`p-4 rounded-lg border-2 transition-all ${
                  isAtRisk ? 'border-red-200 bg-red-50' : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Link
                        href={`/super-admin/dashboard/tenant/${trial.id}`}
                        className="text-lg font-semibold text-gray-900 hover:text-blue-600"
                      >
                        {trial.name}
                      </Link>
                      <PlanBadge plan={trial.plan} />
                      {isAtRisk && (
                        <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-full">
                          ⚠️ Em Risco
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Clock size={14} />
                        Expira em {trial.daysRemaining} dias
                      </span>
                      <span>Iniciado em {formatDate(trial.startedAt)}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full font-semibold ${getHealthScoreColor(trial.healthScore)}`}>
                      {getHealthScoreIcon(trial.healthScore)}
                      {trial.healthScore}/100
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Progresso de Setup</span>
                    <span className="font-medium text-gray-900">
                      {trial.completedSteps}/{trial.totalSteps} passos
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        progressPercentage === 100 ? 'bg-green-500' :
                        progressPercentage >= 70 ? 'bg-blue-500' :
                        'bg-yellow-500'
                      }`}
                      style={{ width: `${progressPercentage}%` }}
                    />
                  </div>
                </div>

                <div className="mt-3 flex gap-2">
                  <Link
                    href={`/super-admin/dashboard/tenant/${trial.id}`}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Ver Detalhes
                  </Link>
                  {isAtRisk && (
                    <button className="text-sm text-red-600 hover:text-red-800 font-medium">
                      Intervir Agora
                    </button>
                  )}
                </div>
              </div>
            );
          })}

          {data?.activeTrials.length === 0 && (
            <div className="text-center py-12">
              <Rocket size={48} className="mx-auto text-gray-300 mb-3" />
              <p className="text-gray-500 font-medium">Nenhum trial ativo no momento</p>
              <p className="text-sm text-gray-400 mt-1">Novos trials aparecerão aqui</p>
            </div>
          )}
        </div>
      </SuperAdminCard>

      {/* Recent Conversions */}
      <SuperAdminCard
        title="Conversões Recentes"
        description="Trials que viraram clientes pagantes"
        loading={loading}
      >
        <div className="space-y-3">
          {data?.recentConversions.map((conversion) => (
            <div
              key={conversion.id}
              className="p-4 bg-green-50 border border-green-200 rounded-lg"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <CheckCircle size={20} className="text-green-600" />
                    <Link
                      href={`/super-admin/dashboard/tenant/${conversion.id}`}
                      className="text-lg font-semibold text-gray-900 hover:text-green-600"
                    >
                      {conversion.name}
                    </Link>
                    <PlanBadge plan={conversion.plan} />
                  </div>
                  <div className="text-sm text-gray-600 ml-8">
                    Converteu após {conversion.daysInTrial} dias de trial •
                    Health Score final: {conversion.finalHealthScore}/100 •
                    {formatDate(conversion.convertedAt)}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {data?.recentConversions.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">Nenhuma conversão recente</p>
            </div>
          )}
        </div>
      </SuperAdminCard>

      {/* Insights and Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SuperAdminCard title="💡 Insights Automáticos">
          <div className="space-y-3">
            {data && data.overview.conversionRate >= 30 && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="font-semibold text-green-900 mb-1">✅ Taxa de conversão saudável</div>
                <div className="text-sm text-green-700">
                  {data.overview.conversionRate.toFixed(1)}% está acima da média do setor (25-30%)
                </div>
              </div>
            )}
            {data && data.activeTrials.filter(t => t.healthScore < 60).length > 0 && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="font-semibold text-red-900 mb-1">
                  ⚠️ {data.activeTrials.filter(t => t.healthScore < 60).length} trials em risco
                </div>
                <div className="text-sm text-red-700">
                  Recomendamos intervenção proativa para melhorar conversão
                </div>
              </div>
            )}
            {data && data.overview.averageTimeToActivate > 7 && (
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="font-semibold text-yellow-900 mb-1">⏱️ Ativação lenta</div>
                <div className="text-sm text-yellow-700">
                  Tempo médio de ativação ({data.overview.averageTimeToActivate} dias) pode ser otimizado
                </div>
              </div>
            )}
          </div>
        </SuperAdminCard>

        <SuperAdminCard title="🎯 Ações Recomendadas">
          <div className="space-y-2">
            <button className="w-full px-4 py-3 text-left bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="font-medium text-gray-900 mb-1">Enviar email de engajamento</div>
              <div className="text-sm text-gray-600">Para trials com baixo health score</div>
            </button>
            <button className="w-full px-4 py-3 text-left bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="font-medium text-gray-900 mb-1">Agendar call de onboarding</div>
              <div className="text-sm text-gray-600">Para trials expirando em 3 dias</div>
            </button>
            <button className="w-full px-4 py-3 text-left bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="font-medium text-gray-900 mb-1">Oferecer extensão de trial</div>
              <div className="text-sm text-gray-600">Para trials promissores próximos de expirar</div>
            </button>
          </div>
        </SuperAdminCard>
      </div>
    </div>
  );
}
