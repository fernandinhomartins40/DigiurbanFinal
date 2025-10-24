import { useState, useEffect, useCallback } from 'react'
import { apiClient } from '@/lib/api-client'

export interface CulturalArtist {
  id: string
  name: string
  artisticName?: string
  type: 'INDIVIDUAL' | 'GROUP' | 'COMPANY' | 'COLLECTIVE'
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'RETIRED'
  category: 'PROFESSIONAL' | 'AMATEUR' | 'STUDENT' | 'EMERGING' | 'ESTABLISHED'
  disciplines: Array<{
    primary: boolean
    discipline: 'MUSIC' | 'THEATER' | 'DANCE' | 'VISUAL_ARTS' | 'LITERATURE' | 'CINEMA' | 'CRAFTS' | 'DIGITAL_ARTS' | 'MULTIDISCIPLINARY'
    specialty?: string
    experience: number
    level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT'
  }>
  personal: {
    cpf?: string
    cnpj?: string
    rg?: string
    birthDate?: string
    gender?: 'MALE' | 'FEMALE' | 'OTHER' | 'PREFER_NOT_TO_SAY'
    nationality: string
    maritalStatus?: 'SINGLE' | 'MARRIED' | 'DIVORCED' | 'WIDOWED' | 'OTHER'
    education: {
      level: 'ELEMENTARY' | 'HIGH_SCHOOL' | 'TECHNICAL' | 'UNDERGRADUATE' | 'GRADUATE' | 'POSTGRADUATE' | 'OTHER'
      institution?: string
      course?: string
      year?: number
      ongoing?: boolean
    }
    languages: Array<{
      language: string
      level: 'BASIC' | 'INTERMEDIATE' | 'ADVANCED' | 'FLUENT' | 'NATIVE'
    }>
  }
  contact: {
    phone: string
    email: string
    whatsapp?: string
    address: {
      street: string
      number: string
      complement?: string
      neighborhood: string
      city: string
      state: string
      cep: string
    }
    socialMedia: {
      website?: string
      facebook?: string
      instagram?: string
      youtube?: string
      twitter?: string
      tiktok?: string
      linkedin?: string
    }
    emergencyContact: {
      name: string
      relationship: string
      phone: string
    }
  }
  artistic: {
    biography: string
    artisticStatement?: string
    influences: string[]
    achievements: Array<{
      year: number
      title: string
      description: string
      category: 'AWARD' | 'RECOGNITION' | 'EXHIBITION' | 'PERFORMANCE' | 'PUBLICATION' | 'SCHOLARSHIP' | 'RESIDENCY'
      institution?: string
    }>
    repertoire: Array<{
      title: string
      type: 'SONG' | 'PLAY' | 'DANCE' | 'ARTWORK' | 'POEM' | 'FILM' | 'OTHER'
      description?: string
      duration?: number
      year?: number
      collaborators?: string[]
    }>
    skills: Array<{
      skill: string
      level: 'BASIC' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT'
      certified: boolean
    }>
    equipment: Array<{
      item: string
      brand?: string
      model?: string
      condition: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR'
      owned: boolean
    }>
  }
  professional: {
    registry: {
      mtb?: string
      drt?: string
      other?: Array<{
        type: string
        number: string
        issuingBody: string
        expiryDate?: string
      }>
    }
    rates: {
      workshopHour: number
      performanceEvent: number
      rehearsalHour: number
      consultingHour: number
      composition: number
      other: Array<{
        service: string
        rate: number
        unit: string
      }>
    }
    availability: {
      timeSlots: Array<{
        day: 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY'
        startTime: string
        endTime: string
      }>
      blackoutDates: string[]
      travelWillingness: {
        local: boolean
        regional: boolean
        national: boolean
        international: boolean
        maxDistance?: number
      }
      workTypes: Array<{
        type: 'PERFORMANCE' | 'WORKSHOP' | 'LECTURE' | 'CONSULTATION' | 'RESIDENCY' | 'COLLABORATION'
        available: boolean
        notes?: string
      }>
    }
    requirements: {
      technical: string[]
      logistical: string[]
      accessibility: string[]
      contractual: string[]
    }
  }
  portfolio: {
    photos: Array<{
      id: string
      url: string
      title: string
      description: string
      category: 'PROFILE' | 'PERFORMANCE' | 'ARTWORK' | 'BEHIND_SCENES' | 'PROMOTIONAL'
      year: number
      photographer?: string
    }>
    videos: Array<{
      id: string
      url: string
      title: string
      description: string
      category: 'PERFORMANCE' | 'INTERVIEW' | 'DOCUMENTARY' | 'PROMOTIONAL' | 'TUTORIAL'
      duration: number
      year: number
    }>
    audio: Array<{
      id: string
      url: string
      title: string
      description: string
      category: 'PERFORMANCE' | 'COMPOSITION' | 'INTERVIEW' | 'DEMO'
      duration: number
      year: number
    }>
    documents: Array<{
      id: string
      url: string
      title: string
      type: 'CV' | 'PORTFOLIO' | 'PRESS_KIT' | 'CERTIFICATE' | 'REVIEW' | 'ARTICLE'
      description: string
      date: string
    }>
  }
  collaborations: Array<{
    id: string
    type: 'PROJECT' | 'EVENT' | 'RESIDENCY' | 'WORKSHOP' | 'PERFORMANCE'
    partner: string
    role: string
    description: string
    startDate: string
    endDate?: string
    status: 'ACTIVE' | 'COMPLETED' | 'CANCELLED'
    publicProject: boolean
  }>
  participations: Array<{
    id: string
    eventId?: string
    projectId?: string
    title: string
    type: 'PERFORMANCE' | 'EXHIBITION' | 'WORKSHOP' | 'CONTEST' | 'RESIDENCY' | 'LECTURE'
    role: 'PERFORMER' | 'INSTRUCTOR' | 'SPEAKER' | 'PARTICIPANT' | 'ORGANIZER' | 'CURATOR'
    date: string
    venue: string
    audience: number
    fee: number
    evaluation?: {
      artistRating: number
      audienceRating: number
      organizerRating: number
      feedback: string
    }
  }>
  mentorship: {
    isMentor: boolean
    mentorAreas: string[]
    mentees: Array<{
      id: string
      name: string
      startDate: string
      endDate?: string
      area: string
      status: 'ACTIVE' | 'COMPLETED' | 'PAUSED'
    }>
    seeksMentorship: boolean
    mentorshipAreas: string[]
    mentors: Array<{
      id: string
      name: string
      startDate: string
      endDate?: string
      area: string
      status: 'ACTIVE' | 'COMPLETED' | 'PAUSED'
    }>
  }
  support: {
    grants: Array<{
      id: string
      program: string
      amount: number
      startDate: string
      endDate: string
      purpose: string
      status: 'ACTIVE' | 'COMPLETED' | 'CANCELLED'
      requirements: string[]
      reporting: Array<{
        date: string
        type: 'PROGRESS' | 'FINANCIAL' | 'FINAL'
        submitted: boolean
        url?: string
      }>
    }>
    scholarships: Array<{
      id: string
      program: string
      institution: string
      startDate: string
      endDate: string
      area: string
      status: 'ACTIVE' | 'COMPLETED' | 'CANCELLED'
    }>
    residencies: Array<{
      id: string
      program: string
      location: string
      startDate: string
      endDate: string
      focus: string
      outcome?: string
      status: 'ACTIVE' | 'COMPLETED' | 'CANCELLED'
    }>
  }
  business: {
    taxStatus: 'CPF' | 'MEI' | 'CNPJ'
    bankAccount: {
      bank: string
      agency: string
      account: string
      type: 'CHECKING' | 'SAVINGS'
      pix?: string
    }
    contracts: Array<{
      id: string
      type: 'PERFORMANCE' | 'SERVICES' | 'COLLABORATION' | 'LICENSING'
      client: string
      value: number
      startDate: string
      endDate?: string
      status: 'ACTIVE' | 'COMPLETED' | 'CANCELLED'
      paymentStatus: 'PENDING' | 'PARTIAL' | 'PAID' | 'OVERDUE'
    }>
    earnings: {
      totalYearly: number
      totalMonthly: number
      breakdown: {
        performances: number
        workshops: number
        sales: number
        grants: number
        other: number
      }
    }
  }
  development: {
    courses: Array<{
      id: string
      title: string
      institution: string
      startDate: string
      endDate?: string
      hours: number
      status: 'ENROLLED' | 'COMPLETED' | 'CANCELLED'
      certificate?: string
    }>
    workshops: Array<{
      id: string
      title: string
      instructor: string
      date: string
      hours: number
      status: 'ENROLLED' | 'COMPLETED' | 'CANCELLED'
      certificate?: string
    }>
    goals: Array<{
      id: string
      description: string
      category: 'ARTISTIC' | 'PROFESSIONAL' | 'PERSONAL' | 'BUSINESS'
      targetDate: string
      status: 'ACTIVE' | 'COMPLETED' | 'CANCELLED'
      progress: number
    }>
    assessments: Array<{
      id: string
      date: string
      assessor: string
      type: 'ARTISTIC' | 'TECHNICAL' | 'PROFESSIONAL'
      scores: { [area: string]: number }
      feedback: string
      recommendations: string[]
    }>
  }
  network: {
    contacts: Array<{
      id: string
      name: string
      type: 'ARTIST' | 'PRODUCER' | 'VENUE' | 'CRITIC' | 'JOURNALIST' | 'PATRON' | 'INSTITUTION' | 'OTHER'
      relationship: string
      contact: string
      notes?: string
    }>
    groups: Array<{
      id: string
      name: string
      type: 'ARTISTIC' | 'PROFESSIONAL' | 'CULTURAL' | 'ADVOCACY'
      role: 'MEMBER' | 'COORDINATOR' | 'PRESIDENT' | 'OTHER'
      joinDate: string
      status: 'ACTIVE' | 'INACTIVE'
    }>
    references: Array<{
      name: string
      position: string
      institution: string
      contact: string
      relationship: string
    }>
  }
  metrics: {
    performanceCount: number
    workshopCount: number
    audienceReach: number
    mediaAppearances: number
    socialMediaFollowers: { [platform: string]: number }
    averageRating: number
    repeatClients: number
    projectsCompleted: number
  }
  createdAt: string
  updatedAt: string
  createdBy: string
  lastModifiedBy: string
}

export interface CreateCulturalArtistData {
  name: string
  artisticName?: string
  type: 'INDIVIDUAL' | 'GROUP' | 'COMPANY' | 'COLLECTIVE'
  category: 'PROFESSIONAL' | 'AMATEUR' | 'STUDENT' | 'EMERGING' | 'ESTABLISHED'
  disciplines: Array<{
    primary: boolean
    discipline: 'MUSIC' | 'THEATER' | 'DANCE' | 'VISUAL_ARTS' | 'LITERATURE' | 'CINEMA' | 'CRAFTS' | 'DIGITAL_ARTS' | 'MULTIDISCIPLINARY'
    specialty?: string
    experience: number
    level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT'
  }>
  contact: {
    phone: string
    email: string
    address: {
      street: string
      number: string
      complement?: string
      neighborhood: string
      city: string
      state: string
      cep: string
    }
    emergencyContact: {
      name: string
      relationship: string
      phone: string
    }
  }
  artistic: {
    biography: string
    artisticStatement?: string
    influences: string[]
  }
  personal?: {
    cpf?: string
    birthDate?: string
    gender?: 'MALE' | 'FEMALE' | 'OTHER' | 'PREFER_NOT_TO_SAY'
    nationality: string
  }
}

export interface CulturalArtistFilters {
  type?: string
  category?: string
  status?: string
  discipline?: string
  level?: string
  city?: string
  availability?: boolean
  mentorship?: boolean
  minExperience?: number
}

export function useCulturalArtists() {
  const [artists, setArtists] = useState<CulturalArtist[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchArtists = useCallback(async (filters?: CulturalArtistFilters) => {
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
      const response = await apiClient.get(`/culture/artists?${params}`)
      setArtists(response.data.data || [])
    } catch (err) {
      setError('Erro ao carregar artistas')
      console.error('Error fetching cultural artists:', err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const createArtist = useCallback(async (data: CreateCulturalArtistData) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await apiClient.post('/culture/artists', data)
      const newArtist = response.data.data
      setArtists(prev => [newArtist, ...prev])
      return newArtist
    } catch (err) {
      setError('Erro ao cadastrar artista')
      console.error('Error creating cultural artist:', err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const updateArtist = useCallback(async (id: string, data: Partial<CreateCulturalArtistData>) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await apiClient.put(`/culture/artists/${id}`, data)
      const updatedArtist = response.data.data
      setArtists(prev => prev.map(artist => artist.id === id ? updatedArtist : artist))
      return updatedArtist
    } catch (err) {
      setError('Erro ao atualizar artista')
      console.error('Error updating cultural artist:', err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const deleteArtist = useCallback(async (id: string) => {
    setIsLoading(true)
    setError(null)
    try {
      await apiClient.delete(`/culture/artists/${id}`)
      setArtists(prev => prev.filter(artist => artist.id !== id))
    } catch (err) {
      setError('Erro ao excluir artista')
      console.error('Error deleting cultural artist:', err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const addPortfolioItem = useCallback(async (id: string, portfolioData: {
    type: 'photo' | 'video' | 'audio' | 'document'
    file: File
    title: string
    description: string
    category: string
    year?: number
  }) => {
    setIsLoading(true)
    setError(null)
    try {
      const formData = new FormData()
      formData.append('file', portfolioData.file)
      formData.append('type', portfolioData.type)
      formData.append('title', portfolioData.title)
      formData.append('description', portfolioData.description)
      formData.append('category', portfolioData.category)
      if (portfolioData.year) {
        formData.append('year', portfolioData.year.toString())
      }

      const response = await apiClient.post(`/culture/artists/${id}/portfolio`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      const updatedArtist = response.data.data
      setArtists(prev => prev.map(artist => artist.id === id ? updatedArtist : artist))
      return updatedArtist
    } catch (err) {
      setError('Erro ao adicionar item ao portfólio')
      console.error('Error adding portfolio item:', err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const addParticipation = useCallback(async (id: string, participationData: {
    eventId?: string
    projectId?: string
    title: string
    type: 'PERFORMANCE' | 'EXHIBITION' | 'WORKSHOP' | 'CONTEST' | 'RESIDENCY' | 'LECTURE'
    role: 'PERFORMER' | 'INSTRUCTOR' | 'SPEAKER' | 'PARTICIPANT' | 'ORGANIZER' | 'CURATOR'
    date: string
    venue: string
    audience: number
    fee: number
  }) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await apiClient.post(`/culture/artists/${id}/participations`, participationData)
      const updatedArtist = response.data.data
      setArtists(prev => prev.map(artist => artist.id === id ? updatedArtist : artist))
      return updatedArtist
    } catch (err) {
      setError('Erro ao registrar participação')
      console.error('Error adding participation:', err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const addAchievement = useCallback(async (id: string, achievementData: {
    year: number
    title: string
    description: string
    category: 'AWARD' | 'RECOGNITION' | 'EXHIBITION' | 'PERFORMANCE' | 'PUBLICATION' | 'SCHOLARSHIP' | 'RESIDENCY'
    institution?: string
  }) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await apiClient.post(`/culture/artists/${id}/achievements`, achievementData)
      const updatedArtist = response.data.data
      setArtists(prev => prev.map(artist => artist.id === id ? updatedArtist : artist))
      return updatedArtist
    } catch (err) {
      setError('Erro ao adicionar conquista')
      console.error('Error adding achievement:', err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const updateAvailability = useCallback(async (id: string, availabilityData: {
    timeSlots: Array<{
      day: 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY'
      startTime: string
      endTime: string
    }>
    blackoutDates: string[]
    travelWillingness: {
      local: boolean
      regional: boolean
      national: boolean
      international: boolean
      maxDistance?: number
    }
  }) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await apiClient.put(`/culture/artists/${id}/availability`, availabilityData)
      const updatedArtist = response.data.data
      setArtists(prev => prev.map(artist => artist.id === id ? updatedArtist : artist))
      return updatedArtist
    } catch (err) {
      setError('Erro ao atualizar disponibilidade')
      console.error('Error updating availability:', err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const addCourse = useCallback(async (id: string, courseData: {
    title: string
    institution: string
    startDate: string
    endDate?: string
    hours: number
    certificate?: string
  }) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await apiClient.post(`/culture/artists/${id}/courses`, courseData)
      const updatedArtist = response.data.data
      setArtists(prev => prev.map(artist => artist.id === id ? updatedArtist : artist))
      return updatedArtist
    } catch (err) {
      setError('Erro ao adicionar curso')
      console.error('Error adding course:', err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const addMentorship = useCallback(async (id: string, mentorshipData: {
    type: 'MENTOR' | 'MENTEE'
    partnerId: string
    area: string
    startDate: string
    endDate?: string
  }) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await apiClient.post(`/culture/artists/${id}/mentorship`, mentorshipData)
      const updatedArtist = response.data.data
      setArtists(prev => prev.map(artist => artist.id === id ? updatedArtist : artist))
      return updatedArtist
    } catch (err) {
      setError('Erro ao adicionar mentoria')
      console.error('Error adding mentorship:', err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const addContract = useCallback(async (id: string, contractData: {
    type: 'PERFORMANCE' | 'SERVICES' | 'COLLABORATION' | 'LICENSING'
    client: string
    value: number
    startDate: string
    endDate?: string
    description: string
  }) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await apiClient.post(`/culture/artists/${id}/contracts`, contractData)
      const updatedArtist = response.data.data
      setArtists(prev => prev.map(artist => artist.id === id ? updatedArtist : artist))
      return updatedArtist
    } catch (err) {
      setError('Erro ao adicionar contrato')
      console.error('Error adding contract:', err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const generateProfile = useCallback(async (id: string, profileType: 'COMPLETE' | 'PROMOTIONAL' | 'ARTISTIC') => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await apiClient.post(`/culture/artists/${id}/profile`, { type: profileType })
      return response.data.data
    } catch (err) {
      setError('Erro ao gerar perfil')
      console.error('Error generating profile:', err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const getArtistById = useCallback((id: string) => {
    return artists.find(artist => artist.id === id)
  }, [artists])

  const getArtistsByType = useCallback((type: string) => {
    return artists.filter(artist => artist.type === type)
  }, [artists])

  const getArtistsByDiscipline = useCallback((discipline: string) => {
    return artists.filter(artist =>
      artist.disciplines.some(d => d.discipline === discipline)
    )
  }, [artists])

  const getArtistsByLevel = useCallback((level: string) => {
    return artists.filter(artist =>
      artist.disciplines.some(d => d.level === level)
    )
  }, [artists])

  const getAvailableArtists = useCallback((date: string, location?: string) => {
    return artists.filter(artist => {
      const isActive = artist.status === 'ACTIVE'
      const isAvailable = !artist.professional.availability.blackoutDates.includes(date)
      const canTravel = !location || artist.professional.availability.travelWillingness.local

      return isActive && isAvailable && canTravel
    })
  }, [artists])

  const getMentors = useCallback((area?: string) => {
    return artists.filter(artist => {
      const isMentor = artist.mentorship.isMentor
      const hasArea = !area || artist.mentorship.mentorAreas.includes(area)
      return isMentor && hasArea
    })
  }, [artists])

  const getArtistsByExperience = useCallback((minYears: number, discipline?: string) => {
    return artists.filter(artist =>
      artist.disciplines.some(d =>
        d.experience >= minYears &&
        (!discipline || d.discipline === discipline)
      )
    )
  }, [artists])

  const getTopPerformers = useCallback(() => {
    return artists
      .filter(artist => artist.metrics.averageRating > 0)
      .sort((a, b) => b.metrics.averageRating - a.metrics.averageRating)
      .slice(0, 10)
  }, [artists])

  const getArtistsByLocation = useCallback((city: string, state?: string) => {
    return artists.filter(artist =>
      artist.contact.address.city === city &&
      (!state || artist.contact.address.state === state)
    )
  }, [artists])

  const getEmergingArtists = useCallback(() => {
    return artists.filter(artist =>
      artist.category === 'EMERGING' ||
      artist.disciplines.some(d => d.experience <= 3)
    )
  }, [artists])

  useEffect(() => {
    fetchArtists()
  }, [fetchArtists])

  return {
    artists,
    isLoading,
    error,
    fetchArtists,
    createArtist,
    updateArtist,
    deleteArtist,
    addPortfolioItem,
    addParticipation,
    addAchievement,
    updateAvailability,
    addCourse,
    addMentorship,
    addContract,
    generateProfile,
    getArtistById,
    getArtistsByType,
    getArtistsByDiscipline,
    getArtistsByLevel,
    getAvailableArtists,
    getMentors,
    getArtistsByExperience,
    getTopPerformers,
    getArtistsByLocation,
    getEmergingArtists
  }
}