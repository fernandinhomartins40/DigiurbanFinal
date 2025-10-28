'use client';

import { SecretariaLayout } from '@/components/admin/SecretariaLayout';
import { LayoutDashboard, Home, MapPin, FileCheck } from 'lucide-react';

export default function SecretariadeHabitaoLayout({ children }: { children: React.ReactNode }) {
  const menuItems = [
    {
      label: 'Dashboard',
      href: '/admin/secretarias/habitacao/dashboard',
      icon: LayoutDashboard
    },
    {
      label: 'Inscrições MCMV',
      href: '/admin/secretarias/habitacao/inscricoes-mcmv',
      icon: Home
    },
    {
      label: 'Lotes',
      href: '/admin/secretarias/habitacao/lotes',
      icon: MapPin
    },
    {
      label: 'Regularização',
      href: '/admin/secretarias/habitacao/regularizacao',
      icon: FileCheck
    }
  ];

  return (
    <SecretariaLayout
      secretariaName="Secretaria de Habitação"
      secretariaSlug="habitacao"
      menuItems={menuItems}
    >
      {children}
    </SecretariaLayout>
  );
}
