'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAdminAuth } from '@/contexts/AdminAuthContext'

interface ProgramEnrollment {
  id: string
  familyId: string
  programId: string
  enrollmentDate: string
  status: 'PENDING' | 'ACTIVE' | 'SUSPENDED' | 'COMPLETED' | 'CANCELLED'
  startDate?: string
  endDate?: string
  completionReason?: string
  cancellationReason?: string
  progressNotes: { date: string; note: string; createdBy: string }[]
  evaluations: { date: string; score: number; observations: string; evaluatedBy: string }[]
  family?: { id: string; responsibleName: string; registrationNumber: string }
  program?: { id: string; name: string; description: string }
  createdAt: string
  updatedAt: string
}

interface CreateProgramEnrollmentData {
  familyId: string
  programId: string
  enrollmentDate: string
}

interface UpdateProgramEnrollmentData extends Partial<CreateProgramEnrollmentData> {
  status?: 'PENDING' | 'ACTIVE' | 'SUSPENDED' | 'COMPLETED' | 'CANCELLED'
  startDate?: string
  endDate?: string
  completionReason?: string
  cancellationReason?: string
}

interface EnrollmentFilters {
  familyId?: string
  programId?: string
  status?: 'PENDING' | 'ACTIVE' | 'SUSPENDED' | 'COMPLETED' | 'CANCELLED'
}

interface UseProgramEnrollmentsReturn {
  enrollments: ProgramEnrollment[]
  loading: boolean
  error: string | null
  createEnrollment: (data: CreateProgramEnrollmentData) => Promise<ProgramEnrollment>
  updateEnrollment: (id: string, data: UpdateProgramEnrollmentData) => Promise<ProgramEnrollment>
  addProgressNote: (id: string, note: string) => Promise<ProgramEnrollment>
  addEvaluation: (id: string, score: number, observations: string) => Promise<ProgramEnrollment>
  completeEnrollment: (id: string, reason: string) => Promise<ProgramEnrollment>
  cancelEnrollment: (id: string, reason: string) => Promise<ProgramEnrollment>
  deleteEnrollment: (id: string) => Promise<void>
  getEnrollmentById: (id: string) => ProgramEnrollment | undefined
  getEnrollmentsByFamily: (familyId: string) => ProgramEnrollment[]
  getEnrollmentsByProgram: (programId: string) => ProgramEnrollment[]
  refreshEnrollments: (filters?: EnrollmentFilters) => Promise<void>
}

export function useProgramEnrollments(initialFilters?: EnrollmentFilters): UseProgramEnrollmentsReturn {
  const [enrollments, setEnrollments] = useState<ProgramEnrollment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchEnrollments = useCallback(async (filters?: EnrollmentFilters) => {
    try {
      setLoading(true)
      setError(null)
      const queryParams = new URLSearchParams()
      if (filters?.familyId) queryParams.append('familyId', filters.familyId)
      if (filters?.programId) queryParams.append('programId', filters.programId)
      if (filters?.status) queryParams.append('status', filters.status)

      const query = queryParams.toString()
      const endpoint = `/api/specialized/social-assistance/enrollments${query ? `?${query}` : ''}`
      const data = await apiClient.get(endpoint)
      setEnrollments(data.enrollments || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar inscrições')
    } finally {
      setLoading(false)
    }
  }, [])

  const createEnrollment = useCallback(async (data: CreateProgramEnrollmentData): Promise<ProgramEnrollment> => {
    try {
      setError(null)
      const response = await apiClient.post('/api/specialized/social-assistance/enrollments', data)
      const newEnrollment = response.enrollment
      setEnrollments(prev => [newEnrollment, ...prev])
      return newEnrollment
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar inscrição'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const updateEnrollment = useCallback(async (id: string, data: UpdateProgramEnrollmentData): Promise<ProgramEnrollment> => {
    try {
      setError(null)
      const response = await apiClient.put(`/api/specialized/social-assistance/enrollments/${id}`, data)
      const updatedEnrollment = response.enrollment
      setEnrollments(prev => prev.map(enrollment => enrollment.id === id ? updatedEnrollment : enrollment))
      return updatedEnrollment
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar inscrição'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const addProgressNote = useCallback(async (id: string, note: string): Promise<ProgramEnrollment> => {
    try {
      setError(null)
      const response = await apiClient.post(`/api/specialized/social-assistance/enrollments/${id}/notes`, { note })
      const updatedEnrollment = response.enrollment
      setEnrollments(prev => prev.map(enrollment => enrollment.id === id ? updatedEnrollment : enrollment))
      return updatedEnrollment
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao adicionar nota de progresso'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const addEvaluation = useCallback(async (id: string, score: number, observations: string): Promise<ProgramEnrollment> => {
    try {
      setError(null)
      const response = await apiClient.post(`/api/specialized/social-assistance/enrollments/${id}/evaluations`, { score, observations })
      const updatedEnrollment = response.enrollment
      setEnrollments(prev => prev.map(enrollment => enrollment.id === id ? updatedEnrollment : enrollment))
      return updatedEnrollment
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao adicionar avaliação'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const completeEnrollment = useCallback(async (id: string, reason: string): Promise<ProgramEnrollment> => {
    return updateEnrollment(id, { status: 'COMPLETED', completionReason: reason, endDate: new Date().toISOString() })
  }, [updateEnrollment])

  const cancelEnrollment = useCallback(async (id: string, reason: string): Promise<ProgramEnrollment> => {
    return updateEnrollment(id, { status: 'CANCELLED', cancellationReason: reason, endDate: new Date().toISOString() })
  }, [updateEnrollment])

  const deleteEnrollment = useCallback(async (id: string): Promise<void> => {
    try {
      setError(null)
      await apiClient.delete(`/api/specialized/social-assistance/enrollments/${id}`)
      setEnrollments(prev => prev.filter(enrollment => enrollment.id !== id))
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao excluir inscrição'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const getEnrollmentById = useCallback((id: string) => enrollments.find(enrollment => enrollment.id === id), [enrollments])
  const getEnrollmentsByFamily = useCallback((familyId: string) => enrollments.filter(enrollment => enrollment.familyId === familyId), [enrollments])
  const getEnrollmentsByProgram = useCallback((programId: string) => enrollments.filter(enrollment => enrollment.programId === programId), [enrollments])

  const refreshEnrollments = useCallback(async (filters?: EnrollmentFilters) => {
    await fetchEnrollments(filters)
  }, [fetchEnrollments])

  useEffect(() => {
    fetchEnrollments(initialFilters)
  }, [fetchEnrollments, initialFilters])

  return {
    enrollments,
    loading,
    error,
    createEnrollment,
    updateEnrollment,
    addProgressNote,
    addEvaluation,
    completeEnrollment,
    cancelEnrollment,
    deleteEnrollment,
    getEnrollmentById,
    getEnrollmentsByFamily,
    getEnrollmentsByProgram,
    refreshEnrollments
  }
}