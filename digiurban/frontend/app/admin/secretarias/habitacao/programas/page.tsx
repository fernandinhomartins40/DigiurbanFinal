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

export default function ProgramasHabitacaoPage() {
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedProgram, setSelectedProgram] = useState<any>(null)
  const [filters, setFilters] = useState({})
  const [refreshKey, setRefreshKey] = useState(0)

  const columns = [
    { key: 'name', label: 'Nome' },
    { key: 'type', label: 'Tipo' },
    { key: 'vacancies', label: 'Vagas' },
    {
      key: 'status',
      label: 'Status',
      render: (value: string) => {
        const variants: Record<string, any> = {
          ABERTO: 'default',
          FECHADO: 'secondary',
          EM_ANDAMENTO: 'default',
          CONCLUIDO: 'default',
        }
        return <Badge variant={variants[value] || 'secondary'}>{value}</Badge>
      },
    },
  ]

  const formFields = [
    {
      name: 'name',
      label: 'Nome do Programa',
      type: 'text' as const,
      required: true,
      placeholder: 'Nome do programa habitacional',
    },
    {
      name: 'type',
      label: 'Tipo',
      type: 'select' as const,
      required: true,
      options: [
        { value: 'MINHA_CASA_MINHA_VIDA', label: 'Minha Casa Minha Vida' },
        { value: 'LOTES_URBANIZADOS', label: 'Lotes Urbanizados' },
        { value: 'REGULARIZACAO_FUNDIARIA', label: 'Regularização Fundiária' },
        { value: 'REFORMA_HABITACIONAL', label: 'Reforma Habitacional' },
        { value: 'ALUGUEL_SOCIAL', label: 'Aluguel Social' },
        { value: 'OUTROS', label: 'Outros' },
      ],
    },
    {
      name: 'vacancies',
      label: 'Número de Vagas',
      type: 'number' as const,
      required: true,
      placeholder: '100',
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
    },
    {
      name: 'eligibilityCriteria',
      label: 'Critérios de Elegibilidade',
      type: 'textarea' as const,
      placeholder: 'Descreva os critérios',
    },
    {
      name: 'status',
      label: 'Status',
      type: 'select' as const,
      options: [
        { value: 'ABERTO', label: 'Aberto' },
        { value: 'FECHADO', label: 'Fechado' },
        { value: 'EM_ANDAMENTO', label: 'Em Andamento' },
        { value: 'CONCLUIDO', label: 'Concluído' },
      ],
    },
    {
      name: 'description',
      label: 'Descrição',
      type: 'textarea' as const,
      placeholder: 'Descrição do programa',
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
      field: 'status',
      label: 'Status',
      options: [
        { value: 'ABERTO', label: 'Aberto' },
        { value: 'FECHADO', label: 'Fechado' },
        { value: 'EM_ANDAMENTO', label: 'Em Andamento' },
      ],
    },
  ]

  const handleSubmit = async (data: any) => {
    if (selectedProgram?.id) {
      await housingService.programs.update(selectedProgram.id, data)
    } else {
      await housingService.programs.create(data)
    }
    setRefreshKey((k) => k + 1)
    setSelectedProgram(null)
  }

  const handleEdit = (program: any) => {
    setSelectedProgram(program)
    setModalOpen(true)
  }

  const handleDelete = async (id: string) => {
    await housingService.programs.delete(id)
    setRefreshKey((k) => k + 1)
  }

  return (
    <ModuleLayout
      title="Programas Habitacionais"
      breadcrumb={[
        { label: 'Secretarias', href: '/admin/secretarias' },
        { label: 'Habitação', href: '/admin/secretarias/habitacao' },
        { label: 'Programas' },
      ]}
      actions={
        <Button onClick={() => {
          setSelectedProgram(null)
          setModalOpen(true)
        }}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Programa
        </Button>
      }
    >
      <FilterBar filters={filterConfig} onFilter={setFilters} />

      <DataTable
        key={refreshKey}
        endpoint="/api/specialized/housing/programs"
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
        filters={filters}
      />

      <FormModal
        title={selectedProgram ? 'Editar Programa' : 'Novo Programa'}
        open={modalOpen}
        onOpenChange={setModalOpen}
        fields={formFields}
        initialData={selectedProgram || {}}
        onSubmit={handleSubmit}
      />
    </ModuleLayout>
  )
}
