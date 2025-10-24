'use client'

import { useState, useEffect, useCallback } from 'react'
import { apiClient } from '@/lib/auth'

interface SportsInfrastructure {
  id: string
  name: string
  type: 'STADIUM' | 'GYMNASIUM' | 'COURT' | 'FIELD' | 'POOL' | 'TRACK' | 'COMPLEX'
  modalities: string[]
  location: string
  address: string
  coordinates?: { lat: number; lng: number }
  capacity: number
  description: string
  facilities: {
    type: string
    quantity: number
    description: string
    condition: 'EXCELLENT' | 'GOOD' | 'REGULAR' | 'POOR' | 'CRITICAL'
  }[]
  equipment: {
    name: string
    type: string
    quantity: number
    condition: 'EXCELLENT' | 'GOOD' | 'REGULAR' | 'POOR' | 'CRITICAL'
    lastMaintenance?: string
    nextMaintenance?: string
  }[]
  maintenanceHistory: {
    id: string
    date: string
    type: 'PREVENTIVE' | 'CORRECTIVE' | 'IMPROVEMENT'
    description: string
    cost: number
    responsible: string
    status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'
  }[]
  usage: {
    currentBookings: {
      id: string
      user: string
      activity: string
      date: string
      startTime: string
      endTime: string
      status: 'CONFIRMED' | 'PENDING' | 'CANCELLED'
    }[]
    schedule: {
      day: 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY'
      periods: {
        startTime: string
        endTime: string
        activity: string
        responsible: string
        isRecurring: boolean
      }[]
    }[]
  }
  accessibility: {
    hasRamp: boolean
    hasAccessibleBathroom: boolean
    hasElevator: boolean
    hasAccessibleParking: boolean
    hasAccessibleSeating: boolean
    observations?: string
  }
  safety: {
    hasFireExtinguisher: boolean
    hasEmergencyExit: boolean
    hasFirstAidKit: boolean
    hasSecuritySystem: boolean
    lastSafetyInspection?: string
    nextSafetyInspection?: string
  }
  budget: {
    year: number
    allocated: number
    spent: number
    remaining: number
    categories: {
      category: string
      allocated: number
      spent: number
    }[]
  }
  isActive: boolean
  constructionDate?: string
  lastRenovation?: string
  createdAt: string
  updatedAt: string
}

interface CreateSportsInfrastructureData {
  name: string
  type: 'STADIUM' | 'GYMNASIUM' | 'COURT' | 'FIELD' | 'POOL' | 'TRACK' | 'COMPLEX'
  modalities: string[]
  location: string
  address: string
  capacity: number
  description: string
  constructionDate?: string
}

interface UseSportsInfrastructureReturn {
  infrastructure: SportsInfrastructure[]
  loading: boolean
  error: string | null
  createInfrastructure: (data: CreateSportsInfrastructureData) => Promise<SportsInfrastructure>
  updateInfrastructure: (id: string, data: Partial<CreateSportsInfrastructureData>) => Promise<SportsInfrastructure>
  addFacility: (id: string, facility: any) => Promise<SportsInfrastructure>
  addEquipment: (id: string, equipment: any) => Promise<SportsInfrastructure>
  scheduleMaintenance: (id: string, maintenance: any) => Promise<SportsInfrastructure>
  addBooking: (id: string, booking: any) => Promise<SportsInfrastructure>
  updateMaintenanceStatus: (id: string, maintenanceId: string, status: string) => Promise<SportsInfrastructure>
  deleteInfrastructure: (id: string) => Promise<void>
  getInfrastructureByType: (type: string) => SportsInfrastructure[]
  getAvailableInfrastructure: () => SportsInfrastructure[]
  getInfrastructureByModality: (modality: string) => SportsInfrastructure[]
  refreshInfrastructure: () => Promise<void>
}

export function useSportsInfrastructure(): UseSportsInfrastructureReturn {
  const [infrastructure, setInfrastructure] = useState<SportsInfrastructure[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchInfrastructure = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await apiClient.get('/api/specialized/sports/infrastructure')
      setInfrastructure(data.infrastructure || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar infraestrutura esportiva')
    } finally {
      setLoading(false)
    }
  }, [])

  const createInfrastructure = useCallback(async (data: CreateSportsInfrastructureData): Promise<SportsInfrastructure> => {
    try {
      setError(null)
      const response = await apiClient.post('/api/specialized/sports/infrastructure', data)
      const newInfrastructure = response.infrastructure
      setInfrastructure(prev => [newInfrastructure, ...prev])
      return newInfrastructure
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar infraestrutura'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const updateInfrastructure = useCallback(async (id: string, data: Partial<CreateSportsInfrastructureData>): Promise<SportsInfrastructure> => {
    try {
      setError(null)
      const response = await apiClient.put(`/api/specialized/sports/infrastructure/${id}`, data)
      const updatedInfrastructure = response.infrastructure
      setInfrastructure(prev => prev.map(infra => infra.id === id ? updatedInfrastructure : infra))
      return updatedInfrastructure
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar infraestrutura'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const addFacility = useCallback(async (id: string, facility: any): Promise<SportsInfrastructure> => {
    try {
      setError(null)
      const response = await apiClient.post(`/api/specialized/sports/infrastructure/${id}/facilities`, facility)
      const updatedInfrastructure = response.infrastructure
      setInfrastructure(prev => prev.map(infra => infra.id === id ? updatedInfrastructure : infra))
      return updatedInfrastructure
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao adicionar instalação'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const addEquipment = useCallback(async (id: string, equipment: any): Promise<SportsInfrastructure> => {
    try {
      setError(null)
      const response = await apiClient.post(`/api/specialized/sports/infrastructure/${id}/equipment`, equipment)
      const updatedInfrastructure = response.infrastructure
      setInfrastructure(prev => prev.map(infra => infra.id === id ? updatedInfrastructure : infra))
      return updatedInfrastructure
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao adicionar equipamento'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const scheduleMaintenance = useCallback(async (id: string, maintenance: any): Promise<SportsInfrastructure> => {
    try {
      setError(null)
      const response = await apiClient.post(`/api/specialized/sports/infrastructure/${id}/maintenance`, maintenance)
      const updatedInfrastructure = response.infrastructure
      setInfrastructure(prev => prev.map(infra => infra.id === id ? updatedInfrastructure : infra))
      return updatedInfrastructure
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao agendar manutenção'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const addBooking = useCallback(async (id: string, booking: any): Promise<SportsInfrastructure> => {
    try {
      setError(null)
      const response = await apiClient.post(`/api/specialized/sports/infrastructure/${id}/bookings`, booking)
      const updatedInfrastructure = response.infrastructure
      setInfrastructure(prev => prev.map(infra => infra.id === id ? updatedInfrastructure : infra))
      return updatedInfrastructure
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao adicionar agendamento'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const updateMaintenanceStatus = useCallback(async (id: string, maintenanceId: string, status: string): Promise<SportsInfrastructure> => {
    try {
      setError(null)
      const response = await apiClient.put(`/api/specialized/sports/infrastructure/${id}/maintenance/${maintenanceId}`, { status })
      const updatedInfrastructure = response.infrastructure
      setInfrastructure(prev => prev.map(infra => infra.id === id ? updatedInfrastructure : infra))
      return updatedInfrastructure
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar status da manutenção'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const deleteInfrastructure = useCallback(async (id: string): Promise<void> => {
    try {
      setError(null)
      await apiClient.delete(`/api/specialized/sports/infrastructure/${id}`)
      setInfrastructure(prev => prev.filter(infra => infra.id !== id))
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao excluir infraestrutura'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const getInfrastructureByType = useCallback((type: string) => infrastructure.filter(infra => infra.type === type), [infrastructure])
  const getAvailableInfrastructure = useCallback(() => infrastructure.filter(infra => infra.isActive), [infrastructure])
  const getInfrastructureByModality = useCallback((modality: string) => infrastructure.filter(infra => infra.modalities.includes(modality)), [infrastructure])

  const refreshInfrastructure = useCallback(async () => {
    await fetchInfrastructure()
  }, [fetchInfrastructure])

  useEffect(() => {
    fetchInfrastructure()
  }, [fetchInfrastructure])

  return {
    infrastructure,
    loading,
    error,
    createInfrastructure,
    updateInfrastructure,
    addFacility,
    addEquipment,
    scheduleMaintenance,
    addBooking,
    updateMaintenanceStatus,
    deleteInfrastructure,
    getInfrastructureByType,
    getAvailableInfrastructure,
    getInfrastructureByModality,
    refreshInfrastructure
  }
}