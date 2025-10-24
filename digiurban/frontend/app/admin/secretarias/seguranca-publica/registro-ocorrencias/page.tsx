'use client'

import { useState } from 'react'
import { useAdminAuth } from '@/hooks/useAdminAuth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import {
  FileText,
  Plus,
  Search,
  Filter,
  Download,
  AlertTriangle,
  Clock,
  MapPin,
  User,
  Calendar,
  Phone,
  Shield,
  Camera,
  Paperclip,
  Zap
} from 'lucide-react'

interface RegistroOcorrencia {
  id: string
  numeroBO: string
  tipoOcorrencia: 'Furto' | 'Roubo' | 'Perturbação do Sossego' | 'Violência Doméstica' | 'Dano ao Patrimônio' | 'Ameaça' | 'Lesão Corporal' | 'Tráfico de Drogas' | 'Outros'
  gravidade: 'Leve' | 'Moderada' | 'Grave' | 'Gravíssima'
  status: 'Registrado' | 'Em Investigação' | 'Aguardando Documentos' | 'Encaminhado' | 'Concluído' | 'Arquivado'
  comunicante: {
    nome: string
    cpf?: string
    telefone: string
    endereco: string
    bairro: string
    relacionamento: 'Vítima' | 'Testemunha' | 'Terceiro' | 'Anônimo'
  }
  vitima?: {
    nome: string
    cpf?: string
    telefone?: string
    endereco?: string
    idade?: number
    genero?: 'Masculino' | 'Feminino' | 'Outro'
  }
  suspeito?: {
    nome?: string
    descricao: string
    caracteristicas?: string
    veiculoEnvolvido?: string
  }
  local: {
    endereco: string
    bairro: string
    pontoReferencia?: string
    coordenadas?: string
    tipoLocal: 'Residencial' | 'Comercial' | 'Via Pública' | 'Escola' | 'Hospital' | 'Outros'
  }
  dataOcorrencia: string
  horaOcorrencia: string
  dataRegistro: string
  horaRegistro: string
  relatoOcorrencia: string
  evidencias?: string[]
  testemunhas?: Array<{
    nome: string
    telefone: string
    relato: string
  }>
  encaminhamentos?: string[]
  observacoes?: string
  responsavel: string
  delegaciaComunicada?: boolean
  processoJudicial?: string
}

const mockOcorrencias: RegistroOcorrencia[] = [
  {
    id: '1',
    numeroBO: 'BO-2024-001',
    tipoOcorrencia: 'Furto',
    gravidade: 'Moderada',
    status: 'Em Investigação',
    comunicante: {
      nome: 'João Silva Santos',
      cpf: '123.456.789-00',
      telefone: '(11) 98765-4321',
      endereco: 'Rua das Flores, 123',
      bairro: 'Centro',
      relacionamento: 'Vítima'
    },
    vitima: {
      nome: 'João Silva Santos',
      cpf: '123.456.789-00',
      telefone: '(11) 98765-4321',
      endereco: 'Rua das Flores, 123',
      idade: 45,
      genero: 'Masculino'
    },
    suspeito: {
      descricao: 'Indivíduo do sexo masculino, aproximadamente 25 anos',
      caracteristicas: 'Altura média, cabelo escuro, usando camiseta preta',
      veiculoEnvolvido: 'Motocicleta vermelha sem placa identificada'
    },
    local: {
      endereco: 'Rua das Flores, 123',
      bairro: 'Centro',
      pontoReferencia: 'Em frente ao mercado São José',
      coordenadas: '-23.550520, -46.633309',
      tipoLocal: 'Comercial'
    },
    dataOcorrencia: '2024-01-15',
    horaOcorrencia: '14:30',
    dataRegistro: '2024-01-15',
    horaRegistro: '15:45',
    relatoOcorrencia: 'A vítima relata que estava saindo do estabelecimento comercial quando foi abordada por um indivíduo que subtraiu sua carteira contendo documentos e R$ 200,00 em espécie.',
    evidencias: ['Imagens de câmera de segurança', 'Depoimento de testemunhas'],
    testemunhas: [
      {
        nome: 'Maria dos Santos',
        telefone: '(11) 91234-5678',
        relato: 'Viu o momento do furto e tentou ajudar a vítima'
      }
    ],
    encaminhamentos: ['Delegacia Civil', 'Investigação da Guarda Municipal'],
    responsavel: 'GCM Carlos Lima',
    delegaciaComunicada: true
  },
  {
    id: '2',
    numeroBO: 'BO-2024-002',
    tipoOcorrencia: 'Perturbação do Sossego',
    gravidade: 'Leve',
    status: 'Concluído',
    comunicante: {
      nome: 'Ana Costa Lima',
      telefone: '(11) 91234-5678',
      endereco: 'Av. Principal, 456',
      bairro: 'Vila Nova',
      relacionamento: 'Terceiro'
    },
    local: {
      endereco: 'Av. Principal, 456',
      bairro: 'Vila Nova',
      pontoReferencia: 'Próximo ao posto de gasolina',
      tipoLocal: 'Via Pública'
    },
    dataOcorrencia: '2024-01-14',
    horaOcorrencia: '22:15',
    dataRegistro: '2024-01-14',
    horaRegistro: '22:30',
    relatoOcorrencia: 'Denúncia de perturbação do sossego com música alta e aglomeração em via pública durante período noturno.',
    observacoes: 'Situação resolvida com orientação aos responsáveis',
    responsavel: 'GCM João Silva',
    delegaciaComunicada: false
  }
]

export default function RegistroOcorrenciasPage() {
  const { user } = useAdminAuth()
  const [ocorrencias, setOcorrencias] = useState<RegistroOcorrencia[]>(mockOcorrencias)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [tipoFilter, setTipoFilter] = useState<string>('all')
  const [gravidadeFilter, setGravidadeFilter] = useState<string>('all')
  const [showNewOcorrenciaModal, setShowNewOcorrenciaModal] = useState(false)

  const filteredOcorrencias = ocorrencias.filter(ocorrencia => {
    const matchesSearch = ocorrencia.comunicante.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ocorrencia.numeroBO.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ocorrencia.tipoOcorrencia.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || ocorrencia.status === statusFilter
    const matchesTipo = tipoFilter === 'all' || ocorrencia.tipoOcorrencia === tipoFilter
    const matchesGravidade = gravidadeFilter === 'all' || ocorrencia.gravidade === gravidadeFilter
    return matchesSearch && matchesStatus && matchesTipo && matchesGravidade
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Registrado': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'Em Investigação': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'Aguardando Documentos': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'Encaminhado': return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'Concluído': return 'bg-green-100 text-green-800 border-green-200'
      case 'Arquivado': return 'bg-gray-100 text-gray-800 border-gray-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getGravidadeColor = (gravidade: string) => {
    switch (gravidade) {
      case 'Leve': return 'bg-green-100 text-green-800 border-green-200'
      case 'Moderada': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'Grave': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'Gravíssima': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const stats = {
    totalOcorrencias: ocorrencias.length,
    emInvestigacao: ocorrencias.filter(o => o.status === 'Em Investigação').length,
    concluidas: ocorrencias.filter(o => o.status === 'Concluído').length,
    graves: ocorrencias.filter(o => ['Grave', 'Gravíssima'].includes(o.gravidade)).length
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <FileText className="h-8 w-8 text-blue-600" />
            Registro de Ocorrências
          </h1>
          <p className="text-gray-600 mt-1">
            Sistema de boletins de ocorrência municipais e registros policiais
          </p>
        </div>
        <Button onClick={() => setShowNewOcorrenciaModal(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Nova Ocorrência
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Ocorrências</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOcorrencias}</div>
            <p className="text-xs text-muted-foreground">este mês</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Em Investigação</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.emInvestigacao}</div>
            <p className="text-xs text-muted-foreground">em andamento</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Concluídas</CardTitle>
            <Shield className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.concluidas}</div>
            <p className="text-xs text-muted-foreground">resolvidas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Graves</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.graves}</div>
            <p className="text-xs text-muted-foreground">alta prioridade</p>
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
                  placeholder="Buscar por comunicante, número BO ou tipo..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Status</SelectItem>
                <SelectItem value="Registrado">Registrado</SelectItem>
                <SelectItem value="Em Investigação">Em Investigação</SelectItem>
                <SelectItem value="Aguardando Documentos">Aguardando Documentos</SelectItem>
                <SelectItem value="Encaminhado">Encaminhado</SelectItem>
                <SelectItem value="Concluído">Concluído</SelectItem>
                <SelectItem value="Arquivado">Arquivado</SelectItem>
              </SelectContent>
            </Select>
            <Select value={tipoFilter} onValueChange={setTipoFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Tipos</SelectItem>
                <SelectItem value="Furto">Furto</SelectItem>
                <SelectItem value="Roubo">Roubo</SelectItem>
                <SelectItem value="Perturbação do Sossego">Perturbação do Sossego</SelectItem>
                <SelectItem value="Violência Doméstica">Violência Doméstica</SelectItem>
                <SelectItem value="Dano ao Patrimônio">Dano ao Patrimônio</SelectItem>
                <SelectItem value="Outros">Outros</SelectItem>
              </SelectContent>
            </Select>
            <Select value={gravidadeFilter} onValueChange={setGravidadeFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Gravidade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as Gravidades</SelectItem>
                <SelectItem value="Leve">Leve</SelectItem>
                <SelectItem value="Moderada">Moderada</SelectItem>
                <SelectItem value="Grave">Grave</SelectItem>
                <SelectItem value="Gravíssima">Gravíssima</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6">
        {filteredOcorrencias.map((ocorrencia) => (
          <Card key={ocorrencia.id} className="overflow-hidden">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{ocorrencia.numeroBO}</CardTitle>
                  <CardDescription className="flex items-center gap-2 mt-1">
                    <FileText className="h-4 w-4" />
                    {ocorrencia.tipoOcorrencia}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Badge className={getGravidadeColor(ocorrencia.gravidade)}>
                    {ocorrencia.gravidade}
                  </Badge>
                  <Badge className={getStatusColor(ocorrencia.status)}>
                    {ocorrencia.status}
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
                      Comunicante
                    </h4>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p><strong>Nome:</strong> {ocorrencia.comunicante.nome}</p>
                      {ocorrencia.comunicante.cpf && (
                        <p><strong>CPF:</strong> {ocorrencia.comunicante.cpf}</p>
                      )}
                      <p><strong>Telefone:</strong> {ocorrencia.comunicante.telefone}</p>
                      <p><strong>Endereço:</strong> {ocorrencia.comunicante.endereco}</p>
                      <p><strong>Bairro:</strong> {ocorrencia.comunicante.bairro}</p>
                      <p><strong>Relacionamento:</strong> {ocorrencia.comunicante.relacionamento}</p>
                    </div>
                  </div>

                  {ocorrencia.vitima && (
                    <div>
                      <h4 className="font-medium text-sm text-gray-900 mb-2">
                        Vítima
                      </h4>
                      <div className="space-y-1 text-sm text-gray-600">
                        <p><strong>Nome:</strong> {ocorrencia.vitima.nome}</p>
                        {ocorrencia.vitima.idade && (
                          <p><strong>Idade:</strong> {ocorrencia.vitima.idade} anos</p>
                        )}
                        {ocorrencia.vitima.genero && (
                          <p><strong>Gênero:</strong> {ocorrencia.vitima.genero}</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-sm text-gray-900 mb-2 flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Local da Ocorrência
                    </h4>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p><strong>Endereço:</strong> {ocorrencia.local.endereco}</p>
                      <p><strong>Bairro:</strong> {ocorrencia.local.bairro}</p>
                      <p><strong>Tipo:</strong> {ocorrencia.local.tipoLocal}</p>
                      {ocorrencia.local.pontoReferencia && (
                        <p><strong>Referência:</strong> {ocorrencia.local.pontoReferencia}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-sm text-gray-900 mb-2 flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Data e Hora
                    </h4>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p><strong>Ocorrência:</strong> {new Date(ocorrencia.dataOcorrencia).toLocaleDateString('pt-BR')} às {ocorrencia.horaOcorrencia}</p>
                      <p><strong>Registro:</strong> {new Date(ocorrencia.dataRegistro).toLocaleDateString('pt-BR')} às {ocorrencia.horaRegistro}</p>
                      <p><strong>Responsável:</strong> {ocorrencia.responsavel}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {ocorrencia.suspeito && (
                    <div>
                      <h4 className="font-medium text-sm text-gray-900 mb-2">
                        Suspeito
                      </h4>
                      <div className="space-y-1 text-sm text-gray-600">
                        {ocorrencia.suspeito.nome && (
                          <p><strong>Nome:</strong> {ocorrencia.suspeito.nome}</p>
                        )}
                        <p><strong>Descrição:</strong> {ocorrencia.suspeito.descricao}</p>
                        {ocorrencia.suspeito.caracteristicas && (
                          <p><strong>Características:</strong> {ocorrencia.suspeito.caracteristicas}</p>
                        )}
                        {ocorrencia.suspeito.veiculoEnvolvido && (
                          <p><strong>Veículo:</strong> {ocorrencia.suspeito.veiculoEnvolvido}</p>
                        )}
                      </div>
                    </div>
                  )}

                  {ocorrencia.evidencias && ocorrencia.evidencias.length > 0 && (
                    <div>
                      <h4 className="font-medium text-sm text-gray-900 mb-2 flex items-center gap-2">
                        <Camera className="h-4 w-4" />
                        Evidências
                      </h4>
                      <div className="space-y-1 text-sm text-gray-600">
                        {ocorrencia.evidencias.map((evidencia, index) => (
                          <p key={index}>• {evidencia}</p>
                        ))}
                      </div>
                    </div>
                  )}

                  {ocorrencia.encaminhamentos && ocorrencia.encaminhamentos.length > 0 && (
                    <div>
                      <h4 className="font-medium text-sm text-gray-900 mb-2">
                        Encaminhamentos
                      </h4>
                      <div className="space-y-1 text-sm text-gray-600">
                        {ocorrencia.encaminhamentos.map((encaminhamento, index) => (
                          <p key={index}>• {encaminhamento}</p>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t">
                <h4 className="font-medium text-sm text-gray-900 mb-2">Relato da Ocorrência</h4>
                <p className="text-sm text-gray-600 mb-4">{ocorrencia.relatoOcorrencia}</p>

                {ocorrencia.testemunhas && ocorrencia.testemunhas.length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-medium text-sm text-gray-900 mb-2">Testemunhas</h4>
                    {ocorrencia.testemunhas.map((testemunha, index) => (
                      <div key={index} className="mb-2 p-2 bg-gray-50 rounded">
                        <p className="text-sm"><strong>{testemunha.nome}</strong> - {testemunha.telefone}</p>
                        <p className="text-sm text-gray-600">{testemunha.relato}</p>
                      </div>
                    ))}
                  </div>
                )}

                {ocorrencia.observacoes && (
                  <div className="mb-4">
                    <h4 className="font-medium text-sm text-gray-900 mb-2">Observações</h4>
                    <p className="text-sm text-gray-600">{ocorrencia.observacoes}</p>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 mt-4 pt-4 border-t">
                <Button variant="outline" size="sm">
                  <MapPin className="h-4 w-4 mr-1" />
                  Ver Local
                </Button>
                <Button variant="outline" size="sm">
                  <Paperclip className="h-4 w-4 mr-1" />
                  Anexos
                </Button>
                {ocorrencia.status !== 'Concluído' && ocorrencia.status !== 'Arquivado' && (
                  <Button size="sm">
                    <FileText className="h-4 w-4 mr-1" />
                    Atualizar
                  </Button>
                )}
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
              <h4 className="font-medium text-green-700 mb-2">Boletim de Ocorrência Municipal</h4>
              <p className="text-sm text-gray-600">
                Registro online de ocorrências de competência municipal como perturbação do sossego, danos ao patrimônio público e outros.
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium text-green-700 mb-2">Registro de Furto</h4>
              <p className="text-sm text-gray-600">
                Comunicação de furtos ocorridos no município para registro e investigação pela Guarda Municipal.
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium text-green-700 mb-2">Perturbação do Sossego</h4>
              <p className="text-sm text-gray-600">
                Denúncia online de perturbação do sossego público, ruído excessivo e outras infrações de ordem pública.
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium text-green-700 mb-2">Violência Doméstica</h4>
              <p className="text-sm text-gray-600">
                Canal seguro para registro de casos de violência doméstica com encaminhamento imediato aos órgãos competentes.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}