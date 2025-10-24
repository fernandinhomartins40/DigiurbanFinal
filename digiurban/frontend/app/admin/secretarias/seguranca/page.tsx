'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Shield,
  Camera,
  MapPin,
  AlertTriangle,
  Users,
  Car,
  FileText,
  Activity,
  Plus,
  Phone
} from 'lucide-react'
import Link from 'next/link'

const segurancaModules = [
  {
    title: 'Registro de Ocorrências',
    description: 'Boletins e registros de ocorrências municipais',
    href: '/admin/secretarias/seguranca/ocorrencias',
    icon: FileText,
    color: 'bg-red-100 text-red-800',
    stats: { ocorrencias_mes: 234, furtos: 45, perturbacao: 89, violencia: 12 }
  },
  {
    title: 'Apoio da Guarda',
    description: 'Coordenação operacional da Guarda Municipal',
    href: '/admin/secretarias/seguranca/guarda',
    icon: Shield,
    color: 'bg-blue-100 text-blue-800',
    stats: { guardas_ativo: 45, viaturas: 8, turnos: 3, atendimentos_dia: 67 }
  },
  {
    title: 'Mapa de Pontos Críticos',
    description: 'Identificação e monitoramento de áreas de risco',
    href: '/admin/secretarias/seguranca/pontos-criticos',
    icon: MapPin,
    color: 'bg-orange-100 text-orange-800',
    stats: { pontos_criticos: 23, monitorados: 15, resolvidos: 8 }
  },
  {
    title: 'Alertas de Segurança',
    description: 'Sistema de alertas emergenciais para a população',
    href: '/admin/secretarias/seguranca/alertas',
    icon: AlertTriangle,
    color: 'bg-yellow-100 text-yellow-800',
    stats: { alertas_mes: 12, cadastrados: 4567, efetividade: '94%' }
  },
  {
    title: 'Estatísticas Regionais',
    description: 'Indicadores de segurança territorializados',
    href: '/admin/secretarias/seguranca/estatisticas',
    icon: Activity,
    color: 'bg-purple-100 text-purple-800',
    stats: { regioes: 12, criminalidade: '-15%', indice_paz: 7.2 }
  },
  {
    title: 'Vigilância Integrada',
    description: 'Central de monitoramento e câmeras',
    href: '/admin/secretarias/seguranca/vigilancia',
    icon: Camera,
    color: 'bg-teal-100 text-teal-800',
    stats: { cameras: 156, funcionando: 145, gravacoes_dia: 89 }
  },
  {
    title: 'Patrulhamento',
    description: 'Gestão de rotas e escalas de patrulhamento',
    href: '/admin/secretarias/seguranca/patrulhamento',
    icon: Car,
    color: 'bg-green-100 text-green-800',
    stats: { rotas_ativas: 18, kms_dia: 890, cobertura: '92%' }
  },
  {
    title: 'Equipes Operacionais',
    description: 'Gestão de pessoal e operações especiais',
    href: '/admin/secretarias/seguranca/equipes',
    icon: Users,
    color: 'bg-indigo-100 text-indigo-800',
    stats: { guardas: 45, operacoes_mes: 12, treinamentos: 8 }
  }
]

export default function SecretariaSegurancaPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Shield className="h-8 w-8 text-blue-600 mr-3" />
            Secretaria de Segurança Pública
          </h1>
          <p className="text-gray-600 mt-1">
            Gestão da segurança e Guarda Municipal
          </p>
        </div>
        <Badge variant="outline" className="text-blue-600 border-blue-200">
          Guarda Municipal
        </Badge>
      </div>

      {/* Estatísticas Gerais */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Guardas Municipais</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45</div>
            <p className="text-xs text-muted-foreground">
              8 viaturas ativas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ocorrências/Mês</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">234</div>
            <p className="text-xs text-muted-foreground">
              -12% vs mês anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Câmeras Ativas</CardTitle>
            <Camera className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">145</div>
            <p className="text-xs text-muted-foreground">
              93% funcionando
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Índice de Paz</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7.2</div>
            <p className="text-xs text-muted-foreground">
              +0.3 vs ano anterior
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Módulos Especializados */}
      <div>
        <h2 className="text-2xl font-semibold mb-6">Módulos Especializados</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {segurancaModules.map((module) => (
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
              <span>Nova Ocorrência</span>
            </Button>
            <Button className="h-20 flex flex-col" variant="outline">
              <Phone className="h-6 w-6 mb-2" />
              <span>Emergência 153</span>
            </Button>
            <Button className="h-20 flex flex-col" variant="outline">
              <Camera className="h-6 w-6 mb-2" />
              <span>Central Vigilância</span>
            </Button>
            <Button className="h-20 flex flex-col" variant="outline">
              <MapPin className="h-6 w-6 mb-2" />
              <span>Mapa Criminal</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}