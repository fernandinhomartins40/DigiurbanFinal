import { useState, useEffect, useCallback } from 'react'
import { apiClient } from '@/lib/api'

export interface Patient {
  id: string
  sus_card: string
  cpf: string
  name: string
  social_name?: string
  birth_date: string
  gender: 'MALE' | 'FEMALE' | 'OTHER' | 'NOT_INFORMED'
  mother_name: string
  father_name?: string
  personal_info: {
    nationality: string
    place_of_birth: {
      city: string
      state: string
      country: string
    }
    race_color: 'WHITE' | 'BLACK' | 'BROWN' | 'YELLOW' | 'INDIGENOUS' | 'NOT_INFORMED'
    education_level: 'ILLITERATE' | 'INCOMPLETE_ELEMENTARY' | 'COMPLETE_ELEMENTARY' | 'INCOMPLETE_HIGH_SCHOOL' | 'COMPLETE_HIGH_SCHOOL' | 'INCOMPLETE_COLLEGE' | 'COMPLETE_COLLEGE' | 'POSTGRADUATE'
    marital_status: 'SINGLE' | 'MARRIED' | 'DIVORCED' | 'WIDOWED' | 'STABLE_UNION' | 'SEPARATED'
    occupation: string
    monthly_income: number
  }
  contact: {
    address: {
      street: string
      number: string
      complement?: string
      neighborhood: string
      city: string
      state: string
      zipcode: string
      reference_point?: string
    }
    phone?: string
    mobile?: string
    email?: string
    emergency_contact: {
      name: string
      relationship: string
      phone: string
    }
  }
  documents: {
    rg?: {
      number: string
      issuer: string
      issue_date: string
    }
    work_card?: {
      number: string
      series: string
    }
    birth_certificate?: {
      number: string
      book: string
      sheet: string
      registry_office: string
    }
    other_documents: Array<{
      type: string
      number: string
      issuer: string
    }>
  }
  health_info: {
    blood_type: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-' | 'UNKNOWN'
    allergies: Array<{
      allergen: string
      severity: 'MILD' | 'MODERATE' | 'SEVERE'
      reaction: string
    }>
    chronic_conditions: Array<{
      condition: string
      diagnosis_date: string
      status: 'ACTIVE' | 'CONTROLLED' | 'REMISSION' | 'CURED'
      medications: Array<string>
    }>
    medications: Array<{
      name: string
      dosage: string
      frequency: string
      start_date: string
      end_date?: string
      prescribing_doctor: string
    }>
    risk_factors: Array<'SMOKING' | 'ALCOHOLISM' | 'DRUG_USE' | 'SEDENTARY' | 'OBESITY' | 'HYPERTENSION' | 'DIABETES' | 'FAMILY_HISTORY'>
    disabilities: Array<{
      type: 'PHYSICAL' | 'VISUAL' | 'HEARING' | 'INTELLECTUAL' | 'PSYCHOSOCIAL'
      description: string
      severity: 'MILD' | 'MODERATE' | 'SEVERE'
      assistive_technology: boolean
    }>
  }
  immunization: {
    vaccination_card: string
    vaccines: Array<{
      vaccine_name: string
      doses_taken: number
      doses_required: number
      last_dose_date: string
      next_dose_date?: string
      lot_number: string
      vaccination_center: string
    }>
    immunization_status: 'UP_TO_DATE' | 'DELAYED' | 'INCOMPLETE' | 'CONTRAINDICATED'
  }
  registration: {
    registration_date: string
    registration_center: string
    family_health_team?: string
    primary_health_unit: string
    registration_status: 'ACTIVE' | 'INACTIVE' | 'TRANSFERRED' | 'DECEASED'
    last_update: string
    updated_by: string
  }
  family_composition: {
    responsible_person: {
      name: string
      cpf: string
      relationship: string
      phone: string
    }
    family_members: Array<{
      name: string
      cpf?: string
      relationship: string
      birth_date: string
      sus_card?: string
      lives_together: boolean
    }>
    family_income: number
    government_benefits: Array<{
      program: string
      nis_number: string
      benefit_value: number
    }>
  }
  housing_conditions: {
    dwelling_type: 'HOUSE' | 'APARTMENT' | 'SHACK' | 'SHARED_ROOM' | 'HOMELESS' | 'INSTITUTION' | 'OTHER'
    construction_material: 'MASONRY' | 'WOOD' | 'MIXED' | 'IMPROVISED' | 'OTHER'
    rooms: number
    residents: number
    water_supply: 'PUBLIC_NETWORK' | 'WELL' | 'CISTERN' | 'OTHER_SOURCE'
    sewage: 'PUBLIC_NETWORK' | 'SEPTIC_TANK' | 'RUDIMENTARY_PIT' | 'OPEN_AIR' | 'OTHER'
    electricity: boolean
    garbage_collection: boolean
    animals_in_home: boolean
  }
  social_vulnerability: {
    bolsa_familia: boolean
    bpc_beneficiary: boolean
    cad_unico_number?: string
    social_risk_situation: Array<'DOMESTIC_VIOLENCE' | 'CHILD_LABOR' | 'DRUG_TRAFFICKING' | 'HOMELESSNESS' | 'DISCRIMINATION' | 'ABANDONMENT'>
    social_programs: Array<{
      program_name: string
      participation_date: string
      status: 'ACTIVE' | 'INACTIVE' | 'COMPLETED'
    }>
  }
  medical_history: {
    consultations: Array<{
      id: string
      date: string
      health_center: string
      doctor: string
      reason: string
      diagnosis: string
      treatment: string
    }>
    hospitalizations: Array<{
      id: string
      admission_date: string
      discharge_date?: string
      hospital: string
      reason: string
      diagnosis: string
      outcome: 'CURE' | 'IMPROVEMENT' | 'TRANSFER' | 'DEATH' | 'DISCHARGE_ON_REQUEST'
    }>
    surgeries: Array<{
      id: string
      date: string
      hospital: string
      surgeon: string
      procedure: string
      complications?: string
    }>
    exams: Array<{
      id: string
      date: string
      type: string
      result: string
      doctor: string
      health_center: string
    }>
  }
  prenatal_care?: {
    pregnancies: Array<{
      pregnancy_number: number
      start_date: string
      expected_delivery: string
      delivery_date?: string
      prenatal_consultations: number
      complications: Array<string>
      birth_weight?: number
      delivery_type?: 'NORMAL' | 'CESAREAN'
      outcome: 'LIVE_BIRTH' | 'STILLBIRTH' | 'MISCARRIAGE' | 'ABORTION'
    }>
    current_pregnancy?: {
      start_date: string
      expected_delivery: string
      gestational_age: number
      risk_classification: 'LOW' | 'MEDIUM' | 'HIGH'
      prenatal_visits: number
      complications: Array<string>
    }
  }
  child_development?: {
    birth_data: {
      birth_weight: number
      birth_length: number
      gestational_age: number
      apgar_score: {
        first_minute: number
        fifth_minute: number
      }
      complications: Array<string>
    }
    growth_monitoring: Array<{
      date: string
      age_months: number
      weight: number
      height: number
      head_circumference: number
      nutritional_status: 'ADEQUATE' | 'OVERWEIGHT' | 'OBESITY' | 'UNDERWEIGHT' | 'SEVERE_MALNUTRITION'
    }>
    development_milestones: Array<{
      milestone: string
      expected_age_months: number
      achieved: boolean
      achieved_age_months?: number
    }>
  }
  created_at: string
  updated_at: string
}

export interface CreatePatientData {
  sus_card?: string
  cpf: string
  name: string
  social_name?: string
  birth_date: string
  gender: 'MALE' | 'FEMALE' | 'OTHER' | 'NOT_INFORMED'
  mother_name: string
  father_name?: string
  personal_info: {
    nationality: string
    place_of_birth: {
      city: string
      state: string
      country: string
    }
    race_color: 'WHITE' | 'BLACK' | 'BROWN' | 'YELLOW' | 'INDIGENOUS' | 'NOT_INFORMED'
    education_level: 'ILLITERATE' | 'INCOMPLETE_ELEMENTARY' | 'COMPLETE_ELEMENTARY' | 'INCOMPLETE_HIGH_SCHOOL' | 'COMPLETE_HIGH_SCHOOL' | 'INCOMPLETE_COLLEGE' | 'COMPLETE_COLLEGE' | 'POSTGRADUATE'
    marital_status: 'SINGLE' | 'MARRIED' | 'DIVORCED' | 'WIDOWED' | 'STABLE_UNION' | 'SEPARATED'
    occupation: string
    monthly_income: number
  }
  contact: {
    address: {
      street: string
      number: string
      complement?: string
      neighborhood: string
      city: string
      state: string
      zipcode: string
      reference_point?: string
    }
    phone?: string
    mobile?: string
    email?: string
    emergency_contact: {
      name: string
      relationship: string
      phone: string
    }
  }
  health_info: {
    blood_type?: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-' | 'UNKNOWN'
    allergies?: Array<{
      allergen: string
      severity: 'MILD' | 'MODERATE' | 'SEVERE'
      reaction: string
    }>
    chronic_conditions?: Array<{
      condition: string
      diagnosis_date: string
      status: 'ACTIVE' | 'CONTROLLED' | 'REMISSION' | 'CURED'
    }>
    risk_factors?: Array<'SMOKING' | 'ALCOHOLISM' | 'DRUG_USE' | 'SEDENTARY' | 'OBESITY' | 'HYPERTENSION' | 'DIABETES' | 'FAMILY_HISTORY'>
  }
  registration: {
    primary_health_unit: string
    family_health_team?: string
  }
}

export interface PatientFilters {
  name?: string
  cpf?: string
  sus_card?: string
  gender?: 'MALE' | 'FEMALE' | 'OTHER' | 'NOT_INFORMED'
  age_min?: number
  age_max?: number
  neighborhood?: string
  city?: string
  state?: string
  primary_health_unit?: string
  family_health_team?: string
  registration_status?: 'ACTIVE' | 'INACTIVE' | 'TRANSFERRED' | 'DECEASED'
  blood_type?: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-' | 'UNKNOWN'
  chronic_condition?: string
  risk_factor?: 'SMOKING' | 'ALCOHOLISM' | 'DRUG_USE' | 'SEDENTARY' | 'OBESITY' | 'HYPERTENSION' | 'DIABETES' | 'FAMILY_HISTORY'
  immunization_status?: 'UP_TO_DATE' | 'DELAYED' | 'INCOMPLETE' | 'CONTRAINDICATED'
  pregnant?: boolean
  disability?: boolean
  social_vulnerability?: boolean
  registered_from?: string
  registered_to?: string
}

export const usePatients = () => {
  const [patients, setPatients] = useState<Patient[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchPatients = useCallback(async (filters?: PatientFilters) => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.get('/health/patients', { params: filters })
      setPatients(response.data)
    } catch (err) {
      setError('Falha ao carregar pacientes')
      console.error('Error fetching patients:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  const getPatientById = useCallback(async (id: string): Promise<Patient | null> => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.get(`/health/patients/${id}`)
      return response.data
    } catch (err) {
      setError('Falha ao carregar paciente')
      console.error('Error fetching patient:', err)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const getPatientByCPF = useCallback(async (cpf: string): Promise<Patient | null> => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.get(`/health/patients/cpf/${cpf}`)
      return response.data
    } catch (err) {
      setError('Falha ao carregar paciente')
      console.error('Error fetching patient by CPF:', err)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const createPatient = useCallback(async (data: CreatePatientData): Promise<Patient | null> => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.post('/health/patients', data)
      const newPatient = response.data
      setPatients(prev => [...prev, newPatient])
      return newPatient
    } catch (err) {
      setError('Falha ao criar paciente')
      console.error('Error creating patient:', err)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const updatePatient = useCallback(async (id: string, data: Partial<CreatePatientData>): Promise<Patient | null> => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.put(`/health/patients/${id}`, data)
      const updatedPatient = response.data
      setPatients(prev => prev.map(patient => patient.id === id ? updatedPatient : patient))
      return updatedPatient
    } catch (err) {
      setError('Falha ao atualizar paciente')
      console.error('Error updating patient:', err)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const deletePatient = useCallback(async (id: string): Promise<boolean> => {
    try {
      setLoading(true)
      setError(null)
      await apiClient.delete(`/health/patients/${id}`)
      setPatients(prev => prev.filter(patient => patient.id !== id))
      return true
    } catch (err) {
      setError('Falha ao excluir paciente')
      console.error('Error deleting patient:', err)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const updateRegistrationStatus = useCallback(async (id: string, status: 'ACTIVE' | 'INACTIVE' | 'TRANSFERRED' | 'DECEASED'): Promise<boolean> => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.patch(`/health/patients/${id}/registration-status`, { status })
      const updatedPatient = response.data
      setPatients(prev => prev.map(patient => patient.id === id ? updatedPatient : patient))
      return true
    } catch (err) {
      setError('Falha ao atualizar status do paciente')
      console.error('Error updating patient registration status:', err)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const addMedicalRecord = useCallback(async (patientId: string, record: {
    type: 'CONSULTATION' | 'HOSPITALIZATION' | 'SURGERY' | 'EXAM'
    date: string
    health_center: string
    doctor: string
    reason: string
    diagnosis: string
    treatment?: string
    notes?: string
  }): Promise<boolean> => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.post(`/health/patients/${patientId}/medical-records`, record)
      const updatedPatient = response.data
      setPatients(prev => prev.map(patient => patient.id === patientId ? updatedPatient : patient))
      return true
    } catch (err) {
      setError('Falha ao adicionar registro médico')
      console.error('Error adding medical record:', err)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const addVaccination = useCallback(async (patientId: string, vaccination: {
    vaccine_name: string
    dose_number: number
    lot_number: string
    vaccination_center: string
    vaccination_date: string
    next_dose_date?: string
  }): Promise<boolean> => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.post(`/health/patients/${patientId}/vaccinations`, vaccination)
      const updatedPatient = response.data
      setPatients(prev => prev.map(patient => patient.id === patientId ? updatedPatient : patient))
      return true
    } catch (err) {
      setError('Falha ao adicionar vacinação')
      console.error('Error adding vaccination:', err)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const updateHealthInfo = useCallback(async (patientId: string, healthInfo: {
    blood_type?: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-' | 'UNKNOWN'
    allergies?: Array<{
      allergen: string
      severity: 'MILD' | 'MODERATE' | 'SEVERE'
      reaction: string
    }>
    chronic_conditions?: Array<{
      condition: string
      diagnosis_date: string
      status: 'ACTIVE' | 'CONTROLLED' | 'REMISSION' | 'CURED'
      medications?: Array<string>
    }>
    medications?: Array<{
      name: string
      dosage: string
      frequency: string
      start_date: string
      end_date?: string
      prescribing_doctor: string
    }>
    risk_factors?: Array<'SMOKING' | 'ALCOHOLISM' | 'DRUG_USE' | 'SEDENTARY' | 'OBESITY' | 'HYPERTENSION' | 'DIABETES' | 'FAMILY_HISTORY'>
  }): Promise<boolean> => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.patch(`/health/patients/${patientId}/health-info`, healthInfo)
      const updatedPatient = response.data
      setPatients(prev => prev.map(patient => patient.id === patientId ? updatedPatient : patient))
      return true
    } catch (err) {
      setError('Falha ao atualizar informações de saúde')
      console.error('Error updating health info:', err)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const addGrowthMonitoring = useCallback(async (patientId: string, monitoring: {
    date: string
    age_months: number
    weight: number
    height: number
    head_circumference: number
    nutritional_status: 'ADEQUATE' | 'OVERWEIGHT' | 'OBESITY' | 'UNDERWEIGHT' | 'SEVERE_MALNUTRITION'
  }): Promise<boolean> => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.post(`/health/patients/${patientId}/growth-monitoring`, monitoring)
      const updatedPatient = response.data
      setPatients(prev => prev.map(patient => patient.id === patientId ? updatedPatient : patient))
      return true
    } catch (err) {
      setError('Falha ao adicionar monitoramento de crescimento')
      console.error('Error adding growth monitoring:', err)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const getActivePatients = useCallback(() => {
    return patients.filter(patient => patient.registration.registration_status === 'ACTIVE')
  }, [patients])

  const getPatientsByHealthUnit = useCallback((healthUnit: string) => {
    return patients.filter(patient => patient.registration.primary_health_unit === healthUnit)
  }, [patients])

  const getPatientsByAge = useCallback((minAge: number, maxAge: number) => {
    const today = new Date()
    return patients.filter(patient => {
      const birthDate = new Date(patient.birth_date)
      const age = today.getFullYear() - birthDate.getFullYear()
      return age >= minAge && age <= maxAge
    })
  }, [patients])

  const getPatientsByChronicCondition = useCallback((condition: string) => {
    return patients.filter(patient =>
      patient.health_info.chronic_conditions.some(c => c.condition.toLowerCase().includes(condition.toLowerCase()))
    )
  }, [patients])

  const getVaccinationDelayedPatients = useCallback(() => {
    return patients.filter(patient => patient.immunization.immunization_status === 'DELAYED' || patient.immunization.immunization_status === 'INCOMPLETE')
  }, [patients])

  const getPregnantPatients = useCallback(() => {
    return patients.filter(patient => patient.prenatal_care?.current_pregnancy)
  }, [patients])

  const getChildrenForGrowthMonitoring = useCallback(() => {
    const fiveYearsAgo = new Date()
    fiveYearsAgo.setFullYear(fiveYearsAgo.getFullYear() - 5)

    return patients.filter(patient => {
      const birthDate = new Date(patient.birth_date)
      return birthDate >= fiveYearsAgo
    })
  }, [patients])

  const getSociallyVulnerablePatients = useCallback(() => {
    return patients.filter(patient =>
      patient.social_vulnerability.bolsa_familia ||
      patient.social_vulnerability.bpc_beneficiary ||
      patient.social_vulnerability.social_risk_situation.length > 0
    )
  }, [patients])

  const getPatientsByNeighborhood = useCallback((neighborhood: string) => {
    return patients.filter(patient => patient.contact.address.neighborhood === neighborhood)
  }, [patients])

  useEffect(() => {
    fetchPatients()
  }, [fetchPatients])

  return {
    patients,
    loading,
    error,
    fetchPatients,
    getPatientById,
    getPatientByCPF,
    createPatient,
    updatePatient,
    deletePatient,
    updateRegistrationStatus,
    addMedicalRecord,
    addVaccination,
    updateHealthInfo,
    addGrowthMonitoring,
    getActivePatients,
    getPatientsByHealthUnit,
    getPatientsByAge,
    getPatientsByChronicCondition,
    getVaccinationDelayedPatients,
    getPregnantPatients,
    getChildrenForGrowthMonitoring,
    getSociallyVulnerablePatients,
    getPatientsByNeighborhood
  }
}