'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAdminAuth } from '@/contexts/AdminAuthContext'

interface SecurityPatrol {
  id: string
  patrolType: 'ROUTINE' | 'PREVENTIVE' | 'INVESTIGATIVE' | 'EMERGENCY' | 'EVENT_SECURITY'
  route: string
  startTime: string
  endTime?: string
  duration?: number
  officers: { id: string; name: string; badge: string }[]
  vehicle?: { plate: string; type: string }
  status: 'PLANNED' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED'
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  checkpoints: { location: string; time?: string; status: 'PENDING' | 'COMPLETED' }[]
  incidents: { time: string; type: string; description: string; resolved: boolean }[]
  observations?: string
  supervisorId?: string
  createdAt: string
  updatedAt: string
}

interface CreateSecurityPatrolData {
  patrolType: 'ROUTINE' | 'PREVENTIVE' | 'INVESTIGATIVE' | 'EMERGENCY' | 'EVENT_SECURITY'
  route: string
  startTime: string
  officers: { id: string; name: string; badge: string }[]
  vehicle?: { plate: string; type: string }
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  checkpoints: { location: string }[]
  supervisorId?: string
}

interface UseSecurityPatrolsReturn {
  patrols: SecurityPatrol[]
  loading: boolean
  error: string | null
  createPatrol: (data: CreateSecurityPatrolData) => Promise<SecurityPatrol>
  startPatrol: (id: string) => Promise<SecurityPatrol>
  completePatrol: (id: string, observations?: string) => Promise<SecurityPatrol>
  addIncident: (id: string, incident: { type: string; description: string }) => Promise<SecurityPatrol>
  checkCheckpoint: (id: string, checkpointIndex: number) => Promise<SecurityPatrol>
  cancelPatrol: (id: string, reason: string) => Promise<SecurityPatrol>
  refreshPatrols: () => Promise<void>
}

export function useSecurityPatrols(): UseSecurityPatrolsReturn {
  const [patrols, setPatrols] = useState<SecurityPatrol[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPatrols = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await apiClient.get('/api/secretarias/security/patrols')
      setPatrols(data.patrols || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar patrulhas')
    } finally {
      setLoading(false)
    }
  }, [])

  const createPatrol = useCallback(async (data: CreateSecurityPatrolData): Promise<SecurityPatrol> => {
    try {
      setError(null)
      const response = await apiClient.post('/api/secretarias/security/patrols', data)
      const newPatrol = response.patrol
      setPatrols(prev => [newPatrol, ...prev])
      return newPatrol
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar patrulha'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const startPatrol = useCallback(async (id: string): Promise<SecurityPatrol> => {
    try {
      setError(null)
      const response = await apiClient.put(`/api/secretarias/security/patrols/${id}/start`)
      const updatedPatrol = response.patrol
      setPatrols(prev => prev.map(patrol => patrol.id === id ? updatedPatrol : patrol))
      return updatedPatrol
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao iniciar patrulha'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const completePatrol = useCallback(async (id: string, observations?: string): Promise<SecurityPatrol> => {
    try {
      setError(null)
      const response = await apiClient.put(`/api/secretarias/security/patrols/${id}/complete`, { observations })
      const updatedPatrol = response.patrol
      setPatrols(prev => prev.map(patrol => patrol.id === id ? updatedPatrol : patrol))
      return updatedPatrol
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao finalizar patrulha'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const addIncident = useCallback(async (id: string, incident: { type: string; description: string }): Promise<SecurityPatrol> => {
    try {
      setError(null)
      const response = await apiClient.post(`/api/secretarias/security/patrols/${id}/incidents`, incident)
      const updatedPatrol = response.patrol
      setPatrols(prev => prev.map(patrol => patrol.id === id ? updatedPatrol : patrol))
      return updatedPatrol
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao adicionar incidente'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const checkCheckpoint = useCallback(async (id: string, checkpointIndex: number): Promise<SecurityPatrol> => {
    try {
      setError(null)
      const response = await apiClient.put(`/api/secretarias/security/patrols/${id}/checkpoints/${checkpointIndex}`)
      const updatedPatrol = response.patrol
      setPatrols(prev => prev.map(patrol => patrol.id === id ? updatedPatrol : patrol))
      return updatedPatrol
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao registrar checkpoint'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const cancelPatrol = useCallback(async (id: string, reason: string): Promise<SecurityPatrol> => {
    try {
      setError(null)
      const response = await apiClient.put(`/api/secretarias/security/patrols/${id}/cancel`, { reason })
      const updatedPatrol = response.patrol
      setPatrols(prev => prev.map(patrol => patrol.id === id ? updatedPatrol : patrol))
      return updatedPatrol
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao cancelar patrulha'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const refreshPatrols = useCallback(async () => {
    await fetchPatrols()
  }, [fetchPatrols])

  useEffect(() => {
    fetchPatrols()
  }, [fetchPatrols])

  return {
    patrols,
    loading,
    error,
    createPatrol,
    startPatrol,
    completePatrol,
    addIncident,
    checkCheckpoint,
    cancelPatrol,
    refreshPatrols
  }
}