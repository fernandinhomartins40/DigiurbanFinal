import { useState, useEffect, useCallback } from 'react'
import { apiClient } from '@/lib/api'

export interface EmergencyCase {
  id: string
  protocol: string
  patient: {
    id?: string
    name: string
    age?: number
    gender?: 'MALE' | 'FEMALE' | 'OTHER'
    identification?: string
  }
  arrival: {
    date: string
    time: string
    arrival_mode: 'WALK_IN' | 'AMBULANCE' | 'POLICE' | 'FIRE_DEPARTMENT' | 'HELICOPTER' | 'PRIVATE_VEHICLE'
    referring_unit?: string
  }
  triage: {
    nurse: string
    date_time: string
    category: 'RED' | 'YELLOW' | 'GREEN' | 'BLUE' | 'WHITE'
    vital_signs: {
      temperature: number
      blood_pressure: {
        systolic: number
        diastolic: number
      }
      heart_rate: number
      respiratory_rate: number
      oxygen_saturation: number
      glasgow_coma_scale: number
      pain_scale: number
    }
    chief_complaint: string
    presenting_symptoms: Array<string>
    alert_conditions: Array<string>
    waiting_time_estimate: number
  }
  medical_assessment: {
    doctor: {
      name: string
      crm: string
    }
    assessment_start: string
    primary_diagnosis: {
      icd10_code: string
      description: string
    }
    secondary_diagnoses: Array<{
      icd10_code: string
      description: string
    }>
    procedures_performed: Array<{
      code: string
      description: string
      start_time: string
      end_time?: string
      professional: string
    }>
    medications_administered: Array<{
      medication: string
      dosage: string
      route: string
      time: string
      administrator: string
    }>
  }
  disposition: {
    decision: 'DISCHARGE' | 'ADMISSION' | 'TRANSFER' | 'OBSERVATION' | 'DEATH' | 'AMA'
    discharge_time?: string
    discharge_condition: 'CURED' | 'IMPROVED' | 'UNCHANGED' | 'WORSENED'
    destination?: string
    follow_up_instructions: Array<string>
    medications_prescribed: Array<{
      medication: string
      dosage: string
      frequency: string
      duration: string
    }>
  }
  quality_metrics: {
    door_to_doctor_time: number
    length_of_stay: number
    left_without_being_seen: boolean
    returned_within_72h: boolean
    patient_satisfaction?: number
  }
  status: 'WAITING' | 'IN_ASSESSMENT' | 'IN_TREATMENT' | 'COMPLETED' | 'TRANSFERRED' | 'LEFT_AMA'
  created_at: string
  updated_at: string
}

export interface EmergencyEquipment {
  id: string
  name: string
  type: 'DEFIBRILLATOR' | 'VENTILATOR' | 'MONITOR' | 'INFUSION_PUMP' | 'STRETCHER' | 'OXYGEN' | 'SUCTION'
  model: string
  serial_number: string
  status: 'AVAILABLE' | 'IN_USE' | 'MAINTENANCE' | 'OUT_OF_ORDER'
  location: string
  last_maintenance: string
  next_maintenance: string
  assigned_to?: string
}

export interface CreateEmergencyCaseData {
  patient: {
    id?: string
    name: string
    age?: number
    gender?: 'MALE' | 'FEMALE' | 'OTHER'
    identification?: string
  }
  arrival: {
    arrival_mode: 'WALK_IN' | 'AMBULANCE' | 'POLICE' | 'FIRE_DEPARTMENT' | 'HELICOPTER' | 'PRIVATE_VEHICLE'
    referring_unit?: string
  }
  triage: {
    nurse: string
    category: 'RED' | 'YELLOW' | 'GREEN' | 'BLUE' | 'WHITE'
    vital_signs: {
      temperature: number
      blood_pressure: {
        systolic: number
        diastolic: number
      }
      heart_rate: number
      respiratory_rate: number
      oxygen_saturation: number
      glasgow_coma_scale: number
      pain_scale: number
    }
    chief_complaint: string
    presenting_symptoms: Array<string>
  }
}

export interface EmergencyFilters {
  patient_name?: string
  protocol?: string
  triage_category?: 'RED' | 'YELLOW' | 'GREEN' | 'BLUE' | 'WHITE'
  status?: 'WAITING' | 'IN_ASSESSMENT' | 'IN_TREATMENT' | 'COMPLETED' | 'TRANSFERRED' | 'LEFT_AMA'
  arrival_mode?: 'WALK_IN' | 'AMBULANCE' | 'POLICE' | 'FIRE_DEPARTMENT' | 'HELICOPTER' | 'PRIVATE_VEHICLE'
  doctor_crm?: string
  disposition?: 'DISCHARGE' | 'ADMISSION' | 'TRANSFER' | 'OBSERVATION' | 'DEATH' | 'AMA'
  date_from?: string
  date_to?: string
  left_without_being_seen?: boolean
  returned_within_72h?: boolean
  created_from?: string
  created_to?: string
}

export const useEmergencyServices = () => {
  const [emergencyCases, setEmergencyCases] = useState<EmergencyCase[]>([])
  const [equipment, setEquipment] = useState<EmergencyEquipment[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchEmergencyCases = useCallback(async (filters?: EmergencyFilters) => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.get('/health/emergency-services/cases', { params: filters })
      setEmergencyCases(response.data)
    } catch (err) {
      setError('Falha ao carregar casos de emergência')
      console.error('Error fetching emergency cases:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchEquipment = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.get('/health/emergency-services/equipment')
      setEquipment(response.data)
    } catch (err) {
      setError('Falha ao carregar equipamentos')
      console.error('Error fetching equipment:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  const createEmergencyCase = useCallback(async (data: CreateEmergencyCaseData): Promise<EmergencyCase | null> => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.post('/health/emergency-services/cases', data)
      const newCase = response.data
      setEmergencyCases(prev => [...prev, newCase])
      return newCase
    } catch (err) {
      setError('Falha ao registrar caso de emergência')
      console.error('Error creating emergency case:', err)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const updateCaseStatus = useCallback(async (caseId: string, status: 'WAITING' | 'IN_ASSESSMENT' | 'IN_TREATMENT' | 'COMPLETED' | 'TRANSFERRED' | 'LEFT_AMA'): Promise<boolean> => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.patch(`/health/emergency-services/cases/${caseId}/status`, { status })
      const updatedCase = response.data
      setEmergencyCases(prev => prev.map(c => c.id === caseId ? updatedCase : c))
      return true
    } catch (err) {
      setError('Falha ao atualizar status do caso')
      console.error('Error updating case status:', err)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const assignDoctor = useCallback(async (caseId: string, doctor: { name: string, crm: string }): Promise<boolean> => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.patch(`/health/emergency-services/cases/${caseId}/assign-doctor`, { doctor })
      const updatedCase = response.data
      setEmergencyCases(prev => prev.map(c => c.id === caseId ? updatedCase : c))
      return true
    } catch (err) {
      setError('Falha ao atribuir médico')
      console.error('Error assigning doctor:', err)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const recordDisposition = useCallback(async (caseId: string, disposition: {
    decision: 'DISCHARGE' | 'ADMISSION' | 'TRANSFER' | 'OBSERVATION' | 'DEATH' | 'AMA'
    discharge_condition: 'CURED' | 'IMPROVED' | 'UNCHANGED' | 'WORSENED'
    destination?: string
    follow_up_instructions: Array<string>
    medications_prescribed: Array<{
      medication: string
      dosage: string
      frequency: string
      duration: string
    }>
  }): Promise<boolean> => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.post(`/health/emergency-services/cases/${caseId}/disposition`, disposition)
      const updatedCase = response.data
      setEmergencyCases(prev => prev.map(c => c.id === caseId ? updatedCase : c))
      return true
    } catch (err) {
      setError('Falha ao registrar desfecho')
      console.error('Error recording disposition:', err)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const getActiveEmergencyCases = useCallback(() => {
    return emergencyCases.filter(c => ['WAITING', 'IN_ASSESSMENT', 'IN_TREATMENT'].includes(c.status))
  }, [emergencyCases])

  const getCasesByTriageCategory = useCallback((category: 'RED' | 'YELLOW' | 'GREEN' | 'BLUE' | 'WHITE') => {
    return emergencyCases.filter(c => c.triage.category === category)
  }, [emergencyCases])

  const getAvailableEquipment = useCallback(() => {
    return equipment.filter(eq => eq.status === 'AVAILABLE')
  }, [equipment])

  const getAverageWaitingTime = useCallback(() => {
    const completedCases = emergencyCases.filter(c => c.status === 'COMPLETED')
    if (completedCases.length === 0) return 0

    const totalTime = completedCases.reduce((sum, c) => sum + c.quality_metrics.door_to_doctor_time, 0)
    return totalTime / completedCases.length
  }, [emergencyCases])

  useEffect(() => {
    fetchEmergencyCases()
    fetchEquipment()
  }, [fetchEmergencyCases, fetchEquipment])

  return {
    emergencyCases,
    equipment,
    loading,
    error,
    fetchEmergencyCases,
    fetchEquipment,
    createEmergencyCase,
    updateCaseStatus,
    assignDoctor,
    recordDisposition,
    getActiveEmergencyCases,
    getCasesByTriageCategory,
    getAvailableEquipment,
    getAverageWaitingTime
  }
}