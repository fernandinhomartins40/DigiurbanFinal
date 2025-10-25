'use client'

import { useAdminAuth } from '@/contexts/AdminAuthContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Palette,
  Theater,
  Calendar,
  Users,
  BookOpen,
  Music,
  Camera,
  Award,
  MapPin,
  Plus
} from 'lucide-react'
import Link from 'next/link'

const culturaModules = [
  {
    title: 'Espaços Culturais',
    description: 'Gestão de teatros, bibliotecas e centros culturais',
    href: '/admin/secretarias/cultura/espacos',
    icon: Theater,
    color: 'bg-purple-100 text-purple-800',
    stats: { espacos: 8, reservas_mes: 45, eventos_realizados: 23 }
  },
  {
    title: 'Projetos Culturais',
    description: 'Editais, fomento e apoio a projetos',
    href: '/admin/secretarias/cultura/projetos',
    icon: BookOpen,
    color: 'bg-blue-100 text-blue-800',
    stats: { projetos_ativos: 12, editais_abertos: 3, investimento: 'R$ 240k' }
  },
  {
    title: 'Eventos Culturais',
    description: 'Organização e promoção de eventos',
    href: '/admin/secretarias/cultura/eventos',
    icon: Calendar,
    color: 'bg-green-100 text-green-800',
    stats: { eventos_mes: 15, participantes: 2890, proximos: 8 }
  },
  {
    title: 'Grupos Artísticos',
    description: 'Cadastro e apoio a grupos locais',
    href: '/admin/secretarias/cultura/grupos',
    icon: Users,
    color: 'bg-orange-100 text-orange-800',
    stats: { grupos_cadastrados: 34, apresentacoes_mes: 12, categorias: 8 }
  },
  {
    title: 'Oficinas e Cursos',
    description: 'Educação cultural e formação artística',
    href: '/admin/secretarias/cultura/oficinas',
    icon: Music,
    color: 'bg-pink-100 text-pink-800',
    stats: { oficinas_ativas: 18, alunos: 456, certificados: 89 }
  },
  {
    title: 'Manifestações Culturais',
    description: 'Patrimônio imaterial e tradições',
    href: '/admin/secretarias/cultura/manifestacoes',
    icon: Camera,
    color: 'bg-teal-100 text-teal-800',
    stats: { manifestacoes: 23, documentadas: 15, em_processo: 5 }
  },
  {
    title: 'Pontos de Cultura',
    description: 'Rede de pontos e territórios culturais',
    href: '/admin/secretarias/cultura/pontos',
    icon: MapPin,
    color: 'bg-indigo-100 text-indigo-800',
    stats: { pontos_ativos: 12, beneficiados: 890, territorios: 6 }
  },
  {
    title: 'Prêmios e Concursos',
    description: 'Competições e reconhecimentos culturais',
    href: '/admin/secretarias/cultura/premios',
    icon: Award,
    color: 'bg-yellow-100 text-yellow-800',
    stats: { concursos_ano: 8, inscricoes: 234, premiados: 45 }
  }
]

export default function SecretariaCulturaPage() {
  const { user } = useAdminAuth()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Palette className="h-8 w-8 text-purple-600 mr-3" />
            Secretaria Municipal de Cultura
          </h1>
          <p className="text-gray-600 mt-1">
            Promoção e gestão cultural municipal
          </p>
        </div>
        <Badge variant="outline" className="text-purple-600 border-purple-200">
          Cultura Viva
        </Badge>
      </div>

      {/* Estatísticas Gerais */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Espaços Culturais</CardTitle>
            <Theater className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">
              45 reservas este mês
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Eventos/Mês</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">15</div>
            <p className="text-xs text-muted-foreground">
              2.890 participantes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Grupos Artísticos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">34</div>
            <p className="text-xs text-muted-foreground">
              12 apresentações/mês
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Oficinas Ativas</CardTitle>
            <Music className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18</div>
            <p className="text-xs text-muted-foreground">
              456 alunos
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
              <span>Novo Evento</span>
            </Button>
            <Button className="h-20 flex flex-col" variant="outline">
              <Theater className="h-6 w-6 mb-2" />
              <span>Reservar Espaço</span>
            </Button>
            <Button className="h-20 flex flex-col" variant="outline">
              <Users className="h-6 w-6 mb-2" />
              <span>Cadastrar Grupo</span>
            </Button>
            <Button className="h-20 flex flex-col" variant="outline">
              <BookOpen className="h-6 w-6 mb-2" />
              <span>Novo Projeto</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Módulos Especializados */}
      <div>
        <h2 className="text-2xl font-semibold mb-6">Módulos Especializados</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {culturaModules.map((module) => (
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