'use client'

import { useAdminAuth } from '@/contexts/AdminAuthContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  School,
  Users,
  GraduationCap,
  Building,
  UserCheck,
  FileText,
  BarChart3,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Clock,
  Award,
  BookOpen,
  Target,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Search,
  Filter,
  Download,
  Plus
} from 'lucide-react'
import { useState } from 'react'

const escolasRede = [
  {
    id: 1,
    nome: 'EMEF João da Silva',
    codigo: 'EMF001',
    endereco: 'Rua das Escolas, 100',
    diretor: 'Ana Maria Santos',
    telefone: '(11) 3333-0001',
    email: 'emef.joao@educacao.gov.br',
    totalAlunos: 280,
    totalProfessores: 18,
    totalTurmas: 12,
    infraestrutura: 'completa',
    status: 'ativa'
  },
  {
    id: 2,
    nome: 'EMEI Maria Montessori',
    codigo: 'EMI002',
    endereco: 'Av. Educação, 250',
    diretor: 'Carlos Lima Costa',
    telefone: '(11) 3333-0002',
    email: 'emei.maria@educacao.gov.br',
    totalAlunos: 160,
    totalProfessores: 12,
    totalTurmas: 8,
    infraestrutura: 'basica',
    status: 'ativa'
  },
  {
    id: 3,
    nome: 'EMEF Paulo Freire',
    codigo: 'EMF003',
    endereco: 'Rua Pedagogia, 75',
    diretor: 'Maria Oliveira Silva',
    telefone: '(11) 3333-0003',
    email: 'emef.paulo@educacao.gov.br',
    totalAlunos: 350,
    totalProfessores: 22,
    totalTurmas: 15,
    infraestrutura: 'completa',
    status: 'reforma'
  }
]

const professoresRede = [
  {
    id: 1,
    nome: 'Ana Costa Silva',
    disciplina: 'Português',
    escola: 'EMEF João da Silva',
    cargaHoraria: 40,
    situacao: 'efetivo',
    formacao: 'Licenciatura em Letras',
    telefone: '(11) 99999-1001'
  },
  {
    id: 2,
    nome: 'Carlos Lima Santos',
    disciplina: 'Matemática',
    escola: 'EMEI Maria Montessori',
    cargaHoraria: 30,
    situacao: 'contrato',
    formacao: 'Licenciatura em Matemática',
    telefone: '(11) 99999-1002'
  },
  {
    id: 3,
    nome: 'Maria Oliveira',
    disciplina: 'História',
    escola: 'EMEF Paulo Freire',
    cargaHoraria: 40,
    situacao: 'efetivo',
    formacao: 'Licenciatura em História',
    telefone: '(11) 99999-1003'
  }
]

const relatoriosDisponiveis = [
  {
    id: 1,
    tipo: 'Boletim Escolar',
    descricao: 'Notas e frequência do aluno',
    aluno: 'João Silva Santos',
    escola: 'EMEF João da Silva',
    periodo: '1º Bimestre 2024',
    status: 'disponivel'
  },
  {
    id: 2,
    tipo: 'Histórico Escolar',
    descricao: 'Histórico completo do aluno',
    aluno: 'Ana Costa Lima',
    escola: 'EMEI Maria Montessori',
    periodo: 'Completo',
    status: 'processando'
  },
  {
    id: 3,
    tipo: 'Certificado de Conclusão',
    descricao: 'Certificado de conclusão do ensino',
    aluno: 'Carlos Oliveira',
    escola: 'EMEF Paulo Freire',
    periodo: '9º Ano - 2023',
    status: 'disponivel'
  }
]

const indicadoresEducacionais = {
  aprovacao: 94,
  evasao: 3,
  distorcaoIdadeSerie: 8,
  professorFormacao: 96,
  infraestruturaAdequada: 78,
  mediaIdeb: 6.2
}

const servicosGerados = [
  'Relatório Escolar',
  'Histórico do Aluno',
  'Boletim Escolar',
  'Certificado de Conclusão',
  'Declaração de Vínculo Escolar',
  'Transferência de Documentos',
  'Consulta de Notas'
]

export default function GestaoEscolarPage() {
  const { user } = useAdminAuth()
  const [filtroEscola, setFiltroEscola] = useState('')
  const [novoRelatorio, setNovoRelatorio] = useState({
    tipo: '',
    aluno: '',
    escola: '',
    periodo: ''
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ativa':
        return <Badge className="bg-green-500 text-white">Ativa</Badge>
      case 'reforma':
        return <Badge className="bg-yellow-500 text-white">Em Reforma</Badge>
      case 'inativa':
        return <Badge variant="destructive">Inativa</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getInfraestruturaBadge = (infraestrutura: string) => {
    switch (infraestrutura) {
      case 'completa':
        return <Badge className="bg-green-500 text-white">Completa</Badge>
      case 'basica':
        return <Badge className="bg-yellow-500 text-white">Básica</Badge>
      case 'inadequada':
        return <Badge variant="destructive">Inadequada</Badge>
      default:
        return <Badge variant="outline">{infraestrutura}</Badge>
    }
  }

  const getSituacaoBadge = (situacao: string) => {
    switch (situacao) {
      case 'efetivo':
        return <Badge className="bg-green-500 text-white">Efetivo</Badge>
      case 'contrato':
        return <Badge className="bg-blue-500 text-white">Contrato</Badge>
      case 'substituto':
        return <Badge className="bg-yellow-500 text-white">Substituto</Badge>
      default:
        return <Badge variant="outline">{situacao}</Badge>
    }
  }

  const getRelatorioStatusBadge = (status: string) => {
    switch (status) {
      case 'disponivel':
        return <Badge className="bg-green-500 text-white">Disponível</Badge>
      case 'processando':
        return <Badge className="bg-yellow-500 text-white">Processando</Badge>
      case 'erro':
        return <Badge variant="destructive">Erro</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getIndicadorColor = (valor: number, tipo: string) => {
    if (tipo === 'aprovacao' || tipo === 'professorFormacao' || tipo === 'infraestrutura') {
      if (valor >= 90) return 'text-green-600'
      if (valor >= 70) return 'text-yellow-600'
      return 'text-red-600'
    }
    if (tipo === 'evasao' || tipo === 'distorcao') {
      if (valor <= 5) return 'text-green-600'
      if (valor <= 10) return 'text-yellow-600'
      return 'text-red-600'
    }
    if (tipo === 'ideb') {
      if (valor >= 6.0) return 'text-green-600'
      if (valor >= 4.0) return 'text-yellow-600'
      return 'text-red-600'
    }
    return 'text-gray-600'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <School className="h-8 w-8 text-blue-600 mr-3" />
            Gestão Escolar
          </h1>
          <p className="text-gray-600 mt-1">
            Administração da rede municipal, professores, infraestrutura e relatórios
          </p>
        </div>
        <Badge variant="outline" className="text-blue-600 border-blue-200">
          Rede Municipal
        </Badge>
      </div>

      {/* Indicadores Educacionais */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Aprovação</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getIndicadorColor(indicadoresEducacionais.aprovacao, 'aprovacao')}`}>
              {indicadoresEducacionais.aprovacao}%
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Evasão</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getIndicadorColor(indicadoresEducacionais.evasao, 'evasao')}`}>
              {indicadoresEducacionais.evasao}%
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Distorção Idade-Série</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getIndicadorColor(indicadoresEducacionais.distorcaoIdadeSerie, 'distorcao')}`}>
              {indicadoresEducacionais.distorcaoIdadeSerie}%
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Prof. com Formação</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getIndicadorColor(indicadoresEducacionais.professorFormacao, 'professorFormacao')}`}>
              {indicadoresEducacionais.professorFormacao}%
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Infraestrutura</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getIndicadorColor(indicadoresEducacionais.infraestruturaAdequada, 'infraestrutura')}`}>
              {indicadoresEducacionais.infraestruturaAdequada}%
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">IDEB</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getIndicadorColor(indicadoresEducacionais.mediaIdeb, 'ideb')}`}>
              {indicadoresEducacionais.mediaIdeb}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Gerar Relatório */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Plus className="h-5 w-5 mr-2" />
              Gerar Relatório
            </CardTitle>
            <CardDescription>
              Emitir documentos escolares
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="tipo">Tipo de Relatório</Label>
              <Select value={novoRelatorio.tipo} onValueChange={(value) => setNovoRelatorio(prev => ({ ...prev, tipo: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="boletim">Boletim Escolar</SelectItem>
                  <SelectItem value="historico">Histórico Escolar</SelectItem>
                  <SelectItem value="certificado">Certificado de Conclusão</SelectItem>
                  <SelectItem value="declaracao">Declaração de Matrícula</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="aluno">Nome do Aluno</Label>
              <Input
                id="aluno"
                placeholder="Digite o nome do aluno"
                value={novoRelatorio.aluno}
                onChange={(e) => setNovoRelatorio(prev => ({ ...prev, aluno: e.target.value }))}
              />
            </div>

            <div>
              <Label htmlFor="escola">Escola</Label>
              <Select value={novoRelatorio.escola} onValueChange={(value) => setNovoRelatorio(prev => ({ ...prev, escola: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a escola" />
                </SelectTrigger>
                <SelectContent>
                  {escolasRede.map((escola) => (
                    <SelectItem key={escola.id} value={escola.nome}>
                      {escola.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="periodo">Período</Label>
              <Select value={novoRelatorio.periodo} onValueChange={(value) => setNovoRelatorio(prev => ({ ...prev, periodo: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1bim2024">1º Bimestre 2024</SelectItem>
                  <SelectItem value="2bim2024">2º Bimestre 2024</SelectItem>
                  <SelectItem value="ano2024">Ano Letivo 2024</SelectItem>
                  <SelectItem value="completo">Histórico Completo</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button className="w-full">
              <FileText className="h-4 w-4 mr-2" />
              Gerar Relatório
            </Button>
          </CardContent>
        </Card>

        {/* Escolas da Rede */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Escolas da Rede Municipal</CardTitle>
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
              {escolasRede.map((escola) => (
                <div key={escola.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-semibold">{escola.nome}</h4>
                      <p className="text-sm text-gray-600">{escola.codigo} - {escola.diretor}</p>
                    </div>
                    <div className="flex space-x-2">
                      {getInfraestruturaBadge(escola.infraestrutura)}
                      {getStatusBadge(escola.status)}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-sm mb-3">
                    <div>
                      <span className="text-gray-500">Alunos:</span>
                      <p className="font-medium">{escola.totalAlunos}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Professores:</span>
                      <p className="font-medium">{escola.totalProfessores}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Turmas:</span>
                      <p className="font-medium">{escola.totalTurmas}</p>
                    </div>
                  </div>

                  <div className="text-sm mb-3">
                    <p className="text-gray-600 flex items-center">
                      <MapPin className="h-3 w-3 mr-1" />
                      {escola.endereco}
                    </p>
                    <p className="text-gray-600 flex items-center">
                      <Phone className="h-3 w-3 mr-1" />
                      {escola.telefone}
                    </p>
                  </div>

                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Relatórios
                    </Button>
                    <Button size="sm" variant="outline">
                      <Building className="h-4 w-4 mr-2" />
                      Infraestrutura
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Professores da Rede */}
        <Card>
          <CardHeader>
            <CardTitle>Professores da Rede</CardTitle>
            <CardDescription>
              Corpo docente municipal
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {professoresRede.map((professor) => (
                <div key={professor.id} className="border rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="font-semibold text-sm">{professor.nome}</h4>
                      <p className="text-sm text-gray-600">{professor.disciplina}</p>
                    </div>
                    {getSituacaoBadge(professor.situacao)}
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Escola:</span>
                      <p className="font-medium">{professor.escola}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Carga Horária:</span>
                      <p className="font-medium">{professor.cargaHoraria}h</p>
                    </div>
                  </div>

                  <p className="text-xs text-gray-600 mt-2">{professor.formacao}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Relatórios Disponíveis */}
        <Card>
          <CardHeader>
            <CardTitle>Relatórios Disponíveis</CardTitle>
            <CardDescription>
              Documentos prontos para download
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {relatoriosDisponiveis.map((relatorio) => (
                <div key={relatorio.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="font-semibold">{relatorio.tipo}</h4>
                      <p className="text-sm text-gray-600">{relatorio.aluno}</p>
                    </div>
                    {getRelatorioStatusBadge(relatorio.status)}
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                    <div>
                      <span className="text-gray-500">Escola:</span>
                      <p className="font-medium">{relatorio.escola}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Período:</span>
                      <p className="font-medium">{relatorio.periodo}</p>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 mb-3">{relatorio.descricao}</p>

                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline" disabled={relatorio.status !== 'disponivel'}>
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                    <Button size="sm" variant="outline">
                      <FileText className="h-4 w-4 mr-2" />
                      Visualizar
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
                <School className="h-4 w-4 text-blue-600 mr-3" />
                <span className="text-sm">{servico}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}