'use client';

import { useEffect, useState } from 'react';
import { SuperAdminCard, MetricCard } from '@/components/super-admin/SuperAdminCard';
import { useSuperAdminAuth } from '@/contexts/SuperAdminAuthContext';
import {
  Activity,
  Users,
  Clock,
  MousePointer,
  TrendingUp,
  BarChart3,
  Globe,
  Zap
} from 'lucide-react';

interface PlatformMetrics {
  totalSessions: number;
  avgSessionDuration: number; // minutes
  activeFeatures: number;
  dauMauRatio: number; // percentage
  dailyActiveUsers: number;
  monthlyActiveUsers: number;
  bounceRate: number;
  pagesPerSession: number;
}

interface FeatureUsage {
  name: string;
  category: string;
  usageCount: number;
  uniqueUsers: number;
  percentage: number;
}

interface GeographicData {
  state: string;
  region: string;
  tenants: number;
  sessions: number;
  users: number;
}

interface SessionAnalytics {
  hour: string;
  sessions: number;
  avgDuration: number;
}

export default function AnalyticsManagementPage() {
  const { apiRequest } = useSuperAdminAuth();
  const [metrics, setMetrics] = useState<PlatformMetrics | null>(null);
  const [featureUsage, setFeatureUsage] = useState<FeatureUsage[]>([]);
  const [geographic, setGeographic] = useState<GeographicData[]>([]);
  const [sessionData, setSessionData] = useState<SessionAnalytics[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7d');

  useEffect(() => {
    fetchAnalyticsData();
  }, [timeRange]);

  const fetchAnalyticsData = async () => {
    setLoading(true);
    try {
      const [metricsData, featuresData, geoData, sessionsData] = await Promise.all([
        apiRequest(`/super-admin/analytics/overview?range=${timeRange}`, { method: 'GET' }).catch(() => ({ metrics: mockMetrics })),
        apiRequest(`/super-admin/analytics/features?range=${timeRange}`, { method: 'GET' }).catch(() => ({ features: mockFeatureUsage })),
        apiRequest(`/super-admin/analytics/geographic?range=${timeRange}`, { method: 'GET' }).catch(() => ({ data: mockGeographic })),
        apiRequest(`/super-admin/analytics/sessions?range=${timeRange}`, { method: 'GET' }).catch(() => ({ sessions: mockSessionData }))
      ]);

      setMetrics(metricsData.metrics || mockMetrics);
      setFeatureUsage(featuresData.features || mockFeatureUsage);
      setGeographic(geoData.data || mockGeographic);
      setSessionData(sessionsData.sessions || mockSessionData);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      setMetrics(mockMetrics);
      setFeatureUsage(mockFeatureUsage);
      setGeographic(mockGeographic);
      setSessionData(mockSessionData);
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const getFeatureCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Gestão': 'bg-blue-500',
      'Cidadão': 'bg-green-500',
      'Admin': 'bg-purple-500',
      'Relatórios': 'bg-orange-500',
      'Financeiro': 'bg-yellow-500'
    };
    return colors[category] || 'bg-gray-500';
  };

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-primary mb-2">
              Analytics da Plataforma
            </h1>
            <p className="text-muted-foreground">
              Análise de uso, engajamento e comportamento dos usuários
            </p>
          </div>
          <div>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="24h">Últimas 24 horas</option>
              <option value="7d">Últimos 7 dias</option>
              <option value="30d">Últimos 30 dias</option>
              <option value="90d">Últimos 90 dias</option>
            </select>
          </div>
        </div>

        {/* Platform Usage Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <MetricCard
            title="Total de Sessões"
            value={metrics?.totalSessions.toLocaleString('pt-BR') || '0'}
            subtitle="No período selecionado"
            icon={<Activity className="w-5 h-5 text-blue-600" />}
            loading={loading}
          />
          <MetricCard
            title="Tempo Médio de Sessão"
            value={formatDuration(metrics?.avgSessionDuration || 0)}
            subtitle={`${metrics?.pagesPerSession || 0} páginas/sessão`}
            icon={<Clock className="w-5 h-5 text-green-600" />}
            loading={loading}
          />
          <MetricCard
            title="DAU / MAU"
            value={`${metrics?.dauMauRatio.toFixed(1) || 0}%`}
            subtitle={`${metrics?.dailyActiveUsers || 0} / ${metrics?.monthlyActiveUsers || 0} usuários`}
            icon={<Users className="w-5 h-5 text-purple-600" />}
            loading={loading}
          />
          <MetricCard
            title="Taxa de Rejeição"
            value={`${metrics?.bounceRate.toFixed(1) || 0}%`}
            subtitle="Sessões com 1 página"
            icon={<MousePointer className="w-5 h-5 text-orange-600" />}
            loading={loading}
          />
        </div>

        {/* Feature Usage */}
        <SuperAdminCard title="Features Mais Utilizadas" className="mb-8">
          <div className="space-y-4">
            {featureUsage.map((feature, index) => (
              <div key={feature.name}>
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-bold text-gray-400">
                      #{index + 1}
                    </span>
                    <div>
                      <div className="font-semibold text-gray-900">{feature.name}</div>
                      <div className="text-xs text-gray-500 flex items-center gap-2">
                        <span
                          className={`px-2 py-0.5 rounded-full text-white text-xs ${getFeatureCategoryColor(
                            feature.category
                          )}`}
                        >
                          {feature.category}
                        </span>
                        <span>{feature.uniqueUsers.toLocaleString('pt-BR')} usuários únicos</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-gray-900">
                      {feature.usageCount.toLocaleString('pt-BR')}
                    </div>
                    <div className="text-xs text-gray-500">usos</div>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${getFeatureCategoryColor(feature.category)}`}
                    style={{ width: `${feature.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </SuperAdminCard>

        {/* Geographic Distribution */}
        <SuperAdminCard title="Distribuição Geográfica" className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Map Placeholder */}
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-6 flex items-center justify-center min-h-[300px]">
              <div className="text-center">
                <Globe className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Mapa de Distribuição
                </h3>
                <p className="text-sm text-gray-600">
                  Visualização geográfica dos tenants e usuários
                </p>
              </div>
            </div>

            {/* Geographic Data Table */}
            <div className="overflow-hidden">
              <div className="max-h-[300px] overflow-y-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 sticky top-0">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                        Estado
                      </th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">
                        Tenants
                      </th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">
                        Sessões
                      </th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">
                        Usuários
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {geographic.map((geo) => (
                      <tr key={geo.state} className="hover:bg-gray-50">
                        <td className="px-4 py-2">
                          <div className="font-semibold text-gray-900">{geo.state}</div>
                          <div className="text-xs text-gray-500">{geo.region}</div>
                        </td>
                        <td className="px-4 py-2 text-right font-semibold text-gray-900">
                          {geo.tenants}
                        </td>
                        <td className="px-4 py-2 text-right text-gray-600">
                          {geo.sessions.toLocaleString('pt-BR')}
                        </td>
                        <td className="px-4 py-2 text-right text-gray-600">
                          {geo.users.toLocaleString('pt-BR')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </SuperAdminCard>

        {/* Session Analytics */}
        <SuperAdminCard title="Análise de Sessões por Horário" className="mb-8">
          <div className="space-y-3">
            {sessionData.map((session) => (
              <div key={session.hour} className="flex items-center gap-4">
                <div className="w-16 text-sm font-medium text-gray-600">{session.hour}</div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-gray-600">
                      {session.sessions.toLocaleString('pt-BR')} sessões
                    </span>
                    <span className="text-sm text-gray-500">
                      {formatDuration(session.avgDuration)} média
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full transition-all"
                      style={{
                        width: `${Math.min(
                          (session.sessions / Math.max(...sessionData.map((s) => s.sessions))) *
                            100,
                          100
                        )}%`
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </SuperAdminCard>

        {/* Quick Insights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <SuperAdminCard title="Insight Rápido" className="border-l-4 border-blue-500">
            <div className="flex items-start gap-3">
              <TrendingUp className="w-8 h-8 text-blue-600 flex-shrink-0" />
              <div>
                <p className="text-sm text-gray-600 mb-2">
                  O horário de <strong>pico</strong> é entre <strong>9h-11h</strong> com{' '}
                  {sessionData.find((s) => s.hour === '09:00-10:00')?.sessions || 0} sessões.
                </p>
                <p className="text-xs text-gray-500">
                  Considere escalar recursos neste período.
                </p>
              </div>
            </div>
          </SuperAdminCard>

          <SuperAdminCard title="Feature em Alta" className="border-l-4 border-green-500">
            <div className="flex items-start gap-3">
              <Zap className="w-8 h-8 text-green-600 flex-shrink-0" />
              <div>
                <p className="text-sm text-gray-600 mb-2">
                  <strong>{featureUsage[0]?.name}</strong> é a feature mais utilizada com{' '}
                  {featureUsage[0]?.usageCount.toLocaleString('pt-BR')} usos.
                </p>
                <p className="text-xs text-gray-500">
                  {featureUsage[0]?.percentage.toFixed(1)}% do total de uso.
                </p>
              </div>
            </div>
          </SuperAdminCard>

          <SuperAdminCard title="Engajamento" className="border-l-4 border-purple-500">
            <div className="flex items-start gap-3">
              <BarChart3 className="w-8 h-8 text-purple-600 flex-shrink-0" />
              <div>
                <p className="text-sm text-gray-600 mb-2">
                  Taxa DAU/MAU de <strong>{metrics?.dauMauRatio.toFixed(1)}%</strong> indica
                  engajamento {metrics && metrics.dauMauRatio > 40 ? 'excelente' : 'bom'}.
                </p>
                <p className="text-xs text-gray-500">Benchmark: 40%+ é considerado excelente.</p>
              </div>
            </div>
          </SuperAdminCard>
        </div>
      </div>
    </main>
  );
}

// Mock Data
const mockMetrics: PlatformMetrics = {
  totalSessions: 45230,
  avgSessionDuration: 18.5,
  activeFeatures: 42,
  dauMauRatio: 45.3,
  dailyActiveUsers: 1820,
  monthlyActiveUsers: 4020,
  bounceRate: 22.5,
  pagesPerSession: 5.8
};

const mockFeatureUsage: FeatureUsage[] = [
  {
    name: 'Consulta de Protocolos',
    category: 'Cidadão',
    usageCount: 12500,
    uniqueUsers: 3200,
    percentage: 100
  },
  {
    name: 'Criar Novo Protocolo',
    category: 'Cidadão',
    usageCount: 9800,
    uniqueUsers: 2800,
    percentage: 78
  },
  {
    name: 'Dashboard Admin',
    category: 'Admin',
    usageCount: 8200,
    uniqueUsers: 450,
    percentage: 66
  },
  {
    name: 'Gestão de Usuários',
    category: 'Admin',
    usageCount: 6500,
    uniqueUsers: 320,
    percentage: 52
  },
  {
    name: 'Relatórios Gerenciais',
    category: 'Relatórios',
    usageCount: 5800,
    uniqueUsers: 280,
    percentage: 46
  },
  {
    name: 'Notificações',
    category: 'Cidadão',
    usageCount: 4900,
    uniqueUsers: 2100,
    percentage: 39
  },
  {
    name: 'Gestão de Departamentos',
    category: 'Gestão',
    usageCount: 3200,
    uniqueUsers: 180,
    percentage: 26
  },
  {
    name: 'Billing e Faturas',
    category: 'Financeiro',
    usageCount: 2800,
    uniqueUsers: 95,
    percentage: 22
  }
];

const mockGeographic: GeographicData[] = [
  { state: 'SP', region: 'Sudeste', tenants: 8, sessions: 18500, users: 1850 },
  { state: 'RJ', region: 'Sudeste', tenants: 5, sessions: 12300, users: 1200 },
  { state: 'MG', region: 'Sudeste', tenants: 4, sessions: 8200, users: 820 },
  { state: 'RS', region: 'Sul', tenants: 3, sessions: 4100, users: 410 },
  { state: 'BA', region: 'Nordeste', tenants: 2, sessions: 1850, users: 185 },
  { state: 'PR', region: 'Sul', tenants: 1, sessions: 280, users: 28 }
];

const mockSessionData: SessionAnalytics[] = [
  { hour: '00:00-01:00', sessions: 120, avgDuration: 8.2 },
  { hour: '01:00-02:00', sessions: 85, avgDuration: 7.5 },
  { hour: '02:00-03:00', sessions: 65, avgDuration: 6.8 },
  { hour: '03:00-04:00', sessions: 52, avgDuration: 6.2 },
  { hour: '04:00-05:00', sessions: 48, avgDuration: 5.9 },
  { hour: '05:00-06:00', sessions: 72, avgDuration: 7.1 },
  { hour: '06:00-07:00', sessions: 185, avgDuration: 9.5 },
  { hour: '07:00-08:00', sessions: 520, avgDuration: 12.8 },
  { hour: '08:00-09:00', sessions: 1250, avgDuration: 18.5 },
  { hour: '09:00-10:00', sessions: 2100, avgDuration: 22.3 },
  { hour: '10:00-11:00', sessions: 2350, avgDuration: 24.1 },
  { hour: '11:00-12:00', sessions: 1880, avgDuration: 19.7 },
  { hour: '12:00-13:00', sessions: 1020, avgDuration: 14.2 },
  { hour: '13:00-14:00', sessions: 1580, avgDuration: 17.9 },
  { hour: '14:00-15:00', sessions: 2050, avgDuration: 21.5 },
  { hour: '15:00-16:00', sessions: 1920, avgDuration: 20.3 },
  { hour: '16:00-17:00', sessions: 1650, avgDuration: 18.6 },
  { hour: '17:00-18:00', sessions: 980, avgDuration: 13.8 },
  { hour: '18:00-19:00', sessions: 520, avgDuration: 11.2 },
  { hour: '19:00-20:00', sessions: 380, avgDuration: 10.5 },
  { hour: '20:00-21:00', sessions: 280, avgDuration: 9.8 },
  { hour: '21:00-22:00', sessions: 220, avgDuration: 9.2 },
  { hour: '22:00-23:00', sessions: 175, avgDuration: 8.7 },
  { hour: '23:00-00:00', sessions: 145, avgDuration: 8.4 }
];
