'use client'

import { useState, useEffect, useCallback } from 'react'
import { apiClient } from '@/lib/auth'

interface SportsProgram {
  id: string
  name: string
  type: 'SOCIAL' | 'COMPETITIVE' | 'EDUCATIONAL' | 'RECREATIONAL' | 'THERAPEUTIC' | 'PROFESSIONAL'
  description: string
  objectives: string[]
  targetAudience: {
    ageGroup: string
    gender: 'MALE' | 'FEMALE' | 'MIXED'
    category: 'INITIATION' | 'YOUTH' | 'ADULT' | 'SENIOR' | 'ALL'
    requirements?: string[]
  }
  modalities: string[]
  duration: {
    type: 'CONTINUOUS' | 'SEASONAL' | 'TEMPORARY'
    startDate: string
    endDate?: string
    totalHours?: number
  }
  schedule: {
    frequency: 'DAILY' | 'WEEKLY' | 'BIWEEKLY' | 'MONTHLY'
    sessions: {
      day: 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY'
      startTime: string
      endTime: string
      location: string
      instructor?: string
    }[]
  }
  participants: {
    id: string
    name: string
    phone: string
    email?: string
    dateOfBirth: string
    registrationDate: string
    status: 'ACTIVE' | 'INACTIVE' | 'WAITING_LIST' | 'GRADUATED'
    attendanceRate?: number
    performanceNotes?: string
  }[]
  instructors: {
    id: string
    name: string
    registration: string
    phone: string
    email: string
    qualifications: string[]
    specializations: string[]
    experience: number
  }[]
  resources: {
    budget: {
      allocated: number
      spent: number
      remaining: number
      categories: {
        category: string
        allocated: number
        spent: number
      }[]
    }
    equipment: {
      name: string
      quantity: number
      condition: 'NEW' | 'GOOD' | 'REGULAR' | 'POOR'
      lastMaintenance?: string
    }[]
    facilities: string[]
  }
  partnerships: {
    organization: string
    type: 'SPONSOR' | 'SUPPORT' | 'TECHNICAL' | 'INSTITUTIONAL'
    contribution: string
    startDate: string
    endDate?: string
  }[]
  results: {
    enrollments: number
    graduates: number
    dropouts: number
    averageAttendance: number
    satisfaction: {
      rating: number
      feedback: string[]
    }
    achievements: {
      participant: string
      achievement: string
      date: string
      level: 'LOCAL' | 'REGIONAL' | 'STATE' | 'NATIONAL'
    }[]
  }
  status: 'PLANNING' | 'ACTIVE' | 'SUSPENDED' | 'COMPLETED' | 'CANCELLED'
  createdBy: string
  createdAt: string
  updatedAt: string
}

interface CreateSportsProgramData {
  name: string
  type: 'SOCIAL' | 'COMPETITIVE' | 'EDUCATIONAL' | 'RECREATIONAL' | 'THERAPEUTIC' | 'PROFESSIONAL'
  description: string
  objectives: string[]
  targetAudience: {
    ageGroup: string
    gender: 'MALE' | 'FEMALE' | 'MIXED'
    category: 'INITIATION' | 'YOUTH' | 'ADULT' | 'SENIOR' | 'ALL'
    requirements?: string[]
  }
  modalities: string[]
  duration: {
    type: 'CONTINUOUS' | 'SEASONAL' | 'TEMPORARY'
    startDate: string
    endDate?: string
    totalHours?: number
  }
  instructorIds: string[]
}

interface UseSportsProgramsReturn {
  programs: SportsProgram[]
  loading: boolean
  error: string | null
  createProgram: (data: CreateSportsProgramData) => Promise<SportsProgram>
  updateProgram: (id: string, data: Partial<CreateSportsProgramData>) => Promise<SportsProgram>
  addParticipant: (programId: string, participant: any) => Promise<SportsProgram>
  removeParticipant: (programId: string, participantId: string) => Promise<SportsProgram>
  updateParticipantStatus: (programId: string, participantId: string, status: string) => Promise<SportsProgram>
  addPartnership: (programId: string, partnership: any) => Promise<SportsProgram>
  updateBudget: (programId: string, budget: any) => Promise<SportsProgram>
  addAchievement: (programId: string, achievement: any) => Promise<SportsProgram>
  suspendProgram: (id: string, reason: string) => Promise<SportsProgram>
  completeProgram: (id: string) => Promise<SportsProgram>
  deleteProgram: (id: string) => Promise<void>
  getProgramsByType: (type: string) => SportsProgram[]
  getActivePrograms: () => SportsProgram[]
  getProgramsByModality: (modality: string) => SportsProgram[]
  refreshPrograms: () => Promise<void>
}

export function useSportsPrograms(): UseSportsProgramsReturn {
  const [programs, setPrograms] = useState<SportsProgram[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPrograms = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await apiClient.get('/api/specialized/sports/programs')
      setPrograms(data.programs || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar programas esportivos')
    } finally {
      setLoading(false)
    }
  }, [])

  const createProgram = useCallback(async (data: CreateSportsProgramData): Promise<SportsProgram> => {
    try {
      setError(null)
      const response = await apiClient.post('/api/specialized/sports/programs', data)
      const newProgram = response.program
      setPrograms(prev => [newProgram, ...prev])
      return newProgram
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar programa'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const updateProgram = useCallback(async (id: string, data: Partial<CreateSportsProgramData>): Promise<SportsProgram> => {
    try {
      setError(null)
      const response = await apiClient.put(`/api/specialized/sports/programs/${id}`, data)
      const updatedProgram = response.program
      setPrograms(prev => prev.map(program => program.id === id ? updatedProgram : program))
      return updatedProgram
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar programa'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const addParticipant = useCallback(async (programId: string, participant: any): Promise<SportsProgram> => {
    try {
      setError(null)
      const response = await apiClient.post(`/api/specialized/sports/programs/${programId}/participants`, participant)
      const updatedProgram = response.program
      setPrograms(prev => prev.map(program => program.id === programId ? updatedProgram : program))
      return updatedProgram
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao adicionar participante'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const removeParticipant = useCallback(async (programId: string, participantId: string): Promise<SportsProgram> => {
    try {
      setError(null)
      const response = await apiClient.delete(`/api/specialized/sports/programs/${programId}/participants/${participantId}`)
      const updatedProgram = response.program
      setPrograms(prev => prev.map(program => program.id === programId ? updatedProgram : program))
      return updatedProgram
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao remover participante'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const updateParticipantStatus = useCallback(async (programId: string, participantId: string, status: string): Promise<SportsProgram> => {
    try {
      setError(null)
      const response = await apiClient.put(`/api/specialized/sports/programs/${programId}/participants/${participantId}`, { status })
      const updatedProgram = response.program
      setPrograms(prev => prev.map(program => program.id === programId ? updatedProgram : program))
      return updatedProgram
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar status do participante'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const addPartnership = useCallback(async (programId: string, partnership: any): Promise<SportsProgram> => {
    try {
      setError(null)
      const response = await apiClient.post(`/api/specialized/sports/programs/${programId}/partnerships`, partnership)
      const updatedProgram = response.program
      setPrograms(prev => prev.map(program => program.id === programId ? updatedProgram : program))
      return updatedProgram
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao adicionar parceria'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const updateBudget = useCallback(async (programId: string, budget: any): Promise<SportsProgram> => {
    try {
      setError(null)
      const response = await apiClient.put(`/api/specialized/sports/programs/${programId}/budget`, budget)
      const updatedProgram = response.program
      setPrograms(prev => prev.map(program => program.id === programId ? updatedProgram : program))
      return updatedProgram
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar orçamento'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const addAchievement = useCallback(async (programId: string, achievement: any): Promise<SportsProgram> => {
    try {
      setError(null)
      const response = await apiClient.post(`/api/specialized/sports/programs/${programId}/achievements`, achievement)
      const updatedProgram = response.program
      setPrograms(prev => prev.map(program => program.id === programId ? updatedProgram : program))
      return updatedProgram
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao adicionar conquista'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const suspendProgram = useCallback(async (id: string, reason: string): Promise<SportsProgram> => {
    return updateProgram(id, { status: 'SUSPENDED' } as any)
  }, [updateProgram])

  const completeProgram = useCallback(async (id: string): Promise<SportsProgram> => {
    return updateProgram(id, { status: 'COMPLETED' } as any)
  }, [updateProgram])

  const deleteProgram = useCallback(async (id: string): Promise<void> => {
    try {
      setError(null)
      await apiClient.delete(`/api/specialized/sports/programs/${id}`)
      setPrograms(prev => prev.filter(program => program.id !== id))
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao excluir programa'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const getProgramsByType = useCallback((type: string) => programs.filter(program => program.type === type), [programs])
  const getActivePrograms = useCallback(() => programs.filter(program => program.status === 'ACTIVE'), [programs])
  const getProgramsByModality = useCallback((modality: string) => programs.filter(program => program.modalities.includes(modality)), [programs])

  const refreshPrograms = useCallback(async () => {
    await fetchPrograms()
  }, [fetchPrograms])

  useEffect(() => {
    fetchPrograms()
  }, [fetchPrograms])

  return {
    programs,
    loading,
    error,
    createProgram,
    updateProgram,
    addParticipant,
    removeParticipant,
    updateParticipantStatus,
    addPartnership,
    updateBudget,
    addAchievement,
    suspendProgram,
    completeProgram,
    deleteProgram,
    getProgramsByType,
    getActivePrograms,
    getProgramsByModality,
    refreshPrograms
  }
}