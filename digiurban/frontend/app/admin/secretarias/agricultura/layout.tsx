'use client';

import { SecretariaLayout } from '@/components/admin/SecretariaLayout';
import { LayoutDashboard, Tractor, Sprout } from 'lucide-react';

export default function SecretariadeAgriculturaLayout({ children }: { children: React.ReactNode }) {
  const menuItems = [
    {
      label: 'Dashboard',
      href: '/admin/secretarias/agricultura/dashboard',
      icon: LayoutDashboard
    },
    {
      label: 'Assistência Técnica',
      href: '/admin/secretarias/agricultura/assistencia-tecnica',
      icon: Tractor
    },
    {
      label: 'Distribuição de Sementes',
      href: '/admin/secretarias/agricultura/distribuicao-sementes',
      icon: Sprout
    }
  ];

  return (
    <SecretariaLayout
      secretariaName="Secretaria de Agricultura"
      secretariaSlug="agricultura"
      menuItems={menuItems}
    >
      {children}
    </SecretariaLayout>
  );
}
