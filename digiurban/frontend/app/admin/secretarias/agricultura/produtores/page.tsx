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

export default function ProdutoresPage() {
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedProducer, setSelectedProducer] = useState<any>(null)
  const [filters, setFilters] = useState({})
  const [refreshKey, setRefreshKey] = useState(0)

  const columns = [
    { key: 'name', label: 'Nome' },
    { key: 'cpf', label: 'CPF' },
    {
      key: 'productionType',
      label: 'Tipo de Produção',
      render: (value: string) => (
        <Badge variant="outline">{value}</Badge>
      ),
    },
    { key: 'mainCrop', label: 'Cultura Principal' },
    { key: 'phone', label: 'Telefone' },
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
      label: 'Nome Completo',
      type: 'text' as const,
      required: true,
      placeholder: 'Nome do produtor',
    },
    {
      name: 'cpf',
      label: 'CPF',
      type: 'text' as const,
      required: true,
      placeholder: '000.000.000-00',
    },
    {
      name: 'email',
      label: 'E-mail',
      type: 'email' as const,
      placeholder: 'email@exemplo.com',
    },
    {
      name: 'phone',
      label: 'Telefone',
      type: 'text' as const,
      required: true,
      placeholder: '(00) 00000-0000',
    },
    {
      name: 'productionType',
      label: 'Tipo de Produção',
      type: 'select' as const,
      required: true,
      options: [
        { value: 'AGRICULTURA_FAMILIAR', label: 'Agricultura Familiar' },
        { value: 'AGRONEGOCIO', label: 'Agronegócio' },
        { value: 'ORGANICA', label: 'Orgânica' },
        { value: 'CONVENCIONAL', label: 'Convencional' },
      ],
    },
    {
      name: 'mainCrop',
      label: 'Cultura Principal',
      type: 'text' as const,
      required: true,
      placeholder: 'Ex: Milho, Soja, Café',
    },
    {
      name: 'address',
      label: 'Endereço',
      type: 'textarea' as const,
      placeholder: 'Endereço completo',
    },
  ]

  const filterConfig = [
    {
      type: 'search' as const,
      field: 'search',
      label: 'Buscar',
      placeholder: 'Buscar por nome ou CPF',
    },
    {
      type: 'select' as const,
      field: 'productionType',
      label: 'Tipo de Produção',
      options: [
        { value: 'AGRICULTURA_FAMILIAR', label: 'Agricultura Familiar' },
        { value: 'AGRONEGOCIO', label: 'Agronegócio' },
        { value: 'ORGANICA', label: 'Orgânica' },
        { value: 'CONVENCIONAL', label: 'Convencional' },
      ],
    },
  ]

  const handleSubmit = async (data: any) => {
    if (selectedProducer?.id) {
      await agricultureService.producers.update(selectedProducer.id, data)
    } else {
      await agricultureService.producers.create(data)
    }
    setRefreshKey((k) => k + 1)
    setSelectedProducer(null)
  }

  const handleEdit = (producer: any) => {
    setSelectedProducer(producer)
    setModalOpen(true)
  }

  const handleDelete = async (id: string) => {
    await agricultureService.producers.delete(id)
    setRefreshKey((k) => k + 1)
  }

  return (
    <ModuleLayout
      title="Produtores Rurais"
      breadcrumb={[
        { label: 'Secretarias', href: '/admin/secretarias' },
        { label: 'Agricultura', href: '/admin/secretarias/agricultura' },
        { label: 'Produtores Rurais' },
      ]}
      actions={
        <Button onClick={() => {
          setSelectedProducer(null)
          setModalOpen(true)
        }}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Produtor
        </Button>
      }
    >
      <FilterBar filters={filterConfig} onFilter={setFilters} />

      <DataTable
        key={refreshKey}
        endpoint="/api/specialized/agriculture/producers"
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
        filters={filters}
      />

      <FormModal
        title={selectedProducer ? 'Editar Produtor' : 'Novo Produtor'}
        open={modalOpen}
        onOpenChange={setModalOpen}
        fields={formFields}
        initialData={selectedProducer || {}}
        onSubmit={handleSubmit}
      />
    </ModuleLayout>
  )
}
