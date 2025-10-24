"use client";

import { useState } from "react";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { HousingUnit, MaintenanceRecord, TransferRecord, CreateHousingUnitData, CreateMaintenanceData, CreateTransferData } from "@/types/housing";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { Home, Building2, MapPin, Wrench, Key, Calendar, Users, CheckCircle, AlertTriangle, Clock, TrendingUp, Plus, Search, Filter, Download, Eye, Edit, Trash2, Settings, FileText, CreditCard, Zap } from "lucide-react";

export default function UnidadesHabitacionaisPage() {
  useAdminAuth("admin");

  const [unidades, setUnidades] = useState<HousingUnit[]>([
    {
      id: 1,
      codigo: "UH-001-A123",
      endereco: "Rua das Flores, 123, Apto 101",
      tipo: "Apartamento",
      programa: "Casa Verde e Amarela",
      area_util: "48m²",
      quartos: 2,
      banheiros: 1,
      valor_avaliacao: "R$ 180.000,00",
      status: "Ocupada",
      data_entrega: "2023-08-15",
      morador_atual: "Maria Silva Santos",
      cpf_morador: "123.456.789-00",
      telefone_morador: "(11) 98765-4321",
      vencimento_contrato: "2025-08-15",
      ultima_manutencao: "2024-01-10",
      condicao: "Boa",
      observacoes: "Unidade em perfeito estado, sem pendências"
    },
    {
      id: 2,
      codigo: "UH-002-B456",
      endereco: "Av. Social, 456, Casa 15",
      tipo: "Casa",
      programa: "Habitação Social Municipal",
      area_util: "65m²",
      quartos: 3,
      banheiros: 2,
      valor_avaliacao: "R$ 220.000,00",
      status: "Disponível",
      data_entrega: "",
      morador_atual: "",
      cpf_morador: "",
      telefone_morador: "",
      vencimento_contrato: "",
      ultima_manutencao: "2023-12-05",
      condicao: "Excelente",
      observacoes: "Unidade nova, pronta para ocupação"
    },
    {
      id: 3,
      codigo: "UH-003-C789",
      endereco: "Rua da Esperança, 789, Apto 203",
      tipo: "Apartamento",
      programa: "Minha Casa Minha Vida",
      area_util: "52m²",
      quartos: 2,
      banheiros: 1,
      valor_avaliacao: "R$ 195.000,00",
      status: "Em Manutenção",
      data_entrega: "2022-11-20",
      morador_atual: "João Oliveira Costa",
      cpf_morador: "987.654.321-00",
      telefone_morador: "(11) 94567-8901",
      vencimento_contrato: "2024-11-20",
      ultima_manutencao: "2024-01-20",
      condicao: "Regular",
      observacoes: "Problemas hidráulicos em reparo"
    },
    {
      id: 4,
      codigo: "UH-004-D012",
      endereco: "Conjunto Habitacional Norte, Bloco 2, Apto 45",
      tipo: "Apartamento",
      programa: "Casa Verde e Amarela",
      area_util: "45m²",
      quartos: 2,
      banheiros: 1,
      valor_avaliacao: "R$ 175.000,00",
      status: "Inadimplente",
      data_entrega: "2023-03-10",
      morador_atual: "Ana Fernandes Lima",
      cpf_morador: "456.789.123-00",
      telefone_morador: "(11) 91234-5678",
      vencimento_contrato: "2025-03-10",
      ultima_manutencao: "2023-09-15",
      condicao: "Boa",
      observacoes: "Atraso de 3 parcelas de financiamento"
    }
  ]);

  const [manutencoes, setManutencoes] = useState<MaintenanceRecord[]>([
    {
      id: 1,
      unidade_codigo: "UH-003-C789",
      tipo: "Hidráulica",
      descricao: "Vazamento no banheiro principal",
      data_solicitacao: "2024-01-18",
      data_execucao: "2024-01-20",
      responsavel: "Empresa Hidro Fix",
      valor: "R$ 450,00",
      status: "Concluída",
      prioridade: "Alta"
    },
    {
      id: 2,
      unidade_codigo: "UH-001-A123",
      tipo: "Elétrica",
      descricao: "Troca de fiação do apartamento",
      data_solicitacao: "2024-01-05",
      data_execucao: "2024-01-10",
      responsavel: "Elétrica Silva",
      valor: "R$ 680,00",
      status: "Concluída",
      prioridade: "Média"
    },
    {
      id: 3,
      unidade_codigo: "UH-002-B456",
      tipo: "Pintura",
      descricao: "Pintura geral da casa",
      data_solicitacao: "2023-11-30",
      data_execucao: "2023-12-05",
      responsavel: "Pintura & Cia",
      valor: "R$ 1.200,00",
      status: "Concluída",
      prioridade: "Baixa"
    }
  ]);

  const [transferencias, setTransferencias] = useState<TransferRecord[]>([
    {
      id: 1,
      unidade_origem: "UH-005-E345",
      unidade_destino: "UH-006-F678",
      morador: "Carlos Santos Lima",
      motivo: "Mudança de região por trabalho",
      data_solicitacao: "2024-01-15",
      status: "Aprovada",
      data_efetivacao: "2024-02-01"
    },
    {
      id: 2,
      unidade_origem: "UH-007-G901",
      unidade_destino: "UH-008-H234",
      morador: "Lucia Fernandes Costa",
      motivo: "Necessidade de unidade maior",
      data_solicitacao: "2024-01-20",
      status: "Em Análise",
      data_efetivacao: null
    }
  ]);

  const [filtroStatus, setFiltroStatus] = useState("");
  const [filtroTipo, setFiltroTipo] = useState("");
  const [filtroPrograma, setFiltroPrograma] = useState("");
  const [busca, setBusca] = useState("");

  const [unidadeDialog, setUnidadeDialog] = useState(false);
  const [manutencaoDialog, setManutencaoDialog] = useState(false);
  const [transferenciaDialog, setTransferenciaDialog] = useState(false);

  const [novaUnidade, setNovaUnidade] = useState<CreateHousingUnitData>({
    codigo: "",
    endereco: "",
    tipo: "",
    programa: "",
    area_util: "",
    quartos: "",
    banheiros: "",
    valor_avaliacao: ""
  });

  const [novaManutencao, setNovaManutencao] = useState<CreateMaintenanceData>({
    unidade_codigo: "",
    tipo: "",
    descricao: "",
    responsavel: "",
    valor: "",
    prioridade: ""
  });

  const [novaTransferencia, setNovaTransferencia] = useState<CreateTransferData>({
    unidade_origem: "",
    unidade_destino: "",
    morador: "",
    motivo: ""
  });

  const dataOcupacao = [
    { mes: "Jul", ocupadas: 234, disponiveis: 18, manutencao: 12 },
    { mes: "Ago", ocupadas: 245, disponiveis: 15, manutencao: 8 },
    { mes: "Set", ocupadas: 251, disponiveis: 12, manutencao: 5 },
    { mes: "Out", ocupadas: 248, disponiveis: 14, manutencao: 9 },
    { mes: "Nov", ocupadas: 253, disponiveis: 11, manutencao: 6 },
    { mes: "Dez", ocupadas: 258, disponiveis: 8, manutencao: 4 }
  ];

  const dataStatusUnidades = [
    { status: "Ocupada", quantidade: 258, cor: "#10B981" },
    { status: "Disponível", quantidade: 8, cor: "#3B82F6" },
    { status: "Em Manutenção", quantidade: 4, cor: "#F59E0B" },
    { status: "Inadimplente", quantidade: 12, cor: "#EF4444" }
  ];

  const dataTipoUnidades = [
    { tipo: "Apartamento", quantidade: 189, area_media: 48 },
    { tipo: "Casa", quantidade: 93, area_media: 62 }
  ];

  const dataCondicoes = [
    { condicao: "Excelente", quantidade: 89, cor: "#10B981" },
    { condicao: "Boa", quantidade: 156, cor: "#3B82F6" },
    { condicao: "Regular", quantidade: 34, cor: "#F59E0B" },
    { condicao: "Ruim", quantidade: 3, cor: "#EF4444" }
  ];

  const unidadesFiltradas = unidades.filter(unidade => {
    const matchesBusca = unidade.codigo.toLowerCase().includes(busca.toLowerCase()) ||
                        unidade.endereco.toLowerCase().includes(busca.toLowerCase()) ||
                        (unidade.morador_atual && unidade.morador_atual.toLowerCase().includes(busca.toLowerCase()));
    const matchesStatus = filtroStatus === "" || unidade.status === filtroStatus;
    const matchesTipo = filtroTipo === "" || unidade.tipo === filtroTipo;
    const matchesPrograma = filtroPrograma === "" || unidade.programa === filtroPrograma;
    return matchesBusca && matchesStatus && matchesTipo && matchesPrograma;
  });

  const getStatusBadge = (status: string) => {
    const variants: { [key: string]: "default" | "secondary" | "destructive" | "outline" } = {
      "Ocupada": "default",
      "Disponível": "secondary",
      "Em Manutenção": "outline",
      "Inadimplente": "destructive",
      "Concluída": "default",
      "Em Andamento": "secondary",
      "Pendente": "outline",
      "Aprovada": "default",
      "Em Análise": "secondary",
      "Rejeitada": "destructive"
    };
    return <Badge variant={variants[status] || "outline"}>{status}</Badge>;
  };

  const getCondicaoBadge = (condicao: string) => {
    const variants: { [key: string]: "default" | "secondary" | "destructive" | "outline" } = {
      "Excelente": "default",
      "Boa": "secondary",
      "Regular": "outline",
      "Ruim": "destructive"
    };
    return <Badge variant={variants[condicao] || "outline"}>{condicao}</Badge>;
  };

  const getPrioridadeBadge = (prioridade: string) => {
    const variants: { [key: string]: "default" | "secondary" | "destructive" | "outline" } = {
      "Alta": "destructive",
      "Média": "secondary",
      "Baixa": "outline"
    };
    return <Badge variant={variants[prioridade] || "outline"}>{prioridade}</Badge>;
  };

  const handleCreateUnidade = () => {
    const unidade = {
      id: unidades.length + 1,
      ...novaUnidade,
      quartos: parseInt(novaUnidade.quartos),
      banheiros: parseInt(novaUnidade.banheiros),
      status: "Disponível",
      data_entrega: "",
      morador_atual: "",
      cpf_morador: "",
      telefone_morador: "",
      vencimento_contrato: "",
      ultima_manutencao: "",
      condicao: "Excelente",
      observacoes: "Unidade cadastrada"
    };
    setUnidades([...unidades, unidade]);
    setNovaUnidade({
      codigo: "",
      endereco: "",
      tipo: "",
      programa: "",
      area_util: "",
      quartos: "",
      banheiros: "",
      valor_avaliacao: ""
    });
    setUnidadeDialog(false);
  };

  const handleCreateManutencao = () => {
    const manutencao = {
      id: manutencoes.length + 1,
      ...novaManutencao,
      data_solicitacao: new Date().toISOString().split('T')[0],
      data_execucao: "",
      status: "Pendente"
    };
    setManutencoes([...manutencoes, manutencao]);
    setNovaManutencao({
      unidade_codigo: "",
      tipo: "",
      descricao: "",
      responsavel: "",
      valor: "",
      prioridade: ""
    });
    setManutencaoDialog(false);
  };

  const handleCreateTransferencia = () => {
    const transferencia = {
      id: transferencias.length + 1,
      ...novaTransferencia,
      data_solicitacao: new Date().toISOString().split('T')[0],
      status: "Em Análise",
      data_efetivacao: ""
    };
    setTransferencias([...transferencias, transferencia]);
    setNovaTransferencia({
      unidade_origem: "",
      unidade_destino: "",
      morador: "",
      motivo: ""
    });
    setTransferenciaDialog(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-green-100 rounded-lg">
            <Building2 className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Unidades Habitacionais</h1>
            <p className="text-gray-600">Controle do estoque habitacional municipal, disponibilidade e manutenção</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Unidades</CardTitle>
              <Home className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">282</div>
              <p className="text-xs text-muted-foreground">91% de ocupação</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Disponíveis</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-muted-foreground">Prontas para ocupação</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Em Manutenção</CardTitle>
              <Wrench className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4</div>
              <p className="text-xs text-muted-foreground">Reparos em andamento</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Inadimplência</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">4.3% do total</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Evolução da Ocupação</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={dataOcupacao}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mes" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="ocupadas" stroke="#10B981" name="Ocupadas" />
                  <Line type="monotone" dataKey="disponiveis" stroke="#3B82F6" name="Disponíveis" />
                  <Line type="monotone" dataKey="manutencao" stroke="#F59E0B" name="Manutenção" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Status das Unidades</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={dataStatusUnidades}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="quantidade"
                  >
                    {dataStatusUnidades.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.cor} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-2 gap-2 mt-4">
                {dataStatusUnidades.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.cor }}></div>
                    <span className="text-xs text-gray-600">{item.status}: {item.quantidade}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Tipos de Unidades</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={dataTipoUnidades}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="tipo" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="quantidade" fill="#8B5CF6" name="Quantidade" />
                  <Bar dataKey="area_media" fill="#10B981" name="Área Média (m²)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Condições das Unidades</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dataCondicoes.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: item.cor }}></div>
                      <span className="font-medium">{item.condicao}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-bold">{item.quantidade}</span>
                      <span className="text-sm text-gray-500 ml-1">unidades</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Tabs defaultValue="unidades" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="unidades">Unidades</TabsTrigger>
          <TabsTrigger value="manutencao">Manutenção</TabsTrigger>
          <TabsTrigger value="transferencias">Transferências</TabsTrigger>
          <TabsTrigger value="servicos">Serviços Gerados</TabsTrigger>
        </TabsList>

        <TabsContent value="unidades" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Gestão de Unidades</CardTitle>
                  <CardDescription>Controle do estoque habitacional municipal</CardDescription>
                </div>
                <Dialog open={unidadeDialog} onOpenChange={setUnidadeDialog}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Nova Unidade
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Cadastrar Nova Unidade</DialogTitle>
                      <DialogDescription>Registre uma nova unidade habitacional no sistema</DialogDescription>
                    </DialogHeader>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="codigo_unidade">Código da Unidade</Label>
                        <Input
                          id="codigo_unidade"
                          value={novaUnidade.codigo}
                          onChange={(e) => setNovaUnidade({ ...novaUnidade, codigo: e.target.value })}
                          placeholder="Ex: UH-001-A123"
                        />
                      </div>
                      <div>
                        <Label htmlFor="tipo_unidade">Tipo</Label>
                        <Select value={novaUnidade.tipo} onValueChange={(value) => setNovaUnidade({ ...novaUnidade, tipo: value })}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o tipo" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Apartamento">Apartamento</SelectItem>
                            <SelectItem value="Casa">Casa</SelectItem>
                            <SelectItem value="Sobrado">Sobrado</SelectItem>
                            <SelectItem value="Kitnet">Kitnet</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="col-span-2">
                        <Label htmlFor="endereco_unidade">Endereço Completo</Label>
                        <Input
                          id="endereco_unidade"
                          value={novaUnidade.endereco}
                          onChange={(e) => setNovaUnidade({ ...novaUnidade, endereco: e.target.value })}
                          placeholder="Endereço completo da unidade"
                        />
                      </div>
                      <div>
                        <Label htmlFor="programa_unidade">Programa</Label>
                        <Select value={novaUnidade.programa} onValueChange={(value) => setNovaUnidade({ ...novaUnidade, programa: value })}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o programa" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Casa Verde e Amarela">Casa Verde e Amarela</SelectItem>
                            <SelectItem value="Habitação Social Municipal">Habitação Social Municipal</SelectItem>
                            <SelectItem value="Minha Casa Minha Vida">Minha Casa Minha Vida</SelectItem>
                            <SelectItem value="Auxílio Habitacional">Auxílio Habitacional</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="area_util">Área Útil</Label>
                        <Input
                          id="area_util"
                          value={novaUnidade.area_util}
                          onChange={(e) => setNovaUnidade({ ...novaUnidade, area_util: e.target.value })}
                          placeholder="Ex: 48m²"
                        />
                      </div>
                      <div>
                        <Label htmlFor="quartos_unidade">Quartos</Label>
                        <Input
                          id="quartos_unidade"
                          type="number"
                          value={novaUnidade.quartos}
                          onChange={(e) => setNovaUnidade({ ...novaUnidade, quartos: e.target.value })}
                          placeholder="0"
                        />
                      </div>
                      <div>
                        <Label htmlFor="banheiros_unidade">Banheiros</Label>
                        <Input
                          id="banheiros_unidade"
                          type="number"
                          value={novaUnidade.banheiros}
                          onChange={(e) => setNovaUnidade({ ...novaUnidade, banheiros: e.target.value })}
                          placeholder="0"
                        />
                      </div>
                      <div className="col-span-2">
                        <Label htmlFor="valor_avaliacao">Valor de Avaliação</Label>
                        <Input
                          id="valor_avaliacao"
                          value={novaUnidade.valor_avaliacao}
                          onChange={(e) => setNovaUnidade({ ...novaUnidade, valor_avaliacao: e.target.value })}
                          placeholder="Ex: R$ 180.000,00"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setUnidadeDialog(false)}>Cancelar</Button>
                      <Button onClick={handleCreateUnidade}>Cadastrar Unidade</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 mb-4 flex-wrap">
                <div className="flex-1 min-w-64">
                  <Input
                    placeholder="Buscar unidades..."
                    value={busca}
                    onChange={(e) => setBusca(e.target.value)}
                    className="max-w-sm"
                  />
                </div>
                <Select value={filtroStatus} onValueChange={setFiltroStatus}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filtrar por status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todos os status</SelectItem>
                    <SelectItem value="Ocupada">Ocupada</SelectItem>
                    <SelectItem value="Disponível">Disponível</SelectItem>
                    <SelectItem value="Em Manutenção">Em Manutenção</SelectItem>
                    <SelectItem value="Inadimplente">Inadimplente</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filtroTipo} onValueChange={setFiltroTipo}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filtrar por tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todos os tipos</SelectItem>
                    <SelectItem value="Apartamento">Apartamento</SelectItem>
                    <SelectItem value="Casa">Casa</SelectItem>
                    <SelectItem value="Sobrado">Sobrado</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Exportar
                </Button>
              </div>

              <div className="grid gap-4">
                {unidadesFiltradas.map((unidade) => (
                  <Card key={unidade.id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-semibold">{unidade.codigo}</h3>
                          <p className="text-gray-600">{unidade.endereco}</p>
                          <div className="flex gap-2 mt-2">
                            <Badge variant="outline">{unidade.tipo}</Badge>
                            <Badge variant="secondary">{unidade.programa}</Badge>
                          </div>
                        </div>
                        <div className="text-right">
                          {getStatusBadge(unidade.status)}
                          <div className="text-sm text-gray-500 mt-1">{getCondicaoBadge(unidade.condicao)}</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <div className="text-sm text-gray-500">Área Útil</div>
                          <div className="font-medium">{unidade.area_util}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Cômodos</div>
                          <div className="font-medium">{unidade.quartos}Q {unidade.banheiros}B</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Valor Avaliação</div>
                          <div className="font-medium">{unidade.valor_avaliacao}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Última Manutenção</div>
                          <div className="font-medium">
                            {unidade.ultima_manutencao ?
                              new Date(unidade.ultima_manutencao).toLocaleDateString() :
                              "Nunca"
                            }
                          </div>
                        </div>
                      </div>

                      {unidade.morador_atual && (
                        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                          <div className="text-sm text-gray-500 mb-1">Morador Atual</div>
                          <div className="font-medium">{unidade.morador_atual}</div>
                          <div className="text-sm text-gray-600">
                            CPF: {unidade.cpf_morador} • Tel: {unidade.telefone_morador}
                          </div>
                          {unidade.vencimento_contrato && (
                            <div className="text-sm text-gray-600">
                              Contrato até: {new Date(unidade.vencimento_contrato).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                      )}

                      <div className="flex justify-between items-center">
                        <div className="text-sm text-gray-500">
                          {unidade.observacoes}
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4 mr-1" />
                            Detalhes
                          </Button>
                          <Button size="sm" variant="outline">
                            <Edit className="h-4 w-4 mr-1" />
                            Editar
                          </Button>
                          <Button size="sm" variant="outline">
                            <Wrench className="h-4 w-4 mr-1" />
                            Manutenção
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="manutencao" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Manutenções</CardTitle>
                  <CardDescription>Controle de manutenções preventivas e corretivas</CardDescription>
                </div>
                <Dialog open={manutencaoDialog} onOpenChange={setManutencaoDialog}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Nova Manutenção
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Solicitar Manutenção</DialogTitle>
                      <DialogDescription>Registre uma nova solicitação de manutenção</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="unidade_manutencao">Código da Unidade</Label>
                        <Select value={novaManutencao.unidade_codigo} onValueChange={(value) => setNovaManutencao({ ...novaManutencao, unidade_codigo: value })}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione a unidade" />
                          </SelectTrigger>
                          <SelectContent>
                            {unidades.map((unidade) => (
                              <SelectItem key={unidade.id} value={unidade.codigo}>{unidade.codigo} - {unidade.endereco}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="tipo_manutencao">Tipo de Manutenção</Label>
                        <Select value={novaManutencao.tipo} onValueChange={(value) => setNovaManutencao({ ...novaManutencao, tipo: value })}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o tipo" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Hidráulica">Hidráulica</SelectItem>
                            <SelectItem value="Elétrica">Elétrica</SelectItem>
                            <SelectItem value="Pintura">Pintura</SelectItem>
                            <SelectItem value="Estrutural">Estrutural</SelectItem>
                            <SelectItem value="Preventiva">Preventiva</SelectItem>
                            <SelectItem value="Limpeza">Limpeza</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="prioridade_manutencao">Prioridade</Label>
                        <Select value={novaManutencao.prioridade} onValueChange={(value) => setNovaManutencao({ ...novaManutencao, prioridade: value })}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione a prioridade" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Alta">Alta</SelectItem>
                            <SelectItem value="Média">Média</SelectItem>
                            <SelectItem value="Baixa">Baixa</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="responsavel_manutencao">Responsável</Label>
                        <Input
                          id="responsavel_manutencao"
                          value={novaManutencao.responsavel}
                          onChange={(e) => setNovaManutencao({ ...novaManutencao, responsavel: e.target.value })}
                          placeholder="Nome da empresa ou responsável"
                        />
                      </div>
                      <div>
                        <Label htmlFor="valor_manutencao">Valor Estimado</Label>
                        <Input
                          id="valor_manutencao"
                          value={novaManutencao.valor}
                          onChange={(e) => setNovaManutencao({ ...novaManutencao, valor: e.target.value })}
                          placeholder="R$ 0,00"
                        />
                      </div>
                      <div>
                        <Label htmlFor="descricao_manutencao">Descrição</Label>
                        <Textarea
                          id="descricao_manutencao"
                          value={novaManutencao.descricao}
                          onChange={(e) => setNovaManutencao({ ...novaManutencao, descricao: e.target.value })}
                          placeholder="Descrição detalhada da manutenção necessária"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setManutencaoDialog(false)}>Cancelar</Button>
                      <Button onClick={handleCreateManutencao}>Solicitar Manutenção</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg overflow-hidden">
                <div className="grid grid-cols-8 gap-4 p-4 bg-gray-50 font-medium text-sm">
                  <div>Unidade</div>
                  <div>Tipo</div>
                  <div>Descrição</div>
                  <div>Responsável</div>
                  <div>Valor</div>
                  <div>Prioridade</div>
                  <div>Status</div>
                  <div>Ações</div>
                </div>
                <div className="divide-y">
                  {manutencoes.map((manutencao) => (
                    <div key={manutencao.id} className="grid grid-cols-8 gap-4 p-4 items-center">
                      <div className="font-mono text-sm">{manutencao.unidade_codigo}</div>
                      <div>{manutencao.tipo}</div>
                      <div className="truncate">{manutencao.descricao}</div>
                      <div>{manutencao.responsavel}</div>
                      <div>{manutencao.valor}</div>
                      <div>{getPrioridadeBadge(manutencao.prioridade)}</div>
                      <div>{getStatusBadge(manutencao.status)}</div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transferencias" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Transferências de Imóvel</CardTitle>
                  <CardDescription>Gestão de transferências entre unidades habitacionais</CardDescription>
                </div>
                <Dialog open={transferenciaDialog} onOpenChange={setTransferenciaDialog}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Nova Transferência
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Solicitar Transferência</DialogTitle>
                      <DialogDescription>Registre uma solicitação de transferência de unidade</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="unidade_origem">Unidade de Origem</Label>
                        <Select value={novaTransferencia.unidade_origem} onValueChange={(value) => setNovaTransferencia({ ...novaTransferencia, unidade_origem: value })}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione a unidade atual" />
                          </SelectTrigger>
                          <SelectContent>
                            {unidades.filter(u => u.status === "Ocupada").map((unidade) => (
                              <SelectItem key={unidade.id} value={unidade.codigo}>{unidade.codigo} - {unidade.endereco}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="unidade_destino">Unidade de Destino</Label>
                        <Select value={novaTransferencia.unidade_destino} onValueChange={(value) => setNovaTransferencia({ ...novaTransferencia, unidade_destino: value })}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione a nova unidade" />
                          </SelectTrigger>
                          <SelectContent>
                            {unidades.filter(u => u.status === "Disponível").map((unidade) => (
                              <SelectItem key={unidade.id} value={unidade.codigo}>{unidade.codigo} - {unidade.endereco}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="morador_transferencia">Nome do Morador</Label>
                        <Input
                          id="morador_transferencia"
                          value={novaTransferencia.morador}
                          onChange={(e) => setNovaTransferencia({ ...novaTransferencia, morador: e.target.value })}
                          placeholder="Nome completo do morador"
                        />
                      </div>
                      <div>
                        <Label htmlFor="motivo_transferencia">Motivo da Transferência</Label>
                        <Textarea
                          id="motivo_transferencia"
                          value={novaTransferencia.motivo}
                          onChange={(e) => setNovaTransferencia({ ...novaTransferencia, motivo: e.target.value })}
                          placeholder="Justificativa para a transferência"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setTransferenciaDialog(false)}>Cancelar</Button>
                      <Button onClick={handleCreateTransferencia}>Solicitar Transferência</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {transferencias.map((transferencia) => (
                  <Card key={transferencia.id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-semibold">{transferencia.morador}</h3>
                          <p className="text-gray-600">{transferencia.motivo}</p>
                        </div>
                        {getStatusBadge(transferencia.status)}
                      </div>
                      <div className="grid grid-cols-2 gap-4 mb-3">
                        <div>
                          <div className="text-sm text-gray-500">Origem</div>
                          <div className="font-medium">{transferencia.unidade_origem}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Destino</div>
                          <div className="font-medium">{transferencia.unidade_destino}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Solicitação</div>
                          <div className="font-medium">{new Date(transferencia.data_solicitacao).toLocaleDateString()}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Efetivação</div>
                          <div className="font-medium">
                            {transferencia.data_efetivacao ?
                              new Date(transferencia.data_efetivacao).toLocaleDateString() :
                              "Pendente"
                            }
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4 mr-1" />
                          Detalhes
                        </Button>
                        <Button size="sm" variant="outline">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Aprovar
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="servicos" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Serviços Gerados Automaticamente</CardTitle>
              <CardDescription>
                Esta página gera automaticamente os seguintes serviços para o catálogo público:
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="border rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Search className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Consulta de Disponibilidade</h3>
                      <p className="text-sm text-gray-600">Verificação de unidades disponíveis para locação</p>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500 mb-2">Campos do formulário público:</div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>• Tipo de unidade preferida</div>
                    <div>• Região de interesse</div>
                    <div>• Número de quartos desejado</div>
                    <div>• Faixa de renda familiar</div>
                    <div>• Dados de contato</div>
                    <div>• Programa de interesse</div>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Wrench className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Manutenção de Unidade</h3>
                      <p className="text-sm text-gray-600">Solicitação de reparos e manutenções</p>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500 mb-2">Campos do formulário público:</div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>• Código da unidade</div>
                    <div>• Tipo de problema</div>
                    <div>• Descrição detalhada</div>
                    <div>• Urgência do reparo</div>
                    <div>• Dados do morador</div>
                    <div>• Fotos do problema</div>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Key className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Transferência de Imóvel</h3>
                      <p className="text-sm text-gray-600">Solicitação de mudança entre unidades</p>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500 mb-2">Campos do formulário público:</div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>• Unidade atual</div>
                    <div>• Motivo da transferência</div>
                    <div>• Preferência de nova unidade</div>
                    <div>• Justificativa detalhada</div>
                    <div>• Documentos comprobatórios</div>
                    <div>• Contatos para retorno</div>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <FileText className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Regularização</h3>
                      <p className="text-sm text-gray-600">Regularização de situação habitacional</p>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500 mb-2">Campos do formulário público:</div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>• Dados do imóvel</div>
                    <div>• Situação atual</div>
                    <div>• Documentos existentes</div>
                    <div>• Histórico de ocupação</div>
                    <div>• Comprovantes de pagamento</div>
                    <div>• Termo de responsabilidade</div>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2 text-blue-800 font-medium mb-2">
                  <Settings className="h-5 w-5" />
                  Integração com Catálogo Público
                </div>
                <p className="text-blue-700 text-sm">
                  Todos os serviços desta página são automaticamente disponibilizados no catálogo público da cidade,
                  permitindo que cidadãos consultem unidades disponíveis, solicitem manutenções, transferências
                  e regularizações de forma digital e transparente.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}