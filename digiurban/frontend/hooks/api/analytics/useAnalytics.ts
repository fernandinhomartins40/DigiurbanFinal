import { useState, useEffect, useCallback } from 'react'
import { apiClient } from '@/lib/api'

export interface AnalyticsFilters {
  type?: string
  metric?: string
  entityId?: string
  periodType?: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly'
  startDate?: string
  endDate?: string
  department?: string
}

export interface KPI {
  id: string
  name: string
  description?: string
  category: string
  formula: string
  unit: string
  target?: number
  warning?: number
  critical?: number
  currentValue?: number
  status: 'good' | 'warning' | 'critical' | 'normal'
  trend: 'up' | 'down' | 'stable'
  lastCalculated?: string
  isActive: boolean
  updateFrequency: string
}

export interface RealtimeMetrics {
  totalProtocols: number
  activeProtocols: number
  completedToday: number
  averageResolutionTime: number
  satisfactionScore: number
  completionRate: number
}

export interface TrendData {
  periods: string[]
  metrics: Record<string, Array<{
    period: string
    value: number
    count: number
  }>>
}

export interface DashboardData {
  // Dados específicos variam por nível de usuário
  [key: string]: any
}

export const useAnalytics = () => {
  const [realtimeMetrics, setRealtimeMetrics] = useState<RealtimeMetrics | null>(null)
  const [kpis, setKpis] = useState<KPI[]>([])
  const [trends, setTrends] = useState<TrendData | null>(null)
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch métricas em tempo real
  const fetchRealtimeMetrics = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.get('/analytics/realtime')
      setRealtimeMetrics(response.data.data.kpis)
    } catch (err: any) {
      setError('Falha ao carregar métricas em tempo real')
      console.error('Error fetching realtime metrics:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  // Fetch KPIs
  const fetchKPIs = useCallback(async (filters?: AnalyticsFilters) => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.get('/analytics/kpis', { params: filters })
      setKpis(response.data.data)
    } catch (err: any) {
      setError('Falha ao carregar KPIs')
      console.error('Error fetching KPIs:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  // Fetch tendências
  const fetchTrends = useCallback(async (filters?: AnalyticsFilters) => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.get('/analytics/trends', { params: filters })
      setTrends(response.data.data)
    } catch (err: any) {
      setError('Falha ao carregar tendências')
      console.error('Error fetching trends:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  // Fetch dashboard por nível
  const fetchDashboard = useCallback(async (level: string) => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.get(`/analytics/dashboard/${level}`)
      setDashboardData(response.data.data)
    } catch (err: any) {
      setError('Falha ao carregar dashboard')
      console.error('Error fetching dashboard:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  // Buscar métricas por tipo
  const getMetricsByType = useCallback((type: string) => {
    return kpis.filter(kpi => kpi.category === type)
  }, [kpis])

  // Buscar KPIs críticos
  const getCriticalKPIs = useCallback(() => {
    return kpis.filter(kpi => kpi.status === 'critical')
  }, [kpis])

  // Buscar KPIs com tendência negativa
  const getDecreasingKPIs = useCallback(() => {
    return kpis.filter(kpi => kpi.trend === 'down')
  }, [kpis])

  // Calcular score geral de performance
  const getOverallPerformanceScore = useCallback(() => {
    if (kpis.length === 0) return 0

    const scores = kpis.map(kpi => {
      if (kpi.status === 'good') return 100
      if (kpi.status === 'normal') return 75
      if (kpi.status === 'warning') return 50
      if (kpi.status === 'critical') return 25
      return 0
    })

    return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
  }, [kpis])

  // Auto-refresh para métricas em tempo real
  useEffect(() => {
    fetchRealtimeMetrics()
    const interval = setInterval(fetchRealtimeMetrics, 60000) // 1 minuto
    return () => clearInterval(interval)
  }, [fetchRealtimeMetrics])

  return {
    // Estados
    realtimeMetrics,
    kpis,
    trends,
    dashboardData,
    loading,
    error,

    // Ações
    fetchRealtimeMetrics,
    fetchKPIs,
    fetchTrends,
    fetchDashboard,

    // Helpers
    getMetricsByType,
    getCriticalKPIs,
    getDecreasingKPIs,
    getOverallPerformanceScore
  }
}