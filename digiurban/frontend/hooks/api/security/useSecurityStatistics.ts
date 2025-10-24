'use client'

import { useState, useEffect, useCallback } from 'react'
import { apiClient } from '@/lib/auth'

interface SecurityStatistics {
  period: string
  totalOccurrences: number
  occurrencesByType: Record<string, number>
  occurrencesByPriority: Record<string, number>
  crimeTrends: { month: string; count: number }[]
  responseTime: { average: number; median: number; fastest: number; slowest: number }
  patrolCoverage: { total: number; completed: number; percentage: number }
  officerActivity: { active: number; onPatrol: number; available: number }
  regionStatistics: { region: string; occurrences: number; resolved: number }[]
  alertsIssued: number
  emergencyResponses: number
  criticalPointsMonitored: number
}

interface UseSecurityStatisticsReturn {
  statistics: SecurityStatistics | null
  loading: boolean
  error: string | null
  refreshStatistics: (period?: string) => Promise<void>
}

export function useSecurityStatistics(period: string = 'month'): UseSecurityStatisticsReturn {
  const [statistics, setStatistics] = useState<SecurityStatistics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStatistics = useCallback(async (timePeriod?: string) => {
    try {
      setLoading(true)
      setError(null)
      const queryParams = new URLSearchParams()
      if (timePeriod) queryParams.append('period', timePeriod)
      
      const query = queryParams.toString()
      const endpoint = `/api/specialized/security/statistics${query ? `?${query}` : ''}`
      const data = await apiClient.get(endpoint)
      setStatistics(data.statistics)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar estatísticas')
    } finally {
      setLoading(false)
    }
  }, [])

  const refreshStatistics = useCallback(async (timePeriod?: string) => {
    await fetchStatistics(timePeriod || period)
  }, [fetchStatistics, period])

  useEffect(() => {
    fetchStatistics(period)
  }, [fetchStatistics, period])

  return {
    statistics,
    loading,
    error,
    refreshStatistics
  }
}