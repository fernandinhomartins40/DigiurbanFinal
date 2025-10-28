'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAdminAuth } from '@/contexts/AdminAuthContext'

interface SportsReport {
  id: string
  title: string
  type: 'MONTHLY' | 'QUARTERLY' | 'ANNUAL' | 'EVENT' | 'PROGRAM' | 'INFRASTRUCTURE' | 'CUSTOM'
  period: {
    startDate: string
    endDate: string
  }
  categories: string[]
  data: {
    participation: {
      totalParticipants: number
      byModality: { modality: string; count: number }[]
      byAgeGroup: { ageGroup: string; count: number }[]
      byGender: { gender: string; count: number }[]
      byProgram: { program: string; count: number }[]
    }
    events: {
      totalEvents: number
      byType: { type: string; count: number }[]
      byStatus: { status: string; count: number }[]
      participationRate: number
      satisfactionRate: number
    }
    competitions: {
      totalCompetitions: number
      byLevel: { level: string; count: number }[]
      achievements: {
        medals: { position: number; count: number }[]
        records: number
        qualifications: number
      }
    }
    infrastructure: {
      totalFacilities: number
      utilizationRate: number
      maintenanceCost: number
      byType: { type: string; count: number; utilization: number }[]
    }
    budget: {
      allocated: number
      spent: number
      remaining: number
      byCategory: {
        category: string
        allocated: number
        spent: number
        percentage: number
      }[]
    }
    personnel: {
      totalInstructors: number
      activeInstructors: number
      certificationsExpiring: number
      averageExperience: number
      bySpecialization: { specialization: string; count: number }[]
    }
    programs: {
      totalPrograms: number
      activePrograms: number
      completionRate: number
      dropoutRate: number
      satisfactionRate: number
    }
  }
  metrics: {
    kpi: {
      name: string
      value: number
      target: number
      unit: string
      trend: 'UP' | 'DOWN' | 'STABLE'
      status: 'EXCELLENT' | 'GOOD' | 'ATTENTION' | 'CRITICAL'
    }[]
    comparisons: {
      period: string
      metrics: { name: string; current: number; previous: number; variation: number }[]
    }[]
  }
  charts: {
    type: 'LINE' | 'BAR' | 'PIE' | 'AREA' | 'DONUT'
    title: string
    data: any[]
    config: any
  }[]
  recommendations: {
    priority: 'HIGH' | 'MEDIUM' | 'LOW'
    category: string
    description: string
    actions: string[]
  }[]
  generatedBy: string
  generatedAt: string
  status: 'DRAFT' | 'REVIEW' | 'APPROVED' | 'PUBLISHED'
  tags: string[]
}

interface CreateSportsReportData {
  title: string
  type: 'MONTHLY' | 'QUARTERLY' | 'ANNUAL' | 'EVENT' | 'PROGRAM' | 'INFRASTRUCTURE' | 'CUSTOM'
  period: {
    startDate: string
    endDate: string
  }
  categories: string[]
  filters?: any
}

interface ReportFilters {
  type?: string
  period?: { startDate: string; endDate: string }
  categories?: string[]
  status?: string
  tags?: string[]
}

interface ReportStats {
  totalReports: number
  byType: { type: string; count: number }[]
  byStatus: { status: string; count: number }[]
  recentReports: SportsReport[]
}

interface UseSportsReportsReturn {
  reports: SportsReport[]
  loading: boolean
  error: string | null
  createReport: (data: CreateSportsReportData) => Promise<SportsReport>
  generateReport: (data: CreateSportsReportData) => Promise<SportsReport>
  updateReport: (id: string, data: Partial<SportsReport>) => Promise<SportsReport>
  approveReport: (id: string) => Promise<SportsReport>
  publishReport: (id: string) => Promise<SportsReport>
  exportReport: (id: string, format: 'PDF' | 'EXCEL' | 'CSV') => Promise<string>
  shareReport: (id: string, recipients: string[]) => Promise<void>
  deleteReport: (id: string) => Promise<void>
  getReportsByType: (type: string) => SportsReport[]
  getReportsByPeriod: (startDate: string, endDate: string) => SportsReport[]
  getRecentReports: () => SportsReport[]
  getReportStats: () => Promise<ReportStats>
  refreshReports: () => Promise<void>
}

export function useSportsReports(): UseSportsReportsReturn {
  const [reports, setReports] = useState<SportsReport[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchReports = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await apiClient.get('/api/secretarias/sports/reports')
      setReports(data.reports || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar relatórios')
    } finally {
      setLoading(false)
    }
  }, [])

  const createReport = useCallback(async (data: CreateSportsReportData): Promise<SportsReport> => {
    try {
      setError(null)
      const response = await apiClient.post('/api/secretarias/sports/reports', data)
      const newReport = response.report
      setReports(prev => [newReport, ...prev])
      return newReport
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar relatório'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const generateReport = useCallback(async (data: CreateSportsReportData): Promise<SportsReport> => {
    try {
      setError(null)
      const response = await apiClient.post('/api/secretarias/sports/reports/generate', data)
      const newReport = response.report
      setReports(prev => [newReport, ...prev])
      return newReport
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao gerar relatório'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const updateReport = useCallback(async (id: string, data: Partial<SportsReport>): Promise<SportsReport> => {
    try {
      setError(null)
      const response = await apiClient.put(`/api/secretarias/sports/reports/${id}`, data)
      const updatedReport = response.report
      setReports(prev => prev.map(report => report.id === id ? updatedReport : report))
      return updatedReport
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar relatório'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const approveReport = useCallback(async (id: string): Promise<SportsReport> => {
    try {
      setError(null)
      const response = await apiClient.put(`/api/secretarias/sports/reports/${id}/approve`)
      const updatedReport = response.report
      setReports(prev => prev.map(report => report.id === id ? updatedReport : report))
      return updatedReport
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao aprovar relatório'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const publishReport = useCallback(async (id: string): Promise<SportsReport> => {
    try {
      setError(null)
      const response = await apiClient.put(`/api/secretarias/sports/reports/${id}/publish`)
      const updatedReport = response.report
      setReports(prev => prev.map(report => report.id === id ? updatedReport : report))
      return updatedReport
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao publicar relatório'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const exportReport = useCallback(async (id: string, format: 'PDF' | 'EXCEL' | 'CSV'): Promise<string> => {
    try {
      setError(null)
      const response = await apiClient.post(`/api/secretarias/sports/reports/${id}/export`, { format })
      return response.downloadUrl
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao exportar relatório'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const shareReport = useCallback(async (id: string, recipients: string[]): Promise<void> => {
    try {
      setError(null)
      await apiClient.post(`/api/secretarias/sports/reports/${id}/share`, { recipients })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao compartilhar relatório'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const deleteReport = useCallback(async (id: string): Promise<void> => {
    try {
      setError(null)
      await apiClient.delete(`/api/secretarias/sports/reports/${id}`)
      setReports(prev => prev.filter(report => report.id !== id))
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao excluir relatório'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const getReportsByType = useCallback((type: string) => reports.filter(report => report.type === type), [reports])

  const getReportsByPeriod = useCallback((startDate: string, endDate: string) => {
    return reports.filter(report =>
      new Date(report.period.startDate) >= new Date(startDate) &&
      new Date(report.period.endDate) <= new Date(endDate)
    )
  }, [reports])

  const getRecentReports = useCallback(() => {
    return reports
      .sort((a, b) => new Date(b.generatedAt).getTime() - new Date(a.generatedAt).getTime())
      .slice(0, 10)
  }, [reports])

  const getReportStats = useCallback(async (): Promise<ReportStats> => {
    try {
      setError(null)
      const response = await apiClient.get('/api/secretarias/sports/reports/stats')
      return response.stats
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar estatísticas'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const refreshReports = useCallback(async () => {
    await fetchReports()
  }, [fetchReports])

  useEffect(() => {
    fetchReports()
  }, [fetchReports])

  return {
    reports,
    loading,
    error,
    createReport,
    generateReport,
    updateReport,
    approveReport,
    publishReport,
    exportReport,
    shareReport,
    deleteReport,
    getReportsByType,
    getReportsByPeriod,
    getRecentReports,
    getReportStats,
    refreshReports
  }
}