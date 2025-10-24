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
import { Map, MapPin, Layers, Search, Download, Upload, Eye, Edit, Trash2, Plus, Filter, FileText, Calendar, User, Building, Home, TreePine, Car, Zap, Droplets, Wifi, ChevronRight, Settings, Camera, Ruler, Target, Globe } from "lucide-react";

export default function MapaUrbanoPage() {
  useAdminAuth("admin");

  const [zonas, setZonas] = useState([
    {
      id: 1,
      nome: "Zona Residencial A",
      tipo: "Residencial",
      area: "245.8 ha",
      populacao: 12580,
      coeficiente: "1.5",
      gabarito: "12m",
      taxa_ocupacao: "60%",
      status: "Ativa",
      data_criacao: "2023-01-15",
      coordenadas: "-23.5505° S, -46.6333° W",
      observacoes: "Zona residencial consolidada com boa infraestrutura"
    },
    {
      id: 2,
      nome: "Zona Comercial Central",
      tipo: "Comercial",
      area: "89.2 ha",
      populacao: 3240,
      coeficiente: "4.0",
      gabarito: "30m",
      taxa_ocupacao: "80%",
      status: "Ativa",
      data_criacao: "2022-08-20",
      coordenadas: "-23.5489° S, -46.6388° W",
      observacoes: "Centro comercial principal da cidade"
    },
    {
      id: 3,
      nome: "Zona Industrial Norte",
      tipo: "Industrial",
      area: "512.4 ha",
      populacao: 890,
      coeficiente: "2.0",
      gabarito: "20m",
      taxa_ocupacao: "70%",
      status: "Em Revisão",
      data_criacao: "2021-03-10",
      coordenadas: "-23.5345° S, -46.6421° W",
      observacoes: "Zona industrial com potencial de expansão"
    }
  ]);

  const [loteamentos, setLoteamentos] = useState([
    {
      id: 1,
      nome: "Residencial Jardim das Flores",
      empreendedor: "Construtora Alfa Ltda",
      area_total: "18.5 ha",
      lotes: 156,
      lotes_vendidos: 98,
      aprovacao: "2023-06-15",
      situacao: "Executando",
      valor_planta: "R$ 180.000",
      infraestrutura: ["Água", "Esgoto", "Energia", "Pavimentação"],
      coordenadas: "-23.5612° S, -46.6287° W"
    },
    {
      id: 2,
      nome: "Condomínio Cidade Nova",
      empreendedor: "Urbanizadora Beta S.A.",
      area_total: "42.8 ha",
      lotes: 284,
      lotes_vendidos: 201,
      aprovacao: "2022-11-08",
      situacao: "Finalizado",
      valor_planta: "R$ 220.000",
      infraestrutura: ["Água", "Esgoto", "Energia", "Pavimentação", "Iluminação"],
      coordenadas: "-23.5578° S, -46.6445° W"
    }
  ]);

  const [certidoes, setCertidoes] = useState([
    {
      id: 1,
      numero: "CZ-2024-001234",
      tipo: "Certidão de Zoneamento",
      endereco: "Rua das Palmeiras, 456",
      zona: "Zona Residencial A",
      solicitante: "João Silva Santos",
      data_emissao: "2024-01-15",
      status: "Emitida",
      validade: "2025-01-15",
      taxa: "R$ 45,00"
    },
    {
      id: 2,
      numero: "IL-2024-002187",
      tipo: "Informações do Lote",
      endereco: "Av. Central, 789",
      zona: "Zona Comercial Central",
      solicitante: "Maria Oliveira Ltda",
      data_emissao: "2024-01-10",
      status: "Processando",
      validade: "2025-01-10",
      taxa: "R$ 65,00"
    },
    {
      id: 3,
      numero: "PV-2024-000891",
      tipo: "Planta de Valores",
      endereco: "Rua Industrial, 123",
      zona: "Zona Industrial Norte",
      solicitante: "Indústria Tech Corp",
      data_emissao: "2024-01-08",
      status: "Emitida",
      validade: "2025-01-08",
      taxa: "R$ 85,00"
    }
  ]);

  const [filtroZona, setFiltroZona] = useState("");
  const [filtroTipo, setFiltroTipo] = useState("");
  const [busca, setBusca] = useState("");

  const [zonaDialog, setZonaDialog] = useState(false);
  const [loteamentoDialog, setLoteamentoDialog] = useState(false);
  const [certidaoDialog, setCertidaoDialog] = useState(false);

  const [novaZona, setNovaZona] = useState({
    nome: "",
    tipo: "",
    area: "",
    coeficiente: "",
    gabarito: "",
    taxa_ocupacao: "",
    coordenadas: "",
    observacoes: ""
  });

  const [novoLoteamento, setNovoLoteamento] = useState({
    nome: "",
    empreendedor: "",
    area_total: "",
    lotes: "",
    coordenadas: "",
    infraestrutura: []
  });

  const [novaCertidao, setNovaCertidao] = useState({
    tipo: "",
    endereco: "",
    zona: "",
    solicitante: "",
    taxa: ""
  });

  const dataZoneamento = [
    { nome: "Residencial", quantidade: 18, cor: "#22C55E" },
    { nome: "Comercial", quantidade: 12, cor: "#3B82F6" },
    { nome: "Industrial", quantidade: 8, cor: "#F59E0B" },
    { nome: "Mista", quantidade: 15, cor: "#8B5CF6" },
    { nome: "Institucional", quantidade: 6, cor: "#EF4444" },
    { nome: "Preservação", quantidade: 4, cor: "#10B981" }
  ];

  const dataEvolucao = [
    { mes: "Jul", novas_zonas: 2, revisoes: 1, certidoes: 45 },
    { mes: "Ago", novas_zonas: 1, revisoes: 3, certidoes: 52 },
    { mes: "Set", novas_zonas: 4, revisoes: 2, certidoes: 38 },
    { mes: "Out", novas_zonas: 3, revisoes: 1, certidoes: 61 },
    { mes: "Nov", novas_zonas: 2, revisoes: 4, certidoes: 49 },
    { mes: "Dez", novas_zonas: 1, revisoes: 2, certidoes: 55 }
  ];

  const dataInfraestrutura = [
    { tipo: "Pavimentação", cobertura: 78 },
    { tipo: "Rede Elétrica", cobertura: 92 },
    { tipo: "Água Potável", cobertura: 87 },
    { tipo: "Esgoto", cobertura: 65 },
    { tipo: "Iluminação", cobertura: 71 },
    { tipo: "Internet", cobertura: 83 }
  ];

  const zonasFiltradas = zonas.filter(zona => {
    const matchesBusca = zona.nome.toLowerCase().includes(busca.toLowerCase()) ||
                        zona.tipo.toLowerCase().includes(busca.toLowerCase());
    const matchesTipo = filtroTipo === "" || zona.tipo === filtroTipo;
    return matchesBusca && matchesTipo;
  });

  const getStatusBadge = (status: string) => {
    const variants: { [key: string]: "default" | "secondary" | "destructive" | "outline" } = {
      "Ativa": "default",
      "Em Revisão": "secondary",
      "Emitida": "default",
      "Processando": "outline",
      "Executando": "secondary",
      "Finalizado": "default"
    };
    return <Badge variant={variants[status] || "outline"}>{status}</Badge>;
  };

  const handleCreateZona = () => {
    const zona = {
      id: zonas.length + 1,
      ...novaZona,
      populacao: 0,
      status: "Ativa",
      data_criacao: new Date().toISOString().split('T')[0]
    };
    setZonas([...zonas, zona]);
    setNovaZona({ nome: "", tipo: "", area: "", coeficiente: "", gabarito: "", taxa_ocupacao: "", coordenadas: "", observacoes: "" });
    setZonaDialog(false);
  };

  const handleCreateCertidao = () => {
    const certidao = {
      id: certidoes.length + 1,
      numero: `${novaCertidao.tipo.substring(0,2).toUpperCase()}-2024-${String(Math.floor(Math.random() * 900000) + 100000)}`,
      ...novaCertidao,
      data_emissao: new Date().toISOString().split('T')[0],
      status: "Processando",
      validade: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    };
    setCertidoes([...certidoes, certidao]);
    setNovaCertidao({ tipo: "", endereco: "", zona: "", solicitante: "", taxa: "" });
    setCertidaoDialog(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Map className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Mapa Urbano</h1>
            <p className="text-gray-600">Visualização territorial do planejamento municipal, zoneamento e loteamentos</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Zonas Cadastradas</CardTitle>
              <Layers className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">63</div>
              <p className="text-xs text-muted-foreground">+2 este mês</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Loteamentos Ativos</CardTitle>
              <Building className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">28</div>
              <p className="text-xs text-muted-foreground">5 em execução</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Certidões Emitidas</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">342</div>
              <p className="text-xs text-muted-foreground">55 este mês</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Área Mapeada</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1.847 km²</div>
              <p className="text-xs text-muted-foreground">100% do território</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Distribuição de Zoneamento</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={dataZoneamento}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="quantidade"
                  >
                    {dataZoneamento.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.cor} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-2 gap-2 mt-4">
                {dataZoneamento.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.cor }}></div>
                    <span className="text-xs text-gray-600">{item.nome}: {item.quantidade}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Evolução Mensal</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={dataEvolucao}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mes" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="novas_zonas" stroke="#3B82F6" name="Novas Zonas" />
                  <Line type="monotone" dataKey="certidoes" stroke="#10B981" name="Certidões" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Cobertura de Infraestrutura</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dataInfraestrutura.map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">{item.tipo}</span>
                    <span className="text-sm text-gray-500">{item.cobertura}%</span>
                  </div>
                  <Progress value={item.cobertura} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="zoneamento" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="zoneamento">Zoneamento</TabsTrigger>
          <TabsTrigger value="loteamentos">Loteamentos</TabsTrigger>
          <TabsTrigger value="certidoes">Certidões</TabsTrigger>
          <TabsTrigger value="servicos">Serviços Gerados</TabsTrigger>
        </TabsList>

        <TabsContent value="zoneamento" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Gestão de Zoneamento</CardTitle>
                  <CardDescription>Gerenciamento de zonas urbanas e parâmetros urbanísticos</CardDescription>
                </div>
                <Dialog open={zonaDialog} onOpenChange={setZonaDialog}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Nova Zona
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Cadastrar Nova Zona</DialogTitle>
                      <DialogDescription>Defina os parâmetros da nova zona urbana</DialogDescription>
                    </DialogHeader>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="nome">Nome da Zona</Label>
                        <Input
                          id="nome"
                          value={novaZona.nome}
                          onChange={(e) => setNovaZona({ ...novaZona, nome: e.target.value })}
                          placeholder="Ex: Zona Residencial B"
                        />
                      </div>
                      <div>
                        <Label htmlFor="tipo">Tipo</Label>
                        <Select value={novaZona.tipo} onValueChange={(value) => setNovaZona({ ...novaZona, tipo: value })}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o tipo" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Residencial">Residencial</SelectItem>
                            <SelectItem value="Comercial">Comercial</SelectItem>
                            <SelectItem value="Industrial">Industrial</SelectItem>
                            <SelectItem value="Mista">Mista</SelectItem>
                            <SelectItem value="Institucional">Institucional</SelectItem>
                            <SelectItem value="Preservação">Preservação</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="area">Área (ha)</Label>
                        <Input
                          id="area"
                          value={novaZona.area}
                          onChange={(e) => setNovaZona({ ...novaZona, area: e.target.value })}
                          placeholder="Ex: 150.5"
                        />
                      </div>
                      <div>
                        <Label htmlFor="coeficiente">Coeficiente de Aproveitamento</Label>
                        <Input
                          id="coeficiente"
                          value={novaZona.coeficiente}
                          onChange={(e) => setNovaZona({ ...novaZona, coeficiente: e.target.value })}
                          placeholder="Ex: 2.0"
                        />
                      </div>
                      <div>
                        <Label htmlFor="gabarito">Gabarito Máximo</Label>
                        <Input
                          id="gabarito"
                          value={novaZona.gabarito}
                          onChange={(e) => setNovaZona({ ...novaZona, gabarito: e.target.value })}
                          placeholder="Ex: 15m"
                        />
                      </div>
                      <div>
                        <Label htmlFor="taxa">Taxa de Ocupação</Label>
                        <Input
                          id="taxa"
                          value={novaZona.taxa_ocupacao}
                          onChange={(e) => setNovaZona({ ...novaZona, taxa_ocupacao: e.target.value })}
                          placeholder="Ex: 70%"
                        />
                      </div>
                      <div className="col-span-2">
                        <Label htmlFor="coordenadas">Coordenadas</Label>
                        <Input
                          id="coordenadas"
                          value={novaZona.coordenadas}
                          onChange={(e) => setNovaZona({ ...novaZona, coordenadas: e.target.value })}
                          placeholder="Ex: -23.5505° S, -46.6333° W"
                        />
                      </div>
                      <div className="col-span-2">
                        <Label htmlFor="observacoes">Observações</Label>
                        <Textarea
                          id="observacoes"
                          value={novaZona.observacoes}
                          onChange={(e) => setNovaZona({ ...novaZona, observacoes: e.target.value })}
                          placeholder="Observações adicionais sobre a zona"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setZonaDialog(false)}>Cancelar</Button>
                      <Button onClick={handleCreateZona}>Cadastrar Zona</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 mb-4">
                <div className="flex-1">
                  <Input
                    placeholder="Buscar zonas..."
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
                    <SelectItem value="Residencial">Residencial</SelectItem>
                    <SelectItem value="Comercial">Comercial</SelectItem>
                    <SelectItem value="Industrial">Industrial</SelectItem>
                    <SelectItem value="Mista">Mista</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Exportar
                </Button>
              </div>

              <div className="border rounded-lg overflow-hidden">
                <div className="grid grid-cols-8 gap-4 p-4 bg-gray-50 font-medium text-sm">
                  <div>Nome da Zona</div>
                  <div>Tipo</div>
                  <div>Área</div>
                  <div>População</div>
                  <div>Coef. Aprov.</div>
                  <div>Status</div>
                  <div>Data Criação</div>
                  <div>Ações</div>
                </div>
                <div className="divide-y">
                  {zonasFiltradas.map((zona) => (
                    <div key={zona.id} className="grid grid-cols-8 gap-4 p-4 items-center">
                      <div className="font-medium">{zona.nome}</div>
                      <div>{zona.tipo}</div>
                      <div>{zona.area}</div>
                      <div>{zona.populacao.toLocaleString()}</div>
                      <div>{zona.coeficiente}</div>
                      <div>{getStatusBadge(zona.status)}</div>
                      <div>{new Date(zona.data_criacao).toLocaleDateString()}</div>
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

        <TabsContent value="loteamentos" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Loteamentos Cadastrados</CardTitle>
                  <CardDescription>Gerenciamento de loteamentos aprovados e em execução</CardDescription>
                </div>
                <Dialog open={loteamentoDialog} onOpenChange={setLoteamentoDialog}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Novo Loteamento
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Cadastrar Novo Loteamento</DialogTitle>
                      <DialogDescription>Registre um novo loteamento no sistema</DialogDescription>
                    </DialogHeader>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-2">
                        <Label htmlFor="nome_loteamento">Nome do Loteamento</Label>
                        <Input
                          id="nome_loteamento"
                          value={novoLoteamento.nome}
                          onChange={(e) => setNovoLoteamento({ ...novoLoteamento, nome: e.target.value })}
                          placeholder="Ex: Residencial Vila Nova"
                        />
                      </div>
                      <div className="col-span-2">
                        <Label htmlFor="empreendedor">Empreendedor</Label>
                        <Input
                          id="empreendedor"
                          value={novoLoteamento.empreendedor}
                          onChange={(e) => setNovoLoteamento({ ...novoLoteamento, empreendedor: e.target.value })}
                          placeholder="Nome da empresa ou pessoa responsável"
                        />
                      </div>
                      <div>
                        <Label htmlFor="area_total">Área Total</Label>
                        <Input
                          id="area_total"
                          value={novoLoteamento.area_total}
                          onChange={(e) => setNovoLoteamento({ ...novoLoteamento, area_total: e.target.value })}
                          placeholder="Ex: 25.8 ha"
                        />
                      </div>
                      <div>
                        <Label htmlFor="lotes_qtd">Quantidade de Lotes</Label>
                        <Input
                          id="lotes_qtd"
                          value={novoLoteamento.lotes}
                          onChange={(e) => setNovoLoteamento({ ...novoLoteamento, lotes: e.target.value })}
                          placeholder="Ex: 180"
                        />
                      </div>
                      <div className="col-span-2">
                        <Label htmlFor="coordenadas_loteamento">Coordenadas</Label>
                        <Input
                          id="coordenadas_loteamento"
                          value={novoLoteamento.coordenadas}
                          onChange={(e) => setNovoLoteamento({ ...novoLoteamento, coordenadas: e.target.value })}
                          placeholder="Ex: -23.5612° S, -46.6287° W"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setLoteamentoDialog(false)}>Cancelar</Button>
                      <Button onClick={() => setLoteamentoDialog(false)}>Cadastrar Loteamento</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {loteamentos.map((loteamento) => (
                  <Card key={loteamento.id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-semibold">{loteamento.nome}</h3>
                          <p className="text-gray-600">{loteamento.empreendedor}</p>
                        </div>
                        <div className="text-right">
                          {getStatusBadge(loteamento.situacao)}
                          <div className="text-sm text-gray-500 mt-1">
                            Aprovado em {new Date(loteamento.aprovacao).toLocaleDateString()}
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <div className="text-sm text-gray-500">Área Total</div>
                          <div className="font-medium">{loteamento.area_total}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Lotes</div>
                          <div className="font-medium">{loteamento.lotes_vendidos}/{loteamento.lotes}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Valor m² Planta</div>
                          <div className="font-medium">{loteamento.valor_planta}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Progresso</div>
                          <div className="font-medium">{Math.round((loteamento.lotes_vendidos / loteamento.lotes) * 100)}%</div>
                        </div>
                      </div>

                      <div className="mb-4">
                        <div className="text-sm text-gray-500 mb-2">Infraestrutura</div>
                        <div className="flex flex-wrap gap-2">
                          {loteamento.infraestrutura.map((item, index) => (
                            <Badge key={index} variant="outline">{item}</Badge>
                          ))}
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <div className="text-sm text-gray-500">
                          <MapPin className="h-4 w-4 inline mr-1" />
                          {loteamento.coordenadas}
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4 mr-1" />
                            Visualizar
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

        <TabsContent value="certidoes" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Certidões e Documentos</CardTitle>
                  <CardDescription>Emissão de certidões de zoneamento, informações de lote e plantas de valores</CardDescription>
                </div>
                <Dialog open={certidaoDialog} onOpenChange={setCertidaoDialog}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Nova Certidão
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Solicitar Nova Certidão</DialogTitle>
                      <DialogDescription>Preencha os dados para emissão da certidão</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="tipo_certidao">Tipo de Certidão</Label>
                        <Select value={novaCertidao.tipo} onValueChange={(value) => setNovaCertidao({ ...novaCertidao, tipo: value })}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o tipo" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Certidão de Zoneamento">Certidão de Zoneamento</SelectItem>
                            <SelectItem value="Informações do Lote">Informações do Lote</SelectItem>
                            <SelectItem value="Planta de Valores">Planta de Valores</SelectItem>
                            <SelectItem value="Mapa da Cidade">Mapa da Cidade</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="endereco_certidao">Endereço</Label>
                        <Input
                          id="endereco_certidao"
                          value={novaCertidao.endereco}
                          onChange={(e) => setNovaCertidao({ ...novaCertidao, endereco: e.target.value })}
                          placeholder="Endereço completo do imóvel"
                        />
                      </div>
                      <div>
                        <Label htmlFor="zona_certidao">Zona</Label>
                        <Select value={novaCertidao.zona} onValueChange={(value) => setNovaCertidao({ ...novaCertidao, zona: value })}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione a zona" />
                          </SelectTrigger>
                          <SelectContent>
                            {zonas.map((zona) => (
                              <SelectItem key={zona.id} value={zona.nome}>{zona.nome}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="solicitante_certidao">Solicitante</Label>
                        <Input
                          id="solicitante_certidao"
                          value={novaCertidao.solicitante}
                          onChange={(e) => setNovaCertidao({ ...novaCertidao, solicitante: e.target.value })}
                          placeholder="Nome do solicitante"
                        />
                      </div>
                      <div>
                        <Label htmlFor="taxa_certidao">Taxa</Label>
                        <Input
                          id="taxa_certidao"
                          value={novaCertidao.taxa}
                          onChange={(e) => setNovaCertidao({ ...novaCertidao, taxa: e.target.value })}
                          placeholder="Ex: R$ 45,00"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setCertidaoDialog(false)}>Cancelar</Button>
                      <Button onClick={handleCreateCertidao}>Solicitar Certidão</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg overflow-hidden">
                <div className="grid grid-cols-7 gap-4 p-4 bg-gray-50 font-medium text-sm">
                  <div>Número</div>
                  <div>Tipo</div>
                  <div>Endereço</div>
                  <div>Solicitante</div>
                  <div>Status</div>
                  <div>Validade</div>
                  <div>Ações</div>
                </div>
                <div className="divide-y">
                  {certidoes.map((certidao) => (
                    <div key={certidao.id} className="grid grid-cols-7 gap-4 p-4 items-center">
                      <div className="font-mono text-sm">{certidao.numero}</div>
                      <div>{certidao.tipo}</div>
                      <div className="truncate">{certidao.endereco}</div>
                      <div>{certidao.solicitante}</div>
                      <div>{getStatusBadge(certidao.status)}</div>
                      <div>{new Date(certidao.validade).toLocaleDateString()}</div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
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
                      <FileText className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Certidão de Zoneamento</h3>
                      <p className="text-sm text-gray-600">Documento que informa a zona urbana de um imóvel</p>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500 mb-2">Campos do formulário público:</div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>• Endereço completo do imóvel</div>
                    <div>• CPF/CNPJ do solicitante</div>
                    <div>• Número da matrícula (opcional)</div>
                    <div>• Finalidade da certidão</div>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Home className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Informações do Lote</h3>
                      <p className="text-sm text-gray-600">Dados técnicos e urbanísticos do lote</p>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500 mb-2">Campos do formulário público:</div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>• Endereço ou coordenadas</div>
                    <div>• Número do lote</div>
                    <div>• Quadra</div>
                    <div>• Dados do proprietário</div>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Globe className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Mapa da Cidade</h3>
                      <p className="text-sm text-gray-600">Acesso ao mapa interativo com zoneamento</p>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500 mb-2">Campos do formulário público:</div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>• Tipo de consulta</div>
                    <div>• Região de interesse</div>
                    <div>• Layers desejadas</div>
                    <div>• Formato de download</div>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <Ruler className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Planta de Valores</h3>
                      <p className="text-sm text-gray-600">Consulta de valores venais e dados fiscais</p>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500 mb-2">Campos do formulário público:</div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>• Endereço do imóvel</div>
                    <div>• Tipo de imóvel</div>
                    <div>• Ano base da consulta</div>
                    <div>• Tipo de valor (venal/mercado)</div>
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
                  permitindo que cidadãos solicitem certidões, consultem mapas e acessem informações urbanísticas
                  diretamente pelo portal municipal.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}