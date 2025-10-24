import { useState, useEffect, useCallback } from 'react'
import { apiClient } from '@/lib/api-client'

export interface PublicWorksEquipment {
  id: string
  name: string
  code: string
  type: 'EXCAVATOR' | 'BULLDOZER' | 'CRANE' | 'TRUCK' | 'COMPACTOR' | 'MIXER' | 'GENERATOR' | 'PUMP' | 'DRILL' | 'OTHER'
  category: 'HEAVY_MACHINERY' | 'LIGHT_EQUIPMENT' | 'VEHICLES' | 'TOOLS' | 'SAFETY_EQUIPMENT' | 'MEASURING_INSTRUMENTS'
  status: 'AVAILABLE' | 'IN_USE' | 'MAINTENANCE' | 'REPAIR' | 'OUT_OF_SERVICE' | 'RESERVED' | 'RETIRED'
  condition: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR' | 'CRITICAL'
  specifications: {
    brand: string
    model: string
    year: number
    serialNumber: string
    capacity: string
    power?: string
    weight?: number
    dimensions?: {
      length: number
      width: number
      height: number
    }
    fuelType?: 'DIESEL' | 'GASOLINE' | 'ELECTRIC' | 'HYBRID' | 'HYDRAULIC'
    operatingHours?: number
    maxOperatingHours?: number
  }
  acquisition: {
    date: string
    method: 'PURCHASE' | 'LEASE' | 'RENTAL' | 'DONATION' | 'TRANSFER'
    supplier: {
      name: string
      cnpj?: string
      contact: string
    }
    cost: number
    currency: string
    invoiceNumber?: string
    warrantyPeriod?: number
    warrantyExpiry?: string
  }
  location: {
    current: {
      site?: string
      projectId?: string
      address: string
      responsible: string
      coordinates?: {
        lat: number
        lng: number
      }
    }
    base: {
      name: string
      address: string
      responsible: string
    }
  }
  assignment: {
    projectId?: string
    projectName?: string
    assignedTo: {
      id: string
      name: string
      role: string
      contact: string
    }
    assignmentDate?: string
    expectedReturn?: string
    purpose?: string
  }
  maintenance: {
    schedule: {
      lastService: string
      nextService: string
      serviceInterval: number
      serviceType: 'HOURS' | 'DAYS' | 'MONTHS'
    }
    history: Array<{
      id: string
      date: string
      type: 'PREVENTIVE' | 'CORRECTIVE' | 'EMERGENCY' | 'INSPECTION'
      description: string
      technician: string
      cost: number
      parts: Array<{
        name: string
        quantity: number
        unitCost: number
      }>
      hoursWorked: number
      nextServiceDue?: string
      status: 'COMPLETED' | 'IN_PROGRESS' | 'SCHEDULED'
    }>
    alerts: Array<{
      id: string
      type: 'SERVICE_DUE' | 'INSPECTION_DUE' | 'WARRANTY_EXPIRING' | 'HOURS_LIMIT' | 'SAFETY_ISSUE'
      message: string
      priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
      date: string
      acknowledged: boolean
    }>
  }
  operations: {
    totalHours: number
    currentMonthHours: number
    efficiency: number
    utilizationRate: number
    fuelConsumption?: {
      total: number
      average: number
      unit: string
    }
    productivity?: {
      metric: string
      value: number
      unit: string
    }
  }
  safety: {
    lastInspection: string
    nextInspection: string
    certifications: Array<{
      type: string
      number: string
      issuer: string
      issueDate: string
      expiryDate: string
      status: 'VALID' | 'EXPIRED' | 'SUSPENDED'
    }>
    incidents: Array<{
      id: string
      date: string
      type: 'ACCIDENT' | 'NEAR_MISS' | 'DAMAGE' | 'BREAKDOWN'
      description: string
      severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
      causedBy?: string
      correctionTaken: string
      reportedBy: string
    }>
    safetyEquipment: Array<{
      item: string
      lastCheck: string
      nextCheck: string
      status: 'OK' | 'NEEDS_REPLACEMENT' | 'MISSING'
    }>
  }
  documentation: {
    manuals: Array<{
      type: 'OPERATION' | 'MAINTENANCE' | 'SAFETY' | 'PARTS'
      url: string
      version: string
      lastUpdated: string
    }>
    certificates: Array<{
      type: string
      url: string
      issueDate: string
      expiryDate?: string
    }>
    photos: Array<{
      id: string
      description: string
      url: string
      takenDate: string
      category: 'GENERAL' | 'DAMAGE' | 'MAINTENANCE' | 'SAFETY'
    }>
  }
  insurance: {
    provider: string
    policyNumber: string
    startDate: string
    endDate: string
    coverage: {
      value: number
      deductible: number
      type: string[]
    }
    premiumCost: number
    claims: Array<{
      id: string
      date: string
      type: string
      amount: number
      status: 'PENDING' | 'APPROVED' | 'DENIED' | 'PAID'
      description: string
    }>
  }
  depreciation: {
    method: 'STRAIGHT_LINE' | 'DECLINING_BALANCE' | 'UNITS_OF_PRODUCTION'
    usefulLife: number
    currentValue: number
    accumulatedDepreciation: number
    monthlyDepreciation: number
  }
  costs: {
    acquisition: number
    maintenance: number
    operation: number
    insurance: number
    depreciation: number
    total: number
    costPerHour: number
  }
  createdAt: string
  updatedAt: string
  createdBy: string
  lastModifiedBy: string
}

export interface CreatePublicWorksEquipmentData {
  name: string
  code: string
  type: 'EXCAVATOR' | 'BULLDOZER' | 'CRANE' | 'TRUCK' | 'COMPACTOR' | 'MIXER' | 'GENERATOR' | 'PUMP' | 'DRILL' | 'OTHER'
  category: 'HEAVY_MACHINERY' | 'LIGHT_EQUIPMENT' | 'VEHICLES' | 'TOOLS' | 'SAFETY_EQUIPMENT' | 'MEASURING_INSTRUMENTS'
  specifications: {
    brand: string
    model: string
    year: number
    serialNumber: string
    capacity: string
    power?: string
    weight?: number
    dimensions?: {
      length: number
      width: number
      height: number
    }
    fuelType?: 'DIESEL' | 'GASOLINE' | 'ELECTRIC' | 'HYBRID' | 'HYDRAULIC'
    maxOperatingHours?: number
  }
  acquisition: {
    date: string
    method: 'PURCHASE' | 'LEASE' | 'RENTAL' | 'DONATION' | 'TRANSFER'
    supplier: {
      name: string
      cnpj?: string
      contact: string
    }
    cost: number
    invoiceNumber?: string
    warrantyPeriod?: number
  }
  location: {
    base: {
      name: string
      address: string
      responsible: string
    }
  }
  maintenance: {
    serviceInterval: number
    serviceType: 'HOURS' | 'DAYS' | 'MONTHS'
  }
}

export interface PublicWorksEquipmentFilters {
  type?: string
  category?: string
  status?: string
  condition?: string
  projectId?: string
  assignedTo?: string
  location?: string
  brand?: string
  maintenanceDue?: boolean
  inspectionDue?: boolean
}

export function usePublicWorksEquipment() {
  const [equipment, setEquipment] = useState<PublicWorksEquipment[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchEquipment = useCallback(async (filters?: PublicWorksEquipmentFilters) => {
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
      const response = await apiClient.get(`/public-works/equipment?${params}`)
      setEquipment(response.data.data || [])
    } catch (err) {
      setError('Erro ao carregar equipamentos de obras públicas')
      console.error('Error fetching public works equipment:', err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const createEquipment = useCallback(async (data: CreatePublicWorksEquipmentData) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await apiClient.post('/public-works/equipment', data)
      const newEquipment = response.data.data
      setEquipment(prev => [newEquipment, ...prev])
      return newEquipment
    } catch (err) {
      setError('Erro ao criar equipamento de obra pública')
      console.error('Error creating public works equipment:', err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const updateEquipment = useCallback(async (id: string, data: Partial<CreatePublicWorksEquipmentData>) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await apiClient.put(`/public-works/equipment/${id}`, data)
      const updatedEquipment = response.data.data
      setEquipment(prev => prev.map(eq => eq.id === id ? updatedEquipment : eq))
      return updatedEquipment
    } catch (err) {
      setError('Erro ao atualizar equipamento de obra pública')
      console.error('Error updating public works equipment:', err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const deleteEquipment = useCallback(async (id: string) => {
    setIsLoading(true)
    setError(null)
    try {
      await apiClient.delete(`/public-works/equipment/${id}`)
      setEquipment(prev => prev.filter(eq => eq.id !== id))
    } catch (err) {
      setError('Erro ao excluir equipamento de obra pública')
      console.error('Error deleting public works equipment:', err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const assignEquipment = useCallback(async (id: string, assignmentData: {
    projectId: string
    assignedToId: string
    assignmentDate: string
    expectedReturn: string
    purpose: string
  }) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await apiClient.post(`/public-works/equipment/${id}/assign`, assignmentData)
      const updatedEquipment = response.data.data
      setEquipment(prev => prev.map(eq => eq.id === id ? updatedEquipment : eq))
      return updatedEquipment
    } catch (err) {
      setError('Erro ao alocar equipamento')
      console.error('Error assigning equipment:', err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const returnEquipment = useCallback(async (id: string, returnData: {
    returnDate: string
    condition: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR' | 'CRITICAL'
    operatingHours: number
    observations?: string
    damageReport?: string
    photos?: File[]
  }) => {
    setIsLoading(true)
    setError(null)
    try {
      const formData = new FormData()
      Object.entries(returnData).forEach(([key, value]) => {
        if (key === 'photos' && Array.isArray(value)) {
          value.forEach((file, index) => {
            formData.append(`photos[${index}]`, file)
          })
        } else if (value !== undefined) {
          formData.append(key, value.toString())
        }
      })

      const response = await apiClient.post(`/public-works/equipment/${id}/return`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      const updatedEquipment = response.data.data
      setEquipment(prev => prev.map(eq => eq.id === id ? updatedEquipment : eq))
      return updatedEquipment
    } catch (err) {
      setError('Erro ao devolver equipamento')
      console.error('Error returning equipment:', err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const scheduleMaintenance = useCallback(async (id: string, maintenanceData: {
    type: 'PREVENTIVE' | 'CORRECTIVE' | 'EMERGENCY' | 'INSPECTION'
    scheduledDate: string
    description: string
    technician: string
    estimatedCost: number
    estimatedHours: number
    parts?: Array<{
      name: string
      quantity: number
      estimatedCost: number
    }>
  }) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await apiClient.post(`/public-works/equipment/${id}/maintenance/schedule`, maintenanceData)
      const updatedEquipment = response.data.data
      setEquipment(prev => prev.map(eq => eq.id === id ? updatedEquipment : eq))
      return updatedEquipment
    } catch (err) {
      setError('Erro ao agendar manutenção')
      console.error('Error scheduling maintenance:', err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const recordMaintenance = useCallback(async (id: string, maintenanceData: {
    type: 'PREVENTIVE' | 'CORRECTIVE' | 'EMERGENCY' | 'INSPECTION'
    date: string
    description: string
    technician: string
    cost: number
    hoursWorked: number
    parts: Array<{
      name: string
      quantity: number
      unitCost: number
    }>
    nextServiceDue?: string
    workPerformed: string[]
    photos?: File[]
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
        } else if (Array.isArray(value)) {
          formData.append(key, JSON.stringify(value))
        } else if (value !== undefined) {
          formData.append(key, value.toString())
        }
      })

      const response = await apiClient.post(`/public-works/equipment/${id}/maintenance`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      const updatedEquipment = response.data.data
      setEquipment(prev => prev.map(eq => eq.id === id ? updatedEquipment : eq))
      return updatedEquipment
    } catch (err) {
      setError('Erro ao registrar manutenção')
      console.error('Error recording maintenance:', err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const recordUsage = useCallback(async (id: string, usageData: {
    date: string
    startHours: number
    endHours: number
    operator: string
    location: string
    workPerformed: string
    fuelConsumed?: number
    issues?: string
  }) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await apiClient.post(`/public-works/equipment/${id}/usage`, usageData)
      const updatedEquipment = response.data.data
      setEquipment(prev => prev.map(eq => eq.id === id ? updatedEquipment : eq))
      return updatedEquipment
    } catch (err) {
      setError('Erro ao registrar uso do equipamento')
      console.error('Error recording equipment usage:', err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const reportIncident = useCallback(async (id: string, incidentData: {
    type: 'ACCIDENT' | 'NEAR_MISS' | 'DAMAGE' | 'BREAKDOWN'
    description: string
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
    causedBy?: string
    correctionTaken: string
    reportedBy: string
    photos?: File[]
  }) => {
    setIsLoading(true)
    setError(null)
    try {
      const formData = new FormData()
      Object.entries(incidentData).forEach(([key, value]) => {
        if (key === 'photos' && Array.isArray(value)) {
          value.forEach((file, index) => {
            formData.append(`photos[${index}]`, file)
          })
        } else if (value !== undefined) {
          formData.append(key, value.toString())
        }
      })

      const response = await apiClient.post(`/public-works/equipment/${id}/incidents`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      const updatedEquipment = response.data.data
      setEquipment(prev => prev.map(eq => eq.id === id ? updatedEquipment : eq))
      return updatedEquipment
    } catch (err) {
      setError('Erro ao reportar incidente')
      console.error('Error reporting incident:', err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const updateLocation = useCallback(async (id: string, locationData: {
    projectId?: string
    address: string
    responsible: string
    coordinates?: {
      lat: number
      lng: number
    }
  }) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await apiClient.put(`/public-works/equipment/${id}/location`, locationData)
      const updatedEquipment = response.data.data
      setEquipment(prev => prev.map(eq => eq.id === id ? updatedEquipment : eq))
      return updatedEquipment
    } catch (err) {
      setError('Erro ao atualizar localização do equipamento')
      console.error('Error updating equipment location:', err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const getEquipmentById = useCallback((id: string) => {
    return equipment.find(eq => eq.id === id)
  }, [equipment])

  const getEquipmentByStatus = useCallback((status: string) => {
    return equipment.filter(eq => eq.status === status)
  }, [equipment])

  const getEquipmentByType = useCallback((type: string) => {
    return equipment.filter(eq => eq.type === type)
  }, [equipment])

  const getAvailableEquipment = useCallback(() => {
    return equipment.filter(eq => eq.status === 'AVAILABLE')
  }, [equipment])

  const getEquipmentInUse = useCallback(() => {
    return equipment.filter(eq => eq.status === 'IN_USE')
  }, [equipment])

  const getMaintenanceDueEquipment = useCallback(() => {
    const today = new Date().toISOString().split('T')[0]
    return equipment.filter(eq =>
      eq.maintenance.schedule.nextService <= today &&
      ['AVAILABLE', 'IN_USE'].includes(eq.status)
    )
  }, [equipment])

  const getHighMaintenanceCostEquipment = useCallback(() => {
    return equipment
      .filter(eq => eq.costs.maintenance > 0)
      .sort((a, b) => b.costs.maintenance - a.costs.maintenance)
      .slice(0, 10)
  }, [equipment])

  const getTotalEquipmentValue = useCallback(() => {
    return equipment.reduce((total, eq) => total + eq.depreciation.currentValue, 0)
  }, [equipment])

  const getUtilizationRate = useCallback(() => {
    const inUseCount = equipment.filter(eq => eq.status === 'IN_USE').length
    const availableCount = equipment.filter(eq =>
      ['AVAILABLE', 'IN_USE'].includes(eq.status)
    ).length
    return availableCount > 0 ? (inUseCount / availableCount) * 100 : 0
  }, [equipment])

  useEffect(() => {
    fetchEquipment()
  }, [fetchEquipment])

  return {
    equipment,
    isLoading,
    error,
    fetchEquipment,
    createEquipment,
    updateEquipment,
    deleteEquipment,
    assignEquipment,
    returnEquipment,
    scheduleMaintenance,
    recordMaintenance,
    recordUsage,
    reportIncident,
    updateLocation,
    getEquipmentById,
    getEquipmentByStatus,
    getEquipmentByType,
    getAvailableEquipment,
    getEquipmentInUse,
    getMaintenanceDueEquipment,
    getHighMaintenanceCostEquipment,
    getTotalEquipmentValue,
    getUtilizationRate
  }
}