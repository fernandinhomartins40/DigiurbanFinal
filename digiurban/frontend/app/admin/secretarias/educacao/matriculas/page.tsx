'use client';

import { useEffect, useState } from 'react';
import { DataTable } from '@/components/admin/DataTable';
import { ProtocolBadge } from '@/components/admin/ProtocolBadge';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { SourceIndicator } from '@/components/admin/SourceIndicator';
import { ApprovalActions } from '@/components/admin/ApprovalActions';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Download } from 'lucide-react';

interface Matricula {
  id: string;
  protocol: string;
  studentName: string;
  school: string;
  grade: string;
  status: 'pending' | 'approved' | 'rejected';
  source: 'service' | 'manual' | 'import';
  createdAt: string;
}

export default function MatriculasPage() {
  const [data, setData] = useState<Matricula[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sourceFilter, setSourceFilter] = useState<string>('all');
  const limit = 10;

  useEffect(() => {
    fetchData();
  }, [page, search, statusFilter, sourceFilter]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // TODO: Implement API call
      const mockData: Matricula[] = [
        {
          id: '1',
          protocol: 'MAT-2025-001',
          studentName: 'João Silva',
          school: 'E.M. João Paulo II',
          grade: '1º Ano',
          status: 'pending',
          source: 'service',
          createdAt: '2025-01-15T10:30:00Z'
        },
        {
          id: '2',
          protocol: 'MAT-2025-002',
          studentName: 'Maria Santos',
          school: 'E.M. Santa Clara',
          grade: '3º Ano',
          status: 'approved',
          source: 'manual',
          createdAt: '2025-01-14T14:20:00Z'
        }
      ];
      setData(mockData);
      setTotal(mockData.length);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (id: string, notes?: string) => {
    console.log('Approving:', id, notes);
    // TODO: Implement API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    fetchData();
  };

  const handleReject = async (id: string, reason: string) => {
    console.log('Rejecting:', id, reason);
    // TODO: Implement API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    fetchData();
  };

  const columns = [
    {
      header: 'Protocolo',
      accessor: (row: Matricula) => <ProtocolBadge protocol={row.protocol} />
    },
    {
      header: 'Aluno',
      accessor: 'studentName' as keyof Matricula
    },
    {
      header: 'Escola',
      accessor: 'school' as keyof Matricula
    },
    {
      header: 'Série',
      accessor: 'grade' as keyof Matricula
    },
    {
      header: 'Status',
      accessor: (row: Matricula) => <StatusBadge status={row.status} />
    },
    {
      header: 'Origem',
      accessor: (row: Matricula) => <SourceIndicator source={row.source} />
    },
    {
      header: 'Data',
      accessor: (row: Matricula) => new Date(row.createdAt).toLocaleDateString('pt-BR')
    },
    {
      header: 'Ações',
      accessor: (row: Matricula) => (
        row.status === 'pending' ? (
          <ApprovalActions
            itemId={row.id}
            itemType="Matrícula"
            onApprove={handleApprove}
            onReject={handleReject}
          />
        ) : null
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Matrículas Escolares</h1>
          <p className="text-muted-foreground">Gerenciar solicitações de matrícula</p>
        </div>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Exportar
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome do aluno ou protocolo..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filtrar por status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os status</SelectItem>
            <SelectItem value="pending">Pendente</SelectItem>
            <SelectItem value="approved">Aprovado</SelectItem>
            <SelectItem value="rejected">Rejeitado</SelectItem>
          </SelectContent>
        </Select>
        <Select value={sourceFilter} onValueChange={setSourceFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filtrar por origem" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as origens</SelectItem>
            <SelectItem value="service">Portal do Cidadão</SelectItem>
            <SelectItem value="manual">Cadastro Manual</SelectItem>
            <SelectItem value="import">Importação</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <DataTable
        data={data}
        columns={columns}
        pagination={{
          page,
          limit,
          total,
          onPageChange: setPage
        }}
        isLoading={isLoading}
        emptyMessage="Nenhuma matrícula encontrada"
      />
    </div>
  );
}
