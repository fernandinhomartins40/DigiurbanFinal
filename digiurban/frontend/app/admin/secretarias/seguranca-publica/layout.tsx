'use client';

import { SecretariaLayout } from '@/components/admin/SecretariaLayout';
import { LayoutDashboard, Shield, Car, AlertCircle } from 'lucide-react';

export default function SecretariadeSeguranaPblicaLayout({ children }: { children: React.ReactNode }) {
  const menuItems = [
    {
      label: 'Dashboard',
      href: '/admin/secretarias/seguranca-publica/dashboard',
      icon: LayoutDashboard
    },
    {
      label: 'Ocorrências',
      href: '/admin/secretarias/seguranca-publica/ocorrencias',
      icon: Shield
    },
    {
      label: 'Rondas',
      href: '/admin/secretarias/seguranca-publica/rondas',
      icon: Car
    },
    {
      label: 'Denúncias',
      href: '/admin/secretarias/seguranca-publica/denuncias',
      icon: AlertCircle
    }
  ];

  return (
    <SecretariaLayout
      secretariaName="Secretaria de Segurança Pública"
      secretariaSlug="seguranca-publica"
      menuItems={menuItems}
    >
      {children}
    </SecretariaLayout>
  );
}
