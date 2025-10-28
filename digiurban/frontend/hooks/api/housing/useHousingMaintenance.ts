'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAdminAuth } from '@/contexts/AdminAuthContext'

interface HousingMaintenance {
  id: string
  requestNumber: string
  type: 'PREVENTIVE' | 'CORRECTIVE' | 'EMERGENCY' | 'IMPROVEMENT' | 'INSPECTION'
  category: 'STRUCTURAL' | 'ELECTRICAL' | 'PLUMBING' | 'HVAC' | 'ROOFING' | 'PAINTING' | 'LANDSCAPING' | 'GENERAL'
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT' | 'EMERGENCY'
  unitInfo: {
    unitId: string
    unitNumber: string
    address: string
    district: string
    programId: string
    programName: string
    beneficiaryId?: string
    beneficiaryName?: string
    beneficiaryPhone?: string
  }
  request: {
    requestedBy: {
      type: 'BENEFICIARY' | 'SOCIAL_WORKER' | 'INSPECTOR' | 'MANAGER' | 'CONTRACTOR'
      name: string
      phone: string
      email?: string
    }
    requestDate: string
    description: string
    urgencyReason?: string
    photos?: {
      url: string
      description: string
      date: string
    }[]
    additionalInfo?: string
  }
  assessment: {
    inspectionDate?: string
    inspector?: {
      name: string
      registration: string
      phone: string
      email: string
    }
    findings: string[]
    recommendations: string[]
    estimatedCost: number
    estimatedDuration: number
    materials: {
      item: string
      quantity: number
      unit: string
      unitCost: number
      totalCost: number
    }[]
    labor: {
      type: string
      hours: number
      rate: number
      cost: number
    }[]
    totalEstimate: number
  }
  approval: {
    required: boolean
    requestedDate?: string
    approvedBy?: string
    approvalDate?: string
    status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'NOT_REQUIRED'
    comments?: string
    budgetApproved: number
    conditions?: string[]
  }
  assignment: {
    contractor: {
      id: string
      name: string
      registration: string
      phone: string
      email: string
      specialties: string[]
      rating: number
    }
    assignmentDate: string
    scheduledStartDate: string
    estimatedEndDate: string
    contractValue: number
    workOrder: string
    terms: string[]
  }
  execution: {
    startDate?: string
    endDate?: string
    status: 'NOT_STARTED' | 'IN_PROGRESS' | 'ON_HOLD' | 'COMPLETED' | 'CANCELLED'
    progress: number
    dailyReports: {
      date: string
      workPerformed: string[]
      materialsUsed: { item: string; quantity: number }[]
      issues: string[]
      photos?: string[]
      workerPresent: number
      hoursWorked: number
    }[]
    qualityChecks: {
      date: string
      inspector: string
      criteria: { item: string; status: 'PASS' | 'FAIL' | 'NEEDS_IMPROVEMENT' }[]
      overallRating: number
      observations: string[]
    }[]
  }
  completion: {
    completionDate?: string
    finalInspection: {
      date?: string
      inspector?: string
      approved: boolean
      deficiencies: string[]
      recommendations: string[]
      certificateIssued: boolean
    }
    warranty: {
      period: number
      startDate?: string
      endDate?: string
      coverage: string[]
      contractor: string
    }
    beneficiarySatisfaction: {
      rating?: number
      feedback?: string
      complaints?: string[]
      date?: string
    }
  }
  financial: {
    budgetApproved: number
    actualCost: number
    variance: number
    payments: {
      date: string
      amount: number
      description: string
      method: string
      status: 'PENDING' | 'PAID' | 'OVERDUE'
    }[]
    totalPaid: number
    balance: number
  }
  communication: {
    notifications: {
      date: string
      recipient: string
      type: 'EMAIL' | 'SMS' | 'PHONE' | 'LETTER'
      message: string
      status: 'SENT' | 'DELIVERED' | 'READ'
    }[]
    meetings: {
      date: string
      participants: string[]
      purpose: string
      decisions: string[]
      nextSteps: string[]
    }[]
  }
  followUp: {
    postCompletionVisits: {
      date: string
      visitor: string
      purpose: string
      findings: string[]
      issues?: string[]
      beneficiarySatisfaction?: number
    }[]
    warrantyRequests: {
      date: string
      issue: string
      status: 'PENDING' | 'APPROVED' | 'COMPLETED' | 'REJECTED'
      response?: string
    }[]
  }
  documents: {
    type: string
    name: string
    url: string
    uploadDate: string
    uploadedBy: string
  }[]
  timeline: {
    events: {
      date: string
      event: string
      responsible: string
      details?: string
    }[]
  }
  status: 'REQUESTED' | 'UNDER_ASSESSMENT' | 'PENDING_APPROVAL' | 'APPROVED' | 'ASSIGNED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'ON_HOLD'
  createdAt: string
  updatedAt: string
}

interface CreateHousingMaintenanceData {
  type: 'PREVENTIVE' | 'CORRECTIVE' | 'EMERGENCY' | 'IMPROVEMENT' | 'INSPECTION'
  category: 'STRUCTURAL' | 'ELECTRICAL' | 'PLUMBING' | 'HVAC' | 'ROOFING' | 'PAINTING' | 'LANDSCAPING' | 'GENERAL'
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT' | 'EMERGENCY'
  unitId: string
  request: {
    requestedBy: {
      type: 'BENEFICIARY' | 'SOCIAL_WORKER' | 'INSPECTOR' | 'MANAGER' | 'CONTRACTOR'
      name: string
      phone: string
    }
    description: string
  }
}

interface UseHousingMaintenanceReturn {
  maintenanceRequests: HousingMaintenance[]
  loading: boolean
  error: string | null
  createMaintenanceRequest: (data: CreateHousingMaintenanceData) => Promise<HousingMaintenance>
  updateMaintenanceRequest: (id: string, data: Partial<CreateHousingMaintenanceData>) => Promise<HousingMaintenance>
  addPhotos: (id: string, photos: any[]) => Promise<HousingMaintenance>
  scheduleAssessment: (id: string, inspection: any) => Promise<HousingMaintenance>
  performAssessment: (id: string, assessment: any) => Promise<HousingMaintenance>
  updateEstimate: (id: string, estimate: any) => Promise<HousingMaintenance>
  requestApproval: (id: string) => Promise<HousingMaintenance>
  approveRequest: (id: string, approval: any) => Promise<HousingMaintenance>
  rejectRequest: (id: string, reason: string) => Promise<HousingMaintenance>
  assignContractor: (id: string, contractor: any) => Promise<HousingMaintenance>
  startWork: (id: string) => Promise<HousingMaintenance>
  updateProgress: (id: string, progress: number) => Promise<HousingMaintenance>
  addDailyReport: (id: string, report: any) => Promise<HousingMaintenance>
  performQualityCheck: (id: string, qualityCheck: any) => Promise<HousingMaintenance>
  completeWork: (id: string) => Promise<HousingMaintenance>
  performFinalInspection: (id: string, inspection: any) => Promise<HousingMaintenance>
  issueCertificate: (id: string) => Promise<HousingMaintenance>
  recordSatisfaction: (id: string, satisfaction: any) => Promise<HousingMaintenance>
  addPayment: (id: string, payment: any) => Promise<HousingMaintenance>
  sendNotification: (id: string, notification: any) => Promise<HousingMaintenance>
  scheduleMeeting: (id: string, meeting: any) => Promise<HousingMaintenance>
  addFollowUpVisit: (id: string, visit: any) => Promise<HousingMaintenance>
  submitWarrantyRequest: (id: string, warrantyRequest: any) => Promise<HousingMaintenance>
  addDocument: (id: string, document: any) => Promise<HousingMaintenance>
  holdRequest: (id: string, reason: string) => Promise<HousingMaintenance>
  cancelRequest: (id: string, reason: string) => Promise<HousingMaintenance>
  deleteMaintenanceRequest: (id: string) => Promise<void>
  getRequestsByUnit: (unitId: string) => HousingMaintenance[]
  getRequestsByStatus: (status: string) => HousingMaintenance[]
  getRequestsByPriority: (priority: string) => HousingMaintenance[]
  getRequestsByContractor: (contractorId: string) => HousingMaintenance[]
  getPendingRequests: () => HousingMaintenance[]
  getOverdueRequests: () => HousingMaintenance[]
  refreshMaintenanceRequests: () => Promise<void>
}

export function useHousingMaintenance(): UseHousingMaintenanceReturn {
  const [maintenanceRequests, setMaintenanceRequests] = useState<HousingMaintenance[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchMaintenanceRequests = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await apiClient.get('/api/secretarias/housing/maintenance')
      setMaintenanceRequests(data.requests || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar solicitações de manutenção')
    } finally {
      setLoading(false)
    }
  }, [])

  const createMaintenanceRequest = useCallback(async (data: CreateHousingMaintenanceData): Promise<HousingMaintenance> => {
    try {
      setError(null)
      const response = await apiClient.post('/api/secretarias/housing/maintenance', data)
      const newRequest = response.request
      setMaintenanceRequests(prev => [newRequest, ...prev])
      return newRequest
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar solicitação de manutenção'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const updateMaintenanceRequest = useCallback(async (id: string, data: Partial<CreateHousingMaintenanceData>): Promise<HousingMaintenance> => {
    try {
      setError(null)
      const response = await apiClient.put(`/api/secretarias/housing/maintenance/${id}`, data)
      const updatedRequest = response.request
      setMaintenanceRequests(prev => prev.map(req => req.id === id ? updatedRequest : req))
      return updatedRequest
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar solicitação'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const addPhotos = useCallback(async (id: string, photos: any[]): Promise<HousingMaintenance> => {
    try {
      setError(null)
      const response = await apiClient.post(`/api/secretarias/housing/maintenance/${id}/photos`, { photos })
      const updatedRequest = response.request
      setMaintenanceRequests(prev => prev.map(req => req.id === id ? updatedRequest : req))
      return updatedRequest
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao adicionar fotos'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const scheduleAssessment = useCallback(async (id: string, inspection: any): Promise<HousingMaintenance> => {
    try {
      setError(null)
      const response = await apiClient.post(`/api/secretarias/housing/maintenance/${id}/schedule-assessment`, inspection)
      const updatedRequest = response.request
      setMaintenanceRequests(prev => prev.map(req => req.id === id ? updatedRequest : req))
      return updatedRequest
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao agendar avaliação'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const performAssessment = useCallback(async (id: string, assessment: any): Promise<HousingMaintenance> => {
    try {
      setError(null)
      const response = await apiClient.post(`/api/secretarias/housing/maintenance/${id}/assessment`, assessment)
      const updatedRequest = response.request
      setMaintenanceRequests(prev => prev.map(req => req.id === id ? updatedRequest : req))
      return updatedRequest
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao realizar avaliação'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const updateEstimate = useCallback(async (id: string, estimate: any): Promise<HousingMaintenance> => {
    try {
      setError(null)
      const response = await apiClient.put(`/api/secretarias/housing/maintenance/${id}/estimate`, estimate)
      const updatedRequest = response.request
      setMaintenanceRequests(prev => prev.map(req => req.id === id ? updatedRequest : req))
      return updatedRequest
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar orçamento'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const requestApproval = useCallback(async (id: string): Promise<HousingMaintenance> => {
    try {
      setError(null)
      const response = await apiClient.post(`/api/secretarias/housing/maintenance/${id}/request-approval`)
      const updatedRequest = response.request
      setMaintenanceRequests(prev => prev.map(req => req.id === id ? updatedRequest : req))
      return updatedRequest
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao solicitar aprovação'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const approveRequest = useCallback(async (id: string, approval: any): Promise<HousingMaintenance> => {
    try {
      setError(null)
      const response = await apiClient.post(`/api/secretarias/housing/maintenance/${id}/approve`, approval)
      const updatedRequest = response.request
      setMaintenanceRequests(prev => prev.map(req => req.id === id ? updatedRequest : req))
      return updatedRequest
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao aprovar solicitação'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const rejectRequest = useCallback(async (id: string, reason: string): Promise<HousingMaintenance> => {
    try {
      setError(null)
      const response = await apiClient.post(`/api/secretarias/housing/maintenance/${id}/reject`, { reason })
      const updatedRequest = response.request
      setMaintenanceRequests(prev => prev.map(req => req.id === id ? updatedRequest : req))
      return updatedRequest
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao rejeitar solicitação'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const assignContractor = useCallback(async (id: string, contractor: any): Promise<HousingMaintenance> => {
    try {
      setError(null)
      const response = await apiClient.post(`/api/secretarias/housing/maintenance/${id}/assign`, contractor)
      const updatedRequest = response.request
      setMaintenanceRequests(prev => prev.map(req => req.id === id ? updatedRequest : req))
      return updatedRequest
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atribuir contratada'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const startWork = useCallback(async (id: string): Promise<HousingMaintenance> => {
    try {
      setError(null)
      const response = await apiClient.post(`/api/secretarias/housing/maintenance/${id}/start`)
      const updatedRequest = response.request
      setMaintenanceRequests(prev => prev.map(req => req.id === id ? updatedRequest : req))
      return updatedRequest
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao iniciar trabalho'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const updateProgress = useCallback(async (id: string, progress: number): Promise<HousingMaintenance> => {
    try {
      setError(null)
      const response = await apiClient.put(`/api/secretarias/housing/maintenance/${id}/progress`, { progress })
      const updatedRequest = response.request
      setMaintenanceRequests(prev => prev.map(req => req.id === id ? updatedRequest : req))
      return updatedRequest
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar progresso'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const addDailyReport = useCallback(async (id: string, report: any): Promise<HousingMaintenance> => {
    try {
      setError(null)
      const response = await apiClient.post(`/api/secretarias/housing/maintenance/${id}/daily-reports`, report)
      const updatedRequest = response.request
      setMaintenanceRequests(prev => prev.map(req => req.id === id ? updatedRequest : req))
      return updatedRequest
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao adicionar relatório diário'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const performQualityCheck = useCallback(async (id: string, qualityCheck: any): Promise<HousingMaintenance> => {
    try {
      setError(null)
      const response = await apiClient.post(`/api/secretarias/housing/maintenance/${id}/quality-checks`, qualityCheck)
      const updatedRequest = response.request
      setMaintenanceRequests(prev => prev.map(req => req.id === id ? updatedRequest : req))
      return updatedRequest
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao realizar verificação de qualidade'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const completeWork = useCallback(async (id: string): Promise<HousingMaintenance> => {
    try {
      setError(null)
      const response = await apiClient.post(`/api/secretarias/housing/maintenance/${id}/complete`)
      const updatedRequest = response.request
      setMaintenanceRequests(prev => prev.map(req => req.id === id ? updatedRequest : req))
      return updatedRequest
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao completar trabalho'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const performFinalInspection = useCallback(async (id: string, inspection: any): Promise<HousingMaintenance> => {
    try {
      setError(null)
      const response = await apiClient.post(`/api/secretarias/housing/maintenance/${id}/final-inspection`, inspection)
      const updatedRequest = response.request
      setMaintenanceRequests(prev => prev.map(req => req.id === id ? updatedRequest : req))
      return updatedRequest
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao realizar inspeção final'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const issueCertificate = useCallback(async (id: string): Promise<HousingMaintenance> => {
    try {
      setError(null)
      const response = await apiClient.post(`/api/secretarias/housing/maintenance/${id}/issue-certificate`)
      const updatedRequest = response.request
      setMaintenanceRequests(prev => prev.map(req => req.id === id ? updatedRequest : req))
      return updatedRequest
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao emitir certificado'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const recordSatisfaction = useCallback(async (id: string, satisfaction: any): Promise<HousingMaintenance> => {
    try {
      setError(null)
      const response = await apiClient.post(`/api/secretarias/housing/maintenance/${id}/satisfaction`, satisfaction)
      const updatedRequest = response.request
      setMaintenanceRequests(prev => prev.map(req => req.id === id ? updatedRequest : req))
      return updatedRequest
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao registrar satisfação'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const addPayment = useCallback(async (id: string, payment: any): Promise<HousingMaintenance> => {
    try {
      setError(null)
      const response = await apiClient.post(`/api/secretarias/housing/maintenance/${id}/payments`, payment)
      const updatedRequest = response.request
      setMaintenanceRequests(prev => prev.map(req => req.id === id ? updatedRequest : req))
      return updatedRequest
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao adicionar pagamento'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const sendNotification = useCallback(async (id: string, notification: any): Promise<HousingMaintenance> => {
    try {
      setError(null)
      const response = await apiClient.post(`/api/secretarias/housing/maintenance/${id}/notifications`, notification)
      const updatedRequest = response.request
      setMaintenanceRequests(prev => prev.map(req => req.id === id ? updatedRequest : req))
      return updatedRequest
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao enviar notificação'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const scheduleMeeting = useCallback(async (id: string, meeting: any): Promise<HousingMaintenance> => {
    try {
      setError(null)
      const response = await apiClient.post(`/api/secretarias/housing/maintenance/${id}/meetings`, meeting)
      const updatedRequest = response.request
      setMaintenanceRequests(prev => prev.map(req => req.id === id ? updatedRequest : req))
      return updatedRequest
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao agendar reunião'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const addFollowUpVisit = useCallback(async (id: string, visit: any): Promise<HousingMaintenance> => {
    try {
      setError(null)
      const response = await apiClient.post(`/api/secretarias/housing/maintenance/${id}/follow-up-visits`, visit)
      const updatedRequest = response.request
      setMaintenanceRequests(prev => prev.map(req => req.id === id ? updatedRequest : req))
      return updatedRequest
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao adicionar visita de acompanhamento'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const submitWarrantyRequest = useCallback(async (id: string, warrantyRequest: any): Promise<HousingMaintenance> => {
    try {
      setError(null)
      const response = await apiClient.post(`/api/secretarias/housing/maintenance/${id}/warranty-requests`, warrantyRequest)
      const updatedRequest = response.request
      setMaintenanceRequests(prev => prev.map(req => req.id === id ? updatedRequest : req))
      return updatedRequest
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao submeter solicitação de garantia'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const addDocument = useCallback(async (id: string, document: any): Promise<HousingMaintenance> => {
    try {
      setError(null)
      const response = await apiClient.post(`/api/secretarias/housing/maintenance/${id}/documents`, document)
      const updatedRequest = response.request
      setMaintenanceRequests(prev => prev.map(req => req.id === id ? updatedRequest : req))
      return updatedRequest
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao adicionar documento'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const holdRequest = useCallback(async (id: string, reason: string): Promise<HousingMaintenance> => {
    try {
      setError(null)
      const response = await apiClient.post(`/api/secretarias/housing/maintenance/${id}/hold`, { reason })
      const updatedRequest = response.request
      setMaintenanceRequests(prev => prev.map(req => req.id === id ? updatedRequest : req))
      return updatedRequest
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao suspender solicitação'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const cancelRequest = useCallback(async (id: string, reason: string): Promise<HousingMaintenance> => {
    try {
      setError(null)
      const response = await apiClient.post(`/api/secretarias/housing/maintenance/${id}/cancel`, { reason })
      const updatedRequest = response.request
      setMaintenanceRequests(prev => prev.map(req => req.id === id ? updatedRequest : req))
      return updatedRequest
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao cancelar solicitação'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const deleteMaintenanceRequest = useCallback(async (id: string): Promise<void> => {
    try {
      setError(null)
      await apiClient.delete(`/api/secretarias/housing/maintenance/${id}`)
      setMaintenanceRequests(prev => prev.filter(req => req.id !== id))
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao excluir solicitação'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const getRequestsByUnit = useCallback((unitId: string) => maintenanceRequests.filter(req => req.unitInfo.unitId === unitId), [maintenanceRequests])
  const getRequestsByStatus = useCallback((status: string) => maintenanceRequests.filter(req => req.status === status), [maintenanceRequests])
  const getRequestsByPriority = useCallback((priority: string) => maintenanceRequests.filter(req => req.priority === priority), [maintenanceRequests])
  const getRequestsByContractor = useCallback((contractorId: string) => maintenanceRequests.filter(req => req.assignment?.contractor.id === contractorId), [maintenanceRequests])
  const getPendingRequests = useCallback(() => maintenanceRequests.filter(req => ['REQUESTED', 'UNDER_ASSESSMENT', 'PENDING_APPROVAL'].includes(req.status)), [maintenanceRequests])
  const getOverdueRequests = useCallback(() => {
    const today = new Date()
    return maintenanceRequests.filter(req => {
      if (req.assignment?.estimatedEndDate) {
        const endDate = new Date(req.assignment.estimatedEndDate)
        return endDate < today && req.status !== 'COMPLETED'
      }
      return false
    })
  }, [maintenanceRequests])

  const refreshMaintenanceRequests = useCallback(async () => {
    await fetchMaintenanceRequests()
  }, [fetchMaintenanceRequests])

  useEffect(() => {
    fetchMaintenanceRequests()
  }, [fetchMaintenanceRequests])

  return {
    maintenanceRequests,
    loading,
    error,
    createMaintenanceRequest,
    updateMaintenanceRequest,
    addPhotos,
    scheduleAssessment,
    performAssessment,
    updateEstimate,
    requestApproval,
    approveRequest,
    rejectRequest,
    assignContractor,
    startWork,
    updateProgress,
    addDailyReport,
    performQualityCheck,
    completeWork,
    performFinalInspection,
    issueCertificate,
    recordSatisfaction,
    addPayment,
    sendNotification,
    scheduleMeeting,
    addFollowUpVisit,
    submitWarrantyRequest,
    addDocument,
    holdRequest,
    cancelRequest,
    deleteMaintenanceRequest,
    getRequestsByUnit,
    getRequestsByStatus,
    getRequestsByPriority,
    getRequestsByContractor,
    getPendingRequests,
    getOverdueRequests,
    refreshMaintenanceRequests
  }
}