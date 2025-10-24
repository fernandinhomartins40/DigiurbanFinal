import { useState, useEffect, useCallback } from 'react'
import { apiClient } from '@/lib/api'

export interface TourismAccommodation {
  id: string
  registration_number: string
  name: string
  type: 'HOTEL' | 'POUSADA' | 'RESORT' | 'HOSTEL' | 'APARTMENT' | 'BED_BREAKFAST' | 'CAMPING' | 'RURAL_TOURISM' | 'VACATION_RENTAL'
  category: 'LUXURY' | 'PREMIUM' | 'STANDARD' | 'ECONOMY' | 'BUDGET'
  status: 'ACTIVE' | 'INACTIVE' | 'UNDER_RENOVATION' | 'TEMPORARILY_CLOSED' | 'PENDING_APPROVAL'
  classification: {
    stars: number
    official_rating: string
    certification_body: string
    last_evaluation: string
    next_evaluation: string
  }
  description: {
    overview: string
    unique_features: Array<string>
    history?: string
    location_highlights: Array<string>
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
      distance_from_center: number
      distance_from_airport: number
      distance_from_beach: number
      public_transport_nearby: boolean
      parking_available: boolean
      wheelchair_accessible: boolean
    }
    nearby_attractions: Array<{
      name: string
      distance: number
      category: string
    }>
  }
  contact: {
    phone: string
    email: string
    website?: string
    social_media: Array<{
      platform: 'FACEBOOK' | 'INSTAGRAM' | 'TWITTER' | 'YOUTUBE' | 'TIKTOK'
      handle: string
    }>
  }
  management: {
    owner_name: string
    manager_name: string
    management_company?: string
    experience_years: number
    staff_count: number
    languages_spoken: Array<'PT' | 'EN' | 'ES' | 'FR' | 'DE' | 'IT'>
  }
  capacity: {
    total_rooms: number
    total_beds: number
    max_guests: number
    room_types: Array<{
      type: 'SINGLE' | 'DOUBLE' | 'TRIPLE' | 'SUITE' | 'FAMILY' | 'DORMITORY' | 'APARTMENT'
      quantity: number
      max_occupancy: number
      size_sqm: number
      amenities: Array<string>
    }>
  }
  facilities: {
    general: Array<'RECEPTION_24H' | 'WIFI' | 'PARKING' | 'RESTAURANT' | 'BAR' | 'POOL' | 'SPA' | 'GYM' | 'BUSINESS_CENTER' | 'CONFERENCE_ROOM'>
    room_amenities: Array<'AC' | 'TV' | 'MINIBAR' | 'SAFE' | 'BALCONY' | 'OCEAN_VIEW' | 'KITCHENETTE' | 'PRIVATE_BATHROOM'>
    recreational: Array<'SWIMMING_POOL' | 'TENNIS_COURT' | 'GOLF_COURSE' | 'BEACH_ACCESS' | 'WATER_SPORTS' | 'HIKING_TRAILS'>
    dining: Array<{
      name: string
      type: 'RESTAURANT' | 'BAR' | 'CAFE' | 'ROOM_SERVICE'
      cuisine: string
      hours: string
    }>
    accessibility_features: Array<'WHEELCHAIR_ACCESS' | 'BRAILLE_SIGNAGE' | 'AUDIO_ASSISTANCE' | 'ACCESSIBLE_ROOMS'>
  }
  pricing: {
    rate_structure: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'SEASONAL'
    base_rates: Array<{
      room_type: string
      low_season: number
      high_season: number
      peak_season: number
      currency: 'BRL' | 'USD' | 'EUR'
    }>
    packages: Array<{
      name: string
      description: string
      includes: Array<string>
      price: number
      validity: {
        start_date: string
        end_date: string
      }
      conditions: Array<string>
    }>
    policies: {
      cancellation_policy: string
      check_in_time: string
      check_out_time: string
      deposit_required: number
      payment_methods: Array<'CASH' | 'CREDIT_CARD' | 'DEBIT_CARD' | 'PIX' | 'BANK_TRANSFER'>
    }
  }
  booking: {
    online_booking: boolean
    booking_platforms: Array<'DIRECT' | 'BOOKING_COM' | 'AIRBNB' | 'EXPEDIA' | 'AGODA' | 'TRIVAGO'>
    commission_rates: Array<{
      platform: string
      commission_percentage: number
    }>
    average_booking_lead_time: number
    cancellation_rate: number
  }
  occupancy: {
    current_occupancy: number
    average_annual_occupancy: number
    peak_months: Array<{
      month: number
      occupancy_rate: number
    }>
    low_months: Array<{
      month: number
      occupancy_rate: number
    }>
    length_of_stay: {
      average_nights: number
      min_stay_requirement: number
      max_stay_limit?: number
    }
  }
  guest_profile: {
    demographics: {
      age_groups: Array<{
        age_range: string
        percentage: number
      }>
      family_travelers: number
      business_travelers: number
      leisure_travelers: number
    }
    origin: Array<{
      location: string
      percentage: number
      type: 'LOCAL' | 'DOMESTIC' | 'INTERNATIONAL'
    }>
    repeat_guests: number
    average_spending: number
  }
  sustainability: {
    eco_certifications: Array<{
      certification: string
      issuer: string
      valid_until: string
    }>
    green_practices: Array<string>
    waste_management: Array<string>
    energy_efficiency: Array<string>
    water_conservation: Array<string>
    local_sourcing_percentage: number
  }
  quality: {
    service_standards: Array<string>
    quality_certifications: Array<{
      certification: string
      issuer: string
      score: number
      valid_until: string
    }>
    mystery_shopper_scores: Array<{
      date: string
      overall_score: number
      areas_evaluated: Array<{
        area: string
        score: number
      }>
    }>
    staff_training_programs: Array<string>
  }
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
    review_sources: Array<{
      platform: string
      rating: number
      review_count: number
    }>
    recent_reviews: Array<{
      id: string
      guest_name: string
      rating: number
      comment: string
      stay_date: string
      room_type: string
      verified: boolean
    }>
  }
  financial: {
    revenue: {
      annual_revenue: number
      revenue_by_month: Array<{
        month: number
        revenue: number
      }>
      revenue_per_room: number
      average_daily_rate: number
    }
    expenses: {
      operational_costs: number
      staff_costs: number
      maintenance_costs: number
      marketing_costs: number
      utility_costs: number
    }
    profitability: {
      gross_profit: number
      net_profit: number
      profit_margin: number
    }
  }
  compliance: {
    licenses: Array<{
      type: string
      number: string
      issuer: string
      issued_date: string
      expiry_date: string
      status: 'VALID' | 'EXPIRED' | 'PENDING_RENEWAL'
    }>
    safety_certificates: Array<{
      type: 'FIRE_SAFETY' | 'HEALTH_SAFETY' | 'FOOD_SAFETY' | 'BUILDING_SAFETY'
      number: string
      valid_until: string
    }>
    tax_compliance: boolean
    labor_compliance: boolean
    environmental_compliance: boolean
  }
  created_at: string
  updated_at: string
}

export interface CreateTourismAccommodationData {
  name: string
  type: 'HOTEL' | 'POUSADA' | 'RESORT' | 'HOSTEL' | 'APARTMENT' | 'BED_BREAKFAST' | 'CAMPING' | 'RURAL_TOURISM' | 'VACATION_RENTAL'
  category: 'LUXURY' | 'PREMIUM' | 'STANDARD' | 'ECONOMY' | 'BUDGET'
  description: {
    overview: string
    unique_features: Array<string>
    location_highlights: Array<string>
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
      distance_from_center: number
      distance_from_airport: number
      public_transport_nearby: boolean
      parking_available: boolean
      wheelchair_accessible: boolean
    }
  }
  contact: {
    phone: string
    email: string
    website?: string
  }
  management: {
    owner_name: string
    manager_name: string
    staff_count: number
    languages_spoken: Array<'PT' | 'EN' | 'ES' | 'FR' | 'DE' | 'IT'>
  }
  capacity: {
    total_rooms: number
    total_beds: number
    max_guests: number
    room_types: Array<{
      type: 'SINGLE' | 'DOUBLE' | 'TRIPLE' | 'SUITE' | 'FAMILY' | 'DORMITORY' | 'APARTMENT'
      quantity: number
      max_occupancy: number
      size_sqm: number
      amenities: Array<string>
    }>
  }
  facilities: {
    general: Array<string>
    room_amenities: Array<string>
    recreational: Array<string>
  }
  pricing: {
    rate_structure: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'SEASONAL'
    base_rates: Array<{
      room_type: string
      low_season: number
      high_season: number
      peak_season: number
      currency: 'BRL' | 'USD' | 'EUR'
    }>
    policies: {
      cancellation_policy: string
      check_in_time: string
      check_out_time: string
      deposit_required: number
      payment_methods: Array<'CASH' | 'CREDIT_CARD' | 'DEBIT_CARD' | 'PIX' | 'BANK_TRANSFER'>
    }
  }
}

export interface TourismAccommodationFilters {
  name?: string
  registration_number?: string
  type?: 'HOTEL' | 'POUSADA' | 'RESORT' | 'HOSTEL' | 'APARTMENT' | 'BED_BREAKFAST' | 'CAMPING' | 'RURAL_TOURISM' | 'VACATION_RENTAL'
  category?: 'LUXURY' | 'PREMIUM' | 'STANDARD' | 'ECONOMY' | 'BUDGET'
  status?: 'ACTIVE' | 'INACTIVE' | 'UNDER_RENOVATION' | 'TEMPORARILY_CLOSED' | 'PENDING_APPROVAL'
  city?: string
  neighborhood?: string
  min_stars?: number
  max_stars?: number
  min_rooms?: number
  max_rooms?: number
  wheelchair_accessible?: boolean
  parking_available?: boolean
  wifi?: boolean
  pool?: boolean
  restaurant?: boolean
  min_rating?: number
  max_price?: number
  min_price?: number
  online_booking?: boolean
  min_occupancy?: number
  eco_certified?: boolean
  created_from?: string
  created_to?: string
}

export const useTourismAccommodation = () => {
  const [accommodations, setAccommodations] = useState<TourismAccommodation[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchAccommodations = useCallback(async (filters?: TourismAccommodationFilters) => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.get('/tourism/accommodations', { params: filters })
      setAccommodations(response.data)
    } catch (err) {
      setError('Falha ao carregar acomodações turísticas')
      console.error('Error fetching tourism accommodations:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  const getAccommodationById = useCallback(async (id: string): Promise<TourismAccommodation | null> => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.get(`/tourism/accommodations/${id}`)
      return response.data
    } catch (err) {
      setError('Falha ao carregar acomodação turística')
      console.error('Error fetching tourism accommodation:', err)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const createAccommodation = useCallback(async (data: CreateTourismAccommodationData): Promise<TourismAccommodation | null> => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.post('/tourism/accommodations', data)
      const newAccommodation = response.data
      setAccommodations(prev => [...prev, newAccommodation])
      return newAccommodation
    } catch (err) {
      setError('Falha ao criar acomodação turística')
      console.error('Error creating tourism accommodation:', err)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const updateAccommodation = useCallback(async (id: string, data: Partial<CreateTourismAccommodationData>): Promise<TourismAccommodation | null> => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.put(`/tourism/accommodations/${id}`, data)
      const updatedAccommodation = response.data
      setAccommodations(prev => prev.map(acc => acc.id === id ? updatedAccommodation : acc))
      return updatedAccommodation
    } catch (err) {
      setError('Falha ao atualizar acomodação turística')
      console.error('Error updating tourism accommodation:', err)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const deleteAccommodation = useCallback(async (id: string): Promise<boolean> => {
    try {
      setLoading(true)
      setError(null)
      await apiClient.delete(`/tourism/accommodations/${id}`)
      setAccommodations(prev => prev.filter(acc => acc.id !== id))
      return true
    } catch (err) {
      setError('Falha ao excluir acomodação turística')
      console.error('Error deleting tourism accommodation:', err)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const updateStatus = useCallback(async (id: string, status: 'ACTIVE' | 'INACTIVE' | 'UNDER_RENOVATION' | 'TEMPORARILY_CLOSED'): Promise<boolean> => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.patch(`/tourism/accommodations/${id}/status`, { status })
      const updatedAccommodation = response.data
      setAccommodations(prev => prev.map(acc => acc.id === id ? updatedAccommodation : acc))
      return true
    } catch (err) {
      setError('Falha ao atualizar status da acomodação')
      console.error('Error updating accommodation status:', err)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const updateOccupancy = useCallback(async (id: string, occupancy: {
    current_occupancy: number
    month: number
    year: number
    occupancy_rate: number
  }): Promise<boolean> => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.patch(`/tourism/accommodations/${id}/occupancy`, occupancy)
      const updatedAccommodation = response.data
      setAccommodations(prev => prev.map(acc => acc.id === id ? updatedAccommodation : acc))
      return true
    } catch (err) {
      setError('Falha ao atualizar ocupação')
      console.error('Error updating occupancy:', err)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const addReview = useCallback(async (accommodationId: string, review: {
    guest_name: string
    rating: number
    comment: string
    stay_date: string
    room_type: string
    verified: boolean
  }): Promise<boolean> => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.post(`/tourism/accommodations/${accommodationId}/reviews`, review)
      const updatedAccommodation = response.data
      setAccommodations(prev => prev.map(acc => acc.id === accommodationId ? updatedAccommodation : acc))
      return true
    } catch (err) {
      setError('Falha ao adicionar avaliação')
      console.error('Error adding review:', err)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const updateFinancials = useCallback(async (id: string, financial: {
    revenue: {
      annual_revenue: number
      month: number
      monthly_revenue: number
      revenue_per_room: number
      average_daily_rate: number
    }
    expenses: {
      operational_costs: number
      staff_costs: number
      maintenance_costs: number
      marketing_costs: number
      utility_costs: number
    }
  }): Promise<boolean> => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.patch(`/tourism/accommodations/${id}/financials`, financial)
      const updatedAccommodation = response.data
      setAccommodations(prev => prev.map(acc => acc.id === id ? updatedAccommodation : acc))
      return true
    } catch (err) {
      setError('Falha ao atualizar dados financeiros')
      console.error('Error updating financials:', err)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const addCertification = useCallback(async (accommodationId: string, certification: {
    type: 'ECO' | 'QUALITY' | 'SAFETY'
    certification: string
    issuer: string
    score?: number
    valid_until: string
  }): Promise<boolean> => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.post(`/tourism/accommodations/${accommodationId}/certifications`, certification)
      const updatedAccommodation = response.data
      setAccommodations(prev => prev.map(acc => acc.id === accommodationId ? updatedAccommodation : acc))
      return true
    } catch (err) {
      setError('Falha ao adicionar certificação')
      console.error('Error adding certification:', err)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const updatePricing = useCallback(async (accommodationId: string, pricing: {
    room_type: string
    low_season?: number
    high_season?: number
    peak_season?: number
    currency: 'BRL' | 'USD' | 'EUR'
  }): Promise<boolean> => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.patch(`/tourism/accommodations/${accommodationId}/pricing`, pricing)
      const updatedAccommodation = response.data
      setAccommodations(prev => prev.map(acc => acc.id === accommodationId ? updatedAccommodation : acc))
      return true
    } catch (err) {
      setError('Falha ao atualizar preços')
      console.error('Error updating pricing:', err)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const getAccommodationsByType = useCallback((type: 'HOTEL' | 'POUSADA' | 'RESORT' | 'HOSTEL' | 'APARTMENT' | 'BED_BREAKFAST' | 'CAMPING' | 'RURAL_TOURISM' | 'VACATION_RENTAL') => {
    return accommodations.filter(acc => acc.type === type)
  }, [accommodations])

  const getActiveAccommodations = useCallback(() => {
    return accommodations.filter(acc => acc.status === 'ACTIVE')
  }, [accommodations])

  const getHighRatedAccommodations = useCallback((minRating: number = 4.0) => {
    return accommodations.filter(acc => acc.reviews.average_rating >= minRating)
      .sort((a, b) => b.reviews.average_rating - a.reviews.average_rating)
  }, [accommodations])

  const getAccommodationsByCategory = useCallback((category: 'LUXURY' | 'PREMIUM' | 'STANDARD' | 'ECONOMY' | 'BUDGET') => {
    return accommodations.filter(acc => acc.category === category)
  }, [accommodations])

  const getAccessibleAccommodations = useCallback(() => {
    return accommodations.filter(acc => acc.location.accessibility.wheelchair_accessible)
  }, [accommodations])

  const getAccommodationsWithFacility = useCallback((facility: string) => {
    return accommodations.filter(acc =>
      acc.facilities.general.includes(facility as any) ||
      acc.facilities.room_amenities.includes(facility as any) ||
      acc.facilities.recreational.includes(facility as any)
    )
  }, [accommodations])

  const calculateAverageOccupancy = useCallback(() => {
    if (accommodations.length === 0) return 0
    const totalOccupancy = accommodations.reduce((sum, acc) => sum + acc.occupancy.average_annual_occupancy, 0)
    return totalOccupancy / accommodations.length
  }, [accommodations])

  const getTotalRevenue = useCallback(() => {
    return accommodations.reduce((total, acc) => total + acc.financial.revenue.annual_revenue, 0)
  }, [accommodations])

  useEffect(() => {
    fetchAccommodations()
  }, [fetchAccommodations])

  return {
    accommodations,
    loading,
    error,
    fetchAccommodations,
    getAccommodationById,
    createAccommodation,
    updateAccommodation,
    deleteAccommodation,
    updateStatus,
    updateOccupancy,
    addReview,
    updateFinancials,
    addCertification,
    updatePricing,
    getAccommodationsByType,
    getActiveAccommodations,
    getHighRatedAccommodations,
    getAccommodationsByCategory,
    getAccessibleAccommodations,
    getAccommodationsWithFacility,
    calculateAverageOccupancy,
    getTotalRevenue
  }
}