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
  User,
  Brain,
  Heart,
  Shield,
  Users,
  Calendar,
  Plus,
  Search,
  Filter,
  FileText,
  Activity
} from 'lucide-react'
import { useState } from 'react'

const tiposAtendimento = [
  { id: 'consulta-psicologica', nome: 'Consulta Psicológica', icon: Brain },
  { id: 'consulta-psiquiatrica', nome: 'Consulta Psiquiátrica', icon: User },
  { id: 'terapia-grupo', nome: 'Terapia em Grupo', icon: Users },
  { id: 'caps', nome: 'Atendimento CAPS', icon: Shield },
  { id: 'emergencia-psiquiatrica', nome: 'Emergência Psiquiátrica', icon: Activity }
]

export default function SaudeMentalPage() {
  const { user } = useAdminAuth()
  const [filtro, setFiltro] = useState('')
  const [novoAtendimento, setNovoAtendimento] = useState({
    paciente: '',
    tipo: '',
    observacoes: '',
    caps: ''
  })

  const atendimentosHoje = 45
  const capsAtivos = 3
  const gruposTerapia = 8
  const emergencias = 2

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Saúde Mental</h1>
          <p className="text-muted-foreground">CAPS e Atendimento Psicológico</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Novo Atendimento
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Atendimentos Hoje</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{atendimentosHoje}</div>
            <p className="text-xs text-muted-foreground">+12% vs ontem</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">CAPS Ativos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{capsAtivos}</div>
            <p className="text-xs text-muted-foreground">Unidades em operação</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Grupos Terapia</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{gruposTerapia}</div>
            <p className="text-xs text-muted-foreground">Grupos ativos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Emergências</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{emergencias}</div>
            <p className="text-xs text-muted-foreground">Em atendimento</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Atendimentos de Saúde Mental</CardTitle>
          <CardDescription>Gerencie consultas, grupos terapêuticos e CAPS</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <div className="flex-1">
              <Input
                placeholder="Buscar por paciente, CPF ou protocolo..."
                value={filtro}
                onChange={(e) => setFiltro(e.target.value)}
                className="w-full"
              />
            </div>
            <Button variant="outline">
              <Search className="h-4 w-4 mr-2" />
              Buscar
            </Button>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filtros
            </Button>
          </div>

          <div className="space-y-4">
            <div className="text-center py-12 text-muted-foreground">
              <Brain className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Nenhum atendimento registrado no momento</p>
              <p className="text-sm">Clique em "Novo Atendimento" para começar</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
