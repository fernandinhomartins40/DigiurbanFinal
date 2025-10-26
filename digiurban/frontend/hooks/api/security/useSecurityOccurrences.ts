'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAdminAuth } from '@/contexts/AdminAuthContext'

interface SecurityOccurrence {
  id: string
  incidentNumber: string
  type: 'THEFT' | 'ROBBERY' | 'ASSAULT' | 'VANDALISM' | 'DRUG_TRAFFICKING' | 'DOMESTIC_VIOLENCE' | 'PUBLIC_DISTURBANCE' | 'ACCIDENT' | 'OTHER'
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  status: 'REPORTED' | 'INVESTIGATING' | 'RESOLVED' | 'CLOSED'
  date: string
  time: string
  location: string
  coordinates?: { lat: number; lng: number }
  description: string
  involvedPersons: { name: string; role: 'VICTIM' | 'SUSPECT' | 'WITNESS'; age?: number; identification?: string }[]
  reportedBy: string
  reporterContact: string
  assignedOfficer?: string
  actionsTaken: string[]
  evidence: string[]
  followUpRequired: boolean
  followUpDate?: string
  resolution?: string
  createdAt: string
  updatedAt: string
}

interface CreateSecurityOccurrenceData {
  type: 'THEFT' | 'ROBBERY' | 'ASSAULT' | 'VANDALISM' | 'DRUG_TRAFFICKING' | 'DOMESTIC_VIOLENCE' | 'PUBLIC_DISTURBANCE' | 'ACCIDENT' | 'OTHER'
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  date: string
  time: string
  location: string
  coordinates?: { lat: number; lng: number }
  description: string
  involvedPersons: { name: string; role: 'VICTIM' | 'SUSPECT' | 'WITNESS'; age?: number; identification?: string }[]
  reportedBy: string
  reporterContact: string
}

interface UpdateSecurityOccurrenceData extends Partial<CreateSecurityOccurrenceData> {
  status?: 'REPORTED' | 'INVESTIGATING' | 'RESOLVED' | 'CLOSED'
  assignedOfficer?: string
  actionsTaken?: string[]
  evidence?: string[]
  followUpRequired?: boolean
  followUpDate?: string
  resolution?: string
}

interface OccurrenceFilters {
  type?: string
  priority?: string
  status?: string
  dateFrom?: string
  dateTo?: string
  location?: string
  assignedOfficer?: string
}

interface UseSecurityOccurrencesReturn {
  occurrences: SecurityOccurrence[]
  loading: boolean
  error: string | null
  createOccurrence: (data: CreateSecurityOccurrenceData) => Promise<SecurityOccurrence>
  updateOccurrence: (id: string, data: UpdateSecurityOccurrenceData) => Promise<SecurityOccurrence>
  closeOccurrence: (id: string, resolution: string) => Promise<SecurityOccurrence>
  assignOfficer: (id: string, officerId: string) => Promise<SecurityOccurrence>
  deleteOccurrence: (id: string) => Promise<void>
  getOccurrenceById: (id: string) => SecurityOccurrence | undefined
  getOccurrencesByLocation: (location: string) => SecurityOccurrence[]
  getHighPriorityOccurrences: () => SecurityOccurrence[]
  refreshOccurrences: (filters?: OccurrenceFilters) => Promise<void>
}

export function useSecurityOccurrences(initialFilters?: OccurrenceFilters): UseSecurityOccurrencesReturn {
  const [occurrences, setOccurrences] = useState<SecurityOccurrence[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchOccurrences = useCallback(async (filters?: OccurrenceFilters) => {
    try {
      setLoading(true)
      setError(null)
      const queryParams = new URLSearchParams()
      if (filters?.type) queryParams.append('type', filters.type)
      if (filters?.priority) queryParams.append('priority', filters.priority)
      if (filters?.status) queryParams.append('status', filters.status)
      if (filters?.dateFrom) queryParams.append('dateFrom', filters.dateFrom)
      if (filters?.dateTo) queryParams.append('dateTo', filters.dateTo)
      if (filters?.location) queryParams.append('location', filters.location)
      if (filters?.assignedOfficer) queryParams.append('assignedOfficer', filters.assignedOfficer)

      const query = queryParams.toString()
      const endpoint = `/api/specialized/security/occurrences${query ? `?${query}` : ''}`
      const data = await apiClient.get(endpoint)
      setOccurrences(data.occurrences || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar ocorrências')
    } finally {
      setLoading(false)
    }
  }, [])

  const createOccurrence = useCallback(async (data: CreateSecurityOccurrenceData): Promise<SecurityOccurrence> => {
    try {
      setError(null)
      const response = await apiClient.post('/api/specialized/security/occurrences', data)
      const newOccurrence = response.occurrence
      setOccurrences(prev => [newOccurrence, ...prev])
      return newOccurrence
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao registrar ocorrência'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const updateOccurrence = useCallback(async (id: string, data: UpdateSecurityOccurrenceData): Promise<SecurityOccurrence> => {
    try {
      setError(null)
      const response = await apiClient.put(`/api/specialized/security/occurrences/${id}`, data)
      const updatedOccurrence = response.occurrence
      setOccurrences(prev => prev.map(occ => occ.id === id ? updatedOccurrence : occ))
      return updatedOccurrence
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar ocorrência'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const closeOccurrence = useCallback(async (id: string, resolution: string): Promise<SecurityOccurrence> => {
    return updateOccurrence(id, { status: 'CLOSED', resolution })
  }, [updateOccurrence])

  const assignOfficer = useCallback(async (id: string, officerId: string): Promise<SecurityOccurrence> => {
    return updateOccurrence(id, { assignedOfficer: officerId, status: 'INVESTIGATING' })
  }, [updateOccurrence])

  const deleteOccurrence = useCallback(async (id: string): Promise<void> => {
    try {
      setError(null)
      await apiClient.delete(`/api/specialized/security/occurrences/${id}`)
      setOccurrences(prev => prev.filter(occ => occ.id !== id))
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao excluir ocorrência'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const getOccurrenceById = useCallback((id: string) => occurrences.find(occ => occ.id === id), [occurrences])
  const getOccurrencesByLocation = useCallback((location: string) => occurrences.filter(occ => occ.location.includes(location)), [occurrences])
  const getHighPriorityOccurrences = useCallback(() => occurrences.filter(occ => ['HIGH', 'CRITICAL'].includes(occ.priority)), [occurrences])

  const refreshOccurrences = useCallback(async (filters?: OccurrenceFilters) => {
    await fetchOccurrences(filters)
  }, [fetchOccurrences])

  useEffect(() => {
    fetchOccurrences(initialFilters)
  }, [fetchOccurrences, initialFilters])

  return {
    occurrences,
    loading,
    error,
    createOccurrence,
    updateOccurrence,
    closeOccurrence,
    assignOfficer,
    deleteOccurrence,
    getOccurrenceById,
    getOccurrencesByLocation,
    getHighPriorityOccurrences,
    refreshOccurrences
  }
}