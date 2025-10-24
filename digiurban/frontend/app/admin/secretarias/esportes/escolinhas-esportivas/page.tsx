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
  Users, GraduationCap, Calendar, MapPin, Clock, Search, Plus, Edit, Download,
  User, Phone, Mail, Target, Award, Star, Activity, TrendingUp, FileText,
  CheckCircle, AlertCircle, UserCheck, School, Zap, Heart, Filter
} from 'lucide-react'

export default function EscolinhasEsportivasPage() {
  useAdminAuth()

  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('todos')
  const [modalidadeFilter, setModalidadeFilter] = useState('todas')
  const [showForm, setShowForm] = useState(false)
  const [editingEscolinha, setEditingEscolinha] = useState<any>(null)

  const [escolinhas] = useState([
    {
      id: 1,
      nome: 'Escolinha de Futebol Campeões',
      modalidade: 'Futebol',
      local: 'Centro Esportivo Municipal',
      endereco: 'Rua dos Esportes, 100 - Centro',
      coordenador: 'Carlos Silva',
      telefone: '(11) 98765-4321',
      email: 'futebol.campeoes@email.com',
      status: 'ativo',
      capacidade: 80,
      matriculados: 65,
      idadeMin: 6,
      idadeMax: 17,
      horarios: 'Seg/Qua/Sex - 14h às 16h',
      dataInicio: '2024-02-01',
      investimento: 'Gratuito',
      categoria: 'iniciacao',
      nivel: 'iniciante',
      professores: 3,
      equipamentos: 'completo',
      conquistas: 8
    },
    {
      id: 2,
      nome: 'Natação para Todos',
      modalidade: 'Natação',
      local: 'Complexo Aquático',
      endereco: 'Av. das Águas, 250 - Jardim',
      coordenador: 'Ana Costa',
      telefone: '(11) 99876-5432',
      email: 'natacao.todos@email.com',
      status: 'ativo',
      capacidade: 40,
      matriculados: 38,
      idadeMin: 4,
      idadeMax: 60,
      horarios: 'Ter/Qui/Sab - 8h às 10h',
      dataInicio: '2024-01-15',
      investimento: 'R$ 50/mês',
      categoria: 'recreativa',
      nivel: 'todos',
      professores: 2,
      equipamentos: 'completo',
      conquistas: 12
    },
    {
      id: 3,
      nome: 'Voleibol Feminino',
      modalidade: 'Voleibol',
      local: 'Ginásio da Juventude',
      endereco: 'Rua da Juventude, 456 - Vila Nova',
      coordenador: 'Maria Santos',
      telefone: '(11) 97654-3210',
      email: 'volei.feminino@email.com',
      status: 'suspenso',
      capacidade: 30,
      matriculados: 22,
      idadeMin: 12,
      idadeMax: 25,
      horarios: 'Seg/Qua - 19h às 21h',
      dataInicio: '2024-03-01',
      investimento: 'Gratuito',
      categoria: 'competitiva',
      nivel: 'intermediario',
      professores: 2,
      equipamentos: 'parcial',
      conquistas: 5
    }
  ])

  const [novaEscolinha, setNovaEscolinha] = useState({
    nome: '',
    modalidade: '',
    local: '',
    endereco: '',
    coordenador: '',
    telefone: '',
    email: '',
    capacidade: '',
    idadeMin: '',
    idadeMax: '',
    horarios: '',
    investimento: '',
    categoria: '',
    nivel: '',
    observacoes: ''
  })

  const estatisticasEscolinhas = [
    { modalidade: 'Futebol', escolinhas: 8, matriculados: 340 },
    { modalidade: 'Natação', escolinhas: 5, matriculados: 180 },
    { modalidade: 'Voleibol', escolinhas: 4, matriculados: 120 },
    { modalidade: 'Basquete', escolinhas: 3, matriculados: 95 },
    { modalidade: 'Atletismo', escolinhas: 3, matriculados: 75 },
    { modalidade: 'Tênis', escolinhas: 2, matriculados: 45 }
  ]

  const statusDistribuicao = [
    { name: 'Ativas', value: 22, color: '#22C55E' },
    { name: 'Suspensas', value: 3, color: '#EF4444' },
    { name: 'Planejadas', value: 5, color: '#3B82F6' }
  ]

  const matriculasMensais = [
    { mes: 'Jan', matriculas: 45, desistencias: 8 },
    { mes: 'Fev', matriculas: 62, desistencias: 5 },
    { mes: 'Mar', matriculas: 78, desistencias: 12 },
    { mes: 'Abr', matriculas: 35, desistencias: 7 },
    { mes: 'Mai', matriculas: 58, desistencias: 9 },
    { mes: 'Jun', matriculas: 71, desistencias: 6 }
  ]

  const filteredEscolinhas = escolinhas.filter(escolinha => {
    const matchesSearch = escolinha.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         escolinha.modalidade.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         escolinha.coordenador.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'todos' || escolinha.status === statusFilter
    const matchesModalidade = modalidadeFilter === 'todas' || escolinha.modalidade === modalidadeFilter
    return matchesSearch && matchesStatus && matchesModalidade
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setShowForm(false)
    setNovaEscolinha({
      nome: '',
      modalidade: '',
      local: '',
      endereco: '',
      coordenador: '',
      telefone: '',
      email: '',
      capacidade: '',
      idadeMin: '',
      idadeMax: '',
      horarios: '',
      investimento: '',
      categoria: '',
      nivel: '',
      observacoes: ''
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ativo':
        return <Badge className="bg-green-100 text-green-800">Ativa</Badge>
      case 'suspenso':
        return <Badge className="bg-red-100 text-red-800">Suspensa</Badge>
      case 'planejada':
        return <Badge className="bg-blue-100 text-blue-800">Planejada</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  const getCategoriaBadge = (categoria: string) => {
    switch (categoria) {
      case 'iniciacao':
        return <Badge className="bg-yellow-100 text-yellow-800"><Star className="w-3 h-3 mr-1" />Iniciação</Badge>
      case 'recreativa':
        return <Badge className="bg-blue-100 text-blue-800"><Heart className="w-3 h-3 mr-1" />Recreativa</Badge>
      case 'competitiva':
        return <Badge className="bg-purple-100 text-purple-800"><Award className="w-3 h-3 mr-1" />Competitiva</Badge>
      default:
        return <Badge>{categoria}</Badge>
    }
  }

  const getTaxaOcupacao = (matriculados: number, capacidade: number) => {
    const taxa = (matriculados / capacidade) * 100
    if (taxa >= 90) return 'text-red-600'
    if (taxa >= 70) return 'text-yellow-600'
    return 'text-green-600'
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Escolinhas Esportivas</h1>
          <p className="text-gray-600">Gestão completa das escolinhas esportivas municipais</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Nova Escolinha
        </Button>
      </div>

      <Tabs defaultValue="visao-geral" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="visao-geral">Visão Geral</TabsTrigger>
          <TabsTrigger value="escolinhas">Escolinhas</TabsTrigger>
          <TabsTrigger value="alunos">Gestão de Alunos</TabsTrigger>
          <TabsTrigger value="servicos">Serviços Gerados</TabsTrigger>
        </TabsList>

        <TabsContent value="visao-geral" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total de Escolinhas</CardTitle>
                <School className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">30</div>
                <p className="text-xs text-muted-foreground">+3 este mês</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Alunos Matriculados</CardTitle>
                <Users className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">855</div>
                <p className="text-xs text-muted-foreground">71 novas matrículas</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Taxa de Ocupação</CardTitle>
                <TrendingUp className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">78%</div>
                <p className="text-xs text-muted-foreground">+5% este mês</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Modalidades</CardTitle>
                <Activity className="h-4 w-4 text-purple-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">15</div>
                <p className="text-xs text-muted-foreground">Diferentes esportes</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Escolinhas por Modalidade</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={estatisticasEscolinhas}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="modalidade" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="escolinhas" fill="#3B82F6" name="Escolinhas" />
                    <Bar dataKey="matriculados" fill="#10B981" name="Matriculados" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Status das Escolinhas</CardTitle>
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
              <CardTitle>Matrículas e Desistências Mensais</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={matriculasMensais}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mes" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="matriculas" stroke="#22C55E" name="Matrículas" />
                  <Line type="monotone" dataKey="desistencias" stroke="#EF4444" name="Desistências" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="escolinhas" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Filtros e Busca</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="flex items-center space-x-2">
                  <Search className="w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Buscar escolinhas..."
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
                    <SelectItem value="ativo">Ativa</SelectItem>
                    <SelectItem value="suspenso">Suspensa</SelectItem>
                    <SelectItem value="planejada">Planejada</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={modalidadeFilter} onValueChange={setModalidadeFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Modalidade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todas">Todas as Modalidades</SelectItem>
                    <SelectItem value="Futebol">Futebol</SelectItem>
                    <SelectItem value="Natação">Natação</SelectItem>
                    <SelectItem value="Voleibol">Voleibol</SelectItem>
                    <SelectItem value="Basquete">Basquete</SelectItem>
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
            {filteredEscolinhas.map((escolinha) => (
              <Card key={escolinha.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
                        <School className="w-8 h-8 text-blue-600" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-3">
                          <h3 className="text-lg font-semibold">{escolinha.nome}</h3>
                          {getStatusBadge(escolinha.status)}
                          {getCategoriaBadge(escolinha.categoria)}
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                          <div className="flex items-center space-x-1">
                            <Activity className="w-4 h-4" />
                            <span>{escolinha.modalidade}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MapPin className="w-4 h-4" />
                            <span>{escolinha.local}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <UserCheck className="w-4 h-4" />
                            <span>{escolinha.coordenador}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>{escolinha.horarios}</span>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                          <div className="flex items-center space-x-1">
                            <Phone className="w-4 h-4" />
                            <span>{escolinha.telefone}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Mail className="w-4 h-4" />
                            <span>{escolinha.email}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Users className="w-4 h-4" />
                            <span className={getTaxaOcupacao(escolinha.matriculados, escolinha.capacidade)}>
                              {escolinha.matriculados}/{escolinha.capacidade} alunos
                            </span>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">Idade:</span>
                            <span className="ml-1 font-medium">{escolinha.idadeMin}-{escolinha.idadeMax} anos</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Investimento:</span>
                            <span className="ml-1 font-medium">{escolinha.investimento}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Professores:</span>
                            <span className="ml-1 font-medium">{escolinha.professores}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Conquistas:</span>
                            <span className="ml-1 font-medium">{escolinha.conquistas}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm" onClick={() => setEditingEscolinha(escolinha)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="alunos" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Gestão de Matrículas</CardTitle>
                <CardDescription>Controle de inscrições e vagas</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Matrículas Pendentes</h4>
                      <p className="text-sm text-gray-600">Aguardando aprovação</p>
                    </div>
                    <Badge className="bg-yellow-100 text-yellow-800">23</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Lista de Espera</h4>
                      <p className="text-sm text-gray-600">Aguardando vagas</p>
                    </div>
                    <Badge className="bg-blue-100 text-blue-800">47</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Documentação Pendente</h4>
                      <p className="text-sm text-gray-600">Docs incompletos</p>
                    </div>
                    <Badge className="bg-red-100 text-red-800">12</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Frequência e Desempenho</CardTitle>
                <CardDescription>Acompanhamento dos alunos</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Frequência Média</span>
                    <Badge className="bg-green-100 text-green-800">87%</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Alunos com Baixa Frequência</span>
                    <Badge className="bg-yellow-100 text-yellow-800">15</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Avaliações Realizadas</span>
                    <Badge className="bg-blue-100 text-blue-800">680</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Progressos Destacados</span>
                    <Badge className="bg-purple-100 text-purple-800">120</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Ações Rápidas - Gestão de Alunos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
                  <UserCheck className="w-6 h-6" />
                  <span className="text-sm">Aprovar Matrículas</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
                  <Calendar className="w-6 h-6" />
                  <span className="text-sm">Controle de Presença</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
                  <Award className="w-6 h-6" />
                  <span className="text-sm">Avaliações</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
                  <FileText className="w-6 h-6" />
                  <span className="text-sm">Relatórios</span>
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
                      <GraduationCap className="w-5 h-5 text-blue-500" />
                      <h4 className="font-medium">Inscrições em Escolinhas</h4>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      Processo completo de inscrição online nas escolinhas esportivas municipais
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        Consulta de vagas disponíveis
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        Inscrição online com documentos
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        Acompanhamento do processo
                      </div>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Users className="w-5 h-5 text-green-500" />
                      <h4 className="font-medium">Lista de Espera</h4>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      Sistema automático de lista de espera para escolinhas com vagas esgotadas
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        Cadastro automático na lista
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        Notificações de vagas abertas
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        Posição na fila em tempo real
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Calendar className="w-5 h-5 text-purple-500" />
                      <h4 className="font-medium">Agendamento de Aulas Experimentais</h4>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      Permite agendar aulas experimentais gratuitas antes da matrícula
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        Agendamento online
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        Confirmação automática
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        Lembretes por SMS/email
                      </div>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Target className="w-5 h-5 text-orange-500" />
                      <h4 className="font-medium">Acompanhamento do Progresso</h4>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      Portal para pais acompanharem o desenvolvimento dos filhos nas escolinhas
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        Boletim de desempenho
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        Controle de frequência
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        Fotos e vídeos das atividades
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
                  Novas inscrições realizadas através do catálogo público aparecem aqui para aprovação e gestão,
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
              <CardTitle>Nova Escolinha Esportiva</CardTitle>
              <CardDescription>Cadastre uma nova escolinha no sistema</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="nome">Nome da Escolinha *</Label>
                    <Input
                      id="nome"
                      value={novaEscolinha.nome}
                      onChange={(e) => setNovaEscolinha({...novaEscolinha, nome: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="modalidade">Modalidade *</Label>
                    <Select value={novaEscolinha.modalidade} onValueChange={(value) => setNovaEscolinha({...novaEscolinha, modalidade: value})}>
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
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="local">Local *</Label>
                    <Input
                      id="local"
                      value={novaEscolinha.local}
                      onChange={(e) => setNovaEscolinha({...novaEscolinha, local: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="coordenador">Coordenador *</Label>
                    <Input
                      id="coordenador"
                      value={novaEscolinha.coordenador}
                      onChange={(e) => setNovaEscolinha({...novaEscolinha, coordenador: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="capacidade">Capacidade de Alunos *</Label>
                    <Input
                      id="capacidade"
                      type="number"
                      value={novaEscolinha.capacidade}
                      onChange={(e) => setNovaEscolinha({...novaEscolinha, capacidade: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="telefone">Telefone *</Label>
                    <Input
                      id="telefone"
                      value={novaEscolinha.telefone}
                      onChange={(e) => setNovaEscolinha({...novaEscolinha, telefone: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="idadeMin">Idade Mínima *</Label>
                    <Input
                      id="idadeMin"
                      type="number"
                      value={novaEscolinha.idadeMin}
                      onChange={(e) => setNovaEscolinha({...novaEscolinha, idadeMin: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="idadeMax">Idade Máxima *</Label>
                    <Input
                      id="idadeMax"
                      type="number"
                      value={novaEscolinha.idadeMax}
                      onChange={(e) => setNovaEscolinha({...novaEscolinha, idadeMax: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="categoria">Categoria *</Label>
                    <Select value={novaEscolinha.categoria} onValueChange={(value) => setNovaEscolinha({...novaEscolinha, categoria: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="iniciacao">Iniciação</SelectItem>
                        <SelectItem value="recreativa">Recreativa</SelectItem>
                        <SelectItem value="competitiva">Competitiva</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="nivel">Nível *</Label>
                    <Select value={novaEscolinha.nivel} onValueChange={(value) => setNovaEscolinha({...novaEscolinha, nivel: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o nível" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="iniciante">Iniciante</SelectItem>
                        <SelectItem value="intermediario">Intermediário</SelectItem>
                        <SelectItem value="avancado">Avançado</SelectItem>
                        <SelectItem value="todos">Todos os Níveis</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="endereco">Endereço Completo *</Label>
                  <Input
                    id="endereco"
                    value={novaEscolinha.endereco}
                    onChange={(e) => setNovaEscolinha({...novaEscolinha, endereco: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="horarios">Horários de Funcionamento *</Label>
                  <Input
                    id="horarios"
                    value={novaEscolinha.horarios}
                    onChange={(e) => setNovaEscolinha({...novaEscolinha, horarios: e.target.value})}
                    placeholder="Ex: Seg/Qua/Sex - 14h às 16h"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="investimento">Investimento Mensal</Label>
                  <Input
                    id="investimento"
                    value={novaEscolinha.investimento}
                    onChange={(e) => setNovaEscolinha({...novaEscolinha, investimento: e.target.value})}
                    placeholder="Ex: Gratuito, R$ 50/mês"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email para Contato</Label>
                  <Input
                    id="email"
                    type="email"
                    value={novaEscolinha.email}
                    onChange={(e) => setNovaEscolinha({...novaEscolinha, email: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="observacoes">Observações</Label>
                  <Textarea
                    id="observacoes"
                    value={novaEscolinha.observacoes}
                    onChange={(e) => setNovaEscolinha({...novaEscolinha, observacoes: e.target.value})}
                    rows={3}
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit">Cadastrar Escolinha</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}