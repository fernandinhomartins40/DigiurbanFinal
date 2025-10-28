'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Bus, Search, Filter, MapPin } from 'lucide-react';

export default function TransporteServicosPage() {
  const [statusFilter, setStatusFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const { data: transports, isLoading } = useQuery({
    queryKey: ['transports-servicos', statusFilter, sourceFilter],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (sourceFilter !== 'all') params.append('source', sourceFilter);

      const res = await fetch(`http://localhost:3001/api/secretarias/education/transport?${params}`, {
        credentials: 'include'
      });
      if (!res.ok) throw new Error('Erro ao carregar transportes');
      return res.json();
    }
  });

  const filteredTransports = transports?.filter((transport: any) =>
    searchTerm === '' ||
    transport.route?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transport.protocol?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: any; label: string }> = {
      pending: { variant: 'warning', label: 'Pendente' },
      approved: { variant: 'default', label: 'Aprovado' },
      active: { variant: 'success', label: 'Ativo' },
      cancelled: { variant: 'destructive', label: 'Cancelado' }
    };
    const config = variants[status] || { variant: 'default', label: status };
    return <Badge variant={config.variant as any}>{config.label}</Badge>;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Bus className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold">Transporte Escolar - Portal do Cidadão</h1>
            <p className="text-sm text-muted-foreground">
              Gerencie solicitações de transporte escolar vindas do portal
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
                  placeholder="Rota ou protocolo..."
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
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="pending">Pendentes</SelectItem>
                  <SelectItem value="approved">Aprovados</SelectItem>
                  <SelectItem value="active">Ativos</SelectItem>
                  <SelectItem value="cancelled">Cancelados</SelectItem>
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
            <div className="text-2xl font-bold">{filteredTransports.length}</div>
            <p className="text-xs text-muted-foreground">Total</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-yellow-600">
              {filteredTransports.filter((t: any) => t.status === 'pending').length}
            </div>
            <p className="text-xs text-muted-foreground">Pendentes</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">
              {filteredTransports.filter((t: any) => t.status === 'active').length}
            </div>
            <p className="text-xs text-muted-foreground">Ativos</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-blue-600">
              {filteredTransports.filter((t: any) => t.source === 'service').length}
            </div>
            <p className="text-xs text-muted-foreground">Do Portal</p>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Transportes */}
      <div className="space-y-4">
        {isLoading ? (
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">Carregando...</p>
            </CardContent>
          </Card>
        ) : filteredTransports.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">Nenhuma solicitação encontrada</p>
            </CardContent>
          </Card>
        ) : (
          filteredTransports.map((transport: any) => (
            <Card key={transport.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Bus className="h-5 w-5" />
                      Rota: {transport.route || 'A definir'}
                    </CardTitle>
                    <CardDescription>
                      Turno: {transport.shift}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    {getStatusBadge(transport.status)}
                    {transport.source === 'service' && (
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        Portal do Cidadão
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {transport.address && (
                    <div className="flex items-start gap-2 text-sm">
                      <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" />
                      <div>
                        <span className="font-medium">Endereço:</span>{' '}
                        {transport.address}
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    {transport.driver && (
                      <div>
                        <span className="font-medium">Motorista:</span> {transport.driver}
                      </div>
                    )}
                    {transport.vehicle && (
                      <div>
                        <span className="font-medium">Veículo:</span> {transport.vehicle}
                      </div>
                    )}
                  </div>

                  {transport.protocol && (
                    <div className="text-sm">
                      <span className="font-medium">Protocolo:</span>{' '}
                      <code className="bg-muted px-2 py-1 rounded text-xs">
                        {transport.protocol}
                      </code>
                    </div>
                  )}

                  <div className="flex gap-2 pt-2">
                    <Button size="sm" variant="outline">
                      Ver Detalhes
                    </Button>
                    {transport.status === 'pending' && (
                      <>
                        <Button size="sm" variant="default">
                          Aprovar e Definir Rota
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
