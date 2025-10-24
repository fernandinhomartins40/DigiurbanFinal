'use client'

import { useAdminAuth } from '@/contexts/AdminAuthContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Computer,
  Wifi,
  Monitor,
  Tablet,
  Globe,
  Plus,
  Search,
  Activity
} from 'lucide-react'
import { useState } from 'react'

export default function TecnologiaPage() {
  const { user } = useAdminAuth()
  const [filtro, setFiltro] = useState('')

  const laboratorios = 15
  const computadores = 240
  const tablets = 120
  const escolasComInternet = 18

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Tecnologia Educacional</h1>
          <p className="text-muted-foreground">Laboratórios de Informática e EaD</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Activity className="h-4 w-4 mr-2" />
            Status Equipamentos
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Novo Equipamento
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Laboratórios</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{laboratorios}</div>
            <p className="text-xs text-muted-foreground">Ativos na rede</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Computadores</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{computadores}</div>
            <p className="text-xs text-muted-foreground">Desktops em uso</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Tablets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tablets}</div>
            <p className="text-xs text-muted-foreground">Distribuídos</p>
          </CardContent>
        </Card>

        <Card className="border-green-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Internet</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{escolasComInternet}/18</div>
            <p className="text-xs text-muted-foreground">Escolas conectadas</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Laboratórios de Informática</CardTitle>
            <CardDescription>Distribuição por escola</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Computer className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-sm">E.M. Presidente Kennedy</p>
                    <p className="text-xs text-muted-foreground">2 laboratórios • 40 computadores</p>
                  </div>
                </div>
                <Badge variant="outline" className="text-green-600">Ativo</Badge>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Computer className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-sm">E.M. Santos Dumont</p>
                    <p className="text-xs text-muted-foreground">1 laboratório • 20 computadores</p>
                  </div>
                </div>
                <Badge variant="outline" className="text-green-600">Ativo</Badge>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Computer className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-sm">E.M. Prof. Maria Silva</p>
                    <p className="text-xs text-muted-foreground">1 laboratório • 15 computadores</p>
                  </div>
                </div>
                <Badge variant="outline" className="text-orange-600">Manutenção</Badge>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t">
              <Button variant="outline" className="w-full">
                Ver Todos os Laboratórios
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Infraestrutura de Rede</CardTitle>
            <CardDescription>Conectividade e largura de banda</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 border border-green-200 rounded-lg bg-green-50">
                <div className="flex items-center gap-3 mb-2">
                  <Wifi className="h-5 w-5 text-green-600" />
                  <span className="font-medium">Fibra Óptica</span>
                </div>
                <p className="text-sm mb-2">12 escolas conectadas</p>
                <div className="text-xs text-muted-foreground">
                  Velocidade: 100 Mbps (média)
                </div>
              </div>

              <div className="p-4 border border-blue-200 rounded-lg bg-blue-50">
                <div className="flex items-center gap-3 mb-2">
                  <Globe className="h-5 w-5 text-blue-600" />
                  <span className="font-medium">Internet Via Rádio</span>
                </div>
                <p className="text-sm mb-2">6 escolas (zona rural)</p>
                <div className="text-xs text-muted-foreground">
                  Velocidade: 20 Mbps (média)
                </div>
              </div>

              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">Cobertura WiFi</span>
                  <Badge variant="outline">100%</Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  Todas as escolas com rede sem fio
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recursos Digitais e Plataformas</CardTitle>
          <CardDescription>Ferramentas utilizadas na rede municipal</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <Monitor className="h-6 w-6 text-purple-600" />
                <div>
                  <p className="font-medium">Plataforma EaD</p>
                  <Badge variant="outline" className="mt-1">4.520 usuários</Badge>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Google Classroom e Moodle em uso
              </p>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <Tablet className="h-6 w-6 text-blue-600" />
                <div>
                  <p className="font-medium">Apps Educacionais</p>
                  <Badge variant="outline" className="mt-1">45 aplicativos</Badge>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Licenças ativas de softwares educacionais
              </p>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <Globe className="h-6 w-6 text-green-600" />
                <div>
                  <p className="font-medium">Portal Educacional</p>
                  <Badge variant="outline" className="mt-1">12.5K visitas/mês</Badge>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Conteúdos e recursos online
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Capacitação Digital</CardTitle>
          <CardDescription>Treinamento de professores e funcionários</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">Professores Capacitados</span>
                <Badge variant="outline" className="text-green-600">89%</Badge>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: '89%' }}></div>
              </div>
              <p className="text-xs text-muted-foreground">156 de 175 professores</p>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">Cursos Oferecidos</span>
                <Badge variant="outline">2024</Badge>
              </div>
              <div className="text-2xl font-bold mb-2">12</div>
              <p className="text-xs text-muted-foreground">
                Informática básica, Google Suite, EaD
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
