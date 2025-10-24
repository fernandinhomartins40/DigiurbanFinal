import { useState, useEffect, useCallback } from 'react'
import { apiClient } from '@/lib/api-client'

export interface PublicWorksReport {
  id: string
  title: string
  type: 'PROJECT_STATUS' | 'FINANCIAL' | 'PROGRESS' | 'QUALITY' | 'SAFETY' | 'EQUIPMENT' | 'CONTRACTS' | 'INSPECTION' | 'PERFORMANCE' | 'CONSOLIDATED'
  category: 'OPERATIONAL' | 'FINANCIAL' | 'TECHNICAL' | 'MANAGEMENT' | 'REGULATORY' | 'STRATEGIC'
  status: 'GENERATING' | 'COMPLETED' | 'FAILED' | 'SCHEDULED'
  period: {
    startDate: string
    endDate: string
    frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'YEARLY' | 'CUSTOM'
  }
  scope: {
    projects?: string[]
    contracts?: string[]
    equipment?: string[]
    inspections?: string[]
    departments?: string[]
    locations?: string[]
  }
  content: {
    summary: {
      totalProjects: number
      activeProjects: number
      completedProjects: number
      delayedProjects: number
      totalBudget: number
      spentBudget: number
      budgetUtilization: number
    }
    projects: Array<{
      id: string
      name: string
      status: string
      progress: number
      budget: {
        approved: number
        spent: number
        remaining: number
      }
      timeline: {
        planned: {
          start: string
          end: string
        }
        actual: {
          start?: string
          end?: string
        }
        delay: number
      }
      performance: {
        overall: string
        technical: number
        schedule: number
        budget: number
      }
    }>
    contracts: Array<{
      id: string
      number: string
      contractor: string
      value: number
      progress: number
      status: string
      performance: {
        overall: number
        quality: number
        timeCompliance: number
        budgetCompliance: number
      }
      payments: {
        total: number
        paid: number
        pending: number
      }
    }>
    equipment: Array<{
      id: string
      name: string
      type: string
      status: string
      utilization: number
      maintenance: {
        lastService: string
        nextService: string
        cost: number
      }
      efficiency: number
    }>
    inspections: Array<{
      id: string
      projectName: string
      type: string
      date: string
      assessment: string
      nonConformities: number
      criticalFindings: number
    }>
    finances: {
      budget: {
        total: number
        allocated: number
        spent: number
        committed: number
        available: number
      }
      expenses: Array<{
        category: string
        planned: number
        actual: number
        variance: number
        percentage: number
      }>
      cashFlow: Array<{
        month: string
        inflow: number
        outflow: number
        balance: number
      }>
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
        ranking: string
      }>
    }
    risks: Array<{
      id: string
      description: string
      category: string
      probability: string
      impact: string
      mitigation: string
      status: string
    }>
    recommendations: Array<{
      id: string
      description: string
      priority: string
      category: string
      estimatedCost: number
      expectedBenefit: string
      timeframe: string
    }>
  }
  metrics: {
    totalPages: number
    chartCount: number
    tableCount: number
    imageCount: number
    generationTime: number
  }
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
  }
  format: {
    type: 'PDF' | 'EXCEL' | 'POWERPOINT' | 'HTML' | 'JSON'
    template: string
    language: 'PT_BR' | 'EN' | 'ES'
    customization: {
      logo?: string
      colors?: {
        primary: string
        secondary: string
        accent: string
      }
      fonts?: {
        header: string
        body: string
      }
      includeCharts: boolean
      includeTables: boolean
      includeImages: boolean
      includeAppendices: boolean
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
    notifications: Array<{
      type: 'EMAIL' | 'SMS' | 'SYSTEM'
      recipients: string[]
      template: string
    }>
  }
  history: Array<{
    id: string
    version: string
    generatedAt: string
    generatedBy: string
    changes: string[]
    fileUrl: string
    fileSize: number
  }>
  createdAt: string
  updatedAt: string
  createdBy: string
  lastModifiedBy: string
}

export interface CreatePublicWorksReportData {
  title: string
  type: 'PROJECT_STATUS' | 'FINANCIAL' | 'PROGRESS' | 'QUALITY' | 'SAFETY' | 'EQUIPMENT' | 'CONTRACTS' | 'INSPECTION' | 'PERFORMANCE' | 'CONSOLIDATED'
  category: 'OPERATIONAL' | 'FINANCIAL' | 'TECHNICAL' | 'MANAGEMENT' | 'REGULATORY' | 'STRATEGIC'
  period: {
    startDate: string
    endDate: string
    frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'YEARLY' | 'CUSTOM'
  }
  scope: {
    projects?: string[]
    contracts?: string[]
    equipment?: string[]
    inspections?: string[]
    departments?: string[]
    locations?: string[]
  }
  format: {
    type: 'PDF' | 'EXCEL' | 'POWERPOINT' | 'HTML' | 'JSON'
    template: string
    language: 'PT_BR' | 'EN' | 'ES'
    customization?: {
      includeCharts: boolean
      includeTables: boolean
      includeImages: boolean
      includeAppendices: boolean
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

export interface PublicWorksReportFilters {
  type?: string
  category?: string
  status?: string
  dateFrom?: string
  dateTo?: string
  createdBy?: string
  department?: string
  frequency?: string
}

export interface ReportTemplate {
  id: string
  name: string
  description: string
  type: string
  category: string
  sections: Array<{
    name: string
    type: 'CHART' | 'TABLE' | 'TEXT' | 'IMAGE' | 'KPI'
    required: boolean
    configurable: boolean
  }>
  customizable: boolean
  preview?: string
}

export interface ReportAnalytics {
  totalReports: number
  reportsThisMonth: number
  automaticReports: number
  averageGenerationTime: number
  mostUsedTemplates: Array<{
    template: string
    count: number
    percentage: number
  }>
  popularTypes: Array<{
    type: string
    count: number
    percentage: number
  }>
  distributionStats: {
    totalRecipients: number
    averageRecipientsPerReport: number
    totalDownloads: number
    totalViews: number
  }
}

export function usePublicWorksReports() {
  const [reports, setReports] = useState<PublicWorksReport[]>([])
  const [templates, setTemplates] = useState<ReportTemplate[]>([])
  const [analytics, setAnalytics] = useState<ReportAnalytics | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchReports = useCallback(async (filters?: PublicWorksReportFilters) => {
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
      const response = await apiClient.get(`/public-works/reports?${params}`)
      setReports(response.data.data || [])
    } catch (err) {
      setError('Erro ao carregar relatórios de obras públicas')
      console.error('Error fetching public works reports:', err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const fetchTemplates = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await apiClient.get('/public-works/reports/templates')
      setTemplates(response.data.data || [])
    } catch (err) {
      setError('Erro ao carregar templates de relatórios')
      console.error('Error fetching report templates:', err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const fetchAnalytics = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await apiClient.get('/public-works/reports/analytics')
      setAnalytics(response.data.data)
    } catch (err) {
      setError('Erro ao carregar analytics de relatórios')
      console.error('Error fetching report analytics:', err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const createReport = useCallback(async (data: CreatePublicWorksReportData) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await apiClient.post('/public-works/reports', data)
      const newReport = response.data.data
      setReports(prev => [newReport, ...prev])
      return newReport
    } catch (err) {
      setError('Erro ao criar relatório de obra pública')
      console.error('Error creating public works report:', err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const generateReport = useCallback(async (id: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await apiClient.post(`/public-works/reports/${id}/generate`)
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
      const response = await apiClient.get(`/public-works/reports/${id}/download${params}`, {
        responseType: 'blob'
      })

      const blob = new Blob([response.data])
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url

      const contentDisposition = response.headers['content-disposition']
      const filename = contentDisposition
        ? contentDisposition.split('filename=')[1]?.replace(/"/g, '')
        : `relatorio-${id}.${format?.toLowerCase() || 'pdf'}`

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
    notifyByEmail: boolean
  }) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await apiClient.post(`/public-works/reports/${id}/share`, shareData)
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
      const response = await apiClient.post(`/public-works/reports/${id}/schedule`, scheduleData)
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
      const response = await apiClient.post(`/public-works/reports/${id}/duplicate`, { title: newTitle })
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
      projects?: string[]
      contracts?: string[]
      equipment?: string[]
    }
    format?: {
      type: 'PDF' | 'EXCEL' | 'POWERPOINT' | 'HTML' | 'JSON'
      template: string
      customization?: any
    }
  }) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await apiClient.put(`/public-works/reports/${id}/settings`, settings)
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
      await apiClient.delete(`/public-works/reports/${id}`)
      setReports(prev => prev.filter(report => report.id !== id))
    } catch (err) {
      setError('Erro ao excluir relatório')
      console.error('Error deleting report:', err)
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

  const getReportsByStatus = useCallback((status: string) => {
    return reports.filter(report => report.status === status)
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

  useEffect(() => {
    fetchReports()
    fetchTemplates()
    fetchAnalytics()
  }, [fetchReports, fetchTemplates, fetchAnalytics])

  return {
    reports,
    templates,
    analytics,
    isLoading,
    error,
    fetchReports,
    fetchTemplates,
    fetchAnalytics,
    createReport,
    generateReport,
    downloadReport,
    shareReport,
    scheduleReport,
    duplicateReport,
    updateReportSettings,
    deleteReport,
    getReportById,
    getReportsByType,
    getReportsByStatus,
    getScheduledReports,
    getRecentReports,
    getMostDownloadedReports,
    getReportsByFrequency
  }
}