'use client'

import { useState } from 'react'
import { ModuleLayout } from '@/components/modules/ModuleLayout'
import { DataTable } from '@/components/modules/DataTable'
import { FormModal } from '@/components/modules/FormModal'
import { FilterBar } from '@/components/modules/FilterBar'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { sportsService } from '@/lib/services/sports.service'
import { Badge } from '@/components/ui/badge'

export default function EventosEsportePage() {
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<any>(null)
  const [filters, setFilters] = useState({})
  const [refreshKey, setRefreshKey] = useState(0)

  const columns = [
    { key: 'name', label: 'Nome' },
    { key: 'type', label: 'Tipo' },
    {
      key: 'date',
      label: 'Data',
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
          REALIZADO: 'default',
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
      name: 'type',
      label: 'Tipo de Evento',
      type: 'select' as const,
      required: true,
      options: [
        { value: 'TORNEIO', label: 'Torneio' },
        { value: 'CAMPEONATO', label: 'Campeonato' },
        { value: 'FESTIVAL', label: 'Festival Esportivo' },
        { value: 'CORRIDA', label: 'Corrida' },
        { value: 'GINCANA', label: 'Gincana' },
        { value: 'DEMONSTRACAO', label: 'Demonstração' },
        { value: 'OUTROS', label: 'Outros' },
      ],
    },
    {
      name: 'date',
      label: 'Data',
      type: 'date' as const,
      required: true,
    },
    {
      name: 'time',
      label: 'Horário',
      type: 'text' as const,
      placeholder: 'HH:MM',
    },
    {
      name: 'location',
      label: 'Local',
      type: 'text' as const,
      required: true,
      placeholder: 'Local do evento',
    },
    {
      name: 'expectedParticipants',
      label: 'Participantes Esperados',
      type: 'number' as const,
      placeholder: '100',
    },
    {
      name: 'organizer',
      label: 'Organizador',
      type: 'text' as const,
      placeholder: 'Nome do organizador',
    },
    {
      name: 'status',
      label: 'Status',
      type: 'select' as const,
      options: [
        { value: 'PLANEJAMENTO', label: 'Planejamento' },
        { value: 'CONFIRMADO', label: 'Confirmado' },
        { value: 'REALIZADO', label: 'Realizado' },
        { value: 'CANCELADO', label: 'Cancelado' },
      ],
    },
    {
      name: 'description',
      label: 'Descrição',
      type: 'textarea' as const,
      placeholder: 'Descrição do evento',
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
      field: 'type',
      label: 'Tipo',
      options: [
        { value: 'TORNEIO', label: 'Torneio' },
        { value: 'CAMPEONATO', label: 'Campeonato' },
        { value: 'FESTIVAL', label: 'Festival' },
      ],
    },
  ]

  const handleSubmit = async (data: any) => {
    if (selectedEvent?.id) {
      await sportsService.events.update(selectedEvent.id, data)
    } else {
      await sportsService.events.create(data)
    }
    setRefreshKey((k) => k + 1)
    setSelectedEvent(null)
  }

  const handleEdit = (event: any) => {
    setSelectedEvent(event)
    setModalOpen(true)
  }

  const handleDelete = async (id: string) => {
    await sportsService.events.delete(id)
    setRefreshKey((k) => k + 1)
  }

  return (
    <ModuleLayout
      title="Eventos Esportivos"
      breadcrumb={[
        { label: 'Secretarias', href: '/admin/secretarias' },
        { label: 'Esportes', href: '/admin/secretarias/esporte' },
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
        endpoint="/api/specialized/sports/events"
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
