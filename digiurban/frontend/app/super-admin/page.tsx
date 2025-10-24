'use client';

import { useEffect, useState } from 'react';
import { KPICard, KPICardGrid } from '@/components/ui/kpi-card';
import { DataTable, DataTableColumn } from '@/components/ui/data-table';
import { LineChart, BarChart, PieChart, ActivityChart } from '@/components/ui/charts';
import { TenantStatusBadge, PlanBadge, InvoiceStatusBadge } from '@/components/ui/status-badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface DashboardData {
  overview: {
    totalTenants: number;
    activeTenants: number;
    trialTenants: number;
    totalProtocols: number;
    totalUsers: number;
    totalRevenue: number;
    newTenantsThisPeriod: number;
    churnedTenants: number;
  };
  financial: {
    mrr: number;
    arr: number;
    churnRate: number;
  };
  breakdown: {
    tenantsByPlan: Record<string, number>;
    protocolsByStatus: Record<string, number>;
  };
  charts: {
    monthlyRevenue: Array<{
      period: string;
      revenue: number;
      invoices: number;
    }>;
  };
  topTenants: Array<{
    id: string;
    name: string;
    plan: string;
    protocolCount: number;
    userCount: number;
    createdAt: string;
  }>;
}

interface Tenant {
  id: string;
  name: string;
  cnpj: string;
  plan: string;
  status: string;
  population: number;
  _count: {
    users: number;
    protocols: number;
    services: number;
    citizens: number;
    invoices: number;
  };
  invoices: Array<{
    id: string;
    amount: number;
    dueDate: string;
  }>;
  createdAt: string;
}

interface Invoice {
  id: string;
  number: string;
  amount: number;
  plan: string;
  period: string;
  status: string;
  dueDate: string;
  tenant: {
    id: string;
    name: string;
    cnpj: string;
  };
  createdAt: string;
}

export default function SuperAdminPage() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch('/api/super-admin/analytics');
        if (response.ok) {
          const data = await response.json();
          setDashboardData(data);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    const fetchTenants = async () => {
      try {
        const response = await fetch('/api/super-admin/tenants?limit=50');
        if (response.ok) {
          const data = await response.json();
          setTenants(data.tenants);
        }
      } catch (error) {
        console.error('Error fetching tenants:', error);
      }
    };

    const fetchInvoices = async () => {
      try {
        const response = await fetch('/api/super-admin/billing/invoices?limit=50');
        if (response.ok) {
          const data = await response.json();
          setInvoices(data.invoices);
        }
      } catch (error) {
        console.error('Error fetching invoices:', error);
      }
    };

    Promise.all([
      fetchDashboardData(),
      fetchTenants(),
      fetchInvoices()
    ]).finally(() => {
      setLoading(false);
    });
  }, []);

  // Generate billing for current month
  const generateBilling = async () => {
    const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
    try {
      const response = await fetch('/api/super-admin/billing/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ period: currentMonth })
      });

      if (response.ok) {
        const result = await response.json();
        alert(`${result.invoices.length} faturas geradas para ${currentMonth}`);
        // Refresh data
        window.location.reload();
      }
    } catch (error) {
      console.error('Error generating billing:', error);
      alert('Erro ao gerar faturas');
    }
  };

  // Table columns
  const tenantColumns: DataTableColumn<Tenant>[] = [
    {
      id: 'name',
      header: 'Nome',
      accessorKey: 'name',
      sortable: true
    },
    {
      id: 'cnpj',
      header: 'CNPJ',
      accessorKey: 'cnpj'
    },
    {
      id: 'plan',
      header: 'Plano',
      cell: (tenant) => <PlanBadge plan={tenant.plan} />
    },
    {
      id: 'status',
      header: 'Status',
      cell: (tenant) => <TenantStatusBadge status={tenant.status} />
    },
    {
      id: 'users',
      header: 'Usuários',
      cell: (tenant) => tenant._count.users.toLocaleString('pt-BR')
    },
    {
      id: 'protocols',
      header: 'Protocolos',
      cell: (tenant) => tenant._count.protocols.toLocaleString('pt-BR')
    },
    {
      id: 'population',
      header: 'População',
      cell: (tenant) => tenant.population?.toLocaleString('pt-BR') || '-'
    },
    {
      id: 'createdAt',
      header: 'Criado em',
      cell: (tenant) => new Date(tenant.createdAt).toLocaleDateString('pt-BR')
    }
  ];

  const invoiceColumns: DataTableColumn<Invoice>[] = [
    {
      id: 'number',
      header: 'Número',
      accessorKey: 'number'
    },
    {
      id: 'tenant',
      header: 'Tenant',
      cell: (invoice) => invoice.tenant.name
    },
    {
      id: 'amount',
      header: 'Valor',
      cell: (invoice) => `R$ ${invoice.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
    },
    {
      id: 'plan',
      header: 'Plano',
      cell: (invoice) => <PlanBadge plan={invoice.plan} />
    },
    {
      id: 'status',
      header: 'Status',
      cell: (invoice) => <InvoiceStatusBadge status={invoice.status} />
    },
    {
      id: 'period',
      header: 'Período',
      accessorKey: 'period'
    },
    {
      id: 'dueDate',
      header: 'Vencimento',
      cell: (invoice) => new Date(invoice.dueDate).toLocaleDateString('pt-BR')
    }
  ];

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-primary mb-2">
              Dashboard Super Admin
            </h1>
            <p className="text-muted-foreground">
              Central de controle da plataforma DigiUrban SaaS
            </p>
          </div>
          <div className="space-x-2">
            <Button onClick={generateBilling} variant="outline">
              Gerar Faturas do Mês
            </Button>
            <Button onClick={() => window.location.reload()} variant="outline">
              Atualizar Dados
            </Button>
          </div>
        </div>

        {/* KPI Cards */}
        <KPICardGrid className="mb-8">
          <KPICard
            title="Total de Tenants"
            value={dashboardData?.overview.totalTenants || 0}
            description="Municípios na plataforma"
            loading={loading}
            trend={{
              value: 12,
              period: "últimos 30 dias",
              isPositive: true
            }}
            icon={<span>🏛️</span>}
          />
          <KPICard
            title="Tenants Ativos"
            value={dashboardData?.overview.activeTenants || 0}
            description="Pagantes ativos"
            loading={loading}
            trend={{
              value: 8,
              period: "últimos 30 dias",
              isPositive: true
            }}
            icon={<span>✅</span>}
          />
          <KPICard
            title="MRR"
            value={`R$ ${(dashboardData?.financial.mrr || 0).toLocaleString('pt-BR')}`}
            description="Receita recorrente mensal"
            loading={loading}
            trend={{
              value: 15,
              period: "vs mês anterior",
              isPositive: true
            }}
            icon={<span>💰</span>}
          />
          <KPICard
            title="ARR"
            value={`R$ ${(dashboardData?.financial.arr || 0).toLocaleString('pt-BR')}`}
            description="Receita recorrente anual"
            loading={loading}
            trend={{
              value: 22,
              period: "vs ano anterior",
              isPositive: true
            }}
            icon={<span>📈</span>}
          />
        </KPICardGrid>

        {/* Secondary KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">
                {dashboardData?.overview.totalUsers.toLocaleString('pt-BR') || 0}
              </div>
              <div className="text-sm text-muted-foreground">Usuários Totais</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">
                {dashboardData?.overview.totalProtocols.toLocaleString('pt-BR') || 0}
              </div>
              <div className="text-sm text-muted-foreground">Protocolos Processados</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">
                {dashboardData?.overview.trialTenants || 0}
              </div>
              <div className="text-sm text-muted-foreground">Tenants em Trial</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-red-600">
                {dashboardData?.financial.churnRate.toFixed(1) || 0}%
              </div>
              <div className="text-sm text-muted-foreground">Taxa de Churn</div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <LineChart
            title="Receita Mensal"
            data={dashboardData?.charts.monthlyRevenue.map(item => ({
              label: item.period,
              value: item.revenue
            })) || []}
            loading={loading}
            className="lg:col-span-2"
            color="hsl(var(--primary))"
          />

          <PieChart
            title="Tenants por Plano"
            data={Object.entries(dashboardData?.breakdown.tenantsByPlan || {}).map(([label, value]) => ({
              label,
              value
            }))}
            loading={loading}
            showLegend={true}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <BarChart
            title="Protocolos por Status"
            data={Object.entries(dashboardData?.breakdown.protocolsByStatus || {}).map(([label, value]) => ({
              label,
              value,
              color: label === 'CONCLUIDO' ? '#22c55e' :
                     label === 'PROGRESSO' ? '#f59e0b' :
                     label === 'VINCULADO' ? '#3b82f6' : '#6b7280'
            }))}
            loading={loading}
          />

          <Card>
            <CardHeader>
              <CardTitle>Top 5 Tenants (Protocolos)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {(dashboardData?.topTenants || []).slice(0, 5).map((tenant, index) => (
                  <div key={tenant.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div>
                      <div className="font-medium">{tenant.name}</div>
                      <div className="text-sm text-muted-foreground">
                        <PlanBadge plan={tenant.plan} />
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">{tenant.protocolCount.toLocaleString('pt-BR')}</div>
                      <div className="text-sm text-muted-foreground">{tenant.userCount} usuários</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Tables */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="tenants">Tenants</TabsTrigger>
            <TabsTrigger value="invoices">Faturas</TabsTrigger>
          </TabsList>

          <TabsContent value="tenants">
            <DataTable
              data={tenants}
              columns={tenantColumns}
              title="Gestão de Tenants"
              searchPlaceholder="Buscar por nome, CNPJ..."
              loading={loading}
              actions={[
                {
                  label: 'Ver Detalhes',
                  onClick: (tenant) => {
                    alert(`Detalhes do tenant: ${tenant.name}`);
                  },
                  variant: 'outline'
                }
              ]}
            />
          </TabsContent>

          <TabsContent value="invoices">
            <DataTable
              data={invoices}
              columns={invoiceColumns}
              title="Gestão de Faturas"
              searchPlaceholder="Buscar por número, tenant..."
              loading={loading}
              actions={[
                {
                  label: 'Ver Fatura',
                  onClick: (invoice) => {
                    alert(`Detalhes da fatura: ${invoice.number}`);
                  },
                  variant: 'outline'
                }
              ]}
            />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}