import { useState, useEffect, useCallback } from 'react'
import { apiClient } from '@/lib/api-client'

export interface PublicWorksProject {
  id: string
  name: string
  code: string
  type: 'CONSTRUCTION' | 'RENOVATION' | 'MAINTENANCE' | 'INFRASTRUCTURE' | 'ROAD_WORKS' | 'DRAINAGE' | 'LIGHTING' | 'LANDSCAPING'
  status: 'PLANNING' | 'APPROVED' | 'BIDDING' | 'CONTRACTED' | 'IN_PROGRESS' | 'SUSPENDED' | 'COMPLETED' | 'CANCELLED'
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  description: string
  objectives: string[]
  location: {
    address: string
    coordinates?: {
      lat: number
      lng: number
    }
    district: string
    neighborhood: string
    cep: string
  }
  budget: {
    estimated: number
    approved: number
    contracted?: number
    spent: number
    remaining: number
    currency: string
  }
  timeline: {
    plannedStart: string
    plannedEnd: string
    actualStart?: string
    actualEnd?: string
    duration: number
    milestones: Array<{
      id: string
      name: string
      description: string
      plannedDate: string
      actualDate?: string
      status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'DELAYED'
      percentage: number
    }>
  }
  scope: {
    workItems: Array<{
      id: string
      name: string
      description: string
      unit: string
      quantity: number
      unitPrice: number
      totalPrice: number
      status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED'
    }>
    specifications: string[]
    deliverables: string[]
  }
  team: {
    manager: {
      id: string
      name: string
      role: string
      email: string
      phone: string
    }
    supervisor?: {
      id: string
      name: string
      role: string
      email: string
      phone: string
    }
    engineer?: {
      id: string
      name: string
      role: string
      email: string
      phone: string
    }
  }
  contractor?: {
    id: string
    name: string
    cnpj: string
    contact: {
      name: string
      email: string
      phone: string
    }
    address: string
  }
  permits: Array<{
    id: string
    type: string
    number: string
    issuingBody: string
    issueDate: string
    expiryDate: string
    status: 'PENDING' | 'APPROVED' | 'EXPIRED' | 'DENIED'
  }>
  progress: {
    overall: number
    phases: Array<{
      id: string
      name: string
      plannedStart: string
      plannedEnd: string
      actualStart?: string
      actualEnd?: string
      progress: number
      status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'DELAYED'
    }>
  }
  risks: Array<{
    id: string
    description: string
    category: 'TECHNICAL' | 'FINANCIAL' | 'ENVIRONMENTAL' | 'LEGAL' | 'SAFETY' | 'SCHEDULE'
    probability: 'LOW' | 'MEDIUM' | 'HIGH'
    impact: 'LOW' | 'MEDIUM' | 'HIGH'
    mitigation: string
    status: 'IDENTIFIED' | 'MITIGATED' | 'RESOLVED' | 'MATERIALIZED'
  }>
  documents: Array<{
    id: string
    name: string
    type: string
    url: string
    uploadDate: string
    size: number
  }>
  createdAt: string
  updatedAt: string
  createdBy: string
  lastModifiedBy: string
}

export interface CreatePublicWorksProjectData {
  name: string
  code: string
  type: 'CONSTRUCTION' | 'RENOVATION' | 'MAINTENANCE' | 'INFRASTRUCTURE' | 'ROAD_WORKS' | 'DRAINAGE' | 'LIGHTING' | 'LANDSCAPING'
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  description: string
  objectives: string[]
  location: {
    address: string
    coordinates?: {
      lat: number
      lng: number
    }
    district: string
    neighborhood: string
    cep: string
  }
  budget: {
    estimated: number
  }
  timeline: {
    plannedStart: string
    plannedEnd: string
    milestones?: Array<{
      name: string
      description: string
      plannedDate: string
    }>
  }
  scope: {
    workItems: Array<{
      name: string
      description: string
      unit: string
      quantity: number
      unitPrice: number
    }>
    specifications: string[]
    deliverables: string[]
  }
  teamManagerId: string
}

export interface PublicWorksProjectFilters {
  type?: string
  status?: string
  priority?: string
  district?: string
  managerId?: string
  contractorId?: string
  budgetMin?: number
  budgetMax?: number
  startDate?: string
  endDate?: string
}

export function usePublicWorksProjects() {
  const [projects, setProjects] = useState<PublicWorksProject[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchProjects = useCallback(async (filters?: PublicWorksProjectFilters) => {
    setIsLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams()
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            params.append(key, value.toString())
          }
        })
      }
      const response = await apiClient.get(`/public-works/projects?${params}`)
      setProjects(response.data.data || [])
    } catch (err) {
      setError('Erro ao carregar projetos de obras públicas')
      console.error('Error fetching public works projects:', err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const createProject = useCallback(async (data: CreatePublicWorksProjectData) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await apiClient.post('/public-works/projects', data)
      const newProject = response.data.data
      setProjects(prev => [newProject, ...prev])
      return newProject
    } catch (err) {
      setError('Erro ao criar projeto de obra pública')
      console.error('Error creating public works project:', err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const updateProject = useCallback(async (id: string, data: Partial<CreatePublicWorksProjectData>) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await apiClient.put(`/public-works/projects/${id}`, data)
      const updatedProject = response.data.data
      setProjects(prev => prev.map(project => project.id === id ? updatedProject : project))
      return updatedProject
    } catch (err) {
      setError('Erro ao atualizar projeto de obra pública')
      console.error('Error updating public works project:', err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const deleteProject = useCallback(async (id: string) => {
    setIsLoading(true)
    setError(null)
    try {
      await apiClient.delete(`/public-works/projects/${id}`)
      setProjects(prev => prev.filter(project => project.id !== id))
    } catch (err) {
      setError('Erro ao excluir projeto de obra pública')
      console.error('Error deleting public works project:', err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const approveProject = useCallback(async (id: string, approvalData: { notes?: string; approvedBudget: number }) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await apiClient.post(`/public-works/projects/${id}/approve`, approvalData)
      const updatedProject = response.data.data
      setProjects(prev => prev.map(project => project.id === id ? updatedProject : project))
      return updatedProject
    } catch (err) {
      setError('Erro ao aprovar projeto de obra pública')
      console.error('Error approving public works project:', err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const updateProgress = useCallback(async (id: string, progressData: {
    overallProgress: number
    phaseUpdates?: Array<{
      phaseId: string
      progress: number
      status?: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'DELAYED'
      actualStart?: string
      actualEnd?: string
    }>
    notes?: string
  }) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await apiClient.post(`/public-works/projects/${id}/progress`, progressData)
      const updatedProject = response.data.data
      setProjects(prev => prev.map(project => project.id === id ? updatedProject : project))
      return updatedProject
    } catch (err) {
      setError('Erro ao atualizar progresso do projeto')
      console.error('Error updating project progress:', err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const addRisk = useCallback(async (id: string, riskData: {
    description: string
    category: 'TECHNICAL' | 'FINANCIAL' | 'ENVIRONMENTAL' | 'LEGAL' | 'SAFETY' | 'SCHEDULE'
    probability: 'LOW' | 'MEDIUM' | 'HIGH'
    impact: 'LOW' | 'MEDIUM' | 'HIGH'
    mitigation: string
  }) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await apiClient.post(`/public-works/projects/${id}/risks`, riskData)
      const updatedProject = response.data.data
      setProjects(prev => prev.map(project => project.id === id ? updatedProject : project))
      return updatedProject
    } catch (err) {
      setError('Erro ao adicionar risco ao projeto')
      console.error('Error adding risk to project:', err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const uploadDocument = useCallback(async (id: string, file: File) => {
    setIsLoading(true)
    setError(null)
    try {
      const formData = new FormData()
      formData.append('document', file)
      const response = await apiClient.post(`/public-works/projects/${id}/documents`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      const updatedProject = response.data.data
      setProjects(prev => prev.map(project => project.id === id ? updatedProject : project))
      return updatedProject
    } catch (err) {
      setError('Erro ao enviar documento')
      console.error('Error uploading document:', err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const getProjectById = useCallback((id: string) => {
    return projects.find(project => project.id === id)
  }, [projects])

  const getProjectsByStatus = useCallback((status: string) => {
    return projects.filter(project => project.status === status)
  }, [projects])

  const getProjectsByType = useCallback((type: string) => {
    return projects.filter(project => project.type === type)
  }, [projects])

  const getProjectsByPriority = useCallback((priority: string) => {
    return projects.filter(project => project.priority === priority)
  }, [projects])

  const getActiveProjects = useCallback(() => {
    return projects.filter(project =>
      ['APPROVED', 'BIDDING', 'CONTRACTED', 'IN_PROGRESS'].includes(project.status)
    )
  }, [projects])

  const getOverdueProjects = useCallback(() => {
    const today = new Date().toISOString().split('T')[0]
    return projects.filter(project =>
      project.timeline.plannedEnd < today &&
      !['COMPLETED', 'CANCELLED'].includes(project.status)
    )
  }, [projects])

  const getTotalBudget = useCallback((status?: string) => {
    const filteredProjects = status
      ? projects.filter(project => project.status === status)
      : projects
    return filteredProjects.reduce((total, project) => total + project.budget.approved, 0)
  }, [projects])

  useEffect(() => {
    fetchProjects()
  }, [fetchProjects])

  return {
    projects,
    isLoading,
    error,
    fetchProjects,
    createProject,
    updateProject,
    deleteProject,
    approveProject,
    updateProgress,
    addRisk,
    uploadDocument,
    getProjectById,
    getProjectsByStatus,
    getProjectsByType,
    getProjectsByPriority,
    getActiveProjects,
    getOverdueProjects,
    getTotalBudget
  }
}