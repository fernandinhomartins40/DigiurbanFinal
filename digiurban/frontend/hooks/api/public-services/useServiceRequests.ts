'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAdminAuth } from '@/contexts/AdminAuthContext'

interface ServiceRequest {
  id: string
  requestNumber: string
  citizenName: string
  citizenCpf: string
  citizenPhone: string
  citizenEmail?: string
  serviceType: 'CLEANING' | 'LIGHTING' | 'PAVEMENT' | 'DRAINAGE' | 'GARDENING' | 'MAINTENANCE' | 'OTHER'
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  status: 'PENDING' | 'ASSIGNED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'
  description: string
  location: string
  coordinates?: { lat: number; lng: number }
  photos?: string[]
  requestDate: string
  assignedTeam?: string
  assignedDate?: string
  startDate?: string
  completionDate?: string
  estimatedCompletion?: string
  cost?: number
  materials?: string[]
  observations?: string
  satisfactionRating?: number
  citizenFeedback?: string
  createdAt: string
  updatedAt: string
}

interface CreateServiceRequestData {
  citizenName: string
  citizenCpf: string
  citizenPhone: string
  citizenEmail?: string
  serviceType: 'CLEANING' | 'LIGHTING' | 'PAVEMENT' | 'DRAINAGE' | 'GARDENING' | 'MAINTENANCE' | 'OTHER'
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  description: string
  location: string
  coordinates?: { lat: number; lng: number }
  photos?: string[]
}

interface UpdateServiceRequestData extends Partial<CreateServiceRequestData> {
  status?: 'PENDING' | 'ASSIGNED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'
  assignedTeam?: string
  assignedDate?: string
  startDate?: string
  completionDate?: string
  estimatedCompletion?: string
  cost?: number
  materials?: string[]
  observations?: string
  satisfactionRating?: number
  citizenFeedback?: string
}

interface ServiceRequestFilters {
  serviceType?: string
  priority?: string
  status?: string
  assignedTeam?: string
  dateFrom?: string
  dateTo?: string
  location?: string
}

interface UseServiceRequestsReturn {
  serviceRequests: ServiceRequest[]
  loading: boolean
  error: string | null
  createServiceRequest: (data: CreateServiceRequestData) => Promise<ServiceRequest>
  updateServiceRequest: (id: string, data: UpdateServiceRequestData) => Promise<ServiceRequest>
  assignTeam: (id: string, teamId: string) => Promise<ServiceRequest>
  completeServiceRequest: (id: string, observations?: string) => Promise<ServiceRequest>
  cancelServiceRequest: (id: string, reason: string) => Promise<ServiceRequest>
  deleteServiceRequest: (id: string) => Promise<void>
  getServiceRequestById: (id: string) => ServiceRequest | undefined
  getPendingRequests: () => ServiceRequest[]
  getHighPriorityRequests: () => ServiceRequest[]
  refreshServiceRequests: (filters?: ServiceRequestFilters) => Promise<void>
}

export function useServiceRequests(initialFilters?: ServiceRequestFilters): UseServiceRequestsReturn {
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchServiceRequests = useCallback(async (filters?: ServiceRequestFilters) => {
    try {
      setLoading(true)
      setError(null)
      const queryParams = new URLSearchParams()
      if (filters?.serviceType) queryParams.append('serviceType', filters.serviceType)
      if (filters?.priority) queryParams.append('priority', filters.priority)
      if (filters?.status) queryParams.append('status', filters.status)
      if (filters?.assignedTeam) queryParams.append('assignedTeam', filters.assignedTeam)
      if (filters?.dateFrom) queryParams.append('dateFrom', filters.dateFrom)
      if (filters?.dateTo) queryParams.append('dateTo', filters.dateTo)
      if (filters?.location) queryParams.append('location', filters.location)

      const query = queryParams.toString()
      const endpoint = `/api/specialized/public-services/service-requests${query ? `?${query}` : ''}`
      const data = await apiClient.get(endpoint)
      setServiceRequests(data.serviceRequests || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar solicitações de serviço')
    } finally {
      setLoading(false)
    }
  }, [])

  const createServiceRequest = useCallback(async (data: CreateServiceRequestData): Promise<ServiceRequest> => {
    try {
      setError(null)
      const response = await apiClient.post('/api/specialized/public-services/service-requests', data)
      const newRequest = response.serviceRequest
      setServiceRequests(prev => [newRequest, ...prev])
      return newRequest
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar solicitação'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const updateServiceRequest = useCallback(async (id: string, data: UpdateServiceRequestData): Promise<ServiceRequest> => {
    try {
      setError(null)
      const response = await apiClient.put(`/api/specialized/public-services/service-requests/${id}`, data)
      const updatedRequest = response.serviceRequest
      setServiceRequests(prev => prev.map(req => req.id === id ? updatedRequest : req))
      return updatedRequest
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar solicitação'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const assignTeam = useCallback(async (id: string, teamId: string): Promise<ServiceRequest> => {
    return updateServiceRequest(id, { assignedTeam: teamId, status: 'ASSIGNED', assignedDate: new Date().toISOString() })
  }, [updateServiceRequest])

  const completeServiceRequest = useCallback(async (id: string, observations?: string): Promise<ServiceRequest> => {
    return updateServiceRequest(id, { status: 'COMPLETED', completionDate: new Date().toISOString(), observations })
  }, [updateServiceRequest])

  const cancelServiceRequest = useCallback(async (id: string, reason: string): Promise<ServiceRequest> => {
    return updateServiceRequest(id, { status: 'CANCELLED', observations: reason })
  }, [updateServiceRequest])

  const deleteServiceRequest = useCallback(async (id: string): Promise<void> => {
    try {
      setError(null)
      await apiClient.delete(`/api/specialized/public-services/service-requests/${id}`)
      setServiceRequests(prev => prev.filter(req => req.id !== id))
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao excluir solicitação'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const getServiceRequestById = useCallback((id: string) => serviceRequests.find(req => req.id === id), [serviceRequests])
  const getPendingRequests = useCallback(() => serviceRequests.filter(req => req.status === 'PENDING'), [serviceRequests])
  const getHighPriorityRequests = useCallback(() => serviceRequests.filter(req => ['HIGH', 'URGENT'].includes(req.priority)), [serviceRequests])

  const refreshServiceRequests = useCallback(async (filters?: ServiceRequestFilters) => {
    await fetchServiceRequests(filters)
  }, [fetchServiceRequests])

  useEffect(() => {
    fetchServiceRequests(initialFilters)
  }, [fetchServiceRequests, initialFilters])

  return {
    serviceRequests,
    loading,
    error,
    createServiceRequest,
    updateServiceRequest,
    assignTeam,
    completeServiceRequest,
    cancelServiceRequest,
    deleteServiceRequest,
    getServiceRequestById,
    getPendingRequests,
    getHighPriorityRequests,
    refreshServiceRequests
  }
}