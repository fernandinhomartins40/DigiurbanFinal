'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAdminAuth } from '@/contexts/AdminAuthContext'
import type {
  SocialAttendanceStats,
  AttendanceFilters
} from '@/types/social-assistance'

interface UseSocialAttendanceStatsReturn {
  stats: SocialAttendanceStats | null
  loading: boolean
  error: string | null
  refreshStats: (filters?: AttendanceFilters) => Promise<void>
}

export function useSocialAttendanceStats(
  initialFilters?: AttendanceFilters
): UseSocialAttendanceStatsReturn {
  const [stats, setStats] = useState<SocialAttendanceStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStats = useCallback(async (filters?: AttendanceFilters) => {
    try {
      setLoading(true)
      setError(null)

      const queryParams = new URLSearchParams()
      if (filters?.serviceUnitId) queryParams.append('serviceUnitId', filters.serviceUnitId)
      if (filters?.attendanceType) queryParams.append('attendanceType', filters.attendanceType)
      if (filters?.dateFrom) queryParams.append('dateFrom', filters.dateFrom)
      if (filters?.dateTo) queryParams.append('dateTo', filters.dateTo)

      const query = queryParams.toString()
      const endpoint = `/api/secretarias/social-assistance/attendances/stats${query ? `?${query}` : ''}`

      const response = await apiClient.get(endpoint)

      if (response.error) {
        throw new Error(response.error)
      }

      // Dados simulados realísticos enquanto backend não existe
      const mockStats: SocialAttendanceStats = {
        total: 1247,
        pending: 89,
        completed: 1024,
        inProgress: 78,
        cancelled: 56,
        urgent: 23,
        byType: [
          { type: 'BENEFIT_REQUEST', count: 456, percentage: 36.6 },
          { type: 'INFORMATION', count: 298, percentage: 23.9 },
          { type: 'REGISTRATION', count: 187, percentage: 15.0 },
          { type: 'FOLLOW_UP', count: 134, percentage: 10.7 },
          { type: 'COMPLAINT', count: 89, percentage: 7.1 },
          { type: 'EMERGENCY', count: 67, percentage: 5.4 },
          { type: 'OTHER', count: 16, percentage: 1.3 }
        ],
        byPriority: [
          { priority: 'LOW', count: 587, percentage: 47.1 },
          { priority: 'MEDIUM', count: 423, percentage: 33.9 },
          { priority: 'HIGH', count: 214, percentage: 17.2 },
          { priority: 'URGENT', count: 23, percentage: 1.8 }
        ],
        byMonth: [
          { month: 'Janeiro', year: 2024, total: 98, completed: 89, pending: 6, urgent: 3 },
          { month: 'Fevereiro', year: 2024, total: 87, completed: 82, pending: 3, urgent: 2 },
          { month: 'Março', year: 2024, total: 112, completed: 103, pending: 7, urgent: 2 },
          { month: 'Abril', year: 2024, total: 134, completed: 121, pending: 9, urgent: 4 },
          { month: 'Maio', year: 2024, total: 156, completed: 142, pending: 11, urgent: 3 },
          { month: 'Junho', year: 2024, total: 143, completed: 129, pending: 12, urgent: 2 }
        ],
        averageDuration: 45,
        completionRate: 82.1,
        responseTime: {
          average: 2.3,
          urgent: 0.8
        }
      }

      setStats(mockStats)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar estatísticas'
      setError(errorMessage)
      console.error('Erro ao buscar estatísticas de atendimentos:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  const refreshStats = useCallback((filters?: AttendanceFilters) => {
    return fetchStats(filters)
  }, [fetchStats])

  useEffect(() => {
    fetchStats(initialFilters)
  }, [fetchStats, initialFilters])

  return {
    stats,
    loading,
    error,
    refreshStats
  }
}