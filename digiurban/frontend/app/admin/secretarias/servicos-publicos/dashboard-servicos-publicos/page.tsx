'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  Truck,
  MapPin,
  Clock,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Camera,
  Calendar,
  Settings,
  Download,
  Eye,
  Navigation,
  Lightbulb,
  Trash2,
  Wrench,
  Archive
} from 'lucide-react'
import { useAdminAuth } from '@/hooks/useAdminAuth'

interface DashboardData {
  atendimentos: {
    total: number
    mes_atual: number
    mes_anterior: number
    por_categoria: Array<{ categoria: string; quantidade: number; crescimento: number }>
    media_tempo_resposta: number
    satisfacao_media: number
  }
  limpeza_publica: {
    coletas_realizadas: number
    toneladas_coletadas: number
    vias_limpas: number
    equipes_ativas: number
    eficiencia_rota: number
    custos_operacionais: number
  }
  iluminacao_publica: {
    postes_funcionando: number
    postes_total: number
    manutencoes_mes: number
    economia_energia: number
    reclamacoes_resolvidas: number
    tempo_medio_reparo: number
  }
  coleta_especial: {
    agendamentos_mes: number
    residuos_coletados: number
    tipos_residuos: Array<{ tipo: string; quantidade: number; percentual: number }>
    certificados_emitidos: number
  }
  problemas_foto: {
    protocolos_abertos: number
    tempo_medio_resolucao: number
    categorias_principais: Array<{ categoria: string; quantidade: number }>
    taxa_resolucao: number
  }
  programacao_equipes: {
    equipes_ativas: number
    servicos_programados: number
    servicos_concluidos: number
    funcionarios_disponiveis: number
    veiculos_operacionais: number
    produtividade_media: number
  }
  indicadores_gerais: {
    orcamento_utilizado: number
    orcamento_total: number
    projetos_em_andamento: number
    metas_atingidas: number
    populacao_atendida: number
    indice_satisfacao: number
  }
}

export default function DashboardServicosPublicos() {
  const { user, hasPermission } = useAdminAuth()
  const [periodo, setPeriodo] = useState('mes_atual')
  const [categoria_filtro, setCategoriaFiltro] = useState('todas')

  const [dados] = useState<DashboardData>({
    atendimentos: {
      total: 2847,
      mes_atual: 324,
      mes_anterior: 298,
      por_categoria: [
        { categoria: 'Infraestrutura', quantidade: 89, crescimento: 12 },
        { categoria: 'Limpeza Urbana', quantidade: 76, crescimento: -5 },
        { categoria: 'Iluminação', quantidade: 65, crescimento: 18 },
        { categoria: 'Sinalização', quantidade: 42, crescimento: 8 },
        { categoria: 'Outros', quantidade: 52, crescimento: -2 }
      ],
      media_tempo_resposta: 3.2,
      satisfacao_media: 4.1
    },
    limpeza_publica: {
      coletas_realizadas: 1248,
      toneladas_coletadas: 856.4,
      vias_limpas: 342,
      equipes_ativas: 12,
      eficiencia_rota: 87.5,
      custos_operacionais: 245780
    },
    iluminacao_publica: {
      postes_funcionando: 4578,
      postes_total: 4632,
      manutencoes_mes: 145,
      economia_energia: 18.7,
      reclamacoes_resolvidas: 94,
      tempo_medio_reparo: 2.1
    },
    coleta_especial: {
      agendamentos_mes: 89,
      residuos_coletados: 12.8,
      tipos_residuos: [
        { tipo: 'Eletrônicos', quantidade: 4.2, percentual: 32.8 },
        { tipo: 'Óleo de Cozinha', quantidade: 3.1, percentual: 24.2 },
        { tipo: 'Baterias', quantidade: 2.4, percentual: 18.8 },
        { tipo: 'Remédios', quantidade: 1.8, percentual: 14.1 },
        { tipo: 'Outros', quantidade: 1.3, percentual: 10.1 }
      ],
      certificados_emitidos: 76
    },
    problemas_foto: {
      protocolos_abertos: 156,
      tempo_medio_resolucao: 5.8,
      categorias_principais: [
        { categoria: 'Infraestrutura', quantidade: 68 },
        { categoria: 'Iluminação', quantidade: 34 },
        { categoria: 'Limpeza', quantidade: 28 },
        { categoria: 'Sinalização', quantidade: 16 },
        { categoria: 'Outros', quantidade: 10 }
      ],
      taxa_resolucao: 78.4
    },
    programacao_equipes: {
      equipes_ativas: 18,
      servicos_programados: 245,
      servicos_concluidos: 198,
      funcionarios_disponiveis: 67,
      veiculos_operacionais: 24,
      produtividade_media: 83.2
    },
    indicadores_gerais: {
      orcamento_utilizado: 1847320,
      orcamento_total: 2400000,
      projetos_em_andamento: 15,
      metas_atingidas: 12,
      populacao_atendida: 85400,
      indice_satisfacao: 4.2
    }
  })

  const periodos = [
    { value: 'mes_atual', label: 'Mês Atual' },
    { value: 'trimestre', label: 'Trimestre' },
    { value: 'semestre', label: 'Semestre' },
    { value: 'ano', label: 'Ano' }
  ]

  const categorias = [
    { value: 'todas', label: 'Todas as Categorias' },
    { value: 'atendimentos', label: 'Atendimentos' },
    { value: 'limpeza', label: 'Limpeza Pública' },
    { value: 'iluminacao', label: 'Iluminação' },
    { value: 'coleta_especial', label: 'Coleta Especial' },
    { value: 'equipes', label: 'Equipes' }
  ]

  const getVariationIcon = (crescimento: number) => {
    if (crescimento > 0) return <TrendingUp className="h-4 w-4 text-green-500" />
    if (crescimento < 0) return <TrendingDown className="h-4 w-4 text-red-500" />
    return <div className="h-4 w-4" />
  }

  const getVariationColor = (crescimento: number) => {
    if (crescimento > 0) return 'text-green-600'
    if (crescimento < 0) return 'text-red-600'
    return 'text-gray-600'
  }

  const calcularPercentualOrcamento = () => {
    return (dados.indicadores_gerais.orcamento_utilizado / dados.indicadores_gerais.orcamento_total) * 100
  }

  const calcularTaxaIluminacao = () => {
    return (dados.iluminacao_publica.postes_funcionando / dados.iluminacao_publica.postes_total) * 100
  }

  const calcularTaxaConclusao = () => {
    return (dados.programacao_equipes.servicos_concluidos / dados.programacao_equipes.servicos_programados) * 100
  }

  const gerarServicosAutomaticos = () => {
    return [
      {
        nome: "Consulta de Serviços Urbanos",
        descricao: "Consulte o status e histórico de todos os serviços urbanos disponíveis",
        categoria: "Consultas",
        prazo: "Imediato",
        documentos: ["Número do protocolo ou endereço"],
        digital: true,
        gratuito: true
      },
      {
        nome: "Relatório de Serviços Públicos",
        descricao: "Solicite relatórios detalhados sobre serviços públicos em sua região",
        categoria: "Relatórios",
        prazo: "5 dias úteis",
        documentos: ["Especificação da área", "Período desejado"],
        digital: true,
        gratuito: true
      },
      {
        nome: "Agendamento Integrado de Serviços",
        descricao: "Agende múltiplos serviços urbanos de forma integrada",
        categoria: "Agendamentos",
        prazo: "3 dias úteis",
        documentos: ["Lista de serviços", "Preferência de horários"],
        digital: true,
        gratuito: true
      }
    ]
  }

  if (!['admin', 'secretario', 'coordenador', 'tecnico'].some(permission => hasPermission(permission))) {
    return <div className="p-6">Acesso negado. Você não tem permissão para acessar esta página.</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard - Serviços Públicos</h1>
          <p className="text-muted-foreground mt-2">
            Visão consolidada e métricas de desempenho de todos os serviços públicos urbanos
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={periodo} onValueChange={setPeriodo}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {periodos.map(p => (
                <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={categoria_filtro} onValueChange={setCategoriaFiltro}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {categorias.map(c => (
                <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Atendimentos</CardTitle>
            <Navigation className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dados.atendimentos.mes_atual}</div>
            <div className="flex items-center text-xs">
              {getVariationIcon((dados.atendimentos.mes_atual - dados.atendimentos.mes_anterior) / dados.atendimentos.mes_anterior * 100)}
              <span className={getVariationColor((dados.atendimentos.mes_atual - dados.atendimentos.mes_anterior) / dados.atendimentos.mes_anterior * 100)}>
                {Math.abs(((dados.atendimentos.mes_atual - dados.atendimentos.mes_anterior) / dados.atendimentos.mes_anterior * 100)).toFixed(1)}%
              </span>
              <span className="text-muted-foreground ml-1">vs mês anterior</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Limpeza Urbana</CardTitle>
            <Trash2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dados.limpeza_publica.toneladas_coletadas}t</div>
            <p className="text-xs text-muted-foreground">
              {dados.limpeza_publica.coletas_realizadas} coletas realizadas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Iluminação Pública</CardTitle>
            <Lightbulb className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{calcularTaxaIluminacao().toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              {dados.iluminacao_publica.postes_funcionando}/{dados.iluminacao_publica.postes_total} postes funcionando
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Equipes Ativas</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dados.programacao_equipes.equipes_ativas}</div>
            <p className="text-xs text-muted-foreground">
              {dados.programacao_equipes.funcionarios_disponiveis} funcionários disponíveis
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Atendimentos por Categoria
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dados.atendimentos.por_categoria.map((cat, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{cat.categoria}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{cat.quantidade}</span>
                      <div className="flex items-center">
                        {getVariationIcon(cat.crescimento)}
                        <span className={`text-xs ${getVariationColor(cat.crescimento)}`}>
                          {Math.abs(cat.crescimento)}%
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{
                        width: `${(cat.quantidade / Math.max(...dados.atendimentos.por_categoria.map(c => c.quantidade))) * 100}%`
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Indicadores de Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 border rounded">
                <div>
                  <p className="text-sm font-medium">Tempo Médio de Resposta</p>
                  <p className="text-xs text-muted-foreground">Atendimentos</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold">{dados.atendimentos.media_tempo_resposta}</p>
                  <p className="text-xs text-muted-foreground">dias</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 border rounded">
                <div>
                  <p className="text-sm font-medium">Eficiência de Rota</p>
                  <p className="text-xs text-muted-foreground">Limpeza pública</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold">{dados.limpeza_publica.eficiencia_rota}%</p>
                  <p className="text-xs text-green-600">Excelente</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 border rounded">
                <div>
                  <p className="text-sm font-medium">Taxa de Resolução</p>
                  <p className="text-xs text-muted-foreground">Problemas com foto</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold">{dados.problemas_foto.taxa_resolucao}%</p>
                  <p className="text-xs text-green-600">Meta atingida</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 border rounded">
                <div>
                  <p className="text-sm font-medium">Produtividade</p>
                  <p className="text-xs text-muted-foreground">Equipes de campo</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold">{dados.programacao_equipes.produtividade_media}%</p>
                  <p className="text-xs text-green-600">Acima da meta</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="h-5 w-5" />
              Problemas Reportados
            </CardTitle>
            <CardDescription>Protocolos com evidência fotográfica</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Protocolos Abertos</span>
                <Badge variant="outline">{dados.problemas_foto.protocolos_abertos}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Tempo Médio Resolução</span>
                <span className="text-sm font-medium">{dados.problemas_foto.tempo_medio_resolucao} dias</span>
              </div>
              <div className="mt-4">
                <h4 className="text-sm font-medium mb-2">Por Categoria</h4>
                <div className="space-y-1">
                  {dados.problemas_foto.categorias_principais.map((cat, index) => (
                    <div key={index} className="flex items-center justify-between text-xs">
                      <span>{cat.categoria}</span>
                      <span className="font-medium">{cat.quantidade}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Archive className="h-5 w-5" />
              Coleta Especial
            </CardTitle>
            <CardDescription>Resíduos especializados coletados</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Agendamentos</span>
                <Badge className="bg-green-100 text-green-800">{dados.coleta_especial.agendamentos_mes}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Total Coletado</span>
                <span className="text-sm font-medium">{dados.coleta_especial.residuos_coletados}t</span>
              </div>
              <div className="mt-4">
                <h4 className="text-sm font-medium mb-2">Tipos de Resíduos</h4>
                <div className="space-y-1">
                  {dados.coleta_especial.tipos_residuos.map((tipo, index) => (
                    <div key={index} className="flex items-center justify-between text-xs">
                      <span>{tipo.tipo}</span>
                      <div className="flex items-center gap-1">
                        <span>{tipo.quantidade}t</span>
                        <span className="text-muted-foreground">({tipo.percentual}%)</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wrench className="h-5 w-5" />
              Serviços Gerados
            </CardTitle>
            <CardDescription>
              Serviços criados automaticamente para o catálogo público
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {gerarServicosAutomaticos().map((servico, index) => (
                <div key={index} className="border rounded-lg p-3">
                  <h4 className="font-semibold text-sm">{servico.nome}</h4>
                  <p className="text-xs text-muted-foreground mt-1">{servico.descricao}</p>
                  <div className="flex items-center gap-4 mt-2 text-xs">
                    <Badge variant="outline">{servico.categoria}</Badge>
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {servico.prazo}
                    </span>
                    {servico.digital && <Badge className="bg-green-100 text-green-800">Digital</Badge>}
                    {servico.gratuito && <Badge className="bg-blue-100 text-blue-800">Gratuito</Badge>}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Integração Bidirecional</span>
                <Badge className="bg-purple-100 text-purple-800">
                  <Archive className="h-3 w-3 mr-1" />
                  Auto-Sync
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Dados do dashboard geram automaticamente relatórios públicos no catálogo
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className="h-5 w-5" />
              Status de Frota e Equipamentos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Veículos</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Operacionais</span>
                    <span className="font-medium">{dados.programacao_equipes.veiculos_operacionais}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Em Manutenção</span>
                    <span className="font-medium">3</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Eficiência Combustível</span>
                    <span className="font-medium">92%</span>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Custos</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Operacionais</span>
                    <span className="font-medium">R$ {dados.limpeza_publica.custos_operacionais.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Manutenção</span>
                    <span className="font-medium">R$ 45.680</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Economia Energia</span>
                    <span className="font-medium text-green-600">{dados.iluminacao_publica.economia_energia}%</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Indicadores Gerais da Secretaria
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Orçamento Utilizado</span>
                  <span className="text-sm">{calcularPercentualOrcamento().toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${calcularPercentualOrcamento()}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  R$ {dados.indicadores_gerais.orcamento_utilizado.toLocaleString()} de R$ {dados.indicadores_gerais.orcamento_total.toLocaleString()}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">{dados.indicadores_gerais.metas_atingidas}</p>
                  <p className="text-xs text-muted-foreground">de {dados.indicadores_gerais.projetos_em_andamento} metas</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">{dados.indicadores_gerais.indice_satisfacao}</p>
                  <p className="text-xs text-muted-foreground">índice satisfação</p>
                </div>
              </div>

              <div className="pt-4 border-t">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">População Atendida</span>
                  <span className="text-lg font-bold">{dados.indicadores_gerais.populacao_atendida.toLocaleString()}</span>
                </div>
                <p className="text-xs text-muted-foreground">habitantes beneficiados pelos serviços</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Cronograma de Ações
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <h4 className="font-semibold mb-2 text-green-600">Concluído</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Manutenção postes - Centro</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Coleta especial - Vila Nova</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Limpeza bueiros - Industrial</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2 text-yellow-600">Em Andamento</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-yellow-500" />
                  <span>Pavimentação Rua A</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-yellow-500" />
                  <span>Poda árvores - Jardins</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-yellow-500" />
                  <span>Instalação novos postes</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2 text-blue-600">Programado</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-blue-500" />
                  <span>Recapeamento Av. Principal</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-blue-500" />
                  <span>Reforma praça central</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-blue-500" />
                  <span>Ampliação rede iluminação</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}