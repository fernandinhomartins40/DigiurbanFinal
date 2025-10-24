"use client";

import { useState } from "react";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, AreaChart, Area } from "recharts";
import { LayoutDashboard, Home, Users, TrendingUp, Building, MapPin, CreditCard, FileText, Clock, CheckCircle, AlertTriangle, Target, Activity, DollarSign, Calendar, RefreshCw, Download, Filter, Settings, Zap, ArrowUp, ArrowDown, Minus } from "lucide-react";

export default function DashboardHabitacaoPage() {
  useAdminAuth("admin");

  const [periodoBusca, setPeriodoBusca] = useState("30");
  const [tipoVisao, setTipoVisao] = useState("geral");

  const dataResumoGeral = {
    atendimentos: {
      total: 892,
      mes_atual: 47,
      variacao: 8,
      tempo_medio: "18 min"
    },
    inscricoes: {
      total: 1089,
      mes_atual: 198,
      aprovados: 208,
      lista_espera: 536
    },
    programas: {
      total: 4,
      ativos: 3,
      investimento: "R$ 39.900.000",
      beneficiarios: 1766
    },
    unidades: {
      total: 282,
      ocupadas: 258,
      disponiveis: 8,
      manutencao: 4
    },
    regularizacao: {
      total: 148,
      finalizados: 45,
      tempo_medio: "6.8 meses",
      valor_regularizado: "R$ 8.400.000"
    }
  };

  const dataEvolucaoMensal = [
    { mes: "Jul", atendimentos: 145, inscricoes: 89, unidades_entregues: 23, regularizacoes: 18 },
    { mes: "Ago", atendimentos: 167, inscricoes: 156, unidades_entregues: 31, regularizacoes: 22 },
    { mes: "Set", atendimentos: 189, inscricoes: 134, unidades_entregues: 28, regularizacoes: 25 },
    { mes: "Out", atendimentos: 156, inscricoes: 178, unidades_entregues: 35, regularizacoes: 29 },
    { mes: "Nov", atendimentos: 178, inscricoes: 145, unidades_entregues: 29, regularizacoes: 31 },
    { mes: "Dez", atendimentos: 198, inscricoes: 198, unidades_entregues: 42, regularizacoes: 35 }
  ];

  const dataDistribuicaoServicos = [
    { nome: "Orientação Habitacional", quantidade: 487, porcentagem: 38, cor: "#3B82F6" },
    { nome: "Inscrições Programas", quantidade: 356, porcentagem: 28, cor: "#10B981" },
    { nome: "Manutenção Unidades", quantidade: 198, porcentagem: 15, cor: "#F59E0B" },
    { nome: "Regularização", quantidade: 148, porcentagem: 12, cor: "#8B5CF6" },
    { nome: "Transferências", quantidade: 89, porcentagem: 7, cor: "#EF4444" }
  ];

  const dataInvestimentosProgramas = [
    { mes: "Jul", casa_verde_amarela: 2100000, habitacao_social: 450000, mcmv: 800000 },
    { mes: "Ago", casa_verde_amarela: 1850000, habitacao_social: 680000, mcmv: 750000 },
    { mes: "Set", casa_verde_amarela: 2340000, habitacao_social: 520000, mcmv: 820000 },
    { mes: "Out", casa_verde_amarela: 1950000, habitacao_social: 750000, mcmv: 690000 },
    { mes: "Nov", casa_verde_amarela: 2180000, habitacao_social: 630000, mcmv: 780000 },
    { mes: "Dez", casa_verde_amarela: 2450000, habitacao_social: 890000, mcmv: 950000 }
  ];

  const dataOcupacaoUnidades = [
    { mes: "Jul", ocupadas: 234, disponiveis: 18, manutencao: 12, taxa_ocupacao: 91.4 },
    { mes: "Ago", ocupadas: 245, disponiveis: 15, manutencao: 8, taxa_ocupacao: 93.3 },
    { mes: "Set", ocupadas: 251, disponiveis: 12, manutencao: 5, taxa_ocupacao: 95.1 },
    { mes: "Out", ocupadas: 248, disponiveis: 14, manutencao: 9, taxa_ocupacao: 93.6 },
    { mes: "Nov", ocupadas: 253, disponiveis: 11, manutencao: 6, taxa_ocupacao: 95.9 },
    { mes: "Dez", ocupadas: 258, disponiveis: 8, manutencao: 4, taxa_ocupacao: 97.2 }
  ];

  const dataIndicadoresRegionais = [
    { regiao: "Centro", atendimentos: 198, programas: 2, unidades: 67, regularizacoes: 34, score: 85 },
    { regiao: "Norte", atendimentos: 234, programas: 3, unidades: 89, regularizacoes: 45, score: 78 },
    { regiao: "Sul", atendimentos: 167, programas: 2, unidades: 56, regularizacoes: 28, score: 82 },
    { regiao: "Leste", atendimentos: 145, programas: 1, unidades: 38, regularizacoes: 22, score: 71 },
    { regiao: "Oeste", atendimentos: 148, programas: 2, unidades: 32, regularizacoes: 19, score: 76 }
  ];

  const alertasUrgentes = [
    {
      id: 1,
      tipo: "Inadimplência",
      titulo: "Unidades com Atraso de Pagamento",
      descricao: "12 unidades com mais de 3 parcelas em atraso",
      prioridade: "Alta",
      area: "Unidades Habitacionais"
    },
    {
      id: 2,
      tipo: "Manutenção",
      titulo: "Reparos Urgentes Pendentes",
      descricao: "4 unidades com problemas estruturais necessitando reparo imediato",
      prioridade: "Alta",
      area: "Manutenção"
    },
    {
      id: 3,
      tipo: "Lista de Espera",
      titulo: "Fila de Programas Habitacionais",
      descricao: "536 famílias aguardando na lista de espera dos programas",
      prioridade: "Média",
      area: "Programas"
    },
    {
      id: 4,
      tipo: "Documentação",
      titulo: "Processos de Regularização Parados",
      descricao: "22 processos aguardando documentação há mais de 60 dias",
      prioridade: "Média",
      area: "Regularização"
    }
  ];

  const metasSecretaria = [
    {
      nome: "Taxa de Ocupação",
      atual: 91.5,
      meta: 95,
      unidade: "%",
      progresso: 96,
      status: "success"
    },
    {
      nome: "Tempo Médio Atendimento",
      atual: 18,
      meta: 15,
      unidade: "min",
      progresso: 83,
      status: "warning"
    },
    {
      nome: "Processos Finalizados/Mês",
      atual: 35,
      meta: 40,
      unidade: "processos",
      progresso: 88,
      status: "warning"
    },
    {
      nome: "Satisfação do Cidadão",
      atual: 4.7,
      meta: 4.5,
      unidade: "estrelas",
      progresso: 104,
      status: "success"
    }
  ];

  const dataImpactoSocial = [
    { indicador: "Famílias Beneficiadas", valor: 1766, variacao: 12 },
    { indicador: "Unidades Entregues", valor: 577, variacao: 8 },
    { indicador: "Imóveis Regularizados", valor: 148, variacao: 15 },
    { indicador: "Empregos Gerados", valor: 2340, variacao: 22 },
    { indicador: "Investimento Total", valor: 39900000, variacao: 18 },
    { indicador: "Economia para Famílias", valor: 8400000, variacao: 25 }
  ];

  const getVariacaoIcon = (variacao: number) => {
    if (variacao > 0) return <ArrowUp className="h-4 w-4 text-green-600" />;
    if (variacao < 0) return <ArrowDown className="h-4 w-4 text-red-600" />;
    return <Minus className="h-4 w-4 text-gray-600" />;
  };

  const getVariacaoColor = (variacao: number) => {
    if (variacao > 0) return "text-green-600";
    if (variacao < 0) return "text-red-600";
    return "text-gray-600";
  };

  const getPrioridadeBadge = (prioridade: string) => {
    const variants: { [key: string]: "default" | "secondary" | "destructive" | "outline" } = {
      "Alta": "destructive",
      "Média": "secondary",
      "Baixa": "outline"
    };
    return <Badge variant={variants[prioridade] || "outline"}>{prioridade}</Badge>;
  };

  const getMetaStatus = (status: string) => {
    const colors = {
      success: "bg-green-500",
      warning: "bg-yellow-500",
      error: "bg-red-500"
    };
    return colors[status as keyof typeof colors] || "bg-gray-500";
  };

  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `R$ ${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `R$ ${(value / 1000).toFixed(0)}k`;
    }
    return `R$ ${value.toLocaleString()}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <LayoutDashboard className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard Habitação</h1>
              <p className="text-gray-600">Painel de controle habitacional municipal consolidado</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Select value={periodoBusca} onValueChange={setPeriodoBusca}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Últimos 7 dias</SelectItem>
                <SelectItem value="30">Últimos 30 dias</SelectItem>
                <SelectItem value="90">Últimos 3 meses</SelectItem>
                <SelectItem value="365">Último ano</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Atualizar
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Atendimentos</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dataResumoGeral.atendimentos.total}</div>
              <div className="flex items-center text-xs text-muted-foreground">
                {getVariacaoIcon(dataResumoGeral.atendimentos.variacao)}
                <span className={`ml-1 ${getVariacaoColor(dataResumoGeral.atendimentos.variacao)}`}>
                  {dataResumoGeral.atendimentos.variacao}% vs mês anterior
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Inscrições Ativas</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dataResumoGeral.inscricoes.total}</div>
              <p className="text-xs text-muted-foreground">
                {dataResumoGeral.inscricoes.aprovados} aprovados
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Unidades Ocupadas</CardTitle>
              <Home className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dataResumoGeral.unidades.ocupadas}</div>
              <p className="text-xs text-muted-foreground">
                {Math.round((dataResumoGeral.unidades.ocupadas / dataResumoGeral.unidades.total) * 100)}% ocupação
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Investimento Total</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">R$ 39,9M</div>
              <p className="text-xs text-muted-foreground">
                {dataResumoGeral.programas.beneficiarios} beneficiários
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tempo Médio</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dataResumoGeral.atendimentos.tempo_medio}</div>
              <p className="text-xs text-muted-foreground">Atendimento completo</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="visao-geral" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="visao-geral">Visão Geral</TabsTrigger>
            <TabsTrigger value="programas">Programas</TabsTrigger>
            <TabsTrigger value="regional">Regional</TabsTrigger>
            <TabsTrigger value="impacto">Impacto Social</TabsTrigger>
            <TabsTrigger value="servicos">Serviços Gerados</TabsTrigger>
          </TabsList>

          <TabsContent value="visao-geral" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Evolução dos Serviços</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={dataEvolucaoMensal}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="mes" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="atendimentos" stroke="#3B82F6" name="Atendimentos" />
                      <Line type="monotone" dataKey="inscricoes" stroke="#10B981" name="Inscrições" />
                      <Line type="monotone" dataKey="unidades_entregues" stroke="#F59E0B" name="Unidades Entregues" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Distribuição de Serviços</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={dataDistribuicaoServicos}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="quantidade"
                      >
                        {dataDistribuicaoServicos.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.cor} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="grid grid-cols-1 gap-2 mt-4">
                    {dataDistribuicaoServicos.map((item, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.cor }}></div>
                        <span className="text-xs text-gray-600">{item.nome}: {item.quantidade}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Taxa de Ocupação</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <AreaChart data={dataOcupacaoUnidades}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="mes" />
                      <YAxis />
                      <Tooltip />
                      <Area type="monotone" dataKey="taxa_ocupacao" stroke="#10B981" fill="#10B981" fillOpacity={0.3} name="Taxa de Ocupação %" />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Metas da Secretaria</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {metasSecretaria.map((meta, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{meta.nome}</span>
                          <span className="text-sm text-gray-500">
                            {meta.atual} / {meta.meta} {meta.unidade}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${getMetaStatus(meta.status)}`}
                            style={{ width: `${Math.min(meta.progresso, 100)}%` }}
                          ></div>
                        </div>
                        <div className="text-xs text-gray-500">{meta.progresso}% da meta</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Alertas e Notificações</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {alertasUrgentes.map((alerta) => (
                    <div key={alerta.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="h-5 w-5 text-orange-500" />
                          <h3 className="font-semibold">{alerta.titulo}</h3>
                        </div>
                        <div className="flex gap-2">
                          {getPrioridadeBadge(alerta.prioridade)}
                          <Badge variant="outline">{alerta.area}</Badge>
                        </div>
                      </div>
                      <p className="text-gray-600 mb-3">{alerta.descricao}</p>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">Visualizar</Button>
                        <Button size="sm">Resolver</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="programas" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Investimentos por Programa</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={dataInvestimentosProgramas}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mes" />
                    <YAxis tickFormatter={(value) => `R$ ${(value / 1000000).toFixed(1)}M`} />
                    <Tooltip formatter={(value) => [`R$ ${(value as number).toLocaleString()}`, ""]} />
                    <Bar dataKey="casa_verde_amarela" stackId="a" fill="#3B82F6" name="Casa Verde e Amarela" />
                    <Bar dataKey="habitacao_social" stackId="a" fill="#10B981" name="Habitação Social" />
                    <Bar dataKey="mcmv" stackId="a" fill="#F59E0B" name="Minha Casa Minha Vida" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Casa Verde e Amarela</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Meta</span>
                      <span className="font-medium">500 unidades</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Entregues</span>
                      <span className="font-medium">234 unidades</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Progresso</span>
                      <span className="font-medium">47%</span>
                    </div>
                    <Progress value={47} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Habitação Social</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Meta</span>
                      <span className="font-medium">200 unidades</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Entregues</span>
                      <span className="font-medium">87 unidades</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Progresso</span>
                      <span className="font-medium">44%</span>
                    </div>
                    <Progress value={44} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Minha Casa Minha Vida</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Meta</span>
                      <span className="font-medium">300 unidades</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Entregues</span>
                      <span className="font-medium">189 unidades</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Progresso</span>
                      <span className="font-medium">63%</span>
                    </div>
                    <Progress value={63} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Auxílio Habitacional</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Meta</span>
                      <span className="font-medium">100 famílias</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Atendidas</span>
                      <span className="font-medium">67 famílias</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Progresso</span>
                      <span className="font-medium">67%</span>
                    </div>
                    <Progress value={67} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="regional" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Indicadores por Região</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dataIndicadoresRegionais.map((regiao, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="font-semibold">{regiao.regiao}</h3>
                        <div className="text-right">
                          <div className="text-lg font-bold">{regiao.score}</div>
                          <div className="text-xs text-gray-500">Score Geral</div>
                        </div>
                      </div>
                      <div className="grid grid-cols-4 gap-4">
                        <div>
                          <div className="text-sm text-gray-500">Atendimentos</div>
                          <div className="font-medium">{regiao.atendimentos}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Programas</div>
                          <div className="font-medium">{regiao.programas}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Unidades</div>
                          <div className="font-medium">{regiao.unidades}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Regularizações</div>
                          <div className="font-medium">{regiao.regularizacoes}</div>
                        </div>
                      </div>
                      <div className="mt-3">
                        <Progress value={regiao.score} className="h-2" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="impacto" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Impacto Social dos Programas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {dataImpactoSocial.map((item, index) => (
                    <Card key={index}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div className="text-sm text-gray-500">{item.indicador}</div>
                          <div className="flex items-center">
                            {getVariacaoIcon(item.variacao)}
                            <span className={`text-xs ml-1 ${getVariacaoColor(item.variacao)}`}>
                              {item.variacao}%
                            </span>
                          </div>
                        </div>
                        <div className="text-2xl font-bold">
                          {item.indicador.includes("Investimento") || item.indicador.includes("Economia") ?
                            formatCurrency(item.valor) :
                            item.valor.toLocaleString()
                          }
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Resumo por Área de Atuação</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-blue-600">Atendimento e Orientação</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Total de atendimentos</span>
                        <span className="font-medium">892</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Tempo médio</span>
                        <span className="font-medium">18 min</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Satisfação</span>
                        <span className="font-medium">4.7⭐</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold text-green-600">Programas Habitacionais</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Famílias beneficiadas</span>
                        <span className="font-medium">1.766</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Investimento total</span>
                        <span className="font-medium">R$ 39,9M</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Unidades entregues</span>
                        <span className="font-medium">577</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold text-purple-600">Regularização Fundiária</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Processos ativos</span>
                        <span className="font-medium">148</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Finalizados</span>
                        <span className="font-medium">45</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Valor regularizado</span>
                        <span className="font-medium">R$ 8,4M</span>
                      </div>
                    </div>
                  </div>
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
                        <LayoutDashboard className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold">Relatório Habitacional da Família</h3>
                        <p className="text-sm text-gray-600">Situação completa da família nos programas habitacionais</p>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500 mb-2">Informações disponíveis:</div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>• Status de inscrições</div>
                      <div>• Posição na fila</div>
                      <div>• Histórico de atendimentos</div>
                      <div>• Unidades ocupadas</div>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <Target className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold">Situação na Fila</h3>
                        <p className="text-sm text-gray-600">Consulta de posição nos programas habitacionais</p>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500 mb-2">Campos de consulta:</div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>• CPF do inscrito</div>
                      <div>• Número da inscrição</div>
                      <div>• Programa específico</div>
                      <div>• Previsão de atendimento</div>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <Activity className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold">Histórico Habitacional</h3>
                        <p className="text-sm text-gray-600">Histórico completo de participação em programas</p>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500 mb-2">Dados históricos:</div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>• Programas anteriores</div>
                      <div>• Unidades ocupadas</div>
                      <div>• Transferências realizadas</div>
                      <div>• Processos de regularização</div>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-orange-100 rounded-lg">
                        <TrendingUp className="h-5 w-5 text-orange-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold">Indicadores Públicos</h3>
                        <p className="text-sm text-gray-600">Transparência dos resultados dos programas</p>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500 mb-2">Métricas públicas:</div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>• Famílias beneficiadas</div>
                      <div>• Unidades entregues</div>
                      <div>• Investimentos realizados</div>
                      <div>• Impacto social mensurado</div>
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
                    promovendo transparência total das políticas habitacionais e permitindo que cidadãos acompanhem
                    seus processos e consultem indicadores de impacto social em tempo real.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}