'use client'

import { useState, useEffect } from 'react'
import { useAdminAuth } from '@/hooks/useAdminAuth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import {
  MapPin,
  Camera,
  Info,
  Heart,
  Star,
  Clock,
  Phone,
  Mail,
  Globe,
  Users,
  Calendar,
  FileText,
  MessageSquare,
  TrendingUp,
  Navigation,
  Car,
  Bus,
  Plane,
  Hotel,
  Utensils,
  ShoppingBag,
  Plus,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Trash2,
  ThumbsUp,
  AlertTriangle
} from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area } from 'recharts'

interface AtendimentoTuristico {
  id: string
  protocolo: string
  data_atendimento: string
  tipo_atendimento: 'informacoes_turisticas' | 'apoio_turista' | 'orientacao_roteiros' | 'reclamacao' | 'sugestao' | 'emergencia' | 'traducao' | 'hospedagem'
  categoria_solicitacao: 'atrativo' | 'hospedagem' | 'alimentacao' | 'transporte' | 'evento' | 'cultura' | 'emergencia' | 'documentacao' | 'compras'
  turista: {
    nome: string
    origem: string
    pais: string
    idade: number
    grupo_tamanho: number
    contato: {
      telefone?: string
      email?: string
    }
    estadia: {
      data_chegada: string
      data_saida: string
      local_hospedagem?: string
      tipo_viagem: 'lazer' | 'negocios' | 'evento' | 'familia' | 'educacional' | 'religioso'
    }
    necessidades_especiais?: string
    idiomas: string[]
    primeira_visita: boolean
  }
  solicitacao: {
    descricao: string
    local_interesse?: string[]
    periodo_disponivel?: string
    orcamento_estimado?: {
      minimo: number
      maximo: number
    }
    preferencias: {
      atividades: string[]
      alimentacao: string[]
      hospedagem: string[]
      transporte: string[]
    }
  }
  atendimento_realizado: {
    funcionario_responsavel: string
    canal_atendimento: 'presencial' | 'telefone' | 'whatsapp' | 'email' | 'site' | 'app'
    duracao_minutos: number
    materiais_entregues: string[]
    orientacoes_fornecidas: string[]
    estabelecimentos_indicados: {
      nome: string
      categoria: string
      endereco: string
      contato: string
      observacoes?: string
    }[]
    roteiro_sugerido?: {
      nome: string
      duracao: string
      locais: string[]
      observacoes: string
    }
  }
  follow_up?: {
    agendado: boolean
    data_contato?: string
    meio_contato: string
    feedback_coletado?: {
      satisfacao: number
      comentarios: string
      sugestoes: string
      recomendaria: boolean
    }
  }
  resultados?: {
    visitou_locais_sugeridos: string[]
    utilizou_servicos_indicados: string[]
    permanencia_extra_dias?: number
    gasto_estimado?: number
    experiencia_geral: number
  }
  status: 'em_atendimento' | 'orientado' | 'aguardando_retorno' | 'concluido' | 'cancelado'
  prioridade: 'baixa' | 'normal' | 'alta' | 'urgente'
  observacoes_internas: string
  created_at: string
  updated_at: string
}

const tiposAtendimento = [
  { value: 'informacoes_turisticas', label: 'Informações Turísticas', icon: Info, color: '#3b82f6' },
  { value: 'apoio_turista', label: 'Apoio ao Turista', icon: Users, color: '#10b981' },
  { value: 'orientacao_roteiros', label: 'Orientação de Roteiros', icon: Navigation, color: '#f59e0b' },
  { value: 'reclamacao', label: 'Reclamação', icon: AlertTriangle, color: '#ef4444' },
  { value: 'sugestao', label: 'Sugestão', icon: MessageSquare, color: '#8b5cf6' },
  { value: 'emergencia', label: 'Emergência', icon: AlertTriangle, color: '#dc2626' },
  { value: 'traducao', label: 'Tradução/Intérprete', icon: Globe, color: '#06b6d4' },
  { value: 'hospedagem', label: 'Hospedagem', icon: Hotel, color: '#84cc16' }
]

const categoriasSolicitacao = [
  { value: 'atrativo', label: 'Atrativos Turísticos', color: '#10b981' },
  { value: 'hospedagem', label: 'Hospedagem', color: '#3b82f6' },
  { value: 'alimentacao', label: 'Alimentação', color: '#f59e0b' },
  { value: 'transporte', label: 'Transporte', color: '#8b5cf6' },
  { value: 'evento', label: 'Eventos', color: '#ef4444' },
  { value: 'cultura', label: 'Cultura', color: '#06b6d4' },
  { value: 'emergencia', label: 'Emergência', color: '#dc2626' },
  { value: 'documentacao', label: 'Documentação', color: '#84cc16' },
  { value: 'compras', label: 'Compras', color: '#f97316' }
]

const statusAtendimento = {
  em_atendimento: { label: 'Em Atendimento', color: '#f59e0b' },
  orientado: { label: 'Orientado', color: '#3b82f6' },
  aguardando_retorno: { label: 'Aguardando Retorno', color: '#8b5cf6' },
  concluido: { label: 'Concluído', color: '#10b981' },
  cancelado: { label: 'Cancelado', color: '#ef4444' }
}

const prioridadeColors = {
  baixa: '#10b981',
  normal: '#3b82f6',
  alta: '#f59e0b',
  urgente: '#ef4444'
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#84cc16', '#f97316']

export default function AtendimentosTurismoPage() {
  const { user } = useAdminAuth()
  const [atendimentos, setAtendimentos] = useState<AtendimentoTuristico[]>([])
  const [filteredAtendimentos, setFilteredAtendimentos] = useState<AtendimentoTuristico[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterTipo, setFilterTipo] = useState<string>('')
  const [filterStatus, setFilterStatus] = useState<string>('')
  const [filterOrigem, setFilterOrigem] = useState<string>('')
  const [selectedAtendimento, setSelectedAtendimento] = useState<AtendimentoTuristico | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('dashboard')

  // Simular dados
  useEffect(() => {
    const mockData: AtendimentoTuristico[] = [
      {
        id: '1',
        protocolo: 'TUR-2024-001',
        data_atendimento: '2024-01-22',
        tipo_atendimento: 'informacoes_turisticas',
        categoria_solicitacao: 'atrativo',
        turista: {
          nome: 'Carlos Silva',
          origem: 'São Paulo - SP',
          pais: 'Brasil',
          idade: 35,
          grupo_tamanho: 4,
          contato: {
            telefone: '(11) 98765-4321',
            email: 'carlos.silva@email.com'
          },
          estadia: {
            data_chegada: '2024-01-20',
            data_saida: '2024-01-25',
            local_hospedagem: 'Hotel Central',
            tipo_viagem: 'lazer'
          },
          idiomas: ['Português'],
          primeira_visita: false
        },
        solicitacao: {
          descricao: 'Informações sobre atrativos naturais e trilhas para família com crianças',
          local_interesse: ['Parque Natural', 'Cachoeiras', 'Trilhas leves'],
          periodo_disponivel: 'Manhã e tarde',
          orcamento_estimado: {
            minimo: 200,
            maximo: 500
          },
          preferencias: {
            atividades: ['Trilhas leves', 'Banho de cachoeira', 'Observação de aves'],
            alimentacao: ['Comida típica', 'Restaurante familiar'],
            hospedagem: ['Hotel'],
            transporte: ['Carro próprio']
          }
        },
        atendimento_realizado: {
          funcionario_responsavel: 'Maria Santos - Guia de Turismo',
          canal_atendimento: 'presencial',
          duracao_minutos: 45,
          materiais_entregues: ['Mapa turístico', 'Folder trilhas', 'Lista restaurantes'],
          orientacoes_fornecidas: [
            'Roteiro Cachoeira do Sol (2h de caminhada)',
            'Parque Municipal com playground',
            'Horários de funcionamento dos atrativos'
          ],
          estabelecimentos_indicados: [
            {
              nome: 'Restaurante Sabor da Terra',
              categoria: 'Alimentação',
              endereco: 'Rua Principal, 123',
              contato: '(11) 3456-7890',
              observacoes: 'Especialidade em comida regional, ambiente familiar'
            },
            {
              nome: 'Guia de Trilhas João',
              categoria: 'Serviços',
              endereco: 'Centro de Informações Turísticas',
              contato: '(11) 9876-5432',
              observacoes: 'Especialista em trilhas familiares'
            }
          ],
          roteiro_sugerido: {
            nome: 'Roteiro Família Natureza',
            duracao: '2 dias',
            locais: ['Cachoeira do Sol', 'Parque Municipal', 'Mirante do Vale', 'Centro Histórico'],
            observacoes: 'Roteiro adaptado para crianças de 8-12 anos'
          }
        },
        follow_up: {
          agendado: true,
          data_contato: '2024-01-26',
          meio_contato: 'whatsapp',
          feedback_coletado: {
            satisfacao: 9,
            comentarios: 'Atendimento excelente, família adorou as trilhas',
            sugestoes: 'Mais placas indicativas nas trilhas',
            recomendaria: true
          }
        },
        resultados: {
          visitou_locais_sugeridos: ['Cachoeira do Sol', 'Parque Municipal', 'Centro Histórico'],
          utilizou_servicos_indicados: ['Restaurante Sabor da Terra', 'Guia de Trilhas João'],
          permanencia_extra_dias: 1,
          gasto_estimado: 420,
          experiencia_geral: 9
        },
        status: 'concluido',
        prioridade: 'normal',
        observacoes_internas: 'Turista fidelizado, 3ª visita à cidade. Família muito satisfeita.',
        created_at: '2024-01-22T09:30:00Z',
        updated_at: '2024-01-26T16:45:00Z'
      },
      {
        id: '2',
        protocolo: 'TUR-2024-002',
        data_atendimento: '2024-01-23',
        tipo_atendimento: 'apoio_turista',
        categoria_solicitacao: 'emergencia',
        turista: {
          nome: 'Jennifer Smith',
          origem: 'New York - USA',
          pais: 'Estados Unidos',
          idade: 28,
          grupo_tamanho: 2,
          contato: {
            telefone: '+1 555-123-4567',
            email: 'jennifer.smith@email.com'
          },
          estadia: {
            data_chegada: '2024-01-22',
            data_saida: '2024-01-28',
            local_hospedagem: 'Pousada Vista Bela',
            tipo_viagem: 'lazer'
          },
          necessidades_especiais: 'Inglês fluente necessário',
          idiomas: ['Inglês'],
          primeira_visita: true
        },
        solicitacao: {
          descricao: 'Perdeu documentos (passaporte e carteira) no primeiro dia. Precisa de orientação para resolver a situação',
          preferencias: {
            atividades: [],
            alimentacao: [],
            hospedagem: [],
            transporte: []
          }
        },
        atendimento_realizado: {
          funcionario_responsavel: 'Pedro Costa - Bilíngue',
          canal_atendimento: 'presencial',
          duracao_minutos: 90,
          materiais_entregues: ['Guia procedimentos consulado', 'Telefones úteis', 'Mapa delegacia'],
          orientacoes_fornecidas: [
            'Procedimentos consulado americano (São Paulo)',
            'Boletim de ocorrência na delegacia local',
            'Contato com banco para bloqueio de cartões',
            'Documentação temporária para viagem'
          ],
          estabelecimentos_indicados: [
            {
              nome: 'Delegacia de Polícia Central',
              categoria: 'Serviços Públicos',
              endereco: 'Av. Central, 456',
              contato: '(11) 190',
              observacoes: 'Atendimento 24h para turistas'
            },
            {
              nome: 'Western Union',
              categoria: 'Serviços Financeiros',
              endereco: 'Shopping Center',
              contato: '(11) 2222-3333',
              observacoes: 'Recebimento de dinheiro internacional'
            }
          ]
        },
        follow_up: {
          agendado: true,
          data_contato: '2024-01-24',
          meio_contato: 'whatsapp'
        },
        status: 'aguardando_retorno',
        prioridade: 'urgente',
        observacoes_internas: 'Turista estrangeira em situação vulnerável. Acompanhar resolução dos documentos.',
        created_at: '2024-01-23T10:15:00Z',
        updated_at: '2024-01-24T14:20:00Z'
      },
      {
        id: '3',
        protocolo: 'TUR-2024-003',
        data_atendimento: '2024-01-24',
        tipo_atendimento: 'orientacao_roteiros',
        categoria_solicitacao: 'cultura',
        turista: {
          nome: 'Roberto Fernandes',
          origem: 'Rio de Janeiro - RJ',
          pais: 'Brasil',
          idade: 52,
          grupo_tamanho: 2,
          contato: {
            telefone: '(21) 97777-8888',
            email: 'roberto.fernandes@email.com'
          },
          estadia: {
            data_chegada: '2024-01-24',
            data_saida: '2024-01-27',
            local_hospedagem: 'Hotel Fazenda Serenidade',
            tipo_viagem: 'cultura'
          },
          idiomas: ['Português'],
          primeira_visita: true
        },
        solicitacao: {
          descricao: 'Interessado na história local, arquitetura colonial e artesanato tradicional',
          local_interesse: ['Centro Histórico', 'Museus', 'Casa do Artesão', 'Igreja Matriz'],
          periodo_disponivel: 'Flexível',
          orcamento_estimado: {
            minimo: 300,
            maximo: 800
          },
          preferencias: {
            atividades: ['Visitas guiadas', 'Museus', 'Artesanato', 'Fotografia'],
            alimentacao: ['Culinária típica', 'Restaurantes históricos'],
            hospedagem: ['Hotel fazenda'],
            transporte: ['Caminhada', 'Carro próprio']
          }
        },
        atendimento_realizado: {
          funcionario_responsavel: 'Ana Histórica - Guia Cultural',
          canal_atendimento: 'presencial',
          duracao_minutos: 60,
          materiais_entregues: ['Guia histórico da cidade', 'Mapa centro histórico', 'Agenda cultural'],
          orientacoes_fornecidas: [
            'Roteiro histórico: 200 anos de história',
            'Horários dos museus e exposições',
            'Oficinas de artesanato disponíveis',
            'História da arquitetura colonial local'
          ],
          estabelecimentos_indicados: [
            {
              nome: 'Casa do Artesão',
              categoria: 'Cultura',
              endereco: 'Largo da Matriz, 15',
              contato: '(11) 3333-4444',
              observacoes: 'Demonstrações de artesanato às 15h'
            },
            {
              nome: 'Restaurante Colonial',
              categoria: 'Alimentação',
              endereco: 'Rua do Comércio, 89',
              contato: '(11) 3333-5555',
              observacoes: 'Ambiente histórico, receitas centenárias'
            }
          ],
          roteiro_sugerido: {
            nome: 'Roteiro Histórico-Cultural',
            duracao: '3 dias',
            locais: ['Igreja Matriz', 'Museu da Cidade', 'Casa do Artesão', 'Centro Histórico', 'Fazenda Histórica'],
            observacoes: 'Roteiro temático com foco na preservação histórica'
          }
        },
        status: 'orientado',
        prioridade: 'normal',
        observacoes_internas: 'Turista cultural interessado em história local. Potencial para turismo de retorno.',
        created_at: '2024-01-24T14:00:00Z',
        updated_at: '2024-01-24T15:00:00Z'
      }
    ]

    setAtendimentos(mockData)
    setFilteredAtendimentos(mockData)
    setLoading(false)
  }, [])

  // Filtros
  useEffect(() => {
    let filtered = atendimentos

    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.turista.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.protocolo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.turista.origem.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (filterTipo) {
      filtered = filtered.filter(item => item.tipo_atendimento === filterTipo)
    }

    if (filterStatus) {
      filtered = filtered.filter(item => item.status === filterStatus)
    }

    if (filterOrigem) {
      filtered = filtered.filter(item =>
        item.turista.pais.toLowerCase().includes(filterOrigem.toLowerCase())
      )
    }

    setFilteredAtendimentos(filtered)
  }, [searchTerm, filterTipo, filterStatus, filterOrigem, atendimentos])

  // Estatísticas
  const stats = {
    total: atendimentos.length,
    hoje: atendimentos.filter(a => new Date(a.data_atendimento).toDateString() === new Date().toDateString()).length,
    em_atendimento: atendimentos.filter(a => a.status === 'em_atendimento').length,
    concluidos: atendimentos.filter(a => a.status === 'concluido').length,
    satisfacao_media: atendimentos
      .filter(a => a.follow_up?.feedback_coletado)
      .reduce((acc, a) => acc + (a.follow_up?.feedback_coletado?.satisfacao || 0), 0) /
      atendimentos.filter(a => a.follow_up?.feedback_coletado).length || 0,
    turistas_origem: [...new Set(atendimentos.map(a => a.turista.origem))].length,
    turistas_internacionais: atendimentos.filter(a => a.turista.pais !== 'Brasil').length,
    tempo_medio: atendimentos.reduce((acc, a) => acc + a.atendimento_realizado.duracao_minutos, 0) / atendimentos.length
  }

  // Dados para gráficos
  const tipoAtendimentoChart = tiposAtendimento.map(tipo => ({
    name: tipo.label,
    value: atendimentos.filter(a => a.tipo_atendimento === tipo.value).length,
    color: tipo.color
  }))

  const origemTuristasChart = [
    { origem: 'São Paulo', count: 12, color: '#3b82f6' },
    { origem: 'Rio de Janeiro', count: 8, color: '#10b981' },
    { origem: 'Minas Gerais', count: 6, color: '#f59e0b' },
    { origem: 'Internacional', count: 4, color: '#ef4444' },
    { origem: 'Outros Estados', count: 7, color: '#8b5cf6' }
  ]

  const satisfacaoChart = [
    { nota: '8-10', count: 15, color: '#10b981' },
    { nota: '6-7', count: 8, color: '#f59e0b' },
    { nota: '4-5', count: 3, color: '#ef4444' },
    { nota: '1-3', count: 1, color: '#dc2626' }
  ]

  const atendimentosDiarios = [
    { dia: 'Seg', total: 12, concluidos: 10 },
    { dia: 'Ter', total: 15, concluidos: 13 },
    { dia: 'Qua', total: 8, concluidos: 7 },
    { dia: 'Qui', total: 18, concluidos: 16 },
    { dia: 'Sex', total: 22, concluidos: 19 },
    { dia: 'Sab', total: 35, concluidos: 31 },
    { dia: 'Dom', total: 28, concluidos: 24 }
  ]

  const handleNovoAtendimento = () => {
    setSelectedAtendimento(null)
    setIsModalOpen(true)
  }

  const handleEditAtendimento = (atendimento: AtendimentoTuristico) => {
    setSelectedAtendimento(atendimento)
    setIsModalOpen(true)
  }

  const handleViewDetails = (atendimento: AtendimentoTuristico) => {
    setSelectedAtendimento(atendimento)
    // Implementar modal de detalhes
  }

  const ServicosGerados = () => (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Info className="h-5 w-5" />
          Serviços Gerados Automaticamente
        </CardTitle>
        <CardDescription>
          Serviços disponíveis no catálogo público baseados nos atendimentos turísticos
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 border rounded-lg">
            <h4 className="font-semibold text-blue-700">Informações Turísticas</h4>
            <p className="text-sm text-gray-600 mt-1">
              Orientações sobre atrativos e serviços da cidade
            </p>
            <Badge variant="outline" className="mt-2">Protocolo Automático</Badge>
          </div>
          <div className="p-4 border rounded-lg">
            <h4 className="font-semibold text-green-700">Guia da Cidade</h4>
            <p className="text-sm text-gray-600 mt-1">
              Material informativo completo sobre o município
            </p>
            <Badge variant="outline" className="mt-2">Protocolo Automático</Badge>
          </div>
          <div className="p-4 border rounded-lg">
            <h4 className="font-semibold text-orange-700">Apoio ao Turista</h4>
            <p className="text-sm text-gray-600 mt-1">
              Assistência especializada para visitantes
            </p>
            <Badge variant="outline" className="mt-2">Protocolo Automático</Badge>
          </div>
          <div className="p-4 border rounded-lg">
            <h4 className="font-semibold text-purple-700">Orientação de Roteiros</h4>
            <p className="text-sm text-gray-600 mt-1">
              Roteiros personalizados por interesse
            </p>
            <Badge variant="outline" className="mt-2">Protocolo Automático</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  if (loading) {
    return <div className="flex justify-center p-8">Carregando...</div>
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Atendimentos Turísticos</h1>
          <p className="text-muted-foreground">
            PDV para informações turísticas e apoio ao visitante
          </p>
        </div>
        <Button onClick={handleNovoAtendimento} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Novo Atendimento
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="atendimentos">Atendimentos</TabsTrigger>
          <TabsTrigger value="estatisticas">Estatísticas</TabsTrigger>
          <TabsTrigger value="feedback">Feedback</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          {/* Cards de Estatísticas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Atendimentos Hoje</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.hoje}</div>
                <p className="text-xs text-muted-foreground">
                  Total: {stats.total} atendimentos
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Em Atendimento</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.em_atendimento}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.concluidos} concluídos
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Satisfação Média</CardTitle>
                <Star className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.satisfacao_media.toFixed(1)}/10</div>
                <p className="text-xs text-muted-foreground">
                  Baseado em feedback dos turistas
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tempo Médio</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.tempo_medio.toFixed(0)} min</div>
                <p className="text-xs text-muted-foreground">
                  Por atendimento
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Cards Secundários */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Origens Diferentes</CardTitle>
                <MapPin className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.turistas_origem}</div>
                <p className="text-xs text-muted-foreground">cidades/regiões</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Turistas Internacionais</CardTitle>
                <Globe className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.turistas_internacionais}</div>
                <p className="text-xs text-muted-foreground">
                  {((stats.turistas_internacionais / stats.total) * 100).toFixed(1)}% do total
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Taxa de Recomendação</CardTitle>
                <ThumbsUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">96%</div>
                <p className="text-xs text-muted-foreground">
                  Turistas recomendariam a cidade
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Gráficos */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Tipos de Atendimento</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={tipoAtendimentoChart}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${((percent as number) * 100).toFixed(0)}%`}
                    >
                      {tipoAtendimentoChart.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Origem dos Turistas</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={origemTuristasChart}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="origem" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Atendimentos por Dia da Semana</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={atendimentosDiarios}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="dia" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="total" fill="#e5e7eb" name="Total" />
                    <Bar dataKey="concluidos" fill="#10b981" name="Concluídos" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Satisfação dos Turistas</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={satisfacaoChart}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                      label={({ nota, count }) => `${nota}: ${count}`}
                    >
                      {satisfacaoChart.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <ServicosGerados />
        </TabsContent>

        <TabsContent value="atendimentos" className="space-y-6">
          {/* Filtros */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-wrap gap-4">
                <div className="flex-1 min-w-64">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar por turista, protocolo ou origem..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={filterTipo} onValueChange={setFilterTipo}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Tipo de Atendimento" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todos os tipos</SelectItem>
                    {tiposAtendimento.map(tipo => (
                      <SelectItem key={tipo.value} value={tipo.value}>
                        {tipo.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todos os status</SelectItem>
                    <SelectItem value="em_atendimento">Em Atendimento</SelectItem>
                    <SelectItem value="orientado">Orientado</SelectItem>
                    <SelectItem value="concluido">Concluído</SelectItem>
                    <SelectItem value="aguardando_retorno">Aguardando Retorno</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterOrigem} onValueChange={setFilterOrigem}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Origem" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todas as origens</SelectItem>
                    <SelectItem value="brasil">Brasil</SelectItem>
                    <SelectItem value="internacional">Internacional</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="icon">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Lista de Atendimentos */}
          <div className="grid grid-cols-1 gap-4">
            {filteredAtendimentos.map((atendimento) => (
              <Card key={atendimento.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold">{atendimento.protocolo}</h3>
                        <Badge
                          variant="outline"
                          style={{ borderColor: statusAtendimento[atendimento.status].color }}
                        >
                          {statusAtendimento[atendimento.status].label}
                        </Badge>
                        <Badge
                          variant="outline"
                          style={{ borderColor: prioridadeColors[atendimento.prioridade] }}
                        >
                          {atendimento.prioridade}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground space-y-1">
                        <p><strong>Turista:</strong> {atendimento.turista.nome} ({atendimento.turista.origem})</p>
                        <p><strong>Tipo:</strong> {tiposAtendimento.find(t => t.value === atendimento.tipo_atendimento)?.label}</p>
                        <p><strong>Data:</strong> {new Date(atendimento.data_atendimento).toLocaleDateString()}</p>
                        <p><strong>Responsável:</strong> {atendimento.atendimento_realizado.funcionario_responsavel}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewDetails(atendimento)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditAtendimento(atendimento)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="text-sm">
                    <p className="mb-2"><strong>Solicitação:</strong> {atendimento.solicitacao.descricao}</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                      <div>
                        <Label className="text-xs font-semibold text-muted-foreground">ESTADIA</Label>
                        <p>{new Date(atendimento.turista.estadia.data_chegada).toLocaleDateString()} - {new Date(atendimento.turista.estadia.data_saida).toLocaleDateString()}</p>
                        <p>{atendimento.turista.estadia.local_hospedagem}</p>
                        <p>Grupo: {atendimento.turista.grupo_tamanho} pessoas</p>
                      </div>
                      <div>
                        <Label className="text-xs font-semibold text-muted-foreground">ATENDIMENTO</Label>
                        <p>Canal: {atendimento.atendimento_realizado.canal_atendimento}</p>
                        <p>Duração: {atendimento.atendimento_realizado.duracao_minutos} min</p>
                        <p>Materiais: {atendimento.atendimento_realizado.materiais_entregues.length}</p>
                      </div>
                    </div>

                    {atendimento.atendimento_realizado.roteiro_sugerido && (
                      <div className="mt-2 p-2 bg-blue-50 rounded">
                        <strong>Roteiro Sugerido:</strong> {atendimento.atendimento_realizado.roteiro_sugerido.nome}
                        <p className="text-xs">Duração: {atendimento.atendimento_realizado.roteiro_sugerido.duracao}</p>
                      </div>
                    )}

                    {atendimento.follow_up?.feedback_coletado && (
                      <div className="flex items-center gap-2 mt-2">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span>Satisfação: {atendimento.follow_up.feedback_coletado.satisfacao}/10</span>
                        {atendimento.follow_up.feedback_coletado.recomendaria && (
                          <Badge variant="outline" className="text-green-600">Recomendaria</Badge>
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="estatisticas" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance Mensal</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Atendimentos Realizados</span>
                    <span className="font-semibold">{stats.total}</span>
                  </div>
                  <Progress value={75} className="w-full" />
                  <div className="text-sm text-muted-foreground">
                    Meta mensal: 40 atendimentos (93% atingida)
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Indicadores de Qualidade</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Satisfação Média</span>
                    <span className="font-semibold">{stats.satisfacao_media.toFixed(1)}/10</span>
                  </div>
                  <Progress value={stats.satisfacao_media * 10} className="w-full" />
                  <div className="text-sm text-muted-foreground">
                    {atendimentos.filter(a => a.follow_up?.feedback_coletado && a.follow_up.feedback_coletado.satisfacao >= 8).length} avaliações excelentes
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Análise de Demandas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {categoriasSolicitacao.map(categoria => {
                  const count = atendimentos.filter(a => a.categoria_solicitacao === categoria.value).length
                  const percentage = atendimentos.length > 0 ? (count / atendimentos.length) * 100 : 0
                  return (
                    <div key={categoria.value} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-semibold" style={{ color: categoria.color }}>
                          {categoria.label}
                        </h4>
                        <Badge variant="outline">{count}</Badge>
                      </div>
                      <Progress value={percentage} className="w-full" />
                      <p className="text-xs text-muted-foreground mt-1">
                        {percentage.toFixed(1)}% do total
                      </p>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="feedback" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Feedback dos Turistas</CardTitle>
              <CardDescription>Avaliações e sugestões dos visitantes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {atendimentos
                  .filter(a => a.follow_up?.feedback_coletado)
                  .map(atendimento => (
                    <div key={atendimento.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-semibold">{atendimento.turista.nome}</h4>
                          <p className="text-sm text-muted-foreground">{atendimento.turista.origem}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-500" />
                          <span className="font-semibold">{atendimento.follow_up?.feedback_coletado?.satisfacao}</span>
                        </div>
                      </div>

                      <p className="text-sm mb-2">{atendimento.follow_up?.feedback_coletado?.comentarios}</p>

                      {atendimento.follow_up?.feedback_coletado?.sugestoes && (
                        <div className="text-sm text-blue-600 mb-2">
                          <strong>Sugestão:</strong> {atendimento.follow_up.feedback_coletado.sugestoes}
                        </div>
                      )}

                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>{new Date(atendimento.data_atendimento).toLocaleDateString()}</span>
                        {atendimento.follow_up?.feedback_coletado?.recomendaria && (
                          <Badge variant="outline" className="text-green-600">Recomendaria</Badge>
                        )}
                      </div>
                    </div>
                  ))
                }
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}