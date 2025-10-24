'use client'

import { useState, useEffect } from 'react'
import { useAdminAuth } from '@/contexts/AdminAuthContext'
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
  Star,
  Clock,
  DollarSign,
  Users,
  Car,
  Bus,
  Accessibility,
  Wifi,
  ParkingCircle,
  Utensils,
  ShoppingBag,
  TreePine,
  Mountain,
  Waves,
  Church,
  Building,
  Trophy,
  Calendar,
  Thermometer,
  Sun,
  CloudRain,
  TrendingUp,
  Navigation,
  Phone,
  Globe,
  Plus,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Trash2,
  Map,
  Route,
  Heart,
  Share2,
  ImageIcon,
  Info
} from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area } from 'recharts'

interface PontoTuristico {
  id: string
  codigo_ponto: string
  nome: string
  categoria: 'natural' | 'historico' | 'cultural' | 'religioso' | 'aventura' | 'gastronomico' | 'comercial' | 'entretenimento'
  tipo_atrativo: 'cachoeira' | 'trilha' | 'museu' | 'igreja' | 'praca' | 'mirante' | 'parque' | 'monumento' | 'teatro' | 'mercado' | 'festival' | 'outro'
  descricao_completa: string
  descricao_resumida: string
  historia_contexto?: string
  localizacao: {
    endereco: string
    bairro: string
    coordenadas: {
      latitude: number
      longitude: number
    }
    como_chegar: {
      carro: string
      transporte_publico: string
      a_pe: string
    }
    distancia_centro_km: number
  }
  funcionamento: {
    horario_abertura?: string
    horario_fechamento?: string
    dias_funcionamento: string[]
    temporada_alta?: {
      inicio: string
      fim: string
      observacoes: string
    }
    temporada_baixa?: {
      inicio: string
      fim: string
      observacoes: string
    }
    feriados_especiais: string[]
  }
  custos: {
    entrada_gratuita: boolean
    valor_entrada?: number
    desconto_estudante?: number
    desconto_idoso?: number
    desconto_local?: number
    formas_pagamento: string[]
    observacoes_custos?: string
  }
  infraestrutura: {
    capacidade_visitantes?: number
    acessibilidade: {
      cadeirante: boolean
      deficiente_visual: boolean
      deficiente_auditivo: boolean
      observacoes_acessibilidade?: string
    }
    facilidades: {
      estacionamento: boolean
      banheiros: boolean
      wifi_gratuito: boolean
      area_alimentacao: boolean
      loja_souvenirs: boolean
      guia_local: boolean
      aluguel_equipamentos: boolean
    }
    seguranca: {
      iluminacao: boolean
      vigilancia: boolean
      cameras: boolean
      cerca_protecao: boolean
    }
  }
  experiencia: {
    tempo_visita_medio: string
    nivel_dificuldade: 'facil' | 'moderado' | 'dificil' | 'extremo'
    publico_alvo: string[]
    melhor_epoca_visita: string[]
    atividades_disponiveis: string[]
    equipamentos_necessarios?: string[]
  }
  avaliacao: {
    nota_media: number
    total_avaliacoes: number
    comentarios_destaque: string[]
  }
  multimidia: {
    fotos_principais: string[]
    videos: string[]
    tour_virtual?: string
    galeria_completa: string[]
  }
  contato: {
    telefone?: string
    email?: string
    site?: string
    redes_sociais: {
      facebook?: string
      instagram?: string
      youtube?: string
    }
  }
  gestao: {
    responsavel_municipal: string
    responsavel_local?: string
    ultima_manutencao?: string
    proxima_manutencao?: string
    melhorias_planejadas: string[]
  }
  estatisticas: {
    visitantes_mes_atual: number
    visitantes_mes_anterior: number
    visitantes_ano: number
    pico_visitacao: string
    origem_visitantes: { origem: string; porcentagem: number }[]
  }
  status: 'ativo' | 'em_manutencao' | 'temporariamente_fechado' | 'fechado_definitivamente'
  destaque_homepage: boolean
  created_at: string
  updated_at: string
}

interface RoteiroTuristico {
  id: string
  nome_roteiro: string
  descricao: string
  duracao_total: string
  tipo_roteiro: 'caminhada' | 'carro' | 'bicicleta' | 'onibus_turistico' | 'misto'
  nivel_dificuldade: 'facil' | 'moderado' | 'dificil'
  pontos_turisticos: {
    ponto_id: string
    nome_ponto: string
    ordem: number
    tempo_visita: string
    observacoes?: string
  }[]
  publico_recomendado: string[]
  melhor_periodo: string[]
  custo_estimado: {
    minimo: number
    maximo: number
    observacoes: string
  }
  inclui: string[]
  nao_inclui: string[]
  status: 'ativo' | 'inativo'
  created_at: string
}

const categoriasPontos = [
  { value: 'natural', label: 'Natural', icon: TreePine, color: '#10b981' },
  { value: 'historico', label: 'Histórico', icon: Building, color: '#8b5cf6' },
  { value: 'cultural', label: 'Cultural', icon: Trophy, color: '#f59e0b' },
  { value: 'religioso', label: 'Religioso', icon: Church, color: '#06b6d4' },
  { value: 'aventura', label: 'Aventura', icon: Mountain, color: '#ef4444' },
  { value: 'gastronomico', label: 'Gastronômico', icon: Utensils, color: '#f97316' },
  { value: 'comercial', label: 'Comercial', icon: ShoppingBag, color: '#84cc16' },
  { value: 'entretenimento', label: 'Entretenimento', icon: Star, color: '#3b82f6' }
]

const tiposAtrativos = [
  { value: 'cachoeira', label: 'Cachoeira', icon: Waves },
  { value: 'trilha', label: 'Trilha', icon: TreePine },
  { value: 'museu', label: 'Museu', icon: Building },
  { value: 'igreja', label: 'Igreja', icon: Church },
  { value: 'praca', label: 'Praça', icon: MapPin },
  { value: 'mirante', label: 'Mirante', icon: Mountain },
  { value: 'parque', label: 'Parque', icon: TreePine },
  { value: 'monumento', label: 'Monumento', icon: Trophy },
  { value: 'teatro', label: 'Teatro', icon: Star },
  { value: 'mercado', label: 'Mercado', icon: ShoppingBag }
]

const statusPonto = {
  ativo: { label: 'Ativo', color: '#10b981' },
  em_manutencao: { label: 'Em Manutenção', color: '#f59e0b' },
  temporariamente_fechado: { label: 'Temporariamente Fechado', color: '#ef4444' },
  fechado_definitivamente: { label: 'Fechado Definitivamente', color: '#6b7280' }
}

const nivelDificuldade = {
  facil: { label: 'Fácil', color: '#10b981' },
  moderado: { label: 'Moderado', color: '#f59e0b' },
  dificil: { label: 'Difícil', color: '#ef4444' },
  extremo: { label: 'Extremo', color: '#dc2626' }
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#84cc16', '#f97316']

export default function PontosTuristicosPage() {
  const { user } = useAdminAuth()
  const [pontos, setPontos] = useState<PontoTuristico[]>([])
  const [roteiros, setRoteiros] = useState<RoteiroTuristico[]>([])
  const [filteredPontos, setFilteredPontos] = useState<PontoTuristico[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategoria, setFilterCategoria] = useState<string>('')
  const [filterStatus, setFilterStatus] = useState<string>('')
  const [filterAcessibilidade, setFilterAcessibilidade] = useState<string>('')
  const [selectedPonto, setSelectedPonto] = useState<PontoTuristico | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('dashboard')

  // Simular dados
  useEffect(() => {
    const mockPontos: PontoTuristico[] = [
      {
        id: '1',
        codigo_ponto: 'PT-001',
        nome: 'Cachoeira do Sol',
        categoria: 'natural',
        tipo_atrativo: 'cachoeira',
        descricao_completa: 'Uma das mais belas cachoeiras da região, com queda de 35 metros em meio à mata preservada. Conta com poços naturais para banho e trilha de acesso sinalizada.',
        descricao_resumida: 'Cachoeira de 35m com poços naturais e trilha sinalizada',
        historia_contexto: 'Descoberta pelos primeiros colonizadores em 1850, a cachoeira sempre foi um ponto de referência na região.',
        localizacao: {
          endereco: 'Estrada da Cachoeira, km 8, Zona Rural',
          bairro: 'Zona Rural',
          coordenadas: {
            latitude: -23.5505,
            longitude: -46.6333
          },
          como_chegar: {
            carro: 'Seguir pela BR-116, entrar na Estrada da Cachoeira e percorrer 8km',
            transporte_publico: 'Linha Rural 3 até Portão da Fazenda + 2km de caminhada',
            a_pe: 'Trilha de 12km a partir do centro da cidade'
          },
          distancia_centro_km: 8.5
        },
        funcionamento: {
          dias_funcionamento: ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'],
          temporada_alta: {
            inicio: '2024-12-15',
            fim: '2024-03-15',
            observacoes: 'Maior movimento nos fins de semana'
          },
          temporada_baixa: {
            inicio: '2024-03-16',
            fim: '2024-12-14',
            observacoes: 'Ideal para quem busca tranquilidade'
          },
          feriados_especiais: ['Carnaval', 'Páscoa', 'Festa Junina']
        },
        custos: {
          entrada_gratuita: false,
          valor_entrada: 15,
          desconto_estudante: 7,
          desconto_idoso: 7,
          desconto_local: 10,
          formas_pagamento: ['Dinheiro', 'PIX', 'Cartão débito'],
          observacoes_custos: 'Crianças até 5 anos não pagam'
        },
        infraestrutura: {
          capacidade_visitantes: 200,
          acessibilidade: {
            cadeirante: false,
            deficiente_visual: true,
            deficiente_auditivo: true,
            observacoes_acessibilidade: 'Trilha com corrimão para deficientes visuais'
          },
          facilidades: {
            estacionamento: true,
            banheiros: true,
            wifi_gratuito: false,
            area_alimentacao: true,
            loja_souvenirs: false,
            guia_local: true,
            aluguel_equipamentos: false
          },
          seguranca: {
            iluminacao: false,
            vigilancia: true,
            cameras: false,
            cerca_protecao: false
          }
        },
        experiencia: {
          tempo_visita_medio: '3-4 horas',
          nivel_dificuldade: 'moderado',
          publico_alvo: ['Famílias', 'Jovens', 'Aventureiros'],
          melhor_epoca_visita: ['Verão', 'Outono'],
          atividades_disponiveis: ['Banho na cachoeira', 'Trilha', 'Observação da natureza', 'Fotografia'],
          equipamentos_necessarios: ['Protetor solar', 'Calçado adequado', 'Água']
        },
        avaliacao: {
          nota_media: 4.7,
          total_avaliacoes: 234,
          comentarios_destaque: [
            'Local maravilhoso para relaxar',
            'Água cristalina e muito refrescante',
            'Trilha bem sinalizada e segura'
          ]
        },
        multimidia: {
          fotos_principais: ['cachoeira1.jpg', 'cachoeira2.jpg', 'cachoeira3.jpg'],
          videos: ['drone_cachoeira.mp4'],
          tour_virtual: 'https://virtual-tour.com/cachoeira-sol',
          galeria_completa: ['img1.jpg', 'img2.jpg', 'img3.jpg', 'img4.jpg']
        },
        contato: {
          telefone: '(11) 3456-7890',
          site: 'https://cachoeiradosol.com.br',
          redes_sociais: {
            instagram: '@cachoeiradosol',
            facebook: 'CachoeiraSolOficial'
          }
        },
        gestao: {
          responsavel_municipal: 'José Silva - Secretário de Turismo',
          responsavel_local: 'Maria Santos - Administradora Local',
          ultima_manutencao: '2024-01-15',
          proxima_manutencao: '2024-04-15',
          melhorias_planejadas: ['Ampliação do estacionamento', 'Instalação de WiFi', 'Deck de observação']
        },
        estatisticas: {
          visitantes_mes_atual: 1847,
          visitantes_mes_anterior: 1523,
          visitantes_ano: 18450,
          pico_visitacao: 'Fins de semana de dezembro a março',
          origem_visitantes: [
            { origem: 'São Paulo', porcentagem: 45 },
            { origem: 'Rio de Janeiro', porcentagem: 25 },
            { origem: 'Local', porcentagem: 20 },
            { origem: 'Outros', porcentagem: 10 }
          ]
        },
        status: 'ativo',
        destaque_homepage: true,
        created_at: '2023-06-01T00:00:00Z',
        updated_at: '2024-01-22T14:30:00Z'
      },
      {
        id: '2',
        codigo_ponto: 'PT-002',
        nome: 'Igreja Matriz São José',
        categoria: 'historico',
        tipo_atrativo: 'igreja',
        descricao_completa: 'Construída em 1850, a Igreja Matriz São José é um dos principais marcos históricos da cidade, com arquitetura colonial preservada e pinturas sacras do século XIX.',
        descricao_resumida: 'Igreja histórica de 1850 com arquitetura colonial preservada',
        historia_contexto: 'Primeira igreja da cidade, construída pelos pioneiros com pedras da região. Resistiu a dois grandes terremotos.',
        localizacao: {
          endereco: 'Praça Central, s/n, Centro',
          bairro: 'Centro',
          coordenadas: {
            latitude: -23.5515,
            longitude: -46.6323
          },
          como_chegar: {
            carro: 'Centro da cidade, estacionamento na praça',
            transporte_publico: 'Todas as linhas passam pela Praça Central',
            a_pe: 'Centro da cidade, ponto de referência principal'
          },
          distancia_centro_km: 0
        },
        funcionamento: {
          horario_abertura: '06:00',
          horario_fechamento: '19:00',
          dias_funcionamento: ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'],
          feriados_especiais: ['Festa de São José (19/03)', 'Páscoa', 'Natal']
        },
        custos: {
          entrada_gratuita: true,
          formas_pagamento: ['Doações voluntárias']
        },
        infraestrutura: {
          capacidade_visitantes: 300,
          acessibilidade: {
            cadeirante: true,
            deficiente_visual: true,
            deficiente_auditivo: true,
            observacoes_acessibilidade: 'Rampa de acesso e banheiro adaptado'
          },
          facilidades: {
            estacionamento: true,
            banheiros: true,
            wifi_gratuito: true,
            area_alimentacao: false,
            loja_souvenirs: true,
            guia_local: true,
            aluguel_equipamentos: false
          },
          seguranca: {
            iluminacao: true,
            vigilancia: true,
            cameras: true,
            cerca_protecao: false
          }
        },
        experiencia: {
          tempo_visita_medio: '45 minutos',
          nivel_dificuldade: 'facil',
          publico_alvo: ['Famílias', 'Terceira idade', 'Turismo religioso', 'Interessados em história'],
          melhor_epoca_visita: ['Ano todo'],
          atividades_disponiveis: ['Visita guiada', 'Missas', 'Turismo religioso', 'Fotografia'],
          equipamentos_necessarios: []
        },
        avaliacao: {
          nota_media: 4.5,
          total_avaliacoes: 189,
          comentarios_destaque: [
            'Arquitetura belíssima e bem preservada',
            'Local de muita paz e espiritualidade',
            'Guia muito conhecedor da história'
          ]
        },
        multimidia: {
          fotos_principais: ['igreja_externa.jpg', 'interior.jpg', 'altar.jpg'],
          videos: ['historia_igreja.mp4'],
          galeria_completa: ['img1.jpg', 'img2.jpg', 'img3.jpg']
        },
        contato: {
          telefone: '(11) 3333-4444',
          email: 'matriz@paroquiasaojose.com.br'
        },
        gestao: {
          responsavel_municipal: 'Ana Costa - Secretária de Cultura',
          responsavel_local: 'Padre João - Pároco',
          ultima_manutencao: '2023-12-01',
          proxima_manutencao: '2024-06-01',
          melhorias_planejadas: ['Restauração das pinturas', 'Sistema de som', 'Iluminação LED']
        },
        estatisticas: {
          visitantes_mes_atual: 923,
          visitantes_mes_anterior: 876,
          visitantes_ano: 11200,
          pico_visitacao: 'Domingos e feriados religiosos',
          origem_visitantes: [
            { origem: 'Local', porcentagem: 60 },
            { origem: 'São Paulo', porcentagem: 25 },
            { origem: 'Outros', porcentagem: 15 }
          ]
        },
        status: 'ativo',
        destaque_homepage: true,
        created_at: '2023-06-01T00:00:00Z',
        updated_at: '2024-01-20T10:15:00Z'
      },
      {
        id: '3',
        codigo_ponto: 'PT-003',
        nome: 'Mirante do Vale',
        categoria: 'natural',
        tipo_atrativo: 'mirante',
        descricao_completa: 'Localizado a 850m de altitude, oferece vista panorâmica de 360° da cidade e região. Ideal para o pôr do sol e observação das estrelas.',
        descricao_resumida: 'Mirante com vista 360° da cidade, ideal para pôr do sol',
        localizacao: {
          endereco: 'Estrada do Mirante, km 12, Serra da Esperança',
          bairro: 'Serra da Esperança',
          coordenadas: {
            latitude: -23.5495,
            longitude: -46.6343
          },
          como_chegar: {
            carro: 'Estrada do Mirante, 12km do centro, estrada pavimentada',
            transporte_publico: 'Não há transporte público regular',
            a_pe: 'Trilha de 8km a partir do final da cidade'
          },
          distancia_centro_km: 12
        },
        funcionamento: {
          dias_funcionamento: ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'],
          temporada_alta: {
            inicio: '2024-04-01',
            fim: '2024-09-30',
            observacoes: 'Melhor época para observação, céu mais limpo'
          }
        },
        custos: {
          entrada_gratuita: true,
          formas_pagamento: []
        },
        infraestrutura: {
          capacidade_visitantes: 100,
          acessibilidade: {
            cadeirante: false,
            deficiente_visual: false,
            deficiente_auditivo: true,
            observacoes_acessibilidade: 'Acesso apenas por trilha íngreme'
          },
          facilidades: {
            estacionamento: true,
            banheiros: false,
            wifi_gratuito: false,
            area_alimentacao: false,
            loja_souvenirs: false,
            guia_local: false,
            aluguel_equipamentos: false
          },
          seguranca: {
            iluminacao: false,
            vigilancia: false,
            cameras: false,
            cerca_protecao: true
          }
        },
        experiencia: {
          tempo_visita_medio: '2 horas',
          nivel_dificuldade: 'moderado',
          publico_alvo: ['Aventureiros', 'Fotógrafos', 'Casais'],
          melhor_epoca_visita: ['Outono', 'Inverno'],
          atividades_disponiveis: ['Contemplação', 'Fotografia', 'Observação astronômica'],
          equipamentos_necessarios: ['Lanterna', 'Agasalho', 'Calçado adequado']
        },
        avaliacao: {
          nota_media: 4.8,
          total_avaliacoes: 156,
          comentarios_destaque: [
            'Vista espetacular da cidade',
            'Pôr do sol inesquecível',
            'Lugar perfeito para fotos'
          ]
        },
        multimidia: {
          fotos_principais: ['vista_panoramica.jpg', 'por_do_sol.jpg', 'noturna.jpg'],
          videos: ['drone_mirante.mp4'],
          galeria_completa: ['img1.jpg', 'img2.jpg', 'img3.jpg']
        },
        gestao: {
          responsavel_municipal: 'Carlos Prado - Secretário de Meio Ambiente',
          ultima_manutencao: '2024-01-10',
          proxima_manutencao: '2024-07-10',
          melhorias_planejadas: ['Deck de observação', 'Banheiros ecológicos', 'Sinalização']
        },
        estatisticas: {
          visitantes_mes_atual: 567,
          visitantes_mes_anterior: 432,
          visitantes_ano: 6800,
          pico_visitacao: 'Fins de semana ao entardecer',
          origem_visitantes: [
            { origem: 'São Paulo', porcentagem: 50 },
            { origem: 'Local', porcentagem: 30 },
            { origem: 'Outros', porcentagem: 20 }
          ]
        },
        status: 'ativo',
        destaque_homepage: false,
        created_at: '2023-06-01T00:00:00Z',
        updated_at: '2024-01-18T16:20:00Z'
      }
    ]

    const mockRoteiros: RoteiroTuristico[] = [
      {
        id: '1',
        nome_roteiro: 'Roteiro Natureza Completo',
        descricao: 'Um dia inteiro explorando as belezas naturais da cidade, incluindo cachoeira, trilha e mirante',
        duracao_total: '8 horas',
        tipo_roteiro: 'carro',
        nivel_dificuldade: 'moderado',
        pontos_turisticos: [
          {
            ponto_id: '1',
            nome_ponto: 'Cachoeira do Sol',
            ordem: 1,
            tempo_visita: '3 horas',
            observacoes: 'Manhã - ideal para banho'
          },
          {
            ponto_id: '3',
            nome_ponto: 'Mirante do Vale',
            ordem: 2,
            tempo_visita: '2 horas',
            observacoes: 'Final da tarde - pôr do sol'
          }
        ],
        publico_recomendado: ['Famílias', 'Aventureiros', 'Fotógrafos'],
        melhor_periodo: ['Verão', 'Outono'],
        custo_estimado: {
          minimo: 50,
          maximo: 100,
          observacoes: 'Inclui entrada da cachoeira e combustível'
        },
        inclui: ['Mapa do roteiro', 'Orientações de segurança', 'Lista de equipamentos'],
        nao_inclui: ['Transporte', 'Alimentação', 'Guia'],
        status: 'ativo',
        created_at: '2024-01-01T00:00:00Z'
      }
    ]

    setPontos(mockPontos)
    setRoteiros(mockRoteiros)
    setFilteredPontos(mockPontos)
    setLoading(false)
  }, [])

  // Filtros
  useEffect(() => {
    let filtered = pontos

    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.descricao_resumida.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (filterCategoria) {
      filtered = filtered.filter(item => item.categoria === filterCategoria)
    }

    if (filterStatus) {
      filtered = filtered.filter(item => item.status === filterStatus)
    }

    if (filterAcessibilidade === 'cadeirante') {
      filtered = filtered.filter(item => item.infraestrutura.acessibilidade.cadeirante)
    }

    setFilteredPontos(filtered)
  }, [searchTerm, filterCategoria, filterStatus, filterAcessibilidade, pontos])

  // Estatísticas
  const stats = {
    total_pontos: pontos.length,
    pontos_ativos: pontos.filter(p => p.status === 'ativo').length,
    total_visitantes_mes: pontos.reduce((acc, p) => acc + p.estatisticas.visitantes_mes_atual, 0),
    pontos_destaque: pontos.filter(p => p.destaque_homepage).length,
    nota_media_geral: pontos.reduce((acc, p) => acc + p.avaliacao.nota_media, 0) / pontos.length,
    pontos_acessiveis: pontos.filter(p => p.infraestrutura.acessibilidade.cadeirante).length,
    pontos_gratuitos: pontos.filter(p => p.custos.entrada_gratuita).length
  }

  // Dados para gráficos
  const categoriaChart = categoriasPontos.map(cat => ({
    name: cat.label,
    value: pontos.filter(p => p.categoria === cat.value).length,
    color: cat.color
  }))

  const visitantesChart = pontos.map(p => ({
    nome: p.nome.substring(0, 15) + (p.nome.length > 15 ? '...' : ''),
    visitantes: p.estatisticas.visitantes_mes_atual,
    crescimento: ((p.estatisticas.visitantes_mes_atual - p.estatisticas.visitantes_mes_anterior) / p.estatisticas.visitantes_mes_anterior * 100).toFixed(1)
  }))

  const avaliacaoChart = [
    { faixa: '4.5-5.0', count: pontos.filter(p => p.avaliacao.nota_media >= 4.5).length, color: '#10b981' },
    { faixa: '4.0-4.4', count: pontos.filter(p => p.avaliacao.nota_media >= 4.0 && p.avaliacao.nota_media < 4.5).length, color: '#3b82f6' },
    { faixa: '3.5-3.9', count: pontos.filter(p => p.avaliacao.nota_media >= 3.5 && p.avaliacao.nota_media < 4.0).length, color: '#f59e0b' },
    { faixa: '3.0-3.4', count: pontos.filter(p => p.avaliacao.nota_media >= 3.0 && p.avaliacao.nota_media < 3.5).length, color: '#ef4444' }
  ]

  const acessibilidadeChart = [
    { tipo: 'Cadeirante', count: pontos.filter(p => p.infraestrutura.acessibilidade.cadeirante).length, color: '#10b981' },
    { tipo: 'Deficiente Visual', count: pontos.filter(p => p.infraestrutura.acessibilidade.deficiente_visual).length, color: '#3b82f6' },
    { tipo: 'Deficiente Auditivo', count: pontos.filter(p => p.infraestrutura.acessibilidade.deficiente_auditivo).length, color: '#f59e0b' }
  ]

  const handleNovoPonto = () => {
    setSelectedPonto(null)
    setIsModalOpen(true)
  }

  const handleEditPonto = (ponto: PontoTuristico) => {
    setSelectedPonto(ponto)
    setIsModalOpen(true)
  }

  const ServicosGerados = () => (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Serviços Gerados Automaticamente
        </CardTitle>
        <CardDescription>
          Serviços disponíveis no catálogo público baseados nos pontos turísticos
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 border rounded-lg">
            <h4 className="font-semibold text-green-700">Guia de Pontos Turísticos</h4>
            <p className="text-sm text-gray-600 mt-1">
              Informações completas sobre todos os atrativos
            </p>
            <Badge variant="outline" className="mt-2">Protocolo Automático</Badge>
          </div>
          <div className="p-4 border rounded-lg">
            <h4 className="font-semibold text-blue-700">Roteiro Personalizado</h4>
            <p className="text-sm text-gray-600 mt-1">
              Roteiros customizados por interesse e tempo
            </p>
            <Badge variant="outline" className="mt-2">Protocolo Automático</Badge>
          </div>
          <div className="p-4 border rounded-lg">
            <h4 className="font-semibold text-orange-700">Agendamento de Visita</h4>
            <p className="text-sm text-gray-600 mt-1">
              Agendamento para grupos e visitas guiadas
            </p>
            <Badge variant="outline" className="mt-2">Protocolo Automático</Badge>
          </div>
          <div className="p-4 border rounded-lg">
            <h4 className="font-semibold text-purple-700">Informações de Atrativo</h4>
            <p className="text-sm text-gray-600 mt-1">
              Detalhes específicos de cada ponto turístico
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
          <h1 className="text-3xl font-bold">Pontos Turísticos</h1>
          <p className="text-muted-foreground">
            Cadastro e gestão de atrativos turísticos municipais, roteiros e acessibilidade
          </p>
        </div>
        <Button onClick={handleNovoPonto} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Novo Ponto Turístico
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="pontos">Pontos Turísticos</TabsTrigger>
          <TabsTrigger value="roteiros">Roteiros</TabsTrigger>
          <TabsTrigger value="acessibilidade">Acessibilidade</TabsTrigger>
          <TabsTrigger value="mapa">Mapa</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          {/* Cards de Estatísticas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pontos Ativos</CardTitle>
                <MapPin className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.pontos_ativos}</div>
                <p className="text-xs text-muted-foreground">
                  de {stats.total_pontos} pontos totais
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Visitantes Este Mês</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.total_visitantes_mes.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  Distribuídos em {stats.pontos_ativos} pontos
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avaliação Média</CardTitle>
                <Star className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.nota_media_geral.toFixed(1)}/5</div>
                <p className="text-xs text-muted-foreground">
                  Baseado em {pontos.reduce((acc, p) => acc + p.avaliacao.total_avaliacoes, 0)} avaliações
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pontos Acessíveis</CardTitle>
                <Accessibility className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.pontos_acessiveis}</div>
                <p className="text-xs text-muted-foreground">
                  {((stats.pontos_acessiveis / stats.total_pontos) * 100).toFixed(0)}% do total
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Cards Secundários */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Destaque Homepage</CardTitle>
                <Heart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.pontos_destaque}</div>
                <p className="text-xs text-muted-foreground">pontos em destaque</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Entrada Gratuita</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.pontos_gratuitos}</div>
                <p className="text-xs text-muted-foreground">
                  {((stats.pontos_gratuitos / stats.total_pontos) * 100).toFixed(0)}% dos pontos
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Roteiros Ativos</CardTitle>
                <Route className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{roteiros.filter(r => r.status === 'ativo').length}</div>
                <p className="text-xs text-muted-foreground">roteiros disponíveis</p>
              </CardContent>
            </Card>
          </div>

          {/* Gráficos */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Pontos por Categoria</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoriaChart}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${((percent as number) * 100).toFixed(0)}%`}
                    >
                      {categoriaChart.map((entry, index) => (
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
                <CardTitle>Visitantes por Ponto Turístico</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={visitantesChart}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="nome" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="visitantes" fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Distribuição de Avaliações</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={avaliacaoChart}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="faixa" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#f59e0b" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recursos de Acessibilidade</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={acessibilidadeChart}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="tipo" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <ServicosGerados />
        </TabsContent>

        <TabsContent value="pontos" className="space-y-6">
          {/* Filtros */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-wrap gap-4">
                <div className="flex-1 min-w-64">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar pontos turísticos..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={filterCategoria} onValueChange={setFilterCategoria}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todas as categorias</SelectItem>
                    {categoriasPontos.map(cat => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
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
                    <SelectItem value="ativo">Ativo</SelectItem>
                    <SelectItem value="em_manutencao">Em Manutenção</SelectItem>
                    <SelectItem value="temporariamente_fechado">Temporariamente Fechado</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterAcessibilidade} onValueChange={setFilterAcessibilidade}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Acessibilidade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todos</SelectItem>
                    <SelectItem value="cadeirante">Acessível Cadeirante</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="icon">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Lista de Pontos Turísticos */}
          <div className="grid grid-cols-1 gap-4">
            {filteredPontos.map((ponto) => (
              <Card key={ponto.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold">{ponto.nome}</h3>
                        <Badge
                          variant="outline"
                          style={{ borderColor: statusPonto[ponto.status].color }}
                        >
                          {statusPonto[ponto.status].label}
                        </Badge>
                        <Badge variant="secondary">
                          {categoriasPontos.find(c => c.value === ponto.categoria)?.label}
                        </Badge>
                        {ponto.destaque_homepage && (
                          <Badge variant="outline" className="text-red-600">
                            <Heart className="h-3 w-3 mr-1" />
                            Destaque
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{ponto.codigo_ponto}</p>
                      <p className="text-sm mb-3">{ponto.descricao_resumida}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditPonto(ponto)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    <div>
                      <Label className="text-xs font-semibold text-muted-foreground">LOCALIZAÇÃO</Label>
                      <p className="text-sm">{ponto.localizacao.bairro}</p>
                      <p className="text-xs text-muted-foreground">
                        {ponto.localizacao.distancia_centro_km}km do centro
                      </p>
                    </div>
                    <div>
                      <Label className="text-xs font-semibold text-muted-foreground">VISITANTES</Label>
                      <p className="text-sm">{ponto.estatisticas.visitantes_mes_atual} este mês</p>
                      <p className="text-xs text-muted-foreground">
                        {ponto.estatisticas.visitantes_ano.toLocaleString()} no ano
                      </p>
                    </div>
                    <div>
                      <Label className="text-xs font-semibold text-muted-foreground">AVALIAÇÃO</Label>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-semibold">{ponto.avaliacao.nota_media}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {ponto.avaliacao.total_avaliacoes} avaliações
                      </p>
                    </div>
                    <div>
                      <Label className="text-xs font-semibold text-muted-foreground">CUSTO</Label>
                      <p className="text-sm">
                        {ponto.custos.entrada_gratuita ? 'GRATUITO' : `R$ ${ponto.custos.valor_entrada}`}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {ponto.experiencia.tempo_visita_medio}
                      </p>
                    </div>
                  </div>

                  <div className="text-sm space-y-1">
                    <p><strong>Tipo:</strong> {tiposAtrativos.find(t => t.value === ponto.tipo_atrativo)?.label}</p>
                    <p><strong>Dificuldade:</strong>
                      <Badge
                        variant="outline"
                        className="ml-2"
                        style={{ borderColor: nivelDificuldade[ponto.experiencia.nivel_dificuldade].color }}
                      >
                        {nivelDificuldade[ponto.experiencia.nivel_dificuldade].label}
                      </Badge>
                    </p>
                    <p><strong>Responsável:</strong> {ponto.gestao.responsavel_municipal}</p>

                    {/* Facilidades */}
                    <div className="flex gap-2 flex-wrap mt-2">
                      {ponto.infraestrutura.facilidades.estacionamento && <Badge variant="outline"><ParkingCircle className="h-3 w-3 mr-1" />Estacionamento</Badge>}
                      {ponto.infraestrutura.facilidades.banheiros && <Badge variant="outline">Banheiros</Badge>}
                      {ponto.infraestrutura.facilidades.wifi_gratuito && <Badge variant="outline"><Wifi className="h-3 w-3 mr-1" />WiFi</Badge>}
                      {ponto.infraestrutura.acessibilidade.cadeirante && <Badge variant="outline" className="text-green-600"><Accessibility className="h-3 w-3 mr-1" />Acessível</Badge>}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="roteiros" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Roteiros Turísticos</CardTitle>
              <CardDescription>Roteiros personalizados conectando pontos turísticos</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {roteiros.map((roteiro) => (
                  <div key={roteiro.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-semibold">{roteiro.nome_roteiro}</h4>
                        <p className="text-sm text-muted-foreground">{roteiro.descricao}</p>
                      </div>
                      <Badge variant="outline" className={roteiro.status === 'ativo' ? 'text-green-600' : 'text-gray-600'}>
                        {roteiro.status}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-3">
                      <div>
                        <Label className="text-xs font-semibold text-muted-foreground">DURAÇÃO</Label>
                        <p>{roteiro.duracao_total}</p>
                      </div>
                      <div>
                        <Label className="text-xs font-semibold text-muted-foreground">TIPO</Label>
                        <p>{roteiro.tipo_roteiro}</p>
                      </div>
                      <div>
                        <Label className="text-xs font-semibold text-muted-foreground">CUSTO ESTIMADO</Label>
                        <p>R$ {roteiro.custo_estimado.minimo} - R$ {roteiro.custo_estimado.maximo}</p>
                      </div>
                    </div>

                    <div className="mb-3">
                      <Label className="text-xs font-semibold text-muted-foreground">PONTOS DO ROTEIRO</Label>
                      <div className="space-y-2 mt-2">
                        {roteiro.pontos_turisticos.map((ponto) => (
                          <div key={ponto.ponto_id} className="flex items-center gap-2 text-sm">
                            <Badge variant="outline" className="w-6 h-6 rounded-full p-0 flex items-center justify-center">
                              {ponto.ordem}
                            </Badge>
                            <span>{ponto.nome_ponto}</span>
                            <span className="text-muted-foreground">({ponto.tempo_visita})</span>
                            {ponto.observacoes && <span className="text-xs text-blue-600">- {ponto.observacoes}</span>}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-1 flex-wrap">
                      <span className="text-xs"><strong>Público:</strong></span>
                      {roteiro.publico_recomendado.map((publico, index) => (
                        <Badge key={index} variant="outline" className="text-xs">{publico}</Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="acessibilidade" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Pontos Acessíveis por Tipo</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={acessibilidadeChart}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="tipo" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Status de Acessibilidade</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Pontos com Acesso para Cadeirantes</span>
                    <span className="font-semibold">{stats.pontos_acessiveis}</span>
                  </div>
                  <Progress value={(stats.pontos_acessiveis / stats.total_pontos) * 100} className="w-full" />
                  <div className="text-sm text-muted-foreground">
                    Meta: 80% dos pontos acessíveis até 2025
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Relatório de Acessibilidade por Ponto</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pontos.map(ponto => (
                  <div key={ponto.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold">{ponto.nome}</h4>
                      <div className="flex gap-2">
                        {ponto.infraestrutura.acessibilidade.cadeirante && (
                          <Badge variant="outline" className="text-green-600">
                            <Accessibility className="h-3 w-3 mr-1" />Cadeirante
                          </Badge>
                        )}
                        {ponto.infraestrutura.acessibilidade.deficiente_visual && (
                          <Badge variant="outline" className="text-blue-600">Visual</Badge>
                        )}
                        {ponto.infraestrutura.acessibilidade.deficiente_auditivo && (
                          <Badge variant="outline" className="text-purple-600">Auditivo</Badge>
                        )}
                      </div>
                    </div>
                    {ponto.infraestrutura.acessibilidade.observacoes_acessibilidade && (
                      <p className="text-sm text-muted-foreground">
                        {ponto.infraestrutura.acessibilidade.observacoes_acessibilidade}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mapa" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Map className="h-5 w-5" />
                Mapa dos Pontos Turísticos
              </CardTitle>
              <CardDescription>
                Visualização geográfica de todos os atrativos turísticos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <Map className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Mapa interativo dos pontos turísticos</p>
                  <p className="text-sm text-gray-400">
                    Funcionalidade de mapa será implementada com integração de mapas
                  </p>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Legenda</h4>
                  <div className="space-y-2">
                    {categoriasPontos.map(categoria => (
                      <div key={categoria.value} className="flex items-center gap-2 text-sm">
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: categoria.color }}></div>
                        <span>{categoria.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Estatísticas do Mapa</h4>
                  <div className="space-y-2 text-sm">
                    <p>Pontos cadastrados: {stats.total_pontos}</p>
                    <p>Área coberta: 45 km²</p>
                    <p>Distância máxima do centro: {Math.max(...pontos.map(p => p.localizacao.distancia_centro_km))}km</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}