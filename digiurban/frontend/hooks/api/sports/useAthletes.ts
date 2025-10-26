'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAdminAuth } from '@/contexts/AdminAuthContext'

interface Athlete {
  id: string
  registrationNumber: string
  name: string
  dateOfBirth: string
  cpf: string
  rg?: string
  gender: 'MALE' | 'FEMALE'
  address: string
  phone: string
  email?: string
  emergencyContact: string
  emergencyPhone: string
  parentName?: string
  parentPhone?: string
  modality: string
  category: 'INITIATION' | 'YOUTH' | 'ADULT' | 'SENIOR' | 'MASTER' | 'PARALYMPIC'
  federation: string
  federationNumber?: string
  position?: string
  teamId?: string
  coachId?: string
  physicalData: {
    height: number
    weight: number
    dominantHand: 'LEFT' | 'RIGHT' | 'AMBIDEXTROUS'
    bloodType?: string
  }
  medicalInfo: {
    allergies?: string[]
    medications?: string[]
    injuries?: string[]
    restrictions?: string[]
    lastMedicalCheck?: string
    nextMedicalCheck?: string
  }
  performance: {
    personalBests: { event: string; result: string; date: string; location: string }[]
    currentSeasonBests: { event: string; result: string; date: string }[]
    rankings: { year: number; position: number; category: string; level: 'MUNICIPAL' | 'STATE' | 'NATIONAL' | 'INTERNATIONAL' }[]
  }
  competitions: {
    id: string
    name: string
    date: string
    location: string
    result?: string
    position?: number
    level: 'MUNICIPAL' | 'STATE' | 'NATIONAL' | 'INTERNATIONAL'
  }[]
  training: {
    schedule: { day: string; startTime: string; endTime: string; type: string; location: string }[]
    frequency: number
    specialization?: string
  }
  equipment: string[]
  sponsors?: string[]
  isActive: boolean
  graduationDate?: string
  retirementDate?: string
  achievements: string[]
  photos?: string[]
  documents?: string[]
  createdAt: string
  updatedAt: string
}

interface CreateAthleteData {
  name: string
  dateOfBirth: string
  cpf: string
  rg?: string
  gender: 'MALE' | 'FEMALE'
  address: string
  phone: string
  email?: string
  emergencyContact: string
  emergencyPhone: string
  parentName?: string
  parentPhone?: string
  modality: string
  category: 'INITIATION' | 'YOUTH' | 'ADULT' | 'SENIOR' | 'MASTER' | 'PARALYMPIC'
  federation: string
  position?: string
  teamId?: string
  coachId?: string
  physicalData: {
    height: number
    weight: number
    dominantHand: 'LEFT' | 'RIGHT' | 'AMBIDEXTROUS'
    bloodType?: string
  }
}

interface UseAthletesReturn {
  athletes: Athlete[]
  loading: boolean
  error: string | null
  createAthlete: (data: CreateAthleteData) => Promise<Athlete>
  updateAthlete: (id: string, data: Partial<CreateAthleteData>) => Promise<Athlete>
  addCompetition: (id: string, competition: any) => Promise<Athlete>
  addPersonalBest: (id: string, personalBest: any) => Promise<Athlete>
  updateMedicalInfo: (id: string, medicalInfo: any) => Promise<Athlete>
  federateAthlete: (id: string, federationNumber: string) => Promise<Athlete>
  graduateAthlete: (id: string) => Promise<Athlete>
  retireAthlete: (id: string, reason: string) => Promise<Athlete>
  deleteAthlete: (id: string) => Promise<void>
  getAthletesByModality: (modality: string) => Athlete[]
  getAthletesByTeam: (teamId: string) => Athlete[]
  getFederatedAthletes: () => Athlete[]
  getActiveAthletes: () => Athlete[]
  refreshAthletes: () => Promise<void>
}

export function useAthletes(): UseAthletesReturn {
  const [athletes, setAthletes] = useState<Athlete[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchAthletes = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await apiClient.get('/api/specialized/sports/athletes')
      setAthletes(data.athletes || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar atletas')
    } finally {
      setLoading(false)
    }
  }, [])

  const createAthlete = useCallback(async (data: CreateAthleteData): Promise<Athlete> => {
    try {
      setError(null)
      const response = await apiClient.post('/api/specialized/sports/athletes', data)
      const newAthlete = response.athlete
      setAthletes(prev => [newAthlete, ...prev])
      return newAthlete
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao cadastrar atleta'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const updateAthlete = useCallback(async (id: string, data: Partial<CreateAthleteData>): Promise<Athlete> => {
    try {
      setError(null)
      const response = await apiClient.put(`/api/specialized/sports/athletes/${id}`, data)
      const updatedAthlete = response.athlete
      setAthletes(prev => prev.map(athlete => athlete.id === id ? updatedAthlete : athlete))
      return updatedAthlete
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar atleta'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const addCompetition = useCallback(async (id: string, competition: any): Promise<Athlete> => {
    try {
      setError(null)
      const response = await apiClient.post(`/api/specialized/sports/athletes/${id}/competitions`, competition)
      const updatedAthlete = response.athlete
      setAthletes(prev => prev.map(athlete => athlete.id === id ? updatedAthlete : athlete))
      return updatedAthlete
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao adicionar competição'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const addPersonalBest = useCallback(async (id: string, personalBest: any): Promise<Athlete> => {
    try {
      setError(null)
      const response = await apiClient.post(`/api/specialized/sports/athletes/${id}/personal-bests`, personalBest)
      const updatedAthlete = response.athlete
      setAthletes(prev => prev.map(athlete => athlete.id === id ? updatedAthlete : athlete))
      return updatedAthlete
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao adicionar recorde pessoal'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const updateMedicalInfo = useCallback(async (id: string, medicalInfo: any): Promise<Athlete> => {
    return updateAthlete(id, { medicalInfo } as any)
  }, [updateAthlete])

  const federateAthlete = useCallback(async (id: string, federationNumber: string): Promise<Athlete> => {
    return updateAthlete(id, { federationNumber } as any)
  }, [updateAthlete])

  const graduateAthlete = useCallback(async (id: string): Promise<Athlete> => {
    return updateAthlete(id, { graduationDate: new Date().toISOString() } as any)
  }, [updateAthlete])

  const retireAthlete = useCallback(async (id: string, reason: string): Promise<Athlete> => {
    return updateAthlete(id, { isActive: false, retirementDate: new Date().toISOString() } as any)
  }, [updateAthlete])

  const deleteAthlete = useCallback(async (id: string): Promise<void> => {
    try {
      setError(null)
      await apiClient.delete(`/api/specialized/sports/athletes/${id}`)
      setAthletes(prev => prev.filter(athlete => athlete.id !== id))
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao excluir atleta'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const getAthletesByModality = useCallback((modality: string) => athletes.filter(athlete => athlete.modality === modality), [athletes])
  const getAthletesByTeam = useCallback((teamId: string) => athletes.filter(athlete => athlete.teamId === teamId), [athletes])
  const getFederatedAthletes = useCallback(() => athletes.filter(athlete => athlete.federationNumber), [athletes])
  const getActiveAthletes = useCallback(() => athletes.filter(athlete => athlete.isActive), [athletes])

  const refreshAthletes = useCallback(async () => {
    await fetchAthletes()
  }, [fetchAthletes])

  useEffect(() => {
    fetchAthletes()
  }, [fetchAthletes])

  return {
    athletes,
    loading,
    error,
    createAthlete,
    updateAthlete,
    addCompetition,
    addPersonalBest,
    updateMedicalInfo,
    federateAthlete,
    graduateAthlete,
    retireAthlete,
    deleteAthlete,
    getAthletesByModality,
    getAthletesByTeam,
    getFederatedAthletes,
    getActiveAthletes,
    refreshAthletes
  }
}