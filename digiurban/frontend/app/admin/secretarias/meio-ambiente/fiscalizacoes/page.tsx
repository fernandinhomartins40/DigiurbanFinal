'use client'

import { useState } from 'react'
import { ModuleLayout } from '@/components/modules/ModuleLayout'
import { DataTable } from '@/components/modules/DataTable'
import { FormModal } from '@/components/modules/FormModal'
import { FilterBar } from '@/components/modules/FilterBar'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { environmentService } from '@/lib/services/environment.service'
import { Badge } from '@/components/ui/badge'

export default function FiscalizacoesPage() {
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedInspection, setSelectedInspection] = useState<any>(null)
  const [filters, setFilters] = useState({})
  const [refreshKey, setRefreshKey] = useState(0)

  const columns = [
    { key: 'protocol', label: 'Protocolo' },
    { key: 'inspectionType', label: 'Tipo' },
    { key: 'location', label: 'Local' },
    {
      key: 'inspectionDate',
      label: 'Data',
      render: (value: string) => new Date(value).toLocaleDateString('pt-BR'),
    },
    {
      key: 'status',
      label: 'Status',
      render: (value: string) => {
        const variants: Record<string, any> = {
          AGENDADA: 'secondary',
          EM_ANDAMENTO: 'default',
          CONCLUIDA: 'default',
          CANCELADA: 'destructive',
        }
        return <Badge variant={variants[value] || 'secondary'}>{value}</Badge>
      },
    },
    { key: 'inspector', label: 'Fiscal' },
  ]

  const formFields = [
    {
      name: 'inspectionType',
      label: 'Tipo de Fiscalização',
      type: 'select' as const,
      required: true,
      options: [
        { value: 'DESMATAMENTO', label: 'Desmatamento' },
        { value: 'POLUICAO_AGUA', label: 'Poluição da Água' },
        { value: 'POLUICAO_AR', label: 'Poluição do Ar' },
        { value: 'DESCARTE_IRREGULAR', label: 'Descarte Irregular' },
        { value: 'QUEIMADA', label: 'Queimada' },
        { value: 'LICENCIAMENTO', label: 'Licenciamento' },
        { value: 'OUTROS', label: 'Outros' },
      ],
    },
    {
      name: 'location',
      label: 'Local',
      type: 'text' as const,
      required: true,
      placeholder: 'Endereço ou coordenadas',
    },
    {
      name: 'inspectionDate',
      label: 'Data da Fiscalização',
      type: 'date' as const,
      required: true,
    },
    {
      name: 'inspectionTime',
      label: 'Horário',
      type: 'text' as const,
      placeholder: 'HH:MM',
    },
    {
      name: 'inspector',
      label: 'Fiscal Responsável',
      type: 'text' as const,
      required: true,
      placeholder: 'Nome do fiscal',
    },
    {
      name: 'complaintId',
      label: 'Denúncia Relacionada (ID)',
      type: 'text' as const,
      placeholder: 'ID da denúncia (se houver)',
    },
    {
      name: 'objective',
      label: 'Objetivo',
      type: 'textarea' as const,
      required: true,
      placeholder: 'Objetivo da fiscalização',
    },
    {
      name: 'status',
      label: 'Status',
      type: 'select' as const,
      options: [
        { value: 'AGENDADA', label: 'Agendada' },
        { value: 'EM_ANDAMENTO', label: 'Em Andamento' },
        { value: 'CONCLUIDA', label: 'Concluída' },
        { value: 'CANCELADA', label: 'Cancelada' },
      ],
    },
    {
      name: 'findings',
      label: 'Constatações',
      type: 'textarea' as const,
      placeholder: 'Resultados da fiscalização',
    },
    {
      name: 'actionsTaken',
      label: 'Ações Tomadas',
      type: 'textarea' as const,
      placeholder: 'Ações e medidas aplicadas',
    },
  ]

  const filterConfig = [
    {
      type: 'search' as const,
      field: 'search',
      label: 'Buscar',
      placeholder: 'Buscar por protocolo ou local',
    },
    {
      type: 'select' as const,
      field: 'status',
      label: 'Status',
      options: [
        { value: 'AGENDADA', label: 'Agendada' },
        { value: 'EM_ANDAMENTO', label: 'Em Andamento' },
        { value: 'CONCLUIDA', label: 'Concluída' },
      ],
    },
    {
      type: 'select' as const,
      field: 'inspectionType',
      label: 'Tipo',
      options: [
        { value: 'DESMATAMENTO', label: 'Desmatamento' },
        { value: 'POLUICAO_AGUA', label: 'Poluição da Água' },
        { value: 'DESCARTE_IRREGULAR', label: 'Descarte Irregular' },
      ],
    },
    {
      type: 'date' as const,
      field: 'inspectionDate',
      label: 'Data',
    },
  ]

  const handleSubmit = async (data: any) => {
    if (selectedInspection?.id) {
      await environmentService.inspections.update(selectedInspection.id, data)
    } else {
      await environmentService.inspections.create(data)
    }
    setRefreshKey((k) => k + 1)
    setSelectedInspection(null)
  }

  const handleEdit = (inspection: any) => {
    setSelectedInspection(inspection)
    setModalOpen(true)
  }

  const handleDelete = async (id: string) => {
    await environmentService.inspections.delete(id)
    setRefreshKey((k) => k + 1)
  }

  return (
    <ModuleLayout
      title="Fiscalizações Ambientais"
      breadcrumb={[
        { label: 'Secretarias', href: '/admin/secretarias' },
        { label: 'Meio Ambiente', href: '/admin/secretarias/meio-ambiente' },
        { label: 'Fiscalizações' },
      ]}
      actions={
        <Button onClick={() => {
          setSelectedInspection(null)
          setModalOpen(true)
        }}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Fiscalização
        </Button>
      }
    >
      <FilterBar filters={filterConfig} onFilter={setFilters} />

      <DataTable
        key={refreshKey}
        endpoint="/api/secretarias/environment/inspections"
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
        filters={filters}
      />

      <FormModal
        title={selectedInspection ? 'Editar Fiscalização' : 'Nova Fiscalização'}
        open={modalOpen}
        onOpenChange={setModalOpen}
        fields={formFields}
        initialData={selectedInspection || {}}
        onSubmit={handleSubmit}
      />
    </ModuleLayout>
  )
}
