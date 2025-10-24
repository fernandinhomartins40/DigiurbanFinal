import { useState, useCallback } from 'react'

export interface CulturalWorkshop {
  id: string
  title: string
  description: string
  category: string
  instructor: string
  duration: number // em horas
  maxParticipants: number
  currentParticipants: number
  schedule: {
    dayOfWeek: string
    startTime: string
    endTime: string
  }[]
  startDate: string
  endDate: string
  location: string
  requirements: string
  materials: string
  price: number
  status: 'planned' | 'open_registration' | 'in_progress' | 'completed' | 'cancelled'
  createdAt: string
  updatedAt: string
}

export interface CreateCulturalWorkshopData {
  title: string
  description: string
  category: string
  instructor: string
  duration: number
  maxParticipants: number
  schedule: {
    dayOfWeek: string
    startTime: string
    endTime: string
  }[]
  startDate: string
  endDate: string
  location: string
  requirements: string
  materials: string
  price: number
}

export interface CulturalWorkshopFilters {
  category?: string
  instructor?: string
  status?: string
  priceRange?: { min: number; max: number }
  startDate?: string
  endDate?: string
  search?: string
}

// Mock data for demonstration
const mockWorkshops: CulturalWorkshop[] = [
  {
    id: '1',
    title: 'Oficina de Pintura em Tela',
    description: 'Aprenda técnicas básicas e avançadas de pintura em tela com tintas acrílicas',
    category: 'Artes Visuais',
    instructor: 'Carlos Eduardo Mendes',
    duration: 40,
    maxParticipants: 15,
    currentParticipants: 8,
    schedule: [
      {
        dayOfWeek: 'Segunda',
        startTime: '14:00',
        endTime: '16:00'
      },
      {
        dayOfWeek: 'Quarta',
        startTime: '14:00',
        endTime: '16:00'
      }
    ],
    startDate: '2024-02-05',
    endDate: '2024-03-30',
    location: 'Centro Cultural Municipal - Sala 3',
    requirements: 'Idade mínima: 16 anos',
    materials: 'Tintas, pincéis e telas fornecidos pela prefeitura',
    price: 0,
    status: 'open_registration',
    createdAt: '2024-01-10T10:00:00Z',
    updatedAt: '2024-01-15T14:30:00Z'
  }
]

export function useCulturalWorkshops() {
  const [workshops, setWorkshops] = useState<CulturalWorkshop[]>(mockWorkshops)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchWorkshops = useCallback(async (filters?: CulturalWorkshopFilters) => {
    setLoading(true)
    setError(null)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      setWorkshops(mockWorkshops)
    } catch (err) {
      setError('Erro ao carregar oficinas e cursos')
    } finally {
      setLoading(false)
    }
  }, [])

  const createWorkshop = useCallback(async (data: CreateCulturalWorkshopData) => {
    setLoading(true)
    setError(null)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      const newWorkshop: CulturalWorkshop = {
        ...data,
        id: Date.now().toString(),
        currentParticipants: 0,
        status: 'planned',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      setWorkshops(prev => [newWorkshop, ...prev])
      return newWorkshop
    } catch (err) {
      setError('Erro ao criar oficina/curso')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const updateWorkshop = useCallback(async (id: string, data: Partial<CulturalWorkshop>) => {
    setLoading(true)
    setError(null)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      setWorkshops(prev =>
        prev.map(workshop =>
          workshop.id === id
            ? { ...workshop, ...data, updatedAt: new Date().toISOString() }
            : workshop
        )
      )
    } catch (err) {
      setError('Erro ao atualizar oficina/curso')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const deleteWorkshop = useCallback(async (id: string) => {
    setLoading(true)
    setError(null)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      setWorkshops(prev => prev.filter(workshop => workshop.id !== id))
    } catch (err) {
      setError('Erro ao deletar oficina/curso')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    workshops,
    loading,
    error,
    fetchWorkshops,
    createWorkshop,
    updateWorkshop,
    deleteWorkshop
  }
}