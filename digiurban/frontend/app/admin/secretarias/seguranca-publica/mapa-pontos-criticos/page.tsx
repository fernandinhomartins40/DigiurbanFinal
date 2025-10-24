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
  MapPin,
  Plus,
  Search,
  Filter,
  Download,
  AlertTriangle,
  Clock,
  Eye,
  TrendingUp,
  TrendingDown,
  Calendar,
  Users,
  Shield,
  Camera,
  Activity,
  Zap
} from 'lucide-react'

interface PontoCritico {
  id: string
  nome: string
  endereco: string
  bairro: string
  coordenadas: string
  nivelRisco: 'Baixo' | 'Médio' | 'Alto' | 'Crítico'
  tipoCriminalidade: Array<'Furto' | 'Roubo' | 'Tráfico' | 'Vandalismo' | 'Violência' | 'Perturbação' | 'Outros'>
  estatisticas: {
    ocorrenciasUltimos30Dias: number
    tendencia: 'Aumentando' | 'Estável' | 'Diminuindo'
    periodoMaiorRisco: 'Manhã' | 'Tarde' | 'Noite' | 'Madrugada'
    diasSemanaRisco: string[]
  }
  recursos: {
    cameras: number
    iluminacao: 'Adequada' | 'Insuficiente' | 'Inexistente'
    patrulhamento: 'Regular' | 'Intensivo' | 'Esporádico' | 'Inexistente'
    proximidadeUBS?: string
    proximidadeEscola?: string
  }
  acoes: {
    medidasImplementadas: string[]
    medidasPlanejadas: string[]
    responsavel: string
    ultimaAtualizacao: string
  }
  status: 'Monitoramento' | 'Ação Necessária' | 'Intervenção Ativa' | 'Situação Controlada'
  observacoes?: string
  relatorios?: Array<{
    data: string
    tipo: string
    descricao: string
    responsavel: string
  }>
}

const mockPontosCriticos: PontoCritico[] = [
  {
    id: '1',
    nome: 'Praça Central - Área Comercial',
    endereco: 'Praça Central, s/n',
    bairro: 'Centro',
    coordenadas: '-23.550520, -46.633309',
    nivelRisco: 'Alto',
    tipoCriminalidade: ['Furto', 'Roubo', 'Perturbação'],
    estatisticas: {
      ocorrenciasUltimos30Dias: 15,
      tendencia: 'Aumentando',
      periodoMaiorRisco: 'Noite',
      diasSemanaRisco: ['Sexta-feira', 'Sábado', 'Domingo']
    },
    recursos: {
      cameras: 4,
      iluminacao: 'Insuficiente',
      patrulhamento: 'Regular',
      proximidadeUBS: 'UBS Centro - 200m',
      proximidadeEscola: 'Escola Municipal Central - 150m'
    },
    acoes: {
      medidasImplementadas: [
        'Instalação de 2 câmeras adicionais',
        'Intensificação de rondas noturnas',
        'Orientação aos comerciantes'
      ],
      medidasPlanejadas: [
        'Melhoria da iluminação pública',
        'Instalação de botão de pânico',
        'Criação de posto fixo da GCM'
      ],
      responsavel: 'GCM Carlos Lima',
      ultimaAtualizacao: '2024-01-15'
    },
    status: 'Intervenção Ativa',
    observacoes: 'Área de grande movimentação comercial com concentração de ocorrências no período noturno'
  },
  {
    id: '2',
    nome: 'Terminal Rodoviário',
    endereco: 'Av. Principal, 1000',
    bairro: 'Vila Nova',
    coordenadas: '-23.551520, -46.634309',
    nivelRisco: 'Crítico',
    tipoCriminalidade: ['Furto', 'Tráfico', 'Violência', 'Vandalismo'],
    estatisticas: {
      ocorrenciasUltimos30Dias: 28,
      tendencia: 'Estável',
      periodoMaiorRisco: 'Madrugada',
      diasSemanaRisco: ['Todos os dias']
    },
    recursos: {
      cameras: 8,
      iluminacao: 'Adequada',
      patrulhamento: 'Intensivo',
      proximidadeUBS: 'UBS Vila Nova - 500m'
    },
    acoes: {
      medidasImplementadas: [
        'Sistema de câmeras 24h',
        'Posto fixo da GCM',
        'Operação integrada com PM',
        'Revista de bagagens'
      ],
      medidasPlanejadas: [
        'Ampliação do sistema de segurança',
        'Melhorias na estrutura física',
        'Programa social para moradores de rua'
      ],
      responsavel: 'GCM Ana Ferreira',
      ultimaAtualizacao: '2024-01-14'
    },
    status: 'Intervenção Ativa',
    observacoes: 'Terminal com alto fluxo de pessoas, concentração de população em situação de rua',
    relatorios: [
      {
        data: '2024-01-10',
        tipo: 'Relatório Semanal',
        descricao: 'Redução de 20% nas ocorrências após implementação de medidas',
        responsavel: 'GCM Ana Ferreira'
      }
    ]
  }
]

export default function MapaPontosCriticosPage() {
  const { user } = useAdminAuth()
  const [pontos, setPontos] = useState<PontoCritico[]>(mockPontosCriticos)
  const [searchTerm, setSearchTerm] = useState('')
  const [riscFilter, setRiscFilter] = useState<string>('all')
  const [bairroFilter, setBairroFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [showNewPontoModal, setShowNewPontoModal] = useState(false)

  const filteredPontos = pontos.filter(ponto => {
    const matchesSearch = ponto.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ponto.endereco.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ponto.bairro.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRisco = riscFilter === 'all' || ponto.nivelRisco === riscFilter
    const matchesBairro = bairroFilter === 'all' || ponto.bairro === bairroFilter
    const matchesStatus = statusFilter === 'all' || ponto.status === statusFilter
    return matchesSearch && matchesRisco && matchesBairro && matchesStatus
  })

  const getRiscoColor = (risco: string) => {
    switch (risco) {
      case 'Baixo': return 'bg-green-100 text-green-800 border-green-200'
      case 'Médio': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'Alto': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'Crítico': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Monitoramento': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'Ação Necessária': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'Intervenção Ativa': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'Situação Controlada': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getTendenciaIcon = (tendencia: string) => {
    switch (tendencia) {
      case 'Aumentando': return <TrendingUp className="h-4 w-4 text-red-600" />
      case 'Diminuindo': return <TrendingDown className="h-4 w-4 text-green-600" />
      case 'Estável': return <Activity className="h-4 w-4 text-yellow-600" />
      default: return <Activity className="h-4 w-4 text-gray-600" />
    }
  }

  const stats = {
    totalPontos: pontos.length,
    criticos: pontos.filter(p => p.nivelRisco === 'Crítico').length,
    intervencaoAtiva: pontos.filter(p => p.status === 'Intervenção Ativa').length,
    totalOcorrencias: pontos.reduce((acc, p) => acc + p.estatisticas.ocorrenciasUltimos30Dias, 0)
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <MapPin className="h-8 w-8 text-blue-600" />
            Mapa de Pontos Críticos
          </h1>
          <p className="text-gray-600 mt-1">
            Identificação e monitoramento de áreas de risco no município
          </p>
        </div>
        <Button onClick={() => setShowNewPontoModal(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Novo Ponto Crítico
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pontos Críticos</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPontos}</div>
            <p className="text-xs text-muted-foreground">monitorados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Nível Crítico</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.criticos}</div>
            <p className="text-xs text-muted-foreground">alta prioridade</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Intervenção Ativa</CardTitle>
            <Shield className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.intervencaoAtiva}</div>
            <p className="text-xs text-muted-foreground">em ação</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ocorrências (30 dias)</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOcorrencias}</div>
            <p className="text-xs text-muted-foreground">registradas</p>
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
            <Select value={riscFilter} onValueChange={setRiscFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Nível de Risco" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Níveis</SelectItem>
                <SelectItem value="Baixo">Baixo</SelectItem>
                <SelectItem value="Médio">Médio</SelectItem>
                <SelectItem value="Alto">Alto</SelectItem>
                <SelectItem value="Crítico">Crítico</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Status</SelectItem>
                <SelectItem value="Monitoramento">Monitoramento</SelectItem>
                <SelectItem value="Ação Necessária">Ação Necessária</SelectItem>
                <SelectItem value="Intervenção Ativa">Intervenção Ativa</SelectItem>
                <SelectItem value="Situação Controlada">Situação Controlada</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6">
        {filteredPontos.map((ponto) => (
          <Card key={ponto.id} className="overflow-hidden">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{ponto.nome}</CardTitle>
                  <CardDescription className="flex items-center gap-2 mt-1">
                    <MapPin className="h-4 w-4" />
                    {ponto.endereco}, {ponto.bairro}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Badge className={getRiscoColor(ponto.nivelRisco)}>
                    {ponto.nivelRisco}
                  </Badge>
                  <Badge className={getStatusColor(ponto.status)}>
                    {ponto.status}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-sm text-gray-900 mb-2 flex items-center gap-2">
                      <Activity className="h-4 w-4" />
                      Estatísticas
                    </h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Ocorrências (30 dias):</span>
                        <span className="font-bold">{ponto.estatisticas.ocorrenciasUltimos30Dias}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Tendência:</span>
                        <div className="flex items-center gap-1">
                          {getTendenciaIcon(ponto.estatisticas.tendencia)}
                          <span className="text-sm font-medium">{ponto.estatisticas.tendencia}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Período de risco:</span>
                        <span className="text-sm font-medium">{ponto.estatisticas.periodoMaiorRisco}</span>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Dias de risco:</span>
                        <p className="text-sm font-medium">{ponto.estatisticas.diasSemanaRisco.join(', ')}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-sm text-gray-900 mb-2">
                      Tipos de Criminalidade
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {ponto.tipoCriminalidade.map((tipo, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tipo}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-sm text-gray-900 mb-2 flex items-center gap-2">
                      <Eye className="h-4 w-4" />
                      Recursos de Segurança
                    </h4>
                    <div className="space-y-1 text-sm text-gray-600">
                      <div className="flex items-center justify-between">
                        <span>Câmeras:</span>
                        <span className="font-medium">{ponto.recursos.cameras}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Iluminação:</span>
                        <Badge variant="secondary" className={`text-xs ${
                          ponto.recursos.iluminacao === 'Adequada' ? 'bg-green-100 text-green-800' :
                          ponto.recursos.iluminacao === 'Insuficiente' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {ponto.recursos.iluminacao}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Patrulhamento:</span>
                        <Badge variant="secondary" className={`text-xs ${
                          ponto.recursos.patrulhamento === 'Intensivo' ? 'bg-green-100 text-green-800' :
                          ponto.recursos.patrulhamento === 'Regular' ? 'bg-blue-100 text-blue-800' :
                          ponto.recursos.patrulhamento === 'Esporádico' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {ponto.recursos.patrulhamento}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {(ponto.recursos.proximidadeUBS || ponto.recursos.proximidadeEscola) && (
                    <div>
                      <h4 className="font-medium text-sm text-gray-900 mb-2">
                        Equipamentos Próximos
                      </h4>
                      <div className="space-y-1 text-sm text-gray-600">
                        {ponto.recursos.proximidadeUBS && (
                          <p>• {ponto.recursos.proximidadeUBS}</p>
                        )}
                        {ponto.recursos.proximidadeEscola && (
                          <p>• {ponto.recursos.proximidadeEscola}</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-sm text-gray-900 mb-2 flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      Ações e Responsabilidade
                    </h4>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div>
                        <p><strong>Responsável:</strong> {ponto.acoes.responsavel}</p>
                        <p><strong>Última atualização:</strong> {new Date(ponto.acoes.ultimaAtualizacao).toLocaleDateString('pt-BR')}</p>
                      </div>
                    </div>
                  </div>

                  {ponto.relatorios && ponto.relatorios.length > 0 && (
                    <div>
                      <h4 className="font-medium text-sm text-gray-900 mb-2">
                        Relatórios Recentes
                      </h4>
                      {ponto.relatorios.map((relatorio, index) => (
                        <div key={index} className="p-2 bg-gray-50 rounded text-xs">
                          <p><strong>{relatorio.tipo}</strong> - {new Date(relatorio.data).toLocaleDateString('pt-BR')}</p>
                          <p className="text-gray-600">{relatorio.descricao}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-sm text-gray-900 mb-2">Medidas Implementadas</h4>
                    <ul className="space-y-1 text-sm text-gray-600">
                      {ponto.acoes.medidasImplementadas.map((medida, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <CheckCircle className="h-3 w-3 text-green-600 mt-0.5 flex-shrink-0" />
                          {medida}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium text-sm text-gray-900 mb-2">Medidas Planejadas</h4>
                    <ul className="space-y-1 text-sm text-gray-600">
                      {ponto.acoes.medidasPlanejadas.map((medida, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <Clock className="h-3 w-3 text-yellow-600 mt-0.5 flex-shrink-0" />
                          {medida}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {ponto.observacoes && (
                  <div className="mt-4">
                    <h4 className="font-medium text-sm text-gray-900 mb-2">Observações</h4>
                    <p className="text-sm text-gray-600">{ponto.observacoes}</p>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 mt-4 pt-4 border-t">
                <Button variant="outline" size="sm">
                  <MapPin className="h-4 w-4 mr-1" />
                  Ver no Mapa
                </Button>
                <Button variant="outline" size="sm">
                  <Camera className="h-4 w-4 mr-1" />
                  Câmeras
                </Button>
                <Button size="sm">
                  <Shield className="h-4 w-4 mr-1" />
                  Gerenciar
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
              <h4 className="font-medium text-green-700 mb-2">Relatório de Segurança por Bairro</h4>
              <p className="text-sm text-gray-600">
                Consulta de informações sobre segurança pública por região, incluindo estatísticas e medidas preventivas.
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium text-green-700 mb-2">Alerta de Área de Risco</h4>
              <p className="text-sm text-gray-600">
                Sistema de alertas sobre áreas com maior incidência criminal e recomendações de segurança.
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium text-green-700 mb-2">Informações de Segurança</h4>
              <p className="text-sm text-gray-600">
                Portal de informações sobre medidas de segurança, dicas de prevenção e recursos disponíveis.
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium text-green-700 mb-2">Mapa de Criminalidade</h4>
              <p className="text-sm text-gray-600">
                Visualização interativa dos pontos críticos e estatísticas de criminalidade no município.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}