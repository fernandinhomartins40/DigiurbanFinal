import { useState, useCallback } from 'react'

export interface EnvironmentalComplaint {
  id: string
  complainantName: string
  phone: string
  email: string
  location: string
  complaintType: 'pollution' | 'illegal_disposal' | 'deforestation' | 'noise' | 'water_contamination' | 'air_pollution'
  description: string
  status: 'received' | 'investigating' | 'resolved' | 'dismissed'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  createdAt: string
  investigationNotes?: string
  responsible?: string
  resolutionDate?: string
}

export interface CreateEnvironmentalComplaintData {
  complainantName: string
  phone: string
  email: string
  location: string
  complaintType: 'pollution' | 'illegal_disposal' | 'deforestation' | 'noise' | 'water_contamination' | 'air_pollution'
  description: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
}

export interface EnvironmentalComplaintFilters {
  complaintType?: string
  status?: string
  priority?: string
  responsible?: string
  startDate?: string
  endDate?: string
  search?: string
}

const mockComplaints: EnvironmentalComplaint[] = [
  {
    id: '1',
    complainantName: 'Maria Santos',
    phone: '(11) 99999-9999',
    email: 'maria@email.com',
    location: 'Rua das Flores, 123',
    complaintType: 'illegal_disposal',
    description: 'Descarte irregular de lixo no terreno baldio',
    status: 'investigating',
    priority: 'medium',
    createdAt: '2024-01-15T10:30:00Z',
    responsible: 'João Silva',
    investigationNotes: 'Vistoria realizada, confirmado descarte irregular'
  }
]

export function useEnvironmentalComplaints() {
  const [complaints, setComplaints] = useState<EnvironmentalComplaint[]>(mockComplaints)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchComplaints = useCallback(async (filters?: EnvironmentalComplaintFilters) => {
    setLoading(true)
    setError(null)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      setComplaints(mockComplaints)
    } catch (err) {
      setError('Erro ao carregar denúncias ambientais')
    } finally {
      setLoading(false)
    }
  }, [])

  const createComplaint = useCallback(async (data: CreateEnvironmentalComplaintData) => {
    setLoading(true)
    setError(null)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      const newComplaint: EnvironmentalComplaint = {
        ...data,
        id: Date.now().toString(),
        status: 'received',
        createdAt: new Date().toISOString()
      }
      setComplaints(prev => [newComplaint, ...prev])
      return newComplaint
    } catch (err) {
      setError('Erro ao criar denúncia ambiental')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const updateComplaint = useCallback(async (id: string, data: Partial<EnvironmentalComplaint>) => {
    setLoading(true)
    setError(null)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      setComplaints(prev =>
        prev.map(complaint =>
          complaint.id === id ? { ...complaint, ...data } : complaint
        )
      )
    } catch (err) {
      setError('Erro ao atualizar denúncia ambiental')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    complaints,
    loading,
    error,
    fetchComplaints,
    createComplaint,
    updateComplaint
  }
}