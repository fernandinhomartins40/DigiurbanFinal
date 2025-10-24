import { useState, useEffect, useCallback } from 'react'
import { apiClient } from '@/lib/api'

export interface HealthInspection {
  id: string
  protocol: string
  type: 'ROUTINE' | 'COMPLAINT' | 'LICENSING' | 'FOLLOW_UP' | 'EMERGENCY' | 'SURVEILLANCE'
  establishment: {
    name: string
    business_type: 'RESTAURANT' | 'MARKET' | 'PHARMACY' | 'CLINIC' | 'HOSPITAL' | 'LABORATORY' | 'FOOD_INDUSTRY' | 'OTHER'
    cnpj?: string
    owner_name: string
    contact: {
      phone: string
      email?: string
    }
    address: {
      street: string
      number: string
      neighborhood: string
      city: string
      state: string
      zipcode: string
    }
  }
  inspection_details: {
    inspection_date: string
    inspector: {
      name: string
      registration: string
      role: 'SANITARY_INSPECTOR' | 'VETERINARIAN' | 'PHARMACIST' | 'NURSE' | 'DOCTOR'
    }
    duration: number
    areas_inspected: Array<string>
    documentation_reviewed: Array<string>
  }
  checklist: {
    categories: Array<{
      category: 'HYGIENE' | 'STRUCTURE' | 'EQUIPMENT' | 'PROCEDURES' | 'DOCUMENTATION' | 'PERSONNEL'
      items: Array<{
        item: string
        compliant: boolean
        observation?: string
        critical: boolean
      }>
      compliance_percentage: number
    }>
    overall_compliance: number
  }
  violations: Array<{
    violation_code: string
    description: string
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
    legal_reference: string
    corrective_action_required: string
    deadline: string
    fine_amount?: number
  }>
  recommendations: Array<{
    type: 'IMMEDIATE' | 'SHORT_TERM' | 'LONG_TERM'
    description: string
    priority: 'LOW' | 'MEDIUM' | 'HIGH'
    implementation_deadline?: string
  }>
  samples_collected: Array<{
    sample_type: 'FOOD' | 'WATER' | 'SURFACE' | 'AIR' | 'PRODUCT'
    collection_point: string
    analysis_requested: Array<string>
    laboratory: string
    result?: {
      date: string
      status: 'SATISFACTORY' | 'UNSATISFACTORY' | 'PENDING'
      details: string
    }
  }>
  follow_up: {
    required: boolean
    type?: 'REINSPECTION' | 'DOCUMENT_REVIEW' | 'SAMPLE_COLLECTION'
    scheduled_date?: string
    responsible_inspector?: string
  }
  outcome: {
    classification: 'SATISFACTORY' | 'SATISFACTORY_WITH_RESTRICTIONS' | 'UNSATISFACTORY' | 'INTERDICTED'
    license_status: 'GRANTED' | 'RENEWED' | 'SUSPENDED' | 'REVOKED' | 'PENDING'
    closure_required: boolean
    closure_date?: string
    reopening_conditions?: Array<string>
  }
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'PENDING_REVIEW'
  created_at: string
  updated_at: string
}

export interface CreateHealthInspectionData {
  type: 'ROUTINE' | 'COMPLAINT' | 'LICENSING' | 'FOLLOW_UP' | 'EMERGENCY' | 'SURVEILLANCE'
  establishment: {
    name: string
    business_type: 'RESTAURANT' | 'MARKET' | 'PHARMACY' | 'CLINIC' | 'HOSPITAL' | 'LABORATORY' | 'FOOD_INDUSTRY' | 'OTHER'
    cnpj?: string
    owner_name: string
    contact: {
      phone: string
      email?: string
    }
    address: {
      street: string
      number: string
      neighborhood: string
      city: string
      state: string
      zipcode: string
    }
  }
  inspection_details: {
    inspection_date: string
    inspector: {
      name: string
      registration: string
      role: 'SANITARY_INSPECTOR' | 'VETERINARIAN' | 'PHARMACIST' | 'NURSE' | 'DOCTOR'
    }
    areas_inspected: Array<string>
    documentation_reviewed: Array<string>
  }
}

export interface HealthInspectionFilters {
  protocol?: string
  type?: 'ROUTINE' | 'COMPLAINT' | 'LICENSING' | 'FOLLOW_UP' | 'EMERGENCY' | 'SURVEILLANCE'
  establishment_name?: string
  business_type?: 'RESTAURANT' | 'MARKET' | 'PHARMACY' | 'CLINIC' | 'HOSPITAL' | 'LABORATORY' | 'FOOD_INDUSTRY' | 'OTHER'
  inspector_name?: string
  status?: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'PENDING_REVIEW'
  outcome_classification?: 'SATISFACTORY' | 'SATISFACTORY_WITH_RESTRICTIONS' | 'UNSATISFACTORY' | 'INTERDICTED'
  license_status?: 'GRANTED' | 'RENEWED' | 'SUSPENDED' | 'REVOKED' | 'PENDING'
  neighborhood?: string
  has_violations?: boolean
  violation_severity?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  compliance_min?: number
  compliance_max?: number
  inspection_date_from?: string
  inspection_date_to?: string
  follow_up_required?: boolean
  created_from?: string
  created_to?: string
}

export const useHealthInspection = () => {
  const [inspections, setInspections] = useState<HealthInspection[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchInspections = useCallback(async (filters?: HealthInspectionFilters) => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.get('/health/inspections', { params: filters })
      setInspections(response.data)
    } catch (err) {
      setError('Falha ao carregar inspeções sanitárias')
      console.error('Error fetching health inspections:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  const getInspectionById = useCallback(async (id: string): Promise<HealthInspection | null> => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.get(`/health/inspections/${id}`)
      return response.data
    } catch (err) {
      setError('Falha ao carregar inspeção sanitária')
      console.error('Error fetching health inspection:', err)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const createInspection = useCallback(async (data: CreateHealthInspectionData): Promise<HealthInspection | null> => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.post('/health/inspections', data)
      const newInspection = response.data
      setInspections(prev => [...prev, newInspection])
      return newInspection
    } catch (err) {
      setError('Falha ao criar inspeção sanitária')
      console.error('Error creating health inspection:', err)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const updateInspection = useCallback(async (id: string, data: Partial<CreateHealthInspectionData>): Promise<HealthInspection | null> => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.put(`/health/inspections/${id}`, data)
      const updatedInspection = response.data
      setInspections(prev => prev.map(insp => insp.id === id ? updatedInspection : insp))
      return updatedInspection
    } catch (err) {
      setError('Falha ao atualizar inspeção sanitária')
      console.error('Error updating health inspection:', err)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const updateStatus = useCallback(async (id: string, status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'PENDING_REVIEW'): Promise<boolean> => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.patch(`/health/inspections/${id}/status`, { status })
      const updatedInspection = response.data
      setInspections(prev => prev.map(insp => insp.id === id ? updatedInspection : insp))
      return true
    } catch (err) {
      setError('Falha ao atualizar status da inspeção')
      console.error('Error updating inspection status:', err)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const recordChecklist = useCallback(async (inspectionId: string, checklist: {
    categories: Array<{
      category: 'HYGIENE' | 'STRUCTURE' | 'EQUIPMENT' | 'PROCEDURES' | 'DOCUMENTATION' | 'PERSONNEL'
      items: Array<{
        item: string
        compliant: boolean
        observation?: string
        critical: boolean
      }>
    }>
  }): Promise<boolean> => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.post(`/health/inspections/${inspectionId}/checklist`, checklist)
      const updatedInspection = response.data
      setInspections(prev => prev.map(insp => insp.id === inspectionId ? updatedInspection : insp))
      return true
    } catch (err) {
      setError('Falha ao registrar checklist')
      console.error('Error recording checklist:', err)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const addViolation = useCallback(async (inspectionId: string, violation: {
    violation_code: string
    description: string
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
    legal_reference: string
    corrective_action_required: string
    deadline: string
    fine_amount?: number
  }): Promise<boolean> => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.post(`/health/inspections/${inspectionId}/violations`, violation)
      const updatedInspection = response.data
      setInspections(prev => prev.map(insp => insp.id === inspectionId ? updatedInspection : insp))
      return true
    } catch (err) {
      setError('Falha ao adicionar violação')
      console.error('Error adding violation:', err)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const collectSample = useCallback(async (inspectionId: string, sample: {
    sample_type: 'FOOD' | 'WATER' | 'SURFACE' | 'AIR' | 'PRODUCT'
    collection_point: string
    analysis_requested: Array<string>
    laboratory: string
  }): Promise<boolean> => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.post(`/health/inspections/${inspectionId}/samples`, sample)
      const updatedInspection = response.data
      setInspections(prev => prev.map(insp => insp.id === inspectionId ? updatedInspection : insp))
      return true
    } catch (err) {
      setError('Falha ao coletar amostra')
      console.error('Error collecting sample:', err)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const recordSampleResult = useCallback(async (inspectionId: string, sampleIndex: number, result: {
    date: string
    status: 'SATISFACTORY' | 'UNSATISFACTORY' | 'PENDING'
    details: string
  }): Promise<boolean> => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.patch(`/health/inspections/${inspectionId}/samples/${sampleIndex}/result`, result)
      const updatedInspection = response.data
      setInspections(prev => prev.map(insp => insp.id === inspectionId ? updatedInspection : insp))
      return true
    } catch (err) {
      setError('Falha ao registrar resultado da amostra')
      console.error('Error recording sample result:', err)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const finalizeInspection = useCallback(async (inspectionId: string, outcome: {
    classification: 'SATISFACTORY' | 'SATISFACTORY_WITH_RESTRICTIONS' | 'UNSATISFACTORY' | 'INTERDICTED'
    license_status: 'GRANTED' | 'RENEWED' | 'SUSPENDED' | 'REVOKED' | 'PENDING'
    closure_required: boolean
    closure_date?: string
    reopening_conditions?: Array<string>
  }): Promise<boolean> => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.post(`/health/inspections/${inspectionId}/finalize`, outcome)
      const updatedInspection = response.data
      setInspections(prev => prev.map(insp => insp.id === inspectionId ? updatedInspection : insp))
      return true
    } catch (err) {
      setError('Falha ao finalizar inspeção')
      console.error('Error finalizing inspection:', err)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const scheduleFollowUp = useCallback(async (inspectionId: string, followUp: {
    type: 'REINSPECTION' | 'DOCUMENT_REVIEW' | 'SAMPLE_COLLECTION'
    scheduled_date: string
    responsible_inspector: string
  }): Promise<boolean> => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.post(`/health/inspections/${inspectionId}/follow-up`, followUp)
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

  const getScheduledInspections = useCallback(() => {
    return inspections.filter(insp => insp.status === 'SCHEDULED')
  }, [inspections])

  const getInspectionsByBusinessType = useCallback((businessType: 'RESTAURANT' | 'MARKET' | 'PHARMACY' | 'CLINIC' | 'HOSPITAL' | 'LABORATORY' | 'FOOD_INDUSTRY' | 'OTHER') => {
    return inspections.filter(insp => insp.establishment.business_type === businessType)
  }, [inspections])

  const getInspectionsWithViolations = useCallback(() => {
    return inspections.filter(insp => insp.violations.length > 0)
  }, [inspections])

  const getCriticalViolations = useCallback(() => {
    return inspections.filter(insp =>
      insp.violations.some(violation => violation.severity === 'CRITICAL')
    )
  }, [inspections])

  const getInspectionsRequiringFollowUp = useCallback(() => {
    return inspections.filter(insp => insp.follow_up.required)
  }, [inspections])

  const getInterdictedEstablishments = useCallback(() => {
    return inspections.filter(insp => insp.outcome.classification === 'INTERDICTED')
  }, [inspections])

  const getAverageCompliance = useCallback(() => {
    const completedInspections = inspections.filter(insp => insp.status === 'COMPLETED')
    if (completedInspections.length === 0) return 0

    const totalCompliance = completedInspections.reduce((sum, insp) => sum + insp.checklist.overall_compliance, 0)
    return totalCompliance / completedInspections.length
  }, [inspections])

  const getInspectionsByInspector = useCallback((inspectorName: string) => {
    return inspections.filter(insp =>
      insp.inspection_details.inspector.name.toLowerCase().includes(inspectorName.toLowerCase())
    )
  }, [inspections])

  const getPendingSampleResults = useCallback(() => {
    return inspections.filter(insp =>
      insp.samples_collected.some(sample => !sample.result || sample.result.status === 'PENDING')
    )
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
    updateStatus,
    recordChecklist,
    addViolation,
    collectSample,
    recordSampleResult,
    finalizeInspection,
    scheduleFollowUp,
    getScheduledInspections,
    getInspectionsByBusinessType,
    getInspectionsWithViolations,
    getCriticalViolations,
    getInspectionsRequiringFollowUp,
    getInterdictedEstablishments,
    getAverageCompliance,
    getInspectionsByInspector,
    getPendingSampleResults
  }
}