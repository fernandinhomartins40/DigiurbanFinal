'use client'
// @ts-nocheck

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
  CheckCircle,
  Clock,
  FileText,
  Search,
  Filter,
  Plus,
  Truck,
  ShieldAlert,
  Calendar
} from 'lucide-react'
import { useState } from 'react'

const medicamentosEstoque = [
  {
    id: 1,
    nome: 'Paracetamol 500mg',
    lote: 'PAR001',
    quantidade: 1500,
    minimo: 100,
    validade: '2024-12-15',
    status: 'disponivel',
    categoria: 'analgesico'
  },
  {
    id: 2,
    nome: 'Dipirona 500mg',
    lote: 'DIP002',
    quantidade: 45,
    minimo: 100,
    validade: '2024-10-20',
    status: 'baixo',
    categoria: 'analgesico'
  },
  {
    id: 3,
    nome: 'Insulina NPH',
    lote: 'INS003',
    quantidade: 0,
    minimo: 20,
    validade: '2024-08-30',
    status: 'falta',
    categoria: 'diabetes'
  },
  {
    id: 4,
    nome: 'Captopril 25mg',
    lote: 'CAP004',
    quantidade: 200,
    minimo: 50,
    validade: '2025-03-10',
    status: 'disponivel',
    categoria: 'cardiovascular'
  }
]

const dispensacoes = [
  {
    id: 1,
    protocolo: 'MED-2024-0001',
    paciente: 'Maria Santos',
    medicamento: 'Paracetamol 500mg',
    quantidade: 20,
    medico: 'Dr. João Silva',
    data: '2024-01-20',
    status: 'dispensado'
  },
  {
    id: 2,
    protocolo: 'MED-2024-0002',
    paciente: 'Carlos Lima',
    medicamento: 'Captopril 25mg',
    quantidade: 30,
    medico: 'Dra. Ana Costa',
    data: '2024-01-20',
    status: 'pendente'
  }
]

const servicosGerados = [
  'Solicitação de Medicamento',
  'Renovação de Receita',
  'Medicamento de Alto Custo',
  'Programa de Medicamentos',
  'Consulta de Disponibilidade',
  'Agendamento para Retirada',
  'Histórico de Medicamentos'
]

export default function MedicamentosPage() {
  const { user } = useAdminAuth()
  const [novaDispensacao, setNovaDispensacao] = useState({
    paciente: '',
    medicamento: '',
    quantidade: '',
    receita: ''
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'disponivel':
        return <Badge className="bg-green-500 text-white">Disponível</Badge>
      case 'baixo':
        return <Badge className="bg-yellow-500 text-white">Estoque Baixo</Badge>
      case 'falta':
        return <Badge variant="destructive">Em Falta</Badge>
      case 'vencido':
        return <Badge className="bg-red-600 text-white">Vencido</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getDispensacaoStatusBadge = (status: string) => {
    switch (status) {
      case 'dispensado':
        return <Badge className="bg-green-500 text-white">Dispensado</Badge>
      case 'pendente':
        return <Badge className="bg-yellow-500 text-white">Pendente</Badge>
      case 'cancelado':
        return <Badge variant="destructive">Cancelado</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const isVencendo = (validade: string) => {
    const hoje = new Date()
    const dataValidade = new Date(validade)
    const diasParaVencer = Math.ceil((dataValidade.getTime() - hoje.getTime()) / (1000 * 3600 * 24))
    return diasParaVencer <= 30
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Pill className="h-8 w-8 text-blue-600 mr-3" />
            Controle de Medicamentos
          </h1>
          <p className="text-gray-600 mt-1">
            Sistema de farmácia básica, estoque e dispensação
          </p>
        </div>
        <Badge variant="outline" className="text-blue-600 border-blue-200">
          Farmácia Municipal
        </Badge>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Medicamentos Cadastrados</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-muted-foreground">
              +12 este mês
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Estoque Baixo</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">8</div>
            <p className="text-xs text-muted-foreground">
              Requer reposição
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vencendo em 30 dias</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">3</div>
            <p className="text-xs text-muted-foreground">
              Verificar validade
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Dispensações Hoje</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">47</div>
            <p className="text-xs text-muted-foreground">
              +5 vs ontem
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Nova Dispensação */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Plus className="h-5 w-5 mr-2" />
              Nova Dispensação
            </CardTitle>
            <CardDescription>
              Dispensar medicamento com receita
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="paciente">Nome do Paciente</Label>
              <Input
                id="paciente"
                placeholder="Digite o nome ou CPF"
                value={novaDispensacao.paciente}
                onChange={(e) => setNovaDispensacao(prev => ({ ...prev, paciente: e.target.value }))}
              />
            </div>

            <div>
              <Label htmlFor="medicamento">Medicamento</Label>
              <Select value={novaDispensacao.medicamento} onValueChange={(value) => setNovaDispensacao(prev => ({ ...prev, medicamento: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o medicamento" />
                </SelectTrigger>
                <SelectContent>
                  {medicamentosEstoque.filter(med => med.status === 'disponivel').map((med) => (
                    <SelectItem key={med.id} value={med.nome}>
                      {med.nome} - Estoque: {med.quantidade}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="quantidade">Quantidade</Label>
              <Input
                id="quantidade"
                type="number"
                placeholder="Ex: 30 comprimidos"
                value={novaDispensacao.quantidade}
                onChange={(e) => setNovaDispensacao(prev => ({ ...prev, quantidade: e.target.value }))}
              />
            </div>

            <div>
              <Label htmlFor="receita">Observações da Receita</Label>
              <Textarea
                id="receita"
                placeholder="Posologia e observações médicas"
                value={novaDispensacao.receita}
                onChange={(e) => setNovaDispensacao(prev => ({ ...prev, receita: e.target.value }))}
                rows={3}
              />
            </div>

            <Button className="w-full">
              <Pill className="h-4 w-4 mr-2" />
              Dispensar Medicamento
            </Button>
          </CardContent>
        </Card>

        {/* Estoque de Medicamentos */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Estoque de Medicamentos</CardTitle>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Search className="h-4 w-4 mr-2" />
                  Buscar
                </Button>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filtrar
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {medicamentosEstoque.map((medicamento) => (
                <div key={medicamento.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-semibold">{medicamento.nome}</h4>
                      <p className="text-sm text-gray-600">Lote: {medicamento.lote}</p>
                    </div>
                    <div className="flex space-x-2">
                      {getStatusBadge(medicamento.status)}
                      {isVencendo(medicamento.validade) && (
                        <Badge variant="destructive">
                          <Calendar className="h-3 w-3 mr-1" />
                          Vencendo
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Quantidade:</span>
                      <p className="font-medium">{medicamento.quantidade} unidades</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Mínimo:</span>
                      <p className="font-medium">{medicamento.minimo} unidades</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Validade:</span>
                      <p className="font-medium">{medicamento.validade}</p>
                    </div>
                  </div>
                  <div className="flex space-x-2 mt-3">
                    <Button size="sm" variant="outline">
                      <Truck className="h-4 w-4 mr-2" />
                      Solicitar Reposição
                    </Button>
                    <Button size="sm" variant="outline">
                      <FileText className="h-4 w-4 mr-2" />
                      Histórico
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Dispensações Recentes */}
      <Card>
        <CardHeader>
          <CardTitle>Dispensações Recentes</CardTitle>
          <CardDescription>
            Histórico de medicamentos dispensados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {transactions.length === 0 ? (
              <div className="text-center py-8">
                <Pill className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Nenhuma dispensação registrada</p>
              </div>
            ) : (
              transactions.slice(0, 10).map((transaction) => (
                <div key={transaction.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="font-semibold">{transaction.patient?.name || 'Paciente'}</h4>
                      <p className="text-sm text-gray-600">Protocolo: {transaction.id}</p>
                    </div>
                    {getDispensacaoStatusBadge(transaction.status)}
                  </div>
                  <div className="grid grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Medicamento:</span>
                      <p className="font-medium">{transaction.medication_name}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Quantidade:</span>
                      <p className="font-medium">{transaction.quantity} unidades</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Observações:</span>
                      <p className="font-medium">{transaction.prescription_notes || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Data:</span>
                      <p className="font-medium">
                        {new Date(transaction.transaction_date).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Alertas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-orange-600">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Estoque Baixo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {medicamentosEstoque.filter(med => med.status === 'baixo' || med.status === 'falta').map((med) => (
                <div key={med.id} className="flex items-center justify-between p-2 border rounded">
                  <span className="text-sm">{med.nome}</span>
                  <Badge variant="outline">{med.quantidade} restantes</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-red-600">
              <ShieldAlert className="h-5 w-5 mr-2" />
              Vencimentos Próximos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {medicamentosEstoque.filter(med => isVencendo(med.validade)).map((med) => (
                <div key={med.id} className="flex items-center justify-between p-2 border rounded">
                  <span className="text-sm">{med.nome}</span>
                  <Badge variant="outline">{med.validade}</Badge>
                </div>
              ))}
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
                <Pill className="h-4 w-4 text-blue-600 mr-3" />
                <span className="text-sm">{servico}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}