'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAdminAuth } from '@/contexts/AdminAuthContext'

export interface ZoningArea {
  id: string
  code: string
  name: string
  type: 'RESIDENTIAL' | 'COMMERCIAL' | 'INDUSTRIAL' | 'INSTITUTIONAL' | 'MIXED_USE' | 'AGRICULTURAL' | 'ENVIRONMENTAL' | 'SPECIAL'
  subtype?: string
  description: string
  area: number
  perimeter: number
  coordinates: { lat: number; lng: number }[]
  district: string
  neighborhood?: string
  regulations: {
    buildingHeight: {
      min?: number
      max: number
      unit: 'METERS' | 'FLOORS'
    }
    setbacks: {
      front: number
      side: number
      rear: number
    }
    occupancyRate: {
      max: number
      percentage: number
    }
    floorAreaRatio: {
      max: number
      coefficient: number
    }
    lotSize: {
      min: number
      max?: number
      unit: 'M2'
    }
    permittedUses: {
      primary: string[]
      secondary: string[]
      conditional: string[]
      prohibited: string[]
    }
    parking: {
      residential: number
      commercial: number
      industrial: number
      unit: 'PER_UNIT' | 'PER_M2' | 'PER_EMPLOYEE'
    }
    greenArea: {
      required: number
      percentage: number
      type: 'PRIVATE' | 'PUBLIC' | 'BOTH'
    }
  }
  restrictions: {
    environmental: string[]
    historical: string[]
    safety: string[]
    infrastructure: string[]
    accessibility: string[]
  }
  incentives: {
    type: string
    description: string
    benefit: string
    conditions: string[]
    validUntil?: string
  }[]
  currentUse: {
    residential: { units: number; area: number; percentage: number }
    commercial: { establishments: number; area: number; percentage: number }
    industrial: { facilities: number; area: number; percentage: number }
    vacant: { lots: number; area: number; percentage: number }
  }
  infrastructure: {
    water: boolean
    sewer: boolean
    electricity: boolean
    gas: boolean
    internet: boolean
    publicTransport: boolean
    streetLighting: boolean
    pavement: boolean
  }
  compliance: {
    conformingUses: number
    nonConformingUses: number
    violations: {
      id: string
      type: string
      description: string
      severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
      status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED'
      reportedDate: string
    }[]
  }
  plannedChanges: {
    type: 'REZONING' | 'REGULATION_UPDATE' | 'BOUNDARY_CHANGE'
    description: string
    proposedDate: string
    status: 'PROPOSED' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED'
    justification: string
  }[]
  economicData: {
    landValue: {
      average: number
      min: number
      max: number
      unit: 'PER_M2'
      lastUpdate: string
    }
    marketActivity: {
      sales: number
      rentals: number
      newConstructions: number
      period: string
    }
  }
  lastReview: string
  nextReview: string
  status: 'ACTIVE' | 'UNDER_REVISION' | 'SUSPENDED' | 'OBSOLETE'
  createdBy: string
  createdAt: string
  updatedAt: string
}

export interface CreateZoningAreaData {
  code: string
  name: string
  type: 'RESIDENTIAL' | 'COMMERCIAL' | 'INDUSTRIAL' | 'INSTITUTIONAL' | 'MIXED_USE' | 'AGRICULTURAL' | 'ENVIRONMENTAL' | 'SPECIAL'
  subtype?: string
  description: string
  coordinates: { lat: number; lng: number }[]
  district: string
  regulations: {
    buildingHeight: {
      max: number
      unit: 'METERS' | 'FLOORS'
    }
    setbacks: {
      front: number
      side: number
      rear: number
    }
    occupancyRate: {
      max: number
    }
    floorAreaRatio: {
      max: number
    }
    permittedUses: {
      primary: string[]
      secondary: string[]
    }
  }
}

export interface UseZoningReturn {
  zoningAreas: ZoningArea[]
  loading: boolean
  error: string | null
  createZoningArea: (data: CreateZoningAreaData) => Promise<ZoningArea>
  updateZoningArea: (id: string, data: Partial<CreateZoningAreaData>) => Promise<ZoningArea>
  updateRegulations: (id: string, regulations: any) => Promise<ZoningArea>
  addRestriction: (id: string, restriction: any) => Promise<ZoningArea>
  addIncentive: (id: string, incentive: any) => Promise<ZoningArea>
  reportViolation: (id: string, violation: any) => Promise<ZoningArea>
  resolveViolation: (id: string, violationId: string) => Promise<ZoningArea>
  proposeChange: (id: string, change: any) => Promise<ZoningArea>
  approveChange: (id: string, changeId: string) => Promise<ZoningArea>
  updateCurrentUse: (id: string, currentUse: any) => Promise<ZoningArea>
  updateEconomicData: (id: string, economicData: any) => Promise<ZoningArea>
  scheduleReview: (id: string, reviewDate: string) => Promise<ZoningArea>
  deleteZoningArea: (id: string) => Promise<void>
  getZoningByType: (type: string) => ZoningArea[]
  getZoningByDistrict: (district: string) => ZoningArea[]
  getZoningWithViolations: () => ZoningArea[]
  getZoningForReview: () => ZoningArea[]
  refreshZoning: () => Promise<void>
}

export function useZoning(): UseZoningReturn {
  const [zoningAreas, setZoningAreas] = useState<ZoningArea[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchZoning = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await apiClient.get('/api/specialized/urban-planning/zoning')
      setZoningAreas(data.zoningAreas || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar zoneamento')
    } finally {
      setLoading(false)
    }
  }, [])

  const createZoningArea = useCallback(async (data: CreateZoningAreaData): Promise<ZoningArea> => {
    try {
      setError(null)
      const response = await apiClient.post('/api/specialized/urban-planning/zoning', data)
      const newZoning = response.zoning
      setZoningAreas(prev => [newZoning, ...prev])
      return newZoning
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar área de zoneamento'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const updateZoningArea = useCallback(async (id: string, data: Partial<CreateZoningAreaData>): Promise<ZoningArea> => {
    try {
      setError(null)
      const response = await apiClient.put(`/api/specialized/urban-planning/zoning/${id}`, data)
      const updatedZoning = response.zoning
      setZoningAreas(prev => prev.map(zone => zone.id === id ? updatedZoning : zone))
      return updatedZoning
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar zoneamento'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const updateRegulations = useCallback(async (id: string, regulations: any): Promise<ZoningArea> => {
    try {
      setError(null)
      const response = await apiClient.put(`/api/specialized/urban-planning/zoning/${id}/regulations`, regulations)
      const updatedZoning = response.zoning
      setZoningAreas(prev => prev.map(zone => zone.id === id ? updatedZoning : zone))
      return updatedZoning
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar regulamentações'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const addRestriction = useCallback(async (id: string, restriction: any): Promise<ZoningArea> => {
    try {
      setError(null)
      const response = await apiClient.post(`/api/specialized/urban-planning/zoning/${id}/restrictions`, restriction)
      const updatedZoning = response.zoning
      setZoningAreas(prev => prev.map(zone => zone.id === id ? updatedZoning : zone))
      return updatedZoning
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao adicionar restrição'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const addIncentive = useCallback(async (id: string, incentive: any): Promise<ZoningArea> => {
    try {
      setError(null)
      const response = await apiClient.post(`/api/specialized/urban-planning/zoning/${id}/incentives`, incentive)
      const updatedZoning = response.zoning
      setZoningAreas(prev => prev.map(zone => zone.id === id ? updatedZoning : zone))
      return updatedZoning
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao adicionar incentivo'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const reportViolation = useCallback(async (id: string, violation: any): Promise<ZoningArea> => {
    try {
      setError(null)
      const response = await apiClient.post(`/api/specialized/urban-planning/zoning/${id}/violations`, violation)
      const updatedZoning = response.zoning
      setZoningAreas(prev => prev.map(zone => zone.id === id ? updatedZoning : zone))
      return updatedZoning
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao reportar violação'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const resolveViolation = useCallback(async (id: string, violationId: string): Promise<ZoningArea> => {
    try {
      setError(null)
      const response = await apiClient.put(`/api/specialized/urban-planning/zoning/${id}/violations/${violationId}`, { status: 'RESOLVED' })
      const updatedZoning = response.zoning
      setZoningAreas(prev => prev.map(zone => zone.id === id ? updatedZoning : zone))
      return updatedZoning
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao resolver violação'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const proposeChange = useCallback(async (id: string, change: any): Promise<ZoningArea> => {
    try {
      setError(null)
      const response = await apiClient.post(`/api/specialized/urban-planning/zoning/${id}/changes`, change)
      const updatedZoning = response.zoning
      setZoningAreas(prev => prev.map(zone => zone.id === id ? updatedZoning : zone))
      return updatedZoning
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao propor mudança'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const approveChange = useCallback(async (id: string, changeId: string): Promise<ZoningArea> => {
    try {
      setError(null)
      const response = await apiClient.put(`/api/specialized/urban-planning/zoning/${id}/changes/${changeId}`, { status: 'APPROVED' })
      const updatedZoning = response.zoning
      setZoningAreas(prev => prev.map(zone => zone.id === id ? updatedZoning : zone))
      return updatedZoning
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao aprovar mudança'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const updateCurrentUse = useCallback(async (id: string, currentUse: any): Promise<ZoningArea> => {
    try {
      setError(null)
      const response = await apiClient.put(`/api/specialized/urban-planning/zoning/${id}/current-use`, currentUse)
      const updatedZoning = response.zoning
      setZoningAreas(prev => prev.map(zone => zone.id === id ? updatedZoning : zone))
      return updatedZoning
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar uso atual'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const updateEconomicData = useCallback(async (id: string, economicData: any): Promise<ZoningArea> => {
    try {
      setError(null)
      const response = await apiClient.put(`/api/specialized/urban-planning/zoning/${id}/economic-data`, economicData)
      const updatedZoning = response.zoning
      setZoningAreas(prev => prev.map(zone => zone.id === id ? updatedZoning : zone))
      return updatedZoning
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar dados econômicos'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const scheduleReview = useCallback(async (id: string, reviewDate: string): Promise<ZoningArea> => {
    try {
      setError(null)
      const response = await apiClient.put(`/api/specialized/urban-planning/zoning/${id}/schedule-review`, { nextReview: reviewDate })
      const updatedZoning = response.zoning
      setZoningAreas(prev => prev.map(zone => zone.id === id ? updatedZoning : zone))
      return updatedZoning
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao agendar revisão'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const deleteZoningArea = useCallback(async (id: string): Promise<void> => {
    try {
      setError(null)
      await apiClient.delete(`/api/specialized/urban-planning/zoning/${id}`)
      setZoningAreas(prev => prev.filter(zone => zone.id !== id))
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao excluir área de zoneamento'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const getZoningByType = useCallback((type: string) => zoningAreas.filter(zone => zone.type === type), [zoningAreas])
  const getZoningByDistrict = useCallback((district: string) => zoningAreas.filter(zone => zone.district === district), [zoningAreas])
  const getZoningWithViolations = useCallback(() => zoningAreas.filter(zone => zone.compliance.violations.some(v => v.status === 'OPEN')), [zoningAreas])
  const getZoningForReview = useCallback(() => {
    const today = new Date()
    return zoningAreas.filter(zone => new Date(zone.nextReview) <= today)
  }, [zoningAreas])

  const refreshZoning = useCallback(async () => {
    await fetchZoning()
  }, [fetchZoning])

  useEffect(() => {
    fetchZoning()
  }, [fetchZoning])

  return {
    zoningAreas,
    loading,
    error,
    createZoningArea,
    updateZoningArea,
    updateRegulations,
    addRestriction,
    addIncentive,
    reportViolation,
    resolveViolation,
    proposeChange,
    approveChange,
    updateCurrentUse,
    updateEconomicData,
    scheduleReview,
    deleteZoningArea,
    getZoningByType,
    getZoningByDistrict,
    getZoningWithViolations,
    getZoningForReview,
    refreshZoning
  }
}