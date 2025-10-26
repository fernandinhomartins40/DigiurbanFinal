'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAdminAuth } from '@/contexts/AdminAuthContext'

// Types
interface SchoolIncident {
  id: string
  schoolId: string
  studentId?: string
  incidentType: 'DISCIPLINARY' | 'ACCIDENT' | 'HEALTH' | 'BULLYING' | 'VIOLENCE' | 'PROPERTY_DAMAGE' | 'OTHER'
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  title: string
  description: string
  location: string
  date: string
  time: string
  reportedBy: string
  reporterRole: 'TEACHER' | 'COORDINATOR' | 'PRINCIPAL' | 'STAFF' | 'STUDENT' | 'PARENT' | 'OTHER'
  witnessNames?: string[]
  actionsThken?: string
  followUpRequired: boolean
  followUpDate?: string
  followUpNotes?: string
  parentNotified: boolean
  parentNotificationDate?: string
  parentNotificationMethod?: 'PHONE' | 'EMAIL' | 'IN_PERSON' | 'WRITTEN'
  status: 'OPEN' | 'INVESTIGATING' | 'RESOLVED' | 'CLOSED'
  resolutionNotes?: string
  closedBy?: string
  closedAt?: string
  attachments?: string[]
  student?: {
    id: string
    name: string
    registrationNumber: string
    class?: {
      id: string
      name: string
      grade: string
    }
  }
  school?: {
    id: string
    name: string
  }
  createdAt: string
  updatedAt: string
}

interface CreateSchoolIncidentData {
  schoolId: string
  studentId?: string
  incidentType: 'DISCIPLINARY' | 'ACCIDENT' | 'HEALTH' | 'BULLYING' | 'VIOLENCE' | 'PROPERTY_DAMAGE' | 'OTHER'
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  title: string
  description: string
  location: string
  date: string
  time: string
  reportedBy: string
  reporterRole: 'TEACHER' | 'COORDINATOR' | 'PRINCIPAL' | 'STAFF' | 'STUDENT' | 'PARENT' | 'OTHER'
  witnessNames?: string[]
  actionsThken?: string
  followUpRequired: boolean
  followUpDate?: string
  parentNotified: boolean
  parentNotificationMethod?: 'PHONE' | 'EMAIL' | 'IN_PERSON' | 'WRITTEN'
}

interface UpdateSchoolIncidentData extends Partial<CreateSchoolIncidentData> {
  followUpNotes?: string
  parentNotificationDate?: string
  status?: 'OPEN' | 'INVESTIGATING' | 'RESOLVED' | 'CLOSED'
  resolutionNotes?: string
}

interface IncidentFilters {
  schoolId?: string
  studentId?: string
  incidentType?: 'DISCIPLINARY' | 'ACCIDENT' | 'HEALTH' | 'BULLYING' | 'VIOLENCE' | 'PROPERTY_DAMAGE' | 'OTHER'
  severity?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  status?: 'OPEN' | 'INVESTIGATING' | 'RESOLVED' | 'CLOSED'
  dateFrom?: string
  dateTo?: string
  followUpRequired?: boolean
}

interface IncidentStats {
  totalIncidents: number
  byType: Record<string, number>
  bySeverity: Record<string, number>
  byStatus: Record<string, number>
  openIncidents: number
  followUpPending: number
}

interface UseSchoolIncidentsReturn {
  incidents: SchoolIncident[]
  loading: boolean
  error: string | null
  createIncident: (data: CreateSchoolIncidentData) => Promise<SchoolIncident>
  updateIncident: (id: string, data: UpdateSchoolIncidentData) => Promise<SchoolIncident>
  closeIncident: (id: string, resolutionNotes: string) => Promise<SchoolIncident>
  deleteIncident: (id: string) => Promise<void>
  getIncidentById: (id: string) => SchoolIncident | undefined
  getIncidentsByStudent: (studentId: string) => SchoolIncident[]
  getIncidentsBySchool: (schoolId: string) => SchoolIncident[]
  getIncidentStats: (filters?: IncidentFilters) => IncidentStats
  refreshIncidents: (filters?: IncidentFilters) => Promise<void>
}

export function useSchoolIncidents(initialFilters?: IncidentFilters): UseSchoolIncidentsReturn {
  const [incidents, setIncidents] = useState<SchoolIncident[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchIncidents = useCallback(async (filters?: IncidentFilters) => {
    try {
      setLoading(true)
      setError(null)

      const queryParams = new URLSearchParams()
      if (filters?.schoolId) queryParams.append('schoolId', filters.schoolId)
      if (filters?.studentId) queryParams.append('studentId', filters.studentId)
      if (filters?.incidentType) queryParams.append('incidentType', filters.incidentType)
      if (filters?.severity) queryParams.append('severity', filters.severity)
      if (filters?.status) queryParams.append('status', filters.status)
      if (filters?.dateFrom) queryParams.append('dateFrom', filters.dateFrom)
      if (filters?.dateTo) queryParams.append('dateTo', filters.dateTo)
      if (filters?.followUpRequired !== undefined) queryParams.append('followUpRequired', filters.followUpRequired.toString())

      const query = queryParams.toString()
      const endpoint = `/api/specialized/education/incidents${query ? `?${query}` : ''}`

      const data = await apiClient.get(endpoint)
      setIncidents(data.incidents || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar ocorrências')
    } finally {
      setLoading(false)
    }
  }, [])

  const createIncident = useCallback(async (data: CreateSchoolIncidentData): Promise<SchoolIncident> => {
    try {
      setError(null)
      const response = await apiClient.post('/api/specialized/education/incidents', data)
      const newIncident = response.incident
      setIncidents(prev => [newIncident, ...prev])
      return newIncident
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar ocorrência'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const updateIncident = useCallback(async (id: string, data: UpdateSchoolIncidentData): Promise<SchoolIncident> => {
    try {
      setError(null)
      const response = await apiClient.put(`/api/specialized/education/incidents/${id}`, data)
      const updatedIncident = response.incident
      setIncidents(prev => prev.map(incident =>
        incident.id === id ? updatedIncident : incident
      ))
      return updatedIncident
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar ocorrência'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const closeIncident = useCallback(async (id: string, resolutionNotes: string): Promise<SchoolIncident> => {
    return updateIncident(id, {
      status: 'CLOSED',
      resolutionNotes
    })
  }, [updateIncident])

  const deleteIncident = useCallback(async (id: string): Promise<void> => {
    try {
      setError(null)
      await apiClient.delete(`/api/specialized/education/incidents/${id}`)
      setIncidents(prev => prev.filter(incident => incident.id !== id))
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao excluir ocorrência'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const getIncidentById = useCallback((id: string): SchoolIncident | undefined => {
    return incidents.find(incident => incident.id === id)
  }, [incidents])

  const getIncidentsByStudent = useCallback((studentId: string): SchoolIncident[] => {
    return incidents.filter(incident => incident.studentId === studentId)
  }, [incidents])

  const getIncidentsBySchool = useCallback((schoolId: string): SchoolIncident[] => {
    return incidents.filter(incident => incident.schoolId === schoolId)
  }, [incidents])

  const getIncidentStats = useCallback((filters?: IncidentFilters): IncidentStats => {
    let filteredIncidents = incidents

    if (filters) {
      filteredIncidents = incidents.filter(incident => {
        const matchesSchool = !filters.schoolId || incident.schoolId === filters.schoolId
        const matchesStudent = !filters.studentId || incident.studentId === filters.studentId
        const matchesType = !filters.incidentType || incident.incidentType === filters.incidentType
        const matchesSeverity = !filters.severity || incident.severity === filters.severity
        const matchesStatus = !filters.status || incident.status === filters.status
        const matchesDateFrom = !filters.dateFrom || incident.date >= filters.dateFrom
        const matchesDateTo = !filters.dateTo || incident.date <= filters.dateTo
        const matchesFollowUp = filters.followUpRequired === undefined || incident.followUpRequired === filters.followUpRequired

        return matchesSchool && matchesStudent && matchesType && matchesSeverity &&
               matchesStatus && matchesDateFrom && matchesDateTo && matchesFollowUp
      })
    }

    const totalIncidents = filteredIncidents.length
    const openIncidents = filteredIncidents.filter(i => i.status === 'OPEN').length
    const followUpPending = filteredIncidents.filter(i =>
      i.followUpRequired && i.status !== 'CLOSED'
    ).length

    const byType = filteredIncidents.reduce((acc, incident) => {
      acc[incident.incidentType] = (acc[incident.incidentType] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const bySeverity = filteredIncidents.reduce((acc, incident) => {
      acc[incident.severity] = (acc[incident.severity] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const byStatus = filteredIncidents.reduce((acc, incident) => {
      acc[incident.status] = (acc[incident.status] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return {
      totalIncidents,
      byType,
      bySeverity,
      byStatus,
      openIncidents,
      followUpPending
    }
  }, [incidents])

  const refreshIncidents = useCallback(async (filters?: IncidentFilters) => {
    await fetchIncidents(filters)
  }, [fetchIncidents])

  useEffect(() => {
    fetchIncidents(initialFilters)
  }, [fetchIncidents, initialFilters])

  return {
    incidents,
    loading,
    error,
    createIncident,
    updateIncident,
    closeIncident,
    deleteIncident,
    getIncidentById,
    getIncidentsByStudent,
    getIncidentsBySchool,
    getIncidentStats,
    refreshIncidents
  }
}