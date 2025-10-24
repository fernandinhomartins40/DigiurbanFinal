'use client'

import { useAdminAuth } from '@/contexts/AdminAuthContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  TreePine,
  Users,
  FileText,
  MapPin,
  AlertTriangle,
  Leaf,
  Recycle,
  TrendingUp,
  Plus
} from 'lucide-react'
import Link from 'next/link'

const meioAmbienteModules = [
  {
    title: 'Atendimentos',
    description: 'Solicitações e denúncias ambientais',
    href: '/admin/secretarias/meio-ambiente/atendimentos',
    icon: Users,
    color: 'bg-green-100 text-green-800',
    stats: { atendimentos_mes: 156, denuncias: 45, resolvidas: 234 }
  },
  {
    title: 'Licenças Ambientais',
    description: 'Emissão e controle de licenciamentos',
    href: '/admin/secretarias/meio-ambiente/licencas-ambientais',
    icon: FileText,
    color: 'bg-blue-100 text-blue-800',
    stats: { licencas_ativas: 234, em_analise: 45, emitidas_ano: 567 }
  },
  {
    title: 'Registro de Denúncias',
    description: 'Crimes e infrações ambientais',
    href: '/admin/secretarias/meio-ambiente/registro-denuncias',
    icon: AlertTriangle,
    color: 'bg-red-100 text-red-800',
    stats: { denuncias_mes: 89, investigando: 23, resolvidas: 456 }
  },
  {
    title: 'Áreas Protegidas',
    description: 'Gestão de reservas e áreas de preservação',
    href: '/admin/secretarias/meio-ambiente/areas-protegidas',
    icon: MapPin,
    color: 'bg-emerald-100 text-emerald-800',
    stats: { areas_protegidas: 12, hectares: 8900, especies_catalogadas: 345 }
  },
  {
    title: 'Programas Ambientais',
    description: 'Iniciativas de educação e conservação',
    href: '/admin/secretarias/meio-ambiente/programas-ambientais',
    icon: Leaf,
    color: 'bg-lime-100 text-lime-800',
    stats: { programas_ativos: 15, participantes: 2340, arvores_plantadas: 12500 }
  },
  {
    title: 'Coleta Seletiva',
    description: 'Gestão de resíduos e reciclagem',
    href: '/admin/secretarias/meio-ambiente/coleta-seletiva',
    icon: Recycle,
    color: 'bg-teal-100 text-teal-800',
    stats: { pontos_coleta: 45, toneladas_mes: 89, taxa_reciclagem: '35%' }
  },
  {
    title: 'Monitoramento Ambiental',
    description: 'Qualidade do ar, água e solo',
    href: '/admin/secretarias/meio-ambiente/monitoramento',
    icon: TreePine,
    color: 'bg-indigo-100 text-indigo-800',
    stats: { estacoes_medicao: 8, parametros: 24, conformidade: '92%' }
  },
  {
    title: 'Dashboard Meio Ambiente',
    description: 'Indicadores e métricas ambientais',
    href: '/admin/secretarias/meio-ambiente/dashboard-meio-ambiente',
    icon: TrendingUp,
    color: 'bg-purple-100 text-purple-800',
    stats: { indice_qualidade: 8.5, melhoria: '+12%', metas_atingidas: '85%' }
  }
]

export default function SecretariaMeioAmbientePage() {
  const { user } = useAdminAuth()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <TreePine className="h-8 w-8 text-green-600 mr-3" />
            Secretaria Municipal de Meio Ambiente
          </h1>
          <p className="text-gray-600 mt-1">
            Proteção e conservação ambiental
          </p>
        </div>
        <Badge variant="outline" className="text-green-600 border-green-200">
          Cidade Sustentável
        </Badge>
      </div>

      {/* Estatísticas Gerais */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Áreas Protegidas</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              8.900 hectares
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Licenças Ativas</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">234</div>
            <p className="text-xs text-muted-foreground">
              45 em análise
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Programas Ativos</CardTitle>
            <Leaf className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">15</div>
            <p className="text-xs text-muted-foreground">
              2.340 participantes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Índice Qualidade</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8.5</div>
            <p className="text-xs text-muted-foreground">
              +12% melhoria
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Módulos Especializados */}
      <div>
        <h2 className="text-2xl font-semibold mb-6">Módulos Especializados</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {meioAmbienteModules.map((module) => (
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
              <span>Registrar Denúncia</span>
            </Button>
            <Button className="h-20 flex flex-col" variant="outline">
              <FileText className="h-6 w-6 mb-2" />
              <span>Nova Licença</span>
            </Button>
            <Button className="h-20 flex flex-col" variant="outline">
              <Leaf className="h-6 w-6 mb-2" />
              <span>Cadastrar Programa</span>
            </Button>
            <Button className="h-20 flex flex-col" variant="outline">
              <MapPin className="h-6 w-6 mb-2" />
              <span>Mapear Área</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
