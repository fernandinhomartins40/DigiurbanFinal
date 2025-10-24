import { useState, useEffect, useCallback } from 'react'
import { apiClient } from '@/lib/api-client'

export interface CulturalHeritage {
  id: string
  name: string
  code: string
  type: 'BUILDING' | 'MONUMENT' | 'SITE' | 'OBJECT' | 'DOCUMENT' | 'TRADITION' | 'KNOWLEDGE' | 'PRACTICE' | 'LANDSCAPE' | 'COLLECTION'
  category: 'MATERIAL' | 'IMMATERIAL' | 'NATURAL' | 'MIXED'
  classification: 'ARCHAEOLOGICAL' | 'ARCHITECTURAL' | 'ARTISTIC' | 'HISTORICAL' | 'CULTURAL' | 'RELIGIOUS' | 'PALEONTOLOGICAL' | 'ETHNOGRAPHIC'
  status: 'ACTIVE' | 'AT_RISK' | 'DETERIORATED' | 'RESTORED' | 'LOST' | 'UNKNOWN' | 'PROTECTED'
  protection: {
    level: 'MUNICIPAL' | 'STATE' | 'FEDERAL' | 'INTERNATIONAL' | 'NONE'
    designation: string
    protectionDate?: string
    protectedBy: string[]
    registrationNumber?: string
    legislation: Array<{
      type: 'LAW' | 'DECREE' | 'RESOLUTION' | 'ORDINANCE'
      number: string
      date: string
      description: string
      scope: string
    }>
    restrictions: string[]
    obligations: string[]
  }
  description: {
    general: string
    historical: string
    artistic?: string
    architectural?: string
    cultural: string
    significance: string
    uniqueness: string
  }
  chronology: {
    period: string
    century?: string
    exactDate?: string
    approximateDate?: string
    constructionPeriod?: {
      start: string
      end: string
    }
    historicalEvents: Array<{
      date: string
      event: string
      importance: 'HIGH' | 'MEDIUM' | 'LOW'
      source: string
    }>
  }
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
      altitude?: number
    }
    region: string
    accessibility: {
      public: boolean
      transportation: string[]
      visitingHours?: {
        monday: { open: string; close: string; closed: boolean }
        tuesday: { open: string; close: string; closed: boolean }
        wednesday: { open: string; close: string; closed: boolean }
        thursday: { open: string; close: string; closed: boolean }
        friday: { open: string; close: string; closed: boolean }
        saturday: { open: string; close: string; closed: boolean }
        sunday: { open: string; close: string; closed: boolean }
      }
      restrictions: string[]
      fees?: {
        adult: number
        student: number
        senior: number
        group: number
        free: boolean
      }
    }
  }
  ownership: {
    type: 'PUBLIC' | 'PRIVATE' | 'RELIGIOUS' | 'MIXED' | 'UNKNOWN'
    owner: {
      name: string
      type: 'PERSON' | 'INSTITUTION' | 'GOVERNMENT' | 'CHURCH' | 'COMPANY'
      contact?: string
      since?: string
    }
    custody?: {
      custodian: string
      since: string
      agreement: string
    }
    previousOwners: Array<{
      name: string
      period: {
        start: string
        end: string
      }
      notes?: string
    }>
  }
  physical: {
    dimensions?: {
      length?: number
      width?: number
      height?: number
      area?: number
      volume?: number
      weight?: number
      unit: string
    }
    materials: Array<{
      material: string
      percentage?: number
      period?: string
      condition: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR' | 'CRITICAL'
    }>
    techniques: string[]
    style?: string
    characteristics: string[]
    inscriptions?: Array<{
      text: string
      language: string
      location: string
      legibility: 'CLEAR' | 'PARTIAL' | 'ILLEGIBLE'
      significance: string
    }>
  }
  condition: {
    overall: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR' | 'CRITICAL' | 'RUINED'
    structural: 'STABLE' | 'MINOR_ISSUES' | 'MAJOR_ISSUES' | 'CRITICAL' | 'COLLAPSED'
    lastAssessment: string
    assessedBy: string
    threats: Array<{
      type: 'NATURAL' | 'HUMAN' | 'ENVIRONMENTAL' | 'STRUCTURAL' | 'LEGAL'
      threat: string
      severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
      urgency: 'LOW' | 'MEDIUM' | 'HIGH' | 'IMMEDIATE'
      description: string
    }>
    deterioration: Array<{
      type: string
      extent: 'LOCALIZED' | 'WIDESPREAD' | 'SEVERE'
      cause: string
      progression: 'STABLE' | 'SLOW' | 'MODERATE' | 'FAST'
    }>
    monitoring: {
      frequency: 'MONTHLY' | 'QUARTERLY' | 'ANNUALLY' | 'AS_NEEDED'
      lastMonitoring: string
      nextMonitoring: string
      responsible: string
      method: string[]
    }
  }
  conservation: {
    history: Array<{
      id: string
      date: string
      type: 'RESTORATION' | 'CONSERVATION' | 'MAINTENANCE' | 'REPAIR' | 'RECONSTRUCTION'
      description: string
      scope: string
      technician: string
      cost: number
      materials: string[]
      documentation: string[]
      results: string
    }>
    plan: {
      exists: boolean
      lastUpdate?: string
      responsible?: string
      priorities: Array<{
        action: string
        priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
        timeline: string
        estimatedCost: number
      }>
      methodology: string[]
      standards: string[]
    }
    needs: {
      immediate: string[]
      shortTerm: string[]
      longTerm: string[]
      preventive: string[]
      urgent: string[]
    }
    budget: {
      annual: number
      allocated: number
      spent: number
      required: number
      sources: Array<{
        source: 'MUNICIPAL' | 'STATE' | 'FEDERAL' | 'PRIVATE' | 'INTERNATIONAL'
        amount: number
        confirmed: boolean
      }>
    }
  }
  documentation: {
    registry: {
      inventoryNumber: string
      registrationDate: string
      registeredBy: string
      lastUpdate: string
      updatedBy: string
    }
    research: Array<{
      id: string
      title: string
      author: string
      date: string
      type: 'ARCHAEOLOGICAL' | 'HISTORICAL' | 'ARCHITECTURAL' | 'ARTISTIC' | 'CULTURAL'
      summary: string
      url?: string
    }>
    bibliography: Array<{
      type: 'BOOK' | 'ARTICLE' | 'THESIS' | 'REPORT' | 'NEWSPAPER'
      title: string
      author: string
      year: number
      publisher?: string
      relevance: 'HIGH' | 'MEDIUM' | 'LOW'
    }>
    media: {
      photos: Array<{
        id: string
        url: string
        title: string
        description: string
        date: string
        photographer: string
        angle?: string
        resolution: string
        format: string
      }>
      videos: Array<{
        id: string
        url: string
        title: string
        description: string
        date: string
        duration: number
        producer: string
      }>
      audio: Array<{
        id: string
        url: string
        title: string
        description: string
        date: string
        duration: number
        type: 'INTERVIEW' | 'AMBIENT' | 'NARRATION' | 'MUSIC'
      }>
      drawings: Array<{
        id: string
        url: string
        title: string
        type: 'TECHNICAL' | 'ARTISTIC' | 'ARCHAEOLOGICAL' | 'ARCHITECTURAL'
        author: string
        date: string
        scale?: string
      }>
      maps: Array<{
        id: string
        url: string
        title: string
        scale: string
        date: string
        author: string
        type: 'LOCATION' | 'HISTORICAL' | 'ARCHAEOLOGICAL'
      }>
    }
    legal: Array<{
      type: 'PROTECTION_DECREE' | 'OWNERSHIP_DEED' | 'PERMIT' | 'STUDY' | 'REPORT'
      title: string
      date: string
      authority: string
      url?: string
      status: 'VALID' | 'EXPIRED' | 'REVOKED'
    }>
  }
  management: {
    responsible: {
      institution: string
      department: string
      contact: {
        name: string
        position: string
        email: string
        phone: string
      }
    }
    team: Array<{
      name: string
      role: 'MANAGER' | 'CONSERVATOR' | 'GUIDE' | 'SECURITY' | 'RESEARCHER' | 'TECHNICIAN'
      qualification: string[]
      contact: string
    }>
    policies: {
      access: string
      conservation: string
      use: string
      education: string
      research: string
    }
    partnerships: Array<{
      partner: string
      type: 'UNIVERSITY' | 'MUSEUM' | 'NGO' | 'GOVERNMENT' | 'PRIVATE' | 'INTERNATIONAL'
      role: string
      agreement: string
      startDate: string
      endDate?: string
    }>
  }
  interpretation: {
    significance: {
      local: string
      regional: string
      national: string
      international?: string
    }
    themes: string[]
    narratives: Array<{
      theme: string
      narrative: string
      audience: string[]
      language: string[]
    }>
    educational: {
      programs: Array<{
        name: string
        targetAudience: string[]
        duration: number
        capacity: number
        frequency: string
        description: string
      }>
      materials: Array<{
        type: 'BROCHURE' | 'GUIDE' | 'WEBSITE' | 'APP' | 'EXHIBITION' | 'AUDIO_GUIDE'
        title: string
        language: string[]
        lastUpdate: string
        url?: string
      }>
    }
    tourism: {
      included: boolean
      routes: string[]
      visitors: {
        annual: number
        monthly: number
        peak: string
        demographics: {
          local: number
          regional: number
          national: number
          international: number
        }
      }
      services: string[]
      infrastructure: string[]
    }
  }
  community: {
    involvement: {
      level: 'HIGH' | 'MEDIUM' | 'LOW' | 'NONE'
      activities: string[]
      organizations: string[]
      leaders: Array<{
        name: string
        role: string
        contact: string
      }>
    }
    memory: {
      oralHistory: Array<{
        narrator: string
        date: string
        theme: string
        duration: number
        transcription?: string
        audio?: string
      }>
      traditions: Array<{
        name: string
        description: string
        practitioners: number
        frequency: string
        risk: 'SAFE' | 'VULNERABLE' | 'CRITICALLY_ENDANGERED' | 'EXTINCT'
      }>
      events: Array<{
        name: string
        type: 'RELIGIOUS' | 'CULTURAL' | 'HISTORICAL' | 'COMMEMORATIVE'
        frequency: string
        participants: number
        description: string
      }>
    }
    benefits: {
      economic: string[]
      social: string[]
      cultural: string[]
      educational: string[]
    }
  }
  digitization: {
    status: 'NOT_STARTED' | 'IN_PROGRESS' | 'PARTIAL' | 'COMPLETE'
    platform?: string
    formats: string[]
    resolution: string[]
    metadata: {
      complete: boolean
      standards: string[]
      languages: string[]
    }
    access: {
      public: boolean
      restrictions: string[]
      url?: string
    }
    progress: {
      percentage: number
      lastUpdate: string
      responsible: string
    }
  }
  monitoring: {
    indicators: Array<{
      name: string
      type: 'CONSERVATION' | 'TOURISM' | 'COMMUNITY' | 'LEGAL' | 'FINANCIAL'
      value: number
      unit: string
      target?: number
      frequency: string
      lastMeasurement: string
    }>
    alerts: Array<{
      type: 'CONSERVATION' | 'SECURITY' | 'LEGAL' | 'TOURISM' | 'COMMUNITY'
      message: string
      severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
      date: string
      resolved: boolean
    }>
    reports: Array<{
      type: 'CONDITION' | 'VISITORS' | 'CONSERVATION' | 'MANAGEMENT' | 'ANNUAL'
      period: string
      author: string
      date: string
      url: string
    }>
  }
  createdAt: string
  updatedAt: string
  createdBy: string
  lastModifiedBy: string
}

export interface CreateCulturalHeritageData {
  name: string
  code: string
  type: 'BUILDING' | 'MONUMENT' | 'SITE' | 'OBJECT' | 'DOCUMENT' | 'TRADITION' | 'KNOWLEDGE' | 'PRACTICE' | 'LANDSCAPE' | 'COLLECTION'
  category: 'MATERIAL' | 'IMMATERIAL' | 'NATURAL' | 'MIXED'
  classification: 'ARCHAEOLOGICAL' | 'ARCHITECTURAL' | 'ARTISTIC' | 'HISTORICAL' | 'CULTURAL' | 'RELIGIOUS' | 'PALEONTOLOGICAL' | 'ETHNOGRAPHIC'
  description: {
    general: string
    historical: string
    cultural: string
    significance: string
    uniqueness: string
  }
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
      altitude?: number
    }
    region: string
  }
  ownership: {
    type: 'PUBLIC' | 'PRIVATE' | 'RELIGIOUS' | 'MIXED' | 'UNKNOWN'
    owner: {
      name: string
      type: 'PERSON' | 'INSTITUTION' | 'GOVERNMENT' | 'CHURCH' | 'COMPANY'
      contact?: string
      since?: string
    }
  }
  chronology: {
    period: string
    century?: string
    exactDate?: string
    approximateDate?: string
  }
  responsibleInstitution: string
  responsibleDepartment: string
  responsibleContact: {
    name: string
    position: string
    email: string
    phone: string
  }
}

export interface CulturalHeritageFilters {
  type?: string
  category?: string
  classification?: string
  status?: string
  protectionLevel?: string
  condition?: string
  region?: string
  period?: string
  accessibility?: boolean
  digitized?: boolean
}

export function useCulturalHeritage() {
  const [heritages, setHeritages] = useState<CulturalHeritage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchHeritages = useCallback(async (filters?: CulturalHeritageFilters) => {
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
      const response = await apiClient.get(`/culture/heritage?${params}`)
      setHeritages(response.data.data || [])
    } catch (err) {
      setError('Erro ao carregar patrimônio cultural')
      console.error('Error fetching cultural heritage:', err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const createHeritage = useCallback(async (data: CreateCulturalHeritageData) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await apiClient.post('/culture/heritage', data)
      const newHeritage = response.data.data
      setHeritages(prev => [newHeritage, ...prev])
      return newHeritage
    } catch (err) {
      setError('Erro ao cadastrar patrimônio cultural')
      console.error('Error creating cultural heritage:', err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const updateHeritage = useCallback(async (id: string, data: Partial<CreateCulturalHeritageData>) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await apiClient.put(`/culture/heritage/${id}`, data)
      const updatedHeritage = response.data.data
      setHeritages(prev => prev.map(heritage => heritage.id === id ? updatedHeritage : heritage))
      return updatedHeritage
    } catch (err) {
      setError('Erro ao atualizar patrimônio cultural')
      console.error('Error updating cultural heritage:', err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const deleteHeritage = useCallback(async (id: string) => {
    setIsLoading(true)
    setError(null)
    try {
      await apiClient.delete(`/culture/heritage/${id}`)
      setHeritages(prev => prev.filter(heritage => heritage.id !== id))
    } catch (err) {
      setError('Erro ao excluir patrimônio cultural')
      console.error('Error deleting cultural heritage:', err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const addProtection = useCallback(async (id: string, protectionData: {
    level: 'MUNICIPAL' | 'STATE' | 'FEDERAL' | 'INTERNATIONAL'
    designation: string
    protectionDate: string
    protectedBy: string[]
    registrationNumber?: string
    legislation: Array<{
      type: 'LAW' | 'DECREE' | 'RESOLUTION' | 'ORDINANCE'
      number: string
      date: string
      description: string
      scope: string
    }>
    restrictions: string[]
    obligations: string[]
  }) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await apiClient.post(`/culture/heritage/${id}/protection`, protectionData)
      const updatedHeritage = response.data.data
      setHeritages(prev => prev.map(heritage => heritage.id === id ? updatedHeritage : heritage))
      return updatedHeritage
    } catch (err) {
      setError('Erro ao adicionar proteção')
      console.error('Error adding protection:', err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const assessCondition = useCallback(async (id: string, assessmentData: {
    overall: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR' | 'CRITICAL' | 'RUINED'
    structural: 'STABLE' | 'MINOR_ISSUES' | 'MAJOR_ISSUES' | 'CRITICAL' | 'COLLAPSED'
    assessedBy: string
    threats: Array<{
      type: 'NATURAL' | 'HUMAN' | 'ENVIRONMENTAL' | 'STRUCTURAL' | 'LEGAL'
      threat: string
      severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
      urgency: 'LOW' | 'MEDIUM' | 'HIGH' | 'IMMEDIATE'
      description: string
    }>
    deterioration: Array<{
      type: string
      extent: 'LOCALIZED' | 'WIDESPREAD' | 'SEVERE'
      cause: string
      progression: 'STABLE' | 'SLOW' | 'MODERATE' | 'FAST'
    }>
    photos?: File[]
    report?: File
  }) => {
    setIsLoading(true)
    setError(null)
    try {
      const formData = new FormData()
      Object.entries(assessmentData).forEach(([key, value]) => {
        if (key === 'photos' && Array.isArray(value)) {
          value.forEach((file, index) => {
            formData.append(`photos[${index}]`, file)
          })
        } else if (key === 'report' && value instanceof File) {
          formData.append('report', value)
        } else if (Array.isArray(value)) {
          formData.append(key, JSON.stringify(value))
        } else if (value !== undefined) {
          formData.append(key, value.toString())
        }
      })

      const response = await apiClient.post(`/culture/heritage/${id}/condition`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      const updatedHeritage = response.data.data
      setHeritages(prev => prev.map(heritage => heritage.id === id ? updatedHeritage : heritage))
      return updatedHeritage
    } catch (err) {
      setError('Erro ao avaliar condição')
      console.error('Error assessing condition:', err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const recordConservation = useCallback(async (id: string, conservationData: {
    type: 'RESTORATION' | 'CONSERVATION' | 'MAINTENANCE' | 'REPAIR' | 'RECONSTRUCTION'
    description: string
    scope: string
    technician: string
    cost: number
    materials: string[]
    startDate: string
    endDate: string
    documentation?: File[]
  }) => {
    setIsLoading(true)
    setError(null)
    try {
      const formData = new FormData()
      Object.entries(conservationData).forEach(([key, value]) => {
        if (key === 'documentation' && Array.isArray(value)) {
          value.forEach((file, index) => {
            formData.append(`documentation[${index}]`, file)
          })
        } else if (Array.isArray(value)) {
          formData.append(key, JSON.stringify(value))
        } else if (value !== undefined) {
          formData.append(key, value.toString())
        }
      })

      const response = await apiClient.post(`/culture/heritage/${id}/conservation`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      const updatedHeritage = response.data.data
      setHeritages(prev => prev.map(heritage => heritage.id === id ? updatedHeritage : heritage))
      return updatedHeritage
    } catch (err) {
      setError('Erro ao registrar conservação')
      console.error('Error recording conservation:', err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const uploadMedia = useCallback(async (id: string, mediaData: {
    type: 'photo' | 'video' | 'audio' | 'drawing' | 'map'
    files: File[]
    title: string
    description: string
    author: string
    category?: string
    date?: string
  }) => {
    setIsLoading(true)
    setError(null)
    try {
      const formData = new FormData()
      mediaData.files.forEach((file, index) => {
        formData.append(`files[${index}]`, file)
      })
      formData.append('type', mediaData.type)
      formData.append('title', mediaData.title)
      formData.append('description', mediaData.description)
      formData.append('author', mediaData.author)
      if (mediaData.category) formData.append('category', mediaData.category)
      if (mediaData.date) formData.append('date', mediaData.date)

      const response = await apiClient.post(`/culture/heritage/${id}/media`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      const updatedHeritage = response.data.data
      setHeritages(prev => prev.map(heritage => heritage.id === id ? updatedHeritage : heritage))
      return updatedHeritage
    } catch (err) {
      setError('Erro ao enviar mídia')
      console.error('Error uploading media:', err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const addOralHistory = useCallback(async (id: string, historyData: {
    narrator: string
    theme: string
    duration: number
    audio: File
    transcription?: string
    interviewDate: string
  }) => {
    setIsLoading(true)
    setError(null)
    try {
      const formData = new FormData()
      formData.append('audio', historyData.audio)
      formData.append('narrator', historyData.narrator)
      formData.append('theme', historyData.theme)
      formData.append('duration', historyData.duration.toString())
      formData.append('interviewDate', historyData.interviewDate)
      if (historyData.transcription) {
        formData.append('transcription', historyData.transcription)
      }

      const response = await apiClient.post(`/culture/heritage/${id}/oral-history`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      const updatedHeritage = response.data.data
      setHeritages(prev => prev.map(heritage => heritage.id === id ? updatedHeritage : heritage))
      return updatedHeritage
    } catch (err) {
      setError('Erro ao adicionar história oral')
      console.error('Error adding oral history:', err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const updateDigitization = useCallback(async (id: string, digitizationData: {
    status: 'NOT_STARTED' | 'IN_PROGRESS' | 'PARTIAL' | 'COMPLETE'
    platform?: string
    formats: string[]
    resolution: string[]
    progress: number
    responsible: string
  }) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await apiClient.put(`/culture/heritage/${id}/digitization`, digitizationData)
      const updatedHeritage = response.data.data
      setHeritages(prev => prev.map(heritage => heritage.id === id ? updatedHeritage : heritage))
      return updatedHeritage
    } catch (err) {
      setError('Erro ao atualizar digitalização')
      console.error('Error updating digitization:', err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const recordVisitors = useCallback(async (id: string, visitorsData: {
    date: string
    count: number
    demographics: {
      local: number
      regional: number
      national: number
      international: number
    }
    notes?: string
  }) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await apiClient.post(`/culture/heritage/${id}/visitors`, visitorsData)
      const updatedHeritage = response.data.data
      setHeritages(prev => prev.map(heritage => heritage.id === id ? updatedHeritage : heritage))
      return updatedHeritage
    } catch (err) {
      setError('Erro ao registrar visitantes')
      console.error('Error recording visitors:', err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const generateReport = useCallback(async (id: string, reportType: 'CONDITION' | 'CONSERVATION' | 'VISITORS' | 'COMPREHENSIVE') => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await apiClient.post(`/culture/heritage/${id}/reports`, { type: reportType })
      return response.data.data
    } catch (err) {
      setError('Erro ao gerar relatório')
      console.error('Error generating report:', err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const getHeritageById = useCallback((id: string) => {
    return heritages.find(heritage => heritage.id === id)
  }, [heritages])

  const getHeritagesByType = useCallback((type: string) => {
    return heritages.filter(heritage => heritage.type === type)
  }, [heritages])

  const getHeritagesByCategory = useCallback((category: string) => {
    return heritages.filter(heritage => heritage.category === category)
  }, [heritages])

  const getProtectedHeritages = useCallback((level?: string) => {
    return heritages.filter(heritage =>
      heritage.protection.level !== 'NONE' &&
      (!level || heritage.protection.level === level)
    )
  }, [heritages])

  const getAtRiskHeritages = useCallback(() => {
    return heritages.filter(heritage =>
      heritage.status === 'AT_RISK' ||
      heritage.condition.overall === 'POOR' ||
      heritage.condition.overall === 'CRITICAL' ||
      heritage.condition.threats.some(threat => threat.severity === 'HIGH' || threat.severity === 'CRITICAL')
    )
  }, [heritages])

  const getHeritagesByCondition = useCallback((condition: string) => {
    return heritages.filter(heritage => heritage.condition.overall === condition)
  }, [heritages])

  const getPublicHeritages = useCallback(() => {
    return heritages.filter(heritage => heritage.location.accessibility.public)
  }, [heritages])

  const getDigitizedHeritages = useCallback(() => {
    return heritages.filter(heritage =>
      heritage.digitization.status === 'PARTIAL' || heritage.digitization.status === 'COMPLETE'
    )
  }, [heritages])

  const getHeritagesByRegion = useCallback((region: string) => {
    return heritages.filter(heritage => heritage.location.region === region)
  }, [heritages])

  const getUrgentConservationNeeds = useCallback(() => {
    return heritages.filter(heritage =>
      heritage.conservation.needs.urgent.length > 0 ||
      heritage.condition.threats.some(threat => threat.urgency === 'IMMEDIATE')
    )
  }, [heritages])

  const getTotalConservationBudget = useCallback(() => {
    return heritages.reduce((total, heritage) => total + heritage.conservation.budget.required, 0)
  }, [heritages])

  const getAnnualVisitors = useCallback(() => {
    return heritages.reduce((total, heritage) =>
      total + (heritage.interpretation?.tourism?.visitors?.annual || 0), 0)
  }, [heritages])

  useEffect(() => {
    fetchHeritages()
  }, [fetchHeritages])

  return {
    heritages,
    isLoading,
    error,
    fetchHeritages,
    createHeritage,
    updateHeritage,
    deleteHeritage,
    addProtection,
    assessCondition,
    recordConservation,
    uploadMedia,
    addOralHistory,
    updateDigitization,
    recordVisitors,
    generateReport,
    getHeritageById,
    getHeritagesByType,
    getHeritagesByCategory,
    getProtectedHeritages,
    getAtRiskHeritages,
    getHeritagesByCondition,
    getPublicHeritages,
    getDigitizedHeritages,
    getHeritagesByRegion,
    getUrgentConservationNeeds,
    getTotalConservationBudget,
    getAnnualVisitors
  }
}