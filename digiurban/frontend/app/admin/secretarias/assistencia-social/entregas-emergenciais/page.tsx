'use client'

import { useState } from 'react'
import { useAdminAuth } from '@/contexts/AdminAuthContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import {
  Package,
  Plus,
  Search,
  Filter,
  Download,
  Truck,
  Clock,
  MapPin,
  Users,
  AlertTriangle,
  CheckCircle,
  Calendar,
  Phone,
  User,
  Heart,
  Zap
} from 'lucide-react'

interface EntregaEmergencial {
  id: string
  protocolo: string
  tipoEntrega: 'Cesta Básica' | 'Kit Higiene' | 'Medicamentos' | 'Fraldas' | 'Kit Bebê' | 'Cobertores' | 'Água' | 'Outros'
  beneficiario: {
    nome: string
    cpf: string
    telefone: string
    endereco: string
    bairro: string
    vulnerabilidade: string
  }
  solicitante: {
    nome: string
    vinculo: string
    telefone: string
  }
  urgencia: 'Baixa' | 'Média' | 'Alta' | 'Crítica'
  status: 'Solicitada' | 'Aprovada' | 'Em Preparação' | 'Em Transporte' | 'Entregue' | 'Cancelada'
  motivoSolicitacao: string
  itensEntrega: Array<{
    item: string
    quantidade: number
    observacao?: string
  }>
  datasolicitacao: string
  dataEntrega?: string
  responsavelEntrega?: string
  observacoes?: string
  comprovante?: string
}

const mockEntregas: EntregaEmergencial[] = [
  {
    id: '1',
    protocolo: 'EE-2024-001',
    tipoEntrega: 'Cesta Básica',
    beneficiario: {
      nome: 'Maria Silva Santos',
      cpf: '123.456.789-00',
      telefone: '(11) 98765-4321',
      endereco: 'Rua das Flores, 123',
      bairro: 'Centro',
      vulnerabilidade: 'Desemprego recente'
    },
    solicitante: {
      nome: 'João Santos',
      vinculo: 'Filho',
      telefone: '(11) 98765-4322'
    },
    urgencia: 'Alta',
    status: 'Em Transporte',
    motivoSolicitacao: 'Família em situação de insegurança alimentar após perda de emprego',
    itensEntrega: [
      { item: 'Arroz 5kg', quantidade: 2 },
      { item: 'Feijão 1kg', quantidade: 3 },
      { item: 'Óleo de Soja 900ml', quantidade: 2 },
      { item: 'Açúcar 1kg', quantidade: 1 }
    ],
    datasolicitacao: '2024-01-15',
    dataEntrega: '2024-01-16',
    responsavelEntrega: 'Carlos Delivery',
    observacoes: 'Endereço de difícil acesso'
  },
  {
    id: '2',
    protocolo: 'EE-2024-002',
    tipoEntrega: 'Kit Higiene',
    beneficiario: {
      nome: 'Ana Costa Lima',
      cpf: '987.654.321-00',
      telefone: '(11) 91234-5678',
      endereco: 'Av. Principal, 456',
      bairro: 'Vila Nova',
      vulnerabilidade: 'Situação de rua'
    },
    solicitante: {
      nome: 'Centro Pop',
      vinculo: 'Equipamento Social',
      telefone: '(11) 3456-7890'
    },
    urgencia: 'Crítica',
    status: 'Entregue',
    motivoSolicitacao: 'Pessoa em situação de rua necessita itens básicos de higiene',
    itensEntrega: [
      { item: 'Sabonete', quantidade: 5 },
      { item: 'Shampoo', quantidade: 2 },
      { item: 'Pasta de dente', quantidade: 3 },
      { item: 'Escova de dente', quantidade: 3 }
    ],
    datasolicitacao: '2024-01-14',
    dataEntrega: '2024-01-14',
    responsavelEntrega: 'Equipe Centro Pop',
    comprovante: 'Assinado em campo'
  }
]

export default function EntregasEmergenciaisPage() {
  const { user } = useAdminAuth()
  const [entregas, setEntregas] = useState<EntregaEmergencial[]>(mockEntregas)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [urgenciaFilter, setUrgenciaFilter] = useState<string>('all')
  const [showNewEntregaModal, setShowNewEntregaModal] = useState(false)

  const filteredEntregas = entregas.filter(entrega => {
    const matchesSearch = entrega.beneficiario.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entrega.protocolo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entrega.tipoEntrega.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || entrega.status === statusFilter
    const matchesUrgencia = urgenciaFilter === 'all' || entrega.urgencia === urgenciaFilter
    return matchesSearch && matchesStatus && matchesUrgencia
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Solicitada': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'Aprovada': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'Em Preparação': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'Em Transporte': return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'Entregue': return 'bg-green-100 text-green-800 border-green-200'
      case 'Cancelada': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getUrgenciaColor = (urgencia: string) => {
    switch (urgencia) {
      case 'Baixa': return 'bg-green-100 text-green-800 border-green-200'
      case 'Média': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'Alta': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'Crítica': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const stats = {
    totalEntregas: entregas.length,
    entreguesHoje: entregas.filter(e => e.dataEntrega === '2024-01-16').length,
    pendentes: entregas.filter(e => ['Solicitada', 'Aprovada', 'Em Preparação', 'Em Transporte'].includes(e.status)).length,
    criticas: entregas.filter(e => e.urgencia === 'Crítica').length
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Package className="h-8 w-8 text-blue-600" />
            Entregas Emergenciais
          </h1>
          <p className="text-gray-600 mt-1">
            Gestão de entregas emergenciais de alimentos, medicamentos e itens básicos
          </p>
        </div>
        <Button onClick={() => setShowNewEntregaModal(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Nova Entrega
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Entregas</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalEntregas}</div>
            <p className="text-xs text-muted-foreground">este mês</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Entregues Hoje</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.entreguesHoje}</div>
            <p className="text-xs text-muted-foreground">até o momento</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.pendentes}</div>
            <p className="text-xs text-muted-foreground">em andamento</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Críticas</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.criticas}</div>
            <p className="text-xs text-muted-foreground">urgência crítica</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filtros e Busca</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por beneficiário, protocolo ou tipo..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Status</SelectItem>
                <SelectItem value="Solicitada">Solicitada</SelectItem>
                <SelectItem value="Aprovada">Aprovada</SelectItem>
                <SelectItem value="Em Preparação">Em Preparação</SelectItem>
                <SelectItem value="Em Transporte">Em Transporte</SelectItem>
                <SelectItem value="Entregue">Entregue</SelectItem>
                <SelectItem value="Cancelada">Cancelada</SelectItem>
              </SelectContent>
            </Select>
            <Select value={urgenciaFilter} onValueChange={setUrgenciaFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Urgência" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as Urgências</SelectItem>
                <SelectItem value="Baixa">Baixa</SelectItem>
                <SelectItem value="Média">Média</SelectItem>
                <SelectItem value="Alta">Alta</SelectItem>
                <SelectItem value="Crítica">Crítica</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6">
        {filteredEntregas.map((entrega) => (
          <Card key={entrega.id} className="overflow-hidden">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{entrega.protocolo}</CardTitle>
                  <CardDescription className="flex items-center gap-2 mt-1">
                    <User className="h-4 w-4" />
                    {entrega.beneficiario.nome}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Badge className={getUrgenciaColor(entrega.urgencia)}>
                    {entrega.urgencia}
                  </Badge>
                  <Badge className={getStatusColor(entrega.status)}>
                    {entrega.status}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-sm text-gray-900 mb-2 flex items-center gap-2">
                      <Heart className="h-4 w-4" />
                      Beneficiário
                    </h4>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p><strong>Nome:</strong> {entrega.beneficiario.nome}</p>
                      <p><strong>CPF:</strong> {entrega.beneficiario.cpf}</p>
                      <p><strong>Telefone:</strong> {entrega.beneficiario.telefone}</p>
                      <p><strong>Endereço:</strong> {entrega.beneficiario.endereco}</p>
                      <p><strong>Bairro:</strong> {entrega.beneficiario.bairro}</p>
                      <p><strong>Vulnerabilidade:</strong> {entrega.beneficiario.vulnerabilidade}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-sm text-gray-900 mb-2 flex items-center gap-2">
                      <Package className="h-4 w-4" />
                      Detalhes da Entrega
                    </h4>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p><strong>Tipo:</strong> {entrega.tipoEntrega}</p>
                      <p><strong>Solicitado em:</strong> {new Date(entrega.datasolicitacao).toLocaleDateString('pt-BR')}</p>
                      {entrega.dataEntrega && (
                        <p><strong>Entregue em:</strong> {new Date(entrega.dataEntrega).toLocaleDateString('pt-BR')}</p>
                      )}
                      {entrega.responsavelEntrega && (
                        <p><strong>Responsável:</strong> {entrega.responsavelEntrega}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-sm text-gray-900 mb-2 flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      Solicitante
                    </h4>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p><strong>Nome:</strong> {entrega.solicitante.nome}</p>
                      <p><strong>Vínculo:</strong> {entrega.solicitante.vinculo}</p>
                      <p><strong>Telefone:</strong> {entrega.solicitante.telefone}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-sm text-gray-900 mb-2">
                      Itens da Entrega
                    </h4>
                    <div className="space-y-1 text-sm text-gray-600">
                      {entrega.itensEntrega.map((item, index) => (
                        <p key={index}>
                          <strong>{item.quantidade}x</strong> {item.item}
                          {item.observacao && <span className="text-gray-500"> - {item.observacao}</span>}
                        </p>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-sm text-gray-900 mb-2">
                      Motivo da Solicitação
                    </h4>
                    <p className="text-sm text-gray-600">{entrega.motivoSolicitacao}</p>
                  </div>

                  {entrega.observacoes && (
                    <div>
                      <h4 className="font-medium text-sm text-gray-900 mb-2">
                        Observações
                      </h4>
                      <p className="text-sm text-gray-600">{entrega.observacoes}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-4 pt-4 border-t">
                <Button variant="outline" size="sm">
                  <MapPin className="h-4 w-4 mr-1" />
                  Ver Rota
                </Button>
                <Button variant="outline" size="sm">
                  <Phone className="h-4 w-4 mr-1" />
                  Contatar
                </Button>
                {entrega.status !== 'Entregue' && entrega.status !== 'Cancelada' && (
                  <Button size="sm">
                    <Truck className="h-4 w-4 mr-1" />
                    Atualizar Status
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-blue-600" />
            Serviços Gerados Automaticamente
          </CardTitle>
          <CardDescription>
            Esta página gera automaticamente os seguintes serviços para o catálogo público:
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium text-green-700 mb-2">Solicitação de Entrega Emergencial</h4>
              <p className="text-sm text-gray-600">
                Permite que cidadãos solicitem entregas emergenciais de alimentos, medicamentos ou itens básicos em situações de vulnerabilidade.
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium text-green-700 mb-2">Doação de Alimentos</h4>
              <p className="text-sm text-gray-600">
                Possibilita que estabelecimentos e cidadãos façam doações de alimentos para entregas emergenciais.
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium text-green-700 mb-2">Acompanhar Status da Entrega</h4>
              <p className="text-sm text-gray-600">
                Permite acompanhar o status de uma entrega emergencial solicitada através do protocolo.
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium text-green-700 mb-2">Voluntariado em Entregas</h4>
              <p className="text-sm text-gray-600">
                Cadastro de voluntários para auxiliar nas entregas emergenciais da assistência social.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}