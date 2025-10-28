'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAdminAuth } from '@/contexts/AdminAuthContext'

interface PublicServiceAttendance {
  id: string
  citizenName: string
  citizenCpf: string
  citizenPhone: string
  citizenEmail?: string
  attendanceType: 'SERVICE_REQUEST' | 'COMPLAINT' | 'INFORMATION' | 'STATUS_CHECK' | 'DOCUMENT_DELIVERY' | 'PAYMENT' | 'OTHER'
  serviceCategory: 'CLEANING' | 'LIGHTING' | 'MAINTENANCE' | 'COLLECTION' | 'REPAIRS' | 'GENERAL'
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  status: 'WAITING' | 'IN_SERVICE' | 'RESOLVED' | 'FORWARDED' | 'CANCELLED'
  attendanceDate: string
  attendanceTime: string
  attendedBy: string
  description: string
  location?: string
  relatedServiceId?: string
  documentsRequired: string[]
  documentsProvided: string[]
  resolution?: string
  resolutionDate?: string
  satisfactionRating?: number
  feedback?: string
  followUpRequired: boolean
  followUpDate?: string
  cost?: number
  attachments?: string[]
  nextSteps?: string[]
  referredTo?: string
  estimatedResolutionTime?: number
  actualResolutionTime?: number
  createdAt: string
  updatedAt: string
}

interface CreatePublicServiceAttendanceData {
  citizenName: string
  citizenCpf: string
  citizenPhone: string
  citizenEmail?: string
  attendanceType: 'SERVICE_REQUEST' | 'COMPLAINT' | 'INFORMATION' | 'STATUS_CHECK' | 'DOCUMENT_DELIVERY' | 'PAYMENT' | 'OTHER'
  serviceCategory: 'CLEANING' | 'LIGHTING' | 'MAINTENANCE' | 'COLLECTION' | 'REPAIRS' | 'GENERAL'
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  attendedBy: string
  description: string
  location?: string
  documentsRequired: string[]
  estimatedResolutionTime?: number
}

interface AttendanceFilters {
  attendanceType?: string
  serviceCategory?: string
  status?: string
  priority?: string
  attendedBy?: string
  dateFrom?: string
  dateTo?: string
}

interface AttendanceStats {
  totalAttendances: number
  byType: Record<string, number>
  byCategory: Record<string, number>
  byStatus: Record<string, number>
  averageResolutionTime: number
  satisfactionAverage: number
  pendingAttendances: number
  todayAttendances: number
}

interface UsePublicServicesAttendancesReturn {
  attendances: PublicServiceAttendance[]
  loading: boolean
  error: string | null
  createAttendance: (data: CreatePublicServiceAttendanceData) => Promise<PublicServiceAttendance>
  updateAttendance: (id: string, data: Partial<CreatePublicServiceAttendanceData>) => Promise<PublicServiceAttendance>
  resolveAttendance: (id: string, resolution: string) => Promise<PublicServiceAttendance>
  forwardAttendance: (id: string, referredTo: string) => Promise<PublicServiceAttendance>
  cancelAttendance: (id: string, reason: string) => Promise<PublicServiceAttendance>
  addFeedback: (id: string, rating: number, feedback?: string) => Promise<PublicServiceAttendance>
  deleteAttendance: (id: string) => Promise<void>
  getAttendanceById: (id: string) => PublicServiceAttendance | undefined
  getPendingAttendances: () => PublicServiceAttendance[]
  getAttendancesByCategory: (category: string) => PublicServiceAttendance[]
  getTodayAttendances: () => PublicServiceAttendance[]
  getAttendanceStats: (filters?: AttendanceFilters) => AttendanceStats
  refreshAttendances: (filters?: AttendanceFilters) => Promise<void>
}

export function usePublicServicesAttendances(initialFilters?: AttendanceFilters): UsePublicServicesAttendancesReturn {
  const [attendances, setAttendances] = useState<PublicServiceAttendance[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchAttendances = useCallback(async (filters?: AttendanceFilters) => {
    try {
      setLoading(true)
      setError(null)
      const queryParams = new URLSearchParams()
      if (filters?.attendanceType) queryParams.append('attendanceType', filters.attendanceType)
      if (filters?.serviceCategory) queryParams.append('serviceCategory', filters.serviceCategory)
      if (filters?.status) queryParams.append('status', filters.status)
      if (filters?.priority) queryParams.append('priority', filters.priority)
      if (filters?.attendedBy) queryParams.append('attendedBy', filters.attendedBy)
      if (filters?.dateFrom) queryParams.append('dateFrom', filters.dateFrom)
      if (filters?.dateTo) queryParams.append('dateTo', filters.dateTo)

      const query = queryParams.toString()
      const endpoint = `/api/secretarias/public-services/attendances${query ? `?${query}` : ''}`
      const data = await apiClient.get(endpoint)
      setAttendances(data.attendances || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar atendimentos')
    } finally {
      setLoading(false)
    }
  }, [])

  const createAttendance = useCallback(async (data: CreatePublicServiceAttendanceData): Promise<PublicServiceAttendance> => {
    try {
      setError(null)
      const response = await apiClient.post('/api/secretarias/public-services/attendances', data)
      const newAttendance = response.attendance
      setAttendances(prev => [newAttendance, ...prev])
      return newAttendance
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar atendimento'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const updateAttendance = useCallback(async (id: string, data: Partial<CreatePublicServiceAttendanceData>): Promise<PublicServiceAttendance> => {
    try {
      setError(null)
      const response = await apiClient.put(`/api/secretarias/public-services/attendances/${id}`, data)
      const updatedAttendance = response.attendance
      setAttendances(prev => prev.map(att => att.id === id ? updatedAttendance : att))
      return updatedAttendance
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar atendimento'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const resolveAttendance = useCallback(async (id: string, resolution: string): Promise<PublicServiceAttendance> => {
    return updateAttendance(id, {
      status: 'RESOLVED',
      resolution,
      resolutionDate: new Date().toISOString()
    } as any)
  }, [updateAttendance])

  const forwardAttendance = useCallback(async (id: string, referredTo: string): Promise<PublicServiceAttendance> => {
    return updateAttendance(id, {
      status: 'FORWARDED',
      referredTo
    } as any)
  }, [updateAttendance])

  const cancelAttendance = useCallback(async (id: string, reason: string): Promise<PublicServiceAttendance> => {
    return updateAttendance(id, {
      status: 'CANCELLED',
      resolution: reason
    } as any)
  }, [updateAttendance])

  const addFeedback = useCallback(async (id: string, rating: number, feedback?: string): Promise<PublicServiceAttendance> => {
    return updateAttendance(id, {
      satisfactionRating: rating,
      feedback
    } as any)
  }, [updateAttendance])

  const deleteAttendance = useCallback(async (id: string): Promise<void> => {
    try {
      setError(null)
      await apiClient.delete(`/api/secretarias/public-services/attendances/${id}`)
      setAttendances(prev => prev.filter(att => att.id !== id))
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao excluir atendimento'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const getAttendanceById = useCallback((id: string) => attendances.find(att => att.id === id), [attendances])
  const getPendingAttendances = useCallback(() => attendances.filter(att => ['WAITING', 'IN_SERVICE'].includes(att.status)), [attendances])
  const getAttendancesByCategory = useCallback((category: string) => attendances.filter(att => att.serviceCategory === category), [attendances])
  const getTodayAttendances = useCallback(() => {
    const today = new Date().toISOString().split('T')[0]
    return attendances.filter(att => att.attendanceDate === today)
  }, [attendances])

  const getAttendanceStats = useCallback((filters?: AttendanceFilters): AttendanceStats => {
    let filteredAttendances = attendances

    if (filters) {
      filteredAttendances = attendances.filter(att => {
        const matchesType = !filters.attendanceType || att.attendanceType === filters.attendanceType
        const matchesCategory = !filters.serviceCategory || att.serviceCategory === filters.serviceCategory
        const matchesStatus = !filters.status || att.status === filters.status
        const matchesPriority = !filters.priority || att.priority === filters.priority
        const matchesAttendee = !filters.attendedBy || att.attendedBy === filters.attendedBy
        const matchesDateFrom = !filters.dateFrom || att.attendanceDate >= filters.dateFrom
        const matchesDateTo = !filters.dateTo || att.attendanceDate <= filters.dateTo

        return matchesType && matchesCategory && matchesStatus && matchesPriority &&
               matchesAttendee && matchesDateFrom && matchesDateTo
      })
    }

    const totalAttendances = filteredAttendances.length
    const today = new Date().toISOString().split('T')[0]
    const todayAttendances = filteredAttendances.filter(att => att.attendanceDate === today).length
    const pendingAttendances = filteredAttendances.filter(att => ['WAITING', 'IN_SERVICE'].includes(att.status)).length

    const byType = filteredAttendances.reduce((acc, att) => {
      acc[att.attendanceType] = (acc[att.attendanceType] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const byCategory = filteredAttendances.reduce((acc, att) => {
      acc[att.serviceCategory] = (acc[att.serviceCategory] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const byStatus = filteredAttendances.reduce((acc, att) => {
      acc[att.status] = (acc[att.status] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const resolvedAttendances = filteredAttendances.filter(att => att.actualResolutionTime)
    const averageResolutionTime = resolvedAttendances.length > 0
      ? resolvedAttendances.reduce((sum, att) => sum + (att.actualResolutionTime || 0), 0) / resolvedAttendances.length
      : 0

    const ratedAttendances = filteredAttendances.filter(att => att.satisfactionRating)
    const satisfactionAverage = ratedAttendances.length > 0
      ? ratedAttendances.reduce((sum, att) => sum + (att.satisfactionRating || 0), 0) / ratedAttendances.length
      : 0

    return {
      totalAttendances,
      byType,
      byCategory,
      byStatus,
      averageResolutionTime,
      satisfactionAverage,
      pendingAttendances,
      todayAttendances
    }
  }, [attendances])

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
    resolveAttendance,
    forwardAttendance,
    cancelAttendance,
    addFeedback,
    deleteAttendance,
    getAttendanceById,
    getPendingAttendances,
    getAttendancesByCategory,
    getTodayAttendances,
    getAttendanceStats,
    refreshAttendances
  }
}