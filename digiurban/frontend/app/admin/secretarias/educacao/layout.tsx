'use client';

import { SecretariaLayout } from '@/components/admin/SecretariaLayout';
import { BookOpen, Users, UtensilsCrossed, PackageOpen, LayoutDashboard } from 'lucide-react';

export default function EducacaoLayout({ children }: { children: React.ReactNode }) {
  const menuItems = [
    {
      label: 'Dashboard',
      href: '/admin/secretarias/educacao/dashboard',
      icon: LayoutDashboard
    },
    {
      label: 'Matrículas',
      href: '/admin/secretarias/educacao/matriculas',
      icon: Users
    },
    {
      label: 'Transporte Escolar',
      href: '/admin/secretarias/educacao/transporte',
      icon: BookOpen
    },
    {
      label: 'Merenda Escolar',
      href: '/admin/secretarias/educacao/merenda',
      icon: UtensilsCrossed
    },
    {
      label: 'Material Escolar',
      href: '/admin/secretarias/educacao/material',
      icon: PackageOpen
    }
  ];

  return (
    <SecretariaLayout
      secretariaName="Secretaria de Educação"
      secretariaSlug="educacao"
      menuItems={menuItems}
    >
      {children}
    </SecretariaLayout>
  );
}
