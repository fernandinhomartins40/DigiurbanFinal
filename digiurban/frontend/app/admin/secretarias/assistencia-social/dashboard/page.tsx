'use client'

import { useState } from 'react'
import { useAdminAuth } from '@/hooks/useAdminAuth'
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
  Cell
} from 'recharts'
import {
  Heart,
  Users,
  Home,
  Package,
  MapPin,
  FileText,
  Calendar,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Target,
  Activity,
  BarChart3,
  PieChart as PieChartIcon,
  Download,
  RefreshCw,
  Zap
} from 'lucide-react'

const atendimentosData = [
  { mes: 'Jan', auxilio: 45, denuncia: 12, orientacao: 78, encaminhamento: 34 },
  { mes: 'Fev', auxilio: 52, denuncia: 8, orientacao: 85, encaminhamento: 41 },
  { mes: 'Mar', auxilio: 38, denuncia: 15, orientacao: 72, encaminhamento: 29 },
  { mes: 'Abr', auxilio: 61, denuncia: 10, orientacao: 91, encaminhamento: 47 },
  { mes: 'Mai', auxilio: 49, denuncia: 13, orientacao: 83, encaminhamento: 36 },
  { mes: 'Jun', auxilio: 55, denuncia: 9, orientacao: 88, encaminhamento: 42 }
]

const vulnerabilidadeData = [
  { nome: 'Desemprego', valor: 145, cor: '#8884d8' },
  { nome: 'Violência Doméstica', valor: 89, cor: '#82ca9d' },
  { nome: 'Dependência Química', valor: 67, cor: '#ffc658' },
  { nome: 'Deficiência', valor: 124, cor: '#ff7300' },
  { nome: 'Idosos', valor: 78, cor: '#00ff00' },
  { nome: 'Situação de Rua', valor: 34, cor: '#0088fe' }
]

const beneficiosData = [
  { mes: 'Jan', eventuais: 89, continuados: 234, emergenciais: 45 },
  { mes: 'Fev', eventuais: 95, continuados: 241, emergenciais: 52 },
  { mes: 'Mar', eventuais: 82, continuados: 238, emergenciais: 38 },
  { mes: 'Abr', eventuais: 107, continuados: 255, emergenciais: 61 },
  { mes: 'Mai', eventuais: 98, continuados: 248, emergenciais: 49 },
  { mes: 'Jun', eventuais: 103, continuados: 262, emergenciais: 55 }
]

export default function DashboardAssistenciaSocialPage() {
  const { user } = useAdminAuth()
  const [selectedPeriod, setSelectedPeriod] = useState('6m')

  const dashboardStats = {
    atendimentos: {
      total: 1847,
      crescimento: '+12%',
      meta: 2000,
      concluidos: 1654
    },
    familias: {
      vulneraveis: 542,
      acompanhamento: 387,
      criticas: 45,
      resolvidas: 298
    },
    beneficios: {
      ativos: 1567,
      pendentes: 89,
      aprovados: 234,
      valor: 'R$ 847.234'
    },
    visitas: {
      realizadas: 456,
      agendadas: 67,
      emergenciais: 23,
      cobertura: '87%'
    },
    equipamentos: {
      cras: 8,
      creas: 3,
      capacidade: '92%',
      territorios: 12
    },
    entregas: {
      realizadas: 789,
      pendentes: 34,
      urgentes: 12,
      satisfacao: '94%'
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Heart className="h-8 w-8 text-blue-600" />
            Dashboard Assistência Social
          </h1>
          <p className="text-gray-600 mt-1">
            Visão geral e indicadores da Secretaria de Assistência Social
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
            <CardTitle className="text-sm font-medium">Total de Atendimentos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats.atendimentos.total.toLocaleString()}</div>
            <div className="flex items-center justify-between mt-2">
              <Badge variant="secondary" className="text-green-700 bg-green-100">
                {dashboardStats.atendimentos.crescimento}
              </Badge>
              <span className="text-xs text-muted-foreground">
                Meta: {dashboardStats.atendimentos.meta.toLocaleString()}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Famílias Vulneráveis</CardTitle>
            <Home className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{dashboardStats.familias.vulneraveis}</div>
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs text-muted-foreground">
                Críticas: {dashboardStats.familias.criticas}
              </span>
              <span className="text-xs text-green-600">
                Resolvidas: {dashboardStats.familias.resolvidas}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Benefícios Ativos</CardTitle>
            <Package className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{dashboardStats.beneficios.ativos.toLocaleString()}</div>
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs text-muted-foreground">
                Pendentes: {dashboardStats.beneficios.pendentes}
              </span>
              <span className="text-xs text-green-600">
                {dashboardStats.beneficios.valor}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Visitas Realizadas</CardTitle>
            <MapPin className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{dashboardStats.visitas.realizadas}</div>
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs text-muted-foreground">
                Agendadas: {dashboardStats.visitas.agendadas}
              </span>
              <span className="text-xs text-green-600">
                Cobertura: {dashboardStats.visitas.cobertura}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Atendimentos por Tipo
            </CardTitle>
            <CardDescription>Evolução mensal dos tipos de atendimento</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={atendimentosData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="auxilio" stackId="a" fill="#8884d8" name="Auxílio Social" />
                <Bar dataKey="denuncia" stackId="a" fill="#82ca9d" name="Denúncias" />
                <Bar dataKey="orientacao" stackId="a" fill="#ffc658" name="Orientações" />
                <Bar dataKey="encaminhamento" stackId="a" fill="#ff7300" name="Encaminhamentos" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChartIcon className="h-5 w-5" />
              Vulnerabilidades por Tipo
            </CardTitle>
            <CardDescription>Distribuição das principais vulnerabilidades</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={vulnerabilidadeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ nome, valor }) => `${nome}: ${valor}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="valor"
                >
                  {vulnerabilidadeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.cor} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Evolução dos Benefícios
          </CardTitle>
          <CardDescription>Distribuição mensal de benefícios concedidos</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={beneficiosData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mes" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="eventuais" stroke="#8884d8" name="Eventuais" strokeWidth={2} />
              <Line type="monotone" dataKey="continuados" stroke="#82ca9d" name="Continuados" strokeWidth={2} />
              <Line type="monotone" dataKey="emergenciais" stroke="#ffc658" name="Emergenciais" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Home className="h-5 w-5 text-blue-600" />
              Equipamentos SUAS
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">CRAS Ativos</span>
                <span className="font-bold">{dashboardStats.equipamentos.cras}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">CREAS Ativos</span>
                <span className="font-bold">{dashboardStats.equipamentos.creas}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Capacidade Ocupada</span>
                <Badge variant="secondary" className="bg-green-100 text-green-700">
                  {dashboardStats.equipamentos.capacidade}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Territórios Cobertos</span>
                <span className="font-bold">{dashboardStats.equipamentos.territorios}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Package className="h-5 w-5 text-green-600" />
              Entregas Emergenciais
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Realizadas</span>
                <span className="font-bold text-green-600">{dashboardStats.entregas.realizadas}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Pendentes</span>
                <span className="font-bold text-orange-600">{dashboardStats.entregas.pendentes}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Urgentes</span>
                <span className="font-bold text-red-600">{dashboardStats.entregas.urgentes}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Satisfação</span>
                <Badge variant="secondary" className="bg-green-100 text-green-700">
                  {dashboardStats.entregas.satisfacao}
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
                <span className="text-sm text-gray-600">Taxa de Resolução</span>
                <Badge variant="secondary" className="bg-green-100 text-green-700">
                  89%
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Tempo Médio Atendimento</span>
                <span className="font-bold">3.2 dias</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Reincidência</span>
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-700">
                  12%
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Cobertura Territorial</span>
                <Badge variant="secondary" className="bg-green-100 text-green-700">
                  95%
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
              <h4 className="font-medium text-green-700 mb-2">Portal da Assistência Social</h4>
              <p className="text-sm text-gray-600">
                Portal público com informações sobre todos os serviços, programas e benefícios da assistência social.
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium text-green-700 mb-2">Consulta de Benefícios</h4>
              <p className="text-sm text-gray-600">
                Consulta online do status de benefícios sociais através de CPF ou protocolo de atendimento.
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium text-green-700 mb-2">Localizar CRAS/CREAS</h4>
              <p className="text-sm text-gray-600">
                Ferramenta para localizar o equipamento SUAS mais próximo baseado no endereço do usuário.
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium text-green-700 mb-2">Calendário de Atendimentos</h4>
              <p className="text-sm text-gray-600">
                Agenda pública com horários disponíveis para atendimentos nos equipamentos da assistência social.
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium text-green-700 mb-2">Central de Denúncias</h4>
              <p className="text-sm text-gray-600">
                Canal online para denúncias de violação de direitos, maus-tratos e situações de vulnerabilidade.
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium text-green-700 mb-2">Cadastro Único Digital</h4>
              <p className="text-sm text-gray-600">
                Pré-cadastro online no CadÚnico para agilizar o atendimento presencial nos equipamentos SUAS.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}