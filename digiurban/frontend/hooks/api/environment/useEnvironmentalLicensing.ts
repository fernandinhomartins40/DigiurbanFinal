import { useState, useEffect, useCallback } from 'react'
import { apiClient } from '@/lib/api-client'

export interface EnvironmentalLicense {
  id: string
  number: string
  type: 'INSTALLATION' | 'OPERATION' | 'ALTERATION' | 'RENEWAL' | 'SIMPLIFICATION' | 'CORRECTION' | 'REGULARIZATION'
  category: 'LP' | 'LI' | 'LO' | 'LAS' | 'LAC' | 'LR' | 'SPECIAL'
  status: 'DRAFT' | 'SUBMITTED' | 'ANALYSIS' | 'ADDITIONAL_INFO' | 'APPROVED' | 'DENIED' | 'SUSPENDED' | 'EXPIRED' | 'CANCELLED'
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  activity: {
    code: string
    description: string
    sector: 'INDUSTRIAL' | 'COMMERCIAL' | 'SERVICES' | 'INFRASTRUCTURE' | 'URBAN_DEVELOPMENT' | 'MINING' | 'AGRICULTURE' | 'TOURISM' | 'OTHER'
    subSector: string
    potentialPollution: 'LOW' | 'MEDIUM' | 'HIGH'
    environmentalRisk: 'LOW' | 'MEDIUM' | 'HIGH'
  }
  applicant: {
    type: 'PERSON' | 'COMPANY' | 'GOVERNMENT' | 'NGO'
    name: string
    document: string
    email: string
    phone: string
    address: {
      street: string
      number: string
      complement?: string
      neighborhood: string
      city: string
      state: string
      cep: string
    }
    legalRepresentative?: {
      name: string
      document: string
      position: string
      email: string
      phone: string
    }
    technicalResponsible: {
      name: string
      profession: string
      registration: string
      email: string
      phone: string
    }
  }
  enterprise: {
    name: string
    cnpj?: string
    activity: string
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
      }
      coordinates: {
        lat: number
        lng: number
        datum: string
      }
      area: number
      zoning: string
      landUse: string[]
      surroundings: string[]
    }
    characteristics: {
      builtArea: number
      totalArea: number
      employees: number
      shifts: number
      operatingHours: string
      waterConsumption: number
      energyConsumption: number
    }
  }
  environmental: {
    impacts: Array<{
      type: 'AIR' | 'WATER' | 'SOIL' | 'NOISE' | 'VIBRATION' | 'VISUAL' | 'SOCIAL' | 'TRAFFIC'
      description: string
      magnitude: 'LOW' | 'MEDIUM' | 'HIGH'
      significance: 'LOW' | 'MEDIUM' | 'HIGH'
      duration: 'TEMPORARY' | 'PERMANENT' | 'REVERSIBLE' | 'IRREVERSIBLE'
      mitigation: string[]
      monitoring: string[]
    }>
    protectedAreas: Array<{
      name: string
      type: string
      distance: number
      impact: boolean
      measures: string[]
    }>
    waterResources: Array<{
      name: string
      type: 'RIVER' | 'STREAM' | 'LAKE' | 'RESERVOIR' | 'GROUNDWATER'
      distance: number
      use: string
      impact: boolean
      quality: string
    }>
    vegetation: {
      exists: boolean
      type: string[]
      nativeSpecies: number
      exoticSpecies: number
      conservation: 'EXCELLENT' | 'GOOD' | 'REGULAR' | 'DEGRADED'
      removal: {
        required: boolean
        area?: number
        species?: number
        compensation?: string
      }
    }
    fauna: {
      species: string[]
      endangered: string[]
      migration: boolean
      reproduction: boolean
      impact: string
    }
  }
  technical: {
    processes: Array<{
      name: string
      description: string
      inputs: Array<{
        material: string
        quantity: number
        unit: string
        source: string
      }>
      outputs: Array<{
        product: string
        quantity: number
        unit: string
        destination: string
      }>
      emissions: Array<{
        type: 'AIR' | 'WATER' | 'SOIL' | 'NOISE'
        pollutant: string
        quantity: number
        unit: string
        concentration: number
        standard: number
        treatment: string
      }>
    }>
    equipment: Array<{
      name: string
      type: string
      quantity: number
      capacity: string
      efficiency: number
      emissions: string[]
      controls: string[]
    }>
    controls: Array<{
      type: 'PRIMARY' | 'SECONDARY' | 'TERTIARY'
      equipment: string
      pollutant: string[]
      efficiency: number
      monitoring: string
    }>
    waste: Array<{
      type: 'SOLID' | 'LIQUID' | 'GASEOUS' | 'HAZARDOUS'
      classification: string
      source: string
      quantity: number
      unit: string
      treatment: string
      disposal: string
      transport: string
    }>
  }
  conditions: Array<{
    id: string
    type: 'GENERAL' | 'SPECIFIC' | 'MONITORING' | 'REPORTING' | 'EMERGENCY'
    description: string
    compliance: boolean
    deadline?: string
    responsible: string
    verification: string
    status: 'PENDING' | 'COMPLIANT' | 'NON_COMPLIANT' | 'PARTIAL'
  }>
  monitoring: {
    required: boolean
    parameters: Array<{
      parameter: string
      media: 'AIR' | 'WATER' | 'SOIL' | 'NOISE' | 'GROUNDWATER'
      frequency: string
      method: string
      limit: number
      unit: string
      location: string
    }>
    reports: Array<{
      type: 'SELF_MONITORING' | 'PERIODIC' | 'ANNUAL' | 'INCIDENT'
      frequency: string
      deadline: string
      format: string
      responsible: string
    }>
  }
  timeline: {
    submissionDate: string
    analysisStart?: string
    analysisDeadline: string
    decisionDate?: string
    validityStart?: string
    validityEnd?: string
    renewalDeadline?: string
    analysisTime: number
    extensions: Array<{
      reason: string
      days: number
      date: string
      justification: string
    }>
  }
  process: {
    protocol: string
    analyst: {
      id: string
      name: string
      registration: string
      email: string
      phone: string
    }
    team: Array<{
      id: string
      name: string
      role: string
      specialization: string
    }>
    phases: Array<{
      phase: 'FORMAL_ANALYSIS' | 'TECHNICAL_ANALYSIS' | 'FIELD_INSPECTION' | 'ADDITIONAL_INFO' | 'DECISION'
      status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'ON_HOLD'
      startDate?: string
      endDate?: string
      responsible: string
      observations?: string
    }>
  }
  documentation: {
    required: Array<{
      name: string
      type: string
      mandatory: boolean
      submitted: boolean
      approved: boolean
      observations?: string
      url?: string
    }>
    additional: Array<{
      name: string
      type: string
      requestDate: string
      submissionDate?: string
      status: 'REQUESTED' | 'SUBMITTED' | 'APPROVED' | 'REJECTED'
      justification: string
    }>
    technical: Array<{
      name: string
      type: 'STUDY' | 'REPORT' | 'PROJECT' | 'PLAN' | 'PROGRAM'
      author: string
      date: string
      status: 'SUBMITTED' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED'
      observations?: string
    }>
  }
  inspections: Array<{
    id: string
    type: 'PRELIMINARY' | 'TECHNICAL' | 'FOLLOW_UP' | 'COMPLIANCE' | 'COMPLAINT'
    date: string
    inspectors: string[]
    objective: string
    findings: string[]
    nonCompliances: Array<{
      condition: string
      description: string
      severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
      deadline: string
      status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED'
    }>
    recommendations: string[]
    report: string
    photos: string[]
  }>
  fees: {
    analysis: {
      value: number
      paid: boolean
      dueDate: string
      paymentDate?: string
    }
    inspection: {
      value: number
      paid: boolean
      dueDate: string
      paymentDate?: string
    }
    monitoring: {
      annual: number
      paid: boolean
      dueDate: string
      paymentDate?: string
    }
    penalties: Array<{
      type: string
      value: number
      reason: string
      date: string
      paid: boolean
      status: 'PENDING' | 'PAID' | 'CANCELLED' | 'APPEALING'
    }>
  }
  appeals: Array<{
    id: string
    type: 'ADMINISTRATIVE' | 'JUDICIAL'
    date: string
    reason: string
    status: 'SUBMITTED' | 'UNDER_REVIEW' | 'ACCEPTED' | 'REJECTED' | 'WITHDRAWN'
    decision?: string
    decisionDate?: string
  }>
  compliance: {
    status: 'COMPLIANT' | 'NON_COMPLIANT' | 'PARTIAL' | 'UNKNOWN'
    lastVerification: string
    nextVerification: string
    violations: Array<{
      id: string
      date: string
      type: string
      description: string
      severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
      fine: number
      status: 'OPEN' | 'RESOLVED' | 'APPEALING'
      correctionDeadline: string
    }>
    correctionMeasures: Array<{
      measure: string
      deadline: string
      status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED'
      verification?: string
    }>
  }
  communication: Array<{
    id: string
    type: 'NOTIFICATION' | 'REQUEST' | 'RESPONSE' | 'DECISION' | 'CLARIFICATION'
    date: string
    sender: string
    recipient: string
    subject: string
    content: string
    attachments: string[]
    read: boolean
    response?: {
      date: string
      content: string
      attachments: string[]
    }
  }>
  createdAt: string
  updatedAt: string
  createdBy: string
  lastModifiedBy: string
}

export interface CreateEnvironmentalLicenseData {
  type: 'INSTALLATION' | 'OPERATION' | 'ALTERATION' | 'RENEWAL' | 'SIMPLIFICATION' | 'CORRECTION' | 'REGULARIZATION'
  category: 'LP' | 'LI' | 'LO' | 'LAS' | 'LAC' | 'LR' | 'SPECIAL'
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  activity: {
    code: string
    description: string
    sector: 'INDUSTRIAL' | 'COMMERCIAL' | 'SERVICES' | 'INFRASTRUCTURE' | 'URBAN_DEVELOPMENT' | 'MINING' | 'AGRICULTURE' | 'TOURISM' | 'OTHER'
    subSector: string
    potentialPollution: 'LOW' | 'MEDIUM' | 'HIGH'
    environmentalRisk: 'LOW' | 'MEDIUM' | 'HIGH'
  }
  applicant: {
    type: 'PERSON' | 'COMPANY' | 'GOVERNMENT' | 'NGO'
    name: string
    document: string
    email: string
    phone: string
    address: {
      street: string
      number: string
      complement?: string
      neighborhood: string
      city: string
      state: string
      cep: string
    }
    technicalResponsible: {
      name: string
      profession: string
      registration: string
      email: string
      phone: string
    }
  }
  enterprise: {
    name: string
    cnpj?: string
    activity: string
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
      }
      coordinates: {
        lat: number
        lng: number
        datum: string
      }
      area: number
      zoning: string
    }
    characteristics: {
      builtArea: number
      totalArea: number
      employees: number
      shifts: number
      operatingHours: string
      waterConsumption: number
      energyConsumption: number
    }
  }
  analystId: string
}

export interface EnvironmentalLicenseFilters {
  type?: string
  category?: string
  status?: string
  priority?: string
  sector?: string
  analystId?: string
  applicant?: string
  submissionDateFrom?: string
  submissionDateTo?: string
  validityStatus?: 'VALID' | 'EXPIRED' | 'EXPIRING_SOON'
}

export function useEnvironmentalLicensing() {
  const [licenses, setLicenses] = useState<EnvironmentalLicense[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchLicenses = useCallback(async (filters?: EnvironmentalLicenseFilters) => {
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
      const response = await apiClient.get(`/environment/licensing?${params}`)
      setLicenses(response.data.data || [])
    } catch (err) {
      setError('Erro ao carregar licenças ambientais')
      console.error('Error fetching environmental licenses:', err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const createLicense = useCallback(async (data: CreateEnvironmentalLicenseData) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await apiClient.post('/environment/licensing', data)
      const newLicense = response.data.data
      setLicenses(prev => [newLicense, ...prev])
      return newLicense
    } catch (err) {
      setError('Erro ao criar licença ambiental')
      console.error('Error creating environmental license:', err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const updateLicense = useCallback(async (id: string, data: Partial<CreateEnvironmentalLicenseData>) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await apiClient.put(`/environment/licensing/${id}`, data)
      const updatedLicense = response.data.data
      setLicenses(prev => prev.map(license => license.id === id ? updatedLicense : license))
      return updatedLicense
    } catch (err) {
      setError('Erro ao atualizar licença ambiental')
      console.error('Error updating environmental license:', err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const deleteLicense = useCallback(async (id: string) => {
    setIsLoading(true)
    setError(null)
    try {
      await apiClient.delete(`/environment/licensing/${id}`)
      setLicenses(prev => prev.filter(license => license.id !== id))
    } catch (err) {
      setError('Erro ao excluir licença ambiental')
      console.error('Error deleting environmental license:', err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const assignAnalyst = useCallback(async (id: string, analystData: {
    analystId: string
    notes?: string
  }) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await apiClient.post(`/environment/licensing/${id}/assign`, analystData)
      const updatedLicense = response.data.data
      setLicenses(prev => prev.map(license => license.id === id ? updatedLicense : license))
      return updatedLicense
    } catch (err) {
      setError('Erro ao atribuir analista')
      console.error('Error assigning analyst:', err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const requestAdditionalInfo = useCallback(async (id: string, requestData: {
    documents: Array<{
      name: string
      type: string
      justification: string
    }>
    deadline: string
    observations?: string
  }) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await apiClient.post(`/environment/licensing/${id}/additional-info`, requestData)
      const updatedLicense = response.data.data
      setLicenses(prev => prev.map(license => license.id === id ? updatedLicense : license))
      return updatedLicense
    } catch (err) {
      setError('Erro ao solicitar informações adicionais')
      console.error('Error requesting additional info:', err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const scheduleInspection = useCallback(async (id: string, inspectionData: {
    type: 'PRELIMINARY' | 'TECHNICAL' | 'FOLLOW_UP' | 'COMPLIANCE' | 'COMPLAINT'
    date: string
    inspectors: string[]
    objective: string
    preparations: string[]
  }) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await apiClient.post(`/environment/licensing/${id}/inspections/schedule`, inspectionData)
      const updatedLicense = response.data.data
      setLicenses(prev => prev.map(license => license.id === id ? updatedLicense : license))
      return updatedLicense
    } catch (err) {
      setError('Erro ao agendar vistoria')
      console.error('Error scheduling inspection:', err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const recordInspection = useCallback(async (id: string, inspectionId: string, inspectionData: {
    findings: string[]
    nonCompliances: Array<{
      condition: string
      description: string
      severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
      deadline: string
    }>
    recommendations: string[]
    photos: File[]
    report: File
  }) => {
    setIsLoading(true)
    setError(null)
    try {
      const formData = new FormData()
      inspectionData.photos.forEach((photo, index) => {
        formData.append(`photos[${index}]`, photo)
      })
      formData.append('report', inspectionData.report)
      formData.append('findings', JSON.stringify(inspectionData.findings))
      formData.append('nonCompliances', JSON.stringify(inspectionData.nonCompliances))
      formData.append('recommendations', JSON.stringify(inspectionData.recommendations))

      const response = await apiClient.post(`/environment/licensing/${id}/inspections/${inspectionId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      const updatedLicense = response.data.data
      setLicenses(prev => prev.map(license => license.id === id ? updatedLicense : license))
      return updatedLicense
    } catch (err) {
      setError('Erro ao registrar vistoria')
      console.error('Error recording inspection:', err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const processDecision = useCallback(async (id: string, decisionData: {
    decision: 'APPROVED' | 'DENIED' | 'SUSPENDED'
    validityPeriod?: number
    conditions: Array<{
      type: 'GENERAL' | 'SPECIFIC' | 'MONITORING' | 'REPORTING' | 'EMERGENCY'
      description: string
      deadline?: string
      responsible: string
    }>
    justification: string
    observations?: string
  }) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await apiClient.post(`/environment/licensing/${id}/decision`, decisionData)
      const updatedLicense = response.data.data
      setLicenses(prev => prev.map(license => license.id === id ? updatedLicense : license))
      return updatedLicense
    } catch (err) {
      setError('Erro ao processar decisão')
      console.error('Error processing decision:', err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const uploadDocuments = useCallback(async (id: string, documents: Array<{
    file: File
    type: string
    name: string
    description?: string
  }>) => {
    setIsLoading(true)
    setError(null)
    try {
      const formData = new FormData()
      documents.forEach((doc, index) => {
        formData.append(`files[${index}]`, doc.file)
        formData.append(`metadata[${index}]`, JSON.stringify({
          type: doc.type,
          name: doc.name,
          description: doc.description
        }))
      })

      const response = await apiClient.post(`/environment/licensing/${id}/documents`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      const updatedLicense = response.data.data
      setLicenses(prev => prev.map(license => license.id === id ? updatedLicense : license))
      return updatedLicense
    } catch (err) {
      setError('Erro ao enviar documentos')
      console.error('Error uploading documents:', err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const updateCompliance = useCallback(async (id: string, complianceData: {
    conditionId: string
    status: 'COMPLIANT' | 'NON_COMPLIANT' | 'PARTIAL'
    verification: string
    evidence?: File[]
    observations?: string
  }) => {
    setIsLoading(true)
    setError(null)
    try {
      const formData = new FormData()
      formData.append('conditionId', complianceData.conditionId)
      formData.append('status', complianceData.status)
      formData.append('verification', complianceData.verification)
      if (complianceData.observations) {
        formData.append('observations', complianceData.observations)
      }
      if (complianceData.evidence) {
        complianceData.evidence.forEach((file, index) => {
          formData.append(`evidence[${index}]`, file)
        })
      }

      const response = await apiClient.post(`/environment/licensing/${id}/compliance`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      const updatedLicense = response.data.data
      setLicenses(prev => prev.map(license => license.id === id ? updatedLicense : license))
      return updatedLicense
    } catch (err) {
      setError('Erro ao atualizar conformidade')
      console.error('Error updating compliance:', err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const processRenewal = useCallback(async (id: string, renewalData: {
    requestDate: string
    validityPeriod: number
    changesFromOriginal: string[]
    justification?: string
  }) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await apiClient.post(`/environment/licensing/${id}/renewal`, renewalData)
      const renewalLicense = response.data.data
      setLicenses(prev => [renewalLicense, ...prev])
      return renewalLicense
    } catch (err) {
      setError('Erro ao processar renovação')
      console.error('Error processing renewal:', err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const generateReport = useCallback(async (id: string, reportType: 'TECHNICAL' | 'DECISION' | 'COMPLIANCE' | 'INSPECTION') => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await apiClient.post(`/environment/licensing/${id}/reports`, { type: reportType })
      return response.data.data
    } catch (err) {
      setError('Erro ao gerar relatório')
      console.error('Error generating report:', err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const getLicenseById = useCallback((id: string) => {
    return licenses.find(license => license.id === id)
  }, [licenses])

  const getLicensesByStatus = useCallback((status: string) => {
    return licenses.filter(license => license.status === status)
  }, [licenses])

  const getLicensesByType = useCallback((type: string) => {
    return licenses.filter(license => license.type === type)
  }, [licenses])

  const getLicensesByAnalyst = useCallback((analystId: string) => {
    return licenses.filter(license => license.process.analyst.id === analystId)
  }, [licenses])

  const getOverdueLicenses = useCallback(() => {
    const today = new Date().toISOString().split('T')[0]
    return licenses.filter(license =>
      license.timeline.analysisDeadline < today &&
      !['APPROVED', 'DENIED', 'CANCELLED'].includes(license.status)
    )
  }, [licenses])

  const getExpiringLicenses = useCallback((days: number = 30) => {
    const futureDate = new Date()
    futureDate.setDate(futureDate.getDate() + days)
    const futureDateStr = futureDate.toISOString().split('T')[0]

    return licenses.filter(license =>
      license.timeline.validityEnd &&
      license.timeline.validityEnd <= futureDateStr &&
      license.status === 'APPROVED'
    )
  }, [licenses])

  const getNonCompliantLicenses = useCallback(() => {
    return licenses.filter(license =>
      license.compliance.status === 'NON_COMPLIANT' ||
      license.compliance.violations.some(v => v.status === 'OPEN')
    )
  }, [licenses])

  const getLicensesBySector = useCallback((sector: string) => {
    return licenses.filter(license => license.activity.sector === sector)
  }, [licenses])

  const getHighRiskLicenses = useCallback(() => {
    return licenses.filter(license =>
      license.activity.environmentalRisk === 'HIGH' ||
      license.activity.potentialPollution === 'HIGH'
    )
  }, [licenses])

  const getPendingInspections = useCallback(() => {
    return licenses.filter(license =>
      license.inspections.some(inspection =>
        inspection.type === 'TECHNICAL' &&
        !inspection.findings.length
      )
    )
  }, [licenses])

  useEffect(() => {
    fetchLicenses()
  }, [fetchLicenses])

  return {
    licenses,
    isLoading,
    error,
    fetchLicenses,
    createLicense,
    updateLicense,
    deleteLicense,
    assignAnalyst,
    requestAdditionalInfo,
    scheduleInspection,
    recordInspection,
    processDecision,
    uploadDocuments,
    updateCompliance,
    processRenewal,
    generateReport,
    getLicenseById,
    getLicensesByStatus,
    getLicensesByType,
    getLicensesByAnalyst,
    getOverdueLicenses,
    getExpiringLicenses,
    getNonCompliantLicenses,
    getLicensesBySector,
    getHighRiskLicenses,
    getPendingInspections
  }
}