'use client'

import { useAdminAuth } from '@/contexts/AdminAuthContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Calendar,
  Clock,
  User,
  Stethoscope,
  Heart,
  Brain,
  Eye,
  Bone,
  CheckCircle,
  XCircle,
  AlertCircle,
  Plus,
  Search,
  Filter,
  Loader2
} from 'lucide-react'
import { useState } from 'react'
import { useMedicalAppointments } from '@/hooks/api/health'
import { useToast } from '@/hooks/use-toast'

const especialidades = [
  { id: 'clinica-geral', nome: 'Clínica Geral', icon: Stethoscope, medicos: 4, slots: 8 },
  { id: 'cardiologia', nome: 'Cardiologia', icon: Heart, medicos: 2, slots: 4 },
  { id: 'neurologia', nome: 'Neurologia', icon: Brain, medicos: 1, slots: 2 },
  { id: 'oftalmologia', nome: 'Oftalmologia', icon: Eye, medicos: 2, slots: 6 },
  { id: 'ortopedia', nome: 'Ortopedia', icon: Bone, medicos: 1, slots: 3 }
]


const servicosGerados = [
  'Agendamento de Consulta',
  'Reagendamento de Consulta',
  'Cancelamento de Consulta',
  'Lista de Espera',
  'Confirmação de Agendamento',
  'Lembrete de Consulta',
  'Histórico de Consultas'
]

export default function AgendamentosPage() {
  const { user } = useAdminAuth()
  const { toast } = useToast()
  const {
    appointments,
    loading,
    error,
    createAppointment,
    getTodayAppointments,
    getAppointmentsByStatus
  } = useMedicalAppointments()

  const [novoAgendamento, setNovoAgendamento] = useState({
    paciente: '',
    especialidade: '',
    medico: '',
    data: '',
    horario: ''
  })

  // Dados reais calculados dos hooks
  const agendamentosHoje = getTodayAppointments()
  const agendamentosConfirmados = getAppointmentsByStatus('CONFIRMED')
  const agendamentosAguardando = getAppointmentsByStatus('SCHEDULED')
  const agendamentosCancelados = getAppointmentsByStatus('CANCELLED')
  const agendamentosRealizados = getAppointmentsByStatus('COMPLETED')

  // Calcular estatísticas
  const slotsDisponiveis = 50 - appointments.length // Exemplo
  const listaEspera = appointments.filter(apt => apt.status === 'WAITING_LIST')
  const taxaComparecimento = agendamentosRealizados.length > 0
    ? Math.round((agendamentosRealizados.length / (agendamentosRealizados.length + agendamentosCancelados.length)) * 100)
    : 0

  const handleNovoAgendamento = async () => {
    if (!novoAgendamento.paciente || !novoAgendamento.especialidade || !novoAgendamento.data || !novoAgendamento.horario) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive"
      })
      return
    }

    const dataHorario = new Date(`${novoAgendamento.data}T${novoAgendamento.horario}:00`)

    const success = await createAppointment({
      patient_id: novoAgendamento.paciente,
      type: novoAgendamento.especialidade.toUpperCase() as const,
      scheduled_date: dataHorario.toISOString(),
      status: 'SCHEDULED' as const,
      priority: 'NORMAL' as const,
      health_professional_id: "1", // Este valor viria de seleção
      notes: 'Agendamento via sistema'
    })

    if (success) {
      toast({
        title: "Sucesso",
        description: "Agendamento criado com sucesso",
      })
      setNovoAgendamento({
        paciente: '',
        especialidade: '',
        medico: '',
        data: '',
        horario: ''
      })
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Carregando agendamentos...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold">Erro ao carregar</h3>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    )
  }

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return <Badge className="bg-green-500 text-white">Confirmado</Badge>
      case 'scheduled':
        return <Badge className="bg-yellow-500 text-white">Agendado</Badge>
      case 'cancelled':
        return <Badge variant="destructive">Cancelado</Badge>
      case 'completed':
        return <Badge className="bg-blue-500 text-white">Realizado</Badge>
      case 'in_progress':
        return <Badge className="bg-purple-500 text-white">Em Andamento</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getPrioridadeBadge = (prioridade: string) => {
    switch (prioridade.toLowerCase()) {
      case 'high':
      case 'alta':
        return <Badge variant="destructive">Alta</Badge>
      case 'normal':
      case 'medium':
        return <Badge variant="secondary">Normal</Badge>
      default:
        return <Badge variant="outline">Baixa</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Calendar className="h-8 w-8 text-blue-600 mr-3" />
            Agendamentos Médicos
          </h1>
          <p className="text-gray-600 mt-1">
            Gestão de calendário e slots por especialidade médica
          </p>
        </div>
        <Badge variant="outline" className="text-blue-600 border-blue-200">
          Agenda Médica
        </Badge>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Agendamentos Hoje</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{agendamentosHoje.length}</div>
            <p className="text-xs text-muted-foreground">
              Total de hoje
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Slots Disponíveis</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{slotsDisponiveis}</div>
            <p className="text-xs text-muted-foreground">
              Próximos 7 dias
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lista de Espera</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{listaEspera.length}</div>
            <p className="text-xs text-muted-foreground">
              Aguardando vaga
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa Comparecimento</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foregreen" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{taxaComparecimento}%</div>
            <p className="text-xs text-muted-foreground">
              Últimos 30 dias
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Novo Agendamento */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Plus className="h-5 w-5 mr-2" />
              Novo Agendamento
            </CardTitle>
            <CardDescription>
              Agendar nova consulta médica
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="paciente">Nome do Paciente</Label>
              <Input
                id="paciente"
                placeholder="Digite o nome ou CPF"
                value={novoAgendamento.paciente}
                onChange={(e) => setNovoAgendamento(prev => ({ ...prev, paciente: e.target.value }))}
              />
            </div>

            <div>
              <Label htmlFor="especialidade">Especialidade</Label>
              <Select value={novoAgendamento.especialidade} onValueChange={(value) => setNovoAgendamento(prev => ({ ...prev, especialidade: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a especialidade" />
                </SelectTrigger>
                <SelectContent>
                  {especialidades.map((esp) => (
                    <SelectItem key={esp.id} value={esp.id}>
                      <div className="flex items-center">
                        <esp.icon className="h-4 w-4 mr-2" />
                        {esp.nome}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="data">Data</Label>
              <Input
                id="data"
                type="date"
                value={novoAgendamento.data}
                onChange={(e) => setNovoAgendamento(prev => ({ ...prev, data: e.target.value }))}
              />
            </div>

            <div>
              <Label htmlFor="horario">Horário</Label>
              <Select value={novoAgendamento.horario} onValueChange={(value) => setNovoAgendamento(prev => ({ ...prev, horario: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o horário" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="08:00">08:00</SelectItem>
                  <SelectItem value="08:30">08:30</SelectItem>
                  <SelectItem value="09:00">09:00</SelectItem>
                  <SelectItem value="09:30">09:30</SelectItem>
                  <SelectItem value="10:00">10:00</SelectItem>
                  <SelectItem value="10:30">10:30</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button className="w-full" onClick={handleNovoAgendamento}>
              <Plus className="h-4 w-4 mr-2" />
              Agendar Consulta
            </Button>
          </CardContent>
        </Card>

        {/* Agendamentos do Dia */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Agendamentos de Hoje</CardTitle>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Search className="h-4 w-4 mr-2" />
                  Buscar
                </Button>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filtrar
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {agendamentosHoje.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Nenhum agendamento hoje</p>
                </div>
              ) : (
                agendamentosHoje.map((appointment) => (
                  <div key={appointment.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span className="font-semibold">
                          {new Date(appointment.scheduled_date).toLocaleTimeString('pt-BR', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                        <span>{appointment.patient?.name || 'Paciente'}</span>
                      </div>
                      {getStatusBadge(appointment.status)}
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">Tipo:</span> {appointment.type}
                      </div>
                      <div>
                        <span className="font-medium">Médico:</span> {appointment.professional?.name || 'N/A'}
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">Protocolo: {appointment.id}</p>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Especialidades Disponíveis */}
        <Card>
          <CardHeader>
            <CardTitle>Especialidades Disponíveis</CardTitle>
            <CardDescription>
              Médicos e slots por especialidade
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {especialidades.map((esp) => (
                <div key={esp.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center">
                    <esp.icon className="h-5 w-5 text-blue-600 mr-3" />
                    <div>
                      <h4 className="font-medium">{esp.nome}</h4>
                      <p className="text-sm text-gray-600">{esp.medicos} médicos</p>
                    </div>
                  </div>
                  <Badge variant="outline">{esp.slots} slots hoje</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Lista de Espera */}
        <Card>
          <CardHeader>
            <CardTitle>Lista de Espera</CardTitle>
            <CardDescription>
              Pacientes aguardando agendamento
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {listaEspera.length === 0 ? (
                <div className="text-center py-8">
                  <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Nenhum paciente na lista de espera</p>
                </div>
              ) : (
                listaEspera.map((appointment, index) => (
                  <div key={appointment.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{appointment.patient?.name || 'Paciente'}</h4>
                      <p className="text-sm text-gray-600">{appointment.type}</p>
                      <p className="text-xs text-gray-500">
                        Desde: {new Date(appointment.created_at).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-2">
                        {getPrioridadeBadge(appointment.priority)}
                        <Badge variant="outline">#{index + 1}</Badge>
                      </div>
                    </div>
                  </div>
                ))
              )}
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