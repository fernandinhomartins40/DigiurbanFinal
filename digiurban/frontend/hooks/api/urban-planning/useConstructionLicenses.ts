'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAdminAuth } from '@/contexts/AdminAuthContext'

export interface ConstructionLicense {
  id: string
  number: string
  type: 'CONSTRUCTION' | 'RENOVATION' | 'DEMOLITION' | 'REGULARIZATION' | 'EXPANSION' | 'CHANGE_OF_USE'
  category: 'RESIDENTIAL' | 'COMMERCIAL' | 'INDUSTRIAL' | 'INSTITUTIONAL' | 'MIXED_USE'
  applicant: {
    type: 'OWNER' | 'REPRESENTATIVE' | 'COMPANY'
    name: string
    document: string
    phone: string
    email: string
    address: string
    profession?: string
    registration?: string
  }
  property: {
    address: string
    plotNumber: string
    district: string
    zoneCode: string
    area: number
    coordinates: { lat: number; lng: number }[]
    currentUse: string
    proposedUse: string
  }
  project: {
    architect: {
      name: string
      registration: string
      phone: string
      email: string
    }
    engineer?: {
      name: string
      registration: string
      phone: string
      email: string
    }
    description: string
    buildingArea: number
    floors: number
    units: number
    parking: number
    occupancyRate: number
    floorAreaRatio: number
    setbacks: {
      front: number
      side: number
      rear: number
    }
    height: number
    structural: 'CONCRETE' | 'STEEL' | 'MASONRY' | 'WOOD' | 'MIXED'
    foundation: 'SHALLOW' | 'DEEP' | 'SPECIAL'
  }
  documents: {
    type: string
    name: string
    url: string
    submittedDate: string
    status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'REQUIRES_CORRECTION'
    reviewer?: string
    reviewDate?: string
    comments?: string
  }[]
  requirements: {
    zoning: {
      compliant: boolean
      observations?: string
    }
    environmental: {
      required: boolean
      license?: string
      status: 'NOT_REQUIRED' | 'PENDING' | 'APPROVED' | 'REJECTED'
    }
    fire: {
      required: boolean
      approval?: string
      status: 'NOT_REQUIRED' | 'PENDING' | 'APPROVED' | 'REJECTED'
    }
    health: {
      required: boolean
      approval?: string
      status: 'NOT_REQUIRED' | 'PENDING' | 'APPROVED' | 'REJECTED'
    }
    accessibility: {
      compliant: boolean
      observations?: string
    }
  }
  fees: {
    base: number
    additional: { description: string; amount: number }[]
    total: number
    paid: number
    remaining: number
    dueDate: string
    status: 'PENDING' | 'PARTIAL' | 'PAID' | 'OVERDUE'
  }
  timeline: {
    applicationDate: string
    reviewStartDate?: string
    expectedDecisionDate: string
    decisionDate?: string
    expiryDate?: string
    extensionRequests: {
      requestDate: string
      reason: string
      days: number
      status: 'PENDING' | 'APPROVED' | 'REJECTED'
    }[]
  }
  review: {
    phases: {
      name: string
      responsible: string
      startDate?: string
      endDate?: string
      status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'REJECTED'
      comments?: string[]
      requirements?: string[]
    }[]
    currentPhase?: string
    rejections: {
      date: string
      phase: string
      reasons: string[]
      corrections: string[]
    }[]
  }
  inspections: {
    id: string
    type: 'FOUNDATION' | 'STRUCTURE' | 'INSTALLATION' | 'FINAL' | 'SPECIAL'
    scheduledDate: string
    completedDate?: string
    inspector: string
    status: 'SCHEDULED' | 'COMPLETED' | 'FAILED' | 'CANCELLED'
    result?: 'APPROVED' | 'APPROVED_WITH_CONDITIONS' | 'REJECTED'
    findings?: string[]
    corrections?: string[]
    photos?: string[]
  }[]
  construction: {
    startDate?: string
    expectedEndDate?: string
    actualEndDate?: string
    progress: number
    contractor?: {
      name: string
      registration: string
      phone: string
      responsible: string
    }
    workers: number
    safety: {
      hasEquipment: boolean
      hasSignage: boolean
      hasPermit: boolean
      violations: string[]
    }
  }
  status: 'DRAFT' | 'SUBMITTED' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED' | 'EXPIRED' | 'SUSPENDED' | 'COMPLETED'
  priority: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT'
  notes: string[]
  createdAt: string
  updatedAt: string
}

export interface CreateConstructionLicenseData {
  type: 'CONSTRUCTION' | 'RENOVATION' | 'DEMOLITION' | 'REGULARIZATION' | 'EXPANSION' | 'CHANGE_OF_USE'
  category: 'RESIDENTIAL' | 'COMMERCIAL' | 'INDUSTRIAL' | 'INSTITUTIONAL' | 'MIXED_USE'
  applicant: {
    type: 'OWNER' | 'REPRESENTATIVE' | 'COMPANY'
    name: string
    document: string
    phone: string
    email: string
    address: string
  }
  property: {
    address: string
    plotNumber: string
    district: string
    zoneCode: string
    area: number
    proposedUse: string
  }
  project: {
    architect: {
      name: string
      registration: string
      phone: string
      email: string
    }
    description: string
    buildingArea: number
    floors: number
  }
}

export interface UseConstructionLicensesReturn {
  licenses: ConstructionLicense[]
  loading: boolean
  error: string | null
  createLicense: (data: CreateConstructionLicenseData) => Promise<ConstructionLicense>
  updateLicense: (id: string, data: Partial<CreateConstructionLicenseData>) => Promise<ConstructionLicense>
  submitLicense: (id: string) => Promise<ConstructionLicense>
  assignReviewer: (id: string, reviewer: string, phase: string) => Promise<ConstructionLicense>
  addReviewComment: (id: string, phase: string, comment: string) => Promise<ConstructionLicense>
  approveLicense: (id: string) => Promise<ConstructionLicense>
  rejectLicense: (id: string, reasons: string[], corrections: string[]) => Promise<ConstructionLicense>
  addDocument: (id: string, document: any) => Promise<ConstructionLicense>
  updateDocumentStatus: (id: string, documentId: string, status: string) => Promise<ConstructionLicense>
  scheduleInspection: (id: string, inspection: any) => Promise<ConstructionLicense>
  completeInspection: (id: string, inspectionId: string, result: any) => Promise<ConstructionLicense>
  updateConstructionProgress: (id: string, progress: number) => Promise<ConstructionLicense>
  addContractor: (id: string, contractor: any) => Promise<ConstructionLicense>
  requestExtension: (id: string, request: any) => Promise<ConstructionLicense>
  processPayment: (id: string, amount: number) => Promise<ConstructionLicense>
  suspendLicense: (id: string, reason: string) => Promise<ConstructionLicense>
  deleteLicense: (id: string) => Promise<void>
  getLicensesByType: (type: string) => ConstructionLicense[]
  getLicensesByStatus: (status: string) => ConstructionLicense[]
  getPendingLicenses: () => ConstructionLicense[]
  getExpiredLicenses: () => ConstructionLicense[]
  refreshLicenses: () => Promise<void>
}

export function useConstructionLicenses(): UseConstructionLicensesReturn {
  const [licenses, setLicenses] = useState<ConstructionLicense[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchLicenses = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await apiClient.get('/api/specialized/urban-planning/construction-licenses')
      setLicenses(data.licenses || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar licenças de construção')
    } finally {
      setLoading(false)
    }
  }, [])

  const createLicense = useCallback(async (data: CreateConstructionLicenseData): Promise<ConstructionLicense> => {
    try {
      setError(null)
      const response = await apiClient.post('/api/specialized/urban-planning/construction-licenses', data)
      const newLicense = response.license
      setLicenses(prev => [newLicense, ...prev])
      return newLicense
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar licença'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const updateLicense = useCallback(async (id: string, data: Partial<CreateConstructionLicenseData>): Promise<ConstructionLicense> => {
    try {
      setError(null)
      const response = await apiClient.put(`/api/specialized/urban-planning/construction-licenses/${id}`, data)
      const updatedLicense = response.license
      setLicenses(prev => prev.map(license => license.id === id ? updatedLicense : license))
      return updatedLicense
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar licença'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const submitLicense = useCallback(async (id: string): Promise<ConstructionLicense> => {
    try {
      setError(null)
      const response = await apiClient.post(`/api/specialized/urban-planning/construction-licenses/${id}/submit`, {})
      const updatedLicense = response.license
      setLicenses(prev => prev.map(license => license.id === id ? updatedLicense : license))
      return updatedLicense
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao submeter licença'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const assignReviewer = useCallback(async (id: string, reviewer: string, phase: string): Promise<ConstructionLicense> => {
    try {
      setError(null)
      const response = await apiClient.post(`/api/specialized/urban-planning/construction-licenses/${id}/assign`, { reviewer, phase })
      const updatedLicense = response.license
      setLicenses(prev => prev.map(license => license.id === id ? updatedLicense : license))
      return updatedLicense
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atribuir revisor'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const addReviewComment = useCallback(async (id: string, phase: string, comment: string): Promise<ConstructionLicense> => {
    try {
      setError(null)
      const response = await apiClient.post(`/api/specialized/urban-planning/construction-licenses/${id}/review-comment`, { phase, comment })
      const updatedLicense = response.license
      setLicenses(prev => prev.map(license => license.id === id ? updatedLicense : license))
      return updatedLicense
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao adicionar comentário'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const approveLicense = useCallback(async (id: string): Promise<ConstructionLicense> => {
    try {
      setError(null)
      const response = await apiClient.post(`/api/specialized/urban-planning/construction-licenses/${id}/approve`, {})
      const updatedLicense = response.license
      setLicenses(prev => prev.map(license => license.id === id ? updatedLicense : license))
      return updatedLicense
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao aprovar licença'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const rejectLicense = useCallback(async (id: string, reasons: string[], corrections: string[]): Promise<ConstructionLicense> => {
    try {
      setError(null)
      const response = await apiClient.post(`/api/specialized/urban-planning/construction-licenses/${id}/reject`, { reasons, corrections })
      const updatedLicense = response.license
      setLicenses(prev => prev.map(license => license.id === id ? updatedLicense : license))
      return updatedLicense
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao rejeitar licença'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const addDocument = useCallback(async (id: string, document: any): Promise<ConstructionLicense> => {
    try {
      setError(null)
      const response = await apiClient.post(`/api/specialized/urban-planning/construction-licenses/${id}/documents`, document)
      const updatedLicense = response.license
      setLicenses(prev => prev.map(license => license.id === id ? updatedLicense : license))
      return updatedLicense
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao adicionar documento'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const updateDocumentStatus = useCallback(async (id: string, documentId: string, status: string): Promise<ConstructionLicense> => {
    try {
      setError(null)
      const response = await apiClient.put(`/api/specialized/urban-planning/construction-licenses/${id}/documents/${documentId}`, { status })
      const updatedLicense = response.license
      setLicenses(prev => prev.map(license => license.id === id ? updatedLicense : license))
      return updatedLicense
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar status do documento'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const scheduleInspection = useCallback(async (id: string, inspection: any): Promise<ConstructionLicense> => {
    try {
      setError(null)
      const response = await apiClient.post(`/api/specialized/urban-planning/construction-licenses/${id}/inspections`, inspection)
      const updatedLicense = response.license
      setLicenses(prev => prev.map(license => license.id === id ? updatedLicense : license))
      return updatedLicense
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao agendar inspeção'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const completeInspection = useCallback(async (id: string, inspectionId: string, result: any): Promise<ConstructionLicense> => {
    try {
      setError(null)
      const response = await apiClient.put(`/api/specialized/urban-planning/construction-licenses/${id}/inspections/${inspectionId}`, result)
      const updatedLicense = response.license
      setLicenses(prev => prev.map(license => license.id === id ? updatedLicense : license))
      return updatedLicense
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao completar inspeção'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const updateConstructionProgress = useCallback(async (id: string, progress: number): Promise<ConstructionLicense> => {
    try {
      setError(null)
      const response = await apiClient.put(`/api/specialized/urban-planning/construction-licenses/${id}/progress`, { progress })
      const updatedLicense = response.license
      setLicenses(prev => prev.map(license => license.id === id ? updatedLicense : license))
      return updatedLicense
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar progresso'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const addContractor = useCallback(async (id: string, contractor: any): Promise<ConstructionLicense> => {
    try {
      setError(null)
      const response = await apiClient.post(`/api/specialized/urban-planning/construction-licenses/${id}/contractor`, contractor)
      const updatedLicense = response.license
      setLicenses(prev => prev.map(license => license.id === id ? updatedLicense : license))
      return updatedLicense
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao adicionar empreiteira'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const requestExtension = useCallback(async (id: string, request: any): Promise<ConstructionLicense> => {
    try {
      setError(null)
      const response = await apiClient.post(`/api/specialized/urban-planning/construction-licenses/${id}/extension`, request)
      const updatedLicense = response.license
      setLicenses(prev => prev.map(license => license.id === id ? updatedLicense : license))
      return updatedLicense
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao solicitar prorrogação'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const processPayment = useCallback(async (id: string, amount: number): Promise<ConstructionLicense> => {
    try {
      setError(null)
      const response = await apiClient.post(`/api/specialized/urban-planning/construction-licenses/${id}/payment`, { amount })
      const updatedLicense = response.license
      setLicenses(prev => prev.map(license => license.id === id ? updatedLicense : license))
      return updatedLicense
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao processar pagamento'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const suspendLicense = useCallback(async (id: string, reason: string): Promise<ConstructionLicense> => {
    try {
      setError(null)
      const response = await apiClient.post(`/api/specialized/urban-planning/construction-licenses/${id}/suspend`, { reason })
      const updatedLicense = response.license
      setLicenses(prev => prev.map(license => license.id === id ? updatedLicense : license))
      return updatedLicense
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao suspender licença'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const deleteLicense = useCallback(async (id: string): Promise<void> => {
    try {
      setError(null)
      await apiClient.delete(`/api/specialized/urban-planning/construction-licenses/${id}`)
      setLicenses(prev => prev.filter(license => license.id !== id))
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao excluir licença'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const getLicensesByType = useCallback((type: string) => licenses.filter(license => license.type === type), [licenses])
  const getLicensesByStatus = useCallback((status: string) => licenses.filter(license => license.status === status), [licenses])
  const getPendingLicenses = useCallback(() => licenses.filter(license => license.status === 'UNDER_REVIEW'), [licenses])
  const getExpiredLicenses = useCallback(() => {
    const today = new Date()
    return licenses.filter(license =>
      license.timeline.expiryDate &&
      new Date(license.timeline.expiryDate) < today &&
      license.status !== 'COMPLETED'
    )
  }, [licenses])

  const refreshLicenses = useCallback(async () => {
    await fetchLicenses()
  }, [fetchLicenses])

  useEffect(() => {
    fetchLicenses()
  }, [fetchLicenses])

  return {
    licenses,
    loading,
    error,
    createLicense,
    updateLicense,
    submitLicense,
    assignReviewer,
    addReviewComment,
    approveLicense,
    rejectLicense,
    addDocument,
    updateDocumentStatus,
    scheduleInspection,
    completeInspection,
    updateConstructionProgress,
    addContractor,
    requestExtension,
    processPayment,
    suspendLicense,
    deleteLicense,
    getLicensesByType,
    getLicensesByStatus,
    getPendingLicenses,
    getExpiredLicenses,
    refreshLicenses
  }
}