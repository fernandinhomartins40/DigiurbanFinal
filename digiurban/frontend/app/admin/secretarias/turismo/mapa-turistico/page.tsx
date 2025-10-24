'use client'

import { useState, useEffect } from 'react'
import { useAdminAuth } from '@/contexts/AdminAuthContext'
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
import { Map, MapPin, Navigation, Route, Layers, Compass, Camera, Clock, Star, Users, Building, Plus, Search, Filter, Download, Eye, Edit, Trash2, CheckCircle, AlertTriangle, Info, Globe, Smartphone, QrCode } from 'lucide-react'

interface PontoTuristico {
  id: string
  codigo_ponto: string
  nome: string
  categoria: 'natureza' | 'cultura' | 'religioso' | 'gastronomia' | 'aventura' | 'historico' | 'comercial' | 'entretenimento'
  tipo_ponto: 'atrativo_principal' | 'atrativo_secundario' | 'ponto_apoio' | 'mirante' | 'acesso' | 'estacionamento'
  localizacao: {
    endereco: string
    coordenadas: {
      latitude: number
      longitude: number
    }
    referencias: string[]
    acesso_publico: boolean
  }
  informacoes_turisticas: {
    descricao_completa: string
    historia_local: string
    melhor_epoca_visita: string[]
    tempo_visita_sugerido: number
    dificuldade_acesso: 'facil' | 'moderado' | 'dificil'
  }
  recursos_disponveis: {
    infraestrutura: string[]
    servicos: string[]
    facilidades_acessibilidade: string[]
    equipamentos_turismo: string[]
  }
  midia_associada: {
    fotos_oficiais: Array<{
      url: string
      descricao: string
      creditos: string
    }>
    videos: Array<{
      url: string
      titulo: string
      duracao: number
    }>
    tour_virtual?: {
      url: string
      tecnologia: '360' | 'vr' | 'interativo'
    }
  }
  avaliacao_turistica: {
    nota_media: number
    total_avaliacoes: number
    criterios: {
      beleza_natural: number
      infraestrutura: number
      acessibilidade: number
      limpeza: number
      seguranca: number
    }
  }
  integracao_digital: {
    qr_code: string
    mapa_interativo: boolean
    realidade_aumentada: boolean
    app_integrado: boolean
  }
  status: 'ativo' | 'manutencao' | 'temporariamente_fechado' | 'em_desenvolvimento'
  data_cadastro: string
  ultima_atualizacao: string
}

interface RotaTuristica {
  id: string
  codigo_rota: string
  nome_rota: string
  categoria_rota: 'cultural' | 'natural' | 'gastronomica' | 'religiosa' | 'aventura' | 'historica' | 'tematica'
  modalidade: 'a_pe' | 'bicicleta' | 'veiculo' | 'transporte_publico' | 'mista'
  pontos_parada: Array<{
    ponto_id: string
    ordem: number
    tempo_permanencia: number
    observacoes: string
  }>
  informacoes_rota: {
    distancia_total: number
    duracao_estimada: number
    dificuldade: 'facil' | 'moderado' | 'dificil'
    melhor_horario: string[]
    epoca_recomendada: string[]
  }
  navegacao: {
    coordenadas_inicio: { latitude: number; longitude: number }
    coordenadas_fim: { latitude: number; longitude: number }
    waypoints: Array<{ latitude: number; longitude: number; descricao: string }>
    instrucoes_navegacao: string[]
  }
  recursos_necessarios: {
    equipamentos: string[]
    vestuario_recomendado: string[]
    provisoes: string[]
    documentos: string[]
  }
  servicos_apoio: {
    guias_disponiveis: boolean
    transporte_organizado: boolean
    alimentacao_inclusa: boolean
    seguro_turista: boolean
  }
  promocao: {
    preco_sugerido: number
    descontos_disponveis: Array<{
      tipo: string
      percentual: number
      condicoes: string
    }>
    pacotes_relacionados: string[]
  }
  status: 'ativa' | 'sazonal' | 'manutencao' | 'suspensa'
  data_criacao: string
  ultima_atualizacao: string
}

const categoriasPonto = [
  { value: 'natureza', label: 'Natureza', color: 'bg-green-100 text-green-800' },
  { value: 'cultura', label: 'Cultura', color: 'bg-purple-100 text-purple-800' },
  { value: 'religioso', label: 'Religioso', color: 'bg-blue-100 text-blue-800' },
  { value: 'gastronomia', label: 'Gastronomia', color: 'bg-orange-100 text-orange-800' },
  { value: 'aventura', label: 'Aventura', color: 'bg-red-100 text-red-800' },
  { value: 'historico', label: 'Histórico', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'comercial', label: 'Comercial', color: 'bg-indigo-100 text-indigo-800' },
  { value: 'entretenimento', label: 'Entretenimento', color: 'bg-pink-100 text-pink-800' }
]

const categoriasRota = [
  { value: 'cultural', label: 'Cultural', color: 'bg-purple-100 text-purple-800' },
  { value: 'natural', label: 'Natural', color: 'bg-green-100 text-green-800' },
  { value: 'gastronomica', label: 'Gastronômica', color: 'bg-orange-100 text-orange-800' },
  { value: 'religiosa', label: 'Religiosa', color: 'bg-blue-100 text-blue-800' },
  { value: 'aventura', label: 'Aventura', color: 'bg-red-100 text-red-800' },
  { value: 'historica', label: 'Histórica', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'tematica', label: 'Temática', color: 'bg-pink-100 text-pink-800' }
]

const statusPonto = [
  { value: 'ativo', label: 'Ativo', color: 'bg-green-100 text-green-800' },
  { value: 'manutencao', label: 'Manutenção', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'temporariamente_fechado', label: 'Temporariamente Fechado', color: 'bg-red-100 text-red-800' },
  { value: 'em_desenvolvimento', label: 'Em Desenvolvimento', color: 'bg-blue-100 text-blue-800' }
]

const statusRota = [
  { value: 'ativa', label: 'Ativa', color: 'bg-green-100 text-green-800' },
  { value: 'sazonal', label: 'Sazonal', color: 'bg-blue-100 text-blue-800' },
  { value: 'manutencao', label: 'Manutenção', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'suspensa', label: 'Suspensa', color: 'bg-red-100 text-red-800' }
]

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658']

export default function MapaTuristicoPage() {
  const { user } = useAdminAuth()
  const [pontosTuristicos, setPontosTuristicos] = useState<PontoTuristico[]>([])
  const [rotasTuristicas, setRotasTuristicas] = useState<RotaTuristica[]>([])
  const [filteredPontos, setFilteredPontos] = useState<PontoTuristico[]>([])
  const [filteredRotas, setFilteredRotas] = useState<RotaTuristica[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategoriaPonto, setSelectedCategoriaPonto] = useState<string>('')
  const [selectedCategoriaRota, setSelectedCategoriaRota] = useState<string>('')
  const [selectedPonto, setSelectedPonto] = useState<PontoTuristico | null>(null)
  const [selectedRota, setSelectedRota] = useState<RotaTuristica | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isRotaDialogOpen, setIsRotaDialogOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [currentTab, setCurrentTab] = useState('dashboard')
  const [mapViewMode, setMapViewMode] = useState<'pontos' | 'rotas'>('pontos')

  const [newPonto, setNewPonto] = useState<Partial<PontoTuristico>>({
    nome: '',
    categoria: 'natureza',
    tipo_ponto: 'atrativo_principal',
    localizacao: {
      endereco: '',
      coordenadas: { latitude: 0, longitude: 0 },
      referencias: [],
      acesso_publico: true
    },
    informacoes_turisticas: {
      descricao_completa: '',
      historia_local: '',
      melhor_epoca_visita: [],
      tempo_visita_sugerido: 0,
      dificuldade_acesso: 'facil'
    },
    recursos_disponveis: {
      infraestrutura: [],
      servicos: [],
      facilidades_acessibilidade: [],
      equipamentos_turismo: []
    },
    avaliacao_turistica: {
      nota_media: 0,
      total_avaliacoes: 0,
      criterios: {
        beleza_natural: 0,
        infraestrutura: 0,
        acessibilidade: 0,
        limpeza: 0,
        seguranca: 0
      }
    },
    status: 'ativo'
  })

  const [newRota, setNewRota] = useState<Partial<RotaTuristica>>({
    nome_rota: '',
    categoria_rota: 'cultural',
    modalidade: 'a_pe',
    pontos_parada: [],
    informacoes_rota: {
      distancia_total: 0,
      duracao_estimada: 0,
      dificuldade: 'facil',
      melhor_horario: [],
      epoca_recomendada: []
    },
    navegacao: {
      coordenadas_inicio: { latitude: 0, longitude: 0 },
      coordenadas_fim: { latitude: 0, longitude: 0 },
      waypoints: [],
      instrucoes_navegacao: []
    },
    status: 'ativa'
  })

  useEffect(() => {
    const mockPontos: PontoTuristico[] = [
      {
        id: '1',
        codigo_ponto: 'PT-001',
        nome: 'Mirante da Serra',
        categoria: 'natureza',
        tipo_ponto: 'atrativo_principal',
        localizacao: {
          endereco: 'Estrada da Serra, Km 15',
          coordenadas: { latitude: -23.5505, longitude: -46.6333 },
          referencias: ['Marco do km 15', 'Trilha principal'],
          acesso_publico: true
        },
        informacoes_turisticas: {
          descricao_completa: 'Mirante natural com vista panorâmica da cidade e região montanhosa',
          historia_local: 'Local histórico usado pelos primeiros exploradores da região',
          melhor_epoca_visita: ['Outono', 'Inverno'],
          tempo_visita_sugerido: 120,
          dificuldade_acesso: 'moderado'
        },
        recursos_disponveis: {
          infraestrutura: ['Trilha sinalizada', 'Deck de observação', 'Bancos'],
          servicos: ['Guia local', 'Lanchonete sazonal'],
          facilidades_acessibilidade: ['Rampa de acesso parcial'],
          equipamentos_turismo: ['Binóculos públicos', 'Placa informativa']
        },
        midia_associada: {
          fotos_oficiais: [
            { url: '/images/mirante1.jpg', descricao: 'Vista panorâmica', creditos: 'Secretaria de Turismo' }
          ],
          videos: [
            { url: '/videos/mirante.mp4', titulo: 'Tour virtual do mirante', duracao: 180 }
          ],
          tour_virtual: { url: '/tour/mirante', tecnologia: '360' }
        },
        avaliacao_turistica: {
          nota_media: 4.5,
          total_avaliacoes: 128,
          criterios: {
            beleza_natural: 4.8,
            infraestrutura: 4.2,
            acessibilidade: 3.5,
            limpeza: 4.3,
            seguranca: 4.0
          }
        },
        integracao_digital: {
          qr_code: 'https://qr.city.gov.br/PT-001',
          mapa_interativo: true,
          realidade_aumentada: true,
          app_integrado: true
        },
        status: 'ativo',
        data_cadastro: '2024-01-15',
        ultima_atualizacao: '2024-09-20'
      },
      {
        id: '2',
        codigo_ponto: 'PT-002',
        nome: 'Centro Histórico Municipal',
        categoria: 'historico',
        tipo_ponto: 'atrativo_principal',
        localizacao: {
          endereco: 'Praça Central, Centro',
          coordenadas: { latitude: -23.5489, longitude: -46.6388 },
          referencias: ['Igreja Matriz', 'Prefeitura Municipal'],
          acesso_publico: true
        },
        informacoes_turisticas: {
          descricao_completa: 'Conjunto arquitetônico preservado do século XIX com museus e casarões coloniais',
          historia_local: 'Fundado em 1876, preserva a arquitetura original da cidade',
          melhor_epoca_visita: ['Primavera', 'Outono'],
          tempo_visita_sugerido: 180,
          dificuldade_acesso: 'facil'
        },
        recursos_disponveis: {
          infraestrutura: ['Calçamento histórico', 'Iluminação cênica', 'Bancos'],
          servicos: ['Guia turístico', 'Loja de souvenirs', 'Café histórico'],
          facilidades_acessibilidade: ['Rampas de acesso', 'Piso tátil'],
          equipamentos_turismo: ['Totems informativos', 'WiFi gratuito']
        },
        midia_associada: {
          fotos_oficiais: [
            { url: '/images/centro1.jpg', descricao: 'Praça central', creditos: 'Arquivo Histórico' }
          ],
          videos: [],
          tour_virtual: { url: '/tour/centro', tecnologia: 'interativo' }
        },
        avaliacao_turistica: {
          nota_media: 4.2,
          total_avaliacoes: 95,
          criterios: {
            beleza_natural: 3.8,
            infraestrutura: 4.5,
            acessibilidade: 4.0,
            limpeza: 4.3,
            seguranca: 4.2
          }
        },
        integracao_digital: {
          qr_code: 'https://qr.city.gov.br/PT-002',
          mapa_interativo: true,
          realidade_aumentada: false,
          app_integrado: true
        },
        status: 'ativo',
        data_cadastro: '2024-02-01',
        ultima_atualizacao: '2024-09-18'
      }
    ]

    const mockRotas: RotaTuristica[] = [
      {
        id: '1',
        codigo_rota: 'RT-001',
        nome_rota: 'Caminho dos Sabores',
        categoria_rota: 'gastronomica',
        modalidade: 'a_pe',
        pontos_parada: [
          { ponto_id: 'PT-002', ordem: 1, tempo_permanencia: 30, observacoes: 'Início no centro histórico' },
          { ponto_id: 'PT-003', ordem: 2, tempo_permanencia: 60, observacoes: 'Restaurante tradicional' },
          { ponto_id: 'PT-004', ordem: 3, tempo_permanencia: 45, observacoes: 'Mercado municipal' }
        ],
        informacoes_rota: {
          distancia_total: 2.5,
          duracao_estimada: 180,
          dificuldade: 'facil',
          melhor_horario: ['Manhã', 'Tarde'],
          epoca_recomendada: ['Ano todo']
        },
        navegacao: {
          coordenadas_inicio: { latitude: -23.5489, longitude: -46.6388 },
          coordenadas_fim: { latitude: -23.5495, longitude: -46.6370 },
          waypoints: [
            { latitude: -23.5492, longitude: -46.6380, descricao: 'Praça da Alimentação' }
          ],
          instrucoes_navegacao: [
            'Siga pela Rua Principal por 500m',
            'Vire à direita na Rua dos Sabores',
            'Continue até o Mercado Municipal'
          ]
        },
        recursos_necessarios: {
          equipamentos: ['Câmera', 'Garrafa de água'],
          vestuario_recomendado: ['Calçado confortável', 'Roupa casual'],
          provisoes: ['Dinheiro para degustações'],
          documentos: ['Documento de identidade']
        },
        servicos_apoio: {
          guias_disponiveis: true,
          transporte_organizado: false,
          alimentacao_inclusa: true,
          seguro_turista: false
        },
        promocao: {
          preco_sugerido: 35.00,
          descontos_disponveis: [
            { tipo: 'Estudante', percentual: 20, condicoes: 'Apresentar carteirinha' },
            { tipo: 'Idoso', percentual: 50, condicoes: 'Acima de 60 anos' }
          ],
          pacotes_relacionados: ['Tour Cultural', 'Rota Histórica']
        },
        status: 'ativa',
        data_criacao: '2024-03-10',
        ultima_atualizacao: '2024-09-15'
      }
    ]

    setPontosTuristicos(mockPontos)
    setRotasTuristicas(mockRotas)
    setFilteredPontos(mockPontos)
    setFilteredRotas(mockRotas)
  }, [])

  useEffect(() => {
    let filteredP = pontosTuristicos
    let filteredR = rotasTuristicas

    if (searchTerm) {
      filteredP = filteredP.filter(ponto =>
        ponto.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ponto.codigo_ponto.toLowerCase().includes(searchTerm.toLowerCase())
      )
      filteredR = filteredR.filter(rota =>
        rota.nome_rota.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rota.codigo_rota.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (selectedCategoriaPonto) {
      filteredP = filteredP.filter(ponto => ponto.categoria === selectedCategoriaPonto)
    }

    if (selectedCategoriaRota) {
      filteredR = filteredR.filter(rota => rota.categoria_rota === selectedCategoriaRota)
    }

    setFilteredPontos(filteredP)
    setFilteredRotas(filteredR)
  }, [searchTerm, selectedCategoriaPonto, selectedCategoriaRota, pontosTuristicos, rotasTuristicas])

  const totalPontos = pontosTuristicos.length
  const pontosAtivos = pontosTuristicos.filter(p => p.status === 'ativo').length
  const totalRotas = rotasTuristicas.length
  const rotasAtivas = rotasTuristicas.filter(r => r.status === 'ativa').length

  const pontosPorCategoria = categoriasPonto.map(categoria => ({
    name: categoria.label,
    value: pontosTuristicos.filter(p => p.categoria === categoria.value).length
  }))

  const rotasPorCategoria = categoriasRota.map(categoria => ({
    name: categoria.label,
    value: rotasTuristicas.filter(r => r.categoria_rota === categoria.value).length
  }))

  const avaliacoesMensais = [
    { mes: 'Jan', pontos: 45, rotas: 12 },
    { mes: 'Fev', pontos: 52, rotas: 15 },
    { mes: 'Mar', pontos: 48, rotas: 18 },
    { mes: 'Abr', pontos: 61, rotas: 22 },
    { mes: 'Mai', pontos: 58, rotas: 25 },
    { mes: 'Jun', pontos: 67, rotas: 28 }
  ]

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Mapa Turístico</h1>
          <p className="text-muted-foreground mt-2">
            Gestão de pontos turísticos, rotas e navegação digital da cidade
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => { setIsRotaDialogOpen(true); setIsEditing(false) }} className="flex items-center gap-2">
            <Route className="h-4 w-4" />
            Nova Rota
          </Button>
          <Button onClick={() => { setIsDialogOpen(true); setIsEditing(false) }} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Novo Ponto
          </Button>
        </div>
      </div>

      <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="pontos">Pontos</TabsTrigger>
          <TabsTrigger value="rotas">Rotas</TabsTrigger>
          <TabsTrigger value="mapa">Mapa Digital</TabsTrigger>
          <TabsTrigger value="servicos">Serviços Gerados</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pontos Turísticos</CardTitle>
                <MapPin className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalPontos}</div>
                <p className="text-xs text-muted-foreground">
                  {pontosAtivos} ativos
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Rotas Turísticas</CardTitle>
                <Route className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalRotas}</div>
                <p className="text-xs text-muted-foreground">
                  {rotasAtivas} ativas
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avaliação Média</CardTitle>
                <Star className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">4.3</div>
                <p className="text-xs text-muted-foreground">
                  De 223 avaliações
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">QR Codes Ativos</CardTitle>
                <QrCode className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{pontosTuristicos.filter(p => p.integracao_digital.qr_code).length}</div>
                <p className="text-xs text-muted-foreground">
                  Integração digital
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Pontos por Categoria</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pontosPorCategoria}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pontosPorCategoria.map((entry, index) => (
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
                <CardTitle>Rotas por Categoria</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={rotasPorCategoria}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Evolução de Avaliações Mensais</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={avaliacoesMensais}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mes" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="pontos" stroke="#8884d8" strokeWidth={2} name="Avaliações de Pontos" />
                  <Line type="monotone" dataKey="rotas" stroke="#82ca9d" strokeWidth={2} name="Avaliações de Rotas" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pontos" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Filtros e Busca - Pontos Turísticos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Buscar por nome ou código do ponto..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full"
                  />
                </div>
                <Select value={selectedCategoriaPonto} onValueChange={setSelectedCategoriaPonto}>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="Filtrar por categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todas as categorias</SelectItem>
                    {categoriasPonto.map(categoria => (
                      <SelectItem key={categoria.value} value={categoria.value}>
                        {categoria.label}
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
            {filteredPontos.map((ponto) => (
              <Card key={ponto.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-xl">{ponto.nome}</CardTitle>
                        <Badge variant="outline">{ponto.codigo_ponto}</Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={categoriasPonto.find(c => c.value === ponto.categoria)?.color}>
                          {categoriasPonto.find(c => c.value === ponto.categoria)?.label}
                        </Badge>
                        <Badge className={statusPonto.find(s => s.value === ponto.status)?.color}>
                          {statusPonto.find(s => s.value === ponto.status)?.label}
                        </Badge>
                        {ponto.integracao_digital.qr_code && (
                          <Badge variant="outline" className="flex items-center gap-1">
                            <QrCode className="h-3 w-3" />
                            QR Code
                          </Badge>
                        )}
                      </div>
                      <CardDescription className="max-w-2xl">
                        {ponto.informacoes_turisticas.descricao_completa}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedPonto(ponto)
                          setCurrentTab('mapa')
                          setMapViewMode('pontos')
                        }}
                      >
                        <Map className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm font-medium flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        Localização
                      </p>
                      <p className="text-sm text-muted-foreground">{ponto.localizacao.endereco}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium flex items-center gap-1">
                        <Star className="h-4 w-4" />
                        Avaliação
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {ponto.avaliacao_turistica.nota_media}/5 ({ponto.avaliacao_turistica.total_avaliacoes} avaliações)
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        Tempo de Visita
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {ponto.informacoes_turisticas.tempo_visita_sugerido} minutos
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium flex items-center gap-1">
                        <Smartphone className="h-4 w-4" />
                        Digital
                      </p>
                      <div className="flex gap-1">
                        {ponto.integracao_digital.app_integrado && <Badge variant="secondary" className="text-xs">App</Badge>}
                        {ponto.integracao_digital.realidade_aumentada && <Badge variant="secondary" className="text-xs">AR</Badge>}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="rotas" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Filtros e Busca - Rotas Turísticas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Buscar por nome ou código da rota..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full"
                  />
                </div>
                <Select value={selectedCategoriaRota} onValueChange={setSelectedCategoriaRota}>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="Filtrar por categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todas as categorias</SelectItem>
                    {categoriasRota.map(categoria => (
                      <SelectItem key={categoria.value} value={categoria.value}>
                        {categoria.label}
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
            {filteredRotas.map((rota) => (
              <Card key={rota.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-xl">{rota.nome_rota}</CardTitle>
                        <Badge variant="outline">{rota.codigo_rota}</Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={categoriasRota.find(c => c.value === rota.categoria_rota)?.color}>
                          {categoriasRota.find(c => c.value === rota.categoria_rota)?.label}
                        </Badge>
                        <Badge className={statusRota.find(s => s.value === rota.status)?.color}>
                          {statusRota.find(s => s.value === rota.status)?.label}
                        </Badge>
                        <Badge variant="outline">
                          {rota.modalidade.replace('_', ' ')}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedRota(rota)
                          setCurrentTab('mapa')
                          setMapViewMode('rotas')
                        }}
                      >
                        <Navigation className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm font-medium flex items-center gap-1">
                        <Route className="h-4 w-4" />
                        Distância
                      </p>
                      <p className="text-sm text-muted-foreground">{rota.informacoes_rota.distancia_total} km</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        Duração
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {Math.floor(rota.informacoes_rota.duracao_estimada / 60)}h {rota.informacoes_rota.duracao_estimada % 60}min
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        Pontos
                      </p>
                      <p className="text-sm text-muted-foreground">{rota.pontos_parada.length} paradas</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium flex items-center gap-1">
                        <Building className="h-4 w-4" />
                        Preço
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(rota.promocao.preco_sugerido)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="mapa" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Map className="h-5 w-5" />
                Visualização do Mapa Turístico Digital
              </CardTitle>
              <CardDescription>
                Interface integrada de navegação e visualização dos pontos e rotas turísticas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Button
                      variant={mapViewMode === 'pontos' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setMapViewMode('pontos')}
                    >
                      <MapPin className="h-4 w-4 mr-1" />
                      Pontos
                    </Button>
                    <Button
                      variant={mapViewMode === 'rotas' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setMapViewMode('rotas')}
                    >
                      <Route className="h-4 w-4 mr-1" />
                      Rotas
                    </Button>
                  </div>
                  <div className="flex items-center gap-2 ml-auto">
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Layers className="h-3 w-3" />
                      Camadas Ativas
                    </Badge>
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Globe className="h-3 w-3" />
                      Satélite
                    </Badge>
                  </div>
                </div>

                <div className="bg-gray-100 rounded-lg h-96 flex items-center justify-center">
                  <div className="text-center space-y-2">
                    <Map className="h-12 w-12 text-gray-400 mx-auto" />
                    <h3 className="text-lg font-medium text-gray-600">Mapa Interativo</h3>
                    <p className="text-gray-500">
                      {mapViewMode === 'pontos'
                        ? `Exibindo ${filteredPontos.length} pontos turísticos`
                        : `Exibindo ${filteredRotas.length} rotas turísticas`}
                    </p>
                    {selectedPonto && mapViewMode === 'pontos' && (
                      <div className="mt-4 p-4 bg-white rounded-lg border">
                        <h4 className="font-medium">{selectedPonto.nome}</h4>
                        <p className="text-sm text-muted-foreground">{selectedPonto.localizacao.endereco}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge className="text-xs">Lat: {selectedPonto.localizacao.coordenadas.latitude}</Badge>
                          <Badge className="text-xs">Lng: {selectedPonto.localizacao.coordenadas.longitude}</Badge>
                        </div>
                      </div>
                    )}
                    {selectedRota && mapViewMode === 'rotas' && (
                      <div className="mt-4 p-4 bg-white rounded-lg border">
                        <h4 className="font-medium">{selectedRota.nome_rota}</h4>
                        <p className="text-sm text-muted-foreground">
                          {selectedRota.informacoes_rota.distancia_total}km • {selectedRota.pontos_parada.length} paradas
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Ferramentas de Navegação</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <Button variant="outline" size="sm" className="w-full justify-start">
                        <Compass className="h-4 w-4 mr-2" />
                        Buscar Direções
                      </Button>
                      <Button variant="outline" size="sm" className="w-full justify-start">
                        <Camera className="h-4 w-4 mr-2" />
                        Street View
                      </Button>
                      <Button variant="outline" size="sm" className="w-full justify-start">
                        <QrCode className="h-4 w-4 mr-2" />
                        Escanear QR
                      </Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Filtros de Mapa</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Pontos de Interesse</span>
                        <input type="checkbox" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Rotas Ativas</span>
                        <input type="checkbox" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Infraestrutura</span>
                        <input type="checkbox" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Integração Digital</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">App Móvel</span>
                        <Badge variant="outline" className="text-xs">Ativo</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Realidade Aumentada</span>
                        <Badge variant="outline" className="text-xs">Disponível</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">QR Codes</span>
                        <Badge variant="outline" className="text-xs">{pontosTuristicos.filter(p => p.integracao_digital.qr_code).length} ativos</Badge>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="servicos" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Serviços Públicos Gerados Automaticamente
              </CardTitle>
              <CardDescription>
                O mapa turístico gera automaticamente serviços específicos para navegação e informação turística
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <div className="border rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-blue-600" />
                    Informações de Ponto Turístico
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Acesso completo a informações detalhadas de pontos turísticos via QR Code ou aplicativo
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">QR Code</Badge>
                      <Badge variant="outline">Mapa Interativo</Badge>
                      <Badge variant="outline">Realidade Aumentada</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      <strong>Informações disponíveis:</strong> Descrição, história, horários, facilidades, avaliações, fotos
                    </p>
                    <p className="text-sm text-muted-foreground">
                      <strong>Acesso:</strong> Escaneamento de QR Code no local, busca por nome no aplicativo oficial
                    </p>
                  </div>
                </div>

                <div className="border rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Navigation className="h-5 w-5 text-green-600" />
                    Navegação Turística
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Sistema de navegação integrado para rotas turísticas com instruções detalhadas
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">GPS Integrado</Badge>
                      <Badge variant="outline">Instruções por Voz</Badge>
                      <Badge variant="outline">Offline</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      <strong>Funcionalidades:</strong> Rotas otimizadas, pontos de interesse, paradas sugeridas, estimativa de tempo
                    </p>
                    <p className="text-sm text-muted-foreground">
                      <strong>Modalidades:</strong> A pé, bicicleta, veículo, transporte público
                    </p>
                  </div>
                </div>

                <div className="border rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Route className="h-5 w-5 text-purple-600" />
                    Roteiro Turístico Personalizado
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Criação automática de roteiros personalizados baseados em preferências do visitante
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">Inteligência Artificial</Badge>
                      <Badge variant="outline">Preferências Pessoais</Badge>
                      <Badge variant="outline">Tempo Disponível</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      <strong>Critérios:</strong> Interesses pessoais, tempo disponível, condições físicas, modalidade de transporte
                    </p>
                    <p className="text-sm text-muted-foreground">
                      <strong>Resultados:</strong> Roteiro otimizado, orçamento estimado, dicas personalizadas
                    </p>
                  </div>
                </div>

                <div className="border rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Camera className="h-5 w-5 text-orange-600" />
                    Tour Virtual Interativo
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Experiência imersiva de pontos turísticos através de tecnologia 360°, VR e realidade aumentada
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">360 Graus</Badge>
                      <Badge variant="outline">Realidade Virtual</Badge>
                      <Badge variant="outline">Narração</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      <strong>Tecnologias:</strong> Fotografias 360°, vídeos imersivos, realidade aumentada com informações contextuais
                    </p>
                    <p className="text-sm text-muted-foreground">
                      <strong>Acessibilidade:</strong> Visitação virtual para pessoas com mobilidade reduzida ou turismo à distância
                    </p>
                  </div>
                </div>

                <div className="border rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Star className="h-5 w-5 text-yellow-600" />
                    Sistema de Avaliação Turística
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Plataforma para avaliação e feedback de pontos turísticos e rotas pelos visitantes
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">Avaliação por Estrelas</Badge>
                      <Badge variant="outline">Comentários</Badge>
                      <Badge variant="outline">Fotos do Usuário</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      <strong>Critérios:</strong> Beleza natural, infraestrutura, acessibilidade, limpeza, segurança
                    </p>
                    <p className="text-sm text-muted-foreground">
                      <strong>Benefícios:</strong> Melhoria contínua dos serviços, transparência, decisão informada para outros turistas
                    </p>
                  </div>
                </div>

                <div className="border rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Smartphone className="h-5 w-5 text-indigo-600" />
                    Aplicativo Turístico Municipal
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Aplicativo oficial integrado com todas as funcionalidades do mapa turístico
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">iOS e Android</Badge>
                      <Badge variant="outline">Modo Offline</Badge>
                      <Badge variant="outline">Notificações</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      <strong>Funcionalidades:</strong> Mapa offline, rotas, pontos de interesse, eventos, emergências
                    </p>
                    <p className="text-sm text-muted-foreground">
                      <strong>Serviços integrados:</strong> Transporte público, estabelecimentos, clima, notícias turísticas
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
              {isEditing ? 'Editar Ponto Turístico' : 'Novo Ponto Turístico'}
            </DialogTitle>
            <DialogDescription>
              {isEditing ? 'Modifique as informações do ponto turístico' : 'Cadastre um novo ponto turístico no mapa da cidade'}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Nome do Ponto</label>
                <Input
                  value={newPonto.nome}
                  onChange={(e) => setNewPonto(prev => ({ ...prev, nome: e.target.value }))}
                  placeholder="Ex: Mirante da Serra"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Categoria</label>
                <Select
                  value={newPonto.categoria}
                  onValueChange={(value) => setNewPonto(prev => ({ ...prev, categoria: value as any }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categoriasPonto.map(categoria => (
                      <SelectItem key={categoria.value} value={categoria.value}>
                        {categoria.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Endereço</label>
              <Input
                value={newPonto.localizacao?.endereco}
                onChange={(e) => setNewPonto(prev => ({
                  ...prev,
                  localizacao: { ...prev.localizacao!, endereco: e.target.value }
                }))}
                placeholder="Endereço completo do ponto turístico"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Latitude</label>
                <Input
                  type="number"
                  step="0.0001"
                  value={newPonto.localizacao?.coordenadas.latitude}
                  onChange={(e) => setNewPonto(prev => ({
                    ...prev,
                    localizacao: {
                      ...prev.localizacao!,
                      coordenadas: { ...prev.localizacao!.coordenadas, latitude: Number(e.target.value) }
                    }
                  }))}
                  placeholder="-23.5505"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Longitude</label>
                <Input
                  type="number"
                  step="0.0001"
                  value={newPonto.localizacao?.coordenadas.longitude}
                  onChange={(e) => setNewPonto(prev => ({
                    ...prev,
                    localizacao: {
                      ...prev.localizacao!,
                      coordenadas: { ...prev.localizacao!.coordenadas, longitude: Number(e.target.value) }
                    }
                  }))}
                  placeholder="-46.6333"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Descrição Completa</label>
              <Textarea
                value={newPonto.informacoes_turisticas?.descricao_completa}
                onChange={(e) => setNewPonto(prev => ({
                  ...prev,
                  informacoes_turisticas: { ...prev.informacoes_turisticas!, descricao_completa: e.target.value }
                }))}
                placeholder="Descrição detalhada do ponto turístico..."
                rows={3}
              />
            </div>

            <div className="flex justify-end gap-4">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button>
                {isEditing ? 'Atualizar' : 'Cadastrar'} Ponto
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isRotaDialogOpen} onOpenChange={setIsRotaDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {isEditing ? 'Editar Rota Turística' : 'Nova Rota Turística'}
            </DialogTitle>
            <DialogDescription>
              {isEditing ? 'Modifique as informações da rota turística' : 'Cadastre uma nova rota turística conectando pontos de interesse'}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Nome da Rota</label>
                <Input
                  value={newRota.nome_rota}
                  onChange={(e) => setNewRota(prev => ({ ...prev, nome_rota: e.target.value }))}
                  placeholder="Ex: Caminho dos Sabores"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Categoria</label>
                <Select
                  value={newRota.categoria_rota}
                  onValueChange={(value) => setNewRota(prev => ({ ...prev, categoria_rota: value as any }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categoriasRota.map(categoria => (
                      <SelectItem key={categoria.value} value={categoria.value}>
                        {categoria.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Modalidade</label>
                <Select
                  value={newRota.modalidade}
                  onValueChange={(value) => setNewRota(prev => ({ ...prev, modalidade: value as any }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="a_pe">A pé</SelectItem>
                    <SelectItem value="bicicleta">Bicicleta</SelectItem>
                    <SelectItem value="veiculo">Veículo</SelectItem>
                    <SelectItem value="transporte_publico">Transporte Público</SelectItem>
                    <SelectItem value="mista">Mista</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Distância (km)</label>
                <Input
                  type="number"
                  step="0.1"
                  value={newRota.informacoes_rota?.distancia_total}
                  onChange={(e) => setNewRota(prev => ({
                    ...prev,
                    informacoes_rota: { ...prev.informacoes_rota!, distancia_total: Number(e.target.value) }
                  }))}
                  placeholder="2.5"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Duração (minutos)</label>
                <Input
                  type="number"
                  value={newRota.informacoes_rota?.duracao_estimada}
                  onChange={(e) => setNewRota(prev => ({
                    ...prev,
                    informacoes_rota: { ...prev.informacoes_rota!, duracao_estimada: Number(e.target.value) }
                  }))}
                  placeholder="180"
                />
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <Button variant="outline" onClick={() => setIsRotaDialogOpen(false)}>
                Cancelar
              </Button>
              <Button>
                {isEditing ? 'Atualizar' : 'Cadastrar'} Rota
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}