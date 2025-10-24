import { useState, useEffect, useCallback } from 'react'
import { apiClient } from '@/lib/api-client'

export interface EnvironmentalMonitoring {
  id: string
  name: string
  code: string
  type: 'AIR_QUALITY' | 'WATER_QUALITY' | 'SOIL_QUALITY' | 'NOISE' | 'BIODIVERSITY' | 'CLIMATE' | 'RADIATION' | 'WASTE'
  category: 'AMBIENT' | 'EMISSION' | 'EFFLUENT' | 'COMPLIANCE' | 'RESEARCH' | 'EARLY_WARNING'
  status: 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE' | 'CALIBRATION' | 'FAILED' | 'DECOMMISSIONED'
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  description: string
  objectives: string[]
  location: {
    name: string
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
      altitude: number
      datum: string
    }
    environment: 'URBAN' | 'RURAL' | 'INDUSTRIAL' | 'RESIDENTIAL' | 'COMMERCIAL' | 'PROTECTED_AREA' | 'WATER_BODY'
    accessibility: string
    surroundings: string[]
    infrastructure: {
      electricity: boolean
      internet: boolean
      security: boolean
      shelter: boolean
    }
  }
  station: {
    id: string
    model: string
    manufacturer: string
    installationDate: string
    lastMaintenance: string
    nextMaintenance: string
    warranty: {
      valid: boolean
      expiryDate?: string
      provider: string
    }
    specifications: {
      operatingTemperature: { min: number; max: number }
      humidity: { min: number; max: number }
      powerConsumption: number
      dataStorage: string
      communication: string[]
    }
  }
  parameters: Array<{
    id: string
    name: string
    unit: string
    method: string
    equipment: {
      sensor: string
      model: string
      manufacturer: string
      serialNumber: string
      calibrationDate: string
      nextCalibration: string
      accuracy: number
      range: { min: number; max: number }
    }
    standards: {
      legal: Array<{
        authority: string
        standard: string
        limit: number
        averagingTime: string
        exceedances: number
      }>
      who: { limit: number; averagingTime: string }
      reference: { good: number; moderate: number; unhealthy: number }
    }
    sampling: {
      frequency: 'CONTINUOUS' | 'HOURLY' | 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'ANNUAL'
      duration: string
      method: string
      quality: {
        completeness: number
        accuracy: number
        precision: number
        comparability: number
      }
    }
  }>
  measurements: Array<{
    id: string
    parameterId: string
    timestamp: string
    value: number
    unit: string
    quality: 'VALID' | 'INVALID' | 'SUSPECT' | 'MISSING' | 'ESTIMATED'
    flags: string[]
    meteorology?: {
      temperature: number
      humidity: number
      pressure: number
      windSpeed: number
      windDirection: number
      precipitation: number
    }
    validation: {
      automated: boolean
      manual: boolean
      validator?: string
      validationDate?: string
      notes?: string
    }
  }>
  alerts: Array<{
    id: string
    parameterId: string
    type: 'THRESHOLD_EXCEEDED' | 'EQUIPMENT_FAILURE' | 'COMMUNICATION_LOSS' | 'CALIBRATION_DUE' | 'MAINTENANCE_DUE'
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
    status: 'ACTIVE' | 'ACKNOWLEDGED' | 'RESOLVED' | 'FALSE_ALARM'
    triggeredAt: string
    resolvedAt?: string
    message: string
    actions: Array<{
      action: string
      responsible: string
      deadline: string
      status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED'
    }>
    notifications: Array<{
      method: 'EMAIL' | 'SMS' | 'PHONE' | 'SYSTEM'
      recipient: string
      sentAt: string
      status: 'SENT' | 'DELIVERED' | 'FAILED'
    }>
  }>
  dataManagement: {
    collection: {
      automatic: boolean
      interval: number
      protocol: string
      backup: boolean
      validation: 'REAL_TIME' | 'BATCH' | 'MANUAL'
    }
    transmission: {
      method: 'CELLULAR' | 'WIFI' | 'ETHERNET' | 'SATELLITE' | 'MANUAL'
      frequency: string
      encryption: boolean
      redundancy: boolean
    }
    storage: {
      local: { capacity: string; retention: string }
      cloud: { provider: string; location: string; backup: boolean }
      format: string[]
      compression: boolean
    }
    quality: {
      procedures: string[]
      validation: string[]
      flagging: string[]
      corrections: string[]
    }
  }
  maintenance: {
    schedule: Array<{
      type: 'PREVENTIVE' | 'CORRECTIVE' | 'CALIBRATION' | 'CLEANING' | 'REPLACEMENT'
      frequency: string
      lastPerformed: string
      nextDue: string
      responsible: string
      procedures: string[]
      estimated: {
        duration: number
        cost: number
        materials: string[]
      }
    }>
    history: Array<{
      id: string
      date: string
      type: string
      technician: string
      company?: string
      description: string
      partsReplaced: Array<{
        part: string
        serialNumber: string
        cost: number
      }>
      cost: number
      duration: number
      result: 'SUCCESSFUL' | 'PARTIAL' | 'FAILED'
      nextAction?: string
    }>
    contracts: Array<{
      provider: string
      type: 'MAINTENANCE' | 'CALIBRATION' | 'SUPPORT'
      startDate: string
      endDate: string
      cost: number
      scope: string[]
      sla: {
        responseTime: number
        resolutionTime: number
        availability: number
      }
    }>
  }
  reporting: {
    automated: Array<{
      type: 'HOURLY' | 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'ANNUAL'
      recipients: string[]
      format: 'PDF' | 'EXCEL' | 'CSV' | 'JSON' | 'EMAIL'
      template: string
      enabled: boolean
    }>
    regulatory: Array<{
      authority: string
      frequency: string
      deadline: string
      format: string
      lastSubmitted?: string
      nextDue: string
      responsible: string
    }>
    public: {
      website: boolean
      realTime: boolean
      historical: boolean
      downloadable: boolean
      api: boolean
    }
  }
  compliance: {
    regulations: Array<{
      authority: string
      regulation: string
      requirements: string[]
      compliance: 'COMPLIANT' | 'NON_COMPLIANT' | 'PARTIAL' | 'UNKNOWN'
      lastAssessment: string
      nextAssessment: string
    }>
    certifications: Array<{
      type: string
      certifyingBody: string
      issueDate: string
      expiryDate: string
      scope: string[]
      status: 'VALID' | 'EXPIRED' | 'SUSPENDED' | 'PENDING'
    }>
    audits: Array<{
      id: string
      type: 'INTERNAL' | 'EXTERNAL' | 'REGULATORY'
      auditor: string
      date: string
      scope: string[]
      findings: Array<{
        type: 'NONCONFORMITY' | 'OBSERVATION' | 'POSITIVE'
        description: string
        severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
        correctionDeadline?: string
        status: 'OPEN' | 'IN_PROGRESS' | 'CLOSED'
      }>
      recommendations: string[]
      followUp?: string
    }>
  }
  analytics: {
    statistics: {
      current: { [parameter: string]: number }
      averages: {
        hour: { [parameter: string]: number }
        day: { [parameter: string]: number }
        month: { [parameter: string]: number }
        year: { [parameter: string]: number }
      }
      trends: Array<{
        parameter: string
        period: string
        trend: 'INCREASING' | 'DECREASING' | 'STABLE' | 'VOLATILE'
        slope: number
        r2: number
      }>
      extremes: {
        maximums: Array<{
          parameter: string
          value: number
          timestamp: string
          location?: string
        }>
        minimums: Array<{
          parameter: string
          value: number
          timestamp: string
          location?: string
        }>
      }
    }
    correlations: Array<{
      parameters: string[]
      coefficient: number
      significance: number
      interpretation: string
    }>
    forecasting: Array<{
      parameter: string
      model: string
      horizon: string
      predictions: Array<{
        timestamp: string
        value: number
        confidence: number
      }>
      accuracy: number
    }>
  }
  integration: {
    meteorological: {
      connected: boolean
      source: string
      parameters: string[]
      quality: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR'
    }
    otherStations: Array<{
      stationId: string
      name: string
      distance: number
      parameters: string[]
      dataSharing: boolean
    }>
    modeling: Array<{
      model: string
      purpose: string
      inputs: string[]
      outputs: string[]
      frequency: string
    }>
    earlyWarning: {
      enabled: boolean
      thresholds: Array<{
        parameter: string
        warning: number
        alert: number
        emergency: number
      }>
      procedures: string[]
      contacts: string[]
    }
  }
  publicAccess: {
    website: {
      url?: string
      realTime: boolean
      historical: boolean
      charts: boolean
      downloads: boolean
      api: boolean
    }
    mobile: {
      app?: string
      notifications: boolean
      location: boolean
      offline: boolean
    }
    display: {
      public: boolean
      location?: string
      parameters: string[]
      format: 'DIGITAL' | 'LED' | 'LCD'
    }
    reports: {
      frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY'
      distribution: string[]
      format: string[]
      language: string[]
    }
  }
  costs: {
    initial: {
      equipment: number
      installation: number
      calibration: number
      training: number
      total: number
    }
    operational: {
      annual: number
      maintenance: number
      calibration: number
      communication: number
      utilities: number
      personnel: number
    }
    lifecycle: {
      years: number
      totalCost: number
      costPerYear: number
      costPerMeasurement: number
    }
  }
  team: {
    coordinator: {
      name: string
      email: string
      phone: string
      qualifications: string[]
    }
    technicians: Array<{
      name: string
      role: string
      specialization: string[]
      contact: string
      availability: string
    }>
    analysts: Array<{
      name: string
      specialization: string[]
      experience: number
      certifications: string[]
    }>
  }
  createdAt: string
  updatedAt: string
  createdBy: string
  lastModifiedBy: string
}

export interface CreateEnvironmentalMonitoringData {
  name: string
  code: string
  type: 'AIR_QUALITY' | 'WATER_QUALITY' | 'SOIL_QUALITY' | 'NOISE' | 'BIODIVERSITY' | 'CLIMATE' | 'RADIATION' | 'WASTE'
  category: 'AMBIENT' | 'EMISSION' | 'EFFLUENT' | 'COMPLIANCE' | 'RESEARCH' | 'EARLY_WARNING'
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  description: string
  objectives: string[]
  location: {
    name: string
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
      altitude: number
      datum: string
    }
    environment: 'URBAN' | 'RURAL' | 'INDUSTRIAL' | 'RESIDENTIAL' | 'COMMERCIAL' | 'PROTECTED_AREA' | 'WATER_BODY'
  }
  parameters: Array<{
    name: string
    unit: string
    method: string
    equipment: {
      sensor: string
      model: string
      manufacturer: string
      serialNumber: string
    }
    sampling: {
      frequency: 'CONTINUOUS' | 'HOURLY' | 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'ANNUAL'
      duration: string
      method: string
    }
  }>
  coordinatorId: string
}

export interface EnvironmentalMonitoringFilters {
  type?: string
  category?: string
  status?: string
  priority?: string
  environment?: string
  parameter?: string
  coordinatorId?: string
  location?: string
  alertStatus?: 'ACTIVE' | 'RESOLVED'
}

export function useEnvironmentalMonitoring() {
  const [monitoringStations, setMonitoringStations] = useState<EnvironmentalMonitoring[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchMonitoringStations = useCallback(async (filters?: EnvironmentalMonitoringFilters) => {
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
      const response = await apiClient.get(`/environment/monitoring?${params}`)
      setMonitoringStations(response.data.data || [])
    } catch (err) {
      setError('Erro ao carregar estações de monitoramento')
      console.error('Error fetching monitoring stations:', err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const createMonitoringStation = useCallback(async (data: CreateEnvironmentalMonitoringData) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await apiClient.post('/environment/monitoring', data)
      const newStation = response.data.data
      setMonitoringStations(prev => [newStation, ...prev])
      return newStation
    } catch (err) {
      setError('Erro ao criar estação de monitoramento')
      console.error('Error creating monitoring station:', err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const updateMonitoringStation = useCallback(async (id: string, data: Partial<CreateEnvironmentalMonitoringData>) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await apiClient.put(`/environment/monitoring/${id}`, data)
      const updatedStation = response.data.data
      setMonitoringStations(prev => prev.map(station => station.id === id ? updatedStation : station))
      return updatedStation
    } catch (err) {
      setError('Erro ao atualizar estação de monitoramento')
      console.error('Error updating monitoring station:', err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const deleteMonitoringStation = useCallback(async (id: string) => {
    setIsLoading(true)
    setError(null)
    try {
      await apiClient.delete(`/environment/monitoring/${id}`)
      setMonitoringStations(prev => prev.filter(station => station.id !== id))
    } catch (err) {
      setError('Erro ao excluir estação de monitoramento')
      console.error('Error deleting monitoring station:', err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const recordMeasurement = useCallback(async (id: string, measurementData: {
    parameterId: string
    value: number
    timestamp: string
    quality: 'VALID' | 'INVALID' | 'SUSPECT' | 'MISSING' | 'ESTIMATED'
    flags?: string[]
    meteorology?: {
      temperature: number
      humidity: number
      pressure: number
      windSpeed: number
      windDirection: number
      precipitation: number
    }
  }) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await apiClient.post(`/environment/monitoring/${id}/measurements`, measurementData)
      const updatedStation = response.data.data
      setMonitoringStations(prev => prev.map(station => station.id === id ? updatedStation : station))
      return updatedStation
    } catch (err) {
      setError('Erro ao registrar medição')
      console.error('Error recording measurement:', err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const validateMeasurement = useCallback(async (id: string, measurementId: string, validationData: {
    quality: 'VALID' | 'INVALID' | 'SUSPECT'
    validator: string
    notes?: string
  }) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await apiClient.post(`/environment/monitoring/${id}/measurements/${measurementId}/validate`, validationData)
      const updatedStation = response.data.data
      setMonitoringStations(prev => prev.map(station => station.id === id ? updatedStation : station))
      return updatedStation
    } catch (err) {
      setError('Erro ao validar medição')
      console.error('Error validating measurement:', err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const scheduleMaintenance = useCallback(async (id: string, maintenanceData: {
    type: 'PREVENTIVE' | 'CORRECTIVE' | 'CALIBRATION' | 'CLEANING' | 'REPLACEMENT'
    scheduledDate: string
    responsible: string
    procedures: string[]
    estimatedDuration: number
    estimatedCost: number
    materials: string[]
  }) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await apiClient.post(`/environment/monitoring/${id}/maintenance/schedule`, maintenanceData)
      const updatedStation = response.data.data
      setMonitoringStations(prev => prev.map(station => station.id === id ? updatedStation : station))
      return updatedStation
    } catch (err) {
      setError('Erro ao agendar manutenção')
      console.error('Error scheduling maintenance:', err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const recordMaintenance = useCallback(async (id: string, maintenanceData: {
    type: string
    date: string
    technician: string
    company?: string
    description: string
    partsReplaced: Array<{
      part: string
      serialNumber: string
      cost: number
    }>
    totalCost: number
    duration: number
    result: 'SUCCESSFUL' | 'PARTIAL' | 'FAILED'
    nextAction?: string
    photos?: File[]
    documents?: File[]
  }) => {
    setIsLoading(true)
    setError(null)
    try {
      const formData = new FormData()
      Object.entries(maintenanceData).forEach(([key, value]) => {
        if (key === 'photos' && Array.isArray(value)) {
          value.forEach((file, index) => {
            formData.append(`photos[${index}]`, file)
          })
        } else if (key === 'documents' && Array.isArray(value)) {
          value.forEach((file, index) => {
            formData.append(`documents[${index}]`, file)
          })
        } else if (Array.isArray(value)) {
          formData.append(key, JSON.stringify(value))
        } else if (value !== undefined) {
          formData.append(key, value.toString())
        }
      })

      const response = await apiClient.post(`/environment/monitoring/${id}/maintenance`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      const updatedStation = response.data.data
      setMonitoringStations(prev => prev.map(station => station.id === id ? updatedStation : station))
      return updatedStation
    } catch (err) {
      setError('Erro ao registrar manutenção')
      console.error('Error recording maintenance:', err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const manageAlert = useCallback(async (id: string, alertId: string, action: {
    type: 'ACKNOWLEDGE' | 'RESOLVE' | 'FALSE_ALARM'
    notes?: string
    responsibleActions?: Array<{
      action: string
      responsible: string
      deadline: string
    }>
  }) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await apiClient.post(`/environment/monitoring/${id}/alerts/${alertId}`, action)
      const updatedStation = response.data.data
      setMonitoringStations(prev => prev.map(station => station.id === id ? updatedStation : station))
      return updatedStation
    } catch (err) {
      setError('Erro ao gerenciar alerta')
      console.error('Error managing alert:', err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const configureThresholds = useCallback(async (id: string, thresholds: Array<{
    parameterId: string
    warning: number
    alert: number
    emergency: number
    enabled: boolean
  }>) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await apiClient.post(`/environment/monitoring/${id}/thresholds`, { thresholds })
      const updatedStation = response.data.data
      setMonitoringStations(prev => prev.map(station => station.id === id ? updatedStation : station))
      return updatedStation
    } catch (err) {
      setError('Erro ao configurar limites')
      console.error('Error configuring thresholds:', err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const generateReport = useCallback(async (id: string, reportConfig: {
    type: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'ANNUAL' | 'CUSTOM'
    period: {
      start: string
      end: string
    }
    parameters: string[]
    format: 'PDF' | 'EXCEL' | 'CSV'
    includeGraphs: boolean
    includeStatistics: boolean
    includeCompliance: boolean
  }) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await apiClient.post(`/environment/monitoring/${id}/reports`, reportConfig)
      return response.data.data
    } catch (err) {
      setError('Erro ao gerar relatório')
      console.error('Error generating report:', err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const exportData = useCallback(async (id: string, exportConfig: {
    parameters: string[]
    period: {
      start: string
      end: string
    }
    format: 'CSV' | 'JSON' | 'XML'
    quality: 'ALL' | 'VALID_ONLY' | 'RAW'
    aggregation?: 'NONE' | 'HOURLY' | 'DAILY' | 'MONTHLY'
  }) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await apiClient.post(`/environment/monitoring/${id}/export`, exportConfig, {
        responseType: 'blob'
      })

      const blob = new Blob([response.data])
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `monitoring-data-${id}-${new Date().toISOString().split('T')[0]}.${exportConfig.format.toLowerCase()}`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (err) {
      setError('Erro ao exportar dados')
      console.error('Error exporting data:', err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const getStationById = useCallback((id: string) => {
    return monitoringStations.find(station => station.id === id)
  }, [monitoringStations])

  const getStationsByType = useCallback((type: string) => {
    return monitoringStations.filter(station => station.type === type)
  }, [monitoringStations])

  const getStationsByStatus = useCallback((status: string) => {
    return monitoringStations.filter(station => station.status === status)
  }, [monitoringStations])

  const getActiveStations = useCallback(() => {
    return monitoringStations.filter(station => station.status === 'ACTIVE')
  }, [monitoringStations])

  const getStationsWithActiveAlerts = useCallback(() => {
    return monitoringStations.filter(station =>
      station.alerts.some(alert => alert.status === 'ACTIVE')
    )
  }, [monitoringStations])

  const getStationsNeedingMaintenance = useCallback(() => {
    const today = new Date().toISOString().split('T')[0]
    return monitoringStations.filter(station =>
      station.maintenance.schedule.some(maintenance =>
        maintenance.nextDue <= today
      )
    )
  }, [monitoringStations])

  const getStationsByEnvironment = useCallback((environment: string) => {
    return monitoringStations.filter(station => station.location.environment === environment)
  }, [monitoringStations])

  const getStationsNeedingCalibration = useCallback(() => {
    const today = new Date().toISOString().split('T')[0]
    return monitoringStations.filter(station =>
      station.parameters.some(param =>
        param.equipment.nextCalibration <= today
      )
    )
  }, [monitoringStations])

  const getCriticalAlerts = useCallback(() => {
    return monitoringStations.flatMap(station =>
      station.alerts
        .filter(alert => alert.severity === 'CRITICAL' && alert.status === 'ACTIVE')
        .map(alert => ({
          ...alert,
          stationId: station.id,
          stationName: station.name
        }))
    )
  }, [monitoringStations])

  const getDataCompleteness = useCallback((period: { start: string; end: string }) => {
    return monitoringStations.map(station => ({
      stationId: station.id,
      stationName: station.name,
      parameters: station.parameters.map(param => ({
        parameterId: param.id,
        parameterName: param.name,
        completeness: param.sampling.quality.completeness
      }))
    }))
  }, [monitoringStations])

  useEffect(() => {
    fetchMonitoringStations()
  }, [fetchMonitoringStations])

  return {
    monitoringStations,
    isLoading,
    error,
    fetchMonitoringStations,
    createMonitoringStation,
    updateMonitoringStation,
    deleteMonitoringStation,
    recordMeasurement,
    validateMeasurement,
    scheduleMaintenance,
    recordMaintenance,
    manageAlert,
    configureThresholds,
    generateReport,
    exportData,
    getStationById,
    getStationsByType,
    getStationsByStatus,
    getActiveStations,
    getStationsWithActiveAlerts,
    getStationsNeedingMaintenance,
    getStationsByEnvironment,
    getStationsNeedingCalibration,
    getCriticalAlerts,
    getDataCompleteness
  }
}