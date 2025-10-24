import { useState, useCallback } from 'react'

export interface CulturalManifestation {
  id: string
  name: string
  type: 'folclore' | 'tradicao_popular' | 'festa_religiosa' | 'artesanato' | 'musica_tradicional' | 'danca_tipica' | 'culinaria_tipica'
  description: string
  origin: string
  historicalPeriod: string
  region: string
  characteristics: string[]
  practitioners: number
  status: 'ativa' | 'em_risco' | 'extinta' | 'revitalizada'
  preservationActions: string[]
  relatedEvents: string[]
  documentation: {
    photos: string[]
    videos: string[]
    audios: string[]
    texts: string[]
  }
  registrationDate: string
  lastUpdate: string
  responsible: string
}

export interface CreateCulturalManifestationData {
  name: string
  type: 'folclore' | 'tradicao_popular' | 'festa_religiosa' | 'artesanato' | 'musica_tradicional' | 'danca_tipica' | 'culinaria_tipica'
  description: string
  origin: string
  historicalPeriod: string
  region: string
  characteristics: string[]
  practitioners: number
  preservationActions?: string[]
  relatedEvents?: string[]
  responsible: string
}

export interface CulturalManifestationFilters {
  type?: string
  status?: string
  region?: string
  responsible?: string
  practitionersRange?: { min: number; max: number }
  search?: string
}

// Mock data for demonstration
const mockManifestations: CulturalManifestation[] = [
  {
    id: '1',
    name: 'Festa de São João',
    type: 'festa_religiosa',
    description: 'Festividade tradicional celebrada em junho com quadrilhas, fogueira e comidas típicas',
    origin: 'Tradição europeia adaptada ao Brasil colonial',
    historicalPeriod: 'Século XVII',
    region: 'Zona Rural',
    characteristics: ['Quadrilhas', 'Fogueira', 'Comidas típicas', 'Música caipira', 'Danças folclóricas'],
    practitioners: 500,
    status: 'ativa',
    preservationActions: ['Festival anual', 'Oficinas de quadrilha', 'Documentação audiovisual'],
    relatedEvents: ['Festival Junino Municipal', 'Concurso de Quadrilhas'],
    documentation: {
      photos: ['festa_sao_joao_2023_01.jpg', 'festa_sao_joao_2023_02.jpg'],
      videos: ['quadrilha_tradicional.mp4'],
      audios: ['musicas_juninas.mp3'],
      texts: ['historia_festa_sao_joao.pdf']
    },
    registrationDate: '2023-06-01T10:00:00Z',
    lastUpdate: '2024-01-15T14:30:00Z',
    responsible: 'Maria José da Silva'
  }
]

export function useCulturalManifestations() {
  const [manifestations, setManifestations] = useState<CulturalManifestation[]>(mockManifestations)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchManifestations = useCallback(async (filters?: CulturalManifestationFilters) => {
    setLoading(true)
    setError(null)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      setManifestations(mockManifestations)
    } catch (err) {
      setError('Erro ao carregar manifestações culturais')
    } finally {
      setLoading(false)
    }
  }, [])

  const createManifestation = useCallback(async (data: CreateCulturalManifestationData) => {
    setLoading(true)
    setError(null)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      const newManifestation: CulturalManifestation = {
        ...data,
        id: Date.now().toString(),
        status: 'ativa',
        preservationActions: data.preservationActions || [],
        relatedEvents: data.relatedEvents || [],
        documentation: {
          photos: [],
          videos: [],
          audios: [],
          texts: []
        },
        registrationDate: new Date().toISOString(),
        lastUpdate: new Date().toISOString()
      }
      setManifestations(prev => [newManifestation, ...prev])
      return newManifestation
    } catch (err) {
      setError('Erro ao criar manifestação cultural')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const updateManifestation = useCallback(async (id: string, data: Partial<CulturalManifestation>) => {
    setLoading(true)
    setError(null)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      setManifestations(prev =>
        prev.map(manifestation =>
          manifestation.id === id
            ? { ...manifestation, ...data, lastUpdate: new Date().toISOString() }
            : manifestation
        )
      )
    } catch (err) {
      setError('Erro ao atualizar manifestação cultural')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const deleteManifestation = useCallback(async (id: string) => {
    setLoading(true)
    setError(null)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      setManifestations(prev => prev.filter(manifestation => manifestation.id !== id))
    } catch (err) {
      setError('Erro ao deletar manifestação cultural')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    manifestations,
    loading,
    error,
    fetchManifestations,
    createManifestation,
    updateManifestation,
    deleteManifestation
  }
}