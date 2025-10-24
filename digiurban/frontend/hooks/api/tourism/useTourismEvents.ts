import { useState, useEffect, useCallback } from 'react'
import { apiClient } from '@/lib/api'

export interface TourismEvent {
  id: string
  title: string
  slug: string
  category: 'FESTIVAL' | 'CULTURAL' | 'SPORTS' | 'GASTRONOMIC' | 'RELIGIOUS' | 'MUSICAL' | 'EDUCATIONAL' | 'BUSINESS' | 'ADVENTURE'
  subcategory: string
  status: 'DRAFT' | 'PUBLISHED' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED' | 'POSTPONED'
  description: {
    short: string
    detailed: string
    highlights: Array<string>
    program_overview: string
  }
  dates: {
    start_date: string
    end_date: string
    registration_start?: string
    registration_end?: string
    setup_date?: string
    breakdown_date?: string
  }
  schedule: Array<{
    day: string
    activities: Array<{
      time: string
      title: string
      description: string
      location: string
      duration: number
      capacity?: number
      speaker?: string
      free: boolean
    }>
  }>
  location: {
    venue: {
      name: string
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
      capacity: number
      indoor: boolean
      accessibility: {
        wheelchair_accessible: boolean
        parking_available: boolean
        public_transport: boolean
      }
    }
    additional_locations?: Array<{
      name: string
      address: string
      purpose: string
    }>
  }
  organizer: {
    name: string
    type: 'GOVERNMENT' | 'PRIVATE' | 'NGO' | 'CULTURAL_INSTITUTION' | 'RELIGIOUS' | 'COOPERATIVE'
    contact: {
      phone: string
      email: string
      website?: string
      social_media: Array<{
        platform: 'FACEBOOK' | 'INSTAGRAM' | 'TWITTER' | 'YOUTUBE' | 'TIKTOK'
        handle: string
      }>
    }
    experience_level: 'FIRST_TIME' | 'EXPERIENCED' | 'VETERAN'
  }
  target_audience: {
    age_groups: Array<'CHILDREN' | 'TEENS' | 'ADULTS' | 'SENIORS' | 'ALL_AGES'>
    interests: Array<string>
    demographics: Array<'FAMILIES' | 'COUPLES' | 'SINGLES' | 'GROUPS' | 'TOURISTS' | 'LOCALS'>
    accessibility_needs: Array<'WHEELCHAIR' | 'VISUAL_IMPAIRMENT' | 'HEARING_IMPAIRMENT' | 'COGNITIVE' | 'NONE'>
  }
  tickets: {
    free_event: boolean
    ticket_types: Array<{
      name: string
      description: string
      price: number
      quantity_available: number
      quantity_sold: number
      sale_start: string
      sale_end: string
      conditions: Array<string>
      includes: Array<string>
    }>
    group_discounts: Array<{
      min_size: number
      discount_percentage: number
      conditions: Array<string>
    }>
    payment_methods: Array<'CASH' | 'CREDIT_CARD' | 'DEBIT_CARD' | 'PIX' | 'BANK_TRANSFER' | 'ONLINE'>
  }
  marketing: {
    promotion_channels: Array<'SOCIAL_MEDIA' | 'RADIO' | 'TV' | 'PRINT' | 'WEBSITE' | 'EMAIL' | 'OUTDOOR' | 'WORD_OF_MOUTH'>
    marketing_budget: number
    promotional_materials: Array<{
      type: 'POSTER' | 'FLYER' | 'BANNER' | 'VIDEO' | 'AUDIO' | 'DIGITAL_AD'
      title: string
      file_path: string
      usage_rights: string
    }>
    media_coverage: Array<{
      outlet: string
      type: 'PREVIEW' | 'LIVE_COVERAGE' | 'REVIEW' | 'INTERVIEW'
      date: string
      reach: number
    }>
  }
  logistics: {
    infrastructure_needs: Array<{
      item: string
      quantity: number
      provider?: string
      cost?: number
    }>
    services: Array<{
      type: 'SECURITY' | 'CLEANING' | 'CATERING' | 'SOUND' | 'LIGHTING' | 'DECORATION' | 'TRANSPORT'
      provider: string
      cost: number
      contact: string
    }>
    permits_required: Array<{
      permit_type: string
      issuing_authority: string
      status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'EXPIRED'
      expiry_date?: string
    }>
    insurance: {
      required: boolean
      policy_number?: string
      coverage_amount?: number
      provider?: string
    }
  }
  budget: {
    total_budget: number
    revenue: {
      ticket_sales: number
      sponsorships: number
      grants: number
      merchandising: number
      other: number
    }
    expenses: {
      venue: number
      marketing: number
      logistics: number
      staff: number
      permits: number
      insurance: number
      equipment: number
      other: number
    }
    profit_loss: number
  }
  sponsors: Array<{
    name: string
    level: 'TITLE' | 'PRESENTING' | 'MAJOR' | 'SUPPORTING' | 'MEDIA' | 'IN_KIND'
    contribution_amount?: number
    contribution_type: 'MONETARY' | 'PRODUCT' | 'SERVICE' | 'PROMOTION'
    benefits: Array<string>
    logo_url?: string
    website?: string
  }>
  safety: {
    safety_plan: boolean
    emergency_procedures: Array<string>
    medical_assistance: boolean
    security_personnel: number
    capacity_limits: {
      maximum_attendees: number
      covid_restrictions?: boolean
    }
    risk_assessment: Array<{
      risk: string
      probability: 'LOW' | 'MEDIUM' | 'HIGH'
      impact: 'LOW' | 'MEDIUM' | 'HIGH'
      mitigation: string
    }>
  }
  sustainability: {
    environmental_measures: Array<string>
    waste_management: Array<string>
    carbon_footprint_reduction: Array<string>
    local_supplier_percentage: number
    community_impact: Array<string>
  }
  multimedia: {
    photos: Array<{
      url: string
      caption: string
      category: 'PROMOTIONAL' | 'VENUE' | 'ACTIVITIES' | 'ATTENDEES' | 'BEHIND_SCENES'
      event_day?: string
    }>
    videos: Array<{
      url: string
      title: string
      type: 'PROMOTIONAL' | 'LIVE_STREAM' | 'HIGHLIGHTS' | 'DOCUMENTARY'
      duration: number
    }>
    live_stream: {
      available: boolean
      platforms: Array<'YOUTUBE' | 'FACEBOOK' | 'INSTAGRAM' | 'TWITCH' | 'CUSTOM'>
      url?: string
    }
  }
  attendance: {
    expected_attendees: number
    registered_attendees: number
    actual_attendees?: number
    demographics: {
      age_distribution: Array<{
        age_group: string
        percentage: number
      }>
      geographic_origin: Array<{
        location: string
        percentage: number
      }>
      visitor_type: Array<{
        type: 'LOCAL' | 'REGIONAL' | 'NATIONAL' | 'INTERNATIONAL'
        percentage: number
      }>
    }
  }
  feedback: {
    satisfaction_surveys: Array<{
      survey_date: string
      responses: number
      average_rating: number
      key_feedback: Array<string>
    }>
    testimonials: Array<{
      attendee_name: string
      quote: string
      permission_to_publish: boolean
    }>
    media_reviews: Array<{
      outlet: string
      rating?: number
      review_text: string
      publication_date: string
    }>
  }
  impact: {
    economic_impact: {
      local_spending: number
      jobs_created: number
      hotel_occupancy_increase: number
      restaurant_revenue_increase: number
    }
    tourism_metrics: {
      visitor_increase: number
      repeat_visitors: number
      extended_stays: number
      additional_attractions_visited: Array<string>
    }
    cultural_impact: Array<string>
    social_impact: Array<string>
  }
  created_at: string
  updated_at: string
}

export interface CreateTourismEventData {
  title: string
  category: 'FESTIVAL' | 'CULTURAL' | 'SPORTS' | 'GASTRONOMIC' | 'RELIGIOUS' | 'MUSICAL' | 'EDUCATIONAL' | 'BUSINESS' | 'ADVENTURE'
  subcategory: string
  description: {
    short: string
    detailed: string
    highlights: Array<string>
    program_overview: string
  }
  dates: {
    start_date: string
    end_date: string
    registration_start?: string
    registration_end?: string
  }
  location: {
    venue: {
      name: string
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
      capacity: number
      indoor: boolean
    }
  }
  organizer: {
    name: string
    type: 'GOVERNMENT' | 'PRIVATE' | 'NGO' | 'CULTURAL_INSTITUTION' | 'RELIGIOUS' | 'COOPERATIVE'
    contact: {
      phone: string
      email: string
      website?: string
    }
  }
  target_audience: {
    age_groups: Array<'CHILDREN' | 'TEENS' | 'ADULTS' | 'SENIORS' | 'ALL_AGES'>
    interests: Array<string>
    demographics: Array<'FAMILIES' | 'COUPLES' | 'SINGLES' | 'GROUPS' | 'TOURISTS' | 'LOCALS'>
  }
  tickets: {
    free_event: boolean
    ticket_types: Array<{
      name: string
      description: string
      price: number
      quantity_available: number
      sale_start: string
      sale_end: string
    }>
  }
  budget: {
    total_budget: number
  }
  expected_attendees: number
}

export interface TourismEventFilters {
  title?: string
  category?: 'FESTIVAL' | 'CULTURAL' | 'SPORTS' | 'GASTRONOMIC' | 'RELIGIOUS' | 'MUSICAL' | 'EDUCATIONAL' | 'BUSINESS' | 'ADVENTURE'
  subcategory?: string
  status?: 'DRAFT' | 'PUBLISHED' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED' | 'POSTPONED'
  organizer_name?: string
  organizer_type?: 'GOVERNMENT' | 'PRIVATE' | 'NGO' | 'CULTURAL_INSTITUTION' | 'RELIGIOUS' | 'COOPERATIVE'
  city?: string
  venue?: string
  free_event?: boolean
  start_date_from?: string
  start_date_to?: string
  end_date_from?: string
  end_date_to?: string
  min_capacity?: number
  max_capacity?: number
  min_budget?: number
  max_budget?: number
  indoor?: boolean
  wheelchair_accessible?: boolean
  age_group?: 'CHILDREN' | 'TEENS' | 'ADULTS' | 'SENIORS' | 'ALL_AGES'
  target_demographic?: 'FAMILIES' | 'COUPLES' | 'SINGLES' | 'GROUPS' | 'TOURISTS' | 'LOCALS'
  has_live_stream?: boolean
  created_from?: string
  created_to?: string
}

export const useTourismEvents = () => {
  const [events, setEvents] = useState<TourismEvent[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchEvents = useCallback(async (filters?: TourismEventFilters) => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.get('/tourism/events', { params: filters })
      setEvents(response.data)
    } catch (err) {
      setError('Falha ao carregar eventos turísticos')
      console.error('Error fetching tourism events:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  const getEventById = useCallback(async (id: string): Promise<TourismEvent | null> => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.get(`/tourism/events/${id}`)
      return response.data
    } catch (err) {
      setError('Falha ao carregar evento turístico')
      console.error('Error fetching tourism event:', err)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const createEvent = useCallback(async (data: CreateTourismEventData): Promise<TourismEvent | null> => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.post('/tourism/events', data)
      const newEvent = response.data
      setEvents(prev => [...prev, newEvent])
      return newEvent
    } catch (err) {
      setError('Falha ao criar evento turístico')
      console.error('Error creating tourism event:', err)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const updateEvent = useCallback(async (id: string, data: Partial<CreateTourismEventData>): Promise<TourismEvent | null> => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.put(`/tourism/events/${id}`, data)
      const updatedEvent = response.data
      setEvents(prev => prev.map(event => event.id === id ? updatedEvent : event))
      return updatedEvent
    } catch (err) {
      setError('Falha ao atualizar evento turístico')
      console.error('Error updating tourism event:', err)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const deleteEvent = useCallback(async (id: string): Promise<boolean> => {
    try {
      setLoading(true)
      setError(null)
      await apiClient.delete(`/tourism/events/${id}`)
      setEvents(prev => prev.filter(event => event.id !== id))
      return true
    } catch (err) {
      setError('Falha ao excluir evento turístico')
      console.error('Error deleting tourism event:', err)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const updateStatus = useCallback(async (id: string, status: 'DRAFT' | 'PUBLISHED' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED' | 'POSTPONED'): Promise<boolean> => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.patch(`/tourism/events/${id}/status`, { status })
      const updatedEvent = response.data
      setEvents(prev => prev.map(event => event.id === id ? updatedEvent : event))
      return true
    } catch (err) {
      setError('Falha ao atualizar status do evento')
      console.error('Error updating event status:', err)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const addSponsor = useCallback(async (eventId: string, sponsor: {
    name: string
    level: 'TITLE' | 'PRESENTING' | 'MAJOR' | 'SUPPORTING' | 'MEDIA' | 'IN_KIND'
    contribution_amount?: number
    contribution_type: 'MONETARY' | 'PRODUCT' | 'SERVICE' | 'PROMOTION'
    benefits: Array<string>
    logo_url?: string
    website?: string
  }): Promise<boolean> => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.post(`/tourism/events/${eventId}/sponsors`, sponsor)
      const updatedEvent = response.data
      setEvents(prev => prev.map(event => event.id === eventId ? updatedEvent : event))
      return true
    } catch (err) {
      setError('Falha ao adicionar patrocinador')
      console.error('Error adding sponsor:', err)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const recordTicketSale = useCallback(async (eventId: string, sale: {
    ticket_type: string
    quantity: number
    buyer_name: string
    buyer_email: string
    total_amount: number
    payment_method: string
  }): Promise<boolean> => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.post(`/tourism/events/${eventId}/ticket-sales`, sale)
      const updatedEvent = response.data
      setEvents(prev => prev.map(event => event.id === eventId ? updatedEvent : event))
      return true
    } catch (err) {
      setError('Falha ao registrar venda de ingresso')
      console.error('Error recording ticket sale:', err)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const recordAttendance = useCallback(async (eventId: string, attendance: {
    actual_attendees: number
    demographics: {
      age_distribution: Array<{
        age_group: string
        percentage: number
      }>
      geographic_origin: Array<{
        location: string
        percentage: number
      }>
    }
  }): Promise<boolean> => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.post(`/tourism/events/${eventId}/attendance`, attendance)
      const updatedEvent = response.data
      setEvents(prev => prev.map(event => event.id === eventId ? updatedEvent : event))
      return true
    } catch (err) {
      setError('Falha ao registrar presença')
      console.error('Error recording attendance:', err)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const addFeedback = useCallback(async (eventId: string, feedback: {
    survey_date: string
    responses: number
    average_rating: number
    key_feedback: Array<string>
  }): Promise<boolean> => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.post(`/tourism/events/${eventId}/feedback`, feedback)
      const updatedEvent = response.data
      setEvents(prev => prev.map(event => event.id === eventId ? updatedEvent : event))
      return true
    } catch (err) {
      setError('Falha ao adicionar feedback')
      console.error('Error adding feedback:', err)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const recordImpact = useCallback(async (eventId: string, impact: {
    economic_impact: {
      local_spending: number
      jobs_created: number
      hotel_occupancy_increase: number
      restaurant_revenue_increase: number
    }
    tourism_metrics: {
      visitor_increase: number
      repeat_visitors: number
      extended_stays: number
    }
  }): Promise<boolean> => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.post(`/tourism/events/${eventId}/impact`, impact)
      const updatedEvent = response.data
      setEvents(prev => prev.map(event => event.id === eventId ? updatedEvent : event))
      return true
    } catch (err) {
      setError('Falha ao registrar impacto')
      console.error('Error recording impact:', err)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const getEventsByCategory = useCallback((category: 'FESTIVAL' | 'CULTURAL' | 'SPORTS' | 'GASTRONOMIC' | 'RELIGIOUS' | 'MUSICAL' | 'EDUCATIONAL' | 'BUSINESS' | 'ADVENTURE') => {
    return events.filter(event => event.category === category)
  }, [events])

  const getActiveEvents = useCallback(() => {
    return events.filter(event => event.status === 'ACTIVE')
  }, [events])

  const getUpcomingEvents = useCallback((days: number = 30) => {
    const futureDate = new Date()
    futureDate.setDate(futureDate.getDate() + days)

    return events.filter(event => {
      const eventDate = new Date(event.dates.start_date)
      return eventDate >= new Date() && eventDate <= futureDate
    })
  }, [events])

  const getFreeEvents = useCallback(() => {
    return events.filter(event => event.tickets.free_event)
  }, [events])

  const getEventsByVenue = useCallback((venueName: string) => {
    return events.filter(event => event.location.venue.name === venueName)
  }, [events])

  const getPopularEvents = useCallback(() => {
    return events.filter(event => event.attendance.actual_attendees && event.attendance.actual_attendees > event.attendance.expected_attendees)
      .sort((a, b) => (b.attendance.actual_attendees || 0) - (a.attendance.actual_attendees || 0))
  }, [events])

  useEffect(() => {
    fetchEvents()
  }, [fetchEvents])

  return {
    events,
    loading,
    error,
    fetchEvents,
    getEventById,
    createEvent,
    updateEvent,
    deleteEvent,
    updateStatus,
    addSponsor,
    recordTicketSale,
    recordAttendance,
    addFeedback,
    recordImpact,
    getEventsByCategory,
    getActiveEvents,
    getUpcomingEvents,
    getFreeEvents,
    getEventsByVenue,
    getPopularEvents
  }
}