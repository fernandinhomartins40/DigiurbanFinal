import { useState, useCallback } from 'react'

export interface CulturalAttendance {
  id: string
  citizenName: string
  cpf: string
  phone: string
  email: string
  serviceType: 'information' | 'registration' | 'support' | 'complaint'
  description: string
  status: 'pending' | 'in_progress' | 'resolved' | 'cancelled'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  attendant: string
  createdAt: string
  updatedAt: string
  resolvedAt?: string
  notes?: string
}

export interface CreateCulturalAttendanceData {
  citizenName: string
  cpf: string
  phone: string
  email: string
  serviceType: 'information' | 'registration' | 'support' | 'complaint'
  description: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  attendant: string
  notes?: string
}

export interface CulturalAttendanceFilters {
  serviceType?: string
  status?: string
  priority?: string
  attendant?: string
  startDate?: string
  endDate?: string
  search?: string
}

// Mock data for demonstration
const mockAttendances: CulturalAttendance[] = [
  {
    id: '1',
    citizenName: 'Maria Silva',
    cpf: '123.456.789-01',
    phone: '(11) 99999-9999',
    email: 'maria@email.com',
    serviceType: 'information',
    description: 'Informações sobre inscrição em oficinas culturais',
    status: 'resolved',
    priority: 'medium',
    attendant: 'João Santos',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T14:20:00Z',
    resolvedAt: '2024-01-15T14:20:00Z',
    notes: 'Informações fornecidas sobre cronograma de inscrições'
  }
]

export function useCulturalAttendances() {
  const [attendances, setAttendances] = useState<CulturalAttendance[]>(mockAttendances)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchAttendances = useCallback(async (filters?: CulturalAttendanceFilters) => {
    setLoading(true)
    setError(null)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      setAttendances(mockAttendances)
    } catch (err) {
      setError('Erro ao carregar atendimentos')
    } finally {
      setLoading(false)
    }
  }, [])

  const createAttendance = useCallback(async (data: CreateCulturalAttendanceData) => {
    setLoading(true)
    setError(null)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      const newAttendance: CulturalAttendance = {
        ...data,
        id: Date.now().toString(),
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      setAttendances(prev => [newAttendance, ...prev])
      return newAttendance
    } catch (err) {
      setError('Erro ao criar atendimento')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const updateAttendance = useCallback(async (id: string, data: Partial<CulturalAttendance>) => {
    setLoading(true)
    setError(null)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      setAttendances(prev =>
        prev.map(attendance =>
          attendance.id === id
            ? { ...attendance, ...data, updatedAt: new Date().toISOString() }
            : attendance
        )
      )
    } catch (err) {
      setError('Erro ao atualizar atendimento')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const deleteAttendance = useCallback(async (id: string) => {
    setLoading(true)
    setError(null)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      setAttendances(prev => prev.filter(attendance => attendance.id !== id))
    } catch (err) {
      setError('Erro ao deletar atendimento')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    attendances,
    loading,
    error,
    fetchAttendances,
    createAttendance,
    updateAttendance,
    deleteAttendance
  }
}