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
  UtensilsCrossed,
  Apple,
  Calculator,
  Users,
  Clock,
  AlertCircle,
  CheckCircle,
  Heart,
  Leaf,
  Target,
  Calendar,
  FileText,
  Plus,
  Search,
  Filter,
  Download,
  Package,
  TrendingUp
} from 'lucide-react'
import { useState } from 'react'

const cardapioSemanal = [
  {
    dia: 'Segunda-feira',
    refeicoes: [
      {
        tipo: 'Café da Manhã',
        menu: 'Pão com margarina, leite com achocolatado, banana',
        calorias: 320,
        proteinas: 12,
        carboidratos: 45
      },
      {
        tipo: 'Almoço',
        menu: 'Arroz, feijão, frango grelhado, salada de alface e tomate',
        calorias: 485,
        proteinas: 28,
        carboidratos: 52
      },
      {
        tipo: 'Lanche',
        menu: 'Suco de frutas, biscoito integral',
        calorias: 180,
        proteinas: 4,
        carboidratos: 35
      }
    ]
  },
  {
    dia: 'Terça-feira',
    refeicoes: [
      {
        tipo: 'Café da Manhã',
        menu: 'Mingau de aveia, pão integral, suco de laranja',
        calorias: 295,
        proteinas: 10,
        carboidratos: 48
      },
      {
        tipo: 'Almoço',
        menu: 'Macarrão com molho, carne moída, salada de cenoura',
        calorias: 510,
        proteinas: 25,
        carboidratos: 58
      },
      {
        tipo: 'Lanche',
        menu: 'Vitamina de banana, torrada',
        calorias: 165,
        proteinas: 6,
        carboidratos: 28
      }
    ]
  }
]

const dietasEspeciais = [
  {
    id: 1,
    nomeAluno: 'João Silva Santos',
    escola: 'EMEF João da Silva',
    serie: '5º Ano',
    tipoRestricao: 'Diabético',
    alimentos: ['Açúcar', 'Doces', 'Refrigerantes'],
    cardapioEspecial: 'Alimentos sem açúcar, frutas com moderação',
    medico: 'Dr. Carlos Lima',
    dataInicio: '2024-01-15',
    observacoes: 'Controle rigoroso de carboidratos'
  },
  {
    id: 2,
    nomeAluno: 'Ana Costa Lima',
    escola: 'EMEI Maria Montessori',
    serie: 'Pré II',
    tipoRestricao: 'Alergia Alimentar',
    alimentos: ['Leite', 'Derivados do leite', 'Chocolate'],
    cardapioEspecial: 'Substitutos vegetais, leite de soja',
    medico: 'Dra. Maria Santos',
    dataInicio: '2024-01-10',
    observacoes: 'Intolerância à lactose severa'
  },
  {
    id: 3,
    nomeAluno: 'Pedro Oliveira',
    escola: 'EMEF Paulo Freire',
    serie: '3º Ano',
    tipoRestricao: 'Celíaco',
    alimentos: ['Trigo', 'Cevada', 'Centeio', 'Aveia'],
    cardapioEspecial: 'Alimentos sem glúten, pães especiais',
    medico: 'Dr. João Costa',
    dataInicio: '2024-01-08',
    observacoes: 'Doença celíaca confirmada por biópsia'
  }
]

const estoqueAlimentos = [
  {
    id: 1,
    produto: 'Arroz Tipo 1',
    categoria: 'Cereais',
    quantidade: 500,
    unidade: 'kg',
    validade: '2024-08-15',
    fornecedor: 'Cooperativa Agrícola',
    status: 'adequado'
  },
  {
    id: 2,
    produto: 'Feijão Carioca',
    categoria: 'Leguminosas',
    quantidade: 200,
    unidade: 'kg',
    validade: '2024-06-20',
    fornecedor: 'Fazenda Boa Vista',
    status: 'adequado'
  },
  {
    id: 3,
    produto: 'Leite Integral',
    categoria: 'Laticínios',
    quantidade: 15,
    unidade: 'litros',
    validade: '2024-01-28',
    fornecedor: 'Laticínios São José',
    status: 'critico'
  },
  {
    id: 4,
    produto: 'Óleo de Soja',
    categoria: 'Óleos',
    quantidade: 45,
    unidade: 'litros',
    validade: '2024-04-10',
    fornecador: 'Distribuidora Regional',
    status: 'baixo'
  }
]

const servicosGerados = [
  'Cardápio Especial',
  'Dieta Restritiva',
  'Informações Nutricionais',
  'Solicitação de Lanche Especial',
  'Cardápio da Semana',
  'Relatório Nutricional',
  'Acompanhamento Dietético'
]

export default function MerendaEscolarPage() {
  const { user } = useAdminAuth()
  const [novaDieta, setNovaDieta] = useState({
    nomeAluno: '',
    escola: '',
    serie: '',
    tipoRestricao: '',
    alimentos: '',
    medico: '',
    observacoes: ''
  })

  const getStatusEstoqueBadge = (status: string) => {
    switch (status) {
      case 'adequado':
        return <Badge className="bg-green-500 text-white">Adequado</Badge>
      case 'baixo':
        return <Badge className="bg-yellow-500 text-white">Baixo</Badge>
      case 'critico':
        return <Badge variant="destructive">Crítico</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getTipoRestricaoBadge = (tipo: string) => {
    switch (tipo) {
      case 'Diabético':
        return <Badge className="bg-red-500 text-white">Diabético</Badge>
      case 'Alergia Alimentar':
        return <Badge className="bg-orange-500 text-white">Alergia</Badge>
      case 'Celíaco':
        return <Badge className="bg-purple-500 text-white">Celíaco</Badge>
      case 'Intolerância':
        return <Badge className="bg-blue-500 text-white">Intolerância</Badge>
      default:
        return <Badge variant="outline">{tipo}</Badge>
    }
  }

  const calcularTotalCalorias = (refeicoes: any[]) => {
    return refeicoes.reduce((total, refeicao) => total + refeicao.calorias, 0)
  }

  const calcularTotalProteinas = (refeicoes: any[]) => {
    return refeicoes.reduce((total, refeicao) => total + refeicao.proteinas, 0)
  }

  const getValidadeColor = (validade: string) => {
    const hoje = new Date()
    const dataValidade = new Date(validade)
    const diasRestantes = Math.ceil((dataValidade.getTime() - hoje.getTime()) / (1000 * 3600 * 24))

    if (diasRestantes <= 7) return 'text-red-600'
    if (diasRestantes <= 30) return 'text-yellow-600'
    return 'text-green-600'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <UtensilsCrossed className="h-8 w-8 text-blue-600 mr-3" />
            Merenda Escolar
          </h1>
          <p className="text-gray-600 mt-1">
            Gestão nutricional, cardápios, informações nutricionais e dietas especiais
          </p>
        </div>
        <Badge variant="outline" className="text-blue-600 border-blue-200">
          Alimentação Escolar
        </Badge>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Refeições/Dia</CardTitle>
            <UtensilsCrossed className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.370</div>
            <p className="text-xs text-muted-foreground">
              Todas as escolas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Dietas Especiais</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <p className="text-xs text-muted-foreground">
              Estudantes atendidos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Nutricional</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">98%</div>
            <p className="text-xs text-muted-foreground">
              Meta nutricional
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Estoque Crítico</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">3</div>
            <p className="text-xs text-muted-foreground">
              Itens para repor
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Nova Dieta Especial */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Plus className="h-5 w-5 mr-2" />
              Nova Dieta Especial
            </CardTitle>
            <CardDescription>
              Cadastrar restrição alimentar
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="nomeAluno">Nome do Aluno</Label>
              <Input
                id="nomeAluno"
                placeholder="Nome completo do aluno"
                value={novaDieta.nomeAluno}
                onChange={(e) => setNovaDieta(prev => ({ ...prev, nomeAluno: e.target.value }))}
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="escola">Escola</Label>
                <Select value={novaDieta.escola} onValueChange={(value) => setNovaDieta(prev => ({ ...prev, escola: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="emef-joao">EMEF João da Silva</SelectItem>
                    <SelectItem value="emei-maria">EMEI Maria Montessori</SelectItem>
                    <SelectItem value="emef-paulo">EMEF Paulo Freire</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="serie">Série</Label>
                <Select value={novaDieta.serie} onValueChange={(value) => setNovaDieta(prev => ({ ...prev, serie: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1ano">1º Ano</SelectItem>
                    <SelectItem value="2ano">2º Ano</SelectItem>
                    <SelectItem value="3ano">3º Ano</SelectItem>
                    <SelectItem value="4ano">4º Ano</SelectItem>
                    <SelectItem value="5ano">5º Ano</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="tipoRestricao">Tipo de Restrição</Label>
              <Select value={novaDieta.tipoRestricao} onValueChange={(value) => setNovaDieta(prev => ({ ...prev, tipoRestricao: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="diabetico">Diabético</SelectItem>
                  <SelectItem value="alergia">Alergia Alimentar</SelectItem>
                  <SelectItem value="celiaco">Celíaco</SelectItem>
                  <SelectItem value="intolerancia">Intolerância</SelectItem>
                  <SelectItem value="outro">Outro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="alimentos">Alimentos Restritos</Label>
              <Input
                id="alimentos"
                placeholder="Ex: Leite, Derivados, Chocolate"
                value={novaDieta.alimentos}
                onChange={(e) => setNovaDieta(prev => ({ ...prev, alimentos: e.target.value }))}
              />
            </div>

            <div>
              <Label htmlFor="medico">Médico Responsável</Label>
              <Input
                id="medico"
                placeholder="Nome do médico"
                value={novaDieta.medico}
                onChange={(e) => setNovaDieta(prev => ({ ...prev, medico: e.target.value }))}
              />
            </div>

            <div>
              <Label htmlFor="observacoes">Observações</Label>
              <Textarea
                id="observacoes"
                placeholder="Informações adicionais sobre a dieta"
                value={novaDieta.observacoes}
                onChange={(e) => setNovaDieta(prev => ({ ...prev, observacoes: e.target.value }))}
                rows={3}
              />
            </div>

            <Button className="w-full">
              <Heart className="h-4 w-4 mr-2" />
              Cadastrar Dieta
            </Button>
          </CardContent>
        </Card>

        {/* Cardápio Semanal */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Cardápio da Semana</CardTitle>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Calendar className="h-4 w-4 mr-2" />
                  Semana
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Imprimir
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {cardapioSemanal.map((dia, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold">{dia.dia}</h4>
                    <div className="flex items-center space-x-2 text-sm">
                      <span className="text-gray-500">Total:</span>
                      <Badge variant="outline">
                        {calcularTotalCalorias(dia.refeicoes)} kcal
                      </Badge>
                      <Badge variant="outline">
                        {calcularTotalProteinas(dia.refeicoes)}g proteína
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {dia.refeicoes.map((refeicao, refeicaoIndex) => (
                      <div key={refeicaoIndex} className="bg-gray-50 rounded p-3">
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="font-medium text-sm">{refeicao.tipo}</h5>
                          <div className="flex items-center space-x-2 text-xs">
                            <span className="text-green-600">{refeicao.calorias} kcal</span>
                            <span className="text-blue-600">{refeicao.proteinas}g prot</span>
                            <span className="text-orange-600">{refeicao.carboidratos}g carb</span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600">{refeicao.menu}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Dietas Especiais */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Heart className="h-5 w-5 mr-2" />
              Dietas Especiais
            </CardTitle>
            <CardDescription>
              Estudantes com restrições alimentares
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dietasEspeciais.map((dieta) => (
                <div key={dieta.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="font-semibold">{dieta.nomeAluno}</h4>
                      <p className="text-sm text-gray-600">{dieta.serie} - {dieta.escola}</p>
                    </div>
                    {getTipoRestricaoBadge(dieta.tipoRestricao)}
                  </div>

                  <div className="text-sm mb-2">
                    <span className="text-gray-500">Alimentos restritos:</span>
                    <p className="font-medium text-red-600">{dieta.alimentos.join(', ')}</p>
                  </div>

                  <div className="text-sm mb-2">
                    <span className="text-gray-500">Cardápio especial:</span>
                    <p className="font-medium">{dieta.cardapioEspecial}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                    <div>
                      <span className="text-gray-500">Médico:</span>
                      <p className="font-medium">{dieta.medico}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Desde:</span>
                      <p className="font-medium">{dieta.dataInicio}</p>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 mb-3">{dieta.observacoes}</p>

                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">
                      <FileText className="h-4 w-4 mr-2" />
                      Cardápio
                    </Button>
                    <Button size="sm" variant="outline">
                      <Calculator className="h-4 w-4 mr-2" />
                      Nutricional
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Estoque de Alimentos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Package className="h-5 w-5 mr-2" />
              Estoque de Alimentos
            </CardTitle>
            <CardDescription>
              Controle de estoque e validades
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {estoqueAlimentos.map((item) => (
                <div key={item.id} className="border rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="font-semibold text-sm">{item.produto}</h4>
                      <p className="text-sm text-gray-600">{item.categoria}</p>
                    </div>
                    {getStatusEstoqueBadge(item.status)}
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm mb-2">
                    <div>
                      <span className="text-gray-500">Quantidade:</span>
                      <p className="font-medium">{item.quantidade} {item.unidade}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Validade:</span>
                      <p className={`font-medium ${getValidadeColor(item.validade)}`}>
                        {item.validade}
                      </p>
                    </div>
                  </div>

                  <p className="text-xs text-gray-600">{item.fornecedor}</p>
                </div>
              ))}
            </div>

            <div className="mt-4">
              <Button className="w-full" variant="outline">
                <TrendingUp className="h-4 w-4 mr-2" />
                Ver Relatório Completo
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Serviços Gerados Automaticamente */}
      <Card>
        <CardHeader>
          <CardTitle>Serviços Gerados Automaticamente</CardTitle>
          <CardDescription>
            Funcionalidades desta página que se tornam serviços no catálogo público
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {servicosGerados.map((servico, index) => (
              <div key={index} className="flex items-center p-3 border rounded-lg">
                <UtensilsCrossed className="h-4 w-4 text-blue-600 mr-3" />
                <span className="text-sm">{servico}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}