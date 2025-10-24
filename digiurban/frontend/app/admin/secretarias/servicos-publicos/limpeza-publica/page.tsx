'use client'

import { useAdminAuth } from '@/contexts/AdminAuthContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Trash2,
  MapPin,
  Clock,
  Users,
  Truck,
  Calendar,
  CheckCircle,
  AlertCircle,
  Activity,
  BarChart3,
  Route,
  Fuel,
  RefreshCw,
  Plus,
  Search,
  Filter,
  Download
} from 'lucide-react'
import { useState } from 'react'

const rotasColeta = [
  {
    id: 1,
    nome: 'Rota Centro',
    veiculo: 'Caminhão CL-001',
    motorista: 'Carlos Silva',
    coletores: 3,
    bairros: ['Centro', 'Vila Rica', 'Jardim Central'],
    horarioInicio: '06:00',
    horarioFim: '14:00',
    distancia: '25 km',
    status: 'em-andamento',
    progresso: 65
  },
  {
    id: 2,
    nome: 'Rota Norte',
    veiculo: 'Caminhão CL-002',
    motorista: 'João Santos',
    coletores: 3,
    bairros: ['Jardim das Flores', 'Vila Nova', 'Parque Industrial'],
    horarioInicio: '06:30',
    horarioFim: '14:30',
    distancia: '32 km',
    status: 'concluida',
    progresso: 100
  },
  {
    id: 3,
    nome: 'Rota Sul',
    veiculo: 'Caminhão CL-003',
    motorista: 'Pedro Lima',
    coletores: 2,
    bairros: ['Vila do Sol', 'Residencial Santos', 'Chácara Bela Vista'],
    horarioInicio: '07:00',
    horarioFim: '15:00',
    distancia: '28 km',
    status: 'agendada',
    progresso: 0
  }
]

const veiculosLimpeza = [
  {
    id: 1,
    placa: 'CL-001',
    modelo: 'Caminhão Compactador Volvo',
    capacidade: '15m³',
    combustivel: 75,
    kmRodados: 45200,
    proximaManutencao: '2024-02-15',
    status: 'operacional',
    localizacao: 'Rota Centro - Rua das Flores'
  },
  {
    id: 2,
    placa: 'CL-002',
    modelo: 'Caminhão Compactador Mercedes',
    capacidade: '12m³',
    combustivel: 60,
    kmRodados: 38900,
    proximaManutencao: '2024-02-20',
    status: 'operacional',
    localizacao: 'Garagem Municipal'
  },
  {
    id: 3,
    placa: 'CL-003',
    modelo: 'Caminhão Basculante Iveco',
    capacidade: '8m³',
    combustivel: 40,
    kmRodados: 52100,
    proximaManutencao: '2024-01-30',
    status: 'manutencao',
    localizacao: 'Oficina Municipal'
  }
]

const estatisticasColeta = {
  coletaHoje: 45.8,
  metaDiaria: 50,
  coletaSemana: 289.5,
  metaSemanal: 350,
  pontosCriticos: 8,
  reclamacoes: 3,
  eficienciaMedia: 92
}

const pontosCriticos = [
  {
    id: 1,
    endereco: 'Rua das Palmeiras, esquina com Av. Central',
    bairro: 'Centro',
    tipo: 'acumulo-lixo',
    descricao: 'Lixo acumulado há 2 dias, necessário coleta urgente',
    prioridade: 'alta',
    dataReporte: '2024-01-22',
    status: 'pendente'
  },
  {
    id: 2,
    endereco: 'Praça da Liberdade',
    bairro: 'Jardim das Flores',
    tipo: 'limpeza-praca',
    descricao: 'Necessário varredura e limpeza após evento',
    prioridade: 'media',
    dataReporte: '2024-01-21',
    status: 'agendado'
  },
  {
    id: 3,
    endereco: 'Av. Principal, altura do nº 500',
    bairro: 'Vila Nova',
    tipo: 'entulho',
    descricao: 'Entulho descartado irregularmente na via',
    prioridade: 'alta',
    dataReporte: '2024-01-20',
    status: 'em-andamento'
  }
]

const servicosGerados = [
  'Coleta de Lixo Domiciliar',
  'Coleta de Lixo Comercial',
  'Remoção de Entulho',
  'Limpeza de Terreno',
  'Varredura de Ruas',
  'Limpeza de Bueiros',
  'Coleta de Galhos'
]

export default function LimpezaPublicaPage() {
  const { user } = useAdminAuth()
  const [novaRota, setNovaRota] = useState({
    nome: '',
    veiculo: '',
    motorista: '',
    bairros: '',
    horarioInicio: '',
    horarioFim: ''
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'operacional':
        return <Badge className="bg-green-500 text-white">Operacional</Badge>
      case 'manutencao':
        return <Badge className="bg-yellow-500 text-white">Manutenção</Badge>
      case 'indisponivel':
        return <Badge variant="destructive">Indisponível</Badge>
      case 'em-andamento':
        return <Badge className="bg-blue-500 text-white">Em Andamento</Badge>
      case 'concluida':
        return <Badge className="bg-green-500 text-white">Concluída</Badge>
      case 'agendada':
        return <Badge className="bg-gray-500 text-white">Agendada</Badge>
      case 'pendente':
        return <Badge className="bg-yellow-500 text-white">Pendente</Badge>
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

  const getCombustivelColor = (nivel: number) => {
    if (nivel >= 70) return 'text-green-600'
    if (nivel >= 30) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getProgressoColor = (progresso: number) => {
    if (progresso >= 80) return 'bg-green-500'
    if (progresso >= 50) return 'bg-blue-500'
    if (progresso > 0) return 'bg-yellow-500'
    return 'bg-gray-300'
  }

  const getEficienciaColor = (valor: number, meta: number) => {
    const percentual = (valor / meta) * 100
    if (percentual >= 90) return 'text-green-600'
    if (percentual >= 70) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Trash2 className="h-8 w-8 text-blue-600 mr-3" />
            Limpeza Pública
          </h1>
          <p className="text-gray-600 mt-1">
            Gestão de coleta, rotas, veículos e cronogramas de limpeza urbana
          </p>
        </div>
        <Badge variant="outline" className="text-blue-600 border-blue-200">
          Limpeza Urbana
        </Badge>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Coleta Hoje</CardTitle>
            <Trash2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getEficienciaColor(estatisticasColeta.coletaHoje, estatisticasColeta.metaDiaria)}`}>
              {estatisticasColeta.coletaHoje}t
            </div>
            <p className="text-xs text-muted-foreground">
              Meta: {estatisticasColeta.metaDiaria}t
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Veículos Ativos</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">
              De 3 disponíveis
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Eficiência</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{estatisticasColeta.eficienciaMedia}%</div>
            <p className="text-xs text-muted-foreground">
              Média mensal
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pontos Críticos</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{estatisticasColeta.pontosCriticos}</div>
            <p className="text-xs text-muted-foreground">
              Necessitam atenção
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Nova Rota */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Plus className="h-5 w-5 mr-2" />
              Programar Rota
            </CardTitle>
            <CardDescription>
              Criar nova rota de coleta
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="nome">Nome da Rota</Label>
              <Input
                id="nome"
                placeholder="Ex: Rota Leste"
                value={novaRota.nome}
                onChange={(e) => setNovaRota(prev => ({ ...prev, nome: e.target.value }))}
              />
            </div>

            <div>
              <Label htmlFor="veiculo">Veículo</Label>
              <Select value={novaRota.veiculo} onValueChange={(value) => setNovaRota(prev => ({ ...prev, veiculo: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o veículo" />
                </SelectTrigger>
                <SelectContent>
                  {veiculosLimpeza.filter(v => v.status === 'operacional').map((veiculo) => (
                    <SelectItem key={veiculo.id} value={veiculo.placa}>
                      {veiculo.modelo} - {veiculo.placa}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="motorista">Motorista</Label>
              <Input
                id="motorista"
                placeholder="Nome do motorista"
                value={novaRota.motorista}
                onChange={(e) => setNovaRota(prev => ({ ...prev, motorista: e.target.value }))}
              />
            </div>

            <div>
              <Label htmlFor="bairros">Bairros</Label>
              <Input
                id="bairros"
                placeholder="Lista de bairros separados por vírgula"
                value={novaRota.bairros}
                onChange={(e) => setNovaRota(prev => ({ ...prev, bairros: e.target.value }))}
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="horarioInicio">Início</Label>
                <Input
                  id="horarioInicio"
                  type="time"
                  value={novaRota.horarioInicio}
                  onChange={(e) => setNovaRota(prev => ({ ...prev, horarioInicio: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="horarioFim">Fim</Label>
                <Input
                  id="horarioFim"
                  type="time"
                  value={novaRota.horarioFim}
                  onChange={(e) => setNovaRota(prev => ({ ...prev, horarioFim: e.target.value }))}
                />
              </div>
            </div>

            <Button className="w-full">
              <Route className="h-4 w-4 mr-2" />
              Criar Rota
            </Button>
          </CardContent>
        </Card>

        {/* Rotas de Coleta */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Rotas de Coleta</CardTitle>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Search className="h-4 w-4 mr-2" />
                  Buscar
                </Button>
                <Button variant="outline" size="sm">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Atualizar
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {rotasColeta.map((rota) => (
                <div key={rota.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-semibold">{rota.nome}</h4>
                      <p className="text-sm text-gray-600">{rota.veiculo} - {rota.motorista}</p>
                    </div>
                    {getStatusBadge(rota.status)}
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-sm mb-3">
                    <div>
                      <span className="text-gray-500">Horário:</span>
                      <p className="font-medium">{rota.horarioInicio} - {rota.horarioFim}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Distância:</span>
                      <p className="font-medium">{rota.distancia}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Coletores:</span>
                      <p className="font-medium">{rota.coletores} pessoas</p>
                    </div>
                  </div>

                  <div className="mb-3">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-gray-500">Progresso:</span>
                      <span className="font-medium">{rota.progresso}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${getProgressoColor(rota.progresso)}`}
                        style={{ width: `${rota.progresso}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="text-sm mb-3">
                    <span className="text-gray-500">Bairros:</span>
                    <p className="font-medium">{rota.bairros.join(', ')}</p>
                  </div>

                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">
                      <MapPin className="h-4 w-4 mr-2" />
                      Rastrear
                    </Button>
                    <Button size="sm" variant="outline">
                      <Activity className="h-4 w-4 mr-2" />
                      Relatório
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Veículos de Limpeza */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Truck className="h-5 w-5 mr-2" />
              Frota de Limpeza
            </CardTitle>
            <CardDescription>
              Status dos veículos de coleta
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {veiculosLimpeza.map((veiculo) => (
                <div key={veiculo.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="font-semibold">{veiculo.modelo}</h4>
                      <p className="text-sm text-gray-600">{veiculo.placa} - {veiculo.capacidade}</p>
                    </div>
                    {getStatusBadge(veiculo.status)}
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm mb-2">
                    <div>
                      <span className="text-gray-500">Combustível:</span>
                      <p className={`font-medium ${getCombustivelColor(veiculo.combustivel)}`}>
                        {veiculo.combustivel}%
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-500">KM:</span>
                      <p className="font-medium">{veiculo.kmRodados.toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="text-sm mb-3">
                    <span className="text-gray-500">Localização:</span>
                    <p className="font-medium">{veiculo.localizacao}</p>
                  </div>

                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">
                      <MapPin className="h-4 w-4 mr-2" />
                      Localizar
                    </Button>
                    <Button size="sm" variant="outline">
                      <Calendar className="h-4 w-4 mr-2" />
                      Manutenção
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Pontos Críticos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertCircle className="h-5 w-5 mr-2 text-red-600" />
              Pontos Críticos
            </CardTitle>
            <CardDescription>
              Locais que necessitam atenção urgente
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pontosCriticos.map((ponto) => (
                <div key={ponto.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="font-semibold text-sm">{ponto.endereco}</h4>
                      <p className="text-sm text-gray-600">{ponto.bairro}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getPrioridadeBadge(ponto.prioridade)}
                      {getStatusBadge(ponto.status)}
                    </div>
                  </div>

                  <p className="text-sm text-gray-700 mb-2">{ponto.descricao}</p>

                  <div className="text-sm mb-3">
                    <span className="text-gray-500">Reportado em:</span>
                    <p className="font-medium">{ponto.dataReporte}</p>
                  </div>

                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Resolver
                    </Button>
                    <Button size="sm" variant="outline">
                      <MapPin className="h-4 w-4 mr-2" />
                      Localizar
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
                <Trash2 className="h-4 w-4 text-blue-600 mr-3" />
                <span className="text-sm">{servico}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}