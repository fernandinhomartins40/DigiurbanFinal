'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAdminAuth } from '@/contexts/AdminAuthContext'

// Types
interface SocialProgram {
  id: string
  name: string
  description: string
  programType: 'INCOME_TRANSFER' | 'FOOD_ASSISTANCE' | 'HOUSING' | 'EDUCATION' | 'HEALTH' | 'ELDERLY' | 'YOUTH' | 'EMPLOYMENT' | 'OTHER'
  targetAudience: string
  eligibilityCriteria: {
    ageMin?: number
    ageMax?: number
    familyIncomeMax: number
    familySizeMin?: number
    vulnerabilityTypes: string[]
    requiredDocuments: string[]
    exclusionCriteria: string[]
    additionalRequirements?: string[]
  }
  benefits: {
    type: 'MONETARY' | 'IN_KIND' | 'SERVICE' | 'SUBSIDY'
    description: string
    value?: number
    frequency: 'MONTHLY' | 'QUARTERLY' | 'SEMI_ANNUAL' | 'ANNUAL' | 'ONE_TIME'
    duration?: number // em meses
  }[]
  applicationProcess: {
    steps: string[]
    requiredDocuments: string[]
    applicationDeadline?: string
    evaluationPeriod: number // em dias
    approvalProcess: string[]
  }
  capacity: number
  currentEnrollments: number
  waitingListCount: number
  budget: {
    allocated: number
    spent: number
    remaining: number
    year: number
  }
  managingUnit: string
  coordinator: {
    name: string
    phone: string
    email: string
  }
  schedule: {
    serviceHours: string
    serviceDays: string[]
    locations: {
      name: string
      address: string
      phone?: string
    }[]
  }
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'TERMINATED' | 'PLANNING'
  startDate: string
  endDate?: string
  evaluationCriteria: {
    successMetrics: string[]
    evaluationFrequency: 'MONTHLY' | 'QUARTERLY' | 'SEMI_ANNUAL' | 'ANNUAL'
    lastEvaluation?: string
    nextEvaluation?: string
  }
  partnerships?: {
    organization: string
    role: string
    contact: string
  }[]
  legalFramework: {
    law?: string
    decree?: string
    regulation?: string
    lastUpdate: string
  }
  statistics?: {
    totalServed: number
    activeParticipants: number
    completedParticipants: number
    dropoutRate: number
    satisfactionRate?: number
  }
  createdAt: string
  updatedAt: string
}

interface CreateSocialProgramData {
  name: string
  description: string
  programType: 'INCOME_TRANSFER' | 'FOOD_ASSISTANCE' | 'HOUSING' | 'EDUCATION' | 'HEALTH' | 'ELDERLY' | 'YOUTH' | 'EMPLOYMENT' | 'OTHER'
  targetAudience: string
  eligibilityCriteria: {
    ageMin?: number
    ageMax?: number
    familyIncomeMax: number
    familySizeMin?: number
    vulnerabilityTypes: string[]
    requiredDocuments: string[]
    exclusionCriteria: string[]
    additionalRequirements?: string[]
  }
  benefits: {
    type: 'MONETARY' | 'IN_KIND' | 'SERVICE' | 'SUBSIDY'
    description: string
    value?: number
    frequency: 'MONTHLY' | 'QUARTERLY' | 'SEMI_ANNUAL' | 'ANNUAL' | 'ONE_TIME'
    duration?: number
  }[]
  applicationProcess: {
    steps: string[]
    requiredDocuments: string[]
    applicationDeadline?: string
    evaluationPeriod: number
    approvalProcess: string[]
  }
  capacity: number
  budget: {
    allocated: number
    year: number
  }
  managingUnit: string
  coordinator: {
    name: string
    phone: string
    email: string
  }
  schedule: {
    serviceHours: string
    serviceDays: string[]
    locations: {
      name: string
      address: string
      phone?: string
    }[]
  }
  startDate: string
  endDate?: string
  evaluationCriteria: {
    successMetrics: string[]
    evaluationFrequency: 'MONTHLY' | 'QUARTERLY' | 'SEMI_ANNUAL' | 'ANNUAL'
  }
  partnerships?: {
    organization: string
    role: string
    contact: string
  }[]
  legalFramework: {
    law?: string
    decree?: string
    regulation?: string
  }
}

interface UpdateSocialProgramData extends Partial<CreateSocialProgramData> {
  status?: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'TERMINATED' | 'PLANNING'
  currentEnrollments?: number
  waitingListCount?: number
  budget?: {
    allocated?: number
    spent?: number
    remaining?: number
    year?: number
  }
  statistics?: {
    totalServed?: number
    activeParticipants?: number
    completedParticipants?: number
    dropoutRate?: number
    satisfactionRate?: number
  }
  evaluationCriteria?: {
    successMetrics?: string[]
    evaluationFrequency?: 'MONTHLY' | 'QUARTERLY' | 'SEMI_ANNUAL' | 'ANNUAL'
    lastEvaluation?: string
    nextEvaluation?: string
  }
}

interface ProgramFilters {
  programType?: 'INCOME_TRANSFER' | 'FOOD_ASSISTANCE' | 'HOUSING' | 'EDUCATION' | 'HEALTH' | 'ELDERLY' | 'YOUTH' | 'EMPLOYMENT' | 'OTHER'
  status?: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'TERMINATED' | 'PLANNING'
  targetAudience?: string
  managingUnit?: string
  hasCapacity?: boolean
  budgetYear?: number
  search?: string
}

interface ProgramStats {
  totalPrograms: number
  activePrograms: number
  totalCapacity: number
  totalEnrollments: number
  totalBudgetAllocated: number
  totalBudgetSpent: number
  byType: Record<string, number>
  byStatus: Record<string, number>
  byManagingUnit: Record<string, number>
  utilizationRate: number
  averageDropoutRate: number
}

interface UseSocialProgramsReturn {
  programs: SocialProgram[]
  loading: boolean
  error: string | null
  createProgram: (data: CreateSocialProgramData) => Promise<SocialProgram>
  updateProgram: (id: string, data: UpdateSocialProgramData) => Promise<SocialProgram>
  activateProgram: (id: string) => Promise<SocialProgram>
  suspendProgram: (id: string, reason: string) => Promise<SocialProgram>
  terminateProgram: (id: string, reason: string) => Promise<SocialProgram>
  deleteProgram: (id: string) => Promise<void>
  getProgramById: (id: string) => SocialProgram | undefined
  getProgramsByType: (type: string) => SocialProgram[]
  getActivePrograms: () => SocialProgram[]
  getProgramsWithCapacity: () => SocialProgram[]
  updateProgramStatistics: (id: string, statistics: any) => Promise<SocialProgram>
  getProgramStats: (filters?: ProgramFilters) => ProgramStats
  refreshPrograms: (filters?: ProgramFilters) => Promise<void>
}

export function useSocialPrograms(initialFilters?: ProgramFilters): UseSocialProgramsReturn {
  const [programs, setPrograms] = useState<SocialProgram[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPrograms = useCallback(async (filters?: ProgramFilters) => {
    try {
      setLoading(true)
      setError(null)

      const queryParams = new URLSearchParams()
      if (filters?.programType) queryParams.append('programType', filters.programType)
      if (filters?.status) queryParams.append('status', filters.status)
      if (filters?.targetAudience) queryParams.append('targetAudience', filters.targetAudience)
      if (filters?.managingUnit) queryParams.append('managingUnit', filters.managingUnit)
      if (filters?.hasCapacity !== undefined) queryParams.append('hasCapacity', filters.hasCapacity.toString())
      if (filters?.budgetYear) queryParams.append('budgetYear', filters.budgetYear.toString())
      if (filters?.search) queryParams.append('search', filters.search)

      const query = queryParams.toString()
      const endpoint = `/api/secretarias/social-assistance/programs${query ? `?${query}` : ''}`

      const data = await apiClient.get(endpoint)
      setPrograms(data.programs || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar programas sociais')
    } finally {
      setLoading(false)
    }
  }, [])

  const createProgram = useCallback(async (data: CreateSocialProgramData): Promise<SocialProgram> => {
    try {
      setError(null)
      const response = await apiClient.post('/api/secretarias/social-assistance/programs', data)
      const newProgram = response.program
      setPrograms(prev => [newProgram, ...prev])
      return newProgram
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar programa'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const updateProgram = useCallback(async (id: string, data: UpdateSocialProgramData): Promise<SocialProgram> => {
    try {
      setError(null)
      const response = await apiClient.put(`/api/secretarias/social-assistance/programs/${id}`, data)
      const updatedProgram = response.program
      setPrograms(prev => prev.map(program =>
        program.id === id ? updatedProgram : program
      ))
      return updatedProgram
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar programa'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const activateProgram = useCallback(async (id: string): Promise<SocialProgram> => {
    return updateProgram(id, { status: 'ACTIVE' })
  }, [updateProgram])

  const suspendProgram = useCallback(async (id: string, reason: string): Promise<SocialProgram> => {
    return updateProgram(id, { status: 'SUSPENDED' })
  }, [updateProgram])

  const terminateProgram = useCallback(async (id: string, reason: string): Promise<SocialProgram> => {
    return updateProgram(id, { status: 'TERMINATED' })
  }, [updateProgram])

  const deleteProgram = useCallback(async (id: string): Promise<void> => {
    try {
      setError(null)
      await apiClient.delete(`/api/secretarias/social-assistance/programs/${id}`)
      setPrograms(prev => prev.filter(program => program.id !== id))
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao excluir programa'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const updateProgramStatistics = useCallback(async (id: string, statistics: any): Promise<SocialProgram> => {
    return updateProgram(id, { statistics })
  }, [updateProgram])

  const getProgramById = useCallback((id: string): SocialProgram | undefined => {
    return programs.find(program => program.id === id)
  }, [programs])

  const getProgramsByType = useCallback((type: string): SocialProgram[] => {
    return programs.filter(program => program.programType === type)
  }, [programs])

  const getActivePrograms = useCallback((): SocialProgram[] => {
    return programs.filter(program => program.status === 'ACTIVE')
  }, [programs])

  const getProgramsWithCapacity = useCallback((): SocialProgram[] => {
    return programs.filter(program =>
      program.status === 'ACTIVE' && program.currentEnrollments < program.capacity
    )
  }, [programs])

  const getProgramStats = useCallback((filters?: ProgramFilters): ProgramStats => {
    let filteredPrograms = programs

    if (filters) {
      filteredPrograms = programs.filter(program => {
        const matchesType = !filters.programType || program.programType === filters.programType
        const matchesStatus = !filters.status || program.status === filters.status
        const matchesTargetAudience = !filters.targetAudience || program.targetAudience.includes(filters.targetAudience)
        const matchesManagingUnit = !filters.managingUnit || program.managingUnit === filters.managingUnit
        const matchesCapacity = filters.hasCapacity === undefined ||
          (filters.hasCapacity ? program.currentEnrollments < program.capacity : program.currentEnrollments >= program.capacity)
        const matchesBudgetYear = !filters.budgetYear || program.budget.year === filters.budgetYear
        const matchesSearch = !filters.search ||
          program.name.toLowerCase().includes(filters.search.toLowerCase()) ||
          program.description.toLowerCase().includes(filters.search.toLowerCase())

        return matchesType && matchesStatus && matchesTargetAudience && matchesManagingUnit &&
               matchesCapacity && matchesBudgetYear && matchesSearch
      })
    }

    const totalPrograms = filteredPrograms.length
    const activePrograms = filteredPrograms.filter(p => p.status === 'ACTIVE').length
    const totalCapacity = filteredPrograms.reduce((sum, program) => sum + program.capacity, 0)
    const totalEnrollments = filteredPrograms.reduce((sum, program) => sum + program.currentEnrollments, 0)
    const totalBudgetAllocated = filteredPrograms.reduce((sum, program) => sum + program.budget.allocated, 0)
    const totalBudgetSpent = filteredPrograms.reduce((sum, program) => sum + program.budget.spent, 0)

    const byType = filteredPrograms.reduce((acc, program) => {
      acc[program.programType] = (acc[program.programType] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const byStatus = filteredPrograms.reduce((acc, program) => {
      acc[program.status] = (acc[program.status] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const byManagingUnit = filteredPrograms.reduce((acc, program) => {
      acc[program.managingUnit] = (acc[program.managingUnit] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const utilizationRate = totalCapacity > 0 ? (totalEnrollments / totalCapacity) * 100 : 0

    const programsWithStats = filteredPrograms.filter(p => p.statistics?.dropoutRate !== undefined)
    const averageDropoutRate = programsWithStats.length > 0
      ? programsWithStats.reduce((sum, program) => sum + (program.statistics?.dropoutRate || 0), 0) / programsWithStats.length
      : 0

    return {
      totalPrograms,
      activePrograms,
      totalCapacity,
      totalEnrollments,
      totalBudgetAllocated,
      totalBudgetSpent,
      byType,
      byStatus,
      byManagingUnit,
      utilizationRate,
      averageDropoutRate
    }
  }, [programs])

  const refreshPrograms = useCallback(async (filters?: ProgramFilters) => {
    await fetchPrograms(filters)
  }, [fetchPrograms])

  useEffect(() => {
    fetchPrograms(initialFilters)
  }, [fetchPrograms, initialFilters])

  return {
    programs,
    loading,
    error,
    createProgram,
    updateProgram,
    activateProgram,
    suspendProgram,
    terminateProgram,
    deleteProgram,
    getProgramById,
    getProgramsByType,
    getActivePrograms,
    getProgramsWithCapacity,
    updateProgramStatistics,
    getProgramStats,
    refreshPrograms
  }
}