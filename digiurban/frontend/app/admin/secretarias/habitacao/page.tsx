'use client'

import { useAdminAuth } from '@/contexts/AdminAuthContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Home,
  Users,
  FileText,
  MapPin,
  Building,
  CheckCircle,
  ClipboardList,
  TrendingUp,
  Plus
} from 'lucide-react'
import Link from 'next/link'

const habitacaoModules = [
  {
    title: 'Atendimentos',
    description: 'Solicitações e demandas habitacionais',
    href: '/admin/secretarias/habitacao/atendimentos',
    icon: Users,
    color: 'bg-blue-100 text-blue-800',
    stats: { atendimentos_mes: 234, aguardando: 45, concluidos: 1890 }
  },
  {
    title: 'Inscrições',
    description: 'Cadastro para programas habitacionais',
    href: '/admin/secretarias/habitacao/inscricoes',
    icon: ClipboardList,
    color: 'bg-green-100 text-green-800',
    stats: { inscricoes_ativas: 567, aprovadas: 234, em_analise: 123 }
  },
  {
    title: 'Programas Habitacionais',
    description: 'Gestão de programas federais e municipais',
    href: '/admin/secretarias/habitacao/programas-habitacionais',
    icon: Building,
    color: 'bg-purple-100 text-purple-800',
    stats: { programas_ativos: 8, beneficiarios: 1240, investimento: 'R$ 8.5M' }
  },
  {
    title: 'Unidades Habitacionais',
    description: 'Controle de casas e apartamentos',
    href: '/admin/secretarias/habitacao/unidades-habitacionais',
    icon: Home,
    color: 'bg-orange-100 text-orange-800',
    stats: { unidades_total: 890, ocupadas: 834, disponiveis: 56 }
  },
  {
    title: 'Regularização Fundiária',
    description: 'Titulação e regularização de terrenos',
    href: '/admin/secretarias/habitacao/regularizacao-fundiaria',
    icon: FileText,
    color: 'bg-yellow-100 text-yellow-800',
    stats: { processos_ativos: 345, regularizados: 890, em_andamento: 156 }
  },
  {
    title: 'Mapeamento Habitacional',
    description: 'Geolocalização de déficit habitacional',
    href: '/admin/secretarias/habitacao/mapeamento',
    icon: MapPin,
    color: 'bg-teal-100 text-teal-800',
    stats: { areas_mapeadas: 45, familias_identificadas: 1234, prioridades: 78 }
  },
  {
    title: 'Acompanhamento Pós-Entrega',
    description: 'Suporte após a entrega das unidades',
    href: '/admin/secretarias/habitacao/acompanhamento',
    icon: CheckCircle,
    color: 'bg-indigo-100 text-indigo-800',
    stats: { familias_acompanhadas: 456, visitas_mes: 89, satisfacao: '92%' }
  },
  {
    title: 'Dashboard Habitação',
    description: 'Indicadores e métricas habitacionais',
    href: '/admin/secretarias/habitacao/dashboard-habitacao',
    icon: TrendingUp,
    color: 'bg-pink-100 text-pink-800',
    stats: { unidades_entregues: 890, deficit: 1234, meta_ano: 250 }
  }
]

export default function SecretariaHabitacaoPage() {
  const { user } = useAdminAuth()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Home className="h-8 w-8 text-orange-600 mr-3" />
            Secretaria Municipal de Habitação
          </h1>
          <p className="text-gray-600 mt-1">
            Moradia digna para todos os cidadãos
          </p>
        </div>
        <Badge variant="outline" className="text-orange-600 border-orange-200">
          Direito à Moradia
        </Badge>
      </div>

      {/* Estatísticas Gerais */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unidades Totais</CardTitle>
            <Home className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">890</div>
            <p className="text-xs text-muted-foreground">
              834 ocupadas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inscrições Ativas</CardTitle>
            <ClipboardList className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">567</div>
            <p className="text-xs text-muted-foreground">
              234 aprovadas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Programas Ativos</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">
              1.240 beneficiários
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Regularizações</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">890</div>
            <p className="text-xs text-muted-foreground">
              345 em andamento
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Módulos Especializados */}
      <div>
        <h2 className="text-2xl font-semibold mb-6">Módulos Especializados</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {habitacaoModules.map((module) => (
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
              <span>Nova Inscrição</span>
            </Button>
            <Button className="h-20 flex flex-col" variant="outline">
              <Home className="h-6 w-6 mb-2" />
              <span>Cadastrar Unidade</span>
            </Button>
            <Button className="h-20 flex flex-col" variant="outline">
              <FileText className="h-6 w-6 mb-2" />
              <span>Iniciar Regularização</span>
            </Button>
            <Button className="h-20 flex flex-col" variant="outline">
              <CheckCircle className="h-6 w-6 mb-2" />
              <span>Agendar Visita</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
