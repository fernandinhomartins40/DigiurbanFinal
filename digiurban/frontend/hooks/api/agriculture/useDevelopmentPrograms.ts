import { useState, useEffect, useCallback } from 'react'
import { apiClient } from '@/lib/api'

export interface DevelopmentProgram {
  id: string
  code: string
  name: string
  type: 'CREDIT' | 'SUBSIDY' | 'TECHNICAL_ASSISTANCE' | 'INFRASTRUCTURE' | 'TRAINING' | 'EQUIPMENT' | 'SEEDS_INPUTS' | 'INSURANCE'
  category: 'FEDERAL' | 'STATE' | 'MUNICIPAL' | 'PRIVATE' | 'INTERNATIONAL' | 'COOPERATIVE'
  status: 'PLANNING' | 'ACTIVE' | 'PAUSED' | 'COMPLETED' | 'CANCELLED'
  target_audience: Array<'FAMILY_FARMERS' | 'SMALL_PRODUCERS' | 'MEDIUM_PRODUCERS' | 'LARGE_PRODUCERS' | 'COOPERATIVES' | 'ASSOCIATIONS' | 'RURAL_WOMEN' | 'RURAL_YOUTH' | 'INDIGENOUS' | 'QUILOMBOLAS'>
  objectives: {
    primary: string
    secondary: Array<string>
    specific_goals: Array<{
      description: string
      target_value: number
      unit: string
      deadline: string
    }>
  }
  description: {
    summary: string
    detailed: string
    requirements: Array<string>
    benefits: Array<string>
    restrictions: Array<string>
  }
  financial: {
    total_budget: number
    available_budget: number
    disbursed_amount: number
    funding_sources: Array<{
      source: string
      amount: number
      percentage: number
    }>
    individual_limits: {
      min_amount: number
      max_amount: number
    }
    interest_rate?: number
    repayment_period?: number
    grace_period?: number
  }
  eligibility: {
    criteria: Array<{
      type: 'GEOGRAPHIC' | 'ECONOMIC' | 'SOCIAL' | 'TECHNICAL' | 'ENVIRONMENTAL'
      description: string
      mandatory: boolean
    }>
    required_documents: Array<{
      name: string
      description: string
      mandatory: boolean
    }>
    exclusion_factors: Array<string>
  }
  implementation: {
    start_date: string
    end_date: string
    phases: Array<{
      name: string
      description: string
      start_date: string
      end_date: string
      activities: Array<string>
    }>
    responsible_team: Array<{
      name: string
      role: string
      contact: string
    }>
  }
  beneficiaries: Array<{
    id: string
    producer_id: string
    application_date: string
    status: 'APPLIED' | 'ANALYSIS' | 'APPROVED' | 'REJECTED' | 'ACTIVE' | 'COMPLETED' | 'DEFAULTED'
    approved_amount?: number
    disbursement_schedule?: Array<{
      installment: number
      amount: number
      planned_date: string
      actual_date?: string
      status: 'PENDING' | 'DISBURSED' | 'OVERDUE'
    }>
    compliance: {
      requirements_met: boolean
      monitoring_visits: number
      last_evaluation: string
      evaluation_score: number
    }
    results: {
      productivity_increase?: number
      income_increase?: number
      quality_improvement?: number
      sustainability_adoption?: boolean
      employment_creation?: number
    }
  }>
  monitoring: {
    indicators: Array<{
      name: string
      description: string
      target_value: number
      current_value: number
      unit: string
      measurement_frequency: 'MONTHLY' | 'QUARTERLY' | 'BIANNUAL' | 'ANNUAL'
    }>
    reports: Array<{
      date: string
      type: 'PROGRESS' | 'FINANCIAL' | 'IMPACT' | 'COMPLIANCE'
      file_path: string
      key_findings: Array<string>
    }>
    evaluations: Array<{
      date: string
      evaluator: string
      methodology: string
      results: {
        effectiveness: number
        efficiency: number
        impact: number
        sustainability: number
      }
      recommendations: Array<string>
    }>
  }
  partnerships: Array<{
    organization: string
    type: 'FINANCIAL' | 'TECHNICAL' | 'OPERATIONAL' | 'PROMOTIONAL'
    contribution: string
    contact: {
      name: string
      email: string
      phone: string
    }
  }>
  communication: {
    launch_date?: string
    promotion_channels: Array<'WEBSITE' | 'SOCIAL_MEDIA' | 'RADIO' | 'TV' | 'PRINT' | 'EVENTS' | 'FIELD_AGENTS'>
    materials: Array<{
      type: 'BROCHURE' | 'VIDEO' | 'PRESENTATION' | 'MANUAL' | 'FORM'
      title: string
      file_path: string
    }>
    events: Array<{
      date: string
      type: 'LAUNCH' | 'TRAINING' | 'INFORMATION' | 'CLOSURE'
      location: string
      participants: number
    }>
  }
  created_at: string
  updated_at: string
}

export interface CreateDevelopmentProgramData {
  name: string
  type: 'CREDIT' | 'SUBSIDY' | 'TECHNICAL_ASSISTANCE' | 'INFRASTRUCTURE' | 'TRAINING' | 'EQUIPMENT' | 'SEEDS_INPUTS' | 'INSURANCE'
  category: 'FEDERAL' | 'STATE' | 'MUNICIPAL' | 'PRIVATE' | 'INTERNATIONAL' | 'COOPERATIVE'
  target_audience: Array<'FAMILY_FARMERS' | 'SMALL_PRODUCERS' | 'MEDIUM_PRODUCERS' | 'LARGE_PRODUCERS' | 'COOPERATIVES' | 'ASSOCIATIONS' | 'RURAL_WOMEN' | 'RURAL_YOUTH' | 'INDIGENOUS' | 'QUILOMBOLAS'>
  objectives: {
    primary: string
    secondary: Array<string>
    specific_goals: Array<{
      description: string
      target_value: number
      unit: string
      deadline: string
    }>
  }
  description: {
    summary: string
    detailed: string
    requirements: Array<string>
    benefits: Array<string>
    restrictions: Array<string>
  }
  financial: {
    total_budget: number
    funding_sources: Array<{
      source: string
      amount: number
      percentage: number
    }>
    individual_limits: {
      min_amount: number
      max_amount: number
    }
    interest_rate?: number
    repayment_period?: number
    grace_period?: number
  }
  eligibility: {
    criteria: Array<{
      type: 'GEOGRAPHIC' | 'ECONOMIC' | 'SOCIAL' | 'TECHNICAL' | 'ENVIRONMENTAL'
      description: string
      mandatory: boolean
    }>
    required_documents: Array<{
      name: string
      description: string
      mandatory: boolean
    }>
    exclusion_factors: Array<string>
  }
  implementation: {
    start_date: string
    end_date: string
    responsible_team: Array<{
      name: string
      role: string
      contact: string
    }>
  }
}

export interface DevelopmentProgramFilters {
  name?: string
  code?: string
  type?: 'CREDIT' | 'SUBSIDY' | 'TECHNICAL_ASSISTANCE' | 'INFRASTRUCTURE' | 'TRAINING' | 'EQUIPMENT' | 'SEEDS_INPUTS' | 'INSURANCE'
  category?: 'FEDERAL' | 'STATE' | 'MUNICIPAL' | 'PRIVATE' | 'INTERNATIONAL' | 'COOPERATIVE'
  status?: 'PLANNING' | 'ACTIVE' | 'PAUSED' | 'COMPLETED' | 'CANCELLED'
  target_audience?: 'FAMILY_FARMERS' | 'SMALL_PRODUCERS' | 'MEDIUM_PRODUCERS' | 'LARGE_PRODUCERS' | 'COOPERATIVES' | 'ASSOCIATIONS' | 'RURAL_WOMEN' | 'RURAL_YOUTH' | 'INDIGENOUS' | 'QUILOMBOLAS'
  min_budget?: number
  max_budget?: number
  has_available_budget?: boolean
  start_date_from?: string
  start_date_to?: string
  end_date_from?: string
  end_date_to?: string
  created_from?: string
  created_to?: string
}

export const useDevelopmentPrograms = () => {
  const [programs, setPrograms] = useState<DevelopmentProgram[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchPrograms = useCallback(async (filters?: DevelopmentProgramFilters) => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.get<DevelopmentProgram[]>('/agriculture/development-programs', { params: filters })
      setPrograms(response.data as DevelopmentProgram[])
    } catch (err) {
      setError('Falha ao carregar programas de fomento')
      console.error('Error fetching development programs:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  const getProgramById = useCallback(async (id: string): Promise<DevelopmentProgram | null> => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.get<DevelopmentProgram>(`/agriculture/development-programs/${id}`)
      return response.data as DevelopmentProgram
    } catch (err) {
      setError('Falha ao carregar programa de fomento')
      console.error('Error fetching development program:', err)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const createProgram = useCallback(async (data: CreateDevelopmentProgramData): Promise<DevelopmentProgram | null> => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.post<DevelopmentProgram>('/agriculture/development-programs', data)
      const newProgram = response.data as DevelopmentProgram
      setPrograms(prev => [...prev, newProgram])
      return newProgram
    } catch (err) {
      setError('Falha ao criar programa de fomento')
      console.error('Error creating development program:', err)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const updateProgram = useCallback(async (id: string, data: Partial<CreateDevelopmentProgramData>): Promise<DevelopmentProgram | null> => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.put<DevelopmentProgram>(`/agriculture/development-programs/${id}`, data)
      const updatedProgram = response.data as DevelopmentProgram
      setPrograms(prev => prev.map(prog => prog.id === id ? updatedProgram : prog))
      return updatedProgram
    } catch (err) {
      setError('Falha ao atualizar programa de fomento')
      console.error('Error updating development program:', err)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const deleteProgram = useCallback(async (id: string): Promise<boolean> => {
    try {
      setLoading(true)
      setError(null)
      await apiClient.delete(`/agriculture/development-programs/${id}`)
      setPrograms(prev => prev.filter(prog => prog.id !== id))
      return true
    } catch (err) {
      setError('Falha ao excluir programa de fomento')
      console.error('Error deleting development program:', err)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const updateStatus = useCallback(async (id: string, status: 'PLANNING' | 'ACTIVE' | 'PAUSED' | 'COMPLETED' | 'CANCELLED'): Promise<boolean> => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.patch<DevelopmentProgram>(`/agriculture/development-programs/${id}/status`, { status })
      const updatedProgram = response.data as DevelopmentProgram
      setPrograms(prev => prev.map(prog => prog.id === id ? updatedProgram : prog))
      return true
    } catch (err) {
      setError('Falha ao atualizar status do programa')
      console.error('Error updating program status:', err)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const addBeneficiary = useCallback(async (programId: string, beneficiary: {
    producer_id: string
    approved_amount: number
    disbursement_schedule: Array<{
      installment: number
      amount: number
      planned_date: string
    }>
  }): Promise<boolean> => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.post<DevelopmentProgram>(`/agriculture/development-programs/${programId}/beneficiaries`, beneficiary)
      const updatedProgram = response.data as DevelopmentProgram
      setPrograms(prev => prev.map(prog => prog.id === programId ? updatedProgram : prog))
      return true
    } catch (err) {
      setError('Falha ao adicionar beneficiário')
      console.error('Error adding beneficiary:', err)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const updateBeneficiaryStatus = useCallback(async (programId: string, beneficiaryId: string, status: 'APPLIED' | 'ANALYSIS' | 'APPROVED' | 'REJECTED' | 'ACTIVE' | 'COMPLETED' | 'DEFAULTED'): Promise<boolean> => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.patch<DevelopmentProgram>(`/agriculture/development-programs/${programId}/beneficiaries/${beneficiaryId}/status`, { status })
      const updatedProgram = response.data as DevelopmentProgram
      setPrograms(prev => prev.map(prog => prog.id === programId ? updatedProgram : prog))
      return true
    } catch (err) {
      setError('Falha ao atualizar status do beneficiário')
      console.error('Error updating beneficiary status:', err)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const disburseFunds = useCallback(async (programId: string, beneficiaryId: string, installment: number): Promise<boolean> => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.post<DevelopmentProgram>(`/agriculture/development-programs/${programId}/beneficiaries/${beneficiaryId}/disburse`, { installment })
      const updatedProgram = response.data as DevelopmentProgram
      setPrograms(prev => prev.map(prog => prog.id === programId ? updatedProgram : prog))
      return true
    } catch (err) {
      setError('Falha ao liberar recursos')
      console.error('Error disbursing funds:', err)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const recordMonitoringVisit = useCallback(async (programId: string, beneficiaryId: string, visit: {
    date: string
    evaluator: string
    compliance_score: number
    observations: string
    recommendations: Array<string>
  }): Promise<boolean> => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.post<DevelopmentProgram>(`/agriculture/development-programs/${programId}/beneficiaries/${beneficiaryId}/monitoring`, visit)
      const updatedProgram = response.data as DevelopmentProgram
      setPrograms(prev => prev.map(prog => prog.id === programId ? updatedProgram : prog))
      return true
    } catch (err) {
      setError('Falha ao registrar visita de monitoramento')
      console.error('Error recording monitoring visit:', err)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const addPartnership = useCallback(async (programId: string, partnership: {
    organization: string
    type: 'FINANCIAL' | 'TECHNICAL' | 'OPERATIONAL' | 'PROMOTIONAL'
    contribution: string
    contact: {
      name: string
      email: string
      phone: string
    }
  }): Promise<boolean> => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.post<DevelopmentProgram>(`/agriculture/development-programs/${programId}/partnerships`, partnership)
      const updatedProgram = response.data as DevelopmentProgram
      setPrograms(prev => prev.map(prog => prog.id === programId ? updatedProgram : prog))
      return true
    } catch (err) {
      setError('Falha ao adicionar parceria')
      console.error('Error adding partnership:', err)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const generateReport = useCallback(async (programId: string, type: 'PROGRESS' | 'FINANCIAL' | 'IMPACT' | 'COMPLIANCE'): Promise<boolean> => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.post<DevelopmentProgram>(`/agriculture/development-programs/${programId}/reports`, { type })
      const updatedProgram = response.data as DevelopmentProgram
      setPrograms(prev => prev.map(prog => prog.id === programId ? updatedProgram : prog))
      return true
    } catch (err) {
      setError('Falha ao gerar relatório')
      console.error('Error generating report:', err)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const getActivePrograms = useCallback(() => {
    return programs.filter(program => program.status === 'ACTIVE')
  }, [programs])

  const getProgramsByType = useCallback((type: 'CREDIT' | 'SUBSIDY' | 'TECHNICAL_ASSISTANCE' | 'INFRASTRUCTURE' | 'TRAINING' | 'EQUIPMENT' | 'SEEDS_INPUTS' | 'INSURANCE') => {
    return programs.filter(program => program.type === type)
  }, [programs])

  const getProgramsWithAvailableBudget = useCallback(() => {
    return programs.filter(program => program.financial.available_budget > 0)
  }, [programs])

  const getProgramsByTargetAudience = useCallback((audience: string) => {
    return programs.filter(program => program.target_audience.includes(audience as any))
  }, [programs])

  const calculateTotalDisbursement = useCallback((programId: string) => {
    const program = programs.find(p => p.id === programId)
    if (!program) return 0

    return program.beneficiaries.reduce((total, beneficiary) => {
      return total + (beneficiary.disbursement_schedule?.reduce((instTotal, installment) => {
        return instTotal + (installment.status === 'DISBURSED' ? installment.amount : 0)
      }, 0) || 0)
    }, 0)
  }, [programs])

  useEffect(() => {
    fetchPrograms()
  }, [fetchPrograms])

  return {
    programs,
    loading,
    error,
    fetchPrograms,
    getProgramById,
    createProgram,
    updateProgram,
    deleteProgram,
    updateStatus,
    addBeneficiary,
    updateBeneficiaryStatus,
    disburseFunds,
    recordMonitoringVisit,
    addPartnership,
    generateReport,
    getActivePrograms,
    getProgramsByType,
    getProgramsWithAvailableBudget,
    getProgramsByTargetAudience,
    calculateTotalDisbursement
  }
}