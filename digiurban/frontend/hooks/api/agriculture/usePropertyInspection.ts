import { useState, useEffect, useCallback } from 'react'
import { apiClient } from '@/lib/api'

export interface PropertyInspection {
  id: string
  number: string
  type: 'ROUTINE' | 'COMPLAINT' | 'LICENSING' | 'FOLLOW_UP' | 'EMERGENCY' | 'CERTIFICATION'
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'POSTPONED'
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  property: {
    id: string
    name: string
    owner: string
    size: number
    location: {
      address: string
      municipality: string
      district: string
      coordinates: {
        latitude: number
        longitude: number
      }
    }
    car_number?: string
  }
  inspector: {
    id: string
    name: string
    registration: string
    specialization: Array<'AGRICULTURE' | 'LIVESTOCK' | 'ENVIRONMENTAL' | 'VETERINARY' | 'AGRONOMY'>
  }
  schedule: {
    planned_date: string
    planned_time: string
    estimated_duration: number
    actual_start?: string
    actual_end?: string
  }
  objectives: Array<{
    category: 'ENVIRONMENTAL' | 'SANITARY' | 'LABOR' | 'LAND_USE' | 'PRODUCTION' | 'DOCUMENTATION'
    description: string
    mandatory: boolean
  }>
  findings: Array<{
    id: string
    category: 'ENVIRONMENTAL' | 'SANITARY' | 'LABOR' | 'LAND_USE' | 'PRODUCTION' | 'DOCUMENTATION'
    type: 'COMPLIANCE' | 'NON_COMPLIANCE' | 'OBSERVATION' | 'RECOMMENDATION'
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
    description: string
    evidence: Array<{
      type: 'PHOTO' | 'VIDEO' | 'DOCUMENT' | 'SAMPLE'
      file_path: string
      description: string
      coordinates?: {
        latitude: number
        longitude: number
      }
    }>
    legal_reference?: string
    corrective_action?: string
    deadline?: string
  }>
  violations: Array<{
    id: string
    type: 'ENVIRONMENTAL' | 'SANITARY' | 'LABOR' | 'ADMINISTRATIVE'
    code: string
    description: string
    severity: 'LIGHT' | 'SERIOUS' | 'VERY_SERIOUS'
    fine_amount?: number
    legal_basis: string
    corrective_measures: Array<{
      description: string
      deadline: string
      status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'OVERDUE'
    }>
  }>
  recommendations: Array<{
    category: 'BEST_PRACTICES' | 'IMPROVEMENT' | 'PREVENTION' | 'SUSTAINABILITY'
    description: string
    benefits: string
    implementation_cost?: 'LOW' | 'MEDIUM' | 'HIGH'
    priority: 'LOW' | 'MEDIUM' | 'HIGH'
  }>
  technical_data: {
    areas_inspected: Array<{
      name: string
      size: number
      land_use: string
      condition: 'EXCELLENT' | 'GOOD' | 'REGULAR' | 'POOR' | 'CRITICAL'
    }>
    infrastructure_evaluated: Array<{
      type: 'BUILDINGS' | 'STORAGE' | 'IRRIGATION' | 'MACHINERY' | 'PROCESSING'
      condition: 'EXCELLENT' | 'GOOD' | 'REGULAR' | 'POOR' | 'CRITICAL'
      observations?: string
    }>
    production_data: {
      main_activities: Array<string>
      production_volume?: number
      employment_count?: number
      compliance_certifications: Array<string>
    }
  }
  follow_up: {
    required: boolean
    deadline?: string
    type?: 'DOCUMENT_REVIEW' | 'SITE_VISIT' | 'CORRECTIVE_VERIFICATION'
    status?: 'PENDING' | 'SCHEDULED' | 'COMPLETED'
  }
  report: {
    preliminary_date?: string
    final_date?: string
    approval_date?: string
    approved_by?: string
    public: boolean
    file_path?: string
  }
  created_at: string
  updated_at: string
}

export interface CreatePropertyInspectionData {
  type: 'ROUTINE' | 'COMPLAINT' | 'LICENSING' | 'FOLLOW_UP' | 'EMERGENCY' | 'CERTIFICATION'
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  property_id: string
  inspector_id: string
  schedule: {
    planned_date: string
    planned_time: string
    estimated_duration: number
  }
  objectives: Array<{
    category: 'ENVIRONMENTAL' | 'SANITARY' | 'LABOR' | 'LAND_USE' | 'PRODUCTION' | 'DOCUMENTATION'
    description: string
    mandatory: boolean
  }>
  requested_by?: string
  complaint_details?: string
}

export interface PropertyInspectionFilters {
  number?: string
  type?: 'ROUTINE' | 'COMPLAINT' | 'LICENSING' | 'FOLLOW_UP' | 'EMERGENCY' | 'CERTIFICATION'
  status?: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'POSTPONED'
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  inspector_id?: string
  property_id?: string
  municipality?: string
  scheduled_from?: string
  scheduled_to?: string
  has_violations?: boolean
  violation_type?: 'ENVIRONMENTAL' | 'SANITARY' | 'LABOR' | 'ADMINISTRATIVE'
  follow_up_required?: boolean
  created_from?: string
  created_to?: string
}

export const usePropertyInspection = () => {
  const [inspections, setInspections] = useState<PropertyInspection[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchInspections = useCallback(async (filters?: PropertyInspectionFilters) => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.get('/agriculture/property-inspections', { params: filters })
      setInspections(response.data)
    } catch (err) {
      setError('Falha ao carregar fiscalizações')
      console.error('Error fetching inspections:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  const getInspectionById = useCallback(async (id: string): Promise<PropertyInspection | null> => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.get(`/agriculture/property-inspections/${id}`)
      return response.data
    } catch (err) {
      setError('Falha ao carregar fiscalização')
      console.error('Error fetching inspection:', err)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const createInspection = useCallback(async (data: CreatePropertyInspectionData): Promise<PropertyInspection | null> => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.post('/agriculture/property-inspections', data)
      const newInspection = response.data
      setInspections(prev => [...prev, newInspection])
      return newInspection
    } catch (err) {
      setError('Falha ao criar fiscalização')
      console.error('Error creating inspection:', err)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const updateInspection = useCallback(async (id: string, data: Partial<CreatePropertyInspectionData>): Promise<PropertyInspection | null> => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.put(`/agriculture/property-inspections/${id}`, data)
      const updatedInspection = response.data
      setInspections(prev => prev.map(insp => insp.id === id ? updatedInspection : insp))
      return updatedInspection
    } catch (err) {
      setError('Falha ao atualizar fiscalização')
      console.error('Error updating inspection:', err)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const deleteInspection = useCallback(async (id: string): Promise<boolean> => {
    try {
      setLoading(true)
      setError(null)
      await apiClient.delete(`/agriculture/property-inspections/${id}`)
      setInspections(prev => prev.filter(insp => insp.id !== id))
      return true
    } catch (err) {
      setError('Falha ao excluir fiscalização')
      console.error('Error deleting inspection:', err)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const startInspection = useCallback(async (id: string): Promise<boolean> => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.post(`/agriculture/property-inspections/${id}/start`)
      const updatedInspection = response.data
      setInspections(prev => prev.map(insp => insp.id === id ? updatedInspection : insp))
      return true
    } catch (err) {
      setError('Falha ao iniciar fiscalização')
      console.error('Error starting inspection:', err)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const completeInspection = useCallback(async (id: string): Promise<boolean> => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.post(`/agriculture/property-inspections/${id}/complete`)
      const updatedInspection = response.data
      setInspections(prev => prev.map(insp => insp.id === id ? updatedInspection : insp))
      return true
    } catch (err) {
      setError('Falha ao finalizar fiscalização')
      console.error('Error completing inspection:', err)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const addFinding = useCallback(async (inspectionId: string, finding: {
    category: 'ENVIRONMENTAL' | 'SANITARY' | 'LABOR' | 'LAND_USE' | 'PRODUCTION' | 'DOCUMENTATION'
    type: 'COMPLIANCE' | 'NON_COMPLIANCE' | 'OBSERVATION' | 'RECOMMENDATION'
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
    description: string
    legal_reference?: string
    corrective_action?: string
    deadline?: string
  }): Promise<boolean> => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.post(`/agriculture/property-inspections/${inspectionId}/findings`, finding)
      const updatedInspection = response.data
      setInspections(prev => prev.map(insp => insp.id === inspectionId ? updatedInspection : insp))
      return true
    } catch (err) {
      setError('Falha ao adicionar constatação')
      console.error('Error adding finding:', err)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const addEvidence = useCallback(async (inspectionId: string, findingId: string, evidence: {
    type: 'PHOTO' | 'VIDEO' | 'DOCUMENT' | 'SAMPLE'
    file_path: string
    description: string
    coordinates?: {
      latitude: number
      longitude: number
    }
  }): Promise<boolean> => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.post(`/agriculture/property-inspections/${inspectionId}/findings/${findingId}/evidence`, evidence)
      const updatedInspection = response.data
      setInspections(prev => prev.map(insp => insp.id === inspectionId ? updatedInspection : insp))
      return true
    } catch (err) {
      setError('Falha ao adicionar evidência')
      console.error('Error adding evidence:', err)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const addViolation = useCallback(async (inspectionId: string, violation: {
    type: 'ENVIRONMENTAL' | 'SANITARY' | 'LABOR' | 'ADMINISTRATIVE'
    code: string
    description: string
    severity: 'LIGHT' | 'SERIOUS' | 'VERY_SERIOUS'
    fine_amount?: number
    legal_basis: string
    corrective_measures: Array<{
      description: string
      deadline: string
    }>
  }): Promise<boolean> => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.post(`/agriculture/property-inspections/${inspectionId}/violations`, violation)
      const updatedInspection = response.data
      setInspections(prev => prev.map(insp => insp.id === inspectionId ? updatedInspection : insp))
      return true
    } catch (err) {
      setError('Falha ao adicionar infração')
      console.error('Error adding violation:', err)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const scheduleFollowUp = useCallback(async (inspectionId: string, followUp: {
    deadline: string
    type: 'DOCUMENT_REVIEW' | 'SITE_VISIT' | 'CORRECTIVE_VERIFICATION'
  }): Promise<boolean> => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.post(`/agriculture/property-inspections/${inspectionId}/follow-up`, followUp)
      const updatedInspection = response.data
      setInspections(prev => prev.map(insp => insp.id === inspectionId ? updatedInspection : insp))
      return true
    } catch (err) {
      setError('Falha ao agendar acompanhamento')
      console.error('Error scheduling follow-up:', err)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const generateReport = useCallback(async (inspectionId: string, isPublic: boolean = false): Promise<boolean> => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.post(`/agriculture/property-inspections/${inspectionId}/report`, { public: isPublic })
      const updatedInspection = response.data
      setInspections(prev => prev.map(insp => insp.id === inspectionId ? updatedInspection : insp))
      return true
    } catch (err) {
      setError('Falha ao gerar relatório')
      console.error('Error generating report:', err)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const getInspectionsByProperty = useCallback((propertyId: string) => {
    return inspections.filter(inspection => inspection.property.id === propertyId)
  }, [inspections])

  const getInspectionsByInspector = useCallback((inspectorId: string) => {
    return inspections.filter(inspection => inspection.inspector.id === inspectorId)
  }, [inspections])

  const getPendingInspections = useCallback(() => {
    return inspections.filter(inspection =>
      inspection.status === 'SCHEDULED' || inspection.status === 'IN_PROGRESS'
    )
  }, [inspections])

  const getInspectionsWithViolations = useCallback(() => {
    return inspections.filter(inspection => inspection.violations.length > 0)
  }, [inspections])

  useEffect(() => {
    fetchInspections()
  }, [fetchInspections])

  return {
    inspections,
    loading,
    error,
    fetchInspections,
    getInspectionById,
    createInspection,
    updateInspection,
    deleteInspection,
    startInspection,
    completeInspection,
    addFinding,
    addEvidence,
    addViolation,
    scheduleFollowUp,
    generateReport,
    getInspectionsByProperty,
    getInspectionsByInspector,
    getPendingInspections,
    getInspectionsWithViolations
  }
}