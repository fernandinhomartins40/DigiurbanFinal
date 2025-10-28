'use client';

import { SecretariaLayout } from '@/components/admin/SecretariaLayout';
import { LayoutDashboard, Trophy, Dumbbell } from 'lucide-react';

export default function SecretariadeEsporteLayout({ children }: { children: React.ReactNode }) {
  const menuItems = [
    {
      label: 'Dashboard',
      href: '/admin/secretarias/esportes/dashboard',
      icon: LayoutDashboard
    },
    {
      label: 'Inscrições Escolinhas',
      href: '/admin/secretarias/esportes/inscricoes-escolinhas',
      icon: Trophy
    },
    {
      label: 'Reservas de Espaços',
      href: '/admin/secretarias/esportes/reservas-espacos',
      icon: Dumbbell
    }
  ];

  return (
    <SecretariaLayout
      secretariaName="Secretaria de Esporte"
      secretariaSlug="esportes"
      menuItems={menuItems}
    >
      {children}
    </SecretariaLayout>
  );
}
