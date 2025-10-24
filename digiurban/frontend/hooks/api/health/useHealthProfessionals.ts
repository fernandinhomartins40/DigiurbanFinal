import { useState, useEffect, useCallback } from 'react'
import { apiClient } from '@/lib/api'

export interface HealthProfessional {
  id: string
  name: string
  professional_type: 'DOCTOR' | 'NURSE' | 'TECHNICIAN' | 'THERAPIST' | 'PHARMACIST' | 'DENTIST' | 'PSYCHOLOGIST'
  specialty?: string
  registration: {
    number: string
    issuing_body: string
    expiration_date: string
    status: 'ACTIVE' | 'SUSPENDED' | 'EXPIRED'
  }
  employment: {
    health_center_id: string
    health_center_name: string
    employment_type: 'PERMANENT' | 'CONTRACT' | 'TEMPORARY' | 'VOLUNTEER'
    work_schedule: Array<{
      day: string
      start_time: string
      end_time: string
    }>
    salary?: number
  }
  qualifications: Array<{
    degree: string
    institution: string
    completion_year: number
  }>
  contact: {
    phone: string
    email: string
    address: string
  }
  performance_metrics: {
    consultations_per_month: number
    patient_satisfaction: number
    punctuality_score: number
  }
  created_at: string
  updated_at: string
}

export interface CreateHealthProfessionalData {
  name: string
  professional_type: 'DOCTOR' | 'NURSE' | 'TECHNICIAN' | 'THERAPIST' | 'PHARMACIST' | 'DENTIST' | 'PSYCHOLOGIST'
  specialty?: string
  registration: {
    number: string
    issuing_body: string
    expiration_date: string
  }
  employment: {
    health_center_id: string
    employment_type: 'PERMANENT' | 'CONTRACT' | 'TEMPORARY' | 'VOLUNTEER'
    work_schedule: Array<{
      day: string
      start_time: string
      end_time: string
    }>
    salary?: number
  }
  qualifications: Array<{
    degree: string
    institution: string
    completion_year: number
  }>
  contact: {
    phone: string
    email: string
    address: string
  }
}

export const useHealthProfessionals = () => {
  const [professionals, setProfessionals] = useState<HealthProfessional[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchProfessionals = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.get('/health/professionals')
      setProfessionals(response.data)
    } catch (err) {
      setError('Falha ao carregar profissionais de saúde')
      console.error('Error fetching health professionals:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  const createProfessional = useCallback(async (data: CreateHealthProfessionalData): Promise<HealthProfessional | null> => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.post('/health/professionals', data)
      const newProfessional = response.data
      setProfessionals(prev => [...prev, newProfessional])
      return newProfessional
    } catch (err) {
      setError('Falha ao criar profissional')
      console.error('Error creating professional:', err)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const updatePerformanceMetrics = useCallback(async (professionalId: string, metrics: {
    consultations_per_month?: number
    patient_satisfaction?: number
    punctuality_score?: number
  }): Promise<boolean> => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.patch(`/health/professionals/${professionalId}/metrics`, metrics)
      const updatedProfessional = response.data
      setProfessionals(prev => prev.map(p => p.id === professionalId ? updatedProfessional : p))
      return true
    } catch (err) {
      setError('Falha ao atualizar métricas')
      console.error('Error updating metrics:', err)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const getProfessionalsByType = useCallback((type: string) => {
    return professionals.filter(p => p.professional_type === type)
  }, [professionals])

  const getActiveProfessionals = useCallback(() => {
    return professionals.filter(p => p.registration.status === 'ACTIVE')
  }, [professionals])

  useEffect(() => {
    fetchProfessionals()
  }, [fetchProfessionals])

  return {
    professionals,
    loading,
    error,
    fetchProfessionals,
    createProfessional,
    updatePerformanceMetrics,
    getProfessionalsByType,
    getActiveProfessionals
  }
}