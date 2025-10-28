'use client'

import { useState } from 'react'
import { ModuleLayout } from '@/components/modules/ModuleLayout'
import { DataTable } from '@/components/modules/DataTable'
import { FormModal } from '@/components/modules/FormModal'
import { FilterBar } from '@/components/modules/FilterBar'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { agricultureService } from '@/lib/services/agriculture.service'
import { Badge } from '@/components/ui/badge'

export default function PropriedadesPage() {
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedProperty, setSelectedProperty] = useState<any>(null)
  const [filters, setFilters] = useState({})
  const [refreshKey, setRefreshKey] = useState(0)

  const columns = [
    { key: 'name', label: 'Nome da Propriedade' },
    { key: 'producer.name', label: 'Produtor', render: (_: any, row: any) => row.producer?.name || '-' },
    { key: 'area', label: 'Área (ha)' },
    { key: 'location', label: 'Localização' },
    {
      key: 'hasGps',
      label: 'GPS',
      render: (value: boolean) => (
        <Badge variant={value ? 'default' : 'secondary'}>
          {value ? 'Sim' : 'Não'}
        </Badge>
      ),
    },
  ]

  const formFields = [
    {
      name: 'name',
      label: 'Nome da Propriedade',
      type: 'text' as const,
      required: true,
      placeholder: 'Nome da propriedade',
    },
    {
      name: 'producerId',
      label: 'Produtor',
      type: 'text' as const,
      required: true,
      placeholder: 'ID do produtor',
    },
    {
      name: 'area',
      label: 'Área (hectares)',
      type: 'number' as const,
      required: true,
      placeholder: '0.00',
    },
    {
      name: 'location',
      label: 'Localização',
      type: 'text' as const,
      required: true,
      placeholder: 'Endereço ou referência',
    },
    {
      name: 'latitude',
      label: 'Latitude',
      type: 'text' as const,
      placeholder: 'Ex: -23.550520',
    },
    {
      name: 'longitude',
      label: 'Longitude',
      type: 'text' as const,
      placeholder: 'Ex: -46.633308',
    },
    {
      name: 'observations',
      label: 'Observações',
      type: 'textarea' as const,
      placeholder: 'Informações adicionais',
    },
  ]

  const filterConfig = [
    {
      type: 'search' as const,
      field: 'search',
      label: 'Buscar',
      placeholder: 'Buscar por nome ou localização',
    },
  ]

  const handleSubmit = async (data: any) => {
    if (selectedProperty?.id) {
      await agricultureService.properties.update(selectedProperty.id, data)
    } else {
      await agricultureService.properties.create(data)
    }
    setRefreshKey((k) => k + 1)
    setSelectedProperty(null)
  }

  const handleEdit = (property: any) => {
    setSelectedProperty(property)
    setModalOpen(true)
  }

  const handleDelete = async (id: string) => {
    await agricultureService.properties.delete(id)
    setRefreshKey((k) => k + 1)
  }

  return (
    <ModuleLayout
      title="Propriedades Rurais"
      breadcrumb={[
        { label: 'Secretarias', href: '/admin/secretarias' },
        { label: 'Agricultura', href: '/admin/secretarias/agricultura' },
        { label: 'Propriedades Rurais' },
      ]}
      actions={
        <Button onClick={() => {
          setSelectedProperty(null)
          setModalOpen(true)
        }}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Propriedade
        </Button>
      }
    >
      <FilterBar filters={filterConfig} onFilter={setFilters} />

      <DataTable
        key={refreshKey}
        endpoint="/api/secretarias/agriculture/properties"
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
        filters={filters}
      />

      <FormModal
        title={selectedProperty ? 'Editar Propriedade' : 'Nova Propriedade'}
        open={modalOpen}
        onOpenChange={setModalOpen}
        fields={formFields}
        initialData={selectedProperty || {}}
        onSubmit={handleSubmit}
      />
    </ModuleLayout>
  )
}
