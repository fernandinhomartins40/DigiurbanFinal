'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Calendar } from "@/components/ui/calendar"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area, RadialBarChart, RadialBar } from 'recharts'
import { useAdminAuth } from '@/hooks/useAdminAuth'
import { TreePine, Droplets, Wind, Recycle, Sun, Leaf, TrendingUp, AlertTriangle, CheckCircle, Activity, Eye, Download, Filter, Search, BarChart3, PieChart as PieChartIcon, MapPin, Target, Award, Thermometer } from 'lucide-react'

interface IndicadorAmbiental {
  id: string
  nome: string
  valor: number
  unidade: string
  meta: number
  variacao: number
  status: 'critico' | 'atencao' | 'bom' | 'excelente'
  categoria: 'ar' | 'agua' | 'solo' | 'biodiversidade' | 'residuos' | 'energia' | 'clima'
  icone: any
  cor: string
  descricao: string
  periodo_medicao: string
  ultima_atualizacao: string
}

interface ImpactoAmbiental {
  id: string
  programa: string
  tipo: 'positivo' | 'negativo'
  categoria: 'co2' | 'agua' | 'energia' | 'residuos' | 'biodiversidade'
  valor: number
  unidade: string
  periodo: string
  descricao: string
}

interface QualidadeAmbiental {
  id: string
  area: string
  qualidade_ar: number
  qualidade_agua: number
  cobertura_verde: number
  gestao_residuos: number
  energia_renovavel: number
  score_geral: number
  classificacao: 'critica' | 'baixa' | 'media' | 'boa' | 'excelente'
}

interface ServicoGerado {
  id: string
  nome: string
  descricao: string
  tipo: 'relatorio_ambiental' | 'pegada_ecologica' | 'indicadores_verdes_familia'
  categoria: 'relatorio' | 'analise' | 'indicadores'
  protocolo_base: string
  automatico: boolean
  ativo: boolean
}

export default function DashboardMeioAmbiente() {
  const { user } = useAdminAuth()
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [filtroCategoria, setFiltroCategoria] = useState<string>('todos')
  const [filtroStatus, setFiltroStatus] = useState<string>('todos')
  const [buscaIndicador, setBuscaIndicador] = useState('')

  const indicadores: IndicadorAmbiental[] = [
    {
      id: '1',
      nome: 'Qualidade do Ar (IQA)',
      valor: 82,
      unidade: 'índice',
      meta: 80,
      variacao: 5,
      status: 'bom',
      categoria: 'ar',
      icone: Wind,
      cor: 'text-blue-600',
      descricao: 'Índice de qualidade do ar baseado em MP2.5, MP10, O3, NO2, SO2',
      periodo_medicao: 'Mensal',
      ultima_atualizacao: '2024-01-20'
    },
    {
      id: '2',
      nome: 'Qualidade da Água',
      valor: 78,
      unidade: 'IQA',
      meta: 75,
      variacao: 8,
      status: 'bom',
      categoria: 'agua',
      icone: Droplets,
      cor: 'text-cyan-600',
      descricao: 'Índice de qualidade das águas superficiais',
      periodo_medicao: 'Mensal',
      ultima_atualizacao: '2024-01-18'
    },
    {
      id: '3',
      nome: 'Cobertura Arbórea',
      valor: 32.5,
      unidade: '%',
      meta: 35,
      variacao: 2,
      status: 'atencao',
      categoria: 'biodiversidade',
      icone: TreePine,
      cor: 'text-green-600',
      descricao: 'Percentual de cobertura arbórea da área urbana',
      periodo_medicao: 'Anual',
      ultima_atualizacao: '2024-01-15'
    },
    {
      id: '4',
      nome: 'Reciclagem de Resíduos',
      valor: 68,
      unidade: '%',
      meta: 70,
      variacao: 12,
      status: 'atencao',
      categoria: 'residuos',
      icone: Recycle,
      cor: 'text-purple-600',
      descricao: 'Percentual de resíduos sólidos reciclados',
      periodo_medicao: 'Mensal',
      ultima_atualizacao: '2024-01-22'
    },
    {
      id: '5',
      nome: 'Energia Renovável',
      valor: 15.8,
      unidade: '%',
      meta: 20,
      variacao: 25,
      status: 'bom',
      categoria: 'energia',
      icone: Sun,
      cor: 'text-yellow-600',
      descricao: 'Participação de fontes renováveis na matriz energética municipal',
      periodo_medicao: 'Mensal',
      ultima_atualizacao: '2024-01-20'
    },
    {
      id: '6',
      nome: 'Emissões de CO₂',
      valor: 2.8,
      unidade: 'ton/hab/ano',
      meta: 3.0,
      variacao: -8,
      status: 'bom',
      categoria: 'clima',
      icone: Thermometer,
      cor: 'text-red-600',
      descricao: 'Emissões per capita de gases de efeito estufa',
      periodo_medicao: 'Anual',
      ultima_atualizacao: '2024-01-10'
    }
  ]

  const impactosAmbientais: ImpactoAmbiental[] = [
    {
      id: '1',
      programa: 'Programa de Reciclagem',
      tipo: 'positivo',
      categoria: 'co2',
      valor: 45,
      unidade: 'ton CO₂ evitadas',
      periodo: 'Últimos 12 meses',
      descricao: 'Redução de emissões através da reciclagem'
    },
    {
      id: '2',
      programa: 'Reflorestamento Urbano',
      tipo: 'positivo',
      categoria: 'biodiversidade',
      valor: 3200,
      unidade: 'árvores plantadas',
      periodo: 'Últimos 12 meses',
      descricao: 'Aumento da cobertura arbórea urbana'
    },
    {
      id: '3',
      programa: 'Energia Solar Residencial',
      tipo: 'positivo',
      categoria: 'energia',
      valor: 168,
      unidade: 'MWh gerados',
      periodo: 'Últimos 12 meses',
      descricao: 'Energia renovável gerada por painéis solares'
    }
  ]

  const qualidadeAmbiental: QualidadeAmbiental[] = [
    {
      id: '1',
      area: 'Centro',
      qualidade_ar: 85,
      qualidade_agua: 80,
      cobertura_verde: 25,
      gestao_residuos: 75,
      energia_renovavel: 18,
      score_geral: 77,
      classificacao: 'boa'
    },
    {
      id: '2',
      area: 'Vila Verde',
      qualidade_ar: 90,
      qualidade_agua: 85,
      cobertura_verde: 45,
      gestao_residuos: 80,
      energia_renovavel: 22,
      score_geral: 84,
      classificacao: 'excelente'
    },
    {
      id: '3',
      area: 'Distrito Industrial',
      qualidade_ar: 65,
      qualidade_agua: 70,
      cobertura_verde: 15,
      gestao_residuos: 65,
      energia_renovavel: 8,
      score_geral: 65,
      classificacao: 'media'
    }
  ]

  const servicosGerados: ServicoGerado[] = [
    {
      id: '1',
      nome: 'Relatório Ambiental',
      descricao: 'Relatório consolidado da situação ambiental municipal',
      tipo: 'relatorio_ambiental',
      categoria: 'relatorio',
      protocolo_base: 'Solicitação → Análise → Geração → Orientação',
      automatico: true,
      ativo: true
    },
    {
      id: '2',
      nome: 'Pegada Ecológica',
      descricao: 'Cálculo da pegada ecológica individual ou familiar',
      tipo: 'pegada_ecologica',
      categoria: 'analise',
      protocolo_base: 'Solicitação → Análise → Geração → Orientação',
      automatico: true,
      ativo: true
    },
    {
      id: '3',
      nome: 'Indicadores Verdes da Família',
      descricao: 'Indicadores ambientais personalizados por família',
      tipo: 'indicadores_verdes_familia',
      categoria: 'indicadores',
      protocolo_base: 'Solicitação → Análise → Geração → Orientação',
      automatico: true,
      ativo: true
    }
  ]

  const dadosEvolucaoAmbiental = [
    { mes: 'Jul', qualidade_ar: 78, qualidade_agua: 75, cobertura_verde: 30, reciclagem: 55 },
    { mes: 'Ago', qualidade_ar: 80, qualidade_agua: 76, cobertura_verde: 30.5, reciclagem: 58 },
    { mes: 'Set', qualidade_ar: 82, qualidade_agua: 77, cobertura_verde: 31, reciclagem: 62 },
    { mes: 'Out', qualidade_ar: 84, qualidade_agua: 78, cobertura_verde: 31.5, reciclagem: 65 },
    { mes: 'Nov', qualidade_ar: 83, qualidade_agua: 78, cobertura_verde: 32, reciclagem: 67 },
    { mes: 'Dez', qualidade_ar: 82, qualidade_agua: 78, cobertura_verde: 32.5, reciclagem: 68 }
  ]

  const dadosEmissoes = [
    { categoria: 'Transporte', emissoes: 35, cor: '#8884d8' },
    { categoria: 'Energia', emissoes: 25, cor: '#82ca9d' },
    { categoria: 'Indústria', emissoes: 20, cor: '#ffc658' },
    { categoria: 'Residencial', emissoes: 12, cor: '#ff7300' },
    { categoria: 'Agropecuária', emissoes: 8, cor: '#00C49F' }
  ]

  const dadosEnergiaRenovavel = [
    { fonte: 'Solar', capacidade: 45, participacao: 12 },
    { fonte: 'Eólica', capacidade: 25, participacao: 8 },
    { fonte: 'Biomassa', capacidade: 15, participacao: 4 },
    { fonte: 'Hidrelétrica', capacidade: 35, participacao: 10 }
  ]

  const dadosResiduos = [
    { tipo: 'Orgânicos', quantidade: 450, reciclagem: 65 },
    { tipo: 'Recicláveis', quantidade: 280, reciclagem: 85 },
    { tipo: 'Rejeitos', quantidade: 120, reciclagem: 5 },
    { tipo: 'Especiais', quantidade: 35, reciclagem: 90 }
  ]

  const getStatusBadge = (status: string) => {
    const variants = {
      'critico': 'bg-red-100 text-red-800',
      'atencao': 'bg-yellow-100 text-yellow-800',
      'bom': 'bg-green-100 text-green-800',
      'excelente': 'bg-blue-100 text-blue-800'
    }
    return variants[status as keyof typeof variants] || 'bg-gray-100 text-gray-800'
  }

  const getClassificacaoColor = (classificacao: string) => {
    const colors = {
      'critica': '#ef4444',
      'baixa': '#f97316',
      'media': '#eab308',
      'boa': '#22c55e',
      'excelente': '#3b82f6'
    }
    return colors[classificacao as keyof typeof colors] || '#6b7280'
  }

  const filtrarIndicadores = indicadores.filter(indicador => {
    const matchCategoria = filtroCategoria === 'todos' || indicador.categoria === filtroCategoria
    const matchStatus = filtroStatus === 'todos' || indicador.status === filtroStatus
    const matchBusca = buscaIndicador === '' ||
      indicador.nome.toLowerCase().includes(buscaIndicador.toLowerCase()) ||
      indicador.descricao.toLowerCase().includes(buscaIndicador.toLowerCase())

    return matchCategoria && matchStatus && matchBusca
  })

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Meio Ambiente</h1>
          <p className="text-gray-600 mt-1">Indicadores ambientais e de sustentabilidade municipal</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filtros
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        {indicadores.map((indicador) => (
          <Card key={indicador.id} className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{indicador.nome}</CardTitle>
              <indicador.icone className={`h-4 w-4 ${indicador.cor}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{indicador.valor}{indicador.unidade}</div>
              <div className="flex items-center justify-between mt-2">
                <Badge className={getStatusBadge(indicador.status)}>
                  {indicador.status}
                </Badge>
                <div className="flex items-center text-xs text-muted-foreground">
                  <TrendingUp className={`h-3 w-3 mr-1 ${indicador.variacao > 0 ? 'text-green-500' : 'text-red-500'}`} />
                  {indicador.variacao > 0 ? '+' : ''}{indicador.variacao}%
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-1">Meta: {indicador.meta}{indicador.unidade}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="indicadores">Indicadores</TabsTrigger>
          <TabsTrigger value="qualidade">Qualidade Ambiental</TabsTrigger>
          <TabsTrigger value="impactos">Impactos</TabsTrigger>
          <TabsTrigger value="servicos">Serviços Gerados</TabsTrigger>
          <TabsTrigger value="relatorios">Relatórios</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-blue-600" />
                  Evolução dos Indicadores Ambientais
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={dadosEvolucaoAmbiental}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mes" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="qualidade_ar" stroke="#8884d8" strokeWidth={2} name="Qualidade do Ar" />
                    <Line type="monotone" dataKey="qualidade_agua" stroke="#82ca9d" strokeWidth={2} name="Qualidade da Água" />
                    <Line type="monotone" dataKey="reciclagem" stroke="#ffc658" strokeWidth={2} name="Reciclagem" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChartIcon className="h-5 w-5 text-purple-600" />
                  Emissões de CO₂ por Setor
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={dadosEmissoes}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ categoria, emissoes }) => `${categoria}: ${emissoes}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="emissoes"
                    >
                      {dadosEmissoes.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.cor} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sun className="h-5 w-5 text-yellow-600" />
                  Matriz Energética Renovável
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={dadosEnergiaRenovavel}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="fonte" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="capacidade" name="Capacidade (MW)" fill="#82ca9d" />
                    <Bar dataKey="participacao" name="Participação (%)" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Recycle className="h-5 w-5 text-green-600" />
                  Gestão de Resíduos Sólidos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={dadosResiduos}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="tipo" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="quantidade" name="Quantidade (ton)" fill="#ffc658" />
                    <Bar dataKey="reciclagem" name="Taxa Reciclagem (%)" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Resumo dos Impactos Ambientais</CardTitle>
              <CardDescription>Principais resultados dos programas ambientais municipais</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {impactosAmbientais.map((impacto) => (
                  <div key={impacto.id} className="p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
                    <h4 className="font-medium text-green-900 mb-1">{impacto.programa}</h4>
                    <p className="text-2xl font-bold text-green-800">{impacto.valor} {impacto.unidade}</p>
                    <p className="text-sm text-green-700">{impacto.descricao}</p>
                    <p className="text-xs text-green-600 mt-1">{impacto.periodo}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="indicadores" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Indicadores Ambientais Detalhados</CardTitle>
                <div className="flex gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Buscar indicadores..."
                      value={buscaIndicador}
                      onChange={(e) => setBuscaIndicador(e.target.value)}
                      className="pl-10 w-64"
                    />
                  </div>
                  <Select value={filtroCategoria} onValueChange={setFiltroCategoria}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todas</SelectItem>
                      <SelectItem value="ar">Qualidade do Ar</SelectItem>
                      <SelectItem value="agua">Recursos Hídricos</SelectItem>
                      <SelectItem value="biodiversidade">Biodiversidade</SelectItem>
                      <SelectItem value="residuos">Resíduos</SelectItem>
                      <SelectItem value="energia">Energia</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={filtroStatus} onValueChange={setFiltroStatus}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos</SelectItem>
                      <SelectItem value="excelente">Excelente</SelectItem>
                      <SelectItem value="bom">Bom</SelectItem>
                      <SelectItem value="atencao">Atenção</SelectItem>
                      <SelectItem value="critico">Crítico</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filtrarIndicadores.map((indicador) => (
                  <Card key={indicador.id} className="border-l-4 border-l-green-500">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <indicador.icone className={`h-5 w-5 ${indicador.cor}`} />
                            <h3 className="font-medium text-lg">{indicador.nome}</h3>
                            <Badge className={getStatusBadge(indicador.status)}>
                              {indicador.status}
                            </Badge>
                          </div>
                          <p className="text-gray-600 mb-2">{indicador.descricao}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold">{indicador.valor}{indicador.unidade}</div>
                          <div className="flex items-center text-sm text-gray-500">
                            <TrendingUp className={`h-4 w-4 mr-1 ${indicador.variacao > 0 ? 'text-green-500' : 'text-red-500'}`} />
                            {indicador.variacao > 0 ? '+' : ''}{indicador.variacao}%
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                        <div>
                          <span className="text-gray-600">Meta:</span>
                          <p className="font-medium">{indicador.meta}{indicador.unidade}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Categoria:</span>
                          <p className="font-medium capitalize">{indicador.categoria.replace('_', ' ')}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Período:</span>
                          <p className="font-medium">{indicador.periodo_medicao}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Atualização:</span>
                          <p className="font-medium">{new Date(indicador.ultima_atualizacao).toLocaleDateString('pt-BR')}</p>
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <Badge variant="outline" className="capitalize">
                          {indicador.categoria.replace('_', ' ')}
                        </Badge>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-2" />
                            Detalhes
                          </Button>
                          <Button variant="outline" size="sm">
                            <Activity className="h-4 w-4 mr-2" />
                            Histórico
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="qualidade" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Qualidade Ambiental por Região</CardTitle>
              <CardDescription>Análise comparativa da qualidade ambiental nas diferentes áreas do município</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {qualidadeAmbiental.map((area) => (
                  <Card key={area.id} className="border-l-4 border-l-blue-500">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-medium text-lg">{area.area}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-2xl font-bold">{area.score_geral}</span>
                            <Badge
                              className="capitalize"
                              style={{
                                backgroundColor: `${getClassificacaoColor(area.classificacao)}20`,
                                color: getClassificacaoColor(area.classificacao),
                                borderColor: getClassificacaoColor(area.classificacao)
                              }}
                            >
                              {area.classificacao}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-gray-500" />
                          <span className="text-sm text-gray-500">Região Municipal</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-5 gap-4">
                        <div className="text-center">
                          <Wind className="h-6 w-6 text-blue-600 mx-auto mb-1" />
                          <p className="text-xs text-gray-600">Qualidade do Ar</p>
                          <p className="font-medium">{area.qualidade_ar}</p>
                        </div>
                        <div className="text-center">
                          <Droplets className="h-6 w-6 text-cyan-600 mx-auto mb-1" />
                          <p className="text-xs text-gray-600">Qualidade da Água</p>
                          <p className="font-medium">{area.qualidade_agua}</p>
                        </div>
                        <div className="text-center">
                          <TreePine className="h-6 w-6 text-green-600 mx-auto mb-1" />
                          <p className="text-xs text-gray-600">Cobertura Verde</p>
                          <p className="font-medium">{area.cobertura_verde}%</p>
                        </div>
                        <div className="text-center">
                          <Recycle className="h-6 w-6 text-purple-600 mx-auto mb-1" />
                          <p className="text-xs text-gray-600">Gestão Resíduos</p>
                          <p className="font-medium">{area.gestao_residuos}</p>
                        </div>
                        <div className="text-center">
                          <Sun className="h-6 w-6 text-yellow-600 mx-auto mb-1" />
                          <p className="text-xs text-gray-600">Energia Renovável</p>
                          <p className="font-medium">{area.energia_renovavel}%</p>
                        </div>
                      </div>

                      <div className="mt-4">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Score Geral</span>
                          <span>{area.score_geral}/100</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="h-2 rounded-full"
                            style={{
                              width: `${area.score_geral}%`,
                              backgroundColor: getClassificacaoColor(area.classificacao)
                            }}
                          ></div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="impactos" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Impactos dos Programas Ambientais</CardTitle>
              <CardDescription>Resultados mensuráveis das iniciativas de sustentabilidade</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {impactosAmbientais.map((impacto) => (
                  <Card key={impacto.id} className="border-l-4 border-l-green-500">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">{impacto.programa}</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex items-center gap-2 mb-2">
                        {impacto.tipo === 'positivo' ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : (
                          <AlertTriangle className="h-5 w-5 text-red-600" />
                        )}
                        <Badge className={impacto.tipo === 'positivo' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                          {impacto.tipo}
                        </Badge>
                      </div>
                      <div className="text-2xl font-bold text-green-600 mb-1">
                        {impacto.valor} {impacto.unidade}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{impacto.descricao}</p>
                      <div className="flex justify-between items-center text-xs">
                        <Badge variant="outline" className="capitalize">
                          {impacto.categoria}
                        </Badge>
                        <span className="text-gray-500">{impacto.periodo}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="servicos" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-green-600" />
                Serviços Gerados Automaticamente
              </CardTitle>
              <CardDescription>
                Serviços do catálogo público gerados pelas funcionalidades internas do dashboard ambiental
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {servicosGerados.map((servico) => (
                  <Card key={servico.id} className="border-l-4 border-l-green-500">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-base">{servico.nome}</CardTitle>
                        <div className="flex gap-2">
                          {servico.automatico && (
                            <Badge variant="secondary" className="text-xs">
                              Automático
                            </Badge>
                          )}
                          <Badge className={servico.ativo ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                            {servico.ativo ? 'Ativo' : 'Inativo'}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-sm text-gray-600 mb-3">{servico.descricao}</p>
                      <div className="flex justify-between items-center">
                        <Badge variant="outline" className="capitalize">
                          {servico.categoria}
                        </Badge>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-2" />
                            Visualizar
                          </Button>
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-2" />
                            Gerar
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Integração Bidirecional</CardTitle>
              <CardDescription>
                Como o dashboard ambiental gera automaticamente serviços para o catálogo público
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
                  <h4 className="font-medium text-green-900 mb-2">Dashboard Ambiental → Serviços Públicos</h4>
                  <ul className="text-sm text-green-800 space-y-1">
                    <li>• <strong>Relatório Ambiental:</strong> Consolidação automática de indicadores ambientais</li>
                    <li>• <strong>Pegada Ecológica:</strong> Cálculo personalizado de impacto ambiental</li>
                    <li>• <strong>Indicadores Verdes da Família:</strong> Métricas ambientais personalizadas</li>
                  </ul>
                </div>

                <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                  <h4 className="font-medium text-blue-900 mb-2">Fluxo de Protocolos</h4>
                  <p className="text-sm text-blue-800">
                    Cidadão solicita "Relatório Ambiental" → Protocolo criado → Sistema compila dados de qualidade ambiental →
                    Gera relatório personalizado → Disponibiliza orientações ambientais
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="relatorios" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Relatório de Qualidade Ambiental</CardTitle>
                <CardDescription>Consolidação dos indicadores ambientais</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Gerar Relatório
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Relatório de Sustentabilidade</CardTitle>
                <CardDescription>Impactos dos programas ambientais</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Gerar Relatório
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Relatório de Emissões</CardTitle>
                <CardDescription>Inventário de gases de efeito estufa</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Gerar Relatório
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Relatório de Resíduos</CardTitle>
                <CardDescription>Gestão e reciclagem de resíduos sólidos</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Gerar Relatório
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Relatório de Energia</CardTitle>
                <CardDescription>Matriz energética e fontes renováveis</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Gerar Relatório
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Relatório de Biodiversidade</CardTitle>
                <CardDescription>Estado da fauna e flora municipal</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Gerar Relatório
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}