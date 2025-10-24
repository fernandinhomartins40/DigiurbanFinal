'use client'

import { useState } from 'react'
import { useAdminAuth } from '@/contexts/AdminAuthContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts'
import {
  Shield,
  AlertTriangle,
  Clock,
  Users,
  Camera,
  Car,
  TrendingUp,
  TrendingDown,
  Activity,
  MapPin,
  Phone,
  CheckCircle,
  Eye,
  Radio,
  Bell,
  Download,
  RefreshCw,
  Zap
} from 'lucide-react'

const ocorrenciasData = [
  { mes: 'Jan', furto: 45, roubo: 32, perturbacao: 28, vandalismo: 15, outros: 12 },
  { mes: 'Fev', furto: 52, roubo: 29, perturbacao: 31, vandalismo: 18, outros: 14 },
  { mes: 'Mar', furto: 38, roubo: 35, perturbacao: 25, vandalismo: 12, outros: 16 },
  { mes: 'Abr', furto: 61, roubo: 41, perturbacao: 33, vandalismo: 20, outros: 18 },
  { mes: 'Mai', furto: 49, roubo: 38, perturbacao: 29, vandalismo: 16, outros: 15 },
  { mes: 'Jun', furto: 55, roubo: 42, perturbacao: 35, vandalismo: 22, outros: 19 }
]

const atendimentosData = [
  { hora: '00h', quantidade: 3 },
  { hora: '04h', quantidade: 1 },
  { hora: '08h', quantidade: 12 },
  { hora: '12h', quantidade: 18 },
  { hora: '16h', quantidade: 15 },
  { hora: '20h', quantidade: 25 }
]

const regiaoData = [
  { nome: 'Centro', valor: 45, cor: '#8884d8' },
  { nome: 'Vila Nova', valor: 63, cor: '#82ca9d' },
  { nome: 'Industrial', valor: 32, cor: '#ffc658' },
  { nome: 'Residencial', valor: 28, cor: '#ff7300' },
  { nome: 'Rural', valor: 15, cor: '#00ff00' }
]

const tempoRespostaData = [
  { mes: 'Jan', tempo: 15 },
  { mes: 'Fev', tempo: 14 },
  { mes: 'Mar', tempo: 16 },
  { mes: 'Abr', tempo: 12 },
  { mes: 'Mai', tempo: 13 },
  { mes: 'Jun', tempo: 11 }
]

export default function DashboardSegurancaPage() {
  const { user } = useAdminAuth()
  const [selectedPeriod, setSelectedPeriod] = useState('6m')

  const dashboardStats = {
    seguranca: {
      ocorrenciasTotal: 683,
      tendencia: '+8%',
      resolvidas: 592,
      emAndamento: 91
    },
    atendimentos: {
      total: 1247,
      emergenciais: 89,
      concluidos: 1158,
      tempoMedioResposta: 13
    },
    recursos: {
      efetivo: 45,
      viaturas: 12,
      cameras: 67,
      cobertura: 89
    },
    pontosCriticos: {
      total: 15,
      criticos: 3,
      monitorados: 12,
      resolvidos: 8
    },
    operacoes: {
      realizadas: 28,
      preventivas: 18,
      repressivas: 10,
      sucesso: 96
    },
    indicadores: {
      indiceSeguranca: 7.8,
      satisfacaoPopulacao: 82,
      eficienciaOperacional: 94,
      coberturaTerritorial: 89
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Shield className="h-8 w-8 text-blue-600" />
            Dashboard Segurança Pública
          </h1>
          <p className="text-gray-600 mt-1">
            Painel de indicadores de segurança municipal em tempo real
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1m">1 Mês</SelectItem>
              <SelectItem value="3m">3 Meses</SelectItem>
              <SelectItem value="6m">6 Meses</SelectItem>
              <SelectItem value="1y">1 Ano</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon">
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ocorrências Totais</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats.seguranca.ocorrenciasTotal.toLocaleString()}</div>
            <div className="flex items-center justify-between mt-2">
              <Badge variant="secondary" className="text-red-700 bg-red-100">
                {dashboardStats.seguranca.tendencia}
              </Badge>
              <span className="text-xs text-muted-foreground">
                {dashboardStats.seguranca.emAndamento} em andamento
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Atendimentos</CardTitle>
            <Phone className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{dashboardStats.atendimentos.total.toLocaleString()}</div>
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs text-muted-foreground">
                Emergenciais: {dashboardStats.atendimentos.emergenciais}
              </span>
              <span className="text-xs text-green-600">
                Tempo: {dashboardStats.atendimentos.tempoMedioResposta}min
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recursos Ativos</CardTitle>
            <Users className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{dashboardStats.recursos.efetivo}</div>
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs text-muted-foreground">
                Viaturas: {dashboardStats.recursos.viaturas}
              </span>
              <span className="text-xs text-green-600">
                Cobertura: {dashboardStats.recursos.cobertura}%
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pontos Críticos</CardTitle>
            <MapPin className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{dashboardStats.pontosCriticos.total}</div>
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs text-muted-foreground">
                Críticos: {dashboardStats.pontosCriticos.criticos}
              </span>
              <span className="text-xs text-green-600">
                Resolvidos: {dashboardStats.pontosCriticos.resolvidos}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Ocorrências por Tipo
            </CardTitle>
            <CardDescription>Evolução mensal dos tipos de ocorrência</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={ocorrenciasData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="furto" stackId="a" fill="#8884d8" name="Furto" />
                <Bar dataKey="roubo" stackId="a" fill="#82ca9d" name="Roubo" />
                <Bar dataKey="perturbacao" stackId="a" fill="#ffc658" name="Perturbação" />
                <Bar dataKey="vandalismo" stackId="a" fill="#ff7300" name="Vandalismo" />
                <Bar dataKey="outros" stackId="a" fill="#8dd1e1" name="Outros" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Atendimentos por Horário
            </CardTitle>
            <CardDescription>Distribuição de atendimentos ao longo do dia</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={atendimentosData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hora" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="quantidade" stroke="#8884d8" fill="#8884d8" name="Atendimentos" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Ocorrências por Região
            </CardTitle>
            <CardDescription>Distribuição territorial das ocorrências</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={regiaoData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ nome, valor }) => `${nome}: ${valor}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="valor"
                >
                  {regiaoData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.cor} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Tempo de Resposta
            </CardTitle>
            <CardDescription>Evolução do tempo médio de resposta (minutos)</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={tempoRespostaData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="tempo" stroke="#82ca9d" strokeWidth={2} name="Tempo (min)" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Camera className="h-5 w-5 text-blue-600" />
              Sistema de Vigilância
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Câmeras Ativas</span>
                <span className="font-bold">{dashboardStats.recursos.cameras}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Online</span>
                <Badge variant="secondary" className="bg-green-100 text-green-700">
                  {Math.round(dashboardStats.recursos.cameras * 0.95)}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Offline</span>
                <Badge variant="secondary" className="bg-red-100 text-red-700">
                  {Math.round(dashboardStats.recursos.cameras * 0.05)}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Cobertura</span>
                <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                  {dashboardStats.recursos.cobertura}%
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Car className="h-5 w-5 text-green-600" />
              Frota Operacional
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Viaturas Totais</span>
                <span className="font-bold">{dashboardStats.recursos.viaturas}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Em Patrulhamento</span>
                <Badge variant="secondary" className="bg-green-100 text-green-700">
                  {Math.round(dashboardStats.recursos.viaturas * 0.8)}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Em Manutenção</span>
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-700">
                  {Math.round(dashboardStats.recursos.viaturas * 0.15)}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Disponíveis</span>
                <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                  {Math.round(dashboardStats.recursos.viaturas * 0.05)}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Activity className="h-5 w-5 text-purple-600" />
              Indicadores de Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Índice de Segurança</span>
                <Badge variant="secondary" className="bg-green-100 text-green-700">
                  {dashboardStats.indicadores.indiceSeguranca}/10
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Satisfação</span>
                <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                  {dashboardStats.indicadores.satisfacaoPopulacao}%
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Eficiência Operacional</span>
                <Badge variant="secondary" className="bg-green-100 text-green-700">
                  {dashboardStats.indicadores.eficienciaOperacional}%
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Cobertura Territorial</span>
                <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                  {dashboardStats.indicadores.coberturaTerritorial}%
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Shield className="h-5 w-5 text-orange-600" />
              Operações Realizadas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total de Operações</span>
                <span className="font-bold text-orange-600">{dashboardStats.operacoes.realizadas}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Preventivas</span>
                <span className="font-bold">{dashboardStats.operacoes.preventivas}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Repressivas</span>
                <span className="font-bold">{dashboardStats.operacoes.repressivas}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Taxa de Sucesso</span>
                <Badge variant="secondary" className="bg-green-100 text-green-700">
                  {dashboardStats.operacoes.sucesso}%
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Bell className="h-5 w-5 text-red-600" />
              Alertas e Emergências
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Alertas Ativos</span>
                <Badge variant="secondary" className="bg-red-100 text-red-700">
                  5
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Emergências Hoje</span>
                <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                  12
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Tempo Médio Resposta</span>
                <span className="font-bold text-blue-600">{dashboardStats.atendimentos.tempoMedioResposta} min</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Taxa de Resolução</span>
                <Badge variant="secondary" className="bg-green-100 text-green-700">
                  92%
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-blue-600" />
            Serviços Gerados Automaticamente
          </CardTitle>
          <CardDescription>
            Esta página consolida e gera automaticamente os seguintes serviços para o catálogo público:
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium text-green-700 mb-2">Boletim de Segurança</h4>
              <p className="text-sm text-gray-600">
                Relatório público mensal com estatísticas de segurança, tendências e ações preventivas do município.
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium text-green-700 mb-2">Indicadores do Cidadão</h4>
              <p className="text-sm text-gray-600">
                Consulta personalizada de indicadores de segurança por endereço e região de residência.
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium text-green-700 mb-2">Relatório Mensal</h4>
              <p className="text-sm text-gray-600">
                Relatório detalhado de atividades da segurança pública municipal com dados e análises.
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium text-green-700 mb-2">Mapa de Segurança</h4>
              <p className="text-sm text-gray-600">
                Visualização interativa dos dados de segurança municipal com filtros por região e tipo.
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium text-green-700 mb-2">Central de Emergências</h4>
              <p className="text-sm text-gray-600">
                Portal integrado para emergências com acesso direto aos contatos e protocolos de segurança.
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium text-green-700 mb-2">Avaliação de Segurança</h4>
              <p className="text-sm text-gray-600">
                Sistema de avaliação da qualidade dos serviços de segurança pública municipal.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}