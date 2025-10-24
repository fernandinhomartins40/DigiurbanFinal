'use client';

import { useState } from 'react';
import { CitizenLayout } from '@/components/citizen/CitizenLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  FileText,
  Building2,
  Heart,
  GraduationCap,
  Home,
  TreePine,
  Briefcase,
  Users,
  Search,
  Clock,
  ArrowRight,
  Filter
} from 'lucide-react';

export default function ServicosPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('todos');

  const categories = [
    { id: 'todos', name: 'Todos os Serviços' },
    { id: 'documentos', name: 'Documentos' },
    { id: 'saude', name: 'Saúde' },
    { id: 'educacao', name: 'Educação' },
    { id: 'habitacao', name: 'Habitação' },
    { id: 'meio-ambiente', name: 'Meio Ambiente' },
    { id: 'economia', name: 'Economia' },
    { id: 'social', name: 'Assistência Social' }
  ];

  const services = [
    {
      id: 1,
      title: 'Segunda Via de Documentos',
      department: 'Administração',
      category: 'documentos',
      description: 'Solicite a segunda via de certidões, declarações e outros documentos municipais',
      icon: FileText,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      requirements: ['CPF', 'Comprovante de residência'],
      avgTime: '2-3 dias'
    },
    {
      id: 2,
      title: 'Consulta de IPTU',
      department: 'Fazenda',
      category: 'documentos',
      description: 'Consulte débitos, emita guias de pagamento e solicite parcelamento do IPTU',
      icon: Building2,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      requirements: ['Inscrição municipal'],
      avgTime: 'Imediato'
    },
    {
      id: 3,
      title: 'Agendamento Saúde',
      department: 'Saúde',
      category: 'saude',
      description: 'Agende consultas, exames e procedimentos nas unidades de saúde do município',
      icon: Heart,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      requirements: ['Cartão SUS', 'CPF'],
      avgTime: '1-5 dias'
    },
    {
      id: 4,
      title: 'Matrícula Escolar',
      department: 'Educação',
      category: 'educacao',
      description: 'Realize a matrícula ou transferência de alunos nas escolas municipais',
      icon: GraduationCap,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      requirements: ['Certidão de nascimento', 'CPF do responsável', 'Comprovante de residência'],
      avgTime: '3-7 dias'
    },
    {
      id: 5,
      title: 'Cadastro Habitacional',
      department: 'Habitação',
      category: 'habitacao',
      description: 'Inscreva-se em programas habitacionais e solicite benefícios de moradia',
      icon: Home,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      requirements: ['CPF', 'RG', 'Comprovante de renda', 'Comprovante de residência'],
      avgTime: '5-10 dias'
    },
    {
      id: 6,
      title: 'Licença Ambiental',
      department: 'Meio Ambiente',
      category: 'meio-ambiente',
      description: 'Solicite licenças e autorizações para atividades que impactam o meio ambiente',
      icon: TreePine,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      requirements: ['CNPJ/CPF', 'Projeto técnico', 'ART'],
      avgTime: '10-15 dias'
    },
    {
      id: 7,
      title: 'Abertura de Empresa',
      department: 'Desenvolvimento Econômico',
      category: 'economia',
      description: 'Inicie o processo de abertura de empresa e obtenha alvarás necessários',
      icon: Briefcase,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      requirements: ['CNPJ', 'Contrato social', 'Comprovante de endereço'],
      avgTime: '15-20 dias'
    },
    {
      id: 8,
      title: 'Assistência Social',
      department: 'Assistência Social',
      category: 'social',
      description: 'Cadastre-se em programas sociais e solicite benefícios assistenciais',
      icon: Users,
      color: 'text-pink-600',
      bgColor: 'bg-pink-50',
      requirements: ['CPF', 'RG', 'Comprovante de renda familiar'],
      avgTime: '7-10 dias'
    }
  ];

  const filteredServices = services.filter(service => {
    const matchesSearch = service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'todos' || service.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <CitizenLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Catálogo de Serviços</h1>
          <p className="text-gray-600 mt-1">Encontre e solicite os serviços municipais disponíveis</p>
        </div>

        {/* Busca e Filtros */}
        <div className="flex flex-col gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Buscar serviços..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12 text-base"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className="whitespace-nowrap flex-shrink-0"
              >
                {category.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total de Serviços</p>
                  <p className="text-2xl font-bold text-gray-900">{services.length}</p>
                </div>
                <FileText className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Categorias</p>
                  <p className="text-2xl font-bold text-gray-900">{categories.length - 1}</p>
                </div>
                <Filter className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Resultados</p>
                  <p className="text-2xl font-bold text-gray-900">{filteredServices.length}</p>
                </div>
                <Search className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Lista de Serviços */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredServices.map((service) => {
            const Icon = service.icon;
            return (
              <Card key={service.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className={`${service.bgColor} p-2 sm:p-3 rounded-lg flex-shrink-0`}>
                      <Icon className={`h-5 w-5 sm:h-6 sm:w-6 ${service.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1">
                        {service.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-500 mb-2 sm:mb-3">{service.department}</p>
                      <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4 line-clamp-2 sm:line-clamp-none">{service.description}</p>

                      <div className="space-y-2 sm:space-y-3">
                        <div>
                          <p className="text-xs font-medium text-gray-700 mb-1 sm:mb-2">Documentos:</p>
                          <div className="flex flex-wrap gap-1">
                            {service.requirements.map((req, idx) => (
                              <span
                                key={idx}
                                className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                              >
                                {req}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0 pt-2 sm:pt-3 border-t border-gray-100">
                          <div className="flex items-center gap-1 text-xs sm:text-sm text-gray-500">
                            <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                            <span>{service.avgTime}</span>
                          </div>
                          <Button size="sm" disabled className="w-full sm:w-auto text-xs sm:text-sm">
                            <span className="hidden sm:inline">Solicitar</span>
                            <span className="sm:hidden">Solicitar Serviço</span>
                            <ArrowRight className="ml-2 h-3 w-3 sm:h-4 sm:w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredServices.length === 0 && (
          <div className="text-center py-12">
            <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Nenhum serviço encontrado com os filtros selecionados</p>
          </div>
        )}
      </div>
    </CitizenLayout>
  );
}
