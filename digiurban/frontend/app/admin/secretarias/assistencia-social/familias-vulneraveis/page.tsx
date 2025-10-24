'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import {
  Users,
  Home,
  DollarSign,
  AlertTriangle,
  Heart,
  Eye,
  Download,
  Filter,
  Search,
  Plus,
  UserPlus,
  CalendarDays,
  MapPin,
  Phone,
  Archive
} from 'lucide-react'
import { useAdminAuth, useAdminPermissions } from '@/contexts/AdminAuthContext'

interface Dependente {
  nome: string
  idade: number
  parentesco: string
  documento: string
  situacao_especial?: string
}

interface FamiliaVulneravel {
  id: string
  codigo_familia: string
  responsavel: {
    nome: string
    cpf: string
    rg: string
    telefone: string
    idade: number
    estado_civil: string
    escolaridade: string
    profissao: string
  }
  endereco: {
    logradouro: string
    numero: string
    bairro: string
    cep: string
    referencia: string
    tipo_moradia: string
    situacao_moradia: string
  }
  composicao_familiar: {
    total_membros: number
    dependentes: Dependente[]
    gestantes: number
    lactantes: number
    criancas_0_6: number
    criancas_7_17: number
    idosos: number
    deficientes: number
  }
  vulnerabilidades: {
    tipos: string[]
    nivel_vulnerabilidade: 'baixa' | 'media' | 'alta' | 'critica'
    descricao: string
    fatores_risco: string[]
  }
  situacao_economica: {
    renda_familiar: number
    renda_per_capita: number
    fonte_renda: string[]
    beneficios_ativos: string[]
    situacao_trabalho: string
  }
  acompanhamento: {
    data_cadastro: string
    ultima_atualizacao: string
    ultima_visita: string
    proxima_visita: string
    responsavel_tecnico: string
    frequencia_acompanhamento: string
    situacao: 'ativo' | 'inativo' | 'transferido' | 'concluido'
  }
  servicos_ofertados: string[]
  encaminhamentos: string[]
  observacoes: string
  historico_visitas: Array<{
    data: string
    tipo: string
    responsavel: string
    objetivo: string
    resultado: string
  }>
}

export default function FamiliasVulneraveis() {
  const { user } = useAdminAuth()
  const { hasPermission } = useAdminPermissions()
  const [familias, setFamilias] = useState<FamiliaVulneravel[]>([
    {
      id: '1',
      codigo_familia: 'FV2024001',
      responsavel: {
        nome: 'Maria da Silva Santos',
        cpf: '123.456.789-00',
        rg: '12.345.678-9',
        telefone: '(61) 99999-1111',
        idade: 34,
        estado_civil: 'Solteira',
        escolaridade: 'Ensino Fundamental Incompleto',
        profissao: 'Desempregada'
      },
      endereco: {
        logradouro: 'Rua das Flores',
        numero: '123',
        bairro: 'Vila Nova',
        cep: '72000-000',
        referencia: 'Próximo ao posto de saúde',
        tipo_moradia: 'Casa',
        situacao_moradia: 'Própria'
      },
      composicao_familiar: {
        total_membros: 5,
        dependentes: [
          { nome: 'João Silva', idade: 12, parentesco: 'Filho', documento: '234.567.890-11' },
          { nome: 'Ana Silva', idade: 8, parentesco: 'Filha', documento: '345.678.901-22' },
          { nome: 'Pedro Silva', idade: 4, parentesco: 'Filho', documento: '456.789.012-33' },
          { nome: 'José Santos', idade: 67, parentesco: 'Pai', documento: '567.890.123-44', situacao_especial: 'Hipertensão' }
        ],
        gestantes: 0,
        lactantes: 0,
        criancas_0_6: 1,
        criancas_7_17: 2,
        idosos: 1,
        deficientes: 0
      },
      vulnerabilidades: {
        tipos: ['Pobreza Extrema', 'Desemprego', 'Idoso com Problemas de Saúde'],
        nivel_vulnerabilidade: 'alta',
        descricao: 'Família em situação de extrema vulnerabilidade devido ao desemprego recente da responsável e problemas de saúde do idoso.',
        fatores_risco: ['Falta de renda', 'Despesas médicas altas', 'Dificuldade de acesso a serviços']
      },
      situacao_economica: {
        renda_familiar: 0,
        renda_per_capita: 0,
        fonte_renda: ['Trabalhos esporádicos'],
        beneficios_ativos: ['Bolsa Família - Em análise'],
        situacao_trabalho: 'Desempregada há 6 meses'
      },
      acompanhamento: {
        data_cadastro: '2024-01-10',
        ultima_atualizacao: '2024-01-20',
        ultima_visita: '2024-01-18',
        proxima_visita: '2024-02-01',
        responsavel_tecnico: 'Ana Costa - Assistente Social',
        frequencia_acompanhamento: 'Quinzenal',
        situacao: 'ativo'
      },
      servicos_ofertados: ['PAIF', 'Cadastro Único', 'Auxílio Emergencial'],
      encaminhamentos: ['CRAS Centro', 'Posto de Saúde', 'Conselho Tutelar'],
      observacoes: 'Família acompanhada desde janeiro/2024. Situação se agravou com perda de emprego. Idoso necessita acompanhamento médico regular.',
      historico_visitas: [
        {
          data: '2024-01-10',
          tipo: 'Cadastramento',
          responsavel: 'Ana Costa',
          objetivo: 'Cadastro inicial da família',
          resultado: 'Família cadastrada, identificadas vulnerabilidades múltiplas'
        },
        {
          data: '2024-01-18',
          tipo: 'Acompanhamento',
          responsavel: 'Ana Costa',
          objetivo: 'Verificar situação da família após perda de emprego',
          resultado: 'Situação crítica confirmada, encaminhada para benefícios emergenciais'
        }
      ]
    },
    {
      id: '2',
      codigo_familia: 'FV2024002',
      responsavel: {
        nome: 'Carlos Oliveira',
        cpf: '987.654.321-00',
        rg: '98.765.432-1',
        telefone: '(61) 88888-2222',
        idade: 45,
        estado_civil: 'Casado',
        escolaridade: 'Ensino Médio Completo',
        profissao: 'Pedreiro'
      },
      endereco: {
        logradouro: 'Av. Principal',
        numero: '456',
        bairro: 'Centro',
        cep: '72001-000',
        referencia: 'Em frente à escola municipal',
        tipo_moradia: 'Casa',
        situacao_moradia: 'Alugada'
      },
      composicao_familiar: {
        total_membros: 4,
        dependentes: [
          { nome: 'Sandra Oliveira', idade: 42, parentesco: 'Esposa', documento: '111.222.333-44' },
          { nome: 'Lucas Oliveira', idade: 16, parentesco: 'Filho', documento: '222.333.444-55' },
          { nome: 'Carla Oliveira', idade: 13, parentesco: 'Filha', documento: '333.444.555-66' }
        ],
        gestantes: 0,
        lactantes: 0,
        criancas_0_6: 0,
        criancas_7_17: 2,
        idosos: 0,
        deficientes: 1
      },
      vulnerabilidades: {
        tipos: ['Deficiência na Família', 'Baixa Renda'],
        nivel_vulnerabilidade: 'media',
        descricao: 'Família com adolescente deficiente visual, necessita apoio especializado.',
        fatores_risco: ['Gastos com tratamento especializado', 'Dificuldade de acesso a serviços']
      },
      situacao_economica: {
        renda_familiar: 1800,
        renda_per_capita: 450,
        fonte_renda: ['Trabalho formal', 'BPC'],
        beneficios_ativos: ['BPC - Benefício de Prestação Continuada'],
        situacao_trabalho: 'Empregado'
      },
      acompanhamento: {
        data_cadastro: '2024-01-15',
        ultima_atualizacao: '2024-01-25',
        ultima_visita: '2024-01-22',
        proxima_visita: '2024-02-15',
        responsavel_tecnico: 'Carlos Mendes - Assistente Social',
        frequencia_acompanhamento: 'Mensal',
        situacao: 'ativo'
      },
      servicos_ofertados: ['PAIF', 'Orientação sobre Deficiência', 'Encaminhamentos Especializados'],
      encaminhamentos: ['CREAS', 'APAE', 'Centro de Reabilitação'],
      observacoes: 'Família estável economicamente, mas necessita apoio para questões relacionadas à deficiência do filho.',
      historico_visitas: [
        {
          data: '2024-01-15',
          tipo: 'Cadastramento',
          responsavel: 'Carlos Mendes',
          objetivo: 'Cadastro e avaliação inicial',
          resultado: 'Identificada necessidade de apoio especializado para deficiência'
        },
        {
          data: '2024-01-22',
          tipo: 'Acompanhamento',
          responsavel: 'Carlos Mendes',
          objetivo: 'Verificar andamento dos encaminhamentos',
          resultado: 'Família aguardando vaga no centro de reabilitação'
        }
      ]
    }
  ])

  const [filtros, setFiltros] = useState({
    vulnerabilidade: '',
    situacao: '',
    bairro: '',
    responsavel_tecnico: ''
  })

  const [busca, setBusca] = useState('')
  const [familia, setFamilia] = useState<FamiliaVulneravel | null>(null)
  const [modoEdicao, setModoEdicao] = useState(false)

  const tipos_vulnerabilidade = [
    'Pobreza Extrema',
    'Desemprego',
    'Deficiência na Família',
    'Idoso com Problemas de Saúde',
    'Violência Doméstica',
    'Trabalho Infantil',
    'Gravidez na Adolescência',
    'Uso de Substâncias',
    'Situação de Rua',
    'Migração'
  ]

  const responsaveis_tecnicos = [
    'Ana Costa - Assistente Social',
    'Carlos Mendes - Assistente Social',
    'Maria Santos - Assistente Social',
    'João Silva - Assistente Social',
    'Paula Oliveira - Assistente Social'
  ]

  const getVulnerabilidadeColor = (nivel: string) => {
    const colors = {
      baixa: 'bg-green-100 text-green-800',
      media: 'bg-yellow-100 text-yellow-800',
      alta: 'bg-orange-100 text-orange-800',
      critica: 'bg-red-100 text-red-800'
    }
    return colors[nivel as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  const getSituacaoColor = (situacao: string) => {
    const colors = {
      ativo: 'bg-green-100 text-green-800',
      inativo: 'bg-gray-100 text-gray-800',
      transferido: 'bg-blue-100 text-blue-800',
      concluido: 'bg-purple-100 text-purple-800'
    }
    return colors[situacao as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  const familiasFiltradas = familias.filter(f => {
    const matchBusca = f.codigo_familia.toLowerCase().includes(busca.toLowerCase()) ||
                      f.responsavel.nome.toLowerCase().includes(busca.toLowerCase()) ||
                      f.endereco.bairro.toLowerCase().includes(busca.toLowerCase())

    const matchVulnerabilidade = !filtros.vulnerabilidade || f.vulnerabilidades.nivel_vulnerabilidade === filtros.vulnerabilidade
    const matchSituacao = !filtros.situacao || f.acompanhamento.situacao === filtros.situacao
    const matchBairro = !filtros.bairro || f.endereco.bairro.includes(filtros.bairro)
    const matchResponsavel = !filtros.responsavel_tecnico || f.acompanhamento.responsavel_tecnico.includes(filtros.responsavel_tecnico)

    return matchBusca && matchVulnerabilidade && matchSituacao && matchBairro && matchResponsavel
  })

  const stats = {
    total: familias.length,
    criticas: familias.filter(f => f.vulnerabilidades.nivel_vulnerabilidade === 'critica').length,
    altas: familias.filter(f => f.vulnerabilidades.nivel_vulnerabilidade === 'alta').length,
    ativas: familias.filter(f => f.acompanhamento.situacao === 'ativo').length,
    total_membros: familias.reduce((acc, f) => acc + f.composicao_familiar.total_membros, 0)
  }

  const salvarFamilia = () => {
    if (familia) {
      if (familia.id) {
        setFamilias(familias.map(f => f.id === familia.id ? familia : f))
      } else {
        const novaFamilia = {
          ...familia,
          id: Date.now().toString(),
          codigo_familia: `FV${new Date().getFullYear()}${String(familias.length + 1).padStart(3, '0')}`,
          acompanhamento: {
            ...familia.acompanhamento,
            data_cadastro: new Date().toISOString().split('T')[0],
            ultima_atualizacao: new Date().toISOString().split('T')[0]
          }
        }
        setFamilias([...familias, novaFamilia])
      }
      setFamilia(null)
      setModoEdicao(false)
    }
  }

  const gerarServicosAutomaticos = () => {
    return [
      {
        nome: "Cadastro de Vulnerabilidade Social",
        descricao: "Cadastre sua família para acompanhamento social especializado",
        categoria: "Assistência Social",
        prazo: "5 dias úteis",
        documentos: ["RG e CPF de todos os membros", "Comprovante de renda", "Comprovante de residência"],
        digital: true,
        gratuito: true
      },
      {
        nome: "Acompanhamento Social Familiar",
        descricao: "Receba acompanhamento especializado para sua família",
        categoria: "Acompanhamento",
        prazo: "3 dias úteis",
        documentos: ["Documentos da família", "Relatórios médicos (se houver)"],
        digital: true,
        gratuito: true
      },
      {
        nome: "Visita Social Domiciliar",
        descricao: "Solicite visita domiciliar do assistente social",
        categoria: "Visitas",
        prazo: "7 dias úteis",
        documentos: ["Comprovante de residência", "Descrição da situação"],
        digital: true,
        gratuito: true
      },
      {
        nome: "Estudo Social",
        descricao: "Solicite estudo social para sua família",
        categoria: "Estudos",
        prazo: "10 dias úteis",
        documentos: ["Documentos completos da família", "Comprovantes de renda"],
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
          <h1 className="text-3xl font-bold">Famílias Vulneráveis</h1>
          <p className="text-muted-foreground mt-2">
            Cadastro e acompanhamento de famílias em situação de vulnerabilidade social
          </p>
        </div>
        <Button onClick={() => {
          setFamilia({
            id: '',
            codigo_familia: '',
            responsavel: {
              nome: '',
              cpf: '',
              rg: '',
              telefone: '',
              idade: 0,
              estado_civil: '',
              escolaridade: '',
              profissao: ''
            },
            endereco: {
              logradouro: '',
              numero: '',
              bairro: '',
              cep: '',
              referencia: '',
              tipo_moradia: '',
              situacao_moradia: ''
            },
            composicao_familiar: {
              total_membros: 1,
              dependentes: [],
              gestantes: 0,
              lactantes: 0,
              criancas_0_6: 0,
              criancas_7_17: 0,
              idosos: 0,
              deficientes: 0
            },
            vulnerabilidades: {
              tipos: [],
              nivel_vulnerabilidade: 'media',
              descricao: '',
              fatores_risco: []
            },
            situacao_economica: {
              renda_familiar: 0,
              renda_per_capita: 0,
              fonte_renda: [],
              beneficios_ativos: [],
              situacao_trabalho: ''
            },
            acompanhamento: {
              data_cadastro: '',
              ultima_atualizacao: '',
              ultima_visita: '',
              proxima_visita: '',
              responsavel_tecnico: '',
              frequencia_acompanhamento: '',
              situacao: 'ativo'
            },
            servicos_ofertados: [],
            encaminhamentos: [],
            observacoes: '',
            historico_visitas: []
          })
          setModoEdicao(true)
        }}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Família
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Famílias</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">Cadastradas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vulnerabilidade Crítica</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.criticas}</div>
            <p className="text-xs text-muted-foreground">Situação crítica</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vulnerabilidade Alta</CardTitle>
            <Heart className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.altas}</div>
            <p className="text-xs text-muted-foreground">Acompanhamento intensivo</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Acompanhamento Ativo</CardTitle>
            <UserPlus className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.ativas}</div>
            <p className="text-xs text-muted-foreground">Em acompanhamento</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pessoas</CardTitle>
            <Home className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.total_membros}</div>
            <p className="text-xs text-muted-foreground">Atendidas</p>
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
                placeholder="Buscar por código, responsável ou bairro..."
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
            <Select value={filtros.vulnerabilidade} onValueChange={(value) => setFiltros({...filtros, vulnerabilidade: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Vulnerabilidade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todas</SelectItem>
                <SelectItem value="baixa">Baixa</SelectItem>
                <SelectItem value="media">Média</SelectItem>
                <SelectItem value="alta">Alta</SelectItem>
                <SelectItem value="critica">Crítica</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filtros.situacao} onValueChange={(value) => setFiltros({...filtros, situacao: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Situação" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todas</SelectItem>
                <SelectItem value="ativo">Ativo</SelectItem>
                <SelectItem value="inativo">Inativo</SelectItem>
                <SelectItem value="transferido">Transferido</SelectItem>
                <SelectItem value="concluido">Concluído</SelectItem>
              </SelectContent>
            </Select>

            <Input
              placeholder="Bairro"
              value={filtros.bairro}
              onChange={(e) => setFiltros({...filtros, bairro: e.target.value})}
            />

            <Input
              placeholder="Responsável Técnico"
              value={filtros.responsavel_tecnico}
              onChange={(e) => setFiltros({...filtros, responsavel_tecnico: e.target.value})}
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Famílias Vulneráveis ({familiasFiltradas.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {familiasFiltradas.map((fam) => (
                  <div key={fam.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-semibold">{fam.codigo_familia}</h4>
                        <p className="text-sm text-muted-foreground">{fam.responsavel.nome}</p>
                      </div>
                      <div className="flex gap-2">
                        <Badge className={getVulnerabilidadeColor(fam.vulnerabilidades.nivel_vulnerabilidade)}>
                          {fam.vulnerabilidades.nivel_vulnerabilidade}
                        </Badge>
                        <Badge className={getSituacaoColor(fam.acompanhamento.situacao)}>
                          {fam.acompanhamento.situacao}
                        </Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm mb-2">
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {fam.composicao_familiar.total_membros} membros
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {fam.endereco.bairro}
                      </div>
                      <div className="flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {fam.responsavel.telefone}
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-3 w-3" />
                        R$ {fam.situacao_economica.renda_per_capita.toFixed(2)}
                      </div>
                    </div>

                    <div className="mb-2">
                      <p className="text-xs text-muted-foreground">Vulnerabilidades:</p>
                      <div className="flex gap-1 mt-1 flex-wrap">
                        {fam.vulnerabilidades.tipos.slice(0, 3).map((tipo, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tipo}
                          </Badge>
                        ))}
                        {fam.vulnerabilidades.tipos.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{fam.vulnerabilidades.tipos.length - 3}
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-muted-foreground mb-2">
                      <span className="flex items-center gap-1">
                        <CalendarDays className="h-3 w-3" />
                        Última visita: {fam.acompanhamento.ultima_visita}
                      </span>
                    </div>

                    <p className="text-xs text-muted-foreground mb-2">
                      Responsável: {fam.acompanhamento.responsavel_tecnico}
                    </p>

                    <div className="flex gap-2 mt-3">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setFamilia(fam)}
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        Ver
                      </Button>
                      {['admin', 'secretario', 'coordenador'].some(permission => hasPermission(permission)) && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setFamilia(fam)
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
                      <CalendarDays className="h-3 w-3" />
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
                Cadastros familiares geram automaticamente serviços no catálogo público
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {familia && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              {modoEdicao ? 'Editar Família' : 'Detalhes da Família'}
              {familia.codigo_familia && ` - ${familia.codigo_familia}`}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {modoEdicao ? (
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm font-medium">Nome do Responsável</label>
                  <Input
                    value={familia.responsavel.nome}
                    onChange={(e) => setFamilia({...familia, responsavel: {...familia.responsavel, nome: e.target.value}})}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Telefone</label>
                  <Input
                    value={familia.responsavel.telefone}
                    onChange={(e) => setFamilia({...familia, responsavel: {...familia.responsavel, telefone: e.target.value}})}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Endereço</label>
                  <Input
                    value={familia.endereco.logradouro}
                    onChange={(e) => setFamilia({...familia, endereco: {...familia.endereco, logradouro: e.target.value}})}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Bairro</label>
                  <Input
                    value={familia.endereco.bairro}
                    onChange={(e) => setFamilia({...familia, endereco: {...familia.endereco, bairro: e.target.value}})}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Nível de Vulnerabilidade</label>
                  <Select value={familia.vulnerabilidades.nivel_vulnerabilidade} onValueChange={(value) => setFamilia({...familia, vulnerabilidades: {...familia.vulnerabilidades, nivel_vulnerabilidade: value as any}})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="baixa">Baixa</SelectItem>
                      <SelectItem value="media">Média</SelectItem>
                      <SelectItem value="alta">Alta</SelectItem>
                      <SelectItem value="critica">Crítica</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium">Situação</label>
                  <Select value={familia.acompanhamento.situacao} onValueChange={(value) => setFamilia({...familia, acompanhamento: {...familia.acompanhamento, situacao: value as any}})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ativo">Ativo</SelectItem>
                      <SelectItem value="inativo">Inativo</SelectItem>
                      <SelectItem value="transferido">Transferido</SelectItem>
                      <SelectItem value="concluido">Concluído</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="md:col-span-2 flex gap-2">
                  <Button onClick={salvarFamilia}>Salvar</Button>
                  <Button variant="outline" onClick={() => {
                    setFamilia(null)
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
                    <h4 className="font-semibold mb-2">Responsável Familiar</h4>
                    <div className="space-y-2 text-sm">
                      <p><strong>Nome:</strong> {familia.responsavel.nome}</p>
                      <p><strong>Idade:</strong> {familia.responsavel.idade} anos</p>
                      <p><strong>Telefone:</strong> {familia.responsavel.telefone}</p>
                      <p><strong>Estado Civil:</strong> {familia.responsavel.estado_civil}</p>
                      <p><strong>Profissão:</strong> {familia.responsavel.profissao}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Composição Familiar</h4>
                    <div className="space-y-2 text-sm">
                      <p><strong>Total de Membros:</strong> {familia.composicao_familiar.total_membros}</p>
                      <p><strong>Crianças 0-6 anos:</strong> {familia.composicao_familiar.criancas_0_6}</p>
                      <p><strong>Crianças 7-17 anos:</strong> {familia.composicao_familiar.criancas_7_17}</p>
                      <p><strong>Idosos:</strong> {familia.composicao_familiar.idosos}</p>
                      <p><strong>Deficientes:</strong> {familia.composicao_familiar.deficientes}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Vulnerabilidades</h4>
                  <div className="space-y-2">
                    <p><strong>Nível:</strong> <Badge className={getVulnerabilidadeColor(familia.vulnerabilidades.nivel_vulnerabilidade)}>{familia.vulnerabilidades.nivel_vulnerabilidade}</Badge></p>
                    <p><strong>Tipos:</strong></p>
                    <div className="flex gap-2 flex-wrap">
                      {familia.vulnerabilidades.tipos.map((tipo, index) => (
                        <Badge key={index} variant="outline">{tipo}</Badge>
                      ))}
                    </div>
                    <p className="text-sm">{familia.vulnerabilidades.descricao}</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Situação Econômica</h4>
                  <div className="grid gap-2 md:grid-cols-2 text-sm">
                    <p><strong>Renda Familiar:</strong> R$ {familia.situacao_economica.renda_familiar.toFixed(2)}</p>
                    <p><strong>Renda Per Capita:</strong> R$ {familia.situacao_economica.renda_per_capita.toFixed(2)}</p>
                    <p><strong>Situação de Trabalho:</strong> {familia.situacao_economica.situacao_trabalho}</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Acompanhamento</h4>
                  <div className="grid gap-2 md:grid-cols-2 text-sm">
                    <p><strong>Situação:</strong> <Badge className={getSituacaoColor(familia.acompanhamento.situacao)}>{familia.acompanhamento.situacao}</Badge></p>
                    <p><strong>Responsável Técnico:</strong> {familia.acompanhamento.responsavel_tecnico}</p>
                    <p><strong>Última Visita:</strong> {familia.acompanhamento.ultima_visita}</p>
                    <p><strong>Próxima Visita:</strong> {familia.acompanhamento.proxima_visita}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  {['admin', 'secretario', 'coordenador'].some(permission => hasPermission(permission)) && (
                    <Button onClick={() => setModoEdicao(true)}>
                      Editar
                    </Button>
                  )}
                  <Button variant="outline" onClick={() => setFamilia(null)}>
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