'use client'

import { useState } from 'react'
import { ModuleLayout } from '@/components/modules/ModuleLayout'
import { DataTable } from '@/components/modules/DataTable'
import { FormModal } from '@/components/modules/FormModal'
import { FilterBar } from '@/components/modules/FilterBar'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { socialAssistanceService } from '@/lib/services/social-assistance.service'
import { Badge } from '@/components/ui/badge'

export default function VisitasDomiciliaresPage() {
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedVisit, setSelectedVisit] = useState<any>(null)
  const [filters, setFilters] = useState({})
  const [refreshKey, setRefreshKey] = useState(0)

  const columns = [
    { key: 'protocol', label: 'Protocolo' },
    { key: 'family.responsibleName', label: 'Família', render: (_: any, row: any) => row.family?.responsibleName || '-' },
    { key: 'visitType', label: 'Tipo' },
    {
      key: 'visitDate',
      label: 'Data da Visita',
      render: (value: string) => new Date(value).toLocaleDateString('pt-BR'),
    },
    {
      key: 'status',
      label: 'Status',
      render: (value: string) => {
        const variants: Record<string, any> = {
          AGENDADA: 'secondary',
          REALIZADA: 'default',
          CANCELADA: 'destructive',
          REAGENDADA: 'default',
        }
        return <Badge variant={variants[value] || 'secondary'}>{value}</Badge>
      },
    },
    { key: 'socialWorker', label: 'Assistente Social' },
  ]

  const formFields = [
    {
      name: 'familyId',
      label: 'Família',
      type: 'text' as const,
      required: true,
      placeholder: 'ID da família',
    },
    {
      name: 'visitType',
      label: 'Tipo de Visita',
      type: 'select' as const,
      required: true,
      options: [
        { value: 'INICIAL', label: 'Inicial' },
        { value: 'ACOMPANHAMENTO', label: 'Acompanhamento' },
        { value: 'EMERGENCIAL', label: 'Emergencial' },
        { value: 'MONITORAMENTO', label: 'Monitoramento' },
        { value: 'VERIFICACAO', label: 'Verificação' },
      ],
    },
    {
      name: 'visitDate',
      label: 'Data da Visita',
      type: 'date' as const,
      required: true,
    },
    {
      name: 'visitTime',
      label: 'Horário',
      type: 'text' as const,
      placeholder: 'HH:MM',
    },
    {
      name: 'socialWorker',
      label: 'Assistente Social',
      type: 'text' as const,
      required: true,
      placeholder: 'Nome do assistente social',
    },
    {
      name: 'visitObjective',
      label: 'Objetivo da Visita',
      type: 'textarea' as const,
      required: true,
      placeholder: 'Descreva o objetivo da visita',
    },
    {
      name: 'status',
      label: 'Status',
      type: 'select' as const,
      options: [
        { value: 'AGENDADA', label: 'Agendada' },
        { value: 'REALIZADA', label: 'Realizada' },
        { value: 'CANCELADA', label: 'Cancelada' },
        { value: 'REAGENDADA', label: 'Reagendada' },
      ],
    },
    {
      name: 'visitReport',
      label: 'Relatório da Visita',
      type: 'textarea' as const,
      placeholder: 'Preencher após a realização da visita',
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
      placeholder: 'Buscar por protocolo ou família',
    },
    {
      type: 'select' as const,
      field: 'status',
      label: 'Status',
      options: [
        { value: 'AGENDADA', label: 'Agendada' },
        { value: 'REALIZADA', label: 'Realizada' },
        { value: 'CANCELADA', label: 'Cancelada' },
        { value: 'REAGENDADA', label: 'Reagendada' },
      ],
    },
    {
      type: 'select' as const,
      field: 'visitType',
      label: 'Tipo',
      options: [
        { value: 'INICIAL', label: 'Inicial' },
        { value: 'ACOMPANHAMENTO', label: 'Acompanhamento' },
        { value: 'EMERGENCIAL', label: 'Emergencial' },
      ],
    },
    {
      type: 'date' as const,
      field: 'visitDate',
      label: 'Data',
    },
  ]

  const handleSubmit = async (data: any) => {
    if (selectedVisit?.id) {
      await socialAssistanceService.homeVisits.update(selectedVisit.id, data)
    } else {
      await socialAssistanceService.homeVisits.create(data)
    }
    setRefreshKey((k) => k + 1)
    setSelectedVisit(null)
  }

  const handleEdit = (visit: any) => {
    setSelectedVisit(visit)
    setModalOpen(true)
  }

  const handleDelete = async (id: string) => {
    await socialAssistanceService.homeVisits.delete(id)
    setRefreshKey((k) => k + 1)
  }

  return (
    <ModuleLayout
      title="Visitas Domiciliares"
      breadcrumb={[
        { label: 'Secretarias', href: '/admin/secretarias' },
        { label: 'Assistência Social', href: '/admin/secretarias/assistencia-social' },
        { label: 'Visitas Domiciliares' },
      ]}
      actions={
        <Button onClick={() => {
          setSelectedVisit(null)
          setModalOpen(true)
        }}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Visita
        </Button>
      }
    >
      <FilterBar filters={filterConfig} onFilter={setFilters} />

      <DataTable
        key={refreshKey}
        endpoint="/api/secretarias/social-assistance/home-visits"
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
        filters={filters}
      />

      <FormModal
        title={selectedVisit ? 'Editar Visita' : 'Nova Visita'}
        open={modalOpen}
        onOpenChange={setModalOpen}
        fields={formFields}
        initialData={selectedVisit || {}}
        onSubmit={handleSubmit}
      />
    </ModuleLayout>
  )
}
