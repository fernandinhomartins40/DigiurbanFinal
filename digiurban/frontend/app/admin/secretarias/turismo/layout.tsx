'use client';

import { SecretariaLayout } from '@/components/admin/SecretariaLayout';
import { LayoutDashboard, MapPin, Calendar } from 'lucide-react';

export default function SecretariadeTurismoLayout({ children }: { children: React.ReactNode }) {
  const menuItems = [
    {
      label: 'Dashboard',
      href: '/admin/secretarias/turismo/dashboard',
      icon: LayoutDashboard
    },
    {
      label: 'Cadastro de Atrativos',
      href: '/admin/secretarias/turismo/cadastro-atrativos',
      icon: MapPin
    },
    {
      label: 'Eventos Turísticos',
      href: '/admin/secretarias/turismo/eventos-turisticos',
      icon: Calendar
    }
  ];

  return (
    <SecretariaLayout
      secretariaName="Secretaria de Turismo"
      secretariaSlug="turismo"
      menuItems={menuItems}
    >
      {children}
    </SecretariaLayout>
  );
}
