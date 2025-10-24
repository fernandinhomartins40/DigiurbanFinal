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
import { FileText, MapPin, Scale, Calendar, CheckCircle, Clock, AlertTriangle, Users, Building, TrendingUp, Plus, Search, Filter, Download, Eye, Edit, Upload, Settings, Stamp, Gavel, Zap } from "lucide-react";

export default function RegularizacaoFundiariaPage() {
  useAdminAuth("admin");

  const [processos, setProcessos] = useState([
    {
      id: 1,
      numero_processo: "RF-2024-001234",
      requerente: "João Silva Santos",
      cpf: "123.456.789-00",
      endereco_imovel: "Rua das Palmeiras, 456, Lote 15",
      area_terreno: "250m²",
      area_construida: "120m²",
      tipo_regularizacao: "Usucapião Administrativo",
      data_protocolo: "2024-01-15",
      status: "Análise Documental",
      etapa_atual: "Verificação de Documentos",
      progresso: 35,
      tempo_ocupacao: "18 anos",
      cartorio_competente: "1º Cartório de Registro de Imóveis",
      valor_imovel: "R$ 185.000,00",
      observacoes: "Documentação parcialmente completa",
      responsavel_tecnico: "Dra. Maria Santos"
    },
    {
      id: 2,
      numero_processo: "RF-2024-001567",
      requerente: "Ana Costa Lima",
      cpf: "987.654.321-00",
      endereco_imovel: "Av. Central, 789, Casa 8",
      area_terreno: "180m²",
      area_construida: "85m²",
      tipo_regularizacao: "Escritura Social",
      data_protocolo: "2024-01-10",
      status: "Vistoria Técnica",
      etapa_atual: "Levantamento Topográfico",
      progresso: 65,
      tempo_ocupacao: "12 anos",
      cartorio_competente: "2º Cartório de Registro de Imóveis",
      valor_imovel: "R$ 145.000,00",
      observacoes: "Aguardando laudo topográfico",
      responsavel_tecnico: "Eng. Carlos Oliveira"
    },
    {
      id: 3,
      numero_processo: "RF-2024-001890",
      requerente: "Pedro Fernandes Costa",
      cpf: "456.789.123-00",
      endereco_imovel: "Conjunto Habitacional Norte, Quadra 5, Lote 23",
      area_terreno: "200m²",
      area_construida: "95m²",
      tipo_regularizacao: "Título de Propriedade",
      data_protocolo: "2023-12-20",
      status: "Finalizado",
      etapa_atual: "Entrega de Documentos",
      progresso: 100,
      tempo_ocupacao: "25 anos",
      cartorio_competente: "1º Cartório de Registro de Imóveis",
      valor_imovel: "R$ 198.000,00",
      observacoes: "Processo concluído com sucesso",
      responsavel_tecnico: "Dra. Maria Santos"
    },
    {
      id: 4,
      numero_processo: "RF-2024-002123",
      requerente: "Lucia Oliveira Silva",
      cpf: "321.654.987-00",
      endereco_imovel: "Rua da Esperança, 321, Lote 7",
      area_terreno: "300m²",
      area_construida: "140m²",
      tipo_regularizacao: "Regularização de Imóvel",
      data_protocolo: "2024-01-25",
      status: "Pendente Documentação",
      etapa_atual: "Análise Jurídica",
      progresso: 20,
      tempo_ocupacao: "8 anos",
      cartorio_competente: "3º Cartório de Registro de Imóveis",
      valor_imovel: "R$ 215.000,00",
      observacoes: "Faltam certidões negativas",
      responsavel_tecnico: "Dr. Roberto Lima"
    }
  ]);

  const [documentos, setDocumentos] = useState([
    {
      id: 1,
      processo_numero: "RF-2024-001234",
      nome: "Planta do Imóvel",
      tipo: "Técnico",
      status: "Aprovado",
      data_upload: "2024-01-16",
      tamanho: "2.3 MB",
      formato: "PDF"
    },
    {
      id: 2,
      processo_numero: "RF-2024-001234",
      nome: "Certidão de Nascimento",
      tipo: "Pessoal",
      status: "Aprovado",
      data_upload: "2024-01-15",
      tamanho: "1.1 MB",
      formato: "PDF"
    },
    {
      id: 3,
      processo_numero: "RF-2024-001567",
      nome: "Laudo de Avaliação",
      tipo: "Técnico",
      status: "Pendente",
      data_upload: "2024-01-18",
      tamanho: "4.7 MB",
      formato: "PDF"
    }
  ]);

  const [cartorios, setCartorios] = useState([
    {
      id: 1,
      nome: "1º Cartório de Registro de Imóveis",
      endereco: "Rua Central, 123, Centro",
      telefone: "(11) 3456-7890",
      email: "registro1@cartorio.com.br",
      responsavel: "Tabelião João Silva",
      horario_funcionamento: "8h às 17h",
      processos_ativos: 47,
      taxa_base: "R$ 350,00"
    },
    {
      id: 2,
      nome: "2º Cartório de Registro de Imóveis",
      endereco: "Av. Principal, 456, Centro",
      telefone: "(11) 3789-0123",
      email: "registro2@cartorio.com.br",
      responsavel: "Tabelião Maria Costa",
      horario_funcionamento: "8h às 16h30",
      processos_ativos: 32,
      taxa_base: "R$ 380,00"
    }
  ]);

  const [filtroStatus, setFiltroStatus] = useState("");
  const [filtroTipo, setFiltroTipo] = useState("");
  const [busca, setBusca] = useState("");

  const [processoDialog, setProcessoDialog] = useState(false);
  const [documentoDialog, setDocumentoDialog] = useState(false);

  const [novoProcesso, setNovoProcesso] = useState({
    requerente: "",
    cpf: "",
    endereco_imovel: "",
    area_terreno: "",
    area_construida: "",
    tipo_regularizacao: "",
    tempo_ocupacao: "",
    cartorio_competente: "",
    valor_imovel: ""
  });

  const [novoDocumento, setNovoDocumento] = useState({
    processo_numero: "",
    nome: "",
    tipo: ""
  });

  const dataEstatisticas = [
    { mes: "Jul", protocolados: 23, finalizados: 18, pendentes: 15 },
    { mes: "Ago", protocolados: 31, finalizados: 22, pendentes: 19 },
    { mes: "Set", protocolados: 28, finalizados: 25, pendentes: 16 },
    { mes: "Out", protocolados: 35, finalizados: 29, pendentes: 22 },
    { mes: "Nov", protocolados: 29, finalizados: 31, pendentes: 18 },
    { mes: "Dez", protocolados: 42, finalizados: 35, pendentes: 24 }
  ];

  const dataStatusProcessos = [
    { status: "Análise Documental", quantidade: 34, cor: "#3B82F6" },
    { status: "Vistoria Técnica", quantidade: 28, cor: "#F59E0B" },
    { status: "Análise Jurídica", quantidade: 19, cor: "#8B5CF6" },
    { status: "Finalizado", quantidade: 45, cor: "#10B981" },
    { status: "Pendente Documentação", quantidade: 22, cor: "#EF4444" }
  ];

  const dataTiposRegularizacao = [
    { tipo: "Usucapião Administrativo", quantidade: 67, tempo_medio: 8 },
    { tipo: "Escritura Social", quantidade: 43, tempo_medio: 6 },
    { tipo: "Título de Propriedade", quantidade: 28, tempo_medio: 5 },
    { tipo: "Regularização de Imóvel", quantidade: 35, tempo_medio: 7 }
  ];

  const dataTempoOcupacao = [
    { faixa: "0-5 anos", quantidade: 23, cor: "#EF4444" },
    { faixa: "5-10 anos", quantidade: 45, cor: "#F59E0B" },
    { faixa: "10-15 anos", quantidade: 38, cor: "#3B82F6" },
    { faixa: "15-20 anos", quantidade: 31, cor: "#10B981" },
    { faixa: "Acima 20 anos", quantidade: 56, cor: "#8B5CF6" }
  ];

  const processosFiltrados = processos.filter(processo => {
    const matchesBusca = processo.requerente.toLowerCase().includes(busca.toLowerCase()) ||
                        processo.numero_processo.toLowerCase().includes(busca.toLowerCase()) ||
                        processo.endereco_imovel.toLowerCase().includes(busca.toLowerCase());
    const matchesStatus = filtroStatus === "" || processo.status === filtroStatus;
    const matchesTipo = filtroTipo === "" || processo.tipo_regularizacao === filtroTipo;
    return matchesBusca && matchesStatus && matchesTipo;
  });

  const getStatusBadge = (status: string) => {
    const variants: { [key: string]: "default" | "secondary" | "destructive" | "outline" } = {
      "Análise Documental": "secondary",
      "Vistoria Técnica": "outline",
      "Análise Jurídica": "secondary",
      "Finalizado": "default",
      "Pendente Documentação": "destructive",
      "Aprovado": "default",
      "Pendente": "outline",
      "Rejeitado": "destructive"
    };
    return <Badge variant={variants[status] || "outline"}>{status}</Badge>;
  };

  const getProgressColor = (progresso: number) => {
    if (progresso >= 80) return "bg-green-500";
    if (progresso >= 50) return "bg-blue-500";
    if (progresso >= 30) return "bg-yellow-500";
    return "bg-red-500";
  };

  const handleCreateProcesso = () => {
    const processo = {
      id: processos.length + 1,
      numero_processo: `RF-2024-${String(Math.floor(Math.random() * 900000) + 100000)}`,
      ...novoProcesso,
      data_protocolo: new Date().toISOString().split('T')[0],
      status: "Pendente Documentação",
      etapa_atual: "Protocolo Inicial",
      progresso: 10,
      observacoes: "Processo protocolado",
      responsavel_tecnico: "A definir"
    };
    setProcessos([...processos, processo]);
    setNovoProcesso({
      requerente: "",
      cpf: "",
      endereco_imovel: "",
      area_terreno: "",
      area_construida: "",
      tipo_regularizacao: "",
      tempo_ocupacao: "",
      cartorio_competente: "",
      valor_imovel: ""
    });
    setProcessoDialog(false);
  };

  const handleCreateDocumento = () => {
    const documento = {
      id: documentos.length + 1,
      ...novoDocumento,
      status: "Pendente",
      data_upload: new Date().toISOString().split('T')[0],
      tamanho: "0 KB",
      formato: "PDF"
    };
    setDocumentos([...documentos, documento]);
    setNovoDocumento({ processo_numero: "", nome: "", tipo: "" });
    setDocumentoDialog(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Scale className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Regularização Fundiária</h1>
            <p className="text-gray-600">Processos de regularização de terrenos e imóveis, documentação e registro cartorário</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Processos Ativos</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">148</div>
              <p className="text-xs text-muted-foreground">+42 este mês</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Finalizados</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">45</div>
              <p className="text-xs text-muted-foreground">30% taxa sucesso</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tempo Médio</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">6.8 meses</div>
              <p className="text-xs text-muted-foreground">Para conclusão</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Valor Regularizado</CardTitle>
              <Building className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">R$ 8,4M</div>
              <p className="text-xs text-muted-foreground">Patrimônio formalizado</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Evolução dos Processos</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={dataEstatisticas}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mes" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="protocolados" stroke="#3B82F6" name="Protocolados" />
                  <Line type="monotone" dataKey="finalizados" stroke="#10B981" name="Finalizados" />
                  <Line type="monotone" dataKey="pendentes" stroke="#F59E0B" name="Pendentes" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Status dos Processos</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={dataStatusProcessos}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="quantidade"
                  >
                    {dataStatusProcessos.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.cor} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-1 gap-2 mt-4">
                {dataStatusProcessos.map((item, index) => (
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
              <CardTitle className="text-lg">Tipos de Regularização</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={dataTiposRegularizacao}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="tipo" angle={-45} textAnchor="end" height={80} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="quantidade" fill="#8B5CF6" name="Quantidade" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Tempo de Ocupação</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dataTempoOcupacao.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: item.cor }}></div>
                      <span className="font-medium">{item.faixa}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-bold">{item.quantidade}</span>
                      <span className="text-sm text-gray-500 ml-1">casos</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Tabs defaultValue="processos" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="processos">Processos</TabsTrigger>
          <TabsTrigger value="documentos">Documentação</TabsTrigger>
          <TabsTrigger value="cartorios">Cartórios</TabsTrigger>
          <TabsTrigger value="servicos">Serviços Gerados</TabsTrigger>
        </TabsList>

        <TabsContent value="processos" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Gestão de Processos</CardTitle>
                  <CardDescription>Acompanhamento de processos de regularização fundiária</CardDescription>
                </div>
                <Dialog open={processoDialog} onOpenChange={setProcessoDialog}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Novo Processo
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Protocolar Novo Processo</DialogTitle>
                      <DialogDescription>Registre um novo processo de regularização fundiária</DialogDescription>
                    </DialogHeader>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="requerente">Nome do Requerente</Label>
                        <Input
                          id="requerente"
                          value={novoProcesso.requerente}
                          onChange={(e) => setNovoProcesso({ ...novoProcesso, requerente: e.target.value })}
                          placeholder="Nome completo"
                        />
                      </div>
                      <div>
                        <Label htmlFor="cpf_processo">CPF</Label>
                        <Input
                          id="cpf_processo"
                          value={novoProcesso.cpf}
                          onChange={(e) => setNovoProcesso({ ...novoProcesso, cpf: e.target.value })}
                          placeholder="000.000.000-00"
                        />
                      </div>
                      <div className="col-span-2">
                        <Label htmlFor="endereco_imovel">Endereço do Imóvel</Label>
                        <Input
                          id="endereco_imovel"
                          value={novoProcesso.endereco_imovel}
                          onChange={(e) => setNovoProcesso({ ...novoProcesso, endereco_imovel: e.target.value })}
                          placeholder="Endereço completo do imóvel a regularizar"
                        />
                      </div>
                      <div>
                        <Label htmlFor="area_terreno">Área do Terreno</Label>
                        <Input
                          id="area_terreno"
                          value={novoProcesso.area_terreno}
                          onChange={(e) => setNovoProcesso({ ...novoProcesso, area_terreno: e.target.value })}
                          placeholder="Ex: 250m²"
                        />
                      </div>
                      <div>
                        <Label htmlFor="area_construida">Área Construída</Label>
                        <Input
                          id="area_construida"
                          value={novoProcesso.area_construida}
                          onChange={(e) => setNovoProcesso({ ...novoProcesso, area_construida: e.target.value })}
                          placeholder="Ex: 120m²"
                        />
                      </div>
                      <div>
                        <Label htmlFor="tipo_regularizacao">Tipo de Regularização</Label>
                        <Select value={novoProcesso.tipo_regularizacao} onValueChange={(value) => setNovoProcesso({ ...novoProcesso, tipo_regularizacao: value })}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o tipo" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Usucapião Administrativo">Usucapião Administrativo</SelectItem>
                            <SelectItem value="Escritura Social">Escritura Social</SelectItem>
                            <SelectItem value="Título de Propriedade">Título de Propriedade</SelectItem>
                            <SelectItem value="Regularização de Imóvel">Regularização de Imóvel</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="tempo_ocupacao">Tempo de Ocupação</Label>
                        <Input
                          id="tempo_ocupacao"
                          value={novoProcesso.tempo_ocupacao}
                          onChange={(e) => setNovoProcesso({ ...novoProcesso, tempo_ocupacao: e.target.value })}
                          placeholder="Ex: 15 anos"
                        />
                      </div>
                      <div>
                        <Label htmlFor="cartorio_competente">Cartório Competente</Label>
                        <Select value={novoProcesso.cartorio_competente} onValueChange={(value) => setNovoProcesso({ ...novoProcesso, cartorio_competente: value })}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o cartório" />
                          </SelectTrigger>
                          <SelectContent>
                            {cartorios.map((cartorio) => (
                              <SelectItem key={cartorio.id} value={cartorio.nome}>{cartorio.nome}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="valor_imovel">Valor do Imóvel</Label>
                        <Input
                          id="valor_imovel"
                          value={novoProcesso.valor_imovel}
                          onChange={(e) => setNovoProcesso({ ...novoProcesso, valor_imovel: e.target.value })}
                          placeholder="Ex: R$ 185.000,00"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setProcessoDialog(false)}>Cancelar</Button>
                      <Button onClick={handleCreateProcesso}>Protocolar Processo</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 mb-4 flex-wrap">
                <div className="flex-1 min-w-64">
                  <Input
                    placeholder="Buscar processos..."
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
                    <SelectItem value="Análise Documental">Análise Documental</SelectItem>
                    <SelectItem value="Vistoria Técnica">Vistoria Técnica</SelectItem>
                    <SelectItem value="Análise Jurídica">Análise Jurídica</SelectItem>
                    <SelectItem value="Finalizado">Finalizado</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filtroTipo} onValueChange={setFiltroTipo}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filtrar por tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todos os tipos</SelectItem>
                    <SelectItem value="Usucapião Administrativo">Usucapião</SelectItem>
                    <SelectItem value="Escritura Social">Escritura Social</SelectItem>
                    <SelectItem value="Título de Propriedade">Título</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Exportar
                </Button>
              </div>

              <div className="grid gap-4">
                {processosFiltrados.map((processo) => (
                  <Card key={processo.id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-semibold">{processo.numero_processo}</h3>
                          <p className="text-gray-600">{processo.requerente} • CPF: {processo.cpf}</p>
                          <p className="text-sm text-gray-500">{processo.endereco_imovel}</p>
                        </div>
                        <div className="text-right space-y-1">
                          {getStatusBadge(processo.status)}
                          <div className="text-sm text-gray-500">{processo.tipo_regularizacao}</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <div className="text-sm text-gray-500">Protocolo</div>
                          <div className="font-medium">{new Date(processo.data_protocolo).toLocaleDateString()}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Tempo Ocupação</div>
                          <div className="font-medium">{processo.tempo_ocupacao}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Área Total</div>
                          <div className="font-medium">{processo.area_terreno}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Valor</div>
                          <div className="font-medium">{processo.valor_imovel}</div>
                        </div>
                      </div>

                      <div className="mb-4">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Progresso do Processo</span>
                          <span>{processo.progresso}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${getProgressColor(processo.progresso)}`}
                            style={{ width: `${processo.progresso}%` }}
                          ></div>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">Etapa atual: {processo.etapa_atual}</div>
                      </div>

                      <div className="mb-4">
                        <div className="text-sm text-gray-500 mb-1">Responsável Técnico</div>
                        <div className="font-medium">{processo.responsavel_tecnico}</div>
                      </div>

                      <div className="flex justify-between items-center">
                        <div className="text-sm text-gray-500">
                          Cartório: {processo.cartorio_competente}
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
                            <Upload className="h-4 w-4 mr-1" />
                            Documentos
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

        <TabsContent value="documentos" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Gestão de Documentos</CardTitle>
                  <CardDescription>Controle de documentação dos processos de regularização</CardDescription>
                </div>
                <Dialog open={documentoDialog} onOpenChange={setDocumentoDialog}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Novo Documento
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Anexar Documento</DialogTitle>
                      <DialogDescription>Faça upload de um novo documento para o processo</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="processo_documento">Número do Processo</Label>
                        <Select value={novoDocumento.processo_numero} onValueChange={(value) => setNovoDocumento({ ...novoDocumento, processo_numero: value })}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o processo" />
                          </SelectTrigger>
                          <SelectContent>
                            {processos.map((processo) => (
                              <SelectItem key={processo.id} value={processo.numero_processo}>{processo.numero_processo} - {processo.requerente}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="nome_documento">Nome do Documento</Label>
                        <Input
                          id="nome_documento"
                          value={novoDocumento.nome}
                          onChange={(e) => setNovoDocumento({ ...novoDocumento, nome: e.target.value })}
                          placeholder="Ex: Certidão de Nascimento"
                        />
                      </div>
                      <div>
                        <Label htmlFor="tipo_documento">Tipo de Documento</Label>
                        <Select value={novoDocumento.tipo} onValueChange={(value) => setNovoDocumento({ ...novoDocumento, tipo: value })}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o tipo" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Pessoal">Pessoal</SelectItem>
                            <SelectItem value="Técnico">Técnico</SelectItem>
                            <SelectItem value="Jurídico">Jurídico</SelectItem>
                            <SelectItem value="Cartorário">Cartorário</SelectItem>
                            <SelectItem value="Fiscal">Fiscal</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="arquivo">Arquivo</Label>
                        <Input
                          id="arquivo"
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setDocumentoDialog(false)}>Cancelar</Button>
                      <Button onClick={handleCreateDocumento}>Anexar Documento</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg overflow-hidden">
                <div className="grid grid-cols-7 gap-4 p-4 bg-gray-50 font-medium text-sm">
                  <div>Processo</div>
                  <div>Nome do Documento</div>
                  <div>Tipo</div>
                  <div>Status</div>
                  <div>Data Upload</div>
                  <div>Tamanho</div>
                  <div>Ações</div>
                </div>
                <div className="divide-y">
                  {documentos.map((documento) => (
                    <div key={documento.id} className="grid grid-cols-7 gap-4 p-4 items-center">
                      <div className="font-mono text-sm">{documento.processo_numero}</div>
                      <div className="font-medium">{documento.nome}</div>
                      <div><Badge variant="outline">{documento.tipo}</Badge></div>
                      <div>{getStatusBadge(documento.status)}</div>
                      <div>{new Date(documento.data_upload).toLocaleDateString()}</div>
                      <div>{documento.tamanho}</div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
                <h4 className="font-medium text-yellow-800 mb-2">Documentos Obrigatórios</h4>
                <div className="text-sm text-yellow-700 grid grid-cols-2 gap-2">
                  <div>• RG e CPF do requerente</div>
                  <div>• Comprovante de residência</div>
                  <div>• Certidão de nascimento/casamento</div>
                  <div>• Planta do imóvel</div>
                  <div>• Laudo de avaliação</div>
                  <div>• Certidões negativas</div>
                  <div>• Comprovantes de posse</div>
                  <div>• Memorial descritivo</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cartorios" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Cartórios Competentes</CardTitle>
              <CardDescription>Informações dos cartórios de registro de imóveis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {cartorios.map((cartorio) => (
                  <Card key={cartorio.id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-semibold">{cartorio.nome}</h3>
                          <p className="text-gray-600">{cartorio.responsavel}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-green-600">{cartorio.taxa_base}</div>
                          <div className="text-sm text-gray-500">Taxa base</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <div className="text-sm text-gray-500">Endereço</div>
                          <div className="font-medium">{cartorio.endereco}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Telefone</div>
                          <div className="font-medium">{cartorio.telefone}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Horário</div>
                          <div className="font-medium">{cartorio.horario_funcionamento}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Email</div>
                          <div className="font-medium">{cartorio.email}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Processos Ativos</div>
                          <div className="font-medium">{cartorio.processos_ativos}</div>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <MapPin className="h-4 w-4 mr-1" />
                          Localização
                        </Button>
                        <Button size="sm" variant="outline">
                          <Stamp className="h-4 w-4 mr-1" />
                          Tabela de Custos
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
                      <FileText className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Regularização de Imóvel</h3>
                      <p className="text-sm text-gray-600">Processo completo de regularização fundiária</p>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500 mb-2">Campos do formulário público:</div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>• Dados pessoais completos</div>
                    <div>• Endereço do imóvel</div>
                    <div>• Tempo de ocupação</div>
                    <div>• Área do terreno e construída</div>
                    <div>• Tipo de regularização</div>
                    <div>• Upload de documentos</div>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Gavel className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Escritura Social</h3>
                      <p className="text-sm text-gray-600">Obtenção de escritura social gratuita</p>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500 mb-2">Campos do formulário público:</div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>• Identificação do solicitante</div>
                    <div>• Documentos do imóvel</div>
                    <div>• Comprovação de renda</div>
                    <div>• Certidões negativas</div>
                    <div>• Declaração de posse</div>
                    <div>• Plantas e laudos técnicos</div>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Scale className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Usucapião Administrativo</h3>
                      <p className="text-sm text-gray-600">Processo administrativo de usucapião</p>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500 mb-2">Campos do formulário público:</div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>• Dados do requerente</div>
                    <div>• Descrição do imóvel</div>
                    <div>• Tempo de posse</div>
                    <div>• Prova de ocupação</div>
                    <div>• Testemunhas</div>
                    <div>• Documentação técnica</div>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <Stamp className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Título de Propriedade</h3>
                      <p className="text-sm text-gray-600">Emissão de título definitivo de propriedade</p>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500 mb-2">Campos do formulário público:</div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>• Identificação do proprietário</div>
                    <div>• Localização do imóvel</div>
                    <div>• Documentos de aquisição</div>
                    <div>• Histórico de transmissões</div>
                    <div>• Quitação de débitos</div>
                    <div>• Aprovação do projeto</div>
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
                  permitindo que cidadãos solicitem regularização de seus imóveis, acompanhem processos e obtenham
                  documentação oficial de forma digital e transparente, com integração direta aos cartórios competentes.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}