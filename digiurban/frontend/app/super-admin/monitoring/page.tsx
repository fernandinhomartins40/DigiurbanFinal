'use client';

import { Activity, Server, Database, Mail, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { useSystemMetrics } from '@/hooks/super-admin';
import { SuperAdminCard, MetricCard } from '@/components/super-admin';

export default function MonitoringPage() {
  const { services, alerts, metrics, loading, acknowledgeAlert, resolveAlert } = useSystemMetrics(true, 30000);

  const overallStatus = services.every(s => s.status === 'operational') ? 'operational' :
    services.some(s => s.status === 'outage') ? 'outage' : 'degraded';

  const statusColors = {
    operational: 'text-green-600 bg-green-100',
    degraded: 'text-yellow-600 bg-yellow-100',
    outage: 'text-red-600 bg-red-100'
  };

  const statusIcons = {
    operational: <CheckCircle size={24} />,
    degraded: <AlertTriangle size={24} />,
    outage: <XCircle size={24} />
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Monitoring em Tempo Real</h1>
          <p className="text-gray-600">
            Acompanhe o status e performance de todos os serviços da plataforma
          </p>
        </div>
        <div className={`flex items-center gap-3 px-6 py-3 rounded-lg ${statusColors[overallStatus]}`}>
          {statusIcons[overallStatus]}
          <div>
            <div className="text-sm font-semibold uppercase">{overallStatus}</div>
            <div className="text-xs">Status Geral</div>
          </div>
        </div>
      </div>

      {/* System Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {metrics.map((metric) => (
          <MetricCard
            key={metric.id}
            title={`${metric.metricCategory.toUpperCase()} ${metric.metricName}`}
            value={`${metric.currentValue.toFixed(1)}${metric.unit}`}
            icon={<Activity size={24} />}
            color={
              metric.currentValue >= (metric.thresholdCrit || 90) ? 'red' :
              metric.currentValue >= (metric.thresholdWarn || 70) ? 'yellow' :
              'green'
            }
            loading={loading}
          />
        ))}
      </div>

      {/* Active Alerts */}
      {alerts.length > 0 && (
        <SuperAdminCard
          title={`Alertas Ativos (${alerts.length})`}
          description="Alertas que requerem atenção"
        >
          <div className="space-y-3">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-4 rounded-lg border-l-4 ${
                  alert.type === 'critical' ? 'border-red-500 bg-red-50' :
                  alert.type === 'warning' ? 'border-yellow-500 bg-yellow-50' :
                  'border-blue-500 bg-blue-50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <AlertTriangle size={18} className={
                        alert.type === 'critical' ? 'text-red-600' :
                        alert.type === 'warning' ? 'text-yellow-600' :
                        'text-blue-600'
                      } />
                      <h4 className="font-semibold text-gray-900">{alert.title}</h4>
                      <span className={`px-2 py-0.5 text-xs font-semibold rounded uppercase ${
                        alert.type === 'critical' ? 'bg-red-200 text-red-800' :
                        alert.type === 'warning' ? 'bg-yellow-200 text-yellow-800' :
                        'bg-blue-200 text-blue-800'
                      }`}>
                        {alert.type}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 mb-2">{alert.message}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(alert.createdAt).toLocaleString('pt-BR')}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {alert.status === 'active' && (
                      <>
                        <button
                          onClick={() => acknowledgeAlert(alert.id)}
                          className="px-3 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50"
                        >
                          Reconhecer
                        </button>
                        <button
                          onClick={() => resolveAlert(alert.id)}
                          className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
                        >
                          Resolver
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </SuperAdminCard>
      )}

      {/* Services Status */}
      <SuperAdminCard
        title="Status dos Serviços"
        description="Monitoramento de todos os serviços críticos"
        loading={loading}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {services.map((service) => {
            const ServiceIcon = service.serviceName.includes('API') ? Server :
              service.serviceName.includes('Database') ? Database :
              service.serviceName.includes('Email') ? Mail : Activity;

            return (
              <div
                key={service.id}
                className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${
                      service.status === 'operational' ? 'bg-green-100' :
                      service.status === 'degraded' ? 'bg-yellow-100' :
                      'bg-red-100'
                    }`}>
                      <ServiceIcon size={20} className={
                        service.status === 'operational' ? 'text-green-600' :
                        service.status === 'degraded' ? 'text-yellow-600' :
                        'text-red-600'
                      } />
                    </div>
                    <h4 className="font-semibold text-gray-900">{service.serviceName}</h4>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    service.status === 'operational' ? 'bg-green-100 text-green-700' :
                    service.status === 'degraded' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {service.status}
                  </span>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Response Time:</span>
                    <span className="font-medium">{service.responseTimeMs}ms</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Uptime:</span>
                    <span className="font-medium">{service.uptimePercentage}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Last Check:</span>
                    <span className="font-medium">
                      {new Date(service.lastCheck).toLocaleTimeString('pt-BR')}
                    </span>
                  </div>
                </div>

                {service.errorMessage && (
                  <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-700">
                    {service.errorMessage}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </SuperAdminCard>

      {/* Auto-refresh indicator */}
      <div className="text-center text-sm text-gray-500">
        <Activity size={14} className="inline mr-1 animate-pulse" />
        Atualizando automaticamente a cada 30 segundos
      </div>
    </div>
  );
}
