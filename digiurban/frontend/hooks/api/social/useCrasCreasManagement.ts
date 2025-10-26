'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAdminAuth } from '@/contexts/AdminAuthContext'

interface CrasCreasManagement {
  id: string
  serviceUnitId: string
  month: string
  year: number
  familiesRegistered: number
  familiesAttended: number
  individualAttendances: number
  groupActivities: number
  homeVisits: number
  territorialActions: number
  socialWorkersCount: number
  psychologistsCount: number
  otherProfessionalsCount: number
  equipmentCondition: 'EXCELLENT' | 'GOOD' | 'REGULAR' | 'POOR'
  structuralNeeds: string[]
  achievements: string[]
  challenges: string[]
  goals: string[]
  budget: { allocated: number; spent: number; remaining: number }
  serviceUnit?: { id: string; name: string; type: string }
  createdAt: string
  updatedAt: string
}

interface CreateCrasCreasManagementData {
  serviceUnitId: string
  month: string
  year: number
  familiesRegistered: number
  familiesAttended: number
  individualAttendances: number
  groupActivities: number
  homeVisits: number
  territorialActions: number
  socialWorkersCount: number
  psychologistsCount: number
  otherProfessionalsCount: number
  equipmentCondition: 'EXCELLENT' | 'GOOD' | 'REGULAR' | 'POOR'
  structuralNeeds: string[]
  achievements: string[]
  challenges: string[]
  goals: string[]
  budget: { allocated: number; spent: number; remaining: number }
}

interface UpdateCrasCreasManagementData extends Partial<CreateCrasCreasManagementData> {}

interface ManagementFilters {
  serviceUnitId?: string
  year?: number
  month?: string
}

interface UseCrasCreasManagementReturn {
  managementData: CrasCreasManagement[]
  loading: boolean
  error: string | null
  createManagement: (data: CreateCrasCreasManagementData) => Promise<CrasCreasManagement>
  updateManagement: (id: string, data: UpdateCrasCreasManagementData) => Promise<CrasCreasManagement>
  deleteManagement: (id: string) => Promise<void>
  getManagementById: (id: string) => CrasCreasManagement | undefined
  getManagementByUnit: (serviceUnitId: string) => CrasCreasManagement[]
  refreshManagement: (filters?: ManagementFilters) => Promise<void>
}

export function useCrasCreasManagement(initialFilters?: ManagementFilters): UseCrasCreasManagementReturn {
  const [managementData, setManagementData] = useState<CrasCreasManagement[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchManagement = useCallback(async (filters?: ManagementFilters) => {
    try {
      setLoading(true)
      setError(null)
      const queryParams = new URLSearchParams()
      if (filters?.serviceUnitId) queryParams.append('serviceUnitId', filters.serviceUnitId)
      if (filters?.year) queryParams.append('year', filters.year.toString())
      if (filters?.month) queryParams.append('month', filters.month)

      const query = queryParams.toString()
      const endpoint = `/api/specialized/social-assistance/cras-creas-management${query ? `?${query}` : ''}`
      const data = await apiClient.get(endpoint)
      setManagementData(data.managementData || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar dados de gestão')
    } finally {
      setLoading(false)
    }
  }, [])

  const createManagement = useCallback(async (data: CreateCrasCreasManagementData): Promise<CrasCreasManagement> => {
    try {
      setError(null)
      const response = await apiClient.post('/api/specialized/social-assistance/cras-creas-management', data)
      const newManagement = response.management
      setManagementData(prev => [newManagement, ...prev])
      return newManagement
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar dados de gestão'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const updateManagement = useCallback(async (id: string, data: UpdateCrasCreasManagementData): Promise<CrasCreasManagement> => {
    try {
      setError(null)
      const response = await apiClient.put(`/api/specialized/social-assistance/cras-creas-management/${id}`, data)
      const updatedManagement = response.management
      setManagementData(prev => prev.map(mgmt => mgmt.id === id ? updatedManagement : mgmt))
      return updatedManagement
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar dados de gestão'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const deleteManagement = useCallback(async (id: string): Promise<void> => {
    try {
      setError(null)
      await apiClient.delete(`/api/specialized/social-assistance/cras-creas-management/${id}`)
      setManagementData(prev => prev.filter(mgmt => mgmt.id !== id))
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao excluir dados de gestão'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const getManagementById = useCallback((id: string) => managementData.find(mgmt => mgmt.id === id), [managementData])
  const getManagementByUnit = useCallback((serviceUnitId: string) => managementData.filter(mgmt => mgmt.serviceUnitId === serviceUnitId), [managementData])

  const refreshManagement = useCallback(async (filters?: ManagementFilters) => {
    await fetchManagement(filters)
  }, [fetchManagement])

  useEffect(() => {
    fetchManagement(initialFilters)
  }, [fetchManagement, initialFilters])

  return {
    managementData,
    loading,
    error,
    createManagement,
    updateManagement,
    deleteManagement,
    getManagementById,
    getManagementByUnit,
    refreshManagement
  }
}