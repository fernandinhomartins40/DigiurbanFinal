'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import {
  DollarSign,
  Gift,
  Users,
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
  FileText,
  Heart,
  Baby,
  Archive
} from 'lucide-react'
import { useAdminAuth, useAdminPermissions } from '@/contexts/AdminAuthContext'

interface Beneficiario {
  nome: string
  cpf: string
  telefone: string
  endereco: string
  data_nascimento: string
  responsavel_familiar?: string
}

interface CriterioElegibilidade {
  tipo: string
  descricao: string
  valor_limite?: number
  documentacao_obrigatoria: string[]
}

interface HistoricoBeneficio {
  data: string
  acao: string
  valor?: number
  responsavel: string
  observacoes: string
}

interface Beneficio {
  id: string
  codigo_beneficio: string
  nome: string
  tipo: 'financeiro' | 'material' | 'servico'
  categoria: 'eventual' | 'continuado' | 'emergencial' | 'especial'
  descricao: string
  publico_alvo: string
  valor_beneficio?: number
  periodicidade: 'unico' | 'mensal' | 'bimestral' | 'trimestral' | 'anual'
  criterios_elegibilidade: CriterioElegibilidade[]
  documentos_necessarios: string[]
  vigencia: {
    data_inicio: string
    data_fim?: string
    renovavel: boolean
    prazo_renovacao?: string
  }
  gestao: {
    responsavel_tecnico: string
    unidade_gestora: string
    fonte_recurso: string
    orcamento_disponivel: number
    orcamento_utilizado: number
  }
  beneficiarios: Beneficiario[]
  fila_espera: number
  situacao: 'ativo' | 'suspenso' | 'encerrado' | 'em_analise'
  concessoes: {
    total_concedido: number
    valor_total_concedido: number
    mes_atual: number
    aguardando_analise: number
    indeferidos: number
  }
  historico: HistoricoBeneficio[]
  observacoes: string
}

export default function GerenciamentoBeneficios() {
  const { user } = useAdminAuth()
  const { hasPermission } = useAdminPermissions()
  const [beneficios, setBeneficios] = useState<Beneficio[]>([
    {
      id: '1',
      codigo_beneficio: 'BE2024001',
      nome: 'Auxílio Funeral',
      tipo: 'financeiro',
      categoria: 'eventual',
      descricao: 'Auxílio financeiro para despesas com funeral de membro da família em situação de vulnerabilidade',
      publico_alvo: 'Famílias inscritas no CadÚnico com renda per capita até 1/2 salário mínimo',
      valor_beneficio: 1500,
      periodicidade: 'unico',
      criterios_elegibilidade: [
        {
          tipo: 'Renda',
          descricao: 'Renda familiar per capita até 1/2 salário mínimo',
          valor_limite: 706,
          documentacao_obrigatoria: ['Cadastro Único atualizado', 'Comprovante de renda']
        },
        {
          tipo: 'Situação',
          descricao: 'Óbito de membro da família',
          documentacao_obrigatoria: ['Certidão de óbito', 'Comprovante de despesas funerárias']
        }
      ],
      documentos_necessarios: [
        'RG e CPF do requerente',
        'Certidão de óbito',
        'Comprovante de despesas funerárias',
        'Cadastro Único atualizado',
        'Comprovante de residência',
        'Comprovante de renda familiar'
      ],
      vigencia: {
        data_inicio: '2024-01-01',
        renovavel: false
      },
      gestao: {
        responsavel_tecnico: 'Ana Costa',
        unidade_gestora: 'CRAS Centro',
        fonte_recurso: 'Recursos próprios municipais',
        orcamento_disponivel: 50000,
        orcamento_utilizado: 12000
      },
      beneficiarios: [
        {
          nome: 'Maria Silva Santos',
          cpf: '123.456.789-00',
          telefone: '(61) 99999-1111',
          endereco: 'Rua das Flores, 123',
          data_nascimento: '1980-05-15'
        },
        {
          nome: 'João Oliveira Costa',
          cpf: '987.654.321-00',
          telefone: '(61) 88888-2222',
          endereco: 'Av. Principal, 456',
          data_nascimento: '1975-08-20'
        }
      ],
      fila_espera: 3,
      situacao: 'ativo',
      concessoes: {
        total_concedido: 8,
        valor_total_concedido: 12000,
        mes_atual: 2,
        aguardando_analise: 3,
        indeferidos: 1
      },
      historico: [
        {
          data: '2024-01-15',
          acao: 'Concessão de benefício',
          valor: 1500,
          responsavel: 'Ana Costa',
          observacoes: 'Benefício concedido após análise socioeconômica'
        },
        {
          data: '2024-01-20',
          acao: 'Concessão de benefício',
          valor: 1500,
          responsavel: 'Ana Costa',
          observacoes: 'Família em situação de extrema vulnerabilidade'
        }
      ],
      observacoes: 'Benefício com alta demanda. Necessário acompanhar orçamento disponível.'
    },
    {
      id: '2',
      codigo_beneficio: 'BE2024002',
      nome: 'Auxílio Natalidade',
      tipo: 'financeiro',
      categoria: 'eventual',
      descricao: 'Auxílio financeiro para despesas com o nascimento de criança em família vulnerável',
      publico_alvo: 'Gestantes e famílias com recém-nascidos em situação de vulnerabilidade social',
      valor_beneficio: 800,
      periodicidade: 'unico',
      criterios_elegibilidade: [
        {
          tipo: 'Renda',
          descricao: 'Renda familiar per capita até 1/2 salário mínimo',
          valor_limite: 706,
          documentacao_obrigatoria: ['Cadastro Único', 'Comprovante de renda']
        },
        {
          tipo: 'Situação',
          descricao: 'Nascimento de criança ou gestação em curso',
          documentacao_obrigatoria: ['Certidão de nascimento ou cartão pré-natal']
        }
      ],
      documentos_necessarios: [
        'RG e CPF da gestante/mãe',
        'Certidão de nascimento da criança ou cartão pré-natal',
        'Cadastro Único atualizado',
        'Comprovante de residência',
        'Comprovante de renda familiar'
      ],
      vigencia: {
        data_inicio: '2024-01-01',
        renovavel: false
      },
      gestao: {
        responsavel_tecnico: 'Carlos Mendes',
        unidade_gestora: 'CRAS Centro',
        fonte_recurso: 'Recursos próprios municipais',
        orcamento_disponivel: 30000,
        orcamento_utilizado: 6400
      },
      beneficiarios: [
        {
          nome: 'Sandra Lima Pereira',
          cpf: '456.789.123-00',
          telefone: '(61) 77777-3333',
          endereco: 'Rua Nova, 789',
          data_nascimento: '1990-03-10'
        }
      ],
      fila_espera: 5,
      situacao: 'ativo',
      concessoes: {
        total_concedido: 8,
        valor_total_concedido: 6400,
        mes_atual: 3,
        aguardando_analise: 5,
        indeferidos: 0
      },
      historico: [
        {
          data: '2024-01-10',
          acao: 'Concessão de benefício',
          valor: 800,
          responsavel: 'Carlos Mendes',
          observacoes: 'Nascimento de gêmeos - família em extrema vulnerabilidade'
        }
      ],
      observacoes: 'Benefício destinado ao apoio materno-infantil. Demanda crescente.'
    },
    {
      id: '3',
      codigo_beneficio: 'BE2024003',
      nome: 'Cartão Alimentação',
      tipo: 'financeiro',
      categoria: 'continuado',
      descricao: 'Cartão para compra de alimentos básicos para famílias em insegurança alimentar',
      publico_alvo: 'Famílias em situação de insegurança alimentar grave',
      valor_beneficio: 200,
      periodicidade: 'mensal',
      criterios_elegibilidade: [
        {
          tipo: 'Renda',
          descricao: 'Renda familiar per capita até R$ 200,00',
          valor_limite: 200,
          documentacao_obrigatoria: ['Cadastro Único', 'Comprovante de renda']
        },
        {
          tipo: 'Situação',
          descricao: 'Situação de insegurança alimentar comprovada',
          documentacao_obrigatoria: ['Estudo social', 'Declaração de insegurança alimentar']
        }
      ],
      documentos_necessarios: [
        'RG e CPF do responsável familiar',
        'Cadastro Único atualizado',
        'Comprovante de residência',
        'Comprovante de renda familiar',
        'Estudo social'
      ],
      vigencia: {
        data_inicio: '2024-01-01',
        data_fim: '2024-12-31',
        renovavel: true,
        prazo_renovacao: 'Anual'
      },
      gestao: {
        responsavel_tecnico: 'Maria Santos',
        unidade_gestora: 'CRAS Centro',
        fonte_recurso: 'Convênio estadual + recursos próprios',
        orcamento_disponivel: 120000,
        orcamento_utilizado: 48000
      },
      beneficiarios: [
        {
          nome: 'Pedro Santos Silva',
          cpf: '321.654.987-00',
          telefone: '(61) 66666-4444',
          endereco: 'Rua dos Trabalhadores, 321',
          data_nascimento: '1985-12-05'
        },
        {
          nome: 'Carmen Oliveira',
          cpf: '654.321.987-00',
          telefone: '(61) 55555-5555',
          endereco: 'Vila Esperança, 654',
          data_nascimento: '1982-07-18'
        }
      ],
      fila_espera: 45,
      situacao: 'ativo',
      concessoes: {
        total_concedido: 240,
        valor_total_concedido: 48000,
        mes_atual: 25,
        aguardando_analise: 45,
        indeferidos: 8
      },
      historico: [
        {
          data: '2024-01-01',
          acao: 'Início do programa',
          responsavel: 'Maria Santos',
          observacoes: 'Programa iniciado com 200 beneficiários'
        },
        {
          data: '2024-01-15',
          acao: 'Inclusão de novos beneficiários',
          responsavel: 'Maria Santos',
          observacoes: 'Inclusão de 40 novas famílias após análise'
        }
      ],
      observacoes: 'Programa com alta demanda e lista de espera significativa. Avaliar ampliação do orçamento.'
    }
  ])

  const [filtros, setFiltros] = useState({
    tipo: '',
    categoria: '',
    situacao: '',
    responsavel: ''
  })

  const [busca, setBusca] = useState('')
  const [beneficio, setBeneficio] = useState<Beneficio | null>(null)
  const [modoEdicao, setModoEdicao] = useState(false)

  const tipos_beneficio = ['financeiro', 'material', 'servico']
  const categorias = ['eventual', 'continuado', 'emergencial', 'especial']
  const periodicidades = ['unico', 'mensal', 'bimestral', 'trimestral', 'anual']
  const responsaveis = ['Ana Costa', 'Carlos Mendes', 'Maria Santos', 'João Silva', 'Paula Oliveira']

  const getSituacaoColor = (situacao: string) => {
    const colors = {
      ativo: 'bg-green-100 text-green-800',
      suspenso: 'bg-yellow-100 text-yellow-800',
      encerrado: 'bg-red-100 text-red-800',
      em_analise: 'bg-blue-100 text-blue-800'
    }
    return colors[situacao as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  const getTipoColor = (tipo: string) => {
    const colors = {
      financeiro: 'bg-green-100 text-green-800',
      material: 'bg-blue-100 text-blue-800',
      servico: 'bg-purple-100 text-purple-800'
    }
    return colors[tipo as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  const getCategoriaColor = (categoria: string) => {
    const colors = {
      eventual: 'bg-orange-100 text-orange-800',
      continuado: 'bg-blue-100 text-blue-800',
      emergencial: 'bg-red-100 text-red-800',
      especial: 'bg-purple-100 text-purple-800'
    }
    return colors[categoria as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  const beneficiosFiltrados = beneficios.filter(b => {
    const matchBusca = b.nome.toLowerCase().includes(busca.toLowerCase()) ||
                      b.codigo_beneficio.toLowerCase().includes(busca.toLowerCase()) ||
                      b.descricao.toLowerCase().includes(busca.toLowerCase())

    const matchTipo = !filtros.tipo || b.tipo === filtros.tipo
    const matchCategoria = !filtros.categoria || b.categoria === filtros.categoria
    const matchSituacao = !filtros.situacao || b.situacao === filtros.situacao
    const matchResponsavel = !filtros.responsavel || b.gestao.responsavel_tecnico.includes(filtros.responsavel)

    return matchBusca && matchTipo && matchCategoria && matchSituacao && matchResponsavel
  })

  const stats = {
    total: beneficios.length,
    ativos: beneficios.filter(b => b.situacao === 'ativo').length,
    beneficiarios: beneficios.reduce((acc, b) => acc + b.beneficiarios.length, 0),
    concessoes_mes: beneficios.reduce((acc, b) => acc + b.concessoes.mes_atual, 0),
    valor_total: beneficios.reduce((acc, b) => acc + b.concessoes.valor_total_concedido, 0),
    fila_espera: beneficios.reduce((acc, b) => acc + b.fila_espera, 0)
  }

  const salvarBeneficio = () => {
    if (beneficio) {
      if (beneficio.id) {
        setBeneficios(beneficios.map(b => b.id === beneficio.id ? beneficio : b))
      } else {
        const novoBeneficio = {
          ...beneficio,
          id: Date.now().toString(),
          codigo_beneficio: `BE${new Date().getFullYear()}${String(beneficios.length + 1).padStart(3, '0')}`,
          beneficiarios: [],
          concessoes: {
            total_concedido: 0,
            valor_total_concedido: 0,
            mes_atual: 0,
            aguardando_analise: 0,
            indeferidos: 0
          },
          historico: [{
            data: new Date().toISOString().split('T')[0],
            acao: 'Criação do benefício',
            responsavel: user?.name || 'Sistema',
            observacoes: 'Benefício criado'
          }]
        }
        setBeneficios([...beneficios, novoBeneficio])
      }
      setBeneficio(null)
      setModoEdicao(false)
    }
  }

  const gerarServicosAutomaticos = () => {
    return [
      {
        nome: "Benefício Eventual",
        descricao: "Solicite benefícios eventuais para situações emergenciais",
        categoria: "Benefícios",
        prazo: "10 dias úteis",
        documentos: ["RG", "CPF", "Cadastro Único", "Comprovante de renda", "Documentos específicos"],
        digital: true,
        gratuito: true
      },
      {
        nome: "Auxílio Funeral",
        descricao: "Solicite auxílio para despesas funerárias",
        categoria: "Auxílio Emergencial",
        prazo: "5 dias úteis",
        documentos: ["RG", "CPF", "Certidão de óbito", "Comprovante de despesas", "Cadastro Único"],
        digital: true,
        gratuito: true
      },
      {
        nome: "Auxílio Natalidade",
        descricao: "Solicite auxílio para despesas com nascimento",
        categoria: "Auxílio Materno-Infantil",
        prazo: "7 dias úteis",
        documentos: ["RG", "CPF", "Certidão de nascimento", "Cartão pré-natal", "Cadastro Único"],
        digital: true,
        gratuito: true
      },
      {
        nome: "Cartão Alimentação",
        descricao: "Solicite cartão para compra de alimentos básicos",
        categoria: "Segurança Alimentar",
        prazo: "15 dias úteis",
        documentos: ["RG", "CPF", "Cadastro Único", "Estudo social", "Comprovante de renda"],
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
          <h1 className="text-3xl font-bold">Gerenciamento de Benefícios</h1>
          <p className="text-muted-foreground mt-2">
            Controle de benefícios financeiros, materiais e serviços, periodicidade e critérios de elegibilidade
          </p>
        </div>
        <Button onClick={() => {
          setBeneficio({
            id: '',
            codigo_beneficio: '',
            nome: '',
            tipo: 'financeiro',
            categoria: 'eventual',
            descricao: '',
            publico_alvo: '',
            valor_beneficio: 0,
            periodicidade: 'unico',
            criterios_elegibilidade: [],
            documentos_necessarios: [],
            vigencia: {
              data_inicio: '',
              renovavel: false
            },
            gestao: {
              responsavel_tecnico: '',
              unidade_gestora: '',
              fonte_recurso: '',
              orcamento_disponivel: 0,
              orcamento_utilizado: 0
            },
            beneficiarios: [],
            fila_espera: 0,
            situacao: 'em_analise',
            concessoes: {
              total_concedido: 0,
              valor_total_concedido: 0,
              mes_atual: 0,
              aguardando_analise: 0,
              indeferidos: 0
            },
            historico: [],
            observacoes: ''
          })
          setModoEdicao(true)
        }}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Benefício
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Benefícios</CardTitle>
            <Gift className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">Cadastrados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ativos</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.ativos}</div>
            <p className="text-xs text-muted-foreground">Em funcionamento</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Beneficiários</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.beneficiarios}</div>
            <p className="text-xs text-muted-foreground">Ativos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Concessões/Mês</CardTitle>
            <FileText className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.concessoes_mes}</div>
            <p className="text-xs text-muted-foreground">Este mês</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
            <DollarSign className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              R$ {(stats.valor_total / 1000).toFixed(0)}k
            </div>
            <p className="text-xs text-muted-foreground">Concedido</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fila de Espera</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.fila_espera}</div>
            <p className="text-xs text-muted-foreground">Aguardando</p>
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
                placeholder="Buscar por nome, código ou descrição..."
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
                {tipos_beneficio.map(tipo => (
                  <SelectItem key={tipo} value={tipo}>
                    {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filtros.categoria} onValueChange={(value) => setFiltros({...filtros, categoria: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todas</SelectItem>
                {categorias.map(cat => (
                  <SelectItem key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filtros.situacao} onValueChange={(value) => setFiltros({...filtros, situacao: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Situação" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todas</SelectItem>
                <SelectItem value="ativo">Ativo</SelectItem>
                <SelectItem value="suspenso">Suspenso</SelectItem>
                <SelectItem value="encerrado">Encerrado</SelectItem>
                <SelectItem value="em_analise">Em Análise</SelectItem>
              </SelectContent>
            </Select>

            <Input
              placeholder="Responsável"
              value={filtros.responsavel}
              onChange={(e) => setFiltros({...filtros, responsavel: e.target.value})}
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gift className="h-5 w-5" />
                Benefícios ({beneficiosFiltrados.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {beneficiosFiltrados.map((benef) => (
                  <div key={benef.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-semibold">{benef.nome}</h4>
                        <p className="text-sm text-muted-foreground">{benef.codigo_beneficio}</p>
                      </div>
                      <div className="flex gap-2">
                        <Badge className={getTipoColor(benef.tipo)}>
                          {benef.tipo}
                        </Badge>
                        <Badge className={getCategoriaColor(benef.categoria)}>
                          {benef.categoria}
                        </Badge>
                        <Badge className={getSituacaoColor(benef.situacao)}>
                          {benef.situacao}
                        </Badge>
                      </div>
                    </div>

                    <p className="text-sm mb-2 line-clamp-2">{benef.descricao}</p>

                    <div className="grid grid-cols-2 gap-4 text-sm mb-2">
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-3 w-3" />
                        {benef.valor_beneficio ? `R$ ${benef.valor_beneficio.toLocaleString()}` : 'N/A'}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {benef.periodicidade}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {benef.beneficiarios.length} beneficiários
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {benef.fila_espera} na fila
                      </div>
                    </div>

                    <div className="mb-2">
                      <p className="text-xs text-muted-foreground">Responsável: {benef.gestao.responsavel_tecnico}</p>
                      <p className="text-xs text-muted-foreground">Unidade: {benef.gestao.unidade_gestora}</p>
                    </div>

                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs text-muted-foreground">
                        Orçamento: {((benef.gestao.orcamento_utilizado / benef.gestao.orcamento_disponivel) * 100).toFixed(1)}%
                      </span>
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-600 h-2 rounded-full"
                          style={{
                            width: `${Math.min((benef.gestao.orcamento_utilizado / benef.gestao.orcamento_disponivel) * 100, 100)}%`
                          }}
                        />
                      </div>
                    </div>

                    <div className="flex gap-2 mt-3">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setBeneficio(benef)}
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        Ver
                      </Button>
                      {['admin', 'secretario', 'coordenador'].some(permission => hasPermission(permission)) && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setBeneficio(benef)
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
                Benefícios geram automaticamente serviços no catálogo público
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {beneficio && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              {modoEdicao ? 'Editar Benefício' : 'Detalhes do Benefício'}
              {beneficio.nome && ` - ${beneficio.nome}`}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {modoEdicao ? (
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm font-medium">Nome do Benefício</label>
                  <Input
                    value={beneficio.nome}
                    onChange={(e) => setBeneficio({...beneficio, nome: e.target.value})}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Tipo</label>
                  <Select value={beneficio.tipo} onValueChange={(value) => setBeneficio({...beneficio, tipo: value as any})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {tipos_beneficio.map(tipo => (
                        <SelectItem key={tipo} value={tipo}>
                          {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium">Categoria</label>
                  <Select value={beneficio.categoria} onValueChange={(value) => setBeneficio({...beneficio, categoria: value as any})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categorias.map(cat => (
                        <SelectItem key={cat} value={cat}>
                          {cat.charAt(0).toUpperCase() + cat.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium">Valor (R$)</label>
                  <Input
                    type="number"
                    value={beneficio.valor_beneficio}
                    onChange={(e) => setBeneficio({...beneficio, valor_beneficio: parseFloat(e.target.value)})}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Periodicidade</label>
                  <Select value={beneficio.periodicidade} onValueChange={(value) => setBeneficio({...beneficio, periodicidade: value as any})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {periodicidades.map(per => (
                        <SelectItem key={per} value={per}>
                          {per.charAt(0).toUpperCase() + per.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium">Situação</label>
                  <Select value={beneficio.situacao} onValueChange={(value) => setBeneficio({...beneficio, situacao: value as any})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ativo">Ativo</SelectItem>
                      <SelectItem value="suspenso">Suspenso</SelectItem>
                      <SelectItem value="encerrado">Encerrado</SelectItem>
                      <SelectItem value="em_analise">Em Análise</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="md:col-span-2">
                  <label className="text-sm font-medium">Descrição</label>
                  <Input
                    value={beneficio.descricao}
                    onChange={(e) => setBeneficio({...beneficio, descricao: e.target.value})}
                  />
                </div>

                <div className="md:col-span-2 flex gap-2">
                  <Button onClick={salvarBeneficio}>Salvar</Button>
                  <Button variant="outline" onClick={() => {
                    setBeneficio(null)
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
                      <p><strong>Nome:</strong> {beneficio.nome}</p>
                      <p><strong>Tipo:</strong> <Badge className={getTipoColor(beneficio.tipo)}>{beneficio.tipo}</Badge></p>
                      <p><strong>Categoria:</strong> <Badge className={getCategoriaColor(beneficio.categoria)}>{beneficio.categoria}</Badge></p>
                      <p><strong>Valor:</strong> {beneficio.valor_beneficio ? `R$ ${beneficio.valor_beneficio.toLocaleString()}` : 'N/A'}</p>
                      <p><strong>Periodicidade:</strong> {beneficio.periodicidade}</p>
                      <p><strong>Situação:</strong> <Badge className={getSituacaoColor(beneficio.situacao)}>{beneficio.situacao}</Badge></p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Gestão</h4>
                    <div className="space-y-2 text-sm">
                      <p><strong>Responsável:</strong> {beneficio.gestao.responsavel_tecnico}</p>
                      <p><strong>Unidade Gestora:</strong> {beneficio.gestao.unidade_gestora}</p>
                      <p><strong>Fonte do Recurso:</strong> {beneficio.gestao.fonte_recurso}</p>
                      <p><strong>Orçamento Disponível:</strong> R$ {beneficio.gestao.orcamento_disponivel.toLocaleString()}</p>
                      <p><strong>Orçamento Utilizado:</strong> R$ {beneficio.gestao.orcamento_utilizado.toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Descrição</h4>
                  <p className="text-sm">{beneficio.descricao}</p>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Público-alvo</h4>
                  <p className="text-sm">{beneficio.publico_alvo}</p>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Estatísticas</h4>
                  <div className="grid gap-2 md:grid-cols-3 text-sm">
                    <p><strong>Total Concedido:</strong> {beneficio.concessoes.total_concedido}</p>
                    <p><strong>Concessões/Mês:</strong> {beneficio.concessoes.mes_atual}</p>
                    <p><strong>Aguardando:</strong> {beneficio.concessoes.aguardando_analise}</p>
                    <p><strong>Valor Total:</strong> R$ {beneficio.concessoes.valor_total_concedido.toLocaleString()}</p>
                    <p><strong>Fila de Espera:</strong> {beneficio.fila_espera}</p>
                    <p><strong>Indeferidos:</strong> {beneficio.concessoes.indeferidos}</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Beneficiários Ativos</h4>
                  <p className="text-sm mb-2">{beneficio.beneficiarios.length} beneficiários cadastrados</p>
                  {beneficio.beneficiarios.slice(0, 3).map((benef, index) => (
                    <div key={index} className="text-sm border rounded p-2 mb-1">
                      <p><strong>{benef.nome}</strong> - {benef.telefone}</p>
                      <p className="text-muted-foreground">{benef.endereco}</p>
                    </div>
                  ))}
                  {beneficio.beneficiarios.length > 3 && (
                    <p className="text-xs text-muted-foreground">
                      +{beneficio.beneficiarios.length - 3} beneficiários...
                    </p>
                  )}
                </div>

                <div className="flex gap-2">
                  {['admin', 'secretario', 'coordenador'].some(permission => hasPermission(permission)) && (
                    <Button onClick={() => setModoEdicao(true)}>
                      Editar
                    </Button>
                  )}
                  <Button variant="outline" onClick={() => setBeneficio(null)}>
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