'use client'

import { useAdminAuth } from '@/contexts/AdminAuthContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Sprout,
  Users,
  MapPin,
  FileText,
  Headphones,
  TrendingUp,
  Calendar,
  Tractor,
  Plus
} from 'lucide-react'
import Link from 'next/link'

const agriculturaModules = [
  {
    title: 'Produtores Rurais',
    description: 'Cadastro e gestão de produtores rurais',
    href: '/admin/secretarias/agricultura/produtores',
    icon: Users,
    color: 'bg-green-100 text-green-800',
    stats: { total: 245, ativos: 198, inativos: 47, cadastros_mes: 12 }
  },
  {
    title: 'Propriedades Rurais',
    description: 'Registro de propriedades com localização e área',
    href: '/admin/secretarias/agricultura/propriedades',
    icon: MapPin,
    color: 'bg-amber-100 text-amber-800',
    stats: { total: 312, ativas: 287, area_total_ha: 4567, com_irrigacao: 145 }
  },
  {
    title: 'Assistência Técnica',
    description: 'Gestão de assistências com visitas e diagnósticos',
    href: '/admin/secretarias/agricultura/assistencia-tecnica',
    icon: FileText,
    color: 'bg-blue-100 text-blue-800',
    stats: { agendadas: 23, em_andamento: 15, concluidas_mes: 67, produtores_atendidos: 89 }
  },
  {
    title: 'Atendimentos Rurais',
    description: 'Atendimento aos produtores com orientações',
    href: '/admin/secretarias/agricultura/atendimentos',
    icon: Headphones,
    color: 'bg-purple-100 text-purple-800',
    stats: { hoje: 8, semana: 34, pendentes: 12, satisfacao: '4.7/5' }
  },
  {
    title: 'Calendário Agrícola',
    description: 'Planejamento de safras e atividades',
    href: '/admin/secretarias/agricultura/calendario',
    icon: Calendar,
    color: 'bg-orange-100 text-orange-800',
    stats: { safras_andamento: 3, plantios_proximos: 2, colheitas_mes: 4 }
  },
  {
    title: 'Maquinário Agrícola',
    description: 'Gestão de equipamentos e aluguel',
    href: '/admin/secretarias/agricultura/maquinario',
    icon: Tractor,
    color: 'bg-yellow-100 text-yellow-800',
    stats: { maquinas_disponiveis: 12, reservas_mes: 45, horas_trabalhadas: 890 }
  },
  {
    title: 'Produção Agrícola',
    description: 'Indicadores de produção e produtividade',
    href: '/admin/secretarias/agricultura/producao',
    icon: TrendingUp,
    color: 'bg-emerald-100 text-emerald-800',
    stats: { area_plantada_ha: 3245, produtividade: '+12%', culturas_principais: 8 }
  },
  {
    title: 'Dashboard Agricultura',
    description: 'Indicadores e métricas do setor',
    href: '/admin/secretarias/agricultura/dashboard',
    icon: Sprout,
    color: 'bg-teal-100 text-teal-800',
    stats: { produtores_ativos: 198, propriedades: 312, area_total: '4.567 ha' }
  }
]

export default function SecretariaAgriculturaPage() {
  const { user } = useAdminAuth()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Sprout className="h-8 w-8 text-green-600 mr-3" />
            Secretaria Municipal de Agricultura
          </h1>
          <p className="text-gray-600 mt-1">
            Desenvolvimento rural e fortalecimento da agricultura familiar
          </p>
        </div>
        <Badge variant="outline" className="text-green-600 border-green-200">
          Agricultura Familiar
        </Badge>
      </div>

      {/* Estatísticas Gerais */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Produtores Ativos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">198</div>
            <p className="text-xs text-muted-foreground">
              245 cadastrados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Propriedades</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">312</div>
            <p className="text-xs text-muted-foreground">
              4.567 hectares totais
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Assistências Ativas</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">38</div>
            <p className="text-xs text-muted-foreground">
              67 concluídas este mês
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Produtividade</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+12%</div>
            <p className="text-xs text-muted-foreground">
              vs ano anterior
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Módulos Especializados */}
      <div>
        <h2 className="text-2xl font-semibold mb-6">Módulos Especializados</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {agriculturaModules.map((module) => (
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

      {/* Indicadores de Produção */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Produção Rural</CardTitle>
            <CardDescription>
              Principais indicadores de produção
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Culturas Principais</span>
                <span className="font-semibold">Milho, Soja, Feijão</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Área Plantada</span>
                <span className="font-semibold">3.245 ha</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Produtividade Média</span>
                <span className="font-semibold text-green-600">+12% vs ano anterior</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Propriedades com Irrigação</span>
                <span className="font-semibold">145 (46%)</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Produtores Assistidos</span>
                <span className="font-semibold">89 este mês</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Calendário Agrícola</CardTitle>
            <CardDescription>
              Safras e atividades programadas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Plantio de Milho</span>
                <span className="font-semibold text-green-600">Concluído (89%)</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Colheita de Soja</span>
                <span className="font-semibold text-orange-600">Em andamento</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Plantio de Feijão</span>
                <span className="font-semibold text-blue-600">Em 10 dias</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Safras Programadas</span>
                <span className="font-semibold">3 no trimestre</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Assistências Agendadas</span>
                <span className="font-semibold">23 próximos dias</span>
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
              <span>Novo Produtor</span>
            </Button>
            <Button className="h-20 flex flex-col" variant="outline">
              <MapPin className="h-6 w-6 mb-2" />
              <span>Cadastrar Propriedade</span>
            </Button>
            <Button className="h-20 flex flex-col" variant="outline">
              <FileText className="h-6 w-6 mb-2" />
              <span>Agendar Assistência</span>
            </Button>
            <Button className="h-20 flex flex-col" variant="outline">
              <Headphones className="h-6 w-6 mb-2" />
              <span>Novo Atendimento</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
