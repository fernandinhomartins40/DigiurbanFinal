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
  Building, MapPin, Calendar, Clock, Search, Plus, Edit, Download, Wrench,
  Users, Activity, Target, Star, Zap, TrendingUp, FileText, Settings,
  CheckCircle, AlertCircle, XCircle, Shield, Camera, Ruler, ThermometerSun
} from 'lucide-react'

export default function InfraestruturaEsportivaPage() {
  useAdminAuth()

  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('todos')
  const [tipoFilter, setTipoFilter] = useState('todos')
  const [showForm, setShowForm] = useState(false)
  const [editingInstalacao, setEditingInstalacao] = useState<any>(null)

  const [instalacoes] = useState([
    {
      id: 1,
      nome: 'Estádio Municipal José da Silva',
      tipo: 'estadio',
      modalidade: 'Futebol',
      endereco: 'Av. dos Esportes, 1000 - Centro',
      capacidade: 5000,
      area: '10.500 m²',
      status: 'ativo',
      condicao: 'excelente',
      acessibilidade: true,
      iluminacao: true,
      vestiarios: 4,
      estacionamento: 200,
      ultimaManutencao: '2024-05-15',
      proximaManutencao: '2024-08-15',
      responsavel: 'Carlos Silva',
      telefone: '(11) 98765-4321',
      email: 'estadio@esportes.gov.br',
      construcao: '1985',
      reforma: '2022',
      certificacoes: ['ANVISA', 'Bombeiros'],
      equipamentos: ['Placar eletrônico', 'Som profissional', 'Refletores LED'],
      utilizacaoMensal: 85
    },
    {
      id: 2,
      nome: 'Complexo Aquático Municipal',
      tipo: 'piscina',
      modalidade: 'Natação/Polo Aquático',
      endereco: 'Rua das Águas, 500 - Jardim',
      capacidade: 300,
      area: '2.800 m²',
      status: 'ativo',
      condicao: 'boa',
      acessibilidade: true,
      iluminacao: true,
      vestiarios: 6,
      estacionamento: 80,
      ultimaManutencao: '2024-04-20',
      proximaManutencao: '2024-07-20',
      responsavel: 'Ana Costa',
      telefone: '(11) 99876-5432',
      email: 'aquatico@esportes.gov.br',
      construcao: '1998',
      reforma: '2021',
      certificacoes: ['ANVISA', 'Vigilância Sanitária'],
      equipamentos: ['Sistema filtração', 'Aquecimento solar', 'Cronometragem'],
      utilizacaoMensal: 92
    },
    {
      id: 3,
      nome: 'Ginásio da Juventude',
      tipo: 'ginasio',
      modalidade: 'Voleibol/Basquete/Futsal',
      endereco: 'Rua da Juventude, 456 - Vila Nova',
      capacidade: 800,
      area: '1.200 m²',
      status: 'reforma',
      condicao: 'regular',
      acessibilidade: false,
      iluminacao: true,
      vestiarios: 4,
      estacionamento: 50,
      ultimaManutencao: '2024-01-10',
      proximaManutencao: '2024-09-30',
      responsavel: 'Pedro Lima',
      telefone: '(11) 97654-3210',
      email: 'ginasio@esportes.gov.br',
      construcao: '1992',
      reforma: '2024',
      certificacoes: ['Bombeiros'],
      equipamentos: ['Quadra poliesportiva', 'Arquibancadas', 'Placar'],
      utilizacaoMensal: 45
    }
  ])

  const [novaInstalacao, setNovaInstalacao] = useState({
    nome: '',
    tipo: '',
    modalidade: '',
    endereco: '',
    capacidade: '',
    area: '',
    responsavel: '',
    telefone: '',
    email: '',
    vestiarios: '',
    estacionamento: '',
    construcao: '',
    descricao: ''
  })

  const estatisticasInfraestrutura = [
    { tipo: 'Estádios', quantidade: 3, capacidade: 12000 },
    { tipo: 'Ginásios', quantidade: 8, capacidade: 4800 },
    { tipo: 'Piscinas', quantidade: 5, capacidade: 1200 },
    { tipo: 'Quadras', quantidade: 25, capacidade: 2500 },
    { tipo: 'Campos', quantidade: 15, capacidade: 3000 },
    { tipo: 'Pistas', quantidade: 4, capacidade: 800 }
  ]

  const condicaoDistribuicao = [
    { name: 'Excelente', value: 18, color: '#22C55E' },
    { name: 'Boa', value: 25, color: '#3B82F6' },
    { name: 'Regular', value: 12, color: '#F59E0B' },
    { name: 'Ruim', value: 5, color: '#EF4444' }
  ]

  const utilizacaoMensal = [
    { mes: 'Jan', utilizacao: 78, manutencoes: 5 },
    { mes: 'Fev', utilizacao: 82, manutencoes: 3 },
    { mes: 'Mar', utilizacao: 85, manutencoes: 7 },
    { mes: 'Abr', utilizacao: 79, manutencoes: 4 },
    { mes: 'Mai', utilizacao: 88, manutencoes: 6 },
    { mes: 'Jun', utilizacao: 91, manutencoes: 2 }
  ]

  const filteredInstalacoes = instalacoes.filter(instalacao => {
    const matchesSearch = instalacao.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         instalacao.modalidade.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         instalacao.responsavel.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'todos' || instalacao.status === statusFilter
    const matchesTipo = tipoFilter === 'todos' || instalacao.tipo === tipoFilter
    return matchesSearch && matchesStatus && matchesTipo
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setShowForm(false)
    setNovaInstalacao({
      nome: '',
      tipo: '',
      modalidade: '',
      endereco: '',
      capacidade: '',
      area: '',
      responsavel: '',
      telefone: '',
      email: '',
      vestiarios: '',
      estacionamento: '',
      construcao: '',
      descricao: ''
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ativo':
        return <Badge className="bg-green-100 text-green-800">Ativo</Badge>
      case 'reforma':
        return <Badge className="bg-yellow-100 text-yellow-800">Em Reforma</Badge>
      case 'manutencao':
        return <Badge className="bg-orange-100 text-orange-800">Manutenção</Badge>
      case 'inativo':
        return <Badge className="bg-red-100 text-red-800">Inativo</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  const getCondicaoBadge = (condicao: string) => {
    switch (condicao) {
      case 'excelente':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Excelente</Badge>
      case 'boa':
        return <Badge className="bg-blue-100 text-blue-800"><CheckCircle className="w-3 h-3 mr-1" />Boa</Badge>
      case 'regular':
        return <Badge className="bg-yellow-100 text-yellow-800"><AlertCircle className="w-3 h-3 mr-1" />Regular</Badge>
      case 'ruim':
        return <Badge className="bg-red-100 text-red-800"><XCircle className="w-3 h-3 mr-1" />Ruim</Badge>
      default:
        return <Badge>{condicao}</Badge>
    }
  }

  const getTipoBadge = (tipo: string) => {
    switch (tipo) {
      case 'estadio':
        return <Badge className="bg-purple-100 text-purple-800"><Building className="w-3 h-3 mr-1" />Estádio</Badge>
      case 'ginasio':
        return <Badge className="bg-blue-100 text-blue-800"><Building className="w-3 h-3 mr-1" />Ginásio</Badge>
      case 'piscina':
        return <Badge className="bg-cyan-100 text-cyan-800"><Activity className="w-3 h-3 mr-1" />Piscina</Badge>
      case 'quadra':
        return <Badge className="bg-green-100 text-green-800"><Target className="w-3 h-3 mr-1" />Quadra</Badge>
      case 'campo':
        return <Badge className="bg-yellow-100 text-yellow-800"><Star className="w-3 h-3 mr-1" />Campo</Badge>
      default:
        return <Badge>{tipo}</Badge>
    }
  }

  const getUtilizacaoColor = (utilizacao: number) => {
    if (utilizacao >= 90) return 'text-red-600'
    if (utilizacao >= 70) return 'text-yellow-600'
    return 'text-green-600'
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Infraestrutura Esportiva</h1>
          <p className="text-gray-600">Gestão completa das instalações esportivas municipais</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Nova Instalação
        </Button>
      </div>

      <Tabs defaultValue="visao-geral" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="visao-geral">Visão Geral</TabsTrigger>
          <TabsTrigger value="instalacoes">Instalações</TabsTrigger>
          <TabsTrigger value="manutencao">Manutenção</TabsTrigger>
          <TabsTrigger value="servicos">Serviços Gerados</TabsTrigger>
        </TabsList>

        <TabsContent value="visao-geral" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total de Instalações</CardTitle>
                <Building className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">60</div>
                <p className="text-xs text-muted-foreground">+2 este mês</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Capacidade Total</CardTitle>
                <Users className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">24.300</div>
                <p className="text-xs text-muted-foreground">Pessoas simultaneamente</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Taxa de Utilização</CardTitle>
                <TrendingUp className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">84%</div>
                <p className="text-xs text-muted-foreground">+3% este mês</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Em Manutenção</CardTitle>
                <Wrench className="h-4 w-4 text-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">8</div>
                <p className="text-xs text-muted-foreground">Instalações</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Instalações por Tipo</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={estatisticasInfraestrutura}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="tipo" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="quantidade" fill="#3B82F6" name="Quantidade" />
                    <Bar dataKey="capacidade" fill="#10B981" name="Capacidade" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Condição das Instalações</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={condicaoDistribuicao}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={(({ name, percent }: { name: string; percent: number }) => `${name} ${(percent * 100).toFixed(0)}%`) as any}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {condicaoDistribuicao.map((entry, index) => (
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
              <CardTitle>Utilização e Manutenção Mensal</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={utilizacaoMensal}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mes" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="utilizacao" stroke="#22C55E" name="Utilização %" />
                  <Line type="monotone" dataKey="manutencoes" stroke="#EF4444" name="Manutenções" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="instalacoes" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Filtros e Busca</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="flex items-center space-x-2">
                  <Search className="w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Buscar instalações..."
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
                    <SelectItem value="reforma">Em Reforma</SelectItem>
                    <SelectItem value="manutencao">Manutenção</SelectItem>
                    <SelectItem value="inativo">Inativo</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={tipoFilter} onValueChange={setTipoFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos os Tipos</SelectItem>
                    <SelectItem value="estadio">Estádio</SelectItem>
                    <SelectItem value="ginasio">Ginásio</SelectItem>
                    <SelectItem value="piscina">Piscina</SelectItem>
                    <SelectItem value="quadra">Quadra</SelectItem>
                    <SelectItem value="campo">Campo</SelectItem>
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
            {filteredInstalacoes.map((instalacao) => (
              <Card key={instalacao.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Building className="w-8 h-8 text-blue-600" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-3">
                          <h3 className="text-lg font-semibold">{instalacao.nome}</h3>
                          {getStatusBadge(instalacao.status)}
                          {getTipoBadge(instalacao.tipo)}
                          {getCondicaoBadge(instalacao.condicao)}
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                          <div className="flex items-center space-x-1">
                            <Activity className="w-4 h-4" />
                            <span>{instalacao.modalidade}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Users className="w-4 h-4" />
                            <span>{instalacao.capacidade} pessoas</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Ruler className="w-4 h-4" />
                            <span>{instalacao.area}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <TrendingUp className="w-4 h-4" />
                            <span className={getUtilizacaoColor(instalacao.utilizacaoMensal)}>
                              {instalacao.utilizacaoMensal}% utilização
                            </span>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                          <div className="flex items-center space-x-1">
                            <MapPin className="w-4 h-4" />
                            <span>{instalacao.endereco}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>Construído em {instalacao.construcao}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Wrench className="w-4 h-4" />
                            <span>Manutenção: {instalacao.proximaManutencao}</span>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">Vestiários:</span>
                            <span className="ml-1 font-medium">{instalacao.vestiarios}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Estacionamento:</span>
                            <span className="ml-1 font-medium">{instalacao.estacionamento} vagas</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Shield className="w-4 h-4" />
                            <span>Acessível: {instalacao.acessibilidade ? 'Sim' : 'Não'}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Zap className="w-4 h-4" />
                            <span>Iluminação: {instalacao.iluminacao ? 'Sim' : 'Não'}</span>
                          </div>
                        </div>
                        <div className="text-sm">
                          <p><strong>Responsável:</strong> {instalacao.responsavel} - {instalacao.telefone}</p>
                          <p><strong>Certificações:</strong> {instalacao.certificacoes.join(', ')}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm" onClick={() => setEditingInstalacao(instalacao)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="manutencao" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Cronograma de Manutenção</CardTitle>
                <CardDescription>Agenda de manutenções preventivas e corretivas</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Manutenções Pendentes</h4>
                      <p className="text-sm text-gray-600">Precisam ser agendadas</p>
                    </div>
                    <Badge className="bg-red-100 text-red-800">12</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Em Andamento</h4>
                      <p className="text-sm text-gray-600">Sendo executadas</p>
                    </div>
                    <Badge className="bg-yellow-100 text-yellow-800">8</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Concluídas este Mês</h4>
                      <p className="text-sm text-gray-600">Finalizadas</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800">25</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Orçamento e Recursos</CardTitle>
                <CardDescription>Controle financeiro das manutenções</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Orçamento Anual</span>
                    <Badge className="bg-blue-100 text-blue-800">R$ 850.000</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Gasto até Agora</span>
                    <Badge className="bg-yellow-100 text-yellow-800">R$ 420.000</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Disponível</span>
                    <Badge className="bg-green-100 text-green-800">R$ 430.000</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Equipe Técnica</span>
                    <Badge className="bg-purple-100 text-purple-800">15 profissionais</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Fornecedores Ativos</span>
                    <Badge className="bg-orange-100 text-orange-800">8</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Ações Rápidas - Manutenção</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
                  <Calendar className="w-6 h-6" />
                  <span className="text-sm">Agendar Manutenção</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
                  <Wrench className="w-6 h-6" />
                  <span className="text-sm">Ordem de Serviço</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
                  <FileText className="w-6 h-6" />
                  <span className="text-sm">Relatório Técnico</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
                  <Camera className="w-6 h-6" />
                  <span className="text-sm">Inspeção Fotográfica</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Histórico de Manutenções Recentes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border-l-4 border-green-500 bg-green-50">
                  <div>
                    <h4 className="font-medium">Estádio Municipal - Troca de Refletores</h4>
                    <p className="text-sm text-gray-600">Concluída em 15/06/2024 - R$ 35.000</p>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Concluída</Badge>
                </div>
                <div className="flex items-center justify-between p-3 border-l-4 border-yellow-500 bg-yellow-50">
                  <div>
                    <h4 className="font-medium">Complexo Aquático - Manutenção Sistema Filtração</h4>
                    <p className="text-sm text-gray-600">Em andamento desde 10/06/2024 - R$ 18.000</p>
                  </div>
                  <Badge className="bg-yellow-100 text-yellow-800">Em Andamento</Badge>
                </div>
                <div className="flex items-center justify-between p-3 border-l-4 border-red-500 bg-red-50">
                  <div>
                    <h4 className="font-medium">Ginásio da Juventude - Reforma Arquibancadas</h4>
                    <p className="text-sm text-gray-600">Agendada para 01/07/2024 - R$ 75.000</p>
                  </div>
                  <Badge className="bg-red-100 text-red-800">Agendada</Badge>
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
                      <Building className="w-5 h-5 text-blue-500" />
                      <h4 className="font-medium">Reserva de Espaços Esportivos</h4>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      Sistema completo de reserva online de instalações esportivas municipais
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        Consulta de disponibilidade
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        Reserva online com pagamento
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        Confirmação automática
                      </div>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <MapPin className="w-5 h-5 text-green-500" />
                      <h4 className="font-medium">Localização e Acesso</h4>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      Informações detalhadas sobre localização e acessibilidade das instalações
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        Mapas e direções
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        Informações de acessibilidade
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        Transporte público
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Clock className="w-5 h-5 text-purple-500" />
                      <h4 className="font-medium">Consulta de Horários</h4>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      Visualização em tempo real dos horários disponíveis e ocupados
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        Grade de horários atualizada
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        Filtros por modalidade
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        Notificações de cancelamentos
                      </div>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Settings className="w-5 h-5 text-orange-500" />
                      <h4 className="font-medium">Status de Manutenção</h4>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      Informações sobre manutenções programadas e indisponibilidades
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        Avisos de manutenção
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        Cronograma de reformas
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        Instalações alternativas
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
                  Novas reservas realizadas através do catálogo público aparecem aqui para gestão,
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
              <CardTitle>Nova Instalação Esportiva</CardTitle>
              <CardDescription>Cadastre uma nova instalação no sistema</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="nome">Nome da Instalação *</Label>
                    <Input
                      id="nome"
                      value={novaInstalacao.nome}
                      onChange={(e) => setNovaInstalacao({...novaInstalacao, nome: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="tipo">Tipo de Instalação *</Label>
                    <Select value={novaInstalacao.tipo} onValueChange={(value) => setNovaInstalacao({...novaInstalacao, tipo: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="estadio">Estádio</SelectItem>
                        <SelectItem value="ginasio">Ginásio</SelectItem>
                        <SelectItem value="piscina">Piscina</SelectItem>
                        <SelectItem value="quadra">Quadra</SelectItem>
                        <SelectItem value="campo">Campo</SelectItem>
                        <SelectItem value="pista">Pista</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="modalidade">Modalidade *</Label>
                    <Input
                      id="modalidade"
                      value={novaInstalacao.modalidade}
                      onChange={(e) => setNovaInstalacao({...novaInstalacao, modalidade: e.target.value})}
                      placeholder="Ex: Futebol, Natação, Múltiplas"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="capacidade">Capacidade de Pessoas *</Label>
                    <Input
                      id="capacidade"
                      type="number"
                      value={novaInstalacao.capacidade}
                      onChange={(e) => setNovaInstalacao({...novaInstalacao, capacidade: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="area">Área Total *</Label>
                    <Input
                      id="area"
                      value={novaInstalacao.area}
                      onChange={(e) => setNovaInstalacao({...novaInstalacao, area: e.target.value})}
                      placeholder="Ex: 1.200 m²"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="responsavel">Responsável *</Label>
                    <Input
                      id="responsavel"
                      value={novaInstalacao.responsavel}
                      onChange={(e) => setNovaInstalacao({...novaInstalacao, responsavel: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="telefone">Telefone *</Label>
                    <Input
                      id="telefone"
                      value={novaInstalacao.telefone}
                      onChange={(e) => setNovaInstalacao({...novaInstalacao, telefone: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={novaInstalacao.email}
                      onChange={(e) => setNovaInstalacao({...novaInstalacao, email: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="vestiarios">Número de Vestiários</Label>
                    <Input
                      id="vestiarios"
                      type="number"
                      value={novaInstalacao.vestiarios}
                      onChange={(e) => setNovaInstalacao({...novaInstalacao, vestiarios: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="estacionamento">Vagas de Estacionamento</Label>
                    <Input
                      id="estacionamento"
                      type="number"
                      value={novaInstalacao.estacionamento}
                      onChange={(e) => setNovaInstalacao({...novaInstalacao, estacionamento: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="construcao">Ano de Construção</Label>
                    <Input
                      id="construcao"
                      type="number"
                      value={novaInstalacao.construcao}
                      onChange={(e) => setNovaInstalacao({...novaInstalacao, construcao: e.target.value})}
                      placeholder="Ex: 1995"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="endereco">Endereço Completo *</Label>
                  <Input
                    id="endereco"
                    value={novaInstalacao.endereco}
                    onChange={(e) => setNovaInstalacao({...novaInstalacao, endereco: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="descricao">Descrição e Equipamentos</Label>
                  <Textarea
                    id="descricao"
                    value={novaInstalacao.descricao}
                    onChange={(e) => setNovaInstalacao({...novaInstalacao, descricao: e.target.value})}
                    rows={3}
                    placeholder="Descreva os equipamentos e características da instalação"
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit">Cadastrar Instalação</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}