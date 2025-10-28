'use client';

import { SecretariaLayout } from '@/components/admin/SecretariaLayout';
import { Calendar, Syringe, Pill, Activity, LayoutDashboard } from 'lucide-react';

export default function SaudeLayout({ children }: { children: React.ReactNode }) {
  const menuItems = [
    {
      label: 'Dashboard',
      href: '/admin/secretarias/saude/dashboard',
      icon: LayoutDashboard
    },
    {
      label: 'Consultas',
      href: '/admin/secretarias/saude/consultas',
      icon: Calendar
    },
    {
      label: 'Vacinas',
      href: '/admin/secretarias/saude/vacinas',
      icon: Syringe
    },
    {
      label: 'Medicamentos',
      href: '/admin/secretarias/saude/medicamentos',
      icon: Pill
    },
    {
      label: 'Exames',
      href: '/admin/secretarias/saude/exames',
      icon: Activity
    }
  ];

  return (
    <SecretariaLayout
      secretariaName="Secretaria de Saúde"
      secretariaSlug="saude"
      menuItems={menuItems}
    >
      {children}
    </SecretariaLayout>
  );
}
