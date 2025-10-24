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
  Calendar, MapPin, Users, Trophy, Clock, Search, Plus, Edit, Download,
  User, Phone, Mail, Target, Star, Zap, Activity, TrendingUp, FileText,
  CheckCircle, AlertCircle, DollarSign, Camera, Flag, Award, PartyPopper
} from 'lucide-react'

export default function EventosEsportivosPage() {
  useAdminAuth()

  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('todos')
  const [tipoFilter, setTipoFilter] = useState('todos')
  const [showForm, setShowForm] = useState(false)
  const [editingEvento, setEditingEvento] = useState<any>(null)

  const [eventos] = useState([
    {
      id: 1,
      nome: 'Copa Municipal de Futebol 2024',
      tipo: 'campeonato',
      modalidade: 'Futebol',
      dataInicio: '2024-07-15',
      dataFim: '2024-08-30',
      local: 'Estádio Municipal',
      endereco: 'Av. dos Esportes, 1000 - Centro',
      organizador: 'Secretaria de Esportes',
      responsavel: 'João Silva',
      telefone: '(11) 98765-4321',
      email: 'copa.futebol@esportes.gov.br',
      status: 'ativo',
      categoria: 'adulto',
      participantes: 320,
      maxParticipantes: 400,
      inscricoes: 'abertas',
      investimento: 'Gratuito',
      premiacao: 'Troféu + R$ 5.000',
      patrocinadores: 3,
      orcamento: 25000,
      publicoEsperado: 1500
    },
    {
      id: 2,
      nome: 'Festival de Natação Infantil',
      tipo: 'festival',
      modalidade: 'Natação',
      dataInicio: '2024-06-20',
      dataFim: '2024-06-22',
      local: 'Complexo Aquático Municipal',
      endereco: 'Rua das Águas, 500 - Jardim',
      organizador: 'Federação Aquática',
      responsavel: 'Maria Costa',
      telefone: '(11) 99876-5432',
      email: 'festival.natacao@esportes.gov.br',
      status: 'concluido',
      categoria: 'infantil',
      participantes: 180,
      maxParticipantes: 200,
      inscricoes: 'encerradas',
      investimento: 'R$ 30 por participante',
      premiacao: 'Medalhas e troféus',
      patrocinadores: 2,
      orcamento: 15000,
      publicoEsperado: 800
    },
    {
      id: 3,
      nome: 'Maratona Urbana da Cidade',
      tipo: 'corrida',
      modalidade: 'Atletismo',
      dataInicio: '2024-09-15',
      dataFim: '2024-09-15',
      local: 'Centro da Cidade',
      endereco: 'Largada: Praça Central - Chegada: Parque Municipal',
      organizador: 'Associação de Atletismo',
      responsavel: 'Pedro Lima',
      telefone: '(11) 97654-3210',
      email: 'maratona@esportes.gov.br',
      status: 'planejado',
      categoria: 'todos',
      participantes: 0,
      maxParticipantes: 1000,
      inscricoes: 'em_breve',
      investimento: 'R$ 50 inscrição',
      premiacao: 'Medalhas categorias + R$ 10.000',
      patrocinadores: 5,
      orcamento: 45000,
      publicoEsperado: 3000
    }
  ])

  const [novoEvento, setNovoEvento] = useState({
    nome: '',
    tipo: '',
    modalidade: '',
    dataInicio: '',
    dataFim: '',
    local: '',
    endereco: '',
    responsavel: '',
    telefone: '',
    email: '',
    categoria: '',
    maxParticipantes: '',
    investimento: '',
    premiacao: '',
    orcamento: '',
    publicoEsperado: '',
    descricao: ''
  })

  const estatisticasEventos = [
    { tipo: 'Campeonatos', eventos: 12, participantes: 1890 },
    { tipo: 'Festivais', eventos: 8, participantes: 980 },
    { tipo: 'Corridas', eventos: 6, participantes: 2100 },
    { tipo: 'Torneios', eventos: 10, participantes: 1560 },
    { tipo: 'Workshops', eventos: 4, participantes: 240 },
    { tipo: 'Clinics', eventos: 3, participantes: 120 }
  ]

  const statusDistribuicao = [
    { name: 'Ativos', value: 15, color: '#22C55E' },
    { name: 'Planejados', value: 8, color: '#3B82F6' },
    { name: 'Concluídos', value: 20, color: '#6B7280' }
  ]

  const participacaoMensal = [
    { mes: 'Jan', eventos: 4, participantes: 580 },
    { mes: 'Fev', eventos: 3, participantes: 420 },
    { mes: 'Mar', eventos: 5, participantes: 750 },
    { mes: 'Abr', eventos: 4, participantes: 680 },
    { mes: 'Mai', eventos: 6, participantes: 920 },
    { mes: 'Jun', eventos: 7, participantes: 1100 }
  ]

  const filteredEventos = eventos.filter(evento => {
    const matchesSearch = evento.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         evento.modalidade.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         evento.responsavel.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'todos' || evento.status === statusFilter
    const matchesTipo = tipoFilter === 'todos' || evento.tipo === tipoFilter
    return matchesSearch && matchesStatus && matchesTipo
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setShowForm(false)
    setNovoEvento({
      nome: '',
      tipo: '',
      modalidade: '',
      dataInicio: '',
      dataFim: '',
      local: '',
      endereco: '',
      responsavel: '',
      telefone: '',
      email: '',
      categoria: '',
      maxParticipantes: '',
      investimento: '',
      premiacao: '',
      orcamento: '',
      publicoEsperado: '',
      descricao: ''
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ativo':
        return <Badge className="bg-green-100 text-green-800">Em Andamento</Badge>
      case 'planejado':
        return <Badge className="bg-blue-100 text-blue-800">Planejado</Badge>
      case 'concluido':
        return <Badge className="bg-gray-100 text-gray-800">Concluído</Badge>
      case 'cancelado':
        return <Badge className="bg-red-100 text-red-800">Cancelado</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  const getTipoBadge = (tipo: string) => {
    switch (tipo) {
      case 'campeonato':
        return <Badge className="bg-yellow-100 text-yellow-800"><Trophy className="w-3 h-3 mr-1" />Campeonato</Badge>
      case 'festival':
        return <Badge className="bg-purple-100 text-purple-800"><PartyPopper className="w-3 h-3 mr-1" />Festival</Badge>
      case 'corrida':
        return <Badge className="bg-orange-100 text-orange-800"><Flag className="w-3 h-3 mr-1" />Corrida</Badge>
      case 'torneio':
        return <Badge className="bg-blue-100 text-blue-800"><Award className="w-3 h-3 mr-1" />Torneio</Badge>
      default:
        return <Badge>{tipo}</Badge>
    }
  }

  const getInscricoesBadge = (inscricoes: string) => {
    switch (inscricoes) {
      case 'abertas':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Abertas</Badge>
      case 'encerradas':
        return <Badge className="bg-red-100 text-red-800"><AlertCircle className="w-3 h-3 mr-1" />Encerradas</Badge>
      case 'em_breve':
        return <Badge className="bg-blue-100 text-blue-800"><Clock className="w-3 h-3 mr-1" />Em Breve</Badge>
      default:
        return <Badge>{inscricoes}</Badge>
    }
  }

  const getTaxaOcupacao = (participantes: number, maxParticipantes: number) => {
    const taxa = (participantes / maxParticipantes) * 100
    if (taxa >= 90) return 'text-red-600'
    if (taxa >= 70) return 'text-yellow-600'
    return 'text-green-600'
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Eventos Esportivos</h1>
          <p className="text-gray-600">Gestão completa de eventos e competições municipais</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Novo Evento
        </Button>
      </div>

      <Tabs defaultValue="visao-geral" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="visao-geral">Visão Geral</TabsTrigger>
          <TabsTrigger value="eventos">Eventos</TabsTrigger>
          <TabsTrigger value="organizacao">Organização</TabsTrigger>
          <TabsTrigger value="servicos">Serviços Gerados</TabsTrigger>
        </TabsList>

        <TabsContent value="visao-geral" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total de Eventos</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">43</div>
                <p className="text-xs text-muted-foreground">+7 este mês</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Participantes</CardTitle>
                <Users className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">6.890</div>
                <p className="text-xs text-muted-foreground">920 este mês</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Orçamento Total</CardTitle>
                <DollarSign className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">R$ 385k</div>
                <p className="text-xs text-muted-foreground">+R$ 45k este mês</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Modalidades</CardTitle>
                <Activity className="h-4 w-4 text-purple-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">18</div>
                <p className="text-xs text-muted-foreground">Diferentes esportes</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Eventos por Tipo</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={estatisticasEventos}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="tipo" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="eventos" fill="#3B82F6" name="Eventos" />
                    <Bar dataKey="participantes" fill="#10B981" name="Participantes" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Status dos Eventos</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={statusDistribuicao}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={(({ name, percent }: { name: string; percent: number }) => `${name} ${(percent * 100).toFixed(0)}%`) as any}
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
                  <Line type="monotone" dataKey="eventos" stroke="#3B82F6" name="Eventos" />
                  <Line type="monotone" dataKey="participantes" stroke="#10B981" name="Participantes" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="eventos" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Filtros e Busca</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="flex items-center space-x-2">
                  <Search className="w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Buscar eventos..."
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
                    <SelectItem value="ativo">Em Andamento</SelectItem>
                    <SelectItem value="planejado">Planejado</SelectItem>
                    <SelectItem value="concluido">Concluído</SelectItem>
                    <SelectItem value="cancelado">Cancelado</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={tipoFilter} onValueChange={setTipoFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos os Tipos</SelectItem>
                    <SelectItem value="campeonato">Campeonato</SelectItem>
                    <SelectItem value="festival">Festival</SelectItem>
                    <SelectItem value="corrida">Corrida</SelectItem>
                    <SelectItem value="torneio">Torneio</SelectItem>
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
            {filteredEventos.map((evento) => (
              <Card key={evento.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Calendar className="w-8 h-8 text-purple-600" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-3">
                          <h3 className="text-lg font-semibold">{evento.nome}</h3>
                          {getStatusBadge(evento.status)}
                          {getTipoBadge(evento.tipo)}
                          {getInscricoesBadge(evento.inscricoes)}
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                          <div className="flex items-center space-x-1">
                            <Activity className="w-4 h-4" />
                            <span>{evento.modalidade}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>{evento.dataInicio} a {evento.dataFim}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MapPin className="w-4 h-4" />
                            <span>{evento.local}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <User className="w-4 h-4" />
                            <span>{evento.responsavel}</span>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                          <div className="flex items-center space-x-1">
                            <Phone className="w-4 h-4" />
                            <span>{evento.telefone}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Mail className="w-4 h-4" />
                            <span>{evento.email}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Users className="w-4 h-4" />
                            <span className={getTaxaOcupacao(evento.participantes, evento.maxParticipantes)}>
                              {evento.participantes}/{evento.maxParticipantes} participantes
                            </span>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">Categoria:</span>
                            <span className="ml-1 font-medium">{evento.categoria}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Investimento:</span>
                            <span className="ml-1 font-medium">{evento.investimento}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Orçamento:</span>
                            <span className="ml-1 font-medium">R$ {evento.orcamento.toLocaleString()}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Patrocinadores:</span>
                            <span className="ml-1 font-medium">{evento.patrocinadores}</span>
                          </div>
                        </div>
                        <div className="text-sm">
                          <p><strong>Premiação:</strong> {evento.premiacao}</p>
                          <p><strong>Público Esperado:</strong> {evento.publicoEsperado} pessoas</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm" onClick={() => setEditingEvento(evento)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="organizacao" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Equipe de Organização</CardTitle>
                <CardDescription>Coordenação e logística dos eventos</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Eventos em Andamento</h4>
                      <p className="text-sm text-gray-600">Precisam acompanhamento</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800">15</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Eventos na Fase de Planejamento</h4>
                      <p className="text-sm text-gray-600">Em desenvolvimento</p>
                    </div>
                    <Badge className="bg-blue-100 text-blue-800">8</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Propostas de Eventos</h4>
                      <p className="text-sm text-gray-600">Aguardando aprovação</p>
                    </div>
                    <Badge className="bg-yellow-100 text-yellow-800">12</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recursos e Infraestrutura</CardTitle>
                <CardDescription>Controle de equipamentos e locais</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Locais Disponíveis</span>
                    <Badge className="bg-green-100 text-green-800">18</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Locais Reservados</span>
                    <Badge className="bg-yellow-100 text-yellow-800">8</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Equipamentos Disponíveis</span>
                    <Badge className="bg-green-100 text-green-800">95%</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Equipe de Apoio</span>
                    <Badge className="bg-blue-100 text-blue-800">25 pessoas</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Parceiros Ativos</span>
                    <Badge className="bg-purple-100 text-purple-800">15</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Ações Rápidas - Organização</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
                  <Calendar className="w-6 h-6" />
                  <span className="text-sm">Agendar Local</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
                  <Users className="w-6 h-6" />
                  <span className="text-sm">Gerenciar Equipe</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
                  <DollarSign className="w-6 h-6" />
                  <span className="text-sm">Controle Orçamentário</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
                  <Trophy className="w-6 h-6" />
                  <span className="text-sm">Premiações</span>
                </Button>
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
                      <Calendar className="w-5 h-5 text-blue-500" />
                      <h4 className="font-medium">Inscrições em Eventos</h4>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      Sistema completo de inscrições online para todos os eventos esportivos municipais
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        Consulta de eventos disponíveis
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        Inscrição online com pagamento
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        Confirmação e acompanhamento
                      </div>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Trophy className="w-5 h-5 text-yellow-500" />
                      <h4 className="font-medium">Resultados e Classificações</h4>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      Portal público com resultados em tempo real e classificações finais
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        Resultados em tempo real
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        Classificações atualizadas
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        Estatísticas detalhadas
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Camera className="w-5 h-5 text-purple-500" />
                      <h4 className="font-medium">Galeria de Eventos</h4>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      Galeria automática com fotos e vídeos dos eventos realizados
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        Upload automático de mídia
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        Organização por evento
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        Download e compartilhamento
                      </div>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <MapPin className="w-5 h-5 text-green-500" />
                      <h4 className="font-medium">Localização e Transporte</h4>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      Informações completas sobre locais e opções de transporte público
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        Mapas interativos
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        Rotas de transporte público
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        Informações de estacionamento
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
                  Novas inscrições realizadas através do catálogo público aparecem aqui para gestão,
                  enquanto alterações administrativas são refletidas instantaneamente nos serviços públicos.
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
              <CardTitle>Novo Evento Esportivo</CardTitle>
              <CardDescription>Cadastre um novo evento no sistema</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="nome">Nome do Evento *</Label>
                    <Input
                      id="nome"
                      value={novoEvento.nome}
                      onChange={(e) => setNovoEvento({...novoEvento, nome: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="tipo">Tipo de Evento *</Label>
                    <Select value={novoEvento.tipo} onValueChange={(value) => setNovoEvento({...novoEvento, tipo: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="campeonato">Campeonato</SelectItem>
                        <SelectItem value="festival">Festival</SelectItem>
                        <SelectItem value="corrida">Corrida</SelectItem>
                        <SelectItem value="torneio">Torneio</SelectItem>
                        <SelectItem value="workshop">Workshop</SelectItem>
                        <SelectItem value="clinic">Clinic</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="modalidade">Modalidade *</Label>
                    <Select value={novoEvento.modalidade} onValueChange={(value) => setNovoEvento({...novoEvento, modalidade: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a modalidade" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Futebol">Futebol</SelectItem>
                        <SelectItem value="Natação">Natação</SelectItem>
                        <SelectItem value="Voleibol">Voleibol</SelectItem>
                        <SelectItem value="Basquete">Basquete</SelectItem>
                        <SelectItem value="Atletismo">Atletismo</SelectItem>
                        <SelectItem value="Tênis">Tênis</SelectItem>
                        <SelectItem value="Múltiplas">Múltiplas Modalidades</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="categoria">Categoria *</Label>
                    <Select value={novoEvento.categoria} onValueChange={(value) => setNovoEvento({...novoEvento, categoria: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="infantil">Infantil</SelectItem>
                        <SelectItem value="juvenil">Juvenil</SelectItem>
                        <SelectItem value="adulto">Adulto</SelectItem>
                        <SelectItem value="master">Master</SelectItem>
                        <SelectItem value="todos">Todas as Idades</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="dataInicio">Data de Início *</Label>
                    <Input
                      id="dataInicio"
                      type="date"
                      value={novoEvento.dataInicio}
                      onChange={(e) => setNovoEvento({...novoEvento, dataInicio: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="dataFim">Data de Término *</Label>
                    <Input
                      id="dataFim"
                      type="date"
                      value={novoEvento.dataFim}
                      onChange={(e) => setNovoEvento({...novoEvento, dataFim: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="local">Local do Evento *</Label>
                    <Input
                      id="local"
                      value={novoEvento.local}
                      onChange={(e) => setNovoEvento({...novoEvento, local: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="responsavel">Responsável *</Label>
                    <Input
                      id="responsavel"
                      value={novoEvento.responsavel}
                      onChange={(e) => setNovoEvento({...novoEvento, responsavel: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="telefone">Telefone *</Label>
                    <Input
                      id="telefone"
                      value={novoEvento.telefone}
                      onChange={(e) => setNovoEvento({...novoEvento, telefone: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={novoEvento.email}
                      onChange={(e) => setNovoEvento({...novoEvento, email: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="maxParticipantes">Máximo de Participantes</Label>
                    <Input
                      id="maxParticipantes"
                      type="number"
                      value={novoEvento.maxParticipantes}
                      onChange={(e) => setNovoEvento({...novoEvento, maxParticipantes: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="orcamento">Orçamento (R$)</Label>
                    <Input
                      id="orcamento"
                      type="number"
                      value={novoEvento.orcamento}
                      onChange={(e) => setNovoEvento({...novoEvento, orcamento: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="publicoEsperado">Público Esperado</Label>
                    <Input
                      id="publicoEsperado"
                      type="number"
                      value={novoEvento.publicoEsperado}
                      onChange={(e) => setNovoEvento({...novoEvento, publicoEsperado: e.target.value})}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="endereco">Endereço Completo *</Label>
                  <Input
                    id="endereco"
                    value={novoEvento.endereco}
                    onChange={(e) => setNovoEvento({...novoEvento, endereco: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="investimento">Taxa de Inscrição</Label>
                  <Input
                    id="investimento"
                    value={novoEvento.investimento}
                    onChange={(e) => setNovoEvento({...novoEvento, investimento: e.target.value})}
                    placeholder="Ex: Gratuito, R$ 50"
                  />
                </div>
                <div>
                  <Label htmlFor="premiacao">Premiação</Label>
                  <Input
                    id="premiacao"
                    value={novoEvento.premiacao}
                    onChange={(e) => setNovoEvento({...novoEvento, premiacao: e.target.value})}
                    placeholder="Ex: Troféus e medalhas, R$ 5.000"
                  />
                </div>
                <div>
                  <Label htmlFor="descricao">Descrição do Evento</Label>
                  <Textarea
                    id="descricao"
                    value={novoEvento.descricao}
                    onChange={(e) => setNovoEvento({...novoEvento, descricao: e.target.value})}
                    rows={3}
                    placeholder="Descrição detalhada do evento, regulamentos, etc."
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit">Cadastrar Evento</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}