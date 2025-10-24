'use client'

import { useState } from 'react'
import { useAdminAuth } from '@/hooks/useAdminAuth'
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
  Building2, MapPin, FileText, User, Clock, Search, Plus, Edit, Download,
  Phone, Mail, Calendar, CheckCircle, AlertCircle, XCircle, Target,
  Zap, TrendingUp, Activity, Users, Star, Award, Filter, Map
} from 'lucide-react'

export default function AtendimentosPlanejamentoPage() {
  useAdminAuth()

  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('todos')
  const [tipoFilter, setTipoFilter] = useState('todos')
  const [showForm, setShowForm] = useState(false)
  const [editingAtendimento, setEditingAtendimento] = useState<any>(null)

  const [atendimentos] = useState([
    {
      id: 1,
      protocolo: 'URB-2024-001',
      cidadao: 'João Silva Santos',
      cpf: '123.456.789-01',
      telefone: '(11) 98765-4321',
      email: 'joao.silva@email.com',
      tipo: 'informacoes_urbanisticas',
      assunto: 'Consulta sobre zoneamento residencial',
      descricao: 'Cidadão deseja saber sobre possibilidade de construção em lote residencial no bairro Centro',
      endereco: 'Rua das Flores, 123 - Centro',
      status: 'em_andamento',
      prioridade: 'media',
      dataAbertura: '2024-06-20',
      dataVencimento: '2024-06-27',
      responsavel: 'Ana Costa',
      observacoes: 'Aguardando análise do setor de zoneamento',
      categoria: 'consultoria',
      valor: 0,
      documentos: ['RG', 'CPF', 'Escritura do lote']
    },
    {
      id: 2,
      protocolo: 'URB-2024-002',
      cidadao: 'Maria Oliveira Costa',
      cpf: '987.654.321-09',
      telefone: '(11) 99876-5432',
      email: 'maria.costa@email.com',
      tipo: 'orientacao_construcao',
      assunto: 'Orientações para construção residencial',
      descricao: 'Solicitação de orientações técnicas para início de construção de casa unifamiliar',
      endereco: 'Av. Principal, 456 - Jardim',
      status: 'concluido',
      prioridade: 'alta',
      dataAbertura: '2024-06-18',
      dataVencimento: '2024-06-25',
      responsavel: 'Pedro Lima',
      observacoes: 'Orientações fornecidas. Encaminhado para setor de aprovação.',
      categoria: 'orientacao',
      valor: 0,
      documentos: ['RG', 'CPF', 'Projeto arquitetônico']
    },
    {
      id: 3,
      protocolo: 'URB-2024-003',
      cidadao: 'Carlos Rodrigues Lima',
      cpf: '456.789.123-45',
      telefone: '(11) 97654-3210',
      email: 'carlos.lima@email.com',
      tipo: 'consulta_zoneamento',
      assunto: 'Verificação de zoneamento comercial',
      descricao: 'Empresário deseja verificar se pode abrir comércio em imóvel na Rua dos Esportes',
      endereco: 'Rua dos Esportes, 789 - Vila Nova',
      status: 'pendente',
      prioridade: 'baixa',
      dataAbertura: '2024-06-22',
      dataVencimento: '2024-06-29',
      responsavel: 'Ana Costa',
      observacoes: 'Aguardando documentação complementar do solicitante',
      categoria: 'licenciamento',
      valor: 50,
      documentos: ['RG', 'CPF', 'CNPJ']
    }
  ])

  const [novoAtendimento, setNovoAtendimento] = useState({
    cidadao: '',
    cpf: '',
    telefone: '',
    email: '',
    tipo: '',
    assunto: '',
    descricao: '',
    endereco: '',
    prioridade: '',
    categoria: '',
    observacoes: ''
  })

  const estatisticasAtendimentos = [
    { tipo: 'Informações Urbanísticas', quantidade: 45, resolvidos: 38 },
    { tipo: 'Orientação Construção', quantidade: 32, resolvidos: 28 },
    { tipo: 'Consulta Zoneamento', quantidade: 28, resolvidos: 25 },
    { tipo: 'Apoio Técnico', quantidade: 22, resolvidos: 18 },
    { tipo: 'Orientação Licenciamento', quantidade: 18, resolvidos: 15 },
    { tipo: 'Informações Gerais', quantidade: 15, resolvidos: 12 }
  ]

  const statusDistribuicao = [
    { name: 'Concluídos', value: 136, color: '#22C55E' },
    { name: 'Em Andamento', value: 24, color: '#3B82F6' },
    { name: 'Pendentes', value: 8, color: '#F59E0B' },
    { name: 'Cancelados', value: 3, color: '#EF4444' }
  ]

  const atendimentosMensais = [
    { mes: 'Jan', atendimentos: 28, resolvidos: 25 },
    { mes: 'Fev', atendimentos: 32, resolvidos: 29 },
    { mes: 'Mar', atendimentos: 35, resolvidos: 31 },
    { mes: 'Abr', atendimentos: 30, resolvidos: 28 },
    { mes: 'Mai', atendimentos: 38, resolvidos: 35 },
    { mes: 'Jun', atendimentos: 42, resolvidos: 38 }
  ]

  const filteredAtendimentos = atendimentos.filter(atendimento => {
    const matchesSearch = atendimento.cidadao.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         atendimento.protocolo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         atendimento.assunto.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'todos' || atendimento.status === statusFilter
    const matchesTipo = tipoFilter === 'todos' || atendimento.tipo === tipoFilter
    return matchesSearch && matchesStatus && matchesTipo
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setShowForm(false)
    setNovoAtendimento({
      cidadao: '',
      cpf: '',
      telefone: '',
      email: '',
      tipo: '',
      assunto: '',
      descricao: '',
      endereco: '',
      prioridade: '',
      categoria: '',
      observacoes: ''
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'concluido':
        return <Badge className="bg-green-100 text-green-800">Concluído</Badge>
      case 'em_andamento':
        return <Badge className="bg-blue-100 text-blue-800">Em Andamento</Badge>
      case 'pendente':
        return <Badge className="bg-yellow-100 text-yellow-800">Pendente</Badge>
      case 'cancelado':
        return <Badge className="bg-red-100 text-red-800">Cancelado</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  const getPrioridadeBadge = (prioridade: string) => {
    switch (prioridade) {
      case 'alta':
        return <Badge className="bg-red-100 text-red-800"><AlertCircle className="w-3 h-3 mr-1" />Alta</Badge>
      case 'media':
        return <Badge className="bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3 mr-1" />Média</Badge>
      case 'baixa':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Baixa</Badge>
      default:
        return <Badge>{prioridade}</Badge>
    }
  }

  const getTipoBadge = (tipo: string) => {
    switch (tipo) {
      case 'informacoes_urbanisticas':
        return <Badge className="bg-blue-100 text-blue-800"><Building2 className="w-3 h-3 mr-1" />Informações Urbanísticas</Badge>
      case 'orientacao_construcao':
        return <Badge className="bg-purple-100 text-purple-800"><Target className="w-3 h-3 mr-1" />Orientação Construção</Badge>
      case 'consulta_zoneamento':
        return <Badge className="bg-green-100 text-green-800"><Map className="w-3 h-3 mr-1" />Consulta Zoneamento</Badge>
      case 'apoio_tecnico':
        return <Badge className="bg-orange-100 text-orange-800"><Star className="w-3 h-3 mr-1" />Apoio Técnico</Badge>
      default:
        return <Badge>{tipo}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Atendimentos - Planejamento Urbano</h1>
          <p className="text-gray-600">Central de atendimentos urbanísticos e orientações técnicas</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Novo Atendimento
        </Button>
      </div>

      <Tabs defaultValue="visao-geral" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="visao-geral">Visão Geral</TabsTrigger>
          <TabsTrigger value="atendimentos">Atendimentos</TabsTrigger>
          <TabsTrigger value="relatorios">Relatórios</TabsTrigger>
          <TabsTrigger value="servicos">Serviços Gerados</TabsTrigger>
        </TabsList>

        <TabsContent value="visao-geral" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total de Atendimentos</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">171</div>
                <p className="text-xs text-muted-foreground">+12 este mês</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Concluídos</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">136</div>
                <p className="text-xs text-muted-foreground">79% do total</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Em Andamento</CardTitle>
                <Clock className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">24</div>
                <p className="text-xs text-muted-foreground">14% do total</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tempo Médio</CardTitle>
                <TrendingUp className="h-4 w-4 text-purple-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">5.2</div>
                <p className="text-xs text-muted-foreground">dias para resolução</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Atendimentos por Tipo</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={estatisticasAtendimentos}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="tipo" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="quantidade" fill="#3B82F6" name="Total" />
                    <Bar dataKey="resolvidos" fill="#22C55E" name="Resolvidos" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Distribuição por Status</CardTitle>
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
              <CardTitle>Evolução Mensal de Atendimentos</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={atendimentosMensais}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mes" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="atendimentos" stroke="#3B82F6" name="Atendimentos" />
                  <Line type="monotone" dataKey="resolvidos" stroke="#22C55E" name="Resolvidos" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="atendimentos" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Filtros e Busca</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="flex items-center space-x-2">
                  <Search className="w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Buscar atendimentos..."
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
                    <SelectItem value="concluido">Concluído</SelectItem>
                    <SelectItem value="em_andamento">Em Andamento</SelectItem>
                    <SelectItem value="pendente">Pendente</SelectItem>
                    <SelectItem value="cancelado">Cancelado</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={tipoFilter} onValueChange={setTipoFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos os Tipos</SelectItem>
                    <SelectItem value="informacoes_urbanisticas">Informações Urbanísticas</SelectItem>
                    <SelectItem value="orientacao_construcao">Orientação Construção</SelectItem>
                    <SelectItem value="consulta_zoneamento">Consulta Zoneamento</SelectItem>
                    <SelectItem value="apoio_tecnico">Apoio Técnico</SelectItem>
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
            {filteredAtendimentos.map((atendimento) => (
              <Card key={atendimento.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Building2 className="w-8 h-8 text-blue-600" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-3">
                          <h3 className="text-lg font-semibold">{atendimento.protocolo}</h3>
                          {getStatusBadge(atendimento.status)}
                          {getPrioridadeBadge(atendimento.prioridade)}
                          {getTipoBadge(atendimento.tipo)}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                          <div className="flex items-center space-x-1">
                            <User className="w-4 h-4" />
                            <span>{atendimento.cidadao}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Phone className="w-4 h-4" />
                            <span>{atendimento.telefone}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Mail className="w-4 h-4" />
                            <span>{atendimento.email}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>Aberto em {atendimento.dataAbertura}</span>
                          </div>
                        </div>
                        <div className="text-sm">
                          <p><strong>Assunto:</strong> {atendimento.assunto}</p>
                          <p><strong>Descrição:</strong> {atendimento.descricao}</p>
                          <p><strong>Endereço:</strong> {atendimento.endereco}</p>
                          <p><strong>Responsável:</strong> {atendimento.responsavel}</p>
                          {atendimento.observacoes && (
                            <p><strong>Observações:</strong> {atendimento.observacoes}</p>
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline">
                            Categoria: {atendimento.categoria}
                          </Badge>
                          {atendimento.valor > 0 && (
                            <Badge variant="outline">
                              Valor: R$ {atendimento.valor}
                            </Badge>
                          )}
                          <Badge variant="outline">
                            Documentos: {atendimento.documentos.length}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm" onClick={() => setEditingAtendimento(atendimento)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="relatorios" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Indicadores de Performance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Taxa de Resolução</span>
                  <Badge className="bg-green-100 text-green-800">79%</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Tempo Médio de Resposta</span>
                  <Badge className="bg-blue-100 text-blue-800">2.3 dias</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Satisfação do Cidadão</span>
                  <Badge className="bg-purple-100 text-purple-800">4.2/5</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Atendimentos Pendentes</span>
                  <Badge className="bg-yellow-100 text-yellow-800">8</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tipos de Atendimento Mais Solicitados</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Informações Urbanísticas</span>
                  <Badge className="bg-blue-100 text-blue-800">45</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Orientação para Construção</span>
                  <Badge className="bg-purple-100 text-purple-800">32</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Consulta de Zoneamento</span>
                  <Badge className="bg-green-100 text-green-800">28</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Apoio Técnico</span>
                  <Badge className="bg-orange-100 text-orange-800">22</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
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
                      <Building2 className="w-5 h-5 text-blue-500" />
                      <h4 className="font-medium">Informações Urbanísticas</h4>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      Orientações sobre zoneamento, uso do solo e regulamentações urbanísticas municipais
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        Consulta sobre zoneamento
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        Informações de uso do solo
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        Orientações sobre recuos e índices
                      </div>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Target className="w-5 h-5 text-purple-500" />
                      <h4 className="font-medium">Orientação para Construção</h4>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      Orientações técnicas e legais para início de construções e reformas
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        Documentação necessária
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        Procedimentos legais
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        Cronograma de aprovação
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Map className="w-5 h-5 text-green-500" />
                      <h4 className="font-medium">Consulta de Zoneamento</h4>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      Verificação de zoneamento específico de lotes e imóveis municipais
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        Verificação de zona do lote
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        Usos permitidos
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        Restrições aplicáveis
                      </div>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Star className="w-5 h-5 text-orange-500" />
                      <h4 className="font-medium">Apoio Técnico</h4>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      Suporte técnico especializado para questões urbanísticas complexas
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        Análise técnica especializada
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        Parecer técnico
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        Acompanhamento processual
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
                  Novos atendimentos realizados através do catálogo público aparecem aqui para gestão,
                  enquanto alterações administrativas são refletidas instantaneamente nos serviços públicos.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>Novo Atendimento Urbanístico</CardTitle>
              <CardDescription>Registre um novo atendimento para orientação urbanística</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="cidadao">Nome do Cidadão *</Label>
                    <Input
                      id="cidadao"
                      value={novoAtendimento.cidadao}
                      onChange={(e) => setNovoAtendimento({...novoAtendimento, cidadao: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="cpf">CPF *</Label>
                    <Input
                      id="cpf"
                      value={novoAtendimento.cpf}
                      onChange={(e) => setNovoAtendimento({...novoAtendimento, cpf: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="telefone">Telefone *</Label>
                    <Input
                      id="telefone"
                      value={novoAtendimento.telefone}
                      onChange={(e) => setNovoAtendimento({...novoAtendimento, telefone: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={novoAtendimento.email}
                      onChange={(e) => setNovoAtendimento({...novoAtendimento, email: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="tipo">Tipo de Atendimento *</Label>
                    <Select value={novoAtendimento.tipo} onValueChange={(value) => setNovoAtendimento({...novoAtendimento, tipo: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="informacoes_urbanisticas">Informações Urbanísticas</SelectItem>
                        <SelectItem value="orientacao_construcao">Orientação para Construção</SelectItem>
                        <SelectItem value="consulta_zoneamento">Consulta de Zoneamento</SelectItem>
                        <SelectItem value="apoio_tecnico">Apoio Técnico</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="prioridade">Prioridade *</Label>
                    <Select value={novoAtendimento.prioridade} onValueChange={(value) => setNovoAtendimento({...novoAtendimento, prioridade: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a prioridade" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="baixa">Baixa</SelectItem>
                        <SelectItem value="media">Média</SelectItem>
                        <SelectItem value="alta">Alta</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="endereco">Endereço do Imóvel</Label>
                  <Input
                    id="endereco"
                    value={novoAtendimento.endereco}
                    onChange={(e) => setNovoAtendimento({...novoAtendimento, endereco: e.target.value})}
                    placeholder="Endereço completo do imóvel em questão"
                  />
                </div>
                <div>
                  <Label htmlFor="assunto">Assunto *</Label>
                  <Input
                    id="assunto"
                    value={novoAtendimento.assunto}
                    onChange={(e) => setNovoAtendimento({...novoAtendimento, assunto: e.target.value})}
                    placeholder="Resumo do que está sendo solicitado"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="descricao">Descrição Detalhada *</Label>
                  <Textarea
                    id="descricao"
                    value={novoAtendimento.descricao}
                    onChange={(e) => setNovoAtendimento({...novoAtendimento, descricao: e.target.value})}
                    rows={3}
                    placeholder="Descreva detalhadamente a solicitação do cidadão"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="observacoes">Observações</Label>
                  <Textarea
                    id="observacoes"
                    value={novoAtendimento.observacoes}
                    onChange={(e) => setNovoAtendimento({...novoAtendimento, observacoes: e.target.value})}
                    rows={2}
                    placeholder="Observações adicionais sobre o atendimento"
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit">Registrar Atendimento</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}