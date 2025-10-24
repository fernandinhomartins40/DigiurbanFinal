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

export default function VacinacoesPage() {
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedVaccination, setSelectedVaccination] = useState<any>(null)
  const [filters, setFilters] = useState({})
  const [refreshKey, setRefreshKey] = useState(0)

  const columns = [
    { key: 'protocol', label: 'Protocolo' },
    { key: 'patientName', label: 'Paciente' },
    { key: 'vaccine.name', label: 'Vacina', render: (_: any, row: any) => row.vaccine?.name || '-' },
    { key: 'dose', label: 'Dose' },
    {
      key: 'applicationDate',
      label: 'Data',
      render: (value: string) => new Date(value).toLocaleDateString('pt-BR'),
    },
    { key: 'healthUnit', label: 'Unidade' },
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
      label: 'CPF',
      type: 'text' as const,
      required: true,
      placeholder: '000.000.000-00',
    },
    {
      name: 'patientBirthDate',
      label: 'Data de Nascimento',
      type: 'date' as const,
      required: true,
    },
    {
      name: 'vaccineId',
      label: 'Vacina',
      type: 'text' as const,
      required: true,
      placeholder: 'ID da vacina',
    },
    {
      name: 'dose',
      label: 'Dose',
      type: 'select' as const,
      required: true,
      options: [
        { value: '1ª DOSE', label: '1ª Dose' },
        { value: '2ª DOSE', label: '2ª Dose' },
        { value: '3ª DOSE', label: '3ª Dose' },
        { value: 'REFORÇO', label: 'Reforço' },
        { value: 'DOSE ÚNICA', label: 'Dose Única' },
      ],
    },
    {
      name: 'applicationDate',
      label: 'Data de Aplicação',
      type: 'date' as const,
      required: true,
    },
    {
      name: 'healthUnit',
      label: 'Unidade de Saúde',
      type: 'text' as const,
      required: true,
      placeholder: 'Nome da unidade',
    },
    {
      name: 'professionalName',
      label: 'Profissional Aplicador',
      type: 'text' as const,
      required: true,
      placeholder: 'Nome do profissional',
    },
    {
      name: 'lot',
      label: 'Lote da Vacina',
      type: 'text' as const,
      required: true,
      placeholder: 'Número do lote',
    },
    {
      name: 'manufacturer',
      label: 'Fabricante',
      type: 'text' as const,
      placeholder: 'Nome do fabricante',
    },
    {
      name: 'nextDoseDate',
      label: 'Próxima Dose (se aplicável)',
      type: 'date' as const,
    },
    {
      name: 'observations',
      label: 'Observações',
      type: 'textarea' as const,
      placeholder: 'Observações sobre a aplicação',
    },
  ]

  const filterConfig = [
    {
      type: 'search' as const,
      field: 'search',
      label: 'Buscar',
      placeholder: 'Buscar por protocolo ou paciente',
    },
    {
      type: 'select' as const,
      field: 'dose',
      label: 'Dose',
      options: [
        { value: '1ª DOSE', label: '1ª Dose' },
        { value: '2ª DOSE', label: '2ª Dose' },
        { value: 'REFORÇO', label: 'Reforço' },
      ],
    },
    {
      type: 'date' as const,
      field: 'applicationDate',
      label: 'Data',
    },
  ]

  const handleSubmit = async (data: any) => {
    if (selectedVaccination?.id) {
      await healthService.vaccinations.update(selectedVaccination.id, data)
    } else {
      await healthService.vaccinations.create(data)
    }
    setRefreshKey((k) => k + 1)
    setSelectedVaccination(null)
  }

  const handleEdit = (vaccination: any) => {
    setSelectedVaccination(vaccination)
    setModalOpen(true)
  }

  const handleDelete = async (id: string) => {
    await healthService.vaccinations.delete(id)
    setRefreshKey((k) => k + 1)
  }

  return (
    <ModuleLayout
      title="Vacinações"
      breadcrumb={[
        { label: 'Secretarias', href: '/admin/secretarias' },
        { label: 'Saúde', href: '/admin/secretarias/saude' },
        { label: 'Vacinações' },
      ]}
      actions={
        <Button onClick={() => {
          setSelectedVaccination(null)
          setModalOpen(true)
        }}>
          <Plus className="h-4 w-4 mr-2" />
          Registrar Vacinação
        </Button>
      }
    >
      <FilterBar filters={filterConfig} onFilter={setFilters} />

      <DataTable
        key={refreshKey}
        endpoint="/api/specialized/health/vaccinations"
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
        filters={filters}
      />

      <FormModal
        title={selectedVaccination ? 'Editar Vacinação' : 'Registrar Vacinação'}
        open={modalOpen}
        onOpenChange={setModalOpen}
        fields={formFields}
        initialData={selectedVaccination || {}}
        onSubmit={handleSubmit}
      />
    </ModuleLayout>
  )
}
