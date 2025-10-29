'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Wrench,
  Lightbulb,
  Trash2,
  Broom,
  Users,
  AlertTriangle,
  Leaf,
  Droplets,
  TreeDeciduous,
  ArrowRight,
} from 'lucide-react';

const servicosPublicosModules = [
  {
    title: 'Atendimentos de Serviços Públicos',
    description: 'Registro e gestão de solicitações de serviços públicos',
    icon: Wrench,
    color: 'blue',
    path: '/admin/secretarias/servicos-publicos/public-service-requests',
    type: 'COM_DADOS',
  },
  {
    title: 'Iluminação Pública',
    description: 'Gestão de pontos de iluminação e manutenção',
    icon: Lightbulb,
    color: 'yellow',
    path: '/admin/secretarias/servicos-publicos/street-lighting',
    type: 'COM_DADOS',
  },
  {
    title: 'Coleta Especial',
    description: 'Agendamento e gestão de coletas especiais',
    icon: Trash2,
    color: 'orange',
    path: '/admin/secretarias/servicos-publicos/special-collection',
    type: 'COM_DADOS',
  },
  {
    title: 'Limpeza Urbana',
    description: 'Programação e controle de limpeza urbana',
    icon: Broom,
    color: 'purple',
    path: '/admin/secretarias/servicos-publicos/cleaning-schedule',
    type: 'COM_DADOS',
  },
  {
    title: 'Gestão de Equipes',
    description: 'Gerenciamento de equipes e escalas de trabalho',
    icon: Users,
    color: 'indigo',
    path: '/admin/secretarias/servicos-publicos/team-schedule',
    type: 'COM_DADOS',
  },
  {
    title: 'Registro de Problemas',
    description: 'Registro e acompanhamento de problemas urbanos',
    icon: AlertTriangle,
    color: 'red',
    path: '/admin/secretarias/servicos-publicos/public-problem-report',
    type: 'COM_DADOS',
  },
  {
    title: 'Capina',
    description: 'Solicitações e agendamento de serviços de capina',
    icon: Leaf,
    color: 'green',
    path: '/admin/secretarias/servicos-publicos/weeding-request',
    type: 'COM_DADOS',
  },
  {
    title: 'Desobstrução',
    description: 'Solicitações de desobstrução de vias e drenagem',
    icon: Droplets,
    color: 'teal',
    path: '/admin/secretarias/servicos-publicos/drainage-request',
    type: 'COM_DADOS',
  },
  {
    title: 'Poda de Árvores',
    description: 'Solicitações e controle de poda de árvores',
    icon: TreeDeciduous,
    color: 'emerald',
    path: '/admin/secretarias/servicos-publicos/tree-pruning-request',
    type: 'COM_DADOS',
  },
];

export default function ServicosPublicosPage() {
  const router = useRouter();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
          <Wrench className="h-8 w-8 text-blue-600 mr-3" />
          Secretaria de Serviços Públicos
        </h1>
        <p className="text-gray-600 mt-1">
          Gestão integrada de serviços públicos municipais, limpeza urbana e manutenção da cidade - 9 Módulos (Todos COM_DADOS)
        </p>
      </div>

      {/* Módulos COM_DADOS */}
      <div>
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Módulos COM_DADOS (Integrados a Protocolos)</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {servicosPublicosModules.filter(m => m.type === 'COM_DADOS').map((module) => {
            const Icon = module.icon;
            return (
              <Card
                key={module.path}
                className="hover:shadow-lg transition-shadow cursor-pointer group"
                onClick={() => router.push(module.path)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <Icon className={`h-10 w-10 text-${module.color}-600 mb-2`} />
                    <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all" />
                  </div>
                  <CardTitle className="text-lg">{module.title}</CardTitle>
                  <CardDescription>{module.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center text-sm text-gray-600">
                    <span className={`inline-block w-2 h-2 rounded-full bg-${module.color}-500 mr-2`}></span>
                    Módulo COM_DADOS
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
