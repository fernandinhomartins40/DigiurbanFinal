'use client'
// @ts-nocheck

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Shield,
  AlertTriangle,
  TrendingUp,
  Users,
  Activity,
  FileText,
  Bell,
  MapPin,
  Calendar,
  Eye
} from 'lucide-react'

interface Notificacao {
  id: string
  codigo: string
  doenca: string
  paciente: string
  idade: number
  bairro: string
  dataNotificacao: string
  status: 'PENDENTE' | 'INVESTIGANDO' | 'CONFIRMADO' | 'DESCARTADO'
  classificacao: 'SUSPEITO' | 'PROVAVEL' | 'CONFIRMADO'
  gravidade: 'LEVE' | 'MODERADA' | 'GRAVE'
}

interface Surto {
  id: string
  doenca: string
  local: string
  casosConfirmados: number
  casosSuspeitos: number
  dataInicio: string
  status: 'ATIVO' | 'CONTROLADO' | 'ENCERRADO'
  nivel: 'BAIXO' | 'MEDIO' | 'ALTO'
}

const notificacoes: Notificacao[] = [
  {
    id: '1',
    codigo: 'VE-2024-001',
    doenca: 'Dengue',
    paciente: 'Maria Silva',
    idade: 34,
    bairro: 'Centro',
    dataNotificacao: '2024-01-15',
    status: 'INVESTIGANDO',
    classificacao: 'SUSPEITO',
    gravidade: 'MODERADA'
  },
  {
    id: '2',
    codigo: 'VE-2024-002',
    doenca: 'COVID-19',
    paciente: 'João Santos',
    idade: 45,
    bairro: 'Jardim das Flores',
    dataNotificacao: '2024-01-14',
    status: 'CONFIRMADO',
    classificacao: 'CONFIRMADO',
    gravidade: 'LEVE'
  },
  {
    id: '3',
    codigo: 'VE-2024-003',
    doenca: 'Influenza A',
    paciente: 'Ana Costa',
    idade: 28,
    bairro: 'Vila Esperança',
    dataNotificacao: '2024-01-13',
    status: 'DESCARTADO',
    classificacao: 'SUSPEITO',
    gravidade: 'LEVE'
  }
]

const surtos: Surto[] = [
  {
    id: '1',
    doenca: 'Dengue',
    local: 'Bairro Centro',
    casosConfirmados: 12,
    casosSuspeitos: 8,
    dataInicio: '2024-01-10',
    status: 'ATIVO',
    nivel: 'ALTO'
  },
  {
    id: '2',
    doenca: 'Gastroenterite',
    local: 'Escola Municipal',
    casosConfirmados: 6,
    casosSuspeitos: 3,
    dataInicio: '2024-01-08',
    status: 'CONTROLADO',
    nivel: 'MEDIO'
  }
]

const statusColors = {
  PENDENTE: 'bg-yellow-100 text-yellow-800',
  INVESTIGANDO: 'bg-blue-100 text-blue-800',
  CONFIRMADO: 'bg-red-100 text-red-800',
  DESCARTADO: 'bg-gray-100 text-gray-800'
}

const surtosColors = {
  ATIVO: 'bg-red-100 text-red-800',
  CONTROLADO: 'bg-yellow-100 text-yellow-800',
  ENCERRADO: 'bg-green-100 text-green-800'
}

const nivelColors = {
  BAIXO: 'bg-green-100 text-green-800',
  MEDIO: 'bg-yellow-100 text-yellow-800',
  ALTO: 'bg-red-100 text-red-800'
}

export default function VigilanciaEpidemiologicaPage() {
  const [filtroDoenca, setFiltroDoenca] = useState('all')
  const [filtroStatus, setFiltroStatus] = useState('all')

  const notificacoesFiltradas = notificacoes.filter(n => {
    const matchDoenca = filtroDoenca === 'all' || n.doenca === filtroDoenca
    const matchStatus = filtroStatus === 'all' || n.status === filtroStatus
    return matchDoenca && matchStatus
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Shield className="h-8 w-8 text-red-600 mr-3" />
            Vigilância Epidemiológica
          </h1>
          <p className="text-gray-600 mt-1">
            Monitoramento e controle de doenças e agravos à saúde
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <FileText className="h-4 w-4 mr-2" />
            Relatório SINAN
          </Button>
          <Button>
            <Bell className="h-4 w-4 mr-2" />
            Nova Notificação
          </Button>
        </div>
      </div>

      {/* Alertas Ativos */}
      {surtos.filter(s => s.status === 'ATIVO').length > 0 && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            <strong>Atenção:</strong> {surtos.filter(s => s.status === 'ATIVO').length} surto(s) ativo(s) requer(em) monitoramento imediato.
          </AlertDescription>
        </Alert>
      )}

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Notificações (Mês)</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{notificacoes.length}</div>
            <p className="text-xs text-muted-foreground">
              +3 esta semana
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Casos Confirmados</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {notificacoes.filter(n => n.status === 'CONFIRMADO').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Em investigação: {notificacoes.filter(n => n.status === 'INVESTIGANDO').length}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Surtos Ativos</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {surtos.filter(s => s.status === 'ATIVO').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Controlados: {surtos.filter(s => s.status === 'CONTROLADO').length}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Incidência</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12.5</div>
            <p className="text-xs text-muted-foreground">
              Por 100.000 hab.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs de Conteúdo */}
      <Tabs defaultValue="notificacoes" className="space-y-4">
        <TabsList>
          <TabsTrigger value="notificacoes">Notificações</TabsTrigger>
          <TabsTrigger value="surtos">Surtos</TabsTrigger>
          <TabsTrigger value="indicadores">Indicadores</TabsTrigger>
          <TabsTrigger value="mapa">Mapa Epidemiológico</TabsTrigger>
        </TabsList>

        <TabsContent value="notificacoes" className="space-y-4">
          {/* Filtros */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex space-x-4">
                <Select value={filtroDoenca} onValueChange={setFiltroDoenca}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Todas as doenças" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas as doenças</SelectItem>
                    <SelectItem value="Dengue">Dengue</SelectItem>
                    <SelectItem value="COVID-19">COVID-19</SelectItem>
                    <SelectItem value="Influenza A">Influenza A</SelectItem>
                    <SelectItem value="Zika">Zika</SelectItem>
                    <SelectItem value="Chikungunya">Chikungunya</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filtroStatus} onValueChange={setFiltroStatus}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="PENDENTE">Pendente</SelectItem>
                    <SelectItem value="INVESTIGANDO">Investigando</SelectItem>
                    <SelectItem value="CONFIRMADO">Confirmado</SelectItem>
                    <SelectItem value="DESCARTADO">Descartado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Lista de Notificações */}
          <div className="space-y-4">
            {notificacoesFiltradas.map((notificacao) => (
              <Card key={notificacao.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold">#{notificacao.codigo}</h3>
                        <Badge
                          variant="secondary"
                          className={statusColors[notificacao.status]}
                        >
                          {notificacao.status}
                        </Badge>
                        <Badge variant="outline">
                          {notificacao.doenca}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="font-medium text-gray-500">Paciente:</span>
                          <div className="font-semibold">{notificacao.paciente}</div>
                        </div>
                        <div>
                          <span className="font-medium text-gray-500">Idade:</span>
                          <div className="font-semibold">{notificacao.idade} anos</div>
                        </div>
                        <div>
                          <span className="font-medium text-gray-500">Bairro:</span>
                          <div className="font-semibold">{notificacao.bairro}</div>
                        </div>
                        <div>
                          <span className="font-medium text-gray-500">Data:</span>
                          <div className="font-semibold">
                            {new Date(notificacao.dataNotificacao).toLocaleDateString('pt-BR')}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col space-y-2 ml-4">
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4 mr-1" />
                        Visualizar
                      </Button>
                      <Button size="sm" variant="outline">
                        <FileText className="h-4 w-4 mr-1" />
                        Editar
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="surtos" className="space-y-4">
          <div className="space-y-4">
            {surtos.map((surto) => (
              <Card key={surto.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold">{surto.doenca}</h3>
                        <Badge
                          variant="secondary"
                          className={surtosColors[surto.status]}
                        >
                          {surto.status}
                        </Badge>
                        <Badge
                          variant="outline"
                          className={nivelColors[surto.nivel]}
                        >
                          Nível {surto.nivel}
                        </Badge>
                      </div>

                      <p className="text-gray-600 text-sm mb-3">
                        <MapPin className="h-4 w-4 inline mr-1" />
                        {surto.local}
                      </p>

                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="font-medium text-gray-500">Casos Confirmados:</span>
                          <div className="font-semibold text-red-600">{surto.casosConfirmados}</div>
                        </div>
                        <div>
                          <span className="font-medium text-gray-500">Casos Suspeitos:</span>
                          <div className="font-semibold text-yellow-600">{surto.casosSuspeitos}</div>
                        </div>
                        <div>
                          <span className="font-medium text-gray-500">Data Início:</span>
                          <div className="font-semibold">
                            {new Date(surto.dataInicio).toLocaleDateString('pt-BR')}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col space-y-2 ml-4">
                      <Button size="sm">
                        <Activity className="h-4 w-4 mr-1" />
                        Monitorar
                      </Button>
                      <Button size="sm" variant="outline">
                        <MapPin className="h-4 w-4 mr-1" />
                        Localizar
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="indicadores" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Doenças de Notificação Compulsória</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Dengue</span>
                    <span className="font-semibold">45 casos</span>
                  </div>
                  <div className="flex justify-between">
                    <span>COVID-19</span>
                    <span className="font-semibold">23 casos</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Influenza</span>
                    <span className="font-semibold">12 casos</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Zika</span>
                    <span className="font-semibold">8 casos</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Indicadores de Qualidade</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Notificações em 24h</span>
                    <span className="font-semibold text-green-600">95%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Investigações concluídas</span>
                    <span className="font-semibold text-green-600">87%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tempo médio investigação</span>
                    <span className="font-semibold">3.2 dias</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Encerramento oportuno</span>
                    <span className="font-semibold text-yellow-600">78%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="mapa" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Mapa Epidemiológico</CardTitle>
              <CardDescription>
                Distribuição espacial das doenças e agravos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <MapPin className="h-12 w-12 mx-auto mb-2" />
                  <p>Mapa epidemiológico será carregado aqui</p>
                  <p className="text-sm">Pontos de calor por doença e bairro</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}