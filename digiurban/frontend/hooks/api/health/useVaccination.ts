import { useState, useEffect, useCallback } from 'react'
import { apiClient } from '@/lib/api'

export interface VaccinationRecord {
  id: string
  protocol: string
  patient: {
    id: string
    name: string
    cpf: string
    sus_card: string
    birth_date: string
    phone?: string
    address: {
      neighborhood: string
      city: string
    }
  }
  vaccine: {
    name: string
    type: 'ROUTINE' | 'CAMPAIGN' | 'TRAVEL' | 'OCCUPATIONAL' | 'SPECIAL_POPULATION'
    manufacturer: string
    batch_lot: string
    expiration_date: string
    storage_temperature: number
    composition: Array<string>
    contraindications: Array<string>
  }
  administration: {
    date: string
    time: string
    dose_number: number
    total_doses_required: number
    route: 'INTRAMUSCULAR' | 'SUBCUTANEOUS' | 'ORAL' | 'INTRANASAL' | 'INTRADERMAL'
    site: 'LEFT_ARM' | 'RIGHT_ARM' | 'LEFT_THIGH' | 'RIGHT_THIGH' | 'ORAL' | 'NASAL'
    volume: number
    health_center: {
      id: string
      name: string
      address: string
    }
    administrator: {
      name: string
      registration: string
      role: 'NURSE' | 'DOCTOR' | 'TECHNICIAN'
    }
  }
  pre_vaccination: {
    screening_completed: boolean
    contraindications_checked: boolean
    allergies_verified: boolean
    vital_signs: {
      temperature: number
      blood_pressure?: {
        systolic: number
        diastolic: number
      }
      weight?: number
    }
    consent_obtained: boolean
    consent_type: 'PATIENT' | 'GUARDIAN' | 'LEGAL_REPRESENTATIVE'
    pre_medication?: Array<{
      medication: string
      reason: string
      time_before: number
    }>
  }
  post_vaccination: {
    observation_period: number
    adverse_reactions: Array<{
      type: 'LOCAL' | 'SYSTEMIC' | 'ALLERGIC' | 'NEUROLOGICAL' | 'OTHER'
      description: string
      severity: 'MILD' | 'MODERATE' | 'SEVERE' | 'LIFE_THREATENING'
      onset_time: number
      duration: number
      treatment_given: string
      outcome: 'RESOLVED' | 'ONGOING' | 'HOSPITALIZED' | 'DEATH'
      reported_to_authorities: boolean
    }>
    follow_up_required: boolean
    follow_up_date?: string
    patient_education_provided: boolean
    vaccination_card_updated: boolean
  }
  immunization_schedule: {
    vaccine_schedule: string
    age_appropriate: boolean
    delayed_vaccination: boolean
    delay_reason?: string
    next_dose_due?: string
    next_vaccine_type?: string
    catch_up_schedule?: Array<{
      vaccine: string
      due_date: string
      priority: 'HIGH' | 'MEDIUM' | 'LOW'
    }>
  }
  campaign_data?: {
    campaign_id: string
    campaign_name: string
    target_population: string
    start_date: string
    end_date: string
    coverage_goal: number
    priority_groups: Array<string>
  }
  documentation: {
    vaccination_certificate_issued: boolean
    si_pni_updated: boolean
    state_system_updated: boolean
    international_certificate?: {
      issued: boolean
      certificate_number: string
      valid_until: string
    }
    adverse_event_form?: {
      completed: boolean
      form_number: string
      submitted_date: string
    }
  }
  quality_control: {
    cold_chain_maintained: boolean
    vaccine_viability_checked: boolean
    aseptic_technique: boolean
    waste_disposal_proper: boolean
    documentation_complete: boolean
  }
  status: 'COMPLETED' | 'PARTIAL' | 'CANCELLED' | 'ADVERSE_REACTION' | 'PENDING_FOLLOWUP'
  created_at: string
  updated_at: string
}

export interface VaccineInventory {
  id: string
  vaccine_name: string
  manufacturer: string
  batch_lot: string
  expiration_date: string
  quantity_received: number
  quantity_available: number
  quantity_administered: number
  quantity_wasted: number
  storage_temperature: number
  storage_location: string
  cost_per_dose: number
  supplier: string
  received_date: string
  status: 'AVAILABLE' | 'LOW_STOCK' | 'OUT_OF_STOCK' | 'EXPIRED' | 'RECALLED'
  minimum_stock_level: number
  reorder_point: number
  created_at: string
  updated_at: string
}

export interface VaccinationCampaign {
  id: string
  name: string
  type: 'ROUTINE' | 'MASS' | 'SELECTIVE' | 'EMERGENCY' | 'CATCH_UP'
  status: 'PLANNING' | 'ACTIVE' | 'COMPLETED' | 'SUSPENDED' | 'CANCELLED'
  vaccines: Array<{
    name: string
    target_doses: number
    achieved_doses: number
  }>
  target_population: {
    age_groups: Array<{
      min_age: number
      max_age: number
      age_unit: 'DAYS' | 'MONTHS' | 'YEARS'
    }>
    special_groups: Array<'PREGNANT' | 'IMMUNOCOMPROMISED' | 'HEALTHCARE_WORKERS' | 'TEACHERS' | 'ELDERLY'>
    geographic_areas: Array<string>
    estimated_population: number
  }
  schedule: {
    start_date: string
    end_date: string
    daily_hours: {
      start_time: string
      end_time: string
    }
    special_dates: Array<{
      date: string
      extended_hours: boolean
      description: string
    }>
  }
  locations: Array<{
    health_center_id: string
    health_center_name: string
    daily_capacity: number
    assigned_staff: number
    operating_hours: string
  }>
  goals: {
    coverage_target: number
    daily_target: number
    priority_areas: Array<string>
  }
  logistics: {
    vaccine_allocation: Array<{
      location_id: string
      vaccine_name: string
      allocated_doses: number
    }>
    staff_training_completed: boolean
    equipment_distributed: boolean
    communication_materials: Array<string>
  }
  monitoring: {
    daily_reports: Array<{
      date: string
      doses_administered: number
      coverage_achieved: number
      adverse_events: number
    }>
    weekly_coverage: Array<{
      week: string
      coverage_percentage: number
      target_vs_achieved: number
    }>
  }
  created_at: string
  updated_at: string
}

export interface CreateVaccinationRecordData {
  patient_id: string
  vaccine: {
    name: string
    type: 'ROUTINE' | 'CAMPAIGN' | 'TRAVEL' | 'OCCUPATIONAL' | 'SPECIAL_POPULATION'
    manufacturer: string
    batch_lot: string
  }
  administration: {
    date: string
    time: string
    dose_number: number
    total_doses_required: number
    route: 'INTRAMUSCULAR' | 'SUBCUTANEOUS' | 'ORAL' | 'INTRANASAL' | 'INTRADERMAL'
    site: 'LEFT_ARM' | 'RIGHT_ARM' | 'LEFT_THIGH' | 'RIGHT_THIGH' | 'ORAL' | 'NASAL'
    volume: number
    health_center_id: string
    administrator: {
      name: string
      registration: string
      role: 'NURSE' | 'DOCTOR' | 'TECHNICIAN'
    }
  }
  pre_vaccination: {
    screening_completed: boolean
    contraindications_checked: boolean
    allergies_verified: boolean
    vital_signs: {
      temperature: number
      blood_pressure?: {
        systolic: number
        diastolic: number
      }
      weight?: number
    }
    consent_obtained: boolean
    consent_type: 'PATIENT' | 'GUARDIAN' | 'LEGAL_REPRESENTATIVE'
  }
  campaign_id?: string
}

export interface VaccinationFilters {
  patient_id?: string
  patient_name?: string
  patient_cpf?: string
  vaccine_name?: string
  vaccine_type?: 'ROUTINE' | 'CAMPAIGN' | 'TRAVEL' | 'OCCUPATIONAL' | 'SPECIAL_POPULATION'
  health_center_id?: string
  administrator?: string
  date_from?: string
  date_to?: string
  dose_number?: number
  campaign_id?: string
  status?: 'COMPLETED' | 'PARTIAL' | 'CANCELLED' | 'ADVERSE_REACTION' | 'PENDING_FOLLOWUP'
  has_adverse_reactions?: boolean
  batch_lot?: string
  age_group?: string
  neighborhood?: string
  created_from?: string
  created_to?: string
}

export const useVaccination = () => {
  const [vaccinations, setVaccinations] = useState<VaccinationRecord[]>([])
  const [inventory, setInventory] = useState<VaccineInventory[]>([])
  const [campaigns, setCampaigns] = useState<VaccinationCampaign[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchVaccinations = useCallback(async (filters?: VaccinationFilters) => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.get('/health/vaccinations', { params: filters })
      setVaccinations(response.data)
    } catch (err) {
      setError('Falha ao carregar registros de vacinação')
      console.error('Error fetching vaccinations:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchInventory = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.get('/health/vaccine-inventory')
      setInventory(response.data)
    } catch (err) {
      setError('Falha ao carregar estoque de vacinas')
      console.error('Error fetching vaccine inventory:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchCampaigns = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.get('/health/vaccination-campaigns')
      setCampaigns(response.data)
    } catch (err) {
      setError('Falha ao carregar campanhas de vacinação')
      console.error('Error fetching vaccination campaigns:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  const createVaccination = useCallback(async (data: CreateVaccinationRecordData): Promise<VaccinationRecord | null> => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.post('/health/vaccinations', data)
      const newVaccination = response.data
      setVaccinations(prev => [...prev, newVaccination])
      return newVaccination
    } catch (err) {
      setError('Falha ao registrar vacinação')
      console.error('Error creating vaccination:', err)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const updateVaccination = useCallback(async (id: string, data: Partial<CreateVaccinationRecordData>): Promise<VaccinationRecord | null> => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.put(`/health/vaccinations/${id}`, data)
      const updatedVaccination = response.data
      setVaccinations(prev => prev.map(vacc => vacc.id === id ? updatedVaccination : vacc))
      return updatedVaccination
    } catch (err) {
      setError('Falha ao atualizar vacinação')
      console.error('Error updating vaccination:', err)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const recordAdverseReaction = useCallback(async (vaccinationId: string, reaction: {
    type: 'LOCAL' | 'SYSTEMIC' | 'ALLERGIC' | 'NEUROLOGICAL' | 'OTHER'
    description: string
    severity: 'MILD' | 'MODERATE' | 'SEVERE' | 'LIFE_THREATENING'
    onset_time: number
    duration: number
    treatment_given: string
    outcome: 'RESOLVED' | 'ONGOING' | 'HOSPITALIZED' | 'DEATH'
  }): Promise<boolean> => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.post(`/health/vaccinations/${vaccinationId}/adverse-reaction`, reaction)
      const updatedVaccination = response.data
      setVaccinations(prev => prev.map(vacc => vacc.id === vaccinationId ? updatedVaccination : vacc))
      return true
    } catch (err) {
      setError('Falha ao registrar reação adversa')
      console.error('Error recording adverse reaction:', err)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const updateInventory = useCallback(async (inventoryId: string, update: {
    quantity_administered?: number
    quantity_wasted?: number
    status?: 'AVAILABLE' | 'LOW_STOCK' | 'OUT_OF_STOCK' | 'EXPIRED' | 'RECALLED'
  }): Promise<boolean> => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.patch(`/health/vaccine-inventory/${inventoryId}`, update)
      const updatedInventory = response.data
      setInventory(prev => prev.map(inv => inv.id === inventoryId ? updatedInventory : inv))
      return true
    } catch (err) {
      setError('Falha ao atualizar estoque')
      console.error('Error updating inventory:', err)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const createCampaign = useCallback(async (campaign: Omit<VaccinationCampaign, 'id' | 'created_at' | 'updated_at' | 'monitoring'>): Promise<VaccinationCampaign | null> => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.post('/health/vaccination-campaigns', campaign)
      const newCampaign = response.data
      setCampaigns(prev => [...prev, newCampaign])
      return newCampaign
    } catch (err) {
      setError('Falha ao criar campanha')
      console.error('Error creating campaign:', err)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const updateCampaignStatus = useCallback(async (campaignId: string, status: 'PLANNING' | 'ACTIVE' | 'COMPLETED' | 'SUSPENDED' | 'CANCELLED'): Promise<boolean> => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.patch(`/health/vaccination-campaigns/${campaignId}/status`, { status })
      const updatedCampaign = response.data
      setCampaigns(prev => prev.map(camp => camp.id === campaignId ? updatedCampaign : camp))
      return true
    } catch (err) {
      setError('Falha ao atualizar status da campanha')
      console.error('Error updating campaign status:', err)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const recordCampaignProgress = useCallback(async (campaignId: string, progress: {
    date: string
    doses_administered: number
    coverage_achieved: number
    adverse_events: number
  }): Promise<boolean> => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.post(`/health/vaccination-campaigns/${campaignId}/progress`, progress)
      const updatedCampaign = response.data
      setCampaigns(prev => prev.map(camp => camp.id === campaignId ? updatedCampaign : camp))
      return true
    } catch (err) {
      setError('Falha ao registrar progresso da campanha')
      console.error('Error recording campaign progress:', err)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const generateVaccinationCertificate = useCallback(async (patientId: string, vaccineNames?: Array<string>): Promise<boolean> => {
    try {
      setLoading(true)
      setError(null)
      await apiClient.post(`/health/vaccinations/certificate/${patientId}`, { vaccines: vaccineNames })
      return true
    } catch (err) {
      setError('Falha ao gerar certificado')
      console.error('Error generating certificate:', err)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const getPatientVaccinations = useCallback((patientId: string) => {
    return vaccinations.filter(vacc => vacc.patient.id === patientId)
  }, [vaccinations])

  const getVaccinationsByVaccine = useCallback((vaccineName: string) => {
    return vaccinations.filter(vacc => vacc.vaccine.name === vaccineName)
  }, [vaccinations])

  const getAdverseReactions = useCallback(() => {
    return vaccinations.filter(vacc => vacc.post_vaccination.adverse_reactions.length > 0)
  }, [vaccinations])

  const getLowStockVaccines = useCallback(() => {
    return inventory.filter(inv => inv.quantity_available <= inv.minimum_stock_level)
  }, [inventory])

  const getExpiredVaccines = useCallback(() => {
    const today = new Date()
    return inventory.filter(inv => new Date(inv.expiration_date) <= today)
  }, [inventory])

  const getActiveCampaigns = useCallback(() => {
    return campaigns.filter(camp => camp.status === 'ACTIVE')
  }, [campaigns])

  const getCampaignCoverage = useCallback((campaignId: string) => {
    const campaign = campaigns.find(camp => camp.id === campaignId)
    if (!campaign) return 0

    const totalTarget = campaign.target_population.estimated_population
    const totalAchieved = campaign.vaccines.reduce((sum, vaccine) => sum + vaccine.achieved_doses, 0)

    return totalTarget > 0 ? (totalAchieved / totalTarget) * 100 : 0
  }, [campaigns])

  const getVaccinationStats = useCallback(() => {
    const total = vaccinations.length
    const withAdverseReactions = vaccinations.filter(v => v.post_vaccination.adverse_reactions.length > 0).length
    const completed = vaccinations.filter(v => v.status === 'COMPLETED').length

    return {
      total,
      completed,
      adverseReactionRate: total > 0 ? (withAdverseReactions / total) * 100 : 0,
      completionRate: total > 0 ? (completed / total) * 100 : 0
    }
  }, [vaccinations])

  useEffect(() => {
    fetchVaccinations()
    fetchInventory()
    fetchCampaigns()
  }, [fetchVaccinations, fetchInventory, fetchCampaigns])

  return {
    vaccinations,
    inventory,
    campaigns,
    loading,
    error,
    fetchVaccinations,
    fetchInventory,
    fetchCampaigns,
    createVaccination,
    updateVaccination,
    recordAdverseReaction,
    updateInventory,
    createCampaign,
    updateCampaignStatus,
    recordCampaignProgress,
    generateVaccinationCertificate,
    getPatientVaccinations,
    getVaccinationsByVaccine,
    getAdverseReactions,
    getLowStockVaccines,
    getExpiredVaccines,
    getActiveCampaigns,
    getCampaignCoverage,
    getVaccinationStats
  }
}