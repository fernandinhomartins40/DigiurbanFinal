'use client';

import Link from 'next/link';
import { Building2, Users, DollarSign, FileText, Mail, Activity, Wrench, TrendingUp } from 'lucide-react';

interface QuickAction {
  title: string;
  description: string;
  icon: any;
  href: string;
  color: string;
  badge?: string;
}

const quickActions: QuickAction[] = [
  {
    title: 'Novo Tenant',
    description: 'Cadastrar novo município',
    icon: Building2,
    href: '/super-admin/tenants/create',
    color: 'bg-blue-500'
  },
  {
    title: 'Gerar Faturas',
    description: 'Billing do mês atual',
    icon: DollarSign,
    href: '/super-admin/billing',
    color: 'bg-green-500'
  },
  {
    title: 'Ver Métricas',
    description: 'Dashboard de métricas SaaS',
    icon: TrendingUp,
    href: '/super-admin/dashboard/saas-metrics',
    color: 'bg-purple-500'
  },
  {
    title: 'Monitoring',
    description: 'Status do sistema',
    icon: Activity,
    href: '/super-admin/monitoring',
    color: 'bg-red-500',
    badge: 'Crítico'
  },
  {
    title: 'Gerenciar Usuários',
    description: 'Usuários cross-tenant',
    icon: Users,
    href: '/super-admin/users',
    color: 'bg-indigo-500'
  },
  {
    title: 'Email Config',
    description: 'Gestão de email',
    icon: Mail,
    href: '/super-admin/email',
    color: 'bg-cyan-500'
  },
  {
    title: 'Operations',
    description: 'Backup e manutenção',
    icon: Wrench,
    href: '/super-admin/operations',
    color: 'bg-orange-500'
  },
  {
    title: 'Ver Faturas',
    description: 'Todas as faturas',
    icon: FileText,
    href: '/super-admin/billing/invoices',
    color: 'bg-teal-500'
  },
];

interface QuickActionsProps {
  limit?: number;
  className?: string;
}

export function QuickActions({ limit, className = '' }: QuickActionsProps) {
  const displayActions = limit ? quickActions.slice(0, limit) : quickActions;

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 ${className}`}>
      {displayActions.map((action) => {
        const Icon = action.icon;
        return (
          <Link
            key={action.href}
            href={action.href}
            className="group relative bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg hover:border-gray-300 transition-all"
          >
            {action.badge && (
              <span className="absolute top-3 right-3 px-2 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-full">
                {action.badge}
              </span>
            )}
            <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
              <Icon size={24} className="text-white" />
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
              {action.title}
            </h4>
            <p className="text-sm text-gray-500">{action.description}</p>
          </Link>
        );
      })}
    </div>
  );
}

export function QuickActionsCompact({ className = '' }: { className?: string }) {
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {quickActions.map((action) => {
        const Icon = action.icon;
        return (
          <Link
            key={action.href}
            href={action.href}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all text-sm font-medium text-gray-700"
          >
            <Icon size={16} className="text-gray-500" />
            {action.title}
          </Link>
        );
      })}
    </div>
  );
}
