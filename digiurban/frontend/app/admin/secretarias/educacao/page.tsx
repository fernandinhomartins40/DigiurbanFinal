'use client'

import { useAdminAuth } from '@/contexts/AdminAuthContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  GraduationCap,
  School,
  Users,
  BookOpen,
  Calendar,
  Bus,
  Utensils,
  Award,
  Computer,
  FileText,
  Plus
} from 'lucide-react'
import Link from 'next/link'

const educacaoModules = [
  {
    title: 'Escolas Municipais',
    description: 'Gestão de unidades escolares e infraestrutura',
    href: '/admin/secretarias/educacao/gestao-escolar',
    icon: School,
    color: 'bg-blue-100 text-blue-800',
    stats: { escolas: 18, alunos: 4520, turmas: 198 }
  },
  {
    title: 'Matrícula Escolar',
    description: 'Sistema de matrículas e remanejamentos',
    href: '/admin/secretarias/educacao/matricula-alunos',
    icon: Users,
    color: 'bg-green-100 text-green-800',
    stats: { matriculas: 4520, aguardando: 89, transferencias: 23 }
  },
  {
    title: 'Currículo e Ensino',
    description: 'Gestão curricular e metodologias pedagógicas',
    href: '/admin/secretarias/educacao/curriculo',
    icon: BookOpen,
    color: 'bg-purple-100 text-purple-800',
    stats: { disciplinas: 45, projetos: 12, avaliacoes: 156 }
  },
  {
    title: 'Calendário Escolar',
    description: 'Organização do ano letivo e eventos',
    href: '/admin/secretarias/educacao/calendario-escolar',
    icon: Calendar,
    color: 'bg-orange-100 text-orange-800',
    stats: { dias_letivos: 200, eventos: 24, feriados: 12 }
  },
  {
    title: 'Transporte Escolar',
    description: 'Gestão de rotas e veículos escolares',
    href: '/admin/secretarias/educacao/transporte-escolar',
    icon: Bus,
    color: 'bg-yellow-100 text-yellow-800',
    stats: { rotas: 12, veiculos: 8, estudantes: 890 }
  },
  {
    title: 'Merenda Escolar',
    description: 'Nutrição e alimentação dos estudantes',
    href: '/admin/secretarias/educacao/merenda-escolar',
    icon: Utensils,
    color: 'bg-red-100 text-red-800',
    stats: { refeicoes_dia: 4520, cardapios: 30, nutricionistas: 3 }
  },
  {
    title: 'Avaliação e Desempenho',
    description: 'Indicadores educacionais e IDEB',
    href: '/admin/secretarias/educacao/avaliacao',
    icon: Award,
    color: 'bg-teal-100 text-teal-800',
    stats: { ideb: 6.2, aprovacao: '94%', evasao: '2.1%' }
  },
  {
    title: 'Tecnologia Educacional',
    description: 'Laboratórios de informática e EaD',
    href: '/admin/secretarias/educacao/tecnologia',
    icon: Computer,
    color: 'bg-indigo-100 text-indigo-800',
    stats: { laboratorios: 15, computadores: 240, tablets: 120 }
  }
]

export default function SecretariaEducacaoPage() {
  const { user } = useAdminAuth()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <GraduationCap className="h-8 w-8 text-blue-600 mr-3" />
            Secretaria Municipal de Educação
          </h1>
          <p className="text-gray-600 mt-1">
            Gestão completa da rede municipal de ensino
          </p>
        </div>
        <Badge variant="outline" className="text-blue-600 border-blue-200">
          Rede Municipal
        </Badge>
      </div>

      {/* Estatísticas Gerais */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Escolas</CardTitle>
            <School className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18</div>
            <p className="text-xs text-muted-foreground">
              15 urbanas, 3 rurais
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alunos Matriculados</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.520</div>
            <p className="text-xs text-muted-foreground">
              +120 novos este ano
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Professores</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">289</div>
            <p className="text-xs text-muted-foreground">
              Ratio: 15.6 alunos/professor
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">IDEB Municipal</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">6.2</div>
            <p className="text-xs text-muted-foreground">
              Meta 2024: 6.5
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Módulos Especializados */}
      <div>
        <h2 className="text-2xl font-semibold mb-6">Módulos Especializados</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {educacaoModules.map((module) => (
            <Card key={module.href} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${module.color}`}>
                      <module.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{module.title}</CardTitle>
                    </div>
                  </div>
                </div>
                <CardDescription className="mt-2">
                  {module.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 mb-4">
                  {Object.entries(module.stats).map(([key, value]) => (
                    <div key={key} className="flex justify-between text-sm">
                      <span className="text-gray-600 capitalize">{key.replace('_', ' ')}:</span>
                      <span className="font-medium">{value}</span>
                    </div>
                  ))}
                </div>
                <Link href={module.href}>
                  <Button className="w-full" variant="outline">
                    Acessar Módulo
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Indicadores Educacionais */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Indicadores de Qualidade</CardTitle>
            <CardDescription>
              Principais métricas do ensino municipal
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Taxa de Aprovação</span>
                <span className="font-semibold text-green-600">94.2%</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Taxa de Evasão</span>
                <span className="font-semibold text-red-600">2.1%</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Distorção Idade-Série</span>
                <span className="font-semibold text-yellow-600">8.5%</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Nota SAEB (Português)</span>
                <span className="font-semibold">245</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Nota SAEB (Matemática)</span>
                <span className="font-semibold">238</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Distribuição por Modalidade</CardTitle>
            <CardDescription>
              Alunos por etapa de ensino
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Creche (0-3 anos)</span>
                <span className="font-semibold">380 alunos</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Pré-escola (4-5 anos)</span>
                <span className="font-semibold">560 alunos</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Ensino Fundamental I</span>
                <span className="font-semibold">2.890 alunos</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Ensino Fundamental II</span>
                <span className="font-semibold">690 alunos</span>
              </div>
              <div className="flex justify-between items-center">
                <span>EJA</span>
                <span className="font-semibold">120 alunos</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Ações Rápidas */}
      <Card>
        <CardHeader>
          <CardTitle>Ações Rápidas</CardTitle>
          <CardDescription>
            Acesso direto às funcionalidades mais utilizadas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Button className="h-20 flex flex-col" variant="outline">
              <Plus className="h-6 w-6 mb-2" />
              <span>Nova Matrícula</span>
            </Button>
            <Button className="h-20 flex flex-col" variant="outline">
              <FileText className="h-6 w-6 mb-2" />
              <span>Relatório Censo</span>
            </Button>
            <Button className="h-20 flex flex-col" variant="outline">
              <Calendar className="h-6 w-6 mb-2" />
              <span>Calendário Letivo</span>
            </Button>
            <Button className="h-20 flex flex-col" variant="outline">
              <Award className="h-6 w-6 mb-2" />
              <span>Consultar IDEB</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}