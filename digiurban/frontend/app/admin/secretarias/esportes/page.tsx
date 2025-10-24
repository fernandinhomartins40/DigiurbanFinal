'use client'

import { useAdminAuth } from '@/contexts/AdminAuthContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Trophy,
  Users,
  Calendar,
  MapPin,
  Award,
  Activity,
  Target,
  Dumbbell,
  Plus
} from 'lucide-react'
import Link from 'next/link'

const esportesModules = [
  {
    title: 'Atendimentos',
    description: 'Gestão de solicitações e atendimentos esportivos',
    href: '/admin/secretarias/esportes/atendimentos',
    icon: Users,
    color: 'bg-blue-100 text-blue-800',
    stats: { atendimentos_mes: 245, aguardando: 12, concluidos: 890 }
  },
  {
    title: 'Equipes Esportivas',
    description: 'Gestão de times e equipes municipais',
    href: '/admin/secretarias/esportes/equipes-esportivas',
    icon: Trophy,
    color: 'bg-yellow-100 text-yellow-800',
    stats: { equipes: 34, atletas: 567, modalidades: 12 }
  },
  {
    title: 'Atletas Federados',
    description: 'Cadastro e acompanhamento de atletas federados',
    href: '/admin/secretarias/esportes/atletas-federados',
    icon: Award,
    color: 'bg-orange-100 text-orange-800',
    stats: { atletas_federados: 89, competicoes_ano: 24, medalhas: 156 }
  },
  {
    title: 'Escolinhas Esportivas',
    description: 'Programas de iniciação esportiva',
    href: '/admin/secretarias/esportes/escolinhas-esportivas',
    icon: Target,
    color: 'bg-green-100 text-green-800',
    stats: { escolinhas: 18, alunos: 890, professores: 34 }
  },
  {
    title: 'Eventos Esportivos',
    description: 'Organização de competições e torneios',
    href: '/admin/secretarias/esportes/eventos-esportivos',
    icon: Calendar,
    color: 'bg-purple-100 text-purple-800',
    stats: { eventos_ano: 45, participantes: 3400, proximos: 8 }
  },
  {
    title: 'Competições e Torneios',
    description: 'Campeonatos e jogos oficiais',
    href: '/admin/secretarias/esportes/competicoes-torneios',
    icon: Activity,
    color: 'bg-red-100 text-red-800',
    stats: { torneios_ativos: 6, inscricoes: 234, jogos_mes: 45 }
  },
  {
    title: 'Infraestrutura Esportiva',
    description: 'Gestão de ginásios, campos e quadras',
    href: '/admin/secretarias/esportes/infraestrutura-esportiva',
    icon: MapPin,
    color: 'bg-teal-100 text-teal-800',
    stats: { espacos: 23, reservas_mes: 456, manutencoes: 12 }
  },
  {
    title: 'Dashboard Esportes',
    description: 'Indicadores e métricas da secretaria',
    href: '/admin/secretarias/esportes/dashboard',
    icon: Dumbbell,
    color: 'bg-indigo-100 text-indigo-800',
    stats: { praticantes: 4500, modalidades: 15, crescimento: '+18%' }
  }
]

export default function SecretariaEsportesPage() {
  const { user } = useAdminAuth()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Trophy className="h-8 w-8 text-yellow-600 mr-3" />
            Secretaria Municipal de Esportes
          </h1>
          <p className="text-gray-600 mt-1">
            Fomento ao esporte e qualidade de vida
          </p>
        </div>
        <Badge variant="outline" className="text-yellow-600 border-yellow-200">
          Esporte Para Todos
        </Badge>
      </div>

      {/* Estatísticas Gerais */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Equipes Ativas</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">34</div>
            <p className="text-xs text-muted-foreground">
              567 atletas cadastrados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Escolinhas</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18</div>
            <p className="text-xs text-muted-foreground">
              890 alunos ativos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Eventos/Ano</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45</div>
            <p className="text-xs text-muted-foreground">
              3.400 participantes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Praticantes</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.5k</div>
            <p className="text-xs text-muted-foreground">
              +18% vs ano anterior
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Módulos Especializados */}
      <div>
        <h2 className="text-2xl font-semibold mb-6">Módulos Especializados</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {esportesModules.map((module) => (
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
              <span>Novo Evento</span>
            </Button>
            <Button className="h-20 flex flex-col" variant="outline">
              <Users className="h-6 w-6 mb-2" />
              <span>Cadastrar Atleta</span>
            </Button>
            <Button className="h-20 flex flex-col" variant="outline">
              <Trophy className="h-6 w-6 mb-2" />
              <span>Nova Equipe</span>
            </Button>
            <Button className="h-20 flex flex-col" variant="outline">
              <MapPin className="h-6 w-6 mb-2" />
              <span>Reservar Espaço</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
