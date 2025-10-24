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
  AlertTriangle,
  FileText,
  Users,
  Clock,
  Calendar,
  CheckCircle,
  XCircle,
  User,
  School,
  Eye,
  MessageSquare,
  TrendingUp,
  Shield,
  Heart,
  Plus,
  Search,
  Filter,
  Download
} from 'lucide-react'
import { useState } from 'react'

const ocorrenciasRecentes = [
  {
    id: 1,
    protocolo: 'OCR-2024-0001',
    tipoOcorrencia: 'Indisciplina',
    gravidade: 'media',
    aluno: 'João Silva Santos',
    escola: 'EMEF João da Silva',
    serie: '5º Ano',
    professor: 'Ana Costa Silva',
    dataOcorrencia: '2024-01-22',
    descricao: 'Aluno se recusou a fazer atividade e atrappalhou a aula',
    medidasAdotadas: 'Conversa individual, comunicação aos pais',
    status: 'em-acompanhamento',
    proximaAcao: '2024-01-25'
  },
  {
    id: 2,
    protocolo: 'OCR-2024-0002',
    tipoOcorrencia: 'Agressão',
    gravidade: 'alta',
    aluno: 'Carlos Lima Costa',
    escola: 'EMEF Paulo Freire',
    serie: '8º Ano',
    professor: 'Maria Oliveira',
    dataOcorrencia: '2024-01-21',
    descricao: 'Briga durante o recreio com outro estudante',
    medidasAdotadas: 'Suspensão de 2 dias, mediação de conflitos',
    status: 'resolvida',
    proximaAcao: ''
  },
  {
    id: 3,
    protocolo: 'OCR-2024-0003',
    tipoOcorrencia: 'Bullying',
    gravidade: 'alta',
    aluno: 'Ana Costa Lima',
    escola: 'EMEI Maria Montessori',
    serie: 'Pré II',
    professor: 'Carlos Lima Santos',
    dataOcorrencia: '2024-01-20',
    descricao: 'Relatos de exclusão e apelidos pejorativos',
    medidasAdotadas: 'Projeto antibullying, acompanhamento psicológico',
    status: 'em-acompanhamento',
    proximaAcao: '2024-01-30'
  }
]

const tiposOcorrencia = [
  { tipo: 'Indisciplina', count: 12, gravidade: 'media' },
  { tipo: 'Agressão', count: 3, gravidade: 'alta' },
  { tipo: 'Bullying', count: 5, gravidade: 'alta' },
  { tipo: 'Vandalismo', count: 2, gravidade: 'media' },
  { tipo: 'Desrespeito', count: 8, gravidade: 'baixa' },
  { tipo: 'Uso de Celular', count: 15, gravidade: 'baixa' }
]

const medidasDisponiveis = [
  'Conversa individual',
  'Comunicação aos pais/responsáveis',
  'Advertência escrita',
  'Suspensão (1-3 dias)',
  'Mediação de conflitos',
  'Acompanhamento psicológico',
  'Projeto educativo específico',
  'Transferência de turma',
  'Conselho tutelar',
  'Transferência compulsória'
]

const acompanhamentosPendentes = [
  {
    id: 1,
    aluno: 'João Silva Santos',
    escola: 'EMEF João da Silva',
    totalOcorrencias: 4,
    ultimaOcorrencia: '2024-01-22',
    proximaAcao: '2024-01-25',
    responsavel: 'Coordenadora Ana',
    observacoes: 'Melhorou comportamento após conversa'
  },
  {
    id: 2,
    aluno: 'Pedro Oliveira',
    escola: 'EMEF Paulo Freire',
    totalOcorrencias: 2,
    ultimaOcorrencia: '2024-01-20',
    proximaAcao: '2024-01-26',
    responsavel: 'Orientadora Maria',
    observacoes: 'Pais comparecem na escola regularmente'
  }
]

const servicosGerados = [
  'Registro de Ocorrência Escolar',
  'Acompanhamento Disciplinar',
  'Mediação Escolar',
  'Relatório de Comportamento',
  'Histórico de Ocorrências',
  'Projeto Educativo Individual',
  'Comunicação aos Responsáveis'
]

export default function RegistroOcorrenciasPage() {
  const { user } = useAdminAuth()
  const [novaOcorrencia, setNovaOcorrencia] = useState({
    aluno: '',
    escola: '',
    serie: '',
    professor: '',
    tipoOcorrencia: '',
    gravidade: '',
    descricao: '',
    medidasAdotadas: ''
  })

  const getGravidadeBadge = (gravidade: string) => {
    switch (gravidade) {
      case 'baixa':
        return <Badge className="bg-green-500 text-white">Baixa</Badge>
      case 'media':
        return <Badge className="bg-yellow-500 text-white">Média</Badge>
      case 'alta':
        return <Badge variant="destructive">Alta</Badge>
      default:
        return <Badge variant="outline">{gravidade}</Badge>
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'resolvida':
        return <Badge className="bg-green-500 text-white">Resolvida</Badge>
      case 'em-acompanhamento':
        return <Badge className="bg-blue-500 text-white">Em Acompanhamento</Badge>
      case 'pendente':
        return <Badge className="bg-yellow-500 text-white">Pendente</Badge>
      case 'escalada':
        return <Badge variant="destructive">Escalada</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getTipoOcorrenciaIcon = (tipo: string) => {
    switch (tipo) {
      case 'Bullying':
        return <Shield className="h-4 w-4 text-red-600" />
      case 'Agressão':
        return <AlertTriangle className="h-4 w-4 text-red-600" />
      case 'Indisciplina':
        return <XCircle className="h-4 w-4 text-yellow-600" />
      default:
        return <FileText className="h-4 w-4 text-gray-600" />
    }
  }

  const getOcorrenciaCount = (count: number) => {
    if (count >= 5) return 'text-red-600'
    if (count >= 3) return 'text-yellow-600'
    return 'text-green-600'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <AlertTriangle className="h-8 w-8 text-blue-600 mr-3" />
            Registro de Ocorrências
          </h1>
          <p className="text-gray-600 mt-1">
            Sistema disciplinar, tipos de ocorrência, gravidade e acompanhamento pedagógico
          </p>
        </div>
        <Badge variant="outline" className="text-blue-600 border-blue-200">
          Disciplina Escolar
        </Badge>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ocorrências Este Mês</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45</div>
            <p className="text-xs text-muted-foreground">
              -12% vs mês anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Em Acompanhamento</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18</div>
            <p className="text-xs text-muted-foreground">
              Casos ativos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Casos Resolvidos</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">27</div>
            <p className="text-xs text-muted-foreground">
              Taxa: 75%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gravidade Alta</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">8</div>
            <p className="text-xs text-muted-foreground">
              Requer atenção
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Nova Ocorrência */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Plus className="h-5 w-5 mr-2" />
              Registrar Ocorrência
            </CardTitle>
            <CardDescription>
              Cadastrar novo evento disciplinar
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="aluno">Nome do Aluno</Label>
              <Input
                id="aluno"
                placeholder="Nome completo do aluno"
                value={novaOcorrencia.aluno}
                onChange={(e) => setNovaOcorrencia(prev => ({ ...prev, aluno: e.target.value }))}
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="escola">Escola</Label>
                <Select value={novaOcorrencia.escola} onValueChange={(value) => setNovaOcorrencia(prev => ({ ...prev, escola: value }))}>
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
                <Select value={novaOcorrencia.serie} onValueChange={(value) => setNovaOcorrencia(prev => ({ ...prev, serie: value }))}>
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
              <Label htmlFor="professor">Professor Responsável</Label>
              <Input
                id="professor"
                placeholder="Nome do professor"
                value={novaOcorrencia.professor}
                onChange={(e) => setNovaOcorrencia(prev => ({ ...prev, professor: e.target.value }))}
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="tipoOcorrencia">Tipo de Ocorrência</Label>
                <Select value={novaOcorrencia.tipoOcorrencia} onValueChange={(value) => setNovaOcorrencia(prev => ({ ...prev, tipoOcorrencia: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="indisciplina">Indisciplina</SelectItem>
                    <SelectItem value="agressao">Agressão</SelectItem>
                    <SelectItem value="bullying">Bullying</SelectItem>
                    <SelectItem value="vandalismo">Vandalismo</SelectItem>
                    <SelectItem value="desrespeito">Desrespeito</SelectItem>
                    <SelectItem value="uso-celular">Uso de Celular</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="gravidade">Gravidade</Label>
                <Select value={novaOcorrencia.gravidade} onValueChange={(value) => setNovaOcorrencia(prev => ({ ...prev, gravidade: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="baixa">Baixa</SelectItem>
                    <SelectItem value="media">Média</SelectItem>
                    <SelectItem value="alta">Alta</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="descricao">Descrição da Ocorrência</Label>
              <Textarea
                id="descricao"
                placeholder="Descreva detalhadamente o ocorrido"
                value={novaOcorrencia.descricao}
                onChange={(e) => setNovaOcorrencia(prev => ({ ...prev, descricao: e.target.value }))}
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="medidasAdotadas">Medidas Adotadas</Label>
              <Textarea
                id="medidasAdotadas"
                placeholder="Descreva as medidas tomadas"
                value={novaOcorrencia.medidasAdotadas}
                onChange={(e) => setNovaOcorrencia(prev => ({ ...prev, medidasAdotadas: e.target.value }))}
                rows={2}
              />
            </div>

            <Button className="w-full">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Registrar Ocorrência
            </Button>
          </CardContent>
        </Card>

        {/* Ocorrências Recentes */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Ocorrências Recentes</CardTitle>
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
              {ocorrenciasRecentes.map((ocorrencia) => (
                <div key={ocorrencia.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-semibold">{ocorrencia.aluno}</h4>
                      <p className="text-sm text-gray-600">
                        {ocorrencia.protocolo} • {ocorrencia.serie} - {ocorrencia.escola}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getGravidadeBadge(ocorrencia.gravidade)}
                      {getStatusBadge(ocorrencia.status)}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                    <div>
                      <span className="text-gray-500">Tipo:</span>
                      <p className="font-medium">{ocorrencia.tipoOcorrencia}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Data:</span>
                      <p className="font-medium">{ocorrencia.dataOcorrencia}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Professor:</span>
                      <p className="font-medium">{ocorrencia.professor}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Próxima ação:</span>
                      <p className="font-medium">{ocorrencia.proximaAcao || 'Não há'}</p>
                    </div>
                  </div>

                  <div className="text-sm mb-2">
                    <span className="text-gray-500">Descrição:</span>
                    <p className="text-gray-700">{ocorrencia.descricao}</p>
                  </div>

                  <div className="text-sm mb-3">
                    <span className="text-gray-500">Medidas adotadas:</span>
                    <p className="text-gray-700">{ocorrencia.medidasAdotadas}</p>
                  </div>

                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">
                      <Eye className="h-4 w-4 mr-2" />
                      Detalhes
                    </Button>
                    <Button size="sm" variant="outline">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Acompanhar
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tipos de Ocorrência */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              Tipos de Ocorrência
            </CardTitle>
            <CardDescription>
              Estatísticas por categoria
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {tiposOcorrencia.map((tipo, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    {getTipoOcorrenciaIcon(tipo.tipo)}
                    <div>
                      <h4 className="font-medium">{tipo.tipo}</h4>
                      <p className="text-sm text-gray-600">Gravidade: {tipo.gravidade}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold text-lg ${getOcorrenciaCount(tipo.count)}`}>
                      {tipo.count}
                    </p>
                    <p className="text-xs text-gray-500">casos</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Acompanhamentos Pendentes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Eye className="h-5 w-5 mr-2" />
              Acompanhamentos Pendentes
            </CardTitle>
            <CardDescription>
              Estudantes em acompanhamento
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {acompanhamentosPendentes.map((acompanhamento) => (
                <div key={acompanhamento.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="font-semibold">{acompanhamento.aluno}</h4>
                      <p className="text-sm text-gray-600">{acompanhamento.escola}</p>
                    </div>
                    <Badge variant="outline">
                      {acompanhamento.totalOcorrencias} ocorrências
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm mb-2">
                    <div>
                      <span className="text-gray-500">Última ocorrência:</span>
                      <p className="font-medium">{acompanhamento.ultimaOcorrencia}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Próxima ação:</span>
                      <p className="font-medium">{acompanhamento.proximaAcao}</p>
                    </div>
                  </div>

                  <div className="text-sm mb-3">
                    <span className="text-gray-500">Responsável:</span>
                    <p className="font-medium">{acompanhamento.responsavel}</p>
                  </div>

                  <p className="text-sm text-gray-600 mb-3">{acompanhamento.observacoes}</p>

                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">
                      <Heart className="h-4 w-4 mr-2" />
                      Atualizar
                    </Button>
                    <Button size="sm" variant="outline">
                      <FileText className="h-4 w-4 mr-2" />
                      Histórico
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
                <AlertTriangle className="h-4 w-4 text-blue-600 mr-3" />
                <span className="text-sm">{servico}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}