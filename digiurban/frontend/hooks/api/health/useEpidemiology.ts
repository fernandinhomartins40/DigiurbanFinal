import { useState, useEffect, useCallback } from 'react'
import { apiClient } from '@/lib/api'

export interface EpidemiologicalSurveillance {
  id: string
  disease: {
    name: string
    icd10_code: string
    notification_type: 'MANDATORY' | 'OPTIONAL' | 'IMMEDIATE'
  }
  case_details: {
    patient_id: string
    patient_name: string
    age: number
    gender: 'MALE' | 'FEMALE' | 'OTHER'
    address: {
      neighborhood: string
      city: string
      coordinates: {
        latitude: number
        longitude: number
      }
    }
  }
  notification: {
    notification_date: string
    notifying_unit: string
    notifying_professional: string
    case_classification: 'SUSPECTED' | 'CONFIRMED' | 'DISCARDED'
  }
  investigation: {
    investigation_date?: string
    investigator?: string
    symptoms_onset: string
    possible_source: string
    contacts_identified: number
    laboratory_confirmation: boolean
    epidemiological_link: boolean
  }
  outcome: {
    evolution: 'CURE' | 'DEATH' | 'CHRONIC' | 'UNKNOWN'
    outcome_date?: string
    death_cause?: string
  }
  control_measures: Array<{
    measure: string
    implementation_date: string
    responsible: string
    coverage: number
  }>
  created_at: string
  updated_at: string
}

export interface OutbreakInvestigation {
  id: string
  outbreak_name: string
  disease: string
  location: {
    affected_areas: Array<string>
    coordinates: {
      latitude: number
      longitude: number
    }
  }
  timeline: {
    first_case_date: string
    outbreak_declared_date: string
    outbreak_controlled_date?: string
  }
  cases: {
    total_cases: number
    confirmed_cases: number
    suspected_cases: number
    deaths: number
    attack_rate: number
  }
  investigation_team: Array<{
    name: string
    role: string
    institution: string
  }>
  control_measures: Array<{
    measure: string
    implementation_date: string
    effectiveness: number
  }>
  status: 'INVESTIGATING' | 'CONTROLLED' | 'ONGOING'
  created_at: string
  updated_at: string
}

export interface CreateEpidemiologicalSurveillanceData {
  disease: {
    name: string
    icd10_code: string
    notification_type: 'MANDATORY' | 'OPTIONAL' | 'IMMEDIATE'
  }
  case_details: {
    patient_id: string
    patient_name: string
    age: number
    gender: 'MALE' | 'FEMALE' | 'OTHER'
    address: {
      neighborhood: string
      city: string
      coordinates: {
        latitude: number
        longitude: number
      }
    }
  }
  notification: {
    notifying_unit: string
    notifying_professional: string
    case_classification: 'SUSPECTED' | 'CONFIRMED' | 'DISCARDED'
  }
  investigation?: {
    symptoms_onset: string
    possible_source: string
    contacts_identified: number
    laboratory_confirmation: boolean
    epidemiological_link: boolean
  }
}

export const useEpidemiology = () => {
  const [surveillances, setSurveillances] = useState<EpidemiologicalSurveillance[]>([])
  const [outbreaks, setOutbreaks] = useState<OutbreakInvestigation[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchSurveillances = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.get('/health/epidemiology/surveillances')
      setSurveillances(response.data)
    } catch (err) {
      setError('Falha ao carregar vigilância epidemiológica')
      console.error('Error fetching surveillances:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchOutbreaks = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.get('/health/epidemiology/outbreaks')
      setOutbreaks(response.data)
    } catch (err) {
      setError('Falha ao carregar surtos')
      console.error('Error fetching outbreaks:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  const createSurveillance = useCallback(async (data: CreateEpidemiologicalSurveillanceData): Promise<EpidemiologicalSurveillance | null> => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.post('/health/epidemiology/surveillances', data)
      const newSurveillance = response.data
      setSurveillances(prev => [...prev, newSurveillance])
      return newSurveillance
    } catch (err) {
      setError('Falha ao criar vigilância')
      console.error('Error creating surveillance:', err)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const updateCaseClassification = useCallback(async (surveillanceId: string, classification: 'SUSPECTED' | 'CONFIRMED' | 'DISCARDED'): Promise<boolean> => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.patch(`/health/epidemiology/surveillances/${surveillanceId}/classification`, { classification })
      const updatedSurveillance = response.data
      setSurveillances(prev => prev.map(s => s.id === surveillanceId ? updatedSurveillance : s))
      return true
    } catch (err) {
      setError('Falha ao atualizar classificação')
      console.error('Error updating classification:', err)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const getConfirmedCases = useCallback(() => {
    return surveillances.filter(s => s.notification.case_classification === 'CONFIRMED')
  }, [surveillances])

  const getActiveOutbreaks = useCallback(() => {
    return outbreaks.filter(o => o.status === 'INVESTIGATING' || o.status === 'ONGOING')
  }, [outbreaks])

  const getCasesByDisease = useCallback((disease: string) => {
    return surveillances.filter(s => s.disease.name === disease)
  }, [surveillances])

  useEffect(() => {
    fetchSurveillances()
    fetchOutbreaks()
  }, [fetchSurveillances, fetchOutbreaks])

  return {
    surveillances,
    outbreaks,
    loading,
    error,
    fetchSurveillances,
    fetchOutbreaks,
    createSurveillance,
    updateCaseClassification,
    getConfirmedCases,
    getActiveOutbreaks,
    getCasesByDisease
  }
}