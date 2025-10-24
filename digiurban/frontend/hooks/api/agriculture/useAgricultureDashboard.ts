import { useState, useEffect } from 'react'
import apiClient from '@/lib/api'

// Interfaces para os dados
export interface ProducersStats {
  total: number
  active: number
  new: number
  growth: number
  productionTypes?: Array<{
    type: string
    count: number
  }>
}

export interface ProductionOverview {
  totalArea: number
  plantedArea: number
  harvestEstimate: number
  productivity: number
  mainCrops?: Array<{
    crop: string
    producers: number
  }>
}

export interface BudgetSummary {
  allocated: number
  used: number
  available: number
  projects: number
  executionRate?: number
}

export interface ServiceStats {
  name: string
  count: number
  protocols?: number
}

export interface MonthlyStats {
  producers: Array<{
    month: string
    producers: number
  }>
  protocols?: Array<{
    month: string
    protocols: number
  }>
}

export interface AgricultureDashboardData {
  producers: ProducersStats | null
  production: ProductionOverview | null
  budget: BudgetSummary | null
  services: ServiceStats[] | null
  monthly: MonthlyStats | null
}

// Hook principal do dashboard
export function useAgricultureDashboard() {
  const [data, setData] = useState<AgricultureDashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await apiClient.get<AgricultureDashboardData>('/api/admin/agriculture/dashboard')

      if (response.error) {
        throw new Error(response.error)
      }

      setData(response.data || null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar dados do dashboard')
      console.error('Erro ao buscar dados do dashboard de agricultura:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()
  }, [])

  return {
    data,
    loading,
    error,
    refetch: fetchDashboardData
  }
}

// Hook específico para estatísticas dos produtores
export function useProducersStats() {
  const [data, setData] = useState<ProducersStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProducersStats = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await apiClient.get<ProducersStats>('/api/admin/agriculture/producers/stats')

      if (response.error) {
        throw new Error(response.error)
      }

      setData(response.data || null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar estatísticas dos produtores')
      console.error('Erro ao buscar estatísticas dos produtores:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducersStats()
  }, [])

  return {
    data,
    loading,
    error,
    refetch: fetchProducersStats
  }
}

// Hook específico para visão geral da produção
export function useProductionOverview() {
  const [data, setData] = useState<ProductionOverview | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProductionOverview = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await apiClient.get<ProductionOverview>('/api/admin/agriculture/production/overview')

      if (response.error) {
        throw new Error(response.error)
      }

      setData(response.data || null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar visão geral da produção')
      console.error('Erro ao buscar visão geral da produção:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProductionOverview()
  }, [])

  return {
    data,
    loading,
    error,
    refetch: fetchProductionOverview
  }
}

// Hook específico para resumo do orçamento
export function useBudgetSummary() {
  const [data, setData] = useState<BudgetSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchBudgetSummary = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await apiClient.get<BudgetSummary>('/api/admin/agriculture/budget/summary')

      if (response.error) {
        throw new Error(response.error)
      }

      setData(response.data || null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar resumo do orçamento')
      console.error('Erro ao buscar resumo do orçamento:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBudgetSummary()
  }, [])

  return {
    data,
    loading,
    error,
    refetch: fetchBudgetSummary
  }
}

// Hook para estatísticas dos serviços
export function useServicesStats() {
  const [data, setData] = useState<ServiceStats[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchServicesStats = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await apiClient.get<ServiceStats[]>('/api/admin/agriculture/services/stats')

      if (response.error) {
        throw new Error(response.error)
      }

      setData(response.data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar estatísticas dos serviços')
      console.error('Erro ao buscar estatísticas dos serviços:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchServicesStats()
  }, [])

  return {
    data,
    loading,
    error,
    refetch: fetchServicesStats
  }
}

// Hook para estatísticas mensais
export function useMonthlyStats() {
  const [data, setData] = useState<MonthlyStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchMonthlyStats = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await apiClient.get<MonthlyStats>('/api/admin/agriculture/monthly-stats')

      if (response.error) {
        throw new Error(response.error)
      }

      setData(response.data || null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar estatísticas mensais')
      console.error('Erro ao buscar estatísticas mensais:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMonthlyStats()
  }, [])

  return {
    data,
    loading,
    error,
    refetch: fetchMonthlyStats
  }
}

// Hook com cache para melhor performance
export function useAgricultureDashboardWithCache(refreshInterval = 5 * 60 * 1000) {
  const [data, setData] = useState<AgricultureDashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastFetch, setLastFetch] = useState<number>(0)

  const fetchDashboardData = async (forceRefresh = false) => {
    const now = Date.now()

    // Verifica se precisa fazer nova requisição (cache)
    if (!forceRefresh && data && (now - lastFetch) < refreshInterval) {
      return
    }

    try {
      setLoading(true)
      setError(null)

      const response = await apiClient.get<AgricultureDashboardData>('/api/admin/agriculture/dashboard')

      if (response.error) {
        throw new Error(response.error)
      }

      setData(response.data || null)
      setLastFetch(now)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar dados do dashboard')
      console.error('Erro ao buscar dados do dashboard de agricultura:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()

    // Atualização automática em intervalo
    const interval = setInterval(() => {
      fetchDashboardData()
    }, refreshInterval)

    return () => clearInterval(interval)
  }, [refreshInterval])

  return {
    data,
    loading,
    error,
    refetch: () => fetchDashboardData(true),
    lastUpdated: lastFetch
  }
}

// Utility functions para formatação de dados
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)
}

export const formatNumber = (value: number): string => {
  return new Intl.NumberFormat('pt-BR').format(value)
}

export const formatArea = (value: number): string => {
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}k ha`
  }
  return `${value} ha`
}

export const formatPercentage = (value: number): string => {
  return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`
}