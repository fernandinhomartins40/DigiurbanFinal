'use client'

import { useState } from 'react'
import { ModuleLayout } from '@/components/modules/ModuleLayout'
import { DataTable } from '@/components/modules/DataTable'
import { FormModal } from '@/components/modules/FormModal'
import { FilterBar } from '@/components/modules/FilterBar'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { publicServicesService } from '@/lib/services/public-services.service'
import { Badge } from '@/components/ui/badge'

export default function SolicitacoesPage() {
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState<any>(null)
  const [filters, setFilters] = useState({})
  const [refreshKey, setRefreshKey] = useState(0)

  const columns = [
    { key: 'protocol', label: 'Protocolo' },
    { key: 'serviceType', label: 'Tipo de Serviço' },
    { key: 'citizenName', label: 'Solicitante' },
    { key: 'location', label: 'Local' },
    {
      key: 'requestDate',
      label: 'Data',
      render: (value: string) => new Date(value).toLocaleDateString('pt-BR'),
    },
    {
      key: 'status',
      label: 'Status',
      render: (value: string) => {
        const variants: Record<string, any> = {
          PENDENTE: 'secondary',
          EM_ANDAMENTO: 'default',
          CONCLUIDA: 'default',
          CANCELADA: 'destructive',
        }
        return <Badge variant={variants[value] || 'secondary'}>{value}</Badge>
      },
    },
  ]

  const formFields = [
    {
      name: 'serviceType',
      label: 'Tipo de Serviço',
      type: 'select' as const,
      required: true,
      options: [
        { value: 'LIMPEZA_URBANA', label: 'Limpeza Urbana' },
        { value: 'ILUMINACAO_PUBLICA', label: 'Iluminação Pública' },
        { value: 'COLETA_LIXO', label: 'Coleta de Lixo' },
        { value: 'PODA_ARVORE', label: 'Poda de Árvore' },
        { value: 'TAPA_BURACO', label: 'Tapa Buraco' },
        { value: 'LIMPEZA_BOCA_LOBO', label: 'Limpeza de Boca de Lobo' },
        { value: 'OUTROS', label: 'Outros' },
      ],
    },
    {
      name: 'citizenName',
      label: 'Nome do Solicitante',
      type: 'text' as const,
      required: true,
      placeholder: 'Nome completo',
    },
    {
      name: 'citizenPhone',
      label: 'Telefone',
      type: 'text' as const,
      required: true,
      placeholder: '(00) 00000-0000',
    },
    {
      name: 'citizenEmail',
      label: 'E-mail',
      type: 'email' as const,
      placeholder: 'email@exemplo.com',
    },
    {
      name: 'location',
      label: 'Local',
      type: 'text' as const,
      required: true,
      placeholder: 'Endereço ou referência',
    },
    {
      name: 'description',
      label: 'Descrição do Problema',
      type: 'textarea' as const,
      required: true,
      placeholder: 'Descreva detalhadamente o problema',
    },
    {
      name: 'urgency',
      label: 'Urgência',
      type: 'select' as const,
      options: [
        { value: 'BAIXA', label: 'Baixa' },
        { value: 'MEDIA', label: 'Média' },
        { value: 'ALTA', label: 'Alta' },
        { value: 'URGENTE', label: 'Urgente' },
      ],
    },
    {
      name: 'status',
      label: 'Status',
      type: 'select' as const,
      options: [
        { value: 'PENDENTE', label: 'Pendente' },
        { value: 'EM_ANDAMENTO', label: 'Em Andamento' },
        { value: 'CONCLUIDA', label: 'Concluída' },
        { value: 'CANCELADA', label: 'Cancelada' },
      ],
    },
    {
      name: 'assignedTeam',
      label: 'Equipe Responsável',
      type: 'text' as const,
      placeholder: 'Equipe designada',
    },
    {
      name: 'expectedDate',
      label: 'Previsão de Atendimento',
      type: 'date' as const,
    },
  ]

  const filterConfig = [
    {
      type: 'search' as const,
      field: 'search',
      label: 'Buscar',
      placeholder: 'Buscar por protocolo ou local',
    },
    {
      type: 'select' as const,
      field: 'status',
      label: 'Status',
      options: [
        { value: 'PENDENTE', label: 'Pendente' },
        { value: 'EM_ANDAMENTO', label: 'Em Andamento' },
        { value: 'CONCLUIDA', label: 'Concluída' },
      ],
    },
    {
      type: 'select' as const,
      field: 'serviceType',
      label: 'Tipo',
      options: [
        { value: 'LIMPEZA_URBANA', label: 'Limpeza Urbana' },
        { value: 'ILUMINACAO_PUBLICA', label: 'Iluminação' },
        { value: 'TAPA_BURACO', label: 'Tapa Buraco' },
      ],
    },
  ]

  const handleSubmit = async (data: any) => {
    if (selectedRequest?.id) {
      await publicServicesService.requests.update(selectedRequest.id, data)
    } else {
      await publicServicesService.requests.create(data)
    }
    setRefreshKey((k) => k + 1)
    setSelectedRequest(null)
  }

  const handleEdit = (request: any) => {
    setSelectedRequest(request)
    setModalOpen(true)
  }

  const handleDelete = async (id: string) => {
    await publicServicesService.requests.delete(id)
    setRefreshKey((k) => k + 1)
  }

  return (
    <ModuleLayout
      title="Solicitações de Serviços"
      breadcrumb={[
        { label: 'Secretarias', href: '/admin/secretarias' },
        { label: 'Serviços Públicos', href: '/admin/secretarias/servicos-publicos' },
        { label: 'Solicitações' },
      ]}
      actions={
        <Button onClick={() => {
          setSelectedRequest(null)
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
        endpoint="/api/secretarias/public-services/requests"
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
        filters={filters}
      />

      <FormModal
        title={selectedRequest ? 'Editar Solicitação' : 'Nova Solicitação'}
        open={modalOpen}
        onOpenChange={setModalOpen}
        fields={formFields}
        initialData={selectedRequest || {}}
        onSubmit={handleSubmit}
      />
    </ModuleLayout>
  )
}
