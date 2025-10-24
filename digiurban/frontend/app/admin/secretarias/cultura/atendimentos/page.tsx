'use client'

import { useState, useEffect } from 'react'
import { useAdminAuth, useAdminPermissions } from '@/contexts/AdminAuthContext'
import { useCulturalAttendances } from '@/hooks/api/culture/useCulturalAttendances'
import type { AtendimentoCultural, CulturalAttendanceType, CulturalAttendanceStatus } from '@/types/cultural-attendance'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import {
  Theater, Users, Calendar, FileText, MapPin, Palette, Music,
  Camera, Star, Award, Clock, CheckCircle, AlertCircle, Filter, Search,
  Plus, Eye, Edit, Download, Trash2, Heart, Sparkles
} from 'lucide-react'

// Using centralized types from @/types/cultural-attendance

export default function AtendimentosCulturaPage() {
  const { user } = useAdminAuth()
  const { hasPermission } = useAdminPermissions()

  if (!['admin', 'cultura'].some(permission => hasPermission(permission))) {
    return <div className="p-6">Acesso negado.</div>
  }

  const [atendimentos, setAtendimentos] = useState<AtendimentoCultural[]>([
    {
      id: '1',
      protocolo: 'CUL-2024-001',
      data: '2024-05-20',
      cidadao: 'Maria Silva',
      contato: '(11) 99999-9999',
      tipo: 'autorizacao_evento',
      categoria: 'musica',
      descricao: 'Solicitação de autorização para show de música popular brasileira na praça central',
      local_solicitado: 'Praça Central',
      data_evento: '2024-06-15',
      publico_estimado: 500,
      orcamento_solicitado: 15000,
      status: 'em_analise',
      prioridade: 'media',
      responsavel: 'João Santos',
      observacoes: 'Aguardando análise da estrutura necessária',
      anexos: ['projeto_evento.pdf', 'autorizacao_bombeiros.pdf'],
      createdAt: '2024-05-20T08:00:00Z',
      updatedAt: '2024-05-20T08:00:00Z'
    },
    {
      id: '2',
      protocolo: 'CUL-2024-002',
      data: '2024-05-18',
      cidadao: 'Carlos Oliveira',
      contato: 'carlos@email.com',
      tipo: 'apoio_artistico',
      categoria: 'teatro',
      descricao: 'Solicitação de apoio para grupo teatral local - peça infantil',
      publico_estimado: 200,
      orcamento_solicitado: 8000,
      status: 'aprovado',
      prioridade: 'alta',
      responsavel: 'Ana Costa',
      observacoes: 'Apoio aprovado - agendamento de espaço necessário',
      anexos: ['projeto_teatral.pdf'],
      createdAt: '2024-05-18T08:00:00Z',
      updatedAt: '2024-05-18T08:00:00Z'
    }
  ])

  const [novoAtendimento, setNovoAtendimento] = useState<Partial<AtendimentoCultural>>({
    tipo: 'informacoes_gerais',
    categoria: 'musica',
    status: 'aberto',
    prioridade: 'media'
  })

  const [filtroStatus, setFiltroStatus] = useState('')
  const [filtroTipo, setFiltroTipo] = useState('')
  const [filtroCategoria, setFiltroCategoria] = useState('')
  const [busca, setBusca] = useState('')
  const [showDialog, setShowDialog] = useState(false)

  const atendimentosFiltrados = atendimentos.filter(atendimento => {
    const matchStatus = !filtroStatus || atendimento.status === filtroStatus
    const matchTipo = !filtroTipo || atendimento.tipo === filtroTipo
    const matchCategoria = !filtroCategoria || atendimento.categoria === filtroCategoria
    const matchBusca = !busca ||
      atendimento.cidadao.toLowerCase().includes(busca.toLowerCase()) ||
      atendimento.protocolo.toLowerCase().includes(busca.toLowerCase()) ||
      atendimento.descricao.toLowerCase().includes(busca.toLowerCase())

    return matchStatus && matchTipo && matchCategoria && matchBusca
  })

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      'aberto': { variant: 'secondary', label: 'Aberto' },
      'em_analise': { variant: 'default', label: 'Em Análise' },
      'aprovado': { variant: 'success', label: 'Aprovado' },
      'negado': { variant: 'destructive', label: 'Negado' },
      'concluido': { variant: 'success', label: 'Concluído' }
    }
    const config = variants[status] || { variant: 'default', label: status }
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  const getPrioridadeBadge = (prioridade: string | undefined) => {
    const variants: Record<string, any> = {
      'baixa': { variant: 'secondary', label: 'Baixa' },
      'media': { variant: 'default', label: 'Média' },
      'alta': { variant: 'destructive', label: 'Alta' },
      'urgente': { variant: 'destructive', label: 'Urgente' }
    }
    const config = prioridade ? (variants[prioridade] || { variant: 'default', label: prioridade }) : { variant: 'outline', label: 'Não definida' }
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  const getTipoLabel = (tipo: string) => {
    const labels: Record<string, string> = {
      'autorizacao_evento': 'Autorização de Evento',
      'apoio_artistico': 'Apoio Artístico',
      'fomento_cultural': 'Fomento Cultural',
      'informacoes_gerais': 'Informações Gerais',
      'espaco_cultural': 'Espaço Cultural',
      'projeto_cultural': 'Projeto Cultural'
    }
    return labels[tipo] || tipo
  }

  const getCategoriaLabel = (categoria: string | undefined) => {
    const labels: Record<string, string> = {
      'musica': 'Música',
      'teatro': 'Teatro',
      'danca': 'Dança',
      'artes_visuais': 'Artes Visuais',
      'literatura': 'Literatura',
      'audiovisual': 'Audiovisual',
      'cultura_popular': 'Cultura Popular',
      'patrimonio': 'Patrimônio'
    }
    return categoria ? (labels[categoria] || categoria) : 'Não definida'
  }

  const statsData = [
    { name: 'Jan', atendimentos: 45, aprovados: 38 },
    { name: 'Fev', atendimentos: 52, aprovados: 44 },
    { name: 'Mar', atendimentos: 48, aprovados: 41 },
    { name: 'Abr', atendimentos: 61, aprovados: 52 },
    { name: 'Mai', atendimentos: 55, aprovados: 48 }
  ]

  const tipoData = [
    { name: 'Autorização Evento', value: 35, color: '#8B5CF6' },
    { name: 'Apoio Artístico', value: 28, color: '#06B6D4' },
    { name: 'Fomento Cultural', value: 18, color: '#84CC16' },
    { name: 'Informações', value: 15, color: '#F97316' },
    { name: 'Outros', value: 4, color: '#6B7280' }
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!novoAtendimento.cidadao || !novoAtendimento.descricao) return

    const now = new Date().toISOString()
    const novo: AtendimentoCultural = {
      id: Date.now().toString(),
      protocolo: `CUL-2024-${(atendimentos.length + 1).toString().padStart(3, '0')}`,
      data: new Date().toISOString().split('T')[0],
      cidadao: novoAtendimento.cidadao!,
      contato: novoAtendimento.contato || '',
      tipo: novoAtendimento.tipo!,
      categoria: novoAtendimento.categoria,
      descricao: novoAtendimento.descricao!,
      local_solicitado: novoAtendimento.local_solicitado,
      data_evento: novoAtendimento.data_evento,
      publico_estimado: novoAtendimento.publico_estimado,
      orcamento_solicitado: novoAtendimento.orcamento_solicitado,
      status: 'aberto',
      prioridade: novoAtendimento.prioridade,
      observacoes: novoAtendimento.observacoes || '',
      anexos: [],
      createdAt: now,
      updatedAt: now
    }

    setAtendimentos([...atendimentos, novo])
    setNovoAtendimento({
      tipo: 'informacoes_gerais',
      categoria: 'musica',
      status: 'aberto',
      prioridade: 'media'
    })
    setShowDialog(false)
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Atendimentos Culturais</h1>
          <p className="text-muted-foreground">
            Gestão de solicitações e apoio cultural municipal
          </p>
        </div>
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Novo Atendimento
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Novo Atendimento Cultural</DialogTitle>
              <DialogDescription>
                Registre uma nova solicitação cultural
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label>Cidadão/Solicitante</Label>
                  <Input
                    value={novoAtendimento.cidadao || ''}
                    onChange={(e) => setNovoAtendimento({...novoAtendimento, cidadao: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label>Contato</Label>
                  <Input
                    value={novoAtendimento.contato || ''}
                    onChange={(e) => setNovoAtendimento({...novoAtendimento, contato: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label>Tipo de Atendimento</Label>
                  <Select value={novoAtendimento.tipo} onValueChange={(value) => setNovoAtendimento({...novoAtendimento, tipo: value as any})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="autorizacao_evento">Autorização de Evento</SelectItem>
                      <SelectItem value="apoio_artistico">Apoio Artístico</SelectItem>
                      <SelectItem value="fomento_cultural">Fomento Cultural</SelectItem>
                      <SelectItem value="informacoes_gerais">Informações Gerais</SelectItem>
                      <SelectItem value="espaco_cultural">Espaço Cultural</SelectItem>
                      <SelectItem value="projeto_cultural">Projeto Cultural</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Categoria</Label>
                  <Select value={novoAtendimento.categoria} onValueChange={(value) => setNovoAtendimento({...novoAtendimento, categoria: value as any})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="musica">Música</SelectItem>
                      <SelectItem value="teatro">Teatro</SelectItem>
                      <SelectItem value="danca">Dança</SelectItem>
                      <SelectItem value="artes_visuais">Artes Visuais</SelectItem>
                      <SelectItem value="literatura">Literatura</SelectItem>
                      <SelectItem value="audiovisual">Audiovisual</SelectItem>
                      <SelectItem value="cultura_popular">Cultura Popular</SelectItem>
                      <SelectItem value="patrimonio">Patrimônio</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label>Descrição da Solicitação</Label>
                <Textarea
                  value={novoAtendimento.descricao || ''}
                  onChange={(e) => setNovoAtendimento({...novoAtendimento, descricao: e.target.value})}
                  required
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label>Local Solicitado (se aplicável)</Label>
                  <Input
                    value={novoAtendimento.local_solicitado || ''}
                    onChange={(e) => setNovoAtendimento({...novoAtendimento, local_solicitado: e.target.value})}
                  />
                </div>
                <div>
                  <Label>Data do Evento (se aplicável)</Label>
                  <Input
                    type="date"
                    value={novoAtendimento.data_evento || ''}
                    onChange={(e) => setNovoAtendimento({...novoAtendimento, data_evento: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label>Público Estimado</Label>
                  <Input
                    type="number"
                    value={novoAtendimento.publico_estimado || ''}
                    onChange={(e) => setNovoAtendimento({...novoAtendimento, publico_estimado: parseInt(e.target.value)})}
                  />
                </div>
                <div>
                  <Label>Orçamento Solicitado (R$)</Label>
                  <Input
                    type="number"
                    value={novoAtendimento.orcamento_solicitado || ''}
                    onChange={(e) => setNovoAtendimento({...novoAtendimento, orcamento_solicitado: parseFloat(e.target.value)})}
                  />
                </div>
              </div>

              <div>
                <Label>Prioridade</Label>
                <Select value={novoAtendimento.prioridade} onValueChange={(value) => setNovoAtendimento({...novoAtendimento, prioridade: value as any})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="baixa">Baixa</SelectItem>
                    <SelectItem value="media">Média</SelectItem>
                    <SelectItem value="alta">Alta</SelectItem>
                    <SelectItem value="urgente">Urgente</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Observações</Label>
                <Textarea
                  value={novoAtendimento.observacoes || ''}
                  onChange={(e) => setNovoAtendimento({...novoAtendimento, observacoes: e.target.value})}
                />
              </div>

              <div className="flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => setShowDialog(false)}>
                  Cancelar
                </Button>
                <Button type="submit">Registrar Atendimento</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="lista" className="space-y-6">
        <TabsList>
          <TabsTrigger value="lista">Lista de Atendimentos</TabsTrigger>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="servicos">Serviços Gerados</TabsTrigger>
        </TabsList>

        <TabsContent value="lista" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Filtros e Busca</CardTitle>
              <CardDescription>Filtre e pesquise atendimentos culturais</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 mb-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar por cidadão, protocolo ou descrição..."
                      value={busca}
                      onChange={(e) => setBusca(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                </div>
                <Select value={filtroStatus} onValueChange={setFiltroStatus}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todos</SelectItem>
                    <SelectItem value="aberto">Aberto</SelectItem>
                    <SelectItem value="em_analise">Em Análise</SelectItem>
                    <SelectItem value="aprovado">Aprovado</SelectItem>
                    <SelectItem value="negado">Negado</SelectItem>
                    <SelectItem value="concluido">Concluído</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filtroTipo} onValueChange={setFiltroTipo}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todos</SelectItem>
                    <SelectItem value="autorizacao_evento">Autorização Evento</SelectItem>
                    <SelectItem value="apoio_artistico">Apoio Artístico</SelectItem>
                    <SelectItem value="fomento_cultural">Fomento Cultural</SelectItem>
                    <SelectItem value="informacoes_gerais">Informações</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6">
            {atendimentosFiltrados.map((atendimento) => (
              <Card key={atendimento.id} className="overflow-hidden">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Theater className="h-5 w-5" />
                        {atendimento.protocolo} - {atendimento.cidadao}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-4 mt-2">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(atendimento.data).toLocaleDateString('pt-BR')}
                        </span>
                        <span className="flex items-center gap-1">
                          <Palette className="h-4 w-4" />
                          {getCategoriaLabel(atendimento.categoria)}
                        </span>
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      {getStatusBadge(atendimento.status)}
                      {getPrioridadeBadge(atendimento.prioridade)}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium">Tipo de Atendimento</Label>
                    <p className="text-sm">{getTipoLabel(atendimento.tipo)}</p>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">Descrição</Label>
                    <p className="text-sm">{atendimento.descricao}</p>
                  </div>

                  {(atendimento.local_solicitado || atendimento.data_evento) && (
                    <div className="grid gap-4 md:grid-cols-2">
                      {atendimento.local_solicitado && (
                        <div>
                          <Label className="text-sm font-medium">Local Solicitado</Label>
                          <p className="text-sm">{atendimento.local_solicitado}</p>
                        </div>
                      )}
                      {atendimento.data_evento && (
                        <div>
                          <Label className="text-sm font-medium">Data do Evento</Label>
                          <p className="text-sm">{new Date(atendimento.data_evento).toLocaleDateString('pt-BR')}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {(atendimento.publico_estimado || atendimento.orcamento_solicitado) && (
                    <div className="grid gap-4 md:grid-cols-2">
                      {atendimento.publico_estimado && (
                        <div>
                          <Label className="text-sm font-medium">Público Estimado</Label>
                          <p className="text-sm">{atendimento.publico_estimado.toLocaleString()} pessoas</p>
                        </div>
                      )}
                      {atendimento.orcamento_solicitado && (
                        <div>
                          <Label className="text-sm font-medium">Orçamento Solicitado</Label>
                          <p className="text-sm">
                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
                              .format(atendimento.orcamento_solicitado)}
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {atendimento.responsavel && (
                    <div>
                      <Label className="text-sm font-medium">Responsável</Label>
                      <p className="text-sm">{atendimento.responsavel}</p>
                    </div>
                  )}

                  {atendimento.observacoes && (
                    <div>
                      <Label className="text-sm font-medium">Observações</Label>
                      <p className="text-sm text-muted-foreground">{atendimento.observacoes}</p>
                    </div>
                  )}

                  {(atendimento.anexos?.length || 0) > 0 && (
                    <div>
                      <Label className="text-sm font-medium">Anexos</Label>
                      <div className="flex gap-2 mt-1">
                        {atendimento.anexos?.map((anexo: string, index: number) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            <FileText className="h-3 w-3 mr-1" />
                            {anexo}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-1" />
                      Detalhes
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4 mr-1" />
                      Editar
                    </Button>
                    <Button variant="outline" size="sm">
                      <FileText className="h-4 w-4 mr-1" />
                      Protocolo
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Atendimentos</CardTitle>
                <Theater className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{atendimentos.length}</div>
                <p className="text-xs text-muted-foreground">este mês</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Em Análise</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {atendimentos.filter(a => a.status === 'em_analise').length}
                </div>
                <p className="text-xs text-muted-foreground">aguardando análise</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Aprovados</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {atendimentos.filter(a => a.status === 'aprovado').length}
                </div>
                <p className="text-xs text-muted-foreground">projetos aprovados</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Investimento Total</CardTitle>
                <Award className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                    minimumFractionDigits: 0
                  }).format(atendimentos.reduce((acc, a) => acc + (a.orcamento_solicitado || 0), 0))}
                </div>
                <p className="text-xs text-muted-foreground">em projetos</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Evolução de Atendimentos</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={statsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="atendimentos" stroke="#8884d8" name="Total" />
                    <Line type="monotone" dataKey="aprovados" stroke="#82ca9d" name="Aprovados" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tipos de Atendimento</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={tipoData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={(entry: any) => `${entry.name} ${(entry.percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {tipoData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="servicos" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Serviços Gerados Automaticamente</CardTitle>
              <CardDescription>
                Serviços disponibilizados no catálogo público a partir dos atendimentos culturais
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <Card className="border-l-4 border-l-purple-500">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Theater className="h-5 w-5 text-purple-500" />
                      Autorização de Evento Cultural
                    </CardTitle>
                    <CardDescription>
                      Solicitação de licença para eventos culturais públicos
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="text-sm space-y-1">
                      <li>• Formulário de solicitação</li>
                      <li>• Upload de documentos</li>
                      <li>• Acompanhamento de aprovação</li>
                      <li>• Licença digital</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-blue-500">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Users className="h-5 w-5 text-blue-500" />
                      Apoio a Artistas
                    </CardTitle>
                    <CardDescription>
                      Solicitação de apoio municipal a artistas locais
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="text-sm space-y-1">
                      <li>• Cadastro de artista/grupo</li>
                      <li>• Solicitação de apoio</li>
                      <li>• Avaliação de projeto</li>
                      <li>• Acompanhamento financeiro</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-green-500">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Award className="h-5 w-5 text-green-500" />
                      Fomento Cultural
                    </CardTitle>
                    <CardDescription>
                      Programa de incentivo à cultura municipal
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="text-sm space-y-1">
                      <li>• Editais culturais</li>
                      <li>• Submissão de projetos</li>
                      <li>• Processo seletivo</li>
                      <li>• Prestação de contas</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-yellow-500">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <FileText className="h-5 w-5 text-yellow-500" />
                      Informações Culturais
                    </CardTitle>
                    <CardDescription>
                      Central de informações sobre cultura municipal
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="text-sm space-y-1">
                      <li>• Agenda cultural</li>
                      <li>• Espaços disponíveis</li>
                      <li>• Programas em andamento</li>
                      <li>• Orientações gerais</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>

              <div className="mt-6 p-4 bg-muted rounded-lg">
                <div className="flex items-start gap-3">
                  <Sparkles className="h-5 w-5 text-purple-500 mt-0.5" />
                  <div>
                    <h4 className="font-semibold mb-2">Integração Cultural</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      O sistema de atendimentos culturais alimenta automaticamente o catálogo público,
                      oferecendo aos cidadãos acesso direto a todos os serviços e programas culturais
                      municipais com acompanhamento em tempo real.
                    </p>
                    <div className="grid gap-2 md:grid-cols-2 text-sm">
                      <div>
                        <strong>Atendimento:</strong> Presencial e digital
                      </div>
                      <div>
                        <strong>Aprovação:</strong> Processo transparente
                      </div>
                      <div>
                        <strong>Acompanhamento:</strong> Tempo real
                      </div>
                      <div>
                        <strong>Integração:</strong> Catálogo público
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}