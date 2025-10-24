'use client'

import { useAdminAuth } from '@/contexts/AdminAuthContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  GraduationCap,
  Users,
  School,
  Calendar,
  TrendingUp,
  TrendingDown,
  Activity,
  BookOpen,
  Bus,
  UtensilsCrossed,
  UserCheck,
  AlertTriangle,
  CheckCircle,
  Target,
  Award,
  BarChart3,
  PieChart,
  MapPin,
  Clock,
  Heart
} from 'lucide-react'

const metricsGerais = {
  alunosMatriculados: 1247,
  escolasAtivas: 3,
  professores: 52,
  turmas: 35,
  presencaMedia: 92,
  aprovacao: 94,
  evasao: 3,
  eventosRealizados: 18,
  transporteEscolar: 75,
  refeicoesServidas: 2370,
  ocorrenciasPendentes: 8,
  proximosEventos: 4
}

const indicadoresEducacionais = [
  {
    titulo: 'Taxa de Aprovação',
    valor: 94,
    meta: 95,
    tendencia: 'alta',
    unidade: '%',
    icon: Award,
    cor: 'text-green-600'
  },
  {
    titulo: 'Taxa de Evasão',
    valor: 3,
    meta: 5,
    tendencia: 'baixa',
    unidade: '%',
    icon: AlertTriangle,
    cor: 'text-green-600'
  },
  {
    titulo: 'Frequência Escolar',
    valor: 92,
    meta: 90,
    tendencia: 'alta',
    unidade: '%',
    icon: UserCheck,
    cor: 'text-green-600'
  },
  {
    titulo: 'IDEB Municipal',
    valor: 6.2,
    meta: 6.0,
    tendencia: 'alta',
    unidade: '',
    icon: Target,
    cor: 'text-green-600'
  }
]

const desempenhoEscolas = [
  {
    nome: 'EMEF João da Silva',
    alunos: 280,
    aprovacao: 96,
    frequencia: 94,
    ocorrencias: 12,
    ideb: 6.4,
    status: 'excelente'
  },
  {
    nome: 'EMEI Maria Montessori',
    alunos: 160,
    aprovacao: 98,
    frequencia: 96,
    ocorrencias: 3,
    ideb: 6.8,
    status: 'excelente'
  },
  {
    nome: 'EMEF Paulo Freire',
    alunos: 350,
    aprovacao: 91,
    frequencia: 89,
    ocorrencias: 18,
    ideb: 5.9,
    status: 'bom'
  }
]

const distribuicaoAlunos = {
  porSerie: [
    { serie: 'Berçário', alunos: 45, percentual: 3.6 },
    { serie: 'Maternal I', alunos: 60, percentual: 4.8 },
    { serie: 'Maternal II', alunos: 55, percentual: 4.4 },
    { serie: '1º Ano', alunos: 140, percentual: 11.2 },
    { serie: '2º Ano', alunos: 135, percentual: 10.8 },
    { serie: '3º Ano', alunos: 130, percentual: 10.4 },
    { serie: '4º Ano', alunos: 125, percentual: 10.0 },
    { serie: '5º Ano', alunos: 122, percentual: 9.8 },
    { serie: '6º Ano', alunos: 118, percentual: 9.5 },
    { serie: '7º Ano', alunos: 115, percentual: 9.2 },
    { serie: '8º Ano', alunos: 110, percentual: 8.8 },
    { serie: '9º Ano', alunos: 92, percentual: 7.4 }
  ],
  porIdade: [
    { faixa: '0-3 anos', alunos: 160, percentual: 12.8 },
    { faixa: '4-5 anos', alunos: 180, percentual: 14.4 },
    { faixa: '6-10 anos', alunos: 652, percentual: 52.3 },
    { faixa: '11-14 anos', alunos: 255, percentual: 20.4 }
  ]
}

const alertasUrgentes = [
  {
    tipo: 'evasao',
    titulo: 'Alta Taxa de Faltas',
    descricao: '5 alunos com mais de 10 faltas consecutivas',
    escola: 'EMEF Paulo Freire',
    prioridade: 'alta'
  },
  {
    tipo: 'infraestrutura',
    titulo: 'Manutenção Necessária',
    descricao: 'Problema na rede elétrica da cozinha',
    escola: 'EMEI Maria Montessori',
    prioridade: 'media'
  },
  {
    tipo: 'transporte',
    titulo: 'Veículo em Manutenção',
    descricao: 'Van ESC-1003 indisponível por 3 dias',
    escola: 'Transporte Escolar',
    prioridade: 'baixa'
  }
]

const servicosGerados = [
  'Relatório de Desempenho do Aluno',
  'Frequência Escolar',
  'Histórico Educacional',
  'Boletim Escolar Digital',
  'Certificado de Conclusão',
  'Declaração de Matrícula',
  'Estatísticas Educacionais'
]

export default function DashboardEducacaoPage() {
  const { user } = useAdminAuth()

  const getStatusEscolaBadge = (status: string) => {
    switch (status) {
      case 'excelente':
        return <Badge className="bg-green-500 text-white">Excelente</Badge>
      case 'bom':
        return <Badge className="bg-blue-500 text-white">Bom</Badge>
      case 'regular':
        return <Badge className="bg-yellow-500 text-white">Regular</Badge>
      case 'atencao':
        return <Badge variant="destructive">Atenção</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getPrioridadeBadge = (prioridade: string) => {
    switch (prioridade) {
      case 'alta':
        return <Badge variant="destructive">Alta</Badge>
      case 'media':
        return <Badge className="bg-yellow-500 text-white">Média</Badge>
      case 'baixa':
        return <Badge variant="secondary">Baixa</Badge>
      default:
        return <Badge variant="outline">{prioridade}</Badge>
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

  const getIndicadorColor = (valor: number, meta: number, inverso: boolean = false) => {
    if (inverso) {
      // Para indicadores onde menor é melhor (como evasão)
      if (valor <= meta) return 'text-green-600'
      if (valor <= meta * 1.2) return 'text-yellow-600'
      return 'text-red-600'
    } else {
      // Para indicadores onde maior é melhor
      if (valor >= meta) return 'text-green-600'
      if (valor >= meta * 0.8) return 'text-yellow-600'
      return 'text-red-600'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <BarChart3 className="h-8 w-8 text-blue-600 mr-3" />
            Dashboard Educação
          </h1>
          <p className="text-gray-600 mt-1">
            Painel educacional com métricas de alunos, frequência, aprovação e eventos
          </p>
        </div>
        <Badge variant="outline" className="text-blue-600 border-blue-200">
          Educação Municipal
        </Badge>
      </div>

      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alunos Matriculados</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metricsGerais.alunosMatriculados.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Em {metricsGerais.escolasAtivas} escolas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Professores</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metricsGerais.professores}</div>
            <p className="text-xs text-muted-foreground">
              Em {metricsGerais.turmas} turmas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Presença Média</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{metricsGerais.presencaMedia}%</div>
            <p className="text-xs text-muted-foreground">
              Este mês
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Aprovação</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{metricsGerais.aprovacao}%</div>
            <p className="text-xs text-muted-foreground">
              Ano letivo atual
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Indicadores Educacionais */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Target className="h-5 w-5 mr-2" />
            Indicadores Educacionais
          </CardTitle>
          <CardDescription>
            Acompanhamento de metas e tendências
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {indicadoresEducacionais.map((indicador, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <indicador.icon className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-sm">{indicador.titulo}</p>
                    <p className="text-xs text-gray-600">Meta: {indicador.meta}{indicador.unidade}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-2">
                    <span className={`text-xl font-bold ${indicador.cor}`}>
                      {indicador.valor}{indicador.unidade}
                    </span>
                    {getTendenciaIcon(indicador.tendencia)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Alertas e Desempenho das Escolas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Alertas Urgentes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2 text-yellow-600" />
              Alertas Urgentes
            </CardTitle>
            <CardDescription>
              Situações que requerem atenção
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {alertasUrgentes.map((alerta, index) => (
                <div key={index} className="border rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-sm">{alerta.titulo}</h4>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="text-xs">{alerta.escola}</Badge>
                      {getPrioridadeBadge(alerta.prioridade)}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">{alerta.descricao}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Desempenho das Escolas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <School className="h-5 w-5 mr-2" />
              Desempenho das Escolas
            </CardTitle>
            <CardDescription>
              Ranking e métricas por unidade
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {desempenhoEscolas.map((escola, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-semibold">{escola.nome}</h4>
                      <p className="text-sm text-gray-600">{escola.alunos} alunos</p>
                    </div>
                    {getStatusEscolaBadge(escola.status)}
                  </div>

                  <div className="grid grid-cols-4 gap-4 text-sm">
                    <div className="text-center">
                      <p className="text-gray-500">Aprovação</p>
                      <p className={`font-bold ${getIndicadorColor(escola.aprovacao, 90)}`}>
                        {escola.aprovacao}%
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-gray-500">Frequência</p>
                      <p className={`font-bold ${getIndicadorColor(escola.frequencia, 85)}`}>
                        {escola.frequencia}%
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-gray-500">Ocorrências</p>
                      <p className={`font-bold ${getIndicadorColor(escola.ocorrencias, 15, true)}`}>
                        {escola.ocorrencias}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-gray-500">IDEB</p>
                      <p className={`font-bold ${getIndicadorColor(escola.ideb, 6.0)}`}>
                        {escola.ideb}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Distribuição de Alunos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Por Série */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BookOpen className="h-5 w-5 mr-2" />
              Distribuição por Série
            </CardTitle>
            <CardDescription>
              Alunos matriculados por ano/série
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {distribuicaoAlunos.porSerie.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm font-medium">{item.serie}</span>
                  <div className="flex items-center space-x-3">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${item.percentual * 8}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-bold w-12 text-right">{item.alunos}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Por Faixa Etária */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Distribuição por Idade
            </CardTitle>
            <CardDescription>
              Alunos agrupados por faixa etária
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {distribuicaoAlunos.porIdade.map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{item.faixa}</span>
                    <span className="text-sm font-bold">{item.alunos} ({item.percentual}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full"
                      style={{ width: `${item.percentual * 2}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Resumo de Atividades */}
      <Card>
        <CardHeader>
          <CardTitle>Resumo de Atividades Educacionais</CardTitle>
          <CardDescription>
            Status geral de todas as áreas da educação
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center space-x-3">
                <Bus className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-medium text-sm">Transporte Escolar</p>
                  <p className="text-xs text-gray-600">{metricsGerais.transporteEscolar} estudantes</p>
                </div>
              </div>
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center space-x-3">
                <UtensilsCrossed className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium text-sm">Merenda Escolar</p>
                  <p className="text-xs text-gray-600">{metricsGerais.refeicoesServidas.toLocaleString()} refeições/dia</p>
                </div>
              </div>
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center space-x-3">
                <Calendar className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="font-medium text-sm">Eventos Realizados</p>
                  <p className="text-xs text-gray-600">{metricsGerais.eventosRealizados} este ano</p>
                </div>
              </div>
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
                <div>
                  <p className="font-medium text-sm">Ocorrências</p>
                  <p className="text-xs text-gray-600">{metricsGerais.ocorrenciasPendentes} pendentes</p>
                </div>
              </div>
              <Clock className="h-5 w-5 text-yellow-600" />
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