'use client'

import { useState, useEffect } from 'react'
import { useAdminAuth } from '@/hooks/useAdminAuth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Calendar, MapPin, Users, Target, Clock, Star, TrendingUp, Award, Building, FileText, Megaphone, Camera, Gift, Plus, Search, Filter, Download, Eye, Edit, Trash2, CheckCircle, AlertTriangle, Info } from 'lucide-react'

interface ProgramaTuristico {
  id: string
  codigo_programa: string
  nome_programa: string
  categoria: 'fomento_empresarial' | 'eventos_tematicos' | 'roteiros_municipais' | 'capacitacao_profissional' | 'promocao_destino' | 'turismo_sustentavel' | 'parcerias_estrategicas'
  descricao: string
  status: 'planejamento' | 'em_andamento' | 'executado' | 'avaliacao' | 'finalizado'
  periodo: {
    data_inicio: string
    data_fim: string
    duracao_estimada: number
  }
  publico_alvo: {
    perfil: 'empresarios_locais' | 'profissionais_turismo' | 'visitantes' | 'comunidade_local' | 'agencias_viagem' | 'estudantes'
    quantidade_estimada: number
    criterios_participacao: string[]
  }
  objetivos: {
    objetivo_principal: string
    metas_especificas: string[]
    indicadores_sucesso: Array<{
      indicador: string
      meta_numerica: number
      unidade_medida: string
    }>
  }
  execucao: {
    coordenador_responsavel: string
    equipe_execucao: string[]
    parceiros_envolvidos: string[]
    cronograma_atividades: Array<{
      atividade: string
      data_prevista: string
      responsavel: string
      status: 'pendente' | 'em_andamento' | 'concluida'
    }>
  }
  recursos: {
    orcamento_total: number
    fontes_financiamento: Array<{
      fonte: string
      valor: number
      tipo: 'municipal' | 'estadual' | 'federal' | 'privado' | 'internacional'
    }>
    recursos_materiais: string[]
    recursos_humanos: {
      equipe_interna: number
      consultores_externos: number
      voluntarios: number
    }
  }
  resultados: {
    participantes_efetivos: number
    impacto_economico: {
      receita_gerada: number
      empregos_criados: number
      estabelecimentos_beneficiados: number
    }
    indicadores_qualidade: {
      satisfacao_participantes: number
      alcance_objetivos: number
      sustentabilidade_acoes: number
    }
    produtos_gerados: string[]
  }
  data_cadastro: string
  ultima_atualizacao: string
}

const categorias = [
  { value: 'fomento_empresarial', label: 'Fomento Empresarial', color: 'bg-green-100 text-green-800' },
  { value: 'eventos_tematicos', label: 'Eventos Temáticos', color: 'bg-purple-100 text-purple-800' },
  { value: 'roteiros_municipais', label: 'Roteiros Municipais', color: 'bg-blue-100 text-blue-800' },
  { value: 'capacitacao_profissional', label: 'Capacitação Profissional', color: 'bg-orange-100 text-orange-800' },
  { value: 'promocao_destino', label: 'Promoção do Destino', color: 'bg-pink-100 text-pink-800' },
  { value: 'turismo_sustentavel', label: 'Turismo Sustentável', color: 'bg-emerald-100 text-emerald-800' },
  { value: 'parcerias_estrategicas', label: 'Parcerias Estratégicas', color: 'bg-indigo-100 text-indigo-800' }
]

const statusOptions = [
  { value: 'planejamento', label: 'Planejamento', color: 'bg-gray-100 text-gray-800' },
  { value: 'em_andamento', label: 'Em Andamento', color: 'bg-blue-100 text-blue-800' },
  { value: 'executado', label: 'Executado', color: 'bg-green-100 text-green-800' },
  { value: 'avaliacao', label: 'Avaliação', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'finalizado', label: 'Finalizado', color: 'bg-purple-100 text-purple-800' }
]

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658']

export default function ProgramasTuristicosPage() {
  const { user } = useAdminAuth()
  const [programas, setProgramas] = useState<ProgramaTuristico[]>([])
  const [filteredProgramas, setFilteredProgramas] = useState<ProgramaTuristico[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategoria, setSelectedCategoria] = useState<string>('')
  const [selectedStatus, setSelectedStatus] = useState<string>('')
  const [selectedPrograma, setSelectedPrograma] = useState<ProgramaTuristico | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [currentTab, setCurrentTab] = useState('dashboard')

  const [newPrograma, setNewPrograma] = useState<Partial<ProgramaTuristico>>({
    nome_programa: '',
    categoria: 'fomento_empresarial',
    descricao: '',
    status: 'planejamento',
    periodo: {
      data_inicio: '',
      data_fim: '',
      duracao_estimada: 0
    },
    publico_alvo: {
      perfil: 'empresarios_locais',
      quantidade_estimada: 0,
      criterios_participacao: []
    },
    objetivos: {
      objetivo_principal: '',
      metas_especificas: [],
      indicadores_sucesso: []
    },
    execucao: {
      coordenador_responsavel: '',
      equipe_execucao: [],
      parceiros_envolvidos: [],
      cronograma_atividades: []
    },
    recursos: {
      orcamento_total: 0,
      fontes_financiamento: [],
      recursos_materiais: [],
      recursos_humanos: {
        equipe_interna: 0,
        consultores_externos: 0,
        voluntarios: 0
      }
    },
    resultados: {
      participantes_efetivos: 0,
      impacto_economico: {
        receita_gerada: 0,
        empregos_criados: 0,
        estabelecimentos_beneficiados: 0
      },
      indicadores_qualidade: {
        satisfacao_participantes: 0,
        alcance_objetivos: 0,
        sustentabilidade_acoes: 0
      },
      produtos_gerados: []
    }
  })

  useEffect(() => {
    const mockProgramas: ProgramaTuristico[] = [
      {
        id: '1',
        codigo_programa: 'PT-2024-001',
        nome_programa: 'Rota Gastronômica Municipal',
        categoria: 'roteiros_municipais',
        descricao: 'Desenvolvimento de roteiro gastronômico integrando restaurantes, produtores locais e eventos culinários',
        status: 'em_andamento',
        periodo: {
          data_inicio: '2024-03-01',
          data_fim: '2024-12-31',
          duracao_estimada: 305
        },
        publico_alvo: {
          perfil: 'visitantes',
          quantidade_estimada: 5000,
          criterios_participacao: ['Interesse gastronômico', 'Faixa etária 25-65 anos']
        },
        objetivos: {
          objetivo_principal: 'Valorizar gastronomia local e aumentar permanência de turistas',
          metas_especificas: ['Aumentar receita gastronômica em 30%', 'Capacitar 50 estabelecimentos'],
          indicadores_sucesso: [
            { indicador: 'Visitantes no roteiro', meta_numerica: 5000, unidade_medida: 'pessoas' },
            { indicador: 'Receita gerada', meta_numerica: 500000, unidade_medida: 'reais' }
          ]
        },
        execucao: {
          coordenador_responsavel: 'Ana Silva - Coord. Turismo',
          equipe_execucao: ['João Santos', 'Maria Oliveira', 'Pedro Costa'],
          parceiros_envolvidos: ['SEBRAE', 'SENAC', 'Associação de Restaurantes'],
          cronograma_atividades: [
            { atividade: 'Mapeamento estabelecimentos', data_prevista: '2024-03-15', responsavel: 'João Santos', status: 'concluida' },
            { atividade: 'Capacitação empresários', data_prevista: '2024-06-30', responsavel: 'Maria Oliveira', status: 'em_andamento' },
            { atividade: 'Lançamento roteiro', data_prevista: '2024-09-15', responsavel: 'Ana Silva', status: 'pendente' }
          ]
        },
        recursos: {
          orcamento_total: 150000,
          fontes_financiamento: [
            { fonte: 'Prefeitura Municipal', valor: 100000, tipo: 'municipal' },
            { fonte: 'SEBRAE', valor: 50000, tipo: 'federal' }
          ],
          recursos_materiais: ['Material gráfico', 'Sinalização turística', 'Equipamentos audiovisuais'],
          recursos_humanos: {
            equipe_interna: 4,
            consultores_externos: 2,
            voluntarios: 10
          }
        },
        resultados: {
          participantes_efetivos: 2800,
          impacto_economico: {
            receita_gerada: 320000,
            empregos_criados: 15,
            estabelecimentos_beneficiados: 32
          },
          indicadores_qualidade: {
            satisfacao_participantes: 8.5,
            alcance_objetivos: 75,
            sustentabilidade_acoes: 80
          },
          produtos_gerados: ['Guia gastronômico', 'Aplicativo de roteiros', 'Certificação de qualidade']
        },
        data_cadastro: '2024-02-15',
        ultima_atualizacao: '2024-09-20'
      },
      {
        id: '2',
        codigo_programa: 'PT-2024-002',
        nome_programa: 'Festival de Inverno',
        categoria: 'eventos_tematicos',
        descricao: 'Evento cultural e turístico de inverno com shows, gastronomia e atividades culturais',
        status: 'executado',
        periodo: {
          data_inicio: '2024-07-15',
          data_fim: '2024-07-25',
          duracao_estimada: 10
        },
        publico_alvo: {
          perfil: 'visitantes',
          quantidade_estimada: 15000,
          criterios_participacao: ['Público geral', 'Famílias', 'Turistas culturais']
        },
        objetivos: {
          objetivo_principal: 'Atrair turistas no período de baixa temporada',
          metas_especificas: ['Receber 15.000 visitantes', 'Gerar R$ 2 milhões em receita'],
          indicadores_sucesso: [
            { indicador: 'Público total', meta_numerica: 15000, unidade_medida: 'pessoas' },
            { indicador: 'Taxa ocupação hoteleira', meta_numerica: 85, unidade_medida: 'percentual' }
          ]
        },
        execucao: {
          coordenador_responsavel: 'Carlos Mendes - Dir. Eventos',
          equipe_execucao: ['Lucia Ferreira', 'Roberto Silva', 'Amanda Costa'],
          parceiros_envolvidos: ['Fundação Cultural', 'SESC', 'Hotéis locais'],
          cronograma_atividades: [
            { atividade: 'Contratação artistas', data_prevista: '2024-05-01', responsavel: 'Carlos Mendes', status: 'concluida' },
            { atividade: 'Montagem estrutura', data_prevista: '2024-07-10', responsavel: 'Roberto Silva', status: 'concluida' },
            { atividade: 'Realização evento', data_prevista: '2024-07-25', responsavel: 'Equipe completa', status: 'concluida' }
          ]
        },
        recursos: {
          orcamento_total: 800000,
          fontes_financiamento: [
            { fonte: 'Secretaria de Turismo', valor: 500000, tipo: 'municipal' },
            { fonte: 'Lei de Incentivo Cultural', valor: 200000, tipo: 'federal' },
            { fonte: 'Patrocínios privados', valor: 100000, tipo: 'privado' }
          ],
          recursos_materiais: ['Palcos', 'Sistema de som', 'Iluminação', 'Segurança'],
          recursos_humanos: {
            equipe_interna: 8,
            consultores_externos: 5,
            voluntarios: 50
          }
        },
        resultados: {
          participantes_efetivos: 18500,
          impacto_economico: {
            receita_gerada: 2800000,
            empregos_criados: 120,
            estabelecimentos_beneficiados: 85
          },
          indicadores_qualidade: {
            satisfacao_participantes: 9.2,
            alcance_objetivos: 95,
            sustentabilidade_acoes: 70
          },
          produtos_gerados: ['Documentário do evento', 'CD com artistas locais', 'Relatório de impacto']
        },
        data_cadastro: '2024-01-10',
        ultima_atualizacao: '2024-08-15'
      }
    ]
    setProgramas(mockProgramas)
    setFilteredProgramas(mockProgramas)
  }, [])

  useEffect(() => {
    let filtered = programas

    if (searchTerm) {
      filtered = filtered.filter(programa =>
        programa.nome_programa.toLowerCase().includes(searchTerm.toLowerCase()) ||
        programa.codigo_programa.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (selectedCategoria) {
      filtered = filtered.filter(programa => programa.categoria === selectedCategoria)
    }

    if (selectedStatus) {
      filtered = filtered.filter(programa => programa.status === selectedStatus)
    }

    setFilteredProgramas(filtered)
  }, [searchTerm, selectedCategoria, selectedStatus, programas])

  const handleAddPrograma = () => {
    const programa: ProgramaTuristico = {
      ...newPrograma as ProgramaTuristico,
      id: Date.now().toString(),
      codigo_programa: `PT-${new Date().getFullYear()}-${String(programas.length + 1).padStart(3, '0')}`,
      data_cadastro: new Date().toISOString().split('T')[0],
      ultima_atualizacao: new Date().toISOString().split('T')[0]
    }

    setProgramas([...programas, programa])
    setNewPrograma({
      nome_programa: '',
      categoria: 'fomento_empresarial',
      descricao: '',
      status: 'planejamento',
      periodo: { data_inicio: '', data_fim: '', duracao_estimada: 0 },
      publico_alvo: { perfil: 'empresarios_locais', quantidade_estimada: 0, criterios_participacao: [] },
      objetivos: { objetivo_principal: '', metas_especificas: [], indicadores_sucesso: [] },
      execucao: { coordenador_responsavel: '', equipe_execucao: [], parceiros_envolvidos: [], cronograma_atividades: [] },
      recursos: { orcamento_total: 0, fontes_financiamento: [], recursos_materiais: [], recursos_humanos: { equipe_interna: 0, consultores_externos: 0, voluntarios: 0 } },
      resultados: { participantes_efetivos: 0, impacto_economico: { receita_gerada: 0, empregos_criados: 0, estabelecimentos_beneficiados: 0 }, indicadores_qualidade: { satisfacao_participantes: 0, alcance_objetivos: 0, sustentabilidade_acoes: 0 }, produtos_gerados: [] }
    })
    setIsDialogOpen(false)
  }

  const handleEditPrograma = (programa: ProgramaTuristico) => {
    setSelectedPrograma(programa)
    setNewPrograma(programa)
    setIsEditing(true)
    setIsDialogOpen(true)
  }

  const handleUpdatePrograma = () => {
    if (selectedPrograma) {
      const updatedProgramas = programas.map(programa =>
        programa.id === selectedPrograma.id
          ? { ...newPrograma as ProgramaTuristico, ultima_atualizacao: new Date().toISOString().split('T')[0] }
          : programa
      )
      setProgramas(updatedProgramas)
      setIsDialogOpen(false)
      setIsEditing(false)
      setSelectedPrograma(null)
    }
  }

  const handleDeletePrograma = (id: string) => {
    setProgramas(programas.filter(programa => programa.id !== id))
  }

  const getCategoriaInfo = (categoria: string) => {
    return categorias.find(cat => cat.value === categoria) || categorias[0]
  }

  const getStatusInfo = (status: string) => {
    return statusOptions.find(opt => opt.value === status) || statusOptions[0]
  }

  const totalOrcamento = programas.reduce((sum, programa) => sum + programa.recursos.orcamento_total, 0)
  const totalParticipantes = programas.reduce((sum, programa) => sum + programa.resultados.participantes_efetivos, 0)
  const totalReceitaGerada = programas.reduce((sum, programa) => sum + programa.resultados.impacto_economico.receita_gerada, 0)

  const programasPorCategoria = categorias.map(categoria => ({
    name: categoria.label,
    value: programas.filter(p => p.categoria === categoria.value).length
  }))

  const programasPorStatus = statusOptions.map(status => ({
    name: status.label,
    value: programas.filter(p => p.status === status.value).length
  }))

  const evolucaoMensal = [
    { mes: 'Jan', programas: 2, orcamento: 300000 },
    { mes: 'Fev', programas: 3, orcamento: 450000 },
    { mes: 'Mar', programas: 4, orcamento: 600000 },
    { mes: 'Abr', programas: 5, orcamento: 750000 },
    { mes: 'Mai', programas: 6, orcamento: 850000 },
    { mes: 'Jun', programas: 7, orcamento: 950000 }
  ]

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Programas Turísticos</h1>
          <p className="text-muted-foreground mt-2">
            Gestão de iniciativas de fomento, eventos temáticos e roteiros municipais
          </p>
        </div>
        <Button onClick={() => { setIsDialogOpen(true); setIsEditing(false) }} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Novo Programa
        </Button>
      </div>

      <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="programas">Programas</TabsTrigger>
          <TabsTrigger value="analises">Análises</TabsTrigger>
          <TabsTrigger value="servicos">Serviços Gerados</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total de Programas</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{programas.length}</div>
                <p className="text-xs text-muted-foreground">
                  +{programas.filter(p => p.status === 'em_andamento').length} em andamento
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Orçamento Total</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalOrcamento)}
                </div>
                <p className="text-xs text-muted-foreground">
                  Investimento total em programas
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Participantes Totais</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalParticipantes.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  Pessoas beneficiadas
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Receita Gerada</CardTitle>
                <Award className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalReceitaGerada)}
                </div>
                <p className="text-xs text-muted-foreground">
                  Impacto econômico total
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Programas por Categoria</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={programasPorCategoria}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {programasPorCategoria.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Status dos Programas</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={programasPorStatus}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Evolução Mensal - Programas e Orçamento</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={evolucaoMensal}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mes" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Area yAxisId="left" type="monotone" dataKey="programas" stackId="1" stroke="#8884d8" fill="#8884d8" name="Programas" />
                  <Area yAxisId="right" type="monotone" dataKey="orcamento" stackId="2" stroke="#82ca9d" fill="#82ca9d" name="Orçamento (R$)" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="programas" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Filtros e Busca</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Buscar por nome ou código do programa..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full"
                  />
                </div>
                <Select value={selectedCategoria} onValueChange={setSelectedCategoria}>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="Filtrar por categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todas as categorias</SelectItem>
                    {categorias.map(categoria => (
                      <SelectItem key={categoria.value} value={categoria.value}>
                        {categoria.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="Filtrar por status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todos os status</SelectItem>
                    {statusOptions.map(status => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button variant="outline" className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Exportar
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6">
            {filteredProgramas.map((programa) => (
              <Card key={programa.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-xl">{programa.nome_programa}</CardTitle>
                        <Badge variant="outline">{programa.codigo_programa}</Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getCategoriaInfo(programa.categoria).color}>
                          {getCategoriaInfo(programa.categoria).label}
                        </Badge>
                        <Badge className={getStatusInfo(programa.status).color}>
                          {getStatusInfo(programa.status).label}
                        </Badge>
                      </div>
                      <CardDescription className="max-w-2xl">
                        {programa.descricao}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedPrograma(programa)
                          setCurrentTab('analises')
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditPrograma(programa)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeletePrograma(programa.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm font-medium flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        Período
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(programa.periodo.data_inicio).toLocaleDateString()} a {new Date(programa.periodo.data_fim).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium flex items-center gap-1">
                        <TrendingUp className="h-4 w-4" />
                        Orçamento
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(programa.recursos.orcamento_total)}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        Participantes
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {programa.resultados.participantes_efetivos.toLocaleString()} pessoas
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium flex items-center gap-1">
                        <Star className="h-4 w-4" />
                        Satisfação
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {programa.resultados.indicadores_qualidade.satisfacao_participantes}/10
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analises" className="space-y-6">
          {selectedPrograma ? (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Análise Detalhada: {selectedPrograma.nome_programa}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="execucao" className="w-full">
                    <TabsList className="grid w-full grid-cols-4">
                      <TabsTrigger value="execucao">Execução</TabsTrigger>
                      <TabsTrigger value="recursos">Recursos</TabsTrigger>
                      <TabsTrigger value="resultados">Resultados</TabsTrigger>
                      <TabsTrigger value="cronograma">Cronograma</TabsTrigger>
                    </TabsList>

                    <TabsContent value="execucao" className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-lg">Objetivos e Metas</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div>
                              <h4 className="font-medium mb-2">Objetivo Principal</h4>
                              <p className="text-sm text-muted-foreground">{selectedPrograma.objetivos.objetivo_principal}</p>
                            </div>
                            <div>
                              <h4 className="font-medium mb-2">Metas Específicas</h4>
                              <ul className="space-y-1">
                                {selectedPrograma.objetivos.metas_especificas.map((meta, index) => (
                                  <li key={index} className="text-sm text-muted-foreground flex items-center gap-2">
                                    <CheckCircle className="h-4 w-4 text-green-500" />
                                    {meta}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardHeader>
                            <CardTitle className="text-lg">Equipe e Parceiros</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div>
                              <h4 className="font-medium mb-2">Coordenador</h4>
                              <p className="text-sm text-muted-foreground">{selectedPrograma.execucao.coordenador_responsavel}</p>
                            </div>
                            <div>
                              <h4 className="font-medium mb-2">Equipe de Execução</h4>
                              <ul className="space-y-1">
                                {selectedPrograma.execucao.equipe_execucao.map((membro, index) => (
                                  <li key={index} className="text-sm text-muted-foreground">{membro}</li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <h4 className="font-medium mb-2">Parceiros</h4>
                              <ul className="space-y-1">
                                {selectedPrograma.execucao.parceiros_envolvidos.map((parceiro, index) => (
                                  <li key={index} className="text-sm text-muted-foreground">{parceiro}</li>
                                ))}
                              </ul>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </TabsContent>

                    <TabsContent value="recursos" className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-lg">Financiamento</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              <div>
                                <h4 className="font-medium mb-2">Orçamento Total</h4>
                                <p className="text-2xl font-bold">
                                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(selectedPrograma.recursos.orcamento_total)}
                                </p>
                              </div>
                              <div>
                                <h4 className="font-medium mb-2">Fontes de Financiamento</h4>
                                <div className="space-y-2">
                                  {selectedPrograma.recursos.fontes_financiamento.map((fonte, index) => (
                                    <div key={index} className="flex justify-between items-center">
                                      <span className="text-sm">{fonte.fonte}</span>
                                      <Badge variant="outline">
                                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(fonte.valor)}
                                      </Badge>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardHeader>
                            <CardTitle className="text-lg">Recursos Humanos</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              <div className="flex justify-between items-center">
                                <span className="text-sm font-medium">Equipe Interna</span>
                                <span className="text-sm">{selectedPrograma.recursos.recursos_humanos.equipe_interna} pessoas</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-sm font-medium">Consultores Externos</span>
                                <span className="text-sm">{selectedPrograma.recursos.recursos_humanos.consultores_externos} pessoas</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-sm font-medium">Voluntários</span>
                                <span className="text-sm">{selectedPrograma.recursos.recursos_humanos.voluntarios} pessoas</span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </TabsContent>

                    <TabsContent value="resultados" className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-lg">Participação</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="text-3xl font-bold mb-2">
                              {selectedPrograma.resultados.participantes_efetivos.toLocaleString()}
                            </div>
                            <p className="text-sm text-muted-foreground">participantes efetivos</p>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardHeader>
                            <CardTitle className="text-lg">Impacto Econômico</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-2">
                            <div>
                              <p className="text-sm font-medium">Receita Gerada</p>
                              <p className="text-lg font-bold">
                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(selectedPrograma.resultados.impacto_economico.receita_gerada)}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm font-medium">Empregos Criados</p>
                              <p className="text-lg font-bold">{selectedPrograma.resultados.impacto_economico.empregos_criados}</p>
                            </div>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardHeader>
                            <CardTitle className="text-lg">Qualidade</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-2">
                            <div>
                              <p className="text-sm font-medium">Satisfação</p>
                              <p className="text-lg font-bold">{selectedPrograma.resultados.indicadores_qualidade.satisfacao_participantes}/10</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium">Alcance de Objetivos</p>
                              <p className="text-lg font-bold">{selectedPrograma.resultados.indicadores_qualidade.alcance_objetivos}%</p>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </TabsContent>

                    <TabsContent value="cronograma" className="space-y-4">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Cronograma de Atividades</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {selectedPrograma.execucao.cronograma_atividades.map((atividade, index) => (
                              <div key={index} className="flex items-center gap-4 p-4 border rounded-lg">
                                <div className="flex-shrink-0">
                                  {atividade.status === 'concluida' && <CheckCircle className="h-6 w-6 text-green-500" />}
                                  {atividade.status === 'em_andamento' && <Clock className="h-6 w-6 text-blue-500" />}
                                  {atividade.status === 'pendente' && <AlertTriangle className="h-6 w-6 text-yellow-500" />}
                                </div>
                                <div className="flex-1">
                                  <h4 className="font-medium">{atividade.atividade}</h4>
                                  <p className="text-sm text-muted-foreground">
                                    {atividade.responsavel} • {new Date(atividade.data_prevista).toLocaleDateString()}
                                  </p>
                                </div>
                                <Badge className={
                                  atividade.status === 'concluida' ? 'bg-green-100 text-green-800' :
                                  atividade.status === 'em_andamento' ? 'bg-blue-100 text-blue-800' :
                                  'bg-yellow-100 text-yellow-800'
                                }>
                                  {atividade.status === 'concluida' ? 'Concluída' :
                                   atividade.status === 'em_andamento' ? 'Em Andamento' : 'Pendente'}
                                </Badge>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <Info className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Selecione um programa</h3>
                <p className="text-muted-foreground">
                  Escolha um programa na aba "Programas" para ver sua análise detalhada
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="servicos" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Serviços Públicos Gerados Automaticamente
              </CardTitle>
              <CardDescription>
                Os programas turísticos geram automaticamente serviços específicos para o catálogo público
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <div className="border rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Gift className="h-5 w-5 text-green-600" />
                    Participação em Programa Turístico
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Inscrição e participação em programas de fomento ao turismo, eventos e roteiros municipais
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">Requer Agendamento</Badge>
                      <Badge variant="outline">Documentação Específica</Badge>
                      <Badge variant="outline">Critérios de Participação</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      <strong>Documentos necessários:</strong> RG, CPF, comprovante de residência, certificações específicas (quando aplicável)
                    </p>
                    <p className="text-sm text-muted-foreground">
                      <strong>Prazo:</strong> Conforme cronograma do programa
                    </p>
                  </div>
                </div>

                <div className="border rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Camera className="h-5 w-5 text-blue-600" />
                    Evento Turístico
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Participação em eventos temáticos e culturais promovidos pela secretaria de turismo
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">Inscrição Online</Badge>
                      <Badge variant="outline">Gratuito ou Pago</Badge>
                      <Badge variant="outline">Certificado de Participação</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      <strong>Como participar:</strong> Inscrição através do portal oficial, apresentação de documento no local
                    </p>
                    <p className="text-sm text-muted-foreground">
                      <strong>Benefícios:</strong> Acesso a atividades culturais, networking, certificado de participação
                    </p>
                  </div>
                </div>

                <div className="border rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Users className="h-5 w-5 text-orange-600" />
                    Capacitação em Turismo
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Cursos e treinamentos para profissionais do setor turístico e interessados
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">Vagas Limitadas</Badge>
                      <Badge variant="outline">Certificação</Badge>
                      <Badge variant="outline">Acompanhamento Pós-Curso</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      <strong>Modalidades:</strong> Presencial, online ou híbrido
                    </p>
                    <p className="text-sm text-muted-foreground">
                      <strong>Temas:</strong> Atendimento ao turista, gestão de estabelecimentos, marketing turístico, sustentabilidade
                    </p>
                  </div>
                </div>

                <div className="border rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-purple-600" />
                    Fomento Turístico
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Apoio técnico e financeiro para desenvolvimento de iniciativas turísticas
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">Análise de Projeto</Badge>
                      <Badge variant="outline">Apoio Técnico</Badge>
                      <Badge variant="outline">Acompanhamento</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      <strong>Tipos de apoio:</strong> Consultoria técnica, auxílio na elaboração de projetos, conexão com parceiros
                    </p>
                    <p className="text-sm text-muted-foreground">
                      <strong>Critérios:</strong> Viabilidade técnica, impacto no turismo local, sustentabilidade
                    </p>
                  </div>
                </div>

                <div className="border rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-green-600" />
                    Roteiro Turístico Municipal
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Acesso a roteiros organizados e informações turísticas da cidade
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">Guia Digital</Badge>
                      <Badge variant="outline">Mapa Interativo</Badge>
                      <Badge variant="outline">Informações Atualizadas</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      <strong>Disponível:</strong> Portal online, aplicativo móvel, pontos de informação turística
                    </p>
                    <p className="text-sm text-muted-foreground">
                      <strong>Inclui:</strong> Pontos turísticos, gastronomia, hospedagem, transporte, acessibilidade
                    </p>
                  </div>
                </div>

                <div className="border rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Megaphone className="h-5 w-5 text-red-600" />
                    Divulgação de Evento Turístico
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Suporte para divulgação de eventos e iniciativas turísticas locais
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">Análise de Proposta</Badge>
                      <Badge variant="outline">Canais Oficiais</Badge>
                      <Badge variant="outline">Apoio de Marketing</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      <strong>Canais:</strong> Site oficial, redes sociais, material impresso, parcerias de mídia
                    </p>
                    <p className="text-sm text-muted-foreground">
                      <strong>Requisitos:</strong> Alinhamento com objetivos municipais, qualidade da proposta, interesse público
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {isEditing ? 'Editar Programa Turístico' : 'Novo Programa Turístico'}
            </DialogTitle>
            <DialogDescription>
              {isEditing ? 'Modifique as informações do programa turístico' : 'Cadastre um novo programa de fomento, evento ou roteiro turístico'}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Nome do Programa</label>
                <Input
                  value={newPrograma.nome_programa}
                  onChange={(e) => setNewPrograma(prev => ({ ...prev, nome_programa: e.target.value }))}
                  placeholder="Ex: Festival de Inverno 2024"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Categoria</label>
                <Select
                  value={newPrograma.categoria}
                  onValueChange={(value) => setNewPrograma(prev => ({ ...prev, categoria: value as any }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categorias.map(categoria => (
                      <SelectItem key={categoria.value} value={categoria.value}>
                        {categoria.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Descrição</label>
              <Textarea
                value={newPrograma.descricao}
                onChange={(e) => setNewPrograma(prev => ({ ...prev, descricao: e.target.value }))}
                placeholder="Descrição detalhada do programa..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <Select
                  value={newPrograma.status}
                  onValueChange={(value) => setNewPrograma(prev => ({ ...prev, status: value as any }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map(status => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Data de Início</label>
                <Input
                  type="date"
                  value={newPrograma.periodo?.data_inicio}
                  onChange={(e) => setNewPrograma(prev => ({
                    ...prev,
                    periodo: { ...prev.periodo!, data_inicio: e.target.value }
                  }))}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Data de Fim</label>
                <Input
                  type="date"
                  value={newPrograma.periodo?.data_fim}
                  onChange={(e) => setNewPrograma(prev => ({
                    ...prev,
                    periodo: { ...prev.periodo!, data_fim: e.target.value }
                  }))}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Orçamento Total (R$)</label>
                <Input
                  type="number"
                  value={newPrograma.recursos?.orcamento_total}
                  onChange={(e) => setNewPrograma(prev => ({
                    ...prev,
                    recursos: { ...prev.recursos!, orcamento_total: Number(e.target.value) }
                  }))}
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Coordenador Responsável</label>
                <Input
                  value={newPrograma.execucao?.coordenador_responsavel}
                  onChange={(e) => setNewPrograma(prev => ({
                    ...prev,
                    execucao: { ...prev.execucao!, coordenador_responsavel: e.target.value }
                  }))}
                  placeholder="Nome do coordenador"
                />
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={isEditing ? handleUpdatePrograma : handleAddPrograma}>
                {isEditing ? 'Atualizar' : 'Cadastrar'} Programa
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}