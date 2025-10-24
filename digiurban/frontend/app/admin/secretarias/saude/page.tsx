'use client'
// @ts-nocheck

import { useAdminAuth } from '@/contexts/AdminAuthContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Heart,
  Users,
  Calendar,
  FileText,
  Activity,
  Stethoscope,
  Pill,
  Baby,
  User,
  Shield
} from 'lucide-react'
import Link from 'next/link'

const saudeModules = [
  {
    title: 'Atenção Básica',
    description: 'Gestão de Unidades Básicas de Saúde (UBS)',
    href: '/admin/secretarias/saude/atencao-basica',
    icon: Heart,
    color: 'bg-blue-100 text-blue-800',
    stats: { unidades: 12, pacientes: 15420 }
  },
  {
    title: 'Vigilância Epidemiológica',
    description: 'Monitoramento e controle de doenças',
    href: '/admin/secretarias/saude/vigilancia',
    icon: Shield,
    color: 'bg-red-100 text-red-800',
    stats: { notificacoes: 89, surtos: 2 }
  },
  {
    title: 'Saúde Mental',
    description: 'CAPS e atendimento psicológico',
    href: '/admin/secretarias/saude/saude-mental',
    icon: User,
    color: 'bg-purple-100 text-purple-800',
    stats: { atendimentos: 245, caps: 3 }
  },
  {
    title: 'Farmácia Municipal',
    description: 'Controle de medicamentos e distribuição',
    href: '/admin/secretarias/saude/farmacia',
    icon: Pill,
    color: 'bg-green-100 text-green-800',
    stats: { medicamentos: 1200, entregas: 580 }
  },
  {
    title: 'Saúde da Mulher',
    description: 'Pré-natal, prevenção e saúde reprodutiva',
    href: '/admin/secretarias/saude/saude-mulher',
    icon: Baby,
    color: 'bg-pink-100 text-pink-800',
    stats: { gestantes: 156, preventivos: 320 }
  },
  {
    title: 'Urgência e Emergência',
    description: 'SAMU, UPA e prontos atendimentos',
    href: '/admin/secretarias/saude/urgencia',
    icon: Activity,
    color: 'bg-orange-100 text-orange-800',
    stats: { chamadas: 1250, upas: 2 }
  },
  {
    title: 'Consultórios Especializados',
    description: 'Especialidades médicas e ambulatórios',
    href: '/admin/secretarias/saude/especialidades',
    icon: Stethoscope,
    color: 'bg-indigo-100 text-indigo-800',
    stats: { especialistas: 45, consultas: 890 }
  },
  {
    title: 'Agentes Comunitários',
    description: 'Gestão de ACS e territorialização',
    href: '/admin/secretarias/saude/agentes',
    icon: Users,
    color: 'bg-teal-100 text-teal-800',
    stats: { agentes: 78, visitas: 2340 }
  },
  {
    title: 'Regulação',
    description: 'Central de regulação e marcação de consultas',
    href: '/admin/secretarias/saude/regulacao',
    icon: Calendar,
    color: 'bg-yellow-100 text-yellow-800',
    stats: { pendentes: 245, reguladas: 1890 }
  },
  {
    title: 'Auditoria SUS',
    description: 'Controle de qualidade e faturamento SUS',
    href: '/admin/secretarias/saude/auditoria',
    icon: FileText,
    color: 'bg-gray-100 text-gray-800',
    stats: { auditorias: 12, conformidade: '95%' }
  }
]

export default function SecretariaSaudePage() {
  const { user } = useAdminAuth()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Heart className="h-8 w-8 text-red-600 mr-3" />
            Secretaria Municipal de Saúde
          </h1>
          <p className="text-gray-600 mt-1">
            Gestão integrada dos serviços de saúde municipal
          </p>
        </div>
        <Badge variant="outline" className="text-red-600 border-red-200">
          SUS Municipal
        </Badge>
      </div>

      {/* Estatísticas Gerais */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unidades de Saúde</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18</div>
            <p className="text-xs text-muted-foreground">
              +2 novas este mês
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Atendimentos/Mês</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8.547</div>
            <p className="text-xs text-muted-foreground">
              +12% vs mês anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Profissionais</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">234</div>
            <p className="text-xs text-muted-foreground">
              Entre médicos, enfermeiros e ACS
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cobertura ESF</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">87%</div>
            <p className="text-xs text-muted-foreground">
              Meta: 95%
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Módulos Especializados */}
      <div>
        <h2 className="text-2xl font-semibold mb-6">Módulos Especializados</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {saudeModules.map((module) => (
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
                      <span className="text-gray-600 capitalize">{key}:</span>
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

      {/* Ações Rápidas */}
      <Card>
        <CardHeader>
          <CardTitle>Ações Rápidas</CardTitle>
          <CardDescription>
            Acesso direto às funcionalidades mais utilizadas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button className="h-20 flex flex-col" variant="outline">
              <Calendar className="h-6 w-6 mb-2" />
              <span>Agendar Consulta</span>
            </Button>
            <Button className="h-20 flex flex-col" variant="outline">
              <FileText className="h-6 w-6 mb-2" />
              <span>Relatório Mensal</span>
            </Button>
            <Button className="h-20 flex flex-col" variant="outline">
              <Activity className="h-6 w-6 mb-2" />
              <span>Painel COVID-19</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}