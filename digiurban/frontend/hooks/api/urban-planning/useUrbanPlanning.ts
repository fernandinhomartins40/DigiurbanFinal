'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAdminAuth } from '@/contexts/AdminAuthContext'

export interface UrbanPlan {
  id: string
  name: string
  type: 'MASTER_PLAN' | 'SECTOR_PLAN' | 'NEIGHBORHOOD_PLAN' | 'SPECIAL_PLAN' | 'STRATEGIC_PLAN'
  status: 'DRAFT' | 'UNDER_REVIEW' | 'PUBLIC_CONSULTATION' | 'APPROVED' | 'IMPLEMENTED' | 'CANCELLED'
  area: {
    name: string
    coordinates: { lat: number; lng: number }[]
    totalArea: number
    districts: string[]
  }
  objectives: string[]
  timeline: {
    startDate: string
    endDate: string
    phases: {
      name: string
      startDate: string
      endDate: string
      status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'DELAYED'
      deliverables: string[]
    }[]
  }
  population: {
    current: number
    projected: number
    projectionYear: number
    demographics: {
      ageGroup: string
      percentage: number
    }[]
  }
  landUse: {
    residential: { area: number; percentage: number; units: number }
    commercial: { area: number; percentage: number; establishments: number }
    industrial: { area: number; percentage: number; facilities: number }
    institutional: { area: number; percentage: number; facilities: number }
    recreational: { area: number; percentage: number; facilities: number }
    environmental: { area: number; percentage: number }
    infrastructure: { area: number; percentage: number }
  }
  infrastructure: {
    transportation: {
      roads: { total: number; paved: number; unpaved: number }
      publicTransport: { lines: number; stops: number; coverage: number }
      parking: { spaces: number; adequacy: 'SUFFICIENT' | 'ADEQUATE' | 'INSUFFICIENT' }
    }
    utilities: {
      water: { coverage: number; quality: 'EXCELLENT' | 'GOOD' | 'REGULAR' | 'POOR' }
      sewer: { coverage: number; treatment: number }
      electricity: { coverage: number; reliability: number }
      internet: { coverage: number; speed: string }
    }
    services: {
      health: { facilities: number; coverage: number; adequacy: string }
      education: { schools: number; coverage: number; adequacy: string }
      safety: { stations: number; coverage: number; adequacy: string }
    }
  }
  environmental: {
    greenAreas: { total: number; perCapita: number; distribution: string }
    waterBodies: { count: number; quality: string; protection: string }
    airQuality: { index: number; status: string; monitoring: boolean }
    noiseLevel: { average: number; compliance: boolean }
    wasteManagement: { coverage: number; recycling: number; adequacy: string }
  }
  regulations: {
    zoning: { zones: number; coverage: number; lastUpdate: string }
    building: { standards: string[]; compliance: number; lastUpdate: string }
    environmental: { regulations: string[]; compliance: number }
  }
  stakeholders: {
    government: string[]
    community: string[]
    private: string[]
    ngo: string[]
  }
  budget: {
    total: number
    allocated: number
    spent: number
    sources: {
      source: string
      amount: number
      percentage: number
    }[]
  }
  documents: {
    type: string
    name: string
    url: string
    version: string
    date: string
  }[]
  publicConsultation: {
    isActive: boolean
    startDate?: string
    endDate?: string
    sessions: {
      date: string
      location: string
      attendees: number
      feedback: string[]
    }[]
    onlineComments: number
    surveys: {
      title: string
      responses: number
      results: any
    }[]
  }
  createdBy: string
  createdAt: string
  updatedAt: string
}

export interface CreateUrbanPlanData {
  name: string
  type: 'MASTER_PLAN' | 'SECTOR_PLAN' | 'NEIGHBORHOOD_PLAN' | 'SPECIAL_PLAN' | 'STRATEGIC_PLAN'
  area: {
    name: string
    coordinates: { lat: number; lng: number }[]
    totalArea: number
    districts: string[]
  }
  objectives: string[]
  timeline: {
    startDate: string
    endDate: string
  }
}

export interface UseUrbanPlanningReturn {
  urbanPlans: UrbanPlan[]
  loading: boolean
  error: string | null
  createUrbanPlan: (data: CreateUrbanPlanData) => Promise<UrbanPlan>
  updateUrbanPlan: (id: string, data: Partial<CreateUrbanPlanData>) => Promise<UrbanPlan>
  addPhase: (id: string, phase: any) => Promise<UrbanPlan>
  updatePhaseStatus: (id: string, phaseId: string, status: string) => Promise<UrbanPlan>
  updatePopulationData: (id: string, population: any) => Promise<UrbanPlan>
  updateLandUse: (id: string, landUse: any) => Promise<UrbanPlan>
  updateInfrastructure: (id: string, infrastructure: any) => Promise<UrbanPlan>
  updateEnvironmental: (id: string, environmental: any) => Promise<UrbanPlan>
  startPublicConsultation: (id: string, consultation: any) => Promise<UrbanPlan>
  endPublicConsultation: (id: string) => Promise<UrbanPlan>
  addConsultationSession: (id: string, session: any) => Promise<UrbanPlan>
  approvePlan: (id: string) => Promise<UrbanPlan>
  implementPlan: (id: string) => Promise<UrbanPlan>
  deleteUrbanPlan: (id: string) => Promise<void>
  getPlansByType: (type: string) => UrbanPlan[]
  getPlansByStatus: (status: string) => UrbanPlan[]
  getActivePlans: () => UrbanPlan[]
  refreshUrbanPlans: () => Promise<void>
}

export function useUrbanPlanning(): UseUrbanPlanningReturn {
  const [urbanPlans, setUrbanPlans] = useState<UrbanPlan[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchUrbanPlans = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await apiClient.get('/api/secretarias/urban-planning/plans')
      setUrbanPlans(data.plans || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar planos urbanos')
    } finally {
      setLoading(false)
    }
  }, [])

  const createUrbanPlan = useCallback(async (data: CreateUrbanPlanData): Promise<UrbanPlan> => {
    try {
      setError(null)
      const response = await apiClient.post('/api/secretarias/urban-planning/plans', data)
      const newPlan = response.plan
      setUrbanPlans(prev => [newPlan, ...prev])
      return newPlan
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar plano urbano'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const updateUrbanPlan = useCallback(async (id: string, data: Partial<CreateUrbanPlanData>): Promise<UrbanPlan> => {
    try {
      setError(null)
      const response = await apiClient.put(`/api/secretarias/urban-planning/plans/${id}`, data)
      const updatedPlan = response.plan
      setUrbanPlans(prev => prev.map(plan => plan.id === id ? updatedPlan : plan))
      return updatedPlan
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar plano urbano'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const addPhase = useCallback(async (id: string, phase: any): Promise<UrbanPlan> => {
    try {
      setError(null)
      const response = await apiClient.post(`/api/secretarias/urban-planning/plans/${id}/phases`, phase)
      const updatedPlan = response.plan
      setUrbanPlans(prev => prev.map(plan => plan.id === id ? updatedPlan : plan))
      return updatedPlan
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao adicionar fase'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const updatePhaseStatus = useCallback(async (id: string, phaseId: string, status: string): Promise<UrbanPlan> => {
    try {
      setError(null)
      const response = await apiClient.put(`/api/secretarias/urban-planning/plans/${id}/phases/${phaseId}`, { status })
      const updatedPlan = response.plan
      setUrbanPlans(prev => prev.map(plan => plan.id === id ? updatedPlan : plan))
      return updatedPlan
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar status da fase'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const updatePopulationData = useCallback(async (id: string, population: any): Promise<UrbanPlan> => {
    try {
      setError(null)
      const response = await apiClient.put(`/api/secretarias/urban-planning/plans/${id}/population`, population)
      const updatedPlan = response.plan
      setUrbanPlans(prev => prev.map(plan => plan.id === id ? updatedPlan : plan))
      return updatedPlan
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar dados populacionais'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const updateLandUse = useCallback(async (id: string, landUse: any): Promise<UrbanPlan> => {
    try {
      setError(null)
      const response = await apiClient.put(`/api/secretarias/urban-planning/plans/${id}/land-use`, landUse)
      const updatedPlan = response.plan
      setUrbanPlans(prev => prev.map(plan => plan.id === id ? updatedPlan : plan))
      return updatedPlan
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar uso do solo'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const updateInfrastructure = useCallback(async (id: string, infrastructure: any): Promise<UrbanPlan> => {
    try {
      setError(null)
      const response = await apiClient.put(`/api/secretarias/urban-planning/plans/${id}/infrastructure`, infrastructure)
      const updatedPlan = response.plan
      setUrbanPlans(prev => prev.map(plan => plan.id === id ? updatedPlan : plan))
      return updatedPlan
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar infraestrutura'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const updateEnvironmental = useCallback(async (id: string, environmental: any): Promise<UrbanPlan> => {
    try {
      setError(null)
      const response = await apiClient.put(`/api/secretarias/urban-planning/plans/${id}/environmental`, environmental)
      const updatedPlan = response.plan
      setUrbanPlans(prev => prev.map(plan => plan.id === id ? updatedPlan : plan))
      return updatedPlan
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar dados ambientais'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const startPublicConsultation = useCallback(async (id: string, consultation: any): Promise<UrbanPlan> => {
    try {
      setError(null)
      const response = await apiClient.post(`/api/secretarias/urban-planning/plans/${id}/consultation/start`, consultation)
      const updatedPlan = response.plan
      setUrbanPlans(prev => prev.map(plan => plan.id === id ? updatedPlan : plan))
      return updatedPlan
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao iniciar consulta pública'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const endPublicConsultation = useCallback(async (id: string): Promise<UrbanPlan> => {
    try {
      setError(null)
      const response = await apiClient.post(`/api/secretarias/urban-planning/plans/${id}/consultation/end`, {})
      const updatedPlan = response.plan
      setUrbanPlans(prev => prev.map(plan => plan.id === id ? updatedPlan : plan))
      return updatedPlan
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao finalizar consulta pública'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const addConsultationSession = useCallback(async (id: string, session: any): Promise<UrbanPlan> => {
    try {
      setError(null)
      const response = await apiClient.post(`/api/secretarias/urban-planning/plans/${id}/consultation/sessions`, session)
      const updatedPlan = response.plan
      setUrbanPlans(prev => prev.map(plan => plan.id === id ? updatedPlan : plan))
      return updatedPlan
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao adicionar sessão de consulta'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const approvePlan = useCallback(async (id: string): Promise<UrbanPlan> => {
    return updateUrbanPlan(id, { status: 'APPROVED' } as any)
  }, [updateUrbanPlan])

  const implementPlan = useCallback(async (id: string): Promise<UrbanPlan> => {
    return updateUrbanPlan(id, { status: 'IMPLEMENTED' } as any)
  }, [updateUrbanPlan])

  const deleteUrbanPlan = useCallback(async (id: string): Promise<void> => {
    try {
      setError(null)
      await apiClient.delete(`/api/secretarias/urban-planning/plans/${id}`)
      setUrbanPlans(prev => prev.filter(plan => plan.id !== id))
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao excluir plano urbano'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const getPlansByType = useCallback((type: string) => urbanPlans.filter(plan => plan.type === type), [urbanPlans])
  const getPlansByStatus = useCallback((status: string) => urbanPlans.filter(plan => plan.status === status), [urbanPlans])
  const getActivePlans = useCallback(() => urbanPlans.filter(plan => ['UNDER_REVIEW', 'PUBLIC_CONSULTATION', 'APPROVED', 'IMPLEMENTED'].includes(plan.status)), [urbanPlans])

  const refreshUrbanPlans = useCallback(async () => {
    await fetchUrbanPlans()
  }, [fetchUrbanPlans])

  useEffect(() => {
    fetchUrbanPlans()
  }, [fetchUrbanPlans])

  return {
    urbanPlans,
    loading,
    error,
    createUrbanPlan,
    updateUrbanPlan,
    addPhase,
    updatePhaseStatus,
    updatePopulationData,
    updateLandUse,
    updateInfrastructure,
    updateEnvironmental,
    startPublicConsultation,
    endPublicConsultation,
    addConsultationSession,
    approvePlan,
    implementPlan,
    deleteUrbanPlan,
    getPlansByType,
    getPlansByStatus,
    getActivePlans,
    refreshUrbanPlans
  }
}