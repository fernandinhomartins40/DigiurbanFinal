import { useState, useEffect, useCallback } from 'react'
import { apiClient } from '@/lib/api-client'

export interface CulturalSpace {
  id: string
  name: string
  code: string
  type: 'THEATER' | 'CINEMA' | 'MUSEUM' | 'GALLERY' | 'LIBRARY' | 'CULTURAL_CENTER' | 'COMMUNITY_CENTER' | 'AUDITORIUM' | 'OUTDOOR_SPACE' | 'OTHER'
  category: 'MUNICIPAL' | 'STATE' | 'FEDERAL' | 'PRIVATE' | 'MIXED' | 'NGO'
  status: 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE' | 'RENOVATION' | 'CONSTRUCTION' | 'PLANNED' | 'CLOSED'
  description: string
  mission?: string
  vision?: string
  values?: string[]
  location: {
    address: {
      street: string
      number: string
      complement?: string
      neighborhood: string
      city: string
      state: string
      cep: string
      country: string
    }
    coordinates: {
      lat: number
      lng: number
    }
    transportation: {
      publicTransport: string[]
      parking: {
        available: boolean
        spaces: number
        accessibility: boolean
        cost?: number
      }
      accessibility: {
        wheelchairAccess: boolean
        ramps: boolean
        elevators: boolean
        tactilePaving: boolean
        audioSupport: boolean
        signLanguage: boolean
        brailleSignage: boolean
      }
    }
  }
  infrastructure: {
    totalArea: number
    usableArea: number
    floors: number
    rooms: Array<{
      id: string
      name: string
      type: 'MAIN_HALL' | 'THEATER' | 'GALLERY' | 'WORKSHOP' | 'OFFICE' | 'STORAGE' | 'DRESSING_ROOM' | 'RESTROOM' | 'LOBBY' | 'OTHER'
      capacity: number
      area: number
      equipment: string[]
      accessibility: boolean
      climate: 'NATURAL' | 'CONDITIONED' | 'HEATED'
      lighting: 'NATURAL' | 'ARTIFICIAL' | 'MIXED' | 'PROFESSIONAL'
    }>
    equipment: {
      sound: Array<{
        item: string
        brand: string
        model: string
        condition: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR'
        lastMaintenance: string
      }>
      lighting: Array<{
        item: string
        type: 'LED' | 'HALOGEN' | 'FLUORESCENT' | 'PROFESSIONAL'
        quantity: number
        condition: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR'
      }>
      projection: Array<{
        item: string
        resolution: string
        brightness: number
        condition: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR'
      }>
      other: Array<{
        category: string
        item: string
        quantity: number
        condition: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR'
      }>
    }
    utilities: {
      electricity: {
        capacity: number
        backup: boolean
        generator: boolean
      }
      water: {
        supply: 'MUNICIPAL' | 'WELL' | 'MIXED'
        backup: boolean
        treatment: boolean
      }
      internet: {
        provider: string
        speed: number
        wifi: boolean
        coverage: number
      }
      security: {
        cameras: number
        alarmSystem: boolean
        fireDetection: boolean
        securityGuard: boolean
        emergencyExits: number
      }
    }
  }
  management: {
    administrator: {
      id: string
      name: string
      role: string
      email: string
      phone: string
      startDate: string
    }
    staff: Array<{
      id: string
      name: string
      position: string
      department: string
      workSchedule: string
      contact: string
      startDate: string
    }>
    operatingHours: {
      monday: { open: string; close: string; closed: boolean }
      tuesday: { open: string; close: string; closed: boolean }
      wednesday: { open: string; close: string; closed: boolean }
      thursday: { open: string; close: string; closed: boolean }
      friday: { open: string; close: string; closed: boolean }
      saturday: { open: string; close: string; closed: boolean }
      sunday: { open: string; close: string; closed: boolean }
      holidays: { open: string; close: string; closed: boolean }
    }
    policies: {
      rentalPolicy: string
      useRules: string[]
      securityProcedures: string[]
      emergencyProcedures: string[]
      accessibilityPolicy: string
    }
  }
  programming: {
    currentProgram: {
      period: {
        start: string
        end: string
      }
      events: Array<{
        id: string
        title: string
        type: string
        dates: string[]
        audience: number
        revenue: number
      }>
    }
    capacity: {
      monthlyEvents: number
      yearlyEvents: number
      maxOccupancy: number
      utilizationRate: number
    }
    reservations: Array<{
      id: string
      eventId?: string
      title: string
      organizer: string
      date: string
      startTime: string
      endTime: string
      status: 'CONFIRMED' | 'PENDING' | 'CANCELLED'
      type: 'RENTAL' | 'MUNICIPAL' | 'PARTNERSHIP'
    }>
    maintenance: {
      schedule: Array<{
        id: string
        type: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY' | 'EMERGENCY'
        description: string
        responsible: string
        nextDate: string
        frequency: string
      }>
      history: Array<{
        id: string
        date: string
        type: string
        description: string
        cost: number
        supplier: string
        duration: number
        status: 'COMPLETED' | 'IN_PROGRESS' | 'SCHEDULED'
      }>
    }
  }
  finances: {
    budget: {
      annual: number
      operational: number
      maintenance: number
      programming: number
      staff: number
      utilities: number
    }
    revenue: {
      rentals: number
      tickets: number
      sponsorships: number
      grants: number
      other: number
      total: number
    }
    expenses: {
      staff: number
      utilities: number
      maintenance: number
      equipment: number
      programming: number
      other: number
      total: number
    }
    rental: {
      rates: Array<{
        roomId: string
        baseRate: number
        hourlyRate: number
        dailyRate: number
        discounts: Array<{
          type: 'NGO' | 'STUDENT' | 'CULTURAL' | 'GOVERNMENT'
          percentage: number
        }>
      }>
      policies: {
        minimumHours: number
        cancellationPolicy: string
        paymentTerms: string
        depositRequired: boolean
        depositPercentage: number
      }
    }
  }
  partnerships: Array<{
    id: string
    partner: {
      name: string
      type: 'GOVERNMENT' | 'PRIVATE' | 'NGO' | 'EDUCATIONAL' | 'CULTURAL'
      contact: string
    }
    type: 'SPONSORSHIP' | 'COLLABORATION' | 'RENTAL_AGREEMENT' | 'PROGRAMMING' | 'TECHNICAL'
    description: string
    benefits: string[]
    startDate: string
    endDate?: string
    status: 'ACTIVE' | 'EXPIRED' | 'SUSPENDED' | 'NEGOTIATING'
  }>
  visitors: {
    annual: number
    monthly: number
    demographics: {
      ageGroups: Array<{
        range: string
        percentage: number
      }>
      origin: Array<{
        location: string
        percentage: number
      }>
      frequency: Array<{
        type: 'FIRST_TIME' | 'OCCASIONAL' | 'REGULAR' | 'FREQUENT'
        percentage: number
      }>
    }
    feedback: Array<{
      id: string
      date: string
      rating: number
      category: 'FACILITIES' | 'PROGRAMMING' | 'STAFF' | 'ACCESSIBILITY' | 'GENERAL'
      comment: string
      source: 'SURVEY' | 'ONLINE' | 'VERBAL' | 'COMPLAINT'
    }>
    satisfaction: {
      overall: number
      facilities: number
      programming: number
      staff: number
      accessibility: number
    }
  }
  compliance: {
    licenses: Array<{
      type: string
      number: string
      issuingBody: string
      issueDate: string
      expiryDate: string
      status: 'VALID' | 'EXPIRED' | 'PENDING' | 'SUSPENDED'
    }>
    safety: {
      fireExtinguishers: {
        quantity: number
        lastInspection: string
        nextInspection: string
        status: 'OK' | 'NEEDS_ATTENTION'
      }
      emergencyLighting: {
        functional: boolean
        lastTest: string
        nextTest: string
      }
      evacuation: {
        planUpdated: string
        signageComplete: boolean
        drillsPerformed: number
        lastDrill: string
      }
    }
    accessibility: {
      compliance: number
      issues: string[]
      improvements: Array<{
        description: string
        priority: 'HIGH' | 'MEDIUM' | 'LOW'
        estimatedCost: number
        deadline: string
      }>
    }
  }
  metrics: {
    utilization: {
      rate: number
      peakHours: string[]
      lowDemandPeriods: string[]
    }
    performance: {
      eventsPerMonth: number
      averageAttendance: number
      customerSatisfaction: number
      revenuePerEvent: number
      operationalEfficiency: number
    }
    kpis: Array<{
      name: string
      value: number
      target: number
      unit: string
      trend: 'UP' | 'DOWN' | 'STABLE'
    }>
  }
  createdAt: string
  updatedAt: string
  createdBy: string
  lastModifiedBy: string
}

export interface CreateCulturalSpaceData {
  name: string
  code: string
  type: 'THEATER' | 'CINEMA' | 'MUSEUM' | 'GALLERY' | 'LIBRARY' | 'CULTURAL_CENTER' | 'COMMUNITY_CENTER' | 'AUDITORIUM' | 'OUTDOOR_SPACE' | 'OTHER'
  category: 'MUNICIPAL' | 'STATE' | 'FEDERAL' | 'PRIVATE' | 'MIXED' | 'NGO'
  description: string
  location: {
    address: {
      street: string
      number: string
      complement?: string
      neighborhood: string
      city: string
      state: string
      cep: string
      country: string
    }
    coordinates: {
      lat: number
      lng: number
    }
  }
  infrastructure: {
    totalArea: number
    usableArea: number
    floors: number
    rooms: Array<{
      name: string
      type: 'MAIN_HALL' | 'THEATER' | 'GALLERY' | 'WORKSHOP' | 'OFFICE' | 'STORAGE' | 'DRESSING_ROOM' | 'RESTROOM' | 'LOBBY' | 'OTHER'
      capacity: number
      area: number
      accessibility: boolean
    }>
  }
  administratorId: string
  operatingHours: {
    monday: { open: string; close: string; closed: boolean }
    tuesday: { open: string; close: string; closed: boolean }
    wednesday: { open: string; close: string; closed: boolean }
    thursday: { open: string; close: string; closed: boolean }
    friday: { open: string; close: string; closed: boolean }
    saturday: { open: string; close: string; closed: boolean }
    sunday: { open: string; close: string; closed: boolean }
  }
}

export interface CulturalSpaceFilters {
  type?: string
  category?: string
  status?: string
  neighborhood?: string
  capacity?: number
  accessibility?: boolean
  administrator?: string
}

export function useCulturalSpaces() {
  const [spaces, setSpaces] = useState<CulturalSpace[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchSpaces = useCallback(async (filters?: CulturalSpaceFilters) => {
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
      const response = await apiClient.get(`/culture/spaces?${params}`)
      setSpaces(response.data.data || [])
    } catch (err) {
      setError('Erro ao carregar espaços culturais')
      console.error('Error fetching cultural spaces:', err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const createSpace = useCallback(async (data: CreateCulturalSpaceData) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await apiClient.post('/culture/spaces', data)
      const newSpace = response.data.data
      setSpaces(prev => [newSpace, ...prev])
      return newSpace
    } catch (err) {
      setError('Erro ao criar espaço cultural')
      console.error('Error creating cultural space:', err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const updateSpace = useCallback(async (id: string, data: Partial<CreateCulturalSpaceData>) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await apiClient.put(`/culture/spaces/${id}`, data)
      const updatedSpace = response.data.data
      setSpaces(prev => prev.map(space => space.id === id ? updatedSpace : space))
      return updatedSpace
    } catch (err) {
      setError('Erro ao atualizar espaço cultural')
      console.error('Error updating cultural space:', err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const deleteSpace = useCallback(async (id: string) => {
    setIsLoading(true)
    setError(null)
    try {
      await apiClient.delete(`/culture/spaces/${id}`)
      setSpaces(prev => prev.filter(space => space.id !== id))
    } catch (err) {
      setError('Erro ao excluir espaço cultural')
      console.error('Error deleting cultural space:', err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const addReservation = useCallback(async (id: string, reservationData: {
    eventId?: string
    title: string
    organizer: string
    date: string
    startTime: string
    endTime: string
    type: 'RENTAL' | 'MUNICIPAL' | 'PARTNERSHIP'
    roomIds: string[]
    notes?: string
  }) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await apiClient.post(`/culture/spaces/${id}/reservations`, reservationData)
      const updatedSpace = response.data.data
      setSpaces(prev => prev.map(space => space.id === id ? updatedSpace : space))
      return updatedSpace
    } catch (err) {
      setError('Erro ao fazer reserva')
      console.error('Error making reservation:', err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const addEquipment = useCallback(async (id: string, equipmentData: {
    category: 'sound' | 'lighting' | 'projection' | 'other'
    item: string
    brand?: string
    model?: string
    quantity: number
    condition: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR'
    purchaseDate?: string
    cost?: number
  }) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await apiClient.post(`/culture/spaces/${id}/equipment`, equipmentData)
      const updatedSpace = response.data.data
      setSpaces(prev => prev.map(space => space.id === id ? updatedSpace : space))
      return updatedSpace
    } catch (err) {
      setError('Erro ao adicionar equipamento')
      console.error('Error adding equipment:', err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const scheduleMaintenance = useCallback(async (id: string, maintenanceData: {
    type: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY' | 'EMERGENCY'
    description: string
    responsible: string
    scheduledDate: string
    estimatedCost: number
    priority: 'HIGH' | 'MEDIUM' | 'LOW'
  }) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await apiClient.post(`/culture/spaces/${id}/maintenance`, maintenanceData)
      const updatedSpace = response.data.data
      setSpaces(prev => prev.map(space => space.id === id ? updatedSpace : space))
      return updatedSpace
    } catch (err) {
      setError('Erro ao agendar manutenção')
      console.error('Error scheduling maintenance:', err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const recordVisitors = useCallback(async (id: string, visitorData: {
    date: string
    count: number
    eventId?: string
    demographics?: {
      children: number
      adults: number
      seniors: number
      tourists: number
      locals: number
    }
  }) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await apiClient.post(`/culture/spaces/${id}/visitors`, visitorData)
      const updatedSpace = response.data.data
      setSpaces(prev => prev.map(space => space.id === id ? updatedSpace : space))
      return updatedSpace
    } catch (err) {
      setError('Erro ao registrar visitantes')
      console.error('Error recording visitors:', err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const addFeedback = useCallback(async (id: string, feedbackData: {
    rating: number
    category: 'FACILITIES' | 'PROGRAMMING' | 'STAFF' | 'ACCESSIBILITY' | 'GENERAL'
    comment: string
    source: 'SURVEY' | 'ONLINE' | 'VERBAL' | 'COMPLAINT'
    visitorProfile?: string
  }) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await apiClient.post(`/culture/spaces/${id}/feedback`, feedbackData)
      const updatedSpace = response.data.data
      setSpaces(prev => prev.map(space => space.id === id ? updatedSpace : space))
      return updatedSpace
    } catch (err) {
      setError('Erro ao adicionar feedback')
      console.error('Error adding feedback:', err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const updateOperatingHours = useCallback(async (id: string, operatingHours: {
    monday: { open: string; close: string; closed: boolean }
    tuesday: { open: string; close: string; closed: boolean }
    wednesday: { open: string; close: string; closed: boolean }
    thursday: { open: string; close: string; closed: boolean }
    friday: { open: string; close: string; closed: boolean }
    saturday: { open: string; close: string; closed: boolean }
    sunday: { open: string; close: string; closed: boolean }
    holidays?: { open: string; close: string; closed: boolean }
  }) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await apiClient.put(`/culture/spaces/${id}/hours`, { operatingHours })
      const updatedSpace = response.data.data
      setSpaces(prev => prev.map(space => space.id === id ? updatedSpace : space))
      return updatedSpace
    } catch (err) {
      setError('Erro ao atualizar horário de funcionamento')
      console.error('Error updating operating hours:', err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const generateUtilizationReport = useCallback(async (id: string, period: { start: string; end: string }) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await apiClient.post(`/culture/spaces/${id}/reports/utilization`, period)
      return response.data.data
    } catch (err) {
      setError('Erro ao gerar relatório de utilização')
      console.error('Error generating utilization report:', err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const getSpaceById = useCallback((id: string) => {
    return spaces.find(space => space.id === id)
  }, [spaces])

  const getSpacesByType = useCallback((type: string) => {
    return spaces.filter(space => space.type === type)
  }, [spaces])

  const getSpacesByStatus = useCallback((status: string) => {
    return spaces.filter(space => space.status === status)
  }, [spaces])

  const getAvailableSpaces = useCallback((date: string, startTime: string, endTime: string) => {
    return spaces.filter(space => {
      const isOpen = space.status === 'ACTIVE'
      const hasConflict = space.programming.reservations.some(reservation =>
        reservation.date === date &&
        reservation.status === 'CONFIRMED' &&
        ((startTime >= reservation.startTime && startTime < reservation.endTime) ||
         (endTime > reservation.startTime && endTime <= reservation.endTime) ||
         (startTime <= reservation.startTime && endTime >= reservation.endTime))
      )
      return isOpen && !hasConflict
    })
  }, [spaces])

  const getSpacesNeedingMaintenance = useCallback(() => {
    const today = new Date().toISOString().split('T')[0]
    return spaces.filter(space =>
      space.programming.maintenance.schedule.some(maintenance =>
        maintenance.nextDate <= today
      )
    )
  }, [spaces])

  const getSpacesByCapacity = useCallback((minCapacity: number) => {
    return spaces.filter(space =>
      space.infrastructure.rooms.some(room => room.capacity >= minCapacity)
    )
  }, [spaces])

  const getAccessibleSpaces = useCallback(() => {
    return spaces.filter(space =>
      space.location.transportation.accessibility.wheelchairAccess
    )
  }, [spaces])

  const getTotalCapacity = useCallback(() => {
    return spaces.reduce((total, space) =>
      total + Math.max(...space.infrastructure.rooms.map(room => room.capacity)), 0)
  }, [spaces])

  const getAverageUtilization = useCallback(() => {
    const utilizations = spaces
      .filter(space => space.metrics?.utilization?.rate !== undefined)
      .map(space => space.metrics.utilization.rate)
    return utilizations.length > 0
      ? utilizations.reduce((sum, rate) => sum + rate, 0) / utilizations.length
      : 0
  }, [spaces])

  useEffect(() => {
    fetchSpaces()
  }, [fetchSpaces])

  return {
    spaces,
    isLoading,
    error,
    fetchSpaces,
    createSpace,
    updateSpace,
    deleteSpace,
    addReservation,
    addEquipment,
    scheduleMaintenance,
    recordVisitors,
    addFeedback,
    updateOperatingHours,
    generateUtilizationReport,
    getSpaceById,
    getSpacesByType,
    getSpacesByStatus,
    getAvailableSpaces,
    getSpacesNeedingMaintenance,
    getSpacesByCapacity,
    getAccessibleSpaces,
    getTotalCapacity,
    getAverageUtilization
  }
}