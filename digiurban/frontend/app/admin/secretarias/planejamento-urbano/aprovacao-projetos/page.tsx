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
  FileText, Building2, Map, Search, Plus, Edit, Download, Clock, User,
  CheckCircle, AlertCircle, XCircle, Eye, Calendar, Phone, Mail,
  Target, Star, Award, TrendingUp, Activity, Users, DollarSign
} from 'lucide-react'

export default function AprovacaoProjetosPage() {
  useAdminAuth()

  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('todos')
  const [tipoFilter, setTipoFilter] = useState('todos')
  const [showForm, setShowForm] = useState(false)
  const [editingProjeto, setEditingProjeto] = useState<any>(null)

  const [projetos] = useState([
    {
      id: 1,
      protocolo: 'PROJ-2024-001',
      tipo: 'arquitetonico',
      titulo: 'Residência Unifamiliar - Rua das Flores',
      solicitante: 'João Silva Santos',
      cpf: '123.456.789-01',
      telefone: '(11) 98765-4321',
      email: 'joao.silva@email.com',
      endereco: 'Rua das Flores, 123 - Centro',
      arquiteto: 'Arq. Maria Santos',
      crea: 'SP123456',
      area: '180 m²',
      valor: 350000,
      status: 'em_analise',
      fase: 'analise_tecnica',
      dataSubmissao: '2024-06-15',
      prazoAnalise: '2024-07-15',
      dataVistoria: null,
      analista: 'Pedro Lima',
      observacoes: 'Projeto dentro dos padrões. Aguardando verificação de recuos.',
      documentos: ['Projeto Arquitetônico', 'Memorial Descritivo', 'ART', 'Escritura'],
      pendencias: [],
      aprovacoes: ['Estrutural', 'Hidráulica']
    },
    {
      id: 2,
      protocolo: 'PROJ-2024-002',
      tipo: 'parcelamento',
      titulo: 'Loteamento Vila Nova - Fase 2',
      solicitante: 'Construtora ABC Ltda',
      cpf: '12.345.678/0001-90',
      telefone: '(11) 99876-5432',
      email: 'projetos@construtorabc.com',
      endereco: 'Área Rural - Setor Norte',
      arquiteto: 'Arq. Carlos Costa',
      crea: 'SP654321',
      area: '50.000 m²',
      valor: 2500000,
      status: 'aprovado',
      fase: 'concluido',
      dataSubmissao: '2024-05-20',
      prazoAnalise: '2024-07-20',
      dataVistoria: '2024-06-18',
      analista: 'Ana Costa',
      observacoes: 'Projeto aprovado após correções. Licença emitida.',
      documentos: ['Projeto Urbanístico', 'Estudo Ambiental', 'Memorial', 'Anuência'],
      pendencias: [],
      aprovacoes: ['Urbanística', 'Ambiental', 'Viária', 'Jurídica']
    },
    {
      id: 3,
      protocolo: 'PROJ-2024-003',
      tipo: 'viabilidade',
      titulo: 'Estudo de Viabilidade - Centro Comercial',
      solicitante: 'Empreendimentos XYZ S.A.',
      cpf: '98.765.432/0001-10',
      telefone: '(11) 97654-3210',
      email: 'desenvolvimento@xyz.com.br',
      endereco: 'Av. Principal, 1000 - Centro',
      arquiteto: 'Arq. Roberto Silva',
      crea: 'SP987654',
      area: '5.000 m²',
      valor: 8000000,
      status: 'pendencia',
      fase: 'correcoes',
      dataSubmissao: '2024-06-10',
      prazoAnalise: '2024-08-10',
      dataVistoria: '2024-06-25',
      analista: 'Carlos Lima',
      observacoes: 'Projeto com pendências na adequação às normas de estacionamento.',
      documentos: ['Estudo Preliminar', 'Relatório de Impacto', 'Projeto Viário'],
      pendencias: ['Adequação de vagas de estacionamento', 'Revisão do acesso viário'],
      aprovacoes: ['Ambiental']
    }
  ])

  const [novoProjeto, setNovoProjeto] = useState({
    tipo: '',
    titulo: '',
    solicitante: '',
    cpf: '',
    telefone: '',
    email: '',
    endereco: '',
    arquiteto: '',
    crea: '',
    area: '',
    valor: '',
    descricao: ''
  })

  const estatisticasProjetos = [
    { tipo: 'Arquitetônico', submetidos: 45, aprovados: 38, pendentes: 5 },
    { tipo: 'Parcelamento', submetidos: 12, aprovados: 8, pendentes: 3 },
    { tipo: 'Viabilidade', submetidos: 28, aprovados: 20, pendentes: 6 },
    { tipo: 'Edificação', submetidos: 35, aprovados: 28, pendentes: 4 },
    { tipo: 'Reforma', submetidos: 22, aprovados: 18, pendentes: 2 },
    { tipo: 'Demolição', submetidos: 8, aprovados: 7, pendentes: 1 }
  ]

  const statusDistribuicao = [
    { name: 'Aprovados', value: 119, color: '#22C55E' },
    { name: 'Em Análise', value: 32, color: '#3B82F6' },
    { name: 'Pendências', value: 21, color: '#F59E0B' },
    { name: 'Rejeitados', value: 8, color: '#EF4444' }
  ]

  const tempoAnalise = [
    { mes: 'Jan', tempo: 28, projetos: 12 },
    { mes: 'Fev', tempo: 25, projetos: 15 },
    { mes: 'Mar', tempo: 30, projetos: 18 },
    { mes: 'Abr', tempo: 22, projetos: 16 },
    { mes: 'Mai', tempo: 26, projetos: 20 },
    { mes: 'Jun', tempo: 24, projetos: 19 }
  ]

  const filteredProjetos = projetos.filter(projeto => {
    const matchesSearch = projeto.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         projeto.protocolo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         projeto.solicitante.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'todos' || projeto.status === statusFilter
    const matchesTipo = tipoFilter === 'todos' || projeto.tipo === tipoFilter
    return matchesSearch && matchesStatus && matchesTipo
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setShowForm(false)
    setNovoProjeto({
      tipo: '',
      titulo: '',
      solicitante: '',
      cpf: '',
      telefone: '',
      email: '',
      endereco: '',
      arquiteto: '',
      crea: '',
      area: '',
      valor: '',
      descricao: ''
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'aprovado':
        return <Badge className="bg-green-100 text-green-800">Aprovado</Badge>
      case 'em_analise':
        return <Badge className="bg-blue-100 text-blue-800">Em Análise</Badge>
      case 'pendencia':
        return <Badge className="bg-yellow-100 text-yellow-800">Pendência</Badge>
      case 'rejeitado':
        return <Badge className="bg-red-100 text-red-800">Rejeitado</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  const getFaseBadge = (fase: string) => {
    switch (fase) {
      case 'analise_tecnica':
        return <Badge className="bg-blue-100 text-blue-800">Análise Técnica</Badge>
      case 'vistoria':
        return <Badge className="bg-purple-100 text-purple-800">Vistoria</Badge>
      case 'correcoes':
        return <Badge className="bg-orange-100 text-orange-800">Correções</Badge>
      case 'concluido':
        return <Badge className="bg-green-100 text-green-800">Concluído</Badge>
      default:
        return <Badge>{fase}</Badge>
    }
  }

  const getTipoBadge = (tipo: string) => {
    switch (tipo) {
      case 'arquitetonico':
        return <Badge className="bg-blue-100 text-blue-800"><Building2 className="w-3 h-3 mr-1" />Arquitetônico</Badge>
      case 'parcelamento':
        return <Badge className="bg-green-100 text-green-800"><Map className="w-3 h-3 mr-1" />Parcelamento</Badge>
      case 'viabilidade':
        return <Badge className="bg-purple-100 text-purple-800"><Target className="w-3 h-3 mr-1" />Viabilidade</Badge>
      case 'edificacao':
        return <Badge className="bg-orange-100 text-orange-800"><Building2 className="w-3 h-3 mr-1" />Edificação</Badge>
      default:
        return <Badge>{tipo}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Aprovação de Projetos</h1>
          <p className="text-gray-600">Análise técnica e aprovação de projetos urbanísticos e construtivos</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Novo Projeto
        </Button>
      </div>

      <Tabs defaultValue="visao-geral" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="visao-geral">Visão Geral</TabsTrigger>
          <TabsTrigger value="projetos">Projetos</TabsTrigger>
          <TabsTrigger value="analise">Análise</TabsTrigger>
          <TabsTrigger value="servicos">Serviços Gerados</TabsTrigger>
        </TabsList>

        <TabsContent value="visao-geral" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total de Projetos</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">180</div>
                <p className="text-xs text-muted-foreground">+19 este mês</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Aprovados</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">119</div>
                <p className="text-xs text-muted-foreground">66% do total</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Em Análise</CardTitle>
                <Clock className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">32</div>
                <p className="text-xs text-muted-foreground">18% do total</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tempo Médio</CardTitle>
                <TrendingUp className="h-4 w-4 text-purple-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">25</div>
                <p className="text-xs text-muted-foreground">dias de análise</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Projetos por Tipo</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={estatisticasProjetos}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="tipo" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="submetidos" fill="#E5E7EB" name="Submetidos" />
                    <Bar dataKey="aprovados" fill="#22C55E" name="Aprovados" />
                    <Bar dataKey="pendentes" fill="#F59E0B" name="Pendentes" />
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
              <CardTitle>Tempo de Análise Mensal</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={tempoAnalise}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mes" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="tempo" stroke="#3B82F6" name="Tempo (dias)" />
                  <Line type="monotone" dataKey="projetos" stroke="#10B981" name="Projetos" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="projetos" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Filtros e Busca</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="flex items-center space-x-2">
                  <Search className="w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Buscar projetos..."
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
                    <SelectItem value="aprovado">Aprovado</SelectItem>
                    <SelectItem value="em_analise">Em Análise</SelectItem>
                    <SelectItem value="pendencia">Pendência</SelectItem>
                    <SelectItem value="rejeitado">Rejeitado</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={tipoFilter} onValueChange={setTipoFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos os Tipos</SelectItem>
                    <SelectItem value="arquitetonico">Arquitetônico</SelectItem>
                    <SelectItem value="parcelamento">Parcelamento</SelectItem>
                    <SelectItem value="viabilidade">Viabilidade</SelectItem>
                    <SelectItem value="edificacao">Edificação</SelectItem>
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
            {filteredProjetos.map((projeto) => (
              <Card key={projeto.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
                        <FileText className="w-8 h-8 text-blue-600" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-3">
                          <h3 className="text-lg font-semibold">{projeto.protocolo}</h3>
                          {getStatusBadge(projeto.status)}
                          {getFaseBadge(projeto.fase)}
                          {getTipoBadge(projeto.tipo)}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                          <div className="flex items-center space-x-1">
                            <Building2 className="w-4 h-4" />
                            <span>{projeto.titulo}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <User className="w-4 h-4" />
                            <span>{projeto.solicitante}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Phone className="w-4 h-4" />
                            <span>{projeto.telefone}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>Submetido em {projeto.dataSubmissao}</span>
                          </div>
                        </div>
                        <div className="text-sm">
                          <p><strong>Endereço:</strong> {projeto.endereco}</p>
                          <p><strong>Responsável Técnico:</strong> {projeto.arquiteto} - CREA: {projeto.crea}</p>
                          <p><strong>Área:</strong> {projeto.area} | <strong>Valor:</strong> R$ {projeto.valor.toLocaleString()}</p>
                          <p><strong>Analista:</strong> {projeto.analista}</p>
                          {projeto.observacoes && (
                            <p><strong>Observações:</strong> {projeto.observacoes}</p>
                          )}
                        </div>
                        <div className="space-y-2">
                          {projeto.pendencias.length > 0 && (
                            <div>
                              <h4 className="text-sm font-medium text-red-600">Pendências:</h4>
                              <ul className="text-sm text-red-600 list-disc list-inside">
                                {projeto.pendencias.map((pendencia, index) => (
                                  <li key={index}>{pendencia}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {projeto.aprovacoes.length > 0 && (
                            <div>
                              <h4 className="text-sm font-medium text-green-600">Aprovações:</h4>
                              <div className="flex flex-wrap gap-1">
                                {projeto.aprovacoes.map((aprovacao, index) => (
                                  <Badge key={index} className="bg-green-100 text-green-800 text-xs">
                                    {aprovacao}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline">
                            Documentos: {projeto.documentos.length}
                          </Badge>
                          <Badge variant="outline">
                            Prazo: {projeto.prazoAnalise}
                          </Badge>
                          {projeto.dataVistoria && (
                            <Badge variant="outline">
                              Vistoria: {projeto.dataVistoria}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => setEditingProjeto(projeto)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analise" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Fluxo de Análise</CardTitle>
                <CardDescription>Etapas do processo de aprovação</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium">1. Protocolo e Documentação</h4>
                      <p className="text-sm text-gray-600">Verificação de documentos</p>
                    </div>
                    <Badge className="bg-blue-100 text-blue-800">Automático</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium">2. Análise Técnica</h4>
                      <p className="text-sm text-gray-600">Conformidade com normas</p>
                    </div>
                    <Badge className="bg-yellow-100 text-yellow-800">15-20 dias</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium">3. Vistoria Local</h4>
                      <p className="text-sm text-gray-600">Verificação in loco</p>
                    </div>
                    <Badge className="bg-purple-100 text-purple-800">5-7 dias</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium">4. Parecer Final</h4>
                      <p className="text-sm text-gray-600">Aprovação ou correções</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800">3-5 dias</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Estatísticas de Análise</CardTitle>
                <CardDescription>Performance do setor técnico</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Taxa de Aprovação</span>
                    <Badge className="bg-green-100 text-green-800">66%</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Projetos com Pendências</span>
                    <Badge className="bg-yellow-100 text-yellow-800">12%</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Tempo Médio de Análise</span>
                    <Badge className="bg-blue-100 text-blue-800">25 dias</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Projetos em Atraso</span>
                    <Badge className="bg-red-100 text-red-800">8</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Analistas Ativos</span>
                    <Badge className="bg-purple-100 text-purple-800">5</Badge>
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
                      <Building2 className="w-5 h-5 text-blue-500" />
                      <h4 className="font-medium">Aprovação de Projeto Arquitetônico</h4>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      Análise técnica completa de projetos arquitetônicos para construções residenciais e comerciais
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        Análise de conformidade
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        Vistoria técnica
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        Parecer final
                      </div>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Target className="w-5 h-5 text-purple-500" />
                      <h4 className="font-medium">Estudo de Viabilidade</h4>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      Análise prévia de viabilidade para empreendimentos de grande porte
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        Estudo de impacto
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        Análise de viabilidade
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        Diretrizes preliminares
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Map className="w-5 h-5 text-green-500" />
                      <h4 className="font-medium">Projeto de Parcelamento</h4>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      Análise e aprovação de projetos de loteamento e desmembramento
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        Análise urbanística
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        Verificação ambiental
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        Aprovação do parcelamento
                      </div>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <FileText className="w-5 h-5 text-orange-500" />
                      <h4 className="font-medium">Análise Urbanística</h4>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      Análise técnica especializada para conformidade com o plano diretor
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        Verificação de zoneamento
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        Análise de recuos
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        Parecer urbanístico
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
                  Novas submissões realizadas através do catálogo público aparecem aqui para análise técnica,
                  enquanto pareceres e aprovações são refletidos instantaneamente nos serviços públicos.
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
              <CardTitle>Novo Projeto para Análise</CardTitle>
              <CardDescription>Registre um novo projeto para análise técnica</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="tipo">Tipo de Projeto *</Label>
                    <Select value={novoProjeto.tipo} onValueChange={(value) => setNovoProjeto({...novoProjeto, tipo: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="arquitetonico">Arquitetônico</SelectItem>
                        <SelectItem value="parcelamento">Parcelamento</SelectItem>
                        <SelectItem value="viabilidade">Estudo de Viabilidade</SelectItem>
                        <SelectItem value="edificacao">Edificação</SelectItem>
                        <SelectItem value="reforma">Reforma</SelectItem>
                        <SelectItem value="demolicao">Demolição</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="titulo">Título do Projeto *</Label>
                    <Input
                      id="titulo"
                      value={novoProjeto.titulo}
                      onChange={(e) => setNovoProjeto({...novoProjeto, titulo: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="solicitante">Solicitante *</Label>
                    <Input
                      id="solicitante"
                      value={novoProjeto.solicitante}
                      onChange={(e) => setNovoProjeto({...novoProjeto, solicitante: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="cpf">CPF/CNPJ *</Label>
                    <Input
                      id="cpf"
                      value={novoProjeto.cpf}
                      onChange={(e) => setNovoProjeto({...novoProjeto, cpf: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="telefone">Telefone *</Label>
                    <Input
                      id="telefone"
                      value={novoProjeto.telefone}
                      onChange={(e) => setNovoProjeto({...novoProjeto, telefone: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={novoProjeto.email}
                      onChange={(e) => setNovoProjeto({...novoProjeto, email: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="arquiteto">Responsável Técnico</Label>
                    <Input
                      id="arquiteto"
                      value={novoProjeto.arquiteto}
                      onChange={(e) => setNovoProjeto({...novoProjeto, arquiteto: e.target.value})}
                      placeholder="Nome do arquiteto/engenheiro"
                    />
                  </div>
                  <div>
                    <Label htmlFor="crea">CREA/CAU</Label>
                    <Input
                      id="crea"
                      value={novoProjeto.crea}
                      onChange={(e) => setNovoProjeto({...novoProjeto, crea: e.target.value})}
                      placeholder="Número do registro profissional"
                    />
                  </div>
                  <div>
                    <Label htmlFor="area">Área do Projeto</Label>
                    <Input
                      id="area"
                      value={novoProjeto.area}
                      onChange={(e) => setNovoProjeto({...novoProjeto, area: e.target.value})}
                      placeholder="Ex: 180 m²"
                    />
                  </div>
                  <div>
                    <Label htmlFor="valor">Valor do Empreendimento</Label>
                    <Input
                      id="valor"
                      type="number"
                      value={novoProjeto.valor}
                      onChange={(e) => setNovoProjeto({...novoProjeto, valor: e.target.value})}
                      placeholder="Valor em reais"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="endereco">Endereço do Projeto *</Label>
                  <Input
                    id="endereco"
                    value={novoProjeto.endereco}
                    onChange={(e) => setNovoProjeto({...novoProjeto, endereco: e.target.value})}
                    placeholder="Endereço completo onde será executado o projeto"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="descricao">Descrição do Projeto</Label>
                  <Textarea
                    id="descricao"
                    value={novoProjeto.descricao}
                    onChange={(e) => setNovoProjeto({...novoProjeto, descricao: e.target.value})}
                    rows={4}
                    placeholder="Descreva detalhadamente o projeto a ser analisado"
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit">Registrar Projeto</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}