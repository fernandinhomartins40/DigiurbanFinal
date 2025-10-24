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
  AlertTriangle,
  Plus,
  Search,
  Filter,
  Download,
  Bell,
  Clock,
  MapPin,
  Users,
  Send,
  MessageSquare,
  Phone,
  Mail,
  Calendar,
  CheckCircle,
  Eye,
  Zap
} from 'lucide-react'

interface AlertaSeguranca {
  id: string
  titulo: string
  tipoAlerta: 'Emergência' | 'Situação de Risco' | 'Preventivo' | 'Informativo' | 'Busca e Apreensão' | 'Pessoa Desaparecida' | 'Operação Policial'
  prioridade: 'Baixa' | 'Média' | 'Alta' | 'Crítica'
  status: 'Ativo' | 'Resolvido' | 'Cancelado' | 'Aguardando' | 'Em Andamento'
  conteudo: {
    descricao: string
    instrucoes?: string
    informacoesAdicionais?: string
    contatoEmergencia?: string
  }
  abrangencia: {
    tipo: 'Municipal' | 'Regional' | 'Bairro Específico' | 'Área Delimitada'
    locais: string[]
    raioKm?: number
    coordenadas?: string
  }
  publico: {
    geral: boolean
    comerciantes: boolean
    escolas: boolean
    unidadesSaude: boolean
    orgaosPublicos: boolean
    transportePublico: boolean
    grupos?: string[]
  }
  cronograma: {
    dataInicio: string
    horaInicio: string
    dataFim?: string
    horaFim?: string
    duracao?: string
    repeticao?: 'Única' | 'Diária' | 'Semanal' | 'Mensal'
  }
  canaisEnvio: {
    sms: boolean
    email: boolean
    push: boolean
    sirenes: boolean
    radioComunitaria: boolean
    redesSociais: boolean
    carrosSom: boolean
  }
  estatisticas: {
    pessoasAlcancadas: number
    smsEnviados: number
    emailsEnviados: number
    visualizacoes: number
    interacoes: number
  }
  responsavel: string
  aprovadoPor?: string
  dataAprovacao?: string
  observacoes?: string
  historico?: Array<{
    data: string
    hora: string
    acao: string
    responsavel: string
    detalhes?: string
  }>
}

const mockAlertas: AlertaSeguranca[] = [
  {
    id: '1',
    titulo: 'Operação de Combate ao Tráfico - Centro',
    tipoAlerta: 'Operação Policial',
    prioridade: 'Alta',
    status: 'Em Andamento',
    conteudo: {
      descricao: 'Operação policial em andamento na região central. Evite circulação desnecessária na área.',
      instrucoes: 'Comerciantes mantenham estabelecimentos fechados até segunda ordem. População deve permanecer em casa.',
      informacoesAdicionais: 'Operação integrada entre PM, GCM e Polícia Civil',
      contatoEmergencia: '190 - PM / 153 - GCM'
    },
    abrangencia: {
      tipo: 'Área Delimitada',
      locais: ['Centro', 'Rua das Flores', 'Praça Central'],
      raioKm: 2,
      coordenadas: '-23.550520, -46.633309'
    },
    publico: {
      geral: true,
      comerciantes: true,
      escolas: false,
      unidadesSaude: true,
      orgaosPublicos: true,
      transportePublico: true
    },
    cronograma: {
      dataInicio: '2024-01-16',
      horaInicio: '06:00',
      dataFim: '2024-01-16',
      horaFim: '18:00',
      duracao: '12 horas',
      repeticao: 'Única'
    },
    canaisEnvio: {
      sms: true,
      email: true,
      push: true,
      sirenes: true,
      radioComunitaria: true,
      redesSociais: true,
      carrosSom: true
    },
    estatisticas: {
      pessoasAlcancadas: 15420,
      smsEnviados: 8350,
      emailsEnviados: 4280,
      visualizacoes: 23580,
      interacoes: 1840
    },
    responsavel: 'Comandante GCM Carlos Silva',
    aprovadoPor: 'Secretário de Segurança',
    dataAprovacao: '2024-01-15',
    observacoes: 'Operação coordenada com outras forças de segurança',
    historico: [
      {
        data: '2024-01-16',
        hora: '06:00',
        acao: 'Início da operação',
        responsavel: 'Central de Operações',
        detalhes: 'Ativação de todos os canais de comunicação'
      },
      {
        data: '2024-01-16',
        hora: '06:15',
        acao: 'Primeira atualização',
        responsavel: 'GCM Carlos Silva',
        detalhes: 'Área isolada com sucesso'
      }
    ]
  },
  {
    id: '2',
    titulo: 'Pessoa Desaparecida - Maria Santos',
    tipoAlerta: 'Pessoa Desaparecida',
    prioridade: 'Crítica',
    status: 'Ativo',
    conteudo: {
      descricao: 'Busca por Maria Santos, 65 anos, desaparecida desde ontem às 14h. Portadora de Alzheimer.',
      instrucoes: 'Se avistada, não abordar diretamente. Entre em contato imediatamente com as autoridades.',
      informacoesAdicionais: 'Características: 1,60m, cabelos grisalhos, vestia blusa azul e calça jeans. Pode estar desorientada.',
      contatoEmergencia: '190 - PM / 153 - GCM / (11) 98765-4321 - Família'
    },
    abrangencia: {
      tipo: 'Municipal',
      locais: ['Todo o município'],
      raioKm: 20
    },
    publico: {
      geral: true,
      comerciantes: true,
      escolas: true,
      unidadesSaude: true,
      orgaosPublicos: true,
      transportePublico: true,
      grupos: ['Motoristas de táxi', 'Motoristas de ônibus', 'Agentes comunitários']
    },
    cronograma: {
      dataInicio: '2024-01-15',
      horaInicio: '20:00',
      repeticao: 'Diária'
    },
    canaisEnvio: {
      sms: true,
      email: true,
      push: true,
      sirenes: false,
      radioComunitaria: true,
      redesSociais: true,
      carrosSom: true
    },
    estatisticas: {
      pessoasAlcancadas: 45280,
      smsEnviados: 23450,
      emailsEnviados: 12800,
      visualizacoes: 67920,
      interacoes: 5680
    },
    responsavel: 'GCM Ana Ferreira',
    aprovadoPor: 'Delegado responsável',
    dataAprovacao: '2024-01-15'
  }
]

export default function AlertasSegurancaPage() {
  const { user } = useAdminAuth()
  const [alertas, setAlertas] = useState<AlertaSeguranca[]>(mockAlertas)
  const [searchTerm, setSearchTerm] = useState('')
  const [tipoFilter, setTipoFilter] = useState<string>('all')
  const [prioridadeFilter, setPrioridadeFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [showNewAlertaModal, setShowNewAlertaModal] = useState(false)

  const filteredAlertas = alertas.filter(alerta => {
    const matchesSearch = alerta.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         alerta.conteudo.descricao.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesTipo = tipoFilter === 'all' || alerta.tipoAlerta === tipoFilter
    const matchesPrioridade = prioridadeFilter === 'all' || alerta.prioridade === prioridadeFilter
    const matchesStatus = statusFilter === 'all' || alerta.status === statusFilter
    return matchesSearch && matchesTipo && matchesPrioridade && matchesStatus
  })

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case 'Emergência': return 'bg-red-100 text-red-800 border-red-200'
      case 'Situação de Risco': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'Preventivo': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'Informativo': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'Busca e Apreensão': return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'Pessoa Desaparecida': return 'bg-pink-100 text-pink-800 border-pink-200'
      case 'Operação Policial': return 'bg-indigo-100 text-indigo-800 border-indigo-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getPrioridadeColor = (prioridade: string) => {
    switch (prioridade) {
      case 'Baixa': return 'bg-green-100 text-green-800 border-green-200'
      case 'Média': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'Alta': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'Crítica': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Ativo': return 'bg-green-100 text-green-800 border-green-200'
      case 'Em Andamento': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'Aguardando': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'Resolvido': return 'bg-gray-100 text-gray-800 border-gray-200'
      case 'Cancelado': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const stats = {
    totalAlertas: alertas.length,
    ativos: alertas.filter(a => ['Ativo', 'Em Andamento'].includes(a.status)).length,
    criticos: alertas.filter(a => a.prioridade === 'Crítica').length,
    pessoasAlcancadas: alertas.reduce((acc, a) => acc + a.estatisticas.pessoasAlcancadas, 0)
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Bell className="h-8 w-8 text-blue-600" />
            Alertas de Segurança
          </h1>
          <p className="text-gray-600 mt-1">
            Sistema de alertas emergenciais para situações críticas de segurança
          </p>
        </div>
        <Button onClick={() => setShowNewAlertaModal(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Novo Alerta
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Alertas</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalAlertas}</div>
            <p className="text-xs text-muted-foreground">este mês</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alertas Ativos</CardTitle>
            <Clock className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.ativos}</div>
            <p className="text-xs text-muted-foreground">em andamento</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Prioridade Crítica</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.criticos}</div>
            <p className="text-xs text-muted-foreground">urgente</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pessoas Alcançadas</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.pessoasAlcancadas.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">total</p>
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
                  placeholder="Buscar por título ou descrição..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <Select value={tipoFilter} onValueChange={setTipoFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Tipos</SelectItem>
                <SelectItem value="Emergência">Emergência</SelectItem>
                <SelectItem value="Situação de Risco">Situação de Risco</SelectItem>
                <SelectItem value="Preventivo">Preventivo</SelectItem>
                <SelectItem value="Informativo">Informativo</SelectItem>
                <SelectItem value="Busca e Apreensão">Busca e Apreensão</SelectItem>
                <SelectItem value="Pessoa Desaparecida">Pessoa Desaparecida</SelectItem>
                <SelectItem value="Operação Policial">Operação Policial</SelectItem>
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
                <SelectItem value="Crítica">Crítica</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Status</SelectItem>
                <SelectItem value="Ativo">Ativo</SelectItem>
                <SelectItem value="Em Andamento">Em Andamento</SelectItem>
                <SelectItem value="Aguardando">Aguardando</SelectItem>
                <SelectItem value="Resolvido">Resolvido</SelectItem>
                <SelectItem value="Cancelado">Cancelado</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6">
        {filteredAlertas.map((alerta) => (
          <Card key={alerta.id} className="overflow-hidden">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{alerta.titulo}</CardTitle>
                  <CardDescription className="flex items-center gap-2 mt-1">
                    <Bell className="h-4 w-4" />
                    {alerta.responsavel}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Badge className={getTipoColor(alerta.tipoAlerta)}>
                    {alerta.tipoAlerta}
                  </Badge>
                  <Badge className={getPrioridadeColor(alerta.prioridade)}>
                    {alerta.prioridade}
                  </Badge>
                  <Badge className={getStatusColor(alerta.status)}>
                    {alerta.status}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-sm text-gray-900 mb-2 flex items-center gap-2">
                      <MessageSquare className="h-4 w-4" />
                      Conteúdo do Alerta
                    </h4>
                    <div className="space-y-2 text-sm text-gray-600">
                      <p><strong>Descrição:</strong> {alerta.conteudo.descricao}</p>
                      {alerta.conteudo.instrucoes && (
                        <p><strong>Instruções:</strong> {alerta.conteudo.instrucoes}</p>
                      )}
                      {alerta.conteudo.contatoEmergencia && (
                        <p><strong>Contato:</strong> {alerta.conteudo.contatoEmergencia}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-sm text-gray-900 mb-2 flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Abrangência
                    </h4>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p><strong>Tipo:</strong> {alerta.abrangencia.tipo}</p>
                      <p><strong>Locais:</strong> {alerta.abrangencia.locais.join(', ')}</p>
                      {alerta.abrangencia.raioKm && (
                        <p><strong>Raio:</strong> {alerta.abrangencia.raioKm} km</p>
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
                      <p><strong>Início:</strong> {new Date(alerta.cronograma.dataInicio).toLocaleDateString('pt-BR')} às {alerta.cronograma.horaInicio}</p>
                      {alerta.cronograma.dataFim && (
                        <p><strong>Fim:</strong> {new Date(alerta.cronograma.dataFim).toLocaleDateString('pt-BR')} às {alerta.cronograma.horaFim}</p>
                      )}
                      {alerta.cronograma.duracao && (
                        <p><strong>Duração:</strong> {alerta.cronograma.duracao}</p>
                      )}
                      {alerta.cronograma.repeticao && (
                        <p><strong>Repetição:</strong> {alerta.cronograma.repeticao}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-sm text-gray-900 mb-2 flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Público-Alvo
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {alerta.publico.geral && <Badge variant="secondary" className="text-xs">Geral</Badge>}
                      {alerta.publico.comerciantes && <Badge variant="secondary" className="text-xs">Comerciantes</Badge>}
                      {alerta.publico.escolas && <Badge variant="secondary" className="text-xs">Escolas</Badge>}
                      {alerta.publico.unidadesSaude && <Badge variant="secondary" className="text-xs">Saúde</Badge>}
                      {alerta.publico.orgaosPublicos && <Badge variant="secondary" className="text-xs">Órgãos Públicos</Badge>}
                      {alerta.publico.transportePublico && <Badge variant="secondary" className="text-xs">Transporte</Badge>}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-sm text-gray-900 mb-2 flex items-center gap-2">
                      <Send className="h-4 w-4" />
                      Canais de Envio
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {alerta.canaisEnvio.sms && <Badge variant="secondary" className="text-xs">SMS</Badge>}
                      {alerta.canaisEnvio.email && <Badge variant="secondary" className="text-xs">Email</Badge>}
                      {alerta.canaisEnvio.push && <Badge variant="secondary" className="text-xs">Push</Badge>}
                      {alerta.canaisEnvio.sirenes && <Badge variant="secondary" className="text-xs">Sirenes</Badge>}
                      {alerta.canaisEnvio.radioComunitaria && <Badge variant="secondary" className="text-xs">Rádio</Badge>}
                      {alerta.canaisEnvio.redesSociais && <Badge variant="secondary" className="text-xs">Redes Sociais</Badge>}
                      {alerta.canaisEnvio.carrosSom && <Badge variant="secondary" className="text-xs">Carros de Som</Badge>}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-sm text-gray-900 mb-2 flex items-center gap-2">
                      <Eye className="h-4 w-4" />
                      Estatísticas
                    </h4>
                    <div className="space-y-1 text-sm text-gray-600">
                      <div className="flex justify-between">
                        <span>Pessoas alcançadas:</span>
                        <span className="font-bold">{alerta.estatisticas.pessoasAlcancadas.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>SMS enviados:</span>
                        <span className="font-bold">{alerta.estatisticas.smsEnviados.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Emails enviados:</span>
                        <span className="font-bold">{alerta.estatisticas.emailsEnviados.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Visualizações:</span>
                        <span className="font-bold">{alerta.estatisticas.visualizacoes.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Interações:</span>
                        <span className="font-bold">{alerta.estatisticas.interacoes.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {alerta.conteudo.informacoesAdicionais && (
                <div className="mt-6 pt-4 border-t">
                  <h4 className="font-medium text-sm text-gray-900 mb-2">Informações Adicionais</h4>
                  <p className="text-sm text-gray-600">{alerta.conteudo.informacoesAdicionais}</p>
                </div>
              )}

              {alerta.historico && alerta.historico.length > 0 && (
                <div className="mt-6 pt-4 border-t">
                  <h4 className="font-medium text-sm text-gray-900 mb-2">Histórico de Atualizações</h4>
                  <div className="space-y-2">
                    {alerta.historico.map((evento, index) => (
                      <div key={index} className="flex items-start gap-3 p-2 bg-gray-50 rounded">
                        <div className="w-2 h-2 bg-blue-600 rounded-full mt-1.5 flex-shrink-0"></div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium">{evento.acao}</p>
                            <span className="text-xs text-gray-500">
                              {new Date(evento.data).toLocaleDateString('pt-BR')} {evento.hora}
                            </span>
                          </div>
                          <p className="text-xs text-gray-600">{evento.responsavel}</p>
                          {evento.detalhes && (
                            <p className="text-xs text-gray-600 mt-1">{evento.detalhes}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {alerta.observacoes && (
                <div className="mt-6 pt-4 border-t">
                  <h4 className="font-medium text-sm text-gray-900 mb-2">Observações</h4>
                  <p className="text-sm text-gray-600">{alerta.observacoes}</p>
                </div>
              )}

              <div className="flex justify-end gap-2 mt-4 pt-4 border-t">
                <Button variant="outline" size="sm">
                  <MapPin className="h-4 w-4 mr-1" />
                  Ver Área
                </Button>
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-1" />
                  Estatísticas
                </Button>
                {alerta.status !== 'Resolvido' && alerta.status !== 'Cancelado' && (
                  <Button size="sm">
                    <Send className="h-4 w-4 mr-1" />
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
              <h4 className="font-medium text-green-700 mb-2">Cadastro para Alertas</h4>
              <p className="text-sm text-gray-600">
                Permite que cidadãos se cadastrem para receber alertas de segurança por SMS, email ou notificação push.
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium text-green-700 mb-2">Notificação de Emergência</h4>
              <p className="text-sm text-gray-600">
                Sistema automático de envio de alertas emergenciais para situações críticas de segurança pública.
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium text-green-700 mb-2">Comunicado de Segurança</h4>
              <p className="text-sm text-gray-600">
                Informações oficiais sobre operações policiais, situações de risco e medidas preventivas no município.
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium text-green-700 mb-2">Alerta de Pessoa Desaparecida</h4>
              <p className="text-sm text-gray-600">
                Sistema de divulgação de pessoas desaparecidas com alcance municipal para mobilizar a população.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}