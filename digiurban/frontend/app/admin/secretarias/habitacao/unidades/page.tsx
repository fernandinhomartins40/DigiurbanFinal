'use client'

import { useState } from 'react'
import { ModuleLayout } from '@/components/modules/ModuleLayout'
import { DataTable } from '@/components/modules/DataTable'
import { FormModal } from '@/components/modules/FormModal'
import { FilterBar } from '@/components/modules/FilterBar'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { housingService } from '@/lib/services/housing.service'
import { Badge } from '@/components/ui/badge'

export default function UnidadesPage() {
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedUnit, setSelectedUnit] = useState<any>(null)
  const [filters, setFilters] = useState({})
  const [refreshKey, setRefreshKey] = useState(0)

  const columns = [
    { key: 'code', label: 'Código' },
    { key: 'address', label: 'Endereço' },
    { key: 'type', label: 'Tipo' },
    { key: 'area', label: 'Área (m²)' },
    {
      key: 'status',
      label: 'Status',
      render: (value: string) => {
        const variants: Record<string, any> = {
          DISPONIVEL: 'default',
          OCUPADA: 'secondary',
          EM_CONSTRUCAO: 'default',
          MANUTENCAO: 'secondary',
        }
        return <Badge variant={variants[value] || 'secondary'}>{value}</Badge>
      },
    },
  ]

  const formFields = [
    {
      name: 'code',
      label: 'Código',
      type: 'text' as const,
      required: true,
      placeholder: 'Código da unidade',
    },
    {
      name: 'address',
      label: 'Endereço',
      type: 'textarea' as const,
      required: true,
      placeholder: 'Endereço completo',
    },
    {
      name: 'type',
      label: 'Tipo',
      type: 'select' as const,
      required: true,
      options: [
        { value: 'APARTAMENTO', label: 'Apartamento' },
        { value: 'CASA', label: 'Casa' },
        { value: 'SOBRADO', label: 'Sobrado' },
        { value: 'LOTE', label: 'Lote' },
      ],
    },
    {
      name: 'area',
      label: 'Área (m²)',
      type: 'number' as const,
      placeholder: '50',
    },
    {
      name: 'bedrooms',
      label: 'Quartos',
      type: 'number' as const,
      placeholder: '2',
    },
    {
      name: 'bathrooms',
      label: 'Banheiros',
      type: 'number' as const,
      placeholder: '1',
    },
    {
      name: 'programId',
      label: 'Programa',
      type: 'text' as const,
      placeholder: 'ID do programa',
    },
    {
      name: 'status',
      label: 'Status',
      type: 'select' as const,
      options: [
        { value: 'DISPONIVEL', label: 'Disponível' },
        { value: 'OCUPADA', label: 'Ocupada' },
        { value: 'EM_CONSTRUCAO', label: 'Em Construção' },
        { value: 'MANUTENCAO', label: 'Manutenção' },
      ],
    },
  ]

  const filterConfig = [
    {
      type: 'search' as const,
      field: 'search',
      label: 'Buscar',
      placeholder: 'Buscar por código ou endereço',
    },
    {
      type: 'select' as const,
      field: 'status',
      label: 'Status',
      options: [
        { value: 'DISPONIVEL', label: 'Disponível' },
        { value: 'OCUPADA', label: 'Ocupada' },
        { value: 'EM_CONSTRUCAO', label: 'Em Construção' },
      ],
    },
  ]

  const handleSubmit = async (data: any) => {
    if (selectedUnit?.id) {
      await housingService.units.update(selectedUnit.id, data)
    } else {
      await housingService.units.create(data)
    }
    setRefreshKey((k) => k + 1)
    setSelectedUnit(null)
  }

  const handleEdit = (unit: any) => {
    setSelectedUnit(unit)
    setModalOpen(true)
  }

  const handleDelete = async (id: string) => {
    await housingService.units.delete(id)
    setRefreshKey((k) => k + 1)
  }

  return (
    <ModuleLayout
      title="Unidades Habitacionais"
      breadcrumb={[
        { label: 'Secretarias', href: '/admin/secretarias' },
        { label: 'Habitação', href: '/admin/secretarias/habitacao' },
        { label: 'Unidades' },
      ]}
      actions={
        <Button onClick={() => {
          setSelectedUnit(null)
          setModalOpen(true)
        }}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Unidade
        </Button>
      }
    >
      <FilterBar filters={filterConfig} onFilter={setFilters} />

      <DataTable
        key={refreshKey}
        endpoint="/api/specialized/housing/units"
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
        filters={filters}
      />

      <FormModal
        title={selectedUnit ? 'Editar Unidade' : 'Nova Unidade'}
        open={modalOpen}
        onOpenChange={setModalOpen}
        fields={formFields}
        initialData={selectedUnit || {}}
        onSubmit={handleSubmit}
      />
    </ModuleLayout>
  )
}
