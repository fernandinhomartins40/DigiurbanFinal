'use client'

import { useState } from 'react'
import { ModuleLayout } from '@/components/modules/ModuleLayout'
import { DataTable } from '@/components/modules/DataTable'
import { FormModal } from '@/components/modules/FormModal'
import { FilterBar } from '@/components/modules/FilterBar'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { tourismService } from '@/lib/services/tourism.service'
import { Badge } from '@/components/ui/badge'

export default function RoteirosPage() {
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedRoute, setSelectedRoute] = useState<any>(null)
  const [filters, setFilters] = useState({})
  const [refreshKey, setRefreshKey] = useState(0)

  const columns = [
    { key: 'name', label: 'Nome' },
    { key: 'category', label: 'Categoria' },
    { key: 'duration', label: 'Duração' },
    { key: 'difficulty', label: 'Dificuldade' },
    {
      key: 'active',
      label: 'Status',
      render: (value: boolean) => (
        <Badge variant={value ? 'default' : 'secondary'}>
          {value ? 'Ativo' : 'Inativo'}
        </Badge>
      ),
    },
  ]

  const formFields = [
    {
      name: 'name',
      label: 'Nome do Roteiro',
      type: 'text' as const,
      required: true,
      placeholder: 'Nome do roteiro',
    },
    {
      name: 'category',
      label: 'Categoria',
      type: 'select' as const,
      required: true,
      options: [
        { value: 'HISTORICO', label: 'Histórico' },
        { value: 'CULTURAL', label: 'Cultural' },
        { value: 'NATURAL', label: 'Natural' },
        { value: 'GASTRONOMICO', label: 'Gastronômico' },
        { value: 'AVENTURA', label: 'Aventura' },
        { value: 'RELIGIOSO', label: 'Religioso' },
        { value: 'RURAL', label: 'Rural' },
      ],
    },
    {
      name: 'duration',
      label: 'Duração',
      type: 'text' as const,
      required: true,
      placeholder: 'Ex: 4 horas, 1 dia',
    },
    {
      name: 'difficulty',
      label: 'Dificuldade',
      type: 'select' as const,
      options: [
        { value: 'FACIL', label: 'Fácil' },
        { value: 'MODERADO', label: 'Moderado' },
        { value: 'DIFICIL', label: 'Difícil' },
      ],
    },
    {
      name: 'distance',
      label: 'Distância (km)',
      type: 'number' as const,
      placeholder: '0',
    },
    {
      name: 'startPoint',
      label: 'Ponto de Partida',
      type: 'text' as const,
      required: true,
      placeholder: 'Local de início',
    },
    {
      name: 'endPoint',
      label: 'Ponto de Chegada',
      type: 'text' as const,
      placeholder: 'Local de término',
    },
    {
      name: 'stops',
      label: 'Paradas (separadas por vírgula)',
      type: 'textarea' as const,
      placeholder: 'Igreja Matriz, Museu, Praça Central',
    },
    {
      name: 'description',
      label: 'Descrição',
      type: 'textarea' as const,
      required: true,
      placeholder: 'Descrição do roteiro',
    },
    {
      name: 'recommendations',
      label: 'Recomendações',
      type: 'textarea' as const,
      placeholder: 'Recomendações para os visitantes',
    },
    {
      name: 'cost',
      label: 'Custo Estimado',
      type: 'number' as const,
      placeholder: '0.00',
    },
  ]

  const filterConfig = [
    {
      type: 'search' as const,
      field: 'search',
      label: 'Buscar',
      placeholder: 'Buscar por nome',
    },
    {
      type: 'select' as const,
      field: 'category',
      label: 'Categoria',
      options: [
        { value: 'HISTORICO', label: 'Histórico' },
        { value: 'CULTURAL', label: 'Cultural' },
        { value: 'NATURAL', label: 'Natural' },
        { value: 'GASTRONOMICO', label: 'Gastronômico' },
      ],
    },
  ]

  const handleSubmit = async (data: any) => {
    if (selectedRoute?.id) {
      await tourismService.routes.update(selectedRoute.id, data)
    } else {
      await tourismService.routes.create(data)
    }
    setRefreshKey((k) => k + 1)
    setSelectedRoute(null)
  }

  const handleEdit = (route: any) => {
    setSelectedRoute(route)
    setModalOpen(true)
  }

  const handleDelete = async (id: string) => {
    await tourismService.routes.delete(id)
    setRefreshKey((k) => k + 1)
  }

  return (
    <ModuleLayout
      title="Roteiros Turísticos"
      breadcrumb={[
        { label: 'Secretarias', href: '/admin/secretarias' },
        { label: 'Turismo', href: '/admin/secretarias/turismo' },
        { label: 'Roteiros' },
      ]}
      actions={
        <Button onClick={() => {
          setSelectedRoute(null)
          setModalOpen(true)
        }}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Roteiro
        </Button>
      }
    >
      <FilterBar filters={filterConfig} onFilter={setFilters} />

      <DataTable
        key={refreshKey}
        endpoint="/api/secretarias/tourism/routes"
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
        filters={filters}
      />

      <FormModal
        title={selectedRoute ? 'Editar Roteiro' : 'Novo Roteiro'}
        open={modalOpen}
        onOpenChange={setModalOpen}
        fields={formFields}
        initialData={selectedRoute || {}}
        onSubmit={handleSubmit}
      />
    </ModuleLayout>
  )
}
