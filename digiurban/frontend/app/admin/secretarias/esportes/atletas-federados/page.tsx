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
  Trophy, Users, Target, Medal, Star, Search, Plus, Edit, Download,
  User, MapPin, Phone, Mail, Calendar, Activity, Award, TrendingUp,
  FileText, Camera, Shield, CheckCircle, AlertCircle, Clock, Filter
} from 'lucide-react'

export default function AtletasFederadosPage() {
  useAdminAuth()

  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('todos')
  const [modalidadeFilter, setModalidadeFilter] = useState('todas')
  const [showForm, setShowForm] = useState(false)
  const [editingAtleta, setEditingAtleta] = useState<any>(null)

  const [atletas] = useState([
    {
      id: 1,
      nome: 'João Silva Santos',
      cpf: '123.456.789-01',
      registro: 'ATL-001-2024',
      modalidade: 'Futebol',
      categoria: 'Sub-20',
      posicao: 'Meio-campo',
      status: 'ativo',
      federacao: 'FPF - Federação Paulista de Futebol',
      dataFiliacao: '2024-01-15',
      dataNascimento: '2004-05-20',
      telefone: '(11) 98765-4321',
      email: 'joao.silva@email.com',
      endereco: 'Rua das Flores, 123 - Centro',
      conquistas: 12,
      competicoes: 8,
      situacao: 'regular',
      documentacao: 'completa',
      examesMedicos: 'em_dia',
      seguroAtleta: 'ativo'
    },
    {
      id: 2,
      nome: 'Maria Oliveira Costa',
      cpf: '987.654.321-09',
      registro: 'ATL-002-2024',
      modalidade: 'Voleibol',
      categoria: 'Adulto',
      posicao: 'Levantadora',
      status: 'ativo',
      federacao: 'FPV - Federação Paulista de Voleibol',
      dataFiliacao: '2024-02-10',
      dataNascimento: '1995-08-12',
      telefone: '(11) 99876-5432',
      email: 'maria.costa@email.com',
      endereco: 'Av. Principal, 456 - Jardim',
      conquistas: 18,
      competicoes: 15,
      situacao: 'regular',
      documentacao: 'completa',
      examesMedicos: 'em_dia',
      seguroAtleta: 'ativo'
    },
    {
      id: 3,
      nome: 'Pedro Rodrigues Lima',
      cpf: '456.789.123-45',
      registro: 'ATL-003-2024',
      modalidade: 'Natação',
      categoria: 'Sub-16',
      posicao: 'Velocista',
      status: 'suspenso',
      federacao: 'FAN - Federação Aquática Nacional',
      dataFiliacao: '2024-03-05',
      dataNascimento: '2008-12-03',
      telefone: '(11) 97654-3210',
      email: 'pedro.lima@email.com',
      endereco: 'Rua dos Esportes, 789 - Vila Nova',
      conquistas: 5,
      competicoes: 3,
      situacao: 'irregularidade_documentos',
      documentacao: 'pendente',
      examesMedicos: 'vencidos',
      seguroAtleta: 'pendente'
    }
  ])

  const [novoAtleta, setNovoAtleta] = useState({
    nome: '',
    cpf: '',
    modalidade: '',
    categoria: '',
    posicao: '',
    federacao: '',
    dataNascimento: '',
    telefone: '',
    email: '',
    endereco: '',
    observacoes: ''
  })

  const estatisticasAtletas = [
    { modalidade: 'Futebol', ativos: 45, suspensos: 3, total: 48 },
    { modalidade: 'Voleibol', ativos: 32, suspensos: 1, total: 33 },
    { modalidade: 'Natação', ativos: 28, suspensos: 2, total: 30 },
    { modalidade: 'Basquete', ativos: 25, suspensos: 0, total: 25 },
    { modalidade: 'Atletismo', ativos: 22, suspensos: 1, total: 23 },
    { modalidade: 'Tênis', ativos: 18, suspensos: 0, total: 18 }
  ]

  const statusDistribuicao = [
    { name: 'Ativos', value: 170, color: '#22C55E' },
    { name: 'Suspensos', value: 7, color: '#EF4444' },
    { name: 'Inativos', value: 23, color: '#6B7280' }
  ]

  const conquistasMensais = [
    { mes: 'Jan', conquistas: 8, medalhas: 12 },
    { mes: 'Fev', conquistas: 12, medalhas: 18 },
    { mes: 'Mar', conquistas: 15, medalhas: 22 },
    { mes: 'Abr', conquistas: 10, medalhas: 16 },
    { mes: 'Mai', conquistas: 18, medalhas: 25 },
    { mes: 'Jun', conquistas: 22, medalhas: 30 }
  ]

  const filteredAtletas = atletas.filter(atleta => {
    const matchesSearch = atleta.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         atleta.registro.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         atleta.modalidade.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'todos' || atleta.status === statusFilter
    const matchesModalidade = modalidadeFilter === 'todas' || atleta.modalidade === modalidadeFilter
    return matchesSearch && matchesStatus && matchesModalidade
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setShowForm(false)
    setNovoAtleta({
      nome: '',
      cpf: '',
      modalidade: '',
      categoria: '',
      posicao: '',
      federacao: '',
      dataNascimento: '',
      telefone: '',
      email: '',
      endereco: '',
      observacoes: ''
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ativo':
        return <Badge className="bg-green-100 text-green-800">Ativo</Badge>
      case 'suspenso':
        return <Badge className="bg-red-100 text-red-800">Suspenso</Badge>
      case 'inativo':
        return <Badge className="bg-gray-100 text-gray-800">Inativo</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  const getSituacaoBadge = (situacao: string) => {
    switch (situacao) {
      case 'regular':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Regular</Badge>
      case 'irregularidade_documentos':
        return <Badge className="bg-yellow-100 text-yellow-800"><AlertCircle className="w-3 h-3 mr-1" />Documentação Pendente</Badge>
      case 'suspenso_medico':
        return <Badge className="bg-red-100 text-red-800"><AlertCircle className="w-3 h-3 mr-1" />Suspenso Medicamente</Badge>
      default:
        return <Badge>{situacao}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Atletas Federados</h1>
          <p className="text-gray-600">Gestão completa de atletas federados municipais</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Novo Atleta
        </Button>
      </div>

      <Tabs defaultValue="visao-geral" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="visao-geral">Visão Geral</TabsTrigger>
          <TabsTrigger value="atletas">Atletas</TabsTrigger>
          <TabsTrigger value="federacoes">Federações</TabsTrigger>
          <TabsTrigger value="servicos">Serviços Gerados</TabsTrigger>
        </TabsList>

        <TabsContent value="visao-geral" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total de Atletas</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">200</div>
                <p className="text-xs text-muted-foreground">+12 este mês</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Ativos</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">170</div>
                <p className="text-xs text-muted-foreground">85% do total</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Conquistas</CardTitle>
                <Trophy className="h-4 w-4 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">85</div>
                <p className="text-xs text-muted-foreground">+8 este mês</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Modalidades</CardTitle>
                <Activity className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">12</div>
                <p className="text-xs text-muted-foreground">Diferentes esportes</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Atletas por Modalidade</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={estatisticasAtletas}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="modalidade" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="ativos" fill="#22C55E" name="Ativos" />
                    <Bar dataKey="suspensos" fill="#EF4444" name="Suspensos" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Distribuição de Status</CardTitle>
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
              <CardTitle>Conquistas e Medalhas Mensais</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={conquistasMensais}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mes" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="conquistas" stroke="#3B82F6" name="Conquistas" />
                  <Line type="monotone" dataKey="medalhas" stroke="#F59E0B" name="Medalhas" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="atletas" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Filtros e Busca</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="flex items-center space-x-2">
                  <Search className="w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Buscar atletas..."
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
                    <SelectItem value="ativo">Ativo</SelectItem>
                    <SelectItem value="suspenso">Suspenso</SelectItem>
                    <SelectItem value="inativo">Inativo</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={modalidadeFilter} onValueChange={setModalidadeFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Modalidade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todas">Todas as Modalidades</SelectItem>
                    <SelectItem value="Futebol">Futebol</SelectItem>
                    <SelectItem value="Voleibol">Voleibol</SelectItem>
                    <SelectItem value="Natação">Natação</SelectItem>
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
            {filteredAtletas.map((atleta) => (
              <Card key={atleta.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                        <User className="w-8 h-8 text-gray-400" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-3">
                          <h3 className="text-lg font-semibold">{atleta.nome}</h3>
                          {getStatusBadge(atleta.status)}
                          {getSituacaoBadge(atleta.situacao)}
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                          <div className="flex items-center space-x-1">
                            <FileText className="w-4 h-4" />
                            <span>{atleta.registro}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Activity className="w-4 h-4" />
                            <span>{atleta.modalidade} - {atleta.categoria}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Target className="w-4 h-4" />
                            <span>{atleta.posicao}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Trophy className="w-4 h-4" />
                            <span>{atleta.conquistas} conquistas</span>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                          <div className="flex items-center space-x-1">
                            <Phone className="w-4 h-4" />
                            <span>{atleta.telefone}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Mail className="w-4 h-4" />
                            <span>{atleta.email}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>Filiado em {atleta.dataFiliacao}</span>
                          </div>
                        </div>
                        <div className="text-sm text-gray-600">
                          <p><strong>Federação:</strong> {atleta.federacao}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm" onClick={() => setEditingAtleta(atleta)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="federacoes" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Federações Parceiras</CardTitle>
                <CardDescription>Entidades esportivas cadastradas</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium">FPF - Federação Paulista de Futebol</h4>
                      <p className="text-sm text-gray-600">48 atletas federados</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Ativo</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium">FPV - Federação Paulista de Voleibol</h4>
                      <p className="text-sm text-gray-600">33 atletas federados</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Ativo</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium">FAN - Federação Aquática Nacional</h4>
                      <p className="text-sm text-gray-600">30 atletas federados</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Ativo</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Documentação e Regularidade</CardTitle>
                <CardDescription>Status dos atletas por categoria</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Documentação Completa</span>
                    <Badge className="bg-green-100 text-green-800">185 atletas</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Documentação Pendente</span>
                    <Badge className="bg-yellow-100 text-yellow-800">10 atletas</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Exames Médicos em Dia</span>
                    <Badge className="bg-green-100 text-green-800">175 atletas</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Exames Médicos Vencidos</span>
                    <Badge className="bg-red-100 text-red-800">25 atletas</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Seguro Atleta Ativo</span>
                    <Badge className="bg-green-100 text-green-800">190 atletas</Badge>
                  </div>
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
                      <User className="w-5 h-5 text-blue-500" />
                      <h4 className="font-medium">Filiação de Atletas</h4>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      Processo completo de filiação de atletas às federações esportivas municipais
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        Cadastro em federações
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        Documentação necessária
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        Acompanhamento do processo
                      </div>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <FileText className="w-5 h-5 text-green-500" />
                      <h4 className="font-medium">Renovação de Registro</h4>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      Serviço de renovação anual de registros de atletas federados
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        Renovação automática
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        Notificações de vencimento
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        Atualização de dados
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Shield className="w-5 h-5 text-purple-500" />
                      <h4 className="font-medium">Seguro Atleta</h4>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      Contratação e gestão de seguro obrigatório para atletas federados
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        Cobertura completa
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        Acionamento online
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        Acompanhamento de sinistros
                      </div>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Activity className="w-5 h-5 text-orange-500" />
                      <h4 className="font-medium">Exames Médicos Esportivos</h4>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      Agendamento e acompanhamento de exames médicos obrigatórios
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        Agendamento online
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        Lembretes automáticos
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        Resultados digitais
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
                  Novos cadastros realizados através do catálogo público aparecem aqui para aprovação e gestão,
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
              <CardTitle>Novo Atleta Federado</CardTitle>
              <CardDescription>Cadastre um novo atleta no sistema</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="nome">Nome Completo *</Label>
                    <Input
                      id="nome"
                      value={novoAtleta.nome}
                      onChange={(e) => setNovoAtleta({...novoAtleta, nome: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="cpf">CPF *</Label>
                    <Input
                      id="cpf"
                      value={novoAtleta.cpf}
                      onChange={(e) => setNovoAtleta({...novoAtleta, cpf: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="modalidade">Modalidade *</Label>
                    <Select value={novoAtleta.modalidade} onValueChange={(value) => setNovoAtleta({...novoAtleta, modalidade: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a modalidade" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Futebol">Futebol</SelectItem>
                        <SelectItem value="Voleibol">Voleibol</SelectItem>
                        <SelectItem value="Natação">Natação</SelectItem>
                        <SelectItem value="Basquete">Basquete</SelectItem>
                        <SelectItem value="Atletismo">Atletismo</SelectItem>
                        <SelectItem value="Tênis">Tênis</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="categoria">Categoria *</Label>
                    <Select value={novoAtleta.categoria} onValueChange={(value) => setNovoAtleta({...novoAtleta, categoria: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Sub-16">Sub-16</SelectItem>
                        <SelectItem value="Sub-18">Sub-18</SelectItem>
                        <SelectItem value="Sub-20">Sub-20</SelectItem>
                        <SelectItem value="Adulto">Adulto</SelectItem>
                        <SelectItem value="Master">Master</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="posicao">Posição/Especialidade</Label>
                    <Input
                      id="posicao"
                      value={novoAtleta.posicao}
                      onChange={(e) => setNovoAtleta({...novoAtleta, posicao: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="federacao">Federação</Label>
                    <Input
                      id="federacao"
                      value={novoAtleta.federacao}
                      onChange={(e) => setNovoAtleta({...novoAtleta, federacao: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="dataNascimento">Data de Nascimento *</Label>
                    <Input
                      id="dataNascimento"
                      type="date"
                      value={novoAtleta.dataNascimento}
                      onChange={(e) => setNovoAtleta({...novoAtleta, dataNascimento: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="telefone">Telefone *</Label>
                    <Input
                      id="telefone"
                      value={novoAtleta.telefone}
                      onChange={(e) => setNovoAtleta({...novoAtleta, telefone: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={novoAtleta.email}
                      onChange={(e) => setNovoAtleta({...novoAtleta, email: e.target.value})}
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="endereco">Endereço Completo *</Label>
                  <Input
                    id="endereco"
                    value={novoAtleta.endereco}
                    onChange={(e) => setNovoAtleta({...novoAtleta, endereco: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="observacoes">Observações</Label>
                  <Textarea
                    id="observacoes"
                    value={novoAtleta.observacoes}
                    onChange={(e) => setNovoAtleta({...novoAtleta, observacoes: e.target.value})}
                    rows={3}
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit">Cadastrar Atleta</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}