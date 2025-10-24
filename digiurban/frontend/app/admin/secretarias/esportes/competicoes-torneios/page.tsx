'use client'

import { useState } from 'react'
import { useAdminAuth } from '@/hooks/useAdminAuth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import {
  Trophy,
  Plus,
  Search,
  Filter,
  Download,
  Calendar,
  Users,
  MapPin,
  Award,
  Target,
  Clock,
  Star,
  Medal,
  Crown,
  Activity,
  Zap
} from 'lucide-react'

interface CompeticaoTorneio {
  id: string
  nome: string
  tipo: 'Campeonato' | 'Copa' | 'Torneio' | 'Liga' | 'Festival' | 'Amistoso' | 'Seletiva'
  modalidade: string
  categoria: string
  genero: 'Masculino' | 'Feminino' | 'Misto'
  status: 'Planejada' | 'Inscricoes Abertas' | 'Em Andamento' | 'Finalizada' | 'Cancelada' | 'Adiada'
  organizacao: {
    organizador: string
    responsavelTecnico: string
    coordenadorGeral: string
    apoiadores?: string[]
    patrocinadores?: string[]
  }
  cronograma: {
    dataInicio: string
    dataFim: string
    dataInicioInscricoes: string
    dataFimInscricoes: string
    dataLancamentoTabela?: string
    localRealizacao: string[]
  }
  participacao: {
    numeroEquipes: number
    numeroAtletas: number
    equipesMunicipais: number
    equipesConvidadas: number
    maxParticipantes: number
    inscricoesPagas: number
    inscricoesPendentes: number
  }
  regulamento: {
    sistemaDisputa: string
    numeroFases: number
    duracaoMinutos?: number
    duracaoPartida?: number
    criteriosClassificacao: string[]
    observacoes?: string
  }
  premiacao: {
    premios: Array<{
      posicao: string
      descricao: string
      valor?: number
      troféu: boolean
    }>
    premiosEspeciais?: Array<{
      categoria: string
      descricao: string
    }>
  }
  resultados?: {
    campeao?: string
    viceCampeao?: string
    terceiro?: string
    artilheiro?: string
    melhorJogador?: string
    destaquesGerais?: string[]
  }
  financeiro: {
    orcamentoTotal: number
    custosRealizados: number
    custoArbitragem?: number
    custoInfraestrutura: number
    receitaInscricoes: number
    receitaPatrocinio: number
  }
  logistica: {
    arbitros: number
    equipamentos: string[]
    seguranca: string[]
    transporte?: string
    alimentacao?: string
  }
  observacoes?: string
  dataUltimaAtualizacao: string
}

const mockCompeticoes: CompeticaoTorneio[] = [
  {
    id: '1',
    nome: 'Copa Municipal de Futebol 2024',
    tipo: 'Copa',
    modalidade: 'Futebol',
    categoria: 'Adulto',
    genero: 'Masculino',
    status: 'Em Andamento',
    organizacao: {
      organizador: 'Secretaria Municipal de Esportes',
      responsavelTecnico: 'Prof. João Silva',
      coordenadorGeral: 'Maria Santos',
      apoiadores: ['Liga Municipal', 'Associação de Árbitros'],
      patrocinadores: ['Empresa Local A', 'Comércio B']
    },
    cronograma: {
      dataInicio: '2024-02-01',
      dataFim: '2024-03-15',
      dataInicioInscricoes: '2024-01-01',
      dataFimInscricoes: '2024-01-20',
      dataLancamentoTabela: '2024-01-25',
      localRealizacao: ['Campo Municipal 1', 'Campo Municipal 2', 'Estádio Central']
    },
    participacao: {
      numeroEquipes: 16,
      numeroAtletas: 400,
      equipesMunicipais: 4,
      equipesConvidadas: 12,
      maxParticipantes: 16,
      inscricoesPagas: 14,
      inscricoesPendentes: 2
    },
    regulamento: {
      sistemaDisputa: 'Mata-mata com fase de grupos',
      numeroFases: 4,
      duracaoPartida: 90,
      criteriosClassificacao: ['Vitórias', 'Saldo de gols', 'Gols pró', 'Confronto direto'],
      observacoes: 'Regulamento FIFA adaptado para competições amadoras'
    },
    premiacao: {
      premios: [
        { posicao: '1º Lugar', descricao: 'Troféu + R$ 3.000', valor: 3000, troféu: true },
        { posicao: '2º Lugar', descricao: 'Troféu + R$ 1.500', valor: 1500, troféu: true },
        { posicao: '3º Lugar', descricao: 'Troféu + R$ 800', valor: 800, troféu: true }
      ],
      premiosEspeciais: [
        { categoria: 'Artilheiro', descricao: 'Troféu + Chuteira' },
        { categoria: 'Melhor Goleiro', descricao: 'Troféu + Luvas' },
        { categoria: 'Fair Play', descricao: 'Troféu' }
      ]
    },
    resultados: {
      artilheiro: 'Carlos Silva (10 gols)',
      melhorJogador: 'Roberto Santos',
      destaquesGerais: ['Maior público: 1.200 pessoas', 'Menor número de cartões: Equipe Amigos FC']
    },
    financeiro: {
      orcamentoTotal: 25000,
      custosRealizados: 18500,
      custoArbitragem: 4800,
      custoInfraestrutura: 8200,
      receitaInscricoes: 7000,
      receitaPatrocinio: 12000
    },
    logistica: {
      arbitros: 12,
      equipamentos: ['Bolas', 'Bandeiras', 'Cronômetros', 'Cartões'],
      seguranca: ['Seguranças', 'Ambulância', 'Bombeiros'],
      transporte: 'Ônibus para equipes convidadas',
      alimentacao: 'Lanche para árbitros e organizadores'
    },
    observacoes: 'Competição com grande sucesso de público e participação',
    dataUltimaAtualizacao: '2024-02-20'
  },
  {
    id: '2',
    nome: 'Torneio de Voleibol Feminino',
    tipo: 'Torneio',
    modalidade: 'Voleibol',
    categoria: 'Juvenil',
    genero: 'Feminino',
    status: 'Inscricoes Abertas',
    organizacao: {
      organizador: 'Secretaria Municipal de Esportes',
      responsavelTecnico: 'Profa. Ana Costa',
      coordenadorGeral: 'Pedro Lima'
    },
    cronograma: {
      dataInicio: '2024-03-01',
      dataFim: '2024-03-10',
      dataInicioInscricoes: '2024-01-15',
      dataFimInscricoes: '2024-02-25',
      localRealizacao: ['Ginásio Municipal', 'Quadra Escola Central']
    },
    participacao: {
      numeroEquipes: 8,
      numeroAtletas: 120,
      equipesMunicipais: 2,
      equipesConvidadas: 6,
      maxParticipantes: 12,
      inscricoesPagas: 5,
      inscricoesPendentes: 3
    },
    regulamento: {
      sistemaDisputa: 'Sistema de pontos corridos com playoffs',
      numeroFases: 2,
      duracaoPartida: 60,
      criteriosClassificacao: ['Pontos', 'Sets', 'Pontos no set'],
      observacoes: 'Regras FIVB adaptadas para categoria juvenil'
    },
    premiacao: {
      premios: [
        { posicao: '1º Lugar', descricao: 'Troféu + Kit esportivo', troféu: true },
        { posicao: '2º Lugar', descricao: 'Troféu + Medalhas', troféu: true },
        { posicao: '3º Lugar', descricao: 'Troféu', troféu: true }
      ],
      premiosEspeciais: [
        { categoria: 'Melhor Jogadora', descricao: 'Troféu individual' },
        { categoria: 'Melhor Levantadora', descricao: 'Troféu individual' }
      ]
    },
    financeiro: {
      orcamentoTotal: 8000,
      custosRealizados: 2500,
      custoArbitragem: 1200,
      custoInfraestrutura: 3000,
      receitaInscricoes: 2000,
      receitaPatrocinio: 4500
    },
    logistica: {
      arbitros: 6,
      equipamentos: ['Bolas', 'Redes', 'Antenas', 'Placar'],
      seguranca: ['Seguranças', 'Primeiros socorros']
    },
    observacoes: 'Torneio de desenvolvimento para categoria juvenil',
    dataUltimaAtualizacao: '2024-01-20'
  }
]

export default function CompeticoesTorneiosPage() {
  const { user } = useAdminAuth()
  const [competicoes, setCompeticoes] = useState<CompeticaoTorneio[]>(mockCompeticoes)
  const [searchTerm, setSearchTerm] = useState('')
  const [tipoFilter, setTipoFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [modalidadeFilter, setModalidadeFilter] = useState<string>('all')
  const [showNewCompeticaoModal, setShowNewCompeticaoModal] = useState(false)

  const filteredCompeticoes = competicoes.filter(competicao => {
    const matchesSearch = competicao.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         competicao.modalidade.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         competicao.organizacao.organizador.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesTipo = tipoFilter === 'all' || competicao.tipo === tipoFilter
    const matchesStatus = statusFilter === 'all' || competicao.status === statusFilter
    const matchesModalidade = modalidadeFilter === 'all' || competicao.modalidade === modalidadeFilter
    return matchesSearch && matchesTipo && matchesStatus && matchesModalidade
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Planejada': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'Inscricoes Abertas': return 'bg-green-100 text-green-800 border-green-200'
      case 'Em Andamento': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'Finalizada': return 'bg-gray-100 text-gray-800 border-gray-200'
      case 'Cancelada': return 'bg-red-100 text-red-800 border-red-200'
      case 'Adiada': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case 'Campeonato': return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'Copa': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'Torneio': return 'bg-green-100 text-green-800 border-green-200'
      case 'Liga': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'Festival': return 'bg-pink-100 text-pink-800 border-pink-200'
      case 'Amistoso': return 'bg-gray-100 text-gray-800 border-gray-200'
      case 'Seletiva': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const stats = {
    totalCompeticoes: competicoes.length,
    emAndamento: competicoes.filter(c => c.status === 'Em Andamento').length,
    inscricoesAbertas: competicoes.filter(c => c.status === 'Inscricoes Abertas').length,
    totalParticipantes: competicoes.reduce((acc, c) => acc + c.participacao.numeroAtletas, 0)
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Trophy className="h-8 w-8 text-blue-600" />
            Competições e Torneios
          </h1>
          <p className="text-gray-600 mt-1">
            Organização de eventos esportivos municipais, regionais e estaduais
          </p>
        </div>
        <Button onClick={() => setShowNewCompeticaoModal(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Nova Competição
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Competições</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCompeticoes}</div>
            <p className="text-xs text-muted-foreground">eventos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Em Andamento</CardTitle>
            <Activity className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.emAndamento}</div>
            <p className="text-xs text-muted-foreground">ativas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inscrições Abertas</CardTitle>
            <Users className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.inscricoesAbertas}</div>
            <p className="text-xs text-muted-foreground">disponíveis</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Participantes</CardTitle>
            <Target className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.totalParticipantes}</div>
            <p className="text-xs text-muted-foreground">atletas</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filtros e Busca</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nome, modalidade ou organizador..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <Select value={tipoFilter} onValueChange={setTipoFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Tipos</SelectItem>
                <SelectItem value="Campeonato">Campeonato</SelectItem>
                <SelectItem value="Copa">Copa</SelectItem>
                <SelectItem value="Torneio">Torneio</SelectItem>
                <SelectItem value="Liga">Liga</SelectItem>
                <SelectItem value="Festival">Festival</SelectItem>
                <SelectItem value="Amistoso">Amistoso</SelectItem>
                <SelectItem value="Seletiva">Seletiva</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Status</SelectItem>
                <SelectItem value="Planejada">Planejada</SelectItem>
                <SelectItem value="Inscricoes Abertas">Inscrições Abertas</SelectItem>
                <SelectItem value="Em Andamento">Em Andamento</SelectItem>
                <SelectItem value="Finalizada">Finalizada</SelectItem>
                <SelectItem value="Cancelada">Cancelada</SelectItem>
                <SelectItem value="Adiada">Adiada</SelectItem>
              </SelectContent>
            </Select>
            <Select value={modalidadeFilter} onValueChange={setModalidadeFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Modalidade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as Modalidades</SelectItem>
                <SelectItem value="Futebol">Futebol</SelectItem>
                <SelectItem value="Voleibol">Voleibol</SelectItem>
                <SelectItem value="Basquetebol">Basquetebol</SelectItem>
                <SelectItem value="Futsal">Futsal</SelectItem>
                <SelectItem value="Handebol">Handebol</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6">
        {filteredCompeticoes.map((competicao) => (
          <Card key={competicao.id} className="overflow-hidden">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{competicao.nome}</CardTitle>
                  <CardDescription className="flex items-center gap-2 mt-1">
                    <Award className="h-4 w-4" />
                    {competicao.modalidade} - {competicao.categoria} {competicao.genero}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Badge className={getTipoColor(competicao.tipo)}>
                    {competicao.tipo}
                  </Badge>
                  <Badge className={getStatusColor(competicao.status)}>
                    {competicao.status}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-sm text-gray-900 mb-2 flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Organização
                    </h4>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p><strong>Organizador:</strong> {competicao.organizacao.organizador}</p>
                      <p><strong>Responsável Técnico:</strong> {competicao.organizacao.responsavelTecnico}</p>
                      <p><strong>Coordenador:</strong> {competicao.organizacao.coordenadorGeral}</p>
                      {competicao.organizacao.apoiadores && competicao.organizacao.apoiadores.length > 0 && (
                        <p><strong>Apoiadores:</strong> {competicao.organizacao.apoiadores.join(', ')}</p>
                      )}
                      {competicao.organizacao.patrocinadores && competicao.organizacao.patrocinadores.length > 0 && (
                        <p><strong>Patrocinadores:</strong> {competicao.organizacao.patrocinadores.join(', ')}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-sm text-gray-900 mb-2 flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Cronograma
                    </h4>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p><strong>Competição:</strong> {new Date(competicao.cronograma.dataInicio).toLocaleDateString('pt-BR')} a {new Date(competicao.cronograma.dataFim).toLocaleDateString('pt-BR')}</p>
                      <p><strong>Inscrições:</strong> {new Date(competicao.cronograma.dataInicioInscricoes).toLocaleDateString('pt-BR')} a {new Date(competicao.cronograma.dataFimInscricoes).toLocaleDateString('pt-BR')}</p>
                      {competicao.cronograma.dataLancamentoTabela && (
                        <p><strong>Tabela:</strong> {new Date(competicao.cronograma.dataLancamentoTabela).toLocaleDateString('pt-BR')}</p>
                      )}
                      <p><strong>Locais:</strong> {competicao.cronograma.localRealizacao.join(', ')}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-sm text-gray-900 mb-2 flex items-center gap-2">
                      <Target className="h-4 w-4" />
                      Participação
                    </h4>
                    <div className="space-y-1 text-sm text-gray-600">
                      <div className="flex justify-between">
                        <span>Equipes:</span>
                        <span className="font-bold">{competicao.participacao.numeroEquipes}/{competicao.participacao.maxParticipantes}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Atletas:</span>
                        <span className="font-bold">{competicao.participacao.numeroAtletas}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Municipais:</span>
                        <span className="font-bold text-blue-600">{competicao.participacao.equipesMunicipais}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Convidadas:</span>
                        <span className="font-bold text-green-600">{competicao.participacao.equipesConvidadas}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Pagas:</span>
                        <span className="font-bold text-green-600">{competicao.participacao.inscricoesPagas}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Pendentes:</span>
                        <span className="font-bold text-yellow-600">{competicao.participacao.inscricoesPendentes}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-sm text-gray-900 mb-2 flex items-center gap-2">
                      <Activity className="h-4 w-4" />
                      Regulamento
                    </h4>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p><strong>Sistema:</strong> {competicao.regulamento.sistemaDisputa}</p>
                      <p><strong>Fases:</strong> {competicao.regulamento.numeroFases}</p>
                      <p><strong>Duração:</strong> {competicao.regulamento.duracaoPartida} min</p>
                      <p><strong>Classificação:</strong> {competicao.regulamento.criteriosClassificacao.join(', ')}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-sm text-gray-900 mb-2 flex items-center gap-2">
                      <Award className="h-4 w-4" />
                      Premiação
                    </h4>
                    <div className="space-y-2">
                      {competicao.premiacao.premios.map((premio, index) => (
                        <div key={index} className="p-2 bg-yellow-50 rounded text-xs">
                          <div className="flex justify-between items-center">
                            <span className="font-medium">{premio.posicao}</span>
                            {premio.troféu && <Trophy className="h-3 w-3 text-yellow-600" />}
                          </div>
                          <p className="text-gray-600">{premio.descricao}</p>
                        </div>
                      ))}

                      {competicao.premiacao.premiosEspeciais && competicao.premiacao.premiosEspeciais.length > 0 && (
                        <div className="mt-2">
                          <p className="text-xs font-medium text-purple-600 mb-1">Especiais:</p>
                          {competicao.premiacao.premiosEspeciais.map((especial, index) => (
                            <div key={index} className="p-2 bg-purple-50 rounded text-xs mb-1">
                              <p className="font-medium">{especial.categoria}</p>
                              <p className="text-gray-600">{especial.descricao}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-sm text-gray-900 mb-2">
                      Financeiro
                    </h4>
                    <div className="space-y-1 text-sm text-gray-600">
                      <div className="flex justify-between">
                        <span>Orçamento:</span>
                        <span className="font-bold">R$ {competicao.financeiro.orcamentoTotal.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Gastos:</span>
                        <span className="font-bold text-red-600">R$ {competicao.financeiro.custosRealizados.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Receita:</span>
                        <span className="font-bold text-green-600">
                          R$ {(competicao.financeiro.receitaInscricoes + competicao.financeiro.receitaPatrocinio).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Saldo:</span>
                        <span className={`font-bold ${
                          (competicao.financeiro.receitaInscricoes + competicao.financeiro.receitaPatrocinio - competicao.financeiro.custosRealizados) >= 0
                          ? 'text-green-600' : 'text-red-600'
                        }`}>
                          R$ {((competicao.financeiro.receitaInscricoes + competicao.financeiro.receitaPatrocinio) - competicao.financeiro.custosRealizados).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {competicao.resultados && (
                <div className="mt-6 pt-4 border-t">
                  <h4 className="font-medium text-sm text-gray-900 mb-2 flex items-center gap-2">
                    <Crown className="h-4 w-4" />
                    Resultados
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {competicao.resultados.campeao && (
                      <div className="p-3 bg-yellow-100 rounded">
                        <div className="flex items-center gap-2">
                          <Crown className="h-4 w-4 text-yellow-600" />
                          <span className="text-sm font-medium">Campeão</span>
                        </div>
                        <p className="text-sm font-bold text-yellow-800">{competicao.resultados.campeao}</p>
                      </div>
                    )}

                    {competicao.resultados.viceCampeao && (
                      <div className="p-3 bg-gray-100 rounded">
                        <div className="flex items-center gap-2">
                          <Medal className="h-4 w-4 text-gray-600" />
                          <span className="text-sm font-medium">Vice-Campeão</span>
                        </div>
                        <p className="text-sm font-bold text-gray-800">{competicao.resultados.viceCampeao}</p>
                      </div>
                    )}

                    {competicao.resultados.artilheiro && (
                      <div className="p-3 bg-green-100 rounded">
                        <div className="flex items-center gap-2">
                          <Target className="h-4 w-4 text-green-600" />
                          <span className="text-sm font-medium">Artilheiro</span>
                        </div>
                        <p className="text-sm font-bold text-green-800">{competicao.resultados.artilheiro}</p>
                      </div>
                    )}

                    {competicao.resultados.melhorJogador && (
                      <div className="p-3 bg-blue-100 rounded">
                        <div className="flex items-center gap-2">
                          <Star className="h-4 w-4 text-blue-600" />
                          <span className="text-sm font-medium">Melhor Jogador</span>
                        </div>
                        <p className="text-sm font-bold text-blue-800">{competicao.resultados.melhorJogador}</p>
                      </div>
                    )}
                  </div>

                  {competicao.resultados.destaquesGerais && competicao.resultados.destaquesGerais.length > 0 && (
                    <div className="mt-4">
                      <h5 className="font-medium text-sm text-gray-900 mb-2">Destaques Gerais</h5>
                      <div className="space-y-1">
                        {competicao.resultados.destaquesGerais.map((destaque, index) => (
                          <p key={index} className="text-sm text-gray-600">• {destaque}</p>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {competicao.observacoes && (
                <div className="mt-6 pt-4 border-t">
                  <h4 className="font-medium text-sm text-gray-900 mb-2">Observações</h4>
                  <p className="text-sm text-gray-600">{competicao.observacoes}</p>
                </div>
              )}

              <div className="flex justify-end gap-2 mt-4 pt-4 border-t">
                <Button variant="outline" size="sm">
                  <MapPin className="h-4 w-4 mr-1" />
                  Ver Locais
                </Button>
                <Button variant="outline" size="sm">
                  <Calendar className="h-4 w-4 mr-1" />
                  Cronograma
                </Button>
                <Button size="sm">
                  <Trophy className="h-4 w-4 mr-1" />
                  Gerenciar
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-blue-600" />
            Serviços Gerados Automaticamente
          </CardTitle>
          <CardDescription>
            Esta página gera automaticamente os seguintes serviços para o catálogo público:
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium text-green-700 mb-2">Inscrição em Competição</h4>
              <p className="text-sm text-gray-600">
                Permite que equipes e atletas se inscrevam em competições esportivas organizadas pelo município.
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium text-green-700 mb-2">Organização de Torneio</h4>
              <p className="text-sm text-gray-600">
                Solicitação de apoio municipal para organização de torneios e competições esportivas locais.
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium text-green-700 mb-2">Arbitragem</h4>
              <p className="text-sm text-gray-600">
                Sistema de designação e contratação de árbitros para competições esportivas municipais.
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium text-green-700 mb-2">Premiação</h4>
              <p className="text-sm text-gray-600">
                Consulta de resultados, classificações e premiações das competições esportivas realizadas.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}