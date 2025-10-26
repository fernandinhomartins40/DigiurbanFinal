'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAdminAuth } from '@/contexts/AdminAuthContext'

// Types
interface Enrollment {
  id: string
  studentId: string
  classId: string
  year: number
  semester?: number
  enrollmentDate: string
  status: 'ACTIVE' | 'TRANSFERRED' | 'DROPPED' | 'COMPLETED'
  transferReason?: string
  dropReason?: string
  completionDate?: string
  observations?: string
  student?: {
    id: string
    name: string
    registrationNumber: string
  }
  class?: {
    id: string
    name: string
    grade: string
    school: {
      id: string
      name: string
    }
  }
  createdAt: string
  updatedAt: string
}

interface CreateEnrollmentData {
  studentId: string
  classId: string
  year: number
  semester?: number
  enrollmentDate: string
  observations?: string
}

interface UpdateEnrollmentData {
  classId?: string
  status?: 'ACTIVE' | 'TRANSFERRED' | 'DROPPED' | 'COMPLETED'
  transferReason?: string
  dropReason?: string
  completionDate?: string
  observations?: string
}

interface EnrollmentFilters {
  studentId?: string
  classId?: string
  schoolId?: string
  year?: number
  semester?: number
  status?: 'ACTIVE' | 'TRANSFERRED' | 'DROPPED' | 'COMPLETED'
}

interface UseEnrollmentsReturn {
  enrollments: Enrollment[]
  loading: boolean
  error: string | null
  createEnrollment: (data: CreateEnrollmentData) => Promise<Enrollment>
  updateEnrollment: (id: string, data: UpdateEnrollmentData) => Promise<Enrollment>
  deleteEnrollment: (id: string) => Promise<void>
  getEnrollmentById: (id: string) => Enrollment | undefined
  getEnrollmentsByStudent: (studentId: string) => Enrollment[]
  getEnrollmentsByClass: (classId: string) => Enrollment[]
  transferStudent: (id: string, newClassId: string, reason: string) => Promise<Enrollment>
  dropStudent: (id: string, reason: string) => Promise<Enrollment>
  refreshEnrollments: (filters?: EnrollmentFilters) => Promise<void>
}

export function useEnrollments(initialFilters?: EnrollmentFilters): UseEnrollmentsReturn {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchEnrollments = useCallback(async (filters?: EnrollmentFilters) => {
    try {
      setLoading(true)
      setError(null)

      const queryParams = new URLSearchParams()
      if (filters?.studentId) queryParams.append('studentId', filters.studentId)
      if (filters?.classId) queryParams.append('classId', filters.classId)
      if (filters?.schoolId) queryParams.append('schoolId', filters.schoolId)
      if (filters?.year) queryParams.append('year', filters.year.toString())
      if (filters?.semester) queryParams.append('semester', filters.semester.toString())
      if (filters?.status) queryParams.append('status', filters.status)

      const query = queryParams.toString()
      const endpoint = `/api/specialized/education/enrollments${query ? `?${query}` : ''}`

      const data = await apiClient.get(endpoint)
      setEnrollments(data.enrollments || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar matrículas')
    } finally {
      setLoading(false)
    }
  }, [])

  const createEnrollment = useCallback(async (data: CreateEnrollmentData): Promise<Enrollment> => {
    try {
      setError(null)
      const response = await apiClient.post('/api/specialized/education/enrollments', data)
      const newEnrollment = response.enrollment
      setEnrollments(prev => [newEnrollment, ...prev])
      return newEnrollment
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar matrícula'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const updateEnrollment = useCallback(async (id: string, data: UpdateEnrollmentData): Promise<Enrollment> => {
    try {
      setError(null)
      const response = await apiClient.put(`/api/specialized/education/enrollments/${id}`, data)
      const updatedEnrollment = response.enrollment
      setEnrollments(prev => prev.map(enrollment =>
        enrollment.id === id ? updatedEnrollment : enrollment
      ))
      return updatedEnrollment
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar matrícula'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const deleteEnrollment = useCallback(async (id: string): Promise<void> => {
    try {
      setError(null)
      await apiClient.delete(`/api/specialized/education/enrollments/${id}`)
      setEnrollments(prev => prev.filter(enrollment => enrollment.id !== id))
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao excluir matrícula'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const transferStudent = useCallback(async (id: string, newClassId: string, reason: string): Promise<Enrollment> => {
    return updateEnrollment(id, {
      classId: newClassId,
      status: 'TRANSFERRED',
      transferReason: reason
    })
  }, [updateEnrollment])

  const dropStudent = useCallback(async (id: string, reason: string): Promise<Enrollment> => {
    return updateEnrollment(id, {
      status: 'DROPPED',
      dropReason: reason
    })
  }, [updateEnrollment])

  const getEnrollmentById = useCallback((id: string): Enrollment | undefined => {
    return enrollments.find(enrollment => enrollment.id === id)
  }, [enrollments])

  const getEnrollmentsByStudent = useCallback((studentId: string): Enrollment[] => {
    return enrollments.filter(enrollment => enrollment.studentId === studentId)
  }, [enrollments])

  const getEnrollmentsByClass = useCallback((classId: string): Enrollment[] => {
    return enrollments.filter(enrollment => enrollment.classId === classId)
  }, [enrollments])

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
    deleteEnrollment,
    getEnrollmentById,
    getEnrollmentsByStudent,
    getEnrollmentsByClass,
    transferStudent,
    dropStudent,
    refreshEnrollments
  }
}