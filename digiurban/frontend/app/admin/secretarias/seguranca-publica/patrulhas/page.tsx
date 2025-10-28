'use client'

import { useState } from 'react'
import { ModuleLayout } from '@/components/modules/ModuleLayout'
import { DataTable } from '@/components/modules/DataTable'
import { FormModal } from '@/components/modules/FormModal'
import { FilterBar } from '@/components/modules/FilterBar'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { securityService } from '@/lib/services/security.service'
import { Badge } from '@/components/ui/badge'

export default function PatrulhasPage() {
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedPatrol, setSelectedPatrol] = useState<any>(null)
  const [filters, setFilters] = useState({})
  const [refreshKey, setRefreshKey] = useState(0)

  const columns = [
    { key: 'code', label: 'Código' },
    { key: 'team', label: 'Equipe' },
    { key: 'region', label: 'Região' },
    {
      key: 'startTime',
      label: 'Início',
      render: (value: string) => new Date(value).toLocaleString('pt-BR'),
    },
    {
      key: 'status',
      label: 'Status',
      render: (value: string) => {
        const variants: Record<string, any> = {
          EM_RONDA: 'default',
          ATENDENDO: 'secondary',
          DISPONIVEL: 'default',
          FINALIZADA: 'secondary',
        }
        return <Badge variant={variants[value] || 'secondary'}>{value}</Badge>
      },
    },
  ]

  const formFields = [
    {
      name: 'code',
      label: 'Código da Patrulha',
      type: 'text' as const,
      required: true,
      placeholder: 'Ex: GP-001',
    },
    {
      name: 'team',
      label: 'Equipe',
      type: 'text' as const,
      required: true,
      placeholder: 'Nomes dos guardas',
    },
    {
      name: 'vehicleId',
      label: 'Veículo (Placa)',
      type: 'text' as const,
      placeholder: 'AAA-0000',
    },
    {
      name: 'region',
      label: 'Região de Patrulhamento',
      type: 'text' as const,
      required: true,
      placeholder: 'Bairro ou região',
    },
    {
      name: 'patrolType',
      label: 'Tipo de Patrulha',
      type: 'select' as const,
      required: true,
      options: [
        { value: 'MOTORIZADA', label: 'Motorizada' },
        { value: 'PE', label: 'A Pé' },
        { value: 'BICICLETA', label: 'Bicicleta' },
        { value: 'MOTO', label: 'Motocicleta' },
      ],
    },
    {
      name: 'shift',
      label: 'Turno',
      type: 'select' as const,
      required: true,
      options: [
        { value: 'MANHA', label: 'Manhã' },
        { value: 'TARDE', label: 'Tarde' },
        { value: 'NOITE', label: 'Noite' },
        { value: 'MADRUGADA', label: 'Madrugada' },
      ],
    },
    {
      name: 'startTime',
      label: 'Horário de Início',
      type: 'text' as const,
      required: true,
      placeholder: 'YYYY-MM-DD HH:MM',
    },
    {
      name: 'endTime',
      label: 'Horário de Término',
      type: 'text' as const,
      placeholder: 'YYYY-MM-DD HH:MM',
    },
    {
      name: 'route',
      label: 'Rota',
      type: 'textarea' as const,
      placeholder: 'Descreva a rota de patrulhamento',
    },
    {
      name: 'status',
      label: 'Status',
      type: 'select' as const,
      options: [
        { value: 'EM_RONDA', label: 'Em Ronda' },
        { value: 'ATENDENDO', label: 'Atendendo Ocorrência' },
        { value: 'DISPONIVEL', label: 'Disponível' },
        { value: 'FINALIZADA', label: 'Finalizada' },
      ],
    },
    {
      name: 'observations',
      label: 'Observações',
      type: 'textarea' as const,
      placeholder: 'Observações do patrulhamento',
    },
  ]

  const filterConfig = [
    {
      type: 'search' as const,
      field: 'search',
      label: 'Buscar',
      placeholder: 'Buscar por código ou região',
    },
    {
      type: 'select' as const,
      field: 'status',
      label: 'Status',
      options: [
        { value: 'EM_RONDA', label: 'Em Ronda' },
        { value: 'ATENDENDO', label: 'Atendendo' },
        { value: 'DISPONIVEL', label: 'Disponível' },
      ],
    },
    {
      type: 'select' as const,
      field: 'shift',
      label: 'Turno',
      options: [
        { value: 'MANHA', label: 'Manhã' },
        { value: 'TARDE', label: 'Tarde' },
        { value: 'NOITE', label: 'Noite' },
      ],
    },
  ]

  const handleSubmit = async (data: any) => {
    if (selectedPatrol?.id) {
      await securityService.patrols.update(selectedPatrol.id, data)
    } else {
      await securityService.patrols.create(data)
    }
    setRefreshKey((k) => k + 1)
    setSelectedPatrol(null)
  }

  const handleEdit = (patrol: any) => {
    setSelectedPatrol(patrol)
    setModalOpen(true)
  }

  const handleDelete = async (id: string) => {
    await securityService.patrols.delete(id)
    setRefreshKey((k) => k + 1)
  }

  return (
    <ModuleLayout
      title="Patrulhas"
      breadcrumb={[
        { label: 'Secretarias', href: '/admin/secretarias' },
        { label: 'Segurança Pública', href: '/admin/secretarias/seguranca-publica' },
        { label: 'Patrulhas' },
      ]}
      actions={
        <Button onClick={() => {
          setSelectedPatrol(null)
          setModalOpen(true)
        }}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Patrulha
        </Button>
      }
    >
      <FilterBar filters={filterConfig} onFilter={setFilters} />

      <DataTable
        key={refreshKey}
        endpoint="/api/secretarias/security/patrols"
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
        filters={filters}
      />

      <FormModal
        title={selectedPatrol ? 'Editar Patrulha' : 'Nova Patrulha'}
        open={modalOpen}
        onOpenChange={setModalOpen}
        fields={formFields}
        initialData={selectedPatrol || {}}
        onSubmit={handleSubmit}
      />
    </ModuleLayout>
  )
}
