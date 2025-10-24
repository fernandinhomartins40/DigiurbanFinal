'use client'

import { useState, useEffect, useCallback } from 'react'
import { apiClient } from '@/lib/auth'

interface FamilyBenefit {
  id: string
  familyId: string
  programId: string
  benefitType: 'MONETARY' | 'IN_KIND' | 'SERVICE' | 'SUBSIDY'
  value: number
  status: 'ACTIVE' | 'PENDING' | 'SUSPENDED' | 'CANCELLED' | 'EXPIRED'
  startDate: string
  endDate?: string
  frequency: 'MONTHLY' | 'QUARTERLY' | 'SEMI_ANNUAL' | 'ANNUAL' | 'ONE_TIME'
  lastPaymentDate?: string
  nextPaymentDate?: string
  totalPaid: number
  family?: { id: string; responsibleName: string; registrationNumber: string }
  program?: { id: string; name: string; description: string }
  createdAt: string
  updatedAt: string
}

interface CreateFamilyBenefitData {
  familyId: string
  programId: string
  benefitType: 'MONETARY' | 'IN_KIND' | 'SERVICE' | 'SUBSIDY'
  value: number
  startDate: string
  endDate?: string
  frequency: 'MONTHLY' | 'QUARTERLY' | 'SEMI_ANNUAL' | 'ANNUAL' | 'ONE_TIME'
}

interface UpdateFamilyBenefitData extends Partial<CreateFamilyBenefitData> {
  status?: 'ACTIVE' | 'PENDING' | 'SUSPENDED' | 'CANCELLED' | 'EXPIRED'
  lastPaymentDate?: string
  nextPaymentDate?: string
  totalPaid?: number
}

interface BenefitFilters {
  familyId?: string
  programId?: string
  benefitType?: 'MONETARY' | 'IN_KIND' | 'SERVICE' | 'SUBSIDY'
  status?: 'ACTIVE' | 'PENDING' | 'SUSPENDED' | 'CANCELLED' | 'EXPIRED'
  frequency?: 'MONTHLY' | 'QUARTERLY' | 'SEMI_ANNUAL' | 'ANNUAL' | 'ONE_TIME'
}

interface UseFamilyBenefitsReturn {
  benefits: FamilyBenefit[]
  loading: boolean
  error: string | null
  createBenefit: (data: CreateFamilyBenefitData) => Promise<FamilyBenefit>
  updateBenefit: (id: string, data: UpdateFamilyBenefitData) => Promise<FamilyBenefit>
  suspendBenefit: (id: string, reason: string) => Promise<FamilyBenefit>
  cancelBenefit: (id: string, reason: string) => Promise<FamilyBenefit>
  deleteBenefit: (id: string) => Promise<void>
  getBenefitById: (id: string) => FamilyBenefit | undefined
  getBenefitsByFamily: (familyId: string) => FamilyBenefit[]
  getBenefitsByProgram: (programId: string) => FamilyBenefit[]
  refreshBenefits: (filters?: BenefitFilters) => Promise<void>
}

export function useFamilyBenefits(initialFilters?: BenefitFilters): UseFamilyBenefitsReturn {
  const [benefits, setBenefits] = useState<FamilyBenefit[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchBenefits = useCallback(async (filters?: BenefitFilters) => {
    try {
      setLoading(true)
      setError(null)
      const queryParams = new URLSearchParams()
      if (filters?.familyId) queryParams.append('familyId', filters.familyId)
      if (filters?.programId) queryParams.append('programId', filters.programId)
      if (filters?.benefitType) queryParams.append('benefitType', filters.benefitType)
      if (filters?.status) queryParams.append('status', filters.status)
      if (filters?.frequency) queryParams.append('frequency', filters.frequency)

      const query = queryParams.toString()
      const endpoint = `/api/specialized/social-assistance/benefits${query ? `?${query}` : ''}`
      const data = await apiClient.get(endpoint)
      setBenefits(data.benefits || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar benefícios')
    } finally {
      setLoading(false)
    }
  }, [])

  const createBenefit = useCallback(async (data: CreateFamilyBenefitData): Promise<FamilyBenefit> => {
    try {
      setError(null)
      const response = await apiClient.post('/api/specialized/social-assistance/benefits', data)
      const newBenefit = response.benefit
      setBenefits(prev => [newBenefit, ...prev])
      return newBenefit
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar benefício'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const updateBenefit = useCallback(async (id: string, data: UpdateFamilyBenefitData): Promise<FamilyBenefit> => {
    try {
      setError(null)
      const response = await apiClient.put(`/api/specialized/social-assistance/benefits/${id}`, data)
      const updatedBenefit = response.benefit
      setBenefits(prev => prev.map(benefit => benefit.id === id ? updatedBenefit : benefit))
      return updatedBenefit
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar benefício'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const suspendBenefit = useCallback(async (id: string, reason: string): Promise<FamilyBenefit> => {
    return updateBenefit(id, { status: 'SUSPENDED' })
  }, [updateBenefit])

  const cancelBenefit = useCallback(async (id: string, reason: string): Promise<FamilyBenefit> => {
    return updateBenefit(id, { status: 'CANCELLED' })
  }, [updateBenefit])

  const deleteBenefit = useCallback(async (id: string): Promise<void> => {
    try {
      setError(null)
      await apiClient.delete(`/api/specialized/social-assistance/benefits/${id}`)
      setBenefits(prev => prev.filter(benefit => benefit.id !== id))
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao excluir benefício'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const getBenefitById = useCallback((id: string) => benefits.find(benefit => benefit.id === id), [benefits])
  const getBenefitsByFamily = useCallback((familyId: string) => benefits.filter(benefit => benefit.familyId === familyId), [benefits])
  const getBenefitsByProgram = useCallback((programId: string) => benefits.filter(benefit => benefit.programId === programId), [benefits])

  const refreshBenefits = useCallback(async (filters?: BenefitFilters) => {
    await fetchBenefits(filters)
  }, [fetchBenefits])

  useEffect(() => {
    fetchBenefits(initialFilters)
  }, [fetchBenefits, initialFilters])

  return {
    benefits,
    loading,
    error,
    createBenefit,
    updateBenefit,
    suspendBenefit,
    cancelBenefit,
    deleteBenefit,
    getBenefitById,
    getBenefitsByFamily,
    getBenefitsByProgram,
    refreshBenefits
  }
}