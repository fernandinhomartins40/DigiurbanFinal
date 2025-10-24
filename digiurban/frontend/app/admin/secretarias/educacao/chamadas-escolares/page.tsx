'use client'

import { useAdminAuth } from '@/contexts/AdminAuthContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  GraduationCap,
  Calendar,
  Clock,
  Users,
  CheckCircle,
  AlertCircle,
  Search,
  Filter,
  Download,
  UserCheck,
  UserX,
  School,
  Plus,
  FileText,
  MapPin
} from 'lucide-react'
import { useState } from 'react'
import { useSchools, useAttendance } from '@/hooks/api/education'
import { useToast } from '@/hooks/use-toast'

const escolasMock = [
  {
    id: 1,
    nome: 'EMEF João da Silva',
    endereco: 'Rua das Escolas, 100',
    turmas: 12,
    alunos: 280,
    presencaMedia: 92
  },
  {
    id: 2,
    nome: 'EMEI Maria Montessori',
    endereco: 'Av. Educação, 250',
    turmas: 8,
    alunos: 160,
    presencaMedia: 95
  },
  {
    id: 3,
    nome: 'EMEF Paulo Freire',
    endereco: 'Rua Pedagogia, 75',
    turmas: 15,
    alunos: 350,
    presencaMedia: 89
  }
]

const chamadasHoje = [
  {
    id: 1,
    escola: 'EMEF João da Silva',
    turma: '5º Ano A',
    professor: 'Ana Costa Silva',
    totalAlunos: 25,
    presentes: 23,
    ausentes: 2,
    horario: '08:00',
    status: 'realizada'
  },
  {
    id: 2,
    escola: 'EMEI Maria Montessori',
    turma: 'Pré II B',
    professor: 'Carlos Lima Santos',
    totalAlunos: 20,
    presentes: 18,
    ausentes: 2,
    horario: '13:30',
    status: 'realizada'
  },
  {
    id: 3,
    escola: 'EMEF Paulo Freire',
    turma: '8º Ano C',
    professor: 'Maria Oliveira',
    totalAlunos: 28,
    presentes: 26,
    ausentes: 2,
    horario: '14:00',
    status: 'pendente'
  }
]

const alunosAusentes = [
  {
    id: 1,
    nome: 'João Santos Silva',
    turma: '5º Ano A',
    escola: 'EMEF João da Silva',
    ausenciasConsecutivas: 2,
    totalAusencias: 8,
    responsavel: 'Maria Silva',
    telefone: '(11) 99999-0001',
    observacoes: 'Aluno gripado'
  },
  {
    id: 2,
    nome: 'Ana Costa Lima',
    turma: 'Pré II B',
    escola: 'EMEI Maria Montessori',
    ausenciasConsecutivas: 1,
    totalAusencias: 3,
    responsavel: 'Pedro Lima',
    telefone: '(11) 99999-0002',
    observacoes: 'Consulta médica'
  },
  {
    id: 3,
    nome: 'Carlos Oliveira',
    turma: '8º Ano C',
    escola: 'EMEF Paulo Freire',
    ausenciasConsecutivas: 5,
    totalAusencias: 15,
    responsavel: 'Rosa Oliveira',
    telefone: '(11) 99999-0003',
    observacoes: 'Evasão escolar'
  }
]

const servicosGerados = [
  'Consulta de Frequência Escolar',
  'Justificativa de Falta',
  'Atestado de Frequência',
  'Relatório de Presença',
  'Busca Ativa Escolar',
  'Acompanhamento de Evasão',
  'Chamada Escolar Online'
]

// Alias para compatibilidade com o código do componente
const escolas = escolasMock

export default function ChamadasEscolaresPage() {
  const { user } = useAdminAuth()
  const [novaChamada, setNovaChamada] = useState({
    escola: '',
    turma: '',
    data: '',
    horario: ''
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'realizada':
        return <Badge className="bg-green-500 text-white">Realizada</Badge>
      case 'pendente':
        return <Badge className="bg-yellow-500 text-white">Pendente</Badge>
      case 'atrasada':
        return <Badge variant="destructive">Atrasada</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getPresencaBadge = (percentual: number) => {
    if (percentual >= 95) return <Badge className="bg-green-500 text-white">{percentual}%</Badge>
    if (percentual >= 85) return <Badge className="bg-yellow-500 text-white">{percentual}%</Badge>
    return <Badge variant="destructive">{percentual}%</Badge>
  }

  const getAusenciasBadge = (ausencias: number) => {
    if (ausencias >= 10) return <Badge variant="destructive">Crítico</Badge>
    if (ausencias >= 5) return <Badge className="bg-yellow-500 text-white">Atenção</Badge>
    return <Badge variant="secondary">Normal</Badge>
  }

  const calcularPercentualPresenca = (presentes: number, total: number) => {
    return Math.round((presentes / total) * 100)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <UserCheck className="h-8 w-8 text-blue-600 mr-3" />
            Chamadas Escolares
          </h1>
          <p className="text-gray-600 mt-1">
            Sistema de presença, controle de faltas e busca ativa escolar
          </p>
        </div>
        <Badge variant="outline" className="text-blue-600 border-blue-200">
          Presença Escolar
        </Badge>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Escolas Ativas</CardTitle>
            <School className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">
              35 turmas total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alunos Matriculados</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">790</div>
            <p className="text-xs text-muted-foreground">
              Rede municipal
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Presença Hoje</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">92%</div>
            <p className="text-xs text-muted-foreground">
              723 alunos presentes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ausências</CardTitle>
            <UserX className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">67</div>
            <p className="text-xs text-muted-foreground">
              6 críticas
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Nova Chamada */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Plus className="h-5 w-5 mr-2" />
              Registrar Chamada
            </CardTitle>
            <CardDescription>
              Fazer chamada escolar manual
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="escola">Escola</Label>
              <Select value={novaChamada.escola} onValueChange={(value) => setNovaChamada(prev => ({ ...prev, escola: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a escola" />
                </SelectTrigger>
                <SelectContent>
                  {escolas.map((escola) => (
                    <SelectItem key={escola.id} value={escola.nome}>
                      {escola.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="turma">Turma</Label>
              <Input
                id="turma"
                placeholder="Ex: 5º Ano A"
                value={novaChamada.turma}
                onChange={(e) => setNovaChamada(prev => ({ ...prev, turma: e.target.value }))}
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="data">Data</Label>
                <Input
                  id="data"
                  type="date"
                  value={novaChamada.data}
                  onChange={(e) => setNovaChamada(prev => ({ ...prev, data: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="horario">Horário</Label>
                <Input
                  id="horario"
                  type="time"
                  value={novaChamada.horario}
                  onChange={(e) => setNovaChamada(prev => ({ ...prev, horario: e.target.value }))}
                />
              </div>
            </div>

            <Button className="w-full">
              <UserCheck className="h-4 w-4 mr-2" />
              Iniciar Chamada
            </Button>
          </CardContent>
        </Card>

        {/* Chamadas de Hoje */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Chamadas de Hoje</CardTitle>
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
              {chamadasHoje.map((chamada) => (
                <div key={chamada.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-semibold">{chamada.turma}</h4>
                      <p className="text-sm text-gray-600">{chamada.escola} - {chamada.professor}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getPresencaBadge(calcularPercentualPresenca(chamada.presentes, chamada.totalAlunos))}
                      {getStatusBadge(chamada.status)}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Presentes:</span>
                      <p className="font-medium text-green-600">{chamada.presentes}/{chamada.totalAlunos}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Ausentes:</span>
                      <p className="font-medium text-red-600">{chamada.ausentes}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Horário:</span>
                      <p className="font-medium">{chamada.horario}</p>
                    </div>
                  </div>

                  <div className="flex space-x-2 mt-3">
                    <Button size="sm" variant="outline">
                      <FileText className="h-4 w-4 mr-2" />
                      Detalhes
                    </Button>
                    <Button size="sm" variant="outline">
                      <AlertCircle className="h-4 w-4 mr-2" />
                      Ausentes
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Escolas da Rede */}
        <Card>
          <CardHeader>
            <CardTitle>Escolas da Rede Municipal</CardTitle>
            <CardDescription>
              Visão geral da presença por escola
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {escolas.map((escola) => (
                <div key={escola.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="font-semibold">{escola.nome}</h4>
                      <p className="text-sm text-gray-600 flex items-center">
                        <MapPin className="h-3 w-3 mr-1" />
                        {escola.endereco}
                      </p>
                    </div>
                    {getPresencaBadge(escola.presencaMedia)}
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Turmas:</span>
                      <p className="font-medium">{escola.turmas}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Alunos:</span>
                      <p className="font-medium">{escola.alunos}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Presença Média:</span>
                      <p className="font-medium">{escola.presencaMedia}%</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Alunos com Ausências */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertCircle className="h-5 w-5 mr-2 text-red-600" />
              Alunos com Ausências
            </CardTitle>
            <CardDescription>
              Casos que requerem acompanhamento
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {alunosAusentes.map((aluno) => (
                <div key={aluno.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="font-semibold">{aluno.nome}</h4>
                      <p className="text-sm text-gray-600">{aluno.turma} - {aluno.escola}</p>
                    </div>
                    {getAusenciasBadge(aluno.totalAusencias)}
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm mb-2">
                    <div>
                      <span className="text-gray-500">Ausências totais:</span>
                      <p className="font-medium text-red-600">{aluno.totalAusencias}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Consecutivas:</span>
                      <p className="font-medium">{aluno.ausenciasConsecutivas}</p>
                    </div>
                  </div>

                  <div className="text-sm mb-3">
                    <span className="text-gray-500">Responsável:</span>
                    <p className="font-medium">{aluno.responsavel} - {aluno.telefone}</p>
                  </div>

                  <p className="text-sm text-gray-600 mb-3">{aluno.observacoes}</p>

                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">
                      <UserCheck className="h-4 w-4 mr-2" />
                      Contatar
                    </Button>
                    <Button size="sm" variant="outline">
                      <FileText className="h-4 w-4 mr-2" />
                      Busca Ativa
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
                <UserCheck className="h-4 w-4 text-blue-600 mr-3" />
                <span className="text-sm">{servico}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}