'use client'

import { useAdminAuth } from '@/contexts/AdminAuthContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  HandHeart,
  Users,
  Home,
  Shield,
  Heart,
  Gift,
  MapPin,
  FileText,
  AlertCircle,
  Baby,
  UserCheck,
  Plus
} from 'lucide-react'
import Link from 'next/link'

const assistenciaModules = [
  {
    title: 'Famílias Vulneráveis',
    description: 'Cadastro e acompanhamento de famílias em situação de vulnerabilidade',
    href: '/admin/secretarias/assistencia-social/familias',
    icon: Users,
    color: 'bg-red-100 text-red-800',
    stats: { familias: 340, acompanhadas: 280, vulnerabilidade_alta: 45 }
  },
  {
    title: 'CRAS e CREAS',
    description: 'Gestão dos Centros de Referência da Assistência Social',
    href: '/admin/secretarias/assistencia-social/cras-creas',
    icon: Home,
    color: 'bg-blue-100 text-blue-800',
    stats: { cras: 3, creas: 1, atendimentos_mes: 890, familias_ativas: 567 }
  },
  {
    title: 'Programas Sociais',
    description: 'Administração de programas municipais e federais',
    href: '/admin/secretarias/assistencia-social/programas',
    icon: Gift,
    color: 'bg-green-100 text-green-800',
    stats: { programas_ativos: 8, beneficiarios: 1240, auxilio_emergencial: 156 }
  },
  {
    title: 'Gerenciamento de Benefícios',
    description: 'Controle de benefícios eventuais e continuados',
    href: '/admin/secretarias/assistencia-social/beneficios',
    icon: Heart,
    color: 'bg-pink-100 text-pink-800',
    stats: { beneficios_mes: 234, auxilio_funeral: 12, auxilio_natalidade: 23 }
  },
  {
    title: 'Entregas Emergenciais',
    description: 'Sistema logístico para distribuição de itens essenciais',
    href: '/admin/secretarias/assistencia-social/entregas',
    icon: AlertCircle,
    color: 'bg-orange-100 text-orange-800',
    stats: { cestas_basicas: 145, kits_higiene: 89, entregas_mes: 234 }
  },
  {
    title: 'Registro de Visitas',
    description: 'Controle de visitas domiciliares e acompanhamento',
    href: '/admin/secretarias/assistencia-social/visitas',
    icon: MapPin,
    color: 'bg-purple-100 text-purple-800',
    stats: { visitas_mes: 456, familias_visitadas: 278, assistentes_sociais: 12 }
  },
  {
    title: 'Proteção à Criança',
    description: 'Medidas de proteção e acompanhamento de crianças',
    href: '/admin/secretarias/assistencia-social/protecao-crianca',
    icon: Baby,
    color: 'bg-yellow-100 text-yellow-800',
    stats: { criancas_acompanhadas: 89, medidas_ativas: 23, casos_resolvidos: 145 }
  },
  {
    title: 'Idosos e PCD',
    description: 'Atendimento especializado para idosos e pessoas com deficiência',
    href: '/admin/secretarias/assistencia-social/idosos-pcd',
    icon: UserCheck,
    color: 'bg-indigo-100 text-indigo-800',
    stats: { idosos_cadastrados: 567, pcd_cadastradas: 123, beneficios_ativos: 234 }
  }
]

export default function SecretariaAssistenciaSocialPage() {
  const { user } = useAdminAuth()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <HandHeart className="h-8 w-8 text-pink-600 mr-3" />
            Secretaria de Assistência Social
          </h1>
          <p className="text-gray-600 mt-1">
            Gestão integral da proteção social municipal
          </p>
        </div>
        <Badge variant="outline" className="text-pink-600 border-pink-200">
          SUAS Municipal
        </Badge>
      </div>

      {/* Estatísticas Gerais */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Famílias Cadastradas</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1.890</div>
            <p className="text-xs text-muted-foreground">
              340 em vulnerabilidade
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Atendimentos/Mês</CardTitle>
            <HandHeart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.456</div>
            <p className="text-xs text-muted-foreground">
              +18% vs mês anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Beneficiários</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1.240</div>
            <p className="text-xs text-muted-foreground">
              Em programas ativos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Equipamentos SUAS</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4</div>
            <p className="text-xs text-muted-foreground">
              3 CRAS + 1 CREAS
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
              <span>Nova Família</span>
            </Button>
            <Button className="h-20 flex flex-col" variant="outline">
              <Gift className="h-6 w-6 mb-2" />
              <span>Benefício Eventual</span>
            </Button>
            <Button className="h-20 flex flex-col" variant="outline">
              <MapPin className="h-6 w-6 mb-2" />
              <span>Agendar Visita</span>
            </Button>
            <Button className="h-20 flex flex-col" variant="outline">
              <FileText className="h-6 w-6 mb-2" />
              <span>Relatório SUAS</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Módulos Especializados */}
      <div>
        <h2 className="text-2xl font-semibold mb-6">Módulos Especializados</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {assistenciaModules.map((module) => (
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

      {/* Indicadores SUAS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Indicadores de Proteção Social</CardTitle>
            <CardDescription>
              Métricas de cobertura e atendimento
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Cobertura PAIF</span>
                <span className="font-semibold text-green-600">92%</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Famílias Acompanhadas</span>
                <span className="font-semibold">280/340</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Taxa de Superação</span>
                <span className="font-semibold text-green-600">68%</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Tempo Médio Acompanhamento</span>
                <span className="font-semibold">8.5 meses</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Casos de Alta Complexidade</span>
                <span className="font-semibold text-orange-600">45</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Benefícios Eventuais</CardTitle>
            <CardDescription>
              Distribuição mensal de benefícios
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Auxílio Vulnerabilidade</span>
                <span className="font-semibold">156 famílias</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Cestas Básicas</span>
                <span className="font-semibold">145 entregas</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Auxílio Funeral</span>
                <span className="font-semibold">12 casos</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Auxílio Natalidade</span>
                <span className="font-semibold">23 casos</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Kit Higiene</span>
                <span className="font-semibold">89 entregas</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}