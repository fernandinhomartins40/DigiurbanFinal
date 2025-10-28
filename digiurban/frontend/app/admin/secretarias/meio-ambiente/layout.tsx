'use client';

import { SecretariaLayout } from '@/components/admin/SecretariaLayout';
import { LayoutDashboard, Leaf, TreePine, AlertTriangle } from 'lucide-react';

export default function SecretariadeMeioAmbienteLayout({ children }: { children: React.ReactNode }) {
  const menuItems = [
    {
      label: 'Dashboard',
      href: '/admin/secretarias/meio-ambiente/dashboard',
      icon: LayoutDashboard
    },
    {
      label: 'Licenças Ambientais',
      href: '/admin/secretarias/meio-ambiente/licencas',
      icon: Leaf
    },
    {
      label: 'Autorizações de Árvores',
      href: '/admin/secretarias/meio-ambiente/autorizacoes-arvores',
      icon: TreePine
    },
    {
      label: 'Denúncias',
      href: '/admin/secretarias/meio-ambiente/denuncias',
      icon: AlertTriangle
    }
  ];

  return (
    <SecretariaLayout
      secretariaName="Secretaria de Meio Ambiente"
      secretariaSlug="meio-ambiente"
      menuItems={menuItems}
    >
      {children}
    </SecretariaLayout>
  );
}
