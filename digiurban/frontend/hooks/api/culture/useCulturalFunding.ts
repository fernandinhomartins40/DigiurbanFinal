import { useState, useEffect, useCallback } from 'react'
import { apiClient } from '@/lib/api-client'

export interface CulturalFunding {
  id: string
  title: string
  code: string
  type: 'GRANT' | 'CONTEST' | 'SUBSIDY' | 'SCHOLARSHIP' | 'RESIDENCY' | 'PRIZE' | 'SPONSORSHIP' | 'LOAN' | 'TAX_INCENTIVE'
  category: 'MUSIC' | 'THEATER' | 'DANCE' | 'VISUAL_ARTS' | 'LITERATURE' | 'CINEMA' | 'CRAFTS' | 'DIGITAL_ARTS' | 'CULTURAL_MANAGEMENT' | 'MULTIDISCIPLINARY' | 'HERITAGE'
  scope: 'LOCAL' | 'MUNICIPAL' | 'REGIONAL' | 'STATE' | 'NATIONAL' | 'INTERNATIONAL'
  status: 'DRAFT' | 'PUBLISHED' | 'OPEN' | 'EVALUATION' | 'RESULTS' | 'CONTRACTS' | 'EXECUTION' | 'COMPLETED' | 'CANCELLED'
  description: string
  objectives: string[]
  justification: string
  legalBasis: string[]
  budget: {
    total: number
    currency: string
    source: 'MUNICIPAL' | 'STATE' | 'FEDERAL' | 'PRIVATE' | 'MIXED' | 'INTERNATIONAL'
    breakdown: {
      prizes: number
      administration: number
      evaluation: number
      dissemination: number
      monitoring: number
      contingency: number
    }
    funding: Array<{
      source: string
      amount: number
      confirmed: boolean
      conditions: string[]
    }>
  }
  eligibility: {
    applicantTypes: Array<'INDIVIDUAL' | 'GROUP' | 'COMPANY' | 'NGO' | 'INSTITUTION' | 'GOVERNMENT'>
    ageRequirements: {
      min?: number
      max?: number
    }
    residency: {
      required: boolean
      locations: string[]
      duration?: number
    }
    experience: {
      required: boolean
      minimumYears?: number
      areas: string[]
    }
    legal: {
      registration: string[]
      certificates: string[]
      licenses: string[]
    }
    exclusions: string[]
    compatibility: {
      otherFunding: boolean
      simultaneousApplications: boolean
      previousWinners: {
        allowed: boolean
        waitingPeriod?: number
      }
    }
  }
  timeline: {
    publicationDate: string
    applicationStart: string
    applicationEnd: string
    evaluationPeriod: {
      start: string
      end: string
    }
    resultDate: string
    contractPeriod?: {
      start: string
      end: string
    }
    executionPeriod: {
      start: string
      end: string
      maxDuration: number
    }
    reportingDeadlines: string[]
  }
  application: {
    format: 'ONLINE' | 'PHYSICAL' | 'HYBRID'
    platform?: string
    language: string[]
    documents: Array<{
      name: string
      type: 'PDF' | 'DOC' | 'EXCEL' | 'IMAGE' | 'VIDEO' | 'AUDIO'
      required: boolean
      maxSize: number
      description: string
      template?: string
    }>
    forms: Array<{
      section: string
      fields: Array<{
        name: string
        type: 'TEXT' | 'NUMBER' | 'DATE' | 'SELECT' | 'MULTISELECT' | 'FILE' | 'TEXTAREA'
        required: boolean
        maxLength?: number
        options?: string[]
        validation?: string
      }>
    }>
    fees: {
      required: boolean
      amount?: number
      exemptions: string[]
    }
    submission: {
      maxAttempts: number
      editableAfterSubmission: boolean
      confirmationRequired: boolean
    }
  }
  evaluation: {
    process: 'SINGLE_STAGE' | 'MULTI_STAGE' | 'CONTINUOUS'
    stages: Array<{
      name: string
      type: 'ADMINISTRATIVE' | 'TECHNICAL' | 'ARTISTIC' | 'FINANCIAL' | 'INTERVIEW' | 'PRESENTATION'
      eliminatory: boolean
      weight: number
      criteria: Array<{
        name: string
        description: string
        weight: number
        scale: {
          min: number
          max: number
          type: 'NUMERIC' | 'LETTER' | 'CONCEPT'
        }
      }>
    }>
    committee: Array<{
      name: string
      role: 'PRESIDENT' | 'MEMBER' | 'SPECIALIST' | 'EXTERNAL' | 'COMMUNITY'
      qualification: string[]
      bio: string
      conflicts?: string[]
    }>
    anonymity: {
      applicant: boolean
      evaluator: boolean
    }
    transparency: {
      publicScores: boolean
      publicComments: boolean
      publicNames: boolean
    }
    appeals: {
      allowed: boolean
      deadline?: number
      process?: string
    }
  }
  awards: {
    structure: 'FIXED' | 'VARIABLE' | 'TIERED' | 'PERCENTAGE'
    prizes: Array<{
      position: number
      name: string
      amount: number
      description: string
      benefits: string[]
      duration?: number
      renewable?: boolean
    }>
    payment: {
      method: 'LUMP_SUM' | 'INSTALLMENTS' | 'REIMBURSEMENT' | 'SERVICES'
      schedule: string[]
      requirements: string[]
      tax: {
        applicable: boolean
        responsibility: 'ORGANIZER' | 'RECIPIENT' | 'SHARED'
        percentage?: number
      }
    }
    nonMonetary: Array<{
      type: 'MENTORSHIP' | 'TRAINING' | 'EQUIPMENT' | 'SPACE' | 'PROMOTION' | 'NETWORK'
      description: string
      duration?: number
      provider: string
    }>
  }
  applications: Array<{
    id: string
    applicantId: string
    applicantName: string
    applicantType: 'INDIVIDUAL' | 'GROUP' | 'COMPANY' | 'NGO' | 'INSTITUTION' | 'GOVERNMENT'
    submissionDate: string
    status: 'SUBMITTED' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED' | 'APPEAL' | 'WITHDRAWN'
    project: {
      title: string
      description: string
      category: string
      budget: number
      duration: number
      location: string[]
    }
    scores: Array<{
      stage: string
      criteria: string
      score: number
      evaluator: string
      comments?: string
    }>
    finalScore?: number
    finalRank?: number
    selected: boolean
    feedback?: string
    contract?: {
      signed: boolean
      date?: string
      value: number
      terms: string[]
    }
  }>
  monitoring: {
    requirements: Array<{
      type: 'REPORT' | 'FINANCIAL' | 'ARTISTIC' | 'PRESENTATION' | 'VISIT'
      frequency: 'MONTHLY' | 'QUARTERLY' | 'BIANNUAL' | 'ANNUAL' | 'FINAL'
      deadline: string
      format: string
      template?: string
    }>
    indicators: Array<{
      name: string
      description: string
      target?: number
      unit: string
      measurement: 'QUANTITATIVE' | 'QUALITATIVE'
    }>
    penalties: Array<{
      violation: string
      severity: 'MINOR' | 'MAJOR' | 'SEVERE'
      consequence: 'WARNING' | 'FINE' | 'SUSPENSION' | 'TERMINATION' | 'BLACKLIST'
      amount?: number
    }>
  }
  results: {
    published: boolean
    publicationDate?: string
    winners: Array<{
      applicationId: string
      position: number
      prizeName: string
      amount: number
      justification: string
    }>
    statistics: {
      totalApplications: number
      eligibleApplications: number
      selectedApplications: number
      rejectedApplications: number
      averageScore: number
      demographics: {
        byType: { [key: string]: number }
        byCategory: { [key: string]: number }
        byRegion: { [key: string]: number }
        byAge: { [key: string]: number }
        byGender: { [key: string]: number }
      }
    }
    satisfaction: {
      applicants: number
      winners: number
      evaluators: number
      community: number
    }
  }
  impact: {
    objectives: Array<{
      objective: string
      achieved: boolean
      measurement: string
      evidence: string[]
    }>
    beneficiaries: {
      direct: number
      indirect: number
      demographics: { [key: string]: number }
    }
    outcomes: {
      artistic: string[]
      social: string[]
      economic: string[]
      cultural: string[]
    }
    sustainability: {
      continued: number
      replicated: number
      expanded: number
    }
    media: {
      coverage: number
      reach: number
      sentiment: 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE' | 'MIXED'
    }
  }
  communication: {
    strategy: string
    channels: Array<{
      type: 'WEBSITE' | 'SOCIAL_MEDIA' | 'EMAIL' | 'PRESS' | 'RADIO' | 'TV' | 'PRINT'
      platform?: string
      reach: number
      cost: number
    }>
    materials: Array<{
      type: 'REGULATION' | 'GUIDE' | 'FAQ' | 'POSTER' | 'VIDEO' | 'INFOGRAPHIC'
      title: string
      format: string
      language: string[]
      url?: string
      distribution: number
    }>
    events: Array<{
      type: 'LAUNCH' | 'WORKSHOP' | 'WEBINAR' | 'ORIENTATION' | 'RESULT'
      date: string
      format: 'PRESENTIAL' | 'ONLINE' | 'HYBRID'
      participants: number
      recording?: string
    }>
  }
  partnerships: Array<{
    partner: string
    type: 'GOVERNMENT' | 'PRIVATE' | 'NGO' | 'MEDIA' | 'EDUCATIONAL' | 'CULTURAL'
    role: 'SPONSOR' | 'SUPPORTER' | 'EVALUATOR' | 'DISSEMINATOR' | 'MENTOR'
    contribution: string
    agreement?: string
  }>
  team: {
    coordinator: {
      name: string
      role: string
      email: string
      phone: string
    }
    members: Array<{
      name: string
      role: string
      responsibility: string
      dedication: number
    }>
    evaluators: number
    support: number
  }
  legal: {
    regulation: {
      version: string
      publishDate: string
      approvedBy: string
      url: string
    }
    contracts: Array<{
      type: 'EVALUATION' | 'MENTORSHIP' | 'MONITORING' | 'PARTNERSHIP'
      party: string
      value?: number
      signed: boolean
      startDate: string
      endDate: string
    }>
    compliance: {
      transparency: boolean
      publicity: boolean
      accountability: boolean
      nonDiscrimination: boolean
    }
    appeals: Array<{
      id: string
      applicantId: string
      date: string
      reason: string
      status: 'PENDING' | 'ACCEPTED' | 'REJECTED'
      decision?: string
      decisionDate?: string
    }>
  }
  history: Array<{
    edition: number
    year: number
    budget: number
    applications: number
    winners: number
    highlights: string[]
    challenges: string[]
    improvements: string[]
  }>
  createdAt: string
  updatedAt: string
  createdBy: string
  lastModifiedBy: string
}

export interface CreateCulturalFundingData {
  title: string
  code: string
  type: 'GRANT' | 'CONTEST' | 'SUBSIDY' | 'SCHOLARSHIP' | 'RESIDENCY' | 'PRIZE' | 'SPONSORSHIP' | 'LOAN' | 'TAX_INCENTIVE'
  category: 'MUSIC' | 'THEATER' | 'DANCE' | 'VISUAL_ARTS' | 'LITERATURE' | 'CINEMA' | 'CRAFTS' | 'DIGITAL_ARTS' | 'CULTURAL_MANAGEMENT' | 'MULTIDISCIPLINARY' | 'HERITAGE'
  scope: 'LOCAL' | 'MUNICIPAL' | 'REGIONAL' | 'STATE' | 'NATIONAL' | 'INTERNATIONAL'
  description: string
  objectives: string[]
  justification: string
  budget: {
    total: number
    source: 'MUNICIPAL' | 'STATE' | 'FEDERAL' | 'PRIVATE' | 'MIXED' | 'INTERNATIONAL'
    breakdown: {
      prizes: number
      administration: number
      evaluation: number
      dissemination: number
      monitoring: number
      contingency: number
    }
  }
  timeline: {
    publicationDate: string
    applicationStart: string
    applicationEnd: string
    evaluationPeriod: {
      start: string
      end: string
    }
    resultDate: string
    executionPeriod: {
      start: string
      end: string
      maxDuration: number
    }
  }
  coordinatorId: string
  eligibility: {
    applicantTypes: Array<'INDIVIDUAL' | 'GROUP' | 'COMPANY' | 'NGO' | 'INSTITUTION' | 'GOVERNMENT'>
    residency: {
      required: boolean
      locations: string[]
    }
  }
  awards: {
    structure: 'FIXED' | 'VARIABLE' | 'TIERED' | 'PERCENTAGE'
    prizes: Array<{
      position: number
      name: string
      amount: number
      description: string
      benefits: string[]
    }>
  }
}

export interface CulturalFundingFilters {
  type?: string
  category?: string
  scope?: string
  status?: string
  coordinatorId?: string
  budgetMin?: number
  budgetMax?: number
  applicationOpen?: boolean
  dateFrom?: string
  dateTo?: string
}

export function useCulturalFunding() {
  const [fundings, setFundings] = useState<CulturalFunding[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchFundings = useCallback(async (filters?: CulturalFundingFilters) => {
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
      const response = await apiClient.get(`/culture/funding?${params}`)
      setFundings(response.data.data || [])
    } catch (err) {
      setError('Erro ao carregar editais de financiamento')
      console.error('Error fetching cultural funding:', err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const createFunding = useCallback(async (data: CreateCulturalFundingData) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await apiClient.post('/culture/funding', data)
      const newFunding = response.data.data
      setFundings(prev => [newFunding, ...prev])
      return newFunding
    } catch (err) {
      setError('Erro ao criar edital de financiamento')
      console.error('Error creating cultural funding:', err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const updateFunding = useCallback(async (id: string, data: Partial<CreateCulturalFundingData>) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await apiClient.put(`/culture/funding/${id}`, data)
      const updatedFunding = response.data.data
      setFundings(prev => prev.map(funding => funding.id === id ? updatedFunding : funding))
      return updatedFunding
    } catch (err) {
      setError('Erro ao atualizar edital de financiamento')
      console.error('Error updating cultural funding:', err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const deleteFunding = useCallback(async (id: string) => {
    setIsLoading(true)
    setError(null)
    try {
      await apiClient.delete(`/culture/funding/${id}`)
      setFundings(prev => prev.filter(funding => funding.id !== id))
    } catch (err) {
      setError('Erro ao excluir edital de financiamento')
      console.error('Error deleting cultural funding:', err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const publishFunding = useCallback(async (id: string, publicationData: {
    regulation: File
    approvedBy: string
    communicationPlan: {
      channels: string[]
      events: Array<{
        type: 'LAUNCH' | 'WORKSHOP' | 'WEBINAR'
        date: string
        format: 'PRESENTIAL' | 'ONLINE' | 'HYBRID'
      }>
    }
  }) => {
    setIsLoading(true)
    setError(null)
    try {
      const formData = new FormData()
      formData.append('regulation', publicationData.regulation)
      formData.append('approvedBy', publicationData.approvedBy)
      formData.append('communicationPlan', JSON.stringify(publicationData.communicationPlan))

      const response = await apiClient.post(`/culture/funding/${id}/publish`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      const updatedFunding = response.data.data
      setFundings(prev => prev.map(funding => funding.id === id ? updatedFunding : funding))
      return updatedFunding
    } catch (err) {
      setError('Erro ao publicar edital')
      console.error('Error publishing funding:', err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const submitApplication = useCallback(async (id: string, applicationData: {
    applicantId: string
    project: {
      title: string
      description: string
      category: string
      budget: number
      duration: number
      location: string[]
    }
    documents: File[]
    forms: { [key: string]: any }
  }) => {
    setIsLoading(true)
    setError(null)
    try {
      const formData = new FormData()
      applicationData.documents.forEach((file, index) => {
        formData.append(`documents[${index}]`, file)
      })
      formData.append('applicantId', applicationData.applicantId)
      formData.append('project', JSON.stringify(applicationData.project))
      formData.append('forms', JSON.stringify(applicationData.forms))

      const response = await apiClient.post(`/culture/funding/${id}/applications`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      const updatedFunding = response.data.data
      setFundings(prev => prev.map(funding => funding.id === id ? updatedFunding : funding))
      return updatedFunding
    } catch (err) {
      setError('Erro ao submeter inscrição')
      console.error('Error submitting application:', err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const evaluateApplication = useCallback(async (id: string, applicationId: string, evaluationData: {
    stage: string
    scores: Array<{
      criteria: string
      score: number
      comments?: string
    }>
    evaluatorId: string
    recommendation?: 'APPROVE' | 'REJECT' | 'CONDITIONAL'
    feedback?: string
  }) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await apiClient.post(`/culture/funding/${id}/applications/${applicationId}/evaluate`, evaluationData)
      const updatedFunding = response.data.data
      setFundings(prev => prev.map(funding => funding.id === id ? updatedFunding : funding))
      return updatedFunding
    } catch (err) {
      setError('Erro ao avaliar inscrição')
      console.error('Error evaluating application:', err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const publishResults = useCallback(async (id: string, resultsData: {
    winners: Array<{
      applicationId: string
      position: number
      prizeName: string
      justification: string
    }>
    notificationMethod: 'EMAIL' | 'WEBSITE' | 'BOTH'
    appealPeriod?: {
      start: string
      end: string
    }
  }) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await apiClient.post(`/culture/funding/${id}/results`, resultsData)
      const updatedFunding = response.data.data
      setFundings(prev => prev.map(funding => funding.id === id ? updatedFunding : funding))
      return updatedFunding
    } catch (err) {
      setError('Erro ao publicar resultados')
      console.error('Error publishing results:', err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const addEvaluator = useCallback(async (id: string, evaluatorData: {
    name: string
    role: 'PRESIDENT' | 'MEMBER' | 'SPECIALIST' | 'EXTERNAL' | 'COMMUNITY'
    qualification: string[]
    bio: string
    conflicts?: string[]
    fee?: number
  }) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await apiClient.post(`/culture/funding/${id}/evaluators`, evaluatorData)
      const updatedFunding = response.data.data
      setFundings(prev => prev.map(funding => funding.id === id ? updatedFunding : funding))
      return updatedFunding
    } catch (err) {
      setError('Erro ao adicionar avaliador')
      console.error('Error adding evaluator:', err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const processAppeal = useCallback(async (id: string, appealData: {
    applicationId: string
    reason: string
    documents?: File[]
  }) => {
    setIsLoading(true)
    setError(null)
    try {
      const formData = new FormData()
      formData.append('applicationId', appealData.applicationId)
      formData.append('reason', appealData.reason)
      if (appealData.documents) {
        appealData.documents.forEach((file, index) => {
          formData.append(`documents[${index}]`, file)
        })
      }

      const response = await apiClient.post(`/culture/funding/${id}/appeals`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      const updatedFunding = response.data.data
      setFundings(prev => prev.map(funding => funding.id === id ? updatedFunding : funding))
      return updatedFunding
    } catch (err) {
      setError('Erro ao processar recurso')
      console.error('Error processing appeal:', err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const monitorProject = useCallback(async (id: string, applicationId: string, monitoringData: {
    reportType: 'PROGRESS' | 'FINANCIAL' | 'ARTISTIC' | 'FINAL'
    period: string
    data: { [key: string]: any }
    documents?: File[]
  }) => {
    setIsLoading(true)
    setError(null)
    try {
      const formData = new FormData()
      formData.append('reportType', monitoringData.reportType)
      formData.append('period', monitoringData.period)
      formData.append('data', JSON.stringify(monitoringData.data))
      if (monitoringData.documents) {
        monitoringData.documents.forEach((file, index) => {
          formData.append(`documents[${index}]`, file)
        })
      }

      const response = await apiClient.post(`/culture/funding/${id}/applications/${applicationId}/monitoring`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      const updatedFunding = response.data.data
      setFundings(prev => prev.map(funding => funding.id === id ? updatedFunding : funding))
      return updatedFunding
    } catch (err) {
      setError('Erro ao registrar monitoramento')
      console.error('Error monitoring project:', err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const generateStatistics = useCallback(async (id: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await apiClient.post(`/culture/funding/${id}/statistics`)
      return response.data.data
    } catch (err) {
      setError('Erro ao gerar estatísticas')
      console.error('Error generating statistics:', err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const generateReport = useCallback(async (id: string, reportType: 'APPLICATIONS' | 'EVALUATION' | 'RESULTS' | 'IMPACT' | 'FINANCIAL') => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await apiClient.post(`/culture/funding/${id}/reports`, { type: reportType })
      return response.data.data
    } catch (err) {
      setError('Erro ao gerar relatório')
      console.error('Error generating report:', err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const getFundingById = useCallback((id: string) => {
    return fundings.find(funding => funding.id === id)
  }, [fundings])

  const getFundingsByType = useCallback((type: string) => {
    return fundings.filter(funding => funding.type === type)
  }, [fundings])

  const getFundingsByCategory = useCallback((category: string) => {
    return fundings.filter(funding => funding.category === category)
  }, [fundings])

  const getFundingsByStatus = useCallback((status: string) => {
    return fundings.filter(funding => funding.status === status)
  }, [fundings])

  const getOpenFundings = useCallback(() => {
    const today = new Date().toISOString().split('T')[0]
    return fundings.filter(funding =>
      funding.status === 'OPEN' &&
      funding.timeline.applicationStart <= today &&
      funding.timeline.applicationEnd >= today
    )
  }, [fundings])

  const getUpcomingFundings = useCallback((days: number = 30) => {
    const futureDate = new Date()
    futureDate.setDate(futureDate.getDate() + days)
    const futureDateStr = futureDate.toISOString().split('T')[0]

    return fundings.filter(funding =>
      funding.timeline.applicationStart <= futureDateStr &&
      ['PUBLISHED', 'OPEN'].includes(funding.status)
    )
  }, [fundings])

  const getFundingsByCoordinator = useCallback((coordinatorId: string) => {
    return fundings.filter(funding => funding.team.coordinator.name === coordinatorId)
  }, [fundings])

  const getActiveExecutions = useCallback(() => {
    return fundings.filter(funding => funding.status === 'EXECUTION')
  }, [fundings])

  const getFundingsInEvaluation = useCallback(() => {
    return fundings.filter(funding => funding.status === 'EVALUATION')
  }, [fundings])

  const getTotalBudget = useCallback((status?: string) => {
    const filteredFundings = status
      ? fundings.filter(funding => funding.status === status)
      : fundings
    return filteredFundings.reduce((total, funding) => total + funding.budget.total, 0)
  }, [fundings])

  const getTotalApplications = useCallback(() => {
    return fundings.reduce((total, funding) => total + funding.applications.length, 0)
  }, [fundings])

  const getAverageCompetition = useCallback(() => {
    const completedFundings = fundings.filter(funding => funding.results?.published)
    if (completedFundings.length === 0) return 0

    const totalRatio = completedFundings.reduce((sum, funding) => {
      const applications = funding.results.statistics.totalApplications
      const winners = funding.results.statistics.selectedApplications
      return sum + (applications > 0 ? applications / winners : 0)
    }, 0)

    return totalRatio / completedFundings.length
  }, [fundings])

  const getPopularCategories = useCallback(() => {
    const categoryCount: { [key: string]: number } = {}
    fundings.forEach(funding => {
      categoryCount[funding.category] = (categoryCount[funding.category] || 0) + 1
    })

    return Object.entries(categoryCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([category, count]) => ({ category, count }))
  }, [fundings])

  useEffect(() => {
    fetchFundings()
  }, [fetchFundings])

  return {
    fundings,
    isLoading,
    error,
    fetchFundings,
    createFunding,
    updateFunding,
    deleteFunding,
    publishFunding,
    submitApplication,
    evaluateApplication,
    publishResults,
    addEvaluator,
    processAppeal,
    monitorProject,
    generateStatistics,
    generateReport,
    getFundingById,
    getFundingsByType,
    getFundingsByCategory,
    getFundingsByStatus,
    getOpenFundings,
    getUpcomingFundings,
    getFundingsByCoordinator,
    getActiveExecutions,
    getFundingsInEvaluation,
    getTotalBudget,
    getTotalApplications,
    getAverageCompetition,
    getPopularCategories
  }
}