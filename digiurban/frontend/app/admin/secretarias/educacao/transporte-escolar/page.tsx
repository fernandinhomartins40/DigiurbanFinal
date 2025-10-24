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
  Bus,
  Users,
  MapPin,
  Clock,
  Route,
  User,
  Phone,
  Calendar,
  AlertCircle,
  CheckCircle,
  Navigation,
  Fuel,
  Wrench,
  UserCheck,
  Home,
  School,
  Plus,
  Search,
  Filter,
  Download
} from 'lucide-react'
import { useState } from 'react'

const veiculosEscolares = [
  {
    id: 1,
    placa: 'ESC-1001',
    modelo: 'Ônibus Escolar Mercedes',
    capacidade: 44,
    motorista: 'João Silva Santos',
    telefone: '(11) 99999-1001',
    rota: 'Rota 01 - Centro',
    estudantes: 38,
    status: 'ativo',
    combustivel: 75,
    proximaManutencao: '2024-02-15'
  },
  {
    id: 2,
    placa: 'ESC-1002',
    modelo: 'Van Escolar Fiat Ducato',
    capacidade: 15,
    motorista: 'Maria Costa Lima',
    telefone: '(11) 99999-1002',
    rota: 'Rota 02 - Rural',
    estudantes: 12,
    status: 'ativo',
    combustivel: 60,
    proximaManutencao: '2024-02-20'
  },
  {
    id: 3,
    placa: 'ESC-1003',
    modelo: 'Micro-ônibus Iveco',
    capacidade: 28,
    motorista: 'Pedro Oliveira',
    telefone: '(11) 99999-1003',
    rota: 'Rota 03 - Periferia',
    estudantes: 25,
    status: 'manutencao',
    combustivel: 30,
    proximaManutencao: '2024-01-25'
  }
]

const rotasEscolares = [
  {
    id: 1,
    nome: 'Rota 01 - Centro',
    veiculo: 'ESC-1001',
    motorista: 'João Silva Santos',
    estudantes: 38,
    pontos: [
      { nome: 'Praça Central', horario: '07:00', estudantes: 8 },
      { nome: 'Rua das Flores, 100', horario: '07:05', estudantes: 6 },
      { nome: 'Av. Principal, 250', horario: '07:12', estudantes: 12 },
      { nome: 'EMEF João da Silva', horario: '07:25', estudantes: 38 }
    ],
    distanciaTotal: '15 km',
    tempoTotal: '25 min'
  },
  {
    id: 2,
    nome: 'Rota 02 - Rural',
    veiculo: 'ESC-1002',
    motorista: 'Maria Costa Lima',
    estudantes: 12,
    pontos: [
      { nome: 'Sítio São José', horario: '06:30', estudantes: 4 },
      { nome: 'Fazenda Boa Vista', horario: '06:45', estudantes: 3 },
      { nome: 'Vila Rural', horario: '07:00', estudantes: 5 },
      { nome: 'EMEF Paulo Freire', horario: '07:30', estudantes: 12 }
    ],
    distanciaTotal: '25 km',
    tempoTotal: '60 min'
  }
]

const solicitacoesTransporte = [
  {
    id: 1,
    nomeEstudante: 'Ana Silva Santos',
    responsavel: 'Maria Silva',
    telefone: '(11) 99999-2001',
    endereco: 'Rua Nova, 150',
    escola: 'EMEF João da Silva',
    serie: '5º Ano',
    observacoes: 'Precisa descer na Av. Central',
    datasolicitacao: '2024-01-20',
    status: 'pendente'
  },
  {
    id: 2,
    nomeEstudante: 'Carlos Costa Lima',
    responsavel: 'Pedro Lima',
    telefone: '(11) 99999-2002',
    endereco: 'Fazenda Esperança',
    escola: 'EMEF Paulo Freire',
    serie: '3º Ano',
    observacoes: 'Zona rural, estrada de terra',
    datasolicitacao: '2024-01-18',
    status: 'aprovada'
  },
  {
    id: 3,
    nomeEstudante: 'Beatriz Oliveira',
    responsavel: 'Rosa Oliveira',
    telefone: '(11) 99999-2003',
    endereco: 'Rua Distante, 500',
    escola: 'EMEI Maria Montessori',
    serie: 'Pré II',
    observacoes: 'Necessita acompanhante',
    datasolicitacao: '2024-01-15',
    status: 'negada'
  }
]

const servicosGerados = [
  'Solicitação de Transporte Escolar',
  'Alteração de Endereço',
  'Cancelamento de Transporte',
  'Itinerário Escolar',
  'Horário de Transporte',
  'Ponto de Embarque/Desembarque',
  'Acompanhamento de Rota'
]

export default function TransporteEscolarPage() {
  const { user } = useAdminAuth()
  const [novaSolicitacao, setNovaSolicitacao] = useState({
    nomeEstudante: '',
    responsavel: '',
    telefone: '',
    endereco: '',
    escola: '',
    serie: '',
    observacoes: ''
  })

  const getStatusVeiculoBadge = (status: string) => {
    switch (status) {
      case 'ativo':
        return <Badge className="bg-green-500 text-white">Ativo</Badge>
      case 'manutencao':
        return <Badge className="bg-yellow-500 text-white">Manutenção</Badge>
      case 'inativo':
        return <Badge variant="destructive">Inativo</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getStatusSolicitacaoBadge = (status: string) => {
    switch (status) {
      case 'pendente':
        return <Badge className="bg-yellow-500 text-white">Pendente</Badge>
      case 'aprovada':
        return <Badge className="bg-green-500 text-white">Aprovada</Badge>
      case 'negada':
        return <Badge variant="destructive">Negada</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getOcupacaoBadge = (estudantes: number, capacidade: number) => {
    const percentual = (estudantes / capacidade) * 100
    if (percentual >= 90) return <Badge variant="destructive">{estudantes}/{capacidade}</Badge>
    if (percentual >= 70) return <Badge className="bg-yellow-500 text-white">{estudantes}/{capacidade}</Badge>
    return <Badge className="bg-green-500 text-white">{estudantes}/{capacidade}</Badge>
  }

  const getCombustivelColor = (nivel: number) => {
    if (nivel >= 70) return 'text-green-600'
    if (nivel >= 30) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Bus className="h-8 w-8 text-blue-600 mr-3" />
            Transporte Escolar
          </h1>
          <p className="text-gray-600 mt-1">
            Gestão de rotas, veículos, estudantes transportados e relatórios de pontualidade
          </p>
        </div>
        <Badge variant="outline" className="text-blue-600 border-blue-200">
          Transporte Educacional
        </Badge>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Veículos Ativos</CardTitle>
            <Bus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">
              2 em operação
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Estudantes Transportados</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">75</div>
            <p className="text-xs text-muted-foreground">
              Por dia
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rotas Ativas</CardTitle>
            <Route className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">
              Funcionando
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Solicitações</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">
              Pendentes
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Nova Solicitação */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Plus className="h-5 w-5 mr-2" />
              Nova Solicitação
            </CardTitle>
            <CardDescription>
              Solicitar transporte escolar
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="nomeEstudante">Nome do Estudante</Label>
              <Input
                id="nomeEstudante"
                placeholder="Nome completo do estudante"
                value={novaSolicitacao.nomeEstudante}
                onChange={(e) => setNovaSolicitacao(prev => ({ ...prev, nomeEstudante: e.target.value }))}
              />
            </div>

            <div>
              <Label htmlFor="responsavel">Responsável</Label>
              <Input
                id="responsavel"
                placeholder="Nome do responsável"
                value={novaSolicitacao.responsavel}
                onChange={(e) => setNovaSolicitacao(prev => ({ ...prev, responsavel: e.target.value }))}
              />
            </div>

            <div>
              <Label htmlFor="telefone">Telefone</Label>
              <Input
                id="telefone"
                placeholder="(11) 99999-9999"
                value={novaSolicitacao.telefone}
                onChange={(e) => setNovaSolicitacao(prev => ({ ...prev, telefone: e.target.value }))}
              />
            </div>

            <div>
              <Label htmlFor="endereco">Endereço</Label>
              <Input
                id="endereco"
                placeholder="Endereço completo para embarque"
                value={novaSolicitacao.endereco}
                onChange={(e) => setNovaSolicitacao(prev => ({ ...prev, endereco: e.target.value }))}
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="escola">Escola</Label>
                <Select value={novaSolicitacao.escola} onValueChange={(value) => setNovaSolicitacao(prev => ({ ...prev, escola: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="emef-joao">EMEF João da Silva</SelectItem>
                    <SelectItem value="emei-maria">EMEI Maria Montessori</SelectItem>
                    <SelectItem value="emef-paulo">EMEF Paulo Freire</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="serie">Série</Label>
                <Select value={novaSolicitacao.serie} onValueChange={(value) => setNovaSolicitacao(prev => ({ ...prev, serie: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1ano">1º Ano</SelectItem>
                    <SelectItem value="2ano">2º Ano</SelectItem>
                    <SelectItem value="3ano">3º Ano</SelectItem>
                    <SelectItem value="4ano">4º Ano</SelectItem>
                    <SelectItem value="5ano">5º Ano</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="observacoes">Observações</Label>
              <Textarea
                id="observacoes"
                placeholder="Informações adicionais"
                value={novaSolicitacao.observacoes}
                onChange={(e) => setNovaSolicitacao(prev => ({ ...prev, observacoes: e.target.value }))}
                rows={3}
              />
            </div>

            <Button className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Enviar Solicitação
            </Button>
          </CardContent>
        </Card>

        {/* Veículos Escolares */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Frota de Veículos Escolares</CardTitle>
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
              {veiculosEscolares.map((veiculo) => (
                <div key={veiculo.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-semibold">{veiculo.modelo}</h4>
                      <p className="text-sm text-gray-600">{veiculo.placa} - {veiculo.motorista}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getOcupacaoBadge(veiculo.estudantes, veiculo.capacidade)}
                      {getStatusVeiculoBadge(veiculo.status)}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-sm mb-3">
                    <div>
                      <span className="text-gray-500">Rota:</span>
                      <p className="font-medium">{veiculo.rota}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Combustível:</span>
                      <p className={`font-medium ${getCombustivelColor(veiculo.combustivel)}`}>
                        {veiculo.combustivel}%
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-500">Próxima Manutenção:</span>
                      <p className="font-medium">{veiculo.proximaManutencao}</p>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">
                      <Route className="h-4 w-4 mr-2" />
                      Ver Rota
                    </Button>
                    <Button size="sm" variant="outline">
                      <Phone className="h-4 w-4 mr-2" />
                      Contato
                    </Button>
                    <Button size="sm" variant="outline">
                      <Wrench className="h-4 w-4 mr-2" />
                      Manutenção
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Rotas Escolares */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Route className="h-5 w-5 mr-2" />
              Rotas Escolares
            </CardTitle>
            <CardDescription>
              Itinerários e pontos de embarque
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {rotasEscolares.map((rota) => (
                <div key={rota.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-semibold">{rota.nome}</h4>
                      <p className="text-sm text-gray-600">{rota.veiculo} - {rota.motorista}</p>
                    </div>
                    <Badge variant="outline">{rota.estudantes} estudantes</Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                    <div>
                      <span className="text-gray-500">Distância:</span>
                      <p className="font-medium">{rota.distanciaTotal}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Tempo:</span>
                      <p className="font-medium">{rota.tempoTotal}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-700">Pontos de parada:</p>
                    {rota.pontos.map((ponto, index) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">{ponto.nome}</span>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{ponto.horario}</span>
                          <Badge variant="secondary" className="text-xs">
                            {ponto.estudantes}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex space-x-2 mt-3">
                    <Button size="sm" variant="outline">
                      <MapPin className="h-4 w-4 mr-2" />
                      Mapa
                    </Button>
                    <Button size="sm" variant="outline">
                      <Clock className="h-4 w-4 mr-2" />
                      Horários
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Solicitações de Transporte */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertCircle className="h-5 w-5 mr-2" />
              Solicitações de Transporte
            </CardTitle>
            <CardDescription>
              Pedidos pendentes de análise
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {solicitacoesTransporte.map((solicitacao) => (
                <div key={solicitacao.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="font-semibold">{solicitacao.nomeEstudante}</h4>
                      <p className="text-sm text-gray-600">{solicitacao.serie} - {solicitacao.escola}</p>
                    </div>
                    {getStatusSolicitacaoBadge(solicitacao.status)}
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm mb-2">
                    <div>
                      <span className="text-gray-500">Responsável:</span>
                      <p className="font-medium">{solicitacao.responsavel}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Telefone:</span>
                      <p className="font-medium">{solicitacao.telefone}</p>
                    </div>
                  </div>

                  <div className="text-sm mb-2">
                    <span className="text-gray-500">Endereço:</span>
                    <p className="font-medium">{solicitacao.endereco}</p>
                  </div>

                  <p className="text-sm text-gray-600 mb-3">{solicitacao.observacoes}</p>

                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Aprovar
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
                <Bus className="h-4 w-4 text-blue-600 mr-3" />
                <span className="text-sm">{servico}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}