'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAdminAuth } from '@/contexts/AdminAuthContext'

interface SportsTeam {
  id: string
  name: string
  modality: string
  category: 'INITIATION' | 'YOUTH' | 'ADULT' | 'SENIOR' | 'MASTER' | 'PARALYMPIC'
  gender: 'MALE' | 'FEMALE' | 'MIXED'
  ageGroup: string
  foundationDate: string
  coach: {
    id: string
    name: string
    registration: string
    phone: string
    email?: string
    qualifications: string[]
  }
  assistantCoach?: {
    id: string
    name: string
    registration: string
    phone: string
  }
  players: {
    id: string
    name: string
    position: string
    jerseyNumber: number
    dateOfBirth: string
    cpf: string
    phone: string
    emergencyContact: string
    emergencyPhone: string
    medicalRestrictions?: string
    isActive: boolean
  }[]
  trainingSchedule: {
    day: 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY'
    startTime: string
    endTime: string
    location: string
  }[]
  homeVenue?: string
  equipment: string[]
  uniforms: {
    type: 'HOME' | 'AWAY' | 'THIRD'
    colors: string[]
    sponsor?: string
  }[]
  achievements: {
    year: number
    competition: string
    position: number
    description: string
  }[]
  budget: {
    allocated: number
    spent: number
    remaining: number
    year: number
  }
  isActive: boolean
  createdAt: string
  updatedAt: string
}

interface CreateSportsTeamData {
  name: string
  modality: string
  category: 'INITIATION' | 'YOUTH' | 'ADULT' | 'SENIOR' | 'MASTER' | 'PARALYMPIC'
  gender: 'MALE' | 'FEMALE' | 'MIXED'
  ageGroup: string
  foundationDate: string
  coachId: string
  assistantCoachId?: string
  homeVenue?: string
  trainingSchedule: {
    day: 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY'
    startTime: string
    endTime: string
    location: string
  }[]
}

interface UseSportsTeamsReturn {
  sportsTeams: SportsTeam[]
  loading: boolean
  error: string | null
  createTeam: (data: CreateSportsTeamData) => Promise<SportsTeam>
  updateTeam: (id: string, data: Partial<CreateSportsTeamData>) => Promise<SportsTeam>
  addPlayer: (teamId: string, player: any) => Promise<SportsTeam>
  removePlayer: (teamId: string, playerId: string) => Promise<SportsTeam>
  updatePlayer: (teamId: string, playerId: string, data: any) => Promise<SportsTeam>
  addTraining: (teamId: string, training: any) => Promise<SportsTeam>
  addAchievement: (teamId: string, achievement: any) => Promise<SportsTeam>
  deleteTeam: (id: string) => Promise<void>
  getTeamsByModality: (modality: string) => SportsTeam[]
  getActiveTeams: () => SportsTeam[]
  refreshTeams: () => Promise<void>
}

export function useSportsTeams(): UseSportsTeamsReturn {
  const [sportsTeams, setSportsTeams] = useState<SportsTeam[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTeams = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await apiClient.get('/api/specialized/sports/teams')
      setSportsTeams(data.teams || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar equipes esportivas')
    } finally {
      setLoading(false)
    }
  }, [])

  const createTeam = useCallback(async (data: CreateSportsTeamData): Promise<SportsTeam> => {
    try {
      setError(null)
      const response = await apiClient.post('/api/specialized/sports/teams', data)
      const newTeam = response.team
      setSportsTeams(prev => [newTeam, ...prev])
      return newTeam
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar equipe'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const updateTeam = useCallback(async (id: string, data: Partial<CreateSportsTeamData>): Promise<SportsTeam> => {
    try {
      setError(null)
      const response = await apiClient.put(`/api/specialized/sports/teams/${id}`, data)
      const updatedTeam = response.team
      setSportsTeams(prev => prev.map(team => team.id === id ? updatedTeam : team))
      return updatedTeam
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar equipe'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const addPlayer = useCallback(async (teamId: string, player: any): Promise<SportsTeam> => {
    try {
      setError(null)
      const response = await apiClient.post(`/api/specialized/sports/teams/${teamId}/players`, player)
      const updatedTeam = response.team
      setSportsTeams(prev => prev.map(team => team.id === teamId ? updatedTeam : team))
      return updatedTeam
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao adicionar jogador'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const removePlayer = useCallback(async (teamId: string, playerId: string): Promise<SportsTeam> => {
    try {
      setError(null)
      const response = await apiClient.delete(`/api/specialized/sports/teams/${teamId}/players/${playerId}`)
      const updatedTeam = response.team
      setSportsTeams(prev => prev.map(team => team.id === teamId ? updatedTeam : team))
      return updatedTeam
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao remover jogador'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const updatePlayer = useCallback(async (teamId: string, playerId: string, data: any): Promise<SportsTeam> => {
    try {
      setError(null)
      const response = await apiClient.put(`/api/specialized/sports/teams/${teamId}/players/${playerId}`, data)
      const updatedTeam = response.team
      setSportsTeams(prev => prev.map(team => team.id === teamId ? updatedTeam : team))
      return updatedTeam
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar jogador'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const addTraining = useCallback(async (teamId: string, training: any): Promise<SportsTeam> => {
    try {
      setError(null)
      const response = await apiClient.post(`/api/specialized/sports/teams/${teamId}/trainings`, training)
      const updatedTeam = response.team
      setSportsTeams(prev => prev.map(team => team.id === teamId ? updatedTeam : team))
      return updatedTeam
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao adicionar treino'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const addAchievement = useCallback(async (teamId: string, achievement: any): Promise<SportsTeam> => {
    try {
      setError(null)
      const response = await apiClient.post(`/api/specialized/sports/teams/${teamId}/achievements`, achievement)
      const updatedTeam = response.team
      setSportsTeams(prev => prev.map(team => team.id === teamId ? updatedTeam : team))
      return updatedTeam
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao adicionar conquista'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const deleteTeam = useCallback(async (id: string): Promise<void> => {
    try {
      setError(null)
      await apiClient.delete(`/api/specialized/sports/teams/${id}`)
      setSportsTeams(prev => prev.filter(team => team.id !== id))
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao excluir equipe'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const getTeamsByModality = useCallback((modality: string) => sportsTeams.filter(team => team.modality === modality), [sportsTeams])
  const getActiveTeams = useCallback(() => sportsTeams.filter(team => team.isActive), [sportsTeams])

  const refreshTeams = useCallback(async () => {
    await fetchTeams()
  }, [fetchTeams])

  useEffect(() => {
    fetchTeams()
  }, [fetchTeams])

  return {
    sportsTeams,
    loading,
    error,
    createTeam,
    updateTeam,
    addPlayer,
    removePlayer,
    updatePlayer,
    addTraining,
    addAchievement,
    deleteTeam,
    getTeamsByModality,
    getActiveTeams,
    refreshTeams
  }
}