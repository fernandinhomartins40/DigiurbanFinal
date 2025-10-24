'use client'

import { useState } from 'react'
import { useAdminAuth } from '@/hooks/useAdminAuth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import {
  Shield,
  Plus,
  Search,
  Filter,
  Download,
  Users,
  Clock,
  MapPin,
  User,
  Calendar,
  Car,
  Radio,
  AlertTriangle,
  CheckCircle,
  Phone,
  Route,
  Zap
} from 'lucide-react'

interface ApoioGuarda {
  id: string
  protocolo: string
  tipoApoio: 'Solicitação de Apoio' | 'Escoltas' | 'Segurança de Eventos' | 'Patrulhamento Específico' | 'Apoio a Operação' | 'Segurança Escolar' | 'Apoio a Outros Órgãos'
  solicitante: {
    nome: string
    orgao?: string
    cargo?: string
    telefone: string
    email?: string
    cpf?: string
  }
  detalhamento: {
    objetivo: string
    descricaoCompleta: string
    numeroParticipantes?: number
    tipoEvento?: string
    nivelRisco: 'Baixo' | 'Médio' | 'Alto' | 'Crítico'
  }
  local: {
    endereco: string
    bairro: string
    pontoReferencia?: string
    coordenadas?: string
    areaCobertura?: string
  }
  cronograma: {
    dataInicio: string
    horaInicio: string
    dataFim?: string
    horaFim?: string
    duracao: string
    periodicidade?: 'Único' | 'Diário' | 'Semanal' | 'Mensal'
  }
  recursosNecessarios: {
    numeroAgentes: number
    viaturas: number
    equipamentos?: string[]
    especialidades?: string[]
  }
  status: 'Solicitado' | 'Em Análise' | 'Aprovado' | 'Planejado' | 'Em Execução' | 'Concluído' | 'Cancelado'
  prioridade: 'Baixa' | 'Média' | 'Alta' | 'Urgente'
  equipeAlocada?: {
    supervisor: string
    agentes: string[]
    viaturas: string[]
    equipamentos: string[]
  }
  observacoes?: string
  relatorio?: string
  custoEstimado?: number
  aprovadoPor?: string
  dataAprovacao?: string
}

const mockApoios: ApoioGuarda[] = [
  {
    id: '1',
    protocolo: 'AG-2024-001',
    tipoApoio: 'Segurança de Eventos',
    solicitante: {
      nome: 'João Silva Santos',
      orgao: 'Secretaria de Cultura',
      cargo: 'Coordenador de Eventos',
      telefone: '(11) 98765-4321',
      email: 'joao.silva@cultura.gov.br',
      cpf: '123.456.789-00'
    },
    detalhamento: {
      objetivo: 'Garantir a segurança durante festival cultural na praça central',
      descricaoCompleta: 'Festival de música com apresentações de bandas locais, esperados 500 participantes, venda de alimentos e bebidas',
      numeroParticipantes: 500,
      tipoEvento: 'Festival Cultural',
      nivelRisco: 'Médio'
    },
    local: {
      endereco: 'Praça Central, s/n',
      bairro: 'Centro',
      pontoReferencia: 'Em frente à Igreja Matriz',
      coordenadas: '-23.550520, -46.633309',
      areaCobertura: 'Praça e ruas adjacentes'
    },
    cronograma: {
      dataInicio: '2024-01-20',
      horaInicio: '18:00',
      dataFim: '2024-01-20',
      horaFim: '23:00',
      duracao: '5 horas',
      periodicidade: 'Único'
    },
    recursosNecessarios: {
      numeroAgentes: 8,
      viaturas: 2,
      equipamentos: ['Rádios', 'Cones', 'Fita zebrada'],
      especialidades: ['Controle de multidão', 'Trânsito']
    },
    status: 'Planejado',
    prioridade: 'Alta',
    equipeAlocada: {
      supervisor: 'GCM Carlos Lima',
      agentes: ['GCM João Silva', 'GCM Maria Santos', 'GCM Pedro Costa', 'GCM Ana Ferreira'],
      viaturas: ['GCM-01', 'GCM-03'],
      equipamentos: ['Kit Evento Completo', 'Equipamentos de Comunicação']
    },
    observacoes: 'Coordenar com Bombeiros e SAMU. Verificar alvará do evento.',
    custoEstimado: 2400,
    aprovadoPor: 'Comandante GCM',
    dataAprovacao: '2024-01-16'
  },
  {
    id: '2',
    protocolo: 'AG-2024-002',
    tipoApoio: 'Patrulhamento Específico',
    solicitante: {
      nome: 'Maria Costa Lima',
      orgao: 'Associação de Moradores',
      cargo: 'Presidente',
      telefone: '(11) 91234-5678',
      cpf: '987.654.321-00'
    },
    detalhamento: {
      objetivo: 'Intensificar patrulhamento devido ao aumento de furtos na região',
      descricaoCompleta: 'Solicitação de rondas adicionais no período noturno após registro de 3 furtos na última semana',
      nivelRisco: 'Alto'
    },
    local: {
      endereco: 'Ruas do Jardim Esperança',
      bairro: 'Jardim Esperança',
      areaCobertura: 'Todo o bairro residencial'
    },
    cronograma: {
      dataInicio: '2024-01-17',
      horaInicio: '19:00',
      horaFim: '06:00',
      duracao: '11 horas por dia',
      periodicidade: 'Diário'
    },
    recursosNecessarios: {
      numeroAgentes: 4,
      viaturas: 2,
      especialidades: ['Patrulhamento preventivo']
    },
    status: 'Em Execução',
    prioridade: 'Alta',
    equipeAlocada: {
      supervisor: 'GCM Ana Ferreira',
      agentes: ['GCM Roberto Silva', 'GCM Carmen Oliveira'],
      viaturas: ['GCM-05', 'GCM-07'],
      equipamentos: ['Equipamentos padrão']
    },
    observacoes: 'Patrulhamento iniciado. Redução de 70% nas ocorrências.'
  }
]

export default function ApoioGuardaPage() {
  const { user } = useAdminAuth()
  const [apoios, setApoios] = useState<ApoioGuarda[]>(mockApoios)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [tipoFilter, setTipoFilter] = useState<string>('all')
  const [prioridadeFilter, setPrioridadeFilter] = useState<string>('all')
  const [showNewApoioModal, setShowNewApoioModal] = useState(false)

  const filteredApoios = apoios.filter(apoio => {
    const matchesSearch = apoio.solicitante.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         apoio.protocolo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         apoio.tipoApoio.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || apoio.status === statusFilter
    const matchesTipo = tipoFilter === 'all' || apoio.tipoApoio === tipoFilter
    const matchesPrioridade = prioridadeFilter === 'all' || apoio.prioridade === prioridadeFilter
    return matchesSearch && matchesStatus && matchesTipo && matchesPrioridade
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Solicitado': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'Em Análise': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'Aprovado': return 'bg-green-100 text-green-800 border-green-200'
      case 'Planejado': return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'Em Execução': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'Concluído': return 'bg-gray-100 text-gray-800 border-gray-200'
      case 'Cancelado': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getPrioridadeColor = (prioridade: string) => {
    switch (prioridade) {
      case 'Baixa': return 'bg-green-100 text-green-800 border-green-200'
      case 'Média': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'Alta': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'Urgente': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const stats = {
    totalApoios: apoios.length,
    emExecucao: apoios.filter(a => a.status === 'Em Execução').length,
    planejados: apoios.filter(a => a.status === 'Planejado').length,
    urgentes: apoios.filter(a => a.prioridade === 'Urgente').length
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Shield className="h-8 w-8 text-blue-600" />
            Apoio da Guarda Municipal
          </h1>
          <p className="text-gray-600 mt-1">
            Coordenação operacional e gestão de recursos da Guarda Municipal
          </p>
        </div>
        <Button onClick={() => setShowNewApoioModal(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Nova Solicitação
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Apoios</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalApoios}</div>
            <p className="text-xs text-muted-foreground">este mês</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Em Execução</CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.emExecucao}</div>
            <p className="text-xs text-muted-foreground">ativas agora</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Planejados</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.planejados}</div>
            <p className="text-xs text-muted-foreground">aprovados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Urgentes</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.urgentes}</div>
            <p className="text-xs text-muted-foreground">alta prioridade</p>
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
                  placeholder="Buscar por solicitante, protocolo ou tipo..."
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
                <SelectItem value="Solicitado">Solicitado</SelectItem>
                <SelectItem value="Em Análise">Em Análise</SelectItem>
                <SelectItem value="Aprovado">Aprovado</SelectItem>
                <SelectItem value="Planejado">Planejado</SelectItem>
                <SelectItem value="Em Execução">Em Execução</SelectItem>
                <SelectItem value="Concluído">Concluído</SelectItem>
                <SelectItem value="Cancelado">Cancelado</SelectItem>
              </SelectContent>
            </Select>
            <Select value={tipoFilter} onValueChange={setTipoFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Tipos</SelectItem>
                <SelectItem value="Solicitação de Apoio">Solicitação de Apoio</SelectItem>
                <SelectItem value="Escoltas">Escoltas</SelectItem>
                <SelectItem value="Segurança de Eventos">Segurança de Eventos</SelectItem>
                <SelectItem value="Patrulhamento Específico">Patrulhamento Específico</SelectItem>
                <SelectItem value="Apoio a Operação">Apoio a Operação</SelectItem>
              </SelectContent>
            </Select>
            <Select value={prioridadeFilter} onValueChange={setPrioridadeFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Prioridade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as Prioridades</SelectItem>
                <SelectItem value="Baixa">Baixa</SelectItem>
                <SelectItem value="Média">Média</SelectItem>
                <SelectItem value="Alta">Alta</SelectItem>
                <SelectItem value="Urgente">Urgente</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6">
        {filteredApoios.map((apoio) => (
          <Card key={apoio.id} className="overflow-hidden">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{apoio.protocolo}</CardTitle>
                  <CardDescription className="flex items-center gap-2 mt-1">
                    <Shield className="h-4 w-4" />
                    {apoio.tipoApoio}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Badge className={getPrioridadeColor(apoio.prioridade)}>
                    {apoio.prioridade}
                  </Badge>
                  <Badge className={getStatusColor(apoio.status)}>
                    {apoio.status}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-sm text-gray-900 mb-2 flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Solicitante
                    </h4>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p><strong>Nome:</strong> {apoio.solicitante.nome}</p>
                      {apoio.solicitante.orgao && (
                        <p><strong>Órgão:</strong> {apoio.solicitante.orgao}</p>
                      )}
                      {apoio.solicitante.cargo && (
                        <p><strong>Cargo:</strong> {apoio.solicitante.cargo}</p>
                      )}
                      <p><strong>Telefone:</strong> {apoio.solicitante.telefone}</p>
                      {apoio.solicitante.email && (
                        <p><strong>Email:</strong> {apoio.solicitante.email}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-sm text-gray-900 mb-2 flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Localização
                    </h4>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p><strong>Endereço:</strong> {apoio.local.endereco}</p>
                      <p><strong>Bairro:</strong> {apoio.local.bairro}</p>
                      {apoio.local.pontoReferencia && (
                        <p><strong>Referência:</strong> {apoio.local.pontoReferencia}</p>
                      )}
                      {apoio.local.areaCobertura && (
                        <p><strong>Área:</strong> {apoio.local.areaCobertura}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-sm text-gray-900 mb-2 flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Cronograma
                    </h4>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p><strong>Início:</strong> {new Date(apoio.cronograma.dataInicio).toLocaleDateString('pt-BR')} às {apoio.cronograma.horaInicio}</p>
                      {apoio.cronograma.dataFim && (
                        <p><strong>Fim:</strong> {new Date(apoio.cronograma.dataFim).toLocaleDateString('pt-BR')} às {apoio.cronograma.horaFim}</p>
                      )}
                      <p><strong>Duração:</strong> {apoio.cronograma.duracao}</p>
                      {apoio.cronograma.periodicidade && (
                        <p><strong>Periodicidade:</strong> {apoio.cronograma.periodicidade}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-sm text-gray-900 mb-2 flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Recursos Necessários
                    </h4>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p><strong>Agentes:</strong> {apoio.recursosNecessarios.numeroAgentes}</p>
                      <p><strong>Viaturas:</strong> {apoio.recursosNecessarios.viaturas}</p>
                      {apoio.recursosNecessarios.equipamentos && (
                        <p><strong>Equipamentos:</strong> {apoio.recursosNecessarios.equipamentos.join(', ')}</p>
                      )}
                      {apoio.recursosNecessarios.especialidades && (
                        <p><strong>Especialidades:</strong> {apoio.recursosNecessarios.especialidades.join(', ')}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {apoio.equipeAlocada && (
                    <div>
                      <h4 className="font-medium text-sm text-gray-900 mb-2 flex items-center gap-2">
                        <Radio className="h-4 w-4" />
                        Equipe Alocada
                      </h4>
                      <div className="space-y-1 text-sm text-gray-600">
                        <p><strong>Supervisor:</strong> {apoio.equipeAlocada.supervisor}</p>
                        <p><strong>Agentes:</strong> {apoio.equipeAlocada.agentes.join(', ')}</p>
                        <p><strong>Viaturas:</strong> {apoio.equipeAlocada.viaturas.join(', ')}</p>
                        <p><strong>Equipamentos:</strong> {apoio.equipeAlocada.equipamentos.join(', ')}</p>
                      </div>
                    </div>
                  )}

                  {apoio.custoEstimado && (
                    <div>
                      <h4 className="font-medium text-sm text-gray-900 mb-2">
                        Custo Estimado
                      </h4>
                      <p className="text-lg font-bold text-green-600">
                        R$ {apoio.custoEstimado.toLocaleString('pt-BR')}
                      </p>
                    </div>
                  )}

                  {apoio.aprovadoPor && (
                    <div>
                      <h4 className="font-medium text-sm text-gray-900 mb-2">
                        Aprovação
                      </h4>
                      <div className="space-y-1 text-sm text-gray-600">
                        <p><strong>Aprovado por:</strong> {apoio.aprovadoPor}</p>
                        {apoio.dataAprovacao && (
                          <p><strong>Data:</strong> {new Date(apoio.dataAprovacao).toLocaleDateString('pt-BR')}</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t">
                <h4 className="font-medium text-sm text-gray-900 mb-2">Objetivo</h4>
                <p className="text-sm text-gray-600 mb-4">{apoio.detalhamento.objetivo}</p>

                <h4 className="font-medium text-sm text-gray-900 mb-2">Descrição Completa</h4>
                <p className="text-sm text-gray-600 mb-4">{apoio.detalhamento.descricaoCompleta}</p>

                {apoio.detalhamento.numeroParticipantes && (
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm"><strong>Participantes:</strong> {apoio.detalhamento.numeroParticipantes}</p>
                    </div>
                    <div>
                      <p className="text-sm"><strong>Nível de Risco:</strong> {apoio.detalhamento.nivelRisco}</p>
                    </div>
                  </div>
                )}

                {apoio.observacoes && (
                  <div className="mb-4">
                    <h4 className="font-medium text-sm text-gray-900 mb-2">Observações</h4>
                    <p className="text-sm text-gray-600">{apoio.observacoes}</p>
                  </div>
                )}

                {apoio.relatorio && (
                  <div className="mb-4">
                    <h4 className="font-medium text-sm text-gray-900 mb-2">Relatório</h4>
                    <p className="text-sm text-gray-600">{apoio.relatorio}</p>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 mt-4 pt-4 border-t">
                <Button variant="outline" size="sm">
                  <MapPin className="h-4 w-4 mr-1" />
                  Ver Localização
                </Button>
                <Button variant="outline" size="sm">
                  <Phone className="h-4 w-4 mr-1" />
                  Contatar
                </Button>
                {apoio.status !== 'Concluído' && apoio.status !== 'Cancelado' && (
                  <Button size="sm">
                    <Shield className="h-4 w-4 mr-1" />
                    Gerenciar
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
              <h4 className="font-medium text-green-700 mb-2">Solicitação de Apoio</h4>
              <p className="text-sm text-gray-600">
                Permite que órgãos públicos e entidades solicitem apoio operacional da Guarda Municipal para atividades específicas.
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium text-green-700 mb-2">Escoltas</h4>
              <p className="text-sm text-gray-600">
                Solicitação de escolta da Guarda Municipal para transporte de valores, autoridades ou cargas especiais.
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium text-green-700 mb-2">Segurança de Eventos</h4>
              <p className="text-sm text-gray-600">
                Contratação de serviços de segurança da Guarda Municipal para eventos públicos e privados de interesse municipal.
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium text-green-700 mb-2">Patrulhamento Específico</h4>
              <p className="text-sm text-gray-600">
                Solicitação de patrulhamento intensificado em áreas específicas com base em demandas da comunidade.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}