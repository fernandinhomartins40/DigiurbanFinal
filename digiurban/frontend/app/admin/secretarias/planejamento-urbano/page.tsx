'use client'

import { useAdminAuth } from '@/contexts/AdminAuthContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Building2,
  Users,
  FileCheck,
  FileText,
  AlertCircle,
  MessageSquare,
  MapPin,
  TrendingUp,
  Plus
} from 'lucide-react'
import Link from 'next/link'

const planejamentoUrbanoModules = [
  {
    title: 'Atendimentos',
    description: 'Solicitações e demandas de planejamento',
    href: '/admin/secretarias/planejamento-urbano/atendimentos',
    icon: Users,
    color: 'bg-blue-100 text-blue-800',
    stats: { atendimentos_mes: 189, aguardando: 34, concluidos: 1234 }
  },
  {
    title: 'Aprovação de Projetos',
    description: 'Análise e aprovação de projetos urbanísticos',
    href: '/admin/secretarias/planejamento-urbano/aprovacao-projetos',
    icon: FileCheck,
    color: 'bg-green-100 text-green-800',
    stats: { projetos_analise: 45, aprovados_mes: 67, rejeitados: 12 }
  },
  {
    title: 'Emissão de Alvarás',
    description: 'Alvarás de construção e funcionamento',
    href: '/admin/secretarias/planejamento-urbano/emissao-alvaras',
    icon: FileText,
    color: 'bg-purple-100 text-purple-800',
    stats: { alvaras_emitidos: 234, em_analise: 56, vigentes: 890 }
  },
  {
    title: 'Denúncias e Reclamações',
    description: 'Fiscalização e irregularidades urbanas',
    href: '/admin/secretarias/planejamento-urbano/denuncias-reclamacoes',
    icon: AlertCircle,
    color: 'bg-red-100 text-red-800',
    stats: { denuncias_mes: 78, investigando: 23, resolvidas: 456 }
  },
  {
    title: 'Consultas Públicas',
    description: 'Participação popular em decisões urbanas',
    href: '/admin/secretarias/planejamento-urbano/consultas-publicas',
    icon: MessageSquare,
    color: 'bg-yellow-100 text-yellow-800',
    stats: { consultas_ativas: 6, participantes: 1234, concluidas: 45 }
  },
  {
    title: 'Mapa Urbano',
    description: 'Zoneamento e uso do solo',
    href: '/admin/secretarias/planejamento-urbano/mapa-urbano',
    icon: MapPin,
    color: 'bg-teal-100 text-teal-800',
    stats: { zonas: 12, lotes_cadastrados: 8900, area_km2: 234 }
  },
  {
    title: 'Projetos Urbanísticos',
    description: 'Planejamento e desenvolvimento urbano',
    href: '/admin/secretarias/planejamento-urbano/projetos',
    icon: Building2,
    color: 'bg-indigo-100 text-indigo-800',
    stats: { projetos_ativos: 15, investimento: 'R$ 12M', conclusao: '65%' }
  },
  {
    title: 'Dashboard Planejamento',
    description: 'Indicadores e métricas urbanas',
    href: '/admin/secretarias/planejamento-urbano/dashboard-planejamento',
    icon: TrendingUp,
    color: 'bg-orange-100 text-orange-800',
    stats: { crescimento_urbano: '+8%', ocupacao: '78%', conformidade: '92%' }
  }
]

export default function SecretariaPlanejamentoUrbanoPage() {
  const { user } = useAdminAuth()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Building2 className="h-8 w-8 text-indigo-600 mr-3" />
            Secretaria Municipal de Planejamento Urbano
          </h1>
          <p className="text-gray-600 mt-1">
            Desenvolvimento ordenado e sustentável da cidade
          </p>
        </div>
        <Badge variant="outline" className="text-indigo-600 border-indigo-200">
          Cidade Planejada
        </Badge>
      </div>

      {/* Estatísticas Gerais */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Projetos em Análise</CardTitle>
            <FileCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45</div>
            <p className="text-xs text-muted-foreground">
              67 aprovados este mês
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alvarás Emitidos</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">234</div>
            <p className="text-xs text-muted-foreground">
              890 vigentes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Projetos Ativos</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">15</div>
            <p className="text-xs text-muted-foreground">
              R$ 12M investimento
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Crescimento Urbano</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+8%</div>
            <p className="text-xs text-muted-foreground">
              78% ocupação
            </p>
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
              <span>Novo Projeto</span>
            </Button>
            <Button className="h-20 flex flex-col" variant="outline">
              <FileText className="h-6 w-6 mb-2" />
              <span>Emitir Alvará</span>
            </Button>
            <Button className="h-20 flex flex-col" variant="outline">
              <AlertCircle className="h-6 w-6 mb-2" />
              <span>Registrar Denúncia</span>
            </Button>
            <Button className="h-20 flex flex-col" variant="outline">
              <MessageSquare className="h-6 w-6 mb-2" />
              <span>Nova Consulta Pública</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Módulos Especializados */}
      <div>
        <h2 className="text-2xl font-semibold mb-6">Módulos Especializados</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {planejamentoUrbanoModules.map((module) => (
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
    </div>
  )
}
