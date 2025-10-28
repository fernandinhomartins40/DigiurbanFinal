'use client';

import { SecretariaLayout } from '@/components/admin/SecretariaLayout';
import { LayoutDashboard, Heart, Users, Home } from 'lucide-react';

export default function SecretariadeAssistnciaSocialLayout({ children }: { children: React.ReactNode }) {
  const menuItems = [
    {
      label: 'Dashboard',
      href: '/admin/secretarias/assistencia-social/dashboard',
      icon: LayoutDashboard
    },
    {
      label: 'Benefícios',
      href: '/admin/secretarias/assistencia-social/beneficios',
      icon: Heart
    },
    {
      label: 'Programas',
      href: '/admin/secretarias/assistencia-social/programas',
      icon: Users
    },
    {
      label: 'Visitas',
      href: '/admin/secretarias/assistencia-social/visitas',
      icon: Home
    }
  ];

  return (
    <SecretariaLayout
      secretariaName="Secretaria de Assistência Social"
      secretariaSlug="assistencia-social"
      menuItems={menuItems}
    >
      {children}
    </SecretariaLayout>
  );
}
