import { useState, useEffect, useCallback } from 'react'
import { apiClient } from '@/lib/api-client'

export interface PublicWorksContract {
  id: string
  number: string
  projectId: string
  projectName: string
  type: 'CONSTRUCTION' | 'RENOVATION' | 'MAINTENANCE' | 'CONSULTING' | 'SUPPLY' | 'SERVICES'
  status: 'DRAFT' | 'BIDDING' | 'AWARDED' | 'SIGNED' | 'ACTIVE' | 'SUSPENDED' | 'COMPLETED' | 'TERMINATED' | 'CANCELLED'
  biddingProcess: {
    modality: 'CONCORRENCIA' | 'TOMADA_PRECOS' | 'CONVITE' | 'CONCURSO' | 'LEILAO' | 'PREGAO' | 'DISPENSA' | 'INEXIGIBILIDADE'
    number: string
    openingDate: string
    participantCount: number
    winningBidValue: number
  }
  contractor: {
    id: string
    name: string
    cnpj: string
    email: string
    phone: string
    address: {
      street: string
      number: string
      complement?: string
      neighborhood: string
      city: string
      state: string
      cep: string
    }
    legalRepresentative: {
      name: string
      cpf: string
      position: string
    }
    technicalResponsible?: {
      name: string
      crea: string
      email: string
      phone: string
    }
  }
  financials: {
    contractValue: number
    currency: string
    paymentTerms: string
    amendments: Array<{
      id: string
      type: 'VALUE_INCREASE' | 'VALUE_DECREASE' | 'DEADLINE_EXTENSION' | 'SCOPE_CHANGE'
      date: string
      description: string
      previousValue?: number
      newValue?: number
      previousDeadline?: string
      newDeadline?: string
      justification: string
      approvedBy: string
    }>
    payments: Array<{
      id: string
      installment: number
      description: string
      dueDate: string
      amount: number
      paidDate?: string
      paidAmount?: number
      status: 'PENDING' | 'PAID' | 'OVERDUE' | 'CANCELLED'
      invoiceNumber?: string
    }>
    totalPaid: number
    pendingAmount: number
  }
  timeline: {
    signatureDate: string
    startDate: string
    originalEndDate: string
    currentEndDate: string
    completionDate?: string
    duration: number
    extensions: number
  }
  scope: {
    description: string
    deliverables: string[]
    specifications: string[]
    workItems: Array<{
      id: string
      description: string
      unit: string
      quantity: number
      unitPrice: number
      totalPrice: number
      completed: number
      percentage: number
    }>
  }
  performance: {
    overallProgress: number
    qualityScore?: number
    timePerformance: 'ON_TIME' | 'DELAYED' | 'AHEAD'
    budgetPerformance: 'ON_BUDGET' | 'OVER_BUDGET' | 'UNDER_BUDGET'
    lastEvaluationDate?: string
    evaluations: Array<{
      id: string
      date: string
      evaluator: string
      technicalScore: number
      timeScore: number
      qualityScore: number
      overallScore: number
      comments: string
    }>
  }
  guarantees: Array<{
    id: string
    type: 'PERFORMANCE' | 'ADVANCE_PAYMENT' | 'WARRANTY' | 'BID_BOND'
    value: number
    provider: string
    startDate: string
    endDate: string
    status: 'ACTIVE' | 'EXPIRED' | 'CLAIMED' | 'RETURNED'
    documentUrl?: string
  }>
  documents: Array<{
    id: string
    name: string
    type: 'CONTRACT' | 'AMENDMENT' | 'INVOICE' | 'RECEIPT' | 'TECHNICAL_REPORT' | 'MEASUREMENT' | 'OTHER'
    url: string
    uploadDate: string
    size: number
    uploadedBy: string
  }>
  inspections: Array<{
    id: string
    date: string
    inspector: string
    type: 'ROUTINE' | 'QUALITY' | 'SAFETY' | 'ENVIRONMENTAL' | 'FINAL'
    findings: string[]
    nonConformities: string[]
    correctedNonConformities: string[]
    overallAssessment: 'SATISFACTORY' | 'NEEDS_IMPROVEMENT' | 'UNSATISFACTORY'
    nextInspectionDate?: string
  }>
  createdAt: string
  updatedAt: string
  createdBy: string
  lastModifiedBy: string
}

export interface CreatePublicWorksContractData {
  number: string
  projectId: string
  type: 'CONSTRUCTION' | 'RENOVATION' | 'MAINTENANCE' | 'CONSULTING' | 'SUPPLY' | 'SERVICES'
  biddingProcess: {
    modality: 'CONCORRENCIA' | 'TOMADA_PRECOS' | 'CONVITE' | 'CONCURSO' | 'LEILAO' | 'PREGAO' | 'DISPENSA' | 'INEXIGIBILIDADE'
    number: string
    openingDate: string
    participantCount: number
    winningBidValue: number
  }
  contractorId: string
  contractValue: number
  paymentTerms: string
  signatureDate: string
  startDate: string
  endDate: string
  scope: {
    description: string
    deliverables: string[]
    specifications: string[]
    workItems: Array<{
      description: string
      unit: string
      quantity: number
      unitPrice: number
    }>
  }
  guarantees?: Array<{
    type: 'PERFORMANCE' | 'ADVANCE_PAYMENT' | 'WARRANTY' | 'BID_BOND'
    value: number
    provider: string
    startDate: string
    endDate: string
  }>
}

export interface PublicWorksContractFilters {
  type?: string
  status?: string
  contractorId?: string
  projectId?: string
  valueMin?: number
  valueMax?: number
  startDate?: string
  endDate?: string
  inspector?: string
}

export function usePublicWorksContracts() {
  const [contracts, setContracts] = useState<PublicWorksContract[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchContracts = useCallback(async (filters?: PublicWorksContractFilters) => {
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
      const response = await apiClient.get(`/public-works/contracts?${params}`)
      setContracts(response.data.data || [])
    } catch (err) {
      setError('Erro ao carregar contratos de obras públicas')
      console.error('Error fetching public works contracts:', err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const createContract = useCallback(async (data: CreatePublicWorksContractData) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await apiClient.post('/public-works/contracts', data)
      const newContract = response.data.data
      setContracts(prev => [newContract, ...prev])
      return newContract
    } catch (err) {
      setError('Erro ao criar contrato de obra pública')
      console.error('Error creating public works contract:', err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const updateContract = useCallback(async (id: string, data: Partial<CreatePublicWorksContractData>) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await apiClient.put(`/public-works/contracts/${id}`, data)
      const updatedContract = response.data.data
      setContracts(prev => prev.map(contract => contract.id === id ? updatedContract : contract))
      return updatedContract
    } catch (err) {
      setError('Erro ao atualizar contrato de obra pública')
      console.error('Error updating public works contract:', err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const deleteContract = useCallback(async (id: string) => {
    setIsLoading(true)
    setError(null)
    try {
      await apiClient.delete(`/public-works/contracts/${id}`)
      setContracts(prev => prev.filter(contract => contract.id !== id))
    } catch (err) {
      setError('Erro ao excluir contrato de obra pública')
      console.error('Error deleting public works contract:', err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const signContract = useCallback(async (id: string, signatureData: {
    signatureDate: string
    signedDocumentUrl: string
    witnesses?: string[]
  }) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await apiClient.post(`/public-works/contracts/${id}/sign`, signatureData)
      const updatedContract = response.data.data
      setContracts(prev => prev.map(contract => contract.id === id ? updatedContract : contract))
      return updatedContract
    } catch (err) {
      setError('Erro ao assinar contrato')
      console.error('Error signing contract:', err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const addAmendment = useCallback(async (id: string, amendmentData: {
    type: 'VALUE_INCREASE' | 'VALUE_DECREASE' | 'DEADLINE_EXTENSION' | 'SCOPE_CHANGE'
    description: string
    previousValue?: number
    newValue?: number
    previousDeadline?: string
    newDeadline?: string
    justification: string
  }) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await apiClient.post(`/public-works/contracts/${id}/amendments`, amendmentData)
      const updatedContract = response.data.data
      setContracts(prev => prev.map(contract => contract.id === id ? updatedContract : contract))
      return updatedContract
    } catch (err) {
      setError('Erro ao adicionar aditivo ao contrato')
      console.error('Error adding contract amendment:', err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const recordPayment = useCallback(async (id: string, paymentData: {
    installment: number
    amount: number
    paidDate: string
    invoiceNumber: string
    notes?: string
  }) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await apiClient.post(`/public-works/contracts/${id}/payments`, paymentData)
      const updatedContract = response.data.data
      setContracts(prev => prev.map(contract => contract.id === id ? updatedContract : contract))
      return updatedContract
    } catch (err) {
      setError('Erro ao registrar pagamento')
      console.error('Error recording payment:', err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const addInspection = useCallback(async (id: string, inspectionData: {
    inspector: string
    type: 'ROUTINE' | 'QUALITY' | 'SAFETY' | 'ENVIRONMENTAL' | 'FINAL'
    findings: string[]
    nonConformities: string[]
    overallAssessment: 'SATISFACTORY' | 'NEEDS_IMPROVEMENT' | 'UNSATISFACTORY'
    nextInspectionDate?: string
    photos?: File[]
  }) => {
    setIsLoading(true)
    setError(null)
    try {
      const formData = new FormData()
      Object.entries(inspectionData).forEach(([key, value]) => {
        if (key === 'photos' && Array.isArray(value)) {
          value.forEach((file, index) => {
            formData.append(`photos[${index}]`, file)
          })
        } else if (Array.isArray(value)) {
          formData.append(key, JSON.stringify(value))
        } else if (value !== undefined) {
          formData.append(key, value.toString())
        }
      })

      const response = await apiClient.post(`/public-works/contracts/${id}/inspections`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      const updatedContract = response.data.data
      setContracts(prev => prev.map(contract => contract.id === id ? updatedContract : contract))
      return updatedContract
    } catch (err) {
      setError('Erro ao registrar vistoria')
      console.error('Error adding inspection:', err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const updateProgress = useCallback(async (id: string, progressData: {
    overallProgress: number
    workItemsProgress?: Array<{
      workItemId: string
      completed: number
    }>
    notes?: string
  }) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await apiClient.post(`/public-works/contracts/${id}/progress`, progressData)
      const updatedContract = response.data.data
      setContracts(prev => prev.map(contract => contract.id === id ? updatedContract : contract))
      return updatedContract
    } catch (err) {
      setError('Erro ao atualizar progresso do contrato')
      console.error('Error updating contract progress:', err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const getContractById = useCallback((id: string) => {
    return contracts.find(contract => contract.id === id)
  }, [contracts])

  const getContractsByStatus = useCallback((status: string) => {
    return contracts.filter(contract => contract.status === status)
  }, [contracts])

  const getContractsByContractor = useCallback((contractorId: string) => {
    return contracts.filter(contract => contract.contractor.id === contractorId)
  }, [contracts])

  const getActiveContracts = useCallback(() => {
    return contracts.filter(contract =>
      ['SIGNED', 'ACTIVE'].includes(contract.status)
    )
  }, [contracts])

  const getOverdueContracts = useCallback(() => {
    const today = new Date().toISOString().split('T')[0]
    return contracts.filter(contract =>
      contract.timeline.currentEndDate < today &&
      !['COMPLETED', 'TERMINATED', 'CANCELLED'].includes(contract.status)
    )
  }, [contracts])

  const getContractsNearExpiry = useCallback((days: number = 30) => {
    const futureDate = new Date()
    futureDate.setDate(futureDate.getDate() + days)
    const futureDateStr = futureDate.toISOString().split('T')[0]

    return contracts.filter(contract =>
      contract.timeline.currentEndDate <= futureDateStr &&
      ['SIGNED', 'ACTIVE'].includes(contract.status)
    )
  }, [contracts])

  const getTotalContractValue = useCallback((status?: string) => {
    const filteredContracts = status
      ? contracts.filter(contract => contract.status === status)
      : contracts
    return filteredContracts.reduce((total, contract) => total + contract.financials.contractValue, 0)
  }, [contracts])

  useEffect(() => {
    fetchContracts()
  }, [fetchContracts])

  return {
    contracts,
    isLoading,
    error,
    fetchContracts,
    createContract,
    updateContract,
    deleteContract,
    signContract,
    addAmendment,
    recordPayment,
    addInspection,
    updateProgress,
    getContractById,
    getContractsByStatus,
    getContractsByContractor,
    getActiveContracts,
    getOverdueContracts,
    getContractsNearExpiry,
    getTotalContractValue
  }
}