'use client'

import { useState } from 'react'
import { useAdminAuth, useAdminPermissions } from '@/contexts/AdminAuthContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Progress } from '@/components/ui/progress'
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import {
  Calendar, MapPin, Users, Clock, DollarSign, Star, Award, Mic,
  Music, Theater, Palette, Camera, FileText, CheckCircle, AlertTriangle,
  Plus, Edit, Eye, Search, Filter, Download, Upload, Megaphone, Ticket
} from 'lucide-react'

interface EventoCultural {
  id: string
  codigo: string
  nome: string
  categoria: 'festival' | 'show' | 'teatro' | 'exposicao' | 'oficina' | 'palestra' | 'workshop' | 'competicao' | 'feira' | 'comunitario'
  tipo: 'gratuito' | 'pago' | 'misto'
  organizador: string
  local: string
  endereco: string
  data_inicio: string
  data_fim: string
  horario_inicio: string
  horario_fim: string
  capacidade_maxima: number
  inscricoes_abertas: boolean
  valor_ingresso?: number
  publico_alvo: string
  faixa_etaria: string
  descricao: string
  programacao: AtividadeEvento[]
  recursos_necessarios: string[]
  equipe_producao: string[]
  orcamento_total: number
  orcamento_municipal: number
  patrocinadores: string[]
  apoios: string[]
  status: 'planejamento' | 'divulgacao' | 'inscricoes_abertas' | 'em_andamento' | 'finalizado' | 'cancelado'
  inscricoes_realizadas: number
  publico_presente?: number
  avaliacao_media?: number
  fotos: string[]
  videos: string[]
  materiais_divulgacao: string[]
  observacoes: string
}

interface AtividadeEvento {
  id: string
  nome: string
  descricao: string
  data: string
  horario_inicio: string
  horario_fim: string
  local_especifico?: string
  responsavel: string
  capacidade?: number
  material_necessario: string[]
}

interface InscricaoEvento {
  id: string
  eventoId: string
  participante: string
  email: string
  telefone: string
  data_inscricao: string
  tipo_participacao: 'participante' | 'voluntario' | 'colaborador'
  atividades_interesse: string[]
  observacoes: string
  status: 'confirmada' | 'lista_espera' | 'cancelada'
}

export default function EventosPage() {
  const { user } = useAdminAuth()
  const { hasPermission } = useAdminPermissions()

  if (!['admin', 'cultura'].some(permission => hasPermission(permission))) {
    return <div className="p-6">Acesso negado.</div>
  }

  const [eventos, setEventos] = useState<EventoCultural[]>([
    {
      id: '1',
      codigo: 'EVT-2024-001',
      nome: 'Festival de Inverno Cultural',
      categoria: 'festival',
      tipo: 'gratuito',
      organizador: 'Secretaria de Cultura',
      local: 'Praça Central',
      endereco: 'Praça Central, s/n - Centro',
      data_inicio: '2024-07-15',
      data_fim: '2024-07-21',
      horario_inicio: '18:00',
      horario_fim: '22:00',
      capacidade_maxima: 2000,
      inscricoes_abertas: true,
      publico_alvo: 'Famílias e público geral',
      faixa_etaria: 'Livre',
      descricao: 'Festival cultural de inverno com shows, teatro, oficinas e gastronomia local',
      programacao: [
        {
          id: '1',
          nome: 'Show de Abertura',
          descricao: 'Apresentação da banda municipal',
          data: '2024-07-15',
          horario_inicio: '19:00',
          horario_fim: '20:30',
          responsavel: 'João Silva',
          capacidade: 2000,
          material_necessario: ['Palco', 'Som', 'Iluminação']
        }
      ],
      recursos_necessarios: ['Palco principal', 'Sistema de som', 'Iluminação', 'Tendas', 'Banheiros químicos'],
      equipe_producao: ['João Silva - Coordenador', 'Maria Santos - Produção', 'Carlos Costa - Técnico'],
      orcamento_total: 180000,
      orcamento_municipal: 150000,
      patrocinadores: ['Empresa Local Ltda'],
      apoios: ['Rádio Cidade', 'Jornal Municipal'],
      status: 'divulgacao',
      inscricoes_realizadas: 850,
      avaliacao_media: 4.5,
      fotos: [],
      videos: [],
      materiais_divulgacao: ['cartaz_festival.jpg', 'folder_programacao.pdf'],
      observacoes: 'Evento principal do calendário cultural municipal'
    },
    {
      id: '2',
      codigo: 'EVT-2024-002',
      nome: 'Teatro para Crianças - O Pequeno Príncipe',
      categoria: 'teatro',
      tipo: 'gratuito',
      organizador: 'Grupo Teatral Esperança',
      local: 'Teatro Municipal',
      endereco: 'Rua Cultural, 100 - Centro',
      data_inicio: '2024-06-22',
      data_fim: '2024-06-22',
      horario_inicio: '15:00',
      horario_fim: '16:30',
      capacidade_maxima: 300,
      inscricoes_abertas: false,
      publico_alvo: 'Crianças e famílias',
      faixa_etaria: '3 a 12 anos',
      descricao: 'Espetáculo teatral baseado na obra de Saint-Exupéry',
      programacao: [],
      recursos_necessarios: ['Teatro', 'Iluminação cênica', 'Sonoplastia'],
      equipe_producao: ['Ana Costa - Direção', 'Pedro Silva - Ator'],
      orcamento_total: 15000,
      orcamento_municipal: 10000,
      patrocinadores: [],
      apoios: ['Escola Municipal Centro'],
      status: 'finalizado',
      inscricoes_realizadas: 280,
      publico_presente: 275,
      avaliacao_media: 4.8,
      fotos: ['teatro_criancas_1.jpg', 'teatro_criancas_2.jpg'],
      videos: ['video_espetaculo.mp4'],
      materiais_divulgacao: ['cartaz_teatro.jpg'],
      observacoes: 'Excelente receptividade do público infantil'
    }
  ])

  const [inscricoes, setInscricoes] = useState<InscricaoEvento[]>([
    {
      id: '1',
      eventoId: '1',
      participante: 'Maria Silva',
      email: 'maria@email.com',
      telefone: '(11) 99999-9999',
      data_inscricao: '2024-06-10',
      tipo_participacao: 'participante',
      atividades_interesse: ['Show de Abertura', 'Oficinas'],
      observacoes: '',
      status: 'confirmada'
    }
  ])

  const [novoEvento, setNovoEvento] = useState<Partial<EventoCultural>>({
    categoria: 'festival',
    tipo: 'gratuito',
    status: 'planejamento',
    inscricoes_abertas: false,
    programacao: [],
    recursos_necessarios: [],
    equipe_producao: [],
    patrocinadores: [],
    apoios: [],
    fotos: [],
    videos: [],
    materiais_divulgacao: []
  })

  const [filtroStatus, setFiltroStatus] = useState('')
  const [filtroCategoria, setFiltroCategoria] = useState('')
  const [filtroTipo, setFiltroTipo] = useState('')
  const [busca, setBusca] = useState('')
  const [showEventoDialog, setShowEventoDialog] = useState(false)

  const eventosFiltrados = eventos.filter(evento => {
    const matchStatus = !filtroStatus || evento.status === filtroStatus
    const matchCategoria = !filtroCategoria || evento.categoria === filtroCategoria
    const matchTipo = !filtroTipo || evento.tipo === filtroTipo
    const matchBusca = !busca ||
      evento.nome.toLowerCase().includes(busca.toLowerCase()) ||
      evento.organizador.toLowerCase().includes(busca.toLowerCase()) ||
      evento.codigo.toLowerCase().includes(busca.toLowerCase())

    return matchStatus && matchCategoria && matchTipo && matchBusca
  })

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      'planejamento': { variant: 'secondary', label: 'Planejamento' },
      'divulgacao': { variant: 'default', label: 'Divulgação' },
      'inscricoes_abertas': { variant: 'success', label: 'Inscrições Abertas' },
      'em_andamento': { variant: 'default', label: 'Em Andamento' },
      'finalizado': { variant: 'success', label: 'Finalizado' },
      'cancelado': { variant: 'destructive', label: 'Cancelado' }
    }
    const config = variants[status] || { variant: 'default', label: status }
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  const getCategoriaLabel = (categoria: string) => {
    const labels: Record<string, string> = {
      'festival': 'Festival',
      'show': 'Show',
      'teatro': 'Teatro',
      'exposicao': 'Exposição',
      'oficina': 'Oficina',
      'palestra': 'Palestra',
      'workshop': 'Workshop',
      'competicao': 'Competição',
      'feira': 'Feira',
      'comunitario': 'Comunitário'
    }
    return labels[categoria] || categoria
  }

  const getTipoLabel = (tipo: string) => {
    const labels: Record<string, string> = {
      'gratuito': 'Gratuito',
      'pago': 'Pago',
      'misto': 'Misto'
    }
    return labels[tipo] || tipo
  }

  const frequenciaData = [
    { name: 'Jan', eventos: 8, publico: 1200 },
    { name: 'Fev', eventos: 6, publico: 980 },
    { name: 'Mar', eventos: 12, publico: 1800 },
    { name: 'Abr', eventos: 10, publico: 1500 },
    { name: 'Mai', eventos: 15, publico: 2200 }
  ]

  const categoriaData = [
    { name: 'Festival', value: 4, color: '#8B5CF6' },
    { name: 'Show', value: 8, color: '#06B6D4' },
    { name: 'Teatro', value: 6, color: '#84CC16' },
    { name: 'Oficina', value: 5, color: '#F97316' },
    { name: 'Outros', value: 3, color: '#6B7280' }
  ]

  const getPercentualOcupacao = (evento: EventoCultural) => {
    return Math.round((evento.inscricoes_realizadas / evento.capacidade_maxima) * 100)
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Eventos Culturais</h1>
          <p className="text-muted-foreground">
            Gestão completa de eventos culturais municipais
          </p>
        </div>
        <Dialog open={showEventoDialog} onOpenChange={setShowEventoDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Novo Evento
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Novo Evento Cultural</DialogTitle>
              <DialogDescription>
                Registre um novo evento cultural
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Nome do Evento</Label>
                <Input
                  value={novoEvento.nome || ''}
                  onChange={(e) => setNovoEvento({...novoEvento, nome: e.target.value})}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <Label>Categoria</Label>
                  <Select value={novoEvento.categoria} onValueChange={(value) => setNovoEvento({...novoEvento, categoria: value as any})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="festival">Festival</SelectItem>
                      <SelectItem value="show">Show</SelectItem>
                      <SelectItem value="teatro">Teatro</SelectItem>
                      <SelectItem value="exposicao">Exposição</SelectItem>
                      <SelectItem value="oficina">Oficina</SelectItem>
                      <SelectItem value="palestra">Palestra</SelectItem>
                      <SelectItem value="workshop">Workshop</SelectItem>
                      <SelectItem value="competicao">Competição</SelectItem>
                      <SelectItem value="feira">Feira</SelectItem>
                      <SelectItem value="comunitario">Comunitário</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Tipo</Label>
                  <Select value={novoEvento.tipo} onValueChange={(value) => setNovoEvento({...novoEvento, tipo: value as any})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gratuito">Gratuito</SelectItem>
                      <SelectItem value="pago">Pago</SelectItem>
                      <SelectItem value="misto">Misto</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Status</Label>
                  <Select value={novoEvento.status} onValueChange={(value) => setNovoEvento({...novoEvento, status: value as any})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="planejamento">Planejamento</SelectItem>
                      <SelectItem value="divulgacao">Divulgação</SelectItem>
                      <SelectItem value="inscricoes_abertas">Inscrições Abertas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label>Organizador</Label>
                  <Input
                    value={novoEvento.organizador || ''}
                    onChange={(e) => setNovoEvento({...novoEvento, organizador: e.target.value})}
                  />
                </div>
                <div>
                  <Label>Local</Label>
                  <Input
                    value={novoEvento.local || ''}
                    onChange={(e) => setNovoEvento({...novoEvento, local: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <Label>Endereço Completo</Label>
                <Input
                  value={novoEvento.endereco || ''}
                  onChange={(e) => setNovoEvento({...novoEvento, endereco: e.target.value})}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label>Data Início</Label>
                  <Input
                    type="date"
                    value={novoEvento.data_inicio || ''}
                    onChange={(e) => setNovoEvento({...novoEvento, data_inicio: e.target.value})}
                  />
                </div>
                <div>
                  <Label>Data Fim</Label>
                  <Input
                    type="date"
                    value={novoEvento.data_fim || ''}
                    onChange={(e) => setNovoEvento({...novoEvento, data_fim: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <Label>Horário Início</Label>
                  <Input
                    type="time"
                    value={novoEvento.horario_inicio || ''}
                    onChange={(e) => setNovoEvento({...novoEvento, horario_inicio: e.target.value})}
                  />
                </div>
                <div>
                  <Label>Horário Fim</Label>
                  <Input
                    type="time"
                    value={novoEvento.horario_fim || ''}
                    onChange={(e) => setNovoEvento({...novoEvento, horario_fim: e.target.value})}
                  />
                </div>
                <div>
                  <Label>Capacidade Máxima</Label>
                  <Input
                    type="number"
                    value={novoEvento.capacidade_maxima || ''}
                    onChange={(e) => setNovoEvento({...novoEvento, capacidade_maxima: parseInt(e.target.value)})}
                  />
                </div>
              </div>

              <div>
                <Label>Descrição</Label>
                <Textarea
                  value={novoEvento.descricao || ''}
                  onChange={(e) => setNovoEvento({...novoEvento, descricao: e.target.value})}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label>Público-alvo</Label>
                  <Input
                    value={novoEvento.publico_alvo || ''}
                    onChange={(e) => setNovoEvento({...novoEvento, publico_alvo: e.target.value})}
                  />
                </div>
                <div>
                  <Label>Faixa Etária</Label>
                  <Input
                    value={novoEvento.faixa_etaria || ''}
                    onChange={(e) => setNovoEvento({...novoEvento, faixa_etaria: e.target.value})}
                    placeholder="Ex: Livre, 12+, 18+"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label>Orçamento Total (R$)</Label>
                  <Input
                    type="number"
                    value={novoEvento.orcamento_total || ''}
                    onChange={(e) => setNovoEvento({...novoEvento, orcamento_total: parseFloat(e.target.value)})}
                  />
                </div>
                <div>
                  <Label>Orçamento Municipal (R$)</Label>
                  <Input
                    type="number"
                    value={novoEvento.orcamento_municipal || ''}
                    onChange={(e) => setNovoEvento({...novoEvento, orcamento_municipal: parseFloat(e.target.value)})}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => setShowEventoDialog(false)}>
                  Cancelar
                </Button>
                <Button type="submit">Registrar Evento</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="eventos" className="space-y-6">
        <TabsList>
          <TabsTrigger value="eventos">Eventos</TabsTrigger>
          <TabsTrigger value="inscricoes">Inscrições</TabsTrigger>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="servicos">Serviços Gerados</TabsTrigger>
        </TabsList>

        <TabsContent value="eventos" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Filtros e Busca</CardTitle>
              <CardDescription>Filtre e pesquise eventos culturais</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 mb-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar por nome, código ou organizador..."
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
                    <SelectItem value="planejamento">Planejamento</SelectItem>
                    <SelectItem value="divulgacao">Divulgação</SelectItem>
                    <SelectItem value="inscricoes_abertas">Inscrições Abertas</SelectItem>
                    <SelectItem value="em_andamento">Em Andamento</SelectItem>
                    <SelectItem value="finalizado">Finalizado</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filtroCategoria} onValueChange={setFiltroCategoria}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todas</SelectItem>
                    <SelectItem value="festival">Festival</SelectItem>
                    <SelectItem value="show">Show</SelectItem>
                    <SelectItem value="teatro">Teatro</SelectItem>
                    <SelectItem value="oficina">Oficina</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6">
            {eventosFiltrados.map((evento) => (
              <Card key={evento.id} className="overflow-hidden">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Calendar className="h-5 w-5" />
                        {evento.codigo} - {evento.nome}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-4 mt-2">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {evento.local}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {evento.organizador}
                        </span>
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      {getStatusBadge(evento.status)}
                      <Badge variant="outline">{getCategoriaLabel(evento.categoria)}</Badge>
                      <Badge variant="outline">{getTipoLabel(evento.tipo)}</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-3">
                    <div>
                      <Label className="text-sm font-medium">Data e Horário</Label>
                      <p className="text-sm">
                        {new Date(evento.data_inicio).toLocaleDateString('pt-BR')}
                        {evento.data_fim !== evento.data_inicio &&
                          ` a ${new Date(evento.data_fim).toLocaleDateString('pt-BR')}`
                        }
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {evento.horario_inicio} às {evento.horario_fim}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Capacidade</Label>
                      <p className="text-sm">{evento.capacidade_maxima.toLocaleString()} pessoas</p>
                      {evento.inscricoes_realizadas > 0 && (
                        <div className="mt-1">
                          <Progress value={getPercentualOcupacao(evento)} className="h-2" />
                          <span className="text-xs text-muted-foreground">
                            {evento.inscricoes_realizadas} inscritos ({getPercentualOcupacao(evento)}%)
                          </span>
                        </div>
                      )}
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Orçamento</Label>
                      <p className="text-lg font-bold">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
                          .format(evento.orcamento_total)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Municipal: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
                          .format(evento.orcamento_municipal)}
                      </p>
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">Descrição</Label>
                    <p className="text-sm">{evento.descricao}</p>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label className="text-sm font-medium">Público-alvo</Label>
                      <p className="text-sm">{evento.publico_alvo}</p>
                      <p className="text-xs text-muted-foreground">Faixa etária: {evento.faixa_etaria}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Local</Label>
                      <p className="text-sm">{evento.endereco}</p>
                      {evento.valor_ingresso && (
                        <p className="text-xs text-muted-foreground">
                          Ingresso: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
                            .format(evento.valor_ingresso)}
                        </p>
                      )}
                    </div>
                  </div>

                  {evento.recursos_necessarios.length > 0 && (
                    <div>
                      <Label className="text-sm font-medium">Recursos Necessários</Label>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {evento.recursos_necessarios.map((recurso, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {recurso}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {evento.patrocinadores.length > 0 && (
                    <div>
                      <Label className="text-sm font-medium">Patrocinadores</Label>
                      <p className="text-sm text-muted-foreground">
                        {evento.patrocinadores.join(', ')}
                      </p>
                    </div>
                  )}

                  {evento.avaliacao_media && (
                    <div>
                      <Label className="text-sm font-medium">Avaliação</Label>
                      <div className="flex items-center gap-2">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-4 w-4 ${
                                star <= evento.avaliacao_media! ? 'text-yellow-400 fill-current' : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm">{evento.avaliacao_media}/5</span>
                        {evento.publico_presente && (
                          <span className="text-xs text-muted-foreground">
                            ({evento.publico_presente} participantes)
                          </span>
                        )}
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
                      <Users className="h-4 w-4 mr-1" />
                      Inscrições
                    </Button>
                    <Button variant="outline" size="sm">
                      <Megaphone className="h-4 w-4 mr-1" />
                      Divulgar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="inscricoes" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Gestão de Inscrições</CardTitle>
              <CardDescription>Controle de participantes em eventos</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {inscricoes.map((inscricao) => {
                  const evento = eventos.find(e => e.id === inscricao.eventoId)
                  return (
                    <Card key={inscricao.id}>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg">{inscricao.participante}</CardTitle>
                            <CardDescription>
                              {evento?.nome} - {inscricao.tipo_participacao}
                            </CardDescription>
                          </div>
                          <div className="flex gap-2">
                            <Badge variant={inscricao.status === 'confirmada' ? 'default' : 'secondary'}>
                              {inscricao.status.replace('_', ' ')}
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid gap-4 md:grid-cols-3">
                          <div>
                            <Label className="text-sm font-medium">Contato</Label>
                            <p className="text-sm">{inscricao.email}</p>
                            <p className="text-sm">{inscricao.telefone}</p>
                          </div>
                          <div>
                            <Label className="text-sm font-medium">Data da Inscrição</Label>
                            <p className="text-sm">{new Date(inscricao.data_inscricao).toLocaleDateString('pt-BR')}</p>
                          </div>
                          <div>
                            <Label className="text-sm font-medium">Tipo de Participação</Label>
                            <p className="text-sm capitalize">{inscricao.tipo_participacao}</p>
                          </div>
                        </div>
                        {inscricao.atividades_interesse.length > 0 && (
                          <div className="mt-4">
                            <Label className="text-sm font-medium">Atividades de Interesse</Label>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {inscricao.atividades_interesse.map((atividade, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {atividade}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Eventos Ativos</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {eventos.filter(e => ['divulgacao', 'inscricoes_abertas', 'em_andamento'].includes(e.status)).length}
                </div>
                <p className="text-xs text-muted-foreground">em andamento</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Público Total</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {eventos.reduce((acc, e) => acc + e.inscricoes_realizadas, 0).toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">inscrições realizadas</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Investimento</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                    minimumFractionDigits: 0
                  }).format(eventos.reduce((acc, e) => acc + e.orcamento_total, 0))}
                </div>
                <p className="text-xs text-muted-foreground">orçamento total</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Taxa Ocupação</CardTitle>
                <Ticket className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {Math.round(
                    eventos.reduce((acc, e) => acc + getPercentualOcupacao(e), 0) / eventos.length
                  )}%
                </div>
                <p className="text-xs text-muted-foreground">média de ocupação</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Frequência de Eventos</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={frequenciaData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="eventos" stroke="#8884d8" name="Nº Eventos" />
                    <Line type="monotone" dataKey="publico" stroke="#82ca9d" name="Público Total" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Eventos por Categoria</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoriaData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={(entry: any) => `${entry.name} ${(entry.percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categoriaData.map((entry, index) => (
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
                Serviços disponibilizados no catálogo público a partir da gestão de eventos culturais
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <Card className="border-l-4 border-l-blue-500">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Ticket className="h-5 w-5 text-blue-500" />
                      Inscrição em Evento
                    </CardTitle>
                    <CardDescription>
                      Sistema de inscrições para eventos culturais
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="text-sm space-y-1">
                      <li>• Catálogo de eventos disponíveis</li>
                      <li>• Inscrição online gratuita</li>
                      <li>• Confirmação automática</li>
                      <li>• Certificado de participação</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-purple-500">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-purple-500" />
                      Organização de Evento
                    </CardTitle>
                    <CardDescription>
                      Suporte para organização de eventos culturais
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="text-sm space-y-1">
                      <li>• Orientação para organização</li>
                      <li>• Apoio logístico municipal</li>
                      <li>• Cessão de espaços públicos</li>
                      <li>• Divulgação oficial</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-green-500">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Megaphone className="h-5 w-5 text-green-500" />
                      Apoio Logístico
                    </CardTitle>
                    <CardDescription>
                      Suporte operacional para eventos aprovados
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="text-sm space-y-1">
                      <li>• Equipamentos municipais</li>
                      <li>• Apoio de segurança</li>
                      <li>• Infraestrutura básica</li>
                      <li>• Limpeza pós-evento</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-yellow-500">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Star className="h-5 w-5 text-yellow-500" />
                      Divulgação Cultural
                    </CardTitle>
                    <CardDescription>
                      Promoção de eventos nos canais municipais
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="text-sm space-y-1">
                      <li>• Agenda cultural municipal</li>
                      <li>• Redes sociais oficiais</li>
                      <li>• Portal da cidade</li>
                      <li>• Parcerias de mídia</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>

              <div className="mt-6 p-4 bg-muted rounded-lg">
                <div className="flex items-start gap-3">
                  <Award className="h-5 w-5 text-purple-500 mt-0.5" />
                  <div>
                    <h4 className="font-semibold mb-2">Plataforma Cultural Integrada</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      O sistema de eventos culturais alimenta automaticamente o catálogo público
                      com uma agenda cultural completa, permitindo aos cidadãos descobrir,
                      participar e organizar eventos culturais de forma integrada.
                    </p>
                    <div className="grid gap-2 md:grid-cols-2 text-sm">
                      <div>
                        <strong>Inscrições:</strong> Totalmente digitais
                      </div>
                      <div>
                        <strong>Divulgação:</strong> Multi-canal
                      </div>
                      <div>
                        <strong>Gestão:</strong> Centralizada
                      </div>
                      <div>
                        <strong>Participação:</strong> Facilitada
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