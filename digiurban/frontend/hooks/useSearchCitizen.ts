'use client'

import { useState } from 'react'
import { useAdminAuth } from '@/contexts/AdminAuthContext'

export interface Citizen {
  id: string
  name: string
  cpf: string
  email: string
  phone: string
  address?: any
  isActive: boolean
  createdAt?: string
  lastLogin?: string
}

export function useSearchCitizen() {
  const { tenantId } = useAdminAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const searchByCPF = async (cpf: string): Promise<Citizen | null> => {
    if (!cpf || cpf.length < 11) {
      throw new Error('CPF inválido')
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch(
        `/api/citizens/search?cpf=${encodeURIComponent(cpf)}`,
        {
          headers: {
            'X-Tenant-ID': tenantId || '',
          },
        }
      )

      if (!response.ok) {
        if (response.status === 404) {
          return null
        }
        throw new Error('Erro ao buscar cidadão')
      }

      const data = await response.json()
      return data.citizen || null
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const createCitizen = async (citizenData: Partial<Citizen>): Promise<Citizen> => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/citizens', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Tenant-ID': tenantId || '',
        },
        body: JSON.stringify(citizenData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Erro ao criar cidadão')
      }

      const data = await response.json()
      return data.citizen
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return {
    searchByCPF,
    createCitizen,
    loading,
    error,
  }
}
