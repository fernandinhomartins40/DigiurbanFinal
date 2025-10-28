'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAdminAuth } from '@/contexts/AdminAuthContext'

interface CriticalPoint {
  id: string
  name: string
  type: 'HIGH_CRIME' | 'DRUG_POINT' | 'VIOLENCE_PRONE' | 'ACCIDENT_PRONE' | 'THEFT_HOTSPOT' | 'VANDALISM_AREA'
  coordinates: { lat: number; lng: number }
  address: string
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  description: string
  identifiedDate: string
  reportedBy: string
  incidentHistory: { date: string; type: string; description: string }[]
  securityMeasures: string[]
  patrolFrequency: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'AS_NEEDED'
  lastPatrolDate?: string
  nextPatrolDate?: string
  isActive: boolean
  observations?: string
  photos?: string[]
  createdAt: string
  updatedAt: string
}

interface CreateCriticalPointData {
  name: string
  type: 'HIGH_CRIME' | 'DRUG_POINT' | 'VIOLENCE_PRONE' | 'ACCIDENT_PRONE' | 'THEFT_HOTSPOT' | 'VANDALISM_AREA'
  coordinates: { lat: number; lng: number }
  address: string
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  description: string
  reportedBy: string
  securityMeasures: string[]
  patrolFrequency: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'AS_NEEDED'
  observations?: string
}

interface UseCriticalPointsReturn {
  criticalPoints: CriticalPoint[]
  loading: boolean
  error: string | null
  createCriticalPoint: (data: CreateCriticalPointData) => Promise<CriticalPoint>
  updateCriticalPoint: (id: string, data: Partial<CreateCriticalPointData>) => Promise<CriticalPoint>
  addIncident: (id: string, incident: { type: string; description: string }) => Promise<CriticalPoint>
  updatePatrolDate: (id: string, date: string) => Promise<CriticalPoint>
  deleteCriticalPoint: (id: string) => Promise<void>
  getCriticalPointById: (id: string) => CriticalPoint | undefined
  getHighRiskPoints: () => CriticalPoint[]
  refreshCriticalPoints: () => Promise<void>
}

export function useCriticalPoints(): UseCriticalPointsReturn {
  const [criticalPoints, setCriticalPoints] = useState<CriticalPoint[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCriticalPoints = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await apiClient.get('/api/secretarias/security/critical-points')
      setCriticalPoints(data.criticalPoints || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar pontos críticos')
    } finally {
      setLoading(false)
    }
  }, [])

  const createCriticalPoint = useCallback(async (data: CreateCriticalPointData): Promise<CriticalPoint> => {
    try {
      setError(null)
      const response = await apiClient.post('/api/secretarias/security/critical-points', data)
      const newPoint = response.criticalPoint
      setCriticalPoints(prev => [newPoint, ...prev])
      return newPoint
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar ponto crítico'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const updateCriticalPoint = useCallback(async (id: string, data: Partial<CreateCriticalPointData>): Promise<CriticalPoint> => {
    try {
      setError(null)
      const response = await apiClient.put(`/api/secretarias/security/critical-points/${id}`, data)
      const updatedPoint = response.criticalPoint
      setCriticalPoints(prev => prev.map(point => point.id === id ? updatedPoint : point))
      return updatedPoint
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar ponto crítico'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const addIncident = useCallback(async (id: string, incident: { type: string; description: string }): Promise<CriticalPoint> => {
    try {
      setError(null)
      const response = await apiClient.post(`/api/secretarias/security/critical-points/${id}/incidents`, incident)
      const updatedPoint = response.criticalPoint
      setCriticalPoints(prev => prev.map(point => point.id === id ? updatedPoint : point))
      return updatedPoint
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao adicionar incidente'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const updatePatrolDate = useCallback(async (id: string, date: string): Promise<CriticalPoint> => {
    return updateCriticalPoint(id, { lastPatrolDate: date } as any)
  }, [updateCriticalPoint])

  const deleteCriticalPoint = useCallback(async (id: string): Promise<void> => {
    try {
      setError(null)
      await apiClient.delete(`/api/secretarias/security/critical-points/${id}`)
      setCriticalPoints(prev => prev.filter(point => point.id !== id))
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao excluir ponto crítico'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const getCriticalPointById = useCallback((id: string) => criticalPoints.find(point => point.id === id), [criticalPoints])
  const getHighRiskPoints = useCallback(() => criticalPoints.filter(point => ['HIGH', 'CRITICAL'].includes(point.riskLevel)), [criticalPoints])

  const refreshCriticalPoints = useCallback(async () => {
    await fetchCriticalPoints()
  }, [fetchCriticalPoints])

  useEffect(() => {
    fetchCriticalPoints()
  }, [fetchCriticalPoints])

  return {
    criticalPoints,
    loading,
    error,
    createCriticalPoint,
    updateCriticalPoint,
    addIncident,
    updatePatrolDate,
    deleteCriticalPoint,
    getCriticalPointById,
    getHighRiskPoints,
    refreshCriticalPoints
  }
}