'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAdminAuth } from '@/contexts/AdminAuthContext'

interface HousingApplication {
  id: string
  applicationNumber: string
  programId: string
  programName: string
  applicant: {
    name: string
    cpf: string
    rg?: string
    dateOfBirth: string
    gender: 'MALE' | 'FEMALE'
    maritalStatus: 'SINGLE' | 'MARRIED' | 'DIVORCED' | 'WIDOWED' | 'UNION'
    phone: string
    email?: string
    address: {
      street: string
      number: string
      complement?: string
      neighborhood: string
      district: string
      zipCode: string
    }
    occupation: string
    employer?: string
    workAddress?: string
  }
  family: {
    size: number
    monthlyIncome: number
    composition: {
      name: string
      cpf: string
      dateOfBirth: string
      relationship: 'SPOUSE' | 'CHILD' | 'PARENT' | 'SIBLING' | 'OTHER'
      occupation?: string
      income?: number
      disability?: boolean
    }[]
    dependents: number
    elderlyMembers: number
    disabledMembers: number
  }
  currentHousing: {
    situation: 'RENTED' | 'OWNED' | 'FAMILY_PROPERTY' | 'IRREGULAR_OCCUPATION' | 'HOMELESS' | 'OTHER'
    monthlyRent?: number
    conditions: 'ADEQUATE' | 'INADEQUATE' | 'PRECARIOUS'
    description: string
    needsRelocation: boolean
    urgency: 'LOW' | 'MEDIUM' | 'HIGH' | 'EMERGENCY'
  }
  eligibility: {
    incomeRequirement: {
      meets: boolean
      familyIncome: number
      maximumAllowed: number
    }
    residencyRequirement: {
      meets: boolean
      yearsInCity: number
      minimumRequired: number
    }
    propertyOwnership: {
      ownsProperty: boolean
      hasFinancing: boolean
      details?: string
    }
    previousBenefits: {
      receivedBefore: boolean
      programName?: string
      year?: number
    }
    priorities: {
      singleMother: boolean
      elderly: boolean
      disabled: boolean
      vulnerability: boolean
      riskArea: boolean
      score: number
    }
  }
  documents: {
    type: string
    name: string
    url?: string
    submitted: boolean
    verified: boolean
    observations?: string
    expiryDate?: string
  }[]
  evaluation: {
    score: number
    criteria: {
      criterion: string
      points: number
      maxPoints: number
      observations?: string
    }[]
    socialVisit: {
      scheduled: boolean
      date?: string
      socialWorker?: string
      report?: string
      recommendations?: string[]
    }
    technicalAnalysis: {
      completed: boolean
      analyst?: string
      date?: string
      findings: string[]
      approval: boolean
      observations?: string
    }
  }
  timeline: {
    applicationDate: string
    documentSubmissionDeadline: string
    evaluationStartDate?: string
    socialVisitDate?: string
    decisionDate?: string
    allocationDate?: string
    events: {
      date: string
      event: string
      responsible: string
      details?: string
    }[]
  }
  status: 'DRAFT' | 'SUBMITTED' | 'UNDER_REVIEW' | 'PENDING_DOCUMENTS' | 'SOCIAL_VISIT' | 'TECHNICAL_ANALYSIS' | 'APPROVED' | 'REJECTED' | 'WAITING_LIST' | 'ALLOCATED' | 'CANCELLED'
  rejection?: {
    reasons: string[]
    details: string
    appealDeadline: string
    canAppeal: boolean
  }
  waitingList?: {
    position: number
    estimatedWaitTime: string
    lastUpdate: string
  }
  allocation?: {
    unitId: string
    unitAddress: string
    allocationDate: string
    acceptanceDeadline: string
    accepted: boolean
    contractSigned?: boolean
    occupancyDate?: string
  }
  communication: {
    notifications: {
      date: string
      type: 'EMAIL' | 'SMS' | 'MAIL' | 'PHONE'
      message: string
      status: 'SENT' | 'DELIVERED' | 'READ' | 'FAILED'
    }[]
    meetings: {
      date: string
      type: 'ORIENTATION' | 'CLARIFICATION' | 'INTERVIEW' | 'DELIVERY'
      participants: string[]
      summary: string
    }[]
  }
  appeal?: {
    submissionDate: string
    reasons: string[]
    documents: string[]
    status: 'SUBMITTED' | 'UNDER_REVIEW' | 'ACCEPTED' | 'REJECTED'
    decision?: {
      date: string
      result: boolean
      justification: string
    }
  }
  observations: string[]
  attachments: {
    type: string
    name: string
    url: string
    date: string
  }[]
  createdBy: string
  createdAt: string
  updatedAt: string
}

interface CreateHousingApplicationData {
  programId: string
  applicant: {
    name: string
    cpf: string
    dateOfBirth: string
    gender: 'MALE' | 'FEMALE'
    phone: string
    address: {
      street: string
      number: string
      neighborhood: string
      district: string
      zipCode: string
    }
  }
  family: {
    size: number
    monthlyIncome: number
  }
  currentHousing: {
    situation: 'RENTED' | 'OWNED' | 'FAMILY_PROPERTY' | 'IRREGULAR_OCCUPATION' | 'HOMELESS' | 'OTHER'
    conditions: 'ADEQUATE' | 'INADEQUATE' | 'PRECARIOUS'
    description: string
  }
}

interface UseHousingApplicationsReturn {
  applications: HousingApplication[]
  loading: boolean
  error: string | null
  createApplication: (data: CreateHousingApplicationData) => Promise<HousingApplication>
  updateApplication: (id: string, data: Partial<CreateHousingApplicationData>) => Promise<HousingApplication>
  updateApplicant: (id: string, applicant: any) => Promise<HousingApplication>
  updateFamily: (id: string, family: any) => Promise<HousingApplication>
  addFamilyMember: (id: string, member: any) => Promise<HousingApplication>
  removeFamilyMember: (id: string, memberCpf: string) => Promise<HousingApplication>
  updateCurrentHousing: (id: string, housing: any) => Promise<HousingApplication>
  checkEligibility: (id: string) => Promise<HousingApplication>
  submitDocument: (id: string, document: any) => Promise<HousingApplication>
  verifyDocument: (id: string, documentType: string, verified: boolean) => Promise<HousingApplication>
  submitApplication: (id: string) => Promise<HousingApplication>
  scheduleEvaluation: (id: string, date: string) => Promise<HousingApplication>
  conductSocialVisit: (id: string, visit: any) => Promise<HousingApplication>
  performTechnicalAnalysis: (id: string, analysis: any) => Promise<HousingApplication>
  calculateScore: (id: string) => Promise<HousingApplication>
  approveApplication: (id: string) => Promise<HousingApplication>
  rejectApplication: (id: string, reasons: string[], details: string) => Promise<HousingApplication>
  addToWaitingList: (id: string, position: number) => Promise<HousingApplication>
  updateWaitingListPosition: (id: string, newPosition: number) => Promise<HousingApplication>
  allocateUnit: (id: string, unitId: string) => Promise<HousingApplication>
  acceptAllocation: (id: string) => Promise<HousingApplication>
  rejectAllocation: (id: string, reason: string) => Promise<HousingApplication>
  submitAppeal: (id: string, appeal: any) => Promise<HousingApplication>
  processAppeal: (id: string, decision: any) => Promise<HousingApplication>
  sendNotification: (id: string, notification: any) => Promise<HousingApplication>
  scheduleMeeting: (id: string, meeting: any) => Promise<HousingApplication>
  addObservation: (id: string, observation: string) => Promise<HousingApplication>
  cancelApplication: (id: string, reason: string) => Promise<HousingApplication>
  deleteApplication: (id: string) => Promise<void>
  getApplicationsByProgram: (programId: string) => HousingApplication[]
  getApplicationsByStatus: (status: string) => HousingApplication[]
  getPendingApplications: () => HousingApplication[]
  getApprovedApplications: () => HousingApplication[]
  refreshApplications: () => Promise<void>
}

export function useHousingApplications(): UseHousingApplicationsReturn {
  const [applications, setApplications] = useState<HousingApplication[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchApplications = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await apiClient.get('/api/specialized/housing/applications')
      setApplications(data.applications || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar inscrições habitacionais')
    } finally {
      setLoading(false)
    }
  }, [])

  const createApplication = useCallback(async (data: CreateHousingApplicationData): Promise<HousingApplication> => {
    try {
      setError(null)
      const response = await apiClient.post('/api/specialized/housing/applications', data)
      const newApplication = response.application
      setApplications(prev => [newApplication, ...prev])
      return newApplication
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar inscrição'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const updateApplication = useCallback(async (id: string, data: Partial<CreateHousingApplicationData>): Promise<HousingApplication> => {
    try {
      setError(null)
      const response = await apiClient.put(`/api/specialized/housing/applications/${id}`, data)
      const updatedApplication = response.application
      setApplications(prev => prev.map(app => app.id === id ? updatedApplication : app))
      return updatedApplication
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar inscrição'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const updateApplicant = useCallback(async (id: string, applicant: any): Promise<HousingApplication> => {
    try {
      setError(null)
      const response = await apiClient.put(`/api/specialized/housing/applications/${id}/applicant`, applicant)
      const updatedApplication = response.application
      setApplications(prev => prev.map(app => app.id === id ? updatedApplication : app))
      return updatedApplication
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar requerente'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const updateFamily = useCallback(async (id: string, family: any): Promise<HousingApplication> => {
    try {
      setError(null)
      const response = await apiClient.put(`/api/specialized/housing/applications/${id}/family`, family)
      const updatedApplication = response.application
      setApplications(prev => prev.map(app => app.id === id ? updatedApplication : app))
      return updatedApplication
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar família'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const addFamilyMember = useCallback(async (id: string, member: any): Promise<HousingApplication> => {
    try {
      setError(null)
      const response = await apiClient.post(`/api/specialized/housing/applications/${id}/family/members`, member)
      const updatedApplication = response.application
      setApplications(prev => prev.map(app => app.id === id ? updatedApplication : app))
      return updatedApplication
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao adicionar membro da família'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const removeFamilyMember = useCallback(async (id: string, memberCpf: string): Promise<HousingApplication> => {
    try {
      setError(null)
      const response = await apiClient.delete(`/api/specialized/housing/applications/${id}/family/members/${memberCpf}`)
      const updatedApplication = response.application
      setApplications(prev => prev.map(app => app.id === id ? updatedApplication : app))
      return updatedApplication
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao remover membro da família'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const updateCurrentHousing = useCallback(async (id: string, housing: any): Promise<HousingApplication> => {
    try {
      setError(null)
      const response = await apiClient.put(`/api/specialized/housing/applications/${id}/current-housing`, housing)
      const updatedApplication = response.application
      setApplications(prev => prev.map(app => app.id === id ? updatedApplication : app))
      return updatedApplication
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar situação habitacional'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const checkEligibility = useCallback(async (id: string): Promise<HousingApplication> => {
    try {
      setError(null)
      const response = await apiClient.post(`/api/specialized/housing/applications/${id}/check-eligibility`, {})
      const updatedApplication = response.application
      setApplications(prev => prev.map(app => app.id === id ? updatedApplication : app))
      return updatedApplication
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao verificar elegibilidade'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const submitDocument = useCallback(async (id: string, document: any): Promise<HousingApplication> => {
    try {
      setError(null)
      const response = await apiClient.post(`/api/specialized/housing/applications/${id}/documents`, document)
      const updatedApplication = response.application
      setApplications(prev => prev.map(app => app.id === id ? updatedApplication : app))
      return updatedApplication
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao submeter documento'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const verifyDocument = useCallback(async (id: string, documentType: string, verified: boolean): Promise<HousingApplication> => {
    try {
      setError(null)
      const response = await apiClient.put(`/api/specialized/housing/applications/${id}/documents/${documentType}/verify`, { verified })
      const updatedApplication = response.application
      setApplications(prev => prev.map(app => app.id === id ? updatedApplication : app))
      return updatedApplication
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao verificar documento'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const submitApplication = useCallback(async (id: string): Promise<HousingApplication> => {
    try {
      setError(null)
      const response = await apiClient.post(`/api/specialized/housing/applications/${id}/submit`, {})
      const updatedApplication = response.application
      setApplications(prev => prev.map(app => app.id === id ? updatedApplication : app))
      return updatedApplication
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao submeter inscrição'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const scheduleEvaluation = useCallback(async (id: string, date: string): Promise<HousingApplication> => {
    try {
      setError(null)
      const response = await apiClient.post(`/api/specialized/housing/applications/${id}/schedule-evaluation`, { date })
      const updatedApplication = response.application
      setApplications(prev => prev.map(app => app.id === id ? updatedApplication : app))
      return updatedApplication
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao agendar avaliação'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const conductSocialVisit = useCallback(async (id: string, visit: any): Promise<HousingApplication> => {
    try {
      setError(null)
      const response = await apiClient.post(`/api/specialized/housing/applications/${id}/social-visit`, visit)
      const updatedApplication = response.application
      setApplications(prev => prev.map(app => app.id === id ? updatedApplication : app))
      return updatedApplication
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao realizar visita social'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const performTechnicalAnalysis = useCallback(async (id: string, analysis: any): Promise<HousingApplication> => {
    try {
      setError(null)
      const response = await apiClient.post(`/api/specialized/housing/applications/${id}/technical-analysis`, analysis)
      const updatedApplication = response.application
      setApplications(prev => prev.map(app => app.id === id ? updatedApplication : app))
      return updatedApplication
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao realizar análise técnica'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const calculateScore = useCallback(async (id: string): Promise<HousingApplication> => {
    try {
      setError(null)
      const response = await apiClient.post(`/api/specialized/housing/applications/${id}/calculate-score`, {})
      const updatedApplication = response.application
      setApplications(prev => prev.map(app => app.id === id ? updatedApplication : app))
      return updatedApplication
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao calcular pontuação'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const approveApplication = useCallback(async (id: string): Promise<HousingApplication> => {
    try {
      setError(null)
      const response = await apiClient.post(`/api/specialized/housing/applications/${id}/approve`, {})
      const updatedApplication = response.application
      setApplications(prev => prev.map(app => app.id === id ? updatedApplication : app))
      return updatedApplication
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao aprovar inscrição'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const rejectApplication = useCallback(async (id: string, reasons: string[], details: string): Promise<HousingApplication> => {
    try {
      setError(null)
      const response = await apiClient.post(`/api/specialized/housing/applications/${id}/reject`, { reasons, details })
      const updatedApplication = response.application
      setApplications(prev => prev.map(app => app.id === id ? updatedApplication : app))
      return updatedApplication
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao rejeitar inscrição'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const addToWaitingList = useCallback(async (id: string, position: number): Promise<HousingApplication> => {
    try {
      setError(null)
      const response = await apiClient.post(`/api/specialized/housing/applications/${id}/waiting-list`, { position })
      const updatedApplication = response.application
      setApplications(prev => prev.map(app => app.id === id ? updatedApplication : app))
      return updatedApplication
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao adicionar à lista de espera'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const updateWaitingListPosition = useCallback(async (id: string, newPosition: number): Promise<HousingApplication> => {
    try {
      setError(null)
      const response = await apiClient.put(`/api/specialized/housing/applications/${id}/waiting-list/position`, { position: newPosition })
      const updatedApplication = response.application
      setApplications(prev => prev.map(app => app.id === id ? updatedApplication : app))
      return updatedApplication
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar posição na lista'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const allocateUnit = useCallback(async (id: string, unitId: string): Promise<HousingApplication> => {
    try {
      setError(null)
      const response = await apiClient.post(`/api/specialized/housing/applications/${id}/allocate`, { unitId })
      const updatedApplication = response.application
      setApplications(prev => prev.map(app => app.id === id ? updatedApplication : app))
      return updatedApplication
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao alocar unidade'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const acceptAllocation = useCallback(async (id: string): Promise<HousingApplication> => {
    try {
      setError(null)
      const response = await apiClient.post(`/api/specialized/housing/applications/${id}/accept-allocation`, {})
      const updatedApplication = response.application
      setApplications(prev => prev.map(app => app.id === id ? updatedApplication : app))
      return updatedApplication
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao aceitar alocação'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const rejectAllocation = useCallback(async (id: string, reason: string): Promise<HousingApplication> => {
    try {
      setError(null)
      const response = await apiClient.post(`/api/specialized/housing/applications/${id}/reject-allocation`, { reason })
      const updatedApplication = response.application
      setApplications(prev => prev.map(app => app.id === id ? updatedApplication : app))
      return updatedApplication
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao rejeitar alocação'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const submitAppeal = useCallback(async (id: string, appeal: any): Promise<HousingApplication> => {
    try {
      setError(null)
      const response = await apiClient.post(`/api/specialized/housing/applications/${id}/appeal`, appeal)
      const updatedApplication = response.application
      setApplications(prev => prev.map(app => app.id === id ? updatedApplication : app))
      return updatedApplication
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao submeter recurso'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const processAppeal = useCallback(async (id: string, decision: any): Promise<HousingApplication> => {
    try {
      setError(null)
      const response = await apiClient.post(`/api/specialized/housing/applications/${id}/appeal/process`, decision)
      const updatedApplication = response.application
      setApplications(prev => prev.map(app => app.id === id ? updatedApplication : app))
      return updatedApplication
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao processar recurso'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const sendNotification = useCallback(async (id: string, notification: any): Promise<HousingApplication> => {
    try {
      setError(null)
      const response = await apiClient.post(`/api/specialized/housing/applications/${id}/notifications`, notification)
      const updatedApplication = response.application
      setApplications(prev => prev.map(app => app.id === id ? updatedApplication : app))
      return updatedApplication
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao enviar notificação'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const scheduleMeeting = useCallback(async (id: string, meeting: any): Promise<HousingApplication> => {
    try {
      setError(null)
      const response = await apiClient.post(`/api/specialized/housing/applications/${id}/meetings`, meeting)
      const updatedApplication = response.application
      setApplications(prev => prev.map(app => app.id === id ? updatedApplication : app))
      return updatedApplication
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao agendar reunião'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const addObservation = useCallback(async (id: string, observation: string): Promise<HousingApplication> => {
    try {
      setError(null)
      const response = await apiClient.post(`/api/specialized/housing/applications/${id}/observations`, { observation })
      const updatedApplication = response.application
      setApplications(prev => prev.map(app => app.id === id ? updatedApplication : app))
      return updatedApplication
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao adicionar observação'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const cancelApplication = useCallback(async (id: string, reason: string): Promise<HousingApplication> => {
    try {
      setError(null)
      const response = await apiClient.post(`/api/specialized/housing/applications/${id}/cancel`, { reason })
      const updatedApplication = response.application
      setApplications(prev => prev.map(app => app.id === id ? updatedApplication : app))
      return updatedApplication
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao cancelar inscrição'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const deleteApplication = useCallback(async (id: string): Promise<void> => {
    try {
      setError(null)
      await apiClient.delete(`/api/specialized/housing/applications/${id}`)
      setApplications(prev => prev.filter(app => app.id !== id))
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao excluir inscrição'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const getApplicationsByProgram = useCallback((programId: string) => applications.filter(app => app.programId === programId), [applications])
  const getApplicationsByStatus = useCallback((status: string) => applications.filter(app => app.status === status), [applications])
  const getPendingApplications = useCallback(() => applications.filter(app => ['SUBMITTED', 'UNDER_REVIEW', 'PENDING_DOCUMENTS', 'SOCIAL_VISIT', 'TECHNICAL_ANALYSIS'].includes(app.status)), [applications])
  const getApprovedApplications = useCallback(() => applications.filter(app => ['APPROVED', 'WAITING_LIST', 'ALLOCATED'].includes(app.status)), [applications])

  const refreshApplications = useCallback(async () => {
    await fetchApplications()
  }, [fetchApplications])

  useEffect(() => {
    fetchApplications()
  }, [fetchApplications])

  return {
    applications,
    loading,
    error,
    createApplication,
    updateApplication,
    updateApplicant,
    updateFamily,
    addFamilyMember,
    removeFamilyMember,
    updateCurrentHousing,
    checkEligibility,
    submitDocument,
    verifyDocument,
    submitApplication,
    scheduleEvaluation,
    conductSocialVisit,
    performTechnicalAnalysis,
    calculateScore,
    approveApplication,
    rejectApplication,
    addToWaitingList,
    updateWaitingListPosition,
    allocateUnit,
    acceptAllocation,
    rejectAllocation,
    submitAppeal,
    processAppeal,
    sendNotification,
    scheduleMeeting,
    addObservation,
    cancelApplication,
    deleteApplication,
    getApplicationsByProgram,
    getApplicationsByStatus,
    getPendingApplications,
    getApprovedApplications,
    refreshApplications
  }
}