'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAdminAuth } from '@/contexts/AdminAuthContext'

// Types
interface Attendance {
  id: string
  studentId: string
  classId: string
  date: string
  status: 'PRESENT' | 'ABSENT' | 'LATE' | 'JUSTIFIED'
  justification?: string
  lateMinutes?: number
  markedBy: string
  markedAt: string
  student?: {
    id: string
    name: string
    registrationNumber: string
  }
  class?: {
    id: string
    name: string
    grade: string
  }
  createdAt: string
  updatedAt: string
}

interface MarkAttendanceData {
  studentId: string
  classId: string
  date: string
  status: 'PRESENT' | 'ABSENT' | 'LATE' | 'JUSTIFIED'
  justification?: string
  lateMinutes?: number
}

interface BulkAttendanceData {
  classId: string
  date: string
  attendances: {
    studentId: string
    status: 'PRESENT' | 'ABSENT' | 'LATE' | 'JUSTIFIED'
    justification?: string
    lateMinutes?: number
  }[]
}

interface AttendanceFilters {
  studentId?: string
  classId?: string
  dateFrom?: string
  dateTo?: string
  status?: 'PRESENT' | 'ABSENT' | 'LATE' | 'JUSTIFIED'
}

interface AttendanceStats {
  totalDays: number
  presentDays: number
  absentDays: number
  lateDays: number
  justifiedDays: number
  attendanceRate: number
}

interface UseAttendanceReturn {
  attendances: Attendance[]
  loading: boolean
  error: string | null
  markAttendance: (data: MarkAttendanceData) => Promise<Attendance>
  markBulkAttendance: (data: BulkAttendanceData) => Promise<Attendance[]>
  updateAttendance: (id: string, data: Partial<MarkAttendanceData>) => Promise<Attendance>
  deleteAttendance: (id: string) => Promise<void>
  getAttendanceById: (id: string) => Attendance | undefined
  getAttendancesByStudent: (studentId: string) => Attendance[]
  getAttendancesByClass: (classId: string, date?: string) => Attendance[]
  getAttendanceStats: (studentId: string, dateFrom?: string, dateTo?: string) => AttendanceStats
  refreshAttendances: (filters?: AttendanceFilters) => Promise<void>
}

export function useAttendance(initialFilters?: AttendanceFilters): UseAttendanceReturn {
  const [attendances, setAttendances] = useState<Attendance[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchAttendances = useCallback(async (filters?: AttendanceFilters) => {
    try {
      setLoading(true)
      setError(null)

      const queryParams = new URLSearchParams()
      if (filters?.studentId) queryParams.append('studentId', filters.studentId)
      if (filters?.classId) queryParams.append('classId', filters.classId)
      if (filters?.dateFrom) queryParams.append('dateFrom', filters.dateFrom)
      if (filters?.dateTo) queryParams.append('dateTo', filters.dateTo)
      if (filters?.status) queryParams.append('status', filters.status)

      const query = queryParams.toString()
      const endpoint = `/api/secretarias/education/attendance${query ? `?${query}` : ''}`

      const data = await apiClient.get(endpoint)
      setAttendances(data.attendances || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar frequência')
    } finally {
      setLoading(false)
    }
  }, [])

  const markAttendance = useCallback(async (data: MarkAttendanceData): Promise<Attendance> => {
    try {
      setError(null)
      const response = await apiClient.post('/api/secretarias/education/attendance', data)
      const newAttendance = response.attendance
      setAttendances(prev => {
        // Remove existing attendance for same student/class/date if exists
        const filtered = prev.filter(att =>
          !(att.studentId === data.studentId && att.classId === data.classId && att.date === data.date)
        )
        return [newAttendance, ...filtered]
      })
      return newAttendance
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao registrar frequência'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const markBulkAttendance = useCallback(async (data: BulkAttendanceData): Promise<Attendance[]> => {
    try {
      setError(null)
      const response = await apiClient.post('/api/secretarias/education/attendance/bulk', data)
      const newAttendances = response.attendances
      setAttendances(prev => {
        // Remove existing attendances for same class/date if exists
        const filtered = prev.filter(att =>
          !(att.classId === data.classId && att.date === data.date)
        )
        return [...newAttendances, ...filtered]
      })
      return newAttendances
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao registrar frequência em lote'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const updateAttendance = useCallback(async (id: string, data: Partial<MarkAttendanceData>): Promise<Attendance> => {
    try {
      setError(null)
      const response = await apiClient.put(`/api/secretarias/education/attendance/${id}`, data)
      const updatedAttendance = response.attendance
      setAttendances(prev => prev.map(attendance =>
        attendance.id === id ? updatedAttendance : attendance
      ))
      return updatedAttendance
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar frequência'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const deleteAttendance = useCallback(async (id: string): Promise<void> => {
    try {
      setError(null)
      await apiClient.delete(`/api/secretarias/education/attendance/${id}`)
      setAttendances(prev => prev.filter(attendance => attendance.id !== id))
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao excluir frequência'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  const getAttendanceById = useCallback((id: string): Attendance | undefined => {
    return attendances.find(attendance => attendance.id === id)
  }, [attendances])

  const getAttendancesByStudent = useCallback((studentId: string): Attendance[] => {
    return attendances.filter(attendance => attendance.studentId === studentId)
  }, [attendances])

  const getAttendancesByClass = useCallback((classId: string, date?: string): Attendance[] => {
    return attendances.filter(attendance =>
      attendance.classId === classId && (!date || attendance.date === date)
    )
  }, [attendances])

  const getAttendanceStats = useCallback((studentId: string, dateFrom?: string, dateTo?: string): AttendanceStats => {
    const studentAttendances = attendances.filter(att => {
      const matchesStudent = att.studentId === studentId
      const matchesDateRange = (!dateFrom || att.date >= dateFrom) && (!dateTo || att.date <= dateTo)
      return matchesStudent && matchesDateRange
    })

    const totalDays = studentAttendances.length
    const presentDays = studentAttendances.filter(att => att.status === 'PRESENT').length
    const absentDays = studentAttendances.filter(att => att.status === 'ABSENT').length
    const lateDays = studentAttendances.filter(att => att.status === 'LATE').length
    const justifiedDays = studentAttendances.filter(att => att.status === 'JUSTIFIED').length
    const attendanceRate = totalDays > 0 ? (presentDays + lateDays + justifiedDays) / totalDays * 100 : 0

    return {
      totalDays,
      presentDays,
      absentDays,
      lateDays,
      justifiedDays,
      attendanceRate
    }
  }, [attendances])

  const refreshAttendances = useCallback(async (filters?: AttendanceFilters) => {
    await fetchAttendances(filters)
  }, [fetchAttendances])

  useEffect(() => {
    fetchAttendances(initialFilters)
  }, [fetchAttendances, initialFilters])

  return {
    attendances,
    loading,
    error,
    markAttendance,
    markBulkAttendance,
    updateAttendance,
    deleteAttendance,
    getAttendanceById,
    getAttendancesByStudent,
    getAttendancesByClass,
    getAttendanceStats,
    refreshAttendances
  }
}