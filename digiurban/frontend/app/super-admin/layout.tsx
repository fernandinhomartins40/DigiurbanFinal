'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { SuperAdminAuthProvider, useSuperAdminAuth } from '@/contexts/SuperAdminAuthContext';
import {
  LayoutDashboard,
  Building2,
  Users,
  DollarSign,
  BarChart3,
  Activity,
  Mail,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  TrendingUp,
  FileText,
  Wrench,
  Database,
  UserCog,
  Bell,
  Search
} from 'lucide-react';

interface MenuItem {
  title: string;
  href: string;
  icon: any;
  children?: MenuItem[];
  badge?: string;
  badgeColor?: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

const menuItems: MenuItem[] = [
  {
    title: 'Dashboard Principal',
    href: '/super-admin',
    icon: LayoutDashboard
  },
  {
    title: 'Dashboards',
    href: '#dashboards',
    icon: TrendingUp,
    children: [
      { title: 'Métricas SaaS', href: '/super-admin/dashboard/saas-metrics', icon: DollarSign },
      { title: 'Billing Dashboard', href: '/super-admin/dashboard/billing', icon: FileText },
      { title: 'Onboarding', href: '/super-admin/dashboard/onboarding', icon: Users },
    ]
  },
  {
    title: 'Tenants',
    href: '/super-admin/tenants',
    icon: Building2,
    badge: 'Novo',
    badgeColor: 'bg-blue-500'
  },
  {
    title: 'Usuários',
    href: '/super-admin/users',
    icon: UserCog
  },
  {
    title: 'Cidadãos',
    href: '/super-admin/citizens',
    icon: Users
  },
  {
    title: 'Billing & Financeiro',
    href: '#billing',
    icon: DollarSign,
    children: [
      { title: 'Gestão de Billing', href: '/super-admin/billing', icon: DollarSign },
      { title: 'Faturas', href: '/super-admin/billing/invoices', icon: FileText },
    ]
  },
  {
    title: 'Analytics',
    href: '#analytics',
    icon: BarChart3,
    children: [
      { title: 'Analytics Principal', href: '/super-admin/analytics', icon: BarChart3 },
      { title: 'Analytics Detalhado', href: '/super-admin/analytics/detailed', icon: TrendingUp },
    ]
  },
  {
    title: 'Monitoring',
    href: '/super-admin/monitoring',
    icon: Activity,
    badge: 'Crítico',
    badgeColor: 'bg-red-500'
  },
  {
    title: 'Email Management',
    href: '/super-admin/email',
    icon: Mail
  },
  {
    title: 'Operations',
    href: '/super-admin/operations',
    icon: Wrench
  },
  {
    title: 'Configurações',
    href: '#settings',
    icon: Settings,
    children: [
      { title: 'Settings Gerais', href: '/super-admin/settings', icon: Settings },
      { title: 'Schema Management', href: '/super-admin/settings/schema', icon: Database },
    ]
  },
];

function SuperAdminLayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading: authLoading, logout } = useSuperAdminAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState<string[]>(['#dashboards', '#billing', '#analytics', '#settings']);
  const [notifications, setNotifications] = useState(0);

  // Auto-open sidebar on desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };

    // Set initial state
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (pathname === '/super-admin/login') {
      return;
    }

    if (!authLoading && !user) {
      router.push('/super-admin/login');
    }
  }, [pathname, router, user, authLoading]);

  const toggleMenu = (href: string) => {
    setExpandedMenus(prev =>
      prev.includes(href)
        ? prev.filter(item => item !== href)
        : [...prev, href]
    );
  };

  const handleLogout = () => {
    logout();
  };

  const isActiveRoute = (href: string) => {
    if (href === '/super-admin') {
      return pathname === href;
    }
    return pathname.startsWith(href) && href !== '#';
  };

  if (pathname === '/super-admin/login') {
    return children;
  }

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Carregando Super Admin...</p>
        </div>
      </div>
    );
  }

  const currentPageTitle = menuItems.find(m => m.href === pathname)?.title ||
    menuItems.flatMap(m => m.children || []).find(c => c.href === pathname)?.title ||
    'Super Admin';

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      } ${sidebarOpen ? 'w-64 md:w-72' : 'md:w-16 md:w-20'} w-64 bg-white border-r border-gray-200 transition-all duration-300 flex flex-col fixed left-0 top-0 bottom-0 z-40`}>
        {/* Logo e Toggle */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-blue-700">
          {sidebarOpen ? (
            <>
              <div className="text-white">
                <h1 className="text-lg font-bold">Super Admin</h1>
                <p className="text-xs text-blue-100">DigiUrban SaaS</p>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="text-white hover:bg-blue-600 p-2 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </>
          ) : (
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-white hover:bg-blue-600 p-2 rounded-lg transition-colors mx-auto"
            >
              <Menu size={20} />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = isActiveRoute(item.href);
            const hasChildren = item.children && item.children.length > 0;
            const isExpanded = expandedMenus.includes(item.href);

            return (
              <div key={item.href}>
                {hasChildren ? (
                  <button
                    onClick={() => toggleMenu(item.href)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all ${
                      isActive
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon size={20} className={isActive ? 'text-blue-600' : 'text-gray-500'} />
                      {sidebarOpen && (
                        <span className="font-medium text-sm">{item.title}</span>
                      )}
                    </div>
                    {sidebarOpen && (
                      <div className="flex items-center gap-2">
                        {item.badge && (
                          <span className={`${item.badgeColor} text-white text-xs px-2 py-0.5 rounded-full font-semibold`}>
                            {item.badge}
                          </span>
                        )}
                        {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                      </div>
                    )}
                  </button>
                ) : (
                  <Link
                    href={item.href}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-lg transition-all ${
                      isActive
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon size={20} className={isActive ? 'text-blue-600' : 'text-gray-500'} />
                      {sidebarOpen && (
                        <span className="font-medium text-sm">{item.title}</span>
                      )}
                    </div>
                    {sidebarOpen && item.badge && (
                      <span className={`${item.badgeColor} text-white text-xs px-2 py-0.5 rounded-full font-semibold`}>
                        {item.badge}
                      </span>
                    )}
                  </Link>
                )}

                {/* Submenu */}
                {hasChildren && isExpanded && sidebarOpen && (
                  <div className="ml-4 mt-1 space-y-1 border-l-2 border-gray-200 pl-4">
                    {item.children!.map((child) => {
                      const ChildIcon = child.icon;
                      const isChildActive = isActiveRoute(child.href);

                      return (
                        <Link
                          key={child.href}
                          href={child.href}
                          className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all ${
                            isChildActive
                              ? 'bg-blue-50 text-blue-700 font-medium'
                              : 'text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          <ChildIcon size={16} className={isChildActive ? 'text-blue-600' : 'text-gray-400'} />
                          {child.title}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* User Info */}
        {sidebarOpen && user && (
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
                <p className="text-xs text-gray-500 truncate">{user.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium"
            >
              <LogOut size={16} />
              Sair
            </button>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <div className={`flex-1 flex flex-col ${sidebarOpen ? 'md:ml-64 md:ml-72' : 'md:ml-16 md:ml-20'} transition-all duration-300 overflow-x-hidden`}>
        {/* Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-6 fixed right-0 left-0 md:left-auto z-20">
          <div className="flex items-center gap-3 min-w-0 flex-shrink">
            {/* Mobile Hamburger */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Menu size={24} className="text-gray-700" />
            </button>
            <div className="min-w-0">
              <h2 className="text-lg md:text-xl font-bold text-gray-900 truncate">{currentPageTitle}</h2>
              <p className="text-xs text-gray-500 truncate hidden sm:block">{pathname}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
            {/* Search */}
            <div className="hidden lg:flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-lg">
              <Search size={16} className="text-gray-400" />
              <input
                type="text"
                placeholder="Buscar..."
                className="bg-transparent border-none outline-none text-sm w-32 xl:w-64"
              />
            </div>

            {/* Notifications */}
            <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Bell size={20} className="text-gray-600" />
              {notifications > 0 && (
                <span className="absolute top-1 right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-bold">
                  {notifications}
                </span>
              )}
            </button>

            {/* Quick Actions */}
            <div className="flex items-center gap-2">
              <Link
                href="/super-admin/tenants/create"
                className="hidden lg:flex items-center gap-2 px-3 md:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                <Building2 size={16} />
                <span className="hidden xl:inline">Novo Tenant</span>
              </Link>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden pt-20 md:pt-24 px-3 md:px-6 pb-6 w-full max-w-full">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SuperAdminAuthProvider>
      <SuperAdminLayoutContent>
        {children}
      </SuperAdminLayoutContent>
    </SuperAdminAuthProvider>
  );
}
