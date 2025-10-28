'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Syringe, Pill, Activity, Clock, CheckCircle } from 'lucide-react';

interface DashboardStats {
  consultas: { total: number; pending: number; scheduled: number };
  vacinas: { total: number; pending: number; scheduled: number };
  medicamentos: { total: number; pending: number; delivered: number };
  exames: { total: number; pending: number; scheduled: number };
}

export default function SaudeDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setStats({
        consultas: { total: 342, pending: 45, scheduled: 297 },
        vacinas: { total: 156, pending: 12, scheduled: 144 },
        medicamentos: { total: 289, pending: 23, delivered: 266 },
        exames: { total: 178, pending: 18, scheduled: 160 }
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard - Saúde</h1>
        <p className="text-muted-foreground">Visão geral dos serviços de saúde</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Consultas</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.consultas.total}</div>
            <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {stats?.consultas.pending} pendentes
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3" />
                {stats?.consultas.scheduled} agendadas
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vacinas</CardTitle>
            <Syringe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.vacinas.total}</div>
            <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {stats?.vacinas.pending} pendentes
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3" />
                {stats?.vacinas.scheduled} agendadas
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Medicamentos</CardTitle>
            <Pill className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.medicamentos.total}</div>
            <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {stats?.medicamentos.pending} pendentes
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3" />
                {stats?.medicamentos.delivered} entregues
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Exames</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.exames.total}</div>
            <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {stats?.exames.pending} pendentes
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3" />
                {stats?.exames.scheduled} agendados
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
