'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import {
  UserPlus,
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
  Mail,
  Phone
} from 'lucide-react'
import { useAdminAuth, useAdminPermissions } from '@/contexts/AdminAuthContext'

interface Inscricao {
  id: string
  numero_protocolo: string
  programa: {
    id: string
    nome: string
    tipo: string
    area_atuacao: string
  }
  solicitante: {
    nome: string
    cpf: string
    rg: string
    telefone: string
    email: string
    endereco: {
      logradouro: string
      numero: string
      bairro: string
      cep: string
      cidade: string
      uf: string
    }
    data_nascimento: string
    estado_civil: string
    profissao: string
  }
  familia: {
    composicao_familiar: Array<{
      nome: string
      parentesco: string
      idade: number
      profissao: string
      renda: number
    }>
    renda_total: number
    renda_per_capita: number
    situacao_moradia: string
    beneficios_sociais: string[]
  }
  documentos: {
    documento_id: string
    tipo: string
    nome_arquivo: string
    status: 'pendente' | 'aprovado' | 'rejeitado'
    observacoes?: string
  }[]
  avaliacao: {
    status: 'aguardando' | 'em_analise' | 'aprovado' | 'rejeitado' | 'aguardando_documentos'
    pontuacao_vulnerabilidade: number
    criterios_atendidos: string[]
    criterios_nao_atendidos: string[]
    observacoes_tecnicas: string
    tecnico_responsavel: string
    data_avaliacao?: string
  }
  visitas_domiciliares: Array<{
    data: string
    tecnico: string
    observacoes: string
    situacao_encontrada: string
    recomendacoes: string
  }>
  historico: Array<{
    data: string
    acao: string
    responsavel: string
    observacoes: string
  }>
  data_inscricao: string
  prazo_analise: string
  prioridade: 'baixa' | 'media' | 'alta' | 'urgente'
}

export default function InscricoesProgramas() {
  const { user } = useAdminAuth()
  const { hasPermission } = useAdminPermissions()
  const [inscricoes, setInscricoes] = useState<Inscricao[]>([
    {
      id: '1',
      numero_protocolo: 'INS2024001',
      programa: {
        id: '1',
        nome: 'Programa Renda Solidária',
        tipo: 'municipal',
        area_atuacao: 'Transferência de Renda'
      },
      solicitante: {
        nome: 'Maria Silva Santos',
        cpf: '123.456.789-00',
        rg: '12.345.678-X',
        telefone: '(61) 99999-1111',
        email: 'maria.santos@email.com',
        endereco: {
          logradouro: 'Rua das Flores',
          numero: '123',
          bairro: 'Centro',
          cep: '72000-000',
          cidade: 'Cidade Digital',
          uf: 'DF'
        },
        data_nascimento: '1985-05-15',
        estado_civil: 'Casada',
        profissao: 'Diarista'
      },
      familia: {
        composicao_familiar: [
          { nome: 'Maria Silva Santos', parentesco: 'Responsável', idade: 39, profissao: 'Diarista', renda: 800 },
          { nome: 'João Santos Silva', parentesco: 'Cônjuge', idade: 42, profissao: 'Pedreiro', renda: 1200 },
          { nome: 'Ana Silva Santos', parentesco: 'Filha', idade: 15, profissao: 'Estudante', renda: 0 },
          { nome: 'Pedro Silva Santos', parentesco: 'Filho', idade: 12, profissao: 'Estudante', renda: 0 }
        ],
        renda_total: 2000,
        renda_per_capita: 500,
        situacao_moradia: 'Casa própria',
        beneficios_sociais: ['Bolsa Família', 'Auxílio Gás']
      },
      documentos: [
        { documento_id: '1', tipo: 'RG', nome_arquivo: 'rg_maria.pdf', status: 'aprovado' },
        { documento_id: '2', tipo: 'CPF', nome_arquivo: 'cpf_maria.pdf', status: 'aprovado' },
        { documento_id: '3', tipo: 'Comprovante de Renda', nome_arquivo: 'renda_familia.pdf', status: 'pendente' },
        { documento_id: '4', tipo: 'Comprovante de Residência', nome_arquivo: 'comprovante_residencia.pdf', status: 'aprovado' }
      ],
      avaliacao: {
        status: 'em_analise',
        pontuacao_vulnerabilidade: 85,
        criterios_atendidos: ['Renda familiar baixa', 'Presença de menores', 'Residência no município'],
        criterios_nao_atendidos: [],
        observacoes_tecnicas: 'Família atende todos os critérios do programa. Aguardando apenas comprovante de renda atualizado.',
        tecnico_responsavel: 'Ana Costa'
      },
      visitas_domiciliares: [
        {
          data: '2024-03-15',
          tecnico: 'Ana Costa',
          observacoes: 'Família em situação de vulnerabilidade social moderada',
          situacao_encontrada: 'Casa simples mas organizada, crianças frequentando escola',
          recomendacoes: 'Indicar para programa de capacitação profissional também'
        }
      ],
      historico: [
        { data: '2024-03-10', acao: 'Inscrição realizada', responsavel: 'Sistema', observacoes: 'Inscrição via portal online' },
        { data: '2024-03-12', acao: 'Documentos enviados', responsavel: 'Maria Silva Santos', observacoes: 'Upload de documentos pelo portal' },
        { data: '2024-03-13', acao: 'Análise iniciada', responsavel: 'Ana Costa', observacoes: 'Processo distribuído para análise técnica' },
        { data: '2024-03-15', acao: 'Visita domiciliar realizada', responsavel: 'Ana Costa', observacoes: 'Visita técnica domiciliar' }
      ],
      data_inscricao: '2024-03-10',
      prazo_analise: '2024-03-25',
      prioridade: 'alta'
    },
    {
      id: '2',
      numero_protocolo: 'INS2024002',
      programa: {
        id: '2',
        nome: 'Programa Geração de Renda',
        tipo: 'parceria',
        area_atuacao: 'Capacitação e Trabalho'
      },
      solicitante: {
        nome: 'José Oliveira Lima',
        cpf: '987.654.321-00',
        rg: '87.654.321-Y',
        telefone: '(61) 88888-2222',
        email: 'jose.lima@email.com',
        endereco: {
          logradouro: 'Av. Principal',
          numero: '456',
          bairro: 'Vila Nova',
          cep: '72100-100',
          cidade: 'Cidade Digital',
          uf: 'DF'
        },
        data_nascimento: '1980-08-20',
        estado_civil: 'Solteiro',
        profissao: 'Desempregado'
      },
      familia: {
        composicao_familiar: [
          { nome: 'José Oliveira Lima', parentesco: 'Responsável', idade: 44, profissao: 'Desempregado', renda: 0 },
          { nome: 'Fernanda Lima Santos', parentesco: 'Companheira', idade: 38, profissao: 'Vendedora', renda: 1100 }
        ],
        renda_total: 1100,
        renda_per_capita: 550,
        situacao_moradia: 'Casa alugada',
        beneficios_sociais: ['Auxílio Brasil']
      },
      documentos: [
        { documento_id: '5', tipo: 'RG', nome_arquivo: 'rg_jose.pdf', status: 'aprovado' },
        { documento_id: '6', tipo: 'CPF', nome_arquivo: 'cpf_jose.pdf', status: 'aprovado' },
        { documento_id: '7', tipo: 'Cadastro Único', nome_arquivo: 'cadunico_jose.pdf', status: 'aprovado' },
        { documento_id: '8', tipo: 'Declaração de Interesse', nome_arquivo: 'declaracao_interesse.pdf', status: 'aprovado' }
      ],
      avaliacao: {
        status: 'aprovado',
        pontuacao_vulnerabilidade: 70,
        criterios_atendidos: ['Cadastro Único ativo', 'Idade adequada', 'Disponibilidade'],
        criterios_nao_atendidos: [],
        observacoes_tecnicas: 'Candidato aprovado para participar do programa de capacitação em marcenaria.',
        tecnico_responsavel: 'Carlos Mendes',
        data_avaliacao: '2024-03-18'
      },
      visitas_domiciliares: [],
      historico: [
        { data: '2024-03-08', acao: 'Inscrição realizada', responsavel: 'Sistema', observacoes: 'Inscrição presencial no CRAS' },
        { data: '2024-03-10', acao: 'Documentos enviados', responsavel: 'José Oliveira Lima', observacoes: 'Documentos entregues presencialmente' },
        { data: '2024-03-15', acao: 'Análise iniciada', responsavel: 'Carlos Mendes', observacoes: 'Início da análise técnica' },
        { data: '2024-03-18', acao: 'Aprovado', responsavel: 'Carlos Mendes', observacoes: 'Aprovação para programa de capacitação' }
      ],
      data_inscricao: '2024-03-08',
      prazo_analise: '2024-03-22',
      prioridade: 'media'
    }
  ])

  const [filtros, setFiltros] = useState({
    programa: '',
    status: '',
    prioridade: '',
    tecnico: ''
  })

  const [busca, setBusca] = useState('')
  const [inscricao, setInscricao] = useState<Inscricao | null>(null)
  const [modoEdicao, setModoEdicao] = useState(false)

  const programas_disponiveis = [
    'Programa Renda Solidária',
    'Programa Geração de Renda',
    'Auxílio Emergencial Municipal',
    'Programa Habitação Social',
    'Programa Primeira Infância'
  ]

  const tecnicos = ['Ana Costa', 'Carlos Mendes', 'Maria Santos', 'João Silva', 'Paula Oliveira']

  const getStatusColor = (status: string) => {
    const colors = {
      aguardando: 'bg-gray-100 text-gray-800',
      em_analise: 'bg-blue-100 text-blue-800',
      aprovado: 'bg-green-100 text-green-800',
      rejeitado: 'bg-red-100 text-red-800',
      aguardando_documentos: 'bg-yellow-100 text-yellow-800'
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

  const inscricoesFiltradas = inscricoes.filter(i => {
    const matchBusca = i.solicitante.nome.toLowerCase().includes(busca.toLowerCase()) ||
                      i.numero_protocolo.toLowerCase().includes(busca.toLowerCase()) ||
                      i.programa.nome.toLowerCase().includes(busca.toLowerCase())

    const matchPrograma = !filtros.programa || i.programa.nome === filtros.programa
    const matchStatus = !filtros.status || i.avaliacao.status === filtros.status
    const matchPrioridade = !filtros.prioridade || i.prioridade === filtros.prioridade
    const matchTecnico = !filtros.tecnico || i.avaliacao.tecnico_responsavel.includes(filtros.tecnico)

    return matchBusca && matchPrograma && matchStatus && matchPrioridade && matchTecnico
  })

  const stats = {
    total: inscricoes.length,
    aguardando: inscricoes.filter(i => i.avaliacao.status === 'aguardando').length,
    em_analise: inscricoes.filter(i => i.avaliacao.status === 'em_analise').length,
    aprovadas: inscricoes.filter(i => i.avaliacao.status === 'aprovado').length,
    rejeitadas: inscricoes.filter(i => i.avaliacao.status === 'rejeitado').length,
    urgentes: inscricoes.filter(i => i.prioridade === 'urgente').length
  }

  if (!['admin', 'secretario', 'coordenador', 'tecnico'].some(permission => hasPermission(permission))) {
    return <div className="p-6">Acesso negado. Você não tem permissão para acessar esta página.</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Inscrições em Programas</h1>
          <p className="text-muted-foreground mt-2">
            Gestão de inscrições, análise de elegibilidade e acompanhamento de processos
          </p>
        </div>
        <Button onClick={() => {
          setInscricao({
            id: '',
            numero_protocolo: '',
            programa: { id: '', nome: '', tipo: '', area_atuacao: '' },
            solicitante: {
              nome: '', cpf: '', rg: '', telefone: '', email: '',
              endereco: { logradouro: '', numero: '', bairro: '', cep: '', cidade: '', uf: '' },
              data_nascimento: '', estado_civil: '', profissao: ''
            },
            familia: {
              composicao_familiar: [],
              renda_total: 0,
              renda_per_capita: 0,
              situacao_moradia: '',
              beneficios_sociais: []
            },
            documentos: [],
            avaliacao: {
              status: 'aguardando',
              pontuacao_vulnerabilidade: 0,
              criterios_atendidos: [],
              criterios_nao_atendidos: [],
              observacoes_tecnicas: '',
              tecnico_responsavel: ''
            },
            visitas_domiciliares: [],
            historico: [],
            data_inscricao: '',
            prazo_analise: '',
            prioridade: 'media'
          })
          setModoEdicao(true)
        }}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Inscrição
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <UserPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">Inscrições</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aguardando</CardTitle>
            <Clock className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">{stats.aguardando}</div>
            <p className="text-xs text-muted-foreground">Análise inicial</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Em Análise</CardTitle>
            <Eye className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.em_analise}</div>
            <p className="text-xs text-muted-foreground">Processando</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aprovadas</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.aprovadas}</div>
            <p className="text-xs text-muted-foreground">Deferidas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejeitadas</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.rejeitadas}</div>
            <p className="text-xs text-muted-foreground">Indeferidas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Urgentes</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.urgentes}</div>
            <p className="text-xs text-muted-foreground">Prioridade alta</p>
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
                placeholder="Buscar por nome, protocolo ou programa..."
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
            <Select value={filtros.programa} onValueChange={(value) => setFiltros({...filtros, programa: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Programa" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos</SelectItem>
                {programas_disponiveis.map(programa => (
                  <SelectItem key={programa} value={programa}>{programa}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filtros.status} onValueChange={(value) => setFiltros({...filtros, status: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos</SelectItem>
                <SelectItem value="aguardando">Aguardando</SelectItem>
                <SelectItem value="em_analise">Em Análise</SelectItem>
                <SelectItem value="aprovado">Aprovado</SelectItem>
                <SelectItem value="rejeitado">Rejeitado</SelectItem>
                <SelectItem value="aguardando_documentos">Aguard. Documentos</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filtros.prioridade} onValueChange={(value) => setFiltros({...filtros, prioridade: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Prioridade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todas</SelectItem>
                <SelectItem value="baixa">Baixa</SelectItem>
                <SelectItem value="media">Média</SelectItem>
                <SelectItem value="alta">Alta</SelectItem>
                <SelectItem value="urgente">Urgente</SelectItem>
              </SelectContent>
            </Select>

            <Input
              placeholder="Técnico"
              value={filtros.tecnico}
              onChange={(e) => setFiltros({...filtros, tecnico: e.target.value})}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Inscrições em Programas ({inscricoesFiltradas.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {inscricoesFiltradas.map((insc) => (
              <div key={insc.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-semibold">{insc.solicitante.nome}</h4>
                    <p className="text-sm text-muted-foreground">
                      {insc.numero_protocolo} - {insc.programa.nome}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Badge className={getPrioridadeColor(insc.prioridade)}>
                      {insc.prioridade}
                    </Badge>
                    <Badge className={getStatusColor(insc.avaliacao.status)}>
                      {insc.avaliacao.status.replace('_', ' ')}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm mb-2">
                  <div className="flex items-center gap-1">
                    <Phone className="h-3 w-3" />
                    {insc.solicitante.telefone}
                  </div>
                  <div className="flex items-center gap-1">
                    <Mail className="h-3 w-3" />
                    {insc.solicitante.email}
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {insc.familia.composicao_familiar.length} pessoas
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {insc.data_inscricao}
                  </div>
                </div>

                <div className="text-sm mb-2">
                  <p><strong>Renda per capita:</strong> R$ {insc.familia.renda_per_capita.toFixed(2)}</p>
                  <p><strong>Pontuação vulnerabilidade:</strong> {insc.avaliacao.pontuacao_vulnerabilidade}/100</p>
                  {insc.avaliacao.tecnico_responsavel && (
                    <p><strong>Técnico:</strong> {insc.avaliacao.tecnico_responsavel}</p>
                  )}
                </div>

                <div className="flex gap-2 mt-3">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setInscricao(insc)}
                  >
                    <Eye className="h-3 w-3 mr-1" />
                    Ver Detalhes
                  </Button>
                  {['admin', 'secretario', 'coordenador', 'tecnico'].some(permission => hasPermission(permission)) && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setInscricao(insc)
                        setModoEdicao(true)
                      }}
                    >
                      Avaliar
                    </Button>
                  )}
                  <Button size="sm" variant="outline">
                    <Download className="h-3 w-3 mr-1" />
                    Docs
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {inscricao && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              {modoEdicao ? 'Avaliar Inscrição' : 'Detalhes da Inscrição'}
              {inscricao.numero_protocolo && ` - ${inscricao.numero_protocolo}`}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h4 className="font-semibold mb-2">Dados do Solicitante</h4>
                <div className="space-y-2 text-sm">
                  <p><strong>Nome:</strong> {inscricao.solicitante.nome}</p>
                  <p><strong>CPF:</strong> {inscricao.solicitante.cpf}</p>
                  <p><strong>Telefone:</strong> {inscricao.solicitante.telefone}</p>
                  <p><strong>Email:</strong> {inscricao.solicitante.email}</p>
                  <p><strong>Profissão:</strong> {inscricao.solicitante.profissao}</p>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Programa Solicitado</h4>
                <div className="space-y-2 text-sm">
                  <p><strong>Programa:</strong> {inscricao.programa.nome}</p>
                  <p><strong>Tipo:</strong> {inscricao.programa.tipo}</p>
                  <p><strong>Área:</strong> {inscricao.programa.area_atuacao}</p>
                  <p><strong>Data Inscrição:</strong> {inscricao.data_inscricao}</p>
                  <p><strong>Prazo Análise:</strong> {inscricao.prazo_analise}</p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Composição Familiar</h4>
              <div className="space-y-2">
                {inscricao.familia.composicao_familiar.map((membro, index) => (
                  <div key={index} className="border rounded p-2 text-sm">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      <p><strong>{membro.nome}</strong></p>
                      <p>{membro.parentesco}</p>
                      <p>{membro.idade} anos</p>
                      <p>R$ {membro.renda.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
                <div className="border-t pt-2 text-sm">
                  <p><strong>Renda Total:</strong> R$ {inscricao.familia.renda_total.toFixed(2)}</p>
                  <p><strong>Renda Per Capita:</strong> R$ {inscricao.familia.renda_per_capita.toFixed(2)}</p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Documentos</h4>
              <div className="grid gap-2 md:grid-cols-2">
                {inscricao.documentos.map((doc, index) => (
                  <div key={index} className="flex items-center justify-between border rounded p-2">
                    <div className="text-sm">
                      <p className="font-medium">{doc.tipo}</p>
                      <p className="text-muted-foreground">{doc.nome_arquivo}</p>
                    </div>
                    <Badge className={getStatusColor(doc.status)}>
                      {doc.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Avaliação Técnica</h4>
              <div className="space-y-2 text-sm">
                <p><strong>Status:</strong> <Badge className={getStatusColor(inscricao.avaliacao.status)}>{inscricao.avaliacao.status.replace('_', ' ')}</Badge></p>
                <p><strong>Pontuação Vulnerabilidade:</strong> {inscricao.avaliacao.pontuacao_vulnerabilidade}/100</p>
                {inscricao.avaliacao.tecnico_responsavel && (
                  <p><strong>Técnico Responsável:</strong> {inscricao.avaliacao.tecnico_responsavel}</p>
                )}
                {inscricao.avaliacao.observacoes_tecnicas && (
                  <div>
                    <p className="font-medium">Observações Técnicas:</p>
                    <p className="text-muted-foreground">{inscricao.avaliacao.observacoes_tecnicas}</p>
                  </div>
                )}
              </div>
            </div>

            {inscricao.historico.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2">Histórico</h4>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {inscricao.historico.map((item, index) => (
                    <div key={index} className="border rounded p-2 text-sm">
                      <div className="flex justify-between">
                        <span className="font-medium">{item.acao}</span>
                        <span className="text-muted-foreground">{item.data}</span>
                      </div>
                      <p className="text-muted-foreground">{item.responsavel}</p>
                      {item.observacoes && <p>{item.observacoes}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-2 pt-4 border-t">
              {modoEdicao && ['admin', 'secretario', 'coordenador', 'tecnico'].some(permission => hasPermission(permission)) && (
                <>
                  <Button onClick={() => {
                    // Lógica para salvar avaliação
                    setModoEdicao(false)
                  }}>
                    Salvar Avaliação
                  </Button>
                  <Button variant="outline" onClick={() => setModoEdicao(false)}>
                    Cancelar
                  </Button>
                </>
              )}
              {!modoEdicao && (
                <>
                  {['admin', 'secretario', 'coordenador', 'tecnico'].some(permission => hasPermission(permission)) && (
                    <Button onClick={() => setModoEdicao(true)}>
                      Avaliar
                    </Button>
                  )}
                  <Button variant="outline" onClick={() => setInscricao(null)}>
                    Fechar
                  </Button>
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Relatório
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}