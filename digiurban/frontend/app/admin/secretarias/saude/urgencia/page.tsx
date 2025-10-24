'use client'

import { useAdminAuth } from '@/contexts/AdminAuthContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Activity,
  Ambulance,
  AlertCircle,
  Clock,
  Users,
  Plus,
  Search,
  TrendingUp
} from 'lucide-react'
import { useState } from 'react'

export default function UrgenciaPage() {
  const { user } = useAdminAuth()
  const [filtro, setFiltro] = useState('')

  const chamadas24h = 1250
  const upasAbertas = 2
  const samuDisponivel = 4
  const emergenciasAtivas = 6

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Urgência e Emergência</h1>
          <p className="text-muted-foreground">SAMU, UPA e Prontos Atendimentos</p>
        </div>
        <Button className="bg-red-600 hover:bg-red-700">
          <Ambulance className="h-4 w-4 mr-2" />
          Acionar SAMU
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-red-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Chamadas 24h</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{chamadas24h}</div>
            <p className="text-xs text-muted-foreground">Últimas 24 horas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">UPAs Operando</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upasAbertas}</div>
            <p className="text-xs text-muted-foreground">Unidades abertas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">SAMU Disponível</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{samuDisponivel}</div>
            <p className="text-xs text-muted-foreground">Ambulâncias livres</p>
          </CardContent>
        </Card>

        <Card className="border-red-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Em Atendimento</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{emergenciasAtivas}</div>
            <p className="text-xs text-muted-foreground">Casos ativos</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Painel SAMU</CardTitle>
            <CardDescription>Ambulâncias e atendimentos em tempo real</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 border border-red-200 rounded-lg bg-red-50">
                <AlertCircle className="h-5 w-5 text-red-600" />
                <div className="flex-1">
                  <p className="font-medium text-sm">Emergência Cardíaca</p>
                  <p className="text-xs text-muted-foreground">Amb 192 - Bairro Centro</p>
                </div>
                <Badge variant="destructive">Em rota</Badge>
              </div>

              <div className="flex items-center gap-3 p-3 border rounded-lg">
                <Ambulance className="h-5 w-5 text-blue-600" />
                <div className="flex-1">
                  <p className="font-medium text-sm">Amb 193</p>
                  <p className="text-xs text-muted-foreground">Base Central - Disponível</p>
                </div>
                <Badge variant="outline" className="text-green-600">Livre</Badge>
              </div>

              <div className="flex items-center gap-3 p-3 border rounded-lg">
                <Ambulance className="h-5 w-5 text-blue-600" />
                <div className="flex-1">
                  <p className="font-medium text-sm">Amb 194</p>
                  <p className="text-xs text-muted-foreground">Base Norte - Disponível</p>
                </div>
                <Badge variant="outline" className="text-green-600">Livre</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>UPAs e Prontos Atendimentos</CardTitle>
            <CardDescription>Status das unidades de urgência</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium text-sm">UPA Central</p>
                  <p className="text-xs text-muted-foreground">45 atendimentos hoje</p>
                </div>
                <Badge variant="outline" className="text-orange-600">Lotada</Badge>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium text-sm">UPA Norte</p>
                  <p className="text-xs text-muted-foreground">23 atendimentos hoje</p>
                </div>
                <Badge variant="outline" className="text-green-600">Normal</Badge>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium text-sm">Pronto Socorro</p>
                  <p className="text-xs text-muted-foreground">78 atendimentos hoje</p>
                </div>
                <Badge variant="outline" className="text-red-600">Crítico</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
