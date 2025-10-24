'use client'

import { useState } from 'react'
import { useAuth } from '@/lib/auth'
import { Button } from '@/components/ui/button'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const { login } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      await login(email, password)
      // Redirect will be handled by the auth context or the calling component
      window.location.href = '/admin'
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao fazer login')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-primary mb-2">DigiUrban</h1>
          <h2 className="text-2xl font-semibold mb-2">Login</h2>
          <p className="text-muted-foreground">
            Acesse o sistema de gestão municipal
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                placeholder="seu@email.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2">
                Senha
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                placeholder="Sua senha"
              />
            </div>
          </div>

          {error && (
            <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-md">
              <p className="text-sm">{error}</p>
            </div>
          )}

          <div>
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Entrando...
                </div>
              ) : (
                'Entrar'
              )}
            </Button>
          </div>

          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Esqueceu sua senha?{' '}
              <a href="#" className="text-primary hover:underline">
                Clique aqui
              </a>
            </p>
          </div>
        </form>

        <div className="mt-8 pt-8 border-t border-border">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-4">Acesso Público</h3>
            <div className="space-y-2">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => window.location.href = '/cidadao'}
              >
                Portal do Cidadão
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => window.location.href = '/'}
              >
                Página Inicial
              </Button>
            </div>
          </div>
        </div>

        <div className="text-center">
          <p className="text-xs text-muted-foreground">
            © 2024 DigiUrban - Sistema de Gestão Municipal
          </p>
        </div>
      </div>
    </div>
  )
}