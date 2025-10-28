'use client';

import { useEffect, useState } from 'react';
import { DataTable } from '@/components/admin/DataTable';
import { ProtocolBadge } from '@/components/admin/ProtocolBadge';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { SourceIndicator } from '@/components/admin/SourceIndicator';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Download } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface MerendaEscolar {
  id: string;
  protocol: string;
  studentName: string;
  school: string;
  restrictions: string[];
  status: 'active' | 'pending' | 'cancelled';
  source: 'service' | 'manual' | 'import';
  createdAt: string;
}

export default function MerendaPage() {
  const [data, setData] = useState<MerendaEscolar[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const limit = 10;

  useEffect(() => {
    fetchData();
  }, [page, search, statusFilter]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // TODO: Implement API call
      const mockData: MerendaEscolar[] = [
        {
          id: '1',
          protocol: 'MER-2025-001',
          studentName: 'Ana Paula Costa',
          school: 'E.M. João Paulo II',
          restrictions: ['Intolerância à lactose', 'Vegetariano'],
          status: 'active',
          source: 'service',
          createdAt: '2025-01-15T10:30:00Z'
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

  const columns = [
    {
      header: 'Protocolo',
      accessor: (row: MerendaEscolar) => <ProtocolBadge protocol={row.protocol} />
    },
    {
      header: 'Aluno',
      accessor: 'studentName' as keyof MerendaEscolar
    },
    {
      header: 'Escola',
      accessor: 'school' as keyof MerendaEscolar
    },
    {
      header: 'Restrições Alimentares',
      accessor: (row: MerendaEscolar) => (
        <div className="flex flex-wrap gap-1">
          {row.restrictions.length > 0 ? (
            row.restrictions.map((restriction, idx) => (
              <Badge key={idx} variant="outline" className="text-xs">
                {restriction}
              </Badge>
            ))
          ) : (
            <span className="text-muted-foreground text-sm">Nenhuma</span>
          )}
        </div>
      )
    },
    {
      header: 'Status',
      accessor: (row: MerendaEscolar) => <StatusBadge status={row.status} />
    },
    {
      header: 'Origem',
      accessor: (row: MerendaEscolar) => <SourceIndicator source={row.source} />
    },
    {
      header: 'Data',
      accessor: (row: MerendaEscolar) => new Date(row.createdAt).toLocaleDateString('pt-BR')
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Merenda Escolar</h1>
          <p className="text-muted-foreground">Gerenciar cadastros de merenda escolar</p>
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
            <SelectItem value="active">Ativo</SelectItem>
            <SelectItem value="pending">Pendente</SelectItem>
            <SelectItem value="cancelled">Cancelado</SelectItem>
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
        emptyMessage="Nenhum cadastro de merenda encontrado"
      />
    </div>
  );
}
