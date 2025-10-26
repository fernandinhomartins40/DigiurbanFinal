'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAdminAuth } from '@/contexts/AdminAuthContext'

// Types
interface VulnerableFamily {
  id: string
  registrationNumber: string
  responsibleName: string
  responsibleCpf: string
  responsibleRg?: string
  responsiblePhone: string
  responsibleEmail?: string
  address: string
  neighborhood: string
  city: string
  zipCode: string
  monthlyIncome: number
  familySize: number
  housingType: 'OWNED' | 'RENTED' | 'BORROWED' | 'INVADED' | 'OTHER'
  housingCondition: 'GOOD' | 'REGULAR' | 'POOR' | 'VERY_POOR'
  hasElectricity: boolean
  hasWater: boolean
  hasSewage: boolean
  vulnerabilityType: ('EXTREME_POVERTY' | 'UNEMPLOYMENT' | 'ELDERLY' | 'CHILDREN' | 'DISABLED' | 'VIOLENCE' | 'SUBSTANCE_ABUSE' | 'HEALTH_ISSUES')[]
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  observations?: string
  status: 'ACTIVE' | 'INACTIVE' | 'TRANSFERRED' | 'GRADUATED'
  registrationDate: string
  lastUpdateDate: string
  lastVisitDate?: string
  referencePersonName: string
  referencePersonPhone: string
  familyMembers?: {
    id: string
    name: string
    relationship: string
    age: number
    cpf?: string
    hasDisability: boolean
    isStudying: boolean
    isWorking: boolean
    healthIssues?: string
  }[]
  benefits?: {
    id: string
    benefitName: string
    status: 'ACTIVE' | 'PENDING' | 'SUSPENDED' | 'CANCELLED'
    startDate: string
    endDate?: string
    value: number
  }[]
  visits?: {
    id: string
    visitDate: string
    visitType: string
    socialWorkerName: string
    observations: string
  }[]
  createdAt: string
  updatedAt: string
}

interface CreateVulnerableFamilyData {
  responsibleName: string
  responsibleCpf: string
  responsibleRg?: string
  responsiblePhone: string
  responsibleEmail?: string
  address: string
  neighborhood: string
  city: string
  zipCode: string
  monthlyIncome: number
  familySize: number
  housingType: 'OWNED' | 'RENTED' | 'BORROWED' | 'INVADED' | 'OTHER'
  housingCondition: 'GOOD' | 'REGULAR' | 'POOR' | 'VERY_POOR'
  hasElectricity: boolean
  hasWater: boolean
  hasSewage: boolean
  vulnerabilityType: ('EXTREME_POVERTY' | 'UNEMPLOYMENT' | 'ELDERLY' | 'CHILDREN' | 'DISABLED' | 'VIOLENCE' | 'SUBSTANCE_ABUSE' | 'HEALTH_ISSUES')[]
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  observations?: string
  referencePersonName: string
  referencePersonPhone: string
  familyMembers: {
    name: string
    relationship: string
    age: number
    cpf?: string
    hasDisability: boolean
    isStudying: boolean
    isWorking: boolean
    healthIssues?: string
  }[]
}

interface UpdateVulnerableFamilyData extends Partial<CreateVulnerableFamilyData> {
  status?: 'ACTIVE' | 'INACTIVE' | 'TRANSFERRED' | 'GRADUATED'
  lastVisitDate?: string
}

interface FamilyFilters {
  status?: 'ACTIVE' | 'INACTIVE' | 'TRANSFERRED' | 'GRADUATED'
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  vulnerabilityType?: string
  neighborhood?: string
  city?: string
  monthlyIncomeMax?: number
  familySizeMin?: number
  hasChildren?: boolean
  hasElderly?: boolean
  hasDisabled?: boolean
  search?: string
}

interface FamilyStats {
  totalFamilies: number
  activeFamilies: number
  byPriority: Record<string, number>
  byVulnerabilityType: Record<string, number>
  byNeighborhood: Record<string, number>
  averageFamilySize: number
  averageIncome: number
  childrenCount: number
  elderlyCount: number
  disabledCount: number
}

interface UseVulnerableFamiliesReturn {
  families: VulnerableFamily[]
  loading: boolean
  error: string | null
  createFamily: (data: CreateVulnerableFamilyData) => Promise<VulnerableFamily>
  updateFamily: (id: string, data: UpdateVulnerableFamilyData) => Promise<VulnerableFamily>
  deleteFamily: (id: string) => Promise<void>
  getFamilyById: (id: string) => VulnerableFamily | undefined
  getFamiliesByNeighborhood: (neighborhood: string) => VulnerableFamily[]
  getFamiliesByPriority: (priority: string) => VulnerableFamily[]
  addFamilyMember: (familyId: string, member: any) => Promise<VulnerableFamily>
  removeFamilyMember: (familyId: string, memberId: string) => Promise<VulnerableFamily>
  getFamilyStats: (filters?: FamilyFilters) => FamilyStats
  refreshFamilies: (filters?: FamilyFilters) => Promise<void>
}

export function useVulnerableFamilies(initialFilters?: FamilyFilters): UseVulnerableFamiliesReturn {
  const [families, setFamilies] = useState<VulnerableFamily[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchFamilies = useCallback(async (filters?: FamilyFilters) => {
    try {
      setLoading(true)
      setError(null)

      const queryParams = new URLSearchParams()
      if (filters?.status) queryParams.append('status', filters.status)
      if (filters?.priority) queryParams.append('priority', filters.priority)
      if (filters?.vulnerabilityType) queryParams.append('vulnerabilityType', filters.vulnerabilityType)
      if (filters?.neighborhood) queryParams.append('neighborhood', filters.neighborhood)
      if (filters?.city) queryParams.append('city', filters.city)
      if (filters?.monthlyIncomeMax) queryParams.append('monthlyIncomeMax', filters.monthlyIncomeMax.toString())
      if (filters?.familySizeMin) queryParams.append('familySizeMin', filters.familySizeMin.toString())
      if (filters?.hasChildren !== undefined) queryParams.append('hasChildren', filters.hasChildren.toString())
      if (filters?.hasElderly !== undefined) queryParams.append('hasElderly', filters.hasElderly.toString())
      if (filters?.hasDisabled !== undefined) queryParams.append('hasDisabled', filters.hasDisabled.toString())
      if (filters?.search) queryParams.append('search', filters.search)

      const query = queryParams.toString()
      const endpoint = `/api/specialized/social-assistance/families${query ? `?${query}` : ''}`

      const data = await apiClient.get(endpoint)
      setFamilies(data.families || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar famílias vulneráveis')
    } finally {
      setLoading(false)
    }
  }, [])

  const createFamily = useCallback(async (data: CreateVulnerableFamilyData): Promise<VulnerableFamily> => {
    try {
      setError(null)
      const response = await apiClient.post('/api/specialized/social-assistance/families', data)
      const newFamily = response.family
      setFamilies(prev => [newFamily, ...prev])
      return newFamily
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao cadastrar família'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const updateFamily = useCallback(async (id: string, data: UpdateVulnerableFamilyData): Promise<VulnerableFamily> => {
    try {
      setError(null)
      const response = await apiClient.put(`/api/specialized/social-assistance/families/${id}`, data)
      const updatedFamily = response.family
      setFamilies(prev => prev.map(family =>
        family.id === id ? updatedFamily : family
      ))
      return updatedFamily
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar família'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const deleteFamily = useCallback(async (id: string): Promise<void> => {
    try {
      setError(null)
      await apiClient.delete(`/api/specialized/social-assistance/families/${id}`)
      setFamilies(prev => prev.filter(family => family.id !== id))
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao excluir família'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const addFamilyMember = useCallback(async (familyId: string, member: any): Promise<VulnerableFamily> => {
    try {
      setError(null)
      const response = await apiClient.post(`/api/specialized/social-assistance/families/${familyId}/members`, member)
      const updatedFamily = response.family
      setFamilies(prev => prev.map(family =>
        family.id === familyId ? updatedFamily : family
      ))
      return updatedFamily
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao adicionar membro da família'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const removeFamilyMember = useCallback(async (familyId: string, memberId: string): Promise<VulnerableFamily> => {
    try {
      setError(null)
      const response = await apiClient.delete(`/api/specialized/social-assistance/families/${familyId}/members/${memberId}`)
      const updatedFamily = response.family
      setFamilies(prev => prev.map(family =>
        family.id === familyId ? updatedFamily : family
      ))
      return updatedFamily
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao remover membro da família'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const getFamilyById = useCallback((id: string): VulnerableFamily | undefined => {
    return families.find(family => family.id === id)
  }, [families])

  const getFamiliesByNeighborhood = useCallback((neighborhood: string): VulnerableFamily[] => {
    return families.filter(family => family.neighborhood === neighborhood)
  }, [families])

  const getFamiliesByPriority = useCallback((priority: string): VulnerableFamily[] => {
    return families.filter(family => family.priority === priority)
  }, [families])

  const getFamilyStats = useCallback((filters?: FamilyFilters): FamilyStats => {
    let filteredFamilies = families

    if (filters) {
      filteredFamilies = families.filter(family => {
        const matchesStatus = !filters.status || family.status === filters.status
        const matchesPriority = !filters.priority || family.priority === filters.priority
        const matchesVulnerability = !filters.vulnerabilityType || family.vulnerabilityType.includes(filters.vulnerabilityType as any)
        const matchesNeighborhood = !filters.neighborhood || family.neighborhood === filters.neighborhood
        const matchesCity = !filters.city || family.city === filters.city
        const matchesIncome = !filters.monthlyIncomeMax || family.monthlyIncome <= filters.monthlyIncomeMax
        const matchesFamilySize = !filters.familySizeMin || family.familySize >= filters.familySizeMin

        let matchesChildren = true
        let matchesElderly = true
        let matchesDisabled = true

        if (filters.hasChildren !== undefined) {
          const hasChildren = family.familyMembers?.some(member => member.age < 18) || false
          matchesChildren = hasChildren === filters.hasChildren
        }

        if (filters.hasElderly !== undefined) {
          const hasElderly = family.familyMembers?.some(member => member.age >= 60) || false
          matchesElderly = hasElderly === filters.hasElderly
        }

        if (filters.hasDisabled !== undefined) {
          const hasDisabled = family.familyMembers?.some(member => member.hasDisability) || false
          matchesDisabled = hasDisabled === filters.hasDisabled
        }

        const matchesSearch = !filters.search ||
          family.responsibleName.toLowerCase().includes(filters.search.toLowerCase()) ||
          family.responsibleCpf.includes(filters.search) ||
          family.registrationNumber.includes(filters.search)

        return matchesStatus && matchesPriority && matchesVulnerability && matchesNeighborhood &&
               matchesCity && matchesIncome && matchesFamilySize && matchesChildren &&
               matchesElderly && matchesDisabled && matchesSearch
      })
    }

    const totalFamilies = filteredFamilies.length
    const activeFamilies = filteredFamilies.filter(f => f.status === 'ACTIVE').length

    const byPriority = filteredFamilies.reduce((acc, family) => {
      acc[family.priority] = (acc[family.priority] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const byVulnerabilityType = filteredFamilies.reduce((acc, family) => {
      family.vulnerabilityType.forEach(type => {
        acc[type] = (acc[type] || 0) + 1
      })
      return acc
    }, {} as Record<string, number>)

    const byNeighborhood = filteredFamilies.reduce((acc, family) => {
      acc[family.neighborhood] = (acc[family.neighborhood] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const averageFamilySize = totalFamilies > 0
      ? filteredFamilies.reduce((sum, family) => sum + family.familySize, 0) / totalFamilies
      : 0

    const averageIncome = totalFamilies > 0
      ? filteredFamilies.reduce((sum, family) => sum + family.monthlyIncome, 0) / totalFamilies
      : 0

    const childrenCount = filteredFamilies.reduce((count, family) =>
      count + (family.familyMembers?.filter(member => member.age < 18).length || 0), 0
    )

    const elderlyCount = filteredFamilies.reduce((count, family) =>
      count + (family.familyMembers?.filter(member => member.age >= 60).length || 0), 0
    )

    const disabledCount = filteredFamilies.reduce((count, family) =>
      count + (family.familyMembers?.filter(member => member.hasDisability).length || 0), 0
    )

    return {
      totalFamilies,
      activeFamilies,
      byPriority,
      byVulnerabilityType,
      byNeighborhood,
      averageFamilySize,
      averageIncome,
      childrenCount,
      elderlyCount,
      disabledCount
    }
  }, [families])

  const refreshFamilies = useCallback(async (filters?: FamilyFilters) => {
    await fetchFamilies(filters)
  }, [fetchFamilies])

  useEffect(() => {
    fetchFamilies(initialFilters)
  }, [fetchFamilies, initialFilters])

  return {
    families,
    loading,
    error,
    createFamily,
    updateFamily,
    deleteFamily,
    getFamilyById,
    getFamiliesByNeighborhood,
    getFamiliesByPriority,
    addFamilyMember,
    removeFamilyMember,
    getFamilyStats,
    refreshFamilies
  }
}