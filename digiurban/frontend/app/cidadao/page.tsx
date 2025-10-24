'use client';

import { useState, useEffect } from 'react';
import { CitizenLayout } from '@/components/citizen/CitizenLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useCitizenAuth } from '@/contexts/CitizenAuthContext';
import Link from 'next/link';
import {
  FileText,
  CheckCircle2,
  Clock,
  AlertCircle,
  Users,
  Bell,
  ArrowRight,
  Activity,
  Building2,
  Heart,
  GraduationCap,
  Home,
  TreePine,
  Briefcase
} from 'lucide-react';

export default function CitizenDashboard() {
  const { citizen } = useCitizenAuth();
  const [loading, setLoading] = useState(false);

  const stats = [
    {
      title: 'Protocolos Ativos',
      value: '0',
      icon: Clock,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    {
      title: 'Protocolos Concluídos',
      value: '0',
      icon: CheckCircle2,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    {
      title: 'Notificações',
      value: '0',
      icon: Bell,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200'
    },
    {
      title: 'Família',
      value: citizen ? '1 pessoa' : '-',
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200'
    }
  ];

  const quickActions = [
    {
      title: 'Nova Solicitação',
      description: 'Solicitar um novo serviço público',
      href: '/cidadao/servicos',
      icon: FileText,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      available: true
    },
    {
      title: 'Acompanhar Protocolos',
      description: 'Ver status das suas solicitações',
      href: '/cidadao/protocolos',
      icon: Activity,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      available: true
    },
    {
      title: 'Meus Dados',
      description: 'Gerenciar informações pessoais',
      href: '/cidadao/perfil',
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      available: true
    }
  ];

  const popularServices = [
    {
      id: 1,
      title: 'Segunda Via de Documentos',
      department: 'Administração',
      description: 'Solicite a segunda via de certidões, declarações e outros documentos municipais',
      icon: FileText,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      requests: 1234,
      avgTime: '2-3 dias'
    },
    {
      id: 2,
      title: 'Consulta de IPTU',
      department: 'Fazenda',
      description: 'Consulte débitos, emita guias de pagamento e solicite parcelamento do IPTU',
      icon: Building2,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      requests: 987,
      avgTime: 'Imediato'
    },
    {
      id: 3,
      title: 'Agendamento Saúde',
      department: 'Saúde',
      description: 'Agende consultas, exames e procedimentos nas unidades de saúde do município',
      icon: Heart,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      requests: 856,
      avgTime: '1-5 dias'
    },
    {
      id: 4,
      title: 'Matrícula Escolar',
      department: 'Educação',
      description: 'Realize a matrícula ou transferência de alunos nas escolas municipais',
      icon: GraduationCap,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      requests: 743,
      avgTime: '3-7 dias'
    },
    {
      id: 5,
      title: 'Cadastro Habitacional',
      department: 'Habitação',
      description: 'Inscreva-se em programas habitacionais e solicite benefícios de moradia',
      icon: Home,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      requests: 621,
      avgTime: '5-10 dias'
    },
    {
      id: 6,
      title: 'Licença Ambiental',
      department: 'Meio Ambiente',
      description: 'Solicite licenças e autorizações para atividades que impactam o meio ambiente',
      icon: TreePine,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      requests: 512,
      avgTime: '10-15 dias'
    },
    {
      id: 7,
      title: 'Abertura de Empresa',
      department: 'Desenvolvimento Econômico',
      description: 'Inicie o processo de abertura de empresa e obtenha alvarás necessários',
      icon: Briefcase,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      requests: 445,
      avgTime: '15-20 dias'
    },
    {
      id: 8,
      title: 'Assistência Social',
      department: 'Assistência Social',
      description: 'Cadastre-se em programas sociais e solicite benefícios assistenciais',
      icon: Users,
      color: 'text-pink-600',
      bgColor: 'bg-pink-50',
      requests: 398,
      avgTime: '7-10 dias'
    }
  ];

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  return (
    <CitizenLayout>
      <div className="space-y-4 sm:space-y-6">
        {/* Header de boas-vindas */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex-1">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                {getGreeting()}, {citizen?.name?.split(' ')[0]}
              </h1>
              <p className="text-sm sm:text-base text-gray-600 mt-1">
                Bem-vindo ao Portal do Cidadão
              </p>
            </div>
            <div className="flex items-center gap-3 self-end sm:self-auto">
              <div className="text-right">
                <p className="text-xs sm:text-sm text-gray-500">CPF</p>
                <p className="text-xs sm:text-sm font-medium text-gray-900">
                  {citizen?.cpf?.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')}
                </p>
              </div>
              <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-blue-600 font-semibold text-lg">
                  {citizen?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.title} className={`border ${stat.borderColor}`}>
                <CardContent className="p-3 sm:p-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
                    <div className="flex-1">
                      <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1">
                        {stat.title}
                      </p>
                      <p className="text-lg sm:text-2xl font-bold text-gray-900">
                        {stat.value}
                      </p>
                    </div>
                    <div className={`${stat.bgColor} p-2 sm:p-3 rounded-lg self-end sm:self-auto`}>
                      <Icon className={`h-4 w-4 sm:h-6 sm:w-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Ações Rápidas */}
        <div>
          <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Ações Rápidas</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <div
                  key={action.title}
                  className="bg-white border border-gray-200 rounded-lg p-6 hover:border-gray-300 transition-colors"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`${action.bgColor} p-3 rounded-lg`}>
                      <Icon className={`h-6 w-6 ${action.color}`} />
                    </div>
                    {!action.available && (
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                        Em breve
                      </span>
                    )}
                  </div>
                  <h3 className="text-base font-semibold text-gray-900 mb-2">
                    {action.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    {action.description}
                  </p>
                  {action.available ? (
                    <Link href={action.href}>
                      <Button variant="outline" className="w-full group">
                        Acessar
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  ) : (
                    <Button variant="outline" className="w-full" disabled>
                      Em desenvolvimento
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Serviços Populares */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Serviços Populares</h2>
              <p className="text-sm text-gray-600 mt-1">Os serviços mais solicitados pelos cidadãos</p>
            </div>
            <Button variant="outline" size="sm" disabled>
              Ver todos
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {popularServices.slice(0, 8).map((service) => {
              const Icon = service.icon;
              return (
                <Card key={service.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className={`${service.bgColor} p-2.5 rounded-lg`}>
                        <Icon className={`h-5 w-5 ${service.color}`} />
                      </div>
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                        Em breve
                      </span>
                    </div>

                    <h3 className="text-sm font-semibold text-gray-900 mb-1 line-clamp-1">
                      {service.title}
                    </h3>

                    <p className="text-xs text-gray-500 mb-3">
                      {service.department}
                    </p>

                    <p className="text-xs text-gray-600 mb-4 line-clamp-2">
                      {service.description}
                    </p>

                    <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-100">
                      <div className="flex items-center gap-1">
                        <Users className="h-3.5 w-3.5" />
                        <span>{service.requests.toLocaleString('pt-BR')}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        <span>{service.avgTime}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Informações Importantes */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h3 className="text-base font-semibold text-blue-900 mb-2">
                Sistema em Desenvolvimento
              </h3>
              <p className="text-sm text-blue-700">
                Este portal está sendo desenvolvido para melhor atendê-lo.
                Em breve você poderá acessar todos os serviços municipais,
                acompanhar protocolos e muito mais.
              </p>
            </div>
          </div>
        </div>

        {/* Informações do Perfil */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Meus Dados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Nome Completo</p>
                <p className="text-sm text-gray-900 mt-1">{citizen?.name || '-'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">CPF</p>
                <p className="text-sm text-gray-900 mt-1">
                  {citizen?.cpf?.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4') || '-'}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">E-mail</p>
                <p className="text-sm text-gray-900 mt-1">{citizen?.email || '-'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Telefone</p>
                <p className="text-sm text-gray-900 mt-1">{citizen?.phone || '-'}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </CitizenLayout>
  );
}
