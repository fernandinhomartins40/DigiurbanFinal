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
  Hotel,
  Utensils,
  Car,
  Users,
  Star,
  MapPin,
  Phone,
  Mail,
  Globe,
  Calendar,
  Clock,
  DollarSign,
  Award,
  Shield,
  CheckCircle,
  XCircle,
  AlertTriangle,
  FileText,
  Camera,
  Wifi,
  ParkingCircle,
  Accessibility,
  CreditCard,
  Coffee,
  Plane,
  ShoppingBag,
  Music,
  Gamepad2,
  Plus,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Trash2,
  ExternalLink,
  TrendingUp,
  Building,
  Store
} from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area } from 'recharts'

interface EstabelecimentoTuristico {
  id: string
  codigo_estabelecimento: string
  nome_comercial: string
  razao_social: string
  categoria: 'hospedagem' | 'alimentacao' | 'transporte' | 'entretenimento' | 'servicos_turisticos' | 'compras' | 'cultura' | 'saude_beleza'
  subcategoria: string
  cnpj: string
  inscricao_municipal: string
  dados_comerciais: {
    endereco: string
    bairro: string
    cep: string
    coordenadas?: {
      latitude: number
      longitude: number
    }
    telefone_principal: string
    telefone_secundario?: string
    email: string
    site?: string
    redes_sociais: {
      instagram?: string
      facebook?: string
      tripadvisor?: string
    }
  }
  funcionamento: {
    dias_semana: {
      [key: string]: {
        aberto: boolean
        abertura?: string
        fechamento?: string
      }
    }
    funcionamento_feriados: boolean
    temporada_alta: {
      periodo: string
      observacoes?: string
    }
    temporada_baixa?: {
      periodo: string
      observacoes?: string
    }
  }
  servicos_oferecidos: {
    descricao_principal: string
    servicos_detalhados: string[]
    especialidades?: string[]
    publico_alvo: string[]
    capacidade?: {
      total_pessoas?: number
      total_quartos?: number
      total_mesas?: number
      estacionamento_vagas?: number
    }
  }
  infraestrutura: {
    facilidades: {
      wifi_gratuito: boolean
      estacionamento: boolean
      acessibilidade_cadeirante: boolean
      aceita_cartao: boolean
      delivery: boolean
      reservas_online: boolean
      ar_condicionado: boolean
      area_fumante: boolean
    }
    equipamentos_especiais?: string[]
    observacoes_infraestrutura?: string
  }
  qualificacoes: {
    certificacoes: {
      tipo: string
      orgao_emissor: string
      data_emissao: string
      data_validade: string
      numero_certificado: string
    }[]
    premios_reconhecimentos?: {
      titulo: string
      ano: string
      orgao: string
    }[]
    classificacao_oficial?: {
      estrelas?: number
      categoria?: string
      observacoes?: string
    }
  }
  proprietarios: {
    responsavel_legal: string
    contato_responsavel: string
    email_responsavel: string
    gerente_operacional?: string
    contato_gerente?: string
  }
  precos_referencia: {
    faixa_preco: 'economico' | 'medio' | 'alto' | 'premium'
    preco_minimo?: number
    preco_maximo?: number
    observacoes_preco: string
    formas_pagamento: string[]
    promocoes_sazonais?: string[]
  }
  avaliacao_turismo: {
    nota_secretaria: number
    criterios_avaliacao: {
      atendimento: number
      qualidade: number
      preco: number
      localizacao: number
      infraestrutura: number
    }
    observacoes_secretaria: string
    data_ultima_visita: string
    proximo_acompanhamento: string
  }
  avaliacao_publica: {
    nota_media: number
    total_avaliacoes: number
    comentarios_destaque: string[]
    pontos_fortes: string[]
    pontos_melhorar: string[]
  }
  status_cadastro: 'ativo' | 'pendente_documentacao' | 'em_analise' | 'suspenso' | 'inativo'
  participacao_programas: {
    cadastur: boolean
    numero_cadastur?: string
    programas_municipais: string[]
    parcerias_ativas: string[]
  }
  estatisticas: {
    clientes_mes: number
    ocupacao_media?: number
    crescimento_anual: number
    sazonalidade: {
      alta: string[]
      baixa: string[]
    }
  }
  documentacao: {
    alvara_funcionamento: {
      numero: string
      data_emissao: string
      data_validade: string
      status: 'valido' | 'vencido' | 'em_renovacao'
    }
    licenca_sanitaria?: {
      numero: string
      data_emissao: string
      data_validade: string
      status: 'valido' | 'vencido' | 'em_renovacao'
    }
    documentos_adicionais: string[]
  }
  created_at: string
  updated_at: string
}

const categoriasEstabelecimentos = [
  { value: 'hospedagem', label: 'Hospedagem', icon: Hotel, color: '#3b82f6' },
  { value: 'alimentacao', label: 'Alimentação', icon: Utensils, color: '#f59e0b' },
  { value: 'transporte', label: 'Transporte', icon: Car, color: '#8b5cf6' },
  { value: 'entretenimento', label: 'Entretenimento', icon: Music, color: '#ef4444' },
  { value: 'servicos_turisticos', label: 'Serviços Turísticos', icon: Users, color: '#10b981' },
  { value: 'compras', label: 'Compras', icon: ShoppingBag, color: '#84cc16' },
  { value: 'cultura', label: 'Cultura', icon: Building, color: '#06b6d4' },
  { value: 'saude_beleza', label: 'Saúde e Beleza', icon: Star, color: '#f97316' }
]

const subcategorias = {
  hospedagem: ['Hotel', 'Pousada', 'Resort', 'Hostel', 'Casa de Temporada', 'Camping'],
  alimentacao: ['Restaurante', 'Lanchonete', 'Pizzaria', 'Bar', 'Cafeteria', 'Sorveteria', 'Food Truck'],
  transporte: ['Táxi', 'Transfer', 'Aluguel de Carros', 'Agência de Viagem', 'Transporte Turístico'],
  entretenimento: ['Balada', 'Casa de Shows', 'Cinema', 'Teatro', 'Parque de Diversões', 'Boliche'],
  servicos_turisticos: ['Guia de Turismo', 'Agência Receptiva', 'Aluguel de Equipamentos', 'Fotografia'],
  compras: ['Loja de Souvenirs', 'Artesanato', 'Shopping', 'Mercado Municipal', 'Feira'],
  cultura: ['Museu', 'Galeria', 'Centro Cultural', 'Casa de Cultura'],
  saude_beleza: ['Spa', 'Salão de Beleza', 'Massagem', 'Academia']
}

const statusCadastro = {
  ativo: { label: 'Ativo', color: '#10b981' },
  pendente_documentacao: { label: 'Pendente Documentação', color: '#f59e0b' },
  em_analise: { label: 'Em Análise', color: '#3b82f6' },
  suspenso: { label: 'Suspenso', color: '#ef4444' },
  inativo: { label: 'Inativo', color: '#6b7280' }
}

const faixasPreco = {
  economico: { label: 'Econômico', color: '#10b981' },
  medio: { label: 'Médio', color: '#3b82f6' },
  alto: { label: 'Alto', color: '#f59e0b' },
  premium: { label: 'Premium', color: '#8b5cf6' }
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#84cc16', '#f97316']

export default function EstabelecimentosLocaisPage() {
  const { user } = useAdminAuth()
  const [estabelecimentos, setEstabelecimentos] = useState<EstabelecimentoTuristico[]>([])
  const [filteredEstabelecimentos, setFilteredEstabelecimentos] = useState<EstabelecimentoTuristico[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategoria, setFilterCategoria] = useState<string>('')
  const [filterStatus, setFilterStatus] = useState<string>('')
  const [filterFaixaPreco, setFilterFaixaPreco] = useState<string>('')
  const [selectedEstabelecimento, setSelectedEstabelecimento] = useState<EstabelecimentoTuristico | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('dashboard')

  // Simular dados
  useEffect(() => {
    const mockData: EstabelecimentoTuristico[] = [
      {
        id: '1',
        codigo_estabelecimento: 'EST-001',
        nome_comercial: 'Hotel Vista Bela',
        razao_social: 'Vista Bela Hotelaria Ltda',
        categoria: 'hospedagem',
        subcategoria: 'Hotel',
        cnpj: '12.345.678/0001-90',
        inscricao_municipal: '123456789',
        dados_comerciais: {
          endereco: 'Av. Central, 123, Centro',
          bairro: 'Centro',
          cep: '12345-678',
          coordenadas: {
            latitude: -23.5505,
            longitude: -46.6333
          },
          telefone_principal: '(11) 3456-7890',
          telefone_secundario: '(11) 98765-4321',
          email: 'contato@hotelvistabela.com.br',
          site: 'https://www.hotelvistabela.com.br',
          redes_sociais: {
            instagram: '@hotelvistabela',
            facebook: 'HotelVistaBela',
            tripadvisor: 'Hotel-Vista-Bela'
          }
        },
        funcionamento: {
          dias_semana: {
            segunda: { aberto: true, abertura: '00:00', fechamento: '23:59' },
            terca: { aberto: true, abertura: '00:00', fechamento: '23:59' },
            quarta: { aberto: true, abertura: '00:00', fechamento: '23:59' },
            quinta: { aberto: true, abertura: '00:00', fechamento: '23:59' },
            sexta: { aberto: true, abertura: '00:00', fechamento: '23:59' },
            sabado: { aberto: true, abertura: '00:00', fechamento: '23:59' },
            domingo: { aberto: true, abertura: '00:00', fechamento: '23:59' }
          },
          funcionamento_feriados: true,
          temporada_alta: {
            periodo: 'Dezembro a Março',
            observacoes: 'Reservas antecipadas recomendadas'
          },
          temporada_baixa: {
            periodo: 'Abril a Novembro',
            observacoes: 'Promoções especiais disponíveis'
          }
        },
        servicos_oferecidos: {
          descricao_principal: 'Hotel 3 estrelas com vista para a serra, oferecendo conforto e hospitalidade',
          servicos_detalhados: [
            'Recepção 24h',
            'Café da manhã incluso',
            'WiFi gratuito',
            'Estacionamento privativo',
            'Serviço de quarto',
            'Lavanderia',
            'Transfer aeroporto'
          ],
          especialidades: ['Vista panorâmica', 'Localização central', 'Atendimento personalizado'],
          publico_alvo: ['Turismo de lazer', 'Executivos', 'Famílias'],
          capacidade: {
            total_quartos: 45,
            total_pessoas: 120,
            estacionamento_vagas: 30
          }
        },
        infraestrutura: {
          facilidades: {
            wifi_gratuito: true,
            estacionamento: true,
            acessibilidade_cadeirante: true,
            aceita_cartao: true,
            delivery: false,
            reservas_online: true,
            ar_condicionado: true,
            area_fumante: false
          },
          equipamentos_especiais: ['Elevador', 'Gerador', 'Sistema de segurança', 'Piscina'],
          observacoes_infraestrutura: '2 quartos adaptados para deficientes'
        },
        qualificacoes: {
          certificacoes: [
            {
              tipo: 'ABNT NBR 15401',
              orgao_emissor: 'ABNT',
              data_emissao: '2023-06-01',
              data_validade: '2026-06-01',
              numero_certificado: 'ABNT-2023-0001'
            }
          ],
          premios_reconhecimentos: [
            {
              titulo: 'Melhor Hotel 3 Estrelas',
              ano: '2023',
              orgao: 'Associação Regional de Turismo'
            }
          ],
          classificacao_oficial: {
            estrelas: 3,
            categoria: 'Turístico',
            observacoes: 'Classificação oficial pelo Ministério do Turismo'
          }
        },
        proprietarios: {
          responsavel_legal: 'Carlos Silva',
          contato_responsavel: '(11) 98765-4321',
          email_responsavel: 'carlos@hotelvistabela.com.br',
          gerente_operacional: 'Ana Costa',
          contato_gerente: '(11) 97654-3210'
        },
        precos_referencia: {
          faixa_preco: 'medio',
          preco_minimo: 180,
          preco_maximo: 320,
          observacoes_preco: 'Valores por pessoa em apto duplo, café incluso',
          formas_pagamento: ['Dinheiro', 'PIX', 'Cartão débito/crédito', 'Parcelamento'],
          promocoes_sazonais: ['Desconto 15% temporada baixa', 'Pacote família 3ª pessoa grátis']
        },
        avaliacao_turismo: {
          nota_secretaria: 8.5,
          criterios_avaliacao: {
            atendimento: 9,
            qualidade: 8,
            preco: 8,
            localizacao: 9,
            infraestrutura: 8
          },
          observacoes_secretaria: 'Estabelecimento bem gerido, atende bem os turistas',
          data_ultima_visita: '2024-01-15',
          proximo_acompanhamento: '2024-07-15'
        },
        avaliacao_publica: {
          nota_media: 4.3,
          total_avaliacoes: 187,
          comentarios_destaque: [
            'Vista maravilhosa da serra',
            'Café da manhã muito bom',
            'Localização excelente'
          ],
          pontos_fortes: ['Localização', 'Vista', 'Atendimento', 'Limpeza'],
          pontos_melhorar: ['WiFi velocidade', 'Renovação dos quartos']
        },
        status_cadastro: 'ativo',
        participacao_programas: {
          cadastur: true,
          numero_cadastur: 'CAD12345678',
          programas_municipais: ['Circuito Turístico Regional', 'Selo Qualidade Turística'],
          parcerias_ativas: ['Agências de viagem locais', 'Plataformas online']
        },
        estatisticas: {
          clientes_mes: 234,
          ocupacao_media: 78,
          crescimento_anual: 12,
          sazonalidade: {
            alta: ['Dezembro', 'Janeiro', 'Fevereiro', 'Julho'],
            baixa: ['Maio', 'Junho', 'Agosto', 'Setembro']
          }
        },
        documentacao: {
          alvara_funcionamento: {
            numero: 'ALV-2024-001',
            data_emissao: '2024-01-01',
            data_validade: '2024-12-31',
            status: 'valido'
          },
          licenca_sanitaria: {
            numero: 'LS-2024-001',
            data_emissao: '2024-01-01',
            data_validade: '2024-12-31',
            status: 'valido'
          },
          documentos_adicionais: ['Certificado de Prevenção de Incêndio', 'Laudo Técnico Elevador']
        },
        created_at: '2023-06-01T00:00:00Z',
        updated_at: '2024-01-22T14:30:00Z'
      },
      {
        id: '2',
        codigo_estabelecimento: 'EST-002',
        nome_comercial: 'Restaurante Sabor da Terra',
        razao_social: 'Sabor da Terra Alimentação Ltda',
        categoria: 'alimentacao',
        subcategoria: 'Restaurante',
        cnpj: '98.765.432/0001-10',
        inscricao_municipal: '987654321',
        dados_comerciais: {
          endereco: 'Rua do Comércio, 456, Centro',
          bairro: 'Centro',
          cep: '12345-789',
          telefone_principal: '(11) 3333-4444',
          email: 'contato@sabordaterra.com.br',
          redes_sociais: {
            instagram: '@sabordaterraoficial',
            facebook: 'SaborDaTerraRestaurante'
          }
        },
        funcionamento: {
          dias_semana: {
            segunda: { aberto: false },
            terca: { aberto: true, abertura: '11:00', fechamento: '22:00' },
            quarta: { aberto: true, abertura: '11:00', fechamento: '22:00' },
            quinta: { aberto: true, abertura: '11:00', fechamento: '22:00' },
            sexta: { aberto: true, abertura: '11:00', fechamento: '23:00' },
            sabado: { aberto: true, abertura: '11:00', fechamento: '23:00' },
            domingo: { aberto: true, abertura: '11:00', fechamento: '21:00' }
          },
          funcionamento_feriados: true,
          temporada_alta: {
            periodo: 'Dezembro a Março',
            observacoes: 'Funcionamento especial nos feriados'
          }
        },
        servicos_oferecidos: {
          descricao_principal: 'Restaurante especializado em culinária regional com ambiente familiar',
          servicos_detalhados: [
            'Almoço executivo',
            'Jantar à la carte',
            'Pratos regionais',
            'Sobremesas caseiras',
            'Eventos privados',
            'Delivery'
          ],
          especialidades: ['Comida regional', 'Pratos caseiros', 'Ambiente familiar'],
          publico_alvo: ['Famílias', 'Turistas', 'Executivos', 'Casais'],
          capacidade: {
            total_mesas: 20,
            total_pessoas: 80
          }
        },
        infraestrutura: {
          facilidades: {
            wifi_gratuito: true,
            estacionamento: false,
            acessibilidade_cadeirante: true,
            aceita_cartao: true,
            delivery: true,
            reservas_online: false,
            ar_condicionado: true,
            area_fumante: false
          },
          observacoes_infraestrutura: 'Rampa de acesso e banheiro adaptado'
        },
        qualificacoes: {
          certificacoes: [
            {
              tipo: 'Boas Práticas',
              orgao_emissor: 'Vigilância Sanitária',
              data_emissao: '2024-01-01',
              data_validade: '2025-01-01',
              numero_certificado: 'VS-2024-0001'
            }
          ],
          premios_reconhecimentos: [
            {
              titulo: 'Melhor Restaurante Regional',
              ano: '2023',
              orgao: 'Guia Gastronômico Local'
            }
          ]
        },
        proprietarios: {
          responsavel_legal: 'Maria Oliveira',
          contato_responsavel: '(11) 99999-8888',
          email_responsavel: 'maria@sabordaterra.com.br'
        },
        precos_referencia: {
          faixa_preco: 'medio',
          preco_minimo: 35,
          preco_maximo: 85,
          observacoes_preco: 'Valores por prato individual',
          formas_pagamento: ['Dinheiro', 'PIX', 'Cartão débito/crédito'],
          promocoes_sazonais: ['Promo executivo terça a quinta', 'Desconto 10% terceira idade']
        },
        avaliacao_turismo: {
          nota_secretaria: 9.0,
          criterios_avaliacao: {
            atendimento: 9,
            qualidade: 10,
            preco: 8,
            localizacao: 9,
            infraestrutura: 8
          },
          observacoes_secretaria: 'Excelente qualidade da comida, muito recomendado para turistas',
          data_ultima_visita: '2024-01-20',
          proximo_acompanhamento: '2024-07-20'
        },
        avaliacao_publica: {
          nota_media: 4.7,
          total_avaliacoes: 312,
          comentarios_destaque: [
            'Comida deliciosa e caseira',
            'Atendimento excepcional',
            'Preço justo pela qualidade'
          ],
          pontos_fortes: ['Qualidade da comida', 'Atendimento', 'Ambiente familiar'],
          pontos_melhorar: ['Tempo de espera em horários de pico']
        },
        status_cadastro: 'ativo',
        participacao_programas: {
          cadastur: true,
          numero_cadastur: 'CAD87654321',
          programas_municipais: ['Rota Gastronômica', 'Selo Qualidade Turística'],
          parcerias_ativas: ['Hotéis da região', 'Guias turísticos']
        },
        estatisticas: {
          clientes_mes: 892,
          crescimento_anual: 18,
          sazonalidade: {
            alta: ['Dezembro', 'Janeiro', 'Julho', 'Feriados'],
            baixa: ['Março', 'Abril', 'Maio', 'Setembro']
          }
        },
        documentacao: {
          alvara_funcionamento: {
            numero: 'ALV-2024-002',
            data_emissao: '2024-01-01',
            data_validade: '2024-12-31',
            status: 'valido'
          },
          licenca_sanitaria: {
            numero: 'LS-2024-002',
            data_emissao: '2024-01-01',
            data_validade: '2024-12-31',
            status: 'valido'
          },
          documentos_adicionais: ['Certificado Manipulação Alimentos']
        },
        created_at: '2023-07-15T00:00:00Z',
        updated_at: '2024-01-20T16:45:00Z'
      },
      {
        id: '3',
        codigo_estabelecimento: 'EST-003',
        nome_comercial: 'Guia Turístico João Aventura',
        razao_social: 'João Silva - MEI',
        categoria: 'servicos_turisticos',
        subcategoria: 'Guia de Turismo',
        cnpj: '12.345.678/0001-01',
        inscricao_municipal: '111222333',
        dados_comerciais: {
          endereco: 'Rua das Trilhas, 789, Zona Rural',
          bairro: 'Zona Rural',
          cep: '12345-890',
          telefone_principal: '(11) 97777-8888',
          email: 'joao@aventuraslocalguide.com',
          redes_sociais: {
            instagram: '@joaoaventura_guia',
            facebook: 'JoaoAventuraGuia'
          }
        },
        funcionamento: {
          dias_semana: {
            segunda: { aberto: true, abertura: '07:00', fechamento: '18:00' },
            terca: { aberto: true, abertura: '07:00', fechamento: '18:00' },
            quarta: { aberto: true, abertura: '07:00', fechamento: '18:00' },
            quinta: { aberto: true, abertura: '07:00', fechamento: '18:00' },
            sexta: { aberto: true, abertura: '07:00', fechamento: '18:00' },
            sabado: { aberto: true, abertura: '06:00', fechamento: '19:00' },
            domingo: { aberto: true, abertura: '06:00', fechamento: '19:00' }
          },
          funcionamento_feriados: true,
          temporada_alta: {
            periodo: 'Dezembro a Março',
            observacoes: 'Agendamento antecipado necessário'
          }
        },
        servicos_oferecidos: {
          descricao_principal: 'Guia de turismo especializado em trilhas e ecoturismo na região',
          servicos_detalhados: [
            'Trilhas ecológicas',
            'Visitas às cachoeiras',
            'Turismo rural',
            'Observação de aves',
            'Fotografia na natureza',
            'Grupos corporativos'
          ],
          especialidades: ['Trilhas de dificuldade moderada', 'Conhecimento da fauna local', 'Primeiros socorros'],
          publico_alvo: ['Aventureiros', 'Famílias', 'Fotógrafos', 'Grupos corporativos'],
          capacidade: {
            total_pessoas: 15
          }
        },
        infraestrutura: {
          facilidades: {
            wifi_gratuito: false,
            estacionamento: true,
            acessibilidade_cadeirante: false,
            aceita_cartao: true,
            delivery: false,
            reservas_online: false,
            ar_condicionado: false,
            area_fumante: false
          },
          equipamentos_especiais: ['Kit primeiros socorros', 'Equipamentos de segurança', 'Binóculos']
        },
        qualificacoes: {
          certificacoes: [
            {
              tipo: 'Cadastur Guia',
              orgao_emissor: 'Ministério do Turismo',
              data_emissao: '2023-01-01',
              data_validade: '2026-01-01',
              numero_certificado: 'GT-123456'
            },
            {
              tipo: 'Primeiros Socorros',
              orgao_emissor: 'Cruz Vermelha',
              data_emissao: '2023-06-01',
              data_validade: '2025-06-01',
              numero_certificado: 'PS-789012'
            }
          ],
          premios_reconhecimentos: [
            {
              titulo: 'Melhor Guia de Ecoturismo',
              ano: '2023',
              orgao: 'Associação de Guias de Turismo'
            }
          ]
        },
        proprietarios: {
          responsavel_legal: 'João Silva',
          contato_responsavel: '(11) 97777-8888',
          email_responsavel: 'joao@aventuraslocalguide.com'
        },
        precos_referencia: {
          faixa_preco: 'medio',
          preco_minimo: 80,
          preco_maximo: 200,
          observacoes_preco: 'Valores por pessoa, grupo mínimo 4 pessoas',
          formas_pagamento: ['Dinheiro', 'PIX', 'Transferência'],
          promocoes_sazonais: ['Desconto 20% grupo acima 10 pessoas', 'Promoção família']
        },
        avaliacao_turismo: {
          nota_secretaria: 9.5,
          criterios_avaliacao: {
            atendimento: 10,
            qualidade: 10,
            preco: 9,
            localizacao: 9,
            infraestrutura: 8
          },
          observacoes_secretaria: 'Excelente profissional, muito conhecimento da região, muito recomendado',
          data_ultima_visita: '2024-01-10',
          proximo_acompanhamento: '2024-07-10'
        },
        avaliacao_publica: {
          nota_media: 4.9,
          total_avaliacoes: 87,
          comentarios_destaque: [
            'João conhece cada trilha da região',
            'Segurança total durante as atividades',
            'Experiência inesquecível'
          ],
          pontos_fortes: ['Conhecimento local', 'Segurança', 'Simpatia', 'Pontualidade'],
          pontos_melhorar: ['Disponibilidade de datas']
        },
        status_cadastro: 'ativo',
        participacao_programas: {
          cadastur: true,
          numero_cadastur: 'GT123456789',
          programas_municipais: ['Circuito Ecoturístico', 'Rede de Guias Locais'],
          parcerias_ativas: ['Hotéis da região', 'Agências receptivas', 'Pousadas rurais']
        },
        estatisticas: {
          clientes_mes: 45,
          crescimento_anual: 25,
          sazonalidade: {
            alta: ['Dezembro', 'Janeiro', 'Fevereiro', 'Julho', 'Feriados'],
            baixa: ['Maio', 'Junho', 'Agosto']
          }
        },
        documentacao: {
          alvara_funcionamento: {
            numero: 'ALV-2024-003',
            data_emissao: '2024-01-01',
            data_validade: '2024-12-31',
            status: 'valido'
          },
          documentos_adicionais: ['Seguro Responsabilidade Civil', 'Cadastro Guia de Turismo']
        },
        created_at: '2023-01-15T00:00:00Z',
        updated_at: '2024-01-10T11:20:00Z'
      }
    ]

    setEstabelecimentos(mockData)
    setFilteredEstabelecimentos(mockData)
    setLoading(false)
  }, [])

  // Filtros
  useEffect(() => {
    let filtered = estabelecimentos

    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.nome_comercial.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.razao_social.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.codigo_estabelecimento.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (filterCategoria) {
      filtered = filtered.filter(item => item.categoria === filterCategoria)
    }

    if (filterStatus) {
      filtered = filtered.filter(item => item.status_cadastro === filterStatus)
    }

    if (filterFaixaPreco) {
      filtered = filtered.filter(item => item.precos_referencia.faixa_preco === filterFaixaPreco)
    }

    setFilteredEstabelecimentos(filtered)
  }, [searchTerm, filterCategoria, filterStatus, filterFaixaPreco, estabelecimentos])

  // Estatísticas
  const stats = {
    total_estabelecimentos: estabelecimentos.length,
    ativos: estabelecimentos.filter(e => e.status_cadastro === 'ativo').length,
    com_cadastur: estabelecimentos.filter(e => e.participacao_programas.cadastur).length,
    nota_media_secretaria: estabelecimentos.reduce((acc, e) => acc + e.avaliacao_turismo.nota_secretaria, 0) / estabelecimentos.length,
    nota_media_publica: estabelecimentos.reduce((acc, e) => acc + e.avaliacao_publica.nota_media, 0) / estabelecimentos.length,
    total_clientes_mes: estabelecimentos.reduce((acc, e) => acc + e.estatisticas.clientes_mes, 0),
    crescimento_medio: estabelecimentos.reduce((acc, e) => acc + e.estatisticas.crescimento_anual, 0) / estabelecimentos.length,
    com_certificacao: estabelecimentos.filter(e => e.qualificacoes.certificacoes.length > 0).length
  }

  // Dados para gráficos
  const categoriaChart = categoriasEstabelecimentos.map(cat => ({
    name: cat.label,
    value: estabelecimentos.filter(e => e.categoria === cat.value).length,
    color: cat.color
  }))

  const faixaPrecoChart = Object.entries(faixasPreco).map(([key, value]) => ({
    name: value.label,
    count: estabelecimentos.filter(e => e.precos_referencia.faixa_preco === key).length,
    color: value.color
  }))

  const avaliacaoChart = estabelecimentos.map(e => ({
    nome: e.nome_comercial.substring(0, 15) + (e.nome_comercial.length > 15 ? '...' : ''),
    secretaria: e.avaliacao_turismo.nota_secretaria,
    publica: e.avaliacao_publica.nota_media
  }))

  const clientesChart = estabelecimentos.map(e => ({
    nome: e.nome_comercial.substring(0, 10) + (e.nome_comercial.length > 10 ? '...' : ''),
    clientes: e.estatisticas.clientes_mes,
    crescimento: e.estatisticas.crescimento_anual
  }))

  const handleNovoEstabelecimento = () => {
    setSelectedEstabelecimento(null)
    setIsModalOpen(true)
  }

  const handleEditEstabelecimento = (estabelecimento: EstabelecimentoTuristico) => {
    setSelectedEstabelecimento(estabelecimento)
    setIsModalOpen(true)
  }

  const ServicosGerados = () => (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Store className="h-5 w-5" />
          Serviços Gerados Automaticamente
        </CardTitle>
        <CardDescription>
          Serviços disponíveis no catálogo público baseados nos estabelecimentos locais
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 border rounded-lg">
            <h4 className="font-semibold text-blue-700">Cadastro de Estabelecimento Turístico</h4>
            <p className="text-sm text-gray-600 mt-1">
              Registro de novos empreendimentos turísticos
            </p>
            <Badge variant="outline" className="mt-2">Protocolo Automático</Badge>
          </div>
          <div className="p-4 border rounded-lg">
            <h4 className="font-semibold text-green-700">Certificação Turística</h4>
            <p className="text-sm text-gray-600 mt-1">
              Processo de certificação de qualidade
            </p>
            <Badge variant="outline" className="mt-2">Protocolo Automático</Badge>
          </div>
          <div className="p-4 border rounded-lg">
            <h4 className="font-semibold text-orange-700">Apoio ao Empreendedor</h4>
            <p className="text-sm text-gray-600 mt-1">
              Orientações para empreendedores turísticos
            </p>
            <Badge variant="outline" className="mt-2">Protocolo Automático</Badge>
          </div>
          <div className="p-4 border rounded-lg">
            <h4 className="font-semibold text-purple-700">Guia de Serviços</h4>
            <p className="text-sm text-gray-600 mt-1">
              Catálogo completo de estabelecimentos
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
          <h1 className="text-3xl font-bold">Estabelecimentos Locais</h1>
          <p className="text-muted-foreground">
            Registro de empresas e serviços turísticos, hotéis, restaurantes e guias
          </p>
        </div>
        <Button onClick={handleNovoEstabelecimento} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Novo Estabelecimento
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="estabelecimentos">Estabelecimentos</TabsTrigger>
          <TabsTrigger value="certificacoes">Certificações</TabsTrigger>
          <TabsTrigger value="avaliacoes">Avaliações</TabsTrigger>
          <TabsTrigger value="documentacao">Documentação</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          {/* Cards de Estatísticas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Estabelecimentos Ativos</CardTitle>
                <Store className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.ativos}</div>
                <p className="text-xs text-muted-foreground">
                  de {stats.total_estabelecimentos} cadastrados
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Com Cadastur</CardTitle>
                <Award className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.com_cadastur}</div>
                <p className="text-xs text-muted-foreground">
                  {((stats.com_cadastur / stats.total_estabelecimentos) * 100).toFixed(0)}% do total
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avaliação Secretaria</CardTitle>
                <Star className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.nota_media_secretaria.toFixed(1)}/10</div>
                <p className="text-xs text-muted-foreground">
                  Pública: {stats.nota_media_publica.toFixed(1)}/5
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Clientes/Mês</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.total_clientes_mes.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  Crescimento: +{stats.crescimento_medio.toFixed(0)}% a.a.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Cards Secundários */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Certificados</CardTitle>
                <Shield className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.com_certificacao}</div>
                <p className="text-xs text-muted-foreground">
                  {((stats.com_certificacao / stats.total_estabelecimentos) * 100).toFixed(0)}% com certificações
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Documentação</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {estabelecimentos.filter(e =>
                    e.documentacao.alvara_funcionamento.status === 'valido'
                  ).length}
                </div>
                <p className="text-xs text-muted-foreground">
                  alvarás válidos
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Acessibilidade</CardTitle>
                <Accessibility className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {estabelecimentos.filter(e =>
                    e.infraestrutura.facilidades.acessibilidade_cadeirante
                  ).length}
                </div>
                <p className="text-xs text-muted-foreground">
                  estabelecimentos acessíveis
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Gráficos */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Estabelecimentos por Categoria</CardTitle>
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
                <CardTitle>Faixa de Preços</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={faixaPrecoChart}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Avaliações: Secretaria vs Pública</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={avaliacaoChart}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="nome" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="secretaria" fill="#10b981" name="Secretaria (/10)" />
                    <Bar dataKey="publica" fill="#3b82f6" name="Pública (/5)" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Clientes por Mês</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={clientesChart}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="nome" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="clientes" fill="#f59e0b" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <ServicosGerados />
        </TabsContent>

        <TabsContent value="estabelecimentos" className="space-y-6">
          {/* Filtros */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-wrap gap-4">
                <div className="flex-1 min-w-64">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar estabelecimentos..."
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
                    {categoriasEstabelecimentos.map(cat => (
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
                    <SelectItem value="pendente_documentacao">Pendente Documentação</SelectItem>
                    <SelectItem value="em_analise">Em Análise</SelectItem>
                    <SelectItem value="suspenso">Suspenso</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterFaixaPreco} onValueChange={setFilterFaixaPreco}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Faixa de Preço" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todas as faixas</SelectItem>
                    <SelectItem value="economico">Econômico</SelectItem>
                    <SelectItem value="medio">Médio</SelectItem>
                    <SelectItem value="alto">Alto</SelectItem>
                    <SelectItem value="premium">Premium</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="icon">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Lista de Estabelecimentos */}
          <div className="grid grid-cols-1 gap-4">
            {filteredEstabelecimentos.map((estabelecimento) => (
              <Card key={estabelecimento.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold">{estabelecimento.nome_comercial}</h3>
                        <Badge
                          variant="outline"
                          style={{ borderColor: statusCadastro[estabelecimento.status_cadastro].color }}
                        >
                          {statusCadastro[estabelecimento.status_cadastro].label}
                        </Badge>
                        <Badge variant="secondary">
                          {categoriasEstabelecimentos.find(c => c.value === estabelecimento.categoria)?.label}
                        </Badge>
                        {estabelecimento.participacao_programas.cadastur && (
                          <Badge variant="outline" className="text-green-600">
                            <Award className="h-3 w-3 mr-1" />
                            Cadastur
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {estabelecimento.codigo_estabelecimento} - {estabelecimento.subcategoria}
                      </p>
                      <p className="text-sm mb-3">{estabelecimento.servicos_oferecidos.descricao_principal}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditEstabelecimento(estabelecimento)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    <div>
                      <Label className="text-xs font-semibold text-muted-foreground">LOCALIZAÇÃO</Label>
                      <p className="text-sm">{estabelecimento.dados_comerciais.bairro}</p>
                      <p className="text-xs text-muted-foreground">
                        {estabelecimento.dados_comerciais.telefone_principal}
                      </p>
                    </div>
                    <div>
                      <Label className="text-xs font-semibold text-muted-foreground">AVALIAÇÃO</Label>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-semibold">{estabelecimento.avaliacao_publica.nota_media}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {estabelecimento.avaliacao_publica.total_avaliacoes} avaliações
                      </p>
                    </div>
                    <div>
                      <Label className="text-xs font-semibold text-muted-foreground">CLIENTES</Label>
                      <p className="text-sm">{estabelecimento.estatisticas.clientes_mes}/mês</p>
                      <p className="text-xs text-muted-foreground">
                        +{estabelecimento.estatisticas.crescimento_anual}% a.a.
                      </p>
                    </div>
                    <div>
                      <Label className="text-xs font-semibold text-muted-foreground">PREÇOS</Label>
                      <Badge
                        variant="outline"
                        style={{ borderColor: faixasPreco[estabelecimento.precos_referencia.faixa_preco].color }}
                      >
                        {faixasPreco[estabelecimento.precos_referencia.faixa_preco].label}
                      </Badge>
                      <p className="text-xs text-muted-foreground">
                        R$ {estabelecimento.precos_referencia.preco_minimo} - R$ {estabelecimento.precos_referencia.preco_maximo}
                      </p>
                    </div>
                  </div>

                  <div className="text-sm space-y-1">
                    <p><strong>Responsável:</strong> {estabelecimento.proprietarios.responsavel_legal}</p>
                    <p><strong>Capacidade:</strong>
                      {estabelecimento.servicos_oferecidos.capacidade?.total_pessoas && ` ${estabelecimento.servicos_oferecidos.capacidade.total_pessoas} pessoas`}
                      {estabelecimento.servicos_oferecidos.capacidade?.total_quartos && ` ${estabelecimento.servicos_oferecidos.capacidade.total_quartos} quartos`}
                      {estabelecimento.servicos_oferecidos.capacidade?.total_mesas && ` ${estabelecimento.servicos_oferecidos.capacidade.total_mesas} mesas`}
                    </p>

                    {/* Facilidades */}
                    <div className="flex gap-2 flex-wrap mt-2">
                      {estabelecimento.infraestrutura.facilidades.wifi_gratuito && <Badge variant="outline"><Wifi className="h-3 w-3 mr-1" />WiFi</Badge>}
                      {estabelecimento.infraestrutura.facilidades.estacionamento && <Badge variant="outline"><ParkingCircle className="h-3 w-3 mr-1" />Estacionamento</Badge>}
                      {estabelecimento.infraestrutura.facilidades.acessibilidade_cadeirante && <Badge variant="outline" className="text-green-600"><Accessibility className="h-3 w-3 mr-1" />Acessível</Badge>}
                      {estabelecimento.infraestrutura.facilidades.aceita_cartao && <Badge variant="outline"><CreditCard className="h-3 w-3 mr-1" />Cartão</Badge>}
                    </div>

                    {/* Avaliação da Secretaria */}
                    <div className="mt-2 p-2 bg-blue-50 rounded">
                      <span className="text-xs font-semibold">Avaliação Secretaria: {estabelecimento.avaliacao_turismo.nota_secretaria}/10</span>
                      <p className="text-xs text-muted-foreground">{estabelecimento.avaliacao_turismo.observacoes_secretaria}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="certificacoes" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Certificações e Qualificações</CardTitle>
              <CardDescription>
                Acompanhamento das certificações dos estabelecimentos turísticos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {estabelecimentos.map(estabelecimento => (
                  <div key={estabelecimento.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-semibold">{estabelecimento.nome_comercial}</h4>
                        <p className="text-sm text-muted-foreground">{estabelecimento.subcategoria}</p>
                      </div>
                      <div className="flex gap-2">
                        {estabelecimento.participacao_programas.cadastur && (
                          <Badge variant="outline" className="text-green-600">
                            <Award className="h-3 w-3 mr-1" />
                            Cadastur: {estabelecimento.participacao_programas.numero_cadastur}
                          </Badge>
                        )}
                      </div>
                    </div>

                    {estabelecimento.qualificacoes.certificacoes.length > 0 && (
                      <div className="mb-3">
                        <Label className="text-xs font-semibold text-muted-foreground">CERTIFICAÇÕES</Label>
                        <div className="space-y-2 mt-2">
                          {estabelecimento.qualificacoes.certificacoes.map((cert, index) => (
                            <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                              <div>
                                <p className="text-sm font-semibold">{cert.tipo}</p>
                                <p className="text-xs text-muted-foreground">
                                  {cert.orgao_emissor} - Nº {cert.numero_certificado}
                                </p>
                              </div>
                              <div className="text-right text-xs">
                                <p>Válido até: {new Date(cert.data_validade).toLocaleDateString()}</p>
                                <Badge
                                  variant="outline"
                                  className={new Date(cert.data_validade) > new Date() ? 'text-green-600' : 'text-red-600'}
                                >
                                  {new Date(cert.data_validade) > new Date() ? 'Válido' : 'Vencido'}
                                </Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {estabelecimento.qualificacoes.premios_reconhecimentos && estabelecimento.qualificacoes.premios_reconhecimentos.length > 0 && (
                      <div className="mb-3">
                        <Label className="text-xs font-semibold text-muted-foreground">PRÊMIOS E RECONHECIMENTOS</Label>
                        <div className="space-y-1 mt-2">
                          {estabelecimento.qualificacoes.premios_reconhecimentos.map((premio, index) => (
                            <div key={index} className="flex items-center gap-2 text-sm">
                              <Trophy className="h-4 w-4 text-yellow-500" />
                              <span>{premio.titulo} ({premio.ano}) - {premio.orgao}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {estabelecimento.participacao_programas.programas_municipais.length > 0 && (
                      <div>
                        <Label className="text-xs font-semibold text-muted-foreground">PROGRAMAS MUNICIPAIS</Label>
                        <div className="flex gap-1 flex-wrap mt-2">
                          {estabelecimento.participacao_programas.programas_municipais.map((programa, index) => (
                            <Badge key={index} variant="outline" className="text-xs">{programa}</Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="avaliacoes" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Comparativo de Avaliações</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={avaliacaoChart}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="nome" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="secretaria" fill="#10b981" name="Secretaria" />
                    <Bar dataKey="publica" fill="#3b82f6" name="Pública" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Indicadores de Qualidade</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Avaliação Média Secretaria</span>
                    <span className="font-semibold">{stats.nota_media_secretaria.toFixed(1)}/10</span>
                  </div>
                  <Progress value={stats.nota_media_secretaria * 10} className="w-full" />

                  <div className="flex justify-between">
                    <span>Avaliação Média Pública</span>
                    <span className="font-semibold">{stats.nota_media_publica.toFixed(1)}/5</span>
                  </div>
                  <Progress value={stats.nota_media_publica * 20} className="w-full" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Feedback dos Estabelecimentos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {estabelecimentos.map(estabelecimento => (
                  <div key={estabelecimento.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold">{estabelecimento.nome_comercial}</h4>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span className="font-semibold">{estabelecimento.avaliacao_publica.nota_media}</span>
                        <span className="text-xs text-muted-foreground">
                          ({estabelecimento.avaliacao_publica.total_avaliacoes})
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-xs font-semibold text-muted-foreground">PONTOS FORTES</Label>
                        <div className="flex gap-1 flex-wrap mt-1">
                          {estabelecimento.avaliacao_publica.pontos_fortes.map((ponto, index) => (
                            <Badge key={index} variant="outline" className="text-green-600 text-xs">
                              {ponto}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <Label className="text-xs font-semibold text-muted-foreground">PONTOS A MELHORAR</Label>
                        <div className="flex gap-1 flex-wrap mt-1">
                          {estabelecimento.avaliacao_publica.pontos_melhorar.map((ponto, index) => (
                            <Badge key={index} variant="outline" className="text-orange-600 text-xs">
                              {ponto}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="mt-3">
                      <Label className="text-xs font-semibold text-muted-foreground">COMENTÁRIOS DESTAQUE</Label>
                      <div className="space-y-1 mt-1">
                        {estabelecimento.avaliacao_publica.comentarios_destaque.map((comentario, index) => (
                          <p key={index} className="text-sm text-muted-foreground italic">
                            ""{comentario}""
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documentacao" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Status da Documentação</CardTitle>
              <CardDescription>
                Acompanhamento dos documentos obrigatórios dos estabelecimentos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {estabelecimentos.map(estabelecimento => (
                  <div key={estabelecimento.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-semibold">{estabelecimento.nome_comercial}</h4>
                        <p className="text-sm text-muted-foreground">
                          CNPJ: {estabelecimento.cnpj} | IM: {estabelecimento.inscricao_municipal}
                        </p>
                      </div>
                      <Badge
                        variant="outline"
                        style={{ borderColor: statusCadastro[estabelecimento.status_cadastro].color }}
                      >
                        {statusCadastro[estabelecimento.status_cadastro].label}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <div>
                            <p className="text-sm font-semibold">Alvará de Funcionamento</p>
                            <p className="text-xs text-muted-foreground">
                              Nº {estabelecimento.documentacao.alvara_funcionamento.numero}
                            </p>
                          </div>
                          <div className="text-right text-xs">
                            <p>Válido até: {new Date(estabelecimento.documentacao.alvara_funcionamento.data_validade).toLocaleDateString()}</p>
                            <Badge
                              variant="outline"
                              className={estabelecimento.documentacao.alvara_funcionamento.status === 'valido' ? 'text-green-600' : 'text-red-600'}
                            >
                              {estabelecimento.documentacao.alvara_funcionamento.status === 'valido' ? (
                                <><CheckCircle className="h-3 w-3 mr-1" />Válido</>
                              ) : (
                                <><XCircle className="h-3 w-3 mr-1" />Vencido</>
                              )}
                            </Badge>
                          </div>
                        </div>

                        {estabelecimento.documentacao.licenca_sanitaria && (
                          <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <div>
                              <p className="text-sm font-semibold">Licença Sanitária</p>
                              <p className="text-xs text-muted-foreground">
                                Nº {estabelecimento.documentacao.licenca_sanitaria.numero}
                              </p>
                            </div>
                            <div className="text-right text-xs">
                              <p>Válido até: {new Date(estabelecimento.documentacao.licenca_sanitaria.data_validade).toLocaleDateString()}</p>
                              <Badge
                                variant="outline"
                                className={estabelecimento.documentacao.licenca_sanitaria.status === 'valido' ? 'text-green-600' : 'text-red-600'}
                              >
                                {estabelecimento.documentacao.licenca_sanitaria.status === 'valido' ? (
                                  <><CheckCircle className="h-3 w-3 mr-1" />Válido</>
                                ) : (
                                  <><XCircle className="h-3 w-3 mr-1" />Vencido</>
                                )}
                              </Badge>
                            </div>
                          </div>
                        )}
                      </div>

                      <div>
                        <Label className="text-xs font-semibold text-muted-foreground">DOCUMENTOS ADICIONAIS</Label>
                        <div className="space-y-1 mt-2">
                          {estabelecimento.documentacao.documentos_adicionais.map((doc, index) => (
                            <div key={index} className="flex items-center gap-2 text-sm">
                              <FileText className="h-4 w-4 text-blue-500" />
                              <span>{doc}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}