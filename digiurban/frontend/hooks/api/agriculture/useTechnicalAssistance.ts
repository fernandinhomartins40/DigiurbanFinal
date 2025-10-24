import { useState, useEffect, useCallback } from 'react'
import { apiClient } from '@/lib/api'

export interface TechnicalAssistance {
  id: string
  protocol: string
  type: 'CONSULTATION' | 'FIELD_VISIT' | 'TRAINING' | 'DEMONSTRATION' | 'FOLLOW_UP' | 'EMERGENCY'
  status: 'REQUESTED' | 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'POSTPONED'
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  producer: {
    id: string
    name: string
    cpf_cnpj: string
    contact: {
      phone: string
      email: string
    }
  }
  property: {
    id: string
    name: string
    size: number
    location: {
      municipality: string
      district: string
      address: string
    }
  }
  technician: {
    id: string
    name: string
    registration: string
    specialization: Array<'AGRONOMY' | 'VETERINARY' | 'ZOOTECHNICS' | 'FORESTRY' | 'FISHING' | 'IRRIGATION'>
    contact: {
      phone: string
      email: string
    }
  }
  request: {
    category: 'CROPS' | 'LIVESTOCK' | 'SOIL' | 'IRRIGATION' | 'PEST_CONTROL' | 'DISEASE_MANAGEMENT' | 'NUTRITION' | 'GENETICS' | 'MARKETING' | 'FINANCE' | 'SUSTAINABILITY'
    description: string
    urgency_reason?: string
    expected_outcome: string
    requested_date: string
    requested_by: string
  }
  schedule: {
    planned_date?: string
    planned_time?: string
    estimated_duration?: number
    actual_start?: string
    actual_end?: string
    location_type: 'FIELD' | 'OFFICE' | 'REMOTE' | 'GROUP_MEETING'
  }
  technical_data: {
    crops_involved?: Array<{
      name: string
      variety: string
      area: number
      growth_stage: string
      issues?: Array<string>
    }>
    livestock_involved?: Array<{
      species: string
      breed: string
      quantity: number
      age_category: string
      issues?: Array<string>
    }>
    soil_analysis?: {
      ph: number
      organic_matter: number
      nutrients: {
        nitrogen: number
        phosphorus: number
        potassium: number
      }
      recommendations: Array<string>
    }
    climate_data?: {
      temperature: { min: number, max: number }
      humidity: number
      rainfall: number
      recommendations: Array<string>
    }
  }
  diagnosis: {
    problem_identification: Array<{
      type: 'DISEASE' | 'PEST' | 'DEFICIENCY' | 'MANAGEMENT' | 'ENVIRONMENTAL' | 'GENETIC'
      description: string
      severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
      causes: Array<string>
    }>
    opportunities: Array<{
      area: 'PRODUCTIVITY' | 'QUALITY' | 'COST_REDUCTION' | 'SUSTAINABILITY' | 'MARKET_ACCESS'
      description: string
      potential_impact: 'LOW' | 'MEDIUM' | 'HIGH'
    }>
  }
  recommendations: Array<{
    id: string
    category: 'IMMEDIATE' | 'SHORT_TERM' | 'LONG_TERM'
    type: 'TREATMENT' | 'PREVENTION' | 'IMPROVEMENT' | 'IMPLEMENTATION'
    description: string
    materials_needed: Array<{
      item: string
      quantity: number
      unit: string
      estimated_cost?: number
    }>
    steps: Array<{
      order: number
      description: string
      duration: string
      responsible: 'PRODUCER' | 'TECHNICIAN' | 'THIRD_PARTY'
    }>
    timeline: {
      start_date: string
      end_date: string
    }
    cost_estimate: {
      materials: number
      labor: number
      services: number
      total: number
    }
    expected_results: Array<string>
    success_indicators: Array<string>
  }>
  implementation: {
    started: boolean
    start_date?: string
    progress_percentage: number
    completed_recommendations: Array<string>
    challenges: Array<{
      description: string
      impact: 'LOW' | 'MEDIUM' | 'HIGH'
      solution?: string
    }>
    adjustments: Array<{
      date: string
      description: string
      reason: string
    }>
  }
  follow_up: Array<{
    id: string
    date: string
    type: 'VISIT' | 'CALL' | 'EMAIL' | 'WHATSAPP'
    technician_id: string
    observations: string
    progress_evaluation: 'EXCELLENT' | 'GOOD' | 'SATISFACTORY' | 'NEEDS_IMPROVEMENT' | 'POOR'
    next_action?: string
    next_date?: string
  }>
  results: {
    completion_date?: string
    success_rate: number
    producer_satisfaction: number
    economic_impact?: {
      cost_reduction: number
      productivity_increase: number
      quality_improvement: number
      revenue_increase: number
    }
    environmental_impact?: {
      water_savings: number
      chemical_reduction: number
      soil_improvement: number
      biodiversity_enhancement: number
    }
    lessons_learned: Array<string>
  }
  documentation: {
    photos: Array<{
      url: string
      description: string
      date: string
      stage: 'INITIAL' | 'PROGRESS' | 'FINAL'
    }>
    reports: Array<{
      type: 'INITIAL_ASSESSMENT' | 'PROGRESS_REPORT' | 'FINAL_REPORT' | 'TECHNICAL_NOTE'
      file_path: string
      date: string
    }>
    certificates?: Array<{
      type: string
      file_path: string
      issued_date: string
    }>
  }
  created_at: string
  updated_at: string
}

export interface CreateTechnicalAssistanceData {
  type: 'CONSULTATION' | 'FIELD_VISIT' | 'TRAINING' | 'DEMONSTRATION' | 'FOLLOW_UP' | 'EMERGENCY'
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  producer_id: string
  property_id: string
  technician_id?: string
  request: {
    category: 'CROPS' | 'LIVESTOCK' | 'SOIL' | 'IRRIGATION' | 'PEST_CONTROL' | 'DISEASE_MANAGEMENT' | 'NUTRITION' | 'GENETICS' | 'MARKETING' | 'FINANCE' | 'SUSTAINABILITY'
    description: string
    urgency_reason?: string
    expected_outcome: string
    requested_by: string
  }
  schedule?: {
    planned_date?: string
    planned_time?: string
    estimated_duration?: number
    location_type: 'FIELD' | 'OFFICE' | 'REMOTE' | 'GROUP_MEETING'
  }
}

export interface TechnicalAssistanceFilters {
  protocol?: string
  type?: 'CONSULTATION' | 'FIELD_VISIT' | 'TRAINING' | 'DEMONSTRATION' | 'FOLLOW_UP' | 'EMERGENCY'
  status?: 'REQUESTED' | 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'POSTPONED'
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  producer_id?: string
  technician_id?: string
  category?: 'CROPS' | 'LIVESTOCK' | 'SOIL' | 'IRRIGATION' | 'PEST_CONTROL' | 'DISEASE_MANAGEMENT' | 'NUTRITION' | 'GENETICS' | 'MARKETING' | 'FINANCE' | 'SUSTAINABILITY'
  municipality?: string
  scheduled_from?: string
  scheduled_to?: string
  completion_from?: string
  completion_to?: string
  min_success_rate?: number
  created_from?: string
  created_to?: string
}

export const useTechnicalAssistance = () => {
  const [assistances, setAssistances] = useState<TechnicalAssistance[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchAssistances = useCallback(async (filters?: TechnicalAssistanceFilters) => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.get('/agriculture/technical-assistance', { params: filters })
      setAssistances(response.data)
    } catch (err) {
      setError('Falha ao carregar assistências técnicas')
      console.error('Error fetching technical assistances:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  const getAssistanceById = useCallback(async (id: string): Promise<TechnicalAssistance | null> => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.get(`/agriculture/technical-assistance/${id}`)
      return response.data
    } catch (err) {
      setError('Falha ao carregar assistência técnica')
      console.error('Error fetching technical assistance:', err)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const createAssistance = useCallback(async (data: CreateTechnicalAssistanceData): Promise<TechnicalAssistance | null> => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.post('/agriculture/technical-assistance', data)
      const newAssistance = response.data
      setAssistances(prev => [...prev, newAssistance])
      return newAssistance
    } catch (err) {
      setError('Falha ao criar assistência técnica')
      console.error('Error creating technical assistance:', err)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const updateAssistance = useCallback(async (id: string, data: Partial<CreateTechnicalAssistanceData>): Promise<TechnicalAssistance | null> => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.put(`/agriculture/technical-assistance/${id}`, data)
      const updatedAssistance = response.data
      setAssistances(prev => prev.map(asst => asst.id === id ? updatedAssistance : asst))
      return updatedAssistance
    } catch (err) {
      setError('Falha ao atualizar assistência técnica')
      console.error('Error updating technical assistance:', err)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const deleteAssistance = useCallback(async (id: string): Promise<boolean> => {
    try {
      setLoading(true)
      setError(null)
      await apiClient.delete(`/agriculture/technical-assistance/${id}`)
      setAssistances(prev => prev.filter(asst => asst.id !== id))
      return true
    } catch (err) {
      setError('Falha ao excluir assistência técnica')
      console.error('Error deleting technical assistance:', err)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const assignTechnician = useCallback(async (id: string, technicianId: string): Promise<boolean> => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.patch(`/agriculture/technical-assistance/${id}/assign`, { technician_id: technicianId })
      const updatedAssistance = response.data
      setAssistances(prev => prev.map(asst => asst.id === id ? updatedAssistance : asst))
      return true
    } catch (err) {
      setError('Falha ao atribuir técnico')
      console.error('Error assigning technician:', err)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const updateSchedule = useCallback(async (id: string, schedule: {
    planned_date: string
    planned_time: string
    estimated_duration: number
    location_type: 'FIELD' | 'OFFICE' | 'REMOTE' | 'GROUP_MEETING'
  }): Promise<boolean> => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.patch(`/agriculture/technical-assistance/${id}/schedule`, schedule)
      const updatedAssistance = response.data
      setAssistances(prev => prev.map(asst => asst.id === id ? updatedAssistance : asst))
      return true
    } catch (err) {
      setError('Falha ao atualizar agendamento')
      console.error('Error updating schedule:', err)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const startAssistance = useCallback(async (id: string): Promise<boolean> => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.post(`/agriculture/technical-assistance/${id}/start`)
      const updatedAssistance = response.data
      setAssistances(prev => prev.map(asst => asst.id === id ? updatedAssistance : asst))
      return true
    } catch (err) {
      setError('Falha ao iniciar assistência')
      console.error('Error starting assistance:', err)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const addDiagnosis = useCallback(async (id: string, diagnosis: {
    problem_identification: Array<{
      type: 'DISEASE' | 'PEST' | 'DEFICIENCY' | 'MANAGEMENT' | 'ENVIRONMENTAL' | 'GENETIC'
      description: string
      severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
      causes: Array<string>
    }>
    opportunities: Array<{
      area: 'PRODUCTIVITY' | 'QUALITY' | 'COST_REDUCTION' | 'SUSTAINABILITY' | 'MARKET_ACCESS'
      description: string
      potential_impact: 'LOW' | 'MEDIUM' | 'HIGH'
    }>
  }): Promise<boolean> => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.post(`/agriculture/technical-assistance/${id}/diagnosis`, diagnosis)
      const updatedAssistance = response.data
      setAssistances(prev => prev.map(asst => asst.id === id ? updatedAssistance : asst))
      return true
    } catch (err) {
      setError('Falha ao adicionar diagnóstico')
      console.error('Error adding diagnosis:', err)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const addRecommendation = useCallback(async (id: string, recommendation: {
    category: 'IMMEDIATE' | 'SHORT_TERM' | 'LONG_TERM'
    type: 'TREATMENT' | 'PREVENTION' | 'IMPROVEMENT' | 'IMPLEMENTATION'
    description: string
    materials_needed: Array<{
      item: string
      quantity: number
      unit: string
      estimated_cost?: number
    }>
    steps: Array<{
      order: number
      description: string
      duration: string
      responsible: 'PRODUCER' | 'TECHNICIAN' | 'THIRD_PARTY'
    }>
    timeline: {
      start_date: string
      end_date: string
    }
    cost_estimate: {
      materials: number
      labor: number
      services: number
      total: number
    }
    expected_results: Array<string>
    success_indicators: Array<string>
  }): Promise<boolean> => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.post(`/agriculture/technical-assistance/${id}/recommendations`, recommendation)
      const updatedAssistance = response.data
      setAssistances(prev => prev.map(asst => asst.id === id ? updatedAssistance : asst))
      return true
    } catch (err) {
      setError('Falha ao adicionar recomendação')
      console.error('Error adding recommendation:', err)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const recordFollowUp = useCallback(async (id: string, followUp: {
    type: 'VISIT' | 'CALL' | 'EMAIL' | 'WHATSAPP'
    observations: string
    progress_evaluation: 'EXCELLENT' | 'GOOD' | 'SATISFACTORY' | 'NEEDS_IMPROVEMENT' | 'POOR'
    next_action?: string
    next_date?: string
  }): Promise<boolean> => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.post(`/agriculture/technical-assistance/${id}/follow-up`, followUp)
      const updatedAssistance = response.data
      setAssistances(prev => prev.map(asst => asst.id === id ? updatedAssistance : asst))
      return true
    } catch (err) {
      setError('Falha ao registrar acompanhamento')
      console.error('Error recording follow-up:', err)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const completeAssistance = useCallback(async (id: string, results: {
    success_rate: number
    producer_satisfaction: number
    economic_impact?: {
      cost_reduction: number
      productivity_increase: number
      quality_improvement: number
      revenue_increase: number
    }
    environmental_impact?: {
      water_savings: number
      chemical_reduction: number
      soil_improvement: number
      biodiversity_enhancement: number
    }
    lessons_learned: Array<string>
  }): Promise<boolean> => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.post(`/agriculture/technical-assistance/${id}/complete`, results)
      const updatedAssistance = response.data
      setAssistances(prev => prev.map(asst => asst.id === id ? updatedAssistance : asst))
      return true
    } catch (err) {
      setError('Falha ao finalizar assistência')
      console.error('Error completing assistance:', err)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const getAssistancesByProducer = useCallback((producerId: string) => {
    return assistances.filter(assistance => assistance.producer.id === producerId)
  }, [assistances])

  const getAssistancesByTechnician = useCallback((technicianId: string) => {
    return assistances.filter(assistance => assistance.technician.id === technicianId)
  }, [assistances])

  const getPendingAssistances = useCallback(() => {
    return assistances.filter(assistance =>
      assistance.status === 'REQUESTED' || assistance.status === 'SCHEDULED' || assistance.status === 'IN_PROGRESS'
    )
  }, [assistances])

  const getHighPriorityAssistances = useCallback(() => {
    return assistances.filter(assistance =>
      assistance.priority === 'HIGH' || assistance.priority === 'URGENT'
    )
  }, [assistances])

  useEffect(() => {
    fetchAssistances()
  }, [fetchAssistances])

  return {
    assistances,
    loading,
    error,
    fetchAssistances,
    getAssistanceById,
    createAssistance,
    updateAssistance,
    deleteAssistance,
    assignTechnician,
    updateSchedule,
    startAssistance,
    addDiagnosis,
    addRecommendation,
    recordFollowUp,
    completeAssistance,
    getAssistancesByProducer,
    getAssistancesByTechnician,
    getPendingAssistances,
    getHighPriorityAssistances
  }
}