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

export default function AtletasPage() {
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedAthlete, setSelectedAthlete] = useState<any>(null)
  const [filters, setFilters] = useState({})
  const [refreshKey, setRefreshKey] = useState(0)

  const columns = [
    { key: 'name', label: 'Nome' },
    { key: 'cpf', label: 'CPF' },
    { key: 'team.name', label: 'Equipe', render: (_: any, row: any) => row.team?.name || '-' },
    {
      key: 'birthDate',
      label: 'Data Nasc.',
      render: (value: string) => new Date(value).toLocaleDateString('pt-BR'),
    },
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
      placeholder: 'Nome do atleta',
    },
    {
      name: 'cpf',
      label: 'CPF',
      type: 'text' as const,
      required: true,
      placeholder: '000.000.000-00',
    },
    {
      name: 'rg',
      label: 'RG',
      type: 'text' as const,
      placeholder: 'Número do RG',
    },
    {
      name: 'birthDate',
      label: 'Data de Nascimento',
      type: 'date' as const,
      required: true,
    },
    {
      name: 'phone',
      label: 'Telefone',
      type: 'text' as const,
      required: true,
      placeholder: '(00) 00000-0000',
    },
    {
      name: 'email',
      label: 'E-mail',
      type: 'email' as const,
      placeholder: 'email@exemplo.com',
    },
    {
      name: 'address',
      label: 'Endereço',
      type: 'textarea' as const,
      placeholder: 'Endereço completo',
    },
    {
      name: 'teamId',
      label: 'Equipe',
      type: 'text' as const,
      placeholder: 'ID da equipe',
    },
    {
      name: 'position',
      label: 'Posição',
      type: 'text' as const,
      placeholder: 'Ex: Atacante, Goleiro, etc.',
    },
    {
      name: 'jerseyNumber',
      label: 'Número da Camisa',
      type: 'number' as const,
      placeholder: '10',
    },
    {
      name: 'medicalClearance',
      label: 'Atestado Médico Válido',
      type: 'select' as const,
      options: [
        { value: 'true', label: 'Sim' },
        { value: 'false', label: 'Não' },
      ],
    },
  ]

  const filterConfig = [
    {
      type: 'search' as const,
      field: 'search',
      label: 'Buscar',
      placeholder: 'Buscar por nome ou CPF',
    },
  ]

  const handleSubmit = async (data: any) => {
    if (selectedAthlete?.id) {
      await sportsService.athletes.update(selectedAthlete.id, data)
    } else {
      await sportsService.athletes.create(data)
    }
    setRefreshKey((k) => k + 1)
    setSelectedAthlete(null)
  }

  const handleEdit = (athlete: any) => {
    setSelectedAthlete(athlete)
    setModalOpen(true)
  }

  const handleDelete = async (id: string) => {
    await sportsService.athletes.delete(id)
    setRefreshKey((k) => k + 1)
  }

  return (
    <ModuleLayout
      title="Atletas"
      breadcrumb={[
        { label: 'Secretarias', href: '/admin/secretarias' },
        { label: 'Esportes', href: '/admin/secretarias/esporte' },
        { label: 'Atletas' },
      ]}
      actions={
        <Button onClick={() => {
          setSelectedAthlete(null)
          setModalOpen(true)
        }}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Atleta
        </Button>
      }
    >
      <FilterBar filters={filterConfig} onFilter={setFilters} />

      <DataTable
        key={refreshKey}
        endpoint="/api/specialized/sports/athletes"
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
        filters={filters}
      />

      <FormModal
        title={selectedAthlete ? 'Editar Atleta' : 'Novo Atleta'}
        open={modalOpen}
        onOpenChange={setModalOpen}
        fields={formFields}
        initialData={selectedAthlete || {}}
        onSubmit={handleSubmit}
      />
    </ModuleLayout>
  )
}
