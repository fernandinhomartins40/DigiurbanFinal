'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { ErrorAlert } from '@/components/ui/error-alert'
import {
  Heart,
  Users,
  FileText,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  Download,
  Filter,
  Search,
  Plus,
  Clock,
  UserCheck,
  Archive
} from 'lucide-react'
import { useAdminAuth, useAdminPermissions } from '@/contexts/AdminAuthContext'
import { useSocialAttendances } from '@/hooks/api/social/useSocialAttendances'
import { useSocialAttendanceStats } from '@/hooks/api/social/useSocialAttendanceStats'
import type {
  SocialAttendance,
  CreateSocialAttendanceData,
  AttendanceFilters,
  AttendanceType,
  AttendanceStatus,
  AttendancePriority
} from '@/types/social-assistance'

export default function AtendimentosAssistencia() {
  const { user } = useAdminAuth()
  const { hasPermission } = useAdminPermissions()

  const {
    attendances,
    loading: attendancesLoading,
    error: attendancesError,
    createAttendance,
    updateAttendance,
    deleteAttendance,
    refreshAttendances
  } = useSocialAttendances()

  const {
    stats,
    loading: statsLoading,
    error: statsError,
    refreshStats
  } = useSocialAttendanceStats()

  const [filters, setFilters] = useState<AttendanceFilters>({})
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedAttendance, setSelectedAttendance] = useState<SocialAttendance | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState<CreateSocialAttendanceData | null>(null)

  const loading = attendancesLoading || statsLoading
  const error = attendancesError || statsError

  const attendanceTypes: { value: AttendanceType; label: string }[] = [
    { value: 'INFORMATION', label: 'Informação' },
    { value: 'REGISTRATION', label: 'Cadastramento' },
    { value: 'FOLLOW_UP', label: 'Acompanhamento' },
    { value: 'COMPLAINT', label: 'Denúncia' },
    { value: 'BENEFIT_REQUEST', label: 'Solicitação de Benefício' },
    { value: 'EMERGENCY', label: 'Emergência' },
    { value: 'OTHER', label: 'Outros' }
  ]

  const priorityTypes: { value: AttendancePriority; label: string; color: string }[] = [
    { value: 'LOW', label: 'Baixa', color: 'bg-green-100 text-green-800' },
    { value: 'MEDIUM', label: 'Média', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'HIGH', label: 'Alta', color: 'bg-orange-100 text-orange-800' },
    { value: 'URGENT', label: 'Urgente', color: 'bg-red-100 text-red-800' }
  ]

  const statusTypes: { value: AttendanceStatus; label: string; color: string }[] = [
    { value: 'PENDING', label: 'Pendente', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'IN_PROGRESS', label: 'Em Atendimento', color: 'bg-blue-100 text-blue-800' },
    { value: 'COMPLETED', label: 'Concluído', color: 'bg-green-100 text-green-800' },
    { value: 'CANCELLED', label: 'Cancelado', color: 'bg-red-100 text-red-800' }
  ]

  const getStatusColor = (status: AttendanceStatus) => {
    const statusType = statusTypes.find(s => s.value === status)
    return statusType?.color || 'bg-gray-100 text-gray-800'
  }

  const getPriorityColor = (priority: AttendancePriority) => {
    const priorityType = priorityTypes.find(p => p.value === priority)
    return priorityType?.color || 'bg-gray-100 text-gray-800'
  }

  const getStatusLabel = (status: AttendanceStatus) => {
    const statusType = statusTypes.find(s => s.value === status)
    return statusType?.label || status
  }

  const getPriorityLabel = (priority: AttendancePriority) => {
    const priorityType = priorityTypes.find(p => p.value === priority)
    return priorityType?.label || priority
  }

  const getAttendanceTypeLabel = (type: AttendanceType) => {
    const attendanceType = attendanceTypes.find(t => t.value === type)
    return attendanceType?.label || type
  }

  const filteredAttendances = useMemo(() => {
    return attendances.filter(attendance => {
      const searchMatch = !searchTerm ||
        attendance.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        attendance.attendedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
        attendance.citizen?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        attendance.family?.responsibleName.toLowerCase().includes(searchTerm.toLowerCase())

      const typeMatch = !filters.attendanceType || attendance.attendanceType === filters.attendanceType
      const statusMatch = !filters.status || attendance.status === filters.status
      const priorityMatch = !filters.priority || attendance.priority === filters.priority
      const attendedByMatch = !filters.attendedBy || attendance.attendedBy.toLowerCase().includes(filters.attendedBy.toLowerCase())

      return searchMatch && typeMatch && statusMatch && priorityMatch && attendedByMatch
    })
  }, [attendances, searchTerm, filters])

  const handleSave = async () => {
    if (!formData) return

    try {
      if (selectedAttendance?.id) {
        await updateAttendance(selectedAttendance.id, formData)
      } else {
        await createAttendance(formData)
      }
      setSelectedAttendance(null)
      setFormData(null)
      setIsEditing(false)
    } catch (err) {
      console.error('Error saving attendance:', err)
    }
  }

  const handleNew = () => {
    setSelectedAttendance(null)
    setFormData({
      serviceUnitId: '',
      attendanceType: 'INFORMATION',
      date: new Date().toISOString().split('T')[0],
      time: new Date().toTimeString().slice(0, 5),
      duration: 60,
      attendedBy: user?.name || '',
      description: '',
      servicesProvided: [],
      referrals: [],
      followUpRequired: false,
      priority: 'MEDIUM'
    })
    setIsEditing(true)
  }

  const handleView = (attendance: SocialAttendance) => {
    setSelectedAttendance(attendance)
    setIsEditing(false)
  }

  if (!['admin', 'secretario', 'coordenador', 'tecnico'].some(permission => hasPermission(permission))) {
    return <div className="p-6">Acesso negado. Você não tem permissão para acessar esta página.</div>
  }

  if (loading) {
    return <div className="flex justify-center items-center h-96"><LoadingSpinner size="lg" /></div>
  }

  if (error) {
    return <ErrorAlert message={error} />
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Atendimentos - Assistência Social</h1>
          <p className="text-muted-foreground mt-2">
            PDV especializado para auxílios, denúncias de violação de direitos e acompanhamento social
          </p>
        </div>
        <Button onClick={handleNew}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Atendimento
        </Button>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.total || 0}</div>
            <p className="text-xs text-muted-foreground">Atendimentos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Abertos</CardTitle>
            <FileText className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats?.pending || 0}</div>
            <p className="text-xs text-muted-foreground">Aguardando</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Em Atendimento</CardTitle>
            <Users className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats?.inProgress || 0}</div>
            <p className="text-xs text-muted-foreground">Sendo atendidos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Urgentes</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats?.urgent || 0}</div>
            <p className="text-xs text-muted-foreground">Prioridade máxima</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Concluídos</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats?.completed || 0}</div>
            <p className="text-xs text-muted-foreground">Finalizados</p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="Buscar por protocolo, cidadão, demanda ou assistente..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <Button variant="outline">
              <Search className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-4">
            <Select value={filters.attendanceType || ''} onValueChange={(value) => setFilters({...filters, attendanceType: value as AttendanceType})}>
              <SelectTrigger>
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos</SelectItem>
                {attendanceTypes.map(type => (
                  <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filters.status || ''} onValueChange={(value) => setFilters({...filters, status: value as AttendanceStatus})}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos</SelectItem>
                {statusTypes.map(status => (
                  <SelectItem key={status.value} value={status.value}>{status.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filters.priority || ''} onValueChange={(value) => setFilters({...filters, priority: value as AttendancePriority})}>
              <SelectTrigger>
                <SelectValue placeholder="Prioridade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todas</SelectItem>
                {priorityTypes.map(priority => (
                  <SelectItem key={priority.value} value={priority.value}>{priority.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Input
              placeholder="Assistente Social"
              value={filters.attendedBy || ''}
              onChange={(e) => setFilters({...filters, attendedBy: e.target.value})}
            />

            <Button variant="outline">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Atendimentos */}
      <Card>
        <CardHeader>
          <CardTitle>Atendimentos ({filteredAttendances.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredAttendances.map((attendance) => (
              <div key={attendance.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold text-lg">
                      {attendance.citizen?.name || attendance.family?.responsibleName}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {getAttendanceTypeLabel(attendance.attendanceType)} - {attendance.date}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Badge className={getStatusColor(attendance.status)}>
                      {getStatusLabel(attendance.status)}
                    </Badge>
                    <Badge className={getPriorityColor(attendance.priority)}>
                      {getPriorityLabel(attendance.priority)}
                    </Badge>
                  </div>
                </div>

                <p className="text-sm mb-4">{attendance.description}</p>

                <div className="flex justify-between items-center">
                  <div className="text-sm text-muted-foreground">
                    Atendido por: {attendance.attendedBy}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleView(attendance)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Visualizar
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}