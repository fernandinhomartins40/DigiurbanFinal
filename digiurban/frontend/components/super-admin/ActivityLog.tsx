'use client';

import { useEffect, useState } from 'react';
import { Clock, User, FileText, AlertCircle, CheckCircle, XCircle } from 'lucide-react';

interface ActivityLogEntry {
  id: string;
  action: string;
  user: string;
  resourceType?: string;
  resourceId?: string;
  timestamp: string;
  success: boolean;
  details?: string;
}

interface ActivityLogProps {
  tenantId?: string;
  limit?: number;
  showFilters?: boolean;
  className?: string;
}

export function ActivityLog({
  tenantId,
  limit = 20,
  showFilters = false,
  className = ''
}: ActivityLogProps) {
  const [activities, setActivities] = useState<ActivityLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'success' | 'error'>('all');

  useEffect(() => {
    fetchActivityLog();
  }, [tenantId, limit, filter]);

  const fetchActivityLog = async () => {
    setLoading(true);
    try {
      // Token via useSuperAdminAuth;
      const params = new URLSearchParams();
      if (tenantId) params.append('tenantId', tenantId);
      params.append('limit', limit.toString());
      if (filter !== 'all') params.append('success', (filter === 'success').toString());

      const response = await fetch(`http://localhost:3001/api/super-admin/audit-log?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setActivities(data.logs || []);
      }
    } catch (error) {
      console.error('Error fetching activity log:', error);
    } finally {
      setLoading(false);
    }
  };

  const getActionIcon = (action: string) => {
    if (action.includes('create')) return <FileText size={16} className="text-blue-500" />;
    if (action.includes('update')) return <AlertCircle size={16} className="text-yellow-500" />;
    if (action.includes('delete')) return <XCircle size={16} className="text-red-500" />;
    return <CheckCircle size={16} className="text-green-500" />;
  };

  const getActionColor = (success: boolean) => {
    return success ? 'border-l-green-500' : 'border-l-red-500';
  };

  const formatAction = (action: string) => {
    return action
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Agora mesmo';
    if (diffMins < 60) return `${diffMins} min atrás`;
    if (diffHours < 24) return `${diffHours}h atrás`;
    if (diffDays < 7) return `${diffDays}d atrás`;
    return date.toLocaleDateString('pt-BR');
  };

  if (loading) {
    return (
      <div className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}>
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/4"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg border border-gray-200 ${className}`}>
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Log de Atividades</h3>
        {showFilters && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Todas
            </button>
            <button
              onClick={() => setFilter('success')}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                filter === 'success'
                  ? 'bg-green-100 text-green-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Sucesso
            </button>
            <button
              onClick={() => setFilter('error')}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                filter === 'error'
                  ? 'bg-red-100 text-red-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Erros
            </button>
          </div>
        )}
      </div>

      <div className="divide-y divide-gray-100">
        {activities.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <FileText size={48} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500 font-medium">Nenhuma atividade registrada</p>
            <p className="text-sm text-gray-400 mt-1">
              As ações do Super Admin aparecerão aqui
            </p>
          </div>
        ) : (
          activities.map((activity) => (
            <div
              key={activity.id}
              className={`px-6 py-4 hover:bg-gray-50 transition-colors border-l-4 ${getActionColor(activity.success)}`}
            >
              <div className="flex items-start gap-4">
                <div className="mt-1">
                  {getActionIcon(activity.action)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-semibold text-gray-900">
                      {formatAction(activity.action)}
                    </p>
                    {activity.resourceType && (
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs font-medium">
                        {activity.resourceType}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <User size={12} />
                      <span>{activity.user}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock size={12} />
                      <span>{formatTimestamp(activity.timestamp)}</span>
                    </div>
                  </div>
                  {activity.details && (
                    <p className="text-xs text-gray-600 mt-2 line-clamp-2">
                      {activity.details}
                    </p>
                  )}
                </div>
                <div>
                  {activity.success ? (
                    <CheckCircle size={16} className="text-green-500" />
                  ) : (
                    <XCircle size={16} className="text-red-500" />
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {activities.length > 0 && (
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <button
            onClick={fetchActivityLog}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            Atualizar log
          </button>
        </div>
      )}
    </div>
  );
}
