import { useState, useEffect, useCallback } from 'react'
import { apiClient } from '@/lib/api-client'

export interface WasteManagement {
  id: string
  name: string
  code: string
  type: 'COLLECTION' | 'TREATMENT' | 'DISPOSAL' | 'RECYCLING' | 'COMPOSTING' | 'HAZARDOUS' | 'HEALTHCARE' | 'ELECTRONIC'
  category: 'MUNICIPAL' | 'INDUSTRIAL' | 'COMMERCIAL' | 'RESIDENTIAL' | 'CONSTRUCTION' | 'AGRICULTURAL' | 'SPECIAL'
  status: 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE' | 'SUSPENDED' | 'DECOMMISSIONED'
  description: string
  wasteTypes: Array<{
    class: string
    subclass: string
    description: string
    code: string
    characteristics: string[]
    hazardous: boolean
    restrictions: string[]
    treatment: string[]
    disposal: string[]
  }>
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
    }
    area: number
    zoning: string
    surroundings: string[]
    environmentalSensitivity: 'LOW' | 'MEDIUM' | 'HIGH'
  }
  collection: {
    routes: Array<{
      id: string
      name: string
      code: string
      type: 'RESIDENTIAL' | 'COMMERCIAL' | 'SELECTIVE' | 'ORGANIC' | 'HAZARDOUS' | 'SPECIAL'
      frequency: 'DAILY' | 'WEEKLY' | 'BIWEEKLY' | 'MONTHLY' | 'ON_DEMAND'
      schedule: {
        days: string[]
        startTime: string
        endTime: string
        duration: number
      }
      coverage: {
        neighborhoods: string[]
        streets: string[]
        buildings: number
        population: number
        estimatedVolume: number
      }
      vehicles: Array<{
        id: string
        type: 'COMPACTOR' | 'TRUCK' | 'VAN' | 'CONTAINER' | 'SPECIALIZED'
        capacity: number
        fuel: 'DIESEL' | 'GASOLINE' | 'ELECTRIC' | 'HYBRID' | 'CNG'
        emissions: number
        maintenance: {
          lastService: string
          nextService: string
          status: 'OPERATIONAL' | 'MAINTENANCE' | 'REPAIR'
        }
      }>
      crew: Array<{
        id: string
        name: string
        role: 'DRIVER' | 'COLLECTOR' | 'SUPERVISOR'
        training: string[]
        certification: string[]
        safety: {
          equipment: string[]
          training: string[]
          incidents: number
        }
      }>
      performance: {
        efficiency: number
        onTimePerformance: number
        collectionsCompleted: number
        volumeCollected: number
        fuelConsumption: number
        complaints: number
      }
    }>
    points: Array<{
      id: string
      type: 'CONTAINER' | 'BIN' | 'COLLECTION_POINT' | 'TRANSFER_STATION'
      location: {
        address: string
        coordinates: { lat: number; lng: number }
        accessibility: boolean
      }
      capacity: number
      wasteTypes: string[]
      schedule: {
        collectionFrequency: string
        lastCollection: string
        nextCollection: string
      }
      condition: {
        status: 'GOOD' | 'FAIR' | 'POOR' | 'NEEDS_REPLACEMENT'
        cleanliness: 'CLEAN' | 'MODERATE' | 'DIRTY'
        damage: string[]
        maintenance: string[]
      }
      monitoring: {
        fillLevel: number
        temperature?: number
        weight?: number
        lastUpdate: string
        alerts: string[]
      }
    }>
  }
  treatment: {
    processes: Array<{
      id: string
      name: string
      type: 'SORTING' | 'SHREDDING' | 'COMPOSTING' | 'INCINERATION' | 'PYROLYSIS' | 'ANAEROBIC_DIGESTION' | 'CHEMICAL' | 'BIOLOGICAL'
      description: string
      inputWaste: string[]
      outputProducts: Array<{
        type: string
        description: string
        quantity: number
        unit: string
        quality: string
        market: string
      }>
      capacity: {
        design: number
        operational: number
        current: number
        unit: string
      }
      efficiency: {
        recovery: number
        processing: number
        energy: number
        environmental: number
      }
      technology: {
        equipment: string[]
        automation: string
        controls: string[]
        monitoring: string[]
      }
      environmental: {
        emissions: Array<{
          pollutant: string
          concentration: number
          limit: number
          unit: string
          treatment: string
        }>
        effluents: Array<{
          parameter: string
          concentration: number
          limit: number
          unit: string
          treatment: string
        }>
        noise: {
          level: number
          limit: number
          mitigation: string[]
        }
        odor: {
          control: string[]
          monitoring: string
          complaints: number
        }
      }
    }>
    facilities: Array<{
      id: string
      name: string
      type: 'SORTING_CENTER' | 'COMPOSTING_PLANT' | 'INCINERATOR' | 'TRANSFER_STATION' | 'RECYCLING_PLANT'
      capacity: number
      area: number
      workforce: number
      operatingHours: string
      license: {
        number: string
        type: string
        issueDate: string
        expiryDate: string
        conditions: string[]
      }
      utilities: {
        electricity: { consumption: number; source: string }
        water: { consumption: number; source: string }
        gas: { consumption: number; type: string }
      }
      safety: {
        procedures: string[]
        equipment: string[]
        training: string[]
        incidents: Array<{
          date: string
          type: string
          severity: 'LOW' | 'MEDIUM' | 'HIGH'
          description: string
          actions: string[]
        }>
      }
    }>
  }
  disposal: {
    sites: Array<{
      id: string
      name: string
      type: 'LANDFILL' | 'CONTROLLED_DUMP' | 'HAZARDOUS_FACILITY' | 'INERT_WASTE'
      status: 'ACTIVE' | 'INACTIVE' | 'CLOSED' | 'REHABILITATION'
      capacity: {
        total: number
        used: number
        remaining: number
        unit: string
        projectedLife: number
      }
      cells: Array<{
        id: string
        area: number
        depth: number
        volume: number
        wasteTypes: string[]
        status: 'PREPARATION' | 'ACTIVE' | 'FULL' | 'COVERED'
        startDate: string
        endDate?: string
      }>
      infrastructure: {
        liner: { type: string; integrity: 'GOOD' | 'FAIR' | 'POOR' }
        drainage: { surface: boolean; subsurface: boolean; status: string }
        leachate: {
          collection: boolean
          treatment: string
          volume: number
          quality: { [parameter: string]: number }
        }
        gas: {
          collection: boolean
          treatment: string
          flaring: boolean
          energy: boolean
          emissions: number
        }
        monitoring: {
          groundwater: Array<{
            wellId: string
            parameters: string[]
            frequency: string
            lastSample: string
          }>
          surface: Array<{
            pointId: string
            parameters: string[]
            frequency: string
            lastSample: string
          }>
          air: Array<{
            stationId: string
            parameters: string[]
            frequency: string
            lastReading: string
          }>
        }
      }
      environmental: {
        compliance: 'COMPLIANT' | 'NON_COMPLIANT' | 'UNDER_REVIEW'
        impacts: string[]
        mitigation: string[]
        monitoring: string[]
        rehabilitation: {
          plan: boolean
          status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED'
          activities: string[]
          timeline: string
        }
      }
    }>
  }
  recycling: {
    programs: Array<{
      id: string
      name: string
      type: 'MUNICIPAL' | 'COMMUNITY' | 'INDUSTRIAL' | 'COMMERCIAL'
      materials: Array<{
        type: string
        description: string
        collection: string
        processing: string
        market: string
        price: number
        demand: string
      }>
      collection: {
        points: number
        frequency: string
        volume: number
        participation: number
      }
      processing: {
        facility: string
        capacity: number
        recovery: number
        contamination: number
      }
      economics: {
        revenue: number
        costs: number
        netBenefit: number
        jobsCreated: number
      }
      education: {
        campaigns: string[]
        materials: string[]
        reach: number
        effectiveness: number
      }
    }>
    centers: Array<{
      id: string
      name: string
      type: 'SORTING' | 'PROCESSING' | 'BUYBACK' | 'COOPERATIVE'
      materials: string[]
      capacity: number
      workforce: number
      equipment: string[]
      certifications: string[]
      performance: {
        throughput: number
        quality: number
        recovery: number
        contamination: number
      }
    }>
  }
  monitoring: {
    waste: {
      generation: Array<{
        source: string
        type: string
        quantity: number
        unit: string
        period: string
        composition: { [material: string]: number }
      }>
      collection: Array<{
        route: string
        date: string
        volume: number
        weight: number
        composition: { [material: string]: number }
        efficiency: number
      }>
      treatment: Array<{
        facility: string
        process: string
        input: number
        output: number
        recovery: number
        disposal: number
        date: string
      }>
      disposal: Array<{
        site: string
        type: string
        quantity: number
        date: string
        cell: string
        compaction: number
      }>
    }
    quality: {
      parameters: Array<{
        parameter: string
        value: number
        unit: string
        limit: number
        compliance: boolean
        location: string
        date: string
      }>
      sampling: Array<{
        sampleId: string
        location: string
        type: string
        date: string
        results: { [parameter: string]: number }
        laboratory: string
        certified: boolean
      }>
    }
    environmental: {
      air: Array<{
        pollutant: string
        concentration: number
        limit: number
        location: string
        date: string
      }>
      water: Array<{
        parameter: string
        value: number
        limit: number
        location: string
        date: string
      }>
      soil: Array<{
        parameter: string
        value: number
        limit: number
        location: string
        date: string
      }>
    }
  }
  regulations: {
    compliance: Array<{
      regulation: string
      authority: string
      requirements: string[]
      status: 'COMPLIANT' | 'NON_COMPLIANT' | 'PARTIAL'
      lastAudit: string
      nextAudit: string
      actions: string[]
    }>
    permits: Array<{
      type: string
      number: string
      authority: string
      issueDate: string
      expiryDate: string
      conditions: string[]
      status: 'VALID' | 'EXPIRED' | 'SUSPENDED' | 'RENEWAL'
    }>
    reporting: Array<{
      report: string
      frequency: string
      deadline: string
      lastSubmitted: string
      nextDue: string
      responsible: string
    }>
  }
  economics: {
    costs: {
      collection: number
      transport: number
      treatment: number
      disposal: number
      administration: number
      total: number
    }
    revenues: {
      recyclables: number
      energy: number
      compost: number
      fees: number
      grants: number
      total: number
    }
    efficiency: {
      costPerTon: number
      revenuePerTon: number
      netCost: number
      recovery: number
      diversion: number
    }
    funding: Array<{
      source: string
      type: 'GRANT' | 'LOAN' | 'REVENUE' | 'TAX'
      amount: number
      period: string
      conditions: string[]
    }>
  }
  stakeholders: {
    generators: Array<{
      type: 'RESIDENTIAL' | 'COMMERCIAL' | 'INDUSTRIAL' | 'INSTITUTIONAL'
      count: number
      volume: number
      contracts: number
      compliance: number
    }>
    service: Array<{
      name: string
      type: 'COLLECTOR' | 'TRANSPORTER' | 'PROCESSOR' | 'DISPOSER'
      license: string
      capacity: number
      service: string[]
      performance: number
    }>
    community: {
      participation: number
      satisfaction: number
      complaints: number
      suggestions: string[]
      education: {
        programs: string[]
        reach: number
        effectiveness: number
      }
    }
  }
  technology: {
    systems: Array<{
      name: string
      type: 'TRACKING' | 'MONITORING' | 'ROUTING' | 'BILLING' | 'REPORTING'
      description: string
      status: 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE'
      users: number
      integration: string[]
    }>
    sensors: Array<{
      type: 'FILL_LEVEL' | 'WEIGHT' | 'TEMPERATURE' | 'GAS' | 'LOCATION'
      quantity: number
      coverage: number
      accuracy: number
      maintenance: string
    }>
    automation: {
      collection: string[]
      sorting: string[]
      processing: string[]
      monitoring: string[]
    }
  }
  performance: {
    kpis: Array<{
      name: string
      value: number
      target: number
      unit: string
      trend: 'IMPROVING' | 'STABLE' | 'DECLINING'
      benchmark: number
    }>
    efficiency: {
      collection: number
      recycling: number
      treatment: number
      disposal: number
      overall: number
    }
    sustainability: {
      recovery: number
      diversion: number
      emissions: number
      energy: number
      water: number
    }
  }
  createdAt: string
  updatedAt: string
  createdBy: string
  lastModifiedBy: string
}

export interface CreateWasteManagementData {
  name: string
  code: string
  type: 'COLLECTION' | 'TREATMENT' | 'DISPOSAL' | 'RECYCLING' | 'COMPOSTING' | 'HAZARDOUS' | 'HEALTHCARE' | 'ELECTRONIC'
  category: 'MUNICIPAL' | 'INDUSTRIAL' | 'COMMERCIAL' | 'RESIDENTIAL' | 'CONSTRUCTION' | 'AGRICULTURAL' | 'SPECIAL'
  description: string
  wasteTypes: Array<{
    class: string
    subclass: string
    description: string
    code: string
    characteristics: string[]
    hazardous: boolean
  }>
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
    }
    area: number
    zoning: string
  }
  managerId: string
}

export interface WasteManagementFilters {
  type?: string
  category?: string
  status?: string
  wasteClass?: string
  location?: string
  managerId?: string
  hazardous?: boolean
  capacity?: number
  compliance?: 'COMPLIANT' | 'NON_COMPLIANT'
}

export function useWasteManagement() {
  const [wasteManagements, setWasteManagements] = useState<WasteManagement[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchWasteManagements = useCallback(async (filters?: WasteManagementFilters) => {
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
      const response = await apiClient.get(`/environment/waste-management?${params}`)
      setWasteManagements(response.data.data || [])
    } catch (err) {
      setError('Erro ao carregar sistemas de gestão de resíduos')
      console.error('Error fetching waste management systems:', err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const createWasteManagement = useCallback(async (data: CreateWasteManagementData) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await apiClient.post('/environment/waste-management', data)
      const newWasteManagement = response.data.data
      setWasteManagements(prev => [newWasteManagement, ...prev])
      return newWasteManagement
    } catch (err) {
      setError('Erro ao criar sistema de gestão de resíduos')
      console.error('Error creating waste management system:', err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const updateWasteManagement = useCallback(async (id: string, data: Partial<CreateWasteManagementData>) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await apiClient.put(`/environment/waste-management/${id}`, data)
      const updatedWasteManagement = response.data.data
      setWasteManagements(prev => prev.map(wm => wm.id === id ? updatedWasteManagement : wm))
      return updatedWasteManagement
    } catch (err) {
      setError('Erro ao atualizar sistema de gestão de resíduos')
      console.error('Error updating waste management system:', err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const deleteWasteManagement = useCallback(async (id: string) => {
    setIsLoading(true)
    setError(null)
    try {
      await apiClient.delete(`/environment/waste-management/${id}`)
      setWasteManagements(prev => prev.filter(wm => wm.id !== id))
    } catch (err) {
      setError('Erro ao excluir sistema de gestão de resíduos')
      console.error('Error deleting waste management system:', err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const addCollectionRoute = useCallback(async (id: string, routeData: {
    name: string
    code: string
    type: 'RESIDENTIAL' | 'COMMERCIAL' | 'SELECTIVE' | 'ORGANIC' | 'HAZARDOUS' | 'SPECIAL'
    frequency: 'DAILY' | 'WEEKLY' | 'BIWEEKLY' | 'MONTHLY' | 'ON_DEMAND'
    schedule: {
      days: string[]
      startTime: string
      endTime: string
    }
    coverage: {
      neighborhoods: string[]
      streets: string[]
      buildings: number
      population: number
      estimatedVolume: number
    }
    vehicleIds: string[]
    crewIds: string[]
  }) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await apiClient.post(`/environment/waste-management/${id}/routes`, routeData)
      const updatedWasteManagement = response.data.data
      setWasteManagements(prev => prev.map(wm => wm.id === id ? updatedWasteManagement : wm))
      return updatedWasteManagement
    } catch (err) {
      setError('Erro ao adicionar rota de coleta')
      console.error('Error adding collection route:', err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const recordCollection = useCallback(async (id: string, routeId: string, collectionData: {
    date: string
    volume: number
    weight: number
    composition: { [material: string]: number }
    issues?: string[]
    photos?: File[]
  }) => {
    setIsLoading(true)
    setError(null)
    try {
      const formData = new FormData()
      Object.entries(collectionData).forEach(([key, value]) => {
        if (key === 'photos' && Array.isArray(value)) {
          value.forEach((file, index) => {
            formData.append(`photos[${index}]`, file)
          })
        } else if (typeof value === 'object') {
          formData.append(key, JSON.stringify(value))
        } else if (value !== undefined) {
          formData.append(key, value.toString())
        }
      })

      const response = await apiClient.post(`/environment/waste-management/${id}/routes/${routeId}/collections`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      const updatedWasteManagement = response.data.data
      setWasteManagements(prev => prev.map(wm => wm.id === id ? updatedWasteManagement : wm))
      return updatedWasteManagement
    } catch (err) {
      setError('Erro ao registrar coleta')
      console.error('Error recording collection:', err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const addTreatmentProcess = useCallback(async (id: string, processData: {
    name: string
    type: 'SORTING' | 'SHREDDING' | 'COMPOSTING' | 'INCINERATION' | 'PYROLYSIS' | 'ANAEROBIC_DIGESTION' | 'CHEMICAL' | 'BIOLOGICAL'
    description: string
    inputWaste: string[]
    capacity: {
      design: number
      unit: string
    }
    technology: {
      equipment: string[]
      automation: string
      controls: string[]
    }
  }) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await apiClient.post(`/environment/waste-management/${id}/treatment`, processData)
      const updatedWasteManagement = response.data.data
      setWasteManagements(prev => prev.map(wm => wm.id === id ? updatedWasteManagement : wm))
      return updatedWasteManagement
    } catch (err) {
      setError('Erro ao adicionar processo de tratamento')
      console.error('Error adding treatment process:', err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const recordWasteGeneration = useCallback(async (id: string, generationData: {
    source: string
    type: string
    quantity: number
    unit: string
    period: string
    composition: { [material: string]: number }
    location?: string
  }) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await apiClient.post(`/environment/waste-management/${id}/generation`, generationData)
      const updatedWasteManagement = response.data.data
      setWasteManagements(prev => prev.map(wm => wm.id === id ? updatedWasteManagement : wm))
      return updatedWasteManagement
    } catch (err) {
      setError('Erro ao registrar geração de resíduos')
      console.error('Error recording waste generation:', err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const recordDisposal = useCallback(async (id: string, disposalData: {
    siteId: string
    cellId: string
    wasteType: string
    quantity: number
    date: string
    transportManifest: string
    compactionRatio: number
    photos?: File[]
    documentation?: File[]
  }) => {
    setIsLoading(true)
    setError(null)
    try {
      const formData = new FormData()
      Object.entries(disposalData).forEach(([key, value]) => {
        if (key === 'photos' && Array.isArray(value)) {
          value.forEach((file, index) => {
            formData.append(`photos[${index}]`, file)
          })
        } else if (key === 'documentation' && Array.isArray(value)) {
          value.forEach((file, index) => {
            formData.append(`documentation[${index}]`, file)
          })
        } else if (value !== undefined) {
          formData.append(key, value.toString())
        }
      })

      const response = await apiClient.post(`/environment/waste-management/${id}/disposal`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      const updatedWasteManagement = response.data.data
      setWasteManagements(prev => prev.map(wm => wm.id === id ? updatedWasteManagement : wm))
      return updatedWasteManagement
    } catch (err) {
      setError('Erro ao registrar disposição')
      console.error('Error recording disposal:', err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const updateRecyclingProgram = useCallback(async (id: string, programData: {
    name: string
    type: 'MUNICIPAL' | 'COMMUNITY' | 'INDUSTRIAL' | 'COMMERCIAL'
    materials: Array<{
      type: string
      description: string
      collection: string
      processing: string
      market: string
      price: number
    }>
    targetParticipation: number
    educationCampaigns: string[]
  }) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await apiClient.post(`/environment/waste-management/${id}/recycling`, programData)
      const updatedWasteManagement = response.data.data
      setWasteManagements(prev => prev.map(wm => wm.id === id ? updatedWasteManagement : wm))
      return updatedWasteManagement
    } catch (err) {
      setError('Erro ao atualizar programa de reciclagem')
      console.error('Error updating recycling program:', err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const recordEnvironmentalMonitoring = useCallback(async (id: string, monitoringData: {
    type: 'AIR' | 'WATER' | 'SOIL' | 'NOISE' | 'ODOR'
    location: string
    parameters: Array<{
      parameter: string
      value: number
      unit: string
      limit: number
      method: string
    }>
    samplingDate: string
    laboratory?: string
    certificateNumber?: string
    photos?: File[]
    report?: File
  }) => {
    setIsLoading(true)
    setError(null)
    try {
      const formData = new FormData()
      Object.entries(monitoringData).forEach(([key, value]) => {
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

      const response = await apiClient.post(`/environment/waste-management/${id}/monitoring`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      const updatedWasteManagement = response.data.data
      setWasteManagements(prev => prev.map(wm => wm.id === id ? updatedWasteManagement : wm))
      return updatedWasteManagement
    } catch (err) {
      setError('Erro ao registrar monitoramento ambiental')
      console.error('Error recording environmental monitoring:', err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const generateReport = useCallback(async (id: string, reportConfig: {
    type: 'OPERATIONAL' | 'ENVIRONMENTAL' | 'FINANCIAL' | 'REGULATORY' | 'COMPREHENSIVE'
    period: {
      start: string
      end: string
    }
    format: 'PDF' | 'EXCEL' | 'CSV'
    sections: string[]
    includeCharts: boolean
    includePhotos: boolean
  }) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await apiClient.post(`/environment/waste-management/${id}/reports`, reportConfig)
      return response.data.data
    } catch (err) {
      setError('Erro ao gerar relatório')
      console.error('Error generating report:', err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const getWasteManagementById = useCallback((id: string) => {
    return wasteManagements.find(wm => wm.id === id)
  }, [wasteManagements])

  const getWasteManagementsByType = useCallback((type: string) => {
    return wasteManagements.filter(wm => wm.type === type)
  }, [wasteManagements])

  const getWasteManagementsByCategory = useCallback((category: string) => {
    return wasteManagements.filter(wm => wm.category === category)
  }, [wasteManagements])

  const getActiveWasteManagements = useCallback(() => {
    return wasteManagements.filter(wm => wm.status === 'ACTIVE')
  }, [wasteManagements])

  const getHazardousWasteManagements = useCallback(() => {
    return wasteManagements.filter(wm =>
      wm.wasteTypes.some(waste => waste.hazardous)
    )
  }, [wasteManagements])

  const getNonCompliantSystems = useCallback(() => {
    return wasteManagements.filter(wm =>
      wm.regulations.compliance.some(comp => comp.status === 'NON_COMPLIANT')
    )
  }, [wasteManagements])

  const getSystemsNeedingMaintenance = useCallback(() => {
    return wasteManagements.filter(wm => wm.status === 'MAINTENANCE')
  }, [wasteManagements])

  const getRecyclingPrograms = useCallback(() => {
    return wasteManagements.filter(wm => wm.type === 'RECYCLING')
  }, [wasteManagements])

  const getTotalWasteVolume = useCallback((period?: { start: string; end: string }) => {
    return wasteManagements.reduce((total, wm) => {
      const volumeInPeriod = wm.monitoring.waste.generation
        .filter(gen => !period || (gen.period >= period.start && gen.period <= period.end))
        .reduce((sum, gen) => sum + gen.quantity, 0)
      return total + volumeInPeriod
    }, 0)
  }, [wasteManagements])

  const getRecyclingRate = useCallback(() => {
    const totalWaste = wasteManagements.reduce((total, wm) =>
      total + wm.monitoring.waste.generation.reduce((sum, gen) => sum + gen.quantity, 0), 0)

    const recycledWaste = wasteManagements
      .filter(wm => wm.type === 'RECYCLING')
      .reduce((total, wm) =>
        total + wm.monitoring.waste.treatment.reduce((sum, treat) => sum + treat.recovery, 0), 0)

    return totalWaste > 0 ? (recycledWaste / totalWaste) * 100 : 0
  }, [wasteManagements])

  const getDiversionRate = useCallback(() => {
    return wasteManagements.reduce((total, wm) => {
      const diversion = wm.performance.sustainability.diversion || 0
      return total + diversion
    }, 0) / wasteManagements.length
  }, [wasteManagements])

  useEffect(() => {
    fetchWasteManagements()
  }, [fetchWasteManagements])

  return {
    wasteManagements,
    isLoading,
    error,
    fetchWasteManagements,
    createWasteManagement,
    updateWasteManagement,
    deleteWasteManagement,
    addCollectionRoute,
    recordCollection,
    addTreatmentProcess,
    recordWasteGeneration,
    recordDisposal,
    updateRecyclingProgram,
    recordEnvironmentalMonitoring,
    generateReport,
    getWasteManagementById,
    getWasteManagementsByType,
    getWasteManagementsByCategory,
    getActiveWasteManagements,
    getHazardousWasteManagements,
    getNonCompliantSystems,
    getSystemsNeedingMaintenance,
    getRecyclingPrograms,
    getTotalWasteVolume,
    getRecyclingRate,
    getDiversionRate
  }
}