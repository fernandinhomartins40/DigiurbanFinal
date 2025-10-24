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
import { UserPlus, Users, FileText, Calendar, CheckCircle, Clock, AlertTriangle, TrendingUp, Plus, Search, Filter, Download, Eye, Edit, Trash2, Settings, Building, CreditCard, MapPin, Zap } from "lucide-react";

export default function InscricoesHabitacaoPage() {
  useAdminAuth("admin");

  const [inscricoes, setInscricoes] = useState([
    {
      id: 1,
      numero_inscricao: "INS-2024-001234",
      nome: "Maria Silva Santos",
      cpf: "123.456.789-00",
      telefone: "(11) 98765-4321",
      email: "maria.silva@email.com",
      programa: "Casa Verde e Amarela",
      renda_familiar: 2800,
      numero_familia: 4,
      situacao_moradia: "Aluguel",
      data_inscricao: "2024-01-15",
      status: "Análise Socioeconômica",
      pontuacao: 78,
      posicao_fila: 45,
      documentos_ok: true,
      visita_realizada: false,
      observacoes: "Família com 2 filhos menores, primeira habitação"
    },
    {
      id: 2,
      numero_inscricao: "INS-2024-001567",
      nome: "João Oliveira Costa",
      cpf: "987.654.321-00",
      telefone: "(11) 94567-8901",
      email: "joao.oliveira@email.com",
      programa: "Habitação Social Municipal",
      renda_familiar: 1200,
      numero_familia: 3,
      situacao_moradia: "Casa de parentes",
      data_inscricao: "2024-01-12",
      status: "Aprovado",
      pontuacao: 92,
      posicao_fila: 12,
      documentos_ok: true,
      visita_realizada: true,
      observacoes: "Situação de vulnerabilidade social"
    },
    {
      id: 3,
      numero_inscricao: "INS-2024-001890",
      nome: "Ana Fernandes Lima",
      cpf: "456.789.123-00",
      telefone: "(11) 91234-5678",
      email: "ana.fernandes@email.com",
      programa: "Minha Casa Minha Vida",
      renda_familiar: 3200,
      numero_familia: 2,
      situacao_moradia: "Aluguel",
      data_inscricao: "2024-01-10",
      status: "Pendente Documentação",
      pontuacao: 65,
      posicao_fila: 89,
      documentos_ok: false,
      visita_realizada: false,
      observacoes: "Faltam documentos de renda"
    }
  ]);

  const [criterios, setCriterios] = useState([
    {
      id: 1,
      nome: "Renda Familiar",
      descricao: "Até 3 salários mínimos",
      pontos_max: 30,
      obrigatorio: true
    },
    {
      id: 2,
      nome: "Situação de Moradia",
      descricao: "Não possui casa própria",
      pontos_max: 25,
      obrigatorio: true
    },
    {
      id: 3,
      nome: "Tempo de Residência",
      descricao: "Mínimo 2 anos no município",
      pontos_max: 20,
      obrigatorio: true
    },
    {
      id: 4,
      nome: "Composição Familiar",
      descricao: "Famílias com crianças/idosos",
      pontos_max: 15,
      obrigatorio: false
    },
    {
      id: 5,
      nome: "Situação Especial",
      descricao: "Deficiência, vulnerabilidade",
      pontos_max: 10,
      obrigatorio: false
    }
  ]);

  const [filtroPrograma, setFiltroPrograma] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("");
  const [busca, setBusca] = useState("");

  const [inscricaoDialog, setInscricaoDialog] = useState(false);
  const [criterioDialog, setCriterioDialog] = useState(false);

  const [novaInscricao, setNovaInscricao] = useState({
    nome: "",
    cpf: "",
    telefone: "",
    email: "",
    programa: "",
    renda_familiar: "",
    numero_familia: "",
    situacao_moradia: "",
    observacoes: ""
  });

  const [novoCriterio, setNovoCriterio] = useState({
    nome: "",
    descricao: "",
    pontos_max: "",
    obrigatorio: false
  });

  const dataEstatisticas = [
    { mes: "Jul", inscricoes: 89, aprovados: 23, rejeitados: 12 },
    { mes: "Ago", inscricoes: 156, aprovados: 31, rejeitados: 18 },
    { mes: "Set", inscricoes: 134, aprovados: 28, rejeitados: 15 },
    { mes: "Out", inscricoes: 178, aprovados: 35, rejeitados: 22 },
    { mes: "Nov", inscricoes: 145, aprovados: 29, rejeitados: 19 },
    { mes: "Dez", inscricoes: 198, aprovados: 42, rejeitados: 24 }
  ];

  const dataDistribuicaoProgramas = [
    { programa: "Casa Verde e Amarela", inscricoes: 287, cor: "#3B82F6" },
    { programa: "Habitação Social Municipal", inscricoes: 156, cor: "#10B981" },
    { programa: "Minha Casa Minha Vida", inscricoes: 234, cor: "#F59E0B" },
    { programa: "Auxílio Habitacional", inscricoes: 89, cor: "#EF4444" },
    { programa: "Regularização Fundiária", inscricoes: 123, cor: "#8B5CF6" }
  ];

  const dataRendaFamiliar = [
    { faixa: "Até 1 SM", quantidade: 234, porcentagem: 26 },
    { faixa: "1-2 SM", quantidade: 356, porcentagem: 40 },
    { faixa: "2-3 SM", quantidade: 198, porcentagem: 22 },
    { faixa: "3-4 SM", quantidade: 89, porcentagem: 10 },
    { faixa: "Acima 4 SM", quantidade: 23, porcentagem: 2 }
  ];

  const inscricoesFiltradas = inscricoes.filter(inscricao => {
    const matchesBusca = inscricao.nome.toLowerCase().includes(busca.toLowerCase()) ||
                        inscricao.numero_inscricao.toLowerCase().includes(busca.toLowerCase()) ||
                        inscricao.cpf.includes(busca);
    const matchesPrograma = filtroPrograma === "" || inscricao.programa === filtroPrograma;
    const matchesStatus = filtroStatus === "" || inscricao.status === filtroStatus;
    return matchesBusca && matchesPrograma && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const variants: { [key: string]: "default" | "secondary" | "destructive" | "outline" } = {
      "Análise Socioeconômica": "secondary",
      "Aprovado": "default",
      "Pendente Documentação": "outline",
      "Rejeitado": "destructive",
      "Aguardando Visita": "secondary",
      "Lista de Espera": "outline"
    };
    return <Badge variant={variants[status] || "outline"}>{status}</Badge>;
  };

  const getPontuacaoColor = (pontuacao: number) => {
    if (pontuacao >= 80) return "text-green-600";
    if (pontuacao >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const handleCreateInscricao = () => {
    const inscricao = {
      id: inscricoes.length + 1,
      numero_inscricao: `INS-2024-${String(Math.floor(Math.random() * 900000) + 100000)}`,
      ...novaInscricao,
      renda_familiar: parseInt(novaInscricao.renda_familiar),
      numero_familia: parseInt(novaInscricao.numero_familia),
      data_inscricao: new Date().toISOString().split('T')[0],
      status: "Pendente Documentação",
      pontuacao: 0,
      posicao_fila: inscricoes.length + 1,
      documentos_ok: false,
      visita_realizada: false
    };
    setInscricoes([...inscricoes, inscricao]);
    setNovaInscricao({
      nome: "",
      cpf: "",
      telefone: "",
      email: "",
      programa: "",
      renda_familiar: "",
      numero_familia: "",
      situacao_moradia: "",
      observacoes: ""
    });
    setInscricaoDialog(false);
  };

  const handleCreateCriterio = () => {
    const criterio = {
      id: criterios.length + 1,
      ...novoCriterio,
      pontos_max: parseInt(novoCriterio.pontos_max)
    };
    setCriterios([...criterios, criterio]);
    setNovoCriterio({ nome: "", descricao: "", pontos_max: "", obrigatorio: false });
    setCriterioDialog(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-green-100 rounded-lg">
            <UserPlus className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Inscrições Habitacionais</h1>
            <p className="text-gray-600">Sistema de cadastro para programas habitacionais, critérios e documentação</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Inscrições</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1.089</div>
              <p className="text-xs text-muted-foreground">+198 este mês</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Aprovados</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">208</div>
              <p className="text-xs text-muted-foreground">19% taxa aprovação</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Em Análise</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">345</div>
              <p className="text-xs text-muted-foreground">Tempo médio: 15 dias</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Lista de Espera</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">536</div>
              <p className="text-xs text-muted-foreground">Posições ativas</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Evolução de Inscrições</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={dataEstatisticas}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mes" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="inscricoes" stroke="#3B82F6" name="Inscrições" />
                  <Line type="monotone" dataKey="aprovados" stroke="#10B981" name="Aprovados" />
                  <Line type="monotone" dataKey="rejeitados" stroke="#EF4444" name="Rejeitados" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Distribuição por Programa</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={dataDistribuicaoProgramas}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="inscricoes"
                  >
                    {dataDistribuicaoProgramas.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.cor} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-1 gap-2 mt-4">
                {dataDistribuicaoProgramas.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.cor }}></div>
                    <span className="text-xs text-gray-600">{item.programa}: {item.inscricoes}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Perfil Socioeconômico dos Inscritos</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={dataRendaFamiliar}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="faixa" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="quantidade" fill="#8B5CF6" name="Famílias" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="inscricoes" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="inscricoes">Inscrições</TabsTrigger>
          <TabsTrigger value="criterios">Critérios</TabsTrigger>
          <TabsTrigger value="documentacao">Documentação</TabsTrigger>
          <TabsTrigger value="servicos">Serviços Gerados</TabsTrigger>
        </TabsList>

        <TabsContent value="inscricoes" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Gestão de Inscrições</CardTitle>
                  <CardDescription>Controle de inscrições nos programas habitacionais</CardDescription>
                </div>
                <Dialog open={inscricaoDialog} onOpenChange={setInscricaoDialog}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Nova Inscrição
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Registrar Nova Inscrição</DialogTitle>
                      <DialogDescription>Cadastre uma nova inscrição nos programas habitacionais</DialogDescription>
                    </DialogHeader>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="nome">Nome Completo</Label>
                        <Input
                          id="nome"
                          value={novaInscricao.nome}
                          onChange={(e) => setNovaInscricao({ ...novaInscricao, nome: e.target.value })}
                          placeholder="Nome completo do requerente"
                        />
                      </div>
                      <div>
                        <Label htmlFor="cpf">CPF</Label>
                        <Input
                          id="cpf"
                          value={novaInscricao.cpf}
                          onChange={(e) => setNovaInscricao({ ...novaInscricao, cpf: e.target.value })}
                          placeholder="000.000.000-00"
                        />
                      </div>
                      <div>
                        <Label htmlFor="telefone">Telefone</Label>
                        <Input
                          id="telefone"
                          value={novaInscricao.telefone}
                          onChange={(e) => setNovaInscricao({ ...novaInscricao, telefone: e.target.value })}
                          placeholder="(00) 00000-0000"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={novaInscricao.email}
                          onChange={(e) => setNovaInscricao({ ...novaInscricao, email: e.target.value })}
                          placeholder="email@exemplo.com"
                        />
                      </div>
                      <div>
                        <Label htmlFor="programa">Programa Habitacional</Label>
                        <Select value={novaInscricao.programa} onValueChange={(value) => setNovaInscricao({ ...novaInscricao, programa: value })}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o programa" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Casa Verde e Amarela">Casa Verde e Amarela</SelectItem>
                            <SelectItem value="Habitação Social Municipal">Habitação Social Municipal</SelectItem>
                            <SelectItem value="Minha Casa Minha Vida">Minha Casa Minha Vida</SelectItem>
                            <SelectItem value="Auxílio Habitacional">Auxílio Habitacional</SelectItem>
                            <SelectItem value="Regularização Fundiária">Regularização Fundiária</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="renda_familiar">Renda Familiar (R$)</Label>
                        <Input
                          id="renda_familiar"
                          type="number"
                          value={novaInscricao.renda_familiar}
                          onChange={(e) => setNovaInscricao({ ...novaInscricao, renda_familiar: e.target.value })}
                          placeholder="0"
                        />
                      </div>
                      <div>
                        <Label htmlFor="numero_familia">Número de Pessoas na Família</Label>
                        <Input
                          id="numero_familia"
                          type="number"
                          value={novaInscricao.numero_familia}
                          onChange={(e) => setNovaInscricao({ ...novaInscricao, numero_familia: e.target.value })}
                          placeholder="0"
                        />
                      </div>
                      <div>
                        <Label htmlFor="situacao_moradia">Situação de Moradia</Label>
                        <Select value={novaInscricao.situacao_moradia} onValueChange={(value) => setNovaInscricao({ ...novaInscricao, situacao_moradia: value })}>
                          <SelectTrigger>
                            <SelectValue placeholder="Situação atual" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Aluguel">Aluguel</SelectItem>
                            <SelectItem value="Casa de parentes">Casa de parentes</SelectItem>
                            <SelectItem value="Ocupação">Ocupação</SelectItem>
                            <SelectItem value="Situação de rua">Situação de rua</SelectItem>
                            <SelectItem value="Despejo">Ameaça de despejo</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="col-span-2">
                        <Label htmlFor="observacoes">Observações</Label>
                        <Textarea
                          id="observacoes"
                          value={novaInscricao.observacoes}
                          onChange={(e) => setNovaInscricao({ ...novaInscricao, observacoes: e.target.value })}
                          placeholder="Observações adicionais sobre a inscrição"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setInscricaoDialog(false)}>Cancelar</Button>
                      <Button onClick={handleCreateInscricao}>Registrar Inscrição</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 mb-4 flex-wrap">
                <div className="flex-1 min-w-64">
                  <Input
                    placeholder="Buscar inscrições..."
                    value={busca}
                    onChange={(e) => setBusca(e.target.value)}
                    className="max-w-sm"
                  />
                </div>
                <Select value={filtroPrograma} onValueChange={setFiltroPrograma}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filtrar por programa" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todos os programas</SelectItem>
                    <SelectItem value="Casa Verde e Amarela">Casa Verde e Amarela</SelectItem>
                    <SelectItem value="Habitação Social Municipal">Habitação Social</SelectItem>
                    <SelectItem value="Minha Casa Minha Vida">MCMV</SelectItem>
                    <SelectItem value="Auxílio Habitacional">Auxílio</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filtroStatus} onValueChange={setFiltroStatus}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filtrar por status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todos os status</SelectItem>
                    <SelectItem value="Análise Socioeconômica">Em Análise</SelectItem>
                    <SelectItem value="Aprovado">Aprovado</SelectItem>
                    <SelectItem value="Pendente Documentação">Pendente</SelectItem>
                    <SelectItem value="Rejeitado">Rejeitado</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Exportar
                </Button>
              </div>

              <div className="border rounded-lg overflow-hidden">
                <div className="grid grid-cols-9 gap-4 p-4 bg-gray-50 font-medium text-sm">
                  <div>Número</div>
                  <div>Nome</div>
                  <div>Programa</div>
                  <div>Renda</div>
                  <div>Status</div>
                  <div>Pontuação</div>
                  <div>Posição</div>
                  <div>Data</div>
                  <div>Ações</div>
                </div>
                <div className="divide-y">
                  {inscricoesFiltradas.map((inscricao) => (
                    <div key={inscricao.id} className="grid grid-cols-9 gap-4 p-4 items-center">
                      <div className="font-mono text-sm">{inscricao.numero_inscricao}</div>
                      <div className="font-medium">{inscricao.nome}</div>
                      <div className="text-sm">{inscricao.programa}</div>
                      <div>R$ {inscricao.renda_familiar.toLocaleString()}</div>
                      <div>{getStatusBadge(inscricao.status)}</div>
                      <div className={`font-medium ${getPontuacaoColor(inscricao.pontuacao)}`}>
                        {inscricao.pontuacao}pts
                      </div>
                      <div>#{inscricao.posicao_fila}</div>
                      <div>{new Date(inscricao.data_inscricao).toLocaleDateString()}</div>
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

        <TabsContent value="criterios" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Critérios de Seleção</CardTitle>
                  <CardDescription>Definição de critérios e pontuação para seleção</CardDescription>
                </div>
                <Dialog open={criterioDialog} onOpenChange={setCriterioDialog}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Novo Critério
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Adicionar Critério de Seleção</DialogTitle>
                      <DialogDescription>Defina um novo critério para avaliação das inscrições</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="nome_criterio">Nome do Critério</Label>
                        <Input
                          id="nome_criterio"
                          value={novoCriterio.nome}
                          onChange={(e) => setNovoCriterio({ ...novoCriterio, nome: e.target.value })}
                          placeholder="Ex: Renda Familiar"
                        />
                      </div>
                      <div>
                        <Label htmlFor="descricao_criterio">Descrição</Label>
                        <Textarea
                          id="descricao_criterio"
                          value={novoCriterio.descricao}
                          onChange={(e) => setNovoCriterio({ ...novoCriterio, descricao: e.target.value })}
                          placeholder="Descrição detalhada do critério"
                        />
                      </div>
                      <div>
                        <Label htmlFor="pontos_max">Pontuação Máxima</Label>
                        <Input
                          id="pontos_max"
                          type="number"
                          value={novoCriterio.pontos_max}
                          onChange={(e) => setNovoCriterio({ ...novoCriterio, pontos_max: e.target.value })}
                          placeholder="0"
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="obrigatorio"
                          checked={novoCriterio.obrigatorio}
                          onChange={(e) => setNovoCriterio({ ...novoCriterio, obrigatorio: e.target.checked })}
                        />
                        <Label htmlFor="obrigatorio">Critério obrigatório</Label>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setCriterioDialog(false)}>Cancelar</Button>
                      <Button onClick={handleCreateCriterio}>Adicionar Critério</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {criterios.map((criterio) => (
                  <Card key={criterio.id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-semibold text-lg">{criterio.nome}</h3>
                          <p className="text-gray-600">{criterio.descricao}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-blue-600">{criterio.pontos_max} pts</div>
                          {criterio.obrigatorio && (
                            <Badge variant="destructive" className="mt-1">Obrigatório</Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4 mr-1" />
                          Editar
                        </Button>
                        <Button size="sm" variant="outline">
                          <Trash2 className="h-4 w-4 mr-1" />
                          Excluir
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="mt-6 p-4 bg-green-50 rounded-lg">
                <h4 className="font-medium text-green-800 mb-2">Sistema de Pontuação</h4>
                <div className="text-sm text-green-700">
                  <p>• Pontuação total máxima: 100 pontos</p>
                  <p>• Pontuação mínima para aprovação: 60 pontos</p>
                  <p>• Critérios obrigatórios devem ser atendidos independente da pontuação</p>
                  <p>• A classificação na fila é feita pela pontuação total obtida</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documentacao" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Lista de Documentos Necessários</CardTitle>
              <CardDescription>Documentação exigida para inscrição nos programas habitacionais</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-4">Documentos Obrigatórios</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 border rounded-lg">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <div>
                        <div className="font-medium">RG e CPF do requerente</div>
                        <div className="text-sm text-gray-600">Documentos de identificação válidos</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 border rounded-lg">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <div>
                        <div className="font-medium">Comprovante de renda</div>
                        <div className="text-sm text-gray-600">Últimos 3 meses de toda a família</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 border rounded-lg">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <div>
                        <div className="font-medium">Comprovante de residência</div>
                        <div className="text-sm text-gray-600">Atualizado, máximo 90 dias</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 border rounded-lg">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <div>
                        <div className="font-medium">Certidão de nascimento/casamento</div>
                        <div className="text-sm text-gray-600">De todos os membros da família</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-4">Documentos Complementares</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 border rounded-lg">
                      <FileText className="h-5 w-5 text-blue-600" />
                      <div>
                        <div className="font-medium">Declaração de não possuir imóvel</div>
                        <div className="text-sm text-gray-600">Para todos os programas</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 border rounded-lg">
                      <FileText className="h-5 w-5 text-blue-600" />
                      <div>
                        <div className="font-medium">Laudo médico (se aplicável)</div>
                        <div className="text-sm text-gray-600">Para pessoas com deficiência</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 border rounded-lg">
                      <FileText className="h-5 w-5 text-blue-600" />
                      <div>
                        <div className="font-medium">Declaração escolar</div>
                        <div className="text-sm text-gray-600">Para famílias com filhos estudantes</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 border rounded-lg">
                      <FileText className="h-5 w-5 text-blue-600" />
                      <div>
                        <div className="font-medium">CTPS ou declaração de autônomo</div>
                        <div className="text-sm text-gray-600">Comprovação de atividade laboral</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
                <h4 className="font-medium text-yellow-800 mb-2">Importante</h4>
                <div className="text-sm text-yellow-700">
                  <p>• Todos os documentos devem ser apresentados em cópia autenticada ou acompanhados do original</p>
                  <p>• Documentos em nome de terceiros devem vir acompanhados de procuração</p>
                  <p>• A documentação incompleta resultará no indeferimento da inscrição</p>
                  <p>• É obrigatória a apresentação de todos os documentos listados como obrigatórios</p>
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
                      <UserPlus className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Inscrição Casa Verde e Amarela</h3>
                      <p className="text-sm text-gray-600">Cadastro no programa federal de habitação</p>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500 mb-2">Campos do formulário público:</div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>• Dados pessoais completos</div>
                    <div>• Composição familiar</div>
                    <div>• Renda familiar detalhada</div>
                    <div>• Situação de moradia atual</div>
                    <div>• Upload de documentos</div>
                    <div>• Declarações obrigatórias</div>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Building className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Cadastro Habitacional</h3>
                      <p className="text-sm text-gray-600">Cadastro geral para programas habitacionais municipais</p>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500 mb-2">Campos do formulário público:</div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>• Identificação do requerente</div>
                    <div>• Endereço atual</div>
                    <div>• Dados socioeconômicos</div>
                    <div>• Preferência de programa</div>
                    <div>• Histórico habitacional</div>
                    <div>• Contatos de referência</div>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Clock className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Lista de Espera</h3>
                      <p className="text-sm text-gray-600">Consulta de posição na fila dos programas</p>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500 mb-2">Campos do formulário público:</div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>• CPF do inscrito</div>
                    <div>• Número da inscrição</div>
                    <div>• Programa de interesse</div>
                    <div>• Verificação de segurança</div>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <Edit className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Atualização Cadastral</h3>
                      <p className="text-sm text-gray-600">Atualização de dados de inscrições existentes</p>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500 mb-2">Campos do formulário público:</div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>• Identificação da inscrição</div>
                    <div>• Dados a serem alterados</div>
                    <div>• Justificativa da alteração</div>
                    <div>• Novos documentos (se necessário)</div>
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
                  permitindo que cidadãos se inscrevam nos programas habitacionais, consultem sua posição na fila
                  e atualizem seus dados de forma simples e transparente.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}