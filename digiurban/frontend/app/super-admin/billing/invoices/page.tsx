'use client';

import { useEffect, useState } from 'react';
import { SuperAdminCard, MetricCard } from '@/components/super-admin/SuperAdminCard';
import { TenantSelector } from '@/components/super-admin/TenantSelector';
import {
  FileText,
  DollarSign,
  AlertCircle,
  CheckCircle,
  Clock,
  Download,
  Send,
  Edit,
  X,
  Plus,
  Search,
  Filter,
  MoreVertical,
  Eye,
  Mail
} from 'lucide-react';

interface Invoice {
  id: string;
  number: string;
  tenantId: string;
  tenant: {
    id: string;
    name: string;
    cnpj: string;
  };
  plan: string;
  amount: number;
  status: 'PENDING' | 'PAID' | 'OVERDUE' | 'CANCELLED';
  period: string;
  dueDate: string;
  paidAt?: string;
  createdAt: string;
  items: Array<{
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }>;
}

interface InvoiceMetrics {
  total: number;
  pending: number;
  paid: number;
  overdue: number;
  totalAmount: number;
  paidAmount: number;
  overdueAmount: number;
  pendingAmount: number;
}

export default function BillingInvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [filteredInvoices, setFilteredInvoices] = useState<Invoice[]>([]);
  const [metrics, setMetrics] = useState<InvoiceMetrics>({
    total: 0,
    pending: 0,
    paid: 0,
    overdue: 0,
    totalAmount: 0,
    paidAmount: 0,
    overdueAmount: 0,
    pendingAmount: 0
  });
  const [loading, setLoading] = useState(true);
  const [selectedTenant, setSelectedTenant] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedPlan, setSelectedPlan] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedInvoices, setSelectedInvoices] = useState<string[]>([]);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  useEffect(() => {
    fetchInvoices();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [invoices, selectedTenant, selectedStatus, selectedPlan, searchTerm]);

  const fetchInvoices = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('digiurban_super_admin_token');
      const response = await fetch('http://localhost:3001/api/super-admin/billing/invoices', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setInvoices(data.invoices || mockInvoices);
        calculateMetrics(data.invoices || mockInvoices);
      } else {
        // Fallback to mock data
        setInvoices(mockInvoices);
        calculateMetrics(mockInvoices);
      }
    } catch (error) {
      console.error('Error fetching invoices:', error);
      // Use mock data on error
      setInvoices(mockInvoices);
      calculateMetrics(mockInvoices);
    } finally {
      setLoading(false);
    }
  };

  const calculateMetrics = (invoiceList: Invoice[]) => {
    const now = new Date();
    const metricsData: InvoiceMetrics = {
      total: invoiceList.length,
      pending: 0,
      paid: 0,
      overdue: 0,
      totalAmount: 0,
      paidAmount: 0,
      overdueAmount: 0,
      pendingAmount: 0
    };

    invoiceList.forEach(invoice => {
      metricsData.totalAmount += invoice.amount;

      if (invoice.status === 'PAID') {
        metricsData.paid++;
        metricsData.paidAmount += invoice.amount;
      } else if (invoice.status === 'OVERDUE' || (invoice.status === 'PENDING' && new Date(invoice.dueDate) < now)) {
        metricsData.overdue++;
        metricsData.overdueAmount += invoice.amount;
      } else if (invoice.status === 'PENDING') {
        metricsData.pending++;
        metricsData.pendingAmount += invoice.amount;
      }
    });

    setMetrics(metricsData);
  };

  const applyFilters = () => {
    let filtered = [...invoices];

    // Filter by tenant
    if (selectedTenant !== 'all') {
      filtered = filtered.filter(inv => inv.tenantId === selectedTenant);
    }

    // Filter by status
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(inv => inv.status === selectedStatus);
    }

    // Filter by plan
    if (selectedPlan !== 'all') {
      filtered = filtered.filter(inv => inv.plan === selectedPlan);
    }

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(inv =>
        inv.number.toLowerCase().includes(term) ||
        inv.tenant.name.toLowerCase().includes(term) ||
        inv.tenant.cnpj.includes(term)
      );
    }

    setFilteredInvoices(filtered);
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      PAID: 'bg-green-100 text-green-800',
      PENDING: 'bg-yellow-100 text-yellow-800',
      OVERDUE: 'bg-red-100 text-red-800',
      CANCELLED: 'bg-gray-100 text-gray-800'
    };
    const labels = {
      PAID: 'Pago',
      PENDING: 'Pendente',
      OVERDUE: 'Vencido',
      CANCELLED: 'Cancelado'
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status as keyof typeof styles] || styles.PENDING}`}>
        {labels[status as keyof typeof labels] || status}
      </span>
    );
  };

  const getPlanBadge = (plan: string) => {
    const styles = {
      STARTER: 'bg-blue-100 text-blue-800',
      PROFESSIONAL: 'bg-purple-100 text-purple-800',
      ENTERPRISE: 'bg-orange-100 text-orange-800'
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[plan as keyof typeof styles] || styles.STARTER}`}>
        {plan}
      </span>
    );
  };

  const handleBulkAction = async (action: 'send-reminder' | 'mark-paid' | 'cancel') => {
    if (selectedInvoices.length === 0) {
      alert('Selecione pelo menos uma fatura');
      return;
    }

    const token = localStorage.getItem('digiurban_super_admin_token');

    try {
      const response = await fetch(`http://localhost:3001/api/super-admin/billing/invoices/bulk-action`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action,
          invoiceIds: selectedInvoices
        })
      });

      if (response.ok) {
        alert(`Ação "${action}" executada com sucesso em ${selectedInvoices.length} fatura(s)`);
        setSelectedInvoices([]);
        fetchInvoices();
      }
    } catch (error) {
      console.error('Error executing bulk action:', error);
      alert('Erro ao executar ação em lote');
    }
  };

  const handleSendReminder = async (invoiceId: string) => {
    const token = localStorage.getItem('digiurban_super_admin_token');

    try {
      const response = await fetch(`http://localhost:3001/api/super-admin/billing/invoices/${invoiceId}/send-reminder`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        alert('Lembrete enviado com sucesso');
      }
    } catch (error) {
      console.error('Error sending reminder:', error);
      alert('Erro ao enviar lembrete');
    }
  };

  const handleMarkAsPaid = async (invoiceId: string) => {
    const token = localStorage.getItem('digiurban_super_admin_token');

    try {
      const response = await fetch(`http://localhost:3001/api/super-admin/billing/invoices/${invoiceId}/mark-paid`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        alert('Fatura marcada como paga');
        fetchInvoices();
      }
    } catch (error) {
      console.error('Error marking as paid:', error);
      alert('Erro ao marcar fatura como paga');
    }
  };

  const handleCancelInvoice = async (invoiceId: string) => {
    if (!confirm('Tem certeza que deseja cancelar esta fatura?')) return;

    const token = localStorage.getItem('digiurban_super_admin_token');

    try {
      const response = await fetch(`http://localhost:3001/api/super-admin/billing/invoices/${invoiceId}/cancel`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        alert('Fatura cancelada com sucesso');
        fetchInvoices();
      }
    } catch (error) {
      console.error('Error cancelling invoice:', error);
      alert('Erro ao cancelar fatura');
    }
  };

  const handleExport = async (format: 'csv' | 'pdf') => {
    const token = localStorage.getItem('digiurban_super_admin_token');

    try {
      const response = await fetch(`http://localhost:3001/api/super-admin/billing/invoices/export?format=${format}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `invoices_${new Date().toISOString().split('T')[0]}.${format}`;
        a.click();
      }
    } catch (error) {
      console.error('Error exporting invoices:', error);
      alert('Erro ao exportar faturas');
    }
  };

  const handleViewInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setShowInvoiceModal(true);
  };

  const toggleInvoiceSelection = (invoiceId: string) => {
    setSelectedInvoices(prev =>
      prev.includes(invoiceId)
        ? prev.filter(id => id !== invoiceId)
        : [...prev, invoiceId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedInvoices.length === filteredInvoices.length) {
      setSelectedInvoices([]);
    } else {
      setSelectedInvoices(filteredInvoices.map(inv => inv.id));
    }
  };

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-primary mb-2">
              Gestão de Faturas
            </h1>
            <p className="text-muted-foreground">
              Gerenciamento completo de faturas de todos os tenants
            </p>
          </div>
          <div className="space-x-2">
            <button
              onClick={() => handleExport('csv')}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
            >
              <Download className="inline w-4 h-4 mr-2" />
              Exportar CSV
            </button>
            <button
              onClick={() => handleExport('pdf')}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
            >
              <Download className="inline w-4 h-4 mr-2" />
              Exportar PDF
            </button>
            <button
              onClick={() => alert('Funcionalidade de criar fatura manual em desenvolvimento')}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 text-sm"
            >
              <Plus className="inline w-4 h-4 mr-2" />
              Nova Fatura
            </button>
          </div>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <MetricCard
            title="Total de Faturas"
            value={metrics.total}
            icon={<FileText className="w-5 h-5" />}
            loading={loading}
          />
          <MetricCard
            title="Faturas Pagas"
            value={metrics.paid}
            subtitle={`R$ ${metrics.paidAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
            icon={<CheckCircle className="w-5 h-5 text-green-600" />}
            loading={loading}
          />
          <MetricCard
            title="Faturas Pendentes"
            value={metrics.pending}
            subtitle={`R$ ${metrics.pendingAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
            icon={<Clock className="w-5 h-5 text-yellow-600" />}
            loading={loading}
          />
          <MetricCard
            title="Faturas Vencidas"
            value={metrics.overdue}
            subtitle={`R$ ${metrics.overdueAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
            icon={<AlertCircle className="w-5 h-5 text-red-600" />}
            loading={loading}
          />
        </div>

        {/* Filters */}
        <SuperAdminCard title="Filtros" className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Buscar
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Número, tenant, CNPJ..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>

            {/* Tenant Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tenant
              </label>
              <TenantSelector
                selectedTenant={selectedTenant}
                onSelectTenant={setSelectedTenant}
                includeAll={true}
              />
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="all">Todos os Status</option>
                <option value="PENDING">Pendente</option>
                <option value="PAID">Pago</option>
                <option value="OVERDUE">Vencido</option>
                <option value="CANCELLED">Cancelado</option>
              </select>
            </div>

            {/* Plan Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Plano
              </label>
              <select
                value={selectedPlan}
                onChange={(e) => setSelectedPlan(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="all">Todos os Planos</option>
                <option value="STARTER">Starter</option>
                <option value="PROFESSIONAL">Professional</option>
                <option value="ENTERPRISE">Enterprise</option>
              </select>
            </div>
          </div>
        </SuperAdminCard>

        {/* Bulk Actions */}
        {selectedInvoices.length > 0 && (
          <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between">
            <span className="text-sm font-medium text-blue-900">
              {selectedInvoices.length} fatura(s) selecionada(s)
            </span>
            <div className="space-x-2">
              <button
                onClick={() => handleBulkAction('send-reminder')}
                className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
              >
                <Mail className="inline w-4 h-4 mr-1" />
                Enviar Lembretes
              </button>
              <button
                onClick={() => handleBulkAction('mark-paid')}
                className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
              >
                <CheckCircle className="inline w-4 h-4 mr-1" />
                Marcar como Pagas
              </button>
              <button
                onClick={() => handleBulkAction('cancel')}
                className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
              >
                <X className="inline w-4 h-4 mr-1" />
                Cancelar
              </button>
            </div>
          </div>
        )}

        {/* Invoices Table */}
        <SuperAdminCard title={`Faturas (${filteredInvoices.length})`}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedInvoices.length === filteredInvoices.length && filteredInvoices.length > 0}
                      onChange={toggleSelectAll}
                      className="rounded border-gray-300"
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Número
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tenant
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Plano
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Valor
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Período
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vencimento
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={9} className="px-4 py-8 text-center text-gray-500">
                      Carregando faturas...
                    </td>
                  </tr>
                ) : filteredInvoices.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-4 py-8 text-center text-gray-500">
                      Nenhuma fatura encontrada
                    </td>
                  </tr>
                ) : (
                  filteredInvoices.map((invoice) => (
                    <tr key={invoice.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4">
                        <input
                          type="checkbox"
                          checked={selectedInvoices.includes(invoice.id)}
                          onChange={() => toggleInvoiceSelection(invoice.id)}
                          className="rounded border-gray-300"
                        />
                      </td>
                      <td className="px-4 py-4 text-sm font-medium text-gray-900">
                        {invoice.number}
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {invoice.tenant.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {invoice.tenant.cnpj}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        {getPlanBadge(invoice.plan)}
                      </td>
                      <td className="px-4 py-4 text-sm font-semibold text-gray-900">
                        R$ {invoice.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-4 py-4">
                        {getStatusBadge(invoice.status)}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-500">
                        {invoice.period}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-500">
                        {new Date(invoice.dueDate).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleViewInvoice(invoice)}
                            className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                            title="Ver detalhes"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {invoice.status === 'PENDING' && (
                            <>
                              <button
                                onClick={() => handleSendReminder(invoice.id)}
                                className="p-1 text-yellow-600 hover:bg-yellow-50 rounded"
                                title="Enviar lembrete"
                              >
                                <Mail className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleMarkAsPaid(invoice.id)}
                                className="p-1 text-green-600 hover:bg-green-50 rounded"
                                title="Marcar como pago"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </button>
                            </>
                          )}
                          {invoice.status !== 'CANCELLED' && (
                            <button
                              onClick={() => handleCancelInvoice(invoice.id)}
                              className="p-1 text-red-600 hover:bg-red-50 rounded"
                              title="Cancelar"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </SuperAdminCard>
      </div>

      {/* Invoice Detail Modal */}
      {showInvoiceModal && selectedInvoice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">
                Fatura {selectedInvoice.number}
              </h2>
              <button
                onClick={() => setShowInvoiceModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Invoice Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Tenant
                  </label>
                  <div className="text-base font-semibold text-gray-900">
                    {selectedInvoice.tenant.name}
                  </div>
                  <div className="text-sm text-gray-500">
                    {selectedInvoice.tenant.cnpj}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Status
                  </label>
                  <div>
                    {getStatusBadge(selectedInvoice.status)}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Plano
                  </label>
                  <div>
                    {getPlanBadge(selectedInvoice.plan)}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Período
                  </label>
                  <div className="text-base font-semibold text-gray-900">
                    {selectedInvoice.period}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Data de Vencimento
                  </label>
                  <div className="text-base font-semibold text-gray-900">
                    {new Date(selectedInvoice.dueDate).toLocaleDateString('pt-BR')}
                  </div>
                </div>
                {selectedInvoice.paidAt && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Pago em
                    </label>
                    <div className="text-base font-semibold text-gray-900">
                      {new Date(selectedInvoice.paidAt).toLocaleDateString('pt-BR')}
                    </div>
                  </div>
                )}
              </div>

              {/* Invoice Items */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Itens da Fatura
                </h3>
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                          Descrição
                        </th>
                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">
                          Qtd
                        </th>
                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">
                          Valor Unit.
                        </th>
                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">
                          Total
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {selectedInvoice.items.map((item, index) => (
                        <tr key={index}>
                          <td className="px-4 py-2 text-sm text-gray-900">
                            {item.description}
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-900 text-right">
                            {item.quantity}
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-900 text-right">
                            R$ {item.unitPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </td>
                          <td className="px-4 py-2 text-sm font-semibold text-gray-900 text-right">
                            R$ {item.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-gray-50">
                      <tr>
                        <td colSpan={3} className="px-4 py-2 text-right text-sm font-semibold text-gray-900">
                          Total:
                        </td>
                        <td className="px-4 py-2 text-right text-base font-bold text-gray-900">
                          R$ {selectedInvoice.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => alert('Funcionalidade de download PDF em desenvolvimento')}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  <Download className="inline w-4 h-4 mr-2" />
                  Baixar PDF
                </button>
                {selectedInvoice.status === 'PENDING' && (
                  <>
                    <button
                      onClick={() => {
                        handleSendReminder(selectedInvoice.id);
                        setShowInvoiceModal(false);
                      }}
                      className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
                    >
                      <Mail className="inline w-4 h-4 mr-2" />
                      Enviar Lembrete
                    </button>
                    <button
                      onClick={() => {
                        handleMarkAsPaid(selectedInvoice.id);
                        setShowInvoiceModal(false);
                      }}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      <CheckCircle className="inline w-4 h-4 mr-2" />
                      Marcar como Pago
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

// Mock data for development
const mockInvoices: Invoice[] = [
  {
    id: '1',
    number: 'INV-2025-001',
    tenantId: 'demo',
    tenant: {
      id: 'demo',
      name: 'Prefeitura de São Paulo',
      cnpj: '46.395.000/0001-39'
    },
    plan: 'ENTERPRISE',
    amount: 10000,
    status: 'PAID',
    period: '2025-01',
    dueDate: '2025-01-10',
    paidAt: '2025-01-08',
    createdAt: '2025-01-01',
    items: [
      {
        description: 'Assinatura Plano Enterprise - Janeiro 2025',
        quantity: 1,
        unitPrice: 10000,
        total: 10000
      }
    ]
  },
  {
    id: '2',
    number: 'INV-2025-002',
    tenantId: 'tenant2',
    tenant: {
      id: 'tenant2',
      name: 'Prefeitura do Rio de Janeiro',
      cnpj: '42.498.000/0001-48'
    },
    plan: 'PROFESSIONAL',
    amount: 5000,
    status: 'PENDING',
    period: '2025-01',
    dueDate: '2025-01-15',
    createdAt: '2025-01-01',
    items: [
      {
        description: 'Assinatura Plano Professional - Janeiro 2025',
        quantity: 1,
        unitPrice: 5000,
        total: 5000
      }
    ]
  },
  {
    id: '3',
    number: 'INV-2025-003',
    tenantId: 'tenant3',
    tenant: {
      id: 'tenant3',
      name: 'Prefeitura de Belo Horizonte',
      cnpj: '18.715.000/0001-40'
    },
    plan: 'STARTER',
    amount: 2500,
    status: 'OVERDUE',
    period: '2024-12',
    dueDate: '2024-12-10',
    createdAt: '2024-12-01',
    items: [
      {
        description: 'Assinatura Plano Starter - Dezembro 2024',
        quantity: 1,
        unitPrice: 2500,
        total: 2500
      }
    ]
  },
  {
    id: '4',
    number: 'INV-2025-004',
    tenantId: 'tenant4',
    tenant: {
      id: 'tenant4',
      name: 'Prefeitura de Brasília',
      cnpj: '00.394.676/0001-61'
    },
    plan: 'PROFESSIONAL',
    amount: 5000,
    status: 'PENDING',
    period: '2025-01',
    dueDate: '2025-01-20',
    createdAt: '2025-01-01',
    items: [
      {
        description: 'Assinatura Plano Professional - Janeiro 2025',
        quantity: 1,
        unitPrice: 5000,
        total: 5000
      }
    ]
  },
  {
    id: '5',
    number: 'INV-2024-125',
    tenantId: 'tenant5',
    tenant: {
      id: 'tenant5',
      name: 'Prefeitura de Curitiba',
      cnpj: '76.416.940/0001-28'
    },
    plan: 'ENTERPRISE',
    amount: 10000,
    status: 'CANCELLED',
    period: '2024-12',
    dueDate: '2024-12-15',
    createdAt: '2024-12-01',
    items: [
      {
        description: 'Assinatura Plano Enterprise - Dezembro 2024',
        quantity: 1,
        unitPrice: 10000,
        total: 10000
      }
    ]
  }
];
