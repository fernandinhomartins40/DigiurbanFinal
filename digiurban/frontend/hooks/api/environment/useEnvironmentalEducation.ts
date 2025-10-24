import { useState, useEffect, useCallback } from 'react'
import { apiClient } from '@/lib/api-client'

export interface EnvironmentalEducationProgram {
  id: string
  title: string
  code: string
  type: 'WORKSHOP' | 'COURSE' | 'CAMPAIGN' | 'PROJECT' | 'LECTURE' | 'EXHIBITION' | 'FIELD_TRIP' | 'CONTEST' | 'TRAINING'
  category: 'FORMAL' | 'NON_FORMAL' | 'INFORMAL' | 'PROFESSIONAL' | 'COMMUNITY'
  status: 'PLANNING' | 'APPROVED' | 'ACTIVE' | 'COMPLETED' | 'SUSPENDED' | 'CANCELLED'
  level: 'BASIC' | 'INTERMEDIATE' | 'ADVANCED' | 'ALL_LEVELS'
  description: string
  objectives: string[]
  themes: Array<{
    theme: 'WATER' | 'AIR' | 'WASTE' | 'BIODIVERSITY' | 'CLIMATE' | 'ENERGY' | 'CONSUMPTION' | 'POLLUTION' | 'CONSERVATION' | 'SUSTAINABILITY'
    subthemes: string[]
    activities: string[]
    duration: number
  }>
  targetAudience: {
    primary: Array<{
      group: 'CHILDREN' | 'STUDENTS' | 'TEACHERS' | 'PROFESSIONALS' | 'COMMUNITY' | 'ELDERLY' | 'SPECIAL_NEEDS'
      ageRange?: { min: number; max: number }
      level?: string
      characteristics: string[]
    }>
    estimatedParticipants: number
    prerequisites: string[]
    specialNeeds: string[]
  }
  methodology: {
    approach: 'PARTICIPATORY' | 'EXPERIENTIAL' | 'CONSTRUCTIVIST' | 'COLLABORATIVE' | 'INTERDISCIPLINARY'
    techniques: string[]
    resources: Array<{
      type: 'DIGITAL' | 'PRINTED' | 'AUDIOVISUAL' | 'INTERACTIVE' | 'EXPERIMENTAL'
      name: string
      description: string
      quantity: number
      cost: number
      supplier?: string
    }>
    evaluation: {
      methods: string[]
      criteria: string[]
      instruments: string[]
      frequency: 'CONTINUOUS' | 'PERIODIC' | 'FINAL'
    }
  }
  schedule: {
    startDate: string
    endDate: string
    totalHours: number
    sessions: Array<{
      id: string
      date: string
      startTime: string
      endTime: string
      duration: number
      topic: string
      activities: string[]
      location: string
      instructor: string
      materials: string[]
      participants?: number
    }>
    flexibility: 'FIXED' | 'ADAPTABLE' | 'ON_DEMAND'
  }
  locations: Array<{
    id: string
    name: string
    type: 'SCHOOL' | 'PARK' | 'COMMUNITY_CENTER' | 'MUSEUM' | 'LIBRARY' | 'OUTDOORS' | 'ONLINE' | 'WORKPLACE'
    address: {
      street: string
      number: string
      complement?: string
      neighborhood: string
      city: string
      cep: string
    }
    capacity: number
    facilities: string[]
    accessibility: boolean
    equipment: string[]
    cost: number
  }>
  team: {
    coordinator: {
      id: string
      name: string
      qualification: string[]
      experience: string
      contact: string
    }
    instructors: Array<{
      id: string
      name: string
      specialization: string[]
      qualification: string[]
      experience: number
      contact: string
      availability: string[]
      fee: number
    }>
    support: Array<{
      id: string
      name: string
      role: 'ASSISTANT' | 'TECHNICIAN' | 'TRANSLATOR' | 'FACILITATOR'
      qualification: string[]
      contact: string
    }>
    volunteers: Array<{
      id: string
      name: string
      skills: string[]
      availability: string[]
      training: string[]
      contact: string
    }>
  }
  participants: Array<{
    id: string
    name: string
    email: string
    phone: string
    age: number
    education: string
    occupation: string
    institution?: string
    specialNeeds?: string[]
    motivation: string
    expectations: string[]
    registrationDate: string
    status: 'REGISTERED' | 'CONFIRMED' | 'ATTENDED' | 'COMPLETED' | 'DROPPED_OUT' | 'CANCELLED'
    attendance: {
      sessionsAttended: number
      totalSessions: number
      percentage: number
      punctuality: number
    }
    performance: {
      participation: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR'
      understanding: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR'
      assignments: Array<{
        task: string
        score: number
        maxScore: number
        feedback: string
      }>
      finalGrade?: number
      certificate?: {
        issued: boolean
        number: string
        date: string
        url: string
      }
    }
    feedback: {
      satisfaction: number
      content: number
      instructor: number
      methodology: number
      materials: number
      facilities: number
      recommendations: string[]
      comments: string
    }
  }>
  materials: {
    educational: Array<{
      type: 'MANUAL' | 'GUIDE' | 'WORKBOOK' | 'PRESENTATION' | 'VIDEO' | 'GAME' | 'APP' | 'EXPERIMENT'
      title: string
      description: string
      format: 'DIGITAL' | 'PRINTED' | 'MULTIMEDIA'
      language: string[]
      ageGroup: string[]
      themes: string[]
      url?: string
      quantity: number
      cost: number
      developer?: string
    }>
    equipment: Array<{
      item: string
      type: 'AUDIOVISUAL' | 'EXPERIMENTAL' | 'MEASUREMENT' | 'SAFETY' | 'MOBILITY'
      quantity: number
      condition: 'NEW' | 'GOOD' | 'FAIR' | 'POOR'
      cost: number
      supplier?: string
      maintenance: string
    }>
    supplies: Array<{
      item: string
      type: 'CONSUMABLE' | 'REUSABLE' | 'SAFETY' | 'CRAFT'
      quantity: number
      unit: string
      cost: number
      supplier?: string
      expiryDate?: string
    }>
  }
  budget: {
    total: number
    currency: string
    breakdown: {
      personnel: number
      materials: number
      equipment: number
      locations: number
      transportation: number
      meals: number
      certificates: number
      marketing: number
      administration: number
      contingency: number
    }
    funding: Array<{
      source: 'MUNICIPAL' | 'STATE' | 'FEDERAL' | 'PRIVATE' | 'NGO' | 'INTERNATIONAL' | 'PARTICIPANTS'
      type: 'GRANT' | 'DONATION' | 'SPONSORSHIP' | 'FEES' | 'PARTNERSHIP'
      amount: number
      confirmed: boolean
      conditions: string[]
    }>
    expenses: Array<{
      category: string
      item: string
      plannedAmount: number
      actualAmount?: number
      date: string
      supplier?: string
      invoice?: string
      status: 'PLANNED' | 'COMMITTED' | 'PAID'
    }>
  }
  communication: {
    marketing: {
      strategy: string
      channels: Array<{
        type: 'WEBSITE' | 'SOCIAL_MEDIA' | 'EMAIL' | 'FLYER' | 'POSTER' | 'RADIO' | 'TV' | 'NEWSPAPER'
        platform?: string
        reach: number
        cost: number
        effectiveness: number
      }>
      materials: Array<{
        type: 'POSTER' | 'FLYER' | 'BANNER' | 'VIDEO' | 'ANIMATION' | 'INFOGRAPHIC'
        title: string
        format: string
        quantity: number
        cost: number
        designer?: string
        url?: string
      }>
    }
    registration: {
      process: 'ONLINE' | 'OFFLINE' | 'HYBRID'
      platform?: string
      requirements: string[]
      deadline: string
      confirmation: string
      fee?: number
      scholarships: {
        available: number
        criteria: string[]
        awarded: number
      }
    }
    follow_up: {
      methods: string[]
      frequency: string
      duration: string
      activities: string[]
      network: boolean
    }
  }
  partnerships: Array<{
    partner: {
      name: string
      type: 'SCHOOL' | 'UNIVERSITY' | 'NGO' | 'GOVERNMENT' | 'PRIVATE' | 'MEDIA' | 'INTERNATIONAL'
      contact: string
    }
    role: 'SPONSOR' | 'COLLABORATOR' | 'SUPPORTER' | 'VENUE' | 'DISSEMINATOR' | 'TECHNICAL'
    contribution: string
    value?: number
    agreement?: string
    startDate: string
    endDate?: string
  }>
  outcomes: {
    immediate: {
      knowledge: {
        preAssessment: number
        postAssessment: number
        improvement: number
      }
      attitudes: {
        preAssessment: number
        postAssessment: number
        improvement: number
      }
      skills: {
        acquired: string[]
        developed: string[]
        improved: string[]
      }
    }
    intermediate: {
      behavior: {
        changes: string[]
        adoption: number
        persistence: number
      }
      practices: {
        implemented: string[]
        shared: string[]
        improved: string[]
      }
      influence: {
        family: number
        friends: number
        colleagues: number
        community: number
      }
    }
    long_term: {
      environmental: {
        impact: string[]
        measurement: string[]
        indicators: Array<{
          indicator: string
          baseline: number
          current: number
          target: number
          unit: string
        }>
      }
      social: {
        awareness: number
        engagement: number
        leadership: number
        networks: number
      }
      institutional: {
        policies: string[]
        procedures: string[]
        programs: string[]
        capacity: string[]
      }
    }
  }
  evaluation: {
    design: {
      type: 'FORMATIVE' | 'SUMMATIVE' | 'MIXED'
      approach: 'QUANTITATIVE' | 'QUALITATIVE' | 'MIXED'
      methods: string[]
      instruments: string[]
      timeline: string[]
    }
    data: {
      collection: Array<{
        method: string
        instrument: string
        timing: string
        respondents: string
        sample: number
      }>
      analysis: Array<{
        type: string
        software?: string
        techniques: string[]
        indicators: string[]
      }>
      quality: {
        validity: 'HIGH' | 'MEDIUM' | 'LOW'
        reliability: 'HIGH' | 'MEDIUM' | 'LOW'
        completeness: number
        accuracy: number
      }
    }
    results: {
      quantitative: { [indicator: string]: number }
      qualitative: { [aspect: string]: string }
      satisfaction: {
        overall: number
        content: number
        methodology: number
        instructors: number
        materials: number
        facilities: number
      }
      effectiveness: {
        learning: number
        engagement: number
        retention: number
        application: number
      }
    }
    recommendations: Array<{
      area: string
      recommendation: string
      priority: 'HIGH' | 'MEDIUM' | 'LOW'
      timeline: string
      responsible: string
      resources: string[]
    }>
  }
  documentation: {
    planning: Array<{
      document: string
      version: string
      date: string
      author: string
      url: string
    }>
    implementation: Array<{
      session: string
      date: string
      attendance: number
      activities: string[]
      observations: string
      photos: string[]
      videos: string[]
    }>
    evaluation: Array<{
      report: string
      type: 'PROGRESS' | 'INTERMEDIATE' | 'FINAL'
      date: string
      author: string
      url: string
      summary: string
    }>
    certificates: Array<{
      participantId: string
      number: string
      issueDate: string
      hours: number
      url: string
    }>
  }
  sustainability: {
    continuation: {
      planned: boolean
      frequency: string
      modifications: string[]
      resources: string[]
    }
    replication: {
      locations: string[]
      adaptations: string[]
      partners: string[]
      timeline: string
    }
    scaling: {
      strategy: string
      targets: string[]
      requirements: string[]
      timeline: string
    }
    legacy: {
      materials: string[]
      networks: string[]
      capacity: string[]
      policies: string[]
    }
  }
  createdAt: string
  updatedAt: string
  createdBy: string
  lastModifiedBy: string
}

export interface CreateEnvironmentalEducationProgramData {
  title: string
  code: string
  type: 'WORKSHOP' | 'COURSE' | 'CAMPAIGN' | 'PROJECT' | 'LECTURE' | 'EXHIBITION' | 'FIELD_TRIP' | 'CONTEST' | 'TRAINING'
  category: 'FORMAL' | 'NON_FORMAL' | 'INFORMAL' | 'PROFESSIONAL' | 'COMMUNITY'
  level: 'BASIC' | 'INTERMEDIATE' | 'ADVANCED' | 'ALL_LEVELS'
  description: string
  objectives: string[]
  themes: Array<{
    theme: 'WATER' | 'AIR' | 'WASTE' | 'BIODIVERSITY' | 'CLIMATE' | 'ENERGY' | 'CONSUMPTION' | 'POLLUTION' | 'CONSERVATION' | 'SUSTAINABILITY'
    subthemes: string[]
    activities: string[]
    duration: number
  }>
  targetAudience: {
    primary: Array<{
      group: 'CHILDREN' | 'STUDENTS' | 'TEACHERS' | 'PROFESSIONALS' | 'COMMUNITY' | 'ELDERLY' | 'SPECIAL_NEEDS'
      ageRange?: { min: number; max: number }
      level?: string
      characteristics: string[]
    }>
    estimatedParticipants: number
    prerequisites: string[]
    specialNeeds: string[]
  }
  schedule: {
    startDate: string
    endDate: string
    totalHours: number
    flexibility: 'FIXED' | 'ADAPTABLE' | 'ON_DEMAND'
  }
  coordinatorId: string
  budget: {
    total: number
    breakdown: {
      personnel: number
      materials: number
      equipment: number
      locations: number
      transportation: number
      meals: number
      certificates: number
      marketing: number
      administration: number
      contingency: number
    }
  }
}

export interface EnvironmentalEducationProgramFilters {
  type?: string
  category?: string
  level?: string
  status?: string
  theme?: string
  targetGroup?: string
  coordinatorId?: string
  dateFrom?: string
  dateTo?: string
  location?: string
  hasVacancies?: boolean
}

export function useEnvironmentalEducation() {
  const [programs, setPrograms] = useState<EnvironmentalEducationProgram[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchPrograms = useCallback(async (filters?: EnvironmentalEducationProgramFilters) => {
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
      const response = await apiClient.get(`/environment/education?${params}`)
      setPrograms(response.data.data || [])
    } catch (err) {
      setError('Erro ao carregar programas de educação ambiental')
      console.error('Error fetching environmental education programs:', err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const createProgram = useCallback(async (data: CreateEnvironmentalEducationProgramData) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await apiClient.post('/environment/education', data)
      const newProgram = response.data.data
      setPrograms(prev => [newProgram, ...prev])
      return newProgram
    } catch (err) {
      setError('Erro ao criar programa de educação ambiental')
      console.error('Error creating environmental education program:', err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const updateProgram = useCallback(async (id: string, data: Partial<CreateEnvironmentalEducationProgramData>) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await apiClient.put(`/environment/education/${id}`, data)
      const updatedProgram = response.data.data
      setPrograms(prev => prev.map(program => program.id === id ? updatedProgram : program))
      return updatedProgram
    } catch (err) {
      setError('Erro ao atualizar programa de educação ambiental')
      console.error('Error updating environmental education program:', err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const deleteProgram = useCallback(async (id: string) => {
    setIsLoading(true)
    setError(null)
    try {
      await apiClient.delete(`/environment/education/${id}`)
      setPrograms(prev => prev.filter(program => program.id !== id))
    } catch (err) {
      setError('Erro ao excluir programa de educação ambiental')
      console.error('Error deleting environmental education program:', err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const enrollParticipant = useCallback(async (id: string, participantData: {
    name: string
    email: string
    phone: string
    age: number
    education: string
    occupation: string
    institution?: string
    specialNeeds?: string[]
    motivation: string
    expectations: string[]
  }) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await apiClient.post(`/environment/education/${id}/participants`, participantData)
      const updatedProgram = response.data.data
      setPrograms(prev => prev.map(program => program.id === id ? updatedProgram : program))
      return updatedProgram
    } catch (err) {
      setError('Erro ao inscrever participante')
      console.error('Error enrolling participant:', err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const recordAttendance = useCallback(async (id: string, sessionId: string, attendanceData: {
    participants: Array<{
      participantId: string
      present: boolean
      late: boolean
      notes?: string
    }>
    activities: string[]
    observations: string
    photos?: File[]
  }) => {
    setIsLoading(true)
    setError(null)
    try {
      const formData = new FormData()
      formData.append('participants', JSON.stringify(attendanceData.participants))
      formData.append('activities', JSON.stringify(attendanceData.activities))
      formData.append('observations', attendanceData.observations)
      if (attendanceData.photos) {
        attendanceData.photos.forEach((photo, index) => {
          formData.append(`photos[${index}]`, photo)
        })
      }

      const response = await apiClient.post(`/environment/education/${id}/sessions/${sessionId}/attendance`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      const updatedProgram = response.data.data
      setPrograms(prev => prev.map(program => program.id === id ? updatedProgram : program))
      return updatedProgram
    } catch (err) {
      setError('Erro ao registrar presença')
      console.error('Error recording attendance:', err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const evaluateParticipant = useCallback(async (id: string, participantId: string, evaluationData: {
    participation: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR'
    understanding: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR'
    assignments: Array<{
      task: string
      score: number
      maxScore: number
      feedback: string
    }>
    finalGrade?: number
    observations?: string
  }) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await apiClient.post(`/environment/education/${id}/participants/${participantId}/evaluate`, evaluationData)
      const updatedProgram = response.data.data
      setPrograms(prev => prev.map(program => program.id === id ? updatedProgram : program))
      return updatedProgram
    } catch (err) {
      setError('Erro ao avaliar participante')
      console.error('Error evaluating participant:', err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const collectFeedback = useCallback(async (id: string, participantId: string, feedbackData: {
    satisfaction: number
    content: number
    instructor: number
    methodology: number
    materials: number
    facilities: number
    recommendations: string[]
    comments: string
  }) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await apiClient.post(`/environment/education/${id}/participants/${participantId}/feedback`, feedbackData)
      const updatedProgram = response.data.data
      setPrograms(prev => prev.map(program => program.id === id ? updatedProgram : program))
      return updatedProgram
    } catch (err) {
      setError('Erro ao coletar feedback')
      console.error('Error collecting feedback:', err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const issueCertificate = useCallback(async (id: string, participantId: string, certificateData: {
    hours: number
    grade?: number
    specialMentions?: string[]
    template: string
  }) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await apiClient.post(`/environment/education/${id}/participants/${participantId}/certificate`, certificateData)
      const updatedProgram = response.data.data
      setPrograms(prev => prev.map(program => program.id === id ? updatedProgram : program))
      return updatedProgram
    } catch (err) {
      setError('Erro ao emitir certificado')
      console.error('Error issuing certificate:', err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const addMaterial = useCallback(async (id: string, materialData: {
    type: 'MANUAL' | 'GUIDE' | 'WORKBOOK' | 'PRESENTATION' | 'VIDEO' | 'GAME' | 'APP' | 'EXPERIMENT'
    title: string
    description: string
    format: 'DIGITAL' | 'PRINTED' | 'MULTIMEDIA'
    language: string[]
    ageGroup: string[]
    themes: string[]
    file?: File
    quantity: number
    cost: number
    developer?: string
  }) => {
    setIsLoading(true)
    setError(null)
    try {
      const formData = new FormData()
      Object.entries(materialData).forEach(([key, value]) => {
        if (key === 'file' && value instanceof File) {
          formData.append('file', value)
        } else if (Array.isArray(value)) {
          formData.append(key, JSON.stringify(value))
        } else if (value !== undefined) {
          formData.append(key, value.toString())
        }
      })

      const response = await apiClient.post(`/environment/education/${id}/materials`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      const updatedProgram = response.data.data
      setPrograms(prev => prev.map(program => program.id === id ? updatedProgram : program))
      return updatedProgram
    } catch (err) {
      setError('Erro ao adicionar material')
      console.error('Error adding material:', err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const addInstructor = useCallback(async (id: string, instructorData: {
    instructorId: string
    specialization: string[]
    sessions: string[]
    fee: number
    responsibilities: string[]
  }) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await apiClient.post(`/environment/education/${id}/instructors`, instructorData)
      const updatedProgram = response.data.data
      setPrograms(prev => prev.map(program => program.id === id ? updatedProgram : program))
      return updatedProgram
    } catch (err) {
      setError('Erro ao adicionar instrutor')
      console.error('Error adding instructor:', err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const addPartnership = useCallback(async (id: string, partnershipData: {
    partnerName: string
    partnerType: 'SCHOOL' | 'UNIVERSITY' | 'NGO' | 'GOVERNMENT' | 'PRIVATE' | 'MEDIA' | 'INTERNATIONAL'
    partnerContact: string
    role: 'SPONSOR' | 'COLLABORATOR' | 'SUPPORTER' | 'VENUE' | 'DISSEMINATOR' | 'TECHNICAL'
    contribution: string
    value?: number
    startDate: string
    endDate?: string
  }) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await apiClient.post(`/environment/education/${id}/partnerships`, partnershipData)
      const updatedProgram = response.data.data
      setPrograms(prev => prev.map(program => program.id === id ? updatedProgram : program))
      return updatedProgram
    } catch (err) {
      setError('Erro ao adicionar parceria')
      console.error('Error adding partnership:', err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const conductEvaluation = useCallback(async (id: string, evaluationData: {
    type: 'FORMATIVE' | 'SUMMATIVE' | 'MIXED'
    methods: string[]
    instruments: string[]
    participants: string[]
    timeline: string
    results: { [indicator: string]: any }
    recommendations: Array<{
      area: string
      recommendation: string
      priority: 'HIGH' | 'MEDIUM' | 'LOW'
      timeline: string
      responsible: string
    }>
  }) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await apiClient.post(`/environment/education/${id}/evaluation`, evaluationData)
      const updatedProgram = response.data.data
      setPrograms(prev => prev.map(program => program.id === id ? updatedProgram : program))
      return updatedProgram
    } catch (err) {
      setError('Erro ao conduzir avaliação')
      console.error('Error conducting evaluation:', err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const generateReport = useCallback(async (id: string, reportType: 'PROGRESS' | 'ATTENDANCE' | 'EVALUATION' | 'IMPACT' | 'FINANCIAL' | 'COMPREHENSIVE') => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await apiClient.post(`/environment/education/${id}/reports`, { type: reportType })
      return response.data.data
    } catch (err) {
      setError('Erro ao gerar relatório')
      console.error('Error generating report:', err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const getProgramById = useCallback((id: string) => {
    return programs.find(program => program.id === id)
  }, [programs])

  const getProgramsByType = useCallback((type: string) => {
    return programs.filter(program => program.type === type)
  }, [programs])

  const getProgramsByCategory = useCallback((category: string) => {
    return programs.filter(program => program.category === category)
  }, [programs])

  const getProgramsByStatus = useCallback((status: string) => {
    return programs.filter(program => program.status === status)
  }, [programs])

  const getActivePrograms = useCallback(() => {
    return programs.filter(program => program.status === 'ACTIVE')
  }, [programs])

  const getProgramsByTheme = useCallback((theme: string) => {
    return programs.filter(program =>
      program.themes.some(t => t.theme === theme)
    )
  }, [programs])

  const getProgramsByTargetGroup = useCallback((group: string) => {
    return programs.filter(program =>
      program.targetAudience.primary.some(target => target.group === group)
    )
  }, [programs])

  const getUpcomingPrograms = useCallback((days: number = 30) => {
    const futureDate = new Date()
    futureDate.setDate(futureDate.getDate() + days)
    const futureDateStr = futureDate.toISOString().split('T')[0]

    return programs.filter(program =>
      program.schedule.startDate <= futureDateStr &&
      ['PLANNING', 'APPROVED'].includes(program.status)
    )
  }, [programs])

  const getProgramsWithVacancies = useCallback(() => {
    return programs.filter(program =>
      program.participants.length < program.targetAudience.estimatedParticipants &&
      program.status === 'ACTIVE'
    )
  }, [programs])

  const getHighSatisfactionPrograms = useCallback(() => {
    return programs
      .filter(program => program.evaluation?.results?.satisfaction?.overall > 0)
      .sort((a, b) =>
        (b.evaluation?.results?.satisfaction?.overall || 0) -
        (a.evaluation?.results?.satisfaction?.overall || 0)
      )
      .slice(0, 10)
  }, [programs])

  const getTotalParticipants = useCallback(() => {
    return programs.reduce((total, program) => total + program.participants.length, 0)
  }, [programs])

  const getCompletionRate = useCallback(() => {
    const totalParticipants = programs.reduce((total, program) => total + program.participants.length, 0)
    const completedParticipants = programs.reduce((total, program) =>
      total + program.participants.filter(p => p.status === 'COMPLETED').length, 0)

    return totalParticipants > 0 ? (completedParticipants / totalParticipants) * 100 : 0
  }, [programs])

  const getAverageSatisfaction = useCallback(() => {
    const programsWithSatisfaction = programs.filter(p =>
      p.evaluation?.results?.satisfaction?.overall > 0
    )

    if (programsWithSatisfaction.length === 0) return 0

    const totalSatisfaction = programsWithSatisfaction.reduce((sum, program) =>
      sum + (program.evaluation?.results?.satisfaction?.overall || 0), 0)

    return totalSatisfaction / programsWithSatisfaction.length
  }, [programs])

  const getThemePopularity = useCallback(() => {
    const themeCount: { [key: string]: number } = {}
    programs.forEach(program => {
      program.themes.forEach(theme => {
        themeCount[theme.theme] = (themeCount[theme.theme] || 0) + 1
      })
    })

    return Object.entries(themeCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([theme, count]) => ({ theme, count }))
  }, [programs])

  useEffect(() => {
    fetchPrograms()
  }, [fetchPrograms])

  return {
    programs,
    isLoading,
    error,
    fetchPrograms,
    createProgram,
    updateProgram,
    deleteProgram,
    enrollParticipant,
    recordAttendance,
    evaluateParticipant,
    collectFeedback,
    issueCertificate,
    addMaterial,
    addInstructor,
    addPartnership,
    conductEvaluation,
    generateReport,
    getProgramById,
    getProgramsByType,
    getProgramsByCategory,
    getProgramsByStatus,
    getActivePrograms,
    getProgramsByTheme,
    getProgramsByTargetGroup,
    getUpcomingPrograms,
    getProgramsWithVacancies,
    getHighSatisfactionPrograms,
    getTotalParticipants,
    getCompletionRate,
    getAverageSatisfaction,
    getThemePopularity
  }
}