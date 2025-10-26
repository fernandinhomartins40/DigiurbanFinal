'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAdminAuth } from '@/contexts/AdminAuthContext'

interface Competition {
  id: string
  name: string
  modality: string
  type: 'CHAMPIONSHIP' | 'TOURNAMENT' | 'FRIENDLY' | 'FESTIVAL' | 'CLINIC' | 'TRAINING'
  level: 'MUNICIPAL' | 'REGIONAL' | 'STATE' | 'NATIONAL' | 'INTERNATIONAL'
  category: 'INITIATION' | 'YOUTH' | 'ADULT' | 'SENIOR' | 'MASTER' | 'PARALYMPIC'
  gender: 'MALE' | 'FEMALE' | 'MIXED'
  startDate: string
  endDate: string
  registrationStart: string
  registrationEnd: string
  location: string
  venue: string
  organizer: string
  contactInfo: { name: string; phone: string; email: string }
  description: string
  rules?: string
  prizes: { position: number; description: string; value?: number }[]
  registrationFee?: number
  maxParticipants?: number
  currentParticipants: number
  status: 'PLANNED' | 'REGISTRATION_OPEN' | 'REGISTRATION_CLOSED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'
  teams: {
    id: string
    name: string
    registrationDate: string
    paymentStatus: 'PENDING' | 'PAID' | 'EXEMPT'
    results?: { match: string; score: string; position?: number }[]
  }[]
  matches: {
    id: string
    team1: string
    team2: string
    date: string
    time: string
    venue: string
    status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'POSTPONED' | 'CANCELLED'
    result?: { team1Score: number; team2Score: number; winner?: string }
  }[]
  schedule: {
    phase: string
    date: string
    time: string
    event: string
    location: string
  }[]
  budget: { item: string; planned: number; actual?: number }[]
  sponsors?: string[]
  media?: { type: 'PHOTO' | 'VIDEO' | 'LIVESTREAM'; url: string; description: string }[]
  createdAt: string
  updatedAt: string
}

interface CreateCompetitionData {
  name: string
  modality: string
  type: 'CHAMPIONSHIP' | 'TOURNAMENT' | 'FRIENDLY' | 'FESTIVAL' | 'CLINIC' | 'TRAINING'
  level: 'MUNICIPAL' | 'REGIONAL' | 'STATE' | 'NATIONAL' | 'INTERNATIONAL'
  category: 'INITIATION' | 'YOUTH' | 'ADULT' | 'SENIOR' | 'MASTER' | 'PARALYMPIC'
  gender: 'MALE' | 'FEMALE' | 'MIXED'
  startDate: string
  endDate: string
  registrationStart: string
  registrationEnd: string
  location: string
  venue: string
  organizer: string
  contactInfo: { name: string; phone: string; email: string }
  description: string
  rules?: string
  prizes: { position: number; description: string; value?: number }[]
  registrationFee?: number
  maxParticipants?: number
}

interface UseCompetitionsReturn {
  competitions: Competition[]
  loading: boolean
  error: string | null
  createCompetition: (data: CreateCompetitionData) => Promise<Competition>
  updateCompetition: (id: string, data: Partial<CreateCompetitionData>) => Promise<Competition>
  registerTeam: (competitionId: string, teamId: string) => Promise<Competition>
  unregisterTeam: (competitionId: string, teamId: string) => Promise<Competition>
  addMatch: (competitionId: string, match: any) => Promise<Competition>
  updateMatchResult: (competitionId: string, matchId: string, result: any) => Promise<Competition>
  startCompetition: (id: string) => Promise<Competition>
  completeCompetition: (id: string) => Promise<Competition>
  cancelCompetition: (id: string, reason: string) => Promise<Competition>
  deleteCompetition: (id: string) => Promise<void>
  getCompetitionsByModality: (modality: string) => Competition[]
  getActiveCompetitions: () => Competition[]
  getUpcomingCompetitions: () => Competition[]
  refreshCompetitions: () => Promise<void>
}

export function useCompetitions(): UseCompetitionsReturn {
  const [competitions, setCompetitions] = useState<Competition[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCompetitions = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await apiClient.get('/api/specialized/sports/competitions')
      setCompetitions(data.competitions || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar competições')
    } finally {
      setLoading(false)
    }
  }, [])

  const createCompetition = useCallback(async (data: CreateCompetitionData): Promise<Competition> => {
    try {
      setError(null)
      const response = await apiClient.post('/api/specialized/sports/competitions', data)
      const newCompetition = response.competition
      setCompetitions(prev => [newCompetition, ...prev])
      return newCompetition
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar competição'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const updateCompetition = useCallback(async (id: string, data: Partial<CreateCompetitionData>): Promise<Competition> => {
    try {
      setError(null)
      const response = await apiClient.put(`/api/specialized/sports/competitions/${id}`, data)
      const updatedCompetition = response.competition
      setCompetitions(prev => prev.map(comp => comp.id === id ? updatedCompetition : comp))
      return updatedCompetition
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar competição'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const registerTeam = useCallback(async (competitionId: string, teamId: string): Promise<Competition> => {
    try {
      setError(null)
      const response = await apiClient.post(`/api/specialized/sports/competitions/${competitionId}/teams`, { teamId })
      const updatedCompetition = response.competition
      setCompetitions(prev => prev.map(comp => comp.id === competitionId ? updatedCompetition : comp))
      return updatedCompetition
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao inscrever equipe'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const unregisterTeam = useCallback(async (competitionId: string, teamId: string): Promise<Competition> => {
    try {
      setError(null)
      const response = await apiClient.delete(`/api/specialized/sports/competitions/${competitionId}/teams/${teamId}`)
      const updatedCompetition = response.competition
      setCompetitions(prev => prev.map(comp => comp.id === competitionId ? updatedCompetition : comp))
      return updatedCompetition
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao desinscrever equipe'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const addMatch = useCallback(async (competitionId: string, match: any): Promise<Competition> => {
    try {
      setError(null)
      const response = await apiClient.post(`/api/specialized/sports/competitions/${competitionId}/matches`, match)
      const updatedCompetition = response.competition
      setCompetitions(prev => prev.map(comp => comp.id === competitionId ? updatedCompetition : comp))
      return updatedCompetition
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao adicionar partida'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const updateMatchResult = useCallback(async (competitionId: string, matchId: string, result: any): Promise<Competition> => {
    try {
      setError(null)
      const response = await apiClient.put(`/api/specialized/sports/competitions/${competitionId}/matches/${matchId}`, result)
      const updatedCompetition = response.competition
      setCompetitions(prev => prev.map(comp => comp.id === competitionId ? updatedCompetition : comp))
      return updatedCompetition
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar resultado'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const startCompetition = useCallback(async (id: string): Promise<Competition> => {
    return updateCompetition(id, { status: 'IN_PROGRESS' } as any)
  }, [updateCompetition])

  const completeCompetition = useCallback(async (id: string): Promise<Competition> => {
    return updateCompetition(id, { status: 'COMPLETED' } as any)
  }, [updateCompetition])

  const cancelCompetition = useCallback(async (id: string, reason: string): Promise<Competition> => {
    return updateCompetition(id, { status: 'CANCELLED' } as any)
  }, [updateCompetition])

  const deleteCompetition = useCallback(async (id: string): Promise<void> => {
    try {
      setError(null)
      await apiClient.delete(`/api/specialized/sports/competitions/${id}`)
      setCompetitions(prev => prev.filter(comp => comp.id !== id))
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao excluir competição'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const getCompetitionsByModality = useCallback((modality: string) => competitions.filter(comp => comp.modality === modality), [competitions])
  const getActiveCompetitions = useCallback(() => competitions.filter(comp => ['REGISTRATION_OPEN', 'IN_PROGRESS'].includes(comp.status)), [competitions])
  const getUpcomingCompetitions = useCallback(() => {
    const today = new Date()
    return competitions.filter(comp => new Date(comp.startDate) > today && comp.status !== 'CANCELLED')
  }, [competitions])

  const refreshCompetitions = useCallback(async () => {
    await fetchCompetitions()
  }, [fetchCompetitions])

  useEffect(() => {
    fetchCompetitions()
  }, [fetchCompetitions])

  return {
    competitions,
    loading,
    error,
    createCompetition,
    updateCompetition,
    registerTeam,
    unregisterTeam,
    addMatch,
    updateMatchResult,
    startCompetition,
    completeCompetition,
    cancelCompetition,
    deleteCompetition,
    getCompetitionsByModality,
    getActiveCompetitions,
    getUpcomingCompetitions,
    refreshCompetitions
  }
}