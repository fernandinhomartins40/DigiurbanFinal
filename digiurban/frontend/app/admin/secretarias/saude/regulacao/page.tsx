'use client'

import { useAdminAuth } from '@/contexts/AdminAuthContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
  Search,
  Filter
} from 'lucide-react'
import { useState } from 'react'

export default function RegulacaoPage() {
  const { user } = useAdminAuth()
  const [filtro, setFiltro] = useState('')

  const pendentes = 245
  const reguladasHoje = 67
  const totalReguladas = 1890
  const tempoMedioRegulacao = 3.5

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Central de Regulação</h1>
          <p className="text-muted-foreground">Marcação e Regulação de Consultas Especializadas</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Nova Solicitação
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-orange-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{pendentes}</div>
            <p className="text-xs text-muted-foreground">Aguardando regulação</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Reguladas Hoje</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reguladasHoje}</div>
            <p className="text-xs text-muted-foreground">Autorizadas hoje</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Mês</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalReguladas}</div>
            <p className="text-xs text-muted-foreground">Reguladas no mês</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Tempo Médio</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tempoMedioRegulacao} dias</div>
            <p className="text-xs text-muted-foreground">Para regulação</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Solicitações Pendentes</CardTitle>
            <CardDescription>Aguardando análise e regulação</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 mb-4">
              <div className="flex-1">
                <Input
                  placeholder="Buscar solicitação..."
                  value={filtro}
                  onChange={(e) => setFiltro(e.target.value)}
                />
              </div>
              <Button variant="outline">
                <Search className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 border rounded-lg">
                <Clock className="h-5 w-5 text-orange-500" />
                <div className="flex-1">
                  <p className="font-medium text-sm">Consulta Cardiologia</p>
                  <p className="text-xs text-muted-foreground">Maria Silva - há 2 dias</p>
                </div>
                <Badge variant="outline" className="text-orange-600">Pendente</Badge>
              </div>

              <div className="flex items-center gap-3 p-3 border rounded-lg">
                <Clock className="h-5 w-5 text-orange-500" />
                <div className="flex-1">
                  <p className="font-medium text-sm">Consulta Neurologia</p>
                  <p className="text-xs text-muted-foreground">João Santos - há 1 dia</p>
                </div>
                <Badge variant="outline" className="text-orange-600">Pendente</Badge>
              </div>

              <div className="flex items-center gap-3 p-3 border rounded-lg">
                <AlertCircle className="h-5 w-5 text-red-500" />
                <div className="flex-1">
                  <p className="font-medium text-sm">Consulta Ortopedia</p>
                  <p className="text-xs text-muted-foreground">Ana Costa - há 5 dias</p>
                </div>
                <Badge variant="destructive">Urgente</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Reguladas Recentemente</CardTitle>
            <CardDescription>Consultas autorizadas e agendadas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 border border-green-200 rounded-lg bg-green-50">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div className="flex-1">
                  <p className="font-medium text-sm">Consulta Oftalmologia</p>
                  <p className="text-xs text-muted-foreground">Pedro Lima - 15/03 às 14h</p>
                </div>
                <Badge variant="outline" className="text-green-600">Regulada</Badge>
              </div>

              <div className="flex items-center gap-3 p-3 border border-green-200 rounded-lg bg-green-50">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div className="flex-1">
                  <p className="font-medium text-sm">Exame Ecocardiograma</p>
                  <p className="text-xs text-muted-foreground">Carlos Souza - 18/03 às 10h</p>
                </div>
                <Badge variant="outline" className="text-green-600">Regulada</Badge>
              </div>

              <div className="flex items-center gap-3 p-3 border border-green-200 rounded-lg bg-green-50">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div className="flex-1">
                  <p className="font-medium text-sm">Consulta Dermatologia</p>
                  <p className="text-xs text-muted-foreground">Lucia Alves - 20/03 às 16h</p>
                </div>
                <Badge variant="outline" className="text-green-600">Regulada</Badge>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Taxa de sucesso</span>
                <span className="font-bold text-green-600">94.5%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
