'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Bus, UtensilsCrossed, PackageOpen, Clock, CheckCircle } from 'lucide-react';

interface DashboardStats {
  matriculas: { total: number; pending: number; approved: number };
  transporte: { total: number; pending: number; approved: number };
  merenda: { total: number; pending: number; approved: number };
  material: { total: number; pending: number; approved: number };
}

export default function EducacaoDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // TODO: Implement API call
      setStats({
        matriculas: { total: 245, pending: 18, approved: 227 },
        transporte: { total: 156, pending: 12, approved: 144 },
        merenda: { total: 312, pending: 5, approved: 307 },
        material: { total: 289, pending: 15, approved: 274 }
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
        <h1 className="text-3xl font-bold">Dashboard - Educação</h1>
        <p className="text-muted-foreground">Visão geral dos serviços de educação</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Matrículas</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.matriculas.total}</div>
            <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {stats?.matriculas.pending} pendentes
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3" />
                {stats?.matriculas.approved} aprovadas
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Transporte Escolar</CardTitle>
            <Bus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.transporte.total}</div>
            <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {stats?.transporte.pending} pendentes
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3" />
                {stats?.transporte.approved} aprovados
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Merenda Escolar</CardTitle>
            <UtensilsCrossed className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.merenda.total}</div>
            <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {stats?.merenda.pending} pendentes
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3" />
                {stats?.merenda.approved} aprovados
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Material Escolar</CardTitle>
            <PackageOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.material.total}</div>
            <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {stats?.material.pending} pendentes
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3" />
                {stats?.material.approved} aprovados
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Solicitações Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              Últimas solicitações receberão atenção prioritária
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Alertas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              {stats && stats.matriculas.pending + stats.transporte.pending + stats.merenda.pending + stats.material.pending} solicitações aguardando aprovação
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
