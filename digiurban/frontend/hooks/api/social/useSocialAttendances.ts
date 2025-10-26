'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAdminAuth } from '@/contexts/AdminAuthContext'
import type {
  SocialAttendance,
  CreateSocialAttendanceData,
  UpdateSocialAttendanceData,
  AttendanceFilters
} from '@/types/social-assistance'

interface UseSocialAttendancesReturn {
  attendances: SocialAttendance[]
  loading: boolean
  error: string | null
  createAttendance: (data: CreateSocialAttendanceData) => Promise<SocialAttendance>
  updateAttendance: (id: string, data: UpdateSocialAttendanceData) => Promise<SocialAttendance>
  deleteAttendance: (id: string) => Promise<void>
  getAttendanceById: (id: string) => SocialAttendance | undefined
  getAttendancesByFamily: (familyId: string) => SocialAttendance[]
  refreshAttendances: (filters?: AttendanceFilters) => Promise<void>
}

export function useSocialAttendances(initialFilters?: AttendanceFilters): UseSocialAttendancesReturn {
  const [attendances, setAttendances] = useState<SocialAttendance[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchAttendances = useCallback(async (filters?: AttendanceFilters) => {
    try {
      setLoading(true)
      setError(null)
      const queryParams = new URLSearchParams()
      if (filters?.citizenId) queryParams.append('citizenId', filters.citizenId)
      if (filters?.familyId) queryParams.append('familyId', filters.familyId)
      if (filters?.serviceUnitId) queryParams.append('serviceUnitId', filters.serviceUnitId)
      if (filters?.attendanceType) queryParams.append('attendanceType', filters.attendanceType)
      if (filters?.status) queryParams.append('status', filters.status)
      if (filters?.priority) queryParams.append('priority', filters.priority)
      if (filters?.dateFrom) queryParams.append('dateFrom', filters.dateFrom)
      if (filters?.dateTo) queryParams.append('dateTo', filters.dateTo)

      const query = queryParams.toString()
      const endpoint = `/api/specialized/social-assistance/attendances${query ? `?${query}` : ''}`
      const data = await apiClient.get(endpoint)
      setAttendances(data.attendances || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar atendimentos')
    } finally {
      setLoading(false)
    }
  }, [])

  const createAttendance = useCallback(async (data: CreateSocialAttendanceData): Promise<SocialAttendance> => {
    try {
      setError(null)
      const response = await apiClient.post('/api/specialized/social-assistance/attendances', data)
      const newAttendance = response.attendance
      setAttendances(prev => [newAttendance, ...prev])
      return newAttendance
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar atendimento'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const updateAttendance = useCallback(async (id: string, data: UpdateSocialAttendanceData): Promise<SocialAttendance> => {
    try {
      setError(null)
      const response = await apiClient.put(`/api/specialized/social-assistance/attendances/${id}`, data)
      const updatedAttendance = response.attendance
      setAttendances(prev => prev.map(attendance => attendance.id === id ? updatedAttendance : attendance))
      return updatedAttendance
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar atendimento'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const deleteAttendance = useCallback(async (id: string): Promise<void> => {
    try {
      setError(null)
      await apiClient.delete(`/api/specialized/social-assistance/attendances/${id}`)
      setAttendances(prev => prev.filter(attendance => attendance.id !== id))
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao excluir atendimento'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const getAttendanceById = useCallback((id: string) => attendances.find(attendance => attendance.id === id), [attendances])
  const getAttendancesByFamily = useCallback((familyId: string) => attendances.filter(attendance => attendance.familyId === familyId), [attendances])

  const refreshAttendances = useCallback(async (filters?: AttendanceFilters) => {
    await fetchAttendances(filters)
  }, [fetchAttendances])

  useEffect(() => {
    fetchAttendances(initialFilters)
  }, [fetchAttendances, initialFilters])

  return {
    attendances,
    loading,
    error,
    createAttendance,
    updateAttendance,
    deleteAttendance,
    getAttendanceById,
    getAttendancesByFamily,
    refreshAttendances
  }
}