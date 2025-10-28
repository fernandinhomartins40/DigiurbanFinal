'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Stethoscope, Search, Filter, Calendar } from 'lucide-react';

export default function ConsultasServicosPage() {
  const [statusFilter, setStatusFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const { data: appointments, isLoading } = useQuery({
    queryKey: ['appointments-servicos', statusFilter, sourceFilter],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (sourceFilter !== 'all') params.append('source', sourceFilter);

      const res = await fetch(`http://localhost:3001/api/secretarias/health/appointments?${params}`, {
        credentials: 'include'
      });
      if (!res.ok) return [];
      return res.json();
    }
  });

  const filteredAppointments = appointments?.filter((apt: any) =>
    searchTerm === '' ||
    apt.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    apt.protocol?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: any; label: string }> = {
      pending: { variant: 'warning', label: 'Pendente' },
      scheduled: { variant: 'default', label: 'Agendada' },
      confirmed: { variant: 'success', label: 'Confirmada' },
      completed: { variant: 'secondary', label: 'Realizada' },
      cancelled: { variant: 'destructive', label: 'Cancelada' }
    };
    const config = variants[status] || { variant: 'default', label: status };
    return <Badge variant={config.variant as any}>{config.label}</Badge>;
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3">
        <Stethoscope className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-2xl font-bold">Consultas Médicas - Portal do Cidadão</h1>
          <p className="text-sm text-muted-foreground">
            Gerencie agendamentos de consultas médicas vindos do portal
          </p>
        </div>
      </div>

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
                  placeholder="Nome do paciente ou protocolo..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Status</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="pending">Pendentes</SelectItem>
                  <SelectItem value="scheduled">Agendadas</SelectItem>
                  <SelectItem value="confirmed">Confirmadas</SelectItem>
                  <SelectItem value="completed">Realizadas</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Origem</label>
              <Select value={sourceFilter} onValueChange={setSourceFilter}>
                <SelectTrigger><SelectValue /></SelectTrigger>
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

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{filteredAppointments.length}</div>
            <p className="text-xs text-muted-foreground">Total</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-yellow-600">
              {filteredAppointments.filter((a: any) => a.status === 'pending').length}
            </div>
            <p className="text-xs text-muted-foreground">Pendentes</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">
              {filteredAppointments.filter((a: any) => a.status === 'confirmed').length}
            </div>
            <p className="text-xs text-muted-foreground">Confirmadas</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-blue-600">
              {filteredAppointments.filter((a: any) => a.source === 'service').length}
            </div>
            <p className="text-xs text-muted-foreground">Do Portal</p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        {isLoading ? (
          <Card><CardContent className="pt-6"><p className="text-center text-muted-foreground">Carregando...</p></CardContent></Card>
        ) : filteredAppointments.length === 0 ? (
          <Card><CardContent className="pt-6"><p className="text-center text-muted-foreground">Nenhuma consulta encontrada</p></CardContent></Card>
        ) : (
          filteredAppointments.map((appointment: any) => (
            <Card key={appointment.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{appointment.patientName}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Especialidade: {appointment.specialty}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {getStatusBadge(appointment.status)}
                    {appointment.source === 'service' && (
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        Portal
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  {appointment.patientCpf && <div><span className="font-medium">CPF:</span> {appointment.patientCpf}</div>}
                  {appointment.patientPhone && <div><span className="font-medium">Telefone:</span> {appointment.patientPhone}</div>}
                  {appointment.healthUnit && <div><span className="font-medium">UBS:</span> {appointment.healthUnit}</div>}
                  {appointment.protocol && (
                    <div>
                      <span className="font-medium">Protocolo:</span>{' '}
                      <code className="bg-muted px-2 py-1 rounded text-xs">{appointment.protocol}</code>
                    </div>
                  )}
                  <div className="flex gap-2 pt-2">
                    <Button size="sm" variant="outline">Ver Detalhes</Button>
                    {appointment.status === 'pending' && (
                      <Button size="sm" className="gap-2">
                        <Calendar className="h-4 w-4" />
                        Agendar Consulta
                      </Button>
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
