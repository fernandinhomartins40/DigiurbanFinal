import { useState, useEffect, useCallback } from 'react'
import { apiClient } from '@/lib/api'

export interface TourismPackage {
  id: string
  code: string
  name: string
  status: 'ACTIVE' | 'INACTIVE' | 'DRAFT' | 'DISCONTINUED' | 'SEASONAL'
  category: 'CULTURAL' | 'ADVENTURE' | 'RELAXATION' | 'GASTRONOMIC' | 'ROMANTIC' | 'FAMILY' | 'BUSINESS' | 'EDUCATIONAL'
  type: 'DOMESTIC' | 'INTERNATIONAL' | 'LOCAL' | 'REGIONAL'
  duration: {
    days: number
    nights: number
    flexible: boolean
    min_duration?: number
    max_duration?: number
  }
  description: {
    overview: string
    highlights: Array<string>
    unique_selling_points: Array<string>
    target_audience: Array<'COUPLES' | 'FAMILIES' | 'GROUPS' | 'SOLO_TRAVELERS' | 'SENIORS' | 'YOUNG_ADULTS' | 'BUSINESS_TRAVELERS'>
  }
  itinerary: Array<{
    day: number
    title: string
    description: string
    activities: Array<{
      time: string
      activity: string
      location: string
      duration: number
      optional: boolean
      cost_included: boolean
    }>
    meals_included: Array<'BREAKFAST' | 'LUNCH' | 'DINNER' | 'SNACKS'>
    accommodation?: {
      name: string
      location: string
      category: string
      check_in?: string
      check_out?: string
    }
  }>
  inclusions: {
    accommodation: {
      included: boolean
      type: 'HOTEL' | 'POUSADA' | 'RESORT' | 'HOSTEL' | 'APARTMENT' | 'CAMPING'
      category: 'LUXURY' | 'PREMIUM' | 'STANDARD' | 'ECONOMY'
      room_type: 'SINGLE' | 'DOUBLE' | 'TRIPLE' | 'SUITE' | 'FAMILY'
      nights: number
    }
    transportation: {
      included: boolean
      types: Array<'FLIGHT' | 'BUS' | 'CAR_RENTAL' | 'PRIVATE_TRANSFER' | 'PUBLIC_TRANSPORT'>
      details: Array<{
        type: string
        route: string
        class: string
        provider?: string
      }>
    }
    meals: {
      breakfast_included: boolean
      lunch_included: boolean
      dinner_included: boolean
      special_dietary: Array<'VEGETARIAN' | 'VEGAN' | 'GLUTEN_FREE' | 'HALAL' | 'KOSHER'>
      meal_plan: 'NONE' | 'BREAKFAST' | 'HALF_BOARD' | 'FULL_BOARD' | 'ALL_INCLUSIVE'
    }
    activities: Array<{
      name: string
      description: string
      location: string
      included: boolean
      optional_cost?: number
    }>
    services: Array<{
      service: 'GUIDE' | 'INSURANCE' | 'WIFI' | 'PARKING' | 'AIRPORT_TRANSFER' | 'CITY_TAX'
      included: boolean
      description?: string
    }>
  }
  exclusions: Array<{
    item: string
    description: string
    estimated_cost?: number
  }>
  pricing: {
    base_price: number
    currency: 'BRL' | 'USD' | 'EUR'
    price_per_person: boolean
    seasonal_pricing: Array<{
      season: 'HIGH' | 'MEDIUM' | 'LOW'
      start_date: string
      end_date: string
      price_modifier: number
      price_type: 'FIXED' | 'PERCENTAGE'
    }>
    group_discounts: Array<{
      min_people: number
      discount_percentage: number
    }>
    early_bird_discount: {
      enabled: boolean
      days_advance: number
      discount_percentage: number
    }
    supplements: Array<{
      name: string
      description: string
      cost: number
      mandatory: boolean
    }>
  }
  availability: {
    start_date: string
    end_date: string
    available_dates: Array<{
      date: string
      available_spots: number
      price: number
    }>
    blackout_dates: Array<{
      date: string
      reason: string
    }>
    booking_deadline: number
    cancellation_deadline: number
  }
  capacity: {
    min_participants: number
    max_participants: number
    current_bookings: number
    available_spots: number
  }
  provider: {
    name: string
    type: 'TOUR_OPERATOR' | 'TRAVEL_AGENCY' | 'HOTEL' | 'LOCAL_GUIDE' | 'GOVERNMENT'
    contact: {
      phone: string
      email: string
      website?: string
    }
    license_number: string
    rating: number
    experience_years: number
  }
  logistics: {
    meeting_point: {
      name: string
      address: string
      coordinates: {
        latitude: number
        longitude: number
      }
      instructions: string
    }
    departure_times: Array<{
      time: string
      description: string
    }>
    return_details: {
      location: string
      estimated_time: string
    }
    equipment_provided: Array<string>
    equipment_required: Array<string>
  }
  requirements: {
    age_restrictions: {
      min_age?: number
      max_age?: number
      accompanied_minor: boolean
    }
    fitness_level: 'EASY' | 'MODERATE' | 'CHALLENGING' | 'STRENUOUS'
    health_requirements: Array<string>
    documents_required: Array<'ID' | 'PASSPORT' | 'VISA' | 'VACCINATION_CERTIFICATE' | 'MEDICAL_CERTIFICATE'>
    special_conditions: Array<string>
  }
  sustainability: {
    eco_friendly: boolean
    carbon_offset: boolean
    local_community_support: boolean
    sustainable_practices: Array<string>
    environmental_impact_score: number
  }
  marketing: {
    featured: boolean
    promotional_materials: Array<{
      type: 'IMAGE' | 'VIDEO' | 'BROCHURE' | 'VIRTUAL_TOUR'
      url: string
      caption: string
    }>
    seo_keywords: Array<string>
    target_markets: Array<string>
    distribution_channels: Array<'WEBSITE' | 'TRAVEL_AGENCIES' | 'ONLINE_PLATFORMS' | 'SOCIAL_MEDIA'>
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
    recent_reviews: Array<{
      id: string
      customer_name: string
      rating: number
      comment: string
      travel_date: string
      verified: boolean
      helpful_votes: number
    }>
    review_categories: {
      value_for_money: number
      organization: number
      guide_quality: number
      accommodation: number
      activities: number
    }
  }
  bookings: Array<{
    id: string
    customer_name: string
    customer_email: string
    booking_date: string
    travel_date: string
    participants: number
    total_amount: number
    payment_status: 'PENDING' | 'PARTIAL' | 'PAID' | 'REFUNDED'
    booking_status: 'CONFIRMED' | 'PENDING' | 'CANCELLED' | 'COMPLETED'
    special_requests: Array<string>
  }>
  performance: {
    total_bookings: number
    total_revenue: number
    average_group_size: number
    occupancy_rate: number
    customer_satisfaction: number
    repeat_customer_rate: number
    profit_margin: number
  }
  created_at: string
  updated_at: string
}

export interface CreateTourismPackageData {
  name: string
  category: 'CULTURAL' | 'ADVENTURE' | 'RELAXATION' | 'GASTRONOMIC' | 'ROMANTIC' | 'FAMILY' | 'BUSINESS' | 'EDUCATIONAL'
  type: 'DOMESTIC' | 'INTERNATIONAL' | 'LOCAL' | 'REGIONAL'
  duration: {
    days: number
    nights: number
    flexible: boolean
  }
  description: {
    overview: string
    highlights: Array<string>
    unique_selling_points: Array<string>
    target_audience: Array<'COUPLES' | 'FAMILIES' | 'GROUPS' | 'SOLO_TRAVELERS' | 'SENIORS' | 'YOUNG_ADULTS' | 'BUSINESS_TRAVELERS'>
  }
  itinerary: Array<{
    day: number
    title: string
    description: string
    activities: Array<{
      time: string
      activity: string
      location: string
      duration: number
      optional: boolean
      cost_included: boolean
    }>
    meals_included: Array<'BREAKFAST' | 'LUNCH' | 'DINNER' | 'SNACKS'>
  }>
  inclusions: {
    accommodation: {
      included: boolean
      type?: 'HOTEL' | 'POUSADA' | 'RESORT' | 'HOSTEL' | 'APARTMENT' | 'CAMPING'
      category?: 'LUXURY' | 'PREMIUM' | 'STANDARD' | 'ECONOMY'
      room_type?: 'SINGLE' | 'DOUBLE' | 'TRIPLE' | 'SUITE' | 'FAMILY'
      nights?: number
    }
    transportation: {
      included: boolean
      types?: Array<'FLIGHT' | 'BUS' | 'CAR_RENTAL' | 'PRIVATE_TRANSFER' | 'PUBLIC_TRANSPORT'>
    }
    meals: {
      breakfast_included: boolean
      lunch_included: boolean
      dinner_included: boolean
      meal_plan: 'NONE' | 'BREAKFAST' | 'HALF_BOARD' | 'FULL_BOARD' | 'ALL_INCLUSIVE'
    }
  }
  pricing: {
    base_price: number
    currency: 'BRL' | 'USD' | 'EUR'
    price_per_person: boolean
  }
  availability: {
    start_date: string
    end_date: string
    booking_deadline: number
    cancellation_deadline: number
  }
  capacity: {
    min_participants: number
    max_participants: number
  }
  provider: {
    name: string
    type: 'TOUR_OPERATOR' | 'TRAVEL_AGENCY' | 'HOTEL' | 'LOCAL_GUIDE' | 'GOVERNMENT'
    contact: {
      phone: string
      email: string
      website?: string
    }
    license_number: string
  }
  requirements: {
    fitness_level: 'EASY' | 'MODERATE' | 'CHALLENGING' | 'STRENUOUS'
    documents_required: Array<'ID' | 'PASSPORT' | 'VISA' | 'VACCINATION_CERTIFICATE' | 'MEDICAL_CERTIFICATE'>
  }
}

export interface TourismPackageFilters {
  name?: string
  code?: string
  category?: 'CULTURAL' | 'ADVENTURE' | 'RELAXATION' | 'GASTRONOMIC' | 'ROMANTIC' | 'FAMILY' | 'BUSINESS' | 'EDUCATIONAL'
  type?: 'DOMESTIC' | 'INTERNATIONAL' | 'LOCAL' | 'REGIONAL'
  status?: 'ACTIVE' | 'INACTIVE' | 'DRAFT' | 'DISCONTINUED' | 'SEASONAL'
  min_duration?: number
  max_duration?: number
  min_price?: number
  max_price?: number
  currency?: 'BRL' | 'USD' | 'EUR'
  target_audience?: 'COUPLES' | 'FAMILIES' | 'GROUPS' | 'SOLO_TRAVELERS' | 'SENIORS' | 'YOUNG_ADULTS' | 'BUSINESS_TRAVELERS'
  fitness_level?: 'EASY' | 'MODERATE' | 'CHALLENGING' | 'STRENUOUS'
  accommodation_included?: boolean
  transportation_included?: boolean
  meals_included?: boolean
  min_rating?: number
  provider_name?: string
  provider_type?: 'TOUR_OPERATOR' | 'TRAVEL_AGENCY' | 'HOTEL' | 'LOCAL_GUIDE' | 'GOVERNMENT'
  available_date?: string
  eco_friendly?: boolean
  featured?: boolean
  created_from?: string
  created_to?: string
}

export const useTourismPackages = () => {
  const [packages, setPackages] = useState<TourismPackage[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchPackages = useCallback(async (filters?: TourismPackageFilters) => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.get('/tourism/packages', { params: filters })
      setPackages(response.data)
    } catch (err) {
      setError('Falha ao carregar pacotes turísticos')
      console.error('Error fetching tourism packages:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  const getPackageById = useCallback(async (id: string): Promise<TourismPackage | null> => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.get(`/tourism/packages/${id}`)
      return response.data
    } catch (err) {
      setError('Falha ao carregar pacote turístico')
      console.error('Error fetching tourism package:', err)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const createPackage = useCallback(async (data: CreateTourismPackageData): Promise<TourismPackage | null> => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.post('/tourism/packages', data)
      const newPackage = response.data
      setPackages(prev => [...prev, newPackage])
      return newPackage
    } catch (err) {
      setError('Falha ao criar pacote turístico')
      console.error('Error creating tourism package:', err)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const updatePackage = useCallback(async (id: string, data: Partial<CreateTourismPackageData>): Promise<TourismPackage | null> => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.put(`/tourism/packages/${id}`, data)
      const updatedPackage = response.data
      setPackages(prev => prev.map(pkg => pkg.id === id ? updatedPackage : pkg))
      return updatedPackage
    } catch (err) {
      setError('Falha ao atualizar pacote turístico')
      console.error('Error updating tourism package:', err)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const deletePackage = useCallback(async (id: string): Promise<boolean> => {
    try {
      setLoading(true)
      setError(null)
      await apiClient.delete(`/tourism/packages/${id}`)
      setPackages(prev => prev.filter(pkg => pkg.id !== id))
      return true
    } catch (err) {
      setError('Falha ao excluir pacote turístico')
      console.error('Error deleting tourism package:', err)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const updateStatus = useCallback(async (id: string, status: 'ACTIVE' | 'INACTIVE' | 'DRAFT' | 'DISCONTINUED' | 'SEASONAL'): Promise<boolean> => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.patch(`/tourism/packages/${id}/status`, { status })
      const updatedPackage = response.data
      setPackages(prev => prev.map(pkg => pkg.id === id ? updatedPackage : pkg))
      return true
    } catch (err) {
      setError('Falha ao atualizar status do pacote')
      console.error('Error updating package status:', err)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const createBooking = useCallback(async (packageId: string, booking: {
    customer_name: string
    customer_email: string
    travel_date: string
    participants: number
    total_amount: number
    special_requests?: Array<string>
  }): Promise<boolean> => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.post(`/tourism/packages/${packageId}/bookings`, booking)
      const updatedPackage = response.data
      setPackages(prev => prev.map(pkg => pkg.id === packageId ? updatedPackage : pkg))
      return true
    } catch (err) {
      setError('Falha ao criar reserva')
      console.error('Error creating booking:', err)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const updateBookingStatus = useCallback(async (packageId: string, bookingId: string, status: 'CONFIRMED' | 'PENDING' | 'CANCELLED' | 'COMPLETED', paymentStatus?: 'PENDING' | 'PARTIAL' | 'PAID' | 'REFUNDED'): Promise<boolean> => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.patch(`/tourism/packages/${packageId}/bookings/${bookingId}`, {
        booking_status: status,
        payment_status: paymentStatus
      })
      const updatedPackage = response.data
      setPackages(prev => prev.map(pkg => pkg.id === packageId ? updatedPackage : pkg))
      return true
    } catch (err) {
      setError('Falha ao atualizar status da reserva')
      console.error('Error updating booking status:', err)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const addReview = useCallback(async (packageId: string, review: {
    customer_name: string
    rating: number
    comment: string
    travel_date: string
    review_categories: {
      value_for_money: number
      organization: number
      guide_quality: number
      accommodation: number
      activities: number
    }
  }): Promise<boolean> => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.post(`/tourism/packages/${packageId}/reviews`, review)
      const updatedPackage = response.data
      setPackages(prev => prev.map(pkg => pkg.id === packageId ? updatedPackage : pkg))
      return true
    } catch (err) {
      setError('Falha ao adicionar avaliação')
      console.error('Error adding review:', err)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const updatePricing = useCallback(async (packageId: string, pricing: {
    base_price?: number
    seasonal_pricing?: Array<{
      season: 'HIGH' | 'MEDIUM' | 'LOW'
      start_date: string
      end_date: string
      price_modifier: number
      price_type: 'FIXED' | 'PERCENTAGE'
    }>
    early_bird_discount?: {
      enabled: boolean
      days_advance: number
      discount_percentage: number
    }
  }): Promise<boolean> => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.patch(`/tourism/packages/${packageId}/pricing`, pricing)
      const updatedPackage = response.data
      setPackages(prev => prev.map(pkg => pkg.id === packageId ? updatedPackage : pkg))
      return true
    } catch (err) {
      setError('Falha ao atualizar preços')
      console.error('Error updating pricing:', err)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const updateAvailability = useCallback(async (packageId: string, availability: {
    available_dates?: Array<{
      date: string
      available_spots: number
      price: number
    }>
    blackout_dates?: Array<{
      date: string
      reason: string
    }>
  }): Promise<boolean> => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.patch(`/tourism/packages/${packageId}/availability`, availability)
      const updatedPackage = response.data
      setPackages(prev => prev.map(pkg => pkg.id === packageId ? updatedPackage : pkg))
      return true
    } catch (err) {
      setError('Falha ao atualizar disponibilidade')
      console.error('Error updating availability:', err)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const getActivePackages = useCallback(() => {
    return packages.filter(pkg => pkg.status === 'ACTIVE')
  }, [packages])

  const getPackagesByCategory = useCallback((category: 'CULTURAL' | 'ADVENTURE' | 'RELAXATION' | 'GASTRONOMIC' | 'ROMANTIC' | 'FAMILY' | 'BUSINESS' | 'EDUCATIONAL') => {
    return packages.filter(pkg => pkg.category === category)
  }, [packages])

  const getFeaturedPackages = useCallback(() => {
    return packages.filter(pkg => pkg.marketing.featured && pkg.status === 'ACTIVE')
  }, [packages])

  const getPackagesByPriceRange = useCallback((minPrice: number, maxPrice: number) => {
    return packages.filter(pkg => pkg.pricing.base_price >= minPrice && pkg.pricing.base_price <= maxPrice)
  }, [packages])

  const getEcoFriendlyPackages = useCallback(() => {
    return packages.filter(pkg => pkg.sustainability.eco_friendly)
  }, [packages])

  const getTopRatedPackages = useCallback((minRating: number = 4.0) => {
    return packages.filter(pkg => pkg.reviews.average_rating >= minRating)
      .sort((a, b) => b.reviews.average_rating - a.reviews.average_rating)
  }, [packages])

  const getAvailablePackages = useCallback((date: string) => {
    return packages.filter(pkg => {
      if (pkg.status !== 'ACTIVE') return false

      const requestDate = new Date(date)
      const startDate = new Date(pkg.availability.start_date)
      const endDate = new Date(pkg.availability.end_date)

      return requestDate >= startDate && requestDate <= endDate &&
             !pkg.availability.blackout_dates.some(blackout => blackout.date === date)
    })
  }, [packages])

  const calculateTotalRevenue = useCallback(() => {
    return packages.reduce((total, pkg) => total + pkg.performance.total_revenue, 0)
  }, [packages])

  const getPopularPackages = useCallback(() => {
    return packages.filter(pkg => pkg.performance.total_bookings > 0)
      .sort((a, b) => b.performance.total_bookings - a.performance.total_bookings)
  }, [packages])

  useEffect(() => {
    fetchPackages()
  }, [fetchPackages])

  return {
    packages,
    loading,
    error,
    fetchPackages,
    getPackageById,
    createPackage,
    updatePackage,
    deletePackage,
    updateStatus,
    createBooking,
    updateBookingStatus,
    addReview,
    updatePricing,
    updateAvailability,
    getActivePackages,
    getPackagesByCategory,
    getFeaturedPackages,
    getPackagesByPriceRange,
    getEcoFriendlyPackages,
    getTopRatedPackages,
    getAvailablePackages,
    calculateTotalRevenue,
    getPopularPackages
  }
}