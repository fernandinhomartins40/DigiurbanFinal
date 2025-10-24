import { useState, useEffect, useCallback } from 'react'
import { apiClient } from '@/lib/api'

export interface HealthProgram {
  id: string
  name: string
  type: 'PREVENTION' | 'TREATMENT' | 'PROMOTION' | 'REHABILITATION' | 'EDUCATION'
  status: 'ACTIVE' | 'INACTIVE' | 'COMPLETED' | 'PLANNING'
  target_population: Array<string>
  objectives: Array<string>
  activities: Array<{
    name: string
    description: string
    frequency: string
    responsible: string
  }>
  participants: Array<{
    patient_id: string
    enrollment_date: string
    status: 'ACTIVE' | 'COMPLETED' | 'DROPPED_OUT'
    progress: number
  }>
  budget: {
    allocated: number
    spent: number
    remaining: number
  }
  metrics: {
    total_participants: number
    active_participants: number
    completion_rate: number
    satisfaction_score: number
  }
  start_date: string
  end_date?: string
  created_at: string
  updated_at: string
}

export interface CreateHealthProgramData {
  name: string
  type: 'PREVENTION' | 'TREATMENT' | 'PROMOTION' | 'REHABILITATION' | 'EDUCATION'
  target_population: Array<string>
  objectives: Array<string>
  activities: Array<{
    name: string
    description: string
    frequency: string
    responsible: string
  }>
  budget: {
    allocated: number
  }
  start_date: string
  end_date?: string
}

export const useHealthPrograms = () => {
  const [programs, setPrograms] = useState<HealthProgram[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchPrograms = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.get('/health/programs')
      setPrograms(response.data)
    } catch (err) {
      setError('Falha ao carregar programas de saúde')
      console.error('Error fetching health programs:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  const createProgram = useCallback(async (data: CreateHealthProgramData): Promise<HealthProgram | null> => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.post('/health/programs', data)
      const newProgram = response.data
      setPrograms(prev => [...prev, newProgram])
      return newProgram
    } catch (err) {
      setError('Falha ao criar programa')
      console.error('Error creating program:', err)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const enrollParticipant = useCallback(async (programId: string, patientId: string): Promise<boolean> => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.post(`/health/programs/${programId}/participants`, { patient_id: patientId })
      const updatedProgram = response.data
      setPrograms(prev => prev.map(p => p.id === programId ? updatedProgram : p))
      return true
    } catch (err) {
      setError('Falha ao inscrever participante')
      console.error('Error enrolling participant:', err)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const getActivePrograms = useCallback(() => {
    return programs.filter(p => p.status === 'ACTIVE')
  }, [programs])

  useEffect(() => {
    fetchPrograms()
  }, [fetchPrograms])

  return {
    programs,
    loading,
    error,
    fetchPrograms,
    createProgram,
    enrollParticipant,
    getActivePrograms
  }
}