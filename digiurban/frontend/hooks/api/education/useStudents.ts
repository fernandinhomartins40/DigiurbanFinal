'use client'

import { useState, useEffect, useCallback } from 'react'
import { apiClient } from '@/lib/auth'

// Types
interface Student {
  id: string
  registrationNumber: string
  name: string
  dateOfBirth: string
  gender: 'MASCULINO' | 'FEMININO' | 'OUTRO'
  cpf?: string
  rg?: string
  address: string
  phone?: string
  email?: string
  emergencyContact: string
  emergencyPhone: string
  specialNeeds?: string
  medications?: string
  allergies?: string
  parentName: string
  parentCpf?: string
  parentPhone: string
  parentEmail?: string
  isActive: boolean
  schoolId: string
  school?: {
    id: string
    name: string
  }
  createdAt: string
  updatedAt: string
}

interface CreateStudentData {
  name: string
  dateOfBirth: string
  gender: 'MASCULINO' | 'FEMININO' | 'OUTRO'
  cpf?: string
  rg?: string
  address: string
  phone?: string
  email?: string
  emergencyContact: string
  emergencyPhone: string
  specialNeeds?: string
  medications?: string
  allergies?: string
  parentName: string
  parentCpf?: string
  parentPhone: string
  parentEmail?: string
  schoolId: string
}

interface UpdateStudentData extends Partial<CreateStudentData> {
  isActive?: boolean
}

interface StudentFilters {
  schoolId?: string
  isActive?: boolean
  search?: string
}

interface UseStudentsReturn {
  students: Student[]
  loading: boolean
  error: string | null
  createStudent: (data: CreateStudentData) => Promise<Student>
  updateStudent: (id: string, data: UpdateStudentData) => Promise<Student>
  deleteStudent: (id: string) => Promise<void>
  getStudentById: (id: string) => Student | undefined
  getStudentsBySchool: (schoolId: string) => Student[]
  refreshStudents: (filters?: StudentFilters) => Promise<void>
}

export function useStudents(initialFilters?: StudentFilters): UseStudentsReturn {
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStudents = useCallback(async (filters?: StudentFilters) => {
    try {
      setLoading(true)
      setError(null)

      const queryParams = new URLSearchParams()
      if (filters?.schoolId) queryParams.append('schoolId', filters.schoolId)
      if (filters?.isActive !== undefined) queryParams.append('isActive', filters.isActive.toString())
      if (filters?.search) queryParams.append('search', filters.search)

      const query = queryParams.toString()
      const endpoint = `/api/specialized/education/students${query ? `?${query}` : ''}`

      const data = await apiClient.get(endpoint)
      setStudents(data.students || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar alunos')
    } finally {
      setLoading(false)
    }
  }, [])

  const createStudent = useCallback(async (data: CreateStudentData): Promise<Student> => {
    try {
      setError(null)
      const response = await apiClient.post('/api/specialized/education/students', data)
      const newStudent = response.student
      setStudents(prev => [newStudent, ...prev])
      return newStudent
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar aluno'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const updateStudent = useCallback(async (id: string, data: UpdateStudentData): Promise<Student> => {
    try {
      setError(null)
      const response = await apiClient.put(`/api/specialized/education/students/${id}`, data)
      const updatedStudent = response.student
      setStudents(prev => prev.map(student =>
        student.id === id ? updatedStudent : student
      ))
      return updatedStudent
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar aluno'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const deleteStudent = useCallback(async (id: string): Promise<void> => {
    try {
      setError(null)
      await apiClient.delete(`/api/specialized/education/students/${id}`)
      setStudents(prev => prev.filter(student => student.id !== id))
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao excluir aluno'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const getStudentById = useCallback((id: string): Student | undefined => {
    return students.find(student => student.id === id)
  }, [students])

  const getStudentsBySchool = useCallback((schoolId: string): Student[] => {
    return students.filter(student => student.schoolId === schoolId)
  }, [students])

  const refreshStudents = useCallback(async (filters?: StudentFilters) => {
    await fetchStudents(filters)
  }, [fetchStudents])

  useEffect(() => {
    fetchStudents(initialFilters)
  }, [fetchStudents, initialFilters])

  return {
    students,
    loading,
    error,
    createStudent,
    updateStudent,
    deleteStudent,
    getStudentById,
    getStudentsBySchool,
    refreshStudents
  }
}