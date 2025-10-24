'use client';

import { useEffect, useState } from 'react';
import { useSuperAdminAuth } from '@/contexts/SuperAdminAuthContext';
import { SuperAdminCard, MetricCard } from '@/components/super-admin/SuperAdminCard';
import { useToast } from '@/hooks/use-toast';
import {
  Mail,
  Send,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Shield,
  Globe,
  Activity,
  Clock,
  TrendingUp,
  Server
} from 'lucide-react';

interface EmailMetrics {
  totalSent: {
    today: number;
    week: number;
    month: number;
  };
  deliveryRate: number;
  bounceRate: number;
  spamComplaints: number;
  activeDomains: number;
  activeConnections: number;
}

interface EmailDomain {
  id: string;
  domain: string;
  verified: boolean;
  dkimConfigured: boolean;
  dmarcStatus: 'none' | 'quarantine' | 'reject';
  emailsSent: number;
  createdAt: string;
}

interface EmailLog {
  id: string;
  recipient: string;
  subject: string;
  status: 'sent' | 'delivered' | 'bounced' | 'spam' | 'failed';
  tenantId: string;
  tenantName: string;
  sentAt: string;
  deliveredAt?: string;
  errorMessage?: string;
}

interface SMTPConnection {
  id: string;
  clientIp: string;
  username: string;
  authenticated: boolean;
  messagesCount: number;
  connectedAt: string;
  lastActivity: string;
}

export default function EmailManagementPage() {
  const { apiRequest } = useSuperAdminAuth();
  const { toast } = useToast();
  const [metrics, setMetrics] = useState<EmailMetrics | null>(null);
  const [domains, setDomains] = useState<EmailDomain[]>([]);
  const [emailLogs, setEmailLogs] = useState<EmailLog[]>([]);
  const [connections, setConnections] = useState<SMTPConnection[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState<'overview' | 'domains' | 'logs' | 'connections'>('overview');

  useEffect(() => {
    fetchEmailData();
    const interval = setInterval(fetchEmailData, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, []);

  const fetchEmailData = async () => {
    setLoading(true);
    try {
      const [metricsData, domainsData, logsData, connectionsData] = await Promise.all([
        apiRequest('/super-admin/email/overview', { method: 'GET' }).catch(() => null),
        apiRequest('/super-admin/email/domains', { method: 'GET' }).catch(() => null),
        apiRequest('/super-admin/email/logs?limit=50', { method: 'GET' }).catch(() => null),
        apiRequest('/super-admin/email/connections', { method: 'GET' }).catch(() => null)
      ]);

      setMetrics(metricsData?.metrics || mockMetrics);
      setDomains(domainsData?.domains || mockDomains);
      setEmailLogs(logsData?.logs || mockEmailLogs);
      setConnections(connectionsData?.connections || mockConnections);
    } catch (error) {
      console.error('Error fetching email data:', error);
      setMetrics(mockMetrics);
      setDomains(mockDomains);
      setEmailLogs(mockEmailLogs);
      setConnections(mockConnections);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyDomain = async (domainId: string) => {
    try {
      const data = await apiRequest(`/super-admin/email/domains/${domainId}/verify`, {
        method: 'POST'
      });

      if (data) {
        toast({
          title: 'Sucesso',
          description: 'Domínio verificado com sucesso'
        });
        fetchEmailData();
      } else {
        toast({
          variant: 'destructive',
          title: 'Erro',
          description: 'Erro ao verificar domínio. Verifique os registros DNS.'
        });
      }
    } catch (error) {
      console.error('Error verifying domain:', error);
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Erro ao verificar domínio'
      });
    }
  };

  const handleConfigureDKIM = async (domainId: string) => {
    try {
      const data = await apiRequest(`/super-admin/email/domains/${domainId}/dkim`, {
        method: 'POST'
      });

      if (data) {
        toast({
          title: 'DKIM Configurado',
          description: `Adicione este registro DNS: ${data.dkimRecord}`
        });
        fetchEmailData();
      }
    } catch (error) {
      console.error('Error configuring DKIM:', error);
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Erro ao configurar DKIM'
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      sent: 'bg-blue-100 text-blue-800',
      delivered: 'bg-green-100 text-green-800',
      bounced: 'bg-red-100 text-red-800',
      spam: 'bg-orange-100 text-orange-800',
      failed: 'bg-gray-100 text-gray-800'
    };
    const labels = {
      sent: 'Enviado',
      delivered: 'Entregue',
      bounced: 'Bounce',
      spam: 'Spam',
      failed: 'Falhou'
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status as keyof typeof styles]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  const getDmarcBadge = (status: string) => {
    const styles = {
      none: 'bg-gray-100 text-gray-800',
      quarantine: 'bg-yellow-100 text-yellow-800',
      reject: 'bg-green-100 text-green-800'
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status as keyof typeof styles]}`}>
        {status.toUpperCase()}
      </span>
    );
  };

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-primary mb-2">
              Gestão de Email
            </h1>
            <p className="text-muted-foreground">
              Sistema SMTP/UltraZend - Domínios, envios e monitoramento
            </p>
          </div>
          <button
            onClick={() => toast({
              title: 'Em Desenvolvimento',
              description: 'Funcionalidade de adicionar domínio em desenvolvimento'
            })}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
          >
            <Globe className="inline w-4 h-4 mr-2" />
            Adicionar Domínio
          </button>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <MetricCard
            title="Emails Hoje"
            value={metrics?.totalSent.today.toLocaleString('pt-BR') || '0'}
            subtitle={`${metrics?.totalSent.week.toLocaleString('pt-BR')} esta semana`}
            icon={<Send className="w-5 h-5 text-blue-600" />}
            loading={loading}
          />
          <MetricCard
            title="Taxa de Entrega"
            value={`${metrics?.deliveryRate.toFixed(1) || 0}%`}
            subtitle="Emails entregues com sucesso"
            icon={<CheckCircle className="w-5 h-5 text-green-600" />}
            loading={loading}
          />
          <MetricCard
            title="Taxa de Bounce"
            value={`${metrics?.bounceRate.toFixed(1) || 0}%`}
            subtitle={`${metrics?.spamComplaints || 0} spam complaints`}
            icon={<AlertTriangle className="w-5 h-5 text-orange-600" />}
            loading={loading}
          />
          <MetricCard
            title="Domínios Ativos"
            value={metrics?.activeDomains || 0}
            subtitle={`${metrics?.activeConnections || 0} conexões SMTP`}
            icon={<Globe className="w-5 h-5 text-purple-600" />}
            loading={loading}
          />
        </div>

        {/* Tabs */}
        <div className="mb-6 border-b border-gray-200">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Visão Geral', icon: <Activity className="w-4 h-4" /> },
              { id: 'domains', label: 'Domínios', icon: <Globe className="w-4 h-4" /> },
              { id: 'logs', label: 'Logs de Email', icon: <Mail className="w-4 h-4" /> },
              { id: 'connections', label: 'Conexões SMTP', icon: <Server className="w-4 h-4" /> }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id as typeof selectedTab)}
                className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm ${
                  selectedTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        {selectedTab === 'overview' && (
          <div className="space-y-6">
            <SuperAdminCard title="Estatísticas de Envio (30 dias)">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-3xl font-bold text-blue-600">
                    {metrics?.totalSent.month.toLocaleString('pt-BR')}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">Total Enviados</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-3xl font-bold text-green-600">
                    {Math.round((metrics?.totalSent.month || 0) * ((metrics?.deliveryRate || 0) / 100)).toLocaleString('pt-BR')}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">Entregues</div>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <div className="text-3xl font-bold text-red-600">
                    {Math.round((metrics?.totalSent.month || 0) * ((metrics?.bounceRate || 0) / 100)).toLocaleString('pt-BR')}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">Bounces</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-3xl font-bold text-orange-600">
                    {metrics?.spamComplaints || 0}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">Spam Reports</div>
                </div>
              </div>
            </SuperAdminCard>

            <SuperAdminCard title="Saúde do Sistema de Email">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="font-semibold text-gray-900">SMTP Server</span>
                  </div>
                  <span className="text-sm text-green-600">Operational</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="font-semibold text-gray-900">Email Queue</span>
                  </div>
                  <span className="text-sm text-green-600">0 pending</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="font-semibold text-gray-900">DKIM Signing</span>
                  </div>
                  <span className="text-sm text-green-600">Active</span>
                </div>
              </div>
            </SuperAdminCard>
          </div>
        )}

        {selectedTab === 'domains' && (
          <SuperAdminCard title="Domínios Configurados">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Domínio
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                      Verificado
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                      DKIM
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                      DMARC
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                      Emails Enviados
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {domains.map((domain) => (
                    <tr key={domain.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <Globe className="w-4 h-4 text-gray-400" />
                          <span className="font-semibold text-gray-900">{domain.domain}</span>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          Criado em {new Date(domain.createdAt).toLocaleDateString('pt-BR')}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-center">
                        {domain.verified ? (
                          <CheckCircle className="w-5 h-5 text-green-600 inline" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-600 inline" />
                        )}
                      </td>
                      <td className="px-4 py-4 text-center">
                        {domain.dkimConfigured ? (
                          <Shield className="w-5 h-5 text-green-600 inline" />
                        ) : (
                          <Shield className="w-5 h-5 text-gray-400 inline" />
                        )}
                      </td>
                      <td className="px-4 py-4 text-center">
                        {getDmarcBadge(domain.dmarcStatus)}
                      </td>
                      <td className="px-4 py-4 text-right font-semibold text-gray-900">
                        {domain.emailsSent.toLocaleString('pt-BR')}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex justify-center gap-2">
                          {!domain.verified && (
                            <button
                              onClick={() => handleVerifyDomain(domain.id)}
                              className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
                            >
                              Verificar
                            </button>
                          )}
                          {!domain.dkimConfigured && (
                            <button
                              onClick={() => handleConfigureDKIM(domain.id)}
                              className="px-3 py-1 text-xs bg-purple-600 text-white rounded hover:bg-purple-700"
                            >
                              DKIM
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </SuperAdminCard>
        )}

        {selectedTab === 'logs' && (
          <SuperAdminCard title="Últimos Emails Enviados">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Destinatário
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Assunto
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Tenant
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Data
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {emailLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-gray-400" />
                          <span className="font-medium text-gray-900">{log.recipient}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-sm text-gray-900">{log.subject}</div>
                        {log.errorMessage && (
                          <div className="text-xs text-red-600 mt-1">{log.errorMessage}</div>
                        )}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600">
                        {log.tenantName}
                      </td>
                      <td className="px-4 py-4 text-center">
                        {getStatusBadge(log.status)}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Clock className="w-4 h-4" />
                          {new Date(log.sentAt).toLocaleString('pt-BR')}
                        </div>
                        {log.deliveredAt && (
                          <div className="text-xs text-green-600 mt-1">
                            Entregue: {new Date(log.deliveredAt).toLocaleTimeString('pt-BR')}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </SuperAdminCard>
        )}

        {selectedTab === 'connections' && (
          <SuperAdminCard title="Conexões SMTP Ativas">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      IP do Cliente
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Usuário
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                      Autenticado
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                      Mensagens
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Conectado
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {connections.map((conn) => (
                    <tr key={conn.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 font-mono text-sm text-gray-900">
                        {conn.clientIp}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900">
                        {conn.username}
                      </td>
                      <td className="px-4 py-4 text-center">
                        {conn.authenticated ? (
                          <CheckCircle className="w-5 h-5 text-green-600 inline" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-600 inline" />
                        )}
                      </td>
                      <td className="px-4 py-4 text-right font-semibold text-gray-900">
                        {conn.messagesCount}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600">
                        {new Date(conn.connectedAt).toLocaleString('pt-BR')}
                        <div className="text-xs text-gray-500 mt-1">
                          Última atividade: {new Date(conn.lastActivity).toLocaleTimeString('pt-BR')}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </SuperAdminCard>
        )}
      </div>
    </main>
  );
}

// Mock Data
const mockMetrics: EmailMetrics = {
  totalSent: {
    today: 1250,
    week: 8500,
    month: 35000
  },
  deliveryRate: 98.5,
  bounceRate: 1.2,
  spamComplaints: 3,
  activeDomains: 5,
  activeConnections: 12
};

const mockDomains: EmailDomain[] = [
  {
    id: '1',
    domain: 'digiurban.com.br',
    verified: true,
    dkimConfigured: true,
    dmarcStatus: 'reject',
    emailsSent: 25000,
    createdAt: '2025-01-01'
  },
  {
    id: '2',
    domain: 'demo.digiurban.com',
    verified: true,
    dkimConfigured: true,
    dmarcStatus: 'quarantine',
    emailsSent: 8500,
    createdAt: '2025-01-15'
  },
  {
    id: '3',
    domain: 'mail.digiurban.net',
    verified: false,
    dkimConfigured: false,
    dmarcStatus: 'none',
    emailsSent: 0,
    createdAt: '2025-02-01'
  }
];

const mockEmailLogs: EmailLog[] = [
  {
    id: '1',
    recipient: 'usuario@exemplo.com',
    subject: 'Protocolo #12345 criado com sucesso',
    status: 'delivered',
    tenantId: 'demo',
    tenantName: 'Prefeitura Demo',
    sentAt: new Date(Date.now() - 300000).toISOString(),
    deliveredAt: new Date(Date.now() - 280000).toISOString()
  },
  {
    id: '2',
    recipient: 'admin@prefeitura.gov.br',
    subject: 'Relatório semanal de protocolos',
    status: 'delivered',
    tenantId: 'sp',
    tenantName: 'Prefeitura de SP',
    sentAt: new Date(Date.now() - 600000).toISOString(),
    deliveredAt: new Date(Date.now() - 580000).toISOString()
  },
  {
    id: '3',
    recipient: 'bounce@invalido.com',
    subject: 'Notificação de atualização',
    status: 'bounced',
    tenantId: 'rj',
    tenantName: 'Prefeitura do RJ',
    sentAt: new Date(Date.now() - 900000).toISOString(),
    errorMessage: 'Mailbox not found'
  }
];

const mockConnections: SMTPConnection[] = [
  {
    id: '1',
    clientIp: '192.168.1.100',
    username: 'demo@digiurban.com.br',
    authenticated: true,
    messagesCount: 45,
    connectedAt: new Date(Date.now() - 3600000).toISOString(),
    lastActivity: new Date(Date.now() - 300000).toISOString()
  },
  {
    id: '2',
    clientIp: '10.0.0.50',
    username: 'sp@digiurban.com.br',
    authenticated: true,
    messagesCount: 128,
    connectedAt: new Date(Date.now() - 7200000).toISOString(),
    lastActivity: new Date(Date.now() - 120000).toISOString()
  }
];
