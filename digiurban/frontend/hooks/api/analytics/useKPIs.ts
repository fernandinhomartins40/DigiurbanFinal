import { useState, useEffect, useCallback } from 'react'
import { apiClient } from '@/lib/api'

export interface KPIDefinition {
  id: string
  name: string
  description?: string
  category: 'operational' | 'quality' | 'strategic'
  formula: string
  unit: string
  target?: number
  warning?: number
  critical?: number
  currentValue?: number
  lastCalculated?: string
  isActive: boolean
  updateFrequency: 'realtime' | 'hourly' | 'daily' | 'weekly'
  createdBy: string
  createdAt: string
  updatedAt: string
}

export interface KPIValue {
  kpi: KPIDefinition
  value: number
  status: 'good' | 'warning' | 'critical' | 'normal'
  trend: 'up' | 'down' | 'stable'
  change: number
  changePercent: number
}

export interface CreateKPIData {
  name: string
  description?: string
  category: 'operational' | 'quality' | 'strategic'
  formula: string
  unit: string
  target?: number
  warning?: number
  critical?: number
  updateFrequency?: 'realtime' | 'hourly' | 'daily' | 'weekly'
}

export const useKPIs = () => {
  const [kpis, setKPIs] = useState<KPIDefinition[]>([])
  const [kpiValues, setKPIValues] = useState<KPIValue[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch KPIs
  const fetchKPIs = useCallback(async (category?: string) => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.get('/analytics/kpis', {
        params: { category }
      })
      setKPIs(response.data.data)
    } catch (err: any) {
      setError('Falha ao carregar KPIs')
      console.error('Error fetching KPIs:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  // Criar KPI
  const createKPI = useCallback(async (data: CreateKPIData): Promise<KPIDefinition | null> => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.post('/kpis', data)
      const newKPI = response.data.data
      setKPIs(prev => [...prev, newKPI])
      return newKPI
    } catch (err: any) {
      setError('Falha ao criar KPI')
      console.error('Error creating KPI:', err)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  // Atualizar KPI
  const updateKPI = useCallback(async (id: string, data: Partial<CreateKPIData>): Promise<KPIDefinition | null> => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.put(`/kpis/${id}`, data)
      const updatedKPI = response.data.data
      setKPIs(prev => prev.map(kpi => kpi.id === id ? updatedKPI : kpi))
      return updatedKPI
    } catch (err: any) {
      setError('Falha ao atualizar KPI')
      console.error('Error updating KPI:', err)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  // Deletar KPI
  const deleteKPI = useCallback(async (id: string): Promise<boolean> => {
    try {
      setLoading(true)
      setError(null)
      await apiClient.delete(`/kpis/${id}`)
      setKPIs(prev => prev.filter(kpi => kpi.id !== id))
      return true
    } catch (err: any) {
      setError('Falha ao deletar KPI')
      console.error('Error deleting KPI:', err)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  // Calcular valor de um KPI
  const calculateKPI = useCallback(async (id: string): Promise<number | null> => {
    try {
      const response = await apiClient.post(`/kpis/${id}/calculate`)
      const newValue = response.data.data.value

      // Atualizar KPI local com novo valor
      setKPIs(prev => prev.map(kpi =>
        kpi.id === id
          ? { ...kpi, currentValue: newValue, lastCalculated: new Date().toISOString() }
          : kpi
      ))

      return newValue
    } catch (err: any) {
      console.error('Error calculating KPI:', err)
      return null
    }
  }, [])

  // Recalcular todos os KPIs
  const recalculateAllKPIs = useCallback(async (): Promise<boolean> => {
    try {
      setLoading(true)
      setError(null)
      await apiClient.post('/kpis/recalculate-all')
      // Recarregar KPIs após recálculo
      await fetchKPIs()
      return true
    } catch (err: any) {
      setError('Falha ao recalcular KPIs')
      console.error('Error recalculating KPIs:', err)
      return false
    } finally {
      setLoading(false)
    }
  }, [fetchKPIs])

  // Buscar histórico de valores de um KPI
  const fetchKPIHistory = useCallback(async (id: string, period: string = '30d') => {
    try {
      const response = await apiClient.get(`/kpis/${id}/history`, {
        params: { period }
      })
      return response.data.data
    } catch (err: any) {
      console.error('Error fetching KPI history:', err)
      return null
    }
  }, [])

  // Helpers para categorização e filtros
  const getKPIsByCategory = useCallback((category: string) => {
    return kpis.filter(kpi => kpi.category === category)
  }, [kpis])

  const getCriticalKPIs = useCallback(() => {
    return kpis.filter(kpi =>
      kpi.currentValue !== null &&
      kpi.critical !== null &&
      kpi.currentValue <= kpi.critical
    )
  }, [kpis])

  const getWarningKPIs = useCallback(() => {
    return kpis.filter(kpi =>
      kpi.currentValue !== null &&
      kpi.warning !== null &&
      kpi.currentValue <= kpi.warning &&
      (kpi.critical === null || kpi.currentValue > kpi.critical)
    )
  }, [kpis])

  const getGoodKPIs = useCallback(() => {
    return kpis.filter(kpi =>
      kpi.currentValue !== null &&
      kpi.target !== null &&
      kpi.currentValue >= kpi.target
    )
  }, [kpis])

  // Calcular score geral baseado nos KPIs
  const calculateOverallScore = useCallback(() => {
    const activeKPIs = kpis.filter(kpi => kpi.isActive && kpi.currentValue !== null)
    if (activeKPIs.length === 0) return 0

    const scores = activeKPIs.map(kpi => {
      if (kpi.critical && kpi.currentValue! <= kpi.critical) return 0
      if (kpi.warning && kpi.currentValue! <= kpi.warning) return 25
      if (kpi.target && kpi.currentValue! >= kpi.target) return 100
      return 50
    })

    return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
  }, [kpis])

  // Templates de KPIs predefinidos
  const getKPITemplates = useCallback(() => {
    return [
      // KPIs Operacionais
      {
        name: 'Protocolos Concluídos no Prazo',
        description: 'Percentual de protocolos finalizados dentro do prazo estabelecido',
        category: 'operational' as const,
        formula: '(protocolos_concluidos_no_prazo / total_protocolos) * 100',
        unit: '%',
        target: 85,
        warning: 70,
        critical: 50,
        updateFrequency: 'daily' as const
      },
      {
        name: 'Tempo Médio de Resolução',
        description: 'Tempo médio para resolução de protocolos em horas',
        category: 'operational' as const,
        formula: 'sum(tempo_resolucao) / count(protocolos_concluidos)',
        unit: 'horas',
        target: 48,
        warning: 72,
        critical: 120,
        updateFrequency: 'daily' as const
      },
      {
        name: 'Taxa de Primeira Resolução',
        description: 'Percentual de protocolos resolvidos na primeira tentativa',
        category: 'operational' as const,
        formula: '(protocolos_primeira_resolucao / total_protocolos_concluidos) * 100',
        unit: '%',
        target: 80,
        warning: 65,
        critical: 50,
        updateFrequency: 'daily' as const
      },

      // KPIs de Qualidade
      {
        name: 'NPS (Net Promoter Score)',
        description: 'Índice de satisfação e lealdade dos cidadãos',
        category: 'quality' as const,
        formula: '(promotores - detratores) / total_respondentes * 100',
        unit: 'pontos',
        target: 50,
        warning: 30,
        critical: 0,
        updateFrequency: 'weekly' as const
      },
      {
        name: 'Satisfação Média',
        description: 'Nota média de satisfação dos cidadãos (1-5)',
        category: 'quality' as const,
        formula: 'sum(avaliacoes) / count(avaliacoes)',
        unit: 'pontos',
        target: 4,
        warning: 3,
        critical: 2,
        updateFrequency: 'daily' as const
      },
      {
        name: 'Taxa de Reclamações',
        description: 'Percentual de protocolos que geraram reclamações',
        category: 'quality' as const,
        formula: '(protocolos_com_reclamacao / total_protocolos) * 100',
        unit: '%',
        target: 5,
        warning: 10,
        critical: 20,
        updateFrequency: 'weekly' as const
      },

      // KPIs Estratégicos
      {
        name: 'Cobertura Populacional',
        description: 'Percentual da população que utilizou serviços públicos',
        category: 'strategic' as const,
        formula: '(cidadaos_ativos / populacao_total) * 100',
        unit: '%',
        target: 30,
        warning: 20,
        critical: 10,
        updateFrequency: 'monthly' as const
      },
      {
        name: 'Eficiência Orçamentária',
        description: 'Custo médio por protocolo processado',
        category: 'strategic' as const,
        formula: 'custo_operacional_mensal / protocolos_processados_mes',
        unit: 'R$',
        target: 50,
        warning: 75,
        critical: 100,
        updateFrequency: 'monthly' as const
      },
      {
        name: 'Taxa de Digitalização',
        description: 'Percentual de serviços disponíveis digitalmente',
        category: 'strategic' as const,
        formula: '(servicos_digitais / total_servicos) * 100',
        unit: '%',
        target: 80,
        warning: 60,
        critical: 40,
        updateFrequency: 'monthly' as const
      }
    ]
  }, [])

  // Status do KPI baseado em valor atual vs metas
  const getKPIStatus = useCallback((kpi: KPIDefinition): 'good' | 'warning' | 'critical' | 'normal' => {
    if (!kpi.currentValue) return 'normal'

    if (kpi.critical !== null) {
      // Para métricas onde menor é pior (ex: tempo de resolução)
      if (kpi.unit === 'horas' || kpi.unit === 'dias' || kpi.name.includes('Tempo')) {
        if (kpi.currentValue >= kpi.critical) return 'critical'
        if (kpi.warning && kpi.currentValue >= kpi.warning) return 'warning'
        if (kpi.target && kpi.currentValue <= kpi.target) return 'good'
      } else {
        // Para métricas onde maior é melhor (ex: satisfação, taxa de conclusão)
        if (kpi.currentValue <= kpi.critical) return 'critical'
        if (kpi.warning && kpi.currentValue <= kpi.warning) return 'warning'
        if (kpi.target && kpi.currentValue >= kpi.target) return 'good'
      }
    }

    return 'normal'
  }, [])

  // Inicializar
  useEffect(() => {
    fetchKPIs()
  }, [fetchKPIs])

  return {
    // Estados
    kpis,
    kpiValues,
    loading,
    error,

    // Ações
    fetchKPIs,
    createKPI,
    updateKPI,
    deleteKPI,
    calculateKPI,
    recalculateAllKPIs,
    fetchKPIHistory,

    // Helpers
    getKPIsByCategory,
    getCriticalKPIs,
    getWarningKPIs,
    getGoodKPIs,
    calculateOverallScore,
    getKPITemplates,
    getKPIStatus
  }
}