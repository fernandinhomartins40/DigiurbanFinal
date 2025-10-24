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
import { Info, HelpCircle, MapPin, Phone, Clock, Globe, FileText, Download, Megaphone, Languages, Camera, Star, Users, TrendingUp, Calendar, Plus, Search, Filter, Eye, Edit, Trash2, CheckCircle, AlertTriangle, Printer, Share, BookOpen } from 'lucide-react'

interface MaterialTuristico {
  id: string
  codigo_material: string
  titulo: string
  categoria: 'guia_impresso' | 'mapa_cidade' | 'folder_promocional' | 'revista_turistica' | 'catalogo_eventos' | 'manual_visitante' | 'material_digital'
  tipo_midia: 'impresso' | 'digital' | 'hibrido'
  idiomas_disponiveis: string[]
  conteudo: {
    descricao_breve: string
    conteudo_principal: string
    informacoes_destacadas: string[]
    publico_alvo: string[]
  }
  producao: {
    designer_responsavel: string
    revisor_conteudo: string
    data_criacao: string
    data_ultima_revisao: string
    versao_atual: string
  }
  distribuicao: {
    pontos_distribuicao: Array<{
      local: string
      responsavel: string
      quantidade_estoque: number
      demanda_mensal: number
    }>
    canais_digitais: Array<{
      plataforma: string
      url: string
      downloads_totais: number
    }>
  }
  metricas: {
    impressoes: number
    downloads: number
    feedback_positivo: number
    distribuicao_fisica: number
  }
  status: 'ativo' | 'revisao' | 'descontinuado' | 'em_desenvolvimento'
  data_cadastro: string
  ultima_atualizacao: string
}

interface CentralInformacoes {
  id: string
  codigo_central: string
  nome_central: string
  tipo_central: 'fisica' | 'digital' | 'movel' | 'quiosque'
  localizacao: {
    endereco: string
    coordenadas?: { latitude: number; longitude: number }
    pontos_referencia: string[]
  }
  operacao: {
    horario_funcionamento: {
      segunda_sexta: string
      sabado: string
      domingo: string
      feriados: string
    }
    funcionarios: Array<{
      nome: string
      funcao: string
      idiomas: string[]
      especialidades: string[]
    }>
    servicos_oferecidos: string[]
  }
  recursos_disponiveis: {
    equipamentos: string[]
    materiais_promocionais: string[]
    tecnologias: Array<{
      tipo: string
      descricao: string
      disponibilidade: boolean
    }>
  }
  atendimentos: {
    total_mensal: number
    principais_solicitacoes: Array<{
      tipo: string
      quantidade: number
      tempo_medio_atendimento: number
    }>
    satisfacao_media: number
    idiomas_atendimento: string[]
  }
  integracao_digital: {
    site_integrado: boolean
    chat_online: boolean
    app_mobile: boolean
    redes_sociais: string[]
  }
  status: 'operacional' | 'manutencao' | 'reforma' | 'planejamento'
  data_inauguracao: string
  ultima_atualizacao: string
}

const categoriasMaterial = [
  { value: 'guia_impresso', label: 'Guia Impresso', color: 'bg-blue-100 text-blue-800' },
  { value: 'mapa_cidade', label: 'Mapa da Cidade', color: 'bg-green-100 text-green-800' },
  { value: 'folder_promocional', label: 'Folder Promocional', color: 'bg-purple-100 text-purple-800' },
  { value: 'revista_turistica', label: 'Revista Turística', color: 'bg-orange-100 text-orange-800' },
  { value: 'catalogo_eventos', label: 'Catálogo de Eventos', color: 'bg-red-100 text-red-800' },
  { value: 'manual_visitante', label: 'Manual do Visitante', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'material_digital', label: 'Material Digital', color: 'bg-indigo-100 text-indigo-800' }
]

const tiposCentral = [
  { value: 'fisica', label: 'Central Física', color: 'bg-blue-100 text-blue-800' },
  { value: 'digital', label: 'Central Digital', color: 'bg-green-100 text-green-800' },
  { value: 'movel', label: 'Central Móvel', color: 'bg-purple-100 text-purple-800' },
  { value: 'quiosque', label: 'Quiosque', color: 'bg-orange-100 text-orange-800' }
]

const statusMaterial = [
  { value: 'ativo', label: 'Ativo', color: 'bg-green-100 text-green-800' },
  { value: 'revisao', label: 'Em Revisão', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'descontinuado', label: 'Descontinuado', color: 'bg-red-100 text-red-800' },
  { value: 'em_desenvolvimento', label: 'Em Desenvolvimento', color: 'bg-blue-100 text-blue-800' }
]

const statusCentral = [
  { value: 'operacional', label: 'Operacional', color: 'bg-green-100 text-green-800' },
  { value: 'manutencao', label: 'Manutenção', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'reforma', label: 'Reforma', color: 'bg-orange-100 text-orange-800' },
  { value: 'planejamento', label: 'Planejamento', color: 'bg-blue-100 text-blue-800' }
]

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658']

export default function InformacoesTuristicasPage() {
  const { user } = useAdminAuth()
  const [materiais, setMateriais] = useState<MaterialTuristico[]>([])
  const [centrais, setCentrals] = useState<CentralInformacoes[]>([])
  const [filteredMateriais, setFilteredMateriais] = useState<MaterialTuristico[]>([])
  const [filteredCentrals, setFilteredCentrals] = useState<CentralInformacoes[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategoria, setSelectedCategoria] = useState<string>('')
  const [selectedTipoCentral, setSelectedTipoCentral] = useState<string>('')
  const [selectedMaterial, setSelectedMaterial] = useState<MaterialTuristico | null>(null)
  const [selectedCentral, setSelectedCentral] = useState<CentralInformacoes | null>(null)
  const [isMaterialDialogOpen, setIsMaterialDialogOpen] = useState(false)
  const [isCentralDialogOpen, setIsCentralDialogOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [currentTab, setCurrentTab] = useState('dashboard')

  const [newMaterial, setNewMaterial] = useState<Partial<MaterialTuristico>>({
    titulo: '',
    categoria: 'guia_impresso',
    tipo_midia: 'impresso',
    idiomas_disponiveis: ['Português'],
    conteudo: {
      descricao_breve: '',
      conteudo_principal: '',
      informacoes_destacadas: [],
      publico_alvo: []
    },
    producao: {
      designer_responsavel: '',
      revisor_conteudo: '',
      data_criacao: '',
      data_ultima_revisao: '',
      versao_atual: '1.0'
    },
    distribuicao: {
      pontos_distribuicao: [],
      canais_digitais: []
    },
    metricas: {
      impressoes: 0,
      downloads: 0,
      feedback_positivo: 0,
      distribuicao_fisica: 0
    },
    status: 'em_desenvolvimento'
  })

  const [newCentral, setNewCentral] = useState<Partial<CentralInformacoes>>({
    nome_central: '',
    tipo_central: 'fisica',
    localizacao: {
      endereco: '',
      pontos_referencia: []
    },
    operacao: {
      horario_funcionamento: {
        segunda_sexta: '8:00 - 18:00',
        sabado: '8:00 - 14:00',
        domingo: 'Fechado',
        feriados: 'Fechado'
      },
      funcionarios: [],
      servicos_oferecidos: []
    },
    recursos_disponiveis: {
      equipamentos: [],
      materiais_promocionais: [],
      tecnologias: []
    },
    atendimentos: {
      total_mensal: 0,
      principais_solicitacoes: [],
      satisfacao_media: 0,
      idiomas_atendimento: ['Português']
    },
    integracao_digital: {
      site_integrado: false,
      chat_online: false,
      app_mobile: false,
      redes_sociais: []
    },
    status: 'planejamento'
  })

  useEffect(() => {
    const mockMateriais: MaterialTuristico[] = [
      {
        id: '1',
        codigo_material: 'MT-001',
        titulo: 'Guia Oficial da Cidade',
        categoria: 'guia_impresso',
        tipo_midia: 'hibrido',
        idiomas_disponiveis: ['Português', 'Inglês', 'Espanhol'],
        conteudo: {
          descricao_breve: 'Guia completo com todos os pontos turísticos e informações essenciais da cidade',
          conteudo_principal: 'Roteiros sugeridos, história local, gastronomia, hospedagem e transporte',
          informacoes_destacadas: ['Mapa detalhado', 'QR codes para tours', 'Contatos emergência'],
          publico_alvo: ['Turistas nacionais', 'Turistas internacionais', 'Visitantes de negócios']
        },
        producao: {
          designer_responsavel: 'Ana Costa - Design Gráfico',
          revisor_conteudo: 'Carlos Silva - Comunicação',
          data_criacao: '2024-01-15',
          data_ultima_revisao: '2024-09-01',
          versao_atual: '3.2'
        },
        distribuicao: {
          pontos_distribuicao: [
            { local: 'Central de Informações - Centro', responsavel: 'Maria Santos', quantidade_estoque: 500, demanda_mensal: 120 },
            { local: 'Aeroporto - Saguão', responsavel: 'João Pereira', quantidade_estoque: 200, demanda_mensal: 80 },
            { local: 'Rodoviária Municipal', responsavel: 'Ana Oliveira', quantidade_estoque: 150, demanda_mensal: 60 }
          ],
          canais_digitais: [
            { plataforma: 'Site Oficial', url: 'https://turismo.cidade.gov.br/guia', downloads_totais: 3240 },
            { plataforma: 'App Turismo', url: 'app://guia-cidade', downloads_totais: 1580 }
          ]
        },
        metricas: {
          impressoes: 2500,
          downloads: 4820,
          feedback_positivo: 92,
          distribuicao_fisica: 850
        },
        status: 'ativo',
        data_cadastro: '2024-01-15',
        ultima_atualizacao: '2024-09-15'
      },
      {
        id: '2',
        codigo_material: 'MT-002',
        titulo: 'Mapa Turístico Interativo',
        categoria: 'mapa_cidade',
        tipo_midia: 'digital',
        idiomas_disponiveis: ['Português', 'Inglês'],
        conteudo: {
          descricao_breve: 'Mapa digital interativo com todos os pontos turísticos e rotas',
          conteudo_principal: 'Localização GPS, rotas otimizadas, pontos de interesse, serviços',
          informacoes_destacadas: ['Navegação GPS', 'Realidade aumentada', 'Offline disponível'],
          publico_alvo: ['Turistas com smartphone', 'Visitantes independentes']
        },
        producao: {
          designer_responsavel: 'Pedro Lima - UX Designer',
          revisor_conteudo: 'Sandra Costa - Turismo',
          data_criacao: '2024-03-10',
          data_ultima_revisao: '2024-09-18',
          versao_atual: '2.1'
        },
        distribuicao: {
          pontos_distribuicao: [],
          canais_digitais: [
            { plataforma: 'Google Play Store', url: 'https://play.google.com/store/apps/mapa-turistico', downloads_totais: 8540 },
            { plataforma: 'App Store', url: 'https://apps.apple.com/app/mapa-turistico', downloads_totais: 5320 },
            { plataforma: 'Web App', url: 'https://mapa.turismo.cidade.gov.br', downloads_totais: 12800 }
          ]
        },
        metricas: {
          impressoes: 0,
          downloads: 26660,
          feedback_positivo: 88,
          distribuicao_fisica: 0
        },
        status: 'ativo',
        data_cadastro: '2024-03-10',
        ultima_atualizacao: '2024-09-18'
      }
    ]

    const mockCentrals: CentralInformacoes[] = [
      {
        id: '1',
        codigo_central: 'CI-001',
        nome_central: 'Central de Informações Turísticas - Centro',
        tipo_central: 'fisica',
        localizacao: {
          endereco: 'Praça Central, 100 - Centro Histórico',
          coordenadas: { latitude: -23.5505, longitude: -46.6333 },
          pontos_referencia: ['Igreja Matriz', 'Prefeitura Municipal', 'Banco Central']
        },
        operacao: {
          horario_funcionamento: {
            segunda_sexta: '8:00 - 18:00',
            sabado: '8:00 - 14:00',
            domingo: '9:00 - 13:00',
            feriados: '9:00 - 13:00'
          },
          funcionarios: [
            { nome: 'Maria Santos', funcao: 'Coordenadora', idiomas: ['Português', 'Inglês'], especialidades: ['História local', 'Roteiros culturais'] },
            { nome: 'João Silva', funcao: 'Atendente', idiomas: ['Português', 'Espanhol'], especialidades: ['Gastronomia', 'Eventos'] },
            { nome: 'Ana Costa', funcao: 'Atendente', idiomas: ['Português', 'Inglês', 'Francês'], especialidades: ['Hospedagem', 'Transporte'] }
          ],
          servicos_oferecidos: [
            'Informações turísticas gerais',
            'Mapas e guias gratuitos',
            'Orientação sobre roteiros',
            'Reserva de hospedagem',
            'Informações sobre eventos',
            'Suporte emergencial ao turista'
          ]
        },
        recursos_disponiveis: {
          equipamentos: ['Computadores', 'Impressora', 'Scanner', 'Telefone', 'WiFi gratuito'],
          materiais_promocionais: ['Guias impressos', 'Mapas', 'Folders', 'Cartões postais'],
          tecnologias: [
            { tipo: 'Totem interativo', descricao: 'Tela touch com mapa da cidade', disponibilidade: true },
            { tipo: 'QR Code scanner', descricao: 'Leitor para informações rápidas', disponibilidade: true },
            { tipo: 'Tablet informativo', descricao: 'Acesso a roteiros digitais', disponibilidade: true }
          ]
        },
        atendimentos: {
          total_mensal: 1250,
          principais_solicitacoes: [
            { tipo: 'Informações sobre pontos turísticos', quantidade: 450, tempo_medio_atendimento: 8 },
            { tipo: 'Roteiros e mapas', quantidade: 320, tempo_medio_atendimento: 5 },
            { tipo: 'Hospedagem e alimentação', quantidade: 280, tempo_medio_atendimento: 12 },
            { tipo: 'Eventos e programação', quantidade: 200, tempo_medio_atendimento: 6 }
          ],
          satisfacao_media: 9.2,
          idiomas_atendimento: ['Português', 'Inglês', 'Espanhol', 'Francês']
        },
        integracao_digital: {
          site_integrado: true,
          chat_online: true,
          app_mobile: true,
          redes_sociais: ['Instagram', 'Facebook', 'WhatsApp']
        },
        status: 'operacional',
        data_inauguracao: '2022-06-15',
        ultima_atualizacao: '2024-09-20'
      },
      {
        id: '2',
        codigo_central: 'CI-002',
        nome_central: 'Quiosque Informativo - Praça da Estação',
        tipo_central: 'quiosque',
        localizacao: {
          endereco: 'Praça da Estação, s/n - Centro',
          coordenadas: { latitude: -23.5489, longitude: -46.6388 },
          pontos_referencia: ['Estação Ferroviária', 'Terminal de Ônibus', 'Shopping Center']
        },
        operacao: {
          horario_funcionamento: {
            segunda_sexta: '7:00 - 19:00',
            sabado: '7:00 - 17:00',
            domingo: '8:00 - 16:00',
            feriados: '8:00 - 16:00'
          },
          funcionarios: [
            { nome: 'Pedro Santos', funcao: 'Atendente', idiomas: ['Português', 'Inglês'], especialidades: ['Transporte', 'Orientação geral'] }
          ],
          servicos_oferecidos: [
            'Informações básicas sobre turismo',
            'Distribuição de mapas',
            'Orientação sobre transporte público',
            'Conexão WiFi gratuita'
          ]
        },
        recursos_disponiveis: {
          equipamentos: ['Totem digital', 'Dispensador de mapas', 'Telefone de emergência'],
          materiais_promocionais: ['Mapas básicos', 'Folders principais'],
          tecnologias: [
            { tipo: 'Tela digital informativa', descricao: 'Informações em tempo real', disponibilidade: true },
            { tipo: 'WiFi público', descricao: 'Internet gratuita para turistas', disponibilidade: true }
          ]
        },
        atendimentos: {
          total_mensal: 680,
          principais_solicitacoes: [
            { tipo: 'Informações sobre transporte', quantidade: 280, tempo_medio_atendimento: 3 },
            { tipo: 'Direções e localização', quantidade: 220, tempo_medio_atendimento: 2 },
            { tipo: 'Mapas e materiais', quantidade: 180, tempo_medio_atendimento: 1 }
          ],
          satisfacao_media: 8.7,
          idiomas_atendimento: ['Português', 'Inglês']
        },
        integracao_digital: {
          site_integrado: false,
          chat_online: false,
          app_mobile: true,
          redes_sociais: []
        },
        status: 'operacional',
        data_inauguracao: '2023-11-20',
        ultima_atualizacao: '2024-09-15'
      }
    ]

    setMateriais(mockMateriais)
    setCentrals(mockCentrals)
    setFilteredMateriais(mockMateriais)
    setFilteredCentrals(mockCentrals)
  }, [])

  useEffect(() => {
    let filteredM = materiais
    let filteredC = centrais

    if (searchTerm) {
      filteredM = filteredM.filter(material =>
        material.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        material.codigo_material.toLowerCase().includes(searchTerm.toLowerCase())
      )
      filteredC = filteredC.filter(central =>
        central.nome_central.toLowerCase().includes(searchTerm.toLowerCase()) ||
        central.codigo_central.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (selectedCategoria) {
      filteredM = filteredM.filter(material => material.categoria === selectedCategoria)
    }

    if (selectedTipoCentral) {
      filteredC = filteredC.filter(central => central.tipo_central === selectedTipoCentral)
    }

    setFilteredMateriais(filteredM)
    setFilteredCentrals(filteredC)
  }, [searchTerm, selectedCategoria, selectedTipoCentral, materiais, centrais])

  const totalMateriais = materiais.length
  const materiaisAtivos = materiais.filter(m => m.status === 'ativo').length
  const totalCentrals = centrais.length
  const centraisOperacionais = centrais.filter(c => c.status === 'operacional').length
  const totalDownloads = materiais.reduce((sum, material) => sum + material.metricas.downloads, 0)
  const totalAtendimentos = centrais.reduce((sum, central) => sum + central.atendimentos.total_mensal, 0)

  const materiaisPorCategoria = categoriasMaterial.map(categoria => ({
    name: categoria.label,
    value: materiais.filter(m => m.categoria === categoria.value).length
  }))

  const centraisPorTipo = tiposCentral.map(tipo => ({
    name: tipo.label,
    value: centrais.filter(c => c.tipo_central === tipo.value).length
  }))

  const atendimentosMensais = [
    { mes: 'Jan', atendimentos: 980, satisfacao: 8.5 },
    { mes: 'Fev', atendimentos: 1120, satisfacao: 8.7 },
    { mes: 'Mar', atendimentos: 1350, satisfacao: 8.9 },
    { mes: 'Abr', atendimentos: 1580, satisfacao: 9.1 },
    { mes: 'Mai', atendimentos: 1420, satisfacao: 9.0 },
    { mes: 'Jun', atendimentos: 1680, satisfacao: 9.2 }
  ]

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Informações Turísticas</h1>
          <p className="text-muted-foreground mt-2">
            Central de materiais promocionais e pontos de atendimento ao turista
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => { setIsCentralDialogOpen(true); setIsEditing(false) }} className="flex items-center gap-2">
            <Info className="h-4 w-4" />
            Nova Central
          </Button>
          <Button onClick={() => { setIsMaterialDialogOpen(true); setIsEditing(false) }} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Novo Material
          </Button>
        </div>
      </div>

      <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="materiais">Materiais</TabsTrigger>
          <TabsTrigger value="centrais">Centrais</TabsTrigger>
          <TabsTrigger value="distribuicao">Distribuição</TabsTrigger>
          <TabsTrigger value="servicos">Serviços Gerados</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Materiais Turísticos</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalMateriais}</div>
                <p className="text-xs text-muted-foreground">
                  {materiaisAtivos} ativos
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Centrais de Informação</CardTitle>
                <Info className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalCentrals}</div>
                <p className="text-xs text-muted-foreground">
                  {centraisOperacionais} operacionais
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Downloads Totais</CardTitle>
                <Download className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalDownloads.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  Materiais digitais
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Atendimentos Mensais</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalAtendimentos.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  Satisfação: 9.1/10
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Materiais por Categoria</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={materiaisPorCategoria}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {materiaisPorCategoria.map((entry, index) => (
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
                <CardTitle>Centrais por Tipo</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={centraisPorTipo}>
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
              <CardTitle>Evolução de Atendimentos e Satisfação</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={atendimentosMensais}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mes" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Area yAxisId="left" type="monotone" dataKey="atendimentos" stackId="1" stroke="#8884d8" fill="#8884d8" name="Atendimentos" />
                  <Line yAxisId="right" type="monotone" dataKey="satisfacao" stroke="#82ca9d" strokeWidth={2} name="Satisfação" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="materiais" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Filtros e Busca - Materiais Turísticos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Buscar por título ou código do material..."
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
                    {categoriasMaterial.map(categoria => (
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
            {filteredMateriais.map((material) => (
              <Card key={material.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-xl">{material.titulo}</CardTitle>
                        <Badge variant="outline">{material.codigo_material}</Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={categoriasMaterial.find(c => c.value === material.categoria)?.color}>
                          {categoriasMaterial.find(c => c.value === material.categoria)?.label}
                        </Badge>
                        <Badge className={statusMaterial.find(s => s.value === material.status)?.color}>
                          {statusMaterial.find(s => s.value === material.status)?.label}
                        </Badge>
                        <Badge variant="outline">
                          {material.tipo_midia}
                        </Badge>
                        <Badge variant="outline" className="flex items-center gap-1">
                          <Languages className="h-3 w-3" />
                          {material.idiomas_disponiveis.length} idiomas
                        </Badge>
                      </div>
                      <CardDescription className="max-w-2xl">
                        {material.conteudo.descricao_breve}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Printer className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Share className="h-4 w-4" />
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
                        <Download className="h-4 w-4" />
                        Downloads
                      </p>
                      <p className="text-sm text-muted-foreground">{material.metricas.downloads.toLocaleString()}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium flex items-center gap-1">
                        <Printer className="h-4 w-4" />
                        Distribuição Física
                      </p>
                      <p className="text-sm text-muted-foreground">{material.metricas.distribuicao_fisica.toLocaleString()}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium flex items-center gap-1">
                        <Star className="h-4 w-4" />
                        Feedback
                      </p>
                      <p className="text-sm text-muted-foreground">{material.metricas.feedback_positivo}% positivo</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        Versão
                      </p>
                      <p className="text-sm text-muted-foreground">v{material.producao.versao_atual}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="centrais" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Filtros e Busca - Centrais de Informação</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Buscar por nome ou código da central..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full"
                  />
                </div>
                <Select value={selectedTipoCentral} onValueChange={setSelectedTipoCentral}>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="Filtrar por tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todos os tipos</SelectItem>
                    {tiposCentral.map(tipo => (
                      <SelectItem key={tipo.value} value={tipo.value}>
                        {tipo.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button variant="outline" className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Relatório
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6">
            {filteredCentrals.map((central) => (
              <Card key={central.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-xl">{central.nome_central}</CardTitle>
                        <Badge variant="outline">{central.codigo_central}</Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={tiposCentral.find(t => t.value === central.tipo_central)?.color}>
                          {tiposCentral.find(t => t.value === central.tipo_central)?.label}
                        </Badge>
                        <Badge className={statusCentral.find(s => s.value === central.status)?.color}>
                          {statusCentral.find(s => s.value === central.status)?.label}
                        </Badge>
                        <Badge variant="outline" className="flex items-center gap-1">
                          <Languages className="h-3 w-3" />
                          {central.atendimentos.idiomas_atendimento.length} idiomas
                        </Badge>
                      </div>
                      <CardDescription className="max-w-2xl">
                        {central.localizacao.endereco}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <MapPin className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Phone className="h-4 w-4" />
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
                        <Users className="h-4 w-4" />
                        Atendimentos/Mês
                      </p>
                      <p className="text-sm text-muted-foreground">{central.atendimentos.total_mensal.toLocaleString()}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium flex items-center gap-1">
                        <Star className="h-4 w-4" />
                        Satisfação
                      </p>
                      <p className="text-sm text-muted-foreground">{central.atendimentos.satisfacao_media}/10</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        Funcionamento
                      </p>
                      <p className="text-sm text-muted-foreground">{central.operacao.horario_funcionamento.segunda_sexta}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium flex items-center gap-1">
                        <HelpCircle className="h-4 w-4" />
                        Funcionários
                      </p>
                      <p className="text-sm text-muted-foreground">{central.operacao.funcionarios.length} pessoas</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="distribuicao" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Análise de Distribuição e Performance
              </CardTitle>
              <CardDescription>
                Monitoramento de distribuição de materiais e performance das centrais de informação
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Pontos de Distribuição</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {materiais.flatMap(material => material.distribuicao.pontos_distribuicao).map((ponto, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <h4 className="font-medium">{ponto.local}</h4>
                          <p className="text-sm text-muted-foreground">Responsável: {ponto.responsavel}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{ponto.quantidade_estoque} em estoque</p>
                          <p className="text-sm text-muted-foreground">{ponto.demanda_mensal}/mês demanda</p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Canais Digitais</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {materiais.flatMap(material => material.distribuicao.canais_digitais).map((canal, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <h4 className="font-medium">{canal.plataforma}</h4>
                          <p className="text-sm text-muted-foreground">URL: {canal.url}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{canal.downloads_totais.toLocaleString()}</p>
                          <p className="text-sm text-muted-foreground">downloads</p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Performance Digital</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold mb-2">
                      {((totalDownloads / 30000) * 100).toFixed(1)}%
                    </div>
                    <p className="text-sm text-muted-foreground">Taxa de conversão digital</p>
                    <Progress value={(totalDownloads / 30000) * 100} className="mt-2" />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Distribuição Física</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold mb-2">850</div>
                    <p className="text-sm text-muted-foreground">Materiais distribuídos</p>
                    <Progress value={68} className="mt-2" />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Satisfação Geral</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold mb-2">91%</div>
                    <p className="text-sm text-muted-foreground">Feedback positivo</p>
                    <Progress value={91} className="mt-2" />
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="servicos" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5" />
                Serviços Públicos Gerados Automaticamente
              </CardTitle>
              <CardDescription>
                As informações turísticas geram automaticamente serviços específicos para apoio ao visitante
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <div className="border rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <FileText className="h-5 w-5 text-blue-600" />
                    Acesso a Material Turístico
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Download e acesso gratuito a todos os materiais promocionais e informativos da cidade
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">Download Gratuito</Badge>
                      <Badge variant="outline">Múltiplos Idiomas</Badge>
                      <Badge variant="outline">Versão Atualizada</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      <strong>Materiais disponíveis:</strong> Guias oficiais, mapas interativos, folders promocionais, revistas turísticas
                    </p>
                    <p className="text-sm text-muted-foreground">
                      <strong>Formatos:</strong> PDF, aplicativo móvel, versão impressa (nos pontos físicos)
                    </p>
                  </div>
                </div>

                <div className="border rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <HelpCircle className="h-5 w-5 text-green-600" />
                    Atendimento Turístico Presencial
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Orientação personalizada nas centrais de informação turística espalhadas pela cidade
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">Atendimento Multilíngue</Badge>
                      <Badge variant="outline">Especialistas Locais</Badge>
                      <Badge variant="outline">Horário Estendido</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      <strong>Serviços:</strong> Orientação sobre roteiros, reservas de hospedagem, informações sobre eventos
                    </p>
                    <p className="text-sm text-muted-foreground">
                      <strong>Idiomas:</strong> Português, inglês, espanhol, francês (varia por central)
                    </p>
                  </div>
                </div>

                <div className="border rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Phone className="h-5 w-5 text-purple-600" />
                    Central de Atendimento Telefônico
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Suporte por telefone para esclarecimento de dúvidas e orientações turísticas
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">0800 Gratuito</Badge>
                      <Badge variant="outline">Horário Comercial</Badge>
                      <Badge variant="outline">Emergências 24h</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      <strong>Horário:</strong> Segunda a sexta 8h-18h, sábado 8h-14h, domingos 9h-13h
                    </p>
                    <p className="text-sm text-muted-foreground">
                      <strong>Emergências:</strong> Suporte 24 horas para situações urgentes envolvendo turistas
                    </p>
                  </div>
                </div>

                <div className="border rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Globe className="h-5 w-5 text-orange-600" />
                    Chat Online Turístico
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Atendimento instantâneo via chat online no site oficial e redes sociais
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">Resposta Imediata</Badge>
                      <Badge variant="outline">WhatsApp Integrado</Badge>
                      <Badge variant="outline">Bot Inteligente</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      <strong>Canais:</strong> Site oficial, WhatsApp Business, Facebook Messenger, Instagram Direct
                    </p>
                    <p className="text-sm text-muted-foreground">
                      <strong>Funcionalidades:</strong> Respostas automáticas, encaminhamento para especialistas, links úteis
                    </p>
                  </div>
                </div>

                <div className="border rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-red-600" />
                    Biblioteca Digital Turística
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Acervo completo de materiais históricos, culturais e informativos sobre a cidade
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">Acesso Gratuito</Badge>
                      <Badge variant="outline">Busca Avançada</Badge>
                      <Badge variant="outline">Conteúdo Histórico</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      <strong>Conteúdo:</strong> Documentos históricos, fotografias antigas, mapas antigos, publicações acadêmicas
                    </p>
                    <p className="text-sm text-muted-foreground">
                      <strong>Formatos:</strong> PDF, imagens de alta resolução, vídeos documentários, áudios históricos
                    </p>
                  </div>
                </div>

                <div className="border rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Megaphone className="h-5 w-5 text-indigo-600" />
                    Newsletter Turística
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Informativo periódico com novidades, eventos e atualizações turísticas da cidade
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">Assinatura Gratuita</Badge>
                      <Badge variant="outline">Conteúdo Semanal</Badge>
                      <Badge variant="outline">Personalização</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      <strong>Conteúdo:</strong> Agenda de eventos, novos pontos turísticos, promoções especiais, dicas sazonais
                    </p>
                    <p className="text-sm text-muted-foreground">
                      <strong>Distribuição:</strong> E-mail, WhatsApp, push notifications do aplicativo oficial
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={isMaterialDialogOpen} onOpenChange={setIsMaterialDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {isEditing ? 'Editar Material Turístico' : 'Novo Material Turístico'}
            </DialogTitle>
            <DialogDescription>
              {isEditing ? 'Modifique as informações do material' : 'Cadastre um novo material promocional ou informativo'}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Título do Material</label>
                <Input
                  value={newMaterial.titulo}
                  onChange={(e) => setNewMaterial(prev => ({ ...prev, titulo: e.target.value }))}
                  placeholder="Ex: Guia Oficial da Cidade"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Categoria</label>
                <Select
                  value={newMaterial.categoria}
                  onValueChange={(value) => setNewMaterial(prev => ({ ...prev, categoria: value as any }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categoriasMaterial.map(categoria => (
                      <SelectItem key={categoria.value} value={categoria.value}>
                        {categoria.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Descrição Breve</label>
              <Textarea
                value={newMaterial.conteudo?.descricao_breve}
                onChange={(e) => setNewMaterial(prev => ({
                  ...prev,
                  conteudo: { ...prev.conteudo!, descricao_breve: e.target.value }
                }))}
                placeholder="Descrição resumida do material..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Tipo de Mídia</label>
                <Select
                  value={newMaterial.tipo_midia}
                  onValueChange={(value) => setNewMaterial(prev => ({ ...prev, tipo_midia: value as any }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="impresso">Impresso</SelectItem>
                    <SelectItem value="digital">Digital</SelectItem>
                    <SelectItem value="hibrido">Híbrido</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Designer Responsável</label>
                <Input
                  value={newMaterial.producao?.designer_responsavel}
                  onChange={(e) => setNewMaterial(prev => ({
                    ...prev,
                    producao: { ...prev.producao!, designer_responsavel: e.target.value }
                  }))}
                  placeholder="Nome do designer"
                />
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <Button variant="outline" onClick={() => setIsMaterialDialogOpen(false)}>
                Cancelar
              </Button>
              <Button>
                {isEditing ? 'Atualizar' : 'Cadastrar'} Material
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isCentralDialogOpen} onOpenChange={setIsCentralDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {isEditing ? 'Editar Central de Informações' : 'Nova Central de Informações'}
            </DialogTitle>
            <DialogDescription>
              {isEditing ? 'Modifique as informações da central' : 'Cadastre uma nova central de atendimento turístico'}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Nome da Central</label>
                <Input
                  value={newCentral.nome_central}
                  onChange={(e) => setNewCentral(prev => ({ ...prev, nome_central: e.target.value }))}
                  placeholder="Ex: Central de Informações - Centro"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Tipo</label>
                <Select
                  value={newCentral.tipo_central}
                  onValueChange={(value) => setNewCentral(prev => ({ ...prev, tipo_central: value as any }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {tiposCentral.map(tipo => (
                      <SelectItem key={tipo.value} value={tipo.value}>
                        {tipo.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Endereço</label>
              <Input
                value={newCentral.localizacao?.endereco}
                onChange={(e) => setNewCentral(prev => ({
                  ...prev,
                  localizacao: { ...prev.localizacao!, endereco: e.target.value }
                }))}
                placeholder="Endereço completo da central"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Horário Segunda-Sexta</label>
                <Input
                  value={newCentral.operacao?.horario_funcionamento.segunda_sexta}
                  onChange={(e) => setNewCentral(prev => ({
                    ...prev,
                    operacao: {
                      ...prev.operacao!,
                      horario_funcionamento: { ...prev.operacao!.horario_funcionamento, segunda_sexta: e.target.value }
                    }
                  }))}
                  placeholder="8:00 - 18:00"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Horário Sábado</label>
                <Input
                  value={newCentral.operacao?.horario_funcionamento.sabado}
                  onChange={(e) => setNewCentral(prev => ({
                    ...prev,
                    operacao: {
                      ...prev.operacao!,
                      horario_funcionamento: { ...prev.operacao!.horario_funcionamento, sabado: e.target.value }
                    }
                  }))}
                  placeholder="8:00 - 14:00"
                />
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <Button variant="outline" onClick={() => setIsCentralDialogOpen(false)}>
                Cancelar
              </Button>
              <Button>
                {isEditing ? 'Atualizar' : 'Cadastrar'} Central
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}