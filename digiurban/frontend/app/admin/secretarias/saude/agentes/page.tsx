'use client'

import { useAdminAuth } from '@/contexts/AdminAuthContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Users,
  Home,
  MapPin,
  TrendingUp,
  Plus,
  Search,
  Activity
} from 'lucide-react'
import { useState } from 'react'

export default function AgentesPage() {
  const { user } = useAdminAuth()
  const [filtro, setFiltro] = useState('')

  const totalAgentes = 78
  const visitasHoje = 2340
  const familiasCobertas = 12500
  const microareas = 45

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Agentes Comunitários de Saúde</h1>
          <p className="text-muted-foreground">Gestão de ACS e Territorialização</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Cadastrar ACS
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">ACS Ativos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAgentes}</div>
            <p className="text-xs text-muted-foreground">Agentes em campo</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Visitas Hoje</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{visitasHoje}</div>
            <p className="text-xs text-muted-foreground">+5% vs ontem</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Famílias Cobertas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{familiasCobertas.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Total cadastradas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Microáreas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{microareas}</div>
            <p className="text-xs text-muted-foreground">Áreas mapeadas</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Agentes por Área</CardTitle>
            <CardDescription>Distribuição territorial dos ACS</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-sm">UBS Central</p>
                    <p className="text-xs text-muted-foreground">18 agentes</p>
                  </div>
                </div>
                <Badge variant="outline">3.200 famílias</Badge>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-medium text-sm">UBS Norte</p>
                    <p className="text-xs text-muted-foreground">15 agentes</p>
                  </div>
                </div>
                <Badge variant="outline">2.800 famílias</Badge>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="font-medium text-sm">UBS Sul</p>
                    <p className="text-xs text-muted-foreground">12 agentes</p>
                  </div>
                </div>
                <Badge variant="outline">2.100 famílias</Badge>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-orange-600" />
                  <div>
                    <p className="font-medium text-sm">UBS Leste</p>
                    <p className="text-xs text-muted-foreground">10 agentes</p>
                  </div>
                </div>
                <Badge variant="outline">1.900 famílias</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Produtividade Mensal</CardTitle>
            <CardDescription>Métricas de visitas e atendimentos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium text-sm">Visitas Domiciliares</p>
                  <p className="text-xs text-muted-foreground">Este mês</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">45.230</div>
                  <p className="text-xs text-green-600 flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    +12%
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium text-sm">Cadastros Atualizados</p>
                  <p className="text-xs text-muted-foreground">Este mês</p>
                </div>
                <div className="text-2xl font-bold">3.450</div>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium text-sm">Encaminhamentos</p>
                  <p className="text-xs text-muted-foreground">Este mês</p>
                </div>
                <div className="text-2xl font-bold">890</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
