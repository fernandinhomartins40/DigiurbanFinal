'use client'

import { useAdminAuth } from '@/contexts/AdminAuthContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  BookOpen,
  FileText,
  Users,
  Award,
  Target,
  Plus,
  Search,
  Filter,
  Download
} from 'lucide-react'
import { useState } from 'react'

const disciplinas = [
  { id: 1, nome: 'Matemática', cargaHoraria: 200, turmas: 45, professores: 8 },
  { id: 2, nome: 'Português', cargaHoraria: 200, turmas: 45, professores: 9 },
  { id: 3, nome: 'Ciências', cargaHoraria: 120, turmas: 45, professores: 6 },
  { id: 4, nome: 'História', cargaHoraria: 80, turmas: 45, professores: 4 },
  { id: 5, nome: 'Geografia', cargaHoraria: 80, turmas: 45, professores: 4 }
]

export default function CurriculoPage() {
  const { user } = useAdminAuth()
  const [filtro, setFiltro] = useState('')

  const totalDisciplinas = 45
  const projetosPedagogicos = 12
  const avaliacoesMes = 156
  const taxaAprovacao = 94

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Currículo e Ensino</h1>
          <p className="text-muted-foreground">Gestão Curricular e Metodologias Pedagógicas</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nova Disciplina
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Disciplinas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalDisciplinas}</div>
            <p className="text-xs text-muted-foreground">Na grade curricular</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Projetos Pedagógicos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{projetosPedagogicos}</div>
            <p className="text-xs text-muted-foreground">Ativos este ano</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Avaliações Mês</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avaliacoesMes}</div>
            <p className="text-xs text-muted-foreground">Aplicadas</p>
          </CardContent>
        </Card>

        <Card className="border-green-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Taxa Aprovação</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{taxaAprovacao}%</div>
            <p className="text-xs text-muted-foreground">Ano letivo 2024</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Disciplinas por Série</CardTitle>
            <CardDescription>Grade curricular municipal</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 mb-4">
              <div className="flex-1">
                <Input
                  placeholder="Buscar disciplina..."
                  value={filtro}
                  onChange={(e) => setFiltro(e.target.value)}
                />
              </div>
              <Button variant="outline">
                <Search className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-3">
              {disciplinas.map((disc) => (
                <div key={disc.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <BookOpen className="h-5 w-5 text-purple-600" />
                    <div>
                      <p className="font-medium text-sm">{disc.nome}</p>
                      <p className="text-xs text-muted-foreground">
                        {disc.cargaHoraria}h anuais • {disc.turmas} turmas
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline">{disc.professores} prof.</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Projetos Pedagógicos</CardTitle>
            <CardDescription>Iniciativas educacionais em andamento</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 border border-blue-200 rounded-lg bg-blue-50">
                <Target className="h-5 w-5 text-blue-600" />
                <div className="flex-1">
                  <p className="font-medium text-sm">Alfabetização Acelerada</p>
                  <p className="text-xs text-muted-foreground">450 alunos • 1º ao 3º ano</p>
                </div>
                <Badge variant="outline" className="text-blue-600">Ativo</Badge>
              </div>

              <div className="flex items-center gap-3 p-3 border border-green-200 rounded-lg bg-green-50">
                <Award className="h-5 w-5 text-green-600" />
                <div className="flex-1">
                  <p className="font-medium text-sm">Matemática na Prática</p>
                  <p className="text-xs text-muted-foreground">890 alunos • 4º ao 9º ano</p>
                </div>
                <Badge variant="outline" className="text-green-600">Ativo</Badge>
              </div>

              <div className="flex items-center gap-3 p-3 border rounded-lg">
                <Users className="h-5 w-5 text-purple-600" />
                <div className="flex-1">
                  <p className="font-medium text-sm">Leitura Compartilhada</p>
                  <p className="text-xs text-muted-foreground">1.200 alunos • Todas séries</p>
                </div>
                <Badge variant="outline" className="text-purple-600">Ativo</Badge>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t">
              <Button variant="outline" className="w-full">
                Ver Todos os Projetos
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Base Nacional Comum Curricular (BNCC)</CardTitle>
          <CardDescription>Alinhamento com competências e habilidades</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Língua Portuguesa</span>
                <Badge variant="outline" className="text-green-600">98%</Badge>
              </div>
              <p className="text-xs text-muted-foreground">Competências atendidas</p>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Matemática</span>
                <Badge variant="outline" className="text-green-600">95%</Badge>
              </div>
              <p className="text-xs text-muted-foreground">Competências atendidas</p>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Ciências Naturais</span>
                <Badge variant="outline" className="text-orange-600">87%</Badge>
              </div>
              <p className="text-xs text-muted-foreground">Competências atendidas</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
