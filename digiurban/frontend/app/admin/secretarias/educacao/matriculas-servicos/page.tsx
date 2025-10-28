'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { GraduationCap, Search, Filter } from 'lucide-react';

export default function MatriculasServicosPage() {
  const [statusFilter, setStatusFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const { data: enrollments, isLoading } = useQuery({
    queryKey: ['enrollments-servicos', statusFilter, sourceFilter],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (sourceFilter !== 'all') params.append('source', sourceFilter);

      const res = await fetch(`http://localhost:3001/api/secretarias/education/enrollments?${params}`, {
        credentials: 'include'
      });
      if (!res.ok) throw new Error('Erro ao carregar matrículas');
      return res.json();
    }
  });

  const filteredEnrollments = enrollments?.filter((enrollment: any) =>
    searchTerm === '' ||
    enrollment.student?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    enrollment.protocol?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: any; label: string }> = {
      pending_approval: { variant: 'warning', label: 'Pendente Aprovação' },
      ativo: { variant: 'success', label: 'Ativo' },
      transferido: { variant: 'secondary', label: 'Transferido' },
      cancelado: { variant: 'destructive', label: 'Cancelado' }
    };
    const config = variants[status] || { variant: 'default', label: status };
    return <Badge variant={config.variant as any}>{config.label}</Badge>;
  };

  const getSourceBadge = (source: string) => {
    return source === 'service' ? (
      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
        Portal do Cidadão
      </Badge>
    ) : (
      <Badge variant="outline">Cadastro Manual</Badge>
    );
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <GraduationCap className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold">Matrículas - Portal do Cidadão</h1>
            <p className="text-sm text-muted-foreground">
              Gerencie solicitações de matrícula vindas do portal
            </p>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Buscar</label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Nome do aluno ou protocolo..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Status</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="pending_approval">Pendentes</SelectItem>
                  <SelectItem value="ativo">Ativas</SelectItem>
                  <SelectItem value="transferido">Transferidas</SelectItem>
                  <SelectItem value="cancelado">Canceladas</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Origem</label>
              <Select value={sourceFilter} onValueChange={setSourceFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="service">Portal do Cidadão</SelectItem>
                  <SelectItem value="manual">Cadastro Manual</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              {filteredEnrollments.length}
            </div>
            <p className="text-xs text-muted-foreground">Total</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-yellow-600">
              {filteredEnrollments.filter((e: any) => e.status === 'pending_approval').length}
            </div>
            <p className="text-xs text-muted-foreground">Pendentes</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">
              {filteredEnrollments.filter((e: any) => e.status === 'ativo').length}
            </div>
            <p className="text-xs text-muted-foreground">Ativas</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-blue-600">
              {filteredEnrollments.filter((e: any) => e.source === 'service').length}
            </div>
            <p className="text-xs text-muted-foreground">Do Portal</p>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Matrículas */}
      <div className="space-y-4">
        {isLoading ? (
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">Carregando...</p>
            </CardContent>
          </Card>
        ) : filteredEnrollments.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">Nenhuma matrícula encontrada</p>
            </CardContent>
          </Card>
        ) : (
          filteredEnrollments.map((enrollment: any) => (
            <Card key={enrollment.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">
                      {enrollment.student?.name || 'Nome não informado'}
                    </CardTitle>
                    <CardDescription>
                      Série/Ano: {enrollment.grade || 'N/A'} • Ano: {enrollment.year}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    {getStatusBadge(enrollment.status)}
                    {enrollment.source && getSourceBadge(enrollment.source)}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">CPF do Estudante:</span>{' '}
                    {enrollment.student?.cpf || 'Não informado'}
                  </div>
                  <div>
                    <span className="font-medium">Responsável:</span>{' '}
                    {enrollment.student?.parentName || 'Não informado'}
                  </div>
                  {enrollment.protocol && (
                    <div className="md:col-span-2">
                      <span className="font-medium">Protocolo:</span>{' '}
                      <code className="bg-muted px-2 py-1 rounded text-xs">
                        {enrollment.protocol}
                      </code>
                    </div>
                  )}
                  {enrollment.serviceId && (
                    <div className="md:col-span-2">
                      <span className="font-medium">ID do Serviço:</span>{' '}
                      <code className="bg-muted px-2 py-1 rounded text-xs">
                        {enrollment.serviceId}
                      </code>
                    </div>
                  )}
                  <div className="md:col-span-2 flex gap-2">
                    <Button size="sm" variant="outline">
                      Ver Detalhes
                    </Button>
                    {enrollment.status === 'pending_approval' && (
                      <>
                        <Button size="sm" variant="default">
                          Aprovar
                        </Button>
                        <Button size="sm" variant="destructive">
                          Rejeitar
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
