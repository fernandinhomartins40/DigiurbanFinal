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
  Camera,
  Plus,
  Search,
  Filter,
  Download,
  Eye,
  MapPin,
  Clock,
  AlertCircle,
  CheckCircle,
  Play,
  Pause,
  Settings,
  Monitor,
  Shield,
  Activity,
  Radio,
  Zap
} from 'lucide-react'

interface SistemaVigilancia {
  id: string
  nome: string
  tipo: 'CCTV' | 'Câmera IP' | 'Drone' | 'Sensor' | 'Central Integrada' | 'Posto Avançado'
  status: 'Online' | 'Offline' | 'Manutenção' | 'Instalação' | 'Erro'
  localizacao: {
    endereco: string
    bairro: string
    coordenadas: string
    pontoReferencia: string
    areaCobertura: string
  }
  especificacoes: {
    resolucao?: string
    zoom?: string
    visaoNoturna: boolean
    deteccaoMovimento: boolean
    reconhecimentoFacial: boolean
    leituraPlaca: boolean
    audio: boolean
    gravacao: boolean
  }
  conectividade: {
    protocolo: string
    ip?: string
    qualidadeSinal: 'Excelente' | 'Boa' | 'Regular' | 'Ruim'
    velocidade?: string
    latencia?: number
  }
  monitoramento: {
    operador: string
    centralResponsavel: string
    horarioMonitoramento: string
    alertasAtivos: number
    ultimaVerificacao: string
  }
  estatisticas: {
    tempoOnline: number
    incidentesDetectados: number
    alertasGerados: number
    acessosRealizados: number
    dataUltimoIncidente?: string
  }
  manutencao: {
    ultimaManutencao: string
    proximaManutencao: string
    responsavelTecnico: string
    historico: Array<{
      data: string
      tipo: string
      descricao: string
      tecnico: string
    }>
  }
  integracoes: {
    sistemaAlarme: boolean
    centralEmergencia: boolean
    policiaCivil: boolean
    bombeiros: boolean
    guardaMunicipal: boolean
  }
  observacoes?: string
}

const mockSistemas: SistemaVigilancia[] = [
  {
    id: '1',
    nome: 'CCTV-Centro-01',
    tipo: 'CCTV',
    status: 'Online',
    localizacao: {
      endereco: 'Praça Central, s/n',
      bairro: 'Centro',
      coordenadas: '-23.550520, -46.633309',
      pontoReferencia: 'Em frente à Igreja Matriz',
      areaCobertura: 'Praça Central e ruas adjacentes'
    },
    especificacoes: {
      resolucao: '4K Ultra HD',
      zoom: '30x Ótico',
      visaoNoturna: true,
      deteccaoMovimento: true,
      reconhecimentoFacial: true,
      leituraPlaca: true,
      audio: true,
      gravacao: true
    },
    conectividade: {
      protocolo: 'IP/TCP',
      ip: '192.168.1.100',
      qualidadeSinal: 'Excelente',
      velocidade: '100 Mbps',
      latencia: 15
    },
    monitoramento: {
      operador: 'João Silva - Turno A',
      centralResponsavel: 'Central de Monitoramento Principal',
      horarioMonitoramento: '24h/7dias',
      alertasAtivos: 2,
      ultimaVerificacao: '2024-01-16 10:30'
    },
    estatisticas: {
      tempoOnline: 98.5,
      incidentesDetectados: 45,
      alertasGerados: 23,
      acessosRealizados: 156,
      dataUltimoIncidente: '2024-01-15'
    },
    manutencao: {
      ultimaManutencao: '2024-01-01',
      proximaManutencao: '2024-04-01',
      responsavelTecnico: 'TechSeg Sistemas',
      historico: [
        {
          data: '2024-01-01',
          tipo: 'Manutenção Preventiva',
          descricao: 'Limpeza de lentes e verificação de cabos',
          tecnico: 'Carlos Técnico'
        }
      ]
    },
    integracoes: {
      sistemaAlarme: true,
      centralEmergencia: true,
      policiaCivil: true,
      bombeiros: true,
      guardaMunicipal: true
    },
    observacoes: 'Sistema principal de monitoramento da área central'
  },
  {
    id: '2',
    nome: 'Drone-Patrulha-01',
    tipo: 'Drone',
    status: 'Offline',
    localizacao: {
      endereco: 'Base GCM',
      bairro: 'Vila Nova',
      coordenadas: '-23.551520, -46.634309',
      pontoReferencia: 'Quartel da Guarda Municipal',
      areaCobertura: 'Toda região Vila Nova'
    },
    especificacoes: {
      resolucao: 'Full HD',
      zoom: '10x Digital',
      visaoNoturna: true,
      deteccaoMovimento: true,
      reconhecimentoFacial: false,
      leituraPlaca: false,
      audio: false,
      gravacao: true
    },
    conectividade: {
      protocolo: '4G/5G',
      qualidadeSinal: 'Boa',
      velocidade: '50 Mbps',
      latencia: 25
    },
    monitoramento: {
      operador: 'Maria Santos - Operadora Drone',
      centralResponsavel: 'Base Operacional GCM',
      horarioMonitoramento: '06:00-22:00',
      alertasAtivos: 0,
      ultimaVerificacao: '2024-01-15 18:00'
    },
    estatisticas: {
      tempoOnline: 85.2,
      incidentesDetectados: 12,
      alertasGerados: 8,
      acessosRealizados: 45
    },
    manutencao: {
      ultimaManutencao: '2024-01-10',
      proximaManutencao: '2024-02-10',
      responsavelTecnico: 'DroneSecure',
      historico: [
        {
          data: '2024-01-10',
          tipo: 'Reparo',
          descricao: 'Substituição de bateria e calibração de câmera',
          tecnico: 'Ana Técnica'
        }
      ]
    },
    integracoes: {
      sistemaAlarme: false,
      centralEmergencia: true,
      policiaCivil: false,
      bombeiros: true,
      guardaMunicipal: true
    },
    observacoes: 'Em manutenção após incidente de pouso forçado'
  }
]

export default function VigilanciaIntegradaPage() {
  const { user } = useAdminAuth()
  const [sistemas, setSistemas] = useState<SistemaVigilancia[]>(mockSistemas)
  const [searchTerm, setSearchTerm] = useState('')
  const [tipoFilter, setTipoFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [bairroFilter, setBairroFilter] = useState<string>('all')
  const [showNewSistemaModal, setShowNewSistemaModal] = useState(false)

  const filteredSistemas = sistemas.filter(sistema => {
    const matchesSearch = sistema.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sistema.localizacao.endereco.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sistema.localizacao.bairro.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesTipo = tipoFilter === 'all' || sistema.tipo === tipoFilter
    const matchesStatus = statusFilter === 'all' || sistema.status === statusFilter
    const matchesBairro = bairroFilter === 'all' || sistema.localizacao.bairro === bairroFilter
    return matchesSearch && matchesTipo && matchesStatus && matchesBairro
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Online': return 'bg-green-100 text-green-800 border-green-200'
      case 'Offline': return 'bg-red-100 text-red-800 border-red-200'
      case 'Manutenção': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'Instalação': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'Erro': return 'bg-orange-100 text-orange-800 border-orange-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case 'CCTV': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'Câmera IP': return 'bg-green-100 text-green-800 border-green-200'
      case 'Drone': return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'Sensor': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'Central Integrada': return 'bg-indigo-100 text-indigo-800 border-indigo-200'
      case 'Posto Avançado': return 'bg-pink-100 text-pink-800 border-pink-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getQualidadeColor = (qualidade: string) => {
    switch (qualidade) {
      case 'Excelente': return 'text-green-600'
      case 'Boa': return 'text-blue-600'
      case 'Regular': return 'text-yellow-600'
      case 'Ruim': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  const stats = {
    totalSistemas: sistemas.length,
    online: sistemas.filter(s => s.status === 'Online').length,
    offline: sistemas.filter(s => s.status === 'Offline').length,
    alertasAtivos: sistemas.reduce((acc, s) => acc + s.monitoramento.alertasAtivos, 0)
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Camera className="h-8 w-8 text-blue-600" />
            Vigilância Integrada
          </h1>
          <p className="text-gray-600 mt-1">
            Coordenação de sistemas de monitoramento e vigilância municipal
          </p>
        </div>
        <Button onClick={() => setShowNewSistemaModal(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Novo Sistema
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Sistemas</CardTitle>
            <Camera className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalSistemas}</div>
            <p className="text-xs text-muted-foreground">ativos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Online</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.online}</div>
            <p className="text-xs text-muted-foreground">funcionando</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Offline</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.offline}</div>
            <p className="text-xs text-muted-foreground">fora do ar</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alertas Ativos</CardTitle>
            <Activity className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.alertasAtivos}</div>
            <p className="text-xs text-muted-foreground">em monitoramento</p>
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
                  placeholder="Buscar por nome, endereço ou bairro..."
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
                <SelectItem value="CCTV">CCTV</SelectItem>
                <SelectItem value="Câmera IP">Câmera IP</SelectItem>
                <SelectItem value="Drone">Drone</SelectItem>
                <SelectItem value="Sensor">Sensor</SelectItem>
                <SelectItem value="Central Integrada">Central Integrada</SelectItem>
                <SelectItem value="Posto Avançado">Posto Avançado</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Status</SelectItem>
                <SelectItem value="Online">Online</SelectItem>
                <SelectItem value="Offline">Offline</SelectItem>
                <SelectItem value="Manutenção">Manutenção</SelectItem>
                <SelectItem value="Instalação">Instalação</SelectItem>
                <SelectItem value="Erro">Erro</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6">
        {filteredSistemas.map((sistema) => (
          <Card key={sistema.id} className="overflow-hidden">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{sistema.nome}</CardTitle>
                  <CardDescription className="flex items-center gap-2 mt-1">
                    <MapPin className="h-4 w-4" />
                    {sistema.localizacao.endereco}, {sistema.localizacao.bairro}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Badge className={getTipoColor(sistema.tipo)}>
                    {sistema.tipo}
                  </Badge>
                  <Badge className={getStatusColor(sistema.status)}>
                    {sistema.status}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-sm text-gray-900 mb-2 flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Localização
                    </h4>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p><strong>Endereço:</strong> {sistema.localizacao.endereco}</p>
                      <p><strong>Bairro:</strong> {sistema.localizacao.bairro}</p>
                      <p><strong>Referência:</strong> {sistema.localizacao.pontoReferencia}</p>
                      <p><strong>Cobertura:</strong> {sistema.localizacao.areaCobertura}</p>
                      <p><strong>Coordenadas:</strong> {sistema.localizacao.coordenadas}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-sm text-gray-900 mb-2 flex items-center gap-2">
                      <Settings className="h-4 w-4" />
                      Especificações
                    </h4>
                    <div className="space-y-1 text-sm text-gray-600">
                      {sistema.especificacoes.resolucao && (
                        <p><strong>Resolução:</strong> {sistema.especificacoes.resolucao}</p>
                      )}
                      {sistema.especificacoes.zoom && (
                        <p><strong>Zoom:</strong> {sistema.especificacoes.zoom}</p>
                      )}
                      <div className="flex flex-wrap gap-1 mt-2">
                        {sistema.especificacoes.visaoNoturna && <Badge variant="secondary" className="text-xs">Visão Noturna</Badge>}
                        {sistema.especificacoes.deteccaoMovimento && <Badge variant="secondary" className="text-xs">Detecção</Badge>}
                        {sistema.especificacoes.reconhecimentoFacial && <Badge variant="secondary" className="text-xs">Facial</Badge>}
                        {sistema.especificacoes.leituraPlaca && <Badge variant="secondary" className="text-xs">LPR</Badge>}
                        {sistema.especificacoes.audio && <Badge variant="secondary" className="text-xs">Áudio</Badge>}
                        {sistema.especificacoes.gravacao && <Badge variant="secondary" className="text-xs">Gravação</Badge>}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-sm text-gray-900 mb-2 flex items-center gap-2">
                      <Radio className="h-4 w-4" />
                      Conectividade
                    </h4>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p><strong>Protocolo:</strong> {sistema.conectividade.protocolo}</p>
                      {sistema.conectividade.ip && (
                        <p><strong>IP:</strong> {sistema.conectividade.ip}</p>
                      )}
                      <div className="flex items-center justify-between">
                        <span>Qualidade do Sinal:</span>
                        <span className={`font-bold ${getQualidadeColor(sistema.conectividade.qualidadeSinal)}`}>
                          {sistema.conectividade.qualidadeSinal}
                        </span>
                      </div>
                      {sistema.conectividade.velocidade && (
                        <p><strong>Velocidade:</strong> {sistema.conectividade.velocidade}</p>
                      )}
                      {sistema.conectividade.latencia && (
                        <p><strong>Latência:</strong> {sistema.conectividade.latencia}ms</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-sm text-gray-900 mb-2 flex items-center gap-2">
                      <Monitor className="h-4 w-4" />
                      Monitoramento
                    </h4>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p><strong>Operador:</strong> {sistema.monitoramento.operador}</p>
                      <p><strong>Central:</strong> {sistema.monitoramento.centralResponsavel}</p>
                      <p><strong>Horário:</strong> {sistema.monitoramento.horarioMonitoramento}</p>
                      <div className="flex items-center justify-between">
                        <span>Alertas Ativos:</span>
                        <Badge variant="secondary" className={`${sistema.monitoramento.alertasAtivos > 0 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                          {sistema.monitoramento.alertasAtivos}
                        </Badge>
                      </div>
                      <p><strong>Última Verificação:</strong> {sistema.monitoramento.ultimaVerificacao}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-sm text-gray-900 mb-2 flex items-center gap-2">
                      <Activity className="h-4 w-4" />
                      Estatísticas
                    </h4>
                    <div className="space-y-1 text-sm text-gray-600">
                      <div className="flex items-center justify-between">
                        <span>Tempo Online:</span>
                        <span className="font-bold text-green-600">{sistema.estatisticas.tempoOnline}%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Incidentes:</span>
                        <span className="font-bold">{sistema.estatisticas.incidentesDetectados}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Alertas:</span>
                        <span className="font-bold">{sistema.estatisticas.alertasGerados}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Acessos:</span>
                        <span className="font-bold">{sistema.estatisticas.acessosRealizados}</span>
                      </div>
                      {sistema.estatisticas.dataUltimoIncidente && (
                        <p><strong>Último Incidente:</strong> {new Date(sistema.estatisticas.dataUltimoIncidente).toLocaleDateString('pt-BR')}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-sm text-gray-900 mb-2 flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Manutenção
                    </h4>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p><strong>Última:</strong> {new Date(sistema.manutencao.ultimaManutencao).toLocaleDateString('pt-BR')}</p>
                      <p><strong>Próxima:</strong> {new Date(sistema.manutencao.proximaManutencao).toLocaleDateString('pt-BR')}</p>
                      <p><strong>Responsável:</strong> {sistema.manutencao.responsavelTecnico}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-sm text-gray-900 mb-2">Integrações</h4>
                    <div className="flex flex-wrap gap-1">
                      {sistema.integracoes.sistemaAlarme && <Badge variant="secondary" className="text-xs">Sistema Alarme</Badge>}
                      {sistema.integracoes.centralEmergencia && <Badge variant="secondary" className="text-xs">Central 190</Badge>}
                      {sistema.integracoes.policiaCivil && <Badge variant="secondary" className="text-xs">Polícia Civil</Badge>}
                      {sistema.integracoes.bombeiros && <Badge variant="secondary" className="text-xs">Bombeiros</Badge>}
                      {sistema.integracoes.guardaMunicipal && <Badge variant="secondary" className="text-xs">GCM</Badge>}
                    </div>
                  </div>

                  {sistema.manutencao.historico.length > 0 && (
                    <div>
                      <h4 className="font-medium text-sm text-gray-900 mb-2">Histórico de Manutenção</h4>
                      <div className="space-y-2">
                        {sistema.manutencao.historico.slice(0, 2).map((evento, index) => (
                          <div key={index} className="p-2 bg-gray-50 rounded text-xs">
                            <div className="flex justify-between">
                              <span className="font-medium">{evento.tipo}</span>
                              <span className="text-gray-500">{new Date(evento.data).toLocaleDateString('pt-BR')}</span>
                            </div>
                            <p className="text-gray-600">{evento.descricao}</p>
                            <p className="text-gray-500">Técnico: {evento.tecnico}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {sistema.observacoes && (
                  <div className="mt-4">
                    <h4 className="font-medium text-sm text-gray-900 mb-2">Observações</h4>
                    <p className="text-sm text-gray-600">{sistema.observacoes}</p>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 mt-4 pt-4 border-t">
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-1" />
                  Visualizar
                </Button>
                <Button variant="outline" size="sm">
                  <MapPin className="h-4 w-4 mr-1" />
                  Localização
                </Button>
                {sistema.status === 'Online' && (
                  <Button variant="outline" size="sm">
                    <Play className="h-4 w-4 mr-1" />
                    Monitorar
                  </Button>
                )}
                <Button size="sm">
                  <Settings className="h-4 w-4 mr-1" />
                  Configurar
                </Button>
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
              <h4 className="font-medium text-green-700 mb-2">Monitoramento de Área</h4>
              <p className="text-sm text-gray-600">
                Solicitação de monitoramento específico de áreas através do sistema de câmeras municipal.
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium text-green-700 mb-2">Análise de Imagens</h4>
              <p className="text-sm text-gray-600">
                Serviço de análise de imagens de câmeras de segurança para investigação de ocorrências.
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium text-green-700 mb-2">Relatório de Vigilância</h4>
              <p className="text-sm text-gray-600">
                Solicitação de relatórios de vigilância de áreas específicas com base em dados das câmeras.
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium text-green-700 mb-2">Acesso a Imagens</h4>
              <p className="text-sm text-gray-600">
                Solicitação de acesso a imagens de câmeras de segurança para fins legais e investigativos.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}