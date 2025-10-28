'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAdminAuth } from '@/contexts/AdminAuthContext'

interface SurveillanceCamera {
  id: string
  name: string
  location: string
  coordinates: { lat: number; lng: number }
  status: 'ONLINE' | 'OFFLINE' | 'MAINTENANCE'
  type: 'FIXED' | 'PTZ' | 'DOME' | 'MOBILE'
  resolution: string
  nightVision: boolean
  recordingEnabled: boolean
  alertsEnabled: boolean
  lastMaintenance?: string
  nextMaintenance?: string
}

interface UseIntegratedSurveillanceReturn {
  cameras: SurveillanceCamera[]
  loading: boolean
  error: string | null
  getOnlineCameras: () => SurveillanceCamera[]
  getCamerasByLocation: (location: string) => SurveillanceCamera[]
  updateCameraStatus: (id: string, status: 'ONLINE' | 'OFFLINE' | 'MAINTENANCE') => Promise<void>
  refreshCameras: () => Promise<void>
}

export function useIntegratedSurveillance(): UseIntegratedSurveillanceReturn {
  const [cameras, setCameras] = useState<SurveillanceCamera[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCameras = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await apiClient.get('/api/secretarias/security/surveillance')
      setCameras(data.cameras || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar câmeras')
    } finally {
      setLoading(false)
    }
  }, [])

  const getOnlineCameras = useCallback(() => cameras.filter(camera => camera.status === 'ONLINE'), [cameras])
  const getCamerasByLocation = useCallback((location: string) => cameras.filter(camera => camera.location.includes(location)), [cameras])

  const updateCameraStatus = useCallback(async (id: string, status: 'ONLINE' | 'OFFLINE' | 'MAINTENANCE') => {
    try {
      setError(null)
      await apiClient.put(`/api/secretarias/security/surveillance/${id}`, { status })
      setCameras(prev => prev.map(camera => camera.id === id ? { ...camera, status } : camera))
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar status da câmera'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const refreshCameras = useCallback(async () => {
    await fetchCameras()
  }, [fetchCameras])

  useEffect(() => {
    fetchCameras()
  }, [fetchCameras])

  return {
    cameras,
    loading,
    error,
    getOnlineCameras,
    getCamerasByLocation,
    updateCameraStatus,
    refreshCameras
  }
}