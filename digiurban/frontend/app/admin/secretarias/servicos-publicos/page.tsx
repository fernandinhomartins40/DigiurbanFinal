'use client'

import { useAdminAuth } from '@/contexts/AdminAuthContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Settings,
  Users,
  Trash2,
  Lightbulb,
  Truck,
  Camera,
  ClipboardList,
  TrendingUp,
  Plus
} from 'lucide-react'
import Link from 'next/link'

const servicosPublicosModules = [
  {
    title: 'Atendimentos',
    description: 'Solicitações de serviços públicos',
    href: '/admin/secretarias/servicos-publicos/atendimentos',
    icon: Users,
    color: 'bg-blue-100 text-blue-800',
    stats: { atendimentos_mes: 456, aguardando: 67, concluidos: 2340 }
  },
  {
    title: 'Limpeza Pública',
    description: 'Gestão de limpeza urbana e varrição',
    href: '/admin/secretarias/servicos-publicos/limpeza-publica',
    icon: Trash2,
    color: 'bg-green-100 text-green-800',
    stats: { equipes: 12, rotas: 45, km_dia: 890 }
  },
  {
    title: 'Iluminação Pública',
    description: 'Manutenção e controle de iluminação',
    href: '/admin/secretarias/servicos-publicos/iluminacao-publica',
    icon: Lightbulb,
    color: 'bg-yellow-100 text-yellow-800',
    stats: { pontos_luz: 3450, manutencoes_mes: 156, led_instalados: 1234 }
  },
  {
    title: 'Coleta Especial',
    description: 'Coleta de resíduos volumosos e entulho',
    href: '/admin/secretarias/servicos-publicos/coleta-especial',
    icon: Truck,
    color: 'bg-orange-100 text-orange-800',
    stats: { coletas_mes: 234, toneladas: 567, agendamentos: 89 }
  },
  {
    title: 'Problemas com Foto',
    description: 'Registro fotográfico de problemas urbanos',
    href: '/admin/secretarias/servicos-publicos/problemas-com-foto',
    icon: Camera,
    color: 'bg-purple-100 text-purple-800',
    stats: { registros_mes: 345, resolvidos: 890, em_andamento: 78 }
  },
  {
    title: 'Solicitações',
    description: 'Gestão de todas as solicitações abertas',
    href: '/admin/secretarias/servicos-publicos/solicitacoes',
    icon: ClipboardList,
    color: 'bg-pink-100 text-pink-800',
    stats: { solicitacoes_abertas: 234, prazo_medio: '3.5 dias', satisfacao: '87%' }
  },
  {
    title: 'Programação de Equipes',
    description: 'Escalas e alocação de recursos',
    href: '/admin/secretarias/servicos-publicos/programacao-equipes',
    icon: Users,
    color: 'bg-teal-100 text-teal-800',
    stats: { equipes_ativas: 18, funcionarios: 156, turnos: 3 }
  },
  {
    title: 'Dashboard Serviços',
    description: 'Indicadores e métricas de desempenho',
    href: '/admin/secretarias/servicos-publicos/dashboard-servicos-publicos',
    icon: TrendingUp,
    color: 'bg-indigo-100 text-indigo-800',
    stats: { eficiencia: '92%', tempo_medio: '2.8 dias', metas_atingidas: '88%' }
  }
]

export default function SecretariaServicosPublicosPage() {
  const { user } = useAdminAuth()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Settings className="h-8 w-8 text-blue-600 mr-3" />
            Secretaria Municipal de Serviços Públicos
          </h1>
          <p className="text-gray-600 mt-1">
            Gestão dos serviços essenciais urbanos
          </p>
        </div>
        <Badge variant="outline" className="text-blue-600 border-blue-200">
          Cidade Limpa
        </Badge>
      </div>

      {/* Estatísticas Gerais */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pontos de Luz</CardTitle>
            <Lightbulb className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3.450</div>
            <p className="text-xs text-muted-foreground">
              1.234 LED instalados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Equipes Ativas</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18</div>
            <p className="text-xs text-muted-foreground">
              156 funcionários
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Solicitações/Mês</CardTitle>
            <ClipboardList className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">456</div>
            <p className="text-xs text-muted-foreground">
              2.340 concluídas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Eficiência</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">92%</div>
            <p className="text-xs text-muted-foreground">
              88% metas atingidas
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Módulos Especializados */}
      <div>
        <h2 className="text-2xl font-semibold mb-6">Módulos Especializados</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {servicosPublicosModules.map((module) => (
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
              <span>Nova Solicitação</span>
            </Button>
            <Button className="h-20 flex flex-col" variant="outline">
              <Camera className="h-6 w-6 mb-2" />
              <span>Registrar Problema</span>
            </Button>
            <Button className="h-20 flex flex-col" variant="outline">
              <Truck className="h-6 w-6 mb-2" />
              <span>Agendar Coleta</span>
            </Button>
            <Button className="h-20 flex flex-col" variant="outline">
              <Lightbulb className="h-6 w-6 mb-2" />
              <span>Reportar Luminária</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
