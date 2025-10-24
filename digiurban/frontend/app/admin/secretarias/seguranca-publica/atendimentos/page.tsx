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
  Clock,
  AlertCircle,
  CheckCircle,
  User,
  MapPin,
  Phone,
  Calendar,
  FileText,
  Car,
  Radio,
  Siren,
  Zap
} from 'lucide-react'

interface AtendimentoSeguranca {
  id: string
  protocolo: string
  tipoAtendimento: 'Solicitação de Ronda' | 'Apoio da Guarda' | 'Orientação de Segurança' | 'Denúncia Anônima' | 'Emergência' | 'Perturbação do Sossego' | 'Apoio a Evento'
  solicitante: {
    nome: string
    cpf?: string
    telefone: string
    endereco: string
    bairro: string
    identificacao?: string
  }
  detalhesOcorrencia: string
  urgencia: 'Baixa' | 'Média' | 'Alta' | 'Crítica'
  status: 'Recebido' | 'Em Análise' | 'Despachado' | 'Em Atendimento' | 'Concluído' | 'Cancelado'
  localizacao: {
    endereco: string
    bairro: string
    pontoReferencia?: string
    coordenadas?: string
  }
  dataRegistro: string
  horaRegistro: string
  prazoAtendimento?: string
  responsavel?: string
  equipeResponsavel?: string
  viatura?: string
  observacoes?: string
  resolucao?: string
  tempoResposta?: string
  satisfacao?: number
}

const mockAtendimentos: AtendimentoSeguranca[] = [
  {
    id: '1',
    protocolo: 'SP-ATD-2024-001',
    tipoAtendimento: 'Solicitação de Ronda',
    solicitante: {
      nome: 'Maria Silva Santos',
      cpf: '123.456.789-00',
      telefone: '(11) 98765-4321',
      endereco: 'Rua das Flores, 123',
      bairro: 'Centro',
      identificacao: 'Comerciante local'
    },
    detalhesOcorrencia: 'Solicitação de ronda preventiva no comércio local devido a tentativas de furto na região',
    urgencia: 'Média',
    status: 'Em Atendimento',
    localizacao: {
      endereco: 'Rua das Flores, 123',
      bairro: 'Centro',
      pontoReferencia: 'Próximo ao Banco Central',
      coordenadas: '-23.550520, -46.633309'
    },
    dataRegistro: '2024-01-15',
    horaRegistro: '14:30',
    prazoAtendimento: '2 horas',
    responsavel: 'GCM João Silva',
    equipeResponsavel: 'Equipe Charlie',
    viatura: 'GCM-03',
    observacoes: 'Área comercial movimentada, aumentar frequência de rondas'
  },
  {
    id: '2',
    protocolo: 'SP-ATD-2024-002',
    tipoAtendimento: 'Denúncia Anônima',
    solicitante: {
      nome: 'Anônimo',
      telefone: '(11) 0000-0000',
      endereco: 'Av. Principal, 456',
      bairro: 'Vila Nova'
    },
    detalhesOcorrencia: 'Denúncia de perturbação do sossego com música alta e aglomeração em via pública',
    urgencia: 'Alta',
    status: 'Concluído',
    localizacao: {
      endereco: 'Av. Principal, 456',
      bairro: 'Vila Nova',
      pontoReferencia: 'Em frente ao posto de gasolina',
      coordenadas: '-23.551520, -46.634309'
    },
    dataRegistro: '2024-01-14',
    horaRegistro: '22:15',
    prazoAtendimento: '1 hora',
    responsavel: 'GCM Carlos Lima',
    equipeResponsavel: 'Equipe Alfa',
    viatura: 'GCM-01',
    resolucao: 'Situação resolvida com orientação aos responsáveis. Música foi reduzida e aglomeração dispersada.',
    tempoResposta: '45 minutos',
    satisfacao: 4
  }
]

export default function AtendimentosSegurancaPage() {
  const { user } = useAdminAuth()
  const [atendimentos, setAtendimentos] = useState<AtendimentoSeguranca[]>(mockAtendimentos)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [urgenciaFilter, setUrgenciaFilter] = useState<string>('all')
  const [showNewAtendimentoModal, setShowNewAtendimentoModal] = useState(false)

  const filteredAtendimentos = atendimentos.filter(atendimento => {
    const matchesSearch = atendimento.solicitante.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         atendimento.protocolo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         atendimento.tipoAtendimento.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || atendimento.status === statusFilter
    const matchesUrgencia = urgenciaFilter === 'all' || atendimento.urgencia === urgenciaFilter
    return matchesSearch && matchesStatus && matchesUrgencia
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Recebido': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'Em Análise': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'Despachado': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'Em Atendimento': return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'Concluído': return 'bg-green-100 text-green-800 border-green-200'
      case 'Cancelado': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getUrgenciaColor = (urgencia: string) => {
    switch (urgencia) {
      case 'Baixa': return 'bg-green-100 text-green-800 border-green-200'
      case 'Média': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'Alta': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'Crítica': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const stats = {
    totalAtendimentos: atendimentos.length,
    emAndamento: atendimentos.filter(a => ['Recebido', 'Em Análise', 'Despachado', 'Em Atendimento'].includes(a.status)).length,
    concluidos: atendimentos.filter(a => a.status === 'Concluído').length,
    criticos: atendimentos.filter(a => a.urgencia === 'Crítica').length
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Shield className="h-8 w-8 text-blue-600" />
            Atendimentos - Segurança Pública
          </h1>
          <p className="text-gray-600 mt-1">
            Central de atendimentos e solicitações de segurança pública municipal
          </p>
        </div>
        <Button onClick={() => setShowNewAtendimentoModal(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Novo Atendimento
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Atendimentos</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalAtendimentos}</div>
            <p className="text-xs text-muted-foreground">este mês</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Em Andamento</CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.emAndamento}</div>
            <p className="text-xs text-muted-foreground">aguardando resolução</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Concluídos</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.concluidos}</div>
            <p className="text-xs text-muted-foreground">resolvidos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Críticos</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.criticos}</div>
            <p className="text-xs text-muted-foreground">urgência crítica</p>
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
                <SelectItem value="Recebido">Recebido</SelectItem>
                <SelectItem value="Em Análise">Em Análise</SelectItem>
                <SelectItem value="Despachado">Despachado</SelectItem>
                <SelectItem value="Em Atendimento">Em Atendimento</SelectItem>
                <SelectItem value="Concluído">Concluído</SelectItem>
                <SelectItem value="Cancelado">Cancelado</SelectItem>
              </SelectContent>
            </Select>
            <Select value={urgenciaFilter} onValueChange={setUrgenciaFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Urgência" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as Urgências</SelectItem>
                <SelectItem value="Baixa">Baixa</SelectItem>
                <SelectItem value="Média">Média</SelectItem>
                <SelectItem value="Alta">Alta</SelectItem>
                <SelectItem value="Crítica">Crítica</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6">
        {filteredAtendimentos.map((atendimento) => (
          <Card key={atendimento.id} className="overflow-hidden">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{atendimento.protocolo}</CardTitle>
                  <CardDescription className="flex items-center gap-2 mt-1">
                    <User className="h-4 w-4" />
                    {atendimento.solicitante.nome}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Badge className={getUrgenciaColor(atendimento.urgencia)}>
                    {atendimento.urgencia}
                  </Badge>
                  <Badge className={getStatusColor(atendimento.status)}>
                    {atendimento.status}
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
                      <p><strong>Nome:</strong> {atendimento.solicitante.nome}</p>
                      {atendimento.solicitante.cpf && (
                        <p><strong>CPF:</strong> {atendimento.solicitante.cpf}</p>
                      )}
                      <p><strong>Telefone:</strong> {atendimento.solicitante.telefone}</p>
                      <p><strong>Endereço:</strong> {atendimento.solicitante.endereco}</p>
                      <p><strong>Bairro:</strong> {atendimento.solicitante.bairro}</p>
                      {atendimento.solicitante.identificacao && (
                        <p><strong>Identificação:</strong> {atendimento.solicitante.identificacao}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-sm text-gray-900 mb-2 flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Localização
                    </h4>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p><strong>Endereço:</strong> {atendimento.localizacao.endereco}</p>
                      <p><strong>Bairro:</strong> {atendimento.localizacao.bairro}</p>
                      {atendimento.localizacao.pontoReferencia && (
                        <p><strong>Referência:</strong> {atendimento.localizacao.pontoReferencia}</p>
                      )}
                      {atendimento.localizacao.coordenadas && (
                        <p><strong>Coordenadas:</strong> {atendimento.localizacao.coordenadas}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-sm text-gray-900 mb-2 flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Atendimento
                    </h4>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p><strong>Tipo:</strong> {atendimento.tipoAtendimento}</p>
                      <p><strong>Data:</strong> {new Date(atendimento.dataRegistro).toLocaleDateString('pt-BR')}</p>
                      <p><strong>Hora:</strong> {atendimento.horaRegistro}</p>
                      {atendimento.prazoAtendimento && (
                        <p><strong>Prazo:</strong> {atendimento.prazoAtendimento}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {atendimento.responsavel && (
                    <div>
                      <h4 className="font-medium text-sm text-gray-900 mb-2 flex items-center gap-2">
                        <Radio className="h-4 w-4" />
                        Equipe Responsável
                      </h4>
                      <div className="space-y-1 text-sm text-gray-600">
                        <p><strong>Responsável:</strong> {atendimento.responsavel}</p>
                        {atendimento.equipeResponsavel && (
                          <p><strong>Equipe:</strong> {atendimento.equipeResponsavel}</p>
                        )}
                        {atendimento.viatura && (
                          <p><strong>Viatura:</strong> {atendimento.viatura}</p>
                        )}
                        {atendimento.tempoResposta && (
                          <p><strong>Tempo Resposta:</strong> {atendimento.tempoResposta}</p>
                        )}
                      </div>
                    </div>
                  )}

                  {atendimento.satisfacao && (
                    <div>
                      <h4 className="font-medium text-sm text-gray-900 mb-2">
                        Avaliação
                      </h4>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span
                            key={star}
                            className={`text-lg ${star <= atendimento.satisfacao! ? 'text-yellow-400' : 'text-gray-300'}`}
                          >
                            ★
                          </span>
                        ))}
                        <span className="text-sm text-gray-600 ml-2">
                          ({atendimento.satisfacao}/5)
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t">
                <h4 className="font-medium text-sm text-gray-900 mb-2">Detalhes da Ocorrência</h4>
                <p className="text-sm text-gray-600 mb-4">{atendimento.detalhesOcorrencia}</p>

                {atendimento.observacoes && (
                  <div className="mb-4">
                    <h4 className="font-medium text-sm text-gray-900 mb-2">Observações</h4>
                    <p className="text-sm text-gray-600">{atendimento.observacoes}</p>
                  </div>
                )}

                {atendimento.resolucao && (
                  <div className="mb-4">
                    <h4 className="font-medium text-sm text-gray-900 mb-2">Resolução</h4>
                    <p className="text-sm text-gray-600">{atendimento.resolucao}</p>
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
                {atendimento.status !== 'Concluído' && atendimento.status !== 'Cancelado' && (
                  <Button size="sm">
                    <Siren className="h-4 w-4 mr-1" />
                    Atualizar Status
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
              <h4 className="font-medium text-green-700 mb-2">Solicitação de Ronda</h4>
              <p className="text-sm text-gray-600">
                Permite que cidadãos solicitem rondas preventivas da Guarda Municipal em sua região ou estabelecimento.
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium text-green-700 mb-2">Apoio da Guarda Municipal</h4>
              <p className="text-sm text-gray-600">
                Solicitação de apoio da Guarda Municipal para eventos, escoltas ou situações específicas de segurança.
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium text-green-700 mb-2">Orientação de Segurança</h4>
              <p className="text-sm text-gray-600">
                Consultoria e orientação sobre medidas de segurança para estabelecimentos comerciais e residenciais.
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium text-green-700 mb-2">Denúncia Anônima</h4>
              <p className="text-sm text-gray-600">
                Canal seguro para denúncias anônimas sobre crimes, perturbação do sossego e questões de segurança pública.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}