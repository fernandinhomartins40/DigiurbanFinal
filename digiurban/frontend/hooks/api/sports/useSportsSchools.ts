'use client'

import { useState, useEffect, useCallback } from 'react'
import { apiClient } from '@/lib/auth'

interface SportsSchool {
  id: string
  name: string
  modality: string
  description: string
  targetAudience: 'CHILDREN' | 'ADOLESCENTS' | 'ADULTS' | 'SENIORS' | 'SPECIAL_NEEDS' | 'ALL'
  ageGroup: {
    min: number
    max: number
  }
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'ALL_LEVELS'
  location: {
    name: string
    address: string
    coordinates?: {
      lat: number
      lng: number
    }
  }
  schedule: {
    day: 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY'
    startTime: string
    endTime: string
  }[]
  instructors: {
    id: string
    name: string
    registration: string
    qualifications: string[]
    specializations: string[]
    phone: string
    email?: string
  }[]
  capacity: {
    total: number
    enrolled: number
    available: number
  }
  requirements: string[]
  equipment: string[]
  monthlyFee?: number
  registrationFee?: number
  scholarships: {
    total: number
    available: number
    criteria: string[]
  }
  enrollments: {
    id: string
    student: {
      id: string
      name: string
      birthDate: string
      cpf: string
      phone: string
      emergencyContact: string
      emergencyPhone: string
      medicalRestrictions?: string
    }
    enrollmentDate: string
    status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'GRADUATED'
    paymentStatus: 'UP_TO_DATE' | 'OVERDUE' | 'EXEMPT'
    hasScholarship: boolean
    performance?: {
      attendance: number
      progress: string
      notes: string
    }
  }[]
  events: {
    id: string
    name: string
    type: 'COMPETITION' | 'DEMONSTRATION' | 'FESTIVAL' | 'GRADUATION'
    date: string
    description: string
  }[]
  achievements: {
    year: number
    description: string
    participants: number
  }[]
  isActive: boolean
  createdAt: string
  updatedAt: string
}

interface CreateSportsSchoolData {
  name: string
  modality: string
  description: string
  targetAudience: 'CHILDREN' | 'ADOLESCENTS' | 'ADULTS' | 'SENIORS' | 'SPECIAL_NEEDS' | 'ALL'
  ageGroup: {
    min: number
    max: number
  }
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'ALL_LEVELS'
  locationId: string
  schedule: {
    day: 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY'
    startTime: string
    endTime: string
  }[]
  instructorIds: string[]
  capacity: number
  requirements: string[]
  monthlyFee?: number
  registrationFee?: number
}

interface UseSportsSchoolsReturn {
  sportsSchools: SportsSchool[]
  loading: boolean
  error: string | null
  createSchool: (data: CreateSportsSchoolData) => Promise<SportsSchool>
  updateSchool: (id: string, data: Partial<CreateSportsSchoolData>) => Promise<SportsSchool>
  enrollStudent: (schoolId: string, studentData: any) => Promise<SportsSchool>
  updateEnrollment: (schoolId: string, enrollmentId: string, data: any) => Promise<SportsSchool>
  suspendEnrollment: (schoolId: string, enrollmentId: string, reason: string) => Promise<SportsSchool>
  reactivateEnrollment: (schoolId: string, enrollmentId: string) => Promise<SportsSchool>
  addInstructor: (schoolId: string, instructorId: string) => Promise<SportsSchool>
  removeInstructor: (schoolId: string, instructorId: string) => Promise<SportsSchool>
  addEvent: (schoolId: string, event: any) => Promise<SportsSchool>
  addAchievement: (schoolId: string, achievement: any) => Promise<SportsSchool>
  updateCapacity: (schoolId: string, capacity: number) => Promise<SportsSchool>
  deleteSchool: (id: string) => Promise<void>
  getByModality: (modality: string) => SportsSchool[]
  getByTargetAudience: (audience: string) => SportsSchool[]
  getActiveSchools: () => SportsSchool[]
  getSchoolsWithAvailableSpots: () => SportsSchool[]
  refreshSchools: () => Promise<void>
}

export function useSportsSchools(): UseSportsSchoolsReturn {
  const [sportsSchools, setSportsSchools] = useState<SportsSchool[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchSchools = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await apiClient.get('/api/specialized/sports/schools')
      setSportsSchools(data.schools || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar escolinhas esportivas')
    } finally {
      setLoading(false)
    }
  }, [])

  const createSchool = useCallback(async (data: CreateSportsSchoolData): Promise<SportsSchool> => {
    try {
      setError(null)
      const response = await apiClient.post('/api/specialized/sports/schools', data)
      const newSchool = response.school
      setSportsSchools(prev => [newSchool, ...prev])
      return newSchool
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar escolinha'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const updateSchool = useCallback(async (id: string, data: Partial<CreateSportsSchoolData>): Promise<SportsSchool> => {
    try {
      setError(null)
      const response = await apiClient.put(`/api/specialized/sports/schools/${id}`, data)
      const updatedSchool = response.school
      setSportsSchools(prev => prev.map(school => school.id === id ? updatedSchool : school))
      return updatedSchool
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar escolinha'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const enrollStudent = useCallback(async (schoolId: string, studentData: any): Promise<SportsSchool> => {
    try {
      setError(null)
      const response = await apiClient.post(`/api/specialized/sports/schools/${schoolId}/enrollments`, studentData)
      const updatedSchool = response.school
      setSportsSchools(prev => prev.map(school => school.id === schoolId ? updatedSchool : school))
      return updatedSchool
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao matricular aluno'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const updateEnrollment = useCallback(async (schoolId: string, enrollmentId: string, data: any): Promise<SportsSchool> => {
    try {
      setError(null)
      const response = await apiClient.put(`/api/specialized/sports/schools/${schoolId}/enrollments/${enrollmentId}`, data)
      const updatedSchool = response.school
      setSportsSchools(prev => prev.map(school => school.id === schoolId ? updatedSchool : school))
      return updatedSchool
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar matrícula'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const suspendEnrollment = useCallback(async (schoolId: string, enrollmentId: string, reason: string): Promise<SportsSchool> => {
    try {
      setError(null)
      const response = await apiClient.put(`/api/specialized/sports/schools/${schoolId}/enrollments/${enrollmentId}/suspend`, { reason })
      const updatedSchool = response.school
      setSportsSchools(prev => prev.map(school => school.id === schoolId ? updatedSchool : school))
      return updatedSchool
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao suspender matrícula'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const reactivateEnrollment = useCallback(async (schoolId: string, enrollmentId: string): Promise<SportsSchool> => {
    try {
      setError(null)
      const response = await apiClient.put(`/api/specialized/sports/schools/${schoolId}/enrollments/${enrollmentId}/reactivate`)
      const updatedSchool = response.school
      setSportsSchools(prev => prev.map(school => school.id === schoolId ? updatedSchool : school))
      return updatedSchool
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao reativar matrícula'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const addInstructor = useCallback(async (schoolId: string, instructorId: string): Promise<SportsSchool> => {
    try {
      setError(null)
      const response = await apiClient.post(`/api/specialized/sports/schools/${schoolId}/instructors`, { instructorId })
      const updatedSchool = response.school
      setSportsSchools(prev => prev.map(school => school.id === schoolId ? updatedSchool : school))
      return updatedSchool
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao adicionar instrutor'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const removeInstructor = useCallback(async (schoolId: string, instructorId: string): Promise<SportsSchool> => {
    try {
      setError(null)
      const response = await apiClient.delete(`/api/specialized/sports/schools/${schoolId}/instructors/${instructorId}`)
      const updatedSchool = response.school
      setSportsSchools(prev => prev.map(school => school.id === schoolId ? updatedSchool : school))
      return updatedSchool
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao remover instrutor'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const addEvent = useCallback(async (schoolId: string, event: any): Promise<SportsSchool> => {
    try {
      setError(null)
      const response = await apiClient.post(`/api/specialized/sports/schools/${schoolId}/events`, event)
      const updatedSchool = response.school
      setSportsSchools(prev => prev.map(school => school.id === schoolId ? updatedSchool : school))
      return updatedSchool
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao adicionar evento'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const addAchievement = useCallback(async (schoolId: string, achievement: any): Promise<SportsSchool> => {
    try {
      setError(null)
      const response = await apiClient.post(`/api/specialized/sports/schools/${schoolId}/achievements`, achievement)
      const updatedSchool = response.school
      setSportsSchools(prev => prev.map(school => school.id === schoolId ? updatedSchool : school))
      return updatedSchool
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao adicionar conquista'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const updateCapacity = useCallback(async (schoolId: string, capacity: number): Promise<SportsSchool> => {
    try {
      setError(null)
      const response = await apiClient.put(`/api/specialized/sports/schools/${schoolId}/capacity`, { capacity })
      const updatedSchool = response.school
      setSportsSchools(prev => prev.map(school => school.id === schoolId ? updatedSchool : school))
      return updatedSchool
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar capacidade'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const deleteSchool = useCallback(async (id: string): Promise<void> => {
    try {
      setError(null)
      await apiClient.delete(`/api/specialized/sports/schools/${id}`)
      setSportsSchools(prev => prev.filter(school => school.id !== id))
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao excluir escolinha'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const getByModality = useCallback((modality: string) => sportsSchools.filter(school => school.modality === modality), [sportsSchools])
  const getByTargetAudience = useCallback((audience: string) => sportsSchools.filter(school => school.targetAudience === audience), [sportsSchools])
  const getActiveSchools = useCallback(() => sportsSchools.filter(school => school.isActive), [sportsSchools])
  const getSchoolsWithAvailableSpots = useCallback(() => sportsSchools.filter(school => school.capacity.available > 0), [sportsSchools])

  const refreshSchools = useCallback(async () => {
    await fetchSchools()
  }, [fetchSchools])

  useEffect(() => {
    fetchSchools()
  }, [fetchSchools])

  return {
    sportsSchools,
    loading,
    error,
    createSchool,
    updateSchool,
    enrollStudent,
    updateEnrollment,
    suspendEnrollment,
    reactivateEnrollment,
    addInstructor,
    removeInstructor,
    addEvent,
    addAchievement,
    updateCapacity,
    deleteSchool,
    getByModality,
    getByTargetAudience,
    getActiveSchools,
    getSchoolsWithAvailableSpots,
    refreshSchools
  }
}