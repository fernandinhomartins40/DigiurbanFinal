'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAdminAuth } from '@/contexts/AdminAuthContext'

interface HousingBeneficiary {
  id: string
  beneficiaryNumber: string
  personalInfo: {
    name: string
    cpf: string
    rg?: string
    dateOfBirth: string
    gender: 'MALE' | 'FEMALE'
    maritalStatus: 'SINGLE' | 'MARRIED' | 'DIVORCED' | 'WIDOWED' | 'UNION'
    nationality: string
    phone: string
    email?: string
    education: 'NONE' | 'ELEMENTARY_INCOMPLETE' | 'ELEMENTARY_COMPLETE' | 'HIGH_SCHOOL_INCOMPLETE' | 'HIGH_SCHOOL_COMPLETE' | 'HIGHER_EDUCATION'
    occupation: string
    employer?: string
    workAddress?: string
  }
  family: {
    size: number
    monthlyIncome: number
    perCapitaIncome: number
    composition: {
      name: string
      cpf: string
      dateOfBirth: string
      relationship: 'SPOUSE' | 'CHILD' | 'PARENT' | 'SIBLING' | 'OTHER'
      occupation?: string
      income?: number
      education?: string
      disability?: {
        type: string
        level: 'MILD' | 'MODERATE' | 'SEVERE'
        description: string
      }
    }[]
    dependents: number
    elderlyMembers: number
    disabledMembers: number
    minors: number
  }
  housing: {
    programId: string
    programName: string
    unitId: string
    unitAddress: string
    allocationDate: string
    occupancyDate: string
    contractType: 'OWNERSHIP' | 'LEASE' | 'RENTAL' | 'TEMPORARY'
    contract: {
      number: string
      startDate: string
      endDate?: string
      monthlyPayment: number
      totalValue: number
      paymentHistory: {
        month: string
        dueDate: string
        amount: number
        paidDate?: string
        status: 'PAID' | 'PENDING' | 'OVERDUE' | 'CANCELLED'
      }[]
    }
    subsidyReceived: {
      type: 'RENT' | 'PURCHASE' | 'IMPROVEMENT'
      amount: number
      duration: number
      startDate: string
      endDate?: string
    }
  }
  socioeconomic: {
    profile: {
      vulnerabilityLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'EXTREME'
      cadUnico: {
        registered: boolean
        nis: string
        lastUpdate: string
      }
      benefitsReceived: {
        type: string
        value: number
        startDate: string
        endDate?: string
        status: 'ACTIVE' | 'SUSPENDED' | 'CANCELLED'
      }[]
    }
    situation: {
      previousHousing: 'RENTED' | 'OWNED' | 'FAMILY_PROPERTY' | 'IRREGULAR_OCCUPATION' | 'HOMELESS'
      reasonForNeed: string[]
      priorityCriteria: string[]
      urgencyLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'EMERGENCY'
    }
  }
  accompaniment: {
    socialWorker: {
      name: string
      registration: string
      phone: string
      email: string
    }
    visits: {
      date: string
      type: 'ORIENTATION' | 'MONITORING' | 'SUPPORT' | 'EMERGENCY'
      socialWorker: string
      purpose: string
      findings: string[]
      recommendations: string[]
      nextVisit?: string
    }[]
    support: {
      services: {
        type: 'HEALTH' | 'EDUCATION' | 'EMPLOYMENT' | 'SOCIAL' | 'LEGAL'
        referral: string
        date: string
        status: 'REFERRED' | 'CONTACTED' | 'ONGOING' | 'COMPLETED'
      }[]
      interventions: {
        date: string
        type: 'FAMILY_COUNSELING' | 'FINANCIAL_EDUCATION' | 'CONFLICT_MEDIATION' | 'COMMUNITY_INTEGRATION'
        description: string
        result: string
      }[]
    }
  }
  compliance: {
    obligations: {
      type: string
      description: string
      status: 'COMPLIANT' | 'NON_COMPLIANT' | 'PENDING'
      lastCheck: string
    }[]
    violations: {
      type: string
      description: string
      date: string
      severity: 'MINOR' | 'MODERATE' | 'SERIOUS' | 'CRITICAL'
      sanction?: string
      resolved: boolean
    }[]
    warnings: {
      date: string
      type: string
      description: string
      response?: string
    }[]
  }
  satisfaction: {
    surveys: {
      date: string
      type: 'HOUSING_QUALITY' | 'LOCATION' | 'SERVICES' | 'OVERALL'
      questions: {
        question: string
        answer: string | number
        scale?: number
      }[]
      overallRating: number
    }[]
    feedback: {
      date: string
      type: 'COMPLAINT' | 'SUGGESTION' | 'COMPLIMENT' | 'REQUEST'
      description: string
      category: string
      response?: {
        date: string
        responsible: string
        action: string
        resolution: string
      }
    }[]
  }
  outcomes: {
    achievements: {
      type: 'INCOME_INCREASE' | 'EMPLOYMENT' | 'EDUCATION' | 'HEALTH_IMPROVEMENT' | 'SOCIAL_INTEGRATION'
      description: string
      date: string
      value?: number
    }[]
    challenges: {
      type: 'FINANCIAL' | 'HEALTH' | 'EMPLOYMENT' | 'SOCIAL' | 'HOUSING'
      description: string
      date: string
      status: 'ONGOING' | 'RESOLVED' | 'ESCALATED'
      support?: string
    }[]
    graduation: {
      eligible: boolean
      criteria: string[]
      expectedDate?: string
      supportPlan?: string[]
    }
  }
  documents: {
    type: string
    name: string
    url?: string
    issueDate: string
    expiryDate?: string
    status: 'VALID' | 'EXPIRED' | 'PENDING' | 'REJECTED'
    observations?: string
  }[]
  communication: {
    preferences: {
      method: 'EMAIL' | 'SMS' | 'PHONE' | 'MAIL' | 'IN_PERSON'
      frequency: 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'AS_NEEDED'
      language: string
    }
    history: {
      date: string
      type: 'NOTIFICATION' | 'REMINDER' | 'INVITATION' | 'INFORMATION'
      method: string
      message: string
      status: 'SENT' | 'DELIVERED' | 'READ' | 'RESPONDED'
    }[]
  }
  emergencyContacts: {
    name: string
    relationship: string
    phone: string
    address?: string
    isPrimary: boolean
  }[]
  case: {
    status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'GRADUATED' | 'TRANSFERRED'
    startDate: string
    lastUpdate: string
    nextReview: string
    caseManager: string
    priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
    notes: {
      date: string
      author: string
      content: string
      type: 'GENERAL' | 'ALERT' | 'ACHIEVEMENT' | 'CONCERN'
    }[]
  }
  createdAt: string
  updatedAt: string
}

interface CreateHousingBeneficiaryData {
  personalInfo: {
    name: string
    cpf: string
    dateOfBirth: string
    gender: 'MALE' | 'FEMALE'
    phone: string
  }
  family: {
    size: number
    monthlyIncome: number
  }
  housing: {
    programId: string
    unitId: string
    allocationDate: string
    contractType: 'OWNERSHIP' | 'LEASE' | 'RENTAL' | 'TEMPORARY'
  }
}

interface UseHousingBeneficiariesReturn {
  beneficiaries: HousingBeneficiary[]
  loading: boolean
  error: string | null
  createBeneficiary: (data: CreateHousingBeneficiaryData) => Promise<HousingBeneficiary>
  updateBeneficiary: (id: string, data: Partial<CreateHousingBeneficiaryData>) => Promise<HousingBeneficiary>
  updatePersonalInfo: (id: string, personalInfo: any) => Promise<HousingBeneficiary>
  updateFamily: (id: string, family: any) => Promise<HousingBeneficiary>
  addFamilyMember: (id: string, member: any) => Promise<HousingBeneficiary>
  removeFamilyMember: (id: string, memberCpf: string) => Promise<HousingBeneficiary>
  updateHousing: (id: string, housing: any) => Promise<HousingBeneficiary>
  addPayment: (id: string, payment: any) => Promise<HousingBeneficiary>
  updateSocioeconomic: (id: string, socioeconomic: any) => Promise<HousingBeneficiary>
  assignSocialWorker: (id: string, socialWorker: any) => Promise<HousingBeneficiary>
  scheduleVisit: (id: string, visit: any) => Promise<HousingBeneficiary>
  recordVisit: (id: string, visit: any) => Promise<HousingBeneficiary>
  addSupportService: (id: string, service: any) => Promise<HousingBeneficiary>
  addIntervention: (id: string, intervention: any) => Promise<HousingBeneficiary>
  updateCompliance: (id: string, compliance: any) => Promise<HousingBeneficiary>
  recordViolation: (id: string, violation: any) => Promise<HousingBeneficiary>
  issueWarning: (id: string, warning: any) => Promise<HousingBeneficiary>
  conductSurvey: (id: string, survey: any) => Promise<HousingBeneficiary>
  addFeedback: (id: string, feedback: any) => Promise<HousingBeneficiary>
  respondToFeedback: (id: string, feedbackId: string, response: any) => Promise<HousingBeneficiary>
  recordAchievement: (id: string, achievement: any) => Promise<HousingBeneficiary>
  recordChallenge: (id: string, challenge: any) => Promise<HousingBeneficiary>
  assessGraduation: (id: string) => Promise<HousingBeneficiary>
  addDocument: (id: string, document: any) => Promise<HousingBeneficiary>
  updateDocument: (id: string, documentId: string, status: string) => Promise<HousingBeneficiary>
  updateCommunicationPreferences: (id: string, preferences: any) => Promise<HousingBeneficiary>
  sendCommunication: (id: string, communication: any) => Promise<HousingBeneficiary>
  addEmergencyContact: (id: string, contact: any) => Promise<HousingBeneficiary>
  updateCaseStatus: (id: string, status: string) => Promise<HousingBeneficiary>
  addCaseNote: (id: string, note: any) => Promise<HousingBeneficiary>
  transferBeneficiary: (id: string, newUnit: string, reason: string) => Promise<HousingBeneficiary>
  graduateBeneficiary: (id: string, graduationPlan: any) => Promise<HousingBeneficiary>
  suspendBeneficiary: (id: string, reason: string) => Promise<HousingBeneficiary>
  deleteBeneficiary: (id: string) => Promise<void>
  getBeneficiariesByProgram: (programId: string) => HousingBeneficiary[]
  getBeneficiariesByStatus: (status: string) => HousingBeneficiary[]
  getBeneficiariesByWorker: (workerId: string) => HousingBeneficiary[]
  getBeneficiariesNeedingVisit: () => HousingBeneficiary[]
  refreshBeneficiaries: () => Promise<void>
}

export function useHousingBeneficiaries(): UseHousingBeneficiariesReturn {
  const [beneficiaries, setBeneficiaries] = useState<HousingBeneficiary[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchBeneficiaries = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await apiClient.get('/api/secretarias/housing/beneficiaries')
      setBeneficiaries(data.beneficiaries || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar beneficiários')
    } finally {
      setLoading(false)
    }
  }, [])

  const createBeneficiary = useCallback(async (data: CreateHousingBeneficiaryData): Promise<HousingBeneficiary> => {
    try {
      setError(null)
      const response = await apiClient.post('/api/secretarias/housing/beneficiaries', data)
      const newBeneficiary = response.beneficiary
      setBeneficiaries(prev => [newBeneficiary, ...prev])
      return newBeneficiary
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar beneficiário'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const updateBeneficiary = useCallback(async (id: string, data: Partial<CreateHousingBeneficiaryData>): Promise<HousingBeneficiary> => {
    try {
      setError(null)
      const response = await apiClient.put(`/api/secretarias/housing/beneficiaries/${id}`, data)
      const updatedBeneficiary = response.beneficiary
      setBeneficiaries(prev => prev.map(ben => ben.id === id ? updatedBeneficiary : ben))
      return updatedBeneficiary
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar beneficiário'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const updatePersonalInfo = useCallback(async (id: string, personalInfo: any): Promise<HousingBeneficiary> => {
    try {
      setError(null)
      const response = await apiClient.put(`/api/secretarias/housing/beneficiaries/${id}/personal-info`, personalInfo)
      const updatedBeneficiary = response.beneficiary
      setBeneficiaries(prev => prev.map(ben => ben.id === id ? updatedBeneficiary : ben))
      return updatedBeneficiary
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar dados pessoais'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const updateFamily = useCallback(async (id: string, family: any): Promise<HousingBeneficiary> => {
    try {
      setError(null)
      const response = await apiClient.put(`/api/secretarias/housing/beneficiaries/${id}/family`, family)
      const updatedBeneficiary = response.beneficiary
      setBeneficiaries(prev => prev.map(ben => ben.id === id ? updatedBeneficiary : ben))
      return updatedBeneficiary
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar família'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const addFamilyMember = useCallback(async (id: string, member: any): Promise<HousingBeneficiary> => {
    try {
      setError(null)
      const response = await apiClient.post(`/api/secretarias/housing/beneficiaries/${id}/family/members`, member)
      const updatedBeneficiary = response.beneficiary
      setBeneficiaries(prev => prev.map(ben => ben.id === id ? updatedBeneficiary : ben))
      return updatedBeneficiary
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao adicionar membro da família'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const removeFamilyMember = useCallback(async (id: string, memberCpf: string): Promise<HousingBeneficiary> => {
    try {
      setError(null)
      const response = await apiClient.delete(`/api/secretarias/housing/beneficiaries/${id}/family/members/${memberCpf}`)
      const updatedBeneficiary = response.beneficiary
      setBeneficiaries(prev => prev.map(ben => ben.id === id ? updatedBeneficiary : ben))
      return updatedBeneficiary
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao remover membro da família'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const updateHousing = useCallback(async (id: string, housing: any): Promise<HousingBeneficiary> => {
    try {
      setError(null)
      const response = await apiClient.put(`/api/secretarias/housing/beneficiaries/${id}/housing`, housing)
      const updatedBeneficiary = response.beneficiary
      setBeneficiaries(prev => prev.map(ben => ben.id === id ? updatedBeneficiary : ben))
      return updatedBeneficiary
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar habitação'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const addPayment = useCallback(async (id: string, payment: any): Promise<HousingBeneficiary> => {
    try {
      setError(null)
      const response = await apiClient.post(`/api/secretarias/housing/beneficiaries/${id}/payments`, payment)
      const updatedBeneficiary = response.beneficiary
      setBeneficiaries(prev => prev.map(ben => ben.id === id ? updatedBeneficiary : ben))
      return updatedBeneficiary
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao adicionar pagamento'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const updateSocioeconomic = useCallback(async (id: string, socioeconomic: any): Promise<HousingBeneficiary> => {
    try {
      setError(null)
      const response = await apiClient.put(`/api/secretarias/housing/beneficiaries/${id}/socioeconomic`, socioeconomic)
      const updatedBeneficiary = response.beneficiary
      setBeneficiaries(prev => prev.map(ben => ben.id === id ? updatedBeneficiary : ben))
      return updatedBeneficiary
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar dados socioeconômicos'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const assignSocialWorker = useCallback(async (id: string, socialWorker: any): Promise<HousingBeneficiary> => {
    try {
      setError(null)
      const response = await apiClient.put(`/api/secretarias/housing/beneficiaries/${id}/social-worker`, socialWorker)
      const updatedBeneficiary = response.beneficiary
      setBeneficiaries(prev => prev.map(ben => ben.id === id ? updatedBeneficiary : ben))
      return updatedBeneficiary
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atribuir assistente social'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const scheduleVisit = useCallback(async (id: string, visit: any): Promise<HousingBeneficiary> => {
    try {
      setError(null)
      const response = await apiClient.post(`/api/secretarias/housing/beneficiaries/${id}/visits/schedule`, visit)
      const updatedBeneficiary = response.beneficiary
      setBeneficiaries(prev => prev.map(ben => ben.id === id ? updatedBeneficiary : ben))
      return updatedBeneficiary
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao agendar visita'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const recordVisit = useCallback(async (id: string, visit: any): Promise<HousingBeneficiary> => {
    try {
      setError(null)
      const response = await apiClient.post(`/api/secretarias/housing/beneficiaries/${id}/visits`, visit)
      const updatedBeneficiary = response.beneficiary
      setBeneficiaries(prev => prev.map(ben => ben.id === id ? updatedBeneficiary : ben))
      return updatedBeneficiary
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao registrar visita'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const addSupportService = useCallback(async (id: string, service: any): Promise<HousingBeneficiary> => {
    try {
      setError(null)
      const response = await apiClient.post(`/api/secretarias/housing/beneficiaries/${id}/support/services`, service)
      const updatedBeneficiary = response.beneficiary
      setBeneficiaries(prev => prev.map(ben => ben.id === id ? updatedBeneficiary : ben))
      return updatedBeneficiary
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao adicionar serviço de apoio'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const addIntervention = useCallback(async (id: string, intervention: any): Promise<HousingBeneficiary> => {
    try {
      setError(null)
      const response = await apiClient.post(`/api/secretarias/housing/beneficiaries/${id}/support/interventions`, intervention)
      const updatedBeneficiary = response.beneficiary
      setBeneficiaries(prev => prev.map(ben => ben.id === id ? updatedBeneficiary : ben))
      return updatedBeneficiary
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao adicionar intervenção'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const updateCompliance = useCallback(async (id: string, compliance: any): Promise<HousingBeneficiary> => {
    try {
      setError(null)
      const response = await apiClient.put(`/api/secretarias/housing/beneficiaries/${id}/compliance`, compliance)
      const updatedBeneficiary = response.beneficiary
      setBeneficiaries(prev => prev.map(ben => ben.id === id ? updatedBeneficiary : ben))
      return updatedBeneficiary
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar conformidade'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const recordViolation = useCallback(async (id: string, violation: any): Promise<HousingBeneficiary> => {
    try {
      setError(null)
      const response = await apiClient.post(`/api/secretarias/housing/beneficiaries/${id}/violations`, violation)
      const updatedBeneficiary = response.beneficiary
      setBeneficiaries(prev => prev.map(ben => ben.id === id ? updatedBeneficiary : ben))
      return updatedBeneficiary
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao registrar violação'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const issueWarning = useCallback(async (id: string, warning: any): Promise<HousingBeneficiary> => {
    try {
      setError(null)
      const response = await apiClient.post(`/api/secretarias/housing/beneficiaries/${id}/warnings`, warning)
      const updatedBeneficiary = response.beneficiary
      setBeneficiaries(prev => prev.map(ben => ben.id === id ? updatedBeneficiary : ben))
      return updatedBeneficiary
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao emitir advertência'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const conductSurvey = useCallback(async (id: string, survey: any): Promise<HousingBeneficiary> => {
    try {
      setError(null)
      const response = await apiClient.post(`/api/secretarias/housing/beneficiaries/${id}/surveys`, survey)
      const updatedBeneficiary = response.beneficiary
      setBeneficiaries(prev => prev.map(ben => ben.id === id ? updatedBeneficiary : ben))
      return updatedBeneficiary
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao realizar pesquisa'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const addFeedback = useCallback(async (id: string, feedback: any): Promise<HousingBeneficiary> => {
    try {
      setError(null)
      const response = await apiClient.post(`/api/secretarias/housing/beneficiaries/${id}/feedback`, feedback)
      const updatedBeneficiary = response.beneficiary
      setBeneficiaries(prev => prev.map(ben => ben.id === id ? updatedBeneficiary : ben))
      return updatedBeneficiary
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao adicionar feedback'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const respondToFeedback = useCallback(async (id: string, feedbackId: string, response: any): Promise<HousingBeneficiary> => {
    try {
      setError(null)
      const responseData = await apiClient.put(`/api/secretarias/housing/beneficiaries/${id}/feedback/${feedbackId}/respond`, response)
      const updatedBeneficiary = responseData.beneficiary
      setBeneficiaries(prev => prev.map(ben => ben.id === id ? updatedBeneficiary : ben))
      return updatedBeneficiary
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao responder feedback'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const recordAchievement = useCallback(async (id: string, achievement: any): Promise<HousingBeneficiary> => {
    try {
      setError(null)
      const response = await apiClient.post(`/api/secretarias/housing/beneficiaries/${id}/achievements`, achievement)
      const updatedBeneficiary = response.beneficiary
      setBeneficiaries(prev => prev.map(ben => ben.id === id ? updatedBeneficiary : ben))
      return updatedBeneficiary
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao registrar conquista'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const recordChallenge = useCallback(async (id: string, challenge: any): Promise<HousingBeneficiary> => {
    try {
      setError(null)
      const response = await apiClient.post(`/api/secretarias/housing/beneficiaries/${id}/challenges`, challenge)
      const updatedBeneficiary = response.beneficiary
      setBeneficiaries(prev => prev.map(ben => ben.id === id ? updatedBeneficiary : ben))
      return updatedBeneficiary
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao registrar desafio'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const assessGraduation = useCallback(async (id: string): Promise<HousingBeneficiary> => {
    try {
      setError(null)
      const response = await apiClient.post(`/api/secretarias/housing/beneficiaries/${id}/assess-graduation`, {})
      const updatedBeneficiary = response.beneficiary
      setBeneficiaries(prev => prev.map(ben => ben.id === id ? updatedBeneficiary : ben))
      return updatedBeneficiary
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao avaliar graduação'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const addDocument = useCallback(async (id: string, document: any): Promise<HousingBeneficiary> => {
    try {
      setError(null)
      const response = await apiClient.post(`/api/secretarias/housing/beneficiaries/${id}/documents`, document)
      const updatedBeneficiary = response.beneficiary
      setBeneficiaries(prev => prev.map(ben => ben.id === id ? updatedBeneficiary : ben))
      return updatedBeneficiary
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao adicionar documento'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const updateDocument = useCallback(async (id: string, documentId: string, status: string): Promise<HousingBeneficiary> => {
    try {
      setError(null)
      const response = await apiClient.put(`/api/secretarias/housing/beneficiaries/${id}/documents/${documentId}`, { status })
      const updatedBeneficiary = response.beneficiary
      setBeneficiaries(prev => prev.map(ben => ben.id === id ? updatedBeneficiary : ben))
      return updatedBeneficiary
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar documento'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const updateCommunicationPreferences = useCallback(async (id: string, preferences: any): Promise<HousingBeneficiary> => {
    try {
      setError(null)
      const response = await apiClient.put(`/api/secretarias/housing/beneficiaries/${id}/communication/preferences`, preferences)
      const updatedBeneficiary = response.beneficiary
      setBeneficiaries(prev => prev.map(ben => ben.id === id ? updatedBeneficiary : ben))
      return updatedBeneficiary
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar preferências de comunicação'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const sendCommunication = useCallback(async (id: string, communication: any): Promise<HousingBeneficiary> => {
    try {
      setError(null)
      const response = await apiClient.post(`/api/secretarias/housing/beneficiaries/${id}/communication/send`, communication)
      const updatedBeneficiary = response.beneficiary
      setBeneficiaries(prev => prev.map(ben => ben.id === id ? updatedBeneficiary : ben))
      return updatedBeneficiary
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao enviar comunicação'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const addEmergencyContact = useCallback(async (id: string, contact: any): Promise<HousingBeneficiary> => {
    try {
      setError(null)
      const response = await apiClient.post(`/api/secretarias/housing/beneficiaries/${id}/emergency-contacts`, contact)
      const updatedBeneficiary = response.beneficiary
      setBeneficiaries(prev => prev.map(ben => ben.id === id ? updatedBeneficiary : ben))
      return updatedBeneficiary
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao adicionar contato de emergência'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const updateCaseStatus = useCallback(async (id: string, status: string): Promise<HousingBeneficiary> => {
    try {
      setError(null)
      const response = await apiClient.put(`/api/secretarias/housing/beneficiaries/${id}/case/status`, { status })
      const updatedBeneficiary = response.beneficiary
      setBeneficiaries(prev => prev.map(ben => ben.id === id ? updatedBeneficiary : ben))
      return updatedBeneficiary
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar status do caso'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const addCaseNote = useCallback(async (id: string, note: any): Promise<HousingBeneficiary> => {
    try {
      setError(null)
      const response = await apiClient.post(`/api/secretarias/housing/beneficiaries/${id}/case/notes`, note)
      const updatedBeneficiary = response.beneficiary
      setBeneficiaries(prev => prev.map(ben => ben.id === id ? updatedBeneficiary : ben))
      return updatedBeneficiary
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao adicionar nota do caso'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const transferBeneficiary = useCallback(async (id: string, newUnit: string, reason: string): Promise<HousingBeneficiary> => {
    try {
      setError(null)
      const response = await apiClient.post(`/api/secretarias/housing/beneficiaries/${id}/transfer`, { newUnit, reason })
      const updatedBeneficiary = response.beneficiary
      setBeneficiaries(prev => prev.map(ben => ben.id === id ? updatedBeneficiary : ben))
      return updatedBeneficiary
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao transferir beneficiário'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const graduateBeneficiary = useCallback(async (id: string, graduationPlan: any): Promise<HousingBeneficiary> => {
    try {
      setError(null)
      const response = await apiClient.post(`/api/secretarias/housing/beneficiaries/${id}/graduate`, graduationPlan)
      const updatedBeneficiary = response.beneficiary
      setBeneficiaries(prev => prev.map(ben => ben.id === id ? updatedBeneficiary : ben))
      return updatedBeneficiary
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao graduar beneficiário'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const suspendBeneficiary = useCallback(async (id: string, reason: string): Promise<HousingBeneficiary> => {
    try {
      setError(null)
      const response = await apiClient.post(`/api/secretarias/housing/beneficiaries/${id}/suspend`, { reason })
      const updatedBeneficiary = response.beneficiary
      setBeneficiaries(prev => prev.map(ben => ben.id === id ? updatedBeneficiary : ben))
      return updatedBeneficiary
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao suspender beneficiário'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const deleteBeneficiary = useCallback(async (id: string): Promise<void> => {
    try {
      setError(null)
      await apiClient.delete(`/api/secretarias/housing/beneficiaries/${id}`)
      setBeneficiaries(prev => prev.filter(ben => ben.id !== id))
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao excluir beneficiário'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const getBeneficiariesByProgram = useCallback((programId: string) => beneficiaries.filter(ben => ben.housing.programId === programId), [beneficiaries])
  const getBeneficiariesByStatus = useCallback((status: string) => beneficiaries.filter(ben => ben.case.status === status), [beneficiaries])
  const getBeneficiariesByWorker = useCallback((workerId: string) => beneficiaries.filter(ben => ben.case.caseManager === workerId), [beneficiaries])
  const getBeneficiariesNeedingVisit = useCallback(() => {
    const today = new Date()
    return beneficiaries.filter(ben => {
      const lastVisit = ben.accompaniment.visits[ben.accompaniment.visits.length - 1]
      if (!lastVisit) return true
      const daysSinceLastVisit = (today.getTime() - new Date(lastVisit.date).getTime()) / (1000 * 60 * 60 * 24)
      return daysSinceLastVisit > 90
    })
  }, [beneficiaries])

  const refreshBeneficiaries = useCallback(async () => {
    await fetchBeneficiaries()
  }, [fetchBeneficiaries])

  useEffect(() => {
    fetchBeneficiaries()
  }, [fetchBeneficiaries])

  return {
    beneficiaries,
    loading,
    error,
    createBeneficiary,
    updateBeneficiary,
    updatePersonalInfo,
    updateFamily,
    addFamilyMember,
    removeFamilyMember,
    updateHousing,
    addPayment,
    updateSocioeconomic,
    assignSocialWorker,
    scheduleVisit,
    recordVisit,
    addSupportService,
    addIntervention,
    updateCompliance,
    recordViolation,
    issueWarning,
    conductSurvey,
    addFeedback,
    respondToFeedback,
    recordAchievement,
    recordChallenge,
    assessGraduation,
    addDocument,
    updateDocument,
    updateCommunicationPreferences,
    sendCommunication,
    addEmergencyContact,
    updateCaseStatus,
    addCaseNote,
    transferBeneficiary,
    graduateBeneficiary,
    suspendBeneficiary,
    deleteBeneficiary,
    getBeneficiariesByProgram,
    getBeneficiariesByStatus,
    getBeneficiariesByWorker,
    getBeneficiariesNeedingVisit,
    refreshBeneficiaries
  }
}