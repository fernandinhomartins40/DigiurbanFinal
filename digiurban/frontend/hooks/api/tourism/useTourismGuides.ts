import { useState, useEffect, useCallback } from 'react'
import { apiClient } from '@/lib/api'

export interface TourismGuide {
  id: string
  registration_number: string
  name: string
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'PENDING_APPROVAL' | 'TRAINING'
  type: 'LOCAL' | 'REGIONAL' | 'NATIONAL' | 'INTERNATIONAL' | 'SPECIALIZED'
  personal_info: {
    cpf: string
    birth_date: string
    nationality: string
    gender: 'MALE' | 'FEMALE' | 'OTHER' | 'PREFER_NOT_TO_SAY'
    education_level: 'HIGH_SCHOOL' | 'TECHNICAL' | 'BACHELOR' | 'MASTER' | 'PHD'
  }
  contact: {
    phone: string
    mobile: string
    email: string
    address: {
      street: string
      number: string
      neighborhood: string
      city: string
      state: string
      zipcode: string
    }
    emergency_contact: {
      name: string
      relationship: string
      phone: string
    }
  }
  professional: {
    experience_years: number
    registration_date: string
    license_expiry: string
    specializations: Array<'HISTORICAL' | 'CULTURAL' | 'NATURE' | 'ADVENTURE' | 'GASTRONOMIC' | 'RELIGIOUS' | 'URBAN' | 'RURAL'>
    languages: Array<{
      language: 'PT' | 'EN' | 'ES' | 'FR' | 'DE' | 'IT' | 'JP' | 'KO' | 'ZH'
      proficiency: 'BASIC' | 'INTERMEDIATE' | 'ADVANCED' | 'NATIVE'
      certified: boolean
    }>
    certifications: Array<{
      name: string
      issuer: string
      number: string
      issued_date: string
      expiry_date: string
      category: 'GUIDE_LICENSE' | 'FIRST_AID' | 'LANGUAGE' | 'SPECIALIZATION' | 'SAFETY'
    }>
  }
  services: {
    tour_types: Array<'WALKING' | 'DRIVING' | 'CYCLING' | 'BOAT' | 'HIKING' | 'CULTURAL' | 'HISTORICAL' | 'GASTRONOMIC'>
    areas_covered: Array<{
      region: string
      attractions: Array<string>
      expertise_level: 'BASIC' | 'INTERMEDIATE' | 'EXPERT'
    }>
    group_sizes: {
      min_group_size: number
      max_group_size: number
      optimal_group_size: number
    }
    duration_options: Array<{
      duration_hours: number
      description: string
      price_category: 'STANDARD' | 'PREMIUM' | 'LUXURY'
    }>
  }
  pricing: {
    rate_structure: 'HOURLY' | 'HALF_DAY' | 'FULL_DAY' | 'CUSTOM'
    base_rates: Array<{
      service_type: string
      duration: number
      price: number
      currency: 'BRL' | 'USD' | 'EUR'
    }>
    additional_fees: Array<{
      description: string
      amount: number
      type: 'FIXED' | 'PERCENTAGE'
      conditions: Array<string>
    }>
    discounts: Array<{
      type: 'GROUP' | 'SEASON' | 'LOYALTY' | 'STUDENT' | 'SENIOR'
      percentage: number
      conditions: Array<string>
    }>
  }
  availability: {
    working_days: Array<'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY'>
    working_hours: {
      start_time: string
      end_time: string
    }
    seasonal_availability: Array<{
      season: 'HIGH' | 'MEDIUM' | 'LOW'
      months: Array<number>
      availability_percentage: number
    }>
    advance_booking_required: number
    last_minute_bookings: boolean
  }
  bookings: Array<{
    id: string
    client_name: string
    client_contact: string
    tour_date: string
    tour_type: string
    group_size: number
    duration: number
    status: 'CONFIRMED' | 'PENDING' | 'CANCELLED' | 'COMPLETED'
    price: number
    payment_status: 'PENDING' | 'PARTIAL' | 'PAID' | 'REFUNDED'
    special_requests: Array<string>
  }>
  performance: {
    tours_completed: number
    total_clients_served: number
    average_group_size: number
    completion_rate: number
    cancellation_rate: number
    repeat_client_rate: number
    revenue_generated: number
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
      client_name: string
      rating: number
      comment: string
      tour_date: string
      tour_type: string
      verified: boolean
      helpful_votes: number
    }>
    categories: {
      knowledge: number
      communication: number
      punctuality: number
      friendliness: number
      organization: number
    }
  }
  training: {
    initial_training_completed: boolean
    continuing_education: Array<{
      course_name: string
      provider: string
      completion_date: string
      certificate_number: string
      hours: number
    }>
    mandatory_training: Array<{
      training_type: string
      due_date: string
      completed: boolean
      completion_date?: string
    }>
    skills_assessment: Array<{
      skill: string
      level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT'
      last_assessed: string
      assessor: string
    }>
  }
  compliance: {
    license_valid: boolean
    background_check: {
      completed: boolean
      date: string
      status: 'APPROVED' | 'PENDING' | 'REJECTED'
    }
    health_certificate: {
      valid: boolean
      expiry_date: string
      type: 'GENERAL' | 'FOOD_HANDLING' | 'ADVENTURE_ACTIVITIES'
    }
    insurance: {
      professional_liability: boolean
      accident_coverage: boolean
      policy_numbers: Array<string>
      expiry_dates: Array<string>
    }
  }
  equipment: {
    personal_equipment: Array<{
      item: string
      condition: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'NEEDS_REPLACEMENT'
      last_maintenance: string
    }>
    provided_equipment: Array<{
      item: string
      quantity: number
      condition: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'NEEDS_REPLACEMENT'
    }>
    safety_equipment: Array<{
      item: string
      certification_required: boolean
      last_inspection: string
      next_inspection: string
    }>
  }
  incidents: Array<{
    id: string
    date: string
    type: 'ACCIDENT' | 'COMPLAINT' | 'CANCELLATION' | 'EMERGENCY' | 'EQUIPMENT_FAILURE'
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
    description: string
    actions_taken: Array<string>
    resolved: boolean
    resolution_date?: string
  }>
  created_at: string
  updated_at: string
}

export interface CreateTourismGuideData {
  name: string
  type: 'LOCAL' | 'REGIONAL' | 'NATIONAL' | 'INTERNATIONAL' | 'SPECIALIZED'
  personal_info: {
    cpf: string
    birth_date: string
    nationality: string
    gender: 'MALE' | 'FEMALE' | 'OTHER' | 'PREFER_NOT_TO_SAY'
    education_level: 'HIGH_SCHOOL' | 'TECHNICAL' | 'BACHELOR' | 'MASTER' | 'PHD'
  }
  contact: {
    phone: string
    mobile: string
    email: string
    address: {
      street: string
      number: string
      neighborhood: string
      city: string
      state: string
      zipcode: string
    }
    emergency_contact: {
      name: string
      relationship: string
      phone: string
    }
  }
  professional: {
    experience_years: number
    specializations: Array<'HISTORICAL' | 'CULTURAL' | 'NATURE' | 'ADVENTURE' | 'GASTRONOMIC' | 'RELIGIOUS' | 'URBAN' | 'RURAL'>
    languages: Array<{
      language: 'PT' | 'EN' | 'ES' | 'FR' | 'DE' | 'IT' | 'JP' | 'KO' | 'ZH'
      proficiency: 'BASIC' | 'INTERMEDIATE' | 'ADVANCED' | 'NATIVE'
      certified: boolean
    }>
  }
  services: {
    tour_types: Array<'WALKING' | 'DRIVING' | 'CYCLING' | 'BOAT' | 'HIKING' | 'CULTURAL' | 'HISTORICAL' | 'GASTRONOMIC'>
    areas_covered: Array<{
      region: string
      attractions: Array<string>
      expertise_level: 'BASIC' | 'INTERMEDIATE' | 'EXPERT'
    }>
    group_sizes: {
      min_group_size: number
      max_group_size: number
      optimal_group_size: number
    }
  }
  pricing: {
    rate_structure: 'HOURLY' | 'HALF_DAY' | 'FULL_DAY' | 'CUSTOM'
    base_rates: Array<{
      service_type: string
      duration: number
      price: number
      currency: 'BRL' | 'USD' | 'EUR'
    }>
  }
  availability: {
    working_days: Array<'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY'>
    working_hours: {
      start_time: string
      end_time: string
    }
    advance_booking_required: number
  }
}

export interface TourismGuideFilters {
  name?: string
  registration_number?: string
  status?: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'PENDING_APPROVAL' | 'TRAINING'
  type?: 'LOCAL' | 'REGIONAL' | 'NATIONAL' | 'INTERNATIONAL' | 'SPECIALIZED'
  specialization?: 'HISTORICAL' | 'CULTURAL' | 'NATURE' | 'ADVENTURE' | 'GASTRONOMIC' | 'RELIGIOUS' | 'URBAN' | 'RURAL'
  language?: 'PT' | 'EN' | 'ES' | 'FR' | 'DE' | 'IT' | 'JP' | 'KO' | 'ZH'
  city?: string
  min_experience?: number
  max_experience?: number
  min_rating?: number
  available_date?: string
  tour_type?: 'WALKING' | 'DRIVING' | 'CYCLING' | 'BOAT' | 'HIKING' | 'CULTURAL' | 'HISTORICAL' | 'GASTRONOMIC'
  min_group_size?: number
  max_group_size?: number
  max_price?: number
  license_valid?: boolean
  created_from?: string
  created_to?: string
}

export const useTourismGuides = () => {
  const [guides, setGuides] = useState<TourismGuide[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchGuides = useCallback(async (filters?: TourismGuideFilters) => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.get('/tourism/guides', { params: filters })
      setGuides(response.data)
    } catch (err) {
      setError('Falha ao carregar guias de turismo')
      console.error('Error fetching tourism guides:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  const getGuideById = useCallback(async (id: string): Promise<TourismGuide | null> => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.get(`/tourism/guides/${id}`)
      return response.data
    } catch (err) {
      setError('Falha ao carregar guia de turismo')
      console.error('Error fetching tourism guide:', err)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const createGuide = useCallback(async (data: CreateTourismGuideData): Promise<TourismGuide | null> => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.post('/tourism/guides', data)
      const newGuide = response.data
      setGuides(prev => [...prev, newGuide])
      return newGuide
    } catch (err) {
      setError('Falha ao criar guia de turismo')
      console.error('Error creating tourism guide:', err)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const updateGuide = useCallback(async (id: string, data: Partial<CreateTourismGuideData>): Promise<TourismGuide | null> => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.put(`/tourism/guides/${id}`, data)
      const updatedGuide = response.data
      setGuides(prev => prev.map(guide => guide.id === id ? updatedGuide : guide))
      return updatedGuide
    } catch (err) {
      setError('Falha ao atualizar guia de turismo')
      console.error('Error updating tourism guide:', err)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const deleteGuide = useCallback(async (id: string): Promise<boolean> => {
    try {
      setLoading(true)
      setError(null)
      await apiClient.delete(`/tourism/guides/${id}`)
      setGuides(prev => prev.filter(guide => guide.id !== id))
      return true
    } catch (err) {
      setError('Falha ao excluir guia de turismo')
      console.error('Error deleting tourism guide:', err)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const updateStatus = useCallback(async (id: string, status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'TRAINING'): Promise<boolean> => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.patch(`/tourism/guides/${id}/status`, { status })
      const updatedGuide = response.data
      setGuides(prev => prev.map(guide => guide.id === id ? updatedGuide : guide))
      return true
    } catch (err) {
      setError('Falha ao atualizar status do guia')
      console.error('Error updating guide status:', err)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const createBooking = useCallback(async (guideId: string, booking: {
    client_name: string
    client_contact: string
    tour_date: string
    tour_type: string
    group_size: number
    duration: number
    price: number
    special_requests?: Array<string>
  }): Promise<boolean> => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.post(`/tourism/guides/${guideId}/bookings`, booking)
      const updatedGuide = response.data
      setGuides(prev => prev.map(guide => guide.id === guideId ? updatedGuide : guide))
      return true
    } catch (err) {
      setError('Falha ao criar reserva')
      console.error('Error creating booking:', err)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const updateBookingStatus = useCallback(async (guideId: string, bookingId: string, status: 'CONFIRMED' | 'CANCELLED' | 'COMPLETED', paymentStatus?: 'PENDING' | 'PARTIAL' | 'PAID' | 'REFUNDED'): Promise<boolean> => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.patch(`/tourism/guides/${guideId}/bookings/${bookingId}`, { status, payment_status: paymentStatus })
      const updatedGuide = response.data
      setGuides(prev => prev.map(guide => guide.id === guideId ? updatedGuide : guide))
      return true
    } catch (err) {
      setError('Falha ao atualizar status da reserva')
      console.error('Error updating booking status:', err)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const addReview = useCallback(async (guideId: string, review: {
    client_name: string
    rating: number
    comment: string
    tour_date: string
    tour_type: string
    categories: {
      knowledge: number
      communication: number
      punctuality: number
      friendliness: number
      organization: number
    }
  }): Promise<boolean> => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.post(`/tourism/guides/${guideId}/reviews`, review)
      const updatedGuide = response.data
      setGuides(prev => prev.map(guide => guide.id === guideId ? updatedGuide : guide))
      return true
    } catch (err) {
      setError('Falha ao adicionar avaliação')
      console.error('Error adding review:', err)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const addCertification = useCallback(async (guideId: string, certification: {
    name: string
    issuer: string
    number: string
    issued_date: string
    expiry_date: string
    category: 'GUIDE_LICENSE' | 'FIRST_AID' | 'LANGUAGE' | 'SPECIALIZATION' | 'SAFETY'
  }): Promise<boolean> => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.post(`/tourism/guides/${guideId}/certifications`, certification)
      const updatedGuide = response.data
      setGuides(prev => prev.map(guide => guide.id === guideId ? updatedGuide : guide))
      return true
    } catch (err) {
      setError('Falha ao adicionar certificação')
      console.error('Error adding certification:', err)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const recordTraining = useCallback(async (guideId: string, training: {
    course_name: string
    provider: string
    completion_date: string
    certificate_number: string
    hours: number
  }): Promise<boolean> => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.post(`/tourism/guides/${guideId}/training`, training)
      const updatedGuide = response.data
      setGuides(prev => prev.map(guide => guide.id === guideId ? updatedGuide : guide))
      return true
    } catch (err) {
      setError('Falha ao registrar treinamento')
      console.error('Error recording training:', err)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const reportIncident = useCallback(async (guideId: string, incident: {
    type: 'ACCIDENT' | 'COMPLAINT' | 'CANCELLATION' | 'EMERGENCY' | 'EQUIPMENT_FAILURE'
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
    description: string
    actions_taken: Array<string>
  }): Promise<boolean> => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.post(`/tourism/guides/${guideId}/incidents`, incident)
      const updatedGuide = response.data
      setGuides(prev => prev.map(guide => guide.id === guideId ? updatedGuide : guide))
      return true
    } catch (err) {
      setError('Falha ao reportar incidente')
      console.error('Error reporting incident:', err)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const getActiveGuides = useCallback(() => {
    return guides.filter(guide => guide.status === 'ACTIVE')
  }, [guides])

  const getGuidesBySpecialization = useCallback((specialization: 'HISTORICAL' | 'CULTURAL' | 'NATURE' | 'ADVENTURE' | 'GASTRONOMIC' | 'RELIGIOUS' | 'URBAN' | 'RURAL') => {
    return guides.filter(guide => guide.professional.specializations.includes(specialization))
  }, [guides])

  const getGuidesByLanguage = useCallback((language: 'PT' | 'EN' | 'ES' | 'FR' | 'DE' | 'IT' | 'JP' | 'KO' | 'ZH') => {
    return guides.filter(guide => guide.professional.languages.some(lang => lang.language === language))
  }, [guides])

  const getTopRatedGuides = useCallback((minRating: number = 4.5) => {
    return guides.filter(guide => guide.reviews.average_rating >= minRating)
      .sort((a, b) => b.reviews.average_rating - a.reviews.average_rating)
  }, [guides])

  const getAvailableGuides = useCallback((date: string) => {
    return guides.filter(guide => {
      if (guide.status !== 'ACTIVE') return false

      const requestDate = new Date(date)
      const dayOfWeek = requestDate.toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase()

      return guide.availability.working_days.includes(dayOfWeek as any)
    })
  }, [guides])

  const getGuidesByTourType = useCallback((tourType: 'WALKING' | 'DRIVING' | 'CYCLING' | 'BOAT' | 'HIKING' | 'CULTURAL' | 'HISTORICAL' | 'GASTRONOMIC') => {
    return guides.filter(guide => guide.services.tour_types.includes(tourType))
  }, [guides])

  const calculateTotalRevenue = useCallback(() => {
    return guides.reduce((total, guide) => total + guide.performance.revenue_generated, 0)
  }, [guides])

  useEffect(() => {
    fetchGuides()
  }, [fetchGuides])

  return {
    guides,
    loading,
    error,
    fetchGuides,
    getGuideById,
    createGuide,
    updateGuide,
    deleteGuide,
    updateStatus,
    createBooking,
    updateBookingStatus,
    addReview,
    addCertification,
    recordTraining,
    reportIncident,
    getActiveGuides,
    getGuidesBySpecialization,
    getGuidesByLanguage,
    getTopRatedGuides,
    getAvailableGuides,
    getGuidesByTourType,
    calculateTotalRevenue
  }
}