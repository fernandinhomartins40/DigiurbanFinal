'use client'

import { useState } from 'react'
import { useAdminAuth } from '@/contexts/AdminAuthContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts'
import {
  Users, MessageSquare, Vote, Search, Plus, Edit, Download, Clock, User,
  CheckCircle, AlertCircle, XCircle, Eye, Calendar, Phone, Mail,
  Target, Flag, Award, TrendingUp, Activity, FileText, Megaphone
} from 'lucide-react'

export default function ConsultasPublicasPage() {
  useAdminAuth()

  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('todos')
  const [tipoFilter, setTipoFilter] = useState('todos')
  const [showForm, setShowForm] = useState(false)
  const [editingConsulta, setEditingConsulta] = useState<any>(null)

  const [consultas] = useState([
    {
      id: 1,
      titulo: 'Revisão do Plano Diretor Municipal 2024-2034',
      tipo: 'plano_diretor',
      descricao: 'Consulta pública para revisão do Plano Diretor Municipal com foco em sustentabilidade e crescimento ordenado.',
      status: 'ativa',
      dataInicio: '2024-06-01',
      dataFim: '2024-07-31',
      dataAudiencia: '2024-07-15',
      localAudiencia: 'Câmara Municipal - Plenário',
      participantes: 1247,
      contribuicoes: 89,
      documentos: ['Minuta do Plano', 'Relatório Técnico', 'Mapas de Zoneamento'],
      responsavel: 'Ana Costa',
      categoria: 'planejamento',
      modalidade: 'presencial_online',
      votosFavor: 892,
      votosContra: 234,
      votosAbstencao: 121
    },
    {
      id: 2,
      titulo: 'Projeto de Ciclovia na Avenida Central',
      tipo: 'projeto_viario',
      descricao: 'Consulta sobre a implementação de ciclovia na Avenida Central, conectando o centro aos bairros periféricos.',
      status: 'concluida',
      dataInicio: '2024-05-15',
      dataFim: '2024-06-15',
      dataAudiencia: '2024-06-10',
      localAudiencia: 'Centro Cultural Municipal',
      participantes: 567,
      contribuicoes: 43,
      documentos: ['Projeto Executivo', 'Estudo de Impacto', 'Cronograma'],
      responsavel: 'Carlos Silva',
      categoria: 'mobilidade',
      modalidade: 'presencial',
      votosFavor: 445,
      votosContra: 89,
      votosAbstencao: 33
    },
    {
      id: 3,
      titulo: 'Criação do Parque Linear do Rio Verde',
      tipo: 'area_verde',
      descricao: 'Proposta de criação de parque linear às margens do Rio Verde para preservação ambiental e lazer.',
      status: 'planejada',
      dataInicio: '2024-07-01',
      dataFim: '2024-08-31',
      dataAudiencia: '2024-08-20',
      localAudiencia: 'Escola Municipal do Jardim',
      participantes: 0,
      contribuicoes: 0,
      documentos: ['Estudo Ambiental', 'Projeto Paisagístico', 'Cronograma'],
      responsavel: 'Maria Santos',
      categoria: 'meio_ambiente',
      modalidade: 'online',
      votosFavor: 0,
      votosContra: 0,
      votosAbstencao: 0
    }
  ])

  const [novaConsulta, setNovaConsulta] = useState({
    titulo: '',
    tipo: '',
    descricao: '',
    dataInicio: '',
    dataFim: '',
    dataAudiencia: '',
    localAudiencia: '',
    responsavel: '',
    categoria: '',
    modalidade: '',
    objetivos: ''
  })

  const estatisticasConsultas = [
    { tipo: 'Plano Diretor', realizadas: 3, participantes: 2850, contribuicoes: 156 },
    { tipo: 'Projetos Viários', realizadas: 8, participantes: 1420, contribuicoes: 98 },
    { tipo: 'Áreas Verdes', realizadas: 5, participantes: 890, contribuicoes: 67 },
    { tipo: 'Habitação', realizadas: 4, participantes: 1120, contribuicoes: 78 },
    { tipo: 'Zoneamento', realizadas: 6, participantes: 1580, contribuicoes: 112 },
    { tipo: 'Outros', realizadas: 3, participantes: 340, contribuicoes: 25 }
  ]

  const statusDistribuicao = [
    { name: 'Ativas', value: 6, color: '#22C55E' },
    { name: 'Concluídas', value: 23, color: '#3B82F6' },
    { name: 'Planejadas', value: 8, color: '#F59E0B' },
    { name: 'Arquivadas', value: 4, color: '#6B7280' }
  ]

  const participacaoMensal = [
    { mes: 'Jan', participantes: 234, contribuicoes: 18 },
    { mes: 'Fev', participantes: 189, contribuicoes: 15 },
    { mes: 'Mar', participantes: 567, contribuicoes: 42 },
    { mes: 'Abr', participantes: 423, contribuicoes: 31 },
    { mes: 'Mai', participantes: 678, contribuicoes: 54 },
    { mes: 'Jun', participantes: 892, contribuicoes: 67 }
  ]

  const filteredConsultas = consultas.filter(consulta => {
    const matchesSearch = consulta.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         consulta.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         consulta.responsavel.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'todos' || consulta.status === statusFilter
    const matchesTipo = tipoFilter === 'todos' || consulta.tipo === tipoFilter
    return matchesSearch && matchesStatus && matchesTipo
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setShowForm(false)
    setNovaConsulta({
      titulo: '',
      tipo: '',
      descricao: '',
      dataInicio: '',
      dataFim: '',
      dataAudiencia: '',
      localAudiencia: '',
      responsavel: '',
      categoria: '',
      modalidade: '',
      objetivos: ''
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ativa':
        return <Badge className="bg-green-100 text-green-800">Ativa</Badge>
      case 'concluida':
        return <Badge className="bg-blue-100 text-blue-800">Concluída</Badge>
      case 'planejada':
        return <Badge className="bg-yellow-100 text-yellow-800">Planejada</Badge>
      case 'arquivada':
        return <Badge className="bg-gray-100 text-gray-800">Arquivada</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  const getTipoBadge = (tipo: string) => {
    switch (tipo) {
      case 'plano_diretor':
        return <Badge className="bg-purple-100 text-purple-800"><FileText className="w-3 h-3 mr-1" />Plano Diretor</Badge>
      case 'projeto_viario':
        return <Badge className="bg-blue-100 text-blue-800"><Target className="w-3 h-3 mr-1" />Projeto Viário</Badge>
      case 'area_verde':
        return <Badge className="bg-green-100 text-green-800"><Activity className="w-3 h-3 mr-1" />Área Verde</Badge>
      case 'habitacao':
        return <Badge className="bg-orange-100 text-orange-800"><Users className="w-3 h-3 mr-1" />Habitação</Badge>
      case 'zoneamento':
        return <Badge className="bg-red-100 text-red-800"><Flag className="w-3 h-3 mr-1" />Zoneamento</Badge>
      default:
        return <Badge>{tipo}</Badge>
    }
  }

  const getModalidadeBadge = (modalidade: string) => {
    switch (modalidade) {
      case 'presencial':
        return <Badge className="bg-blue-100 text-blue-800">Presencial</Badge>
      case 'online':
        return <Badge className="bg-green-100 text-green-800">Online</Badge>
      case 'presencial_online':
        return <Badge className="bg-purple-100 text-purple-800">Híbrida</Badge>
      default:
        return <Badge>{modalidade}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Consultas Públicas</h1>
          <p className="text-gray-600">Participação popular em projetos de planejamento urbano</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Nova Consulta
        </Button>
      </div>

      <Tabs defaultValue="visao-geral" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="visao-geral">Visão Geral</TabsTrigger>
          <TabsTrigger value="consultas">Consultas</TabsTrigger>
          <TabsTrigger value="participacao">Participação</TabsTrigger>
          <TabsTrigger value="servicos">Serviços Gerados</TabsTrigger>
        </TabsList>

        <TabsContent value="visao-geral" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total de Consultas</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">41</div>
                <p className="text-xs text-muted-foreground">+8 este ano</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Participantes</CardTitle>
                <MessageSquare className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">8.200</div>
                <p className="text-xs text-muted-foreground">Total de participações</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Contribuições</CardTitle>
                <Vote className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">536</div>
                <p className="text-xs text-muted-foreground">Sugestões recebidas</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Taxa de Aprovação</CardTitle>
                <TrendingUp className="h-4 w-4 text-purple-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">78%</div>
                <p className="text-xs text-muted-foreground">Projetos aprovados</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Consultas por Tipo</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={estatisticasConsultas}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="tipo" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="realizadas" fill="#3B82F6" name="Realizadas" />
                    <Bar dataKey="participantes" fill="#22C55E" name="Participantes" />
                    <Bar dataKey="contribuicoes" fill="#F59E0B" name="Contribuições" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Status das Consultas</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={statusDistribuicao}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${((percent as number) * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {statusDistribuicao.map((entry, index) => (
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
              <CardTitle>Participação Mensal</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={participacaoMensal}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mes" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="participantes" stroke="#3B82F6" name="Participantes" />
                  <Line type="monotone" dataKey="contribuicoes" stroke="#22C55E" name="Contribuições" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="consultas" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Filtros e Busca</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="flex items-center space-x-2">
                  <Search className="w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Buscar consultas..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos os Status</SelectItem>
                    <SelectItem value="ativa">Ativa</SelectItem>
                    <SelectItem value="concluida">Concluída</SelectItem>
                    <SelectItem value="planejada">Planejada</SelectItem>
                    <SelectItem value="arquivada">Arquivada</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={tipoFilter} onValueChange={setTipoFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos os Tipos</SelectItem>
                    <SelectItem value="plano_diretor">Plano Diretor</SelectItem>
                    <SelectItem value="projeto_viario">Projeto Viário</SelectItem>
                    <SelectItem value="area_verde">Área Verde</SelectItem>
                    <SelectItem value="habitacao">Habitação</SelectItem>
                    <SelectItem value="zoneamento">Zoneamento</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" className="flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Exportar
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 gap-4">
            {filteredConsultas.map((consulta) => (
              <Card key={consulta.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Users className="w-8 h-8 text-purple-600" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-3">
                          <h3 className="text-lg font-semibold">{consulta.titulo}</h3>
                          {getStatusBadge(consulta.status)}
                          {getTipoBadge(consulta.tipo)}
                          {getModalidadeBadge(consulta.modalidade)}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>{consulta.dataInicio} a {consulta.dataFim}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <User className="w-4 h-4" />
                            <span>Responsável: {consulta.responsavel}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Megaphone className="w-4 h-4" />
                            <span>Audiência: {consulta.dataAudiencia}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Activity className="w-4 h-4" />
                            <span>Categoria: {consulta.categoria}</span>
                          </div>
                        </div>
                        <div className="text-sm">
                          <p><strong>Descrição:</strong> {consulta.descricao}</p>
                          <p><strong>Local da Audiência:</strong> {consulta.localAudiencia}</p>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">Participantes:</span>
                            <span className="ml-1 font-medium text-blue-600">{consulta.participantes}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Contribuições:</span>
                            <span className="ml-1 font-medium text-green-600">{consulta.contribuicoes}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Votos Favoráveis:</span>
                            <span className="ml-1 font-medium text-green-600">{consulta.votosFavor}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Votos Contrários:</span>
                            <span className="ml-1 font-medium text-red-600">{consulta.votosContra}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline">
                            Documentos: {consulta.documentos.length}
                          </Badge>
                          {consulta.votosAbstencao > 0 && (
                            <Badge variant="outline">
                              Abstenções: {consulta.votosAbstencao}
                            </Badge>
                          )}
                          <Badge variant="outline">
                            Modalidade: {consulta.modalidade}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => setEditingConsulta(consulta)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="participacao" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Engajamento da População</CardTitle>
                <CardDescription>Índices de participação cidadã</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Participação Presencial</h4>
                      <p className="text-sm text-gray-600">Audiências públicas presenciais</p>
                    </div>
                    <Badge className="bg-blue-100 text-blue-800">3.245 pessoas</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Participação Online</h4>
                      <p className="text-sm text-gray-600">Plataforma digital</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800">4.955 pessoas</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Contribuições Aceitas</h4>
                      <p className="text-sm text-gray-600">Sugestões incorporadas</p>
                    </div>
                    <Badge className="bg-purple-100 text-purple-800">312 sugestões</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Ferramentas de Participação</CardTitle>
                <CardDescription>Canais de engajamento utilizados</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Portal Online</span>
                    <Badge className="bg-green-100 text-green-800">100% das consultas</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Audiências Públicas</span>
                    <Badge className="bg-blue-100 text-blue-800">85% das consultas</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Questionários</span>
                    <Badge className="bg-purple-100 text-purple-800">60% das consultas</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Reuniões Setoriais</span>
                    <Badge className="bg-orange-100 text-orange-800">40% das consultas</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Redes Sociais</span>
                    <Badge className="bg-pink-100 text-pink-800">30% das consultas</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Consultas em Destaque</CardTitle>
              <CardDescription>Consultas com maior engajamento público</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border-l-4 border-purple-500 bg-purple-50">
                  <div>
                    <h4 className="font-medium">Revisão do Plano Diretor Municipal</h4>
                    <p className="text-sm text-gray-600">1.247 participantes • 89 contribuições</p>
                  </div>
                  <Badge className="bg-purple-100 text-purple-800">Em Andamento</Badge>
                </div>
                <div className="flex items-center justify-between p-3 border-l-4 border-blue-500 bg-blue-50">
                  <div>
                    <h4 className="font-medium">Projeto de Ciclovia na Avenida Central</h4>
                    <p className="text-sm text-gray-600">567 participantes • 43 contribuições</p>
                  </div>
                  <Badge className="bg-blue-100 text-blue-800">Concluída</Badge>
                </div>
                <div className="flex items-center justify-between p-3 border-l-4 border-green-500 bg-green-50">
                  <div>
                    <h4 className="font-medium">Criação do Parque Linear do Rio Verde</h4>
                    <p className="text-sm text-gray-600">Consulta agendada para julho</p>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Planejada</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="servicos" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Serviços Gerados Automaticamente</CardTitle>
              <CardDescription>
                Baseado nas funcionalidades internas desta página, os seguintes serviços são gerados automaticamente para o catálogo público
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Users className="w-5 h-5 text-purple-500" />
                      <h4 className="font-medium">Participação em Consulta Pública</h4>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      Canal oficial para participação da população em consultas públicas municipais
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        Inscrição em consultas ativas
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        Envio de contribuições
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        Acompanhamento dos resultados
                      </div>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <FileText className="w-5 h-5 text-blue-500" />
                      <h4 className="font-medium">Sugestão para Plano Diretor</h4>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      Canal específico para contribuições relacionadas ao Plano Diretor Municipal
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        Propostas de alteração
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        Sugestões de zoneamento
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        Feedback da população
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Megaphone className="w-5 h-5 text-green-500" />
                      <h4 className="font-medium">Audiência Pública</h4>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      Agendamento e participação em audiências públicas presenciais
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        Inscrição para falar
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        Acompanhamento online
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        Ata da reunião
                      </div>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Vote className="w-5 h-5 text-orange-500" />
                      <h4 className="font-medium">Manifestação de Opinião</h4>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      Sistema de votação e manifestação de opinião sobre projetos municipais
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        Votação eletrônica
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        Justificativa da opinião
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        Resultados em tempo real
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <Separator className="my-6" />

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Integração Bidirecional</h4>
                <p className="text-sm text-blue-700">
                  Todos os serviços acima são automaticamente sincronizados com esta página administrativa.
                  Novas participações realizadas através do catálogo público aparecem aqui para gestão e consolidação,
                  enquanto resultados das consultas são divulgados instantaneamente nos serviços públicos.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>Nova Consulta Pública</CardTitle>
              <CardDescription>Crie uma nova consulta para participação popular</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="tipo">Tipo de Consulta *</Label>
                    <Select value={novaConsulta.tipo} onValueChange={(value) => setNovaConsulta({...novaConsulta, tipo: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="plano_diretor">Plano Diretor</SelectItem>
                        <SelectItem value="projeto_viario">Projeto Viário</SelectItem>
                        <SelectItem value="area_verde">Área Verde</SelectItem>
                        <SelectItem value="habitacao">Habitação</SelectItem>
                        <SelectItem value="zoneamento">Zoneamento</SelectItem>
                        <SelectItem value="outros">Outros</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="categoria">Categoria *</Label>
                    <Select value={novaConsulta.categoria} onValueChange={(value) => setNovaConsulta({...novaConsulta, categoria: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="planejamento">Planejamento</SelectItem>
                        <SelectItem value="mobilidade">Mobilidade</SelectItem>
                        <SelectItem value="meio_ambiente">Meio Ambiente</SelectItem>
                        <SelectItem value="habitacao">Habitação</SelectItem>
                        <SelectItem value="desenvolvimento">Desenvolvimento</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="modalidade">Modalidade *</Label>
                    <Select value={novaConsulta.modalidade} onValueChange={(value) => setNovaConsulta({...novaConsulta, modalidade: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a modalidade" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="presencial">Presencial</SelectItem>
                        <SelectItem value="online">Online</SelectItem>
                        <SelectItem value="presencial_online">Híbrida (Presencial + Online)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="responsavel">Responsável *</Label>
                    <Input
                      id="responsavel"
                      value={novaConsulta.responsavel}
                      onChange={(e) => setNovaConsulta({...novaConsulta, responsavel: e.target.value})}
                      placeholder="Nome do responsável técnico"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="dataInicio">Data de Início *</Label>
                    <Input
                      id="dataInicio"
                      type="date"
                      value={novaConsulta.dataInicio}
                      onChange={(e) => setNovaConsulta({...novaConsulta, dataInicio: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="dataFim">Data de Encerramento *</Label>
                    <Input
                      id="dataFim"
                      type="date"
                      value={novaConsulta.dataFim}
                      onChange={(e) => setNovaConsulta({...novaConsulta, dataFim: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="dataAudiencia">Data da Audiência Pública</Label>
                    <Input
                      id="dataAudiencia"
                      type="date"
                      value={novaConsulta.dataAudiencia}
                      onChange={(e) => setNovaConsulta({...novaConsulta, dataAudiencia: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="localAudiencia">Local da Audiência</Label>
                    <Input
                      id="localAudiencia"
                      value={novaConsulta.localAudiencia}
                      onChange={(e) => setNovaConsulta({...novaConsulta, localAudiencia: e.target.value})}
                      placeholder="Local onde será realizada a audiência"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="titulo">Título da Consulta *</Label>
                  <Input
                    id="titulo"
                    value={novaConsulta.titulo}
                    onChange={(e) => setNovaConsulta({...novaConsulta, titulo: e.target.value})}
                    placeholder="Nome da consulta pública"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="descricao">Descrição *</Label>
                  <Textarea
                    id="descricao"
                    value={novaConsulta.descricao}
                    onChange={(e) => setNovaConsulta({...novaConsulta, descricao: e.target.value})}
                    rows={4}
                    placeholder="Descreva o objetivo e escopo da consulta pública"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="objetivos">Objetivos e Metas</Label>
                  <Textarea
                    id="objetivos"
                    value={novaConsulta.objetivos}
                    onChange={(e) => setNovaConsulta({...novaConsulta, objetivos: e.target.value})}
                    rows={3}
                    placeholder="Defina os objetivos específicos e metas da consulta"
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit">Criar Consulta</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}