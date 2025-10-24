import { useState, useEffect, useCallback } from 'react'
import { apiClient } from '@/lib/api'

export interface Report {
  id: string
  name: string
  description?: string
  type: 'OPERATIONAL' | 'MANAGERIAL' | 'EXECUTIVE' | 'CUSTOM'
  category: string
  config: any
  template?: string
  schedule?: any
  accessLevel: number
  departments: string[]
  isActive: boolean
  isPublic: boolean
  createdBy: string
  lastRun?: string
  createdAt: string
  updatedAt: string
  lastExecution?: ReportExecution
}

export interface ReportExecution {
  id: string
  reportId: string
  parameters?: any
  filters?: any
  data?: any
  format: 'PDF' | 'EXCEL' | 'CSV' | 'JSON'
  fileUrl?: string
  fileSize?: number
  status: 'PENDING' | 'GENERATING' | 'COMPLETED' | 'FAILED' | 'CANCELLED'
  startedAt: string
  completedAt?: string
  errorMessage?: string
  executedBy?: string
  expiresAt?: string
  downloadCount: number
}

export interface CreateReportData {
  name: string
  description?: string
  type: 'OPERATIONAL' | 'MANAGERIAL' | 'EXECUTIVE' | 'CUSTOM'
  category: string
  config: any
  schedule?: any
  accessLevel: number
}

export interface ExecuteReportParams {
  format?: 'PDF' | 'EXCEL' | 'CSV' | 'JSON'
  parameters?: any
  filters?: any
}

export const useReports = () => {
  const [reports, setReports] = useState<Report[]>([])
  const [executions, setExecutions] = useState<ReportExecution[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch relatórios disponíveis
  const fetchReports = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.get('/reports')
      setReports(response.data.data)
    } catch (err: any) {
      setError('Falha ao carregar relatórios')
      console.error('Error fetching reports:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  // Executar relatório
  const executeReport = useCallback(async (reportId: string, params: ExecuteReportParams = {}): Promise<{ executionId: string, status: string } | null> => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.post(`/reports/${reportId}/execute`, params)
      return response.data.data
    } catch (err: any) {
      setError('Falha ao executar relatório')
      console.error('Error executing report:', err)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  // Download de relatório
  const downloadReport = useCallback(async (reportId: string, executionId: string) => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.get(`/reports/${reportId}/download/${executionId}`, {
        responseType: 'blob'
      })

      // Se for JSON, retornar dados diretamente
      if (response.headers['content-type']?.includes('application/json')) {
        return response.data
      }

      // Se for arquivo, fazer download
      const blob = new Blob([response.data])
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url

      // Extrair nome do arquivo do header ou usar padrão
      const filename = response.headers['content-disposition']?.split('filename=')[1] || `report-${executionId}.pdf`
      link.download = filename.replace(/"/g, '')

      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)

      return true
    } catch (err: any) {
      setError('Falha ao baixar relatório')
      console.error('Error downloading report:', err)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  // Criar relatório customizado
  const createCustomReport = useCallback(async (data: CreateReportData): Promise<Report | null> => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.post('/reports/custom', data)
      const newReport = response.data.data
      setReports(prev => [...prev, newReport])
      return newReport
    } catch (err: any) {
      setError('Falha ao criar relatório')
      console.error('Error creating report:', err)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  // Buscar status de execução
  const checkExecutionStatus = useCallback(async (reportId: string, executionId: string): Promise<ReportExecution | null> => {
    try {
      const response = await apiClient.get(`/reports/${reportId}/executions/${executionId}`)
      return response.data.data
    } catch (err: any) {
      console.error('Error checking execution status:', err)
      return null
    }
  }, [])

  // Filtrar relatórios por tipo
  const getReportsByType = useCallback((type: Report['type']) => {
    return reports.filter(report => report.type === type)
  }, [reports])

  // Filtrar relatórios por categoria
  const getReportsByCategory = useCallback((category: string) => {
    return reports.filter(report => report.category === category)
  }, [reports])

  // Relatórios executados recentemente
  const getRecentExecutions = useCallback(() => {
    return reports
      .filter(report => report.lastExecution)
      .sort((a, b) => new Date(b.lastExecution!.startedAt).getTime() - new Date(a.lastExecution!.startedAt).getTime())
      .slice(0, 10)
  }, [reports])

  // Relatórios mais populares
  const getPopularReports = useCallback(() => {
    return reports
      .filter(report => report.lastExecution)
      .sort((a, b) => (b.lastExecution?.downloadCount || 0) - (a.lastExecution?.downloadCount || 0))
      .slice(0, 5)
  }, [reports])

  // Templates de relatório predefinidos
  const getReportTemplates = useCallback(() => {
    return [
      {
        name: 'Relatório de Gestão Executiva',
        type: 'EXECUTIVE' as const,
        category: 'management',
        description: 'KPIs executivos e indicadores municipais',
        config: {
          metrics: ['total_protocols', 'satisfaction_score', 'resolution_time'],
          charts: ['line', 'bar', 'pie'],
          period: 'monthly'
        }
      },
      {
        name: 'Relatório Operacional Diário',
        type: 'OPERATIONAL' as const,
        category: 'operations',
        description: 'Métricas diárias de atendimento e protocolos',
        config: {
          metrics: ['daily_protocols', 'pending_protocols', 'completed_protocols'],
          charts: ['bar', 'gauge'],
          period: 'daily'
        }
      },
      {
        name: 'Análise de Satisfação',
        type: 'MANAGERIAL' as const,
        category: 'quality',
        description: 'Análise detalhada da satisfação dos cidadãos',
        config: {
          metrics: ['satisfaction_by_service', 'nps_score', 'complaints'],
          charts: ['line', 'heatmap'],
          period: 'weekly'
        }
      },
      {
        name: 'Performance Departamental',
        type: 'MANAGERIAL' as const,
        category: 'performance',
        description: 'Comparativo de performance entre departamentos',
        config: {
          metrics: ['efficiency_by_department', 'workload_distribution'],
          charts: ['bar', 'radar'],
          period: 'monthly'
        }
      }
    ]
  }, [])

  // Inicializar dados
  useEffect(() => {
    fetchReports()
  }, [fetchReports])

  return {
    // Estados
    reports,
    executions,
    loading,
    error,

    // Ações
    fetchReports,
    executeReport,
    downloadReport,
    createCustomReport,
    checkExecutionStatus,

    // Helpers
    getReportsByType,
    getReportsByCategory,
    getRecentExecutions,
    getPopularReports,
    getReportTemplates
  }
}