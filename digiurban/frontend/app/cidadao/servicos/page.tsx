'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { CitizenLayout } from '@/components/citizen/CitizenLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  FileText,
  Search,
  Clock,
  ArrowRight,
  Filter,
  Loader2
} from 'lucide-react';
import { useCitizenServices } from '@/hooks/useCitizenServices';
import { toast } from 'sonner';

export default function ServicosPage() {
  const router = useRouter();
  const { services, loading, error } = useCitizenServices();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('todos');

  const handleSolicitar = (serviceId: string, serviceName: string) => {
    router.push(`/cidadao/servicos/${serviceId}/solicitar`);
  };

  // Extrair categorias únicas dos serviços
  const categories = useMemo(() => {
    const uniqueCategories = new Set(services.map(s => s.category).filter(Boolean));
    return [
      { id: 'todos', name: 'Todos os Serviços' },
      ...Array.from(uniqueCategories).map(cat => ({
        id: cat as string,
        name: cat as string
      }))
    ];
  }, [services]);

  const filteredServices = useMemo(() => {
    return services.filter(service => {
      const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (service.description?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                           service.department?.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'todos' || service.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [services, searchTerm, selectedCategory]);

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

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
            <span className="ml-2 text-gray-600">Carregando serviços...</span>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Estatísticas */}
        {!loading && !error && (
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
        )}

        {/* Lista de Serviços */}
        {!loading && !error && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredServices.map((service) => (
              <Card key={service.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="bg-blue-50 p-2 sm:p-3 rounded-lg flex-shrink-0">
                      <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1">
                        {service.name}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-500 mb-2 sm:mb-3">
                        {service.department?.name || 'Sem departamento'}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4 line-clamp-2 sm:line-clamp-none">
                        {service.description || 'Sem descrição'}
                      </p>

                      <div className="space-y-2 sm:space-y-3">
                        {service.requiredDocuments && service.requiredDocuments.length > 0 && (
                          <div>
                            <p className="text-xs font-medium text-gray-700 mb-1 sm:mb-2">Documentos:</p>
                            <div className="flex flex-wrap gap-1">
                              {service.requiredDocuments.map((req, idx) => (
                                <span
                                  key={idx}
                                  className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                                >
                                  {req}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0 pt-2 sm:pt-3 border-t border-gray-100">
                          <div className="flex items-center gap-1 text-xs sm:text-sm text-gray-500">
                            <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                            <span>{service.estimatedDays ? `${service.estimatedDays} dias` : 'A definir'}</span>
                          </div>
                          <Button
                            size="sm"
                            className="w-full sm:w-auto text-xs sm:text-sm"
                            onClick={() => handleSolicitar(service.id, service.name)}
                          >
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
            ))}
          </div>
        )}

        {!loading && !error && filteredServices.length === 0 && (
          <div className="text-center py-12">
            <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Nenhum serviço encontrado com os filtros selecionados</p>
          </div>
        )}
      </div>
    </CitizenLayout>
  );
}
