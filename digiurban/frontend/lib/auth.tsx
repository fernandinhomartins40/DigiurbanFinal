'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'

// Types
interface User {
  id: string
  email: string
  name: string
  role: 'GUEST' | 'USER' | 'COORDINATOR' | 'MANAGER' | 'ADMIN' | 'SUPER_ADMIN'
  department?: {
    id: string
    name: string
  }
  tenant: {
    id: string
    name: string
  }
}

interface AuthContextType {
  user: User | null
  token: string | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  loading: boolean
}

// Context
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Provider Component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

  useEffect(() => {
    // Check for existing token on mount
    const savedToken = localStorage.getItem('digiurban_admin_token')
    if (savedToken) {
      validateToken(savedToken)
    } else {
      setLoading(false)
    }
  }, [])

  const validateToken = async (tokenToValidate: string) => {
    try {
      const response = await fetch(`${apiUrl}/api/auth/me`, {
        headers: {
          'Authorization': `Bearer ${tokenToValidate}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
        setToken(tokenToValidate)
        localStorage.setItem('digiurban_admin_token', tokenToValidate)
      } else {
        // Token invalid, remove it
        localStorage.removeItem('digiurban_admin_token')
        setToken(null)
        setUser(null)
      }
    } catch (error) {
      console.error('Token validation error:', error)
      localStorage.removeItem('digiurban_admin_token')
      setToken(null)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    try {
      setLoading(true)

      const response = await fetch(`${apiUrl}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Erro ao fazer login')
      }

      const data = await response.json()

      setUser(data.user)
      setToken(data.token)
      localStorage.setItem('digiurban_admin_token', data.token)

    } catch (error) {
      console.error('Login error:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('digiurban_admin_token')
  }

  const value = {
    user,
    token,
    login,
    logout,
    loading
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

// Hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Higher-order component for protected routes
export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  allowedRoles?: Array<User['role']>
) {
  return function AuthenticatedComponent(props: P) {
    const { user, loading } = useAuth()

    if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Carregando...</p>
          </div>
        </div>
      )
    }

    if (!user) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Acesso Restrito</h2>
            <p className="text-muted-foreground mb-4">
              Você precisa estar logado para acessar esta página.
            </p>
            <button
              onClick={() => window.location.href = '/login'}
              className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90"
            >
              Fazer Login
            </button>
          </div>
        </div>
      )
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Acesso Negado</h2>
            <p className="text-muted-foreground mb-4">
              Você não tem permissão para acessar esta página.
            </p>
            <button
              onClick={() => window.history.back()}
              className="bg-secondary text-secondary-foreground px-4 py-2 rounded-md hover:bg-secondary/80"
            >
              Voltar
            </button>
          </div>
        </div>
      )
    }

    return <Component {...props} />
  }
}

// API client with auth
export class ApiClient {
  private baseUrl: string
  private getToken: () => string | null

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
    this.getToken = () => localStorage.getItem('digiurban_admin_token')
  }

  async request(endpoint: string, options: RequestInit = {}) {
    const token = this.getToken()

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>)
    }

    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers
    })

    if (response.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('digiurban_admin_token')
      window.location.href = '/login'
      throw new Error('Sessão expirada')
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Erro desconhecido' }))
      throw new Error(errorData.message || 'Erro na requisição')
    }

    return response.json()
  }

  // Convenience methods
  get(endpoint: string) {
    return this.request(endpoint)
  }

  post(endpoint: string, data: any) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data)
    })
  }

  put(endpoint: string, data: any) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data)
    })
  }

  delete(endpoint: string) {
    return this.request(endpoint, {
      method: 'DELETE'
    })
  }
}

export const apiClient = new ApiClient()