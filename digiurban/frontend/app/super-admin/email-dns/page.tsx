'use client'

import React, { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  Mail,
  Server,
  Globe,
  Shield,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Copy,
  Settings,
  BarChart3,
  Users,
  Clock
} from 'lucide-react'
import { toast } from '@/hooks/use-toast'

interface DNSRecord {
  type: 'MX' | 'A' | 'TXT' | 'CNAME'
  name: string
  value: string
  priority?: number
  ttl: number
  description?: string
}

interface EmailDomain {
  id: string
  domainName: string
  isVerified: boolean
  dkimEnabled: boolean
  spfEnabled: boolean
  dmarcEnabled: boolean
  createdAt: string
  dnsRecords: DNSRecord[]
  dnsStatus?: Record<string, { configured: boolean; error?: string }>
}

interface EmailServer {
  id: string
  hostname: string
  isActive: boolean
}

interface Tenant {
  id: string
  name: string
  domain?: string
  plan: string
  emailServer?: EmailServer & {
    domainsCount: number
    usersCount: number
    emailsCount: number
    domains: EmailDomain[]
  }
}

export default function EmailDNSManagement() {
  const [tenants, setTenants] = useState<Tenant[]>([])
  const [selectedTenant, setSelectedTenant] = useState<string>('')
  const [selectedTenantData, setSelectedTenantData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [regenerateDialog, setRegenerateDialog] = useState(false)
  const [verifyingAll, setVerifyingAll] = useState(false)
  const [stats, setStats] = useState<any>(null)

  useEffect(() => {
    loadTenants()
    loadGlobalStats()
  }, [])

  useEffect(() => {
    if (selectedTenant) {
      loadTenantDNS(selectedTenant)
    }
  }, [selectedTenant])

  const loadTenants = async () => {
    try {
      const response = await fetch('/api/super-admin/email-dns')
      const data = await response.json()
      setTenants(data)
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Falha ao carregar tenants com serviço de email',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const loadTenantDNS = async (tenantId: string) => {
    try {
      const response = await fetch(`/api/super-admin/email-dns/${tenantId}`)
      const data = await response.json()
      setSelectedTenantData(data)
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Falha ao carregar configuração DNS',
        variant: 'destructive'
      })
    }
  }

  const loadGlobalStats = async () => {
    try {
      const response = await fetch('/api/super-admin/email-dns/global-stats')
      const data = await response.json()
      setStats(data)
    } catch (error) {
      console.error('Error loading global stats:', error)
    }
  }

  const regenerateDNS = async () => {
    if (!selectedTenant) return

    try {
      const response = await fetch(`/api/super-admin/email-dns/${selectedTenant}/generate`, {
        method: 'POST'
      })

      if (response.ok) {
        toast({
          title: 'Sucesso',
          description: 'Registros DNS regenerados com sucesso'
        })
        await loadTenantDNS(selectedTenant)
      } else {
        throw new Error('Falha na regeneração')
      }
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Falha ao regenerar registros DNS',
        variant: 'destructive'
      })
    } finally {
      setRegenerateDialog(false)
    }
  }

  const verifyAllDomains = async () => {
    if (!selectedTenant) return

    setVerifyingAll(true)
    try {
      const response = await fetch(`/api/super-admin/email-dns/${selectedTenant}/verify-all`, {
        method: 'POST'
      })

      const result = await response.json()

      if (response.ok) {
        toast({
          title: 'Verificação Concluída',
          description: result.message
        })
        await loadTenantDNS(selectedTenant)
        await loadTenants()
      } else {
        throw new Error('Falha na verificação')
      }
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Falha ao verificar domínios',
        variant: 'destructive'
      })
    } finally {
      setVerifyingAll(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: 'Copiado',
        description: 'Texto copiado para a área de transferência'
      })
    })
  }

  const getStatusColor = (status: boolean | undefined) => {
    if (status === undefined) return 'text-gray-500'
    return status ? 'text-green-600' : 'text-red-600'
  }

  const getStatusIcon = (status: boolean | undefined) => {
    if (status === undefined) return <Clock className="h-4 w-4" />
    return status ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex items-center space-x-2">
          <RefreshCw className="h-6 w-6 animate-spin" />
          <span>Carregando configurações DNS...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Mail className="h-6 w-6" />
            Gerenciamento DNS - Email
          </h1>
          <p className="text-muted-foreground">
            Configure e monitore DNS de serviços de email para todos os tenants
          </p>
        </div>

        <Select value={selectedTenant} onValueChange={setSelectedTenant}>
          <SelectTrigger className="w-80">
            <SelectValue placeholder="Selecionar Prefeitura" />
          </SelectTrigger>
          <SelectContent>
            {tenants.map((tenant) => (
              <SelectItem key={tenant.id} value={tenant.id}>
                <div className="flex items-center justify-between w-full">
                  <span>{tenant.name}</span>
                  <Badge variant={tenant.emailServer?.isActive ? 'default' : 'secondary'}>
                    {tenant.plan}
                  </Badge>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Stats Globais */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Serviços Ativos</p>
                <p className="text-2xl font-bold">{stats.overview.activeEmailServices}</p>
              </div>
              <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                <Server className="h-4 w-4 text-blue-600" />
              </div>
            </div>
            <div className="mt-2">
              <span className="text-xs text-muted-foreground">
                {stats.overview.emailServiceAdoption} de adoção
              </span>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Domínios Verificados</p>
                <p className="text-2xl font-bold">{stats.domains.verified}</p>
              </div>
              <div className="w-8 h-8 bg-green-100 rounded flex items-center justify-center">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
              </div>
            </div>
            <div className="mt-2">
              <span className="text-xs text-muted-foreground">
                {stats.domains.verificationRate} taxa de verificação
              </span>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Emails Este Mês</p>
                <p className="text-2xl font-bold">{stats.emails.thisMonth.toLocaleString()}</p>
              </div>
              <div className="w-8 h-8 bg-purple-100 rounded flex items-center justify-center">
                <BarChart3 className="h-4 w-4 text-purple-600" />
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total de Emails</p>
                <p className="text-2xl font-bold">{stats.emails.totalAllTime.toLocaleString()}</p>
              </div>
              <div className="w-8 h-8 bg-orange-100 rounded flex items-center justify-center">
                <Mail className="h-4 w-4 text-orange-600" />
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Configuração DNS do Tenant Selecionado */}
      {selectedTenant && selectedTenantData && (
        <Card className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Configuração DNS - {selectedTenantData.tenant.name}
              </h2>
              <p className="text-sm text-muted-foreground">
                Servidor: {selectedTenantData.emailServer.hostname}
              </p>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={verifyAllDomains}
                disabled={verifyingAll}
                variant="outline"
              >
                {verifyingAll ? (
                  <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Shield className="h-4 w-4 mr-2" />
                )}
                Verificar DNS
              </Button>

              <Button
                onClick={() => setRegenerateDialog(true)}
                variant="outline"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Regenerar DNS
              </Button>
            </div>
          </div>

          {/* Lista de Domínios */}
          <div className="space-y-4">
            {selectedTenantData.domains.map((domain: EmailDomain) => (
              <Card key={domain.id} className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">{domain.domainName}</h3>
                    <Badge variant={domain.isVerified ? 'default' : 'secondary'}>
                      {domain.isVerified ? 'Verificado' : 'Pendente'}
                    </Badge>
                    {domain.dkimEnabled && (
                      <Badge variant="outline">DKIM</Badge>
                    )}
                    {domain.spfEnabled && (
                      <Badge variant="outline">SPF</Badge>
                    )}
                  </div>

                  <p className="text-sm text-muted-foreground">
                    Adicionado em {new Date(domain.createdAt).toLocaleDateString('pt-BR')}
                  </p>
                </div>

                {/* Registros DNS */}
                <div className="bg-muted/50 rounded-lg p-4">
                  <h4 className="font-semibold mb-3 text-sm">Registros DNS Necessários</h4>

                  <div className="space-y-3">
                    {domain.dnsRecords.map((record, index) => (
                      <div key={index} className="border rounded p-3 bg-background">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3">
                              <Badge variant="secondary" className="font-mono text-xs">
                                {record.type}
                              </Badge>
                              <code className="text-sm">{record.name}</code>
                              {record.priority && (
                                <span className="text-xs text-muted-foreground">
                                  Prioridade: {record.priority}
                                </span>
                              )}
                            </div>
                            <div className="mt-2 pl-16">
                              <code className="text-sm text-muted-foreground break-all">
                                {record.value}
                              </code>
                            </div>
                            {record.description && (
                              <p className="text-xs text-muted-foreground mt-1 pl-16">
                                {record.description}
                              </p>
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            {domain.dnsStatus && domain.dnsStatus[`${record.type}-${record.name}`] && (
                              <div className={`flex items-center gap-1 ${getStatusColor(domain.dnsStatus[`${record.type}-${record.name}`].configured)}`}>
                                {getStatusIcon(domain.dnsStatus[`${record.type}-${record.name}`].configured)}
                                <span className="text-xs">
                                  {domain.dnsStatus[`${record.type}-${record.name}`].configured ? 'OK' : 'Não configurado'}
                                </span>
                              </div>
                            )}

                            <Button
                              onClick={() => copyToClipboard(record.value)}
                              size="sm"
                              variant="ghost"
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Instruções */}
                <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold mb-2 text-blue-900 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    Instruções de Configuração
                  </h4>
                  <ol className="list-decimal list-inside space-y-2 text-sm text-blue-800">
                    <li>Acesse o painel DNS do provedor de domínio</li>
                    <li>Adicione cada registro DNS listado acima</li>
                    <li>Aguarde a propagação DNS (até 48 horas)</li>
                    <li>Execute a verificação para validar as configurações</li>
                    <li>O servidor será ativado automaticamente após verificação</li>
                  </ol>
                </div>
              </Card>
            ))}
          </div>
        </Card>
      )}

      {/* Lista de Tenants */}
      {!selectedTenant && (
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Serviços de Email Ativos</h2>

          <div className="space-y-4">
            {tenants.map((tenant) => (
              <Card key={tenant.id} className="p-4 hover:bg-muted/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold">{tenant.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {tenant.domain || 'Sem domínio personalizado'}
                    </p>
                  </div>

                  {tenant.emailServer && (
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Globe className="h-4 w-4" />
                        <span>{tenant.emailServer.domainsCount} domínios</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>{tenant.emailServer.usersCount} usuários</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Mail className="h-4 w-4" />
                        <span>{tenant.emailServer.emailsCount} emails</span>
                      </div>
                      <Badge variant={tenant.emailServer.isActive ? 'default' : 'secondary'}>
                        {tenant.emailServer.isActive ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </div>
                  )}

                  <Button
                    onClick={() => setSelectedTenant(tenant.id)}
                    size="sm"
                    variant="outline"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Gerenciar
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </Card>
      )}

      {/* Dialog de Confirmação para Regenerar */}
      <AlertDialog open={regenerateDialog} onOpenChange={setRegenerateDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Regenerar Registros DNS</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação irá regenerar todas as chaves DKIM e tokens de verificação para este tenant.
              Os domínios precisarão ser reconfigurados e verificados novamente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={regenerateDNS}>
              Regenerar DNS
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}