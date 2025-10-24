import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface User {
  id: string
  email: string
  name: string
  role: string
  tenantId: string
}

interface AdminAuthState {
  user: User | null
  loading: boolean
  error: string | null
}

export function useAdminAuth() {
  const [state, setState] = useState<AdminAuthState>({
    user: null,
    loading: true,
    error: null
  })

  const router = useRouter()

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('digiurban_admin_token')

      if (!token) {
        setState(prev => ({ ...prev, loading: false }))
        return
      }

      const response = await fetch('/api/admin/auth/verify', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const userData = await response.json()
        setState(prev => ({
          ...prev,
          user: userData.user,
          loading: false
        }))
      } else {
        localStorage.removeItem('digiurban_admin_token')
        setState(prev => ({
          ...prev,
          loading: false,
          error: 'Token inválido'
        }))
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: 'Erro ao verificar autenticação'
      }))
    }
  }

  const login = async (email: string, password: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }))

    try {
      const response = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      })

      const data = await response.json()

      if (response.ok) {
        localStorage.setItem('digiurban_admin_token', data.token)
        setState(prev => ({
          ...prev,
          user: data.user,
          loading: false
        }))
        router.push('/admin/dashboard')
      } else {
        setState(prev => ({
          ...prev,
          loading: false,
          error: data.message || 'Erro ao fazer login'
        }))
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: 'Erro ao fazer login'
      }))
    }
  }

  const logout = () => {
    localStorage.removeItem('digiurban_admin_token')
    setState({
      user: null,
      loading: false,
      error: null
    })
    router.push('/admin/login')
  }

  const hasRole = (requiredRole: string) => {
    if (!state.user) return false

    const roleHierarchy = {
      'SUPER_ADMIN': 5,
      'ADMIN': 4,
      'MANAGER': 3,
      'COORDINATOR': 2,
      'USER': 1
    }

    const userLevel = roleHierarchy[state.user.role as keyof typeof roleHierarchy] || 0
    const requiredLevel = roleHierarchy[requiredRole as keyof typeof roleHierarchy] || 0

    return userLevel >= requiredLevel
  }

  return {
    ...state,
    login,
    logout,
    checkAuth,
    hasRole,
    isAuthenticated: !!state.user
  }
}