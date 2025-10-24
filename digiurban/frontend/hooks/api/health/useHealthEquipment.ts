import { useState, useEffect, useCallback } from 'react'
import { apiClient } from '@/lib/api'

export interface HealthEquipment {
  id: string
  name: string
  type: 'DIAGNOSTIC' | 'THERAPEUTIC' | 'LIFE_SUPPORT' | 'SURGICAL' | 'LABORATORY' | 'MONITORING'
  model: string
  manufacturer: string
  serial_number: string
  acquisition_date: string
  warranty_expiration: string
  cost: number
  location: {
    health_center_id: string
    health_center_name: string
    room: string
  }
  status: 'OPERATIONAL' | 'MAINTENANCE' | 'OUT_OF_ORDER' | 'RETIRED'
  maintenance: {
    last_maintenance: string
    next_maintenance: string
    maintenance_company: string
    maintenance_cost: number
  }
  usage_statistics: {
    hours_used_monthly: number
    procedures_performed: number
    downtime_hours: number
  }
  technical_specifications: {
    power_requirements: string
    dimensions: string
    weight: number
    special_requirements: Array<string>
  }
  created_at: string
  updated_at: string
}

export interface CreateHealthEquipmentData {
  name: string
  type: 'DIAGNOSTIC' | 'THERAPEUTIC' | 'LIFE_SUPPORT' | 'SURGICAL' | 'LABORATORY' | 'MONITORING'
  model: string
  manufacturer: string
  serial_number: string
  acquisition_date: string
  warranty_expiration: string
  cost: number
  location: {
    health_center_id: string
    room: string
  }
  technical_specifications: {
    power_requirements: string
    dimensions: string
    weight: number
    special_requirements: Array<string>
  }
}

export const useHealthEquipment = () => {
  const [equipment, setEquipment] = useState<HealthEquipment[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchEquipment = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.get('/health/equipment')
      setEquipment(response.data)
    } catch (err) {
      setError('Falha ao carregar equipamentos')
      console.error('Error fetching equipment:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  const createEquipment = useCallback(async (data: CreateHealthEquipmentData): Promise<HealthEquipment | null> => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.post('/health/equipment', data)
      const newEquipment = response.data
      setEquipment(prev => [...prev, newEquipment])
      return newEquipment
    } catch (err) {
      setError('Falha ao criar equipamento')
      console.error('Error creating equipment:', err)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const updateStatus = useCallback(async (equipmentId: string, status: 'OPERATIONAL' | 'MAINTENANCE' | 'OUT_OF_ORDER' | 'RETIRED'): Promise<boolean> => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.patch(`/health/equipment/${equipmentId}/status`, { status })
      const updatedEquipment = response.data
      setEquipment(prev => prev.map(eq => eq.id === equipmentId ? updatedEquipment : eq))
      return true
    } catch (err) {
      setError('Falha ao atualizar status')
      console.error('Error updating status:', err)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const scheduleMaintenance = useCallback(async (equipmentId: string, maintenanceDate: string): Promise<boolean> => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.post(`/health/equipment/${equipmentId}/maintenance`, { maintenance_date: maintenanceDate })
      const updatedEquipment = response.data
      setEquipment(prev => prev.map(eq => eq.id === equipmentId ? updatedEquipment : eq))
      return true
    } catch (err) {
      setError('Falha ao agendar manutenção')
      console.error('Error scheduling maintenance:', err)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const getOperationalEquipment = useCallback(() => {
    return equipment.filter(eq => eq.status === 'OPERATIONAL')
  }, [equipment])

  const getEquipmentNeedingMaintenance = useCallback(() => {
    const today = new Date()
    return equipment.filter(eq => new Date(eq.maintenance.next_maintenance) <= today)
  }, [equipment])

  useEffect(() => {
    fetchEquipment()
  }, [fetchEquipment])

  return {
    equipment,
    loading,
    error,
    fetchEquipment,
    createEquipment,
    updateStatus,
    scheduleMaintenance,
    getOperationalEquipment,
    getEquipmentNeedingMaintenance
  }
}