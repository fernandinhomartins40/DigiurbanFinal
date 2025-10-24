'use client'

import { useState, useEffect, useCallback } from 'react'
import { apiClient } from '@/lib/auth'

interface HousingProgram {
  id: string
  name: string
  code: string
  type: 'SOCIAL_HOUSING' | 'AFFORDABLE_HOUSING' | 'RENT_ASSISTANCE' | 'HOME_IMPROVEMENT' | 'REGULARIZATION' | 'EMERGENCY_HOUSING'
  category: 'FEDERAL' | 'STATE' | 'MUNICIPAL' | 'MIXED' | 'PRIVATE_PARTNERSHIP'
  description: string
  objectives: string[]
  targetAudience: {
    incomeRange: { min: number; max: number }
    familySize: { min: number; max: number }
    criteria: string[]
    priorities: string[]
    restrictions: string[]
  }
  benefits: {
    type: 'UNIT_PROVISION' | 'RENT_SUBSIDY' | 'FINANCING' | 'IMPROVEMENT_GRANT' | 'REGULARIZATION'
    description: string
    value: number
    duration?: number
    conditions: string[]
  }[]
  requirements: {
    eligibility: string[]
    documentation: string[]
    timeRequirements: string[]
    residencyRequirements: string[]
  }
  timeline: {
    startDate: string
    endDate?: string
    phases: {
      name: string
      startDate: string
      endDate: string
      status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'DELAYED'
      activities: string[]
    }[]
  }
  budget: {
    total: number
    allocated: number
    committed: number
    spent: number
    remaining: number
    funding: {
      source: string
      amount: number
      type: 'FEDERAL' | 'STATE' | 'MUNICIPAL' | 'PRIVATE' | 'INTERNATIONAL'
      status: 'CONFIRMED' | 'PENDING' | 'RECEIVED'
    }[]
    expenses: {
      category: string
      budgeted: number
      spent: number
      percentage: number
    }[]
  }
  implementation: {
    responsible: {
      coordinator: string
      team: {
        name: string
        role: string
        department: string
      }[]
    }
    partners: {
      entity: string
      role: string
      contribution: string
      agreement?: string
    }[]
    contractors: {
      company: string
      service: string
      value: number
      status: 'BIDDING' | 'CONTRACTED' | 'ACTIVE' | 'COMPLETED'
    }[]
  }
  units: {
    planned: number
    underConstruction: number
    completed: number
    occupied: number
    available: number
    types: {
      type: string
      bedrooms: number
      area: number
      quantity: number
      value: number
    }[]
  }
  locations: {
    name: string
    district: string
    address: string
    coordinates: { lat: number; lng: number }
    units: number
    infrastructure: {
      water: boolean
      sewer: boolean
      electricity: boolean
      gas: boolean
      internet: boolean
      transportation: boolean
    }
    services: {
      health: { distance: number; type: string }[]
      education: { distance: number; type: string }[]
      commerce: { distance: number; type: string }[]
    }
  }[]
  applications: {
    total: number
    approved: number
    waiting: number
    rejected: number
    processing: {
      phase: string
      count: number
    }[]
  }
  monitoring: {
    indicators: {
      name: string
      target: number
      current: number
      unit: string
      status: 'ON_TRACK' | 'AT_RISK' | 'OFF_TRACK'
    }[]
    reports: {
      period: string
      progress: number
      issues: string[]
      achievements: string[]
    }[]
  }
  compliance: {
    legal: {
      laws: string[]
      regulations: string[]
      permits: string[]
      status: 'COMPLIANT' | 'PENDING' | 'NON_COMPLIANT'
    }
    environmental: {
      license: string
      conditions: string[]
      monitoring: string[]
      status: 'COMPLIANT' | 'PENDING' | 'NON_COMPLIANT'
    }
    social: {
      participation: boolean
      consultation: boolean
      grievance: boolean
      status: 'ADEQUATE' | 'NEEDS_IMPROVEMENT'
    }
  }
  risks: {
    category: 'FINANCIAL' | 'TECHNICAL' | 'SOCIAL' | 'ENVIRONMENTAL' | 'REGULATORY'
    risk: string
    probability: 'LOW' | 'MEDIUM' | 'HIGH'
    impact: 'LOW' | 'MEDIUM' | 'HIGH'
    mitigation: string
    responsible: string
  }[]
  impact: {
    families: {
      benefited: number
      relocated: number
      improved: number
    }
    economic: {
      jobsCreated: number
      localEconomyImpact: number
      propertyValueIncrease: number
    }
    social: {
      accessToServices: number
      communityDevelopment: string[]
      qualityOfLife: string
    }
  }
  status: 'PLANNING' | 'APPROVED' | 'IMPLEMENTATION' | 'OPERATIONAL' | 'COMPLETED' | 'SUSPENDED' | 'CANCELLED'
  createdBy: string
  createdAt: string
  updatedAt: string
}

interface CreateHousingProgramData {
  name: string
  type: 'SOCIAL_HOUSING' | 'AFFORDABLE_HOUSING' | 'RENT_ASSISTANCE' | 'HOME_IMPROVEMENT' | 'REGULARIZATION' | 'EMERGENCY_HOUSING'
  category: 'FEDERAL' | 'STATE' | 'MUNICIPAL' | 'MIXED' | 'PRIVATE_PARTNERSHIP'
  description: string
  objectives: string[]
  targetAudience: {
    incomeRange: { min: number; max: number }
    criteria: string[]
  }
  budget: {
    total: number
  }
  timeline: {
    startDate: string
    endDate?: string
  }
}

interface UseHousingProgramsReturn {
  housingPrograms: HousingProgram[]
  loading: boolean
  error: string | null
  createProgram: (data: CreateHousingProgramData) => Promise<HousingProgram>
  updateProgram: (id: string, data: Partial<CreateHousingProgramData>) => Promise<HousingProgram>
  addBenefit: (id: string, benefit: any) => Promise<HousingProgram>
  updateRequirements: (id: string, requirements: any) => Promise<HousingProgram>
  addPhase: (id: string, phase: any) => Promise<HousingProgram>
  updatePhaseStatus: (id: string, phaseId: string, status: string) => Promise<HousingProgram>
  updateBudget: (id: string, budget: any) => Promise<HousingProgram>
  addFunding: (id: string, funding: any) => Promise<HousingProgram>
  assignResponsible: (id: string, responsible: any) => Promise<HousingProgram>
  addPartner: (id: string, partner: any) => Promise<HousingProgram>
  addContractor: (id: string, contractor: any) => Promise<HousingProgram>
  updateUnits: (id: string, units: any) => Promise<HousingProgram>
  addLocation: (id: string, location: any) => Promise<HousingProgram>
  updateApplications: (id: string, applications: any) => Promise<HousingProgram>
  addIndicator: (id: string, indicator: any) => Promise<HousingProgram>
  updateIndicator: (id: string, indicatorId: string, current: number) => Promise<HousingProgram>
  addReport: (id: string, report: any) => Promise<HousingProgram>
  updateCompliance: (id: string, compliance: any) => Promise<HousingProgram>
  addRisk: (id: string, risk: any) => Promise<HousingProgram>
  updateRisk: (id: string, riskId: string, data: any) => Promise<HousingProgram>
  updateImpact: (id: string, impact: any) => Promise<HousingProgram>
  approveProgram: (id: string) => Promise<HousingProgram>
  startImplementation: (id: string) => Promise<HousingProgram>
  completeProgram: (id: string) => Promise<HousingProgram>
  suspendProgram: (id: string, reason: string) => Promise<HousingProgram>
  deleteProgram: (id: string) => Promise<void>
  getProgramsByType: (type: string) => HousingProgram[]
  getProgramsByStatus: (status: string) => HousingProgram[]
  getActivePrograms: () => HousingProgram[]
  refreshPrograms: () => Promise<void>
}

export function useHousingPrograms(): UseHousingProgramsReturn {
  const [housingPrograms, setHousingPrograms] = useState<HousingProgram[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPrograms = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await apiClient.get('/api/specialized/housing/programs')
      setHousingPrograms(data.programs || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar programas habitacionais')
    } finally {
      setLoading(false)
    }
  }, [])

  const createProgram = useCallback(async (data: CreateHousingProgramData): Promise<HousingProgram> => {
    try {
      setError(null)
      const response = await apiClient.post('/api/specialized/housing/programs', data)
      const newProgram = response.program
      setHousingPrograms(prev => [newProgram, ...prev])
      return newProgram
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar programa habitacional'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const updateProgram = useCallback(async (id: string, data: Partial<CreateHousingProgramData>): Promise<HousingProgram> => {
    try {
      setError(null)
      const response = await apiClient.put(`/api/specialized/housing/programs/${id}`, data)
      const updatedProgram = response.program
      setHousingPrograms(prev => prev.map(program => program.id === id ? updatedProgram : program))
      return updatedProgram
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar programa'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const addBenefit = useCallback(async (id: string, benefit: any): Promise<HousingProgram> => {
    try {
      setError(null)
      const response = await apiClient.post(`/api/specialized/housing/programs/${id}/benefits`, benefit)
      const updatedProgram = response.program
      setHousingPrograms(prev => prev.map(program => program.id === id ? updatedProgram : program))
      return updatedProgram
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao adicionar benefício'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const updateRequirements = useCallback(async (id: string, requirements: any): Promise<HousingProgram> => {
    try {
      setError(null)
      const response = await apiClient.put(`/api/specialized/housing/programs/${id}/requirements`, requirements)
      const updatedProgram = response.program
      setHousingPrograms(prev => prev.map(program => program.id === id ? updatedProgram : program))
      return updatedProgram
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar requisitos'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const addPhase = useCallback(async (id: string, phase: any): Promise<HousingProgram> => {
    try {
      setError(null)
      const response = await apiClient.post(`/api/specialized/housing/programs/${id}/phases`, phase)
      const updatedProgram = response.program
      setHousingPrograms(prev => prev.map(program => program.id === id ? updatedProgram : program))
      return updatedProgram
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao adicionar fase'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const updatePhaseStatus = useCallback(async (id: string, phaseId: string, status: string): Promise<HousingProgram> => {
    try {
      setError(null)
      const response = await apiClient.put(`/api/specialized/housing/programs/${id}/phases/${phaseId}`, { status })
      const updatedProgram = response.program
      setHousingPrograms(prev => prev.map(program => program.id === id ? updatedProgram : program))
      return updatedProgram
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar status da fase'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const updateBudget = useCallback(async (id: string, budget: any): Promise<HousingProgram> => {
    try {
      setError(null)
      const response = await apiClient.put(`/api/specialized/housing/programs/${id}/budget`, budget)
      const updatedProgram = response.program
      setHousingPrograms(prev => prev.map(program => program.id === id ? updatedProgram : program))
      return updatedProgram
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar orçamento'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const addFunding = useCallback(async (id: string, funding: any): Promise<HousingProgram> => {
    try {
      setError(null)
      const response = await apiClient.post(`/api/specialized/housing/programs/${id}/funding`, funding)
      const updatedProgram = response.program
      setHousingPrograms(prev => prev.map(program => program.id === id ? updatedProgram : program))
      return updatedProgram
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao adicionar financiamento'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const assignResponsible = useCallback(async (id: string, responsible: any): Promise<HousingProgram> => {
    try {
      setError(null)
      const response = await apiClient.put(`/api/specialized/housing/programs/${id}/responsible`, responsible)
      const updatedProgram = response.program
      setHousingPrograms(prev => prev.map(program => program.id === id ? updatedProgram : program))
      return updatedProgram
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atribuir responsável'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const addPartner = useCallback(async (id: string, partner: any): Promise<HousingProgram> => {
    try {
      setError(null)
      const response = await apiClient.post(`/api/specialized/housing/programs/${id}/partners`, partner)
      const updatedProgram = response.program
      setHousingPrograms(prev => prev.map(program => program.id === id ? updatedProgram : program))
      return updatedProgram
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao adicionar parceiro'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const addContractor = useCallback(async (id: string, contractor: any): Promise<HousingProgram> => {
    try {
      setError(null)
      const response = await apiClient.post(`/api/specialized/housing/programs/${id}/contractors`, contractor)
      const updatedProgram = response.program
      setHousingPrograms(prev => prev.map(program => program.id === id ? updatedProgram : program))
      return updatedProgram
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao adicionar contratada'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const updateUnits = useCallback(async (id: string, units: any): Promise<HousingProgram> => {
    try {
      setError(null)
      const response = await apiClient.put(`/api/specialized/housing/programs/${id}/units`, units)
      const updatedProgram = response.program
      setHousingPrograms(prev => prev.map(program => program.id === id ? updatedProgram : program))
      return updatedProgram
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar unidades'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const addLocation = useCallback(async (id: string, location: any): Promise<HousingProgram> => {
    try {
      setError(null)
      const response = await apiClient.post(`/api/specialized/housing/programs/${id}/locations`, location)
      const updatedProgram = response.program
      setHousingPrograms(prev => prev.map(program => program.id === id ? updatedProgram : program))
      return updatedProgram
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao adicionar localização'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const updateApplications = useCallback(async (id: string, applications: any): Promise<HousingProgram> => {
    try {
      setError(null)
      const response = await apiClient.put(`/api/specialized/housing/programs/${id}/applications`, applications)
      const updatedProgram = response.program
      setHousingPrograms(prev => prev.map(program => program.id === id ? updatedProgram : program))
      return updatedProgram
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar inscrições'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const addIndicator = useCallback(async (id: string, indicator: any): Promise<HousingProgram> => {
    try {
      setError(null)
      const response = await apiClient.post(`/api/specialized/housing/programs/${id}/indicators`, indicator)
      const updatedProgram = response.program
      setHousingPrograms(prev => prev.map(program => program.id === id ? updatedProgram : program))
      return updatedProgram
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao adicionar indicador'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const updateIndicator = useCallback(async (id: string, indicatorId: string, current: number): Promise<HousingProgram> => {
    try {
      setError(null)
      const response = await apiClient.put(`/api/specialized/housing/programs/${id}/indicators/${indicatorId}`, { current })
      const updatedProgram = response.program
      setHousingPrograms(prev => prev.map(program => program.id === id ? updatedProgram : program))
      return updatedProgram
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar indicador'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const addReport = useCallback(async (id: string, report: any): Promise<HousingProgram> => {
    try {
      setError(null)
      const response = await apiClient.post(`/api/specialized/housing/programs/${id}/reports`, report)
      const updatedProgram = response.program
      setHousingPrograms(prev => prev.map(program => program.id === id ? updatedProgram : program))
      return updatedProgram
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao adicionar relatório'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const updateCompliance = useCallback(async (id: string, compliance: any): Promise<HousingProgram> => {
    try {
      setError(null)
      const response = await apiClient.put(`/api/specialized/housing/programs/${id}/compliance`, compliance)
      const updatedProgram = response.program
      setHousingPrograms(prev => prev.map(program => program.id === id ? updatedProgram : program))
      return updatedProgram
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar conformidade'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const addRisk = useCallback(async (id: string, risk: any): Promise<HousingProgram> => {
    try {
      setError(null)
      const response = await apiClient.post(`/api/specialized/housing/programs/${id}/risks`, risk)
      const updatedProgram = response.program
      setHousingPrograms(prev => prev.map(program => program.id === id ? updatedProgram : program))
      return updatedProgram
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao adicionar risco'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const updateRisk = useCallback(async (id: string, riskId: string, data: any): Promise<HousingProgram> => {
    try {
      setError(null)
      const response = await apiClient.put(`/api/specialized/housing/programs/${id}/risks/${riskId}`, data)
      const updatedProgram = response.program
      setHousingPrograms(prev => prev.map(program => program.id === id ? updatedProgram : program))
      return updatedProgram
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar risco'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const updateImpact = useCallback(async (id: string, impact: any): Promise<HousingProgram> => {
    try {
      setError(null)
      const response = await apiClient.put(`/api/specialized/housing/programs/${id}/impact`, impact)
      const updatedProgram = response.program
      setHousingPrograms(prev => prev.map(program => program.id === id ? updatedProgram : program))
      return updatedProgram
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar impacto'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const approveProgram = useCallback(async (id: string): Promise<HousingProgram> => {
    return updateProgram(id, { status: 'APPROVED' } as any)
  }, [updateProgram])

  const startImplementation = useCallback(async (id: string): Promise<HousingProgram> => {
    return updateProgram(id, { status: 'IMPLEMENTATION' } as any)
  }, [updateProgram])

  const completeProgram = useCallback(async (id: string): Promise<HousingProgram> => {
    return updateProgram(id, { status: 'COMPLETED' } as any)
  }, [updateProgram])

  const suspendProgram = useCallback(async (id: string, reason: string): Promise<HousingProgram> => {
    return updateProgram(id, { status: 'SUSPENDED' } as any)
  }, [updateProgram])

  const deleteProgram = useCallback(async (id: string): Promise<void> => {
    try {
      setError(null)
      await apiClient.delete(`/api/specialized/housing/programs/${id}`)
      setHousingPrograms(prev => prev.filter(program => program.id !== id))
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao excluir programa'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const getProgramsByType = useCallback((type: string) => housingPrograms.filter(program => program.type === type), [housingPrograms])
  const getProgramsByStatus = useCallback((status: string) => housingPrograms.filter(program => program.status === status), [housingPrograms])
  const getActivePrograms = useCallback(() => housingPrograms.filter(program => ['APPROVED', 'IMPLEMENTATION', 'OPERATIONAL'].includes(program.status)), [housingPrograms])

  const refreshPrograms = useCallback(async () => {
    await fetchPrograms()
  }, [fetchPrograms])

  useEffect(() => {
    fetchPrograms()
  }, [fetchPrograms])

  return {
    housingPrograms,
    loading,
    error,
    createProgram,
    updateProgram,
    addBenefit,
    updateRequirements,
    addPhase,
    updatePhaseStatus,
    updateBudget,
    addFunding,
    assignResponsible,
    addPartner,
    addContractor,
    updateUnits,
    addLocation,
    updateApplications,
    addIndicator,
    updateIndicator,
    addReport,
    updateCompliance,
    addRisk,
    updateRisk,
    updateImpact,
    approveProgram,
    startImplementation,
    completeProgram,
    suspendProgram,
    deleteProgram,
    getProgramsByType,
    getProgramsByStatus,
    getActivePrograms,
    refreshPrograms
  }
}