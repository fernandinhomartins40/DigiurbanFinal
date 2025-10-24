import { useState, useEffect, useCallback } from 'react'
import { apiClient } from '@/lib/api'

export interface Benchmark {
  id: string
  metric: string
  category: string
  region: string
  population: string
  p25?: number
  p50?: number
  p75?: number
  average?: number
  sampleSize: number
  period: string
  year: number
  source?: string
  updatedAt: string
}

export interface BenchmarkComparison {
  position: 'excellent' | 'good' | 'average' | 'below_average' | 'poor'
  percentile: number
  comparison: {
    p25?: number
    p50?: number
    p75?: number
    average?: number
  }
}

export interface BenchmarkData {
  benchmarks: Benchmark[]
  tenantValue?: number
  comparison?: BenchmarkComparison
}

export const useBenchmarks = () => {
  const [benchmarks, setBenchmarks] = useState<Benchmark[]>([])
  const [comparisons, setComparisons] = useState<Record<string, BenchmarkData>>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch benchmarks
  const fetchBenchmarks = useCallback(async (filters?: {
    metric?: string
    category?: string
    region?: string
    population?: string
  }) => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.get('/analytics/benchmark', { params: filters })
      const data = response.data.data
      setBenchmarks(data.benchmarks)
      return data
    } catch (err: any) {
      setError('Falha ao carregar benchmarks')
      console.error('Error fetching benchmarks:', err)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  // Comparar com benchmark específico
  const compareWithBenchmark = useCallback(async (metric: string, tenantValue: number, filters?: {
    category?: string
    region?: string
    population?: string
  }): Promise<BenchmarkComparison | null> => {
    try {
      const response = await apiClient.get('/analytics/benchmark', {
        params: { metric, ...filters }
      })
      const data = response.data.data

      if (data.comparison) {
        setComparisons(prev => ({
          ...prev,
          [metric]: data
        }))
        return data.comparison
      }

      return null
    } catch (err: any) {
      console.error('Error comparing with benchmark:', err)
      return null
    }
  }, [])

  // Buscar métricas de ranking
  const fetchRankings = useCallback(async (metric: string) => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.get('/analytics/ranking', {
        params: { metric }
      })
      return response.data.data
    } catch (err: any) {
      setError('Falha ao carregar rankings')
      console.error('Error fetching rankings:', err)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  // Análise comparativa temporal
  const fetchComparison = useCallback(async (params: {
    metric: string
    startPeriod: string
    endPeriod: string
    compareType: 'period' | 'benchmark'
  }) => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.get('/analytics/comparison', {
        params
      })
      return response.data.data
    } catch (err: any) {
      setError('Falha ao carregar comparação')
      console.error('Error fetching comparison:', err)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  // Helpers para interpretação de benchmarks
  const getBenchmarkStatus = useCallback((value: number, benchmark: Benchmark): {
    status: 'excellent' | 'good' | 'average' | 'below_average' | 'poor'
    percentile: number
    message: string
  } => {
    let status: 'excellent' | 'good' | 'average' | 'below_average' | 'poor' = 'average'
    let percentile = 50
    let message = 'Performance na média'

    if (benchmark.p75 && value >= benchmark.p75) {
      status = 'excellent'
      percentile = 75
      message = 'Performance excelente - acima de 75% dos municípios'
    } else if (benchmark.p50 && value >= benchmark.p50) {
      status = 'good'
      percentile = 60
      message = 'Performance boa - acima da mediana'
    } else if (benchmark.p25 && value >= benchmark.p25) {
      status = 'average'
      percentile = 40
      message = 'Performance na média'
    } else {
      status = benchmark.p25 ? 'below_average' : 'poor'
      percentile = 25
      message = 'Performance abaixo da média - necessita atenção'
    }

    return { status, percentile, message }
  }, [])

  const getImprovementSuggestions = useCallback((metric: string, currentStatus: string): string[] => {
    const suggestions: Record<string, string[]> = {
      'resolution_time': [
        'Implementar automação de processos',
        'Melhorar treinamento da equipe',
        'Revisar fluxos de trabalho',
        'Aumentar recursos em gargalos identificados'
      ],
      'satisfaction_score': [
        'Melhorar comunicação com cidadãos',
        'Reduzir tempo de espera',
        'Implementar feedback contínuo',
        'Capacitar atendentes em soft skills'
      ],
      'completion_rate': [
        'Identificar causas de protocolos não concluídos',
        'Implementar lembretes automáticos',
        'Melhorar processo de follow-up',
        'Revisar prazos estabelecidos'
      ]
    }

    return suggestions[metric] || [
      'Analisar melhores práticas de outros municípios',
      'Implementar monitoramento contínuo',
      'Buscar capacitação específica',
      'Estabelecer metas incrementais'
    ]
  }, [])

  // Métricas padrão para benchmark
  const getStandardMetrics = useCallback(() => {
    return [
      {
        metric: 'resolution_time',
        name: 'Tempo Médio de Resolução',
        unit: 'horas',
        category: 'efficiency'
      },
      {
        metric: 'satisfaction_score',
        name: 'Satisfação dos Cidadãos',
        unit: 'pontos',
        category: 'quality'
      },
      {
        metric: 'completion_rate',
        name: 'Taxa de Conclusão',
        unit: '%',
        category: 'efficiency'
      },
      {
        metric: 'first_response_time',
        name: 'Tempo de Primeira Resposta',
        unit: 'horas',
        category: 'responsiveness'
      },
      {
        metric: 'cost_per_protocol',
        name: 'Custo por Protocolo',
        unit: 'R$',
        category: 'financial'
      }
    ]
  }, [])

  // Categorias de população para benchmark
  const getPopulationCategories = useCallback(() => {
    return [
      { value: 'small', label: 'Até 20.000 hab', range: '0-20k' },
      { value: 'medium', label: '20.000 - 100.000 hab', range: '20k-100k' },
      { value: 'large', label: '100.000 - 500.000 hab', range: '100k-500k' },
      { value: 'metropolitan', label: 'Acima de 500.000 hab', range: '500k+' }
    ]
  }, [])

  // Regiões disponíveis
  const getRegions = useCallback(() => {
    return [
      { value: 'norte', label: 'Norte' },
      { value: 'nordeste', label: 'Nordeste' },
      { value: 'centro-oeste', label: 'Centro-Oeste' },
      { value: 'sudeste', label: 'Sudeste' },
      { value: 'sul', label: 'Sul' }
    ]
  }, [])

  return {
    // Estados
    benchmarks,
    comparisons,
    loading,
    error,

    // Ações
    fetchBenchmarks,
    compareWithBenchmark,
    fetchRankings,
    fetchComparison,

    // Helpers
    getBenchmarkStatus,
    getImprovementSuggestions,
    getStandardMetrics,
    getPopulationCategories,
    getRegions
  }
}