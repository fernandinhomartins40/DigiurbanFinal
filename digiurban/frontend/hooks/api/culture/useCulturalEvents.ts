import { useState, useEffect, useCallback } from 'react'
import { apiClient } from '@/lib/api-client'

export interface CulturalEvent {
  id: string
  title: string
  subtitle?: string
  type: 'THEATER' | 'MUSIC' | 'DANCE' | 'EXHIBITION' | 'CINEMA' | 'LITERATURE' | 'WORKSHOP' | 'FESTIVAL' | 'CONFERENCE' | 'OTHER'
  category: 'POPULAR' | 'CLASSICAL' | 'CONTEMPORARY' | 'TRADITIONAL' | 'EXPERIMENTAL' | 'EDUCATIONAL' | 'COMMUNITY'
  status: 'PLANNING' | 'APPROVED' | 'MARKETING' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED' | 'POSTPONED'
  visibility: 'PUBLIC' | 'PRIVATE' | 'RESTRICTED'
  description: string
  shortDescription: string
  objectives: string[]
  targetAudience: {
    ageGroups: string[]
    demographics: string[]
    estimatedAttendance: number
    accessibilityNeeds: string[]
  }
  schedule: {
    startDate: string
    endDate: string
    sessions: Array<{
      id: string
      date: string
      startTime: string
      endTime: string
      duration: number
      capacity: number
      price: number
      soldTickets: number
      availableTickets: number
      status: 'SCHEDULED' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED'
    }>
    timezone: string
    rehearsals?: Array<{
      date: string
      startTime: string
      endTime: string
      location: string
      notes?: string
    }>
  }
  location: {
    venue: {
      id: string
      name: string
      type: 'THEATER' | 'AUDITORIUM' | 'MUSEUM' | 'GALLERY' | 'PARK' | 'SQUARE' | 'COMMUNITY_CENTER' | 'OTHER'
      address: string
      capacity: number
      accessibility: string[]
      equipment: string[]
    }
    specificArea?: string
    setup: {
      stageConfiguration?: string
      soundSystem: boolean
      lightingSystem: boolean
      projectionEquipment: boolean
      specialRequirements: string[]
    }
  }
  production: {
    organizer: {
      id: string
      name: string
      type: 'MUNICIPAL' | 'PRIVATE' | 'NGO' | 'ARTIST' | 'GROUP'
      contact: {
        email: string
        phone: string
        responsible: string
      }
    }
    producers: Array<{
      id: string
      name: string
      role: string
      contact: string
    }>
    artists: Array<{
      id: string
      name: string
      type: 'INDIVIDUAL' | 'GROUP' | 'COMPANY'
      role: 'PERFORMER' | 'DIRECTOR' | 'MUSICIAN' | 'DANCER' | 'ACTOR' | 'CURATOR' | 'OTHER'
      fee: number
      contact: string
      requirements?: string[]
    }>
    staff: Array<{
      id: string
      name: string
      function: 'SECURITY' | 'SOUND_TECH' | 'LIGHTING_TECH' | 'STAGE_MANAGER' | 'COORDINATOR' | 'OTHER'
      schedule: string
      payment: number
    }>
  }
  marketing: {
    poster?: {
      url: string
      designer: string
      approved: boolean
    }
    materials: Array<{
      type: 'POSTER' | 'FLYER' | 'BANNER' | 'DIGITAL' | 'PRESS_RELEASE' | 'SOCIAL_MEDIA'
      url?: string
      description: string
      status: 'DESIGNING' | 'APPROVED' | 'PRINTING' | 'DISTRIBUTED'
      quantity?: number
      cost?: number
    }>
    socialMedia: {
      facebook?: string
      instagram?: string
      youtube?: string
      website?: string
    }
    mediaPartners: Array<{
      name: string
      type: 'TV' | 'RADIO' | 'NEWSPAPER' | 'DIGITAL' | 'BLOG'
      contact: string
      agreement: string
    }>
  }
  budget: {
    total: number
    currency: string
    breakdown: {
      artists: number
      venue: number
      equipment: number
      marketing: number
      staff: number
      materials: number
      transportation: number
      other: number
    }
    funding: Array<{
      source: 'MUNICIPAL' | 'STATE' | 'FEDERAL' | 'PRIVATE' | 'SPONSORSHIP' | 'TICKET_SALES'
      amount: number
      confirmed: boolean
      conditions?: string[]
    }>
    expenses: Array<{
      id: string
      category: string
      description: string
      amount: number
      date: string
      supplier: string
      status: 'PLANNED' | 'COMMITTED' | 'PAID'
    }>
    revenue: Array<{
      source: string
      amount: number
      date: string
      confirmed: boolean
    }>
  }
  tickets: {
    pricing: Array<{
      category: string
      price: number
      quantity: number
      available: number
      description?: string
    }>
    sales: {
      platform: string
      commission: number
      totalSold: number
      totalRevenue: number
      salesByDate: Array<{
        date: string
        quantity: number
        revenue: number
      }>
    }
    accessibility: {
      wheelchairSpaces: number
      companionTickets: number
      discounts: Array<{
        type: 'SENIOR' | 'STUDENT' | 'LOW_INCOME' | 'DISABILITY' | 'GROUP'
        percentage: number
        requirements: string[]
      }>
    }
  }
  logistics: {
    equipment: Array<{
      item: string
      quantity: number
      source: 'VENUE' | 'RENTAL' | 'MUNICIPAL' | 'ARTIST'
      cost: number
      responsible: string
    }>
    transportation: Array<{
      type: 'ARTIST' | 'EQUIPMENT' | 'MATERIALS'
      details: string
      cost: number
      responsible: string
    }>
    catering?: {
      required: boolean
      details: string
      cost: number
      supplier: string
    }
    security: {
      required: boolean
      type: 'MUNICIPAL' | 'PRIVATE'
      personnel: number
      cost: number
      contact: string
    }
  }
  documentation: {
    permits: Array<{
      type: string
      number: string
      issuingBody: string
      issueDate: string
      expiryDate: string
      status: 'PENDING' | 'APPROVED' | 'EXPIRED' | 'DENIED'
    }>
    contracts: Array<{
      id: string
      type: 'ARTIST' | 'VENUE' | 'SUPPLIER' | 'SPONSOR'
      party: string
      value: number
      signed: boolean
      url?: string
    }>
    reports: Array<{
      type: 'ATTENDANCE' | 'FINANCIAL' | 'EVALUATION' | 'INCIDENT'
      date: string
      author: string
      url: string
    }>
    media: Array<{
      type: 'PHOTO' | 'VIDEO' | 'AUDIO' | 'PRESS'
      description: string
      url: string
      date: string
      credit: string
    }>
  }
  evaluation: {
    attendance: {
      expected: number
      actual: number
      bySession: Array<{
        sessionId: string
        attendance: number
        capacity: number
        occupancyRate: number
      }>
    }
    feedback: Array<{
      id: string
      rating: number
      comment: string
      date: string
      source: 'AUDIENCE' | 'ARTIST' | 'STAFF' | 'PARTNER'
    }>
    impact: {
      culturalImpact: string
      socialImpact: string
      economicImpact: string
      educationalImpact?: string
    }
    lessons: string[]
    recommendations: string[]
  }
  compliance: {
    accessibility: {
      physicalAccess: boolean
      communicationSupport: boolean
      materials: boolean
      staff: boolean
      notes: string
    }
    safety: {
      emergencyPlan: boolean
      firstAid: boolean
      fireExtinguishers: boolean
      evacuation: boolean
      notes: string
    }
    legal: {
      copyrights: boolean
      permits: boolean
      insurance: boolean
      contracts: boolean
      notes: string
    }
  }
  createdAt: string
  updatedAt: string
  createdBy: string
  lastModifiedBy: string
}

export interface CreateCulturalEventData {
  title: string
  subtitle?: string
  type: 'THEATER' | 'MUSIC' | 'DANCE' | 'EXHIBITION' | 'CINEMA' | 'LITERATURE' | 'WORKSHOP' | 'FESTIVAL' | 'CONFERENCE' | 'OTHER'
  category: 'POPULAR' | 'CLASSICAL' | 'CONTEMPORARY' | 'TRADITIONAL' | 'EXPERIMENTAL' | 'EDUCATIONAL' | 'COMMUNITY'
  visibility: 'PUBLIC' | 'PRIVATE' | 'RESTRICTED'
  description: string
  shortDescription: string
  objectives: string[]
  targetAudience: {
    ageGroups: string[]
    demographics: string[]
    estimatedAttendance: number
    accessibilityNeeds: string[]
  }
  schedule: {
    startDate: string
    endDate: string
    sessions: Array<{
      date: string
      startTime: string
      endTime: string
      capacity: number
      price: number
    }>
  }
  venueId: string
  organizerId: string
  budget: {
    total: number
    breakdown: {
      artists: number
      venue: number
      equipment: number
      marketing: number
      staff: number
      materials: number
      transportation: number
      other: number
    }
  }
}

export interface CulturalEventFilters {
  type?: string
  category?: string
  status?: string
  visibility?: string
  venueId?: string
  organizerId?: string
  dateFrom?: string
  dateTo?: string
  priceMin?: number
  priceMax?: number
}

export function useCulturalEvents() {
  const [events, setEvents] = useState<CulturalEvent[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchEvents = useCallback(async (filters?: CulturalEventFilters) => {
    setIsLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams()
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            params.append(key, value.toString())
          }
        })
      }
      const response = await apiClient.get(`/culture/events?${params}`)
      setEvents(response.data.data || [])
    } catch (err) {
      setError('Erro ao carregar eventos culturais')
      console.error('Error fetching cultural events:', err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const createEvent = useCallback(async (data: CreateCulturalEventData) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await apiClient.post('/culture/events', data)
      const newEvent = response.data.data
      setEvents(prev => [newEvent, ...prev])
      return newEvent
    } catch (err) {
      setError('Erro ao criar evento cultural')
      console.error('Error creating cultural event:', err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const updateEvent = useCallback(async (id: string, data: Partial<CreateCulturalEventData>) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await apiClient.put(`/culture/events/${id}`, data)
      const updatedEvent = response.data.data
      setEvents(prev => prev.map(event => event.id === id ? updatedEvent : event))
      return updatedEvent
    } catch (err) {
      setError('Erro ao atualizar evento cultural')
      console.error('Error updating cultural event:', err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const deleteEvent = useCallback(async (id: string) => {
    setIsLoading(true)
    setError(null)
    try {
      await apiClient.delete(`/culture/events/${id}`)
      setEvents(prev => prev.filter(event => event.id !== id))
    } catch (err) {
      setError('Erro ao excluir evento cultural')
      console.error('Error deleting cultural event:', err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const approveEvent = useCallback(async (id: string, approvalData: {
    notes?: string
    conditions?: string[]
    approvedBudget: number
  }) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await apiClient.post(`/culture/events/${id}/approve`, approvalData)
      const updatedEvent = response.data.data
      setEvents(prev => prev.map(event => event.id === id ? updatedEvent : event))
      return updatedEvent
    } catch (err) {
      setError('Erro ao aprovar evento cultural')
      console.error('Error approving cultural event:', err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const addArtist = useCallback(async (id: string, artistData: {
    artistId: string
    role: 'PERFORMER' | 'DIRECTOR' | 'MUSICIAN' | 'DANCER' | 'ACTOR' | 'CURATOR' | 'OTHER'
    fee: number
    requirements?: string[]
  }) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await apiClient.post(`/culture/events/${id}/artists`, artistData)
      const updatedEvent = response.data.data
      setEvents(prev => prev.map(event => event.id === id ? updatedEvent : event))
      return updatedEvent
    } catch (err) {
      setError('Erro ao adicionar artista ao evento')
      console.error('Error adding artist to event:', err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const recordAttendance = useCallback(async (id: string, sessionId: string, attendanceData: {
    actualAttendance: number
    ticketsSold: number
    revenue: number
    notes?: string
  }) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await apiClient.post(`/culture/events/${id}/sessions/${sessionId}/attendance`, attendanceData)
      const updatedEvent = response.data.data
      setEvents(prev => prev.map(event => event.id === id ? updatedEvent : event))
      return updatedEvent
    } catch (err) {
      setError('Erro ao registrar presença')
      console.error('Error recording attendance:', err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const addFeedback = useCallback(async (id: string, feedbackData: {
    rating: number
    comment: string
    source: 'AUDIENCE' | 'ARTIST' | 'STAFF' | 'PARTNER'
  }) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await apiClient.post(`/culture/events/${id}/feedback`, feedbackData)
      const updatedEvent = response.data.data
      setEvents(prev => prev.map(event => event.id === id ? updatedEvent : event))
      return updatedEvent
    } catch (err) {
      setError('Erro ao adicionar avaliação')
      console.error('Error adding feedback:', err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const uploadMedia = useCallback(async (id: string, mediaData: {
    files: File[]
    type: 'PHOTO' | 'VIDEO' | 'AUDIO' | 'PRESS'
    description: string
    credit: string
  }) => {
    setIsLoading(true)
    setError(null)
    try {
      const formData = new FormData()
      mediaData.files.forEach((file, index) => {
        formData.append(`files[${index}]`, file)
      })
      formData.append('type', mediaData.type)
      formData.append('description', mediaData.description)
      formData.append('credit', mediaData.credit)

      const response = await apiClient.post(`/culture/events/${id}/media`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      const updatedEvent = response.data.data
      setEvents(prev => prev.map(event => event.id === id ? updatedEvent : event))
      return updatedEvent
    } catch (err) {
      setError('Erro ao enviar mídia')
      console.error('Error uploading media:', err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const generateReport = useCallback(async (id: string, reportType: 'ATTENDANCE' | 'FINANCIAL' | 'EVALUATION') => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await apiClient.post(`/culture/events/${id}/reports`, { type: reportType })
      return response.data.data
    } catch (err) {
      setError('Erro ao gerar relatório do evento')
      console.error('Error generating event report:', err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const getEventById = useCallback((id: string) => {
    return events.find(event => event.id === id)
  }, [events])

  const getEventsByStatus = useCallback((status: string) => {
    return events.filter(event => event.status === status)
  }, [events])

  const getEventsByType = useCallback((type: string) => {
    return events.filter(event => event.type === type)
  }, [events])

  const getEventsByVenue = useCallback((venueId: string) => {
    return events.filter(event => event.location.venue.id === venueId)
  }, [events])

  const getUpcomingEvents = useCallback((days: number = 30) => {
    const today = new Date()
    const futureDate = new Date()
    futureDate.setDate(today.getDate() + days)

    return events.filter(event => {
      const eventStart = new Date(event.schedule.startDate)
      return eventStart >= today && eventStart <= futureDate
    })
  }, [events])

  const getActiveEvents = useCallback(() => {
    const today = new Date().toISOString().split('T')[0]
    return events.filter(event =>
      event.schedule.startDate <= today &&
      event.schedule.endDate >= today &&
      event.status === 'ACTIVE'
    )
  }, [events])

  const getEventsByAudience = useCallback((ageGroup: string) => {
    return events.filter(event =>
      event.targetAudience.ageGroups.includes(ageGroup)
    )
  }, [events])

  const getTotalBudget = useCallback((status?: string) => {
    const filteredEvents = status
      ? events.filter(event => event.status === status)
      : events
    return filteredEvents.reduce((total, event) => total + event.budget.total, 0)
  }, [events])

  const getTotalAttendance = useCallback((period?: { start: string; end: string }) => {
    let filteredEvents = events
    if (period) {
      filteredEvents = events.filter(event =>
        event.schedule.startDate >= period.start &&
        event.schedule.endDate <= period.end
      )
    }
    return filteredEvents.reduce((total, event) =>
      total + (event.evaluation?.attendance?.actual || 0), 0)
  }, [events])

  useEffect(() => {
    fetchEvents()
  }, [fetchEvents])

  return {
    events,
    isLoading,
    error,
    fetchEvents,
    createEvent,
    updateEvent,
    deleteEvent,
    approveEvent,
    addArtist,
    recordAttendance,
    addFeedback,
    uploadMedia,
    generateReport,
    getEventById,
    getEventsByStatus,
    getEventsByType,
    getEventsByVenue,
    getUpcomingEvents,
    getActiveEvents,
    getEventsByAudience,
    getTotalBudget,
    getTotalAttendance
  }
}