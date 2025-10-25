'use client'

import { useAdminAuth } from '@/contexts/AdminAuthContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Construction,
  Users,
  HardHat,
  TrendingUp,
  MapPin,
  Calendar,
  FileText,
  BarChart3,
  Plus
} from 'lucide-react'
import Link from 'next/link'

const obrasPublicasModules = [
  {
    title: 'Atendimentos',
    description: 'Solicitações e demandas de obras',
    href: '/admin/secretarias/obras-publicas/atendimentos',
    icon: Users,
    color: 'bg-blue-100 text-blue-800',
    stats: { atendimentos_mes: 145, aguardando: 28, concluidos: 890 }
  },
  {
    title: 'Obras e Intervenções',
    description: 'Cadastro e gestão de obras públicas',
    href: '/admin/secretarias/obras-publicas/obras-intervencoes',
    icon: Construction,
    color: 'bg-orange-100 text-orange-800',
    stats: { obras_ativas: 23, concluidas_ano: 45, investimento: 'R$ 8.5M' }
  },
  {
    title: 'Progresso das Obras',
    description: 'Acompanhamento e cronograma de execução',
    href: '/admin/secretarias/obras-publicas/progresso-obras',
    icon: TrendingUp,
    color: 'bg-green-100 text-green-800',
    stats: { no_prazo: 18, atrasadas: 5, conclusao_media: '68%' }
  },
  {
    title: 'Mapa de Obras',
    description: 'Geolocalização de obras e intervenções',
    href: '/admin/secretarias/obras-publicas/mapa-obras',
    icon: MapPin,
    color: 'bg-purple-100 text-purple-800',
    stats: { obras_mapeadas: 23, bairros_atendidos: 15, area_km2: 12 }
  },
  {
    title: 'Cronograma de Execução',
    description: 'Planejamento temporal das obras',
    href: '/admin/secretarias/obras-publicas/cronograma',
    icon: Calendar,
    color: 'bg-pink-100 text-pink-800',
    stats: { obras_programadas: 12, inicio_proximo_mes: 6, conclusao_trimestre: 8 }
  },
  {
    title: 'Contratos e Licitações',
    description: 'Gestão de contratos e processos licitatórios',
    href: '/admin/secretarias/obras-publicas/contratos-licitacoes',
    icon: FileText,
    color: 'bg-yellow-100 text-yellow-800',
    stats: { contratos_ativos: 34, licitacoes_andamento: 8, valor_total: 'R$ 12M' }
  },
  {
    title: 'Equipes e Equipamentos',
    description: 'Gestão de recursos humanos e maquinário',
    href: '/admin/secretarias/obras-publicas/equipes-equipamentos',
    icon: HardHat,
    color: 'bg-teal-100 text-teal-800',
    stats: { equipes: 12, maquinas: 45, funcionarios: 234 }
  },
  {
    title: 'Dashboard Obras',
    description: 'Indicadores e métricas de obras públicas',
    href: '/admin/secretarias/obras-publicas/dashboard-obras',
    icon: BarChart3,
    color: 'bg-indigo-100 text-indigo-800',
    stats: { obras_concluidas: 45, investimento_ano: 'R$ 8.5M', satisfacao: '87%' }
  }
]

export default function SecretariaObrasPublicasPage() {
  const { user } = useAdminAuth()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Construction className="h-8 w-8 text-orange-600 mr-3" />
            Secretaria Municipal de Obras Públicas
          </h1>
          <p className="text-gray-600 mt-1">
            Infraestrutura e desenvolvimento urbano
          </p>
        </div>
        <Badge variant="outline" className="text-orange-600 border-orange-200">
          Construindo o Futuro
        </Badge>
      </div>

      {/* Estatísticas Gerais */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Obras Ativas</CardTitle>
            <Construction className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <p className="text-xs text-muted-foreground">
              45 concluídas este ano
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Progresso Médio</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">68%</div>
            <p className="text-xs text-muted-foreground">
              18 obras no prazo
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Contratos Ativos</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">34</div>
            <p className="text-xs text-muted-foreground">
              R$ 12M valor total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Investimento/Ano</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 8.5M</div>
            <p className="text-xs text-muted-foreground">
              87% satisfação
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
              <span>Nova Obra</span>
            </Button>
            <Button className="h-20 flex flex-col" variant="outline">
              <TrendingUp className="h-6 w-6 mb-2" />
              <span>Atualizar Progresso</span>
            </Button>
            <Button className="h-20 flex flex-col" variant="outline">
              <FileText className="h-6 w-6 mb-2" />
              <span>Novo Contrato</span>
            </Button>
            <Button className="h-20 flex flex-col" variant="outline">
              <MapPin className="h-6 w-6 mb-2" />
              <span>Mapear Obra</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Módulos Especializados */}
      <div>
        <h2 className="text-2xl font-semibold mb-6">Módulos Especializados</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {obrasPublicasModules.map((module) => (
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
