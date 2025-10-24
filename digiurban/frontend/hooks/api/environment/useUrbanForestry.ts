import { useState, useEffect, useCallback } from 'react'
import { apiClient } from '@/lib/api-client'

export interface UrbanTree {
  id: string
  number: string
  species: {
    scientificName: string
    commonName: string
    family: string
    genus: string
    origin: 'NATIVE' | 'EXOTIC'
    characteristics: {
      canopySize: 'SMALL' | 'MEDIUM' | 'LARGE'
      height: { min: number; max: number }
      growth: 'SLOW' | 'MEDIUM' | 'FAST'
      rootSystem: 'SHALLOW' | 'MEDIUM' | 'DEEP'
      flowering: boolean
      fruiting: boolean
      seasonality: 'EVERGREEN' | 'DECIDUOUS' | 'SEMI_DECIDUOUS'
    }
    adaptability: {
      climate: string[]
      soil: string[]
      pollution: 'LOW' | 'MEDIUM' | 'HIGH'
      drought: 'LOW' | 'MEDIUM' | 'HIGH'
      pruning: 'LOW' | 'MEDIUM' | 'HIGH'
    }
    maintenance: {
      water: 'LOW' | 'MEDIUM' | 'HIGH'
      fertilization: 'LOW' | 'MEDIUM' | 'HIGH'
      pruning: 'LIGHT' | 'MODERATE' | 'HEAVY'
      diseases: string[]
      pests: string[]
    }
  }
  location: {
    address: {
      street: string
      number: string
      complement?: string
      neighborhood: string
      district: string
      city: string
      cep: string
    }
    coordinates: {
      lat: number
      lng: number
      accuracy: number
    }
    context: {
      sidewalk: boolean
      sidewalkWidth?: number
      parkingLot: boolean
      square: boolean
      park: boolean
      school: boolean
      hospital: boolean
      cemetery: boolean
    }
    environment: {
      soilType: string
      drainage: 'EXCELLENT' | 'GOOD' | 'POOR' | 'VERY_POOR'
      exposure: 'FULL_SUN' | 'PARTIAL_SHADE' | 'FULL_SHADE'
      airflow: 'EXCELLENT' | 'GOOD' | 'RESTRICTED'
      proximityToBuildings: number
      proximityToOtherTrees: number
      undergroundUtilities: string[]
      overheadUtilities: string[]
    }
  }
  physical: {
    measurements: {
      height: number
      dbh: number
      canopyDiameter: number
      canopyHeight: number
      trunkCircumference: number
      measurementDate: string
      measuredBy: string
    }
    age: {
      estimated: number
      plantingDate?: string
      method: 'RINGS' | 'ESTIMATION' | 'RECORDS' | 'UNKNOWN'
    }
    condition: {
      overall: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR' | 'CRITICAL' | 'DEAD'
      vigor: 'HIGH' | 'MEDIUM' | 'LOW' | 'DECLINING'
      structural: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR' | 'HAZARDOUS'
      sanitary: 'HEALTHY' | 'STRESSED' | 'DISEASED' | 'INFESTED' | 'DYING'
    }
    health: {
      trunk: {
        condition: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR'
        defects: string[]
        cavities: number
        cankers: number
        cracks: number
        decay: boolean
      }
      crown: {
        condition: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR'
        density: 'FULL' | 'MODERATE' | 'SPARSE' | 'VERY_SPARSE'
        dieback: number
        deadwood: number
        epicormicGrowth: boolean
      }
      roots: {
        condition: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR'
        visible: boolean
        girdling: boolean
        heaving: boolean
        compaction: boolean
        grade: string
      }
      foliage: {
        color: 'NORMAL' | 'CHLOROTIC' | 'NECROTIC' | 'DISCOLORED'
        density: 'FULL' | 'MODERATE' | 'SPARSE' | 'VERY_SPARSE'
        size: 'NORMAL' | 'SMALL' | 'LARGE' | 'VARIABLE'
        seasonality: 'NORMAL' | 'EARLY' | 'LATE' | 'ABNORMAL'
      }
    }
    risks: Array<{
      type: 'STRUCTURAL' | 'HEALTH' | 'ENVIRONMENTAL' | 'LOCATION'
      risk: string
      severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'EXTREME'
      probability: 'LOW' | 'MEDIUM' | 'HIGH'
      target: string
      mitigation: string[]
      urgency: 'LOW' | 'MEDIUM' | 'HIGH' | 'IMMEDIATE'
    }>
  }
  management: {
    status: 'PLANTED' | 'ESTABLISHED' | 'MATURE' | 'DECLINING' | 'REMOVAL_PENDING' | 'REMOVED'
    maintenance: {
      lastPruning?: string
      nextPruning?: string
      pruningType: 'CROWN_CLEANING' | 'CROWN_THINNING' | 'CROWN_RAISING' | 'CROWN_REDUCTION' | 'STRUCTURAL' | 'EMERGENCY'
      lastFertilization?: string
      nextFertilization?: string
      lastWatering?: string
      wateringSchedule?: string
      pestControl: Array<{
        date: string
        pest: string
        treatment: string
        product: string
        effectiveness: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR'
      }>
      diseaseControl: Array<{
        date: string
        disease: string
        treatment: string
        product: string
        effectiveness: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR'
      }>
    }
    protection: {
      guards: boolean
      mulch: boolean
      irrigation: boolean
      lightningProtection: boolean
      cableSupport: boolean
      fencing: boolean
    }
    permits: Array<{
      type: 'PLANTING' | 'PRUNING' | 'REMOVAL' | 'TREATMENT'
      number: string
      issueDate: string
      expiryDate?: string
      conditions: string[]
      status: 'VALID' | 'EXPIRED' | 'USED'
    }>
  }
  services: {
    environmental: {
      co2Sequestration: number
      oxygenProduction: number
      airPurification: {
        pollutantsRemoved: { [pollutant: string]: number }
        monetaryValue: number
      }
      energySavings: {
        cooling: number
        heating: number
        monetaryValue: number
      }
      stormwaterRunoff: {
        intercepted: number
        monetaryValue: number
      }
      biodiversity: {
        habitatValue: 'LOW' | 'MEDIUM' | 'HIGH'
        speciesSupported: string[]
        connectivityValue: number
      }
    }
    social: {
      aestheticValue: 'LOW' | 'MEDIUM' | 'HIGH'
      recreationalValue: 'LOW' | 'MEDIUM' | 'HIGH'
      educationalValue: 'LOW' | 'MEDIUM' | 'HIGH'
      historicalValue: 'LOW' | 'MEDIUM' | 'HIGH'
      culturalValue: 'LOW' | 'MEDIUM' | 'HIGH'
      propertyValue: number
    }
    economic: {
      replacementCost: number
      annualBenefit: number
      cumulativeBenefit: number
      benefitCostRatio: number
      netPresentValue: number
    }
  }
  monitoring: {
    inspections: Array<{
      id: string
      date: string
      inspector: string
      type: 'ROUTINE' | 'DETAILED' | 'RISK_ASSESSMENT' | 'HEALTH_ASSESSMENT' | 'POST_STORM'
      findings: string[]
      recommendations: string[]
      priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
      photos: string[]
      report?: string
    }>
    measurements: Array<{
      date: string
      measurer: string
      height: number
      dbh: number
      canopyDiameter: number
      notes?: string
    }>
    treatments: Array<{
      id: string
      date: string
      type: 'PRUNING' | 'FERTILIZATION' | 'PEST_CONTROL' | 'DISEASE_CONTROL' | 'IRRIGATION' | 'MULCHING' | 'OTHER'
      description: string
      technician: string
      cost: number
      materials: string[]
      equipment: string[]
      beforePhotos: string[]
      afterPhotos: string[]
      effectiveness?: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR'
      followUp?: string
    }>
  }
  community: {
    adoption: {
      adopted: boolean
      adopter?: {
        name: string
        contact: string
        type: 'INDIVIDUAL' | 'FAMILY' | 'BUSINESS' | 'SCHOOL' | 'ORGANIZATION'
        since: string
      }
      responsibilities: string[]
      activities: string[]
    }
    complaints: Array<{
      id: string
      date: string
      complainant: string
      type: 'SAFETY' | 'DAMAGE' | 'MAINTENANCE' | 'ALLERGIES' | 'OBSTRUCTION' | 'OTHER'
      description: string
      status: 'OPEN' | 'INVESTIGATING' | 'RESOLVED' | 'CLOSED'
      resolution?: string
      resolutionDate?: string
    }>
    requests: Array<{
      id: string
      date: string
      requester: string
      type: 'PLANTING' | 'PRUNING' | 'REMOVAL' | 'TREATMENT' | 'INFORMATION'
      description: string
      status: 'PENDING' | 'APPROVED' | 'DENIED' | 'COMPLETED'
      response?: string
      responseDate?: string
    }>
  }
  documentation: {
    photos: Array<{
      id: string
      date: string
      photographer: string
      type: 'GENERAL' | 'CONDITION' | 'MAINTENANCE' | 'DAMAGE' | 'GROWTH'
      description: string
      url: string
      tags: string[]
    }>
    reports: Array<{
      id: string
      date: string
      author: string
      type: 'ASSESSMENT' | 'TREATMENT' | 'INCIDENT' | 'RESEARCH'
      title: string
      url: string
      summary: string
    }>
    certificates: Array<{
      type: 'HERITAGE' | 'CHAMPION' | 'MEMORIAL' | 'RESEARCH'
      authority: string
      issueDate: string
      description: string
      url?: string
    }>
  }
  createdAt: string
  updatedAt: string
  createdBy: string
  lastModifiedBy: string
}

export interface CreateUrbanTreeData {
  species: {
    scientificName: string
    commonName: string
    family: string
    genus: string
    origin: 'NATIVE' | 'EXOTIC'
  }
  location: {
    address: {
      street: string
      number: string
      complement?: string
      neighborhood: string
      district: string
      city: string
      cep: string
    }
    coordinates: {
      lat: number
      lng: number
      accuracy: number
    }
    context: {
      sidewalk: boolean
      sidewalkWidth?: number
      parkingLot: boolean
      square: boolean
      park: boolean
    }
  }
  physical: {
    measurements: {
      height: number
      dbh: number
      canopyDiameter: number
      measurementDate: string
      measuredBy: string
    }
    condition: {
      overall: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR' | 'CRITICAL' | 'DEAD'
      vigor: 'HIGH' | 'MEDIUM' | 'LOW' | 'DECLINING'
      structural: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR' | 'HAZARDOUS'
      sanitary: 'HEALTHY' | 'STRESSED' | 'DISEASED' | 'INFESTED' | 'DYING'
    }
  }
  plantingDate?: string
  inspectorId: string
}

export interface UrbanTreeFilters {
  species?: string
  neighborhood?: string
  district?: string
  condition?: string
  vigor?: string
  origin?: 'NATIVE' | 'EXOTIC'
  adoptionStatus?: boolean
  riskLevel?: 'LOW' | 'MEDIUM' | 'HIGH' | 'EXTREME'
  maintenanceNeeded?: boolean
  inspectorId?: string
}

export interface UrbanForestryProgram {
  id: string
  name: string
  type: 'PLANTING' | 'MAINTENANCE' | 'REMOVAL' | 'CONSERVATION' | 'EDUCATION' | 'RESEARCH'
  status: 'PLANNING' | 'ACTIVE' | 'COMPLETED' | 'SUSPENDED' | 'CANCELLED'
  description: string
  objectives: string[]
  targetArea: {
    neighborhoods: string[]
    streets: string[]
    coordinates?: Array<{ lat: number; lng: number }>
    totalArea: number
  }
  timeline: {
    startDate: string
    endDate: string
    phases: Array<{
      name: string
      startDate: string
      endDate: string
      activities: string[]
      budget: number
    }>
  }
  trees: {
    target: number
    planted: number
    species: Array<{
      scientificName: string
      quantity: number
      percentage: number
    }>
    survival: {
      rate: number
      factors: string[]
    }
  }
  budget: {
    total: number
    spent: number
    categories: {
      planning: number
      planting: number
      maintenance: number
      education: number
      monitoring: number
      equipment: number
    }
  }
  team: {
    coordinator: string
    technicians: string[]
    volunteers: number
    partners: string[]
  }
  monitoring: {
    indicators: Array<{
      name: string
      target: number
      current: number
      unit: string
    }>
    reports: Array<{
      date: string
      type: string
      summary: string
      url: string
    }>
  }
  community: {
    participation: number
    events: number
    feedback: {
      positive: number
      negative: number
      suggestions: string[]
    }
  }
  createdAt: string
  updatedAt: string
}

export function useUrbanForestry() {
  const [trees, setTrees] = useState<UrbanTree[]>([])
  const [programs, setPrograms] = useState<UrbanForestryProgram[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchTrees = useCallback(async (filters?: UrbanTreeFilters) => {
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
      const response = await apiClient.get(`/environment/urban-forestry/trees?${params}`)
      setTrees(response.data.data || [])
    } catch (err) {
      setError('Erro ao carregar árvores urbanas')
      console.error('Error fetching urban trees:', err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const fetchPrograms = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await apiClient.get('/environment/urban-forestry/programs')
      setPrograms(response.data.data || [])
    } catch (err) {
      setError('Erro ao carregar programas de arborização')
      console.error('Error fetching forestry programs:', err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const createTree = useCallback(async (data: CreateUrbanTreeData) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await apiClient.post('/environment/urban-forestry/trees', data)
      const newTree = response.data.data
      setTrees(prev => [newTree, ...prev])
      return newTree
    } catch (err) {
      setError('Erro ao cadastrar árvore')
      console.error('Error creating tree:', err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const updateTree = useCallback(async (id: string, data: Partial<CreateUrbanTreeData>) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await apiClient.put(`/environment/urban-forestry/trees/${id}`, data)
      const updatedTree = response.data.data
      setTrees(prev => prev.map(tree => tree.id === id ? updatedTree : tree))
      return updatedTree
    } catch (err) {
      setError('Erro ao atualizar árvore')
      console.error('Error updating tree:', err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const deleteTree = useCallback(async (id: string) => {
    setIsLoading(true)
    setError(null)
    try {
      await apiClient.delete(`/environment/urban-forestry/trees/${id}`)
      setTrees(prev => prev.filter(tree => tree.id !== id))
    } catch (err) {
      setError('Erro ao excluir árvore')
      console.error('Error deleting tree:', err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const inspectTree = useCallback(async (id: string, inspectionData: {
    type: 'ROUTINE' | 'DETAILED' | 'RISK_ASSESSMENT' | 'HEALTH_ASSESSMENT' | 'POST_STORM'
    inspector: string
    findings: string[]
    recommendations: string[]
    priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
    condition: {
      overall: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR' | 'CRITICAL' | 'DEAD'
      vigor: 'HIGH' | 'MEDIUM' | 'LOW' | 'DECLINING'
      structural: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR' | 'HAZARDOUS'
      sanitary: 'HEALTHY' | 'STRESSED' | 'DISEASED' | 'INFESTED' | 'DYING'
    }
    measurements?: {
      height: number
      dbh: number
      canopyDiameter: number
    }
    photos?: File[]
    report?: File
  }) => {
    setIsLoading(true)
    setError(null)
    try {
      const formData = new FormData()
      Object.entries(inspectionData).forEach(([key, value]) => {
        if (key === 'photos' && Array.isArray(value)) {
          value.forEach((file, index) => {
            formData.append(`photos[${index}]`, file)
          })
        } else if (key === 'report' && value instanceof File) {
          formData.append('report', value)
        } else if (typeof value === 'object') {
          formData.append(key, JSON.stringify(value))
        } else if (value !== undefined) {
          formData.append(key, value.toString())
        }
      })

      const response = await apiClient.post(`/environment/urban-forestry/trees/${id}/inspections`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      const updatedTree = response.data.data
      setTrees(prev => prev.map(tree => tree.id === id ? updatedTree : tree))
      return updatedTree
    } catch (err) {
      setError('Erro ao realizar vistoria')
      console.error('Error inspecting tree:', err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const treatTree = useCallback(async (id: string, treatmentData: {
    type: 'PRUNING' | 'FERTILIZATION' | 'PEST_CONTROL' | 'DISEASE_CONTROL' | 'IRRIGATION' | 'MULCHING' | 'OTHER'
    description: string
    technician: string
    cost: number
    materials: string[]
    equipment: string[]
    scheduledDate?: string
    beforePhotos?: File[]
    afterPhotos?: File[]
  }) => {
    setIsLoading(true)
    setError(null)
    try {
      const formData = new FormData()
      Object.entries(treatmentData).forEach(([key, value]) => {
        if (key === 'beforePhotos' && Array.isArray(value)) {
          value.forEach((file, index) => {
            formData.append(`beforePhotos[${index}]`, file)
          })
        } else if (key === 'afterPhotos' && Array.isArray(value)) {
          value.forEach((file, index) => {
            formData.append(`afterPhotos[${index}]`, file)
          })
        } else if (Array.isArray(value)) {
          formData.append(key, JSON.stringify(value))
        } else if (value !== undefined) {
          formData.append(key, value.toString())
        }
      })

      const response = await apiClient.post(`/environment/urban-forestry/trees/${id}/treatments`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      const updatedTree = response.data.data
      setTrees(prev => prev.map(tree => tree.id === id ? updatedTree : tree))
      return updatedTree
    } catch (err) {
      setError('Erro ao registrar tratamento')
      console.error('Error treating tree:', err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const adoptTree = useCallback(async (id: string, adoptionData: {
    adopterName: string
    adopterContact: string
    adopterType: 'INDIVIDUAL' | 'FAMILY' | 'BUSINESS' | 'SCHOOL' | 'ORGANIZATION'
    responsibilities: string[]
    startDate: string
    duration?: number
  }) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await apiClient.post(`/environment/urban-forestry/trees/${id}/adopt`, adoptionData)
      const updatedTree = response.data.data
      setTrees(prev => prev.map(tree => tree.id === id ? updatedTree : tree))
      return updatedTree
    } catch (err) {
      setError('Erro ao processar adoção')
      console.error('Error adopting tree:', err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const reportComplaint = useCallback(async (id: string, complaintData: {
    complainant: string
    type: 'SAFETY' | 'DAMAGE' | 'MAINTENANCE' | 'ALLERGIES' | 'OBSTRUCTION' | 'OTHER'
    description: string
    contact?: string
    urgent: boolean
  }) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await apiClient.post(`/environment/urban-forestry/trees/${id}/complaints`, complaintData)
      const updatedTree = response.data.data
      setTrees(prev => prev.map(tree => tree.id === id ? updatedTree : tree))
      return updatedTree
    } catch (err) {
      setError('Erro ao registrar reclamação')
      console.error('Error reporting complaint:', err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const uploadPhotos = useCallback(async (id: string, photosData: {
    photos: File[]
    type: 'GENERAL' | 'CONDITION' | 'MAINTENANCE' | 'DAMAGE' | 'GROWTH'
    description: string
    photographer: string
    tags?: string[]
  }) => {
    setIsLoading(true)
    setError(null)
    try {
      const formData = new FormData()
      photosData.photos.forEach((photo, index) => {
        formData.append(`photos[${index}]`, photo)
      })
      formData.append('type', photosData.type)
      formData.append('description', photosData.description)
      formData.append('photographer', photosData.photographer)
      if (photosData.tags) {
        formData.append('tags', JSON.stringify(photosData.tags))
      }

      const response = await apiClient.post(`/environment/urban-forestry/trees/${id}/photos`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      const updatedTree = response.data.data
      setTrees(prev => prev.map(tree => tree.id === id ? updatedTree : tree))
      return updatedTree
    } catch (err) {
      setError('Erro ao enviar fotos')
      console.error('Error uploading photos:', err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const calculateEcosystemServices = useCallback(async (id: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await apiClient.post(`/environment/urban-forestry/trees/${id}/ecosystem-services`)
      const updatedTree = response.data.data
      setTrees(prev => prev.map(tree => tree.id === id ? updatedTree : tree))
      return updatedTree.services
    } catch (err) {
      setError('Erro ao calcular serviços ecossistêmicos')
      console.error('Error calculating ecosystem services:', err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const generateReport = useCallback(async (reportConfig: {
    type: 'INVENTORY' | 'CONDITION' | 'MAINTENANCE' | 'ECOSYSTEM_SERVICES' | 'COMPREHENSIVE'
    area?: {
      neighborhoods?: string[]
      districts?: string[]
      coordinates?: Array<{ lat: number; lng: number }>
    }
    filters?: UrbanTreeFilters
    format: 'PDF' | 'EXCEL' | 'CSV'
    includePhotos: boolean
    includeMap: boolean
  }) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await apiClient.post('/environment/urban-forestry/reports', reportConfig)
      return response.data.data
    } catch (err) {
      setError('Erro ao gerar relatório')
      console.error('Error generating report:', err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const getTreeById = useCallback((id: string) => {
    return trees.find(tree => tree.id === id)
  }, [trees])

  const getTreesBySpecies = useCallback((species: string) => {
    return trees.filter(tree =>
      tree.species.scientificName.includes(species) ||
      tree.species.commonName.includes(species)
    )
  }, [trees])

  const getTreesByCondition = useCallback((condition: string) => {
    return trees.filter(tree => tree.physical.condition.overall === condition)
  }, [trees])

  const getTreesByNeighborhood = useCallback((neighborhood: string) => {
    return trees.filter(tree => tree.location.address.neighborhood === neighborhood)
  }, [trees])

  const getHighRiskTrees = useCallback(() => {
    return trees.filter(tree =>
      tree.physical.risks.some(risk => risk.severity === 'HIGH' || risk.severity === 'EXTREME')
    )
  }, [trees])

  const getTreesNeedingMaintenance = useCallback(() => {
    const today = new Date().toISOString().split('T')[0]
    return trees.filter(tree =>
      (tree.management.maintenance.nextPruning && tree.management.maintenance.nextPruning <= today) ||
      (tree.management.maintenance.nextFertilization && tree.management.maintenance.nextFertilization <= today)
    )
  }, [trees])

  const getAdoptedTrees = useCallback(() => {
    return trees.filter(tree => tree.community.adoption.adopted)
  }, [trees])

  const getNativeTrees = useCallback(() => {
    return trees.filter(tree => tree.species.origin === 'NATIVE')
  }, [trees])

  const getTreesWithComplaints = useCallback(() => {
    return trees.filter(tree =>
      tree.community.complaints.some(complaint => complaint.status === 'OPEN')
    )
  }, [trees])

  const getTotalCanopyCoverage = useCallback((area?: number) => {
    const totalCanopyArea = trees.reduce((sum, tree) => {
      const radius = tree.physical.measurements.canopyDiameter / 2
      const canopyArea = Math.PI * radius * radius
      return sum + canopyArea
    }, 0)

    return area ? (totalCanopyArea / area) * 100 : totalCanopyArea
  }, [trees])

  const getSpeciesDiversity = useCallback(() => {
    const speciesCount: { [key: string]: number } = {}
    trees.forEach(tree => {
      const species = tree.species.scientificName
      speciesCount[species] = (speciesCount[species] || 0) + 1
    })

    return {
      totalSpecies: Object.keys(speciesCount).length,
      distribution: speciesCount,
      dominantSpecies: Object.entries(speciesCount)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
    }
  }, [trees])

  const getEcosystemServicesValue = useCallback(() => {
    return trees.reduce((total, tree) => {
      const services = tree.services?.economic
      return total + (services?.annualBenefit || 0)
    }, 0)
  }, [trees])

  useEffect(() => {
    fetchTrees()
    fetchPrograms()
  }, [fetchTrees, fetchPrograms])

  return {
    trees,
    programs,
    isLoading,
    error,
    fetchTrees,
    fetchPrograms,
    createTree,
    updateTree,
    deleteTree,
    inspectTree,
    treatTree,
    adoptTree,
    reportComplaint,
    uploadPhotos,
    calculateEcosystemServices,
    generateReport,
    getTreeById,
    getTreesBySpecies,
    getTreesByCondition,
    getTreesByNeighborhood,
    getHighRiskTrees,
    getTreesNeedingMaintenance,
    getAdoptedTrees,
    getNativeTrees,
    getTreesWithComplaints,
    getTotalCanopyCoverage,
    getSpeciesDiversity,
    getEcosystemServicesValue
  }
}