'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAdminAuth } from '@/contexts/AdminAuthContext'

interface SecurityAlert {
  id: string
  type: 'EMERGENCY' | 'CRIME_ALERT' | 'MISSING_PERSON' | 'WEATHER' | 'TRAFFIC' | 'EVENT_SECURITY' | 'SYSTEM'
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  title: string
  message: string
  location?: string
  coordinates?: { lat: number; lng: number }
  radius?: number
  startTime: string
  endTime?: string
  status: 'ACTIVE' | 'RESOLVED' | 'EXPIRED' | 'CANCELLED'
  targetAudience: 'PUBLIC' | 'OFFICERS' | 'EMERGENCY_SERVICES' | 'SPECIFIC_UNITS'
  createdBy: string
  acknowledgedBy: string[]
  createdAt: string
  updatedAt: string
}

interface CreateSecurityAlertData {
  type: 'EMERGENCY' | 'CRIME_ALERT' | 'MISSING_PERSON' | 'WEATHER' | 'TRAFFIC' | 'EVENT_SECURITY' | 'SYSTEM'
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  title: string
  message: string
  location?: string
  coordinates?: { lat: number; lng: number }
  radius?: number
  startTime: string
  endTime?: string
  targetAudience: 'PUBLIC' | 'OFFICERS' | 'EMERGENCY_SERVICES' | 'SPECIFIC_UNITS'
}

interface UseSecurityAlertsReturn {
  alerts: SecurityAlert[]
  loading: boolean
  error: string | null
  createAlert: (data: CreateSecurityAlertData) => Promise<SecurityAlert>
  updateAlert: (id: string, data: Partial<CreateSecurityAlertData>) => Promise<SecurityAlert>
  cancelAlert: (id: string) => Promise<SecurityAlert>
  acknowledgeAlert: (id: string) => Promise<SecurityAlert>
  deleteAlert: (id: string) => Promise<void>
  getActiveAlerts: () => SecurityAlert[]
  getCriticalAlerts: () => SecurityAlert[]
  refreshAlerts: () => Promise<void>
}

export function useSecurityAlerts(): UseSecurityAlertsReturn {
  const [alerts, setAlerts] = useState<SecurityAlert[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchAlerts = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await apiClient.get('/api/secretarias/security/alerts')
      setAlerts(data.alerts || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar alertas')
    } finally {
      setLoading(false)
    }
  }, [])

  const createAlert = useCallback(async (data: CreateSecurityAlertData): Promise<SecurityAlert> => {
    try {
      setError(null)
      const response = await apiClient.post('/api/secretarias/security/alerts', data)
      const newAlert = response.alert
      setAlerts(prev => [newAlert, ...prev])
      return newAlert
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar alerta'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const updateAlert = useCallback(async (id: string, data: Partial<CreateSecurityAlertData>): Promise<SecurityAlert> => {
    try {
      setError(null)
      const response = await apiClient.put(`/api/secretarias/security/alerts/${id}`, data)
      const updatedAlert = response.alert
      setAlerts(prev => prev.map(alert => alert.id === id ? updatedAlert : alert))
      return updatedAlert
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar alerta'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const cancelAlert = useCallback(async (id: string): Promise<SecurityAlert> => {
    return updateAlert(id, { status: 'CANCELLED' } as any)
  }, [updateAlert])

  const acknowledgeAlert = useCallback(async (id: string): Promise<SecurityAlert> => {
    try {
      setError(null)
      const response = await apiClient.post(`/api/secretarias/security/alerts/${id}/acknowledge`)
      const updatedAlert = response.alert
      setAlerts(prev => prev.map(alert => alert.id === id ? updatedAlert : alert))
      return updatedAlert
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao confirmar alerta'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const deleteAlert = useCallback(async (id: string): Promise<void> => {
    try {
      setError(null)
      await apiClient.delete(`/api/secretarias/security/alerts/${id}`)
      setAlerts(prev => prev.filter(alert => alert.id !== id))
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao excluir alerta'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const getActiveAlerts = useCallback(() => alerts.filter(alert => alert.status === 'ACTIVE'), [alerts])
  const getCriticalAlerts = useCallback(() => alerts.filter(alert => alert.priority === 'CRITICAL'), [alerts])

  const refreshAlerts = useCallback(async () => {
    await fetchAlerts()
  }, [fetchAlerts])

  useEffect(() => {
    fetchAlerts()
  }, [fetchAlerts])

  return {
    alerts,
    loading,
    error,
    createAlert,
    updateAlert,
    cancelAlert,
    acknowledgeAlert,
    deleteAlert,
    getActiveAlerts,
    getCriticalAlerts,
    refreshAlerts
  }
}