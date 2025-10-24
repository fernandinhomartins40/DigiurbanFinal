'use client'

import { useState, useEffect, useCallback } from 'react'
import { apiClient } from '@/lib/auth'

// Types
interface School {
  id: string
  name: string
  address: string
  phone?: string
  email?: string
  principal?: string
  capacity: number
  level: 'INFANTIL' | 'FUNDAMENTAL' | 'MEDIO' | 'EJA'
  isActive: boolean
  createdAt: string
  updatedAt: string
}

interface CreateSchoolData {
  name: string
  address: string
  phone?: string
  email?: string
  principal?: string
  capacity: number
  level: 'INFANTIL' | 'FUNDAMENTAL' | 'MEDIO' | 'EJA'
}

interface UpdateSchoolData extends Partial<CreateSchoolData> {
  isActive?: boolean
}

interface UseSchoolsReturn {
  schools: School[]
  loading: boolean
  error: string | null
  createSchool: (data: CreateSchoolData) => Promise<School>
  updateSchool: (id: string, data: UpdateSchoolData) => Promise<School>
  deleteSchool: (id: string) => Promise<void>
  getSchoolById: (id: string) => School | undefined
  refreshSchools: () => Promise<void>
}

export function useSchools(): UseSchoolsReturn {
  const [schools, setSchools] = useState<School[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchSchools = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await apiClient.get('/api/specialized/education/schools')
      setSchools(data.schools || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar escolas')
    } finally {
      setLoading(false)
    }
  }, [])

  const createSchool = useCallback(async (data: CreateSchoolData): Promise<School> => {
    try {
      setError(null)
      const response = await apiClient.post('/api/specialized/education/schools', data)
      const newSchool = response.school
      setSchools(prev => [newSchool, ...prev])
      return newSchool
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar escola'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const updateSchool = useCallback(async (id: string, data: UpdateSchoolData): Promise<School> => {
    try {
      setError(null)
      const response = await apiClient.put(`/api/specialized/education/schools/${id}`, data)
      const updatedSchool = response.school
      setSchools(prev => prev.map(school =>
        school.id === id ? updatedSchool : school
      ))
      return updatedSchool
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar escola'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const deleteSchool = useCallback(async (id: string): Promise<void> => {
    try {
      setError(null)
      await apiClient.delete(`/api/specialized/education/schools/${id}`)
      setSchools(prev => prev.filter(school => school.id !== id))
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao excluir escola'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const getSchoolById = useCallback((id: string): School | undefined => {
    return schools.find(school => school.id === id)
  }, [schools])

  const refreshSchools = useCallback(async () => {
    await fetchSchools()
  }, [fetchSchools])

  useEffect(() => {
    fetchSchools()
  }, [fetchSchools])

  return {
    schools,
    loading,
    error,
    createSchool,
    updateSchool,
    deleteSchool,
    getSchoolById,
    refreshSchools
  }
}