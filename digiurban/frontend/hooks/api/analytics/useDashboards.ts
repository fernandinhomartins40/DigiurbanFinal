import { useState, useEffect, useCallback } from 'react'
import { apiClient } from '@/lib/api'

export interface DashboardWidget {
  id: string
  type: 'kpi' | 'chart' | 'table' | 'metric' | 'alert' | 'recent_activity'
  title: string
  config: any
  position: {
    x: number
    y: number
    w: number
    h: number
  }
  refreshRate?: number
  dataSource: string
}

export interface Dashboard {
  id: string
  name: string
  description?: string
  layout: DashboardWidget[]
  userLevel: number
  department?: string
  isDefault: boolean
  refreshRate: number
  isActive: boolean
  createdBy: string
  createdAt: string
  updatedAt: string
}

export interface CreateDashboardData {
  name: string
  description?: string
  layout: DashboardWidget[]
  userLevel: number
  department?: string
  isDefault?: boolean
  refreshRate?: number
}

// Dashboards por nível de usuário
export interface CitizenDashboard {
  myProtocols: number
  activeProtocols: number
  completedProtocols: number
  averageRating: number
  recentProtocols: any[]
}

export interface EmployeeDashboard {
  assignedProtocols: number
  completedToday: number
  pendingProtocols: number
  averageRating: number
  workload: any[]
}

export interface CoordinatorDashboard {
  teamPerformance: any[]
  departmentKPIs: any[]
  workloadDistribution: any[]
  alerts: any[]
}

export interface ManagerDashboard {
  departmentMetrics: any[]
  serviceEfficiency: any[]
  citizenSatisfaction: number
  budgetUsage: number
}

export interface ExecutiveDashboard {
  municipalKPIs: any[]
  departmentComparison: any[]
  citizenSatisfaction: number
  budgetEfficiency: number
  strategicGoals: any[]
}

export interface SuperAdminDashboard {
  platformMetrics: any[]
  tenantPerformance: any[]
  revenueAnalytics: any[]
  systemHealth: any
}

export const useDashboards = () => {
  const [dashboards, setDashboards] = useState<Dashboard[]>([])
  const [currentDashboard, setCurrentDashboard] = useState<Dashboard | null>(null)
  const [dashboardData, setDashboardData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch dashboards
  const fetchDashboards = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.get('/dashboards')
      setDashboards(response.data.data)
    } catch (err: any) {
      setError('Falha ao carregar dashboards')
      console.error('Error fetching dashboards:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  // Buscar dashboard por nível de usuário
  const fetchDashboardByLevel = useCallback(async (level: string) => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.get(`/analytics/dashboard/${level}`)
      setDashboardData(response.data.data)
      return response.data.data
    } catch (err: any) {
      setError('Falha ao carregar dashboard')
      console.error('Error fetching dashboard by level:', err)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  // Criar dashboard customizado
  const createDashboard = useCallback(async (data: CreateDashboardData): Promise<Dashboard | null> => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.post('/dashboards', data)
      const newDashboard = response.data.data
      setDashboards(prev => [...prev, newDashboard])
      return newDashboard
    } catch (err: any) {
      setError('Falha ao criar dashboard')
      console.error('Error creating dashboard:', err)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  // Atualizar dashboard
  const updateDashboard = useCallback(async (id: string, data: Partial<CreateDashboardData>): Promise<Dashboard | null> => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.put(`/dashboards/${id}`, data)
      const updatedDashboard = response.data.data
      setDashboards(prev => prev.map(dashboard =>
        dashboard.id === id ? updatedDashboard : dashboard
      ))
      return updatedDashboard
    } catch (err: any) {
      setError('Falha ao atualizar dashboard')
      console.error('Error updating dashboard:', err)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  // Deletar dashboard
  const deleteDashboard = useCallback(async (id: string): Promise<boolean> => {
    try {
      setLoading(true)
      setError(null)
      await apiClient.delete(`/dashboards/${id}`)
      setDashboards(prev => prev.filter(dashboard => dashboard.id !== id))
      return true
    } catch (err: any) {
      setError('Falha ao deletar dashboard')
      console.error('Error deleting dashboard:', err)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  // Definir como padrão
  const setAsDefault = useCallback(async (id: string): Promise<boolean> => {
    try {
      setLoading(true)
      setError(null)
      await apiClient.put(`/dashboards/${id}/set-default`)
      // Atualizar estado local
      setDashboards(prev => prev.map(dashboard => ({
        ...dashboard,
        isDefault: dashboard.id === id
      })))
      return true
    } catch (err: any) {
      setError('Falha ao definir dashboard padrão')
      console.error('Error setting default dashboard:', err)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  // Templates de widgets
  const getWidgetTemplates = useCallback(() => {
    return [
      {
        type: 'kpi',
        title: 'KPI Card',
        config: {
          metric: 'total_protocols',
          target: 100,
          format: 'number'
        },
        size: { w: 3, h: 2 }
      },
      {
        type: 'chart',
        title: 'Line Chart',
        config: {
          chartType: 'line',
          metric: 'protocols_trend',
          period: '7d'
        },
        size: { w: 6, h: 4 }
      },
      {
        type: 'chart',
        title: 'Bar Chart',
        config: {
          chartType: 'bar',
          metric: 'department_performance',
          groupBy: 'department'
        },
        size: { w: 6, h: 4 }
      },
      {
        type: 'chart',
        title: 'Pie Chart',
        config: {
          chartType: 'pie',
          metric: 'protocol_status_distribution'
        },
        size: { w: 4, h: 4 }
      },
      {
        type: 'table',
        title: 'Data Table',
        config: {
          dataSource: 'recent_protocols',
          columns: ['id', 'citizen', 'status', 'created_at'],
          pageSize: 10
        },
        size: { w: 8, h: 6 }
      },
      {
        type: 'metric',
        title: 'Metric Display',
        config: {
          metric: 'satisfaction_score',
          format: 'percentage',
          color: 'blue'
        },
        size: { w: 2, h: 2 }
      },
      {
        type: 'alert',
        title: 'Active Alerts',
        config: {
          alertTypes: ['HIGH_DEMAND', 'DEADLINE_OVERDUE'],
          maxItems: 5
        },
        size: { w: 4, h: 4 }
      },
      {
        type: 'recent_activity',
        title: 'Recent Activity',
        config: {
          activityTypes: ['protocol_created', 'protocol_completed'],
          maxItems: 8
        },
        size: { w: 6, h: 6 }
      }
    ]
  }, [])

  // Templates de dashboards por nível
  const getDashboardTemplates = useCallback(() => {
    return {
      citizen: {
        name: 'Dashboard do Cidadão',
        description: 'Visão pessoal dos seus protocolos e serviços',
        widgets: [
          {
            type: 'kpi',
            title: 'Meus Protocolos',
            config: { metric: 'my_protocols_count' },
            position: { x: 0, y: 0, w: 3, h: 2 }
          },
          {
            type: 'chart',
            title: 'Status dos Protocolos',
            config: { chartType: 'pie', metric: 'my_protocols_status' },
            position: { x: 3, y: 0, w: 4, h: 4 }
          },
          {
            type: 'table',
            title: 'Protocolos Recentes',
            config: { dataSource: 'my_recent_protocols' },
            position: { x: 0, y: 2, w: 7, h: 4 }
          }
        ]
      },

      employee: {
        name: 'Dashboard do Funcionário',
        description: 'Acompanhe sua produtividade e tarefas',
        widgets: [
          {
            type: 'kpi',
            title: 'Protocolos Atribuídos',
            config: { metric: 'assigned_protocols' },
            position: { x: 0, y: 0, w: 3, h: 2 }
          },
          {
            type: 'kpi',
            title: 'Concluídos Hoje',
            config: { metric: 'completed_today' },
            position: { x: 3, y: 0, w: 3, h: 2 }
          },
          {
            type: 'chart',
            title: 'Performance Semanal',
            config: { chartType: 'line', metric: 'weekly_performance' },
            position: { x: 0, y: 2, w: 6, h: 4 }
          }
        ]
      },

      coordinator: {
        name: 'Dashboard do Coordenador',
        description: 'Gestão de equipe e departamento',
        widgets: [
          {
            type: 'chart',
            title: 'Performance da Equipe',
            config: { chartType: 'bar', metric: 'team_performance' },
            position: { x: 0, y: 0, w: 6, h: 4 }
          },
          {
            type: 'table',
            title: 'Distribuição de Carga',
            config: { dataSource: 'workload_distribution' },
            position: { x: 6, y: 0, w: 6, h: 4 }
          },
          {
            type: 'alert',
            title: 'Alertas Departamentais',
            config: { alertTypes: ['LOW_PERFORMANCE'] },
            position: { x: 0, y: 4, w: 4, h: 3 }
          }
        ]
      },

      manager: {
        name: 'Dashboard do Secretário',
        description: 'Visão estratégica da secretaria',
        widgets: [
          {
            type: 'kpi',
            title: 'Eficiência Geral',
            config: { metric: 'department_efficiency' },
            position: { x: 0, y: 0, w: 3, h: 2 }
          },
          {
            type: 'kpi',
            title: 'Satisfação dos Cidadãos',
            config: { metric: 'citizen_satisfaction' },
            position: { x: 3, y: 0, w: 3, h: 2 }
          },
          {
            type: 'chart',
            title: 'Tendências Mensais',
            config: { chartType: 'line', metric: 'monthly_trends' },
            position: { x: 0, y: 2, w: 8, h: 4 }
          }
        ]
      },

      executive: {
        name: 'Dashboard Executivo',
        description: 'Visão geral da administração municipal',
        widgets: [
          {
            type: 'kpi',
            title: 'Eficiência Municipal',
            config: { metric: 'municipal_efficiency' },
            position: { x: 0, y: 0, w: 2, h: 2 }
          },
          {
            type: 'kpi',
            title: 'NPS Geral',
            config: { metric: 'general_nps' },
            position: { x: 2, y: 0, w: 2, h: 2 }
          },
          {
            type: 'chart',
            title: 'Comparativo Secretarias',
            config: { chartType: 'bar', metric: 'department_comparison' },
            position: { x: 0, y: 2, w: 8, h: 4 }
          },
          {
            type: 'chart',
            title: 'Metas Estratégicas',
            config: { chartType: 'gauge', metric: 'strategic_goals' },
            position: { x: 8, y: 0, w: 4, h: 6 }
          }
        ]
      }
    }
  }, [])

  // Helpers
  const getDashboardByLevel = useCallback((level: number) => {
    return dashboards.find(dashboard => dashboard.userLevel === level && dashboard.isDefault)
  }, [dashboards])

  const getCustomDashboards = useCallback(() => {
    return dashboards.filter(dashboard => !dashboard.isDefault)
  }, [dashboards])

  // Inicializar
  useEffect(() => {
    fetchDashboards()
  }, [fetchDashboards])

  return {
    // Estados
    dashboards,
    currentDashboard,
    dashboardData,
    loading,
    error,

    // Ações
    fetchDashboards,
    fetchDashboardByLevel,
    createDashboard,
    updateDashboard,
    deleteDashboard,
    setAsDefault,

    // Helpers
    getWidgetTemplates,
    getDashboardTemplates,
    getDashboardByLevel,
    getCustomDashboards,

    // Estados locais
    setCurrentDashboard
  }
}