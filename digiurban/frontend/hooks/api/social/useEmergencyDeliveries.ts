'use client'

import { useState, useEffect, useCallback } from 'react'
import { apiClient } from '@/lib/auth'

interface EmergencyDelivery {
  id: string
  familyId: string
  requestDate: string
  deliveryDate?: string
  requestType: 'FOOD_BASKET' | 'CLOTHING' | 'HYGIENE_KIT' | 'MEDICATION' | 'EMERGENCY_AID' | 'OTHER'
  urgency: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  description: string
  quantity: number
  unit: string
  estimatedValue: number
  deliveryAddress: string
  contactPerson: string
  contactPhone: string
  status: 'REQUESTED' | 'APPROVED' | 'PREPARED' | 'IN_TRANSIT' | 'DELIVERED' | 'CANCELLED'
  approvedBy?: string
  approvalDate?: string
  deliveredBy?: string
  receivedBy?: string
  observations?: string
  family?: { id: string; responsibleName: string; registrationNumber: string }
  createdAt: string
  updatedAt: string
}

interface CreateEmergencyDeliveryData {
  familyId: string
  requestType: 'FOOD_BASKET' | 'CLOTHING' | 'HYGIENE_KIT' | 'MEDICATION' | 'EMERGENCY_AID' | 'OTHER'
  urgency: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  description: string
  quantity: number
  unit: string
  estimatedValue: number
  deliveryAddress: string
  contactPerson: string
  contactPhone: string
  observations?: string
}

interface UpdateEmergencyDeliveryData extends Partial<CreateEmergencyDeliveryData> {
  deliveryDate?: string
  status?: 'REQUESTED' | 'APPROVED' | 'PREPARED' | 'IN_TRANSIT' | 'DELIVERED' | 'CANCELLED'
  approvedBy?: string
  approvalDate?: string
  deliveredBy?: string
  receivedBy?: string
}

interface DeliveryFilters {
  familyId?: string
  requestType?: 'FOOD_BASKET' | 'CLOTHING' | 'HYGIENE_KIT' | 'MEDICATION' | 'EMERGENCY_AID' | 'OTHER'
  urgency?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  status?: 'REQUESTED' | 'APPROVED' | 'PREPARED' | 'IN_TRANSIT' | 'DELIVERED' | 'CANCELLED'
  dateFrom?: string
  dateTo?: string
}

interface UseEmergencyDeliveriesReturn {
  deliveries: EmergencyDelivery[]
  loading: boolean
  error: string | null
  createDelivery: (data: CreateEmergencyDeliveryData) => Promise<EmergencyDelivery>
  updateDelivery: (id: string, data: UpdateEmergencyDeliveryData) => Promise<EmergencyDelivery>
  approveDelivery: (id: string) => Promise<EmergencyDelivery>
  markAsDelivered: (id: string, deliveredBy: string, receivedBy: string) => Promise<EmergencyDelivery>
  cancelDelivery: (id: string, reason: string) => Promise<EmergencyDelivery>
  deleteDelivery: (id: string) => Promise<void>
  getDeliveryById: (id: string) => EmergencyDelivery | undefined
  getDeliveriesByFamily: (familyId: string) => EmergencyDelivery[]
  getPendingDeliveries: () => EmergencyDelivery[]
  refreshDeliveries: (filters?: DeliveryFilters) => Promise<void>
}

export function useEmergencyDeliveries(initialFilters?: DeliveryFilters): UseEmergencyDeliveriesReturn {
  const [deliveries, setDeliveries] = useState<EmergencyDelivery[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchDeliveries = useCallback(async (filters?: DeliveryFilters) => {
    try {
      setLoading(true)
      setError(null)
      const queryParams = new URLSearchParams()
      if (filters?.familyId) queryParams.append('familyId', filters.familyId)
      if (filters?.requestType) queryParams.append('requestType', filters.requestType)
      if (filters?.urgency) queryParams.append('urgency', filters.urgency)
      if (filters?.status) queryParams.append('status', filters.status)
      if (filters?.dateFrom) queryParams.append('dateFrom', filters.dateFrom)
      if (filters?.dateTo) queryParams.append('dateTo', filters.dateTo)

      const query = queryParams.toString()
      const endpoint = `/api/specialized/social-assistance/emergency-deliveries${query ? `?${query}` : ''}`
      const data = await apiClient.get(endpoint)
      setDeliveries(data.deliveries || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar entregas emergenciais')
    } finally {
      setLoading(false)
    }
  }, [])

  const createDelivery = useCallback(async (data: CreateEmergencyDeliveryData): Promise<EmergencyDelivery> => {
    try {
      setError(null)
      const response = await apiClient.post('/api/specialized/social-assistance/emergency-deliveries', data)
      const newDelivery = response.delivery
      setDeliveries(prev => [newDelivery, ...prev])
      return newDelivery
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar entrega emergencial'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const updateDelivery = useCallback(async (id: string, data: UpdateEmergencyDeliveryData): Promise<EmergencyDelivery> => {
    try {
      setError(null)
      const response = await apiClient.put(`/api/specialized/social-assistance/emergency-deliveries/${id}`, data)
      const updatedDelivery = response.delivery
      setDeliveries(prev => prev.map(delivery => delivery.id === id ? updatedDelivery : delivery))
      return updatedDelivery
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar entrega'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const approveDelivery = useCallback(async (id: string): Promise<EmergencyDelivery> => {
    return updateDelivery(id, { status: 'APPROVED', approvalDate: new Date().toISOString() })
  }, [updateDelivery])

  const markAsDelivered = useCallback(async (id: string, deliveredBy: string, receivedBy: string): Promise<EmergencyDelivery> => {
    return updateDelivery(id, {
      status: 'DELIVERED',
      deliveryDate: new Date().toISOString(),
      deliveredBy,
      receivedBy
    })
  }, [updateDelivery])

  const cancelDelivery = useCallback(async (id: string, reason: string): Promise<EmergencyDelivery> => {
    return updateDelivery(id, { status: 'CANCELLED', observations: reason })
  }, [updateDelivery])

  const deleteDelivery = useCallback(async (id: string): Promise<void> => {
    try {
      setError(null)
      await apiClient.delete(`/api/specialized/social-assistance/emergency-deliveries/${id}`)
      setDeliveries(prev => prev.filter(delivery => delivery.id !== id))
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao excluir entrega'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const getDeliveryById = useCallback((id: string) => deliveries.find(delivery => delivery.id === id), [deliveries])
  const getDeliveriesByFamily = useCallback((familyId: string) => deliveries.filter(delivery => delivery.familyId === familyId), [deliveries])
  const getPendingDeliveries = useCallback(() => deliveries.filter(delivery => ['REQUESTED', 'APPROVED', 'PREPARED', 'IN_TRANSIT'].includes(delivery.status)), [deliveries])

  const refreshDeliveries = useCallback(async (filters?: DeliveryFilters) => {
    await fetchDeliveries(filters)
  }, [fetchDeliveries])

  useEffect(() => {
    fetchDeliveries(initialFilters)
  }, [fetchDeliveries, initialFilters])

  return {
    deliveries,
    loading,
    error,
    createDelivery,
    updateDelivery,
    approveDelivery,
    markAsDelivered,
    cancelDelivery,
    deleteDelivery,
    getDeliveryById,
    getDeliveriesByFamily,
    getPendingDeliveries,
    refreshDeliveries
  }
}