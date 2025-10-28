'use client'

import { useState } from 'react'
import { ModuleLayout } from '@/components/modules/ModuleLayout'
import { DataTable } from '@/components/modules/DataTable'
import { FormModal } from '@/components/modules/FormModal'
import { FilterBar } from '@/components/modules/FilterBar'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { socialAssistanceService } from '@/lib/services/social-assistance.service'
import { Badge } from '@/components/ui/badge'

export default function BeneficiosPage() {
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedBenefit, setSelectedBenefit] = useState<any>(null)
  const [filters, setFilters] = useState({})
  const [refreshKey, setRefreshKey] = useState(0)

  const columns = [
    { key: 'protocol', label: 'Protocolo' },
    { key: 'family.responsibleName', label: 'Família', render: (_: any, row: any) => row.family?.responsibleName || '-' },
    { key: 'benefitType', label: 'Tipo de Benefício' },
    {
      key: 'status',
      label: 'Status',
      render: (value: string) => {
        const variants: Record<string, any> = {
          PENDENTE: 'secondary',
          EM_ANALISE: 'default',
          APROVADO: 'default',
          NEGADO: 'destructive',
        }
        return <Badge variant={variants[value] || 'secondary'}>{value}</Badge>
      },
    },
    {
      key: 'requestDate',
      label: 'Data da Solicitação',
      render: (value: string) => new Date(value).toLocaleDateString('pt-BR'),
    },
  ]

  const formFields = [
    {
      name: 'familyId',
      label: 'Família',
      type: 'text' as const,
      required: true,
      placeholder: 'ID da família',
    },
    {
      name: 'benefitType',
      label: 'Tipo de Benefício',
      type: 'select' as const,
      required: true,
      options: [
        { value: 'CESTA_BASICA', label: 'Cesta Básica' },
        { value: 'AUXILIO_FUNERAL', label: 'Auxílio Funeral' },
        { value: 'AUXILIO_NATALIDADE', label: 'Auxílio Natalidade' },
        { value: 'AUXILIO_VULNERABILIDADE', label: 'Auxílio Vulnerabilidade Temporária' },
        { value: 'BPC', label: 'BPC' },
        { value: 'BOLSA_FAMILIA', label: 'Bolsa Família' },
        { value: 'OUTROS', label: 'Outros' },
      ],
    },
    {
      name: 'justification',
      label: 'Justificativa',
      type: 'textarea' as const,
      required: true,
      placeholder: 'Descreva o motivo da solicitação',
    },
    {
      name: 'status',
      label: 'Status',
      type: 'select' as const,
      options: [
        { value: 'PENDENTE', label: 'Pendente' },
        { value: 'EM_ANALISE', label: 'Em Análise' },
        { value: 'APROVADO', label: 'Aprovado' },
        { value: 'NEGADO', label: 'Negado' },
      ],
    },
    {
      name: 'analysisNotes',
      label: 'Observações da Análise',
      type: 'textarea' as const,
      placeholder: 'Observações do técnico responsável',
    },
  ]

  const filterConfig = [
    {
      type: 'search' as const,
      field: 'search',
      label: 'Buscar',
      placeholder: 'Buscar por protocolo',
    },
    {
      type: 'select' as const,
      field: 'status',
      label: 'Status',
      options: [
        { value: 'PENDENTE', label: 'Pendente' },
        { value: 'EM_ANALISE', label: 'Em Análise' },
        { value: 'APROVADO', label: 'Aprovado' },
        { value: 'NEGADO', label: 'Negado' },
      ],
    },
    {
      type: 'select' as const,
      field: 'benefitType',
      label: 'Tipo',
      options: [
        { value: 'CESTA_BASICA', label: 'Cesta Básica' },
        { value: 'AUXILIO_FUNERAL', label: 'Auxílio Funeral' },
        { value: 'BPC', label: 'BPC' },
        { value: 'BOLSA_FAMILIA', label: 'Bolsa Família' },
      ],
    },
  ]

  const handleSubmit = async (data: any) => {
    if (selectedBenefit?.id) {
      await socialAssistanceService.benefitRequests.update(selectedBenefit.id, data)
    } else {
      await socialAssistanceService.benefitRequests.create(data)
    }
    setRefreshKey((k) => k + 1)
    setSelectedBenefit(null)
  }

  const handleEdit = (benefit: any) => {
    setSelectedBenefit(benefit)
    setModalOpen(true)
  }

  const handleDelete = async (id: string) => {
    await socialAssistanceService.benefitRequests.delete(id)
    setRefreshKey((k) => k + 1)
  }

  return (
    <ModuleLayout
      title="Solicitações de Benefícios"
      breadcrumb={[
        { label: 'Secretarias', href: '/admin/secretarias' },
        { label: 'Assistência Social', href: '/admin/secretarias/assistencia-social' },
        { label: 'Solicitações de Benefícios' },
      ]}
      actions={
        <Button onClick={() => {
          setSelectedBenefit(null)
          setModalOpen(true)
        }}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Solicitação
        </Button>
      }
    >
      <FilterBar filters={filterConfig} onFilter={setFilters} />

      <DataTable
        key={refreshKey}
        endpoint="/api/secretarias/social-assistance/benefit-requests"
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
        filters={filters}
      />

      <FormModal
        title={selectedBenefit ? 'Editar Solicitação' : 'Nova Solicitação'}
        open={modalOpen}
        onOpenChange={setModalOpen}
        fields={formFields}
        initialData={selectedBenefit || {}}
        onSubmit={handleSubmit}
      />
    </ModuleLayout>
  )
}
