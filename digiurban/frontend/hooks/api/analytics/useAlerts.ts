import { useState, useEffect, useCallback } from 'react'
import { apiClient } from '@/lib/api'

export interface Alert {
  id: string
  name: string
  description?: string
  type: 'DEADLINE_OVERDUE' | 'LOW_PERFORMANCE' | 'HIGH_DEMAND' | 'LOW_SATISFACTION' | 'SYSTEM_OVERLOAD' | 'BUDGET_ALERT'
  metric: string
  condition: 'greater' | 'less' | 'equal' | 'between'
  threshold: number
  threshold2?: number
  frequency: 'REALTIME' | 'DAILY' | 'WEEKLY' | 'MONTHLY'
  recipients: string[]
  channels: ('email' | 'sms' | 'web' | 'push')[]
  isActive: boolean
  cooldown: number
  lastTriggered?: string
  triggerCount: number
  createdBy: string
  createdAt: string
  updatedAt: string
  triggers?: AlertTrigger[]
}

export interface AlertTrigger {
  id: string
  alertId: string
  value: number
  message: string
  data?: any
  isResolved: boolean
  resolvedAt?: string
  resolvedBy?: string
  triggeredAt: string
}

export interface CreateAlertData {
  name: string
  description?: string
  type: Alert['type']
  metric: string
  condition: Alert['condition']
  threshold: number
  threshold2?: number
  frequency: Alert['frequency']
  recipients: string[]
  channels: Alert['channels']
  cooldown?: number
}

export interface AlertDashboard {
  summary: {
    totalAlerts: number
    activeAlerts: number
    triggeredToday: number
    unresolvedTriggers: number
  }
  alertsByType: Array<{
    type: string
    count: number
  }>
  topAlerts: Array<{
    id: string
    name: string
    type: string
    triggerCount: number
  }>
}

export const useAlerts = () => {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [triggers, setTriggers] = useState<AlertTrigger[]>([])
  const [dashboard, setDashboard] = useState<AlertDashboard | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch alertas
  const fetchAlerts = useCallback(async (filters?: { type?: string, isActive?: boolean }) => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.get('/alerts', { params: filters })
      setAlerts(response.data.data)
    } catch (err: any) {
      setError('Falha ao carregar alertas')
      console.error('Error fetching alerts:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  // Criar alerta
  const createAlert = useCallback(async (data: CreateAlertData): Promise<Alert | null> => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.post('/alerts', data)
      const newAlert = response.data.data
      setAlerts(prev => [...prev, newAlert])
      return newAlert
    } catch (err: any) {
      setError('Falha ao criar alerta')
      console.error('Error creating alert:', err)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  // Atualizar alerta
  const updateAlert = useCallback(async (id: string, data: Partial<CreateAlertData>): Promise<Alert | null> => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.put(`/alerts/${id}`, data)
      const updatedAlert = response.data.data
      setAlerts(prev => prev.map(alert => alert.id === id ? updatedAlert : alert))
      return updatedAlert
    } catch (err: any) {
      setError('Falha ao atualizar alerta')
      console.error('Error updating alert:', err)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  // Deletar alerta
  const deleteAlert = useCallback(async (id: string): Promise<boolean> => {
    try {
      setLoading(true)
      setError(null)
      await apiClient.delete(`/alerts/${id}`)
      setAlerts(prev => prev.filter(alert => alert.id !== id))
      return true
    } catch (err: any) {
      setError('Falha ao deletar alerta')
      console.error('Error deleting alert:', err)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  // Buscar triggers de um alerta
  const fetchAlertTriggers = useCallback(async (alertId: string, isResolved?: boolean) => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.get(`/alerts/${alertId}/triggers`, {
        params: { isResolved }
      })
      setTriggers(response.data.data)
    } catch (err: any) {
      setError('Falha ao carregar triggers')
      console.error('Error fetching triggers:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  // Resolver trigger
  const resolveTrigger = useCallback(async (triggerId: string): Promise<boolean> => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.put(`/alerts/triggers/${triggerId}/resolve`)
      const resolvedTrigger = response.data.data
      setTriggers(prev => prev.map(trigger =>
        trigger.id === triggerId ? resolvedTrigger : trigger
      ))
      return true
    } catch (err: any) {
      setError('Falha ao resolver trigger')
      console.error('Error resolving trigger:', err)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  // Buscar dashboard de alertas
  const fetchAlertDashboard = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.get('/alerts/dashboard')
      setDashboard(response.data.data)
    } catch (err: any) {
      setError('Falha ao carregar dashboard de alertas')
      console.error('Error fetching alerts dashboard:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  // Testar alerta
  const testAlert = useCallback(async (alertId: string): Promise<boolean> => {
    try {
      setLoading(true)
      setError(null)
      await apiClient.post(`/alerts/test/${alertId}`)
      return true
    } catch (err: any) {
      setError('Falha ao testar alerta')
      console.error('Error testing alert:', err)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  // Filtros e helpers
  const getAlertsByType = useCallback((type: Alert['type']) => {
    return alerts.filter(alert => alert.type === type)
  }, [alerts])

  const getActiveAlerts = useCallback(() => {
    return alerts.filter(alert => alert.isActive)
  }, [alerts])

  const getCriticalAlerts = useCallback(() => {
    return alerts.filter(alert =>
      alert.isActive && alert.type === 'SYSTEM_OVERLOAD' || alert.type === 'DEADLINE_OVERDUE'
    )
  }, [alerts])

  const getUnresolvedTriggers = useCallback(() => {
    return triggers.filter(trigger => !trigger.isResolved)
  }, [triggers])

  const getMostTriggeredAlerts = useCallback(() => {
    return alerts
      .filter(alert => alert.triggerCount > 0)
      .sort((a, b) => b.triggerCount - a.triggerCount)
      .slice(0, 5)
  }, [alerts])

  // Templates de alertas predefinidos
  const getAlertTemplates = useCallback(() => {
    return [
      {
        name: 'Protocolos com Prazo Vencido',
        type: 'DEADLINE_OVERDUE' as const,
        description: 'Alerta quando protocolos ultrapassam o prazo limite',
        metric: 'overdue_protocols',
        condition: 'greater' as const,
        threshold: 0,
        frequency: 'REALTIME' as const,
        channels: ['web', 'email'] as const
      },
      {
        name: 'Performance Baixa de Funcionário',
        type: 'LOW_PERFORMANCE' as const,
        description: 'Alerta quando funcionário fica abaixo da meta',
        metric: 'employee_performance',
        condition: 'less' as const,
        threshold: 70,
        frequency: 'DAILY' as const,
        channels: ['web'] as const
      },
      {
        name: 'Pico de Demanda',
        type: 'HIGH_DEMAND' as const,
        description: 'Alerta quando há aumento súbito de protocolos',
        metric: 'protocol_volume',
        condition: 'greater' as const,
        threshold: 50,
        frequency: 'REALTIME' as const,
        channels: ['web', 'push'] as const
      },
      {
        name: 'Satisfação Baixa',
        type: 'LOW_SATISFACTION' as const,
        description: 'Alerta quando NPS fica abaixo do aceitável',
        metric: 'satisfaction_score',
        condition: 'less' as const,
        threshold: 6,
        frequency: 'WEEKLY' as const,
        channels: ['web', 'email'] as const
      },
      {
        name: 'Sistema Sobrecarregado',
        type: 'SYSTEM_OVERLOAD' as const,
        description: 'Alerta quando sistema está com alta carga',
        metric: 'system_load',
        condition: 'greater' as const,
        threshold: 80,
        frequency: 'REALTIME' as const,
        channels: ['web', 'push', 'email'] as const
      }
    ]
  }, [])

  // Inicializar dados
  useEffect(() => {
    fetchAlerts()
    fetchAlertDashboard()
  }, [fetchAlerts, fetchAlertDashboard])

  return {
    // Estados
    alerts,
    triggers,
    dashboard,
    loading,
    error,

    // Ações
    fetchAlerts,
    createAlert,
    updateAlert,
    deleteAlert,
    fetchAlertTriggers,
    resolveTrigger,
    fetchAlertDashboard,
    testAlert,

    // Helpers
    getAlertsByType,
    getActiveAlerts,
    getCriticalAlerts,
    getUnresolvedTriggers,
    getMostTriggeredAlerts,
    getAlertTemplates
  }
}