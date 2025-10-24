import { useState, useEffect, useCallback } from 'react'
import { apiClient } from '@/lib/api-client'

export interface CulturalProject {
  id: string
  name: string
  code: string
  type: 'FESTIVAL' | 'WORKSHOP_SERIES' | 'EXHIBITION' | 'CONTEST' | 'RESIDENCY' | 'EDUCATION' | 'PRESERVATION' | 'RESEARCH' | 'COMMUNITY' | 'OTHER'
  category: 'MUSIC' | 'THEATER' | 'DANCE' | 'VISUAL_ARTS' | 'LITERATURE' | 'CINEMA' | 'CRAFTS' | 'DIGITAL_ARTS' | 'MULTIDISCIPLINARY' | 'HERITAGE'
  status: 'PLANNING' | 'APPROVED' | 'FUNDRAISING' | 'PREPARATION' | 'EXECUTION' | 'COMPLETED' | 'CANCELLED' | 'SUSPENDED'
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  description: string
  objectives: string[]
  justification: string
  expectedResults: string[]
  timeline: {
    startDate: string
    endDate: string
    duration: number
    phases: Array<{
      id: string
      name: string
      description: string
      startDate: string
      endDate: string
      status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'DELAYED'
      deliverables: string[]
      milestones: Array<{
        id: string
        description: string
        date: string
        completed: boolean
        notes?: string
      }>
    }>
  }
  scope: {
    targetAudience: {
      primary: string[]
      secondary: string[]
      estimatedReach: number
      demographics: {
        ageGroups: string[]
        socialClasses: string[]
        locations: string[]
        specificGroups: string[]
      }
    }
    geographic: {
      coverage: 'LOCAL' | 'MUNICIPAL' | 'REGIONAL' | 'STATE' | 'NATIONAL' | 'INTERNATIONAL'
      locations: Array<{
        name: string
        type: 'NEIGHBORHOOD' | 'DISTRICT' | 'CITY' | 'REGION'
        importance: 'PRIMARY' | 'SECONDARY'
      }>
    }
    activities: Array<{
      id: string
      name: string
      type: 'PERFORMANCE' | 'WORKSHOP' | 'EXHIBITION' | 'CONTEST' | 'MEETING' | 'TRAINING' | 'OTHER'
      description: string
      duration: number
      capacity: number
      cost: number
    }>
  }
  team: {
    coordinator: {
      id: string
      name: string
      role: string
      qualifications: string[]
      email: string
      phone: string
    }
    members: Array<{
      id: string
      name: string
      role: string
      responsibility: string
      workload: number
      compensation: number
      startDate: string
      endDate?: string
    }>
    consultants: Array<{
      id: string
      name: string
      expertise: string
      role: string
      fee: number
      contract: string
    }>
    volunteers: Array<{
      id: string
      name: string
      skills: string[]
      availability: string
      tasks: string[]
      contact: string
    }>
  }
  budget: {
    total: number
    currency: string
    breakdown: {
      personnel: number
      materials: number
      equipment: number
      transportation: number
      accommodation: number
      marketing: number
      venue: number
      insurance: number
      contingency: number
      administration: number
    }
    funding: Array<{
      source: 'MUNICIPAL' | 'STATE' | 'FEDERAL' | 'PRIVATE' | 'SPONSORSHIP' | 'CROWDFUNDING' | 'INTERNATIONAL'
      type: 'GRANT' | 'LOAN' | 'DONATION' | 'INVESTMENT' | 'PARTNERSHIP'
      amount: number
      confirmed: boolean
      conditions: string[]
      contact: string
      applicationDate?: string
      responseDate?: string
    }>
    expenses: Array<{
      id: string
      category: string
      description: string
      plannedAmount: number
      actualAmount?: number
      date: string
      supplier: string
      status: 'PLANNED' | 'COMMITTED' | 'PAID' | 'OVERDUE'
      invoice?: string
    }>
  }
  partnerships: Array<{
    id: string
    partner: {
      name: string
      type: 'GOVERNMENT' | 'PRIVATE' | 'NGO' | 'EDUCATIONAL' | 'CULTURAL' | 'MEDIA'
      contact: string
    }
    type: 'FINANCIAL' | 'TECHNICAL' | 'LOGISTICAL' | 'PROMOTIONAL' | 'CONTENT'
    contribution: string
    responsibilities: string[]
    benefits: string[]
    status: 'NEGOTIATING' | 'CONFIRMED' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED'
    contract?: string
  }>
  participants: {
    artists: Array<{
      id: string
      name: string
      type: 'INDIVIDUAL' | 'GROUP' | 'COMPANY'
      discipline: string
      role: string
      fee: number
      requirements: string[]
      contract: string
      status: 'INVITED' | 'CONFIRMED' | 'CANCELLED'
    }>
    beneficiaries: Array<{
      id: string
      name: string
      type: 'INDIVIDUAL' | 'GROUP' | 'INSTITUTION'
      profile: string
      participation: string
      benefits: string[]
      feedback?: string
    }>
    audience: {
      registered: number
      attended: number
      demographics: {
        ageGroups: { [key: string]: number }
        origin: { [key: string]: number }
        education: { [key: string]: number }
      }
      satisfaction: {
        overall: number
        content: number
        organization: number
        accessibility: number
      }
    }
  }
  communication: {
    strategy: string
    channels: Array<{
      type: 'WEBSITE' | 'SOCIAL_MEDIA' | 'PRESS' | 'RADIO' | 'TV' | 'PRINT' | 'OUTDOOR'
      platform?: string
      reach: number
      cost: number
      responsible: string
    }>
    materials: Array<{
      type: 'LOGO' | 'POSTER' | 'FLYER' | 'BANNER' | 'VIDEO' | 'AUDIO' | 'PRESS_KIT'
      description: string
      status: 'PLANNED' | 'DESIGNING' | 'APPROVED' | 'PRODUCED' | 'DISTRIBUTED'
      supplier?: string
      cost: number
      url?: string
    }>
    website?: {
      url: string
      visits: number
      engagement: number
      lastUpdate: string
    }
    socialMedia: {
      facebook?: { followers: number; engagement: number }
      instagram?: { followers: number; engagement: number }
      youtube?: { subscribers: number; views: number }
      twitter?: { followers: number; engagement: number }
    }
  }
  logistics: {
    venues: Array<{
      spaceId: string
      name: string
      dates: string[]
      setup: string
      cost: number
      requirements: string[]
    }>
    equipment: Array<{
      item: string
      quantity: number
      source: 'RENTAL' | 'PURCHASE' | 'BORROWED' | 'SPONSORED'
      cost: number
      supplier: string
      dates: string[]
    }>
    transportation: Array<{
      type: 'PEOPLE' | 'EQUIPMENT' | 'MATERIALS'
      description: string
      cost: number
      supplier: string
      routes: string[]
    }>
    accommodation: Array<{
      type: 'HOTEL' | 'RESIDENCE' | 'OTHER'
      guests: string[]
      dates: string[]
      cost: number
      supplier: string
    }>
    catering: Array<{
      event: string
      participants: number
      type: 'BREAKFAST' | 'LUNCH' | 'DINNER' | 'SNACK' | 'COCKTAIL'
      cost: number
      supplier: string
    }>
  }
  documentation: {
    legal: Array<{
      type: 'CONTRACT' | 'PERMIT' | 'LICENSE' | 'INSURANCE' | 'COPYRIGHT'
      description: string
      status: 'PENDING' | 'APPROVED' | 'EXPIRED'
      expiryDate?: string
      url?: string
    }>
    technical: Array<{
      type: 'PROJECT_PLAN' | 'BUDGET' | 'SCHEDULE' | 'REQUIREMENTS' | 'SPECIFICATIONS'
      version: string
      date: string
      author: string
      url: string
    }>
    media: Array<{
      type: 'PHOTO' | 'VIDEO' | 'AUDIO' | 'ARTICLE' | 'REVIEW'
      description: string
      date: string
      author: string
      url: string
      rights: string
    }>
    reports: Array<{
      type: 'PROGRESS' | 'FINANCIAL' | 'IMPACT' | 'FINAL'
      period: string
      author: string
      date: string
      url: string
      status: 'DRAFT' | 'FINAL' | 'APPROVED'
    }>
  }
  monitoring: {
    indicators: Array<{
      name: string
      description: string
      target: number
      achieved: number
      unit: string
      frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY'
      lastUpdate: string
    }>
    risks: Array<{
      id: string
      description: string
      category: 'FINANCIAL' | 'TECHNICAL' | 'LOGISTICAL' | 'LEGAL' | 'EXTERNAL'
      probability: 'LOW' | 'MEDIUM' | 'HIGH'
      impact: 'LOW' | 'MEDIUM' | 'HIGH'
      mitigation: string
      status: 'IDENTIFIED' | 'MITIGATED' | 'RESOLVED' | 'MATERIALIZED'
    }>
    issues: Array<{
      id: string
      description: string
      priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
      status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED'
      assignedTo: string
      dueDate: string
      resolution?: string
    }>
    meetings: Array<{
      id: string
      date: string
      type: 'PLANNING' | 'PROGRESS' | 'REVIEW' | 'EMERGENCY'
      participants: string[]
      agenda: string[]
      decisions: string[]
      actions: Array<{
        description: string
        responsible: string
        deadline: string
        status: 'PENDING' | 'COMPLETED'
      }>
    }>
  }
  evaluation: {
    criteria: Array<{
      name: string
      description: string
      weight: number
      target: number
      achieved?: number
    }>
    methods: string[]
    results: {
      quantitative: { [key: string]: number }
      qualitative: { [key: string]: string }
    }
    impact: {
      cultural: string
      social: string
      economic: string
      educational?: string
      environmental?: string
    }
    sustainability: {
      continuation: boolean
      replication: boolean
      adaptation: boolean
      recommendations: string[]
    }
    stakeholderFeedback: Array<{
      stakeholder: string
      feedback: string
      rating: number
      date: string
    }>
  }
  createdAt: string
  updatedAt: string
  createdBy: string
  lastModifiedBy: string
}

export interface CreateCulturalProjectData {
  name: string
  code: string
  type: 'FESTIVAL' | 'WORKSHOP_SERIES' | 'EXHIBITION' | 'CONTEST' | 'RESIDENCY' | 'EDUCATION' | 'PRESERVATION' | 'RESEARCH' | 'COMMUNITY' | 'OTHER'
  category: 'MUSIC' | 'THEATER' | 'DANCE' | 'VISUAL_ARTS' | 'LITERATURE' | 'CINEMA' | 'CRAFTS' | 'DIGITAL_ARTS' | 'MULTIDISCIPLINARY' | 'HERITAGE'
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  description: string
  objectives: string[]
  justification: string
  expectedResults: string[]
  timeline: {
    startDate: string
    endDate: string
    phases: Array<{
      name: string
      description: string
      startDate: string
      endDate: string
      deliverables: string[]
    }>
  }
  coordinatorId: string
  budget: {
    total: number
    breakdown: {
      personnel: number
      materials: number
      equipment: number
      transportation: number
      accommodation: number
      marketing: number
      venue: number
      insurance: number
      contingency: number
      administration: number
    }
  }
  targetAudience: {
    primary: string[]
    secondary: string[]
    estimatedReach: number
  }
}

export interface CulturalProjectFilters {
  type?: string
  category?: string
  status?: string
  priority?: string
  coordinatorId?: string
  dateFrom?: string
  dateTo?: string
  budgetMin?: number
  budgetMax?: number
  coverage?: string
}

export function useCulturalProjects() {
  const [projects, setProjects] = useState<CulturalProject[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchProjects = useCallback(async (filters?: CulturalProjectFilters) => {
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
      const response = await apiClient.get(`/culture/projects?${params}`)
      setProjects(response.data.data || [])
    } catch (err) {
      setError('Erro ao carregar projetos culturais')
      console.error('Error fetching cultural projects:', err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const createProject = useCallback(async (data: CreateCulturalProjectData) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await apiClient.post('/culture/projects', data)
      const newProject = response.data.data
      setProjects(prev => [newProject, ...prev])
      return newProject
    } catch (err) {
      setError('Erro ao criar projeto cultural')
      console.error('Error creating cultural project:', err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const updateProject = useCallback(async (id: string, data: Partial<CreateCulturalProjectData>) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await apiClient.put(`/culture/projects/${id}`, data)
      const updatedProject = response.data.data
      setProjects(prev => prev.map(project => project.id === id ? updatedProject : project))
      return updatedProject
    } catch (err) {
      setError('Erro ao atualizar projeto cultural')
      console.error('Error updating cultural project:', err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const deleteProject = useCallback(async (id: string) => {
    setIsLoading(true)
    setError(null)
    try {
      await apiClient.delete(`/culture/projects/${id}`)
      setProjects(prev => prev.filter(project => project.id !== id))
    } catch (err) {
      setError('Erro ao excluir projeto cultural')
      console.error('Error deleting cultural project:', err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const approveProject = useCallback(async (id: string, approvalData: {
    notes?: string
    conditions?: string[]
    approvedBudget: number
  }) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await apiClient.post(`/culture/projects/${id}/approve`, approvalData)
      const updatedProject = response.data.data
      setProjects(prev => prev.map(project => project.id === id ? updatedProject : project))
      return updatedProject
    } catch (err) {
      setError('Erro ao aprovar projeto cultural')
      console.error('Error approving cultural project:', err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const addTeamMember = useCallback(async (id: string, memberData: {
    memberId: string
    role: string
    responsibility: string
    workload: number
    compensation: number
    startDate: string
    endDate?: string
  }) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await apiClient.post(`/culture/projects/${id}/team`, memberData)
      const updatedProject = response.data.data
      setProjects(prev => prev.map(project => project.id === id ? updatedProject : project))
      return updatedProject
    } catch (err) {
      setError('Erro ao adicionar membro da equipe')
      console.error('Error adding team member:', err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const addPartnership = useCallback(async (id: string, partnershipData: {
    partnerName: string
    partnerType: 'GOVERNMENT' | 'PRIVATE' | 'NGO' | 'EDUCATIONAL' | 'CULTURAL' | 'MEDIA'
    partnerContact: string
    type: 'FINANCIAL' | 'TECHNICAL' | 'LOGISTICAL' | 'PROMOTIONAL' | 'CONTENT'
    contribution: string
    responsibilities: string[]
    benefits: string[]
  }) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await apiClient.post(`/culture/projects/${id}/partnerships`, partnershipData)
      const updatedProject = response.data.data
      setProjects(prev => prev.map(project => project.id === id ? updatedProject : project))
      return updatedProject
    } catch (err) {
      setError('Erro ao adicionar parceria')
      console.error('Error adding partnership:', err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const updatePhaseStatus = useCallback(async (id: string, phaseId: string, statusData: {
    status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'DELAYED'
    notes?: string
    completedMilestones?: string[]
  }) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await apiClient.put(`/culture/projects/${id}/phases/${phaseId}`, statusData)
      const updatedProject = response.data.data
      setProjects(prev => prev.map(project => project.id === id ? updatedProject : project))
      return updatedProject
    } catch (err) {
      setError('Erro ao atualizar status da fase')
      console.error('Error updating phase status:', err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const recordExpense = useCallback(async (id: string, expenseData: {
    category: string
    description: string
    amount: number
    date: string
    supplier: string
    invoice?: string
  }) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await apiClient.post(`/culture/projects/${id}/expenses`, expenseData)
      const updatedProject = response.data.data
      setProjects(prev => prev.map(project => project.id === id ? updatedProject : project))
      return updatedProject
    } catch (err) {
      setError('Erro ao registrar despesa')
      console.error('Error recording expense:', err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const addRisk = useCallback(async (id: string, riskData: {
    description: string
    category: 'FINANCIAL' | 'TECHNICAL' | 'LOGISTICAL' | 'LEGAL' | 'EXTERNAL'
    probability: 'LOW' | 'MEDIUM' | 'HIGH'
    impact: 'LOW' | 'MEDIUM' | 'HIGH'
    mitigation: string
  }) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await apiClient.post(`/culture/projects/${id}/risks`, riskData)
      const updatedProject = response.data.data
      setProjects(prev => prev.map(project => project.id === id ? updatedProject : project))
      return updatedProject
    } catch (err) {
      setError('Erro ao adicionar risco')
      console.error('Error adding risk:', err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const updateIndicators = useCallback(async (id: string, indicatorUpdates: Array<{
    name: string
    achieved: number
  }>) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await apiClient.put(`/culture/projects/${id}/indicators`, { indicators: indicatorUpdates })
      const updatedProject = response.data.data
      setProjects(prev => prev.map(project => project.id === id ? updatedProject : project))
      return updatedProject
    } catch (err) {
      setError('Erro ao atualizar indicadores')
      console.error('Error updating indicators:', err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const generateProgressReport = useCallback(async (id: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await apiClient.post(`/culture/projects/${id}/reports/progress`)
      return response.data.data
    } catch (err) {
      setError('Erro ao gerar relatório de progresso')
      console.error('Error generating progress report:', err)
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

  const getProjectsByCategory = useCallback((category: string) => {
    return projects.filter(project => project.category === category)
  }, [projects])

  const getActiveProjects = useCallback(() => {
    return projects.filter(project =>
      ['PREPARATION', 'EXECUTION'].includes(project.status)
    )
  }, [projects])

  const getProjectsNearDeadline = useCallback((days: number = 30) => {
    const futureDate = new Date()
    futureDate.setDate(futureDate.getDate() + days)
    const futureDateStr = futureDate.toISOString().split('T')[0]

    return projects.filter(project =>
      project.timeline.endDate <= futureDateStr &&
      ['PREPARATION', 'EXECUTION'].includes(project.status)
    )
  }, [projects])

  const getOverdueProjects = useCallback(() => {
    const today = new Date().toISOString().split('T')[0]
    return projects.filter(project =>
      project.timeline.endDate < today &&
      !['COMPLETED', 'CANCELLED'].includes(project.status)
    )
  }, [projects])

  const getProjectsByCoordinator = useCallback((coordinatorId: string) => {
    return projects.filter(project => project.team.coordinator.id === coordinatorId)
  }, [projects])

  const getTotalBudget = useCallback((status?: string) => {
    const filteredProjects = status
      ? projects.filter(project => project.status === status)
      : projects
    return filteredProjects.reduce((total, project) => total + project.budget.total, 0)
  }, [projects])

  const getProjectsWithHighRisks = useCallback(() => {
    return projects.filter(project =>
      project.monitoring?.risks?.some(risk =>
        risk.status !== 'RESOLVED' &&
        (risk.probability === 'HIGH' || risk.impact === 'HIGH')
      )
    )
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
    addTeamMember,
    addPartnership,
    updatePhaseStatus,
    recordExpense,
    addRisk,
    updateIndicators,
    generateProgressReport,
    getProjectById,
    getProjectsByStatus,
    getProjectsByType,
    getProjectsByCategory,
    getActiveProjects,
    getProjectsNearDeadline,
    getOverdueProjects,
    getProjectsByCoordinator,
    getTotalBudget,
    getProjectsWithHighRisks
  }
}