'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAdminAuth } from '@/contexts/AdminAuthContext'

interface TeamMember {
  id: string
  name: string
  role: 'SUPERVISOR' | 'OPERATOR' | 'DRIVER' | 'TECHNICIAN' | 'ASSISTANT'
  badge: string
  phone: string
  isActive: boolean
  skills: string[]
  certifications: string[]
}

interface TeamSchedule {
  id: string
  teamId: string
  teamName: string
  date: string
  shift: 'MORNING' | 'AFTERNOON' | 'NIGHT' | 'FULL_DAY'
  startTime: string
  endTime: string
  supervisor: TeamMember
  members: TeamMember[]
  vehicles: {
    id: string
    plate: string
    type: 'TRUCK' | 'VAN' | 'CAR' | 'MOTORCYCLE' | 'EQUIPMENT'
    driver: string
  }[]
  tasks: {
    id: string
    type: 'CLEANING' | 'MAINTENANCE' | 'COLLECTION' | 'REPAIR' | 'INSPECTION'
    description: string
    location: string
    priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
    estimatedDuration: number
    status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'
    startTime?: string
    endTime?: string
    notes?: string
  }[]
  status: 'SCHEDULED' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED'
  totalHours: number
  overtime?: number
  materials: string[]
  equipment: string[]
  cost: number
  productivity?: {
    tasksCompleted: number
    tasksTotal: number
    efficiency: number
    qualityRating: number
  }
  createdAt: string
  updatedAt: string
}

interface CreateTeamScheduleData {
  teamId: string
  teamName: string
  date: string
  shift: 'MORNING' | 'AFTERNOON' | 'NIGHT' | 'FULL_DAY'
  startTime: string
  endTime: string
  supervisorId: string
  memberIds: string[]
  vehicleIds: string[]
  tasks: {
    type: 'CLEANING' | 'MAINTENANCE' | 'COLLECTION' | 'REPAIR' | 'INSPECTION'
    description: string
    location: string
    priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
    estimatedDuration: number
  }[]
  materials: string[]
  equipment: string[]
}

interface UseTeamScheduleReturn {
  teamSchedules: TeamSchedule[]
  loading: boolean
  error: string | null
  createSchedule: (data: CreateTeamScheduleData) => Promise<TeamSchedule>
  updateSchedule: (id: string, data: Partial<CreateTeamScheduleData>) => Promise<TeamSchedule>
  startShift: (id: string) => Promise<TeamSchedule>
  endShift: (id: string, productivity?: any) => Promise<TeamSchedule>
  updateTaskStatus: (scheduleId: string, taskId: string, status: string, notes?: string) => Promise<TeamSchedule>
  addTask: (scheduleId: string, task: any) => Promise<TeamSchedule>
  cancelSchedule: (id: string, reason: string) => Promise<TeamSchedule>
  deleteSchedule: (id: string) => Promise<void>
  getSchedulesByDate: (date: string) => TeamSchedule[]
  getActiveSchedules: () => TeamSchedule[]
  getSchedulesByTeam: (teamId: string) => TeamSchedule[]
  refreshSchedules: () => Promise<void>
}

export function useTeamSchedule(): UseTeamScheduleReturn {
  const [teamSchedules, setTeamSchedules] = useState<TeamSchedule[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchSchedules = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await apiClient.get('/api/secretarias/public-services/team-schedule')
      setTeamSchedules(data.schedules || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar cronograma de equipes')
    } finally {
      setLoading(false)
    }
  }, [])

  const createSchedule = useCallback(async (data: CreateTeamScheduleData): Promise<TeamSchedule> => {
    try {
      setError(null)
      const response = await apiClient.post('/api/secretarias/public-services/team-schedule', data)
      const newSchedule = response.schedule
      setTeamSchedules(prev => [newSchedule, ...prev])
      return newSchedule
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar cronograma'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const updateSchedule = useCallback(async (id: string, data: Partial<CreateTeamScheduleData>): Promise<TeamSchedule> => {
    try {
      setError(null)
      const response = await apiClient.put(`/api/secretarias/public-services/team-schedule/${id}`, data)
      const updatedSchedule = response.schedule
      setTeamSchedules(prev => prev.map(schedule => schedule.id === id ? updatedSchedule : schedule))
      return updatedSchedule
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar cronograma'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const startShift = useCallback(async (id: string): Promise<TeamSchedule> => {
    return updateSchedule(id, { status: 'ACTIVE' } as any)
  }, [updateSchedule])

  const endShift = useCallback(async (id: string, productivity?: any): Promise<TeamSchedule> => {
    return updateSchedule(id, { status: 'COMPLETED', productivity } as any)
  }, [updateSchedule])

  const updateTaskStatus = useCallback(async (scheduleId: string, taskId: string, status: string, notes?: string): Promise<TeamSchedule> => {
    try {
      setError(null)
      const response = await apiClient.put(`/api/secretarias/public-services/team-schedule/${scheduleId}/tasks/${taskId}`, { status, notes })
      const updatedSchedule = response.schedule
      setTeamSchedules(prev => prev.map(schedule => schedule.id === scheduleId ? updatedSchedule : schedule))
      return updatedSchedule
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar tarefa'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const addTask = useCallback(async (scheduleId: string, task: any): Promise<TeamSchedule> => {
    try {
      setError(null)
      const response = await apiClient.post(`/api/secretarias/public-services/team-schedule/${scheduleId}/tasks`, task)
      const updatedSchedule = response.schedule
      setTeamSchedules(prev => prev.map(schedule => schedule.id === scheduleId ? updatedSchedule : schedule))
      return updatedSchedule
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao adicionar tarefa'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const cancelSchedule = useCallback(async (id: string, reason: string): Promise<TeamSchedule> => {
    return updateSchedule(id, { status: 'CANCELLED' } as any)
  }, [updateSchedule])

  const deleteSchedule = useCallback(async (id: string): Promise<void> => {
    try {
      setError(null)
      await apiClient.delete(`/api/secretarias/public-services/team-schedule/${id}`)
      setTeamSchedules(prev => prev.filter(schedule => schedule.id !== id))
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao excluir cronograma'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const getSchedulesByDate = useCallback((date: string) => {
    return teamSchedules.filter(schedule => schedule.date === date)
  }, [teamSchedules])

  const getActiveSchedules = useCallback(() => {
    return teamSchedules.filter(schedule => schedule.status === 'ACTIVE')
  }, [teamSchedules])

  const getSchedulesByTeam = useCallback((teamId: string) => {
    return teamSchedules.filter(schedule => schedule.teamId === teamId)
  }, [teamSchedules])

  const refreshSchedules = useCallback(async () => {
    await fetchSchedules()
  }, [fetchSchedules])

  useEffect(() => {
    fetchSchedules()
  }, [fetchSchedules])

  return {
    teamSchedules,
    loading,
    error,
    createSchedule,
    updateSchedule,
    startShift,
    endShift,
    updateTaskStatus,
    addTask,
    cancelSchedule,
    deleteSchedule,
    getSchedulesByDate,
    getActiveSchedules,
    getSchedulesByTeam,
    refreshSchedules
  }
}