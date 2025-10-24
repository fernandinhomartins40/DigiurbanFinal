import { useState, useEffect, useCallback } from 'react'
import { apiClient } from '@/lib/api'

export interface PhytosanitaryControl {
  id: string
  protocol: string
  type: 'DISEASE_CONTROL' | 'PEST_MANAGEMENT' | 'WEED_CONTROL' | 'PREVENTION' | 'QUARANTINE' | 'SURVEILLANCE' | 'TREATMENT'
  status: 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED' | 'SUSPENDED' | 'CANCELLED'
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'EMERGENCY'
  location: {
    property_id: string
    property_name: string
    coordinates: {
      latitude: number
      longitude: number
    }
    affected_area: number
    total_area: number
    municipality: string
    district: string
  }
  producer: {
    id: string
    name: string
    contact: {
      phone: string
      email: string
    }
  }
  target: {
    organism_type: 'DISEASE' | 'PEST' | 'WEED' | 'VIRUS' | 'BACTERIA' | 'FUNGUS' | 'NEMATODE'
    scientific_name: string
    common_name: string
    classification: {
      kingdom: string
      phylum: string
      class: string
      order: string
      family: string
      genus: string
      species: string
    }
    risk_level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
    quarantine_status: boolean
  }
  crops_affected: Array<{
    crop_name: string
    variety: string
    area_affected: number
    growth_stage: string
    damage_level: 'LIGHT' | 'MODERATE' | 'SEVERE' | 'CRITICAL'
    economic_impact: number
  }>
  detection: {
    detection_date: string
    detection_method: 'VISUAL_INSPECTION' | 'LABORATORY_ANALYSIS' | 'TRAP_MONITORING' | 'REMOTE_SENSING' | 'PRODUCER_REPORT'
    detected_by: string
    severity_assessment: {
      incidence: number
      severity: number
      distribution: 'FOCAL' | 'SCATTERED' | 'WIDESPREAD'
    }
    symptoms: Array<{
      description: string
      affected_part: 'LEAF' | 'STEM' | 'ROOT' | 'FRUIT' | 'FLOWER' | 'SEED'
      stage: 'INITIAL' | 'INTERMEDIATE' | 'ADVANCED'
    }>
    laboratory_results?: {
      analysis_date: string
      laboratory: string
      confirmation: boolean
      methodology: string
      results: string
    }
  }
  control_measures: Array<{
    id: string
    type: 'CHEMICAL' | 'BIOLOGICAL' | 'CULTURAL' | 'MECHANICAL' | 'INTEGRATED' | 'QUARANTINE'
    method: string
    description: string
    products_used: Array<{
      name: string
      active_ingredient: string
      concentration: string
      dosage: string
      application_method: 'SPRAY' | 'SOIL_APPLICATION' | 'SEED_TREATMENT' | 'FUMIGATION' | 'INJECTION'
      frequency: string
      safety_interval: number
    }>
    execution: {
      start_date: string
      end_date?: string
      responsible_technician: string
      weather_conditions: {
        temperature: number
        humidity: number
        wind_speed: number
        precipitation: boolean
      }
      equipment_used: Array<string>
    }
    monitoring: {
      evaluation_dates: Array<string>
      effectiveness: number
      side_effects: Array<string>
      resistance_signs: boolean
    }
    costs: {
      products: number
      labor: number
      equipment: number
      total: number
    }
  }>
  prevention_measures: Array<{
    type: 'CROP_ROTATION' | 'RESISTANT_VARIETIES' | 'SANITATION' | 'BIOLOGICAL_CONTROL' | 'MONITORING' | 'QUARANTINE'
    description: string
    implementation_date: string
    responsible: string
    expected_effectiveness: number
  }>
  monitoring_schedule: {
    frequency: 'DAILY' | 'WEEKLY' | 'BIWEEKLY' | 'MONTHLY'
    inspection_points: Array<{
      coordinates: {
        latitude: number
        longitude: number
      }
      description: string
    }>
    parameters: Array<{
      parameter: string
      method: string
      frequency: string
    }>
  }
  results: {
    effectiveness: number
    area_recovered: number
    damage_prevented: number
    economic_savings: number
    lessons_learned: Array<string>
    recommendations: Array<string>
  }
  compliance: {
    environmental_regulations: boolean
    safety_protocols: boolean
    worker_protection: boolean
    documentation_complete: boolean
    certifications_maintained: boolean
  }
  reports: Array<{
    date: string
    type: 'INITIAL' | 'PROGRESS' | 'FINAL' | 'EMERGENCY'
    file_path: string
    shared_with: Array<'PRODUCER' | 'AUTHORITIES' | 'COOPERATIVES' | 'NEIGHBORS'>
  }>
  alerts: Array<{
    date: string
    type: 'NEW_DETECTION' | 'SPREAD_WARNING' | 'RESISTANCE_ALERT' | 'QUARANTINE_BREACH'
    message: string
    recipients: Array<string>
    urgency: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  }>
  created_at: string
  updated_at: string
}

export interface CreatePhytosanitaryControlData {
  type: 'DISEASE_CONTROL' | 'PEST_MANAGEMENT' | 'WEED_CONTROL' | 'PREVENTION' | 'QUARANTINE' | 'SURVEILLANCE' | 'TREATMENT'
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'EMERGENCY'
  property_id: string
  affected_area: number
  target: {
    organism_type: 'DISEASE' | 'PEST' | 'WEED' | 'VIRUS' | 'BACTERIA' | 'FUNGUS' | 'NEMATODE'
    scientific_name: string
    common_name: string
    risk_level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
    quarantine_status: boolean
  }
  crops_affected: Array<{
    crop_name: string
    variety: string
    area_affected: number
    growth_stage: string
    damage_level: 'LIGHT' | 'MODERATE' | 'SEVERE' | 'CRITICAL'
    economic_impact: number
  }>
  detection: {
    detection_date: string
    detection_method: 'VISUAL_INSPECTION' | 'LABORATORY_ANALYSIS' | 'TRAP_MONITORING' | 'REMOTE_SENSING' | 'PRODUCER_REPORT'
    detected_by: string
    severity_assessment: {
      incidence: number
      severity: number
      distribution: 'FOCAL' | 'SCATTERED' | 'WIDESPREAD'
    }
    symptoms: Array<{
      description: string
      affected_part: 'LEAF' | 'STEM' | 'ROOT' | 'FRUIT' | 'FLOWER' | 'SEED'
      stage: 'INITIAL' | 'INTERMEDIATE' | 'ADVANCED'
    }>
  }
}

export interface PhytosanitaryControlFilters {
  protocol?: string
  type?: 'DISEASE_CONTROL' | 'PEST_MANAGEMENT' | 'WEED_CONTROL' | 'PREVENTION' | 'QUARANTINE' | 'SURVEILLANCE' | 'TREATMENT'
  status?: 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED' | 'SUSPENDED' | 'CANCELLED'
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'EMERGENCY'
  property_id?: string
  producer_id?: string
  organism_type?: 'DISEASE' | 'PEST' | 'WEED' | 'VIRUS' | 'BACTERIA' | 'FUNGUS' | 'NEMATODE'
  scientific_name?: string
  common_name?: string
  risk_level?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  quarantine_status?: boolean
  municipality?: string
  crop_name?: string
  damage_level?: 'LIGHT' | 'MODERATE' | 'SEVERE' | 'CRITICAL'
  detection_from?: string
  detection_to?: string
  created_from?: string
  created_to?: string
}

export const usePhytosanitaryControl = () => {
  const [controls, setControls] = useState<PhytosanitaryControl[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchControls = useCallback(async (filters?: PhytosanitaryControlFilters) => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.get('/agriculture/phytosanitary-control', { params: filters })
      setControls(response.data)
    } catch (err) {
      setError('Falha ao carregar controles fitossanitários')
      console.error('Error fetching phytosanitary controls:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  const getControlById = useCallback(async (id: string): Promise<PhytosanitaryControl | null> => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.get(`/agriculture/phytosanitary-control/${id}`)
      return response.data
    } catch (err) {
      setError('Falha ao carregar controle fitossanitário')
      console.error('Error fetching phytosanitary control:', err)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const createControl = useCallback(async (data: CreatePhytosanitaryControlData): Promise<PhytosanitaryControl | null> => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.post('/agriculture/phytosanitary-control', data)
      const newControl = response.data
      setControls(prev => [...prev, newControl])
      return newControl
    } catch (err) {
      setError('Falha ao criar controle fitossanitário')
      console.error('Error creating phytosanitary control:', err)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const updateControl = useCallback(async (id: string, data: Partial<CreatePhytosanitaryControlData>): Promise<PhytosanitaryControl | null> => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.put(`/agriculture/phytosanitary-control/${id}`, data)
      const updatedControl = response.data
      setControls(prev => prev.map(ctrl => ctrl.id === id ? updatedControl : ctrl))
      return updatedControl
    } catch (err) {
      setError('Falha ao atualizar controle fitossanitário')
      console.error('Error updating phytosanitary control:', err)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const deleteControl = useCallback(async (id: string): Promise<boolean> => {
    try {
      setLoading(true)
      setError(null)
      await apiClient.delete(`/agriculture/phytosanitary-control/${id}`)
      setControls(prev => prev.filter(ctrl => ctrl.id !== id))
      return true
    } catch (err) {
      setError('Falha ao excluir controle fitossanitário')
      console.error('Error deleting phytosanitary control:', err)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const updateStatus = useCallback(async (id: string, status: 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED' | 'SUSPENDED' | 'CANCELLED'): Promise<boolean> => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.patch(`/agriculture/phytosanitary-control/${id}/status`, { status })
      const updatedControl = response.data
      setControls(prev => prev.map(ctrl => ctrl.id === id ? updatedControl : ctrl))
      return true
    } catch (err) {
      setError('Falha ao atualizar status do controle')
      console.error('Error updating control status:', err)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const addControlMeasure = useCallback(async (controlId: string, measure: {
    type: 'CHEMICAL' | 'BIOLOGICAL' | 'CULTURAL' | 'MECHANICAL' | 'INTEGRATED' | 'QUARANTINE'
    method: string
    description: string
    products_used: Array<{
      name: string
      active_ingredient: string
      concentration: string
      dosage: string
      application_method: 'SPRAY' | 'SOIL_APPLICATION' | 'SEED_TREATMENT' | 'FUMIGATION' | 'INJECTION'
      frequency: string
      safety_interval: number
    }>
    responsible_technician: string
  }): Promise<boolean> => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.post(`/agriculture/phytosanitary-control/${controlId}/measures`, measure)
      const updatedControl = response.data
      setControls(prev => prev.map(ctrl => ctrl.id === controlId ? updatedControl : ctrl))
      return true
    } catch (err) {
      setError('Falha ao adicionar medida de controle')
      console.error('Error adding control measure:', err)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const recordApplication = useCallback(async (controlId: string, measureId: string, application: {
    start_date: string
    end_date?: string
    weather_conditions: {
      temperature: number
      humidity: number
      wind_speed: number
      precipitation: boolean
    }
    equipment_used: Array<string>
    application_area: number
  }): Promise<boolean> => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.post(`/agriculture/phytosanitary-control/${controlId}/measures/${measureId}/application`, application)
      const updatedControl = response.data
      setControls(prev => prev.map(ctrl => ctrl.id === controlId ? updatedControl : ctrl))
      return true
    } catch (err) {
      setError('Falha ao registrar aplicação')
      console.error('Error recording application:', err)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const addMonitoringResult = useCallback(async (controlId: string, measureId: string, monitoring: {
    evaluation_date: string
    effectiveness: number
    side_effects: Array<string>
    resistance_signs: boolean
    observations: string
  }): Promise<boolean> => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.post(`/agriculture/phytosanitary-control/${controlId}/measures/${measureId}/monitoring`, monitoring)
      const updatedControl = response.data
      setControls(prev => prev.map(ctrl => ctrl.id === controlId ? updatedControl : ctrl))
      return true
    } catch (err) {
      setError('Falha ao adicionar resultado de monitoramento')
      console.error('Error adding monitoring result:', err)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const addPreventionMeasure = useCallback(async (controlId: string, prevention: {
    type: 'CROP_ROTATION' | 'RESISTANT_VARIETIES' | 'SANITATION' | 'BIOLOGICAL_CONTROL' | 'MONITORING' | 'QUARANTINE'
    description: string
    implementation_date: string
    responsible: string
    expected_effectiveness: number
  }): Promise<boolean> => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.post(`/agriculture/phytosanitary-control/${controlId}/prevention`, prevention)
      const updatedControl = response.data
      setControls(prev => prev.map(ctrl => ctrl.id === controlId ? updatedControl : ctrl))
      return true
    } catch (err) {
      setError('Falha ao adicionar medida preventiva')
      console.error('Error adding prevention measure:', err)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const sendAlert = useCallback(async (controlId: string, alert: {
    type: 'NEW_DETECTION' | 'SPREAD_WARNING' | 'RESISTANCE_ALERT' | 'QUARANTINE_BREACH'
    message: string
    recipients: Array<string>
    urgency: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  }): Promise<boolean> => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.post(`/agriculture/phytosanitary-control/${controlId}/alerts`, alert)
      const updatedControl = response.data
      setControls(prev => prev.map(ctrl => ctrl.id === controlId ? updatedControl : ctrl))
      return true
    } catch (err) {
      setError('Falha ao enviar alerta')
      console.error('Error sending alert:', err)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const generateReport = useCallback(async (controlId: string, type: 'INITIAL' | 'PROGRESS' | 'FINAL' | 'EMERGENCY', shareWith: Array<'PRODUCER' | 'AUTHORITIES' | 'COOPERATIVES' | 'NEIGHBORS'>): Promise<boolean> => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.post(`/agriculture/phytosanitary-control/${controlId}/reports`, { type, shared_with: shareWith })
      const updatedControl = response.data
      setControls(prev => prev.map(ctrl => ctrl.id === controlId ? updatedControl : ctrl))
      return true
    } catch (err) {
      setError('Falha ao gerar relatório')
      console.error('Error generating report:', err)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const getControlsByProperty = useCallback((propertyId: string) => {
    return controls.filter(control => control.location.property_id === propertyId)
  }, [controls])

  const getControlsByOrganism = useCallback((scientificName: string) => {
    return controls.filter(control => control.target.scientific_name === scientificName)
  }, [controls])

  const getActiveControls = useCallback(() => {
    return controls.filter(control =>
      control.status === 'PLANNED' || control.status === 'IN_PROGRESS'
    )
  }, [controls])

  const getQuarantineControls = useCallback(() => {
    return controls.filter(control => control.target.quarantine_status)
  }, [controls])

  const getEmergencyControls = useCallback(() => {
    return controls.filter(control => control.priority === 'EMERGENCY')
  }, [controls])

  const calculateTotalArea = useCallback(() => {
    return controls.reduce((total, control) => total + control.location.affected_area, 0)
  }, [controls])

  useEffect(() => {
    fetchControls()
  }, [fetchControls])

  return {
    controls,
    loading,
    error,
    fetchControls,
    getControlById,
    createControl,
    updateControl,
    deleteControl,
    updateStatus,
    addControlMeasure,
    recordApplication,
    addMonitoringResult,
    addPreventionMeasure,
    sendAlert,
    generateReport,
    getControlsByProperty,
    getControlsByOrganism,
    getActiveControls,
    getQuarantineControls,
    getEmergencyControls,
    calculateTotalArea
  }
}