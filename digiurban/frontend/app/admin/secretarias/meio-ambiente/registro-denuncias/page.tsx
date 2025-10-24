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
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area } from 'recharts'
import { useAdminAuth } from '@/hooks/useAdminAuth'
import { Plus, Search, Filter, Download, Eye, Edit, AlertTriangle, Shield, MapPin, Camera, FileText, Calendar, Clock, CheckCircle, XCircle, Flag, Phone, Mail } from 'lucide-react'

interface DenunciaAmbiental {
  id: string
  protocolo: string
  tipo_denuncia: 'poluicao_ar' | 'poluicao_agua' | 'poluicao_sonora' | 'desmatamento' | 'queimada' | 'descarte_irregular' | 'construcao_irregular' | 'maus_tratos_animais' | 'outras'
  categoria: 'flora' | 'fauna' | 'recursos_hidricos' | 'poluicao' | 'solo' | 'residuos' | 'construcao' | 'outros'
  denunciante: {
    nome?: string
    cpf?: string
    telefone?: string
    email?: string
    endereco?: string
    anonima: boolean
  }
  local_ocorrencia: {
    endereco: string
    coordenadas?: string
    bairro: string
    ponto_referencia?: string
    descricao_acesso: string
  }
  descricao: string
  data_ocorrencia: string
  data_denuncia: string
  urgencia: 'baixa' | 'media' | 'alta' | 'critica'
  status: 'recebida' | 'em_analise' | 'vistoria_agendada' | 'em_fiscalizacao' | 'autuacao_lavrada' | 'em_recuperacao' | 'resolvida' | 'improcedente' | 'arquivada'
  prioridade: 'baixa' | 'normal' | 'alta' | 'urgente'
  fiscal_responsavel?: string
  evidencias: {
    fotos: string[]
    videos: string[]
    documentos: string[]
  }
  vistoria?: {
    data: string
    fiscal: string
    constatacao: string
    fotos_vistoria: string[]
    medidas_tomadas: string
  }
  autuacao?: {
    numero_auto: string
    data_lavratura: string
    valor_multa: number
    infrator: string
    cpf_cnpj_infrator: string
    prazo_defesa: string
    situacao: 'ativa' | 'contestada' | 'paga' | 'cancelada'
  }
  recuperacao?: {
    plano_recuperacao: string
    prazo_execucao: string
    acompanhamento: string[]
    percentual_executado: number
  }
  observacoes: string
  impacto_ambiental: 'baixo' | 'medio' | 'alto' | 'critico'
  historico_acompanhamento: {
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
  tipo: 'denuncia_ambiental' | 'fiscalizacao_verde' | 'autuacao_ambiental' | 'recuperacao_area'
  categoria: 'denuncia' | 'fiscalizacao' | 'autuacao' | 'recuperacao'
  protocolo_base: string
  ativo: boolean
}

export default function RegistroDenuncias() {
  const { user } = useAdminAuth()
  const [filtroStatus, setFiltroStatus] = useState<string>('todos')
  const [filtroTipo, setFiltroTipo] = useState<string>('todos')
  const [filtroUrgencia, setFiltroUrgencia] = useState<string>('todos')
  const [busca, setBusca] = useState('')
  const [novaDenuncia, setNovaDenuncia] = useState<Partial<DenunciaAmbiental>>({})
  const [showNovaDenuncia, setShowNovaDenuncia] = useState(false)

  const denuncias: DenunciaAmbiental[] = [
    {
      id: '1',
      protocolo: 'DA-2024-001',
      tipo_denuncia: 'poluicao_agua',
      categoria: 'recursos_hidricos',
      denunciante: {
        nome: 'Maria Silva',
        cpf: '123.456.789-00',
        telefone: '(11) 99999-9999',
        email: 'maria@email.com',
        endereco: 'Rua da Fonte, 100 - Centro',
        anonima: false
      },
      local_ocorrencia: {
        endereco: 'Córrego das Águas, próximo à Fábrica ABC',
        coordenadas: '-23.5505, -46.6333',
        bairro: 'Distrito Industrial',
        ponto_referencia: 'Ponte do Distrito Industrial',
        descricao_acesso: 'Acesso pela Av. Industrial, seguir pela estrada de terra'
      },
      descricao: 'Despejo de efluentes industriais no córrego, causando coloração escura e odor forte na água',
      data_ocorrencia: '2024-01-15',
      data_denuncia: '2024-01-16',
      urgencia: 'alta',
      status: 'autuacao_lavrada',
      prioridade: 'alta',
      fiscal_responsavel: 'João Santos',
      evidencias: {
        fotos: ['foto_poluicao_1.jpg', 'foto_poluicao_2.jpg'],
        videos: ['video_despejo.mp4'],
        documentos: ['laudo_analise_agua.pdf']
      },
      vistoria: {
        data: '2024-01-18',
        fiscal: 'João Santos',
        constatacao: 'Confirmado despejo irregular de efluentes industriais sem tratamento',
        fotos_vistoria: ['vistoria_1.jpg', 'vistoria_2.jpg'],
        medidas_tomadas: 'Coleta de amostras de água para análise laboratorial'
      },
      autuacao: {
        numero_auto: 'AI-2024-0001',
        data_lavratura: '2024-01-20',
        valor_multa: 50000,
        infrator: 'Fábrica ABC Ltda',
        cpf_cnpj_infrator: '12.345.678/0001-99',
        prazo_defesa: '2024-02-20',
        situacao: 'ativa'
      },
      observacoes: 'Empresa já havia sido notificada anteriormente',
      impacto_ambiental: 'alto',
      historico_acompanhamento: [
        { data: '2024-01-16', status: 'Recebida', responsavel: 'Sistema', observacao: 'Denúncia protocolada' },
        { data: '2024-01-17', status: 'Em análise', responsavel: 'João Santos', observacao: 'Análise inicial da denúncia' },
        { data: '2024-01-18', status: 'Em fiscalização', responsavel: 'João Santos', observacao: 'Vistoria de campo realizada' },
        { data: '2024-01-20', status: 'Autuação lavrada', responsavel: 'João Santos', observacao: 'Auto de infração lavrado' }
      ]
    },
    {
      id: '2',
      protocolo: 'DA-2024-002',
      tipo_denuncia: 'desmatamento',
      categoria: 'flora',
      denunciante: {
        anonima: true
      },
      local_ocorrencia: {
        endereco: 'Chácara São José, Estrada Velha, Km 15',
        bairro: 'Zona Rural',
        ponto_referencia: 'Próximo ao sítio do Sr. Antonio',
        descricao_acesso: 'Estrada de terra, cerca de 2km da rodovia principal'
      },
      descricao: 'Derrubada de árvores nativas em área de preservação permanente para plantio de eucalipto',
      data_ocorrencia: '2024-01-20',
      data_denuncia: '2024-01-21',
      urgencia: 'critica',
      status: 'vistoria_agendada',
      prioridade: 'urgente',
      fiscal_responsavel: 'Maria Costa',
      evidencias: {
        fotos: ['desmatamento_1.jpg', 'desmatamento_2.jpg'],
        videos: [],
        documentos: []
      },
      observacoes: 'Área próxima a nascente de água',
      impacto_ambiental: 'critico',
      historico_acompanhamento: [
        { data: '2024-01-21', status: 'Recebida', responsavel: 'Sistema', observacao: 'Denúncia anônima protocolada' },
        { data: '2024-01-22', status: 'Em análise', responsavel: 'Maria Costa', observacao: 'Análise de urgência - APP comprometida' },
        { data: '2024-01-23', status: 'Vistoria agendada', responsavel: 'Maria Costa', observacao: 'Vistoria emergencial agendada' }
      ]
    },
    {
      id: '3',
      protocolo: 'DA-2024-003',
      tipo_denuncia: 'poluicao_sonora',
      categoria: 'poluicao',
      denunciante: {
        nome: 'Carlos Lima',
        cpf: '987.654.321-00',
        telefone: '(11) 88888-8888',
        email: 'carlos@email.com',
        endereco: 'Rua Silenciosa, 456 - Vila Tranquila',
        anonima: false
      },
      local_ocorrencia: {
        endereco: 'Bar do João, Av. Principal, 789',
        bairro: 'Vila Tranquila',
        ponto_referencia: 'Em frente à escola municipal',
        descricao_acesso: 'Av. Principal, esquina com Rua da Igreja'
      },
      descricao: 'Som alto durante madrugada, ultrapassando limites permitidos e perturbando vizinhança',
      data_ocorrencia: '2024-01-22',
      data_denuncia: '2024-01-23',
      urgencia: 'media',
      status: 'resolvida',
      prioridade: 'normal',
      fiscal_responsavel: 'Pedro Oliveira',
      evidencias: {
        fotos: ['estabelecimento.jpg'],
        videos: ['video_som_alto.mp4'],
        documentos: ['medicao_ruido.pdf']
      },
      vistoria: {
        data: '2024-01-24',
        fiscal: 'Pedro Oliveira',
        constatacao: 'Confirmado excesso de ruído durante período noturno',
        fotos_vistoria: ['medicao_1.jpg'],
        medidas_tomadas: 'Orientação ao estabelecimento e medição de decibéis'
      },
      observacoes: 'Proprietário se comprometeu a reduzir volume após 22h',
      impacto_ambiental: 'baixo',
      historico_acompanhamento: [
        { data: '2024-01-23', status: 'Recebida', responsavel: 'Sistema', observacao: 'Denúncia protocolada' },
        { data: '2024-01-24', status: 'Em fiscalização', responsavel: 'Pedro Oliveira', observacao: 'Vistoria noturna realizada' },
        { data: '2024-01-25', status: 'Resolvida', responsavel: 'Pedro Oliveira', observacao: 'Problema solucionado com orientação' }
      ]
    }
  ]

  const servicosGerados: ServicoGerado[] = [
    {
      id: '1',
      nome: 'Denúncia Ambiental',
      descricao: 'Canal para registro de denúncias sobre crimes e infrações ambientais',
      tipo: 'denuncia_ambiental',
      categoria: 'denuncia',
      protocolo_base: 'Denúncia → Vistoria → Autuação → Recuperação → Acompanhamento',
      ativo: true
    },
    {
      id: '2',
      nome: 'Fiscalização Verde',
      descricao: 'Solicitação de fiscalização ambiental em área específica',
      tipo: 'fiscalizacao_verde',
      categoria: 'fiscalizacao',
      protocolo_base: 'Denúncia → Vistoria → Autuação → Recuperação → Acompanhamento',
      ativo: true
    },
    {
      id: '3',
      nome: 'Autuação Ambiental',
      descricao: 'Informações sobre autos de infração ambientais',
      tipo: 'autuacao_ambiental',
      categoria: 'autuacao',
      protocolo_base: 'Denúncia → Vistoria → Autuação → Recuperação → Acompanhamento',
      ativo: true
    },
    {
      id: '4',
      nome: 'Recuperação de Área',
      descricao: 'Acompanhamento de medidas de recuperação ambiental',
      tipo: 'recuperacao_area',
      categoria: 'recuperacao',
      protocolo_base: 'Denúncia → Vistoria → Autuação → Recuperação → Acompanhamento',
      ativo: true
    }
  ]

  const dadosDenunciasPorMes = [
    { mes: 'Jul', poluicao: 15, desmatamento: 8, residuos: 12, outros: 5 },
    { mes: 'Ago', poluicao: 18, desmatamento: 6, residuos: 15, outros: 8 },
    { mes: 'Set', poluicao: 22, desmatamento: 10, residuos: 18, outros: 6 },
    { mes: 'Out', poluicao: 25, desmatamento: 12, residuos: 20, outros: 10 },
    { mes: 'Nov', poluicao: 28, desmatamento: 8, residuos: 22, outros: 12 },
    { mes: 'Dez', poluicao: 30, desmatamento: 15, residuos: 25, outros: 8 }
  ]

  const dadosTipoDenuncia = [
    { tipo: 'Poluição da Água', quantidade: 42, cor: '#8884d8' },
    { tipo: 'Descarte Irregular', quantidade: 38, cor: '#82ca9d' },
    { tipo: 'Desmatamento', quantidade: 28, cor: '#ffc658' },
    { tipo: 'Poluição Sonora', quantidade: 25, cor: '#ff7300' },
    { tipo: 'Poluição do Ar', quantidade: 18, cor: '#00C49F' },
    { tipo: 'Queimadas', quantidade: 12, cor: '#FFBB28' }
  ]

  const dadosStatusDenuncia = [
    { status: 'Recebida', quantidade: 25 },
    { status: 'Em Análise', quantidade: 18 },
    { status: 'Em Fiscalização', quantidade: 15 },
    { status: 'Autuação Lavrada', quantidade: 12 },
    { status: 'Resolvida', quantidade: 35 },
    { status: 'Improcedente', quantidade: 8 }
  ]

  const getStatusBadge = (status: string) => {
    const variants = {
      'recebida': 'bg-blue-100 text-blue-800',
      'em_analise': 'bg-yellow-100 text-yellow-800',
      'vistoria_agendada': 'bg-purple-100 text-purple-800',
      'em_fiscalizacao': 'bg-indigo-100 text-indigo-800',
      'autuacao_lavrada': 'bg-orange-100 text-orange-800',
      'em_recuperacao': 'bg-cyan-100 text-cyan-800',
      'resolvida': 'bg-green-100 text-green-800',
      'improcedente': 'bg-gray-100 text-gray-800',
      'arquivada': 'bg-red-100 text-red-800'
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

  const getImpactoBadge = (impacto: string) => {
    const variants = {
      'baixo': 'bg-green-100 text-green-800',
      'medio': 'bg-yellow-100 text-yellow-800',
      'alto': 'bg-orange-100 text-orange-800',
      'critico': 'bg-red-100 text-red-800'
    }
    return variants[impacto as keyof typeof variants] || 'bg-gray-100 text-gray-800'
  }

  const filtrarDenuncias = denuncias.filter(denuncia => {
    const matchStatus = filtroStatus === 'todos' || denuncia.status === filtroStatus
    const matchTipo = filtroTipo === 'todos' || denuncia.tipo_denuncia === filtroTipo
    const matchUrgencia = filtroUrgencia === 'todos' || denuncia.urgencia === filtroUrgencia
    const matchBusca = busca === '' ||
      denuncia.protocolo.toLowerCase().includes(busca.toLowerCase()) ||
      denuncia.descricao.toLowerCase().includes(busca.toLowerCase()) ||
      denuncia.local_ocorrencia.endereco.toLowerCase().includes(busca.toLowerCase())

    return matchStatus && matchTipo && matchUrgencia && matchBusca
  })

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Registro de Denúncias</h1>
          <p className="text-gray-600 mt-1">Canal para denúncias de crimes ambientais e fiscalização</p>
        </div>
        <div className="flex gap-3">
          <Dialog open={showNovaDenuncia} onOpenChange={setShowNovaDenuncia}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nova Denúncia
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Nova Denúncia Ambiental</DialogTitle>
                <DialogDescription>
                  Registrar nova denúncia de infração ou crime ambiental
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Tipo de Denúncia</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecionar tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="poluicao_agua">Poluição da Água</SelectItem>
                      <SelectItem value="poluicao_ar">Poluição do Ar</SelectItem>
                      <SelectItem value="poluicao_sonora">Poluição Sonora</SelectItem>
                      <SelectItem value="desmatamento">Desmatamento</SelectItem>
                      <SelectItem value="queimada">Queimada</SelectItem>
                      <SelectItem value="descarte_irregular">Descarte Irregular</SelectItem>
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
                  <label className="text-sm font-medium">Local da Ocorrência</label>
                  <Input placeholder="Endereço completo ou ponto de referência" />
                </div>
                <div>
                  <label className="text-sm font-medium">Bairro</label>
                  <Input placeholder="Nome do bairro" />
                </div>
                <div>
                  <label className="text-sm font-medium">Data da Ocorrência</label>
                  <Input type="date" />
                </div>
                <div className="col-span-2">
                  <label className="text-sm font-medium">Descrição da Denúncia</label>
                  <Textarea placeholder="Descrição detalhada da infração ambiental" />
                </div>
                <div className="col-span-2">
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="anonima" />
                    <label htmlFor="anonima" className="text-sm font-medium">Denúncia anônima</label>
                  </div>
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <Button className="flex-1">Registrar Denúncia</Button>
                <Button variant="outline" onClick={() => setShowNovaDenuncia(false)}>
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

      <Tabs defaultValue="denuncias" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="denuncias">Denúncias</TabsTrigger>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="servicos">Serviços Gerados</TabsTrigger>
          <TabsTrigger value="relatorios">Relatórios</TabsTrigger>
        </TabsList>

        <TabsContent value="denuncias" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Lista de Denúncias Ambientais</CardTitle>
                <div className="flex gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Buscar por protocolo, descrição ou local..."
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
                      <SelectItem value="recebida">Recebida</SelectItem>
                      <SelectItem value="em_analise">Em Análise</SelectItem>
                      <SelectItem value="em_fiscalizacao">Em Fiscalização</SelectItem>
                      <SelectItem value="resolvida">Resolvida</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={filtroTipo} onValueChange={setFiltroTipo}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos os tipos</SelectItem>
                      <SelectItem value="poluicao_agua">Poluição da Água</SelectItem>
                      <SelectItem value="desmatamento">Desmatamento</SelectItem>
                      <SelectItem value="poluicao_sonora">Poluição Sonora</SelectItem>
                      <SelectItem value="descarte_irregular">Descarte Irregular</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filtrarDenuncias.map((denuncia) => (
                  <Card key={denuncia.id} className="border-l-4 border-l-red-500">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-medium text-lg">{denuncia.tipo_denuncia.replace('_', ' ')}</h3>
                            <Badge className="text-xs">{denuncia.protocolo}</Badge>
                            {denuncia.denunciante.anonima && (
                              <Badge variant="outline" className="text-xs">
                                Anônima
                              </Badge>
                            )}
                          </div>
                          {!denuncia.denunciante.anonima && denuncia.denunciante.nome && (
                            <p className="text-gray-600 mb-1">
                              Denunciante: {denuncia.denunciante.nome} - {denuncia.denunciante.cpf}
                            </p>
                          )}
                          <p className="text-sm text-gray-500 mb-3">{denuncia.descricao}</p>
                        </div>
                        <div className="flex gap-2">
                          <Badge className={getStatusBadge(denuncia.status)}>
                            {denuncia.status.replace('_', ' ')}
                          </Badge>
                          <Badge className={getUrgenciaBadge(denuncia.urgencia)}>
                            {denuncia.urgencia}
                          </Badge>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                        <div>
                          <span className="text-gray-600">Categoria:</span>
                          <p className="font-medium capitalize">{denuncia.categoria.replace('_', ' ')}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Data Ocorrência:</span>
                          <p className="font-medium">{new Date(denuncia.data_ocorrencia).toLocaleDateString('pt-BR')}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Data Denúncia:</span>
                          <p className="font-medium">{new Date(denuncia.data_denuncia).toLocaleDateString('pt-BR')}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Fiscal:</span>
                          <p className="font-medium">{denuncia.fiscal_responsavel || 'Não atribuído'}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                        <MapPin className="h-4 w-4" />
                        {denuncia.local_ocorrencia.endereco} - {denuncia.local_ocorrencia.bairro}
                        {denuncia.local_ocorrencia.ponto_referencia && (
                          <span className="text-gray-500">({denuncia.local_ocorrencia.ponto_referencia})</span>
                        )}
                      </div>

                      {denuncia.evidencias.fotos.length > 0 && (
                        <div className="mb-3">
                          <p className="text-sm text-gray-600 mb-1">Evidências:</p>
                          <div className="flex flex-wrap gap-2">
                            {denuncia.evidencias.fotos.map((foto, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                <Camera className="h-3 w-3 mr-1" />
                                {foto}
                              </Badge>
                            ))}
                            {denuncia.evidencias.videos.map((video, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                <FileText className="h-3 w-3 mr-1" />
                                {video}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {denuncia.vistoria && (
                        <div className="mb-3 p-3 bg-blue-50 rounded-lg">
                          <h4 className="font-medium text-sm text-blue-900 mb-2">Vistoria Realizada</h4>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                              <span className="text-blue-700">Data:</span>
                              <p className="font-medium">{new Date(denuncia.vistoria.data).toLocaleDateString('pt-BR')}</p>
                            </div>
                            <div>
                              <span className="text-blue-700">Fiscal:</span>
                              <p className="font-medium">{denuncia.vistoria.fiscal}</p>
                            </div>
                          </div>
                          <div className="mt-2">
                            <span className="text-blue-700 text-sm">Constatação:</span>
                            <p className="text-sm">{denuncia.vistoria.constatacao}</p>
                          </div>
                        </div>
                      )}

                      {denuncia.autuacao && (
                        <div className="mb-3 p-3 bg-orange-50 rounded-lg">
                          <h4 className="font-medium text-sm text-orange-900 mb-2">Autuação</h4>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                            <div>
                              <span className="text-orange-700">Auto Nº:</span>
                              <p className="font-medium">{denuncia.autuacao.numero_auto}</p>
                            </div>
                            <div>
                              <span className="text-orange-700">Multa:</span>
                              <p className="font-medium">R$ {denuncia.autuacao.valor_multa.toLocaleString()}</p>
                            </div>
                            <div>
                              <span className="text-orange-700">Infrator:</span>
                              <p className="font-medium">{denuncia.autuacao.infrator}</p>
                            </div>
                            <div>
                              <span className="text-orange-700">Situação:</span>
                              <Badge className={denuncia.autuacao.situacao === 'ativa' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}>
                                {denuncia.autuacao.situacao}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-4">
                          <Badge className={getImpactoBadge(denuncia.impacto_ambiental)}>
                            Impacto {denuncia.impacto_ambiental}
                          </Badge>
                          <span className="text-sm text-gray-600">{denuncia.observacoes}</span>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-2" />
                            Detalhes
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4 mr-2" />
                            Atualizar
                          </Button>
                          <Button variant="outline" size="sm">
                            <Shield className="h-4 w-4 mr-2" />
                            Fiscalizar
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
                <CardTitle className="text-sm font-medium">Total Denúncias</CardTitle>
                <Flag className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">342</div>
                <p className="text-xs text-muted-foreground">+25% desde o mês passado</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Em Análise</CardTitle>
                <Clock className="h-4 w-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">68</div>
                <p className="text-xs text-muted-foreground">20% do total</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Resolvidas</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">245</div>
                <p className="text-xs text-muted-foreground">72% do total</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tempo Médio</CardTitle>
                <Calendar className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">8.5 dias</div>
                <p className="text-xs text-muted-foreground">-1.2 dias desde o mês passado</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Denúncias por Tipo</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={dadosDenunciasPorMes}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mes" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="poluicao" name="Poluição" fill="#8884d8" />
                    <Bar dataKey="desmatamento" name="Desmatamento" fill="#82ca9d" />
                    <Bar dataKey="residuos" name="Resíduos" fill="#ffc658" />
                    <Bar dataKey="outros" name="Outros" fill="#ff7300" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Distribuição por Categoria</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={dadosTipoDenuncia}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ tipo, quantidade }) => `${tipo}: ${quantidade}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="quantidade"
                    >
                      {dadosTipoDenuncia.map((entry, index) => (
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
                <CardTitle>Status das Denúncias</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={dadosStatusDenuncia}>
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
                <CardTitle>Evolução Temporal</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={dadosDenunciasPorMes}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mes" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="poluicao" stackId="1" stroke="#8884d8" fill="#8884d8" />
                    <Area type="monotone" dataKey="desmatamento" stackId="1" stroke="#82ca9d" fill="#82ca9d" />
                    <Area type="monotone" dataKey="residuos" stackId="1" stroke="#ffc658" fill="#ffc658" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="servicos" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Flag className="h-5 w-5 text-red-600" />
                Serviços Gerados Automaticamente
              </CardTitle>
              <CardDescription>
                Serviços do catálogo público gerados pelas funcionalidades internas do registro de denúncias
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {servicosGerados.map((servico) => (
                  <Card key={servico.id} className="border-l-4 border-l-red-500">
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
                Como o sistema de denúncias gera automaticamente serviços para o catálogo público
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-red-50 rounded-lg border-l-4 border-red-500">
                  <h4 className="font-medium text-red-900 mb-2">Denúncias Ambientais → Serviços Públicos</h4>
                  <ul className="text-sm text-red-800 space-y-1">
                    <li>• <strong>Denúncia Ambiental:</strong> Canal para registro de infrações ambientais</li>
                    <li>• <strong>Fiscalização Verde:</strong> Solicitação de fiscalização em locais específicos</li>
                    <li>• <strong>Autuação Ambiental:</strong> Consulta sobre autos de infração</li>
                    <li>• <strong>Recuperação de Área:</strong> Acompanhamento de medidas de recuperação</li>
                  </ul>
                </div>

                <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                  <h4 className="font-medium text-blue-900 mb-2">Fluxo de Protocolos</h4>
                  <p className="text-sm text-blue-800">
                    Cidadão registra "Denúncia Ambiental" → Protocolo criado → Análise da denúncia →
                    Vistoria de campo → Autuação (se necessário) → Recuperação → Acompanhamento
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
                <CardTitle className="text-base">Relatório de Denúncias</CardTitle>
                <CardDescription>Dados consolidados das denúncias ambientais</CardDescription>
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
                <CardTitle className="text-base">Relatório de Fiscalização</CardTitle>
                <CardDescription>Atividades de fiscalização realizadas</CardDescription>
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
                <CardTitle className="text-base">Relatório de Autuações</CardTitle>
                <CardDescription>Autos de infração lavrados</CardDescription>
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