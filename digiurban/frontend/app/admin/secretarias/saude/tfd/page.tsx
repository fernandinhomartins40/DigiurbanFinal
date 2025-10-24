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
  Truck,
  MapPin,
  Clock,
  User,
  FileText,
  Calendar,
  Heart,
  Brain,
  Eye,
  Bone,
  Plus,
  Search,
  Filter,
  Route,
  Users,
  AlertCircle,
  Loader2
} from 'lucide-react'
import { useState } from 'react'
import { useEmergencyServices } from '@/hooks/api/health'
import { useToast } from '@/hooks/use-toast'

const especialidades = [
  { id: 'cardiologia', nome: 'Cardiologia', icon: Heart, cidade: 'São Paulo', distancia: '120km' },
  { id: 'neurologia', nome: 'Neurologia', icon: Brain, cidade: 'Campinas', distancia: '80km' },
  { id: 'oftalmologia', nome: 'Oftalmologia', icon: Eye, cidade: 'Ribeirão Preto', distancia: '150km' },
  { id: 'ortopedia', nome: 'Ortopedia', icon: Bone, cidade: 'Santos', distancia: '200km' },
  { id: 'oncologia', nome: 'Oncologia', icon: AlertCircle, cidade: 'São Paulo', distancia: '120km' }
]

const filaEspera = [
  {
    id: 1,
    posicao: 1,
    paciente: 'Maria Silva Santos',
    especialidade: 'Cardiologia',
    prioridade: 'alta',
    dataInscricao: '2024-01-10',
    estimativa: '2024-02-15',
    status: 'aguardando'
  },
  {
    id: 2,
    posicao: 2,
    paciente: 'João Carlos Lima',
    especialidade: 'Neurologia',
    prioridade: 'normal',
    dataInscricao: '2024-01-12',
    estimativa: '2024-03-20',
    status: 'aguardando'
  },
  {
    id: 3,
    posicao: 3,
    paciente: 'Ana Costa Oliveira',
    especialidade: 'Oftalmologia',
    prioridade: 'normal',
    dataInscricao: '2024-01-15',
    estimativa: '2024-04-10',
    status: 'aguardando'
  }
]

const transportesAgendados = [
  {
    id: 1,
    data: '2024-01-25',
    veiculo: 'Van 01',
    destino: 'Hospital das Clínicas - São Paulo',
    pacientes: 4,
    partida: '06:00',
    retorno: '18:00',
    motorista: 'Carlos Santos'
  },
  {
    id: 2,
    data: '2024-01-26',
    veiculo: 'Van 02',
    destino: 'Hospital de Base - Ribeirão Preto',
    pacientes: 2,
    partida: '05:30',
    retorno: '19:00',
    motorista: 'José Silva'
  }
]

const servicosGerados = [
  'Solicitação de Encaminhamento TFD',
  'Agendamento de Consulta Fora do Domicílio',
  'Solicitação de Transporte TFD',
  'Acompanhamento de Fila TFD',
  'Renovação de Encaminhamento',
  'Relatório de Viagem',
  'Autorização de Acompanhante'
]

export default function TFDPage() {
  const { user } = useAdminAuth()
  const { toast } = useToast()
  const {
    emergencies,
    loading,
    error,
    createEmergency,
    getEmergenciesByStatus
  } = useEmergencyServices()

  const [novoTFD, setNovoTFD] = useState({
    paciente: '',
    especialidade: '',
    medico: '',
    observacoes: '',
    prioridade: 'normal'
  })

  // Dados reais calculados dos hooks
  const tfdsAguardando = getEmergenciesByStatus('WAITING')
  const tfdsAgendados = getEmergenciesByStatus('SCHEDULED')
  const tfdsRealizados = getEmergenciesByStatus('COMPLETED')

  const handleNovoTFD = async () => {
    if (!novoTFD.paciente || !novoTFD.especialidade) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive"
      })
      return
    }

    const success = await createEmergency({
      patient_id: novoTFD.paciente,
      emergency_type: 'TFD',
      description: `TFD para ${novoTFD.especialidade} - ${novoTFD.observacoes}`,
      priority: novoTFD.prioridade.toUpperCase(),
      status: 'WAITING'
    })

    if (success) {
      toast({
        title: "Sucesso",
        description: "Solicitação de TFD registrada com sucesso",
      })
      setNovoTFD({
        paciente: '',
        especialidade: '',
        medico: '',
        observacoes: '',
        prioridade: 'normal'
      })
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Carregando TFDs...</span>
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
    switch (status) {
      case 'aguardando':
        return <Badge className="bg-yellow-500 text-white">Aguardando</Badge>
      case 'agendado':
        return <Badge className="bg-blue-500 text-white">Agendado</Badge>
      case 'realizado':
        return <Badge className="bg-green-500 text-white">Realizado</Badge>
      case 'cancelado':
        return <Badge variant="destructive">Cancelado</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getPrioridadeBadge = (prioridade: string) => {
    switch (prioridade) {
      case 'alta':
        return <Badge variant="destructive">Alta</Badge>
      case 'normal':
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
            <Truck className="h-8 w-8 text-blue-600 mr-3" />
            Encaminhamentos TFD
          </h1>
          <p className="text-gray-600 mt-1">
            Tratamento Fora do Domicílio - Gestão de especialidades e transporte
          </p>
        </div>
        <Badge variant="outline" className="text-blue-600 border-blue-200">
          TFD Municipal
        </Badge>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fila de Espera</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <p className="text-xs text-muted-foreground">
              Pacientes aguardando
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Transportes Agendados</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foregreen" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">
              Próximos 7 dias
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Especialidades</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">
              Disponíveis
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tempo Médio Espera</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45</div>
            <p className="text-xs text-muted-foreground">
              dias
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Novo TFD */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Plus className="h-5 w-5 mr-2" />
              Novo Encaminhamento TFD
            </CardTitle>
            <CardDescription>
              Solicitar tratamento fora do domicílio
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="paciente">Nome do Paciente</Label>
              <Input
                id="paciente"
                placeholder="Digite o nome ou CPF"
                value={novoTFD.paciente}
                onChange={(e) => setNovoTFD(prev => ({ ...prev, paciente: e.target.value }))}
              />
            </div>

            <div>
              <Label htmlFor="especialidade">Especialidade Necessária</Label>
              <Select value={novoTFD.especialidade} onValueChange={(value) => setNovoTFD(prev => ({ ...prev, especialidade: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a especialidade" />
                </SelectTrigger>
                <SelectContent>
                  {especialidades.map((esp) => (
                    <SelectItem key={esp.id} value={esp.id}>
                      <div className="flex items-center">
                        <esp.icon className="h-4 w-4 mr-2" />
                        {esp.nome} - {esp.cidade}
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
                value={novoTFD.medico}
                onChange={(e) => setNovoTFD(prev => ({ ...prev, medico: e.target.value }))}
              />
            </div>

            <div>
              <Label htmlFor="prioridade">Prioridade</Label>
              <Select value={novoTFD.prioridade} onValueChange={(value) => setNovoTFD(prev => ({ ...prev, prioridade: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="baixa">Baixa</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="alta">Alta</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="observacoes">Observações Médicas</Label>
              <Textarea
                id="observacoes"
                placeholder="Justificativa e observações"
                value={novoTFD.observacoes}
                onChange={(e) => setNovoTFD(prev => ({ ...prev, observacoes: e.target.value }))}
                rows={3}
              />
            </div>

            <Button className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Solicitar TFD
            </Button>
          </CardContent>
        </Card>

        {/* Fila de Espera */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Fila de Espera TFD</CardTitle>
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
              {filaEspera.map((item) => (
                <div key={item.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">#{item.posicao}</Badge>
                        <h4 className="font-semibold">{item.paciente}</h4>
                      </div>
                      <p className="text-sm text-gray-600">{item.especialidade}</p>
                    </div>
                    <div className="flex space-x-2">
                      {getPrioridadeBadge(item.prioridade)}
                      {getStatusBadge(item.status)}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Inscrição:</span>
                      <p className="font-medium">{item.dataInscricao}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Estimativa:</span>
                      <p className="font-medium">{item.estimativa}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Posição:</span>
                      <p className="font-medium">{item.posicao}º na fila</p>
                    </div>
                  </div>

                  <div className="flex space-x-2 mt-3">
                    <Button size="sm" variant="outline">
                      <Calendar className="h-4 w-4 mr-2" />
                      Agendar
                    </Button>
                    <Button size="sm" variant="outline">
                      <FileText className="h-4 w-4 mr-2" />
                      Histórico
                    </Button>
                  </div>
                </div>
              ))}
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
              Centros de referência por especialidade
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
                      <p className="text-sm text-gray-600">{esp.cidade} - {esp.distancia}</p>
                    </div>
                  </div>
                  <Badge variant="outline">
                    <Route className="h-3 w-3 mr-1" />
                    {esp.distancia}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Transportes Agendados */}
        <Card>
          <CardHeader>
            <CardTitle>Transportes Agendados</CardTitle>
            <CardDescription>
              Próximas viagens programadas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {transportesAgendados.map((transporte) => (
                <div key={transporte.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="font-semibold">{transporte.data}</h4>
                      <p className="text-sm text-gray-600">{transporte.veiculo}</p>
                    </div>
                    <Badge variant="outline">{transporte.pacientes} pacientes</Badge>
                  </div>

                  <p className="text-sm text-gray-600 mb-2">{transporte.destino}</p>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Partida:</span>
                      <p className="font-medium">{transporte.partida}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Retorno:</span>
                      <p className="font-medium">{transporte.retorno}</p>
                    </div>
                  </div>

                  <p className="text-xs text-gray-500 mt-2">
                    Motorista: {transporte.motorista}
                  </p>
                </div>
              ))}
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
                <Truck className="h-4 w-4 text-blue-600 mr-3" />
                <span className="text-sm">{servico}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}