import { useState, useEffect, useCallback } from 'react'
import { apiClient } from '@/lib/api'

export interface PharmacyDispensing {
  id: string
  prescription_id: string
  patient: {
    id: string
    name: string
    cpf: string
    sus_card: string
    birth_date: string
  }
  prescribing_doctor: {
    name: string
    crm: string
    specialty: string
  }
  medications: Array<{
    name: string
    generic_name: string
    dosage: string
    quantity_prescribed: number
    quantity_dispensed: number
    unit: string
    instructions: string
    treatment_duration: number
    generic_substitution: boolean
    substituted_medication?: string
    cost: number
  }>
  dispensing_details: {
    dispensing_date: string
    pharmacist: {
      name: string
      crf: string
    }
    health_center: string
    partial_dispensing: boolean
    patient_counseling_provided: boolean
    adherence_assessment: boolean
  }
  status: 'DISPENSED' | 'PARTIAL' | 'REFUSED' | 'CANCELLED' | 'PENDING'
  created_at: string
  updated_at: string
}

export interface MedicationInventory {
  id: string
  medication_name: string
  generic_name: string
  therapeutic_class: string
  dosage_form: 'TABLET' | 'CAPSULE' | 'SYRUP' | 'INJECTION' | 'OINTMENT' | 'DROPS' | 'SPRAY'
  strength: string
  manufacturer: string
  batch_number: string
  expiration_date: string
  quantity_available: number
  unit_cost: number
  storage_conditions: string
  controlled_substance: boolean
  minimum_stock: number
  reorder_point: number
  supplier: string
  last_updated: string
  status: 'AVAILABLE' | 'LOW_STOCK' | 'OUT_OF_STOCK' | 'EXPIRED' | 'RECALLED'
}

export interface CreatePharmacyDispensingData {
  prescription_id: string
  patient_id: string
  prescribing_doctor: {
    name: string
    crm: string
    specialty: string
  }
  medications: Array<{
    name: string
    generic_name: string
    dosage: string
    quantity_prescribed: number
    quantity_dispensed: number
    unit: string
    instructions: string
    treatment_duration: number
    generic_substitution: boolean
    substituted_medication?: string
  }>
  dispensing_details: {
    pharmacist: {
      name: string
      crf: string
    }
    health_center: string
    patient_counseling_provided: boolean
    adherence_assessment: boolean
  }
}

export interface PharmacyFilters {
  patient_id?: string
  patient_name?: string
  patient_cpf?: string
  prescription_id?: string
  medication_name?: string
  pharmacist_crf?: string
  health_center?: string
  status?: 'DISPENSED' | 'PARTIAL' | 'REFUSED' | 'CANCELLED' | 'PENDING'
  date_from?: string
  date_to?: string
  controlled_substance?: boolean
  generic_substitution?: boolean
  created_from?: string
  created_to?: string
}

export const usePharmacy = () => {
  const [dispensings, setDispensings] = useState<PharmacyDispensing[]>([])
  const [inventory, setInventory] = useState<MedicationInventory[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchDispensings = useCallback(async (filters?: PharmacyFilters) => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.get('/health/pharmacy/dispensings', { params: filters })
      setDispensings(response.data)
    } catch (err) {
      setError('Falha ao carregar dispensações')
      console.error('Error fetching dispensings:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchInventory = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.get('/health/pharmacy/inventory')
      setInventory(response.data)
    } catch (err) {
      setError('Falha ao carregar estoque de medicamentos')
      console.error('Error fetching medication inventory:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  const createDispensing = useCallback(async (data: CreatePharmacyDispensingData): Promise<PharmacyDispensing | null> => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.post('/health/pharmacy/dispensings', data)
      const newDispensing = response.data
      setDispensings(prev => [...prev, newDispensing])
      return newDispensing
    } catch (err) {
      setError('Falha ao registrar dispensação')
      console.error('Error creating dispensing:', err)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const updateInventory = useCallback(async (medicationId: string, update: {
    quantity_available?: number
    unit_cost?: number
    status?: 'AVAILABLE' | 'LOW_STOCK' | 'OUT_OF_STOCK' | 'EXPIRED' | 'RECALLED'
    batch_number?: string
    expiration_date?: string
  }): Promise<boolean> => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.patch(`/health/pharmacy/inventory/${medicationId}`, update)
      const updatedMedication = response.data
      setInventory(prev => prev.map(med => med.id === medicationId ? updatedMedication : med))
      return true
    } catch (err) {
      setError('Falha ao atualizar estoque')
      console.error('Error updating inventory:', err)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const getLowStockMedications = useCallback(() => {
    return inventory.filter(med => med.quantity_available <= med.minimum_stock)
  }, [inventory])

  const getExpiredMedications = useCallback(() => {
    const today = new Date()
    return inventory.filter(med => new Date(med.expiration_date) <= today)
  }, [inventory])

  const getPatientDispensings = useCallback((patientId: string) => {
    return dispensings.filter(disp => disp.patient.id === patientId)
  }, [dispensings])

  const getControlledSubstances = useCallback(() => {
    return inventory.filter(med => med.controlled_substance)
  }, [inventory])

  useEffect(() => {
    fetchDispensings()
    fetchInventory()
  }, [fetchDispensings, fetchInventory])

  return {
    dispensings,
    inventory,
    loading,
    error,
    fetchDispensings,
    fetchInventory,
    createDispensing,
    updateInventory,
    getLowStockMedications,
    getExpiredMedications,
    getPatientDispensings,
    getControlledSubstances
  }
}