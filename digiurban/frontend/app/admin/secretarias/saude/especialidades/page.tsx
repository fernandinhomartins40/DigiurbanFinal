'use client'
// @ts-nocheck

import { useAdminAuth } from '@/contexts/AdminAuthContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Stethoscope,
  Heart,
  Eye,
  Bone,
  Brain,
  Ear,
  Plus,
  Search,
  Calendar
} from 'lucide-react'
import { useState } from 'react'

const especialidades = [
  { nome: 'Cardiologia', icon: Heart, consultas: 145, especialistas: 6, aguardando: 34 },
  { nome: 'Oftalmologia', icon: Eye, consultas: 98, especialistas: 4, aguardando: 28 },
  { nome: 'Ortopedia', icon: Bone, consultas: 112, especialistas: 5, aguardando: 45 },
  { nome: 'Neurologia', icon: Brain, consultas: 67, especialistas: 3, aguardando: 19 },
  { nome: 'Otorrinolaringologia', icon: Ear, consultas: 54, especialistas: 2, aguardando: 12 }
]

export default function EspecialidadesPage() {
  const { user } = useAdminAuth()
  const [filtro, setFiltro] = useState('')

  const totalEspecialistas = 45
  const consultasMes = 890
  const pacientesAguardando = 245
  const mediaEspera = 12

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Consultórios Especializados</h1>
          <p className="text-muted-foreground">Especialidades Médicas e Ambulatórios</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Agendar Consulta
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Especialistas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEspecialistas}</div>
            <p className="text-xs text-muted-foreground">Médicos ativos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Consultas Mês</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{consultasMes}</div>
            <p className="text-xs text-muted-foreground">+18% vs mês anterior</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Fila de Espera</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{pacientesAguardando}</div>
            <p className="text-xs text-muted-foreground">Pacientes aguardando</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Média de Espera</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mediaEspera} dias</div>
            <p className="text-xs text-muted-foreground">Tempo médio</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Especialidades Disponíveis</CardTitle>
          <CardDescription>Gerencie consultas especializadas e agendamentos</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <div className="flex-1">
              <Input
                placeholder="Buscar especialidade..."
                value={filtro}
                onChange={(e) => setFiltro(e.target.value)}
              />
            </div>
            <Button variant="outline">
              <Search className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {especialidades.map((esp) => {
              const Icon = esp.icon
              return (
                <Card key={esp.nome}>
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-blue-100 rounded-lg">
                        <Icon className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">{esp.nome}</h3>
                        <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground">
                          <div>
                            <p className="font-medium">{esp.especialistas}</p>
                            <p>Médicos</p>
                          </div>
                          <div>
                            <p className="font-medium">{esp.consultas}</p>
                            <p>Consultas/mês</p>
                          </div>
                          <div>
                            <p className="font-medium text-orange-600">{esp.aguardando}</p>
                            <p>Na fila</p>
                          </div>
                        </div>
                      </div>
                      <Button size="sm" variant="outline">
                        <Calendar className="h-4 w-4 mr-2" />
                        Agendar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
