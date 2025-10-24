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
import { Home, Users, Clock, MessageSquare, Calendar, Phone, MapPin, FileText, Star, TrendingUp, Plus, Search, Filter, Download, Eye, Edit, CheckCircle, User, Building2, CreditCard, Settings, Zap, RefreshCw } from "lucide-react";

export default function AtendimentosHabitacaoPage() {
  useAdminAuth("admin");

  const [atendimentos, setAtendimentos] = useState([
    {
      id: 1,
      protocolo: "HAB-2024-001234",
      cidadao: "Maria Silva Santos",
      cpf: "123.456.789-00",
      telefone: "(11) 98765-4321",
      tipo_atendimento: "Orientação Habitacional",
      assunto: "Informações sobre programa habitacional",
      descricao: "Cidadã busca informações sobre como se inscrever no programa de habitação popular da cidade",
      status: "Em Atendimento",
      prioridade: "Média",
      data_abertura: "2024-01-15",
      previsao_resposta: "2024-01-17",
      atendente: "Ana Costa",
      canal: "Presencial",
      renda_familiar: "R$ 2.800,00",
      situacao_moradia: "Aluguel",
      observacoes: "Família com 2 filhos menores, primeira orientação"
    },
    {
      id: 2,
      protocolo: "HAB-2024-001567",
      cidadao: "João Oliveira",
      cpf: "987.654.321-00",
      telefone: "(11) 94567-8901",
      tipo_atendimento: "Auxílio Habitacional",
      assunto: "Solicitação de auxílio moradia",
      descricao: "Solicitação de auxílio habitacional temporário devido à perda de emprego",
      status: "Aguardando Documentos",
      prioridade: "Alta",
      data_abertura: "2024-01-12",
      previsao_resposta: "2024-01-16",
      atendente: "Carlos Lima",
      canal: "WhatsApp",
      renda_familiar: "R$ 1.200,00",
      situacao_moradia: "Despejo",
      observacoes: "Situação de vulnerabilidade social"
    },
    {
      id: 3,
      protocolo: "HAB-2024-001890",
      cidadao: "Luciana Fernandes",
      cpf: "456.789.123-00",
      telefone: "(11) 91234-5678",
      tipo_atendimento: "Programa MCMV",
      assunto: "Inscrição Minha Casa Minha Vida",
      descricao: "Orientação para inscrição no programa federal Minha Casa Minha Vida",
      status: "Resolvido",
      prioridade: "Média",
      data_abertura: "2024-01-10",
      previsao_resposta: "2024-01-12",
      atendente: "Pedro Santos",
      canal: "Telefone",
      renda_familiar: "R$ 3.200,00",
      situacao_moradia: "Casa dos pais",
      observacoes: "Primeira habitação própria"
    }
  ]);

  const [orientacoes, setOrientacoes] = useState([
    {
      id: 1,
      titulo: "Como se inscrever no Programa Habitacional",
      categoria: "Inscrição",
      conteudo: "Passo a passo para se cadastrar nos programas habitacionais municipais",
      visualizacoes: 1247,
      ultima_atualizacao: "2024-01-10"
    },
    {
      id: 2,
      titulo: "Documentos necessários para Auxílio Habitacional",
      categoria: "Documentação",
      conteudo: "Lista completa de documentos exigidos para solicitar auxílio habitacional",
      visualizacoes: 892,
      ultima_atualizacao: "2024-01-08"
    },
    {
      id: 3,
      titulo: "Critérios de elegibilidade para programas",
      categoria: "Critérios",
      conteudo: "Requisitos para participar dos diferentes programas habitacionais",
      visualizacoes: 756,
      ultima_atualizacao: "2024-01-05"
    }
  ]);

  const [filtroStatus, setFiltroStatus] = useState("");
  const [filtroPrioridade, setFiltroPrioridade] = useState("");
  const [filtroTipo, setFiltroTipo] = useState("");
  const [busca, setBusca] = useState("");

  const [atendimentoDialog, setAtendimentoDialog] = useState(false);
  const [orientacaoDialog, setOrientacaoDialog] = useState(false);

  const [novoAtendimento, setNovoAtendimento] = useState({
    cidadao: "",
    cpf: "",
    telefone: "",
    tipo_atendimento: "",
    assunto: "",
    descricao: "",
    prioridade: "",
    canal: "",
    renda_familiar: "",
    situacao_moradia: ""
  });

  const [novaOrientacao, setNovaOrientacao] = useState({
    titulo: "",
    categoria: "",
    conteudo: ""
  });

  const dataEstatisticas = [
    { mes: "Jul", orientacoes: 145, auxilios: 23, inscricoes: 67, mcmv: 12 },
    { mes: "Ago", orientacoes: 167, auxilios: 31, inscricoes: 78, mcmv: 15 },
    { mes: "Set", orientacoes: 189, auxilios: 28, inscricoes: 84, mcmv: 18 },
    { mes: "Out", orientacoes: 156, auxilios: 35, inscricoes: 72, mcmv: 14 },
    { mes: "Nov", orientacoes: 178, auxilios: 29, inscricoes: 89, mcmv: 21 },
    { mes: "Dez", orientacoes: 198, auxilios: 42, inscricoes: 93, mcmv: 19 }
  ];

  const dataTiposAtendimento = [
    { nome: "Orientação Habitacional", quantidade: 487, cor: "#3B82F6" },
    { nome: "Auxílio Habitacional", quantidade: 156, cor: "#EF4444" },
    { nome: "Programa MCMV", quantidade: 234, cor: "#10B981" },
    { nome: "Regularização", quantidade: 89, cor: "#F59E0B" },
    { nome: "Financiamento", quantidade: 123, cor: "#8B5CF6" }
  ];

  const dataCanaisAtendimento = [
    { canal: "Presencial", quantidade: 456, tempo_medio: 25 },
    { canal: "WhatsApp", quantidade: 234, tempo_medio: 15 },
    { canal: "Telefone", quantidade: 189, tempo_medio: 20 },
    { canal: "Site", quantidade: 321, tempo_medio: 5 }
  ];

  const atendimentosFiltrados = atendimentos.filter(atendimento => {
    const matchesBusca = atendimento.cidadao.toLowerCase().includes(busca.toLowerCase()) ||
                        atendimento.protocolo.toLowerCase().includes(busca.toLowerCase()) ||
                        atendimento.assunto.toLowerCase().includes(busca.toLowerCase());
    const matchesStatus = filtroStatus === "" || atendimento.status === filtroStatus;
    const matchesTipo = filtroTipo === "" || atendimento.tipo_atendimento === filtroTipo;
    const matchesPrioridade = filtroPrioridade === "" || atendimento.prioridade === filtroPrioridade;
    return matchesBusca && matchesStatus && matchesTipo && matchesPrioridade;
  });

  const getStatusBadge = (status: string) => {
    const variants: { [key: string]: "default" | "secondary" | "destructive" | "outline" } = {
      "Em Atendimento": "default",
      "Aguardando Documentos": "secondary",
      "Resolvido": "outline",
      "Cancelado": "destructive"
    };
    return <Badge variant={variants[status] || "outline"}>{status}</Badge>;
  };

  const getPrioridadeBadge = (prioridade: string) => {
    const variants: { [key: string]: "default" | "secondary" | "destructive" | "outline" } = {
      "Alta": "destructive",
      "Média": "secondary",
      "Baixa": "outline"
    };
    return <Badge variant={variants[prioridade] || "outline"}>{prioridade}</Badge>;
  };

  const handleCreateAtendimento = () => {
    const atendimento = {
      id: atendimentos.length + 1,
      protocolo: `HAB-2024-${String(Math.floor(Math.random() * 900000) + 100000)}`,
      ...novoAtendimento,
      status: "Em Atendimento",
      data_abertura: new Date().toISOString().split('T')[0],
      previsao_resposta: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      atendente: "Sistema",
      observacoes: ""
    };
    setAtendimentos([...atendimentos, atendimento]);
    setNovoAtendimento({
      cidadao: "",
      cpf: "",
      telefone: "",
      tipo_atendimento: "",
      assunto: "",
      descricao: "",
      prioridade: "",
      canal: "",
      renda_familiar: "",
      situacao_moradia: ""
    });
    setAtendimentoDialog(false);
  };

  const handleCreateOrientacao = () => {
    const orientacao = {
      id: orientacoes.length + 1,
      ...novaOrientacao,
      visualizacoes: 0,
      ultima_atualizacao: new Date().toISOString().split('T')[0]
    };
    setOrientacoes([...orientacoes, orientacao]);
    setNovaOrientacao({ titulo: "", categoria: "", conteudo: "" });
    setOrientacaoDialog(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Home className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Atendimentos Habitacionais</h1>
            <p className="text-gray-600">PDV para orientações habitacionais e suporte aos cidadãos</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Atendimentos Hoje</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">47</div>
              <p className="text-xs text-muted-foreground">+15% vs ontem</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tempo Médio</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">18min</div>
              <p className="text-xs text-muted-foreground">Atendimento completo</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Satisfação</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4.7</div>
              <p className="text-xs text-muted-foreground">Avaliação média</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Taxa Resolução</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">87%</div>
              <p className="text-xs text-muted-foreground">Primeiro atendimento</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Evolução de Atendimentos</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={dataEstatisticas}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mes" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="orientacoes" stroke="#3B82F6" name="Orientações" />
                  <Line type="monotone" dataKey="auxilios" stroke="#EF4444" name="Auxílios" />
                  <Line type="monotone" dataKey="inscricoes" stroke="#10B981" name="Inscrições" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Tipos de Atendimento</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={dataTiposAtendimento}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="quantidade"
                  >
                    {dataTiposAtendimento.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.cor} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-2 gap-2 mt-4">
                {dataTiposAtendimento.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.cor }}></div>
                    <span className="text-xs text-gray-600">{item.nome}: {item.quantidade}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Performance por Canal</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={dataCanaisAtendimento}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="canal" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Bar yAxisId="left" dataKey="quantidade" fill="#3B82F6" name="Quantidade" />
                <Bar yAxisId="right" dataKey="tempo_medio" fill="#10B981" name="Tempo Médio (min)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="atendimentos" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="atendimentos">Atendimentos</TabsTrigger>
          <TabsTrigger value="orientacoes">Material Orientativo</TabsTrigger>
          <TabsTrigger value="fila">Fila de Atendimento</TabsTrigger>
          <TabsTrigger value="servicos">Serviços Gerados</TabsTrigger>
        </TabsList>

        <TabsContent value="atendimentos" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Gestão de Atendimentos</CardTitle>
                  <CardDescription>Acompanhamento de atendimentos habitacionais aos cidadãos</CardDescription>
                </div>
                <Dialog open={atendimentoDialog} onOpenChange={setAtendimentoDialog}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Novo Atendimento
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Registrar Novo Atendimento</DialogTitle>
                      <DialogDescription>Cadastre um novo atendimento habitacional</DialogDescription>
                    </DialogHeader>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="cidadao">Nome do Cidadão</Label>
                        <Input
                          id="cidadao"
                          value={novoAtendimento.cidadao}
                          onChange={(e) => setNovoAtendimento({ ...novoAtendimento, cidadao: e.target.value })}
                          placeholder="Nome completo"
                        />
                      </div>
                      <div>
                        <Label htmlFor="cpf">CPF</Label>
                        <Input
                          id="cpf"
                          value={novoAtendimento.cpf}
                          onChange={(e) => setNovoAtendimento({ ...novoAtendimento, cpf: e.target.value })}
                          placeholder="000.000.000-00"
                        />
                      </div>
                      <div>
                        <Label htmlFor="telefone">Telefone</Label>
                        <Input
                          id="telefone"
                          value={novoAtendimento.telefone}
                          onChange={(e) => setNovoAtendimento({ ...novoAtendimento, telefone: e.target.value })}
                          placeholder="(00) 00000-0000"
                        />
                      </div>
                      <div>
                        <Label htmlFor="tipo_atendimento">Tipo de Atendimento</Label>
                        <Select value={novoAtendimento.tipo_atendimento} onValueChange={(value) => setNovoAtendimento({ ...novoAtendimento, tipo_atendimento: value })}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o tipo" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Orientação Habitacional">Orientação Habitacional</SelectItem>
                            <SelectItem value="Auxílio Habitacional">Auxílio Habitacional</SelectItem>
                            <SelectItem value="Programa MCMV">Programa MCMV</SelectItem>
                            <SelectItem value="Regularização">Regularização</SelectItem>
                            <SelectItem value="Financiamento">Financiamento</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="canal">Canal</Label>
                        <Select value={novoAtendimento.canal} onValueChange={(value) => setNovoAtendimento({ ...novoAtendimento, canal: value })}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o canal" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Presencial">Presencial</SelectItem>
                            <SelectItem value="WhatsApp">WhatsApp</SelectItem>
                            <SelectItem value="Telefone">Telefone</SelectItem>
                            <SelectItem value="Site">Site</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="prioridade">Prioridade</Label>
                        <Select value={novoAtendimento.prioridade} onValueChange={(value) => setNovoAtendimento({ ...novoAtendimento, prioridade: value })}>
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
                        <Label htmlFor="renda_familiar">Renda Familiar</Label>
                        <Input
                          id="renda_familiar"
                          value={novoAtendimento.renda_familiar}
                          onChange={(e) => setNovoAtendimento({ ...novoAtendimento, renda_familiar: e.target.value })}
                          placeholder="R$ 0,00"
                        />
                      </div>
                      <div>
                        <Label htmlFor="situacao_moradia">Situação de Moradia</Label>
                        <Select value={novoAtendimento.situacao_moradia} onValueChange={(value) => setNovoAtendimento({ ...novoAtendimento, situacao_moradia: value })}>
                          <SelectTrigger>
                            <SelectValue placeholder="Situação atual" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Aluguel">Aluguel</SelectItem>
                            <SelectItem value="Casa própria">Casa própria</SelectItem>
                            <SelectItem value="Casa de parentes">Casa de parentes</SelectItem>
                            <SelectItem value="Ocupação">Ocupação</SelectItem>
                            <SelectItem value="Despejo">Em situação de despejo</SelectItem>
                            <SelectItem value="Rua">Situação de rua</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="col-span-2">
                        <Label htmlFor="assunto">Assunto</Label>
                        <Input
                          id="assunto"
                          value={novoAtendimento.assunto}
                          onChange={(e) => setNovoAtendimento({ ...novoAtendimento, assunto: e.target.value })}
                          placeholder="Resumo do assunto"
                        />
                      </div>
                      <div className="col-span-2">
                        <Label htmlFor="descricao">Descrição</Label>
                        <Textarea
                          id="descricao"
                          value={novoAtendimento.descricao}
                          onChange={(e) => setNovoAtendimento({ ...novoAtendimento, descricao: e.target.value })}
                          placeholder="Descrição detalhada do atendimento"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setAtendimentoDialog(false)}>Cancelar</Button>
                      <Button onClick={handleCreateAtendimento}>Registrar Atendimento</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 mb-4 flex-wrap">
                <div className="flex-1 min-w-64">
                  <Input
                    placeholder="Buscar atendimentos..."
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
                    <SelectItem value="Em Atendimento">Em Atendimento</SelectItem>
                    <SelectItem value="Aguardando Documentos">Aguardando Documentos</SelectItem>
                    <SelectItem value="Resolvido">Resolvido</SelectItem>
                    <SelectItem value="Cancelado">Cancelado</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filtroTipo} onValueChange={setFiltroTipo}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filtrar por tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todos os tipos</SelectItem>
                    <SelectItem value="Orientação Habitacional">Orientação</SelectItem>
                    <SelectItem value="Auxílio Habitacional">Auxílio</SelectItem>
                    <SelectItem value="Programa MCMV">MCMV</SelectItem>
                    <SelectItem value="Regularização">Regularização</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Exportar
                </Button>
              </div>

              <div className="border rounded-lg overflow-hidden">
                <div className="grid grid-cols-8 gap-4 p-4 bg-gray-50 font-medium text-sm">
                  <div>Protocolo</div>
                  <div>Cidadão</div>
                  <div>Tipo</div>
                  <div>Assunto</div>
                  <div>Status</div>
                  <div>Prioridade</div>
                  <div>Data</div>
                  <div>Ações</div>
                </div>
                <div className="divide-y">
                  {atendimentosFiltrados.map((atendimento) => (
                    <div key={atendimento.id} className="grid grid-cols-8 gap-4 p-4 items-center">
                      <div className="font-mono text-sm">{atendimento.protocolo}</div>
                      <div className="font-medium">{atendimento.cidadao}</div>
                      <div>{atendimento.tipo_atendimento}</div>
                      <div className="truncate">{atendimento.assunto}</div>
                      <div>{getStatusBadge(atendimento.status)}</div>
                      <div>{getPrioridadeBadge(atendimento.prioridade)}</div>
                      <div>{new Date(atendimento.data_abertura).toLocaleDateString()}</div>
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

        <TabsContent value="orientacoes" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Material Orientativo</CardTitle>
                  <CardDescription>Conteúdo educativo e informativo sobre habitação</CardDescription>
                </div>
                <Dialog open={orientacaoDialog} onOpenChange={setOrientacaoDialog}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Nova Orientação
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Criar Material Orientativo</DialogTitle>
                      <DialogDescription>Adicione novo conteúdo orientativo</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="titulo_orientacao">Título</Label>
                        <Input
                          id="titulo_orientacao"
                          value={novaOrientacao.titulo}
                          onChange={(e) => setNovaOrientacao({ ...novaOrientacao, titulo: e.target.value })}
                          placeholder="Título da orientação"
                        />
                      </div>
                      <div>
                        <Label htmlFor="categoria_orientacao">Categoria</Label>
                        <Select value={novaOrientacao.categoria} onValueChange={(value) => setNovaOrientacao({ ...novaOrientacao, categoria: value })}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione a categoria" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Inscrição">Inscrição</SelectItem>
                            <SelectItem value="Documentação">Documentação</SelectItem>
                            <SelectItem value="Critérios">Critérios</SelectItem>
                            <SelectItem value="Financiamento">Financiamento</SelectItem>
                            <SelectItem value="Regularização">Regularização</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="conteudo_orientacao">Conteúdo</Label>
                        <Textarea
                          id="conteudo_orientacao"
                          value={novaOrientacao.conteudo}
                          onChange={(e) => setNovaOrientacao({ ...novaOrientacao, conteudo: e.target.value })}
                          placeholder="Conteúdo detalhado da orientação"
                          rows={5}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setOrientacaoDialog(false)}>Cancelar</Button>
                      <Button onClick={handleCreateOrientacao}>Criar Orientação</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {orientacoes.map((orientacao) => (
                  <Card key={orientacao.id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-semibold text-lg">{orientacao.titulo}</h3>
                          <Badge variant="outline" className="mt-1">{orientacao.categoria}</Badge>
                        </div>
                        <div className="text-right text-sm text-gray-500">
                          <div>{orientacao.visualizacoes} visualizações</div>
                          <div>Atualizado em {new Date(orientacao.ultima_atualizacao).toLocaleDateString()}</div>
                        </div>
                      </div>
                      <p className="text-gray-700 mb-4">{orientacao.conteudo}</p>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4 mr-1" />
                          Visualizar
                        </Button>
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4 mr-1" />
                          Editar
                        </Button>
                        <Button size="sm" variant="outline">
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="fila" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Fila de Atendimento em Tempo Real</CardTitle>
              <CardDescription>Monitoramento da fila presencial e online</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-4">Atendimento Presencial</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">Senha: H001</div>
                        <div className="text-sm text-gray-600">Maria Santos - Orientação</div>
                      </div>
                      <Badge variant="default">Em Atendimento</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">Senha: H002</div>
                        <div className="text-sm text-gray-600">João Silva - Auxílio</div>
                      </div>
                      <Badge variant="secondary">Próximo</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">Senha: H003</div>
                        <div className="text-sm text-gray-600">Ana Costa - MCMV</div>
                      </div>
                      <Badge variant="outline">Aguardando</Badge>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-4">Atendimento Online</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">WhatsApp</div>
                        <div className="text-sm text-gray-600">3 conversas ativas</div>
                      </div>
                      <Badge variant="default">Ativo</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">Chat do Site</div>
                        <div className="text-sm text-gray-600">1 conversa ativa</div>
                      </div>
                      <Badge variant="default">Ativo</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">Telefone</div>
                        <div className="text-sm text-gray-600">2 chamadas em espera</div>
                      </div>
                      <Badge variant="secondary">Espera</Badge>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-blue-800">Tempo médio de espera</h4>
                    <p className="text-blue-600">Presencial: 12 min • Online: 3 min</p>
                  </div>
                  <Button variant="outline">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Atualizar
                  </Button>
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
                      <MessageSquare className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Orientação Habitacional</h3>
                      <p className="text-sm text-gray-600">Orientações gerais sobre programas habitacionais</p>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500 mb-2">Campos do formulário público:</div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>• Nome completo</div>
                    <div>• CPF</div>
                    <div>• Telefone de contato</div>
                    <div>• Situação de moradia atual</div>
                    <div>• Renda familiar</div>
                    <div>• Tipo de orientação desejada</div>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Building2 className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Educação Habitacional</h3>
                      <p className="text-sm text-gray-600">Material educativo e workshops sobre habitação</p>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500 mb-2">Campos do formulário público:</div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>• Dados pessoais</div>
                    <div>• Tema de interesse</div>
                    <div>• Modalidade (presencial/online)</div>
                    <div>• Data preferencial</div>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <User className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Apoio Habitacional</h3>
                      <p className="text-sm text-gray-600">Suporte especializado para situações específicas</p>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500 mb-2">Campos do formulário público:</div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>• Informações pessoais</div>
                    <div>• Situação habitacional</div>
                    <div>• Tipo de apoio necessário</div>
                    <div>• Urgência da situação</div>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <FileText className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Informações Habitacionais</h3>
                      <p className="text-sm text-gray-600">Consulta de informações e documentos</p>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500 mb-2">Campos do formulário público:</div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>• CPF ou protocolo</div>
                    <div>• Tipo de informação</div>
                    <div>• Justificativa da consulta</div>
                    <div>• Meio de resposta preferido</div>
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
                  permitindo que cidadãos solicitem orientações habitacionais, agendem atendimentos e recebam
                  informações educativas sobre seus direitos habitacionais de forma acessível e gratuita.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}