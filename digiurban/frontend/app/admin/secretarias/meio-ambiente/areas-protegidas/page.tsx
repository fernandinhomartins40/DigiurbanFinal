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
import { Plus, Search, Filter, Download, Eye, Edit, TreePine, MapPin, Camera, Users, Calendar, Clock, Shield, Leaf, Mountain, Bird, Fish, BookOpen, Route } from 'lucide-react'

interface AreaProtegida {
  id: string
  codigo: string
  nome: string
  tipo: 'parque_municipal' | 'reserva_ecologica' | 'area_preservacao_permanente' | 'reserva_particular' | 'jardim_botanico' | 'estacao_ecologica' | 'monumento_natural'
  categoria: 'protecao_integral' | 'uso_sustentavel' | 'preservacao_permanente'
  localizacao: {
    endereco: string
    coordenadas: string
    bairro: string
    zona: 'urbana' | 'rural' | 'periurbana'
  }
  area_total: number
  bioma: 'mata_atlantica' | 'cerrado' | 'caatinga' | 'pantanal' | 'amazonia' | 'pampa'
  status: 'ativa' | 'em_implantacao' | 'em_recuperacao' | 'temporariamente_fechada' | 'inativa'
  data_criacao: string
  data_decreto?: string
  numero_decreto?: string
  gestor_responsavel: string
  equipe_gestao: string[]
  infraestrutura: {
    centro_visitantes: boolean
    trilhas_sinalizadas: number
    mirantes: number
    banheiros: boolean
    estacionamento: boolean
    lanchonete: boolean
    auditorio: boolean
    biblioteca: boolean
  }
  visitacao: {
    permitida: boolean
    horario_funcionamento: string
    capacidade_diaria: number
    necessita_agendamento: boolean
    taxa_visitacao: number
    restricoes: string[]
    grupos_escolares: boolean
    pesquisa_cientifica: boolean
  }
  biodiversidade: {
    especies_flora: number
    especies_fauna: number
    especies_ameacadas: number
    especies_endemicas: number
    estudos_realizados: string[]
  }
  programas_educativos: {
    nome: string
    descricao: string
    publico_alvo: string
    capacidade: number
    duracao: string
    agendamento_necessario: boolean
  }[]
  trilhas: {
    nome: string
    extensao: number
    dificuldade: 'facil' | 'moderada' | 'dificil'
    tempo_percurso: string
    atrativos: string[]
    status: 'aberta' | 'fechada' | 'manutencao'
  }[]
  plano_manejo?: {
    existe: boolean
    data_elaboracao?: string
    vigencia?: string
    objetivos: string[]
    zonificacao: string[]
  }
  monitoramento: {
    sistema_cameras: boolean
    sensores_ambientais: boolean
    guardas_ambientais: number
    frequencia_patrulhamento: string
  }
  observacoes: string
}

interface Visitacao {
  id: string
  area_protegida_id: string
  visitante: {
    nome: string
    cpf: string
    telefone: string
    email: string
    endereco: string
  }
  tipo_visita: 'individual' | 'grupo_familiar' | 'grupo_escolar' | 'pesquisa_cientifica' | 'evento_educativo'
  data_agendamento: string
  data_visita: string
  horario: string
  numero_pessoas: number
  atividades_solicitadas: string[]
  guia_necessario: boolean
  status: 'agendada' | 'confirmada' | 'realizada' | 'cancelada' | 'reagendada'
  taxa_paga: boolean
  observacoes: string
}

interface ServicoGerado {
  id: string
  nome: string
  descricao: string
  tipo: 'visitacao_uc' | 'pesquisa_area_protegida' | 'educacao_ambiental' | 'trilha_ecologica'
  categoria: 'visitacao' | 'pesquisa' | 'educacao' | 'recreacao'
  protocolo_base: string
  ativo: boolean
}

export default function AreasProtegidas() {
  const { user } = useAdminAuth()
  const [filtroStatus, setFiltroStatus] = useState<string>('todos')
  const [filtroTipo, setFiltroTipo] = useState<string>('todos')
  const [filtroZona, setFiltroZona] = useState<string>('todos')
  const [busca, setBusca] = useState('')
  const [novaArea, setNovaArea] = useState<Partial<AreaProtegida>>({})
  const [showNovaArea, setShowNovaArea] = useState(false)
  const [showVisitacao, setShowVisitacao] = useState(false)
  const [selectedArea, setSelectedArea] = useState<string>('')

  const areas: AreaProtegida[] = [
    {
      id: '1',
      codigo: 'PM-001',
      nome: 'Parque Municipal das Águas',
      tipo: 'parque_municipal',
      categoria: 'protecao_integral',
      localizacao: {
        endereco: 'Av. das Nascentes, s/n - Vila Verde',
        coordenadas: '-23.5505, -46.6333',
        bairro: 'Vila Verde',
        zona: 'urbana'
      },
      area_total: 15000,
      bioma: 'mata_atlantica',
      status: 'ativa',
      data_criacao: '2015-06-15',
      data_decreto: '2015-05-20',
      numero_decreto: 'Decreto Municipal 1234/2015',
      gestor_responsavel: 'Maria Silva',
      equipe_gestao: ['João Santos', 'Ana Costa', 'Pedro Lima'],
      infraestrutura: {
        centro_visitantes: true,
        trilhas_sinalizadas: 3,
        mirantes: 2,
        banheiros: true,
        estacionamento: true,
        lanchonete: false,
        auditorio: true,
        biblioteca: false
      },
      visitacao: {
        permitida: true,
        horario_funcionamento: '8h às 17h',
        capacidade_diaria: 100,
        necessita_agendamento: true,
        taxa_visitacao: 5,
        restricoes: ['Proibido acampar', 'Não permitido animais domésticos'],
        grupos_escolares: true,
        pesquisa_cientifica: true
      },
      biodiversidade: {
        especies_flora: 120,
        especies_fauna: 85,
        especies_ameacadas: 8,
        especies_endemicas: 3,
        estudos_realizados: ['Levantamento florístico 2020', 'Monitoramento fauna 2021']
      },
      programas_educativos: [
        {
          nome: 'Trilha da Descoberta',
          descricao: 'Caminhada educativa para conhecer a flora e fauna local',
          publico_alvo: 'Ensino fundamental',
          capacidade: 25,
          duracao: '2 horas',
          agendamento_necessario: true
        },
        {
          nome: 'Observação de Aves',
          descricao: 'Atividade de observação e identificação de aves',
          publico_alvo: 'Geral',
          capacidade: 15,
          duracao: '3 horas',
          agendamento_necessario: true
        }
      ],
      trilhas: [
        {
          nome: 'Trilha das Nascentes',
          extensao: 1200,
          dificuldade: 'facil',
          tempo_percurso: '45 minutos',
          atrativos: ['Nascente principal', 'Ponte de madeira', 'Mirante'],
          status: 'aberta'
        },
        {
          nome: 'Trilha do Mirante',
          extensao: 800,
          dificuldade: 'moderada',
          tempo_percurso: '30 minutos',
          atrativos: ['Vista panorâmica', 'Vegetação nativa'],
          status: 'aberta'
        }
      ],
      plano_manejo: {
        existe: true,
        data_elaboracao: '2018-03-15',
        vigencia: '2028-03-15',
        objetivos: ['Conservação da biodiversidade', 'Educação ambiental', 'Pesquisa científica'],
        zonificacao: ['Zona de Preservação', 'Zona de Uso Público', 'Zona de Recuperação']
      },
      monitoramento: {
        sistema_cameras: true,
        sensores_ambientais: false,
        guardas_ambientais: 2,
        frequencia_patrulhamento: 'Diário'
      },
      observacoes: 'Área prioritária para conservação de nascentes'
    },
    {
      id: '2',
      codigo: 'RE-002',
      nome: 'Reserva Ecológica Serra Verde',
      tipo: 'reserva_ecologica',
      categoria: 'protecao_integral',
      localizacao: {
        endereco: 'Estrada da Serra, Km 12 - Zona Rural',
        coordenadas: '-23.5555, -46.6444',
        bairro: 'Serra Verde',
        zona: 'rural'
      },
      area_total: 50000,
      bioma: 'mata_atlantica',
      status: 'ativa',
      data_criacao: '2010-09-20',
      data_decreto: '2010-08-15',
      numero_decreto: 'Decreto Municipal 0987/2010',
      gestor_responsavel: 'Carlos Oliveira',
      equipe_gestao: ['Mariana Santos', 'Roberto Silva'],
      infraestrutura: {
        centro_visitantes: false,
        trilhas_sinalizadas: 2,
        mirantes: 1,
        banheiros: false,
        estacionamento: false,
        lanchonete: false,
        auditorio: false,
        biblioteca: false
      },
      visitacao: {
        permitida: true,
        horario_funcionamento: '8h às 16h',
        capacidade_diaria: 30,
        necessita_agendamento: true,
        taxa_visitacao: 0,
        restricoes: ['Apenas pesquisa científica', 'Grupos pequenos'],
        grupos_escolares: false,
        pesquisa_cientifica: true
      },
      biodiversidade: {
        especies_flora: 250,
        especies_fauna: 180,
        especies_ameacadas: 15,
        especies_endemicas: 8,
        estudos_realizados: ['Inventário florístico 2019', 'Estudo mastofauna 2020']
      },
      programas_educativos: [],
      trilhas: [
        {
          nome: 'Trilha da Pesquisa',
          extensao: 2500,
          dificuldade: 'dificil',
          tempo_percurso: '2 horas',
          atrativos: ['Formação rochosa', 'Mata primária', 'Cachoeira'],
          status: 'aberta'
        }
      ],
      plano_manejo: {
        existe: true,
        data_elaboracao: '2012-11-10',
        vigencia: '2022-11-10',
        objetivos: ['Preservação integral', 'Pesquisa científica'],
        zonificacao: ['Zona Intangível', 'Zona Primitiva']
      },
      monitoramento: {
        sistema_cameras: false,
        sensores_ambientais: true,
        guardas_ambientais: 1,
        frequencia_patrulhamento: '3x por semana'
      },
      observacoes: 'Área de alta biodiversidade, acesso restrito'
    }
  ]

  const visitacoes: Visitacao[] = [
    {
      id: '1',
      area_protegida_id: '1',
      visitante: {
        nome: 'Ana Silva',
        cpf: '123.456.789-00',
        telefone: '(11) 99999-9999',
        email: 'ana@email.com',
        endereco: 'Rua das Flores, 123'
      },
      tipo_visita: 'grupo_familiar',
      data_agendamento: '2024-01-15',
      data_visita: '2024-01-25',
      horario: '9:00',
      numero_pessoas: 5,
      atividades_solicitadas: ['Trilha das Nascentes', 'Visita ao centro de visitantes'],
      guia_necessario: true,
      status: 'confirmada',
      taxa_paga: true,
      observacoes: 'Grupo com crianças pequenas'
    }
  ]

  const servicosGerados: ServicoGerado[] = [
    {
      id: '1',
      nome: 'Visitação de UC',
      descricao: 'Agendamento de visitação em unidades de conservação municipais',
      tipo: 'visitacao_uc',
      categoria: 'visitacao',
      protocolo_base: 'Solicitação → Autorização → Agendamento → Acompanhamento',
      ativo: true
    },
    {
      id: '2',
      nome: 'Pesquisa em Área Protegida',
      descricao: 'Autorização para pesquisa científica em áreas protegidas',
      tipo: 'pesquisa_area_protegida',
      categoria: 'pesquisa',
      protocolo_base: 'Solicitação → Autorização → Agendamento → Acompanhamento',
      ativo: true
    },
    {
      id: '3',
      nome: 'Educação Ambiental',
      descricao: 'Programas educativos em unidades de conservação',
      tipo: 'educacao_ambiental',
      categoria: 'educacao',
      protocolo_base: 'Solicitação → Autorização → Agendamento → Acompanhamento',
      ativo: true
    },
    {
      id: '4',
      nome: 'Trilha Ecológica',
      descricao: 'Acesso guiado às trilhas ecológicas municipais',
      tipo: 'trilha_ecologica',
      categoria: 'recreacao',
      protocolo_base: 'Solicitação → Autorização → Agendamento → Acompanhamento',
      ativo: true
    }
  ]

  const dadosVisitacaoPorMes = [
    { mes: 'Jul', visitantes: 240, grupos_escolares: 45, pesquisadores: 12 },
    { mes: 'Ago', visitantes: 280, grupos_escolares: 52, pesquisadores: 8 },
    { mes: 'Set', visitantes: 320, grupos_escolares: 48, pesquisadores: 15 },
    { mes: 'Out', visitantes: 380, grupos_escolares: 65, pesquisadores: 10 },
    { mes: 'Nov', visitantes: 420, grupos_escolares: 70, pesquisadores: 18 },
    { mes: 'Dez', visitantes: 450, grupos_escolares: 58, pesquisadores: 12 }
  ]

  const dadosTipoArea = [
    { tipo: 'Parque Municipal', quantidade: 3, cor: '#8884d8' },
    { tipo: 'Reserva Ecológica', quantidade: 2, cor: '#82ca9d' },
    { tipo: 'APP', quantidade: 15, cor: '#ffc658' },
    { tipo: 'Reserva Particular', quantidade: 8, cor: '#ff7300' },
    { tipo: 'Jardim Botânico', quantidade: 1, cor: '#00C49F' }
  ]

  const dadosBiodiversidade = [
    { area: 'Parque das Águas', flora: 120, fauna: 85 },
    { area: 'Reserva Serra Verde', flora: 250, fauna: 180 },
    { area: 'APP Córrego Limpo', flora: 80, fauna: 45 },
    { area: 'Reserva do Bosque', flora: 95, fauna: 65 }
  ]

  const getStatusBadge = (status: string) => {
    const variants = {
      'ativa': 'bg-green-100 text-green-800',
      'em_implantacao': 'bg-blue-100 text-blue-800',
      'em_recuperacao': 'bg-yellow-100 text-yellow-800',
      'temporariamente_fechada': 'bg-orange-100 text-orange-800',
      'inativa': 'bg-gray-100 text-gray-800'
    }
    return variants[status as keyof typeof variants] || 'bg-gray-100 text-gray-800'
  }

  const getDificuldadeBadge = (dificuldade: string) => {
    const variants = {
      'facil': 'bg-green-100 text-green-800',
      'moderada': 'bg-yellow-100 text-yellow-800',
      'dificil': 'bg-red-100 text-red-800'
    }
    return variants[dificuldade as keyof typeof variants] || 'bg-gray-100 text-gray-800'
  }

  const filtrarAreas = areas.filter(area => {
    const matchStatus = filtroStatus === 'todos' || area.status === filtroStatus
    const matchTipo = filtroTipo === 'todos' || area.tipo === filtroTipo
    const matchZona = filtroZona === 'todos' || area.localizacao.zona === filtroZona
    const matchBusca = busca === '' ||
      area.nome.toLowerCase().includes(busca.toLowerCase()) ||
      area.codigo.toLowerCase().includes(busca.toLowerCase()) ||
      area.localizacao.bairro.toLowerCase().includes(busca.toLowerCase())

    return matchStatus && matchTipo && matchZona && matchBusca
  })

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Áreas Protegidas</h1>
          <p className="text-gray-600 mt-1">Gestão de unidades de conservação municipais</p>
        </div>
        <div className="flex gap-3">
          <Dialog open={showNovaArea} onOpenChange={setShowNovaArea}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nova Área
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Nova Área Protegida</DialogTitle>
                <DialogDescription>
                  Cadastrar nova unidade de conservação municipal
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Nome da Área</label>
                  <Input placeholder="Nome da unidade de conservação" />
                </div>
                <div>
                  <label className="text-sm font-medium">Código</label>
                  <Input placeholder="Ex: PM-001" />
                </div>
                <div>
                  <label className="text-sm font-medium">Tipo</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecionar tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="parque_municipal">Parque Municipal</SelectItem>
                      <SelectItem value="reserva_ecologica">Reserva Ecológica</SelectItem>
                      <SelectItem value="area_preservacao_permanente">APP</SelectItem>
                      <SelectItem value="jardim_botanico">Jardim Botânico</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Área Total (m²)</label>
                  <Input type="number" placeholder="Área em metros quadrados" />
                </div>
                <div className="col-span-2">
                  <label className="text-sm font-medium">Endereço</label>
                  <Input placeholder="Endereço completo da área" />
                </div>
                <div>
                  <label className="text-sm font-medium">Zona</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecionar zona" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="urbana">Urbana</SelectItem>
                      <SelectItem value="rural">Rural</SelectItem>
                      <SelectItem value="periurbana">Periurbana</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Bioma</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecionar bioma" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mata_atlantica">Mata Atlântica</SelectItem>
                      <SelectItem value="cerrado">Cerrado</SelectItem>
                      <SelectItem value="caatinga">Caatinga</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <Button className="flex-1">Criar Área</Button>
                <Button variant="outline" onClick={() => setShowNovaArea(false)}>
                  Cancelar
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          <Button variant="outline" onClick={() => setShowVisitacao(true)}>
            <Calendar className="h-4 w-4 mr-2" />
            Agendamentos
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Relatório
          </Button>
        </div>
      </div>

      <Tabs defaultValue="areas" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="areas">Áreas Protegidas</TabsTrigger>
          <TabsTrigger value="visitacao">Visitação</TabsTrigger>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="servicos">Serviços Gerados</TabsTrigger>
          <TabsTrigger value="relatorios">Relatórios</TabsTrigger>
        </TabsList>

        <TabsContent value="areas" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Lista de Áreas Protegidas</CardTitle>
                <div className="flex gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Buscar por nome, código ou bairro..."
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
                      <SelectItem value="ativa">Ativa</SelectItem>
                      <SelectItem value="em_implantacao">Em Implantação</SelectItem>
                      <SelectItem value="em_recuperacao">Em Recuperação</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={filtroTipo} onValueChange={setFiltroTipo}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos os tipos</SelectItem>
                      <SelectItem value="parque_municipal">Parque Municipal</SelectItem>
                      <SelectItem value="reserva_ecologica">Reserva Ecológica</SelectItem>
                      <SelectItem value="area_preservacao_permanente">APP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filtrarAreas.map((area) => (
                  <Card key={area.id} className="border-l-4 border-l-green-500">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-medium text-lg">{area.nome}</h3>
                            <Badge className="text-xs">{area.codigo}</Badge>
                            <Badge variant="outline" className="capitalize">
                              {area.tipo.replace('_', ' ')}
                            </Badge>
                          </div>
                          <p className="text-gray-600 mb-1">Gestor: {area.gestor_responsavel}</p>
                          <p className="text-sm text-gray-500">{area.localizacao.endereco}</p>
                        </div>
                        <div className="flex gap-2">
                          <Badge className={getStatusBadge(area.status)}>
                            {area.status.replace('_', ' ')}
                          </Badge>
                          <Badge variant="outline" className="capitalize">
                            {area.localizacao.zona}
                          </Badge>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                        <div>
                          <span className="text-gray-600">Área Total:</span>
                          <p className="font-medium">{(area.area_total / 10000).toFixed(1)} ha</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Bioma:</span>
                          <p className="font-medium capitalize">{area.bioma.replace('_', ' ')}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Visitação:</span>
                          <p className="font-medium">{area.visitacao.permitida ? 'Permitida' : 'Restrita'}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Trilhas:</span>
                          <p className="font-medium">{area.trilhas.length} trilha(s)</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                        <MapPin className="h-4 w-4" />
                        {area.localizacao.bairro} - {area.localizacao.zona}
                        {area.localizacao.coordenadas && (
                          <span className="text-gray-500">({area.localizacao.coordenadas})</span>
                        )}
                      </div>

                      <div className="mb-4">
                        <p className="text-sm text-gray-600 mb-2">Biodiversidade:</p>
                        <div className="grid grid-cols-4 gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <Leaf className="h-4 w-4 text-green-600" />
                            <span>{area.biodiversidade.especies_flora} espécies de flora</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Bird className="h-4 w-4 text-blue-600" />
                            <span>{area.biodiversidade.especies_fauna} espécies de fauna</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Shield className="h-4 w-4 text-red-600" />
                            <span>{area.biodiversidade.especies_ameacadas} ameaçadas</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Mountain className="h-4 w-4 text-purple-600" />
                            <span>{area.biodiversidade.especies_endemicas} endêmicas</span>
                          </div>
                        </div>
                      </div>

                      {area.trilhas.length > 0 && (
                        <div className="mb-4">
                          <p className="text-sm text-gray-600 mb-2">Trilhas:</p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {area.trilhas.map((trilha, index) => (
                              <div key={index} className="flex items-center justify-between p-2 bg-green-50 rounded">
                                <div>
                                  <p className="font-medium text-sm">{trilha.nome}</p>
                                  <p className="text-xs text-gray-600">{trilha.extensao}m - {trilha.tempo_percurso}</p>
                                </div>
                                <div className="flex gap-2">
                                  <Badge className={getDificuldadeBadge(trilha.dificuldade)}>
                                    {trilha.dificuldade}
                                  </Badge>
                                  <Badge className={trilha.status === 'aberta' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                                    {trilha.status}
                                  </Badge>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="mb-4">
                        <p className="text-sm text-gray-600 mb-2">Infraestrutura:</p>
                        <div className="flex flex-wrap gap-2">
                          {area.infraestrutura.centro_visitantes && <Badge variant="outline" className="text-xs">Centro de Visitantes</Badge>}
                          {area.infraestrutura.trilhas_sinalizadas > 0 && <Badge variant="outline" className="text-xs">{area.infraestrutura.trilhas_sinalizadas} Trilhas</Badge>}
                          {area.infraestrutura.mirantes > 0 && <Badge variant="outline" className="text-xs">{area.infraestrutura.mirantes} Mirantes</Badge>}
                          {area.infraestrutura.banheiros && <Badge variant="outline" className="text-xs">Banheiros</Badge>}
                          {area.infraestrutura.estacionamento && <Badge variant="outline" className="text-xs">Estacionamento</Badge>}
                          {area.infraestrutura.auditorio && <Badge variant="outline" className="text-xs">Auditório</Badge>}
                        </div>
                      </div>

                      {area.visitacao.permitida && (
                        <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                          <h4 className="font-medium text-sm text-blue-900 mb-2">Informações de Visitação</h4>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                            <div>
                              <span className="text-blue-700">Horário:</span>
                              <p className="font-medium">{area.visitacao.horario_funcionamento}</p>
                            </div>
                            <div>
                              <span className="text-blue-700">Capacidade:</span>
                              <p className="font-medium">{area.visitacao.capacidade_diaria} pessoas/dia</p>
                            </div>
                            <div>
                              <span className="text-blue-700">Taxa:</span>
                              <p className="font-medium">R$ {area.visitacao.taxa_visitacao.toFixed(2)}</p>
                            </div>
                            <div>
                              <span className="text-blue-700">Agendamento:</span>
                              <p className="font-medium">{area.visitacao.necessita_agendamento ? 'Obrigatório' : 'Não obrigatório'}</p>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-4">
                          <Badge variant="outline" className="capitalize">
                            {area.categoria.replace('_', ' ')}
                          </Badge>
                          <span className="text-sm text-gray-600">{area.observacoes}</span>
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
                            <Calendar className="h-4 w-4 mr-2" />
                            Agendar
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

        <TabsContent value="visitacao" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Agendamentos de Visitação</CardTitle>
              <CardDescription>Controle de visitas às unidades de conservação</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {visitacoes.map((visita) => {
                  const area = areas.find(a => a.id === visita.area_protegida_id)
                  return (
                    <Card key={visita.id} className="border-l-4 border-l-blue-500">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="font-medium text-lg">{area?.nome}</h3>
                            <p className="text-gray-600">{visita.visitante.nome} - {visita.visitante.cpf}</p>
                            <p className="text-sm text-gray-500">{visita.tipo_visita.replace('_', ' ')}</p>
                          </div>
                          <Badge className={visita.status === 'confirmada' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                            {visita.status}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">Data da Visita:</span>
                            <p className="font-medium">{new Date(visita.data_visita).toLocaleDateString('pt-BR')}</p>
                          </div>
                          <div>
                            <span className="text-gray-600">Horário:</span>
                            <p className="font-medium">{visita.horario}</p>
                          </div>
                          <div>
                            <span className="text-gray-600">Pessoas:</span>
                            <p className="font-medium">{visita.numero_pessoas}</p>
                          </div>
                          <div>
                            <span className="text-gray-600">Taxa:</span>
                            <p className="font-medium">{visita.taxa_paga ? 'Paga' : 'Pendente'}</p>
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
                <CardTitle className="text-sm font-medium">Áreas Protegidas</CardTitle>
                <TreePine className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">29</div>
                <p className="text-xs text-muted-foreground">+2 desde o ano passado</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Área Total</CardTitle>
                <Mountain className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1.240 ha</div>
                <p className="text-xs text-muted-foreground">3,2% do território municipal</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Visitantes/Mês</CardTitle>
                <Users className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">450</div>
                <p className="text-xs text-muted-foreground">+8% desde o mês passado</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Espécies Catalogadas</CardTitle>
                <Leaf className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1.230</div>
                <p className="text-xs text-muted-foreground">Flora e fauna identificadas</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Visitação por Mês</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={dadosVisitacaoPorMes}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mes" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="visitantes" stackId="1" stroke="#8884d8" fill="#8884d8" />
                    <Area type="monotone" dataKey="grupos_escolares" stackId="1" stroke="#82ca9d" fill="#82ca9d" />
                    <Area type="monotone" dataKey="pesquisadores" stackId="1" stroke="#ffc658" fill="#ffc658" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Distribuição por Tipo de Área</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={dadosTipoArea}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ tipo, quantidade }) => `${tipo}: ${quantidade}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="quantidade"
                    >
                      {dadosTipoArea.map((entry, index) => (
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
                <CardTitle>Biodiversidade por Área</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={dadosBiodiversidade}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="area" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="flora" name="Flora" fill="#82ca9d" />
                    <Bar dataKey="fauna" name="Fauna" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Evolução da Visitação</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={dadosVisitacaoPorMes}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mes" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="visitantes" stroke="#8884d8" strokeWidth={2} />
                    <Line type="monotone" dataKey="grupos_escolares" stroke="#82ca9d" strokeWidth={2} />
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
                <TreePine className="h-5 w-5 text-green-600" />
                Serviços Gerados Automaticamente
              </CardTitle>
              <CardDescription>
                Serviços do catálogo público gerados pelas funcionalidades internas das áreas protegidas
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
                Como a gestão de áreas protegidas gera automaticamente serviços para o catálogo público
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
                  <h4 className="font-medium text-green-900 mb-2">Áreas Protegidas → Serviços Públicos</h4>
                  <ul className="text-sm text-green-800 space-y-1">
                    <li>• <strong>Visitação de UC:</strong> Agendamento de visitas às unidades de conservação</li>
                    <li>• <strong>Pesquisa em Área Protegida:</strong> Autorização para pesquisas científicas</li>
                    <li>• <strong>Educação Ambiental:</strong> Programas educativos em áreas naturais</li>
                    <li>• <strong>Trilha Ecológica:</strong> Acesso guiado às trilhas ecológicas</li>
                  </ul>
                </div>

                <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                  <h4 className="font-medium text-blue-900 mb-2">Fluxo de Protocolos</h4>
                  <p className="text-sm text-blue-800">
                    Cidadão solicita "Visitação de UC" → Protocolo criado → Verificação de disponibilidade →
                    Autorização → Agendamento → Acompanhamento da visita
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
                <CardTitle className="text-base">Relatório de Conservação</CardTitle>
                <CardDescription>Estado das unidades de conservação</CardDescription>
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
                <CardTitle className="text-base">Relatório de Visitação</CardTitle>
                <CardDescription>Estatísticas de uso público</CardDescription>
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
                <CardTitle className="text-base">Relatório de Biodiversidade</CardTitle>
                <CardDescription>Inventário de flora e fauna</CardDescription>
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