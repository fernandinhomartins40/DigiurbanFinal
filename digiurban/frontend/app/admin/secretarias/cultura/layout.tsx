'use client';

import { SecretariaLayout } from '@/components/admin/SecretariaLayout';
import { LayoutDashboard, Music, Theater, Palette } from 'lucide-react';

export default function SecretariadeCulturaLayout({ children }: { children: React.ReactNode }) {
  const menuItems = [
    {
      label: 'Dashboard',
      href: '/admin/secretarias/cultura/dashboard',
      icon: LayoutDashboard
    },
    {
      label: 'Eventos',
      href: '/admin/secretarias/cultura/eventos',
      icon: Music
    },
    {
      label: 'Espaços Culturais',
      href: '/admin/secretarias/cultura/espacos',
      icon: Theater
    },
    {
      label: 'Projetos',
      href: '/admin/secretarias/cultura/projetos',
      icon: Palette
    }
  ];

  return (
    <SecretariaLayout
      secretariaName="Secretaria de Cultura"
      secretariaSlug="cultura"
      menuItems={menuItems}
    >
      {children}
    </SecretariaLayout>
  );
}
