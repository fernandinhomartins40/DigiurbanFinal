import { ReactNode } from 'react';

interface SuperAdminCardProps {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
  headerAction?: ReactNode;
  icon?: ReactNode;
  loading?: boolean;
}

export function SuperAdminCard({
  title,
  description,
  children,
  className = '',
  headerAction,
  icon,
  loading = false
}: SuperAdminCardProps) {
  return (
    <div className={`bg-white rounded-lg border border-gray-200 shadow-sm ${className}`}>
      <div className="px-3 md:px-6 py-3 md:py-4 border-b border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="text-base md:text-lg font-semibold text-gray-900">{title}</h3>
          {description && (
            <p className="text-xs md:text-sm text-gray-500 mt-1">{description}</p>
          )}
        </div>
        {headerAction && <div className="flex-shrink-0">{headerAction}</div>}
      </div>
      <div className="p-3 md:p-6">
        {loading ? (
          <div className="flex items-center justify-center py-8 md:py-12">
            <div className="animate-spin rounded-full h-6 w-6 md:h-8 md:w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  );
}

interface MetricCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  subtitle?: string | ReactNode;
  color?: 'blue' | 'green' | 'red' | 'yellow' | 'purple' | 'gray';
  loading?: boolean;
}

export function MetricCard({
  title,
  value,
  icon,
  trend,
  subtitle,
  color = 'blue',
  loading = false
}: MetricCardProps) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600 border-blue-200',
    green: 'bg-green-50 text-green-600 border-green-200',
    red: 'bg-red-50 text-red-600 border-red-200',
    yellow: 'bg-yellow-50 text-yellow-600 border-yellow-200',
    purple: 'bg-purple-50 text-purple-600 border-purple-200',
    gray: 'bg-gray-50 text-gray-600 border-gray-200',
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6 animate-pulse">
        <div className="h-3 md:h-4 bg-gray-200 rounded w-1/2 mb-3 md:mb-4"></div>
        <div className="h-6 md:h-8 bg-gray-200 rounded w-3/4"></div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg border ${colorClasses[color].split(' ')[2]} p-4 md:p-6 hover:shadow-md transition-shadow`}>
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-xs md:text-sm font-medium text-gray-600 mb-1 md:mb-2 truncate">{title}</p>
          <div className="flex items-baseline gap-1 md:gap-2 flex-wrap">
            <p className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900">{value}</p>
            {trend && (
              <span className={`text-xs md:text-sm font-semibold ${trend.isPositive ? 'text-green-600' : 'text-red-600'} whitespace-nowrap`}>
                {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-xs text-gray-500 mt-1 md:mt-2 truncate">{subtitle}</p>
          )}
        </div>
        {icon && (
          <div className={`p-2 md:p-3 rounded-lg ${colorClasses[color]} flex-shrink-0 ml-2`}>
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
