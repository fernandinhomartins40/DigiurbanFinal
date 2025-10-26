'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAdminAuth } from '@/contexts/AdminAuthContext'

interface CleaningSchedule {
  id: string
  area: string
  district: string
  cleaningType: 'STREET_SWEEPING' | 'WASTE_COLLECTION' | 'DEEP_CLEANING' | 'DRAINAGE_CLEANING' | 'PARK_MAINTENANCE'
  frequency: 'DAILY' | 'WEEKLY' | 'BIWEEKLY' | 'MONTHLY' | 'QUARTERLY'
  scheduledDate: string
  scheduledTime: string
  teamId: string
  teamName: string
  vehicleId?: string
  vehiclePlate?: string
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'POSTPONED'
  actualStartTime?: string
  actualEndTime?: string
  duration?: number
  materials: string[]
  equipmentUsed: string[]
  wasteCollected?: number
  observations?: string
  photos?: string[]
  weatherConditions?: string
  citizenComplaints?: number
  qualityRating?: number
  supervisorId?: string
  createdAt: string
  updatedAt: string
}

interface CreateCleaningScheduleData {
  area: string
  district: string
  cleaningType: 'STREET_SWEEPING' | 'WASTE_COLLECTION' | 'DEEP_CLEANING' | 'DRAINAGE_CLEANING' | 'PARK_MAINTENANCE'
  frequency: 'DAILY' | 'WEEKLY' | 'BIWEEKLY' | 'MONTHLY' | 'QUARTERLY'
  scheduledDate: string
  scheduledTime: string
  teamId: string
  teamName: string
  vehicleId?: string
  vehiclePlate?: string
  materials: string[]
  equipmentUsed: string[]
  supervisorId?: string
}

interface UseCleaningScheduleReturn {
  cleaningSchedules: CleaningSchedule[]
  loading: boolean
  error: string | null
  createSchedule: (data: CreateCleaningScheduleData) => Promise<CleaningSchedule>
  updateSchedule: (id: string, data: Partial<CreateCleaningScheduleData>) => Promise<CleaningSchedule>
  startCleaning: (id: string) => Promise<CleaningSchedule>
  completeCleaning: (id: string, data: { wasteCollected?: number; observations?: string; photos?: string[] }) => Promise<CleaningSchedule>
  cancelSchedule: (id: string, reason: string) => Promise<CleaningSchedule>
  getTodaysSchedule: () => CleaningSchedule[]
  getScheduleByDistrict: (district: string) => CleaningSchedule[]
  refreshSchedules: () => Promise<void>
}

export function useCleaningSchedule(): UseCleaningScheduleReturn {
  const [cleaningSchedules, setCleaningSchedules] = useState<CleaningSchedule[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchSchedules = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await apiClient.get('/api/specialized/public-services/cleaning-schedule')
      setCleaningSchedules(data.schedules || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar cronograma de limpeza')
    } finally {
      setLoading(false)
    }
  }, [])

  const createSchedule = useCallback(async (data: CreateCleaningScheduleData): Promise<CleaningSchedule> => {
    try {
      setError(null)
      const response = await apiClient.post('/api/specialized/public-services/cleaning-schedule', data)
      const newSchedule = response.schedule
      setCleaningSchedules(prev => [newSchedule, ...prev])
      return newSchedule
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar cronograma'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const updateSchedule = useCallback(async (id: string, data: Partial<CreateCleaningScheduleData>): Promise<CleaningSchedule> => {
    try {
      setError(null)
      const response = await apiClient.put(`/api/specialized/public-services/cleaning-schedule/${id}`, data)
      const updatedSchedule = response.schedule
      setCleaningSchedules(prev => prev.map(schedule => schedule.id === id ? updatedSchedule : schedule))
      return updatedSchedule
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar cronograma'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const startCleaning = useCallback(async (id: string): Promise<CleaningSchedule> => {
    return updateSchedule(id, { status: 'IN_PROGRESS', actualStartTime: new Date().toISOString() } as any)
  }, [updateSchedule])

  const completeCleaning = useCallback(async (id: string, data: { wasteCollected?: number; observations?: string; photos?: string[] }): Promise<CleaningSchedule> => {
    return updateSchedule(id, { 
      status: 'COMPLETED', 
      actualEndTime: new Date().toISOString(),
      ...data
    } as any)
  }, [updateSchedule])

  const cancelSchedule = useCallback(async (id: string, reason: string): Promise<CleaningSchedule> => {
    return updateSchedule(id, { status: 'CANCELLED', observations: reason } as any)
  }, [updateSchedule])

  const getTodaysSchedule = useCallback(() => {
    const today = new Date().toISOString().split('T')[0]
    return cleaningSchedules.filter(schedule => schedule.scheduledDate === today)
  }, [cleaningSchedules])

  const getScheduleByDistrict = useCallback((district: string) => {
    return cleaningSchedules.filter(schedule => schedule.district === district)
  }, [cleaningSchedules])

  const refreshSchedules = useCallback(async () => {
    await fetchSchedules()
  }, [fetchSchedules])

  useEffect(() => {
    fetchSchedules()
  }, [fetchSchedules])

  return {
    cleaningSchedules,
    loading,
    error,
    createSchedule,
    updateSchedule,
    startCleaning,
    completeCleaning,
    cancelSchedule,
    getTodaysSchedule,
    getScheduleByDistrict,
    refreshSchedules
  }
}