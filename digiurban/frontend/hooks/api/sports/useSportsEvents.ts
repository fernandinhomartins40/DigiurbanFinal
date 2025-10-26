'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAdminAuth } from '@/contexts/AdminAuthContext'

interface SportsEvent {
  id: string
  name: string
  type: 'COMPETITION' | 'TRAINING' | 'CLINIC' | 'DEMONSTRATION' | 'CEREMONY' | 'MEETING' | 'SOCIAL'
  modality?: string
  date: string
  time: string
  duration: number
  location: string
  venue: string
  description: string
  targetAudience: 'ATHLETES' | 'COACHES' | 'COMMUNITY' | 'YOUTH' | 'ALL'
  capacity?: number
  currentParticipants: number
  registrationRequired: boolean
  registrationDeadline?: string
  cost?: number
  organizer: string
  instructors?: { name: string; specialization: string; bio: string }[]
  equipment: string[]
  materials?: string[]
  requirements?: string[]
  benefits?: string[]
  schedule?: { time: string; activity: string; duration: number }[]
  status: 'PLANNED' | 'REGISTRATION_OPEN' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'
  participants?: {
    id: string
    name: string
    phone: string
    email?: string
    registrationDate: string
    paymentStatus: 'PENDING' | 'PAID' | 'EXEMPT'
    attendance?: 'PRESENT' | 'ABSENT'
  }[]
  photos?: string[]
  results?: string
  feedback?: { rating: number; comments: string; participant: string }[]
  averageRating?: number
  certificatesIssued?: number
  createdAt: string
  updatedAt: string
}

interface CreateSportsEventData {
  name: string
  type: 'COMPETITION' | 'TRAINING' | 'CLINIC' | 'DEMONSTRATION' | 'CEREMONY' | 'MEETING' | 'SOCIAL'
  modality?: string
  date: string
  time: string
  duration: number
  location: string
  venue: string
  description: string
  targetAudience: 'ATHLETES' | 'COACHES' | 'COMMUNITY' | 'YOUTH' | 'ALL'
  capacity?: number
  registrationRequired: boolean
  registrationDeadline?: string
  cost?: number
  organizer: string
  instructors?: { name: string; specialization: string; bio: string }[]
  equipment: string[]
  materials?: string[]
  requirements?: string[]
}

interface UseSportsEventsReturn {
  sportsEvents: SportsEvent[]
  loading: boolean
  error: string | null
  createEvent: (data: CreateSportsEventData) => Promise<SportsEvent>
  updateEvent: (id: string, data: Partial<CreateSportsEventData>) => Promise<SportsEvent>
  registerParticipant: (eventId: string, participant: any) => Promise<SportsEvent>
  unregisterParticipant: (eventId: string, participantId: string) => Promise<SportsEvent>
  markAttendance: (eventId: string, participantId: string, attended: boolean) => Promise<SportsEvent>
  startEvent: (id: string) => Promise<SportsEvent>
  completeEvent: (id: string, results?: string) => Promise<SportsEvent>
  cancelEvent: (id: string, reason: string) => Promise<SportsEvent>
  addFeedback: (eventId: string, feedback: any) => Promise<SportsEvent>
  deleteEvent: (id: string) => Promise<void>
  getEventsByType: (type: string) => SportsEvent[]
  getUpcomingEvents: () => SportsEvent[]
  getEventsNeedingRegistration: () => SportsEvent[]
  refreshEvents: () => Promise<void>
}

export function useSportsEvents(): UseSportsEventsReturn {
  const [sportsEvents, setSportsEvents] = useState<SportsEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await apiClient.get('/api/specialized/sports/events')
      setSportsEvents(data.events || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar eventos esportivos')
    } finally {
      setLoading(false)
    }
  }, [])

  const createEvent = useCallback(async (data: CreateSportsEventData): Promise<SportsEvent> => {
    try {
      setError(null)
      const response = await apiClient.post('/api/specialized/sports/events', data)
      const newEvent = response.event
      setSportsEvents(prev => [newEvent, ...prev])
      return newEvent
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar evento'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const updateEvent = useCallback(async (id: string, data: Partial<CreateSportsEventData>): Promise<SportsEvent> => {
    try {
      setError(null)
      const response = await apiClient.put(`/api/specialized/sports/events/${id}`, data)
      const updatedEvent = response.event
      setSportsEvents(prev => prev.map(event => event.id === id ? updatedEvent : event))
      return updatedEvent
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar evento'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const registerParticipant = useCallback(async (eventId: string, participant: any): Promise<SportsEvent> => {
    try {
      setError(null)
      const response = await apiClient.post(`/api/specialized/sports/events/${eventId}/participants`, participant)
      const updatedEvent = response.event
      setSportsEvents(prev => prev.map(event => event.id === eventId ? updatedEvent : event))
      return updatedEvent
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao inscrever participante'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const unregisterParticipant = useCallback(async (eventId: string, participantId: string): Promise<SportsEvent> => {
    try {
      setError(null)
      const response = await apiClient.delete(`/api/specialized/sports/events/${eventId}/participants/${participantId}`)
      const updatedEvent = response.event
      setSportsEvents(prev => prev.map(event => event.id === eventId ? updatedEvent : event))
      return updatedEvent
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao cancelar inscrição'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const markAttendance = useCallback(async (eventId: string, participantId: string, attended: boolean): Promise<SportsEvent> => {
    try {
      setError(null)
      const response = await apiClient.put(`/api/specialized/sports/events/${eventId}/participants/${participantId}/attendance`, { attended })
      const updatedEvent = response.event
      setSportsEvents(prev => prev.map(event => event.id === eventId ? updatedEvent : event))
      return updatedEvent
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao marcar presença'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const startEvent = useCallback(async (id: string): Promise<SportsEvent> => {
    return updateEvent(id, { status: 'IN_PROGRESS' } as any)
  }, [updateEvent])

  const completeEvent = useCallback(async (id: string, results?: string): Promise<SportsEvent> => {
    return updateEvent(id, { status: 'COMPLETED', results } as any)
  }, [updateEvent])

  const cancelEvent = useCallback(async (id: string, reason: string): Promise<SportsEvent> => {
    return updateEvent(id, { status: 'CANCELLED' } as any)
  }, [updateEvent])

  const addFeedback = useCallback(async (eventId: string, feedback: any): Promise<SportsEvent> => {
    try {
      setError(null)
      const response = await apiClient.post(`/api/specialized/sports/events/${eventId}/feedback`, feedback)
      const updatedEvent = response.event
      setSportsEvents(prev => prev.map(event => event.id === eventId ? updatedEvent : event))
      return updatedEvent
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao adicionar feedback'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const deleteEvent = useCallback(async (id: string): Promise<void> => {
    try {
      setError(null)
      await apiClient.delete(`/api/specialized/sports/events/${id}`)
      setSportsEvents(prev => prev.filter(event => event.id !== id))
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao excluir evento'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const getEventsByType = useCallback((type: string) => sportsEvents.filter(event => event.type === type), [sportsEvents])
  const getUpcomingEvents = useCallback(() => {
    const today = new Date()
    return sportsEvents.filter(event => new Date(event.date) > today && event.status !== 'CANCELLED')
  }, [sportsEvents])
  const getEventsNeedingRegistration = useCallback(() => {
    return sportsEvents.filter(event => event.registrationRequired && event.status === 'REGISTRATION_OPEN')
  }, [sportsEvents])

  const refreshEvents = useCallback(async () => {
    await fetchEvents()
  }, [fetchEvents])

  useEffect(() => {
    fetchEvents()
  }, [fetchEvents])

  return {
    sportsEvents,
    loading,
    error,
    createEvent,
    updateEvent,
    registerParticipant,
    unregisterParticipant,
    markAttendance,
    startEvent,
    completeEvent,
    cancelEvent,
    addFeedback,
    deleteEvent,
    getEventsByType,
    getUpcomingEvents,
    getEventsNeedingRegistration,
    refreshEvents
  }
}