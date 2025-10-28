'use client';

import { SecretariaLayout } from '@/components/admin/SecretariaLayout';
import { LayoutDashboard, Building2, FileText, Home } from 'lucide-react';

export default function SecretariadePlanejamentoUrbanoLayout({ children }: { children: React.ReactNode }) {
  const menuItems = [
    {
      label: 'Dashboard',
      href: '/admin/secretarias/planejamento-urbano/dashboard',
      icon: LayoutDashboard
    },
    {
      label: 'Alvarás',
      href: '/admin/secretarias/planejamento-urbano/alvaras',
      icon: Building2
    },
    {
      label: 'Certidões',
      href: '/admin/secretarias/planejamento-urbano/certidoes',
      icon: FileText
    },
    {
      label: 'Numeração',
      href: '/admin/secretarias/planejamento-urbano/numeracao',
      icon: Home
    }
  ];

  return (
    <SecretariaLayout
      secretariaName="Secretaria de Planejamento Urbano"
      secretariaSlug="planejamento-urbano"
      menuItems={menuItems}
    >
      {children}
    </SecretariaLayout>
  );
}
