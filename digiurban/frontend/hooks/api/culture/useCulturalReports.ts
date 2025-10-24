import { useState, useEffect, useCallback } from 'react'
import { apiClient } from '@/lib/api-client'

export interface CulturalReport {
  id: string
  title: string
  type: 'GENERAL_OVERVIEW' | 'EVENTS_SUMMARY' | 'SPACES_UTILIZATION' | 'ARTISTS_DIRECTORY' | 'PROJECTS_PROGRESS' | 'EDUCATION_METRICS' | 'HERITAGE_STATUS' | 'FUNDING_ANALYSIS' | 'ANNUAL_REPORT' | 'IMPACT_ASSESSMENT'
  category: 'OPERATIONAL' | 'FINANCIAL' | 'STRATEGIC' | 'STATISTICAL' | 'IMPACT' | 'COMPLIANCE'
  status: 'GENERATING' | 'COMPLETED' | 'FAILED' | 'SCHEDULED'
  period: {
    startDate: string
    endDate: string
    frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'YEARLY' | 'CUSTOM'
  }
  scope: {
    events?: string[]
    spaces?: string[]
    projects?: string[]
    artists?: string[]
    programs?: string[]
    heritage?: string[]
    funding?: string[]
    areas?: string[]
  }
  content: {
    summary: {
      totalEvents: number
      activeSpaces: number
      registeredArtists: number
      ongoingProjects: number
      educationPrograms: number
      heritageItems: number
      activeFunding: number
      totalBudget: number
      publicReach: number
    }
    events: {
      total: number
      byType: { [key: string]: number }
      byCategory: { [key: string]: number }
      byStatus: { [key: string]: number }
      attendance: {
        total: number
        average: number
        byEvent: Array<{
          eventId: string
          name: string
          attendance: number
          capacity: number
          occupancyRate: number
        }>
      }
      revenue: {
        total: number
        byEvent: { [key: string]: number }
        ticketSales: number
        sponsorships: number
      }
      satisfaction: {
        average: number
        byEvent: { [key: string]: number }
        feedback: number
      }
    }
    spaces: {
      total: number
      byType: { [key: string]: number }
      byStatus: { [key: string]: number }
      utilization: {
        overall: number
        bySpace: Array<{
          spaceId: string
          name: string
          utilizationRate: number
          eventsHosted: number
          revenue: number
        }>
        peakPeriods: string[]
        lowDemandPeriods: string[]
      }
      maintenance: {
        scheduled: number
        completed: number
        pending: number
        totalCost: number
      }
      visitors: {
        total: number
        bySpace: { [key: string]: number }
        demographics: {
          local: number
          tourist: number
          student: number
          senior: number
        }
      }
    }
    artists: {
      total: number
      byType: { [key: string]: number }
      byDiscipline: { [key: string]: number }
      byLevel: { [key: string]: number }
      active: number
      participations: {
        total: number
        averagePerArtist: number
        topPerformers: Array<{
          artistId: string
          name: string
          participations: number
          averageRating: number
        }>
      }
      development: {
        coursesCompleted: number
        mentorshipPairs: number
        grants: number
        achievements: number
      }
      geographic: {
        local: number
        regional: number
        national: number
        international: number
      }
    }
    projects: {
      total: number
      byType: { [key: string]: number }
      byCategory: { [key: string]: number }
      byStatus: { [key: string]: number }
      budget: {
        total: number
        spent: number
        committed: number
        available: number
        byProject: Array<{
          projectId: string
          name: string
          budget: number
          spent: number
          progress: number
        }>
      }
      timeline: {
        onTime: number
        delayed: number
        completed: number
        averageCompletion: number
      }
      impact: {
        beneficiaries: number
        geographicReach: number
        mediaImpact: number
        sustainability: number
      }
    }
    education: {
      total: number
      byType: { [key: string]: number }
      byCategory: { [key: string]: number }
      byLevel: { [key: string]: number }
      participants: {
        total: number
        enrolled: number
        completed: number
        dropouts: number
        completionRate: number
        demographics: {
          ageGroups: { [key: string]: number }
          education: { [key: string]: number }
          experience: { [key: string]: number }
        }
      }
      satisfaction: {
        overall: number
        content: number
        instructors: number
        facilities: number
        organization: number
      }
      outcomes: {
        certificatesIssued: number
        careerAdvancement: number
        continuedLearning: number
        networkFormed: number
      }
    }
    heritage: {
      total: number
      byType: { [key: string]: number }
      byCategory: { [key: string]: number }
      byCondition: { [key: string]: number }
      protection: {
        protected: number
        unprotected: number
        byLevel: { [key: string]: number }
      }
      conservation: {
        excellent: number
        good: number
        fair: number
        poor: number
        critical: number
        needsUrgentAction: number
      }
      digitization: {
        completed: number
        inProgress: number
        notStarted: number
        completionRate: number
      }
      tourism: {
        visitable: number
        visitors: number
        revenue: number
        routes: number
      }
    }
    funding: {
      total: number
      byType: { [key: string]: number }
      byCategory: { [key: string]: number }
      byStatus: { [key: string]: number }
      budget: {
        total: number
        distributed: number
        pending: number
        applications: number
      }
      applications: {
        total: number
        approved: number
        rejected: number
        pending: number
        approvalRate: number
        demographics: {
          byType: { [key: string]: number }
          byRegion: { [key: string]: number }
          byAge: { [key: string]: number }
        }
      }
      impact: {
        projectsCompleted: number
        beneficiariesReached: number
        jobsCreated: number
        economicImpact: number
      }
    }
    performance: {
      kpis: Array<{
        name: string
        value: number
        target: number
        unit: string
        trend: 'UP' | 'DOWN' | 'STABLE'
        status: 'GOOD' | 'WARNING' | 'CRITICAL'
      }>
      benchmarks: Array<{
        metric: string
        currentValue: number
        benchmarkValue: number
        performance: number
        comparison: 'ABOVE' | 'BELOW' | 'EQUAL'
      }>
      trends: Array<{
        metric: string
        period: string
        values: number[]
        trend: 'INCREASING' | 'DECREASING' | 'STABLE' | 'VOLATILE'
      }>
    }
    financial: {
      budget: {
        total: number
        allocated: number
        spent: number
        committed: number
        available: number
        variance: number
      }
      revenue: {
        total: number
        tickets: number
        rentals: number
        grants: number
        sponsorships: number
        other: number
      }
      expenses: {
        total: number
        personnel: number
        operations: number
        maintenance: number
        programming: number
        marketing: number
        equipment: number
      }
      efficiency: {
        costPerEvent: number
        costPerParticipant: number
        revenuePerSpace: number
        roi: number
      }
    }
    community: {
      engagement: {
        events: number
        participants: number
        volunteers: number
        partnerships: number
      }
      demographics: {
        ageGroups: { [key: string]: number }
        education: { [key: string]: number }
        income: { [key: string]: number }
        geographic: { [key: string]: number }
      }
      satisfaction: {
        overall: number
        accessibility: number
        programming: number
        facilities: number
        staff: number
      }
      impact: {
        cultural: string[]
        social: string[]
        economic: string[]
        educational: string[]
      }
    }
  }
  visualizations: Array<{
    type: 'CHART' | 'GRAPH' | 'MAP' | 'INFOGRAPHIC' | 'TABLE'
    title: string
    description: string
    data: any
    config: any
    url?: string
  }>
  recommendations: Array<{
    id: string
    category: 'PROGRAMMING' | 'INFRASTRUCTURE' | 'MARKETING' | 'BUDGET' | 'STAFF' | 'TECHNOLOGY'
    priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
    title: string
    description: string
    rationale: string
    expectedImpact: string
    estimatedCost: number
    timeline: string
    responsible: string
    resources: string[]
  }>
  insights: Array<{
    type: 'OPPORTUNITY' | 'RISK' | 'TREND' | 'ANOMALY' | 'SUCCESS'
    title: string
    description: string
    data: any
    confidence: 'LOW' | 'MEDIUM' | 'HIGH'
    actionRequired: boolean
    suggestedActions: string[]
  }>
  distribution: {
    recipients: Array<{
      id: string
      name: string
      email: string
      role: string
      department: string
      accessLevel: 'VIEW' | 'DOWNLOAD' | 'EDIT'
    }>
    publicationDate?: string
    accessUrl?: string
    downloadCount: number
    viewCount: number
    shared: boolean
  }
  format: {
    type: 'PDF' | 'EXCEL' | 'POWERPOINT' | 'HTML' | 'JSON' | 'DASHBOARD'
    template: string
    language: 'PT_BR' | 'EN' | 'ES'
    customization: {
      logo?: string
      colors?: {
        primary: string
        secondary: string
        accent: string
      }
      includeCharts: boolean
      includeTables: boolean
      includeRecommendations: boolean
      includeRawData: boolean
      interactive: boolean
    }
  }
  automation: {
    isScheduled: boolean
    schedule?: {
      frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'YEARLY'
      dayOfWeek?: number
      dayOfMonth?: number
      time: string
      timezone: string
    }
    autoDistribute: boolean
    triggers: Array<{
      condition: string
      action: string
      enabled: boolean
    }>
  }
  metadata: {
    generatedAt: string
    generatedBy: string
    dataSource: string[]
    dataQuality: {
      completeness: number
      accuracy: number
      timeliness: number
      consistency: number
    }
    version: string
    approvals: Array<{
      approver: string
      date: string
      notes?: string
    }>
  }
  createdAt: string
  updatedAt: string
  createdBy: string
  lastModifiedBy: string
}

export interface CreateCulturalReportData {
  title: string
  type: 'GENERAL_OVERVIEW' | 'EVENTS_SUMMARY' | 'SPACES_UTILIZATION' | 'ARTISTS_DIRECTORY' | 'PROJECTS_PROGRESS' | 'EDUCATION_METRICS' | 'HERITAGE_STATUS' | 'FUNDING_ANALYSIS' | 'ANNUAL_REPORT' | 'IMPACT_ASSESSMENT'
  category: 'OPERATIONAL' | 'FINANCIAL' | 'STRATEGIC' | 'STATISTICAL' | 'IMPACT' | 'COMPLIANCE'
  period: {
    startDate: string
    endDate: string
    frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'YEARLY' | 'CUSTOM'
  }
  scope: {
    events?: string[]
    spaces?: string[]
    projects?: string[]
    artists?: string[]
    programs?: string[]
    heritage?: string[]
    funding?: string[]
    areas?: string[]
  }
  format: {
    type: 'PDF' | 'EXCEL' | 'POWERPOINT' | 'HTML' | 'JSON' | 'DASHBOARD'
    template: string
    language: 'PT_BR' | 'EN' | 'ES'
    customization?: {
      includeCharts: boolean
      includeTables: boolean
      includeRecommendations: boolean
      includeRawData: boolean
      interactive: boolean
    }
  }
  recipients?: Array<{
    id: string
    accessLevel: 'VIEW' | 'DOWNLOAD' | 'EDIT'
  }>
  automation?: {
    isScheduled: boolean
    schedule?: {
      frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'YEARLY'
      dayOfWeek?: number
      dayOfMonth?: number
      time: string
      timezone: string
    }
    autoDistribute: boolean
  }
}

export interface CulturalReportFilters {
  type?: string
  category?: string
  status?: string
  dateFrom?: string
  dateTo?: string
  createdBy?: string
  shared?: boolean
  automated?: boolean
}

export interface CulturalAnalytics {
  overview: {
    totalEvents: number
    totalSpaces: number
    totalArtists: number
    totalProjects: number
    totalBudget: number
    publicReach: number
  }
  trends: Array<{
    metric: string
    currentValue: number
    previousValue: number
    change: number
    trend: 'UP' | 'DOWN' | 'STABLE'
    period: string
  }>
  topPerformers: {
    events: Array<{ id: string; name: string; attendance: number }>
    spaces: Array<{ id: string; name: string; utilization: number }>
    artists: Array<{ id: string; name: string; rating: number }>
    projects: Array<{ id: string; name: string; impact: number }>
  }
  alerts: Array<{
    type: 'BUDGET' | 'ATTENDANCE' | 'MAINTENANCE' | 'PERFORMANCE' | 'DEADLINE'
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
    message: string
    entity: string
    date: string
  }>
}

export function useCulturalReports() {
  const [reports, setReports] = useState<CulturalReport[]>([])
  const [analytics, setAnalytics] = useState<CulturalAnalytics | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchReports = useCallback(async (filters?: CulturalReportFilters) => {
    setIsLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams()
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            params.append(key, value.toString())
          }
        })
      }
      const response = await apiClient.get(`/culture/reports?${params}`)
      setReports(response.data.data || [])
    } catch (err) {
      setError('Erro ao carregar relatórios culturais')
      console.error('Error fetching cultural reports:', err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const fetchAnalytics = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await apiClient.get('/culture/analytics')
      setAnalytics(response.data.data)
    } catch (err) {
      setError('Erro ao carregar analytics')
      console.error('Error fetching analytics:', err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const createReport = useCallback(async (data: CreateCulturalReportData) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await apiClient.post('/culture/reports', data)
      const newReport = response.data.data
      setReports(prev => [newReport, ...prev])
      return newReport
    } catch (err) {
      setError('Erro ao criar relatório')
      console.error('Error creating cultural report:', err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const generateReport = useCallback(async (id: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await apiClient.post(`/culture/reports/${id}/generate`)
      const updatedReport = response.data.data
      setReports(prev => prev.map(report => report.id === id ? updatedReport : report))
      return updatedReport
    } catch (err) {
      setError('Erro ao gerar relatório')
      console.error('Error generating report:', err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const downloadReport = useCallback(async (id: string, format?: 'PDF' | 'EXCEL' | 'POWERPOINT') => {
    setIsLoading(true)
    setError(null)
    try {
      const params = format ? `?format=${format}` : ''
      const response = await apiClient.get(`/culture/reports/${id}/download${params}`, {
        responseType: 'blob'
      })

      const blob = new Blob([response.data])
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url

      const contentDisposition = response.headers['content-disposition']
      const filename = contentDisposition
        ? contentDisposition.split('filename=')[1]?.replace(/"/g, '')
        : `relatorio-cultural-${id}.${format?.toLowerCase() || 'pdf'}`

      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)

      setReports(prev => prev.map(report =>
        report.id === id
          ? { ...report, distribution: { ...report.distribution, downloadCount: report.distribution.downloadCount + 1 } }
          : report
      ))
    } catch (err) {
      setError('Erro ao baixar relatório')
      console.error('Error downloading report:', err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const shareReport = useCallback(async (id: string, shareData: {
    recipients: Array<{
      id: string
      accessLevel: 'VIEW' | 'DOWNLOAD' | 'EDIT'
    }>
    message?: string
    expirationDate?: string
  }) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await apiClient.post(`/culture/reports/${id}/share`, shareData)
      const updatedReport = response.data.data
      setReports(prev => prev.map(report => report.id === id ? updatedReport : report))
      return updatedReport
    } catch (err) {
      setError('Erro ao compartilhar relatório')
      console.error('Error sharing report:', err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const scheduleReport = useCallback(async (id: string, scheduleData: {
    frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'YEARLY'
    dayOfWeek?: number
    dayOfMonth?: number
    time: string
    timezone: string
    autoDistribute: boolean
    recipients?: string[]
  }) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await apiClient.post(`/culture/reports/${id}/schedule`, scheduleData)
      const updatedReport = response.data.data
      setReports(prev => prev.map(report => report.id === id ? updatedReport : report))
      return updatedReport
    } catch (err) {
      setError('Erro ao agendar relatório')
      console.error('Error scheduling report:', err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const duplicateReport = useCallback(async (id: string, newTitle: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await apiClient.post(`/culture/reports/${id}/duplicate`, { title: newTitle })
      const duplicatedReport = response.data.data
      setReports(prev => [duplicatedReport, ...prev])
      return duplicatedReport
    } catch (err) {
      setError('Erro ao duplicar relatório')
      console.error('Error duplicating report:', err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const updateReportSettings = useCallback(async (id: string, settings: {
    title?: string
    period?: {
      startDate: string
      endDate: string
    }
    scope?: {
      events?: string[]
      spaces?: string[]
      projects?: string[]
      artists?: string[]
    }
    format?: {
      type: 'PDF' | 'EXCEL' | 'POWERPOINT' | 'HTML' | 'JSON' | 'DASHBOARD'
      customization?: any
    }
  }) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await apiClient.put(`/culture/reports/${id}/settings`, settings)
      const updatedReport = response.data.data
      setReports(prev => prev.map(report => report.id === id ? updatedReport : report))
      return updatedReport
    } catch (err) {
      setError('Erro ao atualizar configurações do relatório')
      console.error('Error updating report settings:', err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const deleteReport = useCallback(async (id: string) => {
    setIsLoading(true)
    setError(null)
    try {
      await apiClient.delete(`/culture/reports/${id}`)
      setReports(prev => prev.filter(report => report.id !== id))
    } catch (err) {
      setError('Erro ao excluir relatório')
      console.error('Error deleting report:', err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const generateDashboard = useCallback(async (dashboardConfig: {
    widgets: Array<{
      type: 'KPI' | 'CHART' | 'TABLE' | 'MAP' | 'GAUGE'
      title: string
      dataSource: string
      config: any
      size: 'SMALL' | 'MEDIUM' | 'LARGE'
      position: { x: number; y: number }
    }>
    layout: 'GRID' | 'FLOW' | 'CUSTOM'
    refreshInterval?: number
    filters?: any
  }) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await apiClient.post('/culture/dashboard', dashboardConfig)
      return response.data.data
    } catch (err) {
      setError('Erro ao gerar dashboard')
      console.error('Error generating dashboard:', err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const generateInsights = useCallback(async (period: { start: string; end: string }, areas?: string[]) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await apiClient.post('/culture/insights', { period, areas })
      return response.data.data
    } catch (err) {
      setError('Erro ao gerar insights')
      console.error('Error generating insights:', err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const getReportById = useCallback((id: string) => {
    return reports.find(report => report.id === id)
  }, [reports])

  const getReportsByType = useCallback((type: string) => {
    return reports.filter(report => report.type === type)
  }, [reports])

  const getReportsByCategory = useCallback((category: string) => {
    return reports.filter(report => report.category === category)
  }, [reports])

  const getScheduledReports = useCallback(() => {
    return reports.filter(report => report.automation.isScheduled)
  }, [reports])

  const getRecentReports = useCallback((days: number = 7) => {
    const since = new Date()
    since.setDate(since.getDate() - days)
    const sinceStr = since.toISOString()

    return reports.filter(report => report.createdAt >= sinceStr)
  }, [reports])

  const getMostDownloadedReports = useCallback(() => {
    return reports
      .filter(report => report.distribution.downloadCount > 0)
      .sort((a, b) => b.distribution.downloadCount - a.distribution.downloadCount)
      .slice(0, 10)
  }, [reports])

  const getReportsByFrequency = useCallback((frequency: string) => {
    return reports.filter(report => report.period.frequency === frequency)
  }, [reports])

  const getCriticalAlerts = useCallback(() => {
    return analytics?.alerts?.filter(alert => alert.severity === 'CRITICAL') || []
  }, [analytics])

  const getPerformanceTrends = useCallback(() => {
    return analytics?.trends?.filter(trend => trend.trend !== 'STABLE') || []
  }, [analytics])

  useEffect(() => {
    fetchReports()
    fetchAnalytics()
  }, [fetchReports, fetchAnalytics])

  return {
    reports,
    analytics,
    isLoading,
    error,
    fetchReports,
    fetchAnalytics,
    createReport,
    generateReport,
    downloadReport,
    shareReport,
    scheduleReport,
    duplicateReport,
    updateReportSettings,
    deleteReport,
    generateDashboard,
    generateInsights,
    getReportById,
    getReportsByType,
    getReportsByCategory,
    getScheduledReports,
    getRecentReports,
    getMostDownloadedReports,
    getReportsByFrequency,
    getCriticalAlerts,
    getPerformanceTrends
  }
}