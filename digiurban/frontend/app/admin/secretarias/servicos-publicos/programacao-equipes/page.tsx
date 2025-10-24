'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import {
  Calendar,
  Users,
  Clock,
  MapPin,
  Truck,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Eye,
  Download,
  Filter,
  Search,
  Plus,
  Edit,
  UserCheck,
  Route,
  Settings
} from 'lucide-react'
import { useAdminAuth } from '@/contexts/AdminAuthContext'

interface Funcionario {
  id: string
  nome: string
  cargo: string
  especialidade: string[]
  disponibilidade: 'disponivel' | 'ocupado' | 'afastado' | 'ferias'
  telefone: string
  equipe_atual?: string
}

interface Veiculo {
  id: string
  placa: string
  tipo: string
  modelo: string
  status: 'disponivel' | 'em_uso' | 'manutencao' | 'indisponivel'
  km_atual: number
  combustivel: number
  ultima_revisao: string
}

interface Programacao {
  id: string
  data: string
  turno: 'manha' | 'tarde' | 'noite' | 'integral'
  equipe_nome: string
  servico_tipo: string
  area_atendimento: string
  prioridade: 'baixa' | 'media' | 'alta' | 'urgente'
  funcionarios: string[]
  veiculos: string[]
  equipamentos: string[]
  status: 'programado' | 'em_andamento' | 'concluido' | 'cancelado'
  observacoes: string
  tempo_estimado: number
  coordenador_responsavel: string
  checklist: Array<{
    item: string
    concluido: boolean
    responsavel?: string
    observacao?: string
  }>
}

export default function ProgramacaoEquipes() {
  const { user, hasPermission } = useAdminAuth()

  const [funcionarios] = useState<Funcionario[]>([
    {
      id: '1',
      nome: 'João Silva',
      cargo: 'Coordenador',
      especialidade: ['Limpeza', 'Supervisão'],
      disponibilidade: 'disponivel',
      telefone: '(61) 99999-0001'
    },
    {
      id: '2',
      nome: 'Maria Santos',
      cargo: 'Gari',
      especialidade: ['Coleta', 'Varrição'],
      disponibilidade: 'disponivel',
      telefone: '(61) 99999-0002'
    },
    {
      id: '3',
      nome: 'Pedro Costa',
      cargo: 'Motorista',
      especialidade: ['Condução', 'Manutenção Veicular'],
      disponibilidade: 'disponivel',
      telefone: '(61) 99999-0003'
    },
    {
      id: '4',
      nome: 'Ana Oliveira',
      cargo: 'Eletricista',
      especialidade: ['Iluminação', 'Instalações Elétricas'],
      disponibilidade: 'ocupado',
      telefone: '(61) 99999-0004'
    },
    {
      id: '5',
      nome: 'Carlos Mendes',
      cargo: 'Técnico',
      especialidade: ['Manutenção', 'Reparos'],
      disponibilidade: 'disponivel',
      telefone: '(61) 99999-0005'
    }
  ])

  const [veiculos] = useState<Veiculo[]>([
    {
      id: '1',
      placa: 'ABC-1234',
      tipo: 'Caminhão Coletor',
      modelo: 'Mercedes Accelo 815',
      status: 'disponivel',
      km_atual: 45000,
      combustivel: 80,
      ultima_revisao: '2024-01-10'
    },
    {
      id: '2',
      placa: 'DEF-5678',
      tipo: 'Caminhão Basculante',
      modelo: 'Volkswagen Delivery',
      status: 'em_uso',
      km_atual: 32000,
      combustivel: 60,
      ultima_revisao: '2024-01-05'
    },
    {
      id: '3',
      placa: 'GHI-9012',
      tipo: 'Van Equipe',
      modelo: 'Renault Master',
      status: 'disponivel',
      km_atual: 28000,
      combustivel: 90,
      ultima_revisao: '2024-01-12'
    }
  ])

  const [programacoes, setProgramacoes] = useState<Programacao[]>([
    {
      id: '1',
      data: '2024-01-22',
      turno: 'manha',
      equipe_nome: 'Equipe Limpeza A',
      servico_tipo: 'Coleta Domiciliar',
      area_atendimento: 'Centro - Zona 1',
      prioridade: 'alta',
      funcionarios: ['1', '2', '3'],
      veiculos: ['1'],
      equipamentos: ['Vassouras', 'Sacos de lixo', 'Luvas'],
      status: 'programado',
      observacoes: 'Rota completa do centro da cidade',
      tempo_estimado: 480,
      coordenador_responsavel: 'João Silva',
      checklist: [
        { item: 'Verificar combustível do veículo', concluido: false },
        { item: 'Conferir equipamentos de segurança', concluido: false },
        { item: 'Distribuir materiais de limpeza', concluido: false },
        { item: 'Briefing da equipe', concluido: false }
      ]
    },
    {
      id: '2',
      data: '2024-01-22',
      turno: 'tarde',
      equipe_nome: 'Equipe Iluminação',
      servico_tipo: 'Manutenção de Postes',
      area_atendimento: 'Bairro Vila Nova',
      prioridade: 'media',
      funcionarios: ['4', '5'],
      veiculos: ['3'],
      equipamentos: ['Escada', 'Ferramentas elétricas', 'Lâmpadas LED'],
      status: 'em_andamento',
      observacoes: 'Substituição de 15 lâmpadas queimadas',
      tempo_estimado: 240,
      coordenador_responsavel: 'Ana Oliveira',
      checklist: [
        { item: 'Verificar combustível do veículo', concluido: true, responsavel: 'Carlos Mendes' },
        { item: 'Conferir equipamentos de segurança', concluido: true, responsavel: 'Ana Oliveira' },
        { item: 'Testar equipamentos elétricos', concluido: true, responsavel: 'Ana Oliveira' },
        { item: 'Mapear pontos de manutenção', concluido: false }
      ]
    }
  ])

  const [filtros, setFiltros] = useState({
    data: '',
    turno: '',
    status: '',
    equipe: '',
    area: ''
  })

  const [busca, setBusca] = useState('')
  const [programacao, setProgramacao] = useState<Programacao | null>(null)
  const [modoEdicao, setModoEdicao] = useState(false)

  const tipos_servico = [
    'Coleta Domiciliar',
    'Coleta Seletiva',
    'Varrição',
    'Capina',
    'Poda de Árvores',
    'Manutenção de Postes',
    'Reparos de Calçada',
    'Limpeza de Bueiros',
    'Desobstrução de Vias',
    'Manutenção de Praças'
  ]

  const areas_atendimento = [
    'Centro - Zona 1',
    'Centro - Zona 2',
    'Bairro Vila Nova',
    'Bairro Jardins',
    'Bairro Industrial',
    'Bairro Residencial',
    'Zona Rural Norte',
    'Zona Rural Sul'
  ]

  const equipamentos_disponiveis = [
    'Vassouras',
    'Sacos de lixo',
    'Luvas',
    'Escada',
    'Ferramentas elétricas',
    'Lâmpadas LED',
    'Roçadeira',
    'Motosserra',
    'Enxadas',
    'Picaretas'
  ]

  const getStatusColor = (status: string) => {
    const colors = {
      programado: 'bg-blue-100 text-blue-800',
      em_andamento: 'bg-yellow-100 text-yellow-800',
      concluido: 'bg-green-100 text-green-800',
      cancelado: 'bg-red-100 text-red-800'
    }
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  const getPrioridadeColor = (prioridade: string) => {
    const colors = {
      baixa: 'bg-green-100 text-green-800',
      media: 'bg-yellow-100 text-yellow-800',
      alta: 'bg-orange-100 text-orange-800',
      urgente: 'bg-red-100 text-red-800'
    }
    return colors[prioridade as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  const getDisponibilidadeColor = (disponibilidade: string) => {
    const colors = {
      disponivel: 'bg-green-100 text-green-800',
      ocupado: 'bg-yellow-100 text-yellow-800',
      afastado: 'bg-red-100 text-red-800',
      ferias: 'bg-blue-100 text-blue-800'
    }
    return colors[disponibilidade as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  const programacoesFiltradas = programacoes.filter(p => {
    const matchBusca = p.equipe_nome.toLowerCase().includes(busca.toLowerCase()) ||
                      p.servico_tipo.toLowerCase().includes(busca.toLowerCase()) ||
                      p.area_atendimento.toLowerCase().includes(busca.toLowerCase()) ||
                      p.coordenador_responsavel.toLowerCase().includes(busca.toLowerCase())

    const matchData = !filtros.data || p.data === filtros.data
    const matchTurno = !filtros.turno || p.turno === filtros.turno
    const matchStatus = !filtros.status || p.status === filtros.status
    const matchEquipe = !filtros.equipe || p.equipe_nome.includes(filtros.equipe)
    const matchArea = !filtros.area || p.area_atendimento.includes(filtros.area)

    return matchBusca && matchData && matchTurno && matchStatus && matchEquipe && matchArea
  })

  const stats = {
    total: programacoes.length,
    programados: programacoes.filter(p => p.status === 'programado').length,
    em_andamento: programacoes.filter(p => p.status === 'em_andamento').length,
    concluidos: programacoes.filter(p => p.status === 'concluido').length,
    funcionarios_disponiveis: funcionarios.filter(f => f.disponibilidade === 'disponivel').length,
    veiculos_disponiveis: veiculos.filter(v => v.status === 'disponivel').length
  }

  const salvarProgramacao = () => {
    if (programacao) {
      if (programacao.id) {
        setProgramacoes(programacoes.map(p => p.id === programacao.id ? programacao : p))
      } else {
        const novaProgramacao = {
          ...programacao,
          id: Date.now().toString()
        }
        setProgramacoes([...programacoes, novaProgramacao])
      }
      setProgramacao(null)
      setModoEdicao(false)
    }
  }

  const atualizarChecklist = (programacaoId: string, itemIndex: number, concluido: boolean, responsavel?: string, observacao?: string) => {
    setProgramacoes(programacoes.map(p =>
      p.id === programacaoId
        ? {
            ...p,
            checklist: p.checklist.map((item, index) =>
              index === itemIndex
                ? { ...item, concluido, responsavel, observacao }
                : item
            )
          }
        : p
    ))
  }

  const gerarServicosAutomaticos = () => {
    return [
      {
        nome: "Agendamento de Serviços Urbanos",
        descricao: "Agende serviços de limpeza, manutenção e infraestrutura urbana",
        categoria: "Serviços Urbanos",
        prazo: "3 dias úteis",
        documentos: ["Descrição do serviço", "Localização"],
        digital: true,
        gratuito: true
      },
      {
        nome: "Acompanhamento de Equipes",
        descricao: "Consulte o cronograma e localização das equipes de serviços públicos",
        categoria: "Consultas",
        prazo: "Imediato",
        documentos: ["Região de interesse"],
        digital: true,
        gratuito: true
      },
      {
        nome: "Solicitação de Serviço Emergencial",
        descricao: "Solicite atendimento emergencial para problemas urbanos urgentes",
        categoria: "Emergência",
        prazo: "24 horas",
        documentos: ["Descrição da emergência", "Fotos", "Localização"],
        digital: true,
        gratuito: true
      }
    ]
  }

  if (!['admin', 'secretario', 'coordenador'].some(permission => hasPermission(permission))) {
    return <div className="p-6">Acesso negado. Você não tem permissão para acessar esta página.</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Programação de Equipes</h1>
          <p className="text-muted-foreground mt-2">
            Sistema de programação, alocação e acompanhamento de equipes de serviços públicos urbanos
          </p>
        </div>
        <Button onClick={() => {
          setProgramacao({
            id: '',
            data: '',
            turno: 'manha',
            equipe_nome: '',
            servico_tipo: '',
            area_atendimento: '',
            prioridade: 'media',
            funcionarios: [],
            veiculos: [],
            equipamentos: [],
            status: 'programado',
            observacoes: '',
            tempo_estimado: 240,
            coordenador_responsavel: '',
            checklist: []
          })
          setModoEdicao(true)
        }}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Programação
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Programações</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">Todas as programações</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Programados</CardTitle>
            <Clock className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.programados}</div>
            <p className="text-xs text-muted-foreground">Aguardando execução</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Em Andamento</CardTitle>
            <Settings className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.em_andamento}</div>
            <p className="text-xs text-muted-foreground">Sendo executados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Concluídos</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.concluidos}</div>
            <p className="text-xs text-muted-foreground">Finalizados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Funcionários</CardTitle>
            <UserCheck className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.funcionarios_disponiveis}</div>
            <p className="text-xs text-muted-foreground">Disponíveis</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Veículos</CardTitle>
            <Truck className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.veiculos_disponiveis}</div>
            <p className="text-xs text-muted-foreground">Disponíveis</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros e Busca
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="Buscar por equipe, serviço, área ou coordenador..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="w-full"
              />
            </div>
            <Button variant="outline">
              <Search className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <Input
              type="date"
              value={filtros.data}
              onChange={(e) => setFiltros({...filtros, data: e.target.value})}
              placeholder="Data"
            />

            <Select value={filtros.turno} onValueChange={(value) => setFiltros({...filtros, turno: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Turno" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos</SelectItem>
                <SelectItem value="manha">Manhã</SelectItem>
                <SelectItem value="tarde">Tarde</SelectItem>
                <SelectItem value="noite">Noite</SelectItem>
                <SelectItem value="integral">Integral</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filtros.status} onValueChange={(value) => setFiltros({...filtros, status: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos</SelectItem>
                <SelectItem value="programado">Programado</SelectItem>
                <SelectItem value="em_andamento">Em Andamento</SelectItem>
                <SelectItem value="concluido">Concluído</SelectItem>
                <SelectItem value="cancelado">Cancelado</SelectItem>
              </SelectContent>
            </Select>

            <Input
              placeholder="Equipe"
              value={filtros.equipe}
              onChange={(e) => setFiltros({...filtros, equipe: e.target.value})}
            />

            <Input
              placeholder="Área"
              value={filtros.area}
              onChange={(e) => setFiltros({...filtros, area: e.target.value})}
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Programações ({programacoesFiltradas.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {programacoesFiltradas.map((prog) => (
                  <div key={prog.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-semibold">{prog.equipe_nome}</h4>
                        <p className="text-sm text-muted-foreground">{prog.servico_tipo}</p>
                      </div>
                      <div className="flex gap-2">
                        <Badge className={getStatusColor(prog.status)}>
                          {prog.status.replace('_', ' ')}
                        </Badge>
                        <Badge className={getPrioridadeColor(prog.prioridade)}>
                          {prog.prioridade}
                        </Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm mb-2">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {prog.data} - {prog.turno}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {prog.area_atendimento}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {prog.funcionarios.length} funcionários
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {Math.floor(prog.tempo_estimado / 60)}h {prog.tempo_estimado % 60}m
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground mb-2">
                      Coordenador: {prog.coordenador_responsavel}
                    </p>

                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs text-muted-foreground">
                        Checklist: {prog.checklist.filter(c => c.concluido).length}/{prog.checklist.length}
                      </span>
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{
                            width: `${(prog.checklist.filter(c => c.concluido).length / Math.max(prog.checklist.length, 1)) * 100}%`
                          }}
                        />
                      </div>
                    </div>

                    <div className="flex gap-2 mt-3">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setProgramacao(prog)}
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        Ver
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setProgramacao(prog)
                          setModoEdicao(true)
                        }}
                      >
                        <Edit className="h-3 w-3 mr-1" />
                        Editar
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Status da Equipe
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {funcionarios.map((func) => (
                  <div key={func.id} className="flex items-center justify-between p-2 border rounded">
                    <div>
                      <p className="font-medium text-sm">{func.nome}</p>
                      <p className="text-xs text-muted-foreground">{func.cargo}</p>
                    </div>
                    <Badge className={getDisponibilidadeColor(func.disponibilidade)}>
                      {func.disponibilidade}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Route className="h-5 w-5" />
                Serviços Gerados
              </CardTitle>
              <CardDescription>
                Serviços criados automaticamente para o catálogo público
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {gerarServicosAutomaticos().map((servico, index) => (
                  <div key={index} className="border rounded-lg p-3">
                    <h4 className="font-semibold text-sm">{servico.nome}</h4>
                    <p className="text-xs text-muted-foreground mt-1">{servico.descricao}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs">
                      <Badge variant="outline">{servico.categoria}</Badge>
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {servico.prazo}
                      </span>
                      {servico.digital && <Badge className="bg-green-100 text-green-800">Digital</Badge>}
                      {servico.gratuito && <Badge className="bg-blue-100 text-blue-800">Gratuito</Badge>}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Integração Bidirecional</span>
                  <Badge className="bg-purple-100 text-purple-800">
                    <Settings className="h-3 w-3 mr-1" />
                    Auto-Sync
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Novos tipos de programação geram automaticamente novos serviços no catálogo público
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {programacao && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              {modoEdicao ? 'Editar Programação' : 'Detalhes da Programação'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {modoEdicao ? (
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm font-medium">Data</label>
                  <Input
                    type="date"
                    value={programacao.data}
                    onChange={(e) => setProgramacao({...programacao, data: e.target.value})}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Turno</label>
                  <Select value={programacao.turno} onValueChange={(value) => setProgramacao({...programacao, turno: value as any})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="manha">Manhã</SelectItem>
                      <SelectItem value="tarde">Tarde</SelectItem>
                      <SelectItem value="noite">Noite</SelectItem>
                      <SelectItem value="integral">Integral</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium">Nome da Equipe</label>
                  <Input
                    value={programacao.equipe_nome}
                    onChange={(e) => setProgramacao({...programacao, equipe_nome: e.target.value})}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Tipo de Serviço</label>
                  <Select value={programacao.servico_tipo} onValueChange={(value) => setProgramacao({...programacao, servico_tipo: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {tipos_servico.map(tipo => (
                        <SelectItem key={tipo} value={tipo}>{tipo}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium">Área de Atendimento</label>
                  <Select value={programacao.area_atendimento} onValueChange={(value) => setProgramacao({...programacao, area_atendimento: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {areas_atendimento.map(area => (
                        <SelectItem key={area} value={area}>{area}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium">Prioridade</label>
                  <Select value={programacao.prioridade} onValueChange={(value) => setProgramacao({...programacao, prioridade: value as any})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="baixa">Baixa</SelectItem>
                      <SelectItem value="media">Média</SelectItem>
                      <SelectItem value="alta">Alta</SelectItem>
                      <SelectItem value="urgente">Urgente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium">Coordenador Responsável</label>
                  <Input
                    value={programacao.coordenador_responsavel}
                    onChange={(e) => setProgramacao({...programacao, coordenador_responsavel: e.target.value})}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Tempo Estimado (minutos)</label>
                  <Input
                    type="number"
                    value={programacao.tempo_estimado}
                    onChange={(e) => setProgramacao({...programacao, tempo_estimado: parseInt(e.target.value)})}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="text-sm font-medium">Observações</label>
                  <Input
                    value={programacao.observacoes}
                    onChange={(e) => setProgramacao({...programacao, observacoes: e.target.value})}
                  />
                </div>

                <div className="md:col-span-2 flex gap-2">
                  <Button onClick={salvarProgramacao}>Salvar</Button>
                  <Button variant="outline" onClick={() => {
                    setProgramacao(null)
                    setModoEdicao(false)
                  }}>
                    Cancelar
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <h4 className="font-semibold mb-2">Informações Gerais</h4>
                    <div className="space-y-2 text-sm">
                      <p><strong>Equipe:</strong> {programacao.equipe_nome}</p>
                      <p><strong>Serviço:</strong> {programacao.servico_tipo}</p>
                      <p><strong>Data/Turno:</strong> {programacao.data} - {programacao.turno}</p>
                      <p><strong>Área:</strong> {programacao.area_atendimento}</p>
                      <p><strong>Coordenador:</strong> {programacao.coordenador_responsavel}</p>
                      <p><strong>Tempo Estimado:</strong> {Math.floor(programacao.tempo_estimado / 60)}h {programacao.tempo_estimado % 60}m</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Status e Prioridade</h4>
                    <div className="space-y-2 text-sm">
                      <p><strong>Status:</strong> <Badge className={getStatusColor(programacao.status)}>{programacao.status.replace('_', ' ')}</Badge></p>
                      <p><strong>Prioridade:</strong> <Badge className={getPrioridadeColor(programacao.prioridade)}>{programacao.prioridade}</Badge></p>
                      <p><strong>Funcionários:</strong> {programacao.funcionarios.length}</p>
                      <p><strong>Veículos:</strong> {programacao.veiculos.length}</p>
                    </div>
                  </div>
                </div>

                {programacao.checklist.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Checklist de Execução</h4>
                    <div className="space-y-2">
                      {programacao.checklist.map((item, index) => (
                        <div key={index} className="flex items-center gap-2 p-2 border rounded">
                          <input
                            type="checkbox"
                            checked={item.concluido}
                            onChange={(e) => atualizarChecklist(
                              programacao.id,
                              index,
                              e.target.checked,
                              user?.nome
                            )}
                          />
                          <span className={item.concluido ? 'line-through text-muted-foreground' : ''}>
                            {item.item}
                          </span>
                          {item.responsavel && (
                            <Badge variant="outline" className="ml-auto">
                              {item.responsavel}
                            </Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button onClick={() => setModoEdicao(true)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Editar
                  </Button>
                  <Button variant="outline" onClick={() => setProgramacao(null)}>
                    Fechar
                  </Button>
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Relatório
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}