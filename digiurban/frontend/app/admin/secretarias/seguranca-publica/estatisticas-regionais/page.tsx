'use client'

import { useState } from 'react'
import { useAdminAuth } from '@/contexts/AdminAuthContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts'
import {
  BarChart3,
  Search,
  Filter,
  Download,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Shield,
  MapPin,
  Calendar,
  Users,
  Clock,
  Eye,
  Activity,
  Zap
} from 'lucide-react'

interface EstatisticaRegional {
  regiao: string
  bairros: string[]
  populacao: number
  area: number
  periodo: {
    inicio: string
    fim: string
  }
  criminalidade: {
    total: number
    tendencia: 'Aumentando' | 'Estável' | 'Diminuindo'
    porTipo: Array<{
      tipo: string
      quantidade: number
      percentual: number
      cor: string
    }>
    evolucaoMensal: Array<{
      mes: string
      quantidade: number
    }>
  }
  seguranca: {
    efetivo: number
    viaturas: number
    cameras: number
    iluminacao: number
    cobertura: number
  }
  indicadores: {
    indiceSeguranca: number
    satisfacaoPopulacao: number
    tempoResposta: number
    resolucaoOcorrencias: number
  }
  pontosCriticos: number
  operacoes: {
    realizadas: number
    preventivas: number
    repressivas: number
  }
  comparativo: {
    regiao: string
    diferencaPercentual: number
    melhorOuPior: 'melhor' | 'pior'
  }
}

const mockEstatisticas: EstatisticaRegional[] = [
  {
    regiao: 'Centro',
    bairros: ['Centro', 'Centro Histórico', 'Vila Central'],
    populacao: 25000,
    area: 15.5,
    periodo: {
      inicio: '2024-01-01',
      fim: '2024-01-31'
    },
    criminalidade: {
      total: 45,
      tendencia: 'Diminuindo',
      porTipo: [
        { tipo: 'Furto', quantidade: 18, percentual: 40, cor: '#8884d8' },
        { tipo: 'Roubo', quantidade: 12, percentual: 27, cor: '#82ca9d' },
        { tipo: 'Perturbação', quantidade: 8, percentual: 18, cor: '#ffc658' },
        { tipo: 'Vandalismo', quantidade: 4, percentual: 9, cor: '#ff7300' },
        { tipo: 'Outros', quantidade: 3, percentual: 6, cor: '#8dd1e1' }
      ],
      evolucaoMensal: [
        { mes: 'Set', quantidade: 52 },
        { mes: 'Out', quantidade: 48 },
        { mes: 'Nov', quantidade: 51 },
        { mes: 'Dez', quantidade: 47 },
        { mes: 'Jan', quantidade: 45 }
      ]
    },
    seguranca: {
      efetivo: 15,
      viaturas: 4,
      cameras: 24,
      iluminacao: 85,
      cobertura: 92
    },
    indicadores: {
      indiceSeguranca: 8.2,
      satisfacaoPopulacao: 78,
      tempoResposta: 12,
      resolucaoOcorrencias: 85
    },
    pontosCriticos: 3,
    operacoes: {
      realizadas: 8,
      preventivas: 5,
      repressivas: 3
    },
    comparativo: {
      regiao: 'Vila Nova',
      diferencaPercentual: 15,
      melhorOuPior: 'melhor'
    }
  },
  {
    regiao: 'Vila Nova',
    bairros: ['Vila Nova', 'Jardim Esperança', 'Vila São José'],
    populacao: 18500,
    area: 22.3,
    periodo: {
      inicio: '2024-01-01',
      fim: '2024-01-31'
    },
    criminalidade: {
      total: 63,
      tendencia: 'Estável',
      porTipo: [
        { tipo: 'Furto', quantidade: 25, percentual: 40, cor: '#8884d8' },
        { tipo: 'Roubo', quantidade: 20, percentual: 32, cor: '#82ca9d' },
        { tipo: 'Tráfico', quantidade: 8, percentual: 13, cor: '#ffc658' },
        { tipo: 'Perturbação', quantidade: 6, percentual: 9, cor: '#ff7300' },
        { tipo: 'Outros', quantidade: 4, percentual: 6, cor: '#8dd1e1' }
      ],
      evolucaoMensal: [
        { mes: 'Set', quantidade: 59 },
        { mes: 'Out', quantidade: 61 },
        { mes: 'Nov', quantidade: 65 },
        { mes: 'Dez', quantidade: 62 },
        { mes: 'Jan', quantidade: 63 }
      ]
    },
    seguranca: {
      efetivo: 12,
      viaturas: 3,
      cameras: 18,
      iluminacao: 68,
      cobertura: 75
    },
    indicadores: {
      indiceSeguranca: 6.8,
      satisfacaoPopulacao: 65,
      tempoResposta: 18,
      resolucaoOcorrencias: 72
    },
    pontosCriticos: 5,
    operacoes: {
      realizadas: 12,
      preventivas: 7,
      repressivas: 5
    },
    comparativo: {
      regiao: 'Centro',
      diferencaPercentual: 15,
      melhorOuPior: 'pior'
    }
  }
]

const dadosComparativos = [
  { regiao: 'Centro', ocorrencias: 45, indice: 8.2, populacao: 25000 },
  { regiao: 'Vila Nova', ocorrencias: 63, indice: 6.8, populacao: 18500 },
  { regiao: 'Industrial', ocorrencias: 32, indice: 7.5, populacao: 12000 },
  { regiao: 'Residencial', ocorrencias: 28, indice: 8.5, populacao: 22000 },
  { regiao: 'Rural', ocorrencias: 15, indice: 9.1, populacao: 8500 }
]

export default function EstatisticasRegionaisPage() {
  const { user } = useAdminAuth()
  const [estatisticas, setEstatisticas] = useState<EstatisticaRegional[]>(mockEstatisticas)
  const [selectedRegiao, setSelectedRegiao] = useState<string>('all')
  const [selectedPeriodo, setSelectedPeriodo] = useState<string>('mensal')
  const [selectedMetrica, setSelectedMetrica] = useState<string>('criminalidade')

  const filteredEstatisticas = selectedRegiao === 'all'
    ? estatisticas
    : estatisticas.filter(est => est.regiao === selectedRegiao)

  const getTendenciaIcon = (tendencia: string) => {
    switch (tendencia) {
      case 'Aumentando': return <TrendingUp className="h-4 w-4 text-red-600" />
      case 'Diminuindo': return <TrendingDown className="h-4 w-4 text-green-600" />
      case 'Estável': return <Activity className="h-4 w-4 text-yellow-600" />
      default: return <Activity className="h-4 w-4 text-gray-600" />
    }
  }

  const getTendenciaColor = (tendencia: string) => {
    switch (tendencia) {
      case 'Aumentando': return 'text-red-600'
      case 'Diminuindo': return 'text-green-600'
      case 'Estável': return 'text-yellow-600'
      default: return 'text-gray-600'
    }
  }

  const stats = {
    totalOcorrencias: estatisticas.reduce((acc, est) => acc + est.criminalidade.total, 0),
    mediaTempo: estatisticas.reduce((acc, est) => acc + est.indicadores.tempoResposta, 0) / estatisticas.length,
    totalPontosCriticos: estatisticas.reduce((acc, est) => acc + est.pontosCriticos, 0),
    mediaIndiceSeguranca: estatisticas.reduce((acc, est) => acc + est.indicadores.indiceSeguranca, 0) / estatisticas.length
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <BarChart3 className="h-8 w-8 text-blue-600" />
            Estatísticas Regionais
          </h1>
          <p className="text-gray-600 mt-1">
            Indicadores de segurança territorializados por região do município
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedPeriodo} onValueChange={setSelectedPeriodo}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="semanal">Semanal</SelectItem>
              <SelectItem value="mensal">Mensal</SelectItem>
              <SelectItem value="trimestral">Trimestral</SelectItem>
              <SelectItem value="anual">Anual</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Ocorrências</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOcorrencias}</div>
            <p className="text-xs text-muted-foreground">todas as regiões</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tempo Médio de Resposta</CardTitle>
            <Clock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.mediaTempo.toFixed(1)} min</div>
            <p className="text-xs text-muted-foreground">média municipal</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pontos Críticos</CardTitle>
            <MapPin className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.totalPontosCriticos}</div>
            <p className="text-xs text-muted-foreground">monitorados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Índice de Segurança</CardTitle>
            <Shield className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.mediaIndiceSeguranca.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">média (0-10)</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filtros e Configurações</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <Select value={selectedRegiao} onValueChange={setSelectedRegiao}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Região" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as Regiões</SelectItem>
                <SelectItem value="Centro">Centro</SelectItem>
                <SelectItem value="Vila Nova">Vila Nova</SelectItem>
                <SelectItem value="Industrial">Industrial</SelectItem>
                <SelectItem value="Residencial">Residencial</SelectItem>
                <SelectItem value="Rural">Rural</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedMetrica} onValueChange={setSelectedMetrica}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Métrica" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="criminalidade">Criminalidade</SelectItem>
                <SelectItem value="seguranca">Recursos de Segurança</SelectItem>
                <SelectItem value="indicadores">Indicadores</SelectItem>
                <SelectItem value="operacoes">Operações</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Ocorrências por Região
            </CardTitle>
            <CardDescription>Comparativo de criminalidade entre regiões</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dadosComparativos}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="regiao" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="ocorrencias" fill="#8884d8" name="Ocorrências" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Índice de Segurança
            </CardTitle>
            <CardDescription>Indicador de segurança por região (0-10)</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={dadosComparativos}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="regiao" />
                <YAxis domain={[0, 10]} />
                <Tooltip />
                <Area type="monotone" dataKey="indice" stroke="#82ca9d" fill="#82ca9d" name="Índice" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6">
        {filteredEstatisticas.map((estatistica) => (
          <Card key={estatistica.regiao} className="overflow-hidden">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{estatistica.regiao}</CardTitle>
                  <CardDescription className="flex items-center gap-2 mt-1">
                    <MapPin className="h-4 w-4" />
                    {estatistica.bairros.join(', ')}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  {getTendenciaIcon(estatistica.criminalidade.tendencia)}
                  <span className={`text-sm font-medium ${getTendenciaColor(estatistica.criminalidade.tendencia)}`}>
                    {estatistica.criminalidade.tendencia}
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-sm text-gray-900 mb-2 flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Demografia
                    </h4>
                    <div className="space-y-1 text-sm text-gray-600">
                      <div className="flex justify-between">
                        <span>População:</span>
                        <span className="font-bold">{estatistica.populacao.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Área:</span>
                        <span className="font-bold">{estatistica.area} km²</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Densidade:</span>
                        <span className="font-bold">{Math.round(estatistica.populacao / estatistica.area)}/km²</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-sm text-gray-900 mb-2 flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4" />
                      Criminalidade
                    </h4>
                    <div className="space-y-1 text-sm text-gray-600">
                      <div className="flex justify-between">
                        <span>Total:</span>
                        <span className="font-bold">{estatistica.criminalidade.total}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tendência:</span>
                        <span className={`font-bold ${getTendenciaColor(estatistica.criminalidade.tendencia)}`}>
                          {estatistica.criminalidade.tendencia}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Pontos Críticos:</span>
                        <span className="font-bold">{estatistica.pontosCriticos}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-sm text-gray-900 mb-2 flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      Recursos de Segurança
                    </h4>
                    <div className="space-y-1 text-sm text-gray-600">
                      <div className="flex justify-between">
                        <span>Efetivo:</span>
                        <span className="font-bold">{estatistica.seguranca.efetivo} agentes</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Viaturas:</span>
                        <span className="font-bold">{estatistica.seguranca.viaturas}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Câmeras:</span>
                        <span className="font-bold">{estatistica.seguranca.cameras}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Iluminação:</span>
                        <span className="font-bold">{estatistica.seguranca.iluminacao}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Cobertura:</span>
                        <span className="font-bold">{estatistica.seguranca.cobertura}%</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-sm text-gray-900 mb-2 flex items-center gap-2">
                      <BarChart3 className="h-4 w-4" />
                      Indicadores
                    </h4>
                    <div className="space-y-1 text-sm text-gray-600">
                      <div className="flex justify-between">
                        <span>Índice Segurança:</span>
                        <span className="font-bold text-green-600">{estatistica.indicadores.indiceSeguranca}/10</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Satisfação:</span>
                        <span className="font-bold">{estatistica.indicadores.satisfacaoPopulacao}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tempo Resposta:</span>
                        <span className="font-bold">{estatistica.indicadores.tempoResposta} min</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Resolução:</span>
                        <span className="font-bold">{estatistica.indicadores.resolucaoOcorrencias}%</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-sm text-gray-900 mb-2 flex items-center gap-2">
                      <Activity className="h-4 w-4" />
                      Operações
                    </h4>
                    <div className="space-y-1 text-sm text-gray-600">
                      <div className="flex justify-between">
                        <span>Total:</span>
                        <span className="font-bold">{estatistica.operacoes.realizadas}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Preventivas:</span>
                        <span className="font-bold">{estatistica.operacoes.preventivas}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Repressivas:</span>
                        <span className="font-bold">{estatistica.operacoes.repressivas}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-sm text-gray-900 mb-2">
                      Comparativo
                    </h4>
                    <div className="text-sm text-gray-600">
                      <p className="flex items-center gap-1">
                        {estatistica.comparativo.melhorOuPior === 'melhor' ? (
                          <TrendingUp className="h-3 w-3 text-green-600" />
                        ) : (
                          <TrendingDown className="h-3 w-3 text-red-600" />
                        )}
                        <span className={estatistica.comparativo.melhorOuPior === 'melhor' ? 'text-green-600' : 'text-red-600'}>
                          {estatistica.comparativo.diferencaPercentual}%
                        </span>
                        {estatistica.comparativo.melhorOuPior} que {estatistica.comparativo.regiao}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-sm text-gray-900 mb-2">Tipos de Crime</h4>
                    <ResponsiveContainer width="100%" height={200}>
                      <PieChart>
                        <Pie
                          data={estatistica.criminalidade.porTipo}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ tipo, percentual }) => `${tipo}: ${percentual}%`}
                          outerRadius={60}
                          fill="#8884d8"
                          dataKey="quantidade"
                        >
                          {estatistica.criminalidade.porTipo.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.cor} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  <div>
                    <h4 className="font-medium text-sm text-gray-900 mb-2">Evolução Mensal</h4>
                    <ResponsiveContainer width="100%" height={200}>
                      <LineChart data={estatistica.criminalidade.evolucaoMensal}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="mes" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="quantidade" stroke="#8884d8" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-4 pt-4 border-t">
                <Button variant="outline" size="sm">
                  <MapPin className="h-4 w-4 mr-1" />
                  Ver no Mapa
                </Button>
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-1" />
                  Detalhes
                </Button>
                <Button size="sm">
                  <Download className="h-4 w-4 mr-1" />
                  Relatório
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-blue-600" />
            Serviços Gerados Automaticamente
          </CardTitle>
          <CardDescription>
            Esta página gera automaticamente os seguintes serviços para o catálogo público:
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium text-green-700 mb-2">Relatório de Criminalidade</h4>
              <p className="text-sm text-gray-600">
                Acesso a estatísticas de criminalidade por região, incluindo tipos de crime e tendências mensais.
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium text-green-700 mb-2">Índices de Segurança</h4>
              <p className="text-sm text-gray-600">
                Consulta de indicadores de segurança pública por bairro e região do município.
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium text-green-700 mb-2">Estatísticas do Bairro</h4>
              <p className="text-sm text-gray-600">
                Informações detalhadas sobre segurança, criminalidade e recursos de segurança por bairro.
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium text-green-700 mb-2">Comparativo Regional</h4>
              <p className="text-sm text-gray-600">
                Análise comparativa de segurança entre diferentes regiões do município.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}