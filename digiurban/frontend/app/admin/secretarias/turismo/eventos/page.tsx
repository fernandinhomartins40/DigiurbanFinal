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

export default function EventosTurismoPage() {
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<any>(null)
  const [filters, setFilters] = useState({})
  const [refreshKey, setRefreshKey] = useState(0)

  const columns = [
    { key: 'name', label: 'Nome' },
    { key: 'eventType', label: 'Tipo' },
    {
      key: 'startDate',
      label: 'Data Início',
      render: (value: string) => new Date(value).toLocaleDateString('pt-BR'),
    },
    { key: 'location', label: 'Local' },
    {
      key: 'status',
      label: 'Status',
      render: (value: string) => {
        const variants: Record<string, any> = {
          PLANEJAMENTO: 'secondary',
          CONFIRMADO: 'default',
          EM_ANDAMENTO: 'default',
          FINALIZADO: 'secondary',
          CANCELADO: 'destructive',
        }
        return <Badge variant={variants[value] || 'secondary'}>{value}</Badge>
      },
    },
  ]

  const formFields = [
    {
      name: 'name',
      label: 'Nome do Evento',
      type: 'text' as const,
      required: true,
      placeholder: 'Nome do evento',
    },
    {
      name: 'eventType',
      label: 'Tipo de Evento',
      type: 'select' as const,
      required: true,
      options: [
        { value: 'FESTIVAL', label: 'Festival' },
        { value: 'FEIRA', label: 'Feira' },
        { value: 'SHOW', label: 'Show' },
        { value: 'EXPOSICAO', label: 'Exposição' },
        { value: 'CULTURAL', label: 'Cultural' },
        { value: 'GASTRONOMICO', label: 'Gastronômico' },
        { value: 'ESPORTIVO', label: 'Esportivo' },
        { value: 'RELIGIOSO', label: 'Religioso' },
      ],
    },
    {
      name: 'startDate',
      label: 'Data de Início',
      type: 'date' as const,
      required: true,
    },
    {
      name: 'endDate',
      label: 'Data de Término',
      type: 'date' as const,
      required: true,
    },
    {
      name: 'location',
      label: 'Local',
      type: 'text' as const,
      required: true,
      placeholder: 'Local do evento',
    },
    {
      name: 'expectedAttendees',
      label: 'Público Esperado',
      type: 'number' as const,
      placeholder: '1000',
    },
    {
      name: 'organizer',
      label: 'Organizador',
      type: 'text' as const,
      placeholder: 'Nome do organizador',
    },
    {
      name: 'ticketPrice',
      label: 'Valor do Ingresso',
      type: 'number' as const,
      placeholder: '0.00',
    },
    {
      name: 'description',
      label: 'Descrição',
      type: 'textarea' as const,
      required: true,
      placeholder: 'Descrição do evento',
    },
    {
      name: 'status',
      label: 'Status',
      type: 'select' as const,
      options: [
        { value: 'PLANEJAMENTO', label: 'Planejamento' },
        { value: 'CONFIRMADO', label: 'Confirmado' },
        { value: 'EM_ANDAMENTO', label: 'Em Andamento' },
        { value: 'FINALIZADO', label: 'Finalizado' },
        { value: 'CANCELADO', label: 'Cancelado' },
      ],
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
      field: 'eventType',
      label: 'Tipo',
      options: [
        { value: 'FESTIVAL', label: 'Festival' },
        { value: 'FEIRA', label: 'Feira' },
        { value: 'CULTURAL', label: 'Cultural' },
      ],
    },
    {
      type: 'select' as const,
      field: 'status',
      label: 'Status',
      options: [
        { value: 'CONFIRMADO', label: 'Confirmado' },
        { value: 'EM_ANDAMENTO', label: 'Em Andamento' },
      ],
    },
  ]

  const handleSubmit = async (data: any) => {
    if (selectedEvent?.id) {
      await tourismService.events.update(selectedEvent.id, data)
    } else {
      await tourismService.events.create(data)
    }
    setRefreshKey((k) => k + 1)
    setSelectedEvent(null)
  }

  const handleEdit = (event: any) => {
    setSelectedEvent(event)
    setModalOpen(true)
  }

  const handleDelete = async (id: string) => {
    await tourismService.events.delete(id)
    setRefreshKey((k) => k + 1)
  }

  return (
    <ModuleLayout
      title="Eventos Turísticos"
      breadcrumb={[
        { label: 'Secretarias', href: '/admin/secretarias' },
        { label: 'Turismo', href: '/admin/secretarias/turismo' },
        { label: 'Eventos' },
      ]}
      actions={
        <Button onClick={() => {
          setSelectedEvent(null)
          setModalOpen(true)
        }}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Evento
        </Button>
      }
    >
      <FilterBar filters={filterConfig} onFilter={setFilters} />

      <DataTable
        key={refreshKey}
        endpoint="/api/secretarias/tourism/events"
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
        filters={filters}
      />

      <FormModal
        title={selectedEvent ? 'Editar Evento' : 'Novo Evento'}
        open={modalOpen}
        onOpenChange={setModalOpen}
        fields={formFields}
        initialData={selectedEvent || {}}
        onSubmit={handleSubmit}
      />
    </ModuleLayout>
  )
}
