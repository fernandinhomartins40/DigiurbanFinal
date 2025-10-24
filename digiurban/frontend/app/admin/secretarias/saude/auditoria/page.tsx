'use client'

import { useAdminAuth } from '@/contexts/AdminAuthContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  FileText,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  DollarSign,
  Plus,
  Search,
  Download
} from 'lucide-react'
import { useState } from 'react'

export default function AuditoriaPage() {
  const { user } = useAdminAuth()
  const [filtro, setFiltro] = useState('')

  const auditoriasMes = 12
  const conformidade = 95
  const faturamentoMes = 450000
  const glosasPendentes = 8

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Auditoria SUS</h1>
          <p className="text-muted-foreground">Controle de Qualidade e Faturamento</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nova Auditoria
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Auditorias Mês</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{auditoriasMes}</div>
            <p className="text-xs text-muted-foreground">Realizadas</p>
          </CardContent>
        </Card>

        <Card className="border-green-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Conformidade</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{conformidade}%</div>
            <p className="text-xs text-muted-foreground">Índice geral</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Faturamento</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {(faturamentoMes / 1000).toFixed(0)}K</div>
            <p className="text-xs text-muted-foreground">Este mês</p>
          </CardContent>
        </Card>

        <Card className="border-orange-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Glosas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{glosasPendentes}</div>
            <p className="text-xs text-muted-foreground">Pendentes</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Auditorias Realizadas</CardTitle>
            <CardDescription>Histórico de verificações de qualidade</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 border border-green-200 rounded-lg bg-green-50">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div className="flex-1">
                  <p className="font-medium text-sm">Auditoria Procedimentos Cirúrgicos</p>
                  <p className="text-xs text-muted-foreground">10/03/2025 - UPA Central</p>
                </div>
                <Badge variant="outline" className="text-green-600">Conforme</Badge>
              </div>

              <div className="flex items-center gap-3 p-3 border rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div className="flex-1">
                  <p className="font-medium text-sm">Auditoria Medicamentos de Alto Custo</p>
                  <p className="text-xs text-muted-foreground">08/03/2025 - Farmácia Municipal</p>
                </div>
                <Badge variant="outline" className="text-green-600">Conforme</Badge>
              </div>

              <div className="flex items-center gap-3 p-3 border border-orange-200 rounded-lg bg-orange-50">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
                <div className="flex-1">
                  <p className="font-medium text-sm">Auditoria AIH - Internações</p>
                  <p className="text-xs text-muted-foreground">05/03/2025 - Hospital Municipal</p>
                </div>
                <Badge variant="outline" className="text-orange-600">Pendências</Badge>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t">
              <Button variant="outline" className="w-full">
                Ver Todas as Auditorias
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Faturamento SUS</CardTitle>
            <CardDescription>Análise de produção e faturamento</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium text-sm">Procedimentos Ambulatoriais</p>
                  <p className="text-xs text-muted-foreground">Este mês</p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold">R$ 180K</div>
                  <p className="text-xs text-green-600 flex items-center gap-1 justify-end">
                    <TrendingUp className="h-3 w-3" />
                    +8%
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium text-sm">Internações (AIH)</p>
                  <p className="text-xs text-muted-foreground">Este mês</p>
                </div>
                <div className="text-lg font-bold">R$ 150K</div>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium text-sm">Medicamentos Alto Custo</p>
                  <p className="text-xs text-muted-foreground">Este mês</p>
                </div>
                <div className="text-lg font-bold">R$ 80K</div>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium text-sm">SADT (Exames)</p>
                  <p className="text-xs text-muted-foreground">Este mês</p>
                </div>
                <div className="text-lg font-bold">R$ 40K</div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t">
              <div className="flex items-center justify-between">
                <span className="font-medium">Total Faturado</span>
                <span className="text-2xl font-bold text-green-600">R$ 450K</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Indicadores de Qualidade</CardTitle>
          <CardDescription>Métricas de desempenho e conformidade</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Taxa de Glosa</span>
                <Badge variant="outline" className="text-green-600">Ótimo</Badge>
              </div>
              <div className="text-3xl font-bold">2.3%</div>
              <p className="text-xs text-muted-foreground mt-1">Meta: &lt; 5%</p>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Tempo Médio Auditoria</span>
                <Badge variant="outline">Normal</Badge>
              </div>
              <div className="text-3xl font-bold">5.2 dias</div>
              <p className="text-xs text-muted-foreground mt-1">Meta: &lt; 7 dias</p>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Aprovação 1ª Análise</span>
                <Badge variant="outline" className="text-green-600">Excelente</Badge>
              </div>
              <div className="text-3xl font-bold">92%</div>
              <p className="text-xs text-muted-foreground mt-1">Meta: &gt; 85%</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
