'use client'

import { useAdminAuth } from '@/contexts/AdminAuthContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Award,
  TrendingUp,
  Target,
  BarChart3,
  PieChart,
  Plus,
  Search,
  Download
} from 'lucide-react'
import { useState } from 'react'

export default function AvaliacaoPage() {
  const { user } = useAdminAuth()
  const [filtro, setFiltro] = useState('')

  const ideb2023 = 6.2
  const metaIdeb = 6.5
  const taxaAprovacao = 94
  const taxaEvasao = 2.1

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Avaliação e Desempenho</h1>
          <p className="text-muted-foreground">Indicadores Educacionais e IDEB</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Relatório
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nova Avaliação
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-blue-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">IDEB 2023</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{ideb2023}</div>
            <p className="text-xs text-muted-foreground">Meta: {metaIdeb}</p>
          </CardContent>
        </Card>

        <Card className="border-green-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Taxa Aprovação</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{taxaAprovacao}%</div>
            <p className="text-xs text-muted-foreground">+2% vs ano anterior</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Taxa Evasão</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{taxaEvasao}%</div>
            <p className="text-xs text-muted-foreground">-0.5% vs ano anterior</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Distorção Idade-Série</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12.5%</div>
            <p className="text-xs text-muted-foreground">564 alunos</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>IDEB por Escola</CardTitle>
            <CardDescription>Índice de Desenvolvimento da Educação Básica</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border border-green-200 rounded-lg bg-green-50">
                <div>
                  <p className="font-medium text-sm">E.M. Presidente Kennedy</p>
                  <p className="text-xs text-muted-foreground">Anos Iniciais</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-600">7.2</div>
                  <Badge variant="outline" className="text-green-600">Acima da meta</Badge>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 border border-blue-200 rounded-lg bg-blue-50">
                <div>
                  <p className="font-medium text-sm">E.M. Santos Dumont</p>
                  <p className="text-xs text-muted-foreground">Anos Finais</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-600">6.5</div>
                  <Badge variant="outline" className="text-blue-600">Na meta</Badge>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 border border-orange-200 rounded-lg bg-orange-50">
                <div>
                  <p className="font-medium text-sm">E.M. Rural São José</p>
                  <p className="text-xs text-muted-foreground">Anos Iniciais</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-orange-600">5.8</div>
                  <Badge variant="outline" className="text-orange-600">Abaixo da meta</Badge>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t">
              <Button variant="outline" className="w-full">
                Ver Todas as Escolas
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Avaliações Externas</CardTitle>
            <CardDescription>Resultados de avaliações nacionais</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-blue-600" />
                    <span className="font-medium">Prova Brasil</span>
                  </div>
                  <Badge variant="outline">2023</Badge>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Português</p>
                    <p className="text-lg font-bold">265 pts</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Matemática</p>
                    <p className="text-lg font-bold">278 pts</p>
                  </div>
                </div>
              </div>

              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-green-600" />
                    <span className="font-medium">SAEB</span>
                  </div>
                  <Badge variant="outline">2023</Badge>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground">5º Ano</p>
                    <p className="text-lg font-bold">6.8</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">9º Ano</p>
                    <p className="text-lg font-bold">5.9</p>
                  </div>
                </div>
              </div>

              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <PieChart className="h-5 w-5 text-purple-600" />
                    <span className="font-medium">Avaliações Municipais</span>
                  </div>
                  <Badge variant="outline">Trimestral</Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  Última aplicação: 156 avaliações em 18 escolas
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Metas Educacionais 2024</CardTitle>
          <CardDescription>Objetivos estratégicos da secretaria</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                <span className="font-medium">IDEB 6.5</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '95%' }}></div>
              </div>
              <p className="text-xs text-muted-foreground">95% da meta alcançada</p>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <Award className="h-5 w-5 text-green-600" />
                <span className="font-medium">96% Aprovação</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: '98%' }}></div>
              </div>
              <p className="text-xs text-muted-foreground">98% da meta alcançada</p>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <Target className="h-5 w-5 text-orange-600" />
                <span className="font-medium">&lt; 1.5% Evasão</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                <div className="bg-orange-600 h-2 rounded-full" style={{ width: '71%' }}></div>
              </div>
              <p className="text-xs text-muted-foreground">71% da meta alcançada</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
