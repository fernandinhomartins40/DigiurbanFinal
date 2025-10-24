'use client';

import { useState } from 'react';
import { CitizenLayout } from '@/components/citizen/CitizenLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  FileText,
  Search,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Eye,
  Calendar,
  Building2
} from 'lucide-react';

export default function ProtocolosPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');

  const statusTypes = [
    { id: 'todos', name: 'Todos', color: 'gray' },
    { id: 'pendente', name: 'Pendente', color: 'yellow' },
    { id: 'em_andamento', name: 'Em Andamento', color: 'blue' },
    { id: 'concluido', name: 'Concluído', color: 'green' },
    { id: 'cancelado', name: 'Cancelado', color: 'red' }
  ];

  // Dados de exemplo - em produção virão do backend
  const protocols = [
    {
      id: 'PROT-2024-001',
      service: 'Segunda Via de Certidão',
      department: 'Administração',
      status: 'concluido',
      createdAt: '2024-01-15',
      updatedAt: '2024-01-18',
      description: 'Solicitação de segunda via de certidão de nascimento'
    },
    {
      id: 'PROT-2024-002',
      service: 'Agendamento de Consulta',
      department: 'Saúde',
      status: 'em_andamento',
      createdAt: '2024-01-20',
      updatedAt: '2024-01-22',
      description: 'Agendamento de consulta médica na UBS Central'
    },
    {
      id: 'PROT-2024-003',
      service: 'Consulta IPTU',
      department: 'Fazenda',
      status: 'pendente',
      createdAt: '2024-01-25',
      updatedAt: '2024-01-25',
      description: 'Consulta de débitos de IPTU do exercício 2024'
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pendente':
        return <Clock className="h-5 w-5 text-yellow-600" />;
      case 'em_andamento':
        return <AlertCircle className="h-5 w-5 text-blue-600" />;
      case 'concluido':
        return <CheckCircle2 className="h-5 w-5 text-green-600" />;
      case 'cancelado':
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return <FileText className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { bg: string; text: string; label: string }> = {
      pendente: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Pendente' },
      em_andamento: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Em Andamento' },
      concluido: { bg: 'bg-green-100', text: 'text-green-700', label: 'Concluído' },
      cancelado: { bg: 'bg-red-100', text: 'text-red-700', label: 'Cancelado' }
    };

    const config = statusConfig[status] || { bg: 'bg-gray-100', text: 'text-gray-700', label: status };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  const filteredProtocols = protocols.filter(protocol => {
    const matchesSearch = protocol.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         protocol.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         protocol.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'todos' || protocol.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: protocols.length,
    pendente: protocols.filter(p => p.status === 'pendente').length,
    em_andamento: protocols.filter(p => p.status === 'em_andamento').length,
    concluido: protocols.filter(p => p.status === 'concluido').length
  };

  return (
    <CitizenLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Meus Protocolos</h1>
          <p className="text-gray-600 mt-1">Acompanhe o status das suas solicitações</p>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-gray-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                </div>
                <FileText className="h-8 w-8 text-gray-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-yellow-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Pendente</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.pendente}</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Em Andamento</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.em_andamento}</p>
                </div>
                <AlertCircle className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-green-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Concluído</p>
                  <p className="text-2xl font-bold text-green-600">{stats.concluido}</p>
                </div>
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Busca e Filtros */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Buscar por número, serviço ou departamento..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {statusTypes.map((status) => (
              <Button
                key={status.id}
                variant={statusFilter === status.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter(status.id)}
                className="whitespace-nowrap"
              >
                {status.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Lista de Protocolos */}
        <div className="space-y-4">
          {filteredProtocols.length > 0 ? (
            filteredProtocols.map((protocol) => (
              <Card key={protocol.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="bg-gray-100 p-3 rounded-lg">
                        {getStatusIcon(protocol.status)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {protocol.id}
                          </h3>
                          {getStatusBadge(protocol.status)}
                        </div>
                        <p className="text-base text-gray-900 mb-1">{protocol.service}</p>
                        <p className="text-sm text-gray-600 mb-3">{protocol.description}</p>

                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Building2 className="h-4 w-4" />
                            <span>{protocol.department}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>Criado em {new Date(protocol.createdAt).toLocaleDateString('pt-BR')}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>Atualizado em {new Date(protocol.updatedAt).toLocaleDateString('pt-BR')}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <Button size="sm" variant="outline" disabled>
                      <Eye className="h-4 w-4 mr-2" />
                      Detalhes
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">Nenhum protocolo encontrado</p>
                <p className="text-sm text-gray-500">
                  {searchTerm || statusFilter !== 'todos'
                    ? 'Tente ajustar os filtros de busca'
                    : 'Você ainda não possui protocolos. Solicite um serviço para começar.'}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </CitizenLayout>
  );
}
