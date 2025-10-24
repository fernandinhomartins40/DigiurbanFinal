'use client'

import { useState, useEffect, useCallback } from 'react'
import { apiClient } from '@/lib/auth'

interface GuardSupportRequest {
  id: string
  requestType: 'BACKUP' | 'REINFORCEMENT' | 'EMERGENCY_ASSISTANCE' | 'EQUIPMENT' | 'TRANSPORTATION'
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  requestedBy: string
  location: string
  coordinates?: { lat: number; lng: number }
  description: string
  requestTime: string
  status: 'PENDING' | 'ASSIGNED' | 'EN_ROUTE' | 'ON_SITE' | 'COMPLETED' | 'CANCELLED'
  assignedUnits: { unitId: string; officerCount: number; estimatedArrival?: string }[]
  responseTime?: number
  completionTime?: string
  outcome?: string
  createdAt: string
  updatedAt: string
}

interface CreateGuardSupportRequestData {
  requestType: 'BACKUP' | 'REINFORCEMENT' | 'EMERGENCY_ASSISTANCE' | 'EQUIPMENT' | 'TRANSPORTATION'
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  requestedBy: string
  location: string
  coordinates?: { lat: number; lng: number }
  description: string
}

interface UseGuardSupportReturn {
  supportRequests: GuardSupportRequest[]
  loading: boolean
  error: string | null
  createSupportRequest: (data: CreateGuardSupportRequestData) => Promise<GuardSupportRequest>
  assignUnits: (id: string, units: { unitId: string; officerCount: number }[]) => Promise<GuardSupportRequest>
  updateStatus: (id: string, status: string) => Promise<GuardSupportRequest>
  completeSupportRequest: (id: string, outcome: string) => Promise<GuardSupportRequest>
  getPendingRequests: () => GuardSupportRequest[]
  getCriticalRequests: () => GuardSupportRequest[]
  refreshSupportRequests: () => Promise<void>
}

export function useGuardSupport(): UseGuardSupportReturn {
  const [supportRequests, setSupportRequests] = useState<GuardSupportRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchSupportRequests = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await apiClient.get('/api/specialized/security/guard-support')
      setSupportRequests(data.supportRequests || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar solicitações de apoio')
    } finally {
      setLoading(false)
    }
  }, [])

  const createSupportRequest = useCallback(async (data: CreateGuardSupportRequestData): Promise<GuardSupportRequest> => {
    try {
      setError(null)
      const response = await apiClient.post('/api/specialized/security/guard-support', data)
      const newRequest = response.supportRequest
      setSupportRequests(prev => [newRequest, ...prev])
      return newRequest
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar solicitação de apoio'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const assignUnits = useCallback(async (id: string, units: { unitId: string; officerCount: number }[]): Promise<GuardSupportRequest> => {
    try {
      setError(null)
      const response = await apiClient.put(`/api/specialized/security/guard-support/${id}/assign`, { units })
      const updatedRequest = response.supportRequest
      setSupportRequests(prev => prev.map(req => req.id === id ? updatedRequest : req))
      return updatedRequest
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atribuir unidades'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const updateStatus = useCallback(async (id: string, status: string): Promise<GuardSupportRequest> => {
    try {
      setError(null)
      const response = await apiClient.put(`/api/specialized/security/guard-support/${id}/status`, { status })
      const updatedRequest = response.supportRequest
      setSupportRequests(prev => prev.map(req => req.id === id ? updatedRequest : req))
      return updatedRequest
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar status'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const completeSupportRequest = useCallback(async (id: string, outcome: string): Promise<GuardSupportRequest> => {
    try {
      setError(null)
      const response = await apiClient.put(`/api/specialized/security/guard-support/${id}/complete`, { outcome })
      const updatedRequest = response.supportRequest
      setSupportRequests(prev => prev.map(req => req.id === id ? updatedRequest : req))
      return updatedRequest
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao finalizar solicitação'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const getPendingRequests = useCallback(() => supportRequests.filter(req => req.status === 'PENDING'), [supportRequests])
  const getCriticalRequests = useCallback(() => supportRequests.filter(req => req.priority === 'CRITICAL'), [supportRequests])

  const refreshSupportRequests = useCallback(async () => {
    await fetchSupportRequests()
  }, [fetchSupportRequests])

  useEffect(() => {
    fetchSupportRequests()
  }, [fetchSupportRequests])

  return {
    supportRequests,
    loading,
    error,
    createSupportRequest,
    assignUnits,
    updateStatus,
    completeSupportRequest,
    getPendingRequests,
    getCriticalRequests,
    refreshSupportRequests
  }
}