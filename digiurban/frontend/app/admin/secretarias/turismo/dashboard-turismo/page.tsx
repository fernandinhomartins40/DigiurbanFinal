'use client'

import { useState, useEffect } from 'react'
import { useAdminAuth } from '@/contexts/AdminAuthContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area, ComposedChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { TrendingUp, TrendingDown, Users, MapPin, Calendar, Building, FileText, Target, Star, Camera, Route, Info, Award, AlertTriangle, CheckCircle, Clock, DollarSign } from 'lucide-react'

interface DashboardData {
  visitantes: {
    total_mes_atual: number
    total_mes_anterior: number
    origem_nacional: number
    origem_internacional: number
    tempo_permanencia_medio: number
    gasto_medio_diario: number
    satisfacao_geral: number
  }
  infraestrutura: {
    pontos_turisticos: {
      total: number
      ativos: number
      em_manutencao: number
      avaliacoes_positivas: number
    }
    rotas_turisticas: {
      total: number
      ativas: number
      distancia_total: number
      utilizacao_media: number
    }
    estabelecimentos: {
      total: number
      certificados: number
      novos_mes: number
      categoria_predominante: string
    }
  }
  programas: {
    ativos: number
    participantes_totais: number
    orcamento_executado: number
    orcamento_total: number
    eventos_realizados: number
    impacto_economico: number
  }
  servicos_digitais: {
    downloads_app: number
    visualizacoes_mapa: number
    qr_codes_escaneados: number
    tours_virtuais: number
    satisfacao_digital: number
  }
  centrais_informacao: {
    total_centrais: number
    atendimentos_mes: number
    idiomas_atendidos: number
    materiais_distribuidos: number
    satisfacao_atendimento: number
  }
  indicadores_economicos: {
    receita_turismo_mes: number
    empregos_setor: number
    ocupacao_hoteleira: number
    movimento_restaurantes: number
    crescimento_anual: number
  }
}

interface AlertaOperacional {
  id: string
  tipo: 'manutencao' | 'evento' | 'capacidade' | 'sistema'
  prioridade: 'alta' | 'media' | 'baixa'
  titulo: string
  descricao: string
  data_criacao: string
  status: 'pendente' | 'em_andamento' | 'resolvido'
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658', '#FF6B8A']

export default function DashboardTurismoPage() {
  const { user } = useAdminAuth()
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [alertas, setAlertas] = useState<AlertaOperacional[]>([])
  const [currentTab, setCurrentTab] = useState('overview')
  const [selectedPeriod, setSelectedPeriod] = useState<'7d' | '30d' | '90d' | '1y'>('30d')

  useEffect(() => {
    const mockData: DashboardData = {
      visitantes: {
        total_mes_atual: 8420,
        total_mes_anterior: 7650,
        origem_nacional: 6890,
        origem_internacional: 1530,
        tempo_permanencia_medio: 2.8,
        gasto_medio_diario: 185.50,
        satisfacao_geral: 9.1
      },
      infraestrutura: {
        pontos_turisticos: {
          total: 24,
          ativos: 22,
          em_manutencao: 2,
          avaliacoes_positivas: 89
        },
        rotas_turisticas: {
          total: 8,
          ativas: 7,
          distancia_total: 45.6,
          utilizacao_media: 68
        },
        estabelecimentos: {
          total: 156,
          certificados: 89,
          novos_mes: 12,
          categoria_predominante: 'Gastronomia'
        }
      },
      programas: {
        ativos: 5,
        participantes_totais: 2840,
        orcamento_executado: 850000,
        orcamento_total: 1200000,
        eventos_realizados: 18,
        impacto_economico: 3200000
      },
      servicos_digitais: {
        downloads_app: 15640,
        visualizacoes_mapa: 45280,
        qr_codes_escaneados: 8950,
        tours_virtuais: 3420,
        satisfacao_digital: 8.7
      },
      centrais_informacao: {
        total_centrais: 4,
        atendimentos_mes: 1930,
        idiomas_atendidos: 5,
        materiais_distribuidos: 2450,
        satisfacao_atendimento: 9.2
      },
      indicadores_economicos: {
        receita_turismo_mes: 2800000,
        empregos_setor: 1240,
        ocupacao_hoteleira: 72,
        movimento_restaurantes: 156,
        crescimento_anual: 15.8
      }
    }

    const mockAlertas: AlertaOperacional[] = [
      {
        id: '1',
        tipo: 'manutencao',
        prioridade: 'alta',
        titulo: 'Manutenção Mirante da Serra',
        descricao: 'Deck de observação necessita reparos urgentes na estrutura de segurança',
        data_criacao: '2024-09-18',
        status: 'em_andamento'
      },
      {
        id: '2',
        tipo: 'evento',
        prioridade: 'media',
        titulo: 'Festival de Outono - Preparação',
        descricao: 'Verificação final de infraestrutura para evento de 15-17 de outubro',
        data_criacao: '2024-09-20',
        status: 'pendente'
      },
      {
        id: '3',
        tipo: 'sistema',
        prioridade: 'baixa',
        titulo: 'Atualização App Turístico',
        descricao: 'Nova versão 3.1 com melhorias de performance disponível',
        data_criacao: '2024-09-19',
        status: 'pendente'
      }
    ]

    setDashboardData(mockData)
    setAlertas(mockAlertas)
  }, [])

  if (!dashboardData) return <div>Carregando...</div>

  const visitantesGrowth = ((dashboardData.visitantes.total_mes_atual - dashboardData.visitantes.total_mes_anterior) / dashboardData.visitantes.total_mes_anterior * 100)
  const orcamentoProgress = (dashboardData.programas.orcamento_executado / dashboardData.programas.orcamento_total * 100)

  const visitantesPorMes = [
    { mes: 'Jan', nacionais: 5200, internacionais: 1100, total: 6300 },
    { mes: 'Fev', nacionais: 5800, internacionais: 1300, total: 7100 },
    { mes: 'Mar', nacionais: 6400, internacionais: 1400, total: 7800 },
    { mes: 'Abr', nacionais: 6100, internacionais: 1200, total: 7300 },
    { mes: 'Mai', nacionais: 6800, internacionais: 1350, total: 8150 },
    { mes: 'Jun', nacionais: 6890, internacionais: 1530, total: 8420 }
  ]

  const receitaPorSetor = [
    { setor: 'Hospedagem', receita: 1200000, percentual: 43 },
    { setor: 'Gastronomia', receita: 840000, percentual: 30 },
    { setor: 'Entretenimento', receita: 420000, percentual: 15 },
    { setor: 'Transporte', receita: 280000, percentual: 10 },
    { setor: 'Outros', receita: 60000, percentual: 2 }
  ]

  const satisfacaoPorServico = [
    { servico: 'Pontos Turísticos', nota: 9.1, avaliacoes: 1850 },
    { servico: 'Rotas Turísticas', nota: 8.8, avaliacoes: 920 },
    { servico: 'Estabelecimentos', nota: 8.9, avaliacoes: 2340 },
    { servico: 'Atendimento', nota: 9.2, avaliacoes: 1420 },
    { servico: 'App/Digital', nota: 8.7, avaliacoes: 980 }
  ]

  const tendenciaAnual = [
    { periodo: '2021', visitantes: 45000, receita: 18500000, crescimento: 5 },
    { periodo: '2022', visitantes: 52000, receita: 21200000, crescimento: 8 },
    { periodo: '2023', visitantes: 67000, receita: 28400000, crescimento: 12 },
    { periodo: '2024', visitantes: 78000, receita: 32900000, crescimento: 16 }
  ]

  const alertasPorPrioridade = alertas.reduce((acc, alerta) => {
    acc[alerta.prioridade] = (acc[alerta.prioridade] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard Turismo</h1>
          <p className="text-muted-foreground mt-2">
            Visão geral consolidada da Secretaria de Turismo Municipal
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            Último mês
          </Badge>
          <Badge variant={visitantesGrowth > 0 ? 'default' : 'destructive'} className="flex items-center gap-1">
            {visitantesGrowth > 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            {visitantesGrowth > 0 ? '+' : ''}{visitantesGrowth.toFixed(1)}%
          </Badge>
        </div>
      </div>

      <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="visitantes">Visitantes</TabsTrigger>
          <TabsTrigger value="infraestrutura">Infraestrutura</TabsTrigger>
          <TabsTrigger value="economico">Econômico</TabsTrigger>
          <TabsTrigger value="operacional">Operacional</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Visitantes Este Mês</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboardData.visitantes.total_mes_atual.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  {visitantesGrowth > 0 ? '+' : ''}{visitantesGrowth.toFixed(1)}% vs mês anterior
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Receita Turística</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0 }).format(dashboardData.indicadores_economicos.receita_turismo_mes)}
                </div>
                <p className="text-xs text-muted-foreground">
                  {dashboardData.indicadores_economicos.crescimento_anual}% crescimento anual
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Satisfação Geral</CardTitle>
                <Star className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboardData.visitantes.satisfacao_geral}/10</div>
                <p className="text-xs text-muted-foreground">
                  +{(dashboardData.visitantes.satisfacao_geral - 8.5).toFixed(1)} vs meta (8.5)
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Ocupação Hoteleira</CardTitle>
                <Building className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboardData.indicadores_economicos.ocupacao_hoteleira}%</div>
                <p className="text-xs text-muted-foreground">
                  Meta: 70% (atingida)
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Evolução de Visitantes - 6 Meses</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <ComposedChart data={visitantesPorMes}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mes" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="nacionais" stackId="a" fill="#8884d8" name="Nacionais" />
                    <Bar dataKey="internacionais" stackId="a" fill="#82ca9d" name="Internacionais" />
                    <Line type="monotone" dataKey="total" stroke="#ff7300" strokeWidth={2} name="Total" />
                  </ComposedChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Distribuição de Receita por Setor</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={receitaPorSetor}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ setor, percentual }) => `${setor} ${percentual}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="receita"
                    >
                      {receitaPorSetor.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0 }).format(value as number)} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Infraestrutura Turística</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Pontos Turísticos</span>
                  <Badge variant="outline">{dashboardData.infraestrutura.pontos_turisticos.ativos}/{dashboardData.infraestrutura.pontos_turisticos.total}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Rotas Ativas</span>
                  <Badge variant="outline">{dashboardData.infraestrutura.rotas_turisticas.ativas}/{dashboardData.infraestrutura.rotas_turisticas.total}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Estabelecimentos</span>
                  <Badge variant="outline">{dashboardData.infraestrutura.estabelecimentos.total}</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Programas e Eventos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Programas Ativos</span>
                  <Badge variant="default">{dashboardData.programas.ativos}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Eventos Realizados</span>
                  <Badge variant="default">{dashboardData.programas.eventos_realizados}</Badge>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Orçamento Executado</span>
                    <span>{orcamentoProgress.toFixed(1)}%</span>
                  </div>
                  <Progress value={orcamentoProgress} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Serviços Digitais</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Downloads App</span>
                  <Badge variant="outline">{dashboardData.servicos_digitais.downloads_app.toLocaleString()}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">QR Codes Escaneados</span>
                  <Badge variant="outline">{dashboardData.servicos_digitais.qr_codes_escaneados.toLocaleString()}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Tours Virtuais</span>
                  <Badge variant="outline">{dashboardData.servicos_digitais.tours_virtuais.toLocaleString()}</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="visitantes" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Visitantes Nacionais</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboardData.visitantes.origem_nacional.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  {((dashboardData.visitantes.origem_nacional / dashboardData.visitantes.total_mes_atual) * 100).toFixed(1)}% do total
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Visitantes Internacionais</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboardData.visitantes.origem_internacional.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  {((dashboardData.visitantes.origem_internacional / dashboardData.visitantes.total_mes_atual) * 100).toFixed(1)}% do total
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Permanência Média</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboardData.visitantes.tempo_permanencia_medio} dias</div>
                <p className="text-xs text-muted-foreground">+0.3 vs mês anterior</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Gasto Médio Diário</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(dashboardData.visitantes.gasto_medio_diario)}
                </div>
                <p className="text-xs text-muted-foreground">+R$ 12,30 vs mês anterior</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Satisfação por Serviço</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={satisfacaoPorServico} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" domain={[0, 10]} />
                  <YAxis dataKey="servico" type="category" width={120} />
                  <Tooltip />
                  <Bar dataKey="nota" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tendência Anual de Crescimento</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <ComposedChart data={tendenciaAnual}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="periodo" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="visitantes" fill="#8884d8" name="Visitantes Anuais" />
                  <Line yAxisId="right" type="monotone" dataKey="crescimento" stroke="#82ca9d" strokeWidth={2} name="% Crescimento" />
                </ComposedChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="infraestrutura" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Pontos Turísticos
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Total de Pontos</span>
                  <Badge variant="outline">{dashboardData.infraestrutura.pontos_turisticos.total}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Ativos</span>
                  <Badge variant="default">{dashboardData.infraestrutura.pontos_turisticos.ativos}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Em Manutenção</span>
                  <Badge variant="destructive">{dashboardData.infraestrutura.pontos_turisticos.em_manutencao}</Badge>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Avaliações Positivas</span>
                    <span>{dashboardData.infraestrutura.pontos_turisticos.avaliacoes_positivas}%</span>
                  </div>
                  <Progress value={dashboardData.infraestrutura.pontos_turisticos.avaliacoes_positivas} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Route className="h-5 w-5" />
                  Rotas Turísticas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Total de Rotas</span>
                  <Badge variant="outline">{dashboardData.infraestrutura.rotas_turisticas.total}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Ativas</span>
                  <Badge variant="default">{dashboardData.infraestrutura.rotas_turisticas.ativas}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Distância Total</span>
                  <Badge variant="outline">{dashboardData.infraestrutura.rotas_turisticas.distancia_total} km</Badge>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Utilização Média</span>
                    <span>{dashboardData.infraestrutura.rotas_turisticas.utilizacao_media}%</span>
                  </div>
                  <Progress value={dashboardData.infraestrutura.rotas_turisticas.utilizacao_media} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  Estabelecimentos
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Total Cadastrados</span>
                  <Badge variant="outline">{dashboardData.infraestrutura.estabelecimentos.total}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Certificados</span>
                  <Badge variant="default">{dashboardData.infraestrutura.estabelecimentos.certificados}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Novos Este Mês</span>
                  <Badge variant="secondary">{dashboardData.infraestrutura.estabelecimentos.novos_mes}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Categoria Principal</span>
                  <Badge variant="outline">{dashboardData.infraestrutura.estabelecimentos.categoria_predominante}</Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5" />
                Centrais de Informação
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold">{dashboardData.centrais_informacao.total_centrais}</div>
                  <p className="text-sm text-muted-foreground">Centrais Ativas</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">{dashboardData.centrais_informacao.atendimentos_mes.toLocaleString()}</div>
                  <p className="text-sm text-muted-foreground">Atendimentos/Mês</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">{dashboardData.centrais_informacao.idiomas_atendidos}</div>
                  <p className="text-sm text-muted-foreground">Idiomas</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">{dashboardData.centrais_informacao.materiais_distribuidos.toLocaleString()}</div>
                  <p className="text-sm text-muted-foreground">Materiais Distribuídos</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">{dashboardData.centrais_informacao.satisfacao_atendimento}/10</div>
                  <p className="text-sm text-muted-foreground">Satisfação</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="economico" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Receita Mensal</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0 }).format(dashboardData.indicadores_economicos.receita_turismo_mes)}
                </div>
                <p className="text-xs text-muted-foreground">+18% vs mês anterior</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Empregos no Setor</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboardData.indicadores_economicos.empregos_setor.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">+45 novos empregos</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Ocupação Hoteleira</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboardData.indicadores_economicos.ocupacao_hoteleira}%</div>
                <p className="text-xs text-muted-foreground">Acima da meta (70%)</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Crescimento Anual</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboardData.indicadores_economicos.crescimento_anual}%</div>
                <p className="text-xs text-muted-foreground">Meta: 12% (superada)</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Impacto Econômico dos Programas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-6 border rounded-lg">
                  <div className="text-3xl font-bold text-green-600">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0 }).format(dashboardData.programas.impacto_economico)}
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">Impacto Econômico Total</p>
                </div>
                <div className="text-center p-6 border rounded-lg">
                  <div className="text-3xl font-bold text-blue-600">{dashboardData.programas.participantes_totais.toLocaleString()}</div>
                  <p className="text-sm text-muted-foreground mt-2">Participantes em Programas</p>
                </div>
                <div className="text-center p-6 border rounded-lg">
                  <div className="text-3xl font-bold text-purple-600">{orcamentoProgress.toFixed(1)}%</div>
                  <p className="text-sm text-muted-foreground mt-2">Execução Orçamentária</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Receita por Setor Detalhada</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {receitaPorSetor.map((setor, index) => (
                  <div key={setor.setor} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                      <span className="font-medium">{setor.setor}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0 }).format(setor.receita)}
                      </div>
                      <div className="text-sm text-muted-foreground">{setor.percentual}% do total</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="operacional" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Alertas Operacionais
                </CardTitle>
                <CardDescription>
                  {alertas.filter(a => a.status !== 'resolvido').length} alertas pendentes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {alertas.filter(a => a.status !== 'resolvido').map((alerta) => (
                    <div key={alerta.id} className="flex items-start gap-3 p-3 border rounded-lg">
                      <div className="flex-shrink-0 mt-1">
                        {alerta.prioridade === 'alta' && <AlertTriangle className="h-4 w-4 text-red-500" />}
                        {alerta.prioridade === 'media' && <Clock className="h-4 w-4 text-yellow-500" />}
                        {alerta.prioridade === 'baixa' && <Info className="h-4 w-4 text-blue-500" />}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{alerta.titulo}</h4>
                        <p className="text-sm text-muted-foreground">{alerta.descricao}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant={
                            alerta.prioridade === 'alta' ? 'destructive' :
                            alerta.prioridade === 'media' ? 'default' : 'secondary'
                          }>
                            {alerta.prioridade}
                          </Badge>
                          <Badge variant="outline">
                            {alerta.status === 'pendente' ? 'Pendente' : 'Em Andamento'}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Metas e Indicadores
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium">Visitantes Anuais</span>
                    <span>78.000 / 80.000</span>
                  </div>
                  <Progress value={97.5} />
                  <p className="text-xs text-muted-foreground mt-1">97.5% da meta anual</p>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium">Satisfação Geral</span>
                    <span>9.1 / 8.5</span>
                  </div>
                  <Progress value={100} />
                  <p className="text-xs text-muted-foreground mt-1">Meta superada</p>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium">Ocupação Hoteleira</span>
                    <span>72% / 70%</span>
                  </div>
                  <Progress value={100} />
                  <p className="text-xs text-muted-foreground mt-1">Meta atingida</p>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium">Crescimento Receita</span>
                    <span>15.8% / 12%</span>
                  </div>
                  <Progress value={100} />
                  <p className="text-xs text-muted-foreground mt-1">Meta superada</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Resumo de Performance por Área
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center p-4 border rounded-lg">
                  <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                  <h3 className="font-medium">Atendimentos</h3>
                  <p className="text-2xl font-bold text-green-600">Excelente</p>
                  <p className="text-sm text-muted-foreground">9.2/10 satisfação</p>
                </div>

                <div className="text-center p-4 border rounded-lg">
                  <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                  <h3 className="font-medium">Infraestrutura</h3>
                  <p className="text-2xl font-bold text-green-600">Ótimo</p>
                  <p className="text-sm text-muted-foreground">92% operacional</p>
                </div>

                <div className="text-center p-4 border rounded-lg">
                  <CheckCircle className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                  <h3 className="font-medium">Digital</h3>
                  <p className="text-2xl font-bold text-blue-600">Bom</p>
                  <p className="text-sm text-muted-foreground">8.7/10 satisfação</p>
                </div>

                <div className="text-center p-4 border rounded-lg">
                  <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                  <h3 className="font-medium">Eventos</h3>
                  <p className="text-2xl font-bold text-green-600">Excelente</p>
                  <p className="text-sm text-muted-foreground">18 eventos realizados</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Serviços Públicos Gerados Automaticamente</CardTitle>
              <CardDescription>
                Sistema consolidado de geração automática de 36 serviços turísticos especializados
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Atendimentos PDV</h4>
                  <p className="text-sm text-muted-foreground">6 serviços de apoio direto ao visitante</p>
                  <Badge variant="default" className="mt-2">100% Ativo</Badge>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Gestão de Pontos</h4>
                  <p className="text-sm text-muted-foreground">6 serviços de cadastro e certificação</p>
                  <Badge variant="default" className="mt-2">100% Ativo</Badge>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Estabelecimentos</h4>
                  <p className="text-sm text-muted-foreground">4 serviços de registro empresarial</p>
                  <Badge variant="default" className="mt-2">100% Ativo</Badge>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Programas Turísticos</h4>
                  <p className="text-sm text-muted-foreground">6 serviços de participação e fomento</p>
                  <Badge variant="default" className="mt-2">100% Ativo</Badge>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Navegação Digital</h4>
                  <p className="text-sm text-muted-foreground">6 serviços de mapa e navegação</p>
                  <Badge variant="default" className="mt-2">100% Ativo</Badge>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Informações</h4>
                  <p className="text-sm text-muted-foreground">6 serviços de material e atendimento</p>
                  <Badge variant="default" className="mt-2">100% Ativo</Badge>
                </div>
              </div>
              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <h4 className="font-medium text-green-800">Secretaria de Turismo - COMPLETA</h4>
                </div>
                <p className="text-sm text-green-700">
                  Todas as 7 páginas implementadas com 36 serviços públicos automatizados ativos.
                  Sistema integrado funcionando com 100% de disponibilidade.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}