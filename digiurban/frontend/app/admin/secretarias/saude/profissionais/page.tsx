'use client'
// @ts-nocheck

import { useState } from 'react'
import { ModuleLayout } from '@/components/modules/ModuleLayout'
import { DataTable } from '@/components/modules/DataTable'
import { FormModal } from '@/components/modules/FormModal'
import { FilterBar } from '@/components/modules/FilterBar'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { healthService } from '@/lib/services/health.service'
import { Badge } from '@/components/ui/badge'

export default function ProfissionaisPage() {
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedProfessional, setSelectedProfessional] = useState<any>(null)
  const [filters, setFilters] = useState({})
  const [refreshKey, setRefreshKey] = useState(0)

  const columns = [
    { key: 'name', label: 'Nome' },
    { key: 'registrationNumber', label: 'CRM/COREN' },
    { key: 'specialty.name', label: 'Especialidade', render: (_: any, row: any) => row.specialty?.name || '-' },
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
      placeholder: 'Nome do profissional',
    },
    {
      name: 'registrationNumber',
      label: 'CRM/COREN',
      type: 'text' as const,
      required: true,
      placeholder: 'Número do registro profissional',
    },
    {
      name: 'specialtyId',
      label: 'Especialidade',
      type: 'text' as const,
      required: true,
      placeholder: 'ID da especialidade',
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
      name: 'workSchedule',
      label: 'Horário de Trabalho',
      type: 'textarea' as const,
      placeholder: 'Ex: Segunda a Sexta, 08:00 às 17:00',
    },
  ]

  const filterConfig = [
    {
      type: 'search' as const,
      field: 'search',
      label: 'Buscar',
      placeholder: 'Buscar por nome ou registro',
    },
  ]

  const handleSubmit = async (data: any) => {
    if (selectedProfessional?.id) {
      await healthService.professionals.update(selectedProfessional.id, data)
    } else {
      await healthService.professionals.create(data)
    }
    setRefreshKey((k) => k + 1)
    setSelectedProfessional(null)
  }

  const handleEdit = (professional: any) => {
    setSelectedProfessional(professional)
    setModalOpen(true)
  }

  const handleDelete = async (id: string) => {
    await healthService.professionals.delete(id)
    setRefreshKey((k) => k + 1)
  }

  return (
    <ModuleLayout
      title="Profissionais de Saúde"
      breadcrumb={[
        { label: 'Secretarias', href: '/admin/secretarias' },
        { label: 'Saúde', href: '/admin/secretarias/saude' },
        { label: 'Profissionais de Saúde' },
      ]}
      actions={
        <Button onClick={() => {
          setSelectedProfessional(null)
          setModalOpen(true)
        }}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Profissional
        </Button>
      }
    >
      <FilterBar filters={filterConfig} onFilter={setFilters} />

      <DataTable
        key={refreshKey}
        endpoint="/api/specialized/health/professionals"
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
        filters={filters}
      />

      <FormModal
        title={selectedProfessional ? 'Editar Profissional' : 'Novo Profissional'}
        open={modalOpen}
        onOpenChange={setModalOpen}
        fields={formFields}
        initialData={selectedProfessional || {}}
        onSubmit={handleSubmit}
      />
    </ModuleLayout>
  )
}
