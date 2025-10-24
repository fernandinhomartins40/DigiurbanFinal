'use client'
// @ts-nocheck

import { useAdminAuth } from '@/contexts/AdminAuthContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Heart,
  Users,
  Calendar,
  FileText,
  TrendingUp,
  TrendingDown,
  Activity,
  Stethoscope,
  Shield,
  Truck,
  Pill,
  Eye,
  MapPin,
  AlertTriangle,
  CheckCircle,
  Clock,
  Target,
  BarChart3,
  PieChart
} from 'lucide-react'

const metricsGerais = {
  atendimentosHoje: 156,
  atendimentosOntem: 142,
  consultasAgendadas: 89,
  consultasRealizadas: 67,
  medicamentosDispensados: 234,
  campanhasAtivas: 3,
  programasAtivos: 7,
  tfdEmAndamento: 12,
  examesRealizados: 45,
  visitasACS: 78,
  transportesRealizados: 23,
  coberturaProgramas: 82
}

const alertasUrgentes = [
  {
    id: 1,
    tipo: 'estoque',
    titulo: 'Medicamento em Falta',
    descricao: 'Insulina NPH - Estoque crítico (15 unidades)',
    nivel: 'alta',
    area: 'Farmácia'
  },
  {
    id: 2,
    tipo: 'equipamento',
    titulo: 'Equipamento em Manutenção',
    descricao: 'Raio-X Principal - Aguardando peças',
    nivel: 'media',
    area: 'Exames'
  },
  {
    id: 3,
    tipo: 'transporte',
    titulo: 'Veículo Indisponível',
    descricao: 'Ambulância 02 - Manutenção preventiva',
    nivel: 'baixa',
    area: 'Transporte'
  }
]

const indicadoresPerformance = [
  {
    area: 'Atendimentos',
    meta: 180,
    realizado: 156,
    percentual: 87,
    tendencia: 'alta',
    icon: Stethoscope
  },
  {
    area: 'Agendamentos',
    meta: 100,
    realizado: 89,
    percentual: 89,
    tendencia: 'estavel',
    icon: Calendar
  },
  {
    area: 'Campanhas',
    meta: 85,
    realizado: 71,
    percentual: 84,
    tendencia: 'alta',
    icon: Shield
  },
  {
    area: 'Programas',
    meta: 90,
    realizado: 82,
    percentual: 91,
    tendencia: 'alta',
    icon: Heart
  },
  {
    area: 'TFD',
    meta: 15,
    realizado: 12,
    percentual: 80,
    tendencia: 'baixa',
    icon: Truck
  },
  {
    area: 'Exames',
    meta: 60,
    realizado: 45,
    percentual: 75,
    tendencia: 'estavel',
    icon: Eye
  }
]

const estatisticasDetalhadas = {
  atendimentosPorEspecialidade: [
    { nome: 'Clínica Geral', quantidade: 89, cor: 'bg-blue-500' },
    { nome: 'Pediatria', quantidade: 34, cor: 'bg-green-500' },
    { nome: 'Ginecologia', quantidade: 23, cor: 'bg-purple-500' },
    { nome: 'Cardiologia', quantidade: 10, cor: 'bg-red-500' }
  ],
  medicamentosMaisDispensados: [
    { nome: 'Paracetamol 500mg', quantidade: 45 },
    { nome: 'Dipirona 500mg', quantidade: 38 },
    { nome: 'Amoxicilina 500mg', quantidade: 29 },
    { nome: 'Omeprazol 20mg', quantidade: 22 }
  ],
  campanhasCobertura: [
    { nome: 'Influenza 2024', cobertura: 78, meta: 80 },
    { nome: 'Março Lilás', cobertura: 65, meta: 70 },
    { nome: 'Multivacinação', cobertura: 45, meta: 75 }
  ]
}

const servicosGerados = [
  'Dashboard de Saúde Pública',
  'Relatórios Consolidados',
  'Indicadores de Performance',
  'Monitoramento de Alertas',
  'Estatísticas de Atendimento',
  'Acompanhamento de Metas',
  'Análise de Tendências'
]

export default function DashboardSaudePage() {
  const { user } = useAdminAuth()

  const getAlertaBadge = (nivel: string) => {
    switch (nivel) {
      case 'alta':
        return <Badge variant="destructive">Alta</Badge>
      case 'media':
        return <Badge className="bg-yellow-500 text-white">Média</Badge>
      case 'baixa':
        return <Badge variant="secondary">Baixa</Badge>
      default:
        return <Badge variant="outline">{nivel}</Badge>
    }
  }

  const getTendenciaIcon = (tendencia: string) => {
    switch (tendencia) {
      case 'alta':
        return <TrendingUp className="h-4 w-4 text-green-600" />
      case 'baixa':
        return <TrendingDown className="h-4 w-4 text-red-600" />
      default:
        return <Activity className="h-4 w-4 text-gray-600" />
    }
  }

  const getPercentualColor = (percentual: number) => {
    if (percentual >= 90) return 'text-green-600'
    if (percentual >= 70) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <BarChart3 className="h-8 w-8 text-blue-600 mr-3" />
            Dashboard de Saúde
          </h1>
          <p className="text-gray-600 mt-1">
            Visão consolidada de todas as áreas da Secretaria de Saúde
          </p>
        </div>
        <Badge variant="outline" className="text-blue-600 border-blue-200">
          Saúde Municipal
        </Badge>
      </div>

      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Atendimentos Hoje</CardTitle>
            <Stethoscope className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metricsGerais.atendimentosHoje}</div>
            <p className="text-xs text-muted-foreground">
              +{metricsGerais.atendimentosHoje - metricsGerais.atendimentosOntem} vs ontem
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Consultas Agendadas</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metricsGerais.consultasAgendadas}</div>
            <p className="text-xs text-muted-foreground">
              {metricsGerais.consultasRealizadas} realizadas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Medicamentos Dispensados</CardTitle>
            <Pill className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metricsGerais.medicamentosDispensados}</div>
            <p className="text-xs text-muted-foreground">
              Hoje
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cobertura Programas</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{metricsGerais.coberturaProgramas}%</div>
            <p className="text-xs text-muted-foreground">
              Meta: 85%
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Alertas e Indicadores */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Alertas Urgentes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2 text-yellow-600" />
              Alertas Urgentes
            </CardTitle>
            <CardDescription>
              Situações que requerem atenção imediata
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {alertasUrgentes.map((alerta) => (
                <div key={alerta.id} className="border rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-sm">{alerta.titulo}</h4>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="text-xs">{alerta.area}</Badge>
                      {getAlertaBadge(alerta.nivel)}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">{alerta.descricao}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Indicadores de Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <PieChart className="h-5 w-5 mr-2" />
              Indicadores de Performance
            </CardTitle>
            <CardDescription>
              Acompanhamento de metas por área
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {indicadoresPerformance.map((indicador, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <indicador.icon className="h-4 w-4 text-blue-600" />
                    <div>
                      <p className="font-medium text-sm">{indicador.area}</p>
                      <p className="text-xs text-gray-600">
                        {indicador.realizado} / {indicador.meta}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`text-sm font-medium ${getPercentualColor(indicador.percentual)}`}>
                      {indicador.percentual}%
                    </span>
                    {getTendenciaIcon(indicador.tendencia)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Estatísticas Detalhadas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Atendimentos por Especialidade */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Atendimentos por Especialidade</CardTitle>
            <CardDescription>Distribuição hoje</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {estatisticasDetalhadas.atendimentosPorEspecialidade.map((especialidade, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${especialidade.cor}`}></div>
                    <span className="text-sm font-medium">{especialidade.nome}</span>
                  </div>
                  <span className="text-sm font-bold">{especialidade.quantidade}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Medicamentos Mais Dispensados */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Medicamentos Mais Dispensados</CardTitle>
            <CardDescription>Top 4 hoje</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {estatisticasDetalhadas.medicamentosMaisDispensados.map((medicamento, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-medium text-blue-600">#{index + 1}</span>
                    <span className="text-sm">{medicamento.nome}</span>
                  </div>
                  <span className="text-sm font-bold">{medicamento.quantidade}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Cobertura de Campanhas */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Cobertura de Campanhas</CardTitle>
            <CardDescription>Status atual vs meta</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {estatisticasDetalhadas.campanhasCobertura.map((campanha, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{campanha.nome}</span>
                    <span className={`text-sm font-bold ${getPercentualColor(campanha.cobertura)}`}>
                      {campanha.cobertura}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${(campanha.cobertura / campanha.meta) * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500">Meta: {campanha.meta}%</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Resumo de Atividades por Área */}
      <Card>
        <CardHeader>
          <CardTitle>Resumo de Atividades por Área</CardTitle>
          <CardDescription>
            Status geral de todas as áreas da saúde
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center space-x-3">
                <Shield className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="font-medium text-sm">Campanhas</p>
                  <p className="text-xs text-gray-600">{metricsGerais.campanhasAtivas} ativas</p>
                </div>
              </div>
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center space-x-3">
                <Heart className="h-5 w-5 text-red-600" />
                <div>
                  <p className="font-medium text-sm">Programas</p>
                  <p className="text-xs text-gray-600">{metricsGerais.programasAtivos} ativos</p>
                </div>
              </div>
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center space-x-3">
                <Truck className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-medium text-sm">TFD</p>
                  <p className="text-xs text-gray-600">{metricsGerais.tfdEmAndamento} em andamento</p>
                </div>
              </div>
              <Clock className="h-5 w-5 text-yellow-600" />
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center space-x-3">
                <Eye className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium text-sm">Exames</p>
                  <p className="text-xs text-gray-600">{metricsGerais.examesRealizados} hoje</p>
                </div>
              </div>
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
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
                <BarChart3 className="h-4 w-4 text-blue-600 mr-3" />
                <span className="text-sm">{servico}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}