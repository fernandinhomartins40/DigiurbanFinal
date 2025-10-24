'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useCitizenAuth } from '@/contexts/CitizenAuthContext'
import { useToast } from '@/hooks/use-toast'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { LogIn, UserPlus, AlertCircle, User, CheckCircle, Search, MapPin } from 'lucide-react'
import Link from 'next/link'

interface Municipio {
  codigo_ibge?: string
  nome: string
  uf: string
  regiao?: string
  populacao?: number
  id?: string
  name?: string
  domain?: string
}

export default function CitizenLoginPage() {
  const router = useRouter()
  const { login, register, isLoading } = useCitizenAuth()
  const { toast } = useToast()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const [loginData, setLoginData] = useState({
    cpf: '',
    password: '',
  })

  const [registerData, setRegisterData] = useState({
    cpf: '',
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    municipio: '',
  })

  // Estados para busca de municípios
  const [municipioSearch, setMunicipioSearch] = useState('')
  const [municipios, setMunicipios] = useState<Municipio[]>([])
  const [showMunicipioDropdown, setShowMunicipioDropdown] = useState(false)
  const [selectedMunicipio, setSelectedMunicipio] = useState<Municipio | null>(null)
  const [loadingMunicipios, setLoadingMunicipios] = useState(false)
  const municipioRef = useRef<HTMLDivElement>(null)

  // Buscar municípios ao digitar
  useEffect(() => {
    const searchMunicipios = async () => {
      if (municipioSearch.length < 2) {
        setMunicipios([])
        return
      }

      setLoadingMunicipios(true)
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || '/api';
        const response = await fetch(
          `${apiUrl}/public/municipios-brasil?search=${encodeURIComponent(municipioSearch)}`
        )
        const data = await response.json()
        if (data.success) {
          setMunicipios(data.data.municipios || [])
        }
      } catch (error) {
        console.error('Erro ao buscar municípios:', error)
      } finally {
        setLoadingMunicipios(false)
      }
    }

    const debounce = setTimeout(searchMunicipios, 300)
    return () => clearTimeout(debounce)
  }, [municipioSearch])

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (municipioRef.current && !municipioRef.current.contains(event.target as Node)) {
        setShowMunicipioDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, '')
    if (numbers.length <= 11) {
      return numbers
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
    }
    return value
  }

  const handleSelectMunicipio = (municipio: Municipio) => {
    setSelectedMunicipio(municipio)
    setMunicipioSearch(`${municipio.nome} - ${municipio.uf}`)
    setShowMunicipioDropdown(false)
    setRegisterData({ ...registerData, municipio: municipio.codigo_ibge || municipio.id || '' })
  }

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    const cpfNumbers = loginData.cpf.replace(/\D/g, '')
    if (cpfNumbers.length !== 11) {
      setError('CPF inválido')
      return
    }

    if (!loginData.password) {
      setError('Digite sua senha')
      return
    }

    try {
      const loginSuccess = await login(cpfNumbers, loginData.password)

      if (loginSuccess) {
        toast({
          title: 'Login realizado com sucesso!',
          description: 'Redirecionando para o portal...',
        })
        router.push('/cidadao')
      } else {
        const errorMsg = 'CPF ou senha incorretos'
        setError(errorMsg)
        toast({
          variant: 'destructive',
          title: 'Erro no login',
          description: errorMsg,
        })
      }
    } catch (err) {
      const errorMsg = 'Erro ao fazer login. Tente novamente.'
      setError(errorMsg)
      toast({
        variant: 'destructive',
        title: 'Erro no login',
        description: errorMsg,
      })
    }
  }

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Validações
    const cpfNumbers = registerData.cpf.replace(/\D/g, '')
    if (cpfNumbers.length !== 11) {
      setError('CPF inválido')
      return
    }

    if (!registerData.name || !registerData.email) {
      setError('Preencha todos os campos obrigatórios')
      return
    }

    if (!selectedMunicipio) {
      setError('Selecione seu município')
      return
    }

    if (registerData.password !== registerData.confirmPassword) {
      setError('As senhas não conferem')
      return
    }

    if (registerData.password.length < 6) {
      setError('A senha deve ter no mínimo 6 caracteres')
      return
    }

    try {
      const payload: any = {
        cpf: cpfNumbers,
        name: registerData.name,
        email: registerData.email,
        phone: registerData.phone,
        password: registerData.password,
      }

      // Adicionar dados do município selecionado
      if (selectedMunicipio.codigo_ibge) {
        // Município brasileiro - criar tenant automaticamente
        payload.codigoIbge = selectedMunicipio.codigo_ibge
        payload.nomeMunicipio = selectedMunicipio.nome
        payload.ufMunicipio = selectedMunicipio.uf
      } else if (selectedMunicipio.id) {
        // Tenant já existente
        payload.municipioId = selectedMunicipio.id
      }

      const registerSuccess = await register(payload)

      if (registerSuccess) {
        setSuccess(true)
        toast({
          title: 'Cadastro criado com sucesso!',
          description: 'Bem-vindo ao Portal do Cidadão. Redirecionando...',
        })
        setTimeout(() => {
          router.push('/cidadao')
        }, 2000)
      } else {
        const errorMsg = 'Erro ao criar cadastro. Verifique se o CPF já não está cadastrado.'
        setError(errorMsg)
        toast({
          variant: 'destructive',
          title: 'Erro no cadastro',
          description: errorMsg,
        })
      }
    } catch (err) {
      const errorMsg = 'Erro ao criar cadastro. Tente novamente.'
      setError(errorMsg)
      toast({
        variant: 'destructive',
        title: 'Erro no cadastro',
        description: errorMsg,
      })
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <CheckCircle className="h-16 w-16 text-green-600 mx-auto" />
              <h2 className="text-2xl font-bold text-green-900">Cadastro Realizado!</h2>
              <p className="text-gray-600">
                Seu cadastro foi criado com sucesso. Você será redirecionado para o portal.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <User className="h-12 w-12 text-blue-600" />
          </div>
          <CardTitle className="text-2xl">Portal do Cidadão</CardTitle>
          <CardDescription>
            Acesse ou crie sua conta para utilizar os serviços municipais
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">
                <LogIn className="h-4 w-4 mr-2" />
                Entrar
              </TabsTrigger>
              <TabsTrigger value="register">
                <UserPlus className="h-4 w-4 mr-2" />
                Cadastrar
              </TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="mt-6">
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center text-red-800">
                    <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                    <span className="text-sm">{error}</span>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="login-cpf">CPF</Label>
                  <Input
                    id="login-cpf"
                    placeholder="000.000.000-00"
                    value={loginData.cpf}
                    onChange={(e) => setLoginData({ ...loginData, cpf: formatCPF(e.target.value) })}
                    maxLength={14}
                    required
                    autoFocus
                  />
                  <p className="text-xs text-gray-500">
                    Digite seu CPF cadastrado
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="login-password">Senha</Label>
                  <Input
                    id="login-password"
                    type="password"
                    placeholder="Digite sua senha"
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    required
                  />
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Entrando...' : 'Entrar'}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="register" className="mt-6">
              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-start gap-2">
                  <MapPin className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-1">Selecione seu município</p>
                    <p className="text-blue-700">
                      Caso seu município ainda não utilize o DigiUrban, ele será cadastrado automaticamente após seu registro.
                    </p>
                  </div>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center text-red-800">
                    <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                    <span className="text-sm">{error}</span>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="register-cpf">CPF *</Label>
                  <Input
                    id="register-cpf"
                    placeholder="000.000.000-00"
                    value={registerData.cpf}
                    onChange={(e) => setRegisterData({ ...registerData, cpf: formatCPF(e.target.value) })}
                    maxLength={14}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="register-name">Nome Completo *</Label>
                  <Input
                    id="register-name"
                    placeholder="Seu nome completo"
                    value={registerData.name}
                    onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="register-email">E-mail *</Label>
                  <Input
                    id="register-email"
                    type="email"
                    placeholder="seu@email.com"
                    value={registerData.email}
                    onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="register-phone">Telefone</Label>
                  <Input
                    id="register-phone"
                    placeholder="(00) 00000-0000"
                    value={registerData.phone}
                    onChange={(e) => setRegisterData({ ...registerData, phone: e.target.value })}
                  />
                </div>

                <div className="space-y-2" ref={municipioRef}>
                  <Label htmlFor="register-municipio">Município *</Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MapPin className="h-4 w-4 text-gray-400" />
                    </div>
                    <Input
                      id="register-municipio"
                      placeholder="Digite o nome da sua cidade..."
                      value={municipioSearch}
                      onChange={(e) => {
                        setMunicipioSearch(e.target.value)
                        setShowMunicipioDropdown(true)
                      }}
                      onFocus={() => setShowMunicipioDropdown(true)}
                      className="pl-10"
                      required
                      autoComplete="off"
                    />
                    {loadingMunicipios && (
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                        <div className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full" />
                      </div>
                    )}
                  </div>

                  {showMunicipioDropdown && municipios.length > 0 && (
                    <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {municipios.map((municipio, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => handleSelectMunicipio(municipio)}
                          className="w-full px-4 py-3 text-left hover:bg-blue-50 border-b border-gray-100 last:border-0 transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-medium text-gray-900">
                                {municipio.nome}
                              </div>
                              <div className="text-sm text-gray-500">
                                {municipio.uf} • {municipio.regiao}
                                {municipio.populacao && (
                                  <> • {municipio.populacao.toLocaleString('pt-BR')} habitantes</>
                                )}
                              </div>
                            </div>
                            <MapPin className="h-4 w-4 text-blue-600" />
                          </div>
                        </button>
                      ))}
                    </div>
                  )}

                  {showMunicipioDropdown && municipioSearch.length >= 2 && municipios.length === 0 && !loadingMunicipios && (
                    <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg p-4">
                      <p className="text-sm text-gray-500 text-center">
                        Nenhum município encontrado
                      </p>
                    </div>
                  )}

                  {selectedMunicipio && (
                    <div className="flex items-center gap-2 mt-2 p-2 bg-blue-50 border border-blue-200 rounded-md">
                      <MapPin className="h-4 w-4 text-blue-600 flex-shrink-0" />
                      <div className="text-sm">
                        <span className="font-medium text-blue-900">
                          {selectedMunicipio.nome} - {selectedMunicipio.uf}
                        </span>
                        {selectedMunicipio.codigo_ibge && (
                          <span className="text-blue-600 ml-2">
                            (Será criado automaticamente)
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="register-password">Senha *</Label>
                  <Input
                    id="register-password"
                    type="password"
                    placeholder="Mínimo 6 caracteres"
                    value={registerData.password}
                    onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="register-confirm">Confirmar Senha *</Label>
                  <Input
                    id="register-confirm"
                    type="password"
                    placeholder="Digite a senha novamente"
                    value={registerData.confirmPassword}
                    onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                    required
                  />
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Criando cadastro...' : 'Criar Cadastro'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <div className="mt-6 pt-4 border-t border-gray-200 text-center">
            <Link
              href="/login"
              className="text-sm text-gray-600 hover:text-gray-900 hover:underline"
            >
              Acessar área administrativa
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
