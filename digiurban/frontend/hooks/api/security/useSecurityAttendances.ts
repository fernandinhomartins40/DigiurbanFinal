'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAdminAuth } from '@/contexts/AdminAuthContext'

interface SecurityAttendance {
  id: string
  citizenName: string
  citizenCpf: string
  citizenPhone: string
  attendanceType: 'COMPLAINT' | 'REPORT' | 'INFORMATION' | 'EMERGENCY' | 'FOLLOW_UP'
  date: string
  time: string
  description: string
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  status: 'PENDING' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED'
  attendedBy: string
  resolution?: string
  referrals: string[]
  followUpRequired: boolean
  followUpDate?: string
  createdAt: string
  updatedAt: string
}

interface CreateSecurityAttendanceData {
  citizenName: string
  citizenCpf: string
  citizenPhone: string
  attendanceType: 'COMPLAINT' | 'REPORT' | 'INFORMATION' | 'EMERGENCY' | 'FOLLOW_UP'
  description: string
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  attendedBy: string
}

interface UseSecurityAttendancesReturn {
  attendances: SecurityAttendance[]
  loading: boolean
  error: string | null
  createAttendance: (data: CreateSecurityAttendanceData) => Promise<SecurityAttendance>
  updateAttendance: (id: string, data: Partial<CreateSecurityAttendanceData>) => Promise<SecurityAttendance>
  resolveAttendance: (id: string, resolution: string) => Promise<SecurityAttendance>
  getPendingAttendances: () => SecurityAttendance[]
  refreshAttendances: () => Promise<void>
}

export function useSecurityAttendances(): UseSecurityAttendancesReturn {
  const [attendances, setAttendances] = useState<SecurityAttendance[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchAttendances = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await apiClient.get('/api/secretarias/security/attendances')
      setAttendances(data.attendances || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar atendimentos')
    } finally {
      setLoading(false)
    }
  }, [])

  const createAttendance = useCallback(async (data: CreateSecurityAttendanceData): Promise<SecurityAttendance> => {
    try {
      setError(null)
      const response = await apiClient.post('/api/secretarias/security/attendances', data)
      const newAttendance = response.attendance
      setAttendances(prev => [newAttendance, ...prev])
      return newAttendance
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar atendimento'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const updateAttendance = useCallback(async (id: string, data: Partial<CreateSecurityAttendanceData>): Promise<SecurityAttendance> => {
    try {
      setError(null)
      const response = await apiClient.put(`/api/secretarias/security/attendances/${id}`, data)
      const updatedAttendance = response.attendance
      setAttendances(prev => prev.map(att => att.id === id ? updatedAttendance : att))
      return updatedAttendance
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar atendimento'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const resolveAttendance = useCallback(async (id: string, resolution: string): Promise<SecurityAttendance> => {
    return updateAttendance(id, { status: 'RESOLVED', resolution } as any)
  }, [updateAttendance])

  const getPendingAttendances = useCallback(() => attendances.filter(att => att.status === 'PENDING'), [attendances])

  const refreshAttendances = useCallback(async () => {
    await fetchAttendances()
  }, [fetchAttendances])

  useEffect(() => {
    fetchAttendances()
  }, [fetchAttendances])

  return {
    attendances,
    loading,
    error,
    createAttendance,
    updateAttendance,
    resolveAttendance,
    getPendingAttendances,
    refreshAttendances
  }
}