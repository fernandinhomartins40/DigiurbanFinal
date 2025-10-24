import { useState, useEffect, useCallback } from 'react'
import { apiClient } from '@/lib/api-client'

export interface EnvironmentalReport {
  id: string
  title: string
  type: 'LICENSING' | 'MONITORING' | 'WASTE_MANAGEMENT' | 'FORESTRY' | 'EDUCATION' | 'COMPLIANCE' | 'IMPACT_ASSESSMENT' | 'ANNUAL_REPORT' | 'CONSOLIDATED'
  category: 'REGULATORY' | 'OPERATIONAL' | 'STRATEGIC' | 'TECHNICAL' | 'STATISTICAL' | 'COMPLIANCE'
  status: 'GENERATING' | 'COMPLETED' | 'FAILED' | 'SCHEDULED'
  period: {
    startDate: string
    endDate: string
    frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'YEARLY' | 'CUSTOM'
  }
  scope: {
    licenses?: string[]
    monitoringStations?: string[]
    wasteManagements?: string[]
    trees?: string[]
    educationPrograms?: string[]
    areas?: string[]
    themes?: string[]
  }
  content: {
    summary: {
      totalLicenses: number
      activeLicenses: number
      expiredLicenses: number
      nonCompliantLicenses: number
      monitoringStations: number
      activeStations: number
      criticalAlerts: number
      wasteGenerated: number
      wasteRecycled: number
      treesInventoried: number
      treesPlanted: number
      educationParticipants: number
      educationPrograms: number
    }
    licensing: {
      applications: {
        total: number
        submitted: number
        underAnalysis: number
        approved: number
        denied: number
        pending: number
      }
      byType: { [type: string]: number }
      bySector: { [sector: string]: number }
      byStatus: { [status: string]: number }
      processingTime: {
        average: number
        median: number
        minimum: number
        maximum: number
      }
      compliance: {
        compliant: number
        nonCompliant: number
        partialCompliant: number
        unknown: number
        violations: Array<{
          type: string
          count: number
          severity: string
        }>
      }
      inspections: {
        scheduled: number
        completed: number
        findings: number
        nonCompliances: number
      }
      revenue: {
        analysisfees: number
        inspectionFees: number
        monitoringFees: number
        penalties: number
        total: number
      }
    }
    monitoring: {
      airQuality: {
        stations: number
        parameters: string[]
        compliance: Array<{
          parameter: string
          compliant: number
          exceeded: number
          percentage: number
        }>
        trends: Array<{
          parameter: string
          trend: 'IMPROVING' | 'STABLE' | 'WORSENING'
          change: number
        }>
        alerts: {
          total: number
          critical: number
          resolved: number
          active: number
        }
      }
      waterQuality: {
        stations: number
        parameters: string[]
        compliance: Array<{
          parameter: string
          compliant: number
          exceeded: number
          percentage: number
        }>
        trends: Array<{
          parameter: string
          trend: 'IMPROVING' | 'STABLE' | 'WORSENING'
          change: number
        }>
      }
      noise: {
        measurements: number
        compliance: number
        exceedances: number
        complaints: number
      }
      dataQuality: {
        completeness: number
        accuracy: number
        timeliness: number
        availability: number
      }
    }
    wasteManagement: {
      generation: {
        total: number
        residential: number
        commercial: number
        industrial: number
        healthcare: number
        construction: number
        hazardous: number
      }
      collection: {
        coverage: number
        efficiency: number
        routes: number
        vehicles: number
        complaints: number
      }
      treatment: {
        recycling: {
          rate: number
          volume: number
          revenue: number
          materials: { [material: string]: number }
        }
        composting: {
          volume: number
          quality: string
          production: number
        }
        disposal: {
          landfill: number
          incineration: number
          otherMethods: number
        }
      }
      costs: {
        collection: number
        treatment: number
        disposal: number
        total: number
        costPerTon: number
      }
      environmental: {
        ghgEmissions: number
        energyRecovery: number
        waterSavings: number
        soilProtection: number
      }
    }
    forestry: {
      inventory: {
        totalTrees: number
        species: number
        nativeSpecies: number
        exoticSpecies: number
        diversity: number
      }
      condition: {
        excellent: number
        good: number
        fair: number
        poor: number
        critical: number
        dead: number
      }
      management: {
        planted: number
        pruned: number
        removed: number
        treated: number
        adopted: number
      }
      coverage: {
        canopyCoverage: number
        targetCoverage: number
        gap: number
        neighborhoods: { [neighborhood: string]: number }
      }
      ecosystemServices: {
        co2Sequestration: number
        oxygenProduction: number
        airPurification: number
        energySavings: number
        stormwaterManagement: number
        totalValue: number
      }
      threats: {
        diseases: number
        pests: number
        structuralRisks: number
        environmentalStress: number
      }
    }
    education: {
      programs: {
        total: number
        active: number
        completed: number
        byType: { [type: string]: number }
        byTheme: { [theme: string]: number }
        byAudience: { [audience: string]: number }
      }
      participation: {
        total: number
        children: number
        students: number
        adults: number
        professionals: number
        community: number
      }
      outcomes: {
        completion: number
        satisfaction: number
        knowledgeGain: number
        behaviorChange: number
        certification: number
      }
      reach: {
        directBeneficiaries: number
        indirectBeneficiaries: number
        institutions: number
        communities: number
        networkFormed: number
      }
      impact: {
        awarenessIncrease: number
        practiceAdoption: number
        policyInfluence: number
        capacityBuilding: number
      }
    }
    compliance: {
      regulations: Array<{
        regulation: string
        authority: string
        compliance: 'COMPLIANT' | 'NON_COMPLIANT' | 'PARTIAL'
        gaps: string[]
        actions: string[]
      }>
      audits: {
        internal: number
        external: number
        regulatory: number
        findings: number
        resolved: number
      }
      certifications: {
        valid: number
        expired: number
        suspended: number
        pending: number
      }
      violations: {
        total: number
        minor: number
        major: number
        critical: number
        fines: number
        resolved: number
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
        benchmark?: number
      }>
      efficiency: {
        licensing: {
          processingTime: number
          backlog: number
          satisfaction: number
        }
        monitoring: {
          dataAvailability: number
          responseTime: number
          accuracy: number
        }
        waste: {
          diversionRate: number
          recyclingRate: number
          costEfficiency: number
        }
        forestry: {
          survivalRate: number
          managementEfficiency: number
          serviceValue: number
        }
        education: {
          reachEfficiency: number
          costPerParticipant: number
          impactScore: number
        }
      }
      trends: Array<{
        indicator: string
        period: string
        values: number[]
        trend: 'INCREASING' | 'DECREASING' | 'STABLE' | 'VOLATILE'
        projection?: number
      }>
    }
    budget: {
      allocated: number
      spent: number
      committed: number
      available: number
      byProgram: {
        licensing: number
        monitoring: number
        waste: number
        forestry: number
        education: number
        administration: number
      }
      efficiency: {
        costPerLicense: number
        costPerMonitoringPoint: number
        costPerTonWaste: number
        costPerTree: number
        costPerParticipant: number
      }
      revenue: {
        fees: number
        fines: number
        sales: number
        grants: number
        total: number
      }
    }
    environmental: {
      indicators: Array<{
        indicator: string
        value: number
        unit: string
        baseline: number
        target: number
        trend: 'IMPROVING' | 'STABLE' | 'WORSENING'
        status: 'GOOD' | 'WARNING' | 'CRITICAL'
      }>
      impacts: {
        positive: string[]
        negative: string[]
        mitigation: string[]
        enhancement: string[]
      }
      quality: {
        air: 'EXCELLENT' | 'GOOD' | 'MODERATE' | 'POOR' | 'VERY_POOR'
        water: 'EXCELLENT' | 'GOOD' | 'MODERATE' | 'POOR' | 'VERY_POOR'
        soil: 'EXCELLENT' | 'GOOD' | 'MODERATE' | 'POOR' | 'VERY_POOR'
        noise: 'EXCELLENT' | 'GOOD' | 'MODERATE' | 'POOR' | 'VERY_POOR'
      }
      biodiversity: {
        speciesCount: number
        endangeredSpecies: number
        habitatQuality: string
        connectivityIndex: number
      }
      climate: {
        temperature: number
        precipitation: number
        extremeEvents: number
        adaptation: string[]
        mitigation: string[]
      }
    }
    social: {
      community: {
        complaints: number
        suggestions: number
        participation: number
        satisfaction: number
        awareness: number
      }
      health: {
        exposureReduction: number
        riskAssessment: string
        vulnerablePopulations: number
        healthBenefits: string[]
      }
      equity: {
        accessibilityImprovements: number
        vulnerableAreasCoverage: number
        participationDiversity: number
        benefitDistribution: string
      }
      capacity: {
        staffTraining: number
        institutionalCapacity: string
        technicalCapacity: string
        partnerNetworks: number
      }
    }
  }
  visualizations: Array<{
    type: 'CHART' | 'MAP' | 'GRAPH' | 'DASHBOARD' | 'INFOGRAPHIC'
    title: string
    description: string
    data: any
    config: any
    url?: string
  }>
  recommendations: Array<{
    id: string
    area: 'LICENSING' | 'MONITORING' | 'WASTE' | 'FORESTRY' | 'EDUCATION' | 'COMPLIANCE' | 'GENERAL'
    priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
    title: string
    description: string
    rationale: string
    expectedOutcome: string
    estimatedCost: number
    timeline: string
    responsible: string
    resources: string[]
    dependencies: string[]
  }>
  insights: Array<{
    type: 'OPPORTUNITY' | 'RISK' | 'TREND' | 'ACHIEVEMENT' | 'CHALLENGE'
    title: string
    description: string
    evidence: string[]
    confidence: 'LOW' | 'MEDIUM' | 'HIGH'
    actionRequired: boolean
    suggestedActions: string[]
    stakeholders: string[]
  }>
  methodology: {
    dataCollection: {
      sources: string[]
      methods: string[]
      quality: {
        completeness: number
        accuracy: number
        timeliness: number
        consistency: number
      }
      limitations: string[]
    }
    analysis: {
      techniques: string[]
      software: string[]
      validation: string[]
      uncertainty: string
    }
    indicators: Array<{
      name: string
      definition: string
      calculation: string
      unit: string
      frequency: string
      target?: number
    }>
  }
  distribution: {
    recipients: Array<{
      id: string
      name: string
      email: string
      role: string
      organization: string
      accessLevel: 'VIEW' | 'DOWNLOAD' | 'EDIT'
    }>
    publicationDate?: string
    accessUrl?: string
    downloadCount: number
    viewCount: number
    public: boolean
    restrictions: string[]
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
      includeExecutiveSummary: boolean
      includeMethodology: boolean
      includeAppendices: boolean
      includeVisualization: boolean
      includeRecommendations: boolean
      includeRawData: boolean
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
      threshold?: number
      enabled: boolean
    }>
    notifications: Array<{
      event: string
      method: 'EMAIL' | 'SMS' | 'SYSTEM'
      recipients: string[]
      template: string
    }>
  }
  quality: {
    review: {
      technical: {
        reviewer: string
        date: string
        approved: boolean
        comments: string[]
      }
      management: {
        reviewer: string
        date: string
        approved: boolean
        comments: string[]
      }
      external?: {
        reviewer: string
        organization: string
        date: string
        approved: boolean
        comments: string[]
      }
    }
    validation: {
      dataValidation: boolean
      peerReview: boolean
      stakeholderReview: boolean
      qualityScore: number
    }
    version: {
      number: string
      changes: string[]
      author: string
      date: string
    }
  }
  metadata: {
    generatedAt: string
    generatedBy: string
    dataSource: string[]
    software: string[]
    version: string
    classification: 'PUBLIC' | 'RESTRICTED' | 'CONFIDENTIAL'
    keywords: string[]
    abstract: string
  }
  createdAt: string
  updatedAt: string
  createdBy: string
  lastModifiedBy: string
}

export interface CreateEnvironmentalReportData {
  title: string
  type: 'LICENSING' | 'MONITORING' | 'WASTE_MANAGEMENT' | 'FORESTRY' | 'EDUCATION' | 'COMPLIANCE' | 'IMPACT_ASSESSMENT' | 'ANNUAL_REPORT' | 'CONSOLIDATED'
  category: 'REGULATORY' | 'OPERATIONAL' | 'STRATEGIC' | 'TECHNICAL' | 'STATISTICAL' | 'COMPLIANCE'
  period: {
    startDate: string
    endDate: string
    frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'YEARLY' | 'CUSTOM'
  }
  scope: {
    licenses?: string[]
    monitoringStations?: string[]
    wasteManagements?: string[]
    trees?: string[]
    educationPrograms?: string[]
    areas?: string[]
    themes?: string[]
  }
  format: {
    type: 'PDF' | 'EXCEL' | 'POWERPOINT' | 'HTML' | 'JSON' | 'DASHBOARD'
    template: string
    language: 'PT_BR' | 'EN' | 'ES'
    customization?: {
      includeExecutiveSummary: boolean
      includeMethodology: boolean
      includeAppendices: boolean
      includeVisualization: boolean
      includeRecommendations: boolean
      includeRawData: boolean
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
  public?: boolean
}

export interface EnvironmentalReportFilters {
  type?: string
  category?: string
  status?: string
  dateFrom?: string
  dateTo?: string
  createdBy?: string
  public?: boolean
  automated?: boolean
}

export interface EnvironmentalDashboard {
  overview: {
    licenses: { total: number; trend: 'UP' | 'DOWN' | 'STABLE' }
    monitoring: { stations: number; alerts: number }
    waste: { generated: number; recycled: number }
    trees: { total: number; planted: number }
    education: { programs: number; participants: number }
  }
  alerts: Array<{
    type: 'COMPLIANCE' | 'MONITORING' | 'WASTE' | 'FORESTRY' | 'EDUCATION'
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
    message: string
    date: string
    entity: string
  }>
  trends: Array<{
    metric: string
    currentValue: number
    previousValue: number
    change: number
    trend: 'UP' | 'DOWN' | 'STABLE'
  }>
  performance: Array<{
    area: string
    score: number
    target: number
    status: 'GOOD' | 'WARNING' | 'CRITICAL'
  }>
}

export function useEnvironmentalReports() {
  const [reports, setReports] = useState<EnvironmentalReport[]>([])
  const [dashboard, setDashboard] = useState<EnvironmentalDashboard | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchReports = useCallback(async (filters?: EnvironmentalReportFilters) => {
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
      const response = await apiClient.get(`/environment/reports?${params}`)
      setReports(response.data.data || [])
    } catch (err) {
      setError('Erro ao carregar relatórios ambientais')
      console.error('Error fetching environmental reports:', err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const fetchDashboard = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await apiClient.get('/environment/dashboard')
      setDashboard(response.data.data)
    } catch (err) {
      setError('Erro ao carregar dashboard')
      console.error('Error fetching dashboard:', err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const createReport = useCallback(async (data: CreateEnvironmentalReportData) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await apiClient.post('/environment/reports', data)
      const newReport = response.data.data
      setReports(prev => [newReport, ...prev])
      return newReport
    } catch (err) {
      setError('Erro ao criar relatório')
      console.error('Error creating environmental report:', err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const generateReport = useCallback(async (id: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await apiClient.post(`/environment/reports/${id}/generate`)
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
      const response = await apiClient.get(`/environment/reports/${id}/download${params}`, {
        responseType: 'blob'
      })

      const blob = new Blob([response.data])
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url

      const contentDisposition = response.headers['content-disposition']
      const filename = contentDisposition
        ? contentDisposition.split('filename=')[1]?.replace(/"/g, '')
        : `relatorio-ambiental-${id}.${format?.toLowerCase() || 'pdf'}`

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
    makePublic?: boolean
  }) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await apiClient.post(`/environment/reports/${id}/share`, shareData)
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
    triggers?: Array<{
      condition: string
      action: string
      threshold?: number
    }>
  }) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await apiClient.post(`/environment/reports/${id}/schedule`, scheduleData)
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
      const response = await apiClient.post(`/environment/reports/${id}/duplicate`, { title: newTitle })
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

  const reviewReport = useCallback(async (id: string, reviewData: {
    level: 'TECHNICAL' | 'MANAGEMENT' | 'EXTERNAL'
    approved: boolean
    comments: string[]
    recommendations?: string[]
  }) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await apiClient.post(`/environment/reports/${id}/review`, reviewData)
      const updatedReport = response.data.data
      setReports(prev => prev.map(report => report.id === id ? updatedReport : report))
      return updatedReport
    } catch (err) {
      setError('Erro ao revisar relatório')
      console.error('Error reviewing report:', err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const publishReport = useCallback(async (id: string, publicationData: {
    makePublic: boolean
    restrictions?: string[]
    notifyStakeholders: boolean
    publicationNote?: string
  }) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await apiClient.post(`/environment/reports/${id}/publish`, publicationData)
      const updatedReport = response.data.data
      setReports(prev => prev.map(report => report.id === id ? updatedReport : report))
      return updatedReport
    } catch (err) {
      setError('Erro ao publicar relatório')
      console.error('Error publishing report:', err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const deleteReport = useCallback(async (id: string) => {
    setIsLoading(true)
    setError(null)
    try {
      await apiClient.delete(`/environment/reports/${id}`)
      setReports(prev => prev.filter(report => report.id !== id))
    } catch (err) {
      setError('Erro ao excluir relatório')
      console.error('Error deleting report:', err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const generateCustomDashboard = useCallback(async (dashboardConfig: {
    widgets: Array<{
      type: 'KPI' | 'CHART' | 'TABLE' | 'MAP' | 'GAUGE' | 'ALERT'
      title: string
      dataSource: string
      config: any
      size: 'SMALL' | 'MEDIUM' | 'LARGE'
      position: { x: number; y: number }
    }>
    layout: 'GRID' | 'FLOW' | 'CUSTOM'
    refreshInterval?: number
    filters?: any
    public?: boolean
  }) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await apiClient.post('/environment/dashboard/custom', dashboardConfig)
      return response.data.data
    } catch (err) {
      setError('Erro ao gerar dashboard customizado')
      console.error('Error generating custom dashboard:', err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const generateAnalytics = useCallback(async (analyticsConfig: {
    period: { start: string; end: string }
    areas: string[]
    metrics: string[]
    analysis: 'DESCRIPTIVE' | 'DIAGNOSTIC' | 'PREDICTIVE' | 'PRESCRIPTIVE'
    includeForecasting: boolean
    includeComparisons: boolean
  }) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await apiClient.post('/environment/analytics', analyticsConfig)
      return response.data.data
    } catch (err) {
      setError('Erro ao gerar analytics')
      console.error('Error generating analytics:', err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const exportData = useCallback(async (exportConfig: {
    dataType: 'LICENSING' | 'MONITORING' | 'WASTE' | 'FORESTRY' | 'EDUCATION' | 'ALL'
    period: { start: string; end: string }
    format: 'CSV' | 'JSON' | 'XML'
    aggregation?: 'NONE' | 'DAILY' | 'WEEKLY' | 'MONTHLY'
    filters?: any
  }) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await apiClient.post('/environment/export', exportConfig, {
        responseType: 'blob'
      })

      const blob = new Blob([response.data])
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `dados-ambientais-${new Date().toISOString().split('T')[0]}.${exportConfig.format.toLowerCase()}`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (err) {
      setError('Erro ao exportar dados')
      console.error('Error exporting data:', err)
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

  const getPublicReports = useCallback(() => {
    return reports.filter(report => report.distribution.public)
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

  const getPendingReviews = useCallback(() => {
    return reports.filter(report =>
      !report.quality?.review?.technical?.approved ||
      !report.quality?.review?.management?.approved
    )
  }, [reports])

  const getCriticalAlerts = useCallback(() => {
    return dashboard?.alerts?.filter(alert => alert.severity === 'CRITICAL') || []
  }, [dashboard])

  const getPerformanceTrends = useCallback(() => {
    return dashboard?.trends?.filter(trend => trend.trend !== 'STABLE') || []
  }, [dashboard])

  const getComplianceStatus = useCallback(() => {
    const compliantReports = reports.filter(report =>
      report.content?.compliance?.regulations?.every(reg => reg.compliance === 'COMPLIANT')
    )
    return reports.length > 0 ? (compliantReports.length / reports.length) * 100 : 0
  }, [reports])

  useEffect(() => {
    fetchReports()
    fetchDashboard()
  }, [fetchReports, fetchDashboard])

  return {
    reports,
    dashboard,
    isLoading,
    error,
    fetchReports,
    fetchDashboard,
    createReport,
    generateReport,
    downloadReport,
    shareReport,
    scheduleReport,
    duplicateReport,
    reviewReport,
    publishReport,
    deleteReport,
    generateCustomDashboard,
    generateAnalytics,
    exportData,
    getReportById,
    getReportsByType,
    getReportsByCategory,
    getScheduledReports,
    getPublicReports,
    getRecentReports,
    getMostDownloadedReports,
    getReportsByFrequency,
    getPendingReviews,
    getCriticalAlerts,
    getPerformanceTrends,
    getComplianceStatus
  }
}