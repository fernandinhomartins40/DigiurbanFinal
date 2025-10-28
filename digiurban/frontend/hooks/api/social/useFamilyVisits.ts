'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAdminAuth } from '@/contexts/AdminAuthContext'

// Types
interface FamilyVisit {
  id: string
  familyId: string
  socialWorkerId: string
  visitType: 'INITIAL' | 'FOLLOW_UP' | 'EMERGENCY' | 'ROUTINE' | 'EVALUATION' | 'MONITORING'
  visitDate: string
  visitTime: string
  duration: number // em minutos
  objectives: string[]
  observations: string
  findings: string
  householdConditions: {
    cleanliness: 'EXCELLENT' | 'GOOD' | 'REGULAR' | 'POOR'
    safety: 'SAFE' | 'MODERATE_RISK' | 'HIGH_RISK'
    adequacy: 'ADEQUATE' | 'NEEDS_IMPROVEMENT' | 'INADEQUATE'
    comments?: string
  }
  familyDynamics: {
    parentingStyle: 'AUTHORITATIVE' | 'AUTHORITARIAN' | 'PERMISSIVE' | 'NEGLECTFUL'
    communicationLevel: 'EXCELLENT' | 'GOOD' | 'REGULAR' | 'POOR'
    conflictLevel: 'LOW' | 'MODERATE' | 'HIGH'
    cohesion: 'STRONG' | 'MODERATE' | 'WEAK'
    comments?: string
  }
  presentMembers: {
    memberId: string
    memberName: string
    wasPresent: boolean
    reasonAbsent?: string
  }[]
  actionsPlan: {
    action: string
    responsible: string
    deadline: string
    status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'
  }[]
  referralsGiven: {
    service: string
    institution: string
    contact: string
    urgency: 'LOW' | 'MEDIUM' | 'HIGH'
    status: 'REFERRED' | 'SCHEDULED' | 'ATTENDED' | 'CANCELLED'
  }[]
  followUpRequired: boolean
  followUpDate?: string
  followUpReason?: string
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW'
  cancellationReason?: string
  nextVisitDate?: string
  family?: {
    id: string
    registrationNumber: string
    responsibleName: string
    address: string
    priority: string
  }
  socialWorker?: {
    id: string
    name: string
    registration: string
    phone: string
  }
  createdAt: string
  updatedAt: string
}

interface CreateFamilyVisitData {
  familyId: string
  socialWorkerId: string
  visitType: 'INITIAL' | 'FOLLOW_UP' | 'EMERGENCY' | 'ROUTINE' | 'EVALUATION' | 'MONITORING'
  visitDate: string
  visitTime: string
  objectives: string[]
  observations?: string
}

interface UpdateFamilyVisitData extends Partial<CreateFamilyVisitData> {
  duration?: number
  findings?: string
  householdConditions?: {
    cleanliness: 'EXCELLENT' | 'GOOD' | 'REGULAR' | 'POOR'
    safety: 'SAFE' | 'MODERATE_RISK' | 'HIGH_RISK'
    adequacy: 'ADEQUATE' | 'NEEDS_IMPROVEMENT' | 'INADEQUATE'
    comments?: string
  }
  familyDynamics?: {
    parentingStyle: 'AUTHORITATIVE' | 'AUTHORITARIAN' | 'PERMISSIVE' | 'NEGLECTFUL'
    communicationLevel: 'EXCELLENT' | 'GOOD' | 'REGULAR' | 'POOR'
    conflictLevel: 'LOW' | 'MODERATE' | 'HIGH'
    cohesion: 'STRONG' | 'MODERATE' | 'WEAK'
    comments?: string
  }
  presentMembers?: {
    memberId: string
    memberName: string
    wasPresent: boolean
    reasonAbsent?: string
  }[]
  actionsPlan?: {
    action: string
    responsible: string
    deadline: string
    status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'
  }[]
  referralsGiven?: {
    service: string
    institution: string
    contact: string
    urgency: 'LOW' | 'MEDIUM' | 'HIGH'
    status: 'REFERRED' | 'SCHEDULED' | 'ATTENDED' | 'CANCELLED'
  }[]
  followUpRequired?: boolean
  followUpDate?: string
  followUpReason?: string
  status?: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW'
  cancellationReason?: string
  nextVisitDate?: string
}

interface VisitFilters {
  familyId?: string
  socialWorkerId?: string
  visitType?: 'INITIAL' | 'FOLLOW_UP' | 'EMERGENCY' | 'ROUTINE' | 'EVALUATION' | 'MONITORING'
  status?: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW'
  dateFrom?: string
  dateTo?: string
  followUpRequired?: boolean
  priority?: string
}

interface VisitStats {
  totalVisits: number
  completedVisits: number
  cancelledVisits: number
  noShowVisits: number
  averageDuration: number
  byType: Record<string, number>
  byStatus: Record<string, number>
  followUpPending: number
  visitsByMonth: Record<string, number>
}

interface UseFamilyVisitsReturn {
  visits: FamilyVisit[]
  loading: boolean
  error: string | null
  createVisit: (data: CreateFamilyVisitData) => Promise<FamilyVisit>
  updateVisit: (id: string, data: UpdateFamilyVisitData) => Promise<FamilyVisit>
  completeVisit: (id: string, data: Partial<UpdateFamilyVisitData>) => Promise<FamilyVisit>
  cancelVisit: (id: string, reason: string) => Promise<FamilyVisit>
  rescheduleVisit: (id: string, newDate: string, newTime: string) => Promise<FamilyVisit>
  deleteVisit: (id: string) => Promise<void>
  getVisitById: (id: string) => FamilyVisit | undefined
  getVisitsByFamily: (familyId: string) => FamilyVisit[]
  getVisitsBySocialWorker: (socialWorkerId: string) => FamilyVisit[]
  getUpcomingVisits: (days?: number) => FamilyVisit[]
  getOverdueFollowUps: () => FamilyVisit[]
  getVisitStats: (filters?: VisitFilters) => VisitStats
  refreshVisits: (filters?: VisitFilters) => Promise<void>
}

export function useFamilyVisits(initialFilters?: VisitFilters): UseFamilyVisitsReturn {
  const [visits, setVisits] = useState<FamilyVisit[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchVisits = useCallback(async (filters?: VisitFilters) => {
    try {
      setLoading(true)
      setError(null)

      const queryParams = new URLSearchParams()
      if (filters?.familyId) queryParams.append('familyId', filters.familyId)
      if (filters?.socialWorkerId) queryParams.append('socialWorkerId', filters.socialWorkerId)
      if (filters?.visitType) queryParams.append('visitType', filters.visitType)
      if (filters?.status) queryParams.append('status', filters.status)
      if (filters?.dateFrom) queryParams.append('dateFrom', filters.dateFrom)
      if (filters?.dateTo) queryParams.append('dateTo', filters.dateTo)
      if (filters?.followUpRequired !== undefined) queryParams.append('followUpRequired', filters.followUpRequired.toString())
      if (filters?.priority) queryParams.append('priority', filters.priority)

      const query = queryParams.toString()
      const endpoint = `/api/secretarias/social-assistance/visits${query ? `?${query}` : ''}`

      const data = await apiClient.get(endpoint)
      setVisits(data.visits || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar visitas familiares')
    } finally {
      setLoading(false)
    }
  }, [])

  const createVisit = useCallback(async (data: CreateFamilyVisitData): Promise<FamilyVisit> => {
    try {
      setError(null)
      const response = await apiClient.post('/api/secretarias/social-assistance/visits', data)
      const newVisit = response.visit
      setVisits(prev => [newVisit, ...prev])
      return newVisit
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao agendar visita'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const updateVisit = useCallback(async (id: string, data: UpdateFamilyVisitData): Promise<FamilyVisit> => {
    try {
      setError(null)
      const response = await apiClient.put(`/api/secretarias/social-assistance/visits/${id}`, data)
      const updatedVisit = response.visit
      setVisits(prev => prev.map(visit =>
        visit.id === id ? updatedVisit : visit
      ))
      return updatedVisit
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar visita'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const completeVisit = useCallback(async (id: string, data: Partial<UpdateFamilyVisitData>): Promise<FamilyVisit> => {
    return updateVisit(id, {
      ...data,
      status: 'COMPLETED'
    })
  }, [updateVisit])

  const cancelVisit = useCallback(async (id: string, reason: string): Promise<FamilyVisit> => {
    return updateVisit(id, {
      status: 'CANCELLED',
      cancellationReason: reason
    })
  }, [updateVisit])

  const rescheduleVisit = useCallback(async (id: string, newDate: string, newTime: string): Promise<FamilyVisit> => {
    return updateVisit(id, {
      visitDate: newDate,
      visitTime: newTime,
      status: 'SCHEDULED'
    })
  }, [updateVisit])

  const deleteVisit = useCallback(async (id: string): Promise<void> => {
    try {
      setError(null)
      await apiClient.delete(`/api/secretarias/social-assistance/visits/${id}`)
      setVisits(prev => prev.filter(visit => visit.id !== id))
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao excluir visita'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const getVisitById = useCallback((id: string): FamilyVisit | undefined => {
    return visits.find(visit => visit.id === id)
  }, [visits])

  const getVisitsByFamily = useCallback((familyId: string): FamilyVisit[] => {
    return visits.filter(visit => visit.familyId === familyId)
      .sort((a, b) => new Date(b.visitDate).getTime() - new Date(a.visitDate).getTime())
  }, [visits])

  const getVisitsBySocialWorker = useCallback((socialWorkerId: string): FamilyVisit[] => {
    return visits.filter(visit => visit.socialWorkerId === socialWorkerId)
      .sort((a, b) => new Date(a.visitDate).getTime() - new Date(b.visitDate).getTime())
  }, [visits])

  const getUpcomingVisits = useCallback((days: number = 7): FamilyVisit[] => {
    const today = new Date()
    const futureDate = new Date()
    futureDate.setDate(today.getDate() + days)

    return visits.filter(visit => {
      const visitDate = new Date(visit.visitDate)
      return visitDate >= today && visitDate <= futureDate && visit.status === 'SCHEDULED'
    }).sort((a, b) => new Date(a.visitDate).getTime() - new Date(b.visitDate).getTime())
  }, [visits])

  const getOverdueFollowUps = useCallback((): FamilyVisit[] => {
    const today = new Date()
    return visits.filter(visit => {
      if (!visit.followUpRequired || !visit.followUpDate) return false
      const followUpDate = new Date(visit.followUpDate)
      return followUpDate < today && visit.status === 'COMPLETED'
    }).sort((a, b) => new Date(a.followUpDate!).getTime() - new Date(b.followUpDate!).getTime())
  }, [visits])

  const getVisitStats = useCallback((filters?: VisitFilters): VisitStats => {
    let filteredVisits = visits

    if (filters) {
      filteredVisits = visits.filter(visit => {
        const matchesFamily = !filters.familyId || visit.familyId === filters.familyId
        const matchesSocialWorker = !filters.socialWorkerId || visit.socialWorkerId === filters.socialWorkerId
        const matchesType = !filters.visitType || visit.visitType === filters.visitType
        const matchesStatus = !filters.status || visit.status === filters.status
        const matchesDateFrom = !filters.dateFrom || visit.visitDate >= filters.dateFrom
        const matchesDateTo = !filters.dateTo || visit.visitDate <= filters.dateTo
        const matchesFollowUp = filters.followUpRequired === undefined || visit.followUpRequired === filters.followUpRequired

        return matchesFamily && matchesSocialWorker && matchesType && matchesStatus &&
               matchesDateFrom && matchesDateTo && matchesFollowUp
      })
    }

    const totalVisits = filteredVisits.length
    const completedVisits = filteredVisits.filter(v => v.status === 'COMPLETED').length
    const cancelledVisits = filteredVisits.filter(v => v.status === 'CANCELLED').length
    const noShowVisits = filteredVisits.filter(v => v.status === 'NO_SHOW').length

    const averageDuration = completedVisits > 0
      ? filteredVisits
          .filter(v => v.status === 'COMPLETED' && v.duration)
          .reduce((sum, visit) => sum + (visit.duration || 0), 0) / completedVisits
      : 0

    const byType = filteredVisits.reduce((acc, visit) => {
      acc[visit.visitType] = (acc[visit.visitType] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const byStatus = filteredVisits.reduce((acc, visit) => {
      acc[visit.status] = (acc[visit.status] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const followUpPending = filteredVisits.filter(v =>
      v.followUpRequired && v.status === 'COMPLETED' && v.followUpDate && new Date(v.followUpDate) < new Date()
    ).length

    const visitsByMonth = filteredVisits.reduce((acc, visit) => {
      const month = visit.visitDate.substring(0, 7) // YYYY-MM
      acc[month] = (acc[month] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return {
      totalVisits,
      completedVisits,
      cancelledVisits,
      noShowVisits,
      averageDuration,
      byType,
      byStatus,
      followUpPending,
      visitsByMonth
    }
  }, [visits])

  const refreshVisits = useCallback(async (filters?: VisitFilters) => {
    await fetchVisits(filters)
  }, [fetchVisits])

  useEffect(() => {
    fetchVisits(initialFilters)
  }, [fetchVisits, initialFilters])

  return {
    visits,
    loading,
    error,
    createVisit,
    updateVisit,
    completeVisit,
    cancelVisit,
    rescheduleVisit,
    deleteVisit,
    getVisitById,
    getVisitsByFamily,
    getVisitsBySocialWorker,
    getUpcomingVisits,
    getOverdueFollowUps,
    getVisitStats,
    refreshVisits
  }
}