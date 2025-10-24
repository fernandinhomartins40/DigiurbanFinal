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

export default function RegularizacaoPage() {
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedRegularization, setSelectedRegularization] = useState<any>(null)
  const [filters, setFilters] = useState({})
  const [refreshKey, setRefreshKey] = useState(0)

  const columns = [
    { key: 'protocol', label: 'Protocolo' },
    { key: 'ownerName', label: 'Proprietário' },
    { key: 'address', label: 'Endereço' },
    {
      key: 'requestDate',
      label: 'Data',
      render: (value: string) => new Date(value).toLocaleDateString('pt-BR'),
    },
    {
      key: 'status',
      label: 'Status',
      render: (value: string) => {
        const variants: Record<string, any> = {
          SOLICITADA: 'secondary',
          EM_ANALISE: 'default',
          APROVADA: 'default',
          REJEITADA: 'destructive',
        }
        return <Badge variant={variants[value] || 'secondary'}>{value}</Badge>
      },
    },
  ]

  const formFields = [
    {
      name: 'ownerName',
      label: 'Nome do Proprietário',
      type: 'text' as const,
      required: true,
      placeholder: 'Nome completo',
    },
    {
      name: 'ownerCpf',
      label: 'CPF',
      type: 'text' as const,
      required: true,
      placeholder: '000.000.000-00',
    },
    {
      name: 'phone',
      label: 'Telefone',
      type: 'text' as const,
      required: true,
      placeholder: '(00) 00000-0000',
    },
    {
      name: 'address',
      label: 'Endereço do Imóvel',
      type: 'textarea' as const,
      required: true,
      placeholder: 'Endereço completo',
    },
    {
      name: 'propertyArea',
      label: 'Área do Imóvel (m²)',
      type: 'number' as const,
      placeholder: '250',
    },
    {
      name: 'regularizationType',
      label: 'Tipo de Regularização',
      type: 'select' as const,
      required: true,
      options: [
        { value: 'LOTEAMENTO', label: 'Loteamento' },
        { value: 'OCUPACAO_IRREGULAR', label: 'Ocupação Irregular' },
        { value: 'ASSENTAMENTO', label: 'Assentamento' },
        { value: 'OUTROS', label: 'Outros' },
      ],
    },
    {
      name: 'status',
      label: 'Status',
      type: 'select' as const,
      options: [
        { value: 'SOLICITADA', label: 'Solicitada' },
        { value: 'EM_ANALISE', label: 'Em Análise' },
        { value: 'APROVADA', label: 'Aprovada' },
        { value: 'REJEITADA', label: 'Rejeitada' },
      ],
    },
    {
      name: 'observations',
      label: 'Observações',
      type: 'textarea' as const,
      placeholder: 'Observações gerais',
    },
  ]

  const filterConfig = [
    {
      type: 'search' as const,
      field: 'search',
      label: 'Buscar',
      placeholder: 'Buscar por protocolo ou proprietário',
    },
    {
      type: 'select' as const,
      field: 'status',
      label: 'Status',
      options: [
        { value: 'SOLICITADA', label: 'Solicitada' },
        { value: 'EM_ANALISE', label: 'Em Análise' },
        { value: 'APROVADA', label: 'Aprovada' },
        { value: 'REJEITADA', label: 'Rejeitada' },
      ],
    },
  ]

  const handleSubmit = async (data: any) => {
    if (selectedRegularization?.id) {
      await housingService.regularization.update(selectedRegularization.id, data)
    } else {
      await housingService.regularization.create(data)
    }
    setRefreshKey((k) => k + 1)
    setSelectedRegularization(null)
  }

  const handleEdit = (regularization: any) => {
    setSelectedRegularization(regularization)
    setModalOpen(true)
  }

  const handleDelete = async (id: string) => {
    await housingService.regularization.delete(id)
    setRefreshKey((k) => k + 1)
  }

  return (
    <ModuleLayout
      title="Regularização Fundiária"
      breadcrumb={[
        { label: 'Secretarias', href: '/admin/secretarias' },
        { label: 'Habitação', href: '/admin/secretarias/habitacao' },
        { label: 'Regularização' },
      ]}
      actions={
        <Button onClick={() => {
          setSelectedRegularization(null)
          setModalOpen(true)
        }}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Solicitação
        </Button>
      }
    >
      <FilterBar filters={filterConfig} onFilter={setFilters} />

      <DataTable
        key={refreshKey}
        endpoint="/api/specialized/housing/regularization"
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
        filters={filters}
      />

      <FormModal
        title={selectedRegularization ? 'Editar Solicitação' : 'Nova Solicitação'}
        open={modalOpen}
        onOpenChange={setModalOpen}
        fields={formFields}
        initialData={selectedRegularization || {}}
        onSubmit={handleSubmit}
      />
    </ModuleLayout>
  )
}
