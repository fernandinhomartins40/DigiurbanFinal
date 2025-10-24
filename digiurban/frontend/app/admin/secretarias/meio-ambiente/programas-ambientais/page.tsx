'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area } from 'recharts'
import { useAdminAuth } from '@/hooks/useAdminAuth'
import { Plus, Search, Filter, Download, Eye, Edit, Recycle, TreePine, Droplets, Sun, Leaf, Users, Calendar, TrendingUp, Target, Award, MapPin, Clock } from 'lucide-react'

interface ProgramaAmbiental {
  id: string
  codigo: string
  nome: string
  tipo: 'reciclagem' | 'reflorestamento' | 'coleta_seletiva' | 'compostagem' | 'energia_renovavel' | 'educacao_ambiental' | 'preservacao_agua' | 'reducao_carbono'
  categoria: 'sustentabilidade' | 'preservacao' | 'educacao' | 'energia' | 'residuos'
  descricao: string
  objetivos: string[]
  publico_alvo: 'geral' | 'escolas' | 'empresas' | 'condomínios' | 'agricultores' | 'comerciantes'
  status: 'ativo' | 'em_planejamento' | 'suspenso' | 'concluido' | 'cancelado'
  data_inicio: string
  data_fim?: string
  duracao_prevista: number
  coordenador: string
  equipe: string[]
  orcamento: {
    total: number
    origem: 'recursos_proprios' | 'convenio_estadual' | 'convenio_federal' | 'parcerias' | 'ongs'
    executado: number
  }
  metas: {
    indicador: string
    valor_meta: number
    unidade: string
    valor_atual: number
    prazo: string
  }[]
  participantes: {
    total_inscritos: number
    ativos: number
    concluintes: number
    instituicoes_parceiras: number
  }
  localizacao: {
    abrangencia: 'municipal' | 'bairro_especifico' | 'zona_rural' | 'zona_urbana'
    areas_atendidas: string[]
    pontos_distribuicao?: string[]
  }
  beneficios_ambientais: {
    reducao_co2: number
    arvores_plantadas: number
    residuos_reciclados: number
    agua_economizada: number
    energia_economizada: number
  }
  atividades: {
    nome: string
    tipo: 'capacitacao' | 'distribuicao' | 'coleta' | 'plantio' | 'monitoramento'
    frequencia: string
    participantes_esperados: number
    local: string
    responsavel: string
  }[]
  materiais_fornecidos: string[]
  certificacao: {
    oferece: boolean
    criterios: string[]
    horas_necessarias?: number
  }
  indicadores_impacto: {
    nome: string
    valor: number
    unidade: string
    periodo: string
  }[]
  observacoes: string
}

interface ParticipantePrograma {
  id: string
  programa_id: string
  participante: {
    nome: string
    cpf_cnpj: string
    telefone: string
    email: string
    endereco: string
    tipo: 'pessoa_fisica' | 'pessoa_juridica' | 'instituicao'
  }
  data_inscricao: string
  status: 'inscrito' | 'ativo' | 'inativo' | 'concluido' | 'desistente'
  atividades_participadas: string[]
  certificado_emitido: boolean
  observacoes: string
}

interface ServicoGerado {
  id: string
  nome: string
  descricao: string
  tipo: 'programa_reciclagem' | 'plantio_mudas' | 'coleta_seletiva' | 'compostagem' | 'energia_renovavel'
  categoria: 'programa' | 'capacitacao' | 'distribuicao' | 'incentivo'
  protocolo_base: string
  ativo: boolean
}

export default function ProgramasAmbientais() {
  const { user } = useAdminAuth()
  const [filtroStatus, setFiltroStatus] = useState<string>('todos')
  const [filtroTipo, setFiltroTipo] = useState<string>('todos')
  const [filtroCategoria, setFiltroCategoria] = useState<string>('todos')
  const [busca, setBusca] = useState('')
  const [novoPrograma, setNovoPrograma] = useState<Partial<ProgramaAmbiental>>({})
  const [showNovoPrograma, setShowNovoPrograma] = useState(false)

  const programas: ProgramaAmbiental[] = [
    {
      id: '1',
      codigo: 'PA-001',
      nome: 'Programa Municipal de Reciclagem',
      tipo: 'reciclagem',
      categoria: 'residuos',
      descricao: 'Programa de incentivo à reciclagem doméstica e separação de resíduos sólidos',
      objetivos: [
        'Reduzir a quantidade de resíduos enviados ao aterro',
        'Conscientizar a população sobre reciclagem',
        'Criar uma rede de pontos de coleta seletiva',
        'Gerar renda através da reciclagem'
      ],
      publico_alvo: 'geral',
      status: 'ativo',
      data_inicio: '2023-03-15',
      duracao_prevista: 24,
      coordenador: 'Maria Silva',
      equipe: ['João Santos', 'Ana Costa', 'Pedro Lima'],
      orcamento: {
        total: 150000,
        origem: 'recursos_proprios',
        executado: 89000
      },
      metas: [
        {
          indicador: 'Pontos de coleta instalados',
          valor_meta: 50,
          unidade: 'unidades',
          valor_atual: 32,
          prazo: '2024-12-31'
        },
        {
          indicador: 'Famílias participantes',
          valor_meta: 2000,
          unidade: 'famílias',
          valor_atual: 1250,
          prazo: '2024-12-31'
        },
        {
          indicador: 'Resíduos reciclados',
          valor_meta: 100,
          unidade: 'toneladas/mês',
          valor_atual: 65,
          prazo: '2024-12-31'
        }
      ],
      participantes: {
        total_inscritos: 1250,
        ativos: 980,
        concluintes: 0,
        instituicoes_parceiras: 8
      },
      localizacao: {
        abrangencia: 'municipal',
        areas_atendidas: ['Centro', 'Vila Nova', 'Jardim das Flores', 'São José'],
        pontos_distribuicao: ['Centro Comunitário', 'Praça Central', 'Escola Municipal', 'UBS Norte']
      },
      beneficios_ambientais: {
        reducao_co2: 45,
        arvores_plantadas: 0,
        residuos_reciclados: 650,
        agua_economizada: 0,
        energia_economizada: 0
      },
      atividades: [
        {
          nome: 'Capacitação em Reciclagem',
          tipo: 'capacitacao',
          frequencia: 'Mensal',
          participantes_esperados: 50,
          local: 'Centro Comunitário',
          responsavel: 'João Santos'
        },
        {
          nome: 'Distribuição de Lixeiras',
          tipo: 'distribuicao',
          frequencia: 'Trimestral',
          participantes_esperados: 200,
          local: 'Pontos de distribuição',
          responsavel: 'Ana Costa'
        }
      ],
      materiais_fornecidos: ['Lixeiras seletivas', 'Material educativo', 'Sacolas retornáveis'],
      certificacao: {
        oferece: true,
        criterios: ['Participação em 80% das atividades', 'Implementação da separação em casa'],
        horas_necessarias: 20
      },
      indicadores_impacto: [
        { nome: 'Resíduos desviados do aterro', valor: 650, unidade: 'toneladas', periodo: 'Últimos 12 meses' },
        { nome: 'Redução de custos municipais', valor: 25000, unidade: 'reais', periodo: 'Últimos 12 meses' }
      ],
      observacoes: 'Programa com alta adesão da população'
    },
    {
      id: '2',
      codigo: 'PA-002',
      nome: 'Reflorestamento Urbano',
      tipo: 'reflorestamento',
      categoria: 'preservacao',
      descricao: 'Programa de plantio de árvores nativas em áreas urbanas e recuperação de áreas verdes',
      objetivos: [
        'Aumentar a cobertura arbórea urbana',
        'Melhorar a qualidade do ar',
        'Reduzir ilhas de calor',
        'Preservar espécies nativas'
      ],
      publico_alvo: 'escolas',
      status: 'ativo',
      data_inicio: '2023-08-20',
      duracao_prevista: 36,
      coordenador: 'Carlos Oliveira',
      equipe: ['Mariana Santos', 'Roberto Silva', 'Fernanda Costa'],
      orcamento: {
        total: 200000,
        origem: 'convenio_estadual',
        executado: 120000
      },
      metas: [
        {
          indicador: 'Árvores plantadas',
          valor_meta: 5000,
          unidade: 'mudas',
          valor_atual: 3200,
          prazo: '2025-08-20'
        },
        {
          indicador: 'Áreas recuperadas',
          valor_meta: 15,
          unidade: 'hectares',
          valor_atual: 9,
          prazo: '2025-08-20'
        },
        {
          indicador: 'Escolas participantes',
          valor_meta: 20,
          unidade: 'escolas',
          valor_atual: 14,
          prazo: '2025-08-20'
        }
      ],
      participantes: {
        total_inscritos: 850,
        ativos: 650,
        concluintes: 200,
        instituicoes_parceiras: 14
      },
      localizacao: {
        abrangencia: 'municipal',
        areas_atendidas: ['Parques urbanos', 'Praças públicas', 'Escolas', 'Margem de córregos'],
        pontos_distribuicao: ['Viveiro Municipal', 'Secretaria do Meio Ambiente']
      },
      beneficios_ambientais: {
        reducao_co2: 128,
        arvores_plantadas: 3200,
        residuos_reciclados: 0,
        agua_economizada: 0,
        energia_economizada: 0
      },
      atividades: [
        {
          nome: 'Plantio Comunitário',
          tipo: 'plantio',
          frequencia: 'Mensal',
          participantes_esperados: 80,
          local: 'Diversos pontos da cidade',
          responsavel: 'Roberto Silva'
        },
        {
          nome: 'Curso de Jardinagem',
          tipo: 'capacitacao',
          frequencia: 'Bimestral',
          participantes_esperados: 30,
          local: 'Viveiro Municipal',
          responsavel: 'Fernanda Costa'
        }
      ],
      materiais_fornecidos: ['Mudas nativas', 'Ferramentas de plantio', 'Adubo orgânico', 'Manual de plantio'],
      certificacao: {
        oferece: true,
        criterios: ['Plantio de pelo menos 10 mudas', 'Participação em curso de jardinagem'],
        horas_necessarias: 16
      },
      indicadores_impacto: [
        { nome: 'CO2 absorvido anualmente', valor: 128, unidade: 'toneladas', periodo: 'Projeção anual' },
        { nome: 'Temperatura reduzida', valor: 1.5, unidade: 'graus celsius', periodo: 'Média nas áreas plantadas' }
      ],
      observacoes: 'Parceria com escolas municipais tem sido muito exitosa'
    },
    {
      id: '3',
      codigo: 'PA-003',
      nome: 'Energia Solar Residencial',
      tipo: 'energia_renovavel',
      categoria: 'energia',
      descricao: 'Programa de incentivo à instalação de sistemas de energia solar fotovoltaica em residências',
      objetivos: [
        'Promover o uso de energia renovável',
        'Reduzir custos de energia elétrica',
        'Diminuir emissões de carbono',
        'Criar mercado local de energia solar'
      ],
      publico_alvo: 'geral',
      status: 'ativo',
      data_inicio: '2024-01-10',
      duracao_prevista: 18,
      coordenador: 'Paulo Santos',
      equipe: ['Lucia Ferreira', 'Marcos Oliveira'],
      orcamento: {
        total: 300000,
        origem: 'convenio_federal',
        executado: 85000
      },
      metas: [
        {
          indicador: 'Residências com energia solar',
          valor_meta: 100,
          unidade: 'residências',
          valor_atual: 28,
          prazo: '2025-07-10'
        },
        {
          indicador: 'Capacidade instalada',
          valor_meta: 500,
          unidade: 'kWp',
          valor_atual: 140,
          prazo: '2025-07-10'
        }
      ],
      participantes: {
        total_inscritos: 180,
        ativos: 120,
        concluintes: 28,
        instituicoes_parceiras: 3
      },
      localizacao: {
        abrangencia: 'municipal',
        areas_atendidas: ['Zona urbana'],
        pontos_distribuicao: ['Secretaria do Meio Ambiente']
      },
      beneficios_ambientais: {
        reducao_co2: 65,
        arvores_plantadas: 0,
        residuos_reciclados: 0,
        agua_economizada: 0,
        energia_economizada: 168000
      },
      atividades: [
        {
          nome: 'Curso de Energia Solar',
          tipo: 'capacitacao',
          frequencia: 'Bimestral',
          participantes_esperados: 25,
          local: 'Auditório Municipal',
          responsavel: 'Marcos Oliveira'
        }
      ],
      materiais_fornecidos: ['Manual técnico', 'Simulador de economia', 'Lista de fornecedores'],
      certificacao: {
        oferece: false,
        criterios: []
      },
      indicadores_impacto: [
        { nome: 'Energia renovável gerada', valor: 168, unidade: 'MWh/ano', periodo: 'Últimos 12 meses' },
        { nome: 'Economia para as famílias', valor: 120000, unidade: 'reais/ano', periodo: 'Projeção anual' }
      ],
      observacoes: 'Programa com alta procura, fila de espera'
    }
  ]

  const participantes: ParticipantePrograma[] = [
    {
      id: '1',
      programa_id: '1',
      participante: {
        nome: 'Ana Silva',
        cpf_cnpj: '123.456.789-00',
        telefone: '(11) 99999-9999',
        email: 'ana@email.com',
        endereco: 'Rua das Flores, 123 - Centro',
        tipo: 'pessoa_fisica'
      },
      data_inscricao: '2023-04-15',
      status: 'ativo',
      atividades_participadas: ['Capacitação em Reciclagem', 'Distribuição de Lixeiras'],
      certificado_emitido: false,
      observacoes: 'Participante muito engajada'
    }
  ]

  const servicosGerados: ServicoGerado[] = [
    {
      id: '1',
      nome: 'Programa de Reciclagem',
      descricao: 'Inscrição em programas municipais de reciclagem e coleta seletiva',
      tipo: 'programa_reciclagem',
      categoria: 'programa',
      protocolo_base: 'Inscrição → Orientação → Participação → Acompanhamento',
      ativo: true
    },
    {
      id: '2',
      nome: 'Plantio de Mudas',
      descricao: 'Participação em programas de reflorestamento e plantio urbano',
      tipo: 'plantio_mudas',
      categoria: 'programa',
      protocolo_base: 'Inscrição → Orientação → Participação → Acompanhamento',
      ativo: true
    },
    {
      id: '3',
      nome: 'Coleta Seletiva',
      descricao: 'Orientação e materiais para implantação de coleta seletiva',
      tipo: 'coleta_seletiva',
      categoria: 'capacitacao',
      protocolo_base: 'Inscrição → Orientação → Participação → Acompanhamento',
      ativo: true
    },
    {
      id: '4',
      nome: 'Compostagem',
      descricao: 'Capacitação e materiais para compostagem doméstica',
      tipo: 'compostagem',
      categoria: 'capacitacao',
      protocolo_base: 'Inscrição → Orientação → Participação → Acompanhamento',
      ativo: true
    },
    {
      id: '5',
      nome: 'Energia Renovável',
      descricao: 'Incentivos e orientação para energia solar residencial',
      tipo: 'energia_renovavel',
      categoria: 'incentivo',
      protocolo_base: 'Inscrição → Orientação → Participação → Acompanhamento',
      ativo: true
    }
  ]

  const dadosParticipacaoPorMes = [
    { mes: 'Jul', reciclagem: 180, reflorestamento: 95, energia: 25, compostagem: 40 },
    { mes: 'Ago', reciclagem: 220, reflorestamento: 120, energia: 32, compostagem: 55 },
    { mes: 'Set', reciclagem: 280, reflorestamento: 140, energia: 28, compostagem: 70 },
    { mes: 'Out', reciclagem: 320, reflorestamento: 165, energia: 45, compostagem: 85 },
    { mes: 'Nov', reciclagem: 380, reflorestamento: 180, energia: 52, compostagem: 95 },
    { mes: 'Dez', reciclagem: 420, reflorestamento: 200, energia: 48, compostagem: 110 }
  ]

  const dadosImpactoAmbiental = [
    { programa: 'Reciclagem', co2_reduzido: 45, beneficio: 650 },
    { programa: 'Reflorestamento', co2_reduzido: 128, beneficio: 3200 },
    { programa: 'Energia Solar', co2_reduzido: 65, beneficio: 168 },
    { programa: 'Compostagem', co2_reduzido: 22, beneficio: 85 }
  ]

  const dadosOrcamento = [
    { programa: 'Reciclagem', orcado: 150000, executado: 89000 },
    { programa: 'Reflorestamento', orcado: 200000, executado: 120000 },
    { programa: 'Energia Solar', orcado: 300000, executado: 85000 },
    { programa: 'Compostagem', orcado: 80000, executado: 45000 }
  ]

  const getStatusBadge = (status: string) => {
    const variants = {
      'ativo': 'bg-green-100 text-green-800',
      'em_planejamento': 'bg-blue-100 text-blue-800',
      'suspenso': 'bg-yellow-100 text-yellow-800',
      'concluido': 'bg-gray-100 text-gray-800',
      'cancelado': 'bg-red-100 text-red-800'
    }
    return variants[status as keyof typeof variants] || 'bg-gray-100 text-gray-800'
  }

  const calcularProgresso = (valorAtual: number, valorMeta: number) => {
    return Math.min((valorAtual / valorMeta) * 100, 100)
  }

  const filtrarProgramas = programas.filter(programa => {
    const matchStatus = filtroStatus === 'todos' || programa.status === filtroStatus
    const matchTipo = filtroTipo === 'todos' || programa.tipo === filtroTipo
    const matchCategoria = filtroCategoria === 'todos' || programa.categoria === filtroCategoria
    const matchBusca = busca === '' ||
      programa.nome.toLowerCase().includes(busca.toLowerCase()) ||
      programa.codigo.toLowerCase().includes(busca.toLowerCase()) ||
      programa.descricao.toLowerCase().includes(busca.toLowerCase())

    return matchStatus && matchTipo && matchCategoria && matchBusca
  })

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Programas Ambientais</h1>
          <p className="text-gray-600 mt-1">Iniciativas municipais de sustentabilidade e preservação</p>
        </div>
        <div className="flex gap-3">
          <Dialog open={showNovoPrograma} onOpenChange={setShowNovoPrograma}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Novo Programa
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Novo Programa Ambiental</DialogTitle>
                <DialogDescription>
                  Criar nova iniciativa de sustentabilidade municipal
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Nome do Programa</label>
                  <Input placeholder="Nome da iniciativa ambiental" />
                </div>
                <div>
                  <label className="text-sm font-medium">Código</label>
                  <Input placeholder="Ex: PA-001" />
                </div>
                <div>
                  <label className="text-sm font-medium">Tipo</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecionar tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="reciclagem">Reciclagem</SelectItem>
                      <SelectItem value="reflorestamento">Reflorestamento</SelectItem>
                      <SelectItem value="energia_renovavel">Energia Renovável</SelectItem>
                      <SelectItem value="compostagem">Compostagem</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Público Alvo</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecionar público" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="geral">Público geral</SelectItem>
                      <SelectItem value="escolas">Escolas</SelectItem>
                      <SelectItem value="empresas">Empresas</SelectItem>
                      <SelectItem value="condomínios">Condomínios</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-2">
                  <label className="text-sm font-medium">Descrição</label>
                  <Textarea placeholder="Descrição detalhada do programa" />
                </div>
                <div>
                  <label className="text-sm font-medium">Data de Início</label>
                  <Input type="date" />
                </div>
                <div>
                  <label className="text-sm font-medium">Duração (meses)</label>
                  <Input type="number" placeholder="Duração em meses" />
                </div>
                <div>
                  <label className="text-sm font-medium">Coordenador</label>
                  <Input placeholder="Nome do coordenador" />
                </div>
                <div>
                  <label className="text-sm font-medium">Orçamento Total</label>
                  <Input type="number" placeholder="Valor em reais" />
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <Button className="flex-1">Criar Programa</Button>
                <Button variant="outline" onClick={() => setShowNovoPrograma(false)}>
                  Cancelar
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Relatório
          </Button>
        </div>
      </div>

      <Tabs defaultValue="programas" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="programas">Programas</TabsTrigger>
          <TabsTrigger value="participantes">Participantes</TabsTrigger>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="servicos">Serviços Gerados</TabsTrigger>
          <TabsTrigger value="relatorios">Relatórios</TabsTrigger>
        </TabsList>

        <TabsContent value="programas" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Lista de Programas Ambientais</CardTitle>
                <div className="flex gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Buscar por nome, código ou descrição..."
                      value={busca}
                      onChange={(e) => setBusca(e.target.value)}
                      className="pl-10 w-80"
                    />
                  </div>
                  <Select value={filtroStatus} onValueChange={setFiltroStatus}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos</SelectItem>
                      <SelectItem value="ativo">Ativo</SelectItem>
                      <SelectItem value="em_planejamento">Em Planejamento</SelectItem>
                      <SelectItem value="concluido">Concluído</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={filtroTipo} onValueChange={setFiltroTipo}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos os tipos</SelectItem>
                      <SelectItem value="reciclagem">Reciclagem</SelectItem>
                      <SelectItem value="reflorestamento">Reflorestamento</SelectItem>
                      <SelectItem value="energia_renovavel">Energia Renovável</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filtrarProgramas.map((programa) => (
                  <Card key={programa.id} className="border-l-4 border-l-green-500">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-medium text-lg">{programa.nome}</h3>
                            <Badge className="text-xs">{programa.codigo}</Badge>
                            <Badge variant="outline" className="capitalize">
                              {programa.tipo.replace('_', ' ')}
                            </Badge>
                          </div>
                          <p className="text-gray-600 mb-1">Coordenador: {programa.coordenador}</p>
                          <p className="text-sm text-gray-500 mb-3">{programa.descricao}</p>
                        </div>
                        <div className="flex gap-2">
                          <Badge className={getStatusBadge(programa.status)}>
                            {programa.status.replace('_', ' ')}
                          </Badge>
                          <Badge variant="outline" className="capitalize">
                            {programa.categoria}
                          </Badge>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                        <div>
                          <span className="text-gray-600">Público Alvo:</span>
                          <p className="font-medium capitalize">{programa.publico_alvo}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Participantes:</span>
                          <p className="font-medium">{programa.participantes.ativos} ativos</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Orçamento:</span>
                          <p className="font-medium">R$ {programa.orcamento.total.toLocaleString()}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Duração:</span>
                          <p className="font-medium">{programa.duracao_prevista} meses</p>
                        </div>
                      </div>

                      <div className="mb-4">
                        <p className="text-sm text-gray-600 mb-2">Objetivos:</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {programa.objetivos.map((objetivo, index) => (
                            <div key={index} className="flex items-start gap-2">
                              <Target className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                              <span className="text-sm">{objetivo}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="mb-4">
                        <p className="text-sm text-gray-600 mb-2">Progresso das Metas:</p>
                        <div className="space-y-2">
                          {programa.metas.map((meta, index) => (
                            <div key={index} className="space-y-1">
                              <div className="flex justify-between text-sm">
                                <span>{meta.indicador}</span>
                                <span className="font-medium">{meta.valor_atual}/{meta.valor_meta} {meta.unidade}</span>
                              </div>
                              <Progress
                                value={calcularProgresso(meta.valor_atual, meta.valor_meta)}
                                className="h-2"
                              />
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="mb-4">
                        <p className="text-sm text-gray-600 mb-2">Benefícios Ambientais:</p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          {programa.beneficios_ambientais.reducao_co2 > 0 && (
                            <div className="flex items-center gap-2">
                              <Leaf className="h-4 w-4 text-green-600" />
                              <span>{programa.beneficios_ambientais.reducao_co2} ton CO₂ reduzido</span>
                            </div>
                          )}
                          {programa.beneficios_ambientais.arvores_plantadas > 0 && (
                            <div className="flex items-center gap-2">
                              <TreePine className="h-4 w-4 text-green-600" />
                              <span>{programa.beneficios_ambientais.arvores_plantadas} árvores plantadas</span>
                            </div>
                          )}
                          {programa.beneficios_ambientais.residuos_reciclados > 0 && (
                            <div className="flex items-center gap-2">
                              <Recycle className="h-4 w-4 text-blue-600" />
                              <span>{programa.beneficios_ambientais.residuos_reciclados} ton reciclados</span>
                            </div>
                          )}
                          {programa.beneficios_ambientais.energia_economizada > 0 && (
                            <div className="flex items-center gap-2">
                              <Sun className="h-4 w-4 text-yellow-600" />
                              <span>{programa.beneficios_ambientais.energia_economizada} kWh economizados</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {programa.atividades.length > 0 && (
                        <div className="mb-4">
                          <p className="text-sm text-gray-600 mb-2">Atividades:</p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {programa.atividades.map((atividade, index) => (
                              <div key={index} className="p-2 bg-green-50 rounded">
                                <p className="font-medium text-sm">{atividade.nome}</p>
                                <p className="text-xs text-gray-600">{atividade.frequencia} - {atividade.local}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                        <h4 className="font-medium text-sm text-blue-900 mb-2">Execução Orçamentária</h4>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-blue-700">Total:</span>
                            <p className="font-medium">R$ {programa.orcamento.total.toLocaleString()}</p>
                          </div>
                          <div>
                            <span className="text-blue-700">Executado:</span>
                            <p className="font-medium">R$ {programa.orcamento.executado.toLocaleString()}</p>
                          </div>
                          <div>
                            <span className="text-blue-700">Origem:</span>
                            <p className="font-medium capitalize">{programa.orcamento.origem.replace('_', ' ')}</p>
                          </div>
                        </div>
                        <div className="mt-2">
                          <Progress
                            value={(programa.orcamento.executado / programa.orcamento.total) * 100}
                            className="h-2"
                          />
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-4">
                          <Badge variant="outline">
                            {programa.participantes.instituicoes_parceiras} parceiros
                          </Badge>
                          {programa.certificacao.oferece && (
                            <Badge variant="outline" className="text-xs">
                              <Award className="h-3 w-3 mr-1" />
                              Certificação
                            </Badge>
                          )}
                          <span className="text-sm text-gray-600">{programa.observacoes}</span>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-2" />
                            Detalhes
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4 mr-2" />
                            Editar
                          </Button>
                          <Button variant="outline" size="sm">
                            <Users className="h-4 w-4 mr-2" />
                            Participantes
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="participantes" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Participantes dos Programas</CardTitle>
              <CardDescription>Gestão de inscrições e acompanhamento de participantes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {participantes.map((participante) => {
                  const programa = programas.find(p => p.id === participante.programa_id)
                  return (
                    <Card key={participante.id} className="border-l-4 border-l-blue-500">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="font-medium text-lg">{participante.participante.nome}</h3>
                            <p className="text-gray-600">{programa?.nome}</p>
                            <p className="text-sm text-gray-500">{participante.participante.cpf_cnpj}</p>
                          </div>
                          <Badge className={participante.status === 'ativo' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                            {participante.status}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">Inscrição:</span>
                            <p className="font-medium">{new Date(participante.data_inscricao).toLocaleDateString('pt-BR')}</p>
                          </div>
                          <div>
                            <span className="text-gray-600">Atividades:</span>
                            <p className="font-medium">{participante.atividades_participadas.length}</p>
                          </div>
                          <div>
                            <span className="text-gray-600">Certificado:</span>
                            <p className="font-medium">{participante.certificado_emitido ? 'Emitido' : 'Pendente'}</p>
                          </div>
                          <div>
                            <span className="text-gray-600">Tipo:</span>
                            <p className="font-medium capitalize">{participante.participante.tipo.replace('_', ' ')}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Programas Ativos</CardTitle>
                <Leaf className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground">+3 desde o ano passado</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Participantes Ativos</CardTitle>
                <Users className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1.750</div>
                <p className="text-xs text-muted-foreground">+28% desde o mês passado</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">CO₂ Reduzido</CardTitle>
                <TreePine className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">260 ton</div>
                <p className="text-xs text-muted-foreground">Últimos 12 meses</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Investimento Total</CardTitle>
                <TrendingUp className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">R$ 730k</div>
                <p className="text-xs text-muted-foreground">Orçamento atual</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Participação por Programa</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={dadosParticipacaoPorMes}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mes" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="reciclagem" stackId="1" stroke="#8884d8" fill="#8884d8" />
                    <Area type="monotone" dataKey="reflorestamento" stackId="1" stroke="#82ca9d" fill="#82ca9d" />
                    <Area type="monotone" dataKey="energia" stackId="1" stroke="#ffc658" fill="#ffc658" />
                    <Area type="monotone" dataKey="compostagem" stackId="1" stroke="#ff7300" fill="#ff7300" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Impacto Ambiental</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={dadosImpactoAmbiental}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="programa" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="co2_reduzido" name="CO₂ Reduzido (ton)" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Execução Orçamentária</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={dadosOrcamento}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="programa" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="orcado" name="Orçado" fill="#8884d8" />
                    <Bar dataKey="executado" name="Executado" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Evolução da Participação</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={dadosParticipacaoPorMes}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mes" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="reciclagem" stroke="#8884d8" strokeWidth={2} />
                    <Line type="monotone" dataKey="reflorestamento" stroke="#82ca9d" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="servicos" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Leaf className="h-5 w-5 text-green-600" />
                Serviços Gerados Automaticamente
              </CardTitle>
              <CardDescription>
                Serviços do catálogo público gerados pelas funcionalidades internas dos programas ambientais
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {servicosGerados.map((servico) => (
                  <Card key={servico.id} className="border-l-4 border-l-green-500">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-base">{servico.nome}</CardTitle>
                        <Badge className={servico.ativo ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                          {servico.ativo ? 'Ativo' : 'Inativo'}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-sm text-gray-600 mb-3">{servico.descricao}</p>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Categoria:</span>
                          <Badge variant="outline" className="capitalize">
                            {servico.categoria}
                          </Badge>
                        </div>
                        <div className="text-sm">
                          <span className="text-gray-600">Protocolo:</span>
                          <p className="text-xs mt-1 text-gray-500">{servico.protocolo_base}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Integração Bidirecional</CardTitle>
              <CardDescription>
                Como os programas ambientais geram automaticamente serviços para o catálogo público
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
                  <h4 className="font-medium text-green-900 mb-2">Programas Ambientais → Serviços Públicos</h4>
                  <ul className="text-sm text-green-800 space-y-1">
                    <li>• <strong>Programa de Reciclagem:</strong> Inscrição em programas de coleta seletiva</li>
                    <li>• <strong>Plantio de Mudas:</strong> Participação em reflorestamento urbano</li>
                    <li>• <strong>Coleta Seletiva:</strong> Orientação e materiais para separação de resíduos</li>
                    <li>• <strong>Compostagem:</strong> Capacitação para compostagem doméstica</li>
                    <li>• <strong>Energia Renovável:</strong> Incentivos para energia solar residencial</li>
                  </ul>
                </div>

                <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                  <h4 className="font-medium text-blue-900 mb-2">Fluxo de Protocolos</h4>
                  <p className="text-sm text-blue-800">
                    Cidadão se inscreve em "Programa de Reciclagem" → Protocolo criado → Orientação inicial →
                    Participação nas atividades → Acompanhamento → Certificação
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="relatorios" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Relatório de Programas</CardTitle>
                <CardDescription>Dados consolidados dos programas ambientais</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Gerar Relatório
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Relatório de Impacto</CardTitle>
                <CardDescription>Benefícios ambientais alcançados</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Gerar Relatório
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Relatório Financeiro</CardTitle>
                <CardDescription>Execução orçamentária dos programas</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Gerar Relatório
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}