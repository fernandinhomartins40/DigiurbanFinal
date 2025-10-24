'use client'

import { useState } from 'react'
import { ModuleLayout } from '@/components/modules/ModuleLayout'
import { DataTable } from '@/components/modules/DataTable'
import { FormModal } from '@/components/modules/FormModal'
import { FilterBar } from '@/components/modules/FilterBar'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { healthService } from '@/lib/services/health.service'
import { Badge } from '@/components/ui/badge'

export default function ConsultasPage() {
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null)
  const [filters, setFilters] = useState({})
  const [refreshKey, setRefreshKey] = useState(0)

  const columns = [
    { key: 'protocol', label: 'Protocolo' },
    { key: 'patientName', label: 'Paciente' },
    { key: 'professional.name', label: 'Profissional', render: (_: any, row: any) => row.professional?.name || '-' },
    { key: 'specialty.name', label: 'Especialidade', render: (_: any, row: any) => row.specialty?.name || '-' },
    {
      key: 'appointmentDate',
      label: 'Data/Hora',
      render: (value: string) => new Date(value).toLocaleString('pt-BR'),
    },
    {
      key: 'type',
      label: 'Tipo',
      render: (value: string) => {
        const labels: Record<string, string> = {
          ROTINA: 'Rotina',
          RETORNO: 'Retorno',
          URGENCIA: 'Urgência',
        }
        return <Badge variant="outline">{labels[value] || value}</Badge>
      },
    },
    {
      key: 'status',
      label: 'Status',
      render: (value: string) => {
        const variants: Record<string, any> = {
          AGENDADA: 'secondary',
          CONFIRMADA: 'default',
          REALIZADA: 'default',
          CANCELADA: 'destructive',
          FALTOU: 'destructive',
        }
        return <Badge variant={variants[value] || 'secondary'}>{value}</Badge>
      },
    },
  ]

  const formFields = [
    {
      name: 'patientName',
      label: 'Nome do Paciente',
      type: 'text' as const,
      required: true,
      placeholder: 'Nome completo',
    },
    {
      name: 'patientCpf',
      label: 'CPF do Paciente',
      type: 'text' as const,
      required: true,
      placeholder: '000.000.000-00',
    },
    {
      name: 'patientPhone',
      label: 'Telefone',
      type: 'text' as const,
      required: true,
      placeholder: '(00) 00000-0000',
    },
    {
      name: 'professionalId',
      label: 'Profissional',
      type: 'text' as const,
      required: true,
      placeholder: 'ID do profissional',
    },
    {
      name: 'specialtyId',
      label: 'Especialidade',
      type: 'text' as const,
      required: true,
      placeholder: 'ID da especialidade',
    },
    {
      name: 'appointmentDate',
      label: 'Data e Hora',
      type: 'date' as const,
      required: true,
    },
    {
      name: 'type',
      label: 'Tipo de Consulta',
      type: 'select' as const,
      required: true,
      options: [
        { value: 'ROTINA', label: 'Rotina' },
        { value: 'RETORNO', label: 'Retorno' },
        { value: 'URGENCIA', label: 'Urgência' },
      ],
    },
    {
      name: 'status',
      label: 'Status',
      type: 'select' as const,
      options: [
        { value: 'AGENDADA', label: 'Agendada' },
        { value: 'CONFIRMADA', label: 'Confirmada' },
        { value: 'REALIZADA', label: 'Realizada' },
        { value: 'CANCELADA', label: 'Cancelada' },
        { value: 'FALTOU', label: 'Faltou' },
      ],
    },
    {
      name: 'observations',
      label: 'Observações',
      type: 'textarea' as const,
      placeholder: 'Observações sobre a consulta',
    },
  ]

  const filterConfig = [
    {
      type: 'search' as const,
      field: 'search',
      label: 'Buscar',
      placeholder: 'Buscar por paciente ou protocolo',
    },
    {
      type: 'select' as const,
      field: 'status',
      label: 'Status',
      options: [
        { value: 'AGENDADA', label: 'Agendada' },
        { value: 'CONFIRMADA', label: 'Confirmada' },
        { value: 'REALIZADA', label: 'Realizada' },
        { value: 'CANCELADA', label: 'Cancelada' },
      ],
    },
    {
      type: 'select' as const,
      field: 'type',
      label: 'Tipo',
      options: [
        { value: 'ROTINA', label: 'Rotina' },
        { value: 'RETORNO', label: 'Retorno' },
        { value: 'URGENCIA', label: 'Urgência' },
      ],
    },
    {
      type: 'date' as const,
      field: 'date',
      label: 'Data',
    },
  ]

  const handleSubmit = async (data: any) => {
    if (selectedAppointment?.id) {
      await healthService.appointments.update(selectedAppointment.id, data)
    } else {
      await healthService.appointments.create(data)
    }
    setRefreshKey((k) => k + 1)
    setSelectedAppointment(null)
  }

  const handleEdit = (appointment: any) => {
    setSelectedAppointment(appointment)
    setModalOpen(true)
  }

  const handleDelete = async (id: string) => {
    await healthService.appointments.delete(id)
    setRefreshKey((k) => k + 1)
  }

  return (
    <ModuleLayout
      title="Consultas Médicas"
      breadcrumb={[
        { label: 'Secretarias', href: '/admin/secretarias' },
        { label: 'Saúde', href: '/admin/secretarias/saude' },
        { label: 'Consultas Médicas' },
      ]}
      actions={
        <Button onClick={() => {
          setSelectedAppointment(null)
          setModalOpen(true)
        }}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Consulta
        </Button>
      }
    >
      <FilterBar filters={filterConfig} onFilter={setFilters} />

      <DataTable
        key={refreshKey}
        endpoint="/api/specialized/health/appointments"
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
        filters={filters}
      />

      <FormModal
        title={selectedAppointment ? 'Editar Consulta' : 'Nova Consulta'}
        open={modalOpen}
        onOpenChange={setModalOpen}
        fields={formFields}
        initialData={selectedAppointment || {}}
        onSubmit={handleSubmit}
      />
    </ModuleLayout>
  )
}
