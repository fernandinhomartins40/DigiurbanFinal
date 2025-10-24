import { useState, useEffect, useCallback } from 'react'
import { apiClient } from '@/lib/api-client'

export interface PublicWorksInspection {
  id: string
  number: string
  projectId: string
  projectName: string
  contractId?: string
  contractNumber?: string
  type: 'ROUTINE' | 'QUALITY' | 'SAFETY' | 'ENVIRONMENTAL' | 'TECHNICAL' | 'FINANCIAL' | 'FINAL' | 'EMERGENCY'
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'RESCHEDULED'
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  scheduledDate: string
  actualDate?: string
  duration: number
  inspector: {
    id: string
    name: string
    role: string
    crea?: string
    email: string
    phone: string
  }
  team?: Array<{
    id: string
    name: string
    role: string
    specialization?: string
  }>
  location: {
    address: string
    specificArea?: string
    coordinates?: {
      lat: number
      lng: number
    }
  }
  scope: {
    areas: string[]
    items: Array<{
      id: string
      category: string
      item: string
      specification: string
      status: 'CONFORMING' | 'NON_CONFORMING' | 'PENDING' | 'NOT_APPLICABLE'
      observations?: string
    }>
    checklist: Array<{
      id: string
      description: string
      isCompliant: boolean
      observations?: string
      photos?: string[]
    }>
  }
  findings: {
    conformities: Array<{
      id: string
      description: string
      category: string
      evidence?: string[]
    }>
    nonConformities: Array<{
      id: string
      description: string
      category: 'MINOR' | 'MAJOR' | 'CRITICAL'
      severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
      requirement: string
      evidence: string[]
      correctionDeadline?: string
      correctionStatus: 'PENDING' | 'IN_PROGRESS' | 'CORRECTED' | 'OVERDUE'
      correctionDescription?: string
      correctionDate?: string
      correctionEvidence?: string[]
    }>
    recommendations: Array<{
      id: string
      description: string
      priority: 'LOW' | 'MEDIUM' | 'HIGH'
      category: string
      justification: string
    }>
  }
  assessments: {
    overall: 'EXCELLENT' | 'GOOD' | 'SATISFACTORY' | 'NEEDS_IMPROVEMENT' | 'UNSATISFACTORY' | 'CRITICAL'
    technical: {
      score: number
      maxScore: number
      areas: Array<{
        name: string
        score: number
        maxScore: number
        observations?: string
      }>
    }
    safety: {
      score: number
      maxScore: number
      violations: number
      riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
    }
    environmental: {
      score: number
      maxScore: number
      violations: number
      impactLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
    }
    quality: {
      score: number
      maxScore: number
      defects: number
      grade: 'A' | 'B' | 'C' | 'D' | 'F'
    }
  }
  measurements?: {
    progress: number
    completedItems: number
    totalItems: number
    measurements: Array<{
      id: string
      item: string
      unit: string
      planned: number
      executed: number
      approved: number
      percentage: number
    }>
  }
  documentation: {
    photos: Array<{
      id: string
      filename: string
      description: string
      category: string
      timestamp: string
      url: string
      location?: {
        lat: number
        lng: number
      }
    }>
    videos?: Array<{
      id: string
      filename: string
      description: string
      duration: number
      timestamp: string
      url: string
    }>
    documents: Array<{
      id: string
      name: string
      type: 'REPORT' | 'CERTIFICATE' | 'TEST_RESULT' | 'MEASUREMENT' | 'DRAWING' | 'OTHER'
      url: string
      uploadDate: string
      size: number
    }>
  }
  weather?: {
    temperature: number
    humidity: number
    precipitation: number
    windSpeed: number
    conditions: string
  }
  followUp: {
    nextInspectionDate?: string
    nextInspectionType?: string
    actionItems: Array<{
      id: string
      description: string
      responsible: string
      deadline: string
      priority: 'LOW' | 'MEDIUM' | 'HIGH'
      status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'OVERDUE'
    }>
    notifications: Array<{
      id: string
      recipient: string
      type: 'EMAIL' | 'SMS' | 'SYSTEM'
      message: string
      sentDate: string
      status: 'SENT' | 'DELIVERED' | 'READ' | 'FAILED'
    }>
  }
  approvals: {
    inspectorApproval: {
      approved: boolean
      date?: string
      notes?: string
    }
    supervisorApproval?: {
      approved: boolean
      date?: string
      supervisor: string
      notes?: string
    }
    finalApproval?: {
      approved: boolean
      date?: string
      approver: string
      notes?: string
    }
  }
  createdAt: string
  updatedAt: string
  createdBy: string
  lastModifiedBy: string
}

export interface CreatePublicWorksInspectionData {
  projectId: string
  contractId?: string
  type: 'ROUTINE' | 'QUALITY' | 'SAFETY' | 'ENVIRONMENTAL' | 'TECHNICAL' | 'FINANCIAL' | 'FINAL' | 'EMERGENCY'
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  scheduledDate: string
  duration: number
  inspectorId: string
  teamIds?: string[]
  scope: {
    areas: string[]
    items?: Array<{
      category: string
      item: string
      specification: string
    }>
  }
  objectives?: string[]
  specialRequirements?: string[]
}

export interface PublicWorksInspectionFilters {
  type?: string
  status?: string
  priority?: string
  inspectorId?: string
  projectId?: string
  contractId?: string
  dateFrom?: string
  dateTo?: string
  overallAssessment?: string
}

export function usePublicWorksInspections() {
  const [inspections, setInspections] = useState<PublicWorksInspection[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchInspections = useCallback(async (filters?: PublicWorksInspectionFilters) => {
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
      const response = await apiClient.get(`/public-works/inspections?${params}`)
      setInspections(response.data.data || [])
    } catch (err) {
      setError('Erro ao carregar vistorias de obras públicas')
      console.error('Error fetching public works inspections:', err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const createInspection = useCallback(async (data: CreatePublicWorksInspectionData) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await apiClient.post('/public-works/inspections', data)
      const newInspection = response.data.data
      setInspections(prev => [newInspection, ...prev])
      return newInspection
    } catch (err) {
      setError('Erro ao criar vistoria de obra pública')
      console.error('Error creating public works inspection:', err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const updateInspection = useCallback(async (id: string, data: Partial<CreatePublicWorksInspectionData>) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await apiClient.put(`/public-works/inspections/${id}`, data)
      const updatedInspection = response.data.data
      setInspections(prev => prev.map(inspection => inspection.id === id ? updatedInspection : inspection))
      return updatedInspection
    } catch (err) {
      setError('Erro ao atualizar vistoria de obra pública')
      console.error('Error updating public works inspection:', err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const deleteInspection = useCallback(async (id: string) => {
    setIsLoading(true)
    setError(null)
    try {
      await apiClient.delete(`/public-works/inspections/${id}`)
      setInspections(prev => prev.filter(inspection => inspection.id !== id))
    } catch (err) {
      setError('Erro ao excluir vistoria de obra pública')
      console.error('Error deleting public works inspection:', err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const startInspection = useCallback(async (id: string, startData: {
    actualStartDate: string
    weather?: {
      temperature: number
      humidity: number
      precipitation: number
      windSpeed: number
      conditions: string
    }
    initialObservations?: string
  }) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await apiClient.post(`/public-works/inspections/${id}/start`, startData)
      const updatedInspection = response.data.data
      setInspections(prev => prev.map(inspection => inspection.id === id ? updatedInspection : inspection))
      return updatedInspection
    } catch (err) {
      setError('Erro ao iniciar vistoria')
      console.error('Error starting inspection:', err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const addFindings = useCallback(async (id: string, findingsData: {
    conformities?: Array<{
      description: string
      category: string
      evidence?: File[]
    }>
    nonConformities?: Array<{
      description: string
      category: 'MINOR' | 'MAJOR' | 'CRITICAL'
      severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
      requirement: string
      evidence: File[]
      correctionDeadline?: string
    }>
    recommendations?: Array<{
      description: string
      priority: 'LOW' | 'MEDIUM' | 'HIGH'
      category: string
      justification: string
    }>
  }) => {
    setIsLoading(true)
    setError(null)
    try {
      const formData = new FormData()

      // Add findings data
      Object.entries(findingsData).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach((item, index) => {
            if (item.evidence && Array.isArray(item.evidence)) {
              item.evidence.forEach((file, fileIndex) => {
                formData.append(`${key}[${index}].evidence[${fileIndex}]`, file)
              })
              delete item.evidence
            }
            formData.append(`${key}[${index}]`, JSON.stringify(item))
          })
        }
      })

      const response = await apiClient.post(`/public-works/inspections/${id}/findings`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      const updatedInspection = response.data.data
      setInspections(prev => prev.map(inspection => inspection.id === id ? updatedInspection : inspection))
      return updatedInspection
    } catch (err) {
      setError('Erro ao adicionar constatações')
      console.error('Error adding findings:', err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const uploadPhotos = useCallback(async (id: string, photos: Array<{
    file: File
    description: string
    category: string
    location?: { lat: number; lng: number }
  }>) => {
    setIsLoading(true)
    setError(null)
    try {
      const formData = new FormData()
      photos.forEach((photo, index) => {
        formData.append(`photos[${index}]`, photo.file)
        formData.append(`photoData[${index}]`, JSON.stringify({
          description: photo.description,
          category: photo.category,
          location: photo.location
        }))
      })

      const response = await apiClient.post(`/public-works/inspections/${id}/photos`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      const updatedInspection = response.data.data
      setInspections(prev => prev.map(inspection => inspection.id === id ? updatedInspection : inspection))
      return updatedInspection
    } catch (err) {
      setError('Erro ao enviar fotos')
      console.error('Error uploading photos:', err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const completeInspection = useCallback(async (id: string, completionData: {
    assessments: {
      overall: 'EXCELLENT' | 'GOOD' | 'SATISFACTORY' | 'NEEDS_IMPROVEMENT' | 'UNSATISFACTORY' | 'CRITICAL'
      technical: {
        score: number
        maxScore: number
        areas: Array<{
          name: string
          score: number
          maxScore: number
          observations?: string
        }>
      }
      safety: {
        score: number
        maxScore: number
        violations: number
        riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
      }
      environmental: {
        score: number
        maxScore: number
        violations: number
        impactLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
      }
      quality: {
        score: number
        maxScore: number
        defects: number
        grade: 'A' | 'B' | 'C' | 'D' | 'F'
      }
    }
    measurements?: {
      progress: number
      measurements: Array<{
        item: string
        unit: string
        planned: number
        executed: number
        approved: number
      }>
    }
    nextInspectionDate?: string
    actionItems?: Array<{
      description: string
      responsible: string
      deadline: string
      priority: 'LOW' | 'MEDIUM' | 'HIGH'
    }>
    finalObservations?: string
  }) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await apiClient.post(`/public-works/inspections/${id}/complete`, completionData)
      const updatedInspection = response.data.data
      setInspections(prev => prev.map(inspection => inspection.id === id ? updatedInspection : inspection))
      return updatedInspection
    } catch (err) {
      setError('Erro ao finalizar vistoria')
      console.error('Error completing inspection:', err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const generateReport = useCallback(async (id: string, reportType: 'SUMMARY' | 'DETAILED' | 'TECHNICAL' | 'PHOTOGRAPHIC') => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await apiClient.post(`/public-works/inspections/${id}/report`, { type: reportType })
      return response.data.data
    } catch (err) {
      setError('Erro ao gerar relatório de vistoria')
      console.error('Error generating inspection report:', err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const getInspectionById = useCallback((id: string) => {
    return inspections.find(inspection => inspection.id === id)
  }, [inspections])

  const getInspectionsByStatus = useCallback((status: string) => {
    return inspections.filter(inspection => inspection.status === status)
  }, [inspections])

  const getInspectionsByProject = useCallback((projectId: string) => {
    return inspections.filter(inspection => inspection.projectId === projectId)
  }, [inspections])

  const getInspectionsByInspector = useCallback((inspectorId: string) => {
    return inspections.filter(inspection => inspection.inspector.id === inspectorId)
  }, [inspections])

  const getUpcomingInspections = useCallback((days: number = 7) => {
    const futureDate = new Date()
    futureDate.setDate(futureDate.getDate() + days)
    const futureDateStr = futureDate.toISOString().split('T')[0]

    return inspections.filter(inspection =>
      inspection.scheduledDate <= futureDateStr &&
      inspection.status === 'SCHEDULED'
    )
  }, [inspections])

  const getOverdueInspections = useCallback(() => {
    const today = new Date().toISOString().split('T')[0]
    return inspections.filter(inspection =>
      inspection.scheduledDate < today &&
      inspection.status === 'SCHEDULED'
    )
  }, [inspections])

  const getCriticalFindings = useCallback(() => {
    return inspections.flatMap(inspection =>
      inspection.findings.nonConformities
        .filter(nc => nc.severity === 'CRITICAL')
        .map(nc => ({
          ...nc,
          inspectionId: inspection.id,
          projectName: inspection.projectName
        }))
    )
  }, [inspections])

  useEffect(() => {
    fetchInspections()
  }, [fetchInspections])

  return {
    inspections,
    isLoading,
    error,
    fetchInspections,
    createInspection,
    updateInspection,
    deleteInspection,
    startInspection,
    addFindings,
    uploadPhotos,
    completeInspection,
    generateReport,
    getInspectionById,
    getInspectionsByStatus,
    getInspectionsByProject,
    getInspectionsByInspector,
    getUpcomingInspections,
    getOverdueInspections,
    getCriticalFindings
  }
}