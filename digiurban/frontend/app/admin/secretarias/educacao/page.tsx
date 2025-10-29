'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  GraduationCap,
  Bus,
  Utensils,
  AlertTriangle,
  FileText,
  ArrowRightLeft,
  Calendar,
  BarChart,
  Building,
  Users
} from 'lucide-react';
import Link from 'next/link';

interface DashboardStats {
  modules: {
    educationAttendances: number;
    students: number;
    schoolTransports: number;
    disciplinaryRecords: number;
    schoolDocuments: number;
    studentTransfers: number;
    attendanceRecords: number;
    gradeRecords: number;
    schoolManagements: number;
    schoolMeals: number;
  };
  schools: number;
}

const moduleCards = [
  {
    title: 'Atendimentos Educacionais',
    href: '/admin/secretarias/educacao/education-attendances',
    icon: FileText,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    key: 'educationAttendances' as keyof DashboardStats['modules'],
  },
  {
    title: 'Matrículas de Alunos',
    href: '/admin/secretarias/educacao/students',
    icon: GraduationCap,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    key: 'students' as keyof DashboardStats['modules'],
  },
  {
    title: 'Transporte Escolar',
    href: '/admin/secretarias/educacao/school-transports',
    icon: Bus,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50',
    key: 'schoolTransports' as keyof DashboardStats['modules'],
  },
  {
    title: 'Ocorrências Disciplinares',
    href: '/admin/secretarias/educacao/disciplinary-records',
    icon: AlertTriangle,
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    key: 'disciplinaryRecords' as keyof DashboardStats['modules'],
  },
  {
    title: 'Documentos Escolares',
    href: '/admin/secretarias/educacao/school-documents',
    icon: FileText,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    key: 'schoolDocuments' as keyof DashboardStats['modules'],
  },
  {
    title: 'Transferências',
    href: '/admin/secretarias/educacao/student-transfers',
    icon: ArrowRightLeft,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50',
    key: 'studentTransfers' as keyof DashboardStats['modules'],
  },
  {
    title: 'Frequência',
    href: '/admin/secretarias/educacao/attendance-records',
    icon: Calendar,
    color: 'text-cyan-600',
    bgColor: 'bg-cyan-50',
    key: 'attendanceRecords' as keyof DashboardStats['modules'],
  },
  {
    title: 'Notas',
    href: '/admin/secretarias/educacao/grade-records',
    icon: BarChart,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
    key: 'gradeRecords' as keyof DashboardStats['modules'],
  },
  {
    title: 'Gestão Escolar',
    href: '/admin/secretarias/educacao/school-management',
    icon: Building,
    color: 'text-slate-600',
    bgColor: 'bg-slate-50',
    key: 'schoolManagements' as keyof DashboardStats['modules'],
  },
  {
    title: 'Merenda Escolar',
    href: '/admin/secretarias/educacao/school-meals',
    icon: Utensils,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    key: 'schoolMeals' as keyof DashboardStats['modules'],
  },
];

export default function EducacaoPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/secretarias/educacao/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data.data);
      }
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Secretaria de Educação</h1>
        <p className="text-muted-foreground mt-2">
          Gestão completa da educação municipal com 11 módulos integrados
        </p>
      </div>

      {/* Métricas Principais */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Alunos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? '...' : stats?.modules.students || 0}
            </div>
            <p className="text-xs text-muted-foreground">Alunos matriculados ativos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Escolas</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? '...' : stats?.schools || 0}
            </div>
            <p className="text-xs text-muted-foreground">Escolas municipais ativas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rotas de Transporte</CardTitle>
            <Bus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? '...' : stats?.modules.schoolTransports || 0}
            </div>
            <p className="text-xs text-muted-foreground">Rotas ativas de transporte</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Atendimentos</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? '...' : stats?.modules.educationAttendances || 0}
            </div>
            <p className="text-xs text-muted-foreground">Atendimentos realizados</p>
          </CardContent>
        </Card>
      </div>

      {/* Módulos */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Módulos de Educação</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {moduleCards.map((module) => {
            const Icon = module.icon;
            const count = stats?.modules[module.key] || 0;

            return (
              <Link key={module.href} href={module.href}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardHeader>
                    <div className={`w-12 h-12 rounded-lg ${module.bgColor} flex items-center justify-center mb-2`}>
                      <Icon className={`h-6 w-6 ${module.color}`} />
                    </div>
                    <CardTitle className="text-base">{module.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <div className="text-2xl font-bold text-muted-foreground">...</div>
                    ) : (
                      <div className="text-2xl font-bold">{count}</div>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">
                      {count === 1 ? 'registro' : 'registros'}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Informações Adicionais */}
      <Card>
        <CardHeader>
          <CardTitle>Sobre a Secretaria de Educação</CardTitle>
          <CardDescription>
            Sistema integrado de gestão educacional
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-sm text-muted-foreground">
            • 11 módulos completos de gestão educacional
          </p>
          <p className="text-sm text-muted-foreground">
            • Integração com sistema de protocolos
          </p>
          <p className="text-sm text-muted-foreground">
            • Controle de matrículas, frequência e desempenho
          </p>
          <p className="text-sm text-muted-foreground">
            • Gestão de transporte e merenda escolar
          </p>
          <p className="text-sm text-muted-foreground">
            • Acompanhamento disciplinar e documentação
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
