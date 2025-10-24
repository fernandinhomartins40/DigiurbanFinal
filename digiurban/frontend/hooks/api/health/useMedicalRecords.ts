import { useState, useEffect, useCallback } from 'react'
import { apiClient } from '@/lib/api'

export interface MedicalRecord {
  id: string
  patient: {
    id: string
    name: string
    cpf: string
    sus_card: string
    birth_date: string
    gender: 'MALE' | 'FEMALE' | 'OTHER' | 'NOT_INFORMED'
  }
  record_number: string
  creation_date: string
  last_update: string
  status: 'ACTIVE' | 'ARCHIVED' | 'BLOCKED' | 'TRANSFERRED'
  access_level: 'PUBLIC' | 'RESTRICTED' | 'CONFIDENTIAL'
  primary_health_unit: {
    id: string
    name: string
    code: string
  }
  demographic_data: {
    address: {
      street: string
      number: string
      complement?: string
      neighborhood: string
      city: string
      state: string
      zipcode: string
    }
    contact: {
      phone?: string
      mobile?: string
      email?: string
    }
    education_level: string
    occupation: string
    marital_status: string
    emergency_contact: {
      name: string
      relationship: string
      phone: string
    }
  }
  clinical_summary: {
    allergies: Array<{
      allergen: string
      type: 'MEDICATION' | 'FOOD' | 'ENVIRONMENTAL' | 'OTHER'
      severity: 'MILD' | 'MODERATE' | 'SEVERE' | 'ANAPHYLACTIC'
      reaction: string
      onset_date: string
      status: 'ACTIVE' | 'RESOLVED' | 'SUSPECTED'
    }>
    chronic_conditions: Array<{
      condition: string
      icd10_code: string
      diagnosis_date: string
      severity: 'MILD' | 'MODERATE' | 'SEVERE'
      status: 'ACTIVE' | 'CONTROLLED' | 'REMISSION' | 'CURED'
      complications: Array<string>
    }>
    medications: Array<{
      name: string
      generic_name: string
      dosage: string
      frequency: string
      route: 'ORAL' | 'TOPICAL' | 'INJECTION' | 'INHALATION' | 'OTHER'
      start_date: string
      end_date?: string
      prescribing_doctor: string
      indication: string
      status: 'ACTIVE' | 'DISCONTINUED' | 'COMPLETED'
    }>
    risk_factors: Array<{
      factor: 'SMOKING' | 'ALCOHOLISM' | 'DRUG_USE' | 'SEDENTARY' | 'OBESITY' | 'HYPERTENSION' | 'DIABETES' | 'FAMILY_HISTORY' | 'OCCUPATIONAL'
      severity: 'LOW' | 'MODERATE' | 'HIGH'
      onset_date: string
      status: 'ACTIVE' | 'RESOLVED' | 'MONITORED'
      notes: string
    }>
    vital_signs_baseline: {
      blood_pressure: {
        systolic: number
        diastolic: number
      }
      heart_rate: number
      weight: number
      height: number
      bmi: number
      blood_type: string
    }
  }
  medical_history: {
    consultations: Array<{
      id: string
      date: string
      type: 'CONSULTATION' | 'EMERGENCY' | 'PREVENTIVE' | 'FOLLOW_UP'
      health_center: string
      doctor: {
        name: string
        crm: string
        specialty: string
      }
      chief_complaint: string
      diagnosis: Array<{
        icd10_code: string
        description: string
        type: 'PRIMARY' | 'SECONDARY'
      }>
      treatment: string
      follow_up_required: boolean
    }>
    hospitalizations: Array<{
      id: string
      admission_date: string
      discharge_date?: string
      hospital: string
      department: string
      admission_reason: string
      primary_diagnosis: {
        icd10_code: string
        description: string
      }
      secondary_diagnoses: Array<{
        icd10_code: string
        description: string
      }>
      procedures: Array<{
        code: string
        description: string
        date: string
      }>
      complications: Array<string>
      discharge_condition: 'CURED' | 'IMPROVED' | 'UNCHANGED' | 'WORSENED' | 'DEATH'
      discharge_disposition: 'HOME' | 'TRANSFER' | 'REHABILITATION' | 'LONG_TERM_CARE' | 'AMA'
    }>
    surgeries: Array<{
      id: string
      date: string
      hospital: string
      surgeon: {
        name: string
        crm: string
      }
      procedure: {
        code: string
        description: string
      }
      anesthesia_type: string
      duration: number
      complications: Array<string>
      outcome: 'SUCCESS' | 'COMPLICATION' | 'FAILURE'
      recovery_notes: string
    }>
    emergency_visits: Array<{
      id: string
      date: string
      hospital: string
      chief_complaint: string
      triage_level: 'RED' | 'YELLOW' | 'GREEN' | 'BLUE' | 'WHITE'
      diagnosis: string
      treatment: string
      disposition: 'DISCHARGE' | 'ADMISSION' | 'TRANSFER' | 'AMA'
    }>
  }
  laboratory_results: Array<{
    id: string
    order_date: string
    collection_date: string
    result_date: string
    laboratory: string
    ordering_doctor: string
    tests: Array<{
      test_code: string
      test_name: string
      result: string
      reference_range: string
      unit: string
      status: 'NORMAL' | 'ABNORMAL' | 'CRITICAL' | 'PENDING'
      interpretation: string
    }>
    clinical_context: string
  }>
  imaging_studies: Array<{
    id: string
    order_date: string
    exam_date: string
    type: 'X_RAY' | 'CT_SCAN' | 'MRI' | 'ULTRASOUND' | 'MAMMOGRAPHY' | 'NUCLEAR_MEDICINE' | 'OTHER'
    body_part: string
    indication: string
    facility: string
    radiologist: string
    findings: string
    impression: string
    recommendations: string
    images_available: boolean
  }>
  immunization_record: {
    vaccination_card_number: string
    vaccines: Array<{
      vaccine: string
      date: string
      dose_number: number
      lot_number: string
      manufacturer: string
      vaccination_site: string
      administrator: string
      adverse_reactions: Array<{
        reaction: string
        severity: 'MILD' | 'MODERATE' | 'SEVERE'
        onset_time: string
        duration: string
        treatment: string
      }>
    }>
    immunization_status: 'UP_TO_DATE' | 'INCOMPLETE' | 'DELAYED' | 'CONTRAINDICATED'
    next_vaccines_due: Array<{
      vaccine: string
      due_date: string
      dose_number: number
    }>
  }
  preventive_care: {
    screenings: Array<{
      screening_type: 'CERVICAL_CANCER' | 'BREAST_CANCER' | 'COLORECTAL_CANCER' | 'PROSTATE_CANCER' | 'CARDIOVASCULAR' | 'DIABETES' | 'OSTEOPOROSIS'
      last_screening_date: string
      result: 'NORMAL' | 'ABNORMAL' | 'REQUIRES_FOLLOW_UP'
      next_due_date: string
      recommendations: string
    }>
    health_maintenance: Array<{
      activity: 'ANNUAL_PHYSICAL' | 'DENTAL_CHECKUP' | 'EYE_EXAM' | 'NUTRITION_COUNSELING' | 'MENTAL_HEALTH_SCREENING'
      last_completed: string
      frequency: 'ANNUAL' | 'BIANNUAL' | 'QUARTERLY' | 'MONTHLY'
      next_due: string
      provider: string
    }>
  }
  mental_health: {
    assessments: Array<{
      date: string
      assessment_type: 'DEPRESSION' | 'ANXIETY' | 'BIPOLAR' | 'SCHIZOPHRENIA' | 'SUBSTANCE_ABUSE' | 'PTSD' | 'OTHER'
      screening_tool: string
      score: number
      interpretation: string
      recommendations: string
      provider: string
    }>
    treatments: Array<{
      type: 'PSYCHOTHERAPY' | 'MEDICATION' | 'GROUP_THERAPY' | 'FAMILY_THERAPY' | 'CRISIS_INTERVENTION'
      start_date: string
      end_date?: string
      provider: string
      frequency: string
      response: 'EXCELLENT' | 'GOOD' | 'PARTIAL' | 'POOR' | 'NO_RESPONSE'
      notes: string
    }>
  }
  reproductive_health?: {
    obstetric_history: Array<{
      pregnancy_number: number
      outcome: 'LIVE_BIRTH' | 'STILLBIRTH' | 'MISCARRIAGE' | 'ABORTION'
      gestational_age: number
      delivery_type: 'VAGINAL' | 'CESAREAN'
      birth_weight?: number
      complications: Array<string>
    }>
    gynecologic_history: {
      menarche_age?: number
      menopause_age?: number
      last_menstrual_period?: string
      pap_smears: Array<{
        date: string
        result: string
        next_due: string
      }>
      contraception: Array<{
        method: string
        start_date: string
        end_date?: string
        effectiveness: string
        side_effects: Array<string>
      }>
    }
  }
  pediatric_data?: {
    birth_history: {
      gestational_age: number
      birth_weight: number
      birth_length: number
      head_circumference: number
      apgar_scores: {
        one_minute: number
        five_minute: number
      }
      delivery_complications: Array<string>
      neonatal_complications: Array<string>
    }
    growth_charts: Array<{
      date: string
      age_months: number
      weight: number
      height: number
      head_circumference: number
      weight_percentile: number
      height_percentile: number
      bmi_percentile: number
    }>
    developmental_milestones: Array<{
      milestone: string
      expected_age_months: number
      achieved: boolean
      achieved_age_months?: number
      concerns: Array<string>
    }>
    feeding_history: Array<{
      type: 'BREASTFEEDING' | 'FORMULA' | 'MIXED' | 'SOLID_FOODS'
      start_date: string
      end_date?: string
      notes: string
    }>
  }
  care_team: Array<{
    provider_id: string
    provider_name: string
    specialty: string
    role: 'PRIMARY' | 'SPECIALIST' | 'CONSULTANT' | 'ANCILLARY'
    start_date: string
    end_date?: string
    contact_info: {
      phone: string
      email: string
    }
  }>
  care_plans: Array<{
    id: string
    condition: string
    start_date: string
    end_date?: string
    goals: Array<{
      description: string
      target_date: string
      status: 'ACTIVE' | 'ACHIEVED' | 'DISCONTINUED'
      progress: string
    }>
    interventions: Array<{
      intervention: string
      frequency: string
      provider: string
      status: 'ACTIVE' | 'COMPLETED' | 'DISCONTINUED'
    }>
  }>
  advance_directives: {
    living_will: boolean
    healthcare_proxy: boolean
    do_not_resuscitate: boolean
    organ_donation: boolean
    documents: Array<{
      type: string
      date: string
      witness: string
      file_path: string
    }>
  }
  access_log: Array<{
    user_id: string
    user_name: string
    access_type: 'VIEW' | 'EDIT' | 'PRINT' | 'EXPORT'
    timestamp: string
    ip_address: string
    purpose: string
  }>
  created_at: string
  updated_at: string
}

export interface CreateMedicalRecordData {
  patient_id: string
  primary_health_unit_id: string
  access_level: 'PUBLIC' | 'RESTRICTED' | 'CONFIDENTIAL'
  demographic_data: {
    address: {
      street: string
      number: string
      complement?: string
      neighborhood: string
      city: string
      state: string
      zipcode: string
    }
    contact: {
      phone?: string
      mobile?: string
      email?: string
    }
    education_level: string
    occupation: string
    marital_status: string
    emergency_contact: {
      name: string
      relationship: string
      phone: string
    }
  }
  clinical_summary: {
    allergies?: Array<{
      allergen: string
      type: 'MEDICATION' | 'FOOD' | 'ENVIRONMENTAL' | 'OTHER'
      severity: 'MILD' | 'MODERATE' | 'SEVERE' | 'ANAPHYLACTIC'
      reaction: string
      onset_date: string
    }>
    chronic_conditions?: Array<{
      condition: string
      icd10_code: string
      diagnosis_date: string
      severity: 'MILD' | 'MODERATE' | 'SEVERE'
      status: 'ACTIVE' | 'CONTROLLED' | 'REMISSION' | 'CURED'
    }>
    medications?: Array<{
      name: string
      generic_name: string
      dosage: string
      frequency: string
      route: 'ORAL' | 'TOPICAL' | 'INJECTION' | 'INHALATION' | 'OTHER'
      start_date: string
      prescribing_doctor: string
      indication: string
    }>
    risk_factors?: Array<{
      factor: 'SMOKING' | 'ALCOHOLISM' | 'DRUG_USE' | 'SEDENTARY' | 'OBESITY' | 'HYPERTENSION' | 'DIABETES' | 'FAMILY_HISTORY' | 'OCCUPATIONAL'
      severity: 'LOW' | 'MODERATE' | 'HIGH'
      onset_date: string
      notes: string
    }>
    vital_signs_baseline?: {
      blood_pressure: {
        systolic: number
        diastolic: number
      }
      heart_rate: number
      weight: number
      height: number
      bmi: number
      blood_type: string
    }
  }
}

export interface MedicalRecordFilters {
  patient_id?: string
  patient_name?: string
  patient_cpf?: string
  record_number?: string
  status?: 'ACTIVE' | 'ARCHIVED' | 'BLOCKED' | 'TRANSFERRED'
  access_level?: 'PUBLIC' | 'RESTRICTED' | 'CONFIDENTIAL'
  primary_health_unit_id?: string
  chronic_condition?: string
  medication?: string
  allergy?: string
  last_visit_from?: string
  last_visit_to?: string
  created_from?: string
  created_to?: string
}

export const useMedicalRecords = () => {
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchMedicalRecords = useCallback(async (filters?: MedicalRecordFilters) => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.get('/health/medical-records', { params: filters })
      setMedicalRecords(response.data)
    } catch (err) {
      setError('Falha ao carregar prontuários médicos')
      console.error('Error fetching medical records:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  const getMedicalRecordById = useCallback(async (id: string): Promise<MedicalRecord | null> => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.get(`/health/medical-records/${id}`)
      return response.data
    } catch (err) {
      setError('Falha ao carregar prontuário médico')
      console.error('Error fetching medical record:', err)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const getMedicalRecordByPatient = useCallback(async (patientId: string): Promise<MedicalRecord | null> => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.get(`/health/medical-records/patient/${patientId}`)
      return response.data
    } catch (err) {
      setError('Falha ao carregar prontuário do paciente')
      console.error('Error fetching patient medical record:', err)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const createMedicalRecord = useCallback(async (data: CreateMedicalRecordData): Promise<MedicalRecord | null> => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.post('/health/medical-records', data)
      const newMedicalRecord = response.data
      setMedicalRecords(prev => [...prev, newMedicalRecord])
      return newMedicalRecord
    } catch (err) {
      setError('Falha ao criar prontuário médico')
      console.error('Error creating medical record:', err)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const updateMedicalRecord = useCallback(async (id: string, data: Partial<CreateMedicalRecordData>): Promise<MedicalRecord | null> => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.put(`/health/medical-records/${id}`, data)
      const updatedMedicalRecord = response.data
      setMedicalRecords(prev => prev.map(record => record.id === id ? updatedMedicalRecord : record))
      return updatedMedicalRecord
    } catch (err) {
      setError('Falha ao atualizar prontuário médico')
      console.error('Error updating medical record:', err)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const updateStatus = useCallback(async (id: string, status: 'ACTIVE' | 'ARCHIVED' | 'BLOCKED' | 'TRANSFERRED'): Promise<boolean> => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.patch(`/health/medical-records/${id}/status`, { status })
      const updatedMedicalRecord = response.data
      setMedicalRecords(prev => prev.map(record => record.id === id ? updatedMedicalRecord : record))
      return true
    } catch (err) {
      setError('Falha ao atualizar status do prontuário')
      console.error('Error updating medical record status:', err)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const addConsultation = useCallback(async (recordId: string, consultation: {
    date: string
    type: 'CONSULTATION' | 'EMERGENCY' | 'PREVENTIVE' | 'FOLLOW_UP'
    health_center: string
    doctor: {
      name: string
      crm: string
      specialty: string
    }
    chief_complaint: string
    diagnosis: Array<{
      icd10_code: string
      description: string
      type: 'PRIMARY' | 'SECONDARY'
    }>
    treatment: string
    follow_up_required: boolean
  }): Promise<boolean> => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.post(`/health/medical-records/${recordId}/consultations`, consultation)
      const updatedMedicalRecord = response.data
      setMedicalRecords(prev => prev.map(record => record.id === recordId ? updatedMedicalRecord : record))
      return true
    } catch (err) {
      setError('Falha ao adicionar consulta')
      console.error('Error adding consultation:', err)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const addLabResult = useCallback(async (recordId: string, labResult: {
    order_date: string
    collection_date: string
    result_date: string
    laboratory: string
    ordering_doctor: string
    tests: Array<{
      test_code: string
      test_name: string
      result: string
      reference_range: string
      unit: string
      status: 'NORMAL' | 'ABNORMAL' | 'CRITICAL' | 'PENDING'
      interpretation: string
    }>
    clinical_context: string
  }): Promise<boolean> => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.post(`/health/medical-records/${recordId}/lab-results`, labResult)
      const updatedMedicalRecord = response.data
      setMedicalRecords(prev => prev.map(record => record.id === recordId ? updatedMedicalRecord : record))
      return true
    } catch (err) {
      setError('Falha ao adicionar resultado laboratorial')
      console.error('Error adding lab result:', err)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const addImagingStudy = useCallback(async (recordId: string, imaging: {
    order_date: string
    exam_date: string
    type: 'X_RAY' | 'CT_SCAN' | 'MRI' | 'ULTRASOUND' | 'MAMMOGRAPHY' | 'NUCLEAR_MEDICINE' | 'OTHER'
    body_part: string
    indication: string
    facility: string
    radiologist: string
    findings: string
    impression: string
    recommendations: string
    images_available: boolean
  }): Promise<boolean> => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.post(`/health/medical-records/${recordId}/imaging`, imaging)
      const updatedMedicalRecord = response.data
      setMedicalRecords(prev => prev.map(record => record.id === recordId ? updatedMedicalRecord : record))
      return true
    } catch (err) {
      setError('Falha ao adicionar exame de imagem')
      console.error('Error adding imaging study:', err)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const addVaccination = useCallback(async (recordId: string, vaccination: {
    vaccine: string
    date: string
    dose_number: number
    lot_number: string
    manufacturer: string
    vaccination_site: string
    administrator: string
    adverse_reactions?: Array<{
      reaction: string
      severity: 'MILD' | 'MODERATE' | 'SEVERE'
      onset_time: string
      duration: string
      treatment: string
    }>
  }): Promise<boolean> => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.post(`/health/medical-records/${recordId}/vaccinations`, vaccination)
      const updatedMedicalRecord = response.data
      setMedicalRecords(prev => prev.map(record => record.id === recordId ? updatedMedicalRecord : record))
      return true
    } catch (err) {
      setError('Falha ao adicionar vacinação')
      console.error('Error adding vaccination:', err)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const updateAllergy = useCallback(async (recordId: string, allergy: {
    allergen: string
    type: 'MEDICATION' | 'FOOD' | 'ENVIRONMENTAL' | 'OTHER'
    severity: 'MILD' | 'MODERATE' | 'SEVERE' | 'ANAPHYLACTIC'
    reaction: string
    onset_date: string
    status: 'ACTIVE' | 'RESOLVED' | 'SUSPECTED'
  }): Promise<boolean> => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.post(`/health/medical-records/${recordId}/allergies`, allergy)
      const updatedMedicalRecord = response.data
      setMedicalRecords(prev => prev.map(record => record.id === recordId ? updatedMedicalRecord : record))
      return true
    } catch (err) {
      setError('Falha ao atualizar alergia')
      console.error('Error updating allergy:', err)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const addMedication = useCallback(async (recordId: string, medication: {
    name: string
    generic_name: string
    dosage: string
    frequency: string
    route: 'ORAL' | 'TOPICAL' | 'INJECTION' | 'INHALATION' | 'OTHER'
    start_date: string
    end_date?: string
    prescribing_doctor: string
    indication: string
  }): Promise<boolean> => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.post(`/health/medical-records/${recordId}/medications`, medication)
      const updatedMedicalRecord = response.data
      setMedicalRecords(prev => prev.map(record => record.id === recordId ? updatedMedicalRecord : record))
      return true
    } catch (err) {
      setError('Falha ao adicionar medicação')
      console.error('Error adding medication:', err)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const logAccess = useCallback(async (recordId: string, accessData: {
    access_type: 'VIEW' | 'EDIT' | 'PRINT' | 'EXPORT'
    purpose: string
  }): Promise<boolean> => {
    try {
      const response = await apiClient.post(`/health/medical-records/${recordId}/access-log`, accessData)
      const updatedMedicalRecord = response.data
      setMedicalRecords(prev => prev.map(record => record.id === recordId ? updatedMedicalRecord : record))
      return true
    } catch (err) {
      console.error('Error logging access:', err)
      return false
    }
  }, [])

  const getActiveMedicalRecords = useCallback(() => {
    return medicalRecords.filter(record => record.status === 'ACTIVE')
  }, [medicalRecords])

  const getMedicalRecordsByHealthUnit = useCallback((healthUnitId: string) => {
    return medicalRecords.filter(record => record.primary_health_unit.id === healthUnitId)
  }, [medicalRecords])

  const getPatientsByChronicCondition = useCallback((condition: string) => {
    return medicalRecords.filter(record =>
      record.clinical_summary.chronic_conditions.some(cc => cc.condition.toLowerCase().includes(condition.toLowerCase()))
    )
  }, [medicalRecords])

  const getPatientsWithAllergies = useCallback((allergen?: string) => {
    return medicalRecords.filter(record => {
      const hasAllergies = record.clinical_summary.allergies.length > 0
      if (!allergen) return hasAllergies
      return record.clinical_summary.allergies.some(allergy =>
        allergy.allergen.toLowerCase().includes(allergen.toLowerCase())
      )
    })
  }, [medicalRecords])

  const getPatientsOnMedication = useCallback((medication?: string) => {
    return medicalRecords.filter(record => {
      const hasActiveMedications = record.clinical_summary.medications.some(med => med.status === 'ACTIVE')
      if (!medication) return hasActiveMedications
      return record.clinical_summary.medications.some(med =>
        med.status === 'ACTIVE' && (
          med.name.toLowerCase().includes(medication.toLowerCase()) ||
          med.generic_name.toLowerCase().includes(medication.toLowerCase())
        )
      )
    })
  }, [medicalRecords])

  const getIncompleteVaccinations = useCallback(() => {
    return medicalRecords.filter(record =>
      record.immunization_record.immunization_status === 'INCOMPLETE' ||
      record.immunization_record.immunization_status === 'DELAYED'
    )
  }, [medicalRecords])

  const getRecentConsultations = useCallback((days: number = 30) => {
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - days)

    return medicalRecords.filter(record =>
      record.medical_history.consultations.some(consultation =>
        new Date(consultation.date) >= cutoffDate
      )
    )
  }, [medicalRecords])

  useEffect(() => {
    fetchMedicalRecords()
  }, [fetchMedicalRecords])

  return {
    medicalRecords,
    loading,
    error,
    fetchMedicalRecords,
    getMedicalRecordById,
    getMedicalRecordByPatient,
    createMedicalRecord,
    updateMedicalRecord,
    updateStatus,
    addConsultation,
    addLabResult,
    addImagingStudy,
    addVaccination,
    updateAllergy,
    addMedication,
    logAccess,
    getActiveMedicalRecords,
    getMedicalRecordsByHealthUnit,
    getPatientsByChronicCondition,
    getPatientsWithAllergies,
    getPatientsOnMedication,
    getIncompleteVaccinations,
    getRecentConsultations
  }
}