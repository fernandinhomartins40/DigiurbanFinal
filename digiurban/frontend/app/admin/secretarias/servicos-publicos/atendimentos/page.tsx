'use client'

import { useAdminAuth } from '@/contexts/AdminAuthContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Wrench,
  Lightbulb,
  Trash2,
  Camera,
  Users,
  MapPin,
  Phone,
  Clock,
  CheckCircle,
  AlertCircle,
  FileText,
  Calendar,
  User,
  Home,
  Plus,
  Search,
  Filter,
  Download,
  Activity
} from 'lucide-react'
import { useState } from 'react'

const atendimentosRecentes = [
  {
    id: 1,
    protocolo: 'SP-2024-0001',
    tipo: 'limpeza-publica',
    solicitante: 'Maria Silva Santos',
    telefone: '(11) 99999-0001',
    endereco: 'Rua das Flores, 123',
    bairro: 'Centro',
    descricao: 'Buraco na rua causando transtornos no trânsito',
    prioridade: 'alta',
    status: 'em-andamento',
    dataAbertura: '2024-01-20',
    previsao: '2024-01-25',
    equipe: 'Equipe A - Pavimentação'
  },
  {
    id: 2,
    protocolo: 'SP-2024-0002',
    tipo: 'iluminacao-publica',
    solicitante: 'João Carlos Lima',
    telefone: '(11) 99999-0002',
    endereco: 'Av. Principal, 456',
    bairro: 'Jardim das Flores',
    descricao: 'Poste de luz queimado há uma semana',
    prioridade: 'media',
    status: 'concluido',
    dataAbertura: '2024-01-18',
    previsao: '2024-01-22',
    equipe: 'Equipe B - Elétrica'
  },
  {
    id: 3,
    protocolo: 'SP-2024-0003',
    tipo: 'coleta-lixo',
    solicitante: 'Ana Costa Oliveira',
    telefone: '(11) 99999-0003',
    endereco: 'Rua Nova, 789',
    bairro: 'Vila Nova',
    descricao: 'Lixo acumulado há 3 dias, caminhão não passou',
    prioridade: 'alta',
    status: 'agendado',
    dataAbertura: '2024-01-22',
    previsao: '2024-01-23',
    equipe: 'Equipe C - Coleta'
  }
]

const tiposServicos = [
  {
    tipo: 'limpeza-publica',
    nome: 'Limpeza Pública',
    icon: Trash2,
    count: 28,
    cor: 'text-green-600'
  },
  {
    tipo: 'iluminacao-publica',
    nome: 'Iluminação Pública',
    icon: Lightbulb,
    count: 15,
    cor: 'text-yellow-600'
  },
  {
    tipo: 'pavimentacao',
    nome: 'Pavimentação',
    icon: Wrench,
    count: 12,
    cor: 'text-blue-600'
  },
  {
    tipo: 'poda-arvores',
    nome: 'Poda de Árvores',
    icon: Activity,
    count: 8,
    cor: 'text-green-600'
  },
  {
    tipo: 'coleta-lixo',
    nome: 'Coleta de Lixo',
    icon: Trash2,
    count: 22,
    cor: 'text-orange-600'
  },
  {
    tipo: 'manutencao-praca',
    nome: 'Manutenção de Praça',
    icon: Home,
    count: 6,
    cor: 'text-purple-600'
  }
]

const equipesDisponiveis = [
  {
    nome: 'Equipe A - Pavimentação',
    especialidade: 'Pavimentação e Asfalto',
    membros: 4,
    veiculo: 'Caminhão CP-001',
    status: 'disponivel',
    localizacao: 'Depósito Central'
  },
  {
    nome: 'Equipe B - Elétrica',
    especialidade: 'Iluminação Pública',
    membros: 3,
    veiculo: 'Van EL-002',
    status: 'em-campo',
    localizacao: 'Av. Principal'
  },
  {
    nome: 'Equipe C - Coleta',
    especialidade: 'Coleta e Limpeza',
    membros: 6,
    veiculo: 'Caminhão CL-003',
    status: 'disponivel',
    localizacao: 'Garagem Municipal'
  }
]

const servicosGerados = [
  'Solicitação de Limpeza Pública',
  'Reparo de Iluminação',
  'Coleta de Entulho',
  'Manutenção de Vias',
  'Poda de Árvores',
  'Limpeza de Bueiros',
  'Reparo de Calçadas'
]

export default function AtendimentosPage() {
  const { user } = useAdminAuth()
  const [novoAtendimento, setNovoAtendimento] = useState({
    solicitante: '',
    telefone: '',
    endereco: '',
    bairro: '',
    tipo: '',
    descricao: '',
    prioridade: 'media'
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'agendado':
        return <Badge className="bg-blue-500 text-white">Agendado</Badge>
      case 'em-andamento':
        return <Badge className="bg-yellow-500 text-white">Em Andamento</Badge>
      case 'concluido':
        return <Badge className="bg-green-500 text-white">Concluído</Badge>
      case 'cancelado':
        return <Badge variant="destructive">Cancelado</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getPrioridadeBadge = (prioridade: string) => {
    switch (prioridade) {
      case 'alta':
        return <Badge variant="destructive">Alta</Badge>
      case 'media':
        return <Badge className="bg-yellow-500 text-white">Média</Badge>
      case 'baixa':
        return <Badge variant="secondary">Baixa</Badge>
      default:
        return <Badge variant="outline">{prioridade}</Badge>
    }
  }

  const getEquipeStatusBadge = (status: string) => {
    switch (status) {
      case 'disponivel':
        return <Badge className="bg-green-500 text-white">Disponível</Badge>
      case 'em-campo':
        return <Badge className="bg-blue-500 text-white">Em Campo</Badge>
      case 'manutencao':
        return <Badge className="bg-yellow-500 text-white">Manutenção</Badge>
      case 'indisponivel':
        return <Badge variant="destructive">Indisponível</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getTipoServicoIcon = (tipo: string) => {
    const servico = tiposServicos.find(s => s.tipo === tipo)
    if (servico) {
      const IconComponent = servico.icon
      return <IconComponent className={`h-4 w-4 ${servico.cor}`} />
    }
    return <Wrench className="h-4 w-4 text-gray-600" />
  }

  const formatarData = (data: string) => {
    const date = new Date(data)
    return date.toLocaleDateString('pt-BR')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Wrench className="h-8 w-8 text-blue-600 mr-3" />
            Atendimentos - Serviços Públicos
          </h1>
          <p className="text-gray-600 mt-1">
            PDV para serviços urbanos, infraestrutura, limpeza e manutenção da cidade
          </p>
        </div>
        <Badge variant="outline" className="text-blue-600 border-blue-200">
          Serviços Urbanos
        </Badge>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Atendimentos Hoje</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18</div>
            <p className="text-xs text-muted-foreground">
              +3 vs ontem
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Em Andamento</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              Sendo executados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Concluídos</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">45</div>
            <p className="text-xs text-muted-foreground">
              Esta semana
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Equipes Ativas</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">6</div>
            <p className="text-xs text-muted-foreground">
              Operando na cidade
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Novo Atendimento */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Plus className="h-5 w-5 mr-2" />
              Novo Atendimento
            </CardTitle>
            <CardDescription>
              Registrar solicitação de serviço público
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="solicitante">Nome do Solicitante</Label>
              <Input
                id="solicitante"
                placeholder="Nome completo"
                value={novoAtendimento.solicitante}
                onChange={(e) => setNovoAtendimento(prev => ({ ...prev, solicitante: e.target.value }))}
              />
            </div>

            <div>
              <Label htmlFor="telefone">Telefone</Label>
              <Input
                id="telefone"
                placeholder="(11) 99999-9999"
                value={novoAtendimento.telefone}
                onChange={(e) => setNovoAtendimento(prev => ({ ...prev, telefone: e.target.value }))}
              />
            </div>

            <div>
              <Label htmlFor="endereco">Endereço</Label>
              <Input
                id="endereco"
                placeholder="Local do problema"
                value={novoAtendimento.endereco}
                onChange={(e) => setNovoAtendimento(prev => ({ ...prev, endereco: e.target.value }))}
              />
            </div>

            <div>
              <Label htmlFor="bairro">Bairro</Label>
              <Input
                id="bairro"
                placeholder="Nome do bairro"
                value={novoAtendimento.bairro}
                onChange={(e) => setNovoAtendimento(prev => ({ ...prev, bairro: e.target.value }))}
              />
            </div>

            <div>
              <Label htmlFor="tipo">Tipo de Serviço</Label>
              <Select value={novoAtendimento.tipo} onValueChange={(value) => setNovoAtendimento(prev => ({ ...prev, tipo: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  {tiposServicos.map((servico) => (
                    <SelectItem key={servico.tipo} value={servico.tipo}>
                      {servico.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="prioridade">Prioridade</Label>
              <Select value={novoAtendimento.prioridade} onValueChange={(value) => setNovoAtendimento(prev => ({ ...prev, prioridade: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="baixa">Baixa</SelectItem>
                  <SelectItem value="media">Média</SelectItem>
                  <SelectItem value="alta">Alta</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="descricao">Descrição do Problema</Label>
              <Textarea
                id="descricao"
                placeholder="Descreva detalhadamente o problema"
                value={novoAtendimento.descricao}
                onChange={(e) => setNovoAtendimento(prev => ({ ...prev, descricao: e.target.value }))}
                rows={3}
              />
            </div>

            <Button className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Registrar Atendimento
            </Button>
          </CardContent>
        </Card>

        {/* Atendimentos Recentes */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Atendimentos Recentes</CardTitle>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Search className="h-4 w-4 mr-2" />
                  Buscar
                </Button>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filtrar
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {atendimentosRecentes.map((atendimento) => (
                <div key={atendimento.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      {getTipoServicoIcon(atendimento.tipo)}
                      <div>
                        <h4 className="font-semibold">{atendimento.solicitante}</h4>
                        <p className="text-sm text-gray-600">{atendimento.protocolo}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getPrioridadeBadge(atendimento.prioridade)}
                      {getStatusBadge(atendimento.status)}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                    <div>
                      <span className="text-gray-500">Endereço:</span>
                      <p className="font-medium">{atendimento.endereco}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Bairro:</span>
                      <p className="font-medium">{atendimento.bairro}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Abertura:</span>
                      <p className="font-medium">{formatarData(atendimento.dataAbertura)}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Previsão:</span>
                      <p className="font-medium">{formatarData(atendimento.previsao)}</p>
                    </div>
                  </div>

                  <div className="text-sm mb-3">
                    <span className="text-gray-500">Descrição:</span>
                    <p className="text-gray-700">{atendimento.descricao}</p>
                  </div>

                  <div className="text-sm mb-3">
                    <span className="text-gray-500">Equipe responsável:</span>
                    <p className="font-medium">{atendimento.equipe}</p>
                  </div>

                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">
                      <MapPin className="h-4 w-4 mr-2" />
                      Localizar
                    </Button>
                    <Button size="sm" variant="outline">
                      <Phone className="h-4 w-4 mr-2" />
                      Contatar
                    </Button>
                    <Button size="sm" variant="outline">
                      <FileText className="h-4 w-4 mr-2" />
                      Detalhes
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tipos de Serviços */}
        <Card>
          <CardHeader>
            <CardTitle>Tipos de Serviços</CardTitle>
            <CardDescription>
              Estatísticas por categoria de atendimento
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {tiposServicos.map((servico) => (
                <div key={servico.tipo} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <servico.icon className={`h-5 w-5 ${servico.cor}`} />
                    <h4 className="font-medium">{servico.nome}</h4>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold text-lg ${servico.cor}`}>{servico.count}</p>
                    <p className="text-xs text-gray-500">este mês</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Equipes Disponíveis */}
        <Card>
          <CardHeader>
            <CardTitle>Equipes Disponíveis</CardTitle>
            <CardDescription>
              Status das equipes de campo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {equipesDisponiveis.map((equipe, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="font-semibold">{equipe.nome}</h4>
                      <p className="text-sm text-gray-600">{equipe.especialidade}</p>
                    </div>
                    {getEquipeStatusBadge(equipe.status)}
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm mb-2">
                    <div>
                      <span className="text-gray-500">Membros:</span>
                      <p className="font-medium">{equipe.membros} pessoas</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Veículo:</span>
                      <p className="font-medium">{equipe.veiculo}</p>
                    </div>
                  </div>

                  <div className="text-sm mb-3">
                    <span className="text-gray-500">Localização:</span>
                    <p className="font-medium">{equipe.localizacao}</p>
                  </div>

                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">
                      <MapPin className="h-4 w-4 mr-2" />
                      Rastrear
                    </Button>
                    <Button size="sm" variant="outline">
                      <Calendar className="h-4 w-4 mr-2" />
                      Agendar
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Serviços Gerados Automaticamente */}
      <Card>
        <CardHeader>
          <CardTitle>Serviços Gerados Automaticamente</CardTitle>
          <CardDescription>
            Funcionalidades desta página que se tornam serviços no catálogo público
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {servicosGerados.map((servico, index) => (
              <div key={index} className="flex items-center p-3 border rounded-lg">
                <Wrench className="h-4 w-4 text-blue-600 mr-3" />
                <span className="text-sm">{servico}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}