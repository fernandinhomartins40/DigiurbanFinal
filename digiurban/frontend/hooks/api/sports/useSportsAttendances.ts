'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAdminAuth } from '@/contexts/AdminAuthContext'

interface SportsAttendance {
  id: string
  citizen: {
    id: string
    name: string
    cpf: string
    phone: string
    email?: string
    address: string
    birthDate: string
  }
  type: 'ENROLLMENT' | 'INFORMATION' | 'COMPLAINT' | 'SUGGESTION' | 'EVENT_REGISTRATION' | 'COACHING_REQUEST'
  category: 'YOUTH_SPORTS' | 'ADULT_SPORTS' | 'SPECIAL_NEEDS' | 'COMPETITIONS' | 'INFRASTRUCTURE'
  description: string
  requestedService?: string
  modality?: string
  preferredSchedule?: string
  status: 'PENDING' | 'IN_PROGRESS' | 'RESOLVED' | 'CANCELLED'
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  assignedTo?: {
    id: string
    name: string
    department: string
  }
  resolution?: {
    description: string
    resolvedBy: string
    resolvedAt: string
    feedback?: string
    rating?: number
  }
  followUps: {
    id: string
    description: string
    createdBy: string
    createdAt: string
  }[]
  attachments: {
    id: string
    name: string
    url: string
    type: string
  }[]
  estimatedResolutionDate?: string
  actualResolutionDate?: string
  satisfactionRating?: number
  createdAt: string
  updatedAt: string
}

interface CreateSportsAttendanceData {
  citizenId: string
  type: 'ENROLLMENT' | 'INFORMATION' | 'COMPLAINT' | 'SUGGESTION' | 'EVENT_REGISTRATION' | 'COACHING_REQUEST'
  category: 'YOUTH_SPORTS' | 'ADULT_SPORTS' | 'SPECIAL_NEEDS' | 'COMPETITIONS' | 'INFRASTRUCTURE'
  description: string
  requestedService?: string
  modality?: string
  preferredSchedule?: string
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  estimatedResolutionDate?: string
}

interface UseSportsAttendancesReturn {
  attendances: SportsAttendance[]
  loading: boolean
  error: string | null
  createAttendance: (data: CreateSportsAttendanceData) => Promise<SportsAttendance>
  updateAttendance: (id: string, data: Partial<CreateSportsAttendanceData>) => Promise<SportsAttendance>
  assignAttendance: (id: string, assignedToId: string) => Promise<SportsAttendance>
  resolveAttendance: (id: string, resolution: any) => Promise<SportsAttendance>
  addFollowUp: (id: string, description: string) => Promise<SportsAttendance>
  addAttachment: (id: string, file: File) => Promise<SportsAttendance>
  updateStatus: (id: string, status: 'PENDING' | 'IN_PROGRESS' | 'RESOLVED' | 'CANCELLED') => Promise<SportsAttendance>
  deleteAttendance: (id: string) => Promise<void>
  getByStatus: (status: string) => SportsAttendance[]
  getByCategory: (category: string) => SportsAttendance[]
  getPendingAttendances: () => SportsAttendance[]
  getOverdueAttendances: () => SportsAttendance[]
  refreshAttendances: () => Promise<void>
}

export function useSportsAttendances(): UseSportsAttendancesReturn {
  const [attendances, setAttendances] = useState<SportsAttendance[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchAttendances = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await apiClient.get('/api/specialized/sports/attendances')
      setAttendances(data.attendances || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar atendimentos esportivos')
    } finally {
      setLoading(false)
    }
  }, [])

  const createAttendance = useCallback(async (data: CreateSportsAttendanceData): Promise<SportsAttendance> => {
    try {
      setError(null)
      const response = await apiClient.post('/api/specialized/sports/attendances', data)
      const newAttendance = response.attendance
      setAttendances(prev => [newAttendance, ...prev])
      return newAttendance
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar atendimento'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const updateAttendance = useCallback(async (id: string, data: Partial<CreateSportsAttendanceData>): Promise<SportsAttendance> => {
    try {
      setError(null)
      const response = await apiClient.put(`/api/specialized/sports/attendances/${id}`, data)
      const updatedAttendance = response.attendance
      setAttendances(prev => prev.map(attendance => attendance.id === id ? updatedAttendance : attendance))
      return updatedAttendance
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar atendimento'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const assignAttendance = useCallback(async (id: string, assignedToId: string): Promise<SportsAttendance> => {
    try {
      setError(null)
      const response = await apiClient.put(`/api/specialized/sports/attendances/${id}/assign`, { assignedToId })
      const updatedAttendance = response.attendance
      setAttendances(prev => prev.map(attendance => attendance.id === id ? updatedAttendance : attendance))
      return updatedAttendance
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atribuir atendimento'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const resolveAttendance = useCallback(async (id: string, resolution: any): Promise<SportsAttendance> => {
    try {
      setError(null)
      const response = await apiClient.put(`/api/specialized/sports/attendances/${id}/resolve`, resolution)
      const updatedAttendance = response.attendance
      setAttendances(prev => prev.map(attendance => attendance.id === id ? updatedAttendance : attendance))
      return updatedAttendance
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao resolver atendimento'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const addFollowUp = useCallback(async (id: string, description: string): Promise<SportsAttendance> => {
    try {
      setError(null)
      const response = await apiClient.post(`/api/specialized/sports/attendances/${id}/followups`, { description })
      const updatedAttendance = response.attendance
      setAttendances(prev => prev.map(attendance => attendance.id === id ? updatedAttendance : attendance))
      return updatedAttendance
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao adicionar acompanhamento'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const addAttachment = useCallback(async (id: string, file: File): Promise<SportsAttendance> => {
    try {
      setError(null)
      const formData = new FormData()
      formData.append('file', file)
      const response = await apiClient.post(`/api/specialized/sports/attendances/${id}/attachments`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      const updatedAttendance = response.attendance
      setAttendances(prev => prev.map(attendance => attendance.id === id ? updatedAttendance : attendance))
      return updatedAttendance
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao adicionar anexo'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const updateStatus = useCallback(async (id: string, status: 'PENDING' | 'IN_PROGRESS' | 'RESOLVED' | 'CANCELLED'): Promise<SportsAttendance> => {
    try {
      setError(null)
      const response = await apiClient.put(`/api/specialized/sports/attendances/${id}/status`, { status })
      const updatedAttendance = response.attendance
      setAttendances(prev => prev.map(attendance => attendance.id === id ? updatedAttendance : attendance))
      return updatedAttendance
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar status'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const deleteAttendance = useCallback(async (id: string): Promise<void> => {
    try {
      setError(null)
      await apiClient.delete(`/api/specialized/sports/attendances/${id}`)
      setAttendances(prev => prev.filter(attendance => attendance.id !== id))
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao excluir atendimento'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const getByStatus = useCallback((status: string) => attendances.filter(attendance => attendance.status === status), [attendances])
  const getByCategory = useCallback((category: string) => attendances.filter(attendance => attendance.category === category), [attendances])
  const getPendingAttendances = useCallback(() => attendances.filter(attendance => attendance.status === 'PENDING'), [attendances])
  const getOverdueAttendances = useCallback(() => {
    const today = new Date()
    return attendances.filter(attendance =>
      attendance.estimatedResolutionDate &&
      new Date(attendance.estimatedResolutionDate) < today &&
      attendance.status !== 'RESOLVED'
    )
  }, [attendances])

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
    assignAttendance,
    resolveAttendance,
    addFollowUp,
    addAttachment,
    updateStatus,
    deleteAttendance,
    getByStatus,
    getByCategory,
    getPendingAttendances,
    getOverdueAttendances,
    refreshAttendances
  }
}