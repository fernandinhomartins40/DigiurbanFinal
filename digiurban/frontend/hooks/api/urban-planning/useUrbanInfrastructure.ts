'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAdminAuth } from '@/contexts/AdminAuthContext'

interface UrbanInfrastructure {
  id: string
  name: string
  category: 'TRANSPORTATION' | 'UTILITIES' | 'COMMUNICATION' | 'ENERGY' | 'WATER' | 'WASTE' | 'SOCIAL'
  type: string
  location: {
    address: string
    district: string
    coordinates: { lat: number; lng: number }[]
    area: number
  }
  description: string
  specifications: {
    technical: {
      capacity: number
      dimensions: { length: number; width: number; height?: number }
      materials: string[]
      standards: string[]
      technology: string
    }
    design: {
      lifespan: number
      designStandards: string[]
      accessibility: boolean
      sustainability: string[]
    }
    operational: {
      serviceLevel: 'BASIC' | 'INTERMEDIATE' | 'ADVANCED' | 'PREMIUM'
      operatingHours: string
      capacity: number
      throughput: number
    }
  }
  construction: {
    status: 'PLANNED' | 'DESIGN' | 'BIDDING' | 'CONSTRUCTION' | 'COMMISSIONING' | 'OPERATIONAL' | 'MAINTENANCE' | 'DECOMMISSIONED'
    contractor: {
      company: string
      registration: string
      contact: string
      value: number
    }
    timeline: {
      startDate: string
      expectedEndDate: string
      actualEndDate?: string
      phases: {
        name: string
        startDate: string
        endDate: string
        status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'DELAYED'
        progress: number
      }[]
    }
    permits: {
      type: string
      number: string
      issueDate: string
      expiryDate?: string
      status: 'VALID' | 'EXPIRED' | 'PENDING'
    }[]
  }
  operation: {
    operator: {
      entity: string
      type: 'PUBLIC' | 'PRIVATE' | 'MIXED'
      contact: string
      contract?: {
        startDate: string
        endDate: string
        value: number
        terms: string[]
      }
    }
    performance: {
      availability: number
      reliability: number
      efficiency: number
      utilization: number
      serviceQuality: 'EXCELLENT' | 'GOOD' | 'SATISFACTORY' | 'POOR'
    }
    users: {
      current: number
      capacity: number
      growth: number
      demographics: {
        residential: number
        commercial: number
        industrial: number
        institutional: number
      }
    }
  }
  maintenance: {
    schedule: {
      type: 'PREVENTIVE' | 'CORRECTIVE' | 'PREDICTIVE' | 'EMERGENCY'
      frequency: string
      lastMaintenance: string
      nextMaintenance: string
      responsible: string
    }[]
    history: {
      date: string
      type: 'PREVENTIVE' | 'CORRECTIVE' | 'EMERGENCY' | 'UPGRADE'
      description: string
      cost: number
      duration: number
      contractor: string
      status: 'COMPLETED' | 'IN_PROGRESS' | 'SCHEDULED'
    }[]
    condition: {
      overall: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR' | 'CRITICAL'
      components: {
        component: string
        condition: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR' | 'CRITICAL'
        lastInspection: string
        nextInspection: string
      }[]
    }
  }
  financial: {
    construction: {
      budgeted: number
      actual: number
      variance: number
      funding: {
        source: string
        amount: number
        type: 'GRANT' | 'LOAN' | 'MUNICIPAL' | 'PRIVATE'
      }[]
    }
    operation: {
      annual: {
        revenue: number
        costs: number
        profit: number
        subsidy: number
      }
      lifecycle: {
        totalCost: number
        netPresentValue: number
        returnOnInvestment: number
      }
    }
    depreciation: {
      method: string
      rate: number
      currentValue: number
      remainingLife: number
    }
  }
  environmental: {
    impact: {
      assessment: 'REQUIRED' | 'NOT_REQUIRED' | 'COMPLETED'
      license: string
      conditions: string[]
      monitoring: string[]
    }
    sustainability: {
      energyEfficiency: number
      carbonFootprint: number
      wasteReduction: number
      renewableEnergy: number
      greenCertifications: string[]
    }
    compliance: {
      environmental: string[]
      safety: string[]
      health: string[]
      violations: {
        date: string
        type: string
        description: string
        fine: number
        status: 'OPEN' | 'RESOLVED'
      }[]
    }
  }
  connectivity: {
    networks: {
      connected: string[]
      dependencies: string[]
      redundancy: string[]
    }
    integration: {
      smartSystems: boolean
      automation: number
      monitoring: boolean
      remoteControl: boolean
    }
  }
  risks: {
    operational: {
      risk: string
      probability: 'LOW' | 'MEDIUM' | 'HIGH'
      impact: 'LOW' | 'MEDIUM' | 'HIGH'
      mitigation: string
    }[]
    technical: {
      risk: string
      probability: 'LOW' | 'MEDIUM' | 'HIGH'
      impact: 'LOW' | 'MEDIUM' | 'HIGH'
      mitigation: string
    }[]
    financial: {
      risk: string
      probability: 'LOW' | 'MEDIUM' | 'HIGH'
      impact: 'LOW' | 'MEDIUM' | 'HIGH'
      mitigation: string
    }[]
    environmental: {
      risk: string
      probability: 'LOW' | 'MEDIUM' | 'HIGH'
      impact: 'LOW' | 'MEDIUM' | 'HIGH'
      mitigation: string
    }[]
  }
  planning: {
    masterPlan: string
    zoning: string
    futureExpansion: {
      planned: boolean
      timeline: string
      capacity: number
      budget: number
    }
    upgrades: {
      type: string
      description: string
      timeline: string
      budget: number
      priority: 'LOW' | 'MEDIUM' | 'HIGH'
    }[]
  }
  documents: {
    type: string
    name: string
    version: string
    url: string
    date: string
  }[]
  inspections: {
    id: string
    date: string
    type: 'SAFETY' | 'TECHNICAL' | 'ENVIRONMENTAL' | 'REGULATORY'
    inspector: string
    findings: string[]
    recommendations: string[]
    status: 'COMPLIANT' | 'NON_COMPLIANT' | 'CONDITIONAL'
  }[]
  createdBy: string
  createdAt: string
  updatedAt: string
}

interface CreateUrbanInfrastructureData {
  name: string
  category: 'TRANSPORTATION' | 'UTILITIES' | 'COMMUNICATION' | 'ENERGY' | 'WATER' | 'WASTE' | 'SOCIAL'
  type: string
  location: {
    address: string
    district: string
    coordinates: { lat: number; lng: number }[]
    area: number
  }
  description: string
  specifications: {
    technical: {
      capacity: number
      dimensions: { length: number; width: number; height?: number }
    }
    design: {
      lifespan: number
      accessibility: boolean
    }
  }
}

interface UseUrbanInfrastructureReturn {
  infrastructure: UrbanInfrastructure[]
  loading: boolean
  error: string | null
  createInfrastructure: (data: CreateUrbanInfrastructureData) => Promise<UrbanInfrastructure>
  updateInfrastructure: (id: string, data: Partial<CreateUrbanInfrastructureData>) => Promise<UrbanInfrastructure>
  updateSpecifications: (id: string, specifications: any) => Promise<UrbanInfrastructure>
  updateConstructionStatus: (id: string, status: string) => Promise<UrbanInfrastructure>
  addConstructionPhase: (id: string, phase: any) => Promise<UrbanInfrastructure>
  updatePhaseProgress: (id: string, phaseId: string, progress: number) => Promise<UrbanInfrastructure>
  assignContractor: (id: string, contractor: any) => Promise<UrbanInfrastructure>
  addPermit: (id: string, permit: any) => Promise<UrbanInfrastructure>
  updatePermitStatus: (id: string, permitId: string, status: string) => Promise<UrbanInfrastructure>
  assignOperator: (id: string, operator: any) => Promise<UrbanInfrastructure>
  updatePerformance: (id: string, performance: any) => Promise<UrbanInfrastructure>
  updateUserData: (id: string, users: any) => Promise<UrbanInfrastructure>
  scheduleMaintenance: (id: string, maintenance: any) => Promise<UrbanInfrastructure>
  addMaintenanceRecord: (id: string, record: any) => Promise<UrbanInfrastructure>
  updateCondition: (id: string, condition: any) => Promise<UrbanInfrastructure>
  updateFinancial: (id: string, financial: any) => Promise<UrbanInfrastructure>
  updateEnvironmental: (id: string, environmental: any) => Promise<UrbanInfrastructure>
  addRisk: (id: string, category: string, risk: any) => Promise<UrbanInfrastructure>
  updateRisk: (id: string, riskId: string, data: any) => Promise<UrbanInfrastructure>
  addInspection: (id: string, inspection: any) => Promise<UrbanInfrastructure>
  planUpgrade: (id: string, upgrade: any) => Promise<UrbanInfrastructure>
  deleteInfrastructure: (id: string) => Promise<void>
  getInfrastructureByCategory: (category: string) => UrbanInfrastructure[]
  getInfrastructureByDistrict: (district: string) => UrbanInfrastructure[]
  getInfrastructureByStatus: (status: string) => UrbanInfrastructure[]
  getInfrastructureNeedingMaintenance: () => UrbanInfrastructure[]
  refreshInfrastructure: () => Promise<void>
}

export function useUrbanInfrastructure(): UseUrbanInfrastructureReturn {
  const [infrastructure, setInfrastructure] = useState<UrbanInfrastructure[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchInfrastructure = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await apiClient.get('/api/secretarias/urban-planning/infrastructure')
      setInfrastructure(data.infrastructure || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar infraestrutura urbana')
    } finally {
      setLoading(false)
    }
  }, [])

  const createInfrastructure = useCallback(async (data: CreateUrbanInfrastructureData): Promise<UrbanInfrastructure> => {
    try {
      setError(null)
      const response = await apiClient.post('/api/secretarias/urban-planning/infrastructure', data)
      const newInfrastructure = response.infrastructure
      setInfrastructure(prev => [newInfrastructure, ...prev])
      return newInfrastructure
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar infraestrutura'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const updateInfrastructure = useCallback(async (id: string, data: Partial<CreateUrbanInfrastructureData>): Promise<UrbanInfrastructure> => {
    try {
      setError(null)
      const response = await apiClient.put(`/api/secretarias/urban-planning/infrastructure/${id}`, data)
      const updatedInfrastructure = response.infrastructure
      setInfrastructure(prev => prev.map(infra => infra.id === id ? updatedInfrastructure : infra))
      return updatedInfrastructure
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar infraestrutura'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const updateSpecifications = useCallback(async (id: string, specifications: any): Promise<UrbanInfrastructure> => {
    try {
      setError(null)
      const response = await apiClient.put(`/api/secretarias/urban-planning/infrastructure/${id}/specifications`, specifications)
      const updatedInfrastructure = response.infrastructure
      setInfrastructure(prev => prev.map(infra => infra.id === id ? updatedInfrastructure : infra))
      return updatedInfrastructure
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar especificações'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const updateConstructionStatus = useCallback(async (id: string, status: string): Promise<UrbanInfrastructure> => {
    try {
      setError(null)
      const response = await apiClient.put(`/api/secretarias/urban-planning/infrastructure/${id}/construction/status`, { status })
      const updatedInfrastructure = response.infrastructure
      setInfrastructure(prev => prev.map(infra => infra.id === id ? updatedInfrastructure : infra))
      return updatedInfrastructure
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar status da construção'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const addConstructionPhase = useCallback(async (id: string, phase: any): Promise<UrbanInfrastructure> => {
    try {
      setError(null)
      const response = await apiClient.post(`/api/secretarias/urban-planning/infrastructure/${id}/construction/phases`, phase)
      const updatedInfrastructure = response.infrastructure
      setInfrastructure(prev => prev.map(infra => infra.id === id ? updatedInfrastructure : infra))
      return updatedInfrastructure
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao adicionar fase de construção'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const updatePhaseProgress = useCallback(async (id: string, phaseId: string, progress: number): Promise<UrbanInfrastructure> => {
    try {
      setError(null)
      const response = await apiClient.put(`/api/secretarias/urban-planning/infrastructure/${id}/construction/phases/${phaseId}`, { progress })
      const updatedInfrastructure = response.infrastructure
      setInfrastructure(prev => prev.map(infra => infra.id === id ? updatedInfrastructure : infra))
      return updatedInfrastructure
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar progresso da fase'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const assignContractor = useCallback(async (id: string, contractor: any): Promise<UrbanInfrastructure> => {
    try {
      setError(null)
      const response = await apiClient.put(`/api/secretarias/urban-planning/infrastructure/${id}/construction/contractor`, contractor)
      const updatedInfrastructure = response.infrastructure
      setInfrastructure(prev => prev.map(infra => infra.id === id ? updatedInfrastructure : infra))
      return updatedInfrastructure
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atribuir contratada'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const addPermit = useCallback(async (id: string, permit: any): Promise<UrbanInfrastructure> => {
    try {
      setError(null)
      const response = await apiClient.post(`/api/secretarias/urban-planning/infrastructure/${id}/construction/permits`, permit)
      const updatedInfrastructure = response.infrastructure
      setInfrastructure(prev => prev.map(infra => infra.id === id ? updatedInfrastructure : infra))
      return updatedInfrastructure
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao adicionar licença'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const updatePermitStatus = useCallback(async (id: string, permitId: string, status: string): Promise<UrbanInfrastructure> => {
    try {
      setError(null)
      const response = await apiClient.put(`/api/secretarias/urban-planning/infrastructure/${id}/construction/permits/${permitId}`, { status })
      const updatedInfrastructure = response.infrastructure
      setInfrastructure(prev => prev.map(infra => infra.id === id ? updatedInfrastructure : infra))
      return updatedInfrastructure
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar status da licença'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const assignOperator = useCallback(async (id: string, operator: any): Promise<UrbanInfrastructure> => {
    try {
      setError(null)
      const response = await apiClient.put(`/api/secretarias/urban-planning/infrastructure/${id}/operation/operator`, operator)
      const updatedInfrastructure = response.infrastructure
      setInfrastructure(prev => prev.map(infra => infra.id === id ? updatedInfrastructure : infra))
      return updatedInfrastructure
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atribuir operador'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const updatePerformance = useCallback(async (id: string, performance: any): Promise<UrbanInfrastructure> => {
    try {
      setError(null)
      const response = await apiClient.put(`/api/secretarias/urban-planning/infrastructure/${id}/operation/performance`, performance)
      const updatedInfrastructure = response.infrastructure
      setInfrastructure(prev => prev.map(infra => infra.id === id ? updatedInfrastructure : infra))
      return updatedInfrastructure
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar desempenho'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const updateUserData = useCallback(async (id: string, users: any): Promise<UrbanInfrastructure> => {
    try {
      setError(null)
      const response = await apiClient.put(`/api/secretarias/urban-planning/infrastructure/${id}/operation/users`, users)
      const updatedInfrastructure = response.infrastructure
      setInfrastructure(prev => prev.map(infra => infra.id === id ? updatedInfrastructure : infra))
      return updatedInfrastructure
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar dados de usuários'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const scheduleMaintenance = useCallback(async (id: string, maintenance: any): Promise<UrbanInfrastructure> => {
    try {
      setError(null)
      const response = await apiClient.post(`/api/secretarias/urban-planning/infrastructure/${id}/maintenance/schedule`, maintenance)
      const updatedInfrastructure = response.infrastructure
      setInfrastructure(prev => prev.map(infra => infra.id === id ? updatedInfrastructure : infra))
      return updatedInfrastructure
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao agendar manutenção'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const addMaintenanceRecord = useCallback(async (id: string, record: any): Promise<UrbanInfrastructure> => {
    try {
      setError(null)
      const response = await apiClient.post(`/api/secretarias/urban-planning/infrastructure/${id}/maintenance/history`, record)
      const updatedInfrastructure = response.infrastructure
      setInfrastructure(prev => prev.map(infra => infra.id === id ? updatedInfrastructure : infra))
      return updatedInfrastructure
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao adicionar registro de manutenção'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const updateCondition = useCallback(async (id: string, condition: any): Promise<UrbanInfrastructure> => {
    try {
      setError(null)
      const response = await apiClient.put(`/api/secretarias/urban-planning/infrastructure/${id}/maintenance/condition`, condition)
      const updatedInfrastructure = response.infrastructure
      setInfrastructure(prev => prev.map(infra => infra.id === id ? updatedInfrastructure : infra))
      return updatedInfrastructure
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar condição'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const updateFinancial = useCallback(async (id: string, financial: any): Promise<UrbanInfrastructure> => {
    try {
      setError(null)
      const response = await apiClient.put(`/api/secretarias/urban-planning/infrastructure/${id}/financial`, financial)
      const updatedInfrastructure = response.infrastructure
      setInfrastructure(prev => prev.map(infra => infra.id === id ? updatedInfrastructure : infra))
      return updatedInfrastructure
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar dados financeiros'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const updateEnvironmental = useCallback(async (id: string, environmental: any): Promise<UrbanInfrastructure> => {
    try {
      setError(null)
      const response = await apiClient.put(`/api/secretarias/urban-planning/infrastructure/${id}/environmental`, environmental)
      const updatedInfrastructure = response.infrastructure
      setInfrastructure(prev => prev.map(infra => infra.id === id ? updatedInfrastructure : infra))
      return updatedInfrastructure
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar dados ambientais'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const addRisk = useCallback(async (id: string, category: string, risk: any): Promise<UrbanInfrastructure> => {
    try {
      setError(null)
      const response = await apiClient.post(`/api/secretarias/urban-planning/infrastructure/${id}/risks/${category}`, risk)
      const updatedInfrastructure = response.infrastructure
      setInfrastructure(prev => prev.map(infra => infra.id === id ? updatedInfrastructure : infra))
      return updatedInfrastructure
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao adicionar risco'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const updateRisk = useCallback(async (id: string, riskId: string, data: any): Promise<UrbanInfrastructure> => {
    try {
      setError(null)
      const response = await apiClient.put(`/api/secretarias/urban-planning/infrastructure/${id}/risks/${riskId}`, data)
      const updatedInfrastructure = response.infrastructure
      setInfrastructure(prev => prev.map(infra => infra.id === id ? updatedInfrastructure : infra))
      return updatedInfrastructure
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar risco'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const addInspection = useCallback(async (id: string, inspection: any): Promise<UrbanInfrastructure> => {
    try {
      setError(null)
      const response = await apiClient.post(`/api/secretarias/urban-planning/infrastructure/${id}/inspections`, inspection)
      const updatedInfrastructure = response.infrastructure
      setInfrastructure(prev => prev.map(infra => infra.id === id ? updatedInfrastructure : infra))
      return updatedInfrastructure
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao adicionar inspeção'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const planUpgrade = useCallback(async (id: string, upgrade: any): Promise<UrbanInfrastructure> => {
    try {
      setError(null)
      const response = await apiClient.post(`/api/secretarias/urban-planning/infrastructure/${id}/planning/upgrades`, upgrade)
      const updatedInfrastructure = response.infrastructure
      setInfrastructure(prev => prev.map(infra => infra.id === id ? updatedInfrastructure : infra))
      return updatedInfrastructure
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao planejar upgrade'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const deleteInfrastructure = useCallback(async (id: string): Promise<void> => {
    try {
      setError(null)
      await apiClient.delete(`/api/secretarias/urban-planning/infrastructure/${id}`)
      setInfrastructure(prev => prev.filter(infra => infra.id !== id))
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao excluir infraestrutura'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const getInfrastructureByCategory = useCallback((category: string) => infrastructure.filter(infra => infra.category === category), [infrastructure])
  const getInfrastructureByDistrict = useCallback((district: string) => infrastructure.filter(infra => infra.location.district === district), [infrastructure])
  const getInfrastructureByStatus = useCallback((status: string) => infrastructure.filter(infra => infra.construction.status === status), [infrastructure])
  const getInfrastructureNeedingMaintenance = useCallback(() => {
    const today = new Date()
    return infrastructure.filter(infra =>
      infra.maintenance.schedule.some(schedule =>
        new Date(schedule.nextMaintenance) <= today
      )
    )
  }, [infrastructure])

  const refreshInfrastructure = useCallback(async () => {
    await fetchInfrastructure()
  }, [fetchInfrastructure])

  useEffect(() => {
    fetchInfrastructure()
  }, [fetchInfrastructure])

  return {
    infrastructure,
    loading,
    error,
    createInfrastructure,
    updateInfrastructure,
    updateSpecifications,
    updateConstructionStatus,
    addConstructionPhase,
    updatePhaseProgress,
    assignContractor,
    addPermit,
    updatePermitStatus,
    assignOperator,
    updatePerformance,
    updateUserData,
    scheduleMaintenance,
    addMaintenanceRecord,
    updateCondition,
    updateFinancial,
    updateEnvironmental,
    addRisk,
    updateRisk,
    addInspection,
    planUpgrade,
    deleteInfrastructure,
    getInfrastructureByCategory,
    getInfrastructureByDistrict,
    getInfrastructureByStatus,
    getInfrastructureNeedingMaintenance,
    refreshInfrastructure
  }
}

export type { UrbanInfrastructure, CreateUrbanInfrastructureData, UseUrbanInfrastructureReturn }