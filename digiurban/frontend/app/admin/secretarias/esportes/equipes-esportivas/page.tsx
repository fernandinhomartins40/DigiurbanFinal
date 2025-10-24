'use client'

import { useState } from 'react'
import { useAdminAuth } from '@/contexts/AdminAuthContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import {
  Users,
  Plus,
  Search,
  Filter,
  Download,
  Trophy,
  User,
  Calendar,
  MapPin,
  Phone,
  Award,
  Activity,
  Target,
  Crown,
  Star,
  Zap
} from 'lucide-react'

interface EquipeEsportiva {
  id: string
  nome: string
  modalidade: string
  categoria: 'Sub-11' | 'Sub-13' | 'Sub-15' | 'Sub-17' | 'Sub-20' | 'Adulto' | 'Veterano' | 'Master'
  genero: 'Masculino' | 'Feminino' | 'Misto'
  nivel: 'Iniciante' | 'Intermediário' | 'Avançado' | 'Competitivo' | 'Profissional'
  status: 'Ativa' | 'Inativa' | 'Em Formação' | 'Suspensa' | 'Dissolvida'
  comissaoTecnica: {
    tecnico: string
    auxiliarTecnico?: string
    preparadorFisico?: string
    fisioterapeuta?: string
    coordenador: string
  }
  atletas: {
    totalAtletas: number
    atletasAtivos: number
    atletasLicenciados: number
    listaAtletas: Array<{
      nome: string
      posicao?: string
      numero?: number
      idade: number
      situacao: 'Ativo' | 'Licenciado' | 'Suspenso' | 'Lesionado'
    }>
  }
  treinamentos: {
    local: string
    diasSemana: string[]
    horarioInicio: string
    horarioFim: string
    duracao: string
  }
  competicoes: {
    participando: Array<{
      nome: string
      categoria: string
      dataInicio: string
      status: 'Inscrita' | 'Em Andamento' | 'Finalizada'
      posicao?: number
    }>
    historico: Array<{
      competicao: string
      ano: string
      posicao: number
      premios?: string[]
    }>
  }
  desempenho: {
    jogos: number
    vitorias: number
    empates: number
    derrotas: number
    golsPro: number
    golsContra: number
    pontuacao: number
    posicaoRanking?: number
  }
  equipamentos: {
    uniformes: number
    materiaisEsportivos: string[]
    equipamentosProprietarios: string[]
    necessidades: string[]
  }
  orcamento: {
    orcamentoAnual: number
    gastosAtuais: number
    fonteRecursos: string[]
    pendenciasFinanceiras?: string[]
  }
  observacoes?: string
  dataFundacao: string
  dataUltimaAtualizacao: string
}

const mockEquipes: EquipeEsportiva[] = [
  {
    id: '1',
    nome: 'Leões do Município FC',
    modalidade: 'Futebol',
    categoria: 'Adulto',
    genero: 'Masculino',
    nivel: 'Competitivo',
    status: 'Ativa',
    comissaoTecnica: {
      tecnico: 'Prof. João Silva',
      auxiliarTecnico: 'Carlos Assistente',
      preparadorFisico: 'Ana Preparadora',
      coordenador: 'Dr. Pedro Coordenador'
    },
    atletas: {
      totalAtletas: 25,
      atletasAtivos: 22,
      atletasLicenciados: 3,
      listaAtletas: [
        { nome: 'Roberto Goleiro', posicao: 'Goleiro', numero: 1, idade: 28, situacao: 'Ativo' },
        { nome: 'Carlos Zagueiro', posicao: 'Zagueiro', numero: 4, idade: 26, situacao: 'Ativo' },
        { nome: 'João Atacante', posicao: 'Atacante', numero: 9, idade: 24, situacao: 'Licenciado' }
      ]
    },
    treinamentos: {
      local: 'Campo Municipal 1',
      diasSemana: ['Segunda', 'Quarta', 'Sexta'],
      horarioInicio: '19:00',
      horarioFim: '21:00',
      duracao: '2 horas'
    },
    competicoes: {
      participando: [
        {
          nome: 'Campeonato Regional',
          categoria: 'Adulto Masculino',
          dataInicio: '2024-02-01',
          status: 'Em Andamento',
          posicao: 3
        }
      ],
      historico: [
        {
          competicao: 'Campeonato Municipal 2023',
          ano: '2023',
          posicao: 1,
          premios: ['Campeão Municipal', 'Melhor Ataque']
        },
        {
          competicao: 'Copa Regional 2023',
          ano: '2023',
          posicao: 2,
          premios: ['Vice-Campeão']
        }
      ]
    },
    desempenho: {
      jogos: 15,
      vitorias: 10,
      empates: 3,
      derrotas: 2,
      golsPro: 32,
      golsContra: 12,
      pontuacao: 33,
      posicaoRanking: 3
    },
    equipamentos: {
      uniformes: 30,
      materiaisEsportivos: ['Bolas', 'Cones', 'Coletes', 'Traves portáteis'],
      equipamentosProprietarios: ['Kit médico', 'Pranchetas táticas'],
      necessidades: ['Chuteiras novas', 'Uniformes reserva']
    },
    orcamento: {
      orcamentoAnual: 25000,
      gastosAtuais: 18500,
      fonteRecursos: ['Prefeitura Municipal', 'Patrocinadores locais'],
      pendenciasFinanceiras: ['Arbitragem do último jogo']
    },
    observacoes: 'Equipe em excelente fase, com grande potencial para títulos',
    dataFundacao: '2020-03-15',
    dataUltimaAtualizacao: '2024-01-15'
  },
  {
    id: '2',
    nome: 'Vôlei Feminino Municipal',
    modalidade: 'Voleibol',
    categoria: 'Adulto',
    genero: 'Feminino',
    nivel: 'Intermediário',
    status: 'Ativa',
    comissaoTecnica: {
      tecnico: 'Profa. Maria Santos',
      auxiliarTecnico: 'Ana Auxiliar',
      coordenador: 'Dra. Lucia Coordenadora'
    },
    atletas: {
      totalAtletas: 15,
      atletasAtivos: 14,
      atletasLicenciados: 1,
      listaAtletas: [
        { nome: 'Carla Levantadora', posicao: 'Levantadora', numero: 6, idade: 23, situacao: 'Ativo' },
        { nome: 'Fernanda Oposta', posicao: 'Oposta', numero: 10, idade: 25, situacao: 'Ativo' },
        { nome: 'Paula Central', posicao: 'Central', numero: 12, idade: 22, situacao: 'Lesionado' }
      ]
    },
    treinamentos: {
      local: 'Quadra Poliesportiva Municipal',
      diasSemana: ['Terça', 'Quinta', 'Sábado'],
      horarioInicio: '18:30',
      horarioFim: '20:30',
      duracao: '2 horas'
    },
    competicoes: {
      participando: [
        {
          nome: 'Liga Municipal de Vôlei',
          categoria: 'Adulto Feminino',
          dataInicio: '2024-01-20',
          status: 'Em Andamento',
          posicao: 2
        }
      ],
      historico: [
        {
          competicao: 'Campeonato Estadual Juvenil 2023',
          ano: '2023',
          posicao: 4
        }
      ]
    },
    desempenho: {
      jogos: 8,
      vitorias: 6,
      empates: 0,
      derrotas: 2,
      golsPro: 24,
      golsContra: 12,
      pontuacao: 18,
      posicaoRanking: 2
    },
    equipamentos: {
      uniformes: 20,
      materiaisEsportivos: ['Bolas de vôlei', 'Rede', 'Antenas', 'Marcadores'],
      equipamentosProprietarios: ['Kit primeiros socorros'],
      necessidades: ['Joelheiras', 'Tênis especializados']
    },
    orcamento: {
      orcamentoAnual: 15000,
      gastosAtuais: 8200,
      fonteRecursos: ['Prefeitura Municipal', 'Rifas beneficentes']
    },
    observacoes: 'Equipe jovem com muito potencial de crescimento',
    dataFundacao: '2021-08-10',
    dataUltimaAtualizacao: '2024-01-12'
  }
]

export default function EquipesEsportivasPage() {
  const { user } = useAdminAuth()
  const [equipes, setEquipes] = useState<EquipeEsportiva[]>(mockEquipes)
  const [searchTerm, setSearchTerm] = useState('')
  const [modalidadeFilter, setModalidadeFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [categoriaFilter, setCategoriaFilter] = useState<string>('all')
  const [showNewEquipeModal, setShowNewEquipeModal] = useState(false)

  const filteredEquipes = equipes.filter(equipe => {
    const matchesSearch = equipe.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         equipe.modalidade.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         equipe.comissaoTecnica.tecnico.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesModalidade = modalidadeFilter === 'all' || equipe.modalidade === modalidadeFilter
    const matchesStatus = statusFilter === 'all' || equipe.status === statusFilter
    const matchesCategoria = categoriaFilter === 'all' || equipe.categoria === categoriaFilter
    return matchesSearch && matchesModalidade && matchesStatus && matchesCategoria
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Ativa': return 'bg-green-100 text-green-800 border-green-200'
      case 'Inativa': return 'bg-gray-100 text-gray-800 border-gray-200'
      case 'Em Formação': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'Suspenso': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'Dissolvida': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getNivelColor = (nivel: string) => {
    switch (nivel) {
      case 'Iniciante': return 'bg-green-100 text-green-800 border-green-200'
      case 'Intermediário': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'Avançado': return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'Competitivo': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'Profissional': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getSituacaoAtletaColor = (situacao: string) => {
    switch (situacao) {
      case 'Ativo': return 'bg-green-100 text-green-800'
      case 'Licenciado': return 'bg-yellow-100 text-yellow-800'
      case 'Suspenso': return 'bg-red-100 text-red-800'
      case 'Lesionado': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const stats = {
    totalEquipes: equipes.length,
    equipesAtivas: equipes.filter(e => e.status === 'Ativa').length,
    totalAtletas: equipes.reduce((acc, e) => acc + e.atletas.totalAtletas, 0),
    competicoes: equipes.reduce((acc, e) => acc + e.competicoes.participando.length, 0)
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Users className="h-8 w-8 text-blue-600" />
            Equipes Esportivas
          </h1>
          <p className="text-gray-600 mt-1">
            Gestão de equipes municipais com modalidades e categorias
          </p>
        </div>
        <Button onClick={() => setShowNewEquipeModal(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Nova Equipe
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Equipes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalEquipes}</div>
            <p className="text-xs text-muted-foreground">registradas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Equipes Ativas</CardTitle>
            <Trophy className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.equipesAtivas}</div>
            <p className="text-xs text-muted-foreground">em atividade</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Atletas</CardTitle>
            <User className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.totalAtletas}</div>
            <p className="text-xs text-muted-foreground">cadastrados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Em Competições</CardTitle>
            <Award className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{stats.competicoes}</div>
            <p className="text-xs text-muted-foreground">participações</p>
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
                  placeholder="Buscar por nome da equipe, modalidade ou técnico..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
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
                <SelectItem value="Natação">Natação</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Status</SelectItem>
                <SelectItem value="Ativa">Ativa</SelectItem>
                <SelectItem value="Inativa">Inativa</SelectItem>
                <SelectItem value="Em Formação">Em Formação</SelectItem>
                <SelectItem value="Suspenso">Suspenso</SelectItem>
                <SelectItem value="Dissolvida">Dissolvida</SelectItem>
              </SelectContent>
            </Select>
            <Select value={categoriaFilter} onValueChange={setCategoriaFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as Categorias</SelectItem>
                <SelectItem value="Sub-11">Sub-11</SelectItem>
                <SelectItem value="Sub-13">Sub-13</SelectItem>
                <SelectItem value="Sub-15">Sub-15</SelectItem>
                <SelectItem value="Sub-17">Sub-17</SelectItem>
                <SelectItem value="Sub-20">Sub-20</SelectItem>
                <SelectItem value="Adulto">Adulto</SelectItem>
                <SelectItem value="Veterano">Veterano</SelectItem>
                <SelectItem value="Master">Master</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6">
        {filteredEquipes.map((equipe) => (
          <Card key={equipe.id} className="overflow-hidden">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{equipe.nome}</CardTitle>
                  <CardDescription className="flex items-center gap-2 mt-1">
                    <Trophy className="h-4 w-4" />
                    {equipe.modalidade} - {equipe.categoria} {equipe.genero}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Badge className={getNivelColor(equipe.nivel)}>
                    {equipe.nivel}
                  </Badge>
                  <Badge className={getStatusColor(equipe.status)}>
                    {equipe.status}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-sm text-gray-900 mb-2 flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Comissão Técnica
                    </h4>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p><strong>Técnico:</strong> {equipe.comissaoTecnica.tecnico}</p>
                      {equipe.comissaoTecnica.auxiliarTecnico && (
                        <p><strong>Auxiliar:</strong> {equipe.comissaoTecnica.auxiliarTecnico}</p>
                      )}
                      {equipe.comissaoTecnica.preparadorFisico && (
                        <p><strong>Preparador:</strong> {equipe.comissaoTecnica.preparadorFisico}</p>
                      )}
                      {equipe.comissaoTecnica.fisioterapeuta && (
                        <p><strong>Fisioterapeuta:</strong> {equipe.comissaoTecnica.fisioterapeuta}</p>
                      )}
                      <p><strong>Coordenador:</strong> {equipe.comissaoTecnica.coordenador}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-sm text-gray-900 mb-2 flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Atletas
                    </h4>
                    <div className="space-y-1 text-sm text-gray-600">
                      <div className="flex justify-between">
                        <span>Total:</span>
                        <span className="font-bold">{equipe.atletas.totalAtletas}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Ativos:</span>
                        <span className="font-bold text-green-600">{equipe.atletas.atletasAtivos}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Licenciados:</span>
                        <span className="font-bold text-yellow-600">{equipe.atletas.atletasLicenciados}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-sm text-gray-900 mb-2 flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Treinamentos
                    </h4>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p><strong>Local:</strong> {equipe.treinamentos.local}</p>
                      <p><strong>Dias:</strong> {equipe.treinamentos.diasSemana.join(', ')}</p>
                      <p><strong>Horário:</strong> {equipe.treinamentos.horarioInicio} às {equipe.treinamentos.horarioFim}</p>
                      <p><strong>Duração:</strong> {equipe.treinamentos.duracao}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-sm text-gray-900 mb-2 flex items-center gap-2">
                      <Activity className="h-4 w-4" />
                      Desempenho Atual
                    </h4>
                    <div className="space-y-1 text-sm text-gray-600">
                      <div className="flex justify-between">
                        <span>Jogos:</span>
                        <span className="font-bold">{equipe.desempenho.jogos}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Vitórias:</span>
                        <span className="font-bold text-green-600">{equipe.desempenho.vitorias}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Empates:</span>
                        <span className="font-bold text-yellow-600">{equipe.desempenho.empates}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Derrotas:</span>
                        <span className="font-bold text-red-600">{equipe.desempenho.derrotas}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Pontos:</span>
                        <span className="font-bold">{equipe.desempenho.pontuacao}</span>
                      </div>
                      {equipe.desempenho.posicaoRanking && (
                        <div className="flex justify-between">
                          <span>Posição:</span>
                          <Badge variant="secondary" className="text-xs">{equipe.desempenho.posicaoRanking}º lugar</Badge>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-sm text-gray-900 mb-2 flex items-center gap-2">
                      <Award className="h-4 w-4" />
                      Competições
                    </h4>
                    {equipe.competicoes.participando.length > 0 && (
                      <div className="mb-3">
                        <p className="text-xs font-medium text-blue-600 mb-1">Em andamento:</p>
                        {equipe.competicoes.participando.map((comp, index) => (
                          <div key={index} className="p-2 bg-blue-50 rounded text-xs mb-1">
                            <p className="font-medium">{comp.nome}</p>
                            <p className="text-gray-600">{comp.categoria}</p>
                            {comp.posicao && (
                              <p className="text-blue-600 font-medium">Posição: {comp.posicao}º</p>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {equipe.competicoes.historico.length > 0 && (
                      <div>
                        <p className="text-xs font-medium text-gray-600 mb-1">Histórico recente:</p>
                        {equipe.competicoes.historico.slice(0, 2).map((hist, index) => (
                          <div key={index} className="p-2 bg-gray-50 rounded text-xs mb-1">
                            <p className="font-medium">{hist.competicao}</p>
                            <div className="flex justify-between items-center">
                              <span>{hist.ano}</span>
                              <Badge variant="secondary" className="text-xs">
                                {hist.posicao}º lugar
                              </Badge>
                            </div>
                            {hist.premios && hist.premios.length > 0 && (
                              <p className="text-green-600 text-xs mt-1">
                                {hist.premios.join(', ')}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div>
                    <h4 className="font-medium text-sm text-gray-900 mb-2">
                      Orçamento
                    </h4>
                    <div className="space-y-1 text-sm text-gray-600">
                      <div className="flex justify-between">
                        <span>Anual:</span>
                        <span className="font-bold">R$ {equipe.orcamento.orcamentoAnual.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Gasto:</span>
                        <span className="font-bold text-red-600">R$ {equipe.orcamento.gastosAtuais.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Disponível:</span>
                        <span className="font-bold text-green-600">
                          R$ {(equipe.orcamento.orcamentoAnual - equipe.orcamento.gastosAtuais).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {equipe.atletas.listaAtletas.length > 0 && (
                <div className="mt-6 pt-4 border-t">
                  <h4 className="font-medium text-sm text-gray-900 mb-2">Lista de Atletas</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                    {equipe.atletas.listaAtletas.map((atleta, index) => (
                      <div key={index} className="p-2 bg-gray-50 rounded">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-sm font-medium">{atleta.nome}</p>
                            <p className="text-xs text-gray-600">
                              {atleta.posicao && `${atleta.posicao} - `}
                              {atleta.numero && `#${atleta.numero} - `}
                              {atleta.idade} anos
                            </p>
                          </div>
                          <Badge variant="secondary" className={`text-xs ${getSituacaoAtletaColor(atleta.situacao)}`}>
                            {atleta.situacao}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {(equipe.equipamentos.necessidades.length > 0 || equipe.observacoes) && (
                <div className="mt-6 pt-4 border-t">
                  {equipe.equipamentos.necessidades.length > 0 && (
                    <div className="mb-4">
                      <h4 className="font-medium text-sm text-gray-900 mb-2">Necessidades de Equipamentos</h4>
                      <div className="flex flex-wrap gap-1">
                        {equipe.equipamentos.necessidades.map((item, index) => (
                          <Badge key={index} variant="secondary" className="text-xs bg-yellow-100 text-yellow-800">
                            {item}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {equipe.observacoes && (
                    <div>
                      <h4 className="font-medium text-sm text-gray-900 mb-2">Observações</h4>
                      <p className="text-sm text-gray-600">{equipe.observacoes}</p>
                    </div>
                  )}
                </div>
              )}

              <div className="flex justify-end gap-2 mt-4 pt-4 border-t">
                <Button variant="outline" size="sm">
                  <MapPin className="h-4 w-4 mr-1" />
                  Local Treino
                </Button>
                <Button variant="outline" size="sm">
                  <Phone className="h-4 w-4 mr-1" />
                  Contatar Técnico
                </Button>
                <Button size="sm">
                  <Users className="h-4 w-4 mr-1" />
                  Gerenciar Equipe
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
              <h4 className="font-medium text-green-700 mb-2">Inscrição em Equipe Municipal</h4>
              <p className="text-sm text-gray-600">
                Permite que atletas se inscrevam para seleções e testes em equipes municipais de diversas modalidades.
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium text-green-700 mb-2">Seleção de Atletas</h4>
              <p className="text-sm text-gray-600">
                Sistema de convocação e seleção para equipes municipais com base em critérios técnicos e idade.
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium text-green-700 mb-2">Acompanhamento de Equipe</h4>
              <p className="text-sm text-gray-600">
                Portal para acompanhar o desempenho, calendário de jogos e resultados das equipes municipais.
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium text-green-700 mb-2">Cronograma de Treinamentos</h4>
              <p className="text-sm text-gray-600">
                Consulta de horários, locais e calendário de treinamentos das equipes esportivas municipais.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}