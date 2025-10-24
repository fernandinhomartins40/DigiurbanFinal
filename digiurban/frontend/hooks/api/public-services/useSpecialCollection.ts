'use client'

import { useState, useEffect, useCallback } from 'react'
import { apiClient } from '@/lib/auth'

interface SpecialCollection {
  id: string
  collectionType: 'ELECTRONIC_WASTE' | 'BULKY_ITEMS' | 'GARDEN_WASTE' | 'CONSTRUCTION_DEBRIS' | 'HAZARDOUS_WASTE' | 'TEXTILE' | 'OTHER'
  requesterId: string
  requesterName: string
  requesterPhone: string
  pickupAddress: string
  coordinates?: { lat: number; lng: number }
  itemDescription: string
  estimatedWeight: number
  estimatedVolume: number
  urgency: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  status: 'REQUESTED' | 'SCHEDULED' | 'COLLECTED' | 'CANCELLED'
  requestDate: string
  scheduledDate?: string
  scheduledTimeSlot?: string
  actualCollectionDate?: string
  actualCollectionTime?: string
  teamId?: string
  vehicleId?: string
  cost?: number
  photos?: string[]
  notes?: string
  collectedWeight?: number
  collectedVolume?: number
  disposalLocation?: string
  environmentalImpact?: {
    co2Reduced: number
    materialsRecycled: number
    wasteAverted: number
  }
  createdAt: string
  updatedAt: string
}

interface CreateSpecialCollectionData {
  collectionType: 'ELECTRONIC_WASTE' | 'BULKY_ITEMS' | 'GARDEN_WASTE' | 'CONSTRUCTION_DEBRIS' | 'HAZARDOUS_WASTE' | 'TEXTILE' | 'OTHER'
  requesterId: string
  requesterName: string
  requesterPhone: string
  pickupAddress: string
  coordinates?: { lat: number; lng: number }
  itemDescription: string
  estimatedWeight: number
  estimatedVolume: number
  urgency: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  photos?: string[]
  notes?: string
}

interface UseSpecialCollectionReturn {
  specialCollections: SpecialCollection[]
  loading: boolean
  error: string | null
  createCollection: (data: CreateSpecialCollectionData) => Promise<SpecialCollection>
  updateCollection: (id: string, data: Partial<CreateSpecialCollectionData>) => Promise<SpecialCollection>
  scheduleCollection: (id: string, date: string, timeSlot: string, teamId: string) => Promise<SpecialCollection>
  completeCollection: (id: string, data: { collectedWeight: number; collectedVolume: number; notes?: string }) => Promise<SpecialCollection>
  cancelCollection: (id: string, reason: string) => Promise<SpecialCollection>
  deleteCollection: (id: string) => Promise<void>
  getCollectionsByType: (type: string) => SpecialCollection[]
  getPendingCollections: () => SpecialCollection[]
  getScheduledCollections: () => SpecialCollection[]
  refreshCollections: () => Promise<void>
}

export function useSpecialCollection(): UseSpecialCollectionReturn {
  const [specialCollections, setSpecialCollections] = useState<SpecialCollection[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCollections = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await apiClient.get('/api/specialized/public-services/special-collection')
      setSpecialCollections(data.collections || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar coletas especiais')
    } finally {
      setLoading(false)
    }
  }, [])

  const createCollection = useCallback(async (data: CreateSpecialCollectionData): Promise<SpecialCollection> => {
    try {
      setError(null)
      const response = await apiClient.post('/api/specialized/public-services/special-collection', data)
      const newCollection = response.collection
      setSpecialCollections(prev => [newCollection, ...prev])
      return newCollection
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar coleta especial'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const updateCollection = useCallback(async (id: string, data: Partial<CreateSpecialCollectionData>): Promise<SpecialCollection> => {
    try {
      setError(null)
      const response = await apiClient.put(`/api/specialized/public-services/special-collection/${id}`, data)
      const updatedCollection = response.collection
      setSpecialCollections(prev => prev.map(collection => collection.id === id ? updatedCollection : collection))
      return updatedCollection
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar coleta'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const scheduleCollection = useCallback(async (id: string, date: string, timeSlot: string, teamId: string): Promise<SpecialCollection> => {
    return updateCollection(id, {
      status: 'SCHEDULED',
      scheduledDate: date,
      scheduledTimeSlot: timeSlot,
      teamId
    } as any)
  }, [updateCollection])

  const completeCollection = useCallback(async (id: string, data: { collectedWeight: number; collectedVolume: number; notes?: string }): Promise<SpecialCollection> => {
    return updateCollection(id, {
      status: 'COLLECTED',
      actualCollectionDate: new Date().toISOString().split('T')[0],
      actualCollectionTime: new Date().toISOString().split('T')[1].split('.')[0],
      collectedWeight: data.collectedWeight,
      collectedVolume: data.collectedVolume,
      notes: data.notes
    } as any)
  }, [updateCollection])

  const cancelCollection = useCallback(async (id: string, reason: string): Promise<SpecialCollection> => {
    return updateCollection(id, { status: 'CANCELLED', notes: reason } as any)
  }, [updateCollection])

  const deleteCollection = useCallback(async (id: string): Promise<void> => {
    try {
      setError(null)
      await apiClient.delete(`/api/specialized/public-services/special-collection/${id}`)
      setSpecialCollections(prev => prev.filter(collection => collection.id !== id))
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao excluir coleta'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const getCollectionsByType = useCallback((type: string) => {
    return specialCollections.filter(collection => collection.collectionType === type)
  }, [specialCollections])

  const getPendingCollections = useCallback(() => {
    return specialCollections.filter(collection => collection.status === 'REQUESTED')
  }, [specialCollections])

  const getScheduledCollections = useCallback(() => {
    return specialCollections.filter(collection => collection.status === 'SCHEDULED')
  }, [specialCollections])

  const refreshCollections = useCallback(async () => {
    await fetchCollections()
  }, [fetchCollections])

  useEffect(() => {
    fetchCollections()
  }, [fetchCollections])

  return {
    specialCollections,
    loading,
    error,
    createCollection,
    updateCollection,
    scheduleCollection,
    completeCollection,
    cancelCollection,
    deleteCollection,
    getCollectionsByType,
    getPendingCollections,
    getScheduledCollections,
    refreshCollections
  }
}