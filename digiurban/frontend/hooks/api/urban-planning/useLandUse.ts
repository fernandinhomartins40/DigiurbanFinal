'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAdminAuth } from '@/contexts/AdminAuthContext'

export interface LandUsePlot {
  id: string
  plotNumber: string
  address: string
  district: string
  neighborhood?: string
  coordinates: { lat: number; lng: number }[]
  area: number
  perimeter: number
  zoneCode: string
  owner: {
    type: 'PRIVATE' | 'PUBLIC' | 'MIXED'
    name: string
    document: string
    contact?: string
  }
  currentUse: {
    primary: 'RESIDENTIAL' | 'COMMERCIAL' | 'INDUSTRIAL' | 'INSTITUTIONAL' | 'AGRICULTURAL' | 'VACANT' | 'MIXED'
    secondary?: string[]
    description: string
    buildingArea: number
    buildingType: string
    floors: number
    units: number
    occupancy: 'OWNER' | 'TENANT' | 'VACANT' | 'MIXED'
  }
  physicalCharacteristics: {
    topography: 'FLAT' | 'SLIGHT_SLOPE' | 'MODERATE_SLOPE' | 'STEEP_SLOPE'
    soil: 'STABLE' | 'UNSTABLE' | 'ROCKY' | 'SANDY' | 'CLAY'
    drainage: 'EXCELLENT' | 'GOOD' | 'REGULAR' | 'POOR'
    vegetation: 'NONE' | 'SPARSE' | 'MODERATE' | 'DENSE'
    waterBodies: boolean
    flooding: 'NEVER' | 'RARE' | 'OCCASIONAL' | 'FREQUENT'
  }
  infrastructure: {
    access: {
      road: 'HIGHWAY' | 'ARTERIAL' | 'COLLECTOR' | 'LOCAL' | 'DIRT'
      width: number
      pavement: 'ASPHALT' | 'CONCRETE' | 'COBBLESTONE' | 'DIRT'
      sidewalk: boolean
    }
    utilities: {
      water: 'CONNECTED' | 'WELL' | 'NONE'
      sewer: 'CONNECTED' | 'SEPTIC' | 'NONE'
      electricity: 'CONNECTED' | 'NONE'
      gas: 'CONNECTED' | 'TANK' | 'NONE'
      internet: 'FIBER' | 'CABLE' | 'DSL' | 'MOBILE' | 'NONE'
      phone: 'LANDLINE' | 'MOBILE' | 'NONE'
    }
    publicServices: {
      transport: { lines: string[]; distance: number }
      health: { type: string; distance: number }[]
      education: { type: string; distance: number }[]
      safety: { type: string; distance: number }[]
    }
  }
  environmental: {
    restrictions: string[]
    protectedArea: boolean
    greenArea: number
    trees: number
    environmentalLicense: boolean
    airQuality: 'EXCELLENT' | 'GOOD' | 'REGULAR' | 'POOR'
    noiseLevel: 'LOW' | 'MODERATE' | 'HIGH'
  }
  legal: {
    title: {
      type: 'PROPERTY' | 'POSSESSION' | 'CONCESSION' | 'LEASE'
      status: 'REGULAR' | 'IRREGULAR' | 'DISPUTED'
      registry: string
      issueDate: string
    }
    restrictions: string[]
    easements: string[]
    liens: string[]
    permits: {
      type: string
      number: string
      issueDate: string
      expiryDate?: string
      status: 'VALID' | 'EXPIRED' | 'SUSPENDED'
    }[]
  }
  economic: {
    value: {
      land: number
      building: number
      total: number
      lastAppraisal: string
    }
    taxes: {
      property: { annual: number; status: 'PAID' | 'PENDING' | 'OVERDUE' }
      territorial: { annual: number; status: 'PAID' | 'PENDING' | 'OVERDUE' }
    }
    income: {
      type: 'RENT' | 'BUSINESS' | 'AGRICULTURE' | 'NONE'
      monthly: number
      annual: number
    }
  }
  planning: {
    proposedUse?: string
    development: {
      potential: 'HIGH' | 'MEDIUM' | 'LOW' | 'RESTRICTED'
      priority: 'HIGH' | 'MEDIUM' | 'LOW'
      timeline?: string
    }
    projects: {
      id: string
      name: string
      type: string
      status: 'PLANNED' | 'APPROVED' | 'IN_PROGRESS' | 'COMPLETED'
    }[]
  }
  history: {
    previousUses: {
      use: string
      period: string
      notes?: string
    }[]
    modifications: {
      date: string
      type: string
      description: string
      responsible: string
    }[]
  }
  inspections: {
    id: string
    date: string
    type: 'ROUTINE' | 'COMPLAINT' | 'CONSTRUCTION' | 'ENVIRONMENTAL'
    inspector: string
    status: 'COMPLIANT' | 'MINOR_ISSUES' | 'MAJOR_ISSUES' | 'VIOLATION'
    findings: string[]
    recommendations: string[]
    followUp?: string
  }[]
  lastInspection?: string
  nextInspection?: string
  status: 'ACTIVE' | 'UNDER_REVIEW' | 'SUSPENDED' | 'INACTIVE'
  createdAt: string
  updatedAt: string
}

export interface CreateLandUsePlotData {
  plotNumber: string
  address: string
  district: string
  coordinates: { lat: number; lng: number }[]
  area: number
  zoneCode: string
  owner: {
    type: 'PRIVATE' | 'PUBLIC' | 'MIXED'
    name: string
    document: string
  }
  currentUse: {
    primary: 'RESIDENTIAL' | 'COMMERCIAL' | 'INDUSTRIAL' | 'INSTITUTIONAL' | 'AGRICULTURAL' | 'VACANT' | 'MIXED'
    description: string
    buildingArea: number
  }
}

export interface UseLandUseReturn {
  landUsePlots: LandUsePlot[]
  loading: boolean
  error: string | null
  createLandUsePlot: (data: CreateLandUsePlotData) => Promise<LandUsePlot>
  updateLandUsePlot: (id: string, data: Partial<CreateLandUsePlotData>) => Promise<LandUsePlot>
  updateCurrentUse: (id: string, currentUse: any) => Promise<LandUsePlot>
  updatePhysicalCharacteristics: (id: string, characteristics: any) => Promise<LandUsePlot>
  updateInfrastructure: (id: string, infrastructure: any) => Promise<LandUsePlot>
  updateEnvironmental: (id: string, environmental: any) => Promise<LandUsePlot>
  updateLegal: (id: string, legal: any) => Promise<LandUsePlot>
  updateEconomic: (id: string, economic: any) => Promise<LandUsePlot>
  addInspection: (id: string, inspection: any) => Promise<LandUsePlot>
  updateInspection: (id: string, inspectionId: string, data: any) => Promise<LandUsePlot>
  scheduleInspection: (id: string, date: string, type: string) => Promise<LandUsePlot>
  addPermit: (id: string, permit: any) => Promise<LandUsePlot>
  updatePermitStatus: (id: string, permitNumber: string, status: string) => Promise<LandUsePlot>
  proposeDevelopment: (id: string, proposal: any) => Promise<LandUsePlot>
  deleteLandUsePlot: (id: string) => Promise<void>
  getPlotsByUse: (use: string) => LandUsePlot[]
  getPlotsByDistrict: (district: string) => LandUsePlot[]
  getPlotsByZone: (zoneCode: string) => LandUsePlot[]
  getVacantPlots: () => LandUsePlot[]
  getPlotsForInspection: () => LandUsePlot[]
  refreshLandUse: () => Promise<void>
}

export function useLandUse(): UseLandUseReturn {
  const [landUsePlots, setLandUsePlots] = useState<LandUsePlot[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchLandUse = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await apiClient.get('/api/specialized/urban-planning/land-use')
      setLandUsePlots(data.plots || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar dados de uso do solo')
    } finally {
      setLoading(false)
    }
  }, [])

  const createLandUsePlot = useCallback(async (data: CreateLandUsePlotData): Promise<LandUsePlot> => {
    try {
      setError(null)
      const response = await apiClient.post('/api/specialized/urban-planning/land-use', data)
      const newPlot = response.plot
      setLandUsePlots(prev => [newPlot, ...prev])
      return newPlot
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar lote'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const updateLandUsePlot = useCallback(async (id: string, data: Partial<CreateLandUsePlotData>): Promise<LandUsePlot> => {
    try {
      setError(null)
      const response = await apiClient.put(`/api/specialized/urban-planning/land-use/${id}`, data)
      const updatedPlot = response.plot
      setLandUsePlots(prev => prev.map(plot => plot.id === id ? updatedPlot : plot))
      return updatedPlot
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar lote'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const updateCurrentUse = useCallback(async (id: string, currentUse: any): Promise<LandUsePlot> => {
    try {
      setError(null)
      const response = await apiClient.put(`/api/specialized/urban-planning/land-use/${id}/current-use`, currentUse)
      const updatedPlot = response.plot
      setLandUsePlots(prev => prev.map(plot => plot.id === id ? updatedPlot : plot))
      return updatedPlot
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar uso atual'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const updatePhysicalCharacteristics = useCallback(async (id: string, characteristics: any): Promise<LandUsePlot> => {
    try {
      setError(null)
      const response = await apiClient.put(`/api/specialized/urban-planning/land-use/${id}/physical`, characteristics)
      const updatedPlot = response.plot
      setLandUsePlots(prev => prev.map(plot => plot.id === id ? updatedPlot : plot))
      return updatedPlot
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar características físicas'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const updateInfrastructure = useCallback(async (id: string, infrastructure: any): Promise<LandUsePlot> => {
    try {
      setError(null)
      const response = await apiClient.put(`/api/specialized/urban-planning/land-use/${id}/infrastructure`, infrastructure)
      const updatedPlot = response.plot
      setLandUsePlots(prev => prev.map(plot => plot.id === id ? updatedPlot : plot))
      return updatedPlot
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar infraestrutura'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const updateEnvironmental = useCallback(async (id: string, environmental: any): Promise<LandUsePlot> => {
    try {
      setError(null)
      const response = await apiClient.put(`/api/specialized/urban-planning/land-use/${id}/environmental`, environmental)
      const updatedPlot = response.plot
      setLandUsePlots(prev => prev.map(plot => plot.id === id ? updatedPlot : plot))
      return updatedPlot
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar dados ambientais'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const updateLegal = useCallback(async (id: string, legal: any): Promise<LandUsePlot> => {
    try {
      setError(null)
      const response = await apiClient.put(`/api/specialized/urban-planning/land-use/${id}/legal`, legal)
      const updatedPlot = response.plot
      setLandUsePlots(prev => prev.map(plot => plot.id === id ? updatedPlot : plot))
      return updatedPlot
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar dados legais'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const updateEconomic = useCallback(async (id: string, economic: any): Promise<LandUsePlot> => {
    try {
      setError(null)
      const response = await apiClient.put(`/api/specialized/urban-planning/land-use/${id}/economic`, economic)
      const updatedPlot = response.plot
      setLandUsePlots(prev => prev.map(plot => plot.id === id ? updatedPlot : plot))
      return updatedPlot
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar dados econômicos'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const addInspection = useCallback(async (id: string, inspection: any): Promise<LandUsePlot> => {
    try {
      setError(null)
      const response = await apiClient.post(`/api/specialized/urban-planning/land-use/${id}/inspections`, inspection)
      const updatedPlot = response.plot
      setLandUsePlots(prev => prev.map(plot => plot.id === id ? updatedPlot : plot))
      return updatedPlot
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao adicionar inspeção'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const updateInspection = useCallback(async (id: string, inspectionId: string, data: any): Promise<LandUsePlot> => {
    try {
      setError(null)
      const response = await apiClient.put(`/api/specialized/urban-planning/land-use/${id}/inspections/${inspectionId}`, data)
      const updatedPlot = response.plot
      setLandUsePlots(prev => prev.map(plot => plot.id === id ? updatedPlot : plot))
      return updatedPlot
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar inspeção'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const scheduleInspection = useCallback(async (id: string, date: string, type: string): Promise<LandUsePlot> => {
    try {
      setError(null)
      const response = await apiClient.post(`/api/specialized/urban-planning/land-use/${id}/schedule-inspection`, { date, type })
      const updatedPlot = response.plot
      setLandUsePlots(prev => prev.map(plot => plot.id === id ? updatedPlot : plot))
      return updatedPlot
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao agendar inspeção'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const addPermit = useCallback(async (id: string, permit: any): Promise<LandUsePlot> => {
    try {
      setError(null)
      const response = await apiClient.post(`/api/specialized/urban-planning/land-use/${id}/permits`, permit)
      const updatedPlot = response.plot
      setLandUsePlots(prev => prev.map(plot => plot.id === id ? updatedPlot : plot))
      return updatedPlot
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao adicionar licença'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const updatePermitStatus = useCallback(async (id: string, permitNumber: string, status: string): Promise<LandUsePlot> => {
    try {
      setError(null)
      const response = await apiClient.put(`/api/specialized/urban-planning/land-use/${id}/permits/${permitNumber}`, { status })
      const updatedPlot = response.plot
      setLandUsePlots(prev => prev.map(plot => plot.id === id ? updatedPlot : plot))
      return updatedPlot
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar status da licença'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const proposeDevelopment = useCallback(async (id: string, proposal: any): Promise<LandUsePlot> => {
    try {
      setError(null)
      const response = await apiClient.post(`/api/specialized/urban-planning/land-use/${id}/development`, proposal)
      const updatedPlot = response.plot
      setLandUsePlots(prev => prev.map(plot => plot.id === id ? updatedPlot : plot))
      return updatedPlot
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao propor desenvolvimento'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const deleteLandUsePlot = useCallback(async (id: string): Promise<void> => {
    try {
      setError(null)
      await apiClient.delete(`/api/specialized/urban-planning/land-use/${id}`)
      setLandUsePlots(prev => prev.filter(plot => plot.id !== id))
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao excluir lote'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const getPlotsByUse = useCallback((use: string) => landUsePlots.filter(plot => plot.currentUse.primary === use), [landUsePlots])
  const getPlotsByDistrict = useCallback((district: string) => landUsePlots.filter(plot => plot.district === district), [landUsePlots])
  const getPlotsByZone = useCallback((zoneCode: string) => landUsePlots.filter(plot => plot.zoneCode === zoneCode), [landUsePlots])
  const getVacantPlots = useCallback(() => landUsePlots.filter(plot => plot.currentUse.primary === 'VACANT'), [landUsePlots])
  const getPlotsForInspection = useCallback(() => {
    const today = new Date()
    return landUsePlots.filter(plot => plot.nextInspection && new Date(plot.nextInspection) <= today)
  }, [landUsePlots])

  const refreshLandUse = useCallback(async () => {
    await fetchLandUse()
  }, [fetchLandUse])

  useEffect(() => {
    fetchLandUse()
  }, [fetchLandUse])

  return {
    landUsePlots,
    loading,
    error,
    createLandUsePlot,
    updateLandUsePlot,
    updateCurrentUse,
    updatePhysicalCharacteristics,
    updateInfrastructure,
    updateEnvironmental,
    updateLegal,
    updateEconomic,
    addInspection,
    updateInspection,
    scheduleInspection,
    addPermit,
    updatePermitStatus,
    proposeDevelopment,
    deleteLandUsePlot,
    getPlotsByUse,
    getPlotsByDistrict,
    getPlotsByZone,
    getVacantPlots,
    getPlotsForInspection,
    refreshLandUse
  }
}