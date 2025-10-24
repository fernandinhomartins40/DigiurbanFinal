import { useState, useEffect, useCallback } from 'react'
import { apiClient } from '@/lib/api'

export interface HealthCenter {
  id: string
  cnes_code: string
  name: string
  type: 'UBS' | 'UPA' | 'HOSPITAL' | 'CLINIC' | 'EMERGENCY' | 'SPECIALTY' | 'LABORATORY' | 'PHARMACY' | 'DENTAL'
  level: 'PRIMARY' | 'SECONDARY' | 'TERTIARY' | 'QUATERNARY'
  status: 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE' | 'CONSTRUCTION' | 'CLOSED'
  accreditation: {
    sus_enabled: boolean
    accreditation_level: 'BASIC' | 'STANDARD' | 'ADVANCED' | 'EXCELLENCE'
    certifications: Array<{
      type: 'ISO' | 'ANVISA' | 'CRM' | 'COREN' | 'ONA' | 'PALC'
      number: string
      issuer: string
      valid_until: string
    }>
    last_inspection: string
    next_inspection: string
  }
  location: {
    address: {
      street: string
      number: string
      complement?: string
      neighborhood: string
      city: string
      state: string
      zipcode: string
    }
    coordinates: {
      latitude: number
      longitude: number
    }
    coverage_area: {
      neighborhoods: Array<string>
      population_served: number
      radius_km: number
    }
  }
  contact: {
    phone: string
    emergency_phone?: string
    email: string
    website?: string
    social_media?: Array<{
      platform: string
      handle: string
    }>
  }
  administration: {
    director_name: string
    director_cpf: string
    director_crm?: string
    management_type: 'DIRECT' | 'CONTRACT' | 'FOUNDATION' | 'ORGANIZATION' | 'PARTNERSHIP'
    managing_entity?: string
  }
  infrastructure: {
    total_area: number
    built_area: number
    consultation_rooms: number
    emergency_rooms: number
    inpatient_beds: number
    icu_beds: number
    operating_rooms: number
    parking_spaces: number
    accessibility: {
      wheelchair_access: boolean
      elevator: boolean
      tactile_flooring: boolean
      sign_language_interpreter: boolean
      braille_signage: boolean
    }
  }
  services: {
    primary_care: Array<'GENERAL_MEDICINE' | 'PEDIATRICS' | 'GYNECOLOGY' | 'NURSING' | 'DENTISTRY' | 'VACCINATION'>
    specialties: Array<'CARDIOLOGY' | 'ORTHOPEDICS' | 'DERMATOLOGY' | 'OPHTHALMOLOGY' | 'NEUROLOGY' | 'PSYCHIATRY' | 'ENDOCRINOLOGY'>
    diagnostic: Array<'X_RAY' | 'ULTRASOUND' | 'CT_SCAN' | 'MRI' | 'BLOOD_TESTS' | 'ECG' | 'ENDOSCOPY'>
    emergency_services: Array<'TRAUMA' | 'CARDIAC' | 'OBSTETRIC' | 'PEDIATRIC' | 'PSYCHIATRIC' | 'TOXICOLOGY'>
    support_services: Array<'PHARMACY' | 'LABORATORY' | 'PHYSIOTHERAPY' | 'PSYCHOLOGY' | 'SOCIAL_SERVICE' | 'NUTRITION'>
  }
  operating_hours: {
    regular_hours: Array<{
      day: 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY'
      opening_time: string
      closing_time: string
      closed: boolean
    }>
    emergency_24h: boolean
    holiday_operation: boolean
    seasonal_variations: Array<{
      period: string
      modifications: string
    }>
  }
  staff: {
    total_employees: number
    medical_staff: {
      doctors: number
      nurses: number
      technicians: number
      specialists: number
    }
    administrative_staff: number
    support_staff: number
    volunteers: number
    staff_distribution: Array<{
      profession: string
      count: number
      shift: 'MORNING' | 'AFTERNOON' | 'NIGHT' | 'FULL_TIME'
    }>
  }
  equipment: Array<{
    name: string
    type: 'DIAGNOSTIC' | 'THERAPEUTIC' | 'LIFE_SUPPORT' | 'SURGICAL' | 'LABORATORY'
    quantity: number
    status: 'OPERATIONAL' | 'MAINTENANCE' | 'BROKEN' | 'CALIBRATION'
    acquisition_date: string
    last_maintenance: string
    warranty_expires: string
  }>
  capacity: {
    daily_consultations: number
    monthly_consultations: number
    annual_capacity: number
    current_utilization: number
    waiting_list_size: number
    average_waiting_time: number
  }
  quality_indicators: {
    patient_satisfaction: number
    mortality_rate: number
    infection_rate: number
    readmission_rate: number
    average_length_of_stay: number
    complaint_resolution_time: number
  }
  financial: {
    annual_budget: number
    revenue_sources: Array<{
      source: 'SUS' | 'PRIVATE' | 'INSURANCE' | 'GOVERNMENT' | 'DONATIONS'
      amount: number
      percentage: number
    }>
    operational_costs: {
      personnel: number
      equipment: number
      supplies: number
      utilities: number
      maintenance: number
      others: number
    }
  }
  programs: Array<{
    name: string
    type: 'PREVENTION' | 'TREATMENT' | 'REHABILITATION' | 'PROMOTION'
    target_population: string
    start_date: string
    status: 'ACTIVE' | 'INACTIVE' | 'COMPLETED'
    participants: number
    budget: number
  }>
  statistics: {
    monthly_patients: number
    annual_patients: number
    emergency_cases: number
    births: number
    deaths: number
    vaccinations: number
    surgeries: number
    exams: number
  }
  compliance: {
    anvisa_compliance: boolean
    vigilancia_sanitaria: boolean
    bombeiros_approval: boolean
    environmental_license: boolean
    waste_management_plan: boolean
    infection_control_plan: boolean
  }
  emergency_preparedness: {
    disaster_plan: boolean
    evacuation_plan: boolean
    backup_power: boolean
    emergency_supplies: number
    staff_training_updated: boolean
    communication_system: boolean
  }
  created_at: string
  updated_at: string
}

export interface CreateHealthCenterData {
  name: string
  type: 'UBS' | 'UPA' | 'HOSPITAL' | 'CLINIC' | 'EMERGENCY' | 'SPECIALTY' | 'LABORATORY' | 'PHARMACY' | 'DENTAL'
  level: 'PRIMARY' | 'SECONDARY' | 'TERTIARY' | 'QUATERNARY'
  location: {
    address: {
      street: string
      number: string
      complement?: string
      neighborhood: string
      city: string
      state: string
      zipcode: string
    }
    coordinates: {
      latitude: number
      longitude: number
    }
    coverage_area: {
      neighborhoods: Array<string>
      population_served: number
      radius_km: number
    }
  }
  contact: {
    phone: string
    emergency_phone?: string
    email: string
    website?: string
  }
  administration: {
    director_name: string
    director_cpf: string
    director_crm?: string
    management_type: 'DIRECT' | 'CONTRACT' | 'FOUNDATION' | 'ORGANIZATION' | 'PARTNERSHIP'
    managing_entity?: string
  }
  infrastructure: {
    total_area: number
    built_area: number
    consultation_rooms: number
    emergency_rooms: number
    inpatient_beds: number
    icu_beds: number
    operating_rooms: number
    parking_spaces: number
  }
  services: {
    primary_care: Array<'GENERAL_MEDICINE' | 'PEDIATRICS' | 'GYNECOLOGY' | 'NURSING' | 'DENTISTRY' | 'VACCINATION'>
    specialties: Array<'CARDIOLOGY' | 'ORTHOPEDICS' | 'DERMATOLOGY' | 'OPHTHALMOLOGY' | 'NEUROLOGY' | 'PSYCHIATRY' | 'ENDOCRINOLOGY'>
    diagnostic: Array<'X_RAY' | 'ULTRASOUND' | 'CT_SCAN' | 'MRI' | 'BLOOD_TESTS' | 'ECG' | 'ENDOSCOPY'>
  }
  operating_hours: {
    regular_hours: Array<{
      day: 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY'
      opening_time: string
      closing_time: string
      closed: boolean
    }>
    emergency_24h: boolean
    holiday_operation: boolean
  }
  capacity: {
    daily_consultations: number
    monthly_consultations: number
    annual_capacity: number
  }
}

export interface HealthCenterFilters {
  name?: string
  cnes_code?: string
  type?: 'UBS' | 'UPA' | 'HOSPITAL' | 'CLINIC' | 'EMERGENCY' | 'SPECIALTY' | 'LABORATORY' | 'PHARMACY' | 'DENTAL'
  level?: 'PRIMARY' | 'SECONDARY' | 'TERTIARY' | 'QUATERNARY'
  status?: 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE' | 'CONSTRUCTION' | 'CLOSED'
  neighborhood?: string
  city?: string
  sus_enabled?: boolean
  emergency_24h?: boolean
  wheelchair_access?: boolean
  service?: string
  specialty?: string
  management_type?: 'DIRECT' | 'CONTRACT' | 'FOUNDATION' | 'ORGANIZATION' | 'PARTNERSHIP'
  min_capacity?: number
  max_capacity?: number
  min_satisfaction?: number
  created_from?: string
  created_to?: string
}

export const useHealthCenters = () => {
  const [healthCenters, setHealthCenters] = useState<HealthCenter[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchHealthCenters = useCallback(async (filters?: HealthCenterFilters) => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.get('/health/centers', { params: filters })
      setHealthCenters(response.data)
    } catch (err) {
      setError('Falha ao carregar unidades de saúde')
      console.error('Error fetching health centers:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  const getHealthCenterById = useCallback(async (id: string): Promise<HealthCenter | null> => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.get(`/health/centers/${id}`)
      return response.data
    } catch (err) {
      setError('Falha ao carregar unidade de saúde')
      console.error('Error fetching health center:', err)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const createHealthCenter = useCallback(async (data: CreateHealthCenterData): Promise<HealthCenter | null> => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.post('/health/centers', data)
      const newHealthCenter = response.data
      setHealthCenters(prev => [...prev, newHealthCenter])
      return newHealthCenter
    } catch (err) {
      setError('Falha ao criar unidade de saúde')
      console.error('Error creating health center:', err)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const updateHealthCenter = useCallback(async (id: string, data: Partial<CreateHealthCenterData>): Promise<HealthCenter | null> => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.put(`/health/centers/${id}`, data)
      const updatedHealthCenter = response.data
      setHealthCenters(prev => prev.map(center => center.id === id ? updatedHealthCenter : center))
      return updatedHealthCenter
    } catch (err) {
      setError('Falha ao atualizar unidade de saúde')
      console.error('Error updating health center:', err)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const deleteHealthCenter = useCallback(async (id: string): Promise<boolean> => {
    try {
      setLoading(true)
      setError(null)
      await apiClient.delete(`/health/centers/${id}`)
      setHealthCenters(prev => prev.filter(center => center.id !== id))
      return true
    } catch (err) {
      setError('Falha ao excluir unidade de saúde')
      console.error('Error deleting health center:', err)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const updateStatus = useCallback(async (id: string, status: 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE' | 'CLOSED'): Promise<boolean> => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.patch(`/health/centers/${id}/status`, { status })
      const updatedHealthCenter = response.data
      setHealthCenters(prev => prev.map(center => center.id === id ? updatedHealthCenter : center))
      return true
    } catch (err) {
      setError('Falha ao atualizar status da unidade')
      console.error('Error updating health center status:', err)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const addEquipment = useCallback(async (centerId: string, equipment: {
    name: string
    type: 'DIAGNOSTIC' | 'THERAPEUTIC' | 'LIFE_SUPPORT' | 'SURGICAL' | 'LABORATORY'
    quantity: number
    acquisition_date: string
    warranty_expires: string
  }): Promise<boolean> => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.post(`/health/centers/${centerId}/equipment`, equipment)
      const updatedHealthCenter = response.data
      setHealthCenters(prev => prev.map(center => center.id === centerId ? updatedHealthCenter : center))
      return true
    } catch (err) {
      setError('Falha ao adicionar equipamento')
      console.error('Error adding equipment:', err)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const updateEquipmentStatus = useCallback(async (centerId: string, equipmentName: string, status: 'OPERATIONAL' | 'MAINTENANCE' | 'BROKEN' | 'CALIBRATION'): Promise<boolean> => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.patch(`/health/centers/${centerId}/equipment/${equipmentName}/status`, { status })
      const updatedHealthCenter = response.data
      setHealthCenters(prev => prev.map(center => center.id === centerId ? updatedHealthCenter : center))
      return true
    } catch (err) {
      setError('Falha ao atualizar status do equipamento')
      console.error('Error updating equipment status:', err)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const updateCapacity = useCallback(async (centerId: string, capacity: {
    daily_consultations?: number
    current_utilization?: number
    waiting_list_size?: number
    average_waiting_time?: number
  }): Promise<boolean> => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.patch(`/health/centers/${centerId}/capacity`, capacity)
      const updatedHealthCenter = response.data
      setHealthCenters(prev => prev.map(center => center.id === centerId ? updatedHealthCenter : center))
      return true
    } catch (err) {
      setError('Falha ao atualizar capacidade')
      console.error('Error updating capacity:', err)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const updateQualityIndicators = useCallback(async (centerId: string, indicators: {
    patient_satisfaction?: number
    mortality_rate?: number
    infection_rate?: number
    readmission_rate?: number
    average_length_of_stay?: number
    complaint_resolution_time?: number
  }): Promise<boolean> => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.patch(`/health/centers/${centerId}/quality-indicators`, indicators)
      const updatedHealthCenter = response.data
      setHealthCenters(prev => prev.map(center => center.id === centerId ? updatedHealthCenter : center))
      return true
    } catch (err) {
      setError('Falha ao atualizar indicadores de qualidade')
      console.error('Error updating quality indicators:', err)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const recordStatistics = useCallback(async (centerId: string, statistics: {
    monthly_patients?: number
    emergency_cases?: number
    births?: number
    deaths?: number
    vaccinations?: number
    surgeries?: number
    exams?: number
  }): Promise<boolean> => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.post(`/health/centers/${centerId}/statistics`, statistics)
      const updatedHealthCenter = response.data
      setHealthCenters(prev => prev.map(center => center.id === centerId ? updatedHealthCenter : center))
      return true
    } catch (err) {
      setError('Falha ao registrar estatísticas')
      console.error('Error recording statistics:', err)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const addProgram = useCallback(async (centerId: string, program: {
    name: string
    type: 'PREVENTION' | 'TREATMENT' | 'REHABILITATION' | 'PROMOTION'
    target_population: string
    start_date: string
    budget: number
  }): Promise<boolean> => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.post(`/health/centers/${centerId}/programs`, program)
      const updatedHealthCenter = response.data
      setHealthCenters(prev => prev.map(center => center.id === centerId ? updatedHealthCenter : center))
      return true
    } catch (err) {
      setError('Falha ao adicionar programa')
      console.error('Error adding program:', err)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const scheduleInspection = useCallback(async (centerId: string, inspectionDate: string): Promise<boolean> => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.post(`/health/centers/${centerId}/inspection`, { inspection_date: inspectionDate })
      const updatedHealthCenter = response.data
      setHealthCenters(prev => prev.map(center => center.id === centerId ? updatedHealthCenter : center))
      return true
    } catch (err) {
      setError('Falha ao agendar inspeção')
      console.error('Error scheduling inspection:', err)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const getActiveHealthCenters = useCallback(() => {
    return healthCenters.filter(center => center.status === 'ACTIVE')
  }, [healthCenters])

  const getHealthCentersByType = useCallback((type: 'UBS' | 'UPA' | 'HOSPITAL' | 'CLINIC' | 'EMERGENCY' | 'SPECIALTY' | 'LABORATORY' | 'PHARMACY' | 'DENTAL') => {
    return healthCenters.filter(center => center.type === type)
  }, [healthCenters])

  const getHealthCentersByNeighborhood = useCallback((neighborhood: string) => {
    return healthCenters.filter(center => center.location.coverage_area.neighborhoods.includes(neighborhood))
  }, [healthCenters])

  const getEmergencyHealthCenters = useCallback(() => {
    return healthCenters.filter(center => center.operating_hours.emergency_24h && center.status === 'ACTIVE')
  }, [healthCenters])

  const getAccessibleHealthCenters = useCallback(() => {
    return healthCenters.filter(center => center.infrastructure.accessibility.wheelchair_access)
  }, [healthCenters])

  const getHealthCentersWithService = useCallback((service: string) => {
    return healthCenters.filter(center =>
      center.services.primary_care.includes(service as any) ||
      center.services.specialties.includes(service as any) ||
      center.services.diagnostic.includes(service as any)
    )
  }, [healthCenters])

  const getTotalCapacity = useCallback(() => {
    return healthCenters.reduce((total, center) => total + center.capacity.daily_consultations, 0)
  }, [healthCenters])

  const getAveragePatientSatisfaction = useCallback(() => {
    const centersWithSatisfaction = healthCenters.filter(center => center.quality_indicators.patient_satisfaction > 0)
    if (centersWithSatisfaction.length === 0) return 0

    const totalSatisfaction = centersWithSatisfaction.reduce((total, center) => total + center.quality_indicators.patient_satisfaction, 0)
    return totalSatisfaction / centersWithSatisfaction.length
  }, [healthCenters])

  useEffect(() => {
    fetchHealthCenters()
  }, [fetchHealthCenters])

  return {
    healthCenters,
    loading,
    error,
    fetchHealthCenters,
    getHealthCenterById,
    createHealthCenter,
    updateHealthCenter,
    deleteHealthCenter,
    updateStatus,
    addEquipment,
    updateEquipmentStatus,
    updateCapacity,
    updateQualityIndicators,
    recordStatistics,
    addProgram,
    scheduleInspection,
    getActiveHealthCenters,
    getHealthCentersByType,
    getHealthCentersByNeighborhood,
    getEmergencyHealthCenters,
    getAccessibleHealthCenters,
    getHealthCentersWithService,
    getTotalCapacity,
    getAveragePatientSatisfaction
  }
}