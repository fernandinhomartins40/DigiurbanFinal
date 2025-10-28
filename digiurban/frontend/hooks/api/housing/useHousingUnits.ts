'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAdminAuth } from '@/contexts/AdminAuthContext'

interface HousingUnit {
  id: string
  unitNumber: string
  address: string
  district: string
  neighborhood: string
  block?: string
  lot?: string
  coordinates: { lat: number; lng: number }
  programId: string
  programName: string
  type: 'APARTMENT' | 'HOUSE' | 'DUPLEX' | 'TRIPLEX' | 'TOWNHOUSE' | 'STUDIO'
  specifications: {
    area: {
      total: number
      built: number
      private: number
      common?: number
    }
    rooms: {
      bedrooms: number
      bathrooms: number
      livingRooms: number
      kitchens: number
      serviceAreas: number
      parking?: number
    }
    features: {
      accessibility: boolean
      balcony: boolean
      yard: boolean
      garden: boolean
      storage: boolean
      airConditioning: boolean
    }
    construction: {
      year: number
      materials: string[]
      quality: 'BASIC' | 'STANDARD' | 'PREMIUM'
      certifications: string[]
    }
  }
  infrastructure: {
    utilities: {
      water: 'CONNECTED' | 'AVAILABLE' | 'NOT_AVAILABLE'
      sewer: 'CONNECTED' | 'AVAILABLE' | 'NOT_AVAILABLE'
      electricity: 'CONNECTED' | 'AVAILABLE' | 'NOT_AVAILABLE'
      gas: 'CONNECTED' | 'AVAILABLE' | 'NOT_AVAILABLE'
      internet: 'CONNECTED' | 'AVAILABLE' | 'NOT_AVAILABLE'
      phone: 'CONNECTED' | 'AVAILABLE' | 'NOT_AVAILABLE'
    }
    services: {
      transportation: { type: string; distance: number }[]
      health: { type: string; distance: number }[]
      education: { type: string; distance: number }[]
      commerce: { type: string; distance: number }[]
      recreation: { type: string; distance: number }[]
    }
    safety: {
      lighting: 'ADEQUATE' | 'PARTIAL' | 'INADEQUATE'
      surveillance: boolean
      fencing: boolean
      emergency: boolean
    }
  }
  financial: {
    cost: {
      construction: number
      land: number
      total: number
    }
    value: {
      current: number
      subsidized: number
      beneficiaryContribution: number
    }
    financing: {
      type: 'DIRECT' | 'BANK_FINANCING' | 'LEASE' | 'RENT_TO_OWN'
      bank?: string
      terms: {
        duration: number
        interestRate: number
        monthlyPayment: number
      }
    }
  }
  allocation: {
    status: 'AVAILABLE' | 'ALLOCATED' | 'OCCUPIED' | 'UNDER_MAINTENANCE' | 'RESERVED'
    beneficiary?: {
      id: string
      name: string
      family: {
        size: number
        composition: { name: string; age: number; relationship: string }[]
        income: number
      }
      allocationDate: string
      occupancyDate?: string
      contractType: 'OWNERSHIP' | 'LEASE' | 'RENTAL' | 'TEMPORARY'
    }
    waitingList: {
      position: number
      candidates: {
        id: string
        name: string
        score: number
        applicationDate: string
      }[]
    }
  }
  condition: {
    overall: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR' | 'CRITICAL'
    structure: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR' | 'CRITICAL'
    electrical: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR' | 'CRITICAL'
    plumbing: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR' | 'CRITICAL'
    finishes: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR' | 'CRITICAL'
    lastInspection: string
    nextInspection: string
    issues: {
      type: 'STRUCTURAL' | 'ELECTRICAL' | 'PLUMBING' | 'COSMETIC' | 'SAFETY'
      description: string
      severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
      reportedDate: string
      status: 'REPORTED' | 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED'
    }[]
  }
  maintenance: {
    schedule: {
      type: 'PREVENTIVE' | 'CORRECTIVE' | 'EMERGENCY'
      frequency: string
      lastMaintenance: string
      nextMaintenance: string
      responsible: string
    }[]
    history: {
      date: string
      type: 'PREVENTIVE' | 'CORRECTIVE' | 'EMERGENCY' | 'IMPROVEMENT'
      description: string
      cost: number
      contractor: string
      warranty?: string
      status: 'COMPLETED' | 'IN_PROGRESS' | 'SCHEDULED'
    }[]
    warranty: {
      structural: { years: number; expiryDate: string }
      electrical: { years: number; expiryDate: string }
      plumbing: { years: number; expiryDate: string }
    }
  }
  legal: {
    title: {
      status: 'REGISTERED' | 'PENDING' | 'IRREGULAR'
      registry: string
      owner: string
      restrictions: string[]
    }
    permits: {
      habitability: { number: string; issueDate: string; expiryDate?: string }
      construction: { number: string; issueDate: string }
      fire: { number: string; issueDate: string; expiryDate?: string }
    }
    contracts: {
      type: string
      party: string
      startDate: string
      endDate?: string
      status: 'ACTIVE' | 'EXPIRED' | 'TERMINATED'
    }[]
  }
  occupancy: {
    history: {
      beneficiary: string
      startDate: string
      endDate?: string
      reason?: string
      satisfaction?: number
    }[]
    current?: {
      satisfaction: number
      feedback: string[]
      issues: string[]
      improvements: string[]
    }
  }
  monitoring: {
    visits: {
      date: string
      type: 'SOCIAL' | 'TECHNICAL' | 'ADMINISTRATIVE'
      visitor: string
      purpose: string
      findings: string[]
      recommendations: string[]
    }[]
    compliance: {
      occupation: 'COMPLIANT' | 'NON_COMPLIANT' | 'PENDING'
      maintenance: 'COMPLIANT' | 'NON_COMPLIANT' | 'PENDING'
      payments: 'CURRENT' | 'DELAYED' | 'DEFAULT'
    }
  }
  insurance: {
    property: {
      company: string
      policy: string
      coverage: number
      premium: number
      expiryDate: string
    }
    liability: {
      company: string
      policy: string
      coverage: number
      premium: number
      expiryDate: string
    }
  }
  documents: {
    type: string
    name: string
    url: string
    issueDate: string
    expiryDate?: string
    status: 'VALID' | 'EXPIRED' | 'PENDING'
  }[]
  photos: {
    type: 'EXTERIOR' | 'INTERIOR' | 'DAMAGE' | 'IMPROVEMENT'
    url: string
    date: string
    description: string
  }[]
  status: 'UNDER_CONSTRUCTION' | 'COMPLETED' | 'AVAILABLE' | 'ALLOCATED' | 'OCCUPIED' | 'MAINTENANCE' | 'INACTIVE'
  createdAt: string
  updatedAt: string
}

interface CreateHousingUnitData {
  unitNumber: string
  address: string
  district: string
  coordinates: { lat: number; lng: number }
  programId: string
  type: 'APARTMENT' | 'HOUSE' | 'DUPLEX' | 'TRIPLEX' | 'TOWNHOUSE' | 'STUDIO'
  specifications: {
    area: {
      total: number
      built: number
    }
    rooms: {
      bedrooms: number
      bathrooms: number
    }
  }
  financial: {
    cost: {
      total: number
    }
  }
}

interface UseHousingUnitsReturn {
  housingUnits: HousingUnit[]
  loading: boolean
  error: string | null
  createUnit: (data: CreateHousingUnitData) => Promise<HousingUnit>
  updateUnit: (id: string, data: Partial<CreateHousingUnitData>) => Promise<HousingUnit>
  updateSpecifications: (id: string, specifications: any) => Promise<HousingUnit>
  updateInfrastructure: (id: string, infrastructure: any) => Promise<HousingUnit>
  updateFinancial: (id: string, financial: any) => Promise<HousingUnit>
  allocateUnit: (id: string, beneficiary: any) => Promise<HousingUnit>
  transferUnit: (id: string, newBeneficiary: any, reason: string) => Promise<HousingUnit>
  vacateUnit: (id: string, reason: string) => Promise<HousingUnit>
  addToWaitingList: (id: string, candidate: any) => Promise<HousingUnit>
  updateCondition: (id: string, condition: any) => Promise<HousingUnit>
  reportIssue: (id: string, issue: any) => Promise<HousingUnit>
  resolveIssue: (id: string, issueId: string) => Promise<HousingUnit>
  scheduleMaintenance: (id: string, maintenance: any) => Promise<HousingUnit>
  addMaintenanceRecord: (id: string, record: any) => Promise<HousingUnit>
  updateLegal: (id: string, legal: any) => Promise<HousingUnit>
  addOccupancyRecord: (id: string, record: any) => Promise<HousingUnit>
  addVisit: (id: string, visit: any) => Promise<HousingUnit>
  updateCompliance: (id: string, compliance: any) => Promise<HousingUnit>
  updateInsurance: (id: string, insurance: any) => Promise<HousingUnit>
  addDocument: (id: string, document: any) => Promise<HousingUnit>
  addPhoto: (id: string, photo: any) => Promise<HousingUnit>
  inspectUnit: (id: string, inspection: any) => Promise<HousingUnit>
  deleteUnit: (id: string) => Promise<void>
  getUnitsByProgram: (programId: string) => HousingUnit[]
  getUnitsByDistrict: (district: string) => HousingUnit[]
  getUnitsByStatus: (status: string) => HousingUnit[]
  getAvailableUnits: () => HousingUnit[]
  getUnitsNeedingMaintenance: () => HousingUnit[]
  refreshUnits: () => Promise<void>
}

export function useHousingUnits(): UseHousingUnitsReturn {
  const [housingUnits, setHousingUnits] = useState<HousingUnit[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchUnits = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await apiClient.get('/api/secretarias/housing/units')
      setHousingUnits(data.units || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar unidades habitacionais')
    } finally {
      setLoading(false)
    }
  }, [])

  const createUnit = useCallback(async (data: CreateHousingUnitData): Promise<HousingUnit> => {
    try {
      setError(null)
      const response = await apiClient.post('/api/secretarias/housing/units', data)
      const newUnit = response.unit
      setHousingUnits(prev => [newUnit, ...prev])
      return newUnit
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar unidade habitacional'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const updateUnit = useCallback(async (id: string, data: Partial<CreateHousingUnitData>): Promise<HousingUnit> => {
    try {
      setError(null)
      const response = await apiClient.put(`/api/secretarias/housing/units/${id}`, data)
      const updatedUnit = response.unit
      setHousingUnits(prev => prev.map(unit => unit.id === id ? updatedUnit : unit))
      return updatedUnit
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar unidade'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const updateSpecifications = useCallback(async (id: string, specifications: any): Promise<HousingUnit> => {
    try {
      setError(null)
      const response = await apiClient.put(`/api/secretarias/housing/units/${id}/specifications`, specifications)
      const updatedUnit = response.unit
      setHousingUnits(prev => prev.map(unit => unit.id === id ? updatedUnit : unit))
      return updatedUnit
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar especificações'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const updateInfrastructure = useCallback(async (id: string, infrastructure: any): Promise<HousingUnit> => {
    try {
      setError(null)
      const response = await apiClient.put(`/api/secretarias/housing/units/${id}/infrastructure`, infrastructure)
      const updatedUnit = response.unit
      setHousingUnits(prev => prev.map(unit => unit.id === id ? updatedUnit : unit))
      return updatedUnit
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar infraestrutura'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const updateFinancial = useCallback(async (id: string, financial: any): Promise<HousingUnit> => {
    try {
      setError(null)
      const response = await apiClient.put(`/api/secretarias/housing/units/${id}/financial`, financial)
      const updatedUnit = response.unit
      setHousingUnits(prev => prev.map(unit => unit.id === id ? updatedUnit : unit))
      return updatedUnit
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar dados financeiros'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const allocateUnit = useCallback(async (id: string, beneficiary: any): Promise<HousingUnit> => {
    try {
      setError(null)
      const response = await apiClient.post(`/api/secretarias/housing/units/${id}/allocate`, beneficiary)
      const updatedUnit = response.unit
      setHousingUnits(prev => prev.map(unit => unit.id === id ? updatedUnit : unit))
      return updatedUnit
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao alocar unidade'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const transferUnit = useCallback(async (id: string, newBeneficiary: any, reason: string): Promise<HousingUnit> => {
    try {
      setError(null)
      const response = await apiClient.post(`/api/secretarias/housing/units/${id}/transfer`, { newBeneficiary, reason })
      const updatedUnit = response.unit
      setHousingUnits(prev => prev.map(unit => unit.id === id ? updatedUnit : unit))
      return updatedUnit
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao transferir unidade'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const vacateUnit = useCallback(async (id: string, reason: string): Promise<HousingUnit> => {
    try {
      setError(null)
      const response = await apiClient.post(`/api/secretarias/housing/units/${id}/vacate`, { reason })
      const updatedUnit = response.unit
      setHousingUnits(prev => prev.map(unit => unit.id === id ? updatedUnit : unit))
      return updatedUnit
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao desocupar unidade'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const addToWaitingList = useCallback(async (id: string, candidate: any): Promise<HousingUnit> => {
    try {
      setError(null)
      const response = await apiClient.post(`/api/secretarias/housing/units/${id}/waiting-list`, candidate)
      const updatedUnit = response.unit
      setHousingUnits(prev => prev.map(unit => unit.id === id ? updatedUnit : unit))
      return updatedUnit
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao adicionar à lista de espera'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const updateCondition = useCallback(async (id: string, condition: any): Promise<HousingUnit> => {
    try {
      setError(null)
      const response = await apiClient.put(`/api/secretarias/housing/units/${id}/condition`, condition)
      const updatedUnit = response.unit
      setHousingUnits(prev => prev.map(unit => unit.id === id ? updatedUnit : unit))
      return updatedUnit
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar condição'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const reportIssue = useCallback(async (id: string, issue: any): Promise<HousingUnit> => {
    try {
      setError(null)
      const response = await apiClient.post(`/api/secretarias/housing/units/${id}/issues`, issue)
      const updatedUnit = response.unit
      setHousingUnits(prev => prev.map(unit => unit.id === id ? updatedUnit : unit))
      return updatedUnit
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao reportar problema'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const resolveIssue = useCallback(async (id: string, issueId: string): Promise<HousingUnit> => {
    try {
      setError(null)
      const response = await apiClient.put(`/api/secretarias/housing/units/${id}/issues/${issueId}`, { status: 'COMPLETED' })
      const updatedUnit = response.unit
      setHousingUnits(prev => prev.map(unit => unit.id === id ? updatedUnit : unit))
      return updatedUnit
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao resolver problema'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const scheduleMaintenance = useCallback(async (id: string, maintenance: any): Promise<HousingUnit> => {
    try {
      setError(null)
      const response = await apiClient.post(`/api/secretarias/housing/units/${id}/maintenance/schedule`, maintenance)
      const updatedUnit = response.unit
      setHousingUnits(prev => prev.map(unit => unit.id === id ? updatedUnit : unit))
      return updatedUnit
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao agendar manutenção'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const addMaintenanceRecord = useCallback(async (id: string, record: any): Promise<HousingUnit> => {
    try {
      setError(null)
      const response = await apiClient.post(`/api/secretarias/housing/units/${id}/maintenance/history`, record)
      const updatedUnit = response.unit
      setHousingUnits(prev => prev.map(unit => unit.id === id ? updatedUnit : unit))
      return updatedUnit
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao adicionar registro de manutenção'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const updateLegal = useCallback(async (id: string, legal: any): Promise<HousingUnit> => {
    try {
      setError(null)
      const response = await apiClient.put(`/api/secretarias/housing/units/${id}/legal`, legal)
      const updatedUnit = response.unit
      setHousingUnits(prev => prev.map(unit => unit.id === id ? updatedUnit : unit))
      return updatedUnit
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar dados legais'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const addOccupancyRecord = useCallback(async (id: string, record: any): Promise<HousingUnit> => {
    try {
      setError(null)
      const response = await apiClient.post(`/api/secretarias/housing/units/${id}/occupancy`, record)
      const updatedUnit = response.unit
      setHousingUnits(prev => prev.map(unit => unit.id === id ? updatedUnit : unit))
      return updatedUnit
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao adicionar registro de ocupação'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const addVisit = useCallback(async (id: string, visit: any): Promise<HousingUnit> => {
    try {
      setError(null)
      const response = await apiClient.post(`/api/secretarias/housing/units/${id}/visits`, visit)
      const updatedUnit = response.unit
      setHousingUnits(prev => prev.map(unit => unit.id === id ? updatedUnit : unit))
      return updatedUnit
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao adicionar visita'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const updateCompliance = useCallback(async (id: string, compliance: any): Promise<HousingUnit> => {
    try {
      setError(null)
      const response = await apiClient.put(`/api/secretarias/housing/units/${id}/compliance`, compliance)
      const updatedUnit = response.unit
      setHousingUnits(prev => prev.map(unit => unit.id === id ? updatedUnit : unit))
      return updatedUnit
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar conformidade'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const updateInsurance = useCallback(async (id: string, insurance: any): Promise<HousingUnit> => {
    try {
      setError(null)
      const response = await apiClient.put(`/api/secretarias/housing/units/${id}/insurance`, insurance)
      const updatedUnit = response.unit
      setHousingUnits(prev => prev.map(unit => unit.id === id ? updatedUnit : unit))
      return updatedUnit
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar seguro'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const addDocument = useCallback(async (id: string, document: any): Promise<HousingUnit> => {
    try {
      setError(null)
      const response = await apiClient.post(`/api/secretarias/housing/units/${id}/documents`, document)
      const updatedUnit = response.unit
      setHousingUnits(prev => prev.map(unit => unit.id === id ? updatedUnit : unit))
      return updatedUnit
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao adicionar documento'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const addPhoto = useCallback(async (id: string, photo: any): Promise<HousingUnit> => {
    try {
      setError(null)
      const response = await apiClient.post(`/api/secretarias/housing/units/${id}/photos`, photo)
      const updatedUnit = response.unit
      setHousingUnits(prev => prev.map(unit => unit.id === id ? updatedUnit : unit))
      return updatedUnit
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao adicionar foto'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const inspectUnit = useCallback(async (id: string, inspection: any): Promise<HousingUnit> => {
    try {
      setError(null)
      const response = await apiClient.post(`/api/secretarias/housing/units/${id}/inspect`, inspection)
      const updatedUnit = response.unit
      setHousingUnits(prev => prev.map(unit => unit.id === id ? updatedUnit : unit))
      return updatedUnit
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao inspecionar unidade'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const deleteUnit = useCallback(async (id: string): Promise<void> => {
    try {
      setError(null)
      await apiClient.delete(`/api/secretarias/housing/units/${id}`)
      setHousingUnits(prev => prev.filter(unit => unit.id !== id))
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao excluir unidade'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const getUnitsByProgram = useCallback((programId: string) => housingUnits.filter(unit => unit.programId === programId), [housingUnits])
  const getUnitsByDistrict = useCallback((district: string) => housingUnits.filter(unit => unit.district === district), [housingUnits])
  const getUnitsByStatus = useCallback((status: string) => housingUnits.filter(unit => unit.status === status), [housingUnits])
  const getAvailableUnits = useCallback(() => housingUnits.filter(unit => unit.allocation.status === 'AVAILABLE'), [housingUnits])
  const getUnitsNeedingMaintenance = useCallback(() => {
    const today = new Date()
    return housingUnits.filter(unit =>
      unit.maintenance.schedule.some(schedule =>
        new Date(schedule.nextMaintenance) <= today
      ) ||
      unit.condition.issues.some(issue =>
        issue.severity === 'CRITICAL' && issue.status !== 'COMPLETED'
      )
    )
  }, [housingUnits])

  const refreshUnits = useCallback(async () => {
    await fetchUnits()
  }, [fetchUnits])

  useEffect(() => {
    fetchUnits()
  }, [fetchUnits])

  return {
    housingUnits,
    loading,
    error,
    createUnit,
    updateUnit,
    updateSpecifications,
    updateInfrastructure,
    updateFinancial,
    allocateUnit,
    transferUnit,
    vacateUnit,
    addToWaitingList,
    updateCondition,
    reportIssue,
    resolveIssue,
    scheduleMaintenance,
    addMaintenanceRecord,
    updateLegal,
    addOccupancyRecord,
    addVisit,
    updateCompliance,
    updateInsurance,
    addDocument,
    addPhoto,
    inspectUnit,
    deleteUnit,
    getUnitsByProgram,
    getUnitsByDistrict,
    getUnitsByStatus,
    getAvailableUnits,
    getUnitsNeedingMaintenance,
    refreshUnits
  }
}