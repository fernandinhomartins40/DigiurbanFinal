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
  Car,
  Users,
  MapPin,
  Clock,
  Calendar,
  Phone,
  AlertCircle,
  CheckCircle,
  Route,
  Fuel,
  Wrench,
  User,
  Plus,
  Search,
  Filter,
  Navigation,
  Activity,
  Loader2
} from 'lucide-react'
import { useState } from 'react'
import { useEmergencyServices, usePatients } from '@/hooks/api/health'
import { useToast } from '@/hooks/use-toast'


const servicosGerados = [
  'Solicitação de Transporte para Consulta',
  'Agendamento de Transporte TFD',
  'Transporte de Urgência',
  'Acompanhamento de Viagem',
  'Reagendamento de Transporte',
  'Transporte para Exames',
  'Lista de Espera Transporte'
]

export default function TransportePacientesPage() {
  const { user } = useAdminAuth()
  const { toast } = useToast()
  const {
    emergencyCalls,
    loading: emergencyLoading,
    error: emergencyError,
    createCall
  } = useEmergencyServices()

  const {
    patients,
    loading: patientsLoading,
    error: patientsError
  } = usePatients()

  const [novaViagem, setNovaViagem] = useState({
    veiculo: '',
    destino: '',
    dataViagem: '',
    horarioSaida: '',
    pacientes: '',
    observacoes: ''
  })

  // Simular dados de veículos baseados nas chamadas de emergência
  const veiculosTransporte = emergencyCalls.slice(0, 3).map((call, index) => ({
    id: call.id,
    placa: `ABC-${1234 + index}`,
    modelo: index === 0 ? 'Van Mercedes Sprinter' : index === 1 ? 'Ambulância Fiat Ducato' : 'Micro-ônibus Iveco',
    capacidade: index === 0 ? 8 : index === 1 ? 2 : 16,
    tipo: index === 0 ? 'van' : index === 1 ? 'ambulancia' : 'micro-onibus',
    status: call.status === 'COMPLETED' ? 'disponivel' : call.status === 'IN_PROGRESS' ? 'em-uso' : 'manutencao',
    motorista: call.caller_name || 'Motorista não informado',
    telefone: call.caller_phone || '(11) 99999-0000',
    combustivel: Math.floor(Math.random() * 100),
    proximaManutencao: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    kmRodados: Math.floor(Math.random() * 100000)
  }))

  // Usar chamadas de emergência como base para viagens
  const viagensAgendadas = emergencyCalls.slice(0, 3).map((call) => ({
    id: call.id,
    veiculo: `Veículo ${call.id}`,
    destino: call.location || 'Destino não informado',
    pacientes: 1,
    dataViagem: new Date(call.created_at).toLocaleDateString('pt-BR'),
    horarioSaida: new Date(call.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    horarioRetorno: new Date(call.updated_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    motorista: call.caller_name || 'Motorista',
    status: call.status === 'COMPLETED' ? 'concluida' : call.status === 'IN_PROGRESS' ? 'em-andamento' : 'agendada',
    observacoes: call.description || 'Sem observações',
    distancia: Math.floor(Math.random() * 200) + 'km'
  }))

  // Usar pacientes como base para solicitações
  const solicitacoesTransporte = patients.slice(0, 5).map((patient) => ({
    id: patient.id,
    paciente: patient.name,
    destino: 'Hospital das Clínicas - SP',
    especialidade: 'Consulta Geral',
    dataDesejada: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    urgencia: Math.random() > 0.7 ? 'alta' : 'normal',
    status: Math.random() > 0.5 ? 'pendente' : 'aprovada',
    observacoes: 'Transporte necessário para consulta',
    telefone: '(11) 99999-1000'
  }))

  const handleNovaViagem = async () => {
    if (!novaViagem.veiculo || !novaViagem.destino || !novaViagem.dataViagem) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive"
      })
      return
    }

    // Criar uma chamada de emergência como exemplo de transporte
    const success = await createCall({
      type: 'TRANSPORT',
      priority: 'MEDIUM',
      caller_name: 'Sistema de Transporte',
      caller_phone: '(11) 99999-0000',
      location: novaViagem.destino,
      description: `Transporte agendado: ${novaViagem.observacoes}`,
      status: 'SCHEDULED'
    })

    if (success) {
      toast({
        title: "Sucesso",
        description: "Viagem agendada com sucesso",
      })
      setNovaViagem({
        veiculo: '',
        destino: '',
        dataViagem: '',
        horarioSaida: '',
        pacientes: '',
        observacoes: ''
      })
    }
  }

  if (emergencyLoading || patientsLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Carregando dados de transporte...</span>
      </div>
    )
  }

  if (emergencyError || patientsError) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold">Erro ao carregar</h3>
          <p className="text-gray-600">{emergencyError || patientsError}</p>
        </div>
      </div>
    )
  }

  const getStatusVeiculoBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'disponivel':
        return <Badge className="bg-green-500 text-white">Disponível</Badge>
      case 'em-uso':
        return <Badge className="bg-blue-500 text-white">Em Uso</Badge>
      case 'manutencao':
        return <Badge variant="destructive">Manutenção</Badge>
      case 'indisponivel':
        return <Badge variant="secondary">Indisponível</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getStatusViagemBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'agendada':
        return <Badge className="bg-blue-500 text-white">Agendada</Badge>
      case 'em-andamento':
        return <Badge className="bg-yellow-500 text-white">Em Andamento</Badge>
      case 'concluida':
        return <Badge className="bg-green-500 text-white">Concluída</Badge>
      case 'cancelada':
        return <Badge variant="destructive">Cancelada</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getUrgenciaBadge = (urgencia: string) => {
    switch (urgencia) {
      case 'alta':
        return <Badge variant="destructive">Alta</Badge>
      case 'normal':
        return <Badge variant="secondary">Normal</Badge>
      case 'baixa':
        return <Badge variant="outline">Baixa</Badge>
      default:
        return <Badge variant="outline">{urgencia}</Badge>
    }
  }

  const getTipoVeiculoIcon = (tipo: string) => {
    switch (tipo) {
      case 'ambulancia':
        return <AlertCircle className="h-5 w-5 text-red-600" />
      case 'van':
        return <Car className="h-5 w-5 text-blue-600" />
      case 'micro-onibus':
        return <Users className="h-5 w-5 text-green-600" />
      default:
        return <Car className="h-5 w-5 text-gray-600" />
    }
  }

  const getCombustivelColor = (nivel: number) => {
    if (nivel >= 70) return 'text-green-600'
    if (nivel >= 30) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Car className="h-8 w-8 text-blue-600 mr-3" />
            Transporte de Pacientes
          </h1>
          <p className="text-gray-600 mt-1">
            Gestão de frota, viagens e solicitações de transporte para consultas e exames
          </p>
        </div>
        <Badge variant="outline" className="text-blue-600 border-blue-200">
          Transporte Saúde
        </Badge>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Veículos Ativos</CardTitle>
            <Car className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{veiculosTransporte.length}</div>
            <p className="text-xs text-muted-foreground">
              {veiculosTransporte.filter(v => v.status === 'disponivel').length} disponíveis
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Viagens Hoje</CardTitle>
            <Route className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{viagensAgendadas.length}</div>
            <p className="text-xs text-muted-foreground">
              {viagensAgendadas.filter(v => v.status === 'em-andamento').length} em andamento
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pacientes Transportados</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{patients.length}</div>
            <p className="text-xs text-muted-foreground">
              Pacientes cadastrados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Km Percorridos</CardTitle>
            <Navigation className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{veiculosTransporte.reduce((acc, v) => acc + v.kmRodados, 0).toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Total da frota
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Nova Viagem */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Plus className="h-5 w-5 mr-2" />
              Agendar Viagem
            </CardTitle>
            <CardDescription>
              Programar nova viagem de transporte
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="veiculo">Veículo</Label>
              <Select value={novaViagem.veiculo} onValueChange={(value) => setNovaViagem(prev => ({ ...prev, veiculo: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o veículo" />
                </SelectTrigger>
                <SelectContent>
                  {veiculosTransporte.filter(v => v.status === 'disponivel').map((veiculo) => (
                    <SelectItem key={veiculo.id} value={veiculo.placa}>
                      {veiculo.modelo} - {veiculo.placa}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="destino">Destino</Label>
              <Input
                id="destino"
                placeholder="Hospital ou clínica de destino"
                value={novaViagem.destino}
                onChange={(e) => setNovaViagem(prev => ({ ...prev, destino: e.target.value }))}
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="dataViagem">Data</Label>
                <Input
                  id="dataViagem"
                  type="date"
                  value={novaViagem.dataViagem}
                  onChange={(e) => setNovaViagem(prev => ({ ...prev, dataViagem: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="horarioSaida">Horário</Label>
                <Input
                  id="horarioSaida"
                  type="time"
                  value={novaViagem.horarioSaida}
                  onChange={(e) => setNovaViagem(prev => ({ ...prev, horarioSaida: e.target.value }))}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="pacientes">Número de Pacientes</Label>
              <Input
                id="pacientes"
                type="number"
                placeholder="Quantidade de pacientes"
                value={novaViagem.pacientes}
                onChange={(e) => setNovaViagem(prev => ({ ...prev, pacientes: e.target.value }))}
              />
            </div>

            <div>
              <Label htmlFor="observacoes">Observações</Label>
              <Textarea
                id="observacoes"
                placeholder="Especialidades, observações especiais"
                value={novaViagem.observacoes}
                onChange={(e) => setNovaViagem(prev => ({ ...prev, observacoes: e.target.value }))}
                rows={3}
              />
            </div>

            <Button className="w-full" onClick={handleNovaViagem}>
              <Plus className="h-4 w-4 mr-2" />
              Agendar Viagem
            </Button>
          </CardContent>
        </Card>

        {/* Viagens Agendadas */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Viagens Agendadas</CardTitle>
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
              {viagensAgendadas.length === 0 ? (
                <div className="text-center py-8">
                  <Car className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Nenhuma viagem agendada</p>
                </div>
              ) : (
                viagensAgendadas.map((viagem) => (
                  <div key={viagem.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-semibold">{viagem.destino}</h4>
                        <p className="text-sm text-gray-600">{viagem.veiculo} - {viagem.motorista}</p>
                      </div>
                      {getStatusViagemBadge(viagem.status)}
                    </div>

                    <div className="grid grid-cols-3 gap-4 text-sm mb-3">
                      <div>
                        <span className="text-gray-500">Data/Hora:</span>
                        <p className="font-medium">{viagem.dataViagem} às {viagem.horarioSaida}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Pacientes:</span>
                        <p className="font-medium">{viagem.pacientes} pessoas</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Distância:</span>
                        <p className="font-medium">{viagem.distancia}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-600">{viagem.observacoes}</p>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          <MapPin className="h-4 w-4 mr-2" />
                          Rastrear
                        </Button>
                        <Button size="sm" variant="outline">
                          <Phone className="h-4 w-4 mr-2" />
                          Contato
                        </Button>
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
        {/* Frota de Veículos */}
        <Card>
          <CardHeader>
            <CardTitle>Frota de Veículos</CardTitle>
            <CardDescription>
              Status e informações da frota
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {veiculosTransporte.length === 0 ? (
                <div className="text-center py-8">
                  <Car className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Nenhum veículo cadastrado</p>
                </div>
              ) : (
                veiculosTransporte.map((veiculo) => (
                  <div key={veiculo.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        {getTipoVeiculoIcon(veiculo.tipo)}
                        <div className="ml-3">
                          <h4 className="font-semibold">{veiculo.modelo}</h4>
                          <p className="text-sm text-gray-600">{veiculo.placa}</p>
                        </div>
                      </div>
                      {getStatusVeiculoBadge(veiculo.status)}
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                      <div>
                        <span className="text-gray-500">Motorista:</span>
                        <p className="font-medium">{veiculo.motorista}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Capacidade:</span>
                        <p className="font-medium">{veiculo.capacidade} pacientes</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Combustível:</span>
                        <p className={`font-medium ${getCombustivelColor(veiculo.combustivel)}`}>
                          {veiculo.combustivel}%
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-500">KM:</span>
                        <p className="font-medium">{veiculo.kmRodados.toLocaleString()}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <p className="text-xs text-gray-500">
                        Próxima manutenção: {veiculo.proximaManutencao}
                      </p>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          <Wrench className="h-4 w-4 mr-2" />
                          Manutenção
                        </Button>
                        <Button size="sm" variant="outline">
                          <Fuel className="h-4 w-4 mr-2" />
                          Abastecer
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Solicitações de Transporte */}
        <Card>
          <CardHeader>
            <CardTitle>Solicitações de Transporte</CardTitle>
            <CardDescription>
              Pedidos pendentes de transporte
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {solicitacoesTransporte.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Nenhuma solicitação pendente</p>
                </div>
              ) : (
                solicitacoesTransporte.map((solicitacao) => (
                  <div key={solicitacao.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h4 className="font-semibold">{solicitacao.paciente}</h4>
                        <p className="text-sm text-gray-600">{solicitacao.especialidade}</p>
                      </div>
                      <div className="flex space-x-2">
                        {getUrgenciaBadge(solicitacao.urgencia)}
                        <Badge variant="outline">{solicitacao.status}</Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm mb-2">
                      <div>
                        <span className="text-gray-500">Destino:</span>
                        <p className="font-medium">{solicitacao.destino}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Data desejada:</span>
                        <p className="font-medium">{solicitacao.dataDesejada}</p>
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 mb-3">{solicitacao.observacoes}</p>

                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Aprovar
                      </Button>
                      <Button size="sm" variant="outline">
                        <Calendar className="h-4 w-4 mr-2" />
                        Agendar
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
                <Car className="h-4 w-4 text-blue-600 mr-3" />
                <span className="text-sm">{servico}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}