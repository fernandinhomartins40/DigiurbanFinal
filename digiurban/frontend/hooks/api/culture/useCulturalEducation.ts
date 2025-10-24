import { useState, useEffect, useCallback } from 'react'
import { apiClient } from '@/lib/api-client'

export interface CulturalEducation {
  id: string
  title: string
  code: string
  type: 'COURSE' | 'WORKSHOP' | 'MASTERCLASS' | 'LECTURE' | 'SEMINAR' | 'TRAINING' | 'CERTIFICATION' | 'RESIDENCY'
  category: 'MUSIC' | 'THEATER' | 'DANCE' | 'VISUAL_ARTS' | 'LITERATURE' | 'CINEMA' | 'CRAFTS' | 'DIGITAL_ARTS' | 'CULTURAL_MANAGEMENT' | 'MULTIDISCIPLINARY'
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'PROFESSIONAL' | 'ALL_LEVELS'
  status: 'PLANNING' | 'OPEN_REGISTRATION' | 'FULL' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'POSTPONED'
  format: 'PRESENTIAL' | 'ONLINE' | 'HYBRID' | 'SELF_PACED'
  description: string
  shortDescription: string
  objectives: string[]
  syllabus: Array<{
    module: number
    title: string
    description: string
    duration: number
    topics: string[]
    activities: string[]
    assessment?: string
  }>
  prerequisites: string[]
  targetAudience: {
    primary: string[]
    ageRange: {
      min: number
      max: number
    }
    requiredExperience?: string
    specialGroups: string[]
    maxParticipants: number
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
      instructor: string
      location?: string
      onlineLink?: string
      type: 'THEORY' | 'PRACTICE' | 'WORKSHOP' | 'PRESENTATION' | 'ASSESSMENT'
    }>
    frequency: 'DAILY' | 'WEEKLY' | 'BIWEEKLY' | 'MONTHLY' | 'INTENSIVE' | 'FLEXIBLE'
    timezone: string
  }
  instructors: Array<{
    id: string
    name: string
    role: 'MAIN_INSTRUCTOR' | 'ASSISTANT' | 'GUEST_SPEAKER' | 'MENTOR' | 'COORDINATOR'
    qualifications: string[]
    experience: string
    bio: string
    specializations: string[]
    contact: string
    fee: number
  }>
  location: {
    type: 'FIXED' | 'MULTIPLE' | 'ONLINE' | 'OUTDOOR'
    venues: Array<{
      spaceId?: string
      name: string
      address: string
      capacity: number
      equipment: string[]
      accessibility: boolean
    }>
    requirements: {
      space: string
      equipment: string[]
      technology: string[]
      accessibility: string[]
    }
  }
  materials: {
    provided: Array<{
      item: string
      description: string
      quantity: number
      cost: number
      supplier?: string
    }>
    required: Array<{
      item: string
      description: string
      whereToBuy?: string
      estimatedCost?: number
      mandatory: boolean
    }>
    digital: Array<{
      type: 'PDF' | 'VIDEO' | 'AUDIO' | 'LINK' | 'SOFTWARE'
      title: string
      description: string
      url?: string
      size?: number
      duration?: number
    }>
    bibliography: Array<{
      type: 'BOOK' | 'ARTICLE' | 'WEBSITE' | 'VIDEO' | 'DOCUMENTARY'
      title: string
      author: string
      publisher?: string
      year?: number
      isbn?: string
      url?: string
      mandatory: boolean
    }>
  }
  registration: {
    fee: number
    currency: string
    discounts: Array<{
      type: 'STUDENT' | 'SENIOR' | 'LOW_INCOME' | 'GROUP' | 'EARLY_BIRD' | 'MEMBER'
      percentage: number
      requirements: string[]
      validUntil?: string
    }>
    payment: {
      methods: string[]
      installments: {
        enabled: boolean
        maxInstallments: number
        interestRate: number
      }
      scholarships: {
        available: number
        criteria: string[]
        application: {
          required: boolean
          deadline?: string
          documents: string[]
        }
      }
    }
    process: {
      openDate: string
      closeDate: string
      requirements: string[]
      documents: string[]
      selection: {
        criteria: string[]
        process: string
        resultsDate?: string
      }
      confirmation: {
        deadline: string
        requirements: string[]
      }
    }
  }
  participants: Array<{
    id: string
    name: string
    email: string
    phone: string
    registrationDate: string
    status: 'REGISTERED' | 'CONFIRMED' | 'WAITLIST' | 'CANCELLED' | 'COMPLETED' | 'DROPOUT'
    paymentStatus: 'PENDING' | 'PARTIAL' | 'PAID' | 'REFUNDED'
    attendance: {
      sessionsAttended: number
      totalSessions: number
      percentage: number
      absences: string[]
    }
    performance: {
      assignments: Array<{
        title: string
        grade: number
        maxGrade: number
        feedback: string
        date: string
      }>
      finalGrade?: number
      passed: boolean
      certificate?: {
        issued: boolean
        number: string
        date: string
        url: string
      }
    }
    profile: {
      age: number
      education: string
      experience: string
      motivation: string
      expectations: string[]
    }
  }>
  assessment: {
    methods: Array<{
      type: 'ASSIGNMENT' | 'PRESENTATION' | 'PRACTICAL' | 'WRITTEN_EXAM' | 'PORTFOLIO' | 'PROJECT'
      weight: number
      description: string
      criteria: string[]
      deadline?: string
    }>
    grading: {
      scale: 'NUMERIC' | 'LETTER' | 'PASS_FAIL' | 'PERCENTAGE'
      minimumPassing: number
      certification: {
        available: boolean
        requirements: string[]
        template: string
        signatories: string[]
      }
    }
    feedback: {
      individual: boolean
      group: boolean
      frequency: 'WEEKLY' | 'MODULE' | 'FINAL'
      methods: string[]
    }
  }
  resources: {
    budget: {
      total: number
      breakdown: {
        instructors: number
        materials: number
        venue: number
        equipment: number
        marketing: number
        administration: number
        certificates: number
        refreshments: number
      }
      funding: Array<{
        source: 'MUNICIPAL' | 'STATE' | 'FEDERAL' | 'PRIVATE' | 'FEES' | 'SPONSORSHIP'
        amount: number
        confirmed: boolean
      }>
    }
    equipment: Array<{
      item: string
      quantity: number
      source: 'OWNED' | 'RENTAL' | 'BORROWED' | 'SPONSORED'
      cost: number
      responsible: string
    }>
    technology: {
      platform?: string
      requirements: string[]
      support: {
        available: boolean
        contact: string
        hours: string
      }
    }
  }
  marketing: {
    strategy: string
    channels: Array<{
      type: 'WEBSITE' | 'SOCIAL_MEDIA' | 'EMAIL' | 'PRESS' | 'PARTNERSHIPS' | 'DIRECT'
      platform?: string
      reach: number
      cost: number
    }>
    materials: Array<{
      type: 'POSTER' | 'FLYER' | 'BANNER' | 'VIDEO' | 'BROCHURE'
      status: 'PLANNED' | 'CREATING' | 'APPROVED' | 'DISTRIBUTED'
      cost: number
      supplier?: string
    }>
    partnerships: Array<{
      partner: string
      type: 'MEDIA' | 'INSTITUTION' | 'ASSOCIATION' | 'INFLUENCER'
      contribution: string
      reach: number
    }>
  }
  evaluation: {
    participant: {
      satisfaction: {
        overall: number
        content: number
        instructors: number
        organization: number
        facilities: number
        materials: number
      }
      feedback: Array<{
        id: string
        participant: string
        rating: number
        comment: string
        date: string
        category: 'CONTENT' | 'INSTRUCTOR' | 'ORGANIZATION' | 'FACILITIES' | 'GENERAL'
      }>
      suggestions: string[]
    }
    instructor: {
      selfEvaluation: {
        preparation: number
        delivery: number
        engagement: number
        objectives: number
        overall: number
      }
      feedback: string
      improvements: string[]
    }
    impact: {
      immediate: {
        knowledgeGained: string[]
        skillsAcquired: string[]
        confidenceIncrease: number
      }
      longTerm: {
        careerImpact: string
        continuedPractice: boolean
        networksFormed: number
        projectsInitiated: number
      }
    }
    metrics: {
      completionRate: number
      passRate: number
      satisfactionScore: number
      recommendationRate: number
      repeatParticipants: number
    }
  }
  followUp: {
    alumni: {
      network: boolean
      activities: string[]
      communication: string[]
    }
    continuousLearning: {
      advanced: boolean
      nextLevel?: string
      relatedCourses: string[]
    }
    career: {
      placement: boolean
      mentorship: boolean
      opportunities: string[]
    }
    community: {
      projects: string[]
      collaborations: string[]
      exhibitions: string[]
    }
  }
  documentation: {
    curriculum: {
      version: string
      lastUpdate: string
      approved: boolean
      approvedBy: string
    }
    attendance: Array<{
      sessionId: string
      date: string
      participants: string[]
      absences: string[]
      notes: string
    }>
    reports: Array<{
      type: 'PROGRESS' | 'ATTENDANCE' | 'EVALUATION' | 'FINAL'
      period: string
      author: string
      date: string
      url: string
    }>
    certificates: Array<{
      participantId: string
      number: string
      issueDate: string
      hours: number
      grade?: number
      url: string
    }>
  }
  quality: {
    standards: string[]
    accreditation?: {
      body: string
      status: 'PENDING' | 'ACCREDITED' | 'EXPIRED'
      validUntil?: string
    }
    improvements: Array<{
      id: string
      description: string
      implementedDate?: string
      responsible: string
      status: 'PLANNED' | 'IMPLEMENTED' | 'EVALUATED'
    }>
    benchmarks: Array<{
      metric: string
      target: number
      achieved: number
      benchmark: number
    }>
  }
  createdAt: string
  updatedAt: string
  createdBy: string
  lastModifiedBy: string
}

export interface CreateCulturalEducationData {
  title: string
  code: string
  type: 'COURSE' | 'WORKSHOP' | 'MASTERCLASS' | 'LECTURE' | 'SEMINAR' | 'TRAINING' | 'CERTIFICATION' | 'RESIDENCY'
  category: 'MUSIC' | 'THEATER' | 'DANCE' | 'VISUAL_ARTS' | 'LITERATURE' | 'CINEMA' | 'CRAFTS' | 'DIGITAL_ARTS' | 'CULTURAL_MANAGEMENT' | 'MULTIDISCIPLINARY'
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'PROFESSIONAL' | 'ALL_LEVELS'
  format: 'PRESENTIAL' | 'ONLINE' | 'HYBRID' | 'SELF_PACED'
  description: string
  shortDescription: string
  objectives: string[]
  syllabus: Array<{
    module: number
    title: string
    description: string
    duration: number
    topics: string[]
    activities: string[]
  }>
  targetAudience: {
    primary: string[]
    ageRange: {
      min: number
      max: number
    }
    maxParticipants: number
  }
  schedule: {
    startDate: string
    endDate: string
    totalHours: number
    frequency: 'DAILY' | 'WEEKLY' | 'BIWEEKLY' | 'MONTHLY' | 'INTENSIVE' | 'FLEXIBLE'
  }
  mainInstructorId: string
  fee: number
  budget: {
    total: number
    breakdown: {
      instructors: number
      materials: number
      venue: number
      equipment: number
      marketing: number
      administration: number
      certificates: number
      refreshments: number
    }
  }
}

export interface CulturalEducationFilters {
  type?: string
  category?: string
  level?: string
  status?: string
  format?: string
  instructorId?: string
  dateFrom?: string
  dateTo?: string
  feeMax?: number
  hasVacancies?: boolean
}

export function useCulturalEducation() {
  const [programs, setPrograms] = useState<CulturalEducation[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchPrograms = useCallback(async (filters?: CulturalEducationFilters) => {
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
      const response = await apiClient.get(`/culture/education?${params}`)
      setPrograms(response.data.data || [])
    } catch (err) {
      setError('Erro ao carregar programas educacionais')
      console.error('Error fetching cultural education programs:', err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const createProgram = useCallback(async (data: CreateCulturalEducationData) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await apiClient.post('/culture/education', data)
      const newProgram = response.data.data
      setPrograms(prev => [newProgram, ...prev])
      return newProgram
    } catch (err) {
      setError('Erro ao criar programa educacional')
      console.error('Error creating cultural education program:', err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const updateProgram = useCallback(async (id: string, data: Partial<CreateCulturalEducationData>) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await apiClient.put(`/culture/education/${id}`, data)
      const updatedProgram = response.data.data
      setPrograms(prev => prev.map(program => program.id === id ? updatedProgram : program))
      return updatedProgram
    } catch (err) {
      setError('Erro ao atualizar programa educacional')
      console.error('Error updating cultural education program:', err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const deleteProgram = useCallback(async (id: string) => {
    setIsLoading(true)
    setError(null)
    try {
      await apiClient.delete(`/culture/education/${id}`)
      setPrograms(prev => prev.filter(program => program.id !== id))
    } catch (err) {
      setError('Erro ao excluir programa educacional')
      console.error('Error deleting cultural education program:', err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const enrollParticipant = useCallback(async (id: string, participantData: {
    name: string
    email: string
    phone: string
    profile: {
      age: number
      education: string
      experience: string
      motivation: string
      expectations: string[]
    }
    documents?: File[]
  }) => {
    setIsLoading(true)
    setError(null)
    try {
      const formData = new FormData()
      Object.entries(participantData).forEach(([key, value]) => {
        if (key === 'documents' && Array.isArray(value)) {
          value.forEach((file, index) => {
            formData.append(`documents[${index}]`, file)
          })
        } else if (typeof value === 'object') {
          formData.append(key, JSON.stringify(value))
        } else {
          formData.append(key, value.toString())
        }
      })

      const response = await apiClient.post(`/culture/education/${id}/enroll`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
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
      late?: boolean
      notes?: string
    }>
    sessionNotes?: string
  }) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await apiClient.post(`/culture/education/${id}/sessions/${sessionId}/attendance`, attendanceData)
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

  const gradeAssignment = useCallback(async (id: string, participantId: string, assignmentData: {
    title: string
    grade: number
    maxGrade: number
    feedback: string
  }) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await apiClient.post(`/culture/education/${id}/participants/${participantId}/grades`, assignmentData)
      const updatedProgram = response.data.data
      setPrograms(prev => prev.map(program => program.id === id ? updatedProgram : program))
      return updatedProgram
    } catch (err) {
      setError('Erro ao avaliar atividade')
      console.error('Error grading assignment:', err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const issueCertificate = useCallback(async (id: string, participantId: string, certificateData: {
    hours: number
    grade?: number
    templateId: string
  }) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await apiClient.post(`/culture/education/${id}/participants/${participantId}/certificate`, certificateData)
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

  const addInstructor = useCallback(async (id: string, instructorData: {
    instructorId: string
    role: 'MAIN_INSTRUCTOR' | 'ASSISTANT' | 'GUEST_SPEAKER' | 'MENTOR' | 'COORDINATOR'
    fee: number
    sessions?: string[]
  }) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await apiClient.post(`/culture/education/${id}/instructors`, instructorData)
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

  const addMaterial = useCallback(async (id: string, materialData: {
    type: 'provided' | 'required' | 'digital' | 'bibliography'
    item: string
    description: string
    quantity?: number
    cost?: number
    mandatory?: boolean
    file?: File
  }) => {
    setIsLoading(true)
    setError(null)
    try {
      const formData = new FormData()
      Object.entries(materialData).forEach(([key, value]) => {
        if (key === 'file' && value instanceof File) {
          formData.append('file', value)
        } else if (value !== undefined) {
          formData.append(key, value.toString())
        }
      })

      const response = await apiClient.post(`/culture/education/${id}/materials`, formData, {
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

  const collectFeedback = useCallback(async (id: string, feedbackData: {
    participantId: string
    rating: number
    comment: string
    category: 'CONTENT' | 'INSTRUCTOR' | 'ORGANIZATION' | 'FACILITIES' | 'GENERAL'
  }) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await apiClient.post(`/culture/education/${id}/feedback`, feedbackData)
      const updatedProgram = response.data.data
      setPrograms(prev => prev.map(program => program.id === id ? updatedProgram : program))
      return updatedProgram
    } catch (err) {
      setError('Erro ao registrar feedback')
      console.error('Error collecting feedback:', err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const generateReport = useCallback(async (id: string, reportType: 'ATTENDANCE' | 'PROGRESS' | 'EVALUATION' | 'FINANCIAL') => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await apiClient.post(`/culture/education/${id}/reports`, { type: reportType })
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

  const getProgramsByLevel = useCallback((level: string) => {
    return programs.filter(program => program.level === level)
  }, [programs])

  const getOpenRegistrations = useCallback(() => {
    return programs.filter(program => program.status === 'OPEN_REGISTRATION')
  }, [programs])

  const getActivePrograms = useCallback(() => {
    return programs.filter(program => program.status === 'IN_PROGRESS')
  }, [programs])

  const getProgramsByInstructor = useCallback((instructorId: string) => {
    return programs.filter(program =>
      program.instructors.some(instructor => instructor.id === instructorId)
    )
  }, [programs])

  const getProgramsWithVacancies = useCallback(() => {
    return programs.filter(program =>
      program.participants.length < program.targetAudience.maxParticipants &&
      program.status === 'OPEN_REGISTRATION'
    )
  }, [programs])

  const getUpcomingPrograms = useCallback((days: number = 30) => {
    const futureDate = new Date()
    futureDate.setDate(futureDate.getDate() + days)
    const futureDateStr = futureDate.toISOString().split('T')[0]

    return programs.filter(program =>
      program.schedule.startDate <= futureDateStr &&
      ['PLANNING', 'OPEN_REGISTRATION'].includes(program.status)
    )
  }, [programs])

  const getPopularPrograms = useCallback(() => {
    return programs
      .filter(program => program.evaluation?.participant?.satisfaction?.overall > 0)
      .sort((a, b) =>
        (b.evaluation?.participant?.satisfaction?.overall || 0) -
        (a.evaluation?.participant?.satisfaction?.overall || 0)
      )
      .slice(0, 10)
  }, [programs])

  const getTotalEnrollments = useCallback(() => {
    return programs.reduce((total, program) => total + program.participants.length, 0)
  }, [programs])

  const getCompletionRate = useCallback(() => {
    const completedPrograms = programs.filter(program => program.status === 'COMPLETED')
    const totalParticipants = completedPrograms.reduce((total, program) => total + program.participants.length, 0)
    const completedParticipants = completedPrograms.reduce((total, program) =>
      total + program.participants.filter(p => p.status === 'COMPLETED').length, 0)

    return totalParticipants > 0 ? (completedParticipants / totalParticipants) * 100 : 0
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
    gradeAssignment,
    issueCertificate,
    addInstructor,
    addMaterial,
    collectFeedback,
    generateReport,
    getProgramById,
    getProgramsByType,
    getProgramsByCategory,
    getProgramsByLevel,
    getOpenRegistrations,
    getActivePrograms,
    getProgramsByInstructor,
    getProgramsWithVacancies,
    getUpcomingPrograms,
    getPopularPrograms,
    getTotalEnrollments,
    getCompletionRate
  }
}