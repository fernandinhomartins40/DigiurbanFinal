'use client'

import { useAdminAuth } from '@/contexts/AdminAuthContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Calendar,
  Clock,
  Users,
  School,
  PartyPopper,
  GraduationCap,
  BookOpen,
  Heart,
  MapPin,
  Bell,
  CheckCircle,
  AlertCircle,
  Calendar1,
  CalendarDays,
  Plus,
  Search,
  Filter,
  Download
} from 'lucide-react'
import { useState } from 'react'

const eventosEscolares = [
  {
    id: 1,
    titulo: 'Reunião de Pais - 1º Bimestre',
    tipo: 'reuniao-pais',
    data: '2024-01-25',
    horario: '19:00',
    local: 'EMEF João da Silva',
    participantes: 150,
    confirmados: 89,
    descricao: 'Apresentação dos resultados do 1º bimestre e orientações pedagógicas',
    responsavel: 'Coordenação Pedagógica',
    status: 'confirmado'
  },
  {
    id: 2,
    titulo: 'Festa Junina',
    tipo: 'festa',
    data: '2024-06-15',
    horario: '18:00',
    local: 'Pátio da EMEI Maria Montessori',
    participantes: 300,
    confirmados: 0,
    descricao: 'Festa tradicional com apresentações dos alunos, comidas típicas e brincadeiras',
    responsavel: 'Direção da Escola',
    status: 'planejado'
  },
  {
    id: 3,
    titulo: 'Formatura do 9º Ano',
    tipo: 'formatura',
    data: '2024-12-15',
    horario: '19:30',
    local: 'Centro Cultural Municipal',
    participantes: 80,
    confirmados: 0,
    descricao: 'Cerimônia de formatura dos alunos concluintes do Ensino Fundamental',
    responsavel: 'Secretaria de Educação',
    status: 'planejado'
  },
  {
    id: 4,
    titulo: 'Semana de Arte e Cultura',
    tipo: 'evento-cultural',
    data: '2024-09-23',
    horario: '08:00',
    local: 'Todas as escolas',
    participantes: 800,
    confirmados: 0,
    descricao: 'Semana dedicada a exposições, apresentações e atividades culturais',
    responsavel: 'Coordenação Cultural',
    status: 'planejado'
  }
]

const calendarioLetivo = {
  anoLetivo: 2024,
  inicioAulas: '2024-02-05',
  terminoAulas: '2024-12-20',
  diasLetivos: 200,
  diasCorridos: 318,
  feriados: [
    { data: '2024-02-12', nome: 'Carnaval' },
    { data: '2024-02-13', nome: 'Carnaval' },
    { data: '2024-04-21', nome: 'Tiradentes' },
    { data: '2024-05-01', nome: 'Dia do Trabalhador' },
    { data: '2024-09-07', nome: 'Independência do Brasil' },
    { data: '2024-10-12', nome: 'Nossa Senhora Aparecida' },
    { data: '2024-11-02', nome: 'Finados' },
    { data: '2024-11-15', nome: 'Proclamação da República' },
    { data: '2024-12-25', nome: 'Natal' }
  ],
  ferias: [
    { inicio: '2024-07-01', fim: '2024-07-31', tipo: 'Férias de Julho' },
    { inicio: '2024-12-21', fim: '2025-02-04', tipo: 'Férias de Verão' }
  ],
  recessos: [
    { inicio: '2024-03-29', fim: '2024-04-01', tipo: 'Recesso de Páscoa' },
    { inicio: '2024-10-07', fim: '2024-10-11', tipo: 'Recesso Escolar' }
  ]
}

const proximosEventos = [
  {
    data: '2024-01-25',
    evento: 'Reunião de Pais - 1º Bimestre',
    tipo: 'reuniao',
    escola: 'EMEF João da Silva',
    diasRestantes: 3
  },
  {
    data: '2024-01-30',
    evento: 'Conselho de Classe',
    tipo: 'academico',
    escola: 'Todas as escolas',
    diasRestantes: 8
  },
  {
    data: '2024-02-05',
    evento: 'Início do Ano Letivo 2024',
    tipo: 'academico',
    escola: 'Rede Municipal',
    diasRestantes: 14
  },
  {
    data: '2024-02-14',
    evento: 'Dia do Amor - Atividades Especiais',
    tipo: 'comemorativo',
    escola: 'Educação Infantil',
    diasRestantes: 23
  }
]

const servicosGerados = [
  'Calendário Letivo',
  'Eventos Escolares',
  'Reunião de Pais',
  'Formatura',
  'Confirmação de Presença',
  'Notificações de Eventos',
  'Agenda Escolar'
]

export default function CalendarioEscolarPage() {
  const { user } = useAdminAuth()
  const [novoEvento, setNovoEvento] = useState({
    titulo: '',
    tipo: '',
    data: '',
    horario: '',
    local: '',
    participantes: '',
    descricao: ''
  })

  const getStatusEventoBadge = (status: string) => {
    switch (status) {
      case 'confirmado':
        return <Badge className="bg-green-500 text-white">Confirmado</Badge>
      case 'planejado':
        return <Badge className="bg-blue-500 text-white">Planejado</Badge>
      case 'cancelado':
        return <Badge variant="destructive">Cancelado</Badge>
      case 'adiado':
        return <Badge className="bg-yellow-500 text-white">Adiado</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getTipoEventoBadge = (tipo: string) => {
    switch (tipo) {
      case 'reuniao-pais':
        return <Badge variant="outline" className="text-blue-600">Reunião de Pais</Badge>
      case 'festa':
        return <Badge variant="outline" className="text-purple-600">Festa</Badge>
      case 'formatura':
        return <Badge variant="outline" className="text-green-600">Formatura</Badge>
      case 'evento-cultural':
        return <Badge variant="outline" className="text-orange-600">Cultural</Badge>
      case 'academico':
        return <Badge variant="outline" className="text-red-600">Acadêmico</Badge>
      case 'comemorativo':
        return <Badge variant="outline" className="text-pink-600">Comemorativo</Badge>
      default:
        return <Badge variant="outline">{tipo}</Badge>
    }
  }

  const getTipoEventoIcon = (tipo: string) => {
    switch (tipo) {
      case 'reuniao-pais':
        return <Users className="h-4 w-4 text-blue-600" />
      case 'festa':
        return <PartyPopper className="h-4 w-4 text-purple-600" />
      case 'formatura':
        return <GraduationCap className="h-4 w-4 text-green-600" />
      case 'evento-cultural':
        return <BookOpen className="h-4 w-4 text-orange-600" />
      case 'academico':
        return <School className="h-4 w-4 text-red-600" />
      case 'comemorativo':
        return <Heart className="h-4 w-4 text-pink-600" />
      default:
        return <Calendar className="h-4 w-4 text-gray-600" />
    }
  }

  const calcularConfirmacoes = (confirmados: number, participantes: number) => {
    if (participantes === 0) return 0
    return Math.round((confirmados / participantes) * 100)
  }

  const getDiasRestantesColor = (dias: number) => {
    if (dias <= 3) return 'text-red-600'
    if (dias <= 7) return 'text-yellow-600'
    return 'text-green-600'
  }

  const formatarData = (data: string) => {
    const date = new Date(data)
    return date.toLocaleDateString('pt-BR')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Calendar className="h-8 w-8 text-blue-600 mr-3" />
            Calendário Escolar
          </h1>
          <p className="text-gray-600 mt-1">
            Gestão de eventos escolares, cronograma, participantes e notificações
          </p>
        </div>
        <Badge variant="outline" className="text-blue-600 border-blue-200">
          Ano Letivo {calendarioLetivo.anoLetivo}
        </Badge>
      </div>

      {/* Informações do Ano Letivo */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Dias Letivos</CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{calendarioLetivo.diasLetivos}</div>
            <p className="text-xs text-muted-foreground">
              Obrigatórios no ano
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Início das Aulas</CardTitle>
            <Calendar1 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">05/02</div>
            <p className="text-xs text-muted-foreground">
              Segunda-feira
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Eventos Programados</CardTitle>
            <PartyPopper className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">
              Durante o ano
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Próximo Evento</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">3</div>
            <p className="text-xs text-muted-foreground">
              dias
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Novo Evento */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Plus className="h-5 w-5 mr-2" />
              Novo Evento
            </CardTitle>
            <CardDescription>
              Agendar evento escolar
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="titulo">Título do Evento</Label>
              <Input
                id="titulo"
                placeholder="Nome do evento"
                value={novoEvento.titulo}
                onChange={(e) => setNovoEvento(prev => ({ ...prev, titulo: e.target.value }))}
              />
            </div>

            <div>
              <Label htmlFor="tipo">Tipo de Evento</Label>
              <Select value={novoEvento.tipo} onValueChange={(value) => setNovoEvento(prev => ({ ...prev, tipo: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="reuniao-pais">Reunião de Pais</SelectItem>
                  <SelectItem value="festa">Festa</SelectItem>
                  <SelectItem value="formatura">Formatura</SelectItem>
                  <SelectItem value="evento-cultural">Evento Cultural</SelectItem>
                  <SelectItem value="academico">Acadêmico</SelectItem>
                  <SelectItem value="comemorativo">Comemorativo</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="data">Data</Label>
                <Input
                  id="data"
                  type="date"
                  value={novoEvento.data}
                  onChange={(e) => setNovoEvento(prev => ({ ...prev, data: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="horario">Horário</Label>
                <Input
                  id="horario"
                  type="time"
                  value={novoEvento.horario}
                  onChange={(e) => setNovoEvento(prev => ({ ...prev, horario: e.target.value }))}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="local">Local</Label>
              <Input
                id="local"
                placeholder="Local do evento"
                value={novoEvento.local}
                onChange={(e) => setNovoEvento(prev => ({ ...prev, local: e.target.value }))}
              />
            </div>

            <div>
              <Label htmlFor="participantes">Número de Participantes</Label>
              <Input
                id="participantes"
                type="number"
                placeholder="Quantidade esperada"
                value={novoEvento.participantes}
                onChange={(e) => setNovoEvento(prev => ({ ...prev, participantes: e.target.value }))}
              />
            </div>

            <div>
              <Label htmlFor="descricao">Descrição</Label>
              <Textarea
                id="descricao"
                placeholder="Descrição do evento"
                value={novoEvento.descricao}
                onChange={(e) => setNovoEvento(prev => ({ ...prev, descricao: e.target.value }))}
                rows={3}
              />
            </div>

            <Button className="w-full">
              <Calendar className="h-4 w-4 mr-2" />
              Agendar Evento
            </Button>
          </CardContent>
        </Card>

        {/* Eventos Escolares */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Eventos Escolares</CardTitle>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Search className="h-4 w-4 mr-2" />
                  Buscar
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Exportar
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {eventosEscolares.map((evento) => (
                <div key={evento.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      {getTipoEventoIcon(evento.tipo)}
                      <div>
                        <h4 className="font-semibold">{evento.titulo}</h4>
                        <p className="text-sm text-gray-600">{formatarData(evento.data)} às {evento.horario}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getTipoEventoBadge(evento.tipo)}
                      {getStatusEventoBadge(evento.status)}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                    <div>
                      <span className="text-gray-500">Local:</span>
                      <p className="font-medium">{evento.local}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Participantes:</span>
                      <p className="font-medium">{evento.participantes} esperados</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Confirmações:</span>
                      <p className="font-medium">
                        {evento.confirmados} ({calcularConfirmacoes(evento.confirmados, evento.participantes)}%)
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-500">Responsável:</span>
                      <p className="font-medium">{evento.responsavel}</p>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 mb-3">{evento.descricao}</p>

                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">
                      <Users className="h-4 w-4 mr-2" />
                      Participantes
                    </Button>
                    <Button size="sm" variant="outline">
                      <Bell className="h-4 w-4 mr-2" />
                      Notificar
                    </Button>
                    <Button size="sm" variant="outline">
                      <MapPin className="h-4 w-4 mr-2" />
                      Local
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Próximos Eventos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              Próximos Eventos
            </CardTitle>
            <CardDescription>
              Agenda dos próximos dias
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {proximosEventos.map((evento, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    {getTipoEventoIcon(evento.tipo)}
                    <div>
                      <h4 className="font-medium text-sm">{evento.evento}</h4>
                      <p className="text-sm text-gray-600">{evento.escola}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{formatarData(evento.data)}</p>
                    <p className={`text-xs font-bold ${getDiasRestantesColor(evento.diasRestantes)}`}>
                      {evento.diasRestantes} dias
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Informações do Calendário */}
        <Card>
          <CardHeader>
            <CardTitle>Calendário Letivo 2024</CardTitle>
            <CardDescription>
              Datas importantes do ano letivo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-sm mb-2">Período Letivo</h4>
                <div className="flex items-center justify-between text-sm">
                  <span>Início:</span>
                  <span className="font-medium">{formatarData(calendarioLetivo.inicioAulas)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Término:</span>
                  <span className="font-medium">{formatarData(calendarioLetivo.terminoAulas)}</span>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-sm mb-2">Férias Escolares</h4>
                {calendarioLetivo.ferias.map((ferias, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <span>{ferias.tipo}:</span>
                    <span className="font-medium">
                      {formatarData(ferias.inicio)} a {formatarData(ferias.fim)}
                    </span>
                  </div>
                ))}
              </div>

              <div>
                <h4 className="font-medium text-sm mb-2">Próximos Feriados</h4>
                {calendarioLetivo.feriados.slice(0, 3).map((feriado, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <span>{feriado.nome}:</span>
                    <span className="font-medium">{formatarData(feriado.data)}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Serviços Gerados Automaticamente */}
      <Card>
        <CardHeader>
          <CardTitle>Serviços Gerados Automaticamente</CardTitle>
          <CardDescription>
            Funcionalidades desta página que se tornam serviços no catálogo público
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {servicosGerados.map((servico, index) => (
              <div key={index} className="flex items-center p-3 border rounded-lg">
                <Calendar className="h-4 w-4 text-blue-600 mr-3" />
                <span className="text-sm">{servico}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}