'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Shield, Server, Users, Globe, BarChart3, AlertTriangle, Settings, Database, Lock, TrendingUp } from 'lucide-react'
import { KPICard } from '../KPICard'
import { AnalyticsLineChart, AnalyticsBarChart, AnalyticsPieChart, AnalyticsAreaChart, GaugeChart, HeatMap } from '../Charts'
import { useDashboards, useBenchmarks } from '@/hooks/api/analytics'

interface SuperAdminDashboardProps {
  adminId?: string
}

export function SuperAdminDashboard({ adminId }: SuperAdminDashboardProps) {
  const { fetchDashboard, loading: dashboardLoading } = useDashboards()
  const [dashboardData, setDashboardData] = useState<any>(null)

  useEffect(() => {
    const loadDashboard = async () => {
      const data = await fetchDashboard('superadmin', adminId)
      setDashboardData(data)
    }
    loadDashboard()
  }, [fetchDashboard, adminId])

  if (dashboardLoading || !dashboardData) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 animate-pulse rounded-lg" />
          ))}
        </div>
        <div className="h-64 bg-gray-200 animate-pulse rounded-lg" />
      </div>
    )
  }

  const { platformMetrics, systemHealth, tenantMetrics, securityMetrics, performanceData } = dashboardData

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Painel do Super Administrador</h1>
          <p className="text-muted-foreground">
            Visão global da plataforma DigiUrban • Gerenciamento Multi-tenant
          </p>
        </div>
        <Badge variant="default" className="h-6 bg-gradient-to-r from-red-600 to-purple-600">
          <Shield className="h-4 w-4 mr-1" />
          Super Admin
        </Badge>
      </div>

      {/* KPIs Globais da Plataforma */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Municípios Ativos"
          value={platformMetrics?.activeTenants || 0}
          trend={platformMetrics?.tenantsTrend}
          trendValue={platformMetrics?.tenantsChange}
          status="good"
          description="Total de municípios na plataforma"
          size="md"
        />

        <KPICard
          title="Uptime da Plataforma"
          value={platformMetrics?.platformUptime || 0}
          unit="%"
          target={99.9}
          warning={99.5}
          critical={99.0}
          status={platformMetrics?.platformUptime >= 99.9 ? 'good' :
                   platformMetrics?.platformUptime >= 99.5 ? 'warning' : 'critical'}
          description="Disponibilidade do sistema"
          size="md"
        />

        <KPICard
          title="Usuários Globais"
          value={platformMetrics?.totalUsers || 0}
          trend={platformMetrics?.usersTrend}
          trendValue={platformMetrics?.usersChange}
          status="good"
          description="Total de usuários na plataforma"
          size="md"
        />

        <KPICard
          title="Processamento/Dia"
          value={platformMetrics?.dailyProcessing || 0}
          unit="req"
          trend={platformMetrics?.processingTrend}
          trendValue={platformMetrics?.processingChange}
          status="good"
          description="Requisições processadas por dia"
          size="md"
        />
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="tenants">Municípios</TabsTrigger>
          <TabsTrigger value="infrastructure">Infraestrutura</TabsTrigger>
          <TabsTrigger value="security">Segurança</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Saúde do Sistema */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-gradient-to-br from-green-50 to-emerald-100">
              <CardHeader>
                <CardTitle className="text-center text-sm flex items-center justify-center space-x-2">
                  <Server className="h-4 w-4" />
                  <span>Sistema</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex justify-center">
                <GaugeChart
                  value={systemHealth?.systemScore || 0}
                  max={100}
                  unit=""
                  color="#10B981"
                  size={120}
                />
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
              <CardHeader>
                <CardTitle className="text-center text-sm flex items-center justify-center space-x-2">
                  <Database className="h-4 w-4" />
                  <span>Database</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex justify-center">
                <GaugeChart
                  value={systemHealth?.databaseScore || 0}
                  max={100}
                  unit=""
                  color="#3B82F6"
                  size={120}
                />
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-purple-100">
              <CardHeader>
                <CardTitle className="text-center text-sm flex items-center justify-center space-x-2">
                  <Lock className="h-4 w-4" />
                  <span>Segurança</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex justify-center">
                <GaugeChart
                  value={systemHealth?.securityScore || 0}
                  max={100}
                  unit=""
                  color="#8B5CF6"
                  size={120}
                />
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-50 to-orange-100">
              <CardHeader>
                <CardTitle className="text-center text-sm flex items-center justify-center space-x-2">
                  <TrendingUp className="h-4 w-4" />
                  <span>Performance</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex justify-center">
                <GaugeChart
                  value={systemHealth?.performanceScore || 0}
                  max={100}
                  unit=""
                  color="#F59E0B"
                  size={120}
                />
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Crescimento da Plataforma */}
            <AnalyticsAreaChart
              title="Crescimento da Plataforma"
              data={dashboardData?.platformGrowth || []}
              xKey="month"
              yKey={["tenants", "users", "transactions"]}
              colors={["#3B82F6", "#10B981", "#F59E0B"]}
              height={300}
            />

            {/* Distribuição Regional */}
            <AnalyticsPieChart
              title="Distribuição Regional dos Municípios"
              data={dashboardData?.regionalDistribution || []}
              dataKey="count"
              nameKey="region"
              height={300}
            />
          </div>

          {/* Alertas Críticos do Sistema */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                <span>Alertas Críticos do Sistema</span>
                <Badge variant="destructive">{dashboardData?.systemAlerts?.length || 0}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {dashboardData?.systemAlerts?.map((alert: any, index: number) => (
                  <div key={index} className={`flex items-center justify-between p-3 border-l-4 rounded-r-lg ${
                    alert.severity === 'critical' ? 'border-red-500 bg-red-50' :
                    alert.severity === 'high' ? 'border-orange-500 bg-orange-50' :
                    'border-yellow-500 bg-yellow-50'
                  }`}>
                    <div>
                      <p className="font-medium">{alert.title}</p>
                      <p className="text-sm text-muted-foreground">{alert.description}</p>
                      <div className="flex items-center space-x-2 mt-2">
                        <Badge variant="outline">{alert.component}</Badge>
                        <span className="text-xs text-muted-foreground">{alert.createdAt}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={
                        alert.severity === 'critical' ? 'destructive' :
                        alert.severity === 'high' ? 'default' : 'secondary'
                      }>
                        {alert.severity}
                      </Badge>
                      <Button variant="outline" size="sm">
                        Investigar
                      </Button>
                    </div>
                  </div>
                )) || (
                  <p className="text-center text-muted-foreground py-8">
                    Sistema operando normalmente
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tenants" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Performance dos Municípios */}
            <AnalyticsBarChart
              title="Performance dos Top 10 Municípios"
              data={tenantMetrics || []}
              xKey="municipality"
              yKey="performanceScore"
              colors={["#8B5CF6"]}
              height={300}
            />

            {/* Mapa de Calor de Uso */}
            <HeatMap
              title="Mapa de Uso por Município"
              data={dashboardData?.usageHeatMap || []}
              xKey="municipality"
              yKey="feature"
              valueKey="usage"
              colors={['#FEF3C7', '#F59E0B', '#DC2626']}
            />
          </div>

          {/* Lista dos Municípios */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Globe className="h-5 w-5" />
                <span>Municípios na Plataforma</span>
                <Badge variant="secondary">{dashboardData?.tenantsList?.length || 0}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {dashboardData?.tenantsList?.map((tenant: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className={`w-3 h-3 rounded-full ${
                        tenant.status === 'active' ? 'bg-green-500' :
                        tenant.status === 'inactive' ? 'bg-red-500' : 'bg-yellow-500'
                      }`} />
                      <div>
                        <p className="font-medium">{tenant.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {tenant.state} • {tenant.population?.toLocaleString()} habitantes
                        </p>
                      </div>
                    </div>
                    <div className="text-right space-y-1">
                      <div className="flex items-center space-x-2">
                        <Badge variant={tenant.plan === 'premium' ? 'default' : 'secondary'}>
                          {tenant.plan}
                        </Badge>
                        <Badge variant={tenant.health >= 90 ? 'default' :
                                      tenant.health >= 70 ? 'secondary' : 'destructive'}>
                          {tenant.health}%
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {tenant.activeUsers} usuários ativos
                      </p>
                    </div>
                  </div>
                )) || (
                  <p className="text-center text-muted-foreground py-8">
                    Carregando lista de municípios...
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="infrastructure" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Métricas de Performance */}
            <AnalyticsLineChart
              title="Métricas de Performance"
              data={performanceData || []}
              xKey="hour"
              yKey={["responseTime", "throughput", "errorRate"]}
              colors={["#3B82F6", "#10B981", "#EF4444"]}
              height={300}
            />

            {/* Uso de Recursos */}
            <AnalyticsAreaChart
              title="Uso de Recursos do Sistema"
              data={dashboardData?.resourceUsage || []}
              xKey="time"
              yKey={["cpu", "memory", "disk", "network"]}
              colors={["#3B82F6", "#10B981", "#F59E0B", "#8B5CF6"]}
              height={300}
              stacked
            />
          </div>

          {/* Estatísticas da Infraestrutura */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm text-center">Servidores</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-3xl font-bold text-blue-600">
                  {dashboardData?.infrastructure?.servers?.active || 0}
                </p>
                <p className="text-sm text-muted-foreground">
                  de {dashboardData?.infrastructure?.servers?.total || 0} total
                </p>
                <Badge variant="secondary" className="mt-2">
                  {dashboardData?.infrastructure?.servers?.utilization || 0}% utilização
                </Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm text-center">Banco de Dados</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-3xl font-bold text-green-600">
                  {dashboardData?.infrastructure?.database?.size || 0}GB
                </p>
                <p className="text-sm text-muted-foreground">
                  {dashboardData?.infrastructure?.database?.connections || 0} conexões ativas
                </p>
                <Badge variant="default" className="mt-2">
                  {dashboardData?.infrastructure?.database?.performance || 0}ms avg
                </Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm text-center">CDN & Cache</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-3xl font-bold text-purple-600">
                  {dashboardData?.infrastructure?.cdn?.hitRate || 0}%
                </p>
                <p className="text-sm text-muted-foreground">Taxa de acerto</p>
                <Badge variant="outline" className="mt-2">
                  {dashboardData?.infrastructure?.cdn?.bandwidth || 0}GB/h
                </Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm text-center">Armazenamento</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-3xl font-bold text-orange-600">
                  {dashboardData?.infrastructure?.storage?.used || 0}TB
                </p>
                <p className="text-sm text-muted-foreground">
                  de {dashboardData?.infrastructure?.storage?.total || 0}TB
                </p>
                <Badge variant="secondary" className="mt-2">
                  {dashboardData?.infrastructure?.storage?.growth || 0}GB/dia
                </Badge>
              </CardContent>
            </Card>
          </div>

          {/* Logs e Monitoramento */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5" />
                <span>Logs do Sistema - Últimas 24h</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {dashboardData?.systemLogs?.map((log: any, index: number) => (
                  <div key={index} className={`flex items-center justify-between p-2 text-sm border-l-2 ${
                    log.level === 'error' ? 'border-red-500 bg-red-50' :
                    log.level === 'warning' ? 'border-yellow-500 bg-yellow-50' :
                    'border-blue-500 bg-blue-50'
                  } rounded-r`}>
                    <div>
                      <span className="font-mono">[{log.timestamp}]</span>
                      <span className="ml-2">{log.message}</span>
                    </div>
                    <Badge variant={
                      log.level === 'error' ? 'destructive' :
                      log.level === 'warning' ? 'secondary' : 'outline'
                    }>
                      {log.level}
                    </Badge>
                  </div>
                )) || (
                  <p className="text-center text-muted-foreground py-8">
                    Nenhum log crítico nas últimas 24h
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Tentativas de Acesso */}
            <AnalyticsBarChart
              title="Tentativas de Acesso por Hora"
              data={securityMetrics || []}
              xKey="hour"
              yKey={["successful", "failed", "blocked"]}
              colors={["#10B981", "#EF4444", "#F59E0B"]}
              height={300}
            />

            {/* Distribuição de Ameaças */}
            <AnalyticsPieChart
              title="Tipos de Ameaças Detectadas"
              data={dashboardData?.threatDistribution || []}
              dataKey="count"
              nameKey="type"
              height={300}
            />
          </div>

          {/* Métricas de Segurança */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="border-l-4 border-green-500">
              <CardHeader>
                <CardTitle className="text-sm">Autenticações Válidas</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-green-600">
                  {dashboardData?.security?.validAuth || 0}
                </p>
                <p className="text-sm text-muted-foreground">Últimas 24h</p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-red-500">
              <CardHeader>
                <CardTitle className="text-sm">Tentativas Bloqueadas</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-red-600">
                  {dashboardData?.security?.blockedAttempts || 0}
                </p>
                <p className="text-sm text-muted-foreground">Últimas 24h</p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-yellow-500">
              <CardHeader>
                <CardTitle className="text-sm">IPs Suspeitos</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-yellow-600">
                  {dashboardData?.security?.suspiciousIPs || 0}
                </p>
                <p className="text-sm text-muted-foreground">Em monitoramento</p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-blue-500">
              <CardHeader>
                <CardTitle className="text-sm">Certificados SSL</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-blue-600">
                  {dashboardData?.security?.sslCerts || 0}
                </p>
                <p className="text-sm text-muted-foreground">Válidos</p>
              </CardContent>
            </Card>
          </div>

          {/* Eventos de Segurança */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Lock className="h-5 w-5" />
                <span>Eventos de Segurança Recentes</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {dashboardData?.securityEvents?.map((event: any, index: number) => (
                  <div key={index} className={`flex items-center justify-between p-3 border-l-4 rounded-r-lg ${
                    event.severity === 'high' ? 'border-red-500 bg-red-50' :
                    event.severity === 'medium' ? 'border-yellow-500 bg-yellow-50' :
                    'border-blue-500 bg-blue-50'
                  }`}>
                    <div>
                      <p className="font-medium">{event.type}</p>
                      <p className="text-sm text-muted-foreground">{event.description}</p>
                      <p className="text-xs text-muted-foreground">
                        IP: {event.ip} • {event.timestamp}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={
                        event.severity === 'high' ? 'destructive' :
                        event.severity === 'medium' ? 'default' : 'secondary'
                      }>
                        {event.severity}
                      </Badge>
                      <Badge variant="outline">{event.action}</Badge>
                    </div>
                  </div>
                )) || (
                  <p className="text-center text-muted-foreground py-8">
                    Nenhum evento de segurança recente
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Analytics de Uso Global */}
            <AnalyticsAreaChart
              title="Uso Global da Plataforma"
              data={dashboardData?.globalUsage || []}
              xKey="date"
              yKey={["sessions", "pageViews", "transactions"]}
              colors={["#3B82F6", "#10B981", "#F59E0B"]}
              height={300}
            />

            {/* Análise de Features */}
            <AnalyticsBarChart
              title="Adoção de Features por Município"
              data={dashboardData?.featureAdoption || []}
              xKey="feature"
              yKey="adoptionRate"
              colors={["#8B5CF6"]}
              height={300}
            />
          </div>

          {/* Métricas de Business Intelligence */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Receita Mensal</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-green-600">
                  R$ {(dashboardData?.business?.monthlyRevenue || 0).toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground">
                  +{dashboardData?.business?.revenueGrowth || 0}% vs mês anterior
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Churn Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-blue-600">
                  {dashboardData?.business?.churnRate || 0}%
                </p>
                <p className="text-sm text-muted-foreground">Taxa de cancelamento mensal</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">LTV Médio</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-purple-600">
                  R$ {(dashboardData?.business?.averageLTV || 0).toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground">Valor vitalício do cliente</p>
              </CardContent>
            </Card>
          </div>

          {/* Relatórios Executivos */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="h-5 w-5" />
                <span>Relatórios da Plataforma</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { name: 'Relatório de Performance Global', description: 'Análise completa da performance da plataforma' },
                  { name: 'Análise de Segurança', description: 'Auditoria de segurança e vulnerabilidades' },
                  { name: 'Relatório de Crescimento', description: 'Métricas de crescimento e expansão' },
                  { name: 'Health Check Completo', description: 'Status de saúde de todos os componentes' },
                  { name: 'Análise Financeira', description: 'Receitas, custos e projeções financeiras' },
                  { name: 'Benchmark de Municípios', description: 'Comparativo de performance entre municípios' }
                ].map((report, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{report.name}</p>
                      <p className="text-sm text-muted-foreground">{report.description}</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Gerar
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}