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
  Shield,
  Syringe,
  Heart,
  Users,
  Target,
  Calendar,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  MapPin,
  Plus,
  Search,
  Filter,
  FileText,
  Clock,
  Loader2
} from 'lucide-react'
import { useState } from 'react'
import { useVaccination } from '@/hooks/api/health'
import { useToast } from '@/hooks/use-toast'


const pontosVacinacao = [
  {
    id: 1,
    nome: 'UBS Centro',
    endereco: 'Rua Central, 100',
    horario: '08:00 - 17:00',
    vacinas: ['Influenza', 'COVID-19', 'Hepatite B'],
    atendimentos: 45
  },
  {
    id: 2,
    nome: 'UBS Jardim das Flores',
    endereco: 'Av. das Flores, 250',
    horario: '07:00 - 16:00',
    vacinas: ['Influenza', 'Tríplice Viral'],
    atendimentos: 32
  },
  {
    id: 3,
    nome: 'Centro de Especialidades',
    endereco: 'Rua da Saúde, 75',
    horario: '08:00 - 12:00',
    vacinas: ['COVID-19', 'Pneumocócica'],
    atendimentos: 28
  }
]

const servicosGerados = [
  'Inscrição em Campanha',
  'Agendamento de Vacina',
  'Cartão de Vacinação',
  'Campanha Educativa',
  'Certificado de Participação',
  'Localização de Postos',
  'Histórico de Vacinação'
]

export default function CampanhasPage() {
  const { user } = useAdminAuth()
  const { toast } = useToast()
  const {
    vaccinations,
    loading,
    error,
    createVaccination,
    getVaccinationsByStatus,
    getTodayVaccinations
  } = useVaccination()

  const [novaCampanha, setNovaCampanha] = useState({
    nome: '',
    tipo: '',
    inicio: '',
    fim: '',
    meta: '',
    publico: '',
    descricao: ''
  })

  // Dados reais calculados dos hooks
  const vacinacoesHoje = getTodayVaccinations()
  const vacinacoesCompletas = getVaccinationsByStatus('COMPLETED')
  const vacinacoesPendentes = getVaccinationsByStatus('SCHEDULED')

  // Simular campanhas baseadas nos registros de vacinação
  const campanhasAtivas = [
    {
      id: 1,
      nome: 'Vacinação Influenza 2024',
      tipo: 'vacinacao',
      status: 'ativa',
      inicio: '2024-03-01',
      fim: '2024-05-31',
      meta: 5000,
      realizado: vacinacoesCompletas.filter(v => v.vaccine_name?.includes('Influenza')).length,
      publico: 'Idosos e grupos de risco',
      cobertura: Math.round((vacinacoesCompletas.filter(v => v.vaccine_name?.includes('Influenza')).length / 5000) * 100)
    },
    {
      id: 2,
      nome: 'Campanha COVID-19',
      tipo: 'vacinacao',
      status: 'ativa',
      inicio: '2024-01-01',
      fim: '2024-12-31',
      meta: 10000,
      realizado: vacinacoesCompletas.filter(v => v.vaccine_name?.includes('COVID')).length,
      publico: 'População geral',
      cobertura: Math.round((vacinacoesCompletas.filter(v => v.vaccine_name?.includes('COVID')).length / 10000) * 100)
    }
  ]

  const dosesAplicadas = vacinacoesCompletas.length
  const coberturaMedia = campanhasAtivas.length > 0
    ? Math.round(campanhasAtivas.reduce((acc, camp) => acc + camp.cobertura, 0) / campanhasAtivas.length)
    : 0

  const handleNovaCampanha = async () => {
    if (!novaCampanha.nome || !novaCampanha.tipo || !novaCampanha.inicio || !novaCampanha.fim) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive"
      })
      return
    }

    // Simular criação de campanha (em uma implementação real, seria um hook específico)
    toast({
      title: "Sucesso",
      description: "Campanha criada com sucesso",
    })
    setNovaCampanha({
      nome: '',
      tipo: '',
      inicio: '',
      fim: '',
      meta: '',
      publico: '',
      descricao: ''
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Carregando campanhas...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold">Erro ao carregar</h3>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    )
  }

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'ativa':
      case 'active':
        return <Badge className="bg-green-500 text-white">Ativa</Badge>
      case 'planejada':
      case 'planned':
        return <Badge className="bg-blue-500 text-white">Planejada</Badge>
      case 'finalizada':
      case 'completed':
        return <Badge variant="secondary">Finalizada</Badge>
      case 'suspensa':
      case 'suspended':
        return <Badge variant="destructive">Suspensa</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getTipoBadge = (tipo: string) => {
    switch (tipo) {
      case 'vacinacao':
        return <Badge variant="outline" className="text-blue-600">Vacinação</Badge>
      case 'prevencao':
        return <Badge variant="outline" className="text-purple-600">Prevenção</Badge>
      case 'educativa':
        return <Badge variant="outline" className="text-green-600">Educativa</Badge>
      default:
        return <Badge variant="outline">{tipo}</Badge>
    }
  }

  const getCoberturaColor = (cobertura: number) => {
    if (cobertura >= 80) return 'text-green-600'
    if (cobertura >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Shield className="h-8 w-8 text-blue-600 mr-3" />
            Campanhas de Saúde
          </h1>
          <p className="text-gray-600 mt-1">
            Gestão de campanhas preventivas e vacinação
          </p>
        </div>
        <Badge variant="outline" className="text-blue-600 border-blue-200">
          Imunização
        </Badge>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Campanhas Ativas</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{campanhasAtivas.filter(c => c.status === 'ativa').length}</div>
            <p className="text-xs text-muted-foreground">
              Campanhas em andamento
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Doses Aplicadas</CardTitle>
            <Syringe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dosesAplicadas}</div>
            <p className="text-xs text-muted-foreground">
              Total registradas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cobertura Média</CardTitle>
            <Target className="h-4 w-4 text-muted-foregreen" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{coberturaMedia}%</div>
            <p className="text-xs text-muted-foreground">
              Meta: 80%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pontos de Vacinação</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">
              Ativos hoje
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Nova Campanha */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Plus className="h-5 w-5 mr-2" />
              Nova Campanha
            </CardTitle>
            <CardDescription>
              Criar nova campanha de saúde
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="nome">Nome da Campanha</Label>
              <Input
                id="nome"
                placeholder="Ex: Vacinação Influenza 2024"
                value={novaCampanha.nome}
                onChange={(e) => setNovaCampanha(prev => ({ ...prev, nome: e.target.value }))}
              />
            </div>

            <div>
              <Label htmlFor="tipo">Tipo de Campanha</Label>
              <Select value={novaCampanha.tipo} onValueChange={(value) => setNovaCampanha(prev => ({ ...prev, tipo: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="vacinacao">
                    <div className="flex items-center">
                      <Syringe className="h-4 w-4 mr-2" />
                      Vacinação
                    </div>
                  </SelectItem>
                  <SelectItem value="prevencao">
                    <div className="flex items-center">
                      <Heart className="h-4 w-4 mr-2" />
                      Prevenção
                    </div>
                  </SelectItem>
                  <SelectItem value="educativa">
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-2" />
                      Educativa
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="inicio">Data de Início</Label>
                <Input
                  id="inicio"
                  type="date"
                  value={novaCampanha.inicio}
                  onChange={(e) => setNovaCampanha(prev => ({ ...prev, inicio: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="fim">Data de Fim</Label>
                <Input
                  id="fim"
                  type="date"
                  value={novaCampanha.fim}
                  onChange={(e) => setNovaCampanha(prev => ({ ...prev, fim: e.target.value }))}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="meta">Meta de Atendimentos</Label>
              <Input
                id="meta"
                type="number"
                placeholder="Ex: 5000"
                value={novaCampanha.meta}
                onChange={(e) => setNovaCampanha(prev => ({ ...prev, meta: e.target.value }))}
              />
            </div>

            <div>
              <Label htmlFor="publico">Público-Alvo</Label>
              <Input
                id="publico"
                placeholder="Ex: Idosos acima de 60 anos"
                value={novaCampanha.publico}
                onChange={(e) => setNovaCampanha(prev => ({ ...prev, publico: e.target.value }))}
              />
            </div>

            <Button className="w-full" onClick={handleNovaCampanha}>
              <Plus className="h-4 w-4 mr-2" />
              Criar Campanha
            </Button>
          </CardContent>
        </Card>

        {/* Lista de Campanhas */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Campanhas de Saúde</CardTitle>
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
              {campanhasAtivas.length === 0 ? (
                <div className="text-center py-8">
                  <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Nenhuma campanha ativa</p>
                </div>
              ) : (
                campanhasAtivas.map((campanha) => (
                  <div key={campanha.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-semibold">{campanha.nome}</h4>
                        <p className="text-sm text-gray-600">{campanha.publico}</p>
                      </div>
                      <div className="flex space-x-2">
                        {getTipoBadge(campanha.tipo)}
                        {getStatusBadge(campanha.status)}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-3">
                      <div className="text-sm">
                        <span className="text-gray-500">Período:</span>
                        <p className="font-medium">{campanha.inicio} a {campanha.fim}</p>
                      </div>
                      <div className="text-sm">
                        <span className="text-gray-500">Progresso:</span>
                        <p className="font-medium">{campanha.realizado} / {campanha.meta}</p>
                      </div>
                    </div>

                    <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${Math.min(campanha.cobertura, 100)}%` }}
                      ></div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className={`text-sm font-medium ${getCoberturaColor(campanha.cobertura)}`}>
                        Cobertura: {campanha.cobertura}%
                      </span>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          <TrendingUp className="h-4 w-4 mr-2" />
                          Relatório
                        </Button>
                        <Button size="sm" variant="outline">
                          <FileText className="h-4 w-4 mr-2" />
                          Detalhes
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pontos de Vacinação */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <MapPin className="h-5 w-5 mr-2" />
            Pontos de Vacinação
          </CardTitle>
          <CardDescription>
            Locais de atendimento das campanhas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {pontosVacinacao.map((ponto) => (
              <div key={ponto.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold">{ponto.nome}</h4>
                  <Badge variant="outline">{ponto.atendimentos} hoje</Badge>
                </div>
                <p className="text-sm text-gray-600 mb-2">{ponto.endereco}</p>
                <p className="text-sm text-gray-600 mb-3">
                  <Clock className="h-3 w-3 inline mr-1" />
                  {ponto.horario}
                </p>
                <div className="space-y-1">
                  <p className="text-xs text-gray-500">Vacinas disponíveis:</p>
                  <div className="flex flex-wrap gap-1">
                    {ponto.vacinas.map((vacina, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {vacina}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

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
                <Shield className="h-4 w-4 text-blue-600 mr-3" />
                <span className="text-sm">{servico}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}