'use client'

import { useState, useEffect, useCallback } from 'react'
import { apiClient } from '@/lib/auth'

interface ProblemReport {
  id: string
  reportNumber: string
  reporterName: string
  reporterPhone: string
  reporterEmail?: string
  problemType: 'POTHOLE' | 'BROKEN_SIDEWALK' | 'FLOODING' | 'DAMAGED_SIGNAGE' | 'DEBRIS' | 'VEGETATION_OVERGROWTH' | 'OTHER'
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  location: string
  coordinates: { lat: number; lng: number }
  description: string
  photos: string[]
  reportDate: string
  status: 'REPORTED' | 'VERIFIED' | 'ASSIGNED' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED'
  verifiedBy?: string
  verificationDate?: string
  assignedTeam?: string
  assignmentDate?: string
  workStartDate?: string
  resolutionDate?: string
  resolutionNotes?: string
  resolutionPhotos?: string[]
  cost?: number
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  estimatedResolutionTime?: number
  actualResolutionTime?: number
  citizenSatisfaction?: number
  followUpRequired: boolean
  followUpDate?: string
  tags: string[]
  relatedReports?: string[]
  createdAt: string
  updatedAt: string
}

interface CreateProblemReportData {
  reporterName: string
  reporterPhone: string
  reporterEmail?: string
  problemType: 'POTHOLE' | 'BROKEN_SIDEWALK' | 'FLOODING' | 'DAMAGED_SIGNAGE' | 'DEBRIS' | 'VEGETATION_OVERGROWTH' | 'OTHER'
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  location: string
  coordinates: { lat: number; lng: number }
  description: string
  photos: string[]
  tags?: string[]
}

interface UseProblemReportsReturn {
  problemReports: ProblemReport[]
  loading: boolean
  error: string | null
  createReport: (data: CreateProblemReportData) => Promise<ProblemReport>
  updateReport: (id: string, data: Partial<CreateProblemReportData>) => Promise<ProblemReport>
  verifyReport: (id: string, verifiedBy: string) => Promise<ProblemReport>
  assignTeam: (id: string, teamId: string) => Promise<ProblemReport>
  startWork: (id: string) => Promise<ProblemReport>
  resolveReport: (id: string, data: { resolutionNotes: string; resolutionPhotos?: string[]; cost?: number }) => Promise<ProblemReport>
  closeReport: (id: string) => Promise<ProblemReport>
  deleteReport: (id: string) => Promise<void>
  getReportsByType: (type: string) => ProblemReport[]
  getUnverifiedReports: () => ProblemReport[]
  getHighPriorityReports: () => ProblemReport[]
  refreshReports: () => Promise<void>
}

export function useProblemReports(): UseProblemReportsReturn {
  const [problemReports, setProblemReports] = useState<ProblemReport[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchReports = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await apiClient.get('/api/specialized/public-services/problem-reports')
      setProblemReports(data.reports || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar relatórios de problemas')
    } finally {
      setLoading(false)
    }
  }, [])

  const createReport = useCallback(async (data: CreateProblemReportData): Promise<ProblemReport> => {
    try {
      setError(null)
      const response = await apiClient.post('/api/specialized/public-services/problem-reports', data)
      const newReport = response.report
      setProblemReports(prev => [newReport, ...prev])
      return newReport
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar relatório'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const updateReport = useCallback(async (id: string, data: Partial<CreateProblemReportData>): Promise<ProblemReport> => {
    try {
      setError(null)
      const response = await apiClient.put(`/api/specialized/public-services/problem-reports/${id}`, data)
      const updatedReport = response.report
      setProblemReports(prev => prev.map(report => report.id === id ? updatedReport : report))
      return updatedReport
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar relatório'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const verifyReport = useCallback(async (id: string, verifiedBy: string): Promise<ProblemReport> => {
    return updateReport(id, {
      status: 'VERIFIED',
      verifiedBy,
      verificationDate: new Date().toISOString()
    } as any)
  }, [updateReport])

  const assignTeam = useCallback(async (id: string, teamId: string): Promise<ProblemReport> => {
    return updateReport(id, {
      status: 'ASSIGNED',
      assignedTeam: teamId,
      assignmentDate: new Date().toISOString()
    } as any)
  }, [updateReport])

  const startWork = useCallback(async (id: string): Promise<ProblemReport> => {
    return updateReport(id, {
      status: 'IN_PROGRESS',
      workStartDate: new Date().toISOString()
    } as any)
  }, [updateReport])

  const resolveReport = useCallback(async (id: string, data: { resolutionNotes: string; resolutionPhotos?: string[]; cost?: number }): Promise<ProblemReport> => {
    return updateReport(id, {
      status: 'RESOLVED',
      resolutionDate: new Date().toISOString(),
      resolutionNotes: data.resolutionNotes,
      resolutionPhotos: data.resolutionPhotos,
      cost: data.cost
    } as any)
  }, [updateReport])

  const closeReport = useCallback(async (id: string): Promise<ProblemReport> => {
    return updateReport(id, { status: 'CLOSED' } as any)
  }, [updateReport])

  const deleteReport = useCallback(async (id: string): Promise<void> => {
    try {
      setError(null)
      await apiClient.delete(`/api/specialized/public-services/problem-reports/${id}`)
      setProblemReports(prev => prev.filter(report => report.id !== id))
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao excluir relatório'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const getReportsByType = useCallback((type: string) => {
    return problemReports.filter(report => report.problemType === type)
  }, [problemReports])

  const getUnverifiedReports = useCallback(() => {
    return problemReports.filter(report => report.status === 'REPORTED')
  }, [problemReports])

  const getHighPriorityReports = useCallback(() => {
    return problemReports.filter(report => ['HIGH', 'URGENT'].includes(report.priority))
  }, [problemReports])

  const refreshReports = useCallback(async () => {
    await fetchReports()
  }, [fetchReports])

  useEffect(() => {
    fetchReports()
  }, [fetchReports])

  return {
    problemReports,
    loading,
    error,
    createReport,
    updateReport,
    verifyReport,
    assignTeam,
    startWork,
    resolveReport,
    closeReport,
    deleteReport,
    getReportsByType,
    getUnverifiedReports,
    getHighPriorityReports,
    refreshReports
  }
}