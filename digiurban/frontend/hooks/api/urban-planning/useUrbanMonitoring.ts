'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAdminAuth } from '@/contexts/AdminAuthContext'

interface UrbanMonitoring {
  id: string
  name: string
  type: 'REAL_TIME' | 'PERIODIC' | 'EVENT_DRIVEN' | 'CONTINUOUS' | 'SEASONAL'
  category: 'ENVIRONMENTAL' | 'TRAFFIC' | 'INFRASTRUCTURE' | 'SOCIAL' | 'ECONOMIC' | 'SAFETY' | 'COMPREHENSIVE'
  location: {
    name: string
    coordinates: { lat: number; lng: number }
    district: string
    coverage: {
      radius: number
      area: number
      population: number
    }
  }
  sensors: {
    id: string
    type: string
    model: string
    location: { lat: number; lng: number }
    status: 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE' | 'ERROR'
    installation: string
    lastMaintenance: string
    nextMaintenance: string
    specifications: {
      accuracy: number
      range: string
      resolution: string
      power: string
      connectivity: string
    }
    calibration: {
      lastCalibration: string
      nextCalibration: string
      method: string
      reference: string
    }
  }[]
  parameters: {
    parameter: string
    unit: string
    thresholds: {
      excellent: { min: number; max: number }
      good: { min: number; max: number }
      moderate: { min: number; max: number }
      poor: { min: number; max: number }
      dangerous: { min: number; max: number }
    }
    frequency: string
    priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  }[]
  dataCollection: {
    interval: string
    retention: string
    quality: {
      completeness: number
      accuracy: number
      consistency: number
      timeliness: number
    }
    sources: {
      type: 'SENSOR' | 'MANUAL' | 'SATELLITE' | 'THIRD_PARTY' | 'CALCULATED'
      source: string
      reliability: number
      coverage: number
    }[]
  }
  currentData: {
    timestamp: string
    readings: {
      parameter: string
      value: number
      unit: string
      quality: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR'
      source: string
    }[]
    summary: {
      overall: 'EXCELLENT' | 'GOOD' | 'MODERATE' | 'POOR' | 'DANGEROUS'
      trends: {
        parameter: string
        trend: 'IMPROVING' | 'STABLE' | 'DETERIORATING'
        rate: number
      }[]
    }
  }
  alerts: {
    id: string
    type: 'THRESHOLD' | 'TREND' | 'ANOMALY' | 'SYSTEM' | 'MAINTENANCE'
    severity: 'INFO' | 'WARNING' | 'CRITICAL' | 'EMERGENCY'
    parameter: string
    value: number
    threshold: number
    message: string
    timestamp: string
    status: 'ACTIVE' | 'ACKNOWLEDGED' | 'RESOLVED'
    assignedTo?: string
    resolution?: {
      action: string
      timestamp: string
      resolvedBy: string
    }
  }[]
  analytics: {
    patterns: {
      type: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'SEASONAL' | 'ANOMALY'
      parameter: string
      description: string
      confidence: number
      significance: 'HIGH' | 'MEDIUM' | 'LOW'
    }[]
    correlations: {
      parameters: string[]
      strength: number
      significance: number
      type: 'POSITIVE' | 'NEGATIVE' | 'COMPLEX'
    }[]
    predictions: {
      parameter: string
      horizon: string
      confidence: number
      methodology: string
      values: { timestamp: string; predicted: number; actual?: number }[]
    }[]
  }
  reports: {
    id: string
    type: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'ANNUAL' | 'INCIDENT'
    period: { start: string; end: string }
    status: 'GENERATED' | 'REVIEWED' | 'PUBLISHED'
    url: string
    recipients: string[]
    automation: boolean
  }[]
  compliance: {
    standards: {
      name: string
      authority: string
      requirements: string[]
      status: 'COMPLIANT' | 'NON_COMPLIANT' | 'PENDING'
      lastAssessment: string
    }[]
    violations: {
      standard: string
      parameter: string
      value: number
      limit: number
      duration: string
      timestamp: string
      status: 'OPEN' | 'RESOLVED'
    }[]
  }
  maintenance: {
    schedule: {
      component: string
      frequency: string
      lastMaintenance: string
      nextMaintenance: string
      type: 'PREVENTIVE' | 'CORRECTIVE' | 'CALIBRATION'
      responsible: string
    }[]
    history: {
      date: string
      component: string
      type: 'PREVENTIVE' | 'CORRECTIVE' | 'CALIBRATION' | 'REPLACEMENT'
      description: string
      technician: string
      duration: number
      cost: number
      status: 'COMPLETED' | 'PENDING' | 'FAILED'
    }[]
  }
  integration: {
    systems: {
      name: string
      type: 'DATA_SHARING' | 'CONTROL' | 'ALERTING' | 'REPORTING'
      status: 'CONNECTED' | 'DISCONNECTED' | 'ERROR'
      lastSync: string
    }[]
    api: {
      endpoint: string
      authentication: string
      rateLimit: number
      dataFormat: string
    }
    dashboard: {
      url: string
      realTime: boolean
      widgets: string[]
      users: number
    }
  }
  stakeholders: {
    type: 'OPERATOR' | 'MANAGER' | 'ANALYST' | 'CITIZEN' | 'AUTHORITY'
    entity: string
    contact: string
    notifications: string[]
    access: 'READ' | 'write' | 'admin'
  }[]
  budget: {
    setup: number
    operation: {
      annual: number
      maintenance: number
      personnel: number
      utilities: number
    }
    roi: {
      benefits: number
      savings: number
      avoidedCosts: number
      paybackPeriod: number
    }
  }
  performance: {
    availability: number
    reliability: number
    accuracy: number
    responseTime: number
    dataQuality: number
    userSatisfaction: number
  }
  future: {
    expansionPlans: {
      type: 'SENSORS' | 'PARAMETERS' | 'COVERAGE' | 'INTEGRATION'
      description: string
      timeline: string
      budget: number
      priority: 'LOW' | 'MEDIUM' | 'HIGH'
    }[]
    upgrades: {
      component: string
      reason: string
      timeline: string
      cost: number
      benefits: string[]
    }[]
  }
  status: 'PLANNING' | 'INSTALLATION' | 'TESTING' | 'OPERATIONAL' | 'MAINTENANCE' | 'UPGRADE' | 'DECOMMISSIONED'
  createdBy: string
  createdAt: string
  updatedAt: string
}

interface CreateUrbanMonitoringData {
  name: string
  type: 'REAL_TIME' | 'PERIODIC' | 'EVENT_DRIVEN' | 'CONTINUOUS' | 'SEASONAL'
  category: 'ENVIRONMENTAL' | 'TRAFFIC' | 'INFRASTRUCTURE' | 'SOCIAL' | 'ECONOMIC' | 'SAFETY' | 'COMPREHENSIVE'
  location: {
    name: string
    coordinates: { lat: number; lng: number }
    district: string
  }
  parameters: {
    parameter: string
    unit: string
    frequency: string
    priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  }[]
}

interface UseUrbanMonitoringReturn {
  monitoringSystems: UrbanMonitoring[]
  loading: boolean
  error: string | null
  createMonitoringSystem: (data: CreateUrbanMonitoringData) => Promise<UrbanMonitoring>
  updateMonitoringSystem: (id: string, data: Partial<CreateUrbanMonitoringData>) => Promise<UrbanMonitoring>
  addSensor: (id: string, sensor: any) => Promise<UrbanMonitoring>
  updateSensorStatus: (id: string, sensorId: string, status: string) => Promise<UrbanMonitoring>
  addParameter: (id: string, parameter: any) => Promise<UrbanMonitoring>
  updateParameterThresholds: (id: string, parameterId: string, thresholds: any) => Promise<UrbanMonitoring>
  updateCurrentData: (id: string, data: any) => Promise<UrbanMonitoring>
  createAlert: (id: string, alert: any) => Promise<UrbanMonitoring>
  acknowledgeAlert: (id: string, alertId: string) => Promise<UrbanMonitoring>
  resolveAlert: (id: string, alertId: string, resolution: any) => Promise<UrbanMonitoring>
  addAnalytics: (id: string, analytics: any) => Promise<UrbanMonitoring>
  generateReport: (id: string, reportType: string, period: any) => Promise<UrbanMonitoring>
  updateCompliance: (id: string, compliance: any) => Promise<UrbanMonitoring>
  scheduleMaintenance: (id: string, maintenance: any) => Promise<UrbanMonitoring>
  addMaintenanceRecord: (id: string, record: any) => Promise<UrbanMonitoring>
  updateIntegration: (id: string, integration: any) => Promise<UrbanMonitoring>
  addStakeholder: (id: string, stakeholder: any) => Promise<UrbanMonitoring>
  updatePerformance: (id: string, performance: any) => Promise<UrbanMonitoring>
  planExpansion: (id: string, plan: any) => Promise<UrbanMonitoring>
  scheduleUpgrade: (id: string, upgrade: any) => Promise<UrbanMonitoring>
  activateSystem: (id: string) => Promise<UrbanMonitoring>
  deactivateSystem: (id: string) => Promise<UrbanMonitoring>
  deleteMonitoringSystem: (id: string) => Promise<void>
  getSystemsByCategory: (category: string) => UrbanMonitoring[]
  getSystemsByDistrict: (district: string) => UrbanMonitoring[]
  getActiveAlerts: () => any[]
  getSystemsNeedingMaintenance: () => UrbanMonitoring[]
  refreshMonitoringSystems: () => Promise<void>
}

export function useUrbanMonitoring(): UseUrbanMonitoringReturn {
  const [monitoringSystems, setMonitoringSystems] = useState<UrbanMonitoring[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchMonitoringSystems = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await apiClient.get('/api/secretarias/urban-planning/monitoring')
      setMonitoringSystems(data.systems || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar sistemas de monitoramento')
    } finally {
      setLoading(false)
    }
  }, [])

  const createMonitoringSystem = useCallback(async (data: CreateUrbanMonitoringData): Promise<UrbanMonitoring> => {
    try {
      setError(null)
      const response = await apiClient.post('/api/secretarias/urban-planning/monitoring', data)
      const newSystem = response.system
      setMonitoringSystems(prev => [newSystem, ...prev])
      return newSystem
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar sistema de monitoramento'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const updateMonitoringSystem = useCallback(async (id: string, data: Partial<CreateUrbanMonitoringData>): Promise<UrbanMonitoring> => {
    try {
      setError(null)
      const response = await apiClient.put(`/api/secretarias/urban-planning/monitoring/${id}`, data)
      const updatedSystem = response.system
      setMonitoringSystems(prev => prev.map(system => system.id === id ? updatedSystem : system))
      return updatedSystem
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar sistema de monitoramento'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const addSensor = useCallback(async (id: string, sensor: any): Promise<UrbanMonitoring> => {
    try {
      setError(null)
      const response = await apiClient.post(`/api/secretarias/urban-planning/monitoring/${id}/sensors`, sensor)
      const updatedSystem = response.system
      setMonitoringSystems(prev => prev.map(system => system.id === id ? updatedSystem : system))
      return updatedSystem
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao adicionar sensor'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const updateSensorStatus = useCallback(async (id: string, sensorId: string, status: string): Promise<UrbanMonitoring> => {
    try {
      setError(null)
      const response = await apiClient.put(`/api/secretarias/urban-planning/monitoring/${id}/sensors/${sensorId}`, { status })
      const updatedSystem = response.system
      setMonitoringSystems(prev => prev.map(system => system.id === id ? updatedSystem : system))
      return updatedSystem
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar status do sensor'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const addParameter = useCallback(async (id: string, parameter: any): Promise<UrbanMonitoring> => {
    try {
      setError(null)
      const response = await apiClient.post(`/api/secretarias/urban-planning/monitoring/${id}/parameters`, parameter)
      const updatedSystem = response.system
      setMonitoringSystems(prev => prev.map(system => system.id === id ? updatedSystem : system))
      return updatedSystem
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao adicionar parâmetro'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const updateParameterThresholds = useCallback(async (id: string, parameterId: string, thresholds: any): Promise<UrbanMonitoring> => {
    try {
      setError(null)
      const response = await apiClient.put(`/api/secretarias/urban-planning/monitoring/${id}/parameters/${parameterId}/thresholds`, thresholds)
      const updatedSystem = response.system
      setMonitoringSystems(prev => prev.map(system => system.id === id ? updatedSystem : system))
      return updatedSystem
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar limites do parâmetro'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const updateCurrentData = useCallback(async (id: string, data: any): Promise<UrbanMonitoring> => {
    try {
      setError(null)
      const response = await apiClient.put(`/api/secretarias/urban-planning/monitoring/${id}/current-data`, data)
      const updatedSystem = response.system
      setMonitoringSystems(prev => prev.map(system => system.id === id ? updatedSystem : system))
      return updatedSystem
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar dados atuais'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const createAlert = useCallback(async (id: string, alert: any): Promise<UrbanMonitoring> => {
    try {
      setError(null)
      const response = await apiClient.post(`/api/secretarias/urban-planning/monitoring/${id}/alerts`, alert)
      const updatedSystem = response.system
      setMonitoringSystems(prev => prev.map(system => system.id === id ? updatedSystem : system))
      return updatedSystem
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar alerta'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const acknowledgeAlert = useCallback(async (id: string, alertId: string): Promise<UrbanMonitoring> => {
    try {
      setError(null)
      const response = await apiClient.put(`/api/secretarias/urban-planning/monitoring/${id}/alerts/${alertId}/acknowledge`, {})
      const updatedSystem = response.system
      setMonitoringSystems(prev => prev.map(system => system.id === id ? updatedSystem : system))
      return updatedSystem
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao reconhecer alerta'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const resolveAlert = useCallback(async (id: string, alertId: string, resolution: any): Promise<UrbanMonitoring> => {
    try {
      setError(null)
      const response = await apiClient.put(`/api/secretarias/urban-planning/monitoring/${id}/alerts/${alertId}/resolve`, resolution)
      const updatedSystem = response.system
      setMonitoringSystems(prev => prev.map(system => system.id === id ? updatedSystem : system))
      return updatedSystem
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao resolver alerta'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const addAnalytics = useCallback(async (id: string, analytics: any): Promise<UrbanMonitoring> => {
    try {
      setError(null)
      const response = await apiClient.post(`/api/secretarias/urban-planning/monitoring/${id}/analytics`, analytics)
      const updatedSystem = response.system
      setMonitoringSystems(prev => prev.map(system => system.id === id ? updatedSystem : system))
      return updatedSystem
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao adicionar análise'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const generateReport = useCallback(async (id: string, reportType: string, period: any): Promise<UrbanMonitoring> => {
    try {
      setError(null)
      const response = await apiClient.post(`/api/secretarias/urban-planning/monitoring/${id}/reports`, { type: reportType, period })
      const updatedSystem = response.system
      setMonitoringSystems(prev => prev.map(system => system.id === id ? updatedSystem : system))
      return updatedSystem
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao gerar relatório'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const updateCompliance = useCallback(async (id: string, compliance: any): Promise<UrbanMonitoring> => {
    try {
      setError(null)
      const response = await apiClient.put(`/api/secretarias/urban-planning/monitoring/${id}/compliance`, compliance)
      const updatedSystem = response.system
      setMonitoringSystems(prev => prev.map(system => system.id === id ? updatedSystem : system))
      return updatedSystem
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar conformidade'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const scheduleMaintenance = useCallback(async (id: string, maintenance: any): Promise<UrbanMonitoring> => {
    try {
      setError(null)
      const response = await apiClient.post(`/api/secretarias/urban-planning/monitoring/${id}/maintenance/schedule`, maintenance)
      const updatedSystem = response.system
      setMonitoringSystems(prev => prev.map(system => system.id === id ? updatedSystem : system))
      return updatedSystem
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao agendar manutenção'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const addMaintenanceRecord = useCallback(async (id: string, record: any): Promise<UrbanMonitoring> => {
    try {
      setError(null)
      const response = await apiClient.post(`/api/secretarias/urban-planning/monitoring/${id}/maintenance/history`, record)
      const updatedSystem = response.system
      setMonitoringSystems(prev => prev.map(system => system.id === id ? updatedSystem : system))
      return updatedSystem
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao adicionar registro de manutenção'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const updateIntegration = useCallback(async (id: string, integration: any): Promise<UrbanMonitoring> => {
    try {
      setError(null)
      const response = await apiClient.put(`/api/secretarias/urban-planning/monitoring/${id}/integration`, integration)
      const updatedSystem = response.system
      setMonitoringSystems(prev => prev.map(system => system.id === id ? updatedSystem : system))
      return updatedSystem
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar integração'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const addStakeholder = useCallback(async (id: string, stakeholder: any): Promise<UrbanMonitoring> => {
    try {
      setError(null)
      const response = await apiClient.post(`/api/secretarias/urban-planning/monitoring/${id}/stakeholders`, stakeholder)
      const updatedSystem = response.system
      setMonitoringSystems(prev => prev.map(system => system.id === id ? updatedSystem : system))
      return updatedSystem
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao adicionar stakeholder'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const updatePerformance = useCallback(async (id: string, performance: any): Promise<UrbanMonitoring> => {
    try {
      setError(null)
      const response = await apiClient.put(`/api/secretarias/urban-planning/monitoring/${id}/performance`, performance)
      const updatedSystem = response.system
      setMonitoringSystems(prev => prev.map(system => system.id === id ? updatedSystem : system))
      return updatedSystem
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar performance'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const planExpansion = useCallback(async (id: string, plan: any): Promise<UrbanMonitoring> => {
    try {
      setError(null)
      const response = await apiClient.post(`/api/secretarias/urban-planning/monitoring/${id}/future/expansion`, plan)
      const updatedSystem = response.system
      setMonitoringSystems(prev => prev.map(system => system.id === id ? updatedSystem : system))
      return updatedSystem
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao planejar expansão'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const scheduleUpgrade = useCallback(async (id: string, upgrade: any): Promise<UrbanMonitoring> => {
    try {
      setError(null)
      const response = await apiClient.post(`/api/secretarias/urban-planning/monitoring/${id}/future/upgrades`, upgrade)
      const updatedSystem = response.system
      setMonitoringSystems(prev => prev.map(system => system.id === id ? updatedSystem : system))
      return updatedSystem
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao agendar upgrade'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const activateSystem = useCallback(async (id: string): Promise<UrbanMonitoring> => {
    return updateMonitoringSystem(id, { status: 'OPERATIONAL' } as any)
  }, [updateMonitoringSystem])

  const deactivateSystem = useCallback(async (id: string): Promise<UrbanMonitoring> => {
    return updateMonitoringSystem(id, { status: 'MAINTENANCE' } as any)
  }, [updateMonitoringSystem])

  const deleteMonitoringSystem = useCallback(async (id: string): Promise<void> => {
    try {
      setError(null)
      await apiClient.delete(`/api/secretarias/urban-planning/monitoring/${id}`)
      setMonitoringSystems(prev => prev.filter(system => system.id !== id))
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao excluir sistema de monitoramento'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const getSystemsByCategory = useCallback((category: string) => monitoringSystems.filter(system => system.category === category), [monitoringSystems])
  const getSystemsByDistrict = useCallback((district: string) => monitoringSystems.filter(system => system.location.district === district), [monitoringSystems])
  const getActiveAlerts = useCallback(() => {
    return monitoringSystems.flatMap(system =>
      system.alerts.filter(alert => alert.status === 'ACTIVE')
    )
  }, [monitoringSystems])
  const getSystemsNeedingMaintenance = useCallback(() => {
    const today = new Date()
    return monitoringSystems.filter(system =>
      system.maintenance.schedule.some(schedule =>
        new Date(schedule.nextMaintenance) <= today
      )
    )
  }, [monitoringSystems])

  const refreshMonitoringSystems = useCallback(async () => {
    await fetchMonitoringSystems()
  }, [fetchMonitoringSystems])

  useEffect(() => {
    fetchMonitoringSystems()
  }, [fetchMonitoringSystems])

  return {
    monitoringSystems,
    loading,
    error,
    createMonitoringSystem,
    updateMonitoringSystem,
    addSensor,
    updateSensorStatus,
    addParameter,
    updateParameterThresholds,
    updateCurrentData,
    createAlert,
    acknowledgeAlert,
    resolveAlert,
    addAnalytics,
    generateReport,
    updateCompliance,
    scheduleMaintenance,
    addMaintenanceRecord,
    updateIntegration,
    addStakeholder,
    updatePerformance,
    planExpansion,
    scheduleUpgrade,
    activateSystem,
    deactivateSystem,
    deleteMonitoringSystem,
    getSystemsByCategory,
    getSystemsByDistrict,
    getActiveAlerts,
    getSystemsNeedingMaintenance,
    refreshMonitoringSystems
  }
}

export type { UrbanMonitoring, CreateUrbanMonitoringData, UseUrbanMonitoringReturn }