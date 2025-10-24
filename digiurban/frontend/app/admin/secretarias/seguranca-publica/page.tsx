'use client'

import { useAdminAuth } from '@/contexts/AdminAuthContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Shield,
  Users,
  AlertTriangle,
  MapPin,
  Bell,
  BarChart3,
  Eye,
  TrendingUp,
  Plus
} from 'lucide-react'
import Link from 'next/link'

const segurancaPublicaModules = [
  {
    title: 'Atendimentos',
    description: 'Gestão de solicitações e demandas de segurança',
    href: '/admin/secretarias/seguranca-publica/atendimentos',
    icon: Users,
    color: 'bg-blue-100 text-blue-800',
    stats: { atendimentos_mes: 178, aguardando: 23, concluidos: 1456 }
  },
  {
    title: 'Registro de Ocorrências',
    description: 'Registro e acompanhamento de ocorrências',
    href: '/admin/secretarias/seguranca-publica/registro-ocorrencias',
    icon: AlertTriangle,
    color: 'bg-red-100 text-red-800',
    stats: { ocorrencias_mes: 234, em_andamento: 45, resolvidas: 890 }
  },
  {
    title: 'Apoio Guarda Municipal',
    description: 'Gestão e alocação da guarda municipal',
    href: '/admin/secretarias/seguranca-publica/apoio-guarda',
    icon: Shield,
    color: 'bg-indigo-100 text-indigo-800',
    stats: { guardas_ativos: 89, viaturas: 12, rondas_dia: 156 }
  },
  {
    title: 'Mapa de Pontos Críticos',
    description: 'Mapeamento de áreas de risco e vulnerabilidade',
    href: '/admin/secretarias/seguranca-publica/mapa-pontos-criticos',
    icon: MapPin,
    color: 'bg-orange-100 text-orange-800',
    stats: { pontos_criticos: 34, monitorados: 28, cameras: 67 }
  },
  {
    title: 'Alertas de Segurança',
    description: 'Sistema de alertas e notificações',
    href: '/admin/secretarias/seguranca-publica/alertas-seguranca',
    icon: Bell,
    color: 'bg-yellow-100 text-yellow-800',
    stats: { alertas_ativos: 12, notificacoes_mes: 456, usuarios: 2340 }
  },
  {
    title: 'Estatísticas Regionais',
    description: 'Análise de dados por região',
    href: '/admin/secretarias/seguranca-publica/estatisticas-regionais',
    icon: BarChart3,
    color: 'bg-purple-100 text-purple-800',
    stats: { regioes: 8, ocorrencias_total: 1234, reducao: '-15%' }
  },
  {
    title: 'Vigilância Integrada',
    description: 'Monitoramento e videovigilância',
    href: '/admin/secretarias/seguranca-publica/vigilancia-integrada',
    icon: Eye,
    color: 'bg-teal-100 text-teal-800',
    stats: { cameras_ativas: 67, gravacoes_tb: 234, cobertura: '78%' }
  },
  {
    title: 'Dashboard Segurança',
    description: 'Indicadores e métricas de segurança',
    href: '/admin/secretarias/seguranca-publica/dashboard',
    icon: TrendingUp,
    color: 'bg-green-100 text-green-800',
    stats: { indice_seguranca: 7.8, melhoria: '+12%', satisfacao: '82%' }
  }
]

export default function SecretariaSegurancaPublicaPage() {
  const { user } = useAdminAuth()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Shield className="h-8 w-8 text-blue-600 mr-3" />
            Secretaria Municipal de Segurança Pública
          </h1>
          <p className="text-gray-600 mt-1">
            Proteção e segurança dos cidadãos
          </p>
        </div>
        <Badge variant="outline" className="text-blue-600 border-blue-200">
          Cidade Segura
        </Badge>
      </div>

      {/* Estatísticas Gerais */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Guardas Ativos</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89</div>
            <p className="text-xs text-muted-foreground">
              12 viaturas disponíveis
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ocorrências/Mês</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">234</div>
            <p className="text-xs text-muted-foreground">
              890 resolvidas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Câmeras Ativas</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">67</div>
            <p className="text-xs text-muted-foreground">
              78% de cobertura
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Índice Segurança</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7.8</div>
            <p className="text-xs text-muted-foreground">
              +12% melhoria
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Módulos Especializados */}
      <div>
        <h2 className="text-2xl font-semibold mb-6">Módulos Especializados</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {segurancaPublicaModules.map((module) => (
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
              <span>Nova Ocorrência</span>
            </Button>
            <Button className="h-20 flex flex-col" variant="outline">
              <MapPin className="h-6 w-6 mb-2" />
              <span>Adicionar Ponto Crítico</span>
            </Button>
            <Button className="h-20 flex flex-col" variant="outline">
              <Bell className="h-6 w-6 mb-2" />
              <span>Novo Alerta</span>
            </Button>
            <Button className="h-20 flex flex-col" variant="outline">
              <Shield className="h-6 w-6 mb-2" />
              <span>Alocar Guarda</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
