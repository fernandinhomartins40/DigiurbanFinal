"use client";

import { useState } from "react";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
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
import { Building, CreditCard, Users, Target, Calendar, DollarSign, MapPin, FileText, TrendingUp, Plus, Search, Filter, Download, Eye, Edit, CheckCircle, AlertTriangle, Settings, Zap } from "lucide-react";

export default function ProgramasHabitacionaisPage() {
  useAdminAuth("admin");

  const [programas, setProgramas] = useState([
    {
      id: 1,
      nome: "Casa Verde e Amarela",
      tipo: "Federal",
      descricao: "Programa federal de habitação para famílias de baixa renda",
      faixa_renda: "Até R$ 4.000,00",
      valor_subsidio: "R$ 47.500,00",
      meta_unidades: 500,
      unidades_entregues: 234,
      investimento_total: "R$ 23.750.000,00",
      investimento_realizado: "R$ 11.112.000,00",
      data_inicio: "2023-01-15",
      data_fim: "2025-12-31",
      status: "Ativo",
      inscritos: 1247,
      beneficiarios: 936,
      parceiros: ["CEF", "Governo Federal", "Construtora Alpha"],
      coordenador: "Maria Santos"
    },
    {
      id: 2,
      nome: "Habitação Social Municipal",
      tipo: "Municipal",
      descricao: "Programa municipal de habitação social para famílias em vulnerabilidade",
      faixa_renda: "Até R$ 2.000,00",
      valor_subsidio: "R$ 35.000,00",
      meta_unidades: 200,
      unidades_entregues: 87,
      investimento_total: "R$ 7.000.000,00",
      investimento_realizado: "R$ 3.045.000,00",
      data_inicio: "2023-06-01",
      data_fim: "2025-06-30",
      status: "Ativo",
      inscritos: 456,
      beneficiarios: 174,
      parceiros: ["Prefeitura", "Construtora Beta"],
      coordenador: "João Silva"
    },
    {
      id: 3,
      nome: "Minha Casa Minha Vida",
      tipo: "Federal",
      descricao: "Programa federal voltado para a classe média baixa",
      faixa_renda: "R$ 2.000,00 a R$ 7.000,00",
      valor_subsidio: "R$ 29.000,00",
      meta_unidades: 300,
      unidades_entregues: 189,
      investimento_total: "R$ 8.700.000,00",
      investimento_realizado: "R$ 5.481.000,00",
      data_inicio: "2022-08-15",
      data_fim: "2024-12-31",
      status: "Finalizando",
      inscritos: 789,
      beneficiarios: 567,
      parceiros: ["CEF", "Governo Federal", "Construtora Gamma"],
      coordenador: "Ana Costa"
    },
    {
      id: 4,
      nome: "Auxílio Habitacional Temporário",
      tipo: "Municipal",
      descricao: "Auxílio mensal para famílias em situação de emergência habitacional",
      faixa_renda: "Até R$ 1.500,00",
      valor_subsidio: "R$ 400,00/mês",
      meta_unidades: 100,
      unidades_entregues: 67,
      investimento_total: "R$ 480.000,00/ano",
      investimento_realizado: "R$ 321.600,00",
      data_inicio: "2024-01-01",
      data_fim: "2024-12-31",
      status: "Ativo",
      inscritos: 234,
      beneficiarios: 89,
      parceiros: ["Prefeitura", "CRAS"],
      coordenador: "Carlos Lima"
    }
  ]);

  const [beneficiarios, setBeneficiarios] = useState([
    {
      id: 1,
      nome: "Silva Santos Family",
      programa: "Casa Verde e Amarela",
      cpf_titular: "123.456.789-00",
      valor_beneficio: "R$ 47.500,00",
      data_concessao: "2023-08-15",
      status_pagamento: "Em Dia",
      fase_atual: "Construção",
      progresso: 75,
      previsao_entrega: "2024-06-30",
      endereco_unidade: "Rua das Flores, 123",
      observacoes: "Obra dentro do cronograma"
    },
    {
      id: 2,
      nome: "Oliveira Costa Family",
      programa: "Habitação Social Municipal",
      cpf_titular: "987.654.321-00",
      valor_beneficio: "R$ 35.000,00",
      data_concessao: "2023-11-20",
      status_pagamento: "Em Dia",
      fase_atual: "Finalização",
      progresso: 95,
      previsao_entrega: "2024-02-15",
      endereco_unidade: "Av. Social, 456",
      observacoes: "Pronto para entrega"
    }
  ]);

  const [filtroTipo, setFiltroTipo] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("");
  const [busca, setBusca] = useState("");

  const [programaDialog, setProgramaDialog] = useState(false);
  const [beneficiarioDialog, setBeneficiarioDialog] = useState(false);

  const [novoPrograma, setNovoPrograma] = useState({
    nome: "",
    tipo: "",
    descricao: "",
    faixa_renda: "",
    valor_subsidio: "",
    meta_unidades: "",
    investimento_total: "",
    data_inicio: "",
    data_fim: "",
    coordenador: ""
  });

  const [novoBeneficiario, setNovoBeneficiario] = useState({
    nome: "",
    programa: "",
    cpf_titular: "",
    valor_beneficio: "",
    endereco_unidade: "",
    previsao_entrega: "",
    observacoes: ""
  });

  const dataInvestimentos = [
    { mes: "Jul", federal: 2100000, municipal: 450000, total: 2550000 },
    { mes: "Ago", federal: 1850000, municipal: 680000, total: 2530000 },
    { mes: "Set", federal: 2340000, municipal: 520000, total: 2860000 },
    { mes: "Out", federal: 1950000, municipal: 750000, total: 2700000 },
    { mes: "Nov", federal: 2180000, municipal: 630000, total: 2810000 },
    { mes: "Dez", federal: 2450000, municipal: 890000, total: 3340000 }
  ];

  const dataEntregas = [
    { programa: "Casa Verde e Amarela", entregues: 234, meta: 500 },
    { programa: "Habitação Social", entregues: 87, meta: 200 },
    { programa: "Minha Casa Minha Vida", entregues: 189, meta: 300 },
    { programa: "Auxílio Habitacional", entregues: 67, meta: 100 }
  ];

  const dataDistribuicaoTipo = [
    { tipo: "Federal", quantidade: 2, investimento: 32450000, cor: "#3B82F6" },
    { tipo: "Municipal", quantidade: 2, investimento: 7480000, cor: "#10B981" }
  ];

  const programasFiltrados = programas.filter(programa => {
    const matchesBusca = programa.nome.toLowerCase().includes(busca.toLowerCase()) ||
                        programa.descricao.toLowerCase().includes(busca.toLowerCase());
    const matchesTipo = filtroTipo === "" || programa.tipo === filtroTipo;
    const matchesStatus = filtroStatus === "" || programa.status === filtroStatus;
    return matchesBusca && matchesTipo && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const variants: { [key: string]: "default" | "secondary" | "destructive" | "outline" } = {
      "Ativo": "default",
      "Finalizando": "secondary",
      "Suspenso": "destructive",
      "Planejamento": "outline",
      "Em Dia": "default",
      "Atrasado": "destructive",
      "Construção": "secondary",
      "Finalização": "outline"
    };
    return <Badge variant={variants[status] || "outline"}>{status}</Badge>;
  };

  const getTipoBadge = (tipo: string) => {
    const variants: { [key: string]: "default" | "secondary" | "destructive" | "outline" } = {
      "Federal": "default",
      "Municipal": "secondary",
      "Estadual": "outline"
    };
    return <Badge variant={variants[tipo] || "outline"}>{tipo}</Badge>;
  };

  const getProgressColor = (progresso: number) => {
    if (progresso >= 80) return "bg-green-500";
    if (progresso >= 50) return "bg-blue-500";
    if (progresso >= 30) return "bg-yellow-500";
    return "bg-red-500";
  };

  const handleCreatePrograma = () => {
    const programa = {
      id: programas.length + 1,
      ...novoPrograma,
      meta_unidades: parseInt(novoPrograma.meta_unidades),
      unidades_entregues: 0,
      investimento_realizado: "R$ 0,00",
      status: "Planejamento",
      inscritos: 0,
      beneficiarios: 0,
      parceiros: []
    };
    setProgramas([...programas, programa]);
    setNovoPrograma({
      nome: "",
      tipo: "",
      descricao: "",
      faixa_renda: "",
      valor_subsidio: "",
      meta_unidades: "",
      investimento_total: "",
      data_inicio: "",
      data_fim: "",
      coordenador: ""
    });
    setProgramaDialog(false);
  };

  const handleCreateBeneficiario = () => {
    const beneficiario = {
      id: beneficiarios.length + 1,
      ...novoBeneficiario,
      data_concessao: new Date().toISOString().split('T')[0],
      status_pagamento: "Em Dia",
      fase_atual: "Início",
      progresso: 0
    };
    setBeneficiarios([...beneficiarios, beneficiario]);
    setNovoBeneficiario({
      nome: "",
      programa: "",
      cpf_titular: "",
      valor_beneficio: "",
      endereco_unidade: "",
      previsao_entrega: "",
      observacoes: ""
    });
    setBeneficiarioDialog(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Building className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Programas Habitacionais</h1>
            <p className="text-gray-600">Gestão de programas como Minha Casa Minha Vida, habitação social e financiamentos</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Programas Ativos</CardTitle>
              <Building className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4</div>
              <p className="text-xs text-muted-foreground">3 federais, 1 municipal</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Unidades Entregues</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">577</div>
              <p className="text-xs text-muted-foreground">52% da meta total</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Investimento Total</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">R$ 39,9M</div>
              <p className="text-xs text-muted-foreground">R$ 19,9M realizados</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Famílias Beneficiadas</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1.766</div>
              <p className="text-xs text-muted-foreground">Entre todos os programas</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Evolução de Investimentos</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={dataInvestimentos}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mes" />
                  <YAxis tickFormatter={(value) => `R$ ${(value / 1000000).toFixed(1)}M`} />
                  <Tooltip formatter={(value) => [`R$ ${(value as number).toLocaleString()}`, ""]} />
                  <Bar dataKey="federal" stackId="a" fill="#3B82F6" name="Federal" />
                  <Bar dataKey="municipal" stackId="a" fill="#10B981" name="Municipal" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Progresso das Entregas</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={dataEntregas} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="programa" type="category" width={100} />
                  <Tooltip />
                  <Bar dataKey="entregues" fill="#10B981" name="Entregues" />
                  <Bar dataKey="meta" fill="#E5E7EB" name="Meta" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Distribuição por Esfera</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={dataDistribuicaoTipo}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="investimento"
                  >
                    {dataDistribuicaoTipo.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.cor} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`R$ ${(value as number).toLocaleString()}`, "Investimento"]} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-4">
                {dataDistribuicaoTipo.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: item.cor }}></div>
                      <div>
                        <div className="font-medium">Programas {item.tipo}s</div>
                        <div className="text-sm text-gray-600">{item.quantidade} programas</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">R$ {(item.investimento / 1000000).toFixed(1)}M</div>
                      <div className="text-sm text-gray-600">Investimento</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="programas" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="programas">Programas</TabsTrigger>
          <TabsTrigger value="beneficiarios">Beneficiários</TabsTrigger>
          <TabsTrigger value="financiamentos">Financiamentos</TabsTrigger>
          <TabsTrigger value="servicos">Serviços Gerados</TabsTrigger>
        </TabsList>

        <TabsContent value="programas" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Gestão de Programas</CardTitle>
                  <CardDescription>Controle dos programas habitacionais federais, estaduais e municipais</CardDescription>
                </div>
                <Dialog open={programaDialog} onOpenChange={setProgramaDialog}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Novo Programa
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Cadastrar Novo Programa</DialogTitle>
                      <DialogDescription>Registre um novo programa habitacional</DialogDescription>
                    </DialogHeader>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-2">
                        <Label htmlFor="nome_programa">Nome do Programa</Label>
                        <Input
                          id="nome_programa"
                          value={novoPrograma.nome}
                          onChange={(e) => setNovoPrograma({ ...novoPrograma, nome: e.target.value })}
                          placeholder="Ex: Casa Verde e Amarela Municipal"
                        />
                      </div>
                      <div>
                        <Label htmlFor="tipo_programa">Tipo/Esfera</Label>
                        <Select value={novoPrograma.tipo} onValueChange={(value) => setNovoPrograma({ ...novoPrograma, tipo: value })}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o tipo" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Federal">Federal</SelectItem>
                            <SelectItem value="Estadual">Estadual</SelectItem>
                            <SelectItem value="Municipal">Municipal</SelectItem>
                            <SelectItem value="Parceria">Parceria</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="coordenador_programa">Coordenador</Label>
                        <Input
                          id="coordenador_programa"
                          value={novoPrograma.coordenador}
                          onChange={(e) => setNovoPrograma({ ...novoPrograma, coordenador: e.target.value })}
                          placeholder="Nome do coordenador responsável"
                        />
                      </div>
                      <div>
                        <Label htmlFor="faixa_renda">Faixa de Renda</Label>
                        <Input
                          id="faixa_renda"
                          value={novoPrograma.faixa_renda}
                          onChange={(e) => setNovoPrograma({ ...novoPrograma, faixa_renda: e.target.value })}
                          placeholder="Ex: Até R$ 4.000,00"
                        />
                      </div>
                      <div>
                        <Label htmlFor="valor_subsidio">Valor do Subsídio</Label>
                        <Input
                          id="valor_subsidio"
                          value={novoPrograma.valor_subsidio}
                          onChange={(e) => setNovoPrograma({ ...novoPrograma, valor_subsidio: e.target.value })}
                          placeholder="Ex: R$ 47.500,00"
                        />
                      </div>
                      <div>
                        <Label htmlFor="meta_unidades">Meta de Unidades</Label>
                        <Input
                          id="meta_unidades"
                          type="number"
                          value={novoPrograma.meta_unidades}
                          onChange={(e) => setNovoPrograma({ ...novoPrograma, meta_unidades: e.target.value })}
                          placeholder="0"
                        />
                      </div>
                      <div>
                        <Label htmlFor="investimento_total">Investimento Total</Label>
                        <Input
                          id="investimento_total"
                          value={novoPrograma.investimento_total}
                          onChange={(e) => setNovoPrograma({ ...novoPrograma, investimento_total: e.target.value })}
                          placeholder="Ex: R$ 23.750.000,00"
                        />
                      </div>
                      <div>
                        <Label htmlFor="data_inicio">Data de Início</Label>
                        <Input
                          id="data_inicio"
                          type="date"
                          value={novoPrograma.data_inicio}
                          onChange={(e) => setNovoPrograma({ ...novoPrograma, data_inicio: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="data_fim">Data de Término</Label>
                        <Input
                          id="data_fim"
                          type="date"
                          value={novoPrograma.data_fim}
                          onChange={(e) => setNovoPrograma({ ...novoPrograma, data_fim: e.target.value })}
                        />
                      </div>
                      <div className="col-span-2">
                        <Label htmlFor="descricao_programa">Descrição</Label>
                        <Textarea
                          id="descricao_programa"
                          value={novoPrograma.descricao}
                          onChange={(e) => setNovoPrograma({ ...novoPrograma, descricao: e.target.value })}
                          placeholder="Descrição detalhada do programa"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setProgramaDialog(false)}>Cancelar</Button>
                      <Button onClick={handleCreatePrograma}>Cadastrar Programa</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 mb-4 flex-wrap">
                <div className="flex-1 min-w-64">
                  <Input
                    placeholder="Buscar programas..."
                    value={busca}
                    onChange={(e) => setBusca(e.target.value)}
                    className="max-w-sm"
                  />
                </div>
                <Select value={filtroTipo} onValueChange={setFiltroTipo}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filtrar por tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todos os tipos</SelectItem>
                    <SelectItem value="Federal">Federal</SelectItem>
                    <SelectItem value="Municipal">Municipal</SelectItem>
                    <SelectItem value="Estadual">Estadual</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filtroStatus} onValueChange={setFiltroStatus}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filtrar por status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todos os status</SelectItem>
                    <SelectItem value="Ativo">Ativo</SelectItem>
                    <SelectItem value="Finalizando">Finalizando</SelectItem>
                    <SelectItem value="Suspenso">Suspenso</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Exportar
                </Button>
              </div>

              <div className="grid gap-4">
                {programasFiltrados.map((programa) => (
                  <Card key={programa.id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-semibold">{programa.nome}</h3>
                          <p className="text-gray-600">{programa.descricao}</p>
                          <div className="flex gap-2 mt-2">
                            {getTipoBadge(programa.tipo)}
                            {getStatusBadge(programa.status)}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-green-600">{programa.valor_subsidio}</div>
                          <div className="text-sm text-gray-500">Subsídio por família</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <div className="text-sm text-gray-500">Faixa de Renda</div>
                          <div className="font-medium">{programa.faixa_renda}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Unidades</div>
                          <div className="font-medium">{programa.unidades_entregues}/{programa.meta_unidades}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Inscritos</div>
                          <div className="font-medium">{programa.inscritos}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Coordenador</div>
                          <div className="font-medium">{programa.coordenador}</div>
                        </div>
                      </div>

                      <div className="mb-4">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Progresso das Entregas</span>
                          <span>{Math.round((programa.unidades_entregues / programa.meta_unidades) * 100)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${getProgressColor((programa.unidades_entregues / programa.meta_unidades) * 100)}`}
                            style={{ width: `${(programa.unidades_entregues / programa.meta_unidades) * 100}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className="mb-4">
                        <div className="text-sm text-gray-500 mb-2">Parceiros</div>
                        <div className="flex flex-wrap gap-2">
                          {programa.parceiros.map((parceiro, index) => (
                            <Badge key={index} variant="outline">{parceiro}</Badge>
                          ))}
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <div className="text-sm text-gray-500">
                          <div>Período: {new Date(programa.data_inicio).toLocaleDateString()} - {new Date(programa.data_fim).toLocaleDateString()}</div>
                          <div>Investimento: {programa.investimento_realizado} / {programa.investimento_total}</div>
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
                            <FileText className="h-4 w-4 mr-1" />
                            Relatório
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

        <TabsContent value="beneficiarios" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Beneficiários dos Programas</CardTitle>
                  <CardDescription>Acompanhamento de famílias beneficiadas pelos programas habitacionais</CardDescription>
                </div>
                <Dialog open={beneficiarioDialog} onOpenChange={setBeneficiarioDialog}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Novo Beneficiário
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Cadastrar Beneficiário</DialogTitle>
                      <DialogDescription>Registre uma nova família beneficiária</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="nome_beneficiario">Nome da Família</Label>
                        <Input
                          id="nome_beneficiario"
                          value={novoBeneficiario.nome}
                          onChange={(e) => setNovoBeneficiario({ ...novoBeneficiario, nome: e.target.value })}
                          placeholder="Ex: Silva Santos Family"
                        />
                      </div>
                      <div>
                        <Label htmlFor="programa_beneficiario">Programa</Label>
                        <Select value={novoBeneficiario.programa} onValueChange={(value) => setNovoBeneficiario({ ...novoBeneficiario, programa: value })}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o programa" />
                          </SelectTrigger>
                          <SelectContent>
                            {programas.map((programa) => (
                              <SelectItem key={programa.id} value={programa.nome}>{programa.nome}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="cpf_titular">CPF do Titular</Label>
                        <Input
                          id="cpf_titular"
                          value={novoBeneficiario.cpf_titular}
                          onChange={(e) => setNovoBeneficiario({ ...novoBeneficiario, cpf_titular: e.target.value })}
                          placeholder="000.000.000-00"
                        />
                      </div>
                      <div>
                        <Label htmlFor="valor_beneficio">Valor do Benefício</Label>
                        <Input
                          id="valor_beneficio"
                          value={novoBeneficiario.valor_beneficio}
                          onChange={(e) => setNovoBeneficiario({ ...novoBeneficiario, valor_beneficio: e.target.value })}
                          placeholder="R$ 0,00"
                        />
                      </div>
                      <div>
                        <Label htmlFor="endereco_unidade">Endereço da Unidade</Label>
                        <Input
                          id="endereco_unidade"
                          value={novoBeneficiario.endereco_unidade}
                          onChange={(e) => setNovoBeneficiario({ ...novoBeneficiario, endereco_unidade: e.target.value })}
                          placeholder="Endereço da habitação"
                        />
                      </div>
                      <div>
                        <Label htmlFor="previsao_entrega">Previsão de Entrega</Label>
                        <Input
                          id="previsao_entrega"
                          type="date"
                          value={novoBeneficiario.previsao_entrega}
                          onChange={(e) => setNovoBeneficiario({ ...novoBeneficiario, previsao_entrega: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="observacoes_beneficiario">Observações</Label>
                        <Textarea
                          id="observacoes_beneficiario"
                          value={novoBeneficiario.observacoes}
                          onChange={(e) => setNovoBeneficiario({ ...novoBeneficiario, observacoes: e.target.value })}
                          placeholder="Observações sobre o beneficiário"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setBeneficiarioDialog(false)}>Cancelar</Button>
                      <Button onClick={handleCreateBeneficiario}>Cadastrar Beneficiário</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {beneficiarios.map((beneficiario) => (
                  <Card key={beneficiario.id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-semibold text-lg">{beneficiario.nome}</h3>
                          <p className="text-gray-600">{beneficiario.programa}</p>
                          <p className="text-sm text-gray-500">CPF: {beneficiario.cpf_titular}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-green-600">{beneficiario.valor_beneficio}</div>
                          <div className="text-sm text-gray-500">Valor do benefício</div>
                          {getStatusBadge(beneficiario.status_pagamento)}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <div className="text-sm text-gray-500">Concessão</div>
                          <div className="font-medium">{new Date(beneficiario.data_concessao).toLocaleDateString()}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Fase Atual</div>
                          <div className="font-medium">{getStatusBadge(beneficiario.fase_atual)}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Previsão Entrega</div>
                          <div className="font-medium">{new Date(beneficiario.previsao_entrega).toLocaleDateString()}</div>
                        </div>
                      </div>

                      <div className="mb-4">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Progresso da Obra</span>
                          <span>{beneficiario.progresso}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${getProgressColor(beneficiario.progresso)}`}
                            style={{ width: `${beneficiario.progresso}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className="mb-4">
                        <div className="text-sm text-gray-500">Endereço da Unidade</div>
                        <div className="font-medium">{beneficiario.endereco_unidade}</div>
                      </div>

                      <div className="flex justify-between items-center">
                        <div className="text-sm text-gray-500">
                          {beneficiario.observacoes}
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4 mr-1" />
                            Detalhes
                          </Button>
                          <Button size="sm" variant="outline">
                            <MapPin className="h-4 w-4 mr-1" />
                            Localizar
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

        <TabsContent value="financiamentos" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Linhas de Financiamento</CardTitle>
              <CardDescription>Opções de financiamento habitacional disponíveis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold">Financiamento CEF - Pessoa Física</h3>
                        <p className="text-gray-600">Linha de crédito da Caixa Econômica Federal</p>
                      </div>
                      <Badge variant="default">Disponível</Badge>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                      <div>
                        <div className="text-sm text-gray-500">Taxa de Juros</div>
                        <div className="font-medium">8,16% a.a.</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Valor Máximo</div>
                        <div className="font-medium">R$ 350.000</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Prazo</div>
                        <div className="font-medium">Até 35 anos</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Entrada</div>
                        <div className="font-medium">20% mínimo</div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">Destinado à aquisição de imóveis residenciais novos ou usados, construção e reforma.</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold">FGTS - Uso como Entrada</h3>
                        <p className="text-gray-600">Utilização do FGTS para entrada e amortização</p>
                      </div>
                      <Badge variant="default">Disponível</Badge>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                      <div>
                        <div className="text-sm text-gray-500">Valor Máximo</div>
                        <div className="font-medium">R$ 170.000</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Tempo Mínimo</div>
                        <div className="font-medium">3 anos de trabalho</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Uso</div>
                        <div className="font-medium">Entrada + Amortização</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Periodicidade</div>
                        <div className="font-medium">A cada 2 anos</div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">Possibilita o uso do saldo do FGTS para entrada, amortização ou quitação do financiamento.</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold">Carta de Crédito Associativo</h3>
                        <p className="text-gray-600">Financiamento através de associações habitacionais</p>
                      </div>
                      <Badge variant="secondary">Limitado</Badge>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                      <div>
                        <div className="text-sm text-gray-500">Taxa de Juros</div>
                        <div className="font-medium">5,95% a.a.</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Valor Máximo</div>
                        <div className="font-medium">R$ 240.000</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Modalidade</div>
                        <div className="font-medium">Associativo</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Parcelas</div>
                        <div className="font-medium">Até 300 meses</div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">Destinado a grupos organizados em associações para aquisição de terreno e construção.</p>
                  </CardContent>
                </Card>
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
                      <Building className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Programa Habitacional Municipal</h3>
                      <p className="text-sm text-gray-600">Inscrição nos programas habitacionais da cidade</p>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500 mb-2">Campos do formulário público:</div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>• Dados pessoais e familiares</div>
                    <div>• Comprovação de renda</div>
                    <div>• Situação habitacional atual</div>
                    <div>• Preferência de programa</div>
                    <div>• Documentos obrigatórios</div>
                    <div>• Declarações específicas</div>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <CreditCard className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Financiamento de Moradia</h3>
                      <p className="text-sm text-gray-600">Solicitação de financiamento habitacional</p>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500 mb-2">Campos do formulário público:</div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>• Dados do solicitante</div>
                    <div>• Renda familiar detalhada</div>
                    <div>• Tipo de financiamento</div>
                    <div>• Valor do imóvel pretendido</div>
                    <div>• Documentação financeira</div>
                    <div>• Histórico de crédito</div>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <DollarSign className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Auxílio Habitacional</h3>
                      <p className="text-sm text-gray-600">Solicitação de auxílio habitacional temporário</p>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500 mb-2">Campos do formulário público:</div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>• Identificação familiar</div>
                    <div>• Situação de emergência</div>
                    <div>• Comprovação de vulnerabilidade</div>
                    <div>• Tempo necessário de auxílio</div>
                    <div>• Endereço temporário</div>
                    <div>• Referências sociais</div>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <CheckCircle className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Casa Verde e Amarela</h3>
                      <p className="text-sm text-gray-600">Cadastro no programa federal de habitação</p>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500 mb-2">Campos do formulário público:</div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>• Cadastro CadÚnico atualizado</div>
                    <div>• Comprovantes de renda</div>
                    <div>• Certidões negativas</div>
                    <div>• Declaração de não propriedade</div>
                    <div>• Documentos familiares</div>
                    <div>• Termo de adesão</div>
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
                  permitindo que cidadãos se inscrevam nos programas habitacionais, solicitem financiamentos e
                  auxílios de forma digital, com acompanhamento transparente do processo.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}