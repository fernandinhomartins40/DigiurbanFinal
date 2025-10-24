import { useState, useEffect, useCallback } from 'react'
import { apiClient } from '@/lib/api'

export interface RuralProducer {
  id: string
  code: string
  name: string
  cpf_cnpj: string
  type: 'INDIVIDUAL' | 'LEGAL_ENTITY' | 'COOPERATIVE' | 'ASSOCIATION'
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'PENDING_REGISTRATION'
  contact: {
    email: string
    phone: string
    mobile: string
    address: {
      street: string
      number: string
      complement?: string
      neighborhood: string
      city: string
      state: string
      zipCode: string
      coordinates?: {
        latitude: number
        longitude: number
      }
    }
  }
  properties: Array<{
    id: string
    name: string
    size: number
    location: {
      municipality: string
      district: string
      coordinates: {
        latitude: number
        longitude: number
      }
    }
    land_use: 'AGRICULTURE' | 'LIVESTOCK' | 'MIXED' | 'FORESTRY' | 'CONSERVATION'
    certification: Array<{
      type: 'ORGANIC' | 'FAIR_TRADE' | 'RAINFOREST' | 'UTZ' | 'GLOBAL_GAP'
      number: string
      issuer: string
      valid_until: string
    }>
  }>
  activities: Array<{
    type: 'CROP' | 'LIVESTOCK' | 'AQUACULTURE' | 'FORESTRY' | 'AGROTOURISM'
    description: string
    area: number
    production_capacity: number
    seasonal: boolean
  }>
  economic: {
    annual_revenue: number
    employee_count: number
    family_members_involved: number
    production_value: number
    export_percentage: number
  }
  technical: {
    irrigation_system: boolean
    mechanization_level: 'LOW' | 'MEDIUM' | 'HIGH'
    storage_capacity: number
    processing_facilities: boolean
    technical_assistance: boolean
  }
  environmental: {
    environmental_license: boolean
    permanent_preservation_area: number
    legal_reserve_area: number
    water_resources: Array<{
      type: 'WELL' | 'SPRING' | 'RIVER' | 'LAKE'
      usage_permit: boolean
      flow_rate: number
    }>
  }
  registration: {
    car_number?: string
    incra_code?: string
    dap_number?: string
    registration_date: string
    last_update: string
    validity: string
  }
  created_at: string
  updated_at: string
}

export interface CreateRuralProducerData {
  name: string
  cpf_cnpj: string
  type: 'INDIVIDUAL' | 'LEGAL_ENTITY' | 'COOPERATIVE' | 'ASSOCIATION'
  contact: {
    email: string
    phone: string
    mobile: string
    address: {
      street: string
      number: string
      complement?: string
      neighborhood: string
      city: string
      state: string
      zipCode: string
      coordinates?: {
        latitude: number
        longitude: number
      }
    }
  }
  properties: Array<{
    name: string
    size: number
    location: {
      municipality: string
      district: string
      coordinates: {
        latitude: number
        longitude: number
      }
    }
    land_use: 'AGRICULTURE' | 'LIVESTOCK' | 'MIXED' | 'FORESTRY' | 'CONSERVATION'
  }>
  activities: Array<{
    type: 'CROP' | 'LIVESTOCK' | 'AQUACULTURE' | 'FORESTRY' | 'AGROTOURISM'
    description: string
    area: number
    production_capacity: number
    seasonal: boolean
  }>
  economic: {
    annual_revenue: number
    employee_count: number
    family_members_involved: number
    production_value: number
    export_percentage: number
  }
  technical: {
    irrigation_system: boolean
    mechanization_level: 'LOW' | 'MEDIUM' | 'HIGH'
    storage_capacity: number
    processing_facilities: boolean
    technical_assistance: boolean
  }
  environmental: {
    environmental_license: boolean
    permanent_preservation_area: number
    legal_reserve_area: number
    water_resources: Array<{
      type: 'WELL' | 'SPRING' | 'RIVER' | 'LAKE'
      usage_permit: boolean
      flow_rate: number
    }>
  }
  registration: {
    car_number?: string
    incra_code?: string
    dap_number?: string
  }
}

export interface RuralProducerFilters {
  name?: string
  cpf_cnpj?: string
  type?: 'INDIVIDUAL' | 'LEGAL_ENTITY' | 'COOPERATIVE' | 'ASSOCIATION'
  status?: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'PENDING_REGISTRATION'
  municipality?: string
  land_use?: 'AGRICULTURE' | 'LIVESTOCK' | 'MIXED' | 'FORESTRY' | 'CONSERVATION'
  activity_type?: 'CROP' | 'LIVESTOCK' | 'AQUACULTURE' | 'FORESTRY' | 'AGROTOURISM'
  min_size?: number
  max_size?: number
  has_certification?: boolean
  certification_type?: 'ORGANIC' | 'FAIR_TRADE' | 'RAINFOREST' | 'UTZ' | 'GLOBAL_GAP'
  has_environmental_license?: boolean
  min_revenue?: number
  max_revenue?: number
  created_from?: string
  created_to?: string
}

export const useRuralProducers = () => {
  const [ruralProducers, setRuralProducers] = useState<RuralProducer[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchRuralProducers = useCallback(async (filters?: RuralProducerFilters) => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.get('/agriculture/rural-producers', { params: filters })
      setRuralProducers(response.data)
    } catch (err) {
      setError('Falha ao carregar produtores rurais')
      console.error('Error fetching rural producers:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  const getRuralProducerById = useCallback(async (id: string): Promise<RuralProducer | null> => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.get(`/agriculture/rural-producers/${id}`)
      return response.data
    } catch (err) {
      setError('Falha ao carregar produtor rural')
      console.error('Error fetching rural producer:', err)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const createRuralProducer = useCallback(async (data: CreateRuralProducerData): Promise<RuralProducer | null> => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.post('/agriculture/rural-producers', data)
      const newRuralProducer = response.data
      setRuralProducers(prev => [...prev, newRuralProducer])
      return newRuralProducer
    } catch (err) {
      setError('Falha ao criar produtor rural')
      console.error('Error creating rural producer:', err)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const updateRuralProducer = useCallback(async (id: string, data: Partial<CreateRuralProducerData>): Promise<RuralProducer | null> => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.put(`/agriculture/rural-producers/${id}`, data)
      const updatedRuralProducer = response.data
      setRuralProducers(prev => prev.map(rp => rp.id === id ? updatedRuralProducer : rp))
      return updatedRuralProducer
    } catch (err) {
      setError('Falha ao atualizar produtor rural')
      console.error('Error updating rural producer:', err)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const deleteRuralProducer = useCallback(async (id: string): Promise<boolean> => {
    try {
      setLoading(true)
      setError(null)
      await apiClient.delete(`/agriculture/rural-producers/${id}`)
      setRuralProducers(prev => prev.filter(rp => rp.id !== id))
      return true
    } catch (err) {
      setError('Falha ao excluir produtor rural')
      console.error('Error deleting rural producer:', err)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const updateStatus = useCallback(async (id: string, status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED'): Promise<boolean> => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.patch(`/agriculture/rural-producers/${id}/status`, { status })
      const updatedRuralProducer = response.data
      setRuralProducers(prev => prev.map(rp => rp.id === id ? updatedRuralProducer : rp))
      return true
    } catch (err) {
      setError('Falha ao atualizar status do produtor rural')
      console.error('Error updating rural producer status:', err)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const addProperty = useCallback(async (producerId: string, property: {
    name: string
    size: number
    location: {
      municipality: string
      district: string
      coordinates: {
        latitude: number
        longitude: number
      }
    }
    land_use: 'AGRICULTURE' | 'LIVESTOCK' | 'MIXED' | 'FORESTRY' | 'CONSERVATION'
  }): Promise<boolean> => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.post(`/agriculture/rural-producers/${producerId}/properties`, property)
      const updatedRuralProducer = response.data
      setRuralProducers(prev => prev.map(rp => rp.id === producerId ? updatedRuralProducer : rp))
      return true
    } catch (err) {
      setError('Falha ao adicionar propriedade')
      console.error('Error adding property:', err)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const addCertification = useCallback(async (producerId: string, propertyId: string, certification: {
    type: 'ORGANIC' | 'FAIR_TRADE' | 'RAINFOREST' | 'UTZ' | 'GLOBAL_GAP'
    number: string
    issuer: string
    valid_until: string
  }): Promise<boolean> => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.post(`/agriculture/rural-producers/${producerId}/properties/${propertyId}/certifications`, certification)
      const updatedRuralProducer = response.data
      setRuralProducers(prev => prev.map(rp => rp.id === producerId ? updatedRuralProducer : rp))
      return true
    } catch (err) {
      setError('Falha ao adicionar certificação')
      console.error('Error adding certification:', err)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const renewRegistration = useCallback(async (id: string): Promise<boolean> => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.post(`/agriculture/rural-producers/${id}/renew-registration`)
      const updatedRuralProducer = response.data
      setRuralProducers(prev => prev.map(rp => rp.id === id ? updatedRuralProducer : rp))
      return true
    } catch (err) {
      setError('Falha ao renovar cadastro')
      console.error('Error renewing registration:', err)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const searchByLocation = useCallback((latitude: number, longitude: number, radius: number) => {
    return ruralProducers.filter(producer =>
      producer.properties.some(property => {
        if (!property.location.coordinates) return false
        const distance = Math.sqrt(
          Math.pow(property.location.coordinates.latitude - latitude, 2) +
          Math.pow(property.location.coordinates.longitude - longitude, 2)
        )
        return distance <= radius
      })
    )
  }, [ruralProducers])

  const getProducersByActivity = useCallback((activityType: 'CROP' | 'LIVESTOCK' | 'AQUACULTURE' | 'FORESTRY' | 'AGROTOURISM') => {
    return ruralProducers.filter(producer =>
      producer.activities.some(activity => activity.type === activityType)
    )
  }, [ruralProducers])

  const getCertifiedProducers = useCallback((certificationType?: 'ORGANIC' | 'FAIR_TRADE' | 'RAINFOREST' | 'UTZ' | 'GLOBAL_GAP') => {
    return ruralProducers.filter(producer =>
      producer.properties.some(property =>
        property.certification.length > 0 &&
        (!certificationType || property.certification.some(cert => cert.type === certificationType))
      )
    )
  }, [ruralProducers])

  useEffect(() => {
    fetchRuralProducers()
  }, [fetchRuralProducers])

  return {
    ruralProducers,
    loading,
    error,
    fetchRuralProducers,
    getRuralProducerById,
    createRuralProducer,
    updateRuralProducer,
    deleteRuralProducer,
    updateStatus,
    addProperty,
    addCertification,
    renewRegistration,
    searchByLocation,
    getProducersByActivity,
    getCertifiedProducers
  }
}