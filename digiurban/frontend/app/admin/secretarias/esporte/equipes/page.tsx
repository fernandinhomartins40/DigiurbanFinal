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

export default function EquipesPage() {
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedTeam, setSelectedTeam] = useState<any>(null)
  const [filters, setFilters] = useState({})
  const [refreshKey, setRefreshKey] = useState(0)

  const columns = [
    { key: 'name', label: 'Nome da Equipe' },
    { key: 'sport', label: 'Modalidade' },
    { key: 'category', label: 'Categoria' },
    { key: 'coach', label: 'Treinador' },
    {
      key: 'active',
      label: 'Status',
      render: (value: boolean) => (
        <Badge variant={value ? 'default' : 'secondary'}>
          {value ? 'Ativa' : 'Inativa'}
        </Badge>
      ),
    },
  ]

  const formFields = [
    {
      name: 'name',
      label: 'Nome da Equipe',
      type: 'text' as const,
      required: true,
      placeholder: 'Nome da equipe',
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
      name: 'coach',
      label: 'Treinador',
      type: 'text' as const,
      required: true,
      placeholder: 'Nome do treinador',
    },
    {
      name: 'assistant',
      label: 'Auxiliar Técnico',
      type: 'text' as const,
      placeholder: 'Nome do auxiliar',
    },
    {
      name: 'trainingSchedule',
      label: 'Horário de Treinos',
      type: 'text' as const,
      placeholder: 'Ex: Seg/Qua/Sex 16h-18h',
    },
    {
      name: 'trainingLocation',
      label: 'Local de Treinos',
      type: 'text' as const,
      placeholder: 'Ginásio, campo, etc.',
    },
  ]

  const filterConfig = [
    {
      type: 'search' as const,
      field: 'search',
      label: 'Buscar',
      placeholder: 'Buscar por nome ou treinador',
    },
    {
      type: 'select' as const,
      field: 'sport',
      label: 'Modalidade',
      options: [
        { value: 'FUTEBOL', label: 'Futebol' },
        { value: 'FUTSAL', label: 'Futsal' },
        { value: 'VOLEIBOL', label: 'Vôlei' },
        { value: 'BASQUETE', label: 'Basquete' },
      ],
    },
  ]

  const handleSubmit = async (data: any) => {
    if (selectedTeam?.id) {
      await sportsService.teams.update(selectedTeam.id, data)
    } else {
      await sportsService.teams.create(data)
    }
    setRefreshKey((k) => k + 1)
    setSelectedTeam(null)
  }

  const handleEdit = (team: any) => {
    setSelectedTeam(team)
    setModalOpen(true)
  }

  const handleDelete = async (id: string) => {
    await sportsService.teams.delete(id)
    setRefreshKey((k) => k + 1)
  }

  return (
    <ModuleLayout
      title="Equipes Esportivas"
      breadcrumb={[
        { label: 'Secretarias', href: '/admin/secretarias' },
        { label: 'Esportes', href: '/admin/secretarias/esporte' },
        { label: 'Equipes' },
      ]}
      actions={
        <Button onClick={() => {
          setSelectedTeam(null)
          setModalOpen(true)
        }}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Equipe
        </Button>
      }
    >
      <FilterBar filters={filterConfig} onFilter={setFilters} />

      <DataTable
        key={refreshKey}
        endpoint="/api/specialized/sports/teams"
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
        filters={filters}
      />

      <FormModal
        title={selectedTeam ? 'Editar Equipe' : 'Nova Equipe'}
        open={modalOpen}
        onOpenChange={setModalOpen}
        fields={formFields}
        initialData={selectedTeam || {}}
        onSubmit={handleSubmit}
      />
    </ModuleLayout>
  )
}
