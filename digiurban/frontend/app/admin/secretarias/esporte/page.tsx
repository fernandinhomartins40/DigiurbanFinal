'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Trophy, Users, Calendar, Building2, TrendingUp } from 'lucide-react'
import Link from 'next/link'

export default function EsporteDashboard() {
  const modules = [
    {
      title: 'Equipes',
      description: 'Gestão de equipes esportivas municipais',
      href: '/admin/secretarias/esporte/equipes',
      icon: Users,
      color: 'bg-blue-500'
    },
    {
      title: 'Atletas',
      description: 'Cadastro e gestão de atletas',
      href: '/admin/secretarias/esporte/atletas',
      icon: Trophy,
      color: 'bg-green-500'
    },
    {
      title: 'Competições',
      description: 'Gestão de campeonatos e torneios',
      href: '/admin/secretarias/esporte/competicoes',
      icon: TrendingUp,
      color: 'bg-orange-500'
    },
    {
      title: 'Eventos',
      description: 'Eventos esportivos e festivais',
      href: '/admin/secretarias/esporte/eventos',
      icon: Calendar,
      color: 'bg-purple-500'
    },
    {
      title: 'Infraestrutura',
      description: 'Equipamentos esportivos e instalações',
      href: '/admin/secretarias/esporte/infraestrutura',
      icon: Building2,
      color: 'bg-red-500'
    }
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Secretaria de Esportes</h1>
        <p className="text-muted-foreground mt-2">
          Gestão completa de esportes, atletas e eventos esportivos
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {modules.map((module) => (
          <Link key={module.href} href={module.href}>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-lg ${module.color}`}>
                    <module.icon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle>{module.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {module.description}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Estatísticas Rápidas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Equipes Ativas</p>
              <p className="text-2xl font-bold">-</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Atletas Cadastrados</p>
              <p className="text-2xl font-bold">-</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Competições Ativas</p>
              <p className="text-2xl font-bold">-</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Eventos este Mês</p>
              <p className="text-2xl font-bold">-</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
