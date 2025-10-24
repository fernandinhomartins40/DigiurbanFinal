'use client'
// @ts-nocheck

import { useAdminAuth } from '@/contexts/AdminAuthContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  FileText,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  Eye,
  Heart,
  Activity,
  Plus,
  Search,
  Filter,
  Download,
  Microscope,
  Loader2
} from 'lucide-react'
import { useState } from 'react'
import { useMedicalRecords, useHealthEquipment } from '@/hooks/api/health'
import { useToast } from '@/hooks/use-toast'

const tiposExames = [
  { id: 'sangue', nome: 'Exames de Sangue', icon: Activity, tempo: '2-3 dias', preco: 'Gratuito' },
  { id: 'urina', nome: 'Exame de Urina', icon: Microscope, tempo: '1-2 dias', preco: 'Gratuito' },
  { id: 'raio-x', nome: 'Raio-X', icon: Eye, tempo: '1 dia', preco: 'Gratuito' },
  { id: 'eletrocardiograma', nome: 'Eletrocardiograma', icon: Heart, tempo: 'Imediato', preco: 'Gratuito' },
  { id: 'ultrassom', nome: 'Ultrassom', icon: Eye, tempo: '3-5 dias', preco: 'Gratuito' },
  { id: 'mamografia', nome: 'Mamografia', icon: Eye, tempo: '5-7 dias', preco: 'Gratuito' },
  { id: 'endoscopia', nome: 'Endoscopia', icon: Microscope, tempo: '7-10 dias', preco: 'Gratuito' },
  { id: 'tomografia', nome: 'Tomografia', icon: Eye, tempo: '10-15 dias', preco: 'Gratuito' },
  { id: 'ressonancia', nome: 'Ressonância Magnética', icon: Eye, tempo: '15-20 dias', preco: 'Gratuito' },
  { id: 'colonoscopia', nome: 'Colonoscopia', icon: Microscope, tempo: '20-30 dias', preco: 'Gratuito' }
]


const servicosGerados = [
  'Agendamento de Exame',
  'Resultado de Exame',
  'Segunda Via de Laudo',
  'Exames Especializados',
  'Agendamento de Retorno',
  'Histórico de Exames',
  'Preparação para Exame'
]

export default function ExamesPage() {
  const { user } = useAdminAuth()
  const { toast } = useToast()
  const {
    records: medicalRecords,
    loading: recordsLoading,
    error: recordsError,
    createRecord,
    getRecordsByType,
    getRecordsByDateRange
  } = useMedicalRecords()

  const {
    equipment: healthEquipment,
    loading: equipmentLoading,
    error: equipmentError
  } = useHealthEquipment()

  const [novoExame, setNovoExame] = useState({
    paciente: '',
    tipo: '',
    medico: '',
    observacoes: ''
  })

  // Dados reais calculados dos hooks
  const examesAgendados = medicalRecords.filter(record => record.record_type === 'EXAM')
  const resultadosDisponiveis = medicalRecords.filter(record =>
    record.record_type === 'EXAM_RESULT' && record.status === 'COMPLETED'
  )
  const examesHoje = getRecordsByDateRange(
    new Date().toISOString().split('T')[0],
    new Date().toISOString().split('T')[0]
  )
  const examesRealizados = medicalRecords.filter(record => record.status === 'COMPLETED')

  // Calcular estatísticas
  const proximosSeteDias = new Date()
  proximosSeteDias.setDate(proximosSeteDias.getDate() + 7)
  const examesProximaSemana = medicalRecords.filter(record => {
    const recordDate = new Date(record.created_at)
    return recordDate <= proximosSeteDias && record.status === 'SCHEDULED'
  })

  const equipamentosDisponiveis = healthEquipment.filter(eq => eq.status === 'ACTIVE')

  const handleNovoExame = async () => {
    if (!novoExame.paciente || !novoExame.tipo) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive"
      })
      return
    }

    const success = await createRecord({
      patient_id: novoExame.paciente,
      record_type: 'EXAM',
      title: `Exame de ${novoExame.tipo}`,
      content: novoExame.observacoes || 'Exame solicitado via sistema',
      status: 'SCHEDULED',
      health_professional_id: "1", // Este valor viria de seleção
      appointment_id: "1" // Seria vinculado a um agendamento
    })

    if (success) {
      toast({
        title: "Sucesso",
        description: "Exame agendado com sucesso",
      })
      setNovoExame({
        paciente: '',
        tipo: '',
        medico: '',
        observacoes: ''
      })
    }
  }

  if (recordsLoading || equipmentLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Carregando dados dos exames...</span>
      </div>
    )
  }

  if (recordsError || equipmentError) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold">Erro ao carregar</h3>
          <p className="text-gray-600">{recordsError || equipmentError}</p>
        </div>
      </div>
    )
  }

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'scheduled':
        return <Badge className="bg-blue-500 text-white">Agendado</Badge>
      case 'completed':
        return <Badge className="bg-green-500 text-white">Realizado</Badge>
      case 'cancelled':
        return <Badge variant="destructive">Cancelado</Badge>
      case 'in_progress':
        return <Badge className="bg-yellow-500 text-white">Em Andamento</Badge>
      case 'pending':
        return <Badge className="bg-orange-500 text-white">Pendente</Badge>
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
            <FileText className="h-8 w-8 text-blue-600 mr-3" />
            Gestão de Exames
          </h1>
          <p className="text-gray-600 mt-1">
            Sistema de 10 tipos de exames médicos, resultados e laudos
          </p>
        </div>
        <Badge variant="outline" className="text-blue-600 border-blue-200">
          Laboratório Municipal
        </Badge>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Exames Agendados</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{examesProximaSemana.length}</div>
            <p className="text-xs text-muted-foreground">
              Próximos 7 dias
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Realizados Hoje</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{examesHoje.length}</div>
            <p className="text-xs text-muted-foreground">
              Realizados hoje
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resultados Prontos</CardTitle>
            <FileText className="h-4 w-4 text-muted-foregreen" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{resultadosDisponiveis.length}</div>
            <p className="text-xs text-muted-foreground">
              Aguardando retirada
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tempo Médio</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{equipamentosDisponiveis.length}</div>
            <p className="text-xs text-muted-foreground">
              equipamentos ativos
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
              Agendar Exame
            </CardTitle>
            <CardDescription>
              Solicitar novo exame médico
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="paciente">Nome do Paciente</Label>
              <Input
                id="paciente"
                placeholder="Digite o nome ou CPF"
                value={novoExame.paciente}
                onChange={(e) => setNovoExame(prev => ({ ...prev, paciente: e.target.value }))}
              />
            </div>

            <div>
              <Label htmlFor="tipo">Tipo de Exame</Label>
              <Select value={novoExame.tipo} onValueChange={(value) => setNovoExame(prev => ({ ...prev, tipo: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo de exame" />
                </SelectTrigger>
                <SelectContent>
                  {tiposExames.map((exame) => (
                    <SelectItem key={exame.id} value={exame.id}>
                      <div className="flex items-center">
                        <exame.icon className="h-4 w-4 mr-2" />
                        {exame.nome}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="medico">Médico Solicitante</Label>
              <Input
                id="medico"
                placeholder="Nome do médico"
                value={novoExame.medico}
                onChange={(e) => setNovoExame(prev => ({ ...prev, medico: e.target.value }))}
              />
            </div>

            <Button className="w-full" onClick={handleNovoExame}>
              <Plus className="h-4 w-4 mr-2" />
              Agendar Exame
            </Button>
          </CardContent>
        </Card>

        {/* Exames Agendados */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Exames Agendados</CardTitle>
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
              {examesAgendados.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Nenhum exame agendado</p>
                </div>
              ) : (
                examesAgendados.map((exame) => (
                  <div key={exame.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-semibold">{exame.patient?.name || 'Paciente'}</h4>
                        <p className="text-sm text-gray-600">Protocolo: {exame.id}</p>
                      </div>
                      {getStatusBadge(exame.status)}
                    </div>

                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Tipo:</span>
                        <p className="font-medium">{exame.record_type}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Data:</span>
                        <p className="font-medium">{new Date(exame.created_at).toLocaleDateString('pt-BR')}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Médico:</span>
                        <p className="font-medium">{exame.professional?.name || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tipos de Exames */}
        <Card>
          <CardHeader>
            <CardTitle>Tipos de Exames Disponíveis</CardTitle>
            <CardDescription>
              10 tipos de exames oferecidos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {tiposExames.map((exame) => (
                <div key={exame.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center">
                    <exame.icon className="h-5 w-5 text-blue-600 mr-3" />
                    <div>
                      <h4 className="font-medium">{exame.nome}</h4>
                      <p className="text-sm text-gray-600">{exame.tempo} • {exame.preco}</p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">
                    Agendar
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Resultados Disponíveis */}
        <Card>
          <CardHeader>
            <CardTitle>Resultados Disponíveis</CardTitle>
            <CardDescription>
              Laudos prontos para retirada
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {resultadosDisponiveis.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Nenhum resultado disponível</p>
                </div>
              ) : (
                resultadosDisponiveis.map((resultado) => (
                  <div key={resultado.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h4 className="font-semibold">{resultado.patient?.name || 'Paciente'}</h4>
                        <p className="text-sm text-gray-600">{resultado.title}</p>
                      </div>
                      {getStatusBadge(resultado.status)}
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                      <div>
                        <span className="text-gray-500">Criado:</span>
                        <p className="font-medium">{new Date(resultado.created_at).toLocaleDateString('pt-BR')}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Atualizado:</span>
                        <p className="font-medium">{new Date(resultado.updated_at).toLocaleDateString('pt-BR')}</p>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Download PDF
                      </Button>
                      <Button size="sm" variant="outline">
                        <FileText className="h-4 w-4 mr-2" />
                        Ver Laudo
                      </Button>
                    </div>

                    <p className="text-xs text-gray-500 mt-2">Protocolo: {resultado.id}</p>
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
                <FileText className="h-4 w-4 text-blue-600 mr-3" />
                <span className="text-sm">{servico}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}