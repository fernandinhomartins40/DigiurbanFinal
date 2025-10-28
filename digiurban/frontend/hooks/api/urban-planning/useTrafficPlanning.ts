'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAdminAuth } from '@/contexts/AdminAuthContext'

interface TrafficPlan {
  id: string
  name: string
  type: 'TRAFFIC_FLOW' | 'SIGNALIZATION' | 'PUBLIC_TRANSPORT' | 'PARKING' | 'CYCLING' | 'PEDESTRIAN' | 'COMPREHENSIVE'
  area: {
    name: string
    coordinates: { lat: number; lng: number }[]
    districts: string[]
    mainRoads: string[]
  }
  objectives: string[]
  currentSituation: {
    traffic: {
      volume: {
        daily: number
        peak: number
        offPeak: number
        weekends: number
      }
      congestion: {
        level: 'LOW' | 'MODERATE' | 'HIGH' | 'SEVERE'
        hotspots: {
          location: string
          severity: number
          duration: string
        }[]
      }
      accidents: {
        total: number
        fatal: number
        serious: number
        minor: number
        hotspots: {
          location: string
          count: number
          causes: string[]
        }[]
      }
      speed: {
        average: number
        arterial: number
        collector: number
        local: number
      }
    }
    infrastructure: {
      roads: {
        total: number
        arterial: number
        collector: number
        local: number
        condition: {
          excellent: number
          good: number
          fair: number
          poor: number
        }
      }
      signalization: {
        trafficLights: number
        signs: number
        markings: number
        condition: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR'
      }
      publicTransport: {
        busStops: number
        busLines: number
        ridership: number
        coverage: number
      }
      parking: {
        onStreet: number
        offStreet: number
        demand: number
        occupancy: number
      }
      cycling: {
        bikelanes: number
        bikePaths: number
        bikeParking: number
        usage: number
      }
      pedestrian: {
        sidewalks: number
        crosswalks: number
        accessibility: number
        usage: number
      }
    }
  }
  proposals: {
    trafficFlow: {
      description: string
      interventions: {
        type: 'SIGNAL_TIMING' | 'LANE_CONFIGURATION' | 'INTERSECTION_IMPROVEMENT' | 'TRAFFIC_CALMING'
        location: string
        description: string
        cost: number
        timeline: string
        impact: string
      }[]
    }
    signalization: {
      newSignals: {
        location: string
        type: 'TRAFFIC_LIGHT' | 'STOP_SIGN' | 'YIELD_SIGN' | 'SPEED_LIMIT'
        justification: string
        cost: number
      }[]
      upgrades: {
        location: string
        currentType: string
        proposedType: string
        reason: string
        cost: number
      }[]
    }
    publicTransport: {
      newRoutes: {
        route: string
        frequency: number
        capacity: number
        cost: number
      }[]
      improvements: {
        type: 'BUS_RAPID_TRANSIT' | 'DEDICATED_LANES' | 'PRIORITY_SIGNALS' | 'STATION_UPGRADE'
        description: string
        cost: number
        timeline: string
      }[]
    }
    parking: {
      supply: {
        location: string
        spaces: number
        type: 'ON_STREET' | 'OFF_STREET' | 'STRUCTURE'
        cost: number
      }[]
      management: {
        strategy: 'PRICING' | 'TIME_LIMITS' | 'PERMITS' | 'TECHNOLOGY'
        description: string
        implementation: string
      }[]
    }
    cycling: {
      infrastructure: {
        type: 'BIKE_LANE' | 'BIKE_PATH' | 'SHARED_LANE' | 'BIKE_PARKING'
        location: string
        length: number
        cost: number
      }[]
      programs: {
        name: string
        description: string
        target: string
        budget: number
      }[]
    }
    pedestrian: {
      improvements: {
        type: 'SIDEWALK' | 'CROSSWALK' | 'PEDESTRIAN_BRIDGE' | 'ACCESSIBILITY'
        location: string
        description: string
        cost: number
      }[]
      safety: {
        measure: string
        location: string
        description: string
        cost: number
      }[]
    }
  }
  implementation: {
    phases: {
      id: string
      name: string
      description: string
      startDate: string
      endDate: string
      budget: number
      status: 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED' | 'DELAYED'
      interventions: string[]
    }[]
    priorities: {
      high: string[]
      medium: string[]
      low: string[]
    }
    dependencies: {
      intervention: string
      depends: string[]
      type: 'SEQUENTIAL' | 'PARALLEL' | 'CONDITIONAL'
    }[]
  }
  budget: {
    total: number
    byCategory: {
      category: string
      amount: number
      percentage: number
    }[]
    funding: {
      source: string
      amount: number
      status: 'CONFIRMED' | 'PENDING' | 'REJECTED'
    }[]
  }
  monitoring: {
    indicators: {
      name: string
      baseline: number
      target: number
      current: number
      unit: string
      frequency: string
    }[]
    studies: {
      type: 'TRAFFIC_COUNT' | 'SPEED_STUDY' | 'ORIGIN_DESTINATION' | 'ACCIDENT_ANALYSIS'
      location: string
      date: string
      results: any
    }[]
    evaluations: {
      date: string
      evaluator: string
      findings: string[]
      recommendations: string[]
    }[]
  }
  stakeholders: {
    government: string[]
    community: string[]
    business: string[]
    technical: string[]
  }
  publicConsultation: {
    sessions: {
      date: string
      location: string
      attendees: number
      feedback: string[]
    }[]
    surveys: {
      title: string
      responses: number
      results: any
    }[]
    comments: string[]
  }
  environmental: {
    emissions: {
      baseline: number
      projected: number
      reduction: number
    }
    noise: {
      baseline: number
      projected: number
      reduction: number
    }
    airQuality: {
      current: string
      expected: string
      improvement: string
    }
  }
  status: 'DRAFT' | 'UNDER_REVIEW' | 'PUBLIC_CONSULTATION' | 'APPROVED' | 'IMPLEMENTATION' | 'MONITORING' | 'COMPLETED'
  approvedBy?: string
  approvalDate?: string
  createdBy: string
  createdAt: string
  updatedAt: string
}

interface CreateTrafficPlanData {
  name: string
  type: 'TRAFFIC_FLOW' | 'SIGNALIZATION' | 'PUBLIC_TRANSPORT' | 'PARKING' | 'CYCLING' | 'PEDESTRIAN' | 'COMPREHENSIVE'
  area: {
    name: string
    coordinates: { lat: number; lng: number }[]
    districts: string[]
  }
  objectives: string[]
  budget: {
    total: number
  }
}

interface UseTrafficPlanningReturn {
  trafficPlans: TrafficPlan[]
  loading: boolean
  error: string | null
  createTrafficPlan: (data: CreateTrafficPlanData) => Promise<TrafficPlan>
  updateTrafficPlan: (id: string, data: Partial<CreateTrafficPlanData>) => Promise<TrafficPlan>
  updateCurrentSituation: (id: string, situation: any) => Promise<TrafficPlan>
  addProposal: (id: string, category: string, proposal: any) => Promise<TrafficPlan>
  updateProposal: (id: string, category: string, proposalId: string, data: any) => Promise<TrafficPlan>
  addImplementationPhase: (id: string, phase: any) => Promise<TrafficPlan>
  updatePhaseStatus: (id: string, phaseId: string, status: string) => Promise<TrafficPlan>
  updateBudget: (id: string, budget: any) => Promise<TrafficPlan>
  addIndicator: (id: string, indicator: any) => Promise<TrafficPlan>
  updateIndicator: (id: string, indicatorId: string, current: number) => Promise<TrafficPlan>
  addStudy: (id: string, study: any) => Promise<TrafficPlan>
  addEvaluation: (id: string, evaluation: any) => Promise<TrafficPlan>
  addStakeholder: (id: string, category: string, stakeholder: string) => Promise<TrafficPlan>
  startPublicConsultation: (id: string) => Promise<TrafficPlan>
  addConsultationSession: (id: string, session: any) => Promise<TrafficPlan>
  addConsultationFeedback: (id: string, feedback: string) => Promise<TrafficPlan>
  updateEnvironmentalImpact: (id: string, environmental: any) => Promise<TrafficPlan>
  approvePlan: (id: string) => Promise<TrafficPlan>
  startImplementation: (id: string) => Promise<TrafficPlan>
  completePlan: (id: string) => Promise<TrafficPlan>
  deleteTrafficPlan: (id: string) => Promise<void>
  getPlansByType: (type: string) => TrafficPlan[]
  getPlansByStatus: (status: string) => TrafficPlan[]
  getActivePlans: () => TrafficPlan[]
  refreshTrafficPlans: () => Promise<void>
}

export function useTrafficPlanning(): UseTrafficPlanningReturn {
  const [trafficPlans, setTrafficPlans] = useState<TrafficPlan[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTrafficPlans = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await apiClient.get('/api/secretarias/urban-planning/traffic-planning')
      setTrafficPlans(data.plans || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar planos de trânsito')
    } finally {
      setLoading(false)
    }
  }, [])

  const createTrafficPlan = useCallback(async (data: CreateTrafficPlanData): Promise<TrafficPlan> => {
    try {
      setError(null)
      const response = await apiClient.post('/api/secretarias/urban-planning/traffic-planning', data)
      const newPlan = response.plan
      setTrafficPlans(prev => [newPlan, ...prev])
      return newPlan
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar plano de trânsito'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const updateTrafficPlan = useCallback(async (id: string, data: Partial<CreateTrafficPlanData>): Promise<TrafficPlan> => {
    try {
      setError(null)
      const response = await apiClient.put(`/api/secretarias/urban-planning/traffic-planning/${id}`, data)
      const updatedPlan = response.plan
      setTrafficPlans(prev => prev.map(plan => plan.id === id ? updatedPlan : plan))
      return updatedPlan
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar plano de trânsito'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const updateCurrentSituation = useCallback(async (id: string, situation: any): Promise<TrafficPlan> => {
    try {
      setError(null)
      const response = await apiClient.put(`/api/secretarias/urban-planning/traffic-planning/${id}/current-situation`, situation)
      const updatedPlan = response.plan
      setTrafficPlans(prev => prev.map(plan => plan.id === id ? updatedPlan : plan))
      return updatedPlan
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar situação atual'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const addProposal = useCallback(async (id: string, category: string, proposal: any): Promise<TrafficPlan> => {
    try {
      setError(null)
      const response = await apiClient.post(`/api/secretarias/urban-planning/traffic-planning/${id}/proposals/${category}`, proposal)
      const updatedPlan = response.plan
      setTrafficPlans(prev => prev.map(plan => plan.id === id ? updatedPlan : plan))
      return updatedPlan
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao adicionar proposta'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const updateProposal = useCallback(async (id: string, category: string, proposalId: string, data: any): Promise<TrafficPlan> => {
    try {
      setError(null)
      const response = await apiClient.put(`/api/secretarias/urban-planning/traffic-planning/${id}/proposals/${category}/${proposalId}`, data)
      const updatedPlan = response.plan
      setTrafficPlans(prev => prev.map(plan => plan.id === id ? updatedPlan : plan))
      return updatedPlan
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar proposta'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const addImplementationPhase = useCallback(async (id: string, phase: any): Promise<TrafficPlan> => {
    try {
      setError(null)
      const response = await apiClient.post(`/api/secretarias/urban-planning/traffic-planning/${id}/implementation/phases`, phase)
      const updatedPlan = response.plan
      setTrafficPlans(prev => prev.map(plan => plan.id === id ? updatedPlan : plan))
      return updatedPlan
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao adicionar fase de implementação'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const updatePhaseStatus = useCallback(async (id: string, phaseId: string, status: string): Promise<TrafficPlan> => {
    try {
      setError(null)
      const response = await apiClient.put(`/api/secretarias/urban-planning/traffic-planning/${id}/implementation/phases/${phaseId}`, { status })
      const updatedPlan = response.plan
      setTrafficPlans(prev => prev.map(plan => plan.id === id ? updatedPlan : plan))
      return updatedPlan
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar status da fase'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const updateBudget = useCallback(async (id: string, budget: any): Promise<TrafficPlan> => {
    try {
      setError(null)
      const response = await apiClient.put(`/api/secretarias/urban-planning/traffic-planning/${id}/budget`, budget)
      const updatedPlan = response.plan
      setTrafficPlans(prev => prev.map(plan => plan.id === id ? updatedPlan : plan))
      return updatedPlan
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar orçamento'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const addIndicator = useCallback(async (id: string, indicator: any): Promise<TrafficPlan> => {
    try {
      setError(null)
      const response = await apiClient.post(`/api/secretarias/urban-planning/traffic-planning/${id}/monitoring/indicators`, indicator)
      const updatedPlan = response.plan
      setTrafficPlans(prev => prev.map(plan => plan.id === id ? updatedPlan : plan))
      return updatedPlan
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao adicionar indicador'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const updateIndicator = useCallback(async (id: string, indicatorId: string, current: number): Promise<TrafficPlan> => {
    try {
      setError(null)
      const response = await apiClient.put(`/api/secretarias/urban-planning/traffic-planning/${id}/monitoring/indicators/${indicatorId}`, { current })
      const updatedPlan = response.plan
      setTrafficPlans(prev => prev.map(plan => plan.id === id ? updatedPlan : plan))
      return updatedPlan
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar indicador'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const addStudy = useCallback(async (id: string, study: any): Promise<TrafficPlan> => {
    try {
      setError(null)
      const response = await apiClient.post(`/api/secretarias/urban-planning/traffic-planning/${id}/monitoring/studies`, study)
      const updatedPlan = response.plan
      setTrafficPlans(prev => prev.map(plan => plan.id === id ? updatedPlan : plan))
      return updatedPlan
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao adicionar estudo'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const addEvaluation = useCallback(async (id: string, evaluation: any): Promise<TrafficPlan> => {
    try {
      setError(null)
      const response = await apiClient.post(`/api/secretarias/urban-planning/traffic-planning/${id}/monitoring/evaluations`, evaluation)
      const updatedPlan = response.plan
      setTrafficPlans(prev => prev.map(plan => plan.id === id ? updatedPlan : plan))
      return updatedPlan
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao adicionar avaliação'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const addStakeholder = useCallback(async (id: string, category: string, stakeholder: string): Promise<TrafficPlan> => {
    try {
      setError(null)
      const response = await apiClient.post(`/api/secretarias/urban-planning/traffic-planning/${id}/stakeholders/${category}`, { stakeholder })
      const updatedPlan = response.plan
      setTrafficPlans(prev => prev.map(plan => plan.id === id ? updatedPlan : plan))
      return updatedPlan
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao adicionar stakeholder'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const startPublicConsultation = useCallback(async (id: string): Promise<TrafficPlan> => {
    try {
      setError(null)
      const response = await apiClient.post(`/api/secretarias/urban-planning/traffic-planning/${id}/consultation/start`, {})
      const updatedPlan = response.plan
      setTrafficPlans(prev => prev.map(plan => plan.id === id ? updatedPlan : plan))
      return updatedPlan
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao iniciar consulta pública'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const addConsultationSession = useCallback(async (id: string, session: any): Promise<TrafficPlan> => {
    try {
      setError(null)
      const response = await apiClient.post(`/api/secretarias/urban-planning/traffic-planning/${id}/consultation/sessions`, session)
      const updatedPlan = response.plan
      setTrafficPlans(prev => prev.map(plan => plan.id === id ? updatedPlan : plan))
      return updatedPlan
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao adicionar sessão de consulta'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const addConsultationFeedback = useCallback(async (id: string, feedback: string): Promise<TrafficPlan> => {
    try {
      setError(null)
      const response = await apiClient.post(`/api/secretarias/urban-planning/traffic-planning/${id}/consultation/feedback`, { feedback })
      const updatedPlan = response.plan
      setTrafficPlans(prev => prev.map(plan => plan.id === id ? updatedPlan : plan))
      return updatedPlan
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao adicionar feedback'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const updateEnvironmentalImpact = useCallback(async (id: string, environmental: any): Promise<TrafficPlan> => {
    try {
      setError(null)
      const response = await apiClient.put(`/api/secretarias/urban-planning/traffic-planning/${id}/environmental`, environmental)
      const updatedPlan = response.plan
      setTrafficPlans(prev => prev.map(plan => plan.id === id ? updatedPlan : plan))
      return updatedPlan
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar impacto ambiental'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const approvePlan = useCallback(async (id: string): Promise<TrafficPlan> => {
    return updateTrafficPlan(id, { status: 'APPROVED' } as any)
  }, [updateTrafficPlan])

  const startImplementation = useCallback(async (id: string): Promise<TrafficPlan> => {
    return updateTrafficPlan(id, { status: 'IMPLEMENTATION' } as any)
  }, [updateTrafficPlan])

  const completePlan = useCallback(async (id: string): Promise<TrafficPlan> => {
    return updateTrafficPlan(id, { status: 'COMPLETED' } as any)
  }, [updateTrafficPlan])

  const deleteTrafficPlan = useCallback(async (id: string): Promise<void> => {
    try {
      setError(null)
      await apiClient.delete(`/api/secretarias/urban-planning/traffic-planning/${id}`)
      setTrafficPlans(prev => prev.filter(plan => plan.id !== id))
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao excluir plano de trânsito'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const getPlansByType = useCallback((type: string) => trafficPlans.filter(plan => plan.type === type), [trafficPlans])
  const getPlansByStatus = useCallback((status: string) => trafficPlans.filter(plan => plan.status === status), [trafficPlans])
  const getActivePlans = useCallback(() => trafficPlans.filter(plan => ['APPROVED', 'IMPLEMENTATION', 'MONITORING'].includes(plan.status)), [trafficPlans])

  const refreshTrafficPlans = useCallback(async () => {
    await fetchTrafficPlans()
  }, [fetchTrafficPlans])

  useEffect(() => {
    fetchTrafficPlans()
  }, [fetchTrafficPlans])

  return {
    trafficPlans,
    loading,
    error,
    createTrafficPlan,
    updateTrafficPlan,
    updateCurrentSituation,
    addProposal,
    updateProposal,
    addImplementationPhase,
    updatePhaseStatus,
    updateBudget,
    addIndicator,
    updateIndicator,
    addStudy,
    addEvaluation,
    addStakeholder,
    startPublicConsultation,
    addConsultationSession,
    addConsultationFeedback,
    updateEnvironmentalImpact,
    approvePlan,
    startImplementation,
    completePlan,
    deleteTrafficPlan,
    getPlansByType,
    getPlansByStatus,
    getActivePlans,
    refreshTrafficPlans
  }
}

export type { TrafficPlan, CreateTrafficPlanData, UseTrafficPlanningReturn }