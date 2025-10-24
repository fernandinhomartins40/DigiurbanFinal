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
import { Calendar } from "@/components/ui/calendar"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts'
import { useAdminAuth } from '@/contexts/AdminAuthContext'
import { Plus, Search, Filter, Download, Eye, Edit, MessageSquare, Users, Leaf, TreePine, Droplets, ShieldCheck, FileText, Calendar as CalendarIcon, MapPin, AlertTriangle, CheckCircle } from 'lucide-react'

interface AtendimentoAmbiental {
  id: string
  protocolo: string
  cidadao: {
    nome: string
    cpf: string
    telefone: string
    email: string
    endereco: string
  }
  tipo_solicitacao: 'orientacao_ambiental' | 'educacao_ambiental' | 'apoio_sustentavel' | 'informacoes_ecologicas' | 'denuncia_ambiental' | 'licenciamento' | 'consultoria_verde' | 'projeto_ambiental'
  categoria: 'licenciamento' | 'educacao' | 'consultoria' | 'denuncia' | 'orientacao' | 'projeto' | 'apoio'
  assunto: string
  descricao: string
  urgencia: 'baixa' | 'media' | 'alta' | 'critica'
  status: 'aguardando' | 'em_analise' | 'orientacao_fornecida' | 'material_enviado' | 'agendado' | 'concluido' | 'cancelado'
  data_abertura: string
  data_prevista: string
  data_conclusao?: string
  funcionario_responsavel?: string
  documentos_anexos: string[]
  observacoes: string
  area_ambiental: 'flora' | 'fauna' | 'recursos_hidricos' | 'solo' | 'ar' | 'residuos' | 'energia' | 'clima' | 'educacao'
  localizacao?: {
    endereco: string
    coordenadas?: string
    bairro: string
  }
  impacto_estimado: 'baixo' | 'medio' | 'alto'
  material_educativo?: string[]
}

interface ServicoGerado {
  id: string
  nome: string
  descricao: string
  tipo: 'orientacao_ambiental' | 'educacao_ambiental' | 'apoio_sustentavel' | 'informacoes_ecologicas'
  categoria: 'orientacao' | 'educacao' | 'apoio' | 'informacao'
  protocolo_base: string
  ativo: boolean
}

export default function AtendimentosAmbientais() {
  const { user } = useAdminAuth()
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [filtroStatus, setFiltroStatus] = useState<string>('todos')
  const [filtroTipo, setFiltroTipo] = useState<string>('todos')
  const [filtroUrgencia, setFiltroUrgencia] = useState<string>('todos')
  const [busca, setBusca] = useState('')
  const [novoAtendimento, setNovoAtendimento] = useState<Partial<AtendimentoAmbiental>>({})
  const [showNovoAtendimento, setShowNovoAtendimento] = useState(false)

  const atendimentos: AtendimentoAmbiental[] = [
    {
      id: '1',
      protocolo: 'MA-2024-001',
      cidadao: {
        nome: 'Carlos Silva',
        cpf: '123.456.789-00',
        telefone: '(11) 99999-9999',
        email: 'carlos@email.com',
        endereco: 'Rua das Flores, 123 - Centro'
      },
      tipo_solicitacao: 'orientacao_ambiental',
      categoria: 'orientacao',
      assunto: 'Descarte correto de óleo de cozinha',
      descricao: 'Solicita informações sobre pontos de coleta de óleo usado em restaurante',
      urgencia: 'media',
      status: 'orientacao_fornecida',
      data_abertura: '2024-01-10',
      data_prevista: '2024-01-15',
      data_conclusao: '2024-01-12',
      funcionario_responsavel: 'Maria Santos',
      documentos_anexos: ['foto_estabelecimento.jpg'],
      observacoes: 'Orientado sobre pontos de coleta e legislação',
      area_ambiental: 'residuos',
      localizacao: {
        endereco: 'Rua das Flores, 123',
        bairro: 'Centro'
      },
      impacto_estimado: 'medio',
      material_educativo: ['cartilha_descarte_oleo.pdf', 'lista_pontos_coleta.pdf']
    },
    {
      id: '2',
      protocolo: 'MA-2024-002',
      cidadao: {
        nome: 'Ana Costa',
        cpf: '987.654.321-00',
        telefone: '(11) 88888-8888',
        email: 'ana@email.com',
        endereco: 'Av. Verde, 456 - Jardim Ecológico'
      },
      tipo_solicitacao: 'educacao_ambiental',
      categoria: 'educacao',
      assunto: 'Programa educação ambiental escolar',
      descricao: 'Escola solicita programa de educação ambiental para alunos do ensino fundamental',
      urgencia: 'baixa',
      status: 'em_analise',
      data_abertura: '2024-01-15',
      data_prevista: '2024-01-25',
      funcionario_responsavel: 'João Oliveira',
      documentos_anexos: ['projeto_pedagogico.pdf', 'cronograma_escolar.pdf'],
      observacoes: 'Avaliar disponibilidade de educadores ambientais',
      area_ambiental: 'educacao',
      localizacao: {
        endereco: 'Av. Verde, 456',
        bairro: 'Jardim Ecológico'
      },
      impacto_estimado: 'alto'
    },
    {
      id: '3',
      protocolo: 'MA-2024-003',
      cidadao: {
        nome: 'Pedro Souza',
        cpf: '456.789.123-00',
        telefone: '(11) 77777-7777',
        email: 'pedro@email.com',
        endereco: 'Rua Sustentável, 789 - Vila Verde'
      },
      tipo_solicitacao: 'apoio_sustentavel',
      categoria: 'apoio',
      assunto: 'Projeto compostagem comunitária',
      descricao: 'Comunidade busca apoio para implementar sistema de compostagem coletiva',
      urgencia: 'media',
      status: 'agendado',
      data_abertura: '2024-01-18',
      data_prevista: '2024-01-30',
      funcionario_responsavel: 'Maria Santos',
      documentos_anexos: ['proposta_compostagem.pdf', 'ata_reuniao_comunidade.pdf'],
      observacoes: 'Vistoria técnica agendada para 25/01',
      area_ambiental: 'residuos',
      localizacao: {
        endereco: 'Rua Sustentável, 789',
        coordenadas: '-23.5505, -46.6333',
        bairro: 'Vila Verde'
      },
      impacto_estimado: 'alto'
    }
  ]

  const servicosGerados: ServicoGerado[] = [
    {
      id: '1',
      nome: 'Orientação Ambiental',
      descricao: 'Consulta e orientação sobre questões ambientais diversas',
      tipo: 'orientacao_ambiental',
      categoria: 'orientacao',
      protocolo_base: 'Solicitação → Orientação → Material educativo → Acompanhamento',
      ativo: true
    },
    {
      id: '2',
      nome: 'Educação Ambiental',
      descricao: 'Programas educacionais sobre meio ambiente e sustentabilidade',
      tipo: 'educacao_ambiental',
      categoria: 'educacao',
      protocolo_base: 'Solicitação → Orientação → Material educativo → Acompanhamento',
      ativo: true
    },
    {
      id: '3',
      nome: 'Apoio Sustentável',
      descricao: 'Suporte técnico para projetos sustentáveis e ambientais',
      tipo: 'apoio_sustentavel',
      categoria: 'apoio',
      protocolo_base: 'Solicitação → Orientação → Material educativo → Acompanhamento',
      ativo: true
    },
    {
      id: '4',
      nome: 'Informações Ecológicas',
      descricao: 'Base de conhecimento sobre ecologia e meio ambiente local',
      tipo: 'informacoes_ecologicas',
      categoria: 'informacao',
      protocolo_base: 'Solicitação → Orientação → Material educativo → Acompanhamento',
      ativo: true
    }
  ]

  const dadosAtendimentosPorMes = [
    { mes: 'Jul', orientacao: 25, educacao: 15, apoio: 8, informacoes: 20 },
    { mes: 'Ago', orientacao: 30, educacao: 18, apoio: 12, informacoes: 25 },
    { mes: 'Set', orientacao: 28, educacao: 22, apoio: 10, informacoes: 23 },
    { mes: 'Out', orientacao: 35, educacao: 20, apoio: 15, informacoes: 28 },
    { mes: 'Nov', orientacao: 32, educacao: 25, apoio: 18, informacoes: 30 },
    { mes: 'Dez', orientacao: 38, educacao: 28, apoio: 20, informacoes: 35 }
  ]

  const dadosAreaAmbiental = [
    { area: 'Resíduos', quantidade: 45, cor: '#8884d8' },
    { area: 'Flora', quantidade: 32, cor: '#82ca9d' },
    { area: 'Recursos Hídricos', quantidade: 28, cor: '#ffc658' },
    { area: 'Solo', quantidade: 22, cor: '#ff7300' },
    { area: 'Ar', quantidade: 18, cor: '#00C49F' },
    { area: 'Energia', quantidade: 15, cor: '#FFBB28' }
  ]

  const dadosStatusAtendimentos = [
    { status: 'Aguardando', quantidade: 12 },
    { status: 'Em Análise', quantidade: 18 },
    { status: 'Orientação Fornecida', quantidade: 25 },
    { status: 'Material Enviado', quantidade: 15 },
    { status: 'Concluído', quantidade: 35 }
  ]

  const getStatusBadge = (status: string) => {
    const variants = {
      'aguardando': 'bg-yellow-100 text-yellow-800',
      'em_analise': 'bg-blue-100 text-blue-800',
      'orientacao_fornecida': 'bg-green-100 text-green-800',
      'material_enviado': 'bg-purple-100 text-purple-800',
      'agendado': 'bg-orange-100 text-orange-800',
      'concluido': 'bg-gray-100 text-gray-800',
      'cancelado': 'bg-red-100 text-red-800'
    }
    return variants[status as keyof typeof variants] || 'bg-gray-100 text-gray-800'
  }

  const getUrgenciaBadge = (urgencia: string) => {
    const variants = {
      'baixa': 'bg-green-100 text-green-800',
      'media': 'bg-yellow-100 text-yellow-800',
      'alta': 'bg-orange-100 text-orange-800',
      'critica': 'bg-red-100 text-red-800'
    }
    return variants[urgencia as keyof typeof variants] || 'bg-gray-100 text-gray-800'
  }

  const filtrarAtendimentos = atendimentos.filter(atendimento => {
    const matchStatus = filtroStatus === 'todos' || atendimento.status === filtroStatus
    const matchTipo = filtroTipo === 'todos' || atendimento.tipo_solicitacao === filtroTipo
    const matchUrgencia = filtroUrgencia === 'todos' || atendimento.urgencia === filtroUrgencia
    const matchBusca = busca === '' ||
      atendimento.cidadao.nome.toLowerCase().includes(busca.toLowerCase()) ||
      atendimento.protocolo.toLowerCase().includes(busca.toLowerCase()) ||
      atendimento.assunto.toLowerCase().includes(busca.toLowerCase())

    return matchStatus && matchTipo && matchUrgencia && matchBusca
  })

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Atendimentos Ambientais</h1>
          <p className="text-gray-600 mt-1">PDV para questões ambientais e licenciamento</p>
        </div>
        <div className="flex gap-3">
          <Dialog open={showNovoAtendimento} onOpenChange={setShowNovoAtendimento}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Novo Atendimento
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Novo Atendimento Ambiental</DialogTitle>
                <DialogDescription>
                  Registrar nova solicitação ou orientação ambiental
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Nome do Cidadão</label>
                  <Input placeholder="Nome completo" />
                </div>
                <div>
                  <label className="text-sm font-medium">CPF</label>
                  <Input placeholder="000.000.000-00" />
                </div>
                <div>
                  <label className="text-sm font-medium">Tipo de Solicitação</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecionar tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="orientacao_ambiental">Orientação Ambiental</SelectItem>
                      <SelectItem value="educacao_ambiental">Educação Ambiental</SelectItem>
                      <SelectItem value="apoio_sustentavel">Apoio Sustentável</SelectItem>
                      <SelectItem value="informacoes_ecologicas">Informações Ecológicas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Urgência</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecionar urgência" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="baixa">Baixa</SelectItem>
                      <SelectItem value="media">Média</SelectItem>
                      <SelectItem value="alta">Alta</SelectItem>
                      <SelectItem value="critica">Crítica</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-2">
                  <label className="text-sm font-medium">Assunto</label>
                  <Input placeholder="Breve descrição do assunto" />
                </div>
                <div className="col-span-2">
                  <label className="text-sm font-medium">Descrição</label>
                  <Textarea placeholder="Descrição detalhada da solicitação" />
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <Button className="flex-1">Criar Atendimento</Button>
                <Button variant="outline" onClick={() => setShowNovoAtendimento(false)}>
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

      <Tabs defaultValue="atendimentos" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="atendimentos">Atendimentos</TabsTrigger>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="servicos">Serviços Gerados</TabsTrigger>
          <TabsTrigger value="relatorios">Relatórios</TabsTrigger>
        </TabsList>

        <TabsContent value="atendimentos" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Lista de Atendimentos</CardTitle>
                <div className="flex gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Buscar por nome, protocolo ou assunto..."
                      value={busca}
                      onChange={(e) => setBusca(e.target.value)}
                      className="pl-10 w-80"
                    />
                  </div>
                  <Select value={filtroStatus} onValueChange={setFiltroStatus}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos</SelectItem>
                      <SelectItem value="aguardando">Aguardando</SelectItem>
                      <SelectItem value="em_analise">Em Análise</SelectItem>
                      <SelectItem value="orientacao_fornecida">Orientação Fornecida</SelectItem>
                      <SelectItem value="concluido">Concluído</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={filtroTipo} onValueChange={setFiltroTipo}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos os tipos</SelectItem>
                      <SelectItem value="orientacao_ambiental">Orientação Ambiental</SelectItem>
                      <SelectItem value="educacao_ambiental">Educação Ambiental</SelectItem>
                      <SelectItem value="apoio_sustentavel">Apoio Sustentável</SelectItem>
                      <SelectItem value="informacoes_ecologicas">Informações Ecológicas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filtrarAtendimentos.map((atendimento) => (
                  <Card key={atendimento.id} className="border-l-4 border-l-green-500">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-medium text-lg">{atendimento.assunto}</h3>
                            <Badge className="text-xs">{atendimento.protocolo}</Badge>
                          </div>
                          <p className="text-gray-600 mb-2">{atendimento.cidadao.nome} - {atendimento.cidadao.cpf}</p>
                          <p className="text-sm text-gray-500 mb-3">{atendimento.descricao}</p>
                        </div>
                        <div className="flex gap-2">
                          <Badge className={getStatusBadge(atendimento.status)}>
                            {atendimento.status.replace('_', ' ')}
                          </Badge>
                          <Badge className={getUrgenciaBadge(atendimento.urgencia)}>
                            {atendimento.urgencia}
                          </Badge>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                        <div>
                          <span className="text-gray-600">Área:</span>
                          <p className="font-medium capitalize">{atendimento.area_ambiental.replace('_', ' ')}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Data Abertura:</span>
                          <p className="font-medium">{new Date(atendimento.data_abertura).toLocaleDateString('pt-BR')}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Previsão:</span>
                          <p className="font-medium">{new Date(atendimento.data_prevista).toLocaleDateString('pt-BR')}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Responsável:</span>
                          <p className="font-medium">{atendimento.funcionario_responsavel || 'Não atribuído'}</p>
                        </div>
                      </div>

                      {atendimento.localizacao && (
                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                          <MapPin className="h-4 w-4" />
                          {atendimento.localizacao.endereco} - {atendimento.localizacao.bairro}
                        </div>
                      )}

                      {atendimento.material_educativo && atendimento.material_educativo.length > 0 && (
                        <div className="mb-3">
                          <p className="text-sm text-gray-600 mb-1">Material Educativo Fornecido:</p>
                          <div className="flex flex-wrap gap-2">
                            {atendimento.material_educativo.map((material, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {material}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-4">
                          <Badge variant="outline" className="capitalize">
                            {atendimento.tipo_solicitacao.replace('_', ' ')}
                          </Badge>
                          <Badge variant="outline" className={`${atendimento.impacto_estimado === 'alto' ? 'border-red-300 text-red-700' :
                            atendimento.impacto_estimado === 'medio' ? 'border-yellow-300 text-yellow-700' : 'border-green-300 text-green-700'}`}>
                            Impacto {atendimento.impacto_estimado}
                          </Badge>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-2" />
                            Visualizar
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4 mr-2" />
                            Editar
                          </Button>
                          <Button variant="outline" size="sm">
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Comunicar
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
                <CardTitle className="text-sm font-medium">Total Atendimentos</CardTitle>
                <Leaf className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">245</div>
                <p className="text-xs text-muted-foreground">+12% desde o mês passado</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Em Andamento</CardTitle>
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">58</div>
                <p className="text-xs text-muted-foreground">23% do total</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Concluídos</CardTitle>
                <CheckCircle className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">187</div>
                <p className="text-xs text-muted-foreground">76% do total</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tempo Médio</CardTitle>
                <CalendarIcon className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">5.2 dias</div>
                <p className="text-xs text-muted-foreground">-0.8 dias desde o mês passado</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Atendimentos por Tipo</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={dadosAtendimentosPorMes}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mes" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="orientacao" name="Orientação" fill="#8884d8" />
                    <Bar dataKey="educacao" name="Educação" fill="#82ca9d" />
                    <Bar dataKey="apoio" name="Apoio" fill="#ffc658" />
                    <Bar dataKey="informacoes" name="Informações" fill="#ff7300" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Distribuição por Área Ambiental</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={dadosAreaAmbiental}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ area, quantidade }) => `${area}: ${quantidade}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="quantidade"
                    >
                      {dadosAreaAmbiental.map((entry, index) => (
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
                <CardTitle>Status dos Atendimentos</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={dadosStatusAtendimentos}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="status" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="quantidade" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Evolução Mensal</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={dadosAtendimentosPorMes}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mes" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="orientacao" stroke="#8884d8" strokeWidth={2} />
                    <Line type="monotone" dataKey="educacao" stroke="#82ca9d" strokeWidth={2} />
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
                <ShieldCheck className="h-5 w-5 text-green-600" />
                Serviços Gerados Automaticamente
              </CardTitle>
              <CardDescription>
                Serviços do catálogo público gerados pelas funcionalidades internas dos atendimentos ambientais
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
                          <span className="text-gray-600">Categoria:</span>
                          <Badge variant="outline" className="capitalize">
                            {servico.categoria}
                          </Badge>
                        </div>
                        <div className="text-sm">
                          <span className="text-gray-600">Protocolo:</span>
                          <p className="text-xs mt-1 text-gray-500">{servico.protocolo_base}</p>
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
                Como os atendimentos ambientais geram automaticamente serviços para o catálogo público
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
                  <h4 className="font-medium text-green-900 mb-2">Atendimentos Ambientais → Serviços Públicos</h4>
                  <ul className="text-sm text-green-800 space-y-1">
                    <li>• <strong>Orientação Ambiental:</strong> Consultas sobre questões ambientais diversas</li>
                    <li>• <strong>Educação Ambiental:</strong> Programas educacionais para escolas e comunidades</li>
                    <li>• <strong>Apoio Sustentável:</strong> Suporte técnico para projetos sustentáveis</li>
                    <li>• <strong>Informações Ecológicas:</strong> Base de conhecimento ambiental local</li>
                  </ul>
                </div>

                <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                  <h4 className="font-medium text-blue-900 mb-2">Fluxo de Protocolos</h4>
                  <p className="text-sm text-blue-800">
                    Cidadão solicita "Orientação Ambiental" → Protocolo criado → Análise técnica →
                    Orientação fornecida → Material educativo → Acompanhamento
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
                <CardTitle className="text-base">Relatório de Atendimentos</CardTitle>
                <CardDescription>Dados consolidados dos atendimentos ambientais</CardDescription>
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
                <CardTitle className="text-base">Relatório por Área</CardTitle>
                <CardDescription>Distribuição por área ambiental</CardDescription>
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
                <CardTitle className="text-base">Relatório de Eficiência</CardTitle>
                <CardDescription>Métricas de tempo e resolução</CardDescription>
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