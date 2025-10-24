import { useState, useEffect, useCallback } from 'react'
import { apiClient } from '@/lib/api'

export interface TourismAttraction {
  id: string
  code: string
  name: string
  category: 'HISTORICAL' | 'CULTURAL' | 'NATURAL' | 'RELIGIOUS' | 'ARCHITECTURAL' | 'ADVENTURE' | 'GASTRONOMIC' | 'RECREATIONAL'
  subcategory: string
  status: 'ACTIVE' | 'INACTIVE' | 'UNDER_RENOVATION' | 'TEMPORARILY_CLOSED' | 'PLANNED'
  description: {
    short: string
    detailed: string
    historical_context?: string
    cultural_significance?: string
  }
  location: {
    address: {
      street: string
      number: string
      neighborhood: string
      city: string
      state: string
      zipcode: string
    }
    coordinates: {
      latitude: number
      longitude: number
    }
    accessibility: {
      public_transport: boolean
      parking_available: boolean
      wheelchair_accessible: boolean
      distance_from_center: number
    }
  }
  contact: {
    phone?: string
    email?: string
    website?: string
    social_media: Array<{
      platform: 'FACEBOOK' | 'INSTAGRAM' | 'TWITTER' | 'YOUTUBE' | 'TIKTOK'
      handle: string
    }>
  }
  operation: {
    schedule: Array<{
      day: 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY'
      opening_time?: string
      closing_time?: string
      closed: boolean
    }>
    seasonal_variations: Array<{
      season: 'SUMMER' | 'WINTER' | 'SPRING' | 'AUTUMN' | 'HIGH_SEASON' | 'LOW_SEASON'
      special_schedule?: Array<{
        day: string
        opening_time?: string
        closing_time?: string
      }>
      closed: boolean
    }>
    holiday_schedule: Array<{
      date: string
      description: string
      opening_time?: string
      closing_time?: string
      closed: boolean
    }>
  }
  pricing: {
    free_admission: boolean
    ticket_prices: Array<{
      category: 'ADULT' | 'SENIOR' | 'STUDENT' | 'CHILD' | 'GROUP' | 'RESIDENT' | 'TOURIST'
      price: number
      description?: string
      conditions?: Array<string>
    }>
    group_discounts: Array<{
      min_size: number
      discount_percentage: number
      conditions?: Array<string>
    }>
    special_offers: Array<{
      name: string
      description: string
      discount_percentage: number
      valid_from: string
      valid_to: string
      conditions: Array<string>
    }>
  }
  features: {
    guided_tours: boolean
    audio_guides: boolean
    gift_shop: boolean
    restaurant: boolean
    parking: boolean
    restrooms: boolean
    wifi: boolean
    photography_allowed: boolean
    languages_supported: Array<'PT' | 'EN' | 'ES' | 'FR' | 'DE' | 'IT'>
  }
  capacity: {
    max_visitors_per_day: number
    max_visitors_per_hour: number
    max_group_size: number
    requires_reservation: boolean
    advance_booking_days: number
  }
  safety: {
    safety_measures: Array<string>
    emergency_procedures: Array<string>
    medical_assistance: boolean
    security_personnel: boolean
    insurance_required: boolean
  }
  multimedia: {
    photos: Array<{
      url: string
      caption: string
      category: 'EXTERIOR' | 'INTERIOR' | 'ACTIVITY' | 'FACILITY' | 'HISTORICAL'
      is_cover: boolean
    }>
    videos: Array<{
      url: string
      title: string
      duration: number
      type: 'PROMOTIONAL' | 'DOCUMENTARY' | 'VIRTUAL_TOUR' | 'GUIDE'
    }>
    virtual_tour_url?: string
  }
  certifications: Array<{
    type: 'HERITAGE' | 'QUALITY' | 'SUSTAINABILITY' | 'ACCESSIBILITY' | 'SAFETY'
    issuer: string
    number: string
    issued_date: string
    valid_until: string
  }>
  awards: Array<{
    name: string
    issuer: string
    year: number
    category: string
    description?: string
  }>
  statistics: {
    annual_visitors: number
    monthly_visitors: Array<{
      month: number
      year: number
      count: number
    }>
    average_visit_duration: number
    visitor_satisfaction: number
    repeat_visitors_percentage: number
  }
  sustainability: {
    environmental_practices: Array<string>
    community_impact: Array<string>
    local_employment: number
    local_suppliers_percentage: number
    carbon_footprint_reduction: Array<string>
  }
  partnerships: Array<{
    organization: string
    type: 'COMMERCIAL' | 'CULTURAL' | 'EDUCATIONAL' | 'GOVERNMENTAL' | 'NGO'
    description: string
    benefits: Array<string>
  }>
  reviews: {
    average_rating: number
    total_reviews: number
    rating_distribution: {
      five_stars: number
      four_stars: number
      three_stars: number
      two_stars: number
      one_star: number
    }
    recent_reviews: Array<{
      id: string
      rating: number
      comment: string
      visitor_name: string
      visit_date: string
      helpful_votes: number
    }>
  }
  created_at: string
  updated_at: string
}

export interface CreateTourismAttractionData {
  name: string
  category: 'HISTORICAL' | 'CULTURAL' | 'NATURAL' | 'RELIGIOUS' | 'ARCHITECTURAL' | 'ADVENTURE' | 'GASTRONOMIC' | 'RECREATIONAL'
  subcategory: string
  description: {
    short: string
    detailed: string
    historical_context?: string
    cultural_significance?: string
  }
  location: {
    address: {
      street: string
      number: string
      neighborhood: string
      city: string
      state: string
      zipcode: string
    }
    coordinates: {
      latitude: number
      longitude: number
    }
    accessibility: {
      public_transport: boolean
      parking_available: boolean
      wheelchair_accessible: boolean
      distance_from_center: number
    }
  }
  contact: {
    phone?: string
    email?: string
    website?: string
  }
  operation: {
    schedule: Array<{
      day: 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY'
      opening_time?: string
      closing_time?: string
      closed: boolean
    }>
  }
  pricing: {
    free_admission: boolean
    ticket_prices: Array<{
      category: 'ADULT' | 'SENIOR' | 'STUDENT' | 'CHILD' | 'GROUP' | 'RESIDENT' | 'TOURIST'
      price: number
      description?: string
    }>
  }
  features: {
    guided_tours: boolean
    audio_guides: boolean
    gift_shop: boolean
    restaurant: boolean
    parking: boolean
    restrooms: boolean
    wifi: boolean
    photography_allowed: boolean
    languages_supported: Array<'PT' | 'EN' | 'ES' | 'FR' | 'DE' | 'IT'>
  }
  capacity: {
    max_visitors_per_day: number
    max_visitors_per_hour: number
    max_group_size: number
    requires_reservation: boolean
    advance_booking_days: number
  }
}

export interface TourismAttractionFilters {
  name?: string
  code?: string
  category?: 'HISTORICAL' | 'CULTURAL' | 'NATURAL' | 'RELIGIOUS' | 'ARCHITECTURAL' | 'ADVENTURE' | 'GASTRONOMIC' | 'RECREATIONAL'
  subcategory?: string
  status?: 'ACTIVE' | 'INACTIVE' | 'UNDER_RENOVATION' | 'TEMPORARILY_CLOSED' | 'PLANNED'
  city?: string
  neighborhood?: string
  free_admission?: boolean
  guided_tours?: boolean
  wheelchair_accessible?: boolean
  parking_available?: boolean
  requires_reservation?: boolean
  min_rating?: number
  max_distance_from_center?: number
  languages_supported?: Array<'PT' | 'EN' | 'ES' | 'FR' | 'DE' | 'IT'>
  has_certifications?: boolean
  certification_type?: 'HERITAGE' | 'QUALITY' | 'SUSTAINABILITY' | 'ACCESSIBILITY' | 'SAFETY'
  min_visitors?: number
  created_from?: string
  created_to?: string
}

export const useTourismAttractions = () => {
  const [attractions, setAttractions] = useState<TourismAttraction[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchAttractions = useCallback(async (filters?: TourismAttractionFilters) => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.get('/tourism/attractions', { params: filters })
      setAttractions(response.data)
    } catch (err) {
      setError('Falha ao carregar atrações turísticas')
      console.error('Error fetching tourism attractions:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  const getAttractionById = useCallback(async (id: string): Promise<TourismAttraction | null> => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.get(`/tourism/attractions/${id}`)
      return response.data
    } catch (err) {
      setError('Falha ao carregar atração turística')
      console.error('Error fetching tourism attraction:', err)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const createAttraction = useCallback(async (data: CreateTourismAttractionData): Promise<TourismAttraction | null> => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.post('/tourism/attractions', data)
      const newAttraction = response.data
      setAttractions(prev => [...prev, newAttraction])
      return newAttraction
    } catch (err) {
      setError('Falha ao criar atração turística')
      console.error('Error creating tourism attraction:', err)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const updateAttraction = useCallback(async (id: string, data: Partial<CreateTourismAttractionData>): Promise<TourismAttraction | null> => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.put(`/tourism/attractions/${id}`, data)
      const updatedAttraction = response.data
      setAttractions(prev => prev.map(attr => attr.id === id ? updatedAttraction : attr))
      return updatedAttraction
    } catch (err) {
      setError('Falha ao atualizar atração turística')
      console.error('Error updating tourism attraction:', err)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const deleteAttraction = useCallback(async (id: string): Promise<boolean> => {
    try {
      setLoading(true)
      setError(null)
      await apiClient.delete(`/tourism/attractions/${id}`)
      setAttractions(prev => prev.filter(attr => attr.id !== id))
      return true
    } catch (err) {
      setError('Falha ao excluir atração turística')
      console.error('Error deleting tourism attraction:', err)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const updateStatus = useCallback(async (id: string, status: 'ACTIVE' | 'INACTIVE' | 'UNDER_RENOVATION' | 'TEMPORARILY_CLOSED'): Promise<boolean> => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.patch(`/tourism/attractions/${id}/status`, { status })
      const updatedAttraction = response.data
      setAttractions(prev => prev.map(attr => attr.id === id ? updatedAttraction : attr))
      return true
    } catch (err) {
      setError('Falha ao atualizar status da atração')
      console.error('Error updating attraction status:', err)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const addPhoto = useCallback(async (attractionId: string, photo: {
    url: string
    caption: string
    category: 'EXTERIOR' | 'INTERIOR' | 'ACTIVITY' | 'FACILITY' | 'HISTORICAL'
    is_cover: boolean
  }): Promise<boolean> => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.post(`/tourism/attractions/${attractionId}/photos`, photo)
      const updatedAttraction = response.data
      setAttractions(prev => prev.map(attr => attr.id === attractionId ? updatedAttraction : attr))
      return true
    } catch (err) {
      setError('Falha ao adicionar foto')
      console.error('Error adding photo:', err)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const addCertification = useCallback(async (attractionId: string, certification: {
    type: 'HERITAGE' | 'QUALITY' | 'SUSTAINABILITY' | 'ACCESSIBILITY' | 'SAFETY'
    issuer: string
    number: string
    issued_date: string
    valid_until: string
  }): Promise<boolean> => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.post(`/tourism/attractions/${attractionId}/certifications`, certification)
      const updatedAttraction = response.data
      setAttractions(prev => prev.map(attr => attr.id === attractionId ? updatedAttraction : attr))
      return true
    } catch (err) {
      setError('Falha ao adicionar certificação')
      console.error('Error adding certification:', err)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const recordVisitorStats = useCallback(async (attractionId: string, stats: {
    month: number
    year: number
    visitor_count: number
    average_visit_duration?: number
    satisfaction_score?: number
  }): Promise<boolean> => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.post(`/tourism/attractions/${attractionId}/visitor-stats`, stats)
      const updatedAttraction = response.data
      setAttractions(prev => prev.map(attr => attr.id === attractionId ? updatedAttraction : attr))
      return true
    } catch (err) {
      setError('Falha ao registrar estatísticas de visitantes')
      console.error('Error recording visitor stats:', err)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const addReview = useCallback(async (attractionId: string, review: {
    rating: number
    comment: string
    visitor_name: string
    visit_date: string
  }): Promise<boolean> => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.post(`/tourism/attractions/${attractionId}/reviews`, review)
      const updatedAttraction = response.data
      setAttractions(prev => prev.map(attr => attr.id === attractionId ? updatedAttraction : attr))
      return true
    } catch (err) {
      setError('Falha ao adicionar avaliação')
      console.error('Error adding review:', err)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const updatePricing = useCallback(async (attractionId: string, pricing: {
    free_admission: boolean
    ticket_prices: Array<{
      category: 'ADULT' | 'SENIOR' | 'STUDENT' | 'CHILD' | 'GROUP' | 'RESIDENT' | 'TOURIST'
      price: number
      description?: string
      conditions?: Array<string>
    }>
  }): Promise<boolean> => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.patch(`/tourism/attractions/${attractionId}/pricing`, pricing)
      const updatedAttraction = response.data
      setAttractions(prev => prev.map(attr => attr.id === attractionId ? updatedAttraction : attr))
      return true
    } catch (err) {
      setError('Falha ao atualizar preços')
      console.error('Error updating pricing:', err)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const getAttractionsByCategory = useCallback((category: 'HISTORICAL' | 'CULTURAL' | 'NATURAL' | 'RELIGIOUS' | 'ARCHITECTURAL' | 'ADVENTURE' | 'GASTRONOMIC' | 'RECREATIONAL') => {
    return attractions.filter(attraction => attraction.category === category)
  }, [attractions])

  const getActiveAttractions = useCallback(() => {
    return attractions.filter(attraction => attraction.status === 'ACTIVE')
  }, [attractions])

  const getFreeAttractions = useCallback(() => {
    return attractions.filter(attraction => attraction.pricing.free_admission)
  }, [attractions])

  const getAccessibleAttractions = useCallback(() => {
    return attractions.filter(attraction => attraction.location.accessibility.wheelchair_accessible)
  }, [attractions])

  const getTopRatedAttractions = useCallback((minRating: number = 4.0) => {
    return attractions.filter(attraction => attraction.reviews.average_rating >= minRating)
      .sort((a, b) => b.reviews.average_rating - a.reviews.average_rating)
  }, [attractions])

  const searchNearby = useCallback((latitude: number, longitude: number, radius: number) => {
    return attractions.filter(attraction => {
      const distance = Math.sqrt(
        Math.pow(attraction.location.coordinates.latitude - latitude, 2) +
        Math.pow(attraction.location.coordinates.longitude - longitude, 2)
      )
      return distance <= radius
    })
  }, [attractions])

  useEffect(() => {
    fetchAttractions()
  }, [fetchAttractions])

  return {
    attractions,
    loading,
    error,
    fetchAttractions,
    getAttractionById,
    createAttraction,
    updateAttraction,
    deleteAttraction,
    updateStatus,
    addPhoto,
    addCertification,
    recordVisitorStats,
    addReview,
    updatePricing,
    getAttractionsByCategory,
    getActiveAttractions,
    getFreeAttractions,
    getAccessibleAttractions,
    getTopRatedAttractions,
    searchNearby
  }
}