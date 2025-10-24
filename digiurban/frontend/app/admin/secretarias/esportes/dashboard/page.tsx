'use client'

import { useState } from 'react'
import { useAdminAuth } from '@/contexts/AdminAuthContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, AreaChart, Area } from 'recharts'
import {
  Activity, Users, Trophy, Building, Calendar, MapPin, Clock, TrendingUp,
  Target, Star, Award, Medal, Zap, DollarSign, FileText, Download,
  AlertCircle, CheckCircle, ArrowUp, ArrowDown, PlayCircle, PauseCircle
} from 'lucide-react'

export default function DashboardEsportesPage() {
  useAdminAuth()

  const [periodoFilter, setPeriodoFilter] = useState('ultimo_mes')

  const dadosEstatisticos = {
    atendimentos: {
      total: 2840,
      crescimento: 12.5,
      pendentes: 23,
      resolvidos: 2817
    },
    equipesEsportivas: {
      total: 45,
      crescimento: 8.9,
      ativas: 42,
      suspensas: 3
    },
    competicoesTorneios: {
      total: 28,
      crescimento: 15.2,
      andamento: 8,
      planejados: 12,
      concluidos: 8
    },
    atletasFederados: {
      total: 200,
      crescimento: 6.8,
      ativos: 170,
      suspensos: 7,
      inativos: 23
    },
    escolinhasEsportivas: {
      total: 30,
      crescimento: 10.3,
      ativas: 22,
      suspensas: 3,
      planejadas: 5
    },
    eventosEsportivos: {
      total: 43,
      crescimento: 16.7,
      andamento: 15,
      planejados: 8,
      concluidos: 20
    },
    infraestruturaEsportiva: {
      total: 60,
      crescimento: 3.3,
      ativas: 52,
      manutencao: 8
    }
  }

  const dadosPerformance = [
    { mes: 'Jan', atendimentos: 245, eventos: 4, atletas: 185, escolinhas: 28 },
    { mes: 'Fev', atendimentos: 268, eventos: 3, atletas: 192, escolinhas: 29 },
    { mes: 'Mar', atendimentos: 290, eventos: 5, atletas: 195, escolinhas: 30 },
    { mes: 'Abr', atendimentos: 275, eventos: 4, atletas: 198, escolinhas: 30 },
    { mes: 'Mai', atendimentos: 312, eventos: 6, atletas: 200, escolinhas: 30 },
    { mes: 'Jun', atendimentos: 285, eventos: 7, atletas: 200, escolinhas: 30 }
  ]

  const distribuicaoModalidades = [
    { name: 'Futebol', value: 35, color: '#22C55E' },
    { name: 'Natação', value: 18, color: '#3B82F6' },
    { name: 'Voleibol', value: 15, color: '#F59E0B' },
    { name: 'Basquete', value: 12, color: '#EF4444' },
    { name: 'Atletismo', value: 10, color: '#8B5CF6' },
    { name: 'Outros', value: 10, color: '#6B7280' }
  ]

  const utilizacaoInstalacoes = [
    { instalacao: 'Estádio Municipal', utilizacao: 85 },
    { instalacao: 'Complexo Aquático', utilizacao: 92 },
    { instalacao: 'Ginásio da Juventude', utilizacao: 45 },
    { instalacao: 'Centro Esportivo', utilizacao: 78 },
    { instalacao: 'Quadras Poliesportivas', utilizacao: 88 },
    { instalacao: 'Pista de Atletismo', utilizacao: 65 }
  ]

  const orcamentoGastos = [
    { categoria: 'Pessoal', orcado: 450000, gasto: 380000 },
    { categoria: 'Equipamentos', orcado: 280000, gasto: 235000 },
    { categoria: 'Eventos', orcado: 385000, gasto: 310000 },
    { categoria: 'Manutenção', orcado: 850000, gasto: 420000 },
    { categoria: 'Infraestrutura', orcado: 650000, gasto: 580000 },
    { categoria: 'Programas', orcado: 320000, gasto: 275000 }
  ]

  const indicadoresSatisfacao = [
    { categoria: 'Atendimentos', satisfacao: 87, meta: 85 },
    { categoria: 'Eventos', satisfacao: 92, meta: 90 },
    { categoria: 'Escolinhas', satisfacao: 89, meta: 85 },
    { categoria: 'Instalações', satisfacao: 84, meta: 80 },
    { categoria: 'Competições', satisfacao: 91, meta: 88 },
    { categoria: 'Geral', satisfacao: 88, meta: 85 }
  ]

  const alertasPrioritarios = [
    {
      id: 1,
      tipo: 'manutencao',
      titulo: 'Ginásio da Juventude em Reforma',
      descricao: 'Reforma das arquibancadas em andamento - prazo até 30/09',
      prioridade: 'alta',
      data: '2024-06-01'
    },
    {
      id: 2,
      tipo: 'evento',
      titulo: 'Copa Municipal de Futebol',
      descricao: 'Inscrições abertas - 80 participantes de 400 vagas',
      prioridade: 'media',
      data: '2024-06-15'
    },
    {
      id: 3,
      tipo: 'orcamento',
      titulo: 'Orçamento de Manutenção',
      descricao: '49% utilizado - R$ 420.000 de R$ 850.000',
      prioridade: 'baixa',
      data: '2024-06-20'
    },
    {
      id: 4,
      tipo: 'atleta',
      titulo: 'Documentação Pendente',
      descricao: '10 atletas com documentação incompleta',
      prioridade: 'alta',
      data: '2024-06-18'
    }
  ]

  const getPrioridadeBadge = (prioridade: string) => {
    switch (prioridade) {
      case 'alta':
        return <Badge className="bg-red-100 text-red-800">Alta</Badge>
      case 'media':
        return <Badge className="bg-yellow-100 text-yellow-800">Média</Badge>
      case 'baixa':
        return <Badge className="bg-green-100 text-green-800">Baixa</Badge>
      default:
        return <Badge>{prioridade}</Badge>
    }
  }

  const getTipoBadge = (tipo: string) => {
    switch (tipo) {
      case 'manutencao':
        return <Badge className="bg-orange-100 text-orange-800">Manutenção</Badge>
      case 'evento':
        return <Badge className="bg-blue-100 text-blue-800">Evento</Badge>
      case 'orcamento':
        return <Badge className="bg-purple-100 text-purple-800">Orçamento</Badge>
      case 'atleta':
        return <Badge className="bg-green-100 text-green-800">Atleta</Badge>
      default:
        return <Badge>{tipo}</Badge>
    }
  }

  const getUtilizacaoColor = (utilizacao: number) => {
    if (utilizacao >= 90) return '#EF4444'
    if (utilizacao >= 70) return '#F59E0B'
    return '#22C55E'
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard - Secretaria de Esportes</h1>
          <p className="text-gray-600">Visão geral consolidada de todas as operações esportivas</p>
        </div>
        <div className="flex items-center space-x-2">
          <Select value={periodoFilter} onValueChange={setPeriodoFilter}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ultima_semana">Última Semana</SelectItem>
              <SelectItem value="ultimo_mes">Último Mês</SelectItem>
              <SelectItem value="ultimo_trimestre">Último Trimestre</SelectItem>
              <SelectItem value="ultimo_ano">Último Ano</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Exportar
          </Button>
        </div>
      </div>

      <Tabs defaultValue="visao-geral" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="visao-geral">Visão Geral</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="financeiro">Financeiro</TabsTrigger>
          <TabsTrigger value="infraestrutura">Infraestrutura</TabsTrigger>
          <TabsTrigger value="alertas">Alertas</TabsTrigger>
        </TabsList>

        <TabsContent value="visao-geral" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Atendimentos</CardTitle>
                <Users className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dadosEstatisticos.atendimentos.total.toLocaleString()}</div>
                <div className="flex items-center text-xs text-green-600">
                  <ArrowUp className="w-3 h-3 mr-1" />
                  +{dadosEstatisticos.atendimentos.crescimento}% este mês
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Atletas Federados</CardTitle>
                <Trophy className="h-4 w-4 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dadosEstatisticos.atletasFederados.total}</div>
                <div className="flex items-center text-xs text-green-600">
                  <ArrowUp className="w-3 h-3 mr-1" />
                  +{dadosEstatisticos.atletasFederados.crescimento}% este mês
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Eventos Ativos</CardTitle>
                <Calendar className="h-4 w-4 text-purple-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dadosEstatisticos.eventosEsportivos.andamento}</div>
                <div className="flex items-center text-xs text-green-600">
                  <ArrowUp className="w-3 h-3 mr-1" />
                  +{dadosEstatisticos.eventosEsportivos.crescimento}% este mês
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Instalações</CardTitle>
                <Building className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dadosEstatisticos.infraestruturaEsportiva.total}</div>
                <div className="flex items-center text-xs text-green-600">
                  <ArrowUp className="w-3 h-3 mr-1" />
                  +{dadosEstatisticos.infraestruturaEsportiva.crescimento}% este mês
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-7 gap-6">
            <Card className="md:col-span-3">
              <CardHeader>
                <CardTitle>Status por Área</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Users className="w-5 h-5 text-blue-500" />
                    <div>
                      <h4 className="font-medium">Equipes Esportivas</h4>
                      <p className="text-sm text-gray-600">{dadosEstatisticos.equipesEsportivas.ativas} ativas de {dadosEstatisticos.equipesEsportivas.total}</p>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-800">93%</Badge>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Trophy className="w-5 h-5 text-yellow-500" />
                    <div>
                      <h4 className="font-medium">Competições</h4>
                      <p className="text-sm text-gray-600">{dadosEstatisticos.competicoesTorneios.andamento} em andamento</p>
                    </div>
                  </div>
                  <Badge className="bg-blue-100 text-blue-800">{dadosEstatisticos.competicoesTorneios.andamento}</Badge>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Star className="w-5 h-5 text-purple-500" />
                    <div>
                      <h4 className="font-medium">Escolinhas</h4>
                      <p className="text-sm text-gray-600">{dadosEstatisticos.escolinhasEsportivas.ativas} ativas de {dadosEstatisticos.escolinhasEsportivas.total}</p>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-800">73%</Badge>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Building className="w-5 h-5 text-green-500" />
                    <div>
                      <h4 className="font-medium">Infraestrutura</h4>
                      <p className="text-sm text-gray-600">{dadosEstatisticos.infraestruturaEsportiva.ativas} operacionais</p>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-800">87%</Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-4">
              <CardHeader>
                <CardTitle>Distribuição por Modalidades</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={distribuicaoModalidades}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={(({ name, percent }: { name: string; percent: number }) => `${name} ${(percent * 100).toFixed(0)}%`) as any}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {distribuicaoModalidades.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Ações Rápidas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
                  <Users className="w-6 h-6" />
                  <span className="text-sm">Novo Atendimento</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
                  <Calendar className="w-6 h-6" />
                  <span className="text-sm">Agendar Evento</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
                  <Trophy className="w-6 h-6" />
                  <span className="text-sm">Nova Competição</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
                  <Building className="w-6 h-6" />
                  <span className="text-sm">Reservar Instalação</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Performance Mensal por Área</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={dadosPerformance}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mes" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="atendimentos" stackId="1" stroke="#3B82F6" fill="#3B82F6" />
                  <Area type="monotone" dataKey="eventos" stackId="1" stroke="#10B981" fill="#10B981" />
                  <Area type="monotone" dataKey="atletas" stackId="1" stroke="#F59E0B" fill="#F59E0B" />
                  <Area type="monotone" dataKey="escolinhas" stackId="1" stroke="#EF4444" fill="#EF4444" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Indicadores de Satisfação</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {indicadoresSatisfacao.map((indicador, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">{indicador.categoria}</span>
                        <span className="text-sm text-gray-600">{indicador.satisfacao}% (Meta: {indicador.meta}%)</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${indicador.satisfacao >= indicador.meta ? 'bg-green-500' : 'bg-yellow-500'}`}
                          style={{ width: `${indicador.satisfacao}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="ml-4">
                      {indicador.satisfacao >= indicador.meta ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-yellow-500" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="financeiro" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Orçamento Total</CardTitle>
                <DollarSign className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">R$ 2.935.000</div>
                <p className="text-xs text-muted-foreground">Aprovado para 2024</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Executado</CardTitle>
                <TrendingUp className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">R$ 2.200.000</div>
                <p className="text-xs text-muted-foreground">75% do orçamento</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Disponível</CardTitle>
                <DollarSign className="h-4 w-4 text-purple-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">R$ 735.000</div>
                <p className="text-xs text-muted-foreground">25% restante</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Execução Orçamentária por Categoria</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={orcamentoGastos}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="categoria" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="orcado" fill="#E5E7EB" name="Orçado" />
                  <Bar dataKey="gasto" fill="#3B82F6" name="Executado" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="infraestrutura" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Utilização das Instalações</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {utilizacaoInstalacoes.map((instalacao, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">{instalacao.instalacao}</span>
                        <span className="text-sm text-gray-600">{instalacao.utilizacao}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="h-2 rounded-full"
                          style={{
                            width: `${instalacao.utilizacao}%`,
                            backgroundColor: getUtilizacaoColor(instalacao.utilizacao)
                          }}
                        ></div>
                      </div>
                    </div>
                    <div className="ml-4">
                      {instalacao.utilizacao >= 90 ? (
                        <AlertCircle className="w-5 h-5 text-red-500" />
                      ) : instalacao.utilizacao >= 70 ? (
                        <Clock className="w-5 h-5 text-yellow-500" />
                      ) : (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Status das Instalações</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Operacionais</h4>
                    <p className="text-sm text-gray-600">Funcionamento normal</p>
                  </div>
                  <Badge className="bg-green-100 text-green-800">52</Badge>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Em Manutenção</h4>
                    <p className="text-sm text-gray-600">Temporariamente indisponíveis</p>
                  </div>
                  <Badge className="bg-orange-100 text-orange-800">8</Badge>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Capacidade Total</h4>
                    <p className="text-sm text-gray-600">Pessoas simultaneamente</p>
                  </div>
                  <Badge className="bg-blue-100 text-blue-800">24.300</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Manutenções Programadas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-3 border-l-4 border-yellow-500 bg-yellow-50">
                  <div>
                    <h4 className="font-medium">Ginásio da Juventude</h4>
                    <p className="text-sm text-gray-600">Reforma arquibancadas - 30/09</p>
                  </div>
                  <Badge className="bg-yellow-100 text-yellow-800">Em Andamento</Badge>
                </div>
                <div className="flex items-center justify-between p-3 border-l-4 border-blue-500 bg-blue-50">
                  <div>
                    <h4 className="font-medium">Complexo Aquático</h4>
                    <p className="text-sm text-gray-600">Filtração - 20/07</p>
                  </div>
                  <Badge className="bg-blue-100 text-blue-800">Agendada</Badge>
                </div>
                <div className="flex items-center justify-between p-3 border-l-4 border-green-500 bg-green-50">
                  <div>
                    <h4 className="font-medium">Estádio Municipal</h4>
                    <p className="text-sm text-gray-600">Refletores - Concluída</p>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Concluída</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="alertas" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Alertas Ativos</CardTitle>
                <AlertCircle className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground">Requerem atenção</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Alta Prioridade</CardTitle>
                <AlertCircle className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">4</div>
                <p className="text-xs text-muted-foreground">Ação imediata</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Resolvidos</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">28</div>
                <p className="text-xs text-muted-foreground">Este mês</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Alertas Prioritários</CardTitle>
              <CardDescription>Situações que requerem atenção administrativa</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {alertasPrioritarios.map((alerta) => (
                  <div key={alerta.id} className="flex items-start justify-between p-4 border rounded-lg">
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 rounded-full bg-red-500 mt-2"></div>
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-medium">{alerta.titulo}</h4>
                          {getTipoBadge(alerta.tipo)}
                        </div>
                        <p className="text-sm text-gray-600">{alerta.descricao}</p>
                        <p className="text-xs text-gray-500">{alerta.data}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getPrioridadeBadge(alerta.prioridade)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Ações Recomendadas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button variant="outline" className="justify-start h-auto p-4">
                  <div className="flex items-center space-x-3">
                    <PlayCircle className="w-5 h-5 text-green-500" />
                    <div className="text-left">
                      <h4 className="font-medium">Concluir Documentação de Atletas</h4>
                      <p className="text-sm text-gray-600">10 pendências ativas</p>
                    </div>
                  </div>
                </Button>
                <Button variant="outline" className="justify-start h-auto p-4">
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-blue-500" />
                    <div className="text-left">
                      <h4 className="font-medium">Agendar Manutenções</h4>
                      <p className="text-sm text-gray-600">12 instalações pendentes</p>
                    </div>
                  </div>
                </Button>
                <Button variant="outline" className="justify-start h-auto p-4">
                  <div className="flex items-center space-x-3">
                    <Trophy className="w-5 h-5 text-yellow-500" />
                    <div className="text-left">
                      <h4 className="font-medium">Promover Eventos</h4>
                      <p className="text-sm text-gray-600">8 eventos com baixa participação</p>
                    </div>
                  </div>
                </Button>
                <Button variant="outline" className="justify-start h-auto p-4">
                  <div className="flex items-center space-x-3">
                    <DollarSign className="w-5 h-5 text-purple-500" />
                    <div className="text-left">
                      <h4 className="font-medium">Revisar Orçamento</h4>
                      <p className="text-sm text-gray-600">75% executado</p>
                    </div>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}