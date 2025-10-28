'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAdminAuth } from '@/contexts/AdminAuthContext'

interface StreetLight {
  id: string
  lightNumber: string
  location: string
  coordinates: { lat: number; lng: number }
  district: string
  lightType: 'LED' | 'SODIUM' | 'HALOGEN' | 'FLUORESCENT'
  power: number
  height: number
  installationDate: string
  status: 'WORKING' | 'BROKEN' | 'MAINTENANCE' | 'OFF'
  lastMaintenance?: string
  nextMaintenance?: string
  energyConsumption?: number
  reportedIssues: {
    date: string
    type: 'NOT_WORKING' | 'FLICKERING' | 'WEAK_LIGHT' | 'BROKEN_POLE' | 'VANDALISM'
    reportedBy: string
    description: string
    resolved: boolean
    resolutionDate?: string
  }[]
  maintenanceHistory: {
    date: string
    type: 'ROUTINE' | 'REPAIR' | 'REPLACEMENT' | 'CLEANING'
    description: string
    cost: number
    technician: string
  }[]
  createdAt: string
  updatedAt: string
}

interface CreateStreetLightData {
  lightNumber: string
  location: string
  coordinates: { lat: number; lng: number }
  district: string
  lightType: 'LED' | 'SODIUM' | 'HALOGEN' | 'FLUORESCENT'
  power: number
  height: number
  installationDate: string
}

interface ReportIssueData {
  type: 'NOT_WORKING' | 'FLICKERING' | 'WEAK_LIGHT' | 'BROKEN_POLE' | 'VANDALISM'
  reportedBy: string
  description: string
}

interface MaintenanceData {
  type: 'ROUTINE' | 'REPAIR' | 'REPLACEMENT' | 'CLEANING'
  description: string
  cost: number
  technician: string
}

interface UseStreetLightingReturn {
  streetLights: StreetLight[]
  loading: boolean
  error: string | null
  createStreetLight: (data: CreateStreetLightData) => Promise<StreetLight>
  updateStreetLight: (id: string, data: Partial<CreateStreetLightData>) => Promise<StreetLight>
  reportIssue: (id: string, issue: ReportIssueData) => Promise<StreetLight>
  addMaintenance: (id: string, maintenance: MaintenanceData) => Promise<StreetLight>
  updateStatus: (id: string, status: 'WORKING' | 'BROKEN' | 'MAINTENANCE' | 'OFF') => Promise<StreetLight>
  deleteStreetLight: (id: string) => Promise<void>
  getBrokenLights: () => StreetLight[]
  getLightsByDistrict: (district: string) => StreetLight[]
  getLightsNeedingMaintenance: () => StreetLight[]
  refreshStreetLights: () => Promise<void>
}

export function useStreetLighting(): UseStreetLightingReturn {
  const [streetLights, setStreetLights] = useState<StreetLight[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStreetLights = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await apiClient.get('/api/secretarias/public-services/street-lighting')
      setStreetLights(data.streetLights || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar iluminação pública')
    } finally {
      setLoading(false)
    }
  }, [])

  const createStreetLight = useCallback(async (data: CreateStreetLightData): Promise<StreetLight> => {
    try {
      setError(null)
      const response = await apiClient.post('/api/secretarias/public-services/street-lighting', data)
      const newLight = response.streetLight
      setStreetLights(prev => [newLight, ...prev])
      return newLight
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar ponto de luz'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const updateStreetLight = useCallback(async (id: string, data: Partial<CreateStreetLightData>): Promise<StreetLight> => {
    try {
      setError(null)
      const response = await apiClient.put(`/api/secretarias/public-services/street-lighting/${id}`, data)
      const updatedLight = response.streetLight
      setStreetLights(prev => prev.map(light => light.id === id ? updatedLight : light))
      return updatedLight
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar ponto de luz'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const reportIssue = useCallback(async (id: string, issue: ReportIssueData): Promise<StreetLight> => {
    try {
      setError(null)
      const response = await apiClient.post(`/api/secretarias/public-services/street-lighting/${id}/issues`, issue)
      const updatedLight = response.streetLight
      setStreetLights(prev => prev.map(light => light.id === id ? updatedLight : light))
      return updatedLight
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao reportar problema'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const addMaintenance = useCallback(async (id: string, maintenance: MaintenanceData): Promise<StreetLight> => {
    try {
      setError(null)
      const response = await apiClient.post(`/api/secretarias/public-services/street-lighting/${id}/maintenance`, maintenance)
      const updatedLight = response.streetLight
      setStreetLights(prev => prev.map(light => light.id === id ? updatedLight : light))
      return updatedLight
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao registrar manutenção'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const updateStatus = useCallback(async (id: string, status: 'WORKING' | 'BROKEN' | 'MAINTENANCE' | 'OFF'): Promise<StreetLight> => {
    return updateStreetLight(id, { status } as any)
  }, [updateStreetLight])

  const deleteStreetLight = useCallback(async (id: string): Promise<void> => {
    try {
      setError(null)
      await apiClient.delete(`/api/secretarias/public-services/street-lighting/${id}`)
      setStreetLights(prev => prev.filter(light => light.id !== id))
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao excluir ponto de luz'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const getBrokenLights = useCallback(() => streetLights.filter(light => light.status === 'BROKEN'), [streetLights])
  const getLightsByDistrict = useCallback((district: string) => streetLights.filter(light => light.district === district), [streetLights])
  const getLightsNeedingMaintenance = useCallback(() => {
    const today = new Date()
    return streetLights.filter(light => {
      if (!light.nextMaintenance) return false
      return new Date(light.nextMaintenance) <= today
    })
  }, [streetLights])

  const refreshStreetLights = useCallback(async () => {
    await fetchStreetLights()
  }, [fetchStreetLights])

  useEffect(() => {
    fetchStreetLights()
  }, [fetchStreetLights])

  return {
    streetLights,
    loading,
    error,
    createStreetLight,
    updateStreetLight,
    reportIssue,
    addMaintenance,
    updateStatus,
    deleteStreetLight,
    getBrokenLights,
    getLightsByDistrict,
    getLightsNeedingMaintenance,
    refreshStreetLights
  }
}