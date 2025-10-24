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

export default function InfraestruturaPage() {
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedFacility, setSelectedFacility] = useState<any>(null)
  const [filters, setFilters] = useState({})
  const [refreshKey, setRefreshKey] = useState(0)

  const columns = [
    { key: 'name', label: 'Nome' },
    { key: 'type', label: 'Tipo' },
    { key: 'address', label: 'Endereço' },
    { key: 'capacity', label: 'Capacidade' },
    {
      key: 'status',
      label: 'Status',
      render: (value: string) => {
        const variants: Record<string, any> = {
          OPERACIONAL: 'default',
          MANUTENCAO: 'secondary',
          REFORMA: 'secondary',
          INATIVO: 'destructive',
        }
        return <Badge variant={variants[value] || 'secondary'}>{value}</Badge>
      },
    },
  ]

  const formFields = [
    {
      name: 'name',
      label: 'Nome do Equipamento',
      type: 'text' as const,
      required: true,
      placeholder: 'Nome do equipamento',
    },
    {
      name: 'type',
      label: 'Tipo',
      type: 'select' as const,
      required: true,
      options: [
        { value: 'GINASIO', label: 'Ginásio' },
        { value: 'CAMPO_FUTEBOL', label: 'Campo de Futebol' },
        { value: 'QUADRA', label: 'Quadra Poliesportiva' },
        { value: 'PISCINA', label: 'Piscina' },
        { value: 'PISTA_ATLETISMO', label: 'Pista de Atletismo' },
        { value: 'ACADEMIA', label: 'Academia' },
        { value: 'OUTROS', label: 'Outros' },
      ],
    },
    {
      name: 'address',
      label: 'Endereço',
      type: 'textarea' as const,
      required: true,
      placeholder: 'Endereço completo',
    },
    {
      name: 'capacity',
      label: 'Capacidade',
      type: 'number' as const,
      placeholder: 'Número de pessoas',
    },
    {
      name: 'responsible',
      label: 'Responsável',
      type: 'text' as const,
      placeholder: 'Nome do responsável',
    },
    {
      name: 'phone',
      label: 'Telefone',
      type: 'text' as const,
      placeholder: '(00) 00000-0000',
    },
    {
      name: 'openingHours',
      label: 'Horário de Funcionamento',
      type: 'text' as const,
      placeholder: 'Ex: Seg-Sex 8h-22h',
    },
    {
      name: 'status',
      label: 'Status',
      type: 'select' as const,
      options: [
        { value: 'OPERACIONAL', label: 'Operacional' },
        { value: 'MANUTENCAO', label: 'Manutenção' },
        { value: 'REFORMA', label: 'Em Reforma' },
        { value: 'INATIVO', label: 'Inativo' },
      ],
    },
    {
      name: 'observations',
      label: 'Observações',
      type: 'textarea' as const,
      placeholder: 'Observações gerais',
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
        { value: 'GINASIO', label: 'Ginásio' },
        { value: 'CAMPO_FUTEBOL', label: 'Campo de Futebol' },
        { value: 'QUADRA', label: 'Quadra' },
        { value: 'PISCINA', label: 'Piscina' },
      ],
    },
  ]

  const handleSubmit = async (data: any) => {
    if (selectedFacility?.id) {
      await sportsService.infrastructure.update(selectedFacility.id, data)
    } else {
      await sportsService.infrastructure.create(data)
    }
    setRefreshKey((k) => k + 1)
    setSelectedFacility(null)
  }

  const handleEdit = (facility: any) => {
    setSelectedFacility(facility)
    setModalOpen(true)
  }

  const handleDelete = async (id: string) => {
    await sportsService.infrastructure.delete(id)
    setRefreshKey((k) => k + 1)
  }

  return (
    <ModuleLayout
      title="Infraestrutura Esportiva"
      breadcrumb={[
        { label: 'Secretarias', href: '/admin/secretarias' },
        { label: 'Esportes', href: '/admin/secretarias/esporte' },
        { label: 'Infraestrutura' },
      ]}
      actions={
        <Button onClick={() => {
          setSelectedFacility(null)
          setModalOpen(true)
        }}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Equipamento
        </Button>
      }
    >
      <FilterBar filters={filterConfig} onFilter={setFilters} />

      <DataTable
        key={refreshKey}
        endpoint="/api/specialized/sports/infrastructure"
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
        filters={filters}
      />

      <FormModal
        title={selectedFacility ? 'Editar Equipamento' : 'Novo Equipamento'}
        open={modalOpen}
        onOpenChange={setModalOpen}
        fields={formFields}
        initialData={selectedFacility || {}}
        onSubmit={handleSubmit}
      />
    </ModuleLayout>
  )
}
