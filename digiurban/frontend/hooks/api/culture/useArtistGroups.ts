import { useState, useCallback } from 'react'

export interface ArtistGroup {
  id: string
  name: string
  artisticGenre: string
  foundationDate: string
  memberCount: number
  coordinator: string
  phone: string
  email: string
  address: string
  description: string
  status: 'active' | 'inactive' | 'suspended'
  registrationDate: string
  lastActivity: string
  achievements: string[]
  socialMedia?: {
    facebook?: string
    instagram?: string
    youtube?: string
  }
}

export interface CreateArtistGroupData {
  name: string
  artisticGenre: string
  foundationDate: string
  memberCount: number
  coordinator: string
  phone: string
  email: string
  address: string
  description: string
  achievements?: string[]
  socialMedia?: {
    facebook?: string
    instagram?: string
    youtube?: string
  }
}

export interface ArtistGroupFilters {
  artisticGenre?: string
  status?: string
  coordinator?: string
  memberCountRange?: { min: number; max: number }
  search?: string
}

// Mock data for demonstration
const mockGroups: ArtistGroup[] = [
  {
    id: '1',
    name: 'Grupo de Dança Folclórica Raízes',
    artisticGenre: 'Dança Folclórica',
    foundationDate: '2020-03-15',
    memberCount: 25,
    coordinator: 'Ana Beatriz Santos',
    phone: '(11) 98765-4321',
    email: 'raizes@email.com',
    address: 'Rua das Flores, 123 - Centro',
    description: 'Grupo dedicado à preservação das danças folclóricas brasileiras',
    status: 'active',
    registrationDate: '2023-01-10T10:00:00Z',
    lastActivity: '2024-01-20T15:30:00Z',
    achievements: ['1º lugar Festival Regional 2023', 'Participação em evento cultural estadual'],
    socialMedia: {
      facebook: 'facebook.com/gruporaizes',
      instagram: '@gruporaizes'
    }
  }
]

export function useArtistGroups() {
  const [groups, setGroups] = useState<ArtistGroup[]>(mockGroups)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchGroups = useCallback(async (filters?: ArtistGroupFilters) => {
    setLoading(true)
    setError(null)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      setGroups(mockGroups)
    } catch (err) {
      setError('Erro ao carregar grupos artísticos')
    } finally {
      setLoading(false)
    }
  }, [])

  const createGroup = useCallback(async (data: CreateArtistGroupData) => {
    setLoading(true)
    setError(null)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      const newGroup: ArtistGroup = {
        ...data,
        id: Date.now().toString(),
        status: 'active',
        registrationDate: new Date().toISOString(),
        lastActivity: new Date().toISOString(),
        achievements: data.achievements || []
      }
      setGroups(prev => [newGroup, ...prev])
      return newGroup
    } catch (err) {
      setError('Erro ao criar grupo artístico')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const updateGroup = useCallback(async (id: string, data: Partial<ArtistGroup>) => {
    setLoading(true)
    setError(null)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      setGroups(prev =>
        prev.map(group =>
          group.id === id
            ? { ...group, ...data, lastActivity: new Date().toISOString() }
            : group
        )
      )
    } catch (err) {
      setError('Erro ao atualizar grupo artístico')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const deleteGroup = useCallback(async (id: string) => {
    setLoading(true)
    setError(null)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      setGroups(prev => prev.filter(group => group.id !== id))
    } catch (err) {
      setError('Erro ao deletar grupo artístico')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    groups,
    loading,
    error,
    fetchGroups,
    createGroup,
    updateGroup,
    deleteGroup
  }
}