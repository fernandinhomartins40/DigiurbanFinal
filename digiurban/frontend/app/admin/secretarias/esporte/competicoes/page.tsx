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

export default function CompeticoesPage() {
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedCompetition, setSelectedCompetition] = useState<any>(null)
  const [filters, setFilters] = useState({})
  const [refreshKey, setRefreshKey] = useState(0)

  const columns = [
    { key: 'name', label: 'Nome' },
    { key: 'sport', label: 'Modalidade' },
    {
      key: 'startDate',
      label: 'Início',
      render: (value: string) => new Date(value).toLocaleDateString('pt-BR'),
    },
    {
      key: 'endDate',
      label: 'Término',
      render: (value: string) => new Date(value).toLocaleDateString('pt-BR'),
    },
    {
      key: 'status',
      label: 'Status',
      render: (value: string) => {
        const variants: Record<string, any> = {
          PLANEJAMENTO: 'secondary',
          INSCRICOES_ABERTAS: 'default',
          EM_ANDAMENTO: 'default',
          FINALIZADA: 'default',
          CANCELADA: 'destructive',
        }
        return <Badge variant={variants[value] || 'secondary'}>{value}</Badge>
      },
    },
  ]

  const formFields = [
    {
      name: 'name',
      label: 'Nome da Competição',
      type: 'text' as const,
      required: true,
      placeholder: 'Nome da competição',
    },
    {
      name: 'sport',
      label: 'Modalidade',
      type: 'select' as const,
      required: true,
      options: [
        { value: 'FUTEBOL', label: 'Futebol' },
        { value: 'FUTSAL', label: 'Futsal' },
        { value: 'VOLEIBOL', label: 'Vôlei' },
        { value: 'BASQUETE', label: 'Basquete' },
        { value: 'HANDEBOL', label: 'Handebol' },
        { value: 'NATACAO', label: 'Natação' },
        { value: 'ATLETISMO', label: 'Atletismo' },
        { value: 'JUDO', label: 'Judô' },
        { value: 'OUTROS', label: 'Outros' },
      ],
    },
    {
      name: 'category',
      label: 'Categoria',
      type: 'select' as const,
      required: true,
      options: [
        { value: 'SUB_11', label: 'Sub-11' },
        { value: 'SUB_13', label: 'Sub-13' },
        { value: 'SUB_15', label: 'Sub-15' },
        { value: 'SUB_17', label: 'Sub-17' },
        { value: 'SUB_20', label: 'Sub-20' },
        { value: 'ADULTO', label: 'Adulto' },
        { value: 'MASTER', label: 'Master' },
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
      name: 'registrationDeadline',
      label: 'Prazo de Inscrição',
      type: 'date' as const,
      required: true,
    },
    {
      name: 'location',
      label: 'Local',
      type: 'text' as const,
      placeholder: 'Local da competição',
    },
    {
      name: 'maxTeams',
      label: 'Número Máximo de Equipes',
      type: 'number' as const,
      placeholder: '16',
    },
    {
      name: 'status',
      label: 'Status',
      type: 'select' as const,
      options: [
        { value: 'PLANEJAMENTO', label: 'Planejamento' },
        { value: 'INSCRICOES_ABERTAS', label: 'Inscrições Abertas' },
        { value: 'EM_ANDAMENTO', label: 'Em Andamento' },
        { value: 'FINALIZADA', label: 'Finalizada' },
        { value: 'CANCELADA', label: 'Cancelada' },
      ],
    },
    {
      name: 'description',
      label: 'Descrição',
      type: 'textarea' as const,
      placeholder: 'Descrição da competição',
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
        { value: 'PLANEJAMENTO', label: 'Planejamento' },
        { value: 'INSCRICOES_ABERTAS', label: 'Inscrições Abertas' },
        { value: 'EM_ANDAMENTO', label: 'Em Andamento' },
        { value: 'FINALIZADA', label: 'Finalizada' },
      ],
    },
  ]

  const handleSubmit = async (data: any) => {
    if (selectedCompetition?.id) {
      await sportsService.competitions.update(selectedCompetition.id, data)
    } else {
      await sportsService.competitions.create(data)
    }
    setRefreshKey((k) => k + 1)
    setSelectedCompetition(null)
  }

  const handleEdit = (competition: any) => {
    setSelectedCompetition(competition)
    setModalOpen(true)
  }

  const handleDelete = async (id: string) => {
    await sportsService.competitions.delete(id)
    setRefreshKey((k) => k + 1)
  }

  return (
    <ModuleLayout
      title="Competições"
      breadcrumb={[
        { label: 'Secretarias', href: '/admin/secretarias' },
        { label: 'Esportes', href: '/admin/secretarias/esporte' },
        { label: 'Competições' },
      ]}
      actions={
        <Button onClick={() => {
          setSelectedCompetition(null)
          setModalOpen(true)
        }}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Competição
        </Button>
      }
    >
      <FilterBar filters={filterConfig} onFilter={setFilters} />

      <DataTable
        key={refreshKey}
        endpoint="/api/specialized/sports/competitions"
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
        filters={filters}
      />

      <FormModal
        title={selectedCompetition ? 'Editar Competição' : 'Nova Competição'}
        open={modalOpen}
        onOpenChange={setModalOpen}
        fields={formFields}
        initialData={selectedCompetition || {}}
        onSubmit={handleSubmit}
      />
    </ModuleLayout>
  )
}
