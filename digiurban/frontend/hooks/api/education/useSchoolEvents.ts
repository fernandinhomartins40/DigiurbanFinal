'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAdminAuth } from '@/contexts/AdminAuthContext'

// Types
interface SchoolEvent {
  id: string
  schoolId?: string
  title: string
  description?: string
  eventType: 'ACADEMIC' | 'CULTURAL' | 'SPORTS' | 'ADMINISTRATIVE' | 'HOLIDAY' | 'VACATION' | 'MEETING' | 'CELEBRATION' | 'OTHER'
  startDate: string
  endDate: string
  startTime?: string
  endTime?: string
  location?: string
  targetAudience: 'ALL_STUDENTS' | 'SPECIFIC_GRADES' | 'TEACHERS' | 'PARENTS' | 'COMMUNITY' | 'STAFF'
  targetGrades?: string[]
  organizerName: string
  organizerContact?: string
  capacity?: number
  registrationRequired: boolean
  registrationDeadline?: string
  cost?: number
  materials?: string[]
  observations?: string
  status: 'PLANNED' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'POSTPONED'
  cancellationReason?: string
  postponedTo?: string
  isRecurring: boolean
  recurrencePattern?: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY'
  recurrenceEnd?: string
  attachments?: string[]
  school?: {
    id: string
    name: string
  }
  registrations?: {
    id: string
    studentId: string
    studentName: string
    registrationDate: string
  }[]
  createdAt: string
  updatedAt: string
}

interface CreateSchoolEventData {
  schoolId?: string
  title: string
  description?: string
  eventType: 'ACADEMIC' | 'CULTURAL' | 'SPORTS' | 'ADMINISTRATIVE' | 'HOLIDAY' | 'VACATION' | 'MEETING' | 'CELEBRATION' | 'OTHER'
  startDate: string
  endDate: string
  startTime?: string
  endTime?: string
  location?: string
  targetAudience: 'ALL_STUDENTS' | 'SPECIFIC_GRADES' | 'TEACHERS' | 'PARENTS' | 'COMMUNITY' | 'STAFF'
  targetGrades?: string[]
  organizerName: string
  organizerContact?: string
  capacity?: number
  registrationRequired: boolean
  registrationDeadline?: string
  cost?: number
  materials?: string[]
  observations?: string
  isRecurring: boolean
  recurrencePattern?: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY'
  recurrenceEnd?: string
}

interface UpdateSchoolEventData extends Partial<CreateSchoolEventData> {
  status?: 'PLANNED' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'POSTPONED'
  cancellationReason?: string
  postponedTo?: string
}

interface EventFilters {
  schoolId?: string
  eventType?: 'ACADEMIC' | 'CULTURAL' | 'SPORTS' | 'ADMINISTRATIVE' | 'HOLIDAY' | 'VACATION' | 'MEETING' | 'CELEBRATION' | 'OTHER'
  targetAudience?: 'ALL_STUDENTS' | 'SPECIFIC_GRADES' | 'TEACHERS' | 'PARENTS' | 'COMMUNITY' | 'STAFF'
  status?: 'PLANNED' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'POSTPONED'
  dateFrom?: string
  dateTo?: string
  registrationRequired?: boolean
}

interface EventRegistration {
  id: string
  eventId: string
  studentId: string
  registrationDate: string
  status: 'REGISTERED' | 'CONFIRMED' | 'ATTENDED' | 'ABSENT' | 'CANCELLED'
  notes?: string
  student?: {
    id: string
    name: string
    registrationNumber: string
  }
}

interface UseSchoolEventsReturn {
  events: SchoolEvent[]
  eventRegistrations: EventRegistration[]
  loading: boolean
  error: string | null
  createEvent: (data: CreateSchoolEventData) => Promise<SchoolEvent>
  updateEvent: (id: string, data: UpdateSchoolEventData) => Promise<SchoolEvent>
  cancelEvent: (id: string, reason: string) => Promise<SchoolEvent>
  postponeEvent: (id: string, newDate: string, reason?: string) => Promise<SchoolEvent>
  deleteEvent: (id: string) => Promise<void>
  registerStudentForEvent: (eventId: string, studentId: string) => Promise<EventRegistration>
  unregisterStudentFromEvent: (eventId: string, studentId: string) => Promise<void>
  markEventAttendance: (eventId: string, studentId: string, attended: boolean) => Promise<EventRegistration>
  getEventById: (id: string) => SchoolEvent | undefined
  getEventsBySchool: (schoolId: string) => SchoolEvent[]
  getUpcomingEvents: (days?: number) => SchoolEvent[]
  getEventRegistrations: (eventId: string) => EventRegistration[]
  refreshEvents: (filters?: EventFilters) => Promise<void>
}

export function useSchoolEvents(initialFilters?: EventFilters): UseSchoolEventsReturn {
  const [events, setEvents] = useState<SchoolEvent[]>([])
  const [eventRegistrations, setEventRegistrations] = useState<EventRegistration[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchEvents = useCallback(async (filters?: EventFilters) => {
    try {
      setLoading(true)
      setError(null)

      const queryParams = new URLSearchParams()
      if (filters?.schoolId) queryParams.append('schoolId', filters.schoolId)
      if (filters?.eventType) queryParams.append('eventType', filters.eventType)
      if (filters?.targetAudience) queryParams.append('targetAudience', filters.targetAudience)
      if (filters?.status) queryParams.append('status', filters.status)
      if (filters?.dateFrom) queryParams.append('dateFrom', filters.dateFrom)
      if (filters?.dateTo) queryParams.append('dateTo', filters.dateTo)
      if (filters?.registrationRequired !== undefined) queryParams.append('registrationRequired', filters.registrationRequired.toString())

      const query = queryParams.toString()
      const endpoint = `/api/secretarias/education/events${query ? `?${query}` : ''}`

      const data = await apiClient.get(endpoint)
      setEvents(data.events || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar eventos')
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchEventRegistrations = useCallback(async () => {
    try {
      const data = await apiClient.get('/api/secretarias/education/events/registrations')
      setEventRegistrations(data.registrations || [])
    } catch (err) {
      console.error('Erro ao carregar inscrições de eventos:', err)
    }
  }, [])

  const createEvent = useCallback(async (data: CreateSchoolEventData): Promise<SchoolEvent> => {
    try {
      setError(null)
      const response = await apiClient.post('/api/secretarias/education/events', data)
      const newEvent = response.event
      setEvents(prev => [newEvent, ...prev])
      return newEvent
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar evento'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const updateEvent = useCallback(async (id: string, data: UpdateSchoolEventData): Promise<SchoolEvent> => {
    try {
      setError(null)
      const response = await apiClient.put(`/api/secretarias/education/events/${id}`, data)
      const updatedEvent = response.event
      setEvents(prev => prev.map(event =>
        event.id === id ? updatedEvent : event
      ))
      return updatedEvent
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar evento'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const cancelEvent = useCallback(async (id: string, reason: string): Promise<SchoolEvent> => {
    return updateEvent(id, {
      status: 'CANCELLED',
      cancellationReason: reason
    })
  }, [updateEvent])

  const postponeEvent = useCallback(async (id: string, newDate: string, reason?: string): Promise<SchoolEvent> => {
    return updateEvent(id, {
      status: 'POSTPONED',
      postponedTo: newDate,
      cancellationReason: reason
    })
  }, [updateEvent])

  const deleteEvent = useCallback(async (id: string): Promise<void> => {
    try {
      setError(null)
      await apiClient.delete(`/api/secretarias/education/events/${id}`)
      setEvents(prev => prev.filter(event => event.id !== id))
      setEventRegistrations(prev => prev.filter(reg => reg.eventId !== id))
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao excluir evento'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const registerStudentForEvent = useCallback(async (eventId: string, studentId: string): Promise<EventRegistration> => {
    try {
      setError(null)
      const response = await apiClient.post(`/api/secretarias/education/events/${eventId}/register`, { studentId })
      const registration = response.registration
      setEventRegistrations(prev => [registration, ...prev])
      return registration
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao inscrever aluno no evento'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const unregisterStudentFromEvent = useCallback(async (eventId: string, studentId: string): Promise<void> => {
    try {
      setError(null)
      await apiClient.delete(`/api/secretarias/education/events/${eventId}/register/${studentId}`)
      setEventRegistrations(prev => prev.filter(reg =>
        !(reg.eventId === eventId && reg.studentId === studentId)
      ))
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao cancelar inscrição do aluno'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const markEventAttendance = useCallback(async (eventId: string, studentId: string, attended: boolean): Promise<EventRegistration> => {
    try {
      setError(null)
      const response = await apiClient.put(`/api/secretarias/education/events/${eventId}/attendance`, {
        studentId,
        status: attended ? 'ATTENDED' : 'ABSENT'
      })
      const updatedRegistration = response.registration
      setEventRegistrations(prev => prev.map(reg =>
        (reg.eventId === eventId && reg.studentId === studentId) ? updatedRegistration : reg
      ))
      return updatedRegistration
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao marcar presença no evento'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const getEventById = useCallback((id: string): SchoolEvent | undefined => {
    return events.find(event => event.id === id)
  }, [events])

  const getEventsBySchool = useCallback((schoolId: string): SchoolEvent[] => {
    return events.filter(event => event.schoolId === schoolId)
  }, [events])

  const getUpcomingEvents = useCallback((days: number = 30): SchoolEvent[] => {
    const today = new Date()
    const futureDate = new Date()
    futureDate.setDate(today.getDate() + days)

    return events.filter(event => {
      const eventDate = new Date(event.startDate)
      return eventDate >= today && eventDate <= futureDate && event.status !== 'CANCELLED'
    }).sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
  }, [events])

  const getEventRegistrations = useCallback((eventId: string): EventRegistration[] => {
    return eventRegistrations.filter(reg => reg.eventId === eventId)
  }, [eventRegistrations])

  const refreshEvents = useCallback(async (filters?: EventFilters) => {
    await Promise.all([fetchEvents(filters), fetchEventRegistrations()])
  }, [fetchEvents, fetchEventRegistrations])

  useEffect(() => {
    fetchEvents(initialFilters)
    fetchEventRegistrations()
  }, [fetchEvents, fetchEventRegistrations, initialFilters])

  return {
    events,
    eventRegistrations,
    loading,
    error,
    createEvent,
    updateEvent,
    cancelEvent,
    postponeEvent,
    deleteEvent,
    registerStudentForEvent,
    unregisterStudentFromEvent,
    markEventAttendance,
    getEventById,
    getEventsBySchool,
    getUpcomingEvents,
    getEventRegistrations,
    refreshEvents
  }
}