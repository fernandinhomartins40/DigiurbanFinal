'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Heart, Search, Filter, Package } from 'lucide-react';

export default function BeneficiosServicosPage() {
  const [statusFilter, setStatusFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const { data: benefits, isLoading } = useQuery({
    queryKey: ['benefits-servicos', statusFilter, sourceFilter],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (sourceFilter !== 'all') params.append('source', sourceFilter);

      const res = await fetch(`http://localhost:3001/api/secretarias/social-assistance/benefits?${params}`, {
        credentials: 'include'
      });
      if (!res.ok) return [];
      return res.json();
    }
  });

  const filteredBenefits = benefits?.filter((benefit: any) =>
    searchTerm === '' ||
    benefit.citizenName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    benefit.protocol?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: any; label: string }> = {
      pending: { variant: 'warning', label: 'Pendente' },
      approved: { variant: 'success', label: 'Aprovado' },
      delivered: { variant: 'secondary', label: 'Entregue' },
      cancelled: { variant: 'destructive', label: 'Cancelado' }
    };
    const config = variants[status] || { variant: 'default', label: status };
    return <Badge variant={config.variant as any}>{config.label}</Badge>;
  };

  const getBenefitTypeBadge = (type: string) => {
    const types: Record<string, string> = {
      cesta_basica: 'Cesta Básica',
      auxilio_funeral: 'Auxílio Funeral',
      auxilio_natalidade: 'Auxílio Natalidade',
      gas: 'Vale Gás'
    };
    return <Badge variant="outline">{types[type] || type}</Badge>;
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3">
        <Heart className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-2xl font-bold">Benefícios Sociais - Portal do Cidadão</h1>
          <p className="text-sm text-muted-foreground">
            Gerencie solicitações de benefícios eventuais vindas do portal
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
                  placeholder="Nome do cidadão ou protocolo..."
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
                  <SelectItem value="approved">Aprovados</SelectItem>
                  <SelectItem value="delivered">Entregues</SelectItem>
                  <SelectItem value="cancelled">Cancelados</SelectItem>
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
            <div className="text-2xl font-bold">{filteredBenefits.length}</div>
            <p className="text-xs text-muted-foreground">Total</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-yellow-600">
              {filteredBenefits.filter((b: any) => b.status === 'pending').length}
            </div>
            <p className="text-xs text-muted-foreground">Pendentes</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">
              {filteredBenefits.filter((b: any) => b.status === 'approved').length}
            </div>
            <p className="text-xs text-muted-foreground">Aprovados</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-blue-600">
              {filteredBenefits.filter((b: any) => b.source === 'service').length}
            </div>
            <p className="text-xs text-muted-foreground">Do Portal</p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        {isLoading ? (
          <Card><CardContent className="pt-6"><p className="text-center text-muted-foreground">Carregando...</p></CardContent></Card>
        ) : filteredBenefits.length === 0 ? (
          <Card><CardContent className="pt-6"><p className="text-center text-muted-foreground">Nenhum benefício encontrado</p></CardContent></Card>
        ) : (
          filteredBenefits.map((benefit: any) => (
            <Card key={benefit.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{benefit.citizenName}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      CPF: {benefit.citizenCpf}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {getBenefitTypeBadge(benefit.benefitType)}
                    {getStatusBadge(benefit.status)}
                    {benefit.source === 'service' && (
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        Portal
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  {benefit.familyIncome && (
                    <div><span className="font-medium">Renda Familiar:</span> R$ {benefit.familyIncome.toFixed(2)}</div>
                  )}
                  {benefit.familySize && (
                    <div><span className="font-medium">Membros da Família:</span> {benefit.familySize}</div>
                  )}
                  <div>
                    <span className="font-medium">Justificativa:</span> {benefit.justification}
                  </div>
                  {benefit.protocol && (
                    <div>
                      <span className="font-medium">Protocolo:</span>{' '}
                      <code className="bg-muted px-2 py-1 rounded text-xs">{benefit.protocol}</code>
                    </div>
                  )}
                  <div className="flex gap-2 pt-2">
                    <Button size="sm" variant="outline">Ver Detalhes</Button>
                    {benefit.status === 'pending' && (
                      <>
                        <Button size="sm" variant="default" className="gap-2">
                          <Package className="h-4 w-4" />
                          Aprovar
                        </Button>
                        <Button size="sm" variant="destructive">Rejeitar</Button>
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
