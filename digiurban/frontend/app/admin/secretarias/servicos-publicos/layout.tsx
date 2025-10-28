'use client';

import { SecretariaLayout } from '@/components/admin/SecretariaLayout';
import { LayoutDashboard, TreePine, Trash2, Sparkles } from 'lucide-react';

export default function SecretariadeServiosPblicosLayout({ children }: { children: React.ReactNode }) {
  const menuItems = [
    {
      label: 'Dashboard',
      href: '/admin/secretarias/servicos-publicos/dashboard',
      icon: LayoutDashboard
    },
    {
      label: 'Poda de Árvores',
      href: '/admin/secretarias/servicos-publicos/poda-arvores',
      icon: TreePine
    },
    {
      label: 'Retirada de Entulho',
      href: '/admin/secretarias/servicos-publicos/retirada-entulho',
      icon: Trash2
    },
    {
      label: 'Limpeza',
      href: '/admin/secretarias/servicos-publicos/limpeza',
      icon: Sparkles
    }
  ];

  return (
    <SecretariaLayout
      secretariaName="Secretaria de Serviços Públicos"
      secretariaSlug="servicos-publicos"
      menuItems={menuItems}
    >
      {children}
    </SecretariaLayout>
  );
}
