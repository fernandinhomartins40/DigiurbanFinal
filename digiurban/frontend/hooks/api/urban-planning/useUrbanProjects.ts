'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAdminAuth } from '@/contexts/AdminAuthContext'

export interface UrbanProject {
  id: string
  name: string
  code: string
  type: 'INFRASTRUCTURE' | 'HOUSING' | 'TRANSPORTATION' | 'ENVIRONMENTAL' | 'REVITALIZATION' | 'DEVELOPMENT' | 'SOCIAL'
  category: 'LARGE_SCALE' | 'MEDIUM_SCALE' | 'SMALL_SCALE' | 'STRATEGIC' | 'EMERGENCY'
  description: string
  objectives: string[]
  scope: {
    area: {
      name: string
      coordinates: { lat: number; lng: number }[]
      totalArea: number
      districts: string[]
      neighborhoods: string[]
    }
    beneficiaries: {
      direct: number
      indirect: number
      demographics: {
        ageGroup: string
        percentage: number
      }[]
    }
    infrastructure: {
      roads: { length: number; type: string }[]
      utilities: { type: string; coverage: number }[]
      facilities: { type: string; quantity: number }[]
    }
  }
  timeline: {
    phases: {
      id: string
      name: string
      description: string
      startDate: string
      endDate: string
      duration: number
      dependencies: string[]
      status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'DELAYED' | 'SUSPENDED'
      progress: number
      milestones: {
        name: string
        date: string
        status: 'PENDING' | 'COMPLETED' | 'DELAYED'
      }[]
    }[]
    startDate: string
    expectedEndDate: string
    actualEndDate?: string
    totalDuration: number
    criticalPath: string[]
  }
  budget: {
    total: number
    allocated: number
    committed: number
    spent: number
    remaining: number
    categories: {
      category: string
      budgeted: number
      spent: number
      percentage: number
    }[]
    funding: {
      source: string
      amount: number
      type: 'FEDERAL' | 'STATE' | 'MUNICIPAL' | 'PRIVATE' | 'INTERNATIONAL'
      status: 'CONFIRMED' | 'PENDING' | 'REJECTED'
    }[]
  }
  stakeholders: {
    government: {
      entity: string
      role: string
      contact: string
    }[]
    community: {
      organization: string
      representative: string
      contact: string
      interests: string[]
    }[]
    private: {
      company: string
      role: string
      contact: string
    }[]
    technical: {
      consultant: string
      expertise: string
      contact: string
    }[]
  }
  team: {
    manager: {
      name: string
      role: string
      phone: string
      email: string
    }
    coordinator: {
      name: string
      role: string
      phone: string
      email: string
    }
    members: {
      name: string
      role: string
      department: string
      allocation: number
    }[]
    contractors: {
      company: string
      service: string
      value: number
      status: 'BIDDING' | 'CONTRACTED' | 'ACTIVE' | 'COMPLETED'
    }[]
  }
  environmental: {
    impact: {
      assessment: 'NOT_REQUIRED' | 'REQUIRED' | 'COMPLETED'
      license: string
      conditions: string[]
      monitoring: string[]
    }
    sustainability: {
      measures: string[]
      certifications: string[]
      greenTechnologies: string[]
    }
    mitigation: {
      actions: string[]
      cost: number
      timeline: string
    }[]
  }
  social: {
    participation: {
      consultations: {
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
      committees: {
        name: string
        members: number
        frequency: string
      }[]
    }
    impact: {
      positive: string[]
      negative: string[]
      mitigation: string[]
    }
    relocation: {
      families: number
      businesses: number
      compensation: number
      timeline: string
    }
  }
  legal: {
    permits: {
      type: string
      number: string
      issueDate: string
      expiryDate?: string
      status: 'VALID' | 'EXPIRED' | 'PENDING'
    }[]
    contracts: {
      type: string
      party: string
      value: number
      startDate: string
      endDate: string
      status: 'ACTIVE' | 'COMPLETED' | 'TERMINATED'
    }[]
    compliance: {
      laws: string[]
      regulations: string[]
      violations: string[]
    }
  }
  risks: {
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
    social: {
      risk: string
      probability: 'LOW' | 'MEDIUM' | 'HIGH'
      impact: 'LOW' | 'MEDIUM' | 'HIGH'
      mitigation: string
    }[]
  }
  monitoring: {
    kpis: {
      indicator: string
      target: number
      current: number
      unit: string
      frequency: string
    }[]
    reports: {
      id: string
      type: 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'SPECIAL'
      date: string
      author: string
      summary: string
      url: string
    }[]
    inspections: {
      date: string
      inspector: string
      type: string
      findings: string[]
      recommendations: string[]
    }[]
  }
  status: 'PLANNING' | 'APPROVED' | 'TENDERING' | 'EXECUTION' | 'MONITORING' | 'COMPLETED' | 'SUSPENDED' | 'CANCELLED'
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  visibility: 'INTERNAL' | 'PUBLIC' | 'RESTRICTED'
  documents: {
    type: string
    name: string
    version: string
    url: string
    date: string
  }[]
  communications: {
    type: 'MEETING' | 'EMAIL' | 'REPORT' | 'PRESENTATION'
    date: string
    participants: string[]
    summary: string
    decisions: string[]
  }[]
  createdBy: string
  createdAt: string
  updatedAt: string
}

export interface CreateUrbanProjectData {
  name: string
  type: 'INFRASTRUCTURE' | 'HOUSING' | 'TRANSPORTATION' | 'ENVIRONMENTAL' | 'REVITALIZATION' | 'DEVELOPMENT' | 'SOCIAL'
  category: 'LARGE_SCALE' | 'MEDIUM_SCALE' | 'SMALL_SCALE' | 'STRATEGIC' | 'EMERGENCY'
  description: string
  objectives: string[]
  scope: {
    area: {
      name: string
      coordinates: { lat: number; lng: number }[]
      totalArea: number
      districts: string[]
    }
    beneficiaries: {
      direct: number
      indirect: number
    }
  }
  budget: {
    total: number
  }
  timeline: {
    startDate: string
    expectedEndDate: string
  }
}

export interface UseUrbanProjectsReturn {
  projects: UrbanProject[]
  loading: boolean
  error: string | null
  createProject: (data: CreateUrbanProjectData) => Promise<UrbanProject>
  updateProject: (id: string, data: Partial<CreateUrbanProjectData>) => Promise<UrbanProject>
  addPhase: (id: string, phase: any) => Promise<UrbanProject>
  updatePhaseStatus: (id: string, phaseId: string, status: string, progress: number) => Promise<UrbanProject>
  addMilestone: (id: string, phaseId: string, milestone: any) => Promise<UrbanProject>
  updateBudget: (id: string, budget: any) => Promise<UrbanProject>
  addFunding: (id: string, funding: any) => Promise<UrbanProject>
  addStakeholder: (id: string, stakeholder: any) => Promise<UrbanProject>
  assignTeamMember: (id: string, member: any) => Promise<UrbanProject>
  addContractor: (id: string, contractor: any) => Promise<UrbanProject>
  updateContractorStatus: (id: string, contractorId: string, status: string) => Promise<UrbanProject>
  addRisk: (id: string, category: string, risk: any) => Promise<UrbanProject>
  updateRisk: (id: string, riskId: string, data: any) => Promise<UrbanProject>
  addKPI: (id: string, kpi: any) => Promise<UrbanProject>
  updateKPI: (id: string, kpiId: string, current: number) => Promise<UrbanProject>
  addReport: (id: string, report: any) => Promise<UrbanProject>
  addInspection: (id: string, inspection: any) => Promise<UrbanProject>
  addCommunication: (id: string, communication: any) => Promise<UrbanProject>
  approveProject: (id: string) => Promise<UrbanProject>
  suspendProject: (id: string, reason: string) => Promise<UrbanProject>
  completeProject: (id: string) => Promise<UrbanProject>
  deleteProject: (id: string) => Promise<void>
  getProjectsByType: (type: string) => UrbanProject[]
  getProjectsByStatus: (status: string) => UrbanProject[]
  getActiveProjects: () => UrbanProject[]
  getDelayedProjects: () => UrbanProject[]
  refreshProjects: () => Promise<void>
}

export function useUrbanProjects(): UseUrbanProjectsReturn {
  const [projects, setProjects] = useState<UrbanProject[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await apiClient.get('/api/specialized/urban-planning/projects')
      setProjects(data.projects || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar projetos urbanos')
    } finally {
      setLoading(false)
    }
  }, [])

  const createProject = useCallback(async (data: CreateUrbanProjectData): Promise<UrbanProject> => {
    try {
      setError(null)
      const response = await apiClient.post('/api/specialized/urban-planning/projects', data)
      const newProject = response.project
      setProjects(prev => [newProject, ...prev])
      return newProject
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar projeto'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const updateProject = useCallback(async (id: string, data: Partial<CreateUrbanProjectData>): Promise<UrbanProject> => {
    try {
      setError(null)
      const response = await apiClient.put(`/api/specialized/urban-planning/projects/${id}`, data)
      const updatedProject = response.project
      setProjects(prev => prev.map(project => project.id === id ? updatedProject : project))
      return updatedProject
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar projeto'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const addPhase = useCallback(async (id: string, phase: any): Promise<UrbanProject> => {
    try {
      setError(null)
      const response = await apiClient.post(`/api/specialized/urban-planning/projects/${id}/phases`, phase)
      const updatedProject = response.project
      setProjects(prev => prev.map(project => project.id === id ? updatedProject : project))
      return updatedProject
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao adicionar fase'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const updatePhaseStatus = useCallback(async (id: string, phaseId: string, status: string, progress: number): Promise<UrbanProject> => {
    try {
      setError(null)
      const response = await apiClient.put(`/api/specialized/urban-planning/projects/${id}/phases/${phaseId}`, { status, progress })
      const updatedProject = response.project
      setProjects(prev => prev.map(project => project.id === id ? updatedProject : project))
      return updatedProject
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar status da fase'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const addMilestone = useCallback(async (id: string, phaseId: string, milestone: any): Promise<UrbanProject> => {
    try {
      setError(null)
      const response = await apiClient.post(`/api/specialized/urban-planning/projects/${id}/phases/${phaseId}/milestones`, milestone)
      const updatedProject = response.project
      setProjects(prev => prev.map(project => project.id === id ? updatedProject : project))
      return updatedProject
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao adicionar marco'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const updateBudget = useCallback(async (id: string, budget: any): Promise<UrbanProject> => {
    try {
      setError(null)
      const response = await apiClient.put(`/api/specialized/urban-planning/projects/${id}/budget`, budget)
      const updatedProject = response.project
      setProjects(prev => prev.map(project => project.id === id ? updatedProject : project))
      return updatedProject
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar orçamento'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const addFunding = useCallback(async (id: string, funding: any): Promise<UrbanProject> => {
    try {
      setError(null)
      const response = await apiClient.post(`/api/specialized/urban-planning/projects/${id}/funding`, funding)
      const updatedProject = response.project
      setProjects(prev => prev.map(project => project.id === id ? updatedProject : project))
      return updatedProject
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao adicionar financiamento'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const addStakeholder = useCallback(async (id: string, stakeholder: any): Promise<UrbanProject> => {
    try {
      setError(null)
      const response = await apiClient.post(`/api/specialized/urban-planning/projects/${id}/stakeholders`, stakeholder)
      const updatedProject = response.project
      setProjects(prev => prev.map(project => project.id === id ? updatedProject : project))
      return updatedProject
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao adicionar stakeholder'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const assignTeamMember = useCallback(async (id: string, member: any): Promise<UrbanProject> => {
    try {
      setError(null)
      const response = await apiClient.post(`/api/specialized/urban-planning/projects/${id}/team`, member)
      const updatedProject = response.project
      setProjects(prev => prev.map(project => project.id === id ? updatedProject : project))
      return updatedProject
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atribuir membro da equipe'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const addContractor = useCallback(async (id: string, contractor: any): Promise<UrbanProject> => {
    try {
      setError(null)
      const response = await apiClient.post(`/api/specialized/urban-planning/projects/${id}/contractors`, contractor)
      const updatedProject = response.project
      setProjects(prev => prev.map(project => project.id === id ? updatedProject : project))
      return updatedProject
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao adicionar contratada'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const updateContractorStatus = useCallback(async (id: string, contractorId: string, status: string): Promise<UrbanProject> => {
    try {
      setError(null)
      const response = await apiClient.put(`/api/specialized/urban-planning/projects/${id}/contractors/${contractorId}`, { status })
      const updatedProject = response.project
      setProjects(prev => prev.map(project => project.id === id ? updatedProject : project))
      return updatedProject
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar status da contratada'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const addRisk = useCallback(async (id: string, category: string, risk: any): Promise<UrbanProject> => {
    try {
      setError(null)
      const response = await apiClient.post(`/api/specialized/urban-planning/projects/${id}/risks/${category}`, risk)
      const updatedProject = response.project
      setProjects(prev => prev.map(project => project.id === id ? updatedProject : project))
      return updatedProject
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao adicionar risco'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const updateRisk = useCallback(async (id: string, riskId: string, data: any): Promise<UrbanProject> => {
    try {
      setError(null)
      const response = await apiClient.put(`/api/specialized/urban-planning/projects/${id}/risks/${riskId}`, data)
      const updatedProject = response.project
      setProjects(prev => prev.map(project => project.id === id ? updatedProject : project))
      return updatedProject
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar risco'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const addKPI = useCallback(async (id: string, kpi: any): Promise<UrbanProject> => {
    try {
      setError(null)
      const response = await apiClient.post(`/api/specialized/urban-planning/projects/${id}/kpis`, kpi)
      const updatedProject = response.project
      setProjects(prev => prev.map(project => project.id === id ? updatedProject : project))
      return updatedProject
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao adicionar KPI'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const updateKPI = useCallback(async (id: string, kpiId: string, current: number): Promise<UrbanProject> => {
    try {
      setError(null)
      const response = await apiClient.put(`/api/specialized/urban-planning/projects/${id}/kpis/${kpiId}`, { current })
      const updatedProject = response.project
      setProjects(prev => prev.map(project => project.id === id ? updatedProject : project))
      return updatedProject
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar KPI'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const addReport = useCallback(async (id: string, report: any): Promise<UrbanProject> => {
    try {
      setError(null)
      const response = await apiClient.post(`/api/specialized/urban-planning/projects/${id}/reports`, report)
      const updatedProject = response.project
      setProjects(prev => prev.map(project => project.id === id ? updatedProject : project))
      return updatedProject
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao adicionar relatório'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const addInspection = useCallback(async (id: string, inspection: any): Promise<UrbanProject> => {
    try {
      setError(null)
      const response = await apiClient.post(`/api/specialized/urban-planning/projects/${id}/inspections`, inspection)
      const updatedProject = response.project
      setProjects(prev => prev.map(project => project.id === id ? updatedProject : project))
      return updatedProject
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao adicionar inspeção'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const addCommunication = useCallback(async (id: string, communication: any): Promise<UrbanProject> => {
    try {
      setError(null)
      const response = await apiClient.post(`/api/specialized/urban-planning/projects/${id}/communications`, communication)
      const updatedProject = response.project
      setProjects(prev => prev.map(project => project.id === id ? updatedProject : project))
      return updatedProject
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao adicionar comunicação'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const approveProject = useCallback(async (id: string): Promise<UrbanProject> => {
    return updateProject(id, { status: 'APPROVED' } as any)
  }, [updateProject])

  const suspendProject = useCallback(async (id: string, reason: string): Promise<UrbanProject> => {
    return updateProject(id, { status: 'SUSPENDED' } as any)
  }, [updateProject])

  const completeProject = useCallback(async (id: string): Promise<UrbanProject> => {
    return updateProject(id, { status: 'COMPLETED' } as any)
  }, [updateProject])

  const deleteProject = useCallback(async (id: string): Promise<void> => {
    try {
      setError(null)
      await apiClient.delete(`/api/specialized/urban-planning/projects/${id}`)
      setProjects(prev => prev.filter(project => project.id !== id))
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao excluir projeto'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const getProjectsByType = useCallback((type: string) => projects.filter(project => project.type === type), [projects])
  const getProjectsByStatus = useCallback((status: string) => projects.filter(project => project.status === status), [projects])
  const getActiveProjects = useCallback(() => projects.filter(project => ['APPROVED', 'TENDERING', 'EXECUTION', 'MONITORING'].includes(project.status)), [projects])
  const getDelayedProjects = useCallback(() => {
    const today = new Date()
    return projects.filter(project => {
      const expectedEnd = new Date(project.timeline.expectedEndDate)
      return expectedEnd < today && project.status !== 'COMPLETED'
    })
  }, [projects])

  const refreshProjects = useCallback(async () => {
    await fetchProjects()
  }, [fetchProjects])

  useEffect(() => {
    fetchProjects()
  }, [fetchProjects])

  return {
    projects,
    loading,
    error,
    createProject,
    updateProject,
    addPhase,
    updatePhaseStatus,
    addMilestone,
    updateBudget,
    addFunding,
    addStakeholder,
    assignTeamMember,
    addContractor,
    updateContractorStatus,
    addRisk,
    updateRisk,
    addKPI,
    updateKPI,
    addReport,
    addInspection,
    addCommunication,
    approveProject,
    suspendProject,
    completeProject,
    deleteProject,
    getProjectsByType,
    getProjectsByStatus,
    getActiveProjects,
    getDelayedProjects,
    refreshProjects
  }
}