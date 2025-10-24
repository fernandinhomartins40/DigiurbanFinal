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
  GraduationCap,
  UserPlus,
  Users,
  School,
  FileText,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Clock,
  CheckCircle,
  AlertCircle,
  Search,
  Filter,
  Download,
  Plus,
  ArrowRightLeft
} from 'lucide-react'
import { useState } from 'react'

const matriculasRecentes = [
  {
    id: 1,
    numeroMatricula: 'MAT-2024-0001',
    nomeAluno: 'João Silva Santos',
    dataNascimento: '2010-05-15',
    responsavel: 'Maria Silva',
    telefone: '(11) 99999-0001',
    escola: 'EMEF João da Silva',
    serie: '8º Ano',
    status: 'ativa',
    dataMatricula: '2024-01-15'
  },
  {
    id: 2,
    numeroMatricula: 'MAT-2024-0002',
    nomeAluno: 'Ana Costa Lima',
    dataNascimento: '2016-08-22',
    responsavel: 'Pedro Lima',
    telefone: '(11) 99999-0002',
    escola: 'EMEI Maria Montessori',
    serie: 'Pré II',
    status: 'ativa',
    dataMatricula: '2024-01-16'
  },
  {
    id: 3,
    numeroMatricula: 'MAT-2024-0003',
    nomeAluno: 'Carlos Oliveira',
    dataNascimento: '2012-03-10',
    responsavel: 'Rosa Oliveira',
    telefone: '(11) 99999-0003',
    escola: 'EMEF Paulo Freire',
    serie: '6º Ano',
    status: 'transferido',
    dataMatricula: '2024-01-10'
  }
]

const transferenciasAndamento = [
  {
    id: 1,
    nomeAluno: 'Lucas Santos',
    escolaOrigem: 'EMEF João da Silva',
    escolaDestino: 'EMEF Paulo Freire',
    motivo: 'Mudança de endereço',
    datasolicitacao: '2024-01-20',
    status: 'pendente',
    responsavel: 'Ana Santos'
  },
  {
    id: 2,
    nomeAluno: 'Beatriz Costa',
    escolaOrigem: 'EMEI Maria Montessori',
    escolaDestino: 'EMEF João da Silva',
    motivo: 'Progressão para Ensino Fundamental',
    datasolicitacao: '2024-01-18',
    status: 'aprovada',
    responsavel: 'Marcos Costa'
  }
]

const vagasDisponiveis = [
  {
    escola: 'EMEF João da Silva',
    series: [
      { nome: '1º Ano', vagas: 5, capacidade: 25 },
      { nome: '2º Ano', vagas: 8, capacidade: 25 },
      { nome: '3º Ano', vagas: 2, capacidade: 25 },
      { nome: '4º Ano', vagas: 0, capacidade: 25 },
      { nome: '5º Ano', vagas: 3, capacidade: 25 }
    ]
  },
  {
    escola: 'EMEI Maria Montessori',
    series: [
      { nome: 'Berçário', vagas: 10, capacidade: 20 },
      { nome: 'Maternal I', vagas: 6, capacidade: 20 },
      { nome: 'Maternal II', vagas: 4, capacidade: 20 },
      { nome: 'Pré I', vagas: 1, capacidade: 20 },
      { nome: 'Pré II', vagas: 0, capacidade: 20 }
    ]
  }
]

const servicosGerados = [
  'Nova Matrícula',
  'Transferência Escolar',
  'Rematrícula',
  'Segunda Via de Documentos',
  'Declaração de Matrícula',
  'Histórico Escolar',
  'Consulta de Vagas'
]

export default function MatriculaAlunosPage() {
  const { user } = useAdminAuth()
  const [novaMatricula, setNovaMatricula] = useState({
    nomeAluno: '',
    dataNascimento: '',
    nomeResponsavel: '',
    telefone: '',
    email: '',
    endereco: '',
    escola: '',
    serie: '',
    observacoes: ''
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ativa':
        return <Badge className="bg-green-500 text-white">Ativa</Badge>
      case 'transferido':
        return <Badge className="bg-blue-500 text-white">Transferido</Badge>
      case 'cancelada':
        return <Badge variant="destructive">Cancelada</Badge>
      case 'pendente':
        return <Badge className="bg-yellow-500 text-white">Pendente</Badge>
      case 'aprovada':
        return <Badge className="bg-green-500 text-white">Aprovada</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getVagasBadge = (vagas: number) => {
    if (vagas === 0) return <Badge variant="destructive">Lotada</Badge>
    if (vagas <= 3) return <Badge className="bg-yellow-500 text-white">{vagas} vagas</Badge>
    return <Badge className="bg-green-500 text-white">{vagas} vagas</Badge>
  }

  const calcularIdade = (dataNascimento: string) => {
    const hoje = new Date()
    const nascimento = new Date(dataNascimento)
    const idade = hoje.getFullYear() - nascimento.getFullYear()
    const mes = hoje.getMonth() - nascimento.getMonth()

    if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
      return idade - 1
    }
    return idade
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <UserPlus className="h-8 w-8 text-blue-600 mr-3" />
            Matrícula de Alunos
          </h1>
          <p className="text-gray-600 mt-1">
            Sistema completo de matrícula, transferências e documentos oficiais
          </p>
        </div>
        <Badge variant="outline" className="text-blue-600 border-blue-200">
          Matrículas 2024
        </Badge>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Matrículas Ativas</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1.247</div>
            <p className="text-xs text-muted-foreground">
              +23 este mês
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Transferências</CardTitle>
            <ArrowRightLeft className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18</div>
            <p className="text-xs text-muted-foreground">
              Em andamento
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vagas Disponíveis</CardTitle>
            <School className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">67</div>
            <p className="text-xs text-muted-foreground">
              Em todas as escolas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Documentos Pendentes</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">
              Aguardando entrega
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Nova Matrícula */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Plus className="h-5 w-5 mr-2" />
              Nova Matrícula
            </CardTitle>
            <CardDescription>
              Cadastrar novo aluno na rede municipal
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="nomeAluno">Nome do Aluno</Label>
              <Input
                id="nomeAluno"
                placeholder="Nome completo do aluno"
                value={novaMatricula.nomeAluno}
                onChange={(e) => setNovaMatricula(prev => ({ ...prev, nomeAluno: e.target.value }))}
              />
            </div>

            <div>
              <Label htmlFor="dataNascimento">Data de Nascimento</Label>
              <Input
                id="dataNascimento"
                type="date"
                value={novaMatricula.dataNascimento}
                onChange={(e) => setNovaMatricula(prev => ({ ...prev, dataNascimento: e.target.value }))}
              />
            </div>

            <div>
              <Label htmlFor="nomeResponsavel">Responsável</Label>
              <Input
                id="nomeResponsavel"
                placeholder="Nome do responsável"
                value={novaMatricula.nomeResponsavel}
                onChange={(e) => setNovaMatricula(prev => ({ ...prev, nomeResponsavel: e.target.value }))}
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="telefone">Telefone</Label>
                <Input
                  id="telefone"
                  placeholder="(11) 99999-9999"
                  value={novaMatricula.telefone}
                  onChange={(e) => setNovaMatricula(prev => ({ ...prev, telefone: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="email@exemplo.com"
                  value={novaMatricula.email}
                  onChange={(e) => setNovaMatricula(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="endereco">Endereço</Label>
              <Input
                id="endereco"
                placeholder="Endereço completo"
                value={novaMatricula.endereco}
                onChange={(e) => setNovaMatricula(prev => ({ ...prev, endereco: e.target.value }))}
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="escola">Escola</Label>
                <Select value={novaMatricula.escola} onValueChange={(value) => setNovaMatricula(prev => ({ ...prev, escola: value }))}>
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
                <Select value={novaMatricula.serie} onValueChange={(value) => setNovaMatricula(prev => ({ ...prev, serie: value }))}>
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

            <Button className="w-full">
              <UserPlus className="h-4 w-4 mr-2" />
              Realizar Matrícula
            </Button>
          </CardContent>
        </Card>

        {/* Matrículas Recentes */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Matrículas Recentes</CardTitle>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Search className="h-4 w-4 mr-2" />
                  Buscar
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Exportar
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {matriculasRecentes.map((matricula) => (
                <div key={matricula.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-semibold">{matricula.nomeAluno}</h4>
                      <p className="text-sm text-gray-600">
                        {matricula.numeroMatricula} • {calcularIdade(matricula.dataNascimento)} anos
                      </p>
                    </div>
                    {getStatusBadge(matricula.status)}
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                    <div>
                      <span className="text-gray-500">Escola:</span>
                      <p className="font-medium">{matricula.escola}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Série:</span>
                      <p className="font-medium">{matricula.serie}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Responsável:</span>
                      <p className="font-medium">{matricula.responsavel}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Telefone:</span>
                      <p className="font-medium">{matricula.telefone}</p>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">
                      <FileText className="h-4 w-4 mr-2" />
                      Documentos
                    </Button>
                    <Button size="sm" variant="outline">
                      <ArrowRightLeft className="h-4 w-4 mr-2" />
                      Transferir
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Transferências em Andamento */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <ArrowRightLeft className="h-5 w-5 mr-2" />
              Transferências em Andamento
            </CardTitle>
            <CardDescription>
              Solicitações de transferência entre escolas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {transferenciasAndamento.map((transferencia) => (
                <div key={transferencia.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">{transferencia.nomeAluno}</h4>
                    {getStatusBadge(transferencia.status)}
                  </div>

                  <div className="text-sm mb-2">
                    <p className="text-gray-600">
                      <span className="font-medium">De:</span> {transferencia.escolaOrigem}
                    </p>
                    <p className="text-gray-600">
                      <span className="font-medium">Para:</span> {transferencia.escolaDestino}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                    <div>
                      <span className="text-gray-500">Motivo:</span>
                      <p className="font-medium">{transferencia.motivo}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Solicitação:</span>
                      <p className="font-medium">{transferencia.datasolicitacao}</p>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Aprovar
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

        {/* Vagas Disponíveis */}
        <Card>
          <CardHeader>
            <CardTitle>Vagas Disponíveis por Escola</CardTitle>
            <CardDescription>
              Capacidade atual de cada unidade escolar
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {vagasDisponiveis.map((escola, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-3">{escola.escola}</h4>
                  <div className="space-y-2">
                    {escola.series.map((serie, serieIndex) => (
                      <div key={serieIndex} className="flex items-center justify-between">
                        <span className="text-sm font-medium">{serie.nome}</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-600">
                            {serie.capacidade - serie.vagas}/{serie.capacidade}
                          </span>
                          {getVagasBadge(serie.vagas)}
                        </div>
                      </div>
                    ))}
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
                <UserPlus className="h-4 w-4 text-blue-600 mr-3" />
                <span className="text-sm">{servico}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}