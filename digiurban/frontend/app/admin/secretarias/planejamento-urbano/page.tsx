'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Building,
  Hammer,
  Store,
  FileCheck,
  AlertTriangle,
  Map,
  Headset,
  Users,
  MapPin,
  ArrowRight,
} from 'lucide-react';

const planejamentoUrbanoModules = [
  {
    title: 'Atendimentos',
    description: 'Atendimentos gerais e consultas urbanísticas',
    icon: Headset,
    color: 'blue',
    path: '/admin/secretarias/planejamento-urbano/atendimentos',
    type: 'COM_DADOS',
  },
  {
    title: 'Aprovação de Projetos',
    description: 'Análise e aprovação de projetos arquitetônicos e urbanísticos',
    icon: Building,
    color: 'blue',
    path: '/admin/secretarias/planejamento-urbano/aprovacao-projetos',
    type: 'COM_DADOS',
  },
  {
    title: 'Alvarás de Construção',
    description: 'Emissão e gestão de alvarás de construção',
    icon: Hammer,
    color: 'orange',
    path: '/admin/secretarias/planejamento-urbano/alvaras-construcao',
    type: 'COM_DADOS',
  },
  {
    title: 'Alvarás de Funcionamento',
    description: 'Emissão de alvarás de funcionamento para estabelecimentos comerciais',
    icon: Store,
    color: 'purple',
    path: '/admin/secretarias/planejamento-urbano/alvaras-funcionamento',
    type: 'COM_DADOS',
  },
  {
    title: 'Certidões',
    description: 'Emissão de certidões urbanísticas e imobiliárias',
    icon: FileCheck,
    color: 'indigo',
    path: '/admin/secretarias/planejamento-urbano/certidoes',
    type: 'COM_DADOS',
  },
  {
    title: 'Denúncias Urbanas',
    description: 'Registro e fiscalização de infrações urbanísticas',
    icon: AlertTriangle,
    color: 'red',
    path: '/admin/secretarias/planejamento-urbano/denuncias-urbanas',
    type: 'COM_DADOS',
  },
  {
    title: 'Loteamentos e Zoneamento',
    description: 'Gestão de loteamentos e zoneamento urbano',
    icon: Map,
    color: 'green',
    path: '/admin/secretarias/planejamento-urbano/loteamentos',
    type: 'COM_DADOS',
  },
  {
    title: 'Consultas Públicas',
    description: 'Audiências públicas e participação popular em planejamento urbano',
    icon: Users,
    color: 'yellow',
    path: '/admin/secretarias/planejamento-urbano/consultas-publicas',
    type: 'INFORMATIVO',
  },
  {
    title: 'Mapa Urbano',
    description: 'Visualização de zoneamento, loteamentos e uso do solo',
    icon: MapPin,
    color: 'teal',
    path: '/admin/secretarias/planejamento-urbano/mapa-urbano',
    type: 'INFORMATIVO',
  },
];

export default function PlanejamentoUrbanoPage() {
  const router = useRouter();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
          <Building className="h-8 w-8 text-blue-600 mr-3" />
          Secretaria de Planejamento Urbano
        </h1>
        <p className="text-gray-600 mt-1">
          Gestão urbanística, alvarás, certidões e fiscalização - 9 Módulos (7 COM_DADOS + 2 INFORMATIVOS)
        </p>
      </div>

      {/* Módulos COM_DADOS */}
      <div>
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Módulos COM_DADOS (Integrados a Protocolos)</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {planejamentoUrbanoModules.filter(m => m.type === 'COM_DADOS').map((module) => {
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

      {/* Módulos INFORMATIVOS */}
      <div>
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Módulos INFORMATIVOS (Consulta e Visualização)</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {planejamentoUrbanoModules.filter(m => m.type === 'INFORMATIVO').map((module) => {
            const Icon = module.icon;
            return (
              <Card
                key={module.path}
                className="hover:shadow-lg transition-shadow cursor-pointer group border-dashed"
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
                    <span className="inline-block w-2 h-2 rounded-full bg-gray-400 mr-2"></span>
                    Módulo INFORMATIVO
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
