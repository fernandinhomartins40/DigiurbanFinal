'use client'
// @ts-nocheck

import { useAdminAuth } from '@/contexts/AdminAuthContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Stethoscope,
  UserPlus,
  Clock,
  AlertCircle,
  Heart,
  Brain,
  Eye,
  Bone,
  Activity,
  Plus,
  Search,
  Filter,
  FileText,
  Calendar,
  Loader2
} from 'lucide-react'
import { useState } from 'react'
import { useMedicalAppointments } from '@/hooks/api/health'
import { useToast } from '@/hooks/use-toast'

const tiposAtendimento = [
  { id: 'consulta-geral', nome: 'Consulta Geral', icon: Stethoscope, urgencia: 'baixa' },
  { id: 'emergencia', nome: 'Emergência', icon: AlertCircle, urgencia: 'alta' },
  { id: 'cardiologia', nome: 'Cardiologia', icon: Heart, urgencia: 'media' },
  { id: 'neurologia', nome: 'Neurologia', icon: Brain, urgencia: 'media' },
  { id: 'oftalmologia', nome: 'Oftalmologia', icon: Eye, urgencia: 'baixa' },
  { id: 'ortopedia', nome: 'Ortopedia', icon: Bone, urgencia: 'media' },
  { id: 'psiquiatria', nome: 'Psiquiatria', icon: Brain, urgencia: 'media' }
]


const servicosGerados = [
  'Agendamento de Consulta Geral',
  'Atendimento de Emergência',
  'Consulta Especializada',
  'Triagem de Urgência',
  'Encaminhamento Médico',
  'Atestado Médico',
  'Receita Médica'
]

export default function AtendimentosPage() {
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

  const [novoAtendimento, setNovoAtendimento] = useState({
    cidadao: '',
    tipo: '',
    observacoes: '',
    prioridade: 'normal'
  })

  // Dados reais calculados dos hooks
  const atendimentosHoje = getTodayAppointments()
  const emAtendimento = getAppointmentsByStatus('IN_PROGRESS')
  const emergencias = appointments.filter(apt => apt.type === 'EMERGENCY' && apt.status === 'SCHEDULED')
  const medicosDisponiveis = 6 // Este valor viria de um hook de profissionais

  const handleNovoAtendimento = async () => {
    if (!novoAtendimento.cidadao || !novoAtendimento.tipo) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive"
      })
      return
    }

    const success = await createAppointment({
      patient_id: novoAtendimento.cidadao,
      type: novoAtendimento.tipo.toUpperCase() as const,
      notes: novoAtendimento.observacoes,
      priority: novoAtendimento.prioridade.toUpperCase() as const,
      health_professional_id: "1", // Este valor viria de seleção
      scheduled_date: new Date().toISOString(),
      status: 'SCHEDULED' as const
    })

    if (success) {
      toast({
        title: "Sucesso",
        description: "Atendimento registrado com sucesso",
      })
      setNovoAtendimento({
        cidadao: '',
        tipo: '',
        observacoes: '',
        prioridade: 'normal'
      })
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Carregando atendimentos...</span>
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

  const getPrioridadeBadge = (prioridade: string) => {
    switch (prioridade.toLowerCase()) {
      case 'urgente':
        return <Badge variant="destructive">Urgente</Badge>
      case 'alta':
        return <Badge className="bg-orange-500 text-white">Alta</Badge>
      case 'normal':
        return <Badge variant="secondary">Normal</Badge>
      default:
        return <Badge variant="outline">Baixa</Badge>
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'em atendimento':
        return <Badge className="bg-blue-500 text-white">Em Atendimento</Badge>
      case 'aguardando':
        return <Badge className="bg-yellow-500 text-white">Aguardando</Badge>
      case 'finalizado':
        return <Badge className="bg-green-500 text-white">Finalizado</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Stethoscope className="h-8 w-8 text-blue-600 mr-3" />
            Atendimentos Médicos
          </h1>
          <p className="text-gray-600 mt-1">
            PDV para consultas médicas, especialidades e emergências
          </p>
        </div>
        <Badge variant="outline" className="text-blue-600 border-blue-200">
          PDV Saúde
        </Badge>
      </div>

      {/* Estatísticas Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Atendimentos Hoje</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{atendimentosHoje.length}</div>
            <p className="text-xs text-muted-foreground">
              Total de hoje
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Em Atendimento</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{emAtendimento.length}</div>
            <p className="text-xs text-muted-foreground">
              Atendimentos ativos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Emergências</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{emergencias.length}</div>
            <p className="text-xs text-muted-foreground">
              Aguardando atendimento
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Médicos Disponíveis</CardTitle>
            <UserPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{medicosDisponiveis}</div>
            <p className="text-xs text-muted-foreground">
              Profissionais ativos
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Novo Atendimento */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Plus className="h-5 w-5 mr-2" />
              Novo Atendimento
            </CardTitle>
            <CardDescription>
              Registrar novo atendimento médico
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="cidadao">Nome do Cidadão</Label>
              <Input
                id="cidadao"
                placeholder="Digite o nome ou CPF"
                value={novoAtendimento.cidadao}
                onChange={(e) => setNovoAtendimento(prev => ({ ...prev, cidadao: e.target.value }))}
              />
            </div>

            <div>
              <Label htmlFor="tipo">Tipo de Atendimento</Label>
              <Select value={novoAtendimento.tipo} onValueChange={(value) => setNovoAtendimento(prev => ({ ...prev, tipo: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  {tiposAtendimento.map((tipo) => (
                    <SelectItem key={tipo.id} value={tipo.id}>
                      <div className="flex items-center">
                        <tipo.icon className="h-4 w-4 mr-2" />
                        {tipo.nome}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="prioridade">Prioridade</Label>
              <Select value={novoAtendimento.prioridade} onValueChange={(value) => setNovoAtendimento(prev => ({ ...prev, prioridade: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="baixa">Baixa</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="alta">Alta</SelectItem>
                  <SelectItem value="urgente">Urgente</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="observacoes">Observações</Label>
              <Textarea
                id="observacoes"
                placeholder="Motivo da consulta ou sintomas"
                value={novoAtendimento.observacoes}
                onChange={(e) => setNovoAtendimento(prev => ({ ...prev, observacoes: e.target.value }))}
                rows={3}
              />
            </div>

            <Button className="w-full" onClick={handleNovoAtendimento}>
              <Plus className="h-4 w-4 mr-2" />
              Registrar Atendimento
            </Button>
          </CardContent>
        </Card>

        {/* Lista de Atendimentos */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Atendimentos do Dia</CardTitle>
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
            <div className="space-y-4">
              {atendimentosHoje.length === 0 ? (
                <div className="text-center py-8">
                  <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Nenhum atendimento hoje</p>
                </div>
              ) : (
                atendimentosHoje.map((appointment) => (
                  <div key={appointment.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-semibold">{appointment.patient.name}</h4>
                        <p className="text-sm text-gray-600">Protocolo: {appointment.id}</p>
                      </div>
                      <div className="flex space-x-2">
                        {getPrioridadeBadge(appointment.priority)}
                        {getStatusBadge(appointment.status)}
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Tipo:</span>
                        <p className="font-medium">{appointment.type}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Médico:</span>
                        <p className="font-medium">{appointment.professional.name}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Horário:</span>
                        <p className="font-medium">
                          {new Date(appointment.scheduled_date).toLocaleTimeString('pt-BR', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-2 mt-3">
                      <Button size="sm" variant="outline">
                        <FileText className="h-4 w-4 mr-2" />
                        Prontuário
                      </Button>
                      <Button size="sm" variant="outline">
                        <Calendar className="h-4 w-4 mr-2" />
                        Agendar Retorno
                      </Button>
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
                <Stethoscope className="h-4 w-4 text-blue-600 mr-3" />
                <span className="text-sm">{servico}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}