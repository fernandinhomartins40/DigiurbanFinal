'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Users, MapPin, FileText, Headphones, TrendingUp, Calendar, AlertCircle, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useAdminAuth } from '@/contexts/AdminAuthContext'

const agriculturaModules = [
  {
    title: 'Produtores Rurais',
    description: 'Cadastro e gestão de produtores rurais com dados pessoais e tipo de produção',
    href: '/admin/secretarias/agricultura/produtores',
    icon: Users,
    color: 'bg-green-100 text-green-800',
    stats: {
      total: 245,
      ativos: 198,
      inativos: 47,
      cadastros_mes: 12
    }
  },
  {
    title: 'Propriedades Rurais',
    description: 'Registro de propriedades com localização, área, culturas e infraestrutura',
    href: '/admin/secretarias/agricultura/propriedades',
    icon: MapPin,
    color: 'bg-amber-100 text-amber-800',
    stats: {
      total: 312,
      ativas: 287,
      area_total_ha: 4567,
      com_irrigacao: 145
    }
  },
  {
    title: 'Assistência Técnica',
    description: 'Gestão de assistências técnicas com visitas, diagnósticos e recomendações',
    href: '/admin/secretarias/agricultura/assistencia-tecnica',
    icon: FileText,
    color: 'bg-blue-100 text-blue-800',
    stats: {
      agendadas: 23,
      em_andamento: 15,
      concluidas_mes: 67,
      produtores_atendidos: 89
    }
  },
  {
    title: 'Atendimentos Rurais',
    description: 'Atendimento aos produtores rurais com orientações e solicitações',
    href: '/admin/secretarias/agricultura/atendimentos',
    icon: Headphones,
    color: 'bg-purple-100 text-purple-800',
    stats: {
      hoje: 8,
      semana: 34,
      pendentes: 12,
      satisfacao: 4.7
    }
  },
]

export default function SecretariaAgriculturaPage() {
  const { user } = useAdminAuth()

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Secretaria de Agricultura</h1>
        <p className="text-muted-foreground mt-2">
          Gestão completa da agricultura municipal e desenvolvimento rural
        </p>
      </div>

      {/* Estatísticas Gerais */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Produtores</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">245</div>
            <p className="text-xs text-muted-foreground">
              198 ativos, 47 inativos
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Propriedades Cadastradas</CardTitle>
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
              23 agendadas, 15 em andamento
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Atendimentos Hoje</CardTitle>
            <Headphones className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">
              34 esta semana
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Indicadores de Produção */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              Produção Rural
            </CardTitle>
            <CardDescription>Principais indicadores de produção</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">Culturas Principais</span>
                <span className="font-semibold">Milho, Soja, Feijão</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Área Plantada</span>
                <span className="font-semibold">3.245 ha</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Produtividade Média</span>
                <span className="font-semibold text-green-600">+12% vs ano anterior</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Propriedades com Irrigação</span>
                <span className="font-semibold">145 (46%)</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              Calendário Agrícola
            </CardTitle>
            <CardDescription>Atividades e safras em andamento</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <p className="font-medium">Plantio de Milho</p>
                  <p className="text-sm text-muted-foreground">Concluído - 89% das propriedades</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
                <div>
                  <p className="font-medium">Colheita de Soja</p>
                  <p className="text-sm text-muted-foreground">Em andamento - Previsão 15 dias</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="font-medium">Plantio de Feijão</p>
                  <p className="text-sm text-muted-foreground">Programado - Início em 10 dias</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Módulos */}
      <Card>
        <CardHeader>
          <CardTitle>Módulos da Secretaria</CardTitle>
          <CardDescription>Acesse os sistemas de gestão da agricultura municipal</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {agriculturaModules.map((module) => (
              <Link key={module.href} href={module.href}>
                <Card className="hover:shadow-md transition-shadow h-full">
                  <CardContent className="pt-6">
                    <div className={`inline-flex p-3 rounded-lg ${module.color} mb-4`}>
                      <module.icon className="h-6 w-6" />
                    </div>
                    <h3 className="font-semibold mb-2">{module.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {module.description}
                    </p>
                    <div className="space-y-1 text-xs">
                      {Object.entries(module.stats).slice(0, 2).map(([key, value]) => (
                        <div key={key} className="flex justify-between">
                          <span className="text-muted-foreground capitalize">
                            {key.replace(/_/g, ' ')}:
                          </span>
                          <span className="font-medium">{value}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Ações Rápidas */}
      <Card>
        <CardHeader>
          <CardTitle>Ações Rápidas</CardTitle>
          <CardDescription>Acesso rápido às funcionalidades mais utilizadas</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Button asChild>
            <Link href="/admin/secretarias/agricultura/produtores">
              <Users className="mr-2 h-4 w-4" />
              Novo Produtor
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/admin/secretarias/agricultura/propriedades">
              <MapPin className="mr-2 h-4 w-4" />
              Cadastrar Propriedade
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/admin/secretarias/agricultura/assistencia-tecnica">
              <FileText className="mr-2 h-4 w-4" />
              Agendar Assistência
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/admin/secretarias/agricultura/atendimentos">
              <Headphones className="mr-2 h-4 w-4" />
              Novo Atendimento
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
