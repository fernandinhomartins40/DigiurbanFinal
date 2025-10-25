'use client'

import { useState, useEffect } from 'react'
import { useAdminAuth, useAdminPermissions } from '@/contexts/AdminAuthContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { useToast } from '@/hooks/use-toast'
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  Filter,
  Download,
  Upload,
  BarChart3,
  Package,
  Clock,
  FileText,
  CheckCircle2,
  XCircle
} from 'lucide-react'

interface Service {
  id: string
  name: string
  description: string | null
  category: string | null
  departmentId: string
  department: {
    id: string
    name: string
    code?: string
  }
  requiresDocuments: boolean
  requiredDocuments?: string[]
  estimatedDays: number | null
  priority: number
  isActive: boolean
  icon?: string | null
  color?: string | null
  createdAt: string
  updatedAt: string
}

interface Department {
  id: string
  name: string
  code?: string
}

export default function ServicesManagementPage() {
  const { apiRequest, loading: authLoading } = useAdminAuth()
  const { hasPermission } = useAdminPermissions()
  const { toast } = useToast()

  const [services, setServices] = useState<Service[]>([])
  const [departments, setDepartments] = useState<Department[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [departmentFilter, setDepartmentFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')

  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showViewDialog, setShowViewDialog] = useState(false)
  const [selectedService, setSelectedService] = useState<Service | null>(null)

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    departmentId: '',
    requiresDocuments: false,
    requiredDocuments: [] as string[],
    estimatedDays: '',
    priority: 3,
    icon: '',
    color: '#3b82f6'
  })

  const [documentInput, setDocumentInput] = useState('')

  // Carregar serviços
  const loadServices = async () => {
    try {
      setLoading(true)
      const response = await apiRequest('/api/services')
      setServices(response.data || [])
    } catch (error) {
      console.error('Erro ao carregar serviços:', error)
      toast({
        title: 'Erro ao carregar serviços',
        description: 'Não foi possível carregar a lista de serviços.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  // Carregar departamentos
  const loadDepartments = async () => {
    try {
      const response = await apiRequest('/api/admin/management/departments')
      setDepartments(response.departments || response.data?.departments || [])
    } catch (error) {
      console.error('Erro ao carregar departamentos:', error)
    }
  }

  // Criar serviço
  const createService = async () => {
    if (!formData.name || !formData.departmentId) {
      toast({
        title: 'Campos obrigatórios',
        description: 'Nome e departamento são obrigatórios.',
        variant: 'destructive',
      })
      return
    }

    try {
      await apiRequest('/api/services', {
        method: 'POST',
        body: JSON.stringify({
          name: formData.name,
          description: formData.description || null,
          category: formData.category || null,
          departmentId: formData.departmentId,
          requiresDocuments: formData.requiresDocuments,
          requiredDocuments: formData.requiredDocuments,
          estimatedDays: formData.estimatedDays ? parseInt(formData.estimatedDays) : null,
          priority: formData.priority,
          icon: formData.icon || null,
          color: formData.color || null,
        })
      })

      toast({
        title: 'Serviço criado',
        description: 'O serviço foi criado com sucesso.',
      })

      setShowCreateDialog(false)
      resetForm()
      await loadServices()
    } catch (error: any) {
      console.error('Erro ao criar serviço:', error)
      toast({
        title: 'Erro ao criar serviço',
        description: error?.message || 'Ocorreu um erro ao criar o serviço.',
        variant: 'destructive',
      })
    }
  }

  // Atualizar serviço
  const updateService = async () => {
    if (!selectedService || !formData.name) {
      toast({
        title: 'Campos obrigatórios',
        description: 'Nome é obrigatório.',
        variant: 'destructive',
      })
      return
    }

    try {
      await apiRequest(`/api/services/${selectedService.id}`, {
        method: 'PUT',
        body: JSON.stringify({
          name: formData.name,
          description: formData.description || null,
          category: formData.category || null,
          requiresDocuments: formData.requiresDocuments,
          requiredDocuments: formData.requiredDocuments,
          estimatedDays: formData.estimatedDays ? parseInt(formData.estimatedDays) : null,
          priority: formData.priority,
          icon: formData.icon || null,
          color: formData.color || null,
        })
      })

      toast({
        title: 'Serviço atualizado',
        description: 'O serviço foi atualizado com sucesso.',
      })

      setShowEditDialog(false)
      setSelectedService(null)
      resetForm()
      await loadServices()
    } catch (error: any) {
      console.error('Erro ao atualizar serviço:', error)
      toast({
        title: 'Erro ao atualizar serviço',
        description: error?.message || 'Ocorreu um erro ao atualizar o serviço.',
        variant: 'destructive',
      })
    }
  }

  // Desativar serviço
  const deleteService = async (serviceId: string) => {
    if (!confirm('Tem certeza que deseja desativar este serviço?')) return

    try {
      await apiRequest(`/api/services/${serviceId}`, {
        method: 'DELETE',
      })

      toast({
        title: 'Serviço desativado',
        description: 'O serviço foi desativado com sucesso.',
      })

      await loadServices()
    } catch (error: any) {
      console.error('Erro ao desativar serviço:', error)
      toast({
        title: 'Erro ao desativar serviço',
        description: error?.message || 'Ocorreu um erro ao desativar o serviço.',
        variant: 'destructive',
      })
    }
  }

  // Resetar formulário
  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      category: '',
      departmentId: '',
      requiresDocuments: false,
      requiredDocuments: [],
      estimatedDays: '',
      priority: 3,
      icon: '',
      color: '#3b82f6'
    })
    setDocumentInput('')
  }

  // Popular formulário para edição
  const populateEditForm = (service: Service) => {
    setFormData({
      name: service.name,
      description: service.description || '',
      category: service.category || '',
      departmentId: service.departmentId,
      requiresDocuments: service.requiresDocuments,
      requiredDocuments: service.requiredDocuments || [],
      estimatedDays: service.estimatedDays?.toString() || '',
      priority: service.priority,
      icon: service.icon || '',
      color: service.color || '#3b82f6'
    })
  }

  // Adicionar documento requerido
  const addDocument = () => {
    if (documentInput.trim()) {
      setFormData({
        ...formData,
        requiredDocuments: [...formData.requiredDocuments, documentInput.trim()]
      })
      setDocumentInput('')
    }
  }

  // Remover documento requerido
  const removeDocument = (index: number) => {
    setFormData({
      ...formData,
      requiredDocuments: formData.requiredDocuments.filter((_, i) => i !== index)
    })
  }

  useEffect(() => {
    if (!authLoading) {
      loadServices()
      loadDepartments()
    }
  }, [authLoading])

  // Filtros
  const filteredServices = services.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === 'all' || service.category === categoryFilter
    const matchesDepartment = departmentFilter === 'all' || service.departmentId === departmentFilter
    const matchesStatus = statusFilter === 'all' ||
                         (statusFilter === 'active' && service.isActive) ||
                         (statusFilter === 'inactive' && !service.isActive)

    return matchesSearch && matchesCategory && matchesDepartment && matchesStatus
  })

  // Estatísticas
  const stats = {
    total: services.length,
    active: services.filter(s => s.isActive).length,
    inactive: services.filter(s => !s.isActive).length,
    requiresDocuments: services.filter(s => s.requiresDocuments).length,
  }

  // Categorias únicas
  const categories = Array.from(new Set(services.map(s => s.category).filter(Boolean)))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gerenciamento de Serviços</h1>
          <p className="text-gray-600 mt-1">
            Gerencie o catálogo de serviços públicos do município
          </p>
        </div>
        <div className="flex space-x-2">
          {hasPermission('services:create') && (
            <Button onClick={() => setShowCreateDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Novo Serviço
            </Button>
          )}
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <Package className="h-8 w-8 text-gray-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Ativos</p>
                <p className="text-2xl font-bold text-green-600">{stats.active}</p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Inativos</p>
                <p className="text-2xl font-bold text-red-600">{stats.inactive}</p>
              </div>
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Com Documentos</p>
                <p className="text-2xl font-bold text-blue-600">{stats.requiresDocuments}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar serviços..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Todas as categorias" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as categorias</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat || ''}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Todos os departamentos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os departamentos</SelectItem>
                {departments.map((dept) => (
                  <SelectItem key={dept.id} value={dept.id}>
                    {dept.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Todos os status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value="active">Ativos</SelectItem>
                <SelectItem value="inactive">Inativos</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Serviços */}
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredServices.map((service) => (
            <Card key={service.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg line-clamp-1">{service.name}</CardTitle>
                    <CardDescription className="line-clamp-2 mt-1">
                      {service.description || 'Sem descrição'}
                    </CardDescription>
                  </div>
                  <Badge variant={service.isActive ? "default" : "secondary"}>
                    {service.isActive ? 'Ativo' : 'Inativo'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Categoria:</span>
                    <Badge variant="outline">{service.category || 'Sem categoria'}</Badge>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Departamento:</span>
                    <span className="font-medium text-xs">{service.department.name}</span>
                  </div>

                  {service.estimatedDays !== null && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Prazo:</span>
                      <span className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {service.estimatedDays} dias
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Documentos:</span>
                    <Badge variant={service.requiresDocuments ? "default" : "secondary"} className="text-xs">
                      {service.requiresDocuments ? 'Requer' : 'Não requer'}
                    </Badge>
                  </div>

                  <div className="pt-3 flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedService(service)
                        setShowViewDialog(true)
                      }}
                      className="flex-1"
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      Ver
                    </Button>

                    {hasPermission('services:update') && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedService(service)
                          populateEditForm(service)
                          setShowEditDialog(true)
                        }}
                        className="flex-1"
                      >
                        <Edit className="h-3 w-3 mr-1" />
                        Editar
                      </Button>
                    )}

                    {hasPermission('services:delete') && service.isActive && (
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => deleteService(service.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {filteredServices.length === 0 && !loading && (
        <Card>
          <CardContent className="py-8 text-center">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-2">Nenhum serviço encontrado</p>
            <p className="text-sm text-gray-500">
              {searchTerm || categoryFilter !== 'all' || departmentFilter !== 'all' || statusFilter !== 'all'
                ? 'Tente ajustar os filtros de busca'
                : 'Crie seu primeiro serviço para começar'}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Dialog Criar Serviço */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Criar Novo Serviço</DialogTitle>
            <DialogDescription>
              Preencha os dados do novo serviço público
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome do Serviço *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ex: Agendamento de Consulta Médica"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Descreva o serviço..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Categoria</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="Ex: Consultas Médicas"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="departmentId">Departamento *</Label>
                <Select
                  value={formData.departmentId}
                  onValueChange={(value) => setFormData({ ...formData, departmentId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept.id} value={dept.id}>
                        {dept.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="estimatedDays">Prazo Estimado (dias)</Label>
                <Input
                  id="estimatedDays"
                  type="number"
                  value={formData.estimatedDays}
                  onChange={(e) => setFormData({ ...formData, estimatedDays: e.target.value })}
                  placeholder="Ex: 5"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority">Prioridade (1-5)</Label>
                <Select
                  value={String(formData.priority)}
                  onValueChange={(value) => setFormData({ ...formData, priority: parseInt(value) })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 - Muito Baixa</SelectItem>
                    <SelectItem value="2">2 - Baixa</SelectItem>
                    <SelectItem value="3">3 - Normal</SelectItem>
                    <SelectItem value="4">4 - Alta</SelectItem>
                    <SelectItem value="5">5 - Crítica</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="requiresDocuments"
                checked={formData.requiresDocuments}
                onCheckedChange={(checked) => setFormData({ ...formData, requiresDocuments: checked as boolean })}
              />
              <Label htmlFor="requiresDocuments" className="cursor-pointer">
                Este serviço requer documentos
              </Label>
            </div>

            {formData.requiresDocuments && (
              <div className="space-y-2">
                <Label>Documentos Necessários</Label>
                <div className="flex space-x-2">
                  <Input
                    value={documentInput}
                    onChange={(e) => setDocumentInput(e.target.value)}
                    placeholder="Ex: RG, CPF, Comprovante de residência"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addDocument())}
                  />
                  <Button type="button" onClick={addDocument} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {formData.requiredDocuments.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.requiredDocuments.map((doc, index) => (
                      <Badge key={index} variant="secondary" className="cursor-pointer" onClick={() => removeDocument(index)}>
                        {doc} <XCircle className="h-3 w-3 ml-1" />
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => { setShowCreateDialog(false); resetForm(); }}>
              Cancelar
            </Button>
            <Button onClick={createService}>
              Criar Serviço
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog Editar Serviço */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Serviço</DialogTitle>
            <DialogDescription>
              Atualize os dados do serviço
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Nome do Serviço *</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-description">Descrição</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-category">Categoria</Label>
                <Input
                  id="edit-category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-estimatedDays">Prazo Estimado (dias)</Label>
                <Input
                  id="edit-estimatedDays"
                  type="number"
                  value={formData.estimatedDays}
                  onChange={(e) => setFormData({ ...formData, estimatedDays: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-priority">Prioridade (1-5)</Label>
              <Select
                value={String(formData.priority)}
                onValueChange={(value) => setFormData({ ...formData, priority: parseInt(value) })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 - Muito Baixa</SelectItem>
                  <SelectItem value="2">2 - Baixa</SelectItem>
                  <SelectItem value="3">3 - Normal</SelectItem>
                  <SelectItem value="4">4 - Alta</SelectItem>
                  <SelectItem value="5">5 - Crítica</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="edit-requiresDocuments"
                checked={formData.requiresDocuments}
                onCheckedChange={(checked) => setFormData({ ...formData, requiresDocuments: checked as boolean })}
              />
              <Label htmlFor="edit-requiresDocuments" className="cursor-pointer">
                Este serviço requer documentos
              </Label>
            </div>

            {formData.requiresDocuments && (
              <div className="space-y-2">
                <Label>Documentos Necessários</Label>
                <div className="flex space-x-2">
                  <Input
                    value={documentInput}
                    onChange={(e) => setDocumentInput(e.target.value)}
                    placeholder="Ex: RG, CPF"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addDocument())}
                  />
                  <Button type="button" onClick={addDocument} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {formData.requiredDocuments.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.requiredDocuments.map((doc, index) => (
                      <Badge key={index} variant="secondary" className="cursor-pointer" onClick={() => removeDocument(index)}>
                        {doc} <XCircle className="h-3 w-3 ml-1" />
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => { setShowEditDialog(false); setSelectedService(null); resetForm(); }}>
              Cancelar
            </Button>
            <Button onClick={updateService}>
              Salvar Alterações
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog Ver Detalhes */}
      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalhes do Serviço</DialogTitle>
          </DialogHeader>

          {selectedService && (
            <div className="space-y-4">
              <div>
                <Label className="text-gray-600">Nome</Label>
                <p className="font-medium">{selectedService.name}</p>
              </div>

              {selectedService.description && (
                <div>
                  <Label className="text-gray-600">Descrição</Label>
                  <p>{selectedService.description}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-600">Categoria</Label>
                  <p>{selectedService.category || 'Sem categoria'}</p>
                </div>

                <div>
                  <Label className="text-gray-600">Departamento</Label>
                  <p>{selectedService.department.name}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label className="text-gray-600">Prazo Estimado</Label>
                  <p>{selectedService.estimatedDays ? `${selectedService.estimatedDays} dias` : 'Não definido'}</p>
                </div>

                <div>
                  <Label className="text-gray-600">Prioridade</Label>
                  <Badge variant="outline">{selectedService.priority}/5</Badge>
                </div>

                <div>
                  <Label className="text-gray-600">Status</Label>
                  <Badge variant={selectedService.isActive ? "default" : "secondary"}>
                    {selectedService.isActive ? 'Ativo' : 'Inativo'}
                  </Badge>
                </div>
              </div>

              <div>
                <Label className="text-gray-600">Requer Documentos</Label>
                <p>{selectedService.requiresDocuments ? 'Sim' : 'Não'}</p>
              </div>

              {selectedService.requiresDocuments && selectedService.requiredDocuments && selectedService.requiredDocuments.length > 0 && (
                <div>
                  <Label className="text-gray-600">Documentos Necessários</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedService.requiredDocuments.map((doc, index) => (
                      <Badge key={index} variant="secondary">{doc}</Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 text-sm text-gray-500">
                <div>
                  <Label className="text-gray-600">Criado em</Label>
                  <p>{new Date(selectedService.createdAt).toLocaleString('pt-BR')}</p>
                </div>

                <div>
                  <Label className="text-gray-600">Atualizado em</Label>
                  <p>{new Date(selectedService.updatedAt).toLocaleString('pt-BR')}</p>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => { setShowViewDialog(false); setSelectedService(null); }}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
