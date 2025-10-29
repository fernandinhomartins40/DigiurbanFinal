'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Construction,
  Headset,
  ClipboardCheck,
  Building2,
  Shield,
  FileText,
  Map,
  ArrowRight,
} from 'lucide-react';

const obrasPublicasModules = [
  {
    title: 'Atendimentos',
    description: 'Solicitações e atendimentos gerais da Secretaria de Obras Públicas',
    icon: Headset,
    color: 'amber',
    path: '/admin/secretarias/obras-publicas/atendimentos-obras-publicas',
    type: 'COM_DADOS',
  },
  {
    title: 'Reparos de Vias',
    description: 'Solicitações de reparos em vias públicas (buracos, pavimentação, etc)',
    icon: Construction,
    color: 'orange',
    path: '/admin/secretarias/obras-publicas/reparos-de-vias',
    type: 'COM_DADOS',
  },
  {
    title: 'Vistorias Técnicas',
    description: 'Solicitações de vistorias técnicas em imóveis e obras',
    icon: ClipboardCheck,
    color: 'purple',
    path: '/admin/secretarias/obras-publicas/vistorias-tecnicas',
    type: 'COM_DADOS',
  },
  {
    title: 'Cadastro de Obras',
    description: 'Cadastro e acompanhamento de obras públicas em andamento',
    icon: Building2,
    color: 'blue',
    path: '/admin/secretarias/obras-publicas/cadastro-de-obras',
    type: 'COM_DADOS',
  },
  {
    title: 'Inspeção de Obras',
    description: 'Inspeções e fiscalizações de obras públicas',
    icon: Shield,
    color: 'red',
    path: '/admin/secretarias/obras-publicas/inspecao-de-obras',
    type: 'COM_DADOS',
  },
  {
    title: 'Consulta de Contratos',
    description: 'Módulo informativo sobre contratos e licitações',
    icon: FileText,
    color: 'yellow',
    path: '/admin/secretarias/obras-publicas/consulta-contratos',
    type: 'INFORMATIVO',
  },
  {
    title: 'Mapa de Obras',
    description: 'Visualização geográfica das obras públicas',
    icon: Map,
    color: 'green',
    path: '/admin/secretarias/obras-publicas/consulta-mapa-obras',
    type: 'INFORMATIVO',
  },
];

export default function ObrasPublicasPage() {
  const router = useRouter();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
          <Construction className="h-8 w-8 text-orange-600 mr-3" />
          Secretaria de Obras Públicas
        </h1>
        <p className="text-gray-600 mt-1">
          Gestão de obras, reparos, vistorias técnicas e infraestrutura urbana - 7 Módulos (5 COM_DADOS + 2 INFORMATIVOS)
        </p>
      </div>

      {/* Módulos COM_DADOS */}
      <div>
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Módulos COM_DADOS (Integrados a Protocolos)</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {obrasPublicasModules.filter(m => m.type === 'COM_DADOS').map((module) => {
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

      {/* Módulos INFORMATIVOS */}
      <div>
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Módulos INFORMATIVOS (Apenas Consulta)</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {obrasPublicasModules.filter(m => m.type === 'INFORMATIVO').map((module) => {
            const Icon = module.icon;
            return (
              <Card
                key={module.path}
                className="hover:shadow-lg transition-shadow cursor-pointer group border-dashed"
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
                  <div className="flex items-center text-sm text-gray-600 group-hover:text-gray-700">
                    Visualizar informações
                    <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
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
