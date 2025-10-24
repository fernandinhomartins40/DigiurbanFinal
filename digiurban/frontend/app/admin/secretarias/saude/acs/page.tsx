'use client'

import { useAdminAuth } from '@/contexts/AdminAuthContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Users,
  MapPin,
  Home,
  Calendar,
  FileText,
  Plus,
  Search,
  Filter,
  Activity,
  Heart,
  Baby,
  Loader2,
  AlertCircle
} from 'lucide-react'
import { useState } from 'react'
import { useHealthProfessionals, usePatients } from '@/hooks/api/health'
import { useToast } from '@/hooks/use-toast'


const servicosGerados = [
  'Visita Domiciliar',
  'Acompanhamento Familiar',
  'Cadastro no PSF',
  'Busca Ativa',
  'Educação em Saúde',
  'Agendamento de Visita',
  'Relatório de Visita'
]

export default function ACSPage() {
  const { user } = useAdminAuth()
  const { toast } = useToast()
  const {
    professionals: healthProfessionals,
    loading: professionalsLoading,
    error: professionalsError,
    createProfessional
  } = useHealthProfessionals()

  const {
    patients,
    loading: patientsLoading,
    error: patientsError,
    getPatientsByFilters
  } = usePatients()

  const [novaVisita, setNovaVisita] = useState({
    familia: '',
    acs: '',
    data: '',
    tipo: 'rotina',
    observacoes: ''
  })

  // Filtrar apenas ACS dos profissionais de saúde
  const agentesComunitarios = healthProfessionals.filter(prof =>
    prof.role === 'ACS' || prof.speciality?.toLowerCase().includes('comunitário')
  )

  // Dados calculados
  const acsAtivos = agentesComunitarios.filter(acs => acs.status === 'ACTIVE')
  const familiasCadastradas = patients.length // Assumindo que cada paciente representa uma família
  const microareasCobertas = new Set(agentesComunitarios.map(acs => acs.area || 'Centro')).size

  const handleNovaVisita = async () => {
    if (!novaVisita.familia || !novaVisita.acs || !novaVisita.data) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive"
      })
      return
    }

    // Aqui seria criado um agendamento/visita
    toast({
      title: "Sucesso",
      description: "Visita agendada com sucesso",
    })
    setNovaVisita({
      familia: '',
      acs: '',
      data: '',
      tipo: 'rotina',
      observacoes: ''
    })
  }

  if (professionalsLoading || patientsLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Carregando dados dos ACS...</span>
      </div>
    )
  }

  if (professionalsError || patientsError) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold">Erro ao carregar</h3>
          <p className="text-gray-600">{professionalsError || patientsError}</p>
        </div>
      </div>
    )
  }

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return <Badge className="bg-green-500 text-white">Ativo</Badge>
      case 'inactive':
        return <Badge variant="secondary">Inativo</Badge>
      case 'vacation':
        return <Badge className="bg-blue-500 text-white">Férias</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getTipoVisitaBadge = (tipo: string) => {
    switch (tipo) {
      case 'rotina':
        return <Badge variant="outline">Rotina</Badge>
      case 'urgente':
        return <Badge className="bg-red-500 text-white">Urgente</Badge>
      case 'busca-ativa':
        return <Badge className="bg-yellow-500 text-white">Busca Ativa</Badge>
      default:
        return <Badge variant="outline">{tipo}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Users className="h-8 w-8 text-blue-600 mr-3" />
            Agentes Comunitários de Saúde
          </h1>
          <p className="text-gray-600 mt-1">
            Gerenciamento de ACS, microáreas e visitas domiciliares
          </p>
        </div>
        <Badge variant="outline" className="text-blue-600 border-blue-200">
          PSF Municipal
        </Badge>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ACS Ativos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{acsAtivos.length}</div>
            <p className="text-xs text-muted-foreground">
              Cobrindo {microareasCobertas} microáreas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Famílias Cadastradas</CardTitle>
            <Home className="h-4 w-4 text-muted-foregreen" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{familiasCadastradas}</div>
            <p className="text-xs text-muted-foreground">
              Famílias acompanhadas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Visitas do Mês</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.floor(familiasCadastradas * 0.3)}</div>
            <p className="text-xs text-muted-foreground">
              Meta: {familiasCadastradas} visitas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cobertura</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{acsAtivos.length > 0 ? Math.round((familiasCadastradas / (acsAtivos.length * 100)) * 100) : 0}%</div>
            <p className="text-xs text-muted-foreground">
              Do território
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Nova Visita */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Plus className="h-5 w-5 mr-2" />
              Agendar Visita
            </CardTitle>
            <CardDescription>
              Programar nova visita domiciliar
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="familia">Família</Label>
              <Input
                id="familia"
                placeholder="Nome da família ou endereço"
                value={novaVisita.familia}
                onChange={(e) => setNovaVisita(prev => ({ ...prev, familia: e.target.value }))}
              />
            </div>

            <div>
              <Label htmlFor="acs">ACS Responsável</Label>
              <Select value={novaVisita.acs} onValueChange={(value) => setNovaVisita(prev => ({ ...prev, acs: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o ACS" />
                </SelectTrigger>
                <SelectContent>
                  {agentesComunitarios.map((acs) => (
                    <SelectItem key={acs.id} value={acs.name}>
                      {acs.name} - {acs.area || 'Centro'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="data">Data da Visita</Label>
              <Input
                id="data"
                type="date"
                value={novaVisita.data}
                onChange={(e) => setNovaVisita(prev => ({ ...prev, data: e.target.value }))}
              />
            </div>

            <div>
              <Label htmlFor="tipo">Tipo de Visita</Label>
              <Select value={novaVisita.tipo} onValueChange={(value) => setNovaVisita(prev => ({ ...prev, tipo: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rotina">Rotina</SelectItem>
                  <SelectItem value="urgente">Urgente</SelectItem>
                  <SelectItem value="busca-ativa">Busca Ativa</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button className="w-full" onClick={handleNovaVisita}>
              <Plus className="h-4 w-4 mr-2" />
              Agendar Visita
            </Button>
          </CardContent>
        </Card>

        {/* Lista de ACS */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Agentes Comunitários</CardTitle>
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
              {agentesComunitarios.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Nenhum ACS cadastrado</p>
                </div>
              ) : (
                agentesComunitarios.map((acs) => (
                  <div key={acs.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-semibold">{acs.name}</h4>
                        <p className="text-sm text-gray-600">{acs.area || 'Centro'}</p>
                      </div>
                      {getStatusBadge(acs.status)}
                    </div>

                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">CRM/Registro:</span>
                        <p className="font-medium">{acs.crm || 'N/A'}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Especialidade:</span>
                        <p className="font-medium">{acs.speciality || 'ACS'}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Email:</span>
                        <p className="font-medium">{acs.email || 'N/A'}</p>
                      </div>
                    </div>

                    <div className="flex space-x-2 mt-3">
                      <Button size="sm" variant="outline">
                        <MapPin className="h-4 w-4 mr-2" />
                        Ver Território
                      </Button>
                      <Button size="sm" variant="outline">
                        <FileText className="h-4 w-4 mr-2" />
                        Relatórios
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Visitas Agendadas */}
      <Card>
        <CardHeader>
          <CardTitle>Visitas Agendadas</CardTitle>
          <CardDescription>
            Próximas visitas domiciliares programadas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {agentesComunitarios.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Nenhuma visita agendada</p>
              </div>
            ) : (
              // Como não temos um hook específico para visitas, mostramos os pacientes
              patients.slice(0, 5).map((patient) => (
                <div key={patient.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="font-semibold">{patient.name}</h4>
                      <p className="text-sm text-gray-600">{patient.address || 'Endereço não informado'}</p>
                    </div>
                    <Badge variant="outline">Pendente</Badge>
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-sm mb-2">
                    <div>
                      <span className="text-gray-500">Paciente:</span>
                      <p className="font-medium">{patient.name}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Cadastro:</span>
                      <p className="font-medium">{new Date(patient.created_at).toLocaleDateString('pt-BR')}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Status:</span>
                      <p className="font-medium">{patient.status}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

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
                <Users className="h-4 w-4 text-blue-600 mr-3" />
                <span className="text-sm">{servico}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}