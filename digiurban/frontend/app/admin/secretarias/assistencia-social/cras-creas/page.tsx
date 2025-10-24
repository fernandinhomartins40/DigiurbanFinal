'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import {
  Building2,
  Users,
  MapPin,
  Phone,
  Calendar,
  Clock,
  UserCheck,
  AlertTriangle,
  CheckCircle,
  Eye,
  Download,
  Filter,
  Search,
  Plus,
  Activity,
  Archive,
  Shield
} from 'lucide-react'
import { useAdminAuth, useAdminPermissions } from '@/contexts/AdminAuthContext'

interface EquipeTecnica {
  nome: string
  cargo: string
  especialidade: string
  situacao: 'ativo' | 'licenca' | 'ferias' | 'afastado'
}

interface ServicoCRAS {
  nome: string
  descricao: string
  publico_alvo: string
  dias_funcionamento: string[]
  horario: string
  vagas_disponiveis: number
  lista_espera: number
}

interface UnidadeSUAS {
  id: string
  codigo_unidade: string
  nome: string
  tipo: 'CRAS' | 'CREAS'
  endereco: {
    logradouro: string
    numero: string
    bairro: string
    cep: string
    telefone: string
    email: string
  }
  area_abrangencia: {
    bairros_atendidos: string[]
    territorio: string
    populacao_estimada: number
    familias_referenciadas: number
  }
  equipe_tecnica: EquipeTecnica[]
  servicos_ofertados: ServicoCRAS[]
  infraestrutura: {
    salas_atendimento: number
    sala_grupo: boolean
    brinquedoteca: boolean
    copa: boolean
    acessibilidade: boolean
    capacidade_maxima: number
  }
  funcionamento: {
    horario_funcionamento: string
    dias_semana: string[]
    data_inauguracao: string
    situacao: 'ativo' | 'reforma' | 'inativo'
  }
  indicadores: {
    familias_acompanhadas: number
    novos_acompanhamentos_mes: number
    grupos_convivencia_ativos: number
    oficinas_realizadas_mes: number
    atendimentos_mes: number
    taxa_ocupacao: number
  }
  historico_atividades: Array<{
    data: string
    tipo: string
    descricao: string
    participantes: number
    responsavel: string
  }>
  observacoes: string
}

export default function CrasCreas() {
  const { user } = useAdminAuth()
  const { hasPermission } = useAdminPermissions()
  const [unidades, setUnidades] = useState<UnidadeSUAS[]>([
    {
      id: '1',
      codigo_unidade: 'CRAS001',
      nome: 'CRAS Centro',
      tipo: 'CRAS',
      endereco: {
        logradouro: 'Rua Principal',
        numero: '100',
        bairro: 'Centro',
        cep: '72000-000',
        telefone: '(61) 3333-1111',
        email: 'cras.centro@municipio.gov.br'
      },
      area_abrangencia: {
        bairros_atendidos: ['Centro', 'Vila Nova', 'Jardim Central'],
        territorio: 'Território I',
        populacao_estimada: 15000,
        familias_referenciadas: 450
      },
      equipe_tecnica: [
        { nome: 'Ana Costa', cargo: 'Assistente Social', especialidade: 'Famílias', situacao: 'ativo' },
        { nome: 'Carlos Silva', cargo: 'Psicólogo', especialidade: 'Grupos', situacao: 'ativo' },
        { nome: 'Maria Santos', cargo: 'Auxiliar Social', especialidade: 'Cadastro', situacao: 'ativo' },
        { nome: 'João Oliveira', cargo: 'Coordenador', especialidade: 'Gestão', situacao: 'ativo' }
      ],
      servicos_ofertados: [
        {
          nome: 'PAIF - Proteção e Atendimento Integral à Família',
          descricao: 'Trabalho social com famílias em situação de vulnerabilidade',
          publico_alvo: 'Famílias em vulnerabilidade social',
          dias_funcionamento: ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'],
          horario: '08:00 às 17:00',
          vagas_disponiveis: 50,
          lista_espera: 15
        },
        {
          nome: 'Grupos de Convivência',
          descricao: 'Atividades coletivas para fortalecimento de vínculos',
          publico_alvo: 'Famílias e indivíduos',
          dias_funcionamento: ['Terça', 'Quinta'],
          horario: '14:00 às 16:00',
          vagas_disponiveis: 30,
          lista_espera: 8
        },
        {
          nome: 'Cadastro Único',
          descricao: 'Cadastramento para programas sociais do governo',
          publico_alvo: 'Famílias de baixa renda',
          dias_funcionamento: ['Segunda', 'Quarta', 'Sexta'],
          horario: '08:00 às 12:00',
          vagas_disponiveis: 20,
          lista_espera: 5
        }
      ],
      infraestrutura: {
        salas_atendimento: 4,
        sala_grupo: true,
        brinquedoteca: true,
        copa: true,
        acessibilidade: true,
        capacidade_maxima: 100
      },
      funcionamento: {
        horario_funcionamento: '08:00 às 17:00',
        dias_semana: ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'],
        data_inauguracao: '2020-03-15',
        situacao: 'ativo'
      },
      indicadores: {
        familias_acompanhadas: 425,
        novos_acompanhamentos_mes: 35,
        grupos_convivencia_ativos: 8,
        oficinas_realizadas_mes: 16,
        atendimentos_mes: 280,
        taxa_ocupacao: 85
      },
      historico_atividades: [
        {
          data: '2024-01-15',
          tipo: 'Oficina',
          descricao: 'Oficina de artesanato para geração de renda',
          participantes: 25,
          responsavel: 'Maria Santos'
        },
        {
          data: '2024-01-18',
          tipo: 'Grupo',
          descricao: 'Grupo de convivência de idosos',
          participantes: 30,
          responsavel: 'Carlos Silva'
        }
      ],
      observacoes: 'Unidade funcionando em plena capacidade. Demanda crescente por novos serviços.'
    },
    {
      id: '2',
      codigo_unidade: 'CREAS001',
      nome: 'CREAS Municipal',
      tipo: 'CREAS',
      endereco: {
        logradouro: 'Av. das Nações',
        numero: '200',
        bairro: 'Vila Nova',
        cep: '72001-000',
        telefone: '(61) 3333-2222',
        email: 'creas.municipal@municipio.gov.br'
      },
      area_abrangencia: {
        bairros_atendidos: ['Todo o município'],
        territorio: 'Municipal',
        populacao_estimada: 50000,
        familias_referenciadas: 120
      },
      equipe_tecnica: [
        { nome: 'Paula Mendes', cargo: 'Assistente Social', especialidade: 'Violência', situacao: 'ativo' },
        { nome: 'Roberto Lima', cargo: 'Psicólogo', especialidade: 'Trauma', situacao: 'ativo' },
        { nome: 'Sandra Costa', cargo: 'Advogado', especialidade: 'Direitos', situacao: 'ativo' },
        { nome: 'Alberto Santos', cargo: 'Coordenador', especialidade: 'Casos Complexos', situacao: 'ativo' }
      ],
      servicos_ofertados: [
        {
          nome: 'PAEFI - Proteção e Atendimento Especializado a Famílias e Indivíduos',
          descricao: 'Atendimento especializado a famílias e indivíduos em situação de risco',
          publico_alvo: 'Famílias e indivíduos com direitos violados',
          dias_funcionamento: ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'],
          horario: '08:00 às 17:00',
          vagas_disponiveis: 30,
          lista_espera: 12
        },
        {
          nome: 'Atendimento a Violência Doméstica',
          descricao: 'Acompanhamento especializado em casos de violência doméstica',
          publico_alvo: 'Mulheres, crianças e idosos vítimas de violência',
          dias_funcionamento: ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'],
          horario: '08:00 às 17:00',
          vagas_disponiveis: 25,
          lista_espera: 8
        },
        {
          nome: 'Serviço de Abordagem Social',
          descricao: 'Abordagem a pessoas em situação de rua',
          publico_alvo: 'População em situação de rua',
          dias_funcionamento: ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
          horario: '24 horas',
          vagas_disponiveis: 15,
          lista_espera: 3
        }
      ],
      infraestrutura: {
        salas_atendimento: 6,
        sala_grupo: true,
        brinquedoteca: false,
        copa: true,
        acessibilidade: true,
        capacidade_maxima: 80
      },
      funcionamento: {
        horario_funcionamento: '08:00 às 17:00',
        dias_semana: ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'],
        data_inauguracao: '2019-08-20',
        situacao: 'ativo'
      },
      indicadores: {
        familias_acompanhadas: 115,
        novos_acompanhamentos_mes: 18,
        grupos_convivencia_ativos: 3,
        oficinas_realizadas_mes: 8,
        atendimentos_mes: 190,
        taxa_ocupacao: 95
      },
      historico_atividades: [
        {
          data: '2024-01-20',
          tipo: 'Atendimento',
          descricao: 'Atendimento emergencial - violência doméstica',
          participantes: 1,
          responsavel: 'Paula Mendes'
        },
        {
          data: '2024-01-22',
          tipo: 'Grupo',
          descricao: 'Grupo de apoio a mulheres vítimas de violência',
          participantes: 12,
          responsavel: 'Roberto Lima'
        }
      ],
      observacoes: 'Unidade com alta demanda para casos de violência. Necessário ampliar equipe técnica.'
    }
  ])

  const [filtros, setFiltros] = useState({
    tipo: '',
    situacao: '',
    territorio: ''
  })

  const [busca, setBusca] = useState('')
  const [unidade, setUnidade] = useState<UnidadeSUAS | null>(null)
  const [modoEdicao, setModoEdicao] = useState(false)

  const getSituacaoColor = (situacao: string) => {
    const colors = {
      ativo: 'bg-green-100 text-green-800',
      reforma: 'bg-yellow-100 text-yellow-800',
      inativo: 'bg-red-100 text-red-800'
    }
    return colors[situacao as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  const getTipoColor = (tipo: string) => {
    const colors = {
      CRAS: 'bg-blue-100 text-blue-800',
      CREAS: 'bg-purple-100 text-purple-800'
    }
    return colors[tipo as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  const unidadesFiltradas = unidades.filter(u => {
    const matchBusca = u.nome.toLowerCase().includes(busca.toLowerCase()) ||
                      u.codigo_unidade.toLowerCase().includes(busca.toLowerCase()) ||
                      u.endereco.bairro.toLowerCase().includes(busca.toLowerCase())

    const matchTipo = !filtros.tipo || u.tipo === filtros.tipo
    const matchSituacao = !filtros.situacao || u.funcionamento.situacao === filtros.situacao
    const matchTerritorio = !filtros.territorio || u.area_abrangencia.territorio.includes(filtros.territorio)

    return matchBusca && matchTipo && matchSituacao && matchTerritorio
  })

  const stats = {
    total_unidades: unidades.length,
    cras: unidades.filter(u => u.tipo === 'CRAS').length,
    creas: unidades.filter(u => u.tipo === 'CREAS').length,
    familias_acompanhadas: unidades.reduce((acc, u) => acc + u.indicadores.familias_acompanhadas, 0),
    atendimentos_mes: unidades.reduce((acc, u) => acc + u.indicadores.atendimentos_mes, 0)
  }

  const salvarUnidade = () => {
    if (unidade) {
      if (unidade.id) {
        setUnidades(unidades.map(u => u.id === unidade.id ? unidade : u))
      } else {
        const novaUnidade = {
          ...unidade,
          id: Date.now().toString(),
          codigo_unidade: `${unidade.tipo}${String(unidades.filter(u => u.tipo === unidade.tipo).length + 1).padStart(3, '0')}`
        }
        setUnidades([...unidades, novaUnidade])
      }
      setUnidade(null)
      setModoEdicao(false)
    }
  }

  const gerarServicosAutomaticos = () => {
    return [
      {
        nome: "Atendimento no CRAS",
        descricao: "Solicite atendimento social no Centro de Referência de Assistência Social",
        categoria: "Assistência Social",
        prazo: "3 dias úteis",
        documentos: ["RG", "CPF", "Comprovante de residência", "Comprovante de renda"],
        digital: true,
        gratuito: true
      },
      {
        nome: "Acompanhamento CREAS",
        descricao: "Atendimento especializado para situações de violação de direitos",
        categoria: "Proteção Especial",
        prazo: "1 dia útil",
        documentos: ["Documentos pessoais", "Boletim de ocorrência (se houver)"],
        digital: true,
        gratuito: true
      },
      {
        nome: "Grupo de Convivência",
        descricao: "Participe de grupos de convivência e fortalecimento de vínculos",
        categoria: "Convivência",
        prazo: "5 dias úteis",
        documentos: ["RG", "CPF", "Comprovante de residência"],
        digital: true,
        gratuito: true
      },
      {
        nome: "Oficinas Sociais",
        descricao: "Inscreva-se em oficinas de capacitação e geração de renda",
        categoria: "Capacitação",
        prazo: "7 dias úteis",
        documentos: ["Documentos pessoais", "Declaração de interesse"],
        digital: true,
        gratuito: true
      }
    ]
  }

  if (!['admin', 'secretario', 'coordenador', 'tecnico'].some(permission => hasPermission(permission))) {
    return <div className="p-6">Acesso negado. Você não tem permissão para acessar esta página.</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">CRAS e CREAS</h1>
          <p className="text-muted-foreground mt-2">
            Gestão das unidades SUAS, equipes técnicas, serviços e área de abrangência
          </p>
        </div>
        <Button onClick={() => {
          setUnidade({
            id: '',
            codigo_unidade: '',
            nome: '',
            tipo: 'CRAS',
            endereco: {
              logradouro: '',
              numero: '',
              bairro: '',
              cep: '',
              telefone: '',
              email: ''
            },
            area_abrangencia: {
              bairros_atendidos: [],
              territorio: '',
              populacao_estimada: 0,
              familias_referenciadas: 0
            },
            equipe_tecnica: [],
            servicos_ofertados: [],
            infraestrutura: {
              salas_atendimento: 0,
              sala_grupo: false,
              brinquedoteca: false,
              copa: false,
              acessibilidade: false,
              capacidade_maxima: 0
            },
            funcionamento: {
              horario_funcionamento: '',
              dias_semana: [],
              data_inauguracao: '',
              situacao: 'ativo'
            },
            indicadores: {
              familias_acompanhadas: 0,
              novos_acompanhamentos_mes: 0,
              grupos_convivencia_ativos: 0,
              oficinas_realizadas_mes: 0,
              atendimentos_mes: 0,
              taxa_ocupacao: 0
            },
            historico_atividades: [],
            observacoes: ''
          })
          setModoEdicao(true)
        }}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Unidade
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Unidades</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total_unidades}</div>
            <p className="text-xs text-muted-foreground">SUAS ativas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">CRAS</CardTitle>
            <Shield className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.cras}</div>
            <p className="text-xs text-muted-foreground">Proteção básica</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">CREAS</CardTitle>
            <AlertTriangle className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{stats.creas}</div>
            <p className="text-xs text-muted-foreground">Proteção especial</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Famílias</CardTitle>
            <Users className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.familias_acompanhadas}</div>
            <p className="text-xs text-muted-foreground">Acompanhadas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Atendimentos</CardTitle>
            <Activity className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.atendimentos_mes}</div>
            <p className="text-xs text-muted-foreground">Este mês</p>
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
                placeholder="Buscar por nome, código ou bairro..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="w-full"
              />
            </div>
            <Button variant="outline">
              <Search className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <Select value={filtros.tipo} onValueChange={(value) => setFiltros({...filtros, tipo: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos</SelectItem>
                <SelectItem value="CRAS">CRAS</SelectItem>
                <SelectItem value="CREAS">CREAS</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filtros.situacao} onValueChange={(value) => setFiltros({...filtros, situacao: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Situação" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todas</SelectItem>
                <SelectItem value="ativo">Ativo</SelectItem>
                <SelectItem value="reforma">Em Reforma</SelectItem>
                <SelectItem value="inativo">Inativo</SelectItem>
              </SelectContent>
            </Select>

            <Input
              placeholder="Território"
              value={filtros.territorio}
              onChange={(e) => setFiltros({...filtros, territorio: e.target.value})}
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Unidades SUAS ({unidadesFiltradas.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {unidadesFiltradas.map((unit) => (
                  <div key={unit.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-semibold">{unit.nome}</h4>
                        <p className="text-sm text-muted-foreground">{unit.codigo_unidade}</p>
                      </div>
                      <div className="flex gap-2">
                        <Badge className={getTipoColor(unit.tipo)}>
                          {unit.tipo}
                        </Badge>
                        <Badge className={getSituacaoColor(unit.funcionamento.situacao)}>
                          {unit.funcionamento.situacao}
                        </Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm mb-2">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {unit.endereco.bairro}
                      </div>
                      <div className="flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {unit.endereco.telefone}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {unit.indicadores.familias_acompanhadas} famílias
                      </div>
                      <div className="flex items-center gap-1">
                        <Activity className="h-3 w-3" />
                        {unit.indicadores.atendimentos_mes} atendimentos/mês
                      </div>
                    </div>

                    <div className="mb-2">
                      <p className="text-xs text-muted-foreground">Equipe Técnica:</p>
                      <p className="text-sm">{unit.equipe_tecnica.length} profissionais</p>
                    </div>

                    <div className="mb-2">
                      <p className="text-xs text-muted-foreground">Território:</p>
                      <p className="text-sm">{unit.area_abrangencia.territorio} - {unit.area_abrangencia.bairros_atendidos.slice(0, 2).join(', ')}
                        {unit.area_abrangencia.bairros_atendidos.length > 2 && ` +${unit.area_abrangencia.bairros_atendidos.length - 2}`}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs text-muted-foreground">
                        Taxa de ocupação: {unit.indicadores.taxa_ocupacao}%
                      </span>
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${unit.indicadores.taxa_ocupacao}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex gap-2 mt-3">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setUnidade(unit)}
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        Ver
                      </Button>
                      {['admin', 'secretario', 'coordenador'].some(permission => hasPermission(permission)) && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setUnidade(unit)
                            setModoEdicao(true)
                          }}
                        >
                          Editar
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Archive className="h-5 w-5" />
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
                  <Archive className="h-3 w-3 mr-1" />
                  Auto-Sync
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Unidades SUAS geram automaticamente serviços no catálogo público
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {unidade && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              {modoEdicao ? 'Editar Unidade' : 'Detalhes da Unidade'}
              {unidade.nome && ` - ${unidade.nome}`}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {modoEdicao ? (
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm font-medium">Nome da Unidade</label>
                  <Input
                    value={unidade.nome}
                    onChange={(e) => setUnidade({...unidade, nome: e.target.value})}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Tipo</label>
                  <Select value={unidade.tipo} onValueChange={(value) => setUnidade({...unidade, tipo: value as any})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CRAS">CRAS</SelectItem>
                      <SelectItem value="CREAS">CREAS</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium">Endereço</label>
                  <Input
                    value={unidade.endereco.logradouro}
                    onChange={(e) => setUnidade({...unidade, endereco: {...unidade.endereco, logradouro: e.target.value}})}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Bairro</label>
                  <Input
                    value={unidade.endereco.bairro}
                    onChange={(e) => setUnidade({...unidade, endereco: {...unidade.endereco, bairro: e.target.value}})}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Telefone</label>
                  <Input
                    value={unidade.endereco.telefone}
                    onChange={(e) => setUnidade({...unidade, endereco: {...unidade.endereco, telefone: e.target.value}})}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Situação</label>
                  <Select value={unidade.funcionamento.situacao} onValueChange={(value) => setUnidade({...unidade, funcionamento: {...unidade.funcionamento, situacao: value as any}})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ativo">Ativo</SelectItem>
                      <SelectItem value="reforma">Em Reforma</SelectItem>
                      <SelectItem value="inativo">Inativo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="md:col-span-2 flex gap-2">
                  <Button onClick={salvarUnidade}>Salvar</Button>
                  <Button variant="outline" onClick={() => {
                    setUnidade(null)
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
                    <h4 className="font-semibold mb-2">Informações Básicas</h4>
                    <div className="space-y-2 text-sm">
                      <p><strong>Nome:</strong> {unidade.nome}</p>
                      <p><strong>Tipo:</strong> <Badge className={getTipoColor(unidade.tipo)}>{unidade.tipo}</Badge></p>
                      <p><strong>Endereço:</strong> {unidade.endereco.logradouro}, {unidade.endereco.numero}</p>
                      <p><strong>Bairro:</strong> {unidade.endereco.bairro}</p>
                      <p><strong>Telefone:</strong> {unidade.endereco.telefone}</p>
                      <p><strong>Email:</strong> {unidade.endereco.email}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Área de Abrangência</h4>
                    <div className="space-y-2 text-sm">
                      <p><strong>Território:</strong> {unidade.area_abrangencia.territorio}</p>
                      <p><strong>População Estimada:</strong> {unidade.area_abrangencia.populacao_estimada.toLocaleString()}</p>
                      <p><strong>Famílias Referenciadas:</strong> {unidade.area_abrangencia.familias_referenciadas}</p>
                      <div>
                        <p><strong>Bairros Atendidos:</strong></p>
                        <div className="flex gap-1 mt-1 flex-wrap">
                          {unidade.area_abrangencia.bairros_atendidos.map((bairro, index) => (
                            <Badge key={index} variant="outline" className="text-xs">{bairro}</Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Equipe Técnica</h4>
                  <div className="grid gap-2 md:grid-cols-2">
                    {unidade.equipe_tecnica.map((membro, index) => (
                      <div key={index} className="border rounded p-2">
                        <p className="font-medium text-sm">{membro.nome}</p>
                        <p className="text-xs text-muted-foreground">{membro.cargo} - {membro.especialidade}</p>
                        <Badge variant="outline" className="text-xs">{membro.situacao}</Badge>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Indicadores</h4>
                  <div className="grid gap-2 md:grid-cols-3 text-sm">
                    <p><strong>Famílias Acompanhadas:</strong> {unidade.indicadores.familias_acompanhadas}</p>
                    <p><strong>Novos Acompanhamentos:</strong> {unidade.indicadores.novos_acompanhamentos_mes}/mês</p>
                    <p><strong>Grupos Ativos:</strong> {unidade.indicadores.grupos_convivencia_ativos}</p>
                    <p><strong>Oficinas Realizadas:</strong> {unidade.indicadores.oficinas_realizadas_mes}/mês</p>
                    <p><strong>Atendimentos:</strong> {unidade.indicadores.atendimentos_mes}/mês</p>
                    <p><strong>Taxa de Ocupação:</strong> {unidade.indicadores.taxa_ocupacao}%</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Serviços Ofertados</h4>
                  <div className="space-y-2">
                    {unidade.servicos_ofertados.map((servico, index) => (
                      <div key={index} className="border rounded p-3">
                        <p className="font-medium text-sm">{servico.nome}</p>
                        <p className="text-xs text-muted-foreground">{servico.descricao}</p>
                        <div className="flex gap-4 mt-1 text-xs">
                          <span>Vagas: {servico.vagas_disponiveis}</span>
                          <span>Lista de espera: {servico.lista_espera}</span>
                          <span>Horário: {servico.horario}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  {['admin', 'secretario', 'coordenador'].some(permission => hasPermission(permission)) && (
                    <Button onClick={() => setModoEdicao(true)}>
                      Editar
                    </Button>
                  )}
                  <Button variant="outline" onClick={() => setUnidade(null)}>
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