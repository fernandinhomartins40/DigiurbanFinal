'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Home,
  FileCheck,
  DollarSign,
  Building,
  List,
  MessageSquare,
  ArrowRight,
  FileText,
} from 'lucide-react';

const habitacaoModules = [
  {
    title: 'Programas Habitacionais',
    description: 'Inscrições em programas habitacionais (MCMV, Casa Verde e Amarela)',
    icon: Home,
    color: 'blue',
    path: '/admin/secretarias/habitacao/programas-habitacionais',
  },
  {
    title: 'Regularização Fundiária',
    description: 'Processos de regularização de terrenos e imóveis',
    icon: FileCheck,
    color: 'green',
    path: '/admin/secretarias/habitacao/regularizacao-fundiaria',
  },
  {
    title: 'Auxílio Aluguel',
    description: 'Programa de auxílio aluguel para famílias em vulnerabilidade',
    icon: DollarSign,
    color: 'emerald',
    path: '/admin/secretarias/habitacao/auxilio-aluguel',
  },
  {
    title: 'Unidades Habitacionais',
    description: 'Gestão de unidades habitacionais públicas',
    icon: Building,
    color: 'indigo',
    path: '/admin/secretarias/habitacao/unidades-habitacionais',
  },
  {
    title: 'Fila de Habitação',
    description: 'Gestão da fila de espera para moradia popular',
    icon: List,
    color: 'orange',
    path: '/admin/secretarias/habitacao/fila-habitacao',
  },
  {
    title: 'Atendimentos',
    description: 'Atendimentos gerais da secretaria de habitação',
    icon: MessageSquare,
    color: 'slate',
    path: '/admin/secretarias/habitacao/atendimentos',
  },
  {
    title: 'Consulta de Programas',
    description: 'Módulo informativo para consulta de programas habitacionais',
    icon: FileText,
    color: 'purple',
    path: '/admin/secretarias/habitacao/consulta-programas',
  },
]

export default function HabitacaoPage() {
  const router = useRouter();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
          <Home className="h-8 w-8 text-blue-600 mr-3" />
          Secretaria de Habitação
        </h1>
        <p className="text-gray-600 mt-1">
          Gestão de programas habitacionais, regularização fundiária e moradia popular
        </p>
      </div>

      {/* Módulos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {habitacaoModules.map((module) => {
          const Icon = module.icon;
          return (
            <Card
              key={module.path}
              className="hover:shadow-lg transition-shadow cursor-pointer group"
              onClick={() => router.push(module.path)}
            >
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Icon className={`h-5 w-5 text-${module.color}-600`} />
                  {module.title}
                </CardTitle>
                <CardDescription>{module.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-sm text-blue-600 group-hover:text-blue-700">
                  Acessar módulo
                  <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
