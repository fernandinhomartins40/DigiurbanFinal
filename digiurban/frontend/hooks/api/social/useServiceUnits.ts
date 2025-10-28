'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAdminAuth } from '@/contexts/AdminAuthContext'

interface ServiceUnit {
  id: string
  name: string
  type: 'CRAS' | 'CREAS' | 'CENTRO_CONVIVENCIA' | 'ABRIGO' | 'CASA_PASSAGEM'
  address: string
  neighborhood: string
  city: string
  zipCode: string
  phone: string
  email?: string
  coordinator: string
  coordinatorPhone: string
  capacity: number
  currentOccupancy: number
  servicesOffered: string[]
  operatingHours: string
  operatingDays: string[]
  status: 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE' | 'CONSTRUCTION'
  coverage: { neighborhoods: string[]; estimatedPopulation: number }
  staff: { role: string; name: string; registration?: string; phone?: string }[]
  equipment: { item: string; quantity: number; condition: 'GOOD' | 'REGULAR' | 'POOR' }[]
  createdAt: string
  updatedAt: string
}

interface CreateServiceUnitData {
  name: string
  type: 'CRAS' | 'CREAS' | 'CENTRO_CONVIVENCIA' | 'ABRIGO' | 'CASA_PASSAGEM'
  address: string
  neighborhood: string
  city: string
  zipCode: string
  phone: string
  email?: string
  coordinator: string
  coordinatorPhone: string
  capacity: number
  servicesOffered: string[]
  operatingHours: string
  operatingDays: string[]
  coverage: { neighborhoods: string[]; estimatedPopulation: number }
}

interface UpdateServiceUnitData extends Partial<CreateServiceUnitData> {
  currentOccupancy?: number
  status?: 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE' | 'CONSTRUCTION'
  staff?: { role: string; name: string; registration?: string; phone?: string }[]
  equipment?: { item: string; quantity: number; condition: 'GOOD' | 'REGULAR' | 'POOR' }[]
}

interface UseServiceUnitsReturn {
  serviceUnits: ServiceUnit[]
  loading: boolean
  error: string | null
  createServiceUnit: (data: CreateServiceUnitData) => Promise<ServiceUnit>
  updateServiceUnit: (id: string, data: UpdateServiceUnitData) => Promise<ServiceUnit>
  deleteServiceUnit: (id: string) => Promise<void>
  getServiceUnitById: (id: string) => ServiceUnit | undefined
  getServiceUnitsByType: (type: string) => ServiceUnit[]
  refreshServiceUnits: () => Promise<void>
}

export function useServiceUnits(): UseServiceUnitsReturn {
  const [serviceUnits, setServiceUnits] = useState<ServiceUnit[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchServiceUnits = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await apiClient.get('/api/secretarias/social-assistance/service-units')
      setServiceUnits(data.serviceUnits || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar unidades de serviço')
    } finally {
      setLoading(false)
    }
  }, [])

  const createServiceUnit = useCallback(async (data: CreateServiceUnitData): Promise<ServiceUnit> => {
    try {
      setError(null)
      const response = await apiClient.post('/api/secretarias/social-assistance/service-units', data)
      const newServiceUnit = response.serviceUnit
      setServiceUnits(prev => [newServiceUnit, ...prev])
      return newServiceUnit
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar unidade de serviço'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const updateServiceUnit = useCallback(async (id: string, data: UpdateServiceUnitData): Promise<ServiceUnit> => {
    try {
      setError(null)
      const response = await apiClient.put(`/api/secretarias/social-assistance/service-units/${id}`, data)
      const updatedServiceUnit = response.serviceUnit
      setServiceUnits(prev => prev.map(unit => unit.id === id ? updatedServiceUnit : unit))
      return updatedServiceUnit
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar unidade de serviço'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const deleteServiceUnit = useCallback(async (id: string): Promise<void> => {
    try {
      setError(null)
      await apiClient.delete(`/api/secretarias/social-assistance/service-units/${id}`)
      setServiceUnits(prev => prev.filter(unit => unit.id !== id))
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao excluir unidade de serviço'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const getServiceUnitById = useCallback((id: string) => serviceUnits.find(unit => unit.id === id), [serviceUnits])
  const getServiceUnitsByType = useCallback((type: string) => serviceUnits.filter(unit => unit.type === type), [serviceUnits])

  const refreshServiceUnits = useCallback(async () => {
    await fetchServiceUnits()
  }, [fetchServiceUnits])

  useEffect(() => {
    fetchServiceUnits()
  }, [fetchServiceUnits])

  return {
    serviceUnits,
    loading,
    error,
    createServiceUnit,
    updateServiceUnit,
    deleteServiceUnit,
    getServiceUnitById,
    getServiceUnitsByType,
    refreshServiceUnits
  }
}