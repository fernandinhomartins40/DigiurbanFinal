'use client';

import { useEffect, useState } from 'react';
import { useSuperAdminAuth } from '@/contexts/SuperAdminAuthContext';
import { SuperAdminCard, MetricCard } from '@/components/super-admin/SuperAdminCard';
import {
  Database,
  HardDrive,
  Zap,
  Clock,
  Download,
  Upload,
  Trash2,
  RefreshCw,
  Activity,
  Settings,
  Play,
  Pause,
  AlertCircle
} from 'lucide-react';

interface OperationsMetrics {
  lastBackup: string | null;
  databaseSize: number; // GB
  cacheStatus: 'ok' | 'warning' | 'error';
  cacheHitRate: number; // percentage
  pendingJobs: number;
  failedJobs: number;
  systemUptime: number; // days
}

interface Backup {
  id: string;
  filename: string;
  size: number; // bytes
  type: 'auto' | 'manual';
  createdAt: string;
  status: 'completed' | 'failed' | 'in_progress';
}

interface CacheStats {
  type: string;
  keys: number;
  memory: number; // bytes
  hitRate: number; // percentage
  hits: number;
  misses: number;
}

interface Job {
  id: string;
  name: string;
  type: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress: number; // percentage
  createdAt: string;
  startedAt?: string;
  completedAt?: string;
  errorMessage?: string;
}

export default function OperationsManagementPage() {
  const { apiRequest } = useSuperAdminAuth();
  const [metrics, setMetrics] = useState<OperationsMetrics | null>(null);
  const [backups, setBackups] = useState<Backup[]>([]);
  const [cacheStats, setCacheStats] = useState<CacheStats[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState<'overview' | 'backups' | 'cache' | 'jobs'>('overview');

  useEffect(() => {
    fetchOperationsData();
    const interval = setInterval(fetchOperationsData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchOperationsData = async () => {
    setLoading(true);
    try {
      const [metricsData, backupsData, cacheData, jobsData] = await Promise.all([
        apiRequest('/super-admin/operations/metrics', { method: 'GET' }).catch(() => null),
        apiRequest('/super-admin/operations/backups', { method: 'GET' }).catch(() => null),
        apiRequest('/super-admin/operations/cache', { method: 'GET' }).catch(() => null),
        apiRequest('/super-admin/operations/jobs', { method: 'GET' }).catch(() => null)
      ]);

      setMetrics(metricsData?.metrics || mockMetrics);
      setBackups(backupsData?.backups || mockBackups);
      setCacheStats(cacheData?.stats || mockCacheStats);
      setJobs(jobsData?.jobs || mockJobs);
    } catch (error) {
      console.error('Error fetching operations data:', error);
      setMetrics(mockMetrics);
      setBackups(mockBackups);
      setCacheStats(mockCacheStats);
      setJobs(mockJobs);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBackup = async () => {
    if (!confirm('Criar backup agora? Este processo pode levar alguns minutos.')) return;

    try {
      const data = await apiRequest('/super-admin/operations/backups/create', {
        method: 'POST'
      });

      if (data) {
        alert('Backup iniciado com sucesso');
        fetchOperationsData();
      }
    } catch (error) {
      console.error('Error creating backup:', error);
      alert('Erro ao criar backup');
    }
  };

  const handleClearCache = async (cacheType: string) => {
    if (!confirm(`Limpar cache ${cacheType}?`)) return;

    try {
      const data = await apiRequest('/super-admin/operations/cache/clear', {
        method: 'POST',
        body: JSON.stringify({ type: cacheType })
      });

      if (data) {
        alert('Cache limpo com sucesso');
        fetchOperationsData();
      }
    } catch (error) {
      console.error('Error clearing cache:', error);
      alert('Erro ao limpar cache');
    }
  };

  const handleRetryJob = async (jobId: string) => {
    try {
      const data = await apiRequest(`/super-admin/operations/jobs/${jobId}/retry`, {
        method: 'POST'
      });

      if (data) {
        alert('Job reenfileirado com sucesso');
        fetchOperationsData();
      }
    } catch (error) {
      console.error('Error retrying job:', error);
      alert('Erro ao reprocessar job');
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const formatUptime = (days: number) => {
    if (days < 1) return `${Math.round(days * 24)} horas`;
    return `${Math.floor(days)} dias`;
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      completed: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800',
      in_progress: 'bg-blue-100 text-blue-800',
      pending: 'bg-yellow-100 text-yellow-800',
      running: 'bg-purple-100 text-purple-800'
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status as keyof typeof styles] || styles.pending}`}>
        {status}
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
              Gestão de Operações
            </h1>
            <p className="text-muted-foreground">
              Backups, cache, jobs e manutenção do sistema
            </p>
          </div>
          <div className="space-x-2">
            <button
              onClick={handleCreateBackup}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
            >
              <Database className="inline w-4 h-4 mr-2" />
              Criar Backup
            </button>
          </div>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <MetricCard
            title="Último Backup"
            value={metrics?.lastBackup ? new Date(metrics.lastBackup).toLocaleDateString('pt-BR') : 'Nunca'}
            subtitle={metrics?.lastBackup ? new Date(metrics.lastBackup).toLocaleTimeString('pt-BR') : 'Criar primeiro backup'}
            icon={<Database className="w-5 h-5 text-blue-600" />}
            loading={loading}
          />
          <MetricCard
            title="Tamanho do DB"
            value={`${metrics?.databaseSize.toFixed(2) || 0} GB`}
            subtitle="Banco de dados principal"
            icon={<HardDrive className="w-5 h-5 text-purple-600" />}
            loading={loading}
          />
          <MetricCard
            title="Cache Hit Rate"
            value={`${metrics?.cacheHitRate.toFixed(1) || 0}%`}
            subtitle={metrics?.cacheStatus === 'ok' ? 'Performance OK' : 'Atenção necessária'}
            icon={<Zap className="w-5 h-5 text-green-600" />}
            loading={loading}
          />
          <MetricCard
            title="System Uptime"
            value={formatUptime(metrics?.systemUptime || 0)}
            subtitle={`${metrics?.pendingJobs || 0} jobs pendentes`}
            icon={<Activity className="w-5 h-5 text-orange-600" />}
            loading={loading}
          />
        </div>

        {/* Tabs */}
        <div className="mb-6 border-b border-gray-200">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Visão Geral', icon: <Settings className="w-4 h-4" /> },
              { id: 'backups', label: 'Backups', icon: <Database className="w-4 h-4" /> },
              { id: 'cache', label: 'Cache', icon: <Zap className="w-4 h-4" /> },
              { id: 'jobs', label: 'Job Queue', icon: <Activity className="w-4 h-4" /> }
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
            <SuperAdminCard title="Status dos Componentes">
              <div className="space-y-3">
                {[
                  { name: 'Database', status: 'operational', value: `${metrics?.databaseSize.toFixed(2)} GB` },
                  { name: 'Cache Layer', status: metrics?.cacheStatus || 'ok', value: `${metrics?.cacheHitRate.toFixed(1)}% hit rate` },
                  { name: 'Job Queue', status: (metrics?.pendingJobs || 0) > 100 ? 'warning' : 'ok', value: `${metrics?.pendingJobs} pending` },
                  { name: 'Backup System', status: metrics?.lastBackup ? 'ok' : 'warning', value: metrics?.lastBackup ? 'Configurado' : 'Sem backups' }
                ].map((component) => (
                  <div
                    key={component.name}
                    className={`flex items-center justify-between p-3 rounded-lg ${
                      component.status === 'operational' || component.status === 'ok'
                        ? 'bg-green-50'
                        : component.status === 'warning'
                        ? 'bg-yellow-50'
                        : 'bg-red-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          component.status === 'operational' || component.status === 'ok'
                            ? 'bg-green-500'
                            : component.status === 'warning'
                            ? 'bg-yellow-500'
                            : 'bg-red-500'
                        }`}
                      ></div>
                      <span className="font-semibold text-gray-900">{component.name}</span>
                    </div>
                    <span className="text-sm text-gray-600">{component.value}</span>
                  </div>
                ))}
              </div>
            </SuperAdminCard>

            {metrics && metrics.failedJobs > 0 && (
              <SuperAdminCard title="Alertas" className="border-l-4 border-red-500">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-8 h-8 text-red-600 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-900 mb-1">
                      {metrics.failedJobs} jobs falharam
                    </p>
                    <p className="text-sm text-gray-600">
                      Verifique a fila de jobs e tente reprocessar os jobs com erro.
                    </p>
                  </div>
                </div>
              </SuperAdminCard>
            )}
          </div>
        )}

        {selectedTab === 'backups' && (
          <SuperAdminCard title="Backups Disponíveis">
            <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-gray-700 mb-2">
                <strong>Política de Retenção:</strong> Backups automáticos diários às 03:00.
                Mantidos por 30 dias.
              </p>
              <p className="text-xs text-gray-600">
                Backups manuais são mantidos indefinidamente até exclusão manual.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Arquivo
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                      Tipo
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                      Tamanho
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Criado em
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {backups.map((backup) => (
                    <tr key={backup.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <Database className="w-4 h-4 text-gray-400" />
                          <span className="font-mono text-sm text-gray-900">{backup.filename}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            backup.type === 'auto'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-purple-100 text-purple-800'
                          }`}
                        >
                          {backup.type === 'auto' ? 'Automático' : 'Manual'}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-right font-semibold text-gray-900">
                        {formatBytes(backup.size)}
                      </td>
                      <td className="px-4 py-4 text-center">
                        {getStatusBadge(backup.status)}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600">
                        {new Date(backup.createdAt).toLocaleString('pt-BR')}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex justify-center gap-2">
                          {backup.status === 'completed' && (
                            <>
                              <button
                                onClick={() => alert('Download em desenvolvimento')}
                                className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                                title="Download"
                              >
                                <Download className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => alert('Restore em desenvolvimento')}
                                className="p-1 text-green-600 hover:bg-green-50 rounded"
                                title="Restaurar"
                              >
                                <Upload className="w-4 h-4" />
                              </button>
                              {backup.type === 'manual' && (
                                <button
                                  onClick={() => alert('Delete em desenvolvimento')}
                                  className="p-1 text-red-600 hover:bg-red-50 rounded"
                                  title="Deletar"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              )}
                            </>
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

        {selectedTab === 'cache' && (
          <div className="space-y-6">
            <SuperAdminCard title="Estatísticas de Cache">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {cacheStats.map((cache) => (
                  <div key={cache.type} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-semibold text-gray-900">{cache.type}</h3>
                      <button
                        onClick={() => handleClearCache(cache.type)}
                        className="text-xs text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Keys:</span>
                        <span className="font-semibold text-gray-900">
                          {cache.keys.toLocaleString('pt-BR')}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Memória:</span>
                        <span className="font-semibold text-gray-900">
                          {formatBytes(cache.memory)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Hit Rate:</span>
                        <span
                          className={`font-semibold ${
                            cache.hitRate >= 80
                              ? 'text-green-600'
                              : cache.hitRate >= 60
                              ? 'text-yellow-600'
                              : 'text-red-600'
                          }`}
                        >
                          {cache.hitRate.toFixed(1)}%
                        </span>
                      </div>
                      <div className="pt-2 border-t border-gray-200">
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>Hits: {cache.hits.toLocaleString('pt-BR')}</span>
                          <span>Misses: {cache.misses.toLocaleString('pt-BR')}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </SuperAdminCard>
          </div>
        )}

        {selectedTab === 'jobs' && (
          <SuperAdminCard title="Fila de Jobs">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Nome
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Tipo
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                      Status
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                      Progresso
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Criado
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {jobs.map((job) => (
                    <tr key={job.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 font-semibold text-gray-900">
                        {job.name}
                        {job.errorMessage && (
                          <div className="text-xs text-red-600 mt-1">{job.errorMessage}</div>
                        )}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600">{job.type}</td>
                      <td className="px-4 py-4 text-center">
                        {getStatusBadge(job.status)}
                      </td>
                      <td className="px-4 py-4">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              job.status === 'completed'
                                ? 'bg-green-500'
                                : job.status === 'failed'
                                ? 'bg-red-500'
                                : 'bg-blue-500'
                            }`}
                            style={{ width: `${job.progress}%` }}
                          ></div>
                        </div>
                        <div className="text-xs text-gray-500 text-center mt-1">
                          {job.progress}%
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600">
                        {new Date(job.createdAt).toLocaleString('pt-BR')}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex justify-center gap-2">
                          {job.status === 'failed' && (
                            <button
                              onClick={() => handleRetryJob(job.id)}
                              className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                              title="Tentar novamente"
                            >
                              <RefreshCw className="w-4 h-4" />
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
      </div>
    </main>
  );
}

// Mock Data
const mockMetrics: OperationsMetrics = {
  lastBackup: new Date(Date.now() - 86400000).toISOString(),
  databaseSize: 12.5,
  cacheStatus: 'ok',
  cacheHitRate: 92.3,
  pendingJobs: 5,
  failedJobs: 2,
  systemUptime: 45.3
};

const mockBackups: Backup[] = [
  {
    id: '1',
    filename: 'backup_2025-02-03_03-00-00.sql.gz',
    size: 2147483648,
    type: 'auto',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    status: 'completed'
  },
  {
    id: '2',
    filename: 'backup_2025-02-02_03-00-00.sql.gz',
    size: 2100000000,
    type: 'auto',
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    status: 'completed'
  },
  {
    id: '3',
    filename: 'backup_manual_2025-02-01.sql.gz',
    size: 2050000000,
    type: 'manual',
    createdAt: new Date(Date.now() - 259200000).toISOString(),
    status: 'completed'
  }
];

const mockCacheStats: CacheStats[] = [
  {
    type: 'Redis',
    keys: 45230,
    memory: 512000000,
    hitRate: 92.3,
    hits: 1850000,
    misses: 155000
  },
  {
    type: 'Application',
    keys: 12500,
    memory: 128000000,
    hitRate: 88.5,
    hits: 520000,
    misses: 67500
  },
  {
    type: 'Query',
    keys: 8200,
    memory: 256000000,
    hitRate: 95.2,
    hits: 980000,
    misses: 49500
  }
];

const mockJobs: Job[] = [
  {
    id: '1',
    name: 'Processamento de Faturas',
    type: 'billing',
    status: 'completed',
    progress: 100,
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    startedAt: new Date(Date.now() - 3500000).toISOString(),
    completedAt: new Date(Date.now() - 1800000).toISOString()
  },
  {
    id: '2',
    name: 'Envio de Emails em Lote',
    type: 'email',
    status: 'running',
    progress: 65,
    createdAt: new Date(Date.now() - 1800000).toISOString(),
    startedAt: new Date(Date.now() - 1700000).toISOString()
  },
  {
    id: '3',
    name: 'Geração de Relatórios',
    type: 'reports',
    status: 'pending',
    progress: 0,
    createdAt: new Date(Date.now() - 900000).toISOString()
  },
  {
    id: '4',
    name: 'Sincronização de Dados',
    type: 'sync',
    status: 'failed',
    progress: 45,
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    startedAt: new Date(Date.now() - 7100000).toISOString(),
    errorMessage: 'Connection timeout to external API'
  }
];
