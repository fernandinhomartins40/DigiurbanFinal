import { useState, useCallback } from 'react'

export interface EnvironmentalAttendance {
  id: string
  citizenName: string
  cpf: string
  phone: string
  email: string
  serviceType: 'licensing' | 'complaint' | 'consultation' | 'monitoring' | 'education'
  description: string
  status: 'pending' | 'in_progress' | 'resolved' | 'cancelled'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  attendant: string
  location?: string
  createdAt: string
  updatedAt: string
  resolvedAt?: string
  notes?: string
  attachments?: string[]
}

export interface CreateEnvironmentalAttendanceData {
  citizenName: string
  cpf: string
  phone: string
  email: string
  serviceType: 'licensing' | 'complaint' | 'consultation' | 'monitoring' | 'education'
  description: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  attendant: string
  location?: string
  notes?: string
}

export interface EnvironmentalAttendanceFilters {
  serviceType?: string
  status?: string
  priority?: string
  attendant?: string
  startDate?: string
  endDate?: string
  search?: string
}

// Mock data for demonstration
const mockAttendances: EnvironmentalAttendance[] = [
  {
    id: '1',
    citizenName: 'Carlos Oliveira',
    cpf: '987.654.321-00',
    phone: '(11) 91234-5678',
    email: 'carlos@email.com',
    serviceType: 'complaint',
    description: 'Denúncia de descarte irregular de lixo no córrego',
    status: 'in_progress',
    priority: 'high',
    attendant: 'Ana Maria Santos',
    location: 'Córrego das Flores - Bairro Jardim',
    createdAt: '2024-01-20T09:15:00Z',
    updatedAt: '2024-01-22T14:30:00Z',
    notes: 'Vistoria agendada para amanhã'
  }
]

export function useEnvironmentalAttendances() {
  const [attendances, setAttendances] = useState<EnvironmentalAttendance[]>(mockAttendances)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchAttendances = useCallback(async (filters?: EnvironmentalAttendanceFilters) => {
    setLoading(true)
    setError(null)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      setAttendances(mockAttendances)
    } catch (err) {
      setError('Erro ao carregar atendimentos ambientais')
    } finally {
      setLoading(false)
    }
  }, [])

  const createAttendance = useCallback(async (data: CreateEnvironmentalAttendanceData) => {
    setLoading(true)
    setError(null)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      const newAttendance: EnvironmentalAttendance = {
        ...data,
        id: Date.now().toString(),
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      setAttendances(prev => [newAttendance, ...prev])
      return newAttendance
    } catch (err) {
      setError('Erro ao criar atendimento ambiental')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const updateAttendance = useCallback(async (id: string, data: Partial<EnvironmentalAttendance>) => {
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
      setError('Erro ao atualizar atendimento ambiental')
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
      setError('Erro ao deletar atendimento ambiental')
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