import { useState, useCallback } from 'react'

export interface EnvironmentalLicense {
  id: string
  applicantName: string
  cpfCnpj: string
  licenseType: 'installation' | 'operation' | 'simplification' | 'environmental_authorization'
  activityType: string
  description: string
  location: string
  status: 'analysis' | 'approved' | 'denied' | 'expired' | 'suspended'
  applicationDate: string
  approvalDate?: string
  expirationDate?: string
  conditions: string[]
  documents: string[]
  environmentalImpact: 'low' | 'medium' | 'high'
  responsible: string
}

export interface CreateEnvironmentalLicenseData {
  applicantName: string
  cpfCnpj: string
  licenseType: 'installation' | 'operation' | 'simplification' | 'environmental_authorization'
  activityType: string
  description: string
  location: string
  environmentalImpact: 'low' | 'medium' | 'high'
  responsible: string
}

export interface EnvironmentalLicenseFilters {
  licenseType?: string
  status?: string
  environmentalImpact?: string
  responsible?: string
  search?: string
}

const mockLicenses: EnvironmentalLicense[] = [
  {
    id: '1',
    applicantName: 'Empresa ABC Ltda',
    cpfCnpj: '12.345.678/0001-90',
    licenseType: 'operation',
    activityType: 'Indústria Alimentícia',
    description: 'Licença para operação de fábrica de processamento de alimentos',
    location: 'Distrito Industrial',
    status: 'approved',
    applicationDate: '2023-10-15T10:00:00Z',
    approvalDate: '2023-12-01T15:30:00Z',
    expirationDate: '2025-12-01T15:30:00Z',
    conditions: ['Monitoramento mensal de efluentes', 'Relatório trimestral de emissões'],
    documents: ['eia_rima.pdf', 'plano_gestao_residuos.pdf'],
    environmentalImpact: 'medium',
    responsible: 'João Silva'
  }
]

export function useEnvironmentalLicenses() {
  const [licenses, setLicenses] = useState<EnvironmentalLicense[]>(mockLicenses)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchLicenses = useCallback(async (filters?: EnvironmentalLicenseFilters) => {
    setLoading(true)
    setError(null)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      setLicenses(mockLicenses)
    } catch (err) {
      setError('Erro ao carregar licenças ambientais')
    } finally {
      setLoading(false)
    }
  }, [])

  const createLicense = useCallback(async (data: CreateEnvironmentalLicenseData) => {
    setLoading(true)
    setError(null)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      const newLicense: EnvironmentalLicense = {
        ...data,
        id: Date.now().toString(),
        status: 'analysis',
        applicationDate: new Date().toISOString(),
        conditions: [],
        documents: []
      }
      setLicenses(prev => [newLicense, ...prev])
      return newLicense
    } catch (err) {
      setError('Erro ao criar licença ambiental')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const updateLicense = useCallback(async (id: string, data: Partial<EnvironmentalLicense>) => {
    setLoading(true)
    setError(null)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      setLicenses(prev =>
        prev.map(license =>
          license.id === id ? { ...license, ...data } : license
        )
      )
    } catch (err) {
      setError('Erro ao atualizar licença ambiental')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const deleteLicense = useCallback(async (id: string) => {
    setLoading(true)
    setError(null)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      setLicenses(prev => prev.filter(license => license.id !== id))
    } catch (err) {
      setError('Erro ao deletar licença ambiental')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    licenses,
    loading,
    error,
    fetchLicenses,
    createLicense,
    updateLicense,
    deleteLicense
  }
}