'use client'

import { useState, useEffect, useCallback } from 'react'
import { apiClient } from '@/lib/auth'

interface SportsInstructor {
  id: string
  registrationNumber: string
  name: string
  cpf: string
  rg?: string
  dateOfBirth: string
  gender: 'MALE' | 'FEMALE'
  address: string
  phone: string
  email: string
  emergencyContact: string
  emergencyPhone: string
  professionalInfo: {
    graduations: {
      degree: string
      institution: string
      year: number
      status: 'COMPLETE' | 'IN_PROGRESS'
    }[]
    certifications: {
      name: string
      institution: string
      issueDate: string
      expiryDate?: string
      status: 'VALID' | 'EXPIRED' | 'SUSPENDED'
    }[]
    specializations: string[]
    experience: number
    languages?: string[]
  }
  employment: {
    type: 'PERMANENT' | 'TEMPORARY' | 'VOLUNTEER' | 'CONTRACT'
    startDate: string
    endDate?: string
    workload: number
    salary?: number
    position: string
    department: string
    supervisor?: string
  }
  schedule: {
    day: 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY'
    startTime: string
    endTime: string
    activity: string
    location: string
    modality: string
  }[]
  assignedPrograms: {
    programId: string
    programName: string
    role: 'HEAD_INSTRUCTOR' | 'ASSISTANT' | 'SPECIALIST'
    startDate: string
    endDate?: string
  }[]
  assignedTeams: {
    teamId: string
    teamName: string
    role: 'HEAD_COACH' | 'ASSISTANT_COACH' | 'TRAINER'
    modality: string
    category: string
  }[]
  performance: {
    evaluations: {
      id: string
      evaluator: string
      date: string
      period: string
      criteria: {
        technical: number
        pedagogical: number
        leadership: number
        communication: number
        punctuality: number
      }
      averageScore: number
      observations?: string
    }[]
    achievements: {
      date: string
      description: string
      type: 'TEAM_ACHIEVEMENT' | 'STUDENT_ACHIEVEMENT' | 'PERSONAL_RECOGNITION' | 'CERTIFICATION'
      level: 'LOCAL' | 'REGIONAL' | 'STATE' | 'NATIONAL' | 'INTERNATIONAL'
    }[]
    trainingHours: {
      year: number
      required: number
      completed: number
      courses: {
        name: string
        hours: number
        date: string
        institution: string
      }[]
    }[]
  }
  medicalInfo: {
    lastMedicalCheck?: string
    nextMedicalCheck?: string
    restrictions?: string[]
    allergies?: string[]
    medications?: string[]
    isActive: boolean
  }
  documents: {
    type: string
    name: string
    url: string
    expiryDate?: string
    status: 'VALID' | 'EXPIRED' | 'PENDING'
  }[]
  isActive: boolean
  retirementDate?: string
  createdAt: string
  updatedAt: string
}

interface CreateSportsInstructorData {
  name: string
  cpf: string
  rg?: string
  dateOfBirth: string
  gender: 'MALE' | 'FEMALE'
  address: string
  phone: string
  email: string
  emergencyContact: string
  emergencyPhone: string
  employment: {
    type: 'PERMANENT' | 'TEMPORARY' | 'VOLUNTEER' | 'CONTRACT'
    startDate: string
    workload: number
    salary?: number
    position: string
  }
  specializations: string[]
}

interface UseSportsInstructorsReturn {
  instructors: SportsInstructor[]
  loading: boolean
  error: string | null
  createInstructor: (data: CreateSportsInstructorData) => Promise<SportsInstructor>
  updateInstructor: (id: string, data: Partial<CreateSportsInstructorData>) => Promise<SportsInstructor>
  addCertification: (id: string, certification: any) => Promise<SportsInstructor>
  addGraduation: (id: string, graduation: any) => Promise<SportsInstructor>
  assignToProgram: (id: string, assignment: any) => Promise<SportsInstructor>
  assignToTeam: (id: string, assignment: any) => Promise<SportsInstructor>
  removeFromProgram: (id: string, programId: string) => Promise<SportsInstructor>
  removeFromTeam: (id: string, teamId: string) => Promise<SportsInstructor>
  addEvaluation: (id: string, evaluation: any) => Promise<SportsInstructor>
  addAchievement: (id: string, achievement: any) => Promise<SportsInstructor>
  updateSchedule: (id: string, schedule: any) => Promise<SportsInstructor>
  retireInstructor: (id: string, reason: string) => Promise<SportsInstructor>
  deleteInstructor: (id: string) => Promise<void>
  getInstructorsByModality: (modality: string) => SportsInstructor[]
  getActiveInstructors: () => SportsInstructor[]
  getAvailableInstructors: () => SportsInstructor[]
  refreshInstructors: () => Promise<void>
}

export function useSportsInstructors(): UseSportsInstructorsReturn {
  const [instructors, setInstructors] = useState<SportsInstructor[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchInstructors = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await apiClient.get('/api/specialized/sports/instructors')
      setInstructors(data.instructors || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar instrutores')
    } finally {
      setLoading(false)
    }
  }, [])

  const createInstructor = useCallback(async (data: CreateSportsInstructorData): Promise<SportsInstructor> => {
    try {
      setError(null)
      const response = await apiClient.post('/api/specialized/sports/instructors', data)
      const newInstructor = response.instructor
      setInstructors(prev => [newInstructor, ...prev])
      return newInstructor
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao cadastrar instrutor'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const updateInstructor = useCallback(async (id: string, data: Partial<CreateSportsInstructorData>): Promise<SportsInstructor> => {
    try {
      setError(null)
      const response = await apiClient.put(`/api/specialized/sports/instructors/${id}`, data)
      const updatedInstructor = response.instructor
      setInstructors(prev => prev.map(instructor => instructor.id === id ? updatedInstructor : instructor))
      return updatedInstructor
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar instrutor'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const addCertification = useCallback(async (id: string, certification: any): Promise<SportsInstructor> => {
    try {
      setError(null)
      const response = await apiClient.post(`/api/specialized/sports/instructors/${id}/certifications`, certification)
      const updatedInstructor = response.instructor
      setInstructors(prev => prev.map(instructor => instructor.id === id ? updatedInstructor : instructor))
      return updatedInstructor
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao adicionar certificação'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const addGraduation = useCallback(async (id: string, graduation: any): Promise<SportsInstructor> => {
    try {
      setError(null)
      const response = await apiClient.post(`/api/specialized/sports/instructors/${id}/graduations`, graduation)
      const updatedInstructor = response.instructor
      setInstructors(prev => prev.map(instructor => instructor.id === id ? updatedInstructor : instructor))
      return updatedInstructor
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao adicionar graduação'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const assignToProgram = useCallback(async (id: string, assignment: any): Promise<SportsInstructor> => {
    try {
      setError(null)
      const response = await apiClient.post(`/api/specialized/sports/instructors/${id}/programs`, assignment)
      const updatedInstructor = response.instructor
      setInstructors(prev => prev.map(instructor => instructor.id === id ? updatedInstructor : instructor))
      return updatedInstructor
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atribuir ao programa'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const assignToTeam = useCallback(async (id: string, assignment: any): Promise<SportsInstructor> => {
    try {
      setError(null)
      const response = await apiClient.post(`/api/specialized/sports/instructors/${id}/teams`, assignment)
      const updatedInstructor = response.instructor
      setInstructors(prev => prev.map(instructor => instructor.id === id ? updatedInstructor : instructor))
      return updatedInstructor
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atribuir à equipe'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const removeFromProgram = useCallback(async (id: string, programId: string): Promise<SportsInstructor> => {
    try {
      setError(null)
      const response = await apiClient.delete(`/api/specialized/sports/instructors/${id}/programs/${programId}`)
      const updatedInstructor = response.instructor
      setInstructors(prev => prev.map(instructor => instructor.id === id ? updatedInstructor : instructor))
      return updatedInstructor
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao remover do programa'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const removeFromTeam = useCallback(async (id: string, teamId: string): Promise<SportsInstructor> => {
    try {
      setError(null)
      const response = await apiClient.delete(`/api/specialized/sports/instructors/${id}/teams/${teamId}`)
      const updatedInstructor = response.instructor
      setInstructors(prev => prev.map(instructor => instructor.id === id ? updatedInstructor : instructor))
      return updatedInstructor
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao remover da equipe'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const addEvaluation = useCallback(async (id: string, evaluation: any): Promise<SportsInstructor> => {
    try {
      setError(null)
      const response = await apiClient.post(`/api/specialized/sports/instructors/${id}/evaluations`, evaluation)
      const updatedInstructor = response.instructor
      setInstructors(prev => prev.map(instructor => instructor.id === id ? updatedInstructor : instructor))
      return updatedInstructor
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao adicionar avaliação'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const addAchievement = useCallback(async (id: string, achievement: any): Promise<SportsInstructor> => {
    try {
      setError(null)
      const response = await apiClient.post(`/api/specialized/sports/instructors/${id}/achievements`, achievement)
      const updatedInstructor = response.instructor
      setInstructors(prev => prev.map(instructor => instructor.id === id ? updatedInstructor : instructor))
      return updatedInstructor
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao adicionar conquista'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const updateSchedule = useCallback(async (id: string, schedule: any): Promise<SportsInstructor> => {
    try {
      setError(null)
      const response = await apiClient.put(`/api/specialized/sports/instructors/${id}/schedule`, { schedule })
      const updatedInstructor = response.instructor
      setInstructors(prev => prev.map(instructor => instructor.id === id ? updatedInstructor : instructor))
      return updatedInstructor
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar horário'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const retireInstructor = useCallback(async (id: string, reason: string): Promise<SportsInstructor> => {
    return updateInstructor(id, { isActive: false, retirementDate: new Date().toISOString() } as any)
  }, [updateInstructor])

  const deleteInstructor = useCallback(async (id: string): Promise<void> => {
    try {
      setError(null)
      await apiClient.delete(`/api/specialized/sports/instructors/${id}`)
      setInstructors(prev => prev.filter(instructor => instructor.id !== id))
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao excluir instrutor'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const getInstructorsByModality = useCallback((modality: string) => {
    return instructors.filter(instructor =>
      instructor.professionalInfo.specializations.includes(modality) ||
      instructor.schedule.some(schedule => schedule.modality === modality)
    )
  }, [instructors])

  const getActiveInstructors = useCallback(() => instructors.filter(instructor => instructor.isActive), [instructors])

  const getAvailableInstructors = useCallback(() => {
    return instructors.filter(instructor =>
      instructor.isActive &&
      instructor.assignedPrograms.length < 3 &&
      instructor.assignedTeams.length < 2
    )
  }, [instructors])

  const refreshInstructors = useCallback(async () => {
    await fetchInstructors()
  }, [fetchInstructors])

  useEffect(() => {
    fetchInstructors()
  }, [fetchInstructors])

  return {
    instructors,
    loading,
    error,
    createInstructor,
    updateInstructor,
    addCertification,
    addGraduation,
    assignToProgram,
    assignToTeam,
    removeFromProgram,
    removeFromTeam,
    addEvaluation,
    addAchievement,
    updateSchedule,
    retireInstructor,
    deleteInstructor,
    getInstructorsByModality,
    getActiveInstructors,
    getAvailableInstructors,
    refreshInstructors
  }
}