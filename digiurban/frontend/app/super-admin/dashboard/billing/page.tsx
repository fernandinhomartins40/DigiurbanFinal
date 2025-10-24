'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { DollarSign, FileText, AlertCircle, CheckCircle, Clock, TrendingUp, Download } from 'lucide-react';
import { SuperAdminCard, MetricCard } from '@/components/super-admin';
import { BarChart, LineChart } from '@/components/ui/charts';
import { InvoiceStatusBadge, PlanBadge } from '@/components/ui/status-badge';

interface BillingDashboardData {
  overview: {
    totalRevenue: number;
    pendingRevenue: number;
    overdueRevenue: number;
    paidThisMonth: number;
    invoicesIssued: number;
    invoicesPaid: number;
    invoicesPending: number;
    invoicesOverdue: number;
  };
  trends: {
    revenueGrowth: number;
    collectionRate: number;
    averagePaymentTime: number;
  };
  breakdown: {
    revenueByPlan: Array<{ plan: string; revenue: number; count: number }>;
    revenueByMonth: Array<{ month: string; issued: number; paid: number; overdue: number }>;
    paymentMethods: Array<{ method: string; count: number; total: number }>;
  };
  recentInvoices: Array<{
    id: string;
    number: string;
    tenant: { name: string };
    amount: number;
    status: string;
    dueDate: string;
    paidAt?: string;
  }>;
  overdueInvoices: Array<{
    id: string;
    number: string;
    tenant: { name: string; cnpj: string };
    amount: number;
    dueDate: string;
    daysOverdue: number;
  }>;
}

export default function BillingDashboardPage() {
  const [data, setData] = useState<BillingDashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBillingData();
  }, []);

  const fetchBillingData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('digiurban_super_admin_token');
      const response = await fetch('http://localhost:3001/api/super-admin/billing/dashboard', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const result = await response.json();
        setData(result.data);
      }
    } catch (error) {
      console.error('Error fetching billing dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateBilling = async () => {
    const currentMonth = new Date().toISOString().slice(0, 7);
    try {
      const token = localStorage.getItem('digiurban_super_admin_token');
      const response = await fetch('http://localhost:3001/api/super-admin/billing/generate', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ period: currentMonth })
      });

      if (response.ok) {
        const result = await response.json();
        alert(`✅ ${result.invoices?.length || 0} faturas geradas para ${currentMonth}`);
        fetchBillingData();
      }
    } catch (error) {
      console.error('Error generating billing:', error);
      alert('❌ Erro ao gerar faturas');
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const collectionRate = data ?
    ((data.overview.invoicesPaid / (data.overview.invoicesIssued || 1)) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard de Billing</h1>
          <p className="text-gray-600">
            Visão executiva de faturamento e cobranças
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={generateBilling}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <FileText size={20} />
            Gerar Faturas do Mês
          </button>
          <Link
            href="/super-admin/billing/invoices"
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Ver Todas Faturas
          </Link>
        </div>
      </div>

      {/* Primary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard
          title="Receita Total"
          value={formatCurrency(data?.overview.totalRevenue || 0)}
          icon={<DollarSign size={24} />}
          color="green"
          subtitle="Acumulado"
          trend={{ value: data?.trends.revenueGrowth || 0, isPositive: (data?.trends.revenueGrowth || 0) > 0 }}
          loading={loading}
        />
        <MetricCard
          title="Pago Este Mês"
          value={formatCurrency(data?.overview.paidThisMonth || 0)}
          icon={<CheckCircle size={24} />}
          color="blue"
          subtitle={`${data?.overview.invoicesPaid || 0} faturas`}
          loading={loading}
        />
        <MetricCard
          title="Pendente"
          value={formatCurrency(data?.overview.pendingRevenue || 0)}
          icon={<Clock size={24} />}
          color="yellow"
          subtitle={`${data?.overview.invoicesPending || 0} faturas`}
          loading={loading}
        />
        <MetricCard
          title="Vencidas"
          value={formatCurrency(data?.overview.overdueRevenue || 0)}
          icon={<AlertCircle size={24} />}
          color="red"
          subtitle={`${data?.overview.invoicesOverdue || 0} faturas`}
          loading={loading}
        />
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm font-medium text-gray-600">Taxa de Cobrança</div>
            <TrendingUp className={collectionRate >= 90 ? 'text-green-500' : 'text-yellow-500'} size={20} />
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-2">
            {collectionRate.toFixed(1)}%
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${collectionRate >= 90 ? 'bg-green-500' : 'bg-yellow-500'}`}
              style={{ width: `${Math.min(collectionRate, 100)}%` }}
            />
          </div>
          <div className="text-xs text-gray-500 mt-2">
            {data?.overview.invoicesPaid || 0} de {data?.overview.invoicesIssued || 0} faturas pagas
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm font-medium text-gray-600">Tempo Médio de Pagamento</div>
            <Clock className="text-blue-500" size={20} />
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-2">
            {data?.trends.averagePaymentTime || 0} dias
          </div>
          <div className="text-xs text-gray-500 mt-2">
            {(data?.trends.averagePaymentTime || 0) <= 7 ? '✅ Dentro do prazo' : '⚠️ Acima da média'}
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm font-medium text-gray-600">Crescimento de Receita</div>
            <TrendingUp className="text-purple-500" size={20} />
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-2">
            +{data?.trends.revenueGrowth || 0}%
          </div>
          <div className="text-xs text-gray-500 mt-2">
            vs mês anterior
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SuperAdminCard
          title="Receita Mensal"
          description="Emitido, pago e vencido"
          loading={loading}
        >
          <BarChart
            data={data?.breakdown.revenueByMonth.map(item => ({
              label: item.month,
              value: item.paid,
              color: '#22c55e'
            })) || []}
            height={300}
          />
          <div className="mt-4 grid grid-cols-3 gap-4 text-center text-sm">
            <div>
              <div className="text-gray-500">Emitido</div>
              <div className="text-lg font-bold text-gray-900">
                {formatCurrency(data?.breakdown.revenueByMonth[data.breakdown.revenueByMonth.length - 1]?.issued || 0)}
              </div>
            </div>
            <div>
              <div className="text-gray-500">Pago</div>
              <div className="text-lg font-bold text-green-600">
                {formatCurrency(data?.breakdown.revenueByMonth[data.breakdown.revenueByMonth.length - 1]?.paid || 0)}
              </div>
            </div>
            <div>
              <div className="text-gray-500">Vencido</div>
              <div className="text-lg font-bold text-red-600">
                {formatCurrency(data?.breakdown.revenueByMonth[data.breakdown.revenueByMonth.length - 1]?.overdue || 0)}
              </div>
            </div>
          </div>
        </SuperAdminCard>

        <SuperAdminCard
          title="Receita por Plano"
          description="Distribuição por tipo de plano"
          loading={loading}
        >
          <div className="space-y-4">
            {data?.breakdown.revenueByPlan.map((item, index) => (
              <div key={index}>
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <PlanBadge plan={item.plan} />
                    <span className="text-sm text-gray-600">({item.count} tenants)</span>
                  </div>
                  <span className="font-bold text-gray-900">{formatCurrency(item.revenue)}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{
                      width: `${(item.revenue / (data.breakdown.revenueByPlan.reduce((sum, p) => sum + p.revenue, 0) || 1)) * 100}%`
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-gray-700">Total</span>
              <span className="text-xl font-bold text-gray-900">
                {formatCurrency(data?.breakdown.revenueByPlan.reduce((sum, item) => sum + item.revenue, 0) || 0)}
              </span>
            </div>
          </div>
        </SuperAdminCard>
      </div>

      {/* Overdue Invoices Alert */}
      {data && data.overview.invoicesOverdue > 0 && (
        <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg">
          <div className="flex items-start gap-4">
            <AlertCircle className="text-red-600 mt-1" size={24} />
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-red-900 mb-2">
                ⚠️ {data.overview.invoicesOverdue} Faturas Vencidas
              </h3>
              <p className="text-red-700 mb-4">
                Total de {formatCurrency(data.overview.overdueRevenue)} em faturas vencidas requer atenção imediata
              </p>
              <div className="space-y-2">
                {data.overdueInvoices.slice(0, 5).map((invoice) => (
                  <div key={invoice.id} className="bg-white rounded-lg p-3 flex justify-between items-center">
                    <div>
                      <div className="font-semibold text-gray-900">{invoice.tenant.name}</div>
                      <div className="text-sm text-gray-600">
                        Fatura {invoice.number} • Venceu há {invoice.daysOverdue} dias
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-red-600">{formatCurrency(invoice.amount)}</div>
                      <Link
                        href={`/super-admin/billing/invoices`}
                        className="text-sm text-blue-600 hover:text-blue-800"
                      >
                        Ver fatura →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
              {data.overdueInvoices.length > 5 && (
                <Link
                  href="/super-admin/billing/invoices?status=OVERDUE"
                  className="inline-block mt-3 text-red-700 hover:text-red-900 font-medium text-sm"
                >
                  Ver todas {data.overdueInvoices.length} faturas vencidas →
                </Link>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Recent Invoices */}
      <SuperAdminCard
        title="Faturas Recentes"
        description="Últimas faturas emitidas"
        headerAction={
          <Link
            href="/super-admin/billing/invoices"
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            Ver todas →
          </Link>
        }
        loading={loading}
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Número</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Tenant</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Valor</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Vencimento</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {data?.recentInvoices.slice(0, 10).map((invoice) => (
                <tr key={invoice.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">
                    {invoice.number}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {invoice.tenant.name}
                  </td>
                  <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                    {formatCurrency(invoice.amount)}
                  </td>
                  <td className="px-4 py-3">
                    <InvoiceStatusBadge status={invoice.status} />
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {formatDate(invoice.dueDate)}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <button className="text-blue-600 hover:text-blue-800 font-medium">
                      Detalhes
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SuperAdminCard>
    </div>
  );
}
