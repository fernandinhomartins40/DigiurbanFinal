'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import {
  Heart,
  Users,
  DollarSign,
  Calendar,
  Clock,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Eye,
  Download,
  Filter,
  Search,
  Plus,
  Target,
  TrendingUp,
  UserPlus,
  Archive
} from 'lucide-react'
import { useAdminAuth, useAdminPermissions } from '@/contexts/AdminAuthContext'

interface CriterioElegibilidade {
  tipo: string
  descricao: string
  valor_referencia?: number
  documentos_necessarios: string[]
}

interface Beneficiario {
  id: string
  nome: string
  cpf: string
  telefone: string
  endereco: string
  data_ingresso: string
  status: 'ativo' | 'suspenso' | 'desligado'
}

interface ProgramaSocial {
  id: string
  codigo_programa: string
  nome: string
  descricao: string
  tipo_programa: 'municipal' | 'estadual' | 'federal' | 'parceria'
  area_atuacao: string
  publico_alvo: string
  objetivos: string[]
  criterios_elegibilidade: CriterioElegibilidade[]
  beneficios_oferecidos: {
    tipo: 'financeiro' | 'material' | 'servico' | 'capacitacao'
    descricao: string
    valor_mensal?: number
    periodicidade: string
  }[]
  gestao: {
    coordenador: string
    equipe_responsavel: string[]
    unidade_executora: string
    orcamento_anual: number
    fonte_recurso: string
  }
  metas: {
    familias_beneficiadas: number
    pessoas_atendidas: number
    prazo_execucao: string
    indicadores_resultado: string[]
  }
  situacao: {
    status: 'ativo' | 'suspenso' | 'finalizado' | 'planejamento'
    data_inicio: string
    data_fim?: string
    motivo_suspensao?: string
  }
  beneficiarios: Beneficiario[]
  historico_renovacoes: Array<{
    data: string
    tipo: string
    responsavel: string
    observacoes: string
  }>
  resultados: {
    familias_atendidas: number
    pessoas_impactadas: number
    taxa_permanencia: number
    satisfacao_beneficiarios: number
    recursos_executados: number
  }
  observacoes: string
}

export default function ProgramasSociais() {
  const { user } = useAdminAuth()
  const { hasPermission } = useAdminPermissions()
  const [programas, setProgramas] = useState<ProgramaSocial[]>([
    {
      id: '1',
      codigo_programa: 'PS2024001',
      nome: 'Programa Renda Solidária',
      descricao: 'Programa municipal de transferência de renda para famílias em extrema pobreza',
      tipo_programa: 'municipal',
      area_atuacao: 'Transferência de Renda',
      publico_alvo: 'Famílias em extrema pobreza com renda per capita até R$ 105,00',
      objetivos: [
        'Garantir segurança alimentar às famílias',
        'Promover acesso à educação e saúde',
        'Fortalecer vínculos familiares e comunitários',
        'Contribuir para superação da extrema pobreza'
      ],
      criterios_elegibilidade: [
        {
          tipo: 'Renda',
          descricao: 'Renda familiar per capita até R$ 105,00',
          valor_referencia: 105,
          documentos_necessarios: ['Comprovante de renda', 'Cadastro Único atualizado']
        },
        {
          tipo: 'Residência',
          descricao: 'Residir no município há pelo menos 2 anos',
          documentos_necessarios: ['Comprovante de residência', 'Declaração de tempo de residência']
        },
        {
          tipo: 'Família',
          descricao: 'Ter filhos menores de 18 anos ou gestante',
          documentos_necessarios: ['Certidão de nascimento dos filhos', 'Cartão pré-natal (se gestante)']
        }
      ],
      beneficios_oferecidos: [
        {
          tipo: 'financeiro',
          descricao: 'Auxílio financeiro mensal',
          valor_mensal: 150,
          periodicidade: 'Mensal'
        },
        {
          tipo: 'servico',
          descricao: 'Acompanhamento social familiar',
          periodicidade: 'Trimestral'
        }
      ],
      gestao: {
        coordenador: 'Ana Costa',
        equipe_responsavel: ['Maria Santos', 'Carlos Silva', 'Paula Oliveira'],
        unidade_executora: 'CRAS Centro',
        orcamento_anual: 450000,
        fonte_recurso: 'Recursos próprios municipais'
      },
      metas: {
        familias_beneficiadas: 200,
        pessoas_atendidas: 800,
        prazo_execucao: '2024-12-31',
        indicadores_resultado: [
          'Redução da insegurança alimentar em 80%',
          'Aumento da frequência escolar em 95%',
          'Melhoria nos indicadores de saúde infantil'
        ]
      },
      situacao: {
        status: 'ativo',
        data_inicio: '2024-01-01'
      },
      beneficiarios: [
        {
          id: '1',
          nome: 'Maria Silva Santos',
          cpf: '123.456.789-00',
          telefone: '(61) 99999-1111',
          endereco: 'Rua das Flores, 123 - Centro',
          data_ingresso: '2024-01-15',
          status: 'ativo'
        },
        {
          id: '2',
          nome: 'João Oliveira Costa',
          cpf: '987.654.321-00',
          telefone: '(61) 88888-2222',
          endereco: 'Av. Principal, 456 - Vila Nova',
          data_ingresso: '2024-01-20',
          status: 'ativo'
        }
      ],
      historico_renovacoes: [
        {
          data: '2024-01-01',
          tipo: 'Início do programa',
          responsavel: 'Ana Costa',
          observacoes: 'Programa iniciado com meta de 200 famílias'
        }
      ],
      resultados: {
        familias_atendidas: 185,
        pessoas_impactadas: 740,
        taxa_permanencia: 92.5,
        satisfacao_beneficiarios: 4.3,
        recursos_executados: 127500
      },
      observacoes: 'Programa em andamento com boa adesão das famílias. Meta de beneficiários quase alcançada.'
    },
    {
      id: '2',
      codigo_programa: 'PS2024002',
      nome: 'Programa Geração de Renda',
      descricao: 'Capacitação profissional e apoio ao empreendedorismo para famílias vulneráveis',
      tipo_programa: 'parceria',
      area_atuacao: 'Capacitação e Trabalho',
      publico_alvo: 'Adultos de famílias cadastradas no CadÚnico com interesse em capacitação',
      objetivos: [
        'Desenvolver habilidades profissionais',
        'Promover inserção no mercado de trabalho',
        'Apoiar iniciativas de economia solidária',
        'Reduzir dependência de programas assistenciais'
      ],
      criterios_elegibilidade: [
        {
          tipo: 'Cadastro',
          descricao: 'Estar inscrito no Cadastro Único',
          documentos_necessarios: ['Cadastro Único atualizado']
        },
        {
          tipo: 'Idade',
          descricao: 'Ter entre 18 e 59 anos',
          documentos_necessarios: ['RG ou CNH']
        },
        {
          tipo: 'Disponibilidade',
          descricao: 'Disponibilidade para participar das atividades',
          documentos_necessarios: ['Termo de compromisso']
        }
      ],
      beneficios_oferecidos: [
        {
          tipo: 'capacitacao',
          descricao: 'Cursos de capacitação profissional',
          periodicidade: 'Conforme cronograma'
        },
        {
          tipo: 'material',
          descricao: 'Kit de ferramentas/materiais para início da atividade',
          periodicidade: 'Único'
        },
        {
          tipo: 'servico',
          descricao: 'Acompanhamento técnico por 6 meses',
          periodicidade: 'Mensal'
        }
      ],
      gestao: {
        coordenador: 'Carlos Mendes',
        equipe_responsavel: ['Roberto Lima', 'Sandra Costa'],
        unidade_executora: 'CRAS Centro',
        orcamento_anual: 280000,
        fonte_recurso: 'Parceria com SENAC/SEBRAE'
      },
      metas: {
        familias_beneficiadas: 100,
        pessoas_atendidas: 120,
        prazo_execucao: '2024-12-31',
        indicadores_resultado: [
          'Taxa de conclusão dos cursos de 85%',
          'Inserção no mercado de trabalho de 60%',
          'Criação de 30 empreendimentos'
        ]
      },
      situacao: {
        status: 'ativo',
        data_inicio: '2024-02-01'
      },
      beneficiarios: [
        {
          id: '3',
          nome: 'Pedro Santos Lima',
          cpf: '456.789.123-00',
          telefone: '(61) 77777-3333',
          endereco: 'Rua Nova, 789 - Jardins',
          data_ingresso: '2024-02-10',
          status: 'ativo'
        }
      ],
      historico_renovacoes: [
        {
          data: '2024-02-01',
          tipo: 'Início do programa',
          responsavel: 'Carlos Mendes',
          observacoes: 'Parceria firmada com instituições de ensino técnico'
        }
      ],
      resultados: {
        familias_atendidas: 75,
        pessoas_impactadas: 85,
        taxa_permanencia: 88.0,
        satisfacao_beneficiarios: 4.5,
        recursos_executados: 156000
      },
      observacoes: 'Programa com alta demanda. Necessário ampliar número de vagas para próximo período.'
    }
  ])

  const [filtros, setFiltros] = useState({
    tipo: '',
    status: '',
    area: '',
    coordenador: ''
  })

  const [busca, setBusca] = useState('')
  const [programa, setPrograma] = useState<ProgramaSocial | null>(null)
  const [modoEdicao, setModoEdicao] = useState(false)

  const tipos_programa = ['municipal', 'estadual', 'federal', 'parceria']
  const areas_atuacao = [
    'Transferência de Renda',
    'Capacitação e Trabalho',
    'Habitação',
    'Alimentação',
    'Saúde',
    'Educação',
    'Idoso',
    'Criança e Adolescente',
    'Mulher',
    'Deficiente'
  ]

  const coordenadores = ['Ana Costa', 'Carlos Mendes', 'Maria Santos', 'João Silva', 'Paula Oliveira']

  const getStatusColor = (status: string) => {
    const colors = {
      ativo: 'bg-green-100 text-green-800',
      suspenso: 'bg-yellow-100 text-yellow-800',
      finalizado: 'bg-blue-100 text-blue-800',
      planejamento: 'bg-purple-100 text-purple-800'
    }
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  const getTipoColor = (tipo: string) => {
    const colors = {
      municipal: 'bg-blue-100 text-blue-800',
      estadual: 'bg-green-100 text-green-800',
      federal: 'bg-yellow-100 text-yellow-800',
      parceria: 'bg-purple-100 text-purple-800'
    }
    return colors[tipo as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  const programasFiltrados = programas.filter(p => {
    const matchBusca = p.nome.toLowerCase().includes(busca.toLowerCase()) ||
                      p.codigo_programa.toLowerCase().includes(busca.toLowerCase()) ||
                      p.area_atuacao.toLowerCase().includes(busca.toLowerCase())

    const matchTipo = !filtros.tipo || p.tipo_programa === filtros.tipo
    const matchStatus = !filtros.status || p.situacao.status === filtros.status
    const matchArea = !filtros.area || p.area_atuacao === filtros.area
    const matchCoordenador = !filtros.coordenador || p.gestao.coordenador.includes(filtros.coordenador)

    return matchBusca && matchTipo && matchStatus && matchArea && matchCoordenador
  })

  const stats = {
    total: programas.length,
    ativos: programas.filter(p => p.situacao.status === 'ativo').length,
    beneficiarios: programas.reduce((acc, p) => acc + p.beneficiarios.length, 0),
    pessoas_impactadas: programas.reduce((acc, p) => acc + p.resultados.pessoas_impactadas, 0),
    orcamento_total: programas.reduce((acc, p) => acc + p.gestao.orcamento_anual, 0)
  }

  const salvarPrograma = () => {
    if (programa) {
      if (programa.id) {
        setProgramas(programas.map(p => p.id === programa.id ? programa : p))
      } else {
        const novoPrograma = {
          ...programa,
          id: Date.now().toString(),
          codigo_programa: `PS${new Date().getFullYear()}${String(programas.length + 1).padStart(3, '0')}`,
          beneficiarios: [],
          historico_renovacoes: [{
            data: new Date().toISOString().split('T')[0],
            tipo: 'Criação do programa',
            responsavel: user?.name || 'Sistema',
            observacoes: 'Programa criado'
          }],
          resultados: {
            familias_atendidas: 0,
            pessoas_impactadas: 0,
            taxa_permanencia: 0,
            satisfacao_beneficiarios: 0,
            recursos_executados: 0
          }
        }
        setProgramas([...programas, novoPrograma])
      }
      setPrograma(null)
      setModoEdicao(false)
    }
  }

  const gerarServicosAutomaticos = () => {
    return [
      {
        nome: "Inscrição em Programa Social",
        descricao: "Inscreva-se nos programas sociais municipais disponíveis",
        categoria: "Programas Sociais",
        prazo: "10 dias úteis",
        documentos: ["RG", "CPF", "Comprovante de renda", "Cadastro Único", "Comprovante de residência"],
        digital: true,
        gratuito: true
      },
      {
        nome: "Renovação de Benefício Social",
        descricao: "Renove sua participação em programas sociais",
        categoria: "Renovação",
        prazo: "5 dias úteis",
        documentos: ["Documentos atualizados", "Comprovante de renda atual"],
        digital: true,
        gratuito: true
      },
      {
        nome: "Auxílio Emergencial Municipal",
        descricao: "Solicite auxílio emergencial para situações críticas",
        categoria: "Auxílio Emergencial",
        prazo: "3 dias úteis",
        documentos: ["Documentos da família", "Declaração de situação emergencial"],
        digital: true,
        gratuito: true
      },
      {
        nome: "Programa de Transferência de Renda",
        descricao: "Cadastre-se no programa municipal de transferência de renda",
        categoria: "Transferência de Renda",
        prazo: "7 dias úteis",
        documentos: ["Cadastro Único", "Comprovante de renda", "Documentos dos dependentes"],
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
          <h1 className="text-3xl font-bold">Programas Sociais</h1>
          <p className="text-muted-foreground mt-2">
            Administração de programas municipais, integração com equipamentos SUAS e critérios de elegibilidade
          </p>
        </div>
        <Button onClick={() => {
          setPrograma({
            id: '',
            codigo_programa: '',
            nome: '',
            descricao: '',
            tipo_programa: 'municipal',
            area_atuacao: '',
            publico_alvo: '',
            objetivos: [],
            criterios_elegibilidade: [],
            beneficios_oferecidos: [],
            gestao: {
              coordenador: '',
              equipe_responsavel: [],
              unidade_executora: '',
              orcamento_anual: 0,
              fonte_recurso: ''
            },
            metas: {
              familias_beneficiadas: 0,
              pessoas_atendidas: 0,
              prazo_execucao: '',
              indicadores_resultado: []
            },
            situacao: {
              status: 'planejamento',
              data_inicio: ''
            },
            beneficiarios: [],
            historico_renovacoes: [],
            resultados: {
              familias_atendidas: 0,
              pessoas_impactadas: 0,
              taxa_permanencia: 0,
              satisfacao_beneficiarios: 0,
              recursos_executados: 0
            },
            observacoes: ''
          })
          setModoEdicao(true)
        }}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Programa
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Programas</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">Cadastrados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Programas Ativos</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.ativos}</div>
            <p className="text-xs text-muted-foreground">Em execução</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Beneficiários</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.beneficiarios}</div>
            <p className="text-xs text-muted-foreground">Ativos nos programas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pessoas Impactadas</CardTitle>
            <TrendingUp className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.pessoas_impactadas}</div>
            <p className="text-xs text-muted-foreground">Familiares beneficiados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Orçamento Total</CardTitle>
            <DollarSign className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              R$ {(stats.orcamento_total / 1000).toFixed(0)}k
            </div>
            <p className="text-xs text-muted-foreground">Anual</p>
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
                placeholder="Buscar por nome, código ou área de atuação..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="w-full"
              />
            </div>
            <Button variant="outline">
              <Search className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Select value={filtros.tipo} onValueChange={(value) => setFiltros({...filtros, tipo: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos</SelectItem>
                {tipos_programa.map(tipo => (
                  <SelectItem key={tipo} value={tipo}>
                    {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filtros.status} onValueChange={(value) => setFiltros({...filtros, status: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos</SelectItem>
                <SelectItem value="ativo">Ativo</SelectItem>
                <SelectItem value="suspenso">Suspenso</SelectItem>
                <SelectItem value="finalizado">Finalizado</SelectItem>
                <SelectItem value="planejamento">Planejamento</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filtros.area} onValueChange={(value) => setFiltros({...filtros, area: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Área" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todas</SelectItem>
                {areas_atuacao.map(area => (
                  <SelectItem key={area} value={area}>{area}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Input
              placeholder="Coordenador"
              value={filtros.coordenador}
              onChange={(e) => setFiltros({...filtros, coordenador: e.target.value})}
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5" />
                Programas Sociais ({programasFiltrados.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {programasFiltrados.map((prog) => (
                  <div key={prog.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-semibold">{prog.nome}</h4>
                        <p className="text-sm text-muted-foreground">{prog.codigo_programa} - {prog.area_atuacao}</p>
                      </div>
                      <div className="flex gap-2">
                        <Badge className={getTipoColor(prog.tipo_programa)}>
                          {prog.tipo_programa}
                        </Badge>
                        <Badge className={getStatusColor(prog.situacao.status)}>
                          {prog.situacao.status}
                        </Badge>
                      </div>
                    </div>

                    <p className="text-sm mb-2 line-clamp-2">{prog.descricao}</p>

                    <div className="grid grid-cols-2 gap-4 text-sm mb-2">
                      <div className="flex items-center gap-1">
                        <Target className="h-3 w-3" />
                        Meta: {prog.metas.familias_beneficiadas} famílias
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {prog.beneficiarios.length} beneficiários
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-3 w-3" />
                        R$ {prog.gestao.orcamento_anual.toLocaleString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {prog.situacao.data_inicio}
                      </div>
                    </div>

                    <div className="mb-2">
                      <p className="text-xs text-muted-foreground">Coordenador: {prog.gestao.coordenador}</p>
                      <p className="text-xs text-muted-foreground">Unidade: {prog.gestao.unidade_executora}</p>
                    </div>

                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs text-muted-foreground">
                        Execução: {((prog.resultados.familias_atendidas / prog.metas.familias_beneficiadas) * 100).toFixed(1)}%
                      </span>
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-600 h-2 rounded-full"
                          style={{
                            width: `${Math.min((prog.resultados.familias_atendidas / prog.metas.familias_beneficiadas) * 100, 100)}%`
                          }}
                        />
                      </div>
                    </div>

                    <div className="flex gap-2 mt-3">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setPrograma(prog)}
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        Ver
                      </Button>
                      {['admin', 'secretario', 'coordenador'].some(permission => hasPermission(permission)) && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setPrograma(prog)
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
                Programas sociais geram automaticamente serviços no catálogo público
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {programa && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              {modoEdicao ? 'Editar Programa' : 'Detalhes do Programa'}
              {programa.nome && ` - ${programa.nome}`}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {modoEdicao ? (
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm font-medium">Nome do Programa</label>
                  <Input
                    value={programa.nome}
                    onChange={(e) => setPrograma({...programa, nome: e.target.value})}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Tipo do Programa</label>
                  <Select value={programa.tipo_programa} onValueChange={(value) => setPrograma({...programa, tipo_programa: value as any})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {tipos_programa.map(tipo => (
                        <SelectItem key={tipo} value={tipo}>
                          {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium">Área de Atuação</label>
                  <Select value={programa.area_atuacao} onValueChange={(value) => setPrograma({...programa, area_atuacao: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {areas_atuacao.map(area => (
                        <SelectItem key={area} value={area}>{area}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium">Coordenador</label>
                  <Select value={programa.gestao.coordenador} onValueChange={(value) => setPrograma({...programa, gestao: {...programa.gestao, coordenador: value}})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {coordenadores.map(coord => (
                        <SelectItem key={coord} value={coord}>{coord}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="md:col-span-2">
                  <label className="text-sm font-medium">Descrição</label>
                  <Input
                    value={programa.descricao}
                    onChange={(e) => setPrograma({...programa, descricao: e.target.value})}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Status</label>
                  <Select value={programa.situacao.status} onValueChange={(value) => setPrograma({...programa, situacao: {...programa.situacao, status: value as any}})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ativo">Ativo</SelectItem>
                      <SelectItem value="suspenso">Suspenso</SelectItem>
                      <SelectItem value="finalizado">Finalizado</SelectItem>
                      <SelectItem value="planejamento">Planejamento</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="md:col-span-2 flex gap-2">
                  <Button onClick={salvarPrograma}>Salvar</Button>
                  <Button variant="outline" onClick={() => {
                    setPrograma(null)
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
                      <p><strong>Nome:</strong> {programa.nome}</p>
                      <p><strong>Tipo:</strong> <Badge className={getTipoColor(programa.tipo_programa)}>{programa.tipo_programa}</Badge></p>
                      <p><strong>Área:</strong> {programa.area_atuacao}</p>
                      <p><strong>Status:</strong> <Badge className={getStatusColor(programa.situacao.status)}>{programa.situacao.status}</Badge></p>
                      <p><strong>Público-alvo:</strong> {programa.publico_alvo}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Gestão</h4>
                    <div className="space-y-2 text-sm">
                      <p><strong>Coordenador:</strong> {programa.gestao.coordenador}</p>
                      <p><strong>Unidade Executora:</strong> {programa.gestao.unidade_executora}</p>
                      <p><strong>Orçamento Anual:</strong> R$ {programa.gestao.orcamento_anual.toLocaleString()}</p>
                      <p><strong>Fonte do Recurso:</strong> {programa.gestao.fonte_recurso}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Descrição</h4>
                  <p className="text-sm">{programa.descricao}</p>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Objetivos</h4>
                  <ul className="text-sm space-y-1">
                    {programa.objetivos.map((obj, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Target className="h-3 w-3 mt-1 text-green-500" />
                        {obj}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Metas e Resultados</h4>
                  <div className="grid gap-2 md:grid-cols-2 text-sm">
                    <p><strong>Meta Famílias:</strong> {programa.metas.familias_beneficiadas}</p>
                    <p><strong>Famílias Atendidas:</strong> {programa.resultados.familias_atendidas}</p>
                    <p><strong>Meta Pessoas:</strong> {programa.metas.pessoas_atendidas}</p>
                    <p><strong>Pessoas Impactadas:</strong> {programa.resultados.pessoas_impactadas}</p>
                    <p><strong>Taxa Permanência:</strong> {programa.resultados.taxa_permanencia}%</p>
                    <p><strong>Satisfação:</strong> {programa.resultados.satisfacao_beneficiarios}/5</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Beneficiários Ativos</h4>
                  <p className="text-sm mb-2">{programa.beneficiarios.length} beneficiários cadastrados</p>
                  {programa.beneficiarios.slice(0, 3).map((benef, index) => (
                    <div key={index} className="text-sm border rounded p-2 mb-1">
                      <p><strong>{benef.nome}</strong> - {benef.telefone}</p>
                      <p className="text-muted-foreground">Ingresso: {benef.data_ingresso}</p>
                    </div>
                  ))}
                  {programa.beneficiarios.length > 3 && (
                    <p className="text-xs text-muted-foreground">
                      +{programa.beneficiarios.length - 3} beneficiários...
                    </p>
                  )}
                </div>

                <div className="flex gap-2">
                  {['admin', 'secretario', 'coordenador'].some(permission => hasPermission(permission)) && (
                    <Button onClick={() => setModoEdicao(true)}>
                      Editar
                    </Button>
                  )}
                  <Button variant="outline" onClick={() => setPrograma(null)}>
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