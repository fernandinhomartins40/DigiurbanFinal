import { useState, useEffect, useCallback } from 'react'
import { apiClient } from '@/lib/api'

export interface MedicalAppointment {
  id: string
  protocol: string
  type: 'CONSULTATION' | 'RETURN' | 'PROCEDURE' | 'PREVENTIVE' | 'EMERGENCY' | 'TELEMEDICINE' | 'HOME_VISIT'
  status: 'SCHEDULED' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW' | 'RESCHEDULED'
  priority: 'ROUTINE' | 'URGENT' | 'EMERGENCY' | 'ELECTIVE'
  patient: {
    id: string
    name: string
    cpf: string
    sus_card: string
    birth_date: string
    phone?: string
    address: {
      street: string
      neighborhood: string
      city: string
    }
  }
  doctor: {
    id: string
    name: string
    crm: string
    specialty: string
    phone: string
    email: string
  }
  health_center: {
    id: string
    name: string
    type: string
    address: string
    phone: string
  }
  schedule: {
    date: string
    time: string
    duration: number
    room: string
    estimated_end_time: string
    actual_start_time?: string
    actual_end_time?: string
  }
  reason: {
    chief_complaint: string
    symptoms: Array<string>
    duration: string
    previous_treatments: Array<string>
    referring_doctor?: string
    referral_reason?: string
  }
  clinical_data: {
    vital_signs?: {
      temperature: number
      blood_pressure: {
        systolic: number
        diastolic: number
      }
      heart_rate: number
      respiratory_rate: number
      oxygen_saturation: number
      weight: number
      height: number
      bmi: number
    }
    anamnesis?: {
      history_of_present_illness: string
      past_medical_history: Array<string>
      medications: Array<{
        name: string
        dosage: string
        frequency: string
      }>
      allergies: Array<string>
      family_history: Array<string>
      social_history: string
    }
    physical_examination?: {
      general_appearance: string
      head_neck: string
      cardiovascular: string
      respiratory: string
      abdomen: string
      extremities: string
      neurological: string
      skin: string
      other_findings: string
    }
  }
  diagnosis: {
    primary_diagnosis: {
      icd10_code: string
      description: string
      certainty: 'CONFIRMED' | 'PROBABLE' | 'SUSPECTED' | 'RULE_OUT'
    }
    secondary_diagnoses: Array<{
      icd10_code: string
      description: string
      certainty: 'CONFIRMED' | 'PROBABLE' | 'SUSPECTED' | 'RULE_OUT'
    }>
    differential_diagnoses: Array<{
      icd10_code: string
      description: string
      probability: number
    }>
  }
  treatment: {
    prescriptions: Array<{
      medication: string
      dosage: string
      frequency: string
      duration: string
      instructions: string
      generic_substitution: boolean
    }>
    procedures: Array<{
      procedure_code: string
      description: string
      date: string
      status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED'
      notes: string
    }>
    referrals: Array<{
      specialty: string
      doctor_name?: string
      health_center?: string
      urgency: 'ROUTINE' | 'URGENT' | 'EMERGENCY'
      reason: string
      scheduled_date?: string
    }>
    recommendations: Array<{
      type: 'LIFESTYLE' | 'DIET' | 'EXERCISE' | 'FOLLOW_UP' | 'PREVENTION'
      description: string
      duration?: string
    }>
  }
  exams_requested: Array<{
    exam_code: string
    exam_name: string
    urgency: 'ROUTINE' | 'URGENT' | 'EMERGENCY'
    instructions: string
    scheduled_date?: string
    result?: {
      date: string
      result: string
      interpretation: string
      doctor_review: string
    }
  }>
  follow_up: {
    return_visit: boolean
    return_date?: string
    return_reason?: string
    monitoring_required: boolean
    monitoring_frequency?: string
    alert_conditions: Array<string>
  }
  billing: {
    sus_procedure_code?: string
    procedure_value: number
    payment_source: 'SUS' | 'PRIVATE' | 'INSURANCE' | 'MUNICIPAL'
    authorization_number?: string
    billing_status: 'PENDING' | 'AUTHORIZED' | 'PAID' | 'REJECTED'
  }
  quality_metrics: {
    waiting_time: number
    consultation_duration: number
    patient_satisfaction?: number
    treatment_adherence?: number
    resolution_rate?: number
  }
  documentation: {
    medical_record_updated: boolean
    prescription_printed: boolean
    exam_requests_printed: boolean
    patient_orientations_given: boolean
    referral_letters_issued: boolean
    medical_certificate_issued: boolean
    work_leave_certificate?: {
      issued: boolean
      days: number
      start_date: string
    }
  }
  telemedicine?: {
    platform: string
    session_id: string
    connection_quality: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR'
    technical_issues: Array<string>
    consultation_recording: boolean
    consent_obtained: boolean
  }
  emergency_data?: {
    triage_category: 'RED' | 'YELLOW' | 'GREEN' | 'BLUE' | 'WHITE'
    arrival_time: string
    triage_nurse: string
    chief_complaint: string
    vital_signs_on_arrival: {
      temperature: number
      blood_pressure: {
        systolic: number
        diastolic: number
      }
      heart_rate: number
      respiratory_rate: number
      oxygen_saturation: number
      glasgow_coma_scale: number
    }
    disposition: 'DISCHARGE' | 'ADMISSION' | 'TRANSFER' | 'OBSERVATION' | 'AMA'
  }
  notes: {
    doctor_notes: string
    nursing_notes: Array<{
      time: string
      nurse: string
      note: string
    }>
    administrative_notes: Array<{
      time: string
      user: string
      note: string
    }>
  }
  created_at: string
  updated_at: string
}

export interface CreateMedicalAppointmentData {
  type: 'CONSULTATION' | 'RETURN' | 'PROCEDURE' | 'PREVENTIVE' | 'EMERGENCY' | 'TELEMEDICINE' | 'HOME_VISIT'
  priority: 'ROUTINE' | 'URGENT' | 'EMERGENCY' | 'ELECTIVE'
  patient_id: string
  doctor_id: string
  health_center_id: string
  schedule: {
    date: string
    time: string
    duration: number
    room: string
  }
  reason: {
    chief_complaint: string
    symptoms: Array<string>
    duration: string
    previous_treatments?: Array<string>
    referring_doctor?: string
    referral_reason?: string
  }
  billing?: {
    sus_procedure_code?: string
    procedure_value: number
    payment_source: 'SUS' | 'PRIVATE' | 'INSURANCE' | 'MUNICIPAL'
    authorization_number?: string
  }
  telemedicine?: {
    platform: string
    session_id: string
  }
}

export interface MedicalAppointmentFilters {
  protocol?: string
  type?: 'CONSULTATION' | 'RETURN' | 'PROCEDURE' | 'PREVENTIVE' | 'EMERGENCY' | 'TELEMEDICINE' | 'HOME_VISIT'
  status?: 'SCHEDULED' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW' | 'RESCHEDULED'
  priority?: 'ROUTINE' | 'URGENT' | 'EMERGENCY' | 'ELECTIVE'
  patient_id?: string
  patient_name?: string
  patient_cpf?: string
  doctor_id?: string
  doctor_name?: string
  doctor_crm?: string
  specialty?: string
  health_center_id?: string
  health_center_name?: string
  date_from?: string
  date_to?: string
  time_from?: string
  time_to?: string
  room?: string
  icd10_code?: string
  payment_source?: 'SUS' | 'PRIVATE' | 'INSURANCE' | 'MUNICIPAL'
  billing_status?: 'PENDING' | 'AUTHORIZED' | 'PAID' | 'REJECTED'
  has_follow_up?: boolean
  patient_satisfaction_min?: number
  created_from?: string
  created_to?: string
}

export const useMedicalAppointments = () => {
  const [appointments, setAppointments] = useState<MedicalAppointment[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchAppointments = useCallback(async (filters?: MedicalAppointmentFilters) => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.get('/health/appointments', { params: filters })
      setAppointments(response.data)
    } catch (err) {
      setError('Falha ao carregar consultas médicas')
      console.error('Error fetching medical appointments:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  const getAppointmentById = useCallback(async (id: string): Promise<MedicalAppointment | null> => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.get(`/health/appointments/${id}`)
      return response.data
    } catch (err) {
      setError('Falha ao carregar consulta médica')
      console.error('Error fetching medical appointment:', err)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const createAppointment = useCallback(async (data: CreateMedicalAppointmentData): Promise<MedicalAppointment | null> => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.post('/health/appointments', data)
      const newAppointment = response.data
      setAppointments(prev => [...prev, newAppointment])
      return newAppointment
    } catch (err) {
      setError('Falha ao criar consulta médica')
      console.error('Error creating medical appointment:', err)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const updateAppointment = useCallback(async (id: string, data: Partial<CreateMedicalAppointmentData>): Promise<MedicalAppointment | null> => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.put(`/health/appointments/${id}`, data)
      const updatedAppointment = response.data
      setAppointments(prev => prev.map(apt => apt.id === id ? updatedAppointment : apt))
      return updatedAppointment
    } catch (err) {
      setError('Falha ao atualizar consulta médica')
      console.error('Error updating medical appointment:', err)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const deleteAppointment = useCallback(async (id: string): Promise<boolean> => {
    try {
      setLoading(true)
      setError(null)
      await apiClient.delete(`/health/appointments/${id}`)
      setAppointments(prev => prev.filter(apt => apt.id !== id))
      return true
    } catch (err) {
      setError('Falha ao excluir consulta médica')
      console.error('Error deleting medical appointment:', err)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const updateStatus = useCallback(async (id: string, status: 'SCHEDULED' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW' | 'RESCHEDULED'): Promise<boolean> => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.patch(`/health/appointments/${id}/status`, { status })
      const updatedAppointment = response.data
      setAppointments(prev => prev.map(apt => apt.id === id ? updatedAppointment : apt))
      return true
    } catch (err) {
      setError('Falha ao atualizar status da consulta')
      console.error('Error updating appointment status:', err)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const startConsultation = useCallback(async (id: string): Promise<boolean> => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.post(`/health/appointments/${id}/start`)
      const updatedAppointment = response.data
      setAppointments(prev => prev.map(apt => apt.id === id ? updatedAppointment : apt))
      return true
    } catch (err) {
      setError('Falha ao iniciar consulta')
      console.error('Error starting consultation:', err)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const completeConsultation = useCallback(async (id: string, consultationData: {
    clinical_data?: {
      vital_signs?: {
        temperature: number
        blood_pressure: {
          systolic: number
          diastolic: number
        }
        heart_rate: number
        respiratory_rate: number
        oxygen_saturation: number
        weight: number
        height: number
      }
      anamnesis?: {
        history_of_present_illness: string
        past_medical_history: Array<string>
        medications: Array<{
          name: string
          dosage: string
          frequency: string
        }>
        allergies: Array<string>
        family_history: Array<string>
        social_history: string
      }
      physical_examination?: {
        general_appearance: string
        head_neck: string
        cardiovascular: string
        respiratory: string
        abdomen: string
        extremities: string
        neurological: string
        skin: string
        other_findings: string
      }
    }
    diagnosis: {
      primary_diagnosis: {
        icd10_code: string
        description: string
        certainty: 'CONFIRMED' | 'PROBABLE' | 'SUSPECTED' | 'RULE_OUT'
      }
      secondary_diagnoses?: Array<{
        icd10_code: string
        description: string
        certainty: 'CONFIRMED' | 'PROBABLE' | 'SUSPECTED' | 'RULE_OUT'
      }>
    }
    treatment?: {
      prescriptions?: Array<{
        medication: string
        dosage: string
        frequency: string
        duration: string
        instructions: string
        generic_substitution: boolean
      }>
      procedures?: Array<{
        procedure_code: string
        description: string
        date: string
        notes: string
      }>
      referrals?: Array<{
        specialty: string
        doctor_name?: string
        health_center?: string
        urgency: 'ROUTINE' | 'URGENT' | 'EMERGENCY'
        reason: string
      }>
      recommendations?: Array<{
        type: 'LIFESTYLE' | 'DIET' | 'EXERCISE' | 'FOLLOW_UP' | 'PREVENTION'
        description: string
        duration?: string
      }>
    }
    exams_requested?: Array<{
      exam_code: string
      exam_name: string
      urgency: 'ROUTINE' | 'URGENT' | 'EMERGENCY'
      instructions: string
    }>
    follow_up?: {
      return_visit: boolean
      return_date?: string
      return_reason?: string
      monitoring_required: boolean
      monitoring_frequency?: string
      alert_conditions: Array<string>
    }
    doctor_notes: string
  }): Promise<boolean> => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.post(`/health/appointments/${id}/complete`, consultationData)
      const updatedAppointment = response.data
      setAppointments(prev => prev.map(apt => apt.id === id ? updatedAppointment : apt))
      return true
    } catch (err) {
      setError('Falha ao finalizar consulta')
      console.error('Error completing consultation:', err)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const rescheduleAppointment = useCallback(async (id: string, newSchedule: {
    date: string
    time: string
    room?: string
    reason: string
  }): Promise<boolean> => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.post(`/health/appointments/${id}/reschedule`, newSchedule)
      const updatedAppointment = response.data
      setAppointments(prev => prev.map(apt => apt.id === id ? updatedAppointment : apt))
      return true
    } catch (err) {
      setError('Falha ao reagendar consulta')
      console.error('Error rescheduling appointment:', err)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const addExamResult = useCallback(async (appointmentId: string, examCode: string, result: {
    date: string
    result: string
    interpretation: string
    doctor_review: string
  }): Promise<boolean> => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.post(`/health/appointments/${appointmentId}/exam-results/${examCode}`, result)
      const updatedAppointment = response.data
      setAppointments(prev => prev.map(apt => apt.id === appointmentId ? updatedAppointment : apt))
      return true
    } catch (err) {
      setError('Falha ao adicionar resultado de exame')
      console.error('Error adding exam result:', err)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const addNursingNote = useCallback(async (appointmentId: string, note: {
    nurse: string
    note: string
  }): Promise<boolean> => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.post(`/health/appointments/${appointmentId}/nursing-notes`, note)
      const updatedAppointment = response.data
      setAppointments(prev => prev.map(apt => apt.id === appointmentId ? updatedAppointment : apt))
      return true
    } catch (err) {
      setError('Falha ao adicionar anotação de enfermagem')
      console.error('Error adding nursing note:', err)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const recordPatientSatisfaction = useCallback(async (appointmentId: string, satisfaction: number): Promise<boolean> => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.patch(`/health/appointments/${appointmentId}/satisfaction`, { satisfaction })
      const updatedAppointment = response.data
      setAppointments(prev => prev.map(apt => apt.id === appointmentId ? updatedAppointment : apt))
      return true
    } catch (err) {
      setError('Falha ao registrar satisfação do paciente')
      console.error('Error recording patient satisfaction:', err)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const getTodaysAppointments = useCallback(() => {
    const today = new Date().toISOString().split('T')[0]
    return appointments.filter(apt => apt.schedule.date === today)
  }, [appointments])

  const getAppointmentsByStatus = useCallback((status: 'SCHEDULED' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW' | 'RESCHEDULED') => {
    return appointments.filter(apt => apt.status === status)
  }, [appointments])

  const getAppointmentsByDoctor = useCallback((doctorId: string) => {
    return appointments.filter(apt => apt.doctor.id === doctorId)
  }, [appointments])

  const getAppointmentsByPatient = useCallback((patientId: string) => {
    return appointments.filter(apt => apt.patient.id === patientId)
  }, [appointments])

  const getEmergencyAppointments = useCallback(() => {
    return appointments.filter(apt => apt.priority === 'EMERGENCY' || apt.type === 'EMERGENCY')
  }, [appointments])

  const getAppointmentsRequiringFollowUp = useCallback(() => {
    return appointments.filter(apt => apt.follow_up.return_visit || apt.follow_up.monitoring_required)
  }, [appointments])

  const getTelemedicineAppointments = useCallback(() => {
    return appointments.filter(apt => apt.type === 'TELEMEDICINE')
  }, [appointments])

  const getAverageWaitingTime = useCallback(() => {
    const appointmentsWithWaitTime = appointments.filter(apt => apt.quality_metrics.waiting_time > 0)
    if (appointmentsWithWaitTime.length === 0) return 0

    const totalWaitTime = appointmentsWithWaitTime.reduce((total, apt) => total + apt.quality_metrics.waiting_time, 0)
    return totalWaitTime / appointmentsWithWaitTime.length
  }, [appointments])

  const getAverageConsultationDuration = useCallback(() => {
    const completedAppointments = appointments.filter(apt => apt.status === 'COMPLETED' && apt.quality_metrics.consultation_duration > 0)
    if (completedAppointments.length === 0) return 0

    const totalDuration = completedAppointments.reduce((total, apt) => total + apt.quality_metrics.consultation_duration, 0)
    return totalDuration / completedAppointments.length
  }, [appointments])

  const getNoShowRate = useCallback(() => {
    const totalScheduled = appointments.filter(apt => ['SCHEDULED', 'CONFIRMED', 'NO_SHOW', 'COMPLETED'].includes(apt.status)).length
    const noShows = appointments.filter(apt => apt.status === 'NO_SHOW').length

    return totalScheduled > 0 ? (noShows / totalScheduled) * 100 : 0
  }, [appointments])

  useEffect(() => {
    fetchAppointments()
  }, [fetchAppointments])

  return {
    appointments,
    loading,
    error,
    fetchAppointments,
    getAppointmentById,
    createAppointment,
    updateAppointment,
    deleteAppointment,
    updateStatus,
    startConsultation,
    completeConsultation,
    rescheduleAppointment,
    addExamResult,
    addNursingNote,
    recordPatientSatisfaction,
    getTodaysAppointments,
    getAppointmentsByStatus,
    getAppointmentsByDoctor,
    getAppointmentsByPatient,
    getEmergencyAppointments,
    getAppointmentsRequiringFollowUp,
    getTelemedicineAppointments,
    getAverageWaitingTime,
    getAverageConsultationDuration,
    getNoShowRate
  }
}