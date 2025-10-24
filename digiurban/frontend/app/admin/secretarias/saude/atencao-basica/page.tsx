'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Heart,
  MapPin,
  Users,
  Calendar,
  Activity,
  Clock,
  TrendingUp,
  UserCheck,
  Stethoscope,
  Plus
} from 'lucide-react'

interface UBS {
  id: string
  nome: string
  endereco: string
  bairro: string
  populacaoAdscrita: number
  equipes: number
  status: 'ATIVA' | 'REFORMA' | 'INATIVA'
  cobertura: number
  atendimentosMes: number
  coordenadas: { lat: number; lng: number }
}

const ubsData: UBS[] = [
  {
    id: '1',
    nome: 'UBS Central',
    endereco: 'Rua Principal, 100',
    bairro: 'Centro',
    populacaoAdscrita: 3200,
    equipes: 2,
    status: 'ATIVA',
    cobertura: 95,
    atendimentosMes: 890,
    coordenadas: { lat: -15.7942, lng: -47.8822 }
  },
  {
    id: '2',
    nome: 'UBS Jardim das Flores',
    endereco: 'Av. das Rosas, 45',
    bairro: 'Jardim das Flores',
    populacaoAdscrita: 2800,
    equipes: 2,
    status: 'ATIVA',
    cobertura: 87,
    atendimentosMes: 720,
    coordenadas: { lat: -15.7952, lng: -47.8832 }
  },
  {
    id: '3',
    nome: 'UBS Vila Esperança',
    endereco: 'Rua da Esperança, 230',
    bairro: 'Vila Esperança',
    populacaoAdscrita: 4100,
    equipes: 3,
    status: 'ATIVA',
    cobertura: 92,
    atendimentosMes: 1250,
    coordenadas: { lat: -15.7962, lng: -47.8812 }
  },
  {
    id: '4',
    nome: 'UBS Novo Horizonte',
    endereco: 'Rua do Horizonte, 78',
    bairro: 'Novo Horizonte',
    populacaoAdscrita: 2200,
    equipes: 1,
    status: 'REFORMA',
    cobertura: 45,
    atendimentosMes: 150,
    coordenadas: { lat: -15.7972, lng: -47.8802 }
  }
]

const statusColors = {
  ATIVA: 'bg-green-100 text-green-800',
  REFORMA: 'bg-yellow-100 text-yellow-800',
  INATIVA: 'bg-red-100 text-red-800'
}

export default function AtencaoBasicaPage() {
  const [ubsList, setUbsList] = useState<UBS[]>(ubsData)
  const [filtroStatus, setFiltroStatus] = useState('all')
  const [filtroNome, setFiltroNome] = useState('')

  const ubsFiltradas = ubsList.filter(ubs => {
    const matchNome = ubs.nome.toLowerCase().includes(filtroNome.toLowerCase()) ||
                     ubs.bairro.toLowerCase().includes(filtroNome.toLowerCase())
    const matchStatus = filtroStatus === 'all' || ubs.status === filtroStatus
    return matchNome && matchStatus
  })

  const stats = {
    totalUBS: ubsList.length,
    ubsAtivas: ubsList.filter(u => u.status === 'ATIVA').length,
    populacaoTotal: ubsList.reduce((acc, ubs) => acc + ubs.populacaoAdscrita, 0),
    coberturaMedia: Math.round(ubsList.reduce((acc, ubs) => acc + ubs.cobertura, 0) / ubsList.length),
    atendimentosTotal: ubsList.reduce((acc, ubs) => acc + ubs.atendimentosMes, 0)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Heart className="h-8 w-8 text-blue-600 mr-3" />
            Atenção Básica
          </h1>
          <p className="text-gray-600 mt-1">
            Gestão das Unidades Básicas de Saúde e Estratégia Saúde da Família
          </p>
        </div>
        <div className="flex space-x-2">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nova UBS
          </Button>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total UBS</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUBS}</div>
            <p className="text-xs text-muted-foreground">
              {stats.ubsAtivas} ativas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">População</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.populacaoTotal.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Adscrita às UBS
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cobertura ESF</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.coberturaMedia}%</div>
            <p className="text-xs text-muted-foreground">
              Meta: 95%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Atendimentos</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.atendimentosTotal.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Este mês
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Equipes ESF</CardTitle>
            <Stethoscope className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {ubsList.reduce((acc, ubs) => acc + ubs.equipes, 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Implantadas
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Abas de Conteúdo */}
      <Tabs defaultValue="unidades" className="space-y-4">
        <TabsList>
          <TabsTrigger value="unidades">Unidades</TabsTrigger>
          <TabsTrigger value="mapa">Territorialização</TabsTrigger>
          <TabsTrigger value="indicadores">Indicadores</TabsTrigger>
          <TabsTrigger value="agendamento">Agendamento</TabsTrigger>
        </TabsList>

        <TabsContent value="unidades" className="space-y-4">
          {/* Filtros */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex space-x-4">
                <Input
                  placeholder="Buscar por nome ou bairro..."
                  value={filtroNome}
                  onChange={(e) => setFiltroNome(e.target.value)}
                  className="max-w-sm"
                />
                <Select value={filtroStatus} onValueChange={setFiltroStatus}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="ATIVA">Ativas</SelectItem>
                    <SelectItem value="REFORMA">Em Reforma</SelectItem>
                    <SelectItem value="INATIVA">Inativas</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Lista de UBS */}
          <div className="grid gap-4">
            {ubsFiltradas.map((ubs) => (
              <Card key={ubs.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold">{ubs.nome}</h3>
                        <Badge
                          variant="secondary"
                          className={statusColors[ubs.status]}
                        >
                          {ubs.status}
                        </Badge>
                      </div>

                      <p className="text-gray-600 text-sm mb-3">
                        {ubs.endereco} - {ubs.bairro}
                      </p>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="font-medium text-gray-500">População:</span>
                          <div className="font-semibold">{ubs.populacaoAdscrita.toLocaleString()}</div>
                        </div>
                        <div>
                          <span className="font-medium text-gray-500">Equipes ESF:</span>
                          <div className="font-semibold">{ubs.equipes}</div>
                        </div>
                        <div>
                          <span className="font-medium text-gray-500">Cobertura:</span>
                          <div className="font-semibold">{ubs.cobertura}%</div>
                        </div>
                        <div>
                          <span className="font-medium text-gray-500">Atendimentos/mês:</span>
                          <div className="font-semibold">{ubs.atendimentosMes}</div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col space-y-2 ml-4">
                      <Button size="sm" variant="outline">
                        <MapPin className="h-4 w-4 mr-1" />
                        Ver no Mapa
                      </Button>
                      <Button size="sm" variant="outline">
                        <Activity className="h-4 w-4 mr-1" />
                        Indicadores
                      </Button>
                      <Button size="sm">
                        <Calendar className="h-4 w-4 mr-1" />
                        Agendar
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="mapa" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Mapa de Territorialização</CardTitle>
              <CardDescription>
                Visualização geográfica das UBS e áreas de cobertura
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <MapPin className="h-12 w-12 mx-auto mb-2" />
                  <p>Mapa interativo será carregado aqui</p>
                  <p className="text-sm">Integração com Google Maps/OpenStreetMap</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="indicadores" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Indicadores de Processo</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Consultas médicas (mês)</span>
                    <span className="font-semibold">2.340</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Consultas enfermagem</span>
                    <span className="font-semibold">1.890</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Visitas domiciliares</span>
                    <span className="font-semibold">1.120</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Procedimentos</span>
                    <span className="font-semibold">890</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Indicadores de Qualidade</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Cobertura vacinal</span>
                    <span className="font-semibold text-green-600">92%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Pré-natal adequado</span>
                    <span className="font-semibold text-green-600">85%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Hipertensos controlados</span>
                    <span className="font-semibold text-yellow-600">75%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Diabéticos controlados</span>
                    <span className="font-semibold text-yellow-600">68%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="agendamento" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Central de Agendamento</CardTitle>
              <CardDescription>
                Gestão de consultas e procedimentos nas UBS
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500 mb-4">Sistema de agendamento integrado</p>
                <Button>Acessar Central de Regulação</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}