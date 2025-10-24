'use client'

import { useState } from 'react'
import { useAdminAuth } from '@/contexts/AdminAuthContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import {
  MapPin,
  Plus,
  Search,
  Filter,
  Download,
  Calendar,
  Clock,
  Users,
  FileText,
  CheckCircle,
  AlertCircle,
  Home,
  User,
  Car,
  Route,
  Zap
} from 'lucide-react'

interface RegistroVisita {
  id: string
  protocolo: string
  tipoVisita: 'Domiciliar' | 'Institucional' | 'Estudo Social' | 'Acompanhamento' | 'Verificação' | 'Emergencial'
  familia: {
    responsavel: string
    cpf: string
    endereco: string
    bairro: string
    telefone: string
    composicaoFamiliar: number
  }
  tecnico: {
    nome: string
    registro: string
    funcao: 'Assistente Social' | 'Psicólogo' | 'Pedagogo' | 'Terapeuta Ocupacional'
  }
  objetivoVisita: string
  status: 'Agendada' | 'Realizada' | 'Não Realizada' | 'Reagendada' | 'Cancelada'
  dataAgendamento: string
  dataRealizacao?: string
  horaInicio?: string
  horaFim?: string
  observacoes?: string
  resultados?: string
  encaminhamentos?: string
  proximaVisita?: string
  documentosGerados?: string[]
  acompanhantes?: string[]
}

const mockVisitas: RegistroVisita[] = [
  {
    id: '1',
    protocolo: 'RV-2024-001',
    tipoVisita: 'Domiciliar',
    familia: {
      responsavel: 'Maria Silva Santos',
      cpf: '123.456.789-00',
      endereco: 'Rua das Flores, 123',
      bairro: 'Centro',
      telefone: '(11) 98765-4321',
      composicaoFamiliar: 4
    },
    tecnico: {
      nome: 'Dra. Ana Costa',
      registro: 'CRESS-123456',
      funcao: 'Assistente Social'
    },
    objetivoVisita: 'Avaliação das condições habitacionais e acompanhamento do desenvolvimento das crianças',
    status: 'Realizada',
    dataAgendamento: '2024-01-15',
    dataRealizacao: '2024-01-15',
    horaInicio: '09:00',
    horaFim: '10:30',
    observacoes: 'Família receptiva. Condições habitacionais adequadas.',
    resultados: 'Verificado cumprimento das condicionalidades do programa social. Crianças frequentando escola regularmente.',
    encaminhamentos: 'Orientações sobre saúde preventiva. Agendamento de consulta odontológica.',
    proximaVisita: '2024-02-15',
    documentosGerados: ['Relatório de Visita Domiciliar', 'Estudo Social'],
    acompanhantes: ['João Santos (esposo)']
  },
  {
    id: '2',
    protocolo: 'RV-2024-002',
    tipoVisita: 'Emergencial',
    familia: {
      responsavel: 'José Lima Oliveira',
      cpf: '987.654.321-00',
      endereco: 'Av. Principal, 456',
      bairro: 'Vila Nova',
      telefone: '(11) 91234-5678',
      composicaoFamiliar: 6
    },
    tecnico: {
      nome: 'Dr. Carlos Ferreira',
      registro: 'CRP-654321',
      funcao: 'Psicólogo'
    },
    objetivoVisita: 'Verificação de denúncia de violação de direitos e avaliação de risco',
    status: 'Agendada',
    dataAgendamento: '2024-01-17',
    observacoes: 'Visita urgente devido a denúncia. Coordenar com Conselho Tutelar.',
    acompanhantes: ['Conselheiro Tutelar']
  }
]

export default function RegistroVisitasPage() {
  const { user } = useAdminAuth()
  const [visitas, setVisitas] = useState<RegistroVisita[]>(mockVisitas)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [tipoFilter, setTipoFilter] = useState<string>('all')
  const [showNewVisitaModal, setShowNewVisitaModal] = useState(false)

  const filteredVisitas = visitas.filter(visita => {
    const matchesSearch = visita.familia.responsavel.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         visita.protocolo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         visita.tecnico.nome.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || visita.status === statusFilter
    const matchesTipo = tipoFilter === 'all' || visita.tipoVisita === tipoFilter
    return matchesSearch && matchesStatus && matchesTipo
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Agendada': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'Realizada': return 'bg-green-100 text-green-800 border-green-200'
      case 'Não Realizada': return 'bg-red-100 text-red-800 border-red-200'
      case 'Reagendada': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'Cancelada': return 'bg-gray-100 text-gray-800 border-gray-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case 'Domiciliar': return 'bg-green-100 text-green-800 border-green-200'
      case 'Institucional': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'Estudo Social': return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'Acompanhamento': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'Verificação': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'Emergencial': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const stats = {
    totalVisitas: visitas.length,
    realizadasMes: visitas.filter(v => v.status === 'Realizada').length,
    agendadasHoje: visitas.filter(v => v.dataAgendamento === '2024-01-16' && v.status === 'Agendada').length,
    emergenciais: visitas.filter(v => v.tipoVisita === 'Emergencial').length
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <MapPin className="h-8 w-8 text-blue-600" />
            Registro de Visitas
          </h1>
          <p className="text-gray-600 mt-1">
            Gestão e acompanhamento de visitas domiciliares e institucionais
          </p>
        </div>
        <Button onClick={() => setShowNewVisitaModal(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Nova Visita
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Visitas</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalVisitas}</div>
            <p className="text-xs text-muted-foreground">este mês</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Realizadas</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.realizadasMes}</div>
            <p className="text-xs text-muted-foreground">este mês</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Agendadas Hoje</CardTitle>
            <Calendar className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.agendadasHoje}</div>
            <p className="text-xs text-muted-foreground">para hoje</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Emergenciais</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.emergenciais}</div>
            <p className="text-xs text-muted-foreground">pendentes</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filtros e Busca</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por família, protocolo ou técnico..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Status</SelectItem>
                <SelectItem value="Agendada">Agendada</SelectItem>
                <SelectItem value="Realizada">Realizada</SelectItem>
                <SelectItem value="Não Realizada">Não Realizada</SelectItem>
                <SelectItem value="Reagendada">Reagendada</SelectItem>
                <SelectItem value="Cancelada">Cancelada</SelectItem>
              </SelectContent>
            </Select>
            <Select value={tipoFilter} onValueChange={setTipoFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Tipos</SelectItem>
                <SelectItem value="Domiciliar">Domiciliar</SelectItem>
                <SelectItem value="Institucional">Institucional</SelectItem>
                <SelectItem value="Estudo Social">Estudo Social</SelectItem>
                <SelectItem value="Acompanhamento">Acompanhamento</SelectItem>
                <SelectItem value="Verificação">Verificação</SelectItem>
                <SelectItem value="Emergencial">Emergencial</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6">
        {filteredVisitas.map((visita) => (
          <Card key={visita.id} className="overflow-hidden">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{visita.protocolo}</CardTitle>
                  <CardDescription className="flex items-center gap-2 mt-1">
                    <Home className="h-4 w-4" />
                    {visita.familia.responsavel}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Badge className={getTipoColor(visita.tipoVisita)}>
                    {visita.tipoVisita}
                  </Badge>
                  <Badge className={getStatusColor(visita.status)}>
                    {visita.status}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-sm text-gray-900 mb-2 flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Família
                    </h4>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p><strong>Responsável:</strong> {visita.familia.responsavel}</p>
                      <p><strong>CPF:</strong> {visita.familia.cpf}</p>
                      <p><strong>Telefone:</strong> {visita.familia.telefone}</p>
                      <p><strong>Endereço:</strong> {visita.familia.endereco}</p>
                      <p><strong>Bairro:</strong> {visita.familia.bairro}</p>
                      <p><strong>Composição:</strong> {visita.familia.composicaoFamiliar} pessoas</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-sm text-gray-900 mb-2 flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Técnico Responsável
                    </h4>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p><strong>Nome:</strong> {visita.tecnico.nome}</p>
                      <p><strong>Registro:</strong> {visita.tecnico.registro}</p>
                      <p><strong>Função:</strong> {visita.tecnico.funcao}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-sm text-gray-900 mb-2 flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Agendamento
                    </h4>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p><strong>Data:</strong> {new Date(visita.dataAgendamento).toLocaleDateString('pt-BR')}</p>
                      {visita.dataRealizacao && (
                        <p><strong>Realizada em:</strong> {new Date(visita.dataRealizacao).toLocaleDateString('pt-BR')}</p>
                      )}
                      {visita.horaInicio && visita.horaFim && (
                        <p><strong>Horário:</strong> {visita.horaInicio} às {visita.horaFim}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-sm text-gray-900 mb-2">
                      Objetivo da Visita
                    </h4>
                    <p className="text-sm text-gray-600">{visita.objetivoVisita}</p>
                  </div>

                  {visita.acompanhantes && visita.acompanhantes.length > 0 && (
                    <div>
                      <h4 className="font-medium text-sm text-gray-900 mb-2">
                        Acompanhantes
                      </h4>
                      <div className="space-y-1 text-sm text-gray-600">
                        {visita.acompanhantes.map((acompanhante, index) => (
                          <p key={index}>• {acompanhante}</p>
                        ))}
                      </div>
                    </div>
                  )}

                  {visita.documentosGerados && visita.documentosGerados.length > 0 && (
                    <div>
                      <h4 className="font-medium text-sm text-gray-900 mb-2 flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Documentos Gerados
                      </h4>
                      <div className="space-y-1 text-sm text-gray-600">
                        {visita.documentosGerados.map((doc, index) => (
                          <p key={index}>• {doc}</p>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {(visita.observacoes || visita.resultados || visita.encaminhamentos) && (
                <div className="mt-6 pt-4 border-t">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {visita.observacoes && (
                      <div>
                        <h4 className="font-medium text-sm text-gray-900 mb-2">Observações</h4>
                        <p className="text-sm text-gray-600">{visita.observacoes}</p>
                      </div>
                    )}

                    {visita.resultados && (
                      <div>
                        <h4 className="font-medium text-sm text-gray-900 mb-2">Resultados</h4>
                        <p className="text-sm text-gray-600">{visita.resultados}</p>
                      </div>
                    )}

                    {visita.encaminhamentos && (
                      <div>
                        <h4 className="font-medium text-sm text-gray-900 mb-2">Encaminhamentos</h4>
                        <p className="text-sm text-gray-600">{visita.encaminhamentos}</p>
                        {visita.proximaVisita && (
                          <p className="text-sm text-blue-600 mt-2">
                            <strong>Próxima visita:</strong> {new Date(visita.proximaVisita).toLocaleDateString('pt-BR')}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-2 mt-4 pt-4 border-t">
                <Button variant="outline" size="sm">
                  <Route className="h-4 w-4 mr-1" />
                  Ver Rota
                </Button>
                <Button variant="outline" size="sm">
                  <FileText className="h-4 w-4 mr-1" />
                  Relatório
                </Button>
                {visita.status === 'Agendada' && (
                  <Button size="sm">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Registrar Realização
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-blue-600" />
            Serviços Gerados Automaticamente
          </CardTitle>
          <CardDescription>
            Esta página gera automaticamente os seguintes serviços para o catálogo público:
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium text-green-700 mb-2">Solicitação de Visita Domiciliar</h4>
              <p className="text-sm text-gray-600">
                Permite que famílias solicitem visitas domiciliares para avaliação social, orientação ou acompanhamento.
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium text-green-700 mb-2">Agendamento de Visita Social</h4>
              <p className="text-sm text-gray-600">
                Agendamento online de visitas para estudos sociais, relatórios ou acompanhamento familiar.
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium text-green-700 mb-2">Acompanhar Visita</h4>
              <p className="text-sm text-gray-600">
                Consulta do status e resultados de visitas domiciliares realizadas pela equipe técnica.
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium text-green-700 mb-2">Relatório de Visita</h4>
              <p className="text-sm text-gray-600">
                Acesso aos relatórios e documentos gerados durante as visitas domiciliares.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}