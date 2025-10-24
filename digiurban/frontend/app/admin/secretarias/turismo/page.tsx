'use client'

import { useAdminAuth } from '@/contexts/AdminAuthContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Camera,
  MapPin,
  Building,
  Calendar,
  Users,
  Info,
  Star,
  TrendingUp,
  Plus
} from 'lucide-react'
import Link from 'next/link'

const turismoModules = [
  {
    title: 'Atendimentos',
    description: 'Informações e suporte ao turista',
    href: '/admin/secretarias/turismo/atendimentos',
    icon: Users,
    color: 'bg-blue-100 text-blue-800',
    stats: { atendimentos_mes: 890, turistas: 2340, satisfacao: '95%' }
  },
  {
    title: 'Pontos Turísticos',
    description: 'Cadastro e gestão de atrativos turísticos',
    href: '/admin/secretarias/turismo/pontos-turisticos',
    icon: MapPin,
    color: 'bg-green-100 text-green-800',
    stats: { pontos_cadastrados: 45, visitantes_mes: 12500, avaliacoes: 4.8 }
  },
  {
    title: 'Estabelecimentos Locais',
    description: 'Hotéis, pousadas e restaurantes',
    href: '/admin/secretarias/turismo/estabelecimentos-locais',
    icon: Building,
    color: 'bg-purple-100 text-purple-800',
    stats: { estabelecimentos: 78, leitos: 450, restaurantes: 89 }
  },
  {
    title: 'Programas Turísticos',
    description: 'Roteiros e pacotes turísticos',
    href: '/admin/secretarias/turismo/programas-turisticos',
    icon: Star,
    color: 'bg-yellow-100 text-yellow-800',
    stats: { programas_ativos: 12, participantes: 1890, receita: 'R$ 340k' }
  },
  {
    title: 'Eventos Turísticos',
    description: 'Festivais e eventos que atraem turistas',
    href: '/admin/secretarias/turismo/eventos-turisticos',
    icon: Calendar,
    color: 'bg-pink-100 text-pink-800',
    stats: { eventos_ano: 24, visitantes: 45000, impacto_economico: 'R$ 1.2M' }
  },
  {
    title: 'Informações Turísticas',
    description: 'Conteúdo e materiais informativos',
    href: '/admin/secretarias/turismo/informacoes-turisticas',
    icon: Info,
    color: 'bg-indigo-100 text-indigo-800',
    stats: { guias_disponiveis: 15, idiomas: 3, downloads: 8900 }
  },
  {
    title: 'Mapa Turístico',
    description: 'Mapeamento e geolocalização de atrativos',
    href: '/admin/secretarias/turismo/mapa-turistico',
    icon: Camera,
    color: 'bg-teal-100 text-teal-800',
    stats: { locais_mapeados: 67, rotas: 12, acessos_mes: 5600 }
  },
  {
    title: 'Dashboard Turismo',
    description: 'Indicadores e métricas do turismo',
    href: '/admin/secretarias/turismo/dashboard-turismo',
    icon: TrendingUp,
    color: 'bg-orange-100 text-orange-800',
    stats: { visitantes_ano: 89000, receita: 'R$ 4.5M', crescimento: '+22%' }
  }
]

export default function SecretariaTurismoPage() {
  const { user } = useAdminAuth()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Camera className="h-8 w-8 text-blue-600 mr-3" />
            Secretaria Municipal de Turismo
          </h1>
          <p className="text-gray-600 mt-1">
            Desenvolvimento e promoção do turismo local
          </p>
        </div>
        <Badge variant="outline" className="text-blue-600 border-blue-200">
          Destino Acolhedor
        </Badge>
      </div>

      {/* Estatísticas Gerais */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pontos Turísticos</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45</div>
            <p className="text-xs text-muted-foreground">
              12.5k visitantes/mês
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Estabelecimentos</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">78</div>
            <p className="text-xs text-muted-foreground">
              450 leitos disponíveis
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Atendimentos/Mês</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">890</div>
            <p className="text-xs text-muted-foreground">
              95% satisfação
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Visitantes/Ano</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89k</div>
            <p className="text-xs text-muted-foreground">
              +22% crescimento
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Módulos Especializados */}
      <div>
        <h2 className="text-2xl font-semibold mb-6">Módulos Especializados</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {turismoModules.map((module) => (
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
              <span>Novo Ponto Turístico</span>
            </Button>
            <Button className="h-20 flex flex-col" variant="outline">
              <Building className="h-6 w-6 mb-2" />
              <span>Cadastrar Estabelecimento</span>
            </Button>
            <Button className="h-20 flex flex-col" variant="outline">
              <Calendar className="h-6 w-6 mb-2" />
              <span>Novo Evento</span>
            </Button>
            <Button className="h-20 flex flex-col" variant="outline">
              <Star className="h-6 w-6 mb-2" />
              <span>Criar Programa</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
