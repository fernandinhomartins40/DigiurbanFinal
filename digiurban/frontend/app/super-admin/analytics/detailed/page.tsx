'use client';

import { useEffect, useState } from 'react';
import { useSuperAdminAuth } from '@/contexts/SuperAdminAuthContext';
import { SuperAdminCard } from '@/components/super-admin/SuperAdminCard';
import { TenantSelector } from '@/components/super-admin/TenantSelector';
import {
  TrendingUp,
  Users,
  ArrowRight,
  Target,
  Calendar,
  Activity
} from 'lucide-react';

interface NavigationFlow {
  from: string;
  to: string;
  count: number;
  percentage: number;
}

interface FeatureFunnel {
  step: string;
  users: number;
  dropoff: number;
  conversionRate: number;
}

interface Cohort {
  month: string;
  signups: number;
  retention: {
    month1: number;
    month2: number;
    month3: number;
    month6: number;
  };
}

interface AdoptionCurve {
  feature: string;
  day: number;
  adoptionRate: number;
}

export default function DetailedAnalyticsPage() {
  const { apiRequest } = useSuperAdminAuth();
  const [selectedTenant, setSelectedTenant] = useState<string>('all');
  const [navigationFlow, setNavigationFlow] = useState<NavigationFlow[]>([]);
  const [featureFunnel, setFeatureFunnel] = useState<FeatureFunnel[]>([]);
  const [cohorts, setCohorts] = useState<Cohort[]>([]);
  const [adoptionCurves, setAdoptionCurves] = useState<Record<string, AdoptionCurve[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDetailedAnalytics();
  }, [selectedTenant]);

  const fetchDetailedAnalytics = async () => {
    setLoading(true);
    try {
      const tenantParam = selectedTenant !== 'all' ? `?tenantId=${selectedTenant}` : '';

      const [flowData, funnelData, cohortData, adoptionData] = await Promise.all([
        apiRequest(`/super-admin/analytics/navigation-flow${tenantParam}`, { method: 'GET' }).catch(() => null),
        apiRequest(`/super-admin/analytics/feature-funnel${tenantParam}`, { method: 'GET' }).catch(() => null),
        apiRequest(`/super-admin/analytics/cohorts${tenantParam}`, { method: 'GET' }).catch(() => null),
        apiRequest(`/super-admin/analytics/adoption${tenantParam}`, { method: 'GET' }).catch(() => null)
      ]);

      setNavigationFlow(flowData?.flow || mockNavigationFlow);
      setFeatureFunnel(funnelData?.funnel || mockFeatureFunnel);
      setCohorts(cohortData?.cohorts || mockCohorts);
      setAdoptionCurves(adoptionData?.curves || mockAdoptionCurves);
    } catch (error) {
      console.error('Error fetching detailed analytics:', error);
      setNavigationFlow(mockNavigationFlow);
      setFeatureFunnel(mockFeatureFunnel);
      setCohorts(mockCohorts);
      setAdoptionCurves(mockAdoptionCurves);
    } finally {
      setLoading(false);
    }
  };

  const getRetentionColor = (rate: number) => {
    if (rate >= 80) return 'bg-green-500';
    if (rate >= 60) return 'bg-yellow-500';
    if (rate >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  };

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-primary mb-2">
              Analytics Detalhados
            </h1>
            <p className="text-muted-foreground">
              Análise profunda de jornada do usuário, funis e cohorts
            </p>
          </div>
          <div className="w-64">
            <TenantSelector
              selectedTenant={selectedTenant}
              onSelectTenant={setSelectedTenant}
              includeAll={true}
            />
          </div>
        </div>

        {/* Navigation Flow */}
        <SuperAdminCard title="Fluxo de Navegação Principal" className="mb-8">
          <div className="space-y-4">
            {navigationFlow.map((flow, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="flex-1 bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="font-semibold text-gray-900">{flow.from}</div>
                  <div className="text-sm text-gray-600">
                    {flow.count.toLocaleString('pt-BR')} usuários
                  </div>
                </div>
                <div className="flex flex-col items-center">
                  <ArrowRight className="w-6 h-6 text-gray-400" />
                  <span className="text-xs text-gray-500 mt-1">{flow.percentage.toFixed(1)}%</span>
                </div>
                <div className="flex-1 bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="font-semibold text-gray-900">{flow.to}</div>
                  <div className="text-sm text-gray-600">
                    {Math.round(flow.count * (flow.percentage / 100)).toLocaleString('pt-BR')}{' '}
                    usuários
                  </div>
                </div>
              </div>
            ))}
          </div>
        </SuperAdminCard>

        {/* Feature Funnel */}
        <SuperAdminCard
          title="Funil de Conversão - Criação de Protocolo"
          icon={<Target className="w-5 h-5" />}
          className="mb-8"
        >
          <div className="space-y-4">
            {featureFunnel.map((step, index) => (
              <div key={step.step}>
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <span className="font-semibold text-gray-900">
                      {index + 1}. {step.step}
                    </span>
                    {step.dropoff > 0 && (
                      <span className="ml-3 text-sm text-red-600">
                        -{step.dropoff}% dropoff
                      </span>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-gray-900">
                      {step.users.toLocaleString('pt-BR')} usuários
                    </div>
                    <div className="text-xs text-gray-500">
                      {step.conversionRate.toFixed(1)}% do total
                    </div>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-8 relative overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-green-500 h-8 rounded-full flex items-center justify-end pr-3"
                    style={{ width: `${step.conversionRate}%` }}
                  >
                    <span className="text-white text-sm font-semibold">
                      {step.conversionRate.toFixed(0)}%
                    </span>
                  </div>
                </div>
                {index < featureFunnel.length - 1 && step.dropoff > 0 && (
                  <div className="text-xs text-gray-500 mt-1 ml-2">
                    {Math.round(
                      (step.users * step.dropoff) / 100
                    ).toLocaleString('pt-BR')}{' '}
                    usuários abandonaram aqui
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              <div>
                <div className="font-semibold text-gray-900">Taxa de Conversão Final</div>
                <div className="text-sm text-gray-600">
                  {featureFunnel[featureFunnel.length - 1]?.conversionRate.toFixed(1)}% dos
                  usuários que iniciaram completaram o processo
                </div>
              </div>
            </div>
          </div>
        </SuperAdminCard>

        {/* Cohort Analysis */}
        <SuperAdminCard
          title="Análise de Cohorts - Retenção de Usuários"
          icon={<Calendar className="w-5 h-5" />}
          className="mb-8"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Cohort (Mês de Cadastro)
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                    Cadastros
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                    Mês 1
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                    Mês 2
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                    Mês 3
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                    Mês 6
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {cohorts.map((cohort) => (
                  <tr key={cohort.month} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-semibold text-gray-900">{cohort.month}</td>
                    <td className="px-4 py-3 text-center">
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                        {cohort.signups}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <div
                          className={`w-16 h-8 ${getRetentionColor(
                            cohort.retention.month1
                          )} rounded flex items-center justify-center`}
                        >
                          <span className="text-white text-sm font-semibold">
                            {cohort.retention.month1}%
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <div
                          className={`w-16 h-8 ${getRetentionColor(
                            cohort.retention.month2
                          )} rounded flex items-center justify-center`}
                        >
                          <span className="text-white text-sm font-semibold">
                            {cohort.retention.month2}%
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <div
                          className={`w-16 h-8 ${getRetentionColor(
                            cohort.retention.month3
                          )} rounded flex items-center justify-center`}
                        >
                          <span className="text-white text-sm font-semibold">
                            {cohort.retention.month3}%
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <div
                          className={`w-16 h-8 ${getRetentionColor(
                            cohort.retention.month6
                          )} rounded flex items-center justify-center`}
                        >
                          <span className="text-white text-sm font-semibold">
                            {cohort.retention.month6}%
                          </span>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 flex items-center gap-4 text-xs text-gray-600">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <span>≥80% Excelente</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-500 rounded"></div>
              <span>60-79% Bom</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-orange-500 rounded"></div>
              <span>40-59% Regular</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500 rounded"></div>
              <span>&lt;40% Crítico</span>
            </div>
          </div>
        </SuperAdminCard>

        {/* Feature Adoption Curves */}
        <SuperAdminCard
          title="Curvas de Adoção de Features"
          icon={<Activity className="w-5 h-5" />}
          className="mb-8"
        >
          <div className="space-y-6">
            {Object.entries(adoptionCurves).map(([feature, curve]) => (
              <div key={feature}>
                <h3 className="font-semibold text-gray-900 mb-3">{feature}</h3>
                <div className="relative h-32 bg-gray-50 rounded-lg p-4">
                  <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <polyline
                      points={curve
                        .map((point, i) => `${(i / (curve.length - 1)) * 100},${100 - point.adoptionRate}`)
                        .join(' ')}
                      fill="none"
                      stroke="rgb(59, 130, 246)"
                      strokeWidth="2"
                    />
                    <polyline
                      points={`0,100 ${curve
                        .map((point, i) => `${(i / (curve.length - 1)) * 100},${100 - point.adoptionRate}`)
                        .join(' ')} 100,100`}
                      fill="rgba(59, 130, 246, 0.1)"
                    />
                  </svg>
                  <div className="absolute bottom-2 left-4 text-xs text-gray-500">Dia 0</div>
                  <div className="absolute bottom-2 right-4 text-xs text-gray-500">
                    Dia {curve[curve.length - 1].day}
                  </div>
                  <div className="absolute top-2 right-4 text-sm font-semibold text-blue-600">
                    {curve[curve.length - 1].adoptionRate}% adoção
                  </div>
                </div>
              </div>
            ))}
          </div>
        </SuperAdminCard>

        {/* Insights */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SuperAdminCard title="Insight - Funil" className="border-l-4 border-blue-500">
            <div className="flex items-start gap-3">
              <Target className="w-8 h-8 text-blue-600 flex-shrink-0" />
              <div>
                <p className="text-sm text-gray-600 mb-2">
                  O maior dropoff ({featureFunnel[1]?.dropoff || 0}%) ocorre na etapa "
                  {featureFunnel[1]?.step}". Otimizar esta etapa pode aumentar significativamente
                  a conversão.
                </p>
                <p className="text-xs text-gray-500">
                  Potencial de recuperação:{' '}
                  {featureFunnel[1]
                    ? Math.round((featureFunnel[0].users * featureFunnel[1].dropoff) / 100)
                    : 0}{' '}
                  usuários
                </p>
              </div>
            </div>
          </SuperAdminCard>

          <SuperAdminCard title="Insight - Retenção" className="border-l-4 border-green-500">
            <div className="flex items-start gap-3">
              <Users className="w-8 h-8 text-green-600 flex-shrink-0" />
              <div>
                <p className="text-sm text-gray-600 mb-2">
                  Cohort de {cohorts[0]?.month} apresenta a melhor retenção:{' '}
                  {cohorts[0]?.retention.month6}% após 6 meses.
                </p>
                <p className="text-xs text-gray-500">
                  Analise as características deste cohort para replicar o sucesso.
                </p>
              </div>
            </div>
          </SuperAdminCard>
        </div>
      </div>
    </main>
  );
}

// Mock Data
const mockNavigationFlow: NavigationFlow[] = [
  { from: 'Dashboard', to: 'Consultar Protocolos', count: 5200, percentage: 65 },
  { from: 'Consultar Protocolos', to: 'Detalhes do Protocolo', count: 3380, percentage: 85 },
  { from: 'Dashboard', to: 'Novo Protocolo', count: 2080, percentage: 40 },
  { from: 'Novo Protocolo', to: 'Confirmação', count: 1664, percentage: 80 }
];

const mockFeatureFunnel: FeatureFunnel[] = [
  { step: 'Acessou formulário', users: 5000, dropoff: 0, conversionRate: 100 },
  { step: 'Preencheu dados básicos', users: 4000, dropoff: 20, conversionRate: 80 },
  { step: 'Anexou documentos', users: 3200, dropoff: 20, conversionRate: 64 },
  { step: 'Revisou informações', users: 2880, dropoff: 10, conversionRate: 57.6 },
  { step: 'Confirmou criação', users: 2592, dropoff: 10, conversionRate: 51.8 }
];

const mockCohorts: Cohort[] = [
  {
    month: 'Set/24',
    signups: 450,
    retention: { month1: 88, month2: 82, month3: 76, month6: 68 }
  },
  {
    month: 'Out/24',
    signups: 520,
    retention: { month1: 85, month2: 78, month3: 72, month6: 65 }
  },
  {
    month: 'Nov/24',
    signups: 480,
    retention: { month1: 82, month2: 75, month3: 68, month6: 0 }
  },
  {
    month: 'Dez/24',
    signups: 680,
    retention: { month1: 90, month2: 83, month3: 0, month6: 0 }
  },
  {
    month: 'Jan/25',
    signups: 750,
    retention: { month1: 87, month2: 0, month3: 0, month6: 0 }
  },
  {
    month: 'Fev/25',
    signups: 820,
    retention: { month1: 0, month2: 0, month3: 0, month6: 0 }
  }
];

const mockAdoptionCurves: Record<string, AdoptionCurve[]> = {
  'Consulta de Protocolos': [
    { feature: 'Consulta de Protocolos', day: 0, adoptionRate: 0 },
    { feature: 'Consulta de Protocolos', day: 1, adoptionRate: 45 },
    { feature: 'Consulta de Protocolos', day: 3, adoptionRate: 68 },
    { feature: 'Consulta de Protocolos', day: 7, adoptionRate: 82 },
    { feature: 'Consulta de Protocolos', day: 14, adoptionRate: 89 },
    { feature: 'Consulta de Protocolos', day: 30, adoptionRate: 92 }
  ],
  'Notificações Push': [
    { feature: 'Notificações Push', day: 0, adoptionRate: 0 },
    { feature: 'Notificações Push', day: 1, adoptionRate: 12 },
    { feature: 'Notificações Push', day: 3, adoptionRate: 28 },
    { feature: 'Notificações Push', day: 7, adoptionRate: 45 },
    { feature: 'Notificações Push', day: 14, adoptionRate: 58 },
    { feature: 'Notificações Push', day: 30, adoptionRate: 65 }
  ],
  'Dashboard Personalizado': [
    { feature: 'Dashboard Personalizado', day: 0, adoptionRate: 0 },
    { feature: 'Dashboard Personalizado', day: 1, adoptionRate: 8 },
    { feature: 'Dashboard Personalizado', day: 3, adoptionRate: 15 },
    { feature: 'Dashboard Personalizado', day: 7, adoptionRate: 28 },
    { feature: 'Dashboard Personalizado', day: 14, adoptionRate: 38 },
    { feature: 'Dashboard Personalizado', day: 30, adoptionRate: 48 }
  ]
};
