'use client'

import { useState, useEffect, useCallback } from 'react'
import { apiClient } from '@/lib/auth'

// Types
interface SchoolTransport {
  id: string
  routeName: string
  driverName: string
  driverPhone: string
  driverLicense: string
  vehiclePlate: string
  vehicleModel: string
  vehicleCapacity: number
  routeDescription: string
  departureTime: string
  arrivalTime: string
  isActive: boolean
  observations?: string
  students?: {
    id: string
    name: string
    address: string
    phone?: string
    emergencyContact: string
    emergencyPhone: string
  }[]
  route?: {
    stops: {
      id: string
      address: string
      time: string
      students: number
    }[]
  }
  createdAt: string
  updatedAt: string
}

interface CreateSchoolTransportData {
  routeName: string
  driverName: string
  driverPhone: string
  driverLicense: string
  vehiclePlate: string
  vehicleModel: string
  vehicleCapacity: number
  routeDescription: string
  departureTime: string
  arrivalTime: string
  observations?: string
}

interface UpdateSchoolTransportData extends Partial<CreateSchoolTransportData> {
  isActive?: boolean
}

interface TransportStudent {
  id: string
  studentId: string
  transportId: string
  stopAddress: string
  pickupTime: string
  dropoffTime: string
  isActive: boolean
  student?: {
    id: string
    name: string
    phone?: string
    emergencyContact: string
    emergencyPhone: string
  }
}

interface AddStudentToTransportData {
  studentId: string
  stopAddress: string
  pickupTime: string
  dropoffTime: string
}

interface UseSchoolTransportReturn {
  transports: SchoolTransport[]
  transportStudents: TransportStudent[]
  loading: boolean
  error: string | null
  createTransport: (data: CreateSchoolTransportData) => Promise<SchoolTransport>
  updateTransport: (id: string, data: UpdateSchoolTransportData) => Promise<SchoolTransport>
  deleteTransport: (id: string) => Promise<void>
  getTransportById: (id: string) => SchoolTransport | undefined
  addStudentToTransport: (transportId: string, data: AddStudentToTransportData) => Promise<TransportStudent>
  removeStudentFromTransport: (transportId: string, studentId: string) => Promise<void>
  getTransportStudents: (transportId: string) => TransportStudent[]
  refreshTransports: () => Promise<void>
}

export function useSchoolTransport(): UseSchoolTransportReturn {
  const [transports, setTransports] = useState<SchoolTransport[]>([])
  const [transportStudents, setTransportStudents] = useState<TransportStudent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTransports = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await apiClient.get('/api/specialized/education/school-transport')
      setTransports(data.transports || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar transporte escolar')
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchTransportStudents = useCallback(async () => {
    try {
      const data = await apiClient.get('/api/specialized/education/school-transport/students')
      setTransportStudents(data.transportStudents || [])
    } catch (err) {
      console.error('Erro ao carregar alunos do transporte:', err)
    }
  }, [])

  const createTransport = useCallback(async (data: CreateSchoolTransportData): Promise<SchoolTransport> => {
    try {
      setError(null)
      const response = await apiClient.post('/api/specialized/education/school-transport', data)
      const newTransport = response.transport
      setTransports(prev => [newTransport, ...prev])
      return newTransport
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar transporte'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const updateTransport = useCallback(async (id: string, data: UpdateSchoolTransportData): Promise<SchoolTransport> => {
    try {
      setError(null)
      const response = await apiClient.put(`/api/specialized/education/school-transport/${id}`, data)
      const updatedTransport = response.transport
      setTransports(prev => prev.map(transport =>
        transport.id === id ? updatedTransport : transport
      ))
      return updatedTransport
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar transporte'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const deleteTransport = useCallback(async (id: string): Promise<void> => {
    try {
      setError(null)
      await apiClient.delete(`/api/specialized/education/school-transport/${id}`)
      setTransports(prev => prev.filter(transport => transport.id !== id))
      // Remove students from this transport
      setTransportStudents(prev => prev.filter(ts => ts.transportId !== id))
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao excluir transporte'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const addStudentToTransport = useCallback(async (transportId: string, data: AddStudentToTransportData): Promise<TransportStudent> => {
    try {
      setError(null)
      const response = await apiClient.post(`/api/specialized/education/school-transport/${transportId}/students`, data)
      const transportStudent = response.transportStudent
      setTransportStudents(prev => [transportStudent, ...prev])
      return transportStudent
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao adicionar aluno ao transporte'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const removeStudentFromTransport = useCallback(async (transportId: string, studentId: string): Promise<void> => {
    try {
      setError(null)
      await apiClient.delete(`/api/specialized/education/school-transport/${transportId}/students/${studentId}`)
      setTransportStudents(prev => prev.filter(ts =>
        !(ts.transportId === transportId && ts.studentId === studentId)
      ))
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao remover aluno do transporte'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const getTransportById = useCallback((id: string): SchoolTransport | undefined => {
    return transports.find(transport => transport.id === id)
  }, [transports])

  const getTransportStudents = useCallback((transportId: string): TransportStudent[] => {
    return transportStudents.filter(ts => ts.transportId === transportId)
  }, [transportStudents])

  const refreshTransports = useCallback(async () => {
    await Promise.all([fetchTransports(), fetchTransportStudents()])
  }, [fetchTransports, fetchTransportStudents])

  useEffect(() => {
    fetchTransports()
    fetchTransportStudents()
  }, [fetchTransports, fetchTransportStudents])

  return {
    transports,
    transportStudents,
    loading,
    error,
    createTransport,
    updateTransport,
    deleteTransport,
    getTransportById,
    addStudentToTransport,
    removeStudentFromTransport,
    getTransportStudents,
    refreshTransports
  }
}