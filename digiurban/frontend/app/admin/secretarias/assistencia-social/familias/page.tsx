'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { AddVulnerabilityForm } from '@/components/admin/AddVulnerabilityForm'
import { useToast } from '@/hooks/use-toast'
import { useAdminAuth } from '@/contexts/AdminAuthContext'
import {
  Search,
  UserPlus,
  AlertTriangle,
  Users,
  DollarSign,
  Home,
  Calendar,
  Phone,
  Mail,
  MapPin,
  FileText,
  TrendingUp,
  TrendingDown,
  Activity,
} from 'lucide-react'

interface Citizen {
  id: string
  name: string
  cpf: string
  email?: string
  phone?: string
  address?: any
  vulnerableFamilyData?: {
    id: string
    riskLevel: string
    vulnerabilityType: string
    monthlyIncome?: number
    memberCount: number
  }
}

interface VulnerableFamily {
  id: string
  familyCode?: string
  memberCount: number
  monthlyIncome?: number
  riskLevel: string
  vulnerabilityType: string
  socialWorker?: string
  status: string
  observations?: string
  lastVisitDate?: string
  nextVisitDate?: string
  createdAt: string
  updatedAt: string
  citizen: {
    id: string
    name: string
    cpf: string
    email?: string
    phone?: string
    address?: any
    familyAsHead?: Array<{
      relationship: string
      isDependent: boolean
      member: {
        name: string
      }
    }>
  }
  benefitRequests?: any[]
  homeVisits?: any[]
}

export default function VulnerableFamiliesPage() {
  const { toast } = useToast()
  const { apiRequest } = useAdminAuth()
  const [searchCpf, setSearchCpf] = useState('')
  const [searching, setSearching] = useState(false)
  const [searchedCitizen, setSearchedCitizen] = useState<Citizen | null>(null)
  const [showSearchDialog, setShowSearchDialog] = useState(false)
  const [showAddForm, setShowAddForm] = useState(false)

  // Lista de famílias vulneráveis
  const [families, setFamilies] = useState<VulnerableFamily[]>([])
  const [loadingFamilies, setLoadingFamilies] = useState(true)
  const [filterRisk, setFilterRisk] = useState<string>('ALL')

  useEffect(() => {
    loadVulnerableFamilies()
  }, [])

  const loadVulnerableFamilies = async () => {
    try {
      setLoadingFamilies(true)
      const response = await apiRequest('/admin/citizens/vulnerable')

      if (response.success) {
        setFamilies(response.data.families)
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erro ao carregar',
        description: 'Não foi possível carregar as famílias vulneráveis',
      })
    } finally {
      setLoadingFamilies(false)
    }
  }

  const handleSearchCitizen = async () => {
    if (!searchCpf || searchCpf.length < 11) {
      toast({
        variant: 'destructive',
        title: 'CPF inválido',
        description: 'Digite um CPF válido',
      })
      return
    }

    try {
      setSearching(true)
      const response = await apiRequest(`/citizens/search?cpf=${searchCpf}`)

      if (response.success && response.data.citizen) {
        setSearchedCitizen(response.data.citizen)
        setShowSearchDialog(false)

        if (response.data.citizen.vulnerableFamilyData) {
          toast({
            title: 'Cidadão já cadastrado',
            description: 'Este cidadão já possui registro de vulnerabilidade',
          })
        } else {
          setShowAddForm(true)
        }
      } else {
        toast({
          variant: 'destructive',
          title: 'Cidadão não encontrado',
          description: 'Não existe cadastro para este CPF. Cadastre o cidadão primeiro.',
        })
      }
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Erro na busca',
        description: error.message || 'Não foi possível buscar o cidadão',
      })
    } finally {
      setSearching(false)
    }
  }

  const handleSuccess = () => {
    setShowAddForm(false)
    setSearchedCitizen(null)
    setSearchCpf('')
    loadVulnerableFamilies()
  }

  const getRiskBadge = (riskLevel: string) => {
    const configs = {
      LOW: { label: 'Baixo', className: 'bg-green-100 text-green-800' },
      MEDIUM: { label: 'Médio', className: 'bg-yellow-100 text-yellow-800' },
      HIGH: { label: 'Alto', className: 'bg-orange-100 text-orange-800' },
      CRITICAL: { label: 'Crítico', className: 'bg-red-100 text-red-800' },
    }
    const config = configs[riskLevel as keyof typeof configs] || configs.MEDIUM
    return <Badge className={config.className}>{config.label}</Badge>
  }

  const getVulnerabilityLabel = (type: string) => {
    const labels: Record<string, string> = {
      ECONOMIC: 'Econômica',
      SOCIAL: 'Social',
      HEALTH: 'Saúde',
      HOUSING: 'Habitação',
      FOOD_INSECURITY: 'Insegurança Alimentar',
      UNEMPLOYMENT: 'Desemprego',
      DOMESTIC_VIOLENCE: 'Violência Doméstica',
      SUBSTANCE_ABUSE: 'Dependência Química',
      MENTAL_HEALTH: 'Saúde Mental',
      MULTIPLE: 'Múltiplas',
    }
    return labels[type] || type
  }

  const formatAddress = (address: any): string => {
    if (!address) return 'Não informado'
    if (typeof address === 'string') return address
    const parts = []
    if (address.street) parts.push(address.street)
    if (address.number) parts.push(address.number)
    if (address.neighborhood) parts.push(address.neighborhood)
    if (address.city) parts.push(address.city)
    return parts.length > 0 ? parts.join(', ') : 'Não informado'
  }

  const formatCurrency = (value?: number) => {
    if (!value) return 'R$ 0,00'
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)
  }

  const formatDate = (date?: string) => {
    if (!date) return '-'
    return new Date(date).toLocaleDateString('pt-BR')
  }

  // Estatísticas
  const stats = {
    total: families.length,
    critical: families.filter(f => f.riskLevel === 'CRITICAL').length,
    high: families.filter(f => f.riskLevel === 'HIGH').length,
    medium: families.filter(f => f.riskLevel === 'MEDIUM').length,
    low: families.filter(f => f.riskLevel === 'LOW').length,
    withBenefits: families.filter(f => f.benefitRequests && f.benefitRequests.length > 0).length,
  }

  const filteredFamilies = filterRisk === 'ALL'
    ? families
    : families.filter(f => f.riskLevel === filterRisk)

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <AlertTriangle className="h-8 w-8 text-orange-600" />
            Famílias em Situação de Vulnerabilidade
          </h1>
          <p className="text-gray-600 mt-1">
            Cadastro unificado de assistência social
          </p>
        </div>
        <Button onClick={() => setShowSearchDialog(true)} size="lg">
          <UserPlus className="h-5 w-5 mr-2" />
          Nova Família Vulnerável
        </Button>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-blue-600" />
              <div>
                <div className="text-2xl font-bold">{stats.total}</div>
                <div className="text-sm text-gray-500">Total</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-8 w-8 text-red-600" />
              <div>
                <div className="text-2xl font-bold text-red-600">{stats.critical}</div>
                <div className="text-sm text-red-700">Crítico</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-orange-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Activity className="h-8 w-8 text-orange-600" />
              <div>
                <div className="text-2xl font-bold text-orange-600">{stats.high}</div>
                <div className="text-sm text-orange-700">Alto</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-yellow-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <TrendingDown className="h-8 w-8 text-yellow-600" />
              <div>
                <div className="text-2xl font-bold text-yellow-600">{stats.medium}</div>
                <div className="text-sm text-yellow-700">Médio</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-green-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Activity className="h-8 w-8 text-green-600" />
              <div>
                <div className="text-2xl font-bold text-green-600">{stats.low}</div>
                <div className="text-sm text-green-700">Baixo</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <FileText className="h-8 w-8 text-purple-600" />
              <div>
                <div className="text-2xl font-bold">{stats.withBenefits}</div>
                <div className="text-sm text-gray-500">Com Benefícios</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Formulário de Adição */}
      {showAddForm && searchedCitizen && (
        <AddVulnerabilityForm
          citizenId={searchedCitizen.id}
          citizenName={searchedCitizen.name}
          citizenCpf={searchedCitizen.cpf}
          onSuccess={handleSuccess}
          onCancel={() => {
            setShowAddForm(false)
            setSearchedCitizen(null)
          }}
        />
      )}

      {/* Lista de Famílias */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Famílias Cadastradas</CardTitle>
            <Tabs value={filterRisk} onValueChange={setFilterRisk}>
              <TabsList>
                <TabsTrigger value="ALL">Todas</TabsTrigger>
                <TabsTrigger value="CRITICAL">Crítico</TabsTrigger>
                <TabsTrigger value="HIGH">Alto</TabsTrigger>
                <TabsTrigger value="MEDIUM">Médio</TabsTrigger>
                <TabsTrigger value="LOW">Baixo</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          {loadingFamilies ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="text-gray-500 mt-4">Carregando famílias...</p>
            </div>
          ) : filteredFamilies.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <p className="text-gray-500">Nenhuma família cadastrada</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredFamilies.map((family) => {
                const perCapitaIncome = family.monthlyIncome
                  ? family.monthlyIncome / family.memberCount
                  : 0

                return (
                  <div
                    key={family.id}
                    className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold">{family.citizen.name}</h3>
                          {getRiskBadge(family.riskLevel)}
                          <Badge variant="outline">
                            {getVulnerabilityLabel(family.vulnerabilityType)}
                          </Badge>
                          {family.familyCode && (
                            <Badge variant="secondary">{family.familyCode}</Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Users className="h-4 w-4" />
                          <span>{family.memberCount} membros</span>
                        </div>
                        {family.citizen.phone && (
                          <div className="flex items-center gap-2 text-gray-600">
                            <Phone className="h-4 w-4" />
                            <span>{family.citizen.phone}</span>
                          </div>
                        )}
                        {family.citizen.email && (
                          <div className="flex items-center gap-2 text-gray-600">
                            <Mail className="h-4 w-4" />
                            <span>{family.citizen.email}</span>
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-gray-600">
                          <DollarSign className="h-4 w-4" />
                          <div>
                            <div>Renda Total: {formatCurrency(family.monthlyIncome)}</div>
                            <div className="text-xs">
                              Per Capita: {formatCurrency(perCapitaIncome)}
                              {perCapitaIncome <= 218 && perCapitaIncome > 0 && (
                                <span className="ml-2 text-red-600 font-medium">
                                  (Extrema pobreza)
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        {family.socialWorker && (
                          <div className="text-gray-600">
                            Assistente: {family.socialWorker}
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-gray-600">
                          <MapPin className="h-4 w-4" />
                          <span className="text-xs">{formatAddress(family.citizen.address)}</span>
                        </div>
                        <div className="text-xs text-gray-500">
                          Cadastrado em: {formatDate(family.createdAt)}
                        </div>
                      </div>
                    </div>

                    {family.observations && (
                      <div className="mt-3 p-2 bg-gray-50 rounded text-sm text-gray-700">
                        <strong>Observações:</strong> {family.observations}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog de Busca */}
      <Dialog open={showSearchDialog} onOpenChange={setShowSearchDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Buscar Cidadão por CPF</DialogTitle>
            <DialogDescription>
              Digite o CPF do cidadão responsável pela família
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="searchCpf">CPF</Label>
              <div className="flex gap-2">
                <Input
                  id="searchCpf"
                  value={searchCpf}
                  onChange={(e) => setSearchCpf(e.target.value.replace(/\D/g, ''))}
                  placeholder="00000000000"
                  maxLength={11}
                />
                <Button onClick={handleSearchCitizen} disabled={searching}>
                  <Search className="h-4 w-4 mr-2" />
                  {searching ? 'Buscando...' : 'Buscar'}
                </Button>
              </div>
            </div>

            <div className="bg-blue-50 p-3 rounded-md text-sm">
              <p className="font-semibold mb-1">Importante:</p>
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                <li>O cidadão deve estar cadastrado no sistema</li>
                <li>Se não existir, cadastre primeiro na página de Cidadãos</li>
                <li>Cada cidadão pode ter apenas um registro de vulnerabilidade</li>
              </ul>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
