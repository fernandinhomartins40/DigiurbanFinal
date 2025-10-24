'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'

export interface SuperAdminUser {
  id: string
  name: string
  email: string
  role: 'SUPER_ADMIN'
  isActive: boolean
  createdAt: string
  lastLogin?: string
}

export interface SuperAdminStats {
  totalTenants: number
  activeTenants: number
  totalUsers: number
  totalRevenue: number
  activeSubscriptions: number
  pendingOnboarding: number
}

interface SuperAdminAuthContextType {
  user: SuperAdminUser | null
  stats: SuperAdminStats | null
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  loading: boolean
  error: string | null
  refreshUser: () => Promise<void>
  apiRequest: (endpoint: string, options?: RequestInit) => Promise<any>
}

const SuperAdminAuthContext = createContext<SuperAdminAuthContextType | undefined>(undefined)

interface SuperAdminAuthProviderProps {
  children: ReactNode
}

export function SuperAdminAuthProvider({ children }: SuperAdminAuthProviderProps) {
  const [user, setUser] = useState<SuperAdminUser | null>(null)
  const [stats, setStats] = useState<SuperAdminStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isRedirecting, setIsRedirecting] = useState(false)
  const router = useRouter()

  // ⚠️ NOTA: Não podemos verificar cookies httpOnly via JavaScript
  // O cookie existe, mas é inacessível por document.cookie (por segurança)
  // Vamos confiar na requisição /auth/me para validar a autenticação

  // ✅ SEGURANÇA: Função para fazer requisições autenticadas (usa cookies automáticos)
  const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
    console.log('[SuperAdminAuthContext] apiRequest chamado')
    console.log('[SuperAdminAuthContext] Endpoint:', endpoint)

    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    }

    console.log('[SuperAdminAuthContext] Headers que serão enviados:', headers)

    // Usar getFullApiUrl para construir URL correta
    const { getFullApiUrl } = await import('@/lib/api-config')
    // Remove /api do endpoint se já estiver presente pois getFullApiUrl já adiciona
    const cleanEndpoint = endpoint.replace(/^\/api/, '')
    const url = getFullApiUrl(cleanEndpoint)

    console.log('[SuperAdminAuthContext] URL final:', url)

    const response = await fetch(url, {
      ...options,
      headers,
      credentials: 'include', // ✅ CRÍTICO: Enviar cookies automaticamente
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Erro desconhecido', code: null }))

      // Se token expirado ou inválido (401), limpar autenticação
      if (response.status === 401) {
        console.log('[SuperAuth] Token inválido ou expirado, limpando autenticação...')
        setUser(null)
        setStats(null)

        // Redirecionar apenas se não estiver na página de login e não estiver já redirecionando
        if (
          typeof window !== 'undefined' &&
          !window.location.pathname.includes('/login') &&
          !isRedirecting
        ) {
          setIsRedirecting(true)
          console.log('[SuperAuth] Redirecionando para login...')
          setTimeout(() => {
            window.location.href = '/super-admin/login'
          }, 100)
        }
      }

      throw new Error(errorData.error || 'Erro na requisição')
    }

    return response.json()
  }

  // Função de login
  const login = async (email: string, password: string) => {
    try {
      setLoading(true)
      setError(null)
      setIsRedirecting(false)

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || '/api';

      const response = await fetch(`${apiUrl}/super-admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include', // ✅ CRÍTICO: Receber cookies
        body: JSON.stringify({ email, password })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erro no login')
      }

      const data = await response.json()

      // ✅ SEGURANÇA: Token agora vem em cookie httpOnly, não em JSON
      // Atualizar estado
      setUser(data.user)

      // Buscar estatísticas
      await refreshUserData()

      router.push('/super-admin/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro no login')
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Função de logout
  const logout = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || '/api';

      // ✅ SEGURANÇA: Chamar endpoint de logout para limpar cookie httpOnly
      await fetch(`${apiUrl}/super-admin/logout`, {
        method: 'POST',
        credentials: 'include',
      }).catch(() => {
        // Ignorar erro - vamos limpar localmente de qualquer forma
      });
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    } finally {
      setUser(null)
      setStats(null)
      router.push('/super-admin/login')
    }
  }

  // Função para atualizar dados do usuário
  const refreshUserData = async () => {
    try {
      const response = await apiRequest('/super-admin/auth/me')
      setUser(response.user)
      setStats(response.stats || null)
    } catch (err) {
      // Silenciar erro 401 (já tratado no apiRequest)
      if (err instanceof Error && !err.message.includes('Authentication failed')) {
        console.error('Erro ao atualizar dados do super admin:', err)
      }
    }
  }

  // Função para verificar autenticação ao carregar
  const checkAuth = async () => {
    try {
      // ✅ Tentar carregar dados do usuário (o cookie httpOnly será enviado automaticamente)
      await refreshUserData()
    } catch (err) {
      console.error('Erro na verificação de autenticação super admin:', err)
      // Erro 401 já é tratado no apiRequest, que limpa o estado
    } finally {
      setLoading(false)
    }
  }

  // Hook para verificar autenticação ao montar o componente
  useEffect(() => {
    checkAuth()
  }, [])

  const value: SuperAdminAuthContextType = {
    user,
    stats,
    login,
    apiRequest,
    logout,
    loading,
    error,
    refreshUser: refreshUserData
  }

  return (
    <SuperAdminAuthContext.Provider value={value}>
      {children}
    </SuperAdminAuthContext.Provider>
  )
}

// Hook personalizado para usar o contexto
export function useSuperAdminAuth() {
  const context = useContext(SuperAdminAuthContext)
  if (context === undefined) {
    throw new Error('useSuperAdminAuth deve ser usado dentro de um SuperAdminAuthProvider')
  }
  return context
}
