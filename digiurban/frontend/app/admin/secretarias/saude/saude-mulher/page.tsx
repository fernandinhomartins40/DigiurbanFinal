'use client'

import { useAdminAuth } from '@/contexts/AdminAuthContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Baby,
  Heart,
  Activity,
  Calendar,
  FileText,
  Plus,
  Search,
  Filter
} from 'lucide-react'
import { useState } from 'react'

export default function SaudeMulherPage() {
  const { user } = useAdminAuth()
  const [filtro, setFiltro] = useState('')

  const gestantes = 156
  const preventivos = 320
  const prenatalHoje = 12
  const altoRisco = 8

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Saúde da Mulher</h1>
          <p className="text-muted-foreground">Pré-natal, Prevenção e Saúde Reprodutiva</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Novo Cadastro
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Gestantes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{gestantes}</div>
            <p className="text-xs text-muted-foreground">Em acompanhamento</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Preventivos Mês</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{preventivos}</div>
            <p className="text-xs text-muted-foreground">+15% vs mês anterior</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pré-natal Hoje</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{prenatalHoje}</div>
            <p className="text-xs text-muted-foreground">Consultas agendadas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Alto Risco</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{altoRisco}</div>
            <p className="text-xs text-muted-foreground">Gestações de risco</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Pré-natal</CardTitle>
            <CardDescription>Acompanhamento de gestantes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 mb-4">
              <div className="flex-1">
                <Input
                  placeholder="Buscar gestante..."
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
                <Baby className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Nenhuma gestante encontrada</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Exames Preventivos</CardTitle>
            <CardDescription>Controle de citologias e mamografias</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium text-sm">Preventivos Realizados</p>
                  <p className="text-xs text-muted-foreground">Este mês</p>
                </div>
                <div className="text-2xl font-bold">320</div>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium text-sm">Mamografias</p>
                  <p className="text-xs text-muted-foreground">Este mês</p>
                </div>
                <div className="text-2xl font-bold">89</div>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium text-sm">Resultados Pendentes</p>
                  <p className="text-xs text-muted-foreground">Aguardando</p>
                </div>
                <div className="text-2xl font-bold text-orange-600">23</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
