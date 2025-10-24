'use client'

import { useAdminAuth } from '@/contexts/AdminAuthContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Pill,
  Package,
  AlertTriangle,
  TrendingDown,
  Plus,
  Search,
  Filter,
  FileText,
  Truck
} from 'lucide-react'
import { useState } from 'react'

export default function FarmaciaPage() {
  const { user } = useAdminAuth()
  const [filtro, setFiltro] = useState('')

  const medicamentosEstoque = 1200
  const entregasHoje = 580
  const estoqueBaixo = 45
  const vencendoEm30 = 12

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Farmácia Municipal</h1>
          <p className="text-muted-foreground">Controle de Medicamentos e Distribuição</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Nova Entrega
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Medicamentos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{medicamentosEstoque}</div>
            <p className="text-xs text-muted-foreground">Itens em estoque</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Entregas Hoje</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{entregasHoje}</div>
            <p className="text-xs text-muted-foreground">+8% vs ontem</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Estoque Baixo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{estoqueBaixo}</div>
            <p className="text-xs text-muted-foreground">Requer atenção</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Vencendo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{vencendoEm30}</div>
            <p className="text-xs text-muted-foreground">Próximos 30 dias</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Estoque de Medicamentos</CardTitle>
            <CardDescription>Controle de inventário e validade</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 mb-4">
              <div className="flex-1">
                <Input
                  placeholder="Buscar medicamento..."
                  value={filtro}
                  onChange={(e) => setFiltro(e.target.value)}
                />
              </div>
              <Button variant="outline">
                <Search className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-4">
              <div className="text-center py-12 text-muted-foreground">
                <Pill className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Nenhum medicamento encontrado</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Alertas de Estoque</CardTitle>
            <CardDescription>Medicamentos que precisam de atenção</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 border rounded-lg">
                <AlertTriangle className="h-5 w-5 text-orange-500" />
                <div className="flex-1">
                  <p className="font-medium text-sm">Dipirona 500mg</p>
                  <p className="text-xs text-muted-foreground">Estoque: 50 unidades</p>
                </div>
                <Badge variant="outline" className="text-orange-600">Baixo</Badge>
              </div>

              <div className="flex items-center gap-3 p-3 border rounded-lg">
                <TrendingDown className="h-5 w-5 text-red-500" />
                <div className="flex-1">
                  <p className="font-medium text-sm">Paracetamol 750mg</p>
                  <p className="text-xs text-muted-foreground">Vence em 15 dias</p>
                </div>
                <Badge variant="outline" className="text-red-600">Vencendo</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
