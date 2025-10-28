'use client';

import { SecretariaLayout } from '@/components/admin/SecretariaLayout';
import { LayoutDashboard, Construction, Wrench } from 'lucide-react';

export default function SecretariadeObrasPblicasLayout({ children }: { children: React.ReactNode }) {
  const menuItems = [
    {
      label: 'Dashboard',
      href: '/admin/secretarias/obras-publicas/dashboard',
      icon: LayoutDashboard
    },
    {
      label: 'Problemas de Infraestrutura',
      href: '/admin/secretarias/obras-publicas/problemas-infraestrutura',
      icon: Construction
    },
    {
      label: 'Manutenção',
      href: '/admin/secretarias/obras-publicas/manutencao',
      icon: Wrench
    }
  ];

  return (
    <SecretariaLayout
      secretariaName="Secretaria de Obras Públicas"
      secretariaSlug="obras-publicas"
      menuItems={menuItems}
    >
      {children}
    </SecretariaLayout>
  );
}
