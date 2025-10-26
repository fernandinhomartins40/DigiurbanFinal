'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAdminAuth } from '@/contexts/AdminAuthContext'

interface HousingReport {
  id: string
  title: string
  type: 'PROGRAM_PERFORMANCE' | 'UNIT_OCCUPANCY' | 'MAINTENANCE_SUMMARY' | 'BENEFICIARY_PROFILE' | 'FINANCIAL' | 'COMPLIANCE' | 'SATISFACTION' | 'COMPREHENSIVE'
  category: 'MONTHLY' | 'QUARTERLY' | 'ANNUAL' | 'SPECIAL' | 'IMPACT_ASSESSMENT' | 'AUDIT'
  period: {
    startDate: string
    endDate: string
    referenceYear: number
  }
  scope: {
    programs: string[]
    districts: string[]
    unitTypes: string[]
    beneficiaryCategories: string[]
  }
  data: {
    programs: {
      overview: {
        totalPrograms: number
        activePrograms: number
        completedPrograms: number
        totalBudget: number
        spentBudget: number
      }
      performance: {
        programId: string
        programName: string
        type: string
        status: string
        plannedUnits: number
        completedUnits: number
        occupiedUnits: number
        occupancyRate: number
        budget: {
          allocated: number
          spent: number
          remaining: number
        }
        beneficiaries: {
          planned: number
          current: number
          graduated: number
        }
        timeline: {
          plannedEnd: string
          currentProgress: number
          delays: number
        }
      }[]
    }
    units: {
      inventory: {
        total: number
        byType: { type: string; count: number }[]
        byDistrict: { district: string; count: number }[]
        byStatus: { status: string; count: number }[]
      }
      occupancy: {
        occupied: number
        vacant: number
        underMaintenance: number
        occupancyRate: number
        averageOccupancyTime: number
        turnoverRate: number
      }
      condition: {
        excellent: number
        good: number
        fair: number
        poor: number
        critical: number
        averageAge: number
      }
      maintenance: {
        requestsReceived: number
        requestsCompleted: number
        averageResponseTime: number
        totalMaintenanceCost: number
        preventiveMaintenanceRate: number
      }
    }
    beneficiaries: {
      demographics: {
        total: number
        byGender: { gender: string; count: number; percentage: number }[]
        byAgeGroup: { ageGroup: string; count: number; percentage: number }[]
        byFamilySize: { size: string; count: number; percentage: number }[]
        byIncome: { range: string; count: number; percentage: number }[]
      }
      social: {
        vulnerabilityProfile: { level: string; count: number; percentage: number }[]
        educationLevel: { level: string; count: number; percentage: number }[]
        employmentStatus: { status: string; count: number; percentage: number }[]
        healthConditions: { condition: string; count: number }[]
      }
      outcomes: {
        incomeImprovement: { improved: number; percentage: number; averageIncrease: number }
        employmentGains: { employed: number; percentage: number; sectors: string[] }
        educationAdvancement: { advanced: number; percentage: number; types: string[] }
        healthImprovements: { improved: number; percentage: number; conditions: string[] }
        socialIntegration: { integrated: number; percentage: number; activities: string[] }
      }
    }
    financial: {
      budget: {
        totalAllocated: number
        totalSpent: number
        totalRemaining: number
        utilizationRate: number
        byCategory: {
          category: string
          allocated: number
          spent: number
          percentage: number
        }[]
      }
      costs: {
        construction: { total: number; average: number; range: { min: number; max: number } }
        maintenance: { total: number; average: number; perUnit: number }
        administration: { total: number; percentage: number }
        social: { total: number; percentage: number }
      }
      revenue: {
        beneficiaryPayments: { collected: number; pending: number; rate: number }
        subsidies: { received: number; pending: number; sources: string[] }
        other: { amount: number; sources: string[] }
      }
      efficiency: {
        costPerUnit: number
        costPerBeneficiary: number
        returnOnInvestment: number
        costEffectiveness: number
      }
    }
    compliance: {
      legal: {
        laws: { compliant: number; nonCompliant: number; rate: number }
        regulations: { compliant: number; nonCompliant: number; rate: number }
        permits: { valid: number; expired: number; pending: number }
      }
      environmental: {
        licenses: { valid: number; expired: number; pending: number }
        conditions: { met: number; unmet: number; rate: number }
        monitoring: { compliant: number; nonCompliant: number; rate: number }
      }
      social: {
        participation: { adequate: number; inadequate: number; rate: number }
        grievances: { received: number; resolved: number; rate: number }
        consultation: { conducted: number; required: number; rate: number }
      }
    }
    satisfaction: {
      overall: {
        surveys: number
        averageRating: number
        satisfactionRate: number
        recommendationRate: number
      }
      byCategory: {
        housingQuality: { rating: number; satisfaction: number }
        location: { rating: number; satisfaction: number }
        services: { rating: number; satisfaction: number }
        management: { rating: number; satisfaction: number }
      }
      feedback: {
        compliments: number
        complaints: number
        suggestions: number
        resolutionRate: number
      }
    }
  }
  analysis: {
    trends: {
      indicator: string
      trend: 'IMPROVING' | 'STABLE' | 'DECLINING'
      rate: number
      significance: 'HIGH' | 'MEDIUM' | 'LOW'
      causes: string[]
    }[]
    comparisons: {
      type: 'TEMPORAL' | 'SPATIAL' | 'PROGRAM'
      baseline: string
      current: string
      variance: number
      insights: string[]
    }[]
    achievements: {
      category: string
      achievement: string
      impact: string
      evidence: string[]
    }[]
    challenges: {
      category: string
      challenge: string
      impact: string
      causes: string[]
      recommendations: string[]
    }[]
  }
  indicators: {
    key: {
      name: string
      value: number
      target: number
      unit: string
      performance: 'EXCELLENT' | 'GOOD' | 'SATISFACTORY' | 'NEEDS_IMPROVEMENT'
      trend: 'UP' | 'DOWN' | 'STABLE'
    }[]
    impact: {
      social: { indicator: string; value: number; impact: string }[]
      economic: { indicator: string; value: number; impact: string }[]
      environmental: { indicator: string; value: number; impact: string }[]
    }
  }
  recommendations: {
    priority: 'IMMEDIATE' | 'SHORT_TERM' | 'MEDIUM_TERM' | 'LONG_TERM'
    category: string
    recommendation: string
    rationale: string
    expectedOutcome: string
    resources: string
    timeline: string
    responsible: string[]
  }[]
  visualizations: {
    charts: {
      type: 'LINE' | 'BAR' | 'PIE' | 'SCATTER' | 'AREA'
      title: string
      data: any
      config: any
    }[]
    maps: {
      type: 'DISTRIBUTION' | 'DENSITY' | 'PERFORMANCE'
      title: string
      data: any
    }[]
    dashboards: {
      title: string
      widgets: string[]
      data: any
    }[]
  }
  methodology: {
    dataCollection: {
      sources: string[]
      methods: string[]
      period: string
      sampleSize: number
      responseRate: number
    }
    analysis: {
      techniques: string[]
      tools: string[]
      limitations: string[]
      assumptions: string[]
    }
    validation: {
      methods: string[]
      reviewers: string[]
      confidence: number
    }
  }
  distribution: {
    internal: {
      departments: string[]
      roles: string[]
      method: 'EMAIL' | 'PORTAL' | 'PRINT'
    }
    external: {
      stakeholders: string[]
      partners: string[]
      public: boolean
      method: 'WEBSITE' | 'REPORT' | 'PRESENTATION'
    }
  }
  followUp: {
    actionPlans: {
      action: string
      responsible: string
      deadline: string
      status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED'
    }[]
    nextReport: {
      type: string
      scheduledDate: string
      focusAreas: string[]
    }
    monitoring: {
      indicators: string[]
      frequency: string
      responsible: string
    }
  }
  metadata: {
    authors: {
      name: string
      role: string
      department: string
    }[]
    reviewers: {
      name: string
      role: string
      reviewDate: string
      approved: boolean
    }[]
    version: string
    language: string
    confidentiality: 'PUBLIC' | 'INTERNAL' | 'RESTRICTED' | 'CONFIDENTIAL'
  }
  status: 'DRAFT' | 'REVIEW' | 'APPROVED' | 'PUBLISHED' | 'ARCHIVED'
  createdAt: string
  updatedAt: string
}

interface CreateHousingReportData {
  title: string
  type: 'PROGRAM_PERFORMANCE' | 'UNIT_OCCUPANCY' | 'MAINTENANCE_SUMMARY' | 'BENEFICIARY_PROFILE' | 'FINANCIAL' | 'COMPLIANCE' | 'SATISFACTION' | 'COMPREHENSIVE'
  category: 'MONTHLY' | 'QUARTERLY' | 'ANNUAL' | 'SPECIAL' | 'IMPACT_ASSESSMENT' | 'AUDIT'
  period: {
    startDate: string
    endDate: string
  }
  scope: {
    programs?: string[]
    districts?: string[]
  }
}

interface UseHousingReportsReturn {
  reports: HousingReport[]
  loading: boolean
  error: string | null
  createReport: (data: CreateHousingReportData) => Promise<HousingReport>
  generateReport: (data: CreateHousingReportData) => Promise<HousingReport>
  updateReport: (id: string, data: Partial<CreateHousingReportData>) => Promise<HousingReport>
  addData: (id: string, category: string, data: any) => Promise<HousingReport>
  updateAnalysis: (id: string, analysis: any) => Promise<HousingReport>
  addIndicator: (id: string, indicator: any) => Promise<HousingReport>
  updateIndicator: (id: string, indicatorId: string, value: number) => Promise<HousingReport>
  addRecommendation: (id: string, recommendation: any) => Promise<HousingReport>
  addVisualization: (id: string, visualization: any) => Promise<HousingReport>
  updateMethodology: (id: string, methodology: any) => Promise<HousingReport>
  addAuthor: (id: string, author: any) => Promise<HousingReport>
  addReviewer: (id: string, reviewer: any) => Promise<HousingReport>
  submitForReview: (id: string) => Promise<HousingReport>
  approveReport: (id: string) => Promise<HousingReport>
  publishReport: (id: string) => Promise<HousingReport>
  distributeReport: (id: string, distribution: any) => Promise<HousingReport>
  addActionPlan: (id: string, actionPlan: any) => Promise<HousingReport>
  updateActionStatus: (id: string, actionId: string, status: string) => Promise<HousingReport>
  scheduleNextReport: (id: string, nextReport: any) => Promise<HousingReport>
  exportReport: (id: string, format: 'PDF' | 'EXCEL' | 'WORD') => Promise<string>
  archiveReport: (id: string) => Promise<HousingReport>
  deleteReport: (id: string) => Promise<void>
  getReportsByType: (type: string) => HousingReport[]
  getReportsByCategory: (category: string) => HousingReport[]
  getReportsByStatus: (status: string) => HousingReport[]
  getRecentReports: () => HousingReport[]
  refreshReports: () => Promise<void>
}

export function useHousingReports(): UseHousingReportsReturn {
  const [reports, setReports] = useState<HousingReport[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchReports = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await apiClient.get('/api/specialized/housing/reports')
      setReports(data.reports || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar relatórios habitacionais')
    } finally {
      setLoading(false)
    }
  }, [])

  const createReport = useCallback(async (data: CreateHousingReportData): Promise<HousingReport> => {
    try {
      setError(null)
      const response = await apiClient.post('/api/specialized/housing/reports', data)
      const newReport = response.report
      setReports(prev => [newReport, ...prev])
      return newReport
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar relatório'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const generateReport = useCallback(async (data: CreateHousingReportData): Promise<HousingReport> => {
    try {
      setError(null)
      const response = await apiClient.post('/api/specialized/housing/reports/generate', data)
      const newReport = response.report
      setReports(prev => [newReport, ...prev])
      return newReport
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao gerar relatório'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const updateReport = useCallback(async (id: string, data: Partial<CreateHousingReportData>): Promise<HousingReport> => {
    try {
      setError(null)
      const response = await apiClient.put(`/api/specialized/housing/reports/${id}`, data)
      const updatedReport = response.report
      setReports(prev => prev.map(report => report.id === id ? updatedReport : report))
      return updatedReport
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar relatório'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const addData = useCallback(async (id: string, category: string, data: any): Promise<HousingReport> => {
    try {
      setError(null)
      const response = await apiClient.post(`/api/specialized/housing/reports/${id}/data/${category}`, data)
      const updatedReport = response.report
      setReports(prev => prev.map(report => report.id === id ? updatedReport : report))
      return updatedReport
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao adicionar dados'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const updateAnalysis = useCallback(async (id: string, analysis: any): Promise<HousingReport> => {
    try {
      setError(null)
      const response = await apiClient.put(`/api/specialized/housing/reports/${id}/analysis`, analysis)
      const updatedReport = response.report
      setReports(prev => prev.map(report => report.id === id ? updatedReport : report))
      return updatedReport
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar análise'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const addIndicator = useCallback(async (id: string, indicator: any): Promise<HousingReport> => {
    try {
      setError(null)
      const response = await apiClient.post(`/api/specialized/housing/reports/${id}/indicators`, indicator)
      const updatedReport = response.report
      setReports(prev => prev.map(report => report.id === id ? updatedReport : report))
      return updatedReport
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao adicionar indicador'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const updateIndicator = useCallback(async (id: string, indicatorId: string, value: number): Promise<HousingReport> => {
    try {
      setError(null)
      const response = await apiClient.put(`/api/specialized/housing/reports/${id}/indicators/${indicatorId}`, { value })
      const updatedReport = response.report
      setReports(prev => prev.map(report => report.id === id ? updatedReport : report))
      return updatedReport
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar indicador'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const addRecommendation = useCallback(async (id: string, recommendation: any): Promise<HousingReport> => {
    try {
      setError(null)
      const response = await apiClient.post(`/api/specialized/housing/reports/${id}/recommendations`, recommendation)
      const updatedReport = response.report
      setReports(prev => prev.map(report => report.id === id ? updatedReport : report))
      return updatedReport
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao adicionar recomendação'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const addVisualization = useCallback(async (id: string, visualization: any): Promise<HousingReport> => {
    try {
      setError(null)
      const response = await apiClient.post(`/api/specialized/housing/reports/${id}/visualizations`, visualization)
      const updatedReport = response.report
      setReports(prev => prev.map(report => report.id === id ? updatedReport : report))
      return updatedReport
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao adicionar visualização'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const updateMethodology = useCallback(async (id: string, methodology: any): Promise<HousingReport> => {
    try {
      setError(null)
      const response = await apiClient.put(`/api/specialized/housing/reports/${id}/methodology`, methodology)
      const updatedReport = response.report
      setReports(prev => prev.map(report => report.id === id ? updatedReport : report))
      return updatedReport
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar metodologia'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const addAuthor = useCallback(async (id: string, author: any): Promise<HousingReport> => {
    try {
      setError(null)
      const response = await apiClient.post(`/api/specialized/housing/reports/${id}/authors`, author)
      const updatedReport = response.report
      setReports(prev => prev.map(report => report.id === id ? updatedReport : report))
      return updatedReport
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao adicionar autor'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const addReviewer = useCallback(async (id: string, reviewer: any): Promise<HousingReport> => {
    try {
      setError(null)
      const response = await apiClient.post(`/api/specialized/housing/reports/${id}/reviewers`, reviewer)
      const updatedReport = response.report
      setReports(prev => prev.map(report => report.id === id ? updatedReport : report))
      return updatedReport
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao adicionar revisor'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const submitForReview = useCallback(async (id: string): Promise<HousingReport> => {
    try {
      setError(null)
      const response = await apiClient.post(`/api/specialized/housing/reports/${id}/submit`)
      const updatedReport = response.report
      setReports(prev => prev.map(report => report.id === id ? updatedReport : report))
      return updatedReport
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao submeter para revisão'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const approveReport = useCallback(async (id: string): Promise<HousingReport> => {
    try {
      setError(null)
      const response = await apiClient.post(`/api/specialized/housing/reports/${id}/approve`)
      const updatedReport = response.report
      setReports(prev => prev.map(report => report.id === id ? updatedReport : report))
      return updatedReport
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao aprovar relatório'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const publishReport = useCallback(async (id: string): Promise<HousingReport> => {
    try {
      setError(null)
      const response = await apiClient.post(`/api/specialized/housing/reports/${id}/publish`)
      const updatedReport = response.report
      setReports(prev => prev.map(report => report.id === id ? updatedReport : report))
      return updatedReport
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao publicar relatório'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const distributeReport = useCallback(async (id: string, distribution: any): Promise<HousingReport> => {
    try {
      setError(null)
      const response = await apiClient.post(`/api/specialized/housing/reports/${id}/distribute`, distribution)
      const updatedReport = response.report
      setReports(prev => prev.map(report => report.id === id ? updatedReport : report))
      return updatedReport
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao distribuir relatório'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const addActionPlan = useCallback(async (id: string, actionPlan: any): Promise<HousingReport> => {
    try {
      setError(null)
      const response = await apiClient.post(`/api/specialized/housing/reports/${id}/action-plans`, actionPlan)
      const updatedReport = response.report
      setReports(prev => prev.map(report => report.id === id ? updatedReport : report))
      return updatedReport
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao adicionar plano de ação'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const updateActionStatus = useCallback(async (id: string, actionId: string, status: string): Promise<HousingReport> => {
    try {
      setError(null)
      const response = await apiClient.put(`/api/specialized/housing/reports/${id}/action-plans/${actionId}`, { status })
      const updatedReport = response.report
      setReports(prev => prev.map(report => report.id === id ? updatedReport : report))
      return updatedReport
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar status da ação'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const scheduleNextReport = useCallback(async (id: string, nextReport: any): Promise<HousingReport> => {
    try {
      setError(null)
      const response = await apiClient.post(`/api/specialized/housing/reports/${id}/schedule-next`, nextReport)
      const updatedReport = response.report
      setReports(prev => prev.map(report => report.id === id ? updatedReport : report))
      return updatedReport
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao agendar próximo relatório'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const exportReport = useCallback(async (id: string, format: 'PDF' | 'EXCEL' | 'WORD'): Promise<string> => {
    try {
      setError(null)
      const response = await apiClient.post(`/api/specialized/housing/reports/${id}/export`, { format })
      return response.downloadUrl
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao exportar relatório'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const archiveReport = useCallback(async (id: string): Promise<HousingReport> => {
    return updateReport(id, { status: 'ARCHIVED' } as any)
  }, [updateReport])

  const deleteReport = useCallback(async (id: string): Promise<void> => {
    try {
      setError(null)
      await apiClient.delete(`/api/specialized/housing/reports/${id}`)
      setReports(prev => prev.filter(report => report.id !== id))
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao excluir relatório'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const getReportsByType = useCallback((type: string) => reports.filter(report => report.type === type), [reports])
  const getReportsByCategory = useCallback((category: string) => reports.filter(report => report.category === category), [reports])
  const getReportsByStatus = useCallback((status: string) => reports.filter(report => report.status === status), [reports])
  const getRecentReports = useCallback(() => {
    return reports
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 10)
  }, [reports])

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
    addData,
    updateAnalysis,
    addIndicator,
    updateIndicator,
    addRecommendation,
    addVisualization,
    updateMethodology,
    addAuthor,
    addReviewer,
    submitForReview,
    approveReport,
    publishReport,
    distributeReport,
    addActionPlan,
    updateActionStatus,
    scheduleNextReport,
    exportReport,
    archiveReport,
    deleteReport,
    getReportsByType,
    getReportsByCategory,
    getReportsByStatus,
    getRecentReports,
    refreshReports
  }
}