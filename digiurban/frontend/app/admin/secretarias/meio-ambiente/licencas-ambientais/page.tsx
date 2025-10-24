'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area } from 'recharts'
import { useAdminAuth } from '@/contexts/AdminAuthContext'
import { Plus, Search, Filter, Download, Eye, Edit, FileText, Calendar, MapPin, AlertTriangle, CheckCircle, Clock, Shield, TreePine, Hammer, Factory, Building } from 'lucide-react'

interface LicencaAmbiental {
  id: string
  protocolo: string
  tipo_licenca: 'licenca_previa' | 'licenca_instalacao' | 'licenca_operacao' | 'autorizacao_supressao' | 'autorizacao_poda' | 'estudo_impacto' | 'licenca_simplificada' | 'renovacao_licenca'
  categoria: 'licenciamento' | 'autorizacao' | 'estudo' | 'renovacao'
  requerente: {
    nome: string
    cpf_cnpj: string
    telefone: string
    email: string
    endereco: string
    tipo: 'pessoa_fisica' | 'pessoa_juridica'
  }
  empreendimento: {
    nome: string
    endereco: string
    coordenadas?: string
    bairro: string
    area_total: number
    atividade: string
    porte: 'micro' | 'pequeno' | 'medio' | 'grande'
    potencial_poluidor: 'baixo' | 'medio' | 'alto'
  }
  status: 'aguardando_documentos' | 'analise_tecnica' | 'vistoria_agendada' | 'em_vistoria' | 'aguardando_complementacao' | 'aprovado' | 'indeferido' | 'emitido' | 'suspenso'
  prioridade: 'baixa' | 'normal' | 'alta' | 'urgente'
  data_protocolo: string
  data_vistoria?: string
  data_emissao?: string
  validade?: string
  prazo_analise: number
  dias_decorridos: number
  tecnico_responsavel?: string
  documentos_obrigatorios: string[]
  documentos_anexados: string[]
  observacoes: string
  condicionantes?: string[]
  valor_taxa: number
  situacao_pagamento: 'pendente' | 'pago' | 'isento'
  historico_tramitacao: {
    data: string
    status: string
    responsavel: string
    observacao: string
  }[]
}

interface ServicoGerado {
  id: string
  nome: string
  descricao: string
  tipo: 'licenca_ambiental' | 'autorizacao_supressao' | 'licenca_operacao' | 'estudo_impacto' | 'autorizacao_poda'
  categoria: 'licenciamento' | 'autorizacao' | 'estudo'
  protocolo_base: string
  documentos_necessarios: string[]
  prazo_dias: number
  valor_taxa: number
  ativo: boolean
}

export default function LicencasAmbientais() {
  const { user } = useAdminAuth()
  const [filtroStatus, setFiltroStatus] = useState<string>('todos')
  const [filtroTipo, setFiltroTipo] = useState<string>('todos')
  const [filtroPrioridade, setFiltroPrioridade] = useState<string>('todos')
  const [busca, setBusca] = useState('')
  const [novaLicenca, setNovaLicenca] = useState<Partial<LicencaAmbiental>>({})
  const [showNovaLicenca, setShowNovaLicenca] = useState(false)

  const licencas: LicencaAmbiental[] = [
    {
      id: '1',
      protocolo: 'LA-2024-001',
      tipo_licenca: 'licenca_operacao',
      categoria: 'licenciamento',
      requerente: {
        nome: 'Empresa Verde Ltda',
        cpf_cnpj: '12.345.678/0001-99',
        telefone: '(11) 99999-9999',
        email: 'empresa@verdeltda.com',
        endereco: 'Av. Industrial, 1000 - Distrito Industrial',
        tipo: 'pessoa_juridica'
      },
      empreendimento: {
        nome: 'Fábrica de Processamento de Alimentos',
        endereco: 'Av. Industrial, 1000',
        coordenadas: '-23.5505, -46.6333',
        bairro: 'Distrito Industrial',
        area_total: 5000,
        atividade: 'Processamento de alimentos industrializados',
        porte: 'medio',
        potencial_poluidor: 'medio'
      },
      status: 'analise_tecnica',
      prioridade: 'normal',
      data_protocolo: '2024-01-10',
      data_vistoria: '2024-01-25',
      prazo_analise: 60,
      dias_decorridos: 15,
      tecnico_responsavel: 'João Silva',
      documentos_obrigatorios: ['Projeto Técnico', 'Estudo de Impacto', 'ART do Responsável', 'Certidões'],
      documentos_anexados: ['projeto_tecnico.pdf', 'estudo_impacto.pdf', 'art_responsavel.pdf'],
      observacoes: 'Pendente certidão municipal',
      valor_taxa: 2500,
      situacao_pagamento: 'pago',
      historico_tramitacao: [
        { data: '2024-01-10', status: 'Protocolado', responsavel: 'Sistema', observacao: 'Protocolo aberto' },
        { data: '2024-01-12', status: 'Em análise', responsavel: 'João Silva', observacao: 'Iniciada análise técnica' }
      ]
    },
    {
      id: '2',
      protocolo: 'LA-2024-002',
      tipo_licenca: 'autorizacao_supressao',
      categoria: 'autorizacao',
      requerente: {
        nome: 'Carlos Santos',
        cpf_cnpj: '123.456.789-00',
        telefone: '(11) 88888-8888',
        email: 'carlos@email.com',
        endereco: 'Rua das Árvores, 123 - Centro',
        tipo: 'pessoa_fisica'
      },
      empreendimento: {
        nome: 'Construção Residencial',
        endereco: 'Rua das Árvores, 123',
        bairro: 'Centro',
        area_total: 300,
        atividade: 'Construção de residência unifamiliar',
        porte: 'micro',
        potencial_poluidor: 'baixo'
      },
      status: 'vistoria_agendada',
      prioridade: 'alta',
      data_protocolo: '2024-01-15',
      data_vistoria: '2024-01-22',
      prazo_analise: 30,
      dias_decorridos: 8,
      tecnico_responsavel: 'Maria Costa',
      documentos_obrigatorios: ['Planta baixa', 'Memorial descritivo', 'Laudo técnico'],
      documentos_anexados: ['planta_baixa.pdf', 'memorial.pdf'],
      observacoes: 'Aguardando laudo técnico florestal',
      valor_taxa: 150,
      situacao_pagamento: 'pendente',
      historico_tramitacao: [
        { data: '2024-01-15', status: 'Protocolado', responsavel: 'Sistema', observacao: 'Protocolo aberto' },
        { data: '2024-01-18', status: 'Vistoria agendada', responsavel: 'Maria Costa', observacao: 'Vistoria agendada para 22/01' }
      ]
    },
    {
      id: '3',
      protocolo: 'LA-2024-003',
      tipo_licenca: 'licenca_previa',
      categoria: 'licenciamento',
      requerente: {
        nome: 'Construtora ABC Ltda',
        cpf_cnpj: '98.765.432/0001-11',
        telefone: '(11) 77777-7777',
        email: 'contato@construtoraabc.com',
        endereco: 'Av. Construção, 500 - Vila Nova',
        tipo: 'pessoa_juridica'
      },
      empreendimento: {
        nome: 'Loteamento Residencial Sustentável',
        endereco: 'Estrada do Loteamento, s/n',
        coordenadas: '-23.5555, -46.6444',
        bairro: 'Zona Rural',
        area_total: 50000,
        atividade: 'Loteamento urbano com infraestrutura completa',
        porte: 'grande',
        potencial_poluidor: 'alto'
      },
      status: 'emitido',
      prioridade: 'normal',
      data_protocolo: '2023-11-15',
      data_emissao: '2024-01-10',
      validade: '2026-01-10',
      prazo_analise: 90,
      dias_decorridos: 56,
      tecnico_responsavel: 'Pedro Lima',
      documentos_obrigatorios: ['EIA/RIMA', 'Projeto urbanístico', 'Estudo de tráfego', 'Análise do solo'],
      documentos_anexados: ['eia_rima.pdf', 'projeto_urbanistico.pdf', 'estudo_trafego.pdf', 'analise_solo.pdf'],
      observacoes: 'Licença emitida com condicionantes',
      condicionantes: ['Manutenção de 30% de área verde', 'Sistema de tratamento de esgoto', 'Monitoramento ambiental'],
      valor_taxa: 15000,
      situacao_pagamento: 'pago',
      historico_tramitacao: [
        { data: '2023-11-15', status: 'Protocolado', responsavel: 'Sistema', observacao: 'Protocolo aberto' },
        { data: '2023-11-20', status: 'Em análise', responsavel: 'Pedro Lima', observacao: 'Iniciada análise do EIA/RIMA' },
        { data: '2023-12-10', status: 'Vistoria', responsavel: 'Equipe técnica', observacao: 'Vistoria de campo realizada' },
        { data: '2024-01-10', status: 'Emitido', responsavel: 'Pedro Lima', observacao: 'Licença emitida com condicionantes' }
      ]
    }
  ]

  const servicosGerados: ServicoGerado[] = [
    {
      id: '1',
      nome: 'Licença Ambiental',
      descricao: 'Licenciamento ambiental para atividades e empreendimentos',
      tipo: 'licenca_ambiental',
      categoria: 'licenciamento',
      protocolo_base: 'Solicitação → Estudo técnico → Vistoria → Emissão → Monitoramento',
      documentos_necessarios: ['Projeto técnico', 'Estudo de impacto', 'ART', 'Certidões'],
      prazo_dias: 60,
      valor_taxa: 2500,
      ativo: true
    },
    {
      id: '2',
      nome: 'Autorização de Supressão',
      descricao: 'Autorização para remoção de vegetação',
      tipo: 'autorizacao_supressao',
      categoria: 'autorizacao',
      protocolo_base: 'Solicitação → Estudo técnico → Vistoria → Emissão → Monitoramento',
      documentos_necessarios: ['Planta baixa', 'Memorial descritivo', 'Laudo técnico'],
      prazo_dias: 30,
      valor_taxa: 150,
      ativo: true
    },
    {
      id: '3',
      nome: 'Licença de Operação',
      descricao: 'Licença para operação de empreendimentos já instalados',
      tipo: 'licenca_operacao',
      categoria: 'licenciamento',
      protocolo_base: 'Solicitação → Estudo técnico → Vistoria → Emissão → Monitoramento',
      documentos_necessarios: ['Licença de instalação', 'Relatório de implantação', 'Testes operacionais'],
      prazo_dias: 45,
      valor_taxa: 3000,
      ativo: true
    },
    {
      id: '4',
      nome: 'Estudo de Impacto',
      descricao: 'Estudos de impacto ambiental para grandes empreendimentos',
      tipo: 'estudo_impacto',
      categoria: 'estudo',
      protocolo_base: 'Solicitação → Estudo técnico → Vistoria → Emissão → Monitoramento',
      documentos_necessarios: ['EIA/RIMA', 'Estudos específicos', 'Audiência pública'],
      prazo_dias: 120,
      valor_taxa: 10000,
      ativo: true
    },
    {
      id: '5',
      nome: 'Autorização de Poda',
      descricao: 'Autorização para poda de árvores em vias públicas',
      tipo: 'autorizacao_poda',
      categoria: 'autorizacao',
      protocolo_base: 'Solicitação → Estudo técnico → Vistoria → Emissão → Monitoramento',
      documentos_necessarios: ['Justificativa técnica', 'Fotos do local', 'Croqui'],
      prazo_dias: 15,
      valor_taxa: 50,
      ativo: true
    }
  ]

  const dadosLicencasPorMes = [
    { mes: 'Jul', emitidas: 12, indeferidas: 2, pendentes: 8 },
    { mes: 'Ago', emitidas: 15, indeferidas: 1, pendentes: 12 },
    { mes: 'Set', emitidas: 18, indeferidas: 3, pendentes: 10 },
    { mes: 'Out', emitidas: 22, indeferidas: 2, pendentes: 15 },
    { mes: 'Nov', emitidas: 25, indeferidas: 4, pendentes: 18 },
    { mes: 'Dez', emitidas: 28, indeferidas: 2, pendentes: 20 }
  ]

  const dadosTipoLicenca = [
    { tipo: 'Licença de Operação', quantidade: 45, cor: '#8884d8' },
    { tipo: 'Autorização Supressão', quantidade: 38, cor: '#82ca9d' },
    { tipo: 'Licença Prévia', quantidade: 25, cor: '#ffc658' },
    { tipo: 'Licença de Instalação', quantidade: 20, cor: '#ff7300' },
    { tipo: 'Autorização Poda', quantidade: 15, cor: '#00C49F' },
    { tipo: 'Estudo de Impacto', quantidade: 8, cor: '#FFBB28' }
  ]

  const dadosPorteEmpreendimento = [
    { porte: 'Micro', quantidade: 52 },
    { porte: 'Pequeno', quantidade: 38 },
    { porte: 'Médio', quantidade: 25 },
    { porte: 'Grande', quantidade: 12 }
  ]

  const getStatusBadge = (status: string) => {
    const variants = {
      'aguardando_documentos': 'bg-yellow-100 text-yellow-800',
      'analise_tecnica': 'bg-blue-100 text-blue-800',
      'vistoria_agendada': 'bg-purple-100 text-purple-800',
      'em_vistoria': 'bg-indigo-100 text-indigo-800',
      'aguardando_complementacao': 'bg-orange-100 text-orange-800',
      'aprovado': 'bg-green-100 text-green-800',
      'indeferido': 'bg-red-100 text-red-800',
      'emitido': 'bg-emerald-100 text-emerald-800',
      'suspenso': 'bg-gray-100 text-gray-800'
    }
    return variants[status as keyof typeof variants] || 'bg-gray-100 text-gray-800'
  }

  const getPrioridadeBadge = (prioridade: string) => {
    const variants = {
      'baixa': 'bg-green-100 text-green-800',
      'normal': 'bg-blue-100 text-blue-800',
      'alta': 'bg-orange-100 text-orange-800',
      'urgente': 'bg-red-100 text-red-800'
    }
    return variants[prioridade as keyof typeof variants] || 'bg-gray-100 text-gray-800'
  }

  const calcularProgresso = (diasDecorridos: number, prazoAnalise: number) => {
    return Math.min((diasDecorridos / prazoAnalise) * 100, 100)
  }

  const filtrarLicencas = licencas.filter(licenca => {
    const matchStatus = filtroStatus === 'todos' || licenca.status === filtroStatus
    const matchTipo = filtroTipo === 'todos' || licenca.tipo_licenca === filtroTipo
    const matchPrioridade = filtroPrioridade === 'todos' || licenca.prioridade === filtroPrioridade
    const matchBusca = busca === '' ||
      licenca.requerente.nome.toLowerCase().includes(busca.toLowerCase()) ||
      licenca.protocolo.toLowerCase().includes(busca.toLowerCase()) ||
      licenca.empreendimento.nome.toLowerCase().includes(busca.toLowerCase())

    return matchStatus && matchTipo && matchPrioridade && matchBusca
  })

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Licenças Ambientais</h1>
          <p className="text-gray-600 mt-1">Sistema de emissão de licenças e autorizações ambientais</p>
        </div>
        <div className="flex gap-3">
          <Dialog open={showNovaLicenca} onOpenChange={setShowNovaLicenca}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nova Licença
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Nova Licença Ambiental</DialogTitle>
                <DialogDescription>
                  Cadastrar nova solicitação de licença ou autorização ambiental
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Tipo de Licença</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecionar tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="licenca_previa">Licença Prévia</SelectItem>
                      <SelectItem value="licenca_instalacao">Licença de Instalação</SelectItem>
                      <SelectItem value="licenca_operacao">Licença de Operação</SelectItem>
                      <SelectItem value="autorizacao_supressao">Autorização de Supressão</SelectItem>
                      <SelectItem value="autorizacao_poda">Autorização de Poda</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Requerente</label>
                  <Input placeholder="Nome do requerente" />
                </div>
                <div>
                  <label className="text-sm font-medium">CPF/CNPJ</label>
                  <Input placeholder="000.000.000-00 ou 00.000.000/0001-00" />
                </div>
                <div>
                  <label className="text-sm font-medium">Porte do Empreendimento</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecionar porte" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="micro">Micro</SelectItem>
                      <SelectItem value="pequeno">Pequeno</SelectItem>
                      <SelectItem value="medio">Médio</SelectItem>
                      <SelectItem value="grande">Grande</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-2">
                  <label className="text-sm font-medium">Nome do Empreendimento</label>
                  <Input placeholder="Nome do empreendimento ou atividade" />
                </div>
                <div className="col-span-2">
                  <label className="text-sm font-medium">Endereço do Empreendimento</label>
                  <Input placeholder="Endereço completo" />
                </div>
                <div className="col-span-2">
                  <label className="text-sm font-medium">Descrição da Atividade</label>
                  <Textarea placeholder="Descrição detalhada da atividade a ser licenciada" />
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <Button className="flex-1">Criar Licença</Button>
                <Button variant="outline" onClick={() => setShowNovaLicenca(false)}>
                  Cancelar
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Relatório
          </Button>
        </div>
      </div>

      <Tabs defaultValue="licencas" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="licencas">Licenças</TabsTrigger>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="servicos">Serviços Gerados</TabsTrigger>
          <TabsTrigger value="relatorios">Relatórios</TabsTrigger>
        </TabsList>

        <TabsContent value="licencas" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Lista de Licenças Ambientais</CardTitle>
                <div className="flex gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Buscar por requerente, protocolo ou empreendimento..."
                      value={busca}
                      onChange={(e) => setBusca(e.target.value)}
                      className="pl-10 w-80"
                    />
                  </div>
                  <Select value={filtroStatus} onValueChange={setFiltroStatus}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos</SelectItem>
                      <SelectItem value="analise_tecnica">Análise Técnica</SelectItem>
                      <SelectItem value="vistoria_agendada">Vistoria Agendada</SelectItem>
                      <SelectItem value="aprovado">Aprovado</SelectItem>
                      <SelectItem value="emitido">Emitido</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={filtroTipo} onValueChange={setFiltroTipo}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos os tipos</SelectItem>
                      <SelectItem value="licenca_operacao">Licença de Operação</SelectItem>
                      <SelectItem value="autorizacao_supressao">Autorização Supressão</SelectItem>
                      <SelectItem value="licenca_previa">Licença Prévia</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filtrarLicencas.map((licenca) => (
                  <Card key={licenca.id} className="border-l-4 border-l-green-500">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-medium text-lg">{licenca.empreendimento.nome}</h3>
                            <Badge className="text-xs">{licenca.protocolo}</Badge>
                            <Badge variant="outline" className="capitalize">
                              {licenca.tipo_licenca.replace('_', ' ')}
                            </Badge>
                          </div>
                          <p className="text-gray-600 mb-1">{licenca.requerente.nome} - {licenca.requerente.cpf_cnpj}</p>
                          <p className="text-sm text-gray-500 mb-3">{licenca.empreendimento.atividade}</p>
                        </div>
                        <div className="flex gap-2">
                          <Badge className={getStatusBadge(licenca.status)}>
                            {licenca.status.replace('_', ' ')}
                          </Badge>
                          <Badge className={getPrioridadeBadge(licenca.prioridade)}>
                            {licenca.prioridade}
                          </Badge>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                        <div>
                          <span className="text-gray-600">Porte:</span>
                          <p className="font-medium capitalize">{licenca.empreendimento.porte}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Área:</span>
                          <p className="font-medium">{licenca.empreendimento.area_total} m²</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Potencial Poluidor:</span>
                          <p className="font-medium capitalize">{licenca.empreendimento.potencial_poluidor}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Responsável:</span>
                          <p className="font-medium">{licenca.tecnico_responsavel || 'Não atribuído'}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                        <MapPin className="h-4 w-4" />
                        {licenca.empreendimento.endereco} - {licenca.empreendimento.bairro}
                      </div>

                      <div className="mb-4">
                        <div className="flex justify-between items-center text-sm mb-2">
                          <span className="text-gray-600">Progresso da Análise</span>
                          <span className="font-medium">{licenca.dias_decorridos}/{licenca.prazo_analise} dias</span>
                        </div>
                        <Progress
                          value={calcularProgresso(licenca.dias_decorridos, licenca.prazo_analise)}
                          className="h-2"
                        />
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm mb-4">
                        <div>
                          <span className="text-gray-600">Protocolo:</span>
                          <p className="font-medium">{new Date(licenca.data_protocolo).toLocaleDateString('pt-BR')}</p>
                        </div>
                        {licenca.data_vistoria && (
                          <div>
                            <span className="text-gray-600">Vistoria:</span>
                            <p className="font-medium">{new Date(licenca.data_vistoria).toLocaleDateString('pt-BR')}</p>
                          </div>
                        )}
                        {licenca.data_emissao && (
                          <div>
                            <span className="text-gray-600">Emissão:</span>
                            <p className="font-medium">{new Date(licenca.data_emissao).toLocaleDateString('pt-BR')}</p>
                          </div>
                        )}
                        <div>
                          <span className="text-gray-600">Taxa:</span>
                          <p className="font-medium">R$ {licenca.valor_taxa.toLocaleString()}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Pagamento:</span>
                          <Badge className={licenca.situacao_pagamento === 'pago' ? 'bg-green-100 text-green-800' :
                            licenca.situacao_pagamento === 'pendente' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'}>
                            {licenca.situacao_pagamento}
                          </Badge>
                        </div>
                        {licenca.validade && (
                          <div>
                            <span className="text-gray-600">Validade:</span>
                            <p className="font-medium">{new Date(licenca.validade).toLocaleDateString('pt-BR')}</p>
                          </div>
                        )}
                      </div>

                      <div className="mb-4">
                        <p className="text-sm text-gray-600 mb-2">Documentos Obrigatórios:</p>
                        <div className="flex flex-wrap gap-2">
                          {licenca.documentos_obrigatorios.map((doc, index) => (
                            <Badge key={index} variant="outline" className={`text-xs ${
                              licenca.documentos_anexados.some(anexado => anexado.toLowerCase().includes(doc.toLowerCase().split(' ')[0]))
                                ? 'border-green-300 text-green-700'
                                : 'border-red-300 text-red-700'
                            }`}>
                              {doc}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {licenca.condicionantes && licenca.condicionantes.length > 0 && (
                        <div className="mb-4">
                          <p className="text-sm text-gray-600 mb-2">Condicionantes:</p>
                          <ul className="text-sm text-gray-700 space-y-1">
                            {licenca.condicionantes.map((condicionante, index) => (
                              <li key={index} className="flex items-start gap-2">
                                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                                {condicionante}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-4">
                          <Badge variant="outline" className="capitalize">
                            {licenca.categoria}
                          </Badge>
                          <span className="text-sm text-gray-600">{licenca.observacoes}</span>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-2" />
                            Detalhes
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4 mr-2" />
                            Editar
                          </Button>
                          <Button variant="outline" size="sm">
                            <FileText className="h-4 w-4 mr-2" />
                            Documentos
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total de Licenças</CardTitle>
                <Shield className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">186</div>
                <p className="text-xs text-muted-foreground">+18% desde o mês passado</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Em Análise</CardTitle>
                <Clock className="h-4 w-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">45</div>
                <p className="text-xs text-muted-foreground">24% do total</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Emitidas</CardTitle>
                <CheckCircle className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">128</div>
                <p className="text-xs text-muted-foreground">69% do total</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Prazo Médio</CardTitle>
                <Calendar className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">42 dias</div>
                <p className="text-xs text-muted-foreground">-5 dias desde o mês passado</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Licenças Emitidas por Mês</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={dadosLicencasPorMes}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mes" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="emitidas" stackId="1" stroke="#8884d8" fill="#8884d8" />
                    <Area type="monotone" dataKey="pendentes" stackId="1" stroke="#82ca9d" fill="#82ca9d" />
                    <Area type="monotone" dataKey="indeferidas" stackId="1" stroke="#ffc658" fill="#ffc658" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Distribuição por Tipo de Licença</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={dadosTipoLicenca}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ tipo, quantidade }) => `${tipo}: ${quantidade}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="quantidade"
                    >
                      {dadosTipoLicenca.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.cor} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Empreendimentos por Porte</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={dadosPorteEmpreendimento}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="porte" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="quantidade" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Evolução Temporal</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={dadosLicencasPorMes}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mes" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="emitidas" stroke="#8884d8" strokeWidth={2} />
                    <Line type="monotone" dataKey="pendentes" stroke="#82ca9d" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="servicos" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-green-600" />
                Serviços Gerados Automaticamente
              </CardTitle>
              <CardDescription>
                Serviços do catálogo público gerados pelas funcionalidades internas do licenciamento ambiental
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {servicosGerados.map((servico) => (
                  <Card key={servico.id} className="border-l-4 border-l-green-500">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-base">{servico.nome}</CardTitle>
                        <Badge className={servico.ativo ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                          {servico.ativo ? 'Ativo' : 'Inativo'}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-sm text-gray-600 mb-3">{servico.descricao}</p>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Prazo:</span>
                          <span className="font-medium">{servico.prazo_dias} dias</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Taxa:</span>
                          <span className="font-medium">R$ {servico.valor_taxa.toLocaleString()}</span>
                        </div>
                        <div className="text-sm">
                          <span className="text-gray-600">Protocolo:</span>
                          <p className="text-xs mt-1 text-gray-500">{servico.protocolo_base}</p>
                        </div>
                        <div className="text-sm">
                          <span className="text-gray-600">Documentos necessários:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {servico.documentos_necessarios.map((doc, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {doc}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Integração Bidirecional</CardTitle>
              <CardDescription>
                Como o sistema de licenciamento gera automaticamente serviços para o catálogo público
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
                  <h4 className="font-medium text-green-900 mb-2">Licenciamento Ambiental → Serviços Públicos</h4>
                  <ul className="text-sm text-green-800 space-y-1">
                    <li>• <strong>Licença Ambiental:</strong> Licenciamento completo para atividades diversas</li>
                    <li>• <strong>Autorização de Supressão:</strong> Remoção de vegetação para construções</li>
                    <li>• <strong>Licença de Operação:</strong> Operação de empreendimentos já instalados</li>
                    <li>• <strong>Estudo de Impacto:</strong> Análises ambientais para grandes projetos</li>
                    <li>• <strong>Autorização de Poda:</strong> Poda de árvores em vias públicas</li>
                  </ul>
                </div>

                <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                  <h4 className="font-medium text-blue-900 mb-2">Fluxo de Protocolos</h4>
                  <p className="text-sm text-blue-800">
                    Cidadão solicita "Licença Ambiental" → Protocolo criado → Análise técnica →
                    Vistoria de campo → Emissão da licença → Monitoramento contínuo
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="relatorios" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Relatório de Licenças</CardTitle>
                <CardDescription>Dados consolidados do licenciamento ambiental</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Gerar Relatório
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Relatório de Prazos</CardTitle>
                <CardDescription>Análise de cumprimento de prazos</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Gerar Relatório
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Relatório Financeiro</CardTitle>
                <CardDescription>Arrecadação de taxas ambientais</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Gerar Relatório
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}