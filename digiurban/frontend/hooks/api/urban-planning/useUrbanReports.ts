'use client'

import { useState, useEffect, useCallback } from 'react'
import { apiClient } from '@/lib/auth'

interface UrbanReport {
  id: string
  title: string
  type: 'DEVELOPMENT' | 'INFRASTRUCTURE' | 'ZONING' | 'TRAFFIC' | 'ENVIRONMENTAL' | 'ECONOMIC' | 'SOCIAL' | 'COMPREHENSIVE'
  category: 'MONTHLY' | 'QUARTERLY' | 'ANNUAL' | 'PROJECT_SPECIFIC' | 'SPECIAL' | 'IMPACT_ASSESSMENT'
  period: {
    startDate: string
    endDate: string
    referenceYear: number
  }
  scope: {
    geographic: {
      city: boolean
      districts: string[]
      neighborhoods: string[]
      specificAreas: string[]
    }
    thematic: {
      topics: string[]
      sectors: string[]
      indicators: string[]
    }
  }
  data: {
    demographics: {
      population: {
        total: number
        growth: number
        density: number
        distribution: { area: string; population: number }[]
      }
      socioeconomic: {
        income: { level: string; percentage: number }[]
        education: { level: string; percentage: number }[]
        employment: { sector: string; percentage: number }[]
      }
    }
    urbanDevelopment: {
      landUse: {
        type: string
        area: number
        percentage: number
        change: number
      }[]
      construction: {
        permits: number
        area: number
        value: number
        type: { category: string; count: number }[]
      }
      projects: {
        completed: number
        ongoing: number
        planned: number
        investment: number
      }
    }
    infrastructure: {
      transportation: {
        roads: { category: string; length: number; condition: string }[]
        transit: { type: string; ridership: number; coverage: number }[]
        traffic: { volume: number; congestion: string; accidents: number }[]
      }
      utilities: {
        water: { coverage: number; quality: string; consumption: number }
        sewer: { coverage: number; treatment: number }
        electricity: { coverage: number; consumption: number; reliability: number }
        waste: { collection: number; recycling: number; disposal: number }
      }
      digital: {
        internet: { coverage: number; speed: string; adoption: number }
        mobile: { coverage: number; penetration: number }
        smartCity: { initiatives: number; investment: number }
      }
    }
    economic: {
      indicators: {
        gdp: number
        growth: number
        employment: number
        investment: number
      }
      sectors: {
        name: string
        contribution: number
        employment: number
        growth: number
      }[]
      business: {
        establishments: number
        licenses: number
        revenue: number
      }
    }
    environmental: {
      quality: {
        air: { index: number; status: string }
        water: { quality: string; compliance: number }
        noise: { level: number; compliance: number }
      }
      greenSpaces: {
        total: number
        perCapita: number
        distribution: { type: string; area: number }[]
      }
      sustainability: {
        emissions: number
        recycling: number
        renewableEnergy: number
      }
    }
    social: {
      services: {
        health: { facilities: number; coverage: number; quality: string }
        education: { schools: number; enrollment: number; quality: string }
        safety: { crime: number; police: number; perception: string }
      }
      housing: {
        units: number
        affordability: number
        quality: string
        deficit: number
      }
      quality: {
        satisfaction: number
        livability: string
        accessibility: number
      }
    }
  }
  analysis: {
    trends: {
      indicator: string
      direction: 'IMPROVING' | 'STABLE' | 'DECLINING'
      rate: number
      significance: 'HIGH' | 'MEDIUM' | 'LOW'
      causes: string[]
    }[]
    comparisons: {
      type: 'TEMPORAL' | 'SPATIAL' | 'BENCHMARK'
      baseline: string
      variance: number
      ranking?: number
      insights: string[]
    }[]
    correlations: {
      variables: string[]
      strength: 'STRONG' | 'MODERATE' | 'WEAK'
      direction: 'POSITIVE' | 'NEGATIVE'
      significance: number
    }[]
  }
  indicators: {
    kpi: {
      name: string
      value: number
      target: number
      unit: string
      trend: 'UP' | 'DOWN' | 'STABLE'
      performance: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR'
    }[]
    sustainability: {
      sdg: number
      indicator: string
      value: number
      target: number
      progress: number
    }[]
    livability: {
      dimension: string
      score: number
      ranking: number
      components: { factor: string; score: number }[]
    }[]
  }
  challenges: {
    category: string
    issue: string
    severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'
    impact: string[]
    causes: string[]
    trends: string
  }[]
  recommendations: {
    priority: 'IMMEDIATE' | 'SHORT_TERM' | 'MEDIUM_TERM' | 'LONG_TERM'
    category: string
    action: string
    rationale: string
    resources: string
    timeline: string
    stakeholders: string[]
    expectedOutcome: string
  }[]
  methodology: {
    dataCollection: {
      sources: string[]
      methods: string[]
      period: string
      quality: 'HIGH' | 'MEDIUM' | 'LOW'
    }
    analysis: {
      techniques: string[]
      software: string[]
      limitations: string[]
    }
    validation: {
      methods: string[]
      stakeholders: string[]
      confidence: number
    }
  }
  visualizations: {
    charts: {
      type: 'LINE' | 'BAR' | 'PIE' | 'SCATTER' | 'MAP' | 'HEATMAP'
      title: string
      data: any
      config: any
    }[]
    maps: {
      type: 'THEMATIC' | 'CHOROPLETH' | 'POINT' | 'FLOW'
      title: string
      layers: string[]
      data: any
    }[]
    infographics: {
      title: string
      type: string
      url: string
    }[]
  }
  appendices: {
    type: string
    title: string
    description: string
    url: string
  }[]
  metadata: {
    authors: {
      name: string
      role: string
      organization: string
    }[]
    reviewers: {
      name: string
      role: string
      date: string
    }[]
    approval: {
      approver: string
      date: string
      status: 'DRAFT' | 'UNDER_REVIEW' | 'APPROVED' | 'PUBLISHED'
    }
    version: string
    language: string
    access: 'PUBLIC' | 'RESTRICTED' | 'INTERNAL'
  }
  distribution: {
    stakeholders: {
      entity: string
      type: 'GOVERNMENT' | 'COMMUNITY' | 'PRIVATE' | 'ACADEMIC' | 'MEDIA'
      contact: string
      deliveryMethod: 'EMAIL' | 'PORTAL' | 'PRINT' | 'PRESENTATION'
    }[]
    publicConsultation: {
      required: boolean
      sessions: {
        date: string
        location: string
        attendees: number
        feedback: string[]
      }[]
    }
    media: {
      pressRelease: boolean
      interviews: string[]
      publications: string[]
    }
  }
  impact: {
    policyInfluence: string[]
    decisionsMade: string[]
    projectsInfluenced: string[]
    budgetAllocations: {
      area: string
      amount: number
      justification: string
    }[]
  }
  followUp: {
    updateSchedule: string
    monitoringPlan: string[]
    nextReportDate: string
    improvementAreas: string[]
  }
  status: 'DRAFT' | 'DATA_COLLECTION' | 'ANALYSIS' | 'REVIEW' | 'APPROVED' | 'PUBLISHED' | 'ARCHIVED'
  createdBy: string
  createdAt: string
  updatedAt: string
}

interface CreateUrbanReportData {
  title: string
  type: 'DEVELOPMENT' | 'INFRASTRUCTURE' | 'ZONING' | 'TRAFFIC' | 'ENVIRONMENTAL' | 'ECONOMIC' | 'SOCIAL' | 'COMPREHENSIVE'
  category: 'MONTHLY' | 'QUARTERLY' | 'ANNUAL' | 'PROJECT_SPECIFIC' | 'SPECIAL' | 'IMPACT_ASSESSMENT'
  period: {
    startDate: string
    endDate: string
  }
  scope: {
    geographic: {
      districts: string[]
    }
    thematic: {
      topics: string[]
    }
  }
}

interface UseUrbanReportsReturn {
  reports: UrbanReport[]
  loading: boolean
  error: string | null
  createReport: (data: CreateUrbanReportData) => Promise<UrbanReport>
  updateReport: (id: string, data: Partial<CreateUrbanReportData>) => Promise<UrbanReport>
  addData: (id: string, category: string, data: any) => Promise<UrbanReport>
  updateData: (id: string, category: string, data: any) => Promise<UrbanReport>
  addAnalysis: (id: string, analysis: any) => Promise<UrbanReport>
  addIndicator: (id: string, category: string, indicator: any) => Promise<UrbanReport>
  updateIndicator: (id: string, indicatorId: string, value: number) => Promise<UrbanReport>
  addChallenge: (id: string, challenge: any) => Promise<UrbanReport>
  addRecommendation: (id: string, recommendation: any) => Promise<UrbanReport>
  updateMethodology: (id: string, methodology: any) => Promise<UrbanReport>
  addVisualization: (id: string, visualization: any) => Promise<UrbanReport>
  addAppendix: (id: string, appendix: any) => Promise<UrbanReport>
  updateMetadata: (id: string, metadata: any) => Promise<UrbanReport>
  addAuthor: (id: string, author: any) => Promise<UrbanReport>
  addReviewer: (id: string, reviewer: any) => Promise<UrbanReport>
  submitForReview: (id: string) => Promise<UrbanReport>
  approveReport: (id: string) => Promise<UrbanReport>
  publishReport: (id: string) => Promise<UrbanReport>
  distributeReport: (id: string, distribution: any) => Promise<UrbanReport>
  addImpact: (id: string, impact: any) => Promise<UrbanReport>
  scheduleUpdate: (id: string, schedule: string) => Promise<UrbanReport>
  archiveReport: (id: string) => Promise<UrbanReport>
  deleteReport: (id: string) => Promise<void>
  getReportsByType: (type: string) => UrbanReport[]
  getReportsByCategory: (category: string) => UrbanReport[]
  getReportsByStatus: (status: string) => UrbanReport[]
  getRecentReports: () => UrbanReport[]
  refreshReports: () => Promise<void>
}

export function useUrbanReports(): UseUrbanReportsReturn {
  const [reports, setReports] = useState<UrbanReport[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchReports = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await apiClient.get('/api/specialized/urban-planning/reports')
      setReports(data.reports || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar relatórios urbanos')
    } finally {
      setLoading(false)
    }
  }, [])

  const createReport = useCallback(async (data: CreateUrbanReportData): Promise<UrbanReport> => {
    try {
      setError(null)
      const response = await apiClient.post('/api/specialized/urban-planning/reports', data)
      const newReport = response.report
      setReports(prev => [newReport, ...prev])
      return newReport
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar relatório'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const updateReport = useCallback(async (id: string, data: Partial<CreateUrbanReportData>): Promise<UrbanReport> => {
    try {
      setError(null)
      const response = await apiClient.put(`/api/specialized/urban-planning/reports/${id}`, data)
      const updatedReport = response.report
      setReports(prev => prev.map(report => report.id === id ? updatedReport : report))
      return updatedReport
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar relatório'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const addData = useCallback(async (id: string, category: string, data: any): Promise<UrbanReport> => {
    try {
      setError(null)
      const response = await apiClient.post(`/api/specialized/urban-planning/reports/${id}/data/${category}`, data)
      const updatedReport = response.report
      setReports(prev => prev.map(report => report.id === id ? updatedReport : report))
      return updatedReport
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao adicionar dados'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const updateData = useCallback(async (id: string, category: string, data: any): Promise<UrbanReport> => {
    try {
      setError(null)
      const response = await apiClient.put(`/api/specialized/urban-planning/reports/${id}/data/${category}`, data)
      const updatedReport = response.report
      setReports(prev => prev.map(report => report.id === id ? updatedReport : report))
      return updatedReport
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar dados'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const addAnalysis = useCallback(async (id: string, analysis: any): Promise<UrbanReport> => {
    try {
      setError(null)
      const response = await apiClient.post(`/api/specialized/urban-planning/reports/${id}/analysis`, analysis)
      const updatedReport = response.report
      setReports(prev => prev.map(report => report.id === id ? updatedReport : report))
      return updatedReport
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao adicionar análise'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const addIndicator = useCallback(async (id: string, category: string, indicator: any): Promise<UrbanReport> => {
    try {
      setError(null)
      const response = await apiClient.post(`/api/specialized/urban-planning/reports/${id}/indicators/${category}`, indicator)
      const updatedReport = response.report
      setReports(prev => prev.map(report => report.id === id ? updatedReport : report))
      return updatedReport
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao adicionar indicador'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const updateIndicator = useCallback(async (id: string, indicatorId: string, value: number): Promise<UrbanReport> => {
    try {
      setError(null)
      const response = await apiClient.put(`/api/specialized/urban-planning/reports/${id}/indicators/${indicatorId}`, { value })
      const updatedReport = response.report
      setReports(prev => prev.map(report => report.id === id ? updatedReport : report))
      return updatedReport
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar indicador'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const addChallenge = useCallback(async (id: string, challenge: any): Promise<UrbanReport> => {
    try {
      setError(null)
      const response = await apiClient.post(`/api/specialized/urban-planning/reports/${id}/challenges`, challenge)
      const updatedReport = response.report
      setReports(prev => prev.map(report => report.id === id ? updatedReport : report))
      return updatedReport
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao adicionar desafio'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const addRecommendation = useCallback(async (id: string, recommendation: any): Promise<UrbanReport> => {
    try {
      setError(null)
      const response = await apiClient.post(`/api/specialized/urban-planning/reports/${id}/recommendations`, recommendation)
      const updatedReport = response.report
      setReports(prev => prev.map(report => report.id === id ? updatedReport : report))
      return updatedReport
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao adicionar recomendação'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const updateMethodology = useCallback(async (id: string, methodology: any): Promise<UrbanReport> => {
    try {
      setError(null)
      const response = await apiClient.put(`/api/specialized/urban-planning/reports/${id}/methodology`, methodology)
      const updatedReport = response.report
      setReports(prev => prev.map(report => report.id === id ? updatedReport : report))
      return updatedReport
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar metodologia'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const addVisualization = useCallback(async (id: string, visualization: any): Promise<UrbanReport> => {
    try {
      setError(null)
      const response = await apiClient.post(`/api/specialized/urban-planning/reports/${id}/visualizations`, visualization)
      const updatedReport = response.report
      setReports(prev => prev.map(report => report.id === id ? updatedReport : report))
      return updatedReport
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao adicionar visualização'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const addAppendix = useCallback(async (id: string, appendix: any): Promise<UrbanReport> => {
    try {
      setError(null)
      const response = await apiClient.post(`/api/specialized/urban-planning/reports/${id}/appendices`, appendix)
      const updatedReport = response.report
      setReports(prev => prev.map(report => report.id === id ? updatedReport : report))
      return updatedReport
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao adicionar apêndice'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const updateMetadata = useCallback(async (id: string, metadata: any): Promise<UrbanReport> => {
    try {
      setError(null)
      const response = await apiClient.put(`/api/specialized/urban-planning/reports/${id}/metadata`, metadata)
      const updatedReport = response.report
      setReports(prev => prev.map(report => report.id === id ? updatedReport : report))
      return updatedReport
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar metadados'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const addAuthor = useCallback(async (id: string, author: any): Promise<UrbanReport> => {
    try {
      setError(null)
      const response = await apiClient.post(`/api/specialized/urban-planning/reports/${id}/authors`, author)
      const updatedReport = response.report
      setReports(prev => prev.map(report => report.id === id ? updatedReport : report))
      return updatedReport
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao adicionar autor'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const addReviewer = useCallback(async (id: string, reviewer: any): Promise<UrbanReport> => {
    try {
      setError(null)
      const response = await apiClient.post(`/api/specialized/urban-planning/reports/${id}/reviewers`, reviewer)
      const updatedReport = response.report
      setReports(prev => prev.map(report => report.id === id ? updatedReport : report))
      return updatedReport
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao adicionar revisor'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const submitForReview = useCallback(async (id: string): Promise<UrbanReport> => {
    try {
      setError(null)
      const response = await apiClient.post(`/api/specialized/urban-planning/reports/${id}/submit`, {})
      const updatedReport = response.report
      setReports(prev => prev.map(report => report.id === id ? updatedReport : report))
      return updatedReport
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao submeter para revisão'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const approveReport = useCallback(async (id: string): Promise<UrbanReport> => {
    try {
      setError(null)
      const response = await apiClient.post(`/api/specialized/urban-planning/reports/${id}/approve`, {})
      const updatedReport = response.report
      setReports(prev => prev.map(report => report.id === id ? updatedReport : report))
      return updatedReport
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao aprovar relatório'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const publishReport = useCallback(async (id: string): Promise<UrbanReport> => {
    try {
      setError(null)
      const response = await apiClient.post(`/api/specialized/urban-planning/reports/${id}/publish`, {})
      const updatedReport = response.report
      setReports(prev => prev.map(report => report.id === id ? updatedReport : report))
      return updatedReport
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao publicar relatório'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const distributeReport = useCallback(async (id: string, distribution: any): Promise<UrbanReport> => {
    try {
      setError(null)
      const response = await apiClient.post(`/api/specialized/urban-planning/reports/${id}/distribute`, distribution)
      const updatedReport = response.report
      setReports(prev => prev.map(report => report.id === id ? updatedReport : report))
      return updatedReport
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao distribuir relatório'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const addImpact = useCallback(async (id: string, impact: any): Promise<UrbanReport> => {
    try {
      setError(null)
      const response = await apiClient.post(`/api/specialized/urban-planning/reports/${id}/impact`, impact)
      const updatedReport = response.report
      setReports(prev => prev.map(report => report.id === id ? updatedReport : report))
      return updatedReport
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao adicionar impacto'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const scheduleUpdate = useCallback(async (id: string, schedule: string): Promise<UrbanReport> => {
    try {
      setError(null)
      const response = await apiClient.put(`/api/specialized/urban-planning/reports/${id}/schedule`, { schedule })
      const updatedReport = response.report
      setReports(prev => prev.map(report => report.id === id ? updatedReport : report))
      return updatedReport
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao agendar atualização'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const archiveReport = useCallback(async (id: string): Promise<UrbanReport> => {
    return updateReport(id, { status: 'ARCHIVED' } as any)
  }, [updateReport])

  const deleteReport = useCallback(async (id: string): Promise<void> => {
    try {
      setError(null)
      await apiClient.delete(`/api/specialized/urban-planning/reports/${id}`)
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
    updateReport,
    addData,
    updateData,
    addAnalysis,
    addIndicator,
    updateIndicator,
    addChallenge,
    addRecommendation,
    updateMethodology,
    addVisualization,
    addAppendix,
    updateMetadata,
    addAuthor,
    addReviewer,
    submitForReview,
    approveReport,
    publishReport,
    distributeReport,
    addImpact,
    scheduleUpdate,
    archiveReport,
    deleteReport,
    getReportsByType,
    getReportsByCategory,
    getReportsByStatus,
    getRecentReports,
    refreshReports
  }
}

export type { UrbanReport, CreateUrbanReportData, UseUrbanReportsReturn }